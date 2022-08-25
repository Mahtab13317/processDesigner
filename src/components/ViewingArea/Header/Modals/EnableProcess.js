import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ENABLED_STATE,
  ENDPOINT_ENABLE,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import CommonModalBody from "../CommonModalBody";

function EnableProcess(props) {
  let { t } = useTranslation();
  const [comment, setComment] = useState("");

  //code added on 26 July 2022 for BugId 110024
  const enableProcess = () => {
    let json = {
      processDefId: +props.processDefId,
      comment: comment,
    };
    axios.post(SERVER_URL + ENDPOINT_ENABLE, json).then((response) => {
      if (response.status === 200) {
        props.setModalClosed();
        props.setProcessData((prev) => {
          let temp = { ...prev };
          temp.ProcessState = ENABLED_STATE;
          return temp;
        });
      }
    });
  };

  return (
    <CommonModalBody
      buttonOne={t("enable")}
      modalType={props.modalType}
      modalHead={t("enable") + " " + t("processC")}
      openProcessName={props.openProcessName}
      setModalClosed={props.setModalClosed}
      commentMandatory={true}
      comment={comment}
      setComment={setComment}
      //code added on 26 July 2022 for BugId 110024
      buttonOneFunc={enableProcess}
      id="enable_process"
    />
  );
}

export default EnableProcess;
