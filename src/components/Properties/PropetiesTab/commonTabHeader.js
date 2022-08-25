import React from "react";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import CloseIcon from "@material-ui/icons/Close";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import * as actionCreators from "../../../redux-store/actions/Properties/showDrawerAction";
import { getActivityProps } from "../../../utility/abstarctView/getActivityProps.js";
import { useDispatch } from "react-redux";
import { setSave } from "../../../redux-store/slices/ActivityPropertySaveCancelClicked";
import { getSelectedCellType } from "../../../utility/abstarctView/getSelectedCellType.js";
import { store, useGlobalState } from "state-pool";

function DataFieldsCommonSection(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}​​​​​​​​`;
  const dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  // Function that handles the size of the drawer.
  const handleDrawerSize = () => {
    props.expandDrawer(!props.isDrawerExpanded);
  };

  const closePropertiesModal = () => {
    dispatch(setSave({ CloseClicked: true }));
    setlocalLoadedActivityPropertyData(undefined);
  };

  return (
    <div
      style={{
        direction: direction,
        padding: "0.5rem 0.5vw 0.75rem",
        // fontSize: "var(--title_text_font_size) !important",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: direction === "rtl" ? "row-reverse" : "row",
          backgroundColor: props.isDrawerExpanded ? "white" : null,
          direction: direction,
          width: "100%",
        }}
      >
        <div className="flex">
          <img
            src={props.selectedActivityIcon}
            style={{
              aspectRatio: "1",
              width: "3.5rem",
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
            <p style={{ fontSize: "var(--base_text_font_size)" }}>
              {props.cellType === getSelectedCellType("TASK")
                ? t("task")
                : t(
                    getActivityProps(
                      props.activityType,
                      props.activitySubType
                    )[4]
                  )}
            </p>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "var(--title_text_font_size)",
              }}
            >
              {props.cellName}
            </p>
          </div>
        </div>
        <div>
          <TrendingFlatIcon
            fontSize="medium"
            style={{
              cursor: "pointer",
              width: "1.5rem",
              height: "1.5rem",
              marginRight: "0.25vw",
            }}
            onClick={handleDrawerSize}
          />
          <CloseIcon
            fontSize="medium"
            style={{ cursor: "pointer", width: "1.5rem", height: "1.5rem" }}
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
    showDrawer: (flag) => dispatch(actionCreators.showDrawer(flag)),
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
