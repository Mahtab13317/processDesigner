import {
  SERVER_URL,
  ENDPOINT_CHANGEACTIVITY,
} from "../../Constants/appConstants";
import axios from "axios";

export const ChangeActivityType = (
  processDefId,
  actName,
  actType,
  actSubType,
  setProcessData,
  mileIndex,
  activityIndex,
  actId
) => {
  var changeActPostBody = {
    processDefId: +processDefId,
    actName: actName,
    actType: actType,
    actSubType: actSubType,
    actId: actId,
  };

  axios
    .post(SERVER_URL + ENDPOINT_CHANGEACTIVITY, changeActPostBody)
    .then((response) => {
      if (response.data.Status == 0) {
        setProcessData((prev) => {
          let newObj = { ...prev };
          newObj.MileStones[mileIndex].Activities[activityIndex].ActivityType =
            actType;
          newObj.MileStones[mileIndex].Activities[
            activityIndex
          ].ActivitySubType = actSubType;
          return newObj;
        });
      }
    });
};
