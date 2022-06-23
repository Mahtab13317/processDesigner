import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import "./index.css";

function Alert(props) {
  return <MuiAlert elevation={6} {...props} />;
}

export default function Toast(props) {
  const { closeToast, open, severity, message, className } = props;
  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    closeToast();
  };

  return (
    <Snackbar
      anchorOrigin={
        severity === "error" || severity === "warning"
          ? { vertical: "top", horizontal: "center" }
          : { vertical: "bottom", horizontal: "left" }
      }
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      className={className}
    >
      <Alert
        iconMapping={{
          success: <CheckCircleIcon />,
          error: <ErrorIcon />,
          warning: <ErrorIcon />,
          info: <InfoIcon />,
        }}
        onClose={handleClose}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
