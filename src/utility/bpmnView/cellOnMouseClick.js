import { getToolDivCell, removeToolDivCell } from "./getToolDivCell";
import deleteIcon from "../../assets/bpmnView/workstepOnHover/Delete Workstep.png";
import settingsIcon from "../../assets/bpmnView/workstepOnHover/settings.svg";
import {
  smallIconSize,
  endVertex,
  gridSize,
  graphGridSize,
  style,
} from "../../Constants/bpmnView";
import { deleteCell } from "./deleteCell";
import { getContextMenu, removeContextMenu } from "./getContextMenu";
import { PROCESSTYPE_LOCAL } from "../../Constants/appConstants";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxUtils = mxgraphobj.mxUtils;
const mxEvent = mxgraphobj.mxEvent;
let images = [];
let div = document.createElement("div");

export function hideIcons() {
  mxIconSet.prototype.destroy();
}

function doNotHoverForTheseCell(graph, cell) {
  if (graph.isSwimlane(cell)) {
    return true;
  } else if (cell.isEdge()) {
    return true;
  } else if (cell.id === "rootLayer") {
    return true;
  } else if (cell.style === style.expandedEmbeddedProcess) {
    return true;
  }
  return false;
}

function deleteCellOnClick(
  graph,
  setProcessData,
  setTaskAssociation,
  setShowDependencyModal,
  cell
) {
  graph.setSelectionCell(cell);
  deleteCell(graph, setProcessData, setTaskAssociation, setShowDependencyModal);
  removeToolDivCell();
  removeContextMenu();
  hideIcons();
}

function editCellOnClick(
  graph,
  setProcessData,
  cell,
  translation,
  showDrawer,
  caseEnabled,
  setOpenDeployedProcess
) {
  graph.setSelectionCell(cell);
  removeToolDivCell();
  getContextMenu(
    graph,
    setProcessData,
    cell,
    translation,
    showDrawer,
    caseEnabled,
    setOpenDeployedProcess
  );
}

function mxIconSet(
  graph,
  cell,
  translation,
  setProcessData,
  showDrawer,
  setNewId,
  caseEnabled,
  setOpenDeployedProcess,
  setTaskAssociation,
  setShowDependencyModal
) {
  this.destroy();
  removeContextMenu();
  removeToolDivCell();
  if (cell !== null && cell) {
    if (doNotHoverForTheseCell(graph, cell)) {
      return;
    }
    div.setAttribute(
      "style",
      "position:absolute;cursor:pointer;display:flex;flex-direction:column;background:#ECEFF1;z-index:10"
    );
    if (cell.parent.style === "expandedEmbeddedProcess") {
      div.style.left =
        cell.geometry.x + cell.parent.geometry.x - 1.5 * graphGridSize + "px";
    } else {
      div.style.left = cell.geometry.x + gridSize * 0.3 + "px";
    }
    div.style.top = cell.geometry.y + cell.parent.geometry.y + "px";
    div.style.padding = gridSize * 0.1 + "px";

    var img1 = mxUtils.createImage(settingsIcon);
    img1.setAttribute("title", "Settings");
    img1.style.cursor = "pointer";
    img1.style.width = smallIconSize.w + "px";
    img1.style.height = smallIconSize.h + "px";
    img1.style.marginBottom = gridSize * 0.1 + "px";
    img1.addEventListener("click", () =>
      editCellOnClick(
        graph,
        setProcessData,
        cell,
        translation,
        showDrawer,
        caseEnabled,
        setOpenDeployedProcess
      )
    );
    mxEvent.addGestureListeners(
      img1,
      mxUtils.bind(this, function (evt) {
        // Disables dragging the image
        mxEvent.consume(evt);
      })
    );
    images.push(img1);
    div.appendChild(img1);

    var img = mxUtils.createImage(deleteIcon);
    img.setAttribute("title", "Delete");
    img.addEventListener("click", () =>
      deleteCellOnClick(
        graph,
        setProcessData,
        setTaskAssociation,
        setShowDependencyModal,
        cell
      )
    );
    img.style.width = smallIconSize.w + "px";
    img.style.height = smallIconSize.h + "px";

    mxEvent.addGestureListeners(
      img,
      mxUtils.bind(this, function (evt) {
        // Disables dragging the image
        mxEvent.consume(evt);
      })
    );
    images.push(img);
    div.appendChild(img);
    graph.view.graph.container.appendChild(div);
    if (!endVertex.includes(cell.style)) {
      getToolDivCell(
        graph,
        cell,
        translation,
        setProcessData,
        showDrawer,
        setNewId,
        caseEnabled
      );
    }
  } else {
    graph.clearSelection();
    if (graph && div.parentNode === graph.view.graph.container) {
      graph.view.graph.container.removeChild(div);
    }
    removeToolDivCell();
    removeContextMenu();
  }
}

mxIconSet.prototype.destroy = function () {
  if (images != null) {
    for (var i of images) {
      var img = i;
      img.parentNode.removeChild(img);
    }
  }
  images = [];
};

export function cellOnMouseClick(
  graph,
  translation,
  setProcessData,
  showDrawer,
  setNewId,
  caseEnabled,
  processType,
  setOpenDeployedProcess,
  setTaskAssociation,
  setShowDependencyModal
) {
  // code edited on 7 July 2022 for BugId 111719
  //Shows icons if the cell is clicked
  graph.addListener(mxEvent.CLICK, function (sender, evt) {
    if (processType !== PROCESSTYPE_LOCAL) {
      return;
    } else {
      var cell_click = evt.getProperty("cell"); // cell may be null
      new mxIconSet(
        graph,
        cell_click,
        translation,
        setProcessData,
        showDrawer,
        setNewId,
        caseEnabled,
        setOpenDeployedProcess,
        setTaskAssociation,
        setShowDependencyModal
      );
      if (!cell_click) {
        //hide popup menu when clicked anywhere on the graph
        graph.popupMenuHandler?.hideMenu();
      }
      evt.consume();
    }
  });
  graph.addListener("cellsInserted", function (sender, evt) {
    if (processType !== PROCESSTYPE_LOCAL) {
      return;
    } else {
      let cell = evt.getProperty("cells"); // cell may be null
      // graph.startEditingAtCell(cellState.cell);
      new mxIconSet(
        graph,
        cell,
        translation,
        setProcessData,
        showDrawer,
        setNewId,
        caseEnabled,
        setOpenDeployedProcess,
        setTaskAssociation,
        setShowDependencyModal
      );
      evt.consume();
    }
  });
  graph.addListener(mxEvent.DOUBLE_CLICK, function (sender, evt) {
    var cell_dbl = evt.getProperty("cell"); // cell may be null
    if (cell_dbl) {
      if (doNotHoverForTheseCell(graph, cell_dbl)) {
        return;
      }
      if (graph.getModel().isVertex(cell_dbl)) {
        showDrawer(true);
      }
    }
  });
}
