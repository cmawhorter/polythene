(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-icon'), require('polythene-react-svg')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-icon', 'polythene-react-svg'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-icon'], global['polythene-react-svg']));
}(this, function (exports, polytheneReactBase, polytheneCoreIcon, polytheneReactSvg) { 'use strict';

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

  var Icon = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreIcon.coreIcon, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreIcon.coreIcon.createProps(vnode, _objectSpread({}, args, {
        SVG: polytheneReactSvg.SVG
      }));
    },
    createContent: function createContent(vnode, args) {
      return polytheneCoreIcon.coreIcon.createContent(vnode, _objectSpread({}, args, {
        SVG: polytheneReactSvg.SVG
      }));
    }
  }));
  Icon["displayName"] = "Icon";

  exports.Icon = Icon;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-icon.js.map
