import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DISABLED_STATE,
  ENDPOINT_DISABLE,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import CommonModalBody from "../CommonModalBody";

function DisableProcess(props) {
  let { t } = useTranslation();
  const [comment, setComment] = useState("");

  //code added on 26 July 2022 for BugId 110024
  const disableProcess = () => {
    let json = {
      processDefId: +props.processDefId,
      comment: comment,
    };
    axios.post(SERVER_URL + ENDPOINT_DISABLE, json).then((response) => {
      if (response.status === 200) {
        props.setModalClosed();
        props.setProcessData((prev) => {
          let temp = { ...prev };
          temp.ProcessState = DISABLED_STATE;
          return temp;
        });
      }
    });
  };

  return (
    <CommonModalBody
      buttonOne={t("disable")}
      modalType={props.modalType}
      modalHead={t("disable") + " " + t("processC")}
      setModalClosed={props.setModalClosed}
      commentMandatory={true}
      comment={comment}
      setComment={setComment}
      //code added on 26 July 2022 for BugId 110024
      buttonOneFunc={disableProcess}
      id="disable_process"
    />
  );
}

export default DisableProcess;
