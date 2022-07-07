import { store, useGlobalState } from "state-pool";
import { SERVER_URL } from "./../../Constants/appConstants";
import axios from "axios";

export const ConditionalOperator = [
  { label: "<", value: "1", type: [3, 8, 4, 6] },
  { label: "<=", value: "2", type: [3, 8, 4, 6] },
  { label: "=", value: "3", type: [10, 12, 3, 8, 4, 6] },
  { label: "!=", value: "4", type: [12, 10, 3, 8, 4, 6] },
  { label: ">", value: "5", type: [3, 8, 4, 6] },
  { label: ">=", value: "6", type: [3, 8, 4, 6] },
  { label: "like", value: "7", type: [10] },
  { label: "notLike", value: "8", type: [10] },
  { label: "null", value: "9", type: [12, 10, 3, 8, 4, 6] },
  { label: "notNull", value: "10", type: [12, 10, 3, 8, 4, 6] },
];

export const LogicalOperator = [
  { label: "AND", value: "1" },
  { label: "or", value: "2" },
  { label: "", value: "3" },
];

export function getConditionalOperator(valueSelected) {
  var label;
  if (valueSelected == "3") {
    label = "equal to";
  } else if (valueSelected == "4") {
    label = "not equals to";
  } else if (valueSelected == "7") {
    label = "like";
  } else if (valueSelected == "8") {
    label = "notLike";
  } else if (valueSelected == "9") {
    label = "null";
  } else if (valueSelected == "10") {
    label = "notNull";
  } else if (valueSelected == "") {
    label = "";
  }
  return label;
}

export function getLogicalOperator(valueSelected) {
  var label;
  if (valueSelected == "AND") {
    label = "1";
  } else if (valueSelected == "OR") {
    label = "2";
  } else if (valueSelected == "+") {
    label = "3";
  } else if (valueSelected == "") {
    label = "";
  }
  return label;
}

export function getLogicalOperatorReverse(valueSelected) {
  var label;
  if (valueSelected == "1") {
    label = "AND";
  } else if (valueSelected == "2") {
    label = "OR";
  } else if (valueSelected == "3") {
    label = "+";
  }
  return label;
}
export function getTypedropdown(valueSelected) {
  var label;
  if (valueSelected == "8") {
    label = "INC PRIORITY";
  } else if (valueSelected == "9") {
    label = "DEC PRIORITY";
  } else if (valueSelected == "15") {
    label = "TRIGGER";
  } else if (valueSelected == "16") {
    label = "COMMIT";
  } else if (valueSelected == "18") {
    label = "ASSIGNED TO";
  } else if (valueSelected == "19") {
    label = "SET PARENT DATA";
  } else if (valueSelected == "22") {
    label = "CALL";
  } else if (valueSelected == "23") {
    label = "SET AND EXECUTE";
  } else if (valueSelected == "24") {
    label = "ESCALATE TO";
  } else if (valueSelected == "26") {
    label = "ESCALATE WITH TRIGGER";
  } else if (valueSelected == "") {
    label = "";
  }
  return label;
}

export const Typedropdown = [];

export const CalenderType = [];

export const getVariablesBasedOnTypes = function GetVariablesBasedOnTypes({
  types = [],
}) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  if (localLoadedProcessData?.Variable) {
    if (types.length > 0) {
      return localLoadedProcessData.Variable.filter((variable) =>
        types.includes(+variable.VariableType)
      );
    }
    return localLoadedProcessData.Variable;
  }
  return [];
};

export const getAllVariableOptions = function GetAllVariableOption({
  types = [],
}) {
  const allVars = getVariablesBasedOnTypes({ types }) || [];
  return allVars.map((item) => ({
    name: item.VariableName,
    value: item.VariableName,
  }));
};
export const getVariablesByScopes = function GetVariablesByScopes({
  variables,
  scopes = [],
}) {
  const allVars = variables || [];
  if (allVars) {
    if (scopes.length > 0) {
      return variables.filter((variable) =>
        scopes.includes(variable.VariableScope)
      );
    }
    return [...allVars];
  }
  return [];
};
export const getVariableIdByName = function GetVariableId({ variables, name }) {
  const allVars = variables || [];
  const variable = allVars.find((item) => name === item.VariableName);
  return variable?.VariableId || "0";
};

export const getVariableExtObjectIdByName = function GetVariableExtObjectId({
  variables,
  name,
}) {
  const allVars = variables || [];
  const variable = allVars.find((item) => name === item.VariableName);
  return variable?.ExtObjectId || "0";
};
export const getVariableVarFieldIdByName = function GetVariableVarFieldId({
  variables,
  name,
}) {
  const allVars = variables || [];
  const variable = allVars.find((item) => name === item.VariableName);
  return variable?.VarFieldId || "0";
};
export const getVariableScopeByName = function GetVariableScope({
  variables,
  name,
}) {
  const allVars = variables || [];
  const variable = allVars.find((item) => name === item.VariableName);
  return variable?.VariableScope || "C";
};

export const createInstanceWithoutBearer = function (url) {
  return axios.create({
    baseURL: url ? url : SERVER_URL,
    headers: {
      /*  Authorization: `${
        JSON.parse(localStorage.getItem("launchpadKey") || "{}")?.token
      }`,*/
    },
  });
};
export const createInstance = function (url) {
  return axios.create({
    baseURL: url ? url : SERVER_URL,
    headers: {
      /* Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("launchpadKey") || "{}")?.token
      }`,*/
    },
  });
};
export const getLaunchpadKey = () => {
  return JSON.parse(localStorage.getItem("launchpadKey") || "{}")?.token;
};
