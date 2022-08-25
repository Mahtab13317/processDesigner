export const conditionalTextOperator = [
  { label: "=", value: "3" },
  { label: "!=", value: "4" },
  { label: "LIKE", value: "7" },
  { label: "NOT LIKE", value: "8" },
  { label: "NULL", value: "9" },
  { label: "NOT NULL", value: "10" },
]; // for text

export const conditionalOperator = [
  { label: "=", value: "3" },
  { label: "!=", value: "4" },
  { label: ">", value: "5" },
  { label: ">=", value: "6" },
  { label: "<", value: "1" },
  { label: "<=", value: "2" },
  { label: "NULL", value: "9" },
  { label: "NOT NULL", value: "10" },
]; // for int, date, long, float

export const conditionalBooleanOperator = [
  { label: "=", value: "3" },
  { label: "!=", value: "4" },
  { label: "NULL", value: "9" },
  { label: "NOT NULL", value: "10" },
]; // for boolean

export const logicalOperatorOptions = [
  { label: "", value: "3" },
  { label: "AND", value: "1" },
  { label: "OR", value: "2" },
];

export const setOperatorOptions = [{ label: "+", value: "11" }];

export const secondaryDBFlagOptions = [
  { label: "Yes", value: "U" },
  { label: "No", value: "D" },
];

export const calendarTypeOptions = [
  { label: "Working Day", value: "Y" },
  { label: "Calender Day", value: "N" },
];

export function getOperator(operator) {
  let operatorValue;

  switch (operator) {
    case "11":
      operatorValue = "+";
      break;
    case "12":
      operatorValue = "-";
      break;
    case "13":
      operatorValue = "*";
      break;
    case "14":
      operatorValue = "/";
      break;
    case "15":
      operatorValue = "%";
      break;
    default:
      break;
  }

  return operatorValue;
}

export const getSecondaryDBFlagValue = (value) => {
  if (value === "U") {
    return "Yes";
  } else if (value === "D") {
    return "No";
  }
};

export function getConditionalOperatorLabel(valueSelected) {
  let label;
  if (valueSelected === "3") {
    label = "equal to";
  } else if (valueSelected === "4") {
    label = "not equals to";
  } else if (valueSelected === "7") {
    label = "like";
  } else if (valueSelected === "8") {
    label = "not like";
  } else if (valueSelected === "9") {
    label = "null";
  } else if (valueSelected === "10") {
    label = "not null";
  } else if (valueSelected === "") {
    label = "";
  } else if (valueSelected === "1") {
    label = "Less than";
  } else if (valueSelected === "2") {
    label = "Less than or equal to";
  } else if (valueSelected === "5") {
    label = "Greater than ";
  } else if (valueSelected === "6") {
    label = "Greater than or equal to";
  }
  return label;
}

export function getConditionalOperator(valueSelected) {
  let label;
  if (valueSelected === "3") {
    label = "=";
  } else if (valueSelected === "4") {
    label = "!=";
  } else if (valueSelected === "7") {
    label = "LIKE";
  } else if (valueSelected === "8") {
    label = "NOT LIKE";
  } else if (valueSelected === "9") {
    label = "NULL";
  } else if (valueSelected === "10") {
    label = "NOT NULL";
  } else if (valueSelected === "") {
    label = "";
  } else if (valueSelected === "2") {
    label = "<=";
  } else if (valueSelected === "6") {
    label = ">=";
  } else if (valueSelected === "1") {
    label = "<";
  } else if (valueSelected === "5") {
    label = ">";
  }
  return label;
}

export function getLogicalOperator(valueSelected) {
  var label;
  if (valueSelected === "1") {
    label = "AND";
  } else if (valueSelected === "2") {
    label = "OR";
  } else if (valueSelected === "3") {
    label = "";
  } else if (valueSelected === "") {
    label = "";
  }
  return label;
}

