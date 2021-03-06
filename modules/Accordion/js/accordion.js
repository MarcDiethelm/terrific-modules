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
			section: '.js-section',
			head: '.js-hd a',
			body: '.js-bd'
		},

		init: function($ctx, sandbox, modId) {
			this._super($ctx, sandbox, modId);
			this.model = {}; // set model per module instance
			this.bindAll(
				'onClickHead'
			);

			// `data-mode=exclusive` - (default) only one section open at a time
			// `data-mode=independent` - sections open and close independently
			this.mode = this.$ctx.data('mode') || 'exclusive';
			this.populateModel();
		},

		on: function (callback) {
			this.$ctx.on('click', this.selectors.head, this.onClickHead);
			callback();
		},

		after: function() {},


		//////////////////////////////////////////////////////////////////
		// EVENT HANDLERS

		onClickHead: function(ev) {
			ev.preventDefault();
			var id = $(ev.currentTarget).closest(this.selectors.section).data('section-id');
			this.setState(id);
		},


		//////////////////////////////////////////////////////////////////
		// METHODS

		setState: function(evSectionId) {
			var id;

			if ('independent' === this.mode) {
				this.toggleSectionState(evSectionId);
			}
			else {
				for (id in this.model) {
					if (!this.model.hasOwnProperty(id)) continue;

					if (id !== evSectionId) {
						// close other section if open
						if (this.model[id].state) {
							this.toggleSectionState(id);
						}
					}
					// toggle clicked section
					else {
						this.toggleSectionState(id);
					}
				}
			}
		},

		toggleSectionState: function(sectionId) {
			var section, state;

			section = this.model[sectionId];
			section.state = !section.state;
			$(section.el).toggleClass('state-open', section.state);

			return section.state;
		},

		populateModel: function() {
			var aSections = this.$(this.selectors.section).get();
			var i, id, section, $section;

			for (i = 0; i < aSections.length; i++) {
				section = aSections[i];
				$section = $(section);
				id = $section.find('.js-bd')[0].id;
				this.model[id] = {
					 el: section
					,state: $(section).is('.state-open')
				};
				// make lookups easy for future interactions
				$section.data('section-id', id);
			}
		}

	});
}(Tc.$));
