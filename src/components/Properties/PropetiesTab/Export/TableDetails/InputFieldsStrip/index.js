import React, { useState, useEffect } from "react";
import { InputBase, MenuItem, Radio, Checkbox } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import clsx from "clsx";
import { getVariableType } from "../../../../../../utility/ProcessSettings/Triggers/getVariableType";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import Modal from "../../../../../../UI/Modal/Modal";
import MappingDataModal from "../MappingDataModal";
import {
  ERROR_MANDATORY,
  EXPORT_PRIMARY_CONSTRAINT_TYPE,
  EXPORT_UNIQUE_CONSTRAINT_TYPE,
} from "../../../../../../Constants/appConstants";
import CustomizedDropdown from "../../../../../../UI/Components_With_ErrrorHandling/Dropdown";
import TextInput from "../../../../../../UI/Components_With_ErrrorHandling/InputField";

function InputFieldsStrip(props) {
  let { t } = useTranslation();
  const {
    setValue,
    mappingDetails,
    inputBaseValue,
    inputBaseHandler,
    dropdownValue,
    dropdownHandler,
    dropdownOptions,
    closeInputStrip,
    radioTypeValue,
    radioTypeHandler,
    addHandler,
    documentList,
    variablesList,
    secondInputBase,
    secondInputBaseHandler,
    checkDisabled,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConstraintsEnabled, setIsConstraintsEnabled] = useState(false);
  const [filteredVariables, setFilteredVariables] = useState(null);
  const [errorDetails, setErrorDetails] = useState({});

  // Function that gets called when the user clicks on add button.
  const addHandlerFunc = (value) => {
    if (inputBaseValue.trim() === "") {
      setErrorDetails({
        ...errorDetails,
        columnName: {
          errorMessage: t("mandatoryFieldStatement"),
          severity: "error",
          errorType: ERROR_MANDATORY,
        },
      });
    } else {
      setErrorDetails({
        ...errorDetails,
        columnName: {
          errorMessage: "",
          severity: "",
          errorType: "",
        },
      });
    }
    addHandler(value);
  };

  // Function that runs when the dropdownValue value changes.
  useEffect(() => {
    if (variablesList) {
      if (dropdownValue === "4") {
        const filteredArr = variablesList.filter(
          (element) =>
            element.VariableScope === "C" ||
            (element.VariableScope !== "C" &&
              (element.VariableType === "3" || element.VariableType === "4"))
        );
        setFilteredVariables(filteredArr);
      } else {
        const filteredArr = variablesList.filter(
          (element) =>
            element.VariableScope === "C" ||
            (element.VariableScope !== "C" &&
              element.VariableType === dropdownValue)
        );
        setFilteredVariables(filteredArr);
      }
    }
  }, [dropdownValue]);

  // Function that runs when the user selects a type from the dropdown.
  const onSelectType = (value) => {
    dropdownHandler(value);
    switch (value) {
      case "10":
        secondInputBaseHandler({
          precision: "0",
          length: "50",
        });
        break;
      case "6":
        secondInputBaseHandler({
          precision: "2",
          length: "15",
        });
        break;
      case "3":
        secondInputBaseHandler({
          precision: "0",
          length: "2",
        });
        break;
      case "4":
        secondInputBaseHandler({
          precision: "0",
          length: "4",
        });
        break;
      case "8":
        secondInputBaseHandler({
          precision: "0",
          length: "8",
        });
        break;
    }
  };

  return (
    <div className={styles.inputFieldsMainDiv}>
      <TextInput
        inlineErrorStyles={styles.inlineErrorStyle}
        // readOnlyCondition={isProcessReadOnly}
        inputValue={inputBaseValue}
        classTag={styles.inputBase}
        onChangeEvent={(event) => inputBaseHandler(event.target.value)}
        name="columnName"
        idTag="table_details_column_name_input"
        errorStatement={errorDetails?.columnName?.errorMessage}
        errorSeverity={errorDetails?.columnName?.severity}
        errorType={errorDetails?.columnName?.errorType}
        inlineError={true}
      />
      <CustomizedDropdown
        id="export_input_strip_select"
        className={styles.typeInput}
        value={dropdownValue}
        onChange={(event) => onSelectType(event.target.value)}
      >
        {dropdownOptions?.map((d) => {
          return (
            <MenuItem className={styles.menuItemStyles} value={d}>
              {getVariableType(d)}
            </MenuItem>
          );
        })}
      </CustomizedDropdown>
      <div className={styles.constraintsRadioDiv}>
        <Checkbox
          size="small"
          checked={isConstraintsEnabled}
          onChange={() =>
            setIsConstraintsEnabled((prevData) => {
              if (prevData) {
                radioTypeHandler("");
              } else {
                radioTypeHandler(EXPORT_PRIMARY_CONSTRAINT_TYPE);
              }
              return !prevData;
            })
          }
        />
        <p className={styles.constraintsText}>{t("constraints")}</p>
        <Radio
          id="export_input_strip_primary_radio"
          checked={radioTypeValue === EXPORT_PRIMARY_CONSTRAINT_TYPE}
          onChange={(event) => radioTypeHandler(event.target.value)}
          value={EXPORT_PRIMARY_CONSTRAINT_TYPE}
          size="small"
          disabled={!isConstraintsEnabled}
        />
        <p
          className={clsx(
            styles.constraintsText,
            !isConstraintsEnabled && styles.disabledTextColor
          )}
        >
          {t("primaryKey")}
        </p>
        <Radio
          id="export_input_strip_unique_radio"
          checked={radioTypeValue === EXPORT_UNIQUE_CONSTRAINT_TYPE}
          onChange={(event) => radioTypeHandler(event.target.value)}
          value={EXPORT_UNIQUE_CONSTRAINT_TYPE}
          size="small"
          disabled={!isConstraintsEnabled}
        />
        <p
          className={clsx(
            styles.constraintsText,
            !isConstraintsEnabled && styles.disabledTextColor
          )}
        >
          {t("uniqueKey")}
        </p>
      </div>
      <div className={styles.flexRow}>
        <InputBase
          id="export_input_strip_input2"
          type="number"
          variant="outlined"
          className={styles.lengthData}
          onChange={(event) =>
            secondInputBaseHandler((prevData) => {
              return { ...prevData, length: event.target.value };
            })
          }
          value={secondInputBase.length}
          disabled={checkDisabled(dropdownValue)}
        />
        {dropdownValue === "6" ? (
          <div className={styles.flexRow}>
            <p className={styles.precisionText}>Precision:</p>
            <InputBase
              id="export_input_strip_input3"
              type="number"
              variant="outlined"
              className={clsx(styles.lengthData, styles.precisionInput)}
              onChange={(event) =>
                secondInputBaseHandler((prevData) => {
                  return { ...prevData, precision: event.target.value };
                })
              }
              value={secondInputBase.precision}
            />
          </div>
        ) : null}
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
            width: "28%",
            height: "54%",
            left: "35%",
            top: "27%",
            padding: "0px",
          }}
        >
          <MappingDataModal
            setValue={setValue}
            handleClose={() => setIsModalOpen(false)}
            documentList={documentList}
            variablesList={filteredVariables}
            mappingDetails={mappingDetails}
            // variableTypeValue={dropdownValue}
          />
        </Modal>
        <button
          id="export_input_strip_add_button"
          // disabled={inputBaseValue === "" || dropdownValue === ""}
          onClick={() => addHandlerFunc(isConstraintsEnabled)}
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
