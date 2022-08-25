import React, { useState } from "react";
import AddToListDropdown from "../../../../../../../UI/AddToListDropdown/AddToListDropdown";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { Box, Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { addTaskAPI } from "../../../../../../../utility/CommonAPICall/AddTask";
import { deassociateTask } from "../../../../../../../utility/CommonAPICall/DeassociateTask";
import { associateTask } from "../../../../../../../utility/CommonAPICall/AssociateTask";
import { PROCESSTYPE_LOCAL } from "../../../../../../../Constants/appConstants";
import TaskAbstract from "../../../../../../../assets/abstractView/Icons/PD_Task - Abstract.svg";
import {
  gridSize,
  swimlaneTitleWidth,
  widthForDefaultVertex,
} from "../../../../../../../Constants/bpmnView";

export const TaskInActivity = (props) => {
  let { t } = useTranslation();
  const [addTask, setAddTask] = useState(false);

  const activityName =
    props.processData.MileStones[props.milestoneIndex].Activities[
      props.activityindex
    ].ActivityName;

  const activityId =
    props.processData.MileStones[props.milestoneIndex].Activities[
      props.activityindex
    ].ActivityId;

  const tasks =
    props.processData.MileStones[props.milestoneIndex].Activities[
      props.activityindex
    ].AssociatedTasks;

  const associatedTask = tasks
    ? tasks.map((elem) => {
        return props.processData.Tasks.find((elem1) => {
          if (elem1.TaskId === elem) {
            return elem1;
          }
        });
      })
    : [];

  const taskData = props.processData.Tasks?.map((x) => {
    return {
      id: x.TaskId,
      name: x.TaskName,
    };
  });

  const selectedTaskList = associatedTask?.map((ele) => {
    return ele.TaskId;
  });

  const addNewTaskToList = (value) => {
    let maxId = 0;
    let maxXLeftLoc = 0;
    let maxYTopLoc = gridSize;
    let laneHeightIncreasedFlag = false;
    let mileWidth = swimlaneTitleWidth,
      lanesInfo = {};

    let newProcessData = JSON.parse(JSON.stringify(props.processData));
    newProcessData.MileStones?.forEach((mile) => {
      mileWidth = mileWidth + +mile.Width;
    });
    for (let i of newProcessData.Tasks) {
      if (+i.xLeftLoc > maxXLeftLoc) {
        maxXLeftLoc = +i.xLeftLoc;
      }
      if (maxId < +i.TaskId) {
        maxId = +i.TaskId;
      }
    }
    if (+maxXLeftLoc > 0) {
      maxXLeftLoc = +maxXLeftLoc + gridSize + widthForDefaultVertex;
    } else {
      maxXLeftLoc = +maxXLeftLoc + gridSize * 2;
    }
    if (+maxXLeftLoc + widthForDefaultVertex + gridSize > mileWidth) {
      laneHeightIncreasedFlag = true;
      newProcessData.Lanes[0].oldWidth = mileWidth;
      newProcessData.Lanes[0].Width =
        +maxXLeftLoc + widthForDefaultVertex + gridSize;
      let lastMileWidth =
        +newProcessData.MileStones[newProcessData.MileStones?.length - 1].Width;
      newProcessData.MileStones[newProcessData.MileStones?.length - 1].Width =
        lastMileWidth +
        +maxXLeftLoc +
        widthForDefaultVertex +
        gridSize -
        +mileWidth;
    }
    props.setprocessData(newProcessData);

    if (laneHeightIncreasedFlag) {
      lanesInfo = {
        pMSwimlaneInfo: {
          laneId: newProcessData.Lanes[0].LaneId,
          laneName: newProcessData.Lanes[0].LaneName,
          laneSeqId: newProcessData.Lanes[0].LaneSeqId,
          height: newProcessData.Lanes[0].Height,
          oldHeight: newProcessData.Lanes[0].Height,
          width: newProcessData.Lanes[0].Width + "",
          oldWidth: newProcessData.Lanes[0].oldWidth + "",
        },
      };
    }
    let activityName =
      props.processData.MileStones[props.milestoneIndex].Activities[
        props.activityindex
      ].ActivityName;
    let activityId =
      props.processData.MileStones[props.milestoneIndex].Activities[
        props.activityindex
      ].ActivityId;
    addTaskAPI(
      maxId + 1,
      value,
      1, //taskType default value for new/ generic task type = 1
      maxXLeftLoc,
      maxYTopLoc,
      props.setprocessData,
      props.processData.ProcessDefId,
      props.milestoneIndex,
      props.activityindex,
      activityName,
      activityId,
      laneHeightIncreasedFlag ? lanesInfo : null,
      null
    );
  };

  const deleteTasks = (id) => {
    let taskName;
    props.processData.Tasks.forEach((elem) => {
      if (elem.TaskId === id) {
        taskName = elem.TaskName;
      }
    });
    deassociateTask(
      id,
      taskName,
      props.setprocessData,
      props.processData.ProcessDefId,
      props.milestoneIndex,
      props.activityindex,
      activityName,
      activityId
    );
  };

  const associateTaskFromList = (id, type) => {
    let taskName;
    props.processData.Tasks.forEach((elem) => {
      if (elem.TaskId === id) {
        taskName = elem.TaskName;
      }
    });
    if (type === 0) {
      associateTask(
        id,
        taskName,
        props.setprocessData,
        props.processData.ProcessDefId,
        props.milestoneIndex,
        props.activityindex,
        activityName,
        activityId
      );
    } else if (type === 1) {
      deassociateTask(
        id,
        taskName,
        props.setprocessData,
        props.processData.ProcessDefId,
        props.milestoneIndex,
        props.activityindex,
        activityName,
        activityId
      );
    }
  };

  const direction = `${t("HTML_DIR")}`;
  return (
    <Box pl={1} ml={1} style={{ marginLeft: "0" }}>
      <Grid
        container
        className="selectedActivityType"
        style={{
          display: "flex",
          color: props.color,
          background: props.BackgroundColor + " 0% 0% no-repeat padding-box",
        }}
      >
        <Grid item style={{ flex: "1", padding: "4px 8px" }}>
          <p
            className="task_count_activity"
            style={{ textAlign: direction == "rtl" ? "right" : "left" }}
          >
            {associatedTask.length}{" "}
            {associatedTask.length !== 1 ? t("tasks") : t("task")}
          </p>
        </Grid>
        <Grid
          item
          style={{
            textAlign: direction == "rtl" ? "left" : "right",
            flex: "1",
            marginTop: "4px",
          }}
        >
          <span style={{ position: "relative" }}>
            {props.processType === PROCESSTYPE_LOCAL ? (
              <AddIcon
                style={
                  addTask
                    ? { color: "#0072C6", width: "15px", height: "15px" }
                    : { color: "#606060", width: "15px", height: "15px" }
                }
                onClick={() => setAddTask(true)}
              />
            ) : null}
            {addTask ? (
              <AddToListDropdown
                processData={props.processData}
                completeList={taskData}
                multiple="true"
                onChange={associateTaskFromList}
                associatedList={selectedTaskList}
                addNewLabel={t("newTask")}
                noDataLabel={t("noTask")}
                onKeydown={addNewTaskToList}
                labelKey="name"
                handleClickAway={() => setAddTask(false)}
              />
            ) : null}
          </span>
          {props.taskExpanded && associatedTask.length > 0 ? (
            <ExpandLessIcon
              style={{ color: "#606060", width: "25px", height: "15px" }}
              onClick={() => props.setTaskExpanded(false)}
            />
          ) : (
            <ExpandMoreIcon
              style={{ color: "#606060", width: "25px", height: "15px" }}
              onClick={() => {
                if (associatedTask.length > 0) props.setTaskExpanded(true);
              }}
            />
          )}
        </Grid>
      </Grid>
      {props.taskExpanded
        ? associatedTask &&
          associatedTask.map((elem) => {
            return (
              <Grid
                container
                className="selectedActivityType"
                style={{
                  background:
                    props.BackgroundColor + " 0% 0% no-repeat padding-box",
                }}
              >
                <Grid
                  item
                  style={{
                    display: "flex",
                    padding: "4px 8px",
                    background: "white",
                    margin: "3px 8px",
                    border: "1px solid #C4C4C4",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <p className="task_activity">
                    <img
                      src={TaskAbstract}
                      style={{
                        height: "12px",
                        width: "12px",
                        marginTop: "2.5px",
                        marginRight: "4px",
                      }}
                    />
                    {elem.TaskName}
                  </p>
                  <div style={{ float: "right" }}>
                    {props.processType === PROCESSTYPE_LOCAL ? (
                      <DeleteOutlineIcon
                        style={{
                          color: "#606060",
                          width: "1rem",
                          height: "1rem",
                        }}
                        onClick={() => deleteTasks(elem.TaskId)}
                      />
                    ) : null}
                  </div>
                </Grid>
              </Grid>
            );
          })
        : null}
    </Box>
  );
};
