(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core'), require('polythene-core-ios-spinner'), require('polythene-mithril-base-spinner')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core', 'polythene-core-ios-spinner', 'polythene-mithril-base-spinner'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core'], global['polythene-core-ios-spinner'], global['polythene-mithril-base-spinner']));
}(this, function (exports, polytheneMithrilBase, polytheneCore, polytheneCoreIosSpinner, polytheneMithrilBaseSpinner) { 'use strict';

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
    component: "pe-ios-spinner",
    // elements
    blades: "pe-ios-spinner__blades",
    blade: "pe-ios-spinner__blade"
  };

  var baseSpinnerClasses = {
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

  var SpinnerInstance = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreIosSpinner.coreIOSSpinner, {
    component: polytheneMithrilBaseSpinner.BaseSpinner
  }));
  var SpinnerToggle = polytheneMithrilBase.ComponentCreator(polytheneCore.coreConditional);
  SpinnerToggle["displayName"] = "IOSSpinnerToggle";
  var IOSSpinner = {
    /**
     * @param {Vnode} vnode
     */
    view: function view(vnode) {
      return polytheneMithrilBase.renderer(SpinnerToggle, _objectSpread({}, vnode.attrs, {
        placeholderClassName: baseSpinnerClasses.placeholder,
        instance: SpinnerInstance
      }));
    }
  };
  IOSSpinner["classes"] = classes;
  IOSSpinner["displayName"] = "IOSSpinner";

  exports.IOSSpinner = IOSSpinner;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-ios-spinner.js.map
