// #BugID - 107313
// #BugDescription - Added labels to operation with no label.
// #BugID - 107352
// #BugDescription - Added check so that cost field should only take numeric values.
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import { MenuItem, Radio, Checkbox, InputBase } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import {
  operationTypeOptions,
  calendarTypeOptions,
  secondaryDBFlagOptions,
  getTypedropdown,
} from "../CommonFunctionCall";
import { useGlobalState } from "state-pool";
import {
  DATE_VARIABLE_TYPE,
  INTEGER_VARIABLE_TYPE,
  ADD_OPERATION_SYSTEM_FUNCTIONS,
  ADD_OPERATION_EXT_FUNCTIONS,
  ADD_OPERATION_SECONDARY_DBFLAG,
  SYSTEM_DEFINED_SCOPE,
  USER_DEFINED_SCOPE,
  STRING_VARIABLE_TYPE,
  SET_OPERATION_TYPE,
  INC_PRIORITY_OPERATION_TYPE,
  DEC_PRIORITY_OPERATION_TYPE,
  TRIGGER_OPERATION_TYPE,
  COMMIT_OPERATION_TYPE,
  ASSIGNED_TO_OPERATION_TYPE,
  CALL_OPERATION_TYPE,
  SET_PARENT_DATA_OPERATION_TYPE,
  SET_AND_EXECUTE_OPERATION_TYPE,
  ESCALATE_TO_OPERATION_TYPE,
  ESCALATE_WITH_TRIGGER_OPERATION_TYPE,
  ROUTE_TO_OPERATION_TYPE,
  REINITIATE_OPERATION_TYPE,
  ROLLBACK_OPERATION_TYPE,
  AUDIT_OPERATION_TYPE,
  DISTRIBUTE_TO_OPERATION_TYPE,
  Y_FLAG,
  READ_RIGHT,
  MODIFY_RIGHT,
  OPTION_VALUE_1,
  OPTION_VALUE_2,
  RTL_DIRECTION,
} from "../../../../../Constants/appConstants";
import {
  getOperatorOptions,
  getEmptyRuleOperationObj,
} from "../CommonFunctions";
import Modal from "../../../../../UI/Modal/Modal";
import TriggerDefinition from "../../../../ProcessSettings/Trigger/TriggerDefinition";
import { getVariableType } from "../../../../../utility/ProcessSettings/Triggers/getVariableType";
import ParameterMappingModal from "./MappingModal";
import CustomizedDropdown from "../../../../../UI/Components_With_ErrrorHandling/Dropdown";
import { isEqual, omit } from "lodash";
import clsx from "clsx";
import { setToastDataFunc } from "../../../../../redux-store/slices/ToastDataHandlerSlice";
import { useDispatch } from "react-redux";

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
    isProcessReadOnly,
    registeredFunctions,
    operationsAllowed,
    workstepList,
    checkValidation,
    setCheckValidation,
    setDoesSelectedRuleHaveErrors,
    showDelIcon,
    variablesWithRights,
  } = props;
  const dispatch = useDispatch();
  const [loadedProcessData] = useGlobalState("loadedProcessData");
  const variableData = loadedProcessData.Variable;
  const [operationType, setOperationType] = useState(SET_OPERATION_TYPE);
  const [field, setField] = useState(""); // State to store the value of field dropdown.
  const [value1, setValue1] = useState(""); // State to store the value of value 1 dropdown.
  const [operator, setOperator] = useState(""); // State to store the value of operator dropdown.
  const [value2, setValue2] = useState(""); // State to store the value of value 2 dropdown.
  const [calendarType, setCalendarType] = useState(""); // State to store the value of calendar type dropdown.
  const [triggerValue, setTriggerValue] = useState(""); // State to save value of the trigger selected.
  const [isModalOpen, setIsModalOpen] = useState(false); // State that manages modal.
  const [operandSelected, setOperandSelected] = useState(""); // State to save the value of operand selected in set and execute.
  const [applicationName, setApplicationName] = useState(""); // State to save the application type selected in set and execute.
  const [functionSelected, setFunctionSelected] = useState(""); // State to save the function selected.
  const [selectedFunctionMethodIndex, setSelectedFunctionMethodIndex] =
    useState(""); // State to save the methodIndex of the function selected.
  const [emailValue, setEmailValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [daysValue, setDaysValue] = useState("");
  const [hoursValue, setHoursValue] = useState("");
  const [minutesValue, setMinutesValue] = useState("");
  const [secondsValue, setSecondsValue] = useState("");
  const [repeatAfterValue, setRepeatAfterValue] = useState(false);
  const [repeatAfterMinutesValue, setRepeatAfterMinutesValue] = useState("");
  const [mailTriggerSelected, setMailTriggerSelected] = useState("");
  const [auditPercentage, setAuditPercentage] = useState(5);
  const [ifSampledValue, setIfSampledValue] = useState("");
  const [notSampledValue, setNotSampledValue] = useState("");
  const [escalateWithTriggerRadio, setEscalateWithTriggerRadio] = useState(1);
  const [readRightsVariables, setReadRightsVariables] = useState(false);
  const [modifyRightsVariables, setModifyRightsVariables] = useState(false);

  const [functionOptions, setFunctionOptions] = useState([]); // State to store the function dropdown options.
  const [isDBFlagSelected, setIsDBFlagSelected] = useState(false); // State to store whether secondary db flag is selected or not.
  const [value1DropdownOptions, setValue1DropdownOptions] = useState([]); // State to store the options for value 1 dropdown.
  const [value2DropdownOptions, setValue2DropdownOptions] = useState([]); // State to store the options for value 2 dropdown.
  const [operatorList, setOperatorList] = useState([]); // State to store the list of operators according to the field selected.
  const [dropdownOptions, setDropdownOptions] = useState([]); // State to store all the data variables for dropdown options.
  const [assignedToValue, setAssignedToValue] = useState(""); // State to store the value of Assigned to variable dropdown.
  const [isDateTypeFieldSelected, setIsDateTypeFieldSelected] = useState(true); // State to check if the value of field dropdown is date type or not in SET operation.
  const [routeToType, setRouteToType] = useState("1"); // State to store route to type.
  const [selectedRouteToValue, setSelectedRouteToValue] = useState(""); // State to store selected route to value.
  const [selectedWorkstep, setSelectedWorkstep] = useState("");
  const [selectedChildVariable, setSelectedChildVariable] = useState("");
  const [selectedChildArray, setSelectedChildArray] = useState("");

  const [showSetOperations, setShowSetOperations] = useState(false); // Boolean to show SET operation fields.
  const [showTrigger, setShowTrigger] = useState(false); // Boolean to show TRIGGER operation fields.
  const [triggerListData, setTriggerListData] = useState([]); // List of triggers for a process.
  const [showSetAndExecute, setShowSetAndExecute] = useState(false); // Boolean to show SET AND EXECUTE operation fields.
  const [showAssignedTo, setShowAssignedTo] = useState(false); // Boolean to show Assigned to operation fields.
  const [showCallOp, setShowCallOp] = useState(false); // Boolean to show Call operation fields.
  const [showEscalateToOperations, setShowEscalateToOperations] =
    useState(false); // Boolean to show Escalate to operation fields.
  const [showEscalateWithTrigger, setShowEscalateWithTrigger] = useState(false); // Boolean to show Escalate to with trigger operation fields.
  const [showRouteTo, setShowRouteTo] = useState(false); // Boolean to show Route to operation fields.
  const [showAuditOp, setShowAuditOp] = useState(false); // Boolean to show Audit operation fields.
  const [showDistributeOp, setShowDistributeOp] = useState(false);

  const setOperationTypes = [
    SET_OPERATION_TYPE,
    SET_PARENT_DATA_OPERATION_TYPE,
  ];
  const triggerOperationTypes = [TRIGGER_OPERATION_TYPE];
  const setAndExecuteAndCallTypes = [
    SET_AND_EXECUTE_OPERATION_TYPE,
    CALL_OPERATION_TYPE,
  ];
  const assignedToAndCallTypes = [ASSIGNED_TO_OPERATION_TYPE];
  const noFieldOperations = [
    INC_PRIORITY_OPERATION_TYPE,
    DEC_PRIORITY_OPERATION_TYPE,
    COMMIT_OPERATION_TYPE,
    REINITIATE_OPERATION_TYPE,
    ROLLBACK_OPERATION_TYPE,
  ];

  const applicationNameOptions = [
    ADD_OPERATION_SYSTEM_FUNCTIONS,
    ADD_OPERATION_EXT_FUNCTIONS,
  ];

  const escalateTypeOptions = [
    ESCALATE_TO_OPERATION_TYPE,
    ESCALATE_WITH_TRIGGER_OPERATION_TYPE,
  ];

  const auditTypeOption = [AUDIT_OPERATION_TYPE];

  const distributeToOption = [DISTRIBUTE_TO_OPERATION_TYPE];

  const multipleOpValidation = [
    ROLLBACK_OPERATION_TYPE,
    ROUTE_TO_OPERATION_TYPE,
    COMMIT_OPERATION_TYPE,
    REINITIATE_OPERATION_TYPE,
    AUDIT_OPERATION_TYPE,
    CALL_OPERATION_TYPE,
  ];

  // Function that gets called when variableData prop changes.
  useEffect(() => {
    if (variableData) {
      setDropdownOptions(variableData);
      setCalendarType(Y_FLAG);
    }
  }, [variableData]);

  // Function that runs when the variablesWithRights value changes.
  useEffect(() => {
    if (variablesWithRights) {
      const readVariables = variablesWithRights.filter(
        (element) => element.VariableType === READ_RIGHT
      );
      const modifyVariables = variablesWithRights.filter(
        (element) => element.VariableType === MODIFY_RIGHT
      );
      setReadRightsVariables(readVariables);
      setModifyRightsVariables(modifyVariables);
    }
  }, [variablesWithRights]);

  // Function that runs when the component loads.
  useEffect(() => {
    if (loadedProcessData) {
      let triggerList = [];
      loadedProcessData &&
        loadedProcessData.TriggerList &&
        loadedProcessData.TriggerList.forEach((element) => {
          triggerList.push(element.TriggerName);
        });
      setTriggerListData(triggerList);
    }
    setOperator("0");
  }, []);

  // Function that runs and selects the first available option in a route to operation dropdown.
  const setFirstRouteOption = () => {
    let firstOption = "";
    if (routeToType === "1") {
      firstOption = workstepList && workstepList[0];
    } else if (routeToType === "2") {
      firstOption = getFieldListing() && getFieldListing()[0].VariableName;
    }
    setSelectedRouteToValue(firstOption);
  };

  // Function to empty all data fields.
  const emptyAllDataFields = () => {
    setField("");
    setValue1("");
    setOperator("");
    setValue2("");
    setTriggerValue("");
    setOperandSelected("");
    setApplicationName("");
    setFunctionSelected("");
    setSelectedFunctionMethodIndex("");
    setValue1DropdownOptions([]);
    setValue2DropdownOptions([]);
    setOperatorList([]);
    setAssignedToValue("");
    setRouteToType("1");
    setSelectedRouteToValue("");
    setEmailValue("");
    setDateValue("");
    setDaysValue("");
    setHoursValue("");
    setMinutesValue("");
    setSecondsValue("");
    setRepeatAfterValue(false);
    setRepeatAfterMinutesValue("");
    setSelectedChildArray("");
    setSelectedWorkstep("");
    setSelectedChildVariable("");
  };

  // Function that generates the options for system and external functions based on its parameters.
  const getFunctionOptions = (methodIndex, isTypeNameSent) => {
    let functionsList = [];
    let functionOptionsList = [];
    let applicationName = isTypeNameSent
      ? methodIndex
      : getFunctionTypeName(methodIndex);

    // Function that checks if the parameter is the last parameter.
    const isLastParameter = (index, length) => {
      return index === length - 1;
    };

    if (applicationName === ADD_OPERATION_SYSTEM_FUNCTIONS) {
      functionsList =
        registeredFunctions &&
        registeredFunctions.filter((element) => {
          if (element.AppType === SYSTEM_DEFINED_SCOPE) {
            return element;
          }
        });
    } else if (applicationName === ADD_OPERATION_EXT_FUNCTIONS) {
      functionsList =
        registeredFunctions &&
        registeredFunctions.filter((element) => {
          if (element.AppType === USER_DEFINED_SCOPE) {
            return element;
          }
        });
    }
    functionsList &&
      functionsList.forEach((element) => {
        let optionLabel = "";
        let paramLabel = "";
        element.Parameter &&
          element.Parameter.forEach((parameterElement, elemIndex) => {
            const concatenatedParameterLabel = paramLabel.concat(
              getVariableType(parameterElement.ParamType),
              isLastParameter(elemIndex, element.Parameter.length) ? "" : ","
            );
            paramLabel = concatenatedParameterLabel;
          });
        optionLabel = optionLabel.concat(
          element.MethodName,
          "(",
          paramLabel,
          ")"
        );
        const obj = {
          label: optionLabel,
          value: element.MethodName,
          parameters: element.Parameter,
          methodIndex: element.MethodIndex,
        };
        functionOptionsList.push(obj);
      });
    setFunctionOptions([...functionOptionsList]);
    getSelectedFunction(methodIndex, functionOptionsList);
  };

  const filterVariablesAsPerRights = (variableData, rightsType) => {
    let filteredArray,
      temp = [];
    let arr = [];
    let variables = variableData;
    variables.forEach((element) => {
      if (element.VariableScope === "U" || element.VariableScope === "I") {
        variablesWithRights &&
          variablesWithRights.forEach((elem) => {
            if (elem.VariableType === rightsType) {
              if (element.VariableName === elem.VariableName) {
                temp.push(element);
              }
            }
          });
      }
    });
    variables.forEach((element, index) => {
      if (element.VariableScope === "U" || element.VariableScope === "I") {
        if (!temp.includes(element)) {
          arr.push(element);
        }
      }
    });
    filteredArray = variables.filter((element) => {
      return arr.indexOf(element) === -1;
    });

    return filteredArray;
  };

  // Function that gets the listing of variables in a particular order.
  const getFieldListing = (value) => {
    /* VariableIds of variables used are as follows :
      CreatedByName : 32,
      SecondaryDBFlag : 42,
      Status : 10022
    */
    let fieldArray = [];
    if (value === "19") {
      const defaultOptions =
        dropdownOptions &&
        dropdownOptions.filter((element) => {
          if (element.VariableId === "32" || element.VariableId === "42")
            return element;
        });
      fieldArray = defaultOptions;
      const remainingOptions =
        dropdownOptions &&
        dropdownOptions.filter((element) => {
          if (element.VariableId === "32" || element.VariableId === "42")
            return element;
        });
    } else {
      dropdownOptions &&
        dropdownOptions.forEach((element) => {
          if (
            element.VariableId === "32" ||
            element.VariableId === "42" ||
            element.VariableId === "10022"
          ) {
            fieldArray.push(element);
          }
        });

      dropdownOptions &&
        dropdownOptions.forEach((element) => {
          if (
            element.VariableId !== "32" &&
            element.VariableId !== "42" &&
            element.VariableId !== "10022" &&
            element.VariableType !== "11"
          ) {
            fieldArray.push(element);
          }
        });
    }
    return fieldArray;
  };

  // const filterOtherMScopeVariables = (variables) => {
  //   const filteredArray =
  //     variables &&
  //     variables.filter((element) => {
  //       if (element.VariableScope === "M") {
  //         return (
  //           element.VariableId === "32" ||
  //           element.VariableId === "42" ||
  //           element.VariableId === "10022"
  //         );
  //       }
  //     });
  //   return filteredArray;
  // };

  // Function to show field according to operation type.
  const setFieldValues = (element) => {
    const opType = element.opType;
    switch (opType) {
      case TRIGGER_OPERATION_TYPE:
        setTriggerValue(element.param1);
        break;
      case ASSIGNED_TO_OPERATION_TYPE:
        setAssignedToValue(element.param1);
      case SET_AND_EXECUTE_OPERATION_TYPE:
        setOperandSelected(element.param1);
        setApplicationName(getFunctionTypeName(element.param2));
        getFunctionOptions(element.param2);
        setSelectedFunctionMethodIndex(element.param2);
        break;
      case CALL_OPERATION_TYPE:
        setApplicationName(getFunctionTypeName(element.param1));
        getFunctionOptions(element.param1);
        setSelectedFunctionMethodIndex(element.param1);
        break;
      case ROUTE_TO_OPERATION_TYPE:
        setFirstRouteOption();
        setRouteToType(checkParamType(element.param1));
        setSelectedRouteToValue(element.param1);
        break;
      case ESCALATE_TO_OPERATION_TYPE:
        setEmailValue(element.param1);
        setDateValue(element.param2);
        setDaysValue(element.durationInfo.paramDays);
        setHoursValue(element.durationInfo.paramHours);
        setMinutesValue(element.durationInfo.paramMinutes);
        setSecondsValue(element.durationInfo.paramSeconds);
        if (element.minute !== "") {
          setRepeatAfterValue(true);
          setRepeatAfterMinutesValue(element.minute);
        }
        break;
      case AUDIT_OPERATION_TYPE:
        setAuditPercentage(element.param1);
        setIfSampledValue(element.param2);
        setNotSampledValue(element.param3);
        break;
      case ESCALATE_WITH_TRIGGER_OPERATION_TYPE:
        setMailTriggerSelected(element.triggerName);
        setDateValue(element.param2);
        setDaysValue(element.durationInfo.paramDays);
        setHoursValue(element.durationInfo.paramHours);
        setMinutesValue(element.durationInfo.paramMinutes);
        setSecondsValue(element.durationInfo.paramSeconds);
        if (element.minute !== "") {
          setRepeatAfterValue(true);
          setRepeatAfterMinutesValue(element.minute);
        }
        break;
      case DISTRIBUTE_TO_OPERATION_TYPE:
        setSelectedWorkstep(element.param1);
        if (element.param2.trim() !== "") {
          setSelectedChildVariable(element.param2);
          setSelectedChildArray(element.param3);
        }
      default:
        break;
    }
  };

  // Function to get the param type according to the param name.
  const checkParamType = (paramName) => {
    let paramType = "";
    workstepList &&
      workstepList.forEach((element) => {
        if (element === paramName) {
          paramType = OPTION_VALUE_1;
        }
      });

    getFieldListing() &&
      getFieldListing().forEach((element) => {
        if (element.VariableName === paramName) {
          paramType = OPTION_VALUE_2;
        }
      });
    return paramType;
  };

  // Function that sets the selected function according to the methodIndex.
  const getSelectedFunction = (methodIndex, functionOptions) => {
    let selectedFunction = "";
    let methodName = "";
    registeredFunctions &&
      registeredFunctions.forEach((element) => {
        if (element.MethodIndex === methodIndex) {
          methodName = element.MethodName;
        }
      });

    functionOptions &&
      functionOptions.forEach((element) => {
        if (element.value === methodName) {
          selectedFunction = element.value;
        }
      });
    setFunctionSelected(selectedFunction);
  };

  // Function to get the function type based on the app type.
  const getFunctionType = (appType) => {
    if (appType === SYSTEM_DEFINED_SCOPE) {
      return ADD_OPERATION_SYSTEM_FUNCTIONS;
    } else if (appType === USER_DEFINED_SCOPE) {
      return ADD_OPERATION_EXT_FUNCTIONS;
    }
  };

  // Function to get the function type name based on the method index.
  const getFunctionTypeName = (methodIndex) => {
    let functionType = "";
    registeredFunctions &&
      registeredFunctions.forEach((element) => {
        if (element.MethodIndex === methodIndex) {
          functionType = getFunctionType(element.AppType);
        }
      });
    return functionType;
  };

  // Function that handles the change in radio options for route to operation.
  const routeToRadioHandler = (event) => {
    let firstOption = "";
    const { value } = event.target;
    setRouteToType(value);
    if (value === OPTION_VALUE_1) {
      firstOption = workstepList && workstepList[0];
    } else if (value === OPTION_VALUE_2) {
      firstOption = getFieldListing() && getFieldListing()[0].VariableName;
    }
    setSelectedRouteToValue(firstOption);
  };

  // Function that handles the change in route to value.
  const routeToHandler = (event) => {
    setSelectedRouteToValue(event.target.value);
    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      temp.ruleOpList[index].param1 = event.target.value;
      return temp;
    });
  };

  // Function that handles the change in audit percentage.
  const auditPercentageHandler = (event) => {
    const { value } = event.target;
    if (value >= 5) {
      setAuditPercentage(value);
    }
    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      temp.ruleOpList[index].param1 = value;
      return temp;
    });
  };

  // Function that handles the workstep changes.
  const workstepHandler = (event) => {
    const { value } = event.target;
    setSelectedWorkstep(value);
    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      temp.ruleOpList[index].param1 = value;
      return temp;
    });
  };

  // Function that handles the child variable changes.
  const childVariableHandler = (event) => {
    const { value } = event.target;
    setSelectedChildVariable(value);
    setSelectedChildArray("");
    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      temp.ruleOpList[index].param2 = value;
      return temp;
    });
  };

  // Function that handles the child array changes.
  const childArrayHandler = (event) => {
    const { value } = event.target;
    setSelectedChildArray(value);
    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      temp.ruleOpList[index].param3 = value;
      return temp;
    });
  };

  // Function that gets the array variables for a particular variableData and variable type.
  const getArrayVariables = (variableData) => {
    const variableType = findVariableType(selectedChildVariable);
    return (
      variableData &&
      variableData.filter(
        (element) =>
          element.VariableType === variableType && element.Unbounded === "Y"
      )
    );
  };

  // Function that handles the change in 'if sampled' value.
  const ifSampledHandler = (event) => {
    const { value } = event.target;
    setIfSampledValue(value);
    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      temp.ruleOpList[index].param2 = value;
      return temp;
    });
  };

  // Function that handles the change in 'not sampled' value.
  const notSampledHandler = (event) => {
    const { value } = event.target;
    setNotSampledValue(value);
    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      temp.ruleOpList[index].param3 = value;
      return temp;
    });
  };

  // Function that handles the change in email value.
  const emailValueHandler = (event) => {
    if (!checkDuplicateValues(event, "param1")) {
      const { value } = event.target;
      setEmailValue(value);
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].param1 = value;
        return temp;
      });
    }
  };

  // Function that handles the change in date value.
  const dateValueHandler = (event) => {
    if (!checkDuplicateValues(event, "param2")) {
      const { value } = event.target;
      setDateValue(value);
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].param2 = value;
        return temp;
      });
    }
  };

  // Function that handles the change in days value.
  const daysValueHandler = (event) => {
    if (!checkDuplicateValues(event, "durationInfo.paramDays")) {
      const { value } = event.target;
      setDaysValue(value);
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].durationInfo.paramDays = value;
        return temp;
      });
    }
  };

  // Function that handles the change in hours value.
  const hoursValueHandler = (event) => {
    if (!checkDuplicateValues(event, "durationInfo.paramHours")) {
      const { value } = event.target;
      setHoursValue(value);
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].durationInfo.paramHours = value;
        return temp;
      });
    }
  };

  // Function that handles the change in minutes value.
  const minutesValueHandler = (event) => {
    if (!checkDuplicateValues(event, "durationInfo.paramMinutes")) {
      const { value } = event.target;
      setMinutesValue(value);
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].durationInfo.paramMinutes = value;
        return temp;
      });
    }
  };

  // Function that handles the change in seconds value.
  const secondsValueHandler = (event) => {
    if (!checkDuplicateValues(event, "durationInfo.paramSeconds")) {
      const { value } = event.target;
      setSecondsValue(value);
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].durationInfo.paramSeconds = value;
        return temp;
      });
    }
  };

  // Function that handles the change in 'repeat after minutes' value.
  const repeatAfterMinutesValueHandler = (event) => {
    if (!checkDuplicateValues(event, "minute")) {
      const { value } = event.target;
      setRepeatAfterMinutesValue(value);
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].minute = value;
        return temp;
      });
    }
  };

  // Function that handles the change in escalate to radio.
  const escalateToRadioHandler = (event) => {
    const { value } = event.target;
    setEscalateWithTriggerRadio(value);
  };

  // Function that runs when the ruleOpList on the localRuleData changes.
  useEffect(() => {
    setOperationType(localRuleData.ruleOpList[index].opType);
    checkOperationType(localRuleData.ruleOpList[index].opType);
    setField(localRuleData.ruleOpList[index].param1);
    setValue1(localRuleData.ruleOpList[index].param2);
    setOperator(localRuleData.ruleOpList[index].operator);
    setValue2(localRuleData.ruleOpList[index].param3);
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
    }
  }, [localRuleData.ruleOpList]);

  // Function that runs when the component mounts.
  useEffect(() => {
    getDropdownOptions(localRuleData.ruleOpList[index].param1);
    const variableType = findVariableType(
      localRuleData.ruleOpList[index].param2
    );
    getFieldValues(variableType);
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
          if (element.VariableType === variableType) {
            return element;
          }
        });

      setValue1DropdownOptions(filteredParam1Options);
    }
    getFieldValues(variableType);
  };

  // Function that runs when the selected rule changes.
  useEffect(() => {
    const emptyArr = [];
    setValue1DropdownOptions([...emptyArr]);
    getDropdownOptions(localRuleData.ruleOpList[index].param1);
  }, [selectedRule]);

  // Function that runs when the operation type changes.
  useEffect(() => {
    if (setOperationTypes.includes(operationType)) {
      setShowSetOperations(true);
    } else {
      setShowSetOperations(false);
    }
  }, [operationType]);

  // Function to select first trigger value.
  const selectFirstTrigger = () => {
    setTriggerValue(triggerListData && triggerListData[0]);
    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      temp.ruleOpList[index].param1 = triggerListData && triggerListData[0];
      return temp;
    });
  };

  // Function that checks the operation type and set the fields accordingly.
  const checkOperationType = (value) => {
    if (setOperationTypes.includes(value)) {
      setShowSetOperations(true);
      setShowTrigger(false);
      setShowAssignedTo(false);
      getFieldListing(value);
      setShowSetAndExecute(false);
      setShowCallOp(false);
      setShowRouteTo(false);
      setShowEscalateToOperations(false);
      setShowAuditOp(false);
      setShowDistributeOp(false);
    } else if (triggerOperationTypes.includes(value)) {
      setShowTrigger(true);
      selectFirstTrigger();
      setShowSetOperations(false);
      setShowAssignedTo(false);
      setShowSetAndExecute(false);
      setShowRouteTo(false);
      setShowEscalateToOperations(false);
      setShowAuditOp(false);
      setShowDistributeOp(false);
    } else if (setAndExecuteAndCallTypes.includes(value)) {
      if (value === CALL_OPERATION_TYPE) {
        setShowCallOp(true);
        setShowSetAndExecute(false);
      } else if (value === SET_AND_EXECUTE_OPERATION_TYPE) {
        setShowSetAndExecute(true);
        setShowCallOp(false);
      }
      setShowAuditOp(false);
      setShowTrigger(false);
      setShowSetOperations(false);
      setShowAssignedTo(false);
      setShowRouteTo(false);
      setShowEscalateToOperations(false);
      setShowDistributeOp(false);
    } else if (assignedToAndCallTypes.includes(value)) {
      setShowAuditOp(false);
      setShowAssignedTo(true);
      setShowSetAndExecute(false);
      setShowTrigger(false);
      setShowSetOperations(false);
      setShowSetAndExecute(false);
      setShowCallOp(false);
      setShowRouteTo(false);
      setShowEscalateToOperations(false);
      setShowDistributeOp(false);
    } else if (ROUTE_TO_OPERATION_TYPE === value) {
      setShowAuditOp(false);
      setShowRouteTo(true);
      setFirstRouteOption();
      setShowAssignedTo(false);
      setShowSetAndExecute(false);
      setShowTrigger(false);
      setShowSetOperations(false);
      setShowSetAndExecute(false);
      setShowCallOp(false);
      setShowEscalateToOperations(false);
      setShowDistributeOp(false);
    } else if (escalateTypeOptions.includes(value)) {
      setShowAuditOp(false);
      setShowEscalateToOperations(true);
      if (value === ESCALATE_TO_OPERATION_TYPE) {
        setShowEscalateWithTrigger(false);
      } else if (value === ESCALATE_WITH_TRIGGER_OPERATION_TYPE) {
        setShowEscalateWithTrigger(true);
      }
      setShowAssignedTo(false);
      setShowSetAndExecute(false);
      setShowTrigger(false);
      setShowSetOperations(false);
      setShowSetAndExecute(false);
      setShowCallOp(false);
      setShowRouteTo(false);
      setShowDistributeOp(false);
    } else if (auditTypeOption.includes(value)) {
      setShowAuditOp(true);
      setShowEscalateToOperations(false);
      setShowAssignedTo(false);
      setShowSetAndExecute(false);
      setShowTrigger(false);
      setShowSetOperations(false);
      setShowSetAndExecute(false);
      setShowCallOp(false);
      setShowRouteTo(false);
      setShowDistributeOp(false);
    } else if (distributeToOption.includes(value)) {
      setShowAuditOp(false);
      setShowEscalateToOperations(false);
      setShowAssignedTo(false);
      setShowSetAndExecute(false);
      setShowTrigger(false);
      setShowSetOperations(false);
      setShowSetAndExecute(false);
      setShowCallOp(false);
      setShowRouteTo(false);
      setShowDistributeOp(true);
    } else {
      setShowAuditOp(false);
      setShowEscalateToOperations(false);
      setShowAssignedTo(false);
      setShowSetAndExecute(false);
      setShowTrigger(false);
      setShowSetOperations(false);
      setShowSetAndExecute(false);
      setShowCallOp(false);
      setShowRouteTo(false);
      setShowDistributeOp(false);
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
    temp.ruleOpList[index] = getEmptyRuleOperationObj(
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
    localRuleData &&
      localRuleData.ruleOpList.forEach((element) => {
        if (element.opType === value) {
          temp = true;
        }
      });
    return temp;
  };

  // Function that runs when the user changes the trigger dropdown value for a TRIGGER operation.
  const onSelectTrigger = (event) => {
    if (!checkDuplicateValues(event, "param1")) {
      if (isRuleBeingCreated === false) {
        setIsRuleBeingModified(true);
      }
      setTriggerValue(event.target.value);
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].param1 = event.target.value;
        return temp;
      });
    }
  };

  // Function that validates if the same operation has already been defined or not.
  const checkDuplicateValues = (event, key) => {
    let temp = false;
    const operationType =
      localRuleData && localRuleData.ruleOpList[index].opType;
    let obj = JSON.parse(JSON.stringify(localRuleData.ruleOpList[index]));
    obj[key] = event.target.value;
    obj = omit(obj, "opOrderId");

    localRuleData &&
      localRuleData.ruleOpList.forEach((element) => {
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
      setCalendarType("");
      setField(event.target.value);
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].param1 = "";
        temp.ruleOpList[index].param2 = "";
        temp.ruleOpList[index].operator = "";
        temp.ruleOpList[index].param3 = "";
        return temp;
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
        return temp;
      });

      if (event.target.value === ADD_OPERATION_SECONDARY_DBFLAG) {
        setIsDBFlagSelected(true);
        setValue1DropdownOptions([...secondaryDBFlagOptions]);
        setValue1(secondaryDBFlagOptions && secondaryDBFlagOptions[0].value);
      } else {
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
              if (element.VariableType === variableType) {
                return element;
              }
            });

          setValue1DropdownOptions(filteredParam1Options);
        }

        if (+variableType === DATE_VARIABLE_TYPE) {
          const filteredParam2Options =
            dropdownOptions &&
            dropdownOptions.filter((element) => {
              if (+element.VariableType === INTEGER_VARIABLE_TYPE) {
                return element;
              }
            });
          setValue2DropdownOptions(filteredParam2Options);
        } else {
          const filteredParam1Options =
            dropdownOptions &&
            dropdownOptions.filter((element) => {
              if (element.VariableType === variableType) {
                return element;
              }
            });
          setValue2DropdownOptions(filteredParam1Options);
        }
      }
    }
  };

  // Function that closes the modal.
  const handleClose = () => {
    setIsModalOpen(false);
  };

  // Function that opens the modal.
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function that is used to find the variable type of a specific variable.
  const findVariableType = (value) => {
    let variableType = "";
    dropdownOptions &&
      dropdownOptions.forEach((element) => {
        if (element.VariableName === value) {
          variableType = element.VariableType;
        }
      });
    return variableType;
  };

  // Function that gets the dropdown options for value 2 dropdown based on the variable type given.
  const getFieldValues = (variableType) => {
    if (+variableType === DATE_VARIABLE_TYPE) {
      const filteredParam2Options =
        dropdownOptions &&
        dropdownOptions.filter((element) => {
          if (+element.VariableType === INTEGER_VARIABLE_TYPE) {
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
          if (element.VariableType === variableType) {
            return element;
          }
        });
      setValue2DropdownOptions(filteredParam2Options);
    }
  };

  // Function that runs when the user changes the first value dropdown for a SET operation.
  const handleValue1Change = (event) => {
    if (!checkDuplicateValues(event, "param2")) {
      let variableType = findVariableType(event.target.value);
      setValue1(event.target.value);
      getFieldValues(variableType);
      if (isRuleBeingCreated === false) {
        setIsRuleBeingModified(true);
      }
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].param2 = event.target.value;
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

  // Function that runs when the user changes the second value dropdown for a SET operation.
  const handleValue2Change = (event) => {
    if (!checkDuplicateValues(event, "param3")) {
      setValue2(event.target.value);
      if (isRuleBeingCreated === false) {
        setIsRuleBeingModified(true);
      }
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].param3 = event.target.value;
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

  // Function that handles the application name changes.
  const handleApplicationName = (event) => {
    setFunctionSelected("");
    setApplicationName(event.target.value);
    getFunctionOptions(event.target.value, true);
  };

  // Function that handles the selected operand in SET and EXECUTE operation.
  const handleOperandSelected = (event) => {
    if (!checkDuplicateValues(event, "param1")) {
      if (!showCallOp) {
        setOperandSelected(event.target.value);
        setLocalRuleData((prevData) => {
          let temp = { ...prevData };
          temp.ruleOpList[index].param1 = event.target.value;
          return temp;
        });
      }
    }
  };

  // Function that handles the selected function in SET and EXECUTE operation.
  const handleSelectedFunction = (event) => {
    setFunctionSelected(event.target.value);
    setLocalRuleData((prevData) => {
      let temp = { ...prevData };
      if (showCallOp) {
        temp.ruleOpList[index].param1 = event.target.value;
      } else {
        temp.ruleOpList[index].param2 = event.target.value;
      }
      return temp;
    });
  };

  // Function that handles the assigned to variable changes.
  const handleAssignedToVariable = (event) => {
    if (!checkDuplicateValues(event, "param1")) {
      setAssignedToValue(event.target.value);
      setLocalRuleData((prevData) => {
        let temp = { ...prevData };
        temp.ruleOpList[index].param1 = event.target.value;
        return temp;
      });
    }
  };

  return (
    <div
      className={
        direction === RTL_DIRECTION ? arabicStyles.flexRow : styles.flexRow
      }
    >
      <div>
        <p className={styles.dropdownMargin}></p>
        <div
          className={
            direction === RTL_DIRECTION ? arabicStyles.flexRow : styles.flexRow
          }
        >
          <CustomizedDropdown
            id="AR_Operation_Type_Dropdown"
            disabled={isProcessReadOnly}
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
          {noFieldOperations.includes(operationType) && !isProcessReadOnly ? (
            <DeleteOutlinedIcon
              id="AR_Delete_Button"
              className={styles.noFieldDeleteIcon}
              onClick={() => deleteOperation(index)}
            />
          ) : null}
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
            <p className={styles.operationsLabel}>{t("field")}</p>
            <CustomizedDropdown
              id="AR_Field_Type_Dropdown"
              disabled={isProcessReadOnly}
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
              {filterVariablesAsPerRights(
                getFieldListing().filter(
                  (element) => element.VariableScope !== "S"
                ),
                "O"
              ).map((element) => {
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
              disabled={isProcessReadOnly}
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
            >
              {filterVariablesAsPerRights(
                value1DropdownOptions && value1DropdownOptions,
                "R"
              ).map((element) => {
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
              })}
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
                  disabled={isProcessReadOnly}
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
                  disabled={isProcessReadOnly}
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
                >
                  {filterVariablesAsPerRights(
                    value2DropdownOptions && value2DropdownOptions,
                    "R"
                  ).map((element) => {
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
                  disabled={isDateTypeFieldSelected || isProcessReadOnly}
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
            </div>
          ) : null}
          {showDelIcon && !isProcessReadOnly ? (
            <DeleteOutlinedIcon
              id="AR_Delete_Button"
              className={styles.deleteIcon}
              onClick={() => deleteOperation(index)}
            />
          ) : null}
        </React.Fragment>
      ) : null}

      {showTrigger ? (
        <React.Fragment>
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.flexEndColumn
                : styles.flexStartColumn
            }
          >
            <p className={styles.dropdownMargin}></p>
            <p className={styles.operationsLabel}>{t("trigger")}</p>
            <CustomizedDropdown
              id="AR_Trigger_List_Dropdown"
              disabled={isProcessReadOnly}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.triggerDropdown
                  : styles.triggerDropdown
              }
              value={triggerValue}
              onChange={(event) => onSelectTrigger(event)}
              validationBoolean={checkValidation}
              validationBooleanSetterFunc={setCheckValidation}
              showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
            >
              {triggerListData &&
                triggerListData.map((element) => {
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
          <div className={styles.dropdownMargin}>
            {!isProcessReadOnly ? (
              <button
                id="AR_Define_Trigger_Button"
                onClick={openModal}
                className={styles.button}
              >
                {t("define")}
              </button>
            ) : null}
          </div>
          <Modal
            show={isModalOpen}
            modalClosed={handleClose}
            style={{
              width: "80%",
              height: "80%",
              left: "10%",
              top: "15%",
              padding: "0px",
            }}
          >
            <TriggerDefinition
              hideLeftPanel={true}
              handleCloseModal={handleClose}
            />
          </Modal>
          {showDelIcon && !isProcessReadOnly ? (
            <DeleteOutlinedIcon
              id="AR_Delete_Button"
              className={styles.deleteIcon}
              onClick={() => deleteOperation(index)}
            />
          ) : null}
        </React.Fragment>
      ) : null}

      {showSetAndExecute || showCallOp ? (
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
            {!showCallOp ? (
              <p className={styles.operationsLabel}>{t("operand")}</p>
            ) : null}
            {!showCallOp ? (
              <CustomizedDropdown
                id="AR_Operand_Type_Dropdown"
                disabled={isProcessReadOnly}
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.operandDropdown
                    : styles.operandDropdown
                }
                value={operandSelected}
                onChange={(event) => handleOperandSelected(event)}
                validationBoolean={checkValidation}
                validationBooleanSetterFunc={setCheckValidation}
                showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
              >
                {getFieldListing().map((element) => {
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
            ) : null}
          </div>
          {!showCallOp ? (
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.setAndExecuteEquals
                  : styles.setAndExecuteEquals
              }
            >
              =
            </div>
          ) : null}
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.flexEndColumn
                : styles.flexStartColumn
            }
          >
            <p className={styles.dropdownMargin}></p>
            <p className={styles.operationsLabel}>{t("applicationName")}</p>
            <CustomizedDropdown
              id="AR_Application_Name_Dropdown"
              disabled={isProcessReadOnly}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.valueDropdown
                  : styles.valueDropdown
              }
              value={applicationName}
              onChange={(event) => handleApplicationName(event)}
              validationBoolean={checkValidation}
              validationBooleanSetterFunc={setCheckValidation}
              showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
            >
              {!showCallOp ? (
                applicationNameOptions &&
                applicationNameOptions.map((element) => {
                  return (
                    <MenuItem
                      className={styles.menuItemStyles}
                      key={element}
                      value={element}
                    >
                      {element}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem
                  className={styles.menuItemStyles}
                  key={ADD_OPERATION_EXT_FUNCTIONS}
                  value={ADD_OPERATION_EXT_FUNCTIONS}
                >
                  {ADD_OPERATION_EXT_FUNCTIONS}
                </MenuItem>
              )}
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
            <p className={styles.operationsLabel}>{t("functionName")}</p>
            <CustomizedDropdown
              id="AR_Field_Type_Dropdown"
              disabled={isProcessReadOnly}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.valueDropdown
                  : styles.valueDropdown
              }
              value={functionSelected}
              onChange={(event) => handleSelectedFunction(event)}
              validationBoolean={checkValidation}
              validationBooleanSetterFunc={setCheckValidation}
              showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
            >
              {functionOptions &&
                functionOptions.map((element) => {
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
          <div className={styles.dropdownMargin}>
            <button
              id="AR_Map_Fields_Button"
              onClick={openModal}
              className={styles.button}
            >
              {t("map")}
            </button>
            <Modal
              show={isModalOpen}
              modalClosed={handleClose}
              style={{
                width: "40%",
                height: "60%",
                left: "32%",
                top: "30%",
                padding: "0px",
              }}
            >
              <ParameterMappingModal
                dropdownOptions={dropdownOptions}
                functionSelected={functionSelected}
                functionMethodIndex={selectedFunctionMethodIndex}
                functionOptions={functionOptions}
                parameterMapping={
                  localRuleData.ruleOpList &&
                  localRuleData.ruleOpList[index].paramMappingList
                }
              />
            </Modal>
          </div>
          {showDelIcon && !isProcessReadOnly ? (
            <DeleteOutlinedIcon
              id="AR_Delete_Button"
              className={styles.deleteIcon}
              onClick={() => deleteOperation(index)}
            />
          ) : null}
        </div>
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
            <p className={styles.operationsLabel}>{t("variableName")}</p>
            <CustomizedDropdown
              id="AR_Assigned_To_Dropdown"
              disabled={isProcessReadOnly}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.assignedToVariableDropdown
                  : styles.assignedToVariableDropdown
              }
              value={assignedToValue}
              onChange={(event) => handleAssignedToVariable(event)}
              validationBoolean={checkValidation}
              validationBooleanSetterFunc={setCheckValidation}
              showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
            >
              {getFieldListing().map((element) => {
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
          {showDelIcon && !isProcessReadOnly ? (
            <DeleteOutlinedIcon
              id="AR_Delete_Button"
              className={styles.deleteIcon}
              onClick={() => deleteOperation(index)}
            />
          ) : null}
        </div>
      ) : null}

      {showRouteTo ? (
        <div
          className={
            direction === RTL_DIRECTION ? arabicStyles.flexRow : styles.flexRow
          }
        >
          <div
            className={clsx(
              direction === RTL_DIRECTION
                ? arabicStyles.flexRow
                : styles.flexRow,
              styles.dropdownMargin
            )}
          >
            <p className={styles.dropdownMargin}></p>
            <Radio
              disabled={isProcessReadOnly}
              id="AO_Worksteps_Option"
              checked={+routeToType === 1}
              onChange={routeToRadioHandler}
              size="small"
              className={styles.radioOption}
              value={1}
            />
            <p className={styles.routeToType}>{t("workstep(s)")}</p>
            <Radio
              disabled={isProcessReadOnly}
              id="AO_Variables_Option"
              checked={+routeToType === 2}
              onChange={routeToRadioHandler}
              size="small"
              className={styles.radioOption}
              value={2}
            />
            <p className={styles.routeToType}>{t("variable(s)")}</p>
            <CustomizedDropdown
              id="AO_Route_To_Dropdown"
              disabled={isProcessReadOnly}
              className={styles.inputVariableDropdown}
              value={selectedRouteToValue}
              onChange={(event) => routeToHandler(event)}
              validationBoolean={checkValidation}
              validationBooleanSetterFunc={setCheckValidation}
              showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
            >
              {+routeToType === 1
                ? workstepList.map((element) => {
                    return (
                      <MenuItem
                        className={styles.menuItemStyles}
                        key={element}
                        value={element}
                      >
                        {element}
                      </MenuItem>
                    );
                  })
                : +routeToType === 2
                ? getFieldListing()
                    .filter(
                      (element) =>
                        +element.VariableType === STRING_VARIABLE_TYPE
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
                    })
                : null}
            </CustomizedDropdown>
          </div>
          {showDelIcon && !isProcessReadOnly ? (
            <DeleteOutlinedIcon
              id="AR_Delete_Button"
              className={styles.deleteIcon}
              onClick={() => deleteOperation(index)}
            />
          ) : null}
        </div>
      ) : null}

      {showEscalateToOperations ? (
        <div>
          <div className={styles.flexColumnMargin}>
            <p className={styles.dropdownMargin}></p>
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.flexEndColumn
                  : styles.flexColumn
              }
            >
              {!showEscalateWithTrigger ? (
                <div
                  className={clsx(
                    direction === RTL_DIRECTION
                      ? arabicStyles.flexEndColumn
                      : styles.flexStartColumn,
                    styles.dropdownMargin
                  )}
                >
                  <p className={styles.operationsLabel}>
                    {t("variableOrEmail")}
                  </p>
                  <CustomizedDropdown
                    id="AO_Escalate_To_Variable_Dropdown"
                    disabled={isProcessReadOnly}
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.escalateToVariableDropdown
                        : styles.escalateToVariableDropdown
                    }
                    value={emailValue}
                    onChange={(event) => emailValueHandler(event)}
                    validationBoolean={checkValidation}
                    validationBooleanSetterFunc={setCheckValidation}
                    showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
                  >
                    {getFieldListing()
                      .filter(
                        (element) =>
                          +element.VariableType === STRING_VARIABLE_TYPE
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
              ) : (
                <div
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.flexRow
                      : styles.flexRow
                  }
                >
                  <Radio
                    disabled={isProcessReadOnly}
                    id="AO_Escalate_trigger_Define_Mail_Option"
                    checked={+escalateWithTriggerRadio === 1}
                    onChange={escalateToRadioHandler}
                    size="small"
                    className={styles.radioOption}
                    value={1}
                  />
                  <p className={styles.routeToType}>{t("defineMail")}</p>
                  <Radio
                    disabled={isProcessReadOnly}
                    id="AO_Escalate_trigger_Select_Mail_Option"
                    checked={+escalateWithTriggerRadio === 2}
                    onChange={escalateToRadioHandler}
                    size="small"
                    className={styles.radioOption}
                    value={2}
                  />
                  <p className={styles.routeToType}>{t("selectMailTrigger")}</p>
                </div>
              )}
            </div>
            <div>
              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.flexRow
                    : styles.flexRow
                }
              >
                <p
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.afterEscalationText
                      : styles.afterEscalationText
                  }
                >
                  {t("after")}
                </p>
                <div
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.flexEndColumn
                      : styles.flexStartColumn
                  }
                >
                  <p className={styles.operationsLabel}>{t("Date")}</p>
                  <CustomizedDropdown
                    id="AO_Escalate_To_Date_Dropdown"
                    disabled={isProcessReadOnly}
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.escalateToFieldsDropdown
                        : styles.escalateToFieldsDropdown
                    }
                    value={dateValue}
                    onChange={(event) => dateValueHandler(event)}
                    validationBoolean={checkValidation}
                    validationBooleanSetterFunc={setCheckValidation}
                    showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
                  >
                    {getFieldListing()
                      .filter(
                        (element) =>
                          +element.VariableType === DATE_VARIABLE_TYPE
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
                    direction === RTL_DIRECTION
                      ? arabicStyles.flexEndColumn
                      : styles.flexStartColumn
                  }
                >
                  <p className={styles.operationsLabel}>{t("days")}</p>
                  <CustomizedDropdown
                    id="AO_Escalate_To_Days_Dropdown"
                    disabled={isProcessReadOnly}
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.escalateToFieldsDropdown
                        : styles.escalateToFieldsDropdown
                    }
                    value={daysValue}
                    onChange={(event) => daysValueHandler(event)}
                    validationBoolean={checkValidation}
                    validationBooleanSetterFunc={setCheckValidation}
                    showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
                  >
                    {getFieldListing()
                      .filter(
                        (element) =>
                          +element.VariableType === INTEGER_VARIABLE_TYPE
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
                    direction === RTL_DIRECTION
                      ? arabicStyles.flexEndColumn
                      : styles.flexStartColumn
                  }
                >
                  <p className={styles.operationsLabel}>{t("hours")}</p>
                  <CustomizedDropdown
                    id="AO_Escalate_To_Hours_Dropdown"
                    disabled={isProcessReadOnly}
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.escalateToFieldsDropdown
                        : styles.escalateToFieldsDropdown
                    }
                    value={hoursValue}
                    onChange={(event) => hoursValueHandler(event)}
                    validationBoolean={checkValidation}
                    validationBooleanSetterFunc={setCheckValidation}
                    showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
                  >
                    {getFieldListing()
                      .filter(
                        (element) =>
                          +element.VariableType === INTEGER_VARIABLE_TYPE
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
                    direction === RTL_DIRECTION
                      ? arabicStyles.flexEndColumn
                      : styles.flexStartColumn
                  }
                >
                  <p className={styles.operationsLabel}>{t("minutes")}</p>
                  <CustomizedDropdown
                    id="AO_Escalate_To_Minutes_Dropdown"
                    disabled={isProcessReadOnly}
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.escalateToFieldsDropdown
                        : styles.escalateToFieldsDropdown
                    }
                    value={minutesValue}
                    onChange={(event) => minutesValueHandler(event)}
                    validationBoolean={checkValidation}
                    validationBooleanSetterFunc={setCheckValidation}
                    showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
                  >
                    {getFieldListing()
                      .filter(
                        (element) =>
                          +element.VariableType === INTEGER_VARIABLE_TYPE
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
                    direction === RTL_DIRECTION
                      ? arabicStyles.flexEndColumn
                      : styles.flexStartColumn
                  }
                >
                  <p className={styles.operationsLabel}>{t("seconds")}</p>
                  <CustomizedDropdown
                    id="AO_Escalate_To_Secs_Dropdown"
                    disabled={isProcessReadOnly}
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.escalateToFieldsDropdown
                        : styles.escalateToFieldsDropdown
                    }
                    value={secondsValue}
                    onChange={(event) => secondsValueHandler(event)}
                    validationBoolean={checkValidation}
                    validationBooleanSetterFunc={setCheckValidation}
                    showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
                  >
                    {getFieldListing()
                      .filter(
                        (element) =>
                          +element.VariableType === INTEGER_VARIABLE_TYPE
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
                    direction === RTL_DIRECTION
                      ? arabicStyles.flexEndColumn
                      : styles.flexStartColumn
                  }
                >
                  <p className={styles.operationsLabel}>{t("calendarTypes")}</p>
                  <CustomizedDropdown
                    id="AO_Calendar_Type_Dropdown"
                    disabled={isProcessReadOnly}
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.escalateToFieldsDropdown
                        : styles.escalateToFieldsDropdown
                    }
                    value={calendarType}
                    onChange={(event) => handleCalendarType(event)}
                    validationBoolean={checkValidation}
                    validationBooleanSetterFunc={setCheckValidation}
                    showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
                  >
                    {calendarTypeOptions &&
                      calendarTypeOptions.map((element) => {
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
              </div>
            </div>
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.flexRow
                  : styles.flexRow
              }
            >
              <Checkbox
                disabled={isProcessReadOnly}
                id="AO_Repeat_after_checkbox"
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.repeatAfterCheckbox
                    : styles.repeatAfterCheckbox
                }
                checked={repeatAfterValue}
                onChange={() => setRepeatAfterValue(!repeatAfterValue)}
                size="small"
              />
              <p className={styles.operationsLabelMid}>{t("repeatAfter")}</p>
              <InputBase
                id="AO_Repeat_after_checkbox"
                variant="outlined"
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.textInputField
                    : styles.textInputField
                }
                value={repeatAfterMinutesValue}
                disabled={isProcessReadOnly || !repeatAfterValue}
                type="number"
                onChange={(event) => repeatAfterMinutesValueHandler(event)}
              />
              <p className={styles.operationsLabelMid}>{t("minutes")}</p>
              {showDelIcon && !isProcessReadOnly ? (
                <DeleteOutlinedIcon
                  id="AR_Delete_Button"
                  className={styles.deleteIcon}
                  onClick={() => deleteOperation(index)}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {showAuditOp ? (
        <div
          className={
            direction === RTL_DIRECTION ? arabicStyles.flexRow : styles.flexRow
          }
        >
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
              <p className={styles.operationsLabel}>{"Audit"}</p>
              <InputBase
                id="AO_Audit_Percentage_Input"
                variant="outlined"
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.textInputField
                    : styles.textInputField
                }
                value={auditPercentage}
                disabled={isProcessReadOnly}
                type="number"
                onChange={(event) => auditPercentageHandler(event)}
              />
            </div>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.percentageIcon
                  : styles.percentageIcon
              }
            >
              %
            </p>
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.flexEndColumn
                  : styles.flexStartColumn
              }
            >
              <p className={styles.dropdownMargin}></p>
              <p
                className={clsx(
                  styles.operationsLabel,
                  styles.marginLeftOperationLabel
                )}
              >
                {"If Sampled"}
              </p>
              <CustomizedDropdown
                id="AO_If_Sampled_Dropdown"
                disabled={isProcessReadOnly}
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.inputVariableDropdown
                    : styles.inputVariableDropdown
                }
                value={ifSampledValue}
                onChange={(event) => ifSampledHandler(event)}
                validationBoolean={checkValidation}
                validationBooleanSetterFunc={setCheckValidation}
                showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
              >
                {workstepList &&
                  workstepList.map((element) => {
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
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.flexEndColumn
                  : styles.flexStartColumn
              }
            >
              <p className={styles.dropdownMargin}></p>
              <p
                className={clsx(
                  styles.operationsLabel,
                  styles.marginLeftOperationLabel
                )}
              >
                {"Not Sampled"}
              </p>
              <CustomizedDropdown
                id="AO_Not_Sampled_Dropdown"
                disabled={isProcessReadOnly}
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.inputVariableDropdown
                    : styles.inputVariableDropdown
                }
                value={notSampledValue}
                onChange={(event) => notSampledHandler(event)}
                validationBoolean={checkValidation}
                validationBooleanSetterFunc={setCheckValidation}
                showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
              >
                {workstepList &&
                  workstepList.map((element) => {
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
          </div>
          {showDelIcon && !isProcessReadOnly ? (
            <DeleteOutlinedIcon
              id="AR_Delete_Button"
              className={styles.deleteIcon}
              onClick={() => deleteOperation(index)}
            />
          ) : null}
        </div>
      ) : null}

      {showDistributeOp ? (
        <div
          className={
            direction === RTL_DIRECTION ? arabicStyles.flexRow : styles.flexRow
          }
        >
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.flexRow
                : styles.flexRow
            }
          >
            <p className={styles.dropdownMargin}></p>
            <CustomizedDropdown
              id="AO_Workstep_Dropdown"
              disabled={isProcessReadOnly}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.inputVariableDropdown
                  : styles.inputVariableDropdown
              }
              value={selectedWorkstep}
              onChange={(event) => workstepHandler(event)}
              validationBoolean={checkValidation}
              validationBooleanSetterFunc={setCheckValidation}
              showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
            >
              {workstepList &&
                workstepList.map((element) => {
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
            <CustomizedDropdown
              id="AO_Child_Variable_Dropdown"
              disabled={isProcessReadOnly}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.inputVariableDropdown
                  : styles.inputVariableDropdown
              }
              value={selectedChildVariable}
              onChange={(event) => childVariableHandler(event)}
              validationBoolean={checkValidation}
              validationBooleanSetterFunc={setCheckValidation}
              showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
              isNotMandatory={selectedChildVariable === ""}
            >
              {dropdownOptions &&
                dropdownOptions
                  .filter(
                    (element) =>
                      element.VariableScope === "I" ||
                      element.VariableScope === "U"
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
            <CustomizedDropdown
              id="AO_Child_Array_Dropdown"
              disabled={isProcessReadOnly}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.inputVariableDropdown
                  : styles.inputVariableDropdown
              }
              value={selectedChildArray}
              onChange={(event) => childArrayHandler(event)}
              validationBoolean={checkValidation}
              validationBooleanSetterFunc={setCheckValidation}
              showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
              isNotMandatory={selectedChildVariable === ""}
            >
              {getArrayVariables(
                dropdownOptions &&
                  dropdownOptions.filter(
                    (element) =>
                      element.VariableScope === "I" ||
                      element.VariableScope === "U"
                  )
              ).map((element) => {
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
          {showDelIcon && !isProcessReadOnly ? (
            <DeleteOutlinedIcon
              id="AR_Delete_Button"
              className={styles.deleteIcon}
              onClick={() => deleteOperation(index)}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default AddOperations;
