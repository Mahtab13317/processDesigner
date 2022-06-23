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
  activityType,
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
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
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
  const globalTemplates = useSelector(
    (state) => state.globalTaskTemplate.globalTemplates
  );

  // to call getActivityProperty API
  useEffect(() => {
    //getActivityProperty api should be called only when some cell is selected
    if (localLoadedProcessData && props.cellID && props.showDrawer) {
      if (props.cellType === getSelectedCellType("TASKTEMPLATE")) {
        setSelectedActivityIcon(taskTemplateIcon);
      } else if (props.cellType === getSelectedCellType("TASK")) {
        setSelectedActivityIcon(taskTemplateIcon);
        fetchTaskProperties();
      } else if (props.cellType === getSelectedCellType("ACTIVITY")) {
        fetchActivityProperties();
        setSelectedActivityIcon(
          getActivityProps(props.cellActivityType, props.cellActivitySubType)[0]
        );
      }
    }
  }, [props.cellID, localLoadedProcessData, props.showDrawer]);

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
    }
  }, [props.cellID, props.cellActivityType, props.cellActivitySubType]);

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

  const fetchActivityProperties = () => {
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
          setlocalLoadedActivityPropertyData(res.data);
          setoriginalProcessData(res.data);
        }
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
          dispatch(setActivityPropertyToDefault());
          setIsModified(false);
          setoriginalProcessData(localLoadedActivityPropertyData);
          setsaveCancelDisabled(true);
          if (saveCancelStatus.CloseClicked) {
            props.setShowDrawer(false);
            dispatch(setSave({ CloseClicked: false }));
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

  const postDataForCallActivity = () => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    temp.ActivityProperty["processDefId"] = localLoadedProcessData.ProcessDefId;
    axios
      .post(SERVER_URL + ENDPOINT_SAVEPROPERTY, temp.ActivityProperty)
      .then((response) => {
        if (response.data.Status === 0) {
          dispatch(setActivityPropertyToDefault());
          setIsModified(false);
          setoriginalProcessData(localLoadedActivityPropertyData);
          setsaveCancelDisabled(true);
          if (saveCancelStatus.CloseClicked) {
            props.setShowDrawer(false);
            dispatch(setSave({ CloseClicked: false }));
          }
        }
      });
  };

  const handleSaveChanges = () => {
    setShowConfirmationAlert(false);
    dispatch(setSave({ SaveClicked: true }));
    let errorTabs = handleTabError();
    if (errorTabs.length === 0) {
      if (
        props.cellType === getSelectedCellType("TASK") ||
        props.cellType === getSelectedCellType("TASKTEMPLATE")
      ) {
        saveTaskProperties();
      } else {
        postDataForCallActivity();
      }
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
    dispatch(setSave({ SaveClicked: false, CancelClicked: true }));
    dispatch(setActivityPropertyToDefault());
    setsaveCancelDisabled(true);
    setlocalLoadedActivityPropertyData(originalProcessData);
    if (saveCancelStatus.CloseClicked) {
      props.setShowDrawer(false);
      dispatch(setSave({ CloseClicked: false }));
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
              height: "1.5rem",
              width: "1.5rem",
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
  return (
    <div>
      <Drawer
        classes={{
          paper: classes.paper,
        }}
        BackdropProps={{ invisible: true }}
        anchor={direction === RTL_DIRECTION ? "left" : "right"}
        open={props.showDrawer}
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
          {props.cellType === getSelectedCellType("TASK") &&
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
