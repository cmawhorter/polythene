(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core'), require('polythene-core-ios-spinner'), require('polythene-react-base-spinner')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core', 'polythene-core-ios-spinner', 'polythene-react-base-spinner'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core'], global['polythene-core-ios-spinner'], global['polythene-react-base-spinner']));
}(this, function (exports, polytheneReactBase, polytheneCore, polytheneCoreIosSpinner, polytheneReactBaseSpinner) { 'use strict';

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

  var SpinnerInstance = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreIosSpinner.coreIOSSpinner, {
    component: polytheneReactBaseSpinner.BaseSpinner
  }));
  var SpinnerToggle = polytheneReactBase.ComponentCreator(polytheneCore.coreConditional);
  SpinnerToggle["displayName"] = "IOSSpinnerToggle";
  var IOSSpinner = function IOSSpinner(props) {
    return polytheneReactBase.renderer(SpinnerToggle, _objectSpread({}, props, {
      placeholderClassName: baseSpinnerClasses.placeholder,
      instance: SpinnerInstance
    }));
  };
  IOSSpinner["classes"] = classes;
  IOSSpinner["displayName"] = "IOSSpinner";

  exports.IOSSpinner = IOSSpinner;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-ios-spinner.js.map
