(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('polythene-react-base'), require('polythene-core'), require('polythene-core-notification')) :
  typeof define === 'function' && define.amd ? define(['exports', 'polythene-react-base', 'polythene-core', 'polythene-core-notification'], factory) :
  (global = global || self, factory(global.polythene = {}, global['polythene-react-base'], global['polythene-core'], global['polythene-core-notification']));
}(this, function (exports, polytheneReactBase, polytheneCore, polytheneCoreNotification) { 'use strict';

  var classes = {
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

  // @ts-check
  var NotificationInstance = polytheneReactBase.ComponentCreator(polytheneCoreNotification.coreNotification);
  NotificationInstance["displayName"] = "NotificationInstance";
  var options = {
    name: "notification",
    className: classes.component,
    htmlShowClass: classes.open,
    defaultId: "default_notification",
    holderSelector: ".".concat(classes.holder),
    instance: NotificationInstance,
    placeholder: "span.".concat(classes.placeholder),
    queue: true
  };
  var Multiple = polytheneCore.Multi({
    options: options,
    renderer: polytheneReactBase.renderer
  });
  var Notification = polytheneReactBase.ComponentCreator(Multiple);
  Object.getOwnPropertyNames(Multiple).forEach(function (p) {
    return Notification[p] = Multiple[p];
  });
  Notification["displayName"] = "Notification";

  exports.NotificationInstance = NotificationInstance;
  exports.Notification = Notification;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=polythene-react-notification.js.map
