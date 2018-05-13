(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-css-selection-control'), require('polythene-theme'), require('polythene-core-css'), require('polythene-core-switch')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-css-selection-control', 'polythene-theme', 'polythene-core-css', 'polythene-core-switch'], factory) :
  (factory((global.polythene = {}),global['polythene-css-selection-control'],global['polythene-theme'],global['polythene-core-css'],global['polythene-core-switch']));
}(this, (function (exports,polytheneCssSelectionControl,polytheneTheme,polytheneCoreCss,polytheneCoreSwitch) { 'use strict';

  var classes = {
    component: "pe-switch-control",

    // elements
    knob: "pe-switch-control__knob",
    thumb: "pe-switch-control__thumb",
    track: "pe-switch-control__track"
  };

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var transition = function transition(vars, properties) {
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : vars.animation_duration;
    return polytheneCoreCss.mixin.defaultTransition(properties, duration, "ease-out");
  };

  var getSizeData = function getSizeData(vars, size) {
    var factor = size / polytheneTheme.vars.unit_icon_size;
    var thumbSize = Math.floor(0.5 * vars.thumb_size * factor) * 2; // round to even
    var scaledTrackHeight = Math.floor(0.5 * vars.track_height * factor) * 2; // round to even
    var scaledTrackWidth = Math.floor(0.5 * vars.track_length * factor) * 2;
    var scaledThumbSize = Math.floor(0.5 * vars.thumb_size * factor) * 2;
    var trackTop = (vars.label_height * factor - scaledTrackHeight) / 2;
    var thumbPadding = vars.icon_button_padding;
    var thumbMargin = (size - scaledThumbSize) / 2;
    var thumbOuterSize = size + 2 * thumbPadding;
    var thumbOffsetMin = -(thumbOuterSize / 2) + thumbSize / 2;
    var thumbOffsetMax = thumbOffsetMin + scaledTrackWidth - thumbSize;
    var thumbOffsetY = thumbOffsetMin + thumbMargin;
    var trackVisualOffset = 0.3; // prevent sub pixel of track to shine through knob border
    return {
      factor: factor,
      scaledThumbSize: scaledThumbSize,
      scaledTrackHeight: scaledTrackHeight,
      scaledTrackWidth: scaledTrackWidth,
      size: size,
      thumbMargin: thumbMargin,
      thumbOffsetMax: thumbOffsetMax,
      thumbOffsetMin: thumbOffsetMin,
      thumbOffsetY: thumbOffsetY,
      thumbPadding: thumbPadding,
      trackTop: trackTop,
      trackVisualOffset: trackVisualOffset
    };
  };

  var customSize = function customSize(vars, _ref) {
    var scaledThumbSize = _ref.scaledThumbSize,
        scaledTrackHeight = _ref.scaledTrackHeight,
        scaledTrackWidth = _ref.scaledTrackWidth,
        size = _ref.size,
        thumbMargin = _ref.thumbMargin,
        thumbOffsetY = _ref.thumbOffsetY,
        thumbPadding = _ref.thumbPadding,
        trackTop = _ref.trackTop,
        trackVisualOffset = _ref.trackVisualOffset;

    return {
      " .pe-control__form-label": {
        height: size + "px",
        minWidth: scaledTrackWidth + "px"
      },
      " .pe-switch-control__track": {
        height: scaledTrackHeight + "px",
        width: scaledTrackWidth - 2 * trackVisualOffset + "px",
        top: trackTop + "px",
        borderRadius: scaledTrackHeight + "px"
      },
      " .pe-switch-control__thumb": {
        top: thumbOffsetY + "px"
      },
      " .pe-switch-control__knob": {
        width: scaledThumbSize + "px",
        height: scaledThumbSize + "px",
        margin: thumbMargin + "px"
      },
      " .pe-button__content": {
        padding: thumbPadding + "px"
      }
    };
  };

  var customSpacing = function customSpacing(vars, _ref2, isRTL) {
    var _peControl__label, _peSwitchControl_, _peSwitchControl_2, _peSwitchControl_3;

    var factor = _ref2.factor,
        scaledTrackWidth = _ref2.scaledTrackWidth,
        thumbOffsetMax = _ref2.thumbOffsetMax,
        thumbOffsetMin = _ref2.thumbOffsetMin,
        trackVisualOffset = _ref2.trackVisualOffset;

    return {
      " .pe-control__label": (_peControl__label = {}, _defineProperty(_peControl__label, isRTL ? "paddingRight" : "paddingLeft", vars.padding * factor + 8 + scaledTrackWidth + "px"), _defineProperty(_peControl__label, isRTL ? "paddingLeft" : "paddingRight", 0), _peControl__label),
      " .pe-switch-control__track": (_peSwitchControl_ = {}, _defineProperty(_peSwitchControl_, isRTL ? "right" : "left", trackVisualOffset + "px"), _defineProperty(_peSwitchControl_, isRTL ? "left" : "right", "auto"), _peSwitchControl_),
      " .pe-switch-control__thumb": (_peSwitchControl_2 = {}, _defineProperty(_peSwitchControl_2, isRTL ? "right" : "left", thumbOffsetMin + "px"), _defineProperty(_peSwitchControl_2, isRTL ? "left" : "right", "auto"), _peSwitchControl_2),
      ".pe-control--on": {
        " .pe-switch-control__thumb": (_peSwitchControl_3 = {}, _defineProperty(_peSwitchControl_3, isRTL ? "right" : "left", thumbOffsetMax + "px"), _defineProperty(_peSwitchControl_3, isRTL ? "left" : "right", "auto"), _peSwitchControl_3)
      }
    };
  };

  var alignSide = function alignSide(isRTL) {
    return function () {
      var _peSwitchControl_4;

      return {
        " .pe-switch-control__track": (_peSwitchControl_4 = {}, _defineProperty(_peSwitchControl_4, isRTL ? "right" : "left", 0), _defineProperty(_peSwitchControl_4, isRTL ? "left" : "right", "auto"), _peSwitchControl_4)
      };
    };
  };

  var alignLeft = alignSide(false);
  var alignRight = alignSide(true);

  var sel = function sel(selector, o) {
    return _defineProperty({}, selector, o);
  };

  var createSize = function createSize(selector, vars) {
    var sizeData = {
      small: getSizeData(vars, polytheneTheme.vars.unit_icon_size_small),
      regular: getSizeData(vars, polytheneTheme.vars.unit_icon_size),
      medium: getSizeData(vars, polytheneTheme.vars.unit_icon_size_medium),
      large: getSizeData(vars, polytheneTheme.vars.unit_icon_size_large)
    };
    return [sel(selector, {
      ".pe-control--small": [customSize(vars, sizeData.small), customSpacing(vars, sizeData.small, false)],
      ".pe-control--regular": [customSize(vars, sizeData.regular), customSpacing(vars, sizeData.regular, false)],
      ".pe-control--medium": [customSize(vars, sizeData.medium), customSpacing(vars, sizeData.medium, false)],
      ".pe-control--large": [customSize(vars, sizeData.large), customSpacing(vars, sizeData.large, false)]
    }), _defineProperty({}, "*[dir=rtl] " + selector + ", .pe-rtl " + selector, [alignRight(), {
      ".pe-control--small": [customSpacing(vars, sizeData.small, true)],
      ".pe-control--regular": [customSpacing(vars, sizeData.regular, true)],
      ".pe-control--medium": [customSpacing(vars, sizeData.medium, true)],
      ".pe-control--large": [customSpacing(vars, sizeData.large, true)]
    }])];
  };

  var varFns = {
    general_styles: function general_styles(selector) {
      return [sel(selector, [alignLeft(), {
        " .pe-switch-control__track": [{
          position: "absolute"
        }],

        " .pe-switch-control__thumb": {
          position: "absolute",
          zIndex: 1, // Prevents flickering of text label when toggling
          color: "inherit",

          ":focus": {
            outline: 0
          }
        },

        " .pe-switch-control__knob": {
          position: "relative",
          borderRadius: "50%"
        },

        " .pe-icon-button .pe-button__content": {
          transition: "none",

          " .pe-switch-control__knob .pe-icon": [polytheneCoreCss.mixin.fit(), {
            width: "100%",
            height: "100%"
          }]
        }
      }]), _defineProperty({}, "_:-ms-fullscreen, :root " + selector, {
        " input": {
          position: "absolute",
          zIndex: 1,
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          display: "block",
          opacity: 0,
          cursor: "pointer"
        },
        " label": {
          cursor: "auto"
        }
      })];
    },
    animation_duration: function animation_duration(selector, vars) {
      return [sel(selector, {
        " .pe-switch-control__track, .pe-switch-control__thumb, .pe-control__label, .pe-button__focus": transition(vars, "all")
      })];
    },
    createSize: createSize
  };

  var withCreateSizeVar = function withCreateSizeVar(vars) {
    return vars.thumb_size || vars.track_height || vars.track_length || vars.label_height || vars.icon_button_padding ? _extends({}, vars, {
      createSize: true
    }) : vars;
  };

  var layout = (function (selector, componentVars, customVars) {
    var allVars = _extends({}, componentVars, customVars);
    var currentVars = withCreateSizeVar(customVars ? customVars : allVars);
    return polytheneCssSelectionControl.layout(selector, componentVars, customVars, "checkbox").concat(Object.keys(currentVars).map(function (v) {
      return varFns[v] !== undefined ? varFns[v](selector, allVars) : null;
    }).filter(function (s) {
      return s;
    }));
  });

  var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var sel$1 = function sel(selector, o) {
    return _defineProperty$1({}, selector, o);
  };

  var generalFns = {
    general_styles: function general_styles(selector) {
      return [sel$1(selector, {
        ".pe-control--off": {
          " .pe-switch-control__knob": {
            backgroundColor: "currentcolor"
          },
          " .pe-icon": {
            color: "currentcolor"
          }
        },
        ".pe-control--on": {
          " .pe-switch-control__knob": {
            backgroundColor: "currentcolor"
          },
          " .pe-icon": {
            color: "currentcolor"
          }
        }
      })];
    }
  };

  var tintFns = function tintFns(tint) {
    var _ref2;

    return _ref2 = {}, _defineProperty$1(_ref2, "color_" + tint + "_label", function (selector, vars) {
      return [sel$1(selector, {
        " .pe-control__label": {
          color: vars["color_" + tint + "_label"]
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_track_off", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--off": {
          " .pe-switch-control__track": {
            backgroundColor: vars["color_" + tint + "_track_off"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_track_off_opacity", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--off": {
          " .pe-switch-control__track": {
            opacity: vars["color_" + tint + "_track_off_opacity"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_thumb_off", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--off": {
          " .pe-switch-control__thumb": {
            color: vars["color_" + tint + "_thumb_off"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_focus_off", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--off": {
          " .pe-button--focus": {
            " .pe-button__focus": {
              backgroundColor: vars["color_" + tint + "_focus_off"]
            }
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_focus_off_opacity", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--off": {
          " .pe-button--focus": {
            " .pe-button__focus": {
              opacity: vars["color_" + tint + "_focus_off_opacity"]
            }
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_icon_off", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--off": {
          " .pe-icon": {
            color: vars["color_" + tint + "_icon_off"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_off_label", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--off": {
          " .pe-control__label": {
            color: vars["color_" + tint + "_off_label"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_track_on", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--on": {
          " .pe-switch-control__track": {
            backgroundColor: vars["color_" + tint + "_track_on"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_track_on_opacity", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--on": {
          " .pe-switch-control__track": {
            opacity: vars["color_" + tint + "_track_on_opacity"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_thumb_on", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--on": {
          " .pe-switch-control__thumb": {
            color: vars["color_" + tint + "_thumb_on"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_focus_on", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--on": {
          " .pe-button--focus": {
            " .pe-button__focus": {
              backgroundColor: vars["color_" + tint + "_focus_on"]
            }
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_focus_on_opacity", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--on": {
          " .pe-button--focus": {
            " .pe-button__focus": {
              opacity: vars["color_" + tint + "_focus_on_opacity"]
            }
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_icon_on", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--on": {
          " .pe-icon": {
            color: vars["color_" + tint + "_icon_on"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_on_label", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--on": {
          " .pe-control__label": {
            color: vars["color_" + tint + "_on_label"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_disabled", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--on.pe-control--disabled, &.pe-control--off.pe-control--disabled": {
          " .pe-control__label": {
            color: vars["color_" + tint + "_disabled"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_track_disabled", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--on.pe-control--disabled, &.pe-control--off.pe-control--disabled": {
          " .pe-switch-control__track": {
            backgroundColor: vars["color_" + tint + "_track_disabled"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_track_disabled_opacity", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--on.pe-control--disabled, &.pe-control--off.pe-control--disabled": {
          " .pe-switch-control__track": {
            opacity: vars["color_" + tint + "_track_disabled_opacity"]
          }
        }
      })];
    }), _defineProperty$1(_ref2, "color_" + tint + "_thumb_disabled", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--on.pe-control--disabled, &.pe-control--off.pe-control--disabled": {
          " .pe-switch-control__thumb, .pe-button__content": {
            color: vars["color_" + tint + "_thumb_disabled"]
          }
        }
      })];
    }), _ref2;
  };

  var hoverTintFns = function hoverTintFns(tint) {
    var _ref3;

    return _ref3 = {}, _defineProperty$1(_ref3, "color_" + tint + "_wash_on", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--on": {
          " .pe-button__wash": {
            backgroundColor: vars["color_" + tint + "_wash_on"]
          }
        }
      })];
    }), _defineProperty$1(_ref3, "color_" + tint + "_wash_off", function (selector, vars) {
      return [sel$1(selector, {
        ".pe-control--off": {
          " .pe-button__wash": {
            backgroundColor: vars["color_" + tint + "_wash_off"]
          }
        }
      })];
    }), _ref3;
  };

  var lightTintFns = _extends$1({}, generalFns, tintFns("light"));
  var darkTintFns = _extends$1({}, generalFns, tintFns("dark"));

  var lightTintHoverFns = hoverTintFns("light");
  var darkTintHoverFns = hoverTintFns("dark");

  var createStyle = function createStyle(selector, componentVars, customVars, tint, hover) {
    var allVars = _extends$1({}, componentVars, customVars);
    var currentVars = customVars ? customVars : allVars;
    return Object.keys(currentVars).map(function (v) {
      var varFns = tint === "light" ? hover ? lightTintHoverFns : lightTintFns : hover ? darkTintHoverFns : darkTintFns;
      return varFns[v] !== undefined ? varFns[v](selector, allVars) : null;
    }).filter(function (s) {
      return s;
    });
  };

  var style = function style(scopes, selector, componentVars, customVars, tint) {
    var selectors = scopes.map(function (s) {
      return s + selector;
    }).join(",");
    return createStyle(selectors, componentVars, customVars, tint);
  };

  var noTouchStyle = function noTouchStyle(scopes, selector, componentVars, customVars, tint) {
    var selectors = [].concat(scopes.map(function (s) {
      return s + selector + ":hover";
    }).join(",")).concat(scopes.map(function (s) {
      return s + selector + ":active";
    }).join(","));
    return createStyle(selectors, componentVars, customVars, tint, true);
  };

  var color = (function (selector, componentVars, customVars) {
    return [style([".pe-dark-tone", ".pe-dark-tone "], selector, componentVars, customVars, "dark"), // has/inside dark tone
    style(["", ".pe-light-tone", ".pe-light-tone "], selector, componentVars, customVars, "light"), // normal, has/inside light tone
    noTouchStyle(["html.pe-no-touch .pe-dark-tone "], selector, componentVars, customVars, "dark"), // inside dark tone
    noTouchStyle(["html.pe-no-touch ", "html.pe-no-touch .pe-light-tone "], selector, componentVars, customVars, "light")];
  });

  var fns = [layout, color];
  var selector = "." + classes.component;

  var addStyle = function addStyle(customSelector, customVars) {
    return polytheneCoreCss.styler.generateCustomStyles([customSelector, selector], polytheneCoreSwitch.vars, customVars, fns);
  };

  var getStyle = function getStyle(customSelector, customVars) {
    return customSelector ? polytheneCoreCss.styler.createCustomStyleSheets([customSelector, selector], polytheneCoreSwitch.vars, customVars, fns) : polytheneCoreCss.styler.createStyleSheets([selector], polytheneCoreSwitch.vars, fns);
  };

  polytheneCoreCss.styler.generateStyles([selector], polytheneCoreSwitch.vars, fns);

  exports.addStyle = addStyle;
  exports.getStyle = getStyle;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=polythene-css-switch.js.map
