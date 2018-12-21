!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("polythene-core")):"function"==typeof define&&define.amd?define(["exports","polythene-core"],t):t(e.polythene={},e["polythene-core"])}(this,function(e,t){"use strict";var n={component:"pe-control",formLabel:"pe-control__form-label",input:"pe-control__input",label:"pe-control__label",disabled:"pe-control--disabled",inactive:"pe-control--inactive",large:"pe-control--large",medium:"pe-control--medium",off:"pe-control--off",on:"pe-control--on",regular:"pe-control--regular",small:"pe-control--small",box:"pe-control__box",button:"pe-control__button",buttonOff:"pe-control__button--off",buttonOn:"pe-control__button--on"};const o=(e,t)=>{const n=void 0!==e.checked?e.checked:t.checked(),o=void 0!==e.selectable&&e.selectable(n);return{checked:n,inactive:e.disabled||!o}};var l=Object.freeze({getElement:e=>e.attrs.element||"div",getInitialState:(e,t,{keys:n})=>{const o=e.attrs,l=t(void 0!==o.defaultChecked?o.defaultChecked:o.checked||!1),c=(e,t)=>{o.onChange&&o.onChange({event:e,checked:t,value:o.value})},a=e=>{const t=!l();l(t),c(e,t)},r=o.events&&o.events[n.onclick],s=o.events&&o.events[n.onkeydown]?o.events[n.onkeydown]:e=>{"Enter"!==e.key&&32!==e.keyCode||(e.preventDefault(),r?r(e):a(e))};return{checked:l,toggle:a,onChange:e=>{let t=e.currentTarget.checked;"radio"===o.type||l(t),c(e,t)},viewControlClickHandler:r,viewControlKeyDownHandler:s,redrawOnUpdate:t.merge([l])}},createProps:(e,{keys:l})=>{const c=e.attrs,a=e.state,{checked:r,inactive:s}=o(c,a);return Object.assign({},t.filterSupportedAttributes(c),{className:[n.component,c.instanceClass,r?n.on:n.off,c.disabled?n.disabled:null,s?n.inactive:null,t.classForSize(n,c.size),"dark"===c.tone?"pe-dark-tone":null,"light"===c.tone?"pe-light-tone":null,c.className||c[l.class]].join(" ")})},createContent:(e,{renderer:t,keys:l,ViewControl:c})=>{const a=e.state,r=e.attrs,{checked:s,inactive:i}=o(r,a);return t("label",Object.assign({},{className:n.formLabel},a.viewControlClickHandler&&{[l.onclick]:e=>(e.preventDefault(),a.viewControlClickHandler(e))}),[t(c,Object.assign({},r,{inactive:i,checked:s,key:"control",events:{[l.onkeydown]:a.viewControlKeyDownHandler}})),r.label?t(`.${n.label}`,{key:"label"},r.label):null,t("input",Object.assign({},r.events,{name:r.name,type:r.type,value:r.value,checked:s},r.disabled||i?{disabled:"disabled"}:{[l.onchange]:a.onChange}))])}});const c=[{iconType:"iconOn",className:n.buttonOn},{iconType:"iconOff",className:n.buttonOff}];var a=Object.freeze({getElement:e=>e.attrs.element||`.${n.box}`,createContent:(e,{renderer:t,Icon:o,IconButton:l})=>{const a=e.attrs;return t(l,Object.assign({},{element:"div",key:a.key,className:n.button,content:c.map(e=>t(o,((e,t,n,o)=>Object.assign({},{className:o,key:t},n[t]?n[t]:{svg:{content:e.trust(n.icons[t])}},n.icon,n.size?{size:n.size}:null))(t,e.iconType,a,e.className))),ripple:{center:!0},disabled:a.disabled,events:a.events,inactive:a.inactive},a.iconButton))}});e.coreSelectionControl=l,e.viewControl=a,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-selection-control.js.map
