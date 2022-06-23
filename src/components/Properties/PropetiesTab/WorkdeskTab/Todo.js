import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./todo.module.css";
import { Select, MenuItem, Checkbox } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { store, useGlobalState } from "state-pool";
import AddToDo from "../../../ViewingArea/Tools/ToDo/AddToDo";
import Modal from "@material-ui/core/Modal";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import axios from "axios";
import {
  SERVER_URL,
  ENDPOINT_ADD_TODO,
  ENDPOINT_ADD_GROUP,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import arabicStyles from "./ArabicStyles.module.css";

function Todo(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [checkTodo, setCheckTodo] = useState(false);
  const associateFields = ["CalenderName", "Status"];

  const CheckTodoHandler = () => {
    setCheckTodo(!checkTodo);
  };
  const [todoData, setTodoData] = useState(
    loadedProcessData.value ? loadedProcessData.value.ToDoList : []
  );
  const [defineListVal, setDefineListVal] = useState("");
  const [todoDesc, setTodoDesc] = useState("");
  const [mandatoryCheck, setMandatoryCheck] = useState(false);
  const [readOnlyCheck, setReadOnlyCheck] = useState(false);
  const [tempTodoItem, setTempTodoItem] = useState(null);
  const [todoItemData, setTodoItemData] = useState([]);
  const [associatedField, setAssociatedField] = useState("defaultValue");
  const [selectType, setSelectType] = useState(null);
  const [selectedTodoItem, setselectedTodoItem] = useState(null);
  const [addTodo, setaddTodo] = useState(false);
  const [editableField, setEditableField] = useState(false);
  const [triggerData, setTriggerData] = useState();
  const [toDoData, setToDoData] = useState({
    TodoGroupLists: [],
  });
  const [toDoType, setToDoType] = useState();
  const [associateField, setAssociateField] = useState(null);
  const [pickList, setPickList] = useState([]);
  const [mandatoryCheckTodo, setMandatoryCheckTodo] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState("");

  const definedListHandler = (e) => {
    setDefineListVal(e.target.value);
    let selectedDesc = [];
    selectedDesc = todoData.filter((val) => {
      if (val.ToDoName == e.target.value) {
        return val;
      }
    });

    if (selectedDesc.length > 0) {
      setTodoDesc(selectedDesc[0].Description);
      setSelectType(selectedDesc[0].Type);

      if (selectedDesc[0].Type == "M") {
        setMandatoryCheck(true);
      }
      if (selectedDesc[0].Type == "R") {
        setReadOnlyCheck(true);
      }

      if (selectedDesc[0].AssociatedFieldName == "&lt;None&gt;") {
        setAssociatedField("defaultValue");
      } else {
        setAssociatedField(selectedDesc[0].AssociatedFieldName);
      }

      if (selectedDesc[0].Type == "T") {
        setSelectedTrigger(selectedDesc[0].TriggerName);
      }
    }
    setTempTodoItem(e.target.value);
  };

  const dispatch = useDispatch();
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);

  useEffect(() => {
    let tempList = {
      ...(localLoadedActivityPropertyData &&
        localLoadedActivityPropertyData.ActivityProperty &&
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo &&
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo
          .objPMWdeskTodoLists &&
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo
          .objPMWdeskTodoLists.todoMap),
    };

    Object.keys(tempList).forEach((el) => {
      tempList[el] = { ...tempList[el], editable: false };
    });

    setTodoItemData(tempList);
  }, [localLoadedActivityPropertyData]);

  // useEffect(() => {
  //   if (saveCancelStatus.SaveClicked === true) {
  //     let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
  //     temp.ActivityProperty.Interfaces = todoItemData;
  //     setlocalLoadedActivityPropertyData(temp);
  //     dispatch(setSave({ SaveClicked: false }));
  //   }

  //   if (saveCancelStatus.CancelClicked === true) {
  //     setTodoItemData(
  //       localLoadedActivityPropertyData.ActivityProperty.Interfaces
  //     );
  //     dispatch(setSave({ SaveClicked: false, CancelClicked: false }));
  //   }
  // }, [saveCancelStatus]);

  const todoItemHandler = (val) => {
    let clickedTodo = todoItemData[val];
    setEditableField(clickedTodo.editable);
    setReadOnlyCheck(clickedTodo.isReadOnly);
    let clickedTodoProp = clickedTodo.todoTypeInfo;
    setDefineListVal(clickedTodoProp.todoName);
    setTodoDesc(clickedTodoProp.todoDesc);
    if (clickedTodoProp.associatedField == "&lt;None&gt;") {
      setAssociatedField("defaultValue");
    } else {
      setAssociatedField(clickedTodoProp.associatedField);
    }
    setSelectType(clickedTodoProp.ViewType);
    setMandatoryCheck(clickedTodoProp.mandatory);

    setselectedTodoItem(val);
  };

  const descHandler = (e) => {
    setTodoDesc(e.target.value);
  };

  const mandatoryHandler = () => {
    setMandatoryCheck(!mandatoryCheck);
  };

  const handleMandatoryCheck = (checkValue) => {
    setMandatoryCheckTodo(checkValue);
  };

  let temp = { ...loadedActivityPropertyData };
  let tempVal =
    localLoadedActivityPropertyData &&
    localLoadedActivityPropertyData.ActivityProperty &&
    localLoadedActivityPropertyData.ActivityProperty.wdeskInfo &&
    localLoadedActivityPropertyData.ActivityProperty.wdeskInfo
      .objPMWdeskTodoLists &&
    localLoadedActivityPropertyData.ActivityProperty.wdeskInfo
      .objPMWdeskTodoLists.todoMap;

  const addHandler = () => {
    let alreadyPresent = todoItemData[tempTodoItem];
    if (!alreadyPresent) {
      setTodoItemData((prev) => {
        let temp = { ...prev };
        let selected = [];
        selected = todoData.filter((val) => {
          if (val.ToDoName == tempTodoItem) {
            return val;
          }
        });
        if (selected && selected.length > 0) {
          temp[tempTodoItem] = {
            editable: true,
            isReadOnly: readOnlyCheck,
            todoTypeInfo: {
              ViewType: selected[0].Type,
              associatedField: selected[0].AssociatedFieldName,
              mandatory: mandatoryCheck,
              todoDesc: selected[0].Description,
              todoId: selected[0].ListId,
              todoName: selected[0].ToDoName,
              variableId: selected[0].VariableId,
            },
          };
        }
        let tempData = { ...localLoadedActivityPropertyData };

        let tempdataLocal = tempData?.ActivityProperty?.wdeskInfo
          ?.objPMWdeskTodoLists
          ? { ...tempData?.ActivityProperty?.wdeskInfo?.objPMWdeskTodoLists }
          : {};

        if (tempdataLocal?.todoMap) {
          tempData.ActivityProperty.wdeskInfo.objPMWdeskTodoLists.todoMap = {
            ...tempdataLocal?.todoMap,
            [tempTodoItem]: {
              isReadOnly: readOnlyCheck,
              todoTypeInfo: {
                ViewType: selected[0].Type,
                associatedField: selected[0].AssociatedFieldName,
                mandatory: mandatoryCheck,
                todoDesc: selected[0].Description,
                todoId: selected[0].ListId,
                todoName: selected[0].ToDoName,
                variableId: selected[0].VariableId,
              },
            },
          };
        } else {
          tempData.ActivityProperty.wdeskInfo.objPMWdeskTodoLists = {
            todoMap: {
              [tempTodoItem]: {
                isReadOnly: readOnlyCheck,
                todoTypeInfo: {
                  ViewType: selected[0].Type,
                  associatedField: selected[0].AssociatedFieldName,
                  mandatory: mandatoryCheck,
                  todoDesc: selected[0].Description,
                  todoId: selected[0].ListId,
                  todoName: selected[0].ToDoName,
                  variableId: selected[0].VariableId,
                },
              },
            },
          };
        }

        setlocalLoadedActivityPropertyData(tempData);
        return temp;
      });

      dispatch(
        setActivityPropertyChange({
          Workdesk: { isModified: true, hasError: false },
        })
      );
    }
  };
  const deleteHandler = () => {
    let temp = {};
    Object.keys(todoItemData).forEach((el) => {
      if (el != selectedTodoItem) {
        temp = { ...temp, [el]: todoItemData[el] };
      }
    });
    setTodoItemData(temp);

    let tempData = { ...localLoadedActivityPropertyData };

    let tempdataLocal =
      tempData?.ActivityProperty?.wdeskInfo?.objPMWdeskTodoLists?.todoMap;

    let td = {};
    Object.keys(tempdataLocal).forEach((el) => {
      if (el != selectedTodoItem) {
        td = { ...td, [el]: tempdataLocal[el] };
      }
    });

    tempData.ActivityProperty.wdeskInfo.objPMWdeskTodoLists.todoMap = { ...td };
    setlocalLoadedActivityPropertyData(tempData);

    dispatch(
      setActivityPropertyChange({
        Workdesk: { isModified: true, hasError: false },
      })
    );
  };
  const readHandler = () => {
    setReadOnlyCheck(!readOnlyCheck);
  };
  const defineHandler = () => {
    setaddTodo(true);
  };
  const associatedHandler = (e) => {
    setAssociatedField(e.target.value);
  };
  const handleToDoSelection = (selectedToDoType) => {
    setToDoType(selectedToDoType);
  };
  let ToDoGroup = [];
  toDoData.TodoGroupLists &&
    toDoData.TodoGroupLists.map((group) => {
      ToDoGroup.push(group.GroupName);
    });
  useEffect(() => {
    let todoIdString = "";
    localLoadedProcessData &&
      localLoadedProcessData.MileStones.map((mileStone) => {
        mileStone.Activities.map((activity, index) => {
          todoIdString = todoIdString + activity.ActivityId + ",";
        });
      });

    axios
      .get(
        SERVER_URL +
          `/todo/${props.openProcessID}/${props.openProcessType}/${props.openProcessName}/${todoIdString}`
      )
      .then((res) => {
        if (res.status === 200) {
          setToDoData(res.data);
          setTriggerData(res.data.Trigger);
        }
      });
  }, []);

  const addToDoToList = (ToDoToAdd, button_type, groupId, ToDoDesc) => {
    if (ToDoToAdd != "") {
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
          todoId: +maxToDoId + 1,
          groupId: groupId,
          todoDesc: ToDoDesc,
          viewType: toDoType,
          mandatory: mandatoryCheckTodo,
          extObjID: 0,
          associatedField: associateField,
          variableId: associateField == "CalenderName" ? 10001 : 42,
          varFieldId: 0,
          associatedWS: "",
          triggerName: "",
          pickList: [...pickList],
        })
        .then((res) => {
          if (res.data.Status == 0) {
            setTodoData((prev) => {
              return [...prev, { ToDoName: ToDoToAdd }];
            });
            setDefineListVal(ToDoToAdd);
            let tempData = { ...toDoData };
            tempData.TodoGroupLists.map((group) => {
              if (group.GroupId == groupId) {
                group.ToDoList.push({
                  Activities: [{}],
                  Description: ToDoDesc,
                  Type: "T",
                  TriggerName: "",
                  Mandatory: mandatoryCheckTodo,
                  ToDoId: maxToDoId + 1,
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
          }
        });
    } else if (ToDoToAdd.trim() == "") {
      alert("Please enter ToDo Name");
      document.getElementById("ToDoNameInput").focus();
    }
    if (button_type != "addAnother") {
      setaddTodo(false);
    }
    if (button_type == "addAnother") {
      document.getElementById("ToDoNameInput").value = "";
      document.getElementById("ToDoNameInput").focus();
    }
  };
  const addPickList = (pickList) => {
    setPickList(pickList);
  };

  const handleAssociateFieldSelection = (selectedField) => {
    setAssociateField(selectedField);
  };

  const optionSelectType = (e) => {
    setSelectType(e.target.value);
  };

  const addGroupToList = (GroupToAdd, button_type, newGroupToMoveTodo) => {
    let exist = false;
    toDoData &&
      toDoData.TodoGroupLists.map((group, groupIndex) => {
        if (group.GroupName.toLowerCase() == GroupToAdd.toLowerCase()) {
          // setbGroupExists(true);
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
            // handleToDoClose();
          }
        });
    } else if (GroupToAdd.trim() == "") {
      alert("Please enter Group Name");
      document.getElementById("groupNameInput_todo").focus();
    }
    if (button_type != "addAnother") {
      // handleClose();
    }
    if (button_type == "addAnother") {
      document.getElementById("groupNameInput_todo").value = "";
      document.getElementById("groupNameInput_todo").focus();
    }
  };

  return (
    <React.Fragment>
      <div className={styles.flexRow}>
        <div
          style={{
            width: "50%",
            paddingRight: direction === RTL_DIRECTION ? "3%" : "none",
          }}
        >
          <div className={styles.checklist}>
            <Checkbox
              checked={checkTodo}
              onChange={() => CheckTodoHandler()}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.mainCheckbox
                  : styles.mainCheckbox
              }
              data-testid="CheckTodo"
              type="checkbox"
            />
            {t("todoList")}
          </div>
          <div className="row">
            <div>
              <p className={styles.description}>{t("definedList")}</p>
              <Select
                className="selectDropdown"
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
                id="Dropdown"
                style={{
                  border: ".1px solid rgba(0, 0, 0, 0.38)",
                  width: "9rem",
                  height: "1.5rem",
                  fontSize: "14px",
                }}
                disabled={!checkTodo}
                value={defineListVal}
                onChange={(e) => definedListHandler(e)}
              >
                {todoData.map((val) => {
                  return (
                    <MenuItem
                      className={styles.menuItemStyles}
                      key={val.ToDoName}
                      value={val.ToDoName}
                    >
                      {val.ToDoName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            <div style={{ marginTop: "2rem", marginLeft: "2rem" }}>
              <button
                disabled={!checkTodo}
                className={styles.addBtn}
                onClick={addHandler}
                data-testid="associateBtn"
              >
                {t("associate")}
              </button>
              <button
                disabled={!checkTodo}
                className={styles.definebtn}
                onClick={defineHandler}
                data-testid="defineBtn"
              >
                {t("Define")}
              </button>
            </div>
          </div>

          <p className={styles.todoItem}>{t("toDoItem")}</p>

          <div className={styles.todoTextarea}>
            <ul>
              {Object.keys(todoItemData) &&
                Object.keys(todoItemData).map((val) => {
                  return (
                    <li
                      onClick={() => todoItemHandler(val)}
                      className={
                        selectedTodoItem == val ? styles.selectedTodo : null
                      }
                    >
                      {val}
                    </li>
                  );
                })}
            </ul>
          </div>
          <button
            disabled={!checkTodo}
            className={styles.deleteBtn}
            onClick={deleteHandler}
            data-testid="deAssociateBtn"
          >
            {t("deassociate")}
          </button>
        </div>
        <div style={{ width: "50%" }}>
          <h5>{t("todoDetails")}</h5>

          <p className={styles.description}>{t("description")}</p>
          <textarea
            className={styles.descriptionTextarea}
            data-testid="descriptionTextBox"
            value={todoDesc}
            onChange={(e) => descHandler(e)}
            disabled={!checkTodo || (checkTodo && !editableField)}
          />
          <div className="row">
            <div className={styles.checklist}>
              <Checkbox
                style={{ height: "20px", width: "20px", marginRight: "8px" }}
                disabled={!checkTodo || (checkTodo && !editableField)}
                checked={mandatoryCheck}
                onChange={() => mandatoryHandler()}
              />
              {t("mandatory")}
            </div>
            <div className={styles.checklist}>
              <Checkbox
                style={{
                  height: "20px",
                  width: "20px",
                  marginRight: "8px",
                  marginLeft: "10px",
                }}
                disabled={!checkTodo || (checkTodo && !editableField)}
                checked={readOnlyCheck}
                onChange={() => readHandler()}
              />
              {t("readOnly")}
            </div>
          </div>

          <div className="row" style={{ marginTop: "1.5rem" }}>
            <div className={styles.AssiciatedlabelText}>
              {t("associatedFeild")}
            </div>
            <div>
              <Select
                className="selectDropdown"
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
                id="Dropdown"
                style={{
                  border: ".2px solid grey",
                  width: "9rem",
                  height: "1.5rem",
                  fontSize: "14px",
                }}
                disabled={!checkTodo || (checkTodo && !editableField)}
                value={associatedField}
                onChange={(e) => associatedHandler(e)}
              >
                <MenuItem
                  // className={styles.menuItemStyles}
                  // key={val.VariableName}
                  value="defaultValue"
                >
                  &lt;None&gt;
                </MenuItem>
                {associateFields.map((x) => {
                  return (
                    <MenuItem key={x} value={x}>
                      {x}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>

          <div>
            <p className={styles.label}>{t("type")}</p>
            <RadioGroup
              onChange={optionSelectType}
              value={selectType}
              className={styles.radiobtn}
              id="radiobtns"
              disabled={!checkTodo || (checkTodo && !editableField)}
            >
              <FormControlLabel
                value="M"
                control={<Radio />}
                label={t("mark")}
                disabled={!checkTodo || (checkTodo && !editableField)}
              />

              <FormControlLabel
                value="P"
                control={<Radio />}
                label={t("picklist")}
                disabled={!checkTodo || (checkTodo && !editableField)}
              />

              <FormControlLabel
                value="T"
                control={<Radio />}
                label={t("trigger")}
                disabled={!checkTodo || (checkTodo && !editableField)}
              />
            </RadioGroup>
          </div>

          {selectType == "T" ? (
            <div style={{ margin: "15px" }}>
              <input value={selectedTrigger} disable={true} />
            </div>
          ) : null}
        </div>
      </div>
      <Modal open={addTodo} onClose={() => setaddTodo(false)}>
        <AddToDo
          handleClose={() => setaddTodo(false)}
          addToDoToList={addToDoToList}
          selectedToDoType={handleToDoSelection}
          selectedAssociateField={handleAssociateFieldSelection}
          calledFromWorkdesk={true}
          addPickList={addPickList}
          triggerList={triggerData}
          groups={toDoData.TodoGroupLists}
          handleMandatoryCheck={handleMandatoryCheck}
          addGroupToList={addGroupToList}
        />
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps, null)(Todo);
