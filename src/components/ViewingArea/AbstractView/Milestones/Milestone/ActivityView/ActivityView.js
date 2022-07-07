import React from "react";
import { useTranslation } from "react-i18next";
import { Droppable } from "react-beautiful-dnd";
import { ClickAwayListener } from "@material-ui/core";
import "./Activities.css";
import Activities from "./Activities";
import { PROCESSTYPE_LOCAL } from "../../../../../../Constants/appConstants";
import {
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragOver,
  milestoneWidthToIncrease,
} from "../../../../../../utility/abstarctView/addWorkstepAbstractView";
import { AddActivity } from "../../../../../../utility/CommonAPICall/AddActivity";
import {
  defaultShapeVertex,
  graphGridSize,
  gridSize,
  milestoneTitleWidth,
  widthForDefaultVertex,
} from "../../../../../../Constants/bpmnView";
import { getActivityQueueObj } from "../../../../../../utility/abstarctView/getActivityQueueObj";
import { AddEmbeddedActivity } from "../../../../../../utility/CommonAPICall/AddEmbeddedActivity";
import { getActivityProps } from "../../../../../../utility/abstarctView/getActivityProps";

function ActivityView(props) {
  let { t } = useTranslation();
  const { embeddedActivities, setEmbeddedActivities, caseEnabled } = props;
  let iActivityId = 10;
  let iSubActivityId = 3;

  // Function to add a new activity in a milestone and
  // to add a new card with an activity type that has been dropped on the add workstep button.
  const addNewActivity = () => {
    let MaxseqId = 0,
      maxActivityId = 0,
      mileWidth = 0,
      maxXleftLoc = 0;
    let isPreviousActDefault = false;
    const mIndex = props.milestoneIndex;
    let LaneId = props.processData.Lanes[0].LaneId;
    let laneHeight = milestoneTitleWidth;
    if (caseEnabled) {
      laneHeight = laneHeight + +props.processData.Lanes[0].Height;
      LaneId = props.processData.Lanes[1].LaneId;
    }
    props.processData.MileStones.forEach((mile, index) => {
      mile.Activities.forEach((activity) => {
        if (+activity.SequenceId > +MaxseqId && mIndex === index) {
          MaxseqId = +activity.SequenceId;
        }
        if (+maxXleftLoc < +activity.xLeftLoc && mIndex === index) {
          maxXleftLoc = +activity.xLeftLoc;
          isPreviousActDefault = defaultShapeVertex.includes(
            getActivityProps(activity.ActivityType, activity.ActivitySubType)[5]
          );
        }
        if (+maxActivityId < +activity.ActivityId) {
          maxActivityId = +activity.ActivityId;
        }
        if (activity.EmbeddedActivity) {
          activity.EmbeddedActivity[0].forEach((embAct) => {
            if (+embAct.SequenceId > +MaxseqId && mIndex === index) {
              MaxseqId = +embAct.SequenceId;
            }
            if (+maxActivityId < +embAct.ActivityId) {
              maxActivityId = +embAct.ActivityId;
            }
          });
        }
      });
      if (index < mIndex) {
        mileWidth = mileWidth + +mile.Width;
      }
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
    //for embeddedSubprocess
    if (+iActivityId === 41 && +iSubActivityId === 1) {
      let startQueueObj = getActivityQueueObj(
        props.setNewId,
        1,
        1,
        t(getActivityProps(1, 1)[4]) + "_" + (maxActivityId + 2),
        props.processData,
        LaneId,
        t
      );
      AddEmbeddedActivity(
        props.processData.ProcessDefId,
        props.processData.ProcessName,
        {
          name: newActivityName,
          id: +maxActivityId + 1,
          actType: iActivityId,
          actSubType: iSubActivityId,
          actAssocId: 0,
          seqId: +MaxseqId + 1,
          laneId: LaneId,
          blockId: 0,
          queueInfo: queueInfo,
          xLeftLoc: isPreviousActDefault
            ? mileWidth + maxXleftLoc + widthForDefaultVertex + gridSize
            : mileWidth + maxXleftLoc + gridSize * 2,
          yTopLoc: +laneHeight + gridSize,
          view: null,
        },
        {
          mileId: props.MileId,
          mileIndex: mIndex,
        },
        props.setprocessData,
        isPreviousActDefault
          ? maxXleftLoc + widthForDefaultVertex + gridSize
          : maxXleftLoc + gridSize * 2,
        [
          {
            processDefId: props.processData.ProcessDefId,
            processName: props.processData.ProcessName,
            actName: t(getActivityProps(1, 1)[4]) + "_" + (maxActivityId + 2),
            actId: +maxActivityId + 2,
            actType: 1,
            actSubType: 1,
            actAssocId: 0,
            seqId: +MaxseqId + 2,
            laneId: LaneId,
            blockId: 0,
            queueId: startQueueObj.queueId,
            queueInfo: startQueueObj,
            queueExist: false,
            xLeftLoc: 6 * graphGridSize,
            yTopLoc: 6 * graphGridSize,
            milestoneId: props.MileId,
            parentActivityId: +maxActivityId + 1,
          },
          {
            processDefId: props.processData.ProcessDefId,
            processName: props.processData.ProcessName,
            actName: t(getActivityProps(2, 1)[4]) + "_" + (maxActivityId + 3),
            actId: +maxActivityId + 3,
            actType: 2,
            actSubType: 1,
            actAssocId: 0,
            seqId: +MaxseqId + 3,
            laneId: LaneId,
            blockId: 0,
            queueId: 0,
            queueInfo: { queueId: 0 },
            queueExist: false,
            xLeftLoc: 26 * graphGridSize,
            yTopLoc: 6 * graphGridSize,
            milestoneId: props.MileId,
            parentActivityId: +maxActivityId + 1,
          },
        ],
        milestoneWidthToIncrease(
          isPreviousActDefault
            ? maxXleftLoc + widthForDefaultVertex + gridSize
            : maxXleftLoc + gridSize * 2,
          props.processData,
          props.MileId,
          +maxActivityId + 1,
          defaultShapeVertex.includes(
            getActivityProps(iActivityId, iSubActivityId)[5]
          )
        )
      );
    } else {
      AddActivity(
        props.processData.ProcessDefId,
        props.processData.ProcessName,
        {
          name: newActivityName,
          id: +maxActivityId + 1,
          actType: iActivityId,
          actSubType: iSubActivityId,
          actAssocId: 0,
          seqId: +MaxseqId + 1,
          laneId: LaneId,
          blockId: 0,
          queueInfo: queueInfo,
          xLeftLoc: isPreviousActDefault
            ? mileWidth + maxXleftLoc + widthForDefaultVertex + gridSize
            : mileWidth + maxXleftLoc + gridSize * 2,
          yTopLoc: +laneHeight + gridSize,
          view: null,
        },
        {
          mileId: props.MileId,
          mileIndex: mIndex,
        },
        props.setprocessData,
        isPreviousActDefault
          ? maxXleftLoc + widthForDefaultVertex + gridSize
          : maxXleftLoc + gridSize * 2,
        milestoneWidthToIncrease(
          isPreviousActDefault
            ? maxXleftLoc + widthForDefaultVertex + gridSize
            : maxXleftLoc + gridSize * 2,
          props.processData,
          props.MileId,
          +maxActivityId + 1,
          defaultShapeVertex.includes(
            getActivityProps(iActivityId, iSubActivityId)[5]
          )
        )
      );
    }
  };

  const handleClickAway = (evt, mIndex) => {
    let processObject = JSON.parse(JSON.stringify(props.processData));
    processObject.MileStones = JSON.parse(
      JSON.stringify(props.processData.MileStones)
    );
    processObject.MileStones[mIndex].Activities = JSON.parse(
      JSON.stringify(props.processData.MileStones[mIndex].Activities)
    );
    processObject.MileStones[mIndex].Activities.forEach((activity) => {
      if (
        activity.ActivityName.trim() === "" ||
        activity.ActivityName === null ||
        activity.ActivityName === undefined
      ) {
        activity.ActivityName =
          t(getActivityProps(iActivityId, iSubActivityId)[4]) +
          "_" +
          props.activityId.activityId;
      }
      if (!activity.ActivityType && !activity.ActivitySubType) {
        activity.ActivityType = 10;
        activity.ActivitySubType = 3;
      }
    });
    props.setprocessData(processObject);
  };

  const onDropHandler = (e) => {
    iActivityId = +e.dataTransfer.getData("iActivityID");
    iSubActivityId = +e.dataTransfer.getData("iSubActivityID");
    onDrop(e, "newActivityDiv", addNewActivity);
  };

  return (
    <React.Fragment>
      <ClickAwayListener
        onClickAway={(evt) => handleClickAway(evt, props.milestoneIndex)}
      >
        <React.Fragment>
          <div
            className="activityMainDiv"
            onDragOver={(e) => onDragOver(e)}
            onDragEnter={(e) => onDragEnter(e, "newActivityDiv")}
            onDragLeave={(e) => onDragLeave(e, "newActivityDiv")}
            onDrop={onDropHandler}
          >
            <Droppable
              droppableId={`${props.milestoneIndex}`}
              type="process"
              key={props.milestoneIndex}
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ minHeight: "1vh" }}
                >
                  {/* The height of the div is set to 1vh so that when there are not activities in a milestone,the area is still droppable for another activity card. */}
                  <div>
                    <Activities
                      caseEnabled={caseEnabled}
                      embeddedActivities={embeddedActivities}
                      setEmbeddedActivities={setEmbeddedActivities}
                      milestoneIndex={props.milestoneIndex}
                      ActivitiesData={props.ActivitiesData}
                      selectedActivity={props.selectedActivity}
                      selectActivityHandler={props.selectActivityHandler}
                      setprocessData={props.setprocessData}
                      processData={props.processData}
                      processType={props.processType}
                      setNewId={props.setNewId}
                      mileId={props.MileId}
                    />
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div
              className="newActivityDiv"
              // class="addNewWorkstepButton"
              style={{
                display: props.processType !== PROCESSTYPE_LOCAL ? "none" : "",
              }}
              onClick={() => addNewActivity()}
            >
              {t("milestone.newStep")}
            </div>

            <div style={{ height: "20vh" }}></div>
          </div>
        </React.Fragment>
      </ClickAwayListener>
      {/*<p className="altMilestone">{t("milestone.alternateMilestone")}</p>
                <div className="alternateStage"><p>{t("milestone.newAlternateMilestone")}</p></div>*/}
    </React.Fragment>
  );
}

export default ActivityView;
