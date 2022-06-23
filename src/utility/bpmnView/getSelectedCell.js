import { style } from "../../Constants/bpmnView";
import { getSelectedCellType } from "../abstarctView/getSelectedCellType";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxConstants = mxgraphobj.mxConstants;

export function getSelectedCell(graph, processData) {
  let selectedCells = graph.getSelectionCells();
  let selectedCellValue = null;
  if (selectedCells?.length > 0) {
    selectedCells.forEach((cell) => {
      if (graph.isSwimlane(cell) === false) {
        //don't select swimlane /milestone add button
        let id = cell.getId();
        if (cell.isVertex()) {
          if (
            cell.getStyle() === style.taskTemplate ||
            cell.getStyle() === style.newTask ||
            cell.getStyle() === style.processTask
          ) {
            let selectedTask = null;
            processData.Tasks?.forEach((task) => {
              if (task.TaskId === id) {
                selectedTask = task;
              }
            });

            if (selectedTask !== null) {
              selectedCellValue = {
                id: selectedTask.TaskId,
                name: selectedTask.TaskName,
                taskType: selectedTask.TaskType,
                type: getSelectedCellType("TASK"),
              };
            }
          } else if (
            cell.getStyle() !== style.taskTemplate &&
            cell.getStyle() !== style.newTask &&
            cell.getStyle() !== style.processTask
          ) {
            let selectedActivity = null;
            processData.MileStones?.forEach((mile) => {
              mile.Activities?.forEach((activity) => {
                if (activity.ActivityId === id) {
                  selectedActivity = activity;
                } else if (
                  +activity.ActivityType === 41 &&
                  +activity.ActivitySubType === 1
                ) {
                  activity.EmbeddedActivity[0]?.forEach((act) => {
                    if (act.ActivityId === id) {
                      selectedActivity = activity;
                    }
                  });
                }
              });
            });

            if (selectedActivity !== null) {
              selectedCellValue = {
                id: selectedActivity.ActivityId,
                name: selectedActivity.ActivityName,
                activityType: selectedActivity.ActivityType,
                activitySubType: selectedActivity.ActivitySubType,
                seqId: null,
                queueId: selectedActivity.QueueId,
                type: getSelectedCellType("ACTIVITY"),
              };
            }
          }
        } else if (cell.isEdge()) {
          console.log("I am edge");
        }
      } else {
        [cell].forEach((cellItem) => {
          let id = cellItem.getId();
          let horizontal = graph
            .getStylesheet()
            .getCellStyle(cellItem.getStyle())[mxConstants.STYLE_HORIZONTAL];
          if (horizontal) {
            //cell to be selected is milestone
            let selectedMile = processData.MileStones?.filter(
              (mile) => +mile.iMileStoneId === +id
            );
            if (selectedMile[0]) {
              selectedCellValue = {
                id: selectedMile[0].iMileStoneId,
                name: selectedMile[0].MileStoneName,
                activityType: null,
                activitySubType: null,
                seqId: selectedMile[0].SequenceId,
                queueId: null,
                type: getSelectedCellType("MILE"),
              };
            }
          } else {
            //cell to be selected is swimlane
            console.log("I am swimlane");
          }
        });
      }
    });
  }
  return selectedCellValue;
}
