import React, { useState, useEffect } from "react";
import "./Create.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  ENDPOINT_GETPROJECTLIST,
  SERVER_URL,
} from "../../../Constants/appConstants";
import { Select, MenuItem } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

function CreateProcess(props) {
  let { t } = useTranslation();
  const [projectList, setProjectList] = useState({
    Status: 0,
    Message: "",
    Projects: [],
  });

  const [selectedProjectName, setselectedProjectName] = useState("");

  const cancelHandler = () => {
    props.setShowModal(null);
  };

  const onClickHandler = () => {
    props.setShowModal("Project");
  };

  const createHandler = () => {};

  useEffect(() => {
    axios
      .get(SERVER_URL + ENDPOINT_GETPROJECTLIST)
      .then((res) => {
        if (res.status === 200) {
          setProjectList(res.data);
        }
      })
      .catch((err) => console.log(err));
    setselectedProjectName(props.selectedProject);
  }, []);
  return (
    <React.Fragment>
      <div className="row marginTop">
        <p className="LabelProcess">{t("SelectProject")}</p>

        <Select
          className="select"
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
          // value={selectedProjectName ? selectedProjectName : "value"}
          defaultValue={"defaultValue"}
        >
          {projectList?.Projects?.map((x) => {
            return (
              <MenuItem
                className="dropdownData"
                key={x.ProjectName}
                value={x.ProjectName}
              >
                {x.ProjectName}
              </MenuItem>
            );
          })}
          <hr />
          <MenuItem
            className="redirectLabel"
            onClick={() => {
              onClickHandler();
            }}
          >
            {t("createProject")}
          </MenuItem>
        </Select>

        <p className="LabelProcess" style={{ marginTop: "5%" }}>
          {t("NameofProcess")}
        </p>
        <input type="text" className="ProcessInput" />
      </div>

      <div className="footer">
        <button className="cancel" onClick={cancelHandler}>
          {t("cancel")}
        </button>
        <button className="create" onClick={createHandler}>
          {t("CreateProcess")}
        </button>
      </div>
    </React.Fragment>
  );
}

export default CreateProcess;
