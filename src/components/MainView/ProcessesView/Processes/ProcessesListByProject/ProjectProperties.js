import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SunEditor from "../../../../../UI/SunEditor/SunTextEditor";
import "./ProjectProperties.css";
import axios from "axios";
import {
  ENDPOINT_GET_PROJECT_PROPERTIES,
  ENDPOINT_PROJECT_PROPERTIES,
  RTL_DIRECTION,
  SERVER_URL,
} from "../../../../../Constants/appConstants";
import arabicStyles from "./ArabicStyles.module.css";

function ProjectProperties(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [LastModifiedBy, setLastModifiedBy] = useState(null);
  const [createdOn, setCreatedOn] = useState(null);
  const [lastModifiedOn, setLastModifiedOn] = useState(null);
  const [processCount, setProcessCount] = useState(null);
  const [prevDesc, setprevDesc] = useState("");

  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          ENDPOINT_GET_PROJECT_PROPERTIES +
          "/" +
          props.projectId +
          "/L"
      )
      .then((res) => {
        if (res.data.Status === 0) {
          setCreatedBy(res.data.ProjectProperty.CreatedBy);
          setCreatedOn(res.data.ProjectProperty.CreationDateTime);
          setDescription(res.data.ProjectProperty.Description);
          setLastModifiedBy(res.data.ProjectProperty.LastModifiedBy);
          setLastModifiedOn(res.data.ProjectProperty.LastModifiedOn);
          setProjectName(res.data.ProjectProperty.ProjectName);
          setProcessCount(res.data.ProjectProperty.TotalProcessCount);
          setprevDesc(res.data.ProjectProperty.Description);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.projectId]);

  const saveHandler = () => {
    let jsonBody = {
      projectName: projectName,
      projectId: props.projectId,
      projectOldName: projectName,
      description: description,
    };
    axios
      .post(SERVER_URL + ENDPOINT_PROJECT_PROPERTIES, jsonBody)
      .then((res) => {
        if (res.data.Status === 0) {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const descriptionHandler = (e) => {
    setDescription(e.target.innerText);
  };

  const cancelHandler = () => {
    setDescription(prevDesc);
  };

  return (
    <React.Fragment>
      <div
        style={{
          direction: direction,
          margin: "1rem 1vw 0",
          padding: "1rem 1vw",
          background: "#fff",
        }}
      >
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.nameAndDesc
              : "nameAndDesc"
          }
        >
          {t("nameAndDesc")}
        </p>

        <div className="row margin1">
          <p className="projectPropertiesLabel">{t("ProjectName")}</p>
          <p
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.projectPropertiesValue
                : "projectPropertiesValue"
            }
          >
            {projectName}
          </p>
        </div>

        <SunEditor
          id="add_description"
          width="50%"
          customHeight="6rem"
          //   placeholder={t("customValidation")}
          value={description}
          getValue={(e) => descriptionHandler(e)}
        />
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.nameAndDesc
              : "nameAndDesc margin1"
          }
        >
          {t("projectOwnerDetail")}
        </p>

        <div className="row">
          <div className="row margin11 flex1">
            <p className="projectPropertiesLabel">{t("createdOn")}:</p>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.projectPropertiesSubValue
                  : "projectPropertiesSubValue"
              }
            >
              {createdOn}
            </p>
          </div>
          <div className="row margin11 flex1">
            <p className="projectPropertiesLabel">{t("createdby")}:</p>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.projectPropertiesSubValue
                  : "projectPropertiesSubValue"
              }
            >
              {createdBy}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="row margin11 flex1">
            <p className="projectPropertiesLabel">{t("modifiedOn")}</p>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.projectPropertiesSubValue
                  : "projectPropertiesSubValue"
              }
            >
              {lastModifiedOn}
            </p>
          </div>
          <div className="row margin11 flex1">
            <p className="projectPropertiesLabel">{t("modifiedBy")}</p>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.projectPropertiesSubValue
                  : "projectPropertiesSubValue"
              }
            >
              {LastModifiedBy}
            </p>
          </div>
        </div>

        <div className="row margin11 flex1">
          <p className="projectPropertiesLabel">{t("processCount")}:</p>
          <p
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.projectPropertiesValue
                : "projectPropertiesValue"
            }
          >
            {processCount}
          </p>
        </div>
      </div>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.footerProjectProperties
            : "footerProjectProperties"
        }
      >
        <button
          className={
            direction === RTL_DIRECTION ? arabicStyles.cancel : "cancel"
          }
          onClick={cancelHandler}
          id="cancelBtn_projectCreation"
        >
          {t("cancel")}
        </button>
        <button
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.createProperties
              : "createProperties"
          }
          onClick={saveHandler}
          id="createBtn_projectProperties"
        >
          {t("save")}
        </button>
      </div>
    </React.Fragment>
  );
}

export default ProjectProperties;
