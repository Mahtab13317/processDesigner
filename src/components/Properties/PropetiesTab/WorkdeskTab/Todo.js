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
import axios from "axios";
import {
  SERVER_URL,
  ENDPOINT_ADD_TODO,
  ENDPOINT_ADD_GROUP,
  RTL_DIRECTION,
  propertiesLabel,
  PROCESSTYPE_DEPLOYED,
  PROCESSTYPE_REGISTERED,
} from "../../../../Constants/appConstants";
import arabicStyles from "./ArabicStyles.module.css";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import {
  OpenProcessSliceValue,
  setOpenProcess,
} from "../../../../redux-store/slices/OpenProcessSlice";
import "./index.css";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

function Todo(props) {

  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [checkTodo, setCheckTodo] = useState(false);
  const [allToDoData, setAllToDoData] = useState([]);
  const [defineListVal, setDefineListVal] = useState("");
  const [todoDesc, setTodoDesc] = useState("");
  const [mandatoryCheck, setMandatoryCheck] = useState(false);
  const [readOnlyCheck, setReadOnlyCheck] = useState(false);
  const [tempTodoItem, setTempTodoItem] = useState(null);
  const [todoItemData, setTodoItemData] = useState([]);
  const [associatedField, setAssociatedField] = useState("defaultValue");
  const [selectType, setSelectType] = useState(null);
  const [selectedTodoItem, setselectedTodoItem] = useState(null);
  const [addTodo, setAddTodo] = useState(false);
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
  const associateFields = ["CalendarName", "Status"];
  const dispatch = useDispatch();
  const openProcessData = useSelector(OpenProcessSliceValue);
  const [localState, setLocalState] = useState(null);
  const [addAnotherTodo, setAddAnotherTodo] = useState(false);
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut);

  useEffect(() => {
    let tempList = {
      ...localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskTodoLists?.todoMap,
    };
    Object.keys(tempList).forEach((el) => {
      tempList[el] = { ...tempList[el], editable: false };
    });
    setTodoItemData(tempList);
    setCheckTodo(
      localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskTodoLists?.todoRendered
    );
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    let todoIdString = "";
    openProcessData.loadedData?.MileStones?.forEach((mileStone) => {
      mileStone.Activities?.forEach((activity) => {
        todoIdString = todoIdString + activity.ActivityId + ",";
      });
    });
    setAllToDoData(openProcessData.loadedData?.ToDoList);
    setLocalState(openProcessData.loadedData);
    axios
      .get(
        SERVER_URL +
          `/todo/${props.openProcessID}/${props.openProcessType}/${props.openProcessName}/${todoIdString}`
      )
      .then((res) => {
        if (res.data.Status === 0) {
          setToDoData(res.data);
          setTriggerData(res.data.Trigger);
        }
      });
  }, [openProcessData.loadedData]);

  const CheckTodoHandler = () => {
    let val;
    setCheckTodo((prev) => {
      val = !prev;
      return !prev;
    });
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    if (temp?.ActivityProperty?.wdeskInfo) {
      if (temp?.ActivityProperty?.wdeskInfo?.objPMWdeskTodoLists) {
        temp.ActivityProperty.wdeskInfo.objPMWdeskTodoLists = {
          ...temp.ActivityProperty.wdeskInfo.objPMWdeskTodoLists,
          todoRendered: val,
        };
      } else {
        temp.ActivityProperty.wdeskInfo = {
          ...temp.ActivityProperty.wdeskInfo,
          objPMWdeskTodoLists: {
            todoRendered: val,
          },
        };
      }
    } else {
      temp.ActivityProperty = {
        ...temp.ActivityProperty,
        wdeskInfo: {
          objPMWdeskTodoLists: {
            todoRendered: val,
          },
        },
      };
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
  };

  const definedListHandler = (e) => {
    setDefineListVal(e.target.value);
    setselectedTodoItem(null);
    setReadOnlyCheck(false);
    let selectedTodo = null;
    toDoData.TodoGroupLists.forEach((group) => {
      group.ToDoList.forEach((listElem) => {
        if (listElem.ToDoName === e.target.value) {
          selectedTodo = listElem;
        }
      });
    });
    if (selectedTodo) {
      setTodoDesc(selectedTodo.Description);
      setSelectType(selectedTodo.Type);
      setMandatoryCheck(selectedTodo.Mandatory);
      if (selectedTodo.FieldName == "&lt;None&gt;") {
        setAssociatedField("defaultValue");
      } else {
        setAssociatedField(selectedTodo.FieldName);
      }

      if (selectedTodo.Type == "T") {
        setSelectedTrigger(selectedTodo.TriggerName);
      }
    } else {
      setTodoDesc("");
      setSelectType(null);
      setMandatoryCheck(false);
      setAssociatedField("defaultValue");
      setSelectedTrigger("");
    }
    setTempTodoItem(e.target.value);
  };

  const todoItemHandler = (val) => {
    let clickedTodo = todoItemData[val];
    setEditableField(clickedTodo.editable);
    setReadOnlyCheck(clickedTodo.isReadOnly);
    let clickedTodoProp = clickedTodo.todoTypeInfo;
    setDefineListVal(clickedTodoProp.todoName);
    setTodoDesc(clickedTodoProp.todoDesc);
    if (clickedTodoProp.associatedField === "&lt;None&gt;") {
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

  const addHandler = () => {
    let alreadyPresent = todoItemData[tempTodoItem];
    if (!alreadyPresent) {
      let selectedTodo = null;
      setTodoItemData((prev) => {
        let temp = { ...prev };
        toDoData.TodoGroupLists.forEach((group) => {
          group.ToDoList.forEach((listElem) => {
            if (listElem.ToDoName === tempTodoItem) {
              selectedTodo = listElem;
            }
          });
        });
        if (selectedTodo) {
          temp[tempTodoItem] = {
            editable: true,
            isReadOnly: readOnlyCheck,
            todoTypeInfo: {
              ViewType: selectedTodo.Type,
              associatedField: selectedTodo.FieldName,
              mandatory: selectedTodo.Mandatory,
              todoDesc: selectedTodo.Description,
              todoId: selectedTodo.ToDoId,
              todoName: selectedTodo.ToDoName,
              variableId: selectedTodo.VariableId,
            },
          };
        }
        return temp;
      });
      if (selectedTodo) {
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
                ViewType: selectedTodo.Type,
                associatedField: selectedTodo.FieldName,
                mandatory: selectedTodo.Mandatory,
                todoDesc: selectedTodo.Description,
                todoId: selectedTodo.ToDoId,
                todoName: selectedTodo.ToDoName,
                variableId: selectedTodo.VariableId,
              },
            },
          };
        } else {
          tempData.ActivityProperty.wdeskInfo.objPMWdeskTodoLists = {
            ...tempData.ActivityProperty.wdeskInfo.objPMWdeskTodoLists,
            todoMap: {
              [tempTodoItem]: {
                isReadOnly: readOnlyCheck,
                todoTypeInfo: {
                  ViewType: selectedTodo.Type,
                  associatedField: selectedTodo.FieldName,
                  mandatory: selectedTodo.Mandatory,
                  todoDesc: selectedTodo.Description,
                  todoId: selectedTodo.ToDoId,
                  todoName: selectedTodo.ToDoName,
                  variableId: selectedTodo.VariableId,
                },
              },
            },
          };
        }
        setlocalLoadedActivityPropertyData(tempData);

        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.workdesk]: { isModified: true, hasError: false },
          })
        );
      }
    } else {
      dispatch(
        setToastDataFunc({
          message: t("SelectedTodoAlreadyAssociated"),
          severity: "error",
          open: true,
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
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
  };

  const readHandler = () => {
    let val;
    setReadOnlyCheck((prev) => {
      val = !prev;
      return !prev;
    });
    let temp = { ...localLoadedActivityPropertyData };
    let tempdataLocal = {
      ...temp?.ActivityProperty?.wdeskInfo?.objPMWdeskTodoLists,
    };
    if (tempdataLocal?.todoMap && tempdataLocal?.todoMap[selectedTodoItem]) {
      temp.ActivityProperty.wdeskInfo.objPMWdeskTodoLists.todoMap[
        selectedTodoItem
      ].isReadOnly = val;
      setlocalLoadedActivityPropertyData(temp);
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.workdesk]: { isModified: true, hasError: false },
        })
      );
    }
  };

  const handleTriggerSelection = (triggerName) => {
    setSelectedTrigger(triggerName);
  };

  const defineHandler = () => {
    setAddTodo(true);
  };

  const associatedHandler = (e) => {
    setAssociatedField(e.target.value);
  };

  const handleToDoSelection = (selectedToDoType) => {
    setToDoType(selectedToDoType);
  };

  const addToDoToList = (ToDoToAdd, button_type, groupId, ToDoDesc) => {
    let exist = false;
    toDoData?.TodoGroupLists?.forEach((group) => {
      group?.ToDoList?.forEach((todo) => {
        if (
          todo.ToDoName.trim().toLowerCase() == ToDoToAdd.trim().toLowerCase()
        ) {
          exist = true;
        }
      });
    });
    if (exist) {
      dispatch(
        setToastDataFunc({
          message: t("todoAlreadyExists"),
          severity: "error",
          open: true,
        })
      );
    } else {
      // code added on 30 August 2022 for BugId 114886
      if (
        ToDoToAdd.trim() !== "" &&
        ToDoDesc.trim() !== "" &&
        groupId &&
        (groupId + "")?.trim() !== ""
      ) {
        let maxToDoId = 0;
        toDoData?.TodoGroupLists?.map((group) => {
          group?.ToDoList?.map((listElem) => {
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
            mandatory: mandatoryCheckTodo,
            extObjID: "0",
            associatedField: associateField ? associateField : "",
            variableId: associateField === "CalendarName" ? "10001" : "42",
            varFieldId: "0",
            associatedWS: "",
            triggerName: selectedTrigger,
            pickList: [...pickList],
          })
          .then((res) => {
            if (res.data.Status == 0) {
              let temp = JSON.parse(JSON.stringify(localState));
              let maxList = 0;
              temp.ToDoList?.forEach((el) => {
                if (+el.ListId > +maxList) {
                  maxList = +el.ListId;
                }
              });
              temp.ToDoList.push({
                AssociatedFieldName: associateField ? associateField : "",
                AssociatedWorksteps: ",",
                Description: ToDoDesc,
                ExtObjID: "0",
                ListId: `${maxList + 1}`,
                ToDoName: ToDoToAdd,
                Type: toDoType,
                VarFieldId: "0",
                VariableId: associateField === "CalendarName" ? "10001" : "42",
              });
              dispatch(setOpenProcess({ loadedData: temp }));
              let tempData = { ...toDoData };
              tempData.TodoGroupLists.map((group) => {
                if (group.GroupId == groupId) {
                  group.ToDoList.push({
                    Activities: [],
                    Description: ToDoDesc,
                    Type: toDoType,
                    TriggerName: selectedTrigger,
                    Mandatory: mandatoryCheckTodo,
                    ToDoId: +maxToDoId + 1,
                    ToDoName: ToDoToAdd,
                    PickListItems: [...pickList],
                    AllTodoRights: {
                      Modify: false,
                      View: false,
                    },
                    ExtObjID: "0",
                    FieldName: associateField,
                    VarFieldId: "0",
                    VarId: associateField === "CalendarName" ? "10001" : "42",
                  });
                }
              });
              setToDoData(tempData);
              if (button_type !== "addAnother") {
                setAddTodo(false);
                // code added on 7 September 2022 for BugId 112250
                setAddAnotherTodo(false);
              }
              if (button_type === "addAnother") {
                // code added on 7 September 2022 for BugId 112250
                setAddAnotherTodo(true);
              }
            }
          });
      }
      // code added on 30 August 2022 for BugId 114886
      else if (
        ToDoToAdd.trim() === "" ||
        ToDoDesc.trim() === "" ||
        !groupId ||
        (groupId + "")?.trim() === ""
      ) {
        dispatch(
          setToastDataFunc({
            message: t("mandatoryErr"),
            severity: "error",
            open: true,
          })
        );
        document.getElementById("ToDoNameInput").focus();
      }
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

  const addGroupToList = (GroupToAdd, button_type) => {
    let exist = false;
    toDoData?.TodoGroupLists?.forEach((group) => {
      if (group.GroupName.toLowerCase() === GroupToAdd.toLowerCase()) {
        exist = true;
      }
    });
    if (exist) {
      dispatch(
        setToastDataFunc({
          message: t("groupAlreadyExists"),
          severity: "error",
          open: true,
        })
      );
    } else {
      if (GroupToAdd.trim() !== "") {
        let maxGroupId = toDoData?.TodoGroupLists?.reduce(
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
              tempData?.TodoGroupLists.push({
                GroupName: GroupToAdd,
                AllGroupRights: {
                  View: true,
                  Modify: false,
                },
                GroupId: +maxGroupId + 1,
                ToDoList: [],
              });
              setToDoData(tempData);
            }
            if (button_type == "addAnother") {
              document.getElementById("groupNameInput_todo").value = "";
              document.getElementById("groupNameInput_todo").focus();
            }
          });
      } else if (GroupToAdd.trim() === "") {
        dispatch(
          setToastDataFunc({
            message: t("mandatoryErr"),
            severity: "error",
            open: true,
          })
        );
        document.getElementById("groupNameInput_todo").focus();
      }
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
              disabled={isReadOnly}
              data-testid="CheckTodo"
              type="checkbox"
            />
            {t("todoList")}
          </div>
          <div className="row" style={{ alignItems: "end" }}>
            <div style={{ flex: "1" }}>
              <p className={styles.description}>{t("definedList")}</p>
              <Select
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
                className={styles.todoSelect}
                disabled={!checkTodo || isReadOnly}
                value={defineListVal}
                onChange={(e) => definedListHandler(e)}
              >
                <MenuItem className={styles.menuItemStyles} value={""}>
                  {""}
                </MenuItem>
                {allToDoData.map((val) => {
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
            <div style={{ flex: "1", marginLeft: "2rem" }}>
              <button
                disabled={
                  !checkTodo ||
                  (checkTodo && defineListVal.trim() === "") ||
                  isReadOnly
                }
                className={
                  !checkTodo ||
                  (checkTodo && defineListVal.trim() === "") ||
                  isReadOnly
                    ? styles.disabledBtn
                    : styles.addBtn
                }
                onClick={addHandler}
                data-testid="associateBtn"
              >
                {t("associate")}
              </button>
              <button
                disabled={
                  !checkTodo ||
                  props.openProcessType === PROCESSTYPE_DEPLOYED ||
                  props.openProcessType === PROCESSTYPE_REGISTERED
                }
                className={
                  !checkTodo ||
                  props.openProcessType === PROCESSTYPE_DEPLOYED ||
                  props.openProcessType === PROCESSTYPE_REGISTERED
                    ? styles.disabledBtn
                    : styles.addBtn
                }
                onClick={defineHandler}
                data-testid="defineBtn"
              >
                {t("Define")}
              </button>
            </div>
          </div>
          <p className={styles.todoItem}>{t("associatedList")}</p>
          <div className={styles.todoTextarea}>
            <ul>
              {Object.keys(todoItemData)?.map((val) => {
                return (
                  <li
                    onClick={() => todoItemHandler(val)}
                    className={
                      selectedTodoItem == val
                        ? styles.selectedTodo
                        : styles.todoListItem
                    }
                  >
                    {val}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles.deassociateDiv}>
            <button
              disabled={
                !checkTodo || (checkTodo && !selectedTodoItem) || isReadOnly
              }
              className={
                !checkTodo || (checkTodo && !selectedTodoItem) || isReadOnly
                  ? styles.disabledBtn
                  : styles.deleteBtn
              }
              onClick={deleteHandler}
              data-testid="deAssociateBtn"
            >
              {t("deassociate")}
            </button>
          </div>
        </div>
        <div style={{ width: "50%" }}>
          <p className={styles.todoItemDetails}>{t("todoItemDetails")}</p>
          <p className={styles.description}>{t("description")}</p>
          <textarea
            className={styles.descriptionTextarea}
            data-testid="descriptionTextBox"
            value={todoDesc}
            onChange={(e) => descHandler(e)}
            disabled={!checkTodo || (checkTodo && !editableField)}
          />
          <div className="row">
            <div className={`${styles.checklist} todo_checklist`}>
              <Checkbox
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.mainCheckbox
                    : styles.mainCheckbox
                }
                disabled={!checkTodo || (checkTodo && !editableField)}
                checked={mandatoryCheck}
                onChange={() => mandatoryHandler()}
              />
              {t("mandatory")}
            </div>
            <div className={styles.checklist} style={{ marginLeft: "1vw" }}>
              <Checkbox
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.mainCheckbox
                    : styles.mainCheckbox
                }
                disabled={
                  !checkTodo ||
                  (checkTodo && defineListVal.trim() === "") ||
                  +localLoadedActivityPropertyData?.ActivityProperty
                    ?.actType === 2
                }
                checked={readOnlyCheck}
                onChange={() => readHandler()}
              />
              {t("readOnly")}
            </div>
          </div>

          <div style={{ marginTop: "0.5rem" }}>
            <div className={styles.description}>{t("associatedFeild")}</div>
            <div>
              <Select
                className={styles.todoSelect}
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
                style={{ width: "10vw" }}
                disabled={!checkTodo || (checkTodo && !editableField)}
                value={associatedField}
                onChange={(e) => associatedHandler(e)}
              >
                <MenuItem value="defaultValue">&lt;None&gt;</MenuItem>
                {associateFields?.map((x) => {
                  return (
                    <MenuItem key={x} value={x}>
                      {x}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>

          <div style={{ marginTop: "0.5rem" }}>
            <p className={styles.description}>{t("type")}</p>
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
            <input
              value={selectedTrigger}
              disabled={true}
              className={styles.inputField}
            />
          ) : null}
        </div>
      </div>
      <Modal open={addTodo}>
        <AddToDo
          handleClose={() => setAddTodo(false)}
          addToDoToList={addToDoToList}
          selectedToDoType={handleToDoSelection}
          selectedTriggerName={handleTriggerSelection}
          selectedAssociateField={handleAssociateFieldSelection}
          calledFromWorkdesk={true}
          addPickList={addPickList}
          triggerList={triggerData}
          groups={toDoData.TodoGroupLists}
          handleMandatoryCheck={handleMandatoryCheck}
          addGroupToList={addGroupToList}
          addAnotherTodo={addAnotherTodo} // code added on 7 September 2022 for BugId 112250
          setAddAnotherTodo={setAddAnotherTodo} // code added on 7 September 2022 for BugId 112250
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
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
  };
};

export default connect(mapStateToProps, null)(Todo);
