export const DisableCheckBox = (activity, props) => {
  let temp = false;
  activity.forEach((act) => {
    if (
      act.activityType === props.activityType &&
      act.subActivity === props.subActivity
    ) 
    {
      if(props.hasOwnProperty("toDoIsMandatory")){
         if(props.toDoIsMandatory===false){
             temp = false
         }
         else temp = true;
      }
      else 
      temp = true;
    }
  });
  return temp;
};
