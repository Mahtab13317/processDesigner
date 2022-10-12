import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import * as actionCreators from "../../../../../../redux-store/actions/Properties/showDrawerAction.js";
import { connect, useDispatch } from "react-redux";
import { store, useGlobalState } from "state-pool";
import AddOperations from "./AddOperation";
import AddCondition from "./AddCondition";
import { setActivityPropertyChange } from "../../../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Select,
  MenuItem,
} from "@material-ui/core";
import {
  RULES_IF_CONDITION,
  RULES_ALWAYS_CONDITION,
  RULES_OTHERWISE_CONDITION,
  SET_OPERATION_TYPE,
  SPACE,
  RTL_DIRECTION,
  propertiesLabel,
  CONSTANT,
  DATE_VARIABLE_TYPE,
  ADD_OPERATION_SECONDARY_DBFLAG,
  MANDATORY_OPERATION_TYPE,
  SET_READY_OPERATION_TYPE,
  OPTIONAL_OPERATION_TYPE,
  AUTO_INITIATE_OPERATION_TYPE,
  DATA_TYPE_RULE_COND,
  DOC_TYPE_RULE_COND,
  TASK_TYPE_RULE_COND,
  EQUAL_TO,
} from "../../../../../../Constants/appConstants";
import clsx from "clsx";
import NoRulesScreen from "./NoRuleScreen";
import RuleStatement from "./RuleStatement";
import { isReadOnlyFunc } from "../../../../../../utility/CommonFunctionCall/CommonFunctionCall";
import { getVariableByName } from "../../../../../../utility/ProcessSettings/Triggers/triggerCommonFunctions";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  getTypedropdown,
  getLogicalOperator,
  getConditionalOperator,
  operationFieldKeys,
  caseWorkdeskTaskOperations,
  getOperator,
} from "../../../ActivityRules/CommonFunctionCall";
import {
  getRuleType,
  getTaskRuleConditionObject,
  getTaskRuleOperationObject,
  getTaskRuleOperationDataObj,
  getTaskStatus,
  isValueDateType,
} from "../../../ActivityRules/CommonFunctions";
import moment from "moment";

