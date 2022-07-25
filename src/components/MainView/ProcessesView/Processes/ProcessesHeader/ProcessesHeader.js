import React, { useEffect, useState } from "react";
import "../../Projects/projects.css";
import { useTranslation } from "react-i18next";
import CreateProcessButton from "../../../../../UI/Buttons/CreateProcessButton";
import styles from "../../../Templates/template.module.css";
import MortVertModal from "../../../../../UI/ActivityModal/Modal";
import { MoreVertOutlined } from "@material-ui/icons";
import { tileProcess } from "../../../../../utility/HomeProcessView/tileProcess.js";
import * as actionCreators from "../../../../../redux-store/actions/processView/actions";
import * as actionCreators_template from "../../../../../redux-store/actions/Template";
import { connect, useSelector } from "react-redux";
import {
  CREATE_PROCESS_FLAG_FROM_PROCESSES,
  PREVIOUS_PAGE_PROCESS,
  userRightsMenuNames,
} from "../../../../../Constants/appConstants";
import Modal from "../../../../../UI/Modal/Modal";
import DeleteModal from "../../../Templates/DeleteModal";
import RenameModal from "../../../Templates/RenameModal";
import ImportIcon from "../../../../../assets/ProcessView/PT_Import.svg";
import { ImportExportSliceValue } from "../../../../../redux-store/slices/ImportExportSlice";
import ImportExportProcess from "../../../ImportExportProcess/ImportExportProcess";
import { UserRightsValue } from "../../../../../redux-store/slices/UserRightsSlice";
import { getMenuNameFlag } from "../../../../../utility/UserRightsFunctions";

