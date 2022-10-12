import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./FormAssociationType.module.css";

function FormAssociationType(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}​​​​​​​​`;
  const { formAssociationType } = props;
  const [selectedFormAssoc, setselectedFormAssoc] =
    useState(formAssociationType);
  useEffect(() => {
    props.getFormAssociationType(selectedFormAssoc);
  }, [selectedFormAssoc]);

  return (
    <div
      id="formScreen"
      className={styles.mainDiv}
      style={{ direction: direction }}
    >
      <div
        className={styles.box}
        style={{
          border:
            selectedFormAssoc === "single"
              ? "2px solid var(--link_color)"
              : "1px solid #DBDBDB",
          direction: direction,
        }}
        onClick={() => setselectedFormAssoc("single")}
      >
        <p className={styles.formLabel}>
          {t("Single form for complete process")}
        </p>
        <p className={styles.desc}>{t("singleFormDesc")}</p>
      </div>
      <div
        className={styles.box}
        style={{
          border:
            selectedFormAssoc === "multiple"
              ? "2px solid var(--link_color)"
              : "1px solid #DBDBDB",
        }}
        onClick={() => setselectedFormAssoc("multiple")}
      >
        <p className={styles.formLabel}>
          {t("Workstep wise Form Association")}
        </p>
        <p className={styles.desc}>{t("multipleFormDesc")}</p>
      </div>
    </div>
  );
}

export default FormAssociationType;
