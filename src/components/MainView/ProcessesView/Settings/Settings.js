import React, { useState } from "react";
import { Tabs, Tab, Box } from "@material-ui/core";
import { useTranslation } from "react-i18next";
// import styles from './settings.module.css'
import "./settings.css";
import GlobalRequirementSections from "./GlobalRequirementSections/GlobalRequirementSections";
import { TabPanel, tabProps } from "../../../ProcessSettings";
import ServiceCatalog from "./ServiceCatalog";

function Settings() {
  let { t } = useTranslation();
  const [value, setValue] = useState(0);
  const direction = `${t("HTML_DIR")}`;

  // Function to handle tab change.
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", height: "91.84vh" }}>
        <div
          className="tabs"
          style={{
            width: "17vw",
            background: "#FFF",
            boxShadow: "0px 3px 6px #00000029",
          }}
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
                direction === "rtl"
                  ? "processSettingTabrtl"
                  : "processSettingTab"
              }
              label={t("serviceCatalog")}
              {...tabProps(0)}
            />
            <Tab
              className={
                direction === "rtl"
                  ? "processSettingTabrtl"
                  : "processSettingTab"
              }
              label={t("processFeaturesCatalog")}
              {...tabProps(1)}
            />
            <Tab
              className={
                direction === "rtl"
                  ? "processSettingTabrtl"
                  : "processSettingTab"
              }
              label={t("globalRequirementSections")}
              {...tabProps(2)}
            />
          </Tabs>
        </div>
        <div style={{ width: "77.18vw" }}>
          <TabPanel
            style={{
              backgroundColor: "#F8F8F8",
              padding: "0 1vw",
              width: "78vw",
              height: "100%",
            }}
            value={value}
            index={0}
          >
            <ServiceCatalog />
          </TabPanel>
          <TabPanel style={{ padding: "0.625rem" }} value={value} index={1}>
            Process Features Catalog to be painted here.
          </TabPanel>
          <TabPanel
            style={{ backgroundColor: "#F8F8F8", padding: "0.625rem" }}
            value={value}
            index={2}
          >
            <GlobalRequirementSections callLocation="Settings" />
          </TabPanel>
        </div>
      </div>
    </div>
  );
}

export default Settings;
