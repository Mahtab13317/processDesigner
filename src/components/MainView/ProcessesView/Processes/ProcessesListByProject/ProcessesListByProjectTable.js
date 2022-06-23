import React, {useState,useEffect} from "react";
import ProcessIcon from "../../../../../assets/HomePage/HS_Process.svg";
import FileType from "../../../../../assets/ProcessView/FileType.svg";
import "../../Projects/projects.css";
import { useTranslation } from "react-i18next";
import { tileProcess } from "../../../../../utility/HomeProcessView/tileProcess";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import * as actionCreators from "../../../../../redux-store/actions/processView/actions.js";

function Table(props) {
  let { t } = useTranslation();
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

  const [processPerProject, setprocessPerProject] = useState([])

  useEffect(() => {
   setprocessPerProject(props.processesPerProject)
  }, [props])
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
            <span>v {el.Version} . {el.ProjectName}</span>
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
              alt=""
            />
            {tileProcess(el.ProcessType)[1]}{" "}
            <img src={tileProcess(el.ProcessType)[5]} />{" "}
            <span>
              <span>
                {t("processesTable.createdOn")} {el.CreatedDate}
              </span>
            </span>
          </div>
          <div className="processListRow4">
            {el.ModifiedDate}
            <span>
              {t("processesTable.editedBy")} {el.LastModifiedBy}{" "}
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
