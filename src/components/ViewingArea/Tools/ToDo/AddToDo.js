import React, { useEffect, useState } from "react";
import StarRateIcon from "@material-ui/icons/StarRate";
import Button from "@material-ui/core/Button";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Select, MenuItem } from "@material-ui/core";
import { makeStyles, Typography } from "@material-ui/core";
import RadioGroups from "./RadioButtonsGroup";
import { useGlobalState } from "state-pool";
import dropdown from "../../../../assets/subHeader/dropdown.svg";
import AddToListDropdown from "../../../../UI/AddToListDropdown/AddToListDropdown";

const useStyles = makeStyles((theme) => ({
  select: {
    width: "138px",
    height: "28px",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    font: "normal normal normal 12px/17px Open Sans",
    border: "1px solid #C4C4C4",
    borderRadius: "2px",
    opacity: "1",
    marginRight: "10px",
    marginTop: "10px",
  },
  dropdownData: {
    height: "17px",
    textAlign: "left",
    font: "normal normal normal 12px/17px Open Sans",
    letterSpacing: "0px",
    color: "#000000",
    opacity: "1",
    marginTop: "8px",
    paddingLeft: "10px !important",
    marginLeft: "0px",
  },
}));

function AddToDo(props) {
  const [loadedVariables] = useGlobalState("variableDefinition");
  const associateFields = ["CalenderName", "Status"];
  const classes = useStyles({});
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [mandatoryValue, setMandatoryValue] = useState(false);
  const [associateField, setAssociateField] = useState("defaultValue");
  const [selectedGroup, setselectedGroup] = useState([]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [grpList, setgrpList] = useState([]);

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
  };

  const onSelect = (e) => {
    props.selectedAssociateField(e.target.value);
    setAssociateField(e.target.value);
  };

  const setDescriptionFunc = (e) => {
    setDescriptionInput(e.target.value);
    if (e.target.value !== "") {
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
    <div
      className="addDocs"
      style={{ display: "flex", height: "360px", direction: direction }}
    >
      <div>
        <p className="addDocsHeading">{t("addToDo")}</p>

        <div>
          <label className="nameInputlabel">
            {t("todoName")}
            <StarRateIcon
              style={{ height: "15px", width: "15px", color: "red" }}
            />
          </label>
          <form>
            <input
              id="ToDoNameInput"
              value={nameInput}
              onChange={(e) => setNameFunc(e)}
              className="nameInput"
            />
          </form>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label className="nameInputlabel">
            {t("description")}
            <StarRateIcon
              style={{ height: "15px", width: "15px", color: "red" }}
            />
          </label>
          <form>
            <textarea
              id="ToDoDescInput"
              value={descriptionInput}
              onChange={(e) => setDescriptionFunc(e)}
              className="descriptionInput"
            />
          </form>
          {props.showDescError ? (
            <span
              style={{ color: "red", fontSize: "10px", marginBottom: "7px" }}
            >
              Please fill the Description.
            </span>
          ) : null}
        </div>
        {props.calledFromWorkdesk ? (
          <div className="row" style={{ marginTop: "7px" }}>
            <p className="nameInputlabel" style={{ marginBottom: "0" }}>
              {t("groupName")}
            </p>
            <Button
              className="SwimlaneButton"
              onClick={() => setShowGroupDropdown(true)}
              style={{
                marginLeft: "20px",
                fontSize: "12px !important",
                border: "1px solid #e6e6e6",
                width: "6rem",
              }}
            >
              <span style={{ fontSize: "12px" }}>
                {grpList &&
                  grpList.map((item) => {
                    if (selectedGroup.includes(item.id)) {
                      return item.GroupName;
                    }
                  })}
              </span>
              <span style={{ height: "15px", marginLeft: "auto" }}>
                <img
                  src={dropdown}
                  width="5px"
                  height="15px"
                  style={{
                    marginBottom: "2px",
                  }}
                />
              </span>
            </Button>
            {showGroupDropdown ? (
              <AddToListDropdown
                processData={props.processData}
                completeList={grpList}
                checkboxStyle="swimlaneCheckbox"
                checkedCheckBoxStyle="swimlaneChecked"
                associatedList={selectedGroup}
                checkIcon="swimlaneCheckIcon"
                onChange={onSelectGroup}
                addNewLabel={t("newGroup")}
                noDataLabel={t("noGroupAdded")}
                onKeydown={(val) => {
                  let maxId = 0;
                  grpList &&
                    grpList.map((el) => {
                      if (el.id > maxId) {
                        maxId = +el.id + 1;
                      }
                    });
                  setselectedGroup([maxId]);
                  props.addGroupToList(val);
                }} // funtion for api call
                labelKey="GroupName"
                handleClickAway={() => setShowGroupDropdown(false)}
                calledFromWorkdesk={true}
              />
            ) : null}
          </div>
        ) : null}

        <div className="associateFieldDiv">
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={mandatoryValue}
                onChange={(e) => handleMandatoryValue(e)}
              />
            }
            label="Mandatory"
          />
          <p style={{ fontSize: "12px" }}>{t("associatedFeild")}</p>
          <Select
            onChange={onSelect}
            className={classes.select}
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
            <MenuItem className={classes.dropdownData} value="defaultValue">
              {props.toDoAssoFieldToModify
                ? props.toDoAssoFieldToModify
                : `<${t("processView.noneWord")}>`}
            </MenuItem>
            {associateFields.map((x) => {
              return (
                <MenuItem className={classes.dropdownData} key={x} value={x}>
                  {x}
                </MenuItem>
              );
            })}
          </Select>
          <div className="buttons_add buttonsAddToDo">
            <Button
              variant="outlined"
              onClick={() => props.handleClose()}
              id="close_AddTodoModal_Button"
            >
              {t("cancel")}
            </Button>
            {props.toDoNameToModify ? null : (
              <Button
                id="addAnotherTodo_Button"
                onClick={(e) =>
                  props.addToDoToList(
                    nameInput,
                    "addAnother",
                    props.groupId,
                    descriptionInput
                  )
                }
                variant="contained"
                color="primary"
              >
                {t("addAnother")}
              </Button>
            )}

            {props.toDoNameToModify ? null : (
              <Button
                id="addNclose_AddTodoModal_Button"
                variant="contained"
                onClick={(e) =>
                  props.addToDoToList(
                    nameInput,
                    "add",
                    props.groupId,
                    descriptionInput
                  )
                }
                color="primary"
              >
                {t("add&Close")}
              </Button>
            )}

            {props.toDoNameToModify ? (
              <Button
                id="addNclose_AddTodoModal_Button"
                variant="contained"
                onClick={(e) =>
                  props.addToDoToList(
                    nameInput,
                    "add",
                    props.groupId,
                    descriptionInput
                  )
                }
                color="primary"
              >
                {t("save")}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <div className="selectedToDoTypeModal">
        <div className="selectedToDoTypeDiv">
          <h5>{t("type")}</h5>
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
            />
          </div>
          {props.showTriggerError ? (
            <span style={{ fontSize: "10px", color: "red" }}>
              Please select Trigger
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AddToDo;
