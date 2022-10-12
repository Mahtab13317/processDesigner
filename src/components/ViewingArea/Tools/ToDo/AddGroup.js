import React, { useState, useEffect } from "react";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";
import styles from "../DocTypes/index.module.css";
import CloseIcon from "@material-ui/icons/Close";
import arabicStyles from "../DocTypes/arabicStyles.module.css";
import { RTL_DIRECTION } from "../../../../Constants/appConstants";

function AddGroup(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [nameInput, setNameInput] = useState("");
  const setNameFunc = (e) => {
    setNameInput(e.target.value);
  };

  useEffect(() => {
    if (props.groupName == "") {
      setNameInput(props.groupName);
      props.setGroupName(null);
    }
  }, [props.groupName]);

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
          {t("addGroup")}
        </h3>
        <CloseIcon
          onClick={() => props.handleClose()}
          className={styles.closeIcon}
        />
      </div>
      <div className={styles.modalSubHeader} style={{ paddingBottom: "2rem" }}>
        <label className={styles.modalLabel}>
          {t("groupName")}
          <span className={styles.starIcon}>*</span>
        </label>
        <form>
          <input
            id="todo_groupNameId"
            value={nameInput}
            onChange={(e) => setNameFunc(e)}
            className={styles.modalInput}
          />
        </form>
        {props.bGroupExists ? (
          <span
            style={{
              color: "red",
              fontSize: "10px",
              marginTop: "-0.25rem",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            {t("GroupAlreadyExists")}
          </span>
        ) : null}
        {props.showGroupNameError ? (
          <span
            style={{
              color: "red",
              fontSize: "10px",
              marginTop: "-0.25rem",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            {t("filltheName")}
          </span>
        ) : null}
      </div>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.modalFooter
            : styles.modalFooter
        }
      >
        <button
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.cancelButton
              : styles.cancelButton
          }
          onClick={() => props.handleClose()}
        >
          {t("cancel")}
        </button>

        <button
          id="addAnotherDocTypes_Button"
          onClick={(e) => props.addGroupToList(nameInput, "addAnother")}
          className={styles.okButton}
        >
          {t("addAnother")}
        </button>

        <button
          id="addNclose_AddDocModal_Button"
          onClick={(e) => props.addGroupToList(nameInput, "add")}
          className={styles.okButton}
        >
          {t("add&Close")}
        </button>
      </div>
    </div>
  );
}

export default AddGroup;
