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
  ENDPOINT_ADD_TODO,
  ENDPOINT_ADD_GROUP,
  ENDPOINT_DELETE_TODO,
  ENDPOINT_DELETE_GROUP,
  ENDPOINT_MOVETO_OTHERGROUP,
  SCREENTYPE_TODO,
} from "../../../../Constants/appConstants";
import axios from "axios";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ActivityModal from "./ActivityModal.js";
import { giveCompleteRights } from "../../../../utility/Tools/giveCompleteRights_toDo";
import { connect } from "react-redux";
import DeleteModal from "../../../../UI/ActivityModal/Modal";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import AddToDo from "./AddToDo";
import CommonInterface from "../CommonInterface";
import Backdrop from "../../../../UI/Backdrop/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { BATCH_COUNT } from "../../../../Constants/appConstants";

function ToDo(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [loadedMileStones, setLoadedMileStones] = useState(
    localLoadedProcessData.MileStones
  );
  let { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  let [activitySearchTerm, setActivitySearchTerm] = useState("");
  const [addGroupModal, setAddGroupModal] = React.useState(false);
  const [addToDoModal, setAddToDoModal] = React.useState(null);
  const [compact, setCompact] = useState();
  const [bGroupExists, setbGroupExists] = useState(false);
  const [bToDoExists, setbToDoExists] = useState(false);
  const [openActivityModal, setOpenActivityModal] = useState(null);
  const [triggerData, setTriggerData] = useState();
  const [fullRightCheckOneActivityArr, setFullRightCheckOneActivityArr] =
    useState([]);
  const [toDoType, setToDoType] = useState();
  const [associateField, setAssociateField] = useState(null);
  const [mandatoryCheck, setMandatoryCheck] = useState(false);
  const [toDoNameToModify, setToDoNameToModify] = useState("");
  const [toDoDescToModify, setToDoDescToModify] = useState("");
  const [toDoIdToModify, setToDoIdToModify] = useState();
  const [toDoAssoFieldToModify, setToDoAssoFieldToModify] = useState("");
  const [toDoTypeToModify, setToDoTypeToModify] = useState("");
  const [toDoToModifyTrigger, setToDoToModifyTrigger] = useState("");
  const [toDoMandatoryToModify, setToDoMandatoryToModify] = useState();
  const [toDoSearchTerm, setToDoSearchTerm] = useState("");
  const [newGroupToMove, setNewGroupToMove] = useState();
  const [toDoData, setToDoData] = useState({
    TodoGroupLists: [],
  });
  const [showDescError, setShowDescError] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [showTriggerError, setShowTriggerError] = useState(false);
  const [pickList, setPickList] = useState([]);
  const [filteredToDoTypes, setFilteredToDoTypes] = useState({});
  const [selectedTrigger, setSelectedTrigger] = useState();
  const [subColumns, setSubColumns] = useState([]);
  const [splicedColumns, setSplicedColumns] = useState([]);
  const [groupName, setGroupName] = useState(null);
  const [todoName, setTodoName] = useState(null);
  //code added on 8 June 2022 for BugId 110197
  const [todoRules, setTodoRules] = useState([]);
  const [ruleDataArray, setRuleDataArray] = useState("");

  useEffect(() => {
    let todoIdString = "";
    loadedMileStones &&
      loadedMileStones.map((mileStone) => {
        mileStone.Activities.map((activity, index) => {
          todoIdString = todoIdString + activity.ActivityId + ",";
        });
      });

    MapAllActivities(todoIdString);
    let arr = [];
    loadedMileStones &&
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
          }
        });
      });
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

  let ToDoGroup = [];
  toDoData.TodoGroupLists &&
    toDoData.TodoGroupLists.map((group) => {
      ToDoGroup.push(group.GroupName);
    });

  const MapAllActivities = (todoIdStrings) => {
    axios
      .get(
        SERVER_URL +
          `/todo/${props.openProcessID}/${props.openProcessType}/${props.openProcessName}/${todoIdStrings}`
      )
      .then((res) => {
        if (res.status === 200) {
          //code added on 8 June 2022 for BugId 110197
          setTodoRules(res.data.Rules);
          let newState = { ...res.data };
          newState?.TodoGroupLists?.map((group) => {
            group.ToDoList?.map((todo) => {
              let tempIds = [];
              let tempData = [];
              todo.Activities &&
                todo.Activities.map((activity) => {
                  if (tempIds.includes(activity.ActivityId)) {
                    tempData &&
                      tempData.map((data) => {
                        if (data.ActivityId == activity.ActivityId) {
                          data.View = data.View ? data.View : activity.View;
                          data.Modify = data.Modify
                            ? data.Modify
                            : activity.Modify;
                        }
                      });
                  } else {
                    tempData.push(activity);
                    tempIds.push(activity.ActivityId);
                  }
                });
              todo.Activities = [...tempData];
            });
          });
          //code added on 8 June 2022 for BugId 110197
          let array = [];
          newState?.TodoGroupLists?.map((grp) => {
            grp.ToDoList?.map((name) => {
              let obj = {
                Name: name.ToDoName,
                NameId: name.ToDoId,
                Group: grp.GroupName,
                GroupId: grp.GroupId,
              };
              array.push(obj);
            });
          });
          setRuleDataArray(array);
          let localActivityArr = [];
          let localActivityIdArr = [];
          newState &&
            newState.TodoGroupLists.map((group) => {
              group.ToDoList &&
                group.ToDoList.map((todo) => {
                  todo.Activities &&
                    todo.Activities.map((activity, act_idx) => {
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
          if (toDoSearchTerm.trim() === "") {
            setToDoData(res.data);
          }
          setFilteredToDoTypes(res.data);
          setTriggerData(res.data.Trigger);
          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));
  };

  const addPickList = (pickList) => {
    setPickList(pickList);
  };

  const handleAssociateFieldSelection = (selectedField) => {
    setAssociateField(selectedField);
  };

  const handleMandatoryCheck = (checkValue) => {
    setMandatoryCheck(checkValue);
  };

  const editToDo = (
    groupId,
    toDoName,
    toDoDesc,
    toDoId,
    toDoAssociate,
    toDoType,
    mandatoryValue,
    triggerValue,
    todo
  ) => {
    console.log("TRIGGERVALUE", toDoType, todo, toDoAssociate);
    handleToDoOpen(groupId);
    setToDoNameToModify(toDoName);
    setToDoDescToModify(toDoDesc);
    setToDoIdToModify(toDoId);
    setToDoAssoFieldToModify(toDoAssociate);
    setToDoTypeToModify(toDoType);
    setToDoMandatoryToModify(mandatoryValue);
    setToDoToModifyTrigger(triggerValue);
  };

  const addGroupViaMoveTo = (ToDoId, ToDoName, Description, SourceGroupId) => {
    setNewGroupToMove({
      todoId: ToDoId,
      todoName: ToDoName,
      todoDesc: Description,
      sourceGroupId: SourceGroupId,
    });
    handleOpen();
  };

  const addToDoToList = (ToDoToAdd, button_type, groupId, ToDoDesc) => {
    let exist = false;
    toDoData.TodoGroupLists.map((group, groupIndex) => {
      group.ToDoList.map((todo) => {
        if (todo.ToDoName.toLowerCase() == ToDoToAdd.toLowerCase()) {
          setbToDoExists(true);
          exist = true;
        }
      });
    });
    if (exist) {
      return;
    }

    if (ToDoDesc.trim() == "") {
      setShowDescError(true);
      document.getElementById("ToDoDescInput").focus();
    }
    if (ToDoToAdd.trim() == "") {
      setShowNameError(true);
    }

    if (ToDoToAdd != "" && ToDoDesc != "") {
      if (toDoType == "T" && !selectedTrigger) {
        setShowTriggerError(true);
      } else {
        let maxToDoId = 0;
        toDoData.TodoGroupLists.map((group, groupIndex) => {
          group.ToDoList.map((listElem) => {
            if (+listElem.ToDoId > +maxToDoId) {
              maxToDoId = listElem.ToDoId;
            }
          });
        });

        axios
          .post(SERVER_URL + ENDPOINT_ADD_TODO, {
            processDefId: props.openProcessID,
            todoName: ToDoToAdd,
            todoId: `${+maxToDoId + 1}`,
            groupId: groupId,
            todoDesc: ToDoDesc,
            viewType: toDoType,
            mandatory: mandatoryCheck,
            extObjID: "0",
            associatedField: associateField ? associateField : "", //code added on 27 June 2022 for the issue-- todo cannot be added
            variableId: associateField == "CalenderName" ? "10001" : "42",
            varFieldId: "0",
            associatedWS: "",
            triggerName: selectedTrigger ? selectedTrigger : "",
            pickList: [...pickList],
          })
          .then((res) => {
            if (res.data.Status == 0) {
              let tempData = { ...toDoData };
              let groupName;
              tempData.TodoGroupLists.map((group) => {
                if (group.GroupId == groupId) {
                  groupName = group.GroupName;
                  group.ToDoList.push({
                    Activities: [{}],
                    Description: ToDoDesc,
                    Type: toDoType,
                    TriggerName: selectedTrigger,
                    Mandatory: mandatoryCheck,
                    ToDoId: +maxToDoId + 1,
                    ToDoName: ToDoToAdd,
                    PickListItems: [],
                    AllTodoRights: {
                      Modify: false,
                      View: false,
                    },
                  });
                }
              });
              setToDoData(tempData);
              //code added on 8 June 2022 for BugId 110197
              //Updating ruleDataArray
              let temp = [...ruleDataArray];
              temp.push({
                Name: ToDoToAdd,
                NameId: +maxToDoId + 1,
                Group: groupName,
                GroupId: groupId,
              });
              setRuleDataArray(temp);

              // Updating processData on adding ToDo
              let newProcessData = { ...localLoadedProcessData };
              newProcessData.ToDoList.push({
                Description: ToDoDesc,
                ExtObjID: "0",
                ListId: "1",
                ToDoName: ToDoToAdd,
                Type: toDoType,
                VarFieldId: 0,
                VariableId: associateField == "CalenderName" ? 10001 : 42,
              });
              setLocalLoadedProcessData(newProcessData);
            }
          });
        if (button_type != "addAnother") {
          handleToDoClose();
        } else if (button_type == "addAnother") {
          // document.getElementById("ToDoNameInput").value = "";
          setTodoName("");
          document.getElementById("ToDoNameInput").focus();
        }
      }
    } else if (ToDoToAdd.trim() == "") {
      setShowNameError(true);
      document.getElementById("ToDoNameInput").focus();
    }
  };

  const addGroupToList = (GroupToAdd, button_type, newGroupToMoveTodo) => {
    setGroupName(GroupToAdd);
    let exist = false;
    toDoData &&
      toDoData.TodoGroupLists.map((group, groupIndex) => {
        if (group.GroupName.toLowerCase() == GroupToAdd.toLowerCase()) {
          setbGroupExists(true);
          exist = true;
        }
      });
    if (exist) {
      return;
    }
    if (GroupToAdd != "") {
      let maxGroupId = toDoData.TodoGroupLists.reduce(
        (acc, group) => (acc > group.GroupId ? acc : group.GroupId),
        0
      );

      axios
        .post(SERVER_URL + ENDPOINT_ADD_GROUP, {
          m_strGroupName: GroupToAdd,
          m_strGroupId: +maxGroupId + 1,
          interfaceType: "T",
          processDefId: props.openProcessID,
        })
        .then((res) => {
          if (res.data.Status == 0) {
            let tempData = { ...toDoData };
            tempData &&
              tempData.TodoGroupLists.push({
                GroupName: GroupToAdd,
                AllGroupRights: {
                  View: true,
                  Modify: false,
                },
                GroupId: +maxGroupId + 1,
                ToDoList: [],
              });

            setToDoData(tempData);
            setAddGroupModal(false);
            if (newGroupToMoveTodo) {
              MoveToOtherGroup(
                GroupToAdd,
                newGroupToMoveTodo.todoId,
                newGroupToMoveTodo.todoName,
                newGroupToMoveTodo.todoDesc,
                newGroupToMoveTodo.sourceGroupId
              );
            }
          }
        });
      if (button_type != "addAnother") {
        handleToDoClose();
      } else if (button_type == "addAnother") {
        if (document.getElementById("groupNameInput_exception")) {
          document.getElementById("groupNameInput_exception").focus();
        }
        setGroupName("");
      }
    } else if (GroupToAdd.trim() == "") {
      alert("Please enter Group Name");
      document.getElementById("groupNameInput_exception").focus();
    }
  };

  const deleteToDo = (todoName, todoId) => {
    axios
      .post(SERVER_URL + ENDPOINT_DELETE_TODO, {
        processDefId: props.openProcessID,
        todoName: todoName,
        todoId: todoId,
        viewType: toDoType,
        mandatory: true,
      })
      .then((res) => {
        if (res.data.Status == 0) {
          let tempData = { ...toDoData };
          let exceptionToDeleteIndex, parentIndex;
          tempData.TodoGroupLists.forEach((group, groupIndex) => {
            group.ToDoList.forEach((exception, exceptionIndex) => {
              if (exception.ToDoId == todoId) {
                exceptionToDeleteIndex = exceptionIndex;
                parentIndex = groupIndex;
              }
            });
          });
          //code added on 8 June 2022 for BugId 110197
          //Updating RuleDataArray
          let tempRule = [...ruleDataArray];
          let idx = null;
          tempRule.forEach((exp, index) => {
            if (exp.NameId === todoId) {
              idx = index;
            }
          });
          tempRule.splice(idx, 1);
          setRuleDataArray(tempRule);

          tempData.TodoGroupLists[parentIndex].ToDoList.splice(
            exceptionToDeleteIndex,
            1
          );
          setToDoData(tempData);
          handleClose();

          // Updating processData on deleting ToDo
          let newProcessData = { ...localLoadedProcessData };
          let indexValue;
          newProcessData.ToDoList.map((todo, index) => {
            if (todo.ToDoId == todoId) {
              indexValue = index;
            }
          });
          newProcessData.ToDoList.splice(indexValue, 1);
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
        interfaceType: "T",
      })
      .then((res) => {
        if (res.data.Status == 0) {
          let groupIndexToDelete;
          let tempData = { ...toDoData };
          tempData.TodoGroupLists.map((group, groupIndex) => {
            if (group.GroupId == groupId) {
              groupIndexToDelete = groupIndex;
            }
          });
          tempData.TodoGroupLists.splice(groupIndexToDelete, 1);
          setToDoData(tempData);
          handleToDoClose();
        }
      });
  };

  const handleOpen = () => {
    setAddGroupModal(true);
  };

  const handleClose = () => {
    setAddGroupModal(false);
    setbGroupExists(false);
  };

  const handleToDoOpen = (groupId) => {
    setAddToDoModal(groupId);
  };

  const handleToDoClose = () => {
    setAddToDoModal(null);
    setbToDoExists(false);
  };

  const handleActivityModalOpen = (activity_id) => {
    setOpenActivityModal(activity_id);
  };

  const handleActivityModalClose = () => {
    setOpenActivityModal(null);
  };

  const clearSearchResult = () => {
    setToDoData(filteredToDoTypes);
  };

  const clearActivitySearchResult = () => {
    let activityIdString = "";
    localLoadedProcessData.MileStones.map((mileStone) => {
      mileStone.Activities.map((activity, index) => {
        activityIdString = activityIdString + activity.ActivityId + ",";
      });
    });
    MapAllActivities(activityIdString);
    setLoadedMileStones(localLoadedProcessData.MileStones);
  };

  const onSearchChange = (value) => {
    if (value.trim() !== "") {
      let tempState = [];
      toDoData.TodoGroupLists &&
        toDoData.TodoGroupLists.forEach((group, index) => {
          let temp = group.ToDoList.filter((todo) => {
            if (todo.ToDoName.toLowerCase().includes(value.toLowerCase())) {
              return todo;
            }
          });
          if (temp.length > 0) {
            tempState.push({ ...group, ToDoList: temp });
          }
        });
      setToDoData((prevState) => {
        return { ...prevState, TodoGroupLists: tempState };
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
      MapAllActivities(activityIdString);
      setLoadedMileStones(temp);
    } else {
      clearActivitySearchResult();
    }
  };

  const toggleSingleChecks = (
    checks,
    check_type,
    todo_idx,
    activity_id,
    groupIndex
  ) => {
    // CASE:1 - Single checkBox of any Activity in Any ToDo
    let localCheckArray;
    localCheckArray = {
      View:
        check_type == "Modify" && !checks[check_type]
          ? "Y"
          : checks.View
          ? "Y"
          : "N",
      Modify:
        check_type == "View" && checks[check_type]
          ? "N"
          : checks.Modify
          ? "Y"
          : "N",
    };

    let postBody = !checks[check_type]
      ? {
          processDefId: props.openProcessID,
          pMTodoTypeInfoList: [
            {
              todoName:
                toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx].ToDoName,
              todoId:
                toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx].ToDoId,
              pMActRightsInfoList: [
                {
                  actId: activity_id,
                  view: check_type == "View" ? "Y" : localCheckArray.View,
                  modify: check_type == "Modify" ? "Y" : localCheckArray.Modify,
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          pMTodoTypeInfoList: [
            {
              todoName:
                toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx].ToDoName,
              todoId:
                toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx].ToDoId,
              pMActRightsInfoList: [
                {
                  actId: activity_id,
                  view: check_type == "View" ? "N" : localCheckArray.View,
                  modify: check_type == "Modify" ? "N" : localCheckArray.Modify,
                },
              ],
            },
          ],
        };
    axios.post(SERVER_URL + `/saveTodoRight`, postBody).then((res) => {
      if (res.status === 200) {
      }
    });
    let newState = { ...toDoData };

    if (check_type == "Modify" && !checks[check_type]) {
      newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].Activities.map(
        (activity) => {
          if (activity.ActivityId == activity_id) {
            activity["View"] = !activity[check_type];
          }
        }
      );
    }

    if (check_type == "View") {
      newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].Activities.map(
        (activity) => {
          if (activity.ActivityId == activity_id) {
            if (activity[check_type] === true) {
              activity["Modify"] = false;
            }
          }
        }
      );
    }
    // single-check
    newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].Activities.map(
      (activity) => {
        if (activity.ActivityId == activity_id) {
          activity[check_type] = !activity[check_type];
        }
      }
    );

    // set-all check
    let setAllPropCheck = true;
    newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].Activities.map(
      (activity) => {
        if (activity[check_type] === false) {
          setAllPropCheck = false;
        }
      }
    );
    newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].AllTodoRights[
      check_type
    ] = setAllPropCheck;

    //OneActivityColumn All checks
    let bFlag = true;
    newState.TodoGroupLists[groupIndex].ToDoList.map((exception) => {
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
    setToDoData(newState);
  };

  const updateActivityAllTodoRights = (
    check_type,
    activity_id,
    checkTypeValue,
    setChecks,
    checks
  ) => {
    // CASE:5 - Giving a particular right (eg:View) for one Activity, in all ToDo
    let localCheckArray;
    localCheckArray = {
      View:
        check_type == "Modify" && checkTypeValue
          ? "Y"
          : checks.View
          ? "Y"
          : "N",
      Modify:
        check_type == "Modify" && !checkTypeValue
          ? "N"
          : checks.Modify
          ? "Y"
          : "N",
    };

    let tempInfoListTrue = [];
    toDoData.TodoGroupLists.forEach((group) => {
      group.ToDoList.forEach((todo) => {
        tempInfoListTrue.push({
          todoName: todo.ToDoName,
          todoId: todo.ToDoId,
          pMActRightsInfoList: [
            {
              actId: activity_id,
              view: check_type == "View" ? "Y" : localCheckArray.View,
              modify: check_type == "Modify" ? "Y" : localCheckArray.Modify,
            },
          ],
        });
      });
    });

    let tempInfoListFalse = [];
    toDoData.TodoGroupLists.forEach((group) => {
      group.ToDoList.forEach((todo) => {
        tempInfoListFalse.push({
          todoName: todo.ToDoName,
          todoId: todo.ToDoId,
          pMActRightsInfoList: [
            {
              actId: activity_id,
              view: check_type == "View" ? "N" : localCheckArray.View,
              modify: check_type == "Modify" ? "N" : localCheckArray.Modify,
            },
          ],
        });
      });
    });
    let postBody = checkTypeValue
      ? {
          processDefId: props.openProcessID,
          pMTodoTypeInfoList: tempInfoListTrue,
        }
      : {
          processDefId: props.openProcessID,
          pMTodoTypeInfoList: tempInfoListFalse,
        };
    axios.post(SERVER_URL + `/saveTodoRight`, postBody).then((res) => {
      if (res.status === 200) {
      }
    });

    let newState = { ...toDoData };
    if (check_type == "Modify") {
      newState.TodoGroupLists.map((group, groupIndex) => {
        group.ToDoList.map((todo) => {
          todo.Activities.map((activity) => {
            if (+activity.ActivityId === +activity_id) {
              if (checkTypeValue) {
                activity["View"] = checkTypeValue;
                setChecks((prev) => {
                  return {
                    ...prev,
                    View: true,
                  };
                });
              }
            }
          });
        });
      });
    }
    if (check_type == "View" && checkTypeValue === false) {
      newState.TodoGroupLists.map((group, groupIndex) => {
        group.ToDoList.map((todo) => {
          todo.Activities.map((activity) => {
            if (+activity.ActivityId === +activity_id) {
              activity["Modify"] = checkTypeValue;
              setChecks((prev) => {
                return {
                  ...prev,
                  Modify: false,
                };
              });
            }
          });
        });
      });
    }
    newState.TodoGroupLists.map((group, groupIndex) => {
      group.ToDoList.map((todo) => {
        todo.Activities.map((activity) => {
          if (+activity.ActivityId === +activity_id) {
            activity[check_type] = checkTypeValue;
          }
        });
      });
    });
    // //OneActivityColumn All checks
    let bFlag = true;
    newState.TodoGroupLists.map((group) => {
      group.ToDoList.map((exception) => {
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
    });
    if (bFlag) {
      setFullRightCheckOneActivityArr((prevArr) => {
        let temp = [...prevArr];
        temp[activity_id] = true;
        return temp;
      });
    }
    setToDoData(newState);
  };

  const updateAllTodoRights = (check_val, check_type, todo_idx, groupIndex) => {
    // CASE:3 - Giving a particular right (eg: Modify) for a Single ToDo, for all Activities
    let localCheckArray;
    localCheckArray = {
      View:
        check_type == "Modify" && !check_val
          ? "Y"
          : toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx]
              .AllTodoRights["View"]
          ? "Y"
          : "N",
      Modify:
        check_type == "View" && check_val
          ? "N"
          : toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx]
              .AllTodoRights["Modify"]
          ? "Y"
          : "N",
    };

    let postBody = !check_val
      ? {
          processDefId: props.openProcessID,
          pMTodoTypeInfoList: [
            {
              todoName:
                toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx].ToDoName,

              todoId:
                toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx].ToDoId,
              pMActRightsInfoList: [
                {
                  actId: 0,
                  view: check_type == "View" ? "Y" : localCheckArray.View,
                  modify: check_type == "Modify" ? "Y" : localCheckArray.Modify,
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          pMTodoTypeInfoList: [
            {
              todoName:
                toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx].ToDoName,

              todoId:
                toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx].ToDoId,
              pMActRightsInfoList: [
                {
                  actId: 0,
                  view: check_type == "View" ? "N" : localCheckArray.View,
                  modify: check_type == "Modify" ? "N" : localCheckArray.Modify,
                },
              ],
            },
          ],
        };
    axios.post(SERVER_URL + `/saveTodoRight`, postBody).then((res) => {
      if (res.status === 200) {
        console.log(toDoData, "ACCCC");
      }
    });

    let newState = { ...toDoData };
    //set-all
    newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].AllTodoRights[
      check_type
    ] = !check_val;

    if (check_type == "Modify" && !check_val) {
      newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].Activities.map(
        (activity) => {
          activity["View"] = !check_val;
        }
      );
      newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].AllTodoRights[
        "View"
      ] = !check_val;
    } else if (check_type == "View" && check_val) {
      newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].Activities.map(
        (activity) => {
          activity["Modify"] = false;
        }
      );
      newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].AllTodoRights[
        "Modify"
      ] = false;
    }
    //activities
    newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].Activities.map(
      (activity) => {
        activity[check_type] = !check_val;
      }
    );

    setToDoData(newState);
  };

  const GiveCompleteRights = (todo_idx, groupIndex, allRights) => {
    // CASE:2 - Giving all rights to one ToDo for all Activities
    let postBody = allRights
      ? {
          processDefId: props.openProcessID,
          pMTodoTypeInfoList: [
            {
              todoName:
                toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx].ToDoName,
              todoId:
                toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx].ToDoId,
              pMActRightsInfoList: [
                {
                  actId: 0,
                  view: "Y",
                  modify: "Y",
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          pMTodoTypeInfoList: [
            {
              todoName:
                toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx].ToDoName,
              todoId:
                toDoData.TodoGroupLists[groupIndex].ToDoList[todo_idx].ToDoId,
              pMActRightsInfoList: [
                {
                  actId: 0,
                  view: "N",
                  modify: "N",
                },
              ],
            },
          ],
        };
    axios.post(SERVER_URL + `/saveTodoRight`, postBody).then((res) => {
      if (res.status === 200) {
        console.log(toDoData, "ACCCC");
      }
    });

    let newState = { ...toDoData };
    let setObj =
      newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].AllTodoRights;
    for (let property in setObj) {
      setObj[property] = allRights;
    }
    newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].AllTodoRights =
      setObj;

    newState.TodoGroupLists[groupIndex].ToDoList[todo_idx].Activities.map(
      (activity) => {
        for (let property in activity) {
          if (property != "ActivityId") {
            activity[property] = allRights;
          }
        }
      }
    );

    setToDoData(newState);
  };

  const GiveCompleteRightsToOneActivity = (activityId) => {
    // CASE:4 - Giving full Rights to one Activity in all ToDos
    let postBody = !fullRightCheckOneActivityArr[activityId]
      ? {
          processDefId: props.openProcessID,
          pMTodoTypeInfoList: [
            {
              todoName: "",
              todoId: "0",
              pMActRightsInfoList: [
                {
                  actId: activityId,
                  view: "Y",
                  modify: "Y",
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          pMTodoTypeInfoList: [
            {
              todoName: "",
              todoId: "0",
              pMActRightsInfoList: [
                {
                  actId: activityId,
                  view: "N",
                  modify: "N",
                },
              ],
            },
          ],
        };
    axios.post(SERVER_URL + `/saveTodoRight`, postBody).then((res) => {
      if (res.status === 200) {
      }
    });

    let fullRightCheck = !fullRightCheckOneActivityArr[activityId];
    let newState = { ...toDoData };
    newState.TodoGroupLists.map((group, groupIndex) => {
      group.ToDoList.map((todo) => {
        todo.Activities.map((activity) => {
          if (activity.ActivityId == activityId) {
            giveCompleteRights(fullRightCheck, activity);
          }
        });
        setToDoData(newState);
      });
    });

    let arr = [...fullRightCheckOneActivityArr];
    arr[activityId] = fullRightCheck;
    setFullRightCheckOneActivityArr(arr);
  };

  const handleAllRights = (checkedVal, grpIdx, todoIdx, actId) => {
    let newState = { ...toDoData };
    newState.TodoGroupLists[grpIdx].ToDoList[todoIdx].Activities.map(
      (activity) => {
        if (activity.ActivityId == actId) {
          activity["View"] = checkedVal;
          activity["Modify"] = checkedVal;
        }
      }
    );

    // Controlling set-all
    let setall_obj = {
      View: true,
      Modify: true,
    };
    newState.TodoGroupLists[grpIdx].ToDoList[todoIdx].Activities.map(
      (activity) => {
        for (let property in activity) {
          if (activity[property] === false && property != "ActivityId") {
            setall_obj[property] = false;
          }
        }
      }
    );
    newState.TodoGroupLists[grpIdx].ToDoList[todoIdx].AllTodoRights =
      setall_obj;

    // Column Top full Column handle checkBox
    let localActivityArr = [];
    let localActivityIdArr = [];
    newState &&
      newState.TodoGroupLists.map((group) => {
        group.ToDoList &&
          group.ToDoList.map((todo) => {
            todo.Activities &&
              todo.Activities.map((activity, act_idx) => {
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
    setToDoData(newState);
  };

  const GetActivities = () => {
    let display = [];
    splicedColumns.map((activity, activityIndex) => {
      let data = [];
      toDoData.TodoGroupLists &&
        toDoData.TodoGroupLists.map((group, groupIndex) => {
          data.push(<p style={{ height: "34px" }}></p>);
          group.ToDoList &&
            group.ToDoList.map((todo, todoIndex) => {
              data.push(
                <div>
                  <div
                    className="oneActivityColumn"
                    style={{
                      backgroundColor: "#EEF4FCC4",
                      height: compact ? "38px" : "89px",
                      padding: "10px",
                      borderBottom: "1px solid #DAD0C2",
                      padding: "10px 10px 6px 10px",
                    }}
                  >
                    <CheckBoxes //activity CheckBoxes
                      groupIndex={groupIndex}
                      activityIndex={todoIndex}
                      docIdx={todoIndex}
                      activityId={activity.ActivityId}
                      toDoData={toDoData}
                      activityType={activity.ActivityType}
                      processType={props.openProcessType}
                      subActivity={activity.ActivitySubType}
                      toDoIsMandatory={todo.Mandatory}
                      GiveCompleteRights={GiveCompleteRights}
                      toggleSingleChecks={toggleSingleChecks}
                      handleAllChecks={handleAllRights}
                      type={"activity"}
                    />
                  </div>
                </div>
              );
            });
        });
      display.push(
        <div className="activities">
          <div className="activityHeaderToDo">
            {activity.ActivityName}
            <Checkbox
              id="masterCheck_oneActivity_todo"
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
                id="oneActivity_particularRight_todo"
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
                  compact={compact}
                  fullRightCheckOneActivity={
                    fullRightCheckOneActivityArr[activity.ActivityId]
                  }
                  activityIndex={activityIndex}
                  activityId={activity.ActivityId}
                  updateActivityAllTodoRights={updateActivityAllTodoRights}
                  type={"set-all"}
                  docTypeList={toDoData}
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

  const handleTriggerSelection = (triggerName) => {
    setSelectedTrigger(triggerName);
  };

  const handleToDoSelection = (selectedToDoType) => {
    setToDoType(selectedToDoType);
  };

  const modifyDescription = (expName, groupId, expDesc, expId) => {
    // axios
    //   .post(SERVER_URL + ENDPOINT_MODIFY_TODO, {
    //     expTypeId: expId,
    //     expTypeName: expName,
    //     expTypeDesc: expDesc,
    //     processDefId: props.openProcessID,
    //   })
    //   .then((res) => {
    //     let tempData = { ...expData };
    //     tempData.ExceptionGroups.map((group) => {
    //       if (group.GroupId === groupId) {
    //         group.ExceptionList.map((exp) => {
    //           if (exp.ExceptionId === expId) {
    //             exp.Description = expDesc;
    //           }
    //         });
    //       }
    //     });
    //     setToDoData(tempData);
    //     handleToDoClose();
    //   });
  };

  const MoveToOtherGroup = (
    targetGroupName,
    exceptionId,
    exceptionName,
    exceptionDesc,
    sourceGroupId
  ) => {
    let targetGroupId;
    toDoData.TodoGroupLists.map((group) => {
      if (group.GroupName == targetGroupName) {
        targetGroupId = group.GroupId;
      }
    });
    axios
      .post(SERVER_URL + ENDPOINT_MOVETO_OTHERGROUP, {
        processDefId: props.openProcessID,
        interfaceId: exceptionId,
        interfaceName: exceptionName,
        interfaceType: "T",
        sourceGroupId: sourceGroupId,
        targetGroupId: targetGroupId,
        // groupName: "Group3",
        processType: props.openProcessType,
      })
      .then((res) => {
        //  Removing from SourceGroup
        if (res.data.Status == 0) {
          let tempData = { ...toDoData };
          let exceptionToDeleteIndex, parentIndex;
          tempData.TodoGroupLists.forEach((group, groupIndex) => {
            group.ToDoList.forEach((exception, exceptionIndex) => {
              if (+exception.ToDoId == +exceptionId) {
                exceptionToDeleteIndex = exceptionIndex;
                parentIndex = groupIndex;
              }
            });
          });
          tempData.TodoGroupLists[parentIndex].ToDoList.splice(
            exceptionToDeleteIndex,
            1
          );
          // Adding to TargetGroup
          tempData.TodoGroupLists.map((group) => {
            if (group.GroupId == targetGroupId) {
              group.ToDoList.push({
                Activities: [{}],
                Description: exceptionDesc,
                Type: "T",
                // TriggerName: selectedTrigger,
                ToDoId: exceptionId,
                ToDoName: exceptionName,
                PickListItems: [],
                AllTodoRights: {
                  Modify: false,
                  View: false,
                },
              });
            }
          });
          setToDoData(tempData);
        }
      });
  };

  const GetDocList = () => {
    const arrToDo = [];
    toDoData.TodoGroupLists &&
      toDoData.TodoGroupLists.map((group, groupIndex) => {
        arrToDo.push(
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: "10px",
              }}
            >
              <p
                style={{
                  margin: "5px 0px 8px 0px",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                {group.GroupName}
              </p>
              {props.openProcessType !== "L" ? null : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <span
                    onClick={() => {
                      handleToDoOpen(group.GroupId);
                      setToDoNameToModify("");
                      setToDoDescToModify("");
                      setToDoIdToModify();
                      setToDoAssoFieldToModify("");
                      setToDoTypeToModify("");
                      setToDoMandatoryToModify();
                      setToDoToModifyTrigger("");
                    }}
                    className="addException"
                  >
                    {t("todo") + "+"}
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
                        id="deleteGroup_todo"
                        onClick={() =>
                          deleteGroup(group.GroupName, group.GroupId)
                        }
                      >
                        {t("delete")}
                      </p>,
                      <p id="deleteGroup_todo">{t("modify")}</p>,
                    ]}
                  />
                </div>
              )}
            </div>
            <Modal
              open={addToDoModal === group.GroupId}
              onClose={handleToDoClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <AddToDo
                toDoNameToModify={toDoNameToModify}
                toDoDescToModify={toDoDescToModify}
                toDoIdToModify={toDoIdToModify}
                toDoMandatoryToModify={toDoMandatoryToModify}
                toDoAssoFieldToModify={toDoAssoFieldToModify}
                toDoToModifyTrigger={toDoToModifyTrigger}
                toDoTypeToModify={toDoTypeToModify}
                addPickList={addPickList}
                groupId={group.GroupId}
                addToDoToList={addToDoToList}
                handleClose={handleToDoClose}
                bGroupExists={bToDoExists}
                triggerList={triggerData}
                selectedTriggerName={handleTriggerSelection}
                selectedToDoType={handleToDoSelection}
                selectedAssociateField={handleAssociateFieldSelection}
                handleMandatoryCheck={handleMandatoryCheck}
                todoName={todoName}
                setTodoName={setTodoName}
                showNameError={showNameError}
                setShowNameError={setShowNameError}
                showDescError={showDescError}
                setShowDescError={setShowDescError}
                showTriggerError={showTriggerError}
                setShowTriggerError={setShowTriggerError}
                modifyDescription={modifyDescription}
              />
            </Modal>
          </>
        );
        let gp_index = groupIndex;
        group.ToDoList &&
          group.ToDoList.map((todo, todoIndex) => {
            arrToDo.push(
              <div>
                <div
                  style={{
                    backgroundColor: "#EEF4FCC4",
                    borderBottom: "1px solid #DAD0C2",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 10px 6px 10px",
                    height: "89px",
                  }}
                >
                  <div className="activityNameDiv">
                    <p className="docName">{todo.ToDoName}</p>
                    <p className="docDescription">{todo.Description}</p>
                  </div>
                  {compact ? null : (
                    <div style={{ display: "flex" }}>
                      <CheckBoxes //setAll CheckBoxes
                        processType={props.openProcessType}
                        groupIndex={gp_index}
                        docIdx={todoIndex}
                        toDoData={toDoData}
                        type={"set-all"}
                        activityIndex={todoIndex}
                        updateAllTodoRights={updateAllTodoRights}
                        GiveCompleteRights={GiveCompleteRights}
                      />
                      <DeleteModal
                        backDrop={false}
                        modalPaper="modalPaperActivity"
                        sortByDiv="sortByDivActivity"
                        oneSortOption="oneSortOptionActivity"
                        docIndex={todoIndex}
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
                            id="deleteTodoOption"
                            onClick={() =>
                              deleteToDo(todo.ToDoName, todo.ToDoId)
                            }
                          >
                            {t("delete")}
                          </p>,
                          <p
                            id="modifyTodoOption"
                            onClick={() =>
                              editToDo(
                                group.GroupId,
                                todo.ToDoName,
                                todo.Description,
                                todo.ToDoId,
                                todo.FieldName,
                                todo.Type,
                                todo.Mandatory,
                                todo.TriggerName,
                                todo
                              )
                            }
                          >
                            {t("modify")}
                          </p>,
                          <p
                            id="moveTodo_To_OtherGroup"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {t("moveTo")}
                            <DeleteModal
                              addNewGroupFunc={() => {
                                addGroupViaMoveTo(
                                  todo.ToDoId,
                                  todo.ToDoName,
                                  todo.Description,
                                  group.GroupId
                                );
                              }}
                              getActionName={(targetGroupName) =>
                                MoveToOtherGroup(
                                  targetGroupName,
                                  todo.ToDoId,
                                  todo.ToDoName,
                                  todo.Description,
                                  group.GroupId
                                )
                              }
                              backDrop={false}
                              modalPaper="modalPaperActivity exceptionMoveTo"
                              sortByDiv="sortByDivActivity"
                              oneSortOption="oneSortOptionActivity"
                              docIndex={todoIndex}
                              buttonToOpenModal={
                                <button
                                  className="threeDotsButton"
                                  type="button"
                                >
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
                                ...ToDoGroup,
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
    return arrToDo;
  };

  if (isLoading) {
    return <CircularProgress className="circular-progress" />;
  } else
    return (
      <CommonInterface
        newGroupToMove={newGroupToMove}
        onActivitySearchChange={onActivitySearchChange}
        onSearchChange={onSearchChange}
        screenHeading={t("navigationPanel.toDos")}
        bGroupExists={bGroupExists}
        setbGroupExists={setbGroupExists}
        addGroupToList={addGroupToList}
        addGroupModal={addGroupModal}
        handleOpen={handleOpen}
        handleClose={handleClose}
        compact={compact}
        GetActivities={GetActivities}
        GetList={GetDocList}
        screenType={SCREENTYPE_TODO} //code added on 8 June 2022 for BugId 110197
        todoAllRules={todoRules} //code added on 8 June 2022 for BugId 110197
        ruleDataType={ruleDataArray} //code added on 8 June 2022 for BugId 110197
        setSearchTerm={setToDoSearchTerm}
        setActivitySearchTerm={setActivitySearchTerm}
        clearSearchResult={clearSearchResult}
        clearActivitySearchResult={clearActivitySearchResult}
        openProcessType={props.openProcessType}
        loadedMileStones={loadedMileStones}
        groupName={groupName}
        setGroupName={setGroupName}
        groupsList={toDoData.TodoGroupLists}
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

export default connect(mapStateToProps, null)(ToDo);
