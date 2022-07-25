import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import axios from "axios";
import {
  APP_HEADER_HEIGHT,
  ENDPOINT_ADD_PROCESS,
  ENDPOINT_GETPROJECTLIST,
  FILETYPE_DOC,
  FILETYPE_DOCX,
  FILETYPE_JPEG,
  FILETYPE_PDF,
  FILETYPE_PNG,
  FILETYPE_XLS,
  FILETYPE_ZIP,
  RTL_DIRECTION,
  SERVER_URL,
  BTN_HIDE,
  BTN_SHOW,
} from "../../Constants/appConstants";
import styles from "./index.module.css";
import arabicStyles from "./indexArabic.module.css";
import SelectWithInput from "../SelectWithInput";
import SingleTemplateCard from "../SingleTemplateCard";
import { Card, CardContent } from "@material-ui/core";
import Modal from "../Modal/Modal.js";
import FileUpload from "../FileUpload";
import { useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import * as actionCreators from "../../redux-store/actions/processView/actions.js";
import * as actionCreators_template from "../../redux-store/actions/Template";
import CircularProgress from "@material-ui/core/CircularProgress";
import CreateProcessByTemplate from "../../components/MainView/Create/CreateProcessByTemplate";
import { setToastDataFunc } from "../../redux-store/slices/ToastDataHandlerSlice";

function ProcessCreation(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const { backBtnLabel } = props;
  const dispatch = useDispatch();
  const [defaultProject, setDefaultProject] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [projectName, setProjectName] = useState();
  const [isProjectNameConstant, setProjectNameConstant] = useState(false);
  const [processName, setProcessName] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [chooseTemplateModal, setChooseTemplateModal] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (props.selectedTemplate) {
      setSelectedTemplate(props.selectedTemplate);
    }
  }, [props.selectedTemplate]);

  useEffect(() => {
    if (props.selectedProjectName && props.selectedProjectId) {
      setDefaultProject(props.selectedProjectName);
      setSpinner(false);
    } else {
      axios
        .get(SERVER_URL + ENDPOINT_GETPROJECTLIST)
        .then((res) => {
          if (res.status === 200) {
            setProjectList(res.data.Projects);
            if (props.template_selected) {
              setSelectedTemplate(props.template_selected);
            }
            setProcessName(props.template_process);
            setProjectName(props.template_project);
            setProjectNameConstant(props.template_project_const);
            setFiles(props.template_files);
            setSpinner(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setSpinner(false);
        });
    }
  }, []);

  const cancelHandler = () => {
    props.moveBackFunction();
  };

  const createHandler = () => {
    let jsonBody = {
      processName: processName,
      openProcess: "Y",
      projectId: defaultProject
        ? props.selectedProjectId
        : !isProjectNameConstant
        ? projectName.ProjectId
        : -1,
      projectName: isProjectNameConstant ? projectName : "",
      templateId: selectedTemplate ? selectedTemplate.Id : -1,
    };
    axios
      .post(SERVER_URL + ENDPOINT_ADD_PROCESS, jsonBody)
      .then((res) => {
        if (res.data.Status === 0) {
          props.openProcessClick(
            res.data.OpenProcess.ProcessDefId,
            res.data.OpenProcess.ProjectName,
            res.data.OpenProcess.ProcessType,
            res.data.OpenProcess.VersionNo,
            res.data.OpenProcess.ProcessName
          );
          props.openTemplate(null, null, false);
          history.push("/process");
          props.CreateProcessClickFlag(null);
          props.setTemplatePage(null);
        } else {
          dispatch(
            setToastDataFunc({
              message: res.data.Message,
              severity: "error",
              open: true,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    props.setTemplateDetails(
      props.category,
      props.view,
      true,
      selectedTemplate,
      projectName,
      isProjectNameConstant,
      processName,
      files
    );
  });

  return spinner ? (
    <CircularProgress
      style={
        direction === RTL_DIRECTION
          ? { marginTop: "40vh", marginRight: "50%" }
          : { marginTop: "40vh", marginLeft: "50%" }
      }
    />
  ) : (
    <React.Fragment>
      <p className={styles.header}>
        <span
          className={styles.moveBackDiv}
          onClick={props.moveBackFunction}
          id="backBtn_processCreation"
        >
          {direction === RTL_DIRECTION ? (
            <ArrowForwardIosIcon className={arabicStyles.backIcon} />
          ) : (
            <ArrowBackIosIcon className={styles.backIcon} />
          )}
          <span>{t(backBtnLabel)}</span>
        </span>
      </p>
      <div className="flex w100">
        <div className={styles.formArea}>
          <div
            className={
              direction === RTL_DIRECTION ? arabicStyles.form : styles.form
            }
          >
            <p
              className={
                direction === RTL_DIRECTION ? arabicStyles.label : styles.label
              }
            >
              {t("nameOfProject")}
            </p>
            {defaultProject ? (
              <input
                type="text"
                className={styles.disabledField}
                value={defaultProject}
                disabled
                id="projectNameInput_processCreation"
              />
            ) : (
              <SelectWithInput
                dropdownOptions={projectList}
                value={projectName}
                setValue={(val) => {
                  setProjectName(val);
                }}
                showEmptyString={false}
                showConstValue={true}
                inputClass={
                  direction === RTL_DIRECTION
                    ? arabicStyles.selectWithInputTextField
                    : styles.selectWithInputTextField
                }
                constantInputClass={
                  direction === RTL_DIRECTION
                    ? arabicStyles.multiSelectConstInput
                    : styles.multiSelectConstInput
                }
                setIsConstant={setProjectNameConstant}
                isConstant={isProjectNameConstant}
                constantStatement="project"
                constantOptionStatement="+addProject"
                optionStyles={{ color: "darkBlue" }}
                isConstantIcon={true}
                optionKey="ProjectName"
                selectWithInput={
                  direction === RTL_DIRECTION
                    ? arabicStyles.selectWithInput
                    : styles.selectWithInput
                }
              />
            )}
            <p
              className={
                direction === RTL_DIRECTION ? arabicStyles.label : styles.label
              }
            >
              {t("NameofProcess")}
            </p>
            <input
              type="text"
              className={styles.inputField}
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              id="processName_processCreation"
            />
            <p
              className={
                direction === RTL_DIRECTION ? arabicStyles.label : styles.label
              }
            >
              {t("attachments")}
            </p>
            <FileUpload
              setFiles={setFiles}
              typesOfFilesToAccept={[
                FILETYPE_DOC,
                FILETYPE_XLS,
                FILETYPE_DOCX,
                FILETYPE_ZIP,
                FILETYPE_PNG,
                FILETYPE_JPEG,
                FILETYPE_PDF,
              ]}
              files={files}
            />
          </div>
        </div>
        <div className={styles.templateArea}>
          <div className={styles.selectedTemplateDiv}>
            <p
              className={
                direction === RTL_DIRECTION ? arabicStyles.label : styles.label
              }
            >
              {" "}
              {t("selectedTemplate")}
            </p>
            {selectedTemplate ? (
              <SingleTemplateCard
                item={selectedTemplate}
                cardWidth="100%"
                cardActivityMaxWidth="25%"
                style={{ marginTop: 0, marginRight: 0 }}
                bRemoveBtn={true}
                bReplaceBtn={true}
                replaceFunction={() => {
                  setChooseTemplateModal(true);
                  if (props.createProcessFlag) {
                    props.setTemplatePage(null);
                  }
                }}
                bPreviewBtn={true}
                previewFunc={() => {
                  props.setTemplatePage(props.templatePage);
                }}
                removeFunction={() => setSelectedTemplate(null)}
                templateName={selectedTemplate.Name}
                templateId={selectedTemplate.Id}
              />
            ) : (
              <Card variant="outlined" className={styles.card}>
                <CardContent className={styles.cardContent}>
                  <p>{t("noTemplateSelected")}</p>
                  <div className={styles.templateFooter}>
                    <button
                      className={styles.previewButton}
                      onClick={() => setChooseTemplateModal(true)}
                      id="chooseTemp_processCreation"
                    >
                      {t("chooseTemplate")}
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <button
          className={styles.cancelBtn}
          onClick={cancelHandler}
          id="cancelBtn_processCreation"
        >
          {t("cancel")}
        </button>
        <button
          className={styles.createBtn}
          onClick={createHandler}
          id="createBtn_processCreation"
        >
          {t("Create")}
        </button>
      </div>
      {chooseTemplateModal ? (
        <Modal
          show={chooseTemplateModal}
          style={{
            top: "2%",
            height: "94%",
            left: "2%",
            width: "96%",
            padding: "0",
          }}
          backDropStyle={{
            top: `-${APP_HEADER_HEIGHT}`,
            height: `calc(100% + ${APP_HEADER_HEIGHT})`,
          }}
          modalClosed={() => setChooseTemplateModal(false)}
          children={
            <CreateProcessByTemplate
              bCancel={true}
              cancelFunction={() => {
                setChooseTemplateModal(false);
                if (props.createProcessFlag) {
                  props.setTemplatePage(null);
                }
              }}
              containerWidth="79.5vw"
              cardWidth="37vw"
              cardActivityMaxWidth="9.25vw"
              bSelectBtn={BTN_SHOW}
              selectFunction={(template) => {
                setSelectedTemplate(template);
                setChooseTemplateModal(false);
                if (props.createProcessFlag) {
                  props.setTemplatePage(props.templatePage);
                }
              }}
              bSelectTemplateBtn={BTN_HIDE}
              bPreviewBtn={BTN_HIDE}
              selectedTemplate={selectedTemplate}
            />
          }
        />
      ) : null}
    </React.Fragment>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    openProcessClick: (id, name, type, version, processName) =>
      dispatch(
        actionCreators.openProcessClick(id, name, type, version, processName)
      ),
    openTemplate: (id, name, flag) =>
      dispatch(actionCreators.openTemplate(id, name, flag)),
    setTemplatePage: (value) =>
      dispatch(actionCreators_template.storeTemplatePage(value)),
    setTemplateDetails: (
      category,
      view,
      createBtnClick,
      template,
      projectName,
      isProjectNameConstant,
      processName,
      files
    ) =>
      dispatch(
        actionCreators_template.setTemplateDetails(
          category,
          view,
          createBtnClick,
          template,
          projectName,
          isProjectNameConstant,
          processName,
          files
        )
      ),
    CreateProcessClickFlag: (flag) =>
      dispatch(actionCreators.createProcessFlag(flag)),
  };
};

const mapStateToProps = (state) => {
  return {
    selectedProjectId: state.selectedProjectReducer.selectedProjectId,
    selectedProjectName: state.selectedProjectReducer.selectedProjectName,
    template_selected: state.templateReducer.template_selected,
    template_project: state.templateReducer.template_project,
    template_project_const: state.templateReducer.template_project_const,
    template_process: state.templateReducer.template_process,
    template_files: state.templateReducer.template_files,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProcessCreation);
