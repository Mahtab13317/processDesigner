import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import Filter from "../../../../../../assets/Tiles/Filter.svg";
import SearchComponent from "../../../../../../UI/Search Component/index";
import Tab from "../../../../../../UI/Tab/Tab";
import { useTranslation } from "react-i18next";
import "../index.css";
import WebServiceDefinition from "./Definition/Definition";
import ProcessAssociation from "./ProcessAssociation";
import {
  DEFAULT_GLOBAL_ID,
  ENDPOINT_GET_WEBSERVICE,
  GLOBAL_SCOPE,
  LOCAL_SCOPE,
  SERVER_URL,
  WEBSERVICE_SOAP,
  WEBSERVICE_REST,
  STATE_ADDED,
  STATE_EDITED,
  STATE_CREATED,
  ENDPOINT_SAVE_WEBSERVICE,
  DELETE_CONSTANT,
  ADD_CONSTANT,
  MODIFY_CONSTANT,
  RTL_DIRECTION,
  ENDPOINT_PROCESS_ASSOCIATION,
  DEFAULT_GLOBAL_TYPE,
  ENDPOINT_SAVE_REST_WEBSERVICE,
  BASIC_AUTH,
  TOKEN_BASED_AUTH,
  ERROR_MANDATORY,
} from "../../../../../../Constants/appConstants";
import WebserviceList from "./WebserviceList";
import axios from "axios";
import { connect, useDispatch } from "react-redux";
import { setToastDataFunc } from "../../../../../../redux-store/slices/ToastDataHandlerSlice";
import { CircularProgress } from "@material-ui/core";
import { getAuthenticationType } from "../../../../../../utility/ServiceCatalog/Webservice";
import Modal from "../../../../../../UI/Modal/Modal";
import ObjectDependencies from "../../../../../../UI/ObjectDependencyModal";
import { store, useGlobalState } from "state-pool";
import NoWebServiceScreen from "./NoWebServiceScreen";

