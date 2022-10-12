import React, { useState } from "react";
import TaskRules from "./TaskRules";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@material-ui/core";
import styles from "../Task.module.css";
import { store, useGlobalState } from "state-pool";
import { setActivityPropertyChange } from "../../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { propertiesLabel } from "../../../../../Constants/appConstants";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function ManageRules(props) {
  let { t } = useTranslation();
  let { taskInfo } = props;
  const direction = `${t("HTML_DIR")}`;
  const dispatch = useDispatch();
  const actProperty = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(actProperty);
  const [checkTask, setCheckTask] = useState({
    m_bStateAsWait: false,
    m_bMandatory: false,
    m_bTaskReassign: false,
    m_bTaskApprove: false,
    m_bTaskDecline: false,
  });
  const [waitStateText, setWaitStateText] = useState("");

  useEffect(() => {
    let checkObj = { ...checkTask };
    Object.keys(checkTask)?.forEach((el) => {
      let newVal =
        localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
          ?.objPMWdeskTasks?.taskMap[taskInfo.taskTypeInfo.taskName] &&
        localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
          ?.objPMWdeskTasks?.taskMap[taskInfo.taskTypeInfo.taskName][el];
      checkObj = {
        ...checkObj,
        [el]: newVal ? newVal : false,
      };
    });
    setCheckTask(checkObj);
    if (
      localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskTasks?.taskMap[taskInfo?.taskTypeInfo?.taskName] &&
      localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskTasks?.taskMap[taskInfo?.taskTypeInfo?.taskName][
        "m_bMandatoryText"
      ]
    ) {
      setWaitStateText(
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo
          .objPMWdeskTasks.taskMap[taskInfo.taskTypeInfo.taskName][
          "m_bMandatoryText"
        ]
      );
    }
  }, [localLoadedActivityPropertyData]);

  const CheckTaskHandler = (e) => {
    let tempActJSON = JSON.parse(
      JSON.stringify(localLoadedActivityPropertyData)
    );
    tempActJSON.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
      taskInfo.taskTypeInfo.taskName
    ] = {
      ...tempActJSON.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
        taskInfo.taskTypeInfo.taskName
      ],
      [e.target.name]: e.target.checked,
    };
    if (e.target.name === "m_bStateAsWait" && !e.target.checked) {
      setWaitStateText("");
      delete tempActJSON.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
        taskInfo.taskTypeInfo.taskName
      ]["m_bMandatoryText"];
    }
    setlocalLoadedActivityPropertyData(tempActJSON);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.task]: { isModified: true, hasError: false },
      })
    );
  };

  const waitTextHandler = (e) => {
    let tempActJSON = JSON.parse(
      JSON.stringify(localLoadedActivityPropertyData)
    );
    tempActJSON.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
      taskInfo.taskTypeInfo.taskName
    ] = {
      ...tempActJSON.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
        taskInfo.taskTypeInfo.taskName
      ],
      ["m_bMandatoryText"]: e.target.value,
    };
    setlocalLoadedActivityPropertyData(tempActJSON);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.task]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily: "var(--font_family)",
        padding: "0.5rem 0",
        direction: direction,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "2vw",
          flexWrap: "wrap",
          alignItems: "center",
          padding: "0 1vw 0.5rem",
        }}
      >
        <div className={styles.checklist}>
          <Checkbox
            checked={checkTask["m_bStateAsWait"]}
            onChange={(e) => CheckTaskHandler(e)}
            className={styles.mainCheckbox}
            data-testid="CheckTodo"
            type="checkbox"
            name="m_bStateAsWait"
          />
          {t("DefaultStateWaiting")}
        </div>
        <textarea
          placeholder={
            !checkTask["m_bStateAsWait"] ? t("ReasonForDefaultWaiting") : ""
          }
          className={styles.waitingTextArea}
          disabled={!checkTask["m_bStateAsWait"]}
          value={waitStateText}
          onChange={(e) => waitTextHandler(e)}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "4vw",
          flexWrap: "wrap",
          padding: "0 1vw 0.5rem",
        }}
      >
        <div className={styles.checklist}>
          <Checkbox
            checked={checkTask["m_bMandatory"]}
            onChange={(e) => CheckTaskHandler(e)}
            className={styles.mainCheckbox}
            data-testid="CheckTodo"
            type="checkbox"
            name="m_bMandatory"
          />
          {t("MakeMandatory")}
        </div>
        <div className={styles.checklist}>
          <Checkbox
            checked={checkTask["m_bTaskReassign"]}
            onChange={(e) => CheckTaskHandler(e)}
            className={styles.mainCheckbox}
            data-testid="CheckTodo"
            type="checkbox"
            name="m_bTaskReassign"
            disabled={
              taskInfo?.taskTypeInfo?.taskType === 2 &&
              (taskInfo?.taskTypeInfo?.taskGenPropInfo?.m_strSubPrcType ===
                "S" ||
                taskInfo?.taskTypeInfo?.taskGenPropInfo?.m_strSubPrcType ===
                  "A")
            }
          />
          {t("AllowReassignment")}
        </div>
        <div className={styles.checklist}>
          <Checkbox
            checked={checkTask["m_bTaskDecline"]}
            onChange={(e) => CheckTaskHandler(e)}
            className={styles.mainCheckbox}
            data-testid="CheckTodo"
            type="checkbox"
            name="m_bTaskDecline"
            disabled={
              taskInfo?.taskTypeInfo?.taskType === 2 &&
              (taskInfo?.taskTypeInfo?.taskGenPropInfo?.m_strSubPrcType ===
                "S" ||
                taskInfo?.taskTypeInfo?.taskGenPropInfo?.m_strSubPrcType ===
                  "A")
            }
          />
          {t("CanBeDeclined")}
        </div>
        <div className={styles.checklist}>
          <Checkbox
            checked={checkTask["m_bTaskApprove"]}
            onChange={(e) => CheckTaskHandler(e)}
            className={styles.mainCheckbox}
            data-testid="CheckTodo"
            type="checkbox"
            name="m_bTaskApprove"
            disabled={
              taskInfo?.taskTypeInfo?.taskType === 2 &&
              (taskInfo?.taskTypeInfo?.taskGenPropInfo?.m_strSubPrcType ===
                "S" ||
                taskInfo?.taskTypeInfo?.taskGenPropInfo?.m_strSubPrcType ===
                  "A")
            }
          />
          {t("NeedsApproval")}
        </div>
      </div>
      <TaskRules taskInfo={taskInfo} />
    </div>
  );
}

export default ManageRules;
