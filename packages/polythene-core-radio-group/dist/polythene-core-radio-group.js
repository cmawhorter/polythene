!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("polythene-core")):"function"==typeof define&&define.amd?define(["exports","polythene-core"],t):t(e.polythene={},e["polythene-core"])}(this,function(e,t){"use strict";var n={component:"pe-radio-group"};var o=Object.freeze({getElement:e=>e.attrs.element||"div",getInitialState:(e,t)=>{const n=t(null);return{checkedIndex:n,redrawOnUpdate:t.merge([n])}},createProps:(e,{keys:o})=>{const r=e.attrs;return Object.assign({},t.filterSupportedAttributes(r),{className:[n.component,"dark"===r.tone?"pe-dark-tone":null,"light"===r.tone?"pe-light-tone":null,r.className||r[o.class]].join(" ")})},createContent:(e,{renderer:t,RadioButton:n})=>{const o=e.attrs,r=e.state,l=r.checkedIndex(),a=o.content?o.content:o.buttons?o.buttons:o.children||e.children||[];return a.length?a.map((e,a)=>{if(!e)return null;void 0===e.value&&console.error("Option 'value' not set for radio button");const c=(e.defaultChecked||e.checked||void 0!==o.defaultSelectedValue&&e.value===o.defaultSelectedValue)&&null===l||e.checked||l===a;return t(n,Object.assign({},{name:o.name,key:e.value},o.all,e,{onChange:({value:e})=>(r.checkedIndex(a),o.onChange&&o.onChange({value:e})),checked:c}))}):null}});e.coreRadioGroup=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-radio-group.js.map
