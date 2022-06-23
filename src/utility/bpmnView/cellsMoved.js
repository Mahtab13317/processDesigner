import { getMilestoneAt } from "./getMilestoneAt";
import { isAllowedOutsideMilestone } from "./dropOutsideMilestone";
import disabledIcon from "../../assets/bpmnView/cancelIcon.png";
import {
  graphGridSize,
  gridStartPoint,
  style,
  gridSize,
  cellSize,
  swimlaneTitleWidth,
  milestoneTitleWidth,
  defaultShapeVertex,
  widthForDefaultVertex,
  heightForDefaultVertex,
  MoveVertexType,
} from "../../Constants/bpmnView";
import { getSwimlaneAt, getTasklaneAt } from "./getSwimlaneAt";
import { getActivityAt, getTaskAt } from "./getActivityAt";
import { dimensionInMultipleOfGridSize } from "./drawOnGraph";
import axios from "axios";
import {
  SERVER_URL,
  ENDPOINT_MOVEACTIVITY,
  ENDPOINT_UPDATE_ACTIVITY,
} from "../../Constants/appConstants";
import { getExpandedSubprocess } from "./getExpandedSubprocess";
import { getFullWidth } from "../abstarctView/addWorkstepAbstractView";
import { MoveTask } from "../CommonAPICall/MoveTask";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxUtils = mxgraphobj.mxUtils;
const mxConstants = mxgraphobj.mxEvent;
const mxPoint = mxgraphobj.mxPoint;
const mxEvent = mxgraphobj.mxEvent;

