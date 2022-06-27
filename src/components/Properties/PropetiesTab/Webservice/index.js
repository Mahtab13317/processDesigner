import React, { useEffect, useState } from "react";
import axios from "axios";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";
import { Select, MenuItem, List } from "@material-ui/core";
import "./index.css";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import ServiceAndMethods from "./webservice&Methods.js";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked";
import Modal from "../../../../UI/Modal/Modal.js";
import { propertiesLabel } from "../../../../Constants/appConstants";
import {
  SERVER_URL,
  ENDPOINT_GET_WEBSERVICE,
} from "../../../../Constants/appConstants";
import Mapping from "./mapping.js";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import { useTranslation } from "react-i18next";
import CatalogScreenModal from "./CatalogScreenModal";

function Webservice(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [webServicesList, setWebServicesList] = useState([]);
  const [serviceNameClicked, setServiceNameClicked] = useState(null);
  const [methodsList, setMethodsList] = useState([]);
  const [selectedWebService, setSelectedWebService] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [associations, setAssociations] = useState([]);
  const [showMapping, setShowMapping] = useState(false);
  const [combinationExists, setCombinationExists] = useState(false);
  const [associateButtonClicked, setAssociateButtonClicked] = useState(false);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [showCatelogScreen, setShowCatelogScreen] = useState(false);
  const [commonError, setCommonError] = useState(null);

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      let isValidObj = validateFunc();
      if (!isValidObj.isValid) {
        dispatch(
          setToastDataFunc({
            message: `${t("PleaseDefineAtleastOneForwardMapping")}`,
            severity: "error",
            open: true,
          })
        );
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.webService]: { isModified: true, hasError: true },
          })
        );
      }
      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked, saveCancelStatus.CancelClicked]);

  useEffect(() => {
    let temp = [];
    localLoadedActivityPropertyData?.ActivityProperty?.webserviceInfo?.objWebServiceDataInfo?.map(
      (info) => {
        temp.push({
          method: info.methodName,
          webservice: info.webserviceName,
          id: info.methodIndex,
        });
      }
    );
    setAssociations(temp);
    let isValidObj = {};
    isValidObj = validateFunc();
    if (isValidObj && !isValidObj.isValid) {
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.webService]: { isModified: true, hasError: true },
        })
      );
    }
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    axios
      .get(SERVER_URL + ENDPOINT_GET_WEBSERVICE + props.openProcessID)
      .then((res) => {
        let tempServices = [];
        res?.data?.Methods?.Webservice?.map((service) => {
          tempServices.push(service);
        });
        setWebServicesList(tempServices);
      });
  }, []);

  useEffect(() => {
    let temp = [];
    webServicesList.map((method) => {
      if (method.AppName == selectedWebService) {
        temp.push(method);
      }
    });
    setMethodsList(temp);
  }, [selectedWebService]);

  const associateServiceNMethod = () => {
    setAssociateButtonClicked(true);
    if (selectedWebService && selectedMethod) {
      // -------------------------------
      let combExists = false;
      // Not allowing addition of already existing webservice and method combination
      localLoadedActivityPropertyData.ActivityProperty.webserviceInfo.objWebServiceDataInfo.map(
        (el) => {
          if (
            el.methodName == selectedMethod &&
            el.webserviceName == selectedWebService
          ) {
            setCombinationExists(true);
            combExists = true;
            alert("This combination already exists!");
          }
        }
      );

      if (!combExists) {
        //code edited on 20 June 2022 for BugId 111107
        let methodIndex;
        webServicesList?.map((method) => {
          if (method.AppName == selectedWebService) {
            methodIndex = method.MethodIndex;
          }
        });
        // Saving Data
        let temp = { ...localLoadedActivityPropertyData };
        temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo.push({
          asynchActId: "0",
          fwdParamMapList: [],
          invocationType: "S",
          methodIndex: methodIndex,
          methodName: selectedMethod,
          proxyEnabled: "F",
          revParamMapList: [],
          timeoutInterval: "10",
          webserviceName: selectedWebService,
        });
        setlocalLoadedActivityPropertyData(temp);
        // --------------------------
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.webService]: {
              isModified: true,
              hasError: false,
            },
          })
        );
      }
    }
    // -------------------------------
  };

  const validateFunc = () => {
    let isValid = true;
    let invalidTemplate = null;
    let type = null;
    let newAssociateList = localLoadedActivityPropertyData?.ActivityProperty
      ?.webserviceInfo?.objWebServiceDataInfo
      ? [
          ...localLoadedActivityPropertyData.ActivityProperty.webserviceInfo
            .objWebServiceDataInfo,
        ]
      : [];
    newAssociateList?.forEach((el) => {
      if (el.invocationType != "F" && isValid) {
        if (!el.fwdParamMapList) {
          isValid = false;
          invalidTemplate = el;
          type = "FW";
        } else if (el.fwdParamMapList) {
          let minMapping = false;
          el.fwdParamMapList.forEach((ele) => {
            if (ele.mapField) {
              minMapping = true;
            }
          });
          if (!minMapping) {
            isValid = false;
            invalidTemplate = el;
            type = "FW";
          }
        }
        if (isValid && !el.revParamMapList) {
          isValid = false;
          invalidTemplate = el;
          type = "RW";
        } else {
          let minMapping = false;
          el.revParamMapList.forEach((ele) => {
            if (ele.mapField) {
              minMapping = true;
            }
          });
          if (!minMapping) {
            isValid = false;
            invalidTemplate = el;
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
        templateName: invalidTemplate.productName,
        templateVersion: invalidTemplate.version,
        type: type,
      };
    }
  };

  const LandOnCatelogHandler = () => {
    setShowCatelogScreen(true);
  };

  {/*code changes on 21 June 2022 for BugId 110907 */}
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
                  fontWeight: "700",
                  cursor: "pointer",
                }}
                onClick={() => LandOnCatelogHandler()}
              >
                {/*code edited on 21 June 2022 for BugId 110908*/}
                {t("GoToCatalog")}
              </p>
            </div>
            <div
              style={{
                display: props.isDrawerExpanded ? "flex" : "block",
                alignItems: props.isDrawerExpanded ? "end" : "normal",
              }}
            >
              <div
                style={{
                  marginBottom: "1rem",
                  flex: 1,
                }}
              >
                <p
                  style={{ fontSize: "12px", color: "#886F6F", width: "100%" }}
                >
                  {t("webService")}
                </p>
                <Select
                  className="select_webService"
                  onChange={(e) => setSelectedWebService(e.target.value)}
                  style={{
                    fontSize: "12px",
                    width: props.isDrawerExpanded ? "90%" : "100%",
                  }}
                  value={selectedWebService}
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
                  {webServicesList?.map((list) => {
                    return (
                      <MenuItem
                        key={list.AppName}
                        value={list.AppName}
                        style={{
                          fontSize: "12px",
                          padding: "4px",
                        }}
                      >
                        {list.AppName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
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
                    width: props.isDrawerExpanded ? "90%" : "100%",
                  }}
                  value={selectedMethod}
                  disabled={selectedWebService ? false : true}
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
                  {methodsList &&
                    methodsList.map((method) => {
                      return (
                        <MenuItem
                          key={method.MethodName}
                          value={method.MethodName}
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
                {!selectedMethod && associateButtonClicked ? (
                  <span style={{ fontSize: "11px", color: "red" }}>
                    Please select method
                  </span>
                ) : null}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: props.isDrawerExpanded ? "start" : "end",
                  flex: 2,
                }}
              >
                <button
                  variant="outlined"
                  className="associateButton_webSProp"
                  onClick={() => associateServiceNMethod()}
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
          <ServiceAndMethods
            showMapping={showMapping}
            setShowMapping={setShowMapping}
            associations={associations}
            isDrawerExpanded={props.isDrawerExpanded}
            setServiceNameClicked={setServiceNameClicked}
          />
          {/* ----------------------------------- */}
        </div>
        {props.isDrawerExpanded && showMapping ? (
          <Mapping
            serviceNameClicked={serviceNameClicked}
            combinations={
              localLoadedActivityPropertyData?.ActivityProperty?.webserviceInfo
                ?.objWebServiceDataInfo
            }
            completeList={webServicesList}
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
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
    openProcessID: state.openProcessClick.selectedId,
  };
};

export default connect(mapStateToProps, null)(Webservice);
