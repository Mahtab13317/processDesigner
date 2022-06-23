import React from "react";
import { useTranslation } from "react-i18next";
import emptyStatePic from "../../../assets/ProcessView/EmptyState.svg";
import styles from "./trigger.module.css";

function NoSelectedTriggerScreen() {
  let { t } = useTranslation();

  return (
    <div className={styles.noSelectedTriggerScreen}>
      <img src={emptyStatePic} />
      <p className={styles.notriggerAddedString}>{t("noTriggerSelected")}</p>
    </div>
  );
}

export default NoSelectedTriggerScreen;
