import {
  SERVER_URL,
  ENDPOINT_REMOVEACTIVITY,
} from "../../Constants/appConstants";
import axios from "axios";

export const deleteActivity = (
  activityId,
  activityName,
  processDefId,
  setProcessData
) => {
  var obj = {
    processDefId: processDefId,
    actName: activityName,
    actId: activityId,
  };
  axios.post(SERVER_URL + ENDPOINT_REMOVEACTIVITY, obj).then((response) => {
    // if (response.data.Status == 0) {
    setProcessData((prevProcessData) => {
      let newProcessData = { ...prevProcessData };
      newProcessData.MileStones.forEach((milestone) => {
        milestone.Activities.forEach((activity, index) => {
          if (activity.ActivityId === Number(activityId)) {
            //removes activity from Activities array
            milestone.Activities.splice(index, 1);
          }
          if (activity.EmbeddedActivity) {
            activity.EmbeddedActivity[0].forEach((embAct, indexAct) => {
              if (embAct.ActivityId === Number(activityId)) {
                milestone.Activities[index].EmbeddedActivity[0].splice(
                  indexAct,
                  1
                );
              }
            });
          }
        });
      });
      //delete all connecting edges to this activity
      newProcessData.Connections.forEach((connection, index) => {
        if (
          connection.SourceId === Number(activityId) ||
          connection.TargetId === Number(activityId)
        ) {
          newProcessData.Connections.splice(index, 1);
        }
      });

      return newProcessData;
    });
    // }
  });
};
