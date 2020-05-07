(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-button'), require('polythene-react-ripple'), require('polythene-react-icon'), require('polythene-react-shadow')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-button', 'polythene-react-ripple', 'polythene-react-icon', 'polythene-react-shadow'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-button'], global['polythene-react-ripple'], global['polythene-react-icon'], global['polythene-react-shadow']));
}(this, function (exports, polytheneReactBase, polytheneCoreButton, polytheneReactRipple, polytheneReactIcon, polytheneReactShadow) { 'use strict';

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

  var TextButton = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreButton.coreButton, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreButton.coreButton.createProps(vnode, _objectSpread({}, args, {
        Ripple: polytheneReactRipple.Ripple,
        Icon: polytheneReactIcon.Icon,
        Shadow: polytheneReactShadow.Shadow
      }));
    },
    createContent: function createContent(vnode, args) {
      return polytheneCoreButton.coreButton.createContent(vnode, _objectSpread({}, args, {
        Ripple: polytheneReactRipple.Ripple,
        Icon: polytheneReactIcon.Icon,
        Shadow: polytheneReactShadow.Shadow
      }));
    }
  }));
  TextButton["displayName"] = "TextButton";

  var RaisedButton = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreButton.coreRaisedButton, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreButton.coreRaisedButton.createProps(vnode, _objectSpread({}, args, {
        Shadow: polytheneReactShadow.Shadow
      }));
    },
    createContent: function createContent(vnode, args) {
      return polytheneCoreButton.coreRaisedButton.createContent(vnode, _objectSpread({}, args, {
        Shadow: polytheneReactShadow.Shadow
      }));
    },
    component: TextButton
  }));
  RaisedButton["displayName"] = "RaisedButton";

  // @ts-check
  var Button = polytheneReactBase.ComponentCreator({
    /**
     * @param {Vnode} vnode
     */
    view: function view(vnode) {
      return polytheneReactBase.renderer(vnode.attrs.raised ? RaisedButton : TextButton, vnode.attrs, vnode.children);
    }
  });
  Button["displayName"] = "Button";

  exports.Button = Button;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-button.js.map
