/* API reference: https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/v2.1
 *
 * This module is intended to be used as an almost logic-only module, although some parameters can be set on the minimal
 * provided markup. Other modules will interact with this module as needed using the Terrific connector channel `facebookAuth`.
 * This module will "fire" the following events:
 * facebookAuth, data: {Object} - contains an expiresIn property
 * facebookDeAuth, data: {Object} - contains an expiresIn property
 * facebookAuthError, data: {Object} - some error data
 * facebookUserProfile, data: {Object} - user profile data
 *
 * The module listens to the following "events" on the `facebookAuth` channel
 *
 * requireAuthorization - will throw if the user is already logged in. use try/catch
 * requireDeAuthorization - will throw if the user is already logged out. use try/catch
 *
 * Example code for connections in other modules:

		//////////////////////////////////////////////////////////////////
		// CONNECTOR CALLBACKS [channel: facebookAuth]

		onFacebookAuth: function(data) {
			var expiresIn = data.expiresIn;
		},

		onFacebookDeAuth: function() {
		},

		onFacebookUserProfile: function(data) {
			console.dir(data);
		},


		//////////////////////////////////////////////////////////////////
		// EVENT HANDLERS

		onClickFacebookAuth: function(ev) {
			ev.preventDefault();
			try {
				// will throw if already logged in
				this.fire('requireAuthorization', {}, ['facebookAuth']);
			}
			catch (e) {
				console && console.debug(e.message);
			}
		},

		onClickFacebookDeAuth: function(ev) {
			ev.preventDefault();
			try {
				// will throw if already logged out
				this.fire('requireDeauthorization', {}, ['facebookAuth']);
			}
			catch (e) {
				console && console.debug(e.message);
			}
		}
 *
 */

