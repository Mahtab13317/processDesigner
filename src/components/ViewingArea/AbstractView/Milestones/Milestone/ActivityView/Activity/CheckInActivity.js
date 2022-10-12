import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CommonModalBody from "../../../../../Header/CommonModalBody";
import {
  ENDPOINT_UNDO_CHECKIN_ACT,
  SERVER_URL,
} from "../../../../../../../Constants/appConstants";
import { connect, useDispatch, useSelector } from "react-redux";
import { ActivityCheckoutValue } from "../../../../../../../redux-store/slices/ActivityCheckoutSlice";
import { setToastDataFunc } from "../../../../../../../redux-store/slices/ToastDataHandlerSlice";

function CheckInActivity(props) {
  let { t } = useTranslation();
  const [comment, setComment] = useState("");
  const CheckedAct = useSelector(ActivityCheckoutValue);
  const dispatch = useDispatch();

  const checkInActivity = () => {
    let mileId;
    props.setprocessData((prev) => {
      let temp = JSON.parse(JSON.stringify(prev));
      temp.MileStones?.forEach((mile) => {
        mile.Activities?.forEach((act) => {
          if (+act.ActivityId === +props.actId) {
            mileId = mile.iMileStoneId;
          }
        });
      });
      return temp;
    });

    let actInfoJson = {
      actId: props.activity.ActivityId,
      status: "U",
      mileStoneId: mileId,
      actType: props.activity.ActivityType,
      actSubType: props.activity.ActivitySubType,
      seqId: props.activity.SequenceId,
      actName: props.activity.ActivityName,
      xLeftLoc: props.activity.xLeftLoc,
      yTopLoc: props.activity.yTopLoc,
      laneId: props.activity.LaneId,
      blockId: props.activity.BlockId,
      queueId: props.activity.QueueId,
      queueCategory: props.activity.QueueCategory,
      color: props.activity.Color,
      isMobileEnabled: false,
      propStatus: "U",
    };
    let tempProp = CheckedAct.checkedActProp?.ActivityProperty;
    let localActProperty = tempProp ? JSON.parse(JSON.stringify(tempProp)) : {};
    let json = {
      processDefId: props.openProcessID,
      type: 3,
      comment: comment,
      pMActInfo: {
        ...actInfoJson,
        ...localActProperty,
      },
    };

    axios
      .post(SERVER_URL + ENDPOINT_UNDO_CHECKIN_ACT, json)
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
                "hasBeenCheckedIn"
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
      modalHead={t("checkInActivity")}
      setModalClosed={props.setModalClosed}
      commentMandatory={true}
      openProcessName={props.actName}
      comment={comment}
      setComment={setComment}
      buttonOneFunc={checkInActivity}
      id="checkin_act"
    />
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
  };
};

export default connect(mapStateToProps, null)(CheckInActivity);
