import React, { useState, useEffect } from "react";
import "./DocTypes.css";
import styles from "./index.module.css";
import { useTranslation } from "react-i18next";
import { RTL_DIRECTION } from "../../../../Constants/appConstants";
import CloseIcon from "@material-ui/icons/Close";
import arabicStyles from "./arabicStyles.module.css";

function AddDoc(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [nameInput, setNameInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [docModalHead, setDocModalHead] = useState("");

  const setNameFunc = (e) => {
    if (e.target.value !== "" && props.setShowDocNameError) {
      props.setShowDocNameError(false);
    }
    setNameInput(e.target.value);
    // Changes made to solve bug ID 109986
    props.docData?.DocumentTypeList?.forEach((type) => {
      if (props.setbDocExists) {
        if (type.DocName.toLowerCase() == e.target.value) {
          props.setbDocExists(true);
        } else {
          props.setbDocExists(false);
        }
      }
    });
  };
  const setDescFunc = (e) => {
    setDescInput(e.target.value);
  };
  useEffect(() => {
    if (props.docNameToModify) {
      document.getElementById("DocDescInput").focus();
      document.getElementById("DocNameInput").disabled = true;
      setDocModalHead(`Edit: ${props.docNameToModify}`);
    } else {
      setDocModalHead(t("addException"));
    }
  }, []);

  useEffect(() => {
    if (props.docDescToModify) {
      setDescInput(props.docDescToModify);
    }
    if (props.docNameToModify) {
      setNameInput(props.docNameToModify);
    }
  }, [props.docDescToModify, props.docNameToModify]);

  // code added on 2 August 2022 for BugId 112251
  useEffect(() => {
    if (props.addAnotherDoc) {
      setNameInput("");
      setDescInput("");
      props.setAddAnotherDoc(false);
    }
  }, [props.addAnotherDoc]);

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
          {props.docNameToModify ? docModalHead : t("addDocuments")}
        </h3>
        <CloseIcon
          onClick={() => props.handleClose()}
          className={styles.closeIcon}
        />
      </div>
      <div className={styles.modalSubHeader}>
        <label className={styles.modalLabel}>
          {t("documentType")}
          <span className={styles.starIcon}>*</span>
        </label>
        <form>
          <input
            id="DocNameInput"
            value={nameInput}
            onChange={(e) => setNameFunc(e)}
            className={styles.modalInput}
          />
        </form>
        {props.showDocNameError ? (
          <span
            style={{
              color: "red",
              fontSize: "10px",
              marginTop: "-1.25rem",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            {t("filltheDocumentName")}
          </span>
        ) : null}
        {props.bDocExists ? (
          <span
            style={{
              color: "red",
              fontSize: "10px",
              marginTop: "-1.25rem",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            {t("docAlreadyExists")}
          </span>
        ) : null}
        <label className={styles.modalLabel}>{t("description")}</label>
        <textarea
          id="DocDescInput"
          value={descInput}
          onChange={(e) => setDescFunc(e)}
          className={styles.modalTextArea}
        />
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
        {props.docNameToModify ? null : (
          <button
            id="addAnotherDocTypes_Button"
            onClick={(e) =>
              props.addDocToList(nameInput, descInput, "addAnother")
            }
            className={styles.okButton}
          >
            {t("addAnother")}
          </button>
        )}
        {props.docNameToModify ? null : (
          <button
            id="addNclose_AddDocModal_Button"
            onClick={(e) => props.addDocToList(nameInput, descInput, "add")}
            className={styles.okButton}
          >
            {t("add&Close")}
          </button>
        )}

        {props.docNameToModify ? (
          <button
            onClick={(e) => {
              props.modifyDescription(
                nameInput,
                descInput,
                props.docIdToModify
              );
            }}
            className={styles.okButton}
          >
            {"save"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default AddDoc;
