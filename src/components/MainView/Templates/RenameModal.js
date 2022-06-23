import React, { useState } from "react";
import StarRateIcon from "@material-ui/icons/StarRate";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import styles from "./template.module.css";
import {
  SERVER_URL,
  ENDPOINT_EDIT_CATEGORY,
  RTL_DIRECTION,
} from "../../../Constants/appConstants";
import axios from "axios";
import arabicStyles from "./templateArabicStyles.module.css";

function RenameModal(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [nameInput, setNameInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const renameFunc = () => {
    let categoryNameArr = [];
    props.categoryList?.forEach((category) => {
      categoryNameArr.push(category.CategoryName.toLowerCase());
    });
    if (categoryNameArr.includes(nameInput.toLowerCase())) {
      setErrorMessage(
        `This category name is already taken. Please choose another name.`
      );
    } else {
      let editCategoryJSON = {
        categoryName: nameInput,
        categoryId: props.elemToBeDeleted.CategoryId,
        description: props.elemToBeDeleted.Description,
      };
      axios
        .post(SERVER_URL + ENDPOINT_EDIT_CATEGORY, editCategoryJSON)
        .then((response) => {
          if (response.data.Status === 0) {
            let tempList = [...props.categoryList];
            tempList?.forEach((category) => {
              if (category.CategoryId === props.elemToBeDeleted.CategoryId) {
                category.CategoryName = nameInput;
              }
            });
            props.setCategoryList(tempList);
            props.setModalClosed();
          }
        });
    }
  };

  const elementToRename = () => {
    if (props.category) {
      return t("Category");
    } else if (props.projectList) {
      return t("project");
    } else return t("Template");
  };
  return (
    <div>
      <p
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.addCategoryHeading
            : styles.addCategoryHeading
        }
      >
        {t("Rename")} {elementToRename()}
      </p>
      <div className="flex">
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.newNameHeading
              : styles.newNameHeading
          }
        >
          {t("New")} {t("Name")}
          <span className={styles.starIcon}>*</span>
        </p>
        <input
          value={nameInput}
          onChange={(e) => {
            setNameInput(e.target.value);
            setErrorMessage("");
          }}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.newNameInput
              : styles.newNameInput
          }
        />
      </div>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.errorMessage
            : styles.errorMessage
        }
      >
        {errorMessage}
      </div>
      <div className={styles.buttonDiv}>
        <Button
          className={styles.cancelCategoryButton}
          onClick={props.setModalClosed}
        >
          {t("cancel")}
        </Button>
        <Button
          className={
            nameInput.trim() === "" || !nameInput || errorMessage
              ? styles.disabledCategoryButton
              : styles.addCategoryButton
          }
          onClick={() => {
            renameFunc();
          }}
          disabled={nameInput.trim() === "" || !nameInput || errorMessage}
        >
          {t("Rename")}
        </Button>
      </div>
    </div>
  );
}

export default RenameModal;
