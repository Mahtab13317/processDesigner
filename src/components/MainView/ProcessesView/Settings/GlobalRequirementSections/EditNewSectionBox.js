import { Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../Templates/template.module.css";
import arabicStyles from "../../..//Templates/templateArabicStyles.module.css";
import { RTL_DIRECTION } from "../../../../../Constants/appConstants";

function EditSectionBox(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [newSection, setnewSection] = useState({});
  const [sectionName, setsectionName] = useState("");
  const [desc, setdesc] = useState(null);

  const cancelButtonClick = () => {
    props.cancelCallBack();
  };

  const editSave = () => {
    props.editMapToData(newSection);
    cancelButtonClick();
  };

  useEffect(() => {
    setnewSection({
      OrderId: props.sectionToEdit.OrderId,
      SectionName:
        sectionName.trim() !== ""
          ? sectionName
          : props.sectionToEdit.SectionName,
      Description: desc !== null ? desc : props.sectionToEdit.Description,
    });
  }, [
    desc,
    props.OrderId,
    props.sectionToEdit.Description,
    props.sectionToEdit.OrderId,
    props.sectionToEdit.SectionName,
    sectionName,
  ]);

  useEffect(() => {
    setsectionName(props.sectionToEdit.SectionName);
    setdesc(props.sectionToEdit.Description);
  }, [props.sectionToEdit.Description, props.sectionToEdit.SectionName]);

  return (
    <div>
      <p
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.addCategoryHeading
            : styles.addCategoryHeading
        }
      >
        {t("edit")} {t("section")}
      </p>
      <div>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.labelHeading
              : styles.labelHeading
          }
        >
          {t("section")} {t("name")}
          <span className={styles.starIcon}>*</span>
        </p>
        <input
          id="edit_sectionName"
          onChange={(e) => setsectionName(e.target.value)}
          value={sectionName}
          maxLength={255}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.nameInput
              : styles.nameInput
          }
        />
      </div>
      <div>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.labelHeading
              : styles.labelHeading
          }
        >
          {t("Discription")}
        </p>
        <textarea
          id="add_sectionDesc"
          value={desc}
          maxLength={255}
          onChange={(e) => setdesc(e.target.value)}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.descInput
              : styles.descInput
          }
        />
      </div>
      <div className={styles.buttonDiv}>
        <Button
          className={styles.cancelCategoryButton}
          onClick={cancelButtonClick}
        >
          {t("cancel")}
        </Button>
        <Button
          className={
            sectionName.trim() === "" ||
            !sectionName ||
            sectionName === props.sectionToEdit.SectionName
              ? styles.disabledCategoryButton
              : styles.addCategoryButton
          }
          onClick={editSave}
          disabled={
            sectionName.trim() === "" ||
            !sectionName ||
            sectionName === props.sectionToEdit.SectionName
          }
        >
          {t("save")}
        </Button>
      </div>
    </div>
  );
}

export default EditSectionBox;
