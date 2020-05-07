(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-css-base-spinner'), require('polythene-core-css'), require('polythene-core'), require('polythene-theme')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-css-base-spinner', 'polythene-core-css', 'polythene-core', 'polythene-theme'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-css-base-spinner'], global['polythene-core-css'], global['polythene-core'], global['polythene-theme']));
}(this, function (exports, polytheneCssBaseSpinner, polytheneCoreCss, polytheneCore, polytheneTheme) { 'use strict';

  var classes = {
    component: "pe-ios-spinner",
    // elements
    blades: "pe-ios-spinner__blades",
    blade: "pe-ios-spinner__blade"
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
        " .pe-ios-spinner__blade": {
          background: "currentcolor"
        }
      })];
    }
  };

  var tintFns = function tintFns(tint) {
    return _defineProperty({}, "color_" + tint, function (selector, vars) {
      return [polytheneCoreCss.sel(selector, {
        color: vars["color_" + tint]
      })];
    });
  };

  var lightTintFns = _extends({}, generalFns, tintFns("light"));

  var darkTintFns = _extends({}, generalFns, tintFns("dark"));

  var color = polytheneCoreCss.createColor({
    varFns: {
      lightTintFns: lightTintFns,
      darkTintFns: darkTintFns
    },
    superColor: polytheneCssBaseSpinner.color
  });

  var bladeWidth = 9; // percent

  var bladeHeight = 28; // percent

  var kfFade = function kfFade() {
    return {
      " 0%": {
        opacity: .640
      },
      " 100%": {
        opacity: .035
      }
    };
  };

  var positionBlades = function positionBlades(vars) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) {
      // reverse to improve performance on iOS
      var delay = -1 / 12 * i * polytheneCore.styleDurationToMs(vars.rotation_animation_duration);
      var rotation = 360 - 360 / 12 * i;
      return _defineProperty({}, " .pe-ios-spinner__blade:nth-of-type(" + (i + 1) + ")", {
        transform: "rotate(" + rotation + "deg) translate3d(0,-140%,0)",
        animation: "iosSpinnerFade " + vars.rotation_animation_duration + " " + delay + "ms linear infinite"
      });
    });
  };

  var varFns = {
    general_styles: function general_styles(selector) {
      return [polytheneCoreCss.sel(selector, {
        " .pe-ios-spinner__blades": {
          transform: "translate3d(0,0,0)",
          position: "relative",
          width: "100%",
          height: "100%"
        },
        " .pe-ios-spinner__blade": {
          position: "absolute",
          width: bladeWidth + "%",
          height: bladeHeight + "%",
          left: (100 - bladeWidth) / 2 + "%",
          top: (100 - bladeHeight) / 2 + "%",
          opacity: 0,
          borderRadius: "50px"
        },
        "@keyframes iosSpinnerFade": kfFade()
      })];
    },
    rotation_animation_duration: function rotation_animation_duration(selector, vars) {
      return [polytheneCoreCss.sel(selector, {
        " .pe-ios-spinner__blades": [positionBlades(vars)]
      })];
    }
  };
  var layout = polytheneCoreCss.createLayout({
    varFns: varFns,
    superLayout: polytheneCssBaseSpinner.layout
  });

  // @ts-check
  /**
   * @type {IOSSpinnerVars} iOSSpinnerVars
   */

  var iOSSpinnerVars = {
    /**
     * Generate general styles, not defined by variables
     */
    general_styles: true,
    rotation_animation_duration: "1s",
    color_light: polytheneCoreCss.rgba(polytheneTheme.vars.color_light_foreground),
    color_dark: polytheneCoreCss.rgba(polytheneTheme.vars.color_dark_foreground)
  };

  // @ts-check
  var fns = [layout, color];
  var selector = ".".concat(classes.component);
  var addStyle = polytheneCoreCss.styler.createAddStyle(selector, fns, iOSSpinnerVars);
  var getStyle = polytheneCoreCss.styler.createGetStyle(selector, fns, iOSSpinnerVars);
  polytheneCoreCss.styler.addStyle({
    selectors: [selector],
    fns: fns,
    vars: iOSSpinnerVars
  });

  exports.addStyle = addStyle;
  exports.getStyle = getStyle;
  exports.color = color;
  exports.layout = layout;
  exports.vars = iOSSpinnerVars;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-css-ios-spinner.js.map
