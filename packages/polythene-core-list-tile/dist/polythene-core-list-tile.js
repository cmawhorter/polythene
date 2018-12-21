!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("polythene-core")):"function"==typeof define&&define.amd?define(["exports","polythene-core"],t):t(e.polythene={},e["polythene-core"])}(this,function(e,t){"use strict";var l={component:"pe-list-tile",content:"pe-list-tile__content",highSubtitle:"pe-list-tile__high-subtitle",primary:"pe-list-tile__primary",secondary:"pe-list-tile__secondary",subtitle:"pe-list-tile__subtitle",title:"pe-list-tile__title",contentFront:"pe-list-tile__content-front",compact:"pe-list-tile--compact",compactFront:"pe-list-tile--compact-front",disabled:"pe-list-tile--disabled",hasFront:"pe-list-tile--front",hasHighSubtitle:"pe-list-tile--high-subtitle",hasSubtitle:"pe-list-tile--subtitle",header:"pe-list-tile--header",hoverable:"pe-list-tile--hoverable",selectable:"pe-list-tile--selectable",selected:"pe-list-tile--selected",highlight:"pe-list-tile--highlight",sticky:"pe-list-tile--sticky",navigation:"pe-list-tile--navigation"};const n=(e,n,i,s,a)=>{const o=s.keyboardControl?null:s.url,c=s.element?s.element:o?"a":"div",r=[l.content,l.contentFront,s.compactFront?l.compactFront:null].join(" "),u=s.front?e("div",Object.assign({},i?{key:"front"}:null,{className:r}),s.front):s.indent?e("div",Object.assign({},i?{key:"front"}:null,{className:r})):null,d=!s.header&&s.url,b=Object.assign({},t.filterSupportedAttributes(s),s.events,{className:l.primary,style:null},d&&{[n.tabindex]:s[n.tabindex]||0},o),p=s.content?s.content:[u,e("div",{className:l.content,style:s.style},[s.content?Object.assign({},i?{key:"content"}:null,s.content):a,s.title&&!s.content?e("div",Object.assign({},i?{key:"title"}:null,{className:l.title}),s.title):null,s.subtitle?e("div",Object.assign({},i?{key:"subtitle"}:null,{className:l.subtitle}),s.subtitle):null,s.highSubtitle?e("div",Object.assign({},i?{key:"highSubtitle"}:null,{className:l.subtitle+" "+l.highSubtitle}),s.highSubtitle):null,s.subContent?e("div",Object.assign({},i?{key:"subContent"}:null,{className:l.subContent}),s.subContent):null])];return e(c,b,p)},i=(e,n,i,s,a={})=>{const o=a.keyboardControl?null:a.url,c=a.element?a.element:o?"a":"div",r=a.url;return e(c,Object.assign({},o,{className:l.secondary},i?{key:"secondary"}:null,t.filterSupportedAttributes(a),r&&{[n.tabindex]:a[n.tabindex]||0}),e("div",{className:l.content},[a.icon?e(s,a.icon):null,a.content?a.content:null]))};var s=Object.freeze({getElement:()=>"div",createProps:(e,{keys:n})=>{const i=e.attrs,s=!(i.header||i.url||i.secondary&&i.secondary.url),a=i.subtitle?l.hasSubtitle:i.highSubtitle?l.hasHighSubtitle:i.front||i.indent?l.hasFront:null;return Object.assign({},t.filterSupportedAttributes(i,{remove:["tabindex","tabIndex"]}),{className:[l.component,i.selected?l.selected:null,i.disabled?l.disabled:null,i.sticky?l.sticky:null,i.compact?l.compact:null,i.hoverable?l.hoverable:null,i.selectable?l.selectable:null,i.highlight?l.highlight:null,i.header?l.header:null,i.navigation?l.navigation:null,"dark"===i.tone?"pe-dark-tone":null,"light"===i.tone?"pe-light-tone":null,a,i.className||i[n.class]].join(" ")},s&&{[n.tabindex]:i[n.tabindex]||0})},createContent:(e,{renderer:t,requiresKeys:l,keys:s,Ripple:a,Icon:o})=>{const c=e.attrs,r=Object.assign({},l?{key:"primary"}:null,c);return delete r.id,delete r[s.class],[c.ink&&!c.disabled?t(a,Object.assign({},c.ripple,l?{key:"ripple"}:null)):null,n(t,s,l,r,c.children||e.children),c.secondary?i(t,s,l,o,c.secondary):null]}});e.coreListTile=s,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-list-tile.js.map
