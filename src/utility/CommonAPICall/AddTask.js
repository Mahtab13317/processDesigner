import {
  SERVER_URL,
  ENDPOINT_ADDTASK,
  TaskType,
} from "../../Constants/appConstants";
import axios from "axios";

export const addTaskAPI = (
  taskId,
  taskName,
  taskType,
  xLeftLoc,
  yTopLoc,
  setProcessData,
  processDefId,
  milestoneIndex,
  activityindex,
  activityName,
  activityId,
  milestoneWidthIncreased,
  view
) => {
  var obj = {
    taskId: taskId,
    taskName: taskName,
    taskType: taskType,
    xLeftLoc: xLeftLoc + "",
    yTopLoc: yTopLoc + "",
    taskMode: "",
    taskScope: "P",
    associatedActivityName: activityName,
    associatedActivityId: activityId,
    processDefId: +processDefId,
  };
  if (milestoneWidthIncreased) {
    obj = { ...obj, ...milestoneWidthIncreased };
  }
  axios
    .post(SERVER_URL + ENDPOINT_ADDTASK, obj)
    .then((response) => {
      if (response.data.Status === 0) {
        if (view !== "BPMN") {
          setProcessData((prevProcessData) => {
            let newProcessData = JSON.parse(JSON.stringify(prevProcessData));
            let taskObj = {
              CheckedOut: "N",
              Description: "",
              Goal: "",
              Instructions: "",
              NotifyEmail: "N",
              Repeatable: "N",
              TaskId: obj.taskId,
              TaskName: obj.taskName,
              TaskType:
                taskType === 1 ? TaskType.globalTask : TaskType.processTask,
              TemplateId: -1,
              isActive: "true",
              xLeftLoc: obj.xLeftLoc,
              yTopLoc: obj.yTopLoc + "",
            };
            newProcessData.Tasks.splice(0, 0, taskObj);
            newProcessData.MileStones[milestoneIndex].Activities[
              activityindex
            ].AssociatedTasks.push(taskId);
            return newProcessData;
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
