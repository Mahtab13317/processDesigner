export const addMileInBetweenArray = (processData, indexVal) => {
  let SequenceId;
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
        if (indexVal === index) {
          SequenceId = item.SequenceId + 1;
          return {
            milestoneName: item.MileStoneName,
            milestoneId: item.iMileStoneId,
            seqId: item.SequenceId,
            action: "N",
            activities: activitiesArray,
          };
        } else if (indexVal < index) {
          item.SequenceId = item.SequenceId + 1;
          return {
            milestoneName: item.MileStoneName,
            milestoneId: item.iMileStoneId,
            seqId: item.SequenceId,
            action: "N",
            activities: activitiesArray,
          };
        } else if (indexVal > index) {
          return {
            milestoneName: item.MileStoneName,
            milestoneId: item.iMileStoneId,
            seqId: item.SequenceId,
            action: "N",
            activities: activitiesArray,
          };
        }
      }),
    SequenceId: SequenceId,
  };
};
