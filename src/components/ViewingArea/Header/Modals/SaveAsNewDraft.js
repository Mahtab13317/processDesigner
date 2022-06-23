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

function SaveAsNewDraft(props) {
  let { t } = useTranslation();
  const [comment, setComment] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [projectName, setProjectName] = useState();
  const [isProjectNameConstant, setProjectNameConstant] = useState(false);
  const [process, setProcess] = useState("");

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
      processDefId: +props.processDefId,
      comment: comment,
      projectName: projectName,
      saveAsLocal: "Y",
      validateFlag: "N",
    };
    axios.post(SERVER_URL + ENDPOINT_SAVE_LOCAL, json).then((response) => {
      if (response.data.Status === 0) {
        props.setModalClosed();
      }
    });
  };

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
        <p className="flex">
          <span className={styles.saveDraftLabel}>
            {t("New")} {t("processC")} {t("name")}
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
