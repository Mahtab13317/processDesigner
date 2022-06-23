import React from "react";
import "./noProcessOrProjects.css";
import { useTranslation } from "react-i18next";
import CreateProcessButton from "../../../../../UI/Buttons/CreateProcessButton";
import emptyStatePic from "../../../../../assets/ProcessView/EmptyState.svg";
import { tileProcess } from "../../../../../utility/HomeProcessView/tileProcess.js";

function NoProjectScreen(props) {
  let { t } = useTranslation();
  return (
    <div className="noProjectsScreen" style={{ marginTop: "130px" }}>
      <img src={emptyStatePic} />
      <h2>
        {t("processList.No")} {tileProcess(props.selectedProcessCode)[1]}{" "}
        {t("processList.processesAreAvailable")}
      </h2>
      <p>
        {t("processList.youDontHaveAny")}{" "}
        {tileProcess(props.selectedProcessCode)[1]}{" "}
        {t("processList.noProcessCreatedOrShared")}{" "}
        <span>
          {t("processList.createAnewProcessToViewInProcesses")}{" "}
          {props.processType} {t("processList.processes")}.
        </span>
      </p>
    </div>
  );
}

export default NoProjectScreen;
