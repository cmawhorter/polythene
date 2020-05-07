(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-toolbar'), require('polythene-react-shadow')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-toolbar', 'polythene-react-shadow'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-toolbar'], global['polythene-react-shadow']));
}(this, function (exports, polytheneReactBase, polytheneCoreToolbar, polytheneReactShadow) { 'use strict';

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

  var Toolbar = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreToolbar.coreToolbar, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreToolbar.coreToolbar.createContent(vnode, _objectSpread({}, args, {
        Shadow: polytheneReactShadow.Shadow
      }));
    }
  }));
  Toolbar["displayName"] = "Toolbar";

  // @ts-check
  var ToolbarTitle = polytheneReactBase.ComponentCreator(polytheneCoreToolbar.coreToolbarTitle);
  ToolbarTitle["displayName"] = "ToolbarTitle";

  // @ts-check

  exports.Toolbar = Toolbar;
  exports.ToolbarTitle = ToolbarTitle;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-toolbar.js.map
