import React from "react";
import Button from "@material-ui/core/Button";

function CreateProcessButton(props) {
  return (
    <Button
      variant="contained"
      onClick={props.onClick}
      style={props.buttonStyle}
      disableElevation
    >
      {props.buttonContent}
    </Button>
  );
}

export default CreateProcessButton;
