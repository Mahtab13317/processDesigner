// Changes made to solve Bug with Id 113573 => Basicdetails=>associatedqueue and use swimlane queue not working in expanded mode
import React, { useState, useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import "../../Properties.css";
import { useTranslation } from "react-i18next";
import SunEditor from "../../../../UI/SunEditor/SunTextEditor";
import { connect } from "react-redux";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { store, useGlobalState } from "state-pool";
import * as actionCreators from "../../../../redux-store/actions/selectedCellActions";
import CreateIcon from "@material-ui/icons/Create";
import FormsAndValidations from "./FormsAndValidations";
import {
  activityType,
  SERVER_URL,
  ENDPOINT_ADD_CONNECTION,
  ENDPOINT_DELETE_CONNECTION,
  ENDPOINT_MODIFY_CONNECTION,
  WEBSERVICESOAP,
  WEBSERVICEREST,
  RESCONSUMERJMS,
  RESCONSUMERSOAP,
  REQUESTCONSUMERSOAP,
  propertiesLabel,
} from "../../../../Constants/appConstants.js";
import PeopleAndSystems from "./PeopleAndSystems";
import EditOutlinedIcon from "@material-ui/icons/Edit";
import {
  arrMobileEnabledAbsent,
  arrEntrySettingsPresent,
  arrFormValidationAbsent,
} from "../../PropertyTabConstants";
import SetIconWithActivityType from "./SetIconWithActivityType.js";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { ChangeActivityType } from "../../../../utility/CommonAPICall/ChangeActivityType";
import { noIncomingTypes } from "../../../../utility/bpmnView/noIncomingTypes.js";
import TextInput from "../../../../UI/Components_With_ErrrorHandling/InputField";
// -----------------
import { useDispatch, useSelector } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import QueueAssociation from "../QueueAssociation/index.js";
import Modal from "../../../../UI/Modal/Modal.js";
import { getSelectedCellType } from "../../../../utility/abstarctView/getSelectedCellType.js";
import {
  OpenProcessSliceValue,
  setOpenProcess,
} from "../../../../redux-store/slices/OpenProcessSlice";
import {
  setWebservice,
  webserviceChangeVal,
} from "../../../../redux-store/slices/webserviceChangeSlice";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

function BasicDetails(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const [selfQueueCreated, setSelfQueueCreated] = useState(false);
  const [addDescriptionBoolean, setAddDescriptionBoolean] = useState(false);
  const [configPeopleAndSystem, setConfigPeopleAndSystem] = useState(false);
  const localActivityPropertyData = store.getState("activityPropertyData");
  const calendarList = store.getState("calendarList");
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

  const [localCalendarList, setlocalCalendarList] =
    useGlobalState(calendarList);
  const [
    localLoadedActivityPropertyData,
    setlocalLoadedActivityPropertyData,
    updatelocalLoadedActivityPropertyData,
  ] = useGlobalState(localActivityPropertyData);
  const [selectedWebService, setSelectedWebService] = useState(null);
  const [targetId, setTargetId] = useState("None");
  const [basicDetails, setbasicDetails] = useState({});
  const [spinner, setspinner] = useState(true);
  const [allActivitiesTargetDropdown, setAllActivitiesTargetDropdown] =
    useState([]);
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  const [selectedRegisteredProcess, setSelectedRegisteredProcess] =
    useState(null);
  const [deployedProcesses, setDeployedProcesses] = useState([]);
  const [showCostError, setShowCostError] = useState(false);
  const [costInput, setCostInput] = useState();
  const [queueType, setQueueType] = useState(0);
  const [isUsingSwimlaneQueue, setIsUsingSwimlaneQueue] = useState(false);
  const [isUsingSelfQueue, setIsUsingSelfQueue] = useState(false);
  const [showQueueModal, setShowQueueModal] = useState(false);
  // code added on 6 July 2022 for BugId 111910
  const openProcessData = useSelector(OpenProcessSliceValue);
  // code added on 6 July 2022 for BugId 110924
  const [hasDefaultCheck, setHasDefaultCheck] = useState(false);
  const [defaultCheckDisabled, setDefaultCheckDisabled] = useState(false);
  const [localState, setLocalState] = useState(null);
  const webserviceVal = useSelector(webserviceChangeVal);
  const [showCalenderMFBool, setshowCalenderMFBool] = useState(false);
  const webServiceDropdownOptions = [
    {
      value: WEBSERVICESOAP,
      activityType: 22,
      activitySubType: 1,
      name: t("webServiceSOAP"),
    },
    {
      value: WEBSERVICEREST,
      activityType: 40,
      activitySubType: 1,
      name: t("webServiceREST"),
    },
    {
      value: RESCONSUMERJMS,
      activityType: 23,
      activitySubType: 1,
      name: t("resConsumerJms"),
    },
    {
      value: RESCONSUMERSOAP,
      activityType: 25,
      activitySubType: 1,
      name: t("resConsumerSoap"),
    },
    {
      value: REQUESTCONSUMERSOAP,
      activityType: 24,
      activitySubType: 1,
      name: t("requestConsumerSoap"),
    },
  ];
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut);
  console.log("444", "read status", isReadOnly);
  useEffect(() => {
    let flag = false;
    localLoadedProcessData?.Lanes?.map((el) => {
      if (el.QueueId == props.cellQueueId) {
        flag = true;
      }
    });
    if (flag) {
      setIsUsingSwimlaneQueue(true);
      setIsUsingSelfQueue(false);
    } else {
      setIsUsingSwimlaneQueue(false);
      setIsUsingSelfQueue(true);
      setSelfQueueCreated(true);
    }
  }, []);

  useEffect(() => {
    if (
      (props.cellActivityType === 18 && props.cellActivitySubType === 1) ||
      (props.cellActivityType === 2 && props.cellActivitySubType === 2)
    ) {
      axios.get(SERVER_URL + `/getprocesslist/R/-1`).then((res) => {
        if (res.data.Status === 0) {
          setDeployedProcesses(res.data.Processes);
        }
      });
    }
    let activityProps = getActivityProps(
      props.cellActivityType,
      props.cellActivitySubType
    );
    setSelectedActivityType(activityProps[5]);
  }, []);

  useEffect(() => {
    if (props.cellActivityType === 18 && props.cellActivitySubType === 1) {
      setSelectedRegisteredProcess(
        localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
          ?.importedProcessName
      );
    } else if (
      props.cellActivityType === 2 &&
      props.cellActivitySubType === 2
    ) {
      setSelectedRegisteredProcess(
        localLoadedActivityPropertyData?.ActivityProperty?.pMMessageEnd
          ?.processName
      );
    }
  }, [deployedProcesses, localLoadedActivityPropertyData]);

  useEffect(() => {
    let temp = JSON.parse(JSON.stringify(openProcessData.loadedData));
    setLocalState(temp);
    getAllActivities();
  }, [openProcessData.loadedData]);

  useEffect(() => {
    if (localLoadedActivityPropertyData?.Status === 0) {
      setbasicDetails({ ...localLoadedActivityPropertyData?.ActivityProperty });
      if (
        (+localLoadedActivityPropertyData?.ActivityProperty?.actType === 40 &&
          +localLoadedActivityPropertyData?.ActivityProperty?.actSubType ===
            1) ||
        (+localLoadedActivityPropertyData?.ActivityProperty?.actType === 23 &&
          +localLoadedActivityPropertyData?.ActivityProperty?.actSubType ===
            1) ||
        (+localLoadedActivityPropertyData?.ActivityProperty?.actType === 24 &&
          +localLoadedActivityPropertyData?.ActivityProperty?.actSubType ===
            1) ||
        (+localLoadedActivityPropertyData?.ActivityProperty?.actType === 25 &&
          +localLoadedActivityPropertyData?.ActivityProperty?.actSubType ===
            1) ||
        (+localLoadedActivityPropertyData?.ActivityProperty?.actType === 22 &&
          +localLoadedActivityPropertyData?.ActivityProperty?.actSubType === 1)
      ) {
        webServiceDropdownOptions.forEach((item) => {
          if (
            +localLoadedActivityPropertyData?.ActivityProperty?.actType ===
              +item.activityType &&
            +localLoadedActivityPropertyData?.ActivityProperty?.actSubType ===
              +item.activitySubType
          ) {
            setSelectedWebService(item.value);
          }
        });
      }
      setTargetId(localLoadedActivityPropertyData?.ActivityProperty?.targetId);
      setspinner(false);
      // code added on 6 July 2022 for BugId 110924
      setHasDefaultCheck(
        localLoadedActivityPropertyData?.ActivityProperty?.primaryAct === "Y"
      );
      setDefaultCheckDisabled(
        localLoadedActivityPropertyData?.ActivityProperty?.oldPrimaryAct === "Y"
      );
      let valid = validateActivity();
      if (!valid) {
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.basicDetails]: {
              isModified: false,
              hasError: true,
            },
          })
        );
      }
    }
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    if (saveCancelStatus.CancelClicked) {
      webServiceDropdownOptions.forEach((item) => {
        if (+webserviceVal.initialWebservice === +item.activityType) {
          setSelectedWebService(item.value);
        }
      });
      if (
        (+props.cellActivityType === 40 && +props.cellActivitySubType === 1) ||
        (+props.cellActivityType === 23 && +props.cellActivitySubType === 1) ||
        (+props.cellActivityType === 24 && +props.cellActivitySubType === 1) ||
        (+props.cellActivityType === 25 && +props.cellActivitySubType === 1) ||
        (+props.cellActivityType === 22 && +props.cellActivitySubType === 1)
      ) {
        props.selectedCell(
          props.cellID,
          props.cellName,
          webserviceVal.initialWebservice,
          1,
          null,
          null,
          getSelectedCellType("ACTIVITY"),
          props.cellCheckedOut
        );
      }
    }
    if (saveCancelStatus.SaveClicked) {
      const { mileStoneIndex, activityIndex, activityId } =
        getActivityDetailsFromOpenProcess(props.cellID);
      let tempOpenProcess = JSON.parse(JSON.stringify(localLoadedProcessData));
      if (
        (+props.cellActivityType === 40 && +props.cellActivitySubType === 1) ||
        (+props.cellActivityType === 23 && +props.cellActivitySubType === 1) ||
        (+props.cellActivityType === 24 && +props.cellActivitySubType === 1) ||
        (+props.cellActivityType === 25 && +props.cellActivitySubType === 1) ||
        (+props.cellActivityType === 22 && +props.cellActivitySubType === 1)
      ) {
        // code edited on 22 Aug 2022 for BugId 114418
        if (
          +props.cellActivityType !== +webserviceVal.initialWebservice &&
          mileStoneIndex &&
          activityIndex
        ) {
          ChangeActivityType(
            tempOpenProcess?.ProcessDefId,
            props.cellName,
            tempOpenProcess.MileStones[mileStoneIndex].Activities[activityIndex]
              .ActivityType,
            tempOpenProcess.MileStones[mileStoneIndex].Activities[activityIndex]
              .ActivitySubType,
            setLocalLoadedProcessData,
            mileStoneIndex,
            activityIndex,
            activityId
          );
        }
      }
      if (
        webserviceVal.connChanged &&
        +webserviceVal.initialConn !== +targetId
      ) {
        targetWorkstepApi(tempOpenProcess);
      }
    }
    dispatch(setSave({ SaveClicked: false, CancelClicked: false }));
  }, [saveCancelStatus.CancelClicked, saveCancelStatus.SaveClicked]);

  const validateActivity = () => {
    if (+props.cellActivityType === 18 && +props.cellActivitySubType === 1) {
      if (
        localLoadedActivityPropertyData?.ActivityProperty?.SubProcess?.importedProcessDefId?.trim() ===
          "" ||
        !localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
          ?.importedProcessDefId
      ) {
        return false;
      }
    }
    return true;
  };

  const getAllActivities = () => {
    let actList = [];
    let temp = JSON.parse(JSON.stringify(openProcessData.loadedData));
    temp?.MileStones?.forEach((mileStone) => {
      mileStone?.Activities?.forEach((activity) => {
        if (
          activity.ActivityId !== props.cellID &&
          noIncomingTypes(activity, t)
        ) {
          actList = [...actList, activity];
        }
      });
    });
    setAllActivitiesTargetDropdown(actList);
  };

  const getActivityDetailsFromOpenProcess = (activityId) => {
    let activityDetails = {
      mileStoneIndex: "",
      activityIndex: "",
      activityId: "",
    };
    localState?.MileStones?.forEach((mileStone, indexMilestone) => {
      mileStone?.Activities?.forEach((activity, indexActivity) => {
        if (activity.ActivityId == activityId) {
          activityDetails = {
            mileStoneIndex: indexMilestone,
            activityIndex: indexActivity,
            activityId: activityId,
            activityName: activity.ActivityName,
          };
        }
      });
    });
    return activityDetails;
  };

  // code edited on 22 July 2022 for BugId 113313
  const onSelect = (e) => {
    const { mileStoneIndex, activityIndex, activityId } =
      getActivityDetailsFromOpenProcess(props.cellID);
    let actType, actSubType;
    webServiceDropdownOptions.forEach((item) => {
      if (e.target.value === item.value) {
        actType = item.activityType;
        actSubType = item.activitySubType;
      }
    });
    props.selectedCell(
      activityId,
      props.cellName,
      actType,
      actSubType,
      null,
      null,
      getSelectedCellType("ACTIVITY"),
      props.cellCheckedOut
    );
    let temp = { ...localLoadedActivityPropertyData };
    temp.ActivityProperty.actType = actType;
    temp.ActivityProperty.actSubType = actSubType;
    setlocalLoadedActivityPropertyData(temp);
    let tempLocal = { ...localState };
    tempLocal.MileStones[mileStoneIndex].Activities[
      activityIndex
    ].ActivityType = actType;
    tempLocal.MileStones[mileStoneIndex].Activities[
      activityIndex
    ].ActivitySubType = actSubType;
    dispatch(setOpenProcess({ loadedData: tempLocal }));
    dispatch(setWebservice({ webserviceChanged: true }));
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: { isModified: true, hasError: false },
      })
    );
  };

  const useStyles = makeStyles({
    input: {
      height: "var(--line_height)",
    },
    inputWithError: {
      height: "var(--line_height)",
      width: "5.875rem",
    },
    errorStatement: {
      color: "red",
      fontSize: "11px",
    },
    mainDiv: {
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      height: "61vh",
      fontFamily: "Open Sans",
      width: "100%",
      paddingTop: props.isDrawerExpanded ? "0" : "0.4rem",
      direction: direction,
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
  });

  const classes = useStyles();

  const getSelectedActivity = (data) => {
    let temp = JSON.parse(JSON.stringify(localState));
    let maxConnId = 0;
    temp.Connections?.forEach((conn) => {
      if (+conn.ConnectionId > +maxConnId) {
        maxConnId = +conn.ConnectionId;
      }
    });
    let newConnection = {
      ConnectionId: maxConnId + 1,
      Type: "D",
      SourceId: props.cellID,
      TargetId: data,
      xLeft: [],
      yTop: [],
    };

    if (data === 0) {
      temp.Connections?.forEach((el) => {
        if (el.SourceId == props.cellID) {
          let pos = temp.Connections.map(function (e) {
            return e.SourceId;
          }).indexOf(+props.cellID);
          temp.Connections[pos].TargetId = data;
          // method = DELETE;
        }
      });
    } else {
      if (temp.Connections.length !== 0) {
        let editBool = false,
          indexVal = null;
        temp.Connections.forEach((el, index) => {
          if (+el.SourceId === props.cellID) {
            editBool = true;
            indexVal = index;
          }
        });
        if (editBool) {
          temp.Connections[indexVal].TargetId = newConnection.TargetId;
          newConnection = temp.Connections[indexVal];
          // method = EDIT;
        } else {
          temp.Connections.push(newConnection);
          // method = ADD;
        }
      } else {
        temp.Connections.push(newConnection);
        // method = ADD;
      }
    }
    dispatch(setOpenProcess({ loadedData: JSON.parse(JSON.stringify(temp)) }));
    dispatch(setWebservice({ connChanged: true }));
    // code added on 6 July 2022 for BugId 111910
    let localAct = { ...localLoadedActivityPropertyData };
    localAct.ActivityProperty = {
      ...localAct?.ActivityProperty,
      targetId: data + "",
    };
    setlocalLoadedActivityPropertyData(localAct);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };

  const targetWorkstepApi = async (temp) => {
    let data = {};
    if (+targetId === 0) {
      temp?.Connections?.forEach((conn) => {
        if (+conn.SourceId === +props.cellID && +conn.TargetId === 0) {
          data = conn;
        }
      });
      let payload = {
        processDefId: temp?.ProcessDefId,
        processMode: temp?.ProcessType,
        connId: data.ConnectionId,
        connType: data.Type,
      };
      const res = await axios.post(
        SERVER_URL + ENDPOINT_DELETE_CONNECTION,
        payload
      );
      const resData = await res.data;
      if (resData.Status === 0) {
        let pos = temp.Connections.map(function (e) {
          return e.SourceId;
        }).indexOf(+props.cellID);
        temp.Connections.splice(pos, 1);
        // code added on 5 August 2022 for BugId 113918
        dispatch(setWebservice({ connChanged: false }));
      }
    } else {
      temp?.Connections?.forEach((conn) => {
        if (+conn.SourceId === +props.cellID) {
          data = conn;
        }
      });
      let payload = {
        processDefId: temp?.ProcessDefId,
        processMode: temp?.ProcessType,
        connId: data.ConnectionId,
        sourceId: data.SourceId,
        targetId: data.TargetId,
        connType: data.Type,
      };
      if (webserviceVal.initialConn === 0) {
        const res = await axios.post(
          SERVER_URL + ENDPOINT_ADD_CONNECTION,
          payload
        );
        const resData = await res.data;
        if (resData.Status === 0) {
          // code added on 5 August 2022 for BugId 113918
          dispatch(setWebservice({ connChanged: false }));
          return 0;
        }
      } else if (webserviceVal.initialConn !== 0) {
        const res = await axios.post(
          SERVER_URL + ENDPOINT_MODIFY_CONNECTION,
          payload
        );
        const resData = await res.data;
        if (resData.Status === 0) {
          // code added on 5 August 2022 for BugId 113918
          dispatch(setWebservice({ connChanged: false }));
          return 0;
        }
      }
    }
  };

  const HandleRegisteredProcessChange = (e) => {
    setSelectedRegisteredProcess(e.target.value);
    let tempLocalState = JSON.parse(
      JSON.stringify(localLoadedActivityPropertyData)
    );
    if (props.cellActivityType === 2 && props.cellActivitySubType === 2) {
      tempLocalState.ActivityProperty.pMMessageEnd.mapFwdVarMapping = {};
      tempLocalState.ActivityProperty.pMMessageEnd.processName = e.target.value;
    } else {
      tempLocalState.ActivityProperty.SubProcess = {
        importedProcessName: e.target.value,
      };
    }
    deployedProcesses?.map((process) => {
      if (process.ProcessName == e.target.value) {
        {
          props.cellActivityType === 2 && props.cellActivitySubType === 2
            ? (tempLocalState.ActivityProperty.pMMessageEnd.processId =
                process.ProcessDefId)
            : tempLocalState?.ActivityProperty?.SubProcess
            ? (tempLocalState.ActivityProperty.SubProcess.importedProcessDefId =
                process.ProcessDefId)
            : (tempLocalState.ActivityProperty.SubProcess = {
                ...tempLocalState.ActivityProperty.SubProcess,
                importedProcessDefId: process.ProcessDefId,
              });
        }
      }
    });
    setlocalLoadedActivityPropertyData(tempLocalState);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: { isModified: true, hasError: false },
        [propertiesLabel.fwdVarMapping]: { isModified: true, hasError: true },
        [propertiesLabel.revVarMapping]: { isModified: true, hasError: true },
      })
    );
  };

  const editQueueHandler = () => {
    if (isReadOnly) {
    } else {
      setShowQueueModal(true);
      queueType == 0 ? setQueueType(1) : setQueueType(0);
    }
  };

  const changeBasicDetails = (e, customName) => {
    if (e.target.name === "mobileEnabled") {
      updatelocalLoadedActivityPropertyData((prev) => {
        prev.ActivityProperty.isMobileEnabled = e.target.checked;
      });
    } else if (e.target.name === "cost") {
      updatelocalLoadedActivityPropertyData((prev) => {
        prev.ActivityProperty.actGenPropInfo.genPropInfo.cost = e.target.value;
      });
    } else if (e.target.name === "formEnabled") {
      updatelocalLoadedActivityPropertyData((prev) => {
        prev.ActivityProperty.actGenPropInfo.m_bFormView = e.target.checked;
      });
    }
    if (customName) {
      if (customName === "descBasicDetails") {
        updatelocalLoadedActivityPropertyData((prev) => {
          prev.ActivityProperty.actGenPropInfo.genPropInfo.description =
            e.target.innerText;
        });
      }
      if (customName === "validationBasicDetails") {
        updatelocalLoadedActivityPropertyData((prev) => {
          prev.ActivityProperty.actGenPropInfo.genPropInfo.customValidation =
            e.target.innerText;
        });
      }
    }

    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: { isModified: true, hasError: false },
      })
    );
  };

  const checkQueueType = (cellActivityType, cellActivitySubType) => {
    if (
      // Default Queues
      (cellActivityType == 1 && cellActivitySubType == 1) ||
      (cellActivityType == 1 && cellActivitySubType == 3) ||
      (cellActivityType == 10 && cellActivitySubType == 7) ||
      (cellActivityType == 32 && cellActivitySubType == 1) ||
      (cellActivityType == 1 && cellActivitySubType == 2) ||
      (cellActivityType == 30 && cellActivitySubType == 1) ||
      (cellActivityType == 33 && cellActivitySubType == 1) ||
      (cellActivityType == 27 && cellActivitySubType == 1) ||
      (cellActivityType == 19 && cellActivitySubType == 1) ||
      (cellActivityType == 21 && cellActivitySubType == 1) ||
      (cellActivityType == 4 && cellActivitySubType == 1)
    ) {
      return 1;
    } else if (
      // No Queues to show on front End
      (cellActivityType == 41 && cellActivitySubType == 1) ||
      (cellActivityType == 10 && cellActivitySubType == 1) ||
      (cellActivityType == 20 && cellActivitySubType == 1) ||
      (cellActivityType == 29 && cellActivitySubType == 1) ||
      (cellActivityType == 22 && cellActivitySubType == 1) ||
      (cellActivityType == 31 && cellActivitySubType == 1) ||
      (cellActivityType == 10 && cellActivitySubType == 4)
    ) {
      return 0;
    } else if (
      // Add Queues
      (cellActivityType == 10 && cellActivitySubType == 7) ||
      (cellActivityType == 10 && cellActivitySubType == 3) ||
      (cellActivityType == 26 && cellActivitySubType == 1)
    ) {
      return 2;
    }
  };

  const handleOwnQueueCheck = () => {
    setIsUsingSwimlaneQueue(!isUsingSwimlaneQueue);
    setIsUsingSelfQueue(!isUsingSelfQueue);
  };

  const handleSwimlaneQueueCheck = () => {
    setIsUsingSwimlaneQueue(!isUsingSwimlaneQueue);
    setIsUsingSelfQueue(!isUsingSelfQueue);
  };

  const queueContent = () => {
    if (
      checkQueueType(props.cellActivityType, props.cellActivitySubType) == 1
    ) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <p style={{ fontSize: "12px", cursor: "pointer" }}>
            {t("accInitiativeQueue")}&nbsp;
            <CreateIcon
              style={{ height: "15px", width: "15px" }}
              onClick={editQueueHandler}
              disabled={isReadOnly}
            />
          </p>
        </div>
      );
    } else if (
      checkQueueType(props.cellActivityType, props.cellActivitySubType) == 0 ||
      (isUsingSwimlaneQueue && props.openProcessType == "R")
    ) {
      return null;
    } else if (
      checkQueueType(props.cellActivityType, props.cellActivitySubType) == 2
    ) {
      return (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p style={{ fontSize: "var(--base_text_font_size)" }}>
              <Checkbox
                disabled={selfQueueCreated ? true : false}
                checked={isUsingSwimlaneQueue}
                onChange={() => handleSwimlaneQueueCheck()}
                name="UseSwimlane"
              />{" "}
              Use Swimlane Queue
              {isUsingSwimlaneQueue ? (
                <CreateIcon
                  style={{
                    cursor: "pointer",
                    width: "1.5em",
                    height: "1em",
                  }}
                  onClick={() => setShowQueueModal(true)}
                />
              ) : null}
            </p>
            <p style={{ fontSize: "var(--base_text_font_size)" }}>
              <Checkbox
                checked={isUsingSelfQueue}
                onChange={() => handleOwnQueueCheck()}
                name="UseOwn"
              />{" "}
              Create Own Queue
              {isUsingSelfQueue ? (
                <CreateIcon
                  style={{
                    cursor: "pointer",
                    width: "1.5em",
                    height: "1em",
                  }}
                  onClick={() => setShowQueueModal(true)}
                />
              ) : null}
            </p>
          </div>
        </div>
      );
    }
  };

  // code added on 6 July 2022 for BugId 110924
  const setDefaultCheckFunc = (e) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    if (e.target.checked) {
      temp.ActivityProperty.primaryAct = "Y";
    } else {
      temp.ActivityProperty.primaryAct = "N";
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: { isModified: true, hasError: false },
      })
    );
  };

  const getDistributeCount = () => {
    let count = 0;
    localLoadedProcessData.Connections.forEach((conn) => {
      if (conn.SourceId === props.cellID) count++;
    });
    return count;
  };
  const handleQueueSwitching = () => {
    // queueType == 0?setQueueType(1):setQueueType(0);
    setShowQueueModal(true);
  };

  const addNewCalendar = (data) => {
    let temp = global.structuredClone(localCalendarList);
    temp.push({
      CalendarName: data.calName,
      CalendarId: data.calId,
      DefinedWithProcessDefId:
        data.calType === "L" ? localLoadedProcessData.ProcessDefId : "0",
    });
    setlocalCalendarList(temp);
  };

  const openCalenderMf = () => {
    let microProps = {
      Component: "ProcessCalendar", // change here
      Callback: (data) => addNewCalendar(data),
      source: "CAL_PRO",
      popupIndex: "1",
      ProcessDefinitionId: localLoadedProcessData.ProcessDefId + "",
      calId: -1,
      AssociationFlag: "N",
      CalendarType: "G",
      RegisteredProcess:
        localLoadedProcessData?.ProcessType === "R" ? "Y" : "N",
      ActivityId: +props.cellID,
      ContainerId: "calenderDiv",
      Module: "WCL",
      InFrame: false,
      Renderer: "renderProcessCalendar",
      closeDialog: () => {
        setshowCalenderMFBool(false);
        var elem = document.getElementById("oapweb_assetManifest");

        elem.parentNode.removeChild(elem);
      },
    };
    window.MdmDataModel(microProps);
    if (isReadOnly) {
    } else {
      setshowCalenderMFBool(true);
    }
  };

  const handleCalendarChange = (e) => {
    let calName = "";
    let temp = global.structuredClone(localLoadedActivityPropertyData);
    temp.ActivityProperty.actGenPropInfo.calendarType =
      e.target.value.substring(0, 1);
    temp.ActivityProperty.actGenPropInfo.calendarId =
      e.target.value.substring(1);

    localCalendarList
      .filter((cal) => {
        if (e.target.value.substring(0, 1) === "G")
          return cal.DefinedWithProcessDefId === "0";
        else return cal.DefinedWithProcessDefId !== "0";
      })
      .forEach((cal) => {
        if (cal.CalendarId === e.target.value.substring(1)) {
          calName = cal.CalendarName;
        }
      });
    temp.ActivityProperty.actGenPropInfo.calenderName = calName;
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };

  const handleCalendarEdit = () => {
    let microProps = {
      Component: "ProcessCalendar", // change here
      Callback: (id, name) => console.log(id, name),
      source: "CAL_PRO",
      popupIndex: "2",
      ProcessDefinitionId:
        localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo
          .calendarType === "L"
          ? localLoadedProcessData.ProcessDefId + ""
          : "0",
      calId:
        +localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo
          .calendarId,
      AssociationFlag: "N",
      CalendarType:
        localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo
          .calendarType,
      RegisteredProcess:
        localLoadedProcessData?.ProcessType === "R" ? "Y" : "N",
      ActivityId: +props.cellID,
      ContainerId: "calenderDiv",
      Module: "WCL",
      InFrame: false,
      Renderer: "renderProcessCalendar",
      closeDialog: () => {
        setshowCalenderMFBool(false);
        var elem = document.getElementById("oapweb_assetManifest");

        elem.parentNode.removeChild(elem);
      },
    };

    console.log("calenderprops", microProps);
    window.MdmDataModel(microProps);
    setshowCalenderMFBool(true);
  };

  const setGenerateSummaryFunc = (e) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    temp.ActivityProperty.isGenerateSummaryDoc = e.target.checked;
    if (!e.target.checked) {
      temp.ActivityProperty.m_strCaseSummaryDocName = "";
      temp.ActivityProperty.sDocTypeId = "-1";
    } else if (e.target.checked) {
      let docId = 0;
      let tempLocal = JSON.parse(JSON.stringify(localState));
      tempLocal?.DocumentTypeList?.forEach((doc) => {
        if (+doc.DocTypeId > +docId) {
          docId = doc.DocTypeId;
        }
      });
      temp.ActivityProperty.m_strCaseSummaryDocName = `CaseSummary - ${props.cellName}`;
      temp.ActivityProperty.sDocTypeId = `${+docId + 1}`;
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: { isModified: true, hasError: false },
      })
    );
  };

  const setCaseNameFunc = (e) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    temp.ActivityProperty.m_strCaseSummaryDocName = e.target.value;
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <div className="flexScreen basicDetails-mainDiv">
      <div className="headingSectionTab">{<h4>{props?.heading}</h4>}</div>
      {spinner ? (
        <CircularProgress style={{ marginTop: "30vh", marginLeft: "40%" }} />
      ) : (
        <div
          className={classes.mainDiv}
          style={{
            flexDirection: props.isDrawerExpanded ? "row" : "column",
            fontSize: "var(--subtitle_text_font_size)",
          }}
        >
          <div
            style={{
              marginLeft: "0.8rem",
              // marginBottom: "1.4rem",
              width: props.isDrawerExpanded ? "50%" : null,
              height: "100%",
              paddingTop: props.isDrawerExpanded ? "0.4rem" : "0",
            }}
          >
            {/* code added on 6 July 2022 for BugId 110924*/}
            {(+props.cellActivityType === 1 &&
              +props.cellActivitySubType === 1) ||
            (+props.cellActivityType === 1 &&
              +props.cellActivitySubType === 3) ||
            (+props.cellActivityType === 1 &&
              +props.cellActivitySubType === 2) ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "-0.6875rem",
                }}
              >
                <Checkbox
                  size="medium"
                  style={{ color: "rgba(0, 0, 0, 0.54)" }}
                  checked={hasDefaultCheck} // code added on 6 July 2022 for BugId 110924
                  onChange={(e) => setDefaultCheckFunc(e)} // code added on 6 July 2022 for BugId 110924
                  disabled={defaultCheckDisabled || isReadOnly} // code added on 6 July 2022 for BugId 110924
                ></Checkbox>
                <p
                  style={{
                    fontSize: "var(--base_text_font_size)",
                    fontWeight: "600",
                  }}
                >
                  {t("setAsDefaultStart")}
                </p>
              </div>
            ) : null}

            {!addDescriptionBoolean && !isReadOnly && (
              <p
                id="add_description"
                style={{
                  color: "var(--button_color)",
                  cursor: "pointer",
                  fontSize: "var(--base_text_font_size)",
                  fontWeight: "600",
                }}
                onClick={() => setAddDescriptionBoolean(true)}
              >
                {t("add")} {t("Discription")}
              </p>
            )}
            {addDescriptionBoolean && (
              <div style={{ marginBlock: "1.7rem" }}>
                <p
                  style={{
                    color: "#606060",
                    marginBottom: "0.5rem",
                  }}
                >
                  {t("Discription")}
                </p>
                <SunEditor
                  id="add_description_sunEditor"
                  width={props.isDrawerExpanded ? "98%" : "100%"}
                  customHeight="8rem"
                  placeholder={t("placeholderDescription")}
                  value={
                    localLoadedActivityPropertyData?.ActivityProperty
                      .actGenPropInfo.genPropInfo.description
                  }
                  disabled={isReadOnly}
                  getValue={(e) => changeBasicDetails(e, "descBasicDetails")}
                />
              </div>
            )}
            {(+props.cellActivityType === 40 &&
              +props.cellActivitySubType === 1) ||
            (+props.cellActivityType === 23 &&
              +props.cellActivitySubType === 1) ||
            (+props.cellActivityType === 24 &&
              +props.cellActivitySubType === 1) ||
            (+props.cellActivityType === 25 &&
              +props.cellActivitySubType === 1) ||
            (+props.cellActivityType === 22 &&
              +props.cellActivitySubType === 1) ? (
              <div
                style={{
                  marginBlock: "0.9rem",
                  width: props.isDrawerExpanded ? "80%" : "100%",
                }}
              >
                <p
                  style={{
                    color: "#727272",
                    fontSize: "var(--base_text_font_size)",
                  }}
                >
                  {t("webServiceType")}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    color: "#727272",
                    marginTop: "0.25rem",
                    width: "95%",
                  }}
                >
                  <Select
                    id="webservice_dropdown"
                    onChange={onSelect}
                    value={selectedWebService}
                    IconComponent={ExpandMoreIcon}
                    style={{
                      width: "95%",
                      height: "var(--line_height)",
                    }}
                    variant="outlined"
                    defaultValue="WSRC"
                    disabled={isReadOnly}
                  >
                    {webServiceDropdownOptions.map((item) => {
                      return (
                        <MenuItem
                          style={{ width: "100%", marginBlock: "0.4rem" }}
                          value={item.value}
                          actType={item.activityType}
                        >
                          <p
                            style={{
                              marginInline: "0.5rem",
                              fontSize: "var(--base_text_font_size)",
                              fontFamily: "var(--font_family)",
                            }}
                          >
                            {item.name}
                          </p>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
              </div>
            ) : null}

            {!arrMobileEnabledAbsent().includes(selectedActivityType) ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: "-0.6875rem",
                }}
              >
                <Checkbox
                  id="mobile_enabled"
                  disabled={isReadOnly}
                  checked={
                    localLoadedActivityPropertyData?.ActivityProperty
                      ?.isMobileEnabled
                  }
                  size="medium"
                  name="mobileEnabled"
                  onChange={(e) => changeBasicDetails(e)}
                />
                <p
                  style={{
                    paddingTop: "0.6rem",
                    fontSize: "var(--base_text_font_size)",
                    fontWeight: "600",
                  }}
                >
                  {t("mobileEnabled")}
                </p>
                <InfoOutlinedIcon
                  style={{
                    margin: "0.5rem 0.5vw",
                    width: "1.25rem",
                    height: "1.25rem",
                    opacity: "0.7",
                  }}
                />
              </div>
            ) : null}

            <div style={{ margin: "0.5rem 0 1rem" }}>
              <p
                style={{
                  fontWeight: "600",
                  fontSize: "var(--base_text_font_size)",
                  cursor: "pointer",
                  margin: "0.25rem 0 0",
                }}
              >
                {isUsingSwimlaneQueue && props.openProcessType == "R"
                  ? null
                  : t("associatedQueue")}
              </p>
              {queueContent()}
              {showQueueModal ? (
                <Modal
                  show={showQueueModal}
                  backDropStyle={{ backgroundColor: "transparent" }}
                  style={{
                    top: props.isDrawerExpanded ? "6%" : "10%",
                    left: props.isDrawerExpanded ? "25%" : "-200%",
                    position: "absolute",
                    width: "702px",
                    height: "475px",
                    zIndex: "1500",
                    boxShadow: "0px 3px 6px #00000029",
                    border: "1px solid #D6D6D6",
                    borderRadius: "3px",
                    direction: direction,
                    padding: "0px",
                  }}
                  modalClosed={() => setShowQueueModal(false)}
                  children={
                    <QueueAssociation
                      setShowQueueModal={setShowQueueModal}
                      queueType={isUsingSwimlaneQueue ? "0" : "1"}
                      selfQueueCreated={selfQueueCreated}
                      setSelfQueueCreated={setSelfQueueCreated}
                      queueFrom="abstractView"
                    />
                  }
                ></Modal>
              ) : null}
              {showCalenderMFBool ? (
                <Modal
                  show={showCalenderMFBool}
                  backDropStyle={{ backgroundColor: "transparent" }}
                  style={{
                    width: "auto",
                    // height: "60vh",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    background: "white",
                  }}
                  modalClosed={() => {
                    setshowCalenderMFBool(false);
                    var elem = document.getElementById("oapweb_assetManifest");

                    elem?.parentNode.removeChild(elem);
                  }}
                >
                  <div
                    id="calenderDiv"
                    style={{ width: "100%", height: "100%" }}
                  ></div>
                </Modal>
              ) : null}
              <div>
                {!isReadOnly && (
                  <p
                    style={{
                      fontWeight: "600",
                      color: "var(--button_color)",
                      fontSize: "var(--base_text_font_size)",
                      cursor: "pointer",
                      margin: "0.5rem 0",
                    }}
                    onClick={handleQueueSwitching}
                  >
                    {queueType == 0
                      ? t("useSwimlaneQueue")
                      : t("useWorkstepQueue")}
                  </p>
                )}
              </div>
            </div>
            {/*code edited on 7 Sep 2022 for BugId 115321*/}
            {selectedActivityType !== activityType.query &&
              selectedActivityType !== activityType.endEvent &&
              selectedActivityType !== activityType.terminate &&
              selectedActivityType !== activityType.messageEnd && (
                <div style={{ marginBlock: "0.5rem" }}>
                  <p
                    style={{
                      fontSize: "var(--base_text_font_size)",
                      margin: "0 0 0.25rem",
                    }}
                    id="targetWorkStep_basicDetails"
                  >
                    {t("targetWorkstep")}
                  </p>
                  <div
                    style={{ width: props.isDrawerExpanded ? "60%" : "100%" }}
                  >
                    <SetIconWithActivityType
                      id="target_workstep"
                      disabled={isReadOnly}
                      selectedActivity={targetId}
                      activityList={allActivitiesTargetDropdown}
                      getSelectedActivity={(val) => getSelectedActivity(val)}
                    />
                  </div>
                </div>
              )}

            {selectedActivityType !== activityType.subProcess ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "0.125vw",
                    marginTop: "0.5rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span
                    id="cost_basicDetails"
                    style={{
                      fontFamily: "var(--font_family)",
                      fontSize: "var(--base_text_font_size)",
                    }}
                  >
                    {t("cost")}
                  </span>
                  <span
                    style={{
                      color: "red",
                      fontSize: "1rem",
                    }}
                  >
                    *
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font_family)",
                      fontSize: "var(--base_text_font_size)",
                    }}
                  >
                    {" "}
                    ({t("in $")})
                  </span>
                </div>
                <TextInput
                  type="number"
                  classTag={classes.inputWithError}
                  readOnlyCondition={isReadOnly}
                  inputValue={
                    localLoadedActivityPropertyData?.ActivityProperty
                      ?.actGenPropInfo?.genPropInfo?.cost
                  }
                  showError={showCostError}
                  name="cost"
                  idTag="costInBasicDetails"
                  onBlurEvent={() =>
                    costInput ? setShowCostError(false) : setShowCostError(true)
                  }
                  onChangeEvent={(e) => changeBasicDetails(e)}
                  errorStatement="This is invalid!!"
                  errorStatementClass={classes.errorStatement}
                />
              </div>
            ) : null}

            {/* ------------------------------------------------------------------ */}
            {(props.cellActivityType === 18 &&
              props.cellActivitySubType === 1) ||
            (props.cellActivityType === 2 &&
              props.cellActivitySubType === 2) ? (
              <div style={{ marginBlock: "1rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font_family)",
                    fontSize: "var(--base_text_font_size)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {t("registeredProcessName")}
                  <span
                    style={{
                      color: "red",
                      fontSize: "1rem",
                    }}
                  >
                    *
                  </span>
                </p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Select
                    className={
                      props.isDrawerExpanded
                        ? "dropDownSelect_expanded"
                        : "dropDownSelect"
                    }
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
                    IconComponent={ExpandMoreIcon}
                    value={selectedRegisteredProcess}
                    onChange={(e) => HandleRegisteredProcessChange(e)}
                    disabled={isReadOnly}
                  >
                    {deployedProcesses?.map((process) => {
                      return (
                        <MenuItem
                          value={process.ProcessName}
                          style={{
                            fontFamily: "var(--font_family)",
                            fontSize: "var(--base_text_font_size)",
                          }}
                        >
                          {process.ProcessName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
              </div>
            ) : null}

            {selectedActivityType === activityType.caseWorkdesk ? (
              <div style={{ marginBlock: "1rem" }}>
                <p
                  style={{
                    fontSize: "var(--base_text_font_size)",
                    fontWeight: "700",
                  }}
                >
                  {t("caseSummaryDetails")}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "-0.6875rem",
                  }}
                >
                  <Checkbox
                    size="medium"
                    id="generateSummaryDoc"
                    style={{ color: "rgba(0, 0, 0, 0.54)" }}
                    checked={basicDetails.isGenerateSummaryDoc}
                    onChange={(e) => {
                      setGenerateSummaryFunc(e);
                    }}
                    disabled={isReadOnly}
                  ></Checkbox>
                  <p
                    style={{
                      fontSize: "var(--base_text_font_size)",
                      fontWeight: "600",
                    }}
                  >
                    {t("generateSummaryDocument")}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "var(--base_text_font_size)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {t("mappedDocumentType")}
                </p>
                <TextField
                  id="mapped_documentType"
                  InputProps={{
                    className: classes.input,
                    readOnly: isReadOnly,
                  }}
                  value={basicDetails.m_strCaseSummaryDocName}
                  onChange={(e) => setCaseNameFunc(e)}
                  style={{ width: "95%" }}
                  variant="outlined"
                  size="small"
                  disabled={!basicDetails.isGenerateSummaryDoc}
                />
              </div>
            ) : null}

            <div style={{ marginBlock: "1rem" }}>
              {arrEntrySettingsPresent().includes(selectedActivityType) ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "var(--base_text_font_size)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {t("entrySettings")} {"count"}
                    </p>
                  </div>
                  <TextField
                    InputProps={{
                      className: classes.input,
                      readOnly: true,
                    }}
                    defaultValue="0"
                    style={{ width: "95%" }}
                    id="entry_settingsCount"
                    variant="outlined"
                    size="small"
                  />
                </>
              ) : null}

              {selectedActivityType === activityType.inclusiveDistribute ||
              selectedActivityType === activityType.parallelDistribute ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "95%",
                    margin: "1rem 0rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "var(--base_text_font_size)",
                      marginBottom: "0.25rem",
                    }}
                    className="disCount_basicDetails"
                  >
                    {t("distribute")} {t("count")}
                  </p>
                  <TextField
                    disabled
                    id="distribute_count"
                    InputProps={{
                      className: classes.input,
                      readOnly: true,
                    }}
                    style={{ width: "100%", cursor: "not-allowed" }}
                    variant="outlined"
                    size="small"
                    value={getDistributeCount()}
                  />
                </div>
              ) : null}

              {selectedActivityType === activityType.dataBasedExclusive ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "95%",
                    margin: "1rem 0rem",
                  }}
                >
                  <p
                    id="routingCriteriaCount_basicDetails"
                    style={{
                      fontSize: "var(--base_text_font_size)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {t("routingCriteria")} {t("count")}
                  </p>
                  <TextField
                    InputProps={{
                      className: classes.input,
                      readOnly: true,
                    }}
                    style={{
                      width: "100%",
                      fontSize: "var(--base_text_font_size)",
                    }}
                    id="routing_criteriaCount"
                    variant="outlined"
                    size="small"
                  />
                </div>
              ) : null}

              {selectedActivityType === activityType.conditionalStart ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      margin: "1rem 0",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "var(--base_text_font_size)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {t("conditional")} {t("Text")}
                    </p>
                  </div>
                  <TextField
                    InputProps={{
                      className: classes.input,
                    }}
                    style={{ width: "95%" }}
                    id="condtional_text"
                    variant="outlined"
                    size="small"
                  />
                </>
              ) : null}

              {!(
                selectedActivityType === activityType.event ||
                selectedActivityType === activityType.inclusiveCollect ||
                selectedActivityType === activityType.parallelCollect ||
                !props.isDrawerExpanded
              ) ? (
                <>
                  <p
                    style={{
                      fontSize: "var(--base_text_font_size)",
                      marginBottom: "0.25rem",
                    }}
                    className="calender_basicDetails"
                  >
                    {t("calendar")}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: "1.5rem",
                      width: props.isDrawerExpanded ? "60%" : "98%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "20vw",
                        alignItems: "center",
                      }}
                    >
                      {/*code updated on 21 September 2022 for BugId 115467*/}
                      <Select
                        IconComponent={ExpandMoreIcon}
                        style={{
                          width: "100%",
                          height: "var(--line_height)",
                          fontSize: "var(--base_text_font_size)",
                        }}
                        variant="outlined"
                        value={
                          localLoadedActivityPropertyData?.ActivityProperty
                            ?.actGenPropInfo?.calendarType +
                          localLoadedActivityPropertyData?.ActivityProperty
                            ?.actGenPropInfo?.calendarId
                        }
                        onChange={handleCalendarChange}
                        disabled={isReadOnly}
                      >
                        {localCalendarList.map((cal) => {
                          return (
                            <MenuItem
                              style={{ width: "10rem", margin: "0.5rem" }}
                              value={
                                cal.DefinedWithProcessDefId !== "0"
                                  ? "L" + cal.CalendarId
                                  : "G" + cal.CalendarId
                              } //1 is set as default value for this selectbox
                            >
                              <p
                                style={{
                                  fontsize: "var(--base_text_font_size)",
                                }}
                              >
                                {cal.CalendarName}
                              </p>
                            </MenuItem>
                          );
                        })}
                      </Select>

                      <div className="basicDetails-addIcon">
                        <AddIcon
                          onClick={() => {
                            openCalenderMf();
                          }}
                          className="basicDetails-addIconSvg"
                          disabled={isReadOnly}
                        />
                      </div>
                      <EditOutlinedIcon
                        id="editIcon_1"
                        style={{
                          color: "grey",
                          height: "2rem",
                          width: "2rem",
                          cursor: "pointer",
                          marginBlock: "0.5rem",
                        }}
                        onClick={(e) => handleCalendarEdit()}
                        disabled={isReadOnly}
                      />
                    </div>
                    {/* <RefreshSharpIcon
                      style={{
                        color: "#606060",
                        marginLeft: "0.5rem",
                        marginTop: "0.5rem",
                        width: "1.5rem",
                        height: "1.5rem",
                      }}
                    /> */}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {selectedActivityType !== activityType.subProcess ? (
            <hr
              style={{
                width: props.isDrawerExpanded ? "0" : "100%",
                height: props.isDrawerExpanded ? "100%" : "0",
              }}
            />
          ) : null}

          {selectedActivityType !== activityType.subProcess ? (
            <div
              style={{
                marginLeft: "0.8rem",
                width: props.isDrawerExpanded ? "50%" : null,
                height: "100%",
              }}
            >
              {!(
                selectedActivityType === activityType.event ||
                selectedActivityType === activityType.inclusiveCollect ||
                selectedActivityType === activityType.parallelCollect ||
                props.isDrawerExpanded
              ) ? (
                <>
                  <p
                    style={{
                      fontSize: "var(--base_text_font_size)",
                      marginBottom: "0.25rem",
                      marginTop: "1rem",
                    }}
                  >
                    {t("calendar")}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: "1.5rem",
                      width: props.isDrawerExpanded ? "60%" : "98%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "20vw",
                        alignItems: "center",
                      }}
                    >
                      <Select
                        IconComponent={ExpandMoreIcon}
                        style={{
                          width: "100%",
                          height: "var(--line_height)",
                          fontSize: "var(--base_text_font_size)",
                        }}
                        variant="outlined"
                        value={
                          localLoadedActivityPropertyData?.ActivityProperty
                            ?.actGenPropInfo?.calendarType +
                          localLoadedActivityPropertyData?.ActivityProperty
                            ?.actGenPropInfo?.calendarId
                        }
                        onChange={handleCalendarChange}
                        disabled={isReadOnly}
                      >
                        {localCalendarList.map((cal) => (
                          <MenuItem
                            style={{ width: "10rem", margin: "0.5rem" }}
                            value={
                              cal.DefinedWithProcessDefId !== "0"
                                ? "L" + cal.CalendarId
                                : "G" + cal.CalendarId
                            } //1 is set as default value for this selectbox
                          >
                            <p
                              style={{ fontsize: "var(--base_text_font_size)" }}
                            >
                              {cal.CalendarName}
                            </p>
                          </MenuItem>
                        ))}
                      </Select>

                      <div className="basicDetails-addIcon">
                        <AddIcon
                          onClick={() => openCalenderMf()}
                          className="basicDetails-addIconSvg"
                          disabled={isReadOnly}
                        />
                      </div>
                      <EditOutlinedIcon
                        id="editIcon_1"
                        style={{
                          color: "grey",
                          height: "2rem",
                          width: "2rem",
                          cursor: "pointer",
                          marginBlock: "0.5rem",
                        }}
                        onClick={(e) => handleCalendarEdit()}
                        disabled={isReadOnly}
                      />
                    </div>
                    {/* <RefreshSharpIcon
                      style={{
                        color: "#606060",
                        marginLeft: "0.5rem",
                        marginTop: "0.5rem",
                        width: "1.5rem",
                        height: "1.5rem",
                      }}
                    /> */}
                  </div>
                </>
              ) : null}
              {!arrFormValidationAbsent().includes(selectedActivityType) ? (
                <FormsAndValidations
                  formEnabled={basicDetails.FormId}
                  // disabled={isDisableTab}
                  customStyle={props.isDrawerExpanded ? "60%" : "95%"}
                  value={basicDetails.CustomValidation}
                  changeBasicDetails={changeBasicDetails}
                  disabled={isReadOnly}
                />
              ) : null}
              <div>
                {!configPeopleAndSystem && !isReadOnly ? (
                  <p
                    className="basicDetails-peopleAndSysHeading"
                    onClick={() => {
                      setConfigPeopleAndSystem(true);
                    }}
                  >
                    {t("configure")} {t("peopleAndSystems")}
                  </p>
                ) : null}
              </div>
              {configPeopleAndSystem ? (
                <PeopleAndSystems id="peopleAndSystems" disabled={isReadOnly} />
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </div>
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
      type,
      checkedOut
    ) =>
      dispatch(
        actionCreators.selectedCell(
          id,
          name,
          activityType,
          activitySubType,
          seqId,
          queueId,
          type,
          checkedOut
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
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
    cellQueueId: state.selectedCellReducer.selectedQueueId,
    openProcessType: state.openProcessClick.selectedType,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BasicDetails);
