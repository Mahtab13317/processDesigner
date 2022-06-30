// Function to get the variable type as per its type number.
export function getVariableType(type) {
  let typeName = "";
  if (type === "10") {
    typeName = "Text";
  } else if (type === "6") {
    typeName = "Float";
  } else if (type === "3") {
    typeName = "Integer";
  } else if (type === "4") {
    typeName = "Long";
  } else if (type === "8") {
    typeName = "Date";
  } else if (type === "12") {
    typeName = "Boolean";
  } else if (type === "15") {
    typeName = "ShortDate";
  } else if (type === "16") {
    typeName = "Time";
  } else if (type === "17") {
    typeName = "Duration";
  } else if (type === "18") {
    typeName = "NText";
  } else if (type === "0") {
    typeName = "Void";
  } else if (type === "11") {
    typeName = "Complex";
  }
  return typeName;
}

export function getTypeByVariable(typeName) {
  let type;
  if (typeName === "Text") {
    type = "10";
  } else if (typeName === "Float") {
    type = "6";
  } else if (typeName === "Integer") {
    type = "3";
  } else if (typeName === "Long") {
    type = "4";
  } else if (typeName === "Date") {
    type = "8";
  } else if (typeName === "Boolean") {
    type = "12";
  } else if (typeName === "ShortDate") {
    type = "15";
  } else if (typeName === "Time") {
    type = "16";
  } else if (typeName === "Duration") {
    type = "17";
  } else if (typeName === "NText") {
    type = "18";
  } else if (typeName === "Void") {
    type = "0";
  } else if (typeName === "Complex") {
    type = "11";
  }
  return type;
}

export const getVariableTypeFromMDMType = (mdmType) => {
  let type;
  if (mdmType === "1") {
    type = "10";
  } else if (mdmType === "4") {
    type = "6";
  } else if (mdmType === "2") {
    type = "3";
  } else if (mdmType === "3") {
    type = "4";
  } else if (mdmType === "5") {
    type = "8";
  } else if (mdmType === "8") {
    type = "12";
  } else if (mdmType === "9") {
    type = "15";
  } else if (mdmType === "10") {
    type = "18";
  }

  return type;
};
