import React from "react";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import { useTranslation } from "react-i18next";
import { RTL_DIRECTION } from "../../Constants/appConstants";
import CloseIcon from "@material-ui/icons/Close";

function ObjectDependencies(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let { processAssociation, cancelFunc } = props;

  return (
    <div>
      <div className={styles.modalHeader}>
        <h3
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.modalHeading
              : styles.modalHeading
          }
        >
          {t("ObjectDependencies")}
        </h3>
        <CloseIcon onClick={cancelFunc} className={styles.closeIcon} />
      </div>
      <p className={styles.modalSubHeading}>{t("objectDependencyStmt")}</p>
      <div className={styles.webS_PA_table}>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.PA_tableHeader
              : styles.PA_tableHeader
          }
        >
          <span className={styles.nameDiv}>
            {t("Object")} {t("name")}
          </span>
          <span className={styles.typeDiv}>{t("type")}</span>
          <span className={styles.assocDiv}>{t("Association")}</span>
        </div>
        <div className={styles.PA_tableBody}>
          {processAssociation.map((item) => {
            return (
              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.PA_tableRow
                    : styles.PA_tableRow
                }
              >
                <span className={styles.nameDiv}>{item.ObjectTypeName}</span>
                <span className={styles.typeDiv}>{item.ObjectType}</span>
                <span className={styles.assocDiv}>{item.Assoc}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.modalFooter
            : styles.modalFooter
        }
      >
        <button
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.cancelButton
              : styles.cancelButton
          }
          onClick={cancelFunc}
        >
          {t("Close")}
        </button>
      </div>
    </div>
  );
}

export default ObjectDependencies;
