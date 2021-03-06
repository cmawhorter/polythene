import { Component } from "react";
import { Options, show, hide } from "polythene-core-dialog";

interface Dialog extends Options{}
declare namespace Dialog {}

declare class Dialog extends Component<Options> {
  static show: show;
  static hide: hide;
}

export { Dialog };
export as namespace Dialog;

declare namespace DialogInstance {}
declare class DialogInstance extends Component<Options> {}

export { DialogInstance };
export as namespace DialogInstance;
