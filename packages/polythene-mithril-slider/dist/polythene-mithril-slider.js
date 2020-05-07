(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-slider')) :
	typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-slider'], factory) :
	(global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-slider']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreSlider) { 'use strict';

	// @ts-check
	var Slider = polytheneMithrilBase.ComponentCreator(polytheneCoreSlider.coreSlider);
	Slider["displayName"] = "Slider";

	exports.Slider = Slider;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-slider.js.map
