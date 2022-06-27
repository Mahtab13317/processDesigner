import React, { useState, useEffect } from "react";
import { Radio, MenuItem, InputBase, Checkbox } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import CustomizedDropdown from "../../../../../../UI/Components_With_ErrrorHandling/Dropdown";
import { setToastDataFunc } from "../../../../../../redux-store/slices/ToastDataHandlerSlice";

function MappingDataModal(props) {
  let { t } = useTranslation();
  const {
    index,
    dataFields,
    setDataFields,
    setValue,
    handleClose,
    fieldName,
    isProcessReadOnly,
    documentList,
    variablesList,
  } = props;
  const dispatch = useDispatch();
  const [typeValue, setTypeValue] = useState("0");
  const [mappedField, setMappedField] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [docList, setDocList] = useState([]);
  const [varList, setVarList] = useState([]);
  const [length, setLength] = useState("0");
  const [alignment, setAlignment] = useState("L");
  const [quoteFlag, setQuoteFlag] = useState("N");
  const [exportAllDocsFlag, setExportAllDocsFlag] = useState("N");

  // Function that runs when the component runs.
  useEffect(() => {
    setDocList(documentList);
    setVarList(variablesList);
    getDataDropdownOptions();
  }, []);

  // Function that runs when the component loads.
  useEffect(() => {
    if (dataFields && dataFields.mappingList) {
      let temp = { ...dataFields };
      temp.mappingList.forEach((element) => {
        if (element.m_objExportMappedFieldInfo.fieldName === fieldName) {
          setTypeValue(element.m_objExportMappedFieldInfo.docTypeId);
          setMappedField(element.m_objExportMappedFieldInfo.mappedFieldName);
          setLength(element.m_objExportMappedFieldInfo.fieldLength);
          setExportAllDocsFlag(
            element.m_objExportMappedFieldInfo.exportAllDocs
          );
          setAlignment(element.m_objExportMappedFieldInfo.alignment);
          setQuoteFlag(element.m_objExportMappedFieldInfo.quoteflag);
        }
      });
    }
  }, [dataFields]);

  // Function to get dropdown options.
  const getDataDropdownOptions = () => {
    let tempOptions = [];
    variablesList &&
      variablesList.forEach((element) => {
        tempOptions.push(element.VariableName);
      });
    setDropdownOptions([...tempOptions]);
  };

  // Function that runs when a component loads.
  useEffect(() => {
    if (typeValue === "0") {
      getDataDropdownOptions();
    } else {
      let docArr = [];
      docList &&
        docList.forEach((element) => {
          docArr.push(element.DocName);
        });
      setDropdownOptions(docArr);
    }
  }, [varList]);

  // Function that gets called when the user clicks on ok button.
  const handleSaveChanges = () => {
    if (length !== "") {
      if (index > -1) {
        let temp = { ...dataFields };
        temp.mappingList[index].m_objExportMappedFieldInfo.docTypeId =
          typeValue;
        temp.mappingList[index].m_objExportMappedFieldInfo.mappedFieldName =
          mappedField;
        setDataFields({ ...temp });
        handleClose();
      } else {
        const obj = {
          mappingType: typeValue,
          mappedField: mappedField,
          length: length,
          alignment: alignment,
          quoteflag: quoteFlag,
          exportAllDocsFlag: exportAllDocsFlag,
        };
        setValue({ ...obj });
        handleClose();
      }
    } else {
      dispatch(
        setToastDataFunc({
          message: t("pleaseEnterValidLength"),
          severity: "error",
          open: true,
        })
      );
    }
  };

  // Function that runs when a component loads.
  useEffect(() => {
    if (typeValue === "0") {
      getDataDropdownOptions();
    } else {
      let docArr = [];
      docList &&
        docList.forEach((element) => {
          docArr.push(element.DocName);
        });
      setDropdownOptions(docArr);
    }
  }, []);

  // Function that handles type.
  const handleType = (event) => {
    setTypeValue(event.target.value);
    setMappedField("");
    if (event.target.value === "0") {
      getDataDropdownOptions();
    } else {
      let docArr = [];
      docList &&
        docList.forEach((element) => {
          docArr.push(element.DocName);
        });
      setDropdownOptions(docArr);
    }
  };

  return (
    <div>
      <div className={styles.headingsDiv}>
        <div className={styles.flexRow}>
          <p className={styles.heading}>{t("mapping")}</p>
          <ClearOutlinedIcon
            id="MM_Close_Modal"
            fontSize="small"
            onClick={handleClose}
            className={styles.closeModal}
          />
        </div>
      </div>
      <div className={styles.subDiv}>
        <p className={styles.modalSubHeading}>{t("mappingType")}</p>
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
            checked={typeValue !== "0"}
            onChange={handleType}
            value={"1"}
            size="small"
          />
          <p className={styles.text}>{t("document")}</p>
        </div>
        <div className={styles.flexRow}>
          <div className={styles.flexColumn}>
            <p className={styles.mappedField}>{t("mappedField")}</p>
            <CustomizedDropdown
              disabled={isProcessReadOnly}
              id="mapping_data_modal_mapped_field_dropdown"
              className={styles.typeInput}
              value={mappedField}
              onChange={(event) => setMappedField(event.target.value)}
              isNotMandatory={true}
            >
              {dropdownOptions &&
                dropdownOptions.map((element) => {
                  return (
                    <MenuItem className={styles.menuItemStyles} value={element}>
                      {element}
                    </MenuItem>
                  );
                })}
            </CustomizedDropdown>
          </div>
          <div className={styles.flexColumn}>
            <div className={styles.flexRow}>
              <p className={clsx(styles.mappedField, styles.length)}>
                {t("length")}
              </p>
              <span className={styles.asterisk}>*</span>
            </div>
            <InputBase
              id="mapping_data_modal_length_input"
              disabled={typeValue !== "0"}
              variant="outlined"
              className={styles.inputBase}
              value={length}
              type="number"
              onChange={(event) => setLength(event.target.value)}
            />
          </div>
        </div>
        <div className={styles.flexRow}>
          <div className={styles.flexRow}>
            <Checkbox
              disabled={isProcessReadOnly}
              id="mapping_data_modal_quotes_checkbox"
              readOnly={typeValue !== "0"}
              size="small"
              checked={quoteFlag === "Y"}
              onChange={() =>
                setQuoteFlag((prevState) => {
                  let temp = "Y";
                  if (temp === prevState) {
                    temp = "N";
                  }
                  return temp;
                })
              }
            />
            <p className={styles.quotesText}>{t("quotes")}</p>
          </div>
          {typeValue !== "0" && (
            <div className={styles.flexRow}>
              <Checkbox
                disabled={isProcessReadOnly}
                id="mapping_data_modal_export_all_documents_checkbox"
                readOnly={typeValue !== "0"}
                size="small"
                checked={exportAllDocsFlag === "Y"}
                onChange={() =>
                  setExportAllDocsFlag((prevState) => {
                    let temp = "Y";
                    if (temp === prevState) {
                      temp = "N";
                    }
                    return temp;
                  })
                }
              />
              <p className={styles.exportAllDocText}>
                {t("exportAllDocuments")}
              </p>
            </div>
          )}
        </div>
        <div className={styles.flexColumn}>
          <p className={styles.mappedField}>{t("alignment")}</p>
          <div className={styles.flexRow}>
            <Radio
              id="mapping_data_modal_left_radio"
              checked={alignment === "L"}
              value={"L"}
              size="small"
              disabled={isProcessReadOnly || typeValue !== "0"}
              onChange={(event) => setAlignment(event.target.value)}
            />
            <p className={styles.text}>{t("left")}</p>
            <Radio
              id="mapping_data_modal_right_radio"
              checked={alignment === "R"}
              value={"R"}
              size="small"
              disabled={isProcessReadOnly || typeValue !== "0"}
              onChange={(event) => setAlignment(event.target.value)}
            />
            <p className={styles.text}>{t("right")}</p>
          </div>
        </div>
      </div>
      {!isProcessReadOnly ? (
        <div className={styles.buttonsDiv}>
          <button
            id="mapping_data_modal_cancel_button"
            onClick={handleClose}
            className={styles.cancelButton}
          >
            <span className={styles.cancelButtonText}>{t("cancel")}</span>
          </button>
          <button
            id="mapping_data_modal_save_changes_button"
            disabled={length === ""}
            onClick={handleSaveChanges}
            className={styles.okButton}
          >
            <span className={styles.okButtonText}>{t("save")}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default MappingDataModal;
