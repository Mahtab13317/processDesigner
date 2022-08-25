import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import { Select, MenuItem } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { useGlobalState } from "state-pool";
import {
  BOOLEAN_VARIABLE_TYPE,
  RULES_ALWAYS_CONDITION,
  ADD_CONDITION_NO_LOGICALOP_VALUE,
  STRING_VARIABLE_TYPE,
} from "../../../../Constants/appConstants";
import {
  conditionalBooleanOperator,
  conditionalOperator,
  conditionalTextOperator,
  logicalOperatorOptions,
} from "../ActivityRules/CommonFunctionCall";
import {
  getLogicalOperator,
  getLogicalOperatorReverse,
} from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

function SetFilterConditionStrip(props) {
  let { t } = useTranslation();
  const [localLoadedProcess] = useGlobalState("variableDefinition");
  const [variableType, setVariableType] = useState("");
  const [param1, setParam1] = useState(""); // State to store value for param 1 dropdown.
  const [param2, setParam2] = useState(""); // State to store value for param 2 dropdown.
  const [selectedOperator, setSelectedOperator] = useState(""); // State to store value for operator dropdown.
  const [selectedLogicalOperator, setSelectedLogicalOperator] = useState(
    ADD_CONDITION_NO_LOGICALOP_VALUE
  ); // State to store value for logical operator dropdown.
  const [conditionalDropdown, setConditionalDropdown] =
    useState(conditionalOperator); // State to store the dropdown operators for conditional operator.

  const [param1DropdownOptions, setParam1DropdownOptions] = useState(); // State to store the dropdown options for parameter 1.
  const [logicalOperator, setLogicalOperator] = useState("+"); // State to store the dropdown options for logical operator.
  const [param2DropdownOptions, setParam2DropdownOptions] = useState(); // State to store the dropdown options for parameter 2.

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

  const {
    localData,
    streamsData,
    index,
    setStreamData,
    newRow,
    parentIndex,
    showDelIcon,
    disabled,
  } = props;

  // Function that runs when the component renders.
  useEffect(() => {
    if (localLoadedProcess) {
      setParam1DropdownOptions(localLoadedProcess);
      setParam2DropdownOptions(localLoadedProcess);
    }
  }, []);

  const deleteRow = () => {
    setStreamData((prevData) => {
      let temp = [...prevData];
      temp[parentIndex].RuleConditions.splice(index, 1);
      return temp;
    });

    // if (!showDelIcon) {
    //   setStreamData((prevData) => {
    //     let temp = [...prevData];
    //     temp[parentIndex].RuleConditions[0].LogicalOp = "3";
    //     return temp;
    //   });
    // }
  };

  useEffect(() => {
    setParam1(localData.Param1);
    // onSelectParam1(localData.param1);
    setParam2(localData.Param2);
    setLogicalOperator(getLogicalOperatorReverse(localData.LogicalOp));
    setSelectedOperator(localData.Operator);
  }, [localData]);

  console.log('parentIndex', props.parentIndex, logicalOperator);
  const handleParam1Value = (event) => {
    setParam1(event.target.value);
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

    setStreamData((prevData) => {
      let temp = [...prevData];
      temp[parentIndex].RuleConditions[index].Param1 = event.target.value;
      temp[parentIndex].RuleConditions[index].ExtObjID1 = extObjId;
      temp[parentIndex].RuleConditions[index].VarFieldId1 = varFieldId;
      temp[parentIndex].RuleConditions[index].VariableId1 = variableId;
      return temp;
    });
  };

  const onSelectOperator = (event) => {
    setStreamData((prevData) => {
      let temp = [...prevData];
      temp[parentIndex].RuleConditions[index].Operator = event.target.value;
      return temp;
    });
    setSelectedOperator(event.target.value);
  };
  const handleParam2Value = (event) => {
    let extObjId, varFieldId, variableId;
    param1DropdownOptions.map((value) => {
      if (value.VariableName === event.target.value) {
        extObjId = value.ExtObjectId;
        varFieldId = value.VariableFieldId;
        variableId = value.VariableId;
      }
    });

    setStreamData((prevData) => {
      let temp = [...prevData];
      temp[parentIndex].RuleConditions[index].Param2 = event.target.value;
      temp[parentIndex].RuleConditions[index].ExtObjID2 = extObjId;
      temp[parentIndex].RuleConditions[index].VarFieldId2 = varFieldId;
      temp[parentIndex].RuleConditions[index].VariableId2 = variableId;
      return temp;
    });

    setParam2(event.target.value);
  };
  const onSelectLogicalOperator = (e) => {
    if (e.target.innerText === "+") {
      setLogicalOperator("AND");
    } else if (e.target.innerText === "AND") {
      setLogicalOperator("or");
    } else if (e.target.innerText === "OR") {
      setLogicalOperator("AND");
    }

    setStreamData((prevData) => {
      let temp = [...prevData];
      temp[parentIndex].RuleConditions[index].LogicalOp = getLogicalOperator(
        e.target.innerText
      );
      return temp;
    });
    newRow(e.target.innerText, props.parentIndex);
  };

  return (
    <div>
      <div className={styles.addNewRule}>
        <Select
          data-testid="select"
          //   disabled={isProcessReadOnly}
          className={styles.dropdown}
          MenuProps={menuProps}
          value={param1}
          onChange={(event) => handleParam1Value(event)}
          //   disabled={disabled}
        >
          {param1DropdownOptions &&
            param1DropdownOptions.map((element) => {
              return (
                <MenuItem
                  className={styles.menuItemStyles}
                  key={element.VariableName}
                  value={element.VariableName}
                  data-testid="select-option"
                >
                  {element.VariableName}
                </MenuItem>
              );
            })}
        </Select>

        <Select
          id="AR_Rule_Condition_Dropdown"
          //   disabled={isProcessReadOnly}
          className={styles.dropdown}
          MenuProps={menuProps}
          value={selectedOperator}
          onChange={(event) => onSelectOperator(event)}
          disabled={disabled}
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
        </Select>

        {/* <Select
          id="AR_Param2_Dropdown"
          //   disabled={isProcessReadOnly}
          className={styles.dropdown}
          MenuProps={menuProps}
          value={param2}
          onChange={(event) => handleParam2Value(event)}
          disabled={disabled}
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
        </Select> */}

        <button
          className={styles.toogleBtn}
          onClick={(e) => onSelectLogicalOperator(e)}
          disabled={disabled}
          type="button"
        >
          {t(logicalOperator)}
        </button>
{/* -------------- */}
        <Select
          data-testid="select"
          //   disabled={isProcessReadOnly}
          className={styles.dropdown}
          MenuProps={menuProps}
          value={param1}
          onChange={(event) => handleParam1Value(event)}
          //   disabled={disabled}
        >
          {param1DropdownOptions &&
            param1DropdownOptions.map((element) => {
              return (
                <MenuItem
                  className={styles.menuItemStyles}
                  key={element.VariableName}
                  value={element.VariableName}
                  data-testid="select-option"
                >
                  {element.VariableName}
                </MenuItem>
              );
            })}
        </Select>
{/* ----------------- */}
        <div className={styles.deleteIcon}>
          {props.showDelIcon ? (
            <DeleteOutlinedIcon id="AR_Delete_Row_Button" onClick={deleteRow} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SetFilterConditionStrip;