export const cellRepositioned = (graph, setProcessData, caseEnabled) => {
  let targetMilestone;
  let targetSwimlane;
  let targetTasklane;
  let isActivityPresent;
  let isTasklanePresent;
  let isTaskPresent;
  let isExpandedProcessPresent;
  let leftPos, topPos;

  //to show preview with same size of activity in graph
  let div = document.createElement("div");
  div.setAttribute(
    "style",
    `border:1px dotted black;position:absolute;z-index:1;display:none;`
  );
  //dragElement to be used inside mouseMove function, if a cell is selected
  let dragElement = document.createElement("img");
  dragElement.style.width = "16px";
  dragElement.style.height = "16px";
  div.appendChild(dragElement);
  graph.container.appendChild(div);

  //overwrites the cellsMoved function,to update state for activities with its new position
  graph.translateCell = function (cell, dx, dy) {
    let laneHeightIncreasedFlag = false;
    let mileWidthIncreased = false;
    var geo = graph.model.getGeometry(cell);
    //do not translate for swimlane / milestone and edges
    if (
      graph.model.isEdge(cell) ||
      cell.style.includes(style.swimlane) ||
      cell.style === style.tasklane ||
      cell.style.includes(style.swimlane_collapsed) ||
      cell.style === style.tasklane_collapsed ||
      cell.style === style.milestone ||
      cell.style === "layer" ||
      cell.style === style.expandedEmbeddedProcess
    ) {
      return;
    }

    if (geo != null) {
      dx = parseFloat(dx);
      // dy = parseFloat(dy);
      geo = geo.clone();
      geo.translate(dx, dy);
      if (
        !geo.relative &&
        graph.model.isVertex(cell) &&
        !graph.isAllowNegativeCoordinates()
      ) {
        geo.x = Math.max(0, parseFloat(geo.x));
        geo.y = Math.max(0, parseFloat(geo.y));
      }

      if (geo.relative && !graph.model.isEdge(cell)) {
        var parent = graph.model.getParent(cell);
        var angle = 0;
        if (graph.model.isVertex(parent)) {
          let currentCellStyle = graph.getCurrentCellStyle(parent);
          angle = mxUtils.getValue(
            currentCellStyle,
            mxConstants.STYLE_ROTATION,
            0
          );
        }
        if (angle != 0) {
          var rad = mxUtils.toRadians(-angle);
          var cos = Math.cos(rad);
          var sin = Math.sin(rad);
          var pt = mxUtils.getRotatedPoint(
            new mxPoint(dx, dy),
            cos,
            sin,
            new mxPoint(0, 0)
          );
          dx = pt.x;
          dy = pt.y;
        }
        if (geo.offset == null) {
          geo.offset = new mxPoint(dx, dy);
        } else {
          geo.offset.x = parseFloat(geo.offset.x) + dx;
          geo.offset.y = parseFloat(geo.offset.y) + dy;
        }
      }

      let milestoneId, prevLaneId, xLeftLoc, yTopLoc;
      let xPos = leftPos;
      let yPos = topPos;
      //update the state as per the new geometry of cell
      setProcessData((prevProcessData) => {
        let newProcessData = JSON.parse(JSON.stringify(prevProcessData));
        let cellStyle = cell.getStyle();
        if (cellStyle === style.dataObject) {
          newProcessData.DataObjects = [...prevProcessData.DataObjects];
          for (let itr of newProcessData.DataObjects) {
            if (itr.DataObjectId === parseInt(cell.getId())) {
              //update x and y location value when id matches
              itr.yTopLoc = geo.y - gridStartPoint.y + "";
              itr.xLeftLoc = geo.x - gridStartPoint.x + "";
              break;
            }
          }
        } else if (cellStyle === style.message) {
          newProcessData.MSGAFS = [...prevProcessData.MSGAFS];
          for (let itr of newProcessData.MSGAFS) {
            if (itr.MsgAFId === parseInt(cell.getId())) {
              //update x and y location value when id matches
              itr.yTopLoc = geo.y - gridStartPoint.y + "";
              itr.xLeftLoc = geo.x - gridStartPoint.x + "";
              break;
            }
          }
        } else if (cellStyle === style.textAnnotations) {
          newProcessData.Annotations = [...prevProcessData.Annotations];
          for (let itr of newProcessData.Annotations) {
            if (itr.AnnotationId === parseInt(cell.getId())) {
              //update x and y location value when id matches
              itr.yTopLoc = geo.y - gridStartPoint.y + "";
              itr.xLeftLoc = geo.x - gridStartPoint.x + "";
              break;
            }
          }
        } else if (cellStyle === style.groupBox) {
          newProcessData.GroupBoxes = [...prevProcessData.GroupBoxes];
          for (let itr of newProcessData.GroupBoxes) {
            if (itr.GroupBoxId === parseInt(cell.getId())) {
              //update x and y location value when id matches
              itr.yTopLoc = geo.y - gridStartPoint.y + "";
              itr.xLeftLoc = geo.x - gridStartPoint.x + "";
              break;
            }
          }
        } else if (
          cellStyle === style.taskTemplate ||
          cellStyle === style.newTask ||
          cellStyle === style.processTask
        ) {
          // code added for Bug 110259
          let parentCell = getTasklaneAt(
            xPos - gridStartPoint.x,
            yPos,
            null,
            graph,
            MoveVertexType
          );
          let lanesInfo = {};
          let mileWidth = swimlaneTitleWidth;
          let newHeight = Math.max(
            parentCell.geometry.height,
            yPos + heightForDefaultVertex + gridSize
          );
          let newWidth = Math.max(
            parentCell.geometry.width,
            xPos - gridStartPoint.x + widthForDefaultVertex + gridSize
          );
          newProcessData.MileStones?.forEach((mile) => {
            mileWidth = mileWidth + +mile.Width;
          });
          newProcessData.Tasks = [...prevProcessData.Tasks];
          for (let itr of newProcessData.Tasks) {
            if (itr.TaskId === parseInt(cell.getId())) {
              //update x and y location value when id matches
              itr.yTopLoc = yPos + "";
              itr.xLeftLoc = xPos - gridStartPoint.x + "";
              break;
            }
          }
          newProcessData.Lanes[0].oldHeight =
            newProcessData.Lanes[0].Height + "";
          newProcessData.Lanes[0].oldWidth = mileWidth + "";
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
          MoveTask(
            newProcessData.ProcessDefId,
            cell.getId(),
            cell.value,
            xPos - gridStartPoint.x,
            yPos,
            laneHeightIncreasedFlag ? lanesInfo : null
          );
        } else if (
          cellStyle !== style.taskTemplate &&
          cellStyle !== style.newTask &&
          cellStyle !== style.processTask
        ) {
          let swimlaneAtXY = getSwimlaneAt(
            leftPos,
            topPos,
            null,
            graph,
            MoveVertexType
          );
          let mileAtXY = getMilestoneAt(leftPos, topPos, null, graph);
          let vertexX = leftPos - mileAtXY.geometry.x + gridSize;
          let newWidth = Math.max(
            mileAtXY.geometry.width,
            vertexX +
              (defaultShapeVertex.includes(cell.getStyle())
                ? widthForDefaultVertex
                : cellSize.w)
          );
          let parentCellId = parseInt(swimlaneAtXY.getId());
          let newHeight = Math.max(
            swimlaneAtXY.geometry.height,
            topPos -
              swimlaneAtXY.geometry.y +
              (defaultShapeVertex.includes(cell.getStyle())
                ? heightForDefaultVertex + gridSize
                : cellSize.h + gridSize)
          );
          let embeddedSubActivity = false;
          //code to check whether the cell moved is sub activity of embedded subprocess or normal activity
          newProcessData.MileStones?.forEach((mile) => {
            mile.Activities?.forEach((activity) => {
              if (activity.ActivityId === Number(cell.getId())) {
                embeddedSubActivity = false;
              } else if (
                +activity.ActivityType === 41 &&
                +activity.ActivitySubType === 1
              ) {
                activity.EmbeddedActivity[0]?.forEach((embAct) => {
                  if (embAct.ActivityId === Number(cell.getId())) {
                    embeddedSubActivity = true;
                    prevLaneId = embAct.LaneId;
                    milestoneId = mile.iMileStoneId;
                  }
                });
              }
            });
          });
          //if cell is dropped on expanded embedded subprocess
          if (mileAtXY !== null && isExpandedProcessPresent !== null) {
            //if cell is dropped on expanded embedded subprocess and the cell moved is sub activity of
            //embedded subprocess
            if (embeddedSubActivity) {
              newProcessData.MileStones?.forEach((mile) => {
                mile.Activities?.forEach((activity) => {
                  if (
                    +activity.ActivityType === 41 &&
                    +activity.ActivitySubType === 1
                  ) {
                    activity.EmbeddedActivity[0]?.forEach((embAct) => {
                      if (embAct.ActivityId === Number(cell.getId())) {
                        embAct.yTopLoc =
                          yPos - isExpandedProcessPresent.geometry.y + "";
                        embAct.xLeftLoc =
                          xPos - isExpandedProcessPresent.geometry.x + "";
                        xLeftLoc = xPos - isExpandedProcessPresent.geometry.x;
                        yTopLoc = yPos - isExpandedProcessPresent.geometry.y;
                        cell.seqId = embAct.SequenceId;
                      }
                    });
                  }
                });
              });
              moveApiCall(
                newProcessData,
                prevLaneId,
                prevLaneId,
                milestoneId,
                milestoneId,
                cell,
                xLeftLoc,
                yTopLoc,
                laneHeightIncreasedFlag,
                mileWidthIncreased,
                true
              );
            }
            //if cell is dropped on expanded embedded subprocess and the cell moved is not sub
            //activity of embedded subprocess and a normal activity
            else {
              let activityIndex,
                mileIndex,
                localActivity,
                embeddedActIndex,
                embeddedMileIndex,
                newLaneId,
                parentId,
                prevMileId;
              let seqIdArray = [],
                seqId;
              newProcessData.MileStones?.forEach((mile, index) => {
                mile.Activities?.forEach((activity, indexAct) => {
                  if (activity.ActivityId === Number(cell.getId())) {
                    mileIndex = index;
                    activityIndex = indexAct;
                    localActivity = activity;
                    prevMileId = mile.iMileStoneId;
                  }
                  if (
                    +activity.ActivityType === 41 &&
                    +activity.ActivitySubType === 1 &&
                    activity.hide
                  ) {
                    embeddedActIndex = indexAct;
                    embeddedMileIndex = index;
                    newLaneId = activity.LaneId;
                    parentId = activity.ActivityId;
                    milestoneId = mile.iMileStoneId;
                  }
                });
              });
              newProcessData.MileStones?.forEach((mile) => {
                if (mile.iMileStoneId === milestoneId) {
                  mile.Activities?.forEach((act) => {
                    if (act.ActivityId !== Number(cell.getId())) {
                      seqIdArray.push(+act.SequenceId);
                      if (
                        +act.ActivityType === 41 &&
                        +act.ActivitySubType === 1
                      ) {
                        act.EmbeddedActivity[0]?.forEach((embAct) => {
                          if (embAct.ActivityId !== Number(cell.getId())) {
                            seqIdArray.push(+embAct.SequenceId);
                          }
                        });
                      }
                    }
                  });
                }
              });
              seqId = seqIdArray.length <= 0 ? 1 : Math.max(...seqIdArray) + 1;
              localActivity.yTopLoc =
                yPos - isExpandedProcessPresent.geometry.y + "";
              localActivity.xLeftLoc =
                xPos - isExpandedProcessPresent.geometry.x + "";
              localActivity.LaneId = newLaneId;
              localActivity.SequenceId = seqId;
              cell.seqId = seqId;
              newProcessData.MileStones[mileIndex].Activities.splice(
                activityIndex,
                1
              );
              embeddedActIndex =
                embeddedMileIndex === mileIndex &&
                embeddedActIndex > activityIndex
                  ? embeddedActIndex - 1
                  : embeddedActIndex;
              newProcessData.MileStones[embeddedMileIndex]?.Activities[
                embeddedActIndex
              ]?.EmbeddedActivity[0].push(localActivity);
              moveApiCall(
                newProcessData,
                prevLaneId,
                newLaneId,
                prevMileId,
                milestoneId,
                cell,
                localActivity.xLeftLoc,
                localActivity.yTopLoc,
                false,
                false,
                false,
                parentId
              );
            }
          }
          //if cell is dropped on graph and not outside milestones
          else {
            //if cell is dropped on milestones, outside expanded embedded subprocess and the cell moved
            //is sub activity of embedded subprocess
            if (embeddedSubActivity) {
              let mileWidth = 0;
              let laneHeight = milestoneTitleWidth;
              let activityIndex, embActIndex;
              let localActivity;
              let isLaneFound = false;
              let seqIdArray = [],
                seqId;

              newProcessData.MileStones?.forEach((mile) => {
                mile.Activities?.forEach((activity, indexAct) => {
                  if (
                    +activity.ActivityType === 41 &&
                    +activity.ActivitySubType === 1 &&
                    activity.hide
                  ) {
                    activity.EmbeddedActivity[0]?.forEach(
                      (embAct, embIndex) => {
                        if (embAct.ActivityId === Number(cell.getId())) {
                          //update x and y location value when id matches
                          activityIndex = indexAct;
                          localActivity = embAct;
                          embActIndex = embIndex;
                        }
                      }
                    );
                  }
                });
              });

              newProcessData.MileStones?.forEach((mile) => {
                if (milestoneId === mile.iMileStoneId) {
                  mile.Activities[activityIndex].EmbeddedActivity[0].splice(
                    embActIndex,
                    1
                  );
                }
                if (targetMilestone.id === mile.iMileStoneId) {
                  mile.Activities.push(localActivity);
                  mile.Activities.forEach((act) => {
                    if (act.ActivityId !== Number(cell.getId())) {
                      seqIdArray.push(+act.SequenceId);
                      if (
                        +act.ActivityType === 41 &&
                        +act.ActivitySubType === 1
                      ) {
                        act.EmbeddedActivity[0]?.forEach((embAct) => {
                          if (embAct.ActivityId !== Number(cell.getId())) {
                            seqIdArray.push(+embAct.SequenceId);
                          }
                        });
                      }
                    }
                  });
                }
              });

              seqId = seqIdArray.length <= 0 ? 1 : Math.max(...seqIdArray) + 1;
              newProcessData.Lanes?.forEach((lane) => {
                if (lane.LaneId === targetSwimlane.id) {
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
              newProcessData.MileStones?.forEach((mile, index) => {
                mile["oldWidth"] = mile.Width;
                if (mile.iMileStoneId === targetMilestone.id) {
                  if (newWidth != mile.Width) {
                    mileWidthIncreased = true;
                    newProcessData.MileStones[index] = { ...mile };
                    newProcessData.MileStones[index].Width = newWidth + "";
                  }
                }
                mile.Activities?.forEach((activity) => {
                  if (activity.ActivityId === Number(cell.getId())) {
                    //update x and y location value when id matches
                    xLeftLoc = xPos - gridStartPoint.x + "";
                    yTopLoc =
                      yPos - targetSwimlane.geometry.y + laneHeight + "";
                    activity.yTopLoc = yTopLoc + "";
                    activity.xLeftLoc =
                      xPos - mileWidth - gridStartPoint.x + "";
                    activity.LaneId = targetSwimlane.id;
                    activity.SequenceId = seqId;
                    cell.seqId = seqId;
                  }
                });
                mileWidth = mileWidth + +mile.Width;
              });

              newProcessData.Lanes = [...prevProcessData.Lanes];
              newProcessData.Lanes?.forEach((swimlane, index) => {
                swimlane["oldHeight"] = swimlane.Height;
                if (swimlane.LaneId === parentCellId) {
                  if (+newHeight !== +swimlaneAtXY.geometry.height) {
                    laneHeightIncreasedFlag = true;
                    newProcessData.Lanes[index].Height = newHeight + "";
                  }
                }
              });
              moveApiCall(
                newProcessData,
                prevLaneId,
                targetSwimlane.id,
                milestoneId,
                targetMilestone.id,
                cell,
                xLeftLoc,
                yTopLoc,
                laneHeightIncreasedFlag,
                mileWidthIncreased,
                false,
                0
              );
            }
            //if cell is dropped on milestones, outside expanded embedded subprocess and the
            //cell moved is normal activity
            else {
              let mileWidth = 0;
              let laneHeight = milestoneTitleWidth;
              let activityIndex;
              let localActivity;
              let isLaneFound = false;
              let seqIdArray = [],
                seqId;

              newProcessData.MileStones?.forEach((mile, index) => {
                mile.Activities?.forEach((activity, indexAct) => {
                  if (activity.ActivityId === Number(cell.getId())) {
                    //update x and y location value when id matches
                    milestoneId = mile.iMileStoneId;
                    activityIndex = indexAct;
                    localActivity = activity;
                  }
                });
              });
              if (milestoneId !== targetMilestone.id) {
                newProcessData.MileStones?.forEach((mile, index) => {
                  if (milestoneId === mile.iMileStoneId) {
                    mile.Activities.splice(activityIndex, 1);
                  } else if (targetMilestone.id === mile.iMileStoneId) {
                    mile.Activities.push(localActivity);
                    mile.Activities.forEach((act) => {
                      if (act.ActivityId !== Number(cell.getId())) {
                        seqIdArray.push(+act.SequenceId);
                        if (
                          +act.ActivityType === 41 &&
                          +act.ActivitySubType === 1
                        ) {
                          act.EmbeddedActivity[0]?.forEach((embAct) => {
                            if (embAct.ActivityId !== Number(cell.getId())) {
                              seqIdArray.push(+embAct.SequenceId);
                            }
                          });
                        }
                      }
                    });
                  }
                });
              }
              seqId = seqIdArray.length <= 0 ? 1 : Math.max(...seqIdArray) + 1;
              prevProcessData.Lanes?.forEach((lane) => {
                if (lane.LaneId === targetSwimlane.id) {
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
              newProcessData.MileStones?.forEach((mile, index) => {
                mile["oldWidth"] = mile.Width;
                if (mile.iMileStoneId === targetMilestone.id) {
                  if (+newWidth !== +mile.Width) {
                    mileWidthIncreased = true;
                    newProcessData.MileStones[index] = { ...mile };
                    newProcessData.MileStones[index].Width = newWidth + "";
                  }
                }
                mile.Activities?.forEach((activity) => {
                  if (activity.ActivityId === Number(cell.getId())) {
                    //update x and y location value when id matches
                    xLeftLoc = xPos - gridStartPoint.x + "";
                    yTopLoc =
                      yPos - targetSwimlane.geometry.y + laneHeight + "";
                    prevLaneId = activity.LaneId;
                    activity.yTopLoc = yTopLoc;
                    activity.xLeftLoc =
                      xPos - mileWidth - gridStartPoint.x + "";
                    activity.LaneId = targetSwimlane.id;
                    activity.SequenceId = seqId;
                    cell.seqId = seqId;
                  }
                });
                mileWidth = mileWidth + +mile.Width;
              });
              prevProcessData.Lanes?.forEach((swimlane, index) => {
                swimlane["oldHeight"] = swimlane.Height;
                if (swimlane.LaneId === parentCellId) {
                  if (+newHeight !== +swimlaneAtXY.geometry.height) {
                    laneHeightIncreasedFlag = true;
                    newProcessData.Lanes[index].Height = newHeight + "";
                  }
                }
              });

              moveApiCall(
                newProcessData,
                prevLaneId,
                targetSwimlane.id,
                milestoneId,
                targetMilestone.id,
                cell,
                xLeftLoc,
                yTopLoc,
                laneHeightIncreasedFlag,
                mileWidthIncreased,
                true
              );
            }
          }
        }
        return newProcessData;
      });
    }
  };

  const moveApiCall = (
    newProcess,
    prevLaneId,
    laneId,
    prevMilestoneId,
    milestoneId,
    cell,
    xLeftLoc,
    yTopLoc,
    laneHeightIncreasedFlag,
    mileWidthIncreased,
    actMovedInSameLayer,
    parentActivityId
  ) => {
    let processDefId, actName, actId, seqId;
    processDefId = newProcess.ProcessDefId;
    actId = Number(cell.getId());
    actName = cell.value;
    seqId = cell.seqId;
    let payload = {
      processDefId: processDefId,
      actName: actName,
      actId: actId,
      seqId: seqId,
      milestoneId: milestoneId,
      prevMilestoneId: prevMilestoneId,
      laneId: laneId,
      prevLaneId: prevLaneId,
      xLeftLoc: xLeftLoc,
      yTopLoc: yTopLoc,
    };

    if (!actMovedInSameLayer) {
      payload = { ...payload, parentActivityId };
    }
    if (laneHeightIncreasedFlag) {
      payload = {
        ...payload,
        arrLaneInfos: newProcess.Lanes.map((lane) => {
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
    if (mileWidthIncreased) {
      payload = {
        ...payload,
        arrMilestoneInfos: newProcess.MileStones.map((mile, index) => {
          return {
            milestoneId: mile.iMileStoneId,
            milestoneName: mile.MileStoneName,
            width: mile.Width,
            oldWidth: mile.oldWidth,
            activities: mile.Activities.map((act) => {
              return {
                actId: act.ActivityId,
                xLeftLoc: +getFullWidth(index, newProcess) + +act.xLeftLoc + "",
              };
            }),
          };
        }),
      };
    }

    axios
      .post(
        SERVER_URL +
          (actMovedInSameLayer
            ? ENDPOINT_MOVEACTIVITY
            : ENDPOINT_UPDATE_ACTIVITY),
        payload
      )
      .then((res) => {
        if (res.data.Status === 0) {
          return 0;
        }
      });
  };

  //overwrite the function to enable cell drop only inside milestone
  let moveCellsHandler = graph.graphHandler.moveCells.bind(graph.graphHandler);
  graph.graphHandler.moveCells = function (cells, dx, dy, clone, target, evt) {
    targetMilestone = getMilestoneAt(leftPos, topPos, null, graph);
    targetSwimlane = getSwimlaneAt(
      leftPos,
      topPos,
      null,
      graph,
      MoveVertexType
    );
    targetTasklane = getTasklaneAt(
      leftPos,
      topPos,
      null,
      graph,
      MoveVertexType
    );

    //restrict drag drop if dragged cell is swimlane
    for (let itr of cells) {
      if (
        itr.style.includes(style.swimlane) ||
        itr.style === style.tasklane ||
        itr.style.includes(style.swimlane_collapsed) ||
        itr.style === style.tasklane_collapsed ||
        itr.style === style.milestone ||
        itr.style === "layer" ||
        itr.style === style.expandedEmbeddedProcess
      ) {
        return;
      }
      //restrict the drop target
      if (
        itr.style === style.taskTemplate ||
        itr.style === style.newTask ||
        itr.style === style.processTask
      ) {
        if (
          targetTasklane === null ||
          targetTasklane === undefined ||
          isTaskPresent
        ) {
          return;
        }
      } else if (
        itr.style !== style.taskTemplate &&
        itr.style !== style.newTask &&
        itr.style !== style.processTask
      ) {
        if (targetMilestone === null || targetMilestone === undefined) {
          for (let itr of cells) {
            if (!isAllowedOutsideMilestone(itr.getStyle())) {
              return;
            }
          }
        }
      }
    }
    //restrict drag drop if activity is already present at drop coordinates
    if (targetSwimlane === null) {
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
    //same as defined in mxGraph library
    moveCellsHandler(cells, dx, dy, clone, targetSwimlane, evt);
  };

  let mouseMoveGraphHandler = graph.graphHandler.mouseMove.bind(
    graph.graphHandler
  );
  let dragOffset = { x: 0, y: 0 };
  graph.graphHandler.updatePreview = function (remote) {
    return null;
  };
  graph.graphHandler.scrollOnMove = false;

  graph.graphHandler.mouseMove = function (sender, me) {
    // set the dragElement
    // if inside milestone , show image, else show disable Icon
    if (this.cell !== null && this.cell !== undefined) {
      //milestones,swimlanes and tasklanes cannot be dragged and dropped
      if (
        this.cell.style.includes(style.swimlane) ||
        this.cell.style === style.tasklane ||
        this.cell.style.includes(style.swimlane_collapsed) ||
        this.cell.style === style.tasklane_collapsed ||
        this.cell.style === style.milestone ||
        this.cell.style === style.expandedEmbeddedProcess
      ) {
        div.style.display = "none";
        return;
      }
      let evt = me.getEvent();
      let offset = mxUtils.getOffset(graph.container);
      let origin = mxUtils.getScrollOrigin(graph.container);
      let x = mxEvent.getClientX(evt) - offset.x + origin.x - graph.panDx;
      let y = mxEvent.getClientY(evt) - offset.y + origin.y - graph.panDy;
      let imgSrc = graph
        .getStylesheet()
        .getCellStyle(this.cell.getStyle()).image;
      div.children[0].src = imgSrc;
      leftPos = dimensionInMultipleOfGridSize(x + dragOffset.x) - graphGridSize;
      div.style.left = leftPos + "px";
      topPos = dimensionInMultipleOfGridSize(y + dragOffset.y) - graphGridSize;
      div.style.top = topPos + "px";
      div.style.width = this.cell.geometry
        ? this.cell.geometry.width + "px"
        : "0px";
      div.style.height = this.cell.geometry
        ? this.cell.geometry.height + "px"
        : "0px";
      div.style.display = "block";
      let width = this.cell.geometry ? this.cell.geometry.width : null;
      let height = this.cell.geometry ? this.cell.geometry.height : null;
      let isSwimlanePresent = getSwimlaneAt(
        leftPos,
        topPos,
        null,
        graph,
        MoveVertexType
      );
      isActivityPresent = getActivityAt(
        leftPos,
        topPos,
        isSwimlanePresent,
        graph,
        width,
        height,
        this.cell.id
      );
      isTasklanePresent = getTasklaneAt(
        leftPos,
        topPos,
        null,
        graph,
        MoveVertexType
      );
      isTaskPresent = getTaskAt(
        leftPos,
        topPos,
        isTasklanePresent,
        graph,
        width,
        height,
        this.cell.id
      );
      isExpandedProcessPresent = getExpandedSubprocess(
        leftPos,
        topPos,
        null,
        graph
      );
      let isMilestonePresent = getMilestoneAt(leftPos, topPos, null, graph);
      if (
        this.cell.getStyle() === style.taskTemplate ||
        this.cell.getStyle() === style.newTask ||
        this.cell.getStyle() === style.processTask
      ) {
        if (isTasklanePresent === null) {
          div.children[0].src = disabledIcon;
        } else {
          if (isTaskPresent) {
            div.children[0].src = disabledIcon;
          } else {
            div.children[0].src = imgSrc;
            div.style.border = "1px dotted black";
          }
        }
      } else if (
        this.cell.getStyle() !== style.taskTemplate &&
        this.cell.getStyle() !== style.newTask &&
        this.cell.getStyle() !== style.processTask
      ) {
        if (isMilestonePresent === null) {
          //here if the currentPoint is not inside milestone then disabled icon is displayed
          if (!isAllowedOutsideMilestone(this.cell.getStyle())) {
            div.children[0].src = disabledIcon;
            // div.style.border = "none";
          }
        } else if (isMilestonePresent !== null) {
          if (isSwimlanePresent === null) {
            div.children[0].src = disabledIcon;
            // div.style.border = "none";
          } else if (isActivityPresent) {
            if (isExpandedProcessPresent) {
              div.children[0].src = imgSrc;
              div.style.border = "1px dotted black";
            } else {
              div.children[0].src = disabledIcon;
              div.style.border = "1px dotted black";
            }
          } else {
            div.children[0].src = imgSrc;
            div.style.border = "1px dotted black";
          }
        }
      }
    } else {
      div.style.display = "none";
    }
    mouseMoveGraphHandler(sender, me);
  };
};
