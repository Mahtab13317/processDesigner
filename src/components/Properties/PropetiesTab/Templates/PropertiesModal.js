import React from "react";
import styles from "./MappingModal/index.module.css";
import { useTranslation } from "react-i18next";
import TemplatePropertiesScreen from "./TemplateProperties";
import CloseIcon from "@material-ui/icons/Close";

function PropertiesModal(props) {
  let { t } = useTranslation();
  const { selectedTemplate, okFunc, cancelFunc } = props;

  return (
    <div>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalHeading}>
          {selectedTemplate.ProductName} - {t("Properties")}
        </h3>
        <CloseIcon onClick={cancelFunc} className={styles.closeIcon} />
      </div>
      <div className={styles.modalBody}>
        <TemplatePropertiesScreen selectedTemplate={selectedTemplate} />
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.okButton} onClick={okFunc}>
          {t("ok")}
        </button>
      </div>
    </div>
  );
}

export default PropertiesModal;
