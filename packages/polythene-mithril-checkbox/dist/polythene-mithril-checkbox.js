(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-checkbox'), require('polythene-core-selection-control'), require('polythene-mithril-icon'), require('polythene-mithril-icon-button')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-checkbox', 'polythene-core-selection-control', 'polythene-mithril-icon', 'polythene-mithril-icon-button'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-checkbox'], global['polythene-core-selection-control'], global['polythene-mithril-icon'], global['polythene-mithril-icon-button']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreCheckbox, polytheneCoreSelectionControl, polytheneMithrilIcon, polytheneMithrilIconButton) { 'use strict';

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
      return polytheneCoreSelectionControl.coreSelectionControl.createContent(vnode, _objectSpread({}, args, {
        ViewControl: ViewControl
      }));
    }
  }));
  SelectionControl["displayName"] = "SelectionControl";

  var Checkbox = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreCheckbox.coreCheckbox, {
    component: SelectionControl
  }));
  Checkbox["displayName"] = "Checkbox";

  exports.Checkbox = Checkbox;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-checkbox.js.map
