(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-button-group')) :
	typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-button-group'], factory) :
	(global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-button-group']));
}(this, function (exports, polytheneReactBase, polytheneCoreButtonGroup) { 'use strict';

	// @ts-check
	var ButtonGroup = polytheneReactBase.ComponentCreator(polytheneCoreButtonGroup.coreButtonGroup);
	ButtonGroup["displayName"] = "ButtonGroup";

	exports.ButtonGroup = ButtonGroup;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-button-group.js.map
