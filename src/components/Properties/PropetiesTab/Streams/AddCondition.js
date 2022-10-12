import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import { MenuItem } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { store, useGlobalState } from "state-pool";
import {
  STRING_VARIABLE_TYPE,
  BOOLEAN_VARIABLE_TYPE,
  propertiesLabel,
  DATE_FORMAT,
  CONSTANT,
} from "../../../../Constants/appConstants";
import {
  conditionalBooleanOperator,
  conditionalOperator,
  conditionalTextOperator,
} from "../ActivityRules/CommonFunctionCall";
import {
  getLogicalOperator,
  getLogicalOperatorReverse,
} from "../../../../utility/CommonFunctionCall/CommonFunctionCall";
import SelectField from "../../../../UI/Components_With_ErrrorHandling/SelectField";
import { useDispatch } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";

function AddCondition(props) {
  let { t } = useTranslation();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  // code added on 23 Aug 2022 for BugId 114353
  const constantsData = localLoadedProcessData.DynamicConstant;
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData] = useGlobalState(
    loadedActivityPropertyData
  );
  const [param1, setParam1] = useState(""); // State to store value for param 1 dropdown.
  const [param2, setParam2] = useState(""); // State to store value for param 2 dropdown.
  const [selectedOperator, setSelectedOperator] = useState(""); // State to store value for operator dropdown.
  const [conditionalDropdown, setConditionalDropdown] = useState([]); // State to store the dropdown operators for conditional operator.
  const [param1DropdownOptions, setParam1DropdownOptions] = useState([]); // State to store the dropdown options for parameter 1.
  const [logicalOperator, setLogicalOperator] = useState("+"); // State to store the dropdown options for logical operator.
  const [param2DropdownOptions, setParam2DropdownOptions] = useState([]); // State to store the dropdown options for parameter 2.
  // code added on 23 Aug 2022 for BugId 114353
  const [variableType, setVariableType] = useState("");
  const [isParam2Const, setIsParam2Const] = useState(false); // State that tells whether constant option is selected in param2.
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
    let list = [];
    // code added on 23 Aug 2022 for BugId 114353
    constantsData?.forEach((element) => {
      let tempObj = {
        VariableName: element.ConstantName,
        VariableScope: "C",
      };
      list.push(tempObj);
    });
    localLoadedProcessData?.Variable?.filter(
      (el) => el.VariableType !== "11" || el.Unbounded !== "Y"
    )?.forEach((el) => {
      if (
        el.VariableScope === "M" ||
        el.VariableScope === "S" ||
        (el.VariableScope === "U" && checkForVarRights(el)) ||
        (el.VariableScope === "I" && checkForVarRights(el))
      ) {
        list.push(el);
      }
    });
    setParam1DropdownOptions(list);
  }, [localLoadedProcessData?.Variable, constantsData]);

  const checkForVarRights = (data) => {
    let temp = false;
    localLoadedActivityPropertyData?.ActivityProperty?.m_objDataVarMappingInfo?.dataVarList?.forEach(
      (item, i) => {
        if (item?.processVarInfo?.variableId === data.VariableId) {
          if (
            item?.m_strFetchedRights === "O" ||
            item?.m_strFetchedRights === "R"
          ) {
            temp = true;
          }
        }
      }
    );
    return temp;
  };

  const deleteRow = () => {
    let temp = { ...streamsData };
    if (
      temp?.ActivityProperty?.streamInfo?.esRuleList[parentIndex]?.status ===
      "added"
    ) {
      temp.ActivityProperty.streamInfo.esRuleList[parentIndex].status =
        "edited";
    }
    if (
      temp?.ActivityProperty?.streamInfo?.esRuleList[parentIndex]?.ruleCondList
        ?.length -
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
      if (localData.param1?.trim() !== "") {
        let tempList = [];
        // code added on 23 Aug 2022 for BugId 114353
        constantsData?.forEach((element) => {
          let tempObj = {
            VariableName: element.ConstantName,
            VariableScope: "C",
          };
          tempList.push(tempObj);
        });
        localLoadedProcessData?.Variable?.filter(
          (el) => el.VariableType !== "11" || el.Unbounded !== "Y"
        )?.forEach((el) => {
          if (
            el.VariableScope === "M" ||
            el.VariableScope === "S" ||
            (el.VariableScope === "U" && checkForVarRights(el)) ||
            (el.VariableScope === "I" && checkForVarRights(el))
          ) {
            tempList.push(el);
          }
        });
        setParam1(localData.param1);
        let varType;
        tempList?.forEach((value) => {
          if (value.VariableName === localData.param1) {
            varType = value.VariableType;
          }
        });
        let list = [];
        // code added on 23 Aug 2022 for BugId 114353
        constantsData?.forEach((element) => {
          let tempObj = {
            VariableName: element.ConstantName,
            VariableScope: "C",
          };
          list.push(tempObj);
        });
        localLoadedProcessData?.Variable?.filter(
          (el) => el.VariableType !== "11" || el.Unbounded !== "Y"
        ).forEach((el) => {
          if (
            el.VariableScope === "M" ||
            el.VariableScope === "S" ||
            (el.VariableScope === "U" && checkForVarRights(el)) ||
            (el.VariableScope === "I" && checkForVarRights(el))
          ) {
            let type = el.VariableType;
            if (+varType === +type) {
              list.push(el);
            }
          }
        });
        setParam2DropdownOptions(list);

        if (+varType === STRING_VARIABLE_TYPE) {
          setConditionalDropdown(conditionalTextOperator);
        } else if (+varType === BOOLEAN_VARIABLE_TYPE) {
          setConditionalDropdown(conditionalBooleanOperator);
        } else {
          setConditionalDropdown(conditionalOperator);
        }
        setParam2(localData.param2);
        setIsParam2Const(localData.type2 === "C");
        setSelectedOperator(localData.operator);
      } else {
        setParam1("");
        setParam2("");
        setSelectedOperator("");
      }
      setLogicalOperator(getLogicalOperatorReverse(localData.logicalOp));
    }
  }, [localData, streamsData]);

  const setDropdownVal = (paramVal) => {
    let varType;
    param1DropdownOptions?.forEach((value) => {
      if (value.VariableName === paramVal) {
        varType = value.VariableType;
      }
    });

    let list = [];
    // code added on 23 Aug 2022 for BugId 114353
    constantsData?.forEach((element) => {
      let tempObj = {
        VariableName: element.ConstantName,
        VariableScope: "C",
      };
      list.push(tempObj);
    });
    localLoadedProcessData?.Variable?.filter(
      (el) => el.VariableType !== "11" || el.Unbounded !== "Y"
    ).forEach((el) => {
      if (
        el.VariableScope === "M" ||
        el.VariableScope === "S" ||
        (el.VariableScope === "U" && checkForVarRights(el)) ||
        (el.VariableScope === "I" && checkForVarRights(el))
      ) {
        let type = el.VariableType;
        if (+varType === +type) {
          list.push(el);
        }
      }
    });
    setParam2DropdownOptions(list);

    if (+varType === STRING_VARIABLE_TYPE) {
      setConditionalDropdown(conditionalTextOperator);
    } else if (+varType === BOOLEAN_VARIABLE_TYPE) {
      setConditionalDropdown(conditionalBooleanOperator);
    } else {
      setConditionalDropdown(conditionalOperator);
    }
  };
  const handleParam1Value = (event) => {
    setParam1(event.target.value);
    let varScope, extObjId, varFieldId, variableId;
    param1DropdownOptions?.forEach((value) => {
      if (value.VariableName === event.target.value) {
        extObjId = value.ExtObjectId;
        varFieldId = value.VarFieldId;
        variableId = value.VariableId;
        varScope = value.VariableScope;
        // code added on 23 Aug 2022 for BugId 114353
        setVariableType(value.VariableType);
      }
    });
    setDropdownVal(event.target.value);
    let temp = { ...streamsData };
    if (
      temp?.ActivityProperty?.streamInfo?.esRuleList[parentIndex]?.status ===
      "added"
    ) {
      temp.ActivityProperty.streamInfo.esRuleList[parentIndex].status =
        "edited";
    }
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].param1 = event.target.value;
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].type1 = varScope;
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
    if (
      temp?.ActivityProperty?.streamInfo?.esRuleList[parentIndex]?.status ===
      "added"
    ) {
      temp.ActivityProperty.streamInfo.esRuleList[parentIndex].status =
        "edited";
    }
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
  const handleParam2Value = (event, isConstant) => {
    let varScope, extObjId, varFieldId, variableId;
    // code added on 23 Aug 2022 for BugId 114353
    if (isConstant) {
      extObjId = "0";
      varFieldId = "0";
      variableId = "0";
      varScope = "C";
    }
    param1DropdownOptions.map((value) => {
      if (value.VariableName === event.target.value) {
        extObjId = value.ExtObjectId;
        varFieldId = value.VarFieldId;
        variableId = value.VariableId;
        varScope = value.VariableScope;
      }
    });
    let temp = { ...streamsData };
    if (
      temp?.ActivityProperty?.streamInfo?.esRuleList[parentIndex]?.status ===
      "added"
    ) {
      temp.ActivityProperty.streamInfo.esRuleList[parentIndex].status =
        "edited";
    }
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].param2 = event.target.value;
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].type2 = varScope;
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
      newText = "OR";
      setLogicalOperator("OR");
    } else if (e.target.innerText === "OR") {
      newText = "AND";
      setLogicalOperator("AND");
    }
    let temp = { ...streamsData };
    if (
      temp?.ActivityProperty?.streamInfo?.esRuleList[parentIndex]?.status ===
      "added"
    ) {
      temp.ActivityProperty.streamInfo.esRuleList[parentIndex].status =
        "edited";
    }
    temp.ActivityProperty.streamInfo.esRuleList[parentIndex].ruleCondList[
      index
    ].logicalOp = getLogicalOperator(newText);
    setStreamData(temp);
    newRow(e.target.innerText, props.parentIndex);
  };

  return (
    <div>
      <div className={styles.addNewRule}>
        {/*code edited on 5 August 2022 for Bug 112847 */}
        <SelectField
          inputProps={{ "data-testid": "select" }}
          className={styles.dropdown}
          MenuProps={menuProps}
          value={param1}
          isNotMandatory={disabled ? true : false}
          onChange={(event) => handleParam1Value(event)}
          disabled={disabled}
          validateError={
            localData?.isNew ? !localData?.isNew : props.validateError
          } //code edited on 5 August 2022 for Bug 112847
        >
          {param1DropdownOptions?.map((element) => {
            return (
              <MenuItem
                className={styles.menuItemStyles}
                key={element.VariableName}
                value={element.VariableName}
                inputProps={{ "data-testid": "selectOption" }}
              >
                {element.VariableName}
              </MenuItem>
            );
          })}
        </SelectField>
        {/*code edited on 5 August 2022 for Bug 112847 */}
        <SelectField
          id="AR_Rule_Condition_Dropdown"
          className={styles.dropdown}
          MenuProps={menuProps}
          value={selectedOperator}
          onChange={(event) => onSelectOperator(event)}
          disabled={disabled}
          isNotMandatory={disabled ? true : false}
          validateError={
            localData?.isNew ? !localData?.isNew : props.validateError
          } //code edited on 5 August 2022 for Bug 112847
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
        </SelectField>
        {/*code edited on 5 August 2022 for Bug 112847 */}
        {/*code added on 23 Aug 2022 for BugId 114353*/}
        <SelectField
          id="AR_Param2_Dropdown"
          disabled={disabled}
          className={styles.dropdown}
          value={param2}
          onChange={(event, isConstant) => handleParam2Value(event, isConstant)}
          validateError={
            localData?.isNew ? !localData?.isNew : props.validateError
          } //code edited on 5 August 2022 for Bug 112847
          isConstant={isParam2Const}
          setIsConstant={(val) => setIsParam2Const(val)}
          isNotMandatory={disabled ? true : false}
          showConstValue={param2DropdownOptions?.length > 0}
          constType={variableType}
          menuItemStyles={styles.menuItemStyles}
        >
          {param2DropdownOptions?.map((element) => {
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
        </SelectField>

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
