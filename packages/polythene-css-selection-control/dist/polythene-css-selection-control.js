!function(o,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("polythene-theme"),require("polythene-core-css")):"function"==typeof define&&define.amd?define(["exports","polythene-theme","polythene-core-css"],e):e(o.polythene={},o["polythene-theme"],o["polythene-core-css"])}(this,function(o,e,l){"use strict";const _={general_styles:o=>[l.sel(o,{" .pe-control__box":{" .pe-control__button":{color:"inherit"}," .pe-control__button--on":{color:"inherit"}}})]},t=o=>({["color_"+o+"_on"]:(e,_)=>[l.sel(e,{color:_["color_"+o+"_on"]})],["color_"+o+"_off"]:(e,_)=>[l.sel(e,{" .pe-control__button--off":{color:_["color_"+o+"_off"]}})],["color_"+o+"_disabled"]:(e,_)=>[l.sel(e,{".pe-control--disabled":{" .pe-control__label":{color:_["color_"+o+"_disabled"]}," .pe-control__box":{" .pe-control__button--on, .pe-control__button--off":{color:_["color_"+o+"_disabled"]}}}})],["color_"+o+"_label"]:(e,_)=>[l.sel(e,{" .pe-control__label":{color:_["color_"+o+"_label"]}})],["color_"+o+"_on_icon"]:(e,_)=>[l.sel(e,{" .pe-control__box":{" .pe-control__button--on":{color:_["color_"+o+"_on_icon"]}}})],["color_"+o+"_off_icon"]:(e,_)=>[l.sel(e,{" .pe-control__box":{" .pe-control__button--off":{color:_["color_"+o+"_off_icon"]}}})],["color_"+o+"_focus_on"]:(e,_)=>[l.sel(e,{".pe-control--on":{" .pe-button--focus .pe-button__focus":{backgroundColor:_["color_"+o+"_focus_on"]}}})],["color_"+o+"_focus_off"]:(e,_)=>[l.sel(e,{".pe-control--off":{" .pe-button--focus .pe-button__focus":{backgroundColor:_["color_"+o+"_focus_off"]}}})],["color_"+o+"_focus_on_opacity"]:(e,_)=>[l.sel(e,{".pe-control--on":{" .pe-button--focus .pe-button__focus":{opacity:_["color_"+o+"_focus_on_opacity"]}}})],["color_"+o+"_focus_off_opacity"]:(e,_)=>[l.sel(e,{".pe-control--off":{" .pe-button--focus .pe-button__focus":{opacity:_["color_"+o+"_focus_off_opacity"]}}})],["color_"+o+"_on_label"]:(e,_)=>[l.sel(e,{".pe-control--on":{" .pe-control__label":{color:_["color_"+o+"_on_label"]}}})],["color_"+o+"_off_label"]:(e,_)=>[l.sel(e,{".pe-control--off":{" .pe-control__label":{color:_["color_"+o+"_off_label"]}}})]}),r=Object.assign({},_,t("light")),n=Object.assign({},_,t("dark"));var c=l.createColor({varFns:{lightTintFns:r,darkTintFns:n}});const i=o=>({}),a=o=>({}),s=(o,_,t=e.vars.unit_icon_size)=>{const r=t+o.label_height,n=(r-t)/2;return{" .pe-control__form-label":{height:_+"px"}," .pe-control__box":{width:t+"px",height:t+"px"}," .pe-button__content":{width:r+"px",height:r+"px"," .pe-icon":[l.mixin.fit(n)]}}},p=(o,e,_)=>l.sel(o,{" .pe-button.pe-control__button":{top:-(e.button_size-e.icon_size)/2+"px",[_?"right":"left"]:-(e.button_size-e.icon_size)/2+"px",[_?"left":"right"]:"auto"}}),f=(o,e,_)=>l.sel(o,{" .pe-control__label":{[_?"paddingRight":"paddingLeft"]:e.label_padding_before+"px"}}),u=(o,e,_)=>l.sel(o,{" .pe-control__label":{[_?"paddingLeft":"paddingRight"]:e.label_padding_after+"px"}}),b={general_styles:(o,e)=>[l.sel(o,[i(e),{display:"inline-block",boxSizing:"border-box",margin:0,padding:0," input[type=checkbox], input[type=radio]":{display:"none"}," .pe-control__form-label":[l.flex.layoutHorizontal,l.flex.layoutCenter,{position:"relative",cursor:"pointer",margin:0,color:"inherit",":focus":{outline:0}}],".pe-control--inactive":{" .pe-control__form-label":{cursor:"default"}}," .pe-control__box":{position:"relative",display:"inline-block",boxSizing:"border-box",color:"inherit",flexShrink:0,":focus":{outline:0}}," .pe-button.pe-control__button":{position:"absolute"},".pe-control--off":{" .pe-control__button--on":{opacity:0,zIndex:-1}," .pe-control__button--off":{opacity:1,zIndex:0}},".pe-control--on":{" .pe-control__button--on":{opacity:1,zIndex:0}," .pe-control__button--off":{opacity:0,zIndex:-1}}," .pe-control__label":{alignSelf:"center"},".pe-control--disabled":{" .pe-control__form-label":{cursor:"auto"}," .pe-control__button":{pointerEvents:"none"}}," .pe-button__content":{" .pe-icon":{position:"absolute"}}},{[`*[dir=rtl] ${o}, .pe-rtl ${o}`]:[a(e)]}])],label_font_size:(o,e)=>[l.sel(o,{" .pe-control__form-label":{fontSize:e.label_font_size+"px"}})],label_height:(o,_)=>[l.sel(o,{" .pe-control__box":{width:_.label_height+"px",height:_.label_height+"px"},".pe-control--small":s(_,e.vars.unit_icon_size_small,e.vars.unit_icon_size_small),".pe-control--regular":s(_,_.label_height,e.vars.unit_icon_size),".pe-control--medium":s(_,e.vars.unit_icon_size_medium,e.vars.unit_icon_size_medium),".pe-control--large":s(_,e.vars.unit_icon_size_large,e.vars.unit_icon_size_large)})],animation_duration:(o,e)=>[l.sel(o,{" .pe-button.pe-control__button":[l.mixin.defaultTransition("opacity",e.animation_duration)]," .pe-control__label":[l.mixin.defaultTransition("all",e.animation_duration)]})],button_size:(o,e)=>[l.sel(o,{}),p(o,e,!1),p(l.selectorRTL(o),e,!0)],icon_size:(o,e)=>[l.sel(o,{}),p(o,e,!1),p(l.selectorRTL(o),e,!0)],label_padding_after:(o,e)=>[l.sel(o,{}),u(o,e,!1),u(l.selectorRTL(o),e,!0)],label_padding_before:(o,e)=>[l.sel(o,{}),f(o,e,!1),f(l.selectorRTL(o),e,!1)]};var d=l.createLayout({varFns:b}),g={general_styles:!0,animation_duration:e.vars.animation_duration,button_size:6*e.vars.grid_unit_component,icon_size:3*e.vars.grid_unit_component,label_font_size:2*e.vars.grid_unit_component,label_height:3*e.vars.grid_unit_component,label_padding_after:0,label_padding_before:4*e.vars.grid_unit,color_light_on:l.rgba(e.vars.color_primary),color_light_off:l.rgba(e.vars.color_light_foreground,e.vars.blend_light_text_secondary),color_light_label:l.rgba(e.vars.color_light_foreground,e.vars.blend_light_text_secondary),color_light_disabled:l.rgba(e.vars.color_light_foreground,e.vars.blend_light_text_disabled),color_light_thumb_off_focus_opacity:.08,color_light_thumb_on_focus_opacity:.11,color_light_focus_on:l.rgba(e.vars.color_primary),color_light_focus_on_opacity:.11,color_light_focus_off:l.rgba(e.vars.color_light_foreground),color_light_focus_off_opacity:.07,color_dark_on:l.rgba(e.vars.color_primary),color_dark_off:l.rgba(e.vars.color_dark_foreground,e.vars.blend_dark_text_secondary),color_dark_label:l.rgba(e.vars.color_dark_foreground,e.vars.blend_dark_text_secondary),color_dark_disabled:l.rgba(e.vars.color_dark_foreground,e.vars.blend_dark_text_disabled),color_dark_thumb_off_focus_opacity:.08,color_dark_thumb_on_focus_opacity:.11,color_dark_focus_on:l.rgba(e.vars.color_primary),color_dark_focus_on_opacity:.14,color_dark_focus_off:l.rgba(e.vars.color_dark_foreground),color_dark_focus_off_opacity:.09};const h=[d,c],y=l.styler.createAddStyle(".pe-control",h,g),v=l.styler.createGetStyle(".pe-control",h,g);l.styler.addStyle({selectors:[".pe-control"],fns:h,vars:g}),o.addStyle=y,o.color=c,o.getStyle=v,o.layout=d,o.vars=g,Object.defineProperty(o,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-css-selection-control.js.map
