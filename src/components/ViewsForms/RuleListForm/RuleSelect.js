import React, { useEffect, useState } from "react";
import { Select, MenuItem, Checkbox, Menu } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import styles from "./RuleListForm.module.css";
import { store, useGlobalState } from "state-pool";
import {
  conditionalTextOperator,
  logicalOperatorOptions,
} from "../../Properties/PropetiesTab/ActivityRules/CommonFunctionCall";
import AddIcon from "@material-ui/icons/Add";
import CustomizedDropdown from "../../../UI/Components_With_ErrrorHandling/Dropdown";

function RuleSelect({
  originalRulesListData,
  selectedRuleId,
  setoriginalRulesListData,
  setmodifyApiBool,
  setaddRuleApiBool,
  addRuleApiBool,
}) {
  const processData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(processData);
  const [isCustomConstant, setisCustomConstant] = useState(false);
  const [localVarDef, setlocalVarDef] = useState(
    localLoadedProcessData.Variable
  );
  const [pos, setpos] = useState(0);

  useEffect(() => {
    if (originalRulesListData?.length > 0)
      setpos(
        originalRulesListData
          ?.map(function (e) {
            return e.RuleId;
          })
          .indexOf(selectedRuleId)
      );
    else setpos(-1);
  }, [selectedRuleId, originalRulesListData?.length]);
  const getHighestNumber = (data, fieldName) => {
    let arr = [];
    data.map((el) => {
      arr.push(+el[fieldName]);
    });
    return Math.max(...arr);
  };

  const getVariableNameFromId = (id) => {
    let temp = "";
    localVarDef.map((_var) => {
      if (_var.VariableId === id) {
        temp = _var;
      }
    });
    return temp;
  };

  const checkIfConstant = (constName) => {
    let temp = false;
    localLoadedProcessData?.DynamicConstant?.forEach((constant) => {
      if (constant.ConstantName === constName) temp = true;
    });
    return temp;
  };

  const handleRuleDataChange = (e, OrderId) => {
    let temp = JSON.parse(JSON.stringify(originalRulesListData));
    let ruleId = temp[pos].RuleId;
    temp[pos]?.RuleCondition?.map((cond) => {
      if (cond.ConditionOrderId === OrderId) {
        cond[e.target.name] =
          e.target.name === "Operator" ||
          e.target.name === "LogicalOp" ||
          e.target.name === "VariableId_1"
            ? e.target.value
            : "";

        if (e.target.name === "VariableId_1") {
          // if (cond.Operator === "9" || cond.Operator === "10") {
          //   cond.Param2 = "";
          // }
          cond.Param1 = getVariableNameFromId(e.target.value).VariableName;
          cond.Type1 = getVariableNameFromId(e.target.value).VariableScope;
          cond.VarFieldId_1 = getVariableNameFromId(e.target.value).VarFieldId;
        } else if (e.target.name === "VariableId_2") {
          if (cond.Param1 === "ActivityName") {
            cond.VariableId_2 = "0";
            cond.Param2 = e.target.value;
            cond.Type2 = "C";
            cond.VarFieldId_2 = "0";
          } else {
            if (checkIfConstant(e.target.value) || isCustomConstant) {
              cond.VariableId_2 = "0";
              cond.Param2 = e.target.value;
              cond.Type2 = "C";
              cond.VarFieldId_2 = "0";
            } else {
              cond.Param2 = getVariableNameFromId(e.target.value).VariableName;
              cond.Type2 = getVariableNameFromId(e.target.value).VariableScope;
              cond.VarFieldId_2 = getVariableNameFromId(
                e.target.value
              ).VarFieldId;
            }
          }
        }
        if (
          (e.target.name === "Operator" && e.target.value === "9") ||
          e.target.value === "10"
        ) {
          cond.Param2 = "";
          cond.Type2 = "V";
          cond.VarFieldId_2 = "0";
          cond.VariableId_2 = "0";
        }
      }
    });
    if (!addRuleApiBool) {
      setmodifyApiBool(true);
      setaddRuleApiBool(false);
    }

    setoriginalRulesListData(temp);
  };

  const handleDelete = (OrderId) => {
    let temp = JSON.parse(JSON.stringify(originalRulesListData));

    temp.forEach((rule) => {
      rule.RuleCondition.forEach((cond, index = 0) => {
        if (cond.ConditionOrderId == OrderId) {
          rule.RuleCondition.splice(index, 1);
        }
      });
    });

    if (!addRuleApiBool) {
      setmodifyApiBool(true);
      setaddRuleApiBool(false);
    }

    setoriginalRulesListData(temp);
  };

  const handleAdd = (RuleId) => {
    let temp = JSON.parse(JSON.stringify(originalRulesListData));
    temp.forEach((rule) => {
      if (rule.RuleId == RuleId) {
        rule.RuleCondition.push({
          VarFieldId_1: "0",
          Operator: "",
          Type2: "",
          VarFieldId_2: "0",
          VariableId_1: "",
          VariableId_2: "",
          LogicalOp: "",
          Param2: "",
          Param1: "",
          Type1: "",
          ConditionOrderId:
            +getHighestNumber(
              originalRulesListData[pos].RuleCondition,
              "ConditionOrderId"
            ) + 1,
          ExtObjID1: "0",
          ExtObjID2: "0",
        });
      }
    });
    if (!addRuleApiBool) {
      setmodifyApiBool(true);
      setaddRuleApiBool(false);
    }

    setoriginalRulesListData(temp);
  };
  const getParam2Option = (var1) => {
    if (var1 !== "" && var1 == "49") {
      let temp = [];
      localLoadedProcessData.MileStones.forEach((mile) => {
        mile.Activities.forEach((act) => {
          temp.push(act);
        });
      });
      return temp.map((_var) => {
        return (
          <MenuItem value={_var.ActivityName}>
            <p style={{ fontSize: "12px" }}>{_var.ActivityName}</p>
          </MenuItem>
        );
      });
    } else if (var1 !== "" && var1 !== "49") {
      return localVarDef
        .filter(
          (_var) =>
            _var.VariableType === getVariableNameFromId(var1).VariableType
        )
        .concat(
          localLoadedProcessData.DynamicConstant.map((constant) => {
            return {
              VariableName: constant.ConstantName,
              VariableId: constant.ConstantName,
            };
          })
        )
        .map((_var) => {
          return (
            <MenuItem value={_var.VariableId}>
              <p style={{ fontSize: "12px" }}>{_var.VariableName}</p>
            </MenuItem>
          );
        });
    }
  };
  // useEffect(() => {
  //   originalRulesListData[pos]?.RuleCondition.fo
  // }, [input]);

  if (pos === -1) return <></>;
  else
    return (
      <>
        {originalRulesListData[pos]?.RuleCondition?.map(
          (
            {
              VariableId_1,
              VariableId_2,
              Operator,
              LogicalOp,
              ConditionOrderId,
              Param2,
              Param1,
              Type2,
            },
            index
          ) => (
            <div
              style={{
                width: "100%",
                height: "23%",
                padding: "10px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Select
                className={styles.select}
                variant="outlined"
                style={{ width: "30%" }}
                IconComponent={ExpandMoreIcon}
                value={VariableId_1}
                name="VariableId_1"
                onChange={(e) => handleRuleDataChange(e, ConditionOrderId)}
              >
                {localVarDef.map((_var) => {
                  return (
                    <MenuItem value={_var.VariableId}>
                      <p style={{ fontSize: "12px" }}>{_var.VariableName}</p>
                    </MenuItem>
                  );
                })}
              </Select>
              <Select
                className={styles.select}
                variant="outlined"
                style={{ width: "20%" }}
                IconComponent={ExpandMoreIcon}
                value={Operator}
                name="Operator"
                onChange={(e) => handleRuleDataChange(e, ConditionOrderId)}
              >
                {conditionalTextOperator.map((op) => (
                  <MenuItem value={op.value}>
                    {" "}
                    <p style={{ fontSize: "12px" }}>{op.label}</p>
                  </MenuItem>
                ))}
              </Select>
              {Operator == "9" || Operator == "10" ? null : (
                // <Select
                //   className={styles.select}
                //   variant="outlined"
                //   style={{ width: "30%" }}
                //   IconComponent={ExpandMoreIcon}
                //   value={
                //     checkIfConstant(Param2) || VariableId_1 === "49"
                //       ? Param2
                //       : VariableId_2
                //   }
                //   name="VariableId_2"
                //   onChange={(e) => handleRuleDataChange(e, ConditionOrderId)}
                // >
                //   {getParam2Option(VariableId_1)}
                // </Select>
                <CustomizedDropdown
                  id="AR_Rule_Condition_Dropdown"
                  name="VariableId_2"
                  //disabled={isReadOnly || disabled}
                  className={styles.dropdown}
                  value={
                    checkIfConstant(Param2) ||
                    VariableId_1 === "49" ||
                    Type2 === "C"
                      ? Param2
                      : VariableId_2
                  }
                  isConstant={isCustomConstant || Type2 === "C"}
                  setIsConstant={(val) => setisCustomConstant(val)}
                  showConstValue={
                    localVarDef?.length > 0 && Param1 !== "ActivityName"
                  }
                  // constType={variableType}
                  onChange={(e) => handleRuleDataChange(e, ConditionOrderId)}
                  validationBoolean={false}
                  validationBooleanSetterFunc={null}
                  constType={getVariableNameFromId(VariableId_1)?.VariableType}
                  // showAllErrors={ruleConditionErrors}
                  // showAllErrorsSetterFunc={setRuleConditionErrors}
                  // isNotMandatory={isAlwaysRule}
                  menuItemStyles={styles.menuItemStyles}
                >
                  {getParam2Option(VariableId_1)}
                </CustomizedDropdown>
              )}

              <Select
                className={styles.select}
                style={{ width: "10%" }}
                variant="outlined"
                IconComponent={ExpandMoreIcon}
                value={LogicalOp === "0" ? "" : LogicalOp}
                name="LogicalOp"
                onChange={(e) => handleRuleDataChange(e, ConditionOrderId)}
              >
                {logicalOperatorOptions.map((logOp) => (
                  <MenuItem value={logOp.value}>
                    <p style={{ fontSize: "12px" }}>{logOp.label}</p>
                  </MenuItem>
                ))}
              </Select>
              <div
                style={{
                  width: "10%",
                  justifyContent: "flex-start",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {originalRulesListData[pos]?.RuleCondition.length ===
                1 ? null : (
                  <DeleteOutlineIcon
                    classes={{
                      root: styles.deleteIcon,
                    }}
                    onClick={() => handleDelete(ConditionOrderId)}
                  />
                )}

                {index ===
                originalRulesListData[pos]?.RuleCondition.length - 1 ? (
                  <AddIcon
                    classes={{
                      root: styles.deleteIcon,
                    }}
                    onClick={() => handleAdd(originalRulesListData[pos].RuleId)}
                  />
                ) : null}
              </div>
            </div>
          )
        )}
      </>
    );
}

export default RuleSelect;
