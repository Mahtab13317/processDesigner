import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import classes from "./Task.module.css";
import { useTranslation } from "react-i18next";
import { Tabs, Tab, Box, Typography, Button } from "@material-ui/core";
import TaskList from "./TaskList/TaskList";
import { store, useGlobalState } from "state-pool";
import DataMapping from "./DataMapping/DataMapping";
import ManageRights from "./ManageRights/ManageRights";
import AssociateUsers from "./AssociateUsers/AssociateUsers";
import ManageRules from "./ManageRules/ManageRules";
import Modal from "../../../../UI/Modal/Modal";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  OpenProcessSliceValue,
  setOpenProcess,
} from "../../../../redux-store/slices/OpenProcessSlice";
import TabsHeading from "../../../../UI/TabsHeading";

function Task(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const actProperty = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(actProperty);
  const openProcessData = useSelector(OpenProcessSliceValue);

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
    tabRoot: { minWidth: "0px", width: "100px", whiteSpace: "nowrap" },
    mainDiv: {
      overflowY: "scroll",
      display: "flex",
      flexDirection: "column",
      height: "71vh",
      direction: direction,
      // minHeight: props.isDrawerExpanded ? "100vh" : "71vh",
      fontFamily: "Open Sans",
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
      return <ManageRules taskInfo={task} associatedTasks={tasksToAssociate} />;
    else if (propertyTabValue === "rights")
      return <ManageRights styling={styles} taskInfo={task} />;
  };
  const [selectedTabValue, setselectedTabValue] = useState(0);
  const [propertyTabValue, setpropertyTabValue] = useState("user");
  const [taskListModal, settaskListModal] = useState(false);
  const [tasksToAssociate, settasksToAssociate] = useState([]);

  useEffect(() => {
    let temp = JSON.parse(JSON.stringify(openProcessData.loadedData));
    temp.Tasks.map((task1) => {
      localLoadedActivityPropertyData.ActivityProperty?.Interfaces?.TaskTypes?.map(
        (task2) => {
          if (task1.TaskId === task2.TaskId) {
            task1["isChecked"] = false;
            task1["isAssociated"] = true;
            settasksToAssociate((prev) => [...prev, task1]);
          } else {
            task1["isChecked"] = false;
            task1["isAssociated"] = false;
          }
        }
      );
    });
    dispatch(setOpenProcess({ loadedData: temp }));
    dispatch(
      setActivityPropertyChange({
        Task: { isModified: true, hasError: false },
      })
    );
  }, []);

  const addTasksAssociated = (newTaskList) => {
    settasksToAssociate(newTaskList);
  };

  return (
    <>
    <TabsHeading heading={props?.heading} />
      <div
      className={styles.mainDiv}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {props.isDrawerExpanded ? (
        <div className={styles.root}>
          <div
            className="tabs"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                borderRight: "1px solid rgb(5,5,5,0.5)",
                padding: "9px",
              }}
            >
              <p className={classes.taskHeading}>{t("tasks")}</p>
              <AddIcon
                fontSize="large"
                onClick={() => settaskListModal(true)}
                style={{ color: "blue" }}
              />
            </div>

            <Tabs
              orientation="vertical"
              variant="scrollable"
              indicatorColor="primary"
              value={selectedTabValue}
              onChange={(e, newValue) => setselectedTabValue(newValue)}
              aria-label="Vertical tabs example"
              classes={{
                root: styles.tabs,
                selected: styles.selectedTab,
              }}
            >
              {tasksToAssociate.map((task) => (
                <Tab
                  className={classes.processSettingTab}
                  label={task.TaskName}
                  id={task.TaskId}
                />
              ))}
            </Tabs>
          </div>

          {tasksToAssociate.map((task, index) => (
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
      <Modal
        show={taskListModal}
        backDropStyle={{ backgroundColor: "transparent" }}
        style={{
          width: "35.625rem",
          height: "24.75rem",
          // left: props.isDrawerExpanded ? "23%" : "53%",
          top: "19%",
          left: "30%",
          padding: "0",
          boxShadow: "none",
        }}
        modalClosed={() => settaskListModal(false)}
        children={
          <TaskList
            tasksAssociated={tasksToAssociate}
            selectedTaskToAssoc={(e) => addTasksAssociated(e)}
            closeModal={() => settaskListModal(false)}
          />
        }
      />
    </div>
    </>
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
export default connect(mapStateToProps, null)(Task);
