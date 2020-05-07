(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-switch'), require('polythene-core-selection-control'), require('polythene-react-shadow'), require('polythene-react-icon-button')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-switch', 'polythene-core-selection-control', 'polythene-react-shadow', 'polythene-react-icon-button'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-switch'], global['polythene-core-selection-control'], global['polythene-react-shadow'], global['polythene-react-icon-button']));
}(this, function (exports, polytheneReactBase, polytheneCoreSwitch, polytheneCoreSelectionControl, polytheneReactShadow, polytheneReactIconButton) { 'use strict';

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

  var ViewControl = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreSwitch.coreViewControl, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreSwitch.coreViewControl.createContent(vnode, _objectSpread({}, args, {
        Shadow: polytheneReactShadow.Shadow,
        IconButton: polytheneReactIconButton.IconButton
      }));
    }
  }));
  ViewControl["displayName"] = "ViewControl";

  var SelectionControl = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreSelectionControl.coreSelectionControl, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreSelectionControl.coreSelectionControl.createContent(vnode, _objectSpread({}, args, {
        ViewControl: ViewControl
      }));
    }
  }));
  SelectionControl["displayName"] = "SelectionControl";

  var Switch = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreSwitch.coreSwitch, {
    component: SelectionControl
  }));
  Switch["displayName"] = "Switch";

  exports.Switch = Switch;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-switch.js.map
