import React, { useState } from "react";
import CommonModalBody from "../CommonModalBody";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  ENDPOINT_UNDO_CHECKOUT,
  SERVER_URL,
} from "../../../../Constants/appConstants";

function UndoCheckoutModal(props) {
  let { t } = useTranslation();
  const [comment, setComment] = useState("");

  const undoCheckoutProcess = () => {
    let json = {
      processDefId: +props.processDefId,
      comment: comment,
      projectName: props.projectName,
    };
    axios.post(SERVER_URL + ENDPOINT_UNDO_CHECKOUT, json).then((response) => {
      if (response.data.Status === 0) {
        props.setModalClosed();
      }
    });
  };

  return (
    <CommonModalBody
      buttonOne={t("undoCheckout")}
      modalType={props.modalType}
      modalHead={t("undoCheckOutProcess")}
      openProcessName={props.openProcessName}
      setModalClosed={props.setModalClosed}
      commentMandatory={true}
      comment={comment}
      setComment={setComment}
      buttonOneFunc={undoCheckoutProcess}
      id="undo_checkout"
    />
  );
}

export default UndoCheckoutModal;
