import connector from "../../assets/bpmnView/connector.gif";
import collapsedImage from "../../assets/bpmnView/swimlaneCollapse.svg";
import expandedImage from "../../assets/bpmnView/swimlaneExpand.svg";

import { cellEditor } from "./cellEditor";
import { cellOnMouseClick } from "./cellOnMouseClick";
import { addDefaultsToGraph } from "./addDefaultsToGraph";
import { paintGrid } from "./paintGrid";
import { createConnections } from "./createConnections";
import { cellRepositioned } from "./cellsMoved";
import {
  startEvents,
  activities,
  intermediateEvents,
  gateway,
  endEvents,
  integrationPoints,
  artefacts,
} from "./toolboxIcon";

import {
  smallIconSize,
  gridSize,
  defaultShapeVertex,
  graphGridSize,
  widthForDefaultVertex,
  style,
  heightForDefaultVertex,
  milestoneTitleWidth,
  swimlaneTitleSize,
  AddVertexType,
} from "../../Constants/bpmnView";
import { configureStyleForCell } from "./configureStyleForCell";
import { collapseExpandCell } from "./collapseExpandCell";
import { ResizeMilestone } from "../CommonAPICall/ResizeMilestone";
import { dimensionInMultipleOfGridSize } from "./drawOnGraph";
import { ResizeSwimlane } from "../CommonAPICall/ResizeSwimlane";
import { cellOnMouseHover } from "./cellOnMouseHover";
import { getActivityProps } from "../abstarctView/getActivityProps";
import { edgeOnMouseHover } from "./edgeOnMouseHover";
import { getFullWidth } from "../abstarctView/addWorkstepAbstractView";
import { createPopupMenu } from "./createPopupMenu";
import { getSwimlaneAt } from "./getSwimlaneAt";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});
const mxGraph = mxgraphobj.mxGraph;
const mxRubberband = mxgraphobj.mxRubberband;
const mxImage = mxgraphobj.mxImage;
const mxConnectionHandler = mxgraphobj.mxConnectionHandler;
const mxKeyHandler = mxgraphobj.mxKeyHandler;
const mxEvent = mxgraphobj.mxEvent;
const mxPoint = mxgraphobj.mxPoint;
const mxShape = mxgraphobj.mxShape;
const mxConnectionConstraint = mxgraphobj.mxConnectionConstraint;
const mxPolyline = mxgraphobj.mxPolyline;
const mxCellState = mxgraphobj.mxCellState;
const mxSwimlaneManager = mxgraphobj.mxSwimlaneManager;
const mxConstants = mxgraphobj.mxConstants;
const mxRectangle = mxgraphobj.mxRectangle;
const mxVertexHandler = mxgraphobj.mxVertexHandler;
const mxUtils = mxgraphobj.mxUtils;
const mxGraphView = mxgraphobj.mxGraphView;
const mxEventObject = mxgraphobj.mxEventObject;
let graph = null;

//array object which store layer of swimlane and milestone
// and root layer where the other are two are inserted
let layers = [];

//buttons stores buutons to add swimlane and milestone
let buttons = {};
let swimlaneLayer, milestoneLayer, rootLayer;

const fixedConnectionPoint = () => {
  // Overridden to define per-shape connection points
  mxGraph.prototype.getAllConnectionConstraints = function (terminal, source) {
    if (terminal != null && terminal.shape != null) {
      if (terminal.shape.stencil != null) {
        if (terminal.shape.stencil.constraints != null) {
          return terminal.shape.stencil.constraints;
        }
      } else if (terminal.shape.constraints != null) {
        return terminal.shape.constraints;
      }
    }
    return null;
  };

  // Defines the default constraints for all shapes
  mxShape.prototype.constraints = [
    new mxConnectionConstraint(new mxPoint(0.25, 0), true),
    new mxConnectionConstraint(new mxPoint(0.5, 0), true),
    new mxConnectionConstraint(new mxPoint(0.75, 0), true),
    new mxConnectionConstraint(new mxPoint(0, 0.25), true),
    new mxConnectionConstraint(new mxPoint(0, 0.5), true),
    new mxConnectionConstraint(new mxPoint(0, 0.75), true),
    new mxConnectionConstraint(new mxPoint(1, 0.25), true),
    new mxConnectionConstraint(new mxPoint(1, 0.5), true),
    new mxConnectionConstraint(new mxPoint(1, 0.75), true),
    new mxConnectionConstraint(new mxPoint(0.25, 1), true),
    new mxConnectionConstraint(new mxPoint(0.5, 1), true),
    new mxConnectionConstraint(new mxPoint(0.75, 1), true),
  ];

  // Edges have no connection points
  mxPolyline.prototype.constraints = null;
};

