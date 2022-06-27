import React from "react";
import styles from "../Templates/MappingModal/index.module.css";
import arabicStyles from "../Templates/MappingModal/arabicStyles.module.css";
import { useTranslation } from "react-i18next";
import "../Templates/MappingModal/index.css";
import CloseIcon from "@material-ui/icons/Close";
import ServiceCatalog from "../../../ServiceCatalog";
import { RTL_DIRECTION } from "../../../../Constants/appConstants";

function CatalogScreenModal(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;

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
          {t("navigationPanel.serviceCatelog")}
        </h3>
        <CloseIcon onClick={props.closeFunc} className={styles.closeIcon} />
      </div>
      <div>
        <ServiceCatalog callLocation="webServicePropTab" />
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
          onClick={props.closeFunc}
        >
          {t("cancel")}
        </button>
        <button className={styles.okButton} onClick={props.closeFunc}>
          {t("Proceed")}
        </button>
      </div>
    </div>
  );
}

export default CatalogScreenModal;
