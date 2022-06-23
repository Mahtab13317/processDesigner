import {
  SERVER_URL,
  ENDPOINT_DEASSOCIATETASK,
} from "../../Constants/appConstants";
import axios from "axios";

export const deassociateTask = (
  taskId,
  taskName,
  setProcessData,
  processDefId,
  milestoneIndex,
  activityindex,
  activityName,
  activityId
) => {
  var obj = {
    processDefId: processDefId,
    taskId: taskId,
    taskName: taskName,
    associatedActivityName: activityName,
    associatedActivityId: activityId,
  };
  axios.post(SERVER_URL + ENDPOINT_DEASSOCIATETASK, obj).then((response) => {
    if (response.data.Status == 0) {
      setProcessData((prevProcessData) => {
        let newProcessData = { ...prevProcessData };
        const tasks =
          newProcessData.MileStones[milestoneIndex].Activities[activityindex]
            .AssociatedTasks;
        let filteredArray = tasks?.filter((elem) => elem !== taskId);
        newProcessData.MileStones[milestoneIndex].Activities[
          activityindex
        ].AssociatedTasks = [...filteredArray];
        return newProcessData;
      });
    }
  });
};
