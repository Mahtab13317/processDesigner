import React, { useState, useEffect } from "react";
import {
  Radio,
  Select,
  MenuItem,
  InputBase,
  Checkbox,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "state-pool";
import styles from "./index.module.css";

function MappingDataModal(props) {
  let { t } = useTranslation();
  const [variableDefinition] = useGlobalState("variableDefinition");
  const {
    index,
    dataFields,
    setDataFields,
    setValue,
    handleClose,
    fieldName,
    isProcessReadOnly,
  } = props;
  const [typeValue, setTypeValue] = useState("");
  const [mappedField, setMappedField] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const documentDropdownOptions = [
    "Aadhar_Card",
    "Application_Form",
    "PAN_Card",
    "CA_Certificate",
  ];

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

  // Function that runs when the component loads.
  useEffect(() => {
    getDataDropdownOptions();
    if (dataFields && dataFields.DataMap) {
      let temp = { ...dataFields };
      temp.DataMap.forEach((element) => {
        if (element.FieldName === fieldName) {
          setTypeValue(element.DocTypeId);
          setMappedField(element.MappedFieldName);
        }
      });
    }
  }, [dataFields]);

  // Function to get dropdown options.
  const getDataDropdownOptions = () => {
    const emptyArr = [];
    setDropdownOptions([...emptyArr]);
    const tempOptions = [...dropdownOptions];
    variableDefinition &&
      variableDefinition.forEach((element) => {
        tempOptions.push(element.VariableName);
      });
    setDropdownOptions(tempOptions);
  };

  // Function that runs when a component loads.
  useEffect(() => {
    getDataDropdownOptions();
  }, [variableDefinition]);

  // Function that gets called when the user clicks on ok button.
  const handleSaveChanges = () => {
    console.log("%%%%%", dataFields);

    // let temp = { ...dataFields };
    // temp.DataMap[index].DocTypeId = typeValue;
    // temp.DataMap[index].MappedFieldName = mappedField;
    // setDataFields(temp);

    // handleClose();

    if (index > -1) {
      let temp = dataFields;
      temp.DataMap[index].DocTypeId = typeValue;
      temp.DataMap[index].MappedFieldName = mappedField;
      setDataFields({ ...temp });
      handleClose();
    } else {
      const obj = {
        mappingType: typeValue,
        mappedField: mappedField,
      };
      setValue({ ...obj });
      handleClose();
    }
  };

  // Function that runs when a component loads.
  useEffect(() => {
    if (typeValue === "0") {
      getDataDropdownOptions();
    } else if (typeValue === "1") {
      setDropdownOptions([...documentDropdownOptions]);
    }
  }, []);

  // Function that handles type.
  const handleType = (event) => {
    setTypeValue(event.target.value);
    setMappedField("");
    if (event.target.value === "0") {
      getDataDropdownOptions();
    } else {
      setDropdownOptions([...documentDropdownOptions]);
    }
  };

  return (
    <div>
      <div className={styles.headingsDiv}>
        <p className={styles.heading}>{t("exportMapping")}</p>
      </div>
      <div className={styles.flexRow}>
        <Radio
          disabled={isProcessReadOnly}
          id="mapping_data_modal_data_radio"
          checked={typeValue === "0"}
          onChange={handleType}
          value={"0"}
          size="small"
        />
        <p className={styles.text}>{t("data")}</p>
        <Radio
          disabled={isProcessReadOnly}
          id="mapping_data_modal_document_radio"
          checked={typeValue === "1"}
          onChange={handleType}
          value={"1"}
          size="small"
        />
        <p className={styles.text}>{t("document")}</p>
      </div>
      <div className={styles.mappedFieldDiv}>
        <p className={styles.mappedField}>{t("mappedField")}</p>
        <Select
          disabled={isProcessReadOnly}
          id="mapping_data_modal_mapped_field_dropdown"
          MenuProps={menuProps}
          className={styles.typeInput}
          value={mappedField}
          onChange={(event) => setMappedField(event.target.value)}
        >
          {dropdownOptions &&
            dropdownOptions.map((d) => {
              return (
                <MenuItem className={styles.menuItemStyles} value={d}>
                  {d}
                </MenuItem>
              );
            })}
        </Select>
      </div>
      <div className={styles.flexRow}>
        <p className={styles.mappedField}>{t("length")}</p>
        <InputBase
          id="mapping_data_modal_length_input"
          disabled
          variant="outlined"
          className={styles.inputBase}
        />
        <p className={styles.quotesText}>{t("quotes")}</p>
        <Checkbox
          disabled={isProcessReadOnly}
          id="mapping_data_modal_quotes_checkbox"
          className={styles.orderByCheckBox}
          size="small"
        />
      </div>
      <div className={styles.flexRow}>
        <p className={styles.mappedField}>{t("alignment")}</p>
        <Radio
          disabled={isProcessReadOnly}
          id="mapping_data_modal_left_radio"
          disabled
          checked={typeValue === "Left"}
          value={"Left"}
          size="small"
        />
        <p className={styles.text}>{t("left")}</p>
        <Radio
          disabled={isProcessReadOnly}
          id="mapping_data_modal_right_radio"
          disabled
          checked={typeValue === "Right"}
          value={"Right"}
          size="small"
        />
        <p className={styles.text}>{t("right")}</p>
        {!isProcessReadOnly ? (
          <div className={styles.buttonsDiv}>
            <button
              id="mapping_data_modal_save_changes_button"
              disabled={typeValue === "" || mappedField === ""}
              onClick={handleSaveChanges}
              className={styles.okButton}
            >
              <span className={styles.okButtonText}>{t("okSmallCase")}</span>
            </button>
            <button
              id="mapping_data_modal_cancel_button"
              onClick={handleClose}
              className={styles.cancelButton}
            >
              <span className={styles.cancelButtonText}>{t("cancel")}</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MappingDataModal;
