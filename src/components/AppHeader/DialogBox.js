import React from 'react'
import { useTranslation } from "react-i18next";
import { CloseIcon } from '../../utility/AllImages/AllImages';
import "./AppHeader.css";

function DialogBox(props) {
    let { t } = useTranslation();
    
  return (
    <>
       <div className="modalHeader">
        <h3 className="modalHeading">{t("logout")}</h3>
        <CloseIcon onClick={props.closeAlert}  />
      </div>
      <div>
        <p className="alreadyLoggedMsg_lpweb">{t("logoutAlertMsg")}<br /> {t("confirmMsg")}</p>
        
      </div>
      <div className="modalFooter">
        <button className="cancelButton" onClick={props.closeAlert}>
          {t("Cancel")}
        </button>
        <button className="okButton" onClick={props.logoutHandler}>
        {t("logout")}
        </button>
      </div>
    </>
  )
}

export default DialogBox