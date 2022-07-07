import { SERVER_URL, ENDPOINT_REMOVETASK } from "../../Constants/appConstants";
import axios from "axios";

export const deleteTask = (taskId, taskName, processDefId, setProcessData) => {
  var obj = {
    processDefId: processDefId,
    taskId: taskId,
    taskName: taskName,
  };
  axios
    .post(SERVER_URL + ENDPOINT_REMOVETASK, obj)
    .then((response) => {
      // if (response.data.Status == 0) {
      setProcessData((prevProcessData) => {
        let newProcessData = JSON.parse(JSON.stringify(prevProcessData));
        newProcessData.Tasks.forEach((task, index) => {
          if (task.TaskId === Number(taskId)) {
            //removes task from Tasks array
            newProcessData.Tasks.splice(index, 1);
          }
        });

        return newProcessData;
      });
      // }
    })
    .catch((err) => {
      console.log(err);
    });
};
