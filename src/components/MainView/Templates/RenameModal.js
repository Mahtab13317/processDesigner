// Changes made to solve Bug with ID = 110141 => Project rename button is not working
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
import { setProjectCreation } from "../../../redux-store/slices/projectCreationSlice";
import { useDispatch } from "react-redux";
import { setToastDataFunc } from "../../../redux-store/slices/ToastDataHandlerSlice";

function RenameModal(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [nameInput, setNameInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  console.log(props.categoryList);

  const renameFunc = () => {
    let categoryNameArr = [];
    props.categoryList?.forEach((category) => {
      categoryNameArr.push(category.CategoryName.toLowerCase());
    });
    if (categoryNameArr.includes(nameInput.toLowerCase())) {
      setErrorMessage(
        `This category name is already taken. Please choose another name.`
      );
    } else if (props.category) {
      let editCategoryJSON = {
        categoryName: nameInput,
        categoryId: props.elemToBeRenamed?.CategoryId,
        description: props.elemToBeRenamed?.Description,
      };
      axios
        .post(SERVER_URL + ENDPOINT_EDIT_CATEGORY, editCategoryJSON)
        .then((response) => {
          if (response.data.Status === 0) {
            let tempList = [...props.categoryList];
            tempList?.forEach((category) => {
              if (category.CategoryId === props.elemToBeRenamed?.CategoryId) {
                category.CategoryName = nameInput;
              }
            });
            props.setCategoryList(tempList);
            props.setModalClosed();
            dispatch(
              setToastDataFunc({
                message: t("categoryRenamedSuccessMsg"),
                severity: "success",
                open: true,
              })
            );
          }
        });
    } else {
      let editCategoryJSON = {
        projectname: nameInput,
        projectId: props.projectID,
      };
      axios
        .post(SERVER_URL + "/renameProject", editCategoryJSON)
        .then((response) => {
          if (response.data.MainCode === 0) {
            let tempList = JSON.parse(JSON.stringify(props.projectList));
            tempList?.forEach((project) => {
              if (project.ProjectId === props.projectID) {
                project.ProjectName = nameInput;
              }
            });
            props.setProjectList((prev) => {
              return { ...prev, Projects: tempList };
            });
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
