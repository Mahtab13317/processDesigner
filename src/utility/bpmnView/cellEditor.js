import { nameValidity } from "./nameValidity";
import { renameMilestone } from "../CommonAPICall/RenameMilestone";
import { renameSwimlane } from "../CommonAPICall/RenameSwimlane";
import { renameActivity } from "../CommonAPICall/RenameActivity";
import { maxLabelCharacter, style } from "../../Constants/bpmnView";
import { renameTask } from "../CommonAPICall/RenameTask";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxConstants = mxgraphobj.mxConstants;
const mxRectangle = mxgraphobj.mxRectangle;
const mxUtils = mxgraphobj.mxUtils;
const mxClient = mxgraphobj.mxClient;
const mxText = mxgraphobj.mxText;
const mxEvent = mxgraphobj.mxEvent;

function enableInplaceEditing(graph, cellEditor, bds) {
  // enable inplace editting for swimlane
  if (graph.isSwimlane(cellEditor.editingCell)) {
    let horizontal = graph
      .getStylesheet()
      .getCellStyle(cellEditor.editingCell.getStyle())[
      mxConstants.STYLE_HORIZONTAL
    ];
    if (horizontal === false) {
      var tmp = bds.height;
      bds.height = cellEditor.editingCell.geometry.height;
      bds.width = tmp;
      cellEditor.textarea.style.writingMode = "vertical-rl";
      //cellEditor.textarea.style.transform = 'rotate(45deg)';
    }
  }
}

