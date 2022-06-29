import React, { useState } from "react";
import "./ProjectCreation.css";
import { useTranslation } from "react-i18next";
import StarRateIcon from "@material-ui/icons/StarRate";
import {
  SERVER_URL,
  ENDPOINT_ADD_PROJECT,
} from "../../../../Constants/appConstants";
import axios from "axios";
import SunTextEditor from "../../../../UI/SunEditor/SunTextEditor";
import c_Names from "classnames";
import "./ProjectCreationArabic.css";

function ProjectCreation(props) {
  let { t } = useTranslation();
  const { setShowModal } = props;
  const direction = `${t("HTML_DIR")}`;
  const [projectInput, setprojectInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [showDesc, setshowDesc] = useState(false);

  // Function that is used to close the modal.
  const cancelHandler = () => {
    setShowModal(null);
  };

  // Function that gets called when the user clicks on create project button.
  const createHandler = () => {
    axios
      .post(SERVER_URL + ENDPOINT_ADD_PROJECT, {
        projectname: projectInput.trim(),
        description: descriptionInput,
      })
      .then((response) => {
        if (response?.data?.Status === 0) {
          cancelHandler();
        }
      });
  };

  // Function that handles project name changes.
  const projectInputHandler = (event) => {
    setprojectInput(event.target.value);
  };

  // Function that shows the sun editor to add description.
  const addDescription = () => {
    setshowDesc(!showDesc);
  };

  // Function that handles description changes.
  const descriptionInputHandler = (description) => {
    setDescriptionInput(description);
  };

  return (
    <div style={{ direction: direction }}>
      <p
        className={c_Names({
          projectCreationTittle: direction !== "rtl",
          projectCreationTittleArabic: direction == "rtl",
        })}
      >
        {t("projectCreation")}
      </p>
      <p className="hrLineProjectCreation"></p>

      <p
        className={c_Names({
          Label: direction !== "rtl",
          LabelArabic: direction == "rtl",
        })}
      >
        {t("ProjectName")}
        <StarRateIcon
          style={{
            height: "8px",
            width: "8px",
            color: "red",
            marginBottom: "5px",
          }}
        />
      </p>
      <input
        className={c_Names({
          projectInput: direction !== "rtl",
          projectInputArabic: direction == "rtl",
        })}
        autoFocus
        value={projectInput}
        onChange={(event) => projectInputHandler(event)}
        id="projectName_projectCreation"
      />
      {!showDesc ? (
        <p
          className={c_Names({
            AddDesc: direction !== "rtl",
            AddDescArabic: direction == "rtl",
          })}
          onClick={addDescription}
          id="addDescription_projectCreation"
        >
          {t("addDescription")}
        </p>
      ) : null}

      {showDesc ? (
        <div
          className={c_Names({
            descriptionToShow: direction !== "rtl",
            descriptionToShowArabic: direction == "rtl",
          })}
        >
          <p
            className={c_Names({
              Label: direction !== "rtl",
              LabelArabic: direction == "rtl",
            })}
          >
            {t("Discription")}
          </p>

          <SunTextEditor
            autoFocus={false}
            placeholder={null}
            descriptionInputcallBack={descriptionInputHandler}
            width={props.width}
            customHeight={props.height}
          />
        </div>
      ) : null}

      <div className="footerProjectCreation">
        <button
          className={c_Names({
            cancel: direction !== "rtl",
            cancelArabic: direction == "rtl",
          })}
          id="footerProjectCreation_cancel"
          onClick={cancelHandler}
        >
          {t("cancel")}
        </button>
        <button
          className={c_Names({
            create: projectInput.trim().length !== 0,
            createDisable: projectInput.trim().length === 0,
          })}
          disabled={projectInput.trim().length === 0}
          onClick={createHandler}
          id="createBtn_projectCreation"
        >
          {t("createProject")}
        </button>
      </div>
    </div>
  );
}

export default ProjectCreation;
