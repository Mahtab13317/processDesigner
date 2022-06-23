import React from "react";
import "./index.css";
import CloseIcon from "@material-ui/icons/Close";
import { store, useGlobalState } from "state-pool";

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
          onClick={() => props.setShowDeployModal(false)}
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
        <p
          style={{
            fontSize: "12px",
            color: "#606060",
            margin: "20px 0px 5px 0px",
          }}
        >
          Comments
        </p>
        <textarea
          style={{
            width: "360px",
            height: "56px",
            border: "1px solid #CECECE",
          }}
        />
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
          onClick={() => props.setShowDeployModal(false)}
          style={{
            width: "54px",
            height: "28px",
            backgroundColor: "white",
            color: "grey",
            position: "absolute",
            right: "22%",
            top: "24%",
            border: "1px solid grey",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
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
        >
          Deploy
        </button>
      </div>
    </div>
  );
}

export default DeployProcess;
