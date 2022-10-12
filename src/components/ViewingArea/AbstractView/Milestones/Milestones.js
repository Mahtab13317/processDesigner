import React from "react";
import { Draggable } from "react-beautiful-dnd";
import ActivityView from "./Milestone/ActivityView/ActivityView";
import Mile from "./Milestone/Milestone";
import { ClickAwayListener } from "@material-ui/core";
import "./Milestone/Milestone.css";

// Functional component to make milestones in abstract view. Draggable makes the individual milestones draggable.
const milestones = (props) => {
  const {
    embeddedActivities,
    setEmbeddedActivities,
    caseEnabled,
    processType,
  } = props;
  //when processData is null
  if (!props.processData) {
    return <React.Fragment></React.Fragment>;
  }

  var lengthMileStone = props.processData.MileStones?.length;

  return props.processData.MileStones?.map((mileObject, index) => {
    return (
      <React.Fragment>
        <Draggable
          draggableId={mileObject.MileStoneName}
          key={mileObject.MileStoneName}
          index={index}
        >
          {(provided) => (
            <ClickAwayListener
              onClickAway={() => {
                if (props.selectedMile === mileObject.iMileStoneId) {
                  props.selectMileHandler(null);
                }
              }}
            >
              <div
                className={
                  props.selectedMile === mileObject.iMileStoneId
                    ? "mileDivSelected"
                    : "mileDiv"
                }
                {...provided.draggableProps}
                ref={provided.innerRef}
              >
                <Mile
                  index={index}
                  provided={provided}
                  length={lengthMileStone}
                  addNewMile={props.addNewMile}
                  processData={props.processData}
                  setprocessData={props.setprocessData}
                  selectMileHandler={props.selectMileHandler}
                  deleteMileHandler={props.deleteMileHandler}
                  MileName={mileObject.MileStoneName}
                  MileId={mileObject.iMileStoneId}
                  key={mileObject.MileId}
                  Mile={mileObject}
                  addInBetweenNewMile={props.addInBetweenNewMile}
                  processType={processType}
                  selectedMile={props.selectedMile}
                >
                  {props.text}
                </Mile>

                <div
                  className={
                    props.selectedMile === mileObject.iMileStoneId
                      ? "mileActivityDiv"
                      : null
                  }
                  style={{ height: "100%" }}
                >
                  <ActivityView
                    caseEnabled={caseEnabled}
                    embeddedActivities={embeddedActivities}
                    setEmbeddedActivities={setEmbeddedActivities}
                    milestoneIndex={index}
                    setprocessData={props.setprocessData}
                    processData={props.processData}
                    selectedActivity={props.selectedActivity}
                    selectActivityHandler={props.selectActivityHandler}
                    ActivitiesData={mileObject.Activities}
                    activityId={props.activityId}
                    MileId={mileObject.iMileStoneId}
                    processType={processType}
                    setNewId={props.setNewId}
                  />
                </div>
              </div>
            </ClickAwayListener>
          )}
        </Draggable>
      </React.Fragment>
    );
  });
};

export default milestones;
