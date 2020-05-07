(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-tabs'), require('polythene-mithril-icon'), require('polythene-mithril-button'), require('polythene-mithril-icon-button')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-tabs', 'polythene-mithril-icon', 'polythene-mithril-button', 'polythene-mithril-icon-button'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-tabs'], global['polythene-mithril-icon'], global['polythene-mithril-button'], global['polythene-mithril-icon-button']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreTabs, polytheneMithrilIcon, polytheneMithrilButton, polytheneMithrilIconButton) { 'use strict';

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

  var Tab = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreTabs.coreTab, {
    createProps: function createProps(vnode, args) {
      return polytheneCoreTabs.coreTab.createProps(vnode, _extends(args, {
        Icon: polytheneMithrilIcon.Icon
      }));
    },
    component: polytheneMithrilButton.Button
  }));
  Tab["displayName"] = "Tab";

  var ScrollButton = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreTabs.coreScrollButton, {
    component: polytheneMithrilIconButton.IconButton
  }));
  ScrollButton["displayName"] = "ScrollButton";

  var Tabs = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreTabs.coreTabs, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreTabs.coreTabs.createContent(vnode, _extends(args, {
        Tab: Tab,
        ScrollButton: ScrollButton
      }));
    }
  }));
  Tabs["displayName"] = "Tabs";

  exports.Tabs = Tabs;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-tabs.js.map
