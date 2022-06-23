import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import { Select, MenuItem } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { store, useGlobalState } from "state-pool";
import {
  STRING_VARIABLE_TYPE,
  BOOLEAN_VARIABLE_TYPE,
  RULES_ALWAYS_CONDITION,
  ADD_CONDITION_NO_LOGICALOP_VALUE,
  propertiesLabel,
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
// import CustomSelect from "./CustomSelect";
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";

function AddCondition(props) {
  let { t } = useTranslation();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
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
  const dispatch = useDispatch();

  const menuProps = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    style: {
      maxHeight: 400,
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
    if (localLoadedProcessData) {
      setParam1DropdownOptions(localLoadedProcessData?.Variable);
      setParam2DropdownOptions(localLoadedProcessData?.Variable);
    }
  }, []);

  const deleteRow = () => {
    let temp = { ...streamsData };
    if (
      streamsData.ActivityProperty.streamInfo.esRuleList[parentIndex]
        .ruleCondList.length -
        1 ==
      index
    ) {
      temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
        index - 1
      ].logicalOp = "3";
    }

    temp.ActivityProperty.streamInfo.esRuleList[
      parentIndex
    ].ruleCondList.splice(index, 1);

    setStreamData(temp);
  };

  useEffect(() => {
    if (localData) {
      setParam1(localData.param1);
      setParam2(localData.param2);
      setLogicalOperator(getLogicalOperatorReverse(localData.logicalOp));
      setSelectedOperator(localData.operator);
    }
  }, [localData]);

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

    let temp = { ...streamsData };
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].param1 = event.target.value;
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].extObjID1 = extObjId;
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].varFieldId_1 = varFieldId;
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].variableId_1 = variableId;
    setStreamData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.streams]: { isModified: true, hasError: false },
      })
    );
  };

  const onSelectOperator = (event) => {
    let temp = { ...streamsData };
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].operator = event.target.value;
    setStreamData(temp);
    setSelectedOperator(event.target.value);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.streams]: { isModified: true, hasError: false },
      })
    );
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

    let temp = { ...streamsData };
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].param2 = event.target.value;
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].extObjID2 = extObjId;
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].varFieldId_2 = varFieldId;
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].variableId_2 = variableId;
    setStreamData(temp);

    setParam2(event.target.value);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.streams]: { isModified: true, hasError: false },
      })
    );
  };
  const onSelectLogicalOperator = (e) => {
    let newText = "";
    if (e.target.innerText === "+") {
      newText = "AND";
      setLogicalOperator("AND");
    } else if (e.target.innerText === "AND") {
      newText = "or";
      setLogicalOperator("or");
    } else if (e.target.innerText === "OR") {
      newText = "AND";
      setLogicalOperator("AND");
    }
    let temp = { ...streamsData };
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].logicalOp = getLogicalOperator(newText);
    setStreamData(temp);
    newRow(e.target.innerText, props.parentIndex);
  };

  return (
    <div>
      <div className={styles.addNewRule}>
        <CustomizedDropdown
          inputProps={{ "data-testid": "select" }}
          className={styles.dropdown}
          MenuProps={menuProps}
          value={param1}
          onChange={(event) => handleParam1Value(event)}
          disabled={disabled}
        >
          {param1DropdownOptions &&
            param1DropdownOptions.map((element) => {
              return (
                <MenuItem
                  className={styles.menuItemStyles}
                  key={element.VariableName}
                  value={element.VariableName}
                  // data-testid="select-option"
                  inputProps={{ "data-testid": "selectOption" }}
                >
                  {element.VariableName}
                </MenuItem>
              );
            })}
        </CustomizedDropdown>

        <CustomizedDropdown
          id="AR_Rule_Condition_Dropdown"
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
        </CustomizedDropdown>

        <CustomizedDropdown
          id="AR_Param2_Dropdown"
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
        </CustomizedDropdown>

        <button
          className={styles.toogleBtn}
          onClick={(e) => onSelectLogicalOperator(e)}
          disabled={disabled}
          type="button"
          data-testid="logicalBtn"
          id="logicalOperatorBtn"
        >
          {t(logicalOperator)}
        </button>

        <div className={styles.deleteIcon}>
          {showDelIcon ? (
            <DeleteOutlinedIcon id="AR_Delete_Row_Button" onClick={deleteRow} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AddCondition;
