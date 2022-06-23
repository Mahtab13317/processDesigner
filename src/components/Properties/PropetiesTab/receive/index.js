import React, { useState, useEffect } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import "../../Properties.css";
import { Select, MenuItem } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import "./index.css";
import {
  ENDPOINT_RESETINVOCATION,
  ENDPOINT_SETREPLYWORKSTEP,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import axios from "axios";

function ReceiveInvocation(props) {
  let { t } = useTranslation();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [replyActivities, setReplyActivities] = useState([]);
  const [chosenReply, setChosenReply] = useState();
  const [chosenReplyId, setchosenReplyId] = useState("");
  const [chosenReplyID, setChosenReplyID] = useState(null);
  const [invocationType, setInvocationType] = useState(
    t("ReplyAfterCompletion")
  );
  const handleChange = (event) => {
    let jsonBody = {
      processDefId: props.openProcessID,
      activityId: localLoadedActivityPropertyData.ActivityProperty.ActivityId,
      invocationtype: event.target.value,
    };

    axios.post(SERVER_URL + ENDPOINT_RESETINVOCATION, jsonBody).then((res) => {
      if (res.data.Status === 0) {
      }
      console.log(res);
    });
    setInvocationType(event.target.value);
  };
  const OnReplySelect = (e) => {
    let jsonBody = {
      processDefId: props.openProcessID,
      activityId: localLoadedActivityPropertyData.ActivityProperty.ActivityId,
      invocationtype: "RA",
      associatedactivity: chosenReplyId,
    };

    axios.post(SERVER_URL + ENDPOINT_SETREPLYWORKSTEP, jsonBody).then((res) => {
      if (res.data.Status === 0) {
      }
      console.log(res);
    });

    setChosenReply(e.target.value);
  };
  useEffect(() => {
    if (
      loadedActivityPropertyData.value.ActivityProperty.AssociatedActivityId ===
      0
    ) {
      setChosenReply("");
      setInvocationType(t("ReplyImmediate"));
    } else {
      replyActivities.map((replyActivity) => {
        if (
          replyActivity.ActivityId ==
          loadedActivityPropertyData.value.ActivityProperty.AssociatedActivityId
        ) {
          setChosenReply(replyActivity.activityName);
          setInvocationType(t("ReplyAfterCompletion"));
          setChosenReplyID(replyActivity.activityId);
        }
      });
    }
  }, []);

  useEffect(() => {
    let tempData = [];
    loadedProcessData.value.MileStones.map((mile) => {
      mile.Activities.map((activity) => {
        if (activity.ActivityType == 26 && activity.ActivitySubType == 1) {
          tempData.push({
            activityName: activity.ActivityName,
            activityId: activity.ActivityId,
          });
        }
      });
    });
    setReplyActivities(tempData);
  }, [loadedProcessData]);

  return (
    <div className="receiveInvocation">
      <FormControl component="fieldset">
        <RadioGroup
          id="receive_RadioGroup"
          onChange={handleChange}
          aria-label="gender"
          defaultValue={
            localLoadedActivityPropertyData.ActivityProperty
              .AssociatedActivityId == 0
              ? t("ReplyImmediate")
              : t("ReplyAfterCompletion")
          }
          name="radio-buttons-group"
        >
          <FormControlLabel
            id="receive_Radio_replyImmediate"
            value={t("ReplyImmediate")}
            control={<Radio size="small" />}
            label={t("ReplyImmediate")}
          />
          <FormControlLabel
            id="receive_Radio_replyAfterCompletion"
            value={t("ReplyAfterCompletion")}
            control={<Radio size="small" />}
            label={t("ReplyAfterCompletion")}
          />
          {invocationType == t("ReplyAfterCompletion") ? (
            <Select
              onChange={(e) => OnReplySelect(e)}
              className="receive_select"
              value={chosenReply}
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
              {replyActivities.map((reply) => {
                return (
                  <MenuItem
                    id="replyType_activitiesList"
                    value={reply.activityName}
                  >
                    <p id="reply_activityName">{reply.activityName}</p>
                  </MenuItem>
                );
              })}
            </Select>
          ) : null}
        </RadioGroup>
      </FormControl>
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
    openProcessID: state.openProcessClick.selectedId,
  };
};

export default connect(mapStateToProps, null)(ReceiveInvocation);
