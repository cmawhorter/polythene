!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("polythene-css-selection-control"),require("polythene-core-css")):"function"==typeof define&&define.amd?define(["exports","polythene-css-selection-control","polythene-core-css"],t):t(e.polythene={},e["polythene-css-selection-control"],e["polythene-core-css"])}(this,function(e,t,o){"use strict";var r=o.createColor({superColor:t.color}),s=o.createLayout({superLayout:t.layout}),l={general_styles:!0};const c=[s,r],n=".pe-checkbox-control",y=o.styler.createAddStyle(n,c,l),p=o.styler.createGetStyle(n,c,l);o.styler.addStyle({selectors:[n],fns:c,vars:l}),e.addStyle=y,e.color=r,e.getStyle=p,e.layout=s,e.vars=l,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=polythene-css-checkbox.js.map
