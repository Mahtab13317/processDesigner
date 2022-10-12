import React, { useState, useEffect } from "react";
import { Divider, Grid, Typography, Select, MenuItem } from "@material-ui/core";
import "../../Properties.css";
import { useTranslation } from "react-i18next";
import { connect, useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { store, useGlobalState } from "state-pool";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  propertiesLabel,
  SERVER_URL,
} from "../../../../Constants/appConstants.js";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import Field from "../../../../UI/InputFields/TextField/Field.js";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import CheckboxGroup from "../../../../UI/InputFields/CheckboxFields/CheckboxGroup.js";
import TurnAroundTime from "../../../../UI/InputFields/TurnAroundTime/TurnAroundTime.js";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice.js";
import { MoreHoriz } from "@material-ui/icons";
import { DeleteIcon } from "../../../../utility/AllImages/AllImages.js";
import { setProcessTaskType } from "../../../../redux-store/slices/ProcessTaskTypeSlice.js";
import TabsHeading from "../../../../UI/TabsHeading/index.js";
import { isProcessDeployedFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";
import Modal from "../../../../UI/Modal/Modal";
import { useRef } from "react";
import { FieldValidations } from "../../../../utility/FieldValidations/fieldValidations";

const makeFieldInputs = (value) => {
  return {
    value: value,
    error: false,
    helperText: "",
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
  GroupTitle: {
    fontWeight: "bold",
    color: "#606060",
    fontSize: "var(--subtitle_text_font_size)",
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
    backgroundColor: "var(--button_color) !important",
    color: "#FFFFFF !important",
    borderRadius: "2px",
    marginTop: "6px",
    // filter:
    // "brightness(0) saturate(100%) invert(95%) sepia(99%) saturate(17%) hue-rotate(78deg) brightness(107%) contrast(100%)",
  },
  plusIcon: {
    color: "#FFFFFF",
    fontSize: "var(--subtitle_text_font_size)",

    marginTop: "-.5rem",
  },
  fontSize: {
    fontSize: "var(--base_text_font_size)",
    fontWeight: 600,
  },
  deleteIcon: {
    width: "1rem",
    height: "1rem",
    cursor: "pointer",
  },
  clearIcon: {
    width: "1.7rem",
    height: "1.7rem",
    cursor: "pointer",
    color: "rgb(0,0,0,0.5) !important",
  },
}));

