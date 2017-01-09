import { styler } from "polythene-css";

const style = (componentVars, scope, selector, tint) => {
  return [{
    [scope + selector]: {
      "background-color": componentVars["color_" + tint + "_background"],
      color: componentVars["color_" + tint + "_text"],

      " .pe-button__content": {
        "background-color": "transparent"
      }
    }
  }];
};

const createStyles = (componentVars, className = "") => {
  const selector = `${className}.pe-button--fab`;
  return [
    style(componentVars, "",                selector, "light"),
    style(componentVars, ".pe-dark-theme ", selector, "dark" ) // inside dark theme
  ];
};

export default componentVars => styler.createStyles(componentVars, createStyles);
