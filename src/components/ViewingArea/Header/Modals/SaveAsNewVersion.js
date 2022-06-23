import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ENDPOINT_SAVE_MAJOR,
  ENDPOINT_SAVE_MINOR,
  VERSION_TYPE_MAJOR,
  SERVER_URL
} from "../../../../Constants/appConstants";
import CommonModalBody from "../CommonModalBody";
import axios from "axios";

function SaveAsNewVersion(props) {
  let { t } = useTranslation();
  const [selectedType, setSelectedType] = useState(VERSION_TYPE_MAJOR);
  const [comment, setComment] = useState("");

  const saveFunction = () => {
    if (selectedType === VERSION_TYPE_MAJOR) {
      let json = {
        processDefId: +props.processDefId,
        version: props.existingVersion,
      };
      axios.post(SERVER_URL + ENDPOINT_SAVE_MAJOR, json).then((response) => {
        if (response.data.Status === 0) {
          props.setModalClosed();
        }
      });
    } else {
      let json = {
        processDefId: +props.processDefId,
        version: props.existingVersion,
      };
      axios.post(SERVER_URL + ENDPOINT_SAVE_MINOR, json).then((response) => {
        if (response.data.Status === 0) {
          props.setModalClosed();
        }
      });
    }
  };

  return (
    <CommonModalBody
      buttonOne={t("save")}
      modalType={props.modalType}
      modalHead={t("saveAsNewVersion")}
      setModalClosed={props.setModalClosed}
      commentMandatory={false}
      existingVersion={props.existingVersion}
      selectedType={selectedType}
      setSelectedType={setSelectedType}
      comment={comment}
      setComment={setComment}
      buttonOneFunc={saveFunction}
      id="saveAsNewVersion"
    />
  );
}

export default SaveAsNewVersion;
