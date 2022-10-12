// Changes made to solve Bug with ID 115457 -> Process Searching: search result result should refresh after erasing the entry of the search field
// Changes made to solve Bug 112929 - If search list has no data then it should have some error message appearing
// Changes made to solve bug with ID Bug 112353 - After Process importing the changes of imported process are reflecting only after the reopening of the process

import React, { useState, useEffect } from "react";
import ProcessIcon from "../../../../../assets/HomePage/HS_Process.svg";
import FileType from "../../../../../assets/ProcessView/FileType.svg";
import NoResultFound from "../../../../../assets/NoSearchResult.svg";
import "../../Projects/projects.css";
import { useTranslation } from "react-i18next";
import { tileProcess } from "../../../../../utility/HomeProcessView/tileProcess";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import * as actionCreators from "../../../../../redux-store/actions/processView/actions.js";
import { connect } from "react-redux";
import { filter } from "lodash";

const useStyles = makeStyles({
  processType: {
    textTransform: "uppercase",
    fontFamily: "var(--font_family)",
    fontWeight: "600",
    fontSize: "11px",
  },
  checkedType: {
    fontFamily: "var(--font_family)",
    fontSize: "11px",
  },
});

function Table(props) {
  let { t } = useTranslation();
  const classes = useStyles();
  const [filteredRow, setFilteredRow] = useState([]);
  const history = useHistory();

  useEffect(() => {
    props.setfilteredLength(filteredRow.length);
  }, [filteredRow])
  

  useEffect(() => {
    if (props.selectedProcessCode == "E") {
      let tempList = props?.processList?.filter((el) => {
        return el.ProcessState == "Enabled";
      });
      setFilteredRow(tempList);
    } else {
      let tempList = props?.processList?.filter((el) => {
        return el.ProcessState == "Disabled";
      });
      setFilteredRow(tempList);
    }
    console.log("PEACOCK", props.selectedProcessCode, filteredRow);
  }, [props.processList, props.selectedProcessCode]);

  useEffect(() => {
    if (props.processList?.length > 0) {
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

  const handleRowClick = (el) => {
    props.openProcessClick(
      el.ProcessDefId, //processId
      el.ProjectName, //parent
      el.ProcessType, //status
      el.Version, //version
      el.ProcessName //processname
    );

    history.push("/process");
  };

  let rowDisplay =
    filteredRow?.length > 0 ? (
      filteredRow.map((el) => {
        return (
          <div className="tableRow" onClick={() => handleRowClick(el)}>
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={
                    tileProcess(
                      el.ProcessType == "R"
                        ? el.ProcessState == "Enabled"
                          ? "E"
                          : "R"
                        : "L"
                    )[0]
                  }
                  style={{
                    height: "0.75rem",
                    width: "0.75rem",
                    marginRight: "0.125vw",
                  }}
                />
                <p className={classes.processType}>
                  {
                    tileProcess(
                      el.ProcessType == "R"
                        ? el.ProcessState == "Enabled"
                          ? "E"
                          : "R"
                        : "L"
                    )[1]
                  }{" "}
                  <img
                    src={
                      tileProcess(
                        el.ProcessType == "R" && el.ProcessState == "Enabled"
                          ? "E"
                          : "R"
                      )[5]
                    }
                    alt=""
                  />
                </p>
                <span className={classes.checkedType}>
                  {el.CheckedOut === "Y" ? `(${t("Checked")})` : null}
                </span>
              </div>
              <p style={{ fontSize: "11px" }}>
                {t("processesTable.createdOn")} {el.CreatedDate}
              </p>
            </div>
            <div className="processListRow4">
              <p
                className="recentTableProcessDate"
                style={{
                  fontFamily: "var(--font_family)",
                  fontWeight: "600",
                  fontSize: "11px",
                }}
              >
                {el.ModifiedDate}
              </p>
              <p
                style={{
                  fontFamily: "var(--font_family)",
                  fontSize: "11px",
                }}
              >
                {t("processesTable.editedBy")} {el.LastModifiedBy}{" "}
                {t("processesTable.at")} {el.ModifiedTime}
              </p>
            </div>
            <br />
            <br />
          </div>
        );
      })
    ) : (
      <img src={NoResultFound} className="noSearchResultImage" />
    );

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
const mapDispatchToProps = (dispatch) => {
  return {
    openProcessClick: (id, name, type, version, processName) =>
      dispatch(
        actionCreators.openProcessClick(id, name, type, version, processName)
      ),
    openTemplate: (id, name, flag) =>
      dispatch(actionCreators.openTemplate(id, name, flag)),
  };
};

export default connect(null, mapDispatchToProps)(Table);
