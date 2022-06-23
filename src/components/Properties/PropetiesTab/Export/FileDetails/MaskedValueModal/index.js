import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { Checkbox } from "@material-ui/core";
import { useTranslation } from "react-i18next";

function MaskedValueModal(props) {
  let { t } = useTranslation();
  const { fields, handleClose, maskedValue, setMaskedValue } = props;
  const [selectAll, setSelectAll] = useState(false);
  const [checkedFields, setCheckedFields] = useState([]);

  // Function that runs when the component loads.
  useEffect(() => {
    const maskedValues = maskedValue && maskedValue.split(",");
    fields &&
      fields.forEach((element) => {
        const obj = {
          fieldName: element,
          isChecked: false,
        };
        checkedFields.push(obj);
      });
    let fieldsArray = checkedFields.filter((it, i, ar) => ar.indexOf(it) === i);
    maskedValues &&
      maskedValues.forEach((element) => {
        if (fields.includes(element) === true) {
          fieldsArray &&
            fieldsArray.forEach((fieldsElem) => {
              if (fieldsElem.fieldName === element) {
                fieldsElem.isChecked = true;
              }
            });
        }
      });
    setCheckedFields([...fieldsArray]);
  }, []);

  // Function that runs when the user changes the select all checkbox.
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    checkedFields.forEach((element) => (element.isChecked = !selectAll));
    setCheckedFields([...checkedFields]);
  };

  // Function that runs when the user changes the individual checkboxes for fields.
  const handleCheckboxChange = (index) => {
    checkedFields[index].isChecked = !checkedFields[index].isChecked;
    setCheckedFields([...checkedFields]);
    let flag = true;
    checkedFields &&
      checkedFields.forEach((element) => {
        if (element.isChecked === false) {
          flag = false;
        }
      });
    setSelectAll(flag);
  };

  // Function that runs when the user clicks on the ok button.
  const createMaskedValue = () => {
    let newString = "";
    checkedFields &&
      checkedFields.forEach((element, index) => {
        if (element.isChecked === true) {
          if (index < checkedFields.length - 1) {
            newString += element.fieldName + ",";
          } else {
            newString += element.fieldName;
          }
        }
      });
    setMaskedValue(newString);
    handleClose();
  };

  return (
    <div>
      <div className={styles.headingsDiv}>
        <p className={styles.heading}>{t("selectColumns")}</p>
      </div>
      <div className={styles.dataMainDiv}>
        <div className={styles.flexBox}>
          <Checkbox
            id="file_details_select_all_fields_checkbox"
            checked={selectAll}
            size="small"
            onChange={handleSelectAll}
          />
          <p className={styles.fieldName}>{t("fieldName")}</p>
        </div>
        <div className={styles.dataDiv}>
          {checkedFields &&
            checkedFields.map((d, index) => {
              return (
                <div className={styles.flexBox}>
                  <Checkbox
                    id="file_details_select_field_checkbox"
                    checked={d.isChecked}
                    size="small"
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <p className={styles.fieldName}> {d.fieldName}</p>
                </div>
              );
            })}
        </div>
      </div>
      <div className={styles.buttonsDiv}>
        <button
          id="file_details_save_mapping_button"
          onClick={createMaskedValue}
          className={styles.okButton}
        >
          <span className={styles.okButtonText}>{t("ok")}</span>
        </button>
        <button
          id="file_details_cancel_mapping_button"
          onClick={handleClose}
          className={styles.cancelButton}
        >
          <span className={styles.cancelButtonText}>{t("cancel")}</span>
        </button>
      </div>
    </div>
  );
}

export default MaskedValueModal;
