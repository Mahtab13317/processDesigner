import React, { useState } from "react";
import Tabs from "../../../UI/Tab/Tab.js";
import "./index.css";
import GlobalRequirementSections from "../../MainView/ProcessesView/Settings/GlobalRequirementSections/GlobalRequirementSections.js";
import ProcessRequirements from "./ProcessRequirements/index.js";
import AttachmentRequirement from "./AttachmentRequirement.js";
import { store, useGlobalState } from "state-pool";
import { CircularProgress } from "@material-ui/core";

function ProcessRequireNAttach(props) {
  const [isActive, setIsActive] = useState(false);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  return (
    <>
      {localLoadedProcessData === null ? (
        <CircularProgress style={{ marginTop: "40vh", marginLeft: "50%" }} />
      ) : (
        <Tabs
          tabType="processSubTab"
          tabContentStyle="processSubTabContentStyle"
          tabBarStyle="processSubTabBarStyle subProcessRequirements"
          oneTabStyle="processSubOneTabStyle"
          tabStyling="processViewTabs"
          tabsStyle="processViewSubTabs"
          style={{ backgroundColor: "#E4E4E4" }}
          className="Please"
          TabNames={["Requirements", "Attachments", "Requirements Section"]}
          TabElement={[
            <div
              style={{
                height: "80vh",
              }}
            >
              <ProcessRequirements
                isActive={isActive}
                setIsActive={setIsActive}
                fromArea = 'ProcessLevel'
              />
            </div>,
            <div
              style={{
                position: "absolute",
                top: "10%",
                width: "100%",
                color: "black",
                fontStyle: "italic",
              }}
            >
              <p style={{ color: "black" }}>
                <AttachmentRequirement />
              </p>
            </div>,
            <div
              style={
                {
                  // position: "absolute",
                  // backgroundColor: "white",
                  // height: "95%",
                  // width: "100%",
                  // color: "black",
                  // fontStyle: "italic",
                }
              }
            >
              <p style={{ color: "black" }}>
                <GlobalRequirementSections callLocation="ProcessLevel" />
              </p>
            </div>,
          ]}
        />
      )}
    </>
  );
}

export default ProcessRequireNAttach;
