import React, { useState, useEffect } from "react";
import ProcessIcon from "../../../../../assets/HomePage/HS_Process.svg";
import FileType from "../../../../../assets/ProcessView/FileType.svg";
import "../../Projects/projects.css";
import { useTranslation } from "react-i18next";
import { tileProcess } from "../../../../../utility/HomeProcessView/tileProcess";

function Table(props) {
  let { t } = useTranslation();
  const [filteredRow, setFilteredRow] = useState([]);

  useEffect(() => {
    setFilteredRow(props.processList);
  }, [props.processList]);

  useEffect(() => {
    if (props.searchTerm && filteredRow.length > 0) {
      let searchedList = props.processList?.filter((row) => {
        if (props.searchTerm == "") {
          return row;
        } else if (
          row.ProcessName.toLowerCase().includes(props.searchTerm.toLowerCase())
        ) {
          return row;
        }
      });
      setFilteredRow(searchedList);
    }
  }, [props.searchTerm]);

  let processList = { ...props.processList };
  if (props.selectionOne == "2" && props.selectionTwo == "0") {
    processList = props.processList.sort((a, b) =>
      a.ProcessName < b.ProcessName ? -1 : 1
    );
  } else if (props.selectionOne == "2" && props.selectionTwo == "1") {
    processList = props.processList.sort((a, b) =>
      a.ProcessName > b.ProcessName ? -1 : 1
    );
  }

  let rowDisplay;
  rowDisplay =
    filteredRow &&
    filteredRow.map((el) => {
      return (
        <div className="tableRow">
          <div className="processListRow1">
            <img src={ProcessIcon} className="iconTypeProcess" />
          </div>
          <div className="processListRow2">
            {el.ProcessName}
            <span>
              v {el.Version} . {el.ProjectName}
            </span>
          </div>
          <div className="processListRow3">
            <img
              src={tileProcess(el.ProcessType)[0]}
              style={{
                height: "10px",
                width: "10px",
                marginTop: "1px",
                marginRight: "0.125vw",
              }}
            />
            {tileProcess(el.ProcessType)[1]} {tileProcess(el.Type)[1]}{" "}
            <img
              src={tileProcess(el.ProcessType)[5] || tileProcess(el.Type)[5]}
            />
            <span>
              {t("processesTable.createdOn")} {el.CreatedDate}
            </span>
          </div>
          <div className="processListRow4">
            {el.ModifiedDate}
            <span>
              {t("processesTable.editedBy")} {el.LastModifiedBy} {el.Editor}{" "}
              {t("processesTable.at")} {el.ModifiedTime}
            </span>
          </div>
          <br />
          <br />
        </div>
      );
    });

  return (
    <div className="processTable">
      {props.showTableHead && props.processList.length > 0 ? (
        <div className="tableHead">
          <div className="processListHead1">
            <img src={FileType} className="iconTypeProcess" />
          </div>
          <div className="processListHead2">
            {t("processesTable.processesName")}
          </div>
          <div className="processListHead3">
            {t("processesTable.processStatus")}
          </div>
          <div className="processListHead4">
            {t("processesTable.lastModifiedDate")}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="tableRows" style={{ maxHeight: props.maxHeightofTable }}>
        {rowDisplay}
      </div>
    </div>
  );
}

export default Table;
