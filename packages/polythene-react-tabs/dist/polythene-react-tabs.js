(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-tabs'), require('polythene-react-icon'), require('polythene-react-button'), require('polythene-react-icon-button')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-tabs', 'polythene-react-icon', 'polythene-react-button', 'polythene-react-icon-button'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-tabs'], global['polythene-react-icon'], global['polythene-react-button'], global['polythene-react-icon-button']));
}(this, function (exports, polytheneReactBase, polytheneCoreTabs, polytheneReactIcon, polytheneReactButton, polytheneReactIconButton) { 'use strict';

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

  var Tab = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreTabs.coreTab, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreTabs.coreTab.createProps(vnode, _objectSpread({}, args, {
        Icon: polytheneReactIcon.Icon
      }));
    },
    component: polytheneReactButton.Button
  }));
  Tab["displayName"] = "Tab";

  var ScrollButton = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreTabs.coreScrollButton, {
    component: polytheneReactIconButton.IconButton
  }));
  ScrollButton["displayName"] = "ScrollButton";

  var Tabs = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreTabs.coreTabs, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreTabs.coreTabs.createContent(vnode, _objectSpread({}, args, {
        Tab: Tab,
        ScrollButton: ScrollButton
      }));
    }
  }));
  Tabs["displayName"] = "Tabs";

  exports.Tabs = Tabs;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-tabs.js.map
