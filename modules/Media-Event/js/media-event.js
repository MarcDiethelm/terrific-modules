(function($) {
	/**
	 * MediaEvent module implementation.
	 *
	 * see Readme.md for documentation
	 *
	 * @author Marc Diethelm
	 * @namespace Tc.Module
	 * @class MediaEvent
	 * @extends Tc.Module
	 */
	Tc.Module.MediaEvent = Tc.Module.extend({

		enquire: window.enquire,

		/*
		Breakpoint definition
		This could be also defined in a file and dynamically inserted during build (e.g. Grunt)
		 */
		breakPoints: [
		// em based media queries
			40,
			65,
			90
		],

		/**
		 * Initializes the MediaEvent module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
		init: function($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
			this
				.bindAll(
					'onViewportMatch'
				)
				// subscribe module to terrific channel "media"
				.subscribe('matchMedia')
			;

			var breakPoints = this.breakPoints;

			/*
			Media query definition
			(This is an interesting candidate for automation via a Grunt plugin)
			 */
			this.queries = [
				{
					name: 'small',
					string: '(max-width: ' + breakPoints[0] + 'em)'
				},
				{
					name: 'medium',
					string: '(min-width: ' + (breakPoints[0] + 0.01) + 'em) and (max-width: ' + breakPoints[1] + 'em)'
				},
				{
					name: 'large',
					string: '(min-width: ' + (breakPoints[1] + 0.01) + 'em) and (max-width: ' + breakPoints[2] + 'em)'
				},
				{
					name: 'x-large',
					string: '(min-width: ' + (breakPoints[2] + 0.01) + 'em)'
				}
			];

			/*
			Pixel-based queries. not recommended
			 */
			/*media.queries = [
				{
					name: 'small',
					string: '(max-width: ' + breakPoints[0] + 'px)'
				},
				{
					name: 'medium',
					string: '(min-width: ' + (breakPoints[0] + 1) + 'px) and (max-width: ' + breakPoints[1] + 'px)'
				},
				{
					name: 'large',
					string: '(min-width: ' + (breakPoints[1] + 1) + 'px) and (max-width: ' + breakPoints[2] + 'px)'
				},
				{
					name: 'x-large',
					string: '(min-width: ' + (breakPoints[2] + 1) + 'px)'
				}
			];*/
		},

		/**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
		on: function(callback) {
			callback();
		},

		/**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
		after: function() {

			var i = 0;

			// register queries here so they can only trigger after all the modules are set up
			if (typeof this.enquire === 'undefined') throw new ReferenceError(this.getName() +': unmet dependency enquire.js');

			for (; i < this.queries.length; i++) {
				this.registerQuery(this.queries[i]);
			}

		},

		registerQuery: function (query) {
			var _this = this;

			// use enquire to trigger viewport changes on terrific channel "media"
			this.enquire.register(query.string, {
				setup: function() {
					_this.onViewportMatch(query, 'setup');
				},
				match: function() {
					//log(query.name)
					_this.onViewportMatch(query, 'match');
				},
				deferSetup: true
			});
		},

		onViewportMatch: function (query, state) {
			console.info('viewport is: %s', query.name); // development only
			this.fire('viewportChange', {query: query, state: state}, ['matchMedia']);
		}
	});
})(Tc.$);
