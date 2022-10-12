import React, { useEffect, useState } from "react";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import CloseIcon from "@material-ui/icons/Close";
import { useTranslation } from "react-i18next";
import { ClickAwayListener } from "@material-ui/core";
import { connect } from "react-redux";
import * as actionCreators from "../../../redux-store/actions/Properties/showDrawerAction";
import { getActivityProps } from "../../../utility/abstarctView/getActivityProps.js";
import { useDispatch } from "react-redux";
import { setSave } from "../../../redux-store/slices/ActivityPropertySaveCancelClicked";
import { getSelectedCellType } from "../../../utility/abstarctView/getSelectedCellType.js";
import { store, useGlobalState } from "state-pool";
import { listOfImages } from "../../../utility/iconLibrary";
import { setActivityPropertyChange } from "../../../redux-store/slices/ActivityPropertyChangeSlice";
import { propertiesLabel } from "../../../Constants/appConstants";

function DataFieldsCommonSection(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}​​​​​​​​`;
  const dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData"); //current processdata clicked
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [showIconLibrary, setShowIconLibrary] = useState(false);
  const [isDefaultIcon, setIsDefaultIcon] = useState(true);

  useEffect(() => {
    let isDefault = true;
    let tempJson = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    if (
      tempJson?.ActivityProperty?.imageName &&
      tempJson?.ActivityProperty?.ImageName?.trim() !== ""
    ) {
      isDefault = false;
    }
    setIsDefaultIcon(isDefault);
  }, [localLoadedActivityPropertyData]);

  // Function that handles the size of the drawer.
  const handleDrawerSize = () => {
    props.expandDrawer(!props.isDrawerExpanded);
  };

  const closePropertiesModal = () => {
    dispatch(setSave({ CloseClicked: true }));
    // code commented on 9 Sep 2022 for BugId 115488
    // setlocalLoadedActivityPropertyData(null);
  };

  const changeActIcon = (newIconName) => {
    setIsDefaultIcon(false);
    let tempLocal = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    if (tempLocal.ActivityProperty.imageName) {
      tempLocal.ActivityProperty.imageName = newIconName;
    } else {
      tempLocal.ActivityProperty = {
        ...tempLocal.ActivityProperty,
        imageName: newIconName,
      };
    }
    setlocalLoadedActivityPropertyData(tempLocal);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: { isModified: true, hasError: false },
      })
    );
  };

  const resetIcon = () => {
    setIsDefaultIcon(true);
    setShowIconLibrary(false);
    let tempLocal = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    tempLocal.ActivityProperty.imageName = "";
    setlocalLoadedActivityPropertyData(tempLocal);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: { isModified: true, hasError: false },
      })
    );
  };

  const getActivityIcon = () => {
    let iconName = null;
    let tempJson = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    iconName = tempJson?.ActivityProperty?.imageName;
    let iconImage;
    listOfImages?.names?.forEach((el, index) => {
      if (el === iconName) {
        iconImage = listOfImages?.images[index];
      }
    });
    return iconImage?.default;
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
          width: "100%",
          position: "relative",
        }}
      >
        <div className="flex">
          <img
            src={isDefaultIcon ? props.selectedActivityIcon : getActivityIcon()}
            style={{
              aspectRatio: "1",
              width: "3.5rem",
              cursor: "pointer",
            }}
            onClick={() => setShowIconLibrary(true)}
            alt=""
          />
          {showIconLibrary && (
            <ClickAwayListener onClickAway={() => setShowIconLibrary(false)}>
              <div
                style={{
                  position: "absolute",
                  boxShadow: "0px 3px 6px #00000029",
                  border: "1px solid #F0F0F0",
                  borderRadius: "1px",
                  zIndex: "1000",
                  width: "24vw",
                  background: "white",
                  top: "100%",
                  padding: "0.25rem 0.25vw 1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      textAlign: "left",
                      font: "normal normal 600 11px/24px var(--font_family)",
                      letterSpacing: "0px",
                      color: "#606060",
                      padding: "0px 0.5vw 0.75rem",
                    }}
                  >
                    {t("SelectIcon")}
                  </p>
                  <CloseIcon
                    style={{
                      cursor: "pointer",
                      width: "1rem",
                      height: "1rem",
                      margin: "0 0.5vw 0.75rem 0",
                    }}
                    onClick={() => setShowIconLibrary(false)}
                  />
                </div>
                {!isDefaultIcon && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "0 1vw 1rem",
                    }}
                  >
                    <div style={{ flex: "1" }}>
                      <img
                        src={getActivityIcon()}
                        style={{
                          aspectRatio: "1",
                          width: "3rem",
                          background: "#0072C633 0% 0% no-repeat padding-box",
                          padding: "0.25rem",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "var(--sub_text_font_size)",
                          textAlign: "left",
                          lineHeight: "11px",
                          display: "block",
                          fontWeight: "600",
                        }}
                      >
                        {t("selectedPascalCase")}
                      </span>
                    </div>
                    <div
                      style={{
                        flex: "1",
                        textAlign: "right",
                        font: "normal normal 600 var(--base_text_font_size)/24px var(--font_family)",
                        letterSpacing: "0px",
                        color: "var(--button_color)",
                        cursor: "pointer",
                      }}
                      onClick={() => resetIcon()}
                    >
                      {t("ResetToDefault")}
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    width: "23.5vw",
                    gap: "0.75rem 0.25vw",
                    alignItems: "start",
                    height: "22rem",
                    overflowY: "auto",
                  }}
                >
                  {listOfImages?.images?.map((el, index) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "4.25vw",
                          cursor: "pointer",
                        }}
                        key={index}
                        onClick={() => {
                          changeActIcon(listOfImages?.names[index]);
                          setShowIconLibrary(false);
                        }}
                      >
                        <img
                          src={el.default}
                          style={{
                            aspectRatio: "1",
                            width: "2rem",
                            background: "#E6E6E6 0% 0% no-repeat padding-box",
                            padding: "0.125rem",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "var(--sub_text_font_size)",
                            textAlign: "center",
                            lineHeight: "11px",
                          }}
                        >
                          {listOfImages?.names[index]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ClickAwayListener>
          )}
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
              {/*code updated on 10 October 2022 for BugId 116880 */}
            <p
              style={{
                fontWeight: "bold",
                fontSize: "var(--title_text_font_size)",
                wordBreak:"break-all"
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
    cellID: state.selectedCellReducer.selectedId,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataFieldsCommonSection);
