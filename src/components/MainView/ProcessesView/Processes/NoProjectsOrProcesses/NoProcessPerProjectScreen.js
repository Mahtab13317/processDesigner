// Changes made to fix 113436 => Project Property: Project level property should be available even if the no process is created in the project like Properties, settings, requirements, audit trail

import React from "react";
import CreateProcessButton from "../../../../../UI/Buttons/CreateProcessButton";
import emptyStatePic from "../../../../../assets/ProcessView/EmptyState.svg";
import "./noProcessOrProjects.css";
import { useTranslation } from "react-i18next";

function NoProcessPerProjectScreen(props) {
  let { t } = useTranslation();
  return (
    <div
      className="noProjectsScreen"
      style={{ height: "75vh", marginTop: "15px" }}
    >
      <img src={emptyStatePic} style={{ marginTop: "75px" }} />
      <h2>{t("processList.noProcessesAreAvailable")}</h2>
      <p>
        {t("processList.noProcessesInSelectedProject")}
        <span>
          {t("processList.createNewProcess")} {props.selectedProjectName}{" "}
          {t("processList.toGetStarted")}
        </span>
      </p>
    </div>
  );
}

export default NoProcessPerProjectScreen;
