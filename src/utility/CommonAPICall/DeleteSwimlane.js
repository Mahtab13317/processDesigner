import { SERVER_URL, ENDPOINT_REMOVELANE } from "../../Constants/appConstants";
import axios from "axios";

export const deleteSwimlane = (
  swimlaneId,
  selectedlane,
  setProcessData,
  processDefId,
  processName
) => {
  var obj = {
    laneId: selectedlane.LaneId,
    laneName: selectedlane.LaneName,
    queueInfo: {
      queueId: selectedlane.QueueId,
      queueName: `${processName}_${selectedlane.LaneName}`,
    },
    processDefId: processDefId,
    processName: processName,
  };
  axios
    .post(SERVER_URL + ENDPOINT_REMOVELANE, obj)
    .then((response) => {
      if (response.data.Status == 0) {
        setProcessData((prevProcessData) => {
          let newProcessData = JSON.parse(JSON.stringify(prevProcessData));
          newProcessData.Lanes.forEach((swimlane, index) => {
            if (swimlane.LaneId === swimlaneId) {
              newProcessData.MileStones.forEach((milestone) => {
                milestone.Activities.forEach((activity, activityIndex) => {
                  if (activity.LaneId === Number(swimlaneId)) {
                    //removes activity from Activities array
                    milestone.Activities.splice(activityIndex, 1);
                    newProcessData.Connections.forEach(
                      (connection, connectionIndex) => {
                        //delete all connecting edges to this activity
                        if (
                          connection.SourceId === activity.ActivityId ||
                          connection.TargetId === activity.ActivityId
                        ) {
                          newProcessData.Connections.splice(connectionIndex, 1);
                        }
                      }
                    );
                  }
                });
              });
              newProcessData.Lanes.splice(index, 1);
            }
          });
          return newProcessData;
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
