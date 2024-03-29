// Changes made to solve Bug with ID = 114685 => Project Description is not getting saved
import React, { useRef, useState } from "react";
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
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import { useDispatch } from "react-redux";
import { setProjectCreation } from "../../../../redux-store/slices/projectCreationSlice";
import { FieldValidations } from "../../../../utility/FieldValidations/fieldValidations";
import { InputBase } from "@material-ui/core";

function ProjectCreation(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const { setShowModal } = props;
  const direction = `${t("HTML_DIR")}`;
  const [projectInput, setprojectInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [showDesc, setshowDesc] = useState(false);
  const projectRef = useRef();

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
        //code edited on 28 July 2022 for BugId 111769
        if (response?.data?.Status === 0) {
          dispatch(
            setToastDataFunc({
              message: response?.data?.Message,
              severity: "success",
              open: true,
            })
          );
          dispatch(
            setProjectCreation({
              projectCreated: true,
              projectName: projectInput,
              projectDesc: descriptionInput,
            })
          );
          cancelHandler();
        } else if (response?.data?.Status === -2) {
          // code edited on 28 July 2022 for BugId 112445
          dispatch(
            setToastDataFunc({
              message: response?.data?.Message,
              severity: "error",
              open: true,
            })
          );
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
  const descriptionInputHandler = (e) => {
    setDescriptionInput(e.target.innerText);
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
        ref={projectRef}
        onKeyPress={(e) => {
          FieldValidations(e, 150, projectRef.current, 60);
        }}
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
            // descriptionInputcallBack={descriptionInputHandler}
            width={props.width}
            customHeight={props.height}
            getValue={(e) => descriptionInputHandler(e)}
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
