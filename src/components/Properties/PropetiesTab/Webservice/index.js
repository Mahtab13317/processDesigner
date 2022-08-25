// Changes made to solve bug ID 110921
// WebServices: On opening the properties of Webservice it keeps on loading
// Changes made to fix Bug 111083 - webservice -> no validation message for webservice and the fields should have a mandatory mark as given in design
import React, { useEffect, useState } from "react";
import axios from "axios";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";
import { Select, MenuItem, List, CircularProgress } from "@material-ui/core";
import "./index.css";
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
import TabsHeading from "../../../../UI/TabsHeading";

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
  const [associateButtonClicked, setAssociateButtonClicked] = useState(false);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [showCatelogScreen, setShowCatelogScreen] = useState(false);
  const [spinner, setspinner] = useState(true);
  //code added on 22 Aug 2022 for BugId 112019
  const [value, setValue] = useState(0); // Function to handle tab change.

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      // code added on 22 July 2022 for BugId 112019
      let isValidObj = validateFunc();
      if (!isValidObj.isValid && isValidObj.type === "FW") {
        //code added on 22 Aug 2022 for BugId 112019
        setValue(0);
        dispatch(
          setToastDataFunc({
            message: `${t("PleaseDefineAtleastOneForwardMapping")}`,
            severity: "error",
            open: true,
          })
        );
      } else if (!isValidObj.isValid && isValidObj.type === "RW") {
        //code added on 22 Aug 2022 for BugId 112019
        setValue(1);
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
    if (localLoadedActivityPropertyData?.Status === 0) {
      setspinner(false);
    }
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
      // Changes made to solve bug ID 110921
      localLoadedActivityPropertyData?.ActivityProperty?.webserviceInfo?.objWebServiceDataInfo?.map(
        (el) => {
          if (
            el.methodName == selectedMethod &&
            el.webserviceName == selectedWebService
          ) {
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
        //code edited on 20 June 2022 for BugId 111107
        let methodIndex;
        webServicesList?.map((method) => {
          if (method.AppName == selectedWebService) {
            methodIndex = method.MethodIndex;
          }
        });
        // Saving Data
        let temp = { ...localLoadedActivityPropertyData };
        if (temp?.ActivityProperty?.webserviceInfo) {
          if (temp.ActivityProperty.webserviceInfo?.objWebServiceDataInfo) {
            temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo.push({
              asynchActId: "0",
              fwdParamMapList: [],
              invocationType: "F",
              methodIndex: methodIndex,
              methodName: selectedMethod,
              proxyEnabled: "F",
              revParamMapList: [],
              timeoutInterval: "10",
              webserviceName: selectedWebService,
            });
          } else {
            temp.ActivityProperty.webserviceInfo = {
              ...temp.ActivityProperty.webserviceInfo,
              objWebServiceDataInfo: [
                {
                  asynchActId: "0",
                  fwdParamMapList: [],
                  invocationType: "F",
                  methodIndex: methodIndex,
                  methodName: selectedMethod,
                  proxyEnabled: "F",
                  revParamMapList: [],
                  timeoutInterval: "10",
                  webserviceName: selectedWebService,
                },
              ],
            };
          }
        } else {
          temp.ActivityProperty = {
            ...temp.ActivityProperty,
            webserviceInfo: {
              objWebServiceDataInfo: [
                {
                  asynchActId: "0",
                  fwdParamMapList: [],
                  invocationType: "F",
                  methodIndex: methodIndex,
                  methodName: selectedMethod,
                  proxyEnabled: "F",
                  revParamMapList: [],
                  timeoutInterval: "10",
                  webserviceName: selectedWebService,
                },
              ],
            },
          };
        }
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
  };

  const validateFunc = () => {
    let isValid = true;
    let type = null;
    let newAssociateList = localLoadedActivityPropertyData?.ActivityProperty
      ?.webserviceInfo?.objWebServiceDataInfo
      ? [
          ...localLoadedActivityPropertyData.ActivityProperty.webserviceInfo
            .objWebServiceDataInfo,
        ]
      : [];
    newAssociateList?.forEach((el) => {
      if (isValid) {
        if (!el.fwdParamMapList) {
          isValid = false;
          type = "FW";
        } else if (el.fwdParamMapList) {
          let minMapping = false;
          el.fwdParamMapList?.forEach((ele) => {
            if (ele.mapField) {
              minMapping = true;
            }
          });
          if (!minMapping) {
            isValid = false;
            type = "FW";
          }
        }
        //code edited on 22 Aug 2022 for BugId 112019
        if (el.invocationType !== "F" && isValid && !el.revParamMapList) {
          isValid = false;
          type = "RW";
        } else if (el.invocationType !== "F" && isValid && el.revParamMapList) {
          let minMapping = false;
          el.revParamMapList?.forEach((ele) => {
            if (ele.mapField) {
              minMapping = true;
            }
          });
          if (!minMapping) {
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
      setServiceNameClicked(null);
    }
    setAssociations(tempVariablesList_Filtered);
    // Delete association permanently from get Activity Call
    let temp = { ...localLoadedActivityPropertyData };
    let idx = null;
    temp?.ActivityProperty?.webserviceInfo?.objWebServiceDataInfo?.forEach(
      (el, index) => {
        if (el.methodIndex === row.id) {
          idx = index;
        }
      }
    );
    temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo.splice(idx, 1);
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.webService]: { isModified: true, hasError: false },
      })
    );
  };

  /*code changes on 21 June 2022 for BugId 110907 */
  return (
    <div>
       
       <TabsHeading heading={props?.heading} />
      {/*code edited on 22 July 2022 for BugId 111320 */}
      {spinner ? (
        <CircularProgress style={{ marginTop: "30vh", marginLeft: "40%" }} />
      ) : (
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
                    fontSize: "var(--subtitle_text_font_size)",
                    color: "#000000",
                    fontWeight: "700",
                  }}
                >
                 {/*  {t("webService")} */}
                </p>
                <p
                  style={{
                    fontSize: "var(--base_text_font_size)",
                    color: "var(--link_color)",
                    fontWeight: "600",
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
                  gap: "1vw",
                }}
              >
                <div
                  style={{
                    marginBottom: "1rem",
                    flex: 1,
                  }}
                >
                  <p
                    style={{
                      fontSize: "var(--base_text_font_size)",
                      color: "#886F6F",
                      width: "100%",
                    }}
                  >
                    {t("webService")}
                    <span className="starIcon">*</span>
                  </p>
                  <Select
                    className="select_webService"
                    onChange={(e) => setSelectedWebService(e.target.value)}
                    style={{
                      fontSize: "var(--base_text_font_size)",
                      width: props.isDrawerExpanded ? "22vw" : "100%",
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
                            fontSize: "var(--base_text_font_size)",
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
                    style={{
                      fontSize: "var(--base_text_font_size)",
                      color: "#886F6F",
                      width: "100%",
                    }}
                  >
                    {t("method")}
                    <span className="starIcon">*</span>
                  </p>
                  <Select
                    className="select_webService"
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    style={{
                      fontSize: "var(--base_text_font_size)",
                      border:
                        !selectedMethod && associateButtonClicked
                          ? "1px solid red"
                          : "1px solid #CECECE",
                      width: props.isDrawerExpanded ? "22vw" : "100%",
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
                              fontSize: "var(--base_text_font_size)",
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
                    marginBottom: "0.75rem",
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
                    fontSize: "1.05rem",
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
              setAssociations={setAssociations}
              isDrawerExpanded={props.isDrawerExpanded}
              setServiceNameClicked={setServiceNameClicked}
              handleAssociationDelete={handleAssociationDelete}
            />
            {/* ----------------------------------- */}
          </div>
          {props.isDrawerExpanded && showMapping ? (
            <Mapping
              serviceNameClicked={serviceNameClicked}
              combinations={
                localLoadedActivityPropertyData?.ActivityProperty
                  ?.webserviceInfo?.objWebServiceDataInfo
              }
              completeList={webServicesList}
              value={value}
              setValue={setValue}
            />
          ) : null}
        </div>
      )}
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
