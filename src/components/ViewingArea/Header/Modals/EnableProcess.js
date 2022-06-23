import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CommonModalBody from "../CommonModalBody";

function EnableProcess(props) {
  let { t } = useTranslation();
  const [comment, setComment] = useState("");

  return (
    <CommonModalBody
      buttonOne={t("enable")}
      modalType={props.modalType}
      modalHead={t("enable")+" "+t("processC")}
      openProcessName={props.openProcessName}
      setModalClosed={props.setModalClosed}
      commentMandatory={true}
      comment={comment}
      setComment={setComment}
      id="enable_process"
    />
  );
}

export default EnableProcess;