import React, { useEffect, useState } from "react";
import styles from "../index.module.css";
import arabicStyles from "../arabicStyles.module.css";
import { useTranslation } from "react-i18next";
import TextInput from "../../../../../../../UI/Components_With_ErrrorHandling/InputField";
import { MenuItem, Select } from "@material-ui/core";
import {
  DOMAIN_DROPDOWN,
  ENDPOINT_FETCH_DETAILS,
  ERROR_INCORRECT_FORMAT,
  ERROR_MANDATORY,
  RTL_DIRECTION,
  SERVER_URL,
  STATE_ADDED,
  STATE_CREATED,
  STATE_EDITED,
} from "../../../../../../../Constants/appConstants";
import "../index.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToastDataFunc } from "../../../../../../../redux-store/slices/ToastDataHandlerSlice";
import { validateRegex } from "../../../../../../../validators/validator";

function SOAPDefinition(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  let { selected, setChangedSelection, setSelected } = props;
  const [webServiceObj, setWebServiceObj] = useState({
    alias: "",
    domain: "",
    description: "",
    wsdl_url: "",
    webServiceName: "",
    methodName: {},
  });
  const [detailsFetched, setDetailsFetched] = useState(false);
  const [appList, setAppList] = useState([]);
  const [methodList, setMethodList] = useState([]);
  const [error, setError] = useState({});

  useEffect(() => {
    if (selected) {
      setDetailsFetched(false);
      if (selected.status === STATE_ADDED) {
        let tempMethodList = [
          {
            methodName: selected.MethodName,
            dataStructure: selected.DataStructure,
            param: selected.Parameter,
            returnType: selected.ReturnType,
            appType: selected.AppType,
            appName: selected.AppName,
          },
        ];
        setAppList([selected.AppName]);
        setMethodList(tempMethodList);
        setWebServiceObj({
          alias: selected.AliasName,
          domain: selected.Domain,
          description: selected.Description,
          wsdl_url: selected.WSDLLocation,
          webServiceName: selected.AppName,
          methodName: tempMethodList[0],
        });
      } else if (selected.status === STATE_CREATED) {
        setAppList([]);
        setMethodList([]);
        setWebServiceObj({
          alias: "",
          domain: "",
          description: "",
          wsdl_url: "",
          webServiceName: "",
          methodName: {},
        });
      }
    }
  }, [selected]);

  useEffect(() => {
    setChangedSelection((prev) => {
      let temp = { ...prev };
      temp = { ...temp, ...webServiceObj };
      return temp;
    });
  }, [webServiceObj]);

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

  const fetchDetailsFunc = () => {
    if (!webServiceObj?.wsdl_url || webServiceObj?.wsdl_url?.trim() === "") {
      setError({
        wsdl_url: {
          statement: t("PleaseEnter") + " " + t("ValidWSDLPath"),
          severity: "error",
          errorType: ERROR_MANDATORY,
        },
      });
    } else if (!validateRegex(webServiceObj.wsdl_url, `\\?wsdl$`)) {
      setError({
        wsdl_url: {
          statement: t("WSDL_URL") + " " + t("isIncorrect"),
          severity: "error",
          errorType: ERROR_INCORRECT_FORMAT,
        },
      });
    } else {
      let json = {
        wsdlLocation: webServiceObj.wsdl_url,
        m_strSOAPGlblFlag: props.scope,
      };
      axios.post(SERVER_URL + ENDPOINT_FETCH_DETAILS, json).then((res) => {
        if (res.data.Status === 0) {
          setError({});
          if (res.data?.WSDetails) {
            let websArr = [...res.data.WSDetails];
            let appName = [],
              methodName = [];
            websArr?.forEach((li) => {
              appName.push(li.AppName);
              methodName.push({
                methodName: li.MethodName,
                dataStructure: li.MethodDataStructure,
                param: li.MethodParam,
                returnType: li.ReturnType,
                appType: li.AppType,
                appName: li.AppName,
              });
            });
            setAppList(appName);
            setMethodList(methodName);
            setWebServiceObj({
              ...webServiceObj,
              webServiceName: appName[0],
              methodName: methodName[0],
            });
            setDetailsFetched(true);
          } else {
            dispatch(
              setToastDataFunc({
                message: `${t("requestedOperationFailed")}`,
                severity: "error",
                open: true,
              })
            );
          }
        } else {
          dispatch(
            setToastDataFunc({
              message: `${res.data.Message}`,
              severity: "error",
              open: true,
            })
          );
        }
      });
    }
  };

  return (
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
        idTag="webS_alias"
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
        idTag="webS_domain"
        onChange={onChange}
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
              value={option}
            >
              {option}
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
        id="webS_description"
      />
      <label
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.webSLabel
            : styles.webSLabel
        }
      >
        {t("WSDL_URL")}
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
      <div className="flex alignStart">
        <TextInput
          inputValue={webServiceObj?.wsdl_url}
          classTag={styles.webSInput}
          onChangeEvent={onChange}
          name="wsdl_url"
          idTag="webS_wsdl_url"
          regexStr={`\\?wsdl$`}
          readOnlyCondition={selected?.status !== STATE_CREATED}
          errorStatement={error?.wsdl_url?.statement}
          errorSeverity={error?.wsdl_url?.severity}
          errorType={error?.wsdl_url?.errorType}
          inlineError={true}
        />
        <button
          className={`${
            selected?.status !== STATE_CREATED
              ? styles.disabledBtn
              : styles.secondaryBtn
          } ${styles.mb1} ${styles.mlr1}`}
          onClick={fetchDetailsFunc}
          disabled={selected?.status !== STATE_CREATED}
          id={`webs_fetchDetails_${props.scope}`}
        >
          {t("fetchDetails")}
        </button>
      </div>
      <label
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.webSLabel
            : styles.webSLabel
        }
      >
        {t("webService")} {t("name")}
      </label>
      <Select
        className={`${!detailsFetched ? "webSSelect_disabled" : "webSSelect"} ${
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
        inputProps={{
          readOnly: !detailsFetched,
        }}
        style={{
          backgroundColor: !detailsFetched ? "#f8f8f8" : "#fff",
          cursor: !detailsFetched ? "default !important" : "pointer",
        }}
        name="webServiceName"
        value={webServiceObj.webServiceName}
        onChange={onChange}
        id="webS_webServiceName"
      >
        {appList.map((opt) => {
          return (
            <MenuItem
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.webSDropdownData
                  : styles.webSDropdownData
              }
              value={opt}
            >
              {opt}
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
        {t("method")} {t("name")}
      </label>
      <Select
        className={`${!detailsFetched ? "webSSelect_disabled" : "webSSelect"} ${
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
        inputProps={{
          readOnly: !detailsFetched,
        }}
        style={{
          backgroundColor: !detailsFetched ? "#f8f8f8" : "#fff",
          cursor: !detailsFetched ? "default !important" : "pointer",
        }}
        name="methodName"
        value={webServiceObj.methodName}
        onChange={onChange}
        id="webS_methodName"
      >
        {methodList
          ?.filter((el) => el.appName === webServiceObj.webServiceName)
          .map((opt1) => {
            return (
              <MenuItem
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.webSDropdownData
                    : styles.webSDropdownData
                }
                value={opt1}
              >
                {opt1.methodName}
              </MenuItem>
            );
          })}
      </Select>
    </div>
  );
}

export default SOAPDefinition;
