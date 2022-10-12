import React, { useState, useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";
import { DisableCheckBox } from "../../../../utility/Tools/DisableFunc";
import { PROCESSTYPE_LOCAL } from "../../../../Constants/appConstants";

function CheckBoxes(props) {
  let { t } = useTranslation();
  const [allRights, setAllRights] = useState(false);
  const [checks, setChecks] = useState({
    View: false,
    Modify: false,
  });
  const { processType } = props;
  const isProcessReadOnly=processType !== PROCESSTYPE_LOCAL;
  const AllRights = [
    { activityType: 1, subActivity: 2 },
    { activityType: 26, subActivity: 1 },
    { activityType: 10, subActivity: 1 },
    { activityType: 20, subActivity: 1 },
    { activityType: 22, subActivity: 1 },
    { activityType: 31, subActivity: 1 },
    { activityType: 29, subActivity: 1 },
    { activityType: 10, subActivity: 4 },
    { activityType: 33, subActivity: 1 },
    { activityType: 27, subActivity: 1 },
    { activityType: 19, subActivity: 1 },
    { activityType: 21, subActivity: 1 },
    { activityType: 5, subActivity: 1 },
    { activityType: 6, subActivity: 1 },
    { activityType: 5, subActivity: 2 },
    { activityType: 6, subActivity: 2 },
    { activityType: 7, subActivity: 1 },
    { activityType: 34, subActivity: 1 },
    { activityType: 1, subActivity: 1 },
    { activityType: 1, subActivity: 3 },
    { activityType: 10, subActivity: 3 },
    { activityType: 10, subActivity: 7 },
    { activityType: 3, subActivity: 1 },
  ];
  const TempView = [
    { activityType: 1, subActivity: 1 },
    { activityType: 1, subActivity: 3 },
    { activityType: 10, subActivity: 3 },
    { activityType: 10, subActivity: 7 },
    { activityType: 3, subActivity: 1 },
  ];

  const TempModify = [
    { activityType: 1, subActivity: 1 },
    { activityType: 1, subActivity: 3 },
    { activityType: 10, subActivity: 3 },
    { activityType: 10, subActivity: 7 },
    { activityType: 3, subActivity: 1 },
  ];
  const changeChecks = (check_type) => {
    if (props.type === "set-all") {
      props.updateAllTodoRights(
        checks[check_type],
        check_type,
        props.docIdx,
        props.groupIndex
      );
    } else {
      props.toggleSingleChecks(
        checks,
        check_type,
        props.activityIndex,
        props.activityId,
        props.groupIndex
      );
    }
  };

  useEffect(() => {
    // // For each activity checkboxes
    let activityInDocType = false;
    if (props.toDoData && props.type == "activity") {
      let activities =
        props.toDoData.TodoGroupLists[props.groupIndex].ToDoList[
          props.activityIndex
        ];
      activities.Activities.map((activity) => {
        if (activity.ActivityId == props.activityId) {
          if (Object.values(activity).includes(false)) {
            setAllRights(false);
          } else {
            setAllRights(true);
          }
        }
        if (activity.ActivityId == props.activityId) {
          activityInDocType = true;
          setChecks(() => {
            return {
              View: activity.View,
              Modify: activity.Modify,
            };
          });
        }
      });
      if (!activityInDocType) {
        setChecks(() => {
          return {
            View: false,
            Modify: false,
          };
        });
      }
    }

    // For setAll checkBoxes
    if (props.type === "set-all" && props.toDoData) {
      let setobj =
        props.toDoData.TodoGroupLists[props.groupIndex].ToDoList[props.docIdx]
          .AllTodoRights;
      // .map(type=>{
      if (Object.values(setobj).includes(false)) {
        setAllRights(false);
      } else {
        setAllRights(true);
      }
      // })
      let doc =
        props.toDoData &&
        props.toDoData.TodoGroupLists[props.groupIndex].ToDoList[props.docIdx]
          .AllTodoRights;
      setChecks(() => {
        return {
          View: doc.View,
          Modify: doc.Modify,
        };
      });
    }
  }, [props.toDoData]);

  const handleAllRightsCheck = () => {
    setAllRights(!allRights);
    if (props.activityId) {
      if (props.handleGroupCheckOneColumn) {
        props.handleGroupCheckOneColumn(
          props.groupIndex,
          props.activityId,
          !allRights
        );
      } else {
        props.handleAllChecks(
          !allRights,
          props.groupIndex,
          props.activityIndex,
          props.activityId
        );
      }
    } else {
      props.GiveCompleteRights(props.docIdx, props.groupIndex, !allRights);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="checkBoxesThree">
        <FormControlLabel
          control={<Checkbox id="allRight_todo" name="checkedF" />}
          label={"All Rights"}
          checked={allRights}
          disabled={
            DisableCheckBox(AllRights, props) || isProcessReadOnly
              ? true
              : false
          }
          onChange={handleAllRightsCheck}
        />
        <FormControlLabel
          control={<Checkbox id="viewRight_exception" name="checkedF" />}
          label={t("view")}
          checked={checks.View}
          disabled={
            DisableCheckBox(TempView, props) || isProcessReadOnly ? true : false
          }
          style={{ marginLeft: "8px" }}
          onChange={() => changeChecks("View")}
        />
        <FormControlLabel
          checked={checks.Modify}
          disabled={
            DisableCheckBox(TempModify, props) || isProcessReadOnly
              ? true
              : false
          }
          style={{ marginLeft: "8px" }}
          onChange={() => changeChecks("Modify")}
          control={<Checkbox id="modifyRight_exception" name="checkedF" />}
          label={t("modify")}
        />
      </div>
    </div>
  );
}

export default CheckBoxes;
