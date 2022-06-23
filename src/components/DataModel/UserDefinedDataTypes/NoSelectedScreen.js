import React from "react";
import { useTranslation } from "react-i18next";
import emptyStatePic from "../../../assets/ProcessView/EmptyState.svg";
import styles from "./index.module.css";

function NoSelectedScreen() {
  let { t } = useTranslation();

  return (
    <div className={styles.noSelectedDOScreen}>
      <img src={emptyStatePic} />
      <p className={styles.noDataObjAddedString}>{t("noDOSelected")}</p>
    </div>
  );
}

export default NoSelectedScreen;
