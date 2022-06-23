import React, { useEffect, useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useTranslation } from "react-i18next";

function ActivityModal(props) {
  let { t } = useTranslation();
  const [checks, setChecks] = useState({
    View: false,
    Modify: false,
  });

  const changeChecks = (check_type) => {
    checks[check_type] = !checks[check_type];
      props.updateActivityAllTodoRights(
        check_type,
        props.activityId,
        checks[check_type],
        setChecks,
        checks,
      );
  };

  useEffect(() => {
    const temp = [t('view'), t("Modify")];
    if (props.fullRightCheckOneActivity) {
      setChecks({
        View: true,
        Modify: true,
      });
    } else 
    if (!props.fullRightCheckOneActivity) {
      temp.forEach(value=>{
        let defaultArray = [];
        props.docTypeList&& props.docTypeList.TodoGroupLists.map((group, groupIndex)=>{
          group.ToDoList.map(type=>{
            type.Activities.map(activity=>{
              if (activity.ActivityId == props.activityId){
                defaultArray.push(activity[value])
              }
            })
          })
        })

        if(defaultArray.includes(false)){
          setChecks(prevData=>{
            let newData = {...prevData};
            newData[value]=false;
            return newData;
          })
        }

        else{
          setChecks(prevData=>{
            let newData = {...prevData};
            newData[value]=true;
            return newData;
          })
        }
      })
    } 
  }, []);

  return (
    <div className='activityModal'>
      <div className='actModalCheckboxes'
      >
        <FormControlLabel
          control={<Checkbox name="checkedF" id="oneActivity_modalView_todo" />}
          label='View'
          checked={checks["View"]}
          onChange={() => changeChecks("View")}
        />
        <FormControlLabel
          checked={checks["Modify"]}
          onChange={() => changeChecks("Modify")}
          control={<Checkbox name="checkedF" id="oneActivity_modalModify_todo" />}
          label='Modify'
        />
      </div>
    </div>
  );
}

export default ActivityModal;
