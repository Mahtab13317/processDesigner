import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { useTranslation } from "react-i18next";
import { Tab, Tabs } from "@material-ui/core";
import ForwardMapping from "./ForwardMapping";
import ReverseMapping from "./ReverseMapping";
import { TabPanel } from "../../../../../ProcessSettings";
import {
  FORWARD_MAPPING,
  REVERSE_MAPPING,
} from "../../../../../../Constants/appConstants";

function ParameterMappingModal(props) {
  let { t } = useTranslation();
  const {
    dropdownOptions,
    functionSelected,
    functionMethodIndex,
    functionOptions,
    parameterMapping,
  } = props;
  const [value, setValue] = useState(0);
  const [parameterMappingData, setParameterMappingData] = useState([]);
  const [forwardMapping, setForwardMapping] = useState([]);
  const [reverseMapping, setReverseMapping] = useState([]);
  const [parameterData, setParameterData] = useState([]);

  const menuProps = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    getContentAnchorEl: null,
  };

  // Function to handle tab change.
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Function that runs when the function selected changes.
  useEffect(() => {
    if (parameterMapping && parameterMapping.length > 0) {
      setParameterMappingData(parameterMapping);
    }
    let parameters = [];
    let newParametersData = [];
    functionOptions &&
      functionOptions.forEach((element) => {
        if (
          element.value === functionSelected &&
          element.methodIndex === functionMethodIndex
        ) {
          parameters = element.parameters;
        }
      });
    parameters &&
      parameters.forEach((element) => {
        const newObj = {
          dataStructId: element.dataStructId,
          methodIndex: null,
          paramIndex: element.ParamIndex,
          ParamName: element.ParamName,
          ParamType: element.ParamType,
          mapType: null,
          mapField: null,
          mapFieldType: null,
          mapVarFieldId: null,
          mapVariableId: null,
        };
        newParametersData.push(newObj);
      });
    setParameterData(newParametersData);
    let forwardMapping =
      parameterMapping &&
      parameterMapping.filter((element) => {
        if (element.mapType === FORWARD_MAPPING) {
          return element;
        }
      });
    let reverseMappingArr =
      parameterMapping &&
      parameterMapping.filter((element) => {
        if (element.mapType === REVERSE_MAPPING) {
          return element;
        }
      });
    setReverseMapping(reverseMappingArr);
    setForwardMapping(forwardMapping);
  }, [functionSelected]);

  return (
    <div className={styles.flexColumn}>
      <h3>{t("parametersMapping")}</h3>
      <Tabs value={value} onChange={handleChange}>
        <Tab className={styles.dataModelTab} label={t("forwardMapping")} />
        <Tab className={styles.dataModelTab} label={t("reverseMapping")} />
      </Tabs>
      <div>
        <TabPanel
          style={{ backgroundColor: "#F8F8F8" }}
          value={value}
          index={0}
        >
          <ForwardMapping
            forwardMappingData={parameterData}
            parameterData={parameterData}
            functionOptions={functionOptions}
            dropdownOptions={dropdownOptions}
            menuProps={menuProps}
            parameterMappingData={parameterMappingData}
          />
        </TabPanel>
        <TabPanel
          style={{ backgroundColor: "#F8F8F8" }}
          value={value}
          index={1}
        >
          <ReverseMapping
            reverseMappingData={dropdownOptions}
            menuProps={menuProps}
            forwardMappingData={parameterData}
            reverseMapping={reverseMapping} // Data that is being mapped.
          />
        </TabPanel>
      </div>
    </div>
  );
}

export default ParameterMappingModal;
