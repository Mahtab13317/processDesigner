import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CommonModalBody from "../CommonModalBody";
import axios from "axios";
import {
  ENDPOINT_CHECKIN,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { store, useGlobalState } from "state-pool";

function CheckInModal(props) {
  let { t } = useTranslation();
  const [comment, setComment] = useState("");
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

  const checkinProcess = (bNewVersion) => {
    let json = {
      processDefId: props.processDefId,
      bNewVersion: bNewVersion,
      comment: comment,
      type: 1,
      processVariantType: localLoadedProcessData.ProcessVariantType,
      action: "CI",
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
      buttonOneFunc={()=>checkinProcess(true)}
      buttonTwoFunc={()=>checkinProcess(false)}
      id="checkin_process"
    />
  );
}

export default CheckInModal;
