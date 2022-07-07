import React, { useState, useEffect } from "react";
import StarRateIcon from "@material-ui/icons/StarRate";
import Button from "@material-ui/core/Button";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";
import { Select, MenuItem } from "@material-ui/core";
import { makeStyles, Typography } from "@material-ui/core";
import dropdown from "../../../../assets/subHeader/dropdown.svg";
import AddToListDropdown from "../../../../UI/AddToListDropdown/AddToListDropdown";
import axios from "axios";
import {
  RTL_DIRECTION,
  ENDPOINT_ADD_GROUP,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { connect } from "react-redux";

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

function AddException(props) {
  let { t } = useTranslation();
  const classes = useStyles({});
  const direction = `${t("HTML_DIR")}`;
  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [expModalHead, setExpModalHead] = useState("");
  const [expData, setExpData] = useState({
    ExceptionGroups: [],
  });
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
    if (e.target.value !== "" && props.setShowNameError) {
      props.setShowNameError(false);
    }
  };

  const setDescriptionFunc = (e) => {
    setDescriptionInput(e.target.value);
    if (e.target.value !== "" && props.setShowDescError) {
      props.setShowDescError(false);
    }
  };

  useEffect(() => {
    if (props.expName == "") {
      setNameInput("");
      setDescriptionInput("");
    }
  }, [props.expName]);

  useEffect(() => {
    if (props.expNameToModify) {
      document.getElementById("ExceptionDescInput").focus();
      document.getElementById("ExceptionNameInput").disabled = true;
      setExpModalHead(`Edit: ${props.expNameToModify}`);
    } else {
      setExpModalHead(t("addException"));
    }
  }, []);

  useEffect(() => {
    if (props.expDescToModify) {
      setDescriptionInput(props.expDescToModify);
    }
    if (props.expNameToModify) {
      setNameInput(props.expNameToModify);
    }
  }, [props.expDescToModify, props.expNameToModify]);

  const onSelectGroup = (grp) => {
    setselectedGroup([grp.id]);
  };

  const addnewGroup = (GroupToAdd, button_type, newGroupToMoveExp) => {
    let maxId = 0;
    grpList &&
      grpList.map((el) => {
        if (el.id > maxId) {
          maxId = +el.id + 1;
        }
      });
    setselectedGroup([maxId]);

    let exist = false;
    expData &&
      expData.ExceptionGroups.map((group, groupIndex) => {
        if (group.GroupName.toLowerCase() == GroupToAdd.toLowerCase()) {
          // setbGroupExists(true);
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
          }
        });
    } else if (GroupToAdd.trim() == "") {
      alert("Please enter Group Name");
      document.getElementById("groupNameInput_exception").focus();
    }
    if (button_type != "addAnother") {
    }
    if (button_type == "addAnother") {
      document.getElementById("groupNameInput_exception").value = "";
      document.getElementById("groupNameInput_exception").focus();
    }
  };

  return (
    <div
      className="addDocs"
      style={{
        height: "20rem",
        width: "430px",
        margin: "5px",
        direction: direction,
      }}
    >
      <p className="addDocsHeading">{expModalHead}</p>

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
              onKeydown={addnewGroup} // funtion for api call
              labelKey="GroupName"
              handleClickAway={() => setShowGroupDropdown(false)}
              calledFromWorkdeskExp={true}
            />
          ) : null}
        </div>
      ) : null}

      <div>
        <label className="nameInputlabel">
          {t("exceptionName")}
          <StarRateIcon
            style={{ height: "15px", width: "15px", color: "red" }}
          />
        </label>
        <form>
          <input
            id="ExceptionNameInput"
            value={nameInput}
            onChange={(e) => setNameFunc(e)}
            className="nameInput"
          />
        </form>
        {props.showNameError ? (
          <span style={{ color: "red", fontSize: "10px", marginBottom: "7px" }}>
            Please fill the Name.
          </span>
        ) : null}
      </div>
      <div>
        <label className="nameInputlabel">
          {t("description")}
          <StarRateIcon
            style={{ height: "15px", width: "15px", color: "red" }}
          />
        </label>
        <form>
          <textarea
            id="ExceptionDescInput"
            value={descriptionInput}
            onChange={(e) => setDescriptionFunc(e)}
          />
        </form>
        {props.showDescError ? (
          <span style={{ color: "red", fontSize: "10px", marginBottom: "7px" }}>
            Please fill the Description.
          </span>
        ) : null}
      </div>
      <div
        className="buttons_add"
        style={{ marginTop: "1rem", textAlign: "right", marginRight: "1rem" }}
      >
        <Button
          variant="outlined"
          onClick={() => props.handleClose()}
          id="close_AddExpModal_Button"
        >
          {t("cancel")}
        </Button>
        {props.expNameToModify ? null : (
          <Button
            id="addAnotherException_Button"
            onClick={(e) =>
              props.addExceptionToList(
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
        {props.expNameToModify ? null : (
          <Button
            id="addNclose_AddExceptionModal_Button"
            variant="contained"
            onClick={(e) => {
              props.addExceptionToList(
                nameInput,
                "add",
                props.groupId,
                descriptionInput
              );
            }}
            color="primary"
          >
            {t("add&Close")}
          </Button>
        )}
        {props.expNameToModify ? (
          <Button
            variant="contained"
            onClick={(e) => {
              props.modifyDescription(
                nameInput,
                props.groupId,
                descriptionInput,
                props.expIdToModify
              );
            }}
            color="primary"
          >
            {t("save")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps, null)(AddException);
