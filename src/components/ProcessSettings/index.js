import React, { useState } from "react";
import { Tabs, Tab, Box } from "@material-ui/core";
import IncludeFeature from "./IncludeFeature";
import QueueSwimlanes from "./QueueSwimlanes/QueueSwimlanes";
import TriggerType from "./TriggerType/index";
import { useTranslation } from "react-i18next";
import "./index.css";
import { RTL_DIRECTION } from "../../Constants/appConstants";
import ProcessProperties from "./ProcessProperties";
import DeployProcess from "../DeployProcess/DeployProcess";
import ImportExport_GlobalTask from "../Properties/PropetiesTab/Task/ImportExport_GlobalTask/index";
import Modal from "../../UI/Modal/Modal";
import Templates from "./Templates";

// Function to make TabPanel.
export function TabPanel(props) {
  const { children, value, index, ...other } = props;
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          style={{
            // height: "100vh",
            textAlign: direction === RTL_DIRECTION ? "right" : "left",
            padding: "0rem",
            minWidth: "4.5rem",
          }}
          p={3}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

// Function used for tabs.
export function tabProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function ProcessSettings(props) {
  let { t } = useTranslation();
  const { openProcessID, openProcessName, openProcessType } = props;
  const [value, setValue] = useState(0);
  const direction = `${t("HTML_DIR")}`;
  const [showModal, setShowModal] = useState(false);

  // Function to handle tab change.
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "91.84vh" }}>
      <div
        className="tabs"
        // code edited on 29 April 2022 for BugId 108418
        style={{ width: "15vw", background: "#FFF", marginTop: "4px" }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          style={{ height: "100%" }}
          value={value}
          onChange={handleChange}
        >
          <Tab
            className={
              direction === "rtl" ? "processSettingTabrtl" : "processSettingTab"
            }
            label={t("general")}
            {...tabProps(0)}
          />
          <Tab
            className={
              direction === "rtl" ? "processSettingTabrtl" : "processSettingTab"
            }
            label={t("deployProperties")}
            {...tabProps(1)}
          />
          <Tab
            className={
              direction === "rtl" ? "processSettingTabrtl" : "processSettingTab"
            }
            label={t("features")}
            {...tabProps(2)}
          />
          <Tab
            className={
              direction === "rtl" ? "processSettingTabrtl" : "processSettingTab"
            }
            label={t("defaultQueues")}
            {...tabProps(3)}
          />
          <Tab
            className={
              direction === "rtl" ? "processSettingTabrtl" : "processSettingTab"
            }
            label={t("templates")}
            {...tabProps(4)}
          />

          <Tab
            className={
              direction === "rtl" ? "processSettingTabrtl" : "processSettingTab"
            }
            label={t("triggerType")}
            {...tabProps(5)}
          />
        </Tabs>
      </div>
      {/* code edited on 29 April 2022 for BugId 108418 */}
      <div style={{ width: "85vw", marginTop: "5px" }}>
        <TabPanel style={{ padding: "0.625rem" }} value={value} index={0}>
          <ProcessProperties
            openProcessID={openProcessID}
            openProcessName={openProcessName}
            openProcessType={openProcessType}
          />
          {showModal ? (
            <Modal
              show={showModal}
              backDropStyle={{ backgroundColor: "transparent" }}
              style={{
                top: "20%",
                left: "30%",
                position: "absolute",
                width: "438px",
                zIndex: "1500",
                boxShadow: "0px 3px 6px #00000029",
                border: "1px solid #D6D6D6",
                borderRadius: "3px",
                height: "auto",
              }}
              modalClosed={() => setShowModal(false)}
              children={
                <ImportExport_GlobalTask
                  showModal={showModal}
                  setShowModal={setShowModal}
                />
              }
            ></Modal>
          ) : null}
        </TabPanel>
        <TabPanel style={{ padding: "0.625rem" }} value={value} index={1}>
          <DeployProcess deployFrom="Settings" />
        </TabPanel>
        <TabPanel
          style={{ backgroundColor: "#F8F8F8" }}
          value={value}
          index={2}
        >
          <IncludeFeature
            openProcessID={openProcessID}
            openProcessName={openProcessName}
            openProcessType={openProcessType}
          />
        </TabPanel>
        <TabPanel style={{ padding: "0.625rem" }} value={value} index={3}>
          <QueueSwimlanes processType={openProcessType} />.
        </TabPanel>

        <TabPanel value={value} index={4}>
          <Templates />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <TriggerType />
        </TabPanel>
      </div>
    </div>
  );
}

export default ProcessSettings;
