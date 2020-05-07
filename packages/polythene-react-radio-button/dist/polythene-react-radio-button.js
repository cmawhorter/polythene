(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-radio-button'), require('polythene-core-selection-control'), require('polythene-react-icon'), require('polythene-react-icon-button')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-radio-button', 'polythene-core-selection-control', 'polythene-react-icon', 'polythene-react-icon-button'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-radio-button'], global['polythene-core-selection-control'], global['polythene-react-icon'], global['polythene-react-icon-button']));
}(this, function (exports, polytheneReactBase, polytheneCoreRadioButton, polytheneCoreSelectionControl, polytheneReactIcon, polytheneReactIconButton) { 'use strict';

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

  var ViewControl = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreSelectionControl.coreViewControl, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreSelectionControl.coreViewControl.createContent(vnode, _objectSpread({}, args, {
        Icon: polytheneReactIcon.Icon,
        IconButton: polytheneReactIconButton.IconButton
      }));
    }
  }));
  ViewControl["displayName"] = "ViewControl";

  var SelectionControl = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreSelectionControl.coreSelectionControl, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreSelectionControl.coreSelectionControl.createContent(vnode, _extends(args, {
        ViewControl: ViewControl
      }));
    }
  }));
  SelectionControl["displayName"] = "SelectionControl";

  var RadioButton = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreRadioButton.coreRadioButton, {
    component: SelectionControl
  }));
  RadioButton["displayName"] = "RadioButton";

  exports.RadioButton = RadioButton;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-radio-button.js.map
