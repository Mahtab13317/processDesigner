import {
  SERVER_URL,
  ENDPOINT_MOVEACTIVITY,
} from "../../Constants/appConstants";
import axios from "axios";

export const MoveActivity = (
  processDefId,
  activity,
  milestoneId,
  prevMilestoneId,
  laneId,
  setProcessData,
  newyTopLoc,
  newXLeftLoc,
  localXLeftLoc,
  view,
  mileStoneWidthIncreased,
  laneHeightIncreased
) => {
  let json = {
    processDefId: processDefId,
    actName: activity.ActivityName,
    actId: activity.ActivityId,
    seqId: activity.SequenceId,
    milestoneId: milestoneId,
    prevMilestoneId: prevMilestoneId,
    laneId: laneId,
    prevLaneId: activity.LaneId,
    xLeftLoc: newXLeftLoc,
    yTopLoc: newyTopLoc,
  };
  if (mileStoneWidthIncreased) {
    json = {
      ...json,
      ...mileStoneWidthIncreased,
    };
  }
  if (laneHeightIncreased) {
    json = { ...json, ...laneHeightIncreased };
  }
  axios
    .post(SERVER_URL + ENDPOINT_MOVEACTIVITY, json)
    .then((response) => {
      if (response.data.Status === 0) {
        if (view !== "BPMN") {
          setProcessData((prevData) => {
            let processObject = { ...prevData };
            processObject.MileStones &&
              processObject.MileStones.forEach((mile, index) => {
                if (mile.iMileStoneId === milestoneId) {
                  if (mileStoneWidthIncreased) {
                    mile.Width = mileStoneWidthIncreased.arrMilestoneInfos[index].width;
                  }
                  mile.Activities &&
                    mile.Activities.forEach((act) => {
                      if (act.ActivityId === activity.ActivityId) {
                        act.LaneId = laneId;
                        act.xLeftLoc = localXLeftLoc;
                        act.yTopLoc = newyTopLoc;
                      }
                    });
                }
              });
            return processObject;
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
