import React, { useEffect, useState } from "react";
import styles from "../index.module.css";
import arabicStyles from "../arabicStyles.module.css";
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import TextInput from "../../../../../../../UI/Components_With_ErrrorHandling/InputField";
import Modal from "../../../../../../../UI/Modal/Modal.js";
import {
  AUTH_TYPE_DROPDOWN,
  BASIC_AUTH,
  DEFINE_AUTH_DETAILS,
  DEFINE_PARAM,
  DEFINE_REQUEST_BODY,
  DEFINE_RESPONSE_BODY,
  DOMAIN_DROPDOWN,
  MEDIA_TYPE_DROPDOWN,
  OPERATION_DROPDOWN,
  STATE_ADDED,
  STATE_CREATED,
  STATE_EDITED,
  TOKEN_BASED_AUTH,
  Y_FLAG,
  NO_AUTH,
  RTL_DIRECTION,
} from "../../../../../../../Constants/appConstants";
import DefineParamModal from "./DefineParamModal";
import {
  getAuthenticationCode,
  getResReqCode,
} from "../../../../../../../utility/ServiceCatalog/Webservice";
import DefineRequestModal from "./DefineRequestModal";
import DefineResponseModal from "./DefineResponseModal";
import BasicAuthModal from "./BasicAuthModal";
import TokenAuthModal from "./TokenAuthModal";
import "../index.css";

