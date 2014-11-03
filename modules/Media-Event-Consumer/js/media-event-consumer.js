(function($) {
	/**
	 * MediaEventConsumer module implementation.
	 *
	 * This module is mostly here as an example of how to consume media events. The example subject is an adaptive images implementation.
	 *
	 * @author Marc Diethelm
	 * @namespace Tc.Module
	 * @class MediaEventConsumer
	 * @extends Tc.Module
	 */
	Tc.Module.MediaEventConsumer = Tc.Module.extend({

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
			this.subscribe('media');
			this.viewport = 'small'; // todo: make generic using a global config
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

		onViewportChange: function (data) {
			var viewport = this.viewport = data.query.name;

			switch (viewport) {
				case 'small':
					// this.doStuff()
					break;
				case 'medium':
				case 'large':
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
