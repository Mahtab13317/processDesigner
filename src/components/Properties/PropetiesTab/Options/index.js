// #BugID - 112055
// #BugDescription - Made changes,added validations and made changes for set and get for bug.
import React, { useState, useEffect } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { Select, MenuItem } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";
import SelectWithInput from "../../../../UI/SelectWithInput";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import { connect } from "react-redux";
import "./index.css";
import {
  PROCESSTYPE_LOCAL,
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import { useDispatch, useSelector } from "react-redux";

function Options(props) {
  // error flags
  const [daysErrorFlag, setDaysErrorFlag] = useState(false);
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const tabStatus = useSelector(ActivityPropertyChangeValue);
  const [errorsObj, setErrorsObj] = useState({
    hours: false,
    minutes: false,
    seconds: false,
  });
  const [tatErrorObj, setTatErrorObj] = useState({
    hours: false,
    minutes: false,
    seconds: false,
  });
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const isProcessReadOnly = props.openProcessType !== PROCESSTYPE_LOCAL;
  const [expireStatus, setExpireStatus] = useState(
    localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.expiryInfo
      ?.expFlag
      ? t("expiresAfter")
      : t("neverExpires")
  );
  const [dateTime, setDateTime] = useState(null);
  const dispatch = useDispatch();
  const [operatorType, setOperatorType] = useState("11");
  let expiryInfo =
    localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.expiryInfo;
  let tatInfo =
    localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.tatInfo;

  const [days, setDays] = useState(
    expiryInfo?.wfDays
      ? localLoadedActivityPropertyData?.ActivityProperty?.optionInfo
          ?.expiryInfo?.wfDays
      : "0"
  );
  const [turnAroundDays, setTurnAroundDays] = useState(
    tatInfo?.wfDays
      ? localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.tatInfo
          ?.wfDays
      : "0"
  );
  const [hours, setHours] = useState(
    expiryInfo?.wfHours
      ? localLoadedActivityPropertyData?.ActivityProperty?.optionInfo
          ?.expiryInfo?.wfHours
      : "0"
  );
  const [turnAroundHours, setTurnAroundHours] = useState(
    tatInfo?.wfDays
      ? localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.tatInfo
          ?.wfHours
      : "0"
  );
  const [minutes, setMinutes] = useState(
    expiryInfo?.wfMinutes
      ? localLoadedActivityPropertyData?.ActivityProperty?.optionInfo
          ?.expiryInfo?.wfMinutes
      : "0"
  );
  const [turnAroundMinutes, setTurnAroundMinutes] = useState(
    tatInfo?.wfDays
      ? localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.tatInfo
          ?.wfMinutes
      : "0"
  );
  const [seconds, setSeconds] = useState(
    expiryInfo?.wfSeconds
      ? localLoadedActivityPropertyData?.ActivityProperty?.optionInfo
          ?.expiryInfo?.wfSeconds
      : "0"
  );
  const [turnAroundSeconds, setTurnAroundSeconds] = useState(
    tatInfo?.wfDays
      ? localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.tatInfo
          ?.wfSeconds
      : "0"
  );
  const [daysType, setDaysType] = useState("Y");
  const [routeTo, setRouteTo] = useState(null);
  const [triggerCheckValue, setTriggerCheckValue] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [turnAroundCheckValue, setTurnAroundCheckValue] = useState(
    tatInfo?.tatFlag
  );
  const [variableDefinition] = useGlobalState("variableDefinition");
  const loadedProcessData = store.getState("loadedProcessData");
  const [isFromConstant, setIsFromConstant] = useState(true);
  const [anyError, setAnyError] = useState(false);
  const [filteredVarList, setFilteredVarList] = useState([]);
  const [holdUntilList, setHoldUntilList] = useState([]);
  const [tatInfoDaysType, setTatInfoDaysType] = useState("Y");
  const [expiryInfoConstantsData, setExpiryInfoConstantsData] = useState({
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
  });
  const [tatInfoConstantsData, setTatInfoConstantsData] = useState({
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
  });

  useEffect(() => {
    const tempObj = {
      days: "",
      hours: "",
      minutes: "",
      seconds: "",
    };
    setExpiryInfoConstantsData(tempObj);
    setTatInfoConstantsData(tempObj);
  }, []);

  useEffect(() => {
    if (variableDefinition) {
      setFilteredVarList(
        variableDefinition.filter(
          (element) =>
            (element.VariableScope === "U" || element.VariableScope === "I") &&
            element.VariableType !== "11" &&
            (element.VariableType === "3" || element.VariableType === "4") &&
            element.Unbounded === "N"
        )
      );
      setHoldUntilList(
        variableDefinition.filter(
          (element) =>
            element.VariableType !== "11" &&
            element.VariableType === "8" &&
            element.Unbounded === "N"
        )
      );
    }
  }, [variableDefinition]);

  const clearLocalObj = () => {
    let tempData = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    let tempState = tempData?.ActivityProperty?.optionInfo;
    const obj = {
      expiryInfo: {
        expFlag: false,
      },
      tatInfo: {
        tatFlag: false,
      },
    };
    tempState = obj;
    tempData.ActivityProperty.optionInfo = tempState;
    setTriggerCheckValue(false);
    setTurnAroundCheckValue(false);
    setDays("0");
    setHours("0");
    setMinutes("0");
    setSeconds("0");
    setTurnAroundDays("0");
    setTurnAroundHours("0");
    setTurnAroundMinutes("0");
    setTurnAroundSeconds("0");
    setTatInfoDaysType("Y");
    setlocalLoadedActivityPropertyData(tempData);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.options]: { isModified: true, hasError: false },
      })
    );
  };

  const expireStatusHandler = (event) => {
    setExpireStatus(event.target.value);
    const expStatus = event.target.value;
    if (expStatus === t("neverExpires")) {
      clearLocalObj();
    } else {
      let tempData = JSON.parse(
        JSON.stringify(localLoadedActivityPropertyData)
      );
      let tempState = tempData?.ActivityProperty?.optionInfo;
      const obj = {
        expiryInfo: {
          varFieldId_Minutes: "0",
          holdTillVar: "",
          variableId_Hours: "0",
          triggerName: "",
          expiryActivity: "",
          triggerId: "0",
          wfDays: "0",
          wfMinutes: "0",
          varFieldId_Seconds: "0",
          variableId_Minutes: "0",
          expFlag: true,
          varFieldId_Hours: "0",
          expCalFlag: "Y",
          varFieldId_Days: "0",
          expiryOperator: "11",
          variableId_Seconds: "0",
          variableId_Days: "0",
          wfSeconds: "0",
          wfHours: "0",
        },
        tatInfo: {
          tatFlag: false,
        },
      };
      tempState = obj;
      tempData.ActivityProperty.optionInfo = tempState;
      setlocalLoadedActivityPropertyData(tempData);
    }
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.options]: { isModified: true, hasError: false },
      })
    );
  };

  const clearTurnAroundTimeValues = () => {
    let tempData = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    if (turnAroundCheckValue) {
      const tempObj = {
        tatFlag: false,
      };
      tempData.ActivityProperty.optionInfo.tatInfo = tempObj;
      setTurnAroundDays("0");
      setTurnAroundHours("0");
      setTurnAroundMinutes("0");
      setTurnAroundSeconds("0");
      setTatInfoDaysType("Y");
    } else {
      tempData.ActivityProperty.optionInfo.tatInfo = {
        varFieldId_Minutes: "0",
        variableId_Hours: "0",
        wfDays: "0",
        wfMinutes: "0",
        tatCalFlag: "Y",
        varFieldId_Seconds: "0",
        variableId_Minutes: "0",
        tatFlag: true,
        varFieldId_Hours: "0",
        varFieldId_Days: "0",
        variableId_Seconds: "0",
        variableId_Days: "0",
        wfSeconds: "0",
        wfHours: "0",
      };
    }
    setlocalLoadedActivityPropertyData(tempData);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.options]: { isModified: true, hasError: false },
      })
    );
  };

  const clearTriggerValues = () => {
    if (!triggerCheckValue) {
      let tempData = JSON.parse(
        JSON.stringify(localLoadedActivityPropertyData)
      );
      let tempState = tempData?.ActivityProperty?.optionInfo;
      if (
        tempState.expiryInfo.hasOwnProperty("triggerId") &&
        tempState.expiryInfo.hasOwnProperty("triggerName")
      ) {
        tempState.expiryInfo.triggerId = "";
        tempState.expiryInfo.triggerName = "";
      }
      setSelectedTrigger(null);
      tempData.ActivityProperty.optionInfo = tempState;
      setlocalLoadedActivityPropertyData(tempData);
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.options]: { isModified: true, hasError: false },
        })
      );
    }
  };

  const setDateTimeHandler = (event) => {
    setDateTime(event.target.value);
    setActivityPropertyData(
      event.target.value,
      "expiryInfo",
      "holdTillVar",
      "",
      ""
    );
    // let tempLocalState = { ...localLoadedActivityPropertyData };
    // tempLocalState.ActivityProperty.optionInfo.expiryInfo.holdTillVar =
    //   event.target.value;
    // setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const getVariableDetails = (variableName) => {
    let tempObj = {
      variableId: "",
      varFieldId: "",
    };
    variableDefinition?.forEach((element) => {
      if (element.VariableName === variableName) {
        tempObj.varFieldId = element.VarFieldId;
        tempObj.variableId = element.VariableId;
      }
    });
    return tempObj;
  };

  const getTriggerId = (triggerName) => {
    let triggerId = "";
    loadedProcessData.value.TriggerList?.forEach((element) => {
      if (element.TriggerName === triggerName) {
        triggerId = element.TriggerId;
      }
    });
    return triggerId;
  };

  const getTriggerName = (triggerId) => {
    let triggerName = "";
    loadedProcessData.value.TriggerList?.forEach((element) => {
      if (element.TriggerId === triggerId) {
        triggerName = element.TriggerName;
      }
    });
    return triggerName;
  };

  const setActivityPropertyData = (
    value,
    type,
    key,
    varFieldIdKey,
    variableIdKey
  ) => {
    let tempData = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    let tempLocalState = tempData?.ActivityProperty?.optionInfo;
    const variableId = getVariableDetails(value).variableId || "0";
    const varFieldId = getVariableDetails(value).varFieldId || "0";

    if (type === "expiryInfo") {
      if (!tempLocalState?.expiryInfo?.hasOwnProperty(key)) {
        const tempObj = {
          varFieldId_Minutes: "0",
          holdTillVar: "",
          variableId_Hours: "0",
          triggerName: "",
          expiryActivity: "",
          triggerId: "0",
          wfDays: "0",
          wfMinutes: "0",
          varFieldId_Seconds: "0",
          variableId_Minutes: "0",
          expFlag: true,
          varFieldId_Hours: "0",
          expCalFlag: "",
          varFieldId_Days: "0",
          expiryOperator: "",
          variableId_Seconds: "0",
          variableId_Days: "0",
          wfSeconds: "0",
          wfHours: "0",
        };
        tempLocalState.expiryInfo = tempObj;
      }
      tempLocalState.expiryInfo[key] = value;
      if (varFieldIdKey !== "") {
        tempLocalState.expiryInfo[varFieldIdKey] = varFieldId;
      }
      if (variableIdKey !== "") {
        tempLocalState.expiryInfo[variableIdKey] = variableId;
      }
      if (key === "triggerName") {
        tempLocalState.expiryInfo.triggerId = getTriggerId(value);
      }
    } else {
      if (!tempLocalState?.tatInfo?.hasOwnProperty(key)) {
        const tempObj = {
          varFieldId_Minutes: "0",
          variableId_Hours: "0",
          wfDays: "0",
          wfMinutes: "0",
          tatCalFlag: "",
          varFieldId_Seconds: "0",
          variableId_Minutes: "0",
          tatFlag: true,
          varFieldId_Hours: "0",
          varFieldId_Days: "0",
          variableId_Seconds: "0",
          variableId_Days: "0",
          wfSeconds: "0",
          wfHours: "0",
        };
        tempLocalState.tatInfo = tempObj;
      }
      tempLocalState.tatInfo[key] = value;
      if (varFieldIdKey !== "") {
        tempLocalState.tatInfo[varFieldIdKey] = varFieldId;
      }
      if (variableIdKey !== "") {
        tempLocalState.tatInfo[variableIdKey] = variableId;
      }
    }
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.options]: { isModified: true, hasError: false },
      })
    );
    tempData.ActivityProperty.optionInfo = tempLocalState;
    setlocalLoadedActivityPropertyData(tempData);
  };

  const operatorTypeHandler = (e) => {
    setOperatorType(e.target.value);
    setActivityPropertyData(
      e.target.value,
      "expiryInfo",
      "expiryOperator",
      "",
      ""
    );
    // let tempLocalState = { ...localLoadedActivityPropertyData };
    // e.target.value == "+"
    //   ? (tempLocalState.ActivityProperty.optionInfo.expiryInfo.expiryOperator =
    //       "11")
    //   : (tempLocalState.ActivityProperty.optionInfo.expiryInfo.expiryOperator =
    //       "12");
    // setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const daysTypeHandler = (e) => {
    setDaysType(e.target.value);
    setActivityPropertyData(e.target.value, "expiryInfo", "expCalFlag", "", "");
  };

  const tatInfoDaysTypeHandler = (e) => {
    setTatInfoDaysType(e.target.value);
    setActivityPropertyData(e.target.value, "tatInfo", "tatCalFlag", "", "");
  };

  const routeToHandler = (e) => {
    setRouteTo(e.target.value);
    setActivityPropertyData(
      e.target.value,
      "expiryInfo",
      "expiryActivity",
      "",
      ""
    );
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.options]: { isModified: true, hasError: false },
      })
    );
  };

  useEffect(() => {
    if (Object.values(errorsObj).includes(true)) {
      setAnyError(true);
    } else setAnyError(false);
  }, [errorsObj]);

  useEffect(() => {
    setDateTime(
      localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.expiryInfo
        ?.holdTillVar
    );

    setRouteTo(
      localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.expiryInfo
        ?.expiryActivity
    );
    let expOperator =
      localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.expiryInfo
        ?.expiryOperator;
    if (expOperator?.trim() !== "" && expOperator) {
      setOperatorType(
        localLoadedActivityPropertyData?.ActivityProperty?.optionInfo
          ?.expiryInfo?.expiryOperator
      );
    }
    let expCalFlag =
      localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.expiryInfo
        ?.expCalFlag;
    if (expCalFlag?.trim() !== "" && expCalFlag) {
      setDaysType(
        localLoadedActivityPropertyData?.ActivityProperty?.optionInfo
          ?.expiryInfo?.expCalFlag
      );
    }
    let tatCalFlag =
      localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.tatInfo
        ?.tatCalFlag;
    if (tatCalFlag?.trim() !== "" && tatCalFlag) {
      setTatInfoDaysType(
        localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.tatInfo
          ?.tatCalFlag
      );
    }
    let triggerIdValue =
      localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.expiryInfo
        ?.triggerId;
    if (
      triggerIdValue?.trim() !== "" &&
      triggerIdValue &&
      triggerIdValue !== "0"
    ) {
      setTriggerCheckValue(true);
      setSelectedTrigger(getTriggerName(triggerIdValue));
    }
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    let temp = JSON.parse(JSON.stringify(tabStatus));
    // if (Object.values(errorsObj).includes(true)) {
    //   temp.Options.hasError = true;

    //   console.log("ASDF1234", temp);
    //   dispatch(setActivityPropertyChange(temp));
    // } else {
    //   temp.Options.hasError = false;
    //   dispatch(setActivityPropertyChange(temp));
    // }
  }, [errorsObj]);

  return (
    <div id="OptionsTab">
      <div>
        <RadioGroup
          defaultValue={t("neverExpires")}
          onChange={(e) => expireStatusHandler(e)}
          row={true}
          value={expireStatus}
          name="row-radio-buttons-group"
        >
          <FormControlLabel
            value={t("neverExpires")}
            control={<Radio />}
            label={t("neverExpires")}
          />
          <div>
            <FormControlLabel
              value={t("expiresAfter")}
              control={<Radio />}
              label={t("expiresAfter")}
            />
          </div>
        </RadioGroup>
      </div>
      <div className="option_selectionBoxes">
        <div className="holdUntilDiv">
          <p
            className="holdUntilLabel"
            style={{
              marginRight: direction == RTL_DIRECTION ? "0px" : "16px",
            }}
          >
            {t("holdUntil")}
          </p>
          <FormControl>
            <Select
              disabled={expireStatus == t("neverExpires") || isProcessReadOnly}
              inputProps={{ "aria-label": "Without label" }}
              value={dateTime}
              onChange={(e) => setDateTimeHandler(e)}
              className="selectDateTime_options"
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              {holdUntilList?.map((variable) => {
                return (
                  <MenuItem value={variable.VariableName}>
                    <em style={{ fontSize: "12px", fontStyle: "normal" }}>
                      {variable.VariableName}
                    </em>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl>
            <Select
              disabled={expireStatus == t("neverExpires") || isProcessReadOnly}
              inputProps={{ "aria-label": "Without label" }}
              value={operatorType}
              onChange={(e) => operatorTypeHandler(e)}
              className="selectPlusMinus_options"
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              <MenuItem style={{ fontSize: "12px" }} value="11">
                +
              </MenuItem>
              <MenuItem style={{ fontSize: "12px" }} value="12">
                -
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="optionsTab_timeMapping">
          <div>
            <div className="options_time">
              <span
                className="options_days"
                style={{
                  marginRight: direction == RTL_DIRECTION ? "0px" : "14px",
                  marginLeft: direction == RTL_DIRECTION ? "14px" : "0px",
                }}
              >
                {t("days")}
              </span>
              <SelectWithInput
                dropdownOptions={filteredVarList}
                showError={true}
                optionKey="VariableName"
                setValue={(val) => {
                  setDays(val);
                  setActivityPropertyData(
                    !isNaN(val) ? val : val?.VariableName,
                    "expiryInfo",
                    "wfDays",
                    "varFieldId_Days",
                    "variableId_Days"
                  );
                }}
                value={days}
                isConstant={!isNaN(days)}
                inputClass="selectWithInputTextField_WS"
                constantInputClass="multiSelectConstInput_WS"
                selectWithInput="selectWithInput_WS"
                showEmptyString={false}
                showConstValue={true}
                disabled={
                  expireStatus === t("neverExpires") || isProcessReadOnly
                }
                id="days_select_input"
              />
            </div>
            <div className="options_time">
              <span
                className="options_hours"
                style={{
                  marginRight: direction == RTL_DIRECTION ? "0px" : "8px",
                  marginLeft: direction == RTL_DIRECTION ? "8px" : "0px",
                }}
              >
                {t("Hour(s)")}
              </span>
              <SelectWithInput
                dropdownOptions={filteredVarList}
                optionKey="VariableName"
                setValue={(val) => {
                  setHours(val);
                  let tempObj = { ...errorsObj };
                  if (!isNaN(val)) {
                    if (val > 24) {
                      tempObj.hours = true;
                    } else {
                      tempObj.hours = false;
                    }
                  } else {
                    tempObj.hours = false;
                  }
                  setErrorsObj(tempObj);
                  if (!tempObj.hours) {
                    setActivityPropertyData(
                      !isNaN(val) ? val : val?.VariableName,
                      "expiryInfo",
                      "wfHours",
                      "varFieldId_Hours",
                      "variableId_Hours"
                    );
                  }
                }}
                showError={true}
                value={hours}
                isConstant={!isNaN(hours)}
                inputClass="selectWithInputTextField_WS"
                constantInputClass="multiSelectConstInput_WS"
                selectWithInput="selectWithInput_WS"
                showEmptyString={false}
                showConstValue={true}
                disabled={
                  expireStatus == t("neverExpires") || isProcessReadOnly
                }
                id="hours_select_input"
              />
            </div>
            {hours > 24 ? (
              <p
                style={{
                  fontSize: "10px",
                  color: "red",
                  margin: "-7px 0px 5px 110px",
                }}
              >
                Value must lie in the range of 0-24
              </p>
            ) : null}
            <div className="options_time">
              <span
                className="options_minutes"
                style={{
                  marginRight: direction == RTL_DIRECTION ? "0px" : "16px",
                  marginLeft: direction == RTL_DIRECTION ? "16px" : "0px",
                }}
              >
                {t("minutes")}
              </span>
              <SelectWithInput
                dropdownOptions={filteredVarList}
                showError={true}
                optionKey="VariableName"
                setValue={(val) => {
                  setMinutes(val);
                  let tempObj = { ...errorsObj };
                  if (!isNaN(val)) {
                    if (val > 60) {
                      tempObj.minutes = true;
                    } else {
                      tempObj.minutes = false;
                    }
                  } else {
                    tempObj.minutes = false;
                  }
                  setErrorsObj(tempObj);
                  if (!tempObj.minutes) {
                    setActivityPropertyData(
                      !isNaN(val) ? val : val?.VariableName,
                      "expiryInfo",
                      "wfMinutes",
                      "varFieldId_Minutes",
                      "variableId_Minutes"
                    );
                  }
                }}
                value={minutes}
                isConstant={!isNaN(minutes)}
                inputClass="selectWithInputTextField_WS"
                constantInputClass="multiSelectConstInput_WS"
                selectWithInput="selectWithInput_WS"
                showEmptyString={false}
                showConstValue={true}
                disabled={
                  expireStatus == t("neverExpires") || isProcessReadOnly
                }
                id="mins_select_input"
              />
            </div>
            {minutes > 60 ? (
              <p
                style={{
                  fontSize: "10px",
                  color: "red",
                  margin: "-7px 0px 5px 110px",
                }}
              >
                Value must lie in the range of 0-60
              </p>
            ) : null}

            <div className="options_time">
              <span
                className="options_seconds"
                style={{
                  marginRight: direction == RTL_DIRECTION ? "0px" : "14px",
                  marginLeft: direction == RTL_DIRECTION ? "14px" : "0px",
                }}
              >
                {t("seconds")}
              </span>
              <SelectWithInput
                dropdownOptions={filteredVarList}
                showError={true}
                optionKey="VariableName"
                setValue={(val) => {
                  setSeconds(val);
                  let tempObj = { ...errorsObj };
                  if (!isNaN(val)) {
                    if (val > 60) {
                      tempObj.seconds = true;
                    } else {
                      tempObj.seconds = false;
                    }
                  } else {
                    tempObj.seconds = false;
                  }
                  setErrorsObj(tempObj);
                  if (!tempObj.seconds) {
                    setActivityPropertyData(
                      !isNaN(val) ? val : val?.VariableName,
                      "expiryInfo",
                      "wfSeconds",
                      "varFieldId_Seconds",
                      "variableId_Seconds"
                    );
                  }
                }}
                value={seconds}
                isConstant={!isNaN(seconds)}
                inputClass="selectWithInputTextField_WS"
                constantInputClass="multiSelectConstInput_WS"
                selectWithInput="selectWithInput_WS"
                showEmptyString={false}
                showConstValue={true}
                disabled={
                  expireStatus == t("neverExpires") || isProcessReadOnly
                }
                id="seconds_select_input"
              />
            </div>
            {seconds > 60 ? (
              <p
                style={{
                  fontSize: "10px",
                  color: "red",
                  margin: "-7px 0px 5px 110px",
                }}
              >
                Value must lie in the range of 0-60
              </p>
            ) : null}
          </div>
          <Select
            disabled={expireStatus == t("neverExpires") || isProcessReadOnly}
            inputProps={{ "aria-label": "Without label" }}
            value={daysType}
            onChange={(e) => daysTypeHandler(e)}
            displayEmpty
            style={{
              marginLeft: direction == RTL_DIRECTION ? "0px" : "50px",
              marginRight: direction == RTL_DIRECTION ? "50px" : "0px",
            }}
            className="time_Options"
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
          >
            <MenuItem value={"Y"}>
              <em style={{ fontSize: "12px", fontStyle: "normal" }}>
                {t("workingDays")}
              </em>
            </MenuItem>
            <MenuItem value={"N"} style={{ fontSize: "12px" }}>
              <em style={{ fontSize: "12px", fontStyle: "normal" }}>
                {t("calenderDays")}
              </em>
            </MenuItem>
          </Select>
        </div>
        <div className="onExpiryDivSection">
          <p
            className="onExpiryLabel"
            style={{
              marginRight: direction == RTL_DIRECTION ? "0px" : "16px",
              marginLeft: direction == RTL_DIRECTION ? "16px" : "0px",
            }}
          >
            {t("onExpiry")}
          </p>
          <FormControl>
            <Select
              disabled={expireStatus == t("neverExpires") || isProcessReadOnly}
              inputProps={{ "aria-label": "Without label" }}
              value={routeTo}
              onChange={(e) => routeToHandler(e)}
              displayEmpty
              className="time_Options"
              style={{ marginLeft: "16px" }}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              <MenuItem value={t("previousStage")}>
                <em style={{ fontSize: "12px", fontStyle: "normal" }}>
                  {t("previousStage")}
                </em>
              </MenuItem>
              {loadedProcessData.value.MileStones.map((mile) => {
                return mile.Activities.map((activity) => {
                  if (activity.ActivityName !== props.cellName)
                    return (
                      <MenuItem
                        style={{ fontSize: "12px" }}
                        value={activity.ActivityName}
                      >
                        {activity.ActivityName}
                      </MenuItem>
                    );
                });
              })}
            </Select>
          </FormControl>
        </div>
        <div className="triggerDivSection">
          <p className="triggerLabel">{t("trigger")}</p>
          <FormControlLabel
            control={
              <Checkbox
                disabled={
                  expireStatus == t("neverExpires") || isProcessReadOnly
                }
                checked={triggerCheckValue}
                onChange={() => {
                  setTriggerCheckValue(!triggerCheckValue);
                  clearTriggerValues();
                }}
                size="small"
                style={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  marginTop: "8px",
                }}
              />
            }
          />
          <FormControl>
            <Select
              disabled={
                expireStatus == t("neverExpires") ||
                !triggerCheckValue ||
                isProcessReadOnly
              }
              inputProps={{ "aria-label": "Without label" }}
              value={selectedTrigger}
              onChange={(e) => {
                setSelectedTrigger(e.target.value);
                setActivityPropertyData(
                  e.target.value,
                  "expiryInfo",
                  "triggerName",
                  "",
                  ""
                );
              }}
              displayEmpty
              className="time_Options"
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              {loadedProcessData.value.TriggerList.map((trigger) => {
                return (
                  <MenuItem
                    style={{ fontSize: "12px" }}
                    value={trigger.TriggerName}
                  >
                    {trigger.TriggerName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={turnAroundCheckValue}
                onChange={() => {
                  setTurnAroundCheckValue(!turnAroundCheckValue);
                  clearTurnAroundTimeValues();
                }}
                disabled={
                  expireStatus == t("neverExpires") || isProcessReadOnly
                }
                size="small"
                style={{ fontSize: "10px", marginLeft: "8px" }}
              />
            }
          />
          <span className="turnAroundTimeLabel">{t("turnAroundTime")}</span>
          <div className="optionsTab_timeMapping">
            <div>
              <div className="options_time">
                <span
                  className="options_days"
                  style={{
                    marginRight: direction == RTL_DIRECTION ? "0px" : "14px",
                    marginLeft: direction == RTL_DIRECTION ? "14px" : "0px",
                  }}
                >
                  {t("days")}
                </span>
                <SelectWithInput
                  dropdownOptions={filteredVarList}
                  showError={true}
                  optionKey="VariableName"
                  setValue={(val) => {
                    setTurnAroundDays(val);
                    setActivityPropertyData(
                      !isNaN(val) ? val : val?.VariableName,
                      "tatInfo",
                      "wfDays",
                      "varFieldId_Days",
                      "variableId_Days"
                    );
                  }}
                  value={turnAroundDays}
                  isConstant={!isNaN(turnAroundDays)}
                  inputClass="selectWithInputTextField_WS"
                  constantInputClass="multiSelectConstInput_WS"
                  selectWithInput="selectWithInput_WS"
                  showEmptyString={false}
                  showConstValue={true}
                  disabled={!turnAroundCheckValue || isProcessReadOnly}
                  id="turnDays_select_input"
                />
              </div>
              <div className="options_time">
                <span
                  className="options_hours"
                  style={{
                    marginRight: direction == RTL_DIRECTION ? "0px" : "8px",
                    marginLeft: direction == RTL_DIRECTION ? "8px" : "0px",
                  }}
                >
                  {t("Hour(s)")}
                </span>
                <SelectWithInput
                  dropdownOptions={filteredVarList}
                  showError={true}
                  optionKey="VariableName"
                  setValue={(val) => {
                    setTurnAroundHours(val);
                    let tempObj = { ...tatErrorObj };
                    if (!isNaN(val)) {
                      if (val > 24) {
                        tempObj.hours = true;
                      } else {
                        tempObj.hours = false;
                      }
                    } else {
                      tempObj.hours = false;
                    }
                    setTatErrorObj(tempObj);
                    if (!tempObj.hours) {
                      setActivityPropertyData(
                        !isNaN(val) ? val : val?.VariableName,
                        "tatInfo",
                        "wfHours",
                        "varFieldId_Hours",
                        "variableId_Hours"
                      );
                    }
                  }}
                  value={turnAroundHours}
                  isConstant={!isNaN(turnAroundHours)}
                  inputClass="selectWithInputTextField_WS"
                  constantInputClass="multiSelectConstInput_WS"
                  selectWithInput="selectWithInput_WS"
                  showEmptyString={false}
                  showConstValue={true}
                  disabled={!turnAroundCheckValue || isProcessReadOnly}
                  id="turnHours_select_input"
                />
              </div>
              {turnAroundHours > 24 ? (
                <p
                  style={{
                    fontSize: "10px",
                    color: "red",
                    margin: "-7px 0px 5px 110px",
                  }}
                >
                  Value must lie in the range of 0-24
                </p>
              ) : null}
              <div className="options_time">
                <span
                  className="options_minutes"
                  style={{
                    marginRight: direction == RTL_DIRECTION ? "0px" : "16px",
                    marginLeft: direction == RTL_DIRECTION ? "16px" : "0px",
                  }}
                >
                  {t("minutes")}
                </span>
                <SelectWithInput
                  dropdownOptions={filteredVarList}
                  showError={true}
                  optionKey="VariableName"
                  setValue={(val) => {
                    setTurnAroundMinutes(val);
                    let tempObj = { ...tatErrorObj };
                    if (!isNaN(val)) {
                      if (val > 60) {
                        tempObj.minutes = true;
                      } else {
                        tempObj.minutes = false;
                      }
                    } else {
                      tempObj.minutes = false;
                    }
                    setTatErrorObj(tempObj);
                    if (!tempObj.minutes) {
                      setActivityPropertyData(
                        !isNaN(val) ? val : val?.VariableName,
                        "tatInfo",
                        "wfMinutes",
                        "varFieldId_Minutes",
                        "variableId_Minutes"
                      );
                    }
                  }}
                  value={turnAroundMinutes}
                  isConstant={!isNaN(turnAroundMinutes)}
                  inputClass="selectWithInputTextField_WS"
                  constantInputClass="multiSelectConstInput_WS"
                  selectWithInput="selectWithInput_WS"
                  showEmptyString={false}
                  showConstValue={true}
                  disabled={!turnAroundCheckValue || isProcessReadOnly}
                  id="turnMins_select_input"
                />
              </div>
              {turnAroundMinutes > 60 ? (
                <p
                  style={{
                    fontSize: "10px",
                    color: "red",
                    margin: "-7px 0px 5px 110px",
                  }}
                >
                  Value must lie in the range of 0-60
                </p>
              ) : null}
              <div className="options_time">
                <span
                  className="options_seconds"
                  style={{
                    marginRight: direction == RTL_DIRECTION ? "0px" : "14px",
                    marginLeft: direction == RTL_DIRECTION ? "14px" : "0px",
                  }}
                >
                  {t("seconds")}
                </span>
                <SelectWithInput
                  dropdownOptions={filteredVarList}
                  showError={true}
                  optionKey="VariableName"
                  setValue={(val) => {
                    setTurnAroundSeconds(val);
                    let tempObj = { ...tatErrorObj };
                    if (!isNaN(val)) {
                      if (val > 60) {
                        tempObj.seconds = true;
                      } else {
                        tempObj.seconds = false;
                      }
                    } else {
                      tempObj.seconds = false;
                    }
                    setTatErrorObj(tempObj);
                    if (!tempObj.seconds) {
                      setActivityPropertyData(
                        !isNaN(val) ? val : val?.VariableName,
                        "tatInfo",
                        "wfSeconds",
                        "varFieldId_Seconds",
                        "variableId_Seconds"
                      );
                    }
                  }}
                  value={turnAroundSeconds}
                  isConstant={!isNaN(turnAroundSeconds)}
                  inputClass="selectWithInputTextField_WS"
                  constantInputClass="multiSelectConstInput_WS"
                  selectWithInput="selectWithInput_WS"
                  showEmptyString={false}
                  showConstValue={true}
                  disabled={!turnAroundCheckValue || isProcessReadOnly}
                  id="turnSecs_select_input"
                />
              </div>
              {turnAroundSeconds > 60 ? (
                <p
                  style={{
                    fontSize: "10px",
                    color: "red",
                    margin: "-7px 0px 5px 110px",
                  }}
                >
                  Value must lie in the range of 0-60
                </p>
              ) : null}
            </div>
            <Select
              disabled={
                expireStatus == t("neverExpires") ||
                !turnAroundCheckValue ||
                isProcessReadOnly
              }
              inputProps={{ "aria-label": "Without label" }}
              value={tatInfoDaysType}
              onChange={(e) => tatInfoDaysTypeHandler(e)}
              displayEmpty
              style={{
                marginLeft: direction == RTL_DIRECTION ? "0px" : "50px",
                marginRight: direction == RTL_DIRECTION ? "50px" : "0px",
              }}
              className="time_Options"
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              <MenuItem value={"Y"}>
                <em style={{ fontSize: "12px", fontStyle: "normal" }}>
                  {t("workingDays")}
                </em>
              </MenuItem>
              <MenuItem value={"N"} style={{ fontSize: "12px" }}>
                <em style={{ fontSize: "12px", fontStyle: "normal" }}>
                  {t("calenderDays")}
                </em>
              </MenuItem>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps, null)(Options);
