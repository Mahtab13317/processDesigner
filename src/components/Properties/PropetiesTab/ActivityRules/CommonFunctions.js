// #BugID - 107287
// #BugDescription - Added default values for extObjIDs, varFieldIds, variableIds, operator and functionType.
import { SET_OPERATION_TYPE } from "../../../../Constants/appConstants";

// Function that get the operator options for a given variable type.
export const getOperatorOptions = (variableType) => {
  let operatorList = [];
  const addOperator = [{ label: "+", value: "11" }];
  const numberOperators = [
    { label: "+", value: "11" },
    { label: "-", value: "12" },
    { label: "*", value: "13" },
    { label: "/", value: "14" },
    { label: "%", value: "15" },
  ];

  switch (variableType) {
    case "10":
    case "8":
      operatorList = addOperator;
      break;
    case "6":
    case "3":
    case "4":
      operatorList = numberOperators;
      break;
    default:
      operatorList = addOperator;
      break;
  }
  return operatorList;
};

//Function to get rule type according to the type of activity opened.
export const getRuleType = (activityType, activitySubType) => {
  if ((activityType === 10 && activitySubType === 3) || 6) return "E";
  else if (activityType === 7 && activitySubType === 1) return "X";
};

// Function to get Rule Condition JSON object.
export const getRuleConditionObject = (condOrderId) => {
  return {
    condOrderId: condOrderId ? condOrderId : 1,
    datatype1: "",
    extObjID1: "0",
    extObjID2: "0",
    logicalOp: "3",
    operator: "0",
    param1: "",
    param2: "",
    type1: "M",
    type2: "M",
    varFieldId_1: "0",
    varFieldId_2: "0",
    variableId_1: "0",
    variableId_2: "0",
  };
};

// Function to get Rule Operation JSON object.
export const getRuleOperationObject = (opOrderId) => {
  return {
    datatype1: "",
    durationInfo: {
      durationId: "",
      paramDays: "",
      paramHours: "",
      paramMinutes: "",
      paramSeconds: "",
      varFieldIdDays: "0",
      varFieldIdHours: "0",
      varFieldIdMinutes: "0",
      varFieldIdSeconds: "0",
      variableIdDays: "",
      variableIdHours: "",
      variableIdMinutes: "",
      variableIdSeconds: "",
    },
    minute: "",
    extObjID1: "0",
    extObjID2: "0",
    extObjID3: "0",
    functionType: "L",
    opOrderId: opOrderId ? opOrderId : 1,
    opType: SET_OPERATION_TYPE,
    operator: "0",
    param1: "",
    param2: "",
    param3: "",
    ruleCalFlag: "",
    triggerName: "",
    type1: "",
    type3: "",
    varFieldId_1: "0",
    varFieldId_2: "0",
    varFieldId_3: "0",
    variableId_1: "0",
    variableId_2: "0",
    variableId_3: "0",
  };
};

