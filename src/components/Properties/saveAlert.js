import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import "./Properties.css";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";

function SaveAlert(props) {
  let { t } = useTranslation();
  return (
    <div>
      <div className="prop_modalHeader">
        <p className="prop_modalHeading">{t("unsavedChangesHeading")}</p>
        <CloseIcon
          fontSize="small"
          style={{ cursor: "pointer" }}
          onClick={() => props.setShowConfirmationAlert(false)}
        />
      </div>
      <hr></hr>
      <div className="prop_modalContent">{t("unsavedChangesStatement")}</div>
      <div className="prop_modalFooter">
        <Button
          id="close_AddVariableModal_CallActivity"
          className="properties_cancelButton"
          onClick={props.discardChangesFunc}
        >
          {t("discard")}
        </Button>
        <Button
          id="add_AddVariableModal_CallActivity"
          className="properties_saveButton"
          onClick={props.saveChangesFunc}
        >
          {t("saveChanges")}
        </Button>
      </div>
    </div>
  );
}

export default SaveAlert;
