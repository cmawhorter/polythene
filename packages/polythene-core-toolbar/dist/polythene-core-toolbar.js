!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("polythene-core")):"function"==typeof define&&define.amd?define(["exports","polythene-core"],t):t((e=e||self).polythene={},e["polythene-core"])}(this,function(e,t){"use strict";function n(){return(n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}var o={component:"pe-toolbar",compact:"pe-toolbar--compact",appBar:"pe-toolbar--app-bar",title:"pe-toolbar__title",centeredTitle:"pe-toolbar__title--center",indentedTitle:"pe-toolbar__title--indent",fullbleed:"pe-toolbar--fullbleed",border:"pe-toolbar--border"},r=Object.freeze({getElement:function(e){return e.attrs.element||"div"},onMount:function(e){void 0!==e.attrs.z&&t.deprecation("Toolbar",{option:"z",newOption:"shadowDepth"})},createProps:function(e,r){var l=r.keys,a=e.attrs;return n({},t.filterSupportedAttributes(a),{className:[o.component,a.compact?o.compact:null,a.fullbleed?o.fullbleed:null,a.border?o.border:null,"dark"===a.tone?"pe-dark-tone":null,"light"===a.tone?"pe-light-tone":null,a.className||a[l.class]].join(" ")},a.events)},createContent:function(e,t){var n=t.renderer,o=t.Shadow,r=e.attrs,l=r.content?r.content:r.children||e.children,a=void 0!==r.shadowDepth?r.shadowDepth:r.z;return[l,void 0!==a?n(o,{shadowDepth:a,animated:!0,key:"shadow"}):null]}}),l=Object.freeze({getElement:function(e){var t=e.attrs;return t.element?t.element:t.url?"a":"div"},createProps:function(e,r){var l=r.keys,a=e.attrs;return n({},t.filterSupportedAttributes(a),{className:[o.title,a.indent?o.indentedTitle:null,a.center?o.centeredTitle:null,"dark"===a.tone?"pe-dark-tone":null,"light"===a.tone?"pe-light-tone":null,a.className||a[l.class]].join(" ")},a.events,a.url)},createContent:function(e){var t=e.attrs;return t.text?t.text:t.content?t.content:t.children||e.children||t}});e.coreToolbar=r,e.coreToolbarTitle=l,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-toolbar.js.map
