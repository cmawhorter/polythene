(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-button-group')) :
	typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-button-group'], factory) :
	(global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-button-group']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreButtonGroup) { 'use strict';

	// @ts-check
	var ButtonGroup = polytheneMithrilBase.ComponentCreator(polytheneCoreButtonGroup.coreButtonGroup);
	ButtonGroup["displayName"] = "ButtonGroup";

	exports.ButtonGroup = ButtonGroup;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-button-group.js.map
