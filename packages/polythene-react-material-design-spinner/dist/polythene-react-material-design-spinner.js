(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core'), require('polythene-core-material-design-spinner'), require('polythene-react-base-spinner')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core', 'polythene-core-material-design-spinner', 'polythene-react-base-spinner'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core'], global['polythene-core-material-design-spinner'], global['polythene-react-base-spinner']));
}(this, function (exports, polytheneReactBase, polytheneCore, polytheneCoreMaterialDesignSpinner, polytheneReactBaseSpinner) { 'use strict';

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
    component: "pe-md-spinner",
    // elements
    animation: "pe-md-spinner__animation",
    circle: "pe-md-spinner__circle",
    circleClipper: "pe-md-spinner__circle-clipper",
    circleClipperLeft: "pe-md-spinner__circle-clipper-left",
    circleClipperRight: "pe-md-spinner__circle-clipper-right",
    gapPatch: "pe-md-spinner__gap-patch",
    layer: "pe-md-spinner__layer",
    layerN: "pe-md-spinner__layer-"
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

  var SpinnerInstance = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreMaterialDesignSpinner.coreMaterialDesignSpinner, {
    component: polytheneReactBaseSpinner.BaseSpinner
  }));
  var SpinnerToggle = polytheneReactBase.ComponentCreator(polytheneCore.coreConditional);
  SpinnerToggle["displayName"] = "MaterialDesignSpinnerToggle";
  /**
   * @param {Vnode} props 
   */

  var MaterialDesignSpinner = function MaterialDesignSpinner(props) {
    return polytheneReactBase.renderer(SpinnerToggle, _objectSpread({}, props, {
      placeholderClassName: baseSpinnerClasses.placeholder,
      instance: SpinnerInstance
    }));
  };
  MaterialDesignSpinner["classes"] = classes;
  MaterialDesignSpinner["displayName"] = "MaterialDesignSpinner";

  exports.MaterialDesignSpinner = MaterialDesignSpinner;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-material-design-spinner.js.map
