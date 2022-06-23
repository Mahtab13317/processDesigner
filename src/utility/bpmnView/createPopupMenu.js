import {
  AddVertexType,
  cellSize,
  defaultShapeVertex,
  graphGridSize,
  gridSize,
  heightForDefaultVertex,
  milestoneTitleWidth,
  style,
  swimlaneTitleWidth,
  widthForDefaultVertex,
} from "../../Constants/bpmnView";
import { getFullWidth } from "../abstarctView/addWorkstepAbstractView";
import { getActivityQueueObj } from "../abstarctView/getActivityQueueObj";
import { PasteActivity } from "../CommonAPICall/PasteActivity";
import { PasteEmbeddedActivity } from "../CommonAPICall/PasteEmbeddedActivity";
import { dimensionInMultipleOfGridSize } from "./drawOnGraph";
import { getMilestoneAt } from "./getMilestoneAt";
import { getSwimlaneAt } from "./getSwimlaneAt";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxGeometry = mxgraphobj.mxGeometry;
const mxEventObject = mxgraphobj.mxEventObject;

export function createPopupMenu(
  graph,
  menu,
  setProcessData,
  setNewId,
  translation,
  caseEnabled
) {
  if (
    graph.copiedCell &&
    graph.copiedCell.style !== style.taskTemplate &&
    graph.copiedCell.style !== style.processTask &&
    graph.copiedCell.style !== style.newTask &&
    !graph.copiedCell.style.includes(style.swimlane) &&
    graph.copiedCell.style !== style.tasklane &&
    !graph.copiedCell.style.includes(style.swimlane_collapsed) &&
    graph.copiedCell.style !== style.tasklane_collapsed &&
    graph.copiedCell.style !== style.milestone &&
    graph.copiedCell.style !== style.expandedEmbeddedProcess
  ) {
    menu.addItem(translation("paste"), null, () =>
      pasteFunction(
        graph,
        menu,
        setProcessData,
        setNewId,
        translation,
        caseEnabled
      )
    );
  }
}

