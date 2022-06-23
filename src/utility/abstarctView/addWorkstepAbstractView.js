import { gridSize, widthForDefaultVertex } from "../../Constants/bpmnView";

// Function that runs when a draggable item is being dragged over a droppable region.
export const onDragOver = (e) => {
  e.preventDefault();
};

// Function that runs when a draggable item is dropped in a droppable region.
export const onDrop = (e, className, functionName, index) => {
  if (JSON.parse(e.dataTransfer.getData("bFromToolbox")) === true) {
    const iActivityId = +e.dataTransfer.getData("iActivityID");
    const iSubActivityId = +e.dataTransfer.getData("iSubActivityID");
    functionName(iActivityId, iSubActivityId, index);
  }
  if (e.target.className === className) {
    e.target.style.border = "";
    e.target.style.color = "";
  }
};

// Function to change the style of the add workstep button when a draggable item enters the region.
export const onDragEnter = (e, className) => {
  if (e.target.className === className) {
    e.target.style.border = "0.05rem dashed rgb(20, 52, 164)";
    e.target.style.color = "rgb(20, 52, 164)";
  }
};

// Function to change the style of the add workstep button when a draggable item leaves the region.
export const onDragLeave = (e, className) => {
  if (e.target.className === className) {
    e.target.style.border = "";
    e.target.style.color = "";
  }
};

// Function to get width of milestones till specific index
export const getFullWidth = (index, processData) => {
  let width = 0;
  for (let i = 0; i < index; i++) {
    width = +width + +processData.MileStones[i].Width;
  }

  return width;
};

// Function to create mileObj when milestone width is changed while moving activity
export const milestoneWidthToIncrease = (
  maxXLeftLoc,
  processData,
  mileId,
  newActivityId,
  isCurrentActDefault
) => {
  let mileStoneWidth;
  processData.MileStones.forEach((element) => {
    if (element.iMileStoneId == mileId) {
      mileStoneWidth = element.Width;
    }
  });
  let boundaryXLoc = isCurrentActDefault
    ? +maxXLeftLoc + widthForDefaultVertex + gridSize
    : +maxXLeftLoc + gridSize * 2;
  if (boundaryXLoc > mileStoneWidth) {
    let changedIdx = null,
      newMileWidth,
      oldMileWidth;
    return {
      arrMilestoneInfos: processData.MileStones.map((mile, index) => {
        if (mileId === mile.iMileStoneId) {
          changedIdx = index;
          newMileWidth = isCurrentActDefault
            ? +maxXLeftLoc + widthForDefaultVertex + gridSize + ""
            : +maxXLeftLoc + gridSize * 2 + "";
          oldMileWidth = +mile.Width;
        }
        return {
          milestoneId: mile.iMileStoneId,
          milestoneName: mile.MileStoneName,
          width: mileId == mile.iMileStoneId ? newMileWidth : mile.Width,
          oldWidth: mile.Width,
          activities: mile.Activities?.filter(
            (act) => act.ActivityId != newActivityId
          ).map((act) => {
            return {
              actId: act.ActivityId,
              xLeftLoc:
                changedIdx !== null && changedIdx < index
                  ? +getFullWidth(index, processData) +
                    +act.xLeftLoc +
                    +newMileWidth -
                    oldMileWidth +
                    ""
                  : +getFullWidth(index, processData) + +act.xLeftLoc + "",
            };
          }),
        };
      }),
    };
  } else return false;
};
