import { SERVER_URL, ENDPOINT_ADDACTIVITY } from "../../Constants/appConstants";
import axios from "axios";
import { hideIcons } from "../bpmnView/cellOnMouseClick";
import { removeToolDivCell } from "../bpmnView/getToolDivCell";

export const AddActivity = (
  processDefId,
  processName,
  activity,
  milestone,
  setProcessData,
  newXLeftLoc,
  mileStoneWidthIncreased,
  laneHeightIncreased
) => {
  let ActivityAddPostBody = {
    processDefId: processDefId,
    processName: processName,
    actName: activity.name,
    actId: activity.id,
    actType: activity.actType,
    actSubType: activity.actSubType,
    actAssocId: activity.actAssocId,
    seqId: activity.seqId,
    laneId: activity.laneId,
    blockId: activity.blockId,
    queueId: activity.queueInfo.queueId,
    queueInfo:
      !activity.queueInfo.queueId && activity.queueInfo.queueExist
        ? null
        : activity.queueInfo,
    queueExist: activity.queueInfo.queueExist,
    xLeftLoc: activity.xLeftLoc,
    yTopLoc: activity.yTopLoc,
    milestoneId: milestone.mileId,
  };
  if (mileStoneWidthIncreased) {
    ActivityAddPostBody = {
      ...ActivityAddPostBody,
      ...mileStoneWidthIncreased,
    };
  }
  if (laneHeightIncreased) {
    ActivityAddPostBody = { ...ActivityAddPostBody, ...laneHeightIncreased };
  }
  axios
    .post(SERVER_URL + ENDPOINT_ADDACTIVITY, ActivityAddPostBody)
    .then((response) => {
      if (response.data.Status === 0) {
        if (activity.view !== "BPMN") {
          setProcessData((prevData) => {
            let processObject = JSON.parse(JSON.stringify(prevData));
            if (mileStoneWidthIncreased) {
              processObject.MileStones[milestone.mileIndex].Width =
                mileStoneWidthIncreased.arrMilestoneInfos[
                  milestone.mileIndex
                ].width;
            }
            processObject.MileStones[milestone.mileIndex].Activities.push({
              ActivityId: activity.id,
              ActivityName: activity.name,
              ActivityType: activity.actType,
              ActivitySubType: activity.actSubType,
              LaneId: activity.laneId,
              xLeftLoc: newXLeftLoc,
              yTopLoc: activity.yTopLoc,
              isActive: "true",
              BlockId: 0,
              CheckedOut: "",
              Color: "1234",
              FromRegistered: "N",
              QueueCategory: "",
              QueueId: activity.queueInfo.queueId,
              SequenceId: activity.seqId,
              id: "",
              AssociatedTasks: [],
              "Target WorkStep": [],
            });
            // code added on 22 July 2022 for BugId 113305
            if (!activity.queueInfo.queueExist) {
              processObject.Queue?.splice(0, 0, {
                QueueFilter: "",
                OrderBy: activity.queueInfo?.orderBy,
                AllowReassignment: activity.queueInfo?.allowReassignment,
                UG: [],
                FilterOption: "0",
                RefreshInterval: activity.queueInfo?.refreshInterval,
                QueueId: activity.queueInfo?.queueId,
                SortOrder: activity.queueInfo?.sortOrder,
                QueueName: activity.queueInfo?.queueName,
                QueueDescription: activity.queueInfo?.queueDesc,
                QueueType: activity.queueInfo?.queueType,
                FilterValue: "",
              });
            }
            return processObject;
          });
        }
      } else {
        if (activity.view === "BPMN") {
          setProcessData((prevData) => {
            let processObject = JSON.parse(JSON.stringify(prevData));
            let newArr =
              processObject.MileStones[milestone.mileIndex].Activities &&
              processObject.MileStones[milestone.mileIndex].Activities.map(
                (act, index) => {
                  if (
                    index !==
                    processObject.MileStones[milestone.mileIndex].Activities
                      .length
                  ) {
                    return act;
                  }
                }
              );
            processObject.MileStones[milestone.mileIndex].Activities = [
              ...newArr,
            ];
            // code added on 22 July 2022 for BugId 113305
            if (!activity.queueInfo.queueExist) {
              processObject.Queue?.splice(0, 1);
            }
            if (+activity.actType === 41 && +activity.actSubType === 1) {
              processObject.Queue?.splice(0, 1);
            }
            return processObject;
          });
          hideIcons();
          removeToolDivCell();
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
