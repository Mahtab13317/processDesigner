import { SERVER_URL, ENDPOINT_ADDMILE } from "../../Constants/appConstants";
import axios from "axios";
import { numberedLabel } from "../bpmnView/numberedLabel";
import {
  defaultWidthMilestone,
  milestoneName as milestoneNameConst,
} from "../../Constants/bpmnView";

export const addMilestone = (
  translation,
  setNewId,
  processDefId,
  setProcessData
) => {
  let prefix = translation(milestoneNameConst);
  let milestoneId;
  let milestoneName;
  let sequenceId;

  setNewId((oldIds) => {
    let newIds = { ...oldIds };
    newIds.milestoneId = newIds.milestoneId + 1;
    newIds.milestoneSeqId = newIds.milestoneSeqId + 1;
    sequenceId = newIds.milestoneSeqId;
    milestoneId = newIds.milestoneId;
    milestoneName = numberedLabel(null, prefix, milestoneId);
    return newIds;
  });

  var addMilestoneInput = {
    processDefId: processDefId,
    milestones: [
      {
        milestoneName: milestoneName,
        milestoneId: milestoneId,
        seqId: sequenceId,
        width: defaultWidthMilestone,
        action: "A",
        activities: [],
      },
    ],
  };

  axios
    .post(SERVER_URL + ENDPOINT_ADDMILE, addMilestoneInput)
    .then((response) => {
      if (response.data.Status == 0) {
        let newMilestone = {
          MileStoneName: milestoneName,
          iMileStoneId: milestoneId,
          Activities: [],
          BackColor: "1234",
          FromRegistered: "N",
          Height: "",
          SequenceId: sequenceId,
          Width: defaultWidthMilestone,
          id: "",
          isActive: "true",
          xLeftLoc: "",
          yTopLoc: "",
        };
        setProcessData((prevProcessData) => {
          let newProcessData = { ...prevProcessData };
          newProcessData.MileStones = [
            ...newProcessData.MileStones,
            newMilestone,
          ];
          return newProcessData;
        });
      }
    })
    .catch(() => {
      setNewId((oldIds) => {
        let newIds = { ...oldIds };
        newIds.milestoneId = newIds.milestoneId - 1;
        return newIds;
      });
    });
};

export const addMilestoneInBetween = (
  setNewId,
  processDefId,
  setProcessData,
  newMile,
  milestonesArray
) => {
  var addMilestoneInput = {
    processDefId: processDefId,
    milestones: milestonesArray,
  };

  axios
    .post(SERVER_URL + ENDPOINT_ADDMILE, addMilestoneInput)
    .then((response) => {
      
      if (response.data.Status == 0) {
        let newMilestone = {
          MileStoneName: newMile.milestoneName,
          iMileStoneId: newMile.milestoneId,
          Activities: [],
          BackColor: "1234",
          FromRegistered: "N",
          Height: "",
          SequenceId: newMile.seqId,
          Width: newMile.width,
          id: "",
          isActive: "true",
          xLeftLoc: "",
          yTopLoc: "",
        };
        setProcessData((prevProcessData) => {
          let newProcessData = { ...prevProcessData };
          let newArr = [...newProcessData.MileStones];
          newArr.splice(newMile.seqId - 1, 0, newMilestone);
          newProcessData.MileStones = [...newArr];
          return newProcessData;
        });
      }
    })
    .catch(() => {
      setNewId((oldId) => {
        let newIds = { ...oldId };
        newIds.milestoneId = newIds.milestoneId - 1;
        return newIds;
      });
    });
};
