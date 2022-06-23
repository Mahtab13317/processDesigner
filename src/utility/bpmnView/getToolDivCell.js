import {
  gridSize,
  cellSize,
  defaultShapeVertex,
  widthForDefaultVertex,
  heightForDefaultVertex,
  swimlaneTitleWidth,
  milestoneTitleWidth,
  AddVertexType,
} from "../../Constants/bpmnView";
import { AddActivity } from "../CommonAPICall/AddActivity";
import { configureStyleForCell } from "./configureStyleForCell";
import { getMilestoneAt } from "./getMilestoneAt";
import { getNextCell } from "./getNextCell";
import { getSwimlaneAt } from "./getSwimlaneAt";
import { getActivityQueueObj } from "../abstarctView/getActivityQueueObj";
import disabledIcon from "../../assets/bpmnView/cancelIcon.png";
import { isAllowedOutsideMilestone } from "./dropOutsideMilestone";
import axios from "axios";
import {
  ENDPOINT_ADD_CONNECTION,
  SERVER_URL,
} from "../../Constants/appConstants";
import { dimensionInMultipleOfGridSize } from "./drawOnGraph";
import { getActivityAt } from "./getActivityAt";
import { getFullWidth } from "../abstarctView/addWorkstepAbstractView";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxUtils = mxgraphobj.mxUtils;
const mxGeometry = mxgraphobj.mxGeometry;
const mxRectangle = mxgraphobj.mxRectangle;
const mxEvent = mxgraphobj.mxEvent;
const mxPoint = mxgraphobj.mxPoint;
const mxEventObject = mxgraphobj.mxEventObject;

let toolDiv = document.createElement("div");
let visibility = false;
let nextCells = [];
let tool = [];
let dummy_graph;
let isActivityPresent;

let clearOldValues = () => {
  if (tool != null) {
    for (var i of tool) {
      var img = i;
      img.parentNode.removeChild(img);
    }
  }
  tool = [];
  nextCells = [];
};
let mileStoneWidthIncreasedFlag = false;
let laneHeightIncreasedFlag = false;
let mileStoneInfo = {};
let lanesInfo = {};

