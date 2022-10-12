import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import { MenuItem } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { store, useGlobalState } from "state-pool";
import {
  DATE_VARIABLE_TYPE,
  INTEGER_VARIABLE_TYPE,
  ADD_OPERATION_SECONDARY_DBFLAG,
  STRING_VARIABLE_TYPE,
  SET_OPERATION_TYPE,
  Y_FLAG,
  RTL_DIRECTION,
  AUTO_INITIATE_OPERATION_TYPE,
  MANDATORY_OPERATION_TYPE,
  OPTIONAL_OPERATION_TYPE,
  SET_READY_OPERATION_TYPE,
} from "../../../../../../../Constants/appConstants";
import {
  getOperatorOptions,
  getEmptyTaskRuleOperationObj,
  isValueDateType,
} from "../../../../ActivityRules/CommonFunctions";
import CustomizedDropdown from "../../../../../../../UI/Components_With_ErrrorHandling/Dropdown";
import { isEqual, omit } from "lodash";
import { setToastDataFunc } from "../../../../../../../redux-store/slices/ToastDataHandlerSlice";
import { useDispatch } from "react-redux";
import {
  operationTypeOptions,
  calendarTypeOptions,
  secondaryDBFlagOptions,
  getTypedropdown,
} from "../../../../ActivityRules/CommonFunctionCall";

