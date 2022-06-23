import React, { useState, useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import SearchProcess from "../../../../../UI/Search Component/index";
import { useTranslation } from "react-i18next";
import "../../Projects/projects.css";
import ProcessListByTypeTable from "./ProcessesListByTypeTable";
import SortButton from "../../../../../UI/SortingModal/Modal.js";
import { tileProcess } from "../../../../../utility/HomeProcessView/tileProcess.js";
import FilterImage from "../../../../../assets/ProcessView/PT_Sorting.svg";
import { connect } from "react-redux";

function ProcessListByType_TableNSearchNSortNFilter(props) {
  let { t } = useTranslation();
  const [pinToTopcheck, setPinToTopCheck] = useState(true);
  const [groupByProjectcheck, setGroupByProjectCheck] = useState(false);
  let [searchTerm, setSearchTerm] = useState("");
  let [selectionOne, setSelectionOne] = useState(0);
  let [selectionTwo, setSelectionTwo] = useState(0);
  
  let Pending =
    props.selectedProcessCode == ("RP" || "EP")
      ? tileProcess(props.selectedProcessCode)[2]
      : "";

  let sortSelectionFunc = (sortSelectionOne, sortSelectionTwo) => {
    setSelectionOne(sortSelectionOne);
    setSelectionTwo(sortSelectionTwo);
  };

  return (
    <div className="processName_Filters_Table">
      <div className="processName_Search_Filters">
        <p>
          {t("processList.All")}{" "}
          {props.selectedProcessCode
            ? tileProcess(props.selectedProcessCode)[1] + " " + Pending
            : ""}{" "}
          {props.selectedProcessCode ? "" : "Processes"} (
          {props.selectedProcessCount})
        </p>
        <div className="filterBox">
          <Checkbox
            onChange={() => setGroupByProjectCheck(!groupByProjectcheck)}
            checked={groupByProjectcheck}
            size="small"
            inputProps={{ "aria-label": "uncontrolled-checkbox" }}
          />
          {t("processList.GroupByProject")}
          {/* <Checkbox onChange={()=>setPinToTopCheck(!pinToTopcheck)} checked={pinToTopcheck} size= 'small' inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />{t('processList.ShowPinnedAtTop')} */}
          <SearchProcess
            id="ProcessesTab_searchProcess"
            setSearchTerm={setSearchTerm}
            searchIconAlign="right"
            placeholder="Search"
            style={{
              width: "160px",
              minWidth: "200px",
              border: "1px solid #c8c6a7",
              backgroundColor: "white",
              color: "black",
            }}
          />
          <SortButton
            id="ProcessesTab_sortProcess"
            backDrop={true}
            buttonToOpenModal={
              <button className="filterButton" type="button">
                <img src={FilterImage} />
              </button>
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
            sortSectionOne={[
              t("LastModifiedByMe"),
              t("LastModified"),
              t("Name"),
            ]}
            modalPaper="modalPaperProjects"
            isArabic={false}
          />
        </div>
      </div>

      {pinToTopcheck ? (
        <div className="pinnedAtTop_Table">
          <h4
            style={{
              fontWeight: "600",
              display:
                props.pinnedDataList?.filter((data) => {
                  return data.Type == props.selectedProcessCode;
                }).length > 0
                  ? ""
                  : "none",
            }}
          >
            {t("processList.pinnedProcesses")}
          </h4>
          <ProcessListByTypeTable
            searchTerm={searchTerm}
            selectedProcessCode={props.selectedProcessCode}
            showTableHead={true}
            processList={props.pinnedDataList?.filter((data) => {
              return data.Type == props.selectedProcessCode;
            })}
          />
          <h4
            style={{
              fontWeight: "600",
              display:
                props.pinnedDataList?.filter((data) => {
                  return data.Type == props.selectedProcessCode;
                }).length > 0
                  ? ""
                  : "none",
            }}
          >
            {t("processList.otherProcesses")}
          </h4>
          <ProcessListByTypeTable
            selectionOne={selectionOne}
            selectionTwo={selectionTwo}
            searchTerm={searchTerm}
            selectedProcessCode={props.selectedProcessCode}
            showTableHead={false}
            processList={props.processList}
          />
        </div>
      ) : (
        <ProcessListByTypeTable
          selectedProcessCode={props.selectedProcessCode}
          maxHeightofTable="440px"
          showTableHead={true}
          processList={props.processList}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedTabAtNavPanel: state.selectedTabAtNavReducer.selectedTab,
    defaultProcessTileIndex:
      state.defaultProcessTileReducer.defaultProcessTileIndex,
    clickedProcessTileAtHome:
      state.clickedProcessTileReducer.selectedProcessTile,
  };
};

export default connect(
  mapStateToProps,
  null
)(ProcessListByType_TableNSearchNSortNFilter);
