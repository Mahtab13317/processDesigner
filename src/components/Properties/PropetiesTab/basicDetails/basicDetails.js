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
import RefreshSharpIcon from "@material-ui/icons/RefreshSharp";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { store, useGlobalState } from "state-pool";
import * as actionCreators from "../../../../redux-store/actions/selectedCellActions";
import CreateIcon from "@material-ui/icons/Create";
import {
  activityType,
  PROCESSTYPE_LOCAL,
  SERVER_URL,
  ENDPOINT_ADD_CONNECTION,
  ENDPOINT_DELETE_CONNECTION,
  ENDPOINT_MODIFY_CONNECTION,
  WEBSERVICESOAP,
  WEBSERVICEREST,
  RESCONSUMERJMS,
  RESCONSUMERSOAP,
  REQUESTCONSUMERSOAP,
  RTL_DIRECTION,
  propertiesLabel,
} from "../../../../Constants/appConstants.js";
import PeopleAndSystems from "./PeopleAndSystems";
import {
  arrMobileEnabledAbsent,
  arrEntrySettingsPresent,
  arrFormValidationAbsent,
} from "../../PropertyTabConstants";
import SetIconWithActivityType from "./SetIconWithActivityType.js";
import FormsAndValidations from "./FormsAndValidations.js";
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

