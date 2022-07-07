import React, { useState, useEffect } from "react";
import { Divider, Grid, Typography } from "@material-ui/core";
import DataFields from "../commonTabHeader.js";
import "../../Properties.css";
import { useTranslation } from "react-i18next";
import { Select, MenuItem } from "@material-ui/core";

import { connect, useDispatch, useSelector } from "react-redux";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";

import { makeStyles } from "@material-ui/core/styles";

import { store, useGlobalState } from "state-pool";
import * as actionCreators from "../../../../redux-store/actions/selectedCellActions";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  PROCESSTYPE_LOCAL,
  propertiesLabel,
  SERVER_URL,
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
import CheckboxGroup from "../../../../UI/InputFields/CheckboxFields/CheckboxGroup.js";
import TurnAroundTime from "../../../../UI/InputFields/TurnAroundTime/TurnAroundTime.js";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice.js";
import { MoreHoriz } from "@material-ui/icons";
import {
  AddPlusIcon,
  DeleteIcon,
} from "../../../../utility/AllImages/AllImages.js";
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
  GroupTitle: {
    fontWeight: "bold",
    color: "#606060",
  },
  btnIcon: {
    cursor: "pointer",
    height: "28px",
    width: "28px",
    border: "1px solid #CECECE",
  },
  addAdvisorBtnIcon: {
    cursor: "pointer",
    height: "28px",
    width: "28px",
    border: "1px solid #CECECE",
    backgroundColor: "#0072C6",
    color: "#FFFFFF",
    marginTop: "1.6rem",
    // filter:
    // "brightness(0) saturate(100%) invert(95%) sepia(99%) saturate(17%) hue-rotate(78deg) brightness(107%) contrast(100%)",
  },
  plusIcon: {
    color: "#FFFFFF",
    fontSize: "1rem",
    marginTop: "-.5rem",
  },
  fontSize: {
    fontSize: "0.725rem",
    fontWeight: 600,
  },
  deleteIcon: {
    width: "1rem",
    height: "1rem",
    cursor: "pointer",
  },
}));
function TaskDetails(props) {
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

  const [description, setDescription] = useState(makeFieldInputs(""));
  const [taskTemplateName, setTaskTemplateName] = useState(makeFieldInputs(""));

  const [goal, setGoal] = useState(makeFieldInputs(""));
  const [instructions, setInstruction] = useState(makeFieldInputs(""));
  const [cost, setCost] = useState(makeFieldInputs(""));
  const [taskAdvisor, setAdvisor] = useState(makeFieldInputs(""));
  const [taskAdvisorList, setAdvisorList] = useState([]);

  const [turnAroundTime, setTurnAroundTime] = useState(
    makeFieldInputs({ days: 0, hours: 0, minutes: 0, calendarType: "" })
  );

  const [isDisableTab, setisDisableTab] = useState(false);
  const [formHasError, setFormHasError] = useState(false);
  const [registeredProcessList, setRegisteredProcessList] = useState([]);
  const [selectedRegisteredProcess, setSelectedRegisteredProcess] =
    useState(null);
  const [selectedRegisteredProcessType, setSelectedRegisteredProcessType] =
    useState(null);

  useEffect(() => {
    axios.get(SERVER_URL + `/getprocesslist/R/-1`).then((res) => {
      console.log("MEGHALCHECKING", res.data);
      if (res.data.Status === 0) {
        setRegisteredProcessList(res.data.Processes);
      }
    });
  }, []);

  useEffect(() => {
    registeredProcessList?.map((list) => {
      if (
        list.ProcessName ==
        localLoadedActivityPropertyData?.m_objPMSubProcess?.importedProcessName
      ) {
        setSelectedRegisteredProcess(list.ProcessName);
      }
    });
  }, [registeredProcessList]);

  useEffect(() => {
    if (localLoadedActivityPropertyData) {
      const taskGenPropInfo =
        localLoadedActivityPropertyData.taskGenPropInfo || {};
      setDescription({
        ...description,
        value: taskGenPropInfo?.genPropInfo?.description || "",
      });
      setTaskTemplateName({
        ...taskTemplateName,
        value: taskGenPropInfo?.taskTemplateInfo?.m_strTemplateName,
      });
      setCost({ ...cost, value: taskGenPropInfo?.genPropInfo?.cost || "" });

      setInstruction({
        ...instructions,
        value: taskGenPropInfo?.m_strInstructions || "",
      });
      setGoal({ ...goal, value: taskGenPropInfo?.m_strGoal || "" });

      const tatInfo = taskGenPropInfo?.tatInfo || {};
      const newTurnAroundValues = {
        ...turnAroundTime.value,
        days: tatInfo?.wfDays || 0,
        hours: tatInfo?.wfHours || 0,
        minutes: tatInfo?.wfMinutes || 0,
        calendarType: tatInfo?.tatCalFlag,
      };
      setTurnAroundTime({
        ...turnAroundTime,
        value: { ...newTurnAroundValues },
      });
      setAdvisorList(
        localLoadedActivityPropertyData.taskGenPropInfo?.genPropInfo
          ?.consultantList || []
      );
      setRepeatable({
        ...repeatable,
        value: taskGenPropInfo?.isRepeatable,
      });
      setNotifyByEmail({
        ...notifyByEmail,
        value: taskGenPropInfo?.isNotifyEmail,
      });

      setSelectedRegisteredProcessType(
        localLoadedActivityPropertyData?.taskGenPropInfo?.m_strSubPrcType
      );

      console.log(
        "KAL_TK",
        localLoadedActivityPropertyData,
        selectedRegisteredProcess
      );
      if (saveCancelStatus.SaveClicked) {
        if (!validateFields()) {
          dispatch(
            setActivityPropertyChange({
              [propertiesLabel.taskDetails]: {
                isModified: true,
                hasError: true,
              },
            })
          );
        }
      }
      setspinner(false);
    }
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    if (localLoadedProcessData.ProcessType !== PROCESSTYPE_LOCAL) {
      setisDisableTab(true);
    }
  }, [localLoadedProcessData.ProcessType]);

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      validateFields();
      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked, saveCancelStatus.CancelClicked]);

  const handleChange = (e) => {
    const tempPropertyDataObj = { ...localLoadedActivityPropertyData };

    const { name, value, checked } = e.target;
    switch (name) {
      case "Description":
        // setDescription((prevState) => ({ ...prevState, value }));
        tempPropertyDataObj["taskGenPropInfo"]["genPropInfo"]["description"] =
          value;
        break;
      case "TaskTemplateName":
        // setTaskTemplateName((prevState) => ({ ...prevState, value }));
        tempPropertyDataObj.taskGenPropInfo.taskTemplateInfo = {
          ...tempPropertyDataObj.taskGenPropInfo.taskTemplateInfo,
          m_strTemplateName: value,
        };
        break;
      case "Goal":
        //  setGoal((prevState) => ({ ...prevState, value }));
        tempPropertyDataObj.taskGenPropInfo.m_strGoal = value;
        break;
      case "Instructions":
        // setInstruction((prevState) => ({ ...prevState, value }));
        tempPropertyDataObj.taskGenPropInfo.m_strInstructions = value;
        break;
      case "TaskAdvisor":
        setAdvisor((prevState) => ({ ...prevState, value }));
        break;

      case "Cost":
        if (+value >= 0) {
          // setCost((prevState) => ({ ...prevState, value }));
          tempPropertyDataObj.taskGenPropInfo.genPropInfo.cost = value;
        }
        break;

      case "Repeatable":
        // setRepeatable({ ...repeatable, value: checked });
        tempPropertyDataObj.taskGenPropInfo.isRepeatable = checked;
        break;

      case "NotifyByEmail":
        //  setNotifyByEmail({ ...notifyByEmail, value: checked });
        tempPropertyDataObj.taskGenPropInfo.isNotifyEmail = checked;
        break;
      case "Days":
        if (+value >= 0) {
          /*  let newValueDay = { ...turnAroundTime.value, days: +value };
          setTurnAroundTime((prevState) => ({
            ...prevState,
            value: { ...newValueDay },
          }));*/
          tempPropertyDataObj.taskGenPropInfo.tatInfo = {
            ...tempPropertyDataObj.taskGenPropInfo.tatInfo,
            wfDays: +value || 0,
          };
        }
        break;

      case "Minutes":
        if (+value >= 0) {
          /*  let newValueMin = { ...turnAroundTime.value, minutes: +value };
          setTurnAroundTime((prevState) => ({
            ...prevState,
            value: { ...newValueMin },
          }));*/
          tempPropertyDataObj.taskGenPropInfo.tatInfo = {
            ...tempPropertyDataObj.taskGenPropInfo.tatInfo,

            wfMinutes: +value || 0,
          };
        }
        break;
      case "Hours":
        if (+value >= 0) {
          /*  let newValueHour = { ...turnAroundTime.value, hours: +value };
          setTurnAroundTime((prevState) => ({
            ...prevState,
            value: { ...newValueHour },
          }));*/
          tempPropertyDataObj.taskGenPropInfo.tatInfo = {
            ...tempPropertyDataObj.taskGenPropInfo.tatInfo,

            wfHours: +value || 0,
          };
        }
        break;
      case "CalendarType":
        /*   let newValueCalendarType = {
          ...turnAroundTime.value,
          calendarType: value,
        };
        setTurnAroundTime((prevState) => ({
          ...prevState,
          value: { ...newValueCalendarType },
        }));*/
        tempPropertyDataObj.taskGenPropInfo.tatInfo = {
          ...tempPropertyDataObj.taskGenPropInfo.tatInfo,
          tatCalFlag: value,
        };
        break;

      default:
        break;
    }
    setlocalLoadedActivityPropertyData(tempPropertyDataObj);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskDetails]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };
  const makingCheckboxFields = (name, value, label) => {
    return {
      name,
      value,
      label,
      onChange: handleChange,
    };
  };
  const [repeatable, setRepeatable] = useState(
    makingCheckboxFields("Repeatable", false, "Repeatable")
  );
  const [notifyByEmail, setNotifyByEmail] = useState(
    makingCheckboxFields("NotifyByEmail", false, "Notify By Email")
  );

  useEffect(() => {
    if (
      goal?.error ||
      instructions?.error ||
      cost?.error ||
      turnAroundTime.value.days === "" ||
      turnAroundTime.value.days < 0
    ) {
      setFormHasError(true);
    } else {
      setFormHasError(false);
    }
  }, [goal, instructions, cost, turnAroundTime.value.days, taskTemplateName]);
  const validateFields = () => {
    const goalErrors =
      goal.value?.trim()?.length === 0 ? `${t("goalEmptyError")}` : null;
    if (goalErrors) {
      setGoal({
        ...goal,
        error: true,
        helperText: goalErrors,
      });
    }

    const insErr =
      instructions.value?.trim()?.length === 0
        ? `${t("instructionsEmptyError")}`
        : null;
    if (insErr) {
      setInstruction({
        ...instructions,
        error: true,
        helperText: insErr,
      });
    }
    const costErr =
      !cost.value || cost.value < 0 ? `${t("costEmptyError")}` : null;
    if (costErr) {
      setCost({
        ...cost,
        error: true,
        helperText: costErr,
      });
    }

    const turnAroundTimeDaysErr =
      turnAroundTime.value.days === "" || turnAroundTime.value?.days < 0
        ? `${t("daysEmptyError")}`
        : null;
    if (turnAroundTimeDaysErr) {
      dispatch(
        setToastDataFunc({
          message: turnAroundTimeDaysErr,
          severity: "error",
          open: true,
        })
      );
    }
    let templateNameError = "";
    if (
      localLoadedActivityPropertyData?.taskGenPropInfo?.taskTemplateInfo
        ?.m_bGlobalTemplate
    ) {
      templateNameError =
        taskTemplateName.value.trim().length === 0
          ? t("templateNameEmptyError")
          : "";
    }
    if (templateNameError) {
      setTaskTemplateName({
        ...taskTemplateName,
        error: true,
        helperText: templateNameError,
      });
    }
    return goalErrors ||
      insErr ||
      costErr ||
      turnAroundTimeDaysErr ||
      templateNameError
      ? false
      : true;
  };

  const handleAddAdvisor = () => {};

  const handleDeleteAdvisor = (id) => {
    const tempPropertyDataObj = { ...localLoadedActivityPropertyData };
    const newAdvisorList = [...taskAdvisorList];
    const index = taskAdvisorList.findIndex((item) => item.consultantId === id);
    if (index) {
      newAdvisorList.splice(index, 1);
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.taskDetails]: {
            isModified: true,
            hasError: false,
          },
        })
      );
    }
    setAdvisorList(newAdvisorList);
    tempPropertyDataObj.taskGenPropInfo.genPropInfo.consultantList = [
      ...newAdvisorList,
    ];
    setlocalLoadedActivityPropertyData(tempPropertyDataObj);
  };

  const handleChangeInRegisteredProcess = (e) => {
    console.log('localLoadedActivityPropertyData', localLoadedActivityPropertyData);
    setSelectedRegisteredProcess(e.target.value);
    let temp = {...localLoadedActivityPropertyData};
    temp.m_objPMSubProcess.importedProcessName = e.target.value;
    temp.m_objPMSubProcess.fwdVarMapping=[];
    temp.m_objPMSubProcess.fwdDocMapping=[];
    setlocalLoadedActivityPropertyData(temp);
  };

  const handleChangeInRegisteredProcessType = (e) => {
    if (e.target.value != "U") {
      localStorage.setItem("registeredProcessType", null);
    } else {
      localStorage.setItem("registeredProcessType", e.target.value);
    }
    setSelectedRegisteredProcessType(e.target.value);
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <div style={{ width: "100%", height: "100%" }}>
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

                  marginBottom: "0.9rem",
                  width: props.isDrawerExpanded ? "50%" : null,
                  //  height: "100%",
                  paddingTop: props.isDrawerExpanded ? "0.6rem" : "0.2rem",
                }}
              >
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Typography component="h5">
                      {`${t("task")} ${t("details")}`.toUpperCase()}
                    </Typography>
                  </Grid>
                  {/* --------------------------------------------- */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ fontSize: "12px" }}>Type</p>
                    <Select
                      className="selectTwo_callActivity"
                      onChange={(e) => handleChangeInRegisteredProcessType(e)}
                      style={{
                        position: "absolute",
                        right: props.isDrawerExpanded ? "26px" : "25px",
                        width: props.isDrawerExpanded ? "280px" : "135px",
                        height: "28px",
                        background: "#ffffff 0% 0% no-repeat padding-box",
                        font: "normal normal normal 12px/17px Open Sans !important",
                        border: "1px solid #c4c4c4",
                        borderRadius: "2px",
                        opacity: "1",
                        fontSize: "12px",
                      }}
                      value={selectedRegisteredProcessType}
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
                      <MenuItem className="InputPairDiv_CommonList" value="S">
                        Synchronous
                      </MenuItem>
                      <MenuItem className="InputPairDiv_CommonList" value="A">
                        Asynchronous
                      </MenuItem>
                      <MenuItem className="InputPairDiv_CommonList" value="U">
                        User Monitored Synchronous
                      </MenuItem>
                    </Select>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "20px",
                      marginBottom: "5px",
                    }}
                  >
                    <p style={{ fontSize: "12px" }}>
                      Select Registered Process
                    </p>
                    <Select
                      className="selectTwo_callActivity"
                      onChange={(e) => handleChangeInRegisteredProcess(e)}
                      style={{
                        position: "absolute",
                        right: props.isDrawerExpanded ? "26px" : "25px",
                        width: props.isDrawerExpanded ? "280px" : "135px",
                        height: "28px",
                        background: "#ffffff 0% 0% no-repeat padding-box",
                        font: "normal normal normal 12px/17px Open Sans !important",
                        border: "1px solid #c4c4c4",
                        borderRadius: "2px",
                        opacity: "1",
                        fontSize: "12px",
                      }}
                      value={selectedRegisteredProcess}
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
                      {registeredProcessList?.map((list) => {
                        return (
                          <MenuItem
                            className="InputPairDiv_CommonList"
                            value={list.ProcessName}
                          >
                            {list.ProcessName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                  {/* ------------------------------------- */}
                  {localLoadedActivityPropertyData?.taskGenPropInfo
                    ?.taskTemplateInfo?.m_bGlobalTemplate && (
                    <Grid item>
                      <Field
                        id="TaskTemNameTaskDetails"
                        name="TaskTemplateName"
                        required={true}
                        label={`${t("task")} ${t("Template")} ${t("name")}`}
                        value={taskTemplateName.value}
                        onChange={handleChange}
                        error={taskTemplateName.error}
                        helperText={taskTemplateName.helperText}
                      />
                    </Grid>
                  )}
                  <Grid item>
                    <Field
                      id="descTaskDetails"
                      sunEditor={true}
                      name="Description"
                      label={t("description")}
                      value={description.value}
                      onChange={handleChange}
                      placeholder={t("placeholderCustomValidation")}
                    />
                  </Grid>

                  <Grid item xs={props.isDrawerExpanded ? 9 : 12}>
                    <Field
                      id="goalTaskDetails"
                      name="Goal"
                      required={true}
                      label={t("goal")}
                      value={goal.value}
                      /* value={
                        localLoadedActivityPropertyData?.taskGenPropInfo
                          ?.m_strGoal
                      }*/
                      onChange={handleChange}
                      error={goal.error}
                      helperText={goal.helperText}
                    />
                  </Grid>
                  <Grid item xs={props.isDrawerExpanded ? 9 : 12}>
                    <Field
                      id="instructionsTaskDetails"
                      name="Instructions"
                      required={true}
                      label={t("instructions")}
                      value={instructions.value}
                      onChange={handleChange}
                      error={instructions.error}
                      helperText={instructions.helperText}
                    />
                  </Grid>

                  <Grid item>
                    <CheckboxGroup
                      checkboxArray={[{ ...repeatable }, { ...notifyByEmail }]}
                      direction="row"
                    />
                  </Grid>
                  <Grid item xs={props.isDrawerExpanded ? 9 : 12}>
                    <TurnAroundTime
                      required
                      days={turnAroundTime.value?.days || 0}
                      hours={turnAroundTime.value?.hours || 0}
                      minutes={turnAroundTime.value?.minutes || 0}
                      calendarType={turnAroundTime.value?.calendarType || ""}
                      handleChange={handleChange}
                      label={t("turnaroundTime")}
                      //error={turnAroundTime.error}
                      //helperText={turnAroundTime.helperText}
                    />
                  </Grid>
                </Grid>
              </div>
              <Divider orientation="vertical" flexItem fullWidth />
              <div
                style={{
                  marginLeft: "0.8rem",
                  marginRight: "0.8rem",

                  //  marginTop: "0.9rem",
                  width: props.isDrawerExpanded ? "50%" : null,
                  //  height: "100%",
                  paddingTop: props.isDrawerExpanded ? "0.6rem" : "0.2rem",
                }}
              >
                <div>
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={3}>
                      <Field
                        id="costTaskDetails"
                        type="number"
                        name="Cost"
                        label={t("cost")}
                        required={true}
                        extraLabel={` (${t("in $")})`}
                        step={0.1}
                        min={0}
                        value={cost.value}
                        onChange={handleChange}
                        error={cost.error}
                        helperText={cost.helperText}
                      />
                    </Grid>
                    <Grid
                      item
                      container
                      spacing={2}
                      xs={props.isDrawerExpanded ? 9 : 12}
                    >
                      <Grid item xs>
                        <Field
                          id="TaskAdvisorTaskDetails"
                          name="TaskAdvisor"
                          // required={true}
                          label={`${t("task")} ${t("advisor")}`}
                          value={taskAdvisor.value}
                          onChange={handleChange}
                          btnIconAtEnd={
                            <MoreHoriz className={classes.btnIcon} />
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        className={classes.addAdvisorBtnIcon}
                        onClick={() => handleAddAdvisor()}
                      >
                        <Typography className={classes.plusIcon}>+</Typography>
                      </Grid>
                      <Grid item container direction="column" spacing={1}>
                        {taskAdvisorList.map((advisor) => (
                          <Grid item container>
                            <Grid item>
                              <Typography className={classes.fontSize}>
                                {advisor.consultantName}
                              </Typography>
                            </Grid>
                            <Grid item style={{ marginLeft: "auto" }}>
                              <DeleteIcon
                                className={classes.deleteIcon}
                                onClick={() =>
                                  handleDeleteAdvisor(advisor.consultantId)
                                }
                              />
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(TaskDetails);
