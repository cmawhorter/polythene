!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("polythene-core")):"function"==typeof define&&define.amd?define(["exports","polythene-core"],t):t((e=e||self).polythene={},e["polythene-core"])}(this,function(e,t){"use strict";function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(){return(r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}function u(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},u=Object.keys(e);for(o=0;o<u.length;o++)n=u[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(o=0;o<u.length;o++)n=u[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}function a(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],o=!0,r=!1,u=void 0;try{for(var a,i=e[Symbol.iterator]();!(o=(a=i.next()).done)&&(n.push(a.value),!t||n.length!==t);o=!0);}catch(e){r=!0,u=e}finally{try{o||null==i.return||i.return()}finally{if(r)throw u}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var i={component:"pe-text-button",super:"pe-button",row:"pe-button-row",content:"pe-button__content",label:"pe-button__label",textLabel:"pe-button__text-label",wash:"pe-button__wash",dropdown:"pe-button__dropdown",border:"pe-button--border",contained:"pe-button--contained",disabled:"pe-button--disabled",dropdownClosed:"pe-button--dropdown-closed",dropdownOpen:"pe-button--dropdown-open",extraWide:"pe-button--extra-wide",hasDropdown:"pe-button--dropdown",highLabel:"pe-button--high-label",inactive:"pe-button--inactive",raised:"pe-button--raised",selected:"pe-button--selected",separatorAtStart:"pe-button--separator-start"},l=[],s=function(e){var t=e.which,n=e.getButtonProps;"down"===t&&l.push(n),function(e,t){var n=t(),o=n.shadowDepthBase,r=n.shadowDepthRef,u=n.setShadowDepth,a=n.increase,i="down"===e&&o<5?Math.min(o+a,5):"up"===e?Math.max(r.current-a,o):r.current;i!==r.current&&u(i)}(t,n)},d=function(e){var n=e.useState,o=e.useEffect,r=e.useRef,i=e.domElement,d=u(e,["useState","useEffect","useRef","domElement"]),c=a(n(void 0!==d.shadowDepth?d.shadowDepth:1),1)[0],p=function(e){var t=e.useState,n=e.useRef;return function(e){var o=n(e),r=a(t(o.current),2)[1];return[o,function(e){return o.current=e,r(o.current)}]}}({useState:n,useRef:r})(c),f=a(p,2),b=f[0],v=f[1],h=d.increase||1,m=!1!==d.animateOnTap,y=function(){return{shadowDepthBase:c,shadowDepthRef:b,setShadowDepth:v,increase:h}};return o(function(){if(!t.isServer&&i&&m){var e=function(){return s({which:"down",getButtonProps:y})},n=function(){l.map(function(e){return s({which:"up",getButtonProps:e})}),l.length=0};return t.pointerStartMoveEvent.forEach(function(t){return i.addEventListener(t,e)}),t.pointerEndMoveEvent.forEach(function(e){return document.addEventListener(e,n)}),function(){t.pointerStartMoveEvent.forEach(function(t){return i.removeEventListener(t,e)}),t.pointerEndMoveEvent.forEach(function(e){return document.removeEventListener(e,n)})}}},[i]),[d.disabled?0:b.current]};e._Button=function(e){var l,s=e.h,c=e.a,p=e.getDom,f=e.useState,b=e.useEffect,v=e.useRef,h=e.Ripple,m=e.Shadow,y=e.Icon,w=u(e,["h","a","getDom","useState","useEffect","useRef","Ripple","Shadow","Icon"]),E=a(f(),2),S=E[0],g=E[1],O=a(f(w.inactive),2),L=O[0],x=O[1],D=a(f(!1),2),k=D[0],j=D[1],_=a(f(!1),2),P=_[0],R=_[1],N=w.disabled,M=w.inactive||L,A=w.events&&w.events[c.onclick],B=w.events&&w.events[c.onkeyup]||A,I=a(w.raised?d(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){o(e,t,n[t])})}return e}({useState:f,useEffect:b,useRef:v,domElement:S},w)):[0],1)[0],C=function(){return x(!0),setTimeout(function(){return x(!1)},1e3*w.inactivate)};b(function(){if(S&&S.addEventListener){var e=function(){return j(!P)},t=function(){return j(!1)},n=function(){return R(!1)},o=C;return S.addEventListener("focus",e,!1),S.addEventListener("blur",t,!1),S.addEventListener("mouseover",function(){return R(!0)},!1),S.addEventListener("mouseout",n,!1),S.addEventListener("click",o,!1),function(){S.removeEventListener("focus",e,!1),S.removeEventListener("blur",t,!1),S.removeEventListener("mouseover",t,!1),S.removeEventListener("mouseout",n,!1),S.removeEventListener("click",o,!1)}}},[S]);var T=r({},t.filterSupportedAttributes(w,{add:[c.formaction,"type"],remove:["style"]}),p(function(e){return e&&!S&&(g(e),w.getDom&&w.getDom(e))}),w.testId&&{"data-test-id":w.testId},{className:[i.super,w.parentClassName||i.component,w.contained?i.contained:null,w.raised?i.contained:null,w.raised?i.raised:null,w.selected?i.selected:null,w.highLabel?i.highLabel:null,w.extraWide?i.extraWide:null,N?i.disabled:null,M?i.inactive:null,w.separatorAtStart?i.separatorAtStart:null,w.border||w.borders?i.border:null,w.dropdown?i.hasDropdown:null,w.dropdown?w.dropdown.open?i.dropdownOpen:i.dropdownClosed:null,"dark"===w.tone?"pe-dark-tone":null,"light"===w.tone?"pe-light-tone":null,w.className||w[c.class]].join(" ")},w.events,M?null:(o(l={},c.tabindex,N||M?-1:w[c.tabindex]||0),o(l,c.onclick,A),o(l,c.onkeyup,function(e){13===e.keyCode&&k&&(j(!1),B&&B(e))}),l),w.url,N?{disabled:!0}:null),W=void 0!==w.ink&&!1===w.ink,q=w.content?w.content:void 0!==w.label?"object"===n(w.label)?w.label:s("div",{className:i.label},s("div",{className:i.textLabel,style:w.textStyle},w.label)):w.children,z=N||w.raised&&!0!==w.wash||void 0!==w.wash&&!w.wash;return s(w.element||"div",T,s("div",{className:i.content,style:w.style},[s(m,{key:"shadow",shadowDepth:void 0!==I?I:0,animated:!0}),N||W?null:s(h,r({},{key:"ripple",target:S},w.ripple)),z?null:s("div",{key:"wash",className:i.wash}),q,w.dropdown?s(y,{className:i.dropdown,key:"dropdown",svg:{content:s.trust(t.iconDropdownDown)}}):null]))},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-button.js.map
