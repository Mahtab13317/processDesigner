import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Checkbox, Tabs, Tab } from "@material-ui/core";
import classes from "../Task.module.css";
import { TabPanel } from "../Task";
import { store, useGlobalState } from "state-pool";
import { useTranslation } from "react-i18next";
import { setActivityPropertyChange } from "../../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { useDispatch } from "react-redux";
import {
  BASE_URL,
  propertiesLabel,
} from "../../../../../Constants/appConstants";
import axios from "axios";

function ManageRights(props) {
  let { t } = useTranslation();
  let { taskInfo } = props;
  const actProperty = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(actProperty);
  const [docRights, setdocRights] = useState([]);
  const [propertyTabValue, setpropertyTabValue] = useState("");

  useEffect(() => {
    let tabNames = [];
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    if (
      temp?.ActivityProperty?.wdeskInfo?.objPMWdeskExceptions?.m_bShowExceptions
    ) {
      tabNames.push("Exceptions");
      Object.values(
        temp?.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap
      ).forEach((task) => {
        if (task.taskTypeInfo?.taskId === taskInfo?.taskTypeInfo?.taskId) {
          Object.values(
            localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
              ?.objPMWdeskExceptions?.exceptionMap
          ).forEach((exc) => {
            let m_arr = task.m_arrExceptionInfo
              ? task.m_arrExceptionInfo?.map(
                  (arr) => arr?.expTypeInfo?.expTypeId
                )
              : [];
            if (m_arr.includes(exc.expTypeInfo?.expTypeId)) return;
            else {
              if (task.m_arrExceptionInfo) {
                temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
                  taskInfo.taskTypeInfo.taskName
                ].m_arrExceptionInfo = [
                  ...task.m_arrExceptionInfo,
                  {
                    vTaskTrigFlag: exc.vTrigFlag, //view
                    vrTaskTrigFlag: exc.vrTrigFlag, //raise
                    vaTaskTrigFlag: exc.vaTrigFlag, //respond

                    vcTaskTrigFlag: exc.vcTrigFlag, //clear
                    expTypeInfo: {
                      expTypeName: exc.expTypeInfo.expTypeName,
                      expTypeId: exc.expTypeInfo.expTypeId,
                    },
                  },
                ];
              } else {
                temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
                  taskInfo.taskTypeInfo.taskName
                ] = {
                  ...task,
                  m_arrExceptionInfo: [
                    ...task.m_arrExceptionInfo,
                    {
                      vTaskTrigFlag: exc.vTrigFlag, //view
                      vrTaskTrigFlag: exc.vrTrigFlag, //raise
                      vaTaskTrigFlag: exc.vaTrigFlag, //respond
                      vcTaskTrigFlag: exc.vcTrigFlag, //clear
                      expTypeInfo: {
                        expTypeName: exc.expTypeInfo.expTypeName,
                        expTypeId: exc.expTypeInfo.expTypeId,
                      },
                    },
                  ],
                };
              }
            }
          });
        }
      });
    }

    if (
      temp?.ActivityProperty?.wdeskInfo?.objPMWdeskDocuments?.m_bchkBoxChecked
    ) {
      tabNames.push("Documents");
      Object.values(
        temp?.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap
      ).forEach((task) => {
        if (task.taskTypeInfo?.taskId === taskInfo?.taskTypeInfo?.taskId) {
          Object.values(
            localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
              ?.objPMWdeskDocuments?.documentMap
          ).forEach((exc) => {
            let m_arr = task.m_arrDocumentInfo
              ? task.m_arrDocumentInfo?.map((arr) => arr?.docTypeId)
              : [];
            if (m_arr.includes(exc.documentType?.docTypeId)) return;
            else {
              if (task.m_arrDocumentInfo) {
                temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
                  taskInfo.taskTypeInfo.taskName
                ].m_arrDocumentInfo = [
                  ...task.m_arrDocumentInfo,
                  {
                    m_bIsAddForTask: exc.isAdd,
                    m_bIsViewForTask: exc.isView,
                    m_bIsModifyForTask: exc.isModify,
                    docTypeName: exc.documentType.docTypeName,
                    docTypeId: exc.documentType.docTypeId,
                  },
                ];
              } else {
                temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
                  taskInfo.taskTypeInfo.taskName
                ] = {
                  ...task,
                  m_arrDocumentInfo: [
                    {
                      m_bIsAddForTask: exc.isAdd,
                      m_bIsViewForTask: exc.isView,
                      m_bIsModifyForTask: exc.isModify,
                      docTypeName: exc.documentType.docTypeName,
                      docTypeId: exc.documentType.docTypeId,
                    },
                  ],
                };
              }
            }
          });
        }
      });
    }

    if (temp?.ActivityProperty?.wdeskInfo?.objPMWdeskTodoLists?.todoRendered) {
      tabNames.push("Todos");
      Object.values(
        temp?.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap
      ).forEach((task) => {
        if (task.taskTypeInfo?.taskId === taskInfo?.taskTypeInfo?.taskId) {
          Object.values(
            localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
              ?.objPMWdeskTodoLists?.todoMap
          )?.forEach((exc) => {
            let m_arr = task.m_arrTodoInfo
              ? task.m_arrTodoInfo?.map((arr) => arr?.todoTypeInfo?.todoId)
              : [];
            if (m_arr.includes(exc.todoTypeInfo?.todoId)) {
              let index = m_arr.indexOf(exc.todoTypeInfo?.todoId);
              temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
                taskInfo.taskTypeInfo.taskName
              ].m_arrTodoInfo[index] = {
                m_bReadOnlyForTask: exc.isReadOnly,
                m_bModifyForTask: exc.isView,
                todoTypeInfo: {
                  todoId: exc.todoTypeInfo.todoId,
                  todoName: exc.todoTypeInfo.todoName,
                },
                modifyDisabled: exc.isReadOnly,
              };
            } else {
              if (task.m_arrTodoInfo) {
                temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
                  taskInfo.taskTypeInfo.taskName
                ].m_arrTodoInfo = [
                  ...task.m_arrTodoInfo,
                  {
                    m_bReadOnlyForTask: exc.isReadOnly,
                    m_bModifyForTask: exc.isView,
                    todoTypeInfo: {
                      todoId: exc.todoTypeInfo.todoId,
                      todoName: exc.todoTypeInfo.todoName,
                    },
                    modifyDisabled: exc.isReadOnly,
                  },
                ];
              } else {
                temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
                  taskInfo.taskTypeInfo.taskName
                ] = {
                  ...task,
                  m_arrTodoInfo: [
                    {
                      m_bReadOnlyForTask: exc.isReadOnly,
                      m_bModifyForTask: exc.isView,
                      todoTypeInfo: {
                        todoId: exc.todoTypeInfo.todoId,
                        todoName: exc.todoTypeInfo.todoName,
                      },
                      modifyDisabled: exc.isReadOnly,
                    },
                  ],
                };
              }
            }
          });
        }
      });
    }

    if (temp?.ActivityProperty?.actGenPropInfo?.m_bFormView) {
      tabNames.push("Forms");
      Object.values(
        temp?.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap
      ).forEach((task) => {
        if (task.taskTypeInfo?.taskId === taskInfo?.taskTypeInfo?.taskId) {
          if (
            task.objFormInfo &&
            +task.objFormInfo.formId !==
              +localLoadedActivityPropertyData?.ActivityProperty?.actGenPropInfo
                ?.selFormId
          ) {
            temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
              taskInfo.taskTypeInfo.taskName
            ].objFormInfo = {
              isReadOnlyForTask: false,
              isModifiedForTask: true,
              formId:
                localLoadedActivityPropertyData?.ActivityProperty
                  ?.actGenPropInfo?.selFormId,
            };
          } else if (!task.objFormInfo) {
            temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
              taskInfo.taskTypeInfo.taskName
            ] = {
              ...task,
              objFormInfo: {
                isReadOnlyForTask: false,
                isModifiedForTask: true,
                formId:
                  localLoadedActivityPropertyData?.ActivityProperty
                    ?.actGenPropInfo?.selFormId,
              },
            };
          }
        }
      });
    }
    setdocRights(tabNames);
    setlocalLoadedActivityPropertyData(temp);
    setpropertyTabValue(tabNames.length > 0 ? tabNames[0] : "");
  }, [taskInfo?.taskTypeInfo?.taskName]);

  const getTabPanels = () => {
    return <RightsTable val={propertyTabValue} activeTask={taskInfo} />;
  };

  return (
    <TabPanel style={{ height: "10px", width: "100%" }}>
      <Tabs
        value={propertyTabValue}
        onChange={(e, val) => setpropertyTabValue(val)}
        className={props.styling.tabsHorizontal}
      >
        {docRights.map((rights) => (
          <Tab
            classes={{ root: props.styling.tabRoot }}
            label={rights}
            value={rights}
          />
        ))}
      </Tabs>

      {getTabPanels()}
    </TabPanel>
  );
}

