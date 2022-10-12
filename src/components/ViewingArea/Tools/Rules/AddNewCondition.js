import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./rule.module.css";
import { Select, MenuItem } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { store, useGlobalState } from "state-pool";
import {
  ConditionalOperator,
  getLogicalOperator,
  getLogicalOperatorReverse,
} from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

function AddNewCondition(props) {
  let { t } = useTranslation();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [localLoadedProcess] = useGlobalState("variableDefinition");
  const [variableType, setvariableType] = useState(null);
  const [param1, setParam1] = useState("");
  const [param2, setParam2] = useState("");
  const [selectedOperator, setselectedOperator] = useState("");

  const [conditionalDropdown, setconditionalDropdown] =
    useState(ConditionalOperator);

  const [logicalOperator, setLogicalOperator] = useState("+");

  const {
    index,
    setrowData,
    allRowData,
    newRow,
    parentIndex,
    disabled,
    showDelIcon,
    rules,
  } = props;

  /*****************************************************************************************
   * @author asloob_ali BUG ID : 115319 Rules: activity name is not modifiable and should not be allowed in Rules like in IBPS 5 sp2
   *  Resolution : removed ActivityName variable from dropdown.
   *  Date : 13/09/2022             ****************/

  const [parameter1dropdown, setDropdown] = useState(
    //Bug id 115319 Rules: activity name is not modifiable and should not be allowed in Rules like in IBPS 5 sp2

    localLoadedProcessData?.Variable?.filter(
      (variable) => variable.VariableId !== "49"
    )
  );

  const [param2Dropdown, setparam2Dropdown] = useState(
    localLoadedProcessData?.Variable
  );
  console.log(parameter1dropdown);
  useEffect(() => {
    if (variableType == 10) {
      let localArr = ConditionalOperator.filter((val) => {
        if (val.type.includes(+variableType)) {
          return val;
        }
      });
      setconditionalDropdown(localArr);
    } else if (variableType == 12) {
      let localArr = ConditionalOperator.filter((val) => {
        if (val.type.includes(+variableType)) {
          return val;
        }
      });
      setconditionalDropdown(localArr);
    } else if (variableType == 3) {
      let localArr = ConditionalOperator.filter((val) => {
        if (val.type.includes(+variableType)) {
          return val;
        }
      });
      setconditionalDropdown(localArr);
    } else if (variableType == 4) {
      let localArr = ConditionalOperator.filter((val) => {
        if (val.type.includes(+variableType)) {
          return val;
        }
      });
      setconditionalDropdown(localArr);
    } else if (variableType == 6) {
      let localArr = ConditionalOperator.filter((val) => {
        if (val.type.includes(+variableType)) {
          return val;
        }
      });
      setconditionalDropdown(localArr);
    } else if (variableType == 8) {
      let localArr = ConditionalOperator.filter((val) => {
        if (val.type.includes(+variableType)) {
          return val;
        }
      });
      setconditionalDropdown(localArr);
    }

    let parameter2 = [];
    for (let i = 0; i < parameter1dropdown.length; i++) {
      if (parameter1dropdown[i].VariableType == variableType) {
        parameter2.push(parameter1dropdown[i]);
      }
    }
    setparam2Dropdown(parameter2);
  }, [variableType]);

  const onSelectParam1 = (elmValue) => {
    let varType;
    parameter1dropdown.map((value) => {
      if (value.VariableName === elmValue) {
        varType = value.VariableType;
        setvariableType(varType);
      }
    });

    setrowData((prevData) => {
      let temp = [...prevData];
      temp[parentIndex].ruleCondList[index].param1 = elmValue;

      parameter1dropdown.map((value) => {
        if (value.VariableName === elmValue) {
          temp[parentIndex].ruleCondList[index].varFieldId_1 = value.VarFieldId;
          temp[parentIndex].ruleCondList[index].variableId_1 = value.VariableId;
          temp[parentIndex].ruleCondList[index].type1 = "M";
          temp[parentIndex].ruleCondList[index].extObjID1 = value.ExtObjectId;
        }
      });

      return temp;
    });

    setParam1(elmValue);

    let parameter2 = [];
    for (let i = 0; i < parameter1dropdown.length; i++) {
      if (parameter1dropdown[i].VariableType == variableType) {
        parameter2.push(parameter1dropdown[i]);
      }
    }
    setparam2Dropdown(parameter2);
  };

  const onSelectOperator = (e) => {
    setrowData((prevData) => {
      let temp = [...prevData];
      temp[parentIndex].ruleCondList[index].operator = e.target.value;
      return temp;
    });
    setselectedOperator(e.target.value);
    if (e.target.value == 9 || e.target.value == 10) {
      setparam2Dropdown([]);
    }
  };
  const onSelectCondition = (e) => {
    setrowData((prevData) => {
      let temp = [...prevData];
      temp[parentIndex].ruleCondList[index].param2 = e.target.value;
      parameter1dropdown.map((value) => {
        if (value.VariableName === e.target.value) {
          temp[parentIndex].ruleCondList[index].varFieldId_2 = value.VarFieldId;
          temp[parentIndex].ruleCondList[index].variableId_2 = value.VariableId;
          temp[parentIndex].ruleCondList[index].type2 = "M";
          temp[parentIndex].ruleCondList[index].extObjID2 = value.ExtObjectId;
        }
      });
      return temp;
    });
    setParam2(e.target.value);
  };

  const onSelectLogicalOperator = (e) => {
    if (e.target.innerText === "+") {
      setLogicalOperator("AND");
    } else if (e.target.innerText === "AND") {
      setLogicalOperator("or");
    } else if (e.target.innerText === "OR") {
      setLogicalOperator("AND");
    }

    setrowData((prevData) => {
      let temp = [...prevData];
      temp[parentIndex].ruleCondList[index].logicalOp = getLogicalOperator(
        e.target.innerText
      );
      return temp;
    });
    newRow(e.target.innerText, props.parentIndex);
  };

  const deleteRow = () => {
    setrowData((prevData) => {
      let temp = [...prevData];
      temp[parentIndex].ruleCondList.splice(index, 1);
      return temp;
    });
  };

  useEffect(() => {
    setParam1(allRowData.param1);
    onSelectParam1(allRowData.param1);
    setParam2(allRowData.param2);
    setLogicalOperator(getLogicalOperatorReverse(allRowData.logicalOp));
    setselectedOperator(allRowData.operator);
  }, [allRowData]);

  useEffect(() => {
    if (showDelIcon === false) {
      setLogicalOperator("+");
    }
  }, [showDelIcon]);

  return (
    <React.Fragment>
      <div
        style={{ marginTop: "20px", height: "2rem", marginLeft: "15px" }}
        className={styles.addNewRule}
      >
        <Select
          className={styles.dataDropdown}
          MenuProps={{
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
          }}
          style={{ width: "10rem", border: ".5px solid #c4c4c4" }}
          value={param1}
          onChange={(e) => onSelectParam1(e.target.value)}
          disabled={disabled}
          id="ruleParam1Dropdown"
        >
          {parameter1dropdown.map((val) => {
            return (
              <MenuItem
                className={styles.menuItemStyles}
                key={val.VariableName}
                value={val.VariableName}
              >
                {val.VariableName}
              </MenuItem>
            );
          })}
        </Select>

        <Select
          className={styles.dataDropdown}
          style={{
            width: "10rem",
            border: ".5px solid #c4c4c4",
            marginLeft: "1rem",
            marginRight: "1rem",
          }}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
          value={selectedOperator}
          onChange={(e) => onSelectOperator(e)}
          disabled={disabled}
          id="ruleConditionalDropdown"
        >
          {conditionalDropdown.map((val) => {
            return (
              <MenuItem
                className={styles.menuItemStyles}
                key={val.value}
                value={val.value}
              >
                {t(val.label)}
              </MenuItem>
            );
          })}
        </Select>

        <Select
          className={styles.dataDropdown}
          style={{
            width: "10rem",
            border: ".5px solid #c4c4c4",
            marginRight: "1rem",
          }}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
          value={param2}
          onChange={(e) => onSelectCondition(e)}
          disabled={disabled}
          id="ruleParam2Dropdown"
        >
          {param2Dropdown.map((val) => {
            return (
              <MenuItem
                className={styles.menuItemStyles}
                key={val.VariableName}
                value={val.VariableName}
              >
                {val.VariableName}
              </MenuItem>
            );
          })}
        </Select>

        <button
          className={styles.toogleBtn}
          onClick={(e) => onSelectLogicalOperator(e)}
          disabled={disabled}
          type="button"
        >
          {t(logicalOperator)}
        </button>

        {showDelIcon ? (
          <DeleteOutlinedIcon
            className={styles.deleteIcon}
            onClick={deleteRow}
            id="deleteRuleRow"
          />
        ) : null}
      </div>
    </React.Fragment>
  );
}

export default AddNewCondition;
