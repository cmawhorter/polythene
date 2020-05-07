(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-radio-group'), require('polythene-mithril-radio-button')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-radio-group', 'polythene-mithril-radio-button'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-radio-group'], global['polythene-mithril-radio-button']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreRadioGroup, polytheneMithrilRadioButton) { 'use strict';

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

  var RadioGroup = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreRadioGroup.coreRadioGroup, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreRadioGroup.coreRadioGroup.createContent(vnode, _extends(args, {
        RadioButton: polytheneMithrilRadioButton.RadioButton
      }));
    }
  }));
  RadioGroup["displayName"] = "RadioGroup";

  exports.RadioGroup = RadioGroup;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-radio-group.js.map
