import React from "react";
import Tab from "../../../../../UI/Tab/Tab";
import { useTranslation } from "react-i18next";
import SubTab from "../../Processes/ProcessesListByProject/ProcessListByProjectSubTab";
import "../../Projects/projects.css";
import ProjectProperties from "./ProjectProperties";
import GlobalRequirementSections from "../../../../MainView/ProcessesView/Settings/GlobalRequirementSections/GlobalRequirementSectionsProjectLevel.js";

function ProcessListByProjectMainTab(props) {
  let { t } = useTranslation();
  const mainTabElements = [
    <SubTab
      tabValue={props.tabValue}
      allProcessesPerProject={props.allProcessesPerProject}
      pinnedProcessesPerProject={props.pinnedProcessesPerProject}
      processListLength={props.processListLength}
    />,
    "Drafts",
    "Deployed",
    <ProjectProperties
      projectId={props.selectedProjectId}
      projectName={props.selectedProject}
    />,
    <GlobalRequirementSections selectedProjectId={props.selectedProjectId} selectedProcessCode={props.selectedProcessCode}/>
  ];
  const mainTabLabels = [
    t("processList.PROCESSES"),
    t("processList.AUDIT_TRAIL"),
    t("processList.PROJECT_SETTINGS"),
    t("properties"),
    'REQUIREMENTS'
  ];

  return (
    <div>
      <Tab
        tabType="mainTab"
        tabContentStyle="mainTabContentStyle"
        tabBarStyle="mainTabBarStyle"
        oneTabStyle="mainOneTabStyle"
        TabNames={mainTabLabels}
        TabElement={mainTabElements}
      />
    </div>
  );
}

export default ProcessListByProjectMainTab;
