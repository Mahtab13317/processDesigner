import React, { useState, useEffect } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import AddIcon from "@material-ui/icons/Add";
import { Box, Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { ActivityCard } from "./AssociatedActivityCard";
import {
  ENDPOINT_ADDACTIVITY,
  expandedViewOnDrop,
  PROCESSTYPE_LOCAL,
  SERVER_URL,
} from "../../../../../../../Constants/appConstants";
import { getActivityQueueObj } from "../../../../../../../utility/abstarctView/getActivityQueueObj";
import {
  defaultShapeVertex,
  graphGridSize,
  gridSize,
  widthForDefaultVertex,
} from "../../../../../../../Constants/bpmnView";
import axios from "axios";
import { connect } from "react-redux";
import * as actionCreators_process from "../../../../../../../redux-store/actions/AbstractView/EmbeddedProcessAction";
import { getActivityProps } from "../../../../../../../utility/abstarctView/getActivityProps";

const EmbeddedActivity = (props) => {
  let { t } = useTranslation();
  const { BackgroundColor } = props;
  const [addActivity, setAddActivity] = useState(false);
  const [processExpanded, setProcessExpanded] = useState(
    props.expandedProcess && expandedViewOnDrop
      ? props.expandedProcess[props.activityId]
      : false
  );
  const [embeddedActivities, setEmbeddedActivities] = useState([]);

  useEffect(() => {
    if (
      props.processData.MileStones[props.milestoneIndex].Activities[
        props.activityindex
      ].EmbeddedActivity
    ) {
      setEmbeddedActivities(
        props.processData.MileStones[props.milestoneIndex].Activities[
          props.activityindex
        ].EmbeddedActivity[0]
      );
    }
  }, []);

  useEffect(() => {
    props.setExpandedProcess({
      ...props.expandedProcess,
      [props.activityId]: processExpanded,
    });
  }, [processExpanded]);

  // Function that adds a new activity card below the card it was called from.
  const addActivityInBetween = (
    iActivityId = 10,
    iSubActivityId = 3,
    index
  ) => {
    let MaxseqId = 0,
      maxActivityId = 0,
      mileWidth = 0,
      maxXleftLoc = 0;
    const mIndex = props.milestoneIndex;
    let LaneId =
      props.processData.MileStones[mIndex].Activities[props.activityindex]
        .LaneId;
    let Lane;
    let isPreviousActDefault = false;
    props.processData.Lanes &&
      props.processData.Lanes.map((lane) => {
        if (lane.LaneId === LaneId) {
          Lane = lane;
        }
      });
    props.processData.MileStones.forEach((mile, index) => {
      mile.Activities.forEach((activity) => {
        if (+activity.SequenceId > +MaxseqId && mIndex === index) {
          MaxseqId = +activity.SequenceId;
        }
        if (+maxActivityId < +activity.ActivityId) {
          maxActivityId = +activity.ActivityId;
        }
        if (activity.EmbeddedActivity) {
          activity.EmbeddedActivity[0].forEach((embAct) => {
            if (+embAct.SequenceId > +MaxseqId) {
              MaxseqId = +embAct.SequenceId;
            }
            if (
              !(+embAct.ActivityType === 2 && +embAct.ActivitySubType === 1)
            ) {
              if (+maxXleftLoc < +embAct.xLeftLoc) {
                maxXleftLoc = +embAct.xLeftLoc;
                isPreviousActDefault = defaultShapeVertex.includes(
                  getActivityProps(
                    activity.ActivityType,
                    activity.ActivitySubType
                  )[5]
                );
              }
            }
            if (+maxActivityId < +embAct.ActivityId) {
              maxActivityId = +embAct.ActivityId;
            }
          });
        }
      });
    });
    let newActivityName =
      t(getActivityProps(iActivityId, iSubActivityId)[4]) +
      "_" +
      (maxActivityId + 1);
    let queueInfo = getActivityQueueObj(
      props.setNewId,
      iActivityId,
      iSubActivityId,
      newActivityName,
      props.processData,
      LaneId,
      t
    );
    maxXleftLoc = isPreviousActDefault
      ? maxXleftLoc + widthForDefaultVertex + gridSize
      : maxXleftLoc + gridSize * 2;
    const ActivityAddPostBody = {
      processDefId: props.processData.ProcessDefId,
      processName: props.processData.ProcessName,
      actName: newActivityName,
      actId: +maxActivityId + 1,
      actType: iActivityId,
      actSubType: iSubActivityId,
      actAssocId: 0,
      seqId: +MaxseqId + 1,
      laneId: LaneId,
      blockId: 0,
      queueId: queueInfo.queueId,
      queueInfo: queueInfo,
      queueExist: queueInfo.queueExist,
      xLeftLoc: maxXleftLoc,
      yTopLoc: 6 * graphGridSize,
      milestoneId: props.mileId,
      parentActivityId: props.activityId,
    };
    axios
      .post(SERVER_URL + ENDPOINT_ADDACTIVITY, ActivityAddPostBody)
      .then((res) => {
    // if (res.data.Status === 0) {
    let newObj = {
      ActivityId: ActivityAddPostBody.actId,
      ActivityName: ActivityAddPostBody.actName,
      ActivityType: ActivityAddPostBody.actType,
      ActivitySubType: ActivityAddPostBody.actSubType,
      LaneId: ActivityAddPostBody.laneId,
      xLeftLoc: maxXleftLoc,
      yTopLoc: 6 * graphGridSize,
      isActive: "true",
      BlockId: 0,
      CheckedOut: "",
      Color: "1234",
      FromRegistered: "N",
      QueueCategory: "",
      QueueId: ActivityAddPostBody.queueInfo.queueId,
      SequenceId: ActivityAddPostBody.seqId,
      id: "",
      AssociatedTasks: [],
    };
    setEmbeddedActivities((prev) => {
      let newData = [...prev];
      newData.splice(index + 1, 0, newObj);
      return newData;
    });
    let newProcessData = { ...props.processData };
    newProcessData.MileStones[mIndex].Activities[
      props.activityindex
    ].EmbeddedActivity[0].push(newObj);
    props.setprocessData(newProcessData);
    // }
      });
  };

  const handleChange = (value) => {};

  return (
    <Box pl={1} ml={1} style={{ marginLeft: "0" }}>
      <Grid
        containerclassName="selectedActivityType"
        style={{
          display: "flex",
          color: props.color,
          background: props.BackgroundColor + " 0% 0% no-repeat padding-box",
        }}
      >
        <Grid item style={{ flex: "1", padding: "4px 8px" }}>
          <p className="task_count_activity">
            {embeddedActivities.length}{" "}
            {embeddedActivities.length !== 1 ? t("worksteps") : t("workstep")}
          </p>
        </Grid>
        <Grid item style={{ textAlign: "right", flex: "1" }}>
          <span style={{ position: "relative" }}>
            {props.processType === PROCESSTYPE_LOCAL ? (
              <AddIcon
                style={
                  addActivity
                    ? { color: "#0072C6", width: "15px", height: "15px" }
                    : { color: "#606060", width: "15px", height: "15px" }
                }
                onClick={() => setAddActivity(true)}
              />
            ) : null}
          </span>
          {processExpanded ? (
            <ExpandLessIcon
              style={{ color: "#606060", width: "25px", height: "15px" }}
              onClick={() => setProcessExpanded(false)}
            />
          ) : (
            <ExpandMoreIcon
              style={{ color: "#606060", width: "25px", height: "15px" }}
              onClick={() => {
                setProcessExpanded(true);
              }}
            />
          )}
        </Grid>
      </Grid>
      {processExpanded &&
        embeddedActivities &&
        embeddedActivities.map((elem, index) => {
          return (
            <Grid
              container
              className="selectedActivityType"
              style={{
                background: BackgroundColor + " 0% 0% no-repeat padding-box",
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <ActivityCard
                index={index}
                ActivityId={elem.ActivityId}
                ActivityType={elem.ActivityType}
                ActivitySubType={elem.ActivitySubType}
                ActivityName={elem.ActivityName}
                handleChange={handleChange}
                addActivityInBetween={addActivityInBetween}
                embeddedActivities={embeddedActivities}
                setEmbeddedActivities={setEmbeddedActivities}
                processType={props.processType}
              />
            </Grid>
          );
        })}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    expandedProcess: state.expandedProcessReducer.processExpanded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setExpandedProcess: (processExpanded) =>
      dispatch(actionCreators_process.expandedProcess(processExpanded)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmbeddedActivity);
