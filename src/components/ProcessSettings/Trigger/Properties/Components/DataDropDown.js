import React, { useState, useEffect } from "react";
import { Select, MenuItem, ListSubheader, TextField } from "@material-ui/core";
import styles from "../properties.module.css";
import arabicStyles from "../propertiesArabicStyles.module.css";
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
import Lens from "../../../../../assets/lens.png";
import "../../commonTrigger.css";
import { containsText } from "../../../../../utility/CommonFunctionCall/CommonFunctionCall";

function DataDropDown(props) {
  // code edited on 19 Sep 2022 for BugId 115557
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [typeInput, setTypeInput] = useState(props.value);
  const [constantSelected, setConstantSelected] = useState(false);
  const [constantValue, setConstantValue] = useState("");
  const [searchText, setSearchText] = useState("");
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

  const displayedOptions = props.triggerTypeOptions?.filter((option) =>
    containsText(option?.VariableName, searchText)
  );

  useEffect(() => {
    if (props.constantAdded && constantSelected) {
      if (!props.value) {
        document.getElementById(`trigger_set_constantVal_${props.id}`).focus();
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
      setConstantValue("");
      if (props.setValueDropdownFunc) {
        props.setValueDropdownFunc(props.value?.VariableType);
      }
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
            id={`trigger_set_constantVal_${props.id}`}
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
          autoFocus: false,
          PaperProps: {
            style: {
              maxHeight: props.maxHeight ? props.maxHeight : "15rem",
            },
          },
        }}
        inputProps={{
          readOnly: readOnlyProcess,
        }}
        value={typeInput}
        onChange={(e) => {
          props.setRowSelected(null);
          if (e.target.value !== t(CONSTANT)) {
            setConstantSelected(false);
            setConstantValue("");
            setTypeInput(e.target.value);
            props.setFieldValue({
              value: e.target.value,
              row_id: props.id,
              type: props.type,
              constant: false,
            });
            if (props.setValueDropdownFunc) {
              props.setValueDropdownFunc(e.target.value?.VariableType);
            }
          } else {
            setTypeInput("");
            setConstantSelected(true);
          }
        }}
        onClose={() => setSearchText("")}
        // This prevents rendering empty string in Select's value
        // if search text would exclude currently selected option.
        renderValue={() => {
          return typeInput === DEFAULT ? (
            t("selectVariable")
          ) : (
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
                <span>{typeInput.VariableName}</span>
                <span>{typeInput.SystemDefinedName}</span>
              </div>
              <span className={styles.dropdownVariableType}>
                {t(getVariableType(typeInput.VariableType))}
              </span>
            </div>
          );
        }}
        id={`${props.uniqueId}_${props.id}_select`}
      >
        {/* TextField is put into ListSubheader so that it doesn't
            act as a selectable item in the menu
            i.e. we can click the TextField without triggering any selection.*/}
        <ListSubheader
          className={styles.dataDropdownListHeader}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={styles.searchBox} id="searchBoxDrop">
            <TextField
              size="small"
              // Autofocus on textfield
              autoFocus
              placeholder="Type to search..."
              fullWidth
              className={styles.searchTextField}
              onChange={(e) => setSearchText(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
            />
            <div className={styles.searchIcon}>
              <img src={Lens} alt="lens" width="16px" height="16px" />
            </div>
          </div>
        </ListSubheader>
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
        {displayedOptions?.map((option, index) => {
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
