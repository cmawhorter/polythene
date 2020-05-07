(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-mithril-base'), require('polythene-core-card'), require('polythene-mithril-icon'), require('polythene-mithril-list-tile'), require('polythene-mithril-shadow')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-mithril-base', 'polythene-core-card', 'polythene-mithril-icon', 'polythene-mithril-list-tile', 'polythene-mithril-shadow'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-mithril-base'], global['polythene-core-card'], global['polythene-mithril-icon'], global['polythene-mithril-list-tile'], global['polythene-mithril-shadow']));
}(this, function (exports, polytheneMithrilBase, polytheneCoreCard, polytheneMithrilIcon, polytheneMithrilListTile, polytheneMithrilShadow) { 'use strict';

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
  var CardActions = polytheneMithrilBase.ComponentCreator(polytheneCoreCard.coreCardActions);
  CardActions["displayName"] = "CardActions";

  // @ts-check
  var CardMedia = polytheneMithrilBase.ComponentCreator(polytheneCoreCard.coreCardMedia);
  CardMedia["displayName"] = "CardMedia";

  // @ts-check
  var CardPrimary = polytheneMithrilBase.ComponentCreator(polytheneCoreCard.coreCardPrimary);
  CardPrimary["displayName"] = "CardPrimary";

  var Card = polytheneMithrilBase.ComponentCreator(_objectSpread({}, polytheneCoreCard.coreCard, {
    createContent: function createContent(vnode, args) {
      return polytheneCoreCard.coreCard.createContent(vnode, _objectSpread({}, args, {
        CardActions: CardActions,
        CardMedia: CardMedia,
        CardPrimary: CardPrimary,
        Icon: polytheneMithrilIcon.Icon,
        ListTile: polytheneMithrilListTile.ListTile,
        Shadow: polytheneMithrilShadow.Shadow
      }));
    }
  }));
  Card["displayName"] = "Card";

  exports.Card = Card;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-mithril-card.js.map
