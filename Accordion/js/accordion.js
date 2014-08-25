(function($) {
	"use strict";
	/**
	 * Accordion module implementation.
	 * https://git.namics.com/snippets/2
	 *
	 * @author marcd <marc.diethelm@namics.com>
	 * @namespace Tc.Module
	 * @class Accordion
	 * @extends Tc.Module
	 */
	Tc.Module.Accordion = Tc.Module.extend({

		selectors: {
			head: '.js-hd',
			body: '.js-bd'
		},

		init: function($ctx, sandbox, modId) {
			this._super($ctx, sandbox, modId);
			this.bindAll(
				'onClickHead'
			);

			this.state = false;
		},

		on: function(callback) {
			this.$(this.selectors.head).on('click', this.onClickHead);
			callback();
		},

		after: function() {},

		onClickHead: function(ev) {
			ev.preventDefault();
			//this.toggleState();
		},

		toggleState: function(state) {
			if (typeof state === 'undefined') {
				state = this.state;
			}

			this.$ctx
				.toggleClass('state-open', !state)
				.toggleClass('state-closed', state)
			;
			this.state = !state;
		}

	});
}(Tc.$));