function TaskDetails(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const classes = useStyles({ ...props, direction });
  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked
  const localActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(localActivityPropertyData);
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
  const [openUserGroupMF, setopenUserGroupMF] = useState(false);
  const [formHasError, setFormHasError] = useState(false);
  const [registeredProcessList, setRegisteredProcessList] = useState([]);
  const [selectedRegisteredProcess, setSelectedRegisteredProcess] =
    useState(null);
  const [selectedRegisteredProcessType, setSelectedRegisteredProcessType] =
    useState(null);
  const [selectedRegisteredProcessID, setSelectedRegisteredProcessID] =
    useState(null);
  let isReadOnly = isProcessDeployedFunc(localLoadedProcessData);
  const taskType = useSelector(
    (state) => state.selectedCellReducer.selectedTaskType
  );

  const templateNameRef = useRef();
  const goalRef = useRef();
  const instructionsRef = useRef();

  useEffect(() => {
    axios.get(SERVER_URL + `/getprocesslist/R/-1`).then((res) => {
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
        // setSelectedRegisteredProcess(list.ProcessName);
        setSelectedRegisteredProcessID(list.ProcessDefId);
      }
    });
  }, [selectedRegisteredProcess, localLoadedActivityPropertyData]);

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

      setSelectedRegisteredProcess(
        localLoadedActivityPropertyData?.m_objPMSubProcess?.importedProcessName
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
    if (saveCancelStatus.SaveClicked) {
      validateFields();
      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked, saveCancelStatus.CancelClicked]);

  const handleChange = (e) => {
    let tempPropertyDataObj = { ...localLoadedActivityPropertyData };
    const { name, value, checked } = e.target;
    switch (name) {
      case "Description":
        tempPropertyDataObj["taskGenPropInfo"]["genPropInfo"]["description"] =
          value;
        break;
      case "TaskTemplateName":
        tempPropertyDataObj.taskGenPropInfo.taskTemplateInfo = {
          ...tempPropertyDataObj.taskGenPropInfo.taskTemplateInfo,
          m_strTemplateName: value,
        };
        break;
      case "Goal":
        tempPropertyDataObj.taskGenPropInfo.m_strGoal = value;
        break;
      case "Instructions":
        tempPropertyDataObj.taskGenPropInfo.m_strInstructions = value;
        break;
      case "TaskAdvisor":
        setAdvisor((prevState) => ({ ...prevState, value }));
        break;

      case "Cost":
        if (+value >= 0) {
          tempPropertyDataObj.taskGenPropInfo.genPropInfo.cost = value;
        }
        break;

      case "Repeatable":
        tempPropertyDataObj.taskGenPropInfo.isRepeatable = checked;
        break;

      case "NotifyByEmail":
        tempPropertyDataObj.taskGenPropInfo.isNotifyEmail = checked;
        break;
      case "Days":
        if (+value >= 0) {
          tempPropertyDataObj.taskGenPropInfo.tatInfo = {
            ...tempPropertyDataObj.taskGenPropInfo.tatInfo,
            wfDays: +value || 0,
          };
        }
        break;

      case "Minutes":
        if (+value >= 0) {
          tempPropertyDataObj.taskGenPropInfo.tatInfo = {
            ...tempPropertyDataObj.taskGenPropInfo.tatInfo,

            wfMinutes: +value || 0,
          };
        }
        break;
      case "Hours":
        if (+value >= 0) {
          tempPropertyDataObj.taskGenPropInfo.tatInfo = {
            ...tempPropertyDataObj.taskGenPropInfo.tatInfo,

            wfHours: +value || 0,
          };
        }
        break;
      case "CalendarType":
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

  const makingCheckboxFields = (name, value, label, disabled) => {
    return {
      name,
      value,
      label,
      onChange: handleChange,
      disabled,
    };
  };

  const [repeatable, setRepeatable] = useState(
    makingCheckboxFields("Repeatable", false, "Repeatable", isReadOnly)
  );
  const [notifyByEmail, setNotifyByEmail] = useState(
    makingCheckboxFields("NotifyByEmail", false, "Notify By Email", isReadOnly)
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
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskDetails]: {
          isModified: true,
          hasError: false,
        },
      })
    );
    setSelectedRegisteredProcess(e.target.value);
    let temp = { ...localLoadedActivityPropertyData };
    temp.m_objPMSubProcess.importedProcessName = e.target.value;
    registeredProcessList?.map((list) => {
      if (list.ProcessName == e.target.value) {
        localStorage.setItem("selectedTargetProcessID", list.ProcessDefId);

        temp.m_objPMSubProcess.importedProcessDefId = list.ProcessDefId;
      }
    });
    temp.m_objPMSubProcess.fwdVarMapping = [];
    temp.m_objPMSubProcess.fwdDocMapping = [];
    setlocalLoadedActivityPropertyData(temp);
  };

  const handleChangeInRegisteredProcessType = (e) => {
    dispatch(setProcessTaskType(e.target.value));
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskDetails]: {
          isModified: true,
          hasError: false,
        },
      })
    );
    setSelectedRegisteredProcessType(e.target.value);
    let temp = { ...localLoadedActivityPropertyData };
    temp.taskGenPropInfo.m_strSubPrcType = e.target.value;
    setlocalLoadedActivityPropertyData(temp);
  };

  console.log(localLoadedActivityPropertyData);
  const handleChangeGoal = (event) => {
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskDetails]: {
          isModified: true,
          hasError: false,
        },
      })
    );

    let temp = { ...localLoadedActivityPropertyData };
    console.log(temp);
    temp.taskGenPropInfo.m_strGoal = event.target.value;
    setlocalLoadedActivityPropertyData(temp);
  };

  const handleChangeInstructions = (event) => {
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskDetails]: {
          isModified: true,
          hasError: false,
        },
      })
    );
    let temp = { ...localLoadedActivityPropertyData };
    temp.taskGenPropInfo.m_strInstructions = event.target.value;
    setlocalLoadedActivityPropertyData(temp);
  };

  const pickListHandler = () => {
    setopenUserGroupMF(true);
    let microProps = {
      data: {
        onSelection: (list) => getUserGroupList(list),
        token: JSON.parse(localStorage.getItem("launchpadKey"))?.token,
        ext: true,
        customStyle: {
          selectedTableMinWidth: "50%", // selected user and group listing width

          listTableMinWidth: "50%", // user/ group listing width

          listHeight: "15rem", // custom height common for selected listing and user/group listing

          showUserFilter: true, // true for showing user filter, false for hiding

          showExpertiseDropDown: true, // true for showing expertise dropdown, false for hiding

          showGroupFilter: false, // true for showing group filter, false for hiding
        },
      },
      locale: "en_US",
      ContainerId: "usergroupDiv",
      Module: "ORM",

      Component: "UserGroupPicklistMF",

      InFrame: false,

      Renderer: "renderUserGroupPicklistMF",
    };
    window.loadUserGroupMF(microProps);
    console.log("picklisttttttttttt,", microProps);
  };
  const closeModalUserGroup = () => {
    setopenUserGroupMF(false);
    var elem = document.getElementById("oapweb_assetManifest");

    elem.parentNode.removeChild(elem);
  };

  const getUserGroupList = (list) => {
    let temp = global.structuredClone(localLoadedActivityPropertyData);

    list.selectedUsers.forEach((user) => {
      temp.taskGenPropInfo.genPropInfo.consultantList.push({
        consultantName: user.name,
        consultantId: user.id,
        bRenderPlus: false,
      });
    });
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskDetails]: {
          isModified: true,
          hasError: true,
        },
      })
    );
  };

  return (
    <>
      <TabsHeading heading={props?.heading} />
      <Grid container direction="column">
        {openUserGroupMF ? (
          <Modal
            show={openUserGroupMF}
            backDropStyle={{ backgroundColor: "transparent" }}
            style={{
              width: "70vw",
              height: "60vh",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              background: "white",
            }}
            modalClosed={() => {
              closeModalUserGroup();
            }}
            children={
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "white",
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "Open Sans",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "13%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "var(--title_text_font_size)",
                    paddingInline: "1rem",
                    fontWeight: "600",
                    borderBottom: "1px solid rgb(0,0,0,0.3)",
                  }}
                >
                  {t("usersAndGroups")}
                  <ClearOutlinedIcon
                    id="primary_variables_close_input_strip"
                    onClick={() => closeModalUserGroup()}
                    classes={{
                      root: classes.clearIcon,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "87%",
                  }}
                >
                  <div id="usergroupDiv"></div>
                </div>
              </div>
            }
          ></Modal>
        ) : null}
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
                    paddingTop: props.isDrawerExpanded ? "0.6rem" : "0.2rem",
                  }}
                >
                  <Grid container direction="column" spacing={2}>
                    {/*****************************************************************************************
                     * @author asloob_ali BUG ID : 112728   Description : task: the Type field for selecting synchronous and asynchronous should be present in Process task instead of new Task as compare to iBPS 5.0
                     * Reason:it was visible for every type's task.
                     *  Resolution :added check for task type.
                     *  Date : 30/08/2022             **************/}
                    {taskType === "ProcessTask" && (
                      <Grid item>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <p style={{ fontSize: "12px" }}>Type</p>
                          <Select
                            className="selectTwo_callActivity"
                            onChange={(e) =>
                              handleChangeInRegisteredProcessType(e)
                            }
                            style={{
                              width: props.isDrawerExpanded ? "280px" : "135px",
                              height: "28px",
                              background: "#ffffff 0% 0% no-repeat padding-box",
                              font: "normal normal normal 12px/17px Open Sans !important",
                              border: "1px solid #c4c4c4",
                              borderRadius: "2px",
                              fontSize: "12px",
                            }}
                            value={selectedRegisteredProcessType}
                            disabled={isReadOnly}
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
                            <MenuItem
                              className="InputPairDiv_CommonList"
                              value="S"
                              style={{ fontSize: "12px" }}
                            >
                              Synchronous
                            </MenuItem>
                            <MenuItem
                              className="InputPairDiv_CommonList"
                              value="A"
                              style={{ fontSize: "12px" }}
                            >
                              Asynchronous
                            </MenuItem>
                            <MenuItem
                              className="InputPairDiv_CommonList"
                              value="U"
                              style={{ fontSize: "12px" }}
                            >
                              User Monitored Synchronous
                            </MenuItem>
                          </Select>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: "20px",
                            marginBottom: "5px",
                            justifyContent: "space-between",
                          }}
                        >
                          <p style={{ fontSize: "12px" }}>
                            Select Registered Process
                          </p>
                          <Select
                            className="selectTwo_callActivity"
                            onChange={(e) => handleChangeInRegisteredProcess(e)}
                            style={{
                              width: props.isDrawerExpanded ? "280px" : "135px",
                              height: "28px",
                              background: "#ffffff 0% 0% no-repeat padding-box",
                              font: "normal normal normal 12px/17px Open Sans !important",
                              border: "1px solid #c4c4c4",
                              borderRadius: "2px",
                              opacity: "1",
                              fontSize: "12px",
                            }}
                            disabled={isReadOnly}
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
                                  style={{ fontSize: "12px" }}
                                >
                                  {list.ProcessName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </div>
                      </Grid>
                    )}

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
                          disabled={isReadOnly}
                          inputRef={templateNameRef}
                          onKeyPress={(e) =>
                            FieldValidations(
                              e,
                              150,
                              templateNameRef.current,
                              255
                            )
                          }
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
                        disabled={isReadOnly}
                      />
                    </Grid>

                    <Grid item xs={props.isDrawerExpanded ? 9 : 12}>
                      <Field
                        id="goalTaskDetails"
                        name="Goal"
                        required={true}
                        label={t("goal")}
                        value={goal.value}
                        disabled={isReadOnly}
                        onChange={(e) => handleChangeGoal(e)}
                        error={goal.error}
                        helperText={goal.helperText}
                        inputRef={goalRef}
                          onKeyPress={(e) =>
                            FieldValidations(
                              e,
                              168,
                              goalRef.current,
                              1000
                            )
                          }
                      />
                    </Grid>
                    <Grid item xs={props.isDrawerExpanded ? 9 : 12}>
                    {
  /*code updated on 15 September 2022 for BugId 112903*/
}
                      <Field
                        id="instructionsTaskDetails"
                        name="Instructions"
                        required={true}
                        label={t("instructions")}
                        value={instructions.value}
                        onChange={(e) => handleChangeInstructions(e)}
                        error={instructions.error}
                        helperText={instructions.helperText}
                        disabled={isReadOnly}
                        inputRef={instructionsRef}
                          onKeyPress={(e) =>
                            FieldValidations(
                              e,
                              168,
                              instructionsRef.current,
                              1000
                            )
                          }
                      />
                    </Grid>

                    <Grid item>
                      <CheckboxGroup
                        checkboxArray={[
                          { ...repeatable },
                          { ...notifyByEmail },
                        ]}
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
                        disabled={isReadOnly}
                      />
                    </Grid>
                  </Grid>
                </div>
                <Divider orientation="vertical" flexItem fullWidth />
                <div
                  style={{
                    marginLeft: "0.8rem",
                    marginRight: "0.8rem",
                    width: props.isDrawerExpanded ? "50%" : null,
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
                          disabled={isReadOnly}
                        />
                      </Grid>
                      <Grid
                        item
                        container
                        spacing={2}
                        alignItems="center"
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
                              <MoreHoriz
                                onClick={() => pickListHandler()}
                                className={classes.btnIcon}
                              />
                            }
                            disabled={true}
                          />
                        </Grid>
                        <Grid
                          item
                          className={classes.addAdvisorBtnIcon}
                          onClick={() => pickListHandler()}
                        >
                          <Typography className={classes.plusIcon}>
                            +
                          </Typography>
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
                                {!isReadOnly && (
                                  <DeleteIcon
                                    className={classes.deleteIcon}
                                    onClick={() =>
                                      handleDeleteAdvisor(advisor.consultantId)
                                    }
                                  />
                                )}
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
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};
export default connect(mapStateToProps, null)(TaskDetails);
