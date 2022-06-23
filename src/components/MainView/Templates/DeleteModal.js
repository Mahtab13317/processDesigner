import React from "react";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import styles from "./template.module.css";
import axios from "axios";
import arabicStyles from "./templateArabicStyles.module.css";
import {
  SERVER_URL,
  ENDPOINT_DELETE_CATEGORY,
  RTL_DIRECTION,
  ENDPOINT_DELETE_TEMPLATE,
} from "../../../Constants/appConstants";

function DeleteModal(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;

  const deleteFunc = () => {
    if (props.category) {
      let json = {
        categoryName: props.elemToBeDeleted.CategoryName,
        categoryId: props.elemToBeDeleted.CategoryId,
      };
      axios
        .post(SERVER_URL + ENDPOINT_DELETE_CATEGORY, json)
        .then((response) => {
          if (response.data.Status === 0) {
            let indexVal;
            let tempList = [...props.categoryList];
            tempList?.forEach((el, index) => {
              if (el.CategoryId === props.elemToBeDeleted.CategoryId) {
                indexVal = index;
              }
            });
            tempList.splice(indexVal, 1);
            props.setCategoryList(tempList);
            props.setModalClosed();
          }
        });
    } else {
      let json = {
        templateName: props.elemToBeDeleted.Name,
        categoryId: props.parentElem.CategoryId,
        templateId: props.elemToBeDeleted.Id,
      };
      axios
        .post(SERVER_URL + ENDPOINT_DELETE_TEMPLATE, json)
        .then((response) => {
          if (response.data.Status === 0) {
            let indexVal;
            let parentIndex;
            let tempList = [...props.categoryList];
            tempList?.forEach((category, p_index) => {
              if (category.CategoryId === props.parentElem.CategoryId) {
                category.Templates?.forEach((el, index) => {
                  if (el.Id === props.elemToBeDeleted.Id) {
                    parentIndex = p_index;
                    indexVal = index;
                  }
                });
              }
            });
            tempList[parentIndex].Templates.splice(indexVal, 1);
            props.setCategoryList(tempList);
            props.setModalClosed();
          }
        });
    }
  };

  const deleteModalHeading = () => {
    if (props.category) {
      return t("category");
    } else if (props.projectList) {
      return t("project");
    } else return t("s_template");
  };

  const deleteModalSubHeading = () => {
    if (props.category) {
      return t("Category");
    } else if (props.projectList) {
      return t("project");
    } else return t("Template");
  };

  const elementToBeDeleted = () => {
    if (props.category) {
      return props.elemToBeDeleted.CategoryName;
    } else if (props.projectList) {
      return props.processToDelete;
    } else return props.elemToBeDeleted.Name;
  };

  const noteElement = () => {
    if (props.category) {
      return t("categories");
    } else if (props.projectList) {
      return t("project");
    } else return t("templates");
  };

  return (
    <div>
      <p className={styles.deleteModalHeading}>
        {" "}
        {t("AreYouSureThatYouWantToDeleteThis")} {deleteModalHeading()} ?
      </p>
      <p className={styles.deleteModalSubHeading}>
        {deleteModalSubHeading()} :{" "}
        <span className={styles.deleteModalName}>{elementToBeDeleted()}</span>
      </p>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.errorMessage
            : styles.noteDiv
        }
      >
        {t("NOTE")} :{" "}
        {props.category
          ? t("categories") + " " + t("categoryDeletedMessage")
          : t("templates") + " " + t("onceDeletedCannotBeRecovered")}
      </div>
      <div className={styles.deleteModalButtonDiv}>
        <Button
          className={styles.cancelCategoryButton}
          onClick={props.setModalClosed}
        >
          {t("cancel")}
        </Button>
        <Button
          className={styles.addCategoryButton}
          onClick={() => {
            deleteFunc();
          }}
        >
          {t("delete")}
        </Button>
      </div>
    </div>
  );
}

export default DeleteModal;
