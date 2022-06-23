import React, { useEffect, useState } from "react";
import { Checkbox, Select, MenuItem } from "@material-ui/core";
import styles from "./index.module.css";
import { getVariableType } from "../../../../../../../utility/ProcessSettings/Triggers/getVariableType";

function ReverseMappingDataStrip(props) {
  const {
    dropdownOptions,
    variableName,
    variableType,
    menuProps,
    mappedFieldValue,
    isVariableCheckedValue,
  } = props;
  const [isVariableChecked, setIsVariableChecked] = useState(false);
  const [filteredDropdownOptions, setFilteredDropdownOptions] = useState([]);
  const [mappedVariable, setMappedVariable] = useState("");

  // Function that runs when the mappedFieldValue and isVariableCheckedValue changes.
  useEffect(() => {
    if (mappedFieldValue) {
      setMappedVariable(mappedFieldValue);
    }
    if (isVariableCheckedValue) {
      setIsVariableChecked(isVariableCheckedValue);
    }
  }, [mappedFieldValue, isVariableCheckedValue]);

  // Function that runs when either dropdown options change or variable type changes.
  useEffect(() => {
    if (dropdownOptions) {
      const filteredOptions =
        dropdownOptions &&
        dropdownOptions.filter((element) => {
          if (
            element.paramType === variableType ||
            element.paramIndex === "-998" ||
            element.paramIndex === "-999"
          ) {
            return element;
          }
        });
      setFilteredDropdownOptions(filteredOptions);
    }
  }, [dropdownOptions, variableType]);
  return (
    <div className={styles.flexRow}>
      <Checkbox
        checked={isVariableChecked}
        onChange={() =>
          setIsVariableChecked((prevData) => {
            return !prevData;
          })
        }
      />
      <p className={styles.parameterText}>{variableName}</p>
      <p className={styles.parameterText}>{getVariableType(variableType)}</p>
      <p className={styles.equals}>=</p>
      <Select
        disabled={!isVariableChecked}
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
                key={element.paramIndex}
                value={element.paramIndex}
              >
                {element.paramName}
              </MenuItem>
            );
          })}
      </Select>
    </div>
  );
}

function ReverseMapping(props) {
  const {
    reverseMappingData,
    forwardMappingData,
    menuProps,
    reverseMapping,
    parameterData,
  } = props;
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [mappingData, setMappingData] = useState([]); // State that maps the final data.

  const faultValues = [
    { paramIndex: "-998", paramName: "FaultId" },
    { paramIndex: "-999", paramName: "FaultDesc" },
  ];

  // Function that changes when the forwardMappingData changes.
  useEffect(() => {
    if (forwardMappingData) {
      let reverseMappingOptions = [];
      forwardMappingData &&
        forwardMappingData.forEach((element) => {
          const dataObj = {
            paramIndex: element.paramIndex,
            paramName: element.ParamName,
            paramType: element.ParamType,
          };
          reverseMappingOptions.push(dataObj);
        });

      faultValues &&
        faultValues.forEach((element) => {
          reverseMappingOptions.push(element);
        });
      setDropdownOptions(reverseMappingOptions);
    }
  }, [forwardMappingData]);

  // Function that runs when the reverseMappingData and reverseMapping changes.
  useEffect(() => {
    let mapping = [];
    reverseMappingData &&
      reverseMappingData.forEach((mappingElement) => {
        const newObj = {
          dataStructId: null,
          methodIndex: null,
          paramIndex: null,
          mapType: null,
          mapField: mappingElement.VariableName,
          mapFieldType: mappingElement.VariableScope,
          mapVarFieldId: null,
          mapVariableId: mappingElement.VariableId,
          VariableType: mappingElement.VariableType,
          IsVariableChecked: false,
        };
        mapping.push(newObj);
        let mappingDataArr = [];
        reverseMapping &&
          reverseMapping.forEach((mappingElement) => {
            mapping &&
              mapping.forEach((element) => {
                if (mappingElement.mapField === element.mapField) {
                  element.dataStructId = mappingElement.dataStructId;
                  element.methodIndex = mappingElement.methodIndex;
                  element.paramIndex = mappingElement.paramIndex;
                  element.IsVariableChecked = true;
                  element.mapType = mappingElement.mapType;
                  element.mapField = element.mapField;
                  element.mapFieldType = element.mapFieldType;
                  element.mapVarFieldId = mappingElement.mapVarFieldId;
                  element.mapVariableId = element.mapVariableId;
                  element.VariableType = element.VariableType;
                }
              });
          });

        setMappingData(mapping);
      });
  }, [reverseMappingData, reverseMapping]);

  return (
    <div style={{ overflowY: "scroll", height: "300px" }}>
      {mappingData &&
        mappingData.map((element) => {
          return (
            <div className={styles.flexRow}>
              <ReverseMappingDataStrip
                variableName={element.mapField}
                variableType={element.VariableType}
                dropdownOptions={dropdownOptions}
                forwardMappingData={forwardMappingData}
                menuProps={menuProps}
                mappedFieldValue={element.paramIndex}
                isVariableCheckedValue={element.IsVariableChecked}
              />
            </div>
          );
        })}
    </div>
  );
}

export default ReverseMapping;
