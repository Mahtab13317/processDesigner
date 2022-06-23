import React, { useState } from "react";

function FormsOtherProcesses() {
  const getFormId = (data) => {
    console.log("vvvvvvvvvvvvvvvv", data);
  };
  React.useEffect(() => {
    if (document.getElementById("mf_formsOtherProcesses")) {
      window.addEventListener("load", window.loadForm_INT_DES(getFormId), true);
    }
    return () => {
      window.removeEventListener(
        "load",
        window.loadForm_INT_DES(getFormId),
        true
      );
    };
  }, [document.getElementById("mf_formsOtherProcesses")]);
  return (
    <div style={{ width: "100%", height: "100%", paddingTop: "0.6rem" }}>
      <div id="mf_formsOtherProcesses"></div>
    </div>
  );
}

export default FormsOtherProcesses;
