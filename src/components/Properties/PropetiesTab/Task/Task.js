import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import classes from "./Task.module.css";
import { useTranslation } from "react-i18next";
import { Tabs, Tab, Box, Typography } from "@material-ui/core";
import TaskList from "./TaskList/TaskList";
import { store, useGlobalState } from "state-pool";
import DataMapping from "./DataMapping/DataMapping";
import ManageRights from "./ManageRights/ManageRights";
import AssociateUsers from "./AssociateUsers/AssociateUsers";
import ManageRules from "./ManageRules/ManageRules";
import Modal from "../../../../UI/Modal/Modal";
import EmptyStateIcon from "../../../../assets/ProcessView/EmptyState.svg";
import * as actionCreators from "../../../../redux-store/actions/Properties/showDrawerAction";

function Task(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const actProperty = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(actProperty);

  let dispatch = useDispatch();
  const useStyles = makeStyles({
    root: {
      flexGrow: 1,
      backgroundColor: "white",
      display: "flex",
      height: "100%",
      direction: direction,
    },
    input: {
      height: "2.0625rem",
    },
    tabs: {
      borderRight: `1px solid rgb(5,5,5,0.5)`,
      height: "100%",
      width: "15.625rem",
    },
    tabsHorizontal: {
      height: "43px",
      borderBottom: "1px solid  rgb(5,5,5,0.2)",
      minHeight: "0px",
    },
    selectedTab: {
      background: "red",
    },
    tabRoot: {
      minWidth: "0px",
      margin: "0 12px !important",
      whiteSpace: "nowrap",
    },
    mainDiv: {
      overflowY: "scroll",
      display: "flex",
      flexDirection: "column",
      height: "66vh",
      direction: direction,
      // minHeight: props.isDrawerExpanded ? "100vh" : "71vh",
      fontFamily: "var(--font_family)",
      width: "100%",
      // maxWidth: "100vw",
      paddingTop: props.isDrawerExpanded ? "0" : "0.4rem",

      "&::-webkit-scrollbar": {
        backgroundColor: "transparent",
        width: "0.375rem",
        height: "1.125rem",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "transparent",
        borderRadius: "0.313rem",
      },

      "&:hover::-webkit-scrollbar": {
        overflowY: "visible",
        width: "0.375rem",
        height: "1.125rem",
      },
      "&:hover::-webkit-scrollbar-thumb": {
        background: "#8c8c8c 0% 0% no-repeat padding-box",
        borderRadius: "0.313rem",
      },
    },
  });

  const styles = useStyles();
  const getTabPanels = (task) => {
    if (propertyTabValue === "user") return <AssociateUsers taskInfo={task} />;
    else if (propertyTabValue === "dataMap")
      return <DataMapping taskInfo={task} />;
    else if (propertyTabValue === "rules")
      return <ManageRules taskInfo={task} />;
    else if (propertyTabValue === "rights")
      return <ManageRights styling={styles} taskInfo={task} />;
  };
  const [selectedTabValue, setselectedTabValue] = useState(0);
  const [propertyTabValue, setpropertyTabValue] = useState("user");
  const [taskListModal, settaskListModal] = useState(false);

  const newTaskObj = {
    taskTypeInfo: {
      taskName: "",
      taskId: "",
      taskType: "",
      taskGenPropInfo: {
        m_strSubPrcType: "A",
      },
    },
    m_bMandatory: false,
    m_bStateAsWait: false,
    m_bMandatoryText: "",
    m_bTaskDecline: false,
    m_bTaskApprove: false,
    m_bTaskReassign: false,
    m_arrUGInfoList: [],
    m_hMapFieldsMapping: {
      // 1: {
      //   m_strMappedTaskVarName: "",
      //   m_strTaskReadOnlyVar: "",
      //   varName: "",
      //   variableId: "",
      //   varTypeFieldId: "",
      // },
    },
    m_arrTodoInfo: [
      // {
      //   m_bModifyForTask: true,
      //   m_bReadOnlyForTask: true,
      //   todoTypeInfo: {
      //     todoName: "",
      //     todoId: "",
      //   },
      // },
    ],
    m_arrExceptionInfo: [
      // {
      //   vTaskTrigFlag: true,
      //   vrTaskTrigFlag: true,
      //   vaTaskTrigFlag: true,
      //   vcTaskTrigFlag: true,
      //   expTypeInfo: {
      //     expTypeName: "",
      //     expTypeId: "",
      //   },
      // },
    ],
  };

  const addTasksAssociated = (newTaskList) => {
    let temp = global.structuredClone(localLoadedActivityPropertyData);
    temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap = {
      ...newTaskList,
    };
    setlocalLoadedActivityPropertyData(temp);
  };

  return (
    <div
      className={styles.mainDiv}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskTasks?.taskMap &&
      Object.values(
        localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
          ?.objPMWdeskTasks?.taskMap
      ).length > 0 ? (
        <div className={styles.root}>
          <div
            className="tabs"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              flex: "1",
              borderRight: props.isDrawerExpanded
                ? "1px solid rgb(5,5,5,0.5)"
                : "0",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                padding: "0.5rem 1vw",
                alignItems: "center",
              }}
            >
              <p className={classes.taskHeading}>{t("tasks")}</p>
              <AddIcon
                onClick={() => {
                  settaskListModal(true);
                  if (!props.isDrawerExpanded) {
                    props.expandDrawer(true);
                  }
                }}
                style={{
                  color: "var(--button_color)",
                  width: "1.25rem",
                  height: "1.25rem",
                  cursor: "pointer",
                }}
              />
            </div>
            <div className={styles.streamListDiv}>
              {localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
                ?.objPMWdeskTasks?.taskMap &&
                Object.values(
                  localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
                    ?.objPMWdeskTasks?.taskMap
                )?.map((val, index) => {
                  return (
                    <div
                      className="flex"
                      style={{
                        marginTop: "0.5rem",
                        cursor: "pointer",
                        padding: "0.5rem 0.75vw",
                        background:
                          selectedTabValue === index
                            ? "#e8f3fa 0% 0% no-repeat padding-box"
                            : "#fff",
                      }}
                      onClick={() => {
                        setselectedTabValue(index);
                      }}
                    >
                      <div
                        style={{
                          font: "normal normal 600 var(--base_text_font_size)/17px var(--font_family)",
                        }}
                      >
                        {index + 1}.{" "}
                      </div>
                      <div id={val.taskTypeInfo.taskId}>
                        <h5
                          style={{
                            font: "normal normal 600 var(--base_text_font_size)/17px var(--font_family)",
                            marginLeft: "0.25vw",
                          }}
                        >
                          {val.taskTypeInfo.taskName}{" "}
                        </h5>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {props.isDrawerExpanded ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "4",
              }}
            >
              {localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
                ?.objPMWdeskTasks?.taskMap &&
                Object.values(
                  localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
                    ?.objPMWdeskTasks?.taskMap
                ).map((task, index) => (
                  <TabPanel
                    style={{ height: "10px", width: "100%" }}
                    value={selectedTabValue}
                    index={index}
                  >
                    <Tabs
                      value={propertyTabValue}
                      onChange={(e, val) => setpropertyTabValue(val)}
                      className={styles.tabsHorizontal}
                    >
                      <Tab
                        classes={{ root: styles.tabRoot }}
                        label={t("Users")}
                        value="user"
                      />
                      <Tab
                        classes={{ root: styles.tabRoot }}
                        label={t("Data Mapping")}
                        value="dataMap"
                      />
                      <Tab
                        classes={{ root: styles.tabRoot }}
                        label={t("Rules")}
                        value="rules"
                      />
                      <Tab
                        classes={{ root: styles.tabRoot }}
                        label={t("Rights")}
                        value="rights"
                      />
                    </Tabs>
                    {getTabPanels(task)}
                  </TabPanel>
                ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className={classes.emptyStateMainDiv}>
          <img
            className={classes.emptyStateImage}
            src={EmptyStateIcon}
            alt=""
            style={{
              marginTop: "6rem",
            }}
          />
          <p
            className={classes.emptyStateText}
            style={{ marginBottom: "0", marginTop: "0.375rem" }}
          >
            {t("noTasksAssociated")}
          </p>
          <p className={classes.emptyStateText}>{t("pleaseAssociateTasks")}</p>
          <button
            id="AR_Add_Rule_Locally"
            className={classes.addRuleLocallyButton}
            onClick={() => {
              if (!props.isDrawerExpanded) {
                props.expandDrawer(true);
              }
              settaskListModal(true);
            }}
          >
            {t("AssociateTask")}
          </button>
        </div>
      )}

      {taskListModal && (
        <Modal
          show={taskListModal}
          backDropStyle={{ backgroundColor: "transparent" }}
          style={{
            width: "40vw",
            top: "30%",
            left: "32vw",
            padding: "0",
            boxShadow: "none",
          }}
          children={
            <TaskList
              tasksAssociated={
                localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
                  ?.objPMWdeskTasks?.taskMap
              }
              selectedTaskToAssoc={(list) => addTasksAssociated(list)}
              closeModal={() => settaskListModal(false)}
            />
          }
        />
      )}
    </div>
  );
}

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    expandDrawer: (flag) => dispatch(actionCreators.expandDrawer(flag)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Task);
