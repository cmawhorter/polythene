!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?o(exports,require("polythene-theme"),require("polythene-css-shadow"),require("polythene-core-css")):"function"==typeof define&&define.amd?define(["exports","polythene-theme","polythene-css-shadow","polythene-core-css"],o):o(e.polythene={},e["polythene-theme"],e["polythene-css-shadow"],e["polythene-core-css"])}(this,function(e,o,t,r){"use strict";var n={component:"pe-text-button",super:"pe-button",row:"pe-button-row",content:"pe-button__content",label:"pe-button__label",textLabel:"pe-button__text-label",wash:"pe-button__wash",dropdown:"pe-button__dropdown",border:"pe-button--border",contained:"pe-button--contained",disabled:"pe-button--disabled",dropdownClosed:"pe-button--dropdown-closed",dropdownOpen:"pe-button--dropdown-open",extraWide:"pe-button--extra-wide",hasDropdown:"pe-button--dropdown",highLabel:"pe-button--high-label",inactive:"pe-button--inactive",raised:"pe-button--raised",selected:"pe-button--selected",separatorAtStart:"pe-button--separator-start"};const d={general_styles:e=>[r.sel(e,{userSelect:"none","-moz-user-select":"none",outline:"none",padding:0,textDecoration:"none",textAlign:"center",cursor:"pointer",".pe-button--selected, &.pe-button--disabled, &.pe-button--inactive":{cursor:"default",pointerEvents:"none"}," .pe-button__content":{position:"relative",borderRadius:"inherit"}," .pe-button__label":[r.mixin.fontSmoothing(),{position:"relative",display:"block",borderRadius:"inherit",pointerEvents:"none"}]," .pe-button__wash":[r.mixin.fit(),{zIndex:0,borderRadius:"inherit",pointerEvents:"none"}]}),{".pe-button-row":{fontSize:0,lineHeight:0}}],row_margin_h:(e,o)=>[{".pe-button-row":{margin:`0 -${o.row_margin_h}px`,[` ${e}`]:{margin:`0 ${o.row_margin_h}px`}}}]};var a=r.createLayout({varFns:d});const _=(e,o,t)=>r.sel(e,{":not(.pe-button--disabled)":{" .pe-button__content":{borderColor:o["color_"+t+"_border"]}}}),l={general_styles:()=>[]},i=e=>({["color_"+e+"_text"]:(o,t)=>[r.sel(o,{":not(.pe-button--disabled)":{"&, &:link, &:visited":{color:t["color_"+e+"_text"]}}})],["color_"+e+"_disabled_text"]:(o,t)=>[r.sel(o,{".pe-button--disabled":{color:t["color_"+e+"_disabled_text"]}})],["color_"+e+"_background"]:(o,t)=>[r.sel(o,{":not(.pe-button--disabled):not(.pe-button--selected)":{" .pe-button__content":{backgroundColor:t["color_"+e+"_background"]}}})],["color_"+e+"_active_background"]:(o,t)=>[r.sel(o,{":not(.pe-button--disabled)":{".pe-button--selected":{" .pe-button__content":{backgroundColor:t["color_"+e+"_active_background"]}}}})],["color_"+e+"_disabled_background"]:(o,t)=>[r.sel(o,{".pe-button--disabled":{" .pe-button__content":{backgroundColor:t["color_"+e+"_disabled_background"]}}})],["color_"+e+"_border"]:(o,t)=>[_(`${o}.pe-button--border`,t,e)],border:(o,t)=>[_(o,t,e)],["color_"+e+"_active_border"]:(o,t)=>[r.sel(o,{".pe-button--border.pe-button--selected":{" .pe-button__content":{borderColor:t["color_"+e+"_active_border"]}}})],["color_"+e+"_disabled_border"]:(o,t)=>[r.sel(o,{".pe-button--border.pe-button--disabled":{" .pe-button__content":{borderColor:t["color_"+e+"_disabled_border"]}}})],["color_"+e+"_icon"]:(o,t)=>[r.sel(o,{" .pe-button__dropdown":{color:t["color_"+e+"_icon"]}})],["color_"+e+"_separator"]:(o,t)=>[r.sel(o,{".pe-button--separator-start":{" .pe-button__content":{borderColor:t["color_"+e+"_separator"]}}})]}),s=e=>({["color_"+e+"_hover"]:(o,t)=>[r.sel(o,{":not(.pe-button--disabled):not(.pe-button--selected)":{color:t["color_"+e+"_hover"]}})],["color_"+e+"_hover_border"]:(o,t)=>[r.sel(o,{":not(.pe-button--disabled):not(.pe-button--selected)":{" .pe-button__content":{borderColor:t["color_"+e+"_hover_border"]}}})],["color_"+e+"_wash_background"]:(o,t)=>[r.sel(o,{":not(.pe-button--disabled):not(.pe-button--selected)":{" .pe-button__wash":{backgroundColor:t["color_"+e+"_wash_background"]}}})],["color_"+e+"_hover_background"]:(o,t)=>[r.sel(o,{":not(.pe-button--disabled):not(.pe-button--selected)":{" .pe-button__content":{backgroundColor:t["color_"+e+"_hover_background"]}}})],["color_"+e+"_hover_icon"]:(o,t)=>[r.sel(o,{" .pe-button__dropdown":{color:t["color_"+e+"_hover_icon"]}})]}),b=Object.assign({},l,i("light")),p=Object.assign({},l,i("dark")),c=s("light"),u=s("dark");var g=r.createColor({varFns:{lightTintFns:b,darkTintFns:p,lightTintHoverFns:c,darkTintHoverFns:u}});const h=e=>()=>({".pe-button--separator-start .pe-button__content":{borderStyle:e?"none solid none none":"none none none solid"}}),v=h(!1),k=h(!0),m=(e,o)=>r.sel(e,{" .pe-button__dropdown":{minHeight:`calc((1em * ${o.line_height}) + 2 * ${o.label_padding_v}px)`}}),w=(e,o)=>r.sel(e,{".pe-button--high-label":{padding:0," .pe-button__label":{padding:o.outer_padding_v+o.label_padding_v+"px 0"}}}),x=(e,o)=>r.sel(e,{".pe-button--high-label":{" .pe-button__label, .pe-button__dropdown":{minHeight:`calc((1em * ${o.line_height}) + 2 * ${o.outer_padding_v+o.label_padding_v}px)`}}}),f=(e,o,t)=>r.sel(e,{" .pe-button__content":{borderRadius:o.border_radius+"px"},":not(:first-child)":{" .pe-button__content":{[t?"borderTopRightRadius":"borderTopLeftRadius"]:0,[t?"borderBottomRightRadius":"borderBottomLeftRadius"]:0}},":not(:last-child)":{" .pe-button__content":{[t?"borderTopLeftRadius":"borderTopRightRadius"]:0,[t?"borderBottomLeftRadius":"borderBottomRightRadius"]:0}}}),y=(e,o)=>r.sel(e,{" .pe-button__wash, .pe-ripple":r.mixin.fit(-1)," .pe-button__content":{borderStyle:"solid",paddingLeft:o.padding_h_border+"px",paddingRight:o.padding_h_border+"px"}}),R=(e,o)=>r.sel(e,{" .pe-button__content":{borderWidth:o.border_width+"px"}," .pe-button-group & + &":{marginLeft:-o.border_width+"px"}}),S={general_styles:(e,o)=>[r.sel(e,[v(),{display:"inline-block",background:"transparent",border:"none"," .pe-button__content":{position:"relative",borderWidth:"1px",display:"flex",alignItems:"center",justifyContent:"center"},".pe-button--border":y(e,o)," .pe-button__label, .pe-button__dropdown":{whiteSpace:"pre",userSelect:"none","-moz-user-select":"none"}," .pe-button__text-label":{display:"inline-block",lineHeight:1},".pe-button--dropdown":{minWidth:"0"," .pe-button__dropdown":{position:"relative"}," .pe-svg":{position:"absolute",left:0,top:"50%"}," .pe-button__label + .pe-button__dropdown":{marginLeft:"6px",minWidth:0}}," .pe-button-group &":{minWidth:0}," .pe-button__dropdown .pe-svg":r.mixin.defaultTransition("transform"),".pe-button--dropdown-open":{" .pe-button__dropdown .pe-svg":{transform:"rotate(-180deg)"}}}]),[r.sel(r.selectorRTL(e),k())]],border_radius:(e,o)=>[r.sel(e,{" .pe-button__content":{borderRadius:o.border_radius+"px"}}),f(`.pe-button-group ${e}`,o,!1),f(r.selectorRTL(`.pe-button-group ${e}`),o,!0)],border_width:(e,o)=>[R(e,o)],min_width:(e,o)=>[r.sel(e,{minWidth:o.min_width+"px"})],animation_duration:(e,o)=>[r.sel(e,{" .pe-button__content, .pe-button__wash":[r.mixin.defaultTransition("all",o.animation_duration)]})],padding_h:(e,o)=>[r.sel(e,{" .pe-button__content":{padding:"0 "+o.padding_h+"px"," .pe-button__dropdown":{minWidth:`calc(36px - 2 * ${o.padding_h}px)`},".pe-button--dropdown":{" .pe-button__label + .pe-button__dropdown":{marginRight:`calc(7px - ${o.padding_h}px)`}}}})],padding_h_extra_wide:(e,o)=>[r.sel(e,{".pe-button--extra-wide .pe-button__content":{padding:"0 "+o.padding_h_extra_wide+"px"}})],label_padding_v:(e,o)=>[r.sel(e,{" .pe-button__label":{padding:o.label_padding_v+"px 0"},".pe-button--border":{" .pe-button__label":{padding:o.label_padding_v-1+"px 0"}}}),m(e,o),w(e,o),x(e,o)],font_weight:(e,o)=>[r.sel(e,{" .pe-button__label":{fontWeight:o.font_weight}})],text_transform:(e,o)=>[r.sel(e,{" .pe-button__label":{textTransform:o.text_transform}})],font_size:(e,o)=>[r.sel(e,{" .pe-button__label, .pe-button__dropdown":{fontSize:o.font_size+"px"}})],line_height:(e,o)=>[r.sel(e,{" .pe-button__label, .pe-button__dropdown":{lineHeight:o.line_height}}),m(e,o),x(e,o)],dropdown_icon_size:(e,o)=>[r.sel(e,{".pe-button--dropdown":{" .pe-button__dropdown":{width:o.dropdown_icon_size+"px"}," .pe-svg":{width:o.dropdown_icon_size+"px",height:o.dropdown_icon_size+"px",marginTop:-o.dropdown_icon_size/2+"px"}}})],outer_padding_v:(e,o)=>[r.sel(e,{padding:o.outer_padding_v+"px 0",".pe-button--high-label":{padding:0}}),w(e,o),x(e,o)],separator_width:(e,o)=>[r.sel(e,{".pe-button--separator-start":{" .pe-button__content":{borderWidth:o.separator_width+"px"}}})],letter_spacing:(e,o)=>[r.sel(e,{letterSpacing:o.letter_spacing+"px"})],border:(e,o)=>o.border&&y(e,o),contained:(e,o)=>o.contained&&((e,o)=>r.sel(e,{" .pe-button__content":{paddingLeft:o.padding_h+"px",paddingRight:o.padding_h+"px"}," .pe-button__wash":{display:"none"}}))(e,o),...t.sharedVarFns};var L=r.createLayout({varFns:S});const C=Object.assign({},{border:!1,contained:!0},t.sharedVars);var $=Object.assign({},{general_styles:!0,padding_h:4*o.vars.grid_unit,color_light_background:"#fff",color_light_disabled_background:r.rgba(o.vars.color_light_foreground,o.vars.blend_light_background_disabled),color_light_wash_background:"transparent",color_dark_active_background:r.rgba(o.vars.color_primary_dark),color_dark_background:r.rgba(o.vars.color_primary),color_dark_disabled_background:r.rgba(o.vars.color_dark_foreground,o.vars.blend_dark_background_disabled),color_dark_wash_background:"transparent"},C);const z=o.vars.unit_touch_height,T=Object.assign({},{border:!1,contained:!1},t.sharedVars),j={border_width:1,padding_h_border:$.padding_h,color_light_border:r.rgba(o.vars.color_light_foreground,o.vars.blend_light_border_medium),color_light_disabled_border:r.rgba(o.vars.color_light_foreground,o.vars.blend_light_text_disabled),color_dark_border:r.rgba(o.vars.color_dark_foreground,o.vars.blend_dark_border_medium),color_dark_disabled_border:r.rgba(o.vars.color_dark_foreground,o.vars.blend_dark_text_disabled)};var Q=Object.assign({},{general_styles:!0,animation_duration:o.vars.animation_duration,border_radius:o.vars.unit_item_border_radius,dropdown_icon_size:24,font_size:14,font_weight:500,label_padding_v:11,letter_spacing:.75,line_height:1,min_width:8*o.vars.grid_unit_component,outer_padding_v:(z-36)/2,padding_h:2*o.vars.grid_unit,padding_h_extra_wide:6*o.vars.grid_unit,row_margin_h:o.vars.grid_unit,separator_width:1,text_transform:"uppercase",color_light_background:"transparent",color_light_text:r.rgba(o.vars.color_light_foreground,o.vars.blend_light_text_primary),color_light_wash_background:r.rgba(o.vars.color_light_foreground,o.vars.blend_light_background_hover),color_light_active_background:r.rgba(o.vars.color_light_foreground,o.vars.blend_light_background_active),color_light_disabled_background:"transparent",color_light_disabled_text:r.rgba(o.vars.color_light_foreground,o.vars.blend_light_text_disabled),color_light_icon:r.rgba(o.vars.color_light_foreground,o.vars.blend_light_text_secondary),color_light_separator:r.rgba(o.vars.color_light_foreground,o.vars.blend_light_border_light),color_dark_background:"transparent",color_dark_text:r.rgba(o.vars.color_dark_foreground,o.vars.blend_dark_text_primary),color_dark_wash_background:r.rgba(o.vars.color_dark_foreground,o.vars.blend_dark_background_hover),color_dark_active_background:r.rgba(o.vars.color_dark_foreground,o.vars.blend_dark_background_active),color_dark_disabled_background:"transparent",color_dark_disabled_text:r.rgba(o.vars.color_dark_foreground,o.vars.blend_dark_text_disabled),color_dark_icon:r.rgba(o.vars.color_dark_foreground,o.vars.blend_dark_text_secondary),color_dark_separator:r.rgba(o.vars.color_dark_foreground,o.vars.blend_dark_border_light)},j,T);const W=[L,g],F=[a],O=`.${n.super}`,V=`.${n.component}`;r.styler.addStyle({selectors:[O],fns:F,vars:Q}),r.styler.addStyle({selectors:[V],fns:W,vars:Q});var B=r.createColor({superColor:g});const H=[r.createLayout({superLayout:L}),B],q=`.${[n.component,n.contained].join(" ").split(/\s/).join(".")}`,A=(r.styler.createAddStyle(q,H,$),r.styler.createGetStyle(q,H,$));r.styler.addStyle({selectors:[q],fns:H,vars:$});const E=Q,D=g,I=L;e.addStyle=((e,o,{mediaQuery:t}={})=>{((e,o,{mediaQuery:t}={})=>{const n=o&&o.contained?$:Q;e&&r.styler.addStyle({selectors:[O,e],fns:F,vars:n,customVars:o,mediaQuery:t}),e&&r.styler.addStyle({selectors:[V,e],fns:W,vars:n,customVars:o,mediaQuery:t})})(e,o,{mediaQuery:t})}),e.getStyle=((e="",o,{mediaQuery:t}={})=>((e="",o,{mediaQuery:t}={})=>{const n=o&&o.contained?$:Q;return r.styler.getStyle({selectors:[O,e],fns:F,vars:n,customVars:o,mediaQuery:t}).concat(r.styler.getStyle({selectors:[V,e],fns:W,vars:n,customVars:o,mediaQuery:t}))})(e,o,{mediaQuery:t}).concat(A(e,o,{mediaQuery:t}))),e.textButtonColor=D,e.textButtonLayout=I,e.textButtonVars=E,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-css-button.js.map
