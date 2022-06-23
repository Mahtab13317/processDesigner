import disabledIcon from "../../assets/bpmnView/cancelIcon.png";
import {
  cellSize,
  defaultShapeVertex,
  gridSize,
  gridStartPoint,
  style,
  widthForDefaultVertex,
  heightForDefaultVertex,
  graphGridSize,
  swimlaneTitleWidth,
  milestoneTitleWidth,
  AddVertexType,
} from "../../Constants/bpmnView";
import { getMilestoneAt } from "./getMilestoneAt";
import { getSwimlaneAt, getTasklaneAt } from "./getSwimlaneAt";
import {
  dropDirectltyToGraphGlobally,
  isAllowedOutsideMilestone,
} from "./dropOutsideMilestone";
import { AddActivity } from "../CommonAPICall/AddActivity";
import { getActivityQueueObj } from "../abstarctView/getActivityQueueObj";
import { getActivityAt, getTaskAt } from "./getActivityAt";
import { dimensionInMultipleOfGridSize } from "./drawOnGraph";
import { endEvent, startEvent } from "./toolboxIcon";
import { AddEmbeddedActivity } from "../CommonAPICall/AddEmbeddedActivity";
import { getExpandedSubprocess } from "./getExpandedSubprocess";
import { AddActivityInSubprocess } from "../CommonAPICall/AddActivityInSubprocess";
import { getFullWidth } from "../abstarctView/addWorkstepAbstractView";
import { addTaskAPI } from "../CommonAPICall/AddTask";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxUtils = mxgraphobj.mxUtils;
const mxEvent = mxgraphobj.mxEvent;
const mxEventObject = mxgraphobj.mxEventObject;
const mxToolbar = mxgraphobj.mxToolbar;
const mxGeometry = mxgraphobj.mxGeometry;
const mxRectangle = mxgraphobj.mxRectangle;
const mxPoint = mxgraphobj.mxPoint;

let toDropOnGraph;

