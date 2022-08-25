import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { store, useGlobalState } from "state-pool";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import { Tab, Tabs } from "@material-ui/core";
import { TabPanel } from "../../../ProcessSettings";
import TableDetails from "./TableDetails";
import FileDetails from "./FileDetails";
import {
  PROCESSTYPE_LOCAL,
  propertiesLabel,
} from "../../../../Constants/appConstants";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import TabsHeading from "../../../../UI/TabsHeading";

function Export(props) {
  const { openProcessType, openProcessID } = props;
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const globalActivityData = store.getState("activityPropertyData");
  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked
  const [localActivityPropertyData, setLocalActivityPropertyData] =
    useGlobalState(globalActivityData);
  const [fields, setFields] = useState([]);
  const [value, setValue] = useState(0);
  const [activityData, setActivityData] = useState({});
  const [isProcessReadOnly, setIsProcessReadOnly] = useState(false);
  const [varAndConstList, setVarAndConstList] = useState([]);

  // Function that runs when the component mounts.
  useEffect(() => {
    if (openProcessType !== PROCESSTYPE_LOCAL) {
      setIsProcessReadOnly(true);
    }
  }, [openProcessType]);

  // Function to set global data when the user does any action.
  const setGlobalData = (actData) => {
    let temp = JSON.parse(JSON.stringify(localActivityPropertyData));
    temp.ActivityProperty.exportInfo = actData;
    setLocalActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.Export]: { isModified: true, hasError: false },
      })
    );
  };

  // Function that runs when the component loads and loadedProcessData.value.DynamicConstant & loadedProcessData.value.Variable changes.
  useEffect(() => {
    if (loadedProcessData) {
      let tempArr = [];
      loadedProcessData?.value?.DynamicConstant?.forEach((element) => {
        let tempObj = {
          VariableName: element.ConstantName,
          VariableScope: "C",
        };
        tempArr.push(tempObj);
      });

      loadedProcessData?.value?.Variable?.forEach((element) => {
        tempArr.push(element);
      });
      setVarAndConstList(tempArr);
    }
  }, [
    loadedProcessData.value.DynamicConstant,
    loadedProcessData.value.Variable,
  ]);

  // Function to handle tab change.
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Function that runs when the component loads.
  useEffect(() => {
    if (localActivityPropertyData) {
      setActivityData(localActivityPropertyData?.ActivityProperty?.exportInfo);
    }
  }, []);

  return (
    <div>
      <div>
        <TabsHeading heading={props?.heading} />
        <div className={styles.tabStyles}>
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { background: "#0072C5" } }}
          >
            <Tab
              className={value === 0 && styles.tabLabel}
              label={t("tableDetails")}
            />
            <Tab
              className={value === 1 && styles.tabLabel}
              label={t("fileDetails")}
            />
          </Tabs>
        </div>
        <div className={styles.tabPanelStyles}>
          <TabPanel value={value} index={0}>
            <TableDetails
              openProcessType={openProcessType}
              openProcessID={openProcessID}
              data={activityData}
              fields={fields}
              setFields={setFields}
              isProcessReadOnly={isProcessReadOnly}
              documentList={loadedProcessData.value.DocumentTypeList}
              variablesList={varAndConstList}
              setActivityData={setActivityData}
              handleChange={handleChange}
              setGlobalData={setGlobalData}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <FileDetails
              data={activityData && activityData.fileInfo}
              setActivityData={setActivityData}
              fields={fields}
              isProcessReadOnly={isProcessReadOnly}
            />
          </TabPanel>
        </div>
      </div>
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
    openProcessID: state.openProcessClick.selectedId,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
  };
};

export default connect(mapStateToProps, null)(Export);
