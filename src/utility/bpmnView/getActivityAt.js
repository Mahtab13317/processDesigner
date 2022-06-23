import { dimensionInMultipleOfGridSize } from "./drawOnGraph";

export const getActivityAt = function (
  x,
  y,
  parent,
  graph,
  widthArg,
  heightArg,
  id
) {
  let width = parseInt(widthArg);
  let height = parseInt(heightArg);
  x = dimensionInMultipleOfGridSize(x);
  y = dimensionInMultipleOfGridSize(y);
  if (parent == null) {
    parent = graph.getCurrentRoot();
    if (parent == null) {
      parent = graph.model.getRoot();
    }
  }
  if (parent != null) {
    let laneCount = graph.model.getChildCount(parent.parent);
    for (let j = 0; j < laneCount; j++) {
      var laneChild = graph.model.getChildAt(parent.parent, j);
      let childCount = graph.model.getChildCount(laneChild);
      for (let i = 0; i < childCount; i++) {
        for (let j = x; j <= x + width; j++) {
          var vertex_1 = graph.getCellAt(j, y, laneChild, true);
          if (vertex_1 !== null) {
            if (id && vertex_1.id === id) {
              return null;
            } else {
              return vertex_1;
            }
          }
        }
        for (let k = y; k <= y + height; k++) {
          var vertex_2 = graph.getCellAt(x, k, laneChild, true);
          if (vertex_2 !== null) {
            if (id && vertex_2.id === id) {
              return null;
            } else {
              return vertex_2;
            }
          }
        }
      }
    }
  }

  return null;
};

export const getTaskAt = function (
  x,
  y,
  parent,
  graph,
  widthArg,
  heightArg,
  id
) {
  let width = parseInt(widthArg);
  let height = parseInt(heightArg);
  x = dimensionInMultipleOfGridSize(x);
  y = dimensionInMultipleOfGridSize(y);
  if (parent == null) {
    parent = graph.getCurrentRoot();
    if (parent == null) {
      parent = graph.model.getRoot();
    }
  }
  if (parent != null) {
    let laneCount = graph.model.getChildCount(parent.parent);
    for (let j = 0; j < laneCount; j++) {
      var laneChild = graph.model.getChildAt(parent.parent, j);
      let childCount = graph.model.getChildCount(laneChild);
      for (let i = 0; i < childCount; i++) {
        for (let j = x; j <= x + width; j++) {
          var vertex_1 = graph.getCellAt(j, y, laneChild, true);
          if (vertex_1 !== null) {
            if (id && vertex_1.id === id) {
              return null;
            } else {
              return vertex_1;
            }
          }
        }
        for (let k = y; k <= y + height; k++) {
          var vertex_2 = graph.getCellAt(x, k, laneChild, true);
          if (vertex_2 !== null) {
            if (id && vertex_2.id === id) {
              return null;
            } else {
              return vertex_2;
            }
          }
        }
      }
    }
  }

  return null;
};
