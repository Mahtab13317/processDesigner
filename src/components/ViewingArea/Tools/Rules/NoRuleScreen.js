import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import emptyStatePic from "../../../../assets/ProcessView/EmptyState.svg";
import styles from "./rule.module.css";
import { Button } from "@material-ui/core";
import { PROCESSTYPE_LOCAL } from "../../../../Constants/appConstants";

function NoRuleScreen(props) {
  let { t } = useTranslation();
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    if (props.processType === PROCESSTYPE_LOCAL) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [props.processType]);

  return (
    <div className={styles.noRuleScreen}>
      <img src={emptyStatePic} />
      <p className={styles.noRuleAddedString}>{t("noRuleAdded")}</p>

      {isDisable ? (
        <Button
          className={styles.addRuleButton}
          onClick={() => props.handleScreen()}
        >
          {t("add") + " " + t("rule")}
        </Button>
      ) : null}
    </div>
  );
}

export default NoRuleScreen;
