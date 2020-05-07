(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-list-tile'), require('polythene-react-icon'), require('polythene-react-ripple')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-list-tile', 'polythene-react-icon', 'polythene-react-ripple'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-list-tile'], global['polythene-react-icon'], global['polythene-react-ripple']));
}(this, function (exports, polytheneReactBase, polytheneCoreListTile, polytheneReactIcon, polytheneReactRipple) { 'use strict';

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

  var ListTile = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreListTile.coreListTile, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreListTile.coreListTile.createProps(vnode, _objectSpread({}, args, {
        Icon: polytheneReactIcon.Icon,
        Ripple: polytheneReactRipple.Ripple
      }));
    },
    createContent: function createContent(vnode, args) {
      return polytheneCoreListTile.coreListTile.createContent(vnode, _objectSpread({}, args, {
        Icon: polytheneReactIcon.Icon,
        Ripple: polytheneReactRipple.Ripple
      }));
    }
  }));
  ListTile["displayName"] = "ListTile";

  exports.ListTile = ListTile;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-list-tile.js.map