export function getTypedropdown(valueSelected) {
  var label;
  if (valueSelected === "1") {
    label = "SET";
  } else if (valueSelected === "8") {
    label = "INC PRIORITY";
  } else if (valueSelected === "9") {
    label = "DEC PRIORITY";
  } else if (valueSelected === "15") {
    label = "TRIGGER";
  } else if (valueSelected === "16") {
    label = "COMMIT";
  } else if (valueSelected === "18") {
    label = "ASSIGNED TO";
  } else if (valueSelected === "19") {
    label = "SET PARENT DATA";
  } else if (valueSelected === "22") {
    label = "CALL";
  } else if (valueSelected === "23") {
    label = "SET AND EXECUTE";
  } else if (valueSelected === "24") {
    label = "ESCALATE TO";
  } else if (valueSelected === "26") {
    label = "ESCALATE WITH TRIGGER";
  } else if (valueSelected === "4") {
    label = "ROUTE TO";
  } else if (valueSelected === "10") {
    label = "REINITIATE";
  } else if (valueSelected === "17") {
    label = "ROLLBACK";
  } else if (valueSelected === "25") {
    label = "AUDIT";
  } else if (valueSelected === "21") {
    label = "DISTRIBUTE TO";
  } else if (valueSelected === "39") {
    label = "REMINDER";
  } else if (valueSelected === "") {
    label = "";
  }
  return label;
}

export const operationTypeOptions = [
  { label: "SET", value: "1" },
  { label: "INC PRIORITY", value: "8" },
  { label: "DEC PRIORITY", value: "9" },
  { label: "TRIGGER", value: "15" },
  { label: "COMMIT", value: "16" },
  { label: "ASSIGNED TO", value: "18" },
  { label: "SET PARENT DATA", value: "19" },
  { label: "CALL", value: "22" },
  { label: "SET AND EXECUTE", value: "23" },
  { label: "ESCALATE TO", value: "24" },
  { label: "ESCALATE WITH TRIGGER", value: "26" },
  { label: "ROUTE TO", value: "4" },
  { label: "REINITIATE", value: "10" },
  { label: "ROLLBACK", value: "17" },
  { label: "AUDIT", value: "25" },
  { label: "DISTRIBUTE TO", value: "21" },
  { label: "REMINDER", value: "39" },
];

export const operationFieldKeys = {
  15: ["param1"],
  18: ["param1"],
  25: ["param1", "param2", "param3"],
  23: ["param1", "param2"],
  22: ["param1"],
  4: ["param1"],
  24: [
    "param1",
    "param2",
    "durationInfo.paramDays",
    "durationInfo.paramHours",
    "durationInfo.paramMinutes",
    "durationInfo.paramSeconds",
    "minute",
  ],
  26: [
    "triggerName",
    "param2",
    "durationInfo.paramDays",
    "durationInfo.paramHours",
    "durationInfo.paramMinutes",
    "durationInfo.paramSeconds",
    "minute",
  ],
  1: ["param1", "param2", "operator", "param3"],
  19: ["param1", "param2", "operator", "param3", "ruleCalFlag"],
  21: ["param1", "param2", "param3"],
  39: [
    "param2",
    "iReminderFrequency",
    "durationInfo.paramDays",
    "durationInfo.paramHours",
    "durationInfo.paramMinutes",
    "durationInfo.paramSeconds",

  ],
};

export const databaseExclusiveOperations = [
  "1",
  "4",
  "8",
  "9",
  "15",
  "10",
  "16",
  "17",
  "19",
  "22",
  "23",
  "25",
];

export const workdesksOperations = [
  "1",
  "8",
  "9",
  "15",
  "16",
  "18",
  "19",
  "22",
  "23",
  "24",
  "26",
];

export const distributeOperations = [
  "1",
  "21",
  "8",
  "9",
  "15",
  "16",
  "22",
  "23",
];

export const entryDetailsOperations = ["1", "8", "9", "15", "16", "22", "23"];

export const reminderOperations = ["39"];

export const replyOperations = [
  "1",
  "8",
  "9",
  "15",
  "16",
  "17",
  "19",
  "22",
  "23",
];