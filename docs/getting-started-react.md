# Getting started with Polythene for React


<!-- MarkdownTOC bracket="round" autolink="true" depth="3" -->

- [Usage in JavaScript modules](#usage-in-javascript-modules)
  - [Which packages do you need?](#which-packages-do-you-need)
  - [Installation](#installation)
  - [Examples](#examples)
    - [A single component](#a-single-component)
    - [A simple app](#a-simple-app)
- [Usage in a HTML file or JSFiddle](#usage-in-a-html-file-or-jsfiddle)

<!-- /MarkdownTOC -->


## Usage in JavaScript modules

Add Polythene to your project with yarn or npm.

### Which packages do you need?

Required:

* `polythene-react`

Recommended:

* `polythene-style` Material Design styles (typography and font) [more info](packages/polythene-style.md)

Optional:

* `polythene-utilities` Layout helper classes [more info](packages/polythene-utilities.md)
* `polythene-fastclick` Eliminating the 300ms delay on mobile [more info](packages/polythene-fastclick.md)
* `polythene-core-css` CSS tools [more info](packages/polythene-core-css.md)


### Installation

~~~bash
yarn add polythene-react polythene-style
~~~

or

~~~bash
npm install --save polythene-react polythene-style
~~~

### Examples

#### A single component

##### With JSX

~~~jsx
import React from "react"
import { RaisedButton } from "polythene-react"

<RaisedButton label="Click" />
~~~

##### With hyperscript

~~~javascript
import { renderer as h, RaisedButton } from "polythene-react"

h(RaisedButton, {
  label: "Click"
})
~~~


#### A simple app

##### With JSX

~~~jsx
import React from "react"
import ReactDOM from "react-dom"
import { renderer as h, RaisedButton, Dialog } from "polythene-react"
import { addTypography, addRoboto } from "polythene-style"

addTypography()
addRoboto()

const App = () => (
  <div>
    <RaisedButton
      label="Show dialog"
      events={{
        onClick: () => Dialog.show({
          /* note the Dialog component is below the other elements in the app */
          title: "Hello",
          body: "Click outside to close, or press ESCAPE",
          backdrop: true
        })
      }}
    />
    <Dialog />
  </div>
)

const mountNode = document.querySelector("#app")
ReactDOM.render(<App />, mountNode)
~~~


##### With hyperscript

~~~javascript
import ReactDOM from "react-dom"
import { renderer as h, RaisedButton, Dialog } from "polythene-react"
import { addTypography, addRoboto } from "polythene-style"

addTypography()
addRoboto()

const App = () => (
  h("div", [
    h(RaisedButton, {
      label: "Show dialog",
      events: {
        onClick: () => Dialog.show({
          /* note the Dialog component is below the other elements in the app */
          title: "Hello",
          body: "Click outside to close, or press ESCAPE",
          backdrop: true
        })
      }
    }),
    h(Dialog)
  ])
)

const mountNode = document.querySelector("#app")
ReactDOM.render(h(App), mountNode)
~~~


## Usage in a HTML file or JSFiddle

A "standalone" version of Polythene is available for demonstration purposes. This build includes all dependencies, except for `react` and `react-dom`.

URL:

~~~
https://rawgit.com/ArthurClemens/polythene/master/packages/polythene-react/dist/polythene-react-standalone.js
~~~

Add to your HTML file:

~~~html
<div id="root"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react-dom.js"></script>
<script src="https://rawgit.com/ArthurClemens/polythene/master/packages/polythene-react/dist/polythene-react-standalone.js"></script>
~~~

To be able to write es6, add `babel-standalone`:

~~~html
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.25.0/babel.min.js"></script>
~~~


Example script:

~~~jsx
/* global polythene */
const { RaisedButton } = polythene

const App = () => (
  <div>
    <RaisedButton
      label="Button"
    />
  </div>
)

ReactDOM.render(
  <App />,
  document.getElementById("root")
)
~~~


See: [Full working JSFiddle](https://jsfiddle.net/ArthurClemens/5db99xoj/)
