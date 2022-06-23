import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import StarRateIcon from "@material-ui/icons/StarRate";
import { useTranslation } from "react-i18next";
import styles from "../modal.module.css";
import {
  ENDPOINT_DELETE_PROCESS_DEPLOYED,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import axios from "axios";
import { useHistory } from "react-router-dom";

function DeleteProcess(props) {
  let { t } = useTranslation();
  const [comment, setComment] = useState("");

  const history = useHistory();
  const deleteProcess = () => {
    let postBody = {
      m_strProcessDefId: props.processDefId,
      comment: comment,
    };
    axios
      .post(SERVER_URL + ENDPOINT_DELETE_PROCESS_DEPLOYED, postBody)
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
        <span className={styles.processHeading}>{t("processC")}</span>
        <span className={styles.deleteProcessName}>
          <span>{props.openProcessName}</span>
          <span className={styles.deleteVersion}>
            {t("Version")} {props.existingVersion}
          </span>
        </span>
      </p>
      <p className={styles.deleteComment}>
        <span className={styles.deleteCommentHeading}>
          {t("comment")}
          <span className={styles.starIcon}>*</span>
        </span>
        <textarea
          id="hdedp_comment"
          className={styles.commentArea}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </p>
      <div className={styles.noteDiv}>
        <p>{t("deleteDeployedProcessNote")}</p>
      </div>
      <div className={styles.footer}>
        <Button
          className={styles.cancelCategoryButton}
          onClick={() => props.setModalClosed()}
          id="hdedp_cancel_btn"
        >
          {t("cancel")}
        </Button>
        <Button
          className={styles.addCategoryButton}
          id="hdedp_delete_btn"
          onClick={() => deleteProcess()}
        >
          {t("delete")}
        </Button>
      </div>
    </React.Fragment>
  );
}

export default DeleteProcess;
