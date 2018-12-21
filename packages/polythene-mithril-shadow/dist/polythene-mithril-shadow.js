!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("mithril")):"function"==typeof define&&define.amd?define(["exports","mithril"],t):t(e.polythene={},e.m)}(this,function(e,t){"use strict";t=t&&t.hasOwnProperty("default")?t.default:t;const n={autocomplete:"autocomplete",autofocus:"autofocus",class:"class",className:"class",enctype:"enctype",formaction:"formaction",frameborder:"frameborder",maxlength:"maxlength",minlength:"minlength",onblur:"onblur",onchange:"onchange",onclick:"onclick",onfocus:"onfocus",oninput:"oninput",onkeydown:"onkeydown",onkeyup:"onkeyup",onmousedown:"onmousedown",onmouseout:"onmouseout",onmouseover:"onmouseover",onmouseup:"onmouseup",onscroll:"onscroll",onsubmit:"onsubmit",ontouchend:"ontouchend",ontouchmove:"ontouchmove",ontouchstart:"ontouchstart",readonly:"readonly",tabindex:"tabindex"},o=t;o.displayName="mithril";var a;(function(e){!function(){var t=0,n={};function o(){function e(){return arguments.length>0&&arguments[0]!==n&&a(e,arguments[0]),e._state.value}return function(e){e.constructor=o,e._state={id:t++,value:void 0,state:0,derive:void 0,recover:void 0,deps:{},parents:[],endStream:void 0,unregister:void 0},e.map=e["fantasy-land/map"]=d,e["fantasy-land/ap"]=c,e["fantasy-land/of"]=o,e.valueOf=l,e.toJSON=p,e.toString=l,Object.defineProperties(e,{end:{get:function(){if(!e._state.endStream){var t=o();t.map(function(n){return!0===n&&(u(e),t._state.unregister=function(){u(t)}),n}),e._state.endStream=t}return e._state.endStream}}})}(e),arguments.length>0&&arguments[0]!==n&&a(e,arguments[0]),e}function a(e,t){for(var n in r(e,t),e._state.deps)s(e._state.deps[n],!1);null!=e._state.unregister&&e._state.unregister(),function(e){for(var t in e._state.changed=!1,e._state.deps)e._state.deps[t]._state.changed=!1}(e)}function r(e,t){e._state.value=t,e._state.changed=!0,2!==e._state.state&&(e._state.state=1)}function s(e,t){var o=e._state.parents;if(o.length>0&&o.every(m)&&(t||o.some(h))){var a=e._state.derive();if(a===n)return!1;r(e,a)}}function i(e,t){if(!t.every(f))throw new Error("Ensure that each item passed to stream.combine/stream.merge is a stream");return function(e,t,n){var o=e._state;return o.derive=n,o.parents=t.filter(v),function e(t,n){for(var o=0;o<n.length;o++)n[o]._state.deps[t._state.id]=t,e(t,n[o]._state.parents)}(e,o.parents),s(e,!0),e}(o(),t,function(){return e.apply(this,t.concat([t.filter(h)]))})}function u(e){for(var t=0;t<e._state.parents.length;t++){delete e._state.parents[t]._state.deps[e._state.id]}for(var n in e._state.deps){var o=e._state.deps[n],a=o._state.parents.indexOf(e);a>-1&&o._state.parents.splice(a,1)}e._state.state=2,e._state.deps={}}function d(e){return i(function(t){return e(t())},[this])}function c(e){return i(function(e,t){return e()(t())},[e,this])}function l(){return this._state.value}function p(){return null!=this._state.value&&"function"==typeof this._state.value.toJSON?this._state.value.toJSON():this._state.value}function f(e){return e._state}function m(e){return 1===e._state.state}function h(e){return e._state.changed}function v(e){return 2!==e._state.state}o["fantasy-land/of"]=o,o.merge=function(e){return i(function(){return e.map(function(e){return e()})},e)},o.combine=i,o.scan=function(e,t,n){var o=i(function(n){return t=e(t,n._state.value)},[n]);return 0===o._state.state&&o(t),o},o.scanMerge=function(e,t){var n=e.map(function(e){var t=e[0];return 0===t._state.state&&t(void 0),t});return i(function(){var o=arguments[arguments.length-1];return n.forEach(function(n,a){o.indexOf(n)>-1&&(t=e[a][1](t,n._state.value))}),t},n)},o.HALT=n,e.exports=o}()})(a={exports:{}},a.exports);const r="undefined"!=typeof document,s=(e,t)=>(e[t]=1,e),i=["key","style","href","id","tabIndex","tabindex","oninit","oncreate","onupdate","onbeforeremove","onremove","onbeforeupdate"],u=!!r&&"ontouchstart"in document.documentElement,d=u?["click","mouseup"]:["mouseup"];r&&document.querySelector("html").classList.add(u?"pe-touch":"pe-no-touch");const c={},l=(e,t)=>{c[e]&&c[e].forEach(e=>e(t))};r&&(window.addEventListener("resize",e=>l("resize",e)),window.addEventListener("scroll",e=>l("scroll",e)),window.addEventListener("keydown",e=>l("keydown",e)),window.addEventListener(d,e=>l(d,e)));var p={component:"pe-shadow",bottomShadow:"pe-shadow__bottom",topShadow:"pe-shadow__top",animated:"pe-shadow--animated",depth_n:"pe-shadow--depth-"};var f=Object.freeze({getElement:e=>e.attrs.element||"div",onMount:({attrs:e})=>{void 0!==e.z&&((e,{option:t,newOption:n,newComponent:o})=>(t&&console.warn(`${e}: option '${t}' is deprecated and will be removed in later versions. Use '${n}' instead.`),o&&!n&&console.warn(`${e}: this component is deprecated and will be removed in later versions. Use '${o}' instead.`),o&&n&&console.warn(`${e}: this component is deprecated and will be removed in later versions. Use '${o}' with option '${n}' instead.`)))("Shadow",{option:"z",newOption:"shadowDepth"})},createProps:(e,{keys:t})=>{const n=e.attrs;return Object.assign({},((e,{add:t=[],remove:n=[]}={})=>{const o=n.reduce(s,{}),a=i.concat(t).filter(e=>!o[e]).reduce(s,{});return Object.keys(e).reduce((t,n)=>(a[n]&&(t[n]=e[n]),t),{})})(n),{className:[p.component,n.animated&&p.animated,n.className||n[t.class]].join(" ")})},createContent:(e,{renderer:t})=>{const n=e.attrs,o=n.content?n.content:n.children||e.children,a=void 0!==n.shadowDepth?n.shadowDepth:n.z,r=void 0!==a?`${p.depth_n}${Math.min(5,a)}`:null;return[o,t("div",{key:"bottom",className:[p.bottomShadow,r].join(" ")}),t("div",{key:"top",className:[p.topShadow,r].join(" ")})]}});const m=(({createContent:e=(()=>{}),createProps:t=(()=>{}),getElement:a=(()=>"div"),component:r=null,view:s=null,onMount:i=(()=>{}),onUnMount:u=(()=>{})})=>{const d=s=>o(r||a(s),t(s,{renderer:o,requiresKeys:!1,keys:n}),[s.attrs.before,e(s,{renderer:o,requiresKeys:!1,keys:n}),s.attrs.after]);return{view:s?e=>s(e,{render:d,renderer:o}):e=>d(e),oncreate:e=>i(e,{keys:n}),onremove:u}})(Object.assign({},f));m.displayName="Shadow",e.Shadow=m,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-mithril-shadow.js.map
