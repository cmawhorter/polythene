(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core'), require('polythene-core-drawer'), require('polythene-react-dialog')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core', 'polythene-core-drawer', 'polythene-react-dialog'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core'], global['polythene-core-drawer'], global['polythene-react-dialog']));
}(this, function (exports, polytheneReactBase, polytheneCore, polytheneCoreDrawer, polytheneReactDialog) { 'use strict';

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

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
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
    component: "pe-dialog pe-drawer",
    // states
    cover: "pe-drawer--cover",
    push: "pe-drawer--push",
    mini: "pe-drawer--mini",
    permanent: "pe-drawer--permanent",
    border: "pe-drawer--border",
    floating: "pe-drawer--floating",
    fixed: "pe-drawer--fixed",
    anchorEnd: "pe-drawer--anchor-end"
  };

  var DrawerInstance = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreDrawer.coreDrawer, {
    component: polytheneReactDialog.DialogInstance
  }));
  var DrawerToggle = polytheneReactBase.ComponentCreator(polytheneCore.coreConditional);
  DrawerToggle["displayName"] = "DrawerToggle";
  var Drawer = function Drawer(props) {
    return polytheneReactBase.renderer(DrawerToggle, _extends({}, props, {
      placeholderClassName: classes.placeholder,
      instance: DrawerInstance,
      permanent: props.permanent || props.mini // passed to Conditional

    }));
  };
  Drawer["displayName"] = "Drawer";

  exports.Drawer = Drawer;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-drawer.js.map
