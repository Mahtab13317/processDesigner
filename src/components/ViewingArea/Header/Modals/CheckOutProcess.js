import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CommonModalBody from "../CommonModalBody";
import axios from "axios";
import {
  ENDPOINT_CHECKOUT,
  SERVER_URL,
} from "../../../../Constants/appConstants";

function CheckOutModal(props) {
  let { t } = useTranslation();
  const [comment, setComment] = useState("");

  const checkoutProcess = () => {
    // let json = {
    //   m_strProcessDefId: +props.processDefId,
    //   m_strComment: comment,
    //   m_strProjectName: props.projectName,
    //   m_strValidateFlag: "N",
    // };
    let json = 
      {
        processDefId: +props.processDefId,
        projectName: props.projectName,
        type:1,
        bNewVersion:true,
        saveAsLocal:"N",
        validateFlag:"N",
        comment:comment
    }

    axios.post(SERVER_URL + ENDPOINT_CHECKOUT, json).then((response) => {
      if (response.data.Status === 0) {
        props.setModalClosed();
      }
    });
  };

  return (
    <CommonModalBody
      buttonOne={t("Checkout")}
      modalType={props.modalType}
      modalHead={t("checkOutProcess")}
      openProcessName={props.openProcessName}
      setModalClosed={props.setModalClosed}
      projectName={props.projectName}
      commentMandatory={true}
      comment={comment}
      setComment={setComment}
      buttonOneFunc={checkoutProcess}
      id="checkout_process"
    />
  );
}

export default CheckOutModal;
