(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-textfield')) :
	typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-textfield'], factory) :
	(global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-textfield']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreTextfield) { 'use strict';

	// @ts-check
	var TextField = polytheneMithrilBase.ComponentCreator(polytheneCoreTextfield.coreTextField);
	TextField["displayName"] = "TextField";

	exports.TextField = TextField;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-textfield.js.map
