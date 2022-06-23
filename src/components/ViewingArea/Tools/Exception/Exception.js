import React, { useEffect, useState } from "react";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";
import CheckBoxes from "./CheckBoxes";
import Checkbox from "@material-ui/core/Checkbox";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Modal from "@material-ui/core/Modal";
import { store, useGlobalState } from "state-pool";
import {
  SERVER_URL,
  ENDPOINT_ADD_EXCEPTION,
  ENDPOINT_ADD_GROUP,
  ENDPOINT_DELETE_EXCEPTION,
  ENDPOINT_DELETE_GROUP,
  ENDPOINT_MODIFY_EXCEPTION,
  ENDPOINT_MOVETO_OTHERGROUP,
  SCREENTYPE_EXCEPTION,
} from "../../../../Constants/appConstants";
import axios from "axios";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ActivityModal from "./ActivityModal.js";
import { giveCompleteRights } from "../../../../utility/Tools/giveCompleteRights_exception";
import { connect } from "react-redux";
import DeleteModal from "../../../../UI/ActivityModal/Modal";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import AddException from "./AddExceptions";
import CommonInterface from "../CommonInterface";
import { fullRightsOneActivity } from "../CommonInterfaceFuncs";
import Backdrop from "../../../../UI/Backdrop/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { BATCH_COUNT } from "../../../../Constants/appConstants";

