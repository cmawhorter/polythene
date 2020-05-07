(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-core-css'), require('polythene-css-selection-control')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-core-css', 'polythene-css-selection-control'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-core-css'], global['polythene-css-selection-control']));
}(this, function (exports, polytheneCoreCss, polytheneCssSelectionControl) { 'use strict';

  var classes = {
    component: "pe-checkbox-control"
  };

  // @ts-check
  var color = polytheneCoreCss.createColor({
    superColor: polytheneCssSelectionControl.color
  });

  // @ts-check
  var layout = polytheneCoreCss.createLayout({
    superLayout: polytheneCssSelectionControl.layout
  });

  // @ts-check

  /**
   * @typedef {import("../index").CheckboxVars} CheckboxVars
   */

  /**
   * @type {CheckboxVars} checkboxVars
   */
  var checkboxVars = {
    /**
     * Generate general styles, not defined by variables
     */
    general_styles: true
  };

  // @ts-check
  var fns = [layout, color];
  var selector = ".".concat(classes.component);
  var addStyle = polytheneCoreCss.styler.createAddStyle(selector, fns, checkboxVars);
  var getStyle = polytheneCoreCss.styler.createGetStyle(selector, fns, checkboxVars);
  polytheneCoreCss.styler.addStyle({
    selectors: [selector],
    fns: fns,
    vars: checkboxVars
  });

  exports.addStyle = addStyle;
  exports.getStyle = getStyle;
  exports.color = color;
  exports.layout = layout;
  exports.vars = checkboxVars;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-css-checkbox.js.map
