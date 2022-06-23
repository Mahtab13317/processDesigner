import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./ProjectReport.css";
import Tabs from "../../../../UI/Tab/Tab.js";
import GenrateReport from "./GenrateReport";
import ArchiveReport from "./ArchivedReport";
import arabicStyles from "./ArabicStyles.module.css";
import { RTL_DIRECTION } from "../../../../Constants/appConstants";

function ProjectReport(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;

  return (
    <div>
      <p
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.processReport
            : "processReport"
        }
      >
        {t("processReport")}
      </p>
      <p className="hrLineProjectCreation" />

      <Tabs
        tabType="processSubTab"
        tabContentStyle="processSubTabContentStyle"
        tabBarStyle="processSubTabBarStyle"
        oneTabStyle="processSubOneTabStyle"
        tabStyling="processViewTabs"
        tabsStyle="processViewSubTabs"
        TabNames={[t("genrateReport"), t("archivedReport")]}
        TabElement={[
          <GenrateReport
            setShowModal={props.setshowProcessReport}
            openProcessType={props.openProcessType}
          />,
          <ArchiveReport setShowModal={props.setshowProcessReport} />,
        ]}
      />
    </div>
  );
}

export default ProjectReport;
