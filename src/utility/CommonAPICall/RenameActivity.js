import {
  SERVER_URL,
  ENDPOINT_RENAMEACTIVITY,
} from "../../Constants/appConstants";
import axios from "axios";

export const renameActivity = (
  actId,
  oldActName,
  newActivityName,
  setProcessData,
  processDefId,
  processName,
  queueId,
  queueInfo,
  isBpmn
) => {
  let obj = {
    actName: newActivityName,
    actId: actId,
    oldName: oldActName,
    processDefId: processDefId,
    processName: processName,
    queueId: queueId,
    // code added on 22 July 2022 for BugId 113305
    queueInfo: queueInfo,
    queueExist: queueInfo.queueExist,
  };
  axios
    .post(SERVER_URL + ENDPOINT_RENAMEACTIVITY, obj)
    .then((response) => {
      if (response.data.Status == 0) {
        if (!isBpmn) {
          //value already set in bpmn view
          setProcessData((prevProcessData) => {
            let newProcessData = JSON.parse(JSON.stringify(prevProcessData));
            newProcessData.MileStones?.forEach((milestone) => {
              milestone.Activities &&
                milestone.Activities.map((activity) => {
                  if (activity.ActivityId === actId) {
                    //rename activity name
                    activity.ActivityName = newActivityName;
                  }
                });
            });
            // code added on 22 July 2022 for BugId 113305
            if (!queueInfo.queueExist) {
              newProcessData.Queue?.forEach((el, index) => {
                if (+queueId === +el.QueueId) {
                  newProcessData.Queue[index].QueueName = queueInfo?.queueName;
                  newProcessData.Queue[index].QueueDescription =
                    queueInfo?.queueDesc;
                }
              });
            }
            return newProcessData;
          });
        }
      } else {
        if (isBpmn) {
          // revert to old activity name if api fails
          setProcessData((prevProcessData) => {
            let newProcessData = JSON.parse(JSON.stringify(prevProcessData));
            newProcessData.MileStones?.forEach((milestone) => {
              milestone.Activities &&
                milestone.Activities.map((activity) => {
                  if (activity.ActivityId === actId) {
                    //rename activity name
                    activity.ActivityName = oldActName;
                  }
                });
            });
            // code added on 22 July 2022 for BugId 113305
            if (!queueInfo.queueExist) {
              newProcessData.Queue?.forEach((el, index) => {
                if (+queueId === +el.QueueId) {
                  newProcessData.Queue[index].QueueName =
                    queueInfo?.oldQueueName;
                  newProcessData.Queue[index].QueueDescription =
                    queueInfo?.oldQueueDesc;
                }
              });
            }
            return newProcessData;
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
