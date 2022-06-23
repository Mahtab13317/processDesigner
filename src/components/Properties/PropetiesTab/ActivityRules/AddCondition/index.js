import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import { Select, MenuItem } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { useGlobalState } from "state-pool";
import {
  conditionalBooleanOperator,
  conditionalOperator,
  conditionalTextOperator,
  logicalOperatorOptions,
} from "../CommonFunctionCall";
import {
  STRING_VARIABLE_TYPE,
  BOOLEAN_VARIABLE_TYPE,
  RULES_ALWAYS_CONDITION,
  ADD_CONDITION_NO_LOGICALOP_VALUE,
  RULES_OTHERWISE_CONDITION,
  RTL_DIRECTION,
} from "../../../../../Constants/appConstants";
import CustomizedDropdown from "../../../../../UI/Components_With_ErrrorHandling/Dropdown";

function AddCondition(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const {
    index,
    addNewCondition,
    disabled,
    showDelIcon,
    localRuleData,
    setLocalRuleData,
    isRuleBeingCreated,
    setIsRuleBeingModified,
    isProcessReadOnly,
    checkValidation,
    setCheckValidation,
    ruleConditionErrors,
    setRuleConditionErrors,
    isAlwaysRule,
  } = props;
  const [loadedProcessData] = useGlobalState("loadedProcessData");
  const variableData = loadedProcessData.Variable;
  const [variableType, setVariableType] = useState("");
  const [param1, setParam1] = useState(""); // State to store value for param 1 dropdown.
  const [param2, setParam2] = useState(""); // State to store value for param 2 dropdown.
  const [selectedOperator, setSelectedOperator] = useState("0"); // State to store value for operator dropdown.
  const [selectedLogicalOperator, setSelectedLogicalOperator] = useState(
    ADD_CONDITION_NO_LOGICALOP_VALUE
  ); // State to store value for logical operator dropdown.
  const [conditionalDropdown, setConditionalDropdown] =
    useState(conditionalOperator); // State to store the dropdown operators for conditional operator.
  const [param1DropdownOptions, setParam1DropdownOptions] = useState([]); // State to store the dropdown options for parameter 1.
  const [logicalOperator] = useState(logicalOperatorOptions); // State to store the dropdown options for logical operator.
  const [param2DropdownOptions, setParam2DropdownOptions] = useState([]); // State to store the dropdown options for parameter 2.

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

  // Function that runs when the component renders.
  useEffect(() => {
    if (variableData) {
      setParam1DropdownOptions(variableData);
      setParam2DropdownOptions(variableData);
    }
  }, []);

  // Function that runs when the variableType state changes.
  useEffect(() => {
    param1DropdownOptions &&
      param1DropdownOptions.forEach((element) => {
        if (element.VariableName === localRuleData.ruleCondList[index].param1) {
          setVariableType(element.VariableType);
        }
      });
    fillOperatorValues();
    const filteredParam2Options =
      param1DropdownOptions &&
      param1DropdownOptions.filter((element) => {
        if (element.VariableType === variableType) {
          return element;
        }
      });
    setParam2DropdownOptions(filteredParam2Options);
  }, [variableType, localRuleData.ruleCondList]);

  // Function to fill operator values based on the selected param1.
  const fillOperatorValues = () => {
    if (+variableType === STRING_VARIABLE_TYPE) {
      setConditionalDropdown(conditionalTextOperator);
    } else if (+variableType === BOOLEAN_VARIABLE_TYPE) {
      setConditionalDropdown(conditionalBooleanOperator);
    } else {
      setConditionalDropdown(conditionalOperator);
    }
  };

  // Function that handles the change when the user selects the param 1 dropdown.
  const handleParam1Value = (event) => {
    setParam1(event.target.value);
    if (isRuleBeingCreated === false) {
      setIsRuleBeingModified(true);
    }
    let varType, extObjId, varFieldId, variableId;
    param1DropdownOptions.map((value) => {
      if (value.VariableName === event.target.value) {
        varType = value.VariableType;
        extObjId = value.ExtObjectId;
        varFieldId = value.VariableFieldId;
        variableId = value.VariableId;
        setVariableType(value.VariableType);
      }
    });
    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      temp.ruleCondList[index].param1 = event.target.value;
      temp.ruleCondList[index].extObjID1 = extObjId;
      temp.ruleCondList[index].VarFieldId_1 = varFieldId;
      temp.ruleCondList[index].VariableId_1 = variableId;
      return temp;
    });
  };

  // Function that handles the change of the operator.
  const onSelectOperator = (event) => {
    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      temp.ruleCondList[index].operator = event.target.value;
      return temp;
    });
    setSelectedOperator(event.target.value);
    if (isRuleBeingCreated === false) {
      setIsRuleBeingModified(true);
    }
  };

  // Function that handles the change of the param 2 dropdown.
  const handleParam2Value = (event) => {
    let extObjId, varFieldId, variableId;
    param1DropdownOptions.map((value) => {
      if (value.VariableName === event.target.value) {
        extObjId = value.ExtObjectId;
        varFieldId = value.VariableFieldId;
        variableId = value.VariableId;
      }
    });

    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      temp.ruleCondList[index].param2 = event.target.value;
      temp.ruleCondList[index].extObjID2 = extObjId;
      temp.ruleCondList[index].VarFieldId_2 = varFieldId;
      temp.ruleCondList[index].VariableId_2 = variableId;
      return temp;
    });

    setParam2(event.target.value);
    if (isRuleBeingCreated === false) {
      setIsRuleBeingModified(true);
    }
  };

  // Function that handles the change in the logical operator.
  const onSelectLogicalOperator = (event) => {
    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      temp.ruleCondList[index].logicalOp = event.target.value;
      return temp;
    });
    setSelectedLogicalOperator(event.target.value);
    addNewCondition(
      event.target.value,
      index,
      localRuleData.ruleCondList.length
    );
    if (isRuleBeingCreated === false) {
      setIsRuleBeingModified(true);
    }
  };

  // Function that runs when the user deletes a condition.
  const deleteRow = () => {
    const temp = { ...localRuleData };
    temp.ruleCondList.splice(index, 1);
    setLocalRuleData(temp);
    if (!isRuleBeingCreated) {
      setIsRuleBeingModified(true);
    }
  };

  // Function that runs when the Rule condition data changes.
  useEffect(() => {
    setParam1(localRuleData.ruleCondList[index].param1);
    setParam2(localRuleData.ruleCondList[index].param2);
    setSelectedLogicalOperator(localRuleData.ruleCondList[index].logicalOp);
    if (
      localRuleData.ruleCondList[index].param1 === RULES_ALWAYS_CONDITION ||
      localRuleData.ruleCondList[index].param1 === RULES_OTHERWISE_CONDITION
    ) {
      setSelectedOperator("");
    } else {
      setSelectedOperator(localRuleData.ruleCondList[index].operator);
    }
  }, [localRuleData.ruleCondList]);

  return (
    <div>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.addNewRule
            : styles.addNewRule
        }
      >
        <CustomizedDropdown
          id="AR_Param1_Dropdown"
          disabled={isProcessReadOnly || disabled}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.dropdown
              : styles.dropdown
          }
          value={param1}
          onChange={(event) => handleParam1Value(event)}
          validationBoolean={checkValidation}
          validationBooleanSetterFunc={setCheckValidation}
          showAllErrors={ruleConditionErrors}
          showAllErrorsSetterFunc={setRuleConditionErrors}
          isNotMandatory={isAlwaysRule}
        >
          {param1DropdownOptions &&
            param1DropdownOptions.map((element) => {
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
        </CustomizedDropdown>

        <CustomizedDropdown
          id="AR_Rule_Condition_Dropdown"
          disabled={isProcessReadOnly || disabled}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.dropdown
              : styles.dropdown
          }
          value={selectedOperator}
          onChange={(event) => onSelectOperator(event)}
          validationBoolean={checkValidation}
          validationBooleanSetterFunc={setCheckValidation}
          showAllErrors={ruleConditionErrors}
          showAllErrorsSetterFunc={setRuleConditionErrors}
          isNotMandatory={isAlwaysRule}
        >
          {conditionalDropdown &&
            conditionalDropdown.map((element) => {
              return (
                <MenuItem
                  className={styles.menuItemStyles}
                  key={element.value}
                  value={element.value}
                >
                  {element.label}
                </MenuItem>
              );
            })}
        </CustomizedDropdown>

        <CustomizedDropdown
          id="AR_Param2_Dropdown"
          disabled={isProcessReadOnly || disabled}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.dropdown
              : styles.dropdown
          }
          value={param2}
          onChange={(event) => handleParam2Value(event)}
          validationBoolean={checkValidation}
          validationBooleanSetterFunc={setCheckValidation}
          showAllErrors={ruleConditionErrors}
          showAllErrorsSetterFunc={setRuleConditionErrors}
          isNotMandatory={isAlwaysRule}
        >
          {param2DropdownOptions &&
            param2DropdownOptions.map((element) => {
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
        </CustomizedDropdown>

        <Select
          id="AR_Logical_Operator_Dropdown"
          disabled={isProcessReadOnly || disabled}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.dropdown
              : styles.dropdown
          }
          MenuProps={menuProps}
          value={selectedLogicalOperator}
          onChange={(event) => onSelectLogicalOperator(event)}
        >
          {logicalOperator &&
            logicalOperator.map((element) => {
              return (
                <MenuItem
                  className={styles.menuItemStyles}
                  key={element.value}
                  value={element.value}
                >
                  {t(element.label)}
                </MenuItem>
              );
            })}
        </Select>

        <div className={styles.deleteIcon}>
          {showDelIcon && !isProcessReadOnly ? (
            <DeleteOutlinedIcon id="AR_Delete_Row_Button" onClick={deleteRow} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AddCondition;
