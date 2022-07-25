import {
  SystemArchiveQueue,
  SystemBRMSQueue,
  SystemDXQueue,
  SystemPFEQueue,
  SystemSAPQueue,
  SystemSharepointQueue,
  SystemWSQueue,
} from "../../Constants/appConstants";

export function getActivityQueueObj(
  setNewId,
  activityType,
  activitySubType,
  activityName,
  processData,
  laneId,
  t
) {
  let queueId = null;
  let queueObj = {};

  if (
    (+activityType === 1 && +activitySubType === 1) ||
    (+activityType === 1 && +activitySubType === 3) ||
    (+activityType === 1 && +activitySubType === 7) ||
    (+activityType === 32 && +activitySubType === 1) ||
    (+activityType === 11 && +activitySubType === 1) ||
    (+activityType === 33 && +activitySubType === 1) ||
    (+activityType === 27 && +activitySubType === 1) ||
    (+activityType === 19 && +activitySubType === 1) ||
    (+activityType === 21 && +activitySubType === 1) ||
    (+activityType === 4 && +activitySubType === 1)
  ) {
    /*start event, conditional start, message start, case workdesk, query, oms adapter, event, jms producer
      jms consumer, timer event*/
    setNewId((oldIds) => {
      let newIds = { ...oldIds };
      queueId = newIds.minQueueId - 1;
      return { ...newIds, minQueueId: queueId };
    });
    queueObj = {
      queueId: queueId,
      queueName: `${processData.ProcessName}_${activityName}`,
      QueueDesc: `${t("DefaultQueueComment")} ${activityName}`,
      sortOrder: "A",
      orderBy: 2,
      refreshInterval: 0,
      allowReassignment: "N",
      queueType: "I",
      queueExist: false,
    };
    if (+activityType === 32 && +activitySubType === 1) {
      queueObj = { ...queueObj, allowReassignment: "Y", queueType: "M" };
    } else if (
      (+activityType === 27 && +activitySubType === 1) ||
      (+activityType === 19 && +activitySubType === 1) ||
      (+activityType === 21 && +activitySubType === 1)
    ) {
      queueObj = { ...queueObj, queueType: "F" };
    } else if (+activityType === 11 && +activitySubType === 1) {
      queueObj = { ...queueObj, queueType: "Q" };
    } else if (+activityType === 33 && +activitySubType === 1) {
      queueObj = { ...queueObj, queueType: "O" };
    } else if (+activityType === 4 && +activitySubType === 1) {
      queueObj = { ...queueObj, queueType: "H" };
    } else if (+activityType === 1 && +activitySubType === 7) {
      queueObj = { ...queueObj, queueType: "B" };
    }
  } else if (
    (+activityType === 1 && +activitySubType === 6) ||
    (+activityType === 18 && +activitySubType === 1) ||
    (+activityType === 20 && +activitySubType === 1) ||
    (+activityType === 5 && +activitySubType === 1) ||
    (+activityType === 5 && +activitySubType === 2) ||
    (+activityType === 6 && +activitySubType === 1) ||
    (+activityType === 6 && +activitySubType === 2) ||
    (+activityType === 7 && +activitySubType === 1) ||
    (+activityType === 2 && +activitySubType === 1) ||
    (+activityType === 3 && +activitySubType === 1) ||
    (+activityType === 2 && +activitySubType === 2)
  ) {
    /*timer start, call activity, email, export, dms adapter, inclusive distribute
      parallel distribute, inclusive collect, parallel collect, data based exclusive, end event, terminate event, message end*/
    return { queueId: 0, queueExist: false };
  } else if (
    (+activityType === 22 && +activitySubType === 1) ||
    (+activityType === 31 && +activitySubType === 1) ||
    (+activityType === 34 && +activitySubType === 1) ||
    (+activityType === 10 && +activitySubType === 4) ||
    (+activityType === 10 && +activitySubType === 1) ||
    (+activityType === 30 && +activitySubType === 1) ||
    (+activityType === 29 && +activitySubType === 1)
  ) {
    //webservice, businessRule, dataExchange, dms adapter, email, sharepoint, sap adapter
    let existingSystemQueue = null;
    processData.MileStones.forEach((mile) => {
      mile.Activities.forEach((activity) => {
        if (
          +activity.ActivityType === +activityType &&
          +activity.ActivitySubType === +activitySubType
        ) {
          existingSystemQueue = activity.QueueId;
        }
      });
    });
    if (existingSystemQueue) {
      queueObj = { queueId: existingSystemQueue, queueExist: true };
    } else {
      setNewId((oldIds) => {
        let newIds = { ...oldIds };
        queueId = newIds.minQueueId - 1;
        return { ...newIds, minQueueId: queueId };
      });
      queueObj = {
        queueId: queueId,
        sortOrder: "",
        orderBy: 2,
        refreshInterval: 0,
        allowReassignment: "N",
        queueType: "A",
        queueExist: false,
      };
      if (+activityType === 22 && +activitySubType === 1) {
        queueObj = {
          ...queueObj,
          queueName: SystemWSQueue,
          QueueDesc: `${t("SystemWSComment")}`,
        };
      } else if (+activityType === 31 && +activitySubType === 1) {
        queueObj = {
          ...queueObj,
          queueName: SystemBRMSQueue,
          QueueDesc: `${t("SystemBRMSComment")}`,
        };
      } else if (+activityType === 34 && +activitySubType === 1) {
        queueObj = {
          ...queueObj,
          queueName: SystemDXQueue,
          QueueDesc: `${t("SystemDXComment")}`,
        };
      } else if (+activityType === 10 && +activitySubType === 4) {
        queueObj = {
          ...queueObj,
          queueName: SystemArchiveQueue,
          QueueDesc: `${t("SystemArchiveComment")}`,
        };
      } else if (+activityType === 10 && +activitySubType === 1) {
        queueObj = {
          ...queueObj,
          queueName: SystemPFEQueue,
          QueueDesc: `${t("SystemPFEComment")}`,
        };
      } else if (+activityType === 30 && +activitySubType === 1) {
        queueObj = {
          ...queueObj,
          queueName: SystemSharepointQueue,
          QueueDesc: `${t("SystemSharepointComment")}`,
        };
      } else if (+activityType === 29 && +activitySubType === 1) {
        queueObj = {
          ...queueObj,
          queueName: SystemSAPQueue,
          QueueDesc: `${t("SystemSAPComment")}`,
        };
      }
    }
  } else {
    processData?.Lanes?.forEach((lane) => {
      if (lane.LaneId === laneId) {
        queueObj = {
          queueId: lane.QueueId,
          queueExist: true,
        };
      }
    });
  }
  return queueObj;
}
