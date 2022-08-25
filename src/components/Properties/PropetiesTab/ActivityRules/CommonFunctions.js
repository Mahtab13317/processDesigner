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
  console.log("333", "opration type", opOrderId, operationType);
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
    param1: operationType=="39"?"V":"",
    param2: "",
    param3: "",
    ruleCalFlag: "",
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




// Function to get Rule Operation data object for API.
export const getRuleOperationDataObj = (element) => {

  let formDataMailInfo =  element?.mailTrigInfo.mailInfo;
  let mailTrigInfo  = {
    mailInfo: formDataMailInfo
};

let keysToAssignZeroIfNull = [
      "extObjIDFrom", "variableIdFrom", "varFieldIdFrom", "extObjIDTo",
      "variableIdTo", "varFieldIdTo", "extObjIDCC", "variableIdCC",
      "varFieldIdCC", "extObjIDBCC", "variableIdBCC", "varFieldIdBCC"];

if(mailTrigInfo && mailTrigInfo.mailInfo) {
  for(let key in mailTrigInfo.mailInfo) {
      
      let mailInfo = mailTrigInfo.mailInfo;

      if(keysToAssignZeroIfNull.includes(key) && mailInfo[key].length == 0) {
          mailInfo[key] = "0";
      }

  }
}


  console.log("444", "data object", element);
  return {
    opOrderId: element.opOrderId === "" ? "0" : element.opOrderId,
    opType: element.opType === "" ? "0" : element.opType,
    sTriggerId: element?.sTriggerId?element?.sTriggerId:"",
    triggerName: element?.triggerName,
    param1: element?.param1,
    type1: element.opType=="39"?"V":element?.type1,
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
    iReminderFrequency:element.iReminderFrequency,
    minute: element.minute,

    durationInfo: {
      durationId: 0,
      paramDays:
        element.durationInfo.paramDays === ""
          ? "0"
          : element.durationInfo.paramDays,
      variableIdDays:
        element.durationInfo.variableIdDays === ""
          ? "0"
          : element.durationInfo.variableIdDays,
      varFieldIdDays:
        element.durationInfo.varFieldIdDays === ""
          ? "0"
          : element.durationInfo.varFieldIdDays,
      paramHours:
        element.durationInfo.paramHours === ""
          ? "0"
          : element.durationInfo.paramHours,
      variableIdHours:
        element.durationInfo.variableIdHours === ""
          ? "0"
          : element.durationInfo.variableIdHours,
      varFieldIdHours:
        element.durationInfo.varFieldIdHours === ""
          ? "0"
          : element.durationInfo.varFieldIdHours,
      paramMinutes:
        element.durationInfo.paramMinutes === ""
          ? "0"
          : element.durationInfo.paramMinutes,
      variableIdMinutes:
        element.durationInfo.variableIdMinutes === ""
          ? "0"
          : element.durationInfo.variableIdMinutes,
      varFieldIdMinutes:
        element.durationInfo.varFieldIdMinutes === ""
          ? "0"
          : element.durationInfo.varFieldIdMinutes,
      paramSeconds:
        element.durationInfo.paramSeconds === ""
          ? "0"
          : element.durationInfo.paramSeconds,
      variableIdSeconds:
        element.durationInfo.variableIdSeconds === ""
          ? "0"
          : element.durationInfo.variableIdSeconds,
      varFieldIdSeconds:
        element.durationInfo.varFieldIdSeconds === ""
          ? "0"
          : element.durationInfo.varFieldIdSeconds,
    },
    mailTrigInfo:mailTrigInfo
    /* mailTrigInfo: {
      mailInfo: {
       
        ccUser:
          element?.mailTrigInfo?.mailInfo?.ccUser === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.ccUser,
        bccUser:
          element?.mailTrigInfo?.mailInfo?.bccUser === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.bccUser,
        m_bCcConst:
          element?.mailTrigInfo?.mailInfo?.m_bCcConst === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.m_bCcConst,
        extObjIDCC:
          element?.mailTrigInfo.mailInfo.extObjIDCC === ""
            ? "0"
            : element?.mailTrigInfo.mailInfo.extObjIDCC,
        fromUser:
          element?.mailTrigInfo.mailInfo.fromUser === ""
            ? "0"
            : element?.mailTrigInfo.mailInfo.fromUser,
        subject:
          element?.mailTrigInfo.mailInfo.subject === ""
            ? "0"
            : element?.mailTrigInfo.mailInfo.subject,
        varFieldTypeBCC:
          element?.mailTrigInfo.mailInfo.varFieldTypeBCC === ""
            ? "0"
            : element.mailTrigInfo.mailInfo.varFieldTypeBCC,
        variableIdPriority:
          element?.mailTrigInfo.mailInfo.variableIdPriority === ""
            ? "0"
            : element?.mailTrigInfo.mailInfo.variableIdPriority,
        m_strToConstant:
          element?.mailTrigInfo.mailInfo.m_strToConstant === ""
            ? "0"
            : element?.mailTrigInfo.mailInfo.m_strToConstant,
        varFieldTypeCC:
          element?.mailTrigInfo.mailInfo.varFieldTypeCC === ""
            ? "0"
            : element?.mailTrigInfo.mailInfo.varFieldTypeCC,
        m_strBCcConstant:
          element?.mailTrigInfo.mailInfo.m_strBCcConstant === ""
            ? "0"
            : element?.mailTrigInfo.mailInfo.m_strBCcConstant,
        varFieldTypeTo:
          element?.mailTrigInfo.mailInfo.varFieldTypeTo === ""
            ? "0"
            : element?.mailTrigInfo.mailInfo.varFieldTypeTo,
        m_bToConst:
          element?.mailTrigInfo.mailInfo.m_bToConst === ""
            ? "0"
            : element?.mailTrigInfo.mailInfo.m_bToConst,
        toUser:
          element?.mailTrigInfo.mailInfo.toUser === ""
            ? "0"
            : element?.mailTrigInfo.mailInfo.toUser,
        extObjIDFrom:
          element?.mailTrigInfo.mailInfo.extObjIDFrom === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.extObjIDFrom,
        variableIdTo:
          element?.mailTrigInfo?.mailInfo?.variableIdTo === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.variableIdTo,
        selectedMessage:
          element?.mailTrigInfo?.mailInfo?.selectedMessage === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.selectedMessage,
        variableIdCC:
          element?.mailTrigInfo?.mailInfo?.variableIdCC === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.variableIdCC,
        varFieldIdBCC:
          element?.mailTrigInfo.mailInfo.varFieldIdBCC === ""
            ? "0"
            : element?.mailTrigInfo.mailInfo.varFieldIdBCC,
        variableIdFrom:
          element?.mailTrigInfo?.mailInfo?.variableIdFrom === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.variableIdFrom,
        extObjIDTo:
          element?.mailTrigInfo?.mailInfo?.extObjIDTo === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.extObjIDTo,
        varFieldIdPriority:
          element?.mailTrigInfo?.mailInfo?.varFieldIdPriority === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.varFieldIdPriority,
        varFieldIdFrom:
          element?.mailTrigInfo?.mailInfo?.varFieldIdFrom === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.varFieldIdFrom,
        extObjIDBCC:
          element?.mailTrigInfo?.mailInfo?.extObjIDBCC === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.extObjIDBCC,
        m_bBCcConst:
          element?.mailTrigInfo?.mailInfo?.m_bBCcConst === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.m_bBCcConst,
        m_strFromConstant:
          element?.mailTrigInfo?.mailInfo?.m_strFromConstant === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.m_strFromConstant,
        message:
          element?.mailTrigInfo.mailInfo.message === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.message,
        priority:
          element?.mailTrigInfo?.mailInfo?.priority === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.priority,
        varFieldTypePriority:
          element?.mailTrigInfo?.mailInfo?.varFieldTypePriority === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.varFieldTypePriority,
        selectedSubject:
          element?.mailTrigInfo?.mailInfo?.selectedSubject === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.selectedSubject,
        variableIdBCC:
          element?.mailTrigInfo?.mailInfo?.variableIdBCC === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.variableIdBCC,
        varFieldIdCC:
          element?.mailTrigInfo?.mailInfo?.varFieldIdCC === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.varFieldIdCC,
        m_bFromConst:
          element?.mailTrigInfo?.mailInfo?.m_bFromConst === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.m_bFromConst,
        extObjIDPriority:
          element?.mailTrigInfo?.mailInfo?.extObjIDPriority === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.extObjIDPriority,
        varFieldIdTo:
          element?.mailTrigInfo?.mailInfo?.varFieldIdTo === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.varFieldIdTo,
        m_strCcConstant:
          element?.mailTrigInfo?.mailInfo?.m_strCcConstant === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.m_strCcConstant,
        varFieldTypeFrom:
          element?.mailTrigInfo?.mailInfo?.varFieldTypeFrom === ""
            ? "0"
            : element?.mailTrigInfo?.mailInfo?.varFieldTypeFrom,
      },
    }, */
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
    type1: opType=="39"?"V":"",
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
        ruleCalFlag: " ",
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
