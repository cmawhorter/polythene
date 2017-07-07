import { rules as css } from "./styles";
import { renderer as h, Dialog, Notification, Snackbar, IconButton, Toolbar } from "polythene-react";
import { withRouter } from "react-router-dom";

const iconBack = h.trust("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z\"/></svg>");

const NavBar = (name, previous) =>
  h(css.headerRow, null,
    h(Toolbar,
      { style: { backgroundColor: "rgba(255,255,255,.93)" } },
      [
        previous && h(withRouter(({ history }) =>
          h(IconButton, {
            icon: { svg: iconBack },
            url: {
              href: "/",
              onClick: e => (e.preventDefault(), history.push(previous))
            },
            style: {
              color: "#0091EA"
            }
          })
        )),
        h("span", name)
      ]
    )
  );

const Results = (name, tests) => 
  h([css.results].join(" "),
    { className: `tests-${name.replace(/[^\w\d]/g, "-").toLowerCase()}` },
    tests.map((test, index) => {
      if (test.section) {
        return h(css.sectionTitle, test.section);
      }
      const testName = `test-${(test.name)}`;
      return h([css.resultRow, test.interactive ? css.interactive : null].join(""), {
        key: testName,
        className: [testName.replace(/[^\w\d]/g, "-").toLowerCase(), test.className || null].join(" "),
      },
        [
          h(css.resultTitle,
            { className: "result-title" },
            test.name
          ),
          h(css.resultData, null,
            h(css.resultDataRendered, null,
              h(css.content, null,
                h(test.component, test.attrs, test.children)
              )
            )
          )
        ]
      );
    })
  );

const Page = ({ name, tests, previous }) => (
  h("div", [
    NavBar(name, previous),
    Results(name, tests),
    h(Dialog),
    h(Snackbar),
    h(Notification)
  ])
);

export default Page;
