import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./rule.module.css";
import AddNewCondition from "./AddNewCondition";
import { Divider } from "@material-ui/core";
import RuleDataList from "./RuleDataList";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  ADD_SYMBOL,
  ENDPOINT_ADD_RULES,
  ENDPOINT_DELETE_RULES,
  ENDPOINT_MODIFY_RULES,
  PROCESSTYPE_LOCAL,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import axios from "axios";
import { connect } from "react-redux";
import CommonCondition from "./CommonCondition";
import NoRuleScreen from "./NoRuleScreen";

function Rules(props) {
  let { t } = useTranslation();
  const [selected, setselected] = useState(0);
  const [selectCon, setselectCon] = useState(t("if"));
  const [showDragIcon, setShowDragIcon] = useState(false);
  const [addedVarList, setaddedVarList] = useState([]);
  const [disabled, setdisabled] = useState(false);
  const [rules, setrules] = useState([]);
  const [showBtn, setshowBtn] = useState(null);
  const [bShowRuleData, setbShowRuleData] = useState(false);
  const [count, setCount] = useState(null);
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    if (props.openProcessType === PROCESSTYPE_LOCAL) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [props.openProcessType]);

  useEffect(() => {
    let outputArray = [];
    const tempArray = props.interfaceRules;
    tempArray &&
      tempArray.forEach((element) => {
        outputArray.push({
          ruleId: element.RuleID,
          ruleOrderId: element.RuleOrderId,
          ruleType: element.RuleType,
          Desc: element.Desc,
          ruleCondList: getRuleConditionList(element),
          ruleOpList: getOperationList(element),
        });
      });

    setrules(outputArray);
    setCount(outputArray.length);

    setbShowRuleData(props.bShowRuleData);
  }, []);

  useEffect(() => {
    if (selected) {
      let Condition = rules[selected] && rules[selected].Desc.split(" ")[0];
      setselectCon(Condition);
    } else if (rules && rules.length > 0) {
      let Condition = rules[0] && rules[0].Desc.split(" ")[0];
      setselectCon(Condition);
    }
  }, [selected]);

  const getRuleConditionList = (element) => {
    let ruleConditionArray = [];
    element.RuleConditions &&
      element.RuleConditions.forEach((elem) => {
        ruleConditionArray.push({
          condOrderId: elem.ConditionOrderId,
          param1: elem.Param1,
          type1: elem.Type1,
          extObjID1: elem.ExtObjID1,
          variableId_1: elem.VariableId_1,
          varFieldId_1: elem.VarFieldId_1,
          operator: elem.Operator,
          logicalOp: elem.LogicalOp,
          param2: elem.Param2,
          type2: elem.Type2,
          extObjID2: elem.ExtObjID2,
          variableId_2: elem.VariableId_2,
          varFieldId_2: elem.VarFieldId_2,
        });
      });
    return ruleConditionArray;
  };

  const getOperationList = (element) => {
    let operationArray = [];
    element.RuleOperations &&
      element.RuleOperations.forEach((elem) => {
        operationArray.push({
          interfaceId: elem.InterfaceId,
          interfaceName: elem.InterfaceName,
        });
      });
    return operationArray;
  };

  const blankObjectCondition = {
    param1: "",
    type1: "M",
    extObjID1: "0",
    variableId_1: "0",
    varFieldId_1: "0",
    operator: "",
    logicalOp: "3",
    param2: "",
    type2: "M",
    extObjID2: "0",
    variableId_2: "0",
    varFieldId_2: "0",
  };

  const ruleCondListAlways = {
    condOrderId: "1",
    param1: "Always",
    type1: "S",
    extObjID1: "0",
    variableId_1: "0",
    varFieldId_1: "0",
    operator: "4",
    logicalOp: "4",
    param2: "Always",
    type2: "S",
    extObjID2: "0",
    variableId_2: "0",
    varFieldId_2: "0",
  };

  const newRow = (value, index) => {
    if (value == ADD_SYMBOL) {
      let maxId = 0;
      rules[index].ruleCondList.forEach((element) => {
        if (element.condOrderId > maxId) {
          maxId = element.condOrderId;
        }
      });
      let ConOrderID = { condOrderId: +maxId + 1 + "" };
      let newRow = { ...ConOrderID, ...blankObjectCondition };

      rules[index].ruleCondList.push(newRow);
      setrules([...rules]);
    }
  };

  const optionSelector = (e) => {
    setselectCon(e.target.value);
    if (e.target.value === t("always")) {
      setdisabled(true);
    } else {
      setdisabled(false);
    }
  };

  const selectedVariableList = (list) => {
    setaddedVarList(list);
  };

  // add rule
  const addClickRule = () => {
    console.log("222","rule adding")
    if (addedVarList.length === 0) {
      alert(t("selectOperations"));
    } else {
      //code added on 23 September 2022 for BugId 111853 
      let localRuleListOp = [];
      addedVarList &&
        addedVarList.forEach((el) => {
          localRuleListOp.push({
            interfaceName: el.Name,
            interfaceId:el.NameId

          });
        });

      let RuleConditionList =
        selectCon == t("if")
          ? rules[selected].ruleCondList
          : [ruleCondListAlways];

      let postJson = {
        processDefId: props.openProcessID + "",
        processMode: props.openProcessType,
        ruleId: rules[selected].ruleId,
        ruleOrderId: rules[selected].ruleOrderId,
        ruleType: props.ruleType,
        ruleCondList: RuleConditionList,
        ruleOpList: localRuleListOp,
      };
      
      axios.post(SERVER_URL + ENDPOINT_ADD_RULES, postJson).then((res) => {
        if (res.data.Status === 0) {
          rules[selected].Desc = res.data.Description;
          // setruleList([...rules]);
          setshowBtn("");
          setCount(rules.length);
        }
      });
    }
  };

  //add rule locally
  const addNewRule = () => {
    let maxRuleId = 0;
    rules.forEach((element) => {
      if (element.ruleId > maxRuleId) {
        maxRuleId = element.ruleId;
      }
    });

    let ConOrderID = { condOrderId: +maxRuleId + 1 + "" };
    let ruleCondListLocal = { ...ConOrderID, ...blankObjectCondition };

    let newRule = {
      processDefId: props.openProcessID + "",
      processMode: props.openProcessType,
      ruleId: +maxRuleId + 1 + "",
      ruleOrderId: +maxRuleId + 1,
      Desc: t("newRule"),
      ruleType: props.ruleType,
      ruleCondList: [ruleCondListLocal],
      ruleOpList: [],
    };
    let temp = rules;
    temp.push(newRule);
    setrules([...temp]);
    setshowBtn("none");
    setselected(rules.length - 1);
  };

  const updateRule = () => {
    let localRuleListOp = [];
    addedVarList &&
      addedVarList.forEach((el) => {
        localRuleListOp.push({
          interfaceName: el.Name,
        });
      });

    let RuleConditionList =
      selectCon == t("if")
        ? rules[selected].ruleCondList
        : [ruleCondListAlways];

    let postJson = {
      processDefId: props.openProcessID + "",
      processMode: props.openProcessType,
      ruleId: rules[selected].ruleId,
      ruleOrderId: rules[selected].ruleOrderId,
      ruleType: props.ruleType,
      ruleCondList: RuleConditionList,
      ruleOpList: localRuleListOp,
    };

    axios.post(SERVER_URL + ENDPOINT_MODIFY_RULES, postJson).then((res) => {
      if (res.data.Status === 0) {
        setrules((prev) => {
          let newData = [...prev];
          newData[selected].Desc = res.data.Description;
          return newData;
        });
        setshowBtn("");
        alert("Rule Added");
      }
    });
  };

  const deleteRule = (selected) => {
    let localRuleListOp = "";
    addedVarList &&
      addedVarList.forEach((el) => {
        localRuleListOp = localRuleListOp + el.Name + ",";
      });

    let postJson = {
      processDefId: props.openProcessID + "",
      processMode: props.openProcessType,
      ruleId: rules[selected].ruleId,
      ruleType: props.ruleType,
      ruleOrderId: rules[selected].ruleOrderId,
      interfaceName: localRuleListOp.slice(0, -1),
    };

    axios.post(SERVER_URL + ENDPOINT_DELETE_RULES, postJson).then((res) => {
      if (res.data.Status === 0) {
        let temp = rules;
        temp.splice(selected, 1);
        setrules([...temp]);
        setCount(rules.length);
        setshowBtn("");
        setselected(0);
        alert("Rule deleted");
      }
    });
  };

  const cancelRule = (selected) => {
    let temp = rules;
    temp.splice(selected, 1);
    setrules([...temp]);
    setshowBtn("");
    setselected(0);
  };
