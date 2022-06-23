export const addConstantsToString = (string, value) => {
  return string + `&<${value}>&`;
};

export const getVariableById = (variableId, values) => {
  let variable;
  values &&
    values.forEach((content) => {
      if (content.VariableId === variableId) {
        variable = content;
      }
    });
  return variable;
};

export const getVariableByName = (variableName, values) => {
  let variable;
  values &&
    values.forEach((content) => {
      if (content.VariableName === variableName) {
        variable = content;
      }
    });
  return variable;
};
