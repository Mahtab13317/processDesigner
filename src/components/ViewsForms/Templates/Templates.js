import axios from "axios";
import React from "react";
import { store, useGlobalState } from "state-pool";
import { BASE_URL } from "../../../Constants/appConstants";

function Templates({ settemplateData }) {
  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked

  const [localLoadedProcessData] = useGlobalState(loadedProcessData);

  const getTemplateData = async (data) => {
    console.log("ddddddddddddd", data);
    // setTemplateData(data);
  };

  const setTemplateData = (data) => {
    settemplateData(data?.templateData);
  };

  React.useEffect(() => {
    if (document.getElementById("mf_forms_int_des")) {
      window.addEventListener(
        "load",
        window.loadFormTemplates(getTemplateData),
        true
      );
    }
    return () => {
      window.removeEventListener(
        "load",
        window.loadFormTemplates(getTemplateData),
        true
      );
    };
  }, [document.getElementById("mf_forms_int_des")]);

  return (
    <div style={{ width: "100%", height: "75%", paddingTop: "0.6rem" }}>
      <div style={{ height: "inherit" }} id="mf_forms_int_des"></div>
    </div>
  );
}

export default Templates;
