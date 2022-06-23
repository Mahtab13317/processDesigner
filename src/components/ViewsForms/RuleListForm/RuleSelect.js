import React, { useEffect, useState } from "react";
import { Select, MenuItem, Checkbox } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import styles from "./RuleListForm.module.css";
import { store, useGlobalState } from "state-pool";
import {
  conditionalTextOperator,
  logicalOperatorOptions,
} from "../../Properties/PropetiesTab/ActivityRules/CommonFunctionCall";
import AddIcon from "@material-ui/icons/Add";
import { Add } from "@material-ui/icons";

function RuleSelect({
  originalRulesListData,
  selectedRuleId,
  setoriginalRulesListData,
  setmodifyApiBool,
  setaddRuleApiBool,
  addRuleApiBool,
}) {
  const varDef = store.getState("variableDefinition"); //current processdata clicked

  const [localVarDef, setlocalVarDef] = useGlobalState(varDef);
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

  const handleRuleDataChange = (e, OrderId) => {
    let temp = JSON.parse(JSON.stringify(originalRulesListData));
    temp[pos]?.RuleCondition?.map((cond) => {
      if (cond.ConditionOrderId === OrderId) {
        cond[e.target.name] = e.target.value;
        if (e.target.name === "VariableId_1") {
          cond.Param1 = getVariableNameFromId(e.target.value).SystemDefinedName;
          cond.Type1 = getVariableNameFromId(e.target.value).VariableScope;
          cond.VarFieldId_1 = getVariableNameFromId(e.target.value).VarFieldId;
        } else if (e.target.name === "VariableId_2") {
          cond.Param2 = getVariableNameFromId(e.target.value).SystemDefinedName;
          cond.Type2 = getVariableNameFromId(e.target.value).VariableScope;
          cond.VarFieldId_2 = getVariableNameFromId(e.target.value).VarFieldId;
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
            },
            index
          ) => (
            <div
              style={{
                width: "100%",
                height: "30%",
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
                      <p style={{ fontSize: "12px" }}>
                        {_var.SystemDefinedName}
                      </p>
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
              <Select
                className={styles.select}
                variant="outlined"
                style={{ width: "30%" }}
                IconComponent={ExpandMoreIcon}
                value={VariableId_2}
                name="VariableId_2"
                onChange={(e) => handleRuleDataChange(e, ConditionOrderId)}
              >
                {localVarDef.map((_var) => {
                  return (
                    <MenuItem value={_var.VariableId}>
                      <p style={{ fontSize: "12px" }}>
                        {_var.SystemDefinedName}
                      </p>
                    </MenuItem>
                  );
                })}
              </Select>
              <Select
                className={styles.select}
                style={{ width: "10%" }}
                variant="outlined"
                IconComponent={ExpandMoreIcon}
                value={LogicalOp}
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
                <DeleteOutlineIcon
                  style={{ opacity: "0.4" }}
                  onClick={() => handleDelete(ConditionOrderId)}
                />
                {index ===
                originalRulesListData[pos]?.RuleCondition.length - 1 ? (
                  <AddIcon
                    style={{ opacity: "0.4" }}
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
