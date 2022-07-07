import React, { useState, useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";
import { disableToDoChecks } from "../../../../utility/Tools/DisableFunc";
import { PROCESSTYPE_LOCAL } from "../../../../Constants/appConstants";

function CheckBoxes(props) {
  let { t } = useTranslation();
  const [allRights, setAllRights] = useState(false);
  const [checks, setChecks] = useState({
    View: false,
    Modify: false,
  });
  const [initialChecks, setInitialChecks] = useState({
    View: false,
    Modify: false,
  });
  const { processType } = props;
  const isProcessReadOnly = processType !== PROCESSTYPE_LOCAL;

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
      let setAll = true;
      activities.Activities.map((activity) => {
        if (activity.ActivityId == props.activityId) {
          activityInDocType = true;
          setChecks(() => {
            return {
              View: activity.View,
              Modify: activity.Modify,
            };
          });
          for (let property in activity) {
            if (
              !disableToDoChecks(props, property) &&
              activity[property] === false &&
              property !== "ActivityId"
            ) {
              setAll = false;
            }
          }
          if (
            disableToDoChecks(props, "View") &&
            disableToDoChecks(props, "Modify")
          ) {
            setAll = false;
          }
        }
      });
      if (!setAll) {
        setAllRights(false);
      } else {
        setAllRights(true);
      }
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

  useEffect(() => {
    // // For each activity checkboxes
    let activityInDocType = false;
    if (props.toDoData && props.type == "activity") {
      let activities =
        props.toDoData.TodoGroupLists[props.groupIndex].ToDoList[
          props.activityIndex
        ];
      let setAll = true;
      activities.Activities.map((activity) => {
        if (activity.ActivityId == props.activityId) {
          activityInDocType = true;
          setInitialChecks(() => {
            return {
              View: activity.View,
              Modify: activity.Modify,
            };
          });
          for (let property in activity) {
            if (
              !disableToDoChecks(props, property) &&
              activity[property] === false &&
              property !== "ActivityId"
            ) {
              setAll = false;
            }
          }
          if (
            disableToDoChecks(props, "View") &&
            disableToDoChecks(props, "Modify")
          ) {
            setAll = false;
          }
        }
      });
      if (!setAll) {
        setAllRights(false);
      } else {
        setAllRights(true);
      }
      if (!activityInDocType) {
        setInitialChecks(() => {
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
      if (Object.values(setobj).includes(false)) {
        setAllRights(false);
      } else {
        setAllRights(true);
      }
      let doc =
        props.toDoData &&
        props.toDoData.TodoGroupLists[props.groupIndex].ToDoList[props.docIdx]
          .AllTodoRights;
      setInitialChecks(() => {
        return {
          View: doc.View,
          Modify: doc.Modify,
        };
      });
    }
  }, []);

  const handleAllRightsCheck = (val) => {
    setAllRights(val);
    if (props.activityId) {
      if (props.handleGroupCheckOneColumn) {
        props.handleGroupCheckOneColumn(
          props.groupIndex,
          props.activityId,
          val
        );
      } else {
        props.handleAllChecks(
          val,
          props.groupIndex,
          props.activityIndex,
          props.activityId,
          props
        );
      }
    } else {
      props.GiveCompleteRights(props.docIdx, props.groupIndex, val);
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
            disableToDoChecks(props, "All") || isProcessReadOnly ? true : false
          }
          onChange={(e) => {
            handleAllRightsCheck(e.target.checked);
          }}
        />
        <FormControlLabel
          control={<Checkbox id="viewRight_exception" name="checkedF" />}
          label={t("view")}
          checked={
            disableToDoChecks(props, "View") ? initialChecks.View : checks.View
          }
          disabled={
            disableToDoChecks(props, "View") || isProcessReadOnly ? true : false
          }
          style={{ marginLeft: "1px" }}
          onChange={() => changeChecks("View")}
        />
        <FormControlLabel
          checked={
            disableToDoChecks(props, "Modify")
              ? initialChecks.Modify
              : checks.Modify
          }
          disabled={
            disableToDoChecks(props, "Modify") || isProcessReadOnly
              ? true
              : false
          }
          style={{ marginLeft: "2px" }}
          onChange={() => changeChecks("Modify")}
          control={<Checkbox id="modifyRight_exception" name="checkedF" />}
          label={t("modify")}
        />
      </div>
    </div>
  );
}

export default CheckBoxes;
