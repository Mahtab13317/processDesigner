import React, { useState, useEffect } from "react";
import { store, useGlobalState } from "state-pool";

function CommonHeader(props) {
  // Process Data
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  // Activity Data
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0.25rem 0.5vw 0",
        }}
      >
        <p style={{ color: "#606060", fontSize: "12px" }}>
          {props.tabType == "ForwardForVariables" ||
          props.tabType == "ForwardForDocuments"
            ? "FORWARD MAPPING"
            : "REVERSE MAPPING"}
        </p>
        <p
          style={{ color: "#0072C6", fontSize: "11px" }}
          onClick={() => props.setShowVariablesModal(true)}
        >
          {props.tabType == "ForwardForVariables" ||
          props.tabType == "ReverseForVariables"
            ? "Add Variable(s)"
            : "Add Document(s)"}
        </p>
      </div>
      <hr style={{ height: "1px", color: "#707070", margin: "5px 0px" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: props.isDrawerExpanded ? "60%" : "100%",
          padding: "0 0.5vw",
        }}
      >
        <div
          style={{
            flex: "1",
            height: "38px",
            borderRadius: "1px",
            opacity: "1",
            backgroundColor: "#F4F4F4",
            display: "flex",
            flexDirection: "column",
            paddingLeft: "5px",
          }}
        >
          <p style={{ fontSize: "11px", color: "#000000" }}>
            {props.tabType == "ForwardForDocuments" ||
            props.tabType == "ForwardForVariables"
              ? "Target Process"
              : "Current Proces"}
          </p>
          <p style={{ fontSize: "11px", color: "#000000" }}>
            {props.tabType == "ForwardForDocuments" ||
            props.tabType == "ForwardForVariables"
              ? localLoadedActivityPropertyData?.m_objPMSubProcess
                  ?.importedProcessName
              : localLoadedProcessData?.ProcessName}
          </p>
        </div>
        <div style={{ flex: "0.2" }}></div>
        <div
          style={{
            flex: "1",
            height: "38px",
            borderRadius: "1px",
            opacity: "1",
            backgroundColor: "#F4F4F4",
            display: "flex",
            flexDirection: "column",
            paddingLeft: "5px",
          }}
        >
          <p style={{ fontSize: "11px", color: "#000000" }}>
            {" "}
            {props.tabType == "ForwardForDocuments" ||
            props.tabType == "ForwardForVariables"
              ? "Current Process"
              : "Target Proces"}
          </p>
          <p style={{ fontSize: "11px", color: "#000000" }}>
            {props.tabType == "ForwardForDocuments" ||
            props.tabType == "ForwardForVariables"
              ? localLoadedProcessData?.ProcessName
              : localLoadedActivityPropertyData?.m_objPMSubProcess
                  ?.importedProcessName}
          </p>
        </div>
        <div style={{ flex: "0.2" }}></div>
      </div>
    </div>
  );
}

export default CommonHeader;
