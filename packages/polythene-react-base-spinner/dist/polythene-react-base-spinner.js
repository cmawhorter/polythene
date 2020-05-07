(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-base-spinner'), require('polythene-react-shadow')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-base-spinner', 'polythene-react-shadow'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-base-spinner'], global['polythene-react-shadow']));
}(this, function (exports, polytheneReactBase, polytheneCoreBaseSpinner, polytheneReactShadow) { 'use strict';

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

  var classes = {
    component: "pe-spinner",
    // elements
    animation: "pe-spinner__animation",
    placeholder: "pe-spinner__placeholder",
    // states
    animated: "pe-spinner--animated",
    fab: "pe-spinner--fab",
    large: "pe-spinner--large",
    medium: "pe-spinner--medium",
    permanent: "pe-spinner--permanent",
    raised: "pe-spinner--raised",
    regular: "pe-spinner--regular",
    singleColor: "pe-spinner--single-color",
    small: "pe-spinner--small",
    visible: "pe-spinner--visible"
  };

  var BaseSpinner = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreBaseSpinner.coreBaseSpinner, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreBaseSpinner.coreBaseSpinner.createContent(vnode, _objectSpread({}, args, {
        Shadow: polytheneReactShadow.Shadow
      }));
    }
  }));
  BaseSpinner["classes"] = classes;
  BaseSpinner["displayName"] = "BaseSpinner";

  exports.BaseSpinner = BaseSpinner;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-base-spinner.js.map
