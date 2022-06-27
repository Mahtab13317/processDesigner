import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InputBase, MenuItem, Radio, Checkbox } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CustomizedDropdown from "../../../../../../UI/Components_With_ErrrorHandling/Dropdown";
import MappingModal from ".././MappingModal";
import {
  EXPORT_PRIMARY_CONSTRAINT_TYPE,
  EXPORT_UNIQUE_CONSTRAINT_TYPE,
} from "../../../../../../Constants/appConstants";
import styles from "./index.module.css";
import clsx from "clsx";
import { typeDropdownOptions } from ".././DropdownOptions";

function TableDataStrip(props) {
  let { t } = useTranslation();
  const {
    dataFields,
    isProcessReadOnly,
    fieldName,
    fieldType,
    attribute,
    index,
    handleFieldNameChange,
    checkFieldNameOnBlur,
    handleFieldTypeChange,
    handleAttributeChange,
    handleDeleteField,
    setDataFields,
    documentList,
    variablesList,
    getVariableType,
    precision,
    length,
    handleFieldLength,
    checkLengthOnBlur,
    handleFieldPrecision,
    checkPrecisionOnBlur,
    checkDisabled,
  } = props;
  const [constraintType, setConstraintType] = useState("Primary");
  const [isConstraintsEnabled, setIsConstraintsEnabled] = useState(false);
  const [previousDataFields, setPreviousDataFields] = useState({});
  const [previousColumnName, setPreviousColumnName] = useState("");
  const [previousLengthValue, setPreviousLengthValue] = useState("");
  const [previousPrecisionValue, setPreviousPrecisionValue] = useState("");

  // Function that runs when the user changes the constraint type field.
  const handleConstraintType = (event) => {
    if (isConstraintsEnabled) {
      setConstraintType(event.target.value);
      handleAttributeChange(event.target.value, index);
    }
  };

  // Function that runs when the attribute value changes.
  useEffect(() => {
    if (attribute) {
      setConstraintType(attribute);
      setIsConstraintsEnabled(true);
    }
  }, [attribute]);

  // Function that runs when the constraint checbox is clicked.
  const handleConstraintCheckbox = () => {
    let prevValue = false;
    setIsConstraintsEnabled((prevData) => {
      prevValue = prevData;
      return !prevData;
    });
    if (!prevValue) {
      setConstraintType("");
      handleAttributeChange("", index);
    } else {
      setConstraintType("Primary");
    }
  };

  return (
    <div>
      <div className={styles.fieldDataDiv}>
        <InputBase
          disabled={isProcessReadOnly}
          id="table_details_field_name_input"
          variant="outlined"
          className={styles.inputBaseData}
          onFocus={() => {
            setPreviousColumnName(fieldName);
            setPreviousDataFields(dataFields);
          }}
          onBlur={(event) => {
            setTimeout(
              checkFieldNameOnBlur(
                event,
                index,
                previousColumnName,
                previousDataFields
              ),
              500
            );
          }}
          onChange={(event) => handleFieldNameChange(event, index)}
          value={fieldName}
        />
        <CustomizedDropdown
          disabled={isProcessReadOnly}
          id="table_details_field_type_dropdown"
          className={styles.typeInputData}
          value={fieldType}
          onChange={(event) => handleFieldTypeChange(event, index)}
          isNotMandatory={true}
        >
          {typeDropdownOptions?.map((d) => {
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
            onChange={handleConstraintCheckbox}
          />
          <p className={styles.constraintsText}>{t("constraints")}</p>
          <Radio
            id="export_input_strip_primary_radio"
            checked={constraintType === EXPORT_PRIMARY_CONSTRAINT_TYPE}
            onChange={handleConstraintType}
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
            checked={constraintType === EXPORT_UNIQUE_CONSTRAINT_TYPE}
            onChange={handleConstraintType}
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
            id="export_data_strip_input2"
            type="number"
            variant="outlined"
            className={clsx(styles.lengthData, styles.lengthInput)}
            onFocus={() => setPreviousLengthValue(length)}
            onBlur={(event) =>
              checkLengthOnBlur(
                event,
                index,
                fieldType,
                previousLengthValue,
                precision
              )
            }
            onChange={(event) => handleFieldLength(event, index)}
            value={length}
            disabled={checkDisabled(fieldType)}
          />
          {fieldType === "6" ? (
            <div className={styles.flexRow}>
              <p className={styles.precisionText}>Precision:</p>
              <InputBase
                id="export_input_strip_input3"
                type="number"
                variant="outlined"
                className={clsx(styles.lengthData, styles.precisionInput)}
                onFocus={() => setPreviousPrecisionValue(precision)}
                onBlur={(event) =>
                  checkPrecisionOnBlur(
                    event,
                    index,
                    fieldType,
                    length,
                    previousPrecisionValue
                  )
                }
                onChange={(event) => handleFieldPrecision(event, index)}
                value={precision}
              />
            </div>
          ) : null}
        </div>
        <MappingModal
          index={index}
          fieldName={fieldName}
          dataFields={dataFields}
          setDataFields={setDataFields}
          isProcessReadOnly={isProcessReadOnly}
          documentList={documentList}
          variablesList={variablesList}
        />
        {!isProcessReadOnly ? (
          <DeleteOutlinedIcon
            id="table_details_delete_field_button"
            onClick={() => handleDeleteField(fieldName, index)}
            className={styles.deleteIcon}
          />
        ) : null}
      </div>
    </div>
  );
}

export default TableDataStrip;
