import React, { useEffect, useState } from "react";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";
import "./Exception.css";
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

  useEffect(() => {
    let groupExists = false;
    props.groupsList &&
      props.groupsList.map((group) => {
        if (group.GroupName == nameInput) {
          groupExists = true;
        }
      });
    if (props.bGroupExists) {
      props.setbGroupExists(groupExists);
    }
  }, [props.groupName, props.groupsList, nameInput]);

  return (
    <div className="addDocs">
      {/*code edited on 1 Aug 2022 for BugId 112553 */}
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
        <label
          //className={styles.modalLabel}

          className="fieldlabel"
        >
          {t("groupName")}
          <span className={styles.starIcon}>*</span>
        </label>
        <form>
          <input
            id="groupNameInput_exception"
            value={nameInput}
            onChange={(e) => setNameFunc(e)}
            className={styles.modalInput}
          />
        </form>
        {props.bGroupExists ? (
          <span
            style={{
              color: "red",
              fontSize: "var(--sub_text_font_size)",
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
              fontSize: "var(--sub_text_font_size)",
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
          /*  className={
            direction === RTL_DIRECTION
              ? arabicStyles.cancelButton
              : styles.cancelButton
          }*/
          onClick={() => props.handleClose()}
          className="tertiary"
          type="button"
        >
          {t("cancel")}
        </button>

        <button
          id="addAnotherDocTypes_Button"
          onClick={(e) =>
            props.addGroupToList(nameInput, "addAnother", props.newGroupToMove)
          }
          className={styles.okButton}
          // className="primary"
          type="button"
        >
          {t("addAnother")}
        </button>

        <button
          id="addNclose_AddDocModal_Button"
          onClick={() =>
            props.addGroupToList(nameInput, "add", props.newGroupToMove)
          }
          className={styles.okButton}
          // className="primary"
          type="button"
        >
          {t("add&Close")}
        </button>
      </div>
    </div>
  );
}

export default AddGroup;