export function pasteFunction(
  graph,
  menu,
  setProcessData,
  setNewId,
  translation,
  caseEnabled
) {
  if (
    graph.copiedCell &&
    graph.copiedCell.style !== style.taskTemplate &&
    graph.copiedCell.style !== style.processTask &&
    graph.copiedCell.style !== style.newTask &&
    !graph.copiedCell.style.includes(style.swimlane) &&
    graph.copiedCell.style !== style.tasklane &&
    !graph.copiedCell.style.includes(style.swimlane_collapsed) &&
    graph.copiedCell.style !== style.tasklane_collapsed &&
    graph.copiedCell.style !== style.milestone &&
    graph.copiedCell.style !== style.expandedEmbeddedProcess
  ) {
    let mileStoneWidthIncreasedFlag = false;
    let laneHeightIncreasedFlag = false;
    let mileStoneInfo = {};
    let lanesInfo = {};
    let copiedCell = graph.copiedCell;
    let x = menu
      ? dimensionInMultipleOfGridSize(menu.triggerX)
      : copiedCell.geometry.x + copiedCell.parent.geometry.x + graphGridSize;
    let y = menu
      ? dimensionInMultipleOfGridSize(menu.triggerY)
      : copiedCell.geometry.y + copiedCell.parent.geometry.y + graphGridSize;
    let mileAtXY = getMilestoneAt(x, y, null, graph);
    let swimlaneAtXY = getSwimlaneAt(x, y, null, graph, AddVertexType);
    let parentCell = swimlaneAtXY;
    let vertexX = x - mileAtXY.geometry.x + gridSize;
    let vertexY = y - parentCell.geometry.y;
    let parentCellId = parseInt(parentCell.getId());
    let mileId = parseInt(mileAtXY.getId());
    let vertex = new mxgraphobj.mxCell(
      "",
      new mxGeometry(0, 0, cellSize.w, cellSize.h),
      copiedCell.getStyle()
    );
    vertex.setVertex(true);
    //if drop is near border, stretch border so that the vertex is completely
    //inside milestone/swimlane
    let newWidth = Math.max(
      mileAtXY.geometry.width,
      vertexX +
        (defaultShapeVertex.includes(copiedCell.getStyle())
          ? widthForDefaultVertex
          : cellSize.w)
    );

    let newHeight = Math.max(
      parentCell.geometry.height,
      y -
        swimlaneAtXY.geometry.y +
        (defaultShapeVertex.includes(copiedCell.getStyle())
          ? heightForDefaultVertex + gridSize
          : cellSize.h + gridSize)
    );
    let newActivityId = 0;
    let processDefId, processName;
    let mileIndex,
      MaxseqId = 0,
      queueInfo,
      newProcessData,
      mileWidth = 0;
    let activityType,
      activitySubType,
      actName = "";
    let embeddedObj = [];
    let laneHeight = milestoneTitleWidth;
    let isLaneFound = false;
    setNewId((oldIds) => {
      newActivityId = oldIds.activityId + 1;
      return { ...oldIds, activityId: newActivityId };
    });
    setProcessData((prevProcessData) => {
      newProcessData = { ...prevProcessData };
      prevProcessData.MileStones?.forEach((mile) => {
        mile.Activities?.forEach((act) => {
          if (act.ActivityId === copiedCell.id) {
            activityType = act.ActivityType;
            activitySubType = act.ActivitySubType;
            actName = act.ActivityName;
          }
        });
      });
      return prevProcessData;
    });
    queueInfo = getActivityQueueObj(
      setNewId,
      activityType,
      activitySubType,
      actName + "_" + newActivityId,
      newProcessData,
      parentCellId,
      translation
    );

    setProcessData((prevProcessData) => {
      //do not do shallow copy process Data, else original state will get change
      let newProcessData = { ...prevProcessData };
      processDefId = newProcessData.ProcessDefId;
      processName = newProcessData.ProcessName;
      newProcessData.MileStones = [...prevProcessData.MileStones];
      newProcessData.Lanes = [...prevProcessData.Lanes];
      newProcessData.MileStones?.forEach((milestone) => {
        if (milestone.iMileStoneId === mileId) {
          milestone?.Activities?.forEach((activity) => {
            if (+activity.SequenceId > +MaxseqId) {
              MaxseqId = +activity.SequenceId;
            }
            if (
              +activity.ActivityType === 41 &&
              +activity.ActivitySubType === 1
            ) {
              activity.EmbeddedActivity[0]?.forEach((embAct) => {
                if (+embAct.SequenceId > +MaxseqId) {
                  MaxseqId = +embAct.SequenceId;
                }
              });
            }
          });
        }
      });
      newProcessData.Lanes?.forEach((lane) => {
        if (lane.LaneId === parentCell.id) {
          isLaneFound = true;
        }
        if (!isLaneFound) {
          if (!caseEnabled && lane.LaneId !== -99) {
            laneHeight = laneHeight + +lane.Height;
          } else if (caseEnabled) {
            laneHeight = laneHeight + +lane.Height;
          }
        }
      });

      if (+activityType === 41 && +activitySubType === 1) {
        newProcessData.MileStones?.forEach((milestone) => {
          if (milestone.iMileStoneId === mileId) {
            milestone?.Activities?.forEach((activity) => {
              if (activity.ActivityId === copiedCell.id) {
                activity.EmbeddedActivity[0]?.forEach((embAct, index) => {
                  let queueInfo = getActivityQueueObj(
                    setNewId,
                    embAct.ActivityType,
                    embAct.ActivitySubType,
                    embAct.ActivityName + "_" + (newActivityId + index + 1),
                    newProcessData,
                    parentCellId,
                    translation
                  );
                  embeddedObj.push({
                    ...embAct,
                    ActivityId: newActivityId + index + 1,
                    ActivityName:
                      embAct.ActivityName + "_" + (newActivityId + index + 1),
                    LaneId: parentCellId,
                    QueueId: queueInfo.queueId,
                    QueueInfo: queueInfo,
                    SequenceId: +MaxseqId + index + 2,
                  });
                });
              }
            });
          }
        });
      }
      //assumption that each milestone have unique iMilestoneId
      newProcessData.MileStones = newProcessData.MileStones.map(
        (milestone, index) => {
          milestone["oldWidth"] = milestone.Width;
          if (milestone.iMileStoneId === mileId) {
            mileIndex = index;
            let tempActArr = [...milestone.Activities];
            if (+newWidth !== +milestone.Width) {
              mileStoneWidthIncreasedFlag = true;
              milestone.Width = newWidth + "";
            }
            if (+activityType === 41 && +activitySubType === 1) {
              tempActArr.push({
                ActivityId: newActivityId,
                ActivityName: actName + "_" + newActivityId,
                ActivityType: activityType,
                ActivitySubType: activitySubType,
                LaneId: parentCellId,
                xLeftLoc: vertexX,
                yTopLoc: +laneHeight + vertexY,
                isActive: "true",
                BlockId: 0,
                CheckedOut: "",
                Color: "1234",
                FromRegistered: "N",
                EmbeddedActivity: [embeddedObj],
                QueueCategory: "",
                QueueId: queueInfo.queueId,
                SequenceId: +MaxseqId + 1,
                id: "",
                AssociatedTasks: [],
              });
            } else {
              tempActArr.push({
                xLeftLoc: vertexX,
                yTopLoc: +laneHeight + vertexY,
                ActivityType: activityType,
                ActivitySubType: activitySubType,
                ActivityId: newActivityId,
                ActivityName: actName + "_" + newActivityId,
                LaneId: parentCellId,
                isActive: "true",
                BlockId: 0,
                CheckedOut: "",
                Color: "1234",
                FromRegistered: "N",
                QueueCategory: "",
                QueueId: queueInfo.queueId,
                SequenceId: +MaxseqId + 1,
                id: "",
                AssociatedTasks: [],
              });
            }
            return { ...milestone, Activities: [...tempActArr] };
          }
          if (!mileIndex) {
            mileWidth = mileWidth + +milestone.Width;
          }
          return milestone;
        }
      );

      if (mileStoneWidthIncreasedFlag) {
        mileStoneInfo = {
          arrMilestoneInfos: newProcessData.MileStones?.map((mile, index) => {
            return {
              milestoneId: mile.iMileStoneId,
              milestoneName: mile.MileStoneName,
              width: mile.Width,
              oldWidth: mile.oldWidth,
              activities: mile.Activities?.filter(
                (act) => act.ActivityId !== newActivityId
              )?.map((act) => {
                return {
                  actId: act.ActivityId,
                  xLeftLoc:
                    +getFullWidth(index, newProcessData) + +act.xLeftLoc + "",
                };
              }),
            };
          }),
        };
      }

      //change height of swimlane , if drop is near boundary
      newProcessData.Lanes?.forEach((swimlane, index) => {
        swimlane["oldHeight"] = swimlane.Height;
        if (swimlane.LaneId === parentCellId) {
          newProcessData.Lanes[index] = { ...swimlane };
          if (+newHeight !== +parentCell.geometry.height) {
            laneHeightIncreasedFlag = true;
            newProcessData.Lanes[index].Height = newHeight + "";
          }
        }
      });

      if (laneHeightIncreasedFlag) {
        lanesInfo = {
          arrLaneInfos: newProcessData.Lanes?.map((lane) => {
            return {
              laneId: lane.LaneId,
              laneName: lane.LaneName,
              laneSeqId: lane.LaneSeqId,
              height: lane.Height,
              oldHeight: lane.oldHeight,
              width: lane.Width,
              oldWidth: lane.Width,
            };
          }),
        };
      }
      return newProcessData;
    });

    vertex.geometry.x = dimensionInMultipleOfGridSize(x) - swimlaneTitleWidth;
    vertex.geometry.y = dimensionInMultipleOfGridSize(vertexY);
    if (defaultShapeVertex.includes(copiedCell.getStyle())) {
      vertex.geometry.width = widthForDefaultVertex;
      vertex.geometry.height = heightForDefaultVertex;
    } else {
      vertex.geometry.width = gridSize;
      vertex.geometry.height = gridSize;
    }
    parentCell.insert(vertex);
    vertex.value = actName + "_" + newActivityId;
    vertex.id = newActivityId;
    graph.setSelectionCell(vertex);
    graph.fireEvent(new mxEventObject("cellsInserted", "cells", vertex));
    if (+activityType === 41 && +activitySubType === 1) {
      let embArr = embeddedObj.map((embAct) => {
        return {
          processDefId: processDefId,
          processName: processName,
          actName: embAct.ActivityName,
          actId: embAct.ActivityId,
          actType: embAct.ActivityType,
          actSubType: embAct.ActivitySubType,
          actAssocId: 0,
          seqId: embAct.SequenceId,
          laneId: embAct.LaneId,
          blockId: 0,
          queueId: embAct.QueueId,
          queueInfo: embAct.QueueInfo,
          queueExist: embAct.QueueInfo?.queueExist,
          xLeftLoc: embAct.xLeftLoc,
          yTopLoc: embAct.yTopLoc,
          milestoneId: mileId,
          parentActivityId: +newActivityId,
        };
      });
      PasteEmbeddedActivity(
        processDefId,
        processName,
        {
          name: actName + `_` + newActivityId,
          id: newActivityId,
          actType: activityType,
          actSubType: activitySubType,
          actAssocId: 0,
          seqId: +MaxseqId + 1,
          laneId: parentCellId,
          laneName: parentCellId.value,
          blockId: 0,
          queueInfo: queueInfo,
          xLeftLoc: mileIndex === 0 ? vertexX : +mileWidth + vertexX,
          yTopLoc: +laneHeight + vertexY,
          view: "BPMN",
        },
        { mileId: mileId, mileIndex: mileIndex },
        setProcessData,
        vertexX,
        embArr,
        copiedCell.value,
        copiedCell.id,
        mileStoneWidthIncreasedFlag ? mileStoneInfo : null,
        laneHeightIncreasedFlag ? lanesInfo : null
      );
    } else {
      PasteActivity(
        processDefId,
        processName,
        {
          name: actName + `_` + newActivityId,
          id: newActivityId,
          actType: activityType,
          actSubType: activitySubType,
          actAssocId: 0,
          seqId: +MaxseqId + 1,
          laneId: parentCellId,
          laneName: parentCellId.value,
          blockId: 0,
          queueInfo: queueInfo,
          xLeftLoc: mileIndex === 0 ? vertexX : +mileWidth + vertexX,
          yTopLoc: +laneHeight + vertexY,
          view: "BPMN",
        },
        { mileId: mileId, mileIndex: mileIndex },
        setProcessData,
        vertexX,
        copiedCell.value,
        copiedCell.id,
        mileStoneWidthIncreasedFlag ? mileStoneInfo : null,
        laneHeightIncreasedFlag ? lanesInfo : null
      );
    }
    graph.copiedCell = null;
  }
}
