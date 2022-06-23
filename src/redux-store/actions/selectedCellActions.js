export const selectedCell = (
  id,
  name,
  activityType,
  activitySubType,
  seqId,
  queueId,
  type
) => {
  return {
    type: "SELECTED_CELL",
    payload: {
      id,
      name,
      activityType,
      activitySubType,
      seqId,
      queueId,
      type,
    },
  };
};

export const selectedTask = (id, name, taskType, type) => {
  return {
    type: "SELECTED_TASK",
    payload: {
      id,
      name,
      taskType,
      type,
    },
  };
};

export const selectedTemplate = (id, name, taskType, type) => {
  return {
    type: "SELECTED_TEMPLATE",
    payload: {
      id,
      name,
      taskType,
      type,
    },
  };
};
