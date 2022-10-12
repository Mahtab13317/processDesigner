// #BugID - 109986
// #BugDescription - validation for ToDO duplicate name length has been added.
// Changes made to solve Bug 115775 - Todo: blank screen with not found message appears while pressing enter button in the Todo field
import React, { useEffect, useRef, useState } from "react";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Select, MenuItem } from "@material-ui/core";
import RadioGroups from "./RadioButtonsGroup";
import dropdown from "../../../../assets/subHeader/dropdown.svg";
import AddToListDropdown from "../../../../UI/AddToListDropdown/AddToListDropdown";
import { RTL_DIRECTION } from "../../../../Constants/appConstants";
import styles from "../DocTypes/index.module.css";
import CloseIcon from "@material-ui/icons/Close";
import arabicStyles from "../DocTypes/arabicStyles.module.css";
import "../Exception/Exception.css";
import { FieldValidations } from "../../../../utility/FieldValidations/fieldValidations";

function AddToDo(props) {
  const associateFields = ["CalenderName", "Status"];
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [mandatoryValue, setMandatoryValue] = useState(false);
  const [todoTypeValue, setTodoTypeValue] = useState(null);
  const [associateField, setAssociateField] = useState("defaultValue");
  const [selectedGroup, setselectedGroup] = useState([]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [grpList, setgrpList] = useState([]);
  const toDoRef = useRef();

  useEffect(() => {
    let tempGrpList =
      props.groups &&
      props.groups.map((val) => {
        return { ...val, id: val.GroupId };
      });
    setgrpList(tempGrpList);
  }, [props]);

  const setNameFunc = (e) => {
    setNameInput(e.target.value);
    if (e.target.value !== "") {
      if (props.setShowNameError) {
        props.setShowNameError(false);
      }
      // Changes made to solve bug ID 105828
      props?.toDoData?.TodoGroupLists?.map((group, groupIndex) => {
        group.ToDoList.map((todo) => {
          if (todo.ToDoName.toLowerCase() == e.target.value) {
            props.setbToDoExists(true);
          } else {
            props.setbToDoExists(false);
          }
        });
      });
    }
  };

  const onSelect = (e) => {
    props.selectedAssociateField(e.target.value);
    setAssociateField(e.target.value);
  };

  const setDescriptionFunc = (e) => {
    setDescriptionInput(e.target.value);
    if (e.target.value !== "" && props.setShowDescError) {
      props.setShowDescError(false);
    }
  };

  const handleTriggerSelection = (triggerName) => {
    props.selectedTriggerName(triggerName);
    if (triggerName !== "none" || triggerName) {
      props.setShowTriggerError(false);
    }
  };
  const handleToDoTypeSelection = (toDoType) => {
    props.selectedToDoType(toDoType);
  };

  const handleMandatoryValue = (e) => {
    props.handleMandatoryCheck(!mandatoryValue);
    setMandatoryValue(!mandatoryValue);
  };

  useEffect(() => {
    if (props.toDoNameToModify) {
      setNameInput(props.toDoNameToModify);
    }
    if (props.toDoDescToModify) {
      setDescriptionInput(props.toDoDescToModify);
    }

    if (props.toDoMandatoryToModify) {
      setMandatoryValue(props.toDoMandatoryToModify);
    }

    if (props.toDoAssoFieldToModify) {
      setAssociateField(props.toDoAssoFieldToModify);
    }
  }, [
    props.toDoNameToModify,
    props.toDoDescToModify,
    props.toDoMandatoryToModify,
    props.toDoAssoFieldToModify,
  ]);

  // code added on 7 September 2022 for BugId 112250
  useEffect(() => {
    if (props.addAnotherTodo) {
      setNameInput("");
      setDescriptionInput("");
      setMandatoryValue(false);
      setAssociateField("defaultValue");
      setselectedGroup([]);
    }
  }, [props.addAnotherTodo]);

  const onSelectGroup = (grp) => {
    setselectedGroup([grp.id]);
  };

  useEffect(() => {
    if (props.todoName == "") {
      setNameInput("");
      setDescriptionInput("");
      setMandatoryValue(false);
      setAssociateField("defaultValue");
      props.setTodoName(null);
    }
  }, [props.todoName]);

  return (
    <div className="addToDo">
      <div className={styles.modalHeader}>
        <h3
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.modalHeading
              : styles.modalHeading
          }
        >
          {props.toDoNameToModify ? t("modifyToDo") : t("addToDo")}
        </h3>
        <CloseIcon
          onClick={() => props.handleClose()}
          className={styles.closeIcon}
        />
      </div>
      <div className={`${styles.modalSubHeader} flex`} style={{ gap: "2vw" }}>
        <div style={{ flex: "1.2" }}>
          <label className={styles.modalLabel}>
            {t("todoName")}
            <span className={styles.starIcon}>*</span>
          </label>
          <form>
            {/*code added on 8 August 2022 for BugId 112903*/}
            <input
              id="ToDoNameInput"
              value={nameInput}
              onChange={(e) => setNameFunc(e)}
              className={styles.modalInput}
              ref={toDoRef}
              onKeyPress={(e) => {
                if (e.charCode == "13") {
                  e.preventDefault();
                } else {
                  FieldValidations(e, 150, toDoRef.current, 50);
                }
              }}
            />
          </form>
          {props.showNameError ? (
            <span
              style={{
                color: "red",
                fontSize: "10px",
                marginTop: "-1rem",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              {t("filltheName")}
            </span>
          ) : null}
          {props.bToDoExists ? (
            <span
              style={{
                color: "red",
                fontSize: "10px",
                marginTop: "-1rem",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              {t("todoAlreadyExists")}
            </span>
          ) : null}

          <label className={styles.modalLabel}>
            {t("description")}
            <span className={styles.starIcon}>*</span>
          </label>
          <form>
            <textarea
              id="ToDoDescInput"
              value={descriptionInput}
              onChange={(e) => setDescriptionFunc(e)}
              className={styles.modalTextArea}
            />
          </form>
          {props.showDescError ? (
            <span
              style={{
                color: "red",
                fontSize: "10px",
                marginTop: "-0.25rem",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              {t("filltheDesc")}
            </span>
          ) : null}
          {props.calledFromWorkdesk ? (
            <div style={{ width: "75%", marginBottom: "0.5rem" }}>
              <label className={styles.modalLabel}>
                {t("groupName")}
                <span className={styles.starIcon}>*</span>
              </label>
              <div className="relative">
                <button
                  className={styles.groupDropdown}
                  onClick={() => setShowGroupDropdown(true)}
                >
                  <span style={{ fontSize: "12px" }}>
                    {grpList?.map((item) => {
                      if (selectedGroup.includes(item.id)) {
                        return item.GroupName;
                      }
                    })}
                  </span>
                  <span
                    style={{ position: "absolute", right: "0.5vw", top: "-8%" }}
                  >
                    <img
                      src={dropdown}
                      style={{ width: "0.5rem", height: "0.5rem" }}
                    />
                  </span>
                </button>
                {showGroupDropdown ? (
                  <AddToListDropdown
                    processData={props.processData}
                    completeList={grpList}
                    checkedCheckBoxStyle="exceptionGroupChecked"
                    associatedList={selectedGroup}
                    checkIcon="exceptionGroup_checkIcon"
                    onChange={onSelectGroup}
                    addNewLabel={t("newGroup")}
                    noDataLabel={t("noGroupAdded")}
                    labelKey="GroupName"
                    handleClickAway={() => setShowGroupDropdown(false)}
                    style={{ top: "100%", left: "0", width: "100%" }}
                    onKeydown={(val) => {
                      let maxId = 0;
                      grpList?.map((el) => {
                        if (+el.id > +maxId) {
                          maxId = el.id;
                        }
                      });
                      setselectedGroup([+maxId + 1]);
                      props.addGroupToList(val);
                    }} // funtion for api call
                    calledFromWorkdesk={true}
                  />
                ) : null}
              </div>
            </div>
          ) : null}
          <div style={{ marginBottom: "0.5rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={mandatoryValue}
                  onChange={(e) => handleMandatoryValue(e)}
                />
              }
              className={styles.properties_radioButton}
              label="Mandatory"
            />
          </div>
          <label className={styles.modalLabel}>{t("associatedFeild")}</label>
          <Select
            onChange={onSelect}
            className={styles.modalSelect}
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
            value={associateField}
          >
            <MenuItem value="defaultValue" className={styles.modalDropdownData}>
              {t("processView.noneWord")}
            </MenuItem>
            {associateFields.map((x) => {
              return (
                <MenuItem
                  key={x}
                  value={x}
                  className={styles.modalDropdownData}
                >
                  {x}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <div className="selectedToDoTypeDiv" style={{ flex: "1" }}>
          <label className={styles.modalLabel}>{t("type")}</label>
          <div className="radioGroupsDiv">
            <RadioGroups
              toDoToModifyTrigger={props.toDoToModifyTrigger}
              toDoTypeToModify={props.toDoTypeToModify}
              addPickList={props.addPickList}
              selectTrigger={props.selectTrigger}
              toDoType={handleToDoTypeSelection}
              selectedTrigger={handleTriggerSelection}
              triggerList={props.triggerList}
              todoName={props.todoName}
              setTodoName={props.setTodoName}
              setTodoTypeValue={setTodoTypeValue}
              pickList={props.pickList}
              setPickList={props.setPickList}
              addAnotherTodo={props.addAnotherTodo}
              setAddAnotherTodo={props.setAddAnotherTodo}
            />
          </div>
          {props.showTriggerError ? (
            <span
              style={{
                color: "red",
                fontSize: "10px",
                marginTop: "-0.25rem",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              Please select Trigger
            </span>
          ) : null}
        </div>
      </div>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.modalFooter
            : styles.modalFooter
        }
        style={{ padding: "0.5rem 0" }}
      >
        <button
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.cancelButton
              : styles.cancelButton
          }
          onClick={() => props.handleClose()}
          id="close_AddTodoModal_Button"
        >
          {t("cancel")}
        </button>

        {props.toDoNameToModify ? null : (
          <button
            id="addAnotherTodo_Button"
            onClick={(e) =>
              props.addToDoToList(
                nameInput,
                "addAnother",
                props.groupId ? props.groupId : selectedGroup[0], // code edited on 2 August 2022 for BugId 113565
                descriptionInput
              )
            }
            className={styles.okButton}
          >
            {t("addAnother")}
          </button>
        )}
        {props.toDoNameToModify ? null : (
          <button
            id="addNclose_AddTodoModal_Button"
            onClick={(e) =>
              props.addToDoToList(
                nameInput,
                "add",
                props.groupId ? props.groupId : selectedGroup[0], // code edited on 2 August 2022 for BugId 113565
                descriptionInput
              )
            }
            className={styles.okButton}
          >
            {t("add&Close")}
          </button>
        )}

        {props.toDoNameToModify ? (
          <button
            onClick={(e) => {
              /*code added on 4 August 2022 for BugId 113920 */
              props.modifyToDoFromList(
                nameInput,
                props.groupId ? props.groupId : selectedGroup[0], // code edited on 2 August 2022 for BugId 113565
                descriptionInput,
                props.toDoIdToModify,
                mandatoryValue,
                associateField,
                todoTypeValue
              );
            }}
            className={styles.okButton}
            id="addNclose_AddTodoModal_Button"
          >
            {t("modify")}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default AddToDo;
