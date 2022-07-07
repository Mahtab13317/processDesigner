import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { connect, useDispatch, useSelector } from "react-redux";
import { store, useGlobalState } from "state-pool";
import { Checkbox, InputBase, MenuItem } from "@material-ui/core";
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";
import clsx from "clsx";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  SERVER_URL,
  ENDPOINT_GET_EXISTING_TABLES,
  propertiesLabel,
  ENDPOINT_TEST_CONNECTION,
  PROCESSTYPE_LOCAL,
  ENDPOINT_GET_CURRENT_CABINETNAME,
} from "../../../../Constants/appConstants";
import PropertyDetails from "./PropertyDetails";
import {
  getExportRuleJSON,
  getImportRuleJSON,
  getMultiSelectedTableNames,
  getSelectedTableName,
} from "./CommonFunctions";
import OperationStrip from "./OperationStrip";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";

function DataExchange(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const { openProcessType, openProcessID } = props;
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked
  const globalActivityData = store.getState("activityPropertyData");
  const [localActivityPropertyData, setLocalActivityPropertyData] =
    useGlobalState(globalActivityData); // State that stores the activity property data for the current open properties saved in the global state.
  const [loggedInCabinet, setLoggedInCabinet] = useState(true);
  const [currentCabinetName, setCurrentCabinetName] = useState(""); // State that stores the current cabinet name in which the user is logged in.
  const [cabinetName, setCabinetName] = useState(""); // State that stores the cabinet name which the user fills in the input field.
  const [operationType, setOperationType] = useState("1"); // State that stores the operation type of the data exchange rule.
  const [isCabinetConnected, setIsCabinetConnected] = useState(false); // State that stores the boolean for cabinet connection.
  const [opList, setOpList] = useState([]); // State that stores the data exchange operations data.
  const [variables, setVariables] = useState([]); // List of all variables.
  const [selectedOp, setSelectedOp] = useState(0); // Selected rule value.
  const [existingTableData, setExistingTableData] = useState([]); // List of all existing tables.
  const [filteredVariables, setFilteredVariables] = useState([]); // List of all filtered "U" and "I" scope variables.
  const [tableDetails, setTableDetails] = useState([]); // State that stores all the selected table name for both complex isNested and not isNested and not complex cases.
  const [activityOpType, setActivityOpType] = useState(""); // State that stores the selected data exchange existing activity operation type.
  const [isProcessReadOnly, setIsProcessReadOnly] = useState(false); // State to store boolean for check if the process is readonly or not.

  const operationTypes = [
    { operationType: "2", operationLabel: t("export") },
    { operationType: "1", operationLabel: t("import") },
  ];

  // Function to set global data when the user does any action.
  const setGlobalData = (actData) => {
    let temp = JSON.parse(JSON.stringify(localActivityPropertyData));
    temp.ActivityProperty.objDataExchange.dbRules = actData;
    setLocalActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.Export]: { isModified: true, hasError: false },
      })
    );
  };

  // Function that runs when a rule is selected.
  const handleSelectedOp = (index) => {
    setSelectedOp(index);
  };

  // Function that runs when the openProcessType prop changes.
  useEffect(() => {
    if (openProcessType !== PROCESSTYPE_LOCAL) {
      setIsProcessReadOnly(true);
    }
  }, [openProcessType]);

  // Function that gets called when the activity property data changes.
  useEffect(() => {
    if (localActivityPropertyData) {
      setOpList(
        localActivityPropertyData?.ActivityProperty?.objDataExchange?.dbRules
      );
      if (
        localActivityPropertyData?.ActivityProperty?.objDataExchange
          ?.m_strSelectedOption !== ""
      ) {
        setOperationType(
          localActivityPropertyData?.ActivityProperty?.objDataExchange
            ?.m_strSelectedOption
        );
        setActivityOpType(
          localActivityPropertyData?.ActivityProperty?.objDataExchange
            ?.m_strSelectedOption
        );
      } else {
        setActivityOpType(operationType);
      }
      let temp = [...tableDetails];
      localActivityPropertyData?.ActivityProperty?.objDataExchange?.dbRules?.forEach(
        () => {
          const obj = { selectedTableName: "", selectedTableNames: [] };
          temp.push(obj);
        }
      );
      setTableDetails(temp);
    }
  }, [localActivityPropertyData.ActivityProperty]);

  // Function that runs when the saveCancelStatus.SaveClicked, saveCancelStatus.CancelClicked values change and checks validation.
  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      if (
        checkAllRuleData().isMappingDataFilled &&
        checkAllRuleData().isTableRelationDataFilled
      ) {
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.dataExchange]: {
              isModified: true,
              hasError: false,
            },
          })
        );
      } else {
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.dataExchange]: {
              isModified: true,
              hasError: false,
            },
          })
        );
        const ruleIndex = checkAllRuleData().ruleIndex + 1;
        const isMappingFilled = checkAllRuleData().isMappingDataFilled;
        const isTableRelationFilled =
          checkAllRuleData().isTableRelationDataFilled;
        if (isMappingFilled && isTableRelationFilled) {
          dispatch(
            setToastDataFunc({
              message: `Please define Mapping & Relation Mapping for rule no.${ruleIndex}`,
              severity: "error",
              open: true,
            })
          );
        } else if (isMappingFilled) {
          dispatch(
            setToastDataFunc({
              message: `Please define Mapping for rule no.${ruleIndex}`,
              severity: "error",
              open: true,
            })
          );
        } else if (isTableRelationFilled) {
          dispatch(
            setToastDataFunc({
              message: `Please define Relation Mapping for rule no.${ruleIndex}`,
              severity: "error",
              open: true,
            })
          );
        }
      }
      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked, saveCancelStatus.CancelClicked]);

  // Function that checks if all the mandatory data is present in all rules or not.
  const checkAllRuleData = () => {
    let ruleIndex = 0;
    let isMappingDataFilled = true;
    let isTableRelationDataFilled = true;

    opList?.forEach((element, index) => {
      if (operationType === "1") {
        if (element.m_arrMappingValuesInfo?.length === 0) {
          ruleIndex = index;
          isMappingDataFilled = false;
          return;
        }
        if (element.m_arrTableRelationValuesInfo?.length === 0) {
          ruleIndex = index;
          isTableRelationDataFilled = false;
          return;
        }
      }
    });
    return {
      isMappingDataFilled: isMappingDataFilled,
      isTableRelationDataFilled: isTableRelationDataFilled,
      ruleIndex: ruleIndex,
    };
  };

  // Function that runs when the Variables in state pool changes.
  useEffect(() => {
    setVariables(loadedProcessData?.value?.Variable);
    const filteredVars = loadedProcessData?.value?.Variable.filter(
      (element) =>
        element.VariableScope === "U" || element.VariableScope === "I"
    );
    setFilteredVariables(filteredVars);
  }, [loadedProcessData.value.Variable]);

  // Function to test the connection of a cabinet.
  const testConnectionAPICall = () => {
    axios
      .get(SERVER_URL + ENDPOINT_TEST_CONNECTION + `/${cabinetName}`)
      .then((res) => {
        if (res.data.Status === 0) {
          setIsCabinetConnected(true);
          dispatch(
            setToastDataFunc({
              message: t("connectionSuccessful"),
              severity: "success",
              open: true,
            })
          );
        } else {
          setIsCabinetConnected(false);
          dispatch(
            setToastDataFunc({
              message: t("connectionFailed"),
              severity: "error",
              open: true,
            })
          );
        }
      });
  };

  // Function that runs when the component loads.
  useEffect(() => {
    // getExistingTableData();
    getCurrentCabinetName();
  }, []);

  // Function to fetch existing table data by making an API call.
  const getExistingTableData = () => {
    if (cabinetName.trim() !== "") {
      if (loggedInCabinet) {
        existingTableAPICall(`/${openProcessID}` + `/${openProcessType}`);
      } else if (isCabinetConnected) {
        existingTableAPICall(
          `/${openProcessID}` +
            `/${openProcessType}` +
            `?cabinetName=${cabinetName}`
        );
      } else {
        dispatch(
          setToastDataFunc({
            message: "Kindly test the connection",
            severity: "error",
            open: true,
          })
        );
      }
    } else {
      dispatch(
        setToastDataFunc({
          message: "Kindly enter a cabinet name",
          severity: "error",
          open: true,
        })
      );
    }
  };

  // Function that has the api call for getting existing tables.
  const existingTableAPICall = (existingTableURL) => {
    axios
      .get(SERVER_URL + ENDPOINT_GET_EXISTING_TABLES + existingTableURL)
      .then((res) => {
        if (res.status === 200) {
          let modifiedArray = [];
          res?.data?.Table?.forEach((element, index) => {
            let tempObj = {
              id: index + 1,
              TableName: element.TableName,
              TableType: element.TableType,
            };
            modifiedArray.push(tempObj);
          });
          setExistingTableData(modifiedArray);
        }
      })
      .catch((err) => console.log(err));
  };

  // Function to fetch current cabinet name using which the user has logged in.
  const getCurrentCabinetName = () => {
    axios
      .get(SERVER_URL + ENDPOINT_GET_CURRENT_CABINETNAME)
      .then((res) => {
        if (res.status === 200) {
          setCurrentCabinetName(res.data);
          setCabinetName(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  // Function that filters the variables based on the operation type.
  const getFilteredVariableList = () => {
    if (operationType === "1") {
      return variables?.filter(
        (element) =>
          (element.VariableScope === "U" || element.VariableScope === "I") &&
          (element.VariableType === "3" || element.VariableType === "4")
      );
    } else {
      return variables?.filter(
        (element) =>
          (element.VariableScope === "U" || element.VariableScope === "I") &&
          element.VariableType === "3"
      );
    }
  };

  // Function to get the operation label of a rule based on the operation type.
  const getOperationLabel = (operationType) => {
    let operationLabel;
    if (operationType === "1") {
      operationLabel = t("import");
    } else {
      operationLabel = t("export");
    }
    return operationLabel;
  };

  // Function that gets the empty rule JSON for import and export rules.
  const getRuleJSON = () => {
    if (operationType === "1") {
      return getImportRuleJSON();
    } else {
      return getExportRuleJSON();
    }
  };

  // Function that gets called when the add new button is clicked.
  const localOpHandler = () => {
    if (checkIfAddNewOpIsValid(operationType)) {
      let obj = getRuleJSON();
      let temp = [];
      if (opList?.length > 0) {
        temp = [...opList];
      }
      temp.push(obj);
      setOpList(temp);
      setGlobalData(temp);
      setActivityOpType(operationType);
      const tableObj = { selectedTableName: "", selectedTableNames: [] };
      let tempArr = [...tableDetails];
      tempArr.push(tableObj);
      setTableDetails(tempArr);
      setSelectedOp(temp.length - 1);
      scrollToBottom("operationDiv");
    } else {
      dispatch(
        setToastDataFunc({
          message: `${t("only")} ${
            operationType === "1" ? `${t("export")}` : `${t("import")}`
          } ${t("operationsCanBeAdded")}.`,
          severity: "error",
          open: true,
        })
      );
    }
  };

  // Function that checks if the new added operation is valid or not.
  const checkIfAddNewOpIsValid = (opType) => {
    let isValid = true;
    if (activityOpType !== "" && activityOpType !== opType) {
      isValid = false;
    }
    return isValid;
  };

  // Function to scroll to bottom of the div.
  const scrollToBottom = (id) => {
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
  };

  // Function that gets called when the user deletes an existing import/export rule.
  const deleteOpHandler = (index, event) => {
    event.stopPropagation();
    let temp = [...opList];
    temp.splice(index, 1);
    setOpList(temp);
    setGlobalData(temp);
    let tempArr = [...tableDetails];
    tempArr.splice(index, 1);
    setTableDetails(tempArr);
    setSelectedOp(() => {
      if (index > 0) {
        return index - 1;
      } else {
        return 0;
      }
    });
  };

  // Function that runs when opList changes.
  useEffect(() => {
    if (opList && opList.length > 0) {
      let opType = "";
      if (opList[0].hasOwnProperty("m_arrMappingValuesInfo")) {
        opType = "1";
      } else {
        opType = "2";
      }
      opList.forEach((element, index) => {
        if (
          opType === "1" ? element?.m_bIsNested : element?.m_bIsNestedExport
        ) {
          if (opType === "1") {
            const multiSelectedTableNamesArr = getMultiSelectedTableNames(
              element?.m_arrMappingValuesInfo,
              element?.m_arrTableRelationValuesInfo,
              element?.hasOwnProperty("m_arrDataExValuesInfo") &&
                element?.m_arrDataExValuesInfo,
              element?.hasOwnProperty("m_arrFilterStringTableImpInfo") &&
                element?.m_arrFilterStringTableImpInfo
            );
            setTableDetails((prevState) => {
              let tempArr = [...prevState];
              tempArr[index].selectedTableNames = multiSelectedTableNamesArr;
              return tempArr;
            });
          } else {
            const multiSelectedTableNamesArr = getMultiSelectedTableNames(
              element?.m_arrExportMappingValuesInfo,
              element?.m_arrExTableRelationValuesInfo,
              [],
              element?.hasOwnProperty("m_arrFilterStringTableExpInfo") &&
                element?.m_arrFilterStringTableExpInfo
            );
            setTableDetails((prevState) => {
              let tempArr = [...prevState];
              tempArr[index].selectedTableNames = multiSelectedTableNamesArr;
              return tempArr;
            });
          }
        } else {
          if (opType === "1") {
            const selectedImportTableName = getSelectedTableName(
              element?.m_arrMappingValuesInfo
            );
            setTableDetails((prevState) => {
              let temp = [...prevState];
              temp[selectedOp].selectedTableName = selectedImportTableName;
              return temp;
            });
          } else {
            const selectedExportTableName = getSelectedTableName(
              element?.m_arrExportMappingValuesInfo
            );
            if (tableDetails[selectedOp]?.selectedTableName) {
              setTableDetails((prevState) => {
                let temp = [...prevState];
                temp[selectedOp].selectedTableName = selectedExportTableName;
                return temp;
              });
            }
          }
        }
      });
    }
  }, [opList]);

  return (
    <div className={styles.flexRow} style={{ background: "#F8F8F8" }}>
      <div
        className={clsx(
          styles.flexColumn,
          styles.cabinetDetailsDiv,
          styles.cabinetDetailsWidth
        )}
      >
        <p className={styles.heading}>{t("cabinetDetails")}</p>
        <div className={styles.flexRow}>
          <Checkbox
            disabled={isProcessReadOnly}
            id="DE_Logged_in_Cabinet_Checkbox"
            checked={loggedInCabinet}
            size="small"
            onChange={() => {
              setExistingTableData([]);
              setLoggedInCabinet((prevState) => {
                if (!prevState) {
                  setCabinetName(currentCabinetName);
                } else {
                  setCabinetName("");
                }
                return !prevState;
              });
            }}
          />
          <p className={styles.loggedInCabinetText}>{t("loggedInCabinet")}</p>
        </div>
        <div className={clsx(styles.flexColumn, styles.cabinetNameDiv)}>
          <p className={styles.fieldTitle}>{t("cabinetName")}</p>
          <InputBase
            id="DE_Cabinet_Name_Field"
            variant="outlined"
            className={clsx(
              styles.cabinetNameInput,
              loggedInCabinet && styles.cabinetNameDisabled
            )}
            onChange={(event) => {
              setCabinetName(event.target.value);
              setIsCabinetConnected(false);
            }}
            value={cabinetName}
            disabled={loggedInCabinet || isProcessReadOnly}
          />
        </div>
        {!isProcessReadOnly && (
          <button
            disabled={loggedInCabinet || cabinetName.trim() === ""}
            className={clsx(
              styles.blueButton,
              styles.testConnectionBtn,
              loggedInCabinet && styles.disabledTestConnectionBtn
            )}
            onClick={testConnectionAPICall}
          >
            {t("testConnection")}
          </button>
        )}
        {isCabinetConnected && loggedInCabinet && (
          <p className={styles.connectionStatusText}>{t("connected")}</p>
        )}

        <div className={clsx(styles.flexColumn, styles.cabinetNameDiv)}>
          <p className={styles.fieldTitle}>{t("selectOperation")}</p>
          <CustomizedDropdown
            disabled={isProcessReadOnly}
            id="DE_Operation_Type_Dropdown"
            className={styles.dropdown}
            value={operationType}
            onChange={(event) => {
              setOperationType(event.target.value);
              if (opList?.length === 0) {
                setActivityOpType(event.target.value);
              }
            }}
            isNotMandatory={true}
          >
            {operationTypes?.map((element) => {
              return (
                <MenuItem
                  className={styles.menuItemStyles}
                  value={element.operationType}
                >
                  {element.operationLabel}
                </MenuItem>
              );
            })}
          </CustomizedDropdown>
        </div>
      </div>
      <div
        className={clsx(
          styles.flexColumn,
          styles.cabinetDetailsDiv,
          styles.operationsWidth
        )}
      >
        <div className={clsx(styles.flexRow, styles.operationSubDiv)}>
          <p className={styles.heading}>{t("listOfOperations")}</p>
          {!isProcessReadOnly && (
            <button
              onClick={localOpHandler}
              className={clsx(styles.blueButton, styles.addNewOperationBtn)}
            >
              {t("addNew")}
            </button>
          )}
        </div>
        <div
          id="operationDiv"
          className={clsx(styles.flexColumn, styles.opScroll)}
        >
          {opList?.map((element, index) => {
            return (
              <OperationStrip
                index={index}
                isNested={
                  activityOpType === "1"
                    ? element.m_bIsNested
                    : element.m_bIsNestedExport
                }
                handleSelectedOp={handleSelectedOp}
                selectedOp={selectedOp}
                getOperationLabel={getOperationLabel}
                opType={activityOpType}
                deleteOpHandler={deleteOpHandler}
                tableDetails={tableDetails}
                isProcessReadOnly={isProcessReadOnly}
              />
            );
          })}
        </div>
      </div>
      {opList?.length > 0 ? (
        <PropertyDetails
          operationType={activityOpType}
          openProcessType={openProcessType}
          openProcessID={openProcessID}
          isProcessReadOnly={isProcessReadOnly}
          getFilteredVariableList={getFilteredVariableList}
          existingTableData={existingTableData}
          filteredVariables={filteredVariables}
          selectedOp={selectedOp}
          opList={opList}
          setOpList={setOpList}
          setGlobalData={setGlobalData}
          tableDetails={tableDetails}
          setTableDetails={setTableDetails}
          getExistingTableData={getExistingTableData}
        />
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessType: state.openProcessClick.selectedType,
    openProcessID: state.openProcessClick.selectedId,
  };
};

export default connect(mapStateToProps, null)(DataExchange);
