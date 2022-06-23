import React, { useState, useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { SERVER_URL } from "../../../../Constants/appConstants";
import axios from "axios";
import { DisableCheckBox } from "../../../../utility/Tools/DisableFunc";
import { PROCESSTYPE_LOCAL } from "../../../../Constants/appConstants";

function CheckBoxes(props) {
  let { t } = useTranslation();
  const [allRights, setAllRights] = useState(false);
  const [checks, setChecks] = useState({
    View: false,
    Raise: false,
    Respond: false,
    Clear: false,
  });
  const [initialChecks, setInitialChecks] = useState({
    View: false,
    Raise: false,
    Respond: false,
    Clear: false,
  });
  const [view, setView] = React.useState("");
  const [raise, setRaise] = React.useState("");
  const [respond, setRespond] = React.useState("");
  const [clear, setClear] = React.useState("");
  const { processType } = props;
  const isProcessReadOnly = processType !== PROCESSTYPE_LOCAL;
  const DisableRaise = [
    { activityType: 2, subActivity: 1 },
    { activityType: 3, subActivity: 1 },
    { activityType: 2, subActivity: 2 },
    { activityType: 11, subActivity: 1 },
  ];

  const DisableRespond = [
    { activityType: 2, subActivity: 1 },
    { activityType: 3, subActivity: 1 },
    { activityType: 2, subActivity: 2 },
    { activityType: 11, subActivity: 1 },
    { activityType: 1, subActivity: 1 },
    { activityType: 1, subActivity: 3 },
  ];

  const DisableClear = [
    { activityType: 2, subActivity: 1 },
    { activityType: 3, subActivity: 1 },
    { activityType: 2, subActivity: 2 },
    { activityType: 11, subActivity: 1 },
    { activityType: 1, subActivity: 1 },
    { activityType: 1, subActivity: 3 },
  ];

  const handleChange = (event, checkType) => {
    if (checkType == "view") {
      setView(event.target.value);
    } else if (checkType == "raise") {
      setRaise(event.target.value);
    } else if (checkType == "respond") {
      setRespond(event.target.value);
    } else {
      setClear(event.target.value);
    }
    let localActivity = null;
    props.exception.Activities &&
      props.exception.Activities.forEach((activity) => {
        if (activity.ActivityId == props.activityId) {
          localActivity = activity;
        }
      });
    axios
      .post(SERVER_URL + `/saveExceptionTriggRight`, {
        processDefId: props.processId,
        pMExpTypeInfos: [
          {
            expTypeName: props.exception.ExceptionName,
            expTypeId: props.exception.ExceptionId,
            pMActRightsInfoList: [
              {
                actId: localActivity.ActivityId,
                vTrigFlag: localActivity.View ? "Y" : "N",
                vaTrigFlag: localActivity.Respond ? "Y" : "N",
                vrTrigFlag: localActivity.Raise ? "Y" : "N",
                vcTrigFlag: localActivity.Clear ? "Y" : "N",
              },
            ],
            pMTrigTypeInfo: {
              triggerName: event.target.value,
            },
          },
        ],
      })
      .then((res) => {
        if (res.status === 200) {
        }
      });
  };

  const changeChecks = (check_type) => {
    if (props.type === "set-all") {
      props.updateSetAllChecks(
        checks[check_type],
        check_type,
        props.docIdx,
        props.groupIndex
      );
    } else {
      props.toggleSingleChecks(
        check_type,
        props.activityIndex,
        props.activityId,
        props.groupIndex,
        checks[check_type],
        checks
      );
    }
  };

  useEffect(() => {
    // // For each activity checkboxes
    let activityInDocType = false;
    if (props.expData && props.type == "activity") {
      let activities =
        props.expData.ExceptionGroups[props.groupIndex].ExceptionList[
          props.activityIndex
        ];
      activities.Activities &&
        activities.Activities.map((activity) => {
          if (activity.ActivityId == props.activityId) {
            if (Object.values(activity).includes(false)) {
              setAllRights(false);
            } else {
              setAllRights(true);
            }
          }
          if (activity.ActivityId == props.activityId) {
            activityInDocType = true;
            setInitialChecks(() => {
              return {
                View: activity.View,
                Raise: activity.Raise,
                Respond: activity.Respond,
                Clear: activity.Clear,
              };
            });
          }
        });
      if (!activityInDocType) {
        setInitialChecks(() => {
          return {
            View: false,
            Raise: false,
            Respond: false,
            Clear: false,
          };
        });
      }
    }

    // For setAll checkBoxes
    if (props.type === "set-all" && props.expData) {
      let setobj =
        props.expData.ExceptionGroups[props.groupIndex].ExceptionList[
          props.docIdx
        ].SetAllChecks;
      if (Object.values(setobj).includes(false)) {
        setAllRights(false);
      } else {
        setAllRights(true);
      }
      let doc =
        props.expData &&
        props.expData.ExceptionGroups[props.groupIndex].ExceptionList[
          props.docIdx
        ].SetAllChecks;

      setInitialChecks(() => {
        return {
          View: doc.View,
          Raise: doc.Raise,
          Respond: doc.Respond,
          Clear: doc.Clear,
        };
      });
    }
  }, []);

  useEffect(() => {
    // // For each activity checkboxes
    let activityInDocType = false;
    if (props.expData && props.type == "activity") {
      let activities =
        props.expData.ExceptionGroups[props.groupIndex].ExceptionList[
          props.activityIndex
        ];
      activities.Activities &&
        activities.Activities.map((activity) => {
          if (activity.ActivityId == props.activityId) {
            if (Object.values(activity).includes(false)) {
              setAllRights(false);
            } else {
              setAllRights(true);
            }
          }
          if (activity.ActivityId == props.activityId) {
            activityInDocType = true;
            setChecks(() => {
              return {
                View: activity.View,
                Raise: activity.Raise,
                Respond: activity.Respond,
                Clear: activity.Clear,
              };
            });
          }
        });
      if (!activityInDocType) {
        setChecks(() => {
          return {
            View: false,
            Raise: false,
            Respond: false,
            Clear: false,
          };
        });
      }
    }

    // For setAll checkBoxes
    if (props.type === "set-all" && props.expData) {
      let setobj =
        props.expData.ExceptionGroups[props.groupIndex].ExceptionList[
          props.docIdx
        ].SetAllChecks;
      if (Object.values(setobj).includes(false)) {
        setAllRights(false);
      } else {
        setAllRights(true);
      }
      let doc =
        props.expData &&
        props.expData.ExceptionGroups[props.groupIndex].ExceptionList[
          props.docIdx
        ].SetAllChecks;
      setChecks(() => {
        return {
          View: doc.View,
          Raise: doc.Raise,
          Respond: doc.Respond,
          Clear: doc.Clear,
        };
      });
    }
  }, [props.expData]);

  const handleAllRightsCheck = () => {
    setAllRights(!allRights);
    if (props.activityId) {
      if (props.handleGroupCheckOneColumn) {
        props.handleGroupCheckOneColumn(
          props.groupIndex,
          props.activityId,
          !allRights
        );
      } else {
        props.handleAllChecks(
          !allRights,
          props.groupIndex,
          props.activityIndex,
          props.activityId
        );
      }
    } else {
      props.GiveCompleteRights(props.docIdx, props.groupIndex, !allRights);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="checkBoxesThree">
        <FormControlLabel
          control={<Checkbox name="checkedF" id="allRight_exception" />}
          label={"All Rights"}
          checked={allRights}
          disabled={isProcessReadOnly ? true : false}
          onChange={handleAllRightsCheck}
        />

        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}
        >
          <FormControlLabel
            control={<Checkbox name="checkedF" id="viewRight_exception" />}
            label={t("view")}
            checked={checks.View}
            disabled={isProcessReadOnly ? true : false}
            onChange={() => changeChecks("View")}
          />
          <span>
            {checks.View && props.type == "activity" ? (
              <FormControl sx={{ m: 1 }} variant="standard">
                <Select
                  className="selectTrigger"
                  style={{
                    width: view ? "100px" : "18px",
                    fontSize: "11px",
                  }}
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={view}
                  onChange={(e) => handleChange(e, "view")}
                >
                  <MenuItem value="" style={{ fontSize: "12px" }}>
                    <em>{t("processView.noneWord")}</em>
                  </MenuItem>
                  {props.expData.Trigger &&
                    props.expData.Trigger.map((trigger) => {
                      return (
                        <MenuItem
                          value={trigger.TriggerName}
                          style={{ fontSize: "12px" }}
                        >
                          {trigger.TriggerName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            ) : null}
          </span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}
        >
          <FormControlLabel
            disabled={
              DisableCheckBox(DisableRaise, props) || isProcessReadOnly
                ? true
                : false
            }
            checked={
              DisableCheckBox(DisableRaise, props) || isProcessReadOnly
                ? initialChecks.Raise
                : checks.Raise
            }
            onChange={() => changeChecks("Raise")}
            control={<Checkbox name="checkedF" id="raiseRight_exception" />}
            label={t("raise")}
          />
          <span>
            {checks.Raise && props.type == "activity" ? (
              <FormControl sx={{ m: 1 }} variant="standard">
                <Select
                  className="selectTrigger"
                  style={{
                    width: raise ? "100px" : "18px",
                    fontSize: "11px",
                  }}
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={raise}
                  onChange={(e) => handleChange(e, "raise")}
                >
                  <MenuItem value="" style={{ fontSize: "12px" }}>
                    <em>{t("processView.noneWord")}</em>
                  </MenuItem>
                  {props.expData.Trigger &&
                    props.expData.Trigger.map((trigger) => {
                      return (
                        <MenuItem
                          value={trigger.TriggerName}
                          style={{ fontSize: "12px" }}
                        >
                          {trigger.TriggerName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            ) : null}
          </span>
        </div>

        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}
        >
          <FormControlLabel
            control={<Checkbox name="checkedF" id="respondRight_exception" />}
            onChange={() => changeChecks("Respond")}
            label={t("respond")}
            disabled={
              DisableCheckBox(DisableRespond, props) || isProcessReadOnly
                ? true
                : false
            }
            checked={
              DisableCheckBox(DisableRespond, props) || isProcessReadOnly
                ? initialChecks.Respond
                : checks.Respond
            }
          />
          <span>
            {checks.Respond && props.type == "activity" ? (
              <FormControl sx={{ m: 1 }} variant="standard">
                <Select
                  className="selectTrigger"
                  style={{
                    width: respond ? "100px" : "18px",
                    fontSize: "11px",
                  }}
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={respond}
                  onChange={(e) => handleChange(e, "respond")}
                >
                  <MenuItem value="" style={{ fontSize: "12px" }}>
                    <em>{t("processView.noneWord")}</em>
                  </MenuItem>
                  {props.expData.Trigger &&
                    props.expData.Trigger.map((trigger) => {
                      return (
                        <MenuItem
                          value={trigger.TriggerName}
                          style={{ fontSize: "12px" }}
                        >
                          {trigger.TriggerName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            ) : null}
          </span>
        </div>

        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}
        >
          <FormControlLabel
            control={<Checkbox name="checkedF" id="clearRight_exception" />}
            label={t("clear")}
            onChange={() => changeChecks("Clear")}
            disabled={
              DisableCheckBox(DisableClear, props) || isProcessReadOnly
                ? true
                : false
            }
            checked={
              DisableCheckBox(DisableClear, props) || isProcessReadOnly
                ? initialChecks.Clear
                : checks.Clear
            }
          />
          <span>
            {checks.Clear && props.type == "activity" ? (
              <FormControl sx={{ m: 1 }} variant="standard">
                <Select
                  className="selectTrigger"
                  style={{
                    width: clear ? "100px" : "18px",
                    fontSize: "11px",
                  }}
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={clear}
                  onChange={(e) => handleChange(e, "clear")}
                >
                  <MenuItem value="" style={{ fontSize: "12px" }}>
                    <em>{t("processView.noneWord")}</em>
                  </MenuItem>
                  {props.expData.Trigger &&
                    props.expData.Trigger.map((trigger) => {
                      return (
                        <MenuItem
                          value={trigger.TriggerName}
                          style={{ fontSize: "12px" }}
                        >
                          {trigger.TriggerName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            ) : null}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CheckBoxes;
