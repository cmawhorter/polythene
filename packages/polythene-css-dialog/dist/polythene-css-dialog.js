(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-core-css'), require('polythene-css-dialog-pane'), require('polythene-css-shadow'), require('polythene-theme')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-core-css', 'polythene-css-dialog-pane', 'polythene-css-shadow', 'polythene-theme'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-core-css'], global['polythene-css-dialog-pane'], global['polythene-css-shadow'], global['polythene-theme']));
}(this, function (exports, polytheneCoreCss, polytheneCssDialogPane, polytheneCssShadow, polytheneTheme) { 'use strict';

  var listTileClasses = {
    component: "pe-list-tile",
    // elements
    content: "pe-list-tile__content",
    highSubtitle: "pe-list-tile__high-subtitle",
    primary: "pe-list-tile__primary",
    secondary: "pe-list-tile__secondary",
    subtitle: "pe-list-tile__subtitle",
    title: "pe-list-tile__title",
    contentFront: "pe-list-tile__content-front",
    // states  
    compact: "pe-list-tile--compact",
    compactFront: "pe-list-tile--compact-front",
    disabled: "pe-list-tile--disabled",
    hasFront: "pe-list-tile--front",
    hasHighSubtitle: "pe-list-tile--high-subtitle",
    hasSubtitle: "pe-list-tile--subtitle",
    header: "pe-list-tile--header",
    hoverable: "pe-list-tile--hoverable",
    insetH: "pe-list-tile--inset-h",
    insetV: "pe-list-tile--inset-v",
    selectable: "pe-list-tile--selectable",
    selected: "pe-list-tile--selected",
    rounded: "pe-list-tile--rounded",
    highlight: "pe-list-tile--highlight",
    sticky: "pe-list-tile--sticky",
    navigation: "pe-list-tile--navigation"
  };

  var menuClasses = {
    component: "pe-menu",
    // elements
    panel: "pe-menu__panel",
    content: "pe-menu__content",
    placeholder: "pe-menu__placeholder",
    backdrop: "pe-menu__backdrop",
    // states
    floating: "pe-menu--floating",
    origin: "pe-menu--origin",
    permanent: "pe-menu--permanent",
    showBackdrop: "pe-menu--backdrop",
    visible: "pe-menu--visible",
    width_auto: "pe-menu--width-auto",
    width_n: "pe-menu--width-",
    isTopMenu: "pe-menu--top-menu",
    // lookup
    listTile: listTileClasses.component,
    selectedListTile: listTileClasses.selected
  };

  var classes = {
    component: "pe-dialog",
    // elements
    placeholder: "pe-dialog__placeholder",
    holder: "pe-dialog__holder",
    content: "pe-dialog__content",
    backdrop: "pe-dialog__backdrop",
    touch: "pe-dialog__touch",
    // states
    fullScreen: "pe-dialog--full-screen",
    modal: "pe-dialog--modal",
    open: "pe-dialog--open",
    // class set to html element
    visible: "pe-dialog--visible",
    // class set to dialog element
    showBackdrop: "pe-dialog--backdrop",
    transition: "pe-dialog--transition",
    // lookup
    menuContent: menuClasses.content
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

  var generalFns = {
    general_styles: function general_styles(selector) {
      return [];
    } // eslint-disable-line no-unused-vars

  };

  var tintFns = function tintFns(tint) {
    var _ref;

    return _ref = {}, _defineProperty(_ref, "color_" + tint + "_background", function (selector, vars) {
      return [polytheneCoreCss.sel(selector, {
        " .pe-dialog__content": {
          backgroundColor: vars["color_" + tint + "_background"]
        }
      })];
    }), _defineProperty(_ref, "color_" + tint + "_text", function (selector, vars) {
      return [polytheneCoreCss.sel(selector, {
        " .pe-dialog__content": {
          color: vars["color_" + tint + "_text"]
        }
      })];
    }), _defineProperty(_ref, "color_" + tint + "_backdrop_background", function (selector, vars) {
      return [polytheneCoreCss.sel(selector, {
        " .pe-dialog__backdrop": {
          backgroundColor: vars["color_" + tint + "_backdrop_background"]
        }
      })];
    }), _ref;
  };

  var lightTintFns = _extends({}, generalFns, tintFns("light"));

  var darkTintFns = _extends({}, generalFns, tintFns("dark"));

  var color = polytheneCoreCss.createColor({
    varFns: {
      lightTintFns: lightTintFns,
      darkTintFns: darkTintFns
    }
  });

  var behaviorVars = {
    full_screen: false,
    modal: false
  };

  var themeVars = _extends({}, {
    backdrop: false,
    z_index: polytheneTheme.vars.z_dialog
  }, behaviorVars, polytheneCssShadow.sharedVars);
  /**
   * @type {DialogVars} dialogVars
   */


  var dialogVars = _objectSpread({
    /**
     * Generate general styles, not defined by variables
     */
    general_styles: true,
    animation_delay: "0s",
    animation_duration: ".220s",
    animation_hide_css: "opacity: 0;",
    animation_show_css: "opacity: 1;",
    animation_timing_function: "ease-in-out",
    border_radius: polytheneTheme.vars.unit_block_border_radius,
    position: "fixed",
    // color vars
    color_light_backdrop_background: "rgba(0, 0, 0, .4)",
    color_dark_backdrop_background: "rgba(0, 0, 0, .5)",
    color_light_background: polytheneCoreCss.rgba(polytheneTheme.vars.color_light_background),
    color_dark_background: polytheneCoreCss.rgba(polytheneTheme.vars.color_dark_background),
    color_light_text: polytheneCoreCss.rgba(polytheneTheme.vars.color_light_foreground, polytheneTheme.vars.blend_light_text_regular),
    color_dark_text: polytheneCoreCss.rgba(polytheneTheme.vars.color_dark_foreground, polytheneTheme.vars.blend_dark_text_regular)
  }, themeVars);

  var minWidth = "320px";
  /**
   * @param {string} selector 
   * @param {object} vars 
   */

  var _backdrop = function backdrop(selector, vars) {
    return (// eslint-disable-line no-unused-vars
      polytheneCoreCss.sel(selector, {
        ".pe-dialog--visible .pe-dialog__backdrop": {
          display: "block",
          opacity: 1
        }
      })
    );
  };

  var fullScreen = function fullScreen(selector, vars) {
    return polytheneCoreCss.sel(selector, [polytheneCoreCss.createMarker(vars, behaviorVars), {
      padding: 0,
      " .pe-dialog__content": {
        width: "100%" // for IE 11

      }
    }, polytheneCssDialogPane.fullScreen(selector, vars)]);
  };

  var _modal = function modal(selector, vars) {
    return polytheneCoreCss.sel(selector, [polytheneCoreCss.createMarker(vars, behaviorVars)]);
  };

  var varFns = _objectSpread({
    /**
     * @param {string} selector
     * @param {object} vars 
     */
    general_styles: function general_styles(selector, vars) {
      return [polytheneCoreCss.sel(selector, [polytheneCoreCss.flex.layoutCenterCenter, {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: vars.z_index,
        height: "100%",
        // 100vh would make the dialog go beneath Mobile Safari toolbar        
        transitionProperty: "opacity,background-color,transform",
        ".pe-dialog--full-screen": fullScreen(selector, vars),
        ".pe-dialog--modal": _modal(selector, vars),
        " .pe-dialog__content": {
          position: "relative",
          transitionProperty: "all"
        },
        " .pe-dialog__backdrop": [polytheneCoreCss.mixin.defaultTransition("all"), // animation duration is set in component options
        {
          position: "absolute",
          opacity: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none"
        }],
        ".pe-dialog--backdrop": _backdrop(selector, vars)
      }]), {
        ".pe-dialog__holder": {
          height: "100%",
          minWidth: minWidth
        }
      }];
    },
    animation_hide_css: function animation_hide_css(selector, vars) {
      return [polytheneCoreCss.sel(selector, [vars.animation_hide_css])];
    },
    position: function position(selector, vars) {
      return [polytheneCoreCss.sel(selector, {
        position: vars.position
      })];
    },
    animation_delay: function animation_delay(selector, vars) {
      return [polytheneCoreCss.sel(selector, {
        "&, .pe-dialog__content": {
          transitionDelay: vars.animation_delay
        }
      })];
    },
    animation_duration: function animation_duration(selector, vars) {
      return [polytheneCoreCss.sel(selector, {
        "&, .pe-dialog__content": {
          transitionDuration: vars.animation_duration
        }
      })];
    },
    animation_timing_function: function animation_timing_function(selector, vars) {
      return [polytheneCoreCss.sel(selector, {
        "&, .pe-dialog__content": {
          transitionTimingFunction: vars.animation_timing_function
        }
      })];
    },
    animation_show_css: function animation_show_css(selector, vars) {
      return [polytheneCoreCss.sel(selector, {
        ".pe-dialog--visible": vars.animation_show_css
      })];
    },
    border_radius: function border_radius(selector, vars) {
      return [!vars.full_screen && polytheneCoreCss.sel(selector, {
        " .pe-dialog__content": {
          borderTopLeftRadius: vars.border_radius + "px",
          borderTopRightRadius: vars.border_radius + "px",
          borderBottomLeftRadius: vars.border_radius + "px",
          borderBottomRightRadius: vars.border_radius + "px"
        }
      })];
    },
    // Theme vars
    backdrop: function backdrop(selector, vars) {
      return vars.backdrop && _backdrop(selector, vars);
    },
    full_screen: function full_screen(selector, vars) {
      return vars.full_screen && fullScreen(selector, vars);
    },
    modal: function modal(selector, vars) {
      return vars.modal && _modal(selector, vars);
    }
  }, polytheneCssShadow.sharedVarFns);

  var layout = polytheneCoreCss.createLayout({
    varFns: varFns
  });

  // @ts-check
  var fns = [layout, color];
  var selector = ".".concat(classes.component);
  var addStyle = polytheneCoreCss.styler.createAddStyle(selector, fns, dialogVars);
  var getStyle = polytheneCoreCss.styler.createGetStyle(selector, fns, dialogVars);
  polytheneCoreCss.styler.addStyle({
    selectors: [selector],
    fns: fns,
    vars: dialogVars
  });

  exports.addStyle = addStyle;
  exports.getStyle = getStyle;
  exports.color = color;
  exports.layout = layout;
  exports.vars = dialogVars;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-css-dialog.js.map
