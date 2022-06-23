import React from "react";
import ProcessIcon from "../../../../../../assets/ProcessView/ProcessIcon.svg";
import FileType from "../../../../../../assets/ProcessView/FileType.svg";
import "./ProcessListByTypeTable.css";

function Table(props) {
  let rowDisplay =
    props.processList &&
    props.processList.map((el) => {
      return (
        <div className="tableRow">
          <div style={{ width: "6%" }}>
            <img src={ProcessIcon} />
          </div>
          <div style={{ width: "35%", fontWeight: "500", fontSize: "12px" }}>
            {el.processName}
            <span style={{ display: "block", fontSize: "11px", color: "grey" }}>
              {el.Version}
              <span> . {el.processName}</span>
            </span>
          </div>
          <div style={{ width: "35%", fontWeight: "500", fontSize: "12px" }}>
            {props.type}
            <span style={{ display: "block", fontSize: "11px", color: "grey" }}>
              <span>Created On {el.CreatedOn}</span>
            </span>
          </div>
          <div style={{ width: "25%", fontWeight: "500", fontSize: "12px" }}>
            {el.LastUpdatedOn}
            <span style={{ display: "block", fontSize: "11px", color: "grey" }}>
              By Shivani Somvanshi
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
          <div style={{ width: "4%", fontSize: "14px", fontWeight: "600" }}>
            <img src={FileType} />
          </div>
          <div style={{ width: "30%", fontSize: "14px", fontWeight: "600" }}>
            Process Name
          </div>
          <div style={{ width: "30%", fontSize: "14px", fontWeight: "600" }}>
            Status
          </div>
          <div style={{ width: "25%", fontSize: "14px", fontWeight: "600" }}>
            Last Modified On
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="tableRows">{rowDisplay}</div>
    </div>
  );
}

export default Table;
