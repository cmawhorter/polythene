(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-radio-button'), require('polythene-core-selection-control'), require('polythene-mithril-icon'), require('polythene-mithril-icon-button')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-radio-button', 'polythene-core-selection-control', 'polythene-mithril-icon', 'polythene-mithril-icon-button'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-radio-button'], global['polythene-core-selection-control'], global['polythene-mithril-icon'], global['polythene-mithril-icon-button']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreRadioButton, polytheneCoreSelectionControl, polytheneMithrilIcon, polytheneMithrilIconButton) { 'use strict';

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

  var ViewControl = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreSelectionControl.coreViewControl, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreSelectionControl.coreViewControl.createContent(vnode, _objectSpread({}, args, {
        Icon: polytheneMithrilIcon.Icon,
        IconButton: polytheneMithrilIconButton.IconButton
      }));
    }
  }));
  ViewControl["displayName"] = "ViewControl";

  var SelectionControl = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreSelectionControl.coreSelectionControl, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreSelectionControl.coreSelectionControl.createContent(vnode, _extends(args, {
        ViewControl: ViewControl
      }));
    }
  }));
  SelectionControl["displayName"] = "SelectionControl";

  var RadioButton = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreRadioButton.coreRadioButton, {
    component: SelectionControl
  }));
  RadioButton["displayName"] = "RadioButton";

  exports.RadioButton = RadioButton;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-radio-button.js.map
