import React, { useState, useEffect } from "react";
import { Select, MenuItem } from "@material-ui/core";
import styles from "../properties.module.css";
import arabicStyles from "../propertiesArabicStyles.module.css";
import SearchComponent from "../../../../../UI/Search Component";
import filter from "../../../../../assets/Tiles/Filter.svg";
import { useTranslation } from "react-i18next";
import { getVariableType } from "../../../../../utility/ProcessSettings/Triggers/getVariableType";
import {
  CONSTANT,
  DEFAULT,
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
} from "../../../../../Constants/appConstants";
import { TRIGGER_CONSTANT } from "../../../../../Constants/triggerConstants";
import { connect } from "react-redux";

function DataDropDown(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [typeInput, setTypeInput] = useState(props.value);
  const [constantSelected, setConstantSelected] = useState(false);
  const [constantValue, setConstantValue] = useState("");
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

  useEffect(() => {
    if (props.constantAdded && constantSelected) {
      if (!props.value) {
        document.getElementById("trigger_set_constantVal").focus();
      }
    }
  }, [constantSelected]);

  useEffect(() => {
    if (props.constantAdded && constantValue) {
      if (
        (props.value && constantValue !== props.value.VariableName) ||
        !props.value
      ) {
        props.setFieldValue({
          value: constantValue,
          row_id: props.id,
          type: props.type,
          constant: true,
        });
      }
    }
  }, [constantValue]);

  useEffect(() => {
    if (props.value && props.value.constant && props.constantAdded) {
      setConstantValue(props.value.VariableName);
      setConstantSelected(true);
      setTypeInput("");
    } else {
      setTypeInput(props.value ? props.value : DEFAULT);
      setConstantSelected(false);
    }
  }, [props.value]);

  return (
    <div className={`relative`}>
      {constantSelected && (
        <div>
          <span
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.dataDropdownConstantIcon
                : styles.dataDropdownConstantIcon
            }
          >
            {t(TRIGGER_CONSTANT)}
          </span>
          <input
            id="trigger_set_constantVal"
            autofocus
            value={constantValue}
            disabled={readOnlyProcess}
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.dataDropdownConstInput
                : styles.dataDropdownConstInput
            }
            onChange={(e) => setConstantValue(e.target.value)}
          />
        </div>
      )}
      <Select
        className={
          direction === RTL_DIRECTION
            ? `${arabicStyles.triggerSelectDropdown} triggerSelectDropdown_arabicView`
            : styles.triggerSelectDropdown
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
          props.setRowSelected(null);
          if (e.target.value !== t(CONSTANT)) {
            setConstantSelected(false);
            setTypeInput(e.target.value);
            props.setFieldValue({
              value: e.target.value,
              row_id: props.id,
              type: props.type,
              constant: false,
            });
          } else {
            setTypeInput("");
            setConstantSelected(true);
          }
        }}
        id={`${props.uniqueId}_${props.id}_select`}
      >
        <div
          className={
            direction === RTL_DIRECTION
              ? `flex ${arabicStyles.filterSetTrigger}`
              : `flex ${styles.filterSetTrigger}`
          }
        >
          <SearchComponent
            width="100%"
            id={`${props.uniqueId}_${props.id}_search`}
          />
          <button
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.filterTriggerButton
                : styles.filterTriggerButton
            }
            id={`${props.uniqueId}_${props.id}_filter`}
          >
            <img src={filter} alt="" />
          </button>
        </div>
        <MenuItem className={styles.defaultSelectValue} value={DEFAULT}>
          <span>{t("selectVariable")}</span>
        </MenuItem>
        {props.constantAdded && (
          <MenuItem
            className={styles.triggerSelectDropdownList}
            id={`${props.uniqueId}_${props.id}_constant`}
            value={t(CONSTANT)}
          >
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.dropdownVariableDiv
                  : styles.dropdownVariableDiv
              }
            >
              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.dropdownVariable
                    : styles.dropdownVariable
                }
              >
                <span>{t(CONSTANT)}</span>
              </div>
            </div>
          </MenuItem>
        )}
        {props.triggerTypeOptions?.map((option, index) => {
          return (
            <MenuItem
              className={styles.triggerSelectDropdownList}
              value={option}
            >
              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.dropdownVariableDiv
                    : styles.dropdownVariableDiv
                }
              >
                <div
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.dropdownVariable
                      : styles.dropdownVariable
                  }
                >
                  <span>{option.VariableName}</span>
                  <span>{option.SystemDefinedName}</span>
                </div>
                <span className={styles.dropdownVariableType}>
                  {t(getVariableType(option.VariableType))}
                </span>
              </div>
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps, null)(DataDropDown);
