import { deleteSwimlane } from "../CommonAPICall/DeleteSwimlane";
import { deleteMilestone } from "../CommonAPICall/DeleteMilestone";
import { deleteMilestoneArray } from "../InputForAPICall/deleteMilestoneArray";
import { deleteActivity } from "../CommonAPICall/DeleteActivity";
import axios from "axios";
import {
  ENDPOINT_DELETE_CONNECTION,
  SERVER_URL,
} from "../../Constants/appConstants";
import { getTaskDependency } from "../CommonAPICall/GetTaskDependency";
import { style } from "../../Constants/bpmnView";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxConstants = mxgraphobj.mxConstants;

export function deleteCell(
  graph,
  setProcessData,
  setTaskAssociation,
  setShowDependencyModal
) {
  let message = null;
  let anyDeletion = false;

  let selectedCells = graph.getSelectionCells();
  if (selectedCells.length === 0) {
    message = {
      langKey: "messages.selectToDelete",
      defaultWord: "Please Select to Delete! default",
    };
    return [message, false];
  }

  for (var j of selectedCells) {
    let cell = j;
    if (graph.isSwimlane(cell) === false) {
      //code added on 22 August 2022 for BugId 114452
      if (cell.getStyle() !== "layer") {
        //don't delete swimlane /milestone add button
        let id = cell.getId();
        if (cell.isVertex()) {
          if (
            cell.getStyle() === style.taskTemplate ||
            cell.getStyle() === style.newTask ||
            cell.getStyle() === style.processTask
          ) {
            let selectedTask = null,
              processDefId,
              processType;
            setProcessData((prevProcessData) => {
              prevProcessData.Tasks?.forEach((task) => {
                if (task.TaskId === +id) {
                  selectedTask = task;
                }
              });
              processDefId = prevProcessData.ProcessDefId;
              processType = prevProcessData.ProcessType;
              return prevProcessData;
            });
            getTaskDependency(
              id,
              selectedTask.TaskName,
              processDefId,
              processType,
              setTaskAssociation,
              setShowDependencyModal,
              setProcessData
            );
          } else if (
            cell.getStyle() !== style.taskTemplate &&
            cell.getStyle() !== style.newTask &&
            cell.getStyle() !== style.processTask
          ) {
            let processDefId, activityName;
            setProcessData((prevProcessData) => {
              prevProcessData.MileStones.forEach((milestone) => {
                milestone.Activities.forEach((activity) => {
                  if (activity.ActivityId === Number(id)) {
                    activityName = activity.ActivityName;
                  }
                });
              });
              processDefId = prevProcessData.ProcessDefId;
              return prevProcessData;
            });
            deleteActivity(id, activityName, processDefId, setProcessData);
          }
        } else if (cell.isEdge()) {
          let processDefId, processMode;
          setProcessData((prevProcessData) => {
            processDefId = prevProcessData.ProcessDefId;
            processMode = prevProcessData.ProcessType;
            return prevProcessData;
          });
          let json = {
            processDefId: processDefId,
            processMode: processMode,
            connId: Number(id),
            connType: "D",
          };
          axios
            .post(SERVER_URL + ENDPOINT_DELETE_CONNECTION, json)
            .then((response) => {
              if (response.data.Status === 0) {
                setProcessData((prevProcessData) => {
                  let newProcessData = JSON.parse(
                    JSON.stringify(prevProcessData)
                  );
                  newProcessData.Connections?.forEach((connection, index) => {
                    if (connection.ConnectionId === Number(id)) {
                      newProcessData.Connections.splice(index, 1);
                    }
                  });
                  return newProcessData;
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } else {
      //delete only if there is atleast one swimlane and milestone present
      let parent = cell.getParent();
      let deletable = false;

      for (let i of parent.children) {
        let siblingCell = i;
        if (siblingCell !== cell && graph.isSwimlane(siblingCell) === true) {
          deletable = true;
          break;
        }
      }

      if (deletable === true) {
        [cell].forEach((cellItem) => {
          let id = cellItem.getId();
          let horizontal = graph
            .getStylesheet()
            .getCellStyle(cellItem.getStyle())[mxConstants.STYLE_HORIZONTAL];
          if (horizontal) {
            //cell to be deleted is milestone
            let processDefId, mileArray;
            setProcessData((prevProcessData) => {
              mileArray = deleteMilestoneArray(prevProcessData, id);
              processDefId = prevProcessData.ProcessDefId;
              return prevProcessData;
            });
            deleteMilestone(
              id,
              setProcessData,
              processDefId,
              mileArray.array,
              mileArray.index
            );
          } else {
            //cell to be deleted is swimlane
            let selectedlane, processDefId, processName;
            setProcessData((prevProcessData) => {
              selectedlane = prevProcessData.Lanes?.filter(
                (item) => +item.LaneId === +id
              );
              processDefId = prevProcessData.ProcessDefId;
              processName = prevProcessData.ProcessName;
              return prevProcessData;
            });
            deleteSwimlane(
              id,
              selectedlane[0],
              setProcessData,
              processDefId,
              processName
            );
          }
        });
        anyDeletion = true;
      } else {
        message = {
          langKey: "messages.lastSwimlaneMilestone",
          defaultWord: "Last Swimlane/Milestone can't be deleted",
        };
        break;
      }
    }
  }

  return [message, anyDeletion];
}
