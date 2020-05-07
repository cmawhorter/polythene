(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-button'), require('polythene-core'), require('polythene-mithril-base')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-button', 'polythene-core', 'polythene-mithril-base'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-button'], global['polythene-core'], global['polythene-mithril-base']));
}(this, function (exports, polytheneMithrilButton, polytheneCore, polytheneMithrilBase) { 'use strict';

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

  var RaisedButton = polytheneMithrilBase.ComponentCreator({
    onMount: function onMount() {
      polytheneCore.deprecation("RaisedButton", {
        newComponent: "Button",
        newOption: "raised: true"
      });
    },
    view: function view(vnode) {
      return polytheneMithrilBase.renderer(polytheneMithrilButton.Button, _objectSpread({
        raised: true
      }, vnode.attrs), vnode.children);
    }
  });
  RaisedButton["displayName"] = "RaisedButton";

  exports.RaisedButton = RaisedButton;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-raised-button.js.map
