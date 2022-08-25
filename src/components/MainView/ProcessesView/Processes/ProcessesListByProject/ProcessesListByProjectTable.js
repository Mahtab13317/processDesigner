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

  const [processPerProject, setprocessPerProject] = useState([]);

  useEffect(() => {
    setprocessPerProject(props.processesPerProject);
  }, [props]);
  let rowDisplay =
    processPerProject &&
    processPerProject.map((el) => {
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
    });

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