function Webservice(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const dispatch = useDispatch();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [webServiceList, setWebServiceList] = useState([]);
  const [spinner, setspinner] = useState(true);
  const [selected, setSelected] = useState(null);
  const [processAssociation, setProcessAssociation] = useState(null);
  const [changedSelection, setChangedSelection] = useState(null);
  const [error, setError] = useState({});
  const [showDependencyModal, setShowDependencyModal] = useState(false);
  //code added on 16 June 2022 for BugId 110949
  const [maxSoapCount, setMaxSoapCount] = useState(0);
  const [maxRestCount, setMaxRestCount] = useState(0);
  const subMainTabElements = [
    <WebServiceDefinition
      {...props}
      selected={selected}
      setChangedSelection={setChangedSelection}
      setSelected={setSelected}
      error={error}
    />,
    <ProcessAssociation {...props} processAssociation={processAssociation} />,
  ];
  const subMainTabLabels = [t("definition"), t("ProcessAssociation")];

  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          ENDPOINT_GET_WEBSERVICE +
          `${
            props.scope === GLOBAL_SCOPE
              ? DEFAULT_GLOBAL_ID
              : props.openProcessID
          }`
      )
      .then((res) => {
        if (res.data.Status === 0) {
          setspinner(false);
          let methods = { ...res.data.Methods };
          let totalMethods = [];
          methods?.Webservice?.forEach((val) => {
            totalMethods.push({
              ...val,
              webserviceType: WEBSERVICE_SOAP,
              status: STATE_ADDED,
            });
          });
          methods?.RESTMethods?.forEach((val) => {
            totalMethods.push({
              ...val,
              webserviceType: WEBSERVICE_REST,
              status: STATE_ADDED,
            });
          });
          setWebServiceList(totalMethods);
          //code added on 16 June 2022 for BugId 110949
          setMaxSoapCount(methods.MaxSOAPGlblMethodIndex);
          setMaxRestCount(methods.MaxRestMethodIndex);
          if (totalMethods?.length > 0 && !selected) {
            selectionFunc(totalMethods[0]);
          }
        } else {
          setspinner(false);
          dispatch(
            setToastDataFunc({
              message: `${res.data.Message}`,
              severity: "error",
              open: true,
            })
          );
        }
      });
  }, []);

  const addNewWebservice = () => {
    let temp = [...webServiceList];
    let indexVal;
    //to remove existing temporary webservice from list, before adding new temporary webservice
    temp?.forEach((webS, index) => {
      if (webS.status && webS.status === STATE_CREATED) {
        indexVal = index;
      }
    });
    if (indexVal >= 0) {
      temp.splice(indexVal, 1);
    }
    temp.splice(0, 0, {
      AliasName: t("newWebservice"),
      webserviceType: WEBSERVICE_SOAP,
      status: STATE_CREATED,
    });
    setSelected(temp[0]);
    setWebServiceList(temp);
  };

  const cancelAddWebservice = () => {
    let temp = [...webServiceList];
    temp.splice(0, 1);
    setSelected(temp[0]);
    setWebServiceList(temp);
  };

  const cancelEditWebservice = () => {
    let tempSelected = null;
    webServiceList.forEach((item) => {
      if (+item.MethodIndex === +selected.MethodIndex) {
        tempSelected = {
          ...item,
          webserviceType: selected.webserviceType,
          status: STATE_ADDED,
        };
      }
    });
    setSelected(tempSelected);
  };

  const validateSOAP = () => {
    let hasError = false;

    webServiceList
      ?.filter(
        (el) =>
          el.webserviceType === WEBSERVICE_SOAP && el.status === STATE_ADDED
      )
      ?.forEach((item) => {
        if (item.MethodName === changedSelection.methodName.methodName) {
          if (item.AppName === changedSelection.webServiceName) {
            hasError = true;
          }
        }
      });

    if (hasError) {
      dispatch(
        setToastDataFunc({
          message: `${t("MethodAlreadyRegistered")}`,
          severity: "error",
          open: true,
        })
      );
    }
    return !hasError;
  };

  const validateREST = () => {
    let errorObj = {},
      hasError = false;

    if (
      !changedSelection?.methodName ||
      changedSelection?.methodName?.trim() === ""
    ) {
      errorObj = {
        ...errorObj,
        methodName: {
          statement: t("PleaseEnter") + " " + t("method") + " " + t("name"),
          severity: "error",
          errorType: ERROR_MANDATORY,
        },
      };
      hasError = true;
    }
    if (
      !changedSelection?.baseUri ||
      changedSelection?.baseUri?.trim() === ""
    ) {
      errorObj = {
        ...errorObj,
        baseUri: {
          statement: t("PleaseEnter") + " " + t("BaseURI"),
          severity: "error",
          errorType: ERROR_MANDATORY,
        },
      };
      hasError = true;
    }

    if (hasError) {
      setError({ ...errorObj });
    }
    return !hasError;
  };

  const getSOAPJSON = (statusConstant) => {
    let methodIndex;
    //code added on 16 June 2022 for BugId 110949
    if (selected?.status === STATE_CREATED) {
      if (props.scope === GLOBAL_SCOPE) {
        methodIndex = +maxSoapCount + 1;
      } else {
        methodIndex = +localLoadedProcessData.MaxMethodIndex + 1;
      }
    } else {
      methodIndex = selected.MethodIndex;
    }
    let dataStructureList = changedSelection?.methodName?.dataStructure?.map(
      (ds) => {
        return {
          structName: ds.Name,
          dataStructureId: ds.DataStructureId,
          structType: ds.Type,
          parentIndex: ds.ParentIndex,
          className: ds.ClassName,
          unbounded: ds.Unbounded,
        };
      }
    );
    let paramList = changedSelection?.methodName?.param?.map((pl) => {
      return {
        paramName: pl.ParamName,
        paramType: pl.ParamType,
        paramIndex: pl.ParamIndex,
        unbounded: pl.Unbounded,
        dataStructureId: pl.DataStructureId,
        paramScope: pl.ParamScope,
      };
    });
    return [
      {
        m_strSOAPGlblFlag: props.scope,
        methodName: changedSelection.methodName.methodName,
        methodIndex: methodIndex,
        returnType: changedSelection.methodName.returnType,
        appName: changedSelection.webServiceName,
        appType: changedSelection.methodName.appType,
        wsdlLocation: changedSelection.wsdl_url,
        aliasName: changedSelection.alias,
        selectedDomain: changedSelection.domain,
        wsDescription: changedSelection.description,
        dataStructureList: dataStructureList,
        paramList: paramList,
        status: statusConstant,
      },
    ];
  };

  const getSOAPObject = (json) => {
    return {
      AliasName: changedSelection.alias,
      AppName: changedSelection.webServiceName,
      AppType: changedSelection.methodName.appType,
      DataStructure: changedSelection?.methodName.dataStructure,
      Description: changedSelection.description,
      Domain: changedSelection.domain,
      MethodIndex: json.wsMethodList[0].methodIndex,
      MethodName: changedSelection.methodName.methodName,
      MethodType: props.scope,
      Parameter: changedSelection?.methodName.param,
      ReturnType: changedSelection.methodName.returnType,
      WSDLLocation: changedSelection.wsdl_url,
    };
  };

  const getRESTJSON = (statusConstant) => {
    let methodIndex,
      parametersMap = {},
      reqBodyMap = {},
      resBodyMap = {},
      authDataList = [];
    //code added on 16 June 2022 for BugId 110949
    if (selected?.status === STATE_CREATED) {
      if (props.scope === GLOBAL_SCOPE) {
        methodIndex = +maxRestCount + 1;
      } else {
        methodIndex = +localLoadedProcessData.MaxRestMethodIndex + 1;
      }
    } else {
      methodIndex = selected.MethodIndex;
    }
    changedSelection?.InputParameters?.forEach((el) => {
      parametersMap = {
        ...parametersMap,
        [el.ParamName]: {
          typeName: el.ParamName,
          m_iDataStructureId: el.DataStructureId,
          m_iParentTypeId: el.ParentID,
          sPramScope: el.ParamScope,
          extTypeId: el.ParamType,
          m_sUnbounded: el.Unbounded,
        },
      };
    });

    changedSelection?.ReqBodyParameters?.forEach((el) => {
      let tempMemberMap = {};
      el?.Member?.forEach((mem) => {
        tempMemberMap = {
          ...tempMemberMap,
          [mem.ParamName]: {
            m_iDataStructureId: mem.DataStructureId,
            m_iParentTypeId: mem.ParentID,
            sPramScope: mem.ParamScope,
            objVarDefInfo: {
              varName: mem.ParamName,
              type: mem.ParamType,
              complexTypeId: mem.TypeId,
              unbounded: mem.Unbounded,
            },
          },
        };
      });
      reqBodyMap = {
        ...reqBodyMap,
        [el.ParamName]: {
          typeName: el.ParamName,
          m_iDataStructureId: el.DataStructureId,
          m_iParentTypeId: el.ParentID,
          sPramScope: el.ParamScope,
          extTypeId: el.ParamType,
          m_sUnbounded: el.Unbounded,
          m_sIsNested: el.IsNested,
          memberMap: tempMemberMap,
        },
      };
    });

    changedSelection?.ResBodyParameters?.forEach((el) => {
      let tempMemberMap = {};
      el?.Member?.forEach((mem1) => {
        tempMemberMap = {
          ...tempMemberMap,
          [mem1.ParamName]: {
            m_iDataStructureId: mem1.DataStructureId,
            m_iParentTypeId: mem1.ParentID,
            sPramScope: mem1.ParamScope,
            objVarDefInfo: {
              varName: mem1.ParamName,
              type: mem1.ParamType,
              complexTypeId: mem1.TypeId,
              unbounded: mem1.Unbounded,
            },
          },
        };
      });
      resBodyMap = {
        ...resBodyMap,
        [el.ParamName]: {
          typeName: el.ParamName,
          m_iDataStructureId: el.DataStructureId,
          m_iParentTypeId: el.ParentID,
          sPramScope: el.ParamScope,
          extTypeId: el.ParamType,
          m_sUnbounded: el.Unbounded,
          m_sIsNested: el.IsNested,
          memberMap: tempMemberMap,
        },
      };
    });

    authDataList = changedSelection?.dataList?.map((el) => {
      return {
        m_sParamName: el.ParamName,
        m_sParamScope: el.style,
        m_sParamType: el.mappedType,
        m_sDeffaultVal: el.Value,
      };
    });

    return [
      {
        m_strRESTMethodScope: props.scope,
        m_strBaseUri: changedSelection.baseUri,
        m_sMethodName: changedSelection.methodName,
        m_strResourcePath: changedSelection.resourcePath,
        m_strSelectedOperationType: changedSelection.operationType,
        m_strRequestMediaType: changedSelection.reqMediaType,
        m_strResponseMediaType: changedSelection.resMediaType,
        m_strAuthenticationType: getAuthenticationType(
          changedSelection.authType
        ),
        m_sAuthUserName:
          changedSelection.authType === BASIC_AUTH
            ? changedSelection.username
            : null,
        m_sAuthCred:
          changedSelection.authType === BASIC_AUTH
            ? changedSelection.password
            : null,
        m_strAuthURL:
          changedSelection.authType === TOKEN_BASED_AUTH
            ? changedSelection.authUrl
            : null,
        m_strAuthOperationType:
          changedSelection.authType === TOKEN_BASED_AUTH
            ? changedSelection.authOperation
            : null,
        m_strAuthRequestMediaType:
          changedSelection.authType === TOKEN_BASED_AUTH
            ? changedSelection.reqType
            : null,
        m_strAuthResponseMediaType:
          changedSelection.authType === TOKEN_BASED_AUTH
            ? changedSelection.resType
            : null,
        m_arrAuthDataList:
          changedSelection.authType === TOKEN_BASED_AUTH ? authDataList : null,
        m_iMethodIndex: methodIndex,
        aliasName: changedSelection.alias,
        selectedDomain: changedSelection.domain,
        wsDescription: changedSelection.description,
        m_bBRMSEnabled: changedSelection.brmsEnabled,
        m_strPrxyEnabled: changedSelection.proxyEnabled ? "Y" : "N",
        primitiveNestedMap: parametersMap,
        reqParamNestedMap: reqBodyMap,
        respParamNestedMap: resBodyMap,
        operation: statusConstant,
        //restCreationMode: changedSelection.restCreationMode
      },
    ];
  };

  const getRESTObj = (json) => {
    return {
      AliasName: changedSelection.alias,
      Description: changedSelection.description,
      Domain: changedSelection.domain,
      MethodIndex: json.wsRESTMethodList[0].methodIndex,
      AuthenticationType: getAuthenticationType(changedSelection.authType),
      UserName:
        changedSelection.authType === BASIC_AUTH
          ? changedSelection.username
          : null,
      Password:
        changedSelection.authType === BASIC_AUTH
          ? changedSelection.password
          : null,
      AuthorizationURL:
        changedSelection.authType === TOKEN_BASED_AUTH
          ? changedSelection.authUrl
          : null,
      AuthOperationType:
        changedSelection.authType === TOKEN_BASED_AUTH
          ? changedSelection.authOperation
          : null,
      RequestType:
        changedSelection.authType === TOKEN_BASED_AUTH
          ? changedSelection.reqType
          : null,
      ResponseType:
        changedSelection.authType === TOKEN_BASED_AUTH
          ? changedSelection.resType
          : null,
      ParamMapping:
        changedSelection.authType === TOKEN_BASED_AUTH
          ? changedSelection.dataList
          : null,
      BRMSEnabled: changedSelection.brmsEnabled,
      BaseURI: changedSelection.baseUri,
      InputParameters: {
        PrimitiveComplexType: changedSelection?.InputParameters
          ? [...changedSelection.InputParameters]
          : [],
      },
      MethodName: changedSelection.methodName,
      OperationType: changedSelection.operationType,
      ProxyEnabled: changedSelection.proxyEnabled ? "Y" : "N",
      RequestBodyParameters: {
        NestedReqComplexType: changedSelection?.ReqBodyParameters
          ? [...changedSelection.ReqBodyParameters]
          : [],
      },
      RequestMediaType: changedSelection.reqMediaType,
      ResourcePath: changedSelection.resourcePath,
      ResponseBodyParameters: {
        NestedResComplexType: changedSelection?.ResBodyParameters
          ? [...changedSelection.ResBodyParameters]
          : [],
      },
      ResponseMediaType: changedSelection.resMediaType,
      RestCreationMode: changedSelection.restCreationMode,
      MaxDataStructId: changedSelection.maxDataStructId,
      RestScopeType: props.scope,
    };
  };

  const checkDependencies = () => {
    if (processAssociation?.length === 0) {
      return true;
    } else {
      setShowDependencyModal(true);
      return false;
    }
  };

  const handleWebservice = (statusConstant) => {
    let isValid = null;
    isValid =
      statusConstant === DELETE_CONSTANT
        ? checkDependencies()
        : changedSelection.webserviceType === WEBSERVICE_SOAP
        ? validateSOAP()
        : validateREST();
    if (isValid) {
      let json = {};
      if (changedSelection.webserviceType === WEBSERVICE_SOAP) {
        json = {
          processDefId: `${
            props.scope === GLOBAL_SCOPE
              ? DEFAULT_GLOBAL_ID
              : props.openProcessID
          }`,
          wsMethodList: getSOAPJSON(statusConstant),
        };
      } else {
        json = {
          processDefId: `${
            props.scope === GLOBAL_SCOPE
              ? DEFAULT_GLOBAL_ID
              : props.openProcessID
          }`,
          wsRESTMethodList: getRESTJSON(statusConstant),
        };
      }
      axios
        .post(
          SERVER_URL +
            `${
              changedSelection.webserviceType === WEBSERVICE_SOAP
                ? ENDPOINT_SAVE_WEBSERVICE
                : ENDPOINT_SAVE_REST_WEBSERVICE
            }`,
          json
        )
        .then((res) => {
          if (res.data.Status === 0) {
            let tempWebService = [...webServiceList];
            if (statusConstant === ADD_CONSTANT) {
              let newObj =
                changedSelection.webserviceType === WEBSERVICE_SOAP
                  ? getSOAPObject(json)
                  : getRESTObj(json);
              tempWebService[0] = {
                ...newObj,
                webserviceType: changedSelection.webserviceType,
                status: STATE_ADDED,
              };
              setSelected((prev) => {
                let temp = { ...prev, ...newObj };
                temp.status = STATE_ADDED;
                temp.webserviceType = changedSelection.webserviceType;
                return temp;
              });
              //code added on 16 June 2022 for BugId 110949
              if (changedSelection.webserviceType === WEBSERVICE_SOAP) {
                if (props.scope === GLOBAL_SCOPE) {
                  setMaxSoapCount((prev) => {
                    return prev + 1;
                  });
                } else {
                  let temp = JSON.parse(JSON.stringify(localLoadedProcessData));
                  temp.MaxMethodIndex = temp.MaxMethodIndex + 1;
                  setlocalLoadedProcessData(temp);
                }
              } else {
                if (props.scope === GLOBAL_SCOPE) {
                  setMaxRestCount((prev) => {
                    return prev + 1;
                  });
                } else {
                  let temp = JSON.parse(JSON.stringify(localLoadedProcessData));
                  temp.MaxRestMethodIndex = temp.MaxRestMethodIndex + 1;
                  setlocalLoadedProcessData(temp);
                }
              }
            } else if (statusConstant === DELETE_CONSTANT) {
              webServiceList.forEach((element) => {
                if (element.MethodIndex === selected.MethodIndex) {
                  tempWebService.splice(tempWebService.indexOf(element), 1);
                }
              });
              // code added on 21 June 2022 for BugId 111023
              if (tempWebService?.length > 0) {
                setSelected(tempWebService[0]);
              } else {
                setSelected(null);
              }
            } else if (statusConstant === MODIFY_CONSTANT) {
              let newObj =
                changedSelection.webserviceType === WEBSERVICE_SOAP
                  ? getSOAPObject(json)
                  : getRESTObj(json);
              webServiceList.forEach((element, index) => {
                if (element.MethodIndex === selected.MethodIndex) {
                  tempWebService[index] = {
                    ...newObj,
                    webserviceType: changedSelection.webserviceType,
                    status: STATE_ADDED,
                  };
                }
              });
              setSelected((prev) => {
                let temp = { ...prev, ...newObj };
                temp.status = STATE_ADDED;
                return temp;
              });
            }
            setWebServiceList(tempWebService);
          }
        });
    }
  };

  const selectionFunc = (item) => {
    setSelected(item);
    axios
      .get(
        SERVER_URL +
          ENDPOINT_PROCESS_ASSOCIATION +
          `/${
            props.scope === GLOBAL_SCOPE
              ? DEFAULT_GLOBAL_ID
              : props.openProcessID
          }/${
            props.scope === GLOBAL_SCOPE
              ? DEFAULT_GLOBAL_TYPE
              : props.openProcessType
          }/${item.MethodName}/${item.MethodIndex}/${
            item.webserviceType === WEBSERVICE_SOAP ? "Soap" : "Rest"
          }/D`
      )
      .then((res) => {
        if (res.data.Status === 0) {
          setProcessAssociation(res.data.Validations);
        }
      });
  };

  return (
    <div
      className={styles.mainWrappingDiv}
      style={
        props.scope === LOCAL_SCOPE
          ? props.callLocation === "webServicePropTab"
            ? { ...props.style, height: "68vh" }
            : { ...props.style, height: "84.84vh" }
          : { ...props.style }
      }
    >
      {spinner ? (
        <CircularProgress
          style={
            direction === RTL_DIRECTION
              ? { marginTop: "30vh", marginRight: "50%" }
              : { marginTop: "30vh", marginLeft: "50%" }
          }
        />
      ) : (
        <React.Fragment>
          {webServiceList?.length > 0 ? (
            <React.Fragment>
              <div
                className={styles.mainDiv}
                style={
                  props.scope === LOCAL_SCOPE
                    ? {
                        height: `${
                          props.callLocation === "webServicePropTab"
                            ? "60vh"
                            : "70vh"
                        }`,
                      }
                    : {}
                }
              >
                <div className={styles.listDiv}>
                  <div className={styles.listHeader}>
                    <p
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.listHeading
                          : styles.listHeading
                      }
                    >
                      {t("webService")} {t("List")}
                    </p>
                    <button
                      className={styles.secondaryBtn}
                      onClick={addNewWebservice}
                      id="webS_addNewBtn"
                    >
                      {t("addWithPlusIcon")} {t("New")}
                    </button>
                  </div>
                  <div className={styles.searchHeader}>
                    <SearchComponent width="90%" />
                    <img src={Filter} className={styles.filterIcon} />
                  </div>
                  <WebserviceList
                    list={webServiceList}
                    selected={selected}
                    selectionFunc={selectionFunc}
                    scope={props.scope}
                    callLocation={props.callLocation}
                  />
                </div>
                <div className={styles.formDiv}>
                  <Tab
                    tabType={`${styles.subMainTab} subMainTab_sc`}
                    tabBarStyle={styles.subMainTabBarStyle}
                    oneTabStyle={`${
                      direction === RTL_DIRECTION
                        ? arabicStyles.subMainOneTabStyle
                        : styles.subMainOneTabStyle
                    } subMainOneTabStyle_sc`}
                    tabContentStyle={styles.subMainTabContentStyle}
                    TabNames={subMainTabLabels}
                    TabElement={subMainTabElements}
                  />
                </div>
              </div>
              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.footer
                    : styles.footer
                }
              >
                {selected?.status === STATE_ADDED ? (
                  <button
                    className={`${styles.cancelBtn} ${styles.pd025}`}
                    onClick={() => handleWebservice(DELETE_CONSTANT)}
                    id="webS_deleteBtn"
                  >
                    {t("delete")}
                  </button>
                ) : selected?.status === STATE_EDITED ? (
                  <React.Fragment>
                    <button
                      className={`${styles.cancelBtn} ${styles.pd025}`}
                      onClick={cancelEditWebservice}
                      id="webS_discardBtn"
                    >
                      {t("discard")}
                    </button>
                    <button
                      className={`${styles.primaryBtn} ${styles.pd025}`}
                      onClick={() => handleWebservice(MODIFY_CONSTANT)}
                      id="webS_saveChangeBtn"
                    >
                      {t("saveChanges")}
                    </button>
                  </React.Fragment>
                ) : selected?.status === STATE_CREATED ? (
                  <React.Fragment>
                    <button
                      className={`${styles.cancelBtn} ${styles.pd025}`}
                      onClick={cancelAddWebservice}
                      id="webS_discardAddBtn"
                    >
                      {t("discard")}
                    </button>
                    <button
                      className={`${styles.primaryBtn} ${styles.pd025}`}
                      onClick={() => handleWebservice(ADD_CONSTANT)}
                      id="webS_addBtn"
                    >
                      {t("addWebservice")}
                    </button>
                  </React.Fragment>
                ) : null}
              </div>
            </React.Fragment>
          ) : (
            <NoWebServiceScreen addNewWebservice={addNewWebservice} />
          )}
        </React.Fragment>
      )}
      {showDependencyModal ? (
        <Modal
          show={showDependencyModal}
          style={{
            width: "45vw",
            left: "28%",
            top: "21.5%",
            padding: "0",
          }}
          modalClosed={() => setShowDependencyModal(false)}
          children={
            <ObjectDependencies
              {...props}
              processAssociation={processAssociation}
              cancelFunc={() => setShowDependencyModal(false)}
            />
          }
        />
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps)(Webservice);
