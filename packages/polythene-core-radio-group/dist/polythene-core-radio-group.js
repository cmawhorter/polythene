!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("polythene-core")):"function"==typeof define&&define.amd?define(["exports","polythene-core"],t):t((e=e||self).polythene={},e["polythene-core"])}(this,function(e,t){"use strict";function n(){return(n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}var r={component:"pe-radio-group"},o=function(e){var t=e.attrs;return t.content?t.content:t.buttons?t.buttons:t.children||e.children||[]},a=Object.freeze({getElement:function(e){return e.attrs.element||"div"},getInitialState:function(e,n){var r=e.attrs;void 0!==r.defaultSelectedValue&&t.deprecation("RadioGroup",{option:"defaultSelectedValue",newOption:"defaultCheckedValue",since:"1.4.2"});var a=n(o(e).reduce(function(e,t,n){return void 0===t.value&&console.error("Option 'value' not set for radio button"),null!==e?e:void 0!==t.defaultChecked||void 0!==r.defaultCheckedValue&&t.value===r.defaultCheckedValue||void 0!==r.defaultSelectedValue&&t.value===r.defaultSelectedValue?n:e},null));return{checkedIndex:a,redrawOnUpdate:n.merge([a])}},createProps:function(e,o){var a=o.keys,u=e.attrs;return n({},t.filterSupportedAttributes(u),{className:[r.component,"dark"===u.tone?"pe-dark-tone":null,"light"===u.tone?"pe-light-tone":null,u.className||u[a.class]].join(" ")})},createContent:function(e,t){var r=t.renderer,a=t.RadioButton,u=e.attrs,l=e.state,c=l.checkedIndex(),d=o(e),i=u.checkedValue;return d.length?d.map(function(e,t){if(!e)return null;var o=void 0!==e.checked?e.checked:void 0!==i?e.value===i:c===t;return r(a,n({},{name:u.name,key:e.value},u.all,e,{onChange:function(e){var n=e.value;return l.checkedIndex(t),u.onChange&&u.onChange({value:n})},checked:o}))}):null}});e.coreRadioGroup=a,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-radio-group.js.map
