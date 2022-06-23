import React, { useState, useEffect } from "react";
import { Button, Divider, Grid, Typography } from "@material-ui/core";
import "../../Properties.css";
import { useTranslation } from "react-i18next";

import { connect, useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";

import { store, useGlobalState } from "state-pool";
import * as actionCreators from "../../../../redux-store/actions/selectedCellActions";
import * as actionCreatorsDrawer from "../../../../redux-store/actions/Properties/showDrawerAction.js";

import CircularProgress from "@material-ui/core/CircularProgress";
import {
  DATE_VARIABLE_TYPE,
  PROCESSTYPE_LOCAL,
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants.js";
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import Field from "../../../../UI/InputFields/TextField/Field.js";
import TurnAroundTime from "../../../../UI/InputFields/TurnAroundTime/TurnAroundTime.js";
import styles from "./taskescalation.module.css";
import arabicStyles from "./taskescalationarabic.module.css";
import {
  getAllVariableOptions,
  getVariableIdByName,
  getVariablesByScopes,
  getVariableScopeByName,
} from "../../../../utility/CommonFunctionCall/CommonFunctionCall.js";
import {
  TRIGGER_PRIORITY_HIGH,
  TRIGGER_PRIORITY_LOW,
  TRIGGER_PRIORITY_MEDIUM,
} from "../../../../Constants/triggerConstants.js";
import { getSelectedCellType } from "../../../../utility/abstarctView/getSelectedCellType";
const makeFieldInputs = (value) => {
  return {
    value: value,
    error: false,
    helperText: "",
  };
};
const useStyles = makeStyles((props) => ({
  input: {
    height: "2.0625rem",
  },
  inputWithError: {
    height: "2.0625rem",
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
  },
  bold: {
    fontWeight: 700,
  },
}));
function TaskEscalationRules(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;

  const classes = useStyles({ ...props, direction });

  const tabStatus = useSelector(ActivityPropertyChangeValue);

  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked
  const localActivityPropertyData = store.getState("activityPropertyData");

  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [
    localLoadedActivityPropertyData,
    setlocalLoadedActivityPropertyData,
    updatelocalLoadedActivityPropertyData,
  ] = useGlobalState(localActivityPropertyData);

  const [spinner, setspinner] = useState(true);

  //rules related states
  const [addingRule, setAddingRule] = useState(false);
  const [modifyingRule, setModifyingRule] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [allRules, setAllRules] = useState([]);

  const [mailData, setMailData] = useState({
    subjectValInput: "",
    mailValue: "",
    isFromConstant: false,
    isToConstant: false,
    isCcConstant: false,
    isBccConstant: false,
    priorityInput: "",
    fromInput: "",
    toInput: "",
    ccInput: "",
    bccInput: "",
    error: {},
  });

  const [TATData, setTATData] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    calendarType: "",
    isDaysConstant: false,
    isHoursConstant: false,
    isMinutesConstant: false,
    error: {},
  });
  const priorityOpt = [
    t(TRIGGER_PRIORITY_LOW),
    t(TRIGGER_PRIORITY_MEDIUM),
    t(TRIGGER_PRIORITY_HIGH),
  ];

  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;
  const [allDateTypeVars, setDateTypeVars] = useState([]);

  const [escalateAfter, setEscalateAfter] = useState(
    makeFieldInputs({ param2: "", type2: "C", variableId_2: "0" })
  );

  const [subject, setSubject] = useState(
    makeFieldInputs({ includeVariable: "", content: "" })
  );
  const [msg, setMsg] = useState(
    makeFieldInputs({ includeVariable: "", content: "" })
  );

  const [isDisableTab, setisDisableTab] = useState(false);

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
        VariableName: variable.VariableName,
      }));
      const hardCodeVars = [
        {
          name: "Task Due Date",
          value: "TaskDueDate",
          VariableName: "TaskDueDate",
        },
        {
          name: "Task Initiation Date Time",
          value: "TaskEntryDateTime",
          VariableName: "TaskEntryDateTime",
        },
      ];
      setDateTypeVars([...dateVars, ...hardCodeVars]);
    }
  }, [localLoadedProcessData?.Variable]);

  useEffect(() => {
    if (
      localLoadedActivityPropertyData?.taskGenPropInfo?.m_objTaskRulesListInfo
    ) {
      const taskRules =
        localLoadedActivityPropertyData?.taskGenPropInfo?.m_objTaskRulesListInfo
          ?.esRuleList || [];
      setAllRules([...taskRules]);
      setspinner(false);
    }
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    if (localLoadedProcessData.ProcessType !== PROCESSTYPE_LOCAL) {
      setisDisableTab(true);
    }
  }, [localLoadedProcessData.ProcessType]);

  const getPriority = (id) => {
    const priorityVal = { 1: "Low", 2: "Medium", 3: "High" };
    if (priorityVal[id]) {
      return priorityVal[id];
    }
    return "";
  };
  const getPriorityNumber = (name) => {
    const priorityVal = { Low: 1, Medium: 2, High: 3 };
    if (priorityVal[name]) {
      return priorityVal[name];
    }
    return "";
  };
  const addNewRule = () => {
    props.expandDrawer(true);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.escalationRules]: {
          isModified: true,
          hasError: false,
        },
      })
    );

    const newRules = [...allRules];
    const ids = newRules.map((rule) => +rule.ruleId);
    const maxId = Math.max(...ids);

    const newRule = {
      ruleId: `${maxId + 1}`,
      ruleOpList: [
        {
          durationInfo: {
            varFieldIdDays: "0",
            varFieldIdHours: "0",
            varFieldIdMinutes: "0",
            varFieldIdSeconds: "0",
            variableIdDays: "0",
            variableIdHours: "0",
            variableIdMinutes: "0",
            variableIdSeconds: "0",

            paramDays: "",
            paramHours: "",
            paramMinutes: "",
            paramSeconds: "0",
          },
          mailTrigInfo: {
            mailInfo: {
              fromUser: "",
              variableIdFrom: "",
              varFieldIdFrom: "0",
              varFieldTypeFrom: "M",
              extObjIDFrom: "0",
              toUser: "",
              variableIdTo: "",
              varFieldIdTo: "0",
              varFieldTypeTo: "M",
              extObjIDTo: "0",
              ccUser: "",
              variableIdCC: "",
              varFieldIdCC: "0",
              varFieldTypeCC: "M",
              extObjIDCC: "0",
              bccUser: "",
              variableIdBCC: "",
              varFieldIdBCC: "0",
              varFieldTypeBCC: "M",
              extObjIDBCC: "0",
              subject: "",
              selectedSubject: "",
              selectedMessage: "",
              message: "",
              m_bFromConst: false,
              m_bToConst: false,
              m_bCcConst: false,
              m_bBCcConst: false,
              priority: "",
              variableIdPriority: "0",
              varFieldIdPriority: "0",
              varFieldTypePriority: "C",
              extObjIDPriority: "0",
              fromConstant: "",
              toConstant: "",
              ccConstant: "",
              bccConstant: "",
            },
            param2: "",
            type2: "S",
            variableId_2: "0",
            ruleCalFlag: "Y",
          },
        },
      ],
    };
    setAllRules([newRule, ...newRules]);
    setAddingRule(true);
    setSelectedRule(newRule);
  };
  const handleSelectedRule = (rule) => {
    props.expandDrawer(true);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.escalationRules]: {
          isModified: true,
          hasError: false,
        },
      })
    );

    const selRule = allRules.find(
      (ruleItem) => ruleItem.ruleId === rule.ruleId
    );
    if (selRule && Object.keys(selRule).length > 0) {
      setModifyingRule(true);
      const durationData = rule.ruleOpList[0]?.durationInfo || null;
      const mailData = rule.ruleOpList[0]?.mailTrigInfo?.mailInfo || null;

      setTATData({
        ...TATData,
        days: (durationData && durationData.paramDays) || 0,
        hours: (durationData && durationData.paramHours) || 0,
        minutes: (durationData && durationData.paramMinutes) || 0,
        calendarType: rule.ruleOpList[0]?.ruleCalFlag,
        isDaysConstant: durationData && durationData.variableIdDays === "0",
        isHoursConstant: durationData && durationData.variableIdHours === "0",
        isMinutesConstant:
          durationData && durationData.variableIdMinutes === "0",
      });

      if (mailData) {
        const fromInput =
          mailData.variableIdFrom === "0"
            ? mailData.fromConstant
            : mailData.fromUser;
        const toInput =
          mailData.variableIdTo === "0" ? mailData.toConstant : mailData.toUser;
        const bccInput =
          mailData.variableIdBCC === "0"
            ? mailData.bccConstant
            : mailData.bccUser;
        const ccInput =
          mailData.variableIdCC === "0" ? mailData.ccConstant : mailData.ccUser;

        setMailData({
          ...mailData,
          subjectValInput: "",
          mailValue: "",
          isFromConstant: mailData.variableIdFrom === "0",
          isToConstant: mailData.variableIdTo === "0",
          isCcConstant: mailData.variableIdCC === "0",
          isBccConstant: mailData.variableIdBCC === "0",
          priorityInput: getPriority(mailData.priority),
          fromInput: fromInput,
          toInput: toInput,
          ccInput: ccInput,
          bccInput: bccInput,
        });
      }
      const newEscalateAfterVal = {
        param2: rule.ruleOpList[0]?.param2 || "",
        type2: rule.ruleOpList[0]?.type2 || "C",
        variableId_2: rule.ruleOpList[0]?.variableId_2 || "0",
      };
      setEscalateAfter({
        ...escalateAfter,
        value: { ...newEscalateAfterVal },
      });
      const newSub = { ...subject };
      newSub["value"]["content"] = (mailData && mailData.subject) || "";

      setSubject({ ...newSub });
      const newMSG = { ...msg };
      newMSG["value"]["content"] = (mailData && mailData.message) || "";
      setMsg({ ...newMSG });
    } else {
      setAddingRule(true);
    }
    setSelectedRule(rule);
  };
  const addVarToSubContent = () => {
    if (subject.value.includeVariable) {
      const newSub = { ...subject };
      newSub["value"]["content"] =
        newSub["value"]["content"] + `&${subject["value"]["includeVariable"]}&`;
      setSubject({ ...newSub });
    }
  };
  const addVarToMsgContent = () => {
    if (msg.value.includeVariable) {
      const newMSG = { ...msg };
      newMSG["value"]["content"] =
        newMSG["value"]["content"] + `&${msg["value"]["includeVariable"]}&`;
      setMsg({ ...newMSG });
    }
  };

  const handleChangeSubAndMsg = (e, fieldType) => {
    const newSub = { ...subject };
    const newMsg = { ...msg };
    const { name, value } = e.target;
    if (fieldType === "Subject") {
      newSub["value"][name] = value;
      if (!value || value.trim() === "") {
        newSub["error"] = true;
        newSub["helperText"] = t("subjectEmptyError");
      }
    } else if (fieldType === "Message") {
      newMsg["value"][name] = value;
    }
    setMsg({ ...msg, ...newMsg });
    setSubject({ ...subject, ...newSub });
  };

  const validateFields = () => {};
  const addOrModifyRuleToRules = () => {
    const rule = { ...selectedRule };

    const operationObj = (rule.ruleOpList && rule.ruleOpList[0]) || {};
    operationObj["durationInfo"] = {
      varFieldId_Days: "0",
      variableId_Seconds: "0",
      paramSeconds: "0",
      variableIdDays: TATData.isDaysConstant
        ? "0"
        : getVariableIdByName({
            variables: localLoadedProcessData?.Variable,
            name: TATData.days,
          }),
      variableIdMinutes: TATData.isMinutesConstant
        ? "0"
        : getVariableIdByName({
            variables: localLoadedProcessData?.Variable,
            name: TATData.minutes,
          }),
      variableIdHours: TATData.isHoursConstant
        ? "0"
        : getVariableIdByName({
            variables: localLoadedProcessData?.Variable,
            name: TATData.hours,
          }),
      varFieldId_Seconds: "0",
      variableId_Hours: "0",

      paramDays: TATData.days,
      paramHours: TATData.hours,
      paramMinutes: TATData.minutes,
      varFieldId_Minutes: "0",
    };
    operationObj["mailTrigInfo"]["mailInfo"] = {
      varFieldTypeBCC: mailData.isBccConstant
        ? "C"
        : getVariableScopeByName({
            variables: localLoadedProcessData?.Variable,
            name: mailData.bccInput,
          }),
      bccConstant: mailData.isBccConstant ? mailData.bccInput : null,
      bccUser: mailData.isBccConstant ? "<Constant>" : mailData.bccInput,

      toUser: mailData.isToConstant ? "<Constant>" : mailData.toInput,
      toConstant: mailData.isToConstant ? mailData.toInput : null,
      varFieldTypeTo: mailData.isToConstant
        ? "C"
        : getVariableScopeByName({
            variables: localLoadedProcessData?.Variable,
            name: mailData.toInput,
          }),

      varFieldTypeFrom: mailData.isFromConstant
        ? "C"
        : getVariableScopeByName({
            variables: localLoadedProcessData?.Variable,
            name: mailData.fromInput,
          }),
      fromConstant: mailData.isFromConstant ? mailData.fromInput : null,
      fromUser: mailData.isFromConstant ? "<Constant>" : mailData.fromInput,

      ccUser: mailData.isCcConstant ? "<Constant>" : mailData.ccInput,
      ccConstant: mailData.isCcConstant ? mailData.ccInput : null,
      varFieldTypeCC: mailData.isCcConstant
        ? "C"
        : getVariableScopeByName({
            variables: localLoadedProcessData?.Variable,
            name: mailData.ccInput,
          }),
      subject: subject.value?.content || "",
      variableIdPriority: "0",

      varFieldTypePriority: "C",
      VarFieldIdBCC: "0",

      varFieldIdTo: "0",

      message: msg.value?.content || "",
      priority: getPriorityNumber(mailData.priorityInput),
      varFieldIdCC: "0",
      variableIdBCC: mailData.isBccConstant
        ? "0"
        : getVariableIdByName({
            variables: localLoadedProcessData?.Variable,
            name: mailData.bccInput,
          }),
      varFieldIdFrom: "0",

      variableIdCC: mailData.isCcConstant
        ? "0"
        : getVariableIdByName({
            variables: localLoadedProcessData?.Variable,
            name: mailData.ccInput,
          }),
      variableIdFrom: mailData.isFromConstant
        ? "0"
        : getVariableIdByName({
            variables: localLoadedProcessData?.Variable,
            name: mailData.fromInput,
          }),
      variableIdTo: mailData.isToConstant
        ? "0"
        : getVariableIdByName({
            variables: localLoadedProcessData?.Variable,
            name: mailData.toInput,
          }),
    };

    operationObj["param2"] = escalateAfter.value?.param2 || "";
    operationObj["type2"] = escalateAfter.value?.type2 || "S";
    operationObj["variableId_2"] = escalateAfter.value?.variableId_2 || "0";

    rule.ruleOpList[0] = { ...operationObj };

    setAddingRule(false);
    setModifyingRule(false);

    setSubject({ ...subject, value: { includeVariable: "", content: "" } });
    setMsg({ ...msg, value: { includeVariable: "", content: "" } });

    let newRules = [...allRules];

    const index = newRules.findIndex(
      (item) => item.ruleId === selectedRule.ruleId
    );
    newRules.splice(index, 1, rule);
    setAllRules(newRules);
    updateLocalProp(newRules);
  };
  console.log(mailData);
  console.log(TATData);
  const updateLocalProp = (rules) => {
    const newPropObj = { ...localLoadedActivityPropertyData };
    newPropObj.m_objTaskRulesListInfo.esRuleList = rules;
    setlocalLoadedActivityPropertyData(newPropObj);
  };
  const cancelAddingRuleToRules = () => {
    const newRules = [...allRules];

    if (addingRule) {
      const index = newRules.findIndex(
        (item) => item.ruleId === selectedRule.ruleId
      );
      newRules.splice(index, 1);
      setAllRules(newRules);
    }
    setSelectedRule(null);
    setEscalateAfter({
      ...escalateAfter,
      value: { param2: "", type2: "S", variableId_2: "0" },
    });
    setAddingRule(false);
    setModifyingRule(false);
    setSubject({ ...subject, value: { includeVariable: "", content: "" } });
    setMsg({ ...msg, value: { includeVariable: "", content: "" } });
  };

  const onChangeMailData = (name, value) => {
    setMailData((prev) => {
      let newData = { ...prev };
      newData[name] = typeof value === "object" ? value?.VariableName : value;
      return newData;
    });
  };

  const onChangeTATData = (name, value) => {
    setTATData((prev) => {
      let newData = { ...prev };
      newData[name] = typeof value === "object" ? value?.VariableName : value;
      return newData;
    });
  };
  const onChangeEscalateAfter = (name, value) => {
    if (typeof value === "object") {
      const newVal = {
        ...escalateAfter.value,
        param2: value.VariableName,
        type2: "S",
        variableId_2:
          getVariableIdByName({
            variables: allDateTypeVars,
            name: value.VariableName,
          }) || "0",
      };
      setEscalateAfter({ ...escalateAfter, value: newVal });
    } else {
      if (name === "EscalateAfter") {
        const newVal = {
          ...escalateAfter.value,
          param2: value,
          type2: "C",
          variableId_2: "0",
        };
        setEscalateAfter({ ...escalateAfter, value: newVal });
      }
    }
  };
  const getVarsOptionsForMails = () => {
    const allVarsForScopeM =
      getVariablesByScopes({
        variables: localLoadedProcessData?.Variable,
        scopes: ["M"],
      }) || [];
    return allVarsForScopeM.filter(
      (variable) => variable.VariableType === "10"
    );
  };

  return (
    <Grid
      container
      direction="column"
      style={{
        pointerEvents:
          props.cellType === getSelectedCellType("TASKTEMPLATE")
            ? "none"
            : null,
        opacity:
          props.cellType === getSelectedCellType("TASKTEMPLATE") ? 0.6 : 1,
      }}
    >
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
                  width: props.isDrawerExpanded ? "25%" : null,
                  paddingTop: props.isDrawerExpanded ? "0.6rem" : "0.2rem",
                }}
              >
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Typography
                      component="h5"
                      className={classes.GroupTitleMain}
                    >
                      {`${t("escalation")} ${t("rule")}(S)`.toUpperCase()}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Grid container>
                      <Grid item>
                        <Typography style={{ fontSize: "16px" }}>
                          {allRules.length > 0
                            ? `${allRules.length} ${
                                allRules.length === 1 ? "Rule is" : "Rules are"
                              } defined`
                            : null}
                        </Typography>
                      </Grid>
                      <Grid item style={{ marginLeft: "auto" }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => addNewRule()}
                          disabled={addingRule || modifyingRule}
                        >
                          {`${t("addRule")}`}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  {allRules.map((rule, index) => (
                    <div
                      className={
                        selectedRule !== null &&
                        selectedRule.ruleId === rule.ruleId
                          ? styles.selectedListItem
                          : styles.listItem
                      }
                      onClick={() => handleSelectedRule(rule)}
                      id={`taskEscalation_listItem${index}`}
                    >
                      <Typography style={{ fontSize: ".75rem" }}>
                        {Object.keys(rule).length === 0 ? (
                          "New Rule"
                        ) : (
                          <>
                            {/**
                           *  rule.ruleOpList[0]?.Type2 === "C"
                                ? moment(rule.ruleOpList[0]?.Param2).format(
                                    "MM-YYYY"
                                  )
                                :
                           */}
                            <span>ESCALATE TO WITH TRIGGER After</span>{" "}
                            <span className={classes.bold}>
                              {(rule.ruleOpList &&
                                rule.ruleOpList[0]?.param2) ||
                                null}
                            </span>{" "}
                            <span className={classes.bold}>
                              + '
                              {`${
                                (rule.ruleOpList &&
                                  rule.ruleOpList[0]?.durationInfo
                                    ?.paramDays) ||
                                0
                              }`}
                              'Day(s)
                            </span>
                            <span className={classes.bold}>
                              + '
                              {`${
                                (rule.ruleOpList &&
                                  rule.ruleOpList[0]?.durationInfo
                                    ?.paramHours) ||
                                0
                              }`}
                              'Hr(s)
                            </span>
                            <span className={classes.bold}>
                              + '
                              {`${
                                (rule.ruleOpList &&
                                  rule.ruleOpList[0]?.durationInfo
                                    ?.paramMinutes) ||
                                0
                              }`}
                              'Min(s)
                            </span>{" "}
                            <span className={classes.bold}>
                              {rule.ruleOpList &&
                              rule.ruleOpList[0]?.ruleCalFlag === "Y"
                                ? "Working Day(s)"
                                : "Calendar Day(s)"}
                            </span>
                          </>
                        )}
                      </Typography>
                    </div>
                  ))}
                </Grid>
              </div>
              <Divider orientation="vertical" flexItem fullWidth />
              {selectedRule && props.isDrawerExpanded && (
                <div
                  style={{
                    marginLeft: "0.8rem",
                    marginRight: "0.8rem",

                    marginBottom: "0.9rem",
                    width: props.isDrawerExpanded ? "75%" : null,
                    height: "100%",
                    paddingTop: props.isDrawerExpanded ? "0.6rem" : "0.2rem",
                    pointerEvents:
                      !addingRule && !modifyingRule ? "none" : "auto",
                  }}
                >
                  <Grid container direction="column" spacing={2}>
                    <Grid item container>
                      <Grid item>
                        <Typography
                          component="h5"
                          className={classes.GroupTitleSecondary}
                        >
                          {`${t("escalation")} ${t("details")}`.toUpperCase()}
                        </Typography>
                      </Grid>
                      {(addingRule || modifyingRule) && (
                        <Grid item style={{ marginLeft: "auto" }}>
                          <Button
                            variant="contained"
                            color="seconday"
                            size="small"
                            onClick={() => cancelAddingRuleToRules()}
                          >
                            {`${t("cancel")}`}
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => addOrModifyRuleToRules()}
                            style={{ marginLeft: "8px" }}
                          >
                            {`${t(modifyingRule ? "modifyRule" : "addRule")}`}
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Grid
                        container
                        direction={props.isDrawerExpanded ? "row" : "column"}
                        spacing={1}
                        alignItems={props.isDrawerExpanded ? "center" : null}
                      >
                        <Grid
                          item
                          container
                          spacing={props.isDrawerExpanded ? 1 : 2}
                          alignItems="center"
                          xs={props.isDrawerExpanded ? 3 : 12}
                        >
                          <Grid item xs={props.isDrawerExpanded ? 10 : 11}>
                            <Field
                              selectCombo={true}
                              name="EscalateAfter"
                              type={
                                escalateAfter.value?.type2 === "C"
                                  ? "date"
                                  : null
                              }
                              label={`${t("escalate")} ${t("after")}`}
                              value={escalateAfter.value?.param2}
                              onChange={onChangeEscalateAfter}
                              dropdownOptions={allDateTypeVars || []}
                              optionKey="value"
                              setIsConstant={(val) => {
                                onChangeEscalateAfter(
                                  "isEscalateAfterConstant",
                                  val
                                );
                              }}
                              setValue={(val) => {
                                onChangeEscalateAfter("EscalateAfter", val);
                              }}
                              isConstant={escalateAfter.value?.type2 === "C"}
                              showEmptyString={false}
                              showConstValue={true}
                              inputClass={
                                styles["selectWithInputTextField_WS"] || ""
                              }
                              constantInputClass={
                                styles["multiSelectConstInput_WS"] || ""
                              }
                              selectWithInput={styles["selectWithInput_WS"]}
                            />
                          </Grid>
                          <Grid item xs={props.isDrawerExpanded ? 2 : 1}>
                            <Typography style={{ fontSize: "16px" }}>
                              +
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          xs={props.isDrawerExpanded ? 9 : 12}
                          style={{
                            paddingTop: props.isDrawerExpanded
                              ? "2.3rem"
                              : "2px",
                          }}
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
                            calendarTypeLabel="Calendar Type"
                            inputClass={
                              styles["selectWithInputTextField_WS_Expanded"] ||
                              ""
                            }
                            constantInputClass={
                              styles["multiSelectConstInput_WS_Expanded"] || ""
                            }
                            selectWithInput={
                              styles["selectWithInput_WS_Expanded"]
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
                        {`${t("MAIL")} ${t("Template")}`.toUpperCase()}
                      </Typography>
                    </Grid>
                    <Grid item xs={props.isDrawerExpanded ? 9 : 12}>
                      <Grid
                        container
                        direction={props.isDrawerExpanded ? "row" : "column"}
                        spacing={props.isDrawerExpanded ? 2 : 1}
                        alignItems={props.isDrawerExpanded ? "flex-end" : null}
                      >
                        <Grid item xs={props.isDrawerExpanded ? 4 : 12}>
                          <Field
                            selectCombo={true}
                            label={`${t("from")}`}
                            /* dropdownOptions={
                              localLoadedProcessData?.Variable || []
                            }*/
                            dropdownOptions={getVarsOptionsForMails()}
                            optionKey="VariableName"
                            setIsConstant={(val) => {
                              onChangeMailData("isFromConstant", val);
                            }}
                            setValue={(val) => {
                              onChangeMailData("fromInput", val);
                            }}
                            value={mailData.fromInput}
                            isConstant={mailData.isFromConstant}
                            showEmptyString={false}
                            showConstValue={true}
                            // disabled={readOnlyProcess}
                            id="from_select_input"
                            inputClass={
                              styles["selectWithInputTextField_WS"] || ""
                            }
                            constantInputClass={
                              styles["multiSelectConstInput_WS"] || ""
                            }
                            selectWithInput={styles["selectWithInput_WS"]}
                          />
                        </Grid>
                        <Grid item xs={props.isDrawerExpanded ? 4 : 12}>
                          <Field
                            selectCombo={true}
                            label={`${t("to")}`}
                            dropdownOptions={getVarsOptionsForMails()}
                            optionKey="VariableName"
                            setIsConstant={(val) => {
                              onChangeMailData("isToConstant", val);
                            }}
                            setValue={(val) => {
                              onChangeMailData("toInput", val);
                            }}
                            value={mailData.toInput}
                            isConstant={mailData.isToConstant}
                            showEmptyString={false}
                            showConstValue={true}
                            // disabled={readOnlyProcess}
                            id="to_select_input"
                            inputClass={
                              styles["selectWithInputTextField_WS"] || ""
                            }
                            constantInputClass={
                              styles["multiSelectConstInput_WS"] || ""
                            }
                            selectWithInput={styles["selectWithInput_WS"]}
                          />
                        </Grid>
                        <Grid item xs={props.isDrawerExpanded ? 4 : 12}>
                          <Field
                            selectCombo={true}
                            dropdownOptions={getVarsOptionsForMails()}
                            optionKey="VariableName"
                            label={`${t("cc")}`}
                            setIsConstant={(val) => {
                              onChangeMailData("isCcConstant", val);
                            }}
                            setValue={(val) => {
                              onChangeMailData("ccInput", val);
                            }}
                            value={mailData.ccInput}
                            isConstant={mailData.isCcConstant}
                            showConstValue={true}
                            id="cc_select_input"
                            inputClass={
                              styles["selectWithInputTextField_WS"] || ""
                            }
                            constantInputClass={
                              styles["multiSelectConstInput_WS"] || ""
                            }
                            selectWithInput={styles["selectWithInput_WS"]}
                          />
                        </Grid>
                        <Grid item xs={props.isDrawerExpanded ? 4 : 12}>
                          <Field
                            selectCombo={true}
                            dropdownOptions={getVarsOptionsForMails()}
                            optionKey="VariableName"
                            label={`${t("bcc")}`}
                            setIsConstant={(val) => {
                              onChangeMailData("isBccConstant", val);
                            }}
                            setValue={(val) => {
                              onChangeMailData("bccInput", val);
                            }}
                            value={mailData.bccInput}
                            isConstant={mailData.isBccConstant}
                            showConstValue={true}
                            id="bcc_select_input"
                            inputClass={
                              styles["selectWithInputTextField_WS"] || ""
                            }
                            constantInputClass={
                              styles["multiSelectConstInput_WS"] || ""
                            }
                            selectWithInput={styles["selectWithInput_WS"]}
                          />
                        </Grid>
                        <Grid item xs={props.isDrawerExpanded ? 4 : 12}>
                          <Field
                            selectCombo={true}
                            label={`${t("Priority")}`}
                            dropdownOptions={priorityOpt}
                            setValue={(val) => {
                              onChangeMailData("priorityInput", val);
                            }}
                            value={mailData.priorityInput}
                            showConstValue={false}
                            id="priority_select_input"
                            inputClass={
                              styles["selectWithInputTextField_WS_Expanded"] ||
                              ""
                            }
                            constantInputClass={
                              styles["multiSelectConstInput_WS_Expanded"] || ""
                            }
                            selectWithInput={
                              styles["selectWithInput_WS_Expanded"]
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
                        {`${t("Subject")}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={props.isDrawerExpanded ? 9 : 12}>
                      <Grid
                        container
                        direction={props.isDrawerExpanded ? "row" : "column"}
                        spacing={props.isDrawerExpanded ? 2 : 1}
                        alignItems={props.isDrawerExpanded ? "center" : null}
                      >
                        <Grid
                          item
                          container
                          spacing={1}
                          alignItems="center"
                          xs={props.isDrawerExpanded ? 8 : 12}
                        >
                          <Grid item xs={props.isDrawerExpanded ? 8 : 10}>
                            <Field
                              dropdown={true}
                              name="includeVariable"
                              label={`${t("includeVariable")}`}
                              value={subject.value.includeVariable}
                              onChange={(e) =>
                                handleChangeSubAndMsg(e, "Subject")
                              }
                              options={
                                localLoadedProcessData?.Variable.map(
                                  (item) => ({
                                    name: item.VariableName,
                                    value: item.VariableName,
                                  })
                                ) || []
                              }
                            />
                          </Grid>
                          <Grid item xs={2} style={{ marginTop: "12px" }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() => addVarToSubContent()}
                            >
                              Add
                            </Button>
                          </Grid>
                        </Grid>
                        <Grid item xs={props.isDrawerExpanded ? 10 : 12}>
                          <Field
                            name="content"
                            label={`${t("Content")}`}
                            value={subject.value.content}
                            multiline={true}
                            onChange={(e) =>
                              handleChangeSubAndMsg(e, "Subject")
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
                        {`${t("message")}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={props.isDrawerExpanded ? 9 : 12}>
                      <Grid
                        container
                        direction={props.isDrawerExpanded ? "row" : "column"}
                        spacing={props.isDrawerExpanded ? 2 : 1}
                        alignItems={props.isDrawerExpanded ? "center" : null}
                      >
                        <Grid
                          item
                          container
                          spacing={1}
                          alignItems="center"
                          xs={props.isDrawerExpanded ? 8 : 12}
                        >
                          <Grid item xs={props.isDrawerExpanded ? 8 : 10}>
                            <Field
                              dropdown={true}
                              name="includeVariable"
                              label={`${t("includeVariable")}`}
                              value={msg.value.includeVariable}
                              onChange={(e) =>
                                handleChangeSubAndMsg(e, "Message")
                              }
                              options={
                                localLoadedProcessData?.Variable.map(
                                  (item) => ({
                                    name: item.VariableName,
                                    value: item.VariableName,
                                  })
                                ) || []
                              }
                            />
                          </Grid>
                          <Grid item xs={2} style={{ marginTop: "12px" }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() => addVarToMsgContent()}
                            >
                              {t("add")}
                            </Button>
                          </Grid>
                        </Grid>
                        <Grid item xs={props.isDrawerExpanded ? 10 : 12}>
                          <Field
                            name="content"
                            label={`${t("content")}`}
                            value={msg.value.content}
                            multiline={true}
                            onChange={(e) =>
                              handleChangeSubAndMsg(e, "Message")
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              )}
            </div>
          )}
        </div>
      </Grid>
    </Grid>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectedCell: (
      id,
      name,
      activityType,
      activitySubType,
      seqId,
      queueId,
      type
    ) =>
      dispatch(
        actionCreators.selectedCell(
          id,
          name,
          activityType,
          activitySubType,
          seqId,
          queueId,
          type
        )
      ),
    expandDrawer: (flag) => dispatch(actionCreatorsDrawer.expandDrawer(flag)),
  };
};

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskEscalationRules);
