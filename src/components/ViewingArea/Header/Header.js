import { useState, useEffect } from "react";
import React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import deploy from "../../../assets/Header/deploy.svg";
import { connect } from "react-redux";
import "./Header.css";
import ProcessDeployment from "./ProcessValidation/ProcessDeployment/DeploySucessModal.js";
import ProcessDeploymentFailed from "./ProcessValidation/ProcessDeployment/DeployFailedModal.js";
import { tileProcess } from "../../../utility/HomeProcessView/tileProcess";
import { useTranslation } from "react-i18next";
import {
  DISABLED_STATE,
  ENABLED_STATE,
  MENUOPTION_CHECKIN,
  MENUOPTION_CHECKOUT,
  MENUOPTION_DELETE,
  MENUOPTION_DEPLOY,
  MENUOPTION_DISABLE,
  MENUOPTION_ENABLE,
  MENUOPTION_EXPORT,
  MENUOPTION_IMPORT,
  MENUOPTION_PIN,
  MENUOPTION_SAVE_LOCAL,
  MENUOPTION_SAVE_NEW_V,
  MENUOPTION_SAVE_TEMPLATE,
  MENUOPTION_UNDOCHECKOUT,
  MENUOPTION_UNPIN,
  PMWEB,
  PROCESSTYPE_DEPLOYED,
  PROCESSTYPE_LOCAL,
  PROCESSTYPE_REGISTERED,
  PROCESS_CHECKOUT,
  SERVER_URL_LAUNCHPAD,
} from "../../../Constants/appConstants";
import { ClickAwayListener } from "@material-ui/core";
import Modal from "../../../UI/Modal/Modal.js";
import SaveTemplate from "./Modals/SaveTemplate";
import { store, useGlobalState } from "state-pool";
import { useHistory } from "react-router-dom";
import DeployProcess from "../../DeployProcess/DeployProcess";
import UndoCheckOutModal from "./Modals/UndoCheckoutProcess";
import CheckInModal from "./Modals/CheckInProcess";
import CheckOutModal from "./Modals/CheckOutProcess";
import DeleteDraftModal from "./Modals/DeleteDraftProcess";
import DeleteDeployedModal from "./Modals/DeleteDeployedProcess";
import DisableProcess from "./Modals/DisableProcess";
import EnableProcess from "./Modals/EnableProcess";
import SaveAsNewVersion from "./Modals/SaveAsNewVersion";
import SaveAsNewDraft from "./Modals/SaveAsNewDraft";
import ProjectReport from "./Modals/ProjectReport";

