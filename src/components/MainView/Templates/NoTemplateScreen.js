import React from "react";
import { useTranslation } from "react-i18next";
import emptyStatePic from "../../../assets/ProcessView/EmptyState.svg";
import styles from "./template.module.css";

function NoTemplateScreen() {
  let { t } = useTranslation();

  return (
    <div className={styles.noSelectedCategoryScreen}>
      <img src={emptyStatePic} />
      <p className={styles.noSelectedCategoryString}>
        {t("noTemplateScreen")}
      </p>
    </div>
  );
}

export default NoTemplateScreen;
