// Changes made to fix 113436 => Project Property: Project level property should be available even if the no process is created in the project like Properties, settings, requirements, audit trail

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
import NoprocessesPerproject from "../NoProjectsOrProcesses/NoProcessPerProjectScreen.js";
import SortButton from "../../../../../UI/SortingModal/Modal.js";

function ProcessListByProjectSubTab(props) {
  let { t } = useTranslation();
  const [pinToTopPerProjectcheck, setPinnedCheck] = useState(true);
  const [selectionOne, setSelectionOne] = useState(0);
  const [selectionTwo, setSelectionTwo] = useState(0);
  const subTabLabels =
    props.tabValue === 0
      ? []
      : [
          `${t("processList.All")} (${props.processListLength[0]})`,
          <p className="flex" style={{ alignItems: "center" }}>
            <img src={DraftIcon} className="processDotsOnTab" />
            <span>
              {`${t("processList.Drafts")} (${props.processListLength[1]})`}
            </span>
          </p>,
          <p className="flex" style={{ alignItems: "center" }}>
            <img src={DeployedIcon} className="processDotsOnTab" />
            <span>
              {`${t("processList.Deployed")} (${props.processListLength[2]})`}
            </span>
          </p>,
          <p className="flex" style={{ alignItems: "center" }}>
            <img className="processDotsOnTab" src={DeployedPending} />
            <span>{t("processList.Deployed")}</span>
          </p>,
          <p className="flex" style={{ alignItems: "center" }}>
            <img className="processDotsOnTab" src={EnabledIcon} />
            <span>
              {`${t("processList.Enabled")} (${props.processListLength[4]})`}
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
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
          margin="0 0 15px 0"
          showTableHead={true}
          processesPerProject={props.pinnedProcessesPerProject}
        />

        <p className="tableHeading">{t("processList.otherProcesses")}</p>
        <ProcessListByProjectTable
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
          showTableHead={false}
          processesPerProject={props.allProcessesPerProject}
        />
      </div>
    ) : (
      <ProcessListByProjectTable
        selectionOne={selectionOne}
        selectionTwo={selectionTwo}
        maxHeightofTable="380px"
        showTableHead={true}
        processesPerProject={props.allProcessesPerProject}
      />
    ),
    pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
      <div className="subTabContentToScroll">
        <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
        <ProcessListByProjectTable
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
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
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
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
        selectionOne={selectionOne}
        selectionTwo={selectionTwo}
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
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
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
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
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
        selectionOne={selectionOne}
        selectionTwo={selectionTwo}
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
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
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
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
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
        selectionOne={selectionOne}
        selectionTwo={selectionTwo}
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
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
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
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
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
        selectionOne={selectionOne}
        selectionTwo={selectionTwo}
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
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
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
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
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
        selectionOne={selectionOne}
        selectionTwo={selectionTwo}
        maxHeightofTable="380px"
        showTableHead={true}
        processesPerProject={props.allProcessesPerProject?.filter((process) => {
          return process.ProcessType == "EP";
        })}
      />
    ),
  ];

  const sortSelectionFunc = (sortSelectionOne, sortSelectionTwo) => {
    setSelectionOne(sortSelectionOne);
    setSelectionTwo(sortSelectionTwo);
  };

  return props.allProcessesPerProject.length > 0 ? (
    <React.Fragment>
      <div
        className="filterBox"
        style={{
          justifyContent: "end",
          background: "#f6f6f6",
          padding: "0 1vw",
        }}
      >
        {/* <Checkbox onChange={()=>setPinnedCheck(!pinToTopPerProjectcheck)} checked={pinToTopPerProjectcheck} size= 'small' inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />{t('processList.ShowPinnedAtTop')} */}
        <SearchBox height="2.7rem" />
        <SortButton
          id="ProcessesTabByProject_sortProcess"
          backDrop={true}
          buttonToOpenModal={
            <div className="filterButton" type="button">
              <img src={FilterImage} style={{ width: "100%" }} />
            </div>
          }
          sortSelection={sortSelectionFunc}
          showTickIcon={true}
          modalFromTop="62"
          modalFromLeft="33"
          modalWidth="180"
          sortSectionTwo={[t("NewToOld"), t("OldToNew")]}
          sortOrderOptionsForName={[t("Ascending"), t("Descending")]}
          indexToSwitchSortOptions="2"
          sortBy={t("sortBy")}
          sortOrder={t("sortOrder")}
          sortSectionOne={[t("LastModifiedByMe"), t("LastModified"), t("Name")]}
          modalPaper="modalPaperProjects1"
          isArabic={false}
        />
      </div>
      <div className="projectTable">
        <Tab
          tabType="subTab"
          tabContentStyle="subTabContentStyle"
          tabBarStyle="subTabBarStyle"
          oneTabStyle="subOneTabStyle"
          TabNames={subTabLabels}
          TabElement={subTabElements}
        />
      </div>
    </React.Fragment>
  ) : (
    <NoprocessesPerproject />
  );
}

export default ProcessListByProjectSubTab;
