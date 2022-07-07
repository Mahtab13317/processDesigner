import React, { useState, useEffect } from "react";
import { RTL_DIRECTION, STATE_CREATED } from "../../Constants/appConstants";
import { Tab, Tabs, Icon } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { TabPanel } from "../ProcessSettings";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import DefinedConstants from "./DefinedConstants";
import BusinessVariables from "./BusinessVariables";
import UserDefinedDataTypes from "./UserDefinedDataTypes";
import BusinessVariableIcon from "../../assets/DataModalIcons/DML_BusinessVariable.svg";
import ConstantsIcon from "../../assets/DataModalIcons/DML_Constant.svg";
import UserDefinedDataTypeIcon from "../../assets/DataModalIcons/DML_UserDefinedDataType.svg";
import DataObjectsIcon from "../../assets/DataModalIcons/DML_DtataObjects.svg";
import ERDiagramIcon from "../../assets/DataModalIcons/DML_ERDiagram.svg";
import { store, useGlobalState } from "state-pool";
import DataRights from "./DataRights";

function DataModel(props) {
  let { t } = useTranslation();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const direction = `${t("HTML_DIR")}`;
  const [variableDefinition] = useGlobalState("variableDefinition");
  let totalVariablesCount = variableDefinition.length;
  const { openProcessID, openProcessType, tableName } = props;
  const [value, setValue] = useState(0);
  const [userDefinedCount, setUserDefinedCount] = useState(0);
  const [dataTypesList, setDataTypesList] = useState([]);

  useEffect(() => {
    setUserDefinedCount(localLoadedProcessData?.ComplexVarDefinition?.length);
  }, []);

  // Function to handle tab change.
  const handleChange = (event, newValue) => {
    let indexVal;
    let newData = [...dataTypesList];
    //to remove existing temporary dataObjects from list, before adding new temporary dataObject
    newData?.forEach((dataType, index) => {
      if (dataType.status && dataType.status === STATE_CREATED) {
        indexVal = index;
      }
    });
    if (indexVal || indexVal === 0) {
      newData.splice(indexVal, 1);
    }
    setDataTypesList(newData);
    setUserDefinedCount(newData.length);
    setValue(newValue);
  };

  // Function to get the label data for a tab.
  const getLabel = (labelName, labelCount) => {
    return (
      <div className={styles.labelData}>
        <p className={styles.labelName}>{labelName}</p>
        <p className={styles.labelCount}>{labelCount}</p>
      </div>
    );
  };

  return (
    <div className={styles.mainDiv}>
      <div
        className={
          direction === RTL_DIRECTION
            ? `${arabicStyles.dataModelNavBar} tabStyle`
            : `${styles.dataModelNavBar} tabStyle`
        }
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          style={{ height: "100vh" }}
          value={value}
          onChange={handleChange}
        >
          <Tab
            icon={
              <Icon style={{ textAlign: "center" }}>
                <img style={{ height: "100%" }} src={BusinessVariableIcon} />
              </Icon>
            }
            className={styles.dataModelTab}
            label={getLabel(t("businessVariablesTab"), totalVariablesCount)}
          />
          <Tab
            className={styles.dataModelTab}
            icon={
              <Icon style={{ textAlign: "center" }}>
                <img style={{ height: "100%" }} src={ConstantsIcon} />
              </Icon>
            }
            label={getLabel(
              t("constants"),
              localLoadedProcessData?.DynamicConstant?.length
            )}
          />
          <Tab
            className={styles.dataModelTab}
            icon={
              <Icon style={{ textAlign: "center" }}>
                <img style={{ height: "100%" }} src={UserDefinedDataTypeIcon} />
              </Icon>
            }
            label={getLabel(t("userDefinedDataTypes"), userDefinedCount)}
          />
          <Tab
            className={styles.dataModelTab}
            icon={
              <Icon style={{ textAlign: "center" }}>
                <img style={{ height: "100%" }} src={DataObjectsIcon} />
              </Icon>
            }
            label={getLabel(t("dataObjects"), userDefinedCount)}
          />
          <Tab
            className={styles.dataModelTab}
            icon={
              <Icon style={{ textAlign: "center" }}>
                <img style={{ height: "100%" }} src={ERDiagramIcon} />
              </Icon>
            }
            label={getLabel(t("dataRights"))}
          />
        </Tabs>
      </div>
      <div style={{ width: "82.5vw" }}>
        <TabPanel
          style={{ backgroundColor: "#F8F8F8" }}
          value={value}
          index={0}
        >
          <BusinessVariables
            openProcessType={openProcessType}
            openProcessID={openProcessID}
          />
        </TabPanel>
        <TabPanel
          style={{ backgroundColor: "#F8F8F8" }}
          value={value}
          index={1}
        >
          <DefinedConstants
            openProcessID={openProcessID}
            openProcessType={openProcessType}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <UserDefinedDataTypes
            setUserDefinedCount={setUserDefinedCount}
            dataTypesList={dataTypesList}
            setDataTypesList={setDataTypesList}
          />
        </TabPanel>
        <TabPanel style={{ padding: "0.625rem" }} value={value} index={3}>
          Data Objects section to be painted here.
        </TabPanel>
        <TabPanel style={{ padding: "0.625rem" }} value={value} index={4}>
          <DataRights />
        </TabPanel>
      </div>
    </div>
  );
}

export default DataModel;
