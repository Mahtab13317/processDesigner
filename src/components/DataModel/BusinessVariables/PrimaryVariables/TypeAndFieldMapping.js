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

export const getVariableIdFromSysDefinedName = (sysDefName, variableType) => {
  let dataArr = [
    {
      variableType: "3",
      prefix: "VAR_INT",
      dataFields: [
        { varName: "VAR_INT1", varId: 1 },
        { varName: "VAR_INT2", varId: 2 },
        { varName: "VAR_INT3", varId: 3 },
        { varName: "VAR_INT4", varId: 4 },
        { varName: "VAR_INT5", varId: 5 },
        { varName: "VAR_INT6", varId: 6 },
        { varName: "VAR_INT7", varId: 7 },
        { varName: "VAR_INT8", varId: 8 },
      ],
    },
    {
      variableType: "4",
      prefix: "VAR_LONG",
      dataFields: [
        { varName: "VAR_LONG1", varId: 15 },
        { varName: "VAR_LONG2", varId: 16 },
        { varName: "VAR_LONG3", varId: 17 },
        { varName: "VAR_LONG4", varId: 18 },
        { varName: "VAR_LONG1", varId: 10008 },
        { varName: "VAR_LONG1", varId: 10009 },
      ],
    },
    {
      variableType: "6",
      prefix: "VAR_FLOAT",
      dataFields: [
        { varName: "VAR_FLOAT1", varId: 9 },
        { varName: "VAR_FLOAT2", varId: 10 },
      ],
    },
    {
      variableType: "8",
      dataFields: [
        { varName: "VAR_DATE1", varId: 11 },
        { varName: "VAR_DATE2", varId: 12 },
        { varName: "VAR_DATE3", varId: 13 },
        { varName: "VAR_DATE4", varId: 14 },
        { varName: "VAR_DATE5", varId: 10006 },
        { varName: "VAR_DATE6", varId: 10007 },
      ],
    },
    {
      variableType: "10",
      dataFields: [
        { varName: "VAR_STR1", varId: 19 },
        { varName: "VAR_STR2", varId: 20 },
        { varName: "VAR_STR3", varId: 21 },
        { varName: "VAR_STR4", varId: 22 },
        { varName: "VAR_STR5", varId: 23 },
        { varName: "VAR_STR6", varId: 24 },
        { varName: "VAR_STR7", varId: 25 },
        { varName: "VAR_STR8", varId: 26 },
        { varName: "VAR_STR9", varId: 10010 },
        { varName: "VAR_STR10", varId: 10011 },
        { varName: "VAR_STR11", varId: 10012 },
        { varName: "VAR_STR12", varId: 10013 },
        { varName: "VAR_STR13", varId: 10014 },
        { varName: "VAR_STR14", varId: 10015 },
        { varName: "VAR_STR15", varId: 10016 },
        { varName: "VAR_STR16", varId: 10017 },
        { varName: "VAR_STR17", varId: 10018 },
        { varName: "VAR_STR18", varId: 10019 },
        { varName: "VAR_STR19", varId: 10020 },
        { varName: "VAR_STR20", varId: 10021 },
      ],
    },
  ];
  let temp;
  dataArr.forEach((el) => {
    if (el.variableType === variableType) {
      el.dataFields.some((data) => {
        if (data.varName === sysDefName) {
          temp = data.varId;
          return true;
        }
      });
    }
  });
  return temp;
};

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
