import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import clsx from "clsx";
import axios from "axios";
import { Checkbox, MenuItem } from "@material-ui/core";
import { useDispatch } from "react-redux";
import CustomizedDropdown from "../../../../../UI/Components_With_ErrrorHandling/Dropdown";
import MappingValues from "../MappingValues";
import TableRelation from "../TableRelation";
import FilterString from "../FilterString";
import {
  SERVER_URL,
  ENDPOINT_GET_COLUMNS,
} from "../../../../../Constants/appConstants";
import DataExchangeTableSection from "../DataExchangeTableSection";
import MultiSelect from "../../../../../UI/MultiSelect";
import {
  getMultiSelectedTableNames,
  getSelectedTableName,
} from "../CommonFunctions";
import { useTranslation } from "react-i18next";
import { setToastDataFunc } from "../../../../../redux-store/slices/ToastDataHandlerSlice";
import { getVariableType as getVarTypeName } from "../../../../../utility/ProcessSettings/Triggers/getVariableType";

function PropertyDetails(props) {
  const {
    operationType,
    openProcessType,
    openProcessID,
    isProcessReadOnly,
    getFilteredVariableList,
    existingTableData,
    filteredVariables,
    selectedOp,
    opList,
    setOpList,
    setGlobalData,
    tableDetails,
    setTableDetails,
  } = props;
  const dispatch = useDispatch();
  let { t } = useTranslation();
  const [isComplex, setIsComplex] = useState(false); // State that stores the flag for is complex checkbox.
  const [isNested, setIsNested] = useState(false); // State that stores the flag for is nested checkbox.
  const [updateIfExistFlag, setUpdateIfExistFlag] = useState(true); // State that stors the flag for update if exist value.
  const [selectedTableName, setSelectedTableName] = useState(""); // Selected table name.
  const [multiSelectedTableNames, setMultiSelectedTableNames] = useState([]); // State that stores the multi selected table names for complex type.
  const [selectedComplexName, setSelectedComplexName] = useState(""); // State that stores the selected complex name.
  const [complexVarList, setComplexVarList] = useState([]); // State that stores the list of complex variables.
  const [nestedComplexVars, setNestedComplexVars] = useState([]); // State that stores the list of all nested complex variables.
  const [simpleComplexVars, setSimpleComplexVars] = useState([]); // State that stores the list of all simple complex variables.

  const [mappingData, setMappingData] = useState([]); // List of all mappings for an import/export rule.
  const [tableRelationData, setTableRelationData] = useState([]); // List of all table relations for an import/export rule.
  const [selectedVariableName, setSelectedVariableName] = useState(""); // State that stores the selected variable name value.
  const [mappingDataExchgTable, setMappingDataExchgTable] = useState(""); // State that stores the selected data exchange table name.
  const [selectedMappingColumn, setSelectedMappingColumn] = useState(""); // State that stores the selected mapping column name.
  const [dataExchgTableList, setDataExchgTableList] = useState([]); // State that stores the data exchange table dropdown values.
  const [mappingColumnList, setMappingColumnList] = useState([]); // State that stores all the mapping column dropdown values.
  const [filteredMappingColumnList, setFilteredMappingColumnList] = useState(
    []
  ); // State that stores the filtered mapping column dropdown values.

  const [filteredExptVarList, setFilteredExptVarList] = useState([]); // State that stores the filtered variables according to column selected in export mapping values rule.
  const [filteredProcessTableExptList, setFilteredProcessTableExptList] =
    useState([]); // State that stores the filtered process table list according to data exchange column selected in export table relation rule.
  const [rowCountOutput, setRowCountOutput] = useState(""); // State that stores the selected row count output.
  const [selectedProcessTable, setSelectedProcessTable] = useState(""); // State that stores the selected process table.
  const [processTableList, setProcessTableList] = useState([
    { TableName: "WFINSTRUMENTTABLE" },
  ]); // State that stores the options for process table dropdown.
  const [varListForComplex, setVarListForComplex] = useState([]); // State that stores the list of all nested variables like x.y.z;
  const [listOfComplexTables, setListOfComplexTables] = useState([]); // State that stores the list of all tables associated with the selected complex variable.
  const [column1Value, setColumn1Value] = useState(""); // State that stores the value for columns of process table.
  const [processTableColumnList, setProcessTableColumnList] = useState([]); // State that stores the options for process table columns.
  const [filteredTRColumnList, setFilteredTRColumnList] = useState([]); // State that stores the filtered column list options for data exchange in table relation.
  const [selectedTRDataExchngTable, setSelectedTRDataExchngTable] =
    useState(""); // State that stores the value of data exchange table name in table relation.
  const [tRDataExchgColumnList, setTRDataExchgColumnList] = useState([]); // State that stores the column list for the data exchange table in table relation.
  const [column2Value, setColumn2Value] = useState(""); // State that stores the selected column value of data exchange table in table relation.
  const [filterStrDataExchgTable, setFilterStrDataExchgTable] = useState(""); // State that stores the selected data exchange table name in filter string for complex is nested case.
  const [filterStringData, setFilterStringData] = useState([]); // State that stores the data for filter string.
  const [filterStringValue, setFilterStringValue] = useState(""); // State that stores the value of filter string textarea.
  const [dataExchgTableSectnData, setDataExchgTableSectnData] = useState([]); // State that stores the data for data exchange table section.
  const [parentDataExchgTable, setParentDataExchgTable] = useState(""); // State that stores the parent data exchange table name.
  const [parentTableColumn, setParentTableColumn] = useState(""); // State that stores the parent data exchange table column name.
  const [childDataExchgTable, setChildDataExchgTable] = useState(""); // State that stores the child data exchange table name.
  const [childTableColumn, setChildTableColumn] = useState(""); // State that stores the child data exchange table column name.
  const [parentTableColumnList, setParentTableColumnList] = useState([]); // State that stores the list of columns of selected parent table.
  const [filteredChildColumnList, setFilteredChildColumnList] = useState([]); // State that stores the list of all filtered child column list for a selected child table.

  // Function that gets called when opList or selectedOp changes.
  useEffect(() => {
    if (opList) {
      const data = opList[selectedOp];
      if (operationType === "1") {
        setUpdateIfExistFlag(data?.m_bUpdateIfExist);
        setMappingData(data?.m_arrMappingValuesInfo);
        setTableRelationData(data?.m_arrTableRelationValuesInfo);
        setIsNested(data?.m_bIsNested);
        setIsComplex(data?.m_bIsComplex);
        if (data?.hasOwnProperty("m_arrDataExValuesInfo")) {
          setDataExchgTableSectnData(data?.m_arrDataExValuesInfo);
        } else {
          setDataExchgTableSectnData([]);
        }
        if (data?.hasOwnProperty("m_arrFilterStringTableImpInfo")) {
          setFilterStringData(data?.m_arrFilterStringTableImpInfo);
        } else {
          setFilterStringData([]);
        }
        if (data?.hasOwnProperty("m_sFilterString")) {
          setFilterStringValue(data?.m_sFilterString);
        } else {
          setFilterStringValue("");
        }
      } else {
        setUpdateIfExistFlag(data?.m_bUpdateIfExistEx);
        setMappingData(data?.m_arrExportMappingValuesInfo);
        setTableRelationData(data?.m_arrExTableRelationValuesInfo);
        setIsNested(data?.m_bIsNestedExport);
        setIsComplex(data?.m_bIsComplexExport);
        if (data?.hasOwnProperty("m_sExFilterString")) {
          setFilterStringValue(data?.m_sExFilterString);
        } else {
          setFilterStringValue([]);
        }
        if (data?.hasOwnProperty("m_arrFilterStringTableExpInfo")) {
          setFilterStringData(data?.m_arrFilterStringTableExpInfo);
        } else {
          setFilterStringData([]);
        }
      }

      if (operationType === "1") {
        if (data?.m_bIsComplex) {
          if (data?.m_arrMappingValuesInfo.length > 0) {
            setSelectedComplexName(
              getSelectedComplexName(data?.m_arrMappingValuesInfo)[0]
            );
          }
        }
      } else {
        if (data?.m_bIsComplexExport) {
          if (data?.m_arrExportMappingValuesInfo.length > 0) {
            setSelectedComplexName(
              getSelectedComplexName(data?.m_arrExportMappingValuesInfo)[0]
            );
          }
        }
      }

      if (operationType === "1" ? data?.m_bIsNested : data?.m_bIsNestedExport) {
        if (operationType === "1") {
          const multiSelectedTableNamesArr = getMultiSelectedTableNames(
            data?.m_arrMappingValuesInfo,
            data?.m_arrTableRelationValuesInfo,
            data?.hasOwnProperty("m_arrDataExValuesInfo") &&
              data?.m_arrDataExValuesInfo,
            data?.hasOwnProperty("m_arrFilterStringTableImpInfo") &&
              data?.m_arrFilterStringTableImpInfo
          );
          setMultiSelectedTableNames(multiSelectedTableNamesArr);
        } else {
          const multiSelectedTableNamesArr = getMultiSelectedTableNames(
            data?.m_arrExportMappingValuesInfo,
            data?.m_arrExTableRelationValuesInfo,
            [],
            data?.hasOwnProperty("m_arrFilterStringTableExpInfo") &&
              data?.m_arrFilterStringTableExpInfo
          );
          setMultiSelectedTableNames(multiSelectedTableNamesArr);
        }
      } else {
        if (operationType === "1") {
          const selectedImportTableName = getSelectedTableName(
            data?.m_arrMappingValuesInfo
          );
          if (tableDetails[selectedOp]) {
            setTableDetails((prevState) => {
              let temp = [...prevState];
              temp[selectedOp].selectedTableName = selectedImportTableName;
              return temp;
            });
          }
          setSelectedTableName(selectedImportTableName);
        } else {
          const selectedExportTableName = getSelectedTableName(
            data?.m_arrExportMappingValuesInfo
          );
          if (tableDetails[selectedOp]) {
            setTableDetails((prevState) => {
              let temp = [...prevState];
              temp[selectedOp].selectedTableName = selectedExportTableName;
              return temp;
            });
          }
          setSelectedTableName(selectedExportTableName);
        }
      }
      setRowCountOutput(data?.selectedparam1);
    }
  }, [selectedOp, opList]);

  // Function that runs when the existingTableData changes.
  useEffect(() => {
    let processTabList = [];
    existingTableData?.forEach((element) => {
      if (element.TableType === "E") {
        processTabList.push(element);
      }
    });
    processTabList.unshift({ TableName: "WFINSTRUMENTTABLE" });
    setProcessTableList(processTabList);
  }, [existingTableData]);

  // Function that runs when isComplex and selectedComplexName changes.
  useEffect(() => {
    if (!isComplex) {
      setSelectedComplexName("");
    }
    if (isComplex && selectedComplexName !== "") {
      const complexValueObj = getComplexVarNames();
      setVarListForComplex(complexValueObj?.complexVariableNames);
      let tablesArr = [...processTableList];
      let complexTables = complexValueObj?.complexTableNames;
      complexTables?.forEach((element) => {
        const obj = { TableName: element };
        tablesArr.push(obj);
      });
      tablesArr?.forEach((element, index) => {
        element.id = index + 1;
      });
      setListOfComplexTables(tablesArr);
    }
  }, [isComplex, selectedComplexName]);

  // Function to get the complex variable names out using recursion.
  const getComplexVarNames = () => {
    let selectedVarElement = {};
    let complexTablesArr = [];
    let complexVariableNames = [];
    filteredVariables?.forEach((element) => {
      if (element.VariableName === selectedComplexName) {
        selectedVarElement = element;
      }
    });

    // Recursive function that is used to find out nested cases
    const recursiveRelationAndMappingFunc = (element, nestedComplexName) => {
      let varName = selectedComplexName + "." + element.VariableName;
      const varObj = {
        VariableLength: element.VariableLength,
        VariableName:
          nestedComplexName === null
            ? selectedComplexName + "." + element.VariableName
            : nestedComplexName + "." + element.VariableName,
        VariableType: element.VariableType,
      };
      if (nestedComplexName !== null) {
        varName = nestedComplexName + "." + element.VariableName;
      }
      let complexVarName = varName;
      complexVariableNames.push(varObj);
      if (element.TableName !== "") {
        complexTablesArr.push(element.TableName);
      }
      if (element.hasOwnProperty("Relation&Mapping")) {
        if (element["Relation&Mapping"].hasOwnProperty("Mappings")) {
          element["Relation&Mapping"].Mappings?.Mapping.forEach((elem) => {
            recursiveRelationAndMappingFunc(elem, complexVarName);
          });
        }
      }
    };

    if (selectedVarElement.hasOwnProperty("RelationAndMapping")) {
      if (selectedVarElement?.RelationAndMapping?.hasOwnProperty("Mappings")) {
        complexTablesArr.push(
          selectedVarElement?.RelationAndMapping?.Mappings?.TableName
        );
        selectedVarElement?.RelationAndMapping?.Mappings?.Mapping?.forEach(
          (element) => {
            recursiveRelationAndMappingFunc(element, null);
          }
        );
      }
    }
    return {
      complexTableNames: complexTablesArr,
      complexVariableNames: complexVariableNames,
    };
  };

  // Function that gets the selected complex name from mapping data arr.
  const getSelectedComplexName = (mappingDataArr) => {
    let complexName = "";
    complexName =
      mappingDataArr && mappingDataArr[0]?.processVarName.split(".", 1);
    return complexName;
  };

  // Function that gets called when the filteredVariables value changes and checks whether complexs are nested or not and saves them in two different states.
  useEffect(() => {
    const complexList = filteredVariables?.filter(
      (element) =>
        element.VariableScope === "I" && element.VariableType === "11"
    );
    let notNestedComplexVariables = [];
    let nestedComplexVariables = [];
    complexList.length > 0 &&
      complexList?.forEach((element) => {
        if (element.hasOwnProperty("RelationAndMapping")) {
          const mappings = element.RelationAndMapping?.Mappings?.Mapping;
          let isNestedComplex = false;
          mappings.length > 0 &&
            mappings?.forEach((elem) => {
              if (elem.hasOwnProperty("Relation&Mapping")) {
                if (elem["Relation&Mapping"]?.hasOwnProperty("Mappings")) {
                  isNestedComplex = isNestedComplex || true;
                } else {
                  isNestedComplex = isNestedComplex || false;
                }
              } else {
                isNestedComplex = isNestedComplex || false;
              }
            });
          if (isNestedComplex) {
            nestedComplexVariables.push(element);
          } else {
            notNestedComplexVariables.push(element);
          }
        }
      });
    setNestedComplexVars(nestedComplexVariables);
    setSimpleComplexVars(notNestedComplexVariables);
  }, [filteredVariables]);

  // Function that gets called when the isNested value changes.
  useEffect(() => {
    if (isNested) {
      setComplexVarList(nestedComplexVars);
      // setSelectedComplexName("");
      setMultiSelectedTableNames([]);
    } else {
      setComplexVarList(simpleComplexVars);
      setSelectedComplexName("");
      setMultiSelectedTableNames([]);
    }
  }, [isNested]);

  // Function that gets called when the selectedTableName value changes.
  useEffect(async () => {
    const tempArr = existingTableData?.filter(
      (element) => element.TableName === selectedTableName
    );
    setDataExchgTableList(tempArr);
    if (selectedTableName !== "") {
      const response = await getColumnListAPICall(selectedTableName);
      setMappingColumnList(response?.data?.Column);
    }
  }, [selectedTableName]);

  // Function that gets called when the selectedProcessTable value changes.
  useEffect(async () => {
    if (selectedProcessTable !== "") {
      const response = await getColumnListAPICall(selectedProcessTable);
      setProcessTableColumnList(response?.data?.Column);
    }
  }, [selectedProcessTable]);

  // Function that gets called when the selectedTRDataExchngTable value changes.
  useEffect(async () => {
    if (selectedTRDataExchngTable !== "") {
      const response = await getColumnListAPICall(selectedTRDataExchngTable);
      setTRDataExchgColumnList(response?.data?.Column);
    }
  }, [selectedTRDataExchngTable]);

  // Function that gets called when the paramters change according to operation type.
  useEffect(async () => {
    if (
      operationType === "1"
        ? selectedVariableName !== ""
        : selectedMappingColumn !== ""
    ) {
      let variableType = "";
      if (isComplex && isNested) {
        variableType = getVariableType(selectedVariableName, varListForComplex);
      } else if (isComplex && !isNested) {
        variableType = getVariableType(selectedVariableName, varListForComplex);
      } else {
        variableType = getVariableType(selectedVariableName, filteredVariables);
      }

      if (operationType === "1") {
        if (
          isNested &&
          selectedVariableName !== "" &&
          mappingDataExchgTable !== ""
        ) {
          setSelectedMappingColumn("");
          const res = await getColumnListAPICall(mappingDataExchgTable);
          const response = res?.data?.Column;
          setFilteredColumnsFunc(
            variableType,
            response,
            setFilteredMappingColumnList
          );
        } else {
          setFilteredColumnsFunc(
            variableType,
            mappingColumnList,
            setFilteredMappingColumnList
          );
        }
      } else {
        const columnVarType = getColumnType(
          selectedMappingColumn,
          mappingColumnList
        );
        if (selectedMappingColumn !== "" && mappingDataExchgTable !== "") {
          setSelectedVariableName("");
          if (isComplex) {
            setFilteredVariableFunc(
              columnVarType,
              varListForComplex,
              setFilteredExptVarList
            );
          } else {
            setFilteredVariableFunc(
              columnVarType,
              filteredVariables.filter(
                (element) => element.VariableScope !== "I"
              ),
              setFilteredExptVarList
            );
          }
        }
      }
    }
  }, [
    operationType === "1" ? selectedVariableName : selectedMappingColumn,
    mappingDataExchgTable,
  ]);

  // Common function to filter columns based on a variable type from a column list and save them to a state whose setter function we provide.
  const setFilteredColumnsFunc = (variableType, columnList, setterFunc) => {
    const filteredArr = columnList?.filter(
      (element) => element.Type === variableType
    );
    setterFunc(filteredArr);
  };

  // Common function to filter variables based on a column type from a variable list and save them to a state whose setter function we provide.
  const setFilteredVariableFunc = (columnType, variableList, setterFunc) => {
    const filteredArr = variableList?.filter(
      (element) => element.VariableType === columnType
    );
    setterFunc(filteredArr);
  };

  // Function that gets called when the parameters change according to operation type.
  useEffect(async () => {
    if (operationType === "1" ? column1Value !== "" : column2Value !== "") {
      if (operationType === "1") {
        setColumn2Value("");
        const variableType = getColumnType(
          column1Value,
          processTableColumnList
        );
        const filteredTRColumnsArr = tRDataExchgColumnList?.filter(
          (element) => element.Type === variableType
        );
        setFilteredTRColumnList(filteredTRColumnsArr);
      } else {
        setColumn1Value("");
        const variableType = getColumnType(column2Value, mappingColumnList);
        const response = await getColumnListAPICall(selectedProcessTable);
        setProcessTableColumnList(response?.data?.Column);
        const filteredTRColumnsArr = response?.data?.Column?.filter(
          (element) => element.Type === variableType
        );
        setFilteredProcessTableExptList(filteredTRColumnsArr);
      }
    }
  }, [
    operationType === "1" ? selectedTRDataExchngTable : selectedProcessTable,
    operationType === "1" ? column1Value : column2Value,
  ]);

  // Function that gets called when the parent data exchange table changes.
  useEffect(async () => {
    if (parentDataExchgTable !== "") {
      const response = await getColumnListAPICall(parentDataExchgTable);
      setParentTableColumnList(response?.data?.Column);
    }
  }, [parentDataExchgTable]);

  useEffect(async () => {
    if (childDataExchgTable !== "") {
      const response = await getColumnListAPICall(childDataExchgTable);
      setFilteredChildColumnList(response?.data?.Column);
    }
  }, [childDataExchgTable]);

  // Function that handles the is complex flag change.
  const isComplexFlagHandler = () => {
    setIsNested(false);
    setIsComplex((prevState) => {
      return !prevState;
    });
    setOpList((prevData) => {
      const temp = [...prevData];
      if (operationType === "1") {
        temp[selectedOp].m_bIsComplex = !temp[selectedOp].m_bIsComplex;
        temp[selectedOp].m_bIsNested = false;
      } else {
        temp[selectedOp].m_bIsComplexExport =
          !temp[selectedOp].m_bIsComplexExport;
        temp[selectedOp].m_bIsNestedExport = false;
      }
      setGlobalData(temp);
      return temp;
    });
    setMultiSelectedTableNames([]);
  };

  // Function that handles the is nested flag change.
  const isNestedHandler = () => {
    setIsNested((prevState) => {
      return !prevState;
    });
    setListOfComplexTables([]);
    setOpList((prevData) => {
      const temp = [...prevData];
      if (operationType === "1") {
        temp[selectedOp].m_bIsNested = !temp[selectedOp].m_bIsNested;
        temp[selectedOp].m_arrFilterStringTableImpInfo = [];
        temp[selectedOp].m_arrDataExValuesInfo = [];
        temp[selectedOp].m_sFilterString = "";
      } else {
        temp[selectedOp].m_bIsNestedExport =
          !temp[selectedOp].m_bIsNestedExport;
        temp[selectedOp].m_arrFilterStringTableExpInfo = [];
        temp[selectedOp].m_sExFilterString = "";
      }
      setGlobalData(temp);
      return temp;
    });
  };

  // Function that handles the update if exist flag change.
  const updatedIfExistHandler = () => {
    setUpdateIfExistFlag((prevState) => {
      return !prevState;
    });
    setOpList((prevData) => {
      const temp = [...prevData];
      if (operationType === "1") {
        temp[selectedOp].m_bUpdateIfExist = !temp[selectedOp]?.m_bUpdateIfExist;
      } else {
        temp[selectedOp].m_bUpdateIfExistEx =
          !temp[selectedOp]?.m_bUpdateIfExistEx;
      }
      setGlobalData(temp);
      return temp;
    });
  };

  // Common function to get the type of a variable using the arguments sent.
  const getVariableType = (variableName, variableList) => {
    let variableType;
    variableList?.forEach((element) => {
      if (element.VariableName === variableName) {
        variableType = element.VariableType;
      }
    });
    return variableType;
  };

  // Common function that gets the length of a column or a variable based on the arguments sent.
  const getLengthValue = (name, list, nameKey, lengthKey) => {
    let length;
    list?.forEach((element) => {
      if (element[nameKey] === name) {
        length = element[lengthKey];
      }
    });
    return length;
  };

  // Function to get the type of a column based on the arguments sent.
  const getColumnType = (columnName, columnList) => {
    let columnType;
    columnList?.forEach((element) => {
      if (element.Name === columnName) {
        columnType = element.Type;
      }
    });
    return columnType;
  };

  // Function to find the max order id for an array sent in arguments.
  const findMaxOrderId = (array, key) => {
    let maxOrderId = 0;
    array?.forEach((element) => {
      if (element[key] > maxOrderId) {
        maxOrderId = element[key];
      }
    });
    return maxOrderId;
  };

  // Common function call to get the columns of any table whose name is sent as arguments.
  const getColumnListAPICall = async (tableName) => {
    return await axios.get(
      SERVER_URL +
        ENDPOINT_GET_COLUMNS +
        `/${openProcessID}` +
        `/${openProcessType}` +
        `/${tableName}`
    );
  };

  // Function that gets called when the user clicks on cancel button for mapping values data.
  const cancelMappingHandler = () => {
    setSelectedVariableName("");
    setMappingDataExchgTable("");
    setSelectedMappingColumn("");
  };

  // Function that gets called when the user clicks on cancel button for table relation data.
  const cancelTableRelationHandler = () => {
    setSelectedProcessTable("");
    setColumn1Value("");
    setSelectedTRDataExchngTable("");
    setColumn2Value("");
  };

  // Function that gets called when the user clicks on cancel button for filter string data.
  const cancelFilterStringHandler = () => {
    setFilterStringValue("");
    setFilterStrDataExchgTable("");
  };

  // Function that gets called when the user clicks on cancel button for filter string data.
  const cancelDataExchgTableSecHandler = () => {
    setParentDataExchgTable("");
    setParentTableColumn("");
    setChildDataExchgTable("");
    setChildTableColumn("");
  };

  const getS_VarType = (complex, nested) => {
    if (complex && nested) {
      return "N";
    } else if (complex && !nested) {
      return "C";
    } else if (!complex && !nested) {
      return "P";
    }
  };

  // Function that gets called when the user clicks on add button after filling mapping details.
  const addMappingHandler = () => {
    let variableType = "";
    let mappingColumnLength = "";
    let selectedVarLength = "";
    const sVarType = getS_VarType(isComplex, isNested);

    if (isComplex && isNested) {
      variableType = getVariableType(selectedVariableName, varListForComplex);
      selectedVarLength = getLengthValue(
        selectedVariableName,
        varListForComplex,
        "VariableName",
        "VariableLength"
      );
    } else if (isComplex && !isNested) {
      variableType = getVariableType(selectedVariableName, varListForComplex);
      selectedVarLength = getLengthValue(
        selectedVariableName,
        varListForComplex,
        "VariableName",
        "VariableLength"
      );
    } else {
      variableType = getVariableType(selectedVariableName, filteredVariables);
      selectedVarLength = getLengthValue(
        selectedVariableName,
        filteredVariables,
        "VariableName",
        "VariableLength"
      );
    }

    mappingColumnLength = getLengthValue(
      selectedMappingColumn,
      operationType === "1" ? filteredMappingColumnList : mappingColumnList,
      "Name",
      "Length"
    );

    if (
      operationType === "1"
        ? isLengthValid(mappingColumnLength, selectedVarLength)
        : isLengthValid(selectedVarLength, mappingColumnLength)
    ) {
      const mappingObj = {
        m_bIsNullable: "Y",
        m_iExtObjId: 0,
        m_iVarFieldId: 0,
        m_iVariableId: 11,
        m_sVarType: sVarType,
        m_strVarScope: "U",
        processVarName: selectedVariableName,
        processVarType: getVarTypeName(variableType),
        selectedEntityName: mappingDataExchgTable,
        selectedEntityType: variableType,
        selectedEntityValue: selectedMappingColumn,
      };
      let tempArr = [...mappingData];
      tempArr.push(mappingObj);
      setMappingData(tempArr);
      setOpList((prevData) => {
        const temp = [...prevData];
        if (operationType === "1") {
          temp[selectedOp].m_arrMappingValuesInfo.push(mappingObj);
        } else {
          temp[selectedOp].m_arrExportMappingValuesInfo.push(mappingObj);
        }
        setGlobalData(temp);
        return temp;
      });
      cancelMappingHandler();
    } else {
      dispatch(
        setToastDataFunc({
          message: `${t("selectedPascalCase")} ${
            operationType === "1"
              ? `${t("dataExchangeColumn")}`
              : `${t("processVariable")}`
          } ${t("lengthLessThanOrEqualTo")} ${
            operationType === "1"
              ? `${t("processVariable")}`
              : `${t("dataExchangeColumn")}`
          } ${t("lengthSmallCase")}.`,
          severity: "error",
          open: true,
        })
      );
    }
  };

  // Common function that is used to compare two values and accordingly return a boolean value.
  const isLengthValid = (length1, length2) => {
    return +length1 <= +length2;
  };

  // Function that gets called when the user clicks on add button after filling filter string data in isNested case.
  const addFilterStringHandler = () => {
    const filterStringObj = {
      m_sFilterStrImpNested: filterStringValue,
      m_sTableName: filterStrDataExchgTable,
    };
    if (!checkFilterStringData(filterStringObj)) {
      let tempArr = [...filterStringData];
      tempArr.push(filterStringObj);
      setFilterStringData(tempArr);
      setOpList((prevData) => {
        const temp = [...prevData];
        if (operationType === "1") {
          temp[selectedOp].m_arrFilterStringTableImpInfo.push(filterStringObj);
        } else {
          temp[selectedOp].m_arrFilterStringTableExpInfo.push(filterStringObj);
        }
        setGlobalData(temp);
        return temp;
      });
      cancelFilterStringHandler();
    } else {
      dispatch(
        setToastDataFunc({
          message: t("multipleEntriesNotAllowed"),
          severity: "error",
          open: true,
        })
      );
    }
  };

  // Function that checks the filter string data whether all tables are only being used once or not.
  const checkFilterStringData = (filterStringObj) => {
    let isTableUsed = false;
    filterStringData?.forEach((element) => {
      if (element.m_sTableName === filterStringObj.m_sTableName) {
        isTableUsed = true;
      }
    });
    return isTableUsed;
  };

  // Function that sets the filter string for both complex and non complex cases.
  const filterStringHandler = (value) => {
    setFilterStringValue(value);
    setOpList((prevData) => {
      const temp = [...prevData];
      if (operationType === "1") {
        temp[selectedOp].m_sFilterString = value;
      } else {
        temp[selectedOp].m_sExFilterString = value;
      }
      setGlobalData(temp);
      return temp;
    });
  };

  // Function that gets called when the user clicks on add button after filling data exchange table section data in isNested case.
  const addDataExchgTableSecHandler = () => {
    const type = getColumnType(parentTableColumn, parentTableColumnList);
    const dataExchgTableSecObj = {
      m_sSelecteddataExCol1: parentTableColumn,
      m_sSelecteddataExCol2: childTableColumn,
      m_sSelecteddataExTable1: parentDataExchgTable,
      m_sSelecteddataExTable2: childDataExchgTable,
      selectedEntityType: type,
    };
    let tempArr = [...dataExchgTableSectnData];
    tempArr.push(dataExchgTableSecObj);
    setDataExchgTableSectnData(tempArr);
    setOpList((prevData) => {
      const temp = [...prevData];
      if (operationType === "1") {
        temp[selectedOp].m_arrDataExValuesInfo.push(dataExchgTableSecObj);
      }
      setGlobalData(temp);
      return temp;
    });
    cancelDataExchgTableSecHandler();
  };

  // Function that gets called when the user deletes an existing mapping data value.
  const deleteMappingHandler = (index) => {
    deleteFieldHandler(
      index,
      mappingData,
      setMappingData,
      operationType === "1"
        ? "m_arrMappingValuesInfo"
        : "m_arrExportMappingValuesInfo"
    );
  };

  // Function that gets called when the user deletes an existing table relation value.
  const deleteTableRelationHandler = (index) => {
    deleteFieldHandler(
      index,
      tableRelationData,
      setTableRelationData,
      operationType === "1"
        ? "m_arrTableRelationValuesInfo"
        : "m_arrExTableRelationValuesInfo"
    );
  };

  // Function that gets called when the user deletes an existing filter string data value.
  const deleteFilterStringHandler = (index) => {
    deleteFieldHandler(
      index,
      filterStringData,
      setFilterStringData,
      operationType === "1"
        ? "m_arrFilterStringTableImpInfo"
        : "m_arrFilterStringTableExpInfo"
    );
  };

  // Function that gets called when the user deletes an existing data exchange table section value.
  const deleteDataExchgTableSecHandler = (index) => {
    deleteFieldHandler(
      index,
      dataExchgTableSectnData,
      setDataExchgTableSectnData,
      "m_arrDataExValuesInfo"
    );
  };

  // Function that gets called when the user clicks on add button after filling table relation data.
  const addTableRelationHandler = () => {
    let dataExchgColumnLength = "";
    let processTableColumnLength = "";

    dataExchgColumnLength = getLengthValue(
      column2Value,
      operationType === "1" ? filteredTRColumnList : mappingColumnList,
      "Name",
      "Length"
    );

    processTableColumnLength = getLengthValue(
      column1Value,
      operationType === "1"
        ? processTableColumnList
        : filteredProcessTableExptList,
      "Name",
      "Length"
    );

    if (
      operationType === "1"
        ? isLengthValid(dataExchgColumnLength, processTableColumnLength)
        : isLengthValid(processTableColumnLength, dataExchgColumnLength)
    ) {
      const tableRelationObj = {
        m_strSelectedProcColumn: column1Value,
        m_strSelectedProcTable: selectedProcessTable,
        selectedEntityName: selectedTRDataExchngTable,
        selectedEntityType: getColumnType(column1Value, processTableColumnList),
        selectedEntityValue: column2Value,
      };
      const tempArr = [...tableRelationData];
      tempArr.push(tableRelationObj);
      setTableRelationData(tempArr);
      setOpList((prevData) => {
        const temp = [...prevData];
        if (operationType === "1") {
          temp[selectedOp].m_arrTableRelationValuesInfo.push(tableRelationObj);
        } else {
          temp[selectedOp].m_arrExTableRelationValuesInfo.push(
            tableRelationObj
          );
        }
        setGlobalData(temp);
        return temp;
      });
      cancelTableRelationHandler();
    } else {
      dispatch(
        setToastDataFunc({
          message: `${t("selectedPascalCase")} ${
            operationType === "1"
              ? `${t("dataExchangeColumn")}`
              : `${t("processTableColumn")}`
          } ${t("lengthLessThanOrEqualTo")} ${
            operationType === "1"
              ? `${t("processTableColumn")}`
              : `${t("dataExchangeColumn")}`
          } ${t("lengthSmallCase")}.`,
          severity: "error",
          open: true,
        })
      );
    }
  };

  // Common function that gets called when the user deletes an existing data.
  const deleteFieldHandler = (index, state, setterFunc, key) => {
    let tempArr = [...state];
    tempArr.splice(index, 1);
    setterFunc(tempArr);
    setOpList((prevData) => {
      let temp = [...prevData];
      temp[selectedOp][key].splice(index, 1);
      setGlobalData(temp);
      return temp;
    });
  };

  // Function that handles the row count output change.
  const rowCountOutputHandler = (value) => {
    let varId = "";
    setRowCountOutput(value);
    getFilteredVariableList()?.forEach((element) => {
      if (element.VariableName === value) {
        varId = element.VariableId;
      }
    });
    setOpList((prevData) => {
      const temp = [...prevData];
      temp[selectedOp].selectedparam1 = value;
      temp[selectedOp].m_sRowCountVarId = varId;
      setGlobalData(temp);
      return temp;
    });
  };

  return (
    <div>
      <div
        className={clsx(
          styles.flexColumn,
          styles.cabinetDetailsDiv,
          styles.propertiesWidth,
          styles.propertiesScroll
        )}
      >
        <div className={styles.flexRow}>
          <p className={clsx(styles.heading, styles.propertiesHeading)}>
            {t("Properties")}
          </p>
        </div>
        <div className={clsx(styles.propertiesDiv, styles.flexColumn)}>
          <div className={styles.flexColumn}>
            <p className={styles.fieldTitle}>{t("rowCountOutput")}</p>
            <CustomizedDropdown
              disabled={isProcessReadOnly}
              id="DE_Row_Count_Output_Dropdown"
              className={styles.dropdown}
              value={rowCountOutput}
              onChange={(event) => rowCountOutputHandler(event.target.value)}
              isNotMandatory={true}
            >
              {getFilteredVariableList()?.map((element) => {
                return (
                  <MenuItem
                    className={styles.menuItemStyles}
                    value={element.VariableName}
                    key={element.VariableName}
                  >
                    {element.VariableName}
                  </MenuItem>
                );
              })}
            </CustomizedDropdown>
          </div>
          <div className={clsx(styles.flexRow, styles.checkBoxTextMargin)}>
            <Checkbox
              disabled={isProcessReadOnly}
              id="DE_Is_Complex_Checkbox"
              checked={isComplex}
              size="small"
              onChange={isComplexFlagHandler}
            />
            <p className={clsx(styles.checkBoxText, styles.checkBoxTextMargin)}>
              {t("isComplex")}
            </p>
            <Checkbox
              disabled={!isComplex || isProcessReadOnly}
              id="DE_Is_Nested_Checkbox"
              checked={isNested}
              size="small"
              onChange={isNestedHandler}
            />
            <p className={clsx(styles.checkBoxText, styles.checkBoxTextMargin)}>
              {t("isNested")}
            </p>
            <Checkbox
              disabled={operationType === "1" || isProcessReadOnly}
              id="DE_Update_If_Exist_Checkbox"
              checked={updateIfExistFlag}
              size="small"
              onChange={updatedIfExistHandler}
            />
            <p className={clsx(styles.checkBoxText, styles.checkBoxTextMargin)}>
              {t("updateIfExist")}
            </p>
          </div>
          {isComplex && (
            <div className={clsx(styles.flexColumn, styles.complexTableMargin)}>
              <p className={styles.fieldTitle}>{t("selectComplex")}</p>
              <CustomizedDropdown
                disabled={isProcessReadOnly}
                id="DE_Row_Count_Output_Dropdown"
                className={styles.dropdown}
                value={selectedComplexName}
                onChange={(event) => setSelectedComplexName(event.target.value)}
                isNotMandatory={true}
              >
                {complexVarList?.map((element) => {
                  return (
                    <MenuItem
                      className={styles.menuItemStyles}
                      value={element.VariableName}
                      key={element.VariableName}
                    >
                      {element.VariableName}
                    </MenuItem>
                  );
                })}
              </CustomizedDropdown>
            </div>
          )}
          <div className={styles.flexColumn}>
            <p className={styles.fieldTitle}>{t("selectTables")}</p>
            {!isNested ? (
              <CustomizedDropdown
                disabled={isProcessReadOnly}
                id="DE_Select_Tables_Dropdown"
                className={styles.dropdown}
                value={selectedTableName}
                onChange={(event) => {
                  setSelectedTableName(event.target.value);
                  setTableDetails((prevState) => {
                    let temp = [...prevState];
                    temp[selectedOp].selectedTableName = event.target.value;
                    return temp;
                  });
                }}
                isNotMandatory={true}
              >
                {existingTableData?.map((element) => {
                  return (
                    <MenuItem
                      className={styles.menuItemStyles}
                      value={element.TableName}
                      key={element.TableName}
                    >
                      {element.TableName}
                    </MenuItem>
                  );
                })}
              </CustomizedDropdown>
            ) : (
              <MultiSelect
                disabled={isProcessReadOnly}
                completeList={existingTableData}
                labelKey="TableName"
                indexKey="id"
                associatedList={multiSelectedTableNames}
                handleAssociatedList={(val) => {
                  const maxOrderId = findMaxOrderId(
                    multiSelectedTableNames,
                    "id"
                  );
                  let tempArr = [...val];
                  if (tempArr.length > 0) {
                    tempArr[tempArr.length - 1].id = maxOrderId + 1;
                  }
                  setMultiSelectedTableNames(tempArr);
                  setTableDetails((prevState) => {
                    let temp = [...prevState];
                    temp[selectedOp].selectedTableNames = tempArr;
                    return temp;
                  });
                }}
                placeholder={"Select table(s)"}
                noDataLabel={"No tables found."}
                id="DE_Multi_Select_Tables"
                style={{ width: "52vw" }}
              />
            )}
          </div>
          <MappingValues
            isProcessReadOnly={isProcessReadOnly}
            operationType={operationType}
            isComplex={isComplex}
            filteredVariables={filteredVariables}
            selectedVariableName={selectedVariableName}
            setSelectedVariableName={setSelectedVariableName}
            mappingDataExchgTable={mappingDataExchgTable}
            setMappingDataExchgTable={setMappingDataExchgTable}
            selectedMappingColumn={selectedMappingColumn}
            setSelectedMappingColumn={setSelectedMappingColumn}
            dataExchgTableList={dataExchgTableList}
            filteredMappingColumnList={filteredMappingColumnList}
            mappingData={mappingData}
            addMappingHandler={addMappingHandler}
            deleteMappingHandler={deleteMappingHandler}
            cancelMappingHandler={cancelMappingHandler}
            isNested={isNested}
            mappingColumnList={mappingColumnList}
            filteredExptVarList={filteredExptVarList}
            varListForComplex={varListForComplex}
            multiSelectedTableNames={multiSelectedTableNames}
          />
          <TableRelation
            isProcessReadOnly={isProcessReadOnly}
            operationType={operationType}
            processTableList={processTableList}
            selectedProcessTable={selectedProcessTable}
            setSelectedProcessTable={setSelectedProcessTable}
            column1Value={column1Value}
            setColumn1Value={setColumn1Value}
            processTableColumnList={processTableColumnList}
            dataExchgTableList={dataExchgTableList}
            selectedTRDataExchngTable={selectedTRDataExchngTable}
            setSelectedTRDataExchngTable={setSelectedTRDataExchngTable}
            filteredTRColumnList={filteredTRColumnList}
            column2Value={column2Value}
            setColumn2Value={setColumn2Value}
            tableRelationData={tableRelationData}
            addTableRelationHandler={addTableRelationHandler}
            cancelTableRelationHandler={cancelTableRelationHandler}
            deleteTableRelationHandler={deleteTableRelationHandler}
            isNested={isNested}
            multiSelectedTableNames={multiSelectedTableNames}
            mappingColumnList={mappingColumnList}
            filteredProcessTableExptList={filteredProcessTableExptList}
          />
          <FilterString
            isProcessReadOnly={isProcessReadOnly}
            isNested={isNested}
            operationType={operationType}
            filterStrDataExchgTable={filterStrDataExchgTable}
            setFilterStrDataExchgTable={setFilterStrDataExchgTable}
            filterStringData={filterStringData}
            addFilterStringHandler={addFilterStringHandler}
            cancelFilterStringHandler={cancelFilterStringHandler}
            deleteFilterStringHandler={deleteFilterStringHandler}
            filterStringValue={filterStringValue}
            filterStringHandler={filterStringHandler}
            listOfComplexTables={listOfComplexTables}
            setFilterStringValue={setFilterStringValue}
            multiSelectedTableNames={multiSelectedTableNames}
          />
          {isNested && operationType === "1" && (
            <DataExchangeTableSection
              isProcessReadOnly={isProcessReadOnly}
              dataExchgTableSectnData={dataExchgTableSectnData}
              deleteDataExchgTableSecHandler={deleteDataExchgTableSecHandler}
              parentDataExchgTable={parentDataExchgTable}
              setParentDataExchgTable={setParentDataExchgTable}
              parentTableColumn={parentTableColumn}
              setParentTableColumn={setParentTableColumn}
              childDataExchgTable={childDataExchgTable}
              setChildDataExchgTable={setChildDataExchgTable}
              childTableColumn={childTableColumn}
              setChildTableColumn={setChildTableColumn}
              parentTableColumnList={parentTableColumnList}
              filteredChildColumnList={filteredChildColumnList}
              multiSelectedTableNames={multiSelectedTableNames}
              addDataExchgTableSecHandler={addDataExchgTableSecHandler}
              cancelHandler={cancelDataExchgTableSecHandler}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
