import { toDoActivities } from "../../Constants/appConstants";

export const DisableCheckBox = (activity, props) => {
  let temp = false;
  activity.forEach((act) => {
    if (
      act.activityType === props.activityType &&
      act.subActivity === props.subActivity
    ) {
      if (props.hasOwnProperty("toDoIsMandatory")) {
        if (props.toDoIsMandatory === false) {
          temp = false;
        } else temp = true;
      } else temp = true;
    }
  });
  return temp;
};

export const disableToDoChecks = (props, type) => {
  let temp = false;
  if (props.hasOwnProperty("toDoIsMandatory")) {
    if (props.toDoIsMandatory && type === "View") {
      temp = true;
    }
    if (props.toDoIsMandatory && type === "All" && (props.activityType === 2 || props.activityType === 3 || props.activityType === 11)) {
      temp = true;
    }
  }
  if ((props.activityType === 2 || props.activityType === 3 || props.activityType === 11) && type === "Modify") {
    temp = true;
  }
  return temp;
};

export const isValidTodoAct = (actId, actSubId) => {
  let valid = false;
  toDoActivities?.forEach((el) => {
    if (+el.activityId === +actId && +el.subActivityId === +actSubId) {
      valid = true;
    }
  });
  return valid;
};
