import React, { useState, useEffect } from "react";
import Tabs from "../../../UI/Tab/Tab.js";
import "./index.css";
import GlobalRequirementSections from "../../MainView/ProcessesView/Settings/GlobalRequirementSections/GlobalRequirementSections.js";
import ProcessRequirements from "./ProcessRequirements/index.js";
import AttachmentRequirement from "./AttachmentRequirement.js";

function ProcessRequireNAttach(props) {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      
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
    </>
  );
}

export default ProcessRequireNAttach;
