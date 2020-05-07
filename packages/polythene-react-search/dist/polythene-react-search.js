(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-search'), require('polythene-react-textfield')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-search', 'polythene-react-textfield'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-search'], global['polythene-react-textfield']));
}(this, function (exports, polytheneReactBase, polytheneCoreSearch, polytheneReactTextfield) { 'use strict';

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

  var Search = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreSearch.coreSearch, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreSearch.coreSearch.createContent(vnode, _objectSpread({}, args, {
        TextField: polytheneReactTextfield.TextField
      }));
    }
  }));
  Search["displayName"] = "Search";

  exports.Search = Search;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-search.js.map
