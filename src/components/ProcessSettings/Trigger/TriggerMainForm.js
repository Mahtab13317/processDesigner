import React from "react";
import { useTranslation } from "react-i18next";
import { triggerTypeOptions } from "../../../utility/ProcessSettings/Triggers/triggerTypeOptions";
import { MenuItem, Select } from "@material-ui/core";
import styles from "./trigger.module.css";
import arabicStyles from "./triggerArabicStyles.module.css";
import {
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
  STATE_ADDED,
  STATE_EDITED,
} from "../../../Constants/appConstants";
import "./commonTrigger.css";

function TriggerMainFormView(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let {
    nameInput,
    setNameInput,
    typeInput,
    setTypeInput,
    descInput,
    setDescInput,
    triggerTypeOptionList,
    selectedField,
    setSelectedField,
  } = props;
  let readOnlyProcess = props.processType !== PROCESSTYPE_LOCAL;

  return (
    <div className={styles.triggerFormView}>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.triggerNameTypeDiv
            : styles.triggerNameTypeDiv
        }
      >
        <div className="flex">
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.triggerFormLabel
                : styles.triggerFormLabel
            }
          >
            {t("trigger")}{" "}
            <span className="relative">
              {t("name")}
              <span
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.starIcon
                    : styles.starIcon
                }
              >
                *
              </span>
            </span>
          </div>
          <input
            id="trigger_name"
            autofocus
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              if (selectedField.status === STATE_ADDED) {
                setSelectedField((prev) => {
                  return { ...prev, status: STATE_EDITED };
                });
              }
            }}
            className={
              direction === RTL_DIRECTION
                ? `${arabicStyles.triggerFormInput} ${arabicStyles.nameFormInput}`
                : `${styles.triggerFormInput} ${styles.nameFormInput}`
            }
            disabled={readOnlyProcess}
          />
        </div>
        <div className="flex">
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.triggerFormLabel
                : styles.triggerFormLabel
            }
          >
            <span className="relative">
              {t("type")}
              <span
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.starIcon
                    : styles.starIcon
                }
              >
                *
              </span>
            </span>
          </div>
          <Select
            className={
              direction === RTL_DIRECTION
                ? `${arabicStyles.triggerFormInput} triggerSelectInput_arabicView`
                : `${styles.triggerFormInput} triggerSelectInput`
            }
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
            inputProps={{
              readOnly: readOnlyProcess,
            }}
            value={typeInput}
            onChange={(e) => {
              setTypeInput(e.target.value);
              if (selectedField.status === STATE_ADDED) {
                setSelectedField((prev) => {
                  return { ...prev, status: STATE_EDITED };
                });
              }
            }}
            id={`trigger_type_list`}
          >
            {triggerTypeOptionList.map((option) => {
              return (
                <MenuItem
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.triggerDropdownData
                      : styles.triggerDropdownData
                  }
                  value={option}
                >
                  {t(triggerTypeOptions(option)[0])}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      </div>
      <div className="flex">
        <span
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.triggerFormLabel
              : styles.triggerFormLabel
          }
        >
          {t("Discription")}
          {/*code added on 26 April 2022 for BugId 108472*/}
          <span
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.starIcon
                : styles.starIcon
            }
          >
            *
          </span>
        </span>
        <textarea
          id="trigger_description"
          value={descInput}
          disabled={readOnlyProcess}
          onChange={(e) => {
            setDescInput(e.target.value);
            if (selectedField.status === STATE_ADDED) {
              setSelectedField((prev) => {
                return { ...prev, status: STATE_EDITED };
              });
            }
          }}
          className={
            direction === RTL_DIRECTION
              ? `${arabicStyles.triggerFormInput} ${arabicStyles.descriptionInput}`
              : `${styles.triggerFormInput} ${styles.descriptionInput}`
          }
        />
      </div>
    </div>
  );
}

export default TriggerMainFormView;
