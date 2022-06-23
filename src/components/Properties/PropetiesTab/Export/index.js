import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import { useGlobalState } from "state-pool";
import { Tab, Tabs } from "@material-ui/core";
import { TabPanel } from "../../../ProcessSettings";
import TableDetails from "./TableDetails";
import FileDetails from "./FileDetails";
import {
  SERVER_URL,
  ENDPOINT_GET_ACTIVITY_PROPERTY,
  PROCESSTYPE_LOCAL,
} from "../../../../Constants/appConstants";
import CircularProgress from "@material-ui/core/CircularProgress";

function Export(props) {
  const { openProcessType } = props;
  const [localLoadedProcessData] = useGlobalState("loadedProcessData");
  let { t } = useTranslation();
  const { cellName, cellID } = props;
  const [fields, setFields] = useState([]);
  const [value, setValue] = useState(0);
  const [activityData, setActivityData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessReadOnly, setIsProcessReadOnly] = useState(false);

  // Function that runs when the component mounts.
  useEffect(() => {
    if (openProcessType !== PROCESSTYPE_LOCAL) {
      setIsProcessReadOnly(true);
    }
  }, [openProcessType]);

  // Function to handle tab change.
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Function that runs when the component loads.
  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          `${ENDPOINT_GET_ACTIVITY_PROPERTY}/${localLoadedProcessData.ProcessDefId}/${localLoadedProcessData.ProcessType}/${localLoadedProcessData.VersionNo}/${localLoadedProcessData.ProcessName}/${localLoadedProcessData.ProcessVariantType}/${cellID}/${cellName}`
      )
      .then((res) => {
        if (res.status === 200) {
          const getActivityData = res.data;
          setActivityData(getActivityData.ActivityProperty.Export);
          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div>
      {isLoading ? (
        <CircularProgress className="circular-progress" />
      ) : (
        <div>
          <div className={styles.tabStyles}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label={t("tableDetails")} />
              <Tab label={t("fileDetails")} />
            </Tabs>
          </div>
          <div className={styles.tabPanelStyles}>
            <TabPanel value={value} index={0}>
              <TableDetails
                data={activityData}
                fields={fields}
                setFields={setFields}
                isProcessReadOnly={isProcessReadOnly}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <FileDetails
                data={activityData && activityData.CSVInfo}
                fields={fields}
                isProcessReadOnly={isProcessReadOnly}
              />
            </TabPanel>
          </div>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    openProcessType: state.openProcessClick.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
  };
};
export default connect(mapStateToProps, null)(Export);
