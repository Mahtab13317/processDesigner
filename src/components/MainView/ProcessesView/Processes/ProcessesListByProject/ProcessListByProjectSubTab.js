// Changes made to fix 113436 => Project Property: Project level property should be available even if the no process is created in the project like Properties, settings, requirements, audit trail
// Changes made to solve Bug 115456 -> Process Search: Searching not working for Processes listed under the projects
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
import SortingModal from "./sortByModal.js";
import Modal from "../../../../../UI/Modal/Modal";

function ProcessListByProjectSubTab(props) {
  let { t } = useTranslation();
  const [pinToTopPerProjectcheck, setPinnedCheck] = useState(true);
  const [selectionOne, setSelectionOne] = useState(2);
  const [selectionTwo, setSelectionTwo] = useState(0);
  let [searchTerm, setSearchTerm] = useState("");
  const [showSortingModal, setShowSortingModal] = useState(false);
  const subTabLabels =
    props.tabValue === 0
      ? []
      : [
          `${t("processList.All")} (${props.processListLength[0]})`,
          // <p className="flex" style={{ alignItems: "center" }}>
          //   <img src={DraftIcon} className="processDotsOnTab" />
          //   <span>
          //     {`${t("processList.Drafts")} (${props.processListLength[1]})`}
          //   </span>
          // </p>,
          <p className="flex" style={{ alignItems: "center" }}>
            <img src={DeployedIcon} className="processDotsOnTab" />
            <span>
              {`${t("processList.Deployed")} (${props.processListLength[2]})`}
            </span>
          </p>,
          // <p className="flex" style={{ alignItems: "center" }}>
          //   <img className="processDotsOnTab" src={DeployedPending} />
          //   <span>{t("processList.Deployed")}</span>
          // </p>,
          <p className="flex" style={{ alignItems: "center" }}>
            <img className="processDotsOnTab" src={EnabledIcon} />
            <span>
              {`${t("processList.Enabled")} (${props.processListLength[4]})`}
            </span>
          </p>,
          // <p className="flex" style={{ alignItems: "center" }}>
          //   <img className="processDotsOnTab" src={EnabledPending} />
          //   <span>{t("processList.Enabled")}</span>
          // </p>,
        ];

  const subTabElements = [
    pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
      <div className="subTabContentToScroll">
        <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
        <ProcessListByProjectTable
          searchTerm={searchTerm}
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
          searchTerm={searchTerm}
          processesPerProject={props.allProcessesPerProject}
        />
      </div>
    ) : (
      <ProcessListByProjectTable
        selectionOne={selectionOne}
        selectionTwo={selectionTwo}
        maxHeightofTable="380px"
        searchTerm={searchTerm}
        showTableHead={true}
        processesPerProject={props.allProcessesPerProject}
      />
    ),
    // pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
    //   <div className="subTabContentToScroll">
    //     <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
    //     <ProcessListByProjectTable
    //       selectionOne={selectionOne}
    //       selectionTwo={selectionTwo}
    //       margin="0 0 15px 0"
    //       showTableHead={true}
    //       searchTerm={searchTerm}
    //       processesPerProject={props.pinnedProcessesPerProject?.filter(
    //         (process) => {
    //           return process.ProcessType == "L";
    //         }
    //       )}
    //     />
    //     <p className="tableHeading">{t("processList.otherProcesses")}</p>
    //     <ProcessListByProjectTable
    //       selectionOne={selectionOne}
    //       selectionTwo={selectionTwo}
    //       showTableHead={false}
    //       searchTerm={searchTerm}
    //       processesPerProject={props.allProcessesPerProject?.filter(
    //         (process) => {
    //           return process.ProcessType == "L";
    //         }
    //       )}
    //     />
    //   </div>
    // ) : (
    //   <ProcessListByProjectTable
    //     selectionOne={selectionOne}
    //     selectionTwo={selectionTwo}
    //     maxHeightofTable="380px"
    //     showTableHead={true}
    //     searchTerm={searchTerm}
    //     processesPerProject={props.allProcessesPerProject?.filter((process) => {
    //       return process.ProcessType == "L";
    //     })}
    //   />
    // ),
    pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
      <div className="subTabContentToScroll">
        <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
        <ProcessListByProjectTable
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
          margin="0 0 15px 0"
          showTableHead={true}
          searchTerm={searchTerm}
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
          searchTerm={searchTerm}
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
        searchTerm={searchTerm}
        processesPerProject={props.allProcessesPerProject?.filter((process) => {
          return process.ProcessType == "R";
        })}
      />
    ),
    // pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
    //   <div className="subTabContentToScroll">
    //     <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
    //     <ProcessListByProjectTable
    //       selectionOne={selectionOne}
    //       selectionTwo={selectionTwo}
    //       margin="0 0 15px 0"
    //       showTableHead={true}
    //       searchTerm={searchTerm}
    //       processesPerProject={props.pinnedProcessesPerProject?.filter(
    //         (process) => {
    //           return process.ProcessType == "RP";
    //         }
    //       )}
    //     />
    //     <p className="tableHeading">{t("processList.otherProcesses")}</p>
    //     <ProcessListByProjectTable
    //       selectionOne={selectionOne}
    //       selectionTwo={selectionTwo}
    //       showTableHead={false}
    //       searchTerm={searchTerm}
    //       processesPerProject={props.allProcessesPerProject?.filter(
    //         (process) => {
    //           return process.ProcessType == "RP";
    //         }
    //       )}
    //     />
    //   </div>
    // ) : (
    //   <ProcessListByProjectTable
    //     selectionOne={selectionOne}
    //     selectionTwo={selectionTwo}
    //     maxHeightofTable="380px"
    //     showTableHead={true}
    //     searchTerm={searchTerm}
    //     processesPerProject={props.allProcessesPerProject?.filter((process) => {
    //       return process.ProcessType == "RP";
    //     })}
    //   />
    // ),
    pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
      <div className="subTabContentToScroll">
        <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
        <ProcessListByProjectTable
          selectionOne={selectionOne}
          selectionTwo={selectionTwo}
          margin="0 0 15px 0"
          searchTerm={searchTerm}
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
          searchTerm={searchTerm}
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
        searchTerm={searchTerm}
        processesPerProject={props.allProcessesPerProject?.filter((process) => {
          return process.ProcessType == "E";
        })}
      />
    ),
    // pinToTopPerProjectcheck && props.pinnedProcessesPerProject.length > 0 ? (
    //   <div className="subTabContentToScroll">
    //     <p className="tableHeading">{t("processList.pinnedProcesses")}</p>
    //     <ProcessListByProjectTable
    //       selectionOne={selectionOne}
    //       selectionTwo={selectionTwo}
    //       margin="0 0 15px 0"
    //       showTableHead={true}
    //       searchTerm={searchTerm}
    //       processesPerProject={props.pinnedProcessesPerProject?.filter(
    //         (process) => {
    //           return process.ProcessType == "EP";
    //         }
    //       )}
    //     />
    //     <p className="tableHeading">{t("processList.otherProcesses")}</p>
    //     <ProcessListByProjectTable
    //       selectionOne={selectionOne}
    //       selectionTwo={selectionTwo}
    //       showTableHead={false}
    //       searchTerm={searchTerm}
    //       processesPerProject={props.allProcessesPerProject?.filter(
    //         (process) => {
    //           return process.ProcessType == "EP";
    //         }
    //       )}
    //     />
    //   </div>
    // ) : (
    //   <ProcessListByProjectTable
    //     selectionOne={selectionOne}
    //     selectionTwo={selectionTwo}
    //     maxHeightofTable="380px"
    //     showTableHead={true}
    //     searchTerm={searchTerm}
    //     processesPerProject={props.allProcessesPerProject?.filter((process) => {
    //       return process.ProcessType == "EP";
    //     })}
    //   />
    // ),
  ];

  const clearSearchResult = () => {
    setSearchTerm("");
  };

  const GetSortingOptions = (selectedSortBy, selectedSortOrder) => {
    setSelectionOne(selectedSortBy);
    setSelectionTwo(selectedSortOrder);
  };

  return props?.allProcessesPerProject?.length > 0 ? (
    <React.Fragment>
      <div
        className="filterBox"
        style={{
          justifyContent: "end",
          background: "#f6f6f6",
          padding: "0 1vw",
          position: props.tabValue === 0 ? "unset" : "absolute",
          right: "0.5vw",
        }}
      >
        {/* <Checkbox onChange={()=>setPinnedCheck(!pinToTopPerProjectcheck)} checked={pinToTopPerProjectcheck} size= 'small' inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />{t('processList.ShowPinnedAtTop')} */}
        <SearchBox
          id="ProcessesTab_searchProcess"
          setSearchTerm={setSearchTerm}
          clearSearchResult={clearSearchResult}
          searchIconAlign="right"
          placeholder="Search"
          style={{
            width: "160px",
            minWidth: "200px",
            border: "1px solid #c8c6a7",
            backgroundColor: "white",
            color: "black",
            height: "2.7rem",
          }}
        />
        <div
          className="filterButton"
          type="button"
          onClick={() => setShowSortingModal(true)}
        >
          <img src={FilterImage} style={{ width: "100%" }} />
        </div>
      </div>
      {showSortingModal ? (
        <Modal
          show={showSortingModal}
          backDropStyle={{ backgroundColor: "transparent" }}
          style={{
            top: "31%",
            left: "84%",
            width: "200px",
            height: "195px",
            padding: "5px",
            zIndex: "1500",
            boxShadow: "0px 3px 6px #00000029",
            border: "1px solid #D6D6D6",
            borderRadius: "3px",
          }}
          modalClosed={() => setShowSortingModal(false)}
          children={<SortingModal getSortingOptions={GetSortingOptions} />}
        />
      ) : null}
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