function TaskRules(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const { expandDrawer, cellActivityType, cellActivitySubType, taskInfo } =
    props;
  const dispatch = useDispatch();
  const globalActivityData = store.getState("activityPropertyData");
  const [localActivityPropertyData, setLocalActivityPropertyData] =
    useGlobalState(globalActivityData);
  const loadedProcessData = store.getState("loadedProcessData");
  const [activityProcessData] = useGlobalState(loadedProcessData);
  const [localRuleData, setLocalRuleData] = useState({}); // State to store the rule data for the selected rule locally.
  const [selectedRule, setSelectedRule] = useState(0); // To store the index of the selected rule.
  const [selectedCondition, setSelectedCondition] =
    useState(RULES_IF_CONDITION); // To store the selected condition for a rule.
  const [disabled, setDisabled] = useState(false); // To disable dropdowns for always type rule.
  const [rules, setRules] = useState([]); // Rules data.
  const [showAddRuleButton, setShowAddRuleButton] = useState(true); // To show add rule button.
  const [rulesCount, setRulesCount] = useState(0); // To show count for rules.
  const [isRuleBeingCreated, setIsRuleBeingCreated] = useState(false); // Value is true when user is creating a rule.
  const [isRuleBeingModified, setIsRuleBeingModified] = useState(false); // Value is true when the user is modifying a rule.
  const [operationsAllowed, setOperationsAllowed] = useState([]); // State to store the operation types allowed in this particular activity.
  const [isOtherwiseSelected, setIsOtherwiseSelected] = useState(false); // State to store if rule is otherwise type or not.
  const [checkValidation, setCheckValidation] = useState(false);
  const [doesSelectedRuleHaveErrors, setDoesSelectedRuleHaveErrors] =
    useState(false);
  const [ruleConditionErrors, setRuleConditionErrors] = useState(false);
  const [addClicked, setAddClicked] = useState(false);
  const [ruleCondType, setRuleCondType] = useState(DATA_TYPE_RULE_COND);
  const [associatedTasks, setAssociatedTasks] = useState({});
  let isReadOnly = isReadOnlyFunc(activityProcessData, props.cellCheckedOut);

  // Function that validates the rule being currently added/modified.
  const validateRule = () => {
    let conditionFieldsFilled = true,
      operationFieldsFilled = true;
    let conditionFieldKeys = {
      ruleCondition: ["param1", "param2", "operator"],
    };
    let conditionDocFieldKeys = {
      ruleCondition: ["param1"],
    };
    let conditionTaskFieldKeys = {
      ruleCondition: ["param1", "param2"],
    };
    localRuleData?.ruleCondList?.forEach((element) => {
      if (element.ruleType === DATA_TYPE_RULE_COND) {
        conditionFieldKeys["ruleCondition"]?.forEach((value) => {
          if (
            !element[value] ||
            element[value]?.trim() === "" ||
            element[value] === null ||
            element[value]?.trim() === CONSTANT
          ) {
            conditionFieldsFilled = false;
          }
        });
      } else if (element.ruleType === DOC_TYPE_RULE_COND) {
        conditionDocFieldKeys["ruleCondition"]?.forEach((value) => {
          if (
            !element[value] ||
            element[value]?.trim() === "" ||
            element[value] === null ||
            element[value]?.trim() === CONSTANT
          ) {
            conditionFieldsFilled = false;
          }
        });
      } else if (element.ruleType === TASK_TYPE_RULE_COND) {
        conditionTaskFieldKeys["ruleCondition"]?.forEach((value) => {
          if (
            !element[value] ||
            element[value]?.trim() === "" ||
            element[value] === null ||
            element[value]?.trim() === CONSTANT
          ) {
            conditionFieldsFilled = false;
          }
        });
      }
    });

    localRuleData?.ruleOpList?.forEach((element, i) => {
      let oprtnType = 1;
      oprtnType = element.opType;
      if (
        oprtnType === SET_OPERATION_TYPE &&
        element.param1 === ADD_OPERATION_SECONDARY_DBFLAG
      ) {
        if (element.param2 === "") {
          operationFieldsFilled = false;
        }
      } else {
        operationFieldKeys[element.opType]?.forEach((value) => {
          if (element[value] === "" || element[value] === null) {
            operationFieldsFilled = false;
          }
        });
      }
    });
    setDoesSelectedRuleHaveErrors(!operationFieldsFilled);
    setRuleConditionErrors(!conditionFieldsFilled);
    if (operationFieldsFilled && conditionFieldsFilled) {
      setCheckValidation(false);
      if (addClicked) {
        addRule();
      }
    } else {
      setAddClicked(false);
    }
  };

  // Function that runs when the localRuleData changes to check the validation in the dropdown and fields.
  useEffect(() => {
    if (checkValidation) {
      validateRule();
    }
  }, [localRuleData, checkValidation]);

  // Function to set global data when the user does any action.
  const setGlobalData = (rules) => {
    let temp = JSON.parse(JSON.stringify(localActivityPropertyData));
    let ruleObj = [];
    rules?.forEach((rule) => {
      ruleObj.push({
        ruleCondList: [...rule.ruleCondList],
        ruleOpList: [...rule.ruleOpList],
      });
    });
    temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
      taskInfo.taskTypeInfo.taskName
    ].m_arrRuleInfo = [...ruleObj];
    setLocalActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.task]: { isModified: true, hasError: false },
      })
    );
  };

  // Function that runs when the component loads and is responsible for checking which operations are allowed for the particular activity that is showing the rules now.
  useEffect(() => {
    let operationsList = [];
    if (cellActivityType === 32 && cellActivitySubType === 1) {
      operationsList = caseWorkdeskTaskOperations;
    }
    setOperationsAllowed(operationsList);
  }, []);

  // Function that runs when the component loads.
  useEffect(() => {
    if (localActivityPropertyData) {
      const tempActJSON = JSON.parse(JSON.stringify(localActivityPropertyData));
      let activityData =
        tempActJSON?.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap[
          taskInfo?.taskTypeInfo?.taskName
        ]?.m_arrRuleInfo;

      activityData?.map((el, index) => {
        el.ruleCondList?.map((rule, idx) => {
          if (rule.m_strRuleType) {
            activityData[index].ruleCondList[idx] = {
              ...rule,
              ruleType: rule.m_strRuleType,
            };
          }
        });
      });
      setRules(activityData);
      let newCondList =
        activityData?.length > 0 &&
        activityData[selectedRule] &&
        activityData[selectedRule]?.ruleCondList;
      const dataObj = {
        ruleCondList: newCondList || [getTaskRuleConditionObject()],
        ruleOpList: (activityData?.length > 0 &&
          activityData[selectedRule] &&
          activityData[selectedRule]?.ruleOpList) || [
          getTaskRuleOperationObject(1),
        ],
      };
      setAssociatedTasks(
        tempActJSON?.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap
      );
      setLocalRuleData({ ...dataObj });
    }
  }, [localActivityPropertyData?.ActivityProperty]);

  // Function that runs when the selected rule is changed.
  useEffect(() => {
    if (rules && rules.length !== 0) {
      const dataObj = {
        ruleCondList: rules[selectedRule].ruleCondList,
        ruleOpList: rules[selectedRule].ruleOpList,
      };
      setLocalRuleData({ ...dataObj });
    }
  }, [selectedRule]);

  // Function to set the rule count.
  useEffect(() => {
    if (rules && !isRuleBeingCreated) {
      setRulesCount(rules.length);
    }
  }, [rules]);

  // Function that runs when the selected rule changes or rules are added,deleted or modified.
  useEffect(() => {
    if (
      rules &&
      rules[selectedRule]?.ruleCondList &&
      rules[selectedRule].ruleCondList[0].param1 === RULES_ALWAYS_CONDITION
    ) {
      setSelectedCondition(RULES_ALWAYS_CONDITION);
      setDisabled(true);
      setIsOtherwiseSelected(false);
    } else {
      setSelectedCondition(RULES_IF_CONDITION);
      setDisabled(false);
      setIsOtherwiseSelected(false);
    }
  }, [selectedRule, rules]);

  // Function that gets called when the user changes a selected rule.
  const handleSelectedRuleChange = (index) => {
    if (!isRuleBeingCreated || index !== rules?.length - 1) {
      expandDrawer(true);
      setSelectedRule(index);
      if (
        localRuleData &&
        localRuleData.ruleCondList &&
        localRuleData.ruleCondList[0].param1 === RULES_ALWAYS_CONDITION
      ) {
        setSelectedCondition(RULES_ALWAYS_CONDITION);
        setDisabled(true);
      } else {
        setSelectedCondition(RULES_IF_CONDITION);
        setDisabled(false);
      }

      if (isRuleBeingCreated) {
        //updated by mahtab
        let temp = rules && rules?.length > 0 ? [...rules] : [];
        temp.splice(selectedRule, 1);
        setRules(temp);
        setGlobalData(temp);
        setSelectedRule((prevCount) => {
          if (prevCount > 0) {
            return prevCount;
          } else {
            return 0;
          }
        });
        setShowAddRuleButton(true);
      }
      setIsRuleBeingModified(false);
      setIsRuleBeingCreated(false);
      setCheckValidation(false);
      setDoesSelectedRuleHaveErrors(false);
      setRuleConditionErrors(false);
    }
  };

  // Function that gets called and adds a new rule condition, when the user adds a logical operator to a rule condition.
  const addNewCondition = (value, index, ruleDataLength) => {
    if (value !== "3" && index === ruleDataLength - 1) {
      let maxId = 0;
      localRuleData.ruleCondList.forEach((element) => {
        if (element.condOrderId > maxId) {
          maxId = element.condOrderId;
        }
      });

      let newCondition = getTaskRuleConditionObject(+maxId + 1);
      newCondition = { ...newCondition, ruleType: ruleCondType };
      const temp = { ...localRuleData };
      temp.ruleCondList.push(newCondition);
      setLocalRuleData(temp);
      setCheckValidation(false);
    } else if (value === "3" && ruleDataLength > 1) {
      const temp = { ...localRuleData };
      temp.ruleCondList.splice(temp.ruleCondList.length - 1, 1);
      setLocalRuleData(temp);
    }
  };

  // Function that runs when the user deletes a condition.
  const deleteCondition = (ind) => {
    let temp = JSON.parse(JSON.stringify(localRuleData));
    temp.ruleCondList.splice(ind, 1);
    if (temp.ruleCondList.length > 0) {
      temp.ruleCondList[temp.ruleCondList.length - 1].logicalOp = "3";
    }
    setLocalRuleData(temp);
    if (!isRuleBeingCreated) {
      setIsRuleBeingModified(true);
    }
  };

  // Function that is used to handle if and always conditions.
  const optionSelector = (event) => {
    setSelectedCondition(event.target.value);
    setRuleConditionErrors(false);
    setRuleCondType(DATA_TYPE_RULE_COND);
    let ruleCondList = [getTaskRuleConditionObject()];
    if (event.target.value === RULES_ALWAYS_CONDITION) {
      ruleCondList = [
        {
          condOrderId: 1,
          ruleType: "V",
          extObjID1: "0",
          extObjID2: "0",
          logicalOp: "4",
          operator: "4",
          param1: "Always",
          param2: "Always",
          type1: "S",
          type2: "S",
          varFieldId_1: "0",
          varFieldId_2: "0",
          variableId_1: "0",
          variableId_2: "0",
        },
      ];
    }
    let temp = { ...localRuleData };
    temp.ruleCondList = [...ruleCondList];
    setLocalRuleData(temp);
    if (event.target.value === RULES_ALWAYS_CONDITION) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    if (!isRuleBeingCreated) {
      setIsRuleBeingModified(true);
    }
  };

  // This function runs when any pinned tile is dragged and dropped in the list.
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    let rulesArray = JSON.parse(JSON.stringify(rules));
    const [reOrderedTile] = rulesArray.splice(source.index, 1);
    rulesArray.splice(destination.index, 0, reOrderedTile);
    setSelectedRule(destination.index);
    rulesArray.forEach((element, index) => {
      element.ruleOrderId = index + 1;
    });
    setRules(rulesArray);
    setGlobalData(rulesArray);
  };

  // Function that gets called when the user clicks on the add rule button after defining a new rule.
  const addRuleHandler = () => {
    setCheckValidation(true);
    setAddClicked(true);
  };

  const removeRuleCalFlagAccToVariable = (opList) => {
    let updateOpList = JSON.parse(JSON.stringify(opList));
    updateOpList.forEach((element) => {
      if (element.opType === SET_OPERATION_TYPE) {
        const varDetails = getVariableByName(
          element.param1,
          activityProcessData?.Variable
        );
        if (+varDetails?.VariableType !== DATE_VARIABLE_TYPE) {
          element.ruleCalFlag = "";
        }
      }
    });
    return updateOpList;
  };

  // Function that runs when the user clicks on add rule after defining a rule.
  const addRule = () => {
    let ruleCondList = [];
    let ruleOpList = [];
    localRuleData?.ruleCondList?.forEach((element) => {
      const conditionObject = {
        condOrderId: element.condOrderId,
        param1: element.param1,
        type1: element.type1,
        extObjID1: element.extObjID1,
        variableId_1: element.variableId_1,
        varFieldId_1: element.varFieldId_1,
        operator: element.operator === "" ? "0" : element.operator,
        param2: element.param2,
        type2: element.type2,
        extObjID2: element.extObjID2,
        variableId_2: element.variableId_2,
        varFieldId_2: element.varFieldId_2,
        logicalOp: element.logicalOp,
        ruleType: element.ruleType,
      };
      ruleCondList.push(conditionObject);
    });
    localRuleData?.ruleOpList?.forEach((element) => {
      let operationObject = {};
      operationObject = getTaskRuleOperationDataObj(element);
      ruleOpList.push(operationObject);
    });
    const temp = [...rules];
    temp[selectedRule].ruleCondList = ruleCondList;
    temp[selectedRule].ruleOpList = removeRuleCalFlagAccToVariable(ruleOpList);
    setRules(temp);
    setGlobalData(temp);
    setRuleCondType(DATA_TYPE_RULE_COND);
    setIsRuleBeingCreated(false);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.task]: { isModified: true, hasError: false },
      })
    );
    setShowAddRuleButton(true);
    setAddClicked(false);
  };

  // Function that gets called when the user clicks on add rule button in the left panel to add a new rule locally.
  const addRuleLocally = () => {
    expandDrawer(true);
    setDoesSelectedRuleHaveErrors(false);
    setCheckValidation(false);
    setIsRuleBeingCreated(true);
    let maxRuleId = 0;
    rules?.length > 0 &&
      rules?.forEach((element) => {
        if (element.ruleOrderId > maxRuleId) {
          maxRuleId = element.ruleOrderId;
        }
      });

    let newRule = {
      ruleId: +maxRuleId + 1 + "",
      ruleOrderId: +maxRuleId + 1,
      ruleLabel: "",
      ruleType: getRuleType(cellActivityType, cellActivitySubType),
      ruleCondList: [getTaskRuleConditionObject()],
      ruleOpList: [getTaskRuleOperationObject(1)],
    };

    let temp = rules?.length > 0 ? [...rules] : [];
    temp.push(newRule);
    setRules(temp);
    setSelectedRule(temp.length - 1);
    setShowAddRuleButton(false);
  };

  // Function that gets called when the user clicks on add operation button for a new or existing rule.
  const addNewOperation = () => {
    let maxOrderId = 0;
    localRuleData.ruleOpList?.length > 0 &&
      localRuleData.ruleOpList?.forEach((element) => {
        if (element.opOrderId > maxOrderId) {
          maxOrderId = element.opOrderId;
        }
      });
    let newOperation;

    newOperation = getTaskRuleOperationObject(maxOrderId + 1);
    const temp = { ...localRuleData };
    temp.ruleOpList.push(newOperation);
    setLocalRuleData(temp);
    setDoesSelectedRuleHaveErrors(false);
    setCheckValidation(false);
  };

  // Function that gets called when the user clicks on delete operation button for a new or existing rule.
  const deleteOperation = (index) => {
    let temp = JSON.parse(JSON.stringify(localRuleData));
    temp.ruleOpList.splice(index, 1);
    setLocalRuleData(temp);
    if (temp.ruleOpList.length > 0) {
      temp.ruleOpList[temp.ruleOpList.length - 1].logicalOp = "3";
    }
    if (!isRuleBeingCreated) {
      setIsRuleBeingModified(true);
    }
  };

  // Function that gets called when the user modifies an existing rule and clicks on modify rule button.
  const modifyRule = () => {
    let ruleCondList = [];
    let ruleOpList = [];

    localRuleData?.ruleCondList.forEach((element) => {
      const conditionObject = {
        condOrderId: element.CondOrderId,
        param1: element.param1,
        type1: element.type1,
        extObjID1: element.extObjID1,
        variableId_1: element.VariableId_1,
        varFieldId_1: element.VarFieldId_1,
        operator: element.operator || "0",
        param2: element.param2,
        type2: element.type2,
        extObjID2: element.extObjID2,
        variableId_2: element.VariableId_2,
        varFieldId_2: element.VarFieldId_2,
        logicalOp: element.logicalOp,
      };
      ruleCondList.push(conditionObject);
    });

    localRuleData?.ruleOpList.forEach((element) => {
      let operationObject = {};
      operationObject = getTaskRuleOperationDataObj(element);
      ruleOpList.push(operationObject);
    });

    const temp = [...rules];
    temp[selectedRule].ruleCondList = localRuleData.ruleCondList;
    temp[selectedRule].ruleOpList = localRuleData.ruleOpList;
    setRules(temp);
    setGlobalData(temp);
    setIsRuleBeingModified(false);
    setRuleCondType(DATA_TYPE_RULE_COND);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.task]: { isModified: true, hasError: false },
      })
    );
  };

  // Function that gets called when the user clicks on the cancel button while adding a new rule.
  const cancelRule = () => {
    let temp = [...rules];
    temp.splice(selectedRule, 1);
    setRules(temp);
    setSelectedRule((prevCount) => {
      if (prevCount > 0) {
        return prevCount - 1;
      } else {
        return 0;
      }
    });
    setCheckValidation(false);
    setDoesSelectedRuleHaveErrors(false);
    setRuleConditionErrors(false);
    setShowAddRuleButton(true);
    setRuleCondType(DATA_TYPE_RULE_COND);
    setIsRuleBeingCreated(false);
  };

  // Function that gets called when the user clicks on the cancel button after making changes to an existing rule.
  const restoreRuleChanges = () => {
    let temp = { ...localRuleData };
    const tempActJSON = JSON.parse(JSON.stringify(localActivityPropertyData));
    let activityDataArr =
      tempActJSON?.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap[
        taskInfo?.taskTypeInfo?.taskName
      ]?.m_arrRuleInfo;
    let tempArr = [...rules];
    temp.ruleCondList = activityDataArr[selectedRule].ruleCondList;
    temp.ruleOpList = activityDataArr[selectedRule].ruleOpList;
    setLocalRuleData(temp);
    tempArr[selectedRule].ruleCondList =
      activityDataArr[selectedRule].ruleCondList;
    tempArr[selectedRule].ruleOpList = activityDataArr[selectedRule].ruleOpList;
    setRules(tempArr);
    setIsRuleBeingModified(false);
    setRuleCondType(DATA_TYPE_RULE_COND);
    setIsRuleBeingCreated(false);
  };

  // Function that gets called when the user deletes an existing rule.
  const deleteRule = () => {
    let temp = [...rules];
    temp.splice(selectedRule, 1);
    setRules(temp);
    setGlobalData(temp);
    setSelectedRule((prevCount) => {
      if (prevCount > 0) {
        return prevCount - 1;
      } else return 0;
    });
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.task]: { isModified: true, hasError: false },
      })
    );
  };

  // Function that gets called to shorten the length of rule statement.
  const shortenRuleStatement = (str, num) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  // Function that builds the rule statement for a rule.
  const buildRuleStatement = (index) => {
    let ruleStatement = "";
    let operationStatement = "";
    let ruleType = RULES_IF_CONDITION;
    if (
      rules[index].ruleCondList &&
      rules[index].ruleCondList[0].param1 === RULES_ALWAYS_CONDITION
    ) {
      ruleType = RULES_ALWAYS_CONDITION;
    }
    rules[index].ruleCondList.forEach((element) => {
      if (element.ruleType === DATA_TYPE_RULE_COND) {
        const concatenatedString = ruleStatement.concat(
          SPACE,
          element.param1,
          SPACE,
          t("is"),
          SPACE,
          getConditionalOperator(element.operator),
          SPACE,
          element.param2,
          SPACE,
          getLogicalOperator(element.logicalOp)
        );
        ruleStatement = concatenatedString;
      } else if (element.ruleType === DOC_TYPE_RULE_COND) {
        const concatenatedString = ruleStatement.concat(
          SPACE,
          element.param1,
          SPACE,
          t("isPresent"),
          SPACE,
          getLogicalOperator(element.logicalOp)
        );
        ruleStatement = concatenatedString;
      } else if (element.ruleType === TASK_TYPE_RULE_COND) {
        const concatenatedString = ruleStatement.concat(
          SPACE,
          element.param1,
          SPACE,
          getTaskStatus[element.param2],
          SPACE,
          getLogicalOperator(element.logicalOp)
        );
        ruleStatement = concatenatedString;
      }
    });

    // Function that builds the operation text.
    function getOperationText(element) {
      switch (element.opType) {
        case MANDATORY_OPERATION_TYPE:
        case SET_READY_OPERATION_TYPE:
        case OPTIONAL_OPERATION_TYPE:
        case AUTO_INITIATE_OPERATION_TYPE:
          return getTypedropdown(element.opType) + SPACE + element.param1;
        case SET_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            element.param1 +
            SPACE +
            EQUAL_TO +
            SPACE +
            (isValueDateType(element.param2).isValDateType
              ? moment(element.param2).format("DD/MM/YYYY")
              : element.param2) +
            SPACE +
            getOperator(element.operator) +
            SPACE +
            element.param3
          );
        default:
          return "";
      }
    }

    // Function to check if the operation is the last operation or not.
    const isLastOperation = (elemIndex) => {
      return elemIndex === rules[index].ruleOpList.length - 1;
    };

    rules[index].ruleOpList.forEach((element, elemIndex) => {
      const concatenatedOperations = operationStatement.concat(
        getOperationText(element),
        !isLastOperation(elemIndex) ? "," : ".",
        SPACE
      );
      operationStatement = concatenatedOperations;
    });

    // Function that gets the final rule statement.
    function getFinalRuleStatement() {
      if (ruleType === RULES_ALWAYS_CONDITION) {
        let alwaysOpList = "";
        rules[index].ruleOpList.forEach((element, elemIndex) => {
          const concatenatedOperations = alwaysOpList.concat(
            getOperationText(element),
            !isLastOperation(elemIndex) ? "," : ".",
            SPACE
          );
          alwaysOpList = concatenatedOperations;
        });
        return ruleType + SPACE + alwaysOpList;
      } else {
        return (
          ruleType + ruleStatement + t("then") + SPACE + operationStatement
        );
      }
    }

    return getFinalRuleStatement();
  };

  return (
    <>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.ruleScreen
            : styles.ruleScreen
        }
        style={{
          height: "48vh",
          maxHeight: "48vh",
        }}
      >
        {rulesCount > 0 || isRuleBeingCreated ? (
          <>
            <div
              className={styles.leftPanel}
              style={{
                width: "26%",
              }}
            >
              <div>
                {rulesCount === 0 ? (
                  <div
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.flexRow1
                        : styles.flexRow1
                    }
                  >
                    <p
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.noRuleDefined
                          : styles.noRuleDefined
                      }
                    >
                      {t("no")}
                      {SPACE + t("rulesAreDefined")}
                    </p>
                    {!isReadOnly && showAddRuleButton ? (
                      <button
                        id="AR_Add_Rule_Locally"
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.addRuleLocallyButton
                            : styles.addRuleLocallyButton
                        }
                        onClick={addRuleLocally}
                      >
                        {t("addRule")}
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.flexRow1
                        : styles.flexRow1
                    }
                  >
                    <p
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.noRuleDefined
                          : styles.noRuleDefined
                      }
                      style={{ fontSize: "1.1rem", marginRight: "0.8rem" }}
                    >
                      {rulesCount === 1
                        ? rulesCount + SPACE + t("ruleIsDefined")
                        : rulesCount + SPACE + t("rulesAreDefined")}
                    </p>
                    {!isReadOnly && showAddRuleButton ? (
                      <button
                        id="AR_Add_Rule_Locally"
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.addRuleLocallyButton
                            : styles.addRuleLocallyButton
                        }
                        onClick={addRuleLocally}
                      >
                        {t("addRule")}
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
              <div className={styles.rulesList}>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="rules_reordering">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <ul>
                          {rules && rules.length !== 0 ? (
                            rules.map((element, index) => {
                              return (
                                <Draggable
                                  key={`${element.ruleId}`}
                                  draggableId={`${element.ruleId}`}
                                  index={index}
                                  isDragDisabled={
                                    element?.ruleCondList[0]?.param1 ===
                                    RULES_OTHERWISE_CONDITION
                                  }
                                >
                                  {(provided) => (
                                    <div
                                      id="AR_Open_Rule"
                                      className={
                                        selectedRule === index
                                          ? direction === RTL_DIRECTION
                                            ? arabicStyles.ruleStatement
                                            : styles.ruleStatement
                                          : direction === RTL_DIRECTION
                                          ? arabicStyles.restList
                                          : styles.restList
                                      }
                                      onClick={() =>
                                        handleSelectedRuleChange(index)
                                      }
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      ref={provided.innerRef}
                                    >
                                      <RuleStatement
                                        index={index}
                                        rules={rules}
                                        isOtherwiseSelected={
                                          isOtherwiseSelected
                                        }
                                        provided={provided}
                                        isRuleBeingCreated={
                                          index === selectedRule
                                            ? isRuleBeingCreated
                                            : false
                                        }
                                        buildRuleStatement={buildRuleStatement}
                                        shortenRuleStatement={
                                          shortenRuleStatement
                                        }
                                        calledFromAction={false}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })
                          ) : (
                            <li
                              className={
                                direction === RTL_DIRECTION
                                  ? arabicStyles.restList
                                  : styles.restList
                              }
                            >
                              {t("no")}
                              {SPACE + t("rulesAreDefined")}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.verticalDivision
                  : styles.verticalDivision
              }
            ></div>
            <div
              style={{
                width: "74%",
              }}
            >
              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.rightPanel
                    : styles.rightPanel
                }
              >
                <div className={styles.flexRow1} style={{ marginBottom: "0" }}>
                  <p
                    className={styles.mainHeading}
                    style={{
                      fontSize: "var(--subtitle_text_font_size)",
                      display: "flex",
                    }}
                  >
                    {t("rulesCondition")}
                    <span className={styles.starIcon}>*</span>
                  </p>

                  {isRuleBeingCreated ? (
                    <div
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.buttonsDiv
                          : styles.buttonsDiv
                      }
                    >
                      <button
                        id="AR_Cancel_Rule_Changes"
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.cancelHeaderBtn
                            : styles.cancelHeaderBtn
                        }
                        onClick={cancelRule}
                        style={{
                          display: isReadOnly ? "none" : "",
                        }}
                      >
                        {t("cancel")}
                      </button>
                      <button
                        id="AR_Add_Rule_Button"
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.addHeaderBtn
                            : styles.addHeaderBtn
                        }
                        onClick={addRuleHandler}
                        style={{
                          display: isReadOnly ? "none" : "",
                        }}
                      >
                        {t("addRule")}
                      </button>
                    </div>
                  ) : (
                    <div
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.buttonsDiv
                          : styles.buttonsDiv
                      }
                    >
                      {!isOtherwiseSelected && (
                        <button
                          id="AR_Delete_Rule_Button"
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.cancelHeaderBtn
                              : styles.cancelHeaderBtn
                          }
                          onClick={deleteRule}
                          style={{
                            display: isReadOnly ? "none" : "",
                          }}
                        >
                          {t("delete")}
                        </button>
                      )}

                      {isRuleBeingModified ? (
                        <div className={styles.buttonsDiv}>
                          <button
                            id="AR_Cancel_Rule_Changes"
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.cancelHeaderBtn
                                : styles.cancelHeaderBtn
                            }
                            onClick={restoreRuleChanges}
                            style={{
                              display: isReadOnly ? "none" : "",
                            }}
                          >
                            {t("cancel")}
                          </button>
                          <button
                            id="AR_Modify_Rule"
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.addHeaderBtn
                                : styles.addHeaderBtn
                            }
                            onClick={modifyRule}
                            style={{
                              display: isReadOnly ? "none" : "",
                            }}
                          >
                            {t("modifyRule")}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
                <div>
                  {ruleConditionErrors ? (
                    <p className={styles.errorStatement}>
                      {t("mandatoryErrorStatement")}
                    </p>
                  ) : null}
                </div>
                <div className={styles.ruleData} style={{ height: "87%" }}>
                  <div style={{ display: "flex", alignItems: "end" }}>
                    <RadioGroup
                      onChange={(e) => optionSelector(e)}
                      value={selectedCondition}
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.radioButton
                          : styles.radioButton
                      }
                    >
                      <FormControlLabel
                        disabled={isReadOnly || isOtherwiseSelected}
                        id="AR_Always_Option"
                        className={styles.radioOption}
                        value={RULES_ALWAYS_CONDITION}
                        control={
                          <Radio
                            style={{
                              color: "var(--radio_color)",
                              padding: "0.5rem 0.5vw 0.5rem 0.75vw",
                            }}
                          />
                        }
                        label={
                          <p style={{ fontSize: "var(--base_text_font_size)" }}>
                            {t("always")}
                          </p>
                        }
                      />
                      <FormControlLabel
                        disabled={isReadOnly || isOtherwiseSelected}
                        id="AR_If_Option"
                        value={RULES_IF_CONDITION}
                        control={
                          <Radio
                            style={{
                              color: "var(--radio_color)",
                              padding: "0.5rem 0.5vw 0.5rem 0.75vw",
                            }}
                          />
                        }
                        label={
                          <p style={{ fontSize: "var(--base_text_font_size)" }}>
                            {t("if")}
                          </p>
                        }
                      />
                    </RadioGroup>
                    <div
                      style={{
                        display: "flex",
                        gap: "1vw",
                        alignItems: "center",
                        marginBottom: "0.25rem",
                        width: "100%",
                      }}
                    >
                      <p className={clsx(styles.operationsLabel)}>
                        {t("conditionType")}
                      </p>
                      <Select
                        id="ruleCondType"
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
                        className={styles.selectInput}
                        disabled={disabled}
                        value={ruleCondType}
                        onChange={(e) => {
                          setRuleCondType(e.target.value);
                          setLocalRuleData((prev) => {
                            let temp = { ...prev };
                            temp.ruleCondList[
                              temp.ruleCondList?.length - 1
                            ].ruleType = e.target.value;
                            return temp;
                          });
                        }}
                      >
                        <MenuItem
                          className={styles.menuItemStyles}
                          key={DATA_TYPE_RULE_COND}
                          value={DATA_TYPE_RULE_COND}
                        >
                          {t("data")}
                        </MenuItem>
                        <MenuItem
                          className={styles.menuItemStyles}
                          key={DOC_TYPE_RULE_COND}
                          value={DOC_TYPE_RULE_COND}
                        >
                          {t("document")}
                        </MenuItem>
                        <MenuItem
                          className={styles.menuItemStyles}
                          key={TASK_TYPE_RULE_COND}
                          value={TASK_TYPE_RULE_COND}
                        >
                          {t("task")}
                        </MenuItem>
                      </Select>
                    </div>
                  </div>
                  {localRuleData?.ruleCondList?.length > 0 &&
                    localRuleData?.ruleCondList?.map((element, index) => {
                      return (
                        <AddCondition
                          localRuleData={localRuleData}
                          setLocalRuleData={setLocalRuleData}
                          index={index}
                          addNewCondition={addNewCondition}
                          deleteCondition={deleteCondition}
                          selectedRule={selectedRule}
                          disabled={disabled}
                          isRuleBeingCreated={isRuleBeingCreated}
                          setIsRuleBeingModified={setIsRuleBeingModified}
                          isReadOnly={isReadOnly}
                          checkValidation={checkValidation}
                          setCheckValidation={setCheckValidation}
                          ruleConditionErrors={ruleConditionErrors}
                          setRuleConditionErrors={setRuleConditionErrors}
                          isAlwaysRule={
                            selectedCondition === RULES_ALWAYS_CONDITION
                          }
                          taskInfo={taskInfo}
                          associatedTasks={associatedTasks}
                        />
                      );
                    })}

                  <React.Fragment>
                    <p className={styles.showHeading}>
                      <span className="flex">
                        {t("operations")}
                        <span className={styles.starIcon}>*</span>
                      </span>
                      <Divider
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.showLine
                            : styles.showLine
                        }
                      />
                    </p>
                    {doesSelectedRuleHaveErrors ? (
                      <p className={styles.errorStatement}>
                        {t("mandatoryErrorStatement")}
                      </p>
                    ) : null}
                    {!isReadOnly ? (
                      <button
                        id="AR_Add_New_Operation"
                        onClick={addNewOperation}
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.addOperationButton
                            : styles.addOperationButton
                        }
                      >
                        {t("addOperation")}
                      </button>
                    ) : null}
                    {localRuleData?.ruleOpList?.length > 0 &&
                      localRuleData.ruleOpList.map((element, index) => {
                        return (
                          <AddOperations
                            index={index}
                            localRuleData={localRuleData}
                            setLocalRuleData={setLocalRuleData}
                            selectedRule={selectedRule}
                            deleteOperation={deleteOperation}
                            isRuleBeingCreated={isRuleBeingCreated}
                            setIsRuleBeingModified={setIsRuleBeingModified}
                            isReadOnly={isReadOnly}
                            operationsAllowed={operationsAllowed}
                            checkValidation={checkValidation}
                            setCheckValidation={setCheckValidation}
                            setDoesSelectedRuleHaveErrors={
                              setDoesSelectedRuleHaveErrors
                            }
                            showDelIcon={localRuleData?.ruleOpList?.length > 1}
                          />
                        );
                      })}
                  </React.Fragment>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.noRulesDiv}>
            <NoRulesScreen isReadOnly={isReadOnly} />
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                id="AR_Add_Rule_Locally"
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.addRuleLocallyButton
                    : styles.addRuleLocallyButton
                }
                style={{ display: isReadOnly ? "none" : "" }}
                onClick={addRuleLocally}
              >
                {t("addRule")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    cellActivityTypeName: state.selectedCellReducer.selectedActivityTypeName,
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    expandDrawer: (flag) => dispatch(actionCreators.expandDrawer(flag)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskRules);
