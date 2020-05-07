(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.polythene = {}));
}(this, function (exports) { 'use strict';

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

  var classes = {
    component: "pe-button-group"
  };

  var createProps = function createProps(vnode, _ref) {
    var k = _ref.keys;
    var attrs = vnode.attrs;
    return _extends({}, {
      className: [classes.component, attrs.className || attrs[k.class]].join(" ")
    });
  };
  var createContent = function createContent(vnode) {
    return vnode.children;
  };

  var buttonGroup = /*#__PURE__*/Object.freeze({
    createProps: createProps,
    createContent: createContent
  });

  exports.coreButtonGroup = buttonGroup;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-core-button-group.js.map
