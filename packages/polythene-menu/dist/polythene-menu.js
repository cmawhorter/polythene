!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("mithril"),require("polythene-shadow"),require("polythene-core"),require("polythene-css"),require("polythene-theme")):"function"==typeof define&&define.amd?define(["exports","mithril","polythene-shadow","polythene-core","polythene-css","polythene-theme"],t):t(e.polythene=e.polythene||{},e.m,e["polythene-shadow"],e["polythene-core"],e["polythene-css"],e["polythene-theme"])}(this,function(e,t,n,i,r,o){"use strict";function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}t="default"in t?t.default:t;var l=o.vars.rgba,s={sizes:[1,1.5,2,3,4,5,6,7],min_size:1.5,max_size_small_screen:5,size_factor:o.vars.grid_unit_menu,border_radius:o.vars.unit_block_border_radius,color_light_background:l(o.vars.color_light_background),color_dark_background:l(o.vars.color_dark_background)},c=function(e,t){return t<e.min_size?e.min_size:t},d=function(e){var t=e.toString().replace(".","-");return"pe-menu--width-"+t},p=function(e,t){var n=c(e,t);return u({},"&."+d(n),{width:e.size_factor*n+"px","max-width":"100%"})},f=function(e,t){return[u({},e,[t.sizes.map(function(e){return p(t,e)}),u({transitionTimingFunction:"ease-out",transitionProperty:"opacity",zIndex:o.vars.z_menu,opacity:0,position:"absolute",width:"100%",minWidth:o.vars.grid_unit_menu*t.min_size+"px","&.pe-menu--width-auto":{width:"auto"},"&.pe-menu--visible":{opacity:1},"&.pe-menu--permanent":{position:"relative",opacity:1,zIndex:0}," .pe-menu__content":{width:"100%",borderRadius:t.border_radius+"px"}},"@media (max-width: "+o.vars.unit_screen_size_large+"px)",{"max-width":t.max_size_small_screen*o.vars.grid_unit_menu+"px"})])]},h=function(e,t,n,i){return[a({},e+t,{" .pe-menu__content":{"background-color":n["color_"+i+"_background"]}})]},m=function(e,t){return[h("",e,t,"light"),h(".pe-dark-theme",e,t,"dark"),h(".pe-dark-theme ",e,t,"dark")]},g=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},v=[f,m],b=".pe-menu",_=function(e,t){return r.styler.generateStyles([e,b],g({},s,t),v)};r.styler.generateStyles([b],s,v);var y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},w={component:"pe-menu",content:"pe-menu__content",placeholder:"pe-menu__placeholder",target:"pe-menu__target",visible:"pe-menu--visible",permanent:"pe-menu--permanent",width_n:"pe-menu--width-",width_auto:"pe-menu--width-auto",listTile:"pe-list-tile",selectedListTile:"pe-list-tile--selected"},z=1,x=-8,k=16,S=1.5,T=function(e,t){if(t.target){var n=document.querySelector("#"+t.target);if(n){var i=void 0!==t.offset?t.offset:k,r=e.el;if(r){var o=e.el.querySelector("."+w.content),u=t.origin||"top-left",a=t.reposition!==!1,l=0;if(a){var s=o.querySelectorAll("."+w.listTile)[0],c=o.querySelector("."+w.selectedListTile);if(s&&c){var d=s.getBoundingClientRect(),p=c.getBoundingClientRect();l=p.top-d.top}var f=c||s,h=f.getBoundingClientRect(),m=n.getBoundingClientRect(),g=h.height-m.height;l+=g/2}var v=n.getBoundingClientRect();if(r.parentNode){var b=r.parentNode.getBoundingClientRect(),_=function(){return r.style.left=v.left-b.left+i+"px"},y=function(){return r.style.right=v.right-b.right+i+"px"},z=function(){return r.style.top=v.top-b.top-l+x+"px"},S=function(){return r.style.bottom=v.bottom-b.bottom-l+"px"},T={"top-left":function(){return z()&&_()},"top-right":function(){return z()&&y()},"bottom-left":function(){return S()&&_()},"bottom-right":function(){return S()&&y()}};T[u].call()}}}}},j=function(e,t){return e.isTransitioning=!0,i.show(y({},t,{el:e.el,showClass:w.visible})).then(function(){e.isTransitioning=!1,e.visible=!0,t.didShow&&t.didShow(t.id)})},q=function(e,n){return e.isTransitioning=!0,i.hide(y({},n,{el:e.el,showClass:w.visible})).then(function(){e.isTransitioning=!1,e.visible=!1,n.didHide&&n.didHide(n.id),t.redraw()})},O=function(e){return e<S?S:e},C=function(e){return w.width_n+e.toString().replace(".","-")},P=function(e){var r=e.attrs,o=e.state,u=document.body,a=function(){u.addEventListener("click",s)},l=function(){u.removeEventListener("click",s)},s=function(e){e.target!==o.el&&(l(),e.defaultPrevented?q(o,r):q(o,y({},r,{hideDelay:0})))},c=function(){T(o,r),t.redraw()},d=function(e){27===e.which&&q(o,y({},r,{hideDelay:0}))},p=r.element||"div",f=y({},i.filterSupportedAttributes(r),{class:[w.component,r.permanent?w.permanent:null,r.target?w.target:null,r.size?C(O(r.size)):null,r.class].join(" "),oncreate:function(e){var t=e.dom;o.el=t,r.permanent||(i.subscribe("resize",c),i.subscribe("keydown",d),setTimeout(function(){a(),j(o,r)},0)),T(o,r)},onremove:function(){i.unsubscribe("resize",c),i.unsubscribe("keydown",d),r.permanent||l()}}),h=t("div",{class:w.content,onclick:function(e){return e.preventDefault()}},[o.z>0&&t(n.shadow,{z:o.z,animated:!0}),r.content?r.content:e.children]);return t(p,f,[r.before,h,r.after])},R={theme:_,oninit:function(e){var t=e.attrs;e.state=y(e.state,{z:void 0!==t.z?t.z:z,el:null,isTransitioning:!1,visible:t.permanent||!1})},view:function(e){return e.attrs.show&&(e.state.visible=!0),e.state.visible?P(e):t("span",{class:w.placeholder})}};e.menu=R,e.vars=s,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-menu.js.map
