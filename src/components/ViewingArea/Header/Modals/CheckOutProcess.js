import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CommonModalBody from "../CommonModalBody";
import axios from "axios";
import {
  ENDPOINT_CHECKOUT,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { useDispatch } from "react-redux";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";

function CheckOutModal(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [isBtnOneProcessing, setIsBtnOneProcessing] = useState(false);

  /*****************************************************************************************
   * @author asloob_ali BUG ID: 116260 - Checkout: if checkout operation fails then appropriate message should appear on screen as it confusing to the user whether the check out operation is in progress or it is actually failed
   * Reason: message was not being shown in case failure/success.
   * Resolution : added messages as notifications.
   * Date : 30/09/2022
   ****************/
  const checkoutProcess = () => {
    let json = {
      processDefId: +props.processDefId,
      projectName: props.projectName,
      type: 1,
      bNewVersion: true,
      saveAsLocal: "N",
      validateFlag: "N",
      comment: comment,
    };
    setIsBtnOneProcessing(true);
    axios
      .post(SERVER_URL + ENDPOINT_CHECKOUT, json)
      .then((response) => {
        if (response.data.Status === 0) {
          setIsBtnOneProcessing(false);

          props.setModalClosed();
          dispatch(
            setToastDataFunc({
              message: response?.data?.message || t("checkedOutSuccessMsg"),
              severity: "success",
              open: true,
            })
          );
        } else {
          dispatch(
            setToastDataFunc({
              message: response?.data?.message || t("checkedOutFailedMsg"),
              severity: "error",
              open: true,
            })
          );
          setIsBtnOneProcessing(false);
        }
      })
      .catch((err) => {
        dispatch(
          setToastDataFunc({
            message: err?.response?.data?.message || t("checkedOutFailedMsg"),
            severity: "error",
            open: true,
          })
        );
        setIsBtnOneProcessing(false);
      });
  };

  return (
    <CommonModalBody
      buttonOne={t("Checkout")}
      modalType={props.modalType}
      modalHead={t("checkOutProcess")}
      openProcessName={props.openProcessName}
      setModalClosed={props.setModalClosed}
      projectName={props.projectName}
      commentMandatory={true}
      comment={comment}
      setComment={setComment}
      buttonOneFunc={checkoutProcess}
      isBtnOneProcessing={isBtnOneProcessing}
      id="checkout_process"
    />
  );
}

export default CheckOutModal;
