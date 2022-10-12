import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import "./Properties.css";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";

function CheckInActivityValidation(props) {
  let { t } = useTranslation();
  return (
    <div>
      <div className="prop_modalHeader">
        <p className="prop_modalHeading">{t("Confirm")}</p>
        <CloseIcon
          fontSize="small"
          style={{ cursor: "pointer" }}
          onClick={props.discardChangesFunc}
        />
      </div>
      <hr></hr>
      <div className="prop_modalContent" style={{ display: "block" }}>
        {t("Activity")}{" "}
        <span style={{ fontWeight: "600" }}>{props.actName} </span>
        {t("checkInChangesStatement")}
      </div>
      <div className="prop_modalFooter">
        <Button
          id="close_AddVariableModal_CallActivity"
          className="properties_cancelButton"
          onClick={props.discardChangesFunc}
        >
          {t("no")}
        </Button>
        <Button
          id="add_AddVariableModal_CallActivity"
          className="properties_saveButton"
          onClick={props.saveChangesFunc}
        >
          {t("Yes")}
        </Button>
      </div>
    </div>
  );
}

export default CheckInActivityValidation;
