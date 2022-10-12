// #BugID - 107287
// #BugDescription - Added default values for extObjIDs, varFieldIds, variableIds, operator and functionType.
import { SET_OPERATION_TYPE } from "../../../../Constants/appConstants";
import moment from "moment";

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

// Function that checks if value is date type or not and converts to DD-MM-YYYY format if date type.
export const isValueDateType = (value) => {
  let isValDateType = false;
  let convertedDate = "";
  let parsedDate = Date.parse(value);
  if (isNaN(value) && !isNaN(parsedDate)) {
    isValDateType = true;
    convertedDate = moment(value).format("YYYY-MM-DD");
    // if (dateFormat !== undefined && dateFormat !== "") {
    //   convertedDate = moment(value).format(dateFormat);
    // }
  }
  return { isValDateType: isValDateType, convertedDate: convertedDate };
};

//Function to get rule type according to the type of activity opened.
export const getRuleType = (activityType, activitySubType) => {
  if (activityType === 10 && (activitySubType === 3 || activitySubType === 6))
    return "E";
  else if (activityType === 7 && activitySubType === 1) return "X";
  else if (activityType === 5) return "D";
  else if (activityType === 4) return "E";
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

// Function to get Task Rule Condition JSON object.
export const getTaskRuleConditionObject = (condOrderId) => {
  return {
    ruleType: "V",
    condOrderId: condOrderId ? condOrderId : 1,
    param1: "",
    type1: "M",
    extObjID1: "0",
    variableId_1: "0",
    varFieldId_1: "0",
    param2: "",
    type2: "M",
    extObjID2: "0",
    variableId_2: "0",
    varFieldId_2: "0",
    operator: "0",
    logicalOp: "3",
  };
};

export const getAlwaysRuleConditionObject = () => {
  return {
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
  };
};

// Function to get Rule Operation JSON object.
export const getRuleOperationObject = (opOrderId, operationType) => {
  return {
    datatype1: "",
    durationInfo: {
      durationId: 0,
      paramDays: "",
      variableIdDays: "",
      varFieldIdDays: "",
      paramHours: "",
      variableIdHours: "",
      varFieldIdHours: "",
      paramMinutes: "",
      variableIdMinutes: "",
      varFieldIdMinutes: "",
      paramSeconds: "",
      variableIdSeconds: "",
      varFieldIdSeconds: "",
    },
    mailTrigInfo: {
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
    minute: "",
    extObjID1: "0",
    extObjID2: "0",
    extObjID3: "0",
    functionType: "L",
    opOrderId: opOrderId ? opOrderId : 1,
    opType: operationType ? operationType : SET_OPERATION_TYPE,
    operator: "0",
    param1: operationType == "39" ? "V" : "",
    param2: "",
    param3: "",
    ruleCalFlag: "Y",
    sTriggerId: "",
    triggerName: "",
    type1: "",
    type2: "",
    type3: "",
    varFieldId_1: "0",
    varFieldId_2: "0",
    varFieldId_3: "0",
    variableId_1: "0",
    variableId_2: "0",
    variableId_3: "0",
  };
};

// Function to get Task Rule Operation JSON object.
export const getTaskRuleOperationObject = (opOrderId, operationType) => {
  return {
    opOrderId: opOrderId ? opOrderId : 1,
    opType: operationType ? operationType : SET_OPERATION_TYPE,
    param1: "",
    type1: "V",
    extObjID1: "0",
    variableId_1: "0",
    varFieldId_1: "0",
    param2: "",
    type2: "V",
    extObjID2: "0",
    variableId_2: "0",
    varFieldId_2: "0",
    param3: "",
    type3: "0",
    extObjID3: "0",
    variableId_3: "0",
    varFieldId_3: "0",
    m_strAssignedTo: "",
    ruleCalFlag: "Y",
    operator: "0",
  };
};

// Function to get Rule Operation data object for API.
export const getRuleOperationDataObj = (element) => {
  let formDataMailInfo = element?.mailTrigInfo?.mailInfo;
  let mailTrigInfo = {
    mailInfo: formDataMailInfo,
  };

  let keysToAssignZeroIfNull = [
    "extObjIDFrom",
    "variableIdFrom",
    "varFieldIdFrom",
    "extObjIDTo",
    "variableIdTo",
    "varFieldIdTo",
    "extObjIDCC",
    "variableIdCC",
    "varFieldIdCC",
    "extObjIDBCC",
    "variableIdBCC",
    "varFieldIdBCC",
  ];

  if (mailTrigInfo && mailTrigInfo.mailInfo) {
    for (let key in mailTrigInfo.mailInfo) {
      let mailInfo = mailTrigInfo.mailInfo;

      if (keysToAssignZeroIfNull?.includes(key) && mailInfo[key]?.length == 0) {
        mailInfo[key] = "0";
      }
    }
  }

  return {
    opOrderId: element.opOrderId === "" ? "0" : element.opOrderId,
    opType: element.opType === "" ? "0" : element.opType,
    sTriggerId: element?.sTriggerId ? element?.sTriggerId : "",
    triggerName: element?.triggerName,
    param1: element?.param1,
    type1: element.opType == "39" ? "V" : element?.type1,
    extObjID1: element.extObjID1 === "" ? "0" : element.extObjID1,
    variableId_1: element.variableId_1 === "" ? "0" : element.variableId_1,
    varFieldId_1: element.varFieldId_1 === "" ? "0" : element.varFieldId_1,
    operator: element.operator === "" ? "0" : element.operator,
    param2: element.param2,
    type2: element.type2,
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
    iReminderFrequency: element.iReminderFrequency,
    minute: element.minute,
    durationInfo: {
      durationId: 0,
      paramDays:
        element?.durationInfo?.paramDays === ""
          ? "0"
          : element?.durationInfo?.paramDays,
      variableIdDays:
        element?.durationInfo?.variableIdDays === ""
          ? "0"
          : element?.durationInfo?.variableIdDays,
      varFieldIdDays:
        element?.durationInfo?.varFieldIdDays === ""
          ? "0"
          : element?.durationInfo?.varFieldIdDays,
      paramHours:
        element?.durationInfo?.paramHours === ""
          ? "0"
          : element?.durationInfo?.paramHours,
      variableIdHours:
        element?.durationInfo?.variableIdHours === ""
          ? "0"
          : element?.durationInfo?.variableIdHours,
      varFieldIdHours:
        element?.durationInfo?.varFieldIdHours === ""
          ? "0"
          : element?.durationInfo?.varFieldIdHours,
      paramMinutes:
        element?.durationInfo?.paramMinutes === ""
          ? "0"
          : element?.durationInfo?.paramMinutes,
      variableIdMinutes:
        element?.durationInfo?.variableIdMinutes === ""
          ? "0"
          : element?.durationInfo?.variableIdMinutes,
      varFieldIdMinutes:
        element?.durationInfo?.varFieldIdMinutes === ""
          ? "0"
          : element?.durationInfo?.varFieldIdMinutes,
      paramSeconds:
        element?.durationInfo?.paramSeconds === ""
          ? "0"
          : element?.durationInfo?.paramSeconds,
      variableIdSeconds:
        element?.durationInfo?.variableIdSeconds === ""
          ? "0"
          : element?.durationInfo?.variableIdSeconds,
      varFieldIdSeconds:
        element?.durationInfo?.varFieldIdSeconds === ""
          ? "0"
          : element?.durationInfo?.varFieldIdSeconds,
    },
    mailTrigInfo: mailTrigInfo,
  };
};

// Function to get Task Rule Operation data object for API.
export const getTaskRuleOperationDataObj = (element) => {
  return {
    opOrderId: element.opOrderId === "" ? "0" : element.opOrderId,
    opType: element.opType === "" ? "0" : element.opType,
    param1: element?.param1,
    type1: element.opType == "39" ? "V" : element?.type1,
    extObjID1: element.extObjID1 === "" ? "0" : element.extObjID1,
    variableId_1: element.variableId_1 === "" ? "0" : element.variableId_1,
    varFieldId_1: element.varFieldId_1 === "" ? "0" : element.varFieldId_1,
    operator: element.operator === "" ? "0" : element.operator,
    param2: element.param2,
    type2: element.type2,
    extObjID2: element.extObjID2 === "" ? "0" : element.extObjID2,
    variableId_2: element.variableId_2 === "" ? "0" : element.variableId_2,
    varFieldId_2: element.varFieldId_2 === "" ? "0" : element.varFieldId_2,
    param3: element.param3,
    type3: element.type3,
    extObjID3: element.extObjID3 === "" ? "0" : element.extObjID3,
    variableId_3: element.variableId_3 === "" ? "0" : element.variableId_3,
    varFieldId_3: element.varFieldId_3 === "" ? "0" : element.varFieldId_3,
    ruleCalFlag: element.ruleCalFlag,
    m_strAssignedTo: element.m_strAssignedTo,
  };
};

// Function to get empty Rule Operation data object.
export const getEmptyRuleOperationObj = (opOrderId, opType) => {
  return {
    opOrderId: opOrderId,
    opType: opType,
    sTriggerId: "",
    triggerName: "",
    param1: "",
    type1: opType == "39" ? "V" : "",
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
    ruleCalFlag: "Y",
    iReminderFrequency: "",
    minute: "",
    durationInfo: {
      durationId: 0,
      paramDays: "",
      variableIdDays: "",
      varFieldIdDays: "",
      paramHours: "",
      variableIdHours: "",
      varFieldIdHours: "",
      paramMinutes: "",
      variableIdMinutes: "",
      varFieldIdMinutes: "",
      paramSeconds: "",
      variableIdSeconds: "",
      varFieldIdSeconds: "",
    },
    mailTrigInfo: {
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
export const getEmptyTaskRuleOperationObj = (opOrderId, opType) => {
  return {
    opOrderId: opOrderId,
    opType: opType,
    param1: "",
    type1: "V",
    extObjID1: "0",
    variableId_1: "0",
    varFieldId_1: "0",
    param2: "",
    type2: "V",
    extObjID2: "0",
    variableId_2: "0",
    varFieldId_2: "0",
    param3: "",
    type3: "0",
    extObjID3: "0",
    variableId_3: "0",
    varFieldId_3: "0",
    m_strAssignedTo: "",
    ruleCalFlag: "Y",
    operator: "0",
  };
};

export const otherwiseRuleData = [
  {
    ruleLabel: "",
    ruleCondList: [
      {
        type2: "S",
        extObjID1: "0",
        extObjID2: "0",
        variableId_1: "0",
        variableId_2: "0",
        condOrderId: 1,
        type1: "S",
        param1: "Otherwise",
        operator: "5",
        param2: "Otherwise",
        dataType1: "",
        varFieldId_1: "0",
        varFieldId_2: "0",
        logicalOp: "5",
      },
    ],
    ruleType: "X",
    ruleOpList: [
      {
        type3: "0",
        type2: "V",
        extObjID1: "0",
        triggerName: "",
        extObjID2: "0",
        extObjID3: "0",
        ruleCalFlag: "",
        opType: "4",
        variableId_1: "0",
        variableId_3: "0",
        variableId_2: "0",
        type1: "V",
        param3: " ",
        param1: "PreviousStage",
        operator: "0",
        param2: " ",
        minute: "",
        dataType1: "",
        varFieldId_1: "0",
        varFieldId_2: "0",
        varFieldId_3: "0",
        repeat: false,
        functionType: "L",
        opOrderId: 1,
      },
    ],
    ruleId: "1",
    ruleOrderId: 1,
  },
];

export const getTaskStatus = {
  2: "is initiated",
  3: "is complete",
};
