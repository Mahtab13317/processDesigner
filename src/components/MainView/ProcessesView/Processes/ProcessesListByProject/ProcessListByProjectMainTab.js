import React, { useEffect, useState } from "react";
import Tab from "../../../../../UI/Tab/Tab";
import { useTranslation } from "react-i18next";
import SubTab from "../../Processes/ProcessesListByProject/ProcessListByProjectSubTab";
import "../../Projects/projects.css";
import ProjectProperties from "./ProjectProperties";
import GlobalRequirementSections from "../../../../MainView/ProcessesView/Settings/GlobalRequirementSections/GlobalRequirementSectionsProjectLevel.js";
import { useSelector } from "react-redux";
import { UserRightsValue } from "../../../../../redux-store/slices/UserRightsSlice";
import { getMenuNameFlag } from "../../../../../utility/UserRightsFunctions";
import { userRightsMenuNames } from "../../../../../Constants/appConstants";

function ProcessListByProjectMainTab(props) {
  let { t } = useTranslation();
  const userRightsValue = useSelector(UserRightsValue);
  const [mainTabsArr, setMainTabsArr] = useState([]);

  // Boolean that decides whether audit trail tab will be visible or not.
  const auditTrailRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.auditTrail
  );

  const arr = [
    // { label: t("processList.AUDIT_TRAIL"), component: <div>Drafts</div> },
    // { label: t("processList.PROJECT_SETTINGS"), component: "Deployed" },
    {
      label: t("properties"),
      component: (
        <ProjectProperties
          projectId={props.selectedProjectId}
          projectName={props.selectedProject}
        />
      ),
    },
    {
      label: t("processList.requirements"),
      component: (
        <GlobalRequirementSections
          selectedProjectId={props.selectedProjectId}
          selectedProcessCode={props.selectedProcessCode}
          calledFromProcessesTab={true}
        />
      ),
    },
  ];

  // Function that runs when the component loads.
  useEffect(() => {
    let tempArr = [...arr];
    if (!auditTrailRightsFlag) {
      let auditTrailIndex;
      tempArr.forEach((element, index) => {
        if (element.label === t("processList.AUDIT_TRAIL")) {
          auditTrailIndex = index;
        }
      });
      tempArr.splice(auditTrailIndex, 1);
    }
    setMainTabsArr(tempArr);
  }, []);

  // Function that returns the elements based on type.
  const getElementsByType = (list, type) => {
    let tempList = [];
    list?.forEach((element) => {
      if (type === "labels") {
        tempList.push(element.label);
      } else if (type === "components") {
        tempList.push(element.component);
      }
    });
    return tempList;
  };

  return (
    <div>
      <Tab
        tabType="mainTab"
        tabContentStyle="mainTabContentStyle"
        tabBarStyle="mainTabBarStyle"
        oneTabStyle="mainOneTabStyle"
        TabNames={[
          t("processList.PROCESSES"),
          ...getElementsByType(mainTabsArr, "labels"),
        ]}
        TabElement={[
          <SubTab
            tabValue={props.tabValue}
            allProcessesPerProject={props.allProcessesPerProject}
            pinnedProcessesPerProject={props.pinnedProcessesPerProject}
            processListLength={props.processListLength}
          />,
          ...getElementsByType(mainTabsArr, "components"),
        ]}
      />
    </div>
  );
}

export default ProcessListByProjectMainTab;