(function ($) {
	"use strict";

	// Set some defaults for all module instances. (In case there is more than one.)
	var appId; // set here or in markup
	var redirectUri = location.protocol + '//' + location.host + location.pathname;  // set here or in markup [can't use location.href because after roundtrip this can include queries]
	var responseType = 'token'; // best for client-side auth
	var dialogUriTpl = 'https://www.facebook.com/dialog/oauth?client_id={{=appId}}&redirect_uri={{=redirectUri}}&response_type={{=responseType}}';
	// used to get the user id, which is necessary for almost everything else, incl. deauthorization
	var userProfileUriTpl = 'https://graph.facebook.com/v{{=apiVersion}}/me?access_token={{=accessToken}}';
	var deauthorizeUriTpl = 'https://graph.facebook.com/v{{=apiVersion}}/{{=userId}}/permissions?access_token={{=accessToken}}';

	 // this information is shared for all potential instances of this module.
	var isLoggedIn = false;
	var accessToken; // specified by facebook redirect url params after auth request roundtrip
	var apiVersion = '2.1';
	var userProfile = null; // requested after auth request/redirect roundtrip was successful


	/**
	 * FacebookAuth module implementation.
	 *
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @namespace Tc.Module
	 * @class FacebookAuth
	 * @extends Tc.Module
	 */
	Tc.Module.FacebookAuth = Tc.Module.extend({

		/**
		 * Initializes the FacebookAuth module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
		init: function ($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
			this
				.bindAll(
					'onClickAuthorization',
					'onClickDeAuthorization',
					'onResponseUserProfile',
					'onResponseDeauthorize'
				)
				.subscribe('facebookAuth')
			;

			// populate/override defaults with data from markup
			this.appId = appId || this.$ctx.data('app-id');
			this.redirectUri = redirectUri || this.$ctx.data('redirect-uri');
			this.responseType = responseType;


			///////// AFTER AUTH REDIRECT ////////
			// todo: refactor to a proper method
			// if returning from facebook login we will have a query string added by facebook on the (redirect) URI

			if (window.location.search) {
				var query = this.parseQueryString(window.location.search);

				if (query.error) {
					console && console.debug('some kind of auth fail occurred. reason: %s', query.error_reason);
					this.fire('facebookAuthError', query, ['facebookAuth']);
				}
			}

			if (window.location.hash) {
				var hash = this.parseQueryString(window.location.hash);

				// (this is the actual loggedin test)
				if (hash.access_token) { // 'token' assumes that responseType is 'token'
					isLoggedIn = true;
					console && console.info('fb authorized user');
					accessToken = hash.access_token;
					this.fire('facebookAuth', { expiresIn: hash.expires_in }, ['facebookAuth']);
					this.requestUserProfile();

					// clean up uri
					if ('undefined' !== history.replaceState) {
						history.replaceState(history.state, document.title, window.location.pathname);
					}
				}
			}

		},

		/**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
		on: function (callback) {
			// normally auth will be triggered from modules with real markup using a Terrific connector
			// these listeners are mostly for dev purposes
			this.$('.js-fb-auth-start').on('click', this.onClickAuthorization);
			this.$('.js-fb-deauth-start').on('click', this.onClickDeAuthorization);
			callback();
		},

		after: function () {},


		//////////////////////////////////////////////////////////////////
		// CONNECTOR CALLBACKS [channel: facebookAuth]

		onRequireAuthorization: function(data) {
			this.requestAuthorizationDialog(data);
		},

		onRequireDeauthorization: function(data) {
			this.requestDeauthorization(data);
		},


		//////////////////////////////////////////////////////////////////
		// EVENT HANDLERS

		// only used if there is a '.js-fb-auth-start' element in the module (dev)
		onClickAuthorization: function(ev) {
			ev.preventDefault();
			this.requestAuthorizationDialog({ action: 'authorize'/*, appId: '762830550440944'*/ }); // mock invocation with test appId
		},

		// only used if there is a '.js-fb-auth-start' element in the module (dev)
		onClickDeAuthorization: function(ev) {
			ev.preventDefault();
			this.requestDeauthorization({ action: 'deauthorize'/*, appId: '762830550440944'*/ }); // mock invocation with test appId
		},

		onResponseUserProfile: function(err, data, xhr, textStatus) {
			if (err) {
				console.error(textStatus, err); // todo: better logging
				return;
			}
			userProfile = data;
			console && console.info('got fb user profile');
			this.fire('facebookUserProfile', data, ['facebookAuth']);
		},

		onResponseDeauthorize: function(err, data, xhr, textStatus) {
			if (err) {
				console.error(textStatus, err); // todo: better logging
				return;
			}

			if (data.success) {
				isLoggedIn = false;
				accessToken = null;
				userProfile = null;
				console && console.info('fb deauthorized user');
				this.fire('facebookDeAuth', {}, ['facebookAuth']);
			}
		},


		//////////////////////////////////////////////////////////////////
		// METHODS

		requestAuthorizationDialog: function(data) {
			if (isLoggedIn) {
				throw(new Error('already logged in'));
			}
			// for now we just unload the page by navigating to the facebook login uri
			// later we might do some cooler stuff using an iframe, so the user doesn't have to leave and reload the page.
			// once the user returns to our redirect uri, facebook will add some params to the uri. we will need to parse those.
			window.location.href = this.template(dialogUriTpl, {
				appId: data.appId || this.appId,
				redirectUri: data.redirectUri || this.redirectUri,
				responseType: data.responseType || this.responseType
			});
		},

		requestUserProfile: function() {
			if (!isLoggedIn) {
				throw(new Error('need to be logged in'));
			}
			var uri = this.template(userProfileUriTpl, {
				apiVersion: apiVersion,
				accessToken: accessToken
			});

			$.get(uri)
				.done(this.normalizeAjaxCallbacks('done'))
				.fail(this.normalizeAjaxCallbacks('fail'))
				.callback = this.onResponseUserProfile
			;
		},

		requestDeauthorization: function() {
			if (!isLoggedIn) {
				throw(new Error('already logged out'));
			}

			var uri = this.template(deauthorizeUriTpl, { // not precompiling this, on purpose. no optimization needed for logout.
				apiVersion: apiVersion,
				userId: userProfile.id,
				accessToken: accessToken
			});

			$.ajax(uri, {
					type: 'DELETE',
					crossDomain: true
				})
				.done(this.normalizeAjaxCallbacks('done'))
				.fail(this.normalizeAjaxCallbacks('fail'))
				.callback = this.onResponseDeauthorize
			;
		},

		/**
		 * Invoke callback using a consistent signature: err, data, xhr, textStatus
		 * @param type
		 * @param callback
		 */
		normalizeAjaxCallbacks: function(type) { // todo: refactor to "Utils"?
			if ('done' === type) { // incoming params: data, textStatus, jqXHR
				return function() { var args = arguments; args[2].callback(null, args[0], args[2], args[1]) };
			}
			else if ('fail' === type) { // incoming params: jqXHR, textStatus, errorThrown
				var data = arguments[0].responseJSON || null;
				return function () { var args = arguments; args[0].callback(args[2], data, args[0], args[1]) };
			}
		},

		/*!
			query-string
			Parse URL query strings
			https://github.com/sindresorhus/query-string
			by Sindre Sorhus
			MIT License
		*/
		parseQueryString: function(str) { // todo: refactor to "Utils"?
			if (typeof str !== 'string') {
				return {};
			}

			str = str.trim().replace(/^(\?|#)/, '');

			if (!str) {
				return {};
			}

			return str.trim().split('&').reduce(function (ret, param) {
				var parts = param.replace(/\+/g, ' ').split('=');
				var key = parts[0];
				var val = parts[1];

				key = decodeURIComponent(key);
				// missing `=` should be `null`:
				// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
				val = val === undefined ? null : decodeURIComponent(val);

				if (!ret.hasOwnProperty(key)) {
					ret[key] = val;
				} else if (Array.isArray(ret[key])) {
					ret[key].push(val);
				} else {
					ret[key] = [ret[key], val];
				}

				return ret;
			}, {});
		}
	});
})(Tc.$);
