// #BugID - 113913
// #BugDescription - handled the checks for redirecting to blank page on click version
// Bug 116266 - Checkin: Checkin and other options are not available when draft checked out process opened from Recent Listing
import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import deploy from "../../../assets/Header/deploy.png";
import { connect, useSelector } from "react-redux";
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
  userRightsMenuNames,
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
import ProcessValidation from "./ProcessValidation/ProcessProgress/index";
import { UserRightsValue } from "../../../redux-store/slices/UserRightsSlice";
import { getMenuNameFlag } from "../../../utility/UserRightsFunctions";

function Header(props) {
  let { t } = useTranslation();
  const history = useHistory();
  const userRightsValue = useSelector(UserRightsValue);
  const saveProcessRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.saveProcess
  );
  const makerCheckerRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.makerChecker
  );

  const importProcessRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.importProcess
  );

  const exportProcessRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.exportProcess
  );

  const reportGenerationRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.reportGeneration
  );

  const deleteProcessRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.deleteProcess
  );

  const registerProcessRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.registerProcess
  );

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
  //code edited on 26 July 2022 for BugId 110024
  const { processData, setProcessData } = props;
  const buttonFrom = "DeployHeader";
  const [showProcessReport, setshowProcessReport] = useState(false);
  const dispatch = useDispatch();
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showDeployFailModal, setShowDeployFailModal] = useState(false);
  const [errorVariables, setErrorVariables] = useState([]);
  const [warningVariables, setWarningVariables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pinnedProcessDefIdArr, setpinnedProcessDefIdArr] = useState([]);
  const [showPinBoolean, setshowPinBoolean] = useState(true);
  const [versionListSelected, setversionListSelected] = useState([]);
  const [showVersionHistory, setshowVersionHistory] = useState(false);
  const [version, setVersion] = useState(null);
  const [processType, setProcessType] = useState(null);
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

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
  
  useEffect(() => {
    props.processData?.Versions?.forEach((element) => {
      if (element.VersionNo == props.openProcessVersion) {
        let temp = [...versionListSelected];
        temp.push(element);
        setversionListSelected(temp);
      }
    });
  }, []);

  const toggleDrawer = (anchor, open) => {
    // Bug fixed for Bug Id  - 111391 (When Deployment fails the pop up shows "View Details" but nothing happens after clicking on it)
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
    >
      <ProcessValidation
        errorVariables={errorVariables}
        setErrorVariables={setErrorVariables}
        showDeployModal={showDeployModal}
        setShowDeployModal={setShowDeployModal}
        setShowDeployFailModal={setShowDeployFailModal}
        showDeployFailModal={showDeployFailModal}
        warningVariables={warningVariables}
        setWarningVariables={setWarningVariables}
        // style={{ height: isDrawerMinimised?"50px":"183px" }}
        // setIsDrawerMinimised={setIsDrawerMinimised}
        toggleDrawer={() => toggleDrawer(anchor, false)}
      />
    </Box>
  );

  useEffect(() => {
    /*code edited on 29 August 2022 for BugId 114894 */
    if (localLoadedProcessData) {
      setVersion(localLoadedProcessData.VersionNo);
      setProcessType(localLoadedProcessData.ProcessType);
    }
  }, [localLoadedProcessData]);

  return (
    <div className="header_processes" style={{ direction: `${t("HTML_DIR")}` }}>
      <div className="leftHeader">
        <MenuIcon
          style={{ color: "#606060", width: "1.5rem", height: "1.5rem" }}
        />
        <p class="processName">
          {props.openTemplateFlag ? props.templateName : props.openProcessName}
        </p>
        {/*code edited on 29 August 2022 for BugId 114894 */}
        {props.openTemplateFlag ? null : (
          <span class="versionName" onClick={versionHandler}>
            {version !== null ? t("v") + version : ""}
          </span>
        )}
        <span class="processType">
          {/*code edited on 29 August 2022 for BugId 114894 */}
          {props.openTemplateFlag
            ? null
            : processType !== null && (
                <img
                  src={tileProcess(processType)[0]}
                  style={{ height: "1rem", width: "1rem", marginTop: "1px" }}
                  alt=""
                />
              )}
          <span class="processTypeName">
            {props.openTemplateFlag
              ? t("Template")
              : processType !== null &&
                `${tileProcess(processType)[1]} ${
                  localLoadedProcessData?.CheckedOut === "Y"
                    ? "(Checked-Out)"
                    : ""
                }`}
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
                  <p className="versionCardVal"> {props?.openProcessVersion}</p>
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
              {/*code updated on 12 August 2022 for BugId 115525  */}
              <p className="versionCardLabel">{t("createdBy")}</p>
              <p className="versionCardVal">
                {props?.processData?.Versions[0]?.CreatedBy} {t("on")}{" "}
                {props?.processData?.Versions[0]?.CreatedOn}
              </p>
              <p className="versionCardLabel">{t("lastModifiedBy")}</p>
              <p className="versionCardVal">
                {props?.processData?.Versions[0]?.LastModifiedBy} {t("on")}{" "}
                {props?.processData?.Versions[0]?.LastModifiedOn}
              </p>
              <p className="versionCardLabel">{t("project")}</p>
              <p className="versionCardVal">
                {props?.processData?.ProjectName}
              </p>
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
              <MoreHorizIcon
                style={{
                  color: "#727272",
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />
              <span className="moreText">{t("More")}</span>
            </button>
          </ClickAwayListener>
          {showMore ? (
            props.openTemplateFlag ? null : (
              <div className="moreBtnDropdown">
                <ul>
                  {saveProcessRightsFlag && (
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
                  )}
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
                        (props.openProcessType === PROCESSTYPE_LOCAL || props.openProcessType=='LC')&&
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
                    onClick={() => toggleDrawer("bottom", true)}
                    className="moreOptions"
                    style={{
                      display:
                        (props.openProcessType === PROCESSTYPE_LOCAL || props.openProcessType=='LC')
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
                  {importProcessRightsFlag && (
                    <li
                      className="moreOptions"
                      onClick={() => handleProcessAction(MENUOPTION_IMPORT)}
                      style={{
                        display:
                          (props.openProcessType === PROCESSTYPE_LOCAL || props.openProcessType=='LC')
                            ? ""
                            : "none",
                      }}
                      id="header_delete_btn"
                    >
                      {t("import")} {t("process")}
                    </li>
                  )}
                  {exportProcessRightsFlag && (
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
                  )}
                  {deleteProcessRightsFlag && (
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
                  )}
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
                  {reportGenerationRightsFlag && (
                    <li
                      className="moreOptions"
                      onClick={handleProcessReport}
                      id="process_report_btn"
                    >
                      {t("processReport")}
                    </li>
                  )}
                  {makerCheckerRightsFlag && (
                    <li
                      className="moreOptions"
                      onClick={() => {
                        window.loadInboxMC();
                        setIsModalOpen(true);
                      }}
                      id="maker_checker_btn"
                    >
                      {"Maker Checker"}
                    </li>
                  )}
                </ul>
              </div>
            )
          ) : null}
        </div>
        {props.openTemplateFlag ? (
          <button className="deployButton" id="useTemplate_btn">
            <span className="deployText">{t("UseThisTemplate")}</span>
          </button>
        ) : registerProcessRightsFlag ? (
          <button
            className="deployButton"
            style={{
              display:
                props.openProcessType !== PROCESSTYPE_LOCAL ? "none" : "",
            }}
            onClick={() => setAction(MENUOPTION_DEPLOY)}
            id="header_deploy_btn"
            disabled={processData?.CheckedOut === "Y"}
          >
            <img
              src={deploy}
              style={{ width: "1.75rem", height: "1.75rem" }}
              alt=""
            />
            <span className="deployText">{t("Deploy")}</span>
          </button>
        ) : null}
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
            width: "518px",
            height: "396px",
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

      {isModalOpen ? (
        <Modal
          show={isModalOpen}
          modalClosed={() => {
            setIsModalOpen(false);
            var elem = document.getElementById("oapweb_assetManifest");

            elem.parentNode.removeChild(elem);
          }}
          style={{
            width: "67%",
            height: "91%",
            left: "17%",
            top: "6%",
            padding: "5px 1% 1%",
            paddingTop: 0,
          }}
        >
          <div>
            <CloseIcon
              onClick={() => {
                setIsModalOpen(false);
                var elem = document.getElementById("oapweb_assetManifest");

                elem.parentNode.removeChild(elem);
              }}
              className={styles.closeIcon}
              // style={{ opacity: "0.2", marginBottom: "2px" }}
              fontSize="medium"
            />
            <div id="mf_inbox_oapweb"></div>
          </div>
        </Modal>
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
              toggleDrawer={() => toggleDrawer("bottom", true)}
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
            //code edited on 26 July 2022 for BugId 110024
            <DisableProcess
              setModalClosed={() => setAction(null)}
              modalType={MENUOPTION_DISABLE}
              processDefId={processData.ProcessDefId}
              setProcessData={setProcessData}
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
            //code edited on 26 July 2022 for BugId 110024
            <EnableProcess
              setModalClosed={() => setAction(null)}
              modalType={MENUOPTION_ENABLE}
              processDefId={processData.ProcessDefId}
              setProcessData={setProcessData}
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
              showDeployModal={showDeployModal}
              setShowDeployModal={setShowDeployModal}
              setShowDeployFailModal={setShowDeployFailModal}
              errorVariables={errorVariables}
              setErrorVariables={setErrorVariables}
              warningVariables={warningVariables}
              setWarningVariables={setWarningVariables}
              toggleDrawer={() => toggleDrawer("top", false)}
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
            <ProcessDeployment
              toggleDrawer={() => toggleDrawer("bottom", false)}
              setShowDeployModal={setShowDeployModal}
              showDeployModal={showDeployModal}
            />
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
              setShowDeployFailModal={() => {
                setShowDeployFailModal(false);
                toggleDrawer("bottom", true);
              }}
              // toggleDrawer={() => {
              //   toggleDrawer("bottom", true);
              // }}
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
          onClose={() => toggleDrawer("bottom", false)}
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
