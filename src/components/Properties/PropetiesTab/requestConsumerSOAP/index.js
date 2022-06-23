import React, { useState, useEffect } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { propertiesLabel } from "../../../../Constants/appConstants";
import TableRequestConsumer from './TableRequestConsumer.js';
import "../../Properties.css";
import { Select, MenuItem } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import CommonTabHeader from "../commonTabHeader";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import "./index.css";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./index.css";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import DeleteIcon from "@material-ui/icons/Delete";
import { Checkbox } from "@material-ui/core";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    // width: props.isDrawerExpanded? '100%': 324,
    height: 40,
  },
  tableContainer: {
    padding: 5,
  },
  tableRow: {
    height: 40,
  },
  tableHeader: {
    fontWeight: 600,
    fontSize: 14,
    padding: 0,
  },
  tableBodyCell: {
    fontSize: 12,
    padding: 0,
  },
  checkboxRow: {
    padding: 0,
  },
});

function RequestConsumerSoap(props) {
  let { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [replyActivities, setReplyActivities] = useState([]);
  const [chosenReply, setChosenReply] = useState();
  const [invocationType, setInvocationType] = useState(null);
  const handleChange = (event) => {
    setInvocationType(event.target.value);
  };
  const [variablesList, setVariablesList] = useState([]);
  const [checkValue, setCheckValue] = useState(null);
  const [selectedActivityIcon, setSelectedActivityIcon] = useState();
  const OnReplySelect = (e) => {
    setChosenReply(e.target.value);
  };

  const [webserviceLocation, setWebserviceLocation] = useState(null);

  useEffect(() => {
    let temp =
      localLoadedActivityPropertyData?.ActivityProperty?.requestConsumerSOAP
        ?.webServLoc;
    setWebserviceLocation(temp);

    if (
      localLoadedActivityPropertyData?.ActivityProperty?.requestConsumerSOAP
        ?.invocationType === "RI"
    ) {
      setChosenReply("");
      setInvocationType(t("ReplyImmediate"));
    } else {
      replyActivities.map((replyActivity) => {
        if (
          replyActivity.ActivityId ==
          localLoadedActivityPropertyData?.ActivityProperty?.requestConsumerSOAP
            ?.m_intReplyAct
        ) {
          setChosenReply(replyActivity.activityName);
          setInvocationType(t("ReplyAfterCompletion"));
        }
      });
    }
  }, [replyActivities]);

  useEffect(() => {
    let activityProps = getActivityProps(
      props.cellActivityType,
      props.cellActivitySubType
    );
    setSelectedActivityIcon(activityProps[0]);
  }, [
    localLoadedProcessData.MileStones,
    props.cellActivityType,
    props.cellActivitySubType,
    props.cellID,
  ]);

  useEffect(() => {
    let tempData = [];
    loadedProcessData?.value?.MileStones?.map((mile) => {
      mile?.Activities?.map((activity) => {
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
    <div>
      <div style={{ padding: "0px 10px 10px 10px" }}>
        <p className="requestConsumerHead">Request Consumer Soap</p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#606060",
              fontWeight: "500",
              marginLeft: "5px",
            }}
          >
            Webservice Location
          </p>
          <input value={webserviceLocation} className="webserviceLocation" />
        </div>
        <div className="receiveInvocation">
          <p style={{ fontSize: "12px", color: "#606060" }}>Invocation Type</p>
          <FormControl component="fieldset">
            <RadioGroup
              id="receive_RadioGroup"
              onChange={handleChange}
              aria-label="gender"
              defaultValue={
                localLoadedActivityPropertyData?.ActivityProperty
                  ?.requestConsumerSOAP?.invocationType == "RI"
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
      </div>
      <TableRequestConsumer/>
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

export default connect(mapStateToProps, null)(RequestConsumerSoap);
