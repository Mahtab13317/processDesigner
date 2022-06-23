import React, { useState } from "react";
import styles from "./index.module.css";
import { RTL_DIRECTION } from "../../../Constants/appConstants";
import arabicStyles from "./ArabicStyles.module.css";
import SystemDefined from "./SystemDefined";
import UserDefined from "./UserDefined";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Tab, Tabs } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { TabPanel } from "../../ProcessSettings";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";

function QueueVariables(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [value, setValue] = useState(0);

  // Function to handle tab change.
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={styles.mainDiv}>
      <div className={styles.headingsDiv}>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.headerLogo
              : styles.headerLogo
          }
        ></div>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.queueVariableHeading
              : styles.queueVariableHeading
          }
        >
          {t("queueVariables")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.queueVariableSubHeading
              : styles.queueVariableSubHeading
          }
        >
          {t("queueSubHeading")}
        </p>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.buttonsDiv
              : styles.buttonsDiv
          }
        >
          <button className={styles.exportDefinitionButton}>
            <div className={styles.buttonContent}>
              <GetAppIcon fontSize="small" />
              <p className={styles.exportDefinitionButtonText}>
                {t("exportDefinition")}
              </p>
            </div>
          </button>
          <button className={styles.auditHistoryButton}>
            <div className={styles.buttonContent}>
              <DescriptionOutlinedIcon fontSize="small" />
              <p className={styles.auditButtonText}>{t("auditHistory")}</p>
            </div>
          </button>
          <button className={styles.erDiagramButton}>
            <div className={styles.buttonContent}>
              <AccountTreeIcon fontSize="small" />
              <p className={styles.erDiagramButtonText}>{t("erDiagram")}</p>
            </div>
          </button>
          <div className={styles.moreOptionsIcon}>
            <MoreHorizOutlinedIcon />
          </div>
        </div>
      </div>
      <div className="queueTabStyles">
        <Tabs value={value} onChange={handleChange}>
          <Tab icon={<PersonOutlineOutlinedIcon />} label={t("userDefined")} />
          <Tab
            icon={<PersonOutlineOutlinedIcon />}
            label={t("systemDefined")}
          />
          <Tab
            icon={<PersonOutlineOutlinedIcon />}
            label={t("complexVariables")}
          />
        </Tabs>
      </div>
      <div>
        <TabPanel value={value} index={0}>
          <UserDefined />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SystemDefined />
        </TabPanel>
        <TabPanel
          style={{ padding: "0.625rem", backgroundColor: "#F8F8F8" }}
          value={value}
          index={2}
        >
          Complex Variables to be painted here.
        </TabPanel>
      </div>
    </div>
  );
}

export default QueueVariables;
