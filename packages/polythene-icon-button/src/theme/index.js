import { styler } from "polythene-css";
import { styles } from "polythene-theme";
import vars from "./vars";
import layout from "./layout";
import color from "./color";

const key = "icon-button";
const className = "pe-icon-button";

const styleComponent = (className, styles) =>
  styler.styleComponent(className, styles, key, vars, layout, color);

export const customTheme = (className, vars) =>
  // Inject additional styles as use the className as key
  styleComponent(className, styler.addComponentStyle(
    className, styles, key, vars
  ));

styleComponent(className, styles);
