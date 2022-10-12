// #BugID - 110938
// #BugDescription - payload changed for save the process

import React, { useState, useEffect } from "react";
import StarRateIcon from "@material-ui/icons/StarRate";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import styles from "../modal.module.css";
import SelectWithInput from "../../../../UI/SelectWithInput";
import axios from "axios";
import {
  ENDPOINT_GETPROJECTLIST,
  ENDPOINT_SAVE_LOCAL,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { store, useGlobalState } from "state-pool";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import { useDispatch } from "react-redux";

function SaveAsNewDraft(props) {
  let { t } = useTranslation();
  const poolProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(poolProcessData);
  const [comment, setComment] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [projectName, setProjectName] = useState(
    localLoadedProcessData.ProjectName
  );
  const [isProjectNameConstant, setProjectNameConstant] = useState(false);
  const [process, setProcess] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(SERVER_URL + ENDPOINT_GETPROJECTLIST)
      .then((res) => {
        if (res.status === 200) {
          setProjectList(res.data.Projects);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const saveAsNewDraft = () => {
    let json = {
      processDefId: localLoadedProcessData.ProcessDefId,
      comment: comment,
      /*  projectName: projectName.ProjectName, */
      projectName: projectName,
      saveAsLocal: "Y",
      validateFlag: "N",
      bNewVersion: false,

      newProcessName: process,
      type: "1",
    };
    if (comment.trim() !== "" && process.trim() !== "" && !!projectName) {
      axios.post(SERVER_URL + ENDPOINT_SAVE_LOCAL, json).then((response) => {
        if (response.data.Status === 0) {
          dispatch(
            setToastDataFunc({
              message: t("operationSuccessful"),
              severity: "success",
              open: true,
            })
          );
          props.setModalClosed();
        }
      });
    } else {
      dispatch(
        setToastDataFunc({
          message: t("mandatoryErr"),
          severity: "error",
          open: true,
        })
      );
    }
  };

  console.log("mahtab", localLoadedProcessData);

  return (
    <React.Fragment>
      <div className={styles.subHeader}>
        {`${t("saveAsLocal")}`} : {props.openProcessName}
      </div>
      <div className={styles.subForm}>
        <p className="flex">
          <span className={styles.saveDraftLabel}>{t("project")}</span>
          <SelectWithInput
            inputClass={styles.projectNameTextField}
            constantInputClass={styles.projectConstInput}
            selectWithInput={styles.projectNameField}
            dropdownOptions={projectList}
            value={projectName}
            setValue={(val) => {
              setProjectName(val);
            }}
            showEmptyString={false}
            showConstValue={true}
            setIsConstant={setProjectNameConstant}
            isConstant={isProjectNameConstant}
            constantStatement="project"
            constantOptionStatement="+addProject"
            optionStyles={{ color: "darkBlue" }}
            isConstantIcon={true}
            optionKey="ProjectName"
            id="saveAsLocal_project"
          />
        </p>
        {/*****************************************************************************************
         * @author asloob_ali BUG ID: 115854  More options: process name field should be marked as mandatory as validatrion appearing for it
         * Reason:new process name was not marked mandatory.
         * Resolution : added asterist to show its mandatory.
         * Date : 20/09/2022
         ****************/}
        <p className="flex">
          <span className={styles.saveDraftLabel}>
            {t("New")} {t("processC")} {t("name")}
            <span className={styles.starIcon}>*</span>
          </span>
          <input
            id="saveAsLocal_process"
            value={process}
            onChange={(e) => setProcess(e.target.value)}
            className={styles.saveDraftNameInput}
          />
        </p>
        <p className="flex">
          <span className={styles.saveDraftLabel}>{t("Version")}</span>
          <span className={styles.saveDraftVersion}>
            {props.existingVersion}
          </span>
        </p>
        <p className="flex">
          <span className={styles.saveDraftLabel}>
            {t("comment")}
            {props.commentMandatory ? (
              <span className={styles.starIcon}>*</span>
            ) : null}
          </span>
          <textarea
            id="saveAsLocal_comment"
            className={styles.saveDraftTextArea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </p>
      </div>
      <div className={styles.footer}>
        <Button
          className={styles.cancelCategoryButton}
          onClick={() => props.setModalClosed()}
          id="saveAsLocal_cancelBtn"
        >
          {t("cancel")}
        </Button>
        <Button
          className={
            (comment.trim() === "" || !comment) && props.commentMandatory
              ? styles.disabledCategoryButton
              : styles.addCategoryButton
          }
          onClick={saveAsNewDraft}
          id="saveAsLocal_saveBtn"
        >
          {t("save")}
        </Button>
      </div>
    </React.Fragment>
  );
}

export default SaveAsNewDraft;
