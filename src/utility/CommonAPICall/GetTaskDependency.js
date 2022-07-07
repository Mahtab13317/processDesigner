import {
  SERVER_URL,
  ENDPOINT_PROCESS_ASSOCIATION,
} from "../../Constants/appConstants";
import axios from "axios";
import { deleteTask } from "./DeleteTask";

export const getTaskDependency = (
  taskId,
  taskName,
  processDefId,
  processType,
  setTaskAssociation,
  setShowDependencyModal,
  setProcessData
) => {
  axios
    .get(
      SERVER_URL +
        ENDPOINT_PROCESS_ASSOCIATION +
        `/${processDefId}/${processType}/${taskName}/${taskId}/Task/D`
    )
    .then((res) => {
      if (res.data.Status === 0) {
        setTaskAssociation(res.data.Validations);
        if (res.data.Validations?.length > 0) {
          setShowDependencyModal(true);
        } else {
          deleteTask(taskId, taskName, processDefId, setProcessData);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
