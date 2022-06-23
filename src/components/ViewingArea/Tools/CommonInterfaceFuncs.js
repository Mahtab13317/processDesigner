  //Reusable function with common code to keep check on fullRightCheckOneActivityArr changing values
  export const fullRightsOneActivity = (activity_id, newState,setFullRightCheckOneActivityArr) => {
    let bFlag = true;
    newState.ExceptionGroups&&newState.ExceptionGroups.map((group, groupIndex) => {
      group.ExceptionList.map((exception, index) => {
        exception.Activities.map((activity) => {
          if (activity.ActivityId == activity_id) {
            if (Object.values(activity).includes(false) && bFlag) {
              bFlag = false;
              setFullRightCheckOneActivityArr((prevArr) => {
                let temp = [...prevArr];
                temp[activity_id] = false;
                return temp;
              });
            }
          }
        });
      });
    });
    if (bFlag) {
      setFullRightCheckOneActivityArr((prevArr) => {
        let temp = [...prevArr];
        temp[activity_id] = true;
        return temp;
      });
    }
  };
