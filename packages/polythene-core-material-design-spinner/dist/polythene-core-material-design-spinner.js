!function(e,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports):"function"==typeof define&&define.amd?define(["exports"],i):i(e.polythene={})}(this,function(e){"use strict";var i={component:"pe-md-spinner",animation:"pe-md-spinner__animation",circle:"pe-md-spinner__circle",circleClipper:"pe-md-spinner__circle-clipper",circleClipperLeft:"pe-md-spinner__circle-clipper-left",circleClipperRight:"pe-md-spinner__circle-clipper-right",gapPatch:"pe-md-spinner__gap-patch",layer:"pe-md-spinner__layer",layerN:"pe-md-spinner__layer-"};var c=Object.freeze({createProps:(e,{renderer:c})=>{const r=e.state,n=e.attrs;return r.content=r.content||c("div",{key:"content",className:i.animation},[1,2,3,4].map(e=>((e,c)=>c("div",{key:e,className:[i.layer,i.layerN+e].join(" ")},[c("div",{key:"clipper-left",className:[i.circleClipper,i.circleClipperLeft].join(" ")},c("div",{key:"circle",className:i.circle})),c("div",{key:"gap-patch",className:i.gapPatch},c("div",{className:i.circle})),c("div",{key:"clipper-right",className:[i.circleClipper,i.circleClipperRight].join(" ")},c("div",{className:i.circle}))]))(e,c))),Object.assign({},n,{className:[i.component,n.className].join(" "),content:r.content})}});e.coreMaterialDesignSpinner=c,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-material-design-spinner.js.map