function AddOperations(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const {
    index,
    localRuleData,
    setLocalRuleData,
    selectedRule,
    deleteOperation,
    isRuleBeingCreated,
    setIsRuleBeingModified,
    isReadOnly,
    operationsAllowed,
    checkValidation,
    setCheckValidation,
    setDoesSelectedRuleHaveErrors,
    showDelIcon,
  } = props;

  const dispatch = useDispatch();
  const loadedProcessDataObj = store.getState("loadedProcessData"); //current processdata clicked
  const [loadedProcessData] = useGlobalState("loadedProcessData");
  const variableData = loadedProcessDataObj?.value?.Variable;
  const constantsData = loadedProcessData.DynamicConstant;
  const [operationType, setOperationType] = useState(SET_OPERATION_TYPE);
  const [field, setField] = useState(""); // State to store the value of field dropdown.
  const [value1, setValue1] = useState(""); // State to store the value of value 1 dropdown.
  const [operator, setOperator] = useState(""); // State to store the value of operator dropdown.
  const [value2, setValue2] = useState(""); // State to store the value of value 2 dropdown.
  const [calendarType, setCalendarType] = useState(Y_FLAG); // State to store the value of calendar type dropdown.
  const [isDBFlagSelected, setIsDBFlagSelected] = useState(false); // State to store whether secondary db flag is selected or not.
  const [value1DropdownOptions, setValue1DropdownOptions] = useState([]); // State to store the options for value 1 dropdown.
  const [value2DropdownOptions, setValue2DropdownOptions] = useState([]); // State to store the options for value 2 dropdown.
  const [operatorList, setOperatorList] = useState([]); // State to store the list of operators according to the field selected.
  const [dropdownOptions, setDropdownOptions] = useState([]); // State to store all the data variables for dropdown options.
  const [assignedToValue, setAssignedToValue] = useState(""); // State to store the value of Assigned to variable dropdown.
  const [isDateTypeFieldSelected, setIsDateTypeFieldSelected] = useState(true); // State to check if the value of field dropdown is date type or not in SET operation.
  const [showSetOperations, setShowSetOperations] = useState(false); // Boolean to show SET operation fields.
  const [showAssignedTo, setShowAssignedTo] = useState(false); // Boolean to show Assigned to operation fields.
  const [isField1Const, setIsField1Const] = useState(false);
  const [isField2Const, setIsField2Const] = useState(false);
  const [isAutoInitiateConst, setIsAutoInitiateConst] = useState(false);

  const setOperationTypes = [SET_OPERATION_TYPE];
  const assignedToAndCallTypes = [AUTO_INITIATE_OPERATION_TYPE];
  const noFieldOperations = [
    MANDATORY_OPERATION_TYPE,
    OPTIONAL_OPERATION_TYPE,
    SET_READY_OPERATION_TYPE,
  ];

  const multipleOpValidation = [AUTO_INITIATE_OPERATION_TYPE];
  const assignToFields = {
    CaseManager: "M",
    PreferredUser: "P",
  };

  useEffect(() => {
    setIsField1Const(false);
    setIsField2Const(false);
    setIsAutoInitiateConst(false);
  }, [isRuleBeingCreated]);

  // Function that gets called when variableData prop changes.
  useEffect(() => {
    if (variableData) {
      let variableWithConstants = [];
      constantsData?.forEach((element) => {
        let tempObj = {
          VariableName: element.ConstantName,
          VariableScope: "C",
        };
        variableWithConstants.push(tempObj);
      });
      variableData
        ?.filter(
          (element) =>
            element.VariableScope !== "S" && element.VariableType !== "11"
        )
        .forEach((element) => {
          variableWithConstants.push(element);
        });
      setDropdownOptions(variableWithConstants);
      setCalendarType(Y_FLAG);
    }
  }, [variableData]);

  // Function to empty all data fields.
  const emptyAllDataFields = () => {
    setField("");
    setValue1("");
    setOperator("");
    setValue2("");
    setValue1DropdownOptions([]);
    setValue2DropdownOptions([]);
    setOperatorList([]);
    setAssignedToValue("");
  };

  // Function that gets the listing of variables in a particular order.
  const getFieldListing = (value) => {
    /* VariableIds of variables used are as follows :
      CalendarName : 10001,
      SecondaryDBFlag : 42,
      Status : 10022
    */
    let fieldArray = [];
    dropdownOptions?.forEach((element) => {
      if (element.VariableId === "10001" || element.VariableId === "10022") {
        fieldArray.push(element);
      }
      if (
        element.VariableId !== "10001" &&
        element.VariableId !== "10022" &&
        element.VariableType !== "11"
      ) {
        fieldArray.push(element);
      }
    });

    fieldArray = fieldArray?.filter(
      (element) =>
        element.VariableScope === "U" ||
        (element.VariableScope === "I" && element.VariableType !== "11") ||
        (element.VariableScope === "M" &&
          (element.VariableId === "10001" || element.VariableId === "10022"))
    );

    return fieldArray;
  };

  // Function to show field according to operation type.
  const setFieldValues = (element) => {
    const opType = element.opType;
    switch (opType) {
      case AUTO_INITIATE_OPERATION_TYPE:
        setAssignedToValue(element.param1);
        break;
      default:
        break;
    }
  };

  // Function that runs when the ruleOpList on the localRuleData changes.
  useEffect(() => {
    setOperationType(localRuleData.ruleOpList[index].opType);
    checkOperationType(localRuleData.ruleOpList[index].opType);
    setField(localRuleData.ruleOpList[index].param1);
    setOperator(localRuleData.ruleOpList[index].operator);

    if (
      localRuleData.ruleOpList[index].opType === AUTO_INITIATE_OPERATION_TYPE &&
      localRuleData.ruleOpList[index].type1 === "C"
    ) {
      setIsAutoInitiateConst(true);
    }

    if (isValueDateType(localRuleData.ruleOpList[index].param2).isValDateType) {
      if (localRuleData.ruleOpList[index].type2 === "C") {
        setValue1(
          isValueDateType(localRuleData.ruleOpList[index].param2).convertedDate
        );
      }
    } else {
      setValue1(localRuleData.ruleOpList[index].param2);
    }

    if (isValueDateType(localRuleData.ruleOpList[index].param3).isValDateType) {
      if (localRuleData.ruleOpList[index].type3 === "C") {
        setValue2(
          isValueDateType(localRuleData.ruleOpList[index].param3).convertedDate
        );
      }
    } else {
      setValue2(localRuleData.ruleOpList[index].param3);
    }
    if (isConstIncluded(localRuleData.ruleOpList[index].param2)) {
      setIsField1Const(true);
    } else {
      setIsField1Const(false);
      if (localRuleData.ruleOpList[index].type2 === "C") {
        setIsField1Const(true);
      }
    }
    if (isConstIncluded(localRuleData.ruleOpList[index].param3)) {
      setIsField2Const(true);
    } else {
      setIsField2Const(false);
      if (localRuleData.ruleOpList[index].type3 === "C") {
        setIsField2Const(true);
      }
    }
    let parsedDate1 = Date.parse(localRuleData.ruleOpList[index].param2);
    let parsedDate2 = Date.parse(localRuleData.ruleOpList[index].param3);

    if (isNaN(localRuleData.ruleOpList[index].param2) && !isNaN(parsedDate1)) {
      setIsField1Const(true);
    } else {
      if (localRuleData.ruleOpList[index].type2 !== "C") {
        setIsField1Const(false);
      }
    }

    if (isNaN(localRuleData.ruleOpList[index].param3) && !isNaN(parsedDate2)) {
      setIsField2Const(true);
    } else {
      if (localRuleData.ruleOpList[index].type3 !== "C") {
        setIsField2Const(false);
      }
    }

    setCalendarType(localRuleData.ruleOpList[index].ruleCalFlag);
    setFieldValues(localRuleData.ruleOpList[index]);
    if (
      +findVariableType(localRuleData.ruleOpList[index].param1) ===
      DATE_VARIABLE_TYPE
    ) {
      setIsDateTypeFieldSelected(false);
    } else {
      setIsDateTypeFieldSelected(true);
    }

    if (
      localRuleData.ruleOpList[index].param1 === ADD_OPERATION_SECONDARY_DBFLAG
    ) {
      setIsDBFlagSelected(true);
      setValue1DropdownOptions([...secondaryDBFlagOptions]);
    } else {
      setIsDBFlagSelected(false);
      getDropdownOptions(localRuleData.ruleOpList[index].param1);
    }
  }, [localRuleData?.ruleOpList]);

  // Function that runs when the component mounts.
  useEffect(() => {
    if (
      !localRuleData.ruleOpList[index].param1 === ADD_OPERATION_SECONDARY_DBFLAG
    ) {
      getDropdownOptions(localRuleData.ruleOpList[index].param1);
      const variableType = findVariableType(
        localRuleData.ruleOpList[index].param2
      );
      getFieldValues(variableType);
    }
  }, [dropdownOptions, localRuleData.ruleOpList]);

  // Function that gets the dropdown options and list of operator based on the field selected.
  const getDropdownOptions = (value) => {
    const variableType = findVariableType(value);
    const operatorList = getOperatorOptions(variableType);
    setOperatorList([...operatorList]);
    if (+variableType === STRING_VARIABLE_TYPE) {
      const filteredParam1Options = dropdownOptions;
      setValue1DropdownOptions(filteredParam1Options);
    } else {
      const filteredParam1Options =
        dropdownOptions &&
        dropdownOptions.filter((element) => {
          if (
            element.VariableType === variableType ||
            element.VariableScope === "C"
          ) {
            return element;
          }
        });

      setValue1DropdownOptions(filteredParam1Options);
    }
    getFieldValues(variableType);
  };

  // Function that runs when the selected rule changes.
  useEffect(() => {
    if (
      !localRuleData.ruleOpList[index].param1 === ADD_OPERATION_SECONDARY_DBFLAG
    ) {
      const emptyArr = [];
      setValue1DropdownOptions([...emptyArr]);
      getDropdownOptions(localRuleData.ruleOpList[index].param1);
    }
  }, [selectedRule]);

  // Function that runs when the operation type changes.
  useEffect(() => {
    if (setOperationTypes.includes(operationType)) {
      setShowSetOperations(true);
    } else {
      setShowSetOperations(false);
    }
  }, [operationType]);

  // Function that checks the operation type and set the fields accordingly.
  const checkOperationType = (value) => {
    if (setOperationTypes.includes(value)) {
      setShowSetOperations(true);
      setShowAssignedTo(false);
    } else if (assignedToAndCallTypes.includes(value)) {
      setShowAssignedTo(true);
      setShowSetOperations(false);
    } else {
      setShowAssignedTo(false);
      setShowSetOperations(false);
    }
  };

  // Function that runs when the user changes the type of the operation.
  const onSelectType = (event) => {
    const { value } = event.target;
    emptyAllDataFields();
    if (isRuleBeingCreated === false) {
      setIsRuleBeingModified(true);
    }

    let temp = { ...localRuleData };
    temp.ruleOpList[index] = getEmptyTaskRuleOperationObj(
      temp.ruleOpList[index].opOrderId,
      temp.ruleOpList[index].opType
    );
    setLocalRuleData(temp);

    if (multipleOpValidation.includes(value)) {
      if (!multipleOperationValidation(value)) {
        checkOperationType(value);
        setOperationType(value);
        setLocalRuleData((prevData) => {
          let temp = { ...prevData };
          temp.ruleOpList[index].opType = value;
          return temp;
        });
      } else {
        setOperationType(SET_OPERATION_TYPE);
        dispatch(
          setToastDataFunc({
            message: `${getTypedropdown(
              value
            )} operation has already been defined.`,
            severity: "error",
            open: true,
          })
        );
      }
    } else {
      checkOperationType(value);
      setOperationType(value);
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].opType = value;
        return temp;
      });
    }
  };

  // Function that validates if multiple operations are defined or not.
  const multipleOperationValidation = (value) => {
    let temp = false;
    localRuleData?.ruleOpList.forEach((element) => {
      if (element.opType === value) {
        temp = true;
      }
    });
    return temp;
  };

  // Function that validates if the same operation has already been defined or not.
  const checkDuplicateValues = (event, key) => {
    let temp = false;
    const operationType =
      localRuleData && localRuleData.ruleOpList[index].opType;
    let obj = JSON.parse(JSON.stringify(localRuleData.ruleOpList[index]));
    obj[key] = event.target.value;
    obj = omit(obj, "opOrderId");

    localRuleData?.ruleOpList.forEach((element) => {
      if (element.opType === operationType) {
        let tempObj = omit(element, "opOrderId");
        if (isEqual(tempObj, obj)) {
          temp = true;
          dispatch(
            setToastDataFunc({
              message: `${getTypedropdown(
                operationType
              )} operation has already been defined.`,
              severity: "error",
              open: true,
            })
          );
        }
      }
    });
    return temp;
  };

  // Function that runs when the user changes the field dropdown value for a SET operation.
  const handleFieldChange = (event) => {
    if (!checkDuplicateValues(event, "param1")) {
      const temp = [];
      setValue2DropdownOptions([...temp]);
      setValue1DropdownOptions([...temp]);
      setOperatorList([...temp]);
      setValue1("");
      setValue2("");
      setOperator("");
      setField(event.target.value);
      let variableScope, extObjId, varFieldId, variableId;
      getFieldListing()
        .filter(
          (element) =>
            element.VariableScope !== "S" &&
            element.VariableScope !== "C" &&
            element.VariableScope !== "U" &&
            element.VariableScope !== "I"
        )
        ?.map((value) => {
          if (value.VariableName === event.target.value) {
            extObjId = value.ExtObjectId;
            varFieldId = value.VarFieldId;
            variableId = value.VariableId;
            variableScope = value.VariableScope;
          }
        });
      let fieldVariableType = findVariableType(event.target.value);
      if (+fieldVariableType === DATE_VARIABLE_TYPE) {
        setIsDateTypeFieldSelected(false);
      } else {
        setIsDateTypeFieldSelected(true);
      }
      if (isRuleBeingCreated === false) {
        setIsRuleBeingModified(true);
      }
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].param1 = event.target.value;
        temp.ruleOpList[index].extObjID1 = extObjId;
        temp.ruleOpList[index].varFieldId_1 = varFieldId;
        temp.ruleOpList[index].variableId_1 = variableId;
        temp.ruleOpList[index].type1 = variableScope ? variableScope : "C";
        temp.ruleOpList[index].param2 = "";
        temp.ruleOpList[index].operator = "";
        temp.ruleOpList[index].param3 = "";
        return temp;
      });

      setIsDBFlagSelected(false);
      let variableType = findVariableType(event.target.value);
      const operatorList = getOperatorOptions(variableType);
      setOperatorList([...operatorList]);

      if (+variableType === STRING_VARIABLE_TYPE) {
        const filteredParam1Options = dropdownOptions;
        setValue1DropdownOptions(filteredParam1Options);
      } else {
        const filteredParam1Options =
          dropdownOptions &&
          dropdownOptions.filter((element) => {
            if (
              element.VariableType === variableType ||
              element.VariableScope === "C"
            ) {
              return element;
            }
          });

        setValue1DropdownOptions(filteredParam1Options);
      }

      if (+variableType === DATE_VARIABLE_TYPE) {
        const filteredParam2Options =
          dropdownOptions &&
          dropdownOptions.filter((element) => {
            if (
              +element.VariableType === INTEGER_VARIABLE_TYPE ||
              element.VariableScope === "C"
            ) {
              return element;
            }
          });
        setValue2DropdownOptions(filteredParam2Options);
      } else {
        const filteredParam1Options =
          dropdownOptions &&
          dropdownOptions.filter((element) => {
            if (
              element.VariableType === variableType ||
              element.VariableScope === "C"
            ) {
              return element;
            }
          });
        setValue2DropdownOptions(filteredParam1Options);
      }
    }
  };

  // Function that is used to find the variable type of a specific variable.
  const findVariableType = (value) => {
    let variableType = "";
    dropdownOptions?.forEach((element) => {
      if (element.VariableName === value) {
        variableType = element.VariableType;
      }
    });
    return variableType;
  };

  // Function that gets the dropdown options for value 2 dropdown based on the variable type given.
  const getFieldValues = (variableType) => {
    if (variableType !== "") {
      if (+variableType === DATE_VARIABLE_TYPE) {
        const filteredParam2Options =
          dropdownOptions &&
          dropdownOptions.filter((element) => {
            if (
              +element.VariableType === INTEGER_VARIABLE_TYPE ||
              element.VariableScope === "C"
            ) {
              return element;
            }
          });
        setValue2DropdownOptions(filteredParam2Options);
      } else if (+variableType === STRING_VARIABLE_TYPE) {
        setValue2DropdownOptions(dropdownOptions);
      } else {
        const filteredParam2Options =
          dropdownOptions &&
          dropdownOptions.filter((element) => {
            if (
              element.VariableType === variableType ||
              element.VariableScope === "C"
            ) {
              return element;
            }
          });
        setValue2DropdownOptions(filteredParam2Options);
      }
    }
  };

  const isValueSecondaryDBFlag = (value) => {
    let isValueDBFlag = false;
    if (value === ADD_OPERATION_SECONDARY_DBFLAG) {
      isValueDBFlag = true;
    }
    return isValueDBFlag;
  };

  // Function that runs when the user changes the first value dropdown for a SET operation.
  const handleValue1Change = (event) => {
    if (!checkDuplicateValues(event, "param2")) {
      let variableType = findVariableType(event.target.value);
      let variableScope, extObjId, varFieldId, variableId;
      setValue1(event.target.value);
      getFieldValues(variableType);
      if (isRuleBeingCreated === false) {
        setIsRuleBeingModified(true);
      }
      value1DropdownOptions?.map((value) => {
        if (value.VariableName === event.target.value) {
          extObjId = value.ExtObjectId;
          varFieldId = value.VarFieldId;
          variableId = value.VariableId;
          variableScope = value.VariableScope;
        }
        if (value.VariableScope === "C") {
          extObjId = "0";
          varFieldId = "0";
          variableId = "0";
        }
      });

      if (isField1Const) {
        variableScope = "C";
      }

      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].param2 = event.target.value;
        temp.ruleOpList[index].extObjID2 =
          extObjId === "" || extObjId === undefined ? "0" : extObjId;
        temp.ruleOpList[index].varFieldId_2 =
          varFieldId === "" || varFieldId === undefined ? "0" : varFieldId;
        temp.ruleOpList[index].variableId_2 =
          variableId === "" || variableId === undefined ? "0" : variableId;
        temp.ruleOpList[index].type2 = variableScope
          ? variableScope
          : isValueSecondaryDBFlag(localRuleData.ruleOpList[index].param1)
          ? ""
          : "C";
        return temp;
      });
    }
  };

  // Function that runs when the user changes the operator dropdown for a SET operation.
  const handleOperatorChange = (event) => {
    if (!checkDuplicateValues(event, "operator")) {
      setOperator(event.target.value);
      if (isRuleBeingCreated === false) {
        setIsRuleBeingModified(true);
      }
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].operator = event.target.value;
        return temp;
      });
    }
  };

  // Function that checks if value is a part of existing dropdown options or is it from a constant newly added.
  const isConstIncluded = (value) => {
    let isConstantIncluded = false;
    if (value !== "") {
      value2DropdownOptions?.forEach((element) => {
        if (element.VariableName === value && element.VariableScope === "C") {
          isConstantIncluded = true;
        }
      });
    }

    return isConstantIncluded;
  };

  // Function that runs when the user changes the second value dropdown for a SET operation.
  const handleValue2Change = (event) => {
    if (!checkDuplicateValues(event, "param3")) {
      let variableScope, extObjId, varFieldId, variableId;
      setValue2(event.target.value);
      if (isRuleBeingCreated === false) {
        setIsRuleBeingModified(true);
      }

      value2DropdownOptions?.map((value) => {
        if (value.VariableName === event.target.value) {
          extObjId = value.ExtObjectId;
          varFieldId = value.VarFieldId;
          variableId = value.VariableId;
          variableScope = value.VariableScope;
        }
        if (value.VariableScope === "C") {
          extObjId = "0";
          varFieldId = "0";
          variableId = "0";
        }
      });

      if (isField2Const) {
        variableScope = "C";
      }

      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].param3 = event.target.value;
        temp.ruleOpList[index].extObjID3 = extObjId;
        temp.ruleOpList[index].varFieldId_3 = varFieldId;
        temp.ruleOpList[index].variableId_3 = variableId;
        temp.ruleOpList[index].type3 = variableScope ? variableScope : "C";
        return temp;
      });
    }
  };

  // Function that runs when the user changes the calendar type dropdown for a SET operation.
  const handleCalendarType = (event) => {
    if (!checkDuplicateValues(event, "ruleCalFlag")) {
      setCalendarType(event.target.value);
      if (isRuleBeingCreated === false) {
        setIsRuleBeingModified(true);
      }
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].ruleCalFlag = event.target.value;
        return temp;
      });
    }
  };

  // Function that handles the assigned to variable changes.
  const handleAssignedToVariable = (event, isConstant) => {
    if (!checkDuplicateValues(event, "param1")) {
      setAssignedToValue(event.target.value);
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].param1 = event.target.value;
        temp.ruleOpList[index].type1 = isConstant
          ? "C"
          : assignToFields[event.target.value];
        return temp;
      });
    }
  };

  return (
    <div
      className={
        direction === RTL_DIRECTION ? arabicStyles.flexRow : styles.flexRow
      }
      style={{ alignItems: "end" }}
    >
      <div>
        <p className={styles.dropdownMargin}></p>
        <div
          className={
            direction === RTL_DIRECTION ? arabicStyles.flexRow : styles.flexRow
          }
        >
          <div className={styles.flexColumn}>
            <p className={styles.operationsLabel}>{t("type")}</p>
            <CustomizedDropdown
              id="AR_Operation_Type_Dropdown"
              disabled={isReadOnly}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.typeDropdown
                  : styles.typeDropdown
              }
              value={operationType}
              onChange={(event) => onSelectType(event)}
              validationBoolean={checkValidation}
              validationBooleanSetterFunc={setCheckValidation}
              showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
              maxHeight="10rem"
            >
              {operationTypeOptions
                .filter((item) => operationsAllowed.includes(item.value))
                .map((element) => {
                  return (
                    <MenuItem
                      className={styles.menuItemStyles}
                      key={element.value}
                      value={element.value}
                    >
                      {element.label}
                    </MenuItem>
                  );
                })}
            </CustomizedDropdown>
          </div>
          {noFieldOperations.includes(operationType) &&
            showDelIcon &&
            !isReadOnly && (
              <DeleteOutlinedIcon
                id="AR_Delete_Button"
                className={styles.noFieldDeleteIcon}
                onClick={() => deleteOperation(index)}
              />
            )}
        </div>
      </div>
      {showSetOperations ? (
        <React.Fragment>
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.flexEndColumn
                : styles.flexStartColumn
            }
          >
            <p className={styles.dropdownMargin}></p>
            <p className={styles.operationsLabel}>{t("variable")}</p>
            <CustomizedDropdown
              id="AR_Field_Type_Dropdown"
              disabled={isReadOnly}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.fieldDropdown
                  : styles.fieldDropdown
              }
              value={field}
              onChange={(event) => handleFieldChange(event)}
              validationBoolean={checkValidation}
              validationBooleanSetterFunc={setCheckValidation}
              showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
            >
              {getFieldListing()
                .filter(
                  (element) =>
                    element.VariableScope !== "S" &&
                    element.VariableScope !== "C" &&
                    element.VariableScope !== "U" &&
                    element.VariableScope !== "I"
                )
                .map((element) => {
                  return (
                    <MenuItem
                      className={styles.menuItemStyles}
                      key={element.VariableName}
                      value={element.VariableName}
                    >
                      {element.VariableName}
                    </MenuItem>
                  );
                })}
            </CustomizedDropdown>
          </div>
          <div
            className={
              direction === RTL_DIRECTION ? arabicStyles.equals : styles.equals
            }
          >
            =
          </div>
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.flexEndColumn
                : styles.flexStartColumn
            }
          >
            <p className={styles.dropdownMargin}></p>
            <p className={styles.operationsLabel}>{t("value")}</p>
            <CustomizedDropdown
              id="AR_Value1_Dropdown"
              disabled={isReadOnly}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.valueDropdown
                  : styles.valueDropdown
              }
              value={value1}
              onChange={(event) => handleValue1Change(event)}
              validationBoolean={checkValidation}
              validationBooleanSetterFunc={setCheckValidation}
              showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
              isConstant={isField1Const}
              setIsConstant={(val) => setIsField1Const(val)}
              showConstValue={!isDBFlagSelected}
              constType={findVariableType(
                localRuleData.ruleOpList[index].param1
              )}
            >
              {
                // filterVariablesAsPerRights(
                value1DropdownOptions &&
                  value1DropdownOptions
                    //   ,
                    //   "R"
                    // )
                    .map((element) => {
                      return !isDBFlagSelected ? (
                        <MenuItem
                          className={styles.menuItemStyles}
                          key={element.VariableName}
                          value={element.VariableName}
                        >
                          {element.VariableName}
                        </MenuItem>
                      ) : (
                        <MenuItem
                          className={styles.menuItemStyles}
                          key={element.value}
                          value={element.value}
                        >
                          {element.label}
                        </MenuItem>
                      );
                    })
              }
            </CustomizedDropdown>
          </div>
          {!isDBFlagSelected ? (
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.flexRow
                  : styles.flexRow
              }
            >
              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.flexEndColumn
                    : styles.flexStartColumn
                }
              >
                <p className={styles.dropdownMargin}></p>
                <p className={styles.operationsLabel}>{t("operator")}</p>
                <CustomizedDropdown
                  id="AR_Operator_Type_Dropdown"
                  disabled={isReadOnly}
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.operatorDropdown
                      : styles.operatorDropdown
                  }
                  value={operator}
                  onChange={(event) => handleOperatorChange(event)}
                  validationBoolean={checkValidation}
                  validationBooleanSetterFunc={setCheckValidation}
                  showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
                >
                  {operatorList &&
                    operatorList.map((element) => {
                      return (
                        <MenuItem
                          className={styles.menuItemStyles}
                          key={element.value}
                          value={element.value}
                        >
                          {element.label}
                        </MenuItem>
                      );
                    })}
                </CustomizedDropdown>
              </div>

              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.flexEndColumn
                    : styles.flexStartColumn
                }
              >
                <p className={styles.dropdownMargin}></p>
                <p className={styles.operationsLabel}>{t("value")}</p>
                <CustomizedDropdown
                  id="AR_Value2_Dropdown"
                  disabled={isReadOnly}
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.valueDropdown
                      : styles.valueDropdown
                  }
                  value={value2}
                  onChange={(event) => handleValue2Change(event)}
                  validationBoolean={checkValidation}
                  validationBooleanSetterFunc={setCheckValidation}
                  showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
                  isConstant={isField2Const}
                  setIsConstant={(val) => setIsField2Const(val)}
                  showConstValue={true}
                  constType={findVariableType(
                    localRuleData.ruleOpList[index].param3
                  )}
                >
                  {value2DropdownOptions &&
                    value2DropdownOptions.map((element) => {
                      return (
                        <MenuItem
                          className={styles.menuItemStyles}
                          key={element.VariableName}
                          value={element.VariableName}
                        >
                          {element.VariableName}
                        </MenuItem>
                      );
                    })}
                </CustomizedDropdown>
              </div>

              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.flexEndColumn
                    : styles.flexStartColumn
                }
              >
                <p className={styles.dropdownMargin}></p>
                <p className={styles.operationsLabel}>{t("calenderType")}</p>
                <CustomizedDropdown
                  id="AR_Calendar_Type_Dropdown"
                  disabled={isDateTypeFieldSelected || isReadOnly}
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.calendarTypeDropdown
                      : styles.calendarTypeDropdown
                  }
                  value={calendarType}
                  onChange={(event) => handleCalendarType(event)}
                  validationBoolean={checkValidation}
                  validationBooleanSetterFunc={setCheckValidation}
                  showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
                  isNotMandatory={
                    +findVariableType(field) !== DATE_VARIABLE_TYPE
                  }
                >
                  {calendarTypeOptions &&
                    calendarTypeOptions.map((element) => {
                      return (
                        <MenuItem
                          className={
                            isDateTypeFieldSelected || isReadOnly
                              ? styles.menuItemStylesDisabled
                              : styles.menuItemStyles
                          }
                          key={element.value}
                          value={element.value}
                        >
                          {element.label}
                        </MenuItem>
                      );
                    })}
                </CustomizedDropdown>
              </div>
            </div>
          ) : null}
          {showDelIcon && !isReadOnly && (
            <DeleteOutlinedIcon
              id="AR_Delete_Button"
              className={styles.deleteIcon}
              onClick={() => deleteOperation(index)}
            />
          )}
        </React.Fragment>
      ) : null}

      {showAssignedTo ? (
        <div
          className={
            direction === RTL_DIRECTION ? arabicStyles.flexRow : styles.flexRow
          }
        >
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.flexEndColumn
                : styles.flexStartColumn
            }
          >
            <p className={styles.dropdownMargin}></p>
            <p className={styles.operationsLabel}>{t("AssignTo")}</p>
            <CustomizedDropdown
              id="AR_Assigned_To_Dropdown"
              disabled={isReadOnly}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.assignedToVariableDropdown
                  : styles.assignedToVariableDropdown
              }
              value={assignedToValue}
              onChange={(event, isConst) =>
                handleAssignedToVariable(event, isConst)
              }
              validationBoolean={checkValidation}
              validationBooleanSetterFunc={setCheckValidation}
              showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
              isConstant={isAutoInitiateConst}
              setIsConstant={(val) => setIsAutoInitiateConst(val)}
              showConstValue={true}
            >
              {Object.keys(assignToFields).map((element) => {
                return (
                  <MenuItem
                    className={styles.menuItemStyles}
                    key={element}
                    value={element}
                  >
                    {element}
                  </MenuItem>
                );
              })}
            </CustomizedDropdown>
          </div>
          {showDelIcon && !isReadOnly && (
            <DeleteOutlinedIcon
              id="AR_Delete_Button"
              className={styles.deleteIcon}
              onClick={() => deleteOperation(index)}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default AddOperations;
