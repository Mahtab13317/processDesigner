import React, { useState } from "react";
import { Tabs, Tab, Box } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { LOCAL_SCOPE, RTL_DIRECTION } from "../../Constants/appConstants";
import External from "./External";
import Webservice from "../MainView/ProcessesView/Settings/ServiceCatalog/Webservice";
import { TabPanel, tabProps } from "../ProcessSettings";
import SAP from "./SAP/SAP";
import { store, useGlobalState } from "state-pool";

function ServiceCatalog(props) {
  let { t } = useTranslation();
  const [value, setValue] = useState(0);
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);

  // Function to handle tab change.
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div style={{ display: "flex", flexDirection: "row", height: "91.84vh" }}>
      <div
        className="tabs"
        style={{ width: "17vw", background: "#FFF", marginTop: "4px" }}
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
            label={t("webService")}
            {...tabProps(0)}
          />
          <Tab
            className={
              direction === "rtl" ? "processSettingTabrtl" : "processSettingTab"
            }
            label={`${t("external")} ${t("Methods")}`}
            {...tabProps(1)}
          />
          {localLoadedProcessData?.SAPRequired ? (
            <Tab
              className={
                direction === "rtl"
                  ? "processSettingTabrtl"
                  : "processSettingTab"
              }
              label={t("SAP")}
              {...tabProps(2)}
            />
          ) : null}
        </Tabs>
      </div>
      <div style={{ width: "83vw", marginTop: "5px" }}>
        <TabPanel style={{ padding: "0.25rem 0.5rem" }} value={value} index={0}>
          <Webservice style={{ height: "80vh" }} scope={LOCAL_SCOPE} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <External scope={LOCAL_SCOPE} />
        </TabPanel>
        <TabPanel style={{ padding: "0.625rem" }} value={value} index={2}>
          <SAP />
        </TabPanel>
      </div>
    </div>
  );
}

export default ServiceCatalog;
