import React, { useEffect, useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useTranslation } from "react-i18next";

function ActivityModal(props) {
  let { t } = useTranslation();
  const [checks, setChecks] = useState({
    View: false,
    Raise: false,
    Respond: false,
    Clear: false,
  });

  const changeChecks = (check_type) => {
    checks[check_type] = !checks[check_type];
      props.updateActivitySetAllChecks(
        check_type,
        props.activityId,
        checks[check_type],
        checks,
        setChecks,
        props.activityIndex
      );
  };

  useEffect(() => {
    const temp = [t("view"), t("raise"), t("respond"), t("clear")];
    if (props.fullRightCheckOneActivity) {
      setChecks({
        View: true,
        Raise: true,
        Respond: true,
        Clear: true,
      });
    } else 
    if (!props.fullRightCheckOneActivity) {
      temp.forEach(value=>{
        let defaultArray = [];
        props.docTypeList&& props.docTypeList.ExceptionGroups.map((group, groupIndex)=>{
          group.ExceptionList.map(type=>{
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
          control={<Checkbox name="checkedF" id="oneActivity_modalView_exception"/>}
          label={t("view")}
          checked={checks["View"]}
          onChange={() => changeChecks("View")}
        />
        <FormControlLabel
          checked={checks["Raise"]}
          onChange={() => changeChecks("Raise")}
          control={<Checkbox name="checkedF" id="oneActivity_modalRaise_exception"/>}
          label={t("raise")}
        />
        <FormControlLabel
          control={<Checkbox name="checkedF" id="oneActivity_modalRespond_exception"/>}
          onChange={() => changeChecks("Respond")}
          label={t("respond")}
          checked={checks["Respond"]}
        />
        <FormControlLabel
          checked={checks["Clear"]}
          onChange={() => changeChecks("Clear")}
          control={<Checkbox name="checkedF" id="oneActivity_modalClear_exception"/>}
          label={t("clear")}
        />
      </div>
    </div>
  );
}

export default ActivityModal;
