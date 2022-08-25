import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { Checkbox, Select, MenuItem } from "@material-ui/core";
import { getVariableType } from "../../../../../../../utility/ProcessSettings/Triggers/getVariableType";
import { FORWARD_MAPPING } from "../../../../../../../Constants/appConstants";

function MappingData(props) {
  const {
    mappedFieldValue,
    dropdownOptions,
    paramName,
    paramType,
    menuProps,
    parameterMappingData,
    isParamCheckedValue,
  } = props;
  const [mappedVariable, setMappedVariable] = useState("");
  const [filteredDropdownOptions, setFilteredDropdownOptions] = useState([]);
  const [isParamChecked, setIsParamChecked] = useState(false);

  // Function that runs when either dropdown options change or param type changes.
  useEffect(() => {
    if (dropdownOptions) {
      const filteredOptions =
        dropdownOptions &&
        dropdownOptions.filter((element) => {
          if (element.VariableType === paramType) {
            return element;
          }
        });

      setFilteredDropdownOptions(filteredOptions);
    }
  }, [dropdownOptions, paramType]);

  useEffect(() => {
    if (isParamCheckedValue) {
      setIsParamChecked(isParamCheckedValue);
    }
    let forwardMapping =
      parameterMappingData &&
      parameterMappingData.filter((element) => {
        if (element.mapType === FORWARD_MAPPING) {
          return element;
        }
      });
    console.log("FM", "MAPPING", forwardMapping, parameterMappingData);
  }, []);

  useEffect(() => {
    if (mappedFieldValue) {
      setMappedVariable(mappedFieldValue);
    }
  }, [mappedFieldValue]);

  return (
    <div className={styles.flexRow}>
      <Checkbox
        checked={isParamChecked}
        onChange={() =>
          setIsParamChecked((prevData) => {
            return !prevData;
          })
        }
      />
      <p className={styles.parameterText}>{paramName}</p>
      <p className={styles.parameterText}>{getVariableType(paramType)}</p>
      <p className={styles.equals}>=</p>
      <Select
        disabled={!isParamChecked}
        id="ES_Operation_Type_Dropdown"
        className={styles.typeDropdown}
        MenuProps={menuProps}
        value={mappedVariable}
        onChange={(event) => setMappedVariable(event.target.value)}
      >
        {filteredDropdownOptions &&
          filteredDropdownOptions.map((element) => {
            return (
              <MenuItem
                className={styles.menuItemStyles}
                key={element.VariableName}
                value={element.VariableName}
              >
                {element.VariableName}
              </MenuItem>
            );
          })}
      </Select>
    </div>
  );
}

function ForwardMapping(props) {
  const {
    forwardMappingData,
    parameters,
    functionOptions,
    dropdownOptions,
    menuProps,
    parameterMappingData,
  } = props;
  const [mappingData, setMappingData] = useState([]);
  // const getParamName = (paramIndex) => {
  //   let paramName = "";
  //   parameters &&
  //     parameters.forEach((element) => {
  //       if (element.ParamIndex === paramIndex) {
  //         paramName = element.ParamName;
  //       }
  //     });
  //   return paramName;
  // };

  // const getParamType = (variableName) => {
  //   let paramType = "";
  //   dropdownOptions &&
  //     dropdownOptions.forEach((element) => {
  //       if (element.VariableName === variableName) {
  //         paramType = element.VariableType;
  //       }
  //     });
  //   return paramType;
  // };

  useEffect(() => {
    let arr = [];
    parameterMappingData &&
      parameterMappingData.forEach((paramElement) => {
        if (paramElement.mapType === FORWARD_MAPPING) {
          forwardMappingData &&
            forwardMappingData.forEach((element) => {
              if (paramElement.paramIndex === element.paramIndex) {
                const newObj = {
                  dataStructId: element.dataStructId,
                  methodIndex: paramElement.methodIndex,
                  paramIndex: element.paramIndex,
                  mapType: paramElement.mapType,
                  mapField: paramElement.mapField,
                  mapFieldType: paramElement.mapFieldType,
                  mapVarFieldId: paramElement.mapVarFieldId,
                  mapVariableId: paramElement.mapVariableId,
                  ParamName: element.ParamName,
                  ParamType: element.ParamType,
                  IsParamChecked: true,
                };
                arr.push(newObj);
              }
            });
        }
      });

    let parameterMappingDataIndexes = [];
    let arrIndexes = [];
    let remainingElementIndexes = [];
    forwardMappingData &&
      forwardMappingData.forEach((paramElement) => {
        parameterMappingDataIndexes.push(paramElement.paramIndex);
      });
    arr &&
      arr.forEach((element) => {
        arrIndexes.push(element.paramIndex);
      });
    remainingElementIndexes = parameterMappingDataIndexes.filter(
      (d) => !arrIndexes.includes(d)
    );
    forwardMappingData &&
      forwardMappingData.forEach((mappingElement) => {
        remainingElementIndexes &&
          remainingElementIndexes.forEach((element) => {
            if (mappingElement.paramIndex === element) {
              const newObj = {
                dataStructId: mappingElement.dataStructId,
                methodIndex: mappingElement.methodIndex,
                paramIndex: mappingElement.paramIndex,
                mapType: mappingElement.mapType,
                mapField: mappingElement.mapField,
                mapFieldType: mappingElement.mapFieldType,
                mapVarFieldId: mappingElement.mapVarFieldId,
                mapVariableId: mappingElement.mapVariableId,
                ParamName: mappingElement.ParamName,
                ParamType: mappingElement.ParamType,
                IsParamChecked: false,
              };
              arr.push(newObj);
            }
          });
      });
    setMappingData(arr);
  }, [parameterMappingData, forwardMappingData]);
  return (
    <div>
      {mappingData &&
        mappingData.map((element) => {
          return (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <MappingData
                dropdownOptions={dropdownOptions}
                // paramName={getParamName(element.paramIndex)}
                paramName={element.ParamName}
                paramType={element.ParamType}
                menuProps={menuProps}
                mappedFieldValue={element.mapField}
                parameterMappingData={parameterMappingData}
                isParamCheckedValue={element.IsParamChecked}
              />
            </div>
          );
        })}
    </div>
  );
}

export default ForwardMapping;
