import React, { useState, useEffect } from "react";
import Tab from "../../../../../UI/Tab/Tab";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import "./index.css";
import Webservice from "./Webservice";
import { GLOBAL_SCOPE } from "../../../../../Constants/appConstants";
import External from "../../../../ServiceCatalog/External";

function ServiceCatalog() {
  let { t } = useTranslation();
  const mainTabElements = [
    <Webservice scope={GLOBAL_SCOPE} />,
    <External scope={GLOBAL_SCOPE} />,
  ];
  const mainTabLabels = [t("webService"), t("catalog")];

  return (
    <div className={styles.mainDiv}>
      <Tab
        tabType={`${styles.mainTab} mainTab_sc`}
        tabBarStyle={styles.mainTabBarStyle}
        oneTabStyle={styles.mainOneTabStyle}
        TabNames={mainTabLabels}
        TabElement={mainTabElements}
      />
    </div>
  );
}

export default ServiceCatalog;