export function cellEditor(graph, displayMessage, setProcessData, translation) {
  //overwrites resize function to enable inplace editting for swimlane
  graph.cellEditor.resize = function () {
    var state = this.graph.getView().getState(this.editingCell);
    if (state == null) {
      this.stopEditing(true);
    } else if (this.textarea != null) {
      //overwrite getLabelBounds of mxShape
      //state.shape.getLabelBounds = getLabelBounds;

      var isEdge = this.graph.getModel().isEdge(state.cell);
      var scale = this.graph.getView().scale;
      var m = null;

      // to stop editing of name on double click on activity
      if (
        this.trigger &&
        this.trigger.type === "dblclick" &&
        !isEdge &&
        !graph.isSwimlane(state.cell)
      ) {
        this.stopEditing();
      } else {
        if (
          !this.autoSize ||
          state.style[mxConstants.STYLE_OVERFLOW] == "fill"
        ) {
          // Specifies the bounds of the editor box
          this.bounds = this.getEditorBounds(state);
          this.textarea.style.width =
            Math.round(this.bounds.width / scale) + "px";
          this.textarea.style.height =
            Math.round(this.bounds.height / scale) + "px";

          // FIXME: Offset when scaled
          if (document.documentMode == 8 || mxClient.IS_QUIRKS) {
            this.textarea.style.left = Math.round(this.bounds.x) + "px";
            this.textarea.style.top = Math.round(this.bounds.y) + "px";
          } else {
            this.textarea.style.left =
              Math.max(0, Math.round(this.bounds.x + 1)) + "px";
            this.textarea.style.top =
              Math.max(0, Math.round(this.bounds.y + 1)) + "px";
          }

          // Installs native word wrapping and avoids word wrap for empty label placeholder
          if (
            this.graph.isWrapping(state.cell) &&
            (this.bounds.width >= 2 || this.bounds.height >= 2) &&
            this.textarea.innerHTML != this.getEmptyLabelText()
          ) {
            this.textarea.style.wordWrap = mxConstants.WORD_WRAP;
            this.textarea.style.whiteSpace = "normal";

            if (state.style[mxConstants.STYLE_OVERFLOW] != "fill") {
              this.textarea.style.width =
                Math.round(this.bounds.width / scale) +
                this.wordWrapPadding +
                "px";
            }
          } else {
            this.textarea.style.whiteSpace = "nowrap";

            if (state.style[mxConstants.STYLE_OVERFLOW] != "fill") {
              this.textarea.style.width = "";
            }
          }
        } else {
          var lw = mxUtils.getValue(
            state.style,
            mxConstants.STYLE_LABEL_WIDTH,
            null
          );
          m =
            state.text != null && this.align == null ? state.text.margin : null;

          if (m == null) {
            m = mxUtils.getAlignmentAsPoint(
              this.align ||
                mxUtils.getValue(
                  state.style,
                  mxConstants.STYLE_ALIGN,
                  mxConstants.ALIGN_CENTER
                ),
              mxUtils.getValue(
                state.style,
                mxConstants.STYLE_VERTICAL_ALIGN,
                mxConstants.ALIGN_MIDDLE
              )
            );
          }

          if (isEdge) {
            this.bounds = new mxRectangle(
              state.absoluteOffset.x,
              state.absoluteOffset.y,
              0,
              0
            );

            if (lw != null) {
              var tmp = (parseFloat(lw) + 2) * scale;
              this.bounds.width = tmp;
              this.bounds.x += m.x * tmp;
            }
          } else {
            var bds = mxRectangle.fromRectangle(state);
            var hpos = mxUtils.getValue(
              state.style,
              mxConstants.STYLE_LABEL_POSITION,
              mxConstants.ALIGN_CENTER
            );
            var vpos = mxUtils.getValue(
              state.style,
              mxConstants.STYLE_VERTICAL_LABEL_POSITION,
              mxConstants.ALIGN_MIDDLE
            );

            bds =
              state.shape != null &&
              hpos == mxConstants.ALIGN_CENTER &&
              vpos == mxConstants.ALIGN_MIDDLE
                ? state.shape.getLabelBounds(bds)
                : bds;

            enableInplaceEditing(graph, this, bds);

            if (lw != null) {
              bds.width = parseFloat(lw) * scale;
            }

            if (
              !state.view.graph.cellRenderer.legacySpacing ||
              state.style[mxConstants.STYLE_OVERFLOW] != "width"
            ) {
              var spacing =
                parseInt(state.style[mxConstants.STYLE_SPACING] || 2) * scale;
              var spacingTop =
                (parseInt(state.style[mxConstants.STYLE_SPACING_TOP] || 0) +
                  mxText.prototype.baseSpacingTop) *
                  scale +
                spacing;
              var spacingRight =
                (parseInt(state.style[mxConstants.STYLE_SPACING_RIGHT] || 0) +
                  mxText.prototype.baseSpacingRight) *
                  scale +
                spacing;
              var spacingBottom =
                (parseInt(state.style[mxConstants.STYLE_SPACING_BOTTOM] || 0) +
                  mxText.prototype.baseSpacingBottom) *
                  scale +
                spacing;
              var spacingLeft =
                (parseInt(state.style[mxConstants.STYLE_SPACING_LEFT] || 0) +
                  mxText.prototype.baseSpacingLeft) *
                  scale +
                spacing;

              var hpos = mxUtils.getValue(
                state.style,
                mxConstants.STYLE_LABEL_POSITION,
                mxConstants.ALIGN_CENTER
              );
              var vpos = mxUtils.getValue(
                state.style,
                mxConstants.STYLE_VERTICAL_LABEL_POSITION,
                mxConstants.ALIGN_MIDDLE
              );

              bds = new mxRectangle(
                bds.x + spacingLeft,
                bds.y + spacingTop,
                bds.width -
                  (hpos == mxConstants.ALIGN_CENTER && lw == null
                    ? spacingLeft + spacingRight
                    : 0),
                bds.height -
                  (vpos == mxConstants.ALIGN_MIDDLE
                    ? spacingTop + spacingBottom
                    : 0)
              );
            }

            this.bounds = new mxRectangle(
              bds.x + state.absoluteOffset.x,
              bds.y + state.absoluteOffset.y,
              bds.width,
              bds.height
            );
          }

          // Needed for word wrap inside text blocks with oversize lines to match the final result where
          // the width of the longest line is used as the reference for text alignment in the cell
          // TODO: Fix word wrapping preview for edge labels in helloworld.html
          if (
            this.graph.isWrapping(state.cell) &&
            this.textarea &&
            this.textarea.innerHTML != this.getEmptyLabelText() &&
            this.textarea.innerHTML.length <= maxLabelCharacter &&
            this.bounds &&
            (this.bounds.width >= 2 || this.bounds.height >= 2)
          ) {
            this.textarea.style.wordWrap = mxConstants.WORD_WRAP;
            this.textarea.style.whiteSpace = "normal";

            // Forces automatic reflow if text is removed from an oversize label and normal word wrap
            var tmp =
              Math.round(
                this.bounds.width / (document.documentMode == 8 ? scale : scale)
              ) + this.wordWrapPadding;

            if (this.textarea.style.position != "relative") {
              this.textarea.style.width = tmp + "px";

              if (this.textarea.scrollWidth > tmp) {
                this.textarea.style.width = this.textarea.scrollWidth + "px";
              }
            } else {
              this.textarea.style.maxWidth = tmp + "px";
            }
          } else {
            // KNOWN: Trailing cursor in IE9 quirks mode is not visible
            this.textarea.style.whiteSpace = "nowrap";
            this.textarea.style.width = "";
          }

          // LATER: Keep in visible area, add fine tuning for pixel precision
          // Workaround for wrong measuring in IE8 standards
          if (document.documentMode == 8) {
            this.textarea.style.zoom = "1";
            this.textarea.style.height = "auto";
          }

          var ow = this.textarea.scrollWidth;
          var oh = this.textarea.scrollHeight;

          // TODO: Update CSS width and height if smaller than minResize or remove minResize
          //if (this.minResize != null)
          //{
          //	ow = Math.max(ow, this.minResize.width);
          //	oh = Math.max(oh, this.minResize.height);
          //}

          // LATER: Keep in visible area, add fine tuning for pixel precision
          if (document.documentMode == 8) {
            // LATER: Scaled wrapping and position is wrong in IE8
            this.textarea.style.left =
              Math.max(
                0,
                Math.ceil(
                  (this.bounds.x -
                    m.x * (this.bounds.width - (ow + 1) * scale) +
                    ow * (scale - 1) * 0 +
                    (m.x + 0.5) * 2) /
                    scale
                )
              ) + "px";
            this.textarea.style.top =
              Math.max(
                0,
                Math.ceil(
                  (this.bounds.y -
                    m.y * (this.bounds.height - (oh + 0.5) * scale) +
                    oh * (scale - 1) * 0 +
                    Math.abs(m.y + 0.5) * 1) /
                    scale
                )
              ) + "px";
            // Workaround for wrong event handling width and height
            this.textarea.style.width = Math.round(ow * scale) + "px";
            this.textarea.style.height = Math.round(oh * scale) + "px";
          } else if (mxClient.IS_QUIRKS) {
            this.textarea.style.left =
              Math.max(
                0,
                Math.ceil(
                  this.bounds.x -
                    m.x * (this.bounds.width - (ow + 1) * scale) +
                    ow * (scale - 1) * 0 +
                    (m.x + 0.5) * 2
                )
              ) + "px";
            this.textarea.style.top =
              Math.max(
                0,
                Math.ceil(
                  this.bounds.y -
                    m.y * (this.bounds.height - (oh + 0.5) * scale) +
                    oh * (scale - 1) * 0 +
                    Math.abs(m.y + 0.5) * 1
                )
              ) + "px";
          } else {
            this.textarea.style.left =
              Math.max(
                0,
                Math.round(this.bounds.x - m.x * (this.bounds.width - 2)) + 1
              ) + "px";
            this.textarea.style.top =
              Math.max(
                0,
                Math.round(
                  this.bounds.y -
                    m.y * (this.bounds.height - 4) +
                    (m.y == -1 ? 3 : 0)
                ) + 1
              ) + "px";
          }
        }

        if (mxClient.IS_VML) {
          this.textarea.style.zoom = scale;
        } else {
          mxUtils.setPrefixedStyle(
            this.textarea.style,
            "transformOrigin",
            "0px 0px"
          );
          mxUtils.setPrefixedStyle(
            this.textarea.style,
            "transform",
            "scale(" +
              scale +
              "," +
              scale +
              ")" +
              (m == null
                ? ""
                : " translate(" + m.x * 100 + "%," + m.y * 100 + "%)")
          );
        }
        if (
          this.textarea.innerHTML != this.getEmptyLabelText() &&
          this.textarea.innerHTML.length >= maxLabelCharacter &&
          this.editingCell.value.length < maxLabelCharacter
        ) {
          // code added on 17 June 2022 for BugId 110065
          if (this.textarea.innerHTML.length > maxLabelCharacter) {
            const timeout = setTimeout(() => {
              this.textarea.innerHTML = this.editingCell.value;
              this.stopEditing();
            }, 500);
            return () => clearTimeout(timeout);
          } else {
            this.stopEditing();
          }
        }
      }
    }
  };

  /**
   * Function: stopEditing
   *
   * Stops the editor and applies the value if cancel is false.
   */
  graph.cellEditor.stopEditing = function (cancel) {
    cancel = cancel || false;

    if (this.editingCell != null) {
      if (this.textNode != null) {
        this.textNode.style.visibility = "visible";
        this.textNode = null;
      }

      var state = !cancel ? this.graph.view.getState(this.editingCell) : null;

      var initial = this.initialValue;
      this.initialValue = null;
      this.editingCell = null;
      this.trigger = null;
      this.bounds = null;
      this.textarea.blur();
      this.clearSelection();

      if (this.textarea.parentNode != null) {
        this.textarea.parentNode.removeChild(this.textarea);
      }

      if (
        this.clearOnChange &&
        this.textarea.innerHTML == this.getEmptyLabelText()
      ) {
        this.textarea.innerHTML = "";
        this.clearOnChange = false;
      }

      if (
        state != null &&
        (this.textarea.innerHTML != initial || this.align != null)
      ) {
        this.prepareTextarea();
        var value = this.getCurrentValue(state);
        var [validValue, message] = nameValidity(value, state.cell);

        if (value != null && validValue === true) {
          //this.applyValue(state, value);
          let id = state.cell.getId();
          if (graph.isSwimlane(state.cell)) {
            let horizontal = graph
              .getStylesheet()
              .getCellStyle(state.cell.getStyle())[
              mxConstants.STYLE_HORIZONTAL
            ];

            if (horizontal) {
              //cell edited is milestone
              let oldMilestoneName, processDefId;
              setProcessData((prevProcessData) => {
                let newProcessData = JSON.parse(JSON.stringify(prevProcessData));
                newProcessData.MileStones.forEach((milestone, idx) => {
                  if (milestone.iMileStoneId === id) {
                    oldMilestoneName = milestone.MileStoneName;
                    newProcessData.MileStones[idx].MileStoneName = value;
                  }
                });
                processDefId = newProcessData.ProcessDefId;
                return newProcessData;
              });
              renameMilestone(
                id,
                oldMilestoneName,
                value,
                setProcessData,
                processDefId,
                true
              );
            } else {
              //cell edited is swimlane
              let oldLaneName, queueId, processDefId, processName;
              setProcessData((prevProcessData) => {
                let newProcessData = JSON.parse(JSON.stringify(prevProcessData));
                newProcessData.Lanes.forEach((swimlane, idx) => {
                  if (swimlane.LaneId === id) {
                    oldLaneName = swimlane.LaneName;
                    queueId = swimlane.QueueId;
                    newProcessData.Lanes[idx].LaneName = value;
                  }
                });
                processDefId = newProcessData.ProcessDefId;
                processName = newProcessData.ProcessName;
                return newProcessData;
              });
              renameSwimlane(
                id,
                oldLaneName,
                value,
                queueId,
                setProcessData,
                processDefId,
                processName,
                translation,
                true
              );
            }
          } else {
            if (
              state.cell.getStyle() === style.taskTemplate ||
              state.cell.getStyle() === style.newTask ||
              state.cell.getStyle() === style.processTask
            ) {
              //cell edited is task
              let oldTaskName, processDefId;
              setProcessData((prevProcessData) => {
                let newProcessData = JSON.parse(JSON.stringify(prevProcessData));
                newProcessData.Tasks.forEach((task, idx) => {
                  if (task.TaskId === id) {
                    oldTaskName = task.TaskName;
                    newProcessData.Tasks[idx].TaskName = value;
                  }
                });
                processDefId = prevProcessData.ProcessDefId;
                return newProcessData;
              });
              renameTask(id, oldTaskName, value, processDefId);
            } else if (
              state.cell.getStyle() !== style.taskTemplate &&
              state.cell.getStyle() !== style.newTask &&
              state.cell.getStyle() !== style.processTask
            ) {
              //cell edited is activity
              let oldActName, queueId, processDefId, processName;
              setProcessData((prevProcessData) => {
                let newProcessData = JSON.parse(JSON.stringify(prevProcessData));
                newProcessData.MileStones.forEach((milestone, idx) => {
                  milestone.Activities.forEach((activity, actidx) => {
                    if (activity.ActivityId === id) {
                      oldActName = activity.ActivityName;
                      queueId = activity.queueId;
                      newProcessData.MileStones[idx].Activities[
                        actidx
                      ].ActivityName = value;
                    }
                  });
                });
                processDefId = prevProcessData.ProcessDefId;
                processName = prevProcessData.ProcessName;
                return newProcessData;
              });
              renameActivity(
                id,
                oldActName,
                value,
                setProcessData,
                processDefId,
                processName,
                queueId,
                true,
                state
              );
            }
          }
        }

        if (validValue === false && message !== null) {
          displayMessage(message);
        }
      }

      // Forces new instance on next edit for undo history reset
      mxEvent.release(this.textarea);
      this.textarea = null;
      this.align = null;
    }
  };
}
