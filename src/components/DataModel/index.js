import React, { useState, useEffect } from "react";
import {
  RTL_DIRECTION,
  STATE_CREATED,
  userRightsMenuNames,
} from "../../Constants/appConstants";
import { Tab, Tabs, Icon } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { TabPanel } from "../ProcessSettings";
import styles from "./index.module.css";
import { useSelector } from "react-redux";
import arabicStyles from "./ArabicStyles.module.css";
import DefinedConstants from "./DefinedConstants";
import BusinessVariables from "./BusinessVariables";
import UserDefinedDataTypes from "./UserDefinedDataTypes";
import BusinessVariableIcon from "../../assets/DataModalIcons/DML_BusinessVariable.svg";
import ConstantsIcon from "../../assets/DataModalIcons/DML_Constant.svg";
import UserDefinedDataTypeIcon from "../../assets/DataModalIcons/DML_UserDefinedDataType.svg";
import DataObjectsIcon from "../../assets/DataModalIcons/DML_DtataObjects.svg";

import { store, useGlobalState } from "state-pool";
import { getMenuNameFlag } from "../../utility/UserRightsFunctions";
import { UserRightsValue } from "../../redux-store/slices/UserRightsSlice";
import DataObject from "./DataObject/DataObject";
import DataRights from "./DataRights";

function DataModel(props) {
  let { t } = useTranslation();
  const userRightsValue = useSelector(UserRightsValue);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const direction = `${t("HTML_DIR")}`;
  const [variableDefinition] = useGlobalState("variableDefinition");
  let totalVariablesCount = variableDefinition.length;
  const { openProcessID, openProcessType } = props;
  const [value, setValue] = useState(0);
  const [userDefinedCount, setUserDefinedCount] = useState(0);
  const [dataTypesList, setDataTypesList] = useState([]);
  const [dataModelTabs, setDataModelTabs] = useState([]);

  // Boolean that decides whether constants tab will be visible or not.
  const constantsTabFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.constants
  );

  // Function that runs when the component loads.
  useEffect(() => {
    setUserDefinedCount(localLoadedProcessData?.ComplexVarDefinition?.length);
  }, []);

  // Function to get the label data for a tab.
  const getLabel = (labelName, labelCount) => {
    return (
      <div className={styles.labelData}>
        <p className={styles.labelName}>{labelName}</p>
        <p className={styles.labelCount}>{labelCount}</p>
      </div>
    );
  };

  // Array to create tabs and its components.
  const arr = [
    {
      label: getLabel(t("businessVariablesTab"), totalVariablesCount),
      labelName: t("businessVariablesTab"),
      icon: (
        <Icon style={{ textAlign: "center" }}>
          <img style={{ height: "100%" }} src={BusinessVariableIcon} />
        </Icon>
      ),
      style: { backgroundColor: "#F8F8F8" },
      component: (
        <BusinessVariables
          openProcessType={openProcessType}
          openProcessID={openProcessID}
        />
      ),
    },
    {
      label: getLabel(
        t("constants"),
        localLoadedProcessData?.DynamicConstant?.length
      ),
      labelName: t("constants"),
      icon: (
        <Icon style={{ textAlign: "center" }}>
          <img style={{ height: "100%" }} src={ConstantsIcon} />
        </Icon>
      ),
      style: { backgroundColor: "#F8F8F8" },
      component: (
        <DefinedConstants
          openProcessID={openProcessID}
          openProcessType={openProcessType}
        />
        
      ),
    },
    {
      label: getLabel(t("userDefinedDataTypes"), userDefinedCount),
      labelName: t("userDefinedDataTypes"),
      icon: (
        <Icon style={{ textAlign: "center" }}>
          <img style={{ height: "100%" }} src={UserDefinedDataTypeIcon} />
        </Icon>
      ),
      component: (
        <UserDefinedDataTypes
          setUserDefinedCount={setUserDefinedCount}
          dataTypesList={dataTypesList}
          setDataTypesList={setDataTypesList}
        />
      ),
    },
    {
      label: getLabel(t("dataObjects"), "0"),
      labelName: t("dataObjects"),
      icon: (
        <Icon style={{ textAlign: "center" }}>
          <img style={{ height: "100%" }} src={DataObjectsIcon} />
        </Icon>
      ),
      style: { padding: "0.625rem" },
      component: <DataObject />,
    },
    {
      label: getLabel(t("dataRights")),
      labelName: t("dataRights"),
      icon: (
        <Icon style={{ textAlign: "center" }}>
          <img style={{ height: "100%" }} src={DataObjectsIcon} />
        </Icon>
      ),
      style: { padding: "0.625rem" },
      component: <DataRights />,
    },
  ];

  // {
  //   label: getLabel(t("erDiagram")),
  //   labelName: t("erDiagram"),
  //   icon: (
  //     <Icon style={{ textAlign: "center" }}>
  //       <img style={{ height: "100%" }} src={ERDiagramIcon} />
  //     </Icon>
  //   ),
  //   style: { padding: "0.625rem" },
  //   component: "ER Diagram section to be painted here.",
  // },

  // Function that runs when the component loads.
  useEffect(() => {
    let tempArr = [...arr];
    if (!constantsTabFlag) {
      let constantsIndex;
      tempArr.forEach((element, index) => {
        if (element.labelName === t("constants")) {
          constantsIndex = index;
        }
      });
      tempArr.splice(constantsIndex, 1);
    }
    setDataModelTabs(tempArr);
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
          {dataModelTabs?.map((element, index) => (
            <Tab
              icon={element.icon}
              className={styles.dataModelTab}
              label={element.label}
            />
          ))}
        </Tabs>
      </div>
      <div style={{ width: "82.5vw" }}>
        {dataModelTabs?.map((element, index) => (
          <TabPanel style={element?.style} value={value} index={index}>
            {element.component}
          </TabPanel>
        ))}
      </div>
    </div>
  );
}

export default DataModel;
