(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-slider')) :
	typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-slider'], factory) :
	(global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-slider']));
}(this, function (exports, polytheneReactBase, polytheneCoreSlider) { 'use strict';

	// @ts-check
	var Slider = polytheneReactBase.ComponentCreator(polytheneCoreSlider.coreSlider);
	Slider["displayName"] = "Slider";

	exports.Slider = Slider;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-slider.js.map
