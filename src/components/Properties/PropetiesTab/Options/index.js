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
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const isProcessReadOnly = props.openProcessType !== PROCESSTYPE_LOCAL;
  const [expireStatus, setExpireStatus] = useState(t("neverExpires"));
  const [dateTime, setDateTime] = useState(null);
  const dispatch = useDispatch();
  const [operatorType, setOperatorType] = useState(null);
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
  const [daysType, setDaysType] = useState(null);
  const [routeTo, setRouteTo] = useState(null);
  const [triggerCheckValue, setTriggerCheckValue] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState();
  const [turnAroundCheckValue, setTurnAroundCheckValue] = useState(
    tatInfo?.tatFlag
  );
  const [variableDefinition] = useGlobalState("variableDefinition");
  const loadedProcessData = store.getState("loadedProcessData");
  const [isFromConstant, setIsFromConstant] = useState(true);
  const [anyError, setAnyError] = useState(false);
  const expireStatusHandler = (event) => {
    setExpireStatus(event.target.value);
    let tempLocalState = { ...localLoadedActivityPropertyData };
    let expireStatus =
      localLoadedActivityPropertyData?.ActivityProperty?.optionInfo;
    // forwardIncomingDocsList &&
    //   forwardIncomingDocsList.map((document, index) => {
    //     if (document.ImportedFieldName == variablesToDelete.ImportedFieldName) {
    //       forwardIncomingDocsList.splice(index, 1);
    //     }
    //   });
    // tempLocalState.ActivityProperty.SubProcess.ForwardMapping.MappedDocument = [
    //   ...forwardIncomingDocsList,
    // ];
    // setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const setDateTimeHandler = (event) => {
    setDateTime(event.target.value);
    let tempLocalState = { ...localLoadedActivityPropertyData };
    tempLocalState.ActivityProperty.optionInfo.expiryInfo.holdTillVar =
      event.target.value;
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const operatorTypeHandler = (e) => {
    setOperatorType(e.target.value);
    let tempLocalState = { ...localLoadedActivityPropertyData };
    e.target.value == "+"
      ? (tempLocalState.ActivityProperty.optionInfo.expiryInfo.expiryOperator =
          "11")
      : (tempLocalState.ActivityProperty.optionInfo.expiryInfo.expiryOperator =
          "12");
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const daysTypeHandler = (e) => {
    setDaysType(e.target.value);
    let tempLocalState = { ...localLoadedActivityPropertyData };
    e.target.value == "Working Days"
      ? (tempLocalState.ActivityProperty.optionInfo.expiryInfo.expCalFlag = "Y")
      : (tempLocalState.ActivityProperty.optionInfo.expiryInfo.expCalFlag =
          "N");
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const routeToHandler = (e) => {
    setRouteTo(e.target.value);
    let tempLocalState = { ...localLoadedActivityPropertyData };
    tempLocalState.ActivityProperty.optionInfo.expiryInfo.expiryActivity =
      e.target.value;
    setlocalLoadedActivityPropertyData(tempLocalState);
    // dispatch(
    //   setActivityPropertyChange({
    //     Options: { isModified: true, hasError: false },
    //   })
    // );
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

    setOperatorType(
      localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.expiryInfo
        ?.expiryOperator == "11"
        ? "+"
        : "-"
    );

    setDaysType(
      localLoadedActivityPropertyData?.ActivityProperty?.optionInfo?.expiryInfo
        ?.expCalFlag == "Y"
        ? "Working Days"
        : "Calender Days"
    );
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    let temp = JSON.parse(JSON.stringify(tabStatus));
    console.log("ERROS", errorsObj);
    // if (Object.values(errorsObj).includes(true)) {
    //   temp.Options.hasError = true;

    //   console.log("ASDF1234", temp);
    //   dispatch(setActivityPropertyChange(temp));
    // } else {
    //   temp.Options.hasError = false;
    //   dispatch(setActivityPropertyChange(temp));
    // }
  }, [errorsObj]);

  // useEffect(() => {
  //   if (tabStatus.Options.hasError) {
  //     setErrorsObj({ hours: true, minutes: true, seconds: true });
  //   }
  // }, [tabStatus.Options.hasError]);

  return (
    <div id="OptionsTab">
      <div>
        <RadioGroup
          defaultValue={t("neverExpires")}
          onChange={(e) => expireStatusHandler(e)}
          row={true}
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
              {variableDefinition.map((variable) => {
                if (variable.VariableType == 8) {
                  return (
                    <MenuItem value={variable.VariableName}>
                      <em style={{ fontSize: "12px", fontStyle: "normal" }}>
                        {variable.VariableName}
                      </em>
                    </MenuItem>
                  );
                }
              })}
            </Select>
          </FormControl>
          <FormControl>
            <Select
              disabled={expireStatus == t("neverExpires") || isProcessReadOnly}
              inputProps={{ "aria-label": "Without label" }}
              value={operatorType}
              onChange={(e) => operatorTypeHandler(e)}
              displayEmpty
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
              <MenuItem style={{ fontSize: "12px" }} value="+">
                +
              </MenuItem>
              <MenuItem style={{ fontSize: "12px" }} value="-">
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
                dropdownOptions={variableDefinition.filter((variable) => {
                  return variable.VariableType === 3;
                })}
                showError={true}
                optionKey="VariableName"
                setIsConstant={setIsFromConstant}
                setValue={(val) => {
                  setDays(val);
                  let tempLocalState = { ...localLoadedActivityPropertyData };
                  tempLocalState.ActivityProperty.optionInfo.expiryInfo.wfDays =
                    val;
                  setlocalLoadedActivityPropertyData(tempLocalState);
                }}
                value={days}
                isConstant={isFromConstant}
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
                dropdownOptions={variableDefinition.filter((variable) => {
                  return variable.VariableType == 3;
                })}
                optionKey="VariableName"
                setIsConstant={setIsFromConstant}
                setValue={(val) => {
                  setHours(val);
                  let tempLocalState = { ...localLoadedActivityPropertyData };
                  tempLocalState.ActivityProperty.optionInfo.expiryInfo.wfHours =
                    val;
                  setlocalLoadedActivityPropertyData(tempLocalState);
                  let tempObj = { ...errorsObj };
                  if (val > 24) {
                    tempObj.hours = true;
                  } else {
                    tempObj.hours = false;
                  }
                  setErrorsObj(tempObj);
                }}
                showError={true}
                value={hours}
                isConstant={isFromConstant}
                inputClass="selectWithInputTextField_WS"
                constantInputClass="multiSelectConstInput_WS"
                selectWithInput="selectWithInput_WS"
                showEmptyString={false}
                showConstValue={true}
                disabled={
                  expireStatus == t("neverExpires") || isProcessReadOnly
                }
                idTag="hours_select_input"
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
                dropdownOptions={variableDefinition.filter((variable) => {
                  return variable.VariableType == 3;
                })}
                showError={true}
                optionKey="VariableName"
                setIsConstant={setIsFromConstant}
                // setValue={(val) => {
                //   setMinutes(val);
                //   let tempLocalState = { ...localLoadedActivityPropertyData };
                //   tempLocalState.ActivityProperty.optionInfo.expiryInfo.wfMinutes =
                //     val;
                //   setlocalLoadedActivityPropertyData(tempLocalState);
                //   if(val>60){setErrorsObj(prev=> prev.minutes=true)}
                // }}

                setValue={(val) => {
                  setMinutes(val);
                  let tempLocalState = { ...localLoadedActivityPropertyData };
                  tempLocalState.ActivityProperty.optionInfo.expiryInfo.wfHours =
                    val;
                  setlocalLoadedActivityPropertyData(tempLocalState);
                  let tempObj = { ...errorsObj };
                  if (val > 60) {
                    tempObj.minutes = true;
                  } else {
                    tempObj.minutes = false;
                  }
                  setErrorsObj(tempObj);
                }}
                value={minutes}
                isConstant={isFromConstant}
                inputClass="selectWithInputTextField_WS"
                constantInputClass="multiSelectConstInput_WS"
                selectWithInput="selectWithInput_WS"
                showEmptyString={false}
                showConstValue={true}
                disabled={
                  expireStatus == t("neverExpires") || isProcessReadOnly
                }
                idTag="mins_select_input"
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
                dropdownOptions={variableDefinition.filter((variable) => {
                  return variable.VariableType == 3;
                })}
                showError={true}
                optionKey="VariableName"
                setIsConstant={setIsFromConstant}
                // setValue={(val) => {
                //   setSeconds(val);
                //   let tempLocalState = { ...localLoadedActivityPropertyData };
                //   tempLocalState.ActivityProperty.optionInfo.expiryInfo.wfSeconds =
                //     val;
                //   setlocalLoadedActivityPropertyData(tempLocalState);
                //   if(val>60){setErrorsObj(prev=> prev.seconds=true)}
                // }}

                setValue={(val) => {
                  setSeconds(val);
                  let tempLocalState = { ...localLoadedActivityPropertyData };
                  tempLocalState.ActivityProperty.optionInfo.expiryInfo.wfHours =
                    val;
                  setlocalLoadedActivityPropertyData(tempLocalState);
                  let tempObj = { ...errorsObj };
                  if (val > 60) {
                    tempObj.seconds = true;
                  } else {
                    tempObj.seconds = false;
                  }
                  setErrorsObj(tempObj);
                }}
                value={seconds}
                isConstant={isFromConstant}
                inputClass="selectWithInputTextField_WS"
                constantInputClass="multiSelectConstInput_WS"
                selectWithInput="selectWithInput_WS"
                showEmptyString={false}
                showConstValue={true}
                disabled={
                  expireStatus == t("neverExpires") || isProcessReadOnly
                }
                idTag="seconds_select_input"
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
            <MenuItem value={t("workingDays")}>
              <em style={{ fontSize: "12px", fontStyle: "normal" }}>
                {t("workingDays")}
              </em>
            </MenuItem>
            <MenuItem value={t("calenderDays")} style={{ fontSize: "12px" }}>
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
                check={triggerCheckValue}
                onChange={() => {
                  setTriggerCheckValue(!triggerCheckValue);
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
              onChange={(e) => setSelectedTrigger(e.target.value)}
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
                }}
                disabled={isProcessReadOnly}
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
                  dropdownOptions={variableDefinition.filter((variable) => {
                    return variable.VariableType == 3;
                  })}
                  showError={true}
                  optionKey="VariableName"
                  setIsConstant={setIsFromConstant}
                  setValue={(val) => {
                    setTurnAroundDays(val);
                    let tempLocalState = {
                      ...localLoadedActivityPropertyData,
                    };
                    tempLocalState.ActivityProperty.optionInfo.tatInfo.wfDays =
                      val;
                    setlocalLoadedActivityPropertyData(tempLocalState);
                  }}
                  value={turnAroundDays}
                  isConstant={isFromConstant}
                  inputClass="selectWithInputTextField_WS"
                  constantInputClass="multiSelectConstInput_WS"
                  selectWithInput="selectWithInput_WS"
                  showEmptyString={false}
                  showConstValue={true}
                  disabled={!turnAroundCheckValue || isProcessReadOnly}
                  idTag="turnDays_select_input"
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
                  dropdownOptions={variableDefinition.filter((variable) => {
                    return variable.VariableType == 3;
                  })}
                  showError={true}
                  optionKey="VariableName"
                  setIsConstant={setIsFromConstant}
                  setValue={(val) => {
                    setTurnAroundHours(val);
                    let tempLocalState = {
                      ...localLoadedActivityPropertyData,
                    };
                    tempLocalState.ActivityProperty.optionInfo.tatInfo.wfHours =
                      val;
                    setlocalLoadedActivityPropertyData(tempLocalState);
                  }}
                  value={turnAroundHours}
                  isConstant={isFromConstant}
                  inputClass="selectWithInputTextField_WS"
                  constantInputClass="multiSelectConstInput_WS"
                  selectWithInput="selectWithInput_WS"
                  showEmptyString={false}
                  showConstValue={true}
                  disabled={!turnAroundCheckValue || isProcessReadOnly}
                  idTag="turnHours_select_input"
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
                  dropdownOptions={variableDefinition.filter((variable) => {
                    return variable.VariableType == 3;
                  })}
                  showError={true}
                  optionKey="VariableName"
                  setIsConstant={setIsFromConstant}
                  setValue={(val) => {
                    setTurnAroundMinutes(val);
                    let tempLocalState = {
                      ...localLoadedActivityPropertyData,
                    };
                    tempLocalState.ActivityProperty.optionInfo.tatInfo.wfMinutes =
                      val;
                    setlocalLoadedActivityPropertyData(tempLocalState);
                  }}
                  value={turnAroundMinutes}
                  isConstant={isFromConstant}
                  inputClass="selectWithInputTextField_WS"
                  constantInputClass="multiSelectConstInput_WS"
                  selectWithInput="selectWithInput_WS"
                  showEmptyString={false}
                  showConstValue={true}
                  disabled={!turnAroundCheckValue || isProcessReadOnly}
                  idTag="turnMins_select_input"
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
                  dropdownOptions={variableDefinition.filter((variable) => {
                    return variable.VariableType == 3;
                  })}
                  showError={true}
                  optionKey="VariableName"
                  setIsConstant={setIsFromConstant}
                  setValue={(val) => {
                    setTurnAroundSeconds(val);
                    let tempLocalState = {
                      ...localLoadedActivityPropertyData,
                    };
                    tempLocalState.ActivityProperty.optionInfo.tatInfo.wfSeconds =
                      val;
                    setlocalLoadedActivityPropertyData(tempLocalState);
                  }}
                  value={turnAroundSeconds}
                  isConstant={isFromConstant}
                  inputClass="selectWithInputTextField_WS"
                  constantInputClass="multiSelectConstInput_WS"
                  selectWithInput="selectWithInput_WS"
                  showEmptyString={false}
                  showConstValue={true}
                  disabled={!turnAroundCheckValue || isProcessReadOnly}
                  idTag="turnSecs_select_input"
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