function addToolbarItem(graph, toolbar, prototype, image, props, translation) {
  //processData json
  let setProcessData = props.setProcessData;
  let setNewId = props.setNewId;
  let title = props.title;
  let isActivityPresent, isTaskPresent;
  let isExpandedProcessPresent;
  let mileStoneWidthIncreasedFlag = false;
  let laneHeightIncreasedFlag = false;
  let mileStoneInfo = {};
  let lanesInfo = {};
  let { caseEnabled } = props;

  //to show preview with same size of activity in graph
  let div = document.createElement("div");
  if (defaultShapeVertex.includes(prototype.getStyle())) {
    div.setAttribute(
      "style",
      `width: ${widthForDefaultVertex}px; height:${heightForDefaultVertex}px; border:1px dotted black;`
    );
  } else {
    div.setAttribute(
      "style",
      `width: ${gridSize}px; height:${gridSize}px; border:1px dotted black;`
    );
  }
  let icon = document.createElement("img");
  icon.src = image;
  icon.style.width = "16px";
  icon.style.height = "16px";
  div.appendChild(icon);

  // Function that is executed when the image is dropped on the graph.
  // The cell argument points to the cell under the mousepointer if there is one.
  toDropOnGraph = function (graph, evt, cell, x, y, cellToDrop) {
    let activityType = props.activityType;
    let activitySubType = props.activitySubType;
    title = prototype.value;
    graph.stopEditing(false);
    let mileAtXY = getMilestoneAt(x, y, null, graph);
    let swimlaneAtXY = getSwimlaneAt(x, y, null, graph, AddVertexType);
    let tasklaneAtXY = getTasklaneAt(x, y, null, graph, AddVertexType);
    if (
      prototype.getStyle() !== style.taskTemplate &&
      prototype.getStyle() !== style.newTask &&
      prototype.getStyle() !== style.processTask &&
      (mileAtXY === null || swimlaneAtXY === null)
    ) {
      return;
    }
    if (
      isExpandedProcessPresent !== null &&
      isActivityPresent &&
      !isActivityPresent.style.includes(style.subProcess)
    ) {
      return;
    }
    if (isExpandedProcessPresent === null && isActivityPresent !== null) {
      return;
    }
    if (
      (prototype.getStyle() === style.taskTemplate ||
        prototype.getStyle() === style.newTask ||
        prototype.getStyle() === style.processTask) &&
      (tasklaneAtXY === null || isTaskPresent)
    ) {
      return;
    }
    if (dropDirectltyToGraphGlobally(prototype.getStyle())) {
      let xLeftLoc = x - gridStartPoint.x;
      let yTopLoc = y - gridStartPoint.y;

      let vertexStyle = prototype.getStyle();
      //groupBox will be visually inside milestone
      if (vertexStyle === style.groupBox && swimlaneAtXY !== null) {
        let groupBoxId = 0;
        setNewId((oldIds) => {
          groupBoxId = oldIds.groupBoxId + 1;
          return { ...oldIds, groupBoxId: groupBoxId };
        });

        setProcessData((oldProcessData) => {
          //deep copy instead of shallow copy
          let newProcessData = { ...oldProcessData };
          newProcessData.GroupBoxes = [...oldProcessData.GroupBoxes];

          newProcessData.GroupBoxes.push({
            GroupBoxId: groupBoxId,
            GroupBoxWidth: cellSize.w,
            GroupBoxHeight: cellSize.h,
            ITop: yTopLoc,
            ILeft: xLeftLoc,
            BlockName: title,
            LaneId: parseInt(swimlaneAtXY.getId()),
          });

          return newProcessData;
        });
      } else if (vertexStyle === style.textAnnotations) {
        let annotationId = 0;
        setNewId((oldIds) => {
          annotationId = oldIds.annotationId + 1;
          return { ...oldIds, annotationId: annotationId };
        });

        setProcessData((oldProcessData) => {
          let newProcessData = { ...oldProcessData };
          newProcessData.Annotations = [...oldProcessData.Annotations];
          newProcessData.Annotations.push({
            AnnotationId: annotationId,
            xLeftLoc: xLeftLoc,
            yTopLoc: yTopLoc,
            Height: cellSize.h,
            Width: cellSize.w,
            Comment: title,
            LaneId: swimlaneAtXY ? parseInt(swimlaneAtXY.getId()) : 0,
          });

          return newProcessData;
        });
      } else if (vertexStyle === style.message) {
        let messageId = 0;
        setNewId((oldIds) => {
          messageId = oldIds.messageId + 1;
          return { ...oldIds, messageId: messageId };
        });

        setProcessData((oldProcessData) => {
          let newProcessData = { ...oldProcessData };
          newProcessData.MSGAFS = [...oldProcessData.MSGAFS];

          newProcessData.MSGAFS.push({
            MsgAFId: messageId,
            xLeftLoc: xLeftLoc,
            yTopLoc: yTopLoc,
            MsgAFName: title,
            LaneId: swimlaneAtXY ? parseInt(swimlaneAtXY.getId()) : 0,
          });

          return newProcessData;
        });
      } else if (vertexStyle === style.dataObject) {
        let dataObjectId = 0;
        setNewId((oldIds) => {
          dataObjectId = oldIds.dataObjectId + 1;
          return { ...oldIds, dataObjectId: dataObjectId };
        });

        setProcessData((oldProcessData) => {
          let newProcessData = { ...oldProcessData };
          newProcessData.DataObjects = [...oldProcessData.DataObjects];

          newProcessData.DataObjects.push({
            DataObjectId: dataObjectId,
            xLeftLoc: xLeftLoc,
            yTopLoc: yTopLoc,
            Data: title,
            LaneId: swimlaneAtXY ? parseInt(swimlaneAtXY.getId()) : 0,
          });

          return newProcessData;
        });
      }
    }
    // to add tasks in tasklane
    else if (
      (prototype.getStyle() === style.taskTemplate ||
        prototype.getStyle() === style.newTask ||
        prototype.getStyle() === style.processTask) &&
      swimlaneAtXY.style === style.tasklane &&
      swimlaneAtXY !== null
    ) {
      let parentCell = swimlaneAtXY;
      let vertexX = x - parentCell.geometry.x;
      let vertexY = y - parentCell.geometry.y;
      let newHeight = Math.max(
        parentCell.geometry.height,
        vertexY + heightForDefaultVertex + gridSize
      );
      let newWidth = Math.max(
        parentCell.geometry.width,
        vertexX + widthForDefaultVertex + gridSize
      );
      let mileWidth = swimlaneTitleWidth;
      let maxId = 0;
      let processDefId;
      setProcessData((prevProcessData) => {
        let newProcessData = { ...prevProcessData };
        processDefId = newProcessData.ProcessDefId;
        for (let i of newProcessData.Tasks) {
          if (maxId < +i.TaskId) {
            maxId = +i.TaskId;
          }
        }
        newProcessData.MileStones?.forEach((mile) => {
          mileWidth = mileWidth + +mile.Width;
        });
        newProcessData.Tasks.push({
          CheckedOut: "N",
          Description: "",
          Goal: "",
          Instructions: "",
          NotifyEmail: "N",
          Repeatable: "N",
          TaskId: maxId + 1,
          TaskName: `${title}_${maxId + 1}`,
          TaskType: "Generic",
          TemplateId: -1,
          isActive: "true",
          xLeftLoc: vertexX,
          yTopLoc: vertexY,
        });
        newProcessData.Lanes[0].oldHeight = newProcessData.Lanes[0].Height + "";
        newProcessData.Lanes[0].oldWidth = mileWidth + "";
        //change height of tasklane , if drop is near boundary
        if (+newHeight !== +parentCell.geometry.height) {
          laneHeightIncreasedFlag = true;
          newProcessData.Lanes[0].Height = newHeight + "";
        }
        if (+newWidth !== +mileWidth) {
          laneHeightIncreasedFlag = true;
          newProcessData.Lanes[0].Width = newWidth + "";
          let lastMileWidth =
            +newProcessData.MileStones[newProcessData.MileStones?.length - 1]
              .Width;
          newProcessData.MileStones[
            newProcessData.MileStones?.length - 1
          ].Width = lastMileWidth + +newWidth - +mileWidth;
        }
        if (laneHeightIncreasedFlag) {
          lanesInfo = {
            pMSwimlaneInfo: {
              laneId: newProcessData.Lanes[0].LaneId,
              laneName: newProcessData.Lanes[0].LaneName,
              laneSeqId: newProcessData.Lanes[0].LaneSeqId,
              height: newProcessData.Lanes[0].Height,
              oldHeight: newProcessData.Lanes[0].oldHeight,
              width: newProcessData.Lanes[0].Width + "",
              oldWidth: newProcessData.Lanes[0].oldWidth + "",
            },
          };
        }
        return newProcessData;
      });
      addTaskAPI(
        maxId + 1,
        `${title}_${maxId + 1}`,
        prototype.getStyle() === style.processTask ? 2 : 1, //taskType value for global/new task = 1, for process task = 2
        vertexX,
        vertexY,
        setProcessData,
        processDefId,
        null,
        null,
        "",
        -1,
        laneHeightIncreasedFlag ? lanesInfo : null,
        "BPMN"
      );
    }
    // to add activity on graph, expanded Embedded subprocess is present on graph
    else if (
      mileAtXY !== null &&
      isExpandedProcessPresent !== null &&
      prototype.getStyle() !== style.taskTemplate &&
      prototype.getStyle() !== style.newTask &&
      prototype.getStyle() !== style.processTask
    ) {
      let parentCell = isExpandedProcessPresent;
      let vertexX = x - parentCell.geometry.x;
      let vertexY = y - parentCell.geometry.y;
      let mileId = parseInt(mileAtXY.getId());
      //if drop is near border, stretch border so that the vertex is completely inside
      //milestone/swimlane
      let newActivityId = 0;
      let processDefId, processName;
      let parentActivity,
        MaxseqId = 0,
        queueInfo,
        mileIndex,
        newProcessData;
      setNewId((oldIds) => {
        newActivityId = oldIds.activityId + 1;
        return { ...oldIds, activityId: newActivityId };
      });
      setProcessData((prevProcessData) => {
        newProcessData = { ...prevProcessData };
        newProcessData.MileStones?.forEach((mile) => {
          mile.Activities?.forEach((act) => {
            if (
              +act.ActivityType === 41 &&
              +act.ActivitySubType === 1 &&
              act.hide
            ) {
              parentActivity = act;
            }
          });
        });
        return newProcessData;
      });
      queueInfo = getActivityQueueObj(
        setNewId,
        activityType,
        activitySubType,
        title + "_" + newActivityId,
        newProcessData,
        parentActivity.LaneId,
        translation
      );
      processDefId = newProcessData.ProcessDefId;
      processName = newProcessData.ProcessName;

      setProcessData((prevProcessData) => {
        let newData = { ...prevProcessData };
        newData.MileStones?.forEach((milestone, index) => {
          if (milestone.iMileStoneId === mileId) {
            milestone.Activities?.forEach((activity) => {
              if (+activity.SequenceId > +MaxseqId) {
                MaxseqId = activity.SequenceId;
              }
              if (
                +activity.ActivityType === 41 &&
                +activity.ActivitySubType === 1
              ) {
                activity.EmbeddedActivity[0]?.forEach((embAct) => {
                  if (+embAct.SequenceId > +MaxseqId) {
                    MaxseqId = embAct.SequenceId;
                  }
                });
              }
            });
          }
        });
        //assumption that each milestone have unique iMilestoneId
        newData.MileStones?.forEach((milestone, index) => {
          if (milestone.iMileStoneId === mileId) {
            mileIndex = index;
            milestone.Activities?.forEach((activity, actIndex) => {
              if (
                +activity.ActivityType === 41 &&
                +activity.ActivitySubType === 1 &&
                activity.hide
              ) {
                newData.MileStones[index].Activities[
                  actIndex
                ].EmbeddedActivity[0] = [
                  ...newData.MileStones[index].Activities[actIndex]
                    .EmbeddedActivity[0],
                  {
                    xLeftLoc: vertexX,
                    yTopLoc: vertexY,
                    ActivityType: activityType,
                    ActivitySubType: activitySubType,
                    ActivityId: newActivityId,
                    ActivityName: title + "_" + newActivityId,
                    LaneId: activity.LaneId,
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
                  },
                ];
                // code to remove redundant or same activities added in embedded subprocess
                newData.MileStones[index].Activities[
                  actIndex
                ].EmbeddedActivity[0] = [
                  ...new Map(
                    newData.MileStones[index].Activities[
                      actIndex
                    ].EmbeddedActivity[0].map((v) => [v.ActivityId, v])
                  ).values(),
                ];
              }
            });
          }
        });
        return newData;
      });
      prototype.geometry.x = dimensionInMultipleOfGridSize(vertexX);
      prototype.geometry.y = dimensionInMultipleOfGridSize(vertexY);
      if (defaultShapeVertex.includes(prototype.getStyle())) {
        prototype.geometry.width = widthForDefaultVertex;
        prototype.geometry.height = heightForDefaultVertex;
      } else {
        prototype.geometry.width = gridSize;
        prototype.geometry.height = gridSize;
      }
      parentCell.insert(prototype);
      prototype.edges = [];
      prototype.title = title + "_" + newActivityId;
      prototype.id = newActivityId;
      graph.setSelectionCell(prototype);
      graph.fireEvent(new mxEventObject("cellsInserted", "cells", prototype));
      AddActivityInSubprocess(
        processDefId,
        processName,
        {
          name: title + `_` + newActivityId,
          id: newActivityId,
          actType: activityType,
          actSubType: activitySubType,
          actAssocId: 0,
          seqId: +MaxseqId,
          laneId: parentActivity.LaneId,
          blockId: 0,
          queueInfo: queueInfo,
          xLeftLoc: vertexX,
          yTopLoc: vertexY,
          view: "BPMN",
        },
        { mileId: mileId, mileIndex: mileIndex },
        parentActivity.ActivityId
      );
      return true;
    }
    // to add activity in swimlane
    else if (
      mileAtXY !== null &&
      graph.isSwimlane(prototype) === false &&
      prototype.getStyle() !== style.taskTemplate &&
      prototype.getStyle() !== style.newTask &&
      prototype.getStyle() !== style.processTask
    ) {
      let parentCell = swimlaneAtXY;
      let vertexX = x - mileAtXY.geometry.x + gridSize;
      let vertexY = y - parentCell.geometry.y;
      let parentCellId = parseInt(parentCell.getId());
      let mileId = parseInt(mileAtXY.getId());
      //if drop is near border, stretch border so that the vertex is completely
      //inside milestone/swimlane
      let newWidth = Math.max(
        mileAtXY.geometry.width,
        vertexX +
          (defaultShapeVertex.includes(prototype.getStyle())
            ? widthForDefaultVertex
            : cellSize.w)
      );

      let newHeight = Math.max(
        parentCell.geometry.height,
        y -
          swimlaneAtXY.geometry.y +
          (defaultShapeVertex.includes(prototype.getStyle())
            ? heightForDefaultVertex + gridSize
            : cellSize.h + gridSize)
      );
      let newActivityId = 0;
      let processDefId, processName;
      let mileIndex,
        MaxseqId = 0,
        queueInfo,
        startQueueObj,
        newProcessData,
        mileWidth = 0;
      let laneHeight = milestoneTitleWidth;
      let isLaneFound = false;
      setNewId((oldIds) => {
        newActivityId = oldIds.activityId + 1;
        return { ...oldIds, activityId: newActivityId };
      });
      setProcessData((prevProcessData) => {
        newProcessData = { ...prevProcessData };
        return prevProcessData;
      });
      queueInfo = getActivityQueueObj(
        setNewId,
        activityType,
        activitySubType,
        title + "_" + newActivityId,
        newProcessData,
        parentCellId,
        translation
      );
      if (+activityType === 41 && +activitySubType === 1) {
        startQueueObj = getActivityQueueObj(
          setNewId,
          1,
          1,
          translation(startEvent.title) + "_" + (newActivityId + 1),
          newProcessData,
          parentCellId,
          translation
        );
      }
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
                  ActivityName: title + "_" + newActivityId,
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
                  EmbeddedActivity: [
                    [
                      {
                        ActivityId: newActivityId + 1,
                        ActivityName:
                          translation(startEvent.title) +
                          "_" +
                          (newActivityId + 1),
                        ActivityType: 1,
                        ActivitySubType: 1,
                        LaneId: parentCellId,
                        xLeftLoc: 6 * graphGridSize,
                        yTopLoc: 6 * graphGridSize,
                        isActive: "true",
                        BlockId: 0,
                        CheckedOut: "",
                        Color: "1234",
                        FromRegistered: "N",
                        QueueCategory: "",
                        QueueId: startQueueObj.queueId,
                        SequenceId: +MaxseqId + 2,
                        id: "",
                        AssociatedTasks: [],
                      },
                      {
                        ActivityId: newActivityId + 2,
                        ActivityName:
                          translation(endEvent.title) +
                          "_" +
                          (newActivityId + 2),
                        ActivityType: 2,
                        ActivitySubType: 1,
                        LaneId: parentCellId,
                        xLeftLoc: 26 * graphGridSize,
                        yTopLoc: 6 * graphGridSize,
                        isActive: "true",
                        BlockId: 0,
                        CheckedOut: "",
                        Color: "1234",
                        FromRegistered: "N",
                        QueueCategory: "",
                        QueueId: 0,
                        SequenceId: +MaxseqId + 3,
                        id: "",
                        AssociatedTasks: [],
                      },
                    ],
                  ],
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
                  ActivityName: title + "_" + newActivityId,
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

      prototype.geometry.x =
        dimensionInMultipleOfGridSize(x) - swimlaneTitleWidth;
      prototype.geometry.y = dimensionInMultipleOfGridSize(vertexY);
      if (defaultShapeVertex.includes(prototype.getStyle())) {
        prototype.geometry.width = widthForDefaultVertex;
        prototype.geometry.height = heightForDefaultVertex;
      } else {
        prototype.geometry.width = gridSize;
        prototype.geometry.height = gridSize;
      }
      parentCell.insert(prototype);
      prototype.id = newActivityId;
      graph.setSelectionCell(prototype);
      graph.fireEvent(new mxEventObject("cellsInserted", "cells", prototype));
      if (+activityType === 41 && +activitySubType === 1) {
        AddEmbeddedActivity(
          processDefId,
          processName,
          {
            name: title + `_` + newActivityId,
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
          [
            {
              processDefId: processDefId,
              processName: processName,
              actName:
                translation(startEvent.title) + "_" + (newActivityId + 1),
              actId: +newActivityId + 1,
              actType: 1,
              actSubType: 1,
              actAssocId: 0,
              seqId: +MaxseqId + 2,
              laneId: parentCellId,
              blockId: 0,
              queueId: startQueueObj.queueId,
              queueInfo: startQueueObj,
              queueExist: false,
              xLeftLoc: 6 * graphGridSize,
              yTopLoc: 6 * graphGridSize,
              milestoneId: mileId,
              parentActivityId: +newActivityId,
            },
            {
              processDefId: processDefId,
              processName: processName,
              actName: translation(endEvent.title) + "_" + (newActivityId + 2),
              actId: +newActivityId + 2,
              actType: 2,
              actSubType: 1,
              actAssocId: 0,
              seqId: +MaxseqId + 3,
              laneId: parentCellId,
              blockId: 0,
              queueId: 0,
              queueInfo: { queueId: 0 },
              queueExist: false,
              xLeftLoc: 26 * graphGridSize,
              yTopLoc: 6 * graphGridSize,
              milestoneId: mileId,
              parentActivityId: +newActivityId,
            },
          ],
          mileStoneWidthIncreasedFlag ? mileStoneInfo : null,
          laneHeightIncreasedFlag ? lanesInfo : null
        );
      } else {
        AddActivity(
          processDefId,
          processName,
          {
            name: title + `_` + newActivityId,
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
          mileStoneWidthIncreasedFlag ? mileStoneInfo : null,
          laneHeightIncreasedFlag ? lanesInfo : null
        );
      }
      return true;
    }
    graph.setSelectionCell(prototype);
    return false;
  };

  // Creates the image which is used as the drag icon (preview)
  var img = toolbar.addMode(title, image, function (evt, cell) {
    var pt = this.graph.getPointForEvent(evt);
    toDropOnGraph(graph, evt, cell, pt.x, pt.y);
  });

  // This listener is always called first before any other listener
  // in all browsers.
  mxEvent.addListener(img, "mousedown", function (evt) {
    if (img.enabled === false) {
      mxEvent.consume(evt);
    }
  });

  //adds drag and drop feature to toolbox
  let dragSource = mxUtils.makeDraggable(
    toolbar.container.parentElement,
    graph,
    toDropOnGraph,
    div,
    null,
    null,
    graph.autoScroll,
    true
  );
  //overwrite function to show disableIcon if current point is not inside milestone
  dragSource.dragOver = function (graph, evt) {
    var offset = mxUtils.getOffset(graph.container);
    var origin = mxUtils.getScrollOrigin(graph.container);
    var x = mxEvent.getClientX(evt) - offset.x + origin.x - graph.panDx;
    var y = mxEvent.getClientY(evt) - offset.y + origin.y - graph.panDy;

    if (graph.autoScroll && (this.autoscroll == null || this.autoscroll)) {
      graph.scrollPointToVisible(x, y, graph.autoExtend);
    }
    // Highlights the drop target under the mouse
    if (this.currentHighlight != null && graph.isDropEnabled()) {
      this.currentDropTarget = this.getDropTarget(graph, x, y, evt);
      var state = graph.getView().getState(this.currentDropTarget);
      this.currentHighlight.highlight(state);
    }

    let width = this.previewElement.style.width.replace("px", "");
    let height = this.previewElement.style.height.replace("px", "");
    let isSwimlanePresent = getSwimlaneAt(x, y, null, graph, AddVertexType);
    let isTasklanePresent = getTasklaneAt(x, y, null, graph, AddVertexType);
    isActivityPresent = getActivityAt(
      x,
      y,
      isSwimlanePresent,
      graph,
      width,
      height,
      null
    );
    isTaskPresent = getTaskAt(
      x,
      y,
      isTasklanePresent,
      graph,
      width,
      height,
      null
    );
    isExpandedProcessPresent = getExpandedSubprocess(x, y, null, graph);
    // Updates the location of the preview
    if (this.previewElement != null) {
      if (
        prototype.getStyle() === style.taskTemplate ||
        prototype.getStyle() === style.newTask ||
        prototype.getStyle() === style.processTask
      ) {
        if (isTasklanePresent === null) {
          this.previewElement.children[0].src = disabledIcon;
        } else {
          if (isTaskPresent) {
            this.previewElement.children[0].src = disabledIcon;
          } else {
            this.previewElement.children[0].src = image;
            this.previewElement.style.border = "1px dotted black";
          }
        }
      } else if (
        prototype.getStyle() !== style.taskTemplate &&
        prototype.getStyle() !== style.newTask &&
        prototype.getStyle() !== style.processTask
      ) {
        let isMilestonePresent = getMilestoneAt(x, y, null, graph);
        //here if the currentPoint is not inside milestone then disabled icon is displayed
        if (isMilestonePresent === null) {
          if (!isAllowedOutsideMilestone(prototype.getStyle())) {
            this.previewElement.children[0].src = disabledIcon;
          }
        } else if (isMilestonePresent !== null) {
          if (isSwimlanePresent === null) {
            this.previewElement.children[0].src = disabledIcon;
            this.previewElement.style.border = "1px dotted black";
          } else if (isActivityPresent) {
            if (isExpandedProcessPresent) {
              this.previewElement.children[0].src = image;
              this.previewElement.style.border = "1px dotted black";
            } else {
              this.previewElement.children[0].src = disabledIcon;
              this.previewElement.style.border = "1px dotted black";
            }
          } else {
            this.previewElement.children[0].src = image;
            this.previewElement.style.border = "1px dotted black";
          }
        }
      }

      if (this.previewElement.parentNode == null) {
        graph.container.appendChild(this.previewElement);
        this.previewElement.style.zIndex = "3";
        this.previewElement.style.position = "absolute";
      }

      var gridEnabled = this.isGridEnabled() && graph.isGridEnabledEvent(evt);
      var hideGuide = true;

      // Grid and guides
      if (
        this.currentGuide != null &&
        this.currentGuide.isEnabledForEvent(evt)
      ) {
        // LATER: HTML preview appears smaller than SVG preview
        var w = parseInt(this.previewElement.style.width);
        var h = parseInt(this.previewElement.style.height);
        var bounds = new mxRectangle(0, 0, w, h);
        var delta = new mxPoint(x, y);
        delta = this.currentGuide.move(bounds, delta, gridEnabled, true);
        hideGuide = false;
        x = delta.x;
        y = delta.y;
      } else if (gridEnabled) {
        var scale = graph.view.scale;
        var tr = graph.view.translate;
        var off = graph.gridSize / 2;
        x = (graph.snap(x / scale - tr.x - off) + tr.x) * scale;
        y = (graph.snap(y / scale - tr.y - off) + tr.y) * scale;
      }

      if (this.currentGuide != null && hideGuide) {
        this.currentGuide.hide();
      }
      if (this.previewOffset != null) {
        x += this.previewOffset.x;
        y += this.previewOffset.y;
      }

      this.previewElement.style.left = Math.round(x) + "px";
      this.previewElement.style.top = Math.round(y) + "px";
      this.previewElement.style.visibility = "visible";
    }

    this.currentPoint = new mxPoint(x, y);
  };

  return img;
}

export function addVertexFromToolbox(props, toolRef, translation) {
  var w = cellSize.w;
  var h = cellSize.h;
  var graph = props.graph;
  var vertexStyle = props.styleGraph;
  var title = props.title;
  var icon = props.icon;

  var toolbar = new mxToolbar(toolRef);
  toolbar.enabled = false;

  var vertex = new mxgraphobj.mxCell(
    title,
    new mxGeometry(0, 0, w, h),
    vertexStyle
  );
  vertex.setVertex(true);
  var img = addToolbarItem(graph, toolbar, vertex, icon, props, translation);
  img.enabled = true;

  graph.getSelectionModel().addListener(mxEvent.CHANGE, function () {
    var tmp = graph.isSelectionEmpty();
    mxUtils.setOpacity(img, tmp ? 100 : 20);
    img.enabled = tmp;
  });

  return toolbar;
}
