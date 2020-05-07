(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-textfield')) :
	typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-textfield'], factory) :
	(global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-textfield']));
}(this, function (exports, polytheneReactBase, polytheneCoreTextfield) { 'use strict';

	// @ts-check
	var TextField = polytheneReactBase.ComponentCreator(polytheneCoreTextfield.coreTextField);
	TextField["displayName"] = "TextField";

	exports.TextField = TextField;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-textfield.js.map
