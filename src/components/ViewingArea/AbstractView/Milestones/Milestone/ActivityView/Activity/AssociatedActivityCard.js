import React, { useState, useEffect } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
  Box,
  Grid,
  Card,
  CardContent,
  ClickAwayListener,
} from "@material-ui/core";
import defaultLogo from "../../../../../../../assets/abstractView/Icons/default.svg";
import { Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import styles from "./AssociatedActivityCard.module.css";
import ToolsList from "../../../../../BPMNView/Toolbox/ToolsList";
import {
  startEvents,
  activities,
  intermediateEvents,
  gateway,
  endEvents,
  integrationPoints,
} from "../../../../../../../utility/bpmnView/toolboxIcon";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  PROCESSTYPE_LOCAL,
  view,
} from "../../../../../../../Constants/appConstants";
import { getActivityProps } from "../../../../../../../utility/abstarctView/getActivityProps";
import { onDrop } from "../../../../../../../utility/abstarctView/addWorkstepAbstractView";

export const ActivityCard = (props) => {
  let { t } = useTranslation();
  const [inputValue, setInputValue] = useState();
  const [showDragIcon, setShowDragIcon] = useState(false);
  const [activityType, setactivityType] = useState(false);
  const [showAddIcon, setShowAddIcon] = useState(false);
  let activityProps = getActivityProps(
    props.ActivityType,
    props.ActivitySubType
  );

  useEffect(() => {
    setInputValue(props.ActivityName);
    activityProps = getActivityProps(props.ActivityType, props.ActivitySubType);
  }, [props.ActivityType, props.ActivitySubType, props.ActivityName]);

  let toolTypeList = [
    startEvents,
    activities,
    intermediateEvents,
    gateway,
    integrationPoints,
    endEvents,
  ];
  const {
    index,
    addActivityInBetween,
    embeddedActivities,
    setEmbeddedActivities,
  } = props;

  // Function that handles the change in name of the card.
  const handleChange = (value) => {
    embeddedActivities[index].ActivityName = value;
    setInputValue(value);
  };

  // Function that handles the selected activity for the card.
  const selectedActivityName = (activityType, subActivityType) => {
    embeddedActivities[index].ActivityType = activityType;
    embeddedActivities[index].ActivitySubType = subActivityType;
    setEmbeddedActivities([...embeddedActivities]);
    setactivityType(false);
    setShowDragIcon(false);
  };

  // Function that runs when a draggable item is dragged over a droppable region.
  const onDragOverHandler = (e) => {
    e.preventDefault();
  };

  const onDropHandler = (e, index) => {
    onDrop(e, "newActivityDiv", addActivityInBetween, index);
  };

  // Function that handles the click away handle for the cards.
  const handleClickAway = () => {
    setactivityType(false);
  };

  // Function to handle activity type change when of a new card.
  const clickWorkdesktype = (e) => {
    setactivityType(true);
  };

  return (
    <Draggable draggableId={`${index}`} key={`${index}`} index={index}>
      {(provided) => (
        <ClickAwayListener onClickAway={() => handleClickAway()}>
          <div
            className={styles.cardDiv}
            {...provided.draggableProps}
            ref={provided.innerRef}
            onDragOver={(e) => onDragOverHandler(e)}
          >
            <Box>
              <Card
                onMouseOver={() => {
                  setShowDragIcon(true);
                  setShowAddIcon(true);
                }}
                onMouseLeave={() => {
                  setShowDragIcon(false);
                  setShowAddIcon(false);
                }}
                variant="outlined"
                className={styles.card}
              >
                <CardContent
                  className={`${activityProps[1]} ${styles.cardContent}`}
                >
                  <Box pl={1} ml={1}>
                    <Grid container>
                      <Grid item>
                        {showDragIcon &&
                        props.processType === PROCESSTYPE_LOCAL ? (
                          <div {...provided.dragHandleProps}>
                            <DragIndicatorIcon className={styles.dragIcon} />
                          </div>
                        ) : (
                          <img
                            src={
                              props.ActivityType === ""
                                ? defaultLogo
                                : activityProps[0]
                            }
                            className={styles.logoSize}
                          />
                        )}
                      </Grid>
                      <Grid item>
                        <input
                          id={"Embedded Subprocess" + "_" + index}
                          className={styles.activityInput}
                          onChange={(e) => handleChange(e.target.value)}
                          value={inputValue}
                          onDragOver={(e) => {
                            return;
                          }}
                        />
                      </Grid>
                      <Grid item className={styles.moreVertDiv}>
                        <MoreVertIcon className={styles.moreVertIcon} />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box pl={1} ml={1} pt={1} className="row">
                    <Grid container>
                      <Grid item className={styles.activityTypeList}>
                        {props.ActivityType ? (
                          <p
                            className="selectedActivityType"
                            style={{
                              color: activityProps[2],
                              background:
                                activityProps[3] +
                                " 0% 0% no-repeat padding-box",
                              padding: "2px 7px",
                            }}
                            onClick={() => setactivityType(true)}
                          >
                            {t(activityProps[4])}
                          </p>
                        ) : props.ActivityType === "" ||
                          props.ActivityType == null ? (
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
                        ) : null}

                        {activityType ? (
                          <ToolsList
                            toolTypeList={toolTypeList}
                            subActivities="subActivities"
                            oneToolList="oneToolList"
                            mainMenu="mainMenu"
                            showToolTip={true}
                            toolContainer="toolContainer"
                            toolTypeContainerExpanded="activity_dropdown"
                            expandedList="activityDropdown_List"
                            search={true}
                            selectedActivityName={selectedActivityName}
                            view={view.abstract.langKey}
                            innerList="activityInnerList"
                            bFromActivitySelection={activityType}
                            graph={null}
                          />
                        ) : null}
                      </Grid>
                    </Grid>
                  </Box>
                  <div
                    className={styles.newActivityAddDiv}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setShowAddIcon(true);
                    }}
                  >
                    {(showAddIcon || showDragIcon) &&
                    props.processType === PROCESSTYPE_LOCAL ? (
                      <AddCircleOutlineOutlinedIcon
                        className={styles.newActivityAddIcon}
                        onClick={() => addActivityInBetween(10, 3, index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => setShowAddIcon(true)}
                        onDragLeave={(e) => setShowAddIcon(false)}
                        onDrop={(e) => onDropHandler(e, index)}
                      />
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </Box>
            {provided.placeholder}
          </div>
        </ClickAwayListener>
      )}
    </Draggable>
  );
};
