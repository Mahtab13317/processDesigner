import React from "react";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import CloseIcon from "@material-ui/icons/Close";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import * as actionCreators from "../../../redux-store/actions/Properties/showDrawerAction.js";
import { getActivityProps } from "../../../utility/abstarctView/getActivityProps.js";
import * as actionCreators_activity from "../../../redux-store/actions/Properties/showDrawerAction";
import { useDispatch } from "react-redux";
import { setSave } from "../../../redux-store/slices/ActivityPropertySaveCancelClicked";
import { getSelectedCellType } from "../../../utility/abstarctView/getSelectedCellType.js";

function DataFieldsCommonSection(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}​​​​​​​​`;
  const dispatch = useDispatch();

  // Function that handles the size of the drawer.
  const handleDrawerSize = () => {
    props.expandDrawer(!props.isDrawerExpanded);
  };

  const closePropertiesModal = () => {
    dispatch(setSave({ CloseClicked: true }));
  };

  return (
    <div
      style={{
        direction: direction,
        padding: "0.5rem 0.5vw 0.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: direction === "rtl" ? "row-reverse" : "row",
          backgroundColor: props.isDrawerExpanded ? "white" : null,
          direction: direction,
        }}
      >
        <div className="flex">
          <img
            src={props.selectedActivityIcon}
            style={{
              height: "2.5rem",
              width: "2.5rem",
            }}
            alt=""
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Open Sans",
              marginInline: "0.75vw",
            }}
          >
            <p style={{ fontSize: "0.75rem" }}>
              {props.cellType === getSelectedCellType("TASK")
                ? t("task")
                : t(
                    getActivityProps(
                      props.activityType,
                      props.activitySubType
                    )[4]
                  )}
            </p>
            <p style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {props.cellName}
            </p>
          </div>
        </div>
        <div>
          <TrendingFlatIcon
            style={{ cursor: "pointer" }}
            onClick={handleDrawerSize}
          />
          <CloseIcon
            fontSize="small"
            style={{ cursor: "pointer" }}
            onClick={() => closePropertiesModal()}
          />
        </div>
      </div>
      {/*code commented on 26 April 2022 for BugId 107765*/}
      {/* {props.showButtons ? (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: direction === "rtl" ? "row-reverse" : "row",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              style={{
                textTransform: "none",
                padding: "4px",
                fontSize: "13px",
                backgroundColor: "#0072c6",
                borderRadius: "2px",
                boxShadow: "none",
                margin: "0 15px 0 0",
              }}
            >
              {t("associateExisting")}
            </Button>
            <Button
              onClick={() => props.setShowCreateSection(true)}
              variant="outlined"
              style={{
                textTransform: "none",
                padding: "4px",
                fontSize: "13px",
                borderRadius: "2px",
              }}
            >
              {t("createNew")}
            </Button>
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "grey",
              textAlign: direction === "rtl" ? "right" : "left",
            }}
          >
            {props.checkedCount} of {props.activityDetails.length} associated
          </p>
        </div>
      ) : null} */}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    expandDrawer: (flag) => dispatch(actionCreators.expandDrawer(flag)),
    showDrawer: (flag) => dispatch(actionCreators_activity.showDrawer(flag)),
  };
};

const mapStateToProps = (state) => {
  return {
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataFieldsCommonSection);
