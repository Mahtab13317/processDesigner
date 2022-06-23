// Function to get data type as per its variable type.
export const getDropdownOptions = (variableType) => {
  let dataType = [];
  if (variableType === "3") {
    dataType = [
      "VAR_INT1",
      "VAR_INT2",
      "VAR_INT3",
      "VAR_INT4",
      "VAR_INT5",
      "VAR_INT6",
      "VAR_INT7",
      "VAR_INT8",
    ];
  } else if (variableType === "4") {
    dataType = [
      "VAR_LONG1",
      "VAR_LONG2",
      "VAR_LONG3",
      "VAR_LONG4",
      "VAR_LONG5",
      "VAR_LONG6",
    ];
  } else if (variableType === "6") {
    dataType = ["VAR_FLOAT1", "VAR_FLOAT2"];
  } else if (variableType === "8") {
    dataType = [
      "VAR_DATE1",
      "VAR_DATE2",
      "VAR_DATE3",
      "VAR_DATE4",
      "VAR_DATE5",
      "VAR_DATE6",
    ];
  } else if (variableType === "10") {
    dataType = [
      "VAR_STR1",
      "VAR_STR2",
      "VAR_STR3",
      "VAR_STR4",
      "VAR_STR5",
      "VAR_STR6",
      "VAR_STR7",
      "VAR_STR8",
      "VAR_STR9",
      "VAR_STR10",
      "VAR_STR11",
      "VAR_STR12",
      "VAR_STR13",
      "VAR_STR14",
      "VAR_STR15",
      "VAR_STR16",
      "VAR_STR17",
      "VAR_STR18",
      "VAR_STR19",
      "VAR_STR20",
    ];
  }
  return dataType;
};

export const dataInputs = [
  {
    variableType: "3",
    prefix: "VAR_INT",
    dataFields: [
      "VAR_INT1",
      "VAR_INT2",
      "VAR_INT3",
      "VAR_INT4",
      "VAR_INT5",
      "VAR_INT6",
      "VAR_INT7",
      "VAR_INT8",
    ],
  },
  {
    variableType: "4",
    prefix: "VAR_LONG",
    dataFields: [
      "VAR_LONG1",
      "VAR_LONG2",
      "VAR_LONG3",
      "VAR_LONG4",
      "VAR_LONG5",
      "VAR_LONG6",
    ],
  },
  {
    variableType: "6",
    prefix: "VAR_FLOAT",
    dataFields: ["VAR_FLOAT1", "VAR_FLOAT2"],
  },
  {
    variableType: "8",
    dataFields: [
      "VAR_DATE1",
      "VAR_DATE2",
      "VAR_DATE3",
      "VAR_DATE4",
      "VAR_DATE5",
      "VAR_DATE6",
    ],
  },
  {
    variableType: "10",
    dataFields: [
      "VAR_STR1",
      "VAR_STR2",
      "VAR_STR3",
      "VAR_STR4",
      "VAR_STR5",
      "VAR_STR6",
      "VAR_STR7",
      "VAR_STR8",
      "VAR_STR9",
      "VAR_STR10",
      "VAR_STR11",
      "VAR_STR12",
      "VAR_STR13",
      "VAR_STR14",
      "VAR_STR15",
      "VAR_STR16",
      "VAR_STR17",
      "VAR_STR18",
      "VAR_STR19",
      "VAR_STR20",
    ],
  },
];

export const addPrefix = (arr, prefix) => {
  const prefixedArray = arr.map((element, index) => {
    return (arr[index] = prefix + element);
  });
  return prefixedArray;
};

export function getVariableTypeCode(typeName) {
  let typeCode;
  if (typeName === "Text") {
    typeCode = "10";
  } else if (typeName === "Float") {
    typeCode = "6";
  } else if (typeName === "Integer") {
    typeCode = "3";
  } else if (typeName === "Long") {
    typeCode = "4";
  } else if (typeName === "Date") {
    typeCode = "8";
  }
  return typeCode;
}
