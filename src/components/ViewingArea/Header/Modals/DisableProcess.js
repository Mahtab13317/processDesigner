import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CommonModalBody from "../CommonModalBody";

function DisableProcess(props) {
  let { t } = useTranslation();
  const [comment, setComment] = useState("");

  return (
    <CommonModalBody
      buttonOne={t("disable")}
      modalType={props.modalType}
      modalHead={t("disable")+" "+t("processC")}
      setModalClosed={props.setModalClosed}
      commentMandatory={true}
      comment={comment}
      setComment={setComment}
      id="disable_process"
    />
  );
}

export default DisableProcess;