// Function to get Rule Operation data object for API.
export const getRuleOperationDataObj = (element) => {
  return {
    opOrderId: element.opOrderId,
    opType: element.opType,
    sTriggerId: "",
    param1: element.param1,
    type1: element.type1,
    extObjID1: element.extObjID1 === "" ? "0" : element.extObjID1,
    variableId_1: element.variableId_1 === "" ? "0" : element.variableId_1,
    varFieldId_1: element.varFieldId_1 === "" ? "0" : element.varFieldId_1,
    operator: element.operator === "" ? "0" : element.operator,
    param2: element.param2,
    type2: "",
    extObjID2: element.extObjID2 === "" ? "0" : element.extObjID2,
    variableId_2: element.variableId_2 === "" ? "0" : element.variableId_2,
    varFieldId_2: element.varFieldId_2 === "" ? "0" : element.varFieldId_2,
    param3: element.param3,
    type3: element.type3,
    extObjID3: element.extObjID3 === "" ? "0" : element.extObjID3,
    variableId_3: element.variableId_3 === "" ? "0" : element.variableId_3,
    varFieldId_3: element.varFieldId_3 === "" ? "0" : element.varFieldId_3,
    m_bRepeat: false,
    functionType: element.functionType === "" ? "L" : element.functionType,
    ruleCalFlag: element.ruleCalFlag,
    iReminderFrequency: "",
    minute: "",
    m_objDurationInfo: {
      m_strDurationId: "",
      m_strParam_Days: "",
      m_strVariableId_Days: "",
      m_strVarFieldId_Days: "",
      m_strParam_Hours: "",
      m_strVariableId_Hours: "",
      m_strVarFieldId_Hours: "",
      m_strParam_Minutes: "",
      m_strVariableId_Minutes: "",
      m_strVarFieldId_Minutes: "",
      m_strParam_Seconds: "",
      m_strVariableId_Seconds: "",
      m_strVarFieldId_Seconds: "",
    },
    m_objMailTrigInfo: {
      mailInfo: {
        fromUser: "",
        variableIdFrom: "",
        varFieldIdFrom: "",
        extObjIDFrom: "",
        varFieldTypeFrom: "",
        toUser: "",
        variableITo: "",
        varFieldIdTo: "",
        extObjIDTo: "",
        varFieldTypeTo: "",
        ccUser: "",
        variableIdCC: "",
        varFieldIdCC: "",
        extObjIDCC: "",
        varFieldTypeCC: "",
        bccUser: "",
        variableIdBCC: "",
        varFieldIdBCC: "",
        extObjIDBCC: "",
        varFieldTypBCC: "",
        subject: "",
        message: "",
        priority: "",
        variableIdPriority: "",
        varFieldIdPriority: "",
        varFieldTypePriority: "",
        extObjIDPriority: "",
      },
    },
  };
};

// Function to get empty Rule Operation data object.
export const getEmptyRuleOperationObj = (opOrderId, opType) => {
  return {
    opOrderId: opOrderId,
    opType: opType,
    sTriggerId: "",
    param1: "",
    type1: "",
    extObjID1: "",
    variableId_1: "",
    varFieldId_1: "",
    operator: "",
    param2: "",
    type2: "",
    extObjID2: "",
    variableId_2: "",
    varFieldId_2: "",
    param3: "",
    type3: "",
    extObjID3: "",
    variableId_3: "",
    varFieldId_3: "",
    m_bRepeat: false,
    functionType: "",
    ruleCalFlag: "",
    iReminderFrequency: "",
    minute: "",
    m_objDurationInfo: {
      m_strDurationId: "",
      m_strParam_Days: "",
      m_strVariableId_Days: "",
      m_strVarFieldId_Days: "",
      m_strParam_Hours: "",
      m_strVariableId_Hours: "",
      m_strVarFieldId_Hours: "",
      m_strParam_Minutes: "",
      m_strVariableId_Minutes: "",
      m_strVarFieldId_Minutes: "",
      m_strParam_Seconds: "",
      m_strVariableId_Seconds: "",
      m_strVarFieldId_Seconds: "",
    },
    m_objMailTrigInfo: {
      mailInfo: {
        fromUser: "",
        variableIdFrom: "",
        varFieldIdFrom: "",
        extObjIDFrom: "",
        varFieldTypeFrom: "",
        toUser: "",
        variableITo: "",
        varFieldIdTo: "",
        extObjIDTo: "",
        varFieldTypeTo: "",
        ccUser: "",
        variableIdCC: "",
        varFieldIdCC: "",
        extObjIDCC: "",
        varFieldTypeCC: "",
        bccUser: "",
        variableIdBCC: "",
        varFieldIdBCC: "",
        extObjIDBCC: "",
        varFieldTypBCC: "",
        subject: "",
        message: "",
        priority: "",
        variableIdPriority: "",
        varFieldIdPriority: "",
        varFieldTypePriority: "",
        extObjIDPriority: "",
      },
    },
  };
};