function RightsTable({ val, activeTask }) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const dispatch = useDispatch();
  const [tableHeaders, settableHeaders] = useState([]);
  const [tableWidth, setTableWidth] = useState("100%");
  const [formsArray, setformsArray] = useState([]);
  const [CurrentTab, setCurrentTab] = useState();
  const actProperty = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(actProperty);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);

  useEffect(() => {
    const getAllFormList = async () => {
      const res = await axios.get(
        BASE_URL +
          `/process/${
            localLoadedProcessData.ProcessType === "R" ? "registered" : "local"
          }/getFormlist/${localLoadedProcessData?.ProcessDefId}`
      );
      setformsArray([
        { formId: "-1", formName: "Default", deviceType: "H" },
        ...res.data,
      ]);
    };
    getAllFormList();
  }, []);

  useEffect(() => {
    if (val === "Forms") {
      settableHeaders([
        { name: t("Form Name") },
        { name: t("modify") },
        { name: t("View") },
      ]);
      setTableWidth("33%");
    } else if (val === "Exceptions") {
      settableHeaders([
        { name: t("ExceptionName") },
        { name: t("view") },
        { name: t("raise") },
        { name: t("respond") },
        { name: t("clear") },
      ]);
      setTableWidth("20%");
    } else if (val === "Todos") {
      settableHeaders([
        { name: "Todo Name" },
        { name: "View" },
        { name: "Modify" },
      ]);
      setTableWidth("20%");
    } else {
      settableHeaders([
        { name: "Document Name" },
        { name: "Add" },
        { name: "View" },
        { name: "Modify" },
      ]);
      setTableWidth("25%");
    }
    setCurrentTab(val);
  }, [val]);

  const onRightsChange = (e, data) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    let type = e.target.name.split("_")[0];
    let op = e.target.name.split("_")[1];
    if (type === "exception") {
      Object.values(
        temp?.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap
      ).forEach((task) => {
        if (task.taskTypeInfo.taskId === activeTask.taskTypeInfo.taskId) {
          task.m_arrExceptionInfo.forEach((exc) => {
            if (exc.expTypeInfo.expTypeId === data.expTypeInfo.expTypeId) {
              if (op === "view") exc.vTaskTrigFlag = e.target.checked;
              if (op === "raise") exc.vrTaskTrigFlag = e.target.checked;
              if (op === "respond") exc.vaTaskTrigFlag = e.target.checked;
              if (op === "clear") exc.vcTaskTrigFlag = e.target.checked;
            }
          });
        }
      });
    } else if (type === "todo") {
      Object.values(
        temp?.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap
      ).forEach((task) => {
        if (task.taskTypeInfo.taskId === activeTask?.taskTypeInfo?.taskId) {
          task.m_arrTodoInfo?.forEach((exc) => {
            if (exc.todoTypeInfo.todoId === data.todoTypeInfo.todoId) {
              if (op === "view") {
                exc.m_bReadOnlyForTask = e.target.checked;
                if (!exc.modifyDisabled) {
                  exc.m_bModifyForTask = !e.target.checked;
                }
              }
              if (op === "modify") {
                exc.m_bReadOnlyForTask = !e.target.checked;
                exc.m_bModifyForTask = e.target.checked;
              }
            }
          });
        }
      });
    } else if (type === "doc") {
      Object.values(
        temp?.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap
      ).forEach((task) => {
        if (task.taskTypeInfo.taskId === activeTask.taskTypeInfo.taskId) {
          task.m_arrDocumentInfo.forEach((exc) => {
            if (exc.docTypeId === data.docTypeId) {
              if (op === "view") exc.m_bIsViewForTask = e.target.checked;
              if (op === "modify") exc.m_bIsModifyForTask = e.target.checked;
              if (op === "add") exc.m_bIsAddForTask = e.target.checked;
            }
          });
        }
      });
    } else if (type === "form") {
      Object.values(
        temp?.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap
      ).forEach((task) => {
        if (task.taskTypeInfo.taskId === activeTask.taskTypeInfo.taskId) {
          if (op === "view") {
            task.objFormInfo.isReadOnlyForTask = e.target.checked;
            task.objFormInfo.isModifiedForTask = !e.target.checked;
          }
          if (op === "modify") {
            task.objFormInfo.isReadOnlyForTask = !e.target.checked;
            task.objFormInfo.isModifiedForTask = e.target.checked;
          }
        }
      });
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.task]: { isModified: true, hasError: false },
      })
    );
  };

  const dataForTabs = () => {
    if (CurrentTab === "Exceptions") {
      return (
        <>
          {Object.values(activeTask?.m_arrExceptionInfo).map((exception) => (
            <TableRow className={classes.tableRow}>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <p
                  style={{
                    fontSize: "var(--base_text_font_size)",
                    fontWeight: "500",
                  }}
                >
                  {exception.expTypeInfo.expTypeName}
                </p>
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <Checkbox
                  size="small"
                  name="exception_view"
                  onChange={(e) => onRightsChange(e, exception)}
                  checked={exception?.vTaskTrigFlag}
                />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <Checkbox
                  size="small"
                  name="exception_raise"
                  onChange={(e) => onRightsChange(e, exception)}
                  checked={exception?.vrTaskTrigFlag}
                />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <Checkbox
                  size="small"
                  name="exception_respond"
                  onChange={(e) => onRightsChange(e, exception)}
                  checked={exception?.vaTaskTrigFlag}
                />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <Checkbox
                  size="small"
                  name="exception_clear"
                  onChange={(e) => onRightsChange(e, exception)}
                  checked={exception?.vcTaskTrigFlag}
                />
              </TableCell>
            </TableRow>
          ))}
        </>
      );
    } else if (CurrentTab === "Documents") {
      return (
        <>
          {Object.values(activeTask.m_arrDocumentInfo).map((document) => (
            <TableRow className={classes.tableRow}>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <p
                  style={{
                    fontSize: "var(--base_text_font_size)",
                    fontWeight: "500",
                  }}
                >
                  {document.docTypeName}
                </p>
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <Checkbox
                  size="small"
                  name="doc_add"
                  onChange={(e) => onRightsChange(e, document)}
                  checked={document.m_bIsAddForTask}
                />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <Checkbox
                  size="small"
                  name="doc_modify"
                  onChange={(e) => onRightsChange(e, document)}
                  checked={document.m_bIsModifyForTask}
                />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <Checkbox
                  size="small"
                  name="doc_view"
                  onChange={(e) => onRightsChange(e, document)}
                  checked={document.m_bIsViewForTask}
                />
              </TableCell>
            </TableRow>
          ))}
        </>
      );
    } else if (CurrentTab === "Forms") {
      return (
        <>
          {formsArray.map((form) => (
            <TableRow className={classes.tableRow}>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <p
                  style={{
                    fontSize: "var(--base_text_font_size)",
                    fontWeight: "500",
                  }}
                >
                  {form.formName}
                </p>
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <Checkbox
                  size="small"
                  name="form_modify"
                  onChange={(e) => onRightsChange(e, form)}
                  checked={
                    form.formId == activeTask.objFormInfo.formId
                      ? activeTask.objFormInfo.isModifiedForTask
                      : false
                  }
                  disabled={
                    form.formId + "" !== activeTask.objFormInfo.formId + ""
                  }
                />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <Checkbox
                  size="small"
                  disabled={
                    form.formId + "" !== activeTask.objFormInfo.formId + ""
                  }
                  name="form_view"
                  onChange={(e) => onRightsChange(e, form)}
                  checked={
                    form.formId == activeTask.objFormInfo.formId
                      ? activeTask.objFormInfo.isReadOnlyForTask
                      : false
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </>
      );
    } else if (CurrentTab === "Todos") {
      return (
        <>
          {Object.values(activeTask?.m_arrTodoInfo).map((todo) => (
            <TableRow className={classes.tableRow}>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <p
                  style={{
                    fontSize: "var(--base_text_font_size)",
                    fontWeight: "500",
                  }}
                >
                  {todo.todoTypeInfo.todoName}
                </p>
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <Checkbox
                  size="small"
                  name="todo_view"
                  onChange={(e) => onRightsChange(e, todo)}
                  checked={todo.m_bReadOnlyForTask}
                />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ padding: "0.5rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <Checkbox
                  size="small"
                  name="todo_modify"
                  onChange={(e) => onRightsChange(e, todo)}
                  checked={todo.m_bModifyForTask}
                  disabled={todo.modifyDisabled}
                />
              </TableCell>
            </TableRow>
          ))}
        </>
      );
    }
  };

  return (
    <TableContainer className={classes.queuetable} component={Paper}>
      <Table
        style={{
          width: CurrentTab === "Forms" ? "70%" : "94%",
          margin: "1rem 2vw",
          border: "1px solid #cecece",
        }}
      >
        <TableHead className={classes.tableHead}>
          <TableRow style={{ maxHeight: "2rem" }}>
            {tableHeaders.map((header) => (
              <TableCell
                width={tableWidth}
                style={{ padding: "0.75rem 1vw" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <p className={classes.tableCellText}>{header.name}</p>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{dataForTabs()}</TableBody>
      </Table>
    </TableContainer>
  );
}

export default ManageRights;
