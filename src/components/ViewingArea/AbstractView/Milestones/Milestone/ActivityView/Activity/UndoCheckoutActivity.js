import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CommonModalBody from "../../../../../Header/CommonModalBody";
import {
  ENDPOINT_UNDO_CHECKOUT_ACT,
  SERVER_URL,
} from "../../../../../../../Constants/appConstants";
import { connect, useDispatch } from "react-redux";
import { setToastDataFunc } from "../../../../../../../redux-store/slices/ToastDataHandlerSlice";

function UndoCheckoutActivity(props) {
  let { t } = useTranslation();
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const undoCheckoutActivity = () => {
    let json = {
      processDefId: props.openProcessID,
      type: 3,
      comment: comment,
      activityId: props.actId,
      swilaneId: props.laneId,
      activityName: props.actName,
    };

    axios
      .post(SERVER_URL + ENDPOINT_UNDO_CHECKOUT_ACT, json)
      .then((response) => {
        if (response.data.Status === 0) {
          props.setprocessData((prev) => {
            let newProcessData = JSON.parse(JSON.stringify(prev));
            newProcessData.MileStones?.forEach((mile, idx) => {
              mile.Activities?.forEach((act, index) => {
                if (+act.ActivityId === +props.actId) {
                  newProcessData.MileStones[idx].Activities[index].CheckedOut =
                    "N";
                }
              });
            });
            return newProcessData;
          });
          dispatch(
            setToastDataFunc({
              message: `${t("Activity")} ${props.actName} ${t(
                "hasBeenReverted"
              )}`,
              severity: "success",
              open: true,
            })
          );
          props.setModalClosed();
        }
      });
  };

  return (
    <CommonModalBody
      buttonOne={t("ok")}
      modalType={props.modalType}
      modalHead={t("undoCheckout")}
      setModalClosed={props.setModalClosed}
      commentMandatory={true}
      openProcessName={props.actName}
      comment={comment}
      setComment={setComment}
      buttonOneFunc={undoCheckoutActivity}
      id="undo_checkout_act"
    />
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
  };
};

export default connect(mapStateToProps, null)(UndoCheckoutActivity);
