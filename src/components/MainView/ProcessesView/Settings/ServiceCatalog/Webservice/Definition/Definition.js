import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  GLOBAL_SCOPE,
  LOCAL_SCOPE,
  RTL_DIRECTION,
  STATE_CREATED,
  WEBSERVICE_REST,
  WEBSERVICE_SOAP,
} from "../../../../../../../Constants/appConstants";
import styles from "../index.module.css";
import arabicStyles from "../arabicStyles.module.css";
import { useTranslation } from "react-i18next";
import SOAPDefinition from "./SOAPDefinition";
import RESTDefinition from "./RESTDefinition";

function WebServiceDefinition(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let { selected, setChangedSelection, setSelected, error } = props;
  const [webServiceType, setWebServiceType] = useState(WEBSERVICE_SOAP);
  const readOnlyProcess = selected?.status !== STATE_CREATED;

  useEffect(() => {
    setChangedSelection((prev) => {
      let temp = { ...prev };
      temp.webserviceType = webServiceType;
      return temp;
    });
  }, [webServiceType]);

  useEffect(() => {
    if (selected) {
      setWebServiceType(selected.webserviceType);
    }
  }, [selected]);

  return (
    <div
      className={styles.webSDefinitionDiv}
      style={props.scope === LOCAL_SCOPE ? { height: "60vh" } : {}}
    >
      <label
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.webSHeadLabel
            : styles.webSHeadLabel
        }
      >
        <span>{t("Scope")}:</span>{" "}
        <span>{props.scope === GLOBAL_SCOPE ? t("global") : t("Local")}</span>
      </label>
      <label
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.webSLabel
            : styles.webSLabel
        }
      >
        {t("webService")} {t("type")}
      </label>
      <RadioGroup
        name="webserviceType"
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.webS_radioDiv
            : styles.webS_radioDiv
        }
        value={webServiceType}
        onChange={(e) => {
          setWebServiceType(e.target.value);
        }}
      >
        <FormControlLabel
          value={WEBSERVICE_SOAP}
          control={<Radio />}
          disabled={readOnlyProcess}
          label={t("SOAP")}
          id="webserviceType_SOAPOpt"
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.webS_radioButton
              : styles.webS_radioButton
          }
        />
        <FormControlLabel
          value={WEBSERVICE_REST}
          control={<Radio />}
          disabled={readOnlyProcess}
          label={t("RESTful")}
          id="webserviceType_RESTOpt"
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.webS_radioButton
              : styles.webS_radioButton
          }
        />
      </RadioGroup>
      {webServiceType === WEBSERVICE_SOAP ? (
        <SOAPDefinition
          selected={selected}
          setChangedSelection={setChangedSelection}
          setSelected={setSelected}
        />
      ) : (
        <RESTDefinition
          selected={selected}
          setChangedSelection={setChangedSelection}
          setSelected={setSelected}
          error={error}
        />
      )}
    </div>
  );
}

export default WebServiceDefinition;