function Exception(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [loadedMileStones, setLoadedMileStones] = useState(
    localLoadedProcessData?.MileStones
  );
  let { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  let [activitySearchTerm, setActivitySearchTerm] = useState("");
  const [addGroupModal, setAddGroupModal] = React.useState(false);
  const [addExceptionModal, setAddExceptionModal] = React.useState(null);
  const [compact, setCompact] = useState();
  const [bGroupExists, setbGroupExists] = useState(false);
  const [bExceptionExists, setbExceptionExists] = useState(false);
  const [openActivityModal, setOpenActivityModal] = useState(null);
  const [exceptionDesc, setExceptionDesc] = useState("");
  const [expNameToModify, setExpNameToModify] = useState();
  const [expDescToModify, setExpDescToModify] = useState();
  const [expIdToModify, setExpIdToModify] = useState();
  const [bExpExists, setbExpExists] = useState(false);
  const [newGroupToMove, setNewGroupToMove] = useState();
  const [expSearchTerm, setExpSearchTerm] = useState("");
  const [groupName, setGroupName] = useState(null);
  const [filteredExceptions, setFilteredExceptions] = useState({});
  const [fullRightCheckOneActivityArr, setFullRightCheckOneActivityArr] =
    useState([]);
  const [expData, setExpData] = useState({
    ExceptionGroups: [],
  });
  const [showDescError, setShowDescError] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [ruleDataArray, setRuleDataArray] = useState("");
  const [exceptionRules, setExceptionRules] = useState([]);
  const [subColumns, setSubColumns] = useState([]);
  const [splicedColumns, setSplicedColumns] = useState([]);
  const [expName, setExpName] = useState(null);

  useEffect(() => {
    let arr = [];
    let activityIdString = "";
    loadedMileStones.map((mileStone) => {
      mileStone.Activities.map((activity, index) => {
        if (
          !(activity.ActivityType === 18 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 1 && activity.ActivitySubType === 2) &&
          !(activity.ActivityType === 26 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 10 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 20 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 22 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 31 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 29 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 10 && activity.ActivitySubType === 4) &&
          !(activity.ActivityType === 33 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 27 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 19 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 21 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 5 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 6 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 5 && activity.ActivitySubType === 2) &&
          !(activity.ActivityType === 6 && activity.ActivitySubType === 2) &&
          !(activity.ActivityType === 7 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 34 && activity.ActivitySubType === 1)
        ) {
          arr.push(activity);
          activityIdString = activityIdString + activity.ActivityId + ",";
        }
      });
    });
    MapAllActivities(activityIdString);
    setSubColumns(arr);
    setSplicedColumns(arr.slice(0, BATCH_COUNT));
  }, [loadedMileStones]);

  useEffect(() => {
    if (document.getElementById("oneBoxMatrix")) {
      document.getElementById("oneBoxMatrix").onscroll = function (event) {
        if (this.scrollLeft >= this.scrollWidth - this.clientWidth) {
          const timeout = setTimeout(() => {
            setSplicedColumns((prev) =>
              subColumns.slice(0, prev.length + BATCH_COUNT)
            );
          }, 500);
          return () => clearTimeout(timeout);
        }
      };
    }
  });

  const addGroupViaMoveTo = (
    ExceptionId,
    ExceptionName,
    Description,
    SourceGroupId
  ) => {
    setNewGroupToMove({
      exceptionId: ExceptionId,
      exceptionName: ExceptionName,
      expDesc: Description,
      sourceGroupId: SourceGroupId,
    });
    handleOpen();
  };

  let ExceptionGroup = [];
  expData.ExceptionGroups &&
    expData.ExceptionGroups.map((group) => {
      ExceptionGroup.push(group.GroupName);
    });

  const MapAllActivities = (activityIdString) => {
    axios
      .get(
        SERVER_URL +
          `/exception/${props.openProcessID}/${props.openProcessType}/${props.openProcessName}/${activityIdString}`
      )
      .then((res) => {
        if (res.status === 200) {
          setExceptionRules(res.data.Rules);
          let grpList = res.data.ExceptionGroups;
          let array = [];
          grpList.map((grp) => {
            grp.ExceptionList.map((name) => {
              let obj = {
                Name: name.ExceptionName,
                NameId: name.ExceptionId,
                Group: grp.GroupName,
                GroupId: grp.GroupId,
              };
              array.push(obj);
            });
          });
          setRuleDataArray(array);
          let newState = { ...res.data };
          newState &&
            newState.ExceptionGroups.map((group) => {
              group.ExceptionList &&
                group.ExceptionList.map((exception) => {
                  let tempIds = [];
                  let tempData = [];
                  exception.Activities &&
                    exception.Activities.map((activity) => {
                      if (tempIds.includes(activity.ActivityId)) {
                        tempData &&
                          tempData.map((data) => {
                            if (data.ActivityId == activity.ActivityId) {
                              data.View = data.View ? data.View : activity.View;
                              data.Raise = data.Raise
                                ? data.Raise
                                : activity.Raise;
                              data.Respond = data.Respond
                                ? data.Respond
                                : activity.Respond;
                              data.Clear = data.Clear
                                ? data.Clear
                                : activity.Clear;
                            }
                          });
                      } else {
                        tempData.push(activity);
                        tempIds.push(activity.ActivityId);
                      }
                    });
                  exception.Activities = [...tempData];
                });
            });
          // -----------------------
          let localActivityArr = [];
          let localActivityIdArr = [];
          newState &&
            newState.ExceptionGroups.map((group) => {
              group.ExceptionList &&
                group.ExceptionList.map((exception) => {
                  exception.Activities &&
                    exception.Activities.map((activity, act_idx) => {
                      if (Object.values(activity).includes(false)) {
                        localActivityArr[act_idx] = false;
                      } else {
                        if (localActivityArr[act_idx] != false) {
                          localActivityArr[act_idx] = true;
                        }
                      }
                      localActivityIdArr[act_idx] = activity.ActivityId;
                    });
                });
            });

          localActivityArr.forEach((activity, activityIndex) => {
            if (activity === false) {
              setFullRightCheckOneActivityArr((prevArr) => {
                let temp = [...prevArr];
                temp[localActivityIdArr[activityIndex]] = false;
                return temp;
              });
            } else {
              setFullRightCheckOneActivityArr((prevArr) => {
                let temp = [...prevArr];
                temp[localActivityIdArr[activityIndex]] = true;
                return temp;
              });
            }
          });
          // ---------------------------------------
          setExpData(newState);
          setFilteredExceptions(res.data);
          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));
  };

  const addExceptionToList = (
    ExceptionToAdd,
    button_type,
    groupId,
    ExceptionDesc
  ) => {
    let exist = false;
    expData.ExceptionGroups.map((group) => {
      group.ExceptionList.map((exception) => {
        if (
          exception.ExceptionName.toLowerCase() == ExceptionToAdd.toLowerCase()
        ) {
          setbExpExists(true);
          exist = true;
        }
      });
    });
    if (exist) {
      return;
    }

    if (ExceptionDesc.trim() == "") {
      setShowDescError(true);
      document.getElementById("ExceptionNameInput").focus();
    }
    if(ExceptionToAdd.trim() == ""){
      setShowNameError(true);
    }


    if (ExceptionToAdd != "" && ExceptionDesc !="") {
      let maxExceptionId = 0;
      expData.ExceptionGroups.map((group, groupIndex) => {
        group.ExceptionList.map((listElem) => {
          if (listElem.ExceptionId > +maxExceptionId) {
            maxExceptionId = listElem.ExceptionId;
          }
        });
      });
      axios
        .post(SERVER_URL + ENDPOINT_ADD_EXCEPTION, {
          groupId: groupId,
          expTypeId: +maxExceptionId + 1,
          expTypeName: ExceptionToAdd,
          expTypeDesc: ExceptionDesc,
          processDefId: props.openProcessID,
        })
        .then((res) => {
          if (res.data.Status == 0) {
            let tempData = { ...expData };
            let groupName;
            tempData.ExceptionGroups.map((group) => {
              if (group.GroupId == groupId) {
                groupName = group.GroupName;
                group.ExceptionList.push({
                  ExceptionId: +maxExceptionId + 1,
                  ExceptionName: ExceptionToAdd,
                  Description: ExceptionDesc,
                  Activities: [],
                  SetAllChecks: {
                    Clear: false,
                    Raise: false,
                    Respond: false,
                    View: false,
                  },
                });
              }
            });
            setExpData(tempData);
            if (button_type != "addAnother") {
              handleExpClose();
            }
            if (button_type == "addAnother") {
              document.getElementById("ExceptionNameInput").value = "";
              document.getElementById("ExceptionNameInput").focus();
              setExpName("");
              setExceptionDesc("");
            }

            //code added on 3 June 2022 for BugId 110101
            //Updating ruleDataArray
            let temp = [...ruleDataArray];
            temp.push({
              Name: ExceptionToAdd,
              NameId: +maxExceptionId + 1,
              Group: groupName,
              GroupId: groupId,
            });
            setRuleDataArray(temp);

            // Updating processData on adding Exception
            let newProcessData = { ...localLoadedProcessData };
            newProcessData.ExceptionList.push({
              Description: ExceptionDesc,
              ExceptionId: +maxExceptionId + 1,
              ExceptionName: ExceptionToAdd,
            });
            setLocalLoadedProcessData(newProcessData);
          }
        });
    } else if (ExceptionToAdd.trim() == "") {
      setShowNameError(true);
      document.getElementById("ExceptionNameInput").focus();
    }
  };

  const addGroupToList = (GroupToAdd, button_type, newGroupToMoveExp) => {
    let exist = false;
    expData &&
      expData.ExceptionGroups.map((group, groupIndex) => {
        if (group.GroupName.toLowerCase() == GroupToAdd.toLowerCase()) {
          setbGroupExists(true);
          exist = true;
        }
      });
    if (exist) {
      return;
    }
    if (GroupToAdd != "") {
      let maxGroupId = expData.ExceptionGroups.reduce(
        (acc, group) => (acc > group.GroupId ? acc : group.GroupId),
        0
      );
      axios
        .post(SERVER_URL + ENDPOINT_ADD_GROUP, {
          m_strGroupName: GroupToAdd,
          m_strGroupId: +maxGroupId + 1,
          interfaceType: "E",
          processDefId: props.openProcessID,
        })
        .then((res) => {
          if (res.data.Status == 0) {
            let tempData = { ...expData };
            tempData.ExceptionGroups.push({
              GroupName: GroupToAdd,
              AllGroupRights: {
                Respond: true,
                View: true,
                Raise: false,
                Clear: false,
              },
              GroupId: +maxGroupId + 1,
              ExceptionList: [],
            });
            setExpData(tempData);
            handleExpClose();
            if (newGroupToMoveExp) {
              MoveToOtherGroup(
                GroupToAdd,
                newGroupToMoveExp.exceptionId,
                newGroupToMoveExp.exceptionName,
                newGroupToMoveExp.expDesc,
                newGroupToMoveExp.sourceGroupId
              );
            }
          }
        });
      if (button_type != "addAnother") {
        handleClose();
      } else if (button_type == "addAnother") {
        setGroupName("");
        document.getElementById("groupNameInput_exception").focus();
      }
    } else if (GroupToAdd.trim() == "") {
      alert("Please enter Group Name");
      document.getElementById("groupNameInput_exception").focus();
    }
  };

  const deleteExpType = (expName, expId) => {
    axios
      .post(SERVER_URL + ENDPOINT_DELETE_EXCEPTION, {
        processDefId: props.openProcessID,
        expTypeName: expName,
        expTypeId: expId,
        expTypeDesc: exceptionDesc,
      })
      .then((res) => {
        if (res.data.Status == 0) {
          let tempData = { ...expData };
          let exceptionToDeleteIndex, parentIndex;
          tempData.ExceptionGroups?.forEach((group, groupIndex) => {
            group.ExceptionList?.forEach((exception, exceptionIndex) => {
              if (exception.ExceptionId == expId) {
                exceptionToDeleteIndex = exceptionIndex;
                parentIndex = groupIndex;
              }
            });
          });
          tempData.ExceptionGroups[parentIndex].ExceptionList.splice(
            exceptionToDeleteIndex,
            1
          );
          setExpData(tempData);
          handleClose();

          //code added on 3 June 2022 for BugId 110096
          //Updating RuleDataArray
          let tempRule = [...ruleDataArray];
          let idx = null;
          tempRule.forEach((exp, index) => {
            if (exp.NameId === expId) {
              idx = index;
            }
          });
          tempRule.splice(idx, 1);
          setRuleDataArray(tempRule);

          // Updating processData on deleting Exception
          let newProcessData = { ...localLoadedProcessData };
          let indexValue;
          newProcessData.ExceptionList.forEach((exception, index) => {
            if (exception.ExceptionId == expId) {
              indexValue = index;
            }
          });
          newProcessData.ExceptionList.splice(indexValue, 1);
          setLocalLoadedProcessData(newProcessData);
        }
      });
  };

  const deleteGroup = (groupName, groupId) => {
    axios
      .post(SERVER_URL + ENDPOINT_DELETE_GROUP, {
        processDefId: props.openProcessID,
        m_strGroupName: groupName,
        m_strGroupId: groupId,
        interfaceType: "E",
      })
      .then((res) => {
        if (res.data.Status == 0) {
          let groupIndexToDelete;
          let tempData = { ...expData };
          tempData.ExceptionGroups.map((group, groupIndex) => {
            if (group.GroupId == groupId) {
              groupIndexToDelete = groupIndex;
            }
          });
          tempData.ExceptionGroups.splice(groupIndexToDelete, 1);
          setExpData(tempData);
          handleClose();
        }
      });
  };

  const editDescription = (groupId, expName, expDesc, expId) => {
    setExpNameToModify(expName);
    setExpDescToModify(expDesc);
    setExpIdToModify(expId);
    handleExpOpen(groupId);
  };

  const modifyDescription = (expName, groupId, expDesc, expId) => {
    axios
      .post(SERVER_URL + ENDPOINT_MODIFY_EXCEPTION, {
        expTypeId: expId,
        expTypeName: expName,
        expTypeDesc: expDesc,
        processDefId: props.openProcessID,
      })
      .then((res) => {
        let tempData = { ...expData };
        tempData.ExceptionGroups.map((group) => {
          if (group.GroupId === groupId) {
            group.ExceptionList.map((exp) => {
              if (exp.ExceptionId === expId) {
                exp.Description = expDesc;
              }
            });
          }
        });
        setExpData(tempData);
        handleExpClose();
      });
  };

  const MoveToOtherGroup = (
    targetGroupName,
    exceptionId,
    exceptionName,
    exceptionDesc,
    sourceGroupId
  ) => {
    let targetGroupId;
    expData.ExceptionGroups.map((group) => {
      if (group.GroupName == targetGroupName) {
        targetGroupId = group.GroupId;
      }
    });
    axios
      .post(SERVER_URL + ENDPOINT_MOVETO_OTHERGROUP, {
        processDefId: props.openProcessID,
        interfaceId: exceptionId,
        interfaceName: exceptionName,
        interfaceType: "E",
        sourceGroupId: sourceGroupId,
        targetGroupId: targetGroupId,
        processType: props.openProcessType,
      })
      .then((res) => {
        //  Removing from SourceGroup
        if (res.data.Status == 0) {
          let tempData = { ...expData };
          let exceptionToDeleteIndex, parentIndex;
          tempData.ExceptionGroups.forEach((group, groupIndex) => {
            group.ExceptionList.forEach((exception, exceptionIndex) => {
              if (exception.ExceptionId == exceptionId) {
                exceptionToDeleteIndex = exceptionIndex;
                parentIndex = groupIndex;
              }
            });
          });
          tempData.ExceptionGroups[parentIndex].ExceptionList.splice(
            exceptionToDeleteIndex,
            1
          );
          // Adding to TargetGroup
          tempData.ExceptionGroups.map((group) => {
            if (group.GroupId == targetGroupId) {
              group.ExceptionList.push({
                ExceptionId: exceptionId,
                ExceptionName: exceptionName,
                Description: exceptionDesc,
                Activities: [],
                SetAllChecks: {
                  Clear: false,
                  Raise: false,
                  Respond: false,
                  View: false,
                },
              });
            }
          });
          setExpData(tempData);
        }
      });
  };

  const handleOpen = () => {
    setAddGroupModal(true);
  };

  const handleClose = () => {
    setAddGroupModal(false);
    setbGroupExists(false);
    setbExpExists(false);
  };

  const handleExpOpen = (groupId) => {
    setAddExceptionModal(groupId);
  };

  const handleExpClose = () => {
    setAddExceptionModal(null);
    setbExceptionExists(false);
  };

  const handleActivityModalOpen = (activity_id) => {
    setOpenActivityModal(activity_id);
  };

  const handleActivityModalClose = () => {
    setOpenActivityModal(null);
  };

  //Reusable function with common code to keep check on fullRightCheckOneActivityArr changing values
  const fullRights_oneActivity_allExps = (activity_id, newState) => {
    fullRightsOneActivity(
      activity_id,
      newState,
      setFullRightCheckOneActivityArr
    );
  };

  const clearSearchResult = () => {
    setExpData(filteredExceptions);
  };

  const clearActivitySearchResult = () => {
    let activityIdString = "";
    localLoadedProcessData?.MileStones.map((mileStone) => {
      mileStone.Activities.map((activity, index) => {
        activityIdString = activityIdString + activity.ActivityId + ",";
      });
    });
    MapAllActivities(activityIdString);
    setLoadedMileStones(localLoadedProcessData?.MileStones);
  };

  const onSearchChange = (value) => {
    if (value.trim() !== "") {
      let tempState = [];
      expData.ExceptionGroups &&
        expData.ExceptionGroups.forEach((group, index) => {
          let temp = group.ExceptionList.filter((exp) => {
            if (exp.ExceptionName.toLowerCase().includes(value.toLowerCase())) {
              return exp;
            }
          });
          if (temp.length > 0) {
            tempState.push({ ...group, ExceptionList: temp });
          }
        });
      setExpData((prevState) => {
        return { ...prevState, ExceptionGroups: tempState };
      });
    } else {
      clearSearchResult();
    }
  };

  const onActivitySearchChange = (value) => {
    let temp = [];
    setActivitySearchTerm(value);
    if (value.trim() !== "") {
      let activityIdString = "";
      loadedMileStones.map((mileStone) => {
        let activities = [];
        mileStone.Activities.map((activity, index) => {
          if (activity.ActivityName.includes(value)) {
            activityIdString = activityIdString + activity.ActivityId + ",";
            activities.push(activity);
          }
        });
        temp.push({ ...mileStone, Activities: activities });
      });
      // MapAllActivities(activityIdString);
      setLoadedMileStones(temp);
    } else {
      clearActivitySearchResult();
    }
  };

  const toggleSingleChecks = (
    check_type,
    exp_idx,
    activity_id,
    groupIndex,
    checkTypeValue,
    checks
  ) => {
    // CASE:1 - Single checkBox of any Activity in Any Exception
    let localCheckArray;
    localCheckArray = {
      View:
        (check_type == "Respond" && !checkTypeValue) ||
        (check_type == "Raise" && !checkTypeValue) ||
        (check_type == "Clear" && !checkTypeValue)
          ? "Y"
          : checks.View
          ? "Y"
          : "N",
      Respond:
        check_type == "View" && checkTypeValue
          ? "N"
          : checks.Respond
          ? "Y"
          : "N",
      Raise:
        check_type == "View" && checkTypeValue ? "N" : checks.Raise ? "Y" : "N",
      Clear:
        check_type == "View" && checkTypeValue ? "N" : checks.Clear ? "Y" : "N",
    };
    let postBody = !checkTypeValue
      ? {
          processDefId: props.openProcessID,
          check: true,
          pMExpTypeInfos: [
            {
              expTypeName:
                expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
                  .ExceptionName,
              expTypeId:
                expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
                  .ExceptionId,
              pMActRightsInfoList: [
                {
                  actId: activity_id,
                  vTrigFlag: check_type == "View" ? "Y" : localCheckArray.View,
                  vrTrigFlag:
                    check_type == "Raise" ? "Y" : localCheckArray.Raise,
                  vaTrigFlag:
                    check_type == "Respond" ? "Y" : localCheckArray.Respond,
                  vcTrigFlag:
                    check_type == "Clear" ? "Y" : localCheckArray.Clear,
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          check: false,
          pMExpTypeInfos: [
            {
              expTypeName:
                expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
                  .ExceptionName,
              expTypeId:
                expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
                  .ExceptionId,
              pMActRightsInfoList: [
                {
                  actId: activity_id,
                  vTrigFlag: check_type == "View" ? "N" : localCheckArray.View,
                  vrTrigFlag:
                    check_type == "Raise" ? "N" : localCheckArray.Raise,
                  vaTrigFlag:
                    check_type == "Respond" ? "N" : localCheckArray.Respond,
                  vcTrigFlag:
                    check_type == "Clear" ? "N" : localCheckArray.Clear,
                },
              ],
              vTrigFlag: check_type == "View" ? "Y" : "N",
              vrTrigFlag:
                check_type == "View" && checkTypeValue && checks.Raise
                  ? "Y"
                  : check_type == "Raise"
                  ? "Y"
                  : "N",
              vaTrigFlag:
                check_type == "View" && checkTypeValue && checks.Respond
                  ? "Y"
                  : check_type == "Respond"
                  ? "Y"
                  : "N",
              vcTrigFlag:
                check_type == "View" && checkTypeValue && checks.Clear
                  ? "Y"
                  : check_type == "Clear"
                  ? "Y"
                  : "N",
            },
          ],
        };
    axios.post(SERVER_URL + `/saveExceptionRight`, postBody).then((res) => {
      if (res.status === 200) {
      }
    });
    let newState = { ...expData };
    fullRights_oneActivity_allExps(activity_id, newState);

    if (
      (check_type == "Respond" && !checkTypeValue) ||
      (check_type == "Raise" && !checkTypeValue) ||
      (check_type == "Clear" && !checkTypeValue)
    ) {
      newState.ExceptionGroups[groupIndex].ExceptionList[
        exp_idx
      ].Activities.map((activity) => {
        if (activity.ActivityId == activity_id) {
          activity["View"] = true;
        }
      });
    }

    if (check_type == "View" && checkTypeValue) {
      newState.ExceptionGroups[groupIndex].ExceptionList[
        exp_idx
      ].Activities.map((activity) => {
        if (activity.ActivityId == activity_id) {
          activity["Raise"] = false;
          activity["Respond"] = false;
          activity["Clear"] = false;
        }
      });
    }
    // single-check
    newState.ExceptionGroups[groupIndex].ExceptionList[exp_idx].Activities.map(
      (activity) => {
        if (activity.ActivityId == activity_id) {
          activity[check_type] = !activity[check_type];
        }
      }
    );

    // set-all check
    let setAllPropCheck = true;
    newState.ExceptionGroups[groupIndex].ExceptionList[exp_idx].Activities.map(
      (activity) => {
        if (activity[check_type] === false) {
          setAllPropCheck = false;
        }
      }
    );
    newState.ExceptionGroups[groupIndex].ExceptionList[exp_idx].SetAllChecks[
      check_type
    ] = setAllPropCheck;

    //OneActivityColumn All checks
    let bFlag = true;
    newState.ExceptionGroups[groupIndex].ExceptionList.map((exception) => {
      exception.Activities.map((activity) => {
        if (activity.ActivityId == activity_id) {
          if (Object.values(activity).includes(false) && bFlag) {
            bFlag = false;
            setFullRightCheckOneActivityArr((prevArr) => {
              let temp = [...prevArr];
              temp[activity_id] = false;
              return temp;
            });
          }
        }
      });
    });
    if (bFlag) {
      setFullRightCheckOneActivityArr((prevArr) => {
        let temp = [...prevArr];
        temp[activity_id] = true;
        return temp;
      });
    }
    setExpData(newState);
  };

  const updateActivitySetAllChecks = (
    check_type,
    activity_id,
    checkTypeValue,
    checks,
    setChecks
  ) => {
    // CASE:5 - Giving a particular right (eg:Raise) for one Activity, in all Exception
    let localCheckArray;
    localCheckArray = {
      View:
        (check_type == "Respond" && checkTypeValue) ||
        (check_type == "Raise" && checkTypeValue) ||
        (check_type == "Clear" && checkTypeValue)
          ? "Y"
          : checks.View
          ? "Y"
          : "N",
      Respond:
        check_type == "View" && !checkTypeValue
          ? "N"
          : checks.Respond
          ? "Y"
          : "N",
      Raise:
        check_type == "View" && !checkTypeValue
          ? "N"
          : checks.Raise
          ? "Y"
          : "N",
      Clear:
        check_type == "View" && !checkTypeValue
          ? "N"
          : checks.Clear
          ? "Y"
          : "N",
    };

    let tempInfoListTrue = [];
    expData.ExceptionGroups.forEach((group) => {
      group.ExceptionList.forEach((exp) => {
        tempInfoListTrue.push({
          expTypeName: exp.ExceptionName,
          expTypeId: exp.ExceptionId,
          pMActRightsInfoList: [
            {
              actId: activity_id,
              vTrigFlag: check_type == "View" ? "Y" : localCheckArray.View,
              vrTrigFlag: check_type == "Raise" ? "Y" : localCheckArray.Raise,
              vaTrigFlag:
                check_type == "Respond" ? "Y" : localCheckArray.Respond,
              vcTrigFlag: check_type == "Clear" ? "Y" : localCheckArray.Clear,
            },
          ],
        });
      });
    });
    let tempInfoListFalse = [];
    expData.ExceptionGroups.forEach((group) => {
      group.ExceptionList.forEach((exp) => {
        tempInfoListFalse.push({
          expTypeName: exp.ExceptionName,
          expTypeId: exp.ExceptionId,
          pMActRightsInfoList: [
            {
              actId: activity_id,
              vTrigFlag: check_type == "View" ? "N" : localCheckArray.View,
              vrTrigFlag: check_type == "Raise" ? "N" : localCheckArray.Raise,
              vaTrigFlag:
                check_type == "Respond" ? "N" : localCheckArray.Respond,
              vcTrigFlag: check_type == "Clear" ? "N" : localCheckArray.Clear,
            },
          ],
          vTrigFlag: "Y",
          vrTrigFlag: check_type == "Raise" ? "Y" : "N",
          vaTrigFlag: check_type == "Respond" ? "Y" : "N",
          vcTrigFlag: check_type == "Clear" ? "Y" : "N",
        });
      });
    });
    let postBody = checkTypeValue
      ? {
          processDefId: props.openProcessID,
          check: true,
          pMExpTypeInfos: tempInfoListTrue,
        }
      : {
          processDefId: props.openProcessID,
          check: false,
          pMExpTypeInfos: tempInfoListFalse,
        };
    axios.post(SERVER_URL + `/saveExceptionRight`, postBody).then((res) => {
      if (res.status === 200) {
      }
    });
    let newState = { ...expData };
    if (
      (check_type == "Raise" && checkTypeValue) ||
      (check_type == "Respond" && checkTypeValue) ||
      (check_type == "Clear" && checkTypeValue)
    ) {
      setChecks((prev) => {
        return {
          ...prev,
          View: true,
        };
      });
      newState.ExceptionGroups.map((group, groupIndex) => {
        group.ExceptionList.map((exp) => {
          exp.Activities.map((activity) => {
            if (+activity.ActivityId === +activity_id) {
              activity["View"] = true;
            }
          });
        });
      });
    }

    if (check_type == "View" && !checkTypeValue) {
      setChecks((prev) => {
        return {
          ...prev,
          Raise: false,
          Respond: false,
          Clear: false,
        };
      });
      newState.ExceptionGroups.map((group, groupIndex) => {
        group.ExceptionList.map((exp) => {
          exp.Activities.map((activity) => {
            if (+activity.ActivityId === +activity_id) {
              activity["Raise"] = false;
              activity["Respond"] = false;
              activity["Clear"] = false;
            }
          });
        });
      });
    }
    newState.ExceptionGroups.map((group, groupIndex) => {
      group.ExceptionList.map((exp) => {
        exp.Activities.map((activity) => {
          if (+activity.ActivityId === +activity_id) {
            activity[check_type] = checkTypeValue;
          }
        });
      });
    });
    fullRights_oneActivity_allExps(activity_id, newState);
    setExpData(newState);
  };

  const updateSetAllChecks = (check_val, check_type, exp_idx, groupIndex) => {
    // CASE:3 - Giving a particular right (eg: Raise) for a Single Exception, for all Activities
    let localCheckArray;
    localCheckArray = {
      View:
        (check_type == "Respond" && !check_val) ||
        (check_type == "Raise" && !check_val) ||
        (check_type == "Clear" && !check_val)
          ? "Y"
          : expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
              .SetAllChecks["View"]
          ? "Y"
          : "N",
      Respond:
        check_type == "View" && check_val
          ? "N"
          : expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
              .SetAllChecks["Respond"]
          ? "Y"
          : "N",
      Raise:
        check_type == "View" && check_val
          ? "N"
          : expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
              .SetAllChecks["Raise"]
          ? "Y"
          : "N",
      Clear:
        check_type == "View" && check_val
          ? "N"
          : expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
              .SetAllChecks["Clear"]
          ? "Y"
          : "N",
    };

    let postBody = !check_val
      ? {
          processDefId: props.openProcessID,
          check: true,
          pMExpTypeInfos: [
            {
              expTypeName:
                expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
                  .ExceptionName,
              expTypeId:
                expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
                  .ExceptionId,
              pMActRightsInfoList: [
                {
                  actId: 0,
                  vTrigFlag: check_type == "View" ? "Y" : localCheckArray.View,
                  vrTrigFlag:
                    check_type == "Raise" ? "Y" : localCheckArray.Raise,
                  vaTrigFlag:
                    check_type == "Respond" ? "Y" : localCheckArray.Respond,
                  vcTrigFlag:
                    check_type == "Clear" ? "Y" : localCheckArray.Clear,
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          check: false,
          pMExpTypeInfos: [
            {
              expTypeName:
                expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
                  .ExceptionName,
              expTypeId:
                expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
                  .ExceptionId,
              pMActRightsInfoList: [
                {
                  actId: 0,
                  vTrigFlag: check_type == "View" ? "N" : localCheckArray.View,
                  vrTrigFlag:
                    check_type == "Raise" ? "N" : localCheckArray.Raise,
                  vaTrigFlag:
                    check_type == "Respond" ? "N" : localCheckArray.Respond,
                  vcTrigFlag:
                    check_type == "Clear" ? "N" : localCheckArray.Clear,
                },
              ],
              vTrigFlag: check_type == "View" ? "Y" : "N",
              vrTrigFlag: check_type == "Raise" ? "Y" : "N",
              vaTrigFlag: check_type == "Respond" ? "Y" : "N",
              vcTrigFlag: check_type == "Clear" ? "Y" : "N",
            },
          ],
        };
    axios.post(SERVER_URL + `/saveExceptionRight`, postBody).then((res) => {
      if (res.status === 200) {
        console.log(expData, "ACCCC");
      }
    });
    let newState = { ...expData };
    //set-all
    if (
      (check_type == "Raise" && !check_val) ||
      (check_type == "Respond" && !check_val) ||
      (check_type == "Clear" && !check_val)
    ) {
      expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx].SetAllChecks[
        "View"
      ] = true;
      newState.ExceptionGroups[groupIndex].ExceptionList[
        exp_idx
      ].Activities.map((activity) => {
        activity["View"] = true;
      });
    }

    if (check_type == "View" && check_val) {
      Object.keys(
        expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx].SetAllChecks
      ).forEach(
        (v) =>
          (expData.ExceptionGroups[groupIndex].ExceptionList[
            exp_idx
          ].SetAllChecks[v] = false)
      );
      expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx].Activities.map(
        (activity) => {
          activity["Raise"] = false;
          activity["Respond"] = false;
          activity["Clear"] = false;
        }
      );
    }

    newState.ExceptionGroups[groupIndex].ExceptionList[exp_idx].SetAllChecks[
      check_type
    ] = !check_val;

    //activities
    newState.ExceptionGroups[groupIndex].ExceptionList[exp_idx].Activities.map(
      (activity) => {
        activity[check_type] = !check_val;
      }
    );

    setExpData(newState);
  };

  const GiveCompleteRights = (exp_idx, groupIndex, allRights) => {
    // CASE:2 - Giving all rights to one Exception for all Activities
    let postBody = allRights
      ? {
          processDefId: props.openProcessID,
          check: true,
          pMExpTypeInfos: [
            {
              expTypeName:
                expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
                  .ExceptionName,
              expTypeId:
                expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
                  .ExceptionId,
              pMActRightsInfoList: [
                {
                  actId: 0,
                  vTrigFlag: "Y",
                  vrTrigFlag: "Y",
                  vaTrigFlag: "Y",
                  vcTrigFlag: "Y",
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          check: false,
          pMExpTypeInfos: [
            {
              expTypeName:
                expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
                  .ExceptionName,
              expTypeId:
                expData.ExceptionGroups[groupIndex].ExceptionList[exp_idx]
                  .ExceptionId,
              pMActRightsInfoList: [
                {
                  actId: 0,
                  vTrigFlag: "N",
                  vrTrigFlag: "N",
                  vaTrigFlag: "N",
                  vcTrigFlag: "N",
                },
              ],
            },
          ],
        };
    axios.post(SERVER_URL + `/saveExceptionRight`, postBody).then((res) => {
      if (res.status === 200) {
        console.log(expData, "ACCCC");
      }
    });
    let newState = { ...expData };
    let setObj =
      newState.ExceptionGroups[groupIndex].ExceptionList[exp_idx].SetAllChecks;
    for (let property in setObj) {
      setObj[property] = allRights;
    }
    newState.ExceptionGroups[groupIndex].ExceptionList[exp_idx].SetAllChecks =
      setObj;

    newState.ExceptionGroups[groupIndex].ExceptionList[exp_idx].Activities.map(
      (activity) => {
        for (let property in activity) {
          if (property != "ActivityId") {
            activity[property] = allRights;
          }
        }
      }
    );

    setExpData(newState);
  };

  const GiveCompleteRightsToOneActivity = (activityId) => {
    // CASE:4 - Giving full Rights to one Activity in all Exceptions
    let postBody = !fullRightCheckOneActivityArr[activityId]
      ? {
          processDefId: props.openProcessID,
          check: true,
          pMExpTypeInfos: [
            {
              expTypeName: "",
              expTypeId: "0",
              pMActRightsInfoList: [
                {
                  actId: activityId,
                  vTrigFlag: "Y",
                  vrTrigFlag: "Y",
                  vaTrigFlag: "Y",
                  vcTrigFlag: "Y",
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          check: false,
          pMExpTypeInfos: [
            {
              expTypeName: "",
              expTypeId: "0",
              pMActRightsInfoList: [
                {
                  actId: activityId,
                  vTrigFlag: "N",
                  vrTrigFlag: "N",
                  vaTrigFlag: "N",
                  vcTrigFlag: "N",
                },
              ],
            },
          ],
        };
    axios.post(SERVER_URL + `/saveExceptionRight`, postBody).then((res) => {
      if (res.status === 200) {
      }
    });
    let fullRightCheck = !fullRightCheckOneActivityArr[activityId];
    let newState = { ...expData };
    newState.ExceptionGroups.map((group, groupIndex) => {
      group.ExceptionList.map((type) => {
        type.Activities.map((activity) => {
          if (activity.ActivityId == activityId) {
            giveCompleteRights(fullRightCheck, activity);
          }
        });
        setExpData(newState);
      });
    });

    let arr = [...fullRightCheckOneActivityArr];
    arr[activityId] = fullRightCheck;
    setFullRightCheckOneActivityArr(arr);
  };

  const handleAllRights = (checkedVal, grpIdx, expIdx, actId) => {
    let newState = { ...expData };
    newState.ExceptionGroups[grpIdx].ExceptionList[expIdx].Activities.map(
      (activity) => {
        if (activity.ActivityId == actId) {
          activity["View"] = checkedVal;
          activity["Raise"] = checkedVal;
          activity["Respond"] = checkedVal;
          activity["Clear"] = checkedVal;
        }
      }
    );

    // Controlling set-all
    let setall_obj = {
      View: true,
      Respond: true,
      Raise: true,
      Clear: true,
    };
    newState.ExceptionGroups[grpIdx].ExceptionList[expIdx].Activities.map(
      (activity) => {
        for (let property in activity) {
          if (activity[property] === false && property != "ActivityId") {
            setall_obj[property] = false;
          }
        }
      }
    );
    newState.ExceptionGroups[grpIdx].ExceptionList[expIdx].SetAllChecks =
      setall_obj;

    // Column Top full Column handle checkBox
    let localActivityArr = [];
    let localActivityIdArr = [];
    newState &&
      newState.ExceptionGroups.map((group) => {
        group.ExceptionList &&
          group.ExceptionList.map((exception) => {
            exception.Activities &&
              exception.Activities.map((activity, act_idx) => {
                if (Object.values(activity).includes(false)) {
                  localActivityArr[act_idx] = false;
                } else {
                  if (localActivityArr[act_idx] != false) {
                    localActivityArr[act_idx] = true;
                  }
                }
                localActivityIdArr[act_idx] = activity.ActivityId;
              });
          });
      });

    localActivityArr.forEach((activity, activityIndex) => {
      if (activity === false) {
        setFullRightCheckOneActivityArr((prevArr) => {
          let temp = [...prevArr];
          temp[localActivityIdArr[activityIndex]] = false;
          return temp;
        });
      } else {
        setFullRightCheckOneActivityArr((prevArr) => {
          let temp = [...prevArr];
          temp[localActivityIdArr[activityIndex]] = true;
          return temp;
        });
      }
    });
    setExpData(newState);
  };

  const GetActivities = () => {
    let display = [];
    splicedColumns.map((activity, activityIndex) => {
      let data = [];
      expData.ExceptionGroups &&
        expData.ExceptionGroups.map((group, groupIndex) => {
          data.push(<p style={{ height: "33.5px" }}></p>);
          group.ExceptionList.map((exception, expIndex) => {
            data.push(
              <div
                className="oneActivityColumn"
                style={{
                  backgroundColor: "#EEF4FCC4",
                  height: compact ? "38px" : "137px",
                  padding: "10px",
                  borderBottom: "1px solid #DAD0C2",
                }}
              >
                <CheckBoxes //activity CheckBoxes
                  processType={props.openProcessType}
                  exception={exception}
                  processId={props.openProcessID}
                  groupIndex={groupIndex}
                  activityIndex={expIndex}
                  docIdx={expIndex}
                  activityId={activity.ActivityId}
                  activityType={activity.ActivityType}
                  subActivity={activity.ActivitySubType}
                  expData={expData}
                  GiveCompleteRights={GiveCompleteRights}
                  toggleSingleChecks={toggleSingleChecks}
                  handleAllChecks={handleAllRights}
                  type={"activity"}
                />
              </div>
            );
          });
        });
      display.push(
        <div className="activities">
          <div className="activityHeader" style={{ marginBottom: "1px" }}>
            {activity.ActivityName}
            <Checkbox
              id="masterCheck_oneActivity_exception"
              checked={
                fullRightCheckOneActivityArr[activity.ActivityId] &&
                props.openProcessType == "L"
                  ? true
                  : false
              }
              disabled={props.openProcessType !== "L" ? true : false}
              onChange={() =>
                GiveCompleteRightsToOneActivity(activity.ActivityId)
              }
            />
            {props.openProcessType !== "L" ? null : (
              <ArrowUpwardIcon
                id="oneActivity_particularRight_exception"
                style={{ cursor: "pointer" }}
                type="button"
                onClick={() => handleActivityModalOpen(activity.ActivityId)}
              />
            )}

            {openActivityModal == activity.ActivityId ? (
              <div className="relative">
                <Backdrop
                  show={openActivityModal}
                  clicked={handleActivityModalClose}
                />
                <ActivityModal
                  fullRightCheckOneActivity={
                    fullRightCheckOneActivityArr[activity.ActivityId]
                  }
                  activityIndex={activityIndex}
                  activityId={activity.ActivityId}
                  updateActivitySetAllChecks={updateActivitySetAllChecks}
                  type={"set-all"}
                  docTypeList={expData}
                />
              </div>
            ) : null}
          </div>
          {data}
        </div>
      );
    });
    return display;
  };

  const GetDocList = () => {
    const arrExceptions = [];
    expData.ExceptionGroups &&
      expData.ExceptionGroups.map((group, groupIndex) => {
        arrExceptions.push(
          <React.Fragment>
            <div className="groupNamesDiv">
              <p className="groupName">
                {group.GroupName}
                <span>{`(${group.ExceptionList.length})`}</span>
              </p>
              {props.openProcessType !== "L" ? null : (
                <div className="addExpButtonDiv">
                  <span
                    onClick={() => {
                      handleExpOpen(group.GroupId);
                      setExpNameToModify(null);
                      setExpDescToModify(null);
                      setExpIdToModify(null);
                    }}
                    className="addException"
                  >
                    {t("exceptionAdd")}
                  </span>
                  <DeleteModal
                    backDrop={false}
                    modalPaper="modalPaperActivity"
                    sortByDiv="sortByDivActivity"
                    oneSortOption="oneSortOptionActivity"
                    docIndex={groupIndex}
                    buttonToOpenModal={
                      <button className="threeDotsButton" type="button">
                        <MoreVertIcon
                          style={{
                            color: "#606060",
                            height: "16px",
                            width: "16px",
                          }}
                        />
                      </button>
                    }
                    modalWidth="180"
                    sortSectionOne={[
                      <p
                        id="deleteGroup_exception"
                        onClick={() =>
                          deleteGroup(group.GroupName, group.GroupId)
                        }
                      >
                        {t("delete")}
                      </p>,
                      <p id="modifyGroup_exception">{t("modify")}</p>,
                    ]}
                  />
                </div>
              )}
            </div>
            <Modal
              open={addExceptionModal === group.GroupId}
              onClose={handleExpClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <AddException
                bExpExists={bExpExists}
                groupId={group.GroupId}
                addExceptionToList={addExceptionToList}
                handleClose={handleExpClose}
                bGroupExists={bExceptionExists}
                expNameToModify={expNameToModify}
                expDescToModify={expDescToModify}
                expIdToModify={expIdToModify}
                modifyDescription={modifyDescription}
                expName={expName}
                setExpName={setExpName}
                showNameError={showNameError}
                setShowNameError={setShowNameError}
                showDescError={showDescError}
                setShowDescError={setShowDescError}
              />
            </Modal>
          </React.Fragment>
        );
        let gp_index = groupIndex;
        group.ExceptionList.map((exception, expIndex) => {
          arrExceptions.push(
            <div>
              <div className="activityNameBlock">
                <div className="activityNameDiv">
                  <p className="docName">{exception.ExceptionName}</p>
                  <p className="docDescription">{exception.Description}</p>
                </div>
                {compact ? null : (
                  <div style={{ display: "flex" }}>
                    <CheckBoxes //setAll CheckBoxes
                      processType={props.openProcessType}
                      exception={exception}
                      processId={props.openProcessID}
                      groupIndex={gp_index}
                      docIdx={expIndex}
                      expData={expData}
                      type={"set-all"}
                      activityIndex={expIndex}
                      updateSetAllChecks={updateSetAllChecks}
                      GiveCompleteRights={GiveCompleteRights}
                    />
                    <DeleteModal
                      backDrop={false}
                      modalPaper="modalPaperActivity"
                      sortByDiv="sortByDivActivity"
                      oneSortOption="oneSortOptionActivity"
                      docIndex={expIndex}
                      buttonToOpenModal={
                        <button className="threeDotsButton" type="button">
                          <MoreVertIcon
                            style={{
                              color: "#606060",
                              height: "16px",
                              width: "16px",
                            }}
                          />
                        </button>
                      }
                      modalWidth="180"
                      sortSectionOne={[
                        <p
                          id="deleteExpOption"
                          onClick={() =>
                            deleteExpType(
                              exception.ExceptionName,
                              exception.ExceptionId
                            )
                          }
                        >
                          {t("delete")}
                        </p>,
                        <p
                          id="modifyExpOption"
                          onClick={() =>
                            editDescription(
                              group.GroupId,
                              exception.ExceptionName,
                              exception.Description,
                              exception.ExceptionId
                            )
                          }
                        >
                          {t("modify")}
                        </p>,
                        <p id="moveExp_To_OtherGroup">
                          {t("moveTo")}
                          <DeleteModal
                            addNewGroupFunc={() => {
                              addGroupViaMoveTo(
                                exception.ExceptionId,
                                exception.ExceptionName,
                                exception.Description,
                                group.GroupId
                              );
                            }}
                            getActionName={(targetGroupName) =>
                              MoveToOtherGroup(
                                targetGroupName,
                                exception.ExceptionId,
                                exception.ExceptionName,
                                exception.Description,
                                group.GroupId
                              )
                            }
                            backDrop={false}
                            modalPaper="modalPaperActivity exceptionMoveTo"
                            sortByDiv="sortByDivActivity"
                            oneSortOption="oneSortOptionActivity"
                            docIndex={expIndex}
                            buttonToOpenModal={
                              <button className="threeDotsButton" type="button">
                                <ArrowForwardIosIcon
                                  style={{
                                    color: "#606060",
                                    height: "12px",
                                    width: "12px",
                                  }}
                                />
                              </button>
                            }
                            modalWidth="180"
                            sortSectionOne={[
                              ...ExceptionGroup,
                              <p id="addGroup">{t("newGroup")}</p>,
                            ]}
                          />
                        </p>,
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        });
      });
    return arrExceptions;
  };

  if (isLoading) {
    return <CircularProgress className="circular-progress" />;
  } else
    return (
      <CommonInterface
        newGroupToMove={newGroupToMove}
        screenHeading={t("navigationPanel.exceptions")}
        bGroupExists={bGroupExists}
        setbGroupExists={setbGroupExists}
        addGroupToList={addGroupToList}
        addGroupModal={addGroupModal}
        setActivitySearchTerm={setActivitySearchTerm}
        handleOpen={handleOpen}
        handleClose={handleClose}
        compact={compact}
        GetActivities={GetActivities}
        GetList={GetDocList}
        ruleDataType={ruleDataArray}
        exceptionAllRules={exceptionRules}
        screenType={SCREENTYPE_EXCEPTION}
        ruleType="E"
        onSearchChange={onSearchChange}
        clearSearchResult={clearSearchResult}
        setSearchTerm={setExpSearchTerm}
        openProcessType={props.openProcessType}
        onActivitySearchChange={onActivitySearchChange}
        clearActivitySearchResult={clearActivitySearchResult}
        groupName={groupName}
        setGroupName={setGroupName}
      />
    );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps, null)(Exception);
