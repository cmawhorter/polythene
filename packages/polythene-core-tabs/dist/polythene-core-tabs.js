!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("polythene-core"),require("polythene-utilities")):"function"==typeof define&&define.amd?define(["exports","polythene-core","polythene-utilities"],e):e((t=t||self).polythene={},t["polythene-core"],t["polythene-utilities"])}(this,function(t,e,n){"use strict";function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function r(){return(r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t}).apply(this,arguments)}function a(t,e){if(null==t)return{};var n,o,r=function(t,e){if(null==t)return{};var n,o,r={},a=Object.keys(t);for(o=0;o<a.length;o++)n=a[o],e.indexOf(n)>=0||(r[n]=t[n]);return r}(t,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(o=0;o<a.length;o++)n=a[o],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(r[n]=t[n])}return r}function i(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],o=!0,r=!1,a=void 0;try{for(var i,l=t[Symbol.iterator]();!(o=(i=l.next()).done)&&(n.push(i.value),!e||n.length!==e);o=!0);}catch(t){r=!0,a=t}finally{try{o||null==l.return||l.return()}finally{if(r)throw a}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function l(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var c={component:"pe-tabs",indicator:"pe-tabs__indicator",scrollButton:"pe-tabs__scroll-button",scrollButtonAtEnd:"pe-tabs__scroll-button-end",scrollButtonAtStart:"pe-tabs__scroll-button-start",tab:"pe-tab",tabContent:"pe-tabs__tab-content",tabRow:"pe-tabs__row",activeSelectable:"pe-tabs__active--selectable",isAtEnd:"pe-tabs--end",isAtStart:"pe-tabs--start",isAutofit:"pe-tabs--autofit",isMenu:"pe-tabs--menu",scrollable:"pe-tabs--scrollable",compactTabs:"pe-tabs--compact",tabHasIcon:"pe-tabs__tab--icon",tabRowCentered:"pe-tabs__row--centered",tabRowIndent:"pe-tabs__row--indent",label:"pe-button__label"},s=function(t){return t.content?t.content:t.tabs?t.tabs:t.children||[]},u=function(t,e){return t<e?1:t>e?-1:0},d='<svg width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',f='<svg width="24" height="24" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';t._Tabs=function(t){var d=t.h,f=t.a,b=t.getRef,p=t.useState,v=t.useEffect,h=t.ScrollButton,m=t.Tab,g=a(t,["h","a","getRef","useState","useEffect","ScrollButton","Tab"]),y=s(g);if(0===y.length)throw new Error("No tabs specified");var w=i(p(),2),_=w[0],x=w[1],S=i(p(!1),2),T=S[0],A=S[1],B=function(t){var e=s(t),n=Array.isArray(e)?e.reduce(function(t,e,n){return void 0===t&&!e.disabled&&e.selected?n:t},void 0):void 0;if(void 0!==n)return n;var o=void 0!==t.selectedTabIndex?t.selectedTabIndex:void 0!==t.selectedTab?t.selectedTab:void 0;return void 0!==o?o:0}(g)||0,I=i(p(B),2),R=I[0],k=I[1],O=i(p(!1),2),j=O[0],L=O[1],E=i(p(!1),2),N=E[0],C=E[1],M=i(p([]),2),P=M[0],q=M[1],z=i(p(),2),W=z[0],H=z[1],D=g.scrollable&&!e.isTouch,F=_&&_.querySelector(".".concat(c.tabRow)),X=_&&_.querySelector(".".concat(c.indicator)),G=!!_&&P.length===y.length;v(function(){if(F){var t=l(F.querySelectorAll("[data-index]")).map(function(t){var e=parseInt(t.getAttribute("data-index"),10);return{dom:t,options:y[e]}});t&&q(t)}},[F]);var J=function(t,e){t.stopPropagation(),t.preventDefault();var n=function(t,e){var n=e.length-1;return{backward:Math.max(t-1,0),forward:Math.min(t+1,n)}}(R,P)[e];n!==R?U({index:n,animate:!0}):Q(n)},K=function(){var t=F.scrollLeft,e=P.length-1,n=0===F.scrollLeft&&0===R,o=t>=F.scrollWidth-_.getBoundingClientRect().width-1&&R===e;L(n),C(o)},Q=function(t){var e=F,o=P.slice(0,t).reduce(function(t,e){return t+e.dom.getBoundingClientRect().width},0),r=e.getBoundingClientRect().width,a=e.scrollWidth-r,i=T?-1*Math.min(o,a):Math.min(o,a),l=e.scrollLeft;if(l!==i){var c=Math.abs(l-i)/600;setTimeout(function(){n.scrollTo({element:e,to:i,duration:Math.max(.5,c),direction:"horizontal"}).then(K)},150)}},U=function(t){var e=t.index,n=t.animate;if(P.length){k(e);var o=P[e].dom;o&&function(t){var e=t.selectedTabElement,n=t.animate;if(X){var o=_.getBoundingClientRect(),r=e.getBoundingClientRect(),a=D?r.height:0,i=T?r.right-o.right+F.scrollLeft+a:r.left-o.left+F.scrollLeft-a,l=1/(o.width-2*a)*r.width,c="translate(".concat(i,"px, 0) scaleX(").concat(l,")"),s=n?.25:0,u=X.style;u["transition-duration"]=s+"s",u.opacity=1,u.transform=c}}({selectedTabElement:o,animate:n}),D&&K(),Q(e),g.onChange&&g.onChange({index:e,options:P[e].options,el:o})}};v(function(){if(G){A(e.isRTL({element:_}));var t=function(){return function(){if(g.largestWidth){var t=P.map(function(t){return t.dom.getBoundingClientRect().width}).sort(u)[0];P.forEach(function(e){return e.dom.style.width=t+"px"})}}(),U({index:R,animate:!1})},n=function(e){var n=e.name;return"active"===n||"inactive"===n?t():null};return e.subscribe("resize",t),e.subscribe("webfontloader",n),t(),function(){e.unsubscribe("resize",t),e.unsubscribe("webfontloader",n)}}},[G]);var V=!g.scrollable&&!g.centered&&!!g.autofit;void 0!==B&&W!==B&&U({index:B,animate:!0}),W!==B&&H(B);var Y=r({},b(function(t){return t&&!_&&x(t)}),e.filterSupportedAttributes(g),g.testId&&{"data-test-id":g.testId},{className:[c.component,g.scrollable?c.scrollable:null,j?c.isAtStart:null,N?c.isAtEnd:null,g.activeSelected?c.activeSelectable:null,V?c.isAutofit:null,g.compact?c.compactTabs:null,g.menu?c.isMenu:null,"dark"===g.tone?"pe-dark-tone":null,"light"===g.tone?"pe-light-tone":null,g.className||g[f.class]].join(" ")}),Z=y.map(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0,n=r({},t,{selected:e===R,animateOnTap:!1!==g.animateOnTap},g.all,{index:e,key:t.key||"tab-".concat(e),onSelect:function(){return U({index:e,animate:!g.noIndicatorSlide})}});return d(m,n)}),$=null,tt=null;g.scrollable&&($=d(h,r({},{key:"backward",icon:g.scrollIconBackward,className:c.scrollButtonAtStart,position:"start",events:o({},f.onclick,function(t){return J(t,"backward")}),isRTL:T})),tt=d(h,r({},{key:"forward",icon:g.scrollIconForward,className:c.scrollButtonAtEnd,position:"end",events:o({},f.onclick,function(t){return J(t,"forward")}),isRTL:T})));var et=g.hideIndicator?null:d("div",{key:"indicator",className:c.indicator});return d("div",Y,[g.before,$,d("div",{key:"tabrow",className:[c.tabRow,g.centered?c.tabRowCentered:null,g.scrollable?c.tabRowIndent:null].join(" ")},[Z,et]),tt,g.after])},t._Tab=function(t){var e=t.h,n=t.a,i=t.Button,l=t.Icon,s=a(t,["h","a","Button","Icon"]),u=s.events||{};u[n.onclick]=u[n.onclick]||function(){};var d=r({},s,s.testId&&{"data-test-id":s.testId},{"data-index":s.index,content:e("div",{className:c.tabContent},[s.icon?e(l,s.icon):null,s.label?e("div",{className:c.label},e("span",s.label)):null]),className:[c.tab,s.icon&&s.label?c.tabHasIcon:null,s.className||s[n.class]].join(" "),selected:s.selected,wash:!1,ripple:!0,events:r({},u,o({},n.onclick,function(t){s.onSelect(),u[n.onclick](t)}))});return e(i,d,s.children)},t._ScrollButton=function(t){var e=t.h,n=t.a,o=t.IconButton,i=a(t,["h","a","IconButton"]),l="start"===i.position?i.icon||{svg:{content:e.trust(i.isRTL?f:d)}}:i.icon||{svg:{content:e.trust(i.isRTL?d:f)}};return e(o,r({},{className:[c.scrollButton,i.className||i[n.class]].join(" "),icon:l,ripple:{center:!0},events:i.events}))},Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-tabs.js.map
