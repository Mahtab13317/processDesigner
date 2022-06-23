export const moveMilestoneArray = (processData, source, destination) => {
  return (
    processData.MileStones &&
    processData.MileStones.map((mile, index) => {
      let activitiesArray = mile.Activities.map((elem) => {
        return {
          activityId: `${elem.ActivityId}`,
          xLeftLoc: elem.xLeftLoc,
        };
      });
      if (source.index < destination.index) {
        if (index < source.index) {
          return {
            milestoneName: mile.MileStoneName,
            milestoneId: mile.iMileStoneId,
            seqId: mile.SequenceId,
            oldMilestoneSeqId: mile.SequenceId,
            activities: activitiesArray,
          };
        } else if (source.index < index && index <= destination.index) {
          return {
            milestoneName: mile.MileStoneName,
            milestoneId: mile.iMileStoneId,
            seqId: mile.SequenceId - 1,
            oldMilestoneSeqId: mile.SequenceId,
            activities: activitiesArray,
          };
        } else if (index > destination.index) {
          return {
            milestoneName: mile.MileStoneName,
            milestoneId: mile.iMileStoneId,
            seqId: mile.SequenceId + 1,
            oldMilestoneSeqId: mile.SequenceId,
            activities: activitiesArray,
          };
        } else if (index === source.index) {
          return {
            milestoneName: mile.MileStoneName,
            milestoneId: mile.iMileStoneId,
            seqId: destination.index + 1,
            oldMilestoneSeqId: mile.SequenceId,
            activities: activitiesArray,
          };
        }
      } else if (source.index > destination.index) {
        if (index > source.index) {
          return {
            milestoneName: mile.MileStoneName,
            milestoneId: mile.iMileStoneId,
            seqId: mile.SequenceId,
            oldMilestoneSeqId: mile.SequenceId,
            activities: activitiesArray,
          };
        } else if (source.index > index && index >= destination.index) {
          return {
            milestoneName: mile.MileStoneName,
            milestoneId: mile.iMileStoneId,
            seqId: mile.SequenceId + 1,
            oldMilestoneSeqId: mile.SequenceId,
            activities: activitiesArray,
          };
        } else if (index < destination.index) {
          return {
            milestoneName: mile.MileStoneName,
            milestoneId: mile.iMileStoneId,
            seqId: mile.SequenceId,
            oldMilestoneSeqId: mile.SequenceId,
            activities: activitiesArray,
          };
        } else if (index === source.index) {
          return {
            milestoneName: mile.MileStoneName,
            milestoneId: mile.iMileStoneId,
            seqId: destination.index + 1,
            oldMilestoneSeqId: mile.SequenceId,
            activities: activitiesArray,
          };
        }
      }
    })
  );
};
