import React, { useEffect, useState } from "react";
import axios from "axios";
import Graph from "./BPMNView/Graph";
import PropertiesTab from "../Properties/Properties";
import {
  view,
  PMWEB,
  SERVER_URL_LAUNCHPAD,
  expandedViewOnDrop,
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
  userRightsMenuNames,
} from "../../Constants/appConstants";
import SubHeader from "./SubHeader/SubHeader";
import { useTranslation } from "react-i18next";
import classes from "./ViewingArea.module.css";
import Milestones from "./AbstractView/Milestones/Milestones";
import { connect, useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import StopIcon from "@material-ui/icons/Stop";
import {
  addMilestone,
  addMilestoneInBetween,
} from "../../utility/CommonAPICall/AddMilestone";
import "../ViewingArea/BPMNView/Graph.css";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { handleDragEnd } from "../../utility/abstarctView/DragDropFunctions";
import ToolBox from "../../components/ViewingArea/BPMNView/Toolbox/Toolbox";
import * as actionCreators from "../../redux-store/actions/selectedCellActions";
import * as actionCreators_activity from "../../redux-store/actions/Properties/showDrawerAction";
import * as actionCreators_task from "../../redux-store/actions/AbstractView/TaskAction";
import { numberedLabel } from "../../utility/bpmnView/numberedLabel";
import {
  defaultWidthMilestone,
  milestoneName as milestoneNameConst,
} from "../../Constants/bpmnView";
import { moveMilestone } from "../../utility/CommonAPICall/MoveMilestone";
import { moveMilestoneArray } from "../../utility/InputForAPICall/moveMilestoneArray";
import { addMileInBetweenArray } from "../../utility/InputForAPICall/addMileInBetweenArray";
import { store, useGlobalState } from "state-pool";
import { getSelectedCellType } from "../../utility/abstarctView/getSelectedCellType";
import { UserRightsValue } from "../../redux-store/slices/UserRightsSlice";
import { getMenuNameFlag } from "../../utility/UserRightsFunctions";

function ViewingArea(props) {
  let { t } = useTranslation();
  const userRightsValue = useSelector(UserRightsValue);
  const direction = `${t("HTML_DIR")}`;
  const [viewType, changeViewType] = useState(view.abstract.langKey);
  const [selectedMile, setSelectedMile] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  let [expandedView, setExpandedView] = useState(false);
  const [graphToolbox, setGraphToolbox] = useState(null);
  const [newId, setNewId] = useState({
    milestoneId: 0,
    milestoneSeqId: 0,
    swimlaneId: 0,
    activityId: 0,
    connectionId: 0,
    annotationId: 0,
    dataObjectId: 0,
    groupBoxId: 0,
    messageId: 0,
    minQueueId: 0,
  });
  const [embeddedActivities, setEmbeddedActivities] = useState([]);
  const {
    processData,
    setProcessData,
    caseEnabled,
    initialRender,
    spinner,
    processType,
  } = props;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

  // Boolean that decides whether add milestone button will be visible or not.
  const createMilestoneFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.createMilestone
  );

  //function to add mile at the end
  const addNewMile = () => {
    addMilestone(t, setNewId, processData.ProcessDefId, setProcessData);
  };

  //function to add mile in between
  const addInBetweenNewMile = (indexVal) => {
    let milestoneId;
    setNewId((oldIds) => {
      let newIds = { ...oldIds };
      newIds.milestoneId = newIds.milestoneId + 1;
      milestoneId = newIds.milestoneId;
      return newIds;
    });
    let prefix = t(milestoneNameConst);
    let milestoneName = numberedLabel(null, prefix, milestoneId);
    let newArray = addMileInBetweenArray(processData, indexVal);
    let newMile = {
      milestoneName: milestoneName,
      milestoneId: milestoneId,
      seqId: newArray.SequenceId,
      width: defaultWidthMilestone,
      action: "A",
      activities: [],
    };
    newArray.array.splice(newArray.SequenceId - 1, 0, newMile);
    addMilestoneInBetween(
      setNewId,
      processData.ProcessDefId,
      setProcessData,
      newMile,
      newArray.array
    );
  };

  const selectActivityHandler = (obj) => {
    if (obj) {
      setSelectedActivity(obj.ActivityId);
      props.selectedCell(
        obj.ActivityId,
        obj.ActivityName,
        obj.ActivityType,
        obj.ActivitySubType,
        null,
        obj.QueueId,
        getSelectedCellType("ACTIVITY")
      );
    } else if (obj === null) {
      setSelectedActivity(null);
      if (!props.showDrawer) {
        props.selectedCell(null, null, null, null, null, null, null);
      }
    }
  };

  const selectMileHandler = (obj) => {
    if (obj) {
      setSelectedMile(obj.iMileStoneId);
      props.selectedCell(
        obj.iMileStoneId,
        obj.MileStoneName,
        null,
        null,
        obj.SequenceId,
        null,
        getSelectedCellType("MILE")
      );
    } else if (obj === null) {
      setSelectedMile(null);
      if (!props.showDrawer) {
        props.selectedCell(null, null, null, null, null, null, null);
      }
    }
  };
  //set Id based on maximum value in processData
  useEffect(() => {
    if (processData !== null || processData !== undefined) {
      //initialRender value is set to avoid localLoadedProcessData and processData from getting into loop
      if (localLoadedProcessData !== null && !initialRender) {
        setlocalLoadedProcessData(processData);
      }
      let maxMilestoneId = 0;
      let maxMilestoneSeqId = 0;
      let maxSwimlaneId = 0;
      let maxActivityId = 0;
      let maxConnectionID = 0;
      let minQueueId = 0;

      //get max milestoneId
      processData?.MileStones?.forEach((milestone) => {
        if (maxMilestoneId < milestone.iMileStoneId) {
          maxMilestoneId = milestone.iMileStoneId;
        }

        //get max SequenceId
        if (maxMilestoneSeqId < milestone.SequenceId) {
          maxMilestoneSeqId = milestone.SequenceId;
        }

        //get max ActivityId
        milestone.Activities.forEach((activity) => {
          if (maxActivityId < activity.ActivityId) {
            maxActivityId = activity.ActivityId;
          }
          if (+activity.QueueId < +minQueueId) {
            minQueueId = +activity.QueueId;
          }
          if (activity.EmbeddedActivity) {
            activity.EmbeddedActivity[0].forEach((embAct) => {
              if (maxActivityId < embAct.ActivityId) {
                maxActivityId = embAct.ActivityId;
              }
              if (+embAct.QueueId < +minQueueId) {
                minQueueId = +embAct.QueueId;
              }
            });
          }
        });
      });
      //get max Swimlaneid
      processData?.Lanes?.forEach((lane) => {
        if (maxSwimlaneId < lane.LaneId) {
          maxSwimlaneId = lane.LaneId;
        }
        if (+lane.QueueId < +minQueueId) {
          minQueueId = +lane.QueueId;
        }
      });

      //get max ConnectionId
      processData?.Connections?.forEach((connection) => {
        if (maxConnectionID < connection.ConnectionId) {
          maxConnectionID = connection.ConnectionId;
        }
      });

      //if there are any changes then update newId state
      if (
        maxActivityId !== newId.activityId ||
        maxConnectionID !== newId.connectionId ||
        maxMilestoneId !== newId.milestoneId ||
        maxSwimlaneId !== newId.swimlaneId ||
        minQueueId !== newId.minQueueId
      ) {
        setNewId({
          ...newId,
          milestoneId: maxMilestoneId,
          milestoneSeqId: maxMilestoneSeqId,
          swimlaneId: maxSwimlaneId,
          activityId: maxActivityId,
          connectionId: maxConnectionID,
          minQueueId: minQueueId,
        });
      }
    }
  }, [processData]);

  useEffect(() => {
    const popupMenu = document.querySelectorAll(".mxPopupMenu");
    popupMenu?.forEach((item) => {
      item.remove();
    });
  }, [viewType]);

  const pinnedApi = () => {
    axios
      .post(SERVER_URL_LAUNCHPAD + "/pin", {
        name: processData.ProcessName,
        type: "P",
        parent: "vaibhav123",
        editor: processData.CreatedBy,
        status: processData.ProcessType, //same for temp
        creationDate: processData.CreatedOn,
        modificationDate: processData.LastModifiedOn,
        accessedDate: processData.CreatedOn, //same as it is temp.
        applicationName: PMWEB, //hardcoded (const file)
        id: processData.ProcessDefId,
        version: processData.VersionNo,
        statusMessage: "Created",
      })
      .then((response) => {});
  };

  const unPinnedApi = () => {
    axios
      .post(SERVER_URL_LAUNCHPAD + "/unpin", {
        status: processData.ProcessType,
        id: processData.ProcessDefId,
        applicationName: PMWEB,
        type: "P",
      })
      .then((response) => {});
  };

  // Function which handles the drag and drop functionality in the abstract view when a milestone or an activity card is dropped in a region.
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
      //}  else if (
      //   source.droppableId.includes("_") &&
      //   destination.droppableId.includes("_")
      // ) {
      //   const associatedActivitiesArray = embeddedActivities;
      //   const [reOrderedList] = associatedActivitiesArray.splice(source.index, 1);
      //   associatedActivitiesArray.splice(destination.index, 0, reOrderedList);
      //   setEmbeddedActivities(associatedActivitiesArray);
      // } else if (source.droppableId.includes("_")) {
      //   const sourceId = source.droppableId;
      //   const temp = sourceId.split("_");
      //   const mileStoneIndex = +temp[0];
      //   const activityIndex = +temp[1];
      //   const destinationMileStoneIndex = +destination.droppableId;
      //   const processObjectData = { ...processData };
      //   const [reOrderedList] = embeddedActivities.splice(source.index, 1);
      //   setEmbeddedActivities(embeddedActivities);
      //   processObjectData.MileStones[destinationMileStoneIndex].Activities.splice(
      //     destination.index,
      //     0,
      //     reOrderedList
      //   );
      //   setProcessData(processObjectData);
      // } else if (destination.droppableId.includes("_")) {
      //   const destinationId = destination.droppableId;
      //   const temp = destinationId.split("_");
      //   const mileStoneIndex = +temp[0];
      //   const activityIndex = +temp[1];
      //   const sourceMileStoneIndex = +source.droppableId;
      //   const processObjectData = { ...processData };
      //   const [reOrderedItem] = processObjectData.MileStones[
      //     sourceMileStoneIndex
      //   ].Activities.splice(source.index, 1);
      //   embeddedActivities.splice(destination.index, 0, reOrderedItem);
      //   setEmbeddedActivities(embeddedActivities);
    } else if (
      source.droppableId === "milestones" &&
      source.index !== destination.index &&
      result.type === "MILE"
    ) {
      let mileArr = moveMilestoneArray(processData, source, destination);
      const [reOrderedList] = mileArr.splice(source.index, 1);
      mileArr.splice(destination.index, 0, reOrderedList);
      moveMilestone(
        mileArr,
        setProcessData,
        processData.ProcessDefId,
        source.index,
        destination.index,
        processData
      );
    } else {
      if (props.taskExpanded) {
        props.setExpandedTask(expandedViewOnDrop);
      }
      handleDragEnd(result, processData, setProcessData);
    }
  };

  return spinner ? (
    <CircularProgress
      style={
        direction === RTL_DIRECTION
          ? { marginTop: "40vh", marginRight: "50%" }
          : { marginTop: "40vh", marginLeft: "50%" }
      }
    />
  ) : (
    <div style={{ width: "100%" }} className={classes.viewingArea}>
      {processType === PROCESSTYPE_LOCAL ? (
        <ToolBox
          view={viewType}
          caseEnabled={caseEnabled}
          graph={viewType === view.bpmn.langKey ? graphToolbox : null}
          setProcessData={setProcessData}
          setNewId={setNewId}
          expandedView={expandedView}
          setExpandedView={setExpandedView}
        />
      ) : null}
      <div className={classes.contentViewingArea}>
        <SubHeader
          viewType={viewType}
          changeViewType={changeViewType}
          setProcessData={setProcessData}
          processData={processData}
          floatButtonHeight={props.floatButtonHeight}
          setExpandedView={setExpandedView}
          processType={processType}
          setNewId={setNewId}
        />
        {viewType === view.abstract.langKey ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="milestones"
              direction="horizontal"
              type="MILE"
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={
                    (expandedView
                      ? classes.abstractViewExpanded
                      : classes.abstractView) +
                    (viewType === view.abstract.langKey
                      ? ""
                      : " " + classes.hiddenView)
                  }
                  style={
                    processType === PROCESSTYPE_LOCAL ? {} : { width: "100vw" }
                  }
                >
                  <Milestones
                    caseEnabled={caseEnabled}
                    embeddedActivities={embeddedActivities}
                    setEmbeddedActivities={setEmbeddedActivities}
                    addNewMile={addNewMile}
                    processData={processData}
                    setprocessData={setProcessData}
                    selectedMile={selectedMile}
                    selectedActivity={selectedActivity}
                    selectMileHandler={selectMileHandler}
                    selectActivityHandler={selectActivityHandler}
                    addInBetweenNewMile={addInBetweenNewMile}
                    activityId={newId}
                    processType={processType}
                    setNewId={setNewId}
                  />
                  {provided.placeholder}
                  {createMilestoneFlag && (
                    <div
                      className={classes.addBtn}
                      onClick={() => addNewMile()}
                      style={{
                        display:
                          processType !== PROCESSTYPE_LOCAL ? "none" : "",
                      }}
                    >
                      <p className={classes.addicon}>+</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : null}

        {viewType === view.bpmn.langKey ? (
          <div
            className={
              (expandedView ? classes.bpmnViewExpanded : classes.bpmnView) +
              (viewType === view.bpmn.langKey ? "" : " " + classes.hiddenView)
            }
            style={processType === PROCESSTYPE_LOCAL ? {} : { width: "100vw" }}
          >
            <Graph
              caseEnabled={caseEnabled}
              displayMessage={props.displayMessage}
              processData={processData}
              setProcessData={setProcessData}
              setNewId={setNewId}
              setGraphToolbox={setGraphToolbox}
              processType={processType}
              viewType={viewType}
            />
          </div>
        ) : null}
      </div>
      <div>
        <button
          onClick={() => props.showDrawer(true)}
          className="propertiesButton_abstract"
        >
          <div className="stopIcon">
            <StopIcon />
            {t("Properties")}
          </div>
        </button>
        <PropertiesTab processData={processData} direction={direction} />
        {/*<ZoomInOut />*/}
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    showDrawer: (flag) => dispatch(actionCreators_activity.showDrawer(flag)),
    selectedCell: (
      id,
      name,
      activityType,
      activitySubType,
      seqId,
      queueId,
      type
    ) =>
      dispatch(
        actionCreators.selectedCell(
          id,
          name,
          activityType,
          activitySubType,
          seqId,
          queueId,
          type
        )
      ),
    setExpandedTask: (taskExpanded) =>
      dispatch(actionCreators_task.expandedTask(taskExpanded)),
  };
};
const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    taskExpanded: state.taskReducer.taskExpanded,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewingArea);
