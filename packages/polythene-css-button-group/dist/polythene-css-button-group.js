(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-core-css')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-core-css'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-core-css']));
}(this, function (exports, polytheneCoreCss) { 'use strict';

  var classes = {
    component: "pe-button-group"
  };

  // @ts-check
  var varFns = {
    /**
     * @param {string} selector
     */
    general_styles: function general_styles(selector) {
      return [polytheneCoreCss.sel(selector, {
        display: "flex"
      })];
    }
  };
  var layout = polytheneCoreCss.createLayout({
    varFns: varFns
  });

  // @ts-check

  /**
   * @typedef {import("../index").ButtonGroupVars} ButtonGroupVars
   */

  /**
   * @type {ButtonGroupVars} buttonGroupVars
   */
  var buttonGroupVars = {
    /**
     * Generate general styles, not defined by variables
     */
    general_styles: true
  };

  // @ts-check
  var fns = [layout];
  var selector = ".".concat(classes.component);
  var addStyle = polytheneCoreCss.styler.createAddStyle(selector, fns, buttonGroupVars);
  var getStyle = polytheneCoreCss.styler.createGetStyle(selector, fns, buttonGroupVars);
  polytheneCoreCss.styler.addStyle({
    selectors: [selector],
    fns: fns,
    vars: buttonGroupVars
  });

  exports.addStyle = addStyle;
  exports.getStyle = getStyle;
  exports.layout = layout;
  exports.vars = buttonGroupVars;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-css-button-group.js.map
