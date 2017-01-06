import m from "mithril";
import * as polythene from "polythene";
import { styles as blockStyles, blocks } from "../css-classes/block-styles";
import webfont from "webfontloader";
import { icon } from "polythene-icon";
import iconRocket from "mmsvg/templarian/msvg/rocket";

polythene.styler.add("polythene-css-classes", blockStyles);

// Testing the web font loader that we use to load Roboto
webfont.load({
  google: {
    families: ["PT Sans:400"]
  },
  typekit: {
    id: "patua-one",
    api: "//use.edgefonts.net"
  }
});

export const tests = [
  {
    name: "Button",
    component: polythene.button,
    attrs: {
      label: "Button",
      raised: true
    }
  },
  {
    name: "FAB",
    component: polythene.fab,
    attrs: {
      icon: {
        svg: {
          content: m.trust("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z\"/></svg>")
        }
      }
    }
  },
  {
    name: "Icon",
    component: polythene.icon,
    attrs: {
      svg: {
        content: m.trust("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z\"/></svg>")
      }
    }
  },
  {
    name: "Icon Button",
    component: polythene.iconButton,
    attrs: {
      icon: {
        svg: {
          content: m.trust("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z\"/></svg>")
        }
      }
    }
  },

  {
    name: "List Tile",
    component: polythene.listTile,
    attrs: {
      title: "Ancillary Justice",
      highSubtitle: "The body lay naked and facedown, a deathly gray, spatters of blood staining the snow around it. It was minus fifteen degrees Celsius and a storm had passed just hours before.",
      front: m(icon, {
        src: "http://arthurclemens.github.io/assets/polythene/examples/avatar-1.png",
        avatar: true,
        type: "large"
      }),
      secondary: {
        icon: {
          msvg: iconRocket,
          type: "medium"
        },
        url: {
          href: "/",
          oncreate: m.route.link
        }
      }
    }
  },

  {
    name: "Ripple",
    component: polythene.ripple,
    attrs: {}
  },
  {
    name: "Shadow",
    component: polythene.shadow,
    attrs: {}
  },
  {
    name: "SVG",
    component: polythene.svg,
    attrs: {
      content: m.trust("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z\"/></svg>")
    }
  },
  {
    name: "Web font loader (Google Fonts: PT Sans)",
    component: {
      view: () => m("p.pt-sans", {
      }, "The sky was cloudless and of a deep dark blue.")
    },
    attrs: {}
  },
  {
    name: "Web font loader (Adobe Edge Web Fonts: Patua One)",
    component: {
      view: () => m("p.patua-one", {
      }, "The sky was cloudless and of a deep dark blue.")
    },
    attrs: {}
  },
  {
    name: "CSS Classes: blocks should be aligned vertically",
    component: {
      view: () => m(".vertical-blocks",
        blocks
      )
    }
  },
  {
    name: "CSS Classes: blocks should be justified horizontally",
    component: {
      view: () => m(".layout.justified",
        blocks
      )
    }
  },
];
