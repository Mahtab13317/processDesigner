import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import "./index.css";
import { useTranslation } from "react-i18next";
import { connect, useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { store, useGlobalState } from "state-pool";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  DATE_VARIABLE_TYPE,
  PROCESSTYPE_LOCAL,
  propertiesLabel,
  COMPLEX_VARTYPE,
} from "../../../../Constants/appConstants.js";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import Field from "../../../../UI/InputFields/TextField/Field.js";
import TurnAroundTime from "../../../../UI/InputFields/TurnAroundTime/TurnAroundTime.js";
import { OpenProcessSliceValue } from "../../../../redux-store/slices/OpenProcessSlice";
import { getVariableBasedOnScopeAndTypes } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";
import { getVariableIdByName } from "./../../../../utility/CommonFunctionCall/CommonFunctionCall";

import TabsHeading from "../../../../UI/TabsHeading";
import { isProcessDeployedFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

const makeFieldInputs = (value) => {
  return {
    value: value,
    error: false,
    helperText: "",
    isConstant: false,
  };
};

const useStyles = makeStyles((props) => ({
  input: {
    height: "var(--line_height)",
  },
  inputWithError: {
    height: "var(--line_height)",
    width: "4.875rem",
  },
  errorStatement: {
    color: "red",
    fontSize: "11px",
  },
  mainDiv: {
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    height: "64vh",
    fontFamily: "Open Sans",
    width: "100%",
    //  paddingTop: props.isDrawerExpanded ? "0" : "0.4rem",
    direction: props.direction,
    "&::-webkit-scrollbar": {
      backgroundColor: "transparent",
      width: "0.375rem",
      height: "1.125rem",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
      borderRadius: "0.313rem",
    },

    "&:hover::-webkit-scrollbar": {
      overflowY: "visible",
      width: "0.375rem",
      height: "1.125rem",
    },
    "&:hover::-webkit-scrollbar-thumb": {
      background: "#8c8c8c 0% 0% no-repeat padding-box",
      borderRadius: "0.313rem",
    },
  },
  GroupTitleMain: {
    fontWeight: 700,
    color: "#606060",
    fontSize: "var(--subtitle_text_font_size)",
  },
  btnIcon: {
    cursor: "pointer",
    height: "28px",
    width: "28px",
    border: "1px solid #CECECE",
  },
  GroupTitleSecondary: {
    fontWeight: 600,
    color: "#000000",
    fontSize: "var(--subtitle_text_font_size)",
  },
  disabled: {
    pointerEvents: "none",
    opacity: 0.5,
  },
}));

function TaskOptions(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const classes = useStyles({ ...props, direction });
  const localActivityPropertyData = store.getState("activityPropertyData");
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const openProcessData = useSelector(OpenProcessSliceValue);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(localActivityPropertyData);

  const [spinner, setspinner] = useState(true);
  const [expiresOn, setExpiresOn] = useState(makeFieldInputs(""));
  const [operator, setOperator] = useState(makeFieldInputs(""));
  const [actionOnUser, setActionOnUser] = useState(makeFieldInputs(""));
  const [trigger, setTrigger] = useState(makeFieldInputs(""));
  const [expiryType, setExpiryType] = useState("");
  const [actionType, setActionType] = useState("");
  const [allDateTypeVars, setDateTypeVars] = useState([]);
  const [triggersList, setTriggersList] = useState([]);
  let isReadOnly = isProcessDeployedFunc(localLoadedProcessData);

  const [TATData, setTATData] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    calendarType: "",
    isDaysConstant: false,
    isHoursConstant: false,
    isMinutesConstant: false,
    variableId_Days: "",
    variableId_Hours: "",
    variableId_Minutes: "",
    error: {},
  });

  const radioButtonsArrayForExpiresOn = [
    { label: t("neverExpires"), value: "1" },
    { label: t("expires"), value: "2" },
  ];

  const radioButtonsArrayForAction = [
    { label: t("revoke"), value: "1" },
    { label: t("reassignTo"), value: "2" },
  ];

  // Function that runs when the component loads.
  useEffect(() => {
    if (openProcessData.loadedData) {
      let temp = JSON.parse(JSON.stringify(openProcessData.loadedData));
      let triggerList = [];
      temp?.TriggerList?.forEach((element) => {
        triggerList.push({
          name: element.TriggerName,
          value: element.TriggerId,
        });
      });
      setTriggersList(triggerList);
    }
  }, [openProcessData.loadedData]);

  useEffect(() => {
    if (localLoadedActivityPropertyData) {
      const optionObj =
        localLoadedActivityPropertyData.taskGenPropInfo?.m_objOptionsView
          ?.m_objOptionInfo || {};
      const expiryInfoObj = optionObj?.expiryInfo || {};
      const expiryTypeOperation = expiryInfoObj?.expFlag || "";
      setExpiryType(expiryTypeOperation ? "2" : "1");
      setExpiresOn({
        ...expiresOn,
        value: expiryInfoObj?.holdTillVar || "",
      });
      setOperator({
        ...operator,
        value: expiryInfoObj?.expiryOperator || "",
      });

      setTrigger({ ...trigger, value: expiryInfoObj?.triggerId || "" });

      const newTurnAroundValues = {
        ...TATData,
        days: expiryInfoObj?.wfDays || 0,
        hours: expiryInfoObj?.wfHours || 0,
        minutes: expiryInfoObj?.wfMinutes || 0,
        calendarType: expiryInfoObj?.expCalFlag,
        isDaysConstant: expiryInfoObj && expiryInfoObj.variableId_Days === "0",
        isHoursConstant:
          expiryInfoObj && expiryInfoObj.variableId_Hours === "0",
        isMinutesConstant:
          expiryInfoObj && expiryInfoObj.variableId_Minutes === "0",
        variableId_Days: expiryInfoObj?.variableId_Days || "0",
        variableId_Hours: expiryInfoObj?.variableId_Hours || "0",
        variableId_Minutes: expiryInfoObj?.variableId_Minutes | "0",
      };

      setTATData(newTurnAroundValues);

      setActionType(expiryInfoObj?.expiryOperation || "");
      if (expiryInfoObj?.expiryOperation === "2") {
        if (expiryInfoObj?.m_bUserConst) {
          setActionOnUser({
            ...actionOnUser,
            isConstant: true,
            value: expiryInfoObj?.m_strUserConst || "",
          });
        } else {
          setActionOnUser({
            ...actionOnUser,
            isConstant: false,
            value: expiryInfoObj?.userValue || "",
          });
        }
      }

      setspinner(false);
    }
  }, [localLoadedActivityPropertyData]);

  //getting complex variables
  /*const getComplex = (variable) => {
    let varList = [];
    let varRelationMapArr = variable?.RelationAndMapping
      ? variable.RelationAndMapping
      : variable["Relation&Mapping"];
    varRelationMapArr?.Mappings?.Mapping?.forEach((el) => {
      if (el.VariableType === "11") {
        let tempList = getComplex(el);
        tempList.forEach((ell) => {
          varList.push({
            ...ell,
            SystemDefinedName: `${variable.VariableName}.${ell.VariableName}`,
            VariableName: `${variable.VariableName}.${ell.VariableName}`,
          });
        });
      } else {
        varList.push({
          DefaultValue: "",
          ExtObjectId: el.ExtObjectId ? el.ExtObjectId : variable.ExtObjectId,
          SystemDefinedName: `${variable.VariableName}.${el.VariableName}`,
          Unbounded: el.Unbounded,
          VarFieldId: el.VarFieldId,
          VarPrecision: el.VarPrecision,
          VariableId: el.VariableId,
          VariableLength: el.VariableLength,
          VariableName: `${variable.VariableName}.${el.VariableName}`,
          VariableScope: el.VariableScope
            ? el.VariableScope
            : variable.VariableScope,
          VariableType: el.VariableType,
        });
      }
    });
    return varList;
  };
*/
  const getDisplayNameForSysDefVars = (key) => {
    const varNames = {
      CreatedDateTime: "Workitem Creation Date Time",
      EntryDateTime: "Case/Activity Initiation Date Time",
      IntroductionDateTime: "Workitem Introduction Date Time",
      TurnAroundDateTime: "SLA Date Time",
      ValidTillDateTime: "Workitem Expiry Date Time",
    };
    if (varNames[key]) {
      return varNames[key];
    }
    return key;
  };

  useEffect(() => {
    if (localLoadedProcessData?.Variable) {
      let dateVars = localLoadedProcessData.Variable.filter(
        (variable) => +variable.VariableType === DATE_VARIABLE_TYPE
      );

      dateVars = dateVars.map((variable) => ({
        name: getDisplayNameForSysDefVars(variable.VariableName),
        value: variable.VariableName,
      }));
      const hardCodeVars = [
        { name: "Task Due Date", value: "TaskDueDate" },
        { name: "Task Initiation Date Time", value: "TaskEntryDateTime" },
      ];
      setDateTypeVars([...dateVars, ...hardCodeVars]);
    }
  }, [localLoadedProcessData?.Variable]);

  useEffect(() => {
    if (saveCancelStatus.SaveClicked === true) {
      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked]);

  const handleChange = (e) => {
    const tempPropData = { ...localLoadedActivityPropertyData };
    tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo =
      localLoadedActivityPropertyData?.taskGenPropInfo?.m_objOptionsView
        ?.m_objOptionInfo?.expiryInfo
        ? {
            ...localLoadedActivityPropertyData.taskGenPropInfo.m_objOptionsView
              .m_objOptionInfo.expiryInfo,
          }
        : {};

    const { name, value } = e.target;
    switch (name) {
      case "ExpiresOn":
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.holdTillVar =
          value;
        break;
      case "Operator":
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.expiryOperator =
          value;

        break;
      case "Trigger":
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.triggerId =
          value;
        break;
      /* case "ActionOnUser":
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.userValue =
          value;
        break;*/
      case "ExpiryType":
        if (value == "1") {
          tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.expFlag = false;
        } else {
          tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.expFlag = true;
        }
        setExpiryType(value);
        break;
      case "ActionType":
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.expiryOperation =
          value;
        if (value == "1") {
          tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.m_bUserConst = true;
        }
        break;

      default:
        break;
    }

    setlocalLoadedActivityPropertyData(tempPropData);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskOptions]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };
  const handleChangeActionUser = (name, value) => {
    const tempPropData = { ...localLoadedActivityPropertyData };
    tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo =
      localLoadedActivityPropertyData?.taskGenPropInfo?.m_objOptionsView
        ?.m_objOptionInfo?.expiryInfo
        ? {
            ...localLoadedActivityPropertyData.taskGenPropInfo.m_objOptionsView
              .m_objOptionInfo.expiryInfo,
          }
        : {};

    if (name === "ActionOnUser") {
      if (
        tempPropData.taskGenPropInfo?.m_objOptionsView?.m_objOptionInfo
          ?.expiryInfo?.m_bUserConst
      ) {
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.m_strUserConst =
          value;
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.m_SelectedUser =
          "<None>";
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.m_bUserConst = true;
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.userValue =
          null;
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.userType =
          "C";
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.variableId =
          null;
      } else {
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.m_strUserConst =
          "";
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.m_SelectedUser =
          "";
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.m_bUserConst = false;
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.userValue =
          value.VariableName;
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.userType =
          "V";
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.variableId =
          getVariableIdByName({
            variables: localLoadedProcessData?.Variable,
            name: value.VariableName,
          });
      }
    } else if (name === "isActionUserConstant") {
      tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.m_bUserConst =
        value;
      if (value) {
        tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo.m_SelectedUser =
          "<None>";
      }
    }
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskOptions]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };

  const onChangeTATData = (name, value) => {
    let newData = { ...TATData };
    newData[name] = value;
    if (typeof value === "object" || name === "calendarType") {
      let wfDays = newData.days;
      let wfMinutes = newData.minutes;
      let wfHours = newData.hours;
      if (name === "hours") {
        newData["variableId_Hours"] = value?.VariableId;
        wfHours = value?.VariableName;
        wfMinutes = newData?.minutes;
        wfDays = newData?.days;
      } else if (name === "minutes") {
        newData["variableId_Minutes"] = value?.VariableId;
        wfMinutes = value?.VariableName;
        wfHours = newData?.hours;
        wfDays = newData?.days;
      } else if (name === "days") {
        newData["variableId_Days"] = value?.VariableId;
        wfDays = value?.VariableName;
        wfHours = newData?.hours;
        wfMinutes = newData?.minutes;
      }

      const tempPropData = { ...localLoadedActivityPropertyData };
      const expiryInfoObj =
        localLoadedActivityPropertyData.taskGenPropInfo?.m_objOptionsView
          ?.m_objOptionInfo?.expiryInfo || {};
      tempPropData.taskGenPropInfo.m_objOptionsView.m_objOptionInfo.expiryInfo =
        {
          ...expiryInfoObj,
          wfDays: wfDays || 0,
          wfHours: wfHours || 0,
          wfMinutes: wfMinutes || 0,
          expCalFlag: newData.calendarType,
          variableId_Days: newData?.variableId_Days || "0",
          variableId_Hours: newData?.variableId_Hours || "0",
          variableId_Minutes: newData?.variableId_Minutes || "0",
        };

      setlocalLoadedActivityPropertyData(tempPropData);
    }
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskOptions]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };

  return (
    <>
      <TabsHeading heading={props?.heading} />
      <Grid container direction="column">
        <Grid item style={{ paddingBottom: "1.5rem" }}>
          <div style={{ width: "100%", height: "100%" }}>
            <hr style={{ opacity: "0.5", width: "100%" }} />
            {spinner ? (
              <CircularProgress
                style={{ marginTop: "30vh", marginLeft: "40%" }}
              />
            ) : (
              <div
                className={classes.mainDiv}
                style={{
                  flexDirection: props.isDrawerExpanded ? "row" : "column",
                }}
              >
                <div
                  style={{
                    marginLeft: "0.8rem",
                    marginRight: "0.8rem",
                    height: "100%",
                    marginBottom: "0.9rem",
                    width: props.isDrawerExpanded ? "90%" : null,
                    paddingTop: props.isDrawerExpanded ? "0.6rem" : "0.2rem",
                  }}
                >
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Field
                        radio={true}
                        ButtonsArray={radioButtonsArrayForExpiresOn}
                        name="ExpiryType"
                        label={`${t("expiry")} ${t("type")}`}
                        value={expiryType}
                        onChange={handleChange}
                        disabled={isReadOnly}
                      />
                    </Grid>

                    <Grid item>
                      <Typography
                        component="h5"
                        className={classes.GroupTitleSecondary}
                      >
                        {`${t("expiry")} ${t("details")}`}
                      </Typography>
                    </Grid>

                    <Grid item xs>
                      <Grid
                        container
                        direction={props.isDrawerExpanded ? "row" : "column"}
                        spacing={1}
                        alignItems={
                          props.isDrawerExpanded ? "flex-start" : null
                        }
                      >
                        <Grid
                          item
                          container
                          xs={props.isDrawerExpanded ? 3 : 12}
                          spacing={1}
                          alignItems={"flex-end"}
                          className={expiryType == "1" ? classes.disabled : ""}
                        >
                          <Grid item xs>
                            <Field
                              dropdown={true}
                              name="ExpiresOn"
                              label={t("expiresOn")}
                              value={expiresOn.value}
                              onChange={handleChange}
                              options={allDateTypeVars}
                              disabled={isReadOnly}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <Field
                              dropdown={true}
                              name="Operator"
                              value={operator.value}
                              onChange={handleChange}
                              options={[
                                { name: "+", value: "11" },
                                { name: "-", value: "12" },
                              ]}
                              disabled={isReadOnly}
                            />
                          </Grid>
                        </Grid>

                        <Grid
                          item
                          xs={props.isDrawerExpanded ? 9 : 12}
                          style={{
                            marginTop: props.isDrawerExpanded ? "1.1rem" : null,
                          }}
                          className={expiryType == "1" ? classes.disabled : ""}
                        >
                          <TurnAroundTime
                            selectCombo={true}
                            days={TATData.days || 0}
                            hours={TATData.hours || 0}
                            minutes={TATData.minutes || 0}
                            calendarType={TATData.calendarType || ""}
                            isDaysConstant={TATData.isDaysConstant}
                            isMinutesConstant={TATData.isMinutesConstant}
                            isHoursConstant={TATData.isHoursConstant}
                            handleChange={onChangeTATData}
                            disabled={isReadOnly}
                            inputClass={
                              props.isDrawerExpanded
                                ? "selectWithInputTextField_WS_Expanded"
                                : "selectWithInputTextField_WS"
                            }
                            constantInputClass={
                              props.isDrawerExpanded
                                ? "multiSelectConstInput_WS_Expanded"
                                : "multiSelectConstInput_WS"
                            }
                            selectWithInput={
                              props.isDrawerExpanded
                                ? "selectWithInput_WS_Expanded"
                                : "selectWithInput_WS"
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Typography
                        component="h5"
                        className={classes.GroupTitleSecondary}
                      >
                        {`${t("action")}`}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      className={expiryType == "1" ? classes.disabled : ""}
                    >
                      <Field
                        radio={true}
                        ButtonsArray={radioButtonsArrayForAction}
                        name="ActionType"
                        value={actionType}
                        disabled={isReadOnly}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={props.isDrawerExpanded ? 8 : 12}>
                      <Field
                        selectCombo={true}
                        name="ActionOnUser"
                        dropdown={true}
                        value={actionOnUser.value}
                        optionKey="VariableName"
                        setIsConstant={(val) => {
                          handleChangeActionUser("isActionUserConstant", val);
                        }}
                        setValue={(val) => {
                          handleChangeActionUser("ActionOnUser", val);
                        }}
                        isConstant={actionOnUser.isConstant}
                        showEmptyString={false}
                        showConstValue={true}
                        onChange={handleChange}
                        disabled={actionType === "Revoke" || isReadOnly}
                        /* options={[
                        { name: "Case Manager", value: "CaseManager" },
                        { name: "Task Initiator", value: "TaskInitiator" },
                      ]}*/
                        dropdownOptions={getVariableBasedOnScopeAndTypes({
                          scopes: ["U", "I"],
                          types: [10],
                          variables: localLoadedProcessData?.Variable,
                        })}
                      />
                    </Grid>

                    <Grid item>
                      <Typography
                        component="h5"
                        className={classes.GroupTitleSecondary}
                      >
                        {`${t("trigger")}`}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={props.isDrawerExpanded ? 8 : 12}
                      className={expiryType == "1" ? classes.disabled : ""}
                    >
                      <Field
                        name="Trigger"
                        dropdown={true}
                        value={trigger.value}
                        onChange={handleChange}
                        options={triggersList}
                        disabled={isReadOnly}
                      />
                    </Grid>
                  </Grid>
                </div>
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};
export default connect(mapStateToProps, null)(TaskOptions);
