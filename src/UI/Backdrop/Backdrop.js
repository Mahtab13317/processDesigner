import React from "react";

import "./Backdrop.css";

const backdrop = (props) =>
  props.show ? (
    <div
      className="Backdrop"
      onClick={props.clicked}
      style={{ ...props.style }}
    ></div>
  ) : null;

export default backdrop;
