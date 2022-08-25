import React from "react";
import { useTranslation } from "react-i18next";
import "./noProcessOrProjects.css";
import CreateProcessButton from "../../../../../UI/Buttons/CreateProcessButton";
import emptyStatePic from "../../../../../assets/ProcessView/EmptyState.svg";

function NoProjectScreen(props) {
  let { t } = useTranslation();
  return (
    <div className="noProjectsScreen">
      <img src={emptyStatePic} />
      <h2>{t("projectList.NoProjectsToShow")}</h2>
      <p>{t("projectList.UseOfProjects")}</p>
      <CreateProcessButton
        buttonContent={t("CreateNewProject")}
        buttonStyle={{
          backgroundColor: "var(--button_color)",
          color: "white",
          minWidth: "10vw",
          margin: "var(--spacing_v) 0 !important",
        }}
      ></CreateProcessButton>
    </div>
  );
}

export default NoProjectScreen;
