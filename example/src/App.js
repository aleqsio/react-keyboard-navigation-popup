import React, { useState } from "react";
import { Fragment } from "react";

import { ShortcutPopup } from "react-keyboard-navigation-popup";
import actions from "./actions";

export default () => {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  const [action, setAction] = useState("");
  const run = console.log;
  console.log = item => {
    run(item);
    if(typeof item==="string"){
    setAction(item);

    }
  };

  return (
    <Fragment>
      Press <div className="keyCombinationIndicator">{isMac ? "⌘ + k" : "ctrl + k"}</div> to
      open keyboard navigation popup
      <b className="action">{action}</b>
      <ShortcutPopup actions={actions} />
    </Fragment>
  );
};
