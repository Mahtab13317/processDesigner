import {
  AddVertexType,
  graphGridSize,
  MoveVertexType,
  swimlaneTitleWidth,
} from "../../Constants/bpmnView";
import { dimensionInMultipleOfGridSize } from "./drawOnGraph";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxConstants = mxgraphobj.mxConstants;

export const getSwimlaneAt = function (x, y, parent, graph, type) {
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
        var result = getSwimlaneAt(x, y, child, graph, type);
        if (result != null) {
          let horizontal = graph
            .getStylesheet()
            .getCellStyle(result.getStyle())[mxConstants.STYLE_HORIZONTAL];
          if (horizontal === false) {
            if (type === AddVertexType) {
              if (result.geometry.x + swimlaneTitleWidth + graphGridSize < x) {
                return result;
              } else {
                return null;
              }
            } else if (type === MoveVertexType) {
              if (result.geometry.x + swimlaneTitleWidth + graphGridSize <= x) {
                return result;
              } else {
                return null;
              }
            }
          }
        } else if (graph.isCellVisible(child) && graph.isSwimlane(child)) {
          var state = graph.view.getState(child);
          if (graph.intersects(state, x, y)) {
            let horizontal = graph
              .getStylesheet()
              .getCellStyle(child.getStyle())[mxConstants.STYLE_HORIZONTAL];
            if (horizontal === false) {
              if (child.geometry.x + swimlaneTitleWidth + graphGridSize < x) {
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

export const getTasklaneAt = function (x, y, parent, graph, type) {
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
        var result = getSwimlaneAt(x, y, child, graph, type);
        if (result != null) {
          let horizontal = graph
            .getStylesheet()
            .getCellStyle(result.getStyle())[mxConstants.STYLE_HORIZONTAL];
          if (horizontal === false) {
            if (type === AddVertexType) {
              if (
                result.geometry.x + swimlaneTitleWidth + graphGridSize < x &&
                y > graphGridSize
              ) {
                return result;
              } else {
                return null;
              }
            } else if (type === MoveVertexType) {
              if (
                result.geometry.x + swimlaneTitleWidth + graphGridSize < x &&
                y > graphGridSize
              ) {
                return result;
              } else {
                return null;
              }
            }
          }
        } else if (graph.isCellVisible(child) && graph.isSwimlane(child)) {
          var state = graph.view.getState(child);
          if (graph.intersects(state, x, y)) {
            let horizontal = graph
              .getStylesheet()
              .getCellStyle(child.getStyle())[mxConstants.STYLE_HORIZONTAL];
            if (horizontal === false) {
              if (
                child.geometry.x + swimlaneTitleWidth + graphGridSize < x &&
                y > graphGridSize
              ) {
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
