import axios from "axios";
import { SERVER_URL, ENDPOINT_ADDLANE } from "../../Constants/appConstants";

export function addSwimLane(
  t,
  laneId,
  swimlaneName,
  lanes,
  lastLane,
  processDefId,
  processName,
  setprocessData,
  setNewId,
  view,
  milestoneIndex,
  activityindex
) {
  let queueId;
  setNewId((oldIds) => {
    let newIds = { ...oldIds };
    newIds.minQueueId = newIds.minQueueId - 1;
    queueId = newIds.minQueueId;
    return newIds;
  });
  var addLanePostBody = {
    laneId: laneId + 1,
    laneName: swimlaneName,
    laneSeqId: lanes.length + 1,
    xLeftLoc: "0",
    yTopLoc: +lastLane.yTopLoc + +lastLane.Height,
    height: "140",
    width: "1009",
    queueInfo: {
      queueId: queueId,
      queueName: `${processName}_${swimlaneName}`,
      comments: `${t("SwimlaneQueueComment")}`,
      sortOrder: "A",
      orderBy: 2,
      refreshInterval: 0,
      allowReassignment: "N",
      queueType: "N",
    },
    processDefId: processDefId,
    processName: processName,
  };
  axios
    .post(SERVER_URL + ENDPOINT_ADDLANE, addLanePostBody)
    .then((response) => {
      if (response.data.Status === 0) {
        let LaneJson = {
          BackColor: "1234",
          CheckedOut: "N",
          DefaultQueue: "N",
          FromRegistered: "N",
          Height: addLanePostBody.height,
          IndexInPool: "-1",
          LaneId: addLanePostBody.laneId,
          LaneName: addLanePostBody.laneName,
          PoolId: "-1",
          QUEUERIGHTS: {
            MQU: "N",
            D: "N",
            RIGHTBITS: "00000000000000000000",
            V: "N",
            MQA: "N",
          },
          QueueCategory: "L",
          QueueId: addLanePostBody.queueInfo.queueId,
          Width: addLanePostBody.width,
          xLeftLoc: "0",
          yTopLoc: addLanePostBody.yTopLoc,
        };
        setprocessData((prevProcessData) => {
          let processObject = { ...prevProcessData };
          processObject.Lanes = [...processObject.Lanes, LaneJson];
          if (view == "abstract") {
            processObject.MileStones[milestoneIndex].Activities[
              activityindex
            ].LaneName = LaneJson.LaneName;
            processObject.MileStones[milestoneIndex].Activities[
              activityindex
            ].LaneId = LaneJson.LaneId;
            processObject.MileStones[milestoneIndex].Activities[
              activityindex
            ].xLeftLoc = "10";
            processObject.MileStones[milestoneIndex].Activities[
              activityindex
            ].yTopLoc = +LaneJson.yTopLoc + +20;
          }
          return processObject;
        });
      }
    });
}