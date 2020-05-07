(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-svg')) :
	typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-svg'], factory) :
	(global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-svg']));
}(this, function (exports, polytheneReactBase, polytheneCoreSvg) { 'use strict';

	// @ts-check
	var SVG = polytheneReactBase.ComponentCreator(polytheneCoreSvg.coreSVG);
	SVG["displayName"] = "SVG";

	exports.SVG = SVG;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-svg.js.map
