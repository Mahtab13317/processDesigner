import { style } from "../../Constants/bpmnView";
import { dimensionInMultipleOfGridSize } from "./drawOnGraph";

export const getExpandedSubprocess = function (x, y, parent, graph) {
  x = dimensionInMultipleOfGridSize(x);
  y = dimensionInMultipleOfGridSize(y);
  let cells = graph.getChildCells();

  for (let i of cells) {
    if (i.style === style.expandedEmbeddedProcess) {
      if (
        x >= i.geometry.x &&
        x <= i.geometry.width + i.geometry.x &&
        y >= i.geometry.y &&
        y <= i.geometry.y + i.geometry.height
      ) {
        return i;
      }
    }
  }

  return null;
};