function REST_Manual(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let { selected, setSelected, setChangedSelection, error } = props;
  const [isProxyReq, setIsProxyReq] = useState(false);
  const [brmsRestService, setBRMSRestService] = useState(false);
  const [webServiceObj, setWebServiceObj] = useState({
    alias: "",
    domain: "",
    description: "",
    methodName: "",
    baseUri: "",
    operationType: "GET",
    authType: NO_AUTH,
    resMediaType: "X",
    reqMediaType: "X",
    resourcePath: "",
    username: "",
    password: "",
    authUrl: "",
    authOperation: "GET",
    reqType: "X",
    resType: "X",
    dataList: [],
  });
  const [openModal, setOpenModal] = useState(null);
  const [maxDataId, setMaxDataId] = useState(0);
  const [inputParamList, setInputParamList] = useState([]);
  const [reqBodyList, setReqBodyList] = useState([]);
  const [resBodyList, setResBodyList] = useState([]);

  useEffect(() => {
    if (selected) {
      if (selected.status === STATE_ADDED) {
        setBRMSRestService(selected.BRMSEnabled === Y_FLAG);
        setIsProxyReq(selected.ProxyEnabled === Y_FLAG);
        setWebServiceObj({
          alias: selected.AliasName,
          domain: selected.Domain,
          description: selected.Description,
          methodName: selected.MethodName,
          baseUri: selected.BaseURI,
          operationType: selected.OperationType,
          authType: getAuthenticationCode(selected.AuthenticationType),
          resMediaType: selected.ResponseMediaType,
          reqMediaType: selected.RequestMediaType,
          resourcePath: selected.ResourcePath,
          maxDataStructId: selected.MaxDataStructId,
          username:
            getAuthenticationCode(selected.AuthenticationType) === BASIC_AUTH
              ? selected.UserName
              : "",
          password:
            getAuthenticationCode(selected.AuthenticationType) === BASIC_AUTH
              ? selected.Password
              : "",
          authUrl:
            getAuthenticationCode(selected.AuthenticationType) ===
            TOKEN_BASED_AUTH
              ? selected.AuthorizationURL
              : "",
          authOperation:
            getAuthenticationCode(selected.AuthenticationType) ===
            TOKEN_BASED_AUTH
              ? selected.AuthOperationType
              : "",
          reqType:
            getAuthenticationCode(selected.AuthenticationType) ===
            TOKEN_BASED_AUTH
              ? selected.RequestType
              : "",
          resType:
            getAuthenticationCode(selected.AuthenticationType) ===
            TOKEN_BASED_AUTH
              ? selected.ResponseType
              : "",
          dataList:
            getAuthenticationCode(selected.AuthenticationType) ===
            TOKEN_BASED_AUTH
              ? selected.ParamMapping
              : [],
        });
        setMaxDataId(selected.MaxDataStructId);
        setInputParamList(selected?.InputParameters?.PrimitiveComplexType);
        setReqBodyList(selected?.RequestBodyParameters?.NestedReqComplexType);
        setResBodyList(selected?.ResponseBodyParameters?.NestedResComplexType);
      } else if (selected.status === STATE_CREATED) {
        setBRMSRestService(false);
        setIsProxyReq(false);
        setWebServiceObj({
          alias: "",
          domain: "",
          description: "",
          methodName: "",
          baseUri: "",
          operationType: "GET",
          authType: NO_AUTH,
          resMediaType: "X",
          reqMediaType: "X",
          resourcePath: "",
          username: "",
          password: "",
          authUrl: "",
          authOperation: "GET",
          reqType: "X",
          resType: "X",
          dataList: [],
        });
      }
    }
  }, [selected]);

  useEffect(() => {
    // code edited for BugId 113306 and BugId 113320
    setChangedSelection((prev) => {
      let temp = { ...prev };
      temp = {
        ...temp,
        ...webServiceObj,
        brmsEnabled: brmsRestService,
        proxyEnabled: isProxyReq,
        ResBodyParameters: resBodyList,
        ReqBodyParameters: reqBodyList,
        InputParameters: inputParamList,
      };
      return temp;
    });
  }, [
    webServiceObj,
    brmsRestService,
    isProxyReq,
    resBodyList,
    reqBodyList,
    inputParamList,
  ]);

  const onChange = (e) => {
    let tempWebService = { ...webServiceObj };
    tempWebService[e.target.name] = e.target.value;
    setWebServiceObj(tempWebService);
    if (selected?.status === STATE_ADDED) {
      setSelected((prev) => {
        let temp = { ...prev };
        temp.status = STATE_EDITED;
        return temp;
      });
    }
  };

  return (
    <div className={styles.webSDefinition}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isProxyReq}
            onChange={(e) => {
              setIsProxyReq(e.target.checked);
            }}
            id="webS_isProxyCheck"
            className={styles.omsTemplateCheckbox}
          />
        }
        className={`${
          direction === RTL_DIRECTION
            ? arabicStyles.webS_radioButton
            : styles.webS_radioButton
        } block`}
        label={t("ProxyRequired")}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={brmsRestService}
            onChange={(e) => {
              setBRMSRestService(e.target.checked);
            }}
            id="webS_isBRMS_Restservice"
            className={styles.omsTemplateCheckbox}
          />
        }
        className={`${
          direction === RTL_DIRECTION
            ? arabicStyles.webS_radioButton
            : styles.webS_radioButton
        } block`}
        label={t("BRMS_RestService")}
      />
      <div className={styles.webSDefinition}>
        <label
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.webSLabel
              : styles.webSLabel
          }
        >
          {t("Alias")}
        </label>
        <TextInput
          inputValue={webServiceObj?.alias}
          classTag={styles.webSInput}
          onChangeEvent={onChange}
          name="alias"
          idTag="webS_alias_REST"
        />
        <label
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.webSLabel
              : styles.webSLabel
          }
        >
          {t("Domain")}
        </label>
        <Select
          className={`webSSelect ${
            direction === RTL_DIRECTION
              ? arabicStyles.webSSelect
              : styles.webSSelect
          }`}
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
          name="domain"
          value={webServiceObj.domain}
          onChange={onChange}
          id="webS_domain_REST"
        >
          <MenuItem
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webSDropdownData
                : styles.webSDropdownData
            }
            value={""}
          >
            {""}
          </MenuItem>
          {DOMAIN_DROPDOWN.map((option) => {
            return (
              <MenuItem
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.webSDropdownData
                    : styles.webSDropdownData
                }
                value={t(option)}
              >
                {t(option)}
              </MenuItem>
            );
          })}
        </Select>
        <label
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.webSLabel
              : styles.webSLabel
          }
        >
          {t("description")}
        </label>
        <textarea
          value={webServiceObj?.description}
          className={styles.webSTextArea}
          onChange={onChange}
          name="description"
          id="webS_description_REST"
        />
        <label
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.webSLabel
              : styles.webSLabel
          }
        >
          {t("method")} {t("name")}
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
          inputValue={webServiceObj?.methodName}
          classTag={styles.webSInput}
          onChangeEvent={onChange}
          name="methodName"
          idTag="webS_methodName_REST"
          errorStatement={error?.methodName?.statement}
          errorSeverity={error?.methodName?.severity}
          errorType={error?.methodName?.errorType}
          inlineError={true}
        />
        <label
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.webSLabel
              : styles.webSLabel
          }
        >
          {t("BaseURI")}
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
          inputValue={webServiceObj?.baseUri}
          classTag={styles.webSInput}
          onChangeEvent={onChange}
          name="baseUri"
          idTag="webS_baseUri_REST"
          errorStatement={error?.baseUri?.statement}
          errorSeverity={error?.baseUri?.severity}
          errorType={error?.baseUri?.errorType}
          inlineError={true}
        />
        <label
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.webSLabel
              : styles.webSLabel
          }
        >
          {t("ResourcePath")}
        </label>
        <TextInput
          inputValue={webServiceObj?.resourcePath}
          classTag={styles.webSInput}
          onChangeEvent={onChange}
          name="resourcePath"
          idTag="webS_resourcePath_REST"
        />
        <label
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.webSLabel
              : styles.webSLabel
          }
        >
          {t("OperationType")}
        </label>
        <Select
          className={`webSSelect ${
            direction === RTL_DIRECTION
              ? arabicStyles.webSSelect
              : styles.webSSelect
          }`}
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
          name="operationType"
          value={webServiceObj.operationType}
          onChange={onChange}
          id="webS_opType_REST"
        >
          {OPERATION_DROPDOWN.map((option1) => {
            return (
              <MenuItem
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.webSDropdownData
                    : styles.webSDropdownData
                }
                value={t(option1)}
              >
                {t(option1)}
              </MenuItem>
            );
          })}
        </Select>
        <div className="flex alignCenter">
          <button
            className={`${styles.secondaryBtn} ${styles.mb1} ${
              direction === RTL_DIRECTION ? arabicStyles.mr1 : styles.mr1
            }`}
            id="webS_defineParam_REST"
            onClick={() => setOpenModal(DEFINE_PARAM)}
          >
            {t("Parameter")} {t("definition")}
          </button>
          <button
            className={`${styles.secondaryBtn} ${styles.mb1} ${
              direction === RTL_DIRECTION ? arabicStyles.mr1 : styles.mr1
            }`}
            id="webS_reqBodydefine_REST"
            onClick={() => setOpenModal(DEFINE_REQUEST_BODY)}
          >
            {t("RequestBody")} {t("definition")}
          </button>
          <button
            className={`${styles.secondaryBtn} ${styles.mb1} ${
              direction === RTL_DIRECTION ? arabicStyles.mr1 : styles.mr1
            }`}
            id="webS_resBodydefine_REST"
            onClick={() => setOpenModal(DEFINE_RESPONSE_BODY)}
          >
            {t("ResponseBody")} {t("definition")}
          </button>
        </div>
        <div className="flex alignEnd">
          <div className="flexColumn">
            <label
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.webSLabel
                  : styles.webSLabel
              }
            >
              {t("AuthenticationType")}
            </label>
            <Select
              className={`webSSelect ${
                direction === RTL_DIRECTION
                  ? arabicStyles.webSSelect
                  : styles.webSSelect
              }`}
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
              name="authType"
              value={webServiceObj.authType}
              onChange={onChange}
              id="webS_authType_REST"
            >
              {AUTH_TYPE_DROPDOWN.map((option) => {
                return (
                  <MenuItem
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.webSDropdownData
                        : styles.webSDropdownData
                    }
                    value={option}
                  >
                    {t(option)}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          <button
            className={`${
              webServiceObj.authType === NO_AUTH
                ? styles.disabledBtn
                : styles.secondaryBtn
            } ${styles.mb1} ${styles.mlr2}`}
            onClick={() => setOpenModal(DEFINE_AUTH_DETAILS)}
            disabled={webServiceObj.authType === NO_AUTH}
            id={`webs_authenDetails_${props.scope}`}
            style={{ height: "auto", minHeight: "1.5rem" }}
          >
            {t("Define")} {t("AuthenticationDetails")}
          </button>
        </div>
        <label
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.webSLabel
              : styles.webSLabel
          }
        >
          {t("RequestMediaType")}
        </label>
        <Select
          className={`webSSelect ${
            direction === RTL_DIRECTION
              ? arabicStyles.webSSelect
              : styles.webSSelect
          }`}
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
          name="reqMediaType"
          value={webServiceObj.reqMediaType}
          onChange={onChange}
          id="webS_reqMediaType_REST"
        >
          {MEDIA_TYPE_DROPDOWN.map((opt) => {
            return (
              <MenuItem
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.webSDropdownData
                    : styles.webSDropdownData
                }
                value={opt}
              >
                {t(getResReqCode(opt))}
              </MenuItem>
            );
          })}
        </Select>
        <label
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.webSLabel
              : styles.webSLabel
          }
        >
          {t("ResponseMediaType")}
        </label>
        <Select
          className={`webSSelect ${
            direction === RTL_DIRECTION
              ? arabicStyles.webSSelect
              : styles.webSSelect
          }`}
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
          name="resMediaType"
          value={webServiceObj.resMediaType}
          onChange={onChange}
          id="webS_resMediaType_REST"
        >
          {MEDIA_TYPE_DROPDOWN.map((opt1) => {
            return (
              <MenuItem
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.webSDropdownData
                    : styles.webSDropdownData
                }
                value={opt1}
              >
                {t(getResReqCode(opt1))}
              </MenuItem>
            );
          })}
        </Select>
      </div>

      {openModal === DEFINE_PARAM ? (
        <Modal
          show={openModal === DEFINE_PARAM}
          style={{
            width: "55vw",
            left: "25%",
            top: "22%",
            padding: "0",
          }}
          modalClosed={() => setOpenModal(null)}
          children={
            <DefineParamModal
              cancelFunc={() => setOpenModal(null)}
              selected={selected}
              setChangedSelection={setChangedSelection}
              setSelected={setSelected}
              maxDataId={maxDataId}
              setMaxDataId={setMaxDataId}
              inputParamList={inputParamList}
              setInputParamList={setInputParamList}
              id="ParameterDefinition"
            />
          }
        />
      ) : null}
      {openModal === DEFINE_REQUEST_BODY ? (
        <Modal
          show={openModal === DEFINE_REQUEST_BODY}
          style={{
            width: "80vw",
            left: "13%",
            top: "22%",
            padding: "0",
          }}
          modalClosed={() => setOpenModal(null)}
          children={
            <DefineRequestModal
              cancelFunc={() => setOpenModal(null)}
              selected={selected}
              setChangedSelection={setChangedSelection}
              setSelected={setSelected}
              maxDataId={maxDataId}
              setMaxDataId={setMaxDataId}
              reqBodyList={reqBodyList}
              setReqBodyList={setReqBodyList}
              id="ReqBodyDefinition"
            />
          }
        />
      ) : null}
      {openModal === DEFINE_RESPONSE_BODY ? (
        <Modal
          show={openModal === DEFINE_RESPONSE_BODY}
          style={{
            width: "80vw",
            left: "13%",
            top: "22%",
            padding: "0",
          }}
          modalClosed={() => setOpenModal(null)}
          children={
            <DefineResponseModal
              cancelFunc={() => setOpenModal(null)}
              selected={selected}
              setChangedSelection={setChangedSelection}
              setSelected={setSelected}
              maxDataId={maxDataId}
              setMaxDataId={setMaxDataId}
              resBodyList={resBodyList}
              setResBodyList={setResBodyList}
              id="ResBodyDefinition"
            />
          }
        />
      ) : null}
      {openModal === DEFINE_AUTH_DETAILS &&
      webServiceObj.authType === BASIC_AUTH ? (
        <Modal
          show={
            openModal === DEFINE_AUTH_DETAILS &&
            webServiceObj.authType === BASIC_AUTH
          }
          style={{
            width: "30vw",
            left: "40%",
            top: "26%",
            padding: "0",
          }}
          modalClosed={() => setOpenModal(null)}
          children={
            <BasicAuthModal
              cancelFunc={() => setOpenModal(null)}
              selected={selected}
              setSelected={setSelected}
              webServiceObj={webServiceObj}
              setWebServiceObj={setWebServiceObj}
              id="BasicAuth"
            />
          }
        />
      ) : null}
      {openModal === DEFINE_AUTH_DETAILS &&
      webServiceObj.authType === TOKEN_BASED_AUTH ? (
        <Modal
          show={
            openModal === DEFINE_AUTH_DETAILS &&
            webServiceObj.authType === TOKEN_BASED_AUTH
          }
          style={{
            width: "60vw",
            left: "22%",
            top: "20%",
            padding: "0",
          }}
          modalClosed={() => setOpenModal(null)}
          children={
            <TokenAuthModal
              cancelFunc={() => setOpenModal(null)}
              selected={selected}
              setSelected={setSelected}
              webServiceObj={webServiceObj}
              setWebServiceObj={setWebServiceObj}
              id="TokenAuth"
            />
          }
        />
      ) : null}
    </div>
  );
}

export default REST_Manual;
