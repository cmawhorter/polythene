!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.polythene={})}(this,function(e){"use strict";function t(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},i=function(e){return e.attrs.element||"div"},r=function(e,t,n){var i=t.state,r=t.attrs;if(r.onSelect){var a=void 0!==n?n:i.highlightIndex();if(a>-1){var l={event:e,index:a,dom:i.tiles[a].dom,attrs:i.tiles[a].attrs};r.onSelect(l)}}void 0!==n&&o({state:i,index:n})},o=function(e){var t=e.state,n=e.index,i=void 0===n||null===n?-1:n,r=t.highlightIndex();i!==r&&(-1===i?t.highlightIndex(-1):-1===r&&t.highlightIndex(i))},a=function(e){var t=e.state,n=e.attrs,i=e.newIndex,r=t.highlightIndex();document.activeElement.blur(),t.highlightIndex(-1),n.onHighlightExit&&n.onHighlightExit({index:i,dom:t.tiles[r].dom})},l=function(e,t){var n=e.attrs,i=t(void 0!==n.defaultHighlightIndex&&null!==n.defaultHighlightIndex?n.defaultHighlightIndex:-1);return{tiles:[],highlightIndex:i,registerTile:function(e){return function(t,n){return e.tiles[t]=n}},redrawOnUpdate:t.merge([i])}},s=function(e){var t=e.state;t.highlightIndex.map(function(e){t.tiles[e]&&t.tiles[e].dom.focus()})},d=function(e){var t=e.state,n=e.attrs;isNaN(n.highlightIndex)||o({state:t,index:n.highlightIndex})},h=function(e,i){var o=i.keys,l=e.state,s=e.attrs;return n({},t({},o.onkeydown,function(t){var n=l.highlightIndex();if("ArrowDown"===t.key||"ArrowRight"===t.key){t.preventDefault();var i=n+1;i>=l.tiles.length?a({state:l,attrs:s,newIndex:i}):l.tiles[i].dom.focus()}else if("ArrowUp"===t.key||"ArrowLeft"===t.key){t.preventDefault();var o=n-1;o<0?a({state:l,attrs:s,newIndex:o}):l.tiles[o].dom.focus()}else"Enter"===t.key?r(t,e):"Escape"===t.key&&a({state:l,attrs:s,newIndex:n})}))},g=function(e,i){var o=i.renderer,a=i.keys,l=i.List,s=i.ListTile,d=e.state,h=e.attrs,g=-1,u=h.tiles.map(function(i){i.header||g++;var l=g;return void 0!==i.tag?i:o(s,n({},h.all,i,!i.header&&{keyboardControl:!0,register:d.registerTile(d),setHighlightIndex:d.highlightIndex,index:g,defaultHighlight:d.highlightIndex()===l,events:n({},i.events,t({},a.onclick,function(t){return r(t,e,l)}))}))});return o(l,n({},h,{tiles:u}))},u=Object.freeze({getElement:i,getInitialState:l,onMount:s,onUpdate:d,createProps:h,createContent:g});e.coreKeyboardList=u,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-core-keyboard-list.js.map