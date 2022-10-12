// #BugID - 110097
// #BugDescription - validation for exception name length has been added.
// #BugID - 109977
// #BugDescription - validation for exception duplicate name has been added.
// #BugID - 110089
// #BugDescription - 	Data not clearing to add new Exception after clicking on Add another button has been fixed
// Changes made to solve Bug 115524 - Exception: blank screen with not found message appears while pressing enter button in the exception field
import React, { useState, useEffect } from "react";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";
import dropdown from "../../../../assets/subHeader/dropdown.svg";
import AddToListDropdown from "../../../../UI/AddToListDropdown/AddToListDropdown";
import axios from "axios";
import {
  RTL_DIRECTION,
  ENDPOINT_ADD_GROUP,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { connect, useDispatch } from "react-redux";
import "./Exception.css";
import styles from "../DocTypes/index.module.css";
import CloseIcon from "@material-ui/icons/Close";
import arabicStyles from "../DocTypes/arabicStyles.module.css";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import { useRef } from "react";
import { FieldValidations } from "../../../../utility/FieldValidations/fieldValidations";

function AddException(props) {
  const dispatch = useDispatch();
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [expModalHead, setExpModalHead] = useState("");
  const [selectedGroup, setselectedGroup] = useState([]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [grpList, setgrpList] = useState([]);
  const expNameRef = useRef();

  useEffect(() => {
    let tempGrpList = props.groups?.map((val) => {
      return { ...val, id: val.GroupId };
    });
    setgrpList(tempGrpList);
  }, [props.groups]);

  const setNameFunc = (e) => {
    setNameInput(e.target.value);
    if (e.target.value !== "") {
      setNameInput(e.target.value);
      if (props.setShowNameError) {
        props.setShowNameError(false);
      }
      // Changes made to solve bug ID 109977
      props.expData?.ExceptionGroups?.map((group) => {
        group.ExceptionList.map((exception) => {
          if (exception.ExceptionName.toLowerCase() === e.target.value.trim()) {
            props.setbExpExists(true);
          } else {
            props.setbExpExists(false);
          }
        });
      });
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
      setExpModalHead(`${t("ExceptionDetails")}`);
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

  useEffect(() => {
    if (props.addAnotherExp) {
      setNameInput("");
      setDescriptionInput("");
      setselectedGroup([]);
      props.setAddAnotherExp(false);
    }
  }, [props.addAnotherExp]);

  const onSelectGroup = (grp) => {
    setselectedGroup([grp.id]);
  };

  const handleCloseFunc = () => {
    props.handleClose();
    if (props.setShowNameError) {
      props.setShowNameError(false);
    }
    if (props.setShowDescError) {
      props.setShowDescError(false);
    }
    if (props.setbExpExists) {
      props.setbExpExists(false);
    }
  };

  // code edited on 7 Sep 2022 for BugId 114224
  const addnewGroup = (GroupToAdd) => {
    let exist = false;
    grpList?.map((group) => {
      if (group.GroupName.toLowerCase() === GroupToAdd.toLowerCase()) {
        exist = true;
      }
    });
    if (exist) {
      return;
    }
    if (GroupToAdd?.trim() !== "") {
      let maxGroupId = grpList.reduce(
        (acc, group) => (+acc > +group.GroupId ? acc : group.GroupId),
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
            let tempData = [...grpList];
            tempData.push({
              GroupName: GroupToAdd,
              AllGroupRights: {
                Respond: true,
                View: true,
                Raise: false,
                Clear: false,
              },
              GroupId: +maxGroupId + 1,
              ExceptionList: [],
              id: +maxGroupId + 1,
            });
            setgrpList(tempData);
            setselectedGroup([+maxGroupId + 1]);
            setShowGroupDropdown(false);
          }
        });
    } else if (GroupToAdd?.trim() === "") {
      alert("Please enter Group Name");
      document.getElementById("groupNameInput_exception").focus();
    }
  };

  return (
    <div className="addDocs">
      <div className={styles.modalHeader}>
        <h3
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.modalHeading
              : styles.modalHeading
          }
        >
          {expModalHead}
        </h3>
        <CloseIcon
          onClick={() => handleCloseFunc()}
          className={styles.closeIcon}
        />
      </div>
      <div className={styles.modalSubHeader}>
        {props.calledFromWorkdesk ? (
          <div
            className="flex"
            style={{
              width: "75%",
              justifyContent: "space-between",
              marginBottom: "1rem",
              alignItems: "center",
            }}
          >
            <label className={styles.modalLabel} style={{ flex: "1" }}>
              {t("groupName")}
              <span className={styles.starIcon}>*</span>
            </label>
            <div className="relative" style={{ flex: "2" }}>
              <button
                className={styles.groupDropdown}
                onClick={() => setShowGroupDropdown(true)}
              >
                <span style={{ fontSize: "var(--base_text_font_size)" }}>
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
                  onKeydown={addnewGroup} // funtion for api call
                  labelKey="GroupName"
                  handleClickAway={() => setShowGroupDropdown(false)}
                  calledFromWorkdeskExp={true}
                  style={{ top: "100%", left: "0", width: "100%" }}
                />
              ) : null}
            </div>
          </div>
        ) : null}
        <label className={styles.modalLabel}>
          {t("exceptionName")}
          <span className={styles.starIcon}>*</span>
        </label>
        <form>
          {/*code added on 8 August 2022 for BugId 112903*/}
          <input
            id="ExceptionNameInput"
            value={nameInput}
            onChange={(e) => setNameFunc(e)}
            className={styles.modalInput}
            ref={expNameRef}
            onKeyPress={(e) => {
              if (e.charCode == "13") {
                e.preventDefault();
              } else {
                FieldValidations(e, 150, expNameRef.current, 50);
              }
            }}
          />
        </form>
        {props.showNameError ? (
          <span
            style={{
              color: "red",
              fontSize: "var(--sub_text_font_size)",
              marginTop: "-1rem",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            {t("filltheName")}
          </span>
        ) : null}
        {props.bExpExists ? (
          <span
            style={{
              color: "red",
              fontSize: "var(--sub_text_font_size)",
              marginTop: "-1rem",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            {t("excepAlreadyExists")}
          </span>
        ) : null}
        <label className={styles.modalLabel}>
          {t("description")}
          <span className={styles.starIcon}>*</span>
        </label>
        <textarea
          id="ExceptionDescInput"
          value={descriptionInput}
          onChange={(e) => setDescriptionFunc(e)}
          className={styles.modalTextArea}
        />
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
          onClick={() => handleCloseFunc()}
        >
          {t("cancel")}
        </button>
        {props.expNameToModify ? null : (
          <button
            id="addAnotherDocTypes_Button"
            onClick={(e) => {
              props.addExceptionToList(
                nameInput,
                "addAnother",
                props.groupId ? props.groupId : selectedGroup[0],
                descriptionInput
              );
            }}
            className={styles.okButton}
          >
            {t("addAnother")}
          </button>
        )}
        {props.expNameToModify ? null : (
          <button
            id="addNclose_AddDocModal_Button"
            onClick={(e) => {
              props.addExceptionToList(
                nameInput,
                "add",
                props.groupId ? props.groupId : selectedGroup[0],
                descriptionInput
              );
            }}
            className={styles.okButton}
          >
            {t("add&Close")}
          </button>
        )}
        {props.expNameToModify ? (
          <button
            onClick={(e) => {
              props.modifyDescription(
                nameInput,
                props.groupId ? props.groupId : selectedGroup[0],
                descriptionInput,
                props.expIdToModify
              );
            }}
            className={styles.okButton}
          >
            {t("modify")}
          </button>
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
