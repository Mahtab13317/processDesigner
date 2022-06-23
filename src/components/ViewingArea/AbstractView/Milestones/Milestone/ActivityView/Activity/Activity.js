import React, { useState, useEffect } from "react";
import "../Activities.css";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { getActivityProps } from "../../../../../../../utility/abstarctView/getActivityProps";
import c_Names from "classnames";
import { connect } from "react-redux";
import * as actionCreators from "../../../../../../../redux-store/actions/Properties/showDrawerAction";
import * as actionCreators_task from "../../../../../../../redux-store/actions/AbstractView/TaskAction";
import * as actionCreatorsOpenProcess from "../../../../../../../redux-store/actions/processView/actions.js";
import {
  Box,
  Card,
  CardContent,
  Grid,
  ClickAwayListener,
  Button,
} from "@material-ui/core";
import Modal from "../../../../../../../UI/ActivityModal/Modal";
import { TaskInActivity } from "./TaskInActivity";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import defaultLogo from "../../../../../../../assets/abstractView/Icons/default.svg";
import { useTranslation } from "react-i18next";
import ToolsList from "../../../../../BPMNView/Toolbox/ToolsList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EmbeddedActivity from "./EmbeddedActivity";
import {
  startEvents,
  activities,
  intermediateEvents,
  gateway,
  endEvents,
  integrationPoints,
  caseWorkdesk,
} from "../../../../../../../utility/bpmnView/toolboxIcon";
import AddToListDropdown from "../../../../../../../UI/AddToListDropdown/AddToListDropdown";
import dropdown from "../../../../../../../assets/subHeader/dropdown.svg";
import { addSwimLane } from "../../../../../../../utility/CommonAPICall/AddSwimlane";
import { ChangeActivityType } from "../../../../../../../utility/CommonAPICall/ChangeActivityType";
import { renameActivity } from "../../../../../../../utility/CommonAPICall/RenameActivity";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {
  defaultShapeVertex,
  gridSize,
  milestoneTitleWidth,
  widthForDefaultVertex,
} from "../../../../../../../Constants/bpmnView";
import { deleteActivity } from "../../../../../../../utility/CommonAPICall/DeleteActivity";
import {
  PROCESSTYPE_LOCAL,
  view,
} from "../../../../../../../Constants/appConstants";
import { useHistory } from "react-router-dom";
import { store, useGlobalState } from "state-pool";
import { MoveActivity } from "../../../../../../../utility/CommonAPICall/MoveActivity";
import { milestoneWidthToIncrease } from "../../../../../../../utility/abstarctView/addWorkstepAbstractView";

