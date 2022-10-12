import { cellSize, graphGridSize, gridSize } from "../../Constants/bpmnView";
import { deleteCell } from "./deleteCell";

let contextMenu = document.createElement("div");
let section = [];
let visibility = false;
let dummy_graph;

const clearOldValues = () => {
  if (section != null) {
    for (var i of section) {
      var img = i;
      img.parentNode.removeChild(img);
    }
  }
  section = [];
};

const rename = (graph, cell) => {
  graph.startEditingAtCell(cell);
  removeMileContextMenu();
};

const deleteMile = (graph, cell, setProcessData, t, dispatch) => {
  graph.setSelectionCell(cell);
  deleteCell(graph, setProcessData, null, null, dispatch, t);
  removeMileContextMenu();
};

const createElement = (name, elementContextMenu, elementSection, funcName) => {
  let element = document.createElement("p");
  element.innerHTML = name;
  element.setAttribute(
    "style",
    "font-size: 11px;color: #000000;padding:0.125rem 0.5vw;"
  );
  //add background color on hover
  element.addEventListener("mouseenter", () => {
    element.style.background = "#f5f5f5";
  });
  element.addEventListener("mouseleave", () => {
    element.style.background = "white";
  });
  if (funcName) {
    element.addEventListener("click", funcName);
  }
  elementContextMenu.appendChild(element);
  elementSection.push(element);
};

export function getMileContextMenu(graph, setProcessData, cell, t, state, dispatch) {
  clearOldValues();
  dummy_graph = graph;
  visibility = true;
  contextMenu.setAttribute(
    "style",
    "border: 1px solid #DADADA;box-shadow: 0px 3px 6px #DADADA; border-radius: 2px; background: white; position: absolute; flex-wrap: wrap; cursor: pointer; justify-content: center; z-index:100; padding:0.25rem 0"
  );
  contextMenu.style.left =
    state.text.boundingBox.x +
    state.text.boundingBox.width +
    graphGridSize +
    "px";
  contextMenu.style.top =
    state.text.boundingBox.y +
    state.text.boundingBox.height / 2 +
    cellSize.h / 4 +
    "px";
  contextMenu.style.width = 3 * gridSize + "px";

  createElement(t("Rename"), contextMenu, section, () => rename(graph, cell));
  createElement(t("Delete"), contextMenu, section, () =>
    deleteMile(graph, cell, setProcessData, t, dispatch)
  );
  graph.view.graph.container.appendChild(contextMenu);
}

export function removeMileContextMenu() {
  if (
    visibility &&
    dummy_graph &&
    contextMenu.parentNode === dummy_graph.view.graph.container
  ) {
    dummy_graph.view.graph.container.removeChild(contextMenu);
    clearOldValues();
    visibility = false;
  }
}
