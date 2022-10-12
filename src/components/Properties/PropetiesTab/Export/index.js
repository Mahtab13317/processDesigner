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
  EXPORT_CSV_FILE_TYPE,
  EXPORT_DAILY_FILE_MOVE,
  EXPORT_FIXED_LENGTH_FIELD_TYPE,
  propertiesLabel,
} from "../../../../Constants/appConstants";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import TabsHeading from "../../../../UI/TabsHeading";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

function Export(props) {
  const { openProcessType, openProcessID } = props;
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const globalActivityData = store.getState("activityPropertyData");
  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [localActivityPropertyData, setLocalActivityPropertyData] =
    useGlobalState(globalActivityData);
  const [fields, setFields] = useState([]);
  const [value, setValue] = useState(0);
  const [activityData, setActivityData] = useState({});
  const [varAndConstList, setVarAndConstList] = useState([]);
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut);

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

  // Function that runs when the component loads and localLoadedProcessData.DynamicConstant & localLoadedProcessData.Variable changes.
  useEffect(() => {
    let tempArr = [];
    localLoadedProcessData?.DynamicConstant?.forEach((element) => {
      let tempObj = {
        VariableName: element.ConstantName,
        VariableScope: "C",
      };
      tempArr.push(tempObj);
    });
    localLoadedProcessData?.Variable?.forEach((element) => {
      tempArr.push(element);
    });
    setVarAndConstList(tempArr);
  }, [
    localLoadedProcessData?.DynamicConstant,
    localLoadedProcessData?.Variable,
  ]);

  // Function to handle tab change.
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Function that runs when the component loads.
  useEffect(() => {
    if (localActivityPropertyData) {
      let temp = localActivityPropertyData?.ActivityProperty?.exportInfo;
      temp.fileInfo.fileType = EXPORT_CSV_FILE_TYPE;
      temp.fileInfo.csvType = "1";
      temp.fileInfo.csvType = EXPORT_FIXED_LENGTH_FIELD_TYPE;
      temp.fileInfo.fileExpiryTrig = EXPORT_DAILY_FILE_MOVE;
      setActivityData(temp);
    }
  }, []);

  return (
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
            isReadOnly={isReadOnly}
            documentList={localLoadedProcessData.DocumentTypeList}
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
            isReadOnly={isReadOnly}
          />
        </TabPanel>
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
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
  };
};

export default connect(mapStateToProps, null)(Export);
