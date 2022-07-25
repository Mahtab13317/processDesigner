import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect, useDispatch, useSelector } from "react-redux";
import { Select, MenuItem } from "@material-ui/core";
import Methods from "./methods.js";
import {
  SERVER_URL,
  ENDPOINT_GET_WEBSERVICE,
  propertiesLabel,
} from "../../../../Constants/appConstants";
import { store, useGlobalState } from "state-pool";
import Mapping from "./mapping.js";
import "../Webservice/index.css";
import Modal from "../../../../UI/Modal/Modal.js";
import CatalogScreenModal from "../Webservice/CatalogScreenModal.js";
import { useTranslation } from "react-i18next";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice.js";
import { ActivityPropertySaveCancelValue, setSave } from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";

function Restful(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const [methodsList, setMethodsList] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [associations, setAssociations] = useState([]);
  const [showMapping, setShowMapping] = useState(false);
  const [methodClicked, setMethodClicked] = useState(null);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [showCatelogScreen, setShowCatelogScreen] = useState(false);
  const [associateButtonClicked, setAssociateButtonClicked] = useState(false);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      let isValidObj = validateFunc();
      if (!isValidObj.isValid && isValidObj.type === "FW") {
        dispatch(
          setToastDataFunc({
            message: `${t("PleaseDefineAtleastOneForwardMapping")}`,
            severity: "error",
            open: true,
          })
        );
      }else if (!isValidObj.isValid && isValidObj.type === "RW") {
        dispatch(
          setToastDataFunc({
            message: `${t("PleaseDefineAtleastOneReverseMapping")}`,
            severity: "error",
            open: true,
          })
        );
      }
      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked, saveCancelStatus.CancelClicked]);

  useEffect(() => {
    axios
      .get(SERVER_URL + ENDPOINT_GET_WEBSERVICE + props.openProcessID)
      .then((res) => {
        let tempMethods = [];
        res?.data?.Methods?.RESTMethods.map((method) => {
          tempMethods.push(method);
        });
        setMethodsList(tempMethods);
      });
  }, []);

  useEffect(() => {
    let tempAssoc = [];
    methodsList?.map((method) => {
      localLoadedActivityPropertyData?.ActivityProperty?.restFullInfo?.assocMethodList?.map(
        (el) => {
          if (el.methodIndex == method.MethodIndex) {
            tempAssoc.push({
              method: method.MethodName,
              id: method.MethodIndex,
            });
          }
        }
      );
    });
    setAssociations(tempAssoc);
    let isValidObj = {};
    isValidObj = validateFunc();
    if (isValidObj && !isValidObj.isValid) {
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.Restful]: { isModified: true, hasError: true },
        })
      );
    }
  }, [methodsList, localLoadedActivityPropertyData]);

  const validateFunc = () => {
    let isValid = true;
    let type = null;
    let newAssociateList = localLoadedActivityPropertyData?.ActivityProperty
      ?.restFullInfo?.assocMethodList
      ? [
          ...localLoadedActivityPropertyData.ActivityProperty.restFullInfo
            .assocMethodList,
        ]
      : [];
    newAssociateList?.forEach((el) => {
      if (isValid) {
        if (!el.mappingInfoList) {
          isValid = false;
          type = "FW";
        } else if (el.mappingInfoList) {
          let minForMapping = false;
          let minRevMapping = false;
          el.mappingInfoList?.forEach((ele) => {
            if (ele.mappingType === "F") {
              minForMapping = true;
            }
            if (ele.mappingType === "R") {
              minRevMapping = true;
            }
          });
          if (!minForMapping) {
            isValid = false;
            type = "FW";
          } else if (!minRevMapping) {
            isValid = false;
            type = "RW";
          }
        }
      }
    });
    if (isValid) {
      return {
        isValid: true,
      };
    } else {
      return {
        isValid: false,
        type: type,
      };
    }
  };

  const associateMethod = () => {
    setAssociateButtonClicked(true);
    if (selectedMethod) {
      let combExists = false;
      // Not allowing addition of already existing webservice and method combination
      localLoadedActivityPropertyData?.ActivityProperty?.restFullInfo?.assocMethodList?.forEach(
        (el) => {
          if (el.methodIndex == selectedMethod) {
            combExists = true;
            dispatch(
              setToastDataFunc({
                message: t("CombAlreadyExists"),
                severity: "error",
                open: true,
              })
            );
          }
        }
      );
      if (!combExists) {
        let methodName;
        methodsList?.map((method) => {
          if (method.MethodIndex == selectedMethod) {
            methodName = method.MethodName;
          }
        });
        // Saving Data
        let temp = { ...localLoadedActivityPropertyData };
        if (temp?.ActivityProperty?.restFullInfo?.assocMethodList) {
          temp.ActivityProperty.restFullInfo.assocMethodList.push({
            mappingInfoList: [],
            methodIndex: selectedMethod,
            methodName: methodName,
            timeoutInterval: "10",
          });
        } else {
          temp.ActivityProperty = {
            ...temp.ActivityProperty,
            restFullInfo: {
              assocMethodList: [
                {
                  mappingInfoList: [],
                  methodIndex: selectedMethod,
                  methodName: methodName,
                  timeoutInterval: "10",
                },
              ],
            },
          };
        }

        setlocalLoadedActivityPropertyData(temp);
        // --------------------------
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.Restful]: {
              isModified: true,
              hasError: false,
            },
          })
        );
      }
    }
  };

  const LandOnCatelogHandler = () => {
    setShowCatelogScreen(true);
  };

  const handleAssociationDelete = (row) => {
    let tempVariablesList = [...associations];
    let tempVariablesList_Filtered = tempVariablesList.filter((variable) => {
      return variable.id !== row.id;
    });
    if (tempVariablesList_Filtered?.length === 0) {
      setShowMapping(false);
      setMethodClicked(null);
    }
    // Delete association permanently from get Activity Call
    let temp = { ...localLoadedActivityPropertyData };
    let idx = null;
    temp?.ActivityProperty?.restFullInfo?.assocMethodList?.forEach(
      (el, index) => {
        if (el.methodIndex === row.id) {
          idx = index;
        }
      }
    );
    temp.ActivityProperty.restFullInfo.assocMethodList.splice(idx, 1);
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.Restful]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          borderRight:
            props.isDrawerExpanded && showMapping
              ? "1px solid #CECECE"
              : "none",
        }}
      >
        <div
          style={{
            borderRight: "1px solid #F4F4F4",
            width: props.isDrawerExpanded && showMapping ? "60%" : "100%",
          }}
        >
          <div style={{ padding: "0.5rem 1vw" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
                width: "22vw",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#000000",
                  fontWeight: "700",
                }}
              >
                {t("webService")}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#0072C6",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => LandOnCatelogHandler()}
              >
                {t("GoToCatalog")}
              </p>
            </div>
            <div
              style={{
                display: props.isDrawerExpanded ? "flex" : "block",
                alignItems: props.isDrawerExpanded ? "end" : "normal",
                gap: "1vw",
              }}
            >
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <p
                  style={{ fontSize: "12px", color: "#886F6F", width: "100%" }}
                >
                  {t("method")}
                </p>
                <Select
                  className="select_webService"
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  style={{
                    fontSize: "12px",
                    border:
                      !selectedMethod && associateButtonClicked
                        ? "1px solid red"
                        : "1px solid #CECECE",
                    width: props.isDrawerExpanded ? "22vw" : "100%",
                  }}
                  value={selectedMethod}
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
                    PaperProps: {
                      style: {
                        maxHeight: "10rem",
                      },
                    },
                  }}
                >
                  {methodsList?.map((method) => {
                    return (
                      <MenuItem
                        key={method.MethodIndex}
                        value={method.MethodIndex}
                        style={{
                          fontSize: "12px",
                          padding: "4px",
                        }}
                      >
                        {method.MethodName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: props.isDrawerExpanded ? "start" : "end",
                  flex: 3,
                }}
              >
                <button
                  variant="outlined"
                  className="associateButton_webSProp"
                  onClick={() => associateMethod()}
                >
                  {t("associate")}
                </button>
              </div>
            </div>
          </div>
          {/* ---------------------------- */}
          <div style={{ padding: "0 1vw" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "#000000",
                  fontWeight: "600",
                }}
              >
                {t("AssociatedWebservicesandMethods")}
              </p>
            </div>
          </div>
          <Methods
            methodsList={methodsList}
            showMapping={showMapping}
            setShowMapping={setShowMapping}
            associations={associations}
            setMethodClicked={setMethodClicked}
            isDrawerExpanded={props.isDrawerExpanded}
            handleAssociationDelete={handleAssociationDelete}
          />
        </div>
        {props.isDrawerExpanded && showMapping ? (
          <Mapping
            completeList={methodsList}
            methodClicked={methodClicked}
            combinations={
              localLoadedActivityPropertyData?.ActivityProperty?.restFullInfo
                ?.assocMethodList
            }
          />
        ) : null}
      </div>
      {showCatelogScreen ? (
        <Modal
          show={showCatelogScreen}
          style={{
            top: "10%",
            left: "10%",
            width: "80%",
            zIndex: "1500",
            boxShadow: "0px 3px 6px #00000029",
            padding: "0",
          }}
          modalClosed={() => setShowCatelogScreen(false)}
          children={
            // code edited on 20 June 2022 for BugId 110910
            <CatalogScreenModal closeFunc={() => setShowCatelogScreen(false)} />
          }
        ></Modal>
      ) : null}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
    openProcessID: state.openProcessClick.selectedId,
  };
};

export default connect(mapStateToProps, null)(Restful);
