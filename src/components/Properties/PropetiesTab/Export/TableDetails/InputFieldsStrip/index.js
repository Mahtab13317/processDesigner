import React, { useState } from "react";
import { Select, InputBase, MenuItem, Radio } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import { getVariableType } from "../../../../../../utility/ProcessSettings/Triggers/getVariableType";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import Modal from "../../../../../../UI/Modal/Modal";
import MappingDataModal from "../MappingDataModal";
import {
  EXPORT_PRIMARY_CONSTRAINT_TYPE,
  EXPORT_UNIQUE_CONSTRAINT_TYPE,
} from "../../../../../../Constants/appConstants";

function InputFieldsStrip(props) {
  let { t } = useTranslation();
  const {
    setValue,
    inputBaseValue,
    inputBaseHandler,
    dropdownValue,
    dropdownHandler,
    dropdownOptions,
    closeInputStrip,
    radioTypeValue,
    radioTypeHandler,
    addHandler,
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.inputFieldsMainDiv}>
      <InputBase
        id="export_input_strip_input"
        autoFocus
        variant="outlined"
        className={styles.inputBase}
        onChange={(event) => inputBaseHandler(event.target.value)}
        value={inputBaseValue}
      />
      <Select
        id="export_input_strip_select"
        MenuProps={menuProps}
        className={styles.typeInput}
        value={dropdownValue}
        onChange={(event) => dropdownHandler(event.target.value)}
      >
        {dropdownOptions &&
          dropdownOptions.map((d) => {
            return (
              <MenuItem className={styles.menuItemStyles} value={d}>
                {getVariableType(d)}
              </MenuItem>
            );
          })}
      </Select>
      <div className={styles.constraintsRadioDiv}>
        <Radio
          id="export_input_strip_primary_radio"
          checked={radioTypeValue === EXPORT_PRIMARY_CONSTRAINT_TYPE}
          onChange={radioTypeHandler}
          value={EXPORT_PRIMARY_CONSTRAINT_TYPE}
          size="small"
        />
        <p className={styles.constraintsText}>{t("primaryKey")}</p>
        <Radio
          id="export_input_strip_unique_radio"
          checked={radioTypeValue === EXPORT_UNIQUE_CONSTRAINT_TYPE}
          onChange={radioTypeHandler}
          value={EXPORT_UNIQUE_CONSTRAINT_TYPE}
          size="small"
        />
        <p className={styles.constraintsText}>{t("uniqueKey")}</p>
      </div>
      <div className={styles.buttonsDiv}>
        <MoreHorizOutlinedIcon
          id="export_input_strip_more_options"
          onClick={() => setIsModalOpen(true)}
          className={styles.moreOptionsInput}
          fontSize="small"
        />
        <Modal
          show={isModalOpen}
          modalClosed={() => setIsModalOpen(false)}
          style={{
            width: "25%",
            height: "45%",
            left: "36%",
            top: "34%",
            padding: "0px",
          }}
        >
          <MappingDataModal
            setValue={setValue}
            handleClose={() => setIsModalOpen(false)}
          />
        </Modal>
        <button
          id="export_input_strip_add_button"
          disabled={inputBaseValue === "" || dropdownValue === ""}
          onClick={addHandler}
          className={styles.addButton}
        >
          <span className={styles.addButtonText}>{t("add")}</span>
        </button>
        <ClearOutlinedIcon
          id="export_input_strip_close_strip"
          onClick={closeInputStrip}
          className={styles.closeInputStrip}
        />
      </div>
    </div>
  );
}

export default InputFieldsStrip;