function ProcessesHeader(props) {
  let { t } = useTranslation();
  const [action, setAction] = useState(null);
  const userRightsValue = useSelector(UserRightsValue);
  const ProjectValue = useSelector(ImportExportSliceValue);
  const createProcessHandler = () => {
    props.CreateProcessClickFlag(CREATE_PROCESS_FLAG_FROM_PROCESSES);
    props.setTemplatePage(PREVIOUS_PAGE_PROCESS);
    //props.selectedProject is selected project name
    props.setSelectedProject(props.selectedProjectId, props.selectedProject);
  };
  const [moreOptionsArr, setMoreOptionsArr] = useState([]);
  const arr = [t("Rename"), t("delete")];

  const getActionName = (actionName) => {
    setAction(actionName);
  };

  // Boolean that decides whether import process button will be visible or not.
  const importProcessRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.importProcess
  );

  // Boolean that decides whether create process button will be visible or not.
  const createProcessRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.createProcess
  );

  // Boolean that decides whether delete project option will be visible or not.
  const deleteProjectRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.deleteProject
  );

  const importProcessHandler = () => {
    setAction("importExportModal");
  };

  // Function that runs when the component loads.
  useEffect(() => {
    let tempArr = [...arr];
    if (!deleteProjectRightsFlag) {
      let deleteProjectIndex;
      tempArr.forEach((element, index) => {
        if (element === t("delete")) {
          deleteProjectIndex = index;
        }
      });
      tempArr.splice(deleteProjectIndex, 1);
    }
    setMoreOptionsArr(tempArr);
  }, []);

  return (
    <div className="newProcessHeader" style={{ direction: `${t("HTML_DIR")}` }}>
      <div className="processName">
        {props.selectedProject ? (
          <h3 style={{ color: "black", fontWeight: "600" }}>
            {props.selectedProject}
          </h3>
        ) : (
          <h3 style={{ color: "black", fontWeight: "600" }}>
            {tileProcess(props.selectedProcessCode)[1]}{" "}
            {tileProcess(props.selectedProcessCode)[2]}{" "}
            {t("processList.processes")}
          </h3>
        )}
        <div className="importOrCreateProcessButtons">
          {/* <div
            style={{
              width: "28px",
              marginRight: "10px",
              height: "28px",
              border: "1px solid #C4C4C4",
              display: "inline-block",
              textAlign: "center",
            }}
          >
            <img
              src={ShareIcon}
              style={{
                height: "18px",
                width: "16px",
                paddingTop: "3px",
                color: "#C4C4C4",
              }}
              alt=""
            />
          </div>*/}
          {importProcessRightsFlag && (
            <CreateProcessButton
              onClick={importProcessHandler}
              buttonContent={
                <span>
                  <img
                    src={ImportIcon}
                    style={{ height: "16px", width: "16px", marginTop: "5px" }}
                    alt=""
                  />{" "}
                  {t("ImportProcess")}
                </span>
              }
              buttonStyle={{
                marginRight: "10px",
                backgroundColor: "white",
                width: "120px",
                height: "28px",
                fontSize: "12px",
                padding: "5px",
                textTransform: "none",
                color: "grey",
                border: "1px solid #C4C4C4",
              }}
            ></CreateProcessButton>
          )}
          {createProcessRightsFlag && (
            <CreateProcessButton
              variant="contained"
              onClick={() => createProcessHandler()}
              buttonContent={`+ ${t("CreateProcess")}`}
              buttonStyle={{
                marginRight: "10px",
                backgroundColor: "#0072C6",
                width: "110px",
                height: "28px",
                fontSize: "12px",
                padding: "5px",
                textTransform: "none",
                color: "white",
              }}
              disableElevation
            ></CreateProcessButton>
          )}
          <div
            style={{
              width: "28px",
              height: "28px",
              marginRight: "10px",
              border: "1px solid #C4C4C4",
              display: "inline-block",
              textAlign: "center",
            }}
          >
            <MortVertModal
              backDrop={false}
              getActionName={(actionName) => getActionName(actionName)}
              modalPaper={styles.moreVertProcessHeaderModal}
              sortByDiv={styles.moreVertModalDiv}
              modalDiv={styles.moreVertDiv}
              sortByDiv_arabic="sortByDiv_arabicActivity"
              oneSortOption={styles.moreVertModalOption}
              showTickIcon={false}
              sortSectionOne={moreOptionsArr}
              buttonToOpenModal={
                <MoreVertOutlined className={styles.moreVertIcon} />
              }
              dividerLine="dividerLineActivity"
              hideRelative={true}
            />

            {action === t("delete") ? (
              <Modal
                show={action === t("delete")}
                style={{
                  width: "30vw",
                  height: "11.5rem",
                  left: "30%",
                  top: "25%",
                  padding: "0",
                }}
                modalClosed={() => setAction(null)}
                children={
                  <DeleteModal
                    projectList={props.projectList}
                    setProjectList={props.setProjectList}
                    setModalClosed={() => setAction(null)}
                    processToDelete={props.selectedProject}
                  />
                }
              />
            ) : null}
            {action === "importExportModal" ? (
              <Modal
                show={action === "importExportModal"}
                style={{
                  width: "400px",
                  height: "380px",
                  left: "35%",
                  top: "50%",
                  padding: "0",
                  position: "absolute",
                  transform: "translate(-50%, -50%)",
                  boxShadow: "none",
                }}
                modalClosed={() => setAction(null)}
                children={
                  <ImportExportProcess
                    ProjectValue={ProjectValue}
                    setAction={() => setAction(null)}
                    typeImportorExport="import"
                  />
                }
              />
            ) : null}

            {action === t("Rename") ? (
              <Modal
                show={action === t("Rename")}
                style={{
                  width: "30vw",
                  height: "11.5rem",
                  left: "30%",
                  top: "25%",
                  padding: "0",
                }}
                modalClosed={() => setAction(null)}
                children={
                  <RenameModal
                    projectList={props.projectList}
                    setProjectList={props.setProjectList}
                    setModalClosed={() => setAction(null)}
                    processToDelete={props.selectedProject}
                  />
                }
              />
            ) : null}
          </div>
        </div>
      </div>
      {props.selectedProject ? (
        <p className="selectedProjectInfo">{props.selectedProjectDesc}</p>
      ) : (
        <p className="selectedProjectInfo">
          {t("ThisSectionContainsAllThe")}{" "}
          {tileProcess(props.selectedProcessCode)[1]} {t("ProcessCreatedByYou")}
        </p>
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    CreateProcessClickFlag: (flag) =>
      dispatch(actionCreators.createProcessFlag(flag)),
    setSelectedProject: (id, name) => {
      dispatch(actionCreators.selectedProject(id, name));
    },
    setTemplatePage: (value) =>
      dispatch(actionCreators_template.storeTemplatePage(value)),
  };
};

const mapStateToProps = (state) => {
  return {
    getTemplatePage: state.templateReducer.template_page,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProcessesHeader);
