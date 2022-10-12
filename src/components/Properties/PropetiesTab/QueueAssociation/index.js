// Changes made to solve ID Bug 116180 - Associated Queue: not able to create own Queue in Associated Queue &
// Bug 116178 - Associated Queue: not able to save any changes in associated Queue
import React, { useState, useEffect } from "react";
import Tabs from "../../../../UI/Tab/Tab.js";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import "./index.css";
import GroupsTab from "./groupsTab.js";
import { store, useGlobalState } from "state-pool";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Select, MenuItem, Checkbox } from "@material-ui/core";
import { connect } from "react-redux";
import {
  SERVER_URL,
  ENDPOINT_QUEUEASSOCIATION_GROUPLIST,
  ENDPOINT_QUEUELIST,
  ENDPOINT_QUEUEASSOCIATION_MODIFY,
  RTL_DIRECTION,
  SAVE_QUEUEDATA,
} from "../../../../Constants/appConstants.js";
import { toHaveFormValues } from "@testing-library/jest-dom/dist/matchers.js";
import { useRef } from "react";
import { FieldValidations } from "../../../../utility/FieldValidations/fieldValidations.js";

function QueueAssociation(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [addedVariableList, setAddedVariableList] = useState([]);
  const [variableList, setVariableList] = useState(null);
  const [queueName, setQueueName] = useState("");
  const [queueDesc, setQueueDesc] = useState("");
  const [fetchingOrder, setFetchingOrder] = useState(null);
  const [fetchingOrderLast, setFetchingOrderLast] = useState(null);
  const [queueTypeLocal, setQueueTypeLocal] = useState("fifo");
  const [allowReassignment, setAllowReassignment] = useState(null);
  const [wipAssignmentType, setWipAssignmentType] = useState("N");
  const loadedProcessData = store.getState("loadedProcessData");
  const [workItemVisibility, setWorkItemVisibility] = useState("0");
  const [wipSortOrder, setWipSortOrder] = useState("A");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const localActivityPropertyData = store.getState("activityPropertyData");
  const [
    localLoadedActivityPropertyData,
    setlocalLoadedActivityPropertyData,
    updatelocalLoadedActivityPropertyData,
  ] = useGlobalState(localActivityPropertyData);
  const [workItemDropDownValues, setWorkItemDropDownValues] = useState([
    {
      name: "ActivityName",
      orderBy: "3",
    },
    {
      name: "CheckListCompleteFlag",
      orderBy: "7",
    },
    {
      name: "EntryDateTime",
      orderBy: "10",
    },
    {
      name: "InstrumentStatus",
      orderBy: "6",
    },
    {
      name: "IntroducedBy",
      orderBy: "5",
    },
    {
      name: "IntroductionDateTime",
      orderBy: "13",
    },
    {
      name: "LockedByName",
      orderBy: "4",
    },
    {
      name: "LockedTime",
      orderBy: "12",
    },
    {
      name: "LockStatus",
      orderBy: "8",
    },
    {
      name: "PriorityLevel",
      orderBy: "1",
    },
    {
      name: "ProcessInstanceName",
      orderBy: "2",
    },
    {
      name: "Status",
      orderBy: "17",
    },
    {
      name: "ValidTill",
      orderBy: "11",
    },
    {
      name: "VAR_INT1",
      orderBy: "101",
    },
    {
      name: "VAR_INT2",
      orderBy: "102",
    },
    {
      name: "VAR_INT3",
      orderBy: "103",
    },
    {
      name: "VAR_INT4",
      orderBy: "104",
    },
    {
      name: "VAR_INT5",
      orderBy: "105",
    },
    {
      name: "VAR_INT5",
      orderBy: "105",
    },
    {
      name: "VAR_INT6",
      orderBy: "106",
    },
    {
      name: "VAR_INT7",
      orderBy: "107",
    },
    {
      name: "VAR_INT8",
      orderBy: "108",
    },
    {
      name: "VAR_FLOAT1",
      orderBy: "109",
    },
    {
      name: "VAR_FLOAT2",
      orderBy: "110",
    },
    {
      name: "VAR_DATE1",
      orderBy: "111",
    },
    {
      name: "VAR_DATE2",
      orderBy: "112",
    },
    {
      name: "VAR_DATE3",
      orderBy: "113",
    },
    {
      name: "VAR_DATE4",
      orderBy: "114",
    },
    {
      name: "VAR_LONG1",
      orderBy: "115",
    },
    {
      name: "VAR_LONG2",
      orderBy: "116",
    },
    {
      name: "VAR_LONG3",
      orderBy: "117",
    },
    {
      name: "VAR_LONG4",
      orderBy: "118",
    },
    {
      name: "VAR_STR1",
      orderBy: "119",
    },
    {
      name: "VAR_STR2",
      orderBy: "120",
    },
    {
      name: "VAR_STR3",
      orderBy: "121",
    },
    {
      name: "VAR_STR4",
      orderBy: "122",
    },
    {
      name: "VAR_STR5",
      orderBy: "123",
    },
    {
      name: "VAR_STR6",
      orderBy: "124",
    },
    {
      name: "VAR_STR7",
      orderBy: "125",
    },
    {
      name: "VAR_STR8",
      orderBy: "126",
    },
  ]);

  const queueNameRef = useRef();
  const associateQueueHandler = () => {
    let tempKey = {};
    addedVariableList.forEach((el) => {
      tempKey = {
        ...tempKey,
        [el.ID]: {
          uGId: el.ID,
          uGName: el.GroupName,
          associationType: "1",
          queryFilter: "",
          queryPreview: "",
          status: "U",
          m_strServerQueryFilter: "",
          m_bCurrentFilter: false,
          m_bServerFilter: false,
          m_bConflictedFilter: false,
          m_strServerQueryPreview: "",
          m_bCurrentPreview: false,
          m_bServerPreview: false,
          m_bConflictedPreview: false,
          m_strWorkitemEditable: "",
        },
      };
    });
    let tempQueue;
    localLoadedProcessData.MileStones[0].Activities.map((el) => {
      if (
        el.ActivityType == props.cellActivityType &&
        el.ActivitySubType == props.cellActivitySubType
      ) {
        tempQueue = el.QueueId;
      }
    });
    props.setShowQueueModal(false);
    let tempOrder, tempFilterValue;
    if (queueTypeLocal == "fifo") {
      tempOrder = fetchingOrder;
    } else if (workItemVisibility == "1") {
      tempOrder = "888";
    } else if (workItemVisibility == "2") {
      tempOrder = fetchingOrder;
    } else if (workItemVisibility == "3") {
      tempOrder = fetchingOrderLast;
    }

    workItemDropDownValues?.map((el) => {
      if (el.orderBy == tempOrder) {
        tempFilterValue = el.name;
      }
    });

    axios
      .post(SERVER_URL + ENDPOINT_QUEUEASSOCIATION_MODIFY, {
        processDefId: localLoadedProcessData.ProcessDefId,
        processState: localLoadedProcessData.ProcessType,
        queueName: queueName,
        queueDesc: queueDesc,
        queueId:
          props.queueFrom === "graph"
            ? props.showQueueModal.queueId
            : tempQueue,
        queueType: queueTypeLocal == "fifo" ? "F" : wipAssignmentType,
        allowReassignment: allowReassignment ? "Y" : "N",
        orderBy: tempOrder,
        refreshInterval: "0",
        sortOrder: queueTypeLocal == "fifo" ? "D" : wipSortOrder,
        ugMap: tempKey,
        filterOption: queueTypeLocal == "fifo" ? "0" : workItemVisibility,
        filterValue: queueTypeLocal == "fifo" ? "" : tempFilterValue,
        pendingActions: "N",
        queueFilter: "",
        status: "N",
        actId: +localLoadedActivityPropertyData.ActivityProperty.actId,
        ugMap: tempKey,
      })
      .then((res) => {
        if (res.data.Status === 0) {
          alert("Queue Modified Successfully!");
        }
      });
  };

  const createQueueHandler = () => {
    let tempKey = {};
    addedVariableList.forEach((el) => {
      tempKey = {
        ...tempKey,
        [el.ID]: {
          uGId: el.ID,
          uGName: el.GroupName,
          associationType: "1",
          queryFilter: "",
          queryPreview: "",
          status: "U",
          m_strServerQueryFilter: "",
          m_bCurrentFilter: false,
          m_bServerFilter: false,
          m_bConflictedFilter: false,
          m_strServerQueryPreview: "",
          m_bCurrentPreview: false,
          m_bServerPreview: false,
          m_bConflictedPreview: false,
          m_strWorkitemEditable: "",
        },
      };
    });
    let myArray = [];
    localLoadedProcessData.Queue.map((el) => {
      myArray.push(el.QueueId);
    });
    let minimumQueueId = Math.min(...myArray) - 1;
    console.log("QUEUEUEUEUE", myArray, localLoadedProcessData.Queue);
    props.setShowQueueModal(false);
    let tempOrder, tempFilterValue;
    if (queueTypeLocal == "fifo") {
      tempOrder = fetchingOrder;
    } else if (workItemVisibility == "1") {
      tempOrder = "888";
    } else if (workItemVisibility == "2") {
      tempOrder = fetchingOrder;
    } else if (workItemVisibility == "3") {
      tempOrder = fetchingOrderLast;
    }
    workItemDropDownValues?.map((el) => {
      if (el.orderBy == tempOrder) {
        tempFilterValue = el.name;
      }
    });

    axios
      .post(SERVER_URL + SAVE_QUEUEDATA, {
        processDefId: localLoadedProcessData.ProcessDefId,
        processState: localLoadedProcessData.ProcessType,
        queueName: queueName,
        queueId: minimumQueueId == null ? "1" : minimumQueueId,
        queueType: queueTypeLocal == "fifo" ? "F" : wipAssignmentType,
        pendingActions: "N",
        queueDesc: queueDesc,
        allowReassignment: allowReassignment ? "Y" : "N",
        filterOption: queueTypeLocal == "fifo" ? "0" : workItemVisibility,
        filterValue: queueTypeLocal == "fifo" ? "" : tempFilterValue,
        orderBy: tempOrder,
        queueFilter: "",
        refreshInterval: "0",
        sortOrder: queueTypeLocal == "fifo" ? "D" : wipSortOrder,
        status: "N",
        ugMap: tempKey,
        actId: +localLoadedActivityPropertyData.ActivityProperty.actId,
      })
      .then((res) => {
        if (res.data.Status === 0) {
          props.setSelfQueueCreated(true);
          let temp = JSON.parse(JSON.stringify(localLoadedProcessData));
          temp.MileStones[0].Activities.map((el) => {
            if (
              el.ActivityType === props.cellActivityType &&
              el.ActivitySubType === props.cellActivitySubType
            ) {
              el.QueueId = minimumQueueId;
            }
          });
          temp.Queue.push({
            AllowReassignment: allowReassignment ? "Y" : "N",
            FilterOption: queueTypeLocal == "fifo" ? "0" : workItemVisibility,
            FilterValue: queueTypeLocal == "fifo" ? "" : tempFilterValue,
            OrderBy: tempOrder,
            QueueDescription: queueDesc,
            QueueFilter: "",
            QueueId: minimumQueueId == null ? "1" : minimumQueueId,
            QueueName: queueName,
            QueueType: queueTypeLocal == "fifo" ? "F" : wipAssignmentType,
            RefreshInterval: "0",
            SortOrder: queueTypeLocal == "fifo" ? "D" : wipSortOrder,
          });
          setLocalLoadedProcessData(temp);
        }
      });
  };

  const addAllVariable = () => {
    setAddedVariableList((prev) => {
      let newData = [...prev];
      variableList.forEach((data) => {
        newData.push(data);
      });
      return newData;
    });
    setVariableList([]);
  };
  const addOneVariable = (variable) => {
    // if (existingTrigger) {
    //   props.setTriggerEdited(true);
    // }
    setAddedVariableList((prev) => {
      return [...prev, variable];
    });
    setVariableList((prev) => {
      let prevData = [...prev];
      return prevData.filter((data) => {
        if (data.ID !== variable.ID) {
          return data;
        }
      });
    });
  };
  const removeAllVariable = () => {
    // if (existingTrigger) {
    //   props.setTriggerEdited(true);
    // }
    setVariableList((prev) => {
      let newData = [...prev];
      addedVariableList.forEach((data) => {
        newData.push(data);
      });
      return newData;
    });
    setAddedVariableList([]);
  };
  const removeOneVariable = (variable) => {
    // if (existingTrigger) {
    //   props.setTriggerEdited(true);
    // }
    setVariableList((prev) => {
      return [...prev, variable];
    });
    setAddedVariableList((prevContent) => {
      let prevData = [...prevContent];
      return prevData.filter((dataContent) => {
        if (dataContent.ID !== variable.ID) {
          return dataContent;
        }
      });
    });
  };

  useEffect(() => {
    axios
      .post(SERVER_URL + ENDPOINT_QUEUEASSOCIATION_GROUPLIST, {
        // m_strInit: "",
        // m_strGroupId: "",
        // m_strGroupName: "",
        // m_arrGroupList: "",
        // m_bError: false,
        // m_strErrorMsg: "",
        // m_bDescending: "",
        // m_bEnablePrevBut: "",
        // m_bEnableNextBut: "",
        // m_strDefaultPrefix: "",
      })
      .then((res) => {
        if (res?.data?.Status === 0) {
          setVariableList(res.data.GroupInfo);
        }
      });
  }, []);

  useEffect(() => {
    if (+props.queueType == 0 || props.selfQueueCreated) {
      let temp = [];
      let tempQueueId;
      localLoadedProcessData.MileStones[0].Activities.map((el) => {
        if (el.ActivityId === props.cellID) {
          tempQueueId = el.QueueId;
        }
      });
      axios
        .post(SERVER_URL + ENDPOINT_QUEUELIST, {
          processDefId: localLoadedProcessData.ProcessDefId,
          processState: localLoadedProcessData.ProcessType,
          queueId:
            props.queueFrom === "graph"
              ? props.showQueueModal.queueId
              : tempQueueId,
        })
        .then((res) => {
          if (res?.data?.Queue[0]?.queueType == "F") {
            setFetchingOrder(res?.data?.Queue[0]?.orderBy);
          } else if (res?.data?.Queue[0]?.queueType != "F") {
            if (
              res?.data?.Queue[0]?.filterOption == "1" ||
              res?.data?.Queue[0]?.filterOption == "2"
            ) {
              setFetchingOrder(res?.data?.Queue[0]?.orderBy);
            } else {
              setFetchingOrderLast(res?.data?.Queue[0]?.orderBy);
            }
          }
          if (res?.data?.Queue[0].allowReassignment == "Y") {
            setAllowReassignment(true);
          } else {
            setAllowReassignment(false);
          }
          setQueueName(res?.data?.Queue[0]?.queueName);
          setQueueDesc(res?.data?.Queue[0]?.queueDesc);
          setQueueTypeLocal(
            res?.data?.Queue[0]?.queueType == "F" ? "fifo" : "wip"
          );
          setWorkItemVisibility(res?.data?.Queue[0]?.filterOption);
          setWipAssignmentType(res?.data?.Queue[0]?.queueType);
          setWipSortOrder(res?.data?.Queue[0]?.sortOrder);
          if (res.data.Queue[0].ugMap) {
            Object.keys(res?.data?.Queue[0]?.ugMap).forEach((el) => {
              let tOne = res?.data?.Queue[0]?.ugMap;
              temp.push({
                GroupName: tOne[el].m_strUGName,
                ID: tOne[el].m_strUGId,
              });
            });
          }
          setAddedVariableList(temp);
        });
    }
  }, [props.queueType, props.selfQueueCreated, localLoadedProcessData]);

  const showFetchingOrder = () => {
    return (
      <div className="fetchingOrderFIFO">
        {/* ------------------------------ */}
        {queueTypeLocal === "wip" ? (
          <>
            <p
              style={{
                color: "#000000",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              ASSIGNMENT TYPE
            </p>
            <FormControl>
              <RadioGroup
                column
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={wipAssignmentType}
                onChange={(e) => setWipAssignmentType(e.target.value)}
              >
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label={
                    <p style={{ fontSize: "12px", height: "15px" }}>
                      No Assignment
                    </p>
                  }
                />
                <FormControlLabel
                  value="D"
                  control={<Radio size="small" />}
                  label={
                    <p style={{ fontSize: "12px", height: "15px" }}>
                      Dynamic Assignment
                    </p>
                  }
                />
                <FormControlLabel
                  value="S"
                  control={<Radio size="small" />}
                  label={
                    <p style={{ fontSize: "12px", height: "15px" }}>
                      Permanent Assignment
                    </p>
                  }
                />
              </RadioGroup>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "20px",
                  marginBottom: "20px",
                  marginLeft: "-13px",
                }}
              >
                <Checkbox
                  size="small"
                  checked={allowReassignment}
                  onChange={() => setAllowReassignment(!allowReassignment)}
                />
                <span style={{ fontSize: "11px", fontWeight: "700" }}>
                  Allow Reassignment
                </span>
              </div>
            </FormControl>
          </>
        ) : null}
        {/* ------------------------------- */}
        <p
          style={{
            color: "#000000",
            fontSize: "12px",
            fontWeight: "700",
          }}
        >
          FETCHING ORDER
        </p>
        {/* --------------------------------*/}
        {queueTypeLocal === "fifo" ? (
          <FormControl>
            <RadioGroup
              column
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={fetchingOrder}
              onChange={(e) => setFetchingOrder(e.target.value)}
            >
              <FormControlLabel
                value="2"
                control={<Radio size="small" />}
                label={
                  <p style={{ fontSize: "12px", height: "15px" }}>
                    In order of Process Instance ID
                  </p>
                }
              />
              <FormControlLabel
                value="10"
                control={<Radio size="small" />}
                label={
                  <p style={{ fontSize: "12px", height: "15px" }}>
                    In order of entry date time
                  </p>
                }
              />
              <FormControlLabel
                value="1"
                control={<Radio size="small" />}
                label={
                  <p style={{ fontSize: "12px", height: "15px" }}>
                    In order of priority level
                  </p>
                }
              />
            </RadioGroup>
          </FormControl>
        ) : (
          <div>
            <p>Fetching workItems in order of</p>
            <p>
              Sort Order{" "}
              <Select
                style={{
                  height: "10px !important",
                  width: "98px",
                  marginTop: "10px",
                  background: "#FFFFFF 0% 0% no-repeat padding-box",
                  border: "1px solid #DADADA",
                  borderRadius: "2px",
                  opacity: "1",
                }}
                value={wipSortOrder}
                onChange={(e) => setWipSortOrder(e.target.value)}
              >
                <MenuItem value="A">
                  <em style={{ fontSize: "12px", fontStyle: "normal" }}>
                    Ascending
                  </em>
                </MenuItem>
                <MenuItem value="D">
                  <em style={{ fontSize: "12px", fontStyle: "normal" }}>
                    Descending
                  </em>
                </MenuItem>
              </Select>
            </p>
          </div>
        )}
        {/* ------------------------------- */}
        {queueTypeLocal === "wip" ? (
          <>
            <p
              style={{
                color: "#000000",
                fontSize: "12px",
                fontWeight: "700",
                marginTop: "10px",
              }}
            >
              WORKITEM VISIBILITY
            </p>
            <FormControl>
              <RadioGroup
                column
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={workItemVisibility}
                onChange={(e) => setWorkItemVisibility(e.target.value)}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio size="small" />}
                  label={
                    <p style={{ fontSize: "12px", height: "15px" }}>
                      Show All WorkItems
                    </p>
                  }
                />
                <FormControlLabel
                  value="2"
                  control={<Radio size="small" />}
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontSize: "12px", height: "15px" }}>
                        Show WorkItem where logged-in index is equal to:
                      </p>
                      <Select
                        style={{
                          height: "10px !important",
                          width: "98px",
                          marginTop: "10px",
                          background: "#FFFFFF 0% 0% no-repeat padding-box",
                          border: "1px solid #DADADA",
                          borderRadius: "2px",
                          opacity: "1",
                        }}
                        value={
                          queueTypeLocal == "fifo" ? "none" : fetchingOrder
                        }
                        onChange={(e) => setFetchingOrder(e.target.value)}
                      >
                        {workItemDropDownValues.map((el) => {
                          return (
                            <MenuItem value={el.orderBy}>
                              <em
                                style={{
                                  fontSize: "12px",
                                  fontStyle: "normal",
                                }}
                              >
                                {el.name}
                              </em>
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  }
                />
                <FormControlLabel
                  value="3"
                  control={<Radio size="small" />}
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontSize: "12px", height: "15px" }}>
                        Show WorkItem where logged-in index is not equal to:{" "}
                      </p>
                      <Select
                        style={{
                          height: "10px !important",
                          width: "98px",
                          marginTop: "10px",
                          background: "#FFFFFF 0% 0% no-repeat padding-box",
                          border: "1px solid #DADADA",
                          borderRadius: "2px",
                          opacity: "1",
                        }}
                        value={
                          queueTypeLocal == "fifo" ? "none" : fetchingOrderLast
                        }
                        onChange={(e) => setFetchingOrderLast(e.target.value)}
                      >
                        {workItemDropDownValues.map((el) => {
                          return (
                            <MenuItem value={el.orderBy}>
                              <em
                                style={{
                                  fontSize: "12px",
                                  fontStyle: "normal",
                                }}
                              >
                                {el.name}
                              </em>
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  }
                />
              </RadioGroup>
            </FormControl>
          </>
        ) : null}
      </div>
    );
  };

  return (
    <div>
      <p style={{ fontSize: "16px", fontWeight: "600", padding: "12px" }}>
        {props.queueType == 0 ? "Swimlane Queue" : "Workstep Queue"}
      </p>
      <hr style={{ height: "1px", color: "grey" }}></hr>
      <Tabs
        tabType="processSubTab"
        tabContentStyle="processSubTabContentStyle"
        tabBarStyle="processSubQueueBarStyle"
        oneTabStyle="processSubOneTabStyle"
        tabStyling="processViewTabs"
        TabNames={["General", "Groups"]}
        TabElement={[
          <div style={{ height: "250px" }}>
            <div
              style={{
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding:
                    direction == RTL_DIRECTION
                      ? "10px 10px 10px 50px"
                      : "10px 50px 10px 10px",
                }}
              >
                <p style={{ fontSize: "12px", color: "#606060" }}>Queue Name</p>
                {/*code updated on 15 September 2022 for BugId 112903*/}
                <input
                  value={queueName}
                  style={{
                    width: "400px",
                    height: "24px",
                    border: "1px solid #DADADA",
                    borderRadius: "2px",
                    opacity: "1",
                    padding: "0px 3px",
                  }}
                  onChange={(e) => setQueueName(e.target.value)}
                  ref={queueNameRef}
                  onKeyPress={(e) =>
                    FieldValidations(e, 150, queueNameRef.current, 10)
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding:
                    direction == RTL_DIRECTION
                      ? "10px 10px 10px 50px"
                      : "10px 50px 10px 10px",
                }}
              >
                <p style={{ fontSize: "12px", color: "#606060" }}>
                  Description
                </p>
                <textarea
                  onChange={(e) => setQueueDesc(e.target.value)}
                  value={queueDesc}
                  style={{
                    width: "400px",
                    height: "87px",
                    border: "1px solid #DADADA",
                    borderRadius: "2px",
                    opacity: "1",
                    padding: "2px 3px",
                  }}
                />
              </div>
              {/* {props.queueType == 1 ? ( */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding:
                    direction == RTL_DIRECTION
                      ? "10px 10px 10px 50px"
                      : "0px 50px 0px 10px",
                }}
              >
                <p style={{ fontSize: "12px", color: "#606060" }}>Queue Type</p>
                <FormControl style={{ marginRight: "245px" }}>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={queueTypeLocal}
                    onChange={(e) => setQueueTypeLocal(e.target.value)}
                  >
                    <FormControlLabel
                      value="fifo"
                      control={<Radio size="small" />}
                      label={<p style={{ fontSize: "12px" }}>FIFO</p>}
                    />
                    <FormControlLabel
                      value="wip"
                      control={<Radio size="small" />}
                      label={<p style={{ fontSize: "12px" }}>WIP</p>}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              {showFetchingOrder()}
            </div>
            <div className="buttons_add buttonsAddToDo_Queue">
              <Button
                variant="outlined"
                onClick={() => props.setShowQueueModal(false)}
                id="close_AddTodoModal_Button"
              >
                Cancel
              </Button>
              <Button
                id="addAnotherTodo_Button"
                variant="contained"
                color="primary"
                onClick={
                  props.queueType == "0" || props.selfQueueCreated
                    ? associateQueueHandler
                    : createQueueHandler
                }
              >
                {props.queueType == "0" ? "Associate" : "Save"}
              </Button>
            </div>
          </div>,
          <div
            style={{
              backgroundColor: "white",
              padding: "10px 10px 0px 10px",
              height: "370px",
            }}
          >
            <p style={{ color: "black", display: "flex" }}>
              <GroupsTab
                tableType="add"
                id="trigger_de_addDiv"
                tableContent={variableList}
                singleEntityClickFunc={addOneVariable}
                headerEntityClickFunc={addAllVariable}
                selectedGroupLength={
                  addedVariableList ? addedVariableList.length : 0
                }
              />
              <GroupsTab
                tableType="remove"
                tableContent={addedVariableList}
                singleEntityClickFunc={removeOneVariable}
                headerEntityClickFunc={removeAllVariable}
                id="trigger_de_removeDiv"
              />
            </p>
            <div className="buttons_add buttonsAddToDo_Queue_Groups">
              <Button
                variant="outlined"
                onClick={() => props.setShowQueueModal(false)}
                id="close_AddTodoModal_Button"
              >
                Cancel
              </Button>
              <Button
                id="addAnotherTodo_Button"
                variant="contained"
                color="primary"
                onClick={
                  props.queueType == "0" || props.selfQueueCreated
                    ? associateQueueHandler
                    : createQueueHandler
                }
              >
                {props.queueType == "0" ? "Associate" : "Save"}
              </Button>
            </div>
          </div>,
        ]}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    cellQueueId: state.selectedCellReducer.selectedQueueId,
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};
export default connect(mapStateToProps, null)(QueueAssociation);
