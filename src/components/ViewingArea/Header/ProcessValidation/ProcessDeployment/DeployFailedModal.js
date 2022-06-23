import React, { useState, useEffect } from "react";
import "./index.css";
import CloseIcon from "@material-ui/icons/Close";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";

function DeployProcess(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);

  return (
    <div>
      <div
        style={{
          height: "15px",
          width: "100%",
          padding: "20px 12px 20px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: "14px", fontWeight: "700" }}>Deploy Process</p>
        <CloseIcon
          onClick={() => props.setShowDeployFailModal(false)}
          style={{
            height: "13px",
            width: "13px",
            cursor: "pointer",
          }}
        />
      </div>
      <hr />
      <div
        style={{ display: "flex", flexDirection: "column", padding: "18px" }}
      >
        <p style={{ fontSize: "12px", color: "#606060", marginBottom: "2px" }}>
          Process Name
        </p>
        <p style={{ fontSize: "12px", color: "#000000", fontWeight: "600" }}>
          {localLoadedProcessData.ProcessName}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0px 18px",
        }}
      >
        <p style={{ fontSize: "12px", color: "#D53D3D", marginBottom: "2px" }}>
          Deploy Failed
        </p>
        <p style={{ fontSize: "12px", color: "#606060" }}>
          Some errors and Warnings present{" "}
          <span
            style={{
              color: "#0172C6",
              fontSize: "12px",
              cursor: "pointer",
              marginLeft: "25px",
            }}
            // onClick={() => closeThisAndShowValidationPopUp()}
          >
            View details
          </span>
        </p>
      </div>
      <div
        style={{
          width: "394px",
          height: "50px",
          backgroundColor: "#F5F5F5",
          position: "absolute",
          bottom: "0px",
        }}
      >
        <button
          style={{
            width: "54px",
            height: "28px",
            backgroundColor: "#0072C6",
            color: "white",
            position: "absolute",
            right: "4%",
            top: "24%",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => props.setShowDeployFailModal(false)}
        >
          Ok
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    templateId: state.openTemplateReducer.templateId,
    templateName: state.openTemplateReducer.templateName,
    openTemplateFlag: state.openTemplateReducer.openFlag,
  };
};

export default connect(mapStateToProps)(DeployProcess);
