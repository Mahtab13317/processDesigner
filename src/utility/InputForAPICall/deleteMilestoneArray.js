export const deleteMilestoneArray = (processData, id) => {
  let indexVal = null;
  return {
    array:
      processData.MileStones &&
      processData.MileStones.map((item, index) => {
        let activitiesArray = item.Activities.map((activity) => {
          return {
            activityId: activity.ActivityId,
            xLeftLoc: activity.xLeftLoc,
          };
        });
        if (item.iMileStoneId === id) {
          indexVal = index;
          return {
            milestoneName: item.MileStoneName,
            milestoneId: item.iMileStoneId,
            seqId: item.SequenceId,
            action: "D",
            activities: activitiesArray,
          };
        } else {
          if (indexVal && indexVal < index) {
            return {
              milestoneName: item.MileStoneName,
              milestoneId: item.iMileStoneId,
              seqId: item.SequenceId - 1,
              action: "N",
              activities: activitiesArray,
            };
          } else {
            return {
              milestoneName: item.MileStoneName,
              milestoneId: item.iMileStoneId,
              seqId: item.SequenceId,
              action: "N",
              activities: activitiesArray,
            };
          }
        }
      }),
    index: indexVal,
  };
};
