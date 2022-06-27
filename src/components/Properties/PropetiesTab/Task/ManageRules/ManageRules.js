import React, { useState, useEffect } from "react";
import ActivityRules from "../../ActivityRules";
import { useTranslation } from "react-i18next";

function ManageRules(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [taskIndex, setTaskIndex] = useState();

  useEffect(() => {
    props.associatedTasks.forEach((task, index) => {
      if (task.TaskId == props.taskInfo.TaskId) {
        setTaskIndex(index);
      }
    });
  }, [props.taskInfo.TaskId]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily: "Open Sans",
        direction: direction,
      }}
    >
      <ActivityRules taskIndex={taskIndex} />
    </div>
  );
}

export default ManageRules;