export function addMxGraph(
  containerRef,
  setNewId,
  displayMessage,
  showDrawer,
  translation,
  setProcessData,
  processType,
  caseEnabled,
  setOpenDeployedProcess,
  setTaskAssociation,
  setShowDependencyModal,
  setShowQueueModal,
  setActionModal,
  dispatch
) {
  mxConnectionHandler.prototype.connectImage = new mxImage(
    connector,
    smallIconSize.w,
    smallIconSize.h
  );

  let container = containerRef.current;
  // Disables the built-in context menu
  mxEvent.disableContextMenu(container);
  graph = new mxGraph(container);
  graph.graphHandler.scaleGrid = true;
  graph.setPanning(true);
  mxGraph.prototype.collapsedImage = new mxImage(collapsedImage, 16, 16);
  mxGraph.prototype.expandedImage = new mxImage(expandedImage, 16, 16);
  let model = graph.getModel();
  // to avoid common ancestor of source and terminal vertices as parent for edge
  model.maintainEdgeParent = false;

  graph.isHtmlLabel = function (cell) {
    return true;
  };

  // html code for labels of vertices, excluding milestones, swimlanes, tasklanes
  graph.getLabel = function (cell) {
    var tmp = mxGraph.prototype.getLabel.apply(this, arguments);
    if (
      // this.model.isEdge(cell) &&
      // this.model.isVertex(cell) &&
      cell.style &&
      !cell.style.includes(style.swimlane) &&
      cell.style !== style.tasklane &&
      !cell.style.includes(style.swimlane_collapsed) &&
      cell.style !== style.tasklane_collapsed &&
      cell.style !== style.milestone
    ) {
      if (defaultShapeVertex.includes(cell.style)) {
        tmp =
          `<div style="width:${
            cell.geometry.width - graphGridSize
          }px ; overflow-wrap: break-word; text-align: center;">` +
          tmp +
          "</div>";
      } else if (this.model.isEdge(cell)) {
        tmp =
          `<div style="width:10px ; overflow-wrap: break-word; text-align: center;">` +
          tmp +
          "</div>";
      } else {
        tmp = `<div style="white-space:pre-wrap;">` + tmp + "</div>";
      }
    }
    return tmp;
  };
  // to wrap labels
  graph.isWrapping = function (state) {
    return !this.model.isEdge(state.cell);
  };

  // Implements a listener for hover and click handling on edges
  edgeOnMouseHover(graph, setProcessData);

  createConnections(graph, setProcessData, setNewId, dispatch, translation);
  cellRepositioned(graph, setProcessData, caseEnabled);

  //overwrite some function of mxCellEditor
  cellEditor(graph, displayMessage, setProcessData, translation, dispatch);

  //to show icons, tooldiv on mouse click on cell
  cellOnMouseClick(
    graph,
    translation,
    setProcessData,
    showDrawer,
    setNewId,
    caseEnabled,
    processType,
    setOpenDeployedProcess,
    setTaskAssociation,
    setShowDependencyModal,
    setActionModal,
    dispatch
  );

  //show icon for click on embedded subprocess and call Activity/ more options for milestone
  cellOnMouseHover(graph, setProcessData, translation, processType, dispatch);

  // Enables new connections in the graph
  graph.setConnectable(true);
  graph.setAllowDanglingEdges(false);
  graph.setMultigraph(false);

  //add fixed connection point to cells
  fixedConnectionPoint();

  graph.minimumGraphSize = new mxRectangle(0, 0, 100, 100);
  graph.setResizeContainer(false);

  //adding default swimlane, taskplane and milestone to the graph
  [layers, buttons] = addDefaultsToGraph(
    graph,
    setNewId,
    translation,
    setProcessData,
    caseEnabled,
    processType
  );

  //set style for all activities
  let allActivities = [
    startEvents,
    activities,
    intermediateEvents,
    gateway,
    integrationPoints,
    endEvents,
    artefacts,
  ];
  for (let itr of allActivities) {
    let subActivities = itr.tools;
    for (let itr2 of subActivities) {
      configureStyleForCell(graph, itr2.icon, itr2.styleName);
    }
  }

  rootLayer = layers[0];
  swimlaneLayer = layers[1];
  milestoneLayer = layers[2];

  //function when swimlane is collapsed or expanded
  collapseExpandCell(graph, buttons, milestoneLayer, swimlaneLayer, rootLayer);

  // Redirects the perimeter to the label bounds if intersection between edge and label is found
  let mxGraphViewGetPerimeterPoint = mxGraphView.prototype.getPerimeterPoint;
  mxGraphView.prototype.getPerimeterPoint = function (
    terminal,
    next,
    orthogonal
  ) {
    var point = mxGraphViewGetPerimeterPoint.apply(this, arguments);
    if (point != null) {
      var perimeter = this.getPerimeterFunction(terminal);
      if (terminal.text != null && terminal.text.boundingBox != null) {
        // Adds a small border to the label bounds
        var b = terminal.text.boundingBox.clone();
        b.grow(3);
        if (mxUtils.rectangleIntersectsSegment(b, point, next)) {
          point = perimeter(b, terminal, next, orthogonal);
        }
      }
    }
    return point;
  };

  //to stop the movement of resize cursor when either min width of milestone is reached or
  //maxXLeft position of activities is reached
  var vertexHandlerUnion = mxVertexHandler.prototype.union;
  mxVertexHandler.prototype.union = function () {
    var result = vertexHandlerUnion.apply(this, arguments);
    let cellId = this.state.cell.id;
    let maxXLeft = 0,
      maxYTop = 0,
      maxXLeftlane = 0,
      maxTaskXLeft = 0,
      isLaneFound = false,
      isTaskLast = false,
      mileWidth = 0,
      laneHeight = milestoneTitleWidth;
    let lastAct, lastTopAct, lastActLane;
    setProcessData((prevProcessData) => {
      prevProcessData.Lanes?.forEach((lane) => {
        if (lane.LaneId === cellId) {
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
      prevProcessData.MileStones?.forEach((mile, index) => {
        // to get min width of mile as per max xLeftLoc of activities present in it
        if (mile.iMileStoneId === cellId) {
          mile.Activities?.forEach((activity) => {
            if (+maxXLeft < +activity.xLeftLoc) {
              maxXLeft = +activity.xLeftLoc;
              lastAct = activity;
            }
          });
          maxXLeft = maxXLeft + mileWidth;
        }
        // to get min height of lane as per max yTopLoc of activities present in it
        mile.Activities?.forEach((activity) => {
          if (activity.LaneId === cellId) {
            if (+maxYTop < +activity.yTopLoc - laneHeight) {
              maxYTop = +activity.yTopLoc - laneHeight;
              lastTopAct = activity;
            }
          }
        });
        if (index === prevProcessData.MileStones?.length - 1) {
          mile.Activities?.forEach((activity) => {
            if (+maxXLeftlane < +activity.xLeftLoc) {
              maxXLeftlane = +activity.xLeftLoc;
              lastActLane = activity;
            }
          });
          maxXLeftlane = maxXLeftlane + mileWidth;
        }
        mileWidth = mileWidth + +mile.Width;
      });
      prevProcessData.Tasks?.forEach((task) => {
        if (+task.xLeftLoc > +maxTaskXLeft) {
          maxTaskXLeft = +task.xLeftLoc;
        }
      });
      return prevProcessData;
    });
    if (this.state.style.horizontal) {
      let minWidth;
      if (+maxTaskXLeft > +maxXLeft) {
        isTaskLast = true;
      }
      if (isTaskLast) {
        minWidth = Math.max(
          gridSize * 3,
          dimensionInMultipleOfGridSize(+maxTaskXLeft) + widthForDefaultVertex
        );
      } else {
        let isPreviousActDefault = lastAct
          ? defaultShapeVertex.includes(
              getActivityProps(lastAct.ActivityType, lastAct.ActivitySubType)[5]
            )
          : false;
        minWidth = Math.max(
          gridSize * 3,
          dimensionInMultipleOfGridSize(+maxXLeft) +
            (isPreviousActDefault ? widthForDefaultVertex : gridSize)
        );
      }
      if (this.index === 4) {
        result.width = Math.max(
          result.width,
          mxUtils.getNumber(this.state.style, "minWidth", minWidth)
        );
      } else {
        result.x = this.bounds.x;
        result.width = this.bounds.width;
        result.y = this.bounds.y;
        result.height = this.bounds.height;
      }
    } else {
      let minWidth;
      if (+maxTaskXLeft > +maxXLeftlane) {
        isTaskLast = true;
      }
      if (isTaskLast) {
        minWidth = Math.max(
          gridSize * 3,
          dimensionInMultipleOfGridSize(+maxTaskXLeft) +
            widthForDefaultVertex +
            gridSize
        );
      } else {
        let isPreviousActDefault = lastActLane
          ? defaultShapeVertex.includes(
              getActivityProps(
                lastActLane.ActivityType,
                lastActLane.ActivitySubType
              )[5]
            )
          : false;
        minWidth = Math.max(
          gridSize * 3,
          dimensionInMultipleOfGridSize(+maxXLeftlane) +
            (isPreviousActDefault
              ? widthForDefaultVertex + gridSize
              : gridSize * 2)
        );
      }
      let isPreviousTopActDefault = lastTopAct
        ? defaultShapeVertex.includes(
            getActivityProps(
              lastTopAct.ActivityType,
              lastTopAct.ActivitySubType
            )[5]
          )
        : false;
      let minHeight = Math.max(
        gridSize * 3,
        dimensionInMultipleOfGridSize(+maxYTop) +
          (isPreviousTopActDefault
            ? heightForDefaultVertex + gridSize
            : gridSize * 2)
      );
      if (this.index === 4) {
        result.width = Math.max(
          result.width,
          mxUtils.getNumber(this.state.style, "minWidth", minWidth)
        );
      } else if (this.index === 6) {
        result.height = Math.max(
          result.height,
          mxUtils.getNumber(this.state.style, "minHeight", minHeight)
        );
      } else if (this.index === 7) {
        result.height = Math.max(
          result.height,
          mxUtils.getNumber(this.state.style, "minHeight", minHeight)
        );
        result.width = Math.max(
          result.width,
          mxUtils.getNumber(this.state.style, "minWidth", minWidth)
        );
      } else {
        result.x = this.bounds.x;
        result.width = this.bounds.width;
        result.y = this.bounds.y;
        result.height = this.bounds.height;
      }
    }
    return result;
  };

  //Redraws the handles, show draggable handles only on east edge for milestone and only for
  //south, east, south-east points for swimlane
  var vertexHandlerRedraw = mxVertexHandler.prototype.redrawHandles;
  mxVertexHandler.prototype.redrawHandles = function () {
    var result = vertexHandlerRedraw.apply(this, arguments);
    //code edited on 26 August 2022 for BugId 110986
    if (this.sizers != null && this.sizers.length > 7) {
      //cursor drags for milestone
      if (this.state.style.horizontal) {
        this.sizers[0].node.style.display = "none"; //nw
        this.sizers[1].node.style.display = "none"; //n
        this.sizers[2].node.style.display = "none"; //ne
        this.sizers[3].node.style.display = "none"; //w
        this.sizers[5].node.style.display = "none"; //sw
        this.sizers[6].node.style.display = "none"; //s
        this.sizers[7].node.style.display = "none"; //se
      }
      //cursor drags for swimlane
      else {
        this.sizers[0].node.style.display = "none"; //nw
        this.sizers[1].node.style.display = "none"; //n
        this.sizers[2].node.style.display = "none"; //ne
        this.sizers[3].node.style.display = "none"; //w
        this.sizers[5].node.style.display = "none"; //sw
      }
    }
  };

  graph.dblClick = function (evt, cell) {
    var mxe = new mxEventObject(
      mxEvent.DOUBLE_CLICK,
      "event",
      evt,
      "cell",
      cell
    );
    this.fireEvent(mxe);

    if (this.isEnabled() && !mxEvent.isConsumed(evt) && !mxe.isConsumed()) {
      mxe.consume();
    }
  };
  graph.popupMenuHandler.autoExpand = true;
  // Installs a popupmenu handler using local function (see below).
  graph.popupMenuHandler.factoryMethod = function (menu) {
    let isSwimlanePresent = getSwimlaneAt(
      graph.popupMenuHandler.triggerX,
      graph.popupMenuHandler.triggerY,
      null,
      graph,
      AddVertexType
    );
    createPopupMenu(
      graph,
      menu,
      setProcessData,
      setNewId,
      translation,
      caseEnabled,
      setShowQueueModal,
      isSwimlanePresent,
      processType,
      setActionModal
    );
  };

  // Function called on resize of swimlanes and milestones
  let swimlaneManager = new mxSwimlaneManager(graph);
  swimlaneManager.cellsResized = function (cells) {
    cells.forEach((cell) => {
      if (graph.isSwimlane(cell)) {
        let horizontal = graph.getStylesheet().getCellStyle(cell.getStyle())[
          mxConstants.STYLE_HORIZONTAL
        ];
        let cellId = cell.getId();
        //milestone is resized
        if (horizontal) {
          //height of all milestone are common
          let newArray = [];
          let ProcessDefId;
          let prevMileWidth;
          setProcessData((prevProcessData) => {
            //do not shallow copy process Data, else original state will get change
            let newProcessData = JSON.parse(JSON.stringify(prevProcessData));
            newProcessData.MileStones = JSON.parse(
              JSON.stringify(prevProcessData.MileStones)
            );
            newProcessData.Lanes = JSON.parse(
              JSON.stringify(prevProcessData.Lanes)
            );
            newProcessData.Connections = JSON.parse(
              JSON.stringify(prevProcessData.Connections)
            );
            //assumption that each milestone have unique iMilestoneId
            let mIndex;
            newArray = newProcessData.MileStones?.map((mile, index) => {
              //create activities array for all milestones
              let activitiesArray = mile.Activities?.map((activity) => {
                return {
                  activityId: activity.ActivityId,
                  xLeftLoc:
                    +activity.xLeftLoc +
                    getFullWidth(index, newProcessData) +
                    "",
                };
              });
              // Case 1: milestone which is resized
              if (mile.iMileStoneId === cellId) {
                mIndex = index;
                prevMileWidth = +mile.Width;
                return {
                  milestoneName: mile.MileStoneName,
                  milestoneId: mile.iMileStoneId,
                  width: cell.geometry.width + "",
                  oldWidth: mile.Width,
                  activities: activitiesArray,
                };
              }
              // Case 2: milestones to the right of milestone which is resized
              else if (mIndex >= 0 && mIndex < index) {
                //update activities array with updated width of resized milestone
                activitiesArray = activitiesArray.map((activity1) => {
                  return {
                    activityId: activity1.activityId,
                    xLeftLoc:
                      +activity1.xLeftLoc -
                      +prevMileWidth +
                      cell.geometry.width +
                      "",
                  };
                });
                return {
                  milestoneName: mile.MileStoneName,
                  milestoneId: mile.iMileStoneId,
                  width: mile.Width,
                  oldWidth: mile.Width,
                  activities: activitiesArray,
                };
              }
              // Case 3: milestones to the left of milestone which is resized
              else {
                return {
                  milestoneName: mile.MileStoneName,
                  milestoneId: mile.iMileStoneId,
                  width: mile.Width,
                  oldWidth: mile.Width,
                  activities: activitiesArray,
                };
              }
            });
            newProcessData.MileStones?.forEach((mile, index) => {
              if (mile.iMileStoneId === cellId) {
                newProcessData.MileStones[index].Width = cell.geometry.width;
              }
            });
            prevProcessData.Connections?.forEach((conn, index) => {
              conn.xLeft?.forEach((x, idx) => {
                if (x > cell.geometry.x + prevMileWidth) {
                  newProcessData.Connections[index].xLeft[idx] =
                    x +
                    cell.geometry.width -
                    dimensionInMultipleOfGridSize(prevMileWidth);
                }
              });
            });
            ProcessDefId = newProcessData.ProcessDefId;
            return newProcessData;
          });
          ResizeMilestone(
            ProcessDefId,
            newArray,
            setProcessData,
            cellId,
            prevMileWidth
          );
        }
        //swimlane is resized
        else {
          //width of all swimlane are common
          let newArray = [];
          let nextLanes = [],
            selectedLaneIdx = null,
            oldHeight;
          let ProcessDefId;
          setProcessData((prevProcessData) => {
            //do not do shallow copy process Data, else original state will get change
            let newProcessData = JSON.parse(JSON.stringify(prevProcessData));
            newProcessData.Lanes = JSON.parse(
              JSON.stringify(prevProcessData.Lanes)
            );
            let totalMileWidth = newProcessData.MileStones?.reduce(
              (acc, el) => {
                acc = acc + +el.Width;
                return acc;
              },
              0
            );
            newArray = newProcessData.Lanes?.map((lane, index) => {
              if (selectedLaneIdx !== null) {
                nextLanes.push(lane.LaneId);
              }
              if (+lane.LaneId === cell.id) {
                selectedLaneIdx = index;
                oldHeight = +newProcessData.Lanes[index].Height;
                newProcessData.Lanes[index].Height = cell.geometry.height;
              }
              return {
                laneId: lane.LaneId,
                laneSeqId: lane.LaneSeqId,
                laneName: lane.LaneName,
                width:
                  +lane.LaneId === cell.id
                    ? cell.geometry.width - swimlaneTitleSize + ""
                    : totalMileWidth + "",
                oldWidth: totalMileWidth + "",
                height: lane.Height + "",
                oldHeight:
                  +lane.LaneId === cell.id ? oldHeight + "" : lane.Height,
              };
            });
            newProcessData.MileStones?.forEach((mile, mileIdx) => {
              mile.Activities.forEach((act, actidx) => {
                if (nextLanes.includes(act.LaneId)) {
                  newProcessData.MileStones[mileIdx].Activities[
                    actidx
                  ].yTopLoc = +act.yTopLoc + +cell.geometry.height - +oldHeight;
                }
              });
            });
            newProcessData.MileStones[
              newProcessData.MileStones.length - 1
            ].Width =
              +newProcessData.MileStones[newProcessData.MileStones.length - 1]
                .Width +
              (cell.geometry.width - +swimlaneTitleSize - +totalMileWidth);
            prevProcessData.Connections?.forEach((conn, index) => {
              conn.yTop?.forEach((y, idx) => {
                if (y > +cell.geometry.y + +oldHeight) {
                  newProcessData.Connections[index].yTop[idx] =
                    y +
                    +cell.geometry.height -
                    dimensionInMultipleOfGridSize(+oldHeight);
                }
              });
            });
            ProcessDefId = newProcessData.ProcessDefId;
            return newProcessData;
          });
          ResizeSwimlane(
            ProcessDefId,
            newArray,
            setProcessData,
            cellId,
            oldHeight
          );
        }
      }
    });
  };

  // Enables connect preview for the default edge style
  graph.connectionHandler.createEdgeState = function (me) {
    var edge = graph.createEdge(null, null, null, null, null);
    return new mxCellState(
      this.graph.view,
      edge,
      this.graph.getCellStyle(edge)
    );
  };

  // Specifies the default edge style
  graph.getStylesheet().getDefaultEdgeStyle()["edgeStyle"] =
    "orthogonalEdgeStyle";
  // Specifies the default edge color
  graph.getStylesheet().getDefaultEdgeStyle()["strokeColor"] = "#767676";
  // Specifies the default selection outline style
  mxConstants.VERTEX_SELECTION_COLOR = "#A5C9E5";
  mxConstants.VERTEX_SELECTION_DASHED = false;
  mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;

  new mxRubberband(graph);

  //paints graph grid
  var repaintGrid = paintGrid(graph, buttons);
  repaintGrid();

  // Stops editing on enter or escape keypress
  new mxKeyHandler(graph);
  new mxRubberband(graph);

  return [graph, rootLayer, swimlaneLayer, milestoneLayer, buttons];
}

/*
1. mxGraph.splitEnabled =	Specifies if dropping onto edges should be enabled.
2. mxGraph.splitEdge =	Splits the given edge by adding the newEdge between the previous source and the given cell and reconnecting the source of the given edge to the given cell.
*/
