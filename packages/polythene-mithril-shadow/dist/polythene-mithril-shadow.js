(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-shadow')) :
	typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-shadow'], factory) :
	(global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-shadow']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreShadow) { 'use strict';

	// @ts-check
	var Shadow = polytheneMithrilBase.ComponentCreator(polytheneCoreShadow.coreShadow);
	Shadow["displayName"] = "Shadow";

	exports.Shadow = Shadow;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-shadow.js.map
