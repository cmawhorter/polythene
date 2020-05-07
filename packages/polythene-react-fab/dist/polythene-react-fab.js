(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-fab'), require('polythene-react-icon'), require('polythene-react-button')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-fab', 'polythene-react-icon', 'polythene-react-button'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-fab'], global['polythene-react-icon'], global['polythene-react-button']));
}(this, function (exports, polytheneReactBase, polytheneCoreFab, polytheneReactIcon, polytheneReactButton) { 'use strict';

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

  var FAB = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreFab.coreFAB, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreFab.coreFAB.createProps(vnode, _objectSpread({}, args, {
        Icon: polytheneReactIcon.Icon
      }));
    },
    createContent: function createContent(vnode, args) {
      return polytheneCoreFab.coreFAB.createContent(vnode, _objectSpread({}, args, {
        Icon: polytheneReactIcon.Icon
      }));
    },
    component: polytheneReactButton.Button
  }));
  FAB["displayName"] = "FAB";

  exports.FAB = FAB;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-fab.js.map
