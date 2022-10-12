import React, { useState, useEffect } from "react";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import "./Milestone.css";
import { ClickAwayListener } from "@material-ui/core";
import c_Names from "classnames";
import { useTranslation } from "react-i18next";
import { renameMilestone } from "../../../../../utility/CommonAPICall/RenameMilestone";
import "./MilestoneArabic.css";
import {
  PROCESSTYPE_LOCAL,
  userRightsMenuNames,
} from "../../../../../Constants/appConstants";
import { useDispatch, useSelector } from "react-redux";
import { UserRightsValue } from "../../../../../redux-store/slices/UserRightsSlice";
import { getMenuNameFlag } from "../../../../../utility/UserRightsFunctions";
import { useRef } from "react";
import { FieldValidations } from "../../../../../utility/FieldValidations/fieldValidations";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Modal from "../../../../../UI/ActivityModal/Modal";
import {
  deleteMilestoneActivity,
  deleteMilestoneArray,
} from "../../../../../utility/InputForAPICall/deleteMilestoneArray";
import { deleteMilestone } from "../../../../../utility/CommonAPICall/DeleteMilestone";
{
  /*code added on 8 August 2022 for BugId 112903*/
}
const Mile = (props) => {
  const userRightsValue = useSelector(UserRightsValue);
  //t is our translation function
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [showDragIcon, setShowDragIcon] = useState(false);
  const { provided, MileName } = props;
  const [mileNameValue, setMileNameValue] = useState("");
  const mileNameRef = useRef();
  const dispatch = useDispatch();

  // Boolean that decides whether create milestone button will be visible or not.
  const createMilestoneRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.createMilestone
  );

  useEffect(() => {
    if (MileName) {
      setMileNameValue(MileName);
    }
  }, [MileName]);

  const mileNameChangeHandler = (e, index) => {
    setMileNameValue(e.target.value);
  };

  const mileNameonKeydown = () => {
    if (mileNameValue !== props.MileName) {
      renameMilestone(
        props.MileId,
        props.processData.MileStones[props.index].MileStoneName,
        mileNameValue,
        props.setprocessData,
        props.processData.ProcessDefId,
        false
      );
    }
  };

  const getActionName = (actionName) => {
    if (actionName === t("Delete")) {
      let mileArray, mileAct;
      mileArray = deleteMilestoneArray(props.processData, props.MileId);
      mileAct = deleteMilestoneActivity(props.processData, props.MileId);
      deleteMilestone(
        props.MileId,
        props.setprocessData,
        props.processData.ProcessDefId,
        mileArray.array,
        mileArray.index,
        props.processData.ProcessType,
        mileAct.activityNameList,
        mileAct.activityIdList,
        dispatch
      );
    } else if (actionName === t("Rename")) {
      mileNameRef.current.select();
      mileNameRef.current.focus();
    }
  };

  return (
    <div
      className={c_Names({
        milestoneArrowFull: props.index === 0 && direction !== "rtl",
        milestoneArrow: props.index !== 0 && direction !== "rtl",
        milestoneArrowEnd:
          props.index == props.length - 1 && direction !== "rtl",

        milestoneArrowFullArabic: props.index === 0 && direction == "rtl",
        milestoneArrowArabic: props.index !== 0 && direction == "rtl",
        milestoneArrowEndArabic:
          props.index == props.length - 1 && direction == "rtl",
      })}
      onClick={() => props.selectMileHandler(props.Mile)}
      title={props.MileName}
    >
      <div className="beforeDiv"></div>
      <div
        className="milestonePosition"
        onMouseOver={() => setShowDragIcon(true)}
        onMouseLeave={() => setShowDragIcon(false)}
      >
        {showDragIcon && props.processType === PROCESSTYPE_LOCAL ? (
          <div
            className={c_Names({
              dragIconHandle: direction !== "rtl",
              dragIconHandleArabic: direction == "rtl",
            })}
            {...provided.dragHandleProps}
          >
            <DragIndicatorIcon
              style={{
                height: "1.75rem",
                width: "1.75rem",
              }}
            />
          </div>
        ) : (
          <div
            className={c_Names({
              mileIndexDiv: direction !== "rtl",
              mileIndexDivArabic: direction == "rtl",
            })}
          >
            {props.index + 1 + "."}
          </div>
        )}

        {/* <img src={deleteImg} alt="X" className='mileDeleteIcon' onClick={props.deleteMileHandler} title={props.MileName}/> */}
        <ClickAwayListener onClickAway={() => mileNameonKeydown()}>
          <input
            className={"milestoneInput"}
            placeholder={t("milestone.placeholder")}
            onChange={(e) => mileNameChangeHandler(e, props.index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim().length > 0) {
                mileNameonKeydown();
              }
            }}
            id="mileNameDiv"
            value={mileNameValue}
            ref={mileNameRef}
            onKeyPress={(e) =>
              FieldValidations(e, 180, mileNameRef.current, 60)
            }
          />
        </ClickAwayListener>
        {createMilestoneRightsFlag && (
          <button
            className="addBetween icon-button"
            onClick={() => props.addInBetweenNewMile(props.index)}
          >
            <p className="addIcon">+</p>
          </button>
        )}
        <Modal
          backDrop={false}
          getActionName={getActionName}
          modalPaper="modalPaperMile"
          sortByDiv="sortByDivActivity"
          sortByDiv_arabic="sortByDiv_arabicActivity"
          oneSortOption="oneSortOptionActivity"
          showTickIcon={false}
          sortSectionOne={[t("Rename"), t("Delete")]}
          buttonToOpenModal={
            <div className="threeDotsButton" style={{ marginLeft: "4px" }}>
              <MoreVertIcon
                style={{
                  color:
                    props.selectedMile === props.MileId ? "#fff" : "#606060",
                  height: "1.25rem",
                  width: "1.25rem",
                  marginLeft: "auto",
                }}
              />
            </div>
          }
          modalWidth="180"
          dividerLine="dividerLineActivity"
          isArabic={false}
          processType={props.processType}
        />
      </div>
      <div className="spaceAfterMile"></div>
      <div className="afterDiv"></div>
    </div>
  );
};

export default Mile;
