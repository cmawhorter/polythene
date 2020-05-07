(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-core-css'), require('polythene-css-selection-control')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-core-css', 'polythene-css-selection-control'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-core-css'], global['polythene-css-selection-control']));
}(this, function (exports, polytheneCoreCss, polytheneCssSelectionControl) { 'use strict';

  var classes = {
    component: "pe-radio-control"
  };

  // @ts-check
  var color = polytheneCoreCss.createColor({
    superColor: polytheneCssSelectionControl.color
  });

  // @ts-check
  var varFns = {
    general_styles: function general_styles() {
      return {
        " .pe-radio-group": {
          display: "flex"
        }
      };
    }
  };
  var layout = polytheneCoreCss.createLayout({
    varFns: varFns,
    superLayout: polytheneCssSelectionControl.layout
  });

  // @ts-check

  /**
   * @typedef {import("../index").RadioButtonVars} RadioButtonVars
   */

  /**
   * @type {RadioButtonVars} radioButtonVars
   */
  var radioButtonVars = {
    /**
     * Generate general styles, not defined by variables
     */
    general_styles: true
  };

  // @ts-check
  var fns = [layout, color];
  var selector = ".".concat(classes.component);
  var addStyle = polytheneCoreCss.styler.createAddStyle(selector, fns, radioButtonVars);
  var getStyle = polytheneCoreCss.styler.createGetStyle(selector, fns, radioButtonVars);
  polytheneCoreCss.styler.addStyle({
    selectors: [selector],
    fns: fns,
    vars: radioButtonVars
  });

  exports.addStyle = addStyle;
  exports.getStyle = getStyle;
  exports.color = color;
  exports.layout = layout;
  exports.vars = radioButtonVars;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-css-radio-button.js.map
