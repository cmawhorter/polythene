(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-list'), require('polythene-react-list-tile')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-list', 'polythene-react-list-tile'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-list'], global['polythene-react-list-tile']));
}(this, function (exports, polytheneReactBase, polytheneCoreList, polytheneReactListTile) { 'use strict';

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

  var List = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreList.coreList, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreList.coreList.createProps(vnode, _objectSpread({}, args, {
        ListTile: polytheneReactListTile.ListTile
      }));
    },
    createContent: function createContent(vnode, args) {
      return polytheneCoreList.coreList.createContent(vnode, _objectSpread({}, args, {
        ListTile: polytheneReactListTile.ListTile
      }));
    }
  }));
  List["displayName"] = "List";

  exports.List = List;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-list.js.map
