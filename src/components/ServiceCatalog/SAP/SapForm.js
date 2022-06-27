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

function SapForm(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  let { selected, setChangedSelection, setSelected } = props;

  const [sapConfigObj, setsapConfigObj] = useState({
    configuration: "",
    hostName: "",
    clientName: "",
    username: "",
    password: "",
    language: "",
    instanceNo: "",
    httpPort: "",
    protocol: "",
    itsServer: "",
    rfchostNameRequired: rfcCheck,
    rfcHostname: "",
  });
  const [detailsFetched, setDetailsFetched] = useState(false);
  const [appList, setAppList] = useState([]);
  const [methodList, setMethodList] = useState([]);
  const [error, setError] = useState({});
  const [rfcCheck, setRfcCheck] = useState(false);

  useEffect(() => {
    if (selected) {
      setDetailsFetched(false);
      if (selected.status === STATE_ADDED) {
        setsapConfigObj({
          configuration: selected.configurationName,
          hostName: selected.saphostName,
          clientName: selected.sapclient,
          username: selected.sapuserName,
          password: "",
          language: selected.saplanguage,
          instanceNo: selected.sapinstanceNo,
          httpPort: selected.saphttpport,
          protocol: selected.sapprotocol,
          itsServer: selected.sapitsserver,
          rfchostNameRequired: selected.rfchostNameRequired,
          rfcHostname: selected.rfchostName,
        });

        if (selected.rfchostName != "") {
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
          httpPort: "",
          protocol: "",
          itsServer: "",
          rfchostNameRequired: rfcCheck,
          rfcHostname: "",
        });
      }
    }
  }, [selected]);

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
    tempSapConfig.rfchostNameRequired = rfcCheck;
    setsapConfigObj(tempSapConfig);
    if (selected?.status === STATE_ADDED) {
      setSelected((prev) => {
        let temp = { ...prev };
        temp.status = STATE_EDITED;
        return temp;
      });
    }
  };

  const changeRFC = (e) => {
    setRfcCheck(e.target.checked);
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
      <TextInput
        inputValue={sapConfigObj?.configuration}
        classTag={styles.webSInput}
        onChangeEvent={onChange}
        name="configuration"
        idTag="Sap_configuration"
        readOnlyCondition={selected?.status == STATE_ADDED ? true : false}
      />

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
        readOnlyCondition={selected?.status == STATE_ADDED ? true : false}
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
              onChange={changeRFC}
              checked={rfcCheck}
            />
          }
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.rfcCheckbox
              : styles.rfcCheckbox
          }
          label={t("toolbox.serviceCatalogSap.rfcHostname")}
          disabled={selected?.status == STATE_ADDED ? true : false}
        />

        {rfcCheck ? (
          <TextInput
            classTag={styles.webSInput}
            name="rfcHostname"
            idTag="rfcHost"
            inputValue={sapConfigObj?.rfcHostname}
            onChangeEvent={onChange}
            readOnlyCondition={selected?.status == STATE_ADDED ? true : false}
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
        readOnlyCondition={selected?.status == STATE_ADDED ? true : false}
      />

      <label
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.webSLabel
            : styles.webSLabel
        }
      >
        {t("sapUsername")}
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
        inputValue={sapConfigObj?.userName}
        classTag={styles.webSInput}
        onChangeEvent={onChange}
        name="userName"
        idTag="Sap_userName"
        readOnlyCondition={selected?.status == STATE_ADDED ? true : false}
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
        idTag="Sap_password"
        readOnlyCondition={selected?.status == STATE_ADDED ? true : false}
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
            readOnlyCondition={selected?.status == STATE_ADDED ? true : false}
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
            readOnlyCondition={selected?.status == STATE_ADDED ? true : false}
          />
        </div>
      </div>

      <label
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.webSLabel
            : styles.webSLabel
        }
      >
        {t("httpPort")}
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
        inputValue={sapConfigObj?.httpPort}
        classTag={styles.webSInput}
        onChangeEvent={onChange}
        name="httpPort"
        idTag="Sap_httpPort"
        readOnlyCondition={selected?.status == STATE_ADDED ? true : false}
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
            {t("sapProtocol")}
          </label>

          <RadioGroup
            name="protocol"
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webS_radioDiv
                : styles.webS_radioDiv
            }
            value={sapConfigObj?.protocol}
            onChange={onChange}
          >
            <FormControlLabel
              value={"HTTP"}
              control={<Radio />}
              label={t("HTTP")}
              id="webS_ManualOpt"
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.webS_radioButton
                  : styles.webS_radioButton
              }
              disabled={selected?.status == STATE_ADDED ? true : false}
            />
            <FormControlLabel
              value={"HTTPS"}
              control={<Radio />}
              label={t("HTTPS")}
              id="webS_LoadOpt"
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.webS_radioButton
                  : styles.webS_radioButton
              }
              disabled={selected?.status == STATE_ADDED ? true : false}
            />
          </RadioGroup>
        </div>
        <div style={{ marginLeft: "3rem" }}>
          <label
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webSLabel
                : styles.webSLabel
            }
          >
            {t("sapItsServer")}
          </label>

          <RadioGroup
            name="itsServer"
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webS_radioDiv
                : styles.webS_radioDiv
            }
            value={sapConfigObj?.itsServer}
            onChange={onChange}
          >
            <FormControlLabel
              value={"E"}
              control={<Radio />}
              label={t("Embedded")}
              id="webS_ManualOpt"
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.webS_radioButton
                  : styles.webS_radioButton
              }
              disabled={selected?.status == STATE_ADDED ? true : false}
            />
            <FormControlLabel
              value={"S"}
              control={<Radio />}
              label={t("Standalone")}
              id="webS_LoadOpt"
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.webS_radioButton
                  : styles.webS_radioButton
              }
              disabled={selected?.status == STATE_ADDED ? true : false}
            />
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}

export default SapForm;
