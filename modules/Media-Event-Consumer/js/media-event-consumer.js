(function($) {
	/**
	 * MediaEventConsumer module implementation.
	 *
	 * This module is mostly here as an example of how to consume media events. The example subject is an adaptive images implementation.
	 * see Media-Event's Readme.md for documentation
	 *
	 * @author Marc Diethelm
	 * @namespace Tc.Module
	 * @class MediaEventConsumer
	 * @extends Tc.Module
	 */
	Tc.Module.MediaEventConsumer = Tc.Module.extend({

		viewport: null, // todo: make generic using a global config

		selectors: {
			imageContainer: '.js-adaptive-image'
		},

		/**
		 * Initializes the MediaEventConsumer module.
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
			this.subscribe('matchMedia');
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
		},


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// CONNECTOR CALLBACKS

		/**
		 * Media-Event's Readme.md for documentation
		 * @param data
		 */
		onViewportChange: function(data) {
			var viewport = data.query.name;

			// conditional matching: distinguish between "setup" and "match", and only execute per viewport match/change.
			if ('setup' === data.state) {
				//log('init viewport state')
			}
			else if (this.viewport !== viewport) {
				//log('update viewport state')
			}
			this.viewport = viewport;

			// dumb matching: executes for "setup" and "match", may execute twice per viewport match/change.
			switch (viewport) {
				case 'small':
					// this.doStuff()
					break;
				case 'medium':
				case 'large':
				case 'x-large':
					this.loadAdaptiveImages(this.$ctx);
					break;
			}
		},


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// EVENT HANDLERS


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// METHODS

		/**
		 *
		 * @param $context
		 */
		loadAdaptiveImages: function($context) {
			var $container;
			var imageUri;
			var image;

			$container = $context.find(this.selectors.imageContainer);
			image = $container.find('img')[0];

			if (!image && $container.length) {
				imageUri = $container.data('image-uri');
				image = new Image();
				image.className = 'adaptive-image';
				image.src = imageUri;
				image.alt = $container.data('image-alt');
				$container.html(image);
			}
		}
	});
})(Tc.$);
