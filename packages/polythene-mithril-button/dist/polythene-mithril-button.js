(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-button'), require('polythene-mithril-ripple'), require('polythene-mithril-icon'), require('polythene-mithril-shadow')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-button', 'polythene-mithril-ripple', 'polythene-mithril-icon', 'polythene-mithril-shadow'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-button'], global['polythene-mithril-ripple'], global['polythene-mithril-icon'], global['polythene-mithril-shadow']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreButton, polytheneMithrilRipple, polytheneMithrilIcon, polytheneMithrilShadow) { 'use strict';

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

  var TextButton = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreButton.coreButton, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreButton.coreButton.createProps(vnode, _objectSpread({}, args, {
        Ripple: polytheneMithrilRipple.Ripple,
        Icon: polytheneMithrilIcon.Icon,
        Shadow: polytheneMithrilShadow.Shadow
      }));
    },
    createContent: function createContent(vnode, args) {
      return polytheneCoreButton.coreButton.createContent(vnode, _objectSpread({}, args, {
        Ripple: polytheneMithrilRipple.Ripple,
        Icon: polytheneMithrilIcon.Icon,
        Shadow: polytheneMithrilShadow.Shadow
      }));
    }
  }));
  TextButton["displayName"] = "TextButton";

  var RaisedButton = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreButton.coreRaisedButton, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreButton.coreRaisedButton.createProps(vnode, _objectSpread({}, args, {
        Shadow: polytheneMithrilShadow.Shadow
      }));
    },
    createContent: function createContent(vnode, args) {
      return polytheneCoreButton.coreRaisedButton.createContent(vnode, _objectSpread({}, args, {
        Shadow: polytheneMithrilShadow.Shadow
      }));
    },
    component: TextButton
  }));
  RaisedButton["displayName"] = "RaisedButton";

  // @ts-check
  var Button = polytheneMithrilBase.ComponentCreator({
    /**
     * @param {Vnode} vnode
     */
    view: function view(vnode) {
      return polytheneMithrilBase.renderer(vnode.attrs.raised ? RaisedButton : TextButton, vnode.attrs, vnode.children);
    }
  });
  Button["displayName"] = "Button";

  exports.Button = Button;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-button.js.map
