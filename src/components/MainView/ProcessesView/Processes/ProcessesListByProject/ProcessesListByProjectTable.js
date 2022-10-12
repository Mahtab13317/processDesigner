// Changes made to solve Bug 115456 -> Process Search: Searching not working for Processes listed under the projects
// Changes made to solve Bug 112929 - If search list has no data then it should have some error message appearing
import React, { useState, useEffect } from "react";
import ProcessIcon from "../../../../../assets/HomePage/HS_Process.svg";
import FileType from "../../../../../assets/ProcessView/FileType.svg";
import "../../Projects/projects.css";
import { useTranslation } from "react-i18next";
import { tileProcess } from "../../../../../utility/HomeProcessView/tileProcess";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import * as actionCreators from "../../../../../redux-store/actions/processView/actions.js";
import NoResultFound from "../../../../../assets/NoSearchResult.svg";

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
  const history = useHistory();
  const clickRow = (el) => {
    props.openProcessClick(
      el.ProcessDefId,
      el.ProjectName,
      el.ProcessType,
      el.Version,
      el.ProcessName
    );
    props.openTemplate(null, null, false);
    history.push("/process");
  };

  const [filteredRow, setFilteredRow] = useState([]);

  useEffect(() => {
    console.log("CANCEL", props.processesPerProject);
    setFilteredRow(props.processesPerProject);
  }, [props.processesPerProject]);

  useEffect(() => {
    if (props.processesPerProject?.length > 0) {
      if (props.searchTerm == "") {
        setFilteredRow(props.processesPerProject);
      } else {
        let searchedList = props.processesPerProject?.filter((row) => {
          if (
            row.ProcessName.toLowerCase().includes(
              props.searchTerm.toLowerCase()
            )
          ) {
            return row;
          }
        });
        setFilteredRow(searchedList);
      }
    }
  }, [props.searchTerm]);

  useEffect(() => {
    let temp;
    if (props.selectionOne == 2 || props.selectionTwo == 1) {
      temp = [...props.processesPerProject];
    } else {
      temp = [
        ...props.processesPerProject.filter((el) => {
          return el.LastModifiedBy == localStorage.getItem("username");
        }),
      ];
    }
    const newTemp = temp.map((obj) => {
      return {
        ...obj,
        LastModifiedOn: new Date(obj.LastModifiedOn).getTime(),
      };
    });
    function compare(a, b) {
      if (a.LastModifiedOn < b.LastModifiedOn) {
        return -1;
      }
      if (a.LastModifiedOn > b.LastModifiedOn) {
        return 1;
      }
      return 0;
    }
    const newTempAsc = newTemp.sort(compare);
    if (props.selectionOne == 2 && props.selectionTwo == 1) {
      setFilteredRow(temp.reverse());
    } else if (props.selectionOne == 2 && props.selectionTwo == 0) {
      setFilteredRow(temp);
    } else if (
      (props.selectionOne == 1 && props.selectionTwo == 0) ||
      (props.selectionOne == 0 && props.selectionTwo == 0)
    ) {
      setFilteredRow(newTempAsc);
    } else if (
      (props.selectionOne == 1 && props.selectionTwo == 1) ||
      (props.selectionOne == 0 && props.selectionTwo == 1)
    ) {
      setFilteredRow(newTempAsc.reverse());
    }
  }, [props.selectionOne, props.selectionTwo]);

  let rowDisplay =
    filteredRow?.length > 0 ? (
      filteredRow.map((el) => {
        return (
          <div className="tableRow" onClick={() => clickRow(el)}>
            <div className="processListRow1">
              <img src={ProcessIcon} className="iconTypeProcess" alt="" />
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
                  src={tileProcess(el.ProcessType)[0]}
                  style={{
                    height: "0.75rem",
                    width: "0.75rem",
                    marginRight: "0.125vw",
                  }}
                  alt=""
                />
                <p className={classes.processType}>
                  {tileProcess(el.ProcessType)[1]}{" "}
                  <img src={tileProcess(el.ProcessType)[5]} alt="" />
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
          </div>
        );
      })
    ) : (
      <img src={NoResultFound} className="noSearchResultImageN" />
    );

  return (
    <div className="processTable">
      {props.showTableHead ? (
        <div className="tableHead">
          <div className="processListHead1">
            <img src={FileType} className="iconTypeProject" />
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
      <div
        className="tableRows"
        style={{
          height: "auto",
          maxHeight: props.maxHeightofTable,
          margin: props.margin,
        }}
      >
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
