import { Checkbox } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import SearchComponent from "../../../../../UI/Search Component/index.js";
import "./TaskList.css";
import { store, useGlobalState } from "state-pool";
import { useDispatch } from "react-redux";
import { setActivityPropertyChange } from "../../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import { propertiesLabel } from "../../../../../Constants/appConstants.js";
import CloseIcon from "@material-ui/icons/Close";
import styles from "../Task.module.css";
import { useTranslation } from "react-i18next";
import { containsText } from "../../../../../utility/CommonFunctionCall/CommonFunctionCall.js";
import EmptyStateIcon from "../../../../../assets/ProcessView/EmptyState.svg";

function TaskList(props) {
  let { t } = useTranslation();
  let dispatch = useDispatch();
  const [json, setJson] = useState([]);
  const [associatedTasks, setAssociatedTasks] = useState({});
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let temp = JSON.parse(JSON.stringify(localLoadedProcessData));
    setJson(temp.Tasks);
  }, []);

  useEffect(() => {
    setAssociatedTasks(props.tasksAssociated);
  }, [props.tasksAssociated]);

  const handleCheckChange = (e, task) => {
    let temp = { ...associatedTasks };
    if (e.target.checked) {
      temp = {
        ...temp,
        [task.TaskName]: {
          taskTypeInfo: {
            taskName: task.TaskName,
            taskId: task.TaskId,
            taskType: task.TaskType,
            taskGenPropInfo: {
              m_strSubPrcType:
                +task.TaskType === 2 && task.TaskMode !== ""
                  ? task.TaskMode
                  : "A",
            },
          },
          m_bMandatory: false,
          m_bStateAsWait: false,
          m_bTaskDecline: false,
          m_bTaskApprove: false,
          m_bTaskReassign: false,
          m_arrUGInfoList: [],
          m_hMapFieldsMapping: {},
          m_arrTodoInfo: [],
          m_arrExceptionInfo: [],
          m_arrDocumentInfo: [],
          objFormInfo: {},
          m_arrRuleInfo: [],
        },
      };
      setAssociatedTasks(temp);
    } else {
      let newTemp = {};
      Object.keys(temp)?.forEach((el) => {
        if (el !== task.TaskName) {
          newTemp = { ...newTemp, [el]: temp[el] };
        }
      });
      setAssociatedTasks(newTemp);
    }
  };

  const handleAllCheckChange = (e) => {
    let temp = {};
    if (e.target.checked) {
      json?.forEach((task) => {
        temp = {
          ...temp,
          [task.TaskName]: {
            taskTypeInfo: {
              taskName: task.TaskName,
              taskId: task.TaskId,
              taskType: task.TaskType,
              taskGenPropInfo: {
                m_strSubPrcType:
                  +task.TaskType === 2 && task.TaskMode !== ""
                    ? task.TaskMode
                    : "A",
              },
            },
            m_bMandatory: false,
            m_bStateAsWait: false,
            m_bTaskDecline: false,
            m_bTaskApprove: false,
            m_bTaskReassign: false,
            m_arrUGInfoList: [],
            m_hMapFieldsMapping: {},
            m_arrTodoInfo: [],
            m_arrExceptionInfo: [],
            m_arrDocumentInfo: [],
            objFormInfo: {},
            m_arrRuleInfo: [],
          },
        };
      });
    }
    setAssociatedTasks(temp);
  };

  const getCheckedHandler = (taskVar) => {
    let temp = false;
    associatedTasks &&
      Object.values(associatedTasks)?.forEach((assocTask) => {
        if (+assocTask.taskTypeInfo.taskId === +taskVar.TaskId) {
          temp = true;
        }
      });
    return temp;
  };

  const getAllCheckHandler = () => {
    let temp = true;
    if (!json || json?.length === 0) {
      temp = false;
    }
    json?.forEach((el) => {
      let isPresent = false;
      associatedTasks &&
        Object.values(associatedTasks)?.forEach((assocTask) => {
          if (+assocTask.taskTypeInfo.taskId === +el.TaskId) {
            isPresent = true;
          }
        });
      if (!isPresent) {
        temp = false;
      }
    });
    return temp;
  };

  const associateTaskCalled = () => {
    props.selectedTaskToAssoc(associatedTasks);
    props.closeModal();
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.task]: { isModified: true, hasError: false },
      })
    );
  };

  const filteredRows = json?.filter((task) =>
    containsText(task.TaskName, searchTerm)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalHeading}>{t("AssociateTask")}</h3>
        <CloseIcon onClick={props.closeModal} className={styles.closeIcon} />
      </div>
      <SearchComponent
        style={{
          margin: "1rem 1vw",
        }}
        width="18vw"
        height="var(--line_height)"
        onSearchChange={(val) => setSearchTerm(val)}
        clearSearchResult={() => setSearchTerm("")}
      />
      {filteredRows?.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 1vw",
          }}
        >
          <Checkbox
            onChange={(e) => handleAllCheckChange(e)}
            checked={getAllCheckHandler()}
            style={{
              borderRadius: "1px",
              padding: "4px 1px",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "var(--base_text_font_size)",
                color: "black",
                marginLeft: "1vw",
              }}
            >
              Select All
            </p>
          </div>
        </div>
      )}
      <div
        style={{
          width: "100%",
          height: "90%",
          minHeight: "16rem",
          overflowY: "auto",
        }}
      >
        {filteredRows?.length > 0 ? (
          filteredRows?.map((task) => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 1vw",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    onChange={(e) => handleCheckChange(e, task)}
                    checked={getCheckedHandler(task)}
                    style={{
                      borderRadius: "1px",
                      padding: "4px 1px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "1vw",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "var(--base_text_font_size)",
                        color: "black",
                      }}
                    >
                      {task.TaskName}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyStateMainDiv}>
            <img
              className={styles.emptyStateImage}
              src={EmptyStateIcon}
              alt=""
              style={{
                marginTop: "2rem",
              }}
            />
            <p className={styles.emptyStateText} style={{ marginBottom: "0" }}>
              {t("noTasksCreated")}
            </p>
          </div>
        )}
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={props.closeModal}>
          {t("cancel")}
        </button>
        <button className={styles.okButton} onClick={associateTaskCalled}>
          {t("AssociateTasks")}
        </button>
      </div>
    </div>
  );
}

export default TaskList;
