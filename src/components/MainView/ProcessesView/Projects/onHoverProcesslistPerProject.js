import React from "react";
import "./projects.css";
import { tileProcess } from "../../../../utility/HomeProcessView/tileProcess";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

function onHoverProcesslistPerProject(props) {
  let processList = props.processTypeList && props.processTypeList.map((list) => {
    return (
      <div
        style={{ display: "flex", alignItems: "center", padding: "4px 0px" }}
      >
        <FiberManualRecordIcon
          style={{
            color: tileProcess(list.ProcessType)[7],
            height: "10px",
            width: "10px",
            marginRight: "4px",
          }}
        />
        <span style={{ color: "#FFFFFF", marginRight: "4px" }}>
          {list.Count}
        </span>
        <span style={{ color: "#CECECE" }}>
          <span style={{ display: "flex", alignItems: "center" }}>
            {tileProcess(list.ProcessType)[1]}
            {tileProcess(list.ProcessType)[2] ? (
              <img
                style={{ width: "10px", height: "10px", marginLeft: "4px" }}
                src={tileProcess(list.ProcessType)[5]}
              />
            ) : null}
          </span>
        </span>
      </div>
    );
  });

  return <div className="projectToolTip">{processList}</div>;
}

export default onHoverProcesslistPerProject;
