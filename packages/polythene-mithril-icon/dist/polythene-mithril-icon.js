(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-icon'), require('polythene-mithril-svg')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-icon', 'polythene-mithril-svg'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-icon'], global['polythene-mithril-svg']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreIcon, polytheneMithrilSvg) { 'use strict';

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

  var Icon = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreIcon.coreIcon, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreIcon.coreIcon.createProps(vnode, _objectSpread({}, args, {
        SVG: polytheneMithrilSvg.SVG
      }));
    },
    createContent: function createContent(vnode, args) {
      return polytheneCoreIcon.coreIcon.createContent(vnode, _objectSpread({}, args, {
        SVG: polytheneMithrilSvg.SVG
      }));
    }
  }));
  Icon["displayName"] = "Icon";

  exports.Icon = Icon;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-icon.js.map
