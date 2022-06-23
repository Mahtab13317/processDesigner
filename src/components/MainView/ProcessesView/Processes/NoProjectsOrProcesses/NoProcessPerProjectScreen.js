import React from "react";
import CreateProcessButton from "../../../../../UI/Buttons/CreateProcessButton";
import emptyStatePic from "../../../../../assets/ProcessView/EmptyState.svg";
import "./noProcessOrProjects.css";
import { useTranslation } from "react-i18next";

function NoProcessPerProjectScreen(props) {
  let { t } = useTranslation();
  return (
    <div className="noProjectsScreen" style={{ marginTop: "130px" }}>
      <img src={emptyStatePic} />
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
