import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CommonModalBody from "../CommonModalBody";
import axios from "axios";
import {
  ENDPOINT_CHECKIN,
  SERVER_URL,
} from "../../../../Constants/appConstants";

function CheckInModal(props) {
  let { t } = useTranslation();
  const [comment, setComment] = useState("");

  const checkinProcess = () => {
    let json = {
      processDefId: +props.processDefId,
      comment: comment,
    };
    axios.post(SERVER_URL + ENDPOINT_CHECKIN, json).then((response) => {
      if (response.data.Status === 0) {
        props.setModalClosed();
      }
    });
  };

  return (
    <CommonModalBody
      buttonOne={`${t("checkInAsNewProcess")} (${t("v")}${(
        +props.existingVersion + 1
      ).toFixed(1)})`}
      buttonTwo={`${t("overwrite")} (${t("v")}${props.existingVersion})`}
      modalType={props.modalType}
      modalHead={t("checkingInProcess")}
      openProcessName={props.openProcessName}
      setModalClosed={props.setModalClosed}
      commentMandatory={true}
      comment={comment}
      setComment={setComment}
      buttonOneFunc={checkinProcess}
      id="checkin_process"
    />
  );
}

export default CheckInModal;
