import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import { useTranslation } from "react-i18next";
import { Select, MenuItem } from "@material-ui/core";
import { tableMappingData } from "./TableMappingData";
import { RTL_DIRECTION } from "../../../../../../Constants/appConstants";

function TableRelationshipStep(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const { childTableName, childVariableName } = props;
  const [dropdownOptions, setDropdownOptions] = useState(tableMappingData);
  const [parentTableName, setParentTableName] = useState("WF_Instrument_Table");
  const [selectedParentVariable, setSelectedParentVariable] = useState("");
  const [parentVariableOptions, setParentVariableOptions] = useState([]);

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

  // Function that runs when the component mounts.
  useEffect(() => {
    dropdownOptions.forEach((element) => {
      if (element.tableName === parentTableName) {
        const variableOptions = element.variables;
        setParentVariableOptions([...variableOptions]);
        setSelectedParentVariable(variableOptions[0]);
      }
    });
  }, []);

  // Function that handles the change in parent table name dropdown.
  const handleParentTableChange = (event) => {
    setParentTableName(event.target.value);
    dropdownOptions.forEach((element) => {
      if (element.tableName === event.target.value) {
        const variableOptions = element.variables;
        setParentVariableOptions([...variableOptions]);
        setSelectedParentVariable(variableOptions[0]);
      }
    });
  };

  // Function that handles the change in parent variable name dropdown.
  const handleVariableOnOpen = () => {
    if (parentTableName !== "") {
      dropdownOptions.forEach((element) => {
        if (element.tableName === parentTableName) {
          const variableOptions = element.variables;
          setParentVariableOptions([...variableOptions]);
        }
      });
    }
  };

  return (
    <div className={styles.mainDiv}>
      <div className={styles.parentTableDiv}>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.parentTableText
              : styles.parentTableText
          }
        >
          {t("parentTable")}
        </p>
        <Select
          MenuProps={menuProps}
          value={parentTableName}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.parentTableDropdown
              : styles.parentTableDropdown
          }
          onChange={handleParentTableChange}
        >
          {dropdownOptions &&
            dropdownOptions.map((d) => {
              return (
                <MenuItem
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.menuItemStyles
                      : styles.menuItemStyles
                  }
                  value={d.tableName}
                >
                  {d.tableName}
                </MenuItem>
              );
            })}
        </Select>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.parentVariable
              : styles.parentVariable
          }
        >
          {t("variable")}
        </p>
        <Select
          MenuProps={menuProps}
          value={selectedParentVariable}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.parentTableDropdown
              : styles.parentTableDropdown
          }
          onOpen={handleVariableOnOpen}
          onChange={(event) => setSelectedParentVariable(event.target.value)}
        >
          {parentVariableOptions &&
            parentVariableOptions.map((d) => {
              return (
                <MenuItem
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.menuItemStyles
                      : styles.menuItemStyles
                  }
                  value={d}
                >
                  {d}
                </MenuItem>
              );
            })}
        </Select>
      </div>
      <div className={styles.childTableDiv}>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.childTableText
              : styles.childTableText
          }
        >
          {t("childTable")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.childTableValue
              : styles.childTableValue
          }
        >
          {childTableName}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.parentVariable
              : styles.parentVariable
          }
        >
          {t("variable")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.childVariableValue
              : styles.childVariableValue
          }
        >
          {childVariableName}
        </p>
      </div>
    </div>
  );
}

export default TableRelationshipStep;