console.log("123",props)
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const rulesArray = [...rules];
    const [reOrderedRuleItem] = rulesArray.splice(source.index, 1);
    rulesArray.splice(destination.index, 0, reOrderedRuleItem);
    setrules(rulesArray);
  };

  return (
    <>
      {rules?.length > 0 ? (
        <div className={styles.RuleScreen}>
          <div className={styles.LeftPannel}>
            {count == 0 ? (
              <div className="row">
                <p className={styles.noRuleDefined}>
                  {t("no")}
                  {" " + t("rulesAreDedined")}
                </p>
                <button
                  className={styles.addnavBtn}
                  onClick={addNewRule}
                  style={{ display: showBtn }}
                  id="addRuleLocaly"
                >
                  {t("addRule")}
                </button>
              </div>
            ) : (
              <div className="row" style={{ marginBottom: "0.5rem" }}>
                <p className={styles.noRuleDefined}>
                  {count}
                  {" " + t("rulesAreDedined")}
                </p>
                {isDisable ? (
                  <button
                    className={styles.addnavBtn}
                    onClick={addNewRule}
                    style={{ display: showBtn }}
                    id="addRuleLocalBtn"
                  >
                    {t("addRule")}
                  </button>
                ) : null}
              </div>
            )}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="pickListInputs">
                {(provided) => (
                  <ul
                    style={{ overflow: "scroll" }}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {rules && rules.length != 0 ? (
                      rules.map((el, index) => {
                        return (
                          <Draggable
                            draggableId={`${index}`}
                            key={`${index}`}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                className={styles.restList}
                                onMouseOver={() => setShowDragIcon(true)}
                                onMouseLeave={() => setShowDragIcon(false)}
                                style={{
                                  backgroundColor:
                                    selected == index ? "#0072C60F " : null,
                                  color: selected == index ? "#000000" : null,
                                  borderLeft:
                                    selected == index
                                      ? "5px solid #0072C6"
                                      : null,
                                }}
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                onClick={() => setselected(index)}
                              >
                                <p
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span style={{ marginRight: "15px" }} {...provided.dragHandleProps}>
                                    {index + 1}.
                                  </span>
                                  {el.Desc}
                                </p>
                              </li>
                            )}
                          </Draggable>
                        );
                      })
                    ) : (
                      <li
                        className={styles.restList}
                        style={{
                          backgroundColor: "#0072C60F ",
                          color: "#000000",
                          borderLeft: "5px solid #0072C6",
                        }}
                      >
                        {t("no")}
                        {" " + t("rulesAreDedined")}
                      </li>
                    )}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className={styles.vl}></div>
          <div className={styles.RightPannel}>
            <CommonCondition
              rulesSelected={rules[selected]}
              deleteRule={deleteRule}
              cancelRule={cancelRule}
              selected={selected}
              updateRule={updateRule}
              addClickRule={addClickRule}
              optionSelector={optionSelector}
              selectCon={selectCon}
              openProcessType={props.openProcessType}
            />

            {rules[selected] &&
              rules[selected].ruleCondList.map((val, index) => {
                return (
                  <AddNewCondition
                    allRowData={val}
                    setrowData={setrules}
                    index={index}
                    newRow={newRow}
                    parentIndex={selected}
                    rules={rules}
                    showDelIcon={rules[selected].ruleCondList.length > 1}
                    disabled={disabled}
                  />
                );
              })}

            {bShowRuleData ? (
              <React.Fragment>
                <p className={styles.showHeading} style={{ marginTop: "30px" }}>
                  {t("show")}
                  <Divider className={styles.showLine} />
                </p>
                <RuleDataList
                  ruleDataType={props.ruleDataType}
                  selectedVariableList={selectedVariableList}
                  rules={rules[selected]}
                  ruleDataTableStatement={props.ruleDataTableStatement}
                  addRuleDataTableStatement={props.addRuleDataTableStatement}
                  addRuleDataTableHeading={props.addRuleDataTableHeading}
                  ruleDataTableHeading={props.ruleDataTableHeading}
                  openProcessType={props.openProcessType}
                  hideGroup={props.hideGroup}
                  listName={props.listName}
                  availableList={props.availableList}
                />
              </React.Fragment>
            ) : null}
          </div>
        </div>
      ) : (
        <NoRuleScreen
          handleScreen={addNewRule}
          processType={props.openProcessType}
        />
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps, null)(Rules);
