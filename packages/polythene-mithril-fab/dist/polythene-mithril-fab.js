(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-fab'), require('polythene-mithril-icon'), require('polythene-mithril-button')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-fab', 'polythene-mithril-icon', 'polythene-mithril-button'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-fab'], global['polythene-mithril-icon'], global['polythene-mithril-button']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreFab, polytheneMithrilIcon, polytheneMithrilButton) { 'use strict';

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

  var FAB = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreFab.coreFAB, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreFab.coreFAB.createProps(vnode, _objectSpread({}, args, {
        Icon: polytheneMithrilIcon.Icon
      }));
    },
    createContent: function createContent(vnode, args) {
      return polytheneCoreFab.coreFAB.createContent(vnode, _objectSpread({}, args, {
        Icon: polytheneMithrilIcon.Icon
      }));
    },
    component: polytheneMithrilButton.Button
  }));
  FAB["displayName"] = "FAB";

  exports.FAB = FAB;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-fab.js.map
