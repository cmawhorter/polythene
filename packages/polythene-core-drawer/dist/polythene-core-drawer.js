!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.polythene={})}(this,function(e){"use strict";var n={component:"pe-dialog pe-drawer",cover:"pe-drawer--cover",push:"pe-drawer--push",mini:"pe-drawer--mini",permanent:"pe-drawer--permanent",border:"pe-drawer--border",floating:"pe-drawer--floating",fixed:"pe-drawer--fixed",anchorEnd:"pe-drawer--anchor-end"};var r=Object.freeze({createProps:e=>{const r=e.attrs,o=!(r.push||r.permanent||r.mini);return Object.assign({},r,{fullBleed:!0,className:null,parentClassName:[r.className,n.component,o?n.cover:null,r.push?n.push:null,r.permanent?n.permanent:null,r.border?n.border:null,r.mini?n.mini:null,r.floating?n.floating:null,r.fixed?n.fixed:null,"end"===r.anchor?n.anchorEnd:null].join(" "),inactive:r.permanent&&!r.mini,shadowDepth:void 0!==r.shadowDepth?r.shadowDepth:0,z:void 0!==r.z?r.z:void 0})},createContent:e=>e.children});e.coreDrawer=r,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-drawer.js.map
