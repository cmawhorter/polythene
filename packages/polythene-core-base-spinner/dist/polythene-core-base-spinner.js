!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("polythene-core")):"function"==typeof define&&define.amd?define(["exports","polythene-core"],n):n((e=e||self).polythene={},e["polythene-core"])}(this,function(e,n){"use strict";function t(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(){return(r=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e}).apply(this,arguments)}function i(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}function o(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=[],r=!0,i=!1,o=void 0;try{for(var a,l=e[Symbol.iterator]();!(r=(a=l.next()).done)&&(t.push(a.value),!n||t.length!==n);r=!0);}catch(e){i=!0,o=e}finally{try{r||null==l.return||l.return()}finally{if(i)throw o}}return t}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var a={component:"pe-spinner",animation:"pe-spinner__animation",placeholder:"pe-spinner__placeholder",animated:"pe-spinner--animated",fab:"pe-spinner--fab",large:"pe-spinner--large",medium:"pe-spinner--medium",permanent:"pe-spinner--permanent",raised:"pe-spinner--raised",regular:"pe-spinner--regular",singleColor:"pe-spinner--single-color",small:"pe-spinner--small",visible:"pe-spinner--visible"},l=function(e){return n.transitionComponent(function(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{},i=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),i.forEach(function(n){t(e,n,r[n])})}return e}({},e,{isShow:!0}))};e._BaseSpinner=function(e){var t=e.h,s=e.a,p=e.useState,u=e.useEffect,f=e.getRef,c=e.Shadow,d=i(e,["h","a","useState","useEffect","getRef","Shadow"]),m=o(p(!1),2),y=m[0],b=m[1],h=o(p(!!d.permanent),2),g=h[0],v=h[1],O=o(p(),2),w=O[0],j=O[1],S={isTransitioning:y,setIsTransitioning:b,setIsVisible:v,attrs:d,domElements:{el:w},showClass:a.visible};u(function(){w&&(d.permanent||l(S))},[w]);var P=r({},n.filterSupportedAttributes(d),f(function(e){return e&&!w&&(j(e),d.ref&&d.ref(e))}),d.testId&&{"data-test-id":d.testId},{className:[a.component,d.instanceClass,n.classForSize(a,d.size),d.singleColor?a.singleColor:null,d.raised?a.raised:null,d.animated?a.animated:null,d.permanent?a.permanent:null,g?a.visible:null,d.className||d[s.class]].join(" ")},d.events),_=[d.before,d.content,d.after].filter(Boolean);return t("div",P,[d.raised&&_.length>0?t(c,{key:"shadow",shadowDepth:d.shadowDepth}):null,_])},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-base-spinner.js.map
