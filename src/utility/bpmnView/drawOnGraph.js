import { resizer } from "./resizer";
import {
  style,
  cellSize,
  defaultHeightSwimlane,
  defaultWidthSwimlane,
  gridStartPoint,
  gridSize,
  rootId,
  tasklaneName,
  defaultShapeVertex,
  widthForDefaultVertex,
  heightForDefaultVertex,
  graphGridSize,
  expandedViewWidth,
  expandedViewHeight,
  milestoneTitleWidth,
} from "../../Constants/bpmnView";
import { getActivityById } from "./getActivity";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxCell = mxgraphobj.mxCell;
const mxGeometry = mxgraphobj.mxGeometry;
const mxPoint = mxgraphobj.mxPoint;

export function dimensionInMultipleOfGridSize(length) {
  return Math.ceil(length / graphGridSize) * graphGridSize;
}

export function cleanTheGraph(graph, swimlaneLayer, milestoneLayer, rootLayer) {
  let swimlanes = swimlaneLayer.children;
  let milestones = milestoneLayer.children;
  let layers = graph.getChildVertices(milestoneLayer.getParent().getParent());
  let tasklanes = [];
  layers &&
    layers.forEach((layer) => {
      if (
        layer.getStyle() === style.tasklane ||
        layer.getStyle() === style.tasklane_collapsed
      ) {
        tasklanes.push(layer);
      }
    });
  graph.removeCells(tasklanes, true);
  graph.removeCells(swimlanes, true);
  graph.removeCells(milestones, true);
  let grpChild = graph.view.graph.container.children;
  [...grpChild].forEach((child) => {
    if (child.getAttribute("class") === "collapsed_view") {
      graph.view.graph.container.removeChild(child);
    }
  });
  let annotations = rootLayer.children.filter(
    (cell) => cell !== swimlaneLayer && cell !== milestoneLayer
  );
  graph.removeCells(annotations, true);
}

