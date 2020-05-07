(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-core-css'), require('polythene-css-notification'), require('polythene-theme')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-core-css', 'polythene-css-notification', 'polythene-theme'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-core-css'], global['polythene-css-notification'], global['polythene-theme']));
}(this, function (exports, polytheneCoreCss, polytheneCssNotification, polytheneTheme) { 'use strict';

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

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var notificationClasses = {
    component: "pe-notification",
    // elements
    action: "pe-notification__action",
    content: "pe-notification__content",
    holder: "pe-notification__holder",
    placeholder: "pe-notification__placeholder",
    title: "pe-notification__title",
    // states
    hasContainer: "pe-notification--container",
    horizontal: "pe-notification--horizontal",
    multilineTitle: "pe-notification__title--multi-line",
    vertical: "pe-notification--vertical",
    visible: "pe-notification--visible"
  };

  var classes = _objectSpread({}, notificationClasses, {
    component: "pe-notification pe-snackbar",
    // elements
    holder: "pe-snackbar__holder",
    placeholder: "pe-snackbar__placeholder",
    // states
    open: "pe-snackbar--open"
  });

  // @ts-check
  var color = polytheneCoreCss.createColor({
    superColor: polytheneCssNotification.color
  });

  var varFns = {
    general_styles: function general_styles(selector) {
      return [polytheneCoreCss.sel(selector, [polytheneCoreCss.flex.layoutCenterCenter, {
        position: "fixed",
        top: "auto",
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: polytheneTheme.vars.z_notification,
        pointerEvents: "none",
        justifyContent: "flex-start",
        // For IE11
        width: "100%"
      }]), _defineProperty({}, ".pe-notification--container ".concat(selector), {
        position: "relative"
      })];
    }
  };
  var holderLayout = polytheneCoreCss.createLayout({
    varFns: varFns
  });

  var breakpoint = function breakpoint(breakpointSel) {
    return function (selector, o) {
      return _defineProperty({}, breakpointSel, _defineProperty({}, selector, o));
    };
  };

  var breakpointTabletPortraitUp = breakpoint("@media (min-width: ".concat(polytheneTheme.vars.breakpoint_for_tablet_portrait_up, "px)"));
  var varFns$1 = {
    general_styles: function general_styles(selector) {
      return [polytheneCoreCss.sel(selector, {
        width: "100%",
        opacity: 1,
        " .pe-notification__content": {
          width: "100%",
          margin: "0 auto",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0
        }
      }), breakpointTabletPortraitUp(selector, {
        ".pe-notification--horizontal": {
          " .pe-notification__title": {
            paddingRight: "30px"
          }
        }
      })];
    },
    min_width: function min_width(selector, vars) {
      return [breakpointTabletPortraitUp(selector, {
        minWidth: vars.min_width + "px"
      })];
    },
    max_width: function max_width(selector, vars) {
      return [breakpointTabletPortraitUp(selector, {
        maxWidth: vars.max_width + "px"
      })];
    },
    border_radius: function border_radius(selector, vars) {
      return [polytheneCoreCss.sel(selector, {
        " .pe-notification__content": {
          borderTopLeftRadius: vars.border_radius + "px",
          borderTopRightRadius: vars.border_radius + "px",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0
        }
      })];
    }
  };
  var layout = polytheneCoreCss.createLayout({
    varFns: varFns$1,
    customVarFns: polytheneCssNotification.customLayoutFns
  });

  // @ts-check
  /**
   * @type {SnackbarVars} snackbarVars
   */

  var snackbarVars = {
    /**
     * Generate general styles, not defined by variables
     */
    general_styles: true,
    animation_hide_css: "",
    animation_show_css: "",
    border_radius: 0,
    max_width: 568,
    min_height: 0,
    min_width: 288,
    color_light_background: polytheneCoreCss.rgba(polytheneTheme.vars.color_light_background),
    color_dark_background: polytheneCoreCss.rgba(polytheneTheme.vars.color_dark_background)
  };

  // @ts-check
  var fns = [layout, color];
  var selector = ".".concat(classes.component.replace(/ /g, "."));
  var holderFns = [holderLayout];
  var holderSelector = ".".concat(classes.holder.replace(/ /g, "."));

  var addStyle = function addStyle(customSelector, customVars) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$mediaQuery = _ref.mediaQuery,
        mediaQuery = _ref$mediaQuery === void 0 ? "" : _ref$mediaQuery,
        _ref$scope = _ref.scope,
        scope = _ref$scope === void 0 ? "" : _ref$scope;

    customSelector && polytheneCoreCss.styler.addStyle({
      selectors: [customSelector, selector],
      fns: fns,
      vars: snackbarVars,
      customVars: customVars,
      mediaQuery: mediaQuery,
      scope: scope
    });
    customSelector && polytheneCoreCss.styler.addStyle({
      selectors: [customSelector, holderSelector],
      fns: holderFns,
      vars: snackbarVars,
      customVars: customVars,
      mediaQuery: mediaQuery,
      scope: scope
    });
  };

  var getStyle = function getStyle() {
    var customSelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var customVars = arguments.length > 1 ? arguments[1] : undefined;

    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$mediaQuery = _ref2.mediaQuery,
        mediaQuery = _ref2$mediaQuery === void 0 ? "" : _ref2$mediaQuery,
        _ref2$scope = _ref2.scope,
        scope = _ref2$scope === void 0 ? "" : _ref2$scope;

    return polytheneCoreCss.styler.getStyle({
      selectors: [customSelector, selector],
      fns: fns,
      vars: snackbarVars,
      customVars: customVars,
      mediaQuery: mediaQuery,
      scope: scope
    }).concat(polytheneCoreCss.styler.getStyle({
      selectors: [holderSelector],
      fns: holderFns,
      vars: snackbarVars,
      customVars: customVars,
      mediaQuery: mediaQuery,
      scope: scope
    }));
  };

  polytheneCoreCss.styler.addStyle({
    selectors: [holderSelector],
    fns: holderFns,
    vars: snackbarVars
  });
  polytheneCoreCss.styler.addStyle({
    selectors: [selector],
    fns: fns,
    vars: snackbarVars
  });

  exports.addStyle = addStyle;
  exports.getStyle = getStyle;
  exports.color = color;
  exports.layout = layout;
  exports.vars = snackbarVars;
  exports.holderLayout = holderLayout;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-css-snackbar.js.map
