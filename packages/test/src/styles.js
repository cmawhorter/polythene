/*
Theme style definitions using Tachyon.
Complete list of tags: http://tachyons.io/docs/table-of-styles/
*/

const bottomBorder = ".bb";
const blockPadding = ".pa3";
const resultHeight = ".minh8";

export const rules = {
  page: ".pa4.lh-title-m.mid-gray",
  pageTitle: "h1.ma0.normal.f3.pv3",
  headerRow: `.header-row${bottomBorder}${blockPadding}.fixed.bg-white.w-100.z-1`,
  interactive: ".interactive.bg-washed-blue",
  separator: "span.ph2.light-silver",
  tests: ".pt5",
  link: "a.link.underline-hover.blue",
  list: "ul.list.pa0",
  listItem: "li.mv1",
  results: ".results",
  resultRow: `.result-row.flex.flex-row-ns.flex-column${bottomBorder}${resultHeight}`,
  resultTitle: ".flex.flex-one.ma3",
  result: ".result.flex.flex-one.relative.ma3.minh4",
  content: ".component-result.relative.w-100.height-100px",
  rawResult: ".prewrap.flex.flex-one.relative.f6.ma3.light-silver.minh6"
};