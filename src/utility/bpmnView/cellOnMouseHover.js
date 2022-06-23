import hoverIcon from "../../assets/bpmnView/workstepOnHover/New workstep.png";
import editIcon from "../../assets/bpmnViewIcons/EditIcon.svg";
import {
  cellSize,
  defaultShapeVertex,
  expandedViewHeight,
  expandedViewWidth,
  gridSize,
  heightForDefaultVertex,
  smallIconSize,
  swimlaneTitleWidth,
  widthForDefaultVertex,
} from "../../Constants/bpmnView";
import { style } from "../../Constants/bpmnView";
import { dimensionInMultipleOfGridSize } from "./drawOnGraph";
import { getActivityById } from "./getActivity";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxUtils = mxgraphobj.mxUtils;
const mxEvent = mxgraphobj.mxEvent;
const mxRectangle = mxgraphobj.mxRectangle;
const mxCell = mxgraphobj.mxCell;
const mxGeometry = mxgraphobj.mxGeometry;

function doNotHoverForTheseCell(graph, cell) {
  if (graph.isSwimlane(cell)) {
    return true;
  }
  return false;
}

export function collapseExpandedProcess(setProcessData) {
  setProcessData((prevData) => {
    //to keep prevState as it is
    let newData = JSON.parse(JSON.stringify(prevData));
    let isActExpanded;
    let mileId;
    newData.MileStones &&
      newData.MileStones.forEach((mile) => {
        mile.Activities &&
          mile.Activities.forEach((activity) => {
            if (activity.hide) {
              mileId = mile.iMileStoneId;
              activity.hide = false;
              isActExpanded = activity;
              mile.Width =
                +mile.Width - expandedViewWidth + widthForDefaultVertex + "";
            }
          });
      });
    newData.MileStones &&
      newData.MileStones.forEach((mile) => {
        mile.Activities &&
          mile.Activities.forEach((activity) => {
            if (
              isActExpanded &&
              activity.LaneId === isActExpanded.LaneId &&
              +activity.yTopLoc > +isActExpanded.yTopLoc &&
              +activity.xLeftLoc <=
                +isActExpanded.xLeftLoc + expandedViewWidth &&
              +activity.xLeftLoc > +isActExpanded.xLeftLoc &&
              mileId === mile.iMileStoneId
            ) {
              activity.yTopLoc =
                +activity.yTopLoc - expandedViewHeight + heightForDefaultVertex;
            }
            if (
              isActExpanded &&
              activity.LaneId === isActExpanded.LaneId &&
              +activity.xLeftLoc > +isActExpanded.xLeftLoc &&
              mileId === mile.iMileStoneId
            ) {
              activity.xLeftLoc =
                +activity.xLeftLoc - expandedViewWidth + widthForDefaultVertex;
            }
          });
      });
    newData.Lanes &&
      newData.Lanes.forEach((lane) => {
        if (isActExpanded && lane.LaneId === isActExpanded.LaneId) {
          lane.Height =
            +lane.Height - expandedViewHeight + heightForDefaultVertex;
        }
      });
    return newData;
  });
}

export function expandEmbeddedProcess(graph, cell1, setProcessData) {
  let mileId;
  let cellById = new Map();
  var vertex = new mxCell(
    null,
    new mxGeometry(0, 0, 0, 0),
    style.expandedEmbeddedProcess
  );
  vertex.setVertex(true);
  vertex.setConnectable(false);
  vertex.setId(cell1.id);
  graph.addCell(vertex);
  vertex.geometry.width = expandedViewWidth;
  vertex.geometry.height = expandedViewHeight;
  vertex.geometry.x = cell1.geometry.x + swimlaneTitleWidth;
  vertex.geometry.y = cell1.geometry.y + cell1.parent.geometry.y;
  let btnDiv = document.createElement("div");
  btnDiv.setAttribute(
    "style",
    `position:absolute;display:flex;justify-content:end;z-index:10;width:${expandedViewWidth}px;padding:0.5vw 1vw;`
  );
  btnDiv.style.left = cell1.geometry.x + swimlaneTitleWidth + "px";
  btnDiv.style.top = cell1.geometry.y + cell1.parent.geometry.y + "px";
  let collapseBtn = document.createElement("button");
  collapseBtn.setAttribute(
    "style",
    "cursor:pointer;font: normal normal normal 10px/14px Open Sans;letter-spacing: 0px;color: #4A4A4A;background: transparent;border: none;"
  );
  let collapseSpan = document.createElement("span");
  collapseSpan.innerHTML = "Collapse";
  collapseBtn.appendChild(collapseSpan);
  btnDiv.appendChild(collapseBtn);
  collapseBtn.addEventListener("click", () => {
    let layers = graph.getChildVertices();
    layers &&
      layers.forEach((layer) => {
        if (layer.getStyle() === style.expandedEmbeddedProcess) {
          graph.removeCells([layer]);
        }
      });
    graph.view.graph.container.removeChild(btnDiv);
    collapseExpandedProcess(setProcessData);
  });
  graph.view.graph.container.appendChild(btnDiv);
  setProcessData((prevData) => {
    //to keep prevState as it is
    let newData = JSON.parse(JSON.stringify(prevData));
    let xLeftLocAct;
    let yTopLocAct;
    let newWidth = expandedViewWidth - widthForDefaultVertex;
    let embeddedConn = [];
    newData.MileStones &&
      newData.MileStones.forEach((mile, index) => {
        mile.Activities.forEach((activity) => {
          if (activity.ActivityId === cell1.id) {
            mileId = mile.iMileStoneId;
            activity.hide = true;
            xLeftLocAct = +activity.xLeftLoc;
            yTopLocAct = +activity.yTopLoc;
            vertex.setId(cell1.id);
            activity.EmbeddedActivity[0] &&
              activity.EmbeddedActivity[0].forEach((act) => {
                let x = dimensionInMultipleOfGridSize(+act.xLeftLoc);
                let y = dimensionInMultipleOfGridSize(+act.yTopLoc);
                let activityObj = getActivityById(
                  act.ActivityType,
                  act.ActivitySubType
                );
                if (x < 0) {
                  x = gridSize;
                }
                let vertex12;
                if (
                  activityObj &&
                  defaultShapeVertex.includes(activityObj.styleName)
                ) {
                  vertex12 = new mxCell(
                    act.ActivityName,
                    new mxGeometry(
                      x,
                      y,
                      widthForDefaultVertex,
                      heightForDefaultVertex
                    ),
                    act.hide && activityObj.styleName === style.subProcess
                      ? `${activityObj.styleName};opacity=0;noLabel=true`
                      : activityObj.styleName
                  );
                } else if (activityObj) {
                  vertex12 = new mxCell(
                    act.ActivityName,
                    new mxGeometry(x, y, cellSize.w, cellSize.h),
                    activityObj.styleName
                  );
                }
                vertex12.setVertex(true);
                embeddedConn.push(act.ActivityId);
                vertex12.setId(act.ActivityId);
                vertex.insert(vertex12);
                cellById.set(act.ActivityId, vertex12);
              });
          }
        });
      });
    newData.MileStones &&
      newData.MileStones.forEach((mile) => {
        if (mile.iMileStoneId === mileId) {
          mile.Activities.forEach((activity) => {
            if (
              activity.LaneId === cell1.parent.id &&
              +activity.xLeftLoc > xLeftLocAct
            ) {
              activity.xLeftLoc =
                +activity.xLeftLoc + expandedViewWidth - widthForDefaultVertex;
            }
            if (
              activity.LaneId === cell1.parent.id &&
              +activity.yTopLoc > yTopLocAct &&
              +activity.xLeftLoc <= xLeftLocAct + expandedViewWidth &&
              +activity.xLeftLoc > xLeftLocAct
            ) {
              activity.yTopLoc =
                +activity.yTopLoc + expandedViewHeight - heightForDefaultVertex;
            }
          });
          let width = +mile.Width + newWidth;
          mile.Width = width;
        }
      });
    newData.Connections &&
      newData.Connections.forEach((con) => {
        if (
          embeddedConn.includes(con.SourceId) &&
          embeddedConn.includes(con.TargetId)
        ) {
          graph.insertEdge(
            null,
            con.ConnectionId,
            "",
            cellById.get(con.SourceId),
            cellById.get(con.TargetId),
            "edgeStyle=orthogonalEdgeStyle;orthogonalLoop=1;jettySize=auto;html=1;startFill=1;strokeColor=black;strokeWidth=1;"
          );
        }
      });
    newData.Lanes &&
      newData.Lanes.forEach((lane) => {
        if (lane.LaneId === cell1.parent.id) {
          lane.Height =
            +lane.Height + expandedViewHeight - heightForDefaultVertex;
        }
      });
    return newData;
  });
  graph.refresh();
}

