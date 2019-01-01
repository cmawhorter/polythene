!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?o(exports,require("polythene-core-css"),require("polythene-css-dialog-pane"),require("polythene-css-shadow"),require("polythene-theme")):"function"==typeof define&&define.amd?define(["exports","polythene-core-css","polythene-css-dialog-pane","polythene-css-shadow","polythene-theme"],o):o((e=e||self).polythene={},e["polythene-core-css"],e["polythene-css-dialog-pane"],e["polythene-css-shadow"],e["polythene-theme"])}(this,function(e,o,r,t,n){"use strict";var a="pe-dialog";function i(e,o,r){return o in e?Object.defineProperty(e,o,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[o]=r,e}function l(){return(l=Object.assign||function(e){for(var o=1;o<arguments.length;o++){var r=arguments[o];for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t])}return e}).apply(this,arguments)}var c={general_styles:function(e){return[]}},s=function(e){var r;return i(r={},"color_"+e+"_background",function(r,t){return[o.sel(r,{" .pe-dialog__content":{backgroundColor:t["color_"+e+"_background"]}})]}),i(r,"color_"+e+"_text",function(r,t){return[o.sel(r,{" .pe-dialog__content":{color:t["color_"+e+"_text"]}})]}),i(r,"color_"+e+"_backdrop_background",function(r,t){return[o.sel(r,{" .pe-dialog__backdrop":{backgroundColor:t["color_"+e+"_backdrop_background"]}})]}),r},d=l({},c,s("light")),u=l({},c,s("dark")),_=o.createColor({varFns:{lightTintFns:d,darkTintFns:u}}),p={full_screen:!1,modal:!1},g=l({},{backdrop:!1,z_index:n.vars.z_dialog},p,t.sharedVars),f=l({},{general_styles:!0,animation_delay:"0s",animation_duration:".220s",animation_hide_css:"opacity: 0;",animation_show_css:"opacity: 1;",animation_timing_function:"ease-in-out",border_radius:n.vars.unit_block_border_radius,position:"fixed",color_light_backdrop_background:"rgba(0, 0, 0, .4)",color_dark_backdrop_background:"rgba(0, 0, 0, .5)",color_light_background:o.rgba(n.vars.color_light_background),color_dark_background:o.rgba(n.vars.color_dark_background),color_light_text:o.rgba(n.vars.color_light_foreground,n.vars.blend_light_text_regular),color_dark_text:o.rgba(n.vars.color_dark_foreground,n.vars.blend_dark_text_regular)},g),b=function(e){return o.sel(e,{".pe-dialog--visible .pe-dialog__backdrop":{display:"block",opacity:1}})},y=function(e,t){return o.sel(e,[o.createMarker(t,p),{padding:0," .pe-dialog__content":{width:"100%"}},r.fullScreen(e)])},h=function(e,r){return o.sel(e,[o.createMarker(r,p)])},m=function(e){for(var o=1;o<arguments.length;o++){var r=null!=arguments[o]?arguments[o]:{},t=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(t=t.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),t.forEach(function(o){i(e,o,r[o])})}return e}({general_styles:function(e,r){return[o.sel(e,[o.flex.layoutCenterCenter,{top:0,left:0,right:0,bottom:0,zIndex:r.z_index,height:"100%",transitionProperty:"opacity,background-color,transform",".pe-dialog--full-screen":y(e,r),".pe-dialog--modal":h(e)," .pe-dialog__content":{position:"relative",transitionProperty:"all"}," .pe-dialog__backdrop":[o.mixin.defaultTransition("all"),{position:"absolute",opacity:0,top:0,left:0,right:0,bottom:0,pointerEvents:"none"}],".pe-dialog--backdrop":b(e)}]),{".pe-dialog__holder":{height:"100%",minWidth:"320px"}}]},animation_hide_css:function(e,r){return[o.sel(e,[r.animation_hide_css])]},position:function(e,r){return[o.sel(e,{position:r.position})]},animation_delay:function(e,r){return[o.sel(e,{"&, .pe-dialog__content":{transitionDelay:r.animation_delay}})]},animation_duration:function(e,r){return[o.sel(e,{"&, .pe-dialog__content":{transitionDuration:r.animation_duration}})]},animation_timing_function:function(e,r){return[o.sel(e,{"&, .pe-dialog__content":{transitionTimingFunction:r.animation_timing_function}})]},animation_show_css:function(e,r){return[o.sel(e,{".pe-dialog--visible":r.animation_show_css})]},border_radius:function(e,r){return[!r.full_screen&&o.sel(e,{" .pe-dialog__content":{borderTopLeftRadius:r.border_radius+"px",borderTopRightRadius:r.border_radius+"px",borderBottomLeftRadius:r.border_radius+"px",borderBottomRightRadius:r.border_radius+"px"}})]},backdrop:function(e,o){return o.backdrop&&b(e)},full_screen:function(e,o){return o.full_screen&&y(e,o)},modal:function(e,o){return o.modal&&h(e,o)}},t.sharedVarFns),k=o.createLayout({varFns:m}),v=[k,_],x=".".concat(a),w=o.styler.createAddStyle(x,v,f),O=o.styler.createGetStyle(x,v,f);o.styler.addStyle({selectors:[x],fns:v,vars:f}),e.addStyle=w,e.color=_,e.getStyle=O,e.layout=k,e.vars=f,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-css-dialog.js.map
