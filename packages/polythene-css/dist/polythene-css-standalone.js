var polytheneCSS=function(e){"use strict";const t=4,o=8,n=4,r=48,i=".18s",a=400,l=500,s=1.5,d="33, 150, 243",p="25, 118, 210",c="0, 0, 0",u="255, 255, 255",f=.87,b=.54,_=.26,x=.24,h=.11,g=.14,m=.06,w=.09,v=1,y=.7,k=.26,S=.22,z=.1,j=.14,$=.08,R=.12,C="undefined"!=typeof document,F=!C,A=!F&&"ontouchstart"in document.documentElement,E=A?["click","mouseup"]:["mouseup"];C&&document.querySelector("html").classList.add(A?"pe-touch":"pe-no-touch");const O={},P=(e,t)=>{O[e]&&O[e].forEach(e=>e(t))};C&&(window.addEventListener("resize",e=>P("resize",e)),window.addEventListener("scroll",e=>P("scroll",e)),window.addEventListener("keydown",e=>P("keydown",e)),window.addEventListener(E,e=>P(E,e)));var T=[],V={},L=V.toString,N=L.call(T),M=L.call(V),I=L.call(""),W=L.call(L),H=V.hasOwnProperty,Z=Object.freeze||function(e){return e};function B(e,t){for(var o in t)H.call(t,o)&&(!o.indexOf("$")||o in e||(e[o]=t[o]));return e}function Q(e,t){var o,n,r=[];for(n in t)if(H.call(t,n))for(o in e)H.call(e,o)&&r.push(e[o]+t[n]);return r}var J=/[(),]|"(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\*[\s\S]*?\*\//g;function D(e){for(var t,o=[],n=[],r=0;t=J.exec(e);)switch(t[0]){case"(":r++;break;case")":r--;break;case",":if(r)break;o.push(t.index)}for(t=o.length;t--;)n.unshift(e.slice(o[t]+1)),e=e.slice(0,o[t]);return n.unshift(e),n}var q=/&|"(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\*[\s\S]*?\*\//g;function K(e,t){for(var o,n,r=[],i=[];n=q.exec(e);)"&"==n[0]&&r.push(n.index);for(n=r.length;n--;)i.unshift(e.slice(r[n]+1)),e=e.slice(0,r[n]);for(i.unshift(e),1===i.length&&i.unshift(""),o=[i[0]],n=1;n<i.length;n++)o=Q(o,Q(t,[i[n]]));return o.join(",")}function U(e){return function t(o){if(L.call(o)===N)for(var n=0;n<o.length;n++)t(o[n]);else e(o)}}function G(e){return"-"+e.toLowerCase()}function X(e,t,o,n,r){var i,a,l;if(null!=n)switch(L.call(n=n.valueOf())){case N:for(i=0;i<n.length;i++)X(e,t,o,n[i],r);break;case M:for(i in o=o&&o+"-",n)if(H.call(n,i))if(a=n[i],/\$/.test(i))for(l in i=i.split("$"))H.call(i,l)&&X(e,t,o+i[l],a,r);else X(e,t,o+i,a,r);break;default:i=o.replace(/_/g,"-").replace(/[A-Z]/g,G),!r||"animation-name"!=i&&"animation"!=i&&"list-style"!=i||(n=n.split(",").map(function(t){return t.replace(/^\s*(?:(var\([^)]+\))|:?global\(\s*([_A-Za-z][-\w]*)\s*\)|()(-?[_A-Za-z][-\w]*))/,e.localizeReplacer)}).join(",")),t.decl(i,n)}}function Y(e,t,o,n,r,i,a){for(var l=0;l<e.$atHandlers.length;l++)if(e.$atHandlers[l](e,t,o,n,r,i,a))return;if(!o[3]&&/^global$/.test(o[2]))ee(e,t,r,n,0,a);else if(!o[3]&&/^local$/.test(o[2]))ee(e,t,r,n,1,a);else if(o[3]&&/^adopt$/.test(o[2])){if(!i||a)return t.err("@adopt global or nested: "+o[0]);if(!/^\.?[_A-Za-z][-\w]*$/.test(o[3]))return t.err("bad adopter "+JSON.stringify(o[3])+" in "+o[0]);l=[],U(function(e,n){null!=e&&/^\.?[_A-Za-z][-\w]*(?:\s+\.?[_A-Za-z][-\w]*)*$/.test(n=e+"")?l.push(n.replace(/\./g,"")):t.err("bad adoptee "+JSON.stringify(e)+" in "+o[0])})(n),l.length&&(e.localize(o[3]=o[3].replace(/\./g,"")),e.names[o[3]]+=" "+l.join(" "))}else!o[3]&&/^(?:namespace|import|charset)$/.test(o[2])?U(function(e){t.atrule(o[1],o[2],e)})(n):!o[3]&&/^(?:font-face|viewport)$/.test(o[2])?U(function(n){t.atrule(o[1],o[2],o[3],1),X(e,t,"",n,i),t._atrule()})(n):o[3]&&/^(?:media|supports|page|keyframes)$/.test(o[2])?(i&&"keyframes"==o[2]&&(o[3]=o[3].replace(/(var\([^)]+\))|:?global\(\s*([_A-Za-z][-\w]*)\s*\)|()(-?[_A-Za-z][-\w]*)/,e.localizeReplacer)),t.atrule(o[1],o[2],o[3],1),"page"==o[2]?X(e,t,"",n,i):ee(e,t,"keyframes"==o[2]?"":r,n,i,a+1),t._atrule()):t.err("Unsupported at-rule: "+o[0])}function ee(e,t,o,n,r,i){var a,l,s,d;switch(L.call(n)){case M:for(a in n)if(H.call(n,a))if(l=n[a],o.length>0&&/^[-\w$]+$/.test(a))if(s||(s=1,t.rule(o)),/\$/.test(a))for(d in a=a.split("$"))H.call(a,d)&&X(e,t,a[d],l,r);else X(e,t,a,l,r);else/^@/.test(a)?(s=0,Y(e,t,/^(.(?:-[\w]+-)?([_A-Za-z][-\w]*))\b\s*(.*?)\s*$/.exec(a)||[a,"@","",""],l,o,r,i)):(s=0,ee(e,t,o.length>0&&(/,/.test(o)||/,/.test(a))?(d=D(o),D(r?a.replace(/("(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\*[\s\S]*?\*\/)|:global\(\s*(\.-?[_A-Za-z][-\w]*)\s*\)|(\.)(-?[_A-Za-z][-\w]*)/g,e.localizeReplacer):a).map(function(e){return/&/.test(e)?K(e,d):d.map(function(t){return t+e}).join(",")}).join(",")):/&/.test(a)?K(r?a.replace(/("(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\*[\s\S]*?\*\/)|:global\(\s*(\.-?[_A-Za-z][-\w]*)\s*\)|(\.)(-?[_A-Za-z][-\w]*)/g,e.localizeReplacer):a,[o]):o+(r?a.replace(/("(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\*[\s\S]*?\*\/)|:global\(\s*(\.-?[_A-Za-z][-\w]*)\s*\)|(\.)(-?[_A-Za-z][-\w]*)/g,e.localizeReplacer):a),l,r,i+1));break;case N:for(a=0;a<n.length;a++)ee(e,t,o,n[a],r,i);break;case I:o.length||t.err("No selector"),t.rule(o||" "),X(e,t,"",n,r)}}function te(e,t){var o;return t?e:{init:function(){o=0,e.init()},done:function(t){return o&&(e._rule(),o=0),e.done(t)},atrule:function(t,n,r,i){o&&(e._rule(),o=0),e.atrule(t,n,r,i)},_atrule:function(t){o&&(e._rule(),o=0),e._atrule(t)},rule:function(t){t!==o&&(o&&e._rule(),e.rule(t),o=t)}}}function oe(e){return":global("+e+")"}function ne(e,t,o){return(o={})[e]=t,o}function re(e,t,o){if(arguments.length<3){var n=re.bind.apply(re,[null].concat([].slice.call(arguments,0)));return n.toString=function(){return"@"+e+" "+t},n}return ne("@"+e+" "+t,o)}var ie=function(){var e,t,o={init:function(){e=[],t=[]},done:function(o){if(0!=t.length)throw new Error("j2c error(s): "+JSON.stringify(t,null,2)+"in context:\n"+e.join(""));return o?e:e.join("")},err:function(o){t.push(o),e.push("/* +++ ERROR +++ "+o+" */\n")},atrule:function(t,o,n,r){e.push(t,n&&" ",n,r?" {":";",i.endline)},_atrule:function(){e.push("}",i.endline)},rule:function(t){e.push(t," {",i.endline)},_rule:function(){e.push("}",i.endline)},decl:function(t,o){e.push(t,t&&":",o,";",i.endline)}},n=[te],r=[],i={at:re,global:oe,kv:ne,names:{},endline:"\n",suffix:"__j2c-"+Math.floor(4294967296*Math.random()).toString(36)+"-"+Math.floor(4294967296*Math.random()).toString(36)+"-"+Math.floor(4294967296*Math.random()).toString(36)+"-"+Math.floor(4294967296*Math.random()).toString(36),$plugins:[],sheet:function(e){var t=d(0);return t.init(),ee(a[0],t,"",e,1,0),t.done()},inline:function(e,t){var o=d(1);return o.init(),X(a[1],o,"",e,!(t&&t.global)),o.done()}},a=[{localizeReplacer:c,localize:p,names:i.names,$atHandlers:r,atrule:Y,decl:X,rule:ee},{localizeReplacer:c,localize:p,names:i.names,decl:X}],l=U(function(e){~i.$plugins.indexOf(e)||(i.$plugins.push(e),L.call(e)===W&&(e=e(i)),e&&(U(function(e){n.push(e)})(e.$filter||T),U(function(e){r.push(e)})(e.$at||T),B(i.names,e.$names||V),l(e.$plugins||T),o=e.$sink||o,B(i,e)))}),s=[];function d(e){if(!s.length){n.push(function(e,t){return t?{init:o.init,decl:o.decl,done:o.done,err:o.err}:o});for(var t=0;t<2;t++)for(var r=n.length;r--;)s[t]=Z(B(n[r](s[t],!!t),s[t]))}return s[e]}function p(e){return i.names[e]||(i.names[e]=e+i.suffix),i.names[e].match(/^\S+/)}function c(e,t,o,n,r){return t||o||n+p(r)}return l(T.slice.call(arguments)),i};const ae=[{display:"-webkit-box"},{display:"-moz-box"},{display:"-ms-flexbox"},{display:"-webkit-flex"},{display:"flex"}],le=[ae,{"-ms-flex-align":"center","-webkit-align-items":"center","align-items":"center"}],se=[ae,{"-ms-flex-pack":"center","-webkit-justify-content":"center","justify-content":"center"}];var de={flex:(e=1)=>[{"-webkit-box-flex":e},{"-moz-box-flex":e},{"-webkit-flex":e},{"-ms-flex":e},{flex:e},1===e?{"-webkit-flex-basis":"0.000000001px"}:{},1===e?{"flex-basis":"0.000000001px"}:{}],flexAuto:{"-ms-flex":"1 1 auto","-webkit-flex-basis":"auto","flex-basis":"auto"},flexAutoVertical:{"-ms-flex":"1 1 auto","-webkit-flex-basis":"auto","flex-basis":"auto"},flexIndex:e=>({"-ms-flex":e,"-webkit-flex":e,flex:e}),flexGrow:e=>({"-webkit-flex-grow":e,"flex-grow":e}),layout:ae,layoutAroundJustified:[ae,{"-ms-flex-pack":"distribute","-webkit-justify-content":"space-around","justify-content":"space-around"}],layoutCenter:le,layoutCenterCenter:[se,le],layoutCenterJustified:se,layoutEnd:[ae,{"-ms-flex-align":"end","-webkit-align-items":"flex-end","align-items":"flex-end"}],layoutEndJustified:[ae,{"-ms-flex-pack":"end","-webkit-justify-content":"flex-end","justify-content":"flex-end"}],layoutHorizontal:[ae,{"-ms-flex-direction":"row","-webkit-flex-direction":"row","flex-direction":"row"}],layoutHorizontalReverse:[ae,{"-ms-flex-direction":"row-reverse","-webkit-flex-direction":"row-reverse","flex-direction":"row-reverse"}],layoutInline:[ae,{display:"-ms-inline-flexbox"},{display:"-webkit-inline-flex"},{display:"inline-flex"}],layoutJustified:[ae,{"-ms-flex-pack":"justify","-webkit-justify-content":"space-between","justify-content":"space-between"}],layoutStart:[ae,{"-ms-flex-align":"start","-webkit-align-items":"flex-start","align-items":"flex-start"}],layoutStartJustified:[ae,{"-ms-flex-pack":"start","-webkit-justify-content":"flex-start","justify-content":"flex-start"}],layoutVertical:[ae,{"-ms-flex-direction":"column","-webkit-flex-direction":"column","flex-direction":"column"}],layoutVerticalReverse:[ae,{"-ms-flex-direction":"column-reverse","-webkit-flex-direction":"column-reverse","flex-direction":"column-reverse"}],layoutWrap:[ae,{"-ms-flex-wrap":"wrap","-webkit-flex-wrap":"wrap","flex-wrap":"wrap"}],layoutWrapReverse:[ae,{"-ms-flex-wrap":"wrap-reverse","-webkit-flex-wrap":"wrap-reverse","flex-wrap":"wrap-reverse"}],selfCenter:{"-ms-align-self":"center","-webkit-align-self":"center","align-self":"center"},selfEnd:{"-ms-align-self":"flex-end","-webkit-align-self":"flex-end","align-self":"flex-end"},selfStart:{"-ms-align-self":"flex-start","-webkit-align-self":"flex-start","align-self":"flex-start"},selfStretch:{"-ms-align-self":"stretch","-webkit-align-self":"stretch","align-self":"stretch"}};var pe=(e="all",t=".18s",o="ease-out")=>({transitionDelay:"0ms",transitionDuration:t,transitionTimingFunction:o,transitionProperty:e}),ce=(e=0)=>{const t=e+"px";return{position:"absolute",top:t,right:t,bottom:t,left:t}},ue=(e=!0)=>e?{"-webkit-font-smoothing":"antialiased","-moz-osx-font-smoothing":"grayscale"}:{"-webkit-font-smoothing":"subpixel-antialiased","-moz-osx-font-smoothing":"auto"};var fe,be,_e=(function(e,t){var o,n,r,i,a;function l(e){return e.replace(/-([a-z])/g,function(e,t){return t.toUpperCase()}).replace("-","")}function s(e,t){return n[e]="",n[e]=t,!!n[e]}function d(e,t){return r.textContent="@media ("+e+":"+t+"){}",!!~r.sheet.cssRules[0].cssText.indexOf(t)}function p(e){return e in n}function c(e){return r.textContent=e+"{}",!!r.sheet.cssRules.length}Object.defineProperty(t,"__esModule",{value:!0});var u=[{props:["cursor"],values:["grab","grabbing","zoom-in","zoom-out"]},{props:["display"],values:["box","inline-box","flexbox","inline-flexbox","flex","inline-flex","grid","inline-grid"]},{props:["position"],values:["sticky"]},{props:["width","column-width","height","max-height","max-width","min-height","min-width"],values:["contain-floats","fill-available","fit-content","max-content","min-content"]}],f={"align-items":"box-align",flex:"box-flex","box-direction":"box-direction","box-orient":"box-orient","flex-grow":"box-flex","flex-wrap":"box-lines","justify-content":"box-pack",order:"box-ordinal-group"},b={"flex-end":"end","flex-start":"start",nowrap:"single","space-around":"justify","space-between":"justify",wrap:"multiple","wrap-reverse":"multiple"},_={"align-content":"-ms-flex-line-pack","align-items":"-ms-flex-align","align-self":"-ms-flex-item-align","flex-basis":"-ms-preferred-size","flex-grow":"-ms-flex-positive","flex-shrink":"-ms-flex-negative","justify-content":"-ms-flex-pack",order:"-ms-flex-order"},x={"flex-end":"end","flex-start":"start","space-around":"distribute","space-between":"justify"};function h(e){o=getComputedStyle(document.documentElement,null),n=document.createElement("div").style,r=document.documentElement.appendChild(document.createElement("style")),a=s,i=p,"zIndex"in n&&!("z-index"in n)&&(a=function(e,t){return s(l(e),t)},i=function(e){return p(l(e))}),function(e){var t={};function n(e){if("-"===e.charAt(0)){var o=e.split("-")[1];t[o]=++t[o]||1}}if(o&&o.length>0)for(var r=0;r<o.length;r++)n(o[r]);else for(var i in o)n(i.replace(/[A-Z]/g,function(e){return"-"+e.toLowerCase()}));var a=[];for(var s in t)a.push(s);a.sort(function(e,o){return t[o]-t[e]}),e.prefixes=a.map(function(e){return"-"+e+"-"}),e.prefix=e.prefixes[0]||"",c("_:-ms-lang(x), _:-webkit-full-screen")&&e.prefixes.push("-ms-"),e.Prefix=l(e.prefix)}(e),function(e){var t,o;function n(t){return t.replace(/^::?/,function(t){return t+e.prefix})}if(""!==e.prefix){var r={":any-link":null,"::backdrop":null,":fullscreen":null,":full-screen":":fullscreen","::placeholder":null,":placeholder":"::placeholder","::input-placeholder":"::placeholder",":input-placeholder":"::placeholder",":read-only":null,":read-write":null,"::selection":null};for(t in r)o=n(t),!c(r[t]||t)&&c(o)&&(e.hasSelectors=!0,e.selectorList.push(r[t]||t),e.selectorMap[r[t]||t]=o)}}(e),function(e){if(""!==e.prefix){var t={keyframes:"name",viewport:null,document:'regexp(".")'};for(var o in t)for(var n=o+" "+(t[o]||""),r=e.prefixes.length;r--;)!c("@"+n)&&c("@"+e.prefixes[r]+n)&&(e.hasAtrules=!0,e.atrules["@"+o]="@"+e.prefixes[r]+o);e.hasDppx=d("resolution","1dppx"),e.hasPixelRatio=d(e.prefix+"device-pixel-ratio","1"),e.hasPixelRatioFraction=d(e.prefix+"device-pixel-ratio","1/1"),(e.hasPixelRatio||e.hasPixelRatioFraction)&&(e.properties.resolution=e.prefix+"device-pixel-ratio",e.properties["min-resolution"]=e.prefix+"min-device-pixel-ratio",e.properties["max-resolution"]=e.prefix+"max-device-pixel-ratio",d("min-"+e.prefix+"device-pixel-ratio","1")&&(e.properties["min-resolution"]="min-"+e.prefix+"device-pixel-ratio",e.properties["max-resolution"]="max-"+e.prefix+"device-pixel-ratio"))}}(e),function(e){if(0!==e.prefixes.length){for(var t=0;t<u.length;t++){for(var o,n={},r=u[t].props[0],i=0;o=u[t].values[i];i++)for(var l=e.prefixes.length;l--;)!a(r,o)&&a(r,e.prefixes[l]+o)&&(e.hasKeywords=!0,n[o]=e.prefixes[l]+o);for(i=0;r=u[t].props[i];i++)e.keywords[r]=n}if(e.keywords.display&&e.keywords.display.flexbox&&!a("display","flex"))for(l in e.keywords.display.flex=e.keywords.display.flexbox,e.keywords.display["inline-flex"]=e.keywords.display["inline-flexbox"],e.flexbox2012=!0,_)e.properties[l]=_[l],e.keywords[l]=x;else if(e.keywords.display&&e.keywords.display.box&&!a("display","flex")&&!a("display",e.prefix+"flex"))for(l in e.keywords.display.flex=e.keywords.display.box,e.keywords.display["inline-flex"]=e.keywords.display["inline-box"],e.flexbox2009=!0,f)e.properties[l]=e.prefix+f[l],e.keywords[l]=b;else!e.keywords.display||e.keywords.display.box||e.keywords.display.flex||e.keywords.display.flexbox||a("display","flex")||(e.jsFlex=!0);!a("color","initial")&&a("color",e.prefix+"initial")&&(e.initial=e.prefix+"initial")}}(e),function(e){if(""!==e.prefix){var t={"linear-gradient":{property:"background-image",params:"red, teal"},calc:{property:"width",params:"1px + 5%"},element:{property:"background-image",params:"#foo"},"cross-fade":{property:"backgroundImage",params:"url(a.png), url(b.png), 50%"}};for(var o in t["repeating-linear-gradient"]=t["repeating-radial-gradient"]=t["radial-gradient"]=t["linear-gradient"],t){var n=t[o],r=n.property,i=o+"("+n.params+")";!a(r,i)&&a(r,e.prefix+i)&&e.functions.push(o)}}}(e),function(e){!a("background-clip","text")&&a("-webkit-background-clip","text")&&(e.WkBCTxt=!0),["background-clip","text-fill-color","text-stroke-color","text-stroke-width","text-stroke"].forEach(function(t){!i(t)&&i("-webkit-"+t)&&(e.properties[t]="-webkit-"+t)})}(e),"undefined"!=typeof document&&document.documentElement.removeChild(r),o=r=null}var g,m={},w=/[(),]|\/\*[\s\S]*?\*\//g;function v(e,t,o){return new RegExp(e+"(?:"+t.join("|")+")"+o)}function y(e,t,o){return new RegExp("\"(?:\\\\[\\S\\s]|[^\"])*\"|'(?:\\\\[\\S\\s]|[^'])*'|\\/\\*[\\S\\s]*?\\*\\/|"+e+"((?:"+t.join("|")+"))"+o,"gi")}function k(e,t,o,n){if("string"!=typeof o||"-"===o.charAt(0))return t(o,n);if("string"!=typeof n&&"number"!=typeof n)return t(e.properties[o]||e.fixProperty(o),n);if(n+="",e.jsFlex){if("display"===o&&("flex"===n||"inline-flex"===n))return void t("-js-display",n)}else if(e.flexbox2009){if("flex-flow"===o)return void n.split(/\s+/).forEach(function(o){o.indexOf("wrap")>-1?k(e,t,"flex-wrap",o):""!==o&&k(e,t,"flex-direction",o)});if("flex-direction"===o)return t(e.properties["box-orient"],n.indexOf("column")>-1?"block-axis":"inline-axis"),void t(e.properties["box-direction"],n.indexOf("-reverse")>-1?"reverse":"normal")}e.WkBCTxt&&"background-clip"===o&&"text"===n?t("-webkit-background-clip",n):t(e.properties[o]||e.fixProperty(o),e.fixValue(n,o))}function S(e){var t=e.prefix;e.fixProperty=e.fixProperty||function(o){var n;return e.properties[o]=i(o)||!i(n=t+o)?o:n};var o=v("",e.selectorList,"(?:\\b|$|[^-])"),n=y("",e.selectorList,"(?:\\b|$|[^-])"),r=function(t,o){return null!=o?e.selectorMap[o]:t};e.fixSelector=function(e){return o.test(e)?e.replace(n,r):e};var a=e.functions.indexOf("linear-gradient")>-1,l=/\blinear-gradient\(/,s=/(^|\s|,|\()((?:repeating-)?linear-gradient\()\s*(-?\d*\.?\d*)deg/gi,d=function(e,t,o,n){return t+o+(90-n)+"deg"},p=!!e.functions.length,c=v("(?:^|\\s|,|\\()",e.functions,"\\s*\\("),u=y("(^|\\s|,|\\()",e.functions,"(?=\\s*\\()");function f(e,o,n){return o+t+n}var b=/^\s*([-\w]+)/gi,_=function(t,o){return e.properties[o]||e.fixProperty(o)};e.fixValue=function(t,o){var n;return null!=e.initial&&"initial"===t?e.initial:e.hasKeywords&&(n=(e.keywords[o]||m)[t])?n:(n=t,e.valueProperties.hasOwnProperty(o)&&(n=-1===t.indexOf(",")?t.replace(b,_):function(e){for(var t,o=[],n=[],r=0;t=w.exec(e);)switch(t[0]){case"(":r++;break;case")":r--;break;case",":if(r)break;o.push(t.index)}for(t=o.length;t--;)n.unshift(e.slice(o[t]+1)),e=e.slice(0,o[t]);return n.unshift(e),n}(t).map(function(e){return e.replace(b,_)}).join(",")),p&&c.test(t)&&(a&&l.test(t)&&(n=n.replace(s,d)),n=n.replace(u,f)),n)};var x,h,g=/((?:min-|max-)?resolution)\s*:\s*((?:\d*\.)?\d+)dppx/g,S=e.hasPixelRatio?function(t,o,n){return e.properties[o]+":"+n}:e.hasPixelRatioFraction?function(t,o,n){return e.properties[o]+":"+Math.round(10*n)+"/10"}:function(e,t,o){return t+":"+Math.round(96*o)+"dpi"};e.fixAtMediaParams=!1!==e.hasDppx?function(e){return e}:function(e){return-1!==e.indexOf("reso")?e.replace(g,S):e};var z=function(e,t){x=e,h=t},j=/\(\s*([-\w]+)\s*:\s*((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|\((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|\((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|\((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|\((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|\((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|\((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|[^\)])*\)|[^\)])*\)|[^\)])*\)|[^\)])*\)|[^\)])*\)|[^\)])*\)|[^\)])*)/g;function $(t,o,n){return k(e,z,o,n),"("+x+":"+h}e.fixAtSupportsParams=function(e){return e.replace(j,$)}}g={atrules:{},hasAtrules:!1,hasDppx:null,hasKeywords:!1,hasPixelRatio:!1,hasPixelRatioFraction:!1,hasSelectors:!1,hasValues:!1,fixAtMediaParams:null,fixAtSupportsParams:null,fixProperty:null,fixSelector:null,fixValue:null,flexbox2009:!1,flexbox2012:!1,functions:[],initial:null,jsFlex:!1,keywords:{},placeholder:null,prefix:"",prefixes:[],Prefix:"",properties:{},selectorList:[],selectorMap:{},valueProperties:{transition:1,"transition-property":1,"will-change":1},WkBCTxt:!1},"function"==typeof getComputedStyle&&h(g),S(g),t.prefixPlugin=function e(){var t=g,o=[];return{set:{setPrefixDb:function(n){return-1===o.indexOf(n)&&(S(n),o.push(n)),t=n,e}},filter:function(e){return{atrule:function(o,n,r,i){e.atrule(t.hasAtrules&&t.atrules[o]||o,n,"@media"===o?t.fixAtMediaParams(r):"@supports"===o?t.fixAtSupportsParams(r):r,i)},decl:function(o,n){k(t,e.decl,o,n)},rule:function(o){e.rule(t.hasSelectors?t.fixSelector(o):o)}}}}}}(fe={exports:{}},fe.exports),fe.exports);(be=_e)&&be.__esModule&&Object.prototype.hasOwnProperty.call(be,"default")&&be.default;const xe=new ie(_e.prefixPlugin),he=/[^a-z0-9\\-]/g,ge=(e,...t)=>we({id:e},...t),me=e=>{if(!F&&e){const t=document.getElementById(e);t&&t.parentNode&&t.parentNode.removeChild(t)}},we=(e,...t)=>{if(F)return;const o=e.id.replace(he,"_"),n=e.document||window.document;me(o);const r=n.createElement("style");o&&r.setAttribute("id",o),t.forEach(e=>{Object.keys(e).length&&e.forEach(e=>{const t={"@global":e},o=xe.sheet(t);r.appendChild(n.createTextNode(o))})}),n.head.appendChild(r)},ve=({selectors:e,fns:t,vars:o,customVars:n,mediaQuery:r})=>{const i=e.join(""),a=t.map(e=>e(i,o,n)).filter(e=>e.length>0);if(0===a.length)return;const l=i.trim().replace(/^[^a-z]?(.*)/,"$1");ge(l,r?[{[r]:a}]:a)},ye=({selectors:e,fns:t,vars:o,customVars:n,mediaQuery:r})=>{const i=e.join(""),a=t.map(e=>e(i,o,n));return r?[{[r]:a}]:a};var ke=ge,Se=ve,ze=(e,t,o)=>(n="",r,{mediaQuery:i}={})=>[ye({selectors:[e,n],fns:t,vars:o,customVars:r,mediaQuery:i})],je=ye;const $e=(e,t)=>({[e]:t}),Re=e=>`*[dir=rtl] ${e}, .pe-rtl ${e}`,Ce=(e,t=1)=>`rgba(${e}, ${t})`,Fe=({varFns:e,customVarFns:t,superStyle:o,varMixin:n,selector:r,scopedSelector:i,componentVars:a,customVars:l})=>{const s={...a,...l},d=l||s,{general_styles:p,...c}=a||{},u=void 0!==o?void 0!==l?o(r,a,l):o(r,c):[],f=Object.assign({},!!l&&t,e);return u.concat(Object.keys(n(d)).map(e=>f&&void 0!==f[e]?f[e](i,s):null).filter(e=>e))},Ae=({varFns:e,customVarFns:t,superLayout:o,varMixin:n=(e=>e)})=>(r,i,a)=>Fe({varFns:e,customVarFns:t,superStyle:o,varMixin:n,selector:r,scopedSelector:r,componentVars:i,customVars:a}),Ee=({scopes:e,selector:t,isNoTouch:o=!1})=>t.split(/\s*,\s*/).map(t=>(({scopes:e,selector:t,isNoTouch:o=!1})=>o?e.map(e=>e+t+":hover").join(","):e.map(e=>e+t).join(","))({scopes:e,selector:t,isNoTouch:o})),Oe=[{scopes:[".pe-dark-tone",".pe-dark-tone "],varFnName:"darkTintFns",isNoTouch:!1},{scopes:["",".pe-light-tone",".pe-light-tone "],varFnName:"lightTintFns",isNoTouch:!1},{scopes:[".pe-no-touch .pe-dark-tone "],varFnName:"darkTintHoverFns",isNoTouch:!0},{scopes:[".pe-no-touch ",".pe-no-touch .pe-light-tone "],varFnName:"lightTintHoverFns",isNoTouch:!0}],Pe=({varFns:e={},superColor:t,varMixin:o=(e=>e)})=>(n,r,i)=>Oe.map(({scopes:a,varFnName:l,isNoTouch:s})=>(({selector:e,scopedSelector:t,componentVars:o,customVars:n,varFns:r,superColor:i,varMixin:a})=>Fe({varFns:r,superStyle:i,varMixin:a,selector:e,scopedSelector:t,componentVars:o,customVars:n}))({selector:n,scopedSelector:Ee({scopes:a,selector:n,isNoTouch:s}),componentVars:r,customVars:i,varFns:e[l],superColor:t,varMixin:o}));var Te=[{".layout, .layout.horizontal":de.layout,".layout.horizontal.inline, .layout.vertical.inline":de.layoutInline,".layout.horizontal":de.layoutHorizontal,".layout.horizontal.reverse":de.layoutHorizontalReverse,".layout.vertical":de.layoutVertical,".layout.vertical.reverse":de.layoutVerticalReverse,".layout.wrap":de.layoutWrap,".layout.wrap.reverse":de.layoutWrapReverse,".flex":de.flex(1),".span.flex":{display:"block"},".flex.auto-vertical":de.flexAutoVertical,".flex.auto":de.flexAuto,".flex.none":de.flexIndex("none"),".flex.one":de.flexIndex(1),".flex.two":de.flexIndex(2),".flex.three":de.flexIndex(3),".flex.four":de.flexIndex(4),".flex.five":de.flexIndex(5),".flex.six":de.flexIndex(6),".flex.seven":de.flexIndex(7),".flex.eight":de.flexIndex(8),".flex.nine":de.flexIndex(9),".flex.ten":de.flexIndex(10),".flex.eleven":de.flexIndex(11),".flex.twelve":de.flexIndex(12),".layout.start":de.layoutStart,".layout.center, .layout.center-center":de.layoutCenter,".layout.end":de.layoutEnd,".layout.start-justified":de.layoutStartJustified,".layout.center-justified, .layout.center-center":de.layoutCenterJustified,".layout.end-justified":de.layoutEndJustified,".layout.around-justified":de.layoutAroundJustified,".layout.justified":de.layoutJustified,".self-start":de.selfStart,".self-center":de.selfCenter,".self-end":de.selfEnd,".self-stretch":de.selfStretch}],Ve=[{".pe-block":{display:"block"},".pe-inline-block":{display:"inline-block"},".pe-hidden":{display:"none !important"},".pe-relative":{position:"relative"},".pe-absolute":{position:"absolute"},".pe-fit":{position:"absolute",top:0,right:0,bottom:0,left:0},".pe-fullbleed":{margin:0,height:"100vh"},".pe-rtl":{direction:"rtl"},"*[dir=rtl], .pe-rtl ":{" .pe-rtl--flip":{transform:"scaleX(-1)"}}}];const Le=(e,t)=>(o,n)=>$e(o,{[` .pe-shadow__${e}.pe-shadow--depth-${t}`]:{boxShadow:n[`shadow_${e}_depth_${t}`]}}),Ne=(e,t,o,n)=>$e(e,{[` .pe-shadow__${n}`]:{boxShadow:t[`shadow_${n}_depth_${o}`]}}),Me=(e,t,o)=>[Ne(e,t,o,"top"),Ne(e,t,o,"bottom")],Ie=(e,t)=>void 0!==t.shadow_depth?Me(e,t,t.shadow_depth):null,We={shadow_depth:Ie};var He=Ae({varFns:Object.assign({},{general_styles:(e,t)=>[$e(e,[ce(),Me(e,t,1),{borderRadius:"inherit",pointerEvents:"none"," .pe-shadow__bottom, .pe-shadow__top":[ce(),{borderRadius:"inherit"}]}])],transition:(e,t)=>[$e(e,{".pe-shadow--animated":{" .pe-shadow__bottom, .pe-shadow__top":{transition:t.transition}}})],shadow_depth:Ie},[0,1,2,3,4,5].reduce((e,t)=>(e[`shadow_top_depth_${t}`]=Le("top",t),e[`shadow_bottom_depth_${t}`]=Le("bottom",t),e),{}))});const Ze={shadow_top_depth_0:"none",shadow_bottom_depth_0:"none",shadow_top_depth_1:"none",shadow_bottom_depth_1:"0 1px 4px 0 rgba(0, 0, 0, 0.37)",shadow_top_depth_2:"0 2px 2px 0 rgba(0, 0, 0, 0.2)",shadow_bottom_depth_2:"0 6px 10px 0 rgba(0, 0, 0, 0.3)",shadow_top_depth_3:"0 11px 7px 0 rgba(0, 0, 0, 0.19)",shadow_bottom_depth_3:"0 13px 25px 0 rgba(0, 0, 0, 0.3)",shadow_top_depth_4:"0 14px 12px 0 rgba(0, 0, 0, 0.17)",shadow_bottom_depth_4:"0 20px 40px 0 rgba(0, 0, 0, 0.3)",shadow_top_depth_5:"0 17px 17px 0 rgba(0, 0, 0, 0.15)",shadow_bottom_depth_5:"0 27px 55px 0 rgba(0, 0, 0, 0.3)",shadow_depth:void 0};var Be=Object.assign({},{general_styles:!0,transition:`box-shadow ${i} ease-out`},Ze);Se({selectors:[".pe-shadow"],fns:[He],vars:Be});var Qe={component:"pe-text-button",super:"pe-button",row:"pe-button-row",content:"pe-button__content",label:"pe-button__label",textLabel:"pe-button__text-label",wash:"pe-button__wash",dropdown:"pe-button__dropdown",border:"pe-button--border",contained:"pe-button--contained",disabled:"pe-button--disabled",dropdownClosed:"pe-button--dropdown-closed",dropdownOpen:"pe-button--dropdown-open",extraWide:"pe-button--extra-wide",hasDropdown:"pe-button--dropdown",highLabel:"pe-button--high-label",inactive:"pe-button--inactive",raised:"pe-button--raised",selected:"pe-button--selected",separatorAtStart:"pe-button--separator-start"};var Je=Ae({varFns:{general_styles:e=>[$e(e,{userSelect:"none","-moz-user-select":"none",outline:"none",padding:0,textDecoration:"none",textAlign:"center",cursor:"pointer",".pe-button--selected, &.pe-button--disabled, &.pe-button--inactive":{cursor:"default",pointerEvents:"none"}," .pe-button__content":{position:"relative",borderRadius:"inherit"}," .pe-button__label":[ue(),{position:"relative",display:"block",borderRadius:"inherit",pointerEvents:"none"}]," .pe-button__wash":[ce(),{zIndex:0,borderRadius:"inherit",pointerEvents:"none"}]}),{".pe-button-row":{fontSize:0,lineHeight:0}}],row_margin_h:(e,t)=>[{".pe-button-row":{margin:`0 -${t.row_margin_h}px`,[` ${e}`]:{margin:`0 ${t.row_margin_h}px`}}}]}});const De=(e,t,o)=>$e(e,{":not(.pe-button--disabled)":{" .pe-button__content":{borderColor:t["color_"+o+"_border"]}}}),qe={general_styles:()=>[]},Ke=e=>({["color_"+e+"_text"]:(t,o)=>[$e(t,{":not(.pe-button--disabled)":{"&, &:link, &:visited":{color:o["color_"+e+"_text"]}}})],["color_"+e+"_disabled_text"]:(t,o)=>[$e(t,{".pe-button--disabled":{color:o["color_"+e+"_disabled_text"]}})],["color_"+e+"_background"]:(t,o)=>[$e(t,{":not(.pe-button--disabled):not(.pe-button--selected)":{" .pe-button__content":{backgroundColor:o["color_"+e+"_background"]}}})],["color_"+e+"_active_background"]:(t,o)=>[$e(t,{":not(.pe-button--disabled)":{".pe-button--selected":{" .pe-button__content":{backgroundColor:o["color_"+e+"_active_background"]}}}})],["color_"+e+"_disabled_background"]:(t,o)=>[$e(t,{".pe-button--disabled":{" .pe-button__content":{backgroundColor:o["color_"+e+"_disabled_background"]}}})],["color_"+e+"_border"]:(t,o)=>[De(`${t}.pe-button--border`,o,e)],border:(t,o)=>[De(t,o,e)],["color_"+e+"_active_border"]:(t,o)=>[$e(t,{".pe-button--border.pe-button--selected":{" .pe-button__content":{borderColor:o["color_"+e+"_active_border"]}}})],["color_"+e+"_disabled_border"]:(t,o)=>[$e(t,{".pe-button--border.pe-button--disabled":{" .pe-button__content":{borderColor:o["color_"+e+"_disabled_border"]}}})],["color_"+e+"_icon"]:(t,o)=>[$e(t,{" .pe-button__dropdown":{color:o["color_"+e+"_icon"]}})],["color_"+e+"_separator"]:(t,o)=>[$e(t,{".pe-button--separator-start":{" .pe-button__content":{borderColor:o["color_"+e+"_separator"]}}})]}),Ue=e=>({["color_"+e+"_hover"]:(t,o)=>[$e(t,{":not(.pe-button--disabled):not(.pe-button--selected)":{color:o["color_"+e+"_hover"]}})],["color_"+e+"_hover_border"]:(t,o)=>[$e(t,{":not(.pe-button--disabled):not(.pe-button--selected)":{" .pe-button__content":{borderColor:o["color_"+e+"_hover_border"]}}})],["color_"+e+"_wash_background"]:(t,o)=>[$e(t,{":not(.pe-button--disabled):not(.pe-button--selected)":{" .pe-button__wash":{backgroundColor:o["color_"+e+"_wash_background"]}}})],["color_"+e+"_hover_background"]:(t,o)=>[$e(t,{":not(.pe-button--disabled):not(.pe-button--selected)":{" .pe-button__content":{backgroundColor:o["color_"+e+"_hover_background"]}}})],["color_"+e+"_hover_icon"]:(t,o)=>[$e(t,{" .pe-button__dropdown":{color:o["color_"+e+"_hover_icon"]}})]});var Ge=Pe({varFns:{lightTintFns:Object.assign({},qe,Ke("light")),darkTintFns:Object.assign({},qe,Ke("dark")),lightTintHoverFns:Ue("light"),darkTintHoverFns:Ue("dark")}});const Xe=e=>()=>({".pe-button--separator-start .pe-button__content":{borderStyle:e?"none solid none none":"none none none solid"}}),Ye=Xe(!1),et=Xe(!0),tt=(e,t)=>$e(e,{" .pe-button__dropdown":{minHeight:`calc((1em * ${t.line_height}) + 2 * ${t.label_padding_v}px)`}}),ot=(e,t)=>$e(e,{".pe-button--high-label":{padding:0," .pe-button__label":{padding:t.outer_padding_v+t.label_padding_v+"px 0"}}}),nt=(e,t)=>$e(e,{".pe-button--high-label":{" .pe-button__label, .pe-button__dropdown":{minHeight:`calc((1em * ${t.line_height}) + 2 * ${t.outer_padding_v+t.label_padding_v}px)`}}}),rt=(e,t,o)=>$e(e,{" .pe-button__content":{borderRadius:t.border_radius+"px"},":not(:first-child)":{" .pe-button__content":{[o?"borderTopRightRadius":"borderTopLeftRadius"]:0,[o?"borderBottomRightRadius":"borderBottomLeftRadius"]:0}},":not(:last-child)":{" .pe-button__content":{[o?"borderTopLeftRadius":"borderTopRightRadius"]:0,[o?"borderBottomLeftRadius":"borderBottomRightRadius"]:0}}}),it=(e,t)=>$e(e,{" .pe-button__wash, .pe-ripple":ce(-1)," .pe-button__content":{borderStyle:"solid",paddingLeft:t.padding_h_border+"px",paddingRight:t.padding_h_border+"px"}}),at=(e,t)=>$e(e,{" .pe-button__content":{borderWidth:t.border_width+"px"}," .pe-button-group & + &":{marginLeft:-t.border_width+"px"}});var lt=Ae({varFns:{general_styles:(e,t)=>[$e(e,[Ye(),{display:"inline-block",background:"transparent",border:"none"," .pe-button__content":{position:"relative",borderWidth:"1px",display:"flex",alignItems:"center",justifyContent:"center"},".pe-button--border":it(e,t)," .pe-button__label, .pe-button__dropdown":{whiteSpace:"pre",userSelect:"none","-moz-user-select":"none"}," .pe-button__text-label":{display:"inline-block",lineHeight:1},".pe-button--dropdown":{minWidth:"0"," .pe-button__dropdown":{position:"relative"}," .pe-svg":{position:"absolute",left:0,top:"50%"}," .pe-button__label + .pe-button__dropdown":{marginLeft:"6px",minWidth:0}}," .pe-button-group &":{minWidth:0}," .pe-button__dropdown .pe-svg":pe("transform"),".pe-button--dropdown-open":{" .pe-button__dropdown .pe-svg":{transform:"rotate(-180deg)"}}}]),[$e(Re(e),et())]],border_radius:(e,t)=>[$e(e,{" .pe-button__content":{borderRadius:t.border_radius+"px"}}),rt(`.pe-button-group ${e}`,t,!1),rt(Re(`.pe-button-group ${e}`),t,!0)],border_width:(e,t)=>[at(e,t)],min_width:(e,t)=>[$e(e,{minWidth:t.min_width+"px"})],animation_duration:(e,t)=>[$e(e,{" .pe-button__content, .pe-button__wash":[pe("all",t.animation_duration)]})],padding_h:(e,t)=>[$e(e,{" .pe-button__content":{padding:"0 "+t.padding_h+"px"," .pe-button__dropdown":{minWidth:`calc(36px - 2 * ${t.padding_h}px)`},".pe-button--dropdown":{" .pe-button__label + .pe-button__dropdown":{marginRight:`calc(7px - ${t.padding_h}px)`}}}})],padding_h_extra_wide:(e,t)=>[$e(e,{".pe-button--extra-wide .pe-button__content":{padding:"0 "+t.padding_h_extra_wide+"px"}})],label_padding_v:(e,t)=>[$e(e,{" .pe-button__label":{padding:t.label_padding_v+"px 0"},".pe-button--border":{" .pe-button__label":{padding:t.label_padding_v-1+"px 0"}}}),tt(e,t),ot(e,t),nt(e,t)],font_weight:(e,t)=>[$e(e,{" .pe-button__label":{fontWeight:t.font_weight}})],text_transform:(e,t)=>[$e(e,{" .pe-button__label":{textTransform:t.text_transform}})],font_size:(e,t)=>[$e(e,{" .pe-button__label, .pe-button__dropdown":{fontSize:t.font_size+"px"}})],line_height:(e,t)=>[$e(e,{" .pe-button__label, .pe-button__dropdown":{lineHeight:t.line_height}}),tt(e,t),nt(e,t)],dropdown_icon_size:(e,t)=>[$e(e,{".pe-button--dropdown":{" .pe-button__dropdown":{width:t.dropdown_icon_size+"px"}," .pe-svg":{width:t.dropdown_icon_size+"px",height:t.dropdown_icon_size+"px",marginTop:-t.dropdown_icon_size/2+"px"}}})],outer_padding_v:(e,t)=>[$e(e,{padding:t.outer_padding_v+"px 0",".pe-button--high-label":{padding:0}}),ot(e,t),nt(e,t)],separator_width:(e,t)=>[$e(e,{".pe-button--separator-start":{" .pe-button__content":{borderWidth:t.separator_width+"px"}}})],letter_spacing:(e,t)=>[$e(e,{letterSpacing:t.letter_spacing+"px"})],border:(e,t)=>t.border&&it(e,t),contained:(e,t)=>t.contained&&((e,t)=>$e(e,{" .pe-button__content":{paddingLeft:t.padding_h+"px",paddingRight:t.padding_h+"px"}," .pe-button__wash":{display:"none"}}))(e,t),...We}});const st=Object.assign({},{border:!1,contained:!0},Ze);var dt=Object.assign({},{general_styles:!0,padding_h:4*t,color_light_background:"#fff",color_light_disabled_background:Ce(c,w),color_light_wash_background:"transparent",color_dark_active_background:Ce(p),color_dark_background:Ce(d),color_dark_disabled_background:Ce(u,R),color_dark_wash_background:"transparent"},st);const pt=r,ct=Object.assign({},{border:!1,contained:!1},Ze),ut={border_width:1,padding_h_border:dt.padding_h,color_light_border:Ce(c,x),color_light_disabled_border:Ce(c,_),color_dark_border:Ce(u,S),color_dark_disabled_border:Ce(u,k)};var ft=Object.assign({},{general_styles:!0,animation_duration:i,border_radius:n,dropdown_icon_size:24,font_size:14,font_weight:500,label_padding_v:11,letter_spacing:.75,line_height:1,min_width:8*o,outer_padding_v:(pt-36)/2,padding_h:2*t,padding_h_extra_wide:6*t,row_margin_h:t,separator_width:1,text_transform:"uppercase",color_light_background:"transparent",color_light_text:Ce(c,f),color_light_wash_background:Ce(c,m),color_light_active_background:Ce(c,g),color_light_disabled_background:"transparent",color_light_disabled_text:Ce(c,_),color_light_icon:Ce(c,b),color_light_separator:Ce(c,h),color_dark_background:"transparent",color_dark_text:Ce(u,v),color_dark_wash_background:Ce(u,$),color_dark_active_background:Ce(u,j),color_dark_disabled_background:"transparent",color_dark_disabled_text:Ce(u,k),color_dark_icon:Ce(u,y),color_dark_separator:Ce(u,z)},ut,ct);const bt=[lt,Ge],_t=[Je],xt=`.${Qe.super}`,ht=`.${Qe.component}`;Se({selectors:[xt],fns:_t,vars:ft}),Se({selectors:[ht],fns:bt,vars:ft});var gt=Pe({superColor:Ge});const mt=[Ae({superLayout:lt}),gt],wt=`.${[Qe.component,Qe.contained].join(" ").split(/\s/).join(".")}`,vt=ze(wt,mt,dt);Se({selectors:[wt],fns:mt,vars:dt});const yt=ft,kt=Ge,St=lt;var zt=Object.freeze({addStyle:(e,t,{mediaQuery:o}={})=>{((e,t,{mediaQuery:o}={})=>{const n=t&&t.contained?dt:ft;e&&Se({selectors:[xt,e],fns:_t,vars:n,customVars:t,mediaQuery:o}),e&&Se({selectors:[ht,e],fns:bt,vars:n,customVars:t,mediaQuery:o})})(e,t,{mediaQuery:o})},getStyle:(e="",t,{mediaQuery:o}={})=>((e="",t,{mediaQuery:o}={})=>{const n=t&&t.contained?dt:ft;return je({selectors:[xt,e],fns:_t,vars:n,customVars:t,mediaQuery:o}).concat(je({selectors:[ht,e],fns:bt,vars:n,customVars:t,mediaQuery:o}))})(e,t,{mediaQuery:o}).concat(vt(e,t,{mediaQuery:o})),textButtonColor:kt,textButtonLayout:St,textButtonVars:yt});const jt="undefined"!=typeof document,$t=!jt,Rt=!$t&&"ontouchstart"in document.documentElement,Ct=Rt?["click","mouseup"]:["mouseup"];jt&&document.querySelector("html").classList.add(Rt?"pe-touch":"pe-no-touch");const Ft={},At=(e,t)=>{Ft[e]&&Ft[e].forEach(e=>e(t))};jt&&(window.addEventListener("resize",e=>At("resize",e)),window.addEventListener("scroll",e=>At("scroll",e)),window.addEventListener("keydown",e=>At("keydown",e)),window.addEventListener(Ct,e=>At(Ct,e)));$t||(()=>window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||(e=>window.setTimeout(e,1e3/60)))();const Et=[()=>[{"html, body, button, input, select, textarea":{fontFamily:"Roboto, Helvetica, Arial, sans-serif"}}],()=>[{" html":{"box-sizing":"border-box"}," *, *:before, *:after":{"box-sizing":"inherit"}," *":[{"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},{"-webkit-tap-highlight-color":"transparent"}]," a, a:active, a:focus, input:active, *:focus":{outline:0}," input:disabled":{opacity:1}}],()=>[{" h1, h2, h3, h4, h5, h6, p":{margin:0,padding:0}},{" h1, h2, h3, h4, h5, h6":{" small":{"font-weight":a,"line-height":s,"letter-spacing":"-0.02em","font-size":"0.6em"}}},{" h1":{"font-size":"56px","font-weight":a,"line-height":s,"margin-top":"24px","margin-bottom":"24px"}},{" h2":{"font-size":"45px","font-weight":a,"line-height":s,"margin-top":"24px","margin-bottom":"24px"}},{" h3":{"font-size":"34px","font-weight":a,"line-height":s,"margin-top":"24px","margin-bottom":"24px"}},{" h4":{"font-size":"24px","font-weight":a,"line-height":s,"-moz-osx-font-smoothing":"grayscale","margin-top":"24px","margin-bottom":"16px"}},{" h5":{"font-size":"20px","font-weight":l,"line-height":s,"letter-spacing":"-0.02em","margin-top":"24px","margin-bottom":"16px"}},{" h6":{"font-size":"16px","font-weight":a,"line-height":s,"letter-spacing":"0.04em","margin-top":"24px","margin-bottom":"16px"}},{" html, body":{"font-size":"14px","line-height":s,"font-weight":a}," p":{"font-size":"14px","font-weight":a,"line-height":s,"letter-spacing":"0","margin-bottom":"16px"}," blockquote":{position:"relative","font-size":"24px","font-weight":a,"font-style":"italic","line-height":s,"letter-spacing":"0.08em","margin-top":"24px","margin-bottom":"16px"}," ul, ol":{"font-size":"14px","font-weight":a,"line-height":s,"letter-spacing":0}," b, strong":{"font-weight":l}}]],Ot=()=>{((e,t)=>{if($t)return;if(!window.WebFontConfig){const o=({name:o,familyName:n,fvd:r})=>At("webfontloader",{name:o,familyName:n,fvd:r,vendor:e,config:t});window.WebFontConfig={loading:()=>o({name:"loading"}),active:()=>o({name:"active"}),inactive:()=>o({name:"inactive"}),fontloading:(e,t)=>o({name:"fontloading",familyName:e,fvd:t}),fontactive:(e,t)=>o({name:"fontactive",familyName:e,fvd:t}),fontinactive:(e,t)=>o({name:"fontinactive",familyName:e,fvd:t})},function(){const e=document.createElement("script");e.src=("https:"===document.location.protocol?"https":"http")+"://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js",e.type="text/javascript",e.async="true";const t=document.getElementsByTagName("script")[0];t&&t.parentNode.insertBefore(e,t)}()}const o=window.WebFontConfig[e]||{};t&&Object.assign(o,t),window.WebFontConfig[e]=o})("google",{families:["Roboto:400,500,700,400italic:latin"]})},Pt=zt;return e.ButtonCSS=zt,e.RaisedButtonCSS=Pt,e.addTypography=(()=>{Ot(),ke("pe-material-design-typography",Et.map(e=>e()))}),e.addRoboto=Ot,e.addLayoutStyles=(()=>ke("pe-layout",Te,Ve)),e}({});
//# sourceMappingURL=polythene-css-standalone.js.map