import { Card, CardContent } from "@material-ui/core";
import VersionHistory from "./Modals/VersionHistory";
import axios from "axios";
import ImportExportProcess from "../../MainView/ImportExportProcess/ImportExportProcess";
import { setImportExportVal } from "../../../redux-store/slices/ImportExportSlice";
import { useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import ProcessValidation from "./ProcessValidation/ProcessProgress/index";

function Header(props) {
  let { t } = useTranslation();
  const history = useHistory();
  const [showMore, setShowMore] = useState(false);
  const openProcessesArr = store.getState("openProcessesArr"); //array of keys of processdata stored
  const arrProcessesData = store.getState("arrProcessesData"); //array of processdata stored
  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked
  const [localArrProcessesData, setLocalArrProcessesData] =
    useGlobalState(arrProcessesData);
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [localOpenProcessesArr, setLocalOpenProcessesArr] =
    useGlobalState(openProcessesArr);
  const [action, setAction] = useState(null);
  const [showVersionCard, setshowVersionCard] = useState(false);
  const { processData } = props;
  const [isDisable, setIsDisable] = useState(false);
  const buttonFrom = "DeployHeader";
  const [showProcessReport, setshowProcessReport] = useState(false);
  const dispatch = useDispatch();
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showDeployFailModal, setShowDeployFailModal] = useState(false);
  const [isDrawerMinimised, setIsDrawerMinimised] = useState(false);
  const [errorVariables, setErrorVariables] = useState([]);
  const [warningVariables, setWarningVariables] = useState([]);

  useEffect(() => {
    if (props.openProcessType === PROCESSTYPE_LOCAL) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [props.openProcessType]);

  const closeHandler = () => {
    localArrProcessesData.forEach((element) => {
      if (element.ProcessDefId === localLoadedProcessData.ProcessDefId) {
        localArrProcessesData.splice(localArrProcessesData.indexOf(element), 1);
      }
    });
    let temp = [...localOpenProcessesArr];
    temp.splice(
      localOpenProcessesArr.indexOf(
        `${localLoadedProcessData.ProcessDefId}#${localLoadedProcessData.ProcessType}`
      ),
      1
    );
    setLocalOpenProcessesArr(temp);
    setLocalArrProcessesData([...localArrProcessesData]);
    setlocalLoadedProcessData(null);
    history.push("/");
  };
  const [pinnedProcessDefIdArr, setpinnedProcessDefIdArr] = useState([]);
  const [showPinBoolean, setshowPinBoolean] = useState(true);

  useEffect(() => {
    async function getPinned() {
      const res = await axios.get(SERVER_URL_LAUNCHPAD + "/pinnedList/1");
      try {
        if (res.status === 200) {
          res.data.forEach((data) => {
            setpinnedProcessDefIdArr((prev) => {
              let temp = [...prev];
              temp.push(data.Id + "");
              return temp;
            });
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    getPinned();
  }, [processData.ProcessDefId]);

  console.log("ccccccccccc", pinnedProcessDefIdArr);

  useEffect(() => {
    if (pinnedProcessDefIdArr.includes(processData.ProcessDefId))
      setshowPinBoolean(false);
    else setshowPinBoolean(true);
  }, [pinnedProcessDefIdArr]);

  const handleProcessAction = async (actionType) => {
    setAction(actionType);
    if (actionType === MENUOPTION_PIN) {
      const res = await axios.post(SERVER_URL_LAUNCHPAD + "/pin", {
        name: processData.ProcessName,
        type: "P",
        parent: processData.ProjectName,
        editor: processData.CreatedBy,
        status: processData.ProcessType, //same for temp
        creationDate: processData.CreatedOn,
        modificationDate: processData.LastModifiedOn,
        accessedDate: processData.CreatedOn, //same as it is temp.
        applicationName: PMWEB, //hardcoded (const file)
        id: processData.ProcessDefId,
        version: processData.VersionNo,
        statusMessage: "Created",
        applicationId: "1",
        parentId: processData.ProjectId,
      });
      if (res.data) setshowPinBoolean(false);
    } else if (actionType === MENUOPTION_UNPIN) {
      axios
        .post(SERVER_URL_LAUNCHPAD + "/unpin", {
          status: processData.ProcessType,
          id: processData.ProcessDefId,
          applicationName: PMWEB,
          type: "P",
          applicationId: "1",
        })

        .then((response) => {
          setshowPinBoolean(true);
        });
    } else if (
      actionType === MENUOPTION_IMPORT ||
      actionType === MENUOPTION_EXPORT
    ) {
      dispatch(
        setImportExportVal({
          ProjectName: {
            ProjectName: localLoadedProcessData.ProjectName,
            ProjectId: localLoadedProcessData.ProjectId,
          },
        })
      );
    }
  };

  const handleProcessReport = () => {
    setshowProcessReport(true);
  };

  const versionHandler = () => {
    setshowVersionCard(true);
  };
  const [versionListSelected, setversionListSelected] = useState([]);
  const [showVersionHistory, setshowVersionHistory] = useState(false);
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  useEffect(() => {
    props.processData?.Versions?.forEach((element) => {
      if (element.VersionNo == props.openProcessVersion) {
        let temp = [...versionListSelected];
        temp.push(element);
        setversionListSelected(temp);
      }
    });
  }, [props.processData]);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  console.log("STATE", state);

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <ProcessValidation
        errorVariables={errorVariables}
        setErrorVariables={setErrorVariables}
        warningVariables={warningVariables}
        setWarningVariables={setWarningVariables}
        // style={{ height: isDrawerMinimised?"50px":"183px" }}
        // setIsDrawerMinimised={setIsDrawerMinimised}
        toggleDrawer={() => toggleDrawer(anchor, false)}
      />
    </Box>
  );

  return (
    <div className="header_processes" style={{ direction: `${t("HTML_DIR")}` }}>
      <div className="leftHeader">
        <MenuIcon style={{ marginTop: "2px", color: "#606060" }} />
        <p class="processName">
          {props.openTemplateFlag ? props.templateName : props.openProcessName}
        </p>
        {props.openTemplateFlag ? null : (
          <span class="versionName" onClick={versionHandler}>
            {t("V")}
            {props.openProcessVersion}
          </span>
        )}
        <span class="processType">
          {props.openTemplateFlag ? null : (
            <img
              src={tileProcess(props.openProcessType)[0]}
              style={{ height: "13px", width: "13px", marginTop: "3px" }}
            />
          )}
          <span class="processTypeName">
            {props.openTemplateFlag
              ? t("Template")
              : tileProcess(props.openProcessType)[1]}
          </span>
        </span>
      </div>

      {showVersionCard ? (
        <ClickAwayListener onClickAway={() => setshowVersionCard(false)}>
          <Card variant="outlined" className="versionCard">
            <CardContent>
              <div className="row">
                <div>
                  <p className="versionCardLabel">{t("Version")}</p>
                  <p className="versionCardVal"> {props.openProcessVersion}</p>
                </div>
                <div>
                  {props.processData?.Versions?.length > 1 ? (
                    <p
                      className="versionHistory"
                      onClick={() => setshowVersionHistory(true)}
                    >
                      {t("viewVersionHistory")}
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="versionCardLabel">{t("createdBy")}</p>
              <p className="versionCardVal">
                {versionListSelected[0].CreatedBy} {t("on")}
                {versionListSelected[0].CreatedOn}
              </p>
              <p className="versionCardLabel">{t("lastModifiedBy")}</p>
              <p className="versionCardVal">
                {versionListSelected[0].LastModifiedBy} {t("on")}{" "}
                {versionListSelected[0].LastModifiedOn}
              </p>
              <p className="versionCardLabel">{t("project")}</p>
              <p className="versionCardVal">{props.processData.ProjectName}</p>
            </CardContent>
          </Card>
        </ClickAwayListener>
      ) : null}
      <div className="rightHeader">
        <div className="relative">
          <ClickAwayListener onClickAway={() => setShowMore(false)}>
            <button
              class="moreButton"
              onClick={() => setShowMore(true)}
              id="header_more_btn"
            >
              <span>
                <MoreHorizIcon style={{ color: "#727272" }} />
              </span>
              <span className="moreText">{t("More")}</span>
            </button>
          </ClickAwayListener>
          {showMore ? (
            props.openTemplateFlag ? null : (
              <div className="moreBtnDropdown">
                <ul>
                  <li
                    className="moreOptions"
                    onClick={() => handleProcessAction(MENUOPTION_SAVE_NEW_V)}
                    style={{
                      display:
                        props.openProcessType !== PROCESSTYPE_LOCAL
                          ? "none"
                          : processData.CheckedOut === PROCESS_CHECKOUT
                          ? "none"
                          : "",
                    }}
                    id="saveAsNewVersion_btn"
                  >
                    {t("saveAsNewVersion")}
                  </li>
                  <li
                    className="moreOptions"
                    onClick={() =>
                      handleProcessAction(MENUOPTION_SAVE_TEMPLATE)
                    }
                    style={{
                      display:
                        props.openProcessType !== PROCESSTYPE_DEPLOYED &&
                        props.openProcessType !== PROCESSTYPE_LOCAL
                          ? "none"
                          : processData.CheckedOut === PROCESS_CHECKOUT
                          ? "none"
                          : "",
                    }}
                    id="saveAsTemplate_btn"
                  >
                    {t("saveAsTemplate")}
                  </li>
                  <li
                    className="moreOptions"
                    onClick={() => handleProcessAction(MENUOPTION_SAVE_LOCAL)}
                    style={{
                      display:
                        props.openProcessType !== PROCESSTYPE_DEPLOYED &&
                        props.openProcessType !== PROCESSTYPE_REGISTERED
                          ? "none"
                          : "",
                    }}
                    id="saveAsLocal_btn"
                  >
                    {t("saveAsLocal")}
                  </li>
                  <li
                    className="moreOptions"
                    onClick={() => handleProcessAction(MENUOPTION_CHECKIN)}
                    style={{
                      display:
                        props.openProcessType === PROCESSTYPE_LOCAL &&
                        processData.CheckedOut === PROCESS_CHECKOUT
                          ? ""
                          : "none",
                    }}
                    id="checkin_btn"
                  >
                    {t("checkInProcess")}
                  </li>
                  <li
                    className="moreOptions"
                    onClick={() => handleProcessAction(MENUOPTION_UNDOCHECKOUT)}
                    style={{
                      display:
                        (props.openProcessType === PROCESSTYPE_DEPLOYED ||
                          props.openProcessType === PROCESSTYPE_REGISTERED) &&
                        processData.CheckedOut === PROCESS_CHECKOUT
                          ? ""
                          : "none",
                    }}
                    id="undo_checkout_btn"
                  >
                    {t("undoCheckoutProcess")}
                  </li>
                  <li
                    className="moreOptions"
                    onClick={() => handleProcessAction(MENUOPTION_CHECKOUT)}
                    style={{
                      display:
                        (props.openProcessType === PROCESSTYPE_DEPLOYED ||
                          props.openProcessType === PROCESSTYPE_REGISTERED) &&
                        processData.CheckedOut !== PROCESS_CHECKOUT
                          ? ""
                          : "none",
                    }}
                    id="checkout_btn"
                  >
                    {t("checkoutProcess")}
                  </li>
                  <li
                    onClick={toggleDrawer("bottom", true)}
                    className="moreOptions"
                    style={{
                      display:
                        processData.CheckedOut !== PROCESS_CHECKOUT
                          ? ""
                          : "none",
                    }}
                  >
                    {t("validateProcess")}
                  </li>
                  {showPinBoolean ? (
                    <li
                      className="moreOptions"
                      onClick={() => handleProcessAction(MENUOPTION_PIN)}
                      style={{
                        display:
                          processData.CheckedOut === PROCESS_CHECKOUT
                            ? "none"
                            : "",
                      }}
                      id="header_delete_btn"
                    >
                      {t("pin")} {t("process")}
                    </li>
                  ) : (
                    <li
                      className="moreOptions"
                      onClick={() => handleProcessAction(MENUOPTION_UNPIN)}
                      style={{
                        display:
                          processData.CheckedOut === PROCESS_CHECKOUT
                            ? "none"
                            : "",
                      }}
                      id="header_delete_btn"
                    >
                      {t("unpin")} {t("process")}
                    </li>
                  )}
                  <li
                    className="moreOptions"
                    onClick={() => handleProcessAction(MENUOPTION_IMPORT)}
                    style={{
                      display:
                        processData.CheckedOut === PROCESS_CHECKOUT
                          ? "none"
                          : "",
                    }}
                    id="header_delete_btn"
                  >
                    {t("import")} {t("process")}
                  </li>
                  <li
                    className="moreOptions"
                    onClick={() => handleProcessAction(MENUOPTION_EXPORT)}
                    style={{
                      display:
                        processData.CheckedOut === PROCESS_CHECKOUT
                          ? "none"
                          : "",
                    }}
                    id="header_delete_btn"
                  >
                    {t("export")} {t("processC")}
                  </li>
                  <li
                    className="moreOptions"
                    onClick={() => handleProcessAction(MENUOPTION_DELETE)}
                    style={{
                      display:
                        processData.CheckedOut === PROCESS_CHECKOUT
                          ? "none"
                          : "",
                    }}
                    id="header_delete_btn"
                  >
                    {t("delete")} {t("processC")}
                  </li>
                  <li
                    className="moreOptions"
                    onClick={() => handleProcessAction(MENUOPTION_DISABLE)}
                    id="disable_process_btn"
                    style={{
                      display:
                        (props.openProcessType === PROCESSTYPE_DEPLOYED ||
                          props.openProcessType === PROCESSTYPE_REGISTERED) &&
                        processData.ProcessState === ENABLED_STATE
                          ? ""
                          : "none",
                    }}
                  >
                    {t("disable")} {t("processC")}
                  </li>
                  <li
                    className="moreOptions"
                    onClick={() => handleProcessAction(MENUOPTION_ENABLE)}
                    id="enable_process_btn"
                    style={{
                      display:
                        (props.openProcessType === PROCESSTYPE_DEPLOYED ||
                          props.openProcessType === PROCESSTYPE_REGISTERED) &&
                        processData.ProcessState === DISABLED_STATE
                          ? ""
                          : "none",
                    }}
                  >
                    {t("enable")} {t("processC")}
                  </li>

                  <li
                    className="moreOptions"
                    onClick={handleProcessReport}
                    id="process_report_btn"
                  >
                    {t("processReport")}
                  </li>
                </ul>
              </div>
            )
          ) : null}
        </div>
        {props.openTemplateFlag ? (
          <button className="deployButton" id="useTemplate_btn">
            <span className="deployText">{t("UseThisTemplate")}</span>
          </button>
        ) : (
          <button
            className="deployButton"
            style={{
              display:
                props.openProcessType !== PROCESSTYPE_LOCAL ? "none" : "",
            }}
            onClick={() => setAction(MENUOPTION_DEPLOY)}
            id="header_deploy_btn"
          >
            <span className="deployIcon">
              <img src={deploy} width="14px" height="13px" alt="" />
            </span>
            <span className="deployText">{t("Deploy")}</span>
          </button>
        )}
        {/*<button
          class="closeButton"
          id="header_close_btn"
          onClick={closeHandler}
        >
          <span>
            <CloseIcon className="closeButtonIcon" />{" "}
          </span>
          <span className="closeText">{t("Close")}</span>
        </button>*/}
      </div>
      {showProcessReport ? (
        <Modal
          show={showProcessReport}
          style={{
            width: "40vw",
            height: "50vh",
            left: "30%",
            top: "20%",
            padding: "0",
          }}
          modalClosed={() => setshowProcessReport(false)}
          children={
            <ProjectReport
              setshowProcessReport={setshowProcessReport}
              openProcessType={props.openProcessType}
            />
          }
        />
      ) : null}

      {action === MENUOPTION_SAVE_TEMPLATE ? (
        <Modal
          show={action === MENUOPTION_SAVE_TEMPLATE}
          style={{
            padding: "0",
            width: "28vw",
            left: "35%",
            top: "25%",
          }}
          modalClosed={() => setAction(null)}
          children={<SaveTemplate setModalClosed={() => setAction(null)} />}
        />
      ) : null}
      {action === MENUOPTION_IMPORT || action === MENUOPTION_EXPORT ? (
        <Modal
          show={action === MENUOPTION_IMPORT || action === MENUOPTION_EXPORT}
          style={{
            width: "400px",
            height: action === MENUOPTION_EXPORT ? "150px" : "380px",
            left: "50%",
            top: "38%",
            padding: "0",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            boxShadow: "none",
          }}
          modalClosed={() => setAction(null)}
          children={
            <ImportExportProcess
              setAction={() => setAction(null)}
              showOverwrite={true}
              processName={localLoadedProcessData?.ProcessName}
              selectedProjectId={localLoadedProcessData.ProjectId}
              changeProjectBool={false}
              typeImportorExport={
                action === MENUOPTION_IMPORT ? "import" : "export"
              }
            />
          }
        />
      ) : null}

      {action === MENUOPTION_UNDOCHECKOUT ? (
        <Modal
          show={action === MENUOPTION_UNDOCHECKOUT}
          style={{
            padding: "0",
            width: "33vw",
            left: "33%",
            top: "25%",
          }}
          modalClosed={() => setAction(null)}
          children={
            <UndoCheckOutModal
              modalType={MENUOPTION_UNDOCHECKOUT}
              openProcessName={props.openProcessName}
              setModalClosed={() => setAction(null)}
              processDefId={props.openProcessID}
              projectName={processData.ProjectName}
            />
          }
        />
      ) : null}
      {action === MENUOPTION_CHECKIN ? (
        <Modal
          show={action === MENUOPTION_CHECKIN}
          style={{
            padding: "0",
            width: "33vw",
            left: "33%",
            top: "25%",
          }}
          modalClosed={() => setAction(null)}
          children={
            <CheckInModal
              modalType={MENUOPTION_CHECKIN}
              openProcessName={props.openProcessName}
              setModalClosed={() => setAction(null)}
              existingVersion={props.openProcessVersion}
              processDefId={props.openProcessID}
            />
          }
        />
      ) : null}

      {action === MENUOPTION_CHECKOUT ? (
        <Modal
          show={action === MENUOPTION_CHECKOUT}
          style={{
            padding: "0",
            width: "33vw",
            left: "33%",
            top: "25%",
          }}
          modalClosed={() => setAction(null)}
          children={
            <CheckOutModal
              openProcessName={props.openProcessName}
              setModalClosed={() => setAction(null)}
              modalType={MENUOPTION_CHECKOUT}
              projectName={processData.ProjectName}
              processDefId={props.openProcessID}
            />
          }
        />
      ) : null}

      {action === MENUOPTION_DELETE &&
      props.openProcessType === PROCESSTYPE_LOCAL ? (
        <Modal
          show={
            action === MENUOPTION_DELETE &&
            props.openProcessType === PROCESSTYPE_LOCAL
          }
          style={{
            padding: "0",
            width: "33vw",
            left: "33%",
            top: "25%",
          }}
          modalClosed={() => setAction(null)}
          children={
            <DeleteDraftModal
              openProcessName={props.openProcessName}
              setModalClosed={() => setAction(null)}
              existingVersion={props.openProcessVersion}
              versionList={processData.Versions}
              projectId={props.processData.ProjectId}
              processDefId={props.processData.ProcessDefId}
            />
          }
        />
      ) : null}
      {action === MENUOPTION_DELETE &&
      (props.openProcessType === PROCESSTYPE_DEPLOYED ||
        props.openProcessType === PROCESSTYPE_REGISTERED) ? (
        <Modal
          show={
            action === MENUOPTION_DELETE &&
            (props.openProcessType === PROCESSTYPE_DEPLOYED ||
              props.openProcessType === PROCESSTYPE_REGISTERED)
          }
          style={{
            padding: "0",
            width: "33vw",
            left: "33%",
            top: "25%",
          }}
          modalClosed={() => setAction(null)}
          children={
            <DeleteDeployedModal
              openProcessName={props.openProcessName}
              setModalClosed={() => setAction(null)}
              existingVersion={props.openProcessVersion}
              versionList={processData.Versions}
              processDefId={props.processData.ProcessDefId}
            />
          }
        />
      ) : null}
      {action === MENUOPTION_DISABLE ? (
        <Modal
          show={action === MENUOPTION_DISABLE}
          style={{
            padding: "0",
            width: "33vw",
            left: "33%",
            top: "25%",
          }}
          modalClosed={() => setAction(null)}
          children={
            <DisableProcess
              setModalClosed={() => setAction(null)}
              modalType={MENUOPTION_DISABLE}
            />
          }
        />
      ) : null}
      {action === MENUOPTION_ENABLE ? (
        <Modal
          show={action === MENUOPTION_ENABLE}
          style={{
            padding: "0",
            width: "33vw",
            left: "33%",
            top: "25%",
          }}
          modalClosed={() => setAction(null)}
          children={
            <EnableProcess
              setModalClosed={() => setAction(null)}
              modalType={MENUOPTION_ENABLE}
            />
          }
        />
      ) : null}
      {action === MENUOPTION_SAVE_NEW_V ? (
        <Modal
          show={action === MENUOPTION_SAVE_NEW_V}
          style={{
            padding: "0",
            width: "33vw",
            left: "33%",
            top: "25%",
          }}
          modalClosed={() => setAction(null)}
          children={
            <SaveAsNewVersion
              setModalClosed={() => setAction(null)}
              modalType={MENUOPTION_SAVE_NEW_V}
              existingVersion={props.openProcessVersion}
              processDefId={props.openProcessID}
            />
          }
        />
      ) : null}
      {action === MENUOPTION_SAVE_LOCAL ? (
        <Modal
          show={action === MENUOPTION_SAVE_LOCAL}
          style={{
            padding: "0",
            width: "33vw",
            left: "33%",
            top: "25%",
          }}
          modalClosed={() => setAction(null)}
          children={
            <SaveAsNewDraft
              setModalClosed={() => setAction(null)}
              modalType={MENUOPTION_SAVE_LOCAL}
              existingVersion={props.openProcessVersion}
              openProcessName={props.openProcessName}
              commentMandatory={true}
            />
          }
        />
      ) : null}
      {action === MENUOPTION_DEPLOY ? (
        <Modal
          show={action === MENUOPTION_DEPLOY}
          style={{
            padding: "0",
            width: "40vw",
            height: "90vh",
            top: "5%",
          }}
          modalClosed={() => setAction(null)}
          children={
            <DeployProcess
              setModalClosed={() => setAction(null)}
              buttonFrom={buttonFrom}
              setShowDeployModal={setShowDeployModal}
              setShowDeployFailModal={setShowDeployFailModal}
              errorVariables={errorVariables}
              setErrorVariables={setErrorVariables}
              warningVariables={warningVariables}
              setWarningVariables={setWarningVariables}
            />
          }
        />
      ) : null}

      {/* ----------------------------- */}
      {showDeployModal ? (
        <Modal
          show={showDeployModal}
          style={{
            width: "395px",
            height: "235px",
            left: "40%",
            top: "25%",
            padding: "0",
          }}
          modalClosed={() => setShowDeployModal(false)}
          children={
            <ProcessDeployment setShowDeployModal={setShowDeployModal} />
          }
        ></Modal>
      ) : null}
      {/* ---------------- */}
      {/* ----------------------------- */}
      {showDeployFailModal ? (
        <Modal
          show={showDeployFailModal}
          style={{
            width: "395px",
            height: "235px",
            left: "40%",
            top: "25%",
            padding: "0",
          }}
          modalClosed={() => setShowDeployFailModal(false)}
          children={
            <ProcessDeploymentFailed
              showDeployFailModal={showDeployFailModal}
              setShowDeployFailModal={setShowDeployFailModal}
            />
          }
        ></Modal>
      ) : null}
      {/* ---------------- */}

      {showVersionHistory ? (
        <Modal
          show={showVersionHistory}
          style={{
            padding: "0",
            width: "60vw",
            height: "80vh",
            top: "10%",
            left: "20%",
          }}
          modalClosed={() => setshowVersionHistory(false)}
          children={
            <VersionHistory
              setModalClosed={() => setshowVersionHistory(false)}
              versionList={processData.Versions}
              projectName={processData.ProjectName}
              ProcessName={props.openProcessName}
              processType={props.openProcessType}
            />
          }
        />
      ) : null}

      {state["bottom"] ? (
        <Drawer
          anchor={"bottom"}
          open={state["bottom"]}
          onClose={toggleDrawer("bottom", false)}
          // hideBackdrop={true}
          BackdropProps={{ invisible: true }}
        >
          {list("bottom")}
        </Drawer>
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    openProcessVersion: state.openProcessClick.selectedVersion,
    templateName: state.openTemplateReducer.templateName,
    openTemplateFlag: state.openTemplateReducer.openFlag,
  };
};

export default connect(mapStateToProps, null)(Header);
