import React, { useEffect, useState } from "react";
import axios from "axios";
import { store, useGlobalState } from "state-pool";
import CommonHeader from "../../PropetiesTab/commonTabHeader";
import { connect } from "react-redux";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
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
  ENDPOINT_GET_EXTERNAL_METHODS,
} from "../../../../Constants/appConstants";
import Mapping from "./mapping.js";
import { hasIn, reverse } from "lodash";
import { FlashAutoOutlined, WbSunnyOutlined } from "@material-ui/icons";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import { useTranslation } from "react-i18next";
import CatelogScreen from "../../../../components/ServiceCatalog/index.js";

function Webservice(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [
    localLoadedActivityPropertyData,
    setlocalLoadedActivityPropertyData,
    updatelocalLoadedActivityPropertyData,
  ] = useGlobalState(loadedActivityPropertyData);
  const [selectedActivityIcon, setSelectedActivityIcon] = useState();
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
    console.log('TIMES');
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
    let activityProps = getActivityProps(
      props.cellActivityType,
      props.cellActivitySubType
    );
    setSelectedActivityIcon(activityProps[0]);
  }, [props.cellActivityType, props.cellActivitySubType, props.cellID]);

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
        let maxId = 0;
        let tempOne = [...associations];
        tempOne.forEach((t) => {
          if (+t.id > +maxId) {
            maxId = +t.id;
          }
        });

        // tempOne.push({
        //   method: selectedMethod,
        //   webservice: selectedWebService,
        //   id: maxId + 1,
        // });

        // Saving Data
        let temp = { ...localLoadedActivityPropertyData };
        temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo.push({
          asynchActId: "0",
          fwdParamMapList: [],
          invocationType: "S",
          methodIndex: maxId + 1,
          methodName: selectedMethod,
          proxyEnabled: "F",
          revParamMapList: [],
          timeoutInterval: "10",
          webserviceName: selectedWebService,
        });
        setlocalLoadedActivityPropertyData(temp);
        // --------------------------

        // setAssociations(tempOne);
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          // width: props.isDrawerExpanded && showMapping ? "60%" : "100%",
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
          <div style={{ padding: "5px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#000000",
                  fontWeight: "700",
                }}
              >
                Webservice
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
                Go To Catelog
              </p>
            </div>
            <div
              style={{
                display: props.isDrawerExpanded ? "flex" : "block",
                // alignItems: props.isDrawerExpanded ? "center" : "normal",
              }}
            >
              <div
                style={{
                  marginBottom: "15px",
                  marginRight: props.isDrawerExpanded ? "20px" : "0px",
                }}
              >
                <p style={{ fontSize: "12px", color: "#886F6F" }}>Webservice</p>
                <Select
                  className="select_webService"
                  onChange={(e) => setSelectedWebService(e.target.value)}
                  style={{
                    fontSize: "12px",
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
                  // inputProps={{
                  //   readOnly: selectedWebService == null,
                  // }}
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
                  marginBottom: "15px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p style={{ fontSize: "12px", color: "#886F6F" }}>Method</p>
                <Select
                  className="select_webService"
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  style={{
                    fontSize: "12px",
                    border:
                      !selectedMethod && associateButtonClicked
                        ? "1px solid red"
                        : "1px solid #CECECE",
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
              <Button
                variant="outlined"
                style={{
                  position: "absolute",
                  right: props.isDrawerExpanded ? "45%" : "10px",
                  top: props.isDrawerExpanded ? "24%" : "auto",
                }}
                className="associateButton_webService"
                onClick={() => associateServiceNMethod()}
              >
                Associate
              </Button>
            </div>
          </div>
          {/* ---------------------------- */}
          <div style={{ padding: "5px", marginTop: "35px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: "#000000",
                  fontWeight: "700",
                }}
              >
                Associated Webservices and Methods
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
            top: "-20%",
            left: "10%",
            width: "83.2%",
            position: "absolute",
            zIndex: "1500",
            boxShadow: "0px 3px 6px #00000029",
            border: "1px solid #D6D6D6",
            borderRadius: "3px",
            height: props.isDrawerExpanded ? "600px" : "81vh",
          }}
          modalClosed={() => setShowCatelogScreen(false)}
          children={
            <CatelogScreen
              setShowCatelogScreen={setShowCatelogScreen}
              callLocation="webServiceSOAPActivity"
            />
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
