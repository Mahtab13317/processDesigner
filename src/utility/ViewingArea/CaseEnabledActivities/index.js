import { activities } from "../../bpmnView/toolboxIcon";
// This function removes the activities that are not included from the activities object when process is not case enabled.
export const getCaseEnabledActivities = (caseEnabled, removeActivities) => {
  let filteredActivities;
  let filteredTools;
  let tempArray = {};
  tempArray = { ...activities };
  if (caseEnabled === false) {
    removeActivities.forEach((element) => {
      filteredTools = tempArray.tools?.filter((activity) => {
        return activity !== element;
      });
    });

    tempArray.tools = filteredTools;
  }
  filteredActivities = tempArray;
  return filteredActivities;
};
