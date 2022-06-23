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
  ENDPOINT_GETPROJECTLIST,
  ADD,
  DELETE,
  EDIT,
  WEBSERVICESOAP,
  WEBSERVICEREST,
  RESCONSUMERJMS,
  RESCONSUMERSOAP,
  REQUESTCONSUMERSOAP,
  CALLACTVITY_MAPPINGLIST,
  ENDPOINT_GET_ALLPROCESSLIST,
  ENDPOINT_GET_ALLDEPLOYEDPROCESSLIST,
  RTL_DIRECTION,
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
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import QueueAssociation from "../QueueAssociation/index.js";
import Modal from "../../../../UI/Modal/Modal.js";
import { getSelectedCellType } from "../../../../utility/abstarctView/getSelectedCellType.js";

function BasicDetails(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const tabStatus = useSelector(ActivityPropertyChangeValue);
  const [addDescriptionBoolean, setAddDescriptionBoolean] = useState(false);
  const [configPeopleAndSystem, setConfigPeopleAndSystem] = useState(false);
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
  const [selectedField, setSelectedField] = useState();
  const [basicDetails, setbasicDetails] = useState();
  const [spinner, setspinner] = useState(true);
  const [otherInputValues, setOtherInputValues] = useState("");
  const [allActivitiesTargetDropdown, setAllActivitiesTargetDropdown] =
    useState([]);
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  const [isDisableTab, setisDisableTab] = useState(false);
  const [selectedRegisteredProcess, setSelectedRegisteredProcess] = useState();
  const [deployedProcesses, setDeployedProcesses] = useState([]);
  const [showCostError, setShowCostError] = useState(false);
  const [costInput, setCostInput] = useState();
  const [queueType, setQueueType] = useState(0);
  const [showQueueModal, setShowQueueModal] = useState(false);
 const [startActivities, setStartActivities] = useState(null);
  const handleQueueSwitching = () => {
    // queueType == 0?setQueueType(1):setQueueType(0);
    setShowQueueModal(true);
  };

  useEffect(() => {
    if (props.cellID) {
      axios.get(SERVER_URL + ENDPOINT_GET_ALLPROCESSLIST).then((res) => {
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
    getAllActivities();
  }, []);

  useEffect(() => {
    console.log('startActivities_working', localLoadedProcessData);
    let startActivities=[];
    localLoadedProcessData?.MileStones?.map(mile=>{
      mile.Activities.map(activity=>{
        if(+activity.ActivityType===1 && +activity.ActivitySubType===1){
          startActivities.push(activity);
        }
      })
    })
    setStartActivities(startActivities);
  }, [localLoadedProcessData])
  
  // useEffect(() => {
  //   let temp = JSON.parse(JSON.stringify(tabStatus));
  //   if (showCostError === true) {
  //     temp.BasicDetails.hasError = true;
  //     dispatch(setActivityPropertyChange(temp));
  //   } else {
  //     temp.BasicDetails.hasError = false;
  //     dispatch(setActivityPropertyChange(temp));
  //   }
  // }, [showCostError]);

  // useEffect(() => {
  //   if (tabStatus.BasicDetails.hasError) {
  //     setShowCostError(tabStatus.BasicDetails.hasError);
  //   }
  // }, [tabStatus.BasicDetails.hasError]);

  useEffect(() => {
    if (localLoadedActivityPropertyData?.Status === 0) {
      setbasicDetails(localLoadedActivityPropertyData?.ActivityProperty);
      setspinner(false);
    }
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    if (localLoadedProcessData.ProcessType !== PROCESSTYPE_LOCAL) {
      setisDisableTab(true);
    }
  }, [localLoadedProcessData.ProcessType]);

  // useEffect(() => {
  //   if (saveCancelStatus.SaveClicked === true) {
  //     let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
  //     temp.ActivityProperty = basicDetails;
  //     setlocalLoadedActivityPropertyData(temp);
  //     dispatch(setSave({ SaveClicked: false }));
  //   }

  //   if (saveCancelStatus.CancelClicked === true) {
  //     setbasicDetails(localLoadedActivityPropertyData.ActivityProperty);
  //     dispatch(setSave({ SaveClicked: false, CancelClicked: false }));
  //   }
  // }, [saveCancelStatus]);

  const getAllActivities = () => {
    localLoadedProcessData?.MileStones?.forEach((mileStone) => {
      mileStone?.Activities?.forEach((activity) => {
        if (
          activity.ActivityId !== props.cellID &&
          noIncomingTypes(activity, t)
        )
          setAllActivitiesTargetDropdown((prevState) => [
            ...prevState,
            activity,
          ]);
      });
    });
  };

  const getActivityDetailsFromOpenProcess = (activityId) => {
    let activityDetails = {
      mileStoneIndex: "",
      activityIndex: "",
      activityId: "",
    };
    localLoadedProcessData.MileStones.forEach((mileStone, indexMilestone) => {
      mileStone.Activities.forEach((activity, indexActivity) => {
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

    ChangeActivityType(
      localLoadedProcessData.ProcessDefId,
      props.cellName,
      actType,
      actSubType,
      setlocalLoadedProcessData,
      mileStoneIndex,
      activityIndex,
      activityId
    );

    props.selectedCell(
      activityId,
      props.cellName,
      actType,
      actSubType,
      null,
      null,
      getSelectedCellType("ACTIVITY")
    );

    setSelectedField(e.target.value);
  };
  const useStyles = makeStyles({
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

  const webServiceDropdownOptions = [
    { value: WEBSERVICESOAP, name: t("webServiceSOAP") },
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

  const getSelectedActivity = (data) => {
    let temp = JSON.parse(JSON.stringify(localLoadedProcessData));
    let method;
    let newConnection = {
      ConnectionId:
        temp.Connections.length !== 0
          ? temp.Connections[temp.Connections.length - 1].ConnectionId + 1
          : 0,
      Type: "D",
      SourceId: props.cellID,
      TargetId: data,
      xLeft: [],
      yTop: [],
    };

    if (data === 0) {
      temp.Connections?.forEach((el) => {
        if (el.SourceId == props.cellID) {
          newConnection = el;
          let pos = temp.Connections.map(function (e) {
            return e.SourceId;
          }).indexOf(+props.cellID);

          temp.Connections.splice(pos, 1);

          method = DELETE;
        }
      });
    } else {
      if (temp.Connections.length !== 0) {
        let editBool = false,
          indexVal = 0;
        temp.Connections.forEach((el, index) => {
          if (el.SourceId == props.cellID) {
            editBool = true;
            indexVal = index;
          }
        });
        if (editBool) {
          temp.Connections[indexVal].TargetId = newConnection.TargetId;
          newConnection = temp.Connections[indexVal];
            method = EDIT;
          } else {
            temp.Connections.push(newConnection);
            method = ADD;
          }
      } else {
        temp.Connections.push(newConnection);
        method = ADD;
      }
    }

    targetWorkstepApi(newConnection, method, temp);
  };

  const HandleRegisteredProcessChange = (e) => {
    // if (confirm("All mapping data will be lost") == true) {
      setSelectedRegisteredProcess(e.target.value);
      let tempLocalState = { ...localLoadedActivityPropertyData };
      if (props.cellActivityType === 2 && props.cellActivitySubType === 2) {
        tempLocalState.ActivityProperty.pMMessageEnd.mapFwdVarMapping = {};
        tempLocalState.ActivityProperty.pMMessageEnd.processName =
          e.target.value;
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

    // queueType == 0 ? setQueueType(1) : setQueueType(0);
  };

  const targetWorkstepApi = async (data, method, temp) => {
    if (method === ADD) {
      let payload = {
        processDefId: localLoadedProcessData.ProcessDefId,
        processMode: localLoadedProcessData.ProcessType,
        connId: data.ConnectionId,
        sourceId: data.SourceId,
        targetId: data.TargetId,
        connType: data.Type,
      };
      const res = await axios.post(
        SERVER_URL + ENDPOINT_ADD_CONNECTION,
        payload
      );
      const resData = await res.data;
      if (resData.Status === 0) {
        return true;
      } else return false;
    } else if (method === DELETE) {
      let payload = {
        processDefId: localLoadedProcessData.ProcessDefId,
        processMode: localLoadedProcessData.ProcessType,
        connId: data.ConnectionId,
        connType: data.Type,
      };
      const res = await axios.post(
        SERVER_URL + ENDPOINT_DELETE_CONNECTION,
        payload
      );
      const resData = await res.data;
      if (resData.Status === 0) {
        return true;
      } else return false;
    } else {
      let payload = {
        processDefId: localLoadedProcessData.ProcessDefId,
        processMode: localLoadedProcessData.ProcessType,
        connId: data.ConnectionId,
        sourceId: data.SourceId,
        targetId: data.TargetId,
        connType: data.Type,
      };
      const res = await axios.post(
        SERVER_URL + ENDPOINT_MODIFY_CONNECTION,
        payload
      );
      const resData = await res.data;
      if (resData.Status === 0) {
        setlocalLoadedProcessData(temp);
    }
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
        BasicDetails: { isModified: true },
      })
    );
  };
  const getTargetWorkstep = () => {
    let temp = "None";
    localLoadedProcessData.Connections?.map((conn) => {
      if (
        conn.SourceId == localLoadedActivityPropertyData.ActivityProperty.actId
      ) {
        temp = conn.TargetId + "";
      }
    });
    return temp;
  };
  return (
    <div className="flexScreen basicDetails-mainDiv">
        {spinner ? (
          <CircularProgress style={{ marginTop: "30vh", marginLeft: "40%" }} />
        ) : (
          <div
            className={classes.mainDiv}
            style={{ flexDirection: props.isDrawerExpanded ? "row" : "column" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox disabled={startActivities?.length==1}></Checkbox>
              <p>Set as Default Start</p>
            </div>
            <div
              style={{
                marginLeft: "0.8rem",
                marginBottom: "0.9rem",
                width: props.isDrawerExpanded ? "50%" : null,
                height: "100%",
                paddingTop: props.isDrawerExpanded ? "0.4rem" : "0",
              }}
            >
              {!addDescriptionBoolean ? (
                <p
                  id="add_description"
                  style={{
                    color: "#0072C6",
                    cursor: "pointer",
                  }}
                  onClick={() => setAddDescriptionBoolean(true)}
                >
                  {t("add")} {t("Discription")}
                </p>
              ) : null}
              {addDescriptionBoolean ? (
                <div style={{ marginBlock: "0.5rem" }}>
                  <p
                    style={{
                      color: "#606060",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {t("Discription")}
                  </p>
                  <SunEditor
                    id="add_description_sunEditor"
                    width="100%"
                    customHeight="6rem"
                    placeholder={t("placeholderDescription")}
                    value={
                      localLoadedActivityPropertyData.ActivityProperty
                        .actGenPropInfo.genPropInfo.description
                    }
                    getValue={(e) => changeBasicDetails(e, "descBasicDetails")}
                  />
                </div>
              ) : null}
              {selectedActivityType === activityType.webService ? (
                <div
                  style={{
                    marginBlock: "0.5rem",
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

                      marginTop: "0.3rem",
                      width: "95%",
                    }}
                  >
                    <Select
                      id="webservice_dropdown"
                      onChange={onSelect}
                      IconComponent={ExpandMoreIcon}
                      style={{
                        width: "95%",
                        height: "2rem",
                      }}
                      variant="outlined"
                      defaultValue="WSRC"
                    >
                      {webServiceDropdownOptions.map((item) => {
                        return (
                          <MenuItem
                            style={{ width: "100%", marginBlock: "0.2rem" }}
                            value={item.value}
                            actType={item.activityType}
                            // onClick={()=>getSelectedActivity(item)}
                          >
                            <p
                              style={{
                                marginInline: "0.4rem",
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
                      localLoadedActivityPropertyData.ActivityProperty
                        .isMobileEnabled
                    }
                    size="small"
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
                      marginTop: "0.6rem",
                      padding: "0.1rem",
                      opacity: "0.7",
                    }}
                  />
                </div>
              ) : null}
              <div style={{ marginBlock: "0.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Associated Queue
                  </p>
                  <p
                    style={{
                      fontWeight: "700",
                      color: "blue",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                    onClick={handleQueueSwitching}
                  >
                  {queueType == 0 ? "Use Swimlane Queue" : "Use Workstep Queue"}
                  </p>
                </div>
                {showQueueModal ? (
                  <Modal
                    show={showQueueModal}
                    backDropStyle={{ backgroundColor: "transparent" }}
                    style={{
                      top: "10%",
                      left: direction == RTL_DIRECTION ? "10%" : "-200%",
                      position: "absolute",
                      width: "702px",
                      height: "361px",
                      zIndex: "1500",
                      boxShadow: "0px 3px 6px #00000029",
                      border: "1px solid #D6D6D6",
                      borderRadius: "3px",
                      direction: direction,
                    }}
                    modalClosed={() => setShowQueueModal(false)}
                    children={
                      <QueueAssociation
                        setShowQueueModal={setShowQueueModal}
                        queueType={queueType}
                        setQueueType={setQueueType}
                      />
                    }
                  ></Modal>
                ) : null}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                  }}
                >
                  <p style={{ fontSize: "12px", cursor: "pointer" }}>
                    Account Initiative Queue{" "}
                    <CreateIcon
                      style={{ height: "15px", width: "15px" }}
                      onClick={editQueueHandler}
                    />
                  </p>
                  <span style={{ fontSize: "12px" }}>
                    {queueType == 0 ? "(Workstep Queue)" : "(Swimlane Queue)"}
                  </span>
                  {/* <p style={{ color: "blue", fontSize:'12px', cursor:'pointer' }}>
                    {queueType == "Swimlane"
                      ? "Use Swimlane Queue"
                      : "Use Workstep Queue"}
                  </p> */}
                </div>
              </div>
              {selectedActivityType !== activityType.subProcess &&
              basicDetails.hasOwnProperty("QueueName") ? (
                <div style={{ marginBlock: "0.5rem" }}>
                  <p style={{ color: "#727272", fontSize: "0.875rem" }}>
                    {t("queue")}
                  </p>
                  <p style={{ fontWeight: "600" }}>{basicDetails.QueueName}</p>
                </div>
              ) : null}

              <div style={{ marginBlock: "0.5rem" }}>
                <p style={{ color: "#727272", fontSize: "0.875rem" }}>
                  {t("targetWorkstep")}
                </p>
                <div style={{ width: props.isDrawerExpanded ? "60%" : "100%" }}>
                  <SetIconWithActivityType
                    id="target_workstep"
                    disabled={isDisableTab}
                  selectedActivity={getTargetWorkstep}
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

                      marginBlock: "0.5rem",
                    }}
                  >
                    <p>{t("cost")}</p>
                    <span
                      style={{
                        color: "red",
                        padding: "0.35rem",
                        marginLeft: "-0.375rem",
                        marginTop: "-0.5rem",
                      }}
                    >
                      ★
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
                  <p id="archieve_dataClass">Registered Process Name</p>
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
              <div style={{ marginBlock: "0.5rem" }}>
                {arrEntrySettingsPresent().includes(selectedActivityType) ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        color: "#727272",

                        marginTop: "1rem",
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
                      }}
                    >
                      <p
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
                        style={{ width: "100%" }}
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

                        marginTop: "1rem",
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
                    >
                      {t("calendar")}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: "1rem",
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
                          style={{ width: "100%", height: "2rem" }}
                          variant="outlined"
                          defaultValue={1}
                        >
                          <MenuItem
                            style={{ width: "10rem", margin: "0.5rem" }}
                            value={1} //1 is set as default value for this selectbox
                          >
                            <p style={{ font: "0.8rem Open Sans" }}>
                              {t("default24/7")}
                            </p>
                          </MenuItem>
                        </Select>
                        <AddIcon className="basicDetails-addIcon" />
                      </div>
                      <RefreshSharpIcon
                        style={{
                          color: "#606060",
                          marginLeft: "0.2rem",
                          marginTop: "0.25rem",
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
                  marginTop: "0.9rem",
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
                        marginBottom: "1rem",
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
                          style={{ width: "100%", height: "2rem" }}
                          variant="outlined"
                          defaultValue={1}
                        >
                          <MenuItem
                            style={{ width: "10rem", margin: "0.5rem" }}
                            value={1} //1 is set as default value for this selectbox
                          >
                            <p style={{ font: "0.8rem Open Sans" }}>
                              {t("default24/7")}
                            </p>
                          </MenuItem>
                        </Select>
                        <AddIcon className="basicDetails-addIcon" />
                      </div>
                      <RefreshSharpIcon
                        style={{
                          color: "#606060",
                          marginLeft: "0.2rem",
                          marginTop: "0.25rem",
                        }}
                      />
                    </div>
                  </>
                ) : null}
                {!arrFormValidationAbsent().includes(selectedActivityType) ? (
                  <FormsAndValidations
                    formEnabled={basicDetails.FormId}
                    disabled={isDisableTab}
                    customStyle={props.isDrawerExpanded ? "60%" : "95%"}
                    value={basicDetails.CustomValidation}
                    changeBasicDetails={changeBasicDetails}
                  />
                ) : null}
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
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BasicDetails);