function Activity(props) {
  let { t } = useTranslation();
  const history = useHistory();
  const { provided, caseEnabled } = props;
  let sortSectionOne,
    sortSectionTwo,
    sortSectionThree,
    sortSectionFour,
    sortSectionLocalProcess;
  const [showDragIcon, setShowDragIcon] = useState(false);
  const [showSwimlaneDropdown, setShowSwimlaneDropdown] = useState(false);
  const [activityType, setactivityType] = useState(false);
  const [dropdownActivity, setdropdownActivity] = useState("");
  let activityProps = getActivityProps(
    props.activityType,
    props.activitySubType
  );
  const [src, setsrc] = useState(activityProps[0]); // icon to be shown in the activity card
  const [classForActivity, setclassForActivity] = useState(activityProps[1]); //classname exported for the activity card
  const [color, setcolor] = useState(activityProps[2]); //color for activity type dropdown
  const [BackgroundColor, setBackgroundColor] = useState(activityProps[3]); //background color used for background of activity type in right bottom
  const [actNameValue, setActNameValue] = useState(props.activityName);
  const { embeddedActivities, setEmbeddedActivities } = props;
  const [OpenProcessCallActivity, setOpenProcessCallActivity] = useState(false);
   //code added on 3 June 2022 for BugId 110210
  const [searchedVal, setSearchedVal] = useState("");
  const laneId =
    props.processData.MileStones[props.milestoneIndex].Activities[
      props.activityindex
    ].LaneId;

  const swimlaneData = props.processData.Lanes?.filter((list) => {
    return +list.LaneId !== -99;
  })?.map((x) => {
    return {
      id: x.LaneId,
      name: x.LaneName,
    };
  });

  const selectedSwimlane = swimlaneData?.map((x) => {
    if (x.id === laneId) {
      return x.id;
    }
  });

  const [swimlaneValue, setSwimlaneValue] = useState(selectedSwimlane);
  const loadedProcessData = store.getState("loadedProcessData");
  const [setlocalLoadedProcessData] = useGlobalState(loadedProcessData);

  // Function that changes and updates the activityName for a given activity card.
  const handleInputChange = (e) => {
    setActNameValue(e.target.value);
  };

  // Function that gets options for context menu by checking whether the process is
  // case enabled or not.
  const getOptions = () => {
    if (caseEnabled) {
      return [t("ConvertToCaseWorkdesk"), t("Properties")];
    } else return [t("Properties")];
  };

  const renameActivityFunc = (mIndex, aIndex) => {
    if (actNameValue !== props.activityName) {
      renameActivity(
        props.activityId,
        props.activityName,
        actNameValue,
        props.setprocessData,
        props.processData.ProcessDefId,
        props.processData.ProcessName,
        props.processData.MileStones[mIndex].Activities[aIndex].QueueId,
        false
      );
    }
  };

  // Function that updates the activity card when a activityType is dropped on it from the toolbox.
  const updateActivityCard = (
    e,
    mIndex,
    aIndex,
    activityType,
    activitySubType
  ) => {
    let processObject = { ...props.processData };
    if (processObject.MileStones[mIndex].Activities[aIndex].ActivityType) {
      return;
    } else {
      processObject.MileStones[mIndex].Activities[aIndex].ActivityType =
        activityType;
      processObject.MileStones[mIndex].Activities[aIndex].ActivitySubType =
        activitySubType;
    }
    props.setprocessData(processObject);
  };

  const handleClickAway = () => {
    setactivityType(false);
    renameActivityFunc(props.milestoneIndex, props.activityindex);
    if (props.selectedActivity === props.activityId) {
      props.selectActivityHandler(null);
    }
  };

  useEffect(() => {
    if (
      props.processData.MileStones[props.milestoneIndex].Activities[
        props.activityindex
      ].AssociatedProcess == undefined ||
      props.processData.MileStones[props.milestoneIndex].Activities[
        props.activityindex
      ].AssociatedProcess.Associated_ProcessDefId == ""
    ) {
      setOpenProcessCallActivity(true);
    } else {
      setOpenProcessCallActivity(false);
    }
  }, []);

  const getActionName = (actionName) => {
    if (actionName === "Properties") {
      props.showDrawer(true);
    } else if (actionName === "Delete") {
      let id =
        props.processData.MileStones[props.milestoneIndex].Activities[
          props.activityindex
        ].ActivityId;
      let name =
        props.processData.MileStones[props.milestoneIndex].Activities[
          props.activityindex
        ].ActivityName;
      deleteActivity(
        id,
        name,
        props.processData.ProcessDefId,
        props.setprocessData
      );
    } else if (actionName === "Rename") {
      const input = document.getElementById(
        `${props.milestoneIndex}_${props.activityindex}`
      );
      input.select();
      input.focus();
    } else if (actionName === t("ConvertToCaseWorkdesk")) {
      ChangeActivityType(
        props.processData.ProcessDefId,
        props.processData.MileStones[props.milestoneIndex].Activities[
          props.activityindex
        ].ActivityName,
        caseWorkdesk.activityTypeId, //code added on 31 May 2022 for BugId 110209
        caseWorkdesk.activitySubTypeId, //code added on 31 May 2022 for BugId 110209
        props.setprocessData,
        props.milestoneIndex,
        props.activityindex,
        props.processData.MileStones[props.milestoneIndex].Activities[
          props.activityindex
        ].ActivityId
      );
    } else if (actionName === t("openProcess")) {
      if (!OpenProcessCallActivity) {
        let selectedElement =
          props.processData.MileStones[props.milestoneIndex].Activities[
            props.activityindex
          ];
        props.openProcessClick(
          selectedElement.AssociatedProcess.Associated_ProcessDefId,
          selectedElement.AssociatedProcess.Associated_ProjectName,
          "R",
          selectedElement.AssociatedProcess.Associated_VersionNo,
          selectedElement.AssociatedProcess.Associated_ProcessName
        );

        props.openTemplate(null, null, false);
        setlocalLoadedProcessData(null);
        history.push("/process");
      }
    }
  };

  // Function that runs when the draggable embedded subprocess is dropped.
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const embeddedActivitiesArray = embeddedActivities;
    const [reOrderedList] = embeddedActivitiesArray.splice(source.index, 1);
    embeddedActivitiesArray.splice(destination.index, 0, reOrderedList);
    setEmbeddedActivities(embeddedActivitiesArray);
  };

  useEffect(() => {
    let activityProps = getActivityProps(
      props.activityType,
      props.activitySubType
    );
    setsrc(activityProps[0]);
    setclassForActivity(activityProps[1]);
    setcolor(activityProps[2]);
    setBackgroundColor(activityProps[3]);
  }, [props.activityType, props.activitySubType]);

  // Function that sets some data when dragging starts.
  let onDragStart = (
    e,
    mIndex,
    aIndex,
    activityName,
    activityType,
    activitySubType,
    draggableId
  ) => {
    e.dataTransfer.setData("mIndex", mIndex);
    e.dataTransfer.setData("aIndex", aIndex);
    e.dataTransfer.setData("activityName", activityName);
    e.dataTransfer.setData("activityType", activityType);
    e.dataTransfer.setData("activitySubType", activitySubType);
    e.dataTransfer.setData("draggableId", draggableId);
  };

  // Function that adds a new activity card below the card it was called from.
  // const addActivityInBetween = (mIndex, aIndex) => {
  //   let obj = props.processData;
  //   obj.MileStones[mIndex].Activities.splice(aIndex + 1, 0, {
  //     ActivityName: "",
  //     ActivityType: "",
  //     ActivityId: props.processData.MileStones[mIndex].Activities.length + 1,
  //   });
  //   props.setprocessData(obj);
  // };

  // Function that runs when a draggable item is dragged over a droppable region.
  const onDragOver = (e, mIndex, aIndex) => {
    let processObject = { ...props.processData };
    let activity = processObject.MileStones[mIndex].Activities[aIndex];
    if (activity.ActivityType === 41 && activity.ActivitySubType === 1) {
      e.preventDefault();
    } else {
      return;
    }
  };

  // Function that handles what happens after an item is dragged and dropped in a region.
  const onDropHandler = (e, mIndex, aIndex) => {
    if (JSON.parse(e.dataTransfer.getData("bFromToolbox")) === true) {
      const iActivityId = +e.dataTransfer.getData("iActivityID");
      const iSubActivityId = +e.dataTransfer.getData("iSubActivityID");
      if (aIndex) {
        updateActivityCard(e, mIndex, aIndex, iActivityId, iSubActivityId);
        document
          .getElementById(props.milestoneIndex + "_" + props.activityindex)
          .focus();
      }
    }
  };

  //change lanes from dropdown
  const changeLaneVal = (data) => {
    setSwimlaneValue([data.id]);
    setShowSwimlaneDropdown(false);
    let maxXLeftLoc = 0,
      mileWidth = 0,
      laneHeight = milestoneTitleWidth,
      laneFound = false;
    let currentAct =
      props.processData.MileStones[props.milestoneIndex].Activities[
        props.activityindex
      ];
    let isPreviousActDefault = false;
    props.processData.MileStones?.forEach((mile, index) => {
      if (index === props.milestoneIndex) {
        mile.Activities?.forEach((eachActivity) => {
          if (eachActivity.LaneId === data.id) {
            if (+maxXLeftLoc < +eachActivity.xLeftLoc) {
              maxXLeftLoc = eachActivity.xLeftLoc;
              isPreviousActDefault = defaultShapeVertex.includes(
                getActivityProps(
                  eachActivity.ActivityType,
                  eachActivity.ActivitySubType
                )[5]
              );
            }
          }
        });
      }
      if (index < props.milestoneIndex) {
        mileWidth = mileWidth + +mile.Width;
      }
    });
    maxXLeftLoc = isPreviousActDefault
      ? +maxXLeftLoc + widthForDefaultVertex + gridSize
      : +maxXLeftLoc + gridSize * 2;
    props.processData.Lanes.forEach((lane) => {
      if (+lane.LaneId === +data.id) {
        laneFound = true;
      }
      if (!laneFound) {
        if (!caseEnabled && lane.LaneId !== -99) {
          laneHeight = laneHeight + +lane.Height;
        } else if (caseEnabled) {
          laneHeight = laneHeight + +lane.Height;
        }
      }
    });
    MoveActivity(
      props.processData.ProcessDefId,
      currentAct,
      props.processData.MileStones[props.milestoneIndex].iMileStoneId,
      props.processData.MileStones[props.milestoneIndex].iMileStoneId,
      data.id,
      props.setprocessData,
      gridSize + laneHeight,
      maxXLeftLoc + mileWidth,
      maxXLeftLoc,
      null,
      milestoneWidthToIncrease(
        maxXLeftLoc,
        props.processData,
        props.processData.MileStones[props.milestoneIndex].iMileStoneId,
        currentAct.ActivityId,
        defaultShapeVertex.includes(
          getActivityProps(
            currentAct.ActivityType,
            currentAct.ActivitySubType
          )[5]
        )
      )
    );
  };

  const selectedActivityName = (activityType, subActivityType) => {
    let activityProps = getActivityProps(activityType, subActivityType);
    setsrc(activityProps[0]);
    setclassForActivity(activityProps[1]);
    setcolor(activityProps[2]);
    setBackgroundColor(activityProps[3]);
    setdropdownActivity(t(activityProps[4]));
    ChangeActivityType(
      props.processData.ProcessDefId,
      props.processData.MileStones[props.milestoneIndex].Activities[
        props.activityindex
      ].ActivityName,
      activityType,
      subActivityType,
      props.setprocessData,
      props.milestoneIndex,
      props.activityindex,
      props.processData.MileStones[props.milestoneIndex].Activities[
        props.activityindex
      ].ActivityId
    );
    setactivityType(false);
  };

  const clickWorkdesktype = (e) => {
    if (props.processType !== PROCESSTYPE_LOCAL) {
      setactivityType(false);
    } else {
      setactivityType(true);
    }
  };

  let toolTypeList = [
    startEvents,
    activities,
    intermediateEvents,
    gateway,
    integrationPoints,
    endEvents,
  ];

  //when new lane is added in lanes dropdown(abstarct view)
  const addNewLane = (swimlaneName) => {
    var lanes = props.processData.Lanes;
    let laneId = 0;
    for (let i of lanes) {
      if (laneId < i.LaneId) {
        laneId = i.LaneId;
      }
    }
    let bNameExist = false;
    let allLaneName = props.processData.Lanes?.map((x) => {
      return x.LaneName;
    });
    allLaneName?.forEach((swimlaneInput) => {
      if (swimlaneInput.toLowerCase() == swimlaneName.toLowerCase()) {
        bNameExist = true;
      }
    });
    if (!bNameExist) {
      addSwimLane(
        t,
        laneId,
        swimlaneName,
        lanes,
        props.processData.Lanes[props.processData.Lanes.length - 1],
        props.processData.ProcessDefId,
        props.processData.ProcessName,
        props.setprocessData,
        props.setNewId,
        "abstract",
        props.milestoneIndex,
        props.activityindex
      );
      setSwimlaneValue([laneId + 1]);
      setShowSwimlaneDropdown(false);
    } else {
      setShowSwimlaneDropdown(false);
      alert("samevalue");
    }
  };

  if (props.processType !== PROCESSTYPE_LOCAL) {
    sortSectionLocalProcess = [t("Properties")];
  } else if (+props.activityType === 10 && +props.activitySubType === 3) {
    sortSectionOne = [
      t("Rename"),
      // t("Cut"), t("Copy"),
      t("Delete"),
    ];
    sortSectionTwo = getOptions();
  } else if (+props.activityType === 41 && +props.activitySubType === 1) {
    sortSectionOne = [
      t("Rename"),
      t("publishAsGlobalProcess"),
      t("moveUpwards"),
      t("moveDownwards"),
    ];
    sortSectionTwo = [t("addWorkStepAbove"), t("addWorkStepBelow")];
    sortSectionThree = getOptions();
    sortSectionFour = [t("delete")];
  } else if (+props.activityType === 18 && +props.activitySubType === 1) {
    sortSectionOne = [
      t("Rename"),
      // t("Cut"), t("Copy"),
      t("Delete"),
    ];
    sortSectionTwo = [t("Properties"), t("openProcess")];
  } else {
    sortSectionOne = [
      t("Rename"),
      // t("Cut"), t("Copy"),
      t("Delete"),
    ];
    sortSectionTwo = [t("Properties")];
  }

  const direction = `${t("HTML_DIR")}`;

  return (
    <React.Fragment>
      <ClickAwayListener onClickAway={() => handleClickAway()}>
        <div
          class="activityCard-div"
          id="activityCard"
          onDragStart={(e) =>
            onDragStart(
              e,
              props.milestoneIndex,
              props.activityindex,
              props.activityName,
              props.activityType,
              props.activitySubType,
              "activityCard"
            )
          }
          onDragOver={(e) =>
            onDragOver(e, props.milestoneIndex, props.activityindex)
          }
          onDrop={(e) =>
            onDropHandler(e, props.milestoneIndex, props.activityindex)
          }
        >
          <div>
            <Box
              mt={1}
              onMouseOver={() => setShowDragIcon(true)}
              onMouseLeave={() => setShowDragIcon(false)}
            >
              <Card
                variant="outlined"
                onDoubleClick={() => props.showDrawer(true)}
                onClick={() => {
                  props.selectActivityHandler(
                    props.processData.MileStones[props.milestoneIndex]
                      .Activities[props.activityindex]
                  );
                  props.setprocessData((prev) => {
                    let newObj = { ...prev };
                    newObj.MileStones.forEach((mile, mileIndex) => {
                      mile.Activities.forEach((act, actIndex) => {
                        if (act.clicked) {
                          newObj.MileStones[mileIndex].Activities[
                            actIndex
                          ].clicked = false;
                        }
                      });
                    });
                    newObj.MileStones[props.milestoneIndex].Activities[
                      props.activityindex
                    ].clicked = true;
                    return newObj;
                  });
                }}
                className={
                  "outlinedCard" +
                  (props.selectedActivity === props.activityId
                    ? " cardSelected"
                    : "")
                }
              >
                <CardContent
                  className={c_Names({
                    [classForActivity]: true,
                    activityCard: true,
                  })}
                >
                  <Box p={0} m={0}>
                    <Box
                      style={{
                        marginLeft: direction !== "rtl" ? "0.75rem" : "0",
                        paddingLeft: direction !== "rtl" ? "0.75rem" : "0",
                        marginRight: direction == "rtl" ? "0.75rem" : "0",
                        paddingRight: direction == "rtl" ? "0.75rem" : "0",
                      }}
                    >
                      <Grid container>
                        <Grid item>
                          {showDragIcon &&
                          props.processType === PROCESSTYPE_LOCAL ? (
                            <div
                              className="dragIcon"
                              {...provided.dragHandleProps}
                            >
                              <DragIndicatorIcon />
                            </div>
                          ) : (
                            <img
                              src={props.activityType ? src : defaultLogo}
                              className="logoSize"
                            />
                          )}
                        </Grid>
                        <Grid item>
                          <input
                            id={
                              props.milestoneIndex + "_" + props.activityindex
                            }
                            // autoFocus
                            className="activityInput"
                            style={{
                              marginRight: direction == "rtl" ? "5%" : "0",
                            }}
                            onChange={(e) => {
                              handleInputChange(e);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                renameActivityFunc(
                                  props.milestoneIndex,
                                  props.activityindex
                                );
                              }
                            }}
                            value={actNameValue}
                            disabled={
                              props.processType !== PROCESSTYPE_LOCAL
                                ? true
                                : null
                            }
                          />
                        </Grid>
                        <Grid item className="moreVertIconDiv">
                          <Modal
                            backDrop={false}
                            getActionName={getActionName}
                            modalPaper="modalPaperActivity"
                            sortByDiv="sortByDivActivity"
                            sortByDiv_arabic="sortByDiv_arabicActivity"
                            oneSortOption="oneSortOptionActivity"
                            showTickIcon={false}
                            sortSectionOne={sortSectionOne}
                            sortSectionTwo={sortSectionTwo}
                            disableOption={OpenProcessCallActivity}
                            disableOptionValue={t("openProcess")}
                            sortSectionThree={sortSectionThree}
                            sortSectionFour={sortSectionFour}
                            sortSectionLocalProcess={sortSectionLocalProcess}
                            buttonToOpenModal={
                              <button className="threeDotsButton" type="button">
                                <MoreVertIcon
                                  style={{
                                    color: "#606060",
                                    height: "16px",
                                    width: "16px",
                                  }}
                                />
                              </button>
                            }
                            modalWidth="180"
                            dividerLine="dividerLineActivity"
                            isArabic={false}
                            processType={props.processType}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    {/* {showDragIcon ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          color: "grey",
                          height: "0",
                        }}
                      >
                        <AddCircleOutlineOutlinedIcon
                          className="add-activity-circle-icon"
                          style={{ height: "15px", width: "15px" }}
                          onClick={() =>
                            addActivityInBetween(
                              props.milestoneIndex,
                              props.activityindex
                            )
                          }
                        />
                      </div>
                    ) : null} */}

                    <Box
                      style={{
                        marginLeft: direction !== "rtl" ? "0.75rem" : "0",
                        paddingLeft: direction !== "rtl" ? "0.75rem" : "0",
                        marginRight: direction == "rtl" ? "0.75rem" : "0",
                        paddingRight: direction == "rtl" ? "0.75rem" : "0",
                      }}
                      pt={1}
                      className="row"
                    >
                      <Grid container>
                        <Grid item>
                          <Button
                            className="SwimlaneButton"
                            onClick={() =>
                              props.processType === PROCESSTYPE_LOCAL
                                ? setShowSwimlaneDropdown(true)
                                : setShowSwimlaneDropdown(false)
                            }
                          >
                            {swimlaneData &&
                              swimlaneData.map((item) => {
                                if (swimlaneValue.includes(item.id)) {
                                  return item.name;
                                }
                              })}
                            <img
                              src={dropdown}
                              width="5px"
                              height="15px"
                              style={{
                                marginLeft:
                                  direction !== "rtl" ? "5px" : "none",
                                marginRight:
                                  direction == "rtl" ? "5px" : "none",
                                marginBottom: "2px",
                              }}
                            />
                          </Button>
                          {showSwimlaneDropdown ? (
                            <AddToListDropdown
                              processData={props.processData}
                              completeList={swimlaneData}
                              checkboxStyle="swimlaneCheckbox"
                              checkedCheckBoxStyle="swimlaneChecked"
                              associatedList={swimlaneValue}
                              checkIcon="swimlaneCheckIcon"
                              onChange={changeLaneVal}
                              addNewLabel={t("newSwimlane")}
                              noDataLabel={t("noLane")}
                              onKeydown={addNewLane}
                              labelKey="name"
                              handleClickAway={() =>
                                setShowSwimlaneDropdown(false)
                              }
                            />
                          ) : null}
                        </Grid>
                        <Grid
                          item
                          style={{
                            marginLeft: direction == "rtl" ? "10px" : "auto",
                            marginRight: direction == "rtl" ? "auto" : "0px",
                            marginTop: "5px",
                          }}
                        >
                          {dropdownActivity ? (
                            <p
                              className="selectedActivityType"
                              style={{
                                color: color,
                                background:
                                  BackgroundColor +
                                  " 0% 0% no-repeat padding-box",
                              }}
                              id="workdeskType"
                              onClick={() => setactivityType(true)}
                            >
                              {dropdownActivity}
                            </p>
                          ) : props.activityType ? (
                            <p
                              className="selectedActivityType"
                              style={{
                                color: color,
                                background:
                                  BackgroundColor +
                                  " 0% 0% no-repeat padding-box",
                                padding: "2px 7px",
                              }}
                              id="workdeskType"
                              onClick={(e) => clickWorkdesktype(e)}
                            >
                              {t(
                                getActivityProps(
                                  props.activityType,
                                  props.activitySubType
                                )[4]
                              )}
                            </p>
                          ) : (
                            <div
                              id="workdeskType"
                              className="workdeskType"
                              onClick={(e) => {
                                clickWorkdesktype(e);
                              }}
                            >
                              {t("workstepType")}
                              <ExpandMoreIcon className="expandedIcon" />
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  {+props.activityType === 32 &&
                  +props.activitySubType === 1 ? (
                    <TaskInActivity
                      processType={props.processType}
                      milestoneIndex={props.milestoneIndex}
                      activityindex={props.activityindex}
                      setprocessData={props.setprocessData}
                      processData={props.processData}
                      color={color}
                      BackgroundColor={BackgroundColor}
                      taskExpanded={props.taskExpanded}
                      setTaskExpanded={props.setExpandedTask}
                    />
                  ) : null}
                  {+props.activityType === 41 &&
                  +props.activitySubType === 1 ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable
                        droppableId={`${
                          props.milestoneIndex + "_" + props.activityindex
                        }`}
                        key={props.milestoneIndex}
                        // type="process"
                      >
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            <EmbeddedActivity
                              processType={props.processType}
                              provided={provided}
                              embeddedActivities={embeddedActivities}
                              setEmbeddedActivities={setEmbeddedActivities}
                              milestoneIndex={props.milestoneIndex}
                              activityindex={props.activityindex}
                              setprocessData={props.setprocessData}
                              processData={props.processData}
                              color={color}
                              BackgroundColor={BackgroundColor}
                              setNewId={props.setNewId}
                              mileId={props.mileId}
                              activityId={props.activityId}
                            />
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  ) : null}
                </CardContent>
                {activityType ? (
                  <ToolsList
                    toolTypeList={toolTypeList}
                    subActivities="subActivities"
                    oneToolList="oneToolList"
                    mainMenu="mainMenu"
                    toolContainer="toolContainer"
                    toolTypeContainerExpanded="activity_dropdown"
                    expandedList="activityDropdown_List"
                    search={true}
                    selectedActivityName={selectedActivityName} 
                    searchedVal={searchedVal} //code added on 3 June 2022 for BugId 110210
                    setSearchedVal={setSearchedVal} //code added on 3 June 2022 for BugId 110210
                    view={view.abstract.langKey}
                    innerList="activityInnerList"
                    bFromActivitySelection={activityType}
                    graph={null}
                    style={{ right: direction == "rtl" ? "65%" : "none" }}
                  />
                ) : null}
              </Card>
            </Box>
          </div>
        </div>
      </ClickAwayListener>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    taskExpanded: state.taskReducer.taskExpanded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showDrawer: (flag) => dispatch(actionCreators.showDrawer(flag)),
    setExpandedTask: (taskExpanded) =>
      dispatch(actionCreators_task.expandedTask(taskExpanded)),

    openProcessClick: (id, name, type, version, processName) =>
      dispatch(
        actionCreatorsOpenProcess.openProcessClick(
          id,
          name,
          type,
          version,
          processName
        )
      ),
    openTemplate: (id, name, flag) =>
      dispatch(actionCreatorsOpenProcess.openTemplate(id, name, flag)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
