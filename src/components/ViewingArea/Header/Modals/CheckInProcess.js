import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CommonModalBody from "../CommonModalBody";
import axios from "axios";
import {
  ENDPOINT_CHECKIN,
  ENDPOINT_VALIDATEPROCESS,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { store, useGlobalState } from "state-pool";
import { useDispatch } from "react-redux";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";

function CheckInModal(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

  const [isBtnOneProcessing, setIsBtnOneProcessing] = useState(false);
  const [isBtnTwoProcessing, setIsBtnTwoProcessing] = useState(false);
  const [isActionsDisabled, setIsActionsDisabled] = useState(false);

  const [errorVariables, setErrorVariables] = useState([]);
  const [warningVariables, setWarningVariables] = useState([]);

  useEffect(() => {
    const obj = {
      processDefId: localLoadedProcessData.ProcessDefId,
      action: localLoadedProcessData.CheckedOut === "Y" ? "CI" : "RE",
      processVariantType: "S",
    };

    axios.post(SERVER_URL + ENDPOINT_VALIDATEPROCESS, obj).then((res) => {
      let tempErrors = [];
      let tempWarnings = [];
      res &&
        res.data &&
        res?.data?.Error?.map((e) => {
          if (e.ErrorLevel == "E") {
            tempErrors.push(e);
          } else if (e.ErrorLevel == "W") {
            tempWarnings.push(e);
          }
        });
      setWarningVariables(tempWarnings);
      setErrorVariables(tempErrors);
      if (tempErrors.length > 0) {
        setIsActionsDisabled(true);
      }
    });
  }, []);

  /*****************************************************************************************
   * @author asloob_ali BUG ID: 116262 - Checkin: if Checkin operation fails then appropriate message should appear on screen as it is confusing to the user whether the Checkin operation is in progress or it is actually failed
   * Reason:validation call was not being made and message was not being shown in case failure/success.
   * Resolution : added validation call and messages as notifications.
   * Date : 30/09/2022
   ****************/
  const checkinProcess = (bNewVersion) => {
    if (bNewVersion) {
      setIsBtnOneProcessing(true);
    } else {
      setIsBtnTwoProcessing(true);
    }
    let json = {
      processDefId: props.processDefId,
      bNewVersion: bNewVersion,
      comment: comment,
      type: 1,
      processVariantType: localLoadedProcessData.ProcessVariantType,
      action: "CI",
    };
    axios
      .post(SERVER_URL + ENDPOINT_CHECKIN, json)
      .then((response) => {
        if (response.data.Status === 0) {
          setIsBtnOneProcessing(false);
          setIsBtnTwoProcessing(false);
          props.setModalClosed();
          dispatch(
            setToastDataFunc({
              message: response?.data?.message || t("checkedInSuccessMsg"),
              severity: "success",
              open: true,
            })
          );
        } else {
          setIsBtnOneProcessing(false);
          setIsBtnTwoProcessing(false);
          dispatch(
            setToastDataFunc({
              message: response?.data?.message || t("checkedInFailedMsg"),
              severity: "error",
              open: true,
            })
          );
        }
      })
      .catch((err) => {
        dispatch(
          setToastDataFunc({
            message: err?.response?.data?.message || t("checkedInFailedMsg"),
            severity: "error",
            open: true,
          })
        );

        setIsBtnOneProcessing(false);
        setIsBtnTwoProcessing(false);
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
      buttonOneFunc={() => checkinProcess(true)}
      buttonTwoFunc={() => checkinProcess(false)}
      isBtnOneProcessing={isBtnOneProcessing}
      isBtnTwoProcessing={isBtnTwoProcessing}
      isActionsDisabled={isActionsDisabled}
      toggleDrawer={props.toggleDrawer}
      id="checkin_process"
    />
  );
}

export default CheckInModal;
