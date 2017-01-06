!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("mithril"),require("polythene-icon"),require("polythene-ripple"),require("polythene-core"),require("polythene-css"),require("polythene-theme")):"function"==typeof define&&define.amd?define(["exports","mithril","polythene-icon","polythene-ripple","polythene-core","polythene-css","polythene-theme"],t):t(e.polythene=e.polythene||{},e.m,e["polythene-icon"],e["polythene-ripple"],e["polythene-core"],e["polythene-css"],e["polythene-theme"])}(this,function(e,t,i,l,n,o,r){"use strict";t="default"in t?t.default:t;var s=r.vars.rgba,_=48,a=8,d=56,p={single_height:_,single_line_height:_-2*a-11,single_with_icon_height:d,single_with_icon_line_height:d-2*a-11,padding:13,compact_padding:9,subtitle_line_count:1,has_subtitle_padding:15,high_subtitle_line_count:2,has_high_subtitle_padding:13,front_item_width:72,side_padding:2*r.vars.grid_unit_component,font_size_title:16,font_size_subtitle:14,line_height_subtitle:20,font_size_list_header:14,font_size_small:12,color_light_title:s(r.vars.color_light_foreground,r.vars.blend_light_text_primary),color_light_subtitle:s(r.vars.color_light_foreground,r.vars.blend_light_text_secondary),color_light_info:s(r.vars.color_light_foreground,r.vars.blend_light_text_tertiary),color_light_text_disabled:s(r.vars.color_light_foreground,r.vars.blend_light_text_disabled),color_light_list_header:s(r.vars.color_light_foreground,r.vars.blend_light_text_tertiary),color_light_background_hover:s(r.vars.color_light_foreground,r.vars.blend_light_background_hover),color_light_background_selected:s(r.vars.color_light_foreground,r.vars.blend_light_background_hover),color_dark_title:s(r.vars.color_dark_foreground,r.vars.blend_dark_text_primary),color_dark_subtitle:s(r.vars.color_dark_foreground,r.vars.blend_dark_text_secondary),color_dark_info:s(r.vars.color_dark_foreground,r.vars.blend_dark_text_tertiary),color_dark_text_disabled:s(r.vars.color_dark_foreground,r.vars.blend_dark_text_disabled),color_dark_list_header:s(r.vars.color_dark_foreground,r.vars.blend_dark_text_tertiary),color_dark_background_hover:s(r.vars.color_dark_foreground,r.vars.blend_dark_background_hover),color_dark_background_selected:s(r.vars.color_dark_foreground,r.vars.blend_dark_background_hover)},c=function(e){return{"padding-left":e+"px","padding-right":e+"px"}},h=function(e,t){return{"padding-top":e+"px","padding-bottom":(t||e)+"px"}},u=function(e){return[{".pe-list-tile":[o.flex.layout,{position:"relative",overflow:"hidden","&.pe-list-tile--sticky":[o.mixin.sticky(2)]," .pe-list-tile__primary, .pe-list-tile__secondary":[o.flex.layoutHorizontal,{"text-decoration":"none",color:"inherit",border:"none"}]," .pe-list-tile__primary":[o.flex.flex(),{position:"relative"," .pe-list-tile__content:not(.pe-list-tile__content--front)":[o.flex.flex(),h(e.padding,e.padding+1)]}]," .pe-list-tile__secondary":{"text-align":"right","font-size":e.font_size_title+"px",position:"relative"}," .pe-list-tile__content":[o.flex.layoutVertical,o.flex.selfCenter,c(e.side_padding),{"&.pe-list-tile__content--front":[h(e.padding-5),{width:e.front_item_width+"px"}]," small":{"font-size":e.font_size_small+"px"}}]," .pe-list-tile__content--front + .pe-list-tile__content":{"padding-left":0}," .pe-list-tile__title":[o.mixin.ellipsis(1),{"font-size":e.font_size_title+"px","font-weight":r.vars.font_weight_normal,"line-height":e.single_line_height+"px"}]," .pe-list-tile__subtitle":[o.mixin.ellipsis(e.subtitle_line_count,e.line_height_subtitle),{"font-size":e.font_size_subtitle+"px","line-height":e.line_height_subtitle+"px","&.pe-list-tile__subtitle--high":[o.mixin.ellipsis(e.high_subtitle_line_count,e.line_height_subtitle),{"white-space":"normal"}]}],"&.pe-list-tile--selected, &.pe-list-tile--disabled":{" a":{"pointer-events":"none"}},"&.pe-list-tile--subtitle":{" .pe-list-tile__content":[h(e.has_subtitle_padding,e.has_subtitle_padding+1),{" .pe-list-tile__title":{padding:0}}]},"&.pe-list-tile--high-subtitle":{" .pe-list-tile--high-subtitle .pe-list-tile__secondary":[o.flex.layoutHorizontal,o.flex.layoutStart]," .pe-list-tile__content":[o.flex.selfStart,h(e.has_high_subtitle_padding,e.has_high_subtitle_padding+1),{" .pe-list-tile__title":{padding:0}}]},"&.pe-list__header":{height:e.single_height+"px"," .pe-list-tile__content":{"padding-top":0,"padding-bottom":0}," .pe-list-tile__title":[o.mixin.ellipsis(1,e.single_height),{"font-size":e.font_size_list_header+"px","font-weight":r.vars.font_weight_medium,"line-height":e.single_height+"px",padding:0}]}," .pe-list--compact &, &.pe-list-tile--compact":{"&:not(.pe-list__header)":{" .pe-list-tile__content":h(e.compact_padding,e.compact_padding+1)}},"@supports (-moz-appearance:none) and (display:contents)":{" .pe-list-tile__primary, .pe-list-tile__content":{overflow:"hidden"}},".pe-dialog .pe-menu__content &":{" .pe-list-tile__title":o.mixin.ellipsis("none")},".pe-menu__content &":{"&:not(.pe-list-tile--disabled)":{cursor:"default","&, .pe-list-tile__primary, .pe-list-tile__secondary":{" .pe-list-tile__title, .pe-list-tile__subtitle":[o.mixin.vendorize({"user-select":"none"},r.vars.prefixes_user_select)]}}},"html.pe-no-touch .pe-list--hoverable &,                 html.pe-no-touch .pe-list--selectable &,                 html.pe-no-touch &.pe-list-tile--hoverable,                 html.pe-no-touch &.pe-list-tile--selectable":{"&:not(.pe-list__header):not(.pe-list-tile--disabled):not(.pe-list-tile--selected):hover":{cursor:"pointer"}}}]}]},g=function(e){return o.mixin.createStyles(e,u)},b=function(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e},f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var l in i)Object.prototype.hasOwnProperty.call(i,l)&&(e[l]=i[l])}return e},v=function(e,t){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";return[b({},i+".pe-list-tile",{" .pe-list-tile__title":{color:e["color_"+t+"_title"]},"&.pe-list__header":{"background-color":"inherit"," .pe-list-tile__title":{color:e["color_"+t+"_list_header"]}}," .pe-list-tile__content, .pe-list-tile__subtitle":{color:e["color_"+t+"_subtitle"]},"&.pe-list-tile--disabled":{"&, .pe-list-tile__title, .pe-list-tile__content, .pe-list-tile__subtitle":{color:e["color_"+t+"_text_disabled"]}},"&.pe-list-tile--selected":{"background-color":e["color_"+t+"_background_selected"]}})]},m=function(e,t){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";return[b({},i+".pe-list-tile",{"&:not(.pe-list__header):not(.pe-list-tile--disabled):hover":{"background-color":e["color_"+t+"_background_hover"]}})]},y=function(e){return[v(e,"light"),{"html.pe-no-touch":[m(e,"light"," .pe-list-tile--hoverable")]},{".pe-dark-theme":[v(e,"dark"," "),v(e,"dark","&")]},{"html.pe-no-touch .pe-dark-theme":m(e,"dark"," .pe-list-tile--hoverable")}]},x=function(e){return o.mixin.createStyles(e,y)};o.styler.styleComponent("pe-list-tile","list-tile",r.styles,p,g,x);var k={component:"pe-list-tile",primary:"pe-list-tile__primary",secondary:"pe-list-tile__secondary",content:"pe-list-tile__content",contentFront:"pe-list-tile__content--front",title:"pe-list-tile__title",subtitle:"pe-list-tile__subtitle",highSubtitle:"pe-list-tile__subtitle--high",selected:"pe-list-tile--selected",disabled:"pe-list-tile--disabled",sticky:"pe-list-tile--sticky",hasSubtitle:"pe-list-tile--subtitle",hasHighSubtitle:"pe-list-tile--high-subtitle",hasFront:"pe-list-tile--front",isCompact:"pe-list-tile--compact",isHoverable:"pe-list-tile--hoverable",isSelectable:"pe-list-tile--selectable"},z=function(e,i){var l=e.element?e.element:e.url?"a":"div",o=e.front?t("div",{class:k.content+" "+k.contentFront},e.front):e.indent?t("div",{class:k.content+" "+k.contentFront}):null;return t(l,f({},n.filterSupportedAttributes(e),e.url,{class:k.primary}),[o,t("div",{class:k.content},[e.content?e.content:i&&i[0]?i:null,e.title&&!e.content?t("div",{class:k.title},e.title):null,e.subtitle?t("div",{class:k.subtitle},e.subtitle):null,e.highSubtitle?t("div",{class:k.subtitle+" "+k.highSubtitle},e.highSubtitle):null])])},S=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},l=e.element?e.element:e.url?"a":"div";return t(l,f({},n.filterSupportedAttributes(e),e.url,{class:k.secondary}),t("div",{class:k.content},[e.icon?t(i.icon,e.icon):null,e.content?e.content:null]))},w=function(e){var i=e.attrs,o=i.element||"div",r=i.subtitle?k.hasSubtitle:i.highSubtitle?k.hasHighSubtitle:i.front||i.indent?k.hasFront:null,s=f({},n.filterSupportedAttributes(i),{class:[k.component,i.selected?k.selected:null,i.disabled?k.disabled:null,i.sticky?k.sticky:null,i.compact?k.isCompact:null,i.hoverable?k.isHoverable:null,i.selectable?k.isSelectable:null,r,i.class].join(" ")}),_=f({},i);delete _.id,delete _.class;var a=[i.ink&&!i.disabled?t(l.ripple,i.ripple):null,z(_,e.children),i.secondary?S(i.secondary):null];return t(o,s,[i.before,a,i.after])},j={view:w};e.listTile=j,e.listTileVars=p,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=list-tile.js.map