function BasicDetails(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const [selfQueueCreated, setSelfQueueCreated] = useState(false);
  const [addDescriptionBoolean, setAddDescriptionBoolean] = useState(false);
  const [configPeopleAndSystem, setConfigPeopleAndSystem] = useState(false);
  const localActivityPropertyData = store.getState("activityPropertyData");
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [
    localLoadedActivityPropertyData,
    setlocalLoadedActivityPropertyData,
    updatelocalLoadedActivityPropertyData,
  ] = useGlobalState(localActivityPropertyData);
  const [selectedWebService, setSelectedWebService] = useState(null);
  const [openCalenderMfBool, setopenCalenderMfBool] = useState(false);
  const [targetId, setTargetId] = useState("None");
  const [basicDetails, setbasicDetails] = useState();
  const [spinner, setspinner] = useState(true);
  const [allActivitiesTargetDropdown, setAllActivitiesTargetDropdown] =
    useState([]);
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  const [isDisableTab, setisDisableTab] = useState(false);
  const [selectedRegisteredProcess, setSelectedRegisteredProcess] = useState();
  const [deployedProcesses, setDeployedProcesses] = useState([]);
  const [showCostError, setShowCostError] = useState(false);
  const [costInput, setCostInput] = useState();
  const [queueType, setQueueType] = useState(0);
  const [disableSwim, setDisableSwim] = useState(false);
  const [isUsingSwimlaneQueue, setIsUsingSwimlaneQueue] = useState(false);
  const [isUsingSelfQueue, setIsUsingSelfQueue] = useState(false);
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [startActivities, setStartActivities] = useState(null);
  // code added on 6 July 2022 for BugId 111910
  const openProcessData = useSelector(OpenProcessSliceValue);
  // code added on 6 July 2022 for BugId 110924
  const [hasDefaultCheck, setHasDefaultCheck] = useState(false);
  const [defaultCheckDisabled, setDefaultCheckDisabled] = useState(false);
  const [localState, setLocalState] = useState(null);
  const webserviceVal = useSelector(webserviceChangeVal);
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
    if (props.cellID) {
      axios.get(SERVER_URL + `/getprocesslist/R/-1`).then((res) => {
        if (res.data.Status === 0) {
          setDeployedProcesses(res.data.Processes);
        }
      });
    }
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
    let activityProps = getActivityProps(
      props.cellActivityType,
      props.cellActivitySubType
    );
    setSelectedActivityType(activityProps[5]);
  }, []);

  useEffect(() => {
    let startActivities = [];
    let temp = JSON.parse(JSON.stringify(openProcessData.loadedData));
    setLocalState(temp);
    getAllActivities();
    temp?.MileStones?.map((mile) => {
      mile.Activities.map((activity) => {
        if (+activity.ActivityType === 1 && +activity.ActivitySubType === 1) {
          startActivities.push(activity);
        }
      });
    });
    setStartActivities(startActivities);
  }, [openProcessData.loadedData]);

  useEffect(() => {
    if (localLoadedActivityPropertyData?.Status === 0) {
      setbasicDetails(localLoadedActivityPropertyData?.ActivityProperty);
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
    }
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    if (localState?.ProcessType == "R" || localState?.ProcessType == "D") {
      setisDisableTab(true);
    }
  }, [localState?.ProcessType]);

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
          getSelectedCellType("ACTIVITY")
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
      getSelectedCellType("ACTIVITY")
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
      height: "2.0625rem",
    },
    inputWithError: {
      height: "2.5rem",
      width: "5.875rem",
    },
    errorStatement: {
      color: "red",
      fontSize: "11px",
    },
    mainDiv: {
      overflowY: "scroll",
      display: "flex",
      flexDirection: "column",
      height: "71vh",
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
    // if (confirm("All mapping data will be lost") == true) {
    setSelectedRegisteredProcess(e.target.value);
    let tempLocalState = { ...localLoadedActivityPropertyData };
    if (props.cellActivityType === 2 && props.cellActivitySubType === 2) {
      tempLocalState.ActivityProperty.pMMessageEnd.mapFwdVarMapping = {};
      tempLocalState.ActivityProperty.pMMessageEnd.processName = e.target.value;
    } else {
      tempLocalState.ActivityProperty.SubProcess.importedProcessName =
        e.target.value;
    }
    deployedProcesses &&
      deployedProcesses.map((process) => {
        if (process.ProcessName == e.target.value) {
          {
            props.cellActivityType === 2 && props.cellActivitySubType === 2
              ? (tempLocalState.ActivityProperty.pMMessageEnd.processId =
                  process.ProcessDefId)
              : (tempLocalState.ActivityProperty.SubProcess.importedProcessDefId =
                  process.ProcessDefId);
          }
        }
      });
    setlocalLoadedActivityPropertyData(tempLocalState);
    // }
  };

  const editQueueHandler = () => {
    setShowQueueModal(true);
    queueType == 0 ? setQueueType(1) : setQueueType(0);
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
            />
          </p>
        </div>
      );
    } else if (
      checkQueueType(props.cellActivityType, props.cellActivitySubType) == 0
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

  const openCalenderMf = () => {
    let props = {
      Component: "ProcessCalendar", // change here
      Callback: (data) => console.log(data),
      source: "CAL_PRO",
      popupIndex: "2",
      ProcessDefinitionId: localLoadedProcessData.ProcessDefId + "",

      AssociationFlag: "N",
      CalendarType: "G",
      RegisteredProcess:
        localLoadedProcessData?.ProcessType === "R" ? "Y" : "N",

      ContainerId: "calenderDiv",
      Module: "MDM",
      InFrame: false,
      Renderer: "renderProcessCalendar",
    };

    console.log("calenderprops", props);
    window.loadCalender(props);
  };

  const handleQueueSwitching = () => {
    // queueType == 0?setQueueType(1):setQueueType(0);
    setShowQueueModal(true);
  };

  return (
    <div className="flexScreen basicDetails-mainDiv">
      {
        //added by mahtab
        <div className="headingSectionTab">{<h4>{props?.heading}</h4>}</div>
      }
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
          <div style={{ display: "hidden" }} id="calenderDiv"></div>
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
                  disabled={defaultCheckDisabled} // code added on 6 July 2022 for BugId 110924
                ></Checkbox>
                <p style={{ fontWeight: "600" }}>{t("setAsDefaultStart")}</p>
              </div>
            ) : null}

            {!addDescriptionBoolean ? (
              <p
                id="add_description"
                style={{
                  color: "var(--button_color)",
                  cursor: "pointer",
                  fontSize: "var(--base_text_font_size)",
                }}
                onClick={() => setAddDescriptionBoolean(true)}
              >
                {t("add")} {t("Discription")}
              </p>
            ) : null}
            {addDescriptionBoolean ? (
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
                  getValue={(e) => changeBasicDetails(e, "descBasicDetails")}
                />
              </div>
            ) : null}
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
                <div className="basicDetails-webService">
                  <p
                    style={{
                      color: "#727272",
                      fontWeight: "bolder",
                    }}
                  >
                    {t("webServiceType")}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    color: "#727272",

                    marginTop: "0.5rem",
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
                      height: "3rem",
                    }}
                    variant="outlined"
                    defaultValue="WSRC"
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
                              marginInline: "0.8rem",
                              font: "0.8rem Open Sans",
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
                  disabled={isDisableTab}
                  checked={
                    localLoadedActivityPropertyData?.ActivityProperty
                      .isMobileEnabled
                  }
                  size="medium"
                  name="mobileEnabled"
                  onChange={(e) => changeBasicDetails(e)}
                />
                <p
                  style={{
                    paddingTop: "0.6rem",

                    fontWeight: "600",
                  }}
                >
                  {t("mobileEnabled")}
                </p>
                <InfoOutlinedIcon
                  style={{
                    marginTop: "0.7rem",
                    padding: "0.1rem",
                    opacity: "0.7",
                  }}
                />
              </div>
            ) : null}
            <div>
              {queueContent()}
              {showQueueModal ? (
                <Modal
                  show={showQueueModal}
                  backDropStyle={{ backgroundColor: "transparent" }}
                  style={{
                    top: "10%",
                    left: direction == RTL_DIRECTION ? "10%" : "-200%",
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
              <div>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {t("associatedQueue")}
                </p>
                <p
                  style={{
                    fontWeight: "700",
                    color: "var(--brand_color1)",
                    fontSize: "12px",
                    cursor: "pointer",
                    marginRight: "0.625rem",
                  }}
                  onClick={handleQueueSwitching}
                >
                  {queueType == 0
                    ? t("useSwimlaneQueue")
                    : t("useWorkstepQueue")}
                </p>
              </div>
            </div>

            <div style={{ marginBlock: "0.5rem" }}>
              <p
                style={{ color: "#727272", fontSize: "0.875rem" }}
                id="targetWorkStep_basicDetails"
              >
                {t("targetWorkstep")}
              </p>
              <div style={{ width: props.isDrawerExpanded ? "60%" : "100%" }}>
                <SetIconWithActivityType
                  id="target_workstep"
                  disabled={isDisableTab}
                  selectedActivity={targetId}
                  activityList={allActivitiesTargetDropdown}
                  getSelectedActivity={(val) => getSelectedActivity(val)}
                />
              </div>
            </div>
            {selectedActivityType !== activityType.subProcess ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    color: "#727272",

                    // marginBlock: "1rem",
                  }}
                >
                  <p id="cost_basicDetails">{t("cost")}</p>
                  <span
                    style={{
                      color: "red",
                      padding: "0.35rem",
                      marginLeft: "-0.375rem",
                      marginTop: "-0.5rem",
                    }}
                  >
                    *
                  </span>

                  <p>({t("in $")})</p>
                </div>
                <TextInput
                  type="number"
                  classTag={classes.inputWithError}
                  readOnlyCondition={isDisableTab}
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
                  errorStatement="This is inValid!!"
                  errorStatementClass={classes.errorStatement}
                />
              </div>
            ) : null}

            {/* ------------------------------------------------------------------ */}
            {(props.cellActivityType === 18 &&
              props.cellActivitySubType === 1) ||
            (props.cellActivityType === 2 &&
              props.cellActivitySubType === 2) ? (
              <div
                className={
                  props.isDrawerExpanded
                    ? "dropDownSelectLabel_expanded"
                    : "dropDownSelectLabel"
                }
              >
                <p id="archieve_dataClass">{t("registeredProcessName")}</p>
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
                    value={selectedRegisteredProcess}
                    onChange={(e) => HandleRegisteredProcessChange(e)}
                  >
                    {deployedProcesses &&
                      deployedProcesses.map((process) => {
                        return (
                          <MenuItem
                            value={process.ProcessName}
                            className="statusSelect"
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
              <div style={{ marginBlock: "0.5rem" }}>
                <p
                  style={{
                    color: "#727272",

                    fontWeight: "bolder",
                  }}
                >
                  {t("caseSummaryDetails")}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "-0.6875rem",
                    marginTop: "-0.1rem",
                  }}
                >
                  <Checkbox
                    id="generateSummaryDoc"
                    disabled={isDisableTab}
                    checked={basicDetails.GenerateSummaryDoc}
                    size="small"
                  />
                  <p
                    style={{
                      paddingTop: "0.6rem",
                      fontWeight: "600",
                    }}
                  >
                    {t("generateSummaryDocument")}
                  </p>
                </div>
                <p
                  style={{
                    paddingTop: "0rem",
                    fontWeight: "600",
                  }}
                >
                  {t("mappedDocumentType")}
                </p>
                <TextField
                  id="mapped_documentType"
                  InputProps={{
                    className: classes.input,
                    readOnly: isDisableTab,
                  }}
                  style={{ width: "95%" }}
                  variant="outlined"
                  size="small"
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
                      color: "#727272",

                      marginTop: "1.7rem",
                    }}
                  >
                    <p>
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
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "95%",
                    }}
                  >
                    <p
                      style={{
                        color: "#727272",
                        fontWeight: "bolder",
                      }}
                      className="disCount_basicDetails"
                    >
                      {t("distribute")} {t("count")}
                    </p>
                    <TextField
                      aria-readonly
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
                </>
              ) : null}
              {selectedActivityType === activityType.dataBasedExclusive ? (
                <>
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
                        color: "#727272",

                        fontWeight: "bolder",
                      }}
                    >
                      {t("routingCriteria")} {t("count")}
                    </p>
                    <TextField
                      InputProps={{
                        className: classes.input,
                        readOnly: true,
                      }}
                      style={{ width: "100%", fontSize: "1rem" }}
                      id="routing_criteriaCount"
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </>
              ) : null}
              {selectedActivityType === activityType.conditionalStart ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      color: "#727272",
                      marginTop: "1.7rem",
                    }}
                  >
                    <p>
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
                      color: "#727272",

                      fontWeight: "bolder",
                    }}
                    className="calender_basicDetails"
                  >
                    {t("calendar")}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: "1.7rem",
                      justifyContent: "space-between",
                      width: props.isDrawerExpanded ? "60%" : "98%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "20vw",
                      }}
                    >
                      <Select
                        IconComponent={ExpandMoreIcon}
                        style={{ width: "100%", height: "2.5rem" }}
                        variant="outlined"
                        defaultValue={1}
                      >
                        <MenuItem
                          style={{ width: "10rem", margin: "0.5rem" }}
                          value={1} //1 is set as default value for this selectbox
                        >
                          <p style={{ fontsize: "var(--base_text_font_size)" }}>
                            {t("default24/7")}
                          </p>
                        </MenuItem>
                      </Select>
                      <AddIcon
                        //onClick={() => openCalenderMf()}
                        className="basicDetails-addIcon"
                      />
                    </div>
                    <RefreshSharpIcon
                      style={{
                        color: "#606060",
                        marginLeft: "0.2rem",
                        marginTop: "0.5rem",
                      }}
                    />
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
                marginTop: "1.5rem",
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
                      color: "#727272",

                      fontWeight: "bolder",
                    }}
                  >
                    {t("calendar")}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: "1.7rem",
                      justifyContent: "space-between",
                      width: props.isDrawerExpanded ? "60%" : "98%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "20vw",
                      }}
                    >
                      <Select
                        IconComponent={ExpandMoreIcon}
                        style={{ width: "100%", height: "2.5rem" }}
                        variant="outlined"
                        defaultValue={1}
                      >
                        <MenuItem
                          style={{ width: "10rem", margin: "1rem" }}
                          value={1} //1 is set as default value for this selectbox
                        >
                          <p style={{ fontSize: "var(--base_text_font_size)" }}>
                            {t("default24/7")}
                          </p>
                        </MenuItem>
                      </Select>
                      <AddIcon
                        //onClick={() => openCalenderMf()}
                        className="basicDetails-addIcon"
                      />
                    </div>
                    <RefreshSharpIcon
                      style={{
                        color: "#606060",
                        marginLeft: "0.2rem",
                        marginTop: "0.5rem",
                      }}
                    />
                  </div>
                </>
              ) : null}
              {/* {!arrFormValidationAbsent().includes(selectedActivityType) ? (
                <FormsAndValidations
                  formEnabled={basicDetails.FormId}
                  disabled={isDisableTab}
                  customStyle={props.isDrawerExpanded ? "60%" : "95%"}
                  value={basicDetails.CustomValidation}
                  changeBasicDetails={changeBasicDetails}
                />
              ) : null} */}
              <div>
                {!configPeopleAndSystem ? (
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
                <PeopleAndSystems
                  id="peopleAndSystems"
                  disabled={isDisableTab}
                />
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
    cellQueueId: state.selectedCellReducer.selectedQueueId,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BasicDetails);
