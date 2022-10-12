import React, { useState } from "react";
import StarRateIcon from "@material-ui/icons/StarRate";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import styles from "./template.module.css";
import {
  SERVER_URL,
  ENDPOINT_EDIT_CATEGORY,
  RTL_DIRECTION,
} from "../../../Constants/appConstants";
import axios from "axios";
import arabicStyles from "./templateArabicStyles.module.css";
import { setProjectCreation } from "../../../redux-store/slices/projectCreationSlice";
import { useDispatch } from "react-redux";
import { Box } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "2px",
  border: "1px solid #F5F5F5",
  boxShadow: 24,
  marginTop: 100,
  zIndex: 9999,
};

function RenameTemplate(props) {
    console.log("222", "template modal", props);
    let { t } = useTranslation();
    const direction = `${t("HTML_DIR")}`;
    const [disableBtn, setDisableBtn] = useState(true);
    const [nameInput, setNameInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    const updateTemplate = () => {
      const payLoad = {
        templateName: nameInput,
        categoryId: props.catList.CategoryId,
        templateId: props.actedTemplate.Id,
      };
      console.log("222","payload",payLoad)
      
      axios
      .post(SERVER_URL + "/editTemplate", payLoad)
      .then((res) => {
        console.log("222","response",res)
      })
      .catch((err) => {
        console.log(err);
      });
    };
  return (
    <>
      <Box>
        <div
          className={
            direction == RTL_DIRECTION
              ? styles.modalHeaderRTL
              : styles.modalHeader
          }
        >
          <div
            className={
              direction == RTL_DIRECTION
                ? `${styles.labels} ${styles.modalLabelRTL}`
                : `${styles.labels} ${styles.modalLabel}`
            }
          >
            <h3>
              {t("Rename")} {t("template")}
            </h3>
          </div>
          <div
            className={
              direction == RTL_DIRECTION
                ? styles.modalCloseRTL
                : styles.modalClose
            }
          >
            <CloseIcon
              style={{
                fontSize: "medium",
                cursor: "pointer",
                height: "100%",
                width: "1.2rem",
                color: "#707070",
                marginRight: "2px",
                marginTop: "8px",
                // display: props.disabled ? "none": ""
              }}
              onClick={props.setModalClosed}
            />
          </div>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.dataContainer}>
            <p>
              <input
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setErrorMessage("");
                  setDisableBtn(false);
                }}
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.newNameInput
                    : styles.txtField
                }
              />
            </p>
          </div>
        </div>
        <div
          className={
            direction == RTL_DIRECTION
              ? styles.modalFooterRTL
              : styles.modalFooter
          }
        >
          <div
            className={
              direction == RTL_DIRECTION
                ? styles.modalFooterInnerRTL
                : styles.modalFooterInner
            }
          >
            <Button
              id="cancelMapRes"
              className={`tertiary`}
              color="primary"
              variant="outlined"
              size="small"
              onClick={props.setModalClosed}
            >
              {t("cancel")}
            </Button>
            <Button
              id="mapDataModalRes"
              className={`primary`}
              variant="contained"
              size="small"
              disabled={disableBtn}
              onClick={updateTemplate}
            >
              {t("save")} {t("changes")}
            </Button>
          </div>
        </div>
      </Box>
    </>
  );
}

export default RenameTemplate;
