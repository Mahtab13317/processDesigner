// Changes made to solve Bug 111948 - OMS Adapter -> should have validation if connection is not establishing
import React, { useState, useEffect } from "react";
import "../../Properties.css";
import { useTranslation } from "react-i18next";
import { connect, useDispatch, useSelector } from "react-redux";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import { store, useGlobalState } from "state-pool";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import axios from "axios";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import MultiSelectWithSearchInput from "../../../../UI/MultiSelectWithSearchInput/index.js";
import {
  ENDPOINT_CONNECT_CABINET,
  ENDPOINT_DISCONNECT_CABINET,
  ENDPOINT_DOWNLOAD_ASSOCIATED_TEMPLATE,
  ENDPOINT_GET_CABINET,
  ENDPOINT_GET_CABINET_TEMPLATE,
  ENDPOINT_MAP_TEMPLATE,
  ERROR_MANDATORY,
  ERROR_RANGE,
  propertiesLabel,
  RTL_DIRECTION,
  SERVER_URL,
  SYNCHRONOUS,
} from "../../../../Constants/appConstants.js";
import { MenuItem, Select } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import CloseIcon from "@material-ui/icons/Close";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import TextInput from "../../../../UI/Components_With_ErrrorHandling/InputField/index.js";
import MappingModal from "./MappingModal/index.js";
import Modal from "../../../../UI/Modal/Modal.js";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked";
import emptyStatePic from "../../../../assets/ProcessView/EmptyState.svg";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import "./index.css";
import TemplatePropertiesScreen from "./TemplateProperties.js";
import PropertiesModal from "./PropertiesModal.js";
import TabsHeading from "../../../../UI/TabsHeading";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";
import { useRef } from "react";
import { FieldValidations } from "../../../../utility/FieldValidations/fieldValidations";

