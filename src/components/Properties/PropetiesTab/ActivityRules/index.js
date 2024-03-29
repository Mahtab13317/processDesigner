// #BugID - 107286
// #BugDescription - Added condition to hide right panel with empty rules message when drawer is collapsed.
// #BugID - 107287
// #BugDescription - Fixed issues for restore changes function by passing correct values.
// #BugID - 107290
// #BugDescription - Added additional checks to prevent rule from adding before all errors are fixed.
// #BugID - 111195
// #BugDescription - Removed global state function for adding rule locally.
// #BugID - 112318
// #BugDescription - Added condition for disabling if radio option in parallel distribute activity.
// #BugID - 112369
// #BugDescription - Added provision to add constants in list with constants already made.
// #BugID - 107757
// #BugDescription - Added checks and conditions for OMS Adapter.
// #BugID - 115262
// #BugDescription - Added checks so that rule description cannot be clicked while rule is being added.
// #BugID - 115261
// #BugDescription - Added conditions to make rule condition have always condition for parallel distribute activity.

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import moment from "moment";
import arabicStyles from "./ArabicStyles.module.css";
import * as actionCreators from "../../../../redux-store/actions/Properties/showDrawerAction.js";
import { connect, useDispatch } from "react-redux";
import { store, useGlobalState } from "state-pool";
import AddOperations from "./AddOperation";
import AddCondition from "./AddCondition";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import axios from "axios";
import clsx from "clsx";
import { getVariableType } from "../../../../utility/ProcessSettings/Triggers/getVariableType";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@material-ui/core";
import {
  PROCESSTYPE_LOCAL,
  SERVER_URL,
  ENDPOINT_GET_REGISTERED_FUNCTIONS,
  RULES_IF_CONDITION,
  RULES_ALWAYS_CONDITION,
  RULES_OTHERWISE_CONDITION,
  SECONDARYDBFLAG,
  SET_OPERATION_TYPE,
  INC_PRIORITY_OPERATION_TYPE,
  DEC_PRIORITY_OPERATION_TYPE,
  TRIGGER_OPERATION_TYPE,
  COMMIT_OPERATION_TYPE,
  ASSIGNED_TO_OPERATION_TYPE,
  SET_PARENT_DATA_OPERATION_TYPE,
  SET_AND_EXECUTE_OPERATION_TYPE,
  ADD_OPERATION_SYSTEM_FUNCTIONS,
  ADD_OPERATION_EXT_FUNCTIONS,
  CALL_OPERATION_TYPE,
  ROUTE_TO_OPERATION_TYPE,
  REINITIATE_OPERATION_TYPE,
  ROLLBACK_OPERATION_TYPE,
  ESCALATE_TO_OPERATION_TYPE,
  AUDIT_OPERATION_TYPE,
  ESCALATE_WITH_TRIGGER_OPERATION_TYPE,
  DISTRIBUTE_TO_OPERATION_TYPE,
  REMINDER_OPERATION_TYPE,
  Y_FLAG,
  SPACE,
  EQUAL_TO,
  PERCENTAGE_SYMBOL,
  SYSTEM_DEFINED_SCOPE,
  USER_DEFINED_SCOPE,
  RTL_DIRECTION,
  propertiesLabel,
  CONSTANT,
  DATE_VARIABLE_TYPE,
  ADD_OPERATION_SECONDARY_DBFLAG,
} from "../../../../Constants/appConstants";
import {
  getOperator,
  getTypedropdown,
  getLogicalOperator,
  getConditionalOperator,
  getSecondaryDBFlagValue,
  operationFieldKeys,
  databaseExclusiveOperations,
  workdesksOperations,
  distributeOperations,
  replyOperations,
  entryDetailsOperations,
  reminderOperations,
} from "./CommonFunctionCall";
import NoRulesScreen from "./NoRuleScreen";
import RuleStatement from "./RuleStatement";
import {
  getRuleType,
  getRuleConditionObject,
  getRuleOperationObject,
  getRuleOperationDataObj,
  getAlwaysRuleConditionObject,
  isValueDateType,
  otherwiseRuleData,
} from "./CommonFunctions";
import { noIncomingTypes } from "../../../../utility/bpmnView/noIncomingTypes.js";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import TabsHeading from "../../../../UI/TabsHeading";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";
import { getVariableByName } from "../../../../utility/ProcessSettings/Triggers/triggerCommonFunctions";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRef } from "react";
import { FieldValidations } from "../../../../utility/FieldValidations/fieldValidations";

