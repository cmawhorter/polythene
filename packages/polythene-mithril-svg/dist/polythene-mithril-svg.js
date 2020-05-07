(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-svg')) :
	typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-svg'], factory) :
	(global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-svg']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreSvg) { 'use strict';

	// @ts-check
	var SVG = polytheneMithrilBase.ComponentCreator(polytheneCoreSvg.coreSVG);
	SVG["displayName"] = "SVG";

	exports.SVG = SVG;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-svg.js.map
