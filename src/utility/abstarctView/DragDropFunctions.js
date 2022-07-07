import axios from "axios";
import {
  ENDPOINT_MOVEACTIVITY,
  SERVER_URL,
} from "../../Constants/appConstants";
import {
  defaultShapeVertex,
  gridSize,
  widthForDefaultVertex,
} from "../../Constants/bpmnView";
import { getActivityProps } from "./getActivityProps";

// Function that runs when an activity card is dragged and dropped in the same milestone or in a different milestone.
export const handleDragEnd = (result, processData, setProcessData) => {
  const { destination, source } = result;
  if (!destination) return;

  if (
    // This condition runs when the activity card is dragged and dropped in its original position in the same milestone.
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) {
    return;
  } else {
    let activity, mile, prevMile, lastAct;
    let mileWidth = 0;
    let processObjectData = JSON.parse(JSON.stringify(processData));
    if (
      // This condition runs when the activity card is dragged and dropped in a different position in the same milestone.
      source.droppableId === destination.droppableId &&
      source.index !== destination.index
    ) {
      const milestoneIndex = +source.droppableId;

      prevMile = processObjectData.MileStones[milestoneIndex];
      activity =
        processObjectData.MileStones[milestoneIndex].Activities[source.index];
      mile = processObjectData.MileStones[milestoneIndex];
      lastAct =
        destination.index > 0 ? mile.Activities[destination.index - 1] : null;
      for (let i = 0; i < milestoneIndex; i++) {
        mileWidth = mileWidth + +processObjectData.MileStones[i].Width;
      }
    } else if (
      // This condition runs when the activity card is dragged and dropped in a different position in a different milestone.
      source.droppableId !== destination.droppableId
    ) {
      const sourceMileStoneIndex = +source.droppableId;
      const destinationMileStoneIndex = +destination.droppableId;
      prevMile = processObjectData.MileStones[sourceMileStoneIndex];
      activity =
        processObjectData.MileStones[sourceMileStoneIndex].Activities[
          source.index
        ];
      mile = processObjectData.MileStones[destinationMileStoneIndex];
      lastAct =
        destination.index > 0 ? mile.Activities[destination.index - 1] : null;
      for (let i = 0; i < destinationMileStoneIndex; i++) {
        mileWidth = mileWidth + +processObjectData.MileStones[i].Width;
      }
    }
    let isPreviousActDefault = defaultShapeVertex.includes(
      getActivityProps(lastAct.ActivityType, lastAct.ActivitySubType)[5]
    );

    axios
      .post(SERVER_URL + ENDPOINT_MOVEACTIVITY, {
        processDefId: processObjectData.ProcessDefId,
        actName: activity.ActivityName,
        actId: activity.ActivityId,
        seqId: lastAct ? +lastAct.SequenceId + 1 : 1,
        milestoneId: mile.iMileStoneId,
        prevMilestoneId: prevMile.iMileStoneId,
        laneId: activity.LaneId,
        prevLaneId: activity.LaneId,
        xLeftLoc: lastAct
          ? isPreviousActDefault
            ? +lastAct.xLeftLoc + gridSize + widthForDefaultVertex + mileWidth
            : +lastAct.xLeftLoc + gridSize + mileWidth
          : gridSize + mileWidth,
        yTopLoc: +lastAct.yTopLoc,
      })
      .then((res) => {
        if (res.data.Status === 0) {
          if (
            // This condition runs when the activity card is dragged and dropped in a different position in the same milestone.
            source.droppableId === destination.droppableId &&
            source.index !== destination.index
          ) {
            const milestoneIndex = +source.droppableId;
            const [reOrderedList] = processObjectData.MileStones[
              milestoneIndex
            ].Activities.splice(source.index, 1);
            processObjectData.MileStones[milestoneIndex].Activities.splice(
              destination.index,
              0,
              reOrderedList
            );
            processObjectData.MileStones[milestoneIndex].Activities[
              destination.index
            ].xLeftLoc = lastAct
              ? isPreviousActDefault
                ? +lastAct.xLeftLoc + gridSize + widthForDefaultVertex
                : +lastAct.xLeftLoc + gridSize
              : gridSize;
            processObjectData.MileStones[milestoneIndex].Activities[
              destination.index
            ].yTopLoc = +lastAct.yTopLoc;
            console.log("cell", processObjectData);
            setProcessData(processObjectData);
          } else if (
            // This condition runs when the activity card is dragged and dropped in a different position in a different milestone.
            source.droppableId !== destination.droppableId
          ) {
            const sourceMileStoneIndex = +source.droppableId;
            const destinationMileStoneIndex = +destination.droppableId;
            const [reOrderedList] = processObjectData.MileStones[
              sourceMileStoneIndex
            ].Activities.splice(source.index, 1);
            processObjectData.MileStones[
              destinationMileStoneIndex
            ].Activities.splice(destination.index, 0, reOrderedList);
            processObjectData.MileStones[destinationMileStoneIndex].Activities[
              destination.index
            ].xLeftLoc = lastAct
              ? isPreviousActDefault
                ? +lastAct.xLeftLoc + gridSize + widthForDefaultVertex
                : +lastAct.xLeftLoc + gridSize
              : gridSize;
            processObjectData.MileStones[destinationMileStoneIndex].Activities[
              destination.index
            ].yTopLoc = +lastAct.yTopLoc;
            console.log("cellDiff", processObjectData, lastAct);
            setProcessData(processObjectData);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