let toDropOnGraph = (graph, cell, x, y, t, mainCell, props) => {
  let processDefId,
    processName,
    mileIndex,
    MaxseqId = 0,
    mileWidth = 0;
  let { caseEnabled } = props;
  let activityType = cell.activityTypeId;
  let activitySubType = cell.activitySubTypeId;
  let title = t(cell.title);
  let mileAtXY = getMilestoneAt(x, y, null, graph);
  let swimlaneAtXY = getSwimlaneAt(x, y, null, graph, AddVertexType);
  if (mileAtXY === null || swimlaneAtXY === null || isActivityPresent) {
    return;
  }
  var prototype = new mxgraphobj.mxCell(
    title,
    new mxGeometry(0, 0, cellSize.w, cellSize.h),
    cell.styleName
  );
  prototype.setVertex(true);

  //add to graph only if point is inside a swimlane
  if (mileAtXY !== null && graph.isSwimlane(prototype) === false) {
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
    graph.insertEdge(parentCell, null, "", mainCell, prototype);
    let newActivityId = 0;
    let queueInfo, newProcessData;
    let laneHeight = milestoneTitleWidth,
      isLaneFound = false;
    props.setProcessData((prevProcessData) => {
      newProcessData = { ...prevProcessData };
      processDefId = newProcessData.ProcessDefId;
      processName = newProcessData.ProcessName;
      return newProcessData;
    });
    queueInfo = getActivityQueueObj(
      props.setNewId,
      activityType,
      activitySubType,
      title + "_" + newActivityId,
      newProcessData,
      parentCellId,
      t
    );
    props.setNewId((oldIds) => {
      newActivityId = oldIds.activityId + 1;
      return { ...oldIds, activityId: newActivityId };
    });
    let newEdgeId = Number(newProcessData.Connections.length + 1);

    let json = {
      processDefId: processDefId,
      processMode: newProcessData.ProcessType,
      connId: Number(newEdgeId),
      sourceId: mainCell.getId(),
      targetId: newActivityId,
      connType: "D",
      sourcePosition: [],
      targetPosition: [],
    };
    axios.post(SERVER_URL + ENDPOINT_ADD_CONNECTION, json).then((response) => {
      if (response.data.Status === 0) {
        props.setProcessData((prevProcessData) => {
          //do not do shallow copy process Data, else original state will get change
          let newProcessData = { ...prevProcessData };
          newProcessData.Connections = [...prevProcessData.Connections];
          newProcessData.Connections.push({
            ConnectionId: Number(newEdgeId),
            Type: "D",
            SourceId: mainCell.getId(),
            TargetId: newActivityId,
            xLeft: [],
            yTop: [],
          });
          return newProcessData;
        });
      }
    });
    props.setProcessData((prevProcessData) => {
      //do not do shallow copy process Data, else original state will get change
      let newProcessData = { ...prevProcessData };
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
                  MaxseqId = embAct.SequenceId;
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
      newProcessData.MileStones.forEach((milestone, index) => {
        milestone["oldWidth"] = milestone.Width;
        if (milestone.iMileStoneId === mileId) {
          mileIndex = index;
          if (+newWidth !== +milestone.Width) {
            mileStoneWidthIncreasedFlag = true;
            newProcessData.MileStones[index] = { ...milestone };
            newProcessData.MileStones[index].Width = newWidth + "";
            newProcessData.MileStones[index].Activities = [
              ...newProcessData.MileStones[index].Activities,
            ];
          }
          newProcessData.MileStones[index].Activities.push({
            xLeftLoc: vertexX,
            yTopLoc: +laneHeight + vertexY,
            ActivityType: activityType,
            ActivitySubType: activitySubType,
            ActivityId: newActivityId,
            ActivityName: title + `_` + newActivityId,
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
        if (!mileIndex) {
          mileWidth = mileWidth + +milestone.Width;
        }
      });

      if (mileStoneWidthIncreasedFlag) {
        mileStoneInfo = {
          arrMilestoneInfos: newProcessData?.MileStones?.map((mile, index) => {
            return {
              milestoneId: mile.iMileStoneId,
              milestoneName: mile.MileStoneName,
              width: mile.Width,
              oldWidth: mile.oldWidth,
              activities: mile?.Activities?.filter(
                (act) => +act.ActivityId !== +newActivityId
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
      newProcessData?.Lanes?.forEach((swimlane, index) => {
        swimlane["oldHeight"] = swimlane.Height;
        if (swimlane.LaneId === parentCellId) {
          newProcessData.Lanes[index] = { ...swimlane };
          if (newHeight !== parentCell.geometry.height) {
            laneHeightIncreasedFlag = true;
            newProcessData.Lanes[index].Height = newHeight + "";
          }
        }
      });

      if (laneHeightIncreasedFlag) {
        lanesInfo = {
          arrLaneInfos: newProcessData?.Lanes?.map((lane) => {
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
    configureStyleForCell(graph, cell.icon, cell.styleName);
    graph.setSelectionCell(prototype);
    graph.fireEvent(new mxEventObject("cellsInserted", "cells", prototype));
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
        queueInfo:
          queueInfo.existingQueue === "Y"
            ? { queueId: queueInfo.queueId }
            : queueInfo,
        xLeftLoc: mileIndex === 0 ? vertexX : +mileWidth + vertexX,
        yTopLoc: +laneHeight + vertexY,
        view: "BPMN",
      },
      { mileId: mileId, mileIndex: mileIndex },
      props.setProcessData,
      vertexX,
      mileStoneWidthIncreasedFlag ? mileStoneInfo : null,
      laneHeightIncreasedFlag ? lanesInfo : null
    );
    graph.refresh();
    return true;
  }
};

export function getToolDivCell(
  graph,
  mainCell,
  t,
  setProcessData,
  showDrawer,
  setNewId,
  caseEnabled
) {
  clearOldValues();
  dummy_graph = graph;
  nextCells = getNextCell(mainCell);
  if (!nextCells || nextCells === null) {
    visibility = false;
    toolDiv.style.opacity = 0;
    return;
  }
  visibility = true;
  toolDiv.setAttribute(
    "style",
    "border: 1px solid #C4C4C4;box-shadow: 0px 3px 6px #DADADA; border-radius: 1px; background: white; display: flex; position: absolute; flex-wrap: wrap; cursor: pointer; justify-content: center; z-index:100"
  );
  toolDiv.style.left =
    mainCell.geometry.x +
    mainCell.parent.geometry.x +
    mainCell.geometry.width +
    gridSize * 0.15 +
    "px";
  toolDiv.style.top = mainCell.geometry.y + mainCell.parent.geometry.y + "px";
  toolDiv.style.padding = gridSize * 0.05 + "px";
  toolDiv.style.width = 2.5 * gridSize + "px";
  nextCells &&
    nextCells.forEach((subCell) => {
      let iconDiv = document.createElement("div");
      iconDiv.style.marginLeft = gridSize * 0.1 + "px";
      iconDiv.style.marginRight = gridSize * 0.1 + "px";
      iconDiv.style.height = "20px";
      var icon = mxUtils.createImage(subCell.icon);
      icon.style.width = "16px";
      icon.style.height = "16px";
      icon.setAttribute("title", t(subCell.title));
      let div = document.createElement("div");
      if (defaultShapeVertex.includes(subCell.styleName)) {
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
      let dragImage = document.createElement("img");
      dragImage.src = subCell.icon;
      dragImage.style.width = "16px";
      dragImage.style.height = "16px";
      div.appendChild(dragImage);
      let dragSource = mxUtils.makeDraggable(
        icon,
        graph,
        (newGraph, evt, cell, x, y) =>
          toDropOnGraph(newGraph, subCell, x, y, t, mainCell, {
            setProcessData,
            showDrawer,
            setNewId,
            caseEnabled,
          }),
        div,
        null,
        null,
        graph.autoscroll,
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
        let isSwimlanePresent = getSwimlaneAt(x, y, null, graph, AddVertexType);
        let width = this.previewElement.style.width.replace("px", "");
        let height = this.previewElement.style.height.replace("px", "");

        isActivityPresent = getActivityAt(
          x,
          y,
          isSwimlanePresent,
          graph,
          width,
          height,
          null
        );
        let isMilestonePresent = getMilestoneAt(x, y, null, graph);
        // Updates the location of the preview
        if (this.previewElement != null) {
          //here if the currentPoint is not inside milestone then disabled icon is displayed
          if (isMilestonePresent === null) {
            if (!isAllowedOutsideMilestone(subCell.styleName)) {
              this.previewElement.children[0].src = disabledIcon;
              this.previewElement.style.border = "none";
            }
          } else if (isMilestonePresent !== null) {
            if (isSwimlanePresent === null) {
              this.previewElement.children[0].src = disabledIcon;
              this.previewElement.style.border = "none";
            } else if (isActivityPresent) {
              this.previewElement.children[0].src = disabledIcon;
              this.previewElement.style.border = "1px dotted black";
            } else {
              this.previewElement.children[0].src = subCell.icon;
              this.previewElement.style.border = "1px dotted black";
            }
          }

          if (this.previewElement.parentNode == null) {
            graph.container.appendChild(this.previewElement);
            this.previewElement.style.zIndex = "3";
            this.previewElement.style.position = "absolute";
          }

          var gridEnabled =
            this.isGridEnabled() && graph.isGridEnabledEvent(evt);
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
      iconDiv.appendChild(icon);
      toolDiv.appendChild(iconDiv);
      tool.push(iconDiv);
    });
  graph.view.graph.container.appendChild(toolDiv);
}

export function removeToolDivCell() {
  if (
    visibility &&
    dummy_graph &&
    toolDiv.parentNode === dummy_graph.view.graph.container
  ) {
    dummy_graph.view.graph.container.removeChild(toolDiv);
    clearOldValues();
    visibility = false;
  }
}
