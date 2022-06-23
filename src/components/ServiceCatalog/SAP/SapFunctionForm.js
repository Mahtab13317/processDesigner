import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import { useTranslation } from "react-i18next";
import { Checkbox, MenuItem, Select } from "@material-ui/core";
import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
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
} from "../../../Constants/appConstants";

import axios from "axios";
import { useDispatch } from "react-redux";
import { validateRegex } from "../../../validators/validator";
import { setToastDataFunc } from "../../../redux-store/slices/ToastDataHandlerSlice";
import TextInput from "../../../UI/Components_With_ErrrorHandling/InputField";
import Modal from "../../../UI/Modal/Modal";
import SapFunctionModal from "./SapFunctionModal";

function SapFunctionForm(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const {
    selected,
    setChangedSelection,
    setSelected,
    selectedConfig,
    configList,
    changedSelection,
  } = props;

  console.log("selection function", { props });
  const [sapConfigObj, setsapConfigObj] = useState({
    configuration: "",
    iConfigurationId: "",
    hostName: "",
    clientName: "",
    userName: "",
    password: "",
    language: "",
    instanceNo: "",
    functionName: "",
    rfchostNameRequired: false,
    rfcHostname: "",
  });
  const [detailsFetched, setDetailsFetched] = useState(false);
  const [appList, setAppList] = useState([]);
  const [methodList, setMethodList] = useState([]);
  const [error, setError] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [configDrop, setConfigDrop] = useState([]);
  const [rfcCheck, setRfcCheck] = useState(false);

  useEffect(() => {
    if (selected) {
      setDetailsFetched(false);
      if (selected.status === STATE_ADDED) {
        setsapConfigObj({
          configuration: selectedConfig?.ConfigName,
          iConfigurationId: selectedConfig?.iConfigurationId,
          hostName: selectedConfig?.SAPHostName,
          clientName: selectedConfig?.SAPClient,
          username: selectedConfig?.SAPUserName,
          password: "",
          language: selectedConfig?.SAPLanguage,
          instanceNo: selectedConfig?.SAPInstance,
          functionName: selected?.FunctionName,
          rfchostNameRequired: selectedConfig?.rfchostNameRequired,
          rfcHostname: selectedConfig?.RFCHostName,
        });
        if (sapConfigObj?.rfcHostname != "") {
          setRfcCheck(true);
        }
      } else if (selected.status === STATE_CREATED) {
        setAppList([]);
        setMethodList([]);
        setsapConfigObj({
          configuration: "",
          hostName: "",
          clientName: "",
          username: "",
          password: "",
          language: "",
          instanceNo: "",
          functionName: "",
          protocol: "",
          itsServer: "",
          rfcHostname: "",
        });
      }
    }
    setConfigDrop(configList);
  }, [selected, configList]);

  useEffect(() => {
    setChangedSelection((prev) => {
      let temp = { ...prev };
      temp = { ...temp, ...sapConfigObj };
      return temp;
    });
  }, [sapConfigObj]);

  const onChange = (e) => {
    let tempSapConfig = { ...sapConfigObj };
    tempSapConfig[e.target.name] = e.target.value;
    setsapConfigObj(tempSapConfig);
    if (selected?.status === STATE_ADDED) {
      setSelected((prev) => {
        let temp = { ...prev };
        temp.status = STATE_EDITED;
        return temp;
      });
    }
  };
  const goHandler = () => {
    setShowModal(true);
  };

  const changeRFC = (e) => {
    setRfcCheck(e.target.checked);
  };

  const getConfig = (e) => {
    let tempSapConfig = { ...sapConfigObj };

    const newList = configList.filter(
      (item) => item.ConfigName === e.target.value
    );

    setsapConfigObj({
      configuration: newList[0]?.ConfigName,
      iConfigurationId: newList[0]?.SAPConfigId,
      hostName: newList[0]?.SAPHostName,
      clientName: newList[0]?.SAPClient,
      username: newList[0]?.SAPUserName,
      password: "",
      language: newList[0]?.SAPLanguage,
      instanceNo: newList[0]?.SAPInstance,
      functionName: "",
      protocol: newList[0]?.SAPProtocol,
      itsServer: newList[0]?.SAPServer,
      rfcHostname: newList[0]?.RFCHostName,
    });
    if (newList[0].RFCHostName != "") {
      setRfcCheck(true);
    }
  };

  const setFunction = (val) => {
    setsapConfigObj({ ...sapConfigObj, functionName: val });
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
      <label
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.webSLabel
            : styles.webSLabel
        }
      >
        {t("sapConfig")}
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
        name="configuration"
        value={sapConfigObj?.configuration}
        idTag="webS_configuration"
        onChange={getConfig}
        disabled={selected?.status == STATE_ADDED ? true : false}
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
        {configDrop?.map((option) => {
          return (
            <MenuItem
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.webSDropdownData
                  : styles.webSDropdownData
              }
              value={option.ConfigName}
            >
              {option.ConfigName}
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
        {t("sapHostName")}
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
        inputValue={sapConfigObj?.hostName}
        classTag={styles.webSInput}
        onChangeEvent={onChange}
        name="hostName"
        idTag="Sap_hostName"
        readOnlyCondition={selected.status == STATE_ADDED ? true : false}
      />

      <div
        className={direction === RTL_DIRECTION ? arabicStyles.rfc : styles.rfc}
      >
        <FormControlLabel
          control={
            <Checkbox
              name="RFC"
              id="isRFCCheck"
              color="primary"
              checked={rfcCheck}
              onChange={changeRFC}
            />
          }
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.rfcCheckbox
              : styles.rfcCheckbox
          }
          label={t("toolbox.serviceCatalogSap.rfcHostname")}
          disabled={selected.status == STATE_ADDED ? true : false}
        />

        {rfcCheck ? (
          <TextInput
            classTag={styles.webSInput}
            name="rfcHostname"
            idTag="rfcHost"
            onChangeEvent={onChange}
            inputValue={sapConfigObj?.rfcHostname}
            readOnlyCondition={selected.status == STATE_ADDED ? true : false}
          />
        ) : (
          ""
        )}
      </div>

      <label
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.webSLabel
            : styles.webSLabel
        }
      >
        {t("sapClientName")}
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
        inputValue={sapConfigObj?.clientName}
        classTag={styles.webSInput}
        onChangeEvent={onChange}
        name="clientName"
        idTag="Sap_clientName"
        readOnlyCondition={selected.status == STATE_ADDED ? true : false}
      />

      <label
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.webSLabel
            : styles.webSLabel
        }
      >
        {t("sapUserName")}
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
        inputValue={sapConfigObj?.username}
        classTag={styles.webSInput}
        onChangeEvent={onChange}
        name="username"
        idTag="Sap_userName"
        readOnlyCondition={selected.status == STATE_ADDED ? true : false}
      />

      <label
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.webSLabel
            : styles.webSLabel
        }
      >
        {t("sapPassword")}
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
        inputValue={sapConfigObj?.password}
        classTag={styles.webSInput}
        onChangeEvent={onChange}
        name="password"
        type="password"
        idTag="Sap_password"
        readOnlyCondition={selected.status == STATE_ADDED ? true : false}
      />
      <div className="row">
        <div>
          <label
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webSLabel
                : styles.webSLabel
            }
          >
            {t("language")}
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
            inputValue={sapConfigObj?.language}
            classTag={styles.webSInputInstance}
            onChangeEvent={onChange}
            name="language"
            idTag="Sap_language"
            readOnlyCondition={selected.status == STATE_ADDED ? true : false}
          />
        </div>

        <div style={{ marginLeft: "1rem" }}>
          <label
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webSLabel
                : styles.webSLabel
            }
          >
            {t("instanceNumber")}
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
            inputValue={sapConfigObj?.instanceNo}
            classTag={styles.webSInputInstance}
            onChangeEvent={onChange}
            name="instanceNo"
            idTag="Sap_instanceNo"
            readOnlyCondition={selected.status == STATE_ADDED ? true : false}
          />
        </div>
      </div>

      <div className="row">
        <div>
          <label
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webSLabel
                : styles.webSLabel
            }
          >
            {t("Function")}
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
            inputValue={sapConfigObj?.functionName}
            classTag={styles.webSInput}
            onChangeEvent={onChange}
            name="functionName"
            idTag="Sap_functionName"
            readOnlyCondition={selected.status == STATE_ADDED ? true : false}
          />
        </div>
        <div style={{ marginLeft: "1rem" }}>
          <button
            className={`${styles.primaryBtn} ${styles.pd025}`}
            onClick={goHandler}
            disabled={selected.status == STATE_ADDED ? true : false}
          >
            {t("Go")}
          </button>
        </div>
      </div>
      {showModal && (
        <Modal
          show={showModal}
          style={{
            width: "28vw",
            height: "44vh",
            left: "35%",
            top: "30%",
            padding: "0.5%",
          }}
          modalClosed={() => setShowModal(false)}
          children={
            <SapFunctionModal
              setShowModal={setShowModal}
              changedSelection={changedSelection}
              functionName={setFunction}
            />
          }
        />
      )}
    </div>
  );
}

export default SapFunctionForm;
