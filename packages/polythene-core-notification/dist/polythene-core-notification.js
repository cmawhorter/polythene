!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("polythene-core"),require("polythene-utilities")):"function"==typeof define&&define.amd?define(["exports","polythene-core","polythene-utilities"],t):t((e=e||self).polythene={},e["polythene-core"],e["polythene-utilities"])}(this,function(e,t,n){"use strict";function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e}).apply(this,arguments)}function r(e,t){if(null==e)return{};var n,i,r=function(e,t){if(null==e)return{};var n,i,r={},o=Object.keys(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],i=!0,r=!1,o=void 0;try{for(var a,l=e[Symbol.iterator]();!(i=(a=l.next()).done)&&(n.push(a.value),!t||n.length!==t);i=!0);}catch(e){r=!0,o=e}finally{try{i||null==l.return||l.return()}finally{if(r)throw o}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var a={component:"pe-notification",action:"pe-notification__action",content:"pe-notification__content",holder:"pe-notification__holder",placeholder:"pe-notification__placeholder",title:"pe-notification__title",hasContainer:"pe-notification--container",horizontal:"pe-notification--horizontal",multilineTitle:"pe-notification__title--multi-line",vertical:"pe-notification--vertical",visible:"pe-notification--visible"};e._Notification=function(e){var l=e.h,c=e.a,u=e.useState,s=e.useEffect,f=e.useRef,p=e.getRef,d=e.useReducer,h=r(e,["h","a","useState","useEffect","useRef","getRef","useReducer"]),y=o(d(t.transitionStateReducer,t.initialTransitionState),2),v=y[0],m=y[1],S=o(u(),2),g=S[0],b=S[1],w=o(u(!1),2),_=w[0],O=w[1],T=f(),C=f(),j=f(new n.Timer),I=(v||t.initialTransitionState).isVisible,N=(v||t.initialTransitionState).isTransitioning,R=(v||t.initialTransitionState).isHiding,x=j&&j.current,E=function(e){var t=e.isShow,n=e.referrer;return{dispatchTransitionState:m,instanceId:h.instanceId,props:h,isShow:t,beforeTransition:P,afterTransition:t?function(){var e=h.timeout;if(0===e);else{var t=void 0!==e?e:3;x.start(function(){return k()},t)}}:null,domElements:{el:g,containerEl:T.current},showClass:a.visible,referrer:n}},k=function(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}).referrer;return t.transitionComponent(E({isShow:!1,referrer:e}))},P=function(){x&&x.stop()};s(function(){return function(){P()}},[]),s(function(){var e;g&&(t.isClient&&(T.current=document.querySelector(h.containerSelector||h.holderSelector),T.current||console.error("No container element found"),h.containerSelector&&T.current&&T.current.classList.add(a.hasContainer)),C.current=g.querySelector(".".concat(a.title)),C.current&&(e=C.current,t.isServer||e.getBoundingClientRect().height>parseInt(window.getComputedStyle(e).lineHeight,10)+parseInt(window.getComputedStyle(e).paddingTop,10)+parseInt(window.getComputedStyle(e).paddingBottom,10)&&e.classList.add(a.multilineTitle)))},[g]),s(function(){!g||N||R||(h.hide?I&&k():h.show&&(I||t.transitionComponent(E({isShow:!0}))))},[g,N,I,R,h.hide,h.show]),s(function(){!g||N||R||(h.unpause?_&&(O(!1),x&&x.resume()):h.pause&&(_||(O(!0),x&&x.pause())))},[g,N,R,h.pause,h.unpause]);var q,z,A,B=i({},t.filterSupportedAttributes(h,{remove:["style"]}),p(function(e){return e&&!g&&(b(e),h.ref&&h.ref(e))}),h.testId&&{"data-test-id":h.testId},(q={className:[a.component,h.fromMultipleClassName,"light"===h.tone?null:"pe-dark-tone",h.containerSelector?a.hasContainer:null,"vertical"===h.layout?a.vertical:a.horizontal,"dark"===h.tone?"pe-dark-tone":null,"light"===h.tone?"pe-light-tone":null,h.className||h[c.class]].join(" ")},z=c.onclick,A=function(e){return e.preventDefault()},z in q?Object.defineProperty(q,z,{value:A,enumerable:!0,configurable:!0,writable:!0}):q[z]=A,q)),H=l("div",{className:a.content,style:h.style},h.content||[h.title?l("div",{className:a.title},h.title):null,h.action?l("div",{className:a.action},h.action):null]),L=[h.before,H,h.after];return l(h.element||"div",B,L)},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-notification.js.map
