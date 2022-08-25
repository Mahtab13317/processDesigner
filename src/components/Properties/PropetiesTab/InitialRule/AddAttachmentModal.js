// Changes made to solve bugID - 110890 (Validation message should be aligned properly)

import React, { useRef, useState } from "react";
import { TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import styles from "./AddAttachmentModal.module.css";
import { useTranslation } from "react-i18next";

const makeInputFields = value => {
  return { value, error: false, helperText: "" };
};

function AddAttachmentModal(props) {
  let { t } = useTranslation();
  const fileRef = useRef();
  let { handleClose, handleAddAttachment } = props;
  const [selectedDocumentName, setSelectedDocumentName] = useState(
    makeInputFields("")
  );
  const [selectedFile, setSelectedFile] = useState(makeInputFields(null));
  const [description, setDescription] = useState(makeInputFields(""));
  const allowedExtension = /(\.doc|\.docx|\.jpeg|\.pdf|\.xls|\.png|\.zip)$/i;

  const handleChangeValues = e => {
    const { name, value } = e.target;
    let error = "";
    switch (name) {
      case "DocumentName":
        if (!value) {
          error = `${t("attachmentEmptyError")}`;
        }
        setSelectedDocumentName({
          ...selectedDocumentName,
          value,
          error: error ? true : false,
          helperText: error
        });
        break;

      case "Description":
        setDescription({
          ...description,
          value,
          error: error ? true : false,
          helperText: error
        });
        break;
      case "FileName":
        if (!value) {
          error = `${t("attachmentEmptyError")}`;
        }
        setSelectedFile({
          ...selectedFile,
          value,
          error: error ? true : false,
          helperText: error
        });
        break;
    }
  };

  const handleChange = e => {
    const file = e.target.files[0];
    setSelectedFile({ ...selectedFile, value: file });
  };

  const validateFields = () => {
    let selFileErr = "";
    let docNameErr = "";
    let descErr = "";
    if (selectedFile.value == null) {
      selFileErr = `${t("fileError")}`;
    } else if (!allowedExtension.exec(selectedFile.value.name)) {
      selFileErr = `${t("invalidType")}`;
    }
    setSelectedFile({
      ...selectedFile,
      error: selFileErr ? true : false,
      helperText: selFileErr
    });

    if (!selectedDocumentName.value) {
      docNameErr = `${t("attachmentEmptyError")}`;
    }
    setSelectedDocumentName({
      ...selectedDocumentName,
      error: docNameErr ? true : false,
      helperText: docNameErr
    });

    return selFileErr || docNameErr ? false : true;
  };

  const addAttachmentFunc = () => {
    let isValid = validateFields();

    if (isValid) {
      handleAddAttachment(selectedFile, selectedDocumentName, description);
    }
  };

  return (
    <div>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalHeading}>{t("addAttachment")}</h3>
        <CloseIcon onClick={handleClose} className={styles.closeIcon} />
      </div>
      <div className={styles.modalBody}>
        <div className={styles.invocationDiv} style={{
          marginTop: '-3px',
        }}>
          <span className={styles.modalLabel}>
            {t("fileName")}
            <span className={styles.starIcon}>*</span>
          </span>
          <div className={styles.file}>
            <TextField
              name="FileName"
              className={styles.modalInput}
              onChange={handleChangeValues}
              value={selectedFile.value?.name}
              error={selectedFile.error}
              helperText={selectedFile.helperText}
            />
            <button
              className={styles.okButton}
              onClick={() => fileRef.current.click()}
            >
              {t("chooseFile")}
            </button>
            <input
              name="inputFile"
              id="inputFile"
              ref={fileRef}
              onChange={handleChange}
              type="file"
              hidden
            />
          </div>
        </div>
        <div className={styles.invocationDiv} style={{
          marginTop: '-3px',
        }}>
          <span className={styles.modalLabel}>
            {t("documentName")}
            <span className={styles.starIcon}>*</span>
          </span>
          <div className={styles.file}>
            <TextField
              className={styles.modalInput1}
              name="DocumentName"
              onChange={handleChangeValues}
              value={selectedDocumentName.value}
              error={selectedDocumentName.error}
              helperText={selectedDocumentName.helperText}
            />
          </div>
        </div>
        <div className={styles.invocationDiv} style={{
          marginTop: '-3px',
        }}>
          <span className={styles.modalLabel}>
            {t("Discription")}
            {/* <span className={styles.starIcon}>*</span> */}
          </span>
          <div className={styles.file}>
            <TextField
              className={styles.modalInput1}
              name="Description"
              onChange={handleChangeValues}
              value={description.value}
            />
          </div>
        </div>
        <div className={styles.invocationDiv}>
          <span className={styles.modalLabel}>{t("note")}</span>
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={handleClose}>
          {t("cancel")}
        </button>
        <button className={styles.okButton} onClick={addAttachmentFunc}>
          {t("add")}
        </button>
      </div>
    </div>
  );
}
export default AddAttachmentModal;
