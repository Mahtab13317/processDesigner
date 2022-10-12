// #BugID - 110759
// #BugDescription - payload changed for save the process

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ENDPOINT_SAVE_MAJOR,
  ENDPOINT_SAVE_MINOR,
  VERSION_TYPE_MAJOR,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import CommonModalBody from "../CommonModalBody";
import { store, useGlobalState } from "state-pool";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";

function SaveAsNewVersion(props) {
  let { t } = useTranslation();
  const poolProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(poolProcessData);
  const [selectedType, setSelectedType] = useState(VERSION_TYPE_MAJOR);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  /*code updated on 30 September 2022 for BugId 116337*/
  const saveFunction = () => {
    if (selectedType === VERSION_TYPE_MAJOR) {
      let json = {
        processDefId: props.processDefId.toString(),
        version: props.existingVersion.toString(),
        processName: localLoadedProcessData.ProcessName,
      };
      axios.post(SERVER_URL + ENDPOINT_SAVE_MAJOR, json).then((response) => {
        if (response.data.Status === 0) {
          // Changing versions in OpenProcessCall to solve #Bug 116336
          let temp = JSON.parse(JSON.stringify(localLoadedProcessData));
          temp?.Versions?.push({
            LastModifiedBy: "shivani",
            CreatedBy: "shivani",
            ProcessDefId: response.data.ProcessDefId,
            LastModifiedOn: "09 Oct 2022",
            VersionNo: response.data.VersionNo,
            CreatedOn: "09 Oct 2022",
          });
          dispatch(
            setToastDataFunc({
              message: response.data.Message,
              severity: "success",
              open: true,
            })
          );
          setlocalLoadedProcessData(temp);
          props.setModalClosed();
        } else {
          dispatch(
            setToastDataFunc({
              message: response.data.Message,
              severity: "error",
              open: true,
            })
          );
        }
      });
    } else {
      let json = {
        processDefId: props.processDefId.toString(),
        version: props.existingVersion.toString(),
        processName: localLoadedProcessData.ProcessName,
      };
      axios.post(SERVER_URL + ENDPOINT_SAVE_MINOR, json).then((response) => {
        if (response.data.Status === 0) {
          dispatch(
            setToastDataFunc({
              message: response.data.Message,
              severity: "success",
              open: true,
            })
          );
          props.setModalClosed();
        } else {
          dispatch(
            setToastDataFunc({
              message: response.data.Message,
              severity: "error",
              open: true,
            })
          );
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
