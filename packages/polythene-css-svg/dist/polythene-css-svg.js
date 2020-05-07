(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-core-css')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-core-css'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-core-css']));
}(this, function (exports, polytheneCoreCss) { 'use strict';

  var classes = {
    component: "pe-svg"
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  var generalFns = {
    general_styles: function general_styles(selector) {
      return [polytheneCoreCss.sel(selector, {
        color: "inherit",
        " svg": {
          color: "inherit",
          " path, rect, circle, polygon": {
            "&:not([fill=none])": {
              fill: "currentcolor"
            }
          }
        }
      })];
    }
  };

  var tintFns = function tintFns(tint) {
    return _defineProperty({}, "color_" + tint, function (selector, vars) {
      return [polytheneCoreCss.sel(selector, {
        " svg": {
          " path, rect, circle, polygon": {
            "&:not([fill=none])": {
              fill: vars["color_" + tint]
            }
          }
        }
      })];
    });
  };

  var lightTintFns = _extends({}, generalFns, tintFns("light"));

  var darkTintFns = _extends({}, generalFns, tintFns("dark"));

  var color = polytheneCoreCss.createColor({
    varFns: {
      lightTintFns: lightTintFns,
      darkTintFns: darkTintFns
    }
  });

  // @ts-check
  var varFns = {
    general_styles: function general_styles(selector) {
      return [polytheneCoreCss.sel(selector, {
        lineHeight: 1,
        " > div, svg": {
          width: "inherit",
          height: "inherit"
        }
      })];
    }
  };
  var layout = polytheneCoreCss.createLayout({
    varFns: varFns
  });

  // @ts-check

  /**
   * @typedef {import("../index").SVGVars} SVGVars
   */

  /**
   * @type {SVGVars} svgVars
   */
  var svgVars = {
    /**
     * Generate general styles, not defined by variables
     */
    general_styles: true,
    color_light: "currentcolor",
    color_dark: "currentcolor"
  };

  // @ts-check
  var fns = [layout, color];
  var selector = ".".concat(classes.component);
  var addStyle = polytheneCoreCss.styler.createAddStyle(selector, fns, svgVars);
  var getStyle = polytheneCoreCss.styler.createGetStyle(selector, fns, svgVars);
  polytheneCoreCss.styler.addStyle({
    selectors: [selector],
    fns: fns,
    vars: svgVars
  });

  exports.addStyle = addStyle;
  exports.getStyle = getStyle;
  exports.color = color;
  exports.layout = layout;
  exports.vars = svgVars;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-css-svg.js.map
