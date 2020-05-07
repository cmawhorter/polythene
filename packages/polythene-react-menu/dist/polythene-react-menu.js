(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core'), require('polythene-core-menu'), require('polythene-react-shadow')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core', 'polythene-core-menu', 'polythene-react-shadow'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core'], global['polythene-core-menu'], global['polythene-react-shadow']));
}(this, function (exports, polytheneReactBase, polytheneCore, polytheneCoreMenu, polytheneReactShadow) { 'use strict';

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

  var listTileClasses = {
    component: "pe-list-tile",
    // elements
    content: "pe-list-tile__content",
    highSubtitle: "pe-list-tile__high-subtitle",
    primary: "pe-list-tile__primary",
    secondary: "pe-list-tile__secondary",
    subtitle: "pe-list-tile__subtitle",
    title: "pe-list-tile__title",
    contentFront: "pe-list-tile__content-front",
    // states  
    compact: "pe-list-tile--compact",
    compactFront: "pe-list-tile--compact-front",
    disabled: "pe-list-tile--disabled",
    hasFront: "pe-list-tile--front",
    hasHighSubtitle: "pe-list-tile--high-subtitle",
    hasSubtitle: "pe-list-tile--subtitle",
    header: "pe-list-tile--header",
    hoverable: "pe-list-tile--hoverable",
    insetH: "pe-list-tile--inset-h",
    insetV: "pe-list-tile--inset-v",
    selectable: "pe-list-tile--selectable",
    selected: "pe-list-tile--selected",
    rounded: "pe-list-tile--rounded",
    highlight: "pe-list-tile--highlight",
    sticky: "pe-list-tile--sticky",
    navigation: "pe-list-tile--navigation"
  };

  var classes = {
    component: "pe-menu",
    // elements
    panel: "pe-menu__panel",
    content: "pe-menu__content",
    placeholder: "pe-menu__placeholder",
    backdrop: "pe-menu__backdrop",
    // states
    floating: "pe-menu--floating",
    origin: "pe-menu--origin",
    permanent: "pe-menu--permanent",
    showBackdrop: "pe-menu--backdrop",
    visible: "pe-menu--visible",
    width_auto: "pe-menu--width-auto",
    width_n: "pe-menu--width-",
    isTopMenu: "pe-menu--top-menu",
    // lookup
    listTile: listTileClasses.component,
    selectedListTile: listTileClasses.selected
  };

  var MenuInstance = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreMenu.coreMenu, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreMenu.coreMenu.createContent(vnode, _objectSpread({}, args, {
        Shadow: polytheneReactShadow.Shadow
      }));
    }
  }));
  var MenuToggle = polytheneReactBase.ComponentCreator(polytheneCore.coreConditional);
  MenuToggle["displayName"] = "MenuToggle";
  /**
   * @param {Vnode} props 
   */

  var Menu = function Menu(props) {
    return polytheneReactBase.renderer(MenuToggle, _objectSpread({}, props, {
      placeholderClassName: classes.placeholder,
      instance: MenuInstance
    }));
  };
  Menu["displayName"] = "Menu";

  exports.Menu = Menu;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-menu.js.map
