function e(){}function t(e,t){for(const n in t)e[n]=t[n];return e}function n(e){return e()}function o(){return Object.create(null)}function a(e){e.forEach(n)}function s(e){return"function"==typeof e}function i(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function d(e,t,n){if(e){const o=r(e,t,n);return e[0](o)}}function r(e,n,o){return e[1]?t({},t(n.$$scope.ctx,e[1](o?o(n):{}))):n.$$scope.ctx}function l(e,n,o,a){return e[1]?t({},t(n.$$scope.changed||{},e[1](a?a(o):{}))):n.$$scope.changed||{}}function c(e,t){e.appendChild(t)}function u(e,t,n){e.insertBefore(t,n||null)}function p(e){e.parentNode.removeChild(e)}function h(e){return document.createElement(e)}function m(e){return document.createTextNode(e)}function b(){return m(" ")}function $(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function f(e,t,n){null==n?e.removeAttribute(t):e.setAttribute(t,n)}function v(e,t){for(const n in t)"style"===n?e.style.cssText=t[n]:n in e?e[n]=t[n]:f(e,n,t[n])}function w(e,t){t=""+t,e.data!==t&&(e.data=t)}let _;function y(e){_=e}const x=[],g=Promise.resolve();let N=!1;const S=[],k=[],E=[];function I(e){k.push(e)}function D(){const e=new Set;do{for(;x.length;){const e=x.shift();y(e),L(e.$$)}for(;S.length;)S.shift()();for(;k.length;){const t=k.pop();e.has(t)||(t(),e.add(t))}}while(x.length);for(;E.length;)E.pop()();N=!1}function L(e){e.fragment&&(e.update(e.dirty),a(e.before_render),e.fragment.p(e.dirty,e.ctx),e.dirty=null,e.after_render.forEach(I))}let C;function A(){C={remaining:0,callbacks:[]}}function R(){C.remaining||a(C.callbacks)}function T(e){C.callbacks.push(e)}function O(e,t){const n={},o={},a={$$scope:1};let s=e.length;for(;s--;){const i=e[s],d=t[s];if(d){for(const e in i)e in d||(o[e]=1);for(const e in d)a[e]||(n[e]=d[e],a[e]=1);e[s]=d}else for(const e in i)a[e]=1}for(const e in o)e in n||(n[e]=void 0);return n}function W(e,t,o){const{fragment:i,on_mount:d,on_destroy:r,after_render:l}=e.$$;i.m(t,o),I(()=>{const t=d.map(n).filter(s);r?r.push(...t):a(t),e.$$.on_mount=[]}),l.forEach(I)}function M(e,t){e.$$.dirty||(x.push(e),N||(N=!0,g.then(D)),e.$$.dirty=o()),e.$$.dirty[t]=!0}function j(t,n,s,i,d,r){const l=_;y(t);const c=n.props||{},u=t.$$={fragment:null,ctx:null,props:r,update:e,not_equal:d,bound:o(),on_mount:[],on_destroy:[],before_render:[],after_render:[],context:new Map(l?l.$$.context:[]),callbacks:o(),dirty:null};let p=!1;u.ctx=s?s(t,c,(e,n)=>{u.ctx&&d(u.ctx[e],u.ctx[e]=n)&&(u.bound[e]&&u.bound[e](n),p&&M(t,e))}):c,u.update(),p=!0,a(u.before_render),u.fragment=i(u.ctx),n.target&&(n.hydrate?u.fragment.l(function(e){return Array.from(e.childNodes)}(n.target)):u.fragment.c(),n.intro&&t.$$.fragment.i&&t.$$.fragment.i(),W(t,n.target,n.anchor),D()),y(l)}class z{$destroy(){var t,n;n=!0,(t=this).$$&&(a(t.$$.on_destroy),t.$$.fragment.d(n),t.$$.on_destroy=t.$$.fragment=null,t.$$.ctx={}),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(){}}var H="undefined"!=typeof document,q='<svg xmlns="http://www.w3.org/2000/svg" id="dd-down-svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>',B=!!H&&"ontouchstart"in document.documentElement,K=B?["click","mouseup"]:["mouseup"];if(H){var U=document.querySelector("html");U&&U.classList.add(B?"pe-touch":"pe-no-touch")}var P={},F=function(e,t){P[e]&&P[e].forEach(function(e){return e(t)})};H&&(window.addEventListener("resize",function(e){return F("resize",e)}),window.addEventListener("scroll",function(e){return F("scroll",e)}),window.addEventListener("keydown",function(e){return F("keydown",e)}),K.forEach(function(e){return window.addEventListener(e,function(t){return F(e,t)})}));var G={component:"pe-shadow",bottomShadow:"pe-shadow__bottom",topShadow:"pe-shadow__top",animated:"pe-shadow--animated",depth_n:"pe-shadow--depth-",with_active_shadow:"pe-with-active-shadow"};const J=e=>void 0!==e?`${G.depth_n}${Math.min(5,e)}`:void 0,Q=({})=>({}),V=({})=>({}),X=({})=>({}),Y=({})=>({});function Z(e){var t;const n=e.$$slots.default,o=d(n,e,null);return{c(){o&&o.c()},l(e){o&&o.l(e)},m(e,n){o&&o.m(e,n),t=!0},p(e,t){o&&o.p&&e.$$scope&&o.p(l(n,t,e,null),r(n,t,null))},i(e){t||(o&&o.i&&o.i(e),t=!0)},o(e){o&&o.o&&o.o(e),t=!1},d(e){o&&o.d(e)}}}function ee(t){var n;return{c(){n=m(t.content)},m(e,t){u(e,n,t)},p(e,t){e.content&&w(n,t.content)},i:e,o:e,d(e){e&&p(n)}}}function te(e){var n,o,a,s,i,m,$,f,w,_;const y=e.$$slots.before,x=d(y,e,Y);var g=[ee,Z],N=[];function S(e){return e.content?0:1}a=S(e),s=N[a]=g[a](e);const k=e.$$slots.after,E=d(k,e,V);for(var I=[{class:e.R_classNames},{style:e.style},{"data-test-id":e.testId}],D={},L=0;L<I.length;L+=1)D=t(D,I[L]);return{c(){n=h("div"),x&&x.c(),o=b(),s.c(),i=b(),E&&E.c(),m=b(),$=h("div"),f=b(),w=h("div"),$.className=G.bottomShadow,w.className=G.topShadow,v(n,D)},l(e){x&&x.l(div2_nodes),E&&E.l(div2_nodes)},m(e,t){u(e,n,t),x&&x.m(n,null),c(n,o),N[a].m(n,null),c(n,i),E&&E.m(n,null),c(n,m),c(n,$),c(n,f),c(n,w),_=!0},p(e,t){x&&x.p&&e.$$scope&&x.p(l(y,t,e,X),r(y,t,Y));var o=a;(a=S(t))===o?N[a].p(e,t):(A(),T(()=>{N[o].d(1),N[o]=null}),s.o(1),R(),(s=N[a])||(s=N[a]=g[a](t)).c(),s.i(1),s.m(n,i)),E&&E.p&&e.$$scope&&E.p(l(k,t,e,Q),r(k,t,V)),v(n,O(I,[e.R_classNames&&{class:t.R_classNames},e.style&&{style:t.style},e.testId&&{"data-test-id":t.testId}]))},i(e){_||(x&&x.i&&x.i(e),s&&s.i(),E&&E.i&&E.i(e),_=!0)},o(e){x&&x.o&&x.o(e),s&&s.o(),E&&E.o&&E.o(e),_=!1},d(e){e&&p(n),x&&x.d(e),N[a].d(),E&&E.d(e)}}}function ne(e,t,n){let o,{className:a="",content:s,style:i,testId:d,shadowDepth:r=1,animated:l=!1}=t,{$$slots:c={},$$scope:u}=t;return e.$set=e=>{"className"in e&&n("className",a=e.className),"content"in e&&n("content",s=e.content),"style"in e&&n("style",i=e.style),"testId"in e&&n("testId",d=e.testId),"shadowDepth"in e&&n("shadowDepth",r=e.shadowDepth),"animated"in e&&n("animated",l=e.animated),"$$scope"in e&&n("$$scope",u=e.$$scope)},e.$$.update=(e={animated:1,className:1,shadowDepth:1})=>{(e.animated||e.className||e.shadowDepth)&&n("R_classNames",o=[G.component,l?G.animated:void 0,a,J(r)].join(" "))},{className:a,content:s,style:i,testId:d,shadowDepth:r,animated:l,R_classNames:o,$$slots:c,$$scope:u}}class oe extends z{constructor(e){super(),j(this,e,ne,te,i,["className","content","style","testId","shadowDepth","animated"])}}var ae={component:"pe-text-button",super:"pe-button",row:"pe-button-row",content:"pe-button__content",label:"pe-button__label",textLabel:"pe-button__text-label",wash:"pe-button__wash",washColor:"pe-button__wash-color",dropdown:"pe-button__dropdown",border:"pe-button--border",contained:"pe-button--contained",disabled:"pe-button--disabled",dropdownClosed:"pe-button--dropdown-closed",dropdownOpen:"pe-button--dropdown-open",extraWide:"pe-button--extra-wide",hasDropdown:"pe-button--dropdown",highLabel:"pe-button--high-label",inactive:"pe-button--inactive",raised:"pe-button--raised",selected:"pe-button--selected",separatorAtStart:"pe-button--separator-start",hasHover:"pe-button--has-hover"};function se(t){var n,o,a;return{c(){n=h("div"),o=h("div"),a=m(t.label),o.className=ae.textLabel,o.style.cssText=t.textStyle,n.className=ae.label},m(e,t){u(e,n,t),c(n,o),c(o,a)},p(e,t){e.label&&w(a,t.label),e.textStyle&&(o.style.cssText=t.textStyle)},i:e,o:e,d(e){e&&p(n)}}}function ie(e,t,n){let{label:o="",textStyle:a}=t;return e.$set=e=>{"label"in e&&n("label",o=e.label),"textStyle"in e&&n("textStyle",a=e.textStyle)},{label:o,textStyle:a}}class de extends z{constructor(e){super(),j(this,e,ie,se,i,["label","textStyle"])}}const re=({})=>({}),le=({})=>({}),ce=({})=>({}),ue=({})=>({}),pe=({})=>({}),he=({})=>({});function me(e){var t;return{c(){(t=h("div")).className="pe-ripple"},m(e,n){u(e,t,n)},d(e){e&&p(t)}}}function be(e){var t;const n=e.$$slots.default,o=d(n,e,null);return{c(){o&&o.c()},l(e){o&&o.l(e)},m(e,n){o&&o.m(e,n),t=!0},p(e,t){o&&o.p&&e.$$scope&&o.p(l(n,t,e,null),r(n,t,null))},i(e){t||(o&&o.i&&o.i(e),t=!0)},o(e){o&&o.o&&o.o(e),t=!1},d(e){o&&o.d(e)}}}function $e(e){var t,n=new de({props:{label:e.label,textStyle:e.textStyle}});return{c(){n.$$.fragment.c()},m(e,o){W(n,e,o),t=!0},p(e,t){var o={};e.label&&(o.label=t.label),e.textStyle&&(o.textStyle=t.textStyle),n.$set(o)},i(e){t||(n.$$.fragment.i(e),t=!0)},o(e){n.$$.fragment.o(e),t=!1},d(e){n.$destroy(e)}}}function fe(t){var n;return{c(){n=m(t.content)},m(e,t){u(e,n,t)},p(e,t){e.content&&w(n,t.content)},i:e,o:e,d(e){e&&p(n)}}}function ve(t){var n;return{c(){n=m(q)},m(e,t){u(e,n,t)},p:e,d(e){e&&p(n)}}}function we(e){var n,o,s,i,m,f,w,_,y,x,g,N,k,E;const I=e.$$slots.before,D=d(I,e,he);var L=new oe({props:{shadowDepth:e._shadowDepth,animated:!0}}),C=(e.disabled||e._noInk)&&me();const M=e.$$slots.label,j=d(M,e,ue);var z=[fe,$e,be],H=[];function q(e){return e.content?0:e.label!==e.undefined?1:2}y=q(e),x=H[y]=z[y](e);var B=e.dropdown&&ve();const K=e.$$slots.after,U=d(K,e,le);for(var P=[{href:null},e.url,{class:e.R_classNames},{style:e.style},{tabindex:e._tabindex},{"data-test-id":e.testId}],F={},G=0;G<P.length;G+=1)F=t(F,P[G]);return{c(){n=h("a"),D&&D.c(),o=b(),s=h("div"),L.$$.fragment.c(),i=b(),C&&C.c(),m=b(),(f=h("div")).innerHTML='<div class="pe-button__wash-color"></div>',w=b(),j&&j.c(),_=b(),x.c(),g=b(),B&&B.c(),N=b(),U&&U.c(),f.className="pe-button__wash",s.className="pe-button__content",v(n,F),E=[$(n,"mousedown",e.onMouseDown),$(n,"keyup",e.onKeyUp),$(n,"click",e.onClick)]},l(e){D&&D.l(a_nodes),j&&j.l(div2_nodes),U&&U.l(a_nodes)},m(t,a){var d;u(t,n,a),D&&D.m(n,null),c(n,o),c(n,s),W(L,s,null),c(s,i),C&&C.m(s,null),c(s,m),c(s,f),c(s,w),j&&j.m(s,null),c(s,_),H[y].m(s,null),c(s,g),B&&B.m(s,null),c(n,N),U&&U.m(n,null),d=()=>e.a_binding(n,null),S.push(d),k=!0},p(e,t){D&&D.p&&e.$$scope&&D.p(l(I,t,e,pe),r(I,t,he));var o={};e._shadowDepth&&(o.shadowDepth=t._shadowDepth),L.$set(o),t.disabled||t._noInk?C||((C=me()).c(),C.m(s,m)):C&&(C.d(1),C=null),j&&j.p&&e.$$scope&&j.p(l(M,t,e,ce),r(M,t,ue));var a=y;(y=q(t))===a?H[y].p(e,t):(A(),T(()=>{H[a].d(1),H[a]=null}),x.o(1),R(),(x=H[y])||(x=H[y]=z[y](t)).c(),x.i(1),x.m(s,g)),t.dropdown?B?B.p(e,t):((B=ve()).c(),B.m(s,null)):B&&(B.d(1),B=null),U&&U.p&&e.$$scope&&U.p(l(K,t,e,re),r(K,t,le)),e.items&&(t.a_binding(null,n),t.a_binding(n,null)),v(n,O(P,[{href:null},e.url&&t.url,e.R_classNames&&{class:t.R_classNames},e.style&&{style:t.style},e._tabindex&&{tabindex:t._tabindex},e.testId&&{"data-test-id":t.testId}]))},i(e){k||(D&&D.i&&D.i(e),L.$$.fragment.i(e),j&&j.i&&j.i(e),x&&x.i(),U&&U.i&&U.i(e),k=!0)},o(e){D&&D.o&&D.o(e),L.$$.fragment.o(e),j&&j.o&&j.o(e),x&&x.o(),U&&U.o&&U.o(e),k=!1},d(t){t&&p(n),D&&D.d(t),L.$destroy(),C&&C.d(),j&&j.d(t),H[y].d(),B&&B.d(),U&&U.d(t),e.a_binding(null,n),a(E)}}}function _e(t,n,o){let a;const s=function(t,n=e){let o;const a=[];function s(e){if(i(t,e)){if(t=e,!o)return;a.forEach(e=>e[1]()),a.forEach(e=>e[0](t))}}return{set:s,update:function(e){s(e(t))},subscribe:function(i,d=e){const r=[i,d];return a.push(r),1===a.length&&(o=n(s)||e),i(t),()=>{const e=a.indexOf(r);-1!==e&&a.splice(e,1),0===a.length&&o()}}}}(!1);let d;!function(e,t,n){const o=t.subscribe(n);e.$$.on_destroy.push(o.unsubscribe?()=>o.unsubscribe():o)}(t,s,e=>{o("$isInactive",a=e)});let{className:r="",content:l,style:c,testId:u,tone:p="",animateOnTap:h,border:m=!1,borders:b=!1,contained:$=!1,disabled:f=!1,dropdown:v,extraWide:w=!1,events:_={},highLabel:y=!1,inactivate:x=!1,inactive:g=!1,ink:N=!1,label:S,parentClassName:k="",raised:E=!1,selected:I=!1,separatorAtStart:D=!1,shadowDepth:L,tabindex:C=0,textStyle:A,url:R={href:"javascript:false"},wash:T}=n;const O=_.onclick||(()=>{}),W=_.onkeyup||O,M=e=>{d.blur(),d.removeEventListener("mouseleave",M)},j=!1!==h,z=!f&&!I&&(E?T:!1!==T),H=E?void 0!==L?parseInt(L,10):1:0,q=void 0!==N&&!1===N,B=f||g?-1:C||0;let K,U,{$$slots:P={},$$scope:F}=n;return t.$set=e=>{"className"in e&&o("className",r=e.className),"content"in e&&o("content",l=e.content),"style"in e&&o("style",c=e.style),"testId"in e&&o("testId",u=e.testId),"tone"in e&&o("tone",p=e.tone),"animateOnTap"in e&&o("animateOnTap",h=e.animateOnTap),"border"in e&&o("border",m=e.border),"borders"in e&&o("borders",b=e.borders),"contained"in e&&o("contained",$=e.contained),"disabled"in e&&o("disabled",f=e.disabled),"dropdown"in e&&o("dropdown",v=e.dropdown),"extraWide"in e&&o("extraWide",w=e.extraWide),"events"in e&&o("events",_=e.events),"highLabel"in e&&o("highLabel",y=e.highLabel),"inactivate"in e&&o("inactivate",x=e.inactivate),"inactive"in e&&o("inactive",g=e.inactive),"ink"in e&&o("ink",N=e.ink),"label"in e&&o("label",S=e.label),"parentClassName"in e&&o("parentClassName",k=e.parentClassName),"raised"in e&&o("raised",E=e.raised),"selected"in e&&o("selected",I=e.selected),"separatorAtStart"in e&&o("separatorAtStart",D=e.separatorAtStart),"shadowDepth"in e&&o("shadowDepth",L=e.shadowDepth),"tabindex"in e&&o("tabindex",C=e.tabindex),"textStyle"in e&&o("textStyle",A=e.textStyle),"url"in e&&o("url",R=e.url),"wash"in e&&o("wash",T=e.wash),"$$scope"in e&&o("$$scope",F=e.$$scope)},t.$$.update=(e={inactive:1,$isInactive:1,parentClassName:1,contained:1,raised:1,selected:1,highLabel:1,extraWide:1,disabled:1,R_inactive:1,separatorAtStart:1,border:1,borders:1,dropdown:1,tone:1,className:1})=>{(e.inactive||e.$isInactive)&&o("R_inactive",K=g||a),(e.parentClassName||e.contained||e.raised||e.selected||e.highLabel||e.extraWide||e.disabled||e.R_inactive||e.separatorAtStart||e.border||e.borders||e.dropdown||e.tone||e.className)&&o("R_classNames",U=[ae.super,k||ae.component,$?ae.contained:void 0,E?ae.contained:void 0,E?ae.raised:void 0,E&&j?G.with_active_shadow:void 0,E&&j?J(H+1):void 0,z?ae.hasHover:void 0,I?ae.selected:void 0,y?ae.highLabel:void 0,w?ae.extraWide:void 0,f?ae.disabled:void 0,K?ae.inactive:void 0,D?ae.separatorAtStart:void 0,m||b?ae.border:void 0,v?ae.hasDropdown:void 0,v?v.open?ae.dropdownOpen:ae.dropdownClosed:void 0,"dark"===p?"pe-dark-tone":void 0,"light"===p?"pe-light-tone":void 0,r].join(" "))},{isInactive:s,domElement:d,className:r,content:l,style:c,testId:u,tone:p,animateOnTap:h,border:m,borders:b,contained:$,disabled:f,dropdown:v,extraWide:w,events:_,highLabel:y,inactivate:x,inactive:g,ink:N,label:S,parentClassName:k,raised:E,selected:I,separatorAtStart:D,shadowDepth:L,tabindex:C,textStyle:A,url:R,wash:T,onClick:e=>{console.log("domElement",d),console.log("document.activeElement",document.activeElement),document.activeElement===d&&document.activeElement.blur(),x&&(s.set(!0),setTimeout(()=>s.set(!1),1e3*x)),O(e)},onMouseDown:e=>{d&&d.addEventListener&&d.addEventListener("mouseleave",M)},onKeyUp:e=>{13===e.keyCode&&document.activeElement===d&&(document.activeElement.blur(),W&&W(e))},_shadowDepth:H,_noInk:q,_tabindex:B,undefined:void 0,R_classNames:U,a_binding:function(e,t){o("domElement",d=e)},$$slots:P,$$scope:F}}class ye extends z{constructor(e){super(),j(this,e,_e,we,i,["className","content","style","testId","tone","animateOnTap","border","borders","contained","disabled","dropdown","extraWide","events","highLabel","inactivate","inactive","ink","label","parentClassName","raised","selected","separatorAtStart","shadowDepth","tabindex","textStyle","url","wash"])}}export{ye as Button,oe as Shadow};
//# sourceMappingURL=polythene-svelte.mjs.map
