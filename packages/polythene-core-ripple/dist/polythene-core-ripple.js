!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("polythene-core"),require("polythene-theme")):"function"==typeof define&&define.amd?define(["exports","polythene-core","polythene-theme"],t):t((e=e||self).polythene={},e["polythene-core"],e["polythene-theme"])}(this,function(e,t,n){"use strict";function r(){return(r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function i(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function a(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,i=!1,a=void 0;try{for(var o,c=e[Symbol.iterator]();!(r=(o=c.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(e){i=!0,a=e}finally{try{r||null==c.return||c.return()}finally{if(i)throw a}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var o=t.getAnimationEndEvent(),c=function(e){var r=e.e,i=e.id,a=e.el,c=e.props,s=e.classes;return new Promise(function(e){var u=document.createElement("div");u.setAttribute("class",s.mask),a.appendChild(u);var l=document.createElement("div");l.setAttribute("class",s.waves),u.appendChild(l);var p=a.getBoundingClientRect(),d=t.isTouch&&r.touches?r.touches[0].pageX:r.clientX,f=t.isTouch&&r.touches?r.touches[0].pageY:r.clientY,m=a.offsetWidth,v=a.offsetHeight,h=Math.sqrt(m*m+v*v),y=c.center?p.left+p.width/2:d,g=c.center?p.top+p.height/2:f,b=y-p.left-h/2,w=g-p.top-h/2,E=void 0!==c.startOpacity?c.startOpacity:.2,O=void 0!==c.opacityDecayVelocity?c.opacityDecayVelocity:.35,S=c.endOpacity||0,_=c.startScale||.1,j=c.endScale||2,k=c.duration?c.duration:1/O*.2,x=window.getComputedStyle(a).color,A=l.style;A.width=A.height=h+"px",A.top=w+"px",A.left=b+"px",A["animation-duration"]=A["-webkit-animation-duration"]=A["-moz-animation-duration"]=A["-o-animation-duration"]=k+"s",A.backgroundColor=x,A.opacity=E,A.animationName=i,A.animationTimingFunction=c.animationTimingFunction||n.vars.animation_curve_default;var C="@keyframes ".concat(i," {\n      0% {\n        transform:scale(").concat(_,");\n        opacity: ").concat(E,"\n      }\n      100% {\n        transform:scale(").concat(j,");\n        opacity: ").concat(S,";\n      }\n    }");!function(e,n){if(!t.isServer){var r=window.document,i=r.createElement("style");i.setAttribute("id",e),i.appendChild(r.createTextNode(n)),r.head.appendChild(i)}}(i,C);l.addEventListener(o,function n(r){!function(e){if(!t.isServer){var n=document.getElementById(e);n&&n.parentNode&&n.parentNode.removeChild(n)}}(i),l.removeEventListener(o,n,!1),c.persistent?(A.opacity=S,A.transform="scale("+j+")"):(l.classList.remove(s.wavesAnimating),u.removeChild(l),a.removeChild(u)),e(r)},!1),l.classList.add(s.wavesAnimating)})},s={component:"pe-ripple",mask:"pe-ripple__mask",waves:"pe-ripple__waves",unconstrained:"pe-ripple--unconstrained",wavesAnimating:"pe-ripple__waves--animating"},u=function(e){var t=a((0,e.useState)({}),2),n=t[0],i=t[1];return[n,function(e,t){return i(r({},n,(c=t,(o=e)in(a={})?Object.defineProperty(a,o,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[o]=c,a)));var a,o,c},function(e){var t=r({},n);delete t[e],i(t)}]};e._Ripple=function(e){var n=e.h,o=e.a,l=e.getDom,p=e.useState,d=e.useEffect,f=i(e,["h","a","getDom","useState","useEffect"]),m=a(p(),2),v=m[0],h=m[1],y=a(u({useState:p}),3),g=y[0],b=y[1],w=y[2],E=!!g&&Object.keys(g).length>0,O=f.target||(v?v.parentElement:void 0),S=function(e){if(!f.disabled&&v&&(f.multi||!E)){f.start&&f.start(e);var t="ripple_animation_".concat((new Date).getTime()),n=c({e:e,id:t,el:v,props:f,classes:s}).then(function(e){f.end&&f.end(e),w(t)});b(t,n)}};d(function(){if(O&&O.addEventListener)return t.pointerEndEvent.forEach(function(e){return O.addEventListener(e,S,!1)}),function(){t.pointerEndEvent.forEach(function(e){return O.removeEventListener(e,S,!1)})}},[O]);var _=r({},t.filterSupportedAttributes(f),l(function(e){return e&&!v&&h(e)}),f.testId&&{"data-test-id":f.testId},{className:[s.component,f.unconstrained?s.unconstrained:null,"dark"===f.tone?"pe-dark-tone":null,"light"===f.tone?"pe-light-tone":null,f.className||f[o.class]].join(" ")});return n(f.element||"div",_)},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-ripple.js.map
