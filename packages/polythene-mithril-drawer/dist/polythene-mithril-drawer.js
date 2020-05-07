(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core'), require('polythene-core-drawer'), require('polythene-mithril-dialog')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core', 'polythene-core-drawer', 'polythene-mithril-dialog'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core'], global['polythene-core-drawer'], global['polythene-mithril-dialog']));
}(this, function (exports, polytheneMithrilBase, polytheneCore, polytheneCoreDrawer, polytheneMithrilDialog) { 'use strict';

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

  var DrawerInstance = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreDrawer.coreDrawer, {
    component: polytheneMithrilDialog.DialogInstance
  }));
  var DrawerToggle = polytheneMithrilBase.ComponentCreator(polytheneCore.coreConditional);
  DrawerToggle["displayName"] = "DrawerToggle";
  var Drawer = {
    /**
     * @param {Vnode} vnode
     */
    view: function view(vnode) {
      return polytheneMithrilBase.renderer(DrawerToggle, _objectSpread({}, vnode.attrs, {
        placeholderClassName: classes.placeholder,
        instance: DrawerInstance,
        permanent: vnode.attrs.permanent || vnode.attrs.mini // passed to Conditional

      }));
    }
  };
  Drawer["displayName"] = "Drawer";

  exports.Drawer = Drawer;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-drawer.js.map