function TemplateProperties(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const dispatch = useDispatch();
  const localActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(localActivityPropertyData);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [spinner, setspinner] = useState(true);
  const [hideConnectBtn, setHideConnectBtn] = useState(true);
  const [connected, setConnected] = useState(false);
  const [connectData, setConnectData] = useState({
    protocolType: "http",
  });
  const [category, setCategory] = useState(null);
  const [cabinetList, setCabinetList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [associatedList, setAssociatedList] = useState([]);
  const [associatedTemplateList, setAssociatedTemplateList] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showMappingModal, setShowMappingModal] = useState(null);
  const [schemaList, setSchemaList] = useState([]);
  const [error, setError] = useState({});
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut);
  const ipRef = useRef();
  const portRef=useRef();

  const TemplateTooltip = withStyles(() => ({
    tooltip: {
      background: "#FFFFFF 0% 0% no-repeat padding-box",
      boxShadow: "0px 3px 6px #00000029",
      border: "1px solid #70707075",
      font: "normal normal normal 12px/17px Open Sans",
      letterSpacing: "0px",
      color: "#000000",
      zIndex: "100",
      transform: "translate3d(0px, -0.125rem, 0px) !important",
    },
    arrow: {
      "&:before": {
        backgroundColor: "#FFFFFF !important",
        border: "1px solid #70707075 !important",
        zIndex: "100",
      },
    },
  }))(Tooltip);

  useEffect(() => {
    setConnected(false);
    if (saveCancelStatus.SaveClicked) {
      let isValidObj = validateFunc();
      if (!isValidObj.isValid) {
        dispatch(
          setToastDataFunc({
            message: `${t("PleaseDefineAtleastOneForwardMapping")} : ${
              isValidObj.templateName
            } [${t("Version")}:${(+isValidObj.templateVersion).toFixed(1)}]`,
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
    if (localLoadedActivityPropertyData?.ActivityProperty?.ccmTemplateInfo) {
      let tempInfo =
        localLoadedActivityPropertyData.ActivityProperty.ccmTemplateInfo;
      setConnectData({
        ...connectData,
        ipAddress: tempInfo.appServerIP,
        protocolType:
          tempInfo.appServerPort.trim() !== ""
            ? tempInfo.appServerType
            : "http",
        portId:
          tempInfo.appServerPort.trim() !== "" ? +tempInfo.appServerPort : "",
        cabinet: tempInfo.cabinetName,
        username: tempInfo.userName,
      });
      let assocTempList = [];
      tempInfo.associatedList?.forEach((el) => {
        assocTempList.push({
          CategoryName: el.categoryName,
          CommunicationGroupName: el.commGroupName,
          Description: el.description,
          ParameterMatch: "",
          ProductName: el.productName,
          ReportName: el.reportName,
          ReportVersions: el.version,
          Timeout: el.timeOutInterval,
          DocType: el.reverseDocName,
          FwdVarMapping: el.arrFwdVarMapping,
        });
      });
      setAssociatedTemplateList(assocTempList);
    }
    let isValidObj = {};
    isValidObj = validateFunc();
    if (isValidObj && !isValidObj.isValid) {
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.templates]: { isModified: true, hasError: true },
        })
      );
    }
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    let tempList = [];
    associatedTemplateList?.forEach((el) => {
      tempList.push(el.ProductName);
    });
    setAssociatedList(tempList);
  }, [associatedTemplateList]);

  const validateFunc = () => {
    let isValid = true;
    let invalidTemplate = null;
    let newAssList = localLoadedActivityPropertyData?.ActivityProperty
      ?.ccmTemplateInfo?.associatedList
      ? [
          ...localLoadedActivityPropertyData.ActivityProperty.ccmTemplateInfo
            .associatedList,
        ]
      : [];
    newAssList?.forEach((el) => {
      if (!el.arrFwdVarMapping) {
        isValid = false;
        invalidTemplate = el;
      } else {
        let minMapping = false;
        el.arrFwdVarMapping.forEach((ele) => {
          if (ele.mappedName) {
            minMapping = true;
          }
        });
        if (!minMapping) {
          isValid = false;
          invalidTemplate = el;
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
      };
    }
  };

  const onChange = (e) => {
    setConnectData({ ...connectData, [e.target.name]: e.target.value });
  };

  const getCabinetFunc = () => {
    let mandatoryFieldsFilled = true;
    let errorObj = {};
    if (
      !connectData.ipAddress ||
      connectData.ipAddress === null ||
      connectData.ipAddress?.trim() === ""
    ) {
      mandatoryFieldsFilled = false;
      errorObj = {
        ...errorObj,
        ipAddress: {
          statement: t("PleaseEnter") + " " + t("IpAddress"),
          severity: "error",
          errorType: ERROR_MANDATORY,
        },
      };
    }
    if (
      connectData.portId &&
      (connectData.portId < 0 || connectData.portId > 65535)
    ) {
      errorObj = {
        ...errorObj,
        portId: {
          statement: t("PleaseEnter") + " " + t("ValidPortNumber"),
          severity: "error",
          errorType: ERROR_RANGE,
        },
      };
    }
    if (mandatoryFieldsFilled) {
      let json = {
        appServerIP: connectData.ipAddress,
        appServerPort: connectData.portId,
        appServerType: connectData.protocolType,
      };
      axios.post(SERVER_URL + ENDPOINT_GET_CABINET, json).then((res) => {
        if (res.data.Status === 0) {
          setError({});
          let tempList = [...res.data.Cabinets];
          setCabinetList(tempList);
          if (tempList?.length > 0 && !connectData.cabinetName) {
            setConnectData({
              ...connectData,
              cabinet: tempList[0].CabinetName,
            });
          }
          setHideConnectBtn(false);
        } else {
          dispatch(
            setToastDataFunc({
              message: `${t("UnabletoFetchCabinetList")}`,
              severity: "error",
              open: true,
            })
          );
        }
      });
    } else {
      setError({ ...error, ...errorObj });
    }
  };

  const connectFunc = () => {
    let mandatoryFieldsFilled = true;
    let errorObj = {};
    if (!connectData.username || connectData.username === "") {
      mandatoryFieldsFilled = false;
      errorObj = {
        ...errorObj,
        username: {
          statement: t("PleaseEnter") + " " + t("Username"),
          severity: "error",
          errorType: ERROR_MANDATORY,
        },
      };
    }
    if (!connectData.password || connectData.password === "") {
      mandatoryFieldsFilled = false;
      errorObj = {
        ...errorObj,
        password: {
          statement: t("PleaseEnter") + " " + t("Password"),
          severity: "error",
          errorType: ERROR_MANDATORY,
        },
      };
    }
    if (mandatoryFieldsFilled) {
      let json = {
        appServerIP: connectData.ipAddress,
        appServerPort: connectData.portId,
        appServerType: connectData.protocolType,
        userName: connectData.username,
        authCred: connectData.password,
        cabinetName: connectData.cabinet,
        m_strActivityID: localLoadedActivityPropertyData.ActivityProperty.actId,
      };
      axios.post(SERVER_URL + ENDPOINT_CONNECT_CABINET, json).then((res) => {
        if (res.data.Status === 0) {
          setError({});
          let tempList = [...res.data.Category];
          if (tempList?.length > 1) {
            getTemplateForCategory(-1);
          } else if (tempList?.length === 1) {
            getTemplateForCategory(tempList[0].CategoryName);
          }
          setCategoryList(tempList);
          setConnected(true);
          dispatch(
            setActivityPropertyChange({
              [propertiesLabel.templates]: {
                isModified: true,
                hasError: false,
              },
            })
          );
        }
        else{
          dispatch(
            setToastDataFunc({
              message: res?.data?.Message,
              severity: "error",
              open: true,
            })
          );
        }
      });
    } else {
      setError({ ...error, ...errorObj });
    }
  };

  const disconnectFunc = () => {
    let json = {
      appServerIP: connectData.ipAddress,
      appServerPort: connectData.portId,
      appServerType: connectData.protocolType,
      cabinetName: connectData.cabinet,
      m_strActivityID: localLoadedActivityPropertyData.ActivityProperty.actId,
    };
    axios.post(SERVER_URL + ENDPOINT_DISCONNECT_CABINET, json).then((res) => {
      if (res.data.Status === 0) {
        setConnected(false);
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.templates]: {
              isModified: false,
              hasError: false,
            },
          })
        );
      }
    });
  };

  const getTemplateForCategory = (value) => {
    setCategory(value);
    let json = {
      appServerIP: connectData.ipAddress,
      appServerPort: connectData.portId,
      appServerType: connectData.protocolType,
      cabinetName: connectData.cabinet,
      m_strSearchCateg: value,
    };
    axios.post(SERVER_URL + ENDPOINT_GET_CABINET_TEMPLATE, json).then((res) => {
      if (res.data.Status === 0) {
        setTemplateList(res.data.Data);
      } else {
        setTemplateList([]);
      }
    });
  };

  const removeTemplateFromList = (index, item) => {
    let tempNewList = [...associatedTemplateList];
    if (index === null) {
      let indVal = null;
      tempNewList?.forEach((el, index1) => {
        if (el.ProductName === item.ProductName) {
          indVal = index1;
        }
      });
      tempNewList.splice(indVal, 1);
    } else {
      tempNewList.splice(index, 1);
    }
    setAssociatedTemplateList(tempNewList);
    if (selectedTemplate && item.ProductName === selectedTemplate.ProductName) {
      setSelectedTemplate(null);
    }
    let temp = { ...localLoadedActivityPropertyData };
    let tempList = localLoadedActivityPropertyData.ActivityProperty
      .ccmTemplateInfo.associatedList
      ? [
          ...localLoadedActivityPropertyData.ActivityProperty.ccmTemplateInfo
            .associatedList,
        ]
      : [];
    let indexVal = null;
    tempList?.forEach((el, index2) => {
      if (el.productName === item.ProductName) {
        indexVal = index2;
      }
    });
    tempList.splice(indexVal, 1);
    localLoadedActivityPropertyData.ActivityProperty.ccmTemplateInfo = {
      ...localLoadedActivityPropertyData.ActivityProperty.ccmTemplateInfo,
      associatedList: tempList,
      appServerIP: connectData.ipAddress,
      appServerPort: connectData.portId + "",
      appServerType: connectData.protocolType,
      cabinetName: connectData.cabinet,
      userName: connectData.username,
    };
    setlocalLoadedActivityPropertyData(temp);
  };

  const mapTemplate = (template) => {
    const json = {
      appServerIP: connectData.ipAddress,
      appServerPort: connectData.portId,
      appServerType: connectData.protocolType,
      cabinetName: connectData.cabinet,
      m_strSelectedProdName: template.ProductName,
      m_sSelectedVers: template.ReportVersions,
    };
    axios.post(SERVER_URL + ENDPOINT_MAP_TEMPLATE, json).then((res) => {
      if (res.data.Status === 0) {
        setSchemaList(res.data.Schema);
        setShowMappingModal(template);
      }
    });
  };

  const saveMappingDetailsFunc = (updatedTemplate) => {
    let temp = { ...localLoadedActivityPropertyData };
    let tempList = localLoadedActivityPropertyData.ActivityProperty
      .ccmTemplateInfo.associatedList
      ? [
          ...localLoadedActivityPropertyData.ActivityProperty.ccmTemplateInfo
            .associatedList,
        ]
      : [];
    tempList.forEach((el) => {
      if (el.productName === updatedTemplate.ProductName) {
        el.arrFwdVarMapping = updatedTemplate.FwdVarMapping;
        el.reverseDocName = updatedTemplate.DocType;
        el.timeOutInterval = updatedTemplate.Timeout;
      }
    });
    localLoadedActivityPropertyData.ActivityProperty.ccmTemplateInfo = {
      ...localLoadedActivityPropertyData.ActivityProperty.ccmTemplateInfo,
      associatedList: tempList,
      appServerIP: connectData.ipAddress,
      appServerPort: connectData.portId + "",
      appServerType: connectData.protocolType,
      cabinetName: connectData.cabinet,
      userName: connectData.username,
    };
    setlocalLoadedActivityPropertyData(temp);
  };

  const setAssociatedTemplateListFunc = (list, type, item) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    let tempList = temp.ActivityProperty.ccmTemplateInfo.associatedList
      ? JSON.parse(
          JSON.stringify(temp.ActivityProperty.ccmTemplateInfo.associatedList)
        )
      : [];
    if (type === 0) {
      //type 0 is to add new templates to associated template list
      let newList = JSON.parse(JSON.stringify(associatedTemplateList));
      list?.forEach((el) => {
        if (!associatedList.includes(el.ProductName)) {
          newList.push(el);
        }
      });
      setAssociatedTemplateList(newList);
      tempList.push({
        timeOutInterval: item.Timeout ? item.Timeout : 0,
        reportName: item.ReportName,
        reverseDocName: item.DocType,
        invocType: SYNCHRONOUS,
        description: item.Description,
        arrFwdVarMapping: item.FwdVarMapping,
        commGroupName: item.CommunicationGroupName,
        categoryName: item.CategoryName,
        version: item.ReportVersions,
        productName: item.ProductName,
      });
    } else if (type === 1) {
      //type 1 is to delete some templates from associated template list
      let newList = [];
      associatedTemplateList?.forEach((el) => {
        if (item.ProductName !== el.ProductName) {
          newList.push(el);
        }
      });
      setAssociatedTemplateList(newList);
      let indexVal = null;
      tempList?.forEach((el, index) => {
        if (el.productName === item.ProductName) {
          indexVal = index;
        }
      });
      tempList.splice(indexVal, 1);
    }
    temp.ActivityProperty.ccmTemplateInfo = {
      associatedList: [...tempList],
      appServerIP: connectData.ipAddress,
      appServerPort: connectData.portId + "",
      appServerType: connectData.protocolType,
      cabinetName: connectData.cabinet,
      userName: connectData.username,
    };
    setlocalLoadedActivityPropertyData(temp);
  };

  const downloadTemplate = (template) => {
    axios({
      url:
        SERVER_URL +
        ENDPOINT_DOWNLOAD_ASSOCIATED_TEMPLATE +
        `${template.ProductName}/${template.ReportVersions}`, //your url
      method: "GET",
      responseType: "blob", // important
    }).then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: res.headers["content-type"],
        })
      );
      let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      let matches = filenameRegex.exec(res.headers["content-disposition"]);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", matches[1].replace(/['"]/g, "")); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <>
      <TabsHeading heading={props?.heading} />
      <div className="flexColumn">
        {spinner ? (
          <CircularProgress
            style={
              direction === RTL_DIRECTION
                ? { marginTop: "30vh", marginRight: "40%" }
                : { marginTop: "30vh", marginLeft: "40%" }
            }
          />
        ) : (
          <div
            className={`${styles.mainDiv} ${
              props.isDrawerExpanded
                ? styles.expandedView
                : styles.collapsedView
            }`}
            style={{ direction: `${direction}` }}
          >
            <div className={styles.cabinetDiv}>
              <p className={styles.divHeading}>{t("O2MsDetails")}</p>
              <div className={styles.cabinetBodyDiv}>
                <label className={styles.templatePropLabel}>
                  {t("ProtocolType")}
                </label>
                <Select
                  className={`templatePropSelect ${styles.templatePropSelect}`}
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
                  inputProps={{
                    readOnly: connected || isReadOnly,
                  }}
                  style={{ backgroundColor: connected ? "#f8f8f8" : "#fff" }}
                  name="protocolType"
                  value={connectData.protocolType}
                  onChange={onChange}
                >
                  {["http", "https"].map((option) => {
                    return (
                      <MenuItem
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.templateDropdownData
                            : styles.templateDropdownData
                        }
                        value={option}
                      >
                        {option}
                      </MenuItem>
                    );
                  })}
                </Select>
                <label className={styles.templatePropLabel}>
                  {t("domainName")} / {t("IpAddress")}
                  <span
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.starIcon
                        : styles.starIcon
                    }
                  >
                    *
                  </span>
                </label>
                <TextInput
                  inputValue={connectData?.ipAddress}
                  classTag={styles.templatePropInput}
                  onChangeEvent={onChange}
                  readOnlyCondition={connected || isReadOnly}
                  name="ipAddress"
                  idTag="oms_ipAddress"
                  errorStatement={error?.ipAddress?.statement}
                  errorSeverity={error?.ipAddress?.severity}
                  errorType={error?.ipAddress?.errorType}
                  inlineError={true}
                  inputRef={ipRef}
                  onKeyPress={(e) => FieldValidations(e, 10, ipRef.current, 100)}
                />

                <label className={styles.templatePropLabel}>
                  {t("PortId")}
                </label>
                {
  /*code updated on 15 September 2022 for BugId 112903*/
}
                <TextInput
                  inputValue={connectData?.portId}
                  classTag={styles.templatePropInput}
                  onChangeEvent={onChange}
                  readOnlyCondition={connected || isReadOnly}
                  type="number"
                  name="portId"
                  idTag="oms_portId"
                  rangeVal={{ start: 0, end: 65535 }}
                  errorStatement={error?.portId?.statement}
                  errorSeverity={error?.portId?.severity}
                  errorType={error?.portId?.errorType}
                  inlineError={true}
                  inputRef={portRef}
                  onKeyPress={(e) => FieldValidations(e, 131, portRef.current, 5)}
                />
                {hideConnectBtn ? (
                  <button
                    onClick={getCabinetFunc}
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.getCabinetBtn
                        : isReadOnly
                        ? styles.disabledBtn
                        : styles.getCabinetBtn
                    }
                    disabled={isReadOnly}
                  >
                    {t("GetCabinets")}
                  </button>
                ) : (
                  <div>
                    <label className={styles.templatePropLabel}>
                      {t("Cabinet")}
                    </label>
                    <Select
                      className={`templatePropSelect ${styles.templatePropSelect}`}
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
                      inputProps={{
                        readOnly: connected || isReadOnly,
                      }}
                      style={{
                        backgroundColor: connected ? "#f8f8f8" : "#fff",
                      }}
                      name="cabinet"
                      value={connectData.cabinet}
                      onChange={onChange}
                    >
                      {cabinetList?.map((option) => {
                        return (
                          <MenuItem
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.templateDropdownData
                                : styles.templateDropdownData
                            }
                            value={option.CabinetName}
                          >
                            {option.CabinetName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <label className={styles.templatePropLabel}>
                      {t("Username")}
                      <span
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.starIcon
                            : styles.starIcon
                        }
                      >
                        *
                      </span>
                    </label>
                    <TextInput
                      inputValue={connectData?.username}
                      classTag={styles.templatePropInput}
                      onChangeEvent={onChange}
                      readOnlyCondition={connected || isReadOnly}
                      name="username"
                      idTag="oms_username"
                      errorStatement={error?.username?.statement}
                      errorSeverity={error?.username?.severity}
                      errorType={error?.username?.errorType}
                      inlineError={true}
                    />
                    <label className={styles.templatePropLabel}>
                      {t("Password")}
                      <span
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.starIcon
                            : styles.starIcon
                        }
                      >
                        *
                      </span>
                    </label>
                    <TextInput
                      inputValue={connectData?.password}
                      classTag={styles.templatePropInput}
                      onChangeEvent={onChange}
                      readOnlyCondition={connected || isReadOnly}
                      name="password"
                      type="password"
                      idTag="oms_password"
                      errorStatement={error?.password?.statement}
                      errorSeverity={error?.password?.severity}
                      errorType={error?.password?.errorType}
                      inlineError={true}
                    />
                    {connected ? (
                      <button
                        onClick={disconnectFunc}
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.disconnectBtn
                            : styles.disconnectBtn
                        }
                      >
                        {t("Disconnect")}
                      </button>
                    ) : (
                      <button
                        onClick={connectFunc}
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.getCabinetBtn
                            : isReadOnly
                            ? styles.disabledBtn
                            : styles.getCabinetBtn
                        }
                        disabled={isReadOnly}
                      >
                        {t("Connect")}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.templateList
                  : styles.templateList
              }
            >
              <p className={styles.divHeading}>{t("SelectTemplate(s)")}</p>
              <label className={styles.templatePropLabel}>
                {t("Category")}
              </label>
              <Select
                className={`templatePropSelect ${styles.templatePropSelect}`}
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
                inputProps={{
                  readOnly: !connected || isReadOnly,
                }}
                style={{ backgroundColor: !connected ? "#f8f8f8" : "#fff" }}
                name="cabinet"
                value={category}
                onChange={(e) => getTemplateForCategory(e.target.value)}
              >
                {categoryList?.length > 1 ? (
                  <MenuItem
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.templateDropdownData
                        : styles.templateDropdownData
                    }
                    value={-1}
                  >
                    {t("All")}
                  </MenuItem>
                ) : null}
                {categoryList?.map((option) => {
                  return (
                    <MenuItem
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.templateDropdownData
                          : styles.templateDropdownData
                      }
                      value={option.CategoryName}
                    >
                      {option.CategoryName}
                    </MenuItem>
                  );
                })}
              </Select>
              <label className={styles.templatePropLabel}>
                {t("Template")}
              </label>
              <MultiSelectWithSearchInput
                optionList={templateList}
                selectedOptionList={associatedList}
                optionRenderKey="ProductName"
                showTags={false}
                getSelectedItems={setAssociatedTemplateListFunc}
                isDisabled={!connected || isReadOnly}
              />
              {associatedTemplateList?.length > 0 ? (
                <React.Fragment>
                  <p className={styles.nextDivHeading}>
                    {t("AssociatedTemplates")}
                  </p>
                  <div className={styles.associatedTemplateDiv}>
                    {associatedTemplateList.map((el, index) => {
                      return (
                        <div
                          className={
                            selectedTemplate?.ProductName === el.ProductName
                              ? styles.selectedTempDiv
                              : styles.associatedTempDiv
                          }
                        >
                          <span
                            className={styles.tempName}
                            onClick={() => setSelectedTemplate(el)}
                          >
                            {el.ProductName}
                          </span>
                          <span className={styles.tempIconsDiv}>
                            <TemplateTooltip
                              arrow
                              title={
                                !connected
                                  ? t("mappingError")
                                  : t("viewMapping")
                              }
                              placement={"bottom"}
                            >
                              <SwapHorizIcon
                                className={styles.downloadIcon}
                                style={{
                                  cursor: !connected ? "default" : "pointer",
                                }}
                                onClick={() => {
                                  if (connected) {
                                    mapTemplate(el);
                                  }
                                }}
                              />
                            </TemplateTooltip>
                            <TemplateTooltip
                              arrow
                              title={
                                !connected ? t("downloadError") : t("download")
                              }
                              placement={"bottom"}
                            >
                              <GetAppIcon
                                className={styles.downloadIcon}
                                style={{
                                  cursor: !connected ? "default" : "pointer",
                                }}
                                onClick={() => {
                                  if (connected) {
                                    downloadTemplate(el);
                                  }
                                }}
                              />
                            </TemplateTooltip>
                            {!isReadOnly && (
                              <DeleteIcon
                                className={styles.downloadIcon}
                                onClick={() =>
                                  removeTemplateFromList(index, el)
                                }
                              />
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </React.Fragment>
              ) : null}
            </div>
            {props.isDrawerExpanded ? (
              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.templateDetails
                    : styles.templateDetails
                }
              >
                {selectedTemplate ? (
                  <React.Fragment>
                    <p className={styles.selectedDiv}>
                      <span className={styles.subDivHeading}>
                        {selectedTemplate.ProductName} - {t("Properties")}
                      </span>
                      <span className={styles.selectedIconsDiv}>
                        <TemplateTooltip
                          arrow
                          title={
                            !connected ? t("downloadError") : t("download")
                          }
                          placement={"bottom"}
                        >
                          <GetAppIcon
                            className={styles.expandViewIcon}
                            style={{
                              cursor: !connected ? "default" : "pointer",
                            }}
                            onClick={() => downloadTemplate(selectedTemplate)}
                          />
                        </TemplateTooltip>
                        {!isReadOnly && (
                          <DeleteIcon
                            className={styles.expandViewIcon}
                            onClick={() =>
                              removeTemplateFromList(null, selectedTemplate)
                            }
                          />
                        )}
                        <CloseIcon
                          className={styles.expandViewIcon}
                          onClick={() => setSelectedTemplate(null)}
                        />
                      </span>
                    </p>
                    <TemplatePropertiesScreen
                      selectedTemplate={selectedTemplate}
                    />
                  </React.Fragment>
                ) : (
                  <div className={styles.noSelectedTemplateScreen}>
                    <img src={emptyStatePic} />
                    <p className={styles.noTemplateSelectedString}>
                      {t("noOMS_TemplateSelected")}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
        {showMappingModal !== null ? (
          <Modal
            show={showMappingModal !== null}
            style={{
              width: "50vw",
              left: "24%",
              top: "20%",
              padding: "0",
            }}
            children={
              <MappingModal
                schemaList={schemaList}
                template={showMappingModal}
                cancelFunc={() => setShowMappingModal(null)}
                okFunc={saveMappingDetailsFunc}
                isReadOnly={isReadOnly}
              />
            }
          />
        ) : null}
        {!props.isDrawerExpanded && selectedTemplate ? (
          <Modal
            show={!props.isDrawerExpanded && selectedTemplate}
            style={{
              width: "50vw",
              left: "24%",
              top: "21.5%",
              padding: "0",
            }}
            modalClosed={() => setSelectedTemplate(null)}
            children={
              <PropertiesModal
                selectedTemplate={selectedTemplate}
                okFunc={() => setSelectedTemplate(null)}
                cancelFunc={() => setSelectedTemplate(null)}
              />
            }
          />
        ) : null}
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    cellName: state.selectedCellReducer.selectedName,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
  };
};
export default connect(mapStateToProps, null)(TemplateProperties);
