(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core'), require('polythene-core-snackbar')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core', 'polythene-core-snackbar'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core'], global['polythene-core-snackbar']));
}(this, function (exports, polytheneReactBase, polytheneCore, polytheneCoreSnackbar) { 'use strict';

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

  var notificationClasses = {
    component: "pe-notification",
    // elements
    action: "pe-notification__action",
    content: "pe-notification__content",
    holder: "pe-notification__holder",
    placeholder: "pe-notification__placeholder",
    title: "pe-notification__title",
    // states
    hasContainer: "pe-notification--container",
    horizontal: "pe-notification--horizontal",
    multilineTitle: "pe-notification__title--multi-line",
    vertical: "pe-notification--vertical",
    visible: "pe-notification--visible"
  };

  var classes = _objectSpread({}, notificationClasses, {
    component: "pe-notification pe-snackbar",
    // elements
    holder: "pe-snackbar__holder",
    placeholder: "pe-snackbar__placeholder",
    // states
    open: "pe-snackbar--open"
  });

  // @ts-check
  var SnackbarInstance = polytheneReactBase.ComponentCreator(polytheneCoreSnackbar.coreSnackbar);
  SnackbarInstance["displayName"] = "SnackbarInstance";
  var options = {
    name: "snackbar",
    className: classes.component,
    htmlShowClass: classes.open,
    defaultId: "default_snackbar",
    holderSelector: ".".concat(classes.holder),
    instance: SnackbarInstance,
    placeholder: "span.".concat(classes.placeholder),
    queue: true,
    transitions: polytheneCoreSnackbar.transitions
  };
  var Multiple = polytheneCore.Multi({
    options: options,
    renderer: polytheneReactBase.renderer
  });
  var Snackbar = polytheneReactBase.ComponentCreator(Multiple);
  Object.getOwnPropertyNames(Multiple).forEach(function (p) {
    return Snackbar[p] = Multiple[p];
  });
  Snackbar["displayName"] = "Snackbar";

  exports.SnackbarInstance = SnackbarInstance;
  exports.Snackbar = Snackbar;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-snackbar.js.map
