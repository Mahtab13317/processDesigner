import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import { Select, InputBase, MenuItem, Checkbox } from "@material-ui/core";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import { RTL_DIRECTION } from "../../../../../../Constants/appConstants";

function InputFieldsStrip(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const {
    closeInputStrip,
    columnAliasName,
    setColumnAliasName,
    columnVariableType,
    setColumnVariableType,
    columnDataField,
    setColumnDataField,
    primaryKey,
    setPrimaryKey,
    tableColumnDetails,
    setTableColumnDetails,
    setColumnData,
    columnDropdownOptions,
    getVariableType,
  } = props;

  const menuProps = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    getContentAnchorEl: null,
  };

  // Function that adds a new column to the table mapping.
  const handleAddColumn = () => {
    const newColumnObj = {
      aliasName: columnAliasName,
      variableType: columnVariableType,
      dataField: columnDataField,
      isAutoIncrement: false,
      isPrimaryKey: primaryKey || false,
      isForiegnKey: false,
    };
    tableColumnDetails.push(newColumnObj);
    setTableColumnDetails([...tableColumnDetails]);
    setColumnData([...tableColumnDetails]);
    setColumnAliasName("");
    setColumnVariableType("");
    setColumnDataField("");
    setPrimaryKey("");
  };

  return (
    <div className={styles.mainDiv}>
      <InputBase
        autoFocus
        variant="outlined"
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.inputBase
            : styles.inputBase
        }
        onChange={(event) => setColumnAliasName(event.target.value)}
        value={columnAliasName}
      />
      <Select
        MenuProps={menuProps}
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.typeInput
            : styles.typeInput
        }
        value={columnVariableType}
        onChange={(event) => setColumnVariableType(event.target.value)}
      >
        {columnDropdownOptions &&
          columnDropdownOptions.map((d) => {
            return (
              <MenuItem
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.menuItemStyles
                    : styles.menuItemStyles
                }
                value={d}
              >
                {getVariableType(d)}
              </MenuItem>
            );
          })}
      </Select>
      <InputBase
        variant="outlined"
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.dataFieldInput
            : styles.dataFieldInput
        }
        onChange={(event) => setColumnDataField(event.target.value)}
        value={columnDataField}
      />
      <Checkbox
        checked={primaryKey}
        onChange={() => setPrimaryKey(!primaryKey)}
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.checkboxInput
            : styles.checkboxInput
        }
        size="small"
      />
      <p
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.primaryKeyText
            : styles.primaryKeyText
        }
      >
        {t("primaryKey")}
      </p>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.buttonsDiv
            : styles.buttonsDiv
        }
      >
        <MoreHorizOutlinedIcon
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.moreOptionsInput
              : styles.moreOptionsInput
          }
          fontSize="small"
        />
        <button
          disabled={
            columnAliasName === "" ||
            columnVariableType === "" ||
            columnDataField === ""
          }
          onClick={handleAddColumn}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.addButton
              : styles.addButton
          }
        >
          <span className={styles.addButtonText}>{t("addDataObject")}</span>
        </button>
        <ClearOutlinedIcon
          onClick={closeInputStrip}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.closeInputStrip
              : styles.closeInputStrip
          }
        />
      </div>
    </div>
  );
}

export default InputFieldsStrip;
