
import { BaseSpinner } from "polythene-mithril-base-spinner";
import { _Spinner } from "polythene-core-material-design-spinner";
import classes from "polythene-css-classes/material-design-spinner";
import { cast, h, useState, useEffect } from "cyano-mithril";
import baseSpinnerClasses from "polythene-css-classes/base-spinner";
import { _Conditional } from "polythene-core";

const Spinner = cast(_Spinner, { h, BaseSpinner });
const SpinnerToggle = cast(_Conditional, { h, useState, useEffect });
SpinnerToggle["displayName"] = "MaterialDesignSpinnerToggle";

export const MaterialDesignSpinner = {
  view: vnode =>
    h(SpinnerToggle, {
      ...vnode.attrs,
      placeholderClassName: baseSpinnerClasses.placeholder,
      instance: Spinner
    })
};

MaterialDesignSpinner["classes"] = classes;
MaterialDesignSpinner["displayName"] = "MaterialDesignSpinner";