function mxIconSet(state, graph, setProcessData, t) {
  this.images = [];
  var graph = state.view.graph;
  if (doNotHoverForTheseCell(graph, state.cell)) {
    this.destroy();
    return;
  }
  var img = mxUtils.createImage(editIcon);
  img.setAttribute("title", `${t("edit")}`);
  img.style.position = "absolute";
  img.style.cursor = "pointer";
  img.style.width = cellSize.w / 2 + "px";
  img.style.height = cellSize.h / 2 + "px";
  img.style.left =
    state.text.boundingBox.x +
    state.text.boundingBox.width / 2 -
    cellSize.w / 4 +
    "px";
  img.style.top =
    state.text.boundingBox.y + state.text.boundingBox.height + "px";
  img.style.zIndex = 100;
  mxEvent.addGestureListeners(
    img,
    mxUtils.bind(this, function (evt) {
      // Disables dragging the image
      mxEvent.consume(evt);
    })
  );
  mxEvent.addListener(
    img,
    "click",
    mxUtils.bind(this, function (evt) {
      graph.startEditingAtCell(state.cell);
      mxEvent.consume(evt);
      this.destroy();
    })
  );
  state.view.graph.container.appendChild(img);
  this.images.push(img);
  if (
    state.cell.style === style.subProcess ||
    state.cell.style === style.callActivity
  ) {
    var img = mxUtils.createImage(hoverIcon);
    img.setAttribute("title", "Expand");
    img.style.opacity = 0;
    img.style.position = "absolute";
    img.style.cursor = "pointer";
    img.style.width = cellSize.w / 2 + "px";
    img.style.height = cellSize.h / 2 + "px";
    img.style.left = state.x + state.width / 2 - cellSize.w / 4 + "px";
    img.style.top =
      state.y + state.height - smallIconSize.h - cellSize.h / 4 + "px";
    img.style.zIndex = 100;
    mxEvent.addGestureListeners(
      img,
      mxUtils.bind(this, function (evt) {
        // Disables dragging the image
        mxEvent.consume(evt);
      })
    );
    mxEvent.addListener(
      img,
      "click",
      mxUtils.bind(this, function (evt) {
        expandEmbeddedProcess(graph, state.cell, setProcessData);
        mxEvent.consume(evt);
        this.destroy();
      })
    );
    state.view.graph.container.appendChild(img);
    this.images.push(img);
  }
}

mxIconSet.prototype.destroy = function () {
  if (this.images != null) {
    for (var i = 0; i < this.images.length; i++) {
      var img = this.images[i];
      img.parentNode.removeChild(img);
    }
  }
  this.images = null;
};

export function cellOnMouseHover(graph, setProcessData, translation) {
  // Defines the tolerance before removing the icons
  var iconTolerance = 20;

  // Shows icons if the mouse is over a cell
  graph.addMouseListener({
    currentState: null,
    currentIconSet: null,
    mouseDown: function (sender, me) {
      // Hides icons on mouse down
      if (this.currentState != null) {
        this.dragLeave(me.getEvent(), this.currentState);
        this.currentState = null;
      }
    },
    mouseMove: function (sender, me) {
      if (
        this.currentState != null &&
        (me.getState() == this.currentState || me.getState() == null)
      ) {
        var tol = iconTolerance;
        var tmp = new mxRectangle(
          me.getGraphX() - tol,
          me.getGraphY() - tol,
          2 * tol,
          2 * tol
        );
        // if (mxUtils.intersects(tmp, this.currentState)) {
        //     return;
        // }
      }
      var tmp = graph.view.getState(me.getCell());
      // Ignores everything but vertices
      if (
        graph.isMouseDown ||
        (tmp != null && !graph.getModel().isVertex(tmp.cell))
      ) {
        tmp = null;
      }
      if (tmp != this.currentState) {
        if (this.currentState != null) {
          this.dragLeave(me.getEvent(), this.currentState);
        }
        this.currentState = tmp;
        if (this.currentState != null) {
          this.dragEnter(me.getEvent(), this.currentState);
        }
      }
    },
    mouseUp: function (sender, me) {},
    dragEnter: function (evt, state) {
      if (this.currentIconSet === null) {
        this.currentIconSet = new mxIconSet(
          state,
          graph,
          setProcessData,
          translation
        );
      }
    },
    dragLeave: function (evt, state) {
      if (this.currentIconSet != null) {
        this.currentIconSet.destroy();
        this.currentIconSet = null;
      }
    },
  });
}
