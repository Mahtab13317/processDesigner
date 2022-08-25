import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import styles from "./template.module.css";
import {
  BTN_TYPE_ADD_ANOTHER,
  BTN_TYPE_ADD_CLOSE,
  BTN_TYPE_EDIT_CLOSE,
} from "../../../Constants/appConstants";
import {
  SERVER_URL,
  ENDPOINT_ADD_CATEGORY,
  ENDPOINT_EDIT_CATEGORY,
  RTL_DIRECTION,
} from "../../../Constants/appConstants";
import axios from "axios";
import arabicStyles from "./templateArabicStyles.module.css";

function AddCategoryModal(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const addCategoryFunc = (type) => {
    let maxId = 0;
    let categoryNameArr = [];
    props.categoryList?.forEach((category) => {
      if (category.CategoryId > maxId) {
        maxId = category.CategoryId;
      }
      categoryNameArr.push(category.CategoryName.toLowerCase());
    });
    if (categoryNameArr.includes(nameInput.toLowerCase())) {
      setErrorMessage(
        `This category name is already taken. Please choose another name.`
      );
    } else {
      if (type === BTN_TYPE_EDIT_CLOSE) {
        let editCategoryJSON = {
          categoryName: nameInput,
          categoryId: props.categoryToBeEdited.CategoryId,
          description: descriptionInput,
        };
        axios
          .post(SERVER_URL + ENDPOINT_EDIT_CATEGORY, editCategoryJSON)
          .then((response) => {
            if (response.data.Status === 0) {
              let tempList = [...props.categoryList];
              tempList?.forEach((category) => {
                if (
                  category.CategoryId === props.categoryToBeEdited.CategoryId
                ) {
                  category.CategoryName = nameInput;
                  category.Description = descriptionInput;
                }
              });
              props.setCategoryList(tempList);
              props.setModalClosed();
            }
          });
      } else {
        let addCategoryJSON = {
          categoryName: nameInput,
          categoryId: +maxId + 1,
          description: descriptionInput,
        };
        axios
          .post(SERVER_URL + ENDPOINT_ADD_CATEGORY, addCategoryJSON)
          .then((response) => {
            if (response.data.Status === 0) {
              let tempList = [...props.categoryList];
              tempList?.push({
                CategoryId: maxId + 1,
                CategoryName: nameInput,
                // code edited on 20 June 2022 for BugId 110848
                Description: descriptionInput,
                Templates: [],
              });
              props.setCategoryList(tempList);
              if (type === BTN_TYPE_ADD_ANOTHER) {
                setNameInput("");
                setDescriptionInput("");
              } else if (type === BTN_TYPE_ADD_CLOSE) {
                props.setModalClosed();
              }
            }
          });
      }
    }
  };

  useEffect(() => {
    if (props.categoryToBeEdited) {
      setNameInput(props.categoryToBeEdited.CategoryName);
      setDescriptionInput(props.categoryToBeEdited.Description);
    }
  }, [props.categoryToBeEdited]);

  return (
    <div>
      <p
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.addCategoryHeading
            : styles.addCategoryHeading
        }
      >
        {props.categoryToBeEdited ? t("edit") : t("add")} {t("Category")}
      </p>
      <div>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.labelHeading
              : styles.labelHeading
          }
        >
          {t("Category")} {t("Name")}
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
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.descInput
              : styles.descInput
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
        {props.categoryToBeEdited ? (
          <Button
            className={
              nameInput.trim() === "" ||
              !nameInput ||
              errorMessage ||
              (nameInput === props.categoryToBeEdited.CategoryName &&
                descriptionInput === props.categoryToBeEdited.Description)
                ? styles.disabledCategoryButton
                : styles.addCategoryButton
            }
            onClick={() => {
              addCategoryFunc(BTN_TYPE_EDIT_CLOSE);
            }}
            disabled={
              nameInput.trim() === "" ||
              !nameInput ||
              errorMessage ||
              (nameInput === props.categoryToBeEdited.CategoryName &&
                descriptionInput === props.categoryToBeEdited.Description)
            }
          >
            {t("save")} {t("changes")}
          </Button>
        ) : (
          <React.Fragment>
            <Button
              className={
                nameInput.trim() === "" || !nameInput || errorMessage
                  ? styles.disabledCategoryButton
                  : styles.addCategoryButton
              }
              onClick={() => {
                addCategoryFunc(BTN_TYPE_ADD_ANOTHER);
              }}
              disabled={nameInput.trim() === "" || !nameInput || errorMessage}
            >
              {t("addAnother")}
            </Button>
            <Button
              className={
                nameInput.trim() === "" || !nameInput || errorMessage
                  ? styles.disabledCategoryButton
                  : styles.addCategoryButton
              }
              onClick={() => {
                addCategoryFunc(BTN_TYPE_ADD_CLOSE);
              }}
              disabled={nameInput.trim() === "" || !nameInput || errorMessage}
            >
              {t("add&Close")}
            </Button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default AddCategoryModal;
