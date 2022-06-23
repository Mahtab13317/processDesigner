import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { useTranslation } from "react-i18next";
import { Select, InputBase, MenuItem, Checkbox } from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import {
  getFileTypes,
  getFieldTypes,
  getFieldMoveType,
} from "../../../../../utility/PropertiesTab/Export";
import Modal from "../../../../../UI/Modal/Modal";
import MaskedValueModal from "./MaskedValueModal";
import { LightTooltip } from "../../../../../UI/StyledTooltip";
import {
  EXPORT_CSV_FILE_TYPE,
  EXPORT_TEXT_FILE_TYPE,
  EXPORT_DAT_FILE_TYPE,
  EXPORT_RES_FILE_TYPE,
  EXPORT_FIXED_LENGTH_FIELD_TYPE,
  EXPORT_VARIABLE_LENGTH_FIELD_TYPE,
  EXPORT_DAILY_FILE_MOVE,
  EXPORT_WEEKLY_FILE_MOVE,
  EXPORT_MONTHLY_FILE_MOVE,
} from "../../../../../Constants/appConstants";

function FileDetails(props) {
  let { t } = useTranslation();
  const { data, fields, isProcessReadOnly } = props;
  const [firstFieldName, setFirstFieldName] = useState("");
  const [secondFieldName, setSecondFieldName] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [isOrderByAllowed, setIsOrderByAllowed] = useState(false);
  const [orderBy, setOrderBy] = useState(fields && fields[0]);
  const [fileType, setFileType] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [fileMoveInterval, setFileMoveInterval] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [maskedValue, setMaskedValue] = useState("");
  const [fieldSeparator, setFieldSeparator] = useState("");
  const [recordNo, setRecordNo] = useState("");
  const [isHeaderEnabled, setIsHeaderEnabled] = useState(false);
  const [headerString, setHeaderString] = useState("");
  const [footerString, setFooterString] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileTypes = [
    EXPORT_CSV_FILE_TYPE,
    EXPORT_TEXT_FILE_TYPE,
    EXPORT_DAT_FILE_TYPE,
    EXPORT_RES_FILE_TYPE,
  ];
  const fieldTypes = [
    EXPORT_FIXED_LENGTH_FIELD_TYPE,
    EXPORT_VARIABLE_LENGTH_FIELD_TYPE,
  ];
  const fileMoveIntervals = [
    EXPORT_DAILY_FILE_MOVE,
    EXPORT_WEEKLY_FILE_MOVE,
    EXPORT_MONTHLY_FILE_MOVE,
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

  // Function that runs when data parameter changes.
  useEffect(() => {
    if (data) {
      const csvData = data.CSVData;
      setCsvFileName(csvData.CSVFileName);
      setFilePath(csvData.FilePath);
      setOrderBy(csvData.OrderBy);
      setFileType(csvData.FileType);
      setFieldType(csvData.CSVType);
      setFileMoveInterval(csvData.FileMove);
      setSleepTime(csvData.SleepTime);
      setMaskedValue(csvData.MaskedValue);
      setFieldSeparator(csvData.FieldSeperator);
      setRecordNo(csvData.NoOfRecords);
      setIsHeaderEnabled(csvData.Header);
      setHeaderString(csvData.HeaderString);
      setFooterString(csvData.FooterString);
    }
  }, [data]);

  // Function that runs when the user clicks on the + icon to add a csv file name.
  const handleAddCsvFileName = () => {
    if (firstFieldName !== "") {
      const updatedFileName = csvFileName.concat(`&${firstFieldName}&`);
      setCsvFileName(updatedFileName);
    }
  };

  // Function that runs when the user clicks on the + icon to add file path.
  const handleAddFilePath = () => {
    if (secondFieldName !== "") {
      const updatedPathName = filePath.concat(`&${secondFieldName}&`);
      setFilePath(updatedPathName);
    }
  };

  // Function that closes the modal.
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.mainDiv}>
      <div>
        <div className={styles.subDiv}>
          <p className={styles.fieldName}>{t("fieldName")}</p>
          <Select
            disabled={isProcessReadOnly}
            id="file_details_first_field_name_input"
            MenuProps={menuProps}
            className={styles.dropdownInput}
            value={firstFieldName}
            onChange={(event) => setFirstFieldName(event.target.value)}
          >
            {fields &&
              fields.map((d) => {
                return (
                  <MenuItem className={styles.menuItemStyles} value={d}>
                    {d}
                  </MenuItem>
                );
              })}
          </Select>
          {!isProcessReadOnly ? (
            <AddOutlinedIcon
              id="file_details_add_csv_name_button"
              onClick={handleAddCsvFileName}
              className={styles.addIcon}
            />
          ) : null}
        </div>
        <div className={styles.subDiv}>
          <p className={styles.fieldName}>{t("csvFileName")}</p>
          <InputBase
            disabled={isProcessReadOnly}
            id="file_details_csv_name_input"
            variant="outlined"
            className={styles.inputBaseData}
            onChange={(event) => setCsvFileName(event.target.value)}
            value={csvFileName}
          />
        </div>
        <div className={styles.subDiv}>
          <p className={styles.fieldName}>{t("fieldName")}</p>
          <Select
            disabled={isProcessReadOnly}
            id="file_details_second_field_name_input"
            MenuProps={menuProps}
            className={styles.dropdownInput}
            value={secondFieldName}
            onChange={(event) => setSecondFieldName(event.target.value)}
          >
            {fields &&
              fields.map((element) => {
                return (
                  <MenuItem className={styles.menuItemStyles} value={element}>
                    {element}
                  </MenuItem>
                );
              })}
          </Select>
          {!isProcessReadOnly ? (
            <AddOutlinedIcon
              id="file_details_add_file_path_button"
              onClick={handleAddFilePath}
              className={styles.addIcon}
            />
          ) : null}
        </div>
        <div className={styles.subDiv}>
          <p className={styles.fieldName}>{t("filePath")}</p>
          <InputBase
            disabled={isProcessReadOnly}
            id="file_details_file_name_input"
            variant="outlined"
            className={styles.inputBaseData}
            onChange={(event) => setFilePath(event.target.value)}
            value={filePath}
          />
        </div>
        <div className={styles.subDiv}>
          <Checkbox
            disabled={isProcessReadOnly}
            id="file_details_order_by_checkbox"
            className={styles.orderByCheckBox}
            checked={isOrderByAllowed}
            size="small"
            onChange={() => setIsOrderByAllowed(!isOrderByAllowed)}
          />
          <p className={styles.orderBy}>{t("orderBy")}</p>
          <Select
            disabled={isProcessReadOnly || !isOrderByAllowed}
            id="file_details_order_by_dropdown"
            // disabled={!}
            MenuProps={menuProps}
            className={styles.dropdownInput}
            value={orderBy}
            onChange={(event) => setOrderBy(event.target.value)}
          >
            {fields &&
              fields.map((element) => {
                return (
                  <MenuItem className={styles.menuItemStyles} value={element}>
                    {element}
                  </MenuItem>
                );
              })}
          </Select>
        </div>
        <div className={styles.subDiv}>
          <div className={styles.secondDiv}>
            <div className={styles.rowDiv}>
              <p className={styles.extraFields}>{t("fileType")}</p>
              <Select
                disabled={isProcessReadOnly}
                id="file_details_file_type_dropdown"
                MenuProps={menuProps}
                className={styles.dropdownInput}
                value={fileType}
                onChange={(event) => setFileType(event.target.value)}
              >
                {fileTypes &&
                  fileTypes.map((d) => {
                    return (
                      <MenuItem className={styles.menuItemStyles} value={d}>
                        {t(getFileTypes(d))}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>
            <div className={styles.rowDiv}>
              <p className={styles.extraFields}>{t("fieldType")}</p>
              <Select
                disabled={isProcessReadOnly}
                id="file_details_field_type_dropdown"
                MenuProps={menuProps}
                className={styles.dropdownInput}
                value={fieldType}
                onChange={(event) => setFieldType(event.target.value)}
              >
                {fieldTypes &&
                  fieldTypes.map((d) => {
                    return (
                      <MenuItem className={styles.menuItemStyles} value={d}>
                        {t(getFieldTypes(d))}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>
            <div className={styles.rowDiv}>
              <p className={styles.extraFields}>{t("fileMove")}</p>
              <Select
                disabled={isProcessReadOnly}
                id="file_details_file_move_dropdown"
                MenuProps={menuProps}
                className={styles.dropdownInput}
                value={fileMoveInterval}
                onChange={(event) => setFileMoveInterval(event.target.value)}
              >
                {fileMoveIntervals &&
                  fileMoveIntervals.map((d) => {
                    return (
                      <MenuItem className={styles.menuItemStyles} value={d}>
                        {t(getFieldMoveType(d))}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>
            <div className={styles.rowDiv}>
              <p className={styles.extraFields}>{t("sleepTime")}</p>
              <InputBase
                disabled={isProcessReadOnly}
                id="file_details_sleep_time_input"
                type="number"
                variant="outlined"
                className={styles.inputBaseData}
                onChange={(event) => setSleepTime(event.target.value)}
                value={sleepTime}
              />
            </div>
          </div>
          <div className={styles.secondDiv}>
            <div className={styles.rowDiv}>
              <p className={styles.extraFields}>{t("maskedValue")}</p>
              <LightTooltip
                id="PF_Tooltip"
                arrow={true}
                enterDelay={500}
                placement="bottom"
                title={maskedValue}
              >
                <InputBase
                  disabled={isProcessReadOnly}
                  id="file_details_masked_value_input"
                  variant="outlined"
                  className={styles.inputBaseData}
                  value={maskedValue}
                />
              </LightTooltip>

              <button
                disabled={isProcessReadOnly}
                id="file_details_open_modal_button"
                onClick={() => setIsModalOpen(true)}
                className={styles.modalButton}
              ></button>
              {isModalOpen ? (
                <Modal
                  show={isModalOpen}
                  modalClosed={handleClose}
                  style={{
                    width: "15%",
                    height: "35%",
                    left: "43%",
                    top: "38%",
                    padding: "0px",
                  }}
                >
                  <MaskedValueModal
                    fields={fields}
                    handleClose={handleClose}
                    maskedValue={maskedValue}
                    setMaskedValue={setMaskedValue}
                  />
                </Modal>
              ) : null}
            </div>
            <div className={styles.rowDiv}>
              <p className={styles.extraFields}>{t("fieldSeparator")}</p>
              <InputBase
                disabled={isProcessReadOnly}
                id="file_details_field_separator_input"
                variant="outlined"
                className={styles.inputBaseData}
                onChange={(event) => setFieldSeparator(event.target.value)}
                value={fieldSeparator}
              />
            </div>
            <div className={styles.rowDiv}>
              <p className={styles.extraFields}>{t("recordNumber")}</p>
              <InputBase
                disabled={isProcessReadOnly}
                id="file_details_record_number_input"
                variant="outlined"
                className={styles.inputBaseData}
                onChange={(event) => setRecordNo(event.target.value)}
                value={recordNo}
              />
            </div>
          </div>
        </div>
        <div className={styles.subDiv}>
          <Checkbox
            disabled={isProcessReadOnly}
            id="file_details_header_checkbox"
            className={styles.orderByCheckBox}
            checked={isHeaderEnabled}
            size="small"
            onChange={() => setIsHeaderEnabled(!isHeaderEnabled)}
          />
          <p className={styles.extraFields}>{t("generateHeader")}</p>
        </div>
        <div className={styles.subDiv}>
          <div className={styles.thirdDiv}>
            <div className={styles.stringDivs}>
              <div className={styles.rowDiv}>
                <p className={styles.extraFields}>{t("headerString")}</p>
                <InputBase
                  disabled={isProcessReadOnly}
                  id="file_details_header_string_input"
                  variant="outlined"
                  className={styles.inputBaseData}
                  onChange={(event) => setHeaderString(event.target.value)}
                  value={headerString}
                />
              </div>
            </div>
            <div className={styles.stringDivs}>
              <div className={styles.rowDiv}>
                <p className={styles.extraFields}>{t("footerString")}</p>
                <InputBase
                  disabled={isProcessReadOnly}
                  id="file_details_footer_string_input"
                  variant="outlined"
                  className={styles.inputBaseData}
                  onChange={(event) => setFooterString(event.target.value)}
                  value={footerString}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileDetails;
