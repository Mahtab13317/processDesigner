import React, { useState, useEffect } from "react";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import "./Milestone.css";
import { ClickAwayListener } from "@material-ui/core";
import c_Names from "classnames";
import { useTranslation } from "react-i18next";
import { renameMilestone } from "../../../../../utility/CommonAPICall/RenameMilestone";
import "./MilestoneArabic.css";
import { PROCESSTYPE_LOCAL } from "../../../../../Constants/appConstants";

const Mile = (props) => {
  //t is our translation function
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [showDragIcon, setShowDragIcon] = useState(false);
  const { provided, MileName } = props;
  const [mileNameValue, setMileNameValue] = useState("");

  useEffect(() => {
    if (MileName) {
      setMileNameValue(MileName);
    }
  }, [MileName]);

  const mileNameChangeHandler = (e, index) => {
    // let milestone = { ...props.processData };
    // milestone.MileStones[index].MileStoneName = e.target.value;
    // props.setprocessData(milestone);
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

  return (
    <React.Fragment>
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
              <DragIndicatorIcon style={{marginTop: "-0.1875rem", height: "1.4rem" ,marginLeft: "-0.25rem"}} />
            </div>
          ) : (
            <div
            className={c_Names({
              dragIconHandle: direction !== "rtl",
              dragIconHandleArabic: direction == "rtl",
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
              value={mileNameValue}
            />
          </ClickAwayListener>

          <button
            className="addBetween"
            onClick={() => props.addInBetweenNewMile(props.index)}
          >
            <p className="addIcon">+</p>
          </button>
        </div>
        <div className="spaceAfterMile"></div>
      </div>
    </React.Fragment>
  );
};

export default Mile;
