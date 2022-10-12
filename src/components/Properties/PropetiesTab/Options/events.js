import React, { useState, useEffect } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Button,
} from "@material-ui/core";
import { Select, MenuItem } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";
import SelectWithInput from "../../../../UI/SelectWithInput";
import { connect } from "react-redux";
import "./index.css";
import {
  PROCESSTYPE_DEPLOYED,
  PROCESSTYPE_REGISTERED,
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import DeleteIcon from "@material-ui/icons/Delete";
import TabsHeading from "../../../../UI/TabsHeading";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";
import { useReducer } from "react";
import { useRef } from "react";
import { FieldValidations } from "../../../../utility/FieldValidations/fieldValidations";

function events(props) {
  return (
    <>
        <div id="events">
                <h3 className="timerHeading title_text">Events</h3>
                <div className="eventsField">
                  <div className="evtFldName">
                    <div className="elementLabel">{t("eventName")}</div>
                    <div className="elementTxt">
                      <TextField
                        onChange={changeEventHandler}
                        className="time_Options"
                        variant="outlined"
                        disabled={
                          expireStatus == t("neverExpires") || isReadOnly
                        }
                        inputRef={eventNameRef}
                        onKeyPress={(e) => {
                          FieldValidations(e, 150, eventNameRef.current, 50);
                        }}
                      />
                    </div>
                  </div>
                  <div className="evtFldName">
                    <div className="elementLabel">{t("triggerName")}</div>
                    <div className="elementSelect">
                      <FormControl>
                        <Select
                          disabled={
                            expireStatus == t("neverExpires") || isReadOnly
                          }
                          inputProps={{ "aria-label": "Without label" }}
                          value={selectedTriggerEvent}
                          onChange={(e) => {
                            triggerEventHandler(e);
                          }}
                          displayEmpty
                          className="time_Options"
                          MenuProps={{
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left",
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "left",
                            },
                            getContentAnchorEl: null,
                          }}
                        >
                          {loadedProcessData.value.TriggerList.map(
                            (trigger) => {
                              return (
                                <MenuItem
                                  style={{ fontSize: "12px" }}
                                  value={trigger.TriggerName}
                                >
                                  {trigger.TriggerName}
                                </MenuItem>
                              );
                            }
                          )}
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  <div className="evtFldName">
                    <div className="elementLabel">{t("targetAct")}</div>
                    <div className="elementSelect">
                      <FormControl>
                        <Select
                          disabled={
                            expireStatus == t("neverExpires") || isReadOnly
                          }
                          inputProps={{ "aria-label": "Without label" }}
                          value={targetActEvent}
                          onChange={(e) => {
                            targetActEventHandler(e);
                          }}
                          displayEmpty
                          className="time_Options"
                          MenuProps={{
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left",
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "left",
                            },
                            getContentAnchorEl: null,
                          }}
                        >
                          <MenuItem value={t("previousStage")}>
                            <em
                              style={{ fontSize: "12px", fontStyle: "normal" }}
                            >
                              {t("previousStage")}
                            </em>
                          </MenuItem>
                          {loadedProcessData.value.MileStones.map((mile) => {
                            return mile.Activities.map((activity) => {
                              if (activity.ActivityName !== props.cellName)
                                return (
                                  <MenuItem
                                    style={{ fontSize: "12px" }}
                                    value={activity.ActivityName}
                                  >
                                    {activity.ActivityName}
                                  </MenuItem>
                                );
                            });
                          })}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <div className="evtFldName">
                    <Button
                      variant="contained"
                      size="small"
                      className="primary btnEvent"
                      onClick={associateData}
                      disabled={expireStatus == t("neverExpires") || isReadOnly}
                    >
                      <AddIcon />
                    </Button>
                  </div>
                </div>
                {props.isDrawerExpanded ? (
                  <div
                    className={
                      props.isDrawerExpanded
                        ? "associate-list-expand"
                        : "associate-list"
                    }
                  >
                    <table
                      className={
                        props.isDrawerExpanded
                          ? direction == RTL_DIRECTION
                            ? "associate-tbl-expand-rtl"
                            : "associate-tbl-expand"
                          : direction == RTL_DIRECTION
                          ? "associate-tbl-rtl"
                          : "associate-tbl"
                      }
                      direction
                    >
                      <tr>
                        <th>{t("eventName")}</th>
                        <th>{t("triggerName")}</th>
                        <th>{t("targetAct")}</th>
                        <th></th>
                      </tr>

                      {mappedEvents && mappedEvents.length > 0
                        ? mappedEvents?.map((item, i) => (
                            <tr key={i}>
                              <td className="" align="center">
                                {item.m_strEventName}
                              </td>
                              <td align="center">{item.m_strEventTrigName}</td>
                              <td align="center">{item.m_strEventTrgAct}</td>
                              {props.isDrawerExpanded ? (
                                <td>
                                  <DeleteIcon
                                    onClick={() => {
                                      deleteData(item.m_strEventName, i);
                                    }}
                                    className="icon-button"
                                  />
                                </td>
                              ) : (
                                ""
                              )}
                            </tr>
                          ))
                        : null}
                    </table>
                  </div>
                ) : (
                  ""
                )}
              </div>
    </>
  )
}

export default events