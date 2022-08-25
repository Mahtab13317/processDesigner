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
  ENDPOINT_DELETE_PROJECT,
} from "../../../Constants/appConstants";
import { useDispatch } from "react-redux";
import { setToastDataFunc } from "../../../redux-store/slices/ToastDataHandlerSlice";

function DeleteModal(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const dispatch = useDispatch();
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
    } else if (props?.deleteProject) {
      let projectId, projectType;

      props.projectList.forEach((project) => {
        if (project.ProjectName === props.projectToDelete) {
          projectId = project.ProjectId;
          projectType = project.ProjectType;
        }
      });
      let checkedOutProcessPresent = false;

      props.allProcessesPerProject.some((proc) => {
        if (proc.CheckedOut === "Y") {
          checkedOutProcessPresent = true;
          return true;
        }
      });

      if (!checkedOutProcessPresent) {
        if (projectType === "R" && props.allProcessesPerProject.length > 0) {
          dispatch(
            setToastDataFunc({
              message: t("deleteAllProcessError"),
              severity: "error",
              open: true,
            })
          );
        } else {
          axios
            .delete(
              SERVER_URL +
                ENDPOINT_DELETE_PROJECT +
                "/" +
                projectId +
                "/" +
                projectType
            )
            .then((res) => {
              if (res?.data?.Status === 0) {
                props.setProjectList((prev) => {
                  let temp = structuredClone(prev);
                  temp.Projects.forEach((proj, index) => {
                    if (proj.ProjectId === projectId) {
                      temp.Projects.splice(index, 1);
                    }
                  });

                  return temp;
                });
                dispatch(
                  setToastDataFunc({
                    message: res?.data?.Message,
                    severity: "success",
                    open: true,
                  })
                );
                props.setModalClosed();
              }
            });
        }
      } else {
        dispatch(
          setToastDataFunc({
            message: t("oneProcessCheckedOutError"),
            severity: "error",
            open: true,
          })
        );
      }
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
    } else if (props.deleteProject) {
      return props.projectToDelete;
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
        {props.category ? (
          t("categories") + " " + t("categoryDeletedMessage")
        ) : (
          <>
            {props.deleteProject
              ? t("projects.projects") + " " + t("onceDeletedCannotBeRecovered")
              : t("templates") + " " + t("onceDeletedCannotBeRecovered")}
          </>
        )}
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