export function drawOnGraph(
  graph,
  [swimlaneLayer, milestoneLayer, rootLayer],
  buttons,
  jsonData,
  showTasklane,
  translation
) {
  if (jsonData === null) {
    return;
  }

  //remove already items painted on graph
  cleanTheGraph(graph, swimlaneLayer, milestoneLayer, rootLayer);

  //map activities vertex to cell, used to draw edges later
  let cellById = new Map();
  let indexByLaneId = new Map();
  let laneIdxByHeight = new Map();
  let mileButton = 0,
    laneButton = 0;
  let lanes = new Map();
  let tasklane, tasklaneHeight;
  let milestoneWidth = 0;
  let foldCell = false;

  let laneColorCodes = [
    { fillColor: "#35669F", laneFillColor: "#35669F12" },
    { fillColor: "#AF0043", laneFillColor: "#AF004312" },
    { fillColor: "#01818C", laneFillColor: "#01818C12" },
  ];

  //draw lanes
  jsonData.Lanes &&
    jsonData.Lanes.forEach((eachLane, index) => {
    let width = eachLane.Width
      ? parseInt(eachLane.Width)
      : defaultWidthSwimlane;
    let height = eachLane.Height
      ? parseInt(eachLane.Height)
      : defaultHeightSwimlane;
    width = dimensionInMultipleOfGridSize(width);
    height = dimensionInMultipleOfGridSize(height);
    if (eachLane.LaneId !== -99) {
      let colorIndex = showTasklane ? (index - 1) % 3 : index % 3;
      mileButton = mileButton + height;
      let vertex = new mxCell(
        null,
        new mxGeometry(0, 0, width, height),
        `${style.swimlane};fillColor=${laneColorCodes[colorIndex]?.fillColor};swimlaneFillColor=${laneColorCodes[colorIndex]?.laneFillColor};`
      );
      //point added to vertex/lane to make it collapsable
      let point = new mxCell(null, new mxGeometry(0, 0, 0.1, 0.1));
      vertex.insert(point);
      vertex.setVertex(true);
      vertex.setConnectable(false);
      vertex.value = eachLane.LaneName;
      vertex.setId(eachLane.LaneId);
      indexByLaneId.set(eachLane.LaneId, index);
      laneIdxByHeight.set(index, height);
      //lanes saved to local array so that activities in json.milestone can be added to lanes vertex
      lanes.set(eachLane.LaneId, vertex);
      swimlaneLayer.insert(vertex);
    } else if (showTasklane) {
      let vertex = new mxCell(
        translation(tasklaneName),
        new mxGeometry(0, 0, width, height),
        style.tasklane
      );
      tasklaneHeight = height;
      let point = new mxCell(null, new mxGeometry(0, 0, 0.1, 0.1));
      vertex.insert(point);
      vertex.setVertex(true);
      vertex.setConnectable(false);
      vertex.setId(-99);
      tasklane = vertex;
      graph.addCell(vertex);
      //collapse tasklane if no tasks present
      if (jsonData.Tasks && jsonData.Tasks.length <= 0) {
        foldCell = true;
      }
    }
  });

  //draw milestones
  jsonData.MileStones?.forEach((milestone) => {
    let width = milestone.Width
      ? parseInt(milestone.Width)
      : defaultWidthSwimlane;
    let height = milestone.Height
      ? parseInt(milestone.Height)
      : defaultHeightSwimlane;
    width = dimensionInMultipleOfGridSize(width);
    height = dimensionInMultipleOfGridSize(height);
    laneButton = laneButton + width;
    var parentVertex = new mxCell(
      null,
      new mxGeometry(0, 0, width, height),
      style.milestone
    );
    parentVertex.setVertex(true);
    parentVertex.setConnectable(false);
    parentVertex.value = milestone.MileStoneName;
    parentVertex.setId(milestone.iMileStoneId);
    milestoneLayer.insert(parentVertex);

    //draw activities
    milestone.Activities.forEach((activity) => {
      let x = dimensionInMultipleOfGridSize(parseInt(activity.xLeftLoc));
      let y = dimensionInMultipleOfGridSize(
        parseInt(activity.yTopLoc) - milestoneTitleWidth
      );
      let activityObj = getActivityById(
        activity.ActivityType,
        activity.ActivitySubType
      );
      var vertex;
      let extraHeight = showTasklane ? tasklaneHeight : 0;
      let laneIdx = indexByLaneId.get(activity.LaneId);
      for (let i = showTasklane ? 1 : 0; i < laneIdx; i++) {
        extraHeight = extraHeight + laneIdxByHeight.get(i);
      }
      if (activityObj && defaultShapeVertex.includes(activityObj.styleName)) {
        vertex = new mxCell(
          activity.ActivityName,
          activity.hide && activityObj.styleName === style.subProcess
            ? new mxGeometry(
                x + milestoneWidth,
                y - extraHeight,
                expandedViewWidth,
                expandedViewHeight
              )
            : new mxGeometry(
                x + milestoneWidth,
                y - extraHeight,
                widthForDefaultVertex,
                heightForDefaultVertex
              ),
          activity.hide && activityObj.styleName === style.subProcess
            ? `${activityObj.styleName};opacity=0;noLabel=true`
            : activityObj.styleName
        );
      } else if (activityObj) {
        vertex = new mxCell(
          activity.ActivityName,
          new mxGeometry(
            x + milestoneWidth,
            y - extraHeight,
            cellSize.w,
            cellSize.h
          ),
          activityObj.styleName
        );
      }
      if (vertex) {
        vertex.setVertex(true);
        vertex.setId(activity.ActivityId);
        //activities added as child of lanes
        lanes.get(activity.LaneId)?.insert(vertex);
        cellById.set(activity.ActivityId, vertex);
        if (activity.hide) {
          //if embedded subprocess which is expanded,
          //then delete the old layer and add new layer with updated values
          let layers = graph.getChildVertices();
          let expandEmbeddedAct = new mxCell(
            null,
            new mxGeometry(0, 0, 0, 0),
            style.expandedEmbeddedProcess
          );
          expandEmbeddedAct.setVertex(true);
          expandEmbeddedAct.setConnectable(false);
          layers &&
            layers.forEach((layer) => {
              if (layer.getStyle() === style.expandedEmbeddedProcess) {
                expandEmbeddedAct.id = layer.id;
                expandEmbeddedAct.geometry = layer.geometry;
                graph.removeCells([layer]);
              }
            });
          graph.addCell(expandEmbeddedAct);
          activity.EmbeddedActivity[0] &&
            activity.EmbeddedActivity[0].forEach((act) => {
              let x1 = dimensionInMultipleOfGridSize(+act.xLeftLoc);
              let y1 = dimensionInMultipleOfGridSize(+act.yTopLoc);
              let activitySubObj = getActivityById(
                act.ActivityType,
                act.ActivitySubType
              );
              let vertex12;
              if (
                activitySubObj &&
                defaultShapeVertex.includes(activitySubObj.styleName)
              ) {
                vertex12 = new mxCell(
                  act.ActivityName,
                  new mxGeometry(
                    x1,
                    y1,
                    widthForDefaultVertex,
                    heightForDefaultVertex
                  ),
                  act.hide && activitySubObj.styleName === style.subProcess
                    ? `${activitySubObj.styleName};opacity=0;noLabel=true`
                    : activitySubObj.styleName
                );
              } else if (activitySubObj) {
                vertex12 = new mxCell(
                  act.ActivityName,
                  new mxGeometry(x1, y1, cellSize.w, cellSize.h),
                  activitySubObj.styleName
                );
              }
              vertex12.setVertex(true);
              vertex12.setId(act.ActivityId);
              expandEmbeddedAct.insert(vertex12);
            });
        }
      }
    });
    milestoneWidth = milestoneWidth + width;
  });

  //draw tasks
  if (showTasklane) {
    jsonData.Tasks?.forEach((task) => {
      var vertex = new mxCell(
        task.TaskName,
        new mxGeometry(
          dimensionInMultipleOfGridSize(+task.xLeftLoc),
          dimensionInMultipleOfGridSize(+task.yTopLoc),
          widthForDefaultVertex,
          heightForDefaultVertex
        ),
        style.taskTemplate
      );
      vertex.setVertex(true);
      vertex.setId(task.TaskId);
      //tasks added as child of tasklane
      tasklane.insert(vertex);
    });
  }

  //draw edges
  jsonData.Connections?.forEach((connection) => {
    let edge = graph.insertEdge(
      rootLayer,
      connection.ConnectionId,
      "",
      cellById.get(connection.SourceId),
      cellById.get(connection.TargetId),
      "edgeStyle=orthogonalEdgeStyle;shape=connector;orthogonalLoop=1;jettySize=auto;labelBackgroundColor=default;fontSize=11;fontColor=#000;startFill=1;endArrow=classic;strokeColor=black;strokeWidth=1;movableLabel=0;verticalAlign=bottom;snapToPoint=1;"
    );
    edge.initialRender = true;
    let edgePoints = [];
    connection.xLeft?.forEach((x, idx) => {
      edgePoints.push(new mxPoint(x, connection.yTop[idx]));
    });
    edge.geometry.points = edgePoints;
  });

  //draw text Annotations
  jsonData.Annotations?.forEach((annotation) => {
    let width = annotation.Width ? parseInt(annotation.Width) : cellSize.w;
    let height = annotation.Height ? parseInt(annotation.Height) : cellSize.h;
    width = dimensionInMultipleOfGridSize(width);
    height = dimensionInMultipleOfGridSize(height);

    let xLeftLoc = dimensionInMultipleOfGridSize(
      parseInt(annotation.xLeftLoc) + gridStartPoint.x
    );
    let yTopLoc = dimensionInMultipleOfGridSize(
      parseInt(annotation.yTopLoc) + gridStartPoint.y1
    );

    var vertex = new mxCell(
      null,
      new mxGeometry(xLeftLoc, yTopLoc, width, height),
      style.textAnnotations
    );
    vertex.setVertex(true);
    vertex.setConnectable(false);
    vertex.value = annotation.Comment;
    vertex.setId(annotation.AnnotationId);
    rootLayer.insert(vertex);
  });

  //draw GroupBox
  jsonData.GroupBoxes?.forEach((groupBox) => {
    let width = groupBox.GroupBoxWidth
      ? parseInt(groupBox.GroupBoxWidth)
      : cellSize.w;
    let height = groupBox.GroupBoxHeight
      ? parseInt(groupBox.GroupBoxHeight)
      : cellSize.h;
    width = dimensionInMultipleOfGridSize(width);
    height = dimensionInMultipleOfGridSize(height);

    let xLeftLoc = dimensionInMultipleOfGridSize(
      parseInt(groupBox.ILeft) + gridStartPoint.x
    );
    let yTopLoc = dimensionInMultipleOfGridSize(
      parseInt(groupBox.ITop) + gridStartPoint.y1
    );

    var vertex = new mxCell(
      null,
      new mxGeometry(xLeftLoc, yTopLoc, width, height),
      style.groupBox
    );
    vertex.setVertex(true);
    vertex.setConnectable(false);
    vertex.value = groupBox.BlockName;
    vertex.setId(groupBox.GroupBoxId);
    rootLayer.insert(vertex);
  });

  //draw Message
  jsonData.MSGAFS?.forEach((mxsgaf) => {
    let width = cellSize.w;
    let height = cellSize.h;
    width = dimensionInMultipleOfGridSize(width);
    height = dimensionInMultipleOfGridSize(height);

    let xLeftLoc = dimensionInMultipleOfGridSize(
      parseInt(mxsgaf.xLeftLoc) + gridStartPoint.x
    );
    let yTopLoc = dimensionInMultipleOfGridSize(
      parseInt(mxsgaf.yTopLoc) + gridStartPoint.y
    );

    var vertex = new mxCell(
      null,
      new mxGeometry(xLeftLoc, yTopLoc, width, height),
      style.message
    );
    vertex.setVertex(true);
    vertex.setConnectable(false);
    vertex.value = mxsgaf.MsgAFName;
    vertex.setId(mxsgaf.MsgAFId);
    rootLayer.insert(vertex);
  });

  //draw DataObjects
  jsonData.DataObjects?.forEach((dataObject) => {
    let width = cellSize.w;
    let height = cellSize.h;
    width = dimensionInMultipleOfGridSize(width);
    height = dimensionInMultipleOfGridSize(height);

    let xLeftLoc = dimensionInMultipleOfGridSize(
      parseInt(dataObject.xLeftLoc) + gridStartPoint.x
    );
    let yTopLoc = dimensionInMultipleOfGridSize(
      parseInt(dataObject.yTopLoc) + gridStartPoint.y
    );

    var vertex = new mxCell(
      null,
      new mxGeometry(xLeftLoc, yTopLoc, width, height),
      style.dataObject
    );
    vertex.setVertex(true);
    vertex.setConnectable(false);
    vertex.value = dataObject.Data;
    vertex.setId(dataObject.DataObjectId);
    rootLayer.insert(vertex);
  });
  buttons.addSwimlane.style.width = laneButton + gridSize + "px";
  buttons.addMilestone.style.height = mileButton + gridSize + "px";
  resizer(
    graph,
    [swimlaneLayer, milestoneLayer],
    null,
    null,
    buttons,
    showTasklane,
    foldCell
  );
  // Updates the display
  graph.refresh();
  // get graph children except root
  graph.getDefaultParent().children.filter((cell) => cell.getId() !== rootId);
}
