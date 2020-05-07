(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-list-tile'), require('polythene-mithril-icon'), require('polythene-mithril-ripple')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-list-tile', 'polythene-mithril-icon', 'polythene-mithril-ripple'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-list-tile'], global['polythene-mithril-icon'], global['polythene-mithril-ripple']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreListTile, polytheneMithrilIcon, polytheneMithrilRipple) { 'use strict';

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

  var ListTile = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreListTile.coreListTile, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreListTile.coreListTile.createProps(vnode, _objectSpread({}, args, {
        Icon: polytheneMithrilIcon.Icon,
        Ripple: polytheneMithrilRipple.Ripple
      }));
    },
    createContent: function createContent(vnode, args) {
      return polytheneCoreListTile.coreListTile.createContent(vnode, _objectSpread({}, args, {
        Icon: polytheneMithrilIcon.Icon,
        Ripple: polytheneMithrilRipple.Ripple
      }));
    }
  }));
  ListTile["displayName"] = "ListTile";

  exports.ListTile = ListTile;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-list-tile.js.map
