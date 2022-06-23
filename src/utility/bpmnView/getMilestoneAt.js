import { graphGridSize } from "../../Constants/bpmnView";
import { dimensionInMultipleOfGridSize } from "./drawOnGraph";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxConstants = mxgraphobj.mxConstants;

export const getMilestoneAt = function (x, y, parent, graph) {
  x = dimensionInMultipleOfGridSize(x);
  y = dimensionInMultipleOfGridSize(y);
  if (parent == null) {
    parent = graph.getCurrentRoot();
    if (parent == null) {
      parent = graph.model.getRoot();
    }
  }

  if (parent != null) {
    var childCount = graph.model.getChildCount(parent);
    for (var i = 0; i < childCount; i++) {
      var child = graph.model.getChildAt(parent, i);
      if (child != null) {
        var result = getMilestoneAt(x, y, child, graph);
        if (result != null) {
          let horizontal = graph
            .getStylesheet()
            .getCellStyle(result.getStyle())[mxConstants.STYLE_HORIZONTAL];
          if (horizontal) {
            if (result.geometry.y + graphGridSize * 3 < y) {
              return result;
            } else {
              return null;
            }
          }
        } else if (graph.isCellVisible(child) && graph.isSwimlane(child)) {
          var state = graph.view.getState(child);
          if (graph.intersects(state, x, y)) {
            let horizontal = graph
              .getStylesheet()
              .getCellStyle(child.getStyle())[mxConstants.STYLE_HORIZONTAL];
            if (horizontal) {
              if (child.geometry.y + graphGridSize * 3 < y) {
                return child;
              } else {
                return null;
              }
            }
          }
        }
      }
    }
  }

  return null;
};
