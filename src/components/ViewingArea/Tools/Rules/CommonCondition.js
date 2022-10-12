import React, { useState, useEffect } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useTranslation } from "react-i18next";
import styles from "./rule.module.css";
import { PROCESSTYPE_LOCAL } from "../../../../Constants/appConstants";

function CommonCondition(props) {
  let { t } = useTranslation();
  const [isDisable, setIsDisable] = useState(false);
  const {
    rulesSelected,
    deleteRule,
    selected,
    updateRule,
    addClickRule,
    optionSelector,
    selectCon,
    cancelRule,
  } = props;

  useEffect(() => {
    if (props.openProcessType !== PROCESSTYPE_LOCAL) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [props.openProcessType]);
  return (
    <div style={{marginLeft:'15px'}}>
      <div className="row">
        <p className={styles.mainHeading}>{t("rulesCondition")}</p>
        <div style={{ marginLeft: "auto" }}>
          {rulesSelected && rulesSelected.Desc == t("newRule") ? (
            <button
              // className={styles.cancelHeaderBtn}
              className="tertiary"
              onClick={() => cancelRule(selected)}
              style={{
                display: isDisable ? "none" : "",
              }}
              id="cancelRule"
            >
              {t("cancel")}
            </button>
          ) : (
            <button
              className={styles.cancelHeaderBtn}
              onClick={() => deleteRule(selected)}
              style={{
                display: isDisable ? "none" : "",
              }}
              id="deleteRule"
            >
              {t("delete")}
            </button>
          )}

          {rulesSelected && rulesSelected.Desc == t("newRule") ? (
            <button
              className={styles.addHeaderBtn}
              onClick={addClickRule}
              style={{
                display: isDisable ? "none" : "",
              }}
              id="addRule"
            >
              {t("addRule")}
            </button>
          ) : (
            <button
              className={styles.addHeaderBtn}
              onClick={updateRule}
              style={{
                display: isDisable ? "none" : "",
              }}
              id="updateRule"
            >
              {t("modify")}
            </button>
          )}
        </div>
      </div>

      <RadioGroup
        onChange={optionSelector}
        value={selectCon}
        className={styles.radiobtn}
        id="ruleCondition"
      >
        <FormControlLabel
          value={t("always")}
          control={<Radio />}
          label={t("always")}
        />

        <FormControlLabel value={t("if")} control={<Radio />} label={t("if")} />
      </RadioGroup>
    </div>
  );
}

export default CommonCondition;
