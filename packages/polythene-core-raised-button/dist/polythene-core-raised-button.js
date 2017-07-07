!function(o,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports,require("polythene-core"),require("polythene-core-css"),require("polythene-theme")):"function"==typeof define&&define.amd?define(["exports","polythene-core","polythene-core-css","polythene-theme"],r):r(o.polythene=o.polythene||{},o["polythene-core"],o["polythene-core-css"],o["polythene-theme"])}(this,function(o,r,e,t){"use strict";function n(o,r,e){return r in o?Object.defineProperty(o,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):o[r]=e,o}var a={component:"pe-button pe-text-button pe-raised-button"},c=t.vars.rgba,l={color_light_background:"#e0e0e0",color_light_text:c(t.vars.color_light_foreground,t.vars.blend_light_text_primary),color_light_hover_background:"transparent",color_light_focus_background:c(t.vars.color_light_foreground,t.vars.blend_light_background_hover),color_light_active_background:c(t.vars.color_light_foreground,t.vars.blend_light_background_hover),color_light_disabled_background:c(t.vars.color_light_foreground,t.vars.blend_light_background_disabled),color_light_disabled_text:c(t.vars.color_light_foreground,t.vars.blend_light_text_disabled),color_dark_background:c(t.vars.color_primary),color_dark_text:c(t.vars.color_dark_foreground,t.vars.blend_dark_text_primary),color_dark_hover_background:t.vars.color_primary_active,color_dark_focus_background:t.vars.color_primary_active,color_dark_active_background:t.vars.color_primary_dark,color_dark_disabled_background:c(t.vars.color_dark_foreground,t.vars.blend_dark_background_disabled),color_dark_disabled_text:c(t.vars.color_dark_foreground,t.vars.blend_dark_text_disabled)},d=function(o,r,e,t){var a=e["color_"+t+"_border"]||"transparent",c=e["color_"+t+"_active_border"]||a,l=e["color_"+t+"_disabled_border"]||a;return[n({},o.map(function(o){return o+r}).join(","),{"&, &:link, &:visited":{color:e["color_"+t+"_text"]}," .pe-button__content":{backgroundColor:e["color_"+t+"_background"],borderColor:a},".pe-button--disabled":{color:e["color_"+t+"_disabled_text"]," .pe-button__content":{backgroundColor:e["color_"+t+"_disabled_background"],borderColor:l}},".pe-button--selected":{" .pe-button__content":{backgroundColor:e["color_"+t+"_active_background"],borderColor:c}," .pe-button__focus":{opacity:1,backgroundColor:e["color_"+t+"_focus_background"]}},".pe-button--focus":{" .pe-button__focus":{opacity:1,backgroundColor:e["color_"+t+"_focus_background"]}}})]},_=function(o,r,e,t){var a=e["color_"+t+"_border"],c=e["color_"+t+"_border"]||a;return[n({},o.map(function(o){return o+r+":hover"}).join(","),{":not(.pe-button--selected):not(.pe-button--inactive) .pe-button__wash":{backgroundColor:e["color_"+t+"_hover_background"],borderColor:c}})]},u=function(o,r){return[d([".pe-dark-tone",".pe-dark-tone "],o,r,"dark"),d(["",".pe-light-tone",".pe-light-tone "],o,r,"light"),_(["html.pe-no-touch .pe-dark-tone "],o,r,"dark"),_(["html.pe-no-touch ","html.pe-no-touch .pe-light-tone "],o,r,"light")]},i=Object.assign||function(o){for(var r=1;r<arguments.length;r++){var e=arguments[r];for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(o[t]=e[t])}return o},s=[u],b="."+a.component.replace(/ /g,"."),p=function(o,r){return e.styler.generateStyles([o,b],i({},l,r),s)};e.styler.generateStyles([b],l,s);var g=Object.assign||function(o){for(var r=1;r<arguments.length;r++){var e=arguments[r];for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(o[t]=e[t])}return o},h=p,v=void 0,f=function(){},k=[];r.subscribe(r.touchEndEvent,function(){return f()});var m=function(o,r){var e=r.state.zBase,t=r.attrs.increase||1,n=r.state.z(),a="down"===o&&e<5?Math.min(e+t,5):"up"===o?Math.max(n-t,e):n;a!==n&&r.state.z(a)},y=function(o,e){"down"===o&&k.push(g({},e)),!1!==e.attrs.animateOnTap&&!r.isTouch&&m(o,e)},x=function(o){v=function(){return y("down",o)},f=function(){k.map(function(o){return y("up",o)}),k=[]},o.dom.addEventListener(r.touchStartEvent,v)},C=function(o){return o.dom.removeEventListener(r.touchStartEvent,v)},O=function(o,r){var e=o.attrs,t=void 0!==e.z?e.z:1,n=r(t);return{zBase:t,z:n,tapEventsInited:r(!1),redrawOnUpdate:r.merge([n])}},j=function(o){var r=o.state;o.attrs;o.dom&&!r.tapEventsInited()&&(x(o),r.tapEventsInited(!0))},w=function(o){o.state.tapEventsInited()&&C(o)},z=function(o,r){var e=r.renderer,t=r.Shadow,n=o.attrs,c=o.state,l=n.children||o.children||[];return g({},{parentClassName:[n.parentClassName||a.component].join(" "),animateOnTap:!1,shadowComponent:e(t,{z:c.z,animated:!0}),children:l},n)},E=function(){return null},S=Object.freeze({theme:h,getInitialState:O,onMount:j,onUnMount:w,createProps:z,createContent:E});o.coreRaisedButton=S,o.classes=a,o.vars=l,Object.defineProperty(o,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-raised-button.js.map
