!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?o(exports,require("polythene-mithril-base"),require("polythene-core"),require("polythene-core-dialog"),require("polythene-mithril-dialog-pane"),require("polythene-mithril-shadow")):"function"==typeof define&&define.amd?define(["exports","polythene-mithril-base","polythene-core","polythene-core-dialog","polythene-mithril-dialog-pane","polythene-mithril-shadow"],o):o(e.polythene=e.polythene||{},e["polythene-mithril-base"],e["polythene-core"],e["polythene-core-dialog"],e["polythene-mithril-dialog-pane"],e["polythene-mithril-shadow"])}(this,function(e,o,t,n,a,r){"use strict";var i=Object.assign||function(e){for(var o=1;o<arguments.length;o++){var t=arguments[o];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e},l=o.StateComponent(i({},n.coreDialogInstance,{createProps:function(e,o){return n.coreDialogInstance.createProps(e,i(o,{Shadow:r.Shadow,DialogPane:a.DialogPane}))},createContent:function(e,o){return n.coreDialogInstance.createContent(e,i(o,{Shadow:r.Shadow,DialogPane:a.DialogPane}))}}));l.displayName="DialogInstance";var s={name:"dialog",bodyShowClass:n.classes.open,defaultId:"default_dialog",holderSelector:"div."+n.classes.holder,instance:l,placeholder:"span."+n.classes.placeholder,transitions:n.transitions},h=t.Multi({options:s,renderer:o.renderer}),c=o.StateComponent(h);Object.getOwnPropertyNames(h).forEach(function(e){return c[e]=h[e]}),c.theme=n.coreDialogInstance.theme,c.displayName="Dialog",e.DialogInstance=l,e.Dialog=c,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-mithril-dialog.js.map
