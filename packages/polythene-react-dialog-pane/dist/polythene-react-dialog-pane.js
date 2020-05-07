(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-dialog-pane')) :
	typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-dialog-pane'], factory) :
	(global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-dialog-pane']));
}(this, function (exports, polytheneReactBase, polytheneCoreDialogPane) { 'use strict';

	// @ts-check
	var DialogPane = polytheneReactBase.ComponentCreator(polytheneCoreDialogPane.coreDialogPane);
	DialogPane["displayName"] = "DialogPane";

	exports.DialogPane = DialogPane;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-dialog-pane.js.map
