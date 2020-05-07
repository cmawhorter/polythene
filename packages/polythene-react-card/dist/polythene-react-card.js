(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core-card'), require('polythene-react-icon'), require('polythene-react-list-tile'), require('polythene-react-shadow')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core-card', 'polythene-react-icon', 'polythene-react-list-tile', 'polythene-react-shadow'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core-card'], global['polythene-react-icon'], global['polythene-react-list-tile'], global['polythene-react-shadow']));
}(this, function (exports, polytheneReactBase, polytheneCoreCard, polytheneReactIcon, polytheneReactListTile, polytheneReactShadow) { 'use strict';

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

  // @ts-check
  var CardActions = polytheneReactBase.ComponentCreator(polytheneCoreCard.coreCardActions);
  CardActions["displayName"] = "CardActions";

  // @ts-check
  var CardMedia = polytheneReactBase.ComponentCreator(polytheneCoreCard.coreCardMedia);
  CardMedia["displayName"] = "CardMedia";

  // @ts-check
  var CardPrimary = polytheneReactBase.ComponentCreator(polytheneCoreCard.coreCardPrimary);
  CardPrimary["displayName"] = "CardPrimary";

  var Card = polytheneReactBase.ComponentCreator(_objectSpread({}, polytheneCoreCard.coreCard, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreCard.coreCard.createContent(vnode, _objectSpread({}, args, {
        CardActions: CardActions,
        CardMedia: CardMedia,
        CardPrimary: CardPrimary,
        Icon: polytheneReactIcon.Icon,
        ListTile: polytheneReactListTile.ListTile,
        Shadow: polytheneReactShadow.Shadow
      }));
    }
  }));
  Card["displayName"] = "Card";

  exports.Card = Card;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-card.js.map
