(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-toolbar'), require('polythene-mithril-shadow')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-toolbar', 'polythene-mithril-shadow'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-toolbar'], global['polythene-mithril-shadow']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreToolbar, polytheneMithrilShadow) { 'use strict';

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

  var Toolbar = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreToolbar.coreToolbar, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreToolbar.coreToolbar.createContent(vnode, _extends(args, {
        Shadow: polytheneMithrilShadow.Shadow
      }));
    }
  }));
  Toolbar["displayName"] = "Toolbar";

  // @ts-check
  var ToolbarTitle = polytheneMithrilBase.ComponentCreator(polytheneCoreToolbar.coreToolbarTitle);
  ToolbarTitle["displayName"] = "ToolbarTitle";

  // @ts-check

  exports.Toolbar = Toolbar;
  exports.ToolbarTitle = ToolbarTitle;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-toolbar.js.map
