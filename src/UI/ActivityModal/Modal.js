import React, { useState } from "react";
import "./Modal.css";
import Backdrop from "../Backdrop/Backdrop";
import { ClickAwayListener } from "@material-ui/core";
import { PROCESSTYPE_LOCAL } from "../../Constants/appConstants";

export default function SimpleModal(props) {
  const [open, setOpen] = useState(false);
  let sortSectionOne = props.sortSectionOne;
  let sortSectionThree = props.sortSectionThree;
  let sortSectionFour = props.sortSectionFour;
  let sortSectionTwo = props.sortSectionTwo;
  let sortSectionLocalProcess = props.sortSectionLocalProcess;
  let selectedSortByIndex = 0;
  let selectedSortOrderIndex = 0;

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const commonDiv = (index, option, selectedIndex) => {
    if (!option) {
      return;
    }
    return (
      <div
        onClick={() => {
          if (
            option.props &&
            option.props.children === "New Group" &&
            props.addNewGroupFunc
          ) {
            props.addNewGroupFunc();
          } else if (props.getActionName) {
            props.getActionName(option);
          }
        }}
        className={
          (props.sortByDiv ? props.sortByDiv : "sortByDiv") +
          (props.isArabic && !props.sortByDiv ? "_arabic" : "")
        }
      >
        {option && (
          <li
            className={
              (props.oneSortOption ? props.oneSortOption : "oneSortOption") +
              (props.isArabic && !props.oneSortOption ? "_arabic" : "")
            }
            style={{
              fontWeight:
                index === selectedIndex && props.showTickIcon ? "600" : "400",
              color:
                props.disableOptionValue === option && props.disableOption
                  ? "grey"
                  : "black",
            }}
          >
            {option}
          </li>
        )}
      </div>
    );
  };

  const commonPara = (label, array, selectedIndex) => {
    return (
      <React.Fragment>
        {label && (
          <p className={props.isArabic ? "sortByPara_arabic" : "sortByPara"}>
            {label}
          </p>
        )}
        {array &&
          array.map((option, index) => commonDiv(index, option, selectedIndex))}
      </React.Fragment>
    );
  };
  const body = (
    <div style={{ paddingBottom: "0.25rem" }} className={props.modalPaper}>
      {props.processType && props.processType != PROCESSTYPE_LOCAL ? (
        <div>
          {props.sortSectionLocalProcess && (
            <ul className={props.modalDiv ? props.modalDiv : "sortBy"}>
              {commonPara(null, sortSectionLocalProcess)}
            </ul>
          )}
        </div>
      ) : (
        <div>
          <ul className={props.modalDiv ? props.modalDiv : "sortBy"}>
            {commonPara(props.sortBy, sortSectionOne, selectedSortByIndex)}
          </ul>
          {props.sortSectionTwo && (
            <ul className={props.modalDiv ? props.modalDiv : "sortBy"}>
              <hr
                className={
                  (props.dividerLine ? props.dividerLine : "dividerLine") +
                  (props.isArabic && !props.dividerLine ? "_arabic" : "")
                }
              ></hr>
              {commonPara(
                props.sortOrder,
                sortSectionTwo,
                selectedSortOrderIndex
              )}
            </ul>
          )}
          {props.sortSectionThree && (
            <ul className={props.modalDiv ? props.modalDiv : "sortBy"}>
              <hr
                className={
                  (props.dividerLine ? props.dividerLine : "dividerLine") +
                  (props.isArabic && !props.dividerLine ? "_arabic" : "")
                }
              ></hr>

              {commonPara(null, sortSectionThree)}
            </ul>
          )}
          {props.sortSectionFour && (
            <ul className={props.modalDiv ? props.modalDiv : "sortBy"}>
              <hr
                className={
                  (props.dividerLine ? props.dividerLine : "dividerLine") +
                  (props.isArabic && !props.dividerLine ? "_arabic" : "")
                }
              ></hr>
              {commonPara(null, sortSectionFour)}
            </ul>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={props.hideRelative ? "" : "relative"}>
      <div onClick={handleOpen}>{props.buttonToOpenModal}</div>
      {open ? (
        <React.Fragment>
          {props.backDrop && <Backdrop show={open} clicked={handleClose} />}
          <ClickAwayListener
            onClickAway={() => {
              if (props.backDrop === false) handleClose();
            }}
          >
            <div>{body}</div>
          </ClickAwayListener>
        </React.Fragment>
      ) : null}
    </div>
  );
}
