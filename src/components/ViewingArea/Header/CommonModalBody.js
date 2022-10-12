import React from "react";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import styles from "./modal.module.css";
import {
  MENUOPTION_CHECKIN,
  MENUOPTION_CHECKOUT,
  MENUOPTION_DISABLE,
  MENUOPTION_ENABLE,
  MENUOPTION_SAVE_NEW_V,
  VERSION_TYPE_MAJOR,
  VERSION_TYPE_MINOR,
} from "../../../Constants/appConstants";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from "@material-ui/core";

function CommonModalBody(props) {
  let { t } = useTranslation();

  return (
    <React.Fragment>
      <div className={styles.subHeader}>
        {`${props.modalHead}`}{" "}
        {props.modalType !== MENUOPTION_ENABLE &&
        props.modalType !== MENUOPTION_DISABLE &&
        props.modalType !== MENUOPTION_SAVE_NEW_V
          ? `: ${props.openProcessName}`
          : null}
      </div>
      {props.isActionsDisabled ? (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "18px",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#606060",
                marginBottom: "2px",
              }}
            >
              Process Name
            </p>
            <p
              style={{ fontSize: "12px", color: "#000000", fontWeight: "600" }}
            >
              {props.openProcessName}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "0px 18px",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#D53D3D",
                marginBottom: "2px",
              }}
            >
              CheckIn Failed
            </p>
            <p style={{ fontSize: "12px", color: "#606060" }}>
              Some errors and Warnings present{" "}
              <span
                style={{
                  color: "#0172C6",
                  fontSize: "12px",
                  cursor: "pointer",
                  marginLeft: "25px",
                }}
                onClick={() => {
                  props.toggleDrawer();
                  props.setModalClosed();
                }}
              >
                View details
              </span>
            </p>
          </div>
        </>
      ) : (
        <div className={styles.subForm}>
          {props.modalType === MENUOPTION_CHECKOUT ? (
            <p className={styles.checkoutString}>
              {t("checkOutNote")}{" "}
              <span style={{ fontWeight: "700" }}>{props.projectName}</span>
            </p>
          ) : null}
          {props.modalType === MENUOPTION_SAVE_NEW_V ? (
            <p className="flex">
              <span className={styles.versionTypeHeading}>{t("Version")}</span>
              <RadioGroup
                name="createChildWorkitem"
                className={styles.saveNew_radioDiv}
                value={props.selectedType}
                onChange={(e) => {
                  props.setSelectedType(e.target.value);
                }}
              >
                <FormControlLabel
                  value={VERSION_TYPE_MAJOR}
                  id="major_version_opt"
                  control={<Radio style={{ color: "var(--radio_color)" }} />}
                  label={`${t("Major")} ${t("Version")} (${(
                    +props.existingVersion + 1
                  ).toFixed(1)})`}
                  className={styles.saveNew_radioButton}
                />
                <FormControlLabel
                  value={VERSION_TYPE_MINOR}
                  id="minor_version_opt"
                  control={<Radio style={{ color: "var(--radio_color)" }} />}
                  label={`${t("Minor")} ${t("Version")} (${(
                    +props.existingVersion + 0.1
                  ).toFixed(1)})`}
                  className={styles.saveNew_radioButton}
                />
              </RadioGroup>
            </p>
          ) : null}
          <p className="flex">
            <span className={styles.commentHeading}>
              {t("comment")}
              {props.commentMandatory ? (
                <span className={styles.starIcon}>*</span>
              ) : null}
            </span>
            <textarea
              id={`${props.id}_commentField`}
              className={styles.commentArea}
              value={props.comment}
              onChange={(e) => props.setComment(e.target.value)}
            />
          </p>
        </div>
      )}
      <div className={styles.footer}>
        <Button
          id={`${props.id}_cancelBtn`}
          className={styles.cancelCategoryButton}
          onClick={() => props.setModalClosed()}
        >
          {t("cancel")}
        </Button>
        {props.modalType === MENUOPTION_CHECKIN ? (
          props.isBtnTwoProcessing ? (
            <Button
              className={
                ((props.comment.trim() === "" || !props.comment) &&
                  props.commentMandatory) ||
                props.isActionsDisabled
                  ? styles.disabledCategoryButton
                  : styles.outlinedButton
              }
              id={`${props.id}_btn2`}
              disabled={
                ((props.comment.trim() === "" || !props.comment) &&
                  props.commentMandatory) ||
                props.isActionsDisabled
              }
            >
              <span>
                <CircularProgress
                  color="#FFFFFF"
                  style={{
                    height: "1.5rem",
                    width: "1.5rem",
                    marginRight: "8px",
                  }}
                ></CircularProgress>
              </span>
              {props.buttonTwo}
            </Button>
          ) : (
            <Button
              className={
                ((props.comment.trim() === "" || !props.comment) &&
                  props.commentMandatory) ||
                props.isActionsDisabled
                  ? styles.disabledCategoryButton
                  : styles.outlinedButton
              }
              id={`${props.id}_btn2`}
              onClick={props.buttonTwoFunc}
              disabled={
                ((props.comment.trim() === "" || !props.comment) &&
                  props.commentMandatory) ||
                props.isActionsDisabled
              }
            >
              {props.buttonTwo}
            </Button>
          )
        ) : null}
        {props.isBtnOneProcessing ? (
          <Button
            className={
              (props.comment.trim() === "" || !props.comment) &&
              props.commentMandatory
                ? styles.disabledCategoryButton
                : styles.addCategoryButton
            }
            id={`${props.id}_btn1`}
          >
            <span>
              <CircularProgress
                color="#FFFFFF"
                style={{
                  height: "1.5rem",
                  width: "1.5rem",
                  marginRight: "8px",
                }}
              ></CircularProgress>
            </span>
            {props.buttonOne}
          </Button>
        ) : (
          <Button
            className={
              ((props.comment.trim() === "" || !props.comment) &&
                props.commentMandatory) ||
              props.isActionsDisabled
                ? styles.disabledCategoryButton
                : styles.addCategoryButton
            }
            onClick={props.buttonOneFunc}
            disabled={
              ((props.comment.trim() === "" || !props.comment) &&
                props.commentMandatory) ||
              props.isActionsDisabled
            }
            id={`${props.id}_btn1`}
          >
            {props.buttonOne}
          </Button>
        )}
      </div>
    </React.Fragment>
  );
}

export default CommonModalBody;
