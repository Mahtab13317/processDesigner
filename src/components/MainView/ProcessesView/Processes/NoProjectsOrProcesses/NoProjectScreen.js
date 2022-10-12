// Changes made to solve Bug with ID ===> 114834 (Create New Project button not working)
import React, {useState} from "react";
import { useTranslation } from "react-i18next";
import "./noProcessOrProjects.css";
import CreateProcessButton from "../../../../../UI/Buttons/CreateProcessButton";
import emptyStatePic from "../../../../../assets/ProcessView/EmptyState.svg";
import ProjectCreation from "../../Projects/ProjectCreation.js";
import Modal from "../../../../../UI/Modal/Modal.js";

function NoProjectScreen(props) {
  const [showModal, setShowModal] = useState(null);
  let { t } = useTranslation();
  return (
    <div className="noProjectsScreen">
      <img src={emptyStatePic} />
      <h2>{t("projectList.NoProjectsToShow")}</h2>
      <p>{t("projectList.UseOfProjects")}</p>
      <CreateProcessButton
      onClick={()=>setShowModal(true)}
        buttonContent={t("CreateNewProject")}
        buttonStyle={{
          backgroundColor: "var(--button_color)",
          color: "white",
          minWidth: "10vw",
          margin: "var(--spacing_v) 0 !important",
        }}
      ></CreateProcessButton>
      {showModal ? (
        <Modal
          show={showModal !== null}
          style={{
            width: "30vw",
            height: "80vh",
            left: "35%",
            top: "10%",
            padding: "0",
          }}
          modalClosed={() => setShowModal(null)}
          children={<ProjectCreation setShowModal={setShowModal} />}
        />
      ) : null}
    </div>
  );
}

export default NoProjectScreen;