function ActivityRules(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const {
    isDrawerExpanded,
    expandDrawer,
    cellID,
    openProcessID,
    openProcessType,
    cellActivityType,
    cellActivitySubType,
    taskIndex,
    calledFromAction,
    actionData,
    activityTab,
  } = props;
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
  const [registeredFunctions, setRegisteredFunctions] = useState([]); // State to store all the registered functions list data.
  const [registeredOptionsLabelsData, setRegisteredOptionsLabelsData] =
    useState([]); // State to save registered options label and parameter data.
  const [operationsAllowed, setOperationsAllowed] = useState([]); // State to store the operation types allowed in this particular activity.
  const [workstepList, setWorkstepList] = useState([]); // State to store list of all worksteps in a process.
  const [isOtherwiseSelected, setIsOtherwiseSelected] = useState(false); // State to store if rule is otherwise type or not.
  const [variablesWithRights, setVariablesWithRights] = useState(false);
  const [checkValidation, setCheckValidation] = useState(false);
  const [doesSelectedRuleHaveErrors, setDoesSelectedRuleHaveErrors] =
    useState(false);
  const [ruleConditionErrors, setRuleConditionErrors] = useState(false);
  const [actionNameError, setActionNameError] = useState(false);
  const [actionName, setActionName] = useState("");
  const [actions, setActions] = useState([]); //Action data
  const [actionCount, setActionCount] = useState(0); //to show action Count
  const [actionIndex, setActionIndex] = useState(0); //action index
  //---------
  const [addClicked, setAddClicked] = useState(false);
  const [isActParallelDistribute, setIsActParallelDistribute] = useState(false);
  const [currentTabName, setCurrentTabName] = useState(null); //added by mahtab to check the current tab name in an activity
  let isReadOnly = isReadOnlyFunc(activityProcessData, props.cellCheckedOut);
  const actionNameRef = useRef();

  // Function that runs when the component loads.
  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          ENDPOINT_GET_REGISTERED_FUNCTIONS +
          "/" +
          openProcessID +
          "/" +
          openProcessType
      )
      .then((res) => {
        if (res.status === 200) {
          const temp = [...res.data.Methods.Method];
          setRegisteredFunctions(temp);
          getFunctionOptions(temp);
        }
      });
  }, []);

  //added by mahtab to setting current tab
  useEffect(() => {
    if (activityTab !== "") {
      setCurrentTabName(activityTab);
    }
  }, []);

  // Function that validates the rule being currently added/modified.
  const validateRule = () => {
    let conditionFieldsFilled = true,
      operationFieldsFilled = true;
    let conditionFieldKeys = {
      ruleCondition: ["param1", "param2", "operator"],
    };
    localRuleData?.ruleCondList?.forEach((element) => {
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
    });

    localRuleData?.ruleOpList?.forEach((element, i) => {
      //added by mahtab
      let oprtnType = 1;
      if (activityTab === "Reminder") {
        oprtnType = 39;
        operationFieldKeys[oprtnType]?.forEach((value) => {
          var nameSplit = value.split(".");
          nameSplit.pop();
          var name = nameSplit.join(".");
          if (name == "durationInfo") {
            const index = value.lastIndexOf(".");

            const after = value.slice(index + 1);

            if (element[name][after] === "" || element[name][after] === null) {
              operationFieldsFilled = false;
            }
          } else {
            if (element[value] === "" || element[value] === null) {
              operationFieldsFilled = false;
            }
          }

          /* if (element[value] === "" || element[value] === null) {
            operationFieldsFilled = false;
          } */
        });
      } else {
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

  console.log("222", "LOCAL RULE DATA", localRuleData, rules);

  // Function that validates the rule being currently added/modified.
  const validateAction = () => {
    let conditionFieldsFilled = true,
      operationFieldsFilled = true,
      actionNameFilled = true;
    let conditionFieldKeys = {
      ruleCondition: ["param1", "param2", "operator"],
    };

    if (!actionName || actionName?.trim() === "") {
      actionNameFilled = false;
    }

    localRuleData?.ruleCondList?.forEach((element) => {
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
    });

    localRuleData?.ruleOpList?.forEach((element, i) => {
      operationFieldKeys[element.opType]?.forEach((value) => {
        if (element[value] === "" || element[value] === null) {
          operationFieldsFilled = false;
        }
      });
    });

    setDoesSelectedRuleHaveErrors(!operationFieldsFilled);
    setRuleConditionErrors(!conditionFieldsFilled);
    setActionNameError(!actionNameFilled);
    if (operationFieldsFilled && conditionFieldsFilled && actionNameFilled) {
      setCheckValidation(false);
      if (addClicked) {
        addAction();
      }
    } else {
      setAddClicked(false);
    }
  };

  // Function that runs when the localRuleData changes to check the validation in the dropdown and fields.
  useEffect(() => {
    if (checkValidation) {
      if (calledFromAction) {
        validateAction();
      } else {
        validateRule();
      }
    }
  }, [localRuleData, checkValidation]);

  // Function that generates the options for system and external functions based on its parameters.
  const getFunctionOptions = (registeredFuncs) => {
    let functionOptionsList = [];

    // Function that checks if the parameter is the last parameter.
    const isLastParameter = (index, length) => {
      return index === length - 1;
    };

    registeredFuncs &&
      registeredFuncs.forEach((element) => {
        let optionLabel = "";
        let paramLabel = "";
        element.Parameter &&
          element.Parameter.forEach((parameterElement, elemIndex) => {
            const concatenatedParameterLabel = paramLabel.concat(
              getVariableType(parameterElement.ParamType),
              isLastParameter(elemIndex, element.Parameter.length) ? "" : ","
            );
            paramLabel = concatenatedParameterLabel;
          });
        optionLabel = optionLabel.concat(
          element.MethodName,
          "(",
          paramLabel,
          ")"
        );
        const obj = {
          label: optionLabel,
          value: element.MethodName,
          parameters: element.Parameter,
          methodIndex: element.MethodIndex,
        };
        functionOptionsList.push(obj);
      });
    setRegisteredOptionsLabelsData(functionOptionsList);
  };

  // Function that runs when the MileStones data in the activity process data changes and gets the list of all activities in the process with no incoming types.
  useEffect(() => {
    let milestones = activityProcessData.MileStones;
    let activityList = [];
    milestones &&
      milestones.forEach((milestoneElem) => {
        milestoneElem &&
          milestoneElem.Activities.forEach((element) => {
            if (element.ActivityId !== cellID && noIncomingTypes(element, t)) {
              activityList.push(element.ActivityName);
            }
          });
      });
    activityList.unshift("PreviousStage");
    setWorkstepList(activityList);
  }, [activityProcessData.MileStones]);

  // Function to set global data when the user does any action.
  const setGlobalData = (rules) => {
    let temp = JSON.parse(JSON.stringify(localActivityPropertyData));
    if (cellActivityType === 7 && cellActivitySubType === 1) {
      temp.ActivityProperty.routingCriteria.routCriteriaList = rules;
    }
    //added by mahtab
    else if (
      cellActivityType === 4 &&
      cellActivitySubType === 1 &&
      activityTab !== "Reminder"
    ) {
      temp.ActivityProperty.esInfo.esRuleList = rules;
    }
    //added by mahtab
    else if (
      cellActivityType === 4 &&
      cellActivitySubType === 1 &&
      activityTab === "Reminder"
    ) {
      temp.ActivityProperty.reminderInfo.reminderList = rules;
    } else if (
      cellActivityType === 10 &&
      (cellActivitySubType === 3 || cellActivitySubType === 6)
    ) {
      temp.ActivityProperty.esInfo.esRuleList = rules;
    } else if (
      cellActivityType === 5 &&
      (cellActivitySubType === 1 || cellActivitySubType === 2)
    ) {
      temp.ActivityProperty.distributeInfo.disRuleInfo = rules;
    } else if (cellActivityType === 33 && cellActivitySubType === 1) {
      temp.ActivityProperty.esInfo.esRuleList = rules;
    } else if (cellActivityType === 22 && cellActivitySubType === 1) {
      temp.ActivityProperty.esInfo.esRuleList = rules;
    }
    setLocalActivityPropertyData(temp);
    dispatch(setActivityPropertyChange(getDataKey()));
  };

  const setGlobalActionData = (actions) => {
    let temp = JSON.parse(JSON.stringify(localActivityPropertyData));
    let tempList = {};
    actions?.forEach((el) => {
      tempList = { ...tempList, [el.actionId]: el };
    });
    if (temp?.ActivityProperty?.wdeskInfo?.m_objActionDetails?.actionMap) {
      temp.ActivityProperty.wdeskInfo.m_objActionDetails.actionMap = {
        ...tempList,
      };
    } else {
      temp.ActivityProperty.wdeskInfo.m_objActionDetails = {
        ...temp?.ActivityProperty?.wdeskInfo?.m_objActionDetails,
        actionMap: tempList,
      };
    }
    setLocalActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
  };

  // Function that runs when the component loads and is responsible for checking which operations are allowed for the particular activity that is showing the rules now.
  useEffect(() => {
    let operationsList = [];
    if (cellActivityType === 7 && cellActivitySubType === 1) {
      operationsList = databaseExclusiveOperations;
    } else if (
      cellActivityType === 10 &&
      (cellActivitySubType === 3 || cellActivitySubType === 6)
    ) {
      operationsList = workdesksOperations;
    } else if (
      cellActivityType === 5 &&
      (cellActivitySubType === 1 || cellActivitySubType === 2)
    ) {
      operationsList = distributeOperations;
    } else if (cellActivityType === 33 && cellActivitySubType === 1) {
      operationsList = workdesksOperations;
    } else if (cellActivityType === 26 && cellActivitySubType === 1) {
      operationsList = replyOperations;
    }
    //addded by mahtab
    else if (
      cellActivityType === 4 &&
      cellActivitySubType === 1 &&
      activityTab !== "Reminder"
    ) {
      operationsList = entryDetailsOperations;
    }
    //addded by mahtab
    else if (
      cellActivityType === 4 &&
      cellActivitySubType === 1 &&
      activityTab === "Reminder"
    ) {
      operationsList = reminderOperations;
    } else if (cellActivityType === 22 && cellActivitySubType === 1) {
      operationsList = entryDetailsOperations;
    }
    setOperationsAllowed(operationsList);
  }, []);

  // Function that gets called when the props of the component change.
  useEffect(() => {
    setActions(actionData);
  }, [props]);

  // Function that runs when the component loads.
  useEffect(() => {
    if (localActivityPropertyData) {
      const entrySettingsData = JSON.parse(
        JSON.stringify(localActivityPropertyData)
      );
      const dataVariables =
        entrySettingsData.ActivityProperty &&
        entrySettingsData.ActivityProperty.DataVariables;
      setVariablesWithRights(dataVariables);
      let activityData =
        entrySettingsData.ActivityProperty.esInfo &&
        entrySettingsData.ActivityProperty.esInfo.esRuleList;
      if (cellActivityType === 7 && cellActivitySubType === 1) {
        activityData =
          entrySettingsData.ActivityProperty.routingCriteria &&
          entrySettingsData.ActivityProperty.routingCriteria.routCriteriaList;
        if (
          entrySettingsData?.ActivityProperty?.routingCriteria?.routCriteriaList
            ?.length === 0
        ) {
          activityData = otherwiseRuleData;
        }
      }
      //added by mahtab for reminder
      else if (
        cellActivityType === 4 &&
        cellActivitySubType === 1 &&
        activityTab === "Reminder"
      ) {
        activityData =
          entrySettingsData?.ActivityProperty?.reminderInfo &&
          entrySettingsData?.ActivityProperty?.reminderInfo?.reminderList;
      } else if (
        cellActivityType === 5 &&
        (cellActivitySubType === 1 || cellActivitySubType === 2)
      ) {
        activityData =
          entrySettingsData.ActivityProperty.distributeInfo &&
          entrySettingsData.ActivityProperty.distributeInfo.disRuleInfo;
      } else if (cellActivityType === 32 && cellActivitySubType === 1) {
        activityData =
          entrySettingsData &&
          !!taskIndex &&
          entrySettingsData.ActivityProperty &&
          entrySettingsData.ActivityProperty.Interfaces &&
          entrySettingsData.ActivityProperty.Interfaces?.TaskTypes[taskIndex] &&
          entrySettingsData.ActivityProperty.Interfaces?.TaskTypes[taskIndex]
            .TaskRules;
      }
      setRules(
        entrySettingsData && entrySettingsData.ActivityProperty && activityData
      );
      const dataObj = {
        ruleCondList: (entrySettingsData &&
          entrySettingsData.ActivityProperty &&
          activityData &&
          activityData?.length > 0 &&
          activityData[selectedRule]?.ruleCondList) || [
          getRuleConditionObject(),
        ],
        ruleOpList: (entrySettingsData &&
          entrySettingsData.ActivityProperty &&
          activityData &&
          activityData?.length > 0 &&
          activityData[selectedRule]?.ruleOpList) || [
          getRuleOperationObject(1, activityTab === "Reminder" && "39"),
        ],
      };
      setLocalRuleData({ ...dataObj });
    }
  }, [localActivityPropertyData?.ActivityProperty, taskIndex]);

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

  // Function that runs when the activity type and activity subtype changes.
  useEffect(() => {
    if (cellActivityType === 5 && cellActivitySubType === 2) {
      setIsActParallelDistribute(true);
      setSelectedCondition(RULES_ALWAYS_CONDITION);
    }
  }, [cellActivityType, cellActivitySubType, showAddRuleButton]);

  // Function to set the rule count.
  useEffect(() => {
    if (rules && !isRuleBeingCreated) {
      setRulesCount(rules.length);
    }
  }, [rules]);

  // Function to set the action count.
  useEffect(() => {
    if (actions && !isRuleBeingCreated) {
      setActionCount(actions.length);
    }
  }, [actions]);

  // Function that runs when the selected rule changes or rules are added,deleted or modified.
  useEffect(() => {
    if (
      rules &&
      rules[selectedRule] &&
      rules[selectedRule].ruleCondList &&
      rules[selectedRule].ruleCondList[0].param1 === RULES_ALWAYS_CONDITION
    ) {
      setSelectedCondition(RULES_ALWAYS_CONDITION);
      setDisabled(true);
      setIsOtherwiseSelected(false);
    } else if (
      rules &&
      rules[selectedRule] &&
      rules[selectedRule].ruleCondList &&
      rules[selectedRule].ruleCondList[0].param1 === RULES_OTHERWISE_CONDITION
    ) {
      setSelectedCondition(RULES_OTHERWISE_CONDITION);
      setDisabled(true);
      setIsOtherwiseSelected(true);
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
      } else if (
        rules &&
        rules[selectedRule] &&
        rules[selectedRule].ruleCondList &&
        rules[selectedRule].ruleCondList[0].param1 === RULES_OTHERWISE_CONDITION
      ) {
        setSelectedCondition(RULES_OTHERWISE_CONDITION);
        setDisabled(true);
        setIsOtherwiseSelected(true);
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

      let newCondition = getRuleConditionObject(+maxId + 1);
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
    let ruleCondList = [getRuleConditionObject()];
    if (event.target.value === RULES_ALWAYS_CONDITION) {
      ruleCondList = [
        {
          condOrderId: 1,
          datatype1: "",
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
    temp.ruleCondList = ruleCondList;
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
      if (
        element.opType ===
        (SET_OPERATION_TYPE || SET_PARENT_DATA_OPERATION_TYPE)
      ) {
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
    localRuleData &&
      localRuleData.ruleCondList.forEach((element) => {
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
        };
        ruleCondList.push(conditionObject);
      });
    localRuleData &&
      localRuleData.ruleOpList.forEach((element) => {
        let operationObject = {};
        operationObject = getRuleOperationDataObj(element);
        ruleOpList.push(operationObject);
      });
    const temp = [...rules];
    temp[selectedRule].ruleCondList = ruleCondList;
    temp[selectedRule].ruleOpList = removeRuleCalFlagAccToVariable(ruleOpList);

    setRules(temp);
    setGlobalData(temp);
    setIsRuleBeingCreated(false);
    dispatch(setActivityPropertyChange(getDataKey()));
    setShowAddRuleButton(true);
    setAddClicked(false);
  };

  // Function that runs when the user clicks on add rule after defining a rule.
  const addAction = () => {
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
      };
      ruleCondList.push(conditionObject);
    });
    localRuleData?.ruleOpList?.forEach((element) => {
      let operationObject = {};
      operationObject = getRuleOperationDataObj(element);
      ruleOpList.push(operationObject);
    });
    const temp = [...actions];
    temp[actionIndex].actionName = actionName;
    temp[actionIndex].ruleInfo.ruleCondList = ruleCondList;
    temp[actionIndex].ruleInfo.ruleOpList =
      removeRuleCalFlagAccToVariable(ruleOpList);
    setActions(temp);
    setGlobalActionData(temp);
    setIsRuleBeingCreated(false);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
    setShowAddRuleButton(true);
    setAddClicked(false);
  };

  // Function that tells which key is to be updated for save changes according to activity type and subtype.
  const getDataKey = () => {
    if (cellActivityType === 7 && cellActivitySubType === 1) {
      return {
        [propertiesLabel.routingCriteria]: {
          isModified: true,
          hasError: false,
        },
      };
    } else if (
      (cellActivityType === 10 &&
        (cellActivitySubType === 3 || cellActivitySubType === 6)) ||
      (cellActivityType === 33 && cellActivitySubType === 1)
    ) {
      return {
        [propertiesLabel.EntrySetting]: { isModified: true, hasError: false },
      };
    }
    //added by mahtab
    else if (
      cellActivityType === 4 &&
      cellActivitySubType === 1 &&
      activityTab !== "Reminder"
    ) {
      return {
        [propertiesLabel.EntrySetting]: { isModified: true, hasError: false },
      };
    }
    //added by mahtab
    else if (
      cellActivityType === 4 &&
      cellActivitySubType === 1 &&
      activityTab === "Reminder"
    ) {
      return {
        [propertiesLabel.reminder]: { isModified: true, hasError: false },
      };
    } else if (
      cellActivityType === 5 &&
      (cellActivitySubType === 1 || cellActivitySubType === 2)
    ) {
      return {
        [propertiesLabel.distribute]: { isModified: true, hasError: false },
      };
    } else if (cellActivityType === 22 && cellActivitySubType === 1) {
      return {
        [propertiesLabel.webService]: { isModified: true, hasError: false },
      };
    }
  };

  // Function that gets called when the user clicks on add rule button in the left panel to add a new rule locally.
  const addRuleLocally = () => {
    expandDrawer(true);
    let isParallelDistribute = false;
    if (cellActivityType === 5 && cellActivitySubType === 2) {
      isParallelDistribute = true;
    }
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
      ruleCondList: [
        isParallelDistribute
          ? getAlwaysRuleConditionObject()
          : getRuleConditionObject(),
      ],
      ruleOpList: [
        getRuleOperationObject(1, activityTab === "Reminder" && "39"),
      ],
    };

    let temp = rules?.length > 0 ? [...rules] : []; //updated by mahtab
    temp.push(newRule);
    setRules(temp);
    setSelectedRule(temp.length - 1);
    setShowAddRuleButton(false);
    if (isParallelDistribute) {
      let rest = JSON.parse(JSON.stringify(localRuleData));
      setLocalRuleData({
        ...rest,
        ruleCondList: [getAlwaysRuleConditionObject()],
      });
    }
  };

  // Function that gets called when the user clicks on add action button in the left panel to add a new action locally.
  const addActionLocally = () => {
    expandDrawer(true);
    let maxActionId = 0;
    actions?.length > 0 &&
      actions.forEach((element) => {
        if (+element.actionId > +maxActionId) {
          maxActionId = element.actionId;
        }
      });
    let newAction = {
      actionId: +maxActionId + 1 + "",
      actionName: "New Action",
      ruleInfo: {
        ruleCondList: [getRuleConditionObject()],
        ruleOpList: [getRuleOperationObject()],
        ruleLabel: "",
        ruleId: +maxActionId + 1 + "",
        ruleOrderId: +maxActionId + 1,
        ruleType: "A",
      },
    };
    let temp = actions?.length > 0 ? [...actions] : [];
    temp.push(newAction);
    setActions(temp);
    setActionIndex(temp.length - 1);
    setActionName("");
    setShowAddRuleButton(false);
    setDoesSelectedRuleHaveErrors(false);
    setCheckValidation(false);
    setIsRuleBeingCreated(true);
    const timeout = setTimeout(() => {
      const input = document.getElementById("ActionNameInput");
      input.select();
      input.focus();
    }, 500);
    return () => clearTimeout(timeout);
  };

  // Function that gets called when the user clicks on add operation button for a new or existing rule.
  const addNewOperation = () => {
    let maxOrderId = 0;
    if (!lastOperationValidation()) {
      localRuleData.ruleOpList &&
        localRuleData.ruleOpList.length > 0 &&
        localRuleData.ruleOpList.forEach((element) => {
          if (element.opOrderId > maxOrderId) {
            maxOrderId = element.opOrderId;
          }
        });
      let newOperation;

      newOperation = getRuleOperationObject(maxOrderId + 1);
      const temp = { ...localRuleData };
      temp.ruleOpList.push(newOperation);
      setLocalRuleData(temp);
      setDoesSelectedRuleHaveErrors(false);
      setCheckValidation(false);
    }
  };

  // Function to check the last operations for validation.
  const lastOperationValidation = () => {
    let temp = false;
    const arr = localRuleData && localRuleData.ruleOpList;
    const operationType = arr[arr.length - 1]?.opType;
    switch (operationType) {
      case ROUTE_TO_OPERATION_TYPE:
        dispatch(
          setToastDataFunc({
            message: `${getTypedropdown(operationType)} is the last operation`,
            severity: "error",
            open: true,
          })
        );
        temp = true;
        break;
      case AUDIT_OPERATION_TYPE:
        temp = true;
        dispatch(
          setToastDataFunc({
            message: `${getTypedropdown(operationType)} is the last operation`,
            severity: "error",
            open: true,
          })
        );
        break;
      default:
        break;
    }
    return temp;
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

    localRuleData &&
      localRuleData.ruleCondList.forEach((element) => {
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

    localRuleData &&
      localRuleData.ruleOpList.forEach((element) => {
        let operationObject = {};

        if (cellActivityType === 7 && cellActivitySubType === 1) {
          operationObject = { ...element };
        } else {
          operationObject = getRuleOperationDataObj(element);
        }
        ruleOpList.push(operationObject);
      });

    if (calledFromAction) {
      const temp = [...actions];
      temp[actionIndex].ruleInfo.ruleCondList = localRuleData.ruleCondList;
      temp[actionIndex].ruleInfo.ruleOpList = localRuleData.ruleOpList;
      temp[actionIndex].actionName = actionName;
      setActions(temp);
      setGlobalActionData(temp);
      setIsRuleBeingModified(false);
    } else {
      const temp = [...rules];
      temp[selectedRule].ruleCondList = localRuleData.ruleCondList;
      temp[selectedRule].ruleOpList = localRuleData.ruleOpList;
      setRules(temp);
      setGlobalData(temp);
      setIsRuleBeingModified(false);
      dispatch(setActivityPropertyChange(getDataKey()));
    }
  };

  // Function that gets called when the user clicks on the cancel button while adding a new rule.
  const cancelRule = () => {
    if (calledFromAction) {
      let temp = [...actions];
      temp.splice(actionIndex, 1);
      setActions(temp);
      setActionIndex((prevCount) => {
        if (prevCount > 0) {
          return prevCount - 1;
        } else {
          return 0;
        }
      });
      setActionName("");
    } else {
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
    }
    setCheckValidation(false);
    setDoesSelectedRuleHaveErrors(false);
    setRuleConditionErrors(false);
    setShowAddRuleButton(true);
    setIsRuleBeingCreated(false);
  };

  // Function that gets called when the user clicks on the cancel button after making changes to an existing rule.
  const restoreRuleChanges = () => {
    if (calledFromAction) {
      let temp = { ...localRuleData };
      const actionData = JSON.parse(JSON.stringify(localActivityPropertyData));
      let activityDataArr =
        actionData?.ActivityProperty?.wdeskInfo?.m_objActionDetails?.actionMap;
      let tempArr = [...actions];
      temp.ruleCondList = activityDataArr[actionIndex].ruleCondList;
      temp.ruleOpList = activityDataArr[actionIndex].ruleOpList;
      setLocalRuleData(temp);
      tempArr[actionIndex].ruleCondList =
        activityDataArr[actionIndex].ruleCondList;
      tempArr[actionIndex].ruleOpList = activityDataArr[actionIndex].ruleOpList;
      setActions(tempArr);
    } else {
      let temp = { ...localRuleData };
      const entrySettingsData = JSON.parse(
        JSON.stringify(localActivityPropertyData)
      );
      let activityDataArr =
        entrySettingsData.ActivityProperty.esInfo &&
        entrySettingsData.ActivityProperty.esInfo.esRuleList;
      if (cellActivityType === 7 && cellActivitySubType === 1) {
        activityDataArr =
          entrySettingsData.ActivityProperty.routingCriteria &&
          entrySettingsData.ActivityProperty.routingCriteria.routCriteriaList;
      } else if (
        cellActivityType === 5 &&
        (cellActivitySubType === 1 || cellActivitySubType === 2)
      ) {
        activityDataArr =
          entrySettingsData.ActivityProperty.distributeInfo &&
          entrySettingsData.ActivityProperty.distributeInfo.disRuleInfo;
      } else if (
        cellActivityType === 4 &&
        cellActivitySubType === 1 &&
        activityTab === "Reminder"
      ) {
        activityDataArr =
          entrySettingsData.ActivityProperty.reminderInfo &&
          entrySettingsData.ActivityProperty.reminderInfo.reminderList;
      }
      let tempArr = [...rules];
      temp.ruleCondList = activityDataArr[selectedRule].ruleCondList;
      temp.ruleOpList = activityDataArr[selectedRule].ruleOpList;
      setLocalRuleData(temp);
      tempArr[selectedRule].ruleCondList =
        activityDataArr[selectedRule].ruleCondList;
      tempArr[selectedRule].ruleOpList =
        activityDataArr[selectedRule].ruleOpList;
      setRules(tempArr);
    }
    setIsRuleBeingModified(false);
    setIsRuleBeingCreated(false);
  };

  // Function that gets called when the user deletes an existing rule.
  const deleteRule = () => {
    if (calledFromAction) {
      let temp = [...actions];
      temp.splice(actionIndex, 1);
      setActions(temp);
      setGlobalActionData(temp);
      setActionIndex((prevCount) => {
        if (prevCount > 0) {
          return prevCount - 1;
        } else {
          return 0;
        }
      });
      setActionName("");
    } else {
      let temp = [...rules];
      temp.splice(selectedRule, 1);
      setRules(temp);
      setGlobalData(temp);
      setSelectedRule((prevCount) => {
        if (prevCount > 0) {
          return prevCount - 1;
        } else return 0;
      });
      dispatch(setActivityPropertyChange(getDataKey()));
    }
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
    } else if (
      rules[index].ruleCondList &&
      rules[index].ruleCondList[0].param1 === RULES_OTHERWISE_CONDITION
    ) {
      ruleType = RULES_OTHERWISE_CONDITION;
    }
    rules[index].ruleCondList.forEach((element) => {
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
    });

    // Function to get calendar type based on ruleCalFlag.
    const getCalendarTypeName = (flag) => {
      return flag === Y_FLAG ? t("workingDay") : t("calendarDay");
    };

    // Function to get total time for escalate to and escalate to with trigger.
    const getTotalTime = (durationObj) => {
      return `'${durationObj.paramDays}'${t("days")}+ '${
        durationObj.paramHours
      }'${t("hrs")}+ '${durationObj.paramMinutes}'${t("minutes")} +'${
        durationObj.paramSeconds
      }'${t("seconds")}`;
    };

    // Function that builds the operation text.
    function getOperationText(element) {
      switch (element.opType) {
        case COMMIT_OPERATION_TYPE:
        case INC_PRIORITY_OPERATION_TYPE:
        case DEC_PRIORITY_OPERATION_TYPE:
        case REINITIATE_OPERATION_TYPE:
        case ROLLBACK_OPERATION_TYPE:
          return getTypedropdown(element.opType);
        case ASSIGNED_TO_OPERATION_TYPE:
          return getTypedropdown(element.opType) + SPACE + element.param1;
        case SET_OPERATION_TYPE:
        case SET_PARENT_DATA_OPERATION_TYPE:
          if (element.param1 === SECONDARYDBFLAG) {
            return (
              getTypedropdown(element.opType) +
              SPACE +
              element.param1 +
              SPACE +
              EQUAL_TO +
              SPACE +
              getSecondaryDBFlagValue(element.param2)
            );
          } else {
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
              // element.param2 +
              SPACE +
              getOperator(element.operator) +
              SPACE +
              element.param3
            );
          }
        case TRIGGER_OPERATION_TYPE:
          return getTypedropdown(element.opType) + SPACE + element.param1;
        case SET_AND_EXECUTE_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            element.param1 +
            SPACE +
            EQUAL_TO +
            SPACE +
            getFunctionTypeName(element.param2) +
            SPACE +
            getSelectedOptionLabel(element.param2)
          );
        case CALL_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            getFunctionTypeName(element.param1) +
            SPACE +
            getSelectedOptionLabel(element.param1)
          );
        case ROUTE_TO_OPERATION_TYPE:
          return getTypedropdown(element.opType) + SPACE + element.param1;
        case ESCALATE_TO_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            element.param1 +
            SPACE +
            t("after") +
            SPACE +
            element.param2 +
            SPACE +
            getTotalTime(element.durationInfo) +
            SPACE +
            getCalendarTypeName(element.ruleCalFlag)
          );
        case ESCALATE_WITH_TRIGGER_OPERATION_TYPE:
        case REMINDER_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            element.triggerName +
            SPACE +
            "Frequency" +
            SPACE +
            element.iReminderFrequency +
            SPACE +
            t("after") +
            SPACE +
            element.param2 +
            SPACE +
            getTotalTime(element.durationInfo) +
            SPACE +
            getCalendarTypeName(element.ruleCalFlag)
          );
        case AUDIT_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            element.param1 +
            PERCENTAGE_SYMBOL +
            SPACE +
            t("ifSampled") +
            SPACE +
            `'${element.param2}'` +
            SPACE +
            t("notSampled") +
            SPACE +
            `'${element.param3}'`
          );
        case DISTRIBUTE_TO_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            element.param1 +
            SPACE +
            getChildStatement(element)
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
      } else if (ruleType === RULES_OTHERWISE_CONDITION) {
        let otherwiseOpList = "";
        rules[index].ruleOpList.forEach((element, elemIndex) => {
          const concatenatedOperations = otherwiseOpList.concat(
            getOperationText(element),
            !isLastOperation(elemIndex) ? "," : ".",
            SPACE
          );
          otherwiseOpList = concatenatedOperations;
        });
        return ruleType + SPACE + otherwiseOpList;
      } else {
        return (
          ruleType + ruleStatement + t("then") + SPACE + operationStatement
        );
      }
    }
    return getFinalRuleStatement();
  };

  // Function that builds the rule statement for a rule.
  const buildActionStatement = (index) => {
    let ruleStatement = "";
    let operationStatement = "";
    let ruleType = RULES_IF_CONDITION;
    if (
      actions[index]?.ruleInfo?.ruleCondList &&
      actions[index]?.ruleInfo?.ruleCondList[0].param1 ===
        RULES_ALWAYS_CONDITION
    ) {
      ruleType = RULES_ALWAYS_CONDITION;
    } else if (
      actions[index]?.ruleInfo?.ruleCondList &&
      actions[index]?.ruleInfo?.ruleCondList[0].param1 ===
        RULES_OTHERWISE_CONDITION
    ) {
      ruleType = RULES_OTHERWISE_CONDITION;
    }
    actions[index]?.ruleInfo?.ruleCondList.forEach((element) => {
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
    });

    // Function to get calendar type based on ruleCalFlag.
    const getCalendarTypeName = (flag) => {
      return flag === Y_FLAG ? t("workingDay") : t("calendarDay");
    };

    // Function to get total time for escalate to and escalate to with trigger.
    const getTotalTime = (durationObj) => {
      return `'${durationObj.paramDays}'${t("days")}+ '${
        durationObj.paramHours
      }'${t("hrs")}+ '${durationObj.paramMinutes}'${t("minutes")} +'${
        durationObj.paramSeconds
      }'${t("seconds")}`;
    };

    // Function that builds the operation text.
    function getOperationText(element) {
      switch (element.opType) {
        case COMMIT_OPERATION_TYPE:
        case INC_PRIORITY_OPERATION_TYPE:
        case DEC_PRIORITY_OPERATION_TYPE:
        case REINITIATE_OPERATION_TYPE:
        case ROLLBACK_OPERATION_TYPE:
          return getTypedropdown(element.opType);
        case ASSIGNED_TO_OPERATION_TYPE:
          return getTypedropdown(element.opType) + SPACE + element.param1;
        case SET_OPERATION_TYPE:
        case SET_PARENT_DATA_OPERATION_TYPE:
          if (element.param1 === SECONDARYDBFLAG) {
            return (
              getTypedropdown(element.opType) +
              SPACE +
              element.param1 +
              SPACE +
              EQUAL_TO +
              SPACE +
              getSecondaryDBFlagValue(element.param2)
            );
          } else {
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
              // element.param2 +
              SPACE +
              getOperator(element.operator) +
              SPACE +
              element.param3
            );
          }
        case TRIGGER_OPERATION_TYPE:
          return getTypedropdown(element.opType) + SPACE + element.param1;
        case SET_AND_EXECUTE_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            element.param1 +
            SPACE +
            EQUAL_TO +
            SPACE +
            getFunctionTypeName(element.param2) +
            SPACE +
            getSelectedOptionLabel(element.param2)
          );
        case CALL_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            getFunctionTypeName(element.param1) +
            SPACE +
            getSelectedOptionLabel(element.param1)
          );
        case ROUTE_TO_OPERATION_TYPE:
          return getTypedropdown(element.opType) + SPACE + element.param1;
        case ESCALATE_TO_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            element.param1 +
            SPACE +
            t("after") +
            SPACE +
            element.param2 +
            SPACE +
            getTotalTime(element.durationInfo) +
            SPACE +
            getCalendarTypeName(element.ruleCalFlag)
          );
        case ESCALATE_WITH_TRIGGER_OPERATION_TYPE:
        case REMINDER_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            element.triggerName +
            SPACE +
            "Frequency" +
            SPACE +
            element.iReminderFrequency +
            SPACE +
            t("after") +
            SPACE +
            element.param2 +
            SPACE +
            getTotalTime(element.durationInfo) +
            SPACE +
            getCalendarTypeName(element.ruleCalFlag)
          );
        case AUDIT_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            element.param1 +
            PERCENTAGE_SYMBOL +
            SPACE +
            t("ifSampled") +
            SPACE +
            `'${element.param2}'` +
            SPACE +
            t("notSampled") +
            SPACE +
            `'${element.param3}'`
          );
        case DISTRIBUTE_TO_OPERATION_TYPE:
          return (
            getTypedropdown(element.opType) +
            SPACE +
            element.param1 +
            SPACE +
            getChildStatement(element)
          );
        default:
          return "";
      }
    }

    // Function to check if the operation is the last operation or not.
    const isLastOperation = (elemIndex) => {
      return elemIndex === actions[index]?.ruleInfo?.ruleOpList.length - 1;
    };
    actions[index]?.ruleInfo?.ruleOpList.forEach((element, elemIndex) => {
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
        actions[index]?.ruleInfo?.ruleOpList.forEach((element, elemIndex) => {
          const concatenatedOperations = alwaysOpList.concat(
            getOperationText(element),
            !isLastOperation(elemIndex) ? "," : ".",
            SPACE
          );
          alwaysOpList = concatenatedOperations;
        });
        return ruleType + SPACE + alwaysOpList;
      } else if (ruleType === RULES_OTHERWISE_CONDITION) {
        let otherwiseOpList = "";
        actions[index]?.ruleInfo?.ruleOpList.forEach((element, elemIndex) => {
          const concatenatedOperations = otherwiseOpList.concat(
            getOperationText(element),
            !isLastOperation(elemIndex) ? "," : ".",
            SPACE
          );
          otherwiseOpList = concatenatedOperations;
        });
        return ruleType + SPACE + otherwiseOpList;
      } else {
        return (
          ruleType + ruleStatement + t("then") + SPACE + operationStatement
        );
      }
    }
    return getFinalRuleStatement();
  };

  // Function to get the child statement for distribute to operation.
  const getChildStatement = (element) => {
    const isChildVariablePresent = element.param2.trim() !== "";
    if (isChildVariablePresent) {
      return (
        t("with") +
        SPACE +
        element.param2 +
        SPACE +
        "=" +
        SPACE +
        element.param3
      );
    }
    return "";
  };

  // Function to get the function type depending on the appType.
  const getFunctionType = (appType) => {
    if (appType === SYSTEM_DEFINED_SCOPE) {
      return ADD_OPERATION_SYSTEM_FUNCTIONS;
    } else if (appType === USER_DEFINED_SCOPE) {
      return ADD_OPERATION_EXT_FUNCTIONS;
    }
  };

  // Function to get the function type name according to the method index of the function.
  const getFunctionTypeName = (methodIndex) => {
    let functionType = "";
    registeredFunctions &&
      registeredFunctions.forEach((element) => {
        if (element.MethodIndex === methodIndex) {
          functionType = getFunctionType(element.AppType);
        }
      });
    return functionType;
  };

  // Function to get the selected option label according to the methodIndex of the function.
  const getSelectedOptionLabel = (methodIndex) => {
    let functionName = "";
    let functionLabelName = "";
    registeredFunctions &&
      registeredFunctions.forEach((element) => {
        if (element.MethodIndex === methodIndex) {
          functionName = element.MethodName;
        }
      });
    registeredOptionsLabelsData &&
      registeredOptionsLabelsData.forEach((element) => {
        if (
          element.value === functionName &&
          element.methodIndex === methodIndex
        ) {
          functionLabelName = element.label;
        }
      });
    return functionLabelName;
  };

  // Function to gets called when the user enters an action name in the input field.
  const actionHandler = (event) => {
    setActionName(event.target.value);
    if (!isRuleBeingCreated) {
      setIsRuleBeingModified(true);
    }
  };

  // Function that gets called when the actionData changes.
  useEffect(() => {
    setActions(actionData);
  }, [actionData]);

  //code edited on 21 Sep 2022 for BugId 111854
  // Function that gets called when the actionIndex changes.
  useEffect(() => {
    if (calledFromAction && actions && actions.length !== 0) {
      let temp = [actions && actions[actionIndex]?.ruleInfo];
      setRules(temp);
      setActionCount(actions && actions.length);
      setActionName(actions[actionIndex].actionName);
      const dataObj = {
        ruleCondList: actions[actionIndex]?.ruleInfo?.ruleCondList,
        ruleOpList:
          actions && actions.length > 0
            ? actions[actionIndex]?.ruleInfo?.ruleOpList
            : actionData[actionIndex]?.ruleInfo?.ruleOpList,
      };
      setLocalRuleData({ ...dataObj });
    }
  }, [actionIndex, actions]);

  // Function that runs when the selected rule changes or rules are added,deleted or modified.
  useEffect(() => {
    if (
      actions &&
      actions[actionIndex] &&
      actions[actionIndex]?.ruleInfo?.ruleCondList &&
      actions[actionIndex]?.ruleInfo?.ruleCondList[0].param1 ===
        RULES_ALWAYS_CONDITION
    ) {
      setSelectedCondition(RULES_ALWAYS_CONDITION);
      setDisabled(true);
      setIsOtherwiseSelected(false);
    } else {
      setSelectedCondition(RULES_IF_CONDITION);
      setDisabled(false);
      setIsOtherwiseSelected(false);
    }
  }, [actionIndex, actions]);

  // Function that gets called when the user clicks on the add action button.
  const addActionHandler = () => {
    setCheckValidation(true);
    setAddClicked(true);
  };

  return (
    <>
      <TabsHeading heading={props?.heading} />
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.ruleScreen
            : styles.ruleScreen
        }
        style={{
          height: calledFromAction ? "51vh" : "61vh",
          maxHeight: calledFromAction ? "51vh" : "61vh",
        }}
      >
        {(calledFromAction && actionCount > 0) ||
        (!calledFromAction && rulesCount > 0) ||
        isRuleBeingCreated ? (
          <>
            <div
              className={styles.leftPanel}
              style={{
                width: isDrawerExpanded ? "26%" : "100%",
              }}
            >
              {calledFromAction ? (
                <div>
                  {actionCount === 0 ? (
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
                        {SPACE + t("actionsareDefined")}
                      </p>
                      {!isReadOnly && showAddRuleButton ? (
                        <button
                          id="AR_Add_Action_Locally"
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.addRuleLocallyButton
                              : styles.addRuleLocallyButton
                          }
                          onClick={addActionLocally}
                        >
                          {t("addAction")}
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
                      >
                        {actionCount === 1
                          ? actionCount + SPACE + t("actionIsDefined")
                          : actionCount + SPACE + t("actionsareDefined")}
                      </p>
                      {!isReadOnly && showAddRuleButton ? (
                        <button
                          id="AR_Add_Action_Locally"
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.addRuleLocallyButton
                              : styles.addRuleLocallyButton
                          }
                          onClick={addActionLocally}
                        >
                          {t("addAction")}
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
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
              )}
              {calledFromAction ? (
                <ul className={styles.rulesList}>
                  {actions && actions.length !== 0 ? (
                    actions.map((element, index) => {
                      return (
                        <li
                          className={
                            actionIndex === index
                              ? direction === RTL_DIRECTION
                                ? arabicStyles.ruleStatement
                                : styles.ruleStatement
                              : direction === RTL_DIRECTION
                              ? arabicStyles.restList
                              : styles.restList
                          }
                          onClick={() => setActionIndex(index)}
                        >
                          <RuleStatement
                            index={index}
                            rules={actions}
                            action={element}
                            isRuleBeingCreated={
                              index === actionIndex ? isRuleBeingCreated : false
                            }
                            buildRuleStatement={buildActionStatement}
                            shortenRuleStatement={shortenRuleStatement}
                            registeredFunctions={registeredFunctions}
                            registeredOptionsLabelsData={
                              registeredOptionsLabelsData
                            }
                            calledFromAction={true}
                          />
                        </li>
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
                      {SPACE + t("actionsareDefined")}
                    </li>
                  )}
                </ul>
              ) : (
                <div className={styles.rulesList}>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="rules_reordering">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
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
                                          buildRuleStatement={
                                            buildRuleStatement
                                          }
                                          shortenRuleStatement={
                                            shortenRuleStatement
                                          }
                                          registeredFunctions={
                                            registeredFunctions
                                          }
                                          registeredOptionsLabelsData={
                                            registeredOptionsLabelsData
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
              )}
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
                width: isDrawerExpanded ? "74%" : "0%",
              }}
            >
              {isDrawerExpanded ? (
                <div
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.rightPanel
                      : styles.rightPanel
                  }
                >
                  <div
                    className={
                      calledFromAction ? styles.flexStartRow : styles.flexRow1
                    }
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {calledFromAction ? (
                        <div style={{ marginBottom: "0.5rem" }}>
                          <div className="row">
                            <p
                              style={{
                                font: " normal normal 600 13px/22px Open Sans",
                              }}
                            >
                              {t("actionName")}
                              <span className={styles.starIcon}>*</span>
                            </p>
                            <input
                              onChange={(event) => actionHandler(event)}
                              value={actionName}
                              disabled={isReadOnly}
                              style={{ marginLeft: "2rem", height: "24px" }}
                              ref={actionNameRef}
                              id="ActionNameInput"
                              onKeyPress={(e) =>
                                FieldValidations(
                                  e,
                                  150,
                                  actionNameRef.current,
                                  30
                                )
                              }
                            />
                          </div>
                          <div>
                            {actionNameError ? (
                              <p className={styles.errorStatement}>
                                {t("mandatoryActionName")}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                      <p
                        className={styles.mainHeading}
                        style={{
                          fontSize: "var(--subtitle_text_font_size)",
                          display: "flex",
                        }}
                      >
                        {calledFromAction
                          ? t("condition")
                          : t("rulesCondition")}
                        <span className={styles.starIcon}>*</span>
                      </p>
                    </div>

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
                        {calledFromAction ? (
                          <button
                            id="AR_Add_Action_Button"
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.addHeaderBtn
                                : styles.addHeaderBtn
                            }
                            onClick={addActionHandler}
                            style={{
                              display: isReadOnly ? "none" : "",
                            }}
                          >
                            {t("addAction")}
                          </button>
                        ) : (
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
                        )}
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
                              {calledFromAction
                                ? t("modifyAction")
                                : t("modifyRule")}
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
                  <div
                    className={styles.ruleData}
                    style={{ height: calledFromAction ? "80%" : "87%" }}
                  >
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
                        disabled={
                          isReadOnly ||
                          isOtherwiseSelected ||
                          isActParallelDistribute
                        }
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
                      <FormControlLabel
                        disabled={isReadOnly || !isOtherwiseSelected}
                        id="AR_Otherwise_Option"
                        value={RULES_OTHERWISE_CONDITION}
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
                            {t("otherwise")}
                          </p>
                        }
                      />
                    </RadioGroup>
                    <div
                      className={clsx(
                        styles.flexRow,
                        styles.ruleConditionLabelsDiv
                      )}
                    >
                      <p className={clsx(styles.operationsLabel)}>
                        {t("variable")}
                      </p>
                      <p className={clsx(styles.operationsLabel)}>
                        {t("operator")}
                      </p>
                      <p className={clsx(styles.operationsLabel)}>
                        {t("value")}
                      </p>
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
                      {!isReadOnly && activityTab !== "Reminder" ? (
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
                              registeredFunctions={registeredFunctions}
                              operationsAllowed={operationsAllowed}
                              workstepList={workstepList}
                              checkValidation={checkValidation}
                              setCheckValidation={setCheckValidation}
                              setDoesSelectedRuleHaveErrors={
                                setDoesSelectedRuleHaveErrors
                              }
                              showDelIcon={
                                localRuleData &&
                                localRuleData?.ruleOpList?.length > 1
                              }
                              variablesWithRights={variablesWithRights}
                              currentTab={currentTabName}
                            />
                          );
                        })}
                    </React.Fragment>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className={styles.noRulesDiv}>
            <NoRulesScreen
              isReadOnly={isReadOnly}
              calledFromAction={calledFromAction}
            />
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              {calledFromAction && !isReadOnly ? (
                <button
                  id="AR_Add_Rule_Locally"
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.addRuleLocallyButton
                      : styles.addRuleLocallyButton
                  }
                  onClick={addActionLocally}
                >
                  {t("addAction")}
                </button>
              ) : (
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
              )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ActivityRules);
