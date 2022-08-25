import React from "react";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import styles from "../modal.module.css";
import {
  ENDPOINT_DELETE_PROCESS,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { store, useGlobalState } from "state-pool";

function DeleteDraftProcess(props) {
  let { t } = useTranslation();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const history = useHistory();
  const deleteProcess = () => {
    let postBody = {
      m_strProjectId: props.projectId,
      m_strProcessDefId: props.processDefId,
      allVersion: "N",
      m_strProcessType: localLoadedProcessData.ProcessType,
    };

    axios
      .post(SERVER_URL + ENDPOINT_DELETE_PROCESS, postBody)
      .then((response) => {
        if (response.data.Status === 0) {
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteAllProcess = () => {
    let postBody = {
      m_strProjectId: props.projectId,
      m_strProcessDefId: props.processDefId,
      allVersion: "Y",
    };
    axios
      .post(SERVER_URL + ENDPOINT_DELETE_PROCESS, postBody)
      .then((response) => {
        if (response.data.Status === 0) {
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <div className={styles.subHeader}>{t("beforeDeleteSurity")}</div>
      <p className={styles.deleteModalSubHeading}>
        {t("processC")} :
        <span>
          <span className={styles.deleteProcessName}>
            {props.openProcessName}
          </span>
          <span className={styles.deleteVersion}>
            {t("Version")} {props.existingVersion}
          </span>
        </span>
      </p>
      <div className={styles.noteDiv}>
        <p>
          {props.versionList.length > 1
            ? t("noRecoveryNote")
            : t("noRecoveryPermanent")}
        </p>
      </div>
      <div className={styles.footer}>
        <Button
          className={styles.cancelCategoryButton}
          onClick={() => props.setModalClosed()}
          id="hddp_cancel_btn"
        >
          {t("cancel")}
        </Button>
        {props.versionList.length > 1 ? (
          <React.Fragment>
            <Button
              className={styles.outlinedButton}
              id="hddp_deleteAllV_btn"
              onClick={() => deleteAllProcess()}
            >
              {t("deleteAllVersions")}
            </Button>
            <Button
              className={styles.addCategoryButton}
              id="hddp_deleteThisV_btn"
              onClick={() => deleteProcess()}
            >
              {t("deleteThisVersion")} ({t("v")} {props.existingVersion})
            </Button>
          </React.Fragment>
        ) : (
          <Button
            className={styles.addCategoryButton}
            id="hddp_delete_btn"
            onClick={() => deleteProcess()}
          >
            {t("delete")}
          </Button>
        )}
      </div>
    </React.Fragment>
  );
}

export default DeleteDraftProcess;
