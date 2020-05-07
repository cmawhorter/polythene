(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-dialog-pane')) :
	typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-dialog-pane'], factory) :
	(global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-dialog-pane']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreDialogPane) { 'use strict';

	// @ts-check
	var DialogPane = polytheneMithrilBase.ComponentCreator(polytheneCoreDialogPane.coreDialogPane);
	DialogPane["displayName"] = "DialogPane";

	exports.DialogPane = DialogPane;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-dialog-pane.js.map
