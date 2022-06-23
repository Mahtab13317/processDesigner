import React, { useState } from "react";
import Tab from "../../../../../UI/Tab/Tab";
import { useTranslation } from "react-i18next";
import Checkbox from "@material-ui/core/Checkbox";
import SearchBox from "../../../../../UI/Search Component/index";
import "../../Projects/projects.css";
import ProcessListByProjectTable from "./ProcessesListByProjectTable";
import makerChecker from "../../../../../assets/HomePage/makerChecker.svg";
import DraftIcon from "../../../../../assets/HomePage/HS_Draft.svg";
import DeployedIcon from "../../../../../assets/HomePage/HS_Deployed.svg";
import EnabledIcon from "../../../../../assets/HomePage/HS_Enabled.svg";
import FilterImage from "../../../../../assets/ProcessView/PT_Sorting.svg";
import DeployedPending from "../../../../../assets/HomePage/PT_Deployed waiting.svg";
import EnabledPending from "../../../../../assets/HomePage/PT_Enabled Waiting.svg";

function ProcessListByProjectSubTab(props) {
  let { t } = useTranslation();
  const [pinToTopPerProjectcheck, setPinnedCheck] = useState(true);
  const subTabLabels =
    props.tabValue === 0
      ? []
      : [
          `${t("processList.All")} (${props.processListLength[0]})`,
          <p className="flex" style={{ alignItems: "center" }}>
            <img src={DraftIcon} className="processDotsOnTab" />
            <span>
              {t("processList.Drafts")} {props.processListLength[1]}
            </span>
          </p>,
          <p className="flex" style={{ alignItems: "center" }}>
            <img src={DeployedIcon} className="processDotsOnTab" />
            <span>
              {t("processList.Deployed")} {props.processListLength[2]}
            </span>
          </p>,
          <p className="flex" style={{ alignItems: "center" }}>
            <img className="processDotsOnTab" src={DeployedPending} />
            <span>{t("processList.Deployed")}</span>
          </p>,
          <p className="flex" style={{ alignItems: "center" }}>
            <img className="processDotsOnTab" src={DeployedIcon} />
            <span>
              {t("processList.Enabled")} {props.processListLength[4]}
            </span>
          </p>,
          <p className="flex" style={{ alignItems: "center" }}>
            <img className="processDotsOnTab" src={EnabledPending} />
            <span>{t("processList.Enabled")}</span>
          </p>,
        ];

  const subTabElements = [
    pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
      <div className="subTabContentToScroll">
        <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
        <ProcessListByProjectTable
          margin="0 0 15px 0"
          showTableHead={true}
          processesPerProject={props.pinnedProcessesPerProject}
        />

        <p className="tableHeading">{t("processList.otherProcesses")}</p>
        <ProcessListByProjectTable
          showTableHead={false}
          processesPerProject={props.allProcessesPerProject}
        />
      </div>
    ) : (
      <ProcessListByProjectTable
        maxHeightofTable="380px"
        showTableHead={true}
        processesPerProject={props.allProcessesPerProject}
      />
    ),
    pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
      <div className="subTabContentToScroll">
        <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
        <ProcessListByProjectTable
          margin="0 0 15px 0"
          showTableHead={true}
          processesPerProject={props.pinnedProcessesPerProject?.filter(
            (process) => {
              return process.ProcessType == "L";
            }
          )}
        />
        <p className="tableHeading">{t("processList.otherProcesses")}</p>
        <ProcessListByProjectTable
          showTableHead={false}
          processesPerProject={props.allProcessesPerProject?.filter(
            (process) => {
              return process.ProcessType == "L";
            }
          )}
        />
      </div>
    ) : (
      <ProcessListByProjectTable
        maxHeightofTable="380px"
        showTableHead={true}
        processesPerProject={props.allProcessesPerProject?.filter((process) => {
          return process.ProcessType == "L";
        })}
      />
    ),
    pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
      <div className="subTabContentToScroll">
        <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
        <ProcessListByProjectTable
          margin="0 0 15px 0"
          showTableHead={true}
          processesPerProject={props.pinnedProcessesPerProject?.filter(
            (process) => {
              return process.ProcessType == "R";
            }
          )}
        />
        <p className="tableHeading">{t("processList.otherProcesses")}</p>
        <ProcessListByProjectTable
          showTableHead={false}
          processesPerProject={props.allProcessesPerProject?.filter(
            (process) => {
              return process.ProcessType == "R";
            }
          )}
        />
      </div>
    ) : (
      <ProcessListByProjectTable
        maxHeightofTable="380px"
        showTableHead={true}
        processesPerProject={props.allProcessesPerProject?.filter((process) => {
          return process.ProcessType == "R";
        })}
      />
    ),
    pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
      <div className="subTabContentToScroll">
        <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
        <ProcessListByProjectTable
          margin="0 0 15px 0"
          showTableHead={true}
          processesPerProject={props.pinnedProcessesPerProject?.filter(
            (process) => {
              return process.ProcessType == "RP";
            }
          )}
        />
        <p className="tableHeading">{t("processList.otherProcesses")}</p>
        <ProcessListByProjectTable
          showTableHead={false}
          processesPerProject={props.allProcessesPerProject?.filter(
            (process) => {
              return process.ProcessType == "RP";
            }
          )}
        />
      </div>
    ) : (
      <ProcessListByProjectTable
        maxHeightofTable="380px"
        showTableHead={true}
        processesPerProject={props.allProcessesPerProject?.filter((process) => {
          return process.ProcessType == "RP";
        })}
      />
    ),
    pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
      <div className="subTabContentToScroll">
        <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
        <ProcessListByProjectTable
          margin="0 0 15px 0"
          showTableHead={true}
          processesPerProject={props.pinnedProcessesPerProject?.filter(
            (process) => {
              return process.ProcessType == "E";
            }
          )}
        />
        <p className="tableHeading">{t("processList.otherProcesses")}</p>
        <ProcessListByProjectTable
          showTableHead={false}
          processesPerProject={props.allProcessesPerProject?.filter(
            (process) => {
              return process.ProcessType == "E";
            }
          )}
        />
      </div>
    ) : (
      <ProcessListByProjectTable
        maxHeightofTable="380px"
        showTableHead={true}
        processesPerProject={props.allProcessesPerProject?.filter((process) => {
          return process.ProcessType == "E";
        })}
      />
    ),
    pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
      <div className="subTabContentToScroll">
        <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
        <ProcessListByProjectTable
          margin="0 0 15px 0"
          showTableHead={true}
          processesPerProject={props.pinnedProcessesPerProject?.filter(
            (process) => {
              return process.ProcessType == "EP";
            }
          )}
        />
        <p className="tableHeading">{t("processList.otherProcesses")}</p>
        <ProcessListByProjectTable
          showTableHead={false}
          processesPerProject={props.allProcessesPerProject?.filter(
            (process) => {
              return process.ProcessType == "EP";
            }
          )}
        />
      </div>
    ) : (
      <ProcessListByProjectTable
        maxHeightofTable="380px"
        showTableHead={true}
        processesPerProject={props.allProcessesPerProject?.filter((process) => {
          return process.ProcessType == "EP";
        })}
      />
    ),
  ];

  return (
    <div className="projectTable">
      <Tab
        adjacentToTabElements={
          <div
            className="filterBox"
            style={{ position: "absolute", right: "25px", top: "5px" }}
          >
            {/* <Checkbox onChange={()=>setPinnedCheck(!pinToTopPerProjectcheck)} checked={pinToTopPerProjectcheck} size= 'small' inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />{t('processList.ShowPinnedAtTop')} */}
            <SearchBox height="23px" />
            <img src={FilterImage} className="filterButton" />
          </div>
        }
        tabType="subTab"
        tabContentStyle="subTabContentStyle"
        tabBarStyle="subTabBarStyle"
        oneTabStyle="subOneTabStyle"
        TabNames={subTabLabels}
        TabElement={subTabElements}
      />
    </div>
  );
}

export default ProcessListByProjectSubTab;
