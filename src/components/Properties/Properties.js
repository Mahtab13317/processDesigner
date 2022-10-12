// #BugID - 107353
// #BugDescription - Fixed the issue for properties not being saved.
// #BugID - 107354
// #BugDescription - Fixed the issue for save changes popup being shown even after properties were saved.
import React, { useEffect, useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import Tabs from "../../UI/Tab/Tab";
import "./Properties.css";
import StopIcon from "@material-ui/icons/Stop";
import * as actionCreators from "../../redux-store/actions/Properties/showDrawerAction.js";
import { Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import { ActivityPropertyTabs } from "../../Constants/defaultTabsForActivity";
import { store, useGlobalState } from "state-pool";
import axios from "axios";
import taskTemplateIcon from "../../assets/bpmnViewIcons/TaskTemplate.svg";
import {
  SERVER_URL,
  ENDPOINT_SAVEPROPERTY,
  ENDPOINT_GET_ACTIVITY_PROPERTY,
  RTL_DIRECTION,
  TaskType,
  ENDPOINT_GET_TASK_PROPERTY,
  ENDPOINT_UPDATE_GLOBAL_TEMPLATE,
  ENDPOINT_SAVE_TASK_PROPERTY,
  ENDPOINT_DELETE_GLOBAL_TEMPLATE,
  DELETE_CONSTANT,
  MODIFY_CONSTANT,
  ENDPOINT_GET_GLOBALTASKTEMPLATES,
  propertiesLabel,
  PROCESSTYPE_LOCAL,
} from "../../Constants/appConstants";
import { getActivityProps } from "../../utility/abstarctView/getActivityProps";
import { useDispatch, useSelector, connect } from "react-redux";
import {
  ActivityPropertyChangeValue,
  setActivityPropertyToDefault,
  setActivityPropertyValues,
} from "../..//redux-store/slices/ActivityPropertyChangeSlice";
import {
  setSave,
  ActivityPropertySaveCancelValue,
} from "../../redux-store/slices/ActivityPropertySaveCancelClicked";
import Modal from "../../UI/Modal/Modal";
import PropertiesSaveAlert from "./saveAlert";
import { getSelectedCellType } from "../../utility/abstarctView/getSelectedCellType";
import CommonTabHeader from "./PropetiesTab/commonTabHeader";
import { createInstance } from "../../utility/CommonFunctionCall/CommonFunctionCall";
import SaveAsGlobalTaskTemplateModal from "./PropetiesTab/GlobalTaskTemplate/SaveAsGlobalTaskTemplateModal";
import { setToastDataFunc } from "../../redux-store/slices/ToastDataHandlerSlice";
import { setGlobalTaskTemplates } from "../../redux-store/actions/Properties/globalTaskTemplateAction";
import {
  OpenProcessSliceValue,
  setOpenProcess,
} from "../../redux-store/slices/OpenProcessSlice";
import {
  setWebservice,
  webserviceChangeVal,
} from "../../redux-store/slices/webserviceChangeSlice";
import { ProcessTaskTypeValue } from "../../redux-store/slices/ProcessTaskTypeSlice";
import { propertiesTabsForActivities as Tab } from "../../utility/propertiesTabsForActivity/propertiesTabsForActivity";
import {
  ActivityCheckoutValue,
  setCheckoutActEdited,
} from "../../redux-store/slices/ActivityCheckoutSlice";
import CheckInActivityValidation from "./CheckInActivityValidation";
import { getVariableType } from "../../utility/ProcessSettings/Triggers/getVariableType";

function PropertiesTab(props) {
  const { isDrawerExpanded, direction } = props;
  const dispatch = useDispatch();
  let { t } = useTranslation();
  const allTabStatus = useSelector(ActivityPropertyChangeValue);
  const [tabsForActivity, setTabsForActivity] = useState([]);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [isEmbeddedSubprocess, setisEmbeddedSubprocess] = useState(false);
  const loadedProcessData = store.getState("loadedProcessData");
  const originalProcess = store.getState("originalProcessData");
  const loadedActivityPropertyData = store.getState("activityPropertyData"); //current processdata clicked
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [originalProcessData, setoriginalProcessData] =
    useGlobalState(originalProcess);
  const [saveCancelDisabled, setsaveCancelDisabled] = useState(true);
  const [tabComponents, setTabComponents] = useState([]);
  const [tabsWithError, setTabsWithError] = useState([]);
  const [defaultTabValue, setDefaultTabValue] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const [selectedActivityIcon, setSelectedActivityIcon] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [isSavingAsGlobalTemp, setIsSavingAsGlobalTemp] = useState(false);
  const [initialWebservice, setInitialWebservice] = useState(null);
  const [showCheckedInAlert, setShowCheckedInAlert] = useState(false);
  const globalTemplates = useSelector(
    (state) => state.globalTaskTemplate.globalTemplates
  );
  const [initialTarget, setInitialTarget] = useState(0);
  const openProcessData = useSelector(OpenProcessSliceValue);
  const webserviceVal = useSelector(webserviceChangeVal);
  const ProcessTaskType = useSelector(ProcessTaskTypeValue);
  const CheckedAct = useSelector(ActivityCheckoutValue);

  // to call getActivityProperty API
  useEffect(() => {
    //getActivityProperty api should be called only when some cell is selected
    if (localLoadedProcessData && props.cellID && props.showDrawer) {
      if (props.cellType === getSelectedCellType("TASKTEMPLATE")) {
        setSelectedActivityIcon(taskTemplateIcon);
        dispatch(setOpenProcess({ loadedData: { ...localLoadedProcessData } }));
      } else if (props.cellType === getSelectedCellType("TASK")) {
        setSelectedActivityIcon(taskTemplateIcon);
        fetchTaskProperties();
        dispatch(setOpenProcess({ loadedData: { ...localLoadedProcessData } }));
      } else if (props.cellType === getSelectedCellType("ACTIVITY")) {
        if (
          CheckedAct.isCheckoutActEdited &&
          CheckedAct.actCheckedId !== props.cellID
        ) {
          setShowCheckedInAlert(true);
        } else {
          fetchActivityProperties();
          setSelectedActivityIcon(
            getActivityProps(
              props.cellActivityType,
              props.cellActivitySubType
            )[0]
          );
          dispatch(
            setOpenProcess({ loadedData: { ...localLoadedProcessData } })
          );
        }
      }
    }
  }, [props.cellID, props.showDrawer, props.cellType]);

  //to get global task templates
  const getGlobalTemplates = async () => {
    const axiosInstance = createInstance();
    const res = await axiosInstance.get(`${ENDPOINT_GET_GLOBALTASKTEMPLATES}`);

    if (res.data?.Status === 0) {
      const globalTemps = res.data.GlobalTemplates || [];
      dispatch(setGlobalTaskTemplates(globalTemps));
    }
  };

  useEffect(() => {
    getGlobalTemplates();
  }, []);

  // Function that runs when the component loads.
  useEffect(() => {
    if (
      props.cellType === getSelectedCellType("TASK") ||
      props.cellType === getSelectedCellType("TASKTEMPLATE")
    ) {
      let activityName = props.cellTaskType;
      ActivityPropertyTabs.forEach((item) => {
        if (item.name === activityName) {
          let tabs = [...item.components];
          let tempComp = [];
          let tabList = {};
          if (ProcessTaskType === "U") {
            //tab 48 for data tab push for user monitored synchronous
            tabs.splice(1, 0, Tab(48));
          }
          setTabsForActivity(tabs);
          tabs.forEach((tabEl) => {
            tabList = {
              ...tabList,
              [tabEl.label]: { isModified: false, hasError: false },
            };
            tempComp.push(tabEl.name);
          });

          setTabComponents(tempComp);
          dispatch(setActivityPropertyValues(tabList));
        }
      });
    } else if (props.cellType === getSelectedCellType("ACTIVITY")) {
      let activityName = getActivityProps(
        props.cellActivityType,
        props.cellActivitySubType
      )[5];
      if (+props.cellActivityType === 41 && +props.cellActivitySubType === 1) {
        setisEmbeddedSubprocess(true);
      } else setisEmbeddedSubprocess(false);
      ActivityPropertyTabs.forEach((item) => {
        if (item.name === activityName) {
          let tabs = [...item.components];

          let tempComp = [];
          let tabList = {};
          setTabsForActivity(tabs);
          tabs.forEach((tabEl) => {
            if (
              webserviceVal.webserviceChanged &&
              tabEl.label === propertiesLabel.basicDetails
            ) {
              tabList = {
                ...tabList,
                [tabEl.label]: { isModified: true, hasError: false },
              };
            } else if (
              webserviceVal.connChanged &&
              tabEl.label === propertiesLabel.basicDetails
            ) {
              tabList = {
                ...tabList,
                [tabEl.label]: { isModified: true, hasError: false },
              };
            } else {
              tabList = {
                ...tabList,
                [tabEl.label]: { isModified: false, hasError: false },
              };
            }
            tempComp.push(tabEl.name);
          });
          setTabComponents(tempComp);
          dispatch(setActivityPropertyValues(tabList));
        }
      });
    }
  }, [
    props.cellID,
    props.cellActivityType,
    props.cellActivitySubType,
    ProcessTaskType,
    props.cellType,
  ]);

  useEffect(() => {
    let isModified = false;
    Object.values(allTabStatus).forEach((obj) => {
      if (obj.isModified === true) {
        isModified = true;
        setsaveCancelDisabled(false);
      }
    });
    setIsModified(isModified);
  }, [allTabStatus]);

  useEffect(() => {
    if (saveCancelStatus.CloseClicked && isModified) {
      setShowConfirmationAlert(true);
    } else if (saveCancelStatus.CloseClicked && !isModified) {
      props.setShowDrawer(false);
      dispatch(setSave({ CloseClicked: false }));
    }
  }, [saveCancelStatus.CloseClicked, isModified]);

  useEffect(() => {
    if (!showConfirmationAlert) {
      dispatch(setSave({ CloseClicked: false }));
    }
  }, [showConfirmationAlert]);

  const setWebserviceFunc = (localActProperty) => {
    if (
      (+localActProperty?.ActivityProperty?.actType === 40 &&
        +localActProperty?.ActivityProperty?.actSubType === 1) ||
      (+localActProperty?.ActivityProperty?.actType === 23 &&
        +localActProperty?.ActivityProperty?.actSubType === 1) ||
      (+localActProperty?.ActivityProperty?.actType === 24 &&
        +localActProperty?.ActivityProperty?.actSubType === 1) ||
      (+localActProperty?.ActivityProperty?.actType === 25 &&
        +localActProperty?.ActivityProperty?.actSubType === 1) ||
      (+localActProperty?.ActivityProperty?.actType === 22 &&
        +localActProperty?.ActivityProperty?.actSubType === 1)
    ) {
      setInitialWebservice(localActProperty?.ActivityProperty?.actType);
      dispatch(
        setWebservice({
          initialWebservice: localActProperty?.ActivityProperty?.actType,
        })
      );
    }
  };

  const fetchActivityProperties = () => {
    if (
      localLoadedProcessData.ProcessType !== PROCESSTYPE_LOCAL &&
      props.cellType === getSelectedCellType("ACTIVITY") &&
      props.cellCheckedOut === "Y" &&
      CheckedAct.isCheckoutActEdited
    ) {
      let localActProperty = JSON.parse(
        JSON.stringify(CheckedAct.checkedActProp)
      );
      let targetId = 0;
      localLoadedProcessData?.Connections?.forEach((conn) => {
        if (conn.SourceId == localActProperty?.ActivityProperty?.actId) {
          targetId = conn.TargetId;
        }
      });
      setInitialTarget(targetId);
      dispatch(
        setWebservice({
          initialConn: targetId,
        })
      );
      setWebserviceFunc(localActProperty);
      setlocalLoadedActivityPropertyData(localActProperty);
      setoriginalProcessData(localActProperty);
    } else {
      getActProperty();
    }
  };

  const getActProperty = () => {
    axios
      .get(
        SERVER_URL +
          ENDPOINT_GET_ACTIVITY_PROPERTY +
          localLoadedProcessData.ProcessDefId +
          "/" +
          localLoadedProcessData.ProcessType +
          "/" +
          localLoadedProcessData.VersionNo +
          "/" +
          localLoadedProcessData.ProcessName +
          "/" +
          localLoadedProcessData.ProcessVariantType +
          "/" +
          props.cellID +
          "/" +
          props.cellName
      )
      .then((res) => {
        if (res.data.Status === 0) {
          // code added on 6 July 2022 for BugId 111910
          let localActProperty = { ...res.data };
          let targetId = 0;
          localLoadedProcessData?.Connections?.forEach((conn) => {
            if (conn.SourceId == localActProperty?.ActivityProperty?.actId) {
              targetId = conn.TargetId;
            }
          });
          localActProperty.ActivityProperty = {
            ...localActProperty?.ActivityProperty,
            targetId: targetId + "",
            // code added on 6 July 2022 for BugId 110924
            oldPrimaryAct: localActProperty?.ActivityProperty?.primaryAct
              ? localActProperty.ActivityProperty.primaryAct
              : "N",
          };
          setInitialTarget(targetId);
          dispatch(
            setWebservice({
              initialConn: targetId,
            })
          );
          setWebserviceFunc(localActProperty);
          setlocalLoadedActivityPropertyData(localActProperty);
          setoriginalProcessData(localActProperty);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTaskProperties = () => {
    const axiosInstance = createInstance();
    axiosInstance
      .get(
        `${ENDPOINT_GET_TASK_PROPERTY}/${localLoadedProcessData.ProcessDefId}/${localLoadedProcessData.ProcessType}/${props.cellID}`
      )
      .then((res) => {
        if (res.status === 200) {
          setlocalLoadedActivityPropertyData(
            res.data && res.data.length > 0 && res.data[0]
          );
          setoriginalProcessData(
            res.data && res.data.length > 0 && res.data[0]
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveTaskProperties = async () => {
    const axiosInstance = createInstance();
    let newTaskData = { ...localLoadedActivityPropertyData };
    if (props.cellType === getSelectedCellType("TASKTEMPLATE")) {
      newTaskData = {
        ...newTaskData,
        m_arrTaskTemplateVarList:
          newTaskData?.taskGenPropInfo?.taskTemplateInfo
            ?.m_arrTaskTemplateVarList,
        m_bGlobalTemplate:
          newTaskData?.taskGenPropInfo?.taskTemplateInfo?.m_bGlobalTemplate,
        m_bGlobalTemplateFormCreated:
          newTaskData?.taskGenPropInfo?.taskTemplateInfo
            ?.m_bGlobalTemplateFormCreated,
        m_bCustomFormAssoc:
          newTaskData?.taskGenPropInfo?.taskTemplateInfo?.m_bCustomFormAssoc,
        m_strTemplateName:
          newTaskData?.taskGenPropInfo?.taskTemplateInfo?.m_strTemplateName,
        m_iTemplateId:
          newTaskData?.taskGenPropInfo?.taskTemplateInfo?.m_iTemplateId,
      };
      try {
        const response = await axiosInstance.post(
          `${ENDPOINT_UPDATE_GLOBAL_TEMPLATE}`,
          {
            ...newTaskData,
            processDefId: localLoadedProcessData.ProcessDefId,
            status: MODIFY_CONSTANT,
          }
        );
        if (response.data.Status === 0) {
          toastHandler(response.data.Message, "success");
          // code added on 3 Oct 2022 for BugId 116521
          //to update task variables in open process call data
          const tempProcessData = JSON.parse(
            JSON.stringify(localLoadedProcessData)
          );
          tempProcessData?.Tasks?.forEach((task, index) => {
            if (+props.cellID === task.TaskId) {
              let taskTempVar = [];
              newTaskData?.taskGenPropInfo?.taskTemplateInfo?.m_arrTaskTemplateVarList?.forEach(
                (taskVr) => {
                  taskTempVar.push({
                    ControlType: "",
                    DBLinking: taskVr.m_strDBLinking,
                    DisplayName: taskVr.m_strDisplayName,
                    OrderId: taskVr.m_iOrderId,
                    TemplateVariableId: taskVr.m_iTempVarId,
                    VariableName: taskVr.m_strVariableName,
                    VariableType: getVariableType(
                      `${taskVr.m_strVariableType}`
                    ),
                  });
                }
              );
              tempProcessData.Tasks[index].TaskTemplateVar = [...taskTempVar];
              tempProcessData.Tasks[index].TaskMode =
                newTaskData?.taskGenPropInfo?.m_strSubPrcType;
            }
          });
          setLocalLoadedProcessData(tempProcessData);
          dispatch(setActivityPropertyToDefault());
          setIsModified(false);
          setsaveCancelDisabled(true);
          if (saveCancelStatus.CloseClicked) {
            props.setShowDrawer(false);
            dispatch(setSave({ CloseClicked: false }));
            setlocalLoadedActivityPropertyData(null);
            setoriginalProcessData(null);
          } else {
            setoriginalProcessData(localLoadedActivityPropertyData);
          }
          setToastDataFunc({
            message: response.data.message || "Saved Successfully.",
            severity: "success",
            open: true,
          });
        }
      } catch (error) {
        setToastDataFunc({
          message: error?.response?.data?.message || "server error",
          severity: "error",
          open: true,
        });
      }
    } else {
      if (
        newTaskData?.taskType !== 2 &&
        localLoadedActivityPropertyData?.taskGenPropInfo?.taskTemplateInfo
          ?.m_arrTaskTemplateVarList?.length === 0
      ) {
        dispatch(
          setToastDataFunc({
            severity: "error",
            message: "Add atleast one variable in Data Tab",
            open: "true",
          })
        );
      } else {
        try {
          const response = await axiosInstance.post(
            `${ENDPOINT_SAVE_TASK_PROPERTY}`,
            {
              ...newTaskData,
              processDefId: localLoadedProcessData.ProcessDefId,
              status: MODIFY_CONSTANT,
            }
          );
          if (response.data.Status === 0) {
            setToastDataFunc({
              message: response.data.message || "Saved Successfully.",
              severity: "success",
              open: true,
            });
            // code added on 3 Oct 2022 for BugId 116521
            //to update task variables in open process call data
            const tempProcessData = JSON.parse(
              JSON.stringify(localLoadedProcessData)
            );
            tempProcessData?.Tasks?.forEach((task, index) => {
              if (+props.cellID === task.TaskId) {
                let taskTempVar = [];
                newTaskData?.taskGenPropInfo?.taskTemplateInfo?.m_arrTaskTemplateVarList?.forEach(
                  (taskVr) => {
                    taskTempVar.push({
                      ControlType: "",
                      DBLinking: taskVr.m_strDBLinking,
                      DisplayName: taskVr.m_strDisplayName,
                      OrderId: taskVr.m_iOrderId,
                      TemplateVariableId: taskVr.m_iTempVarId,
                      VariableName: taskVr.m_strVariableName,
                      VariableType: getVariableType(
                        `${taskVr.m_strVariableType}`
                      ),
                    });
                  }
                );
                tempProcessData.Tasks[index].TaskTemplateVar = [...taskTempVar];
                tempProcessData.Tasks[index].TaskMode =
                  newTaskData?.taskGenPropInfo?.m_strSubPrcType;
              }
            });
            setLocalLoadedProcessData(tempProcessData);
            dispatch(setActivityPropertyToDefault());
            setIsModified(false);
            setoriginalProcessData(localLoadedActivityPropertyData);
            setsaveCancelDisabled(true);
            if (saveCancelStatus.CloseClicked) {
              props.setShowDrawer(false);
              dispatch(setSave({ CloseClicked: false }));
            }
          }
        } catch (error) {
          setToastDataFunc({
            message: error?.response?.data?.message || "server error",
            severity: "error",
            open: true,
          });
        }
      }
    }
  };

  const handleDeleteGlobalTemplate = async () => {
    const axiosInstance = createInstance();
    try {
      const inputPayload = {
        processDefId: localLoadedProcessData?.ProcessDefId,
        m_strTemplateName:
          localLoadedActivityPropertyData?.taskGenPropInfo?.taskTemplateInfo
            ?.m_strTemplateName,
        m_iTemplateId:
          localLoadedActivityPropertyData?.taskGenPropInfo?.taskTemplateInfo
            ?.m_iTemplateId,
        m_strStatus: DELETE_CONSTANT,
        m_arrTaskTemplateVarList:
          localLoadedActivityPropertyData?.taskGenPropInfo?.taskTemplateInfo
            ?.m_arrTaskTemplateVarList,
      };
      const response = await axiosInstance.post(
        `${ENDPOINT_DELETE_GLOBAL_TEMPLATE}`,
        inputPayload
      );
      if (response.data.Status === 0) {
        toastHandler(response.data.Message, "success");
        //deleting global template from redux store as well
        const newGlobalTemplates = [...globalTemplates].filter(
          (item) => item.m_iTemplateId !== inputPayload.m_iTemplateId
        );
        dispatch(setGlobalTaskTemplates(newGlobalTemplates));
        dispatch(setActivityPropertyToDefault());
        setIsModified(false);
        setoriginalProcessData(null);
        setsaveCancelDisabled(true);

        props.setShowDrawer(false);
        dispatch(setSave({ CloseClicked: false }));

        setToastDataFunc({
          message: response.data.message || "Deleted Successfully.",
          severity: "success",
          open: true,
        });
      }
    } catch (error) {
      setToastDataFunc({
        message: error?.response?.data?.message || "server error",
        severity: "error",
        open: true,
      });
    }
  };

  const toastHandler = (message, severity) => {
    dispatch(
      setToastDataFunc({
        message: message,
        severity: severity,
        open: true,
      })
    );
  };

  const postDataForCallActivity = () => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    if (temp) {
      temp.ActivityProperty["processDefId"] =
        localLoadedProcessData.ProcessDefId;
      axios
        .post(SERVER_URL + ENDPOINT_SAVEPROPERTY, temp.ActivityProperty)
        .then((response) => {
          if (response?.data?.Status === 0) {
            toastHandler(response.data.Message, "success");
            //to update primaryActivity flag in open process call data
            const tempProcessData = JSON.parse(
              JSON.stringify(localLoadedProcessData)
            );
            const actId = temp.ActivityProperty.actId;
            tempProcessData?.MileStones.map((milestone, mileIndex) => {
              milestone.Activities.map((act, actIindex) => {
                if (
                  act.ActivityId === actId &&
                  temp.ActivityProperty.primaryAct === "Y"
                ) {
                  act.PrimaryActivity = "Y";
                } else if (
                  act.ActivityId !== actId &&
                  temp.ActivityProperty.primaryAct === "Y"
                ) {
                  act.PrimaryActivity = "N";
                }
                if (act.ActivityId === actId) {
                  act.ImageName =
                    localLoadedActivityPropertyData?.ActivityProperty?.imageName;
                }
                if (
                  +act.ActivityType === 32 &&
                  +act.ActivitySubType === 1 &&
                  act.ActivityId === actId
                ) {
                  let taskAss = [];
                  Object.values(
                    localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
                      ?.objPMWdeskTasks?.taskMap
                  )?.forEach((el) => {
                    taskAss.push(el?.taskTypeInfo?.taskId);
                  });
                  act.AssociatedTasks = [...taskAss];
                }
                return act;
              });
              return milestone;
            });
            setLocalLoadedProcessData(tempProcessData);
            dispatch(setActivityPropertyToDefault());
            setIsModified(false);
            setsaveCancelDisabled(true);
            setWebserviceFunc(localLoadedActivityPropertyData);
            if (saveCancelStatus.CloseClicked) {
              props.setShowDrawer(false);
              dispatch(setSave({ CloseClicked: false }));
              setlocalLoadedActivityPropertyData(null);
              setoriginalProcessData(null);
            } else {
              setoriginalProcessData(localLoadedActivityPropertyData);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSaveChanges = () => {
    setShowConfirmationAlert(false);
    dispatch(setSave({ SaveClicked: true }));
    setLocalLoadedProcessData(
      JSON.parse(JSON.stringify(openProcessData.loadedData))
    );
    let errorTabs = handleTabError();
    if (errorTabs.length === 0) {
      if (
        props.cellType === getSelectedCellType("TASK") ||
        props.cellType === getSelectedCellType("TASKTEMPLATE")
      ) {
        saveTaskProperties();
      } else {
        if (
          localLoadedProcessData.ProcessType !== PROCESSTYPE_LOCAL &&
          props.cellType === getSelectedCellType("ACTIVITY") &&
          props.cellCheckedOut === "Y"
        ) {
          dispatch(
            setCheckoutActEdited({
              isCheckoutActEdited: true,
              checkedActProp: localLoadedActivityPropertyData,
              actCheckedId: props.cellID,
              actCheckedName: props.cellName,
            })
          );
          dispatch(setActivityPropertyToDefault());
          setIsModified(false);
          setsaveCancelDisabled(true);
          setWebserviceFunc(localLoadedActivityPropertyData);
          if (saveCancelStatus.CloseClicked) {
            props.setShowDrawer(false);
            dispatch(setSave({ CloseClicked: false }));
            setlocalLoadedActivityPropertyData(null);
            setoriginalProcessData(null);
          } else {
            setoriginalProcessData(localLoadedActivityPropertyData);
          }
        } else {
          postDataForCallActivity();
        }
      }
      dispatch(setWebservice({ webserviceChanged: false }));
    } else {
      let isErrorOnSameScreen = true;
      let defaultTab = null;
      tabsForActivity?.forEach((el, index) => {
        if (index === tabValue && !errorTabs.includes(el.label)) {
          isErrorOnSameScreen = false;
        }
        if (errorTabs[0] === el.label) {
          defaultTab = index;
        }
      });
      // move to first error tab in properties, only when error is not present on the opened tab
      if (!isErrorOnSameScreen) {
        setDefaultTabValue(defaultTab);
      }
    }
  };

  const handleCancelChanges = () => {
    setIsModified(false);
    setShowConfirmationAlert(false);
    setTabsWithError([]);
    setDefaultTabValue(null);
    dispatch(setWebservice({ webserviceChanged: false }));
    dispatch(setWebservice({ connChanged: false }));
    let tempLocal = JSON.parse(JSON.stringify(openProcessData.loadedData));
    tempLocal?.Connections?.forEach((conn, index) => {
      // revert the new connection added
      if (initialTarget === 0) {
        if (conn.SourceId === props.cellID) {
          tempLocal.Connections.splice(index, 1);
        }
      }
      // revert the connection deleted or modified
      else if (conn.SourceId === props.cellID) {
        tempLocal.Connections[index].TargetId = initialTarget;
      }
    });
    if (
      (+props.cellActivityType === 40 && +props.cellActivitySubType === 1) ||
      (+props.cellActivityType === 23 && +props.cellActivitySubType === 1) ||
      (+props.cellActivityType === 24 && +props.cellActivitySubType === 1) ||
      (+props.cellActivityType === 25 && +props.cellActivitySubType === 1) ||
      (+props.cellActivityType === 22 && +props.cellActivitySubType === 1)
    ) {
      tempLocal?.MileStones?.forEach((mile, index) => {
        mile.Activities?.forEach((act, actIdx) => {
          if (+act.ActivityId === +props.cellID) {
            tempLocal.MileStones[index].Activities[actIdx].ActivityType =
              initialWebservice;
          }
        });
      });
    }
    setLocalLoadedProcessData(tempLocal);
    dispatch(setSave({ SaveClicked: false, CancelClicked: true }));
    dispatch(setActivityPropertyToDefault());
    setsaveCancelDisabled(true);
    if (saveCancelStatus.CloseClicked) {
      props.setShowDrawer(false);
      dispatch(setSave({ CloseClicked: false }));
      setlocalLoadedActivityPropertyData(null);
      setoriginalProcessData(null);
    } else {
      setlocalLoadedActivityPropertyData(originalProcessData);
    }
  };

  const handleTabError = () => {
    let temp = [];
    Object.keys(allTabStatus).forEach((tab) => {
      if (allTabStatus[tab].hasError) {
        temp.push(tab);
      }
    });
    setTabsWithError(temp);
    return temp;
  };

  const useStyles = makeStyles(() => ({
    paper: {
      height: "75vh",
      top: "18.5%",
      overflowY: "visible !important",
      overflowX: "visible !important",
      width: isDrawerExpanded ? "100vw" : "27vw",
    },
  }));

  const classes = useStyles();
  const toolTipLabels = tabsForActivity?.map((item, index) => {
    return (
      <Tooltip title={t(item.toolTip)} placement="left">
        {item.icon ? (
          <img
            src={
              index === tabValue && item.icon_enabled
                ? item.icon_enabled
                : item.icon
            }
            style={{
              height: "auto",
              width: "1.75rem",
              backgroundColor: tabsWithError.includes(item.label)
                ? "red"
                : null,
            }}
            alt=""
          />
        ) : (
          <StopIcon
            style={{
              color: "#A19882",
              height: "1.8rem",
              width: "1.8rem",
              backgroundColor: tabsWithError.includes(item.label)
                ? "red"
                : null,
            }}
          />
        )}
      </Tooltip>
    );
  });

  const list = () => (
    <div style={{ height: "100%" }}>
      <Tabs
        direction={direction}
        tabStyling="properties_TabStyling"
        orientation="vertical"
        tabContainer="tabContainer"
        tabType={
          isDrawerExpanded
            ? "mainTab_properties_expandedView"
            : "mainTab_properties"
        }
        tabContentStyle={
          props.isDrawerExpanded &&
          props.cellActivityType == "18" &&
          props.cellActivitySubType == "1"
            ? "properties_mainTabContentStyle_Expanded"
            : "properties_mainTabContentStyle"
        }
        tabBarStyle={
          isDrawerExpanded
            ? "properties_mainTabBarStyle_expandedView"
            : "properties_mainTabBarStyle"
        }
        oneTabStyle="properties_mainOneTabStyle"
        TabNames={toolTipLabels}
        TabElement={tabComponents}
        defaultTabValue={defaultTabValue}
        isEmbeddedSubProcess={isEmbeddedSubprocess}
        setValue={setTabValue}
      />
    </div>
  );

  const handleSaveAsGlobalTemplate = () => {
    setIsSavingAsGlobalTemp(true);
  };

  const handleCloseGlobalTempModal = () => {
    setIsSavingAsGlobalTemp(false);
  };

  const handleCheckInActPropRevert = () => {
    dispatch(
      setCheckoutActEdited({
        isCheckoutActEdited: false,
        checkedActProp: {},
        actCheckedId: null,
        actCheckedName: null,
      })
    );
    getActProperty();
    setShowCheckedInAlert(false);
  };

  return (
    <div>
      <Drawer
        classes={{
          paper: classes.paper,
        }}
        BackdropProps={{ invisible: true }}
        anchor={direction === RTL_DIRECTION ? "left" : "right"}
        open={showCheckedInAlert ? false : props.showDrawer}
      >
        <CommonTabHeader
          activityType={props.cellActivityType}
          activitySubType={props.cellActivitySubType}
          cellName={props.cellName}
          cellType={props.cellType}
          selectedActivityIcon={selectedActivityIcon}
        />
        <hr style={{ opacity: "0.5", width: "100%" }} />
        {list()}
        <div
          className={
            direction === RTL_DIRECTION
              ? "propertiesFooterButtons_rtl"
              : "propertiesFooterButtons"
          }
        >
          {props.cellType === getSelectedCellType("TASK") &&
          props.cellTaskType === TaskType.globalTask &&
          localLoadedActivityPropertyData?.taskGenPropInfo?.taskTemplateInfo
            ?.m_bGlobalTemplate &&
          isDrawerExpanded ? (
            <button
              id="propertiesGlobalTempDeleteButton"
              className={"propertiesGlobalTempDeleteButton"}
              onClick={handleDeleteGlobalTemplate}
              style={{
                marginLeft: direction === RTL_DIRECTION ? "" : "auto",
                marginRight: direction === RTL_DIRECTION ? "auto" : "",
              }}
            >
              {t("delete")}
            </button>
          ) : null}
          <button
            id="propertiesDiscardButton"
            disabled={saveCancelDisabled}
            onClick={handleCancelChanges}
            className={
              saveCancelDisabled
                ? "properties_disabledButton"
                : "properties_cancelButton"
            }
          >
            {t("discard")}
          </button>
          {/* {props.cellType === getSelectedCellType("TASK") &&
          props.cellTaskType === TaskType.globalTask &&
          localLoadedActivityPropertyData?.taskGenPropInfo?.taskTemplateInfo
            ?.m_bGlobalTemplate === false &&
          isDrawerExpanded ? (
            <button
              id="propertiesGlobalTempButton"
              className={"propertiesGlobalTempButton"}
              onClick={handleSaveAsGlobalTemplate}
            >
              {t("SaveAsGlobalTemplate")}
            </button>
          ) : null} */}
          {
            //code added on 11 October 2022 for BugId 116930
          }
          {props.cellType === getSelectedCellType("TASK") &&
          props.cellTaskType === TaskType.globalTask &&
          localLoadedActivityPropertyData?.taskGenPropInfo?.taskTemplateInfo
            ?.m_bGlobalTemplate === false ? (
            <button
              id="propertiesGlobalTempButton"
              className={"propertiesGlobalTempButton"}
              onClick={handleSaveAsGlobalTemplate}
            >
              {t("SaveAsGlobalTemplate")}
            </button>
          ) : null}
          <button
            id="propertiesSaveButton"
            disabled={saveCancelDisabled}
            onClick={handleSaveChanges}
            className={
              saveCancelDisabled
                ? "properties_disabledButton"
                : "properties_saveButton"
            }
          >
            {t("saveChanges")}
          </button>
        </div>
        {showConfirmationAlert ? (
          <Modal
            show={showConfirmationAlert}
            backDropStyle={{ backgroundColor: "transparent" }}
            style={{
              top: "40%",
              left: "40%",
              width: "327px",
              padding: "0",
              zIndex: "1500",
              boxShadow: "0px 3px 6px #00000029",
              border: "1px solid #D6D6D6",
              borderRadius: "3px",
            }}
            modalClosed={() => setShowConfirmationAlert(false)}
            children={
              <PropertiesSaveAlert
                setShowConfirmationAlert={setShowConfirmationAlert}
                saveChangesFunc={handleSaveChanges}
                discardChangesFunc={handleCancelChanges}
              />
            }
          />
        ) : null}
        {isSavingAsGlobalTemp && (
          <SaveAsGlobalTaskTemplateModal
            isOpen={isSavingAsGlobalTemp}
            handleClose={handleCloseGlobalTempModal}
          />
        )}
      </Drawer>
      {showCheckedInAlert ? (
        <Modal
          show={showCheckedInAlert}
          style={{
            top: "40%",
            left: "35%",
            width: "30%",
            padding: "0",
            zIndex: "1500",
            boxShadow: "0px 3px 6px #00000029",
            border: "1px solid #D6D6D6",
            borderRadius: "3px",
          }}
          children={
            <CheckInActivityValidation
              discardChangesFunc={() => {
                setShowCheckedInAlert(false);
                props.setShowDrawer(false);
              }}
              saveChangesFunc={handleCheckInActPropRevert}
              actName={CheckedAct.actCheckedName}
            />
          }
        />
      ) : null}
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
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
    cellTaskType: state.selectedCellReducer.selectedTaskType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setShowDrawer: (flag) => dispatch(actionCreators.showDrawer(flag)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesTab);
