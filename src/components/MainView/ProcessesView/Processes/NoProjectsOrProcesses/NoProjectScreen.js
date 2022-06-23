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
          marginRight: "10px",
          backgroundColor: "#0072C6",
          width: "142px",
          height: "28px",
          fontSize: "12px",
          padding: "5px",
          textTransform: "none",
          color: "white",
        }}
      ></CreateProcessButton>
    </div>
  );
}

export default NoProjectScreen;
