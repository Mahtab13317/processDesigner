import React, { useState } from "react";
import "./Create.css";
import { useTranslation } from "react-i18next";
import SunTextEditor from "../../../UI/SunEditor/SunTextEditor";
// import moment from "moment";
// import { logRoles } from "@testing-library/dom";
import CloseIcon from "@material-ui/icons/Close";
import { SERVER_URL } from "../../../Constants/appConstants";
import axios from "axios";

// import { validateRegex, REGEX } from "../../../Constants/validator";

function CreateProject(props) {
  let { t } = useTranslation();
  const [projectName, setprojectName] = useState("");
  const count = "0";
  const Powner = "Adam";
  const date = new Date();

  const projectInput = (e) => {
    // var validateBool = validateRegex(
    //   String.fromCharCode(e.which),
    //   REGEX.AlphaNospace
    // );

    // if (!validateBool) {
    //   e.preventDefault();
    // } else {
    //   setprojectName(e.target.value);
    // }
    setprojectName(e.target.value);
  };
  const cancelHandler = () => {
    props.setShowModal(null);
  };

  const createHandler = () => {
    axios
      .post(SERVER_URL + "/addProject", {
        projectname: projectName,
      })
      .then((response) => {});
  };
  return (
    <React.Fragment id="createProject">
      <div className="header">
        <p className="heading_create">{t("CreateNewproject")}</p>
        <p className="close" onClick={cancelHandler}>
          <CloseIcon />
        </p>
      </div>
      <hr className="hr" />
      <div className="row marginTop">
        <p className="Label">{t("ProjectName")}</p>
        <input
          className="inputfield text"
          autoFocus
          defaultValue={projectName ? projectName : ""}
          onKeyPress={(e) => projectInput(e)}
        />
      </div>
      <div className="row marginTop flex">
        <p className="Label">{t("Discription")}</p>
        {/* <textarea className="description text" /> */}
        <p>
          <SunTextEditor placeholder={null} />
        </p>
      </div>
      <div className="detail">{t("projectDeatil")}</div>
      <div className="row marginTop">
        <p className="Label">{t("projectOwner")}</p>
        <input className="disableInput text" value={Powner} disabled={true} />
      </div>
      <div className="row marginTop">
        <p className="Label">{t("createdOn")}</p>
        <input className="disableInput text" value={date} disabled={true} />
      </div>
      <div className="row marginTop">
        <p className="Label">{t("processCount")}</p>
        <input className="disableInput text" value={count} disabled={true} />
      </div>

      <div className="footer">
        <button className="cancel" onClick={cancelHandler}>
          {t("cancel")}
        </button>
        <button className="create" onClick={createHandler}>
          {t("Create")}
        </button>
      </div>
    </React.Fragment>
  );
}

export default CreateProject;
