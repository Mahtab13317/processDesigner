import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { useTranslation } from "react-i18next";
import { InputBase, MenuItem, Checkbox, Divider } from "@material-ui/core";
import { useDispatch } from "react-redux";
import {
  getFileTypes,
  getFieldTypes,
  getFieldMoveType,
} from "../../../../../utility/PropertiesTab/Export";
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
  propertiesLabel,
} from "../../../../../Constants/appConstants";
import { setActivityPropertyChange } from "../../../../../redux-store/slices/ActivityPropertyChangeSlice";
import CustomizedDropdown from "../../../../../UI/Components_With_ErrrorHandling/Dropdown";
import TextInput from "../../../../../UI/Components_With_ErrrorHandling/InputField";
import clsx from "clsx";

function FileDetails(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const { data, fields, isProcessReadOnly, setActivityData } = props;
  const [firstFieldName, setFirstFieldName] = useState("");
  const [secondFieldName, setSecondFieldName] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [filePath, setFilePath] = useState("");
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

  // Function that runs when data parameter changes.
  useEffect(() => {
    if (data) {
      setCsvFileName(data.csvFileName);
      setFilePath(data.filePath);
      setOrderBy(data.orderBy);
      setFileType(data.fileType);
      setFieldType(data.csvType);
      setFileMoveInterval(data.fileExpiryTrig);
      setSleepTime(data.sleepTime);
      setMaskedValue(data.maskedValue);
      setFieldSeparator(data.fieldSep);
      setRecordNo(data.noOfRecord);
      setIsHeaderEnabled(data.generateHeader);
      setHeaderString(data.headerString);
      setFooterString(data.footerString);
    }
  }, [data]);

  // Function that sets the file info data.
  const setFileInfoData = (key, value) => {
    setActivityData((prevData) => {
      let temp = { ...prevData };
      temp.fileInfo[key] = value;
      return temp;
    });
  };

  // Function that runs when the user changes the csv file name value.
  const handleCsvFileName = (value) => {
    setCsvFileName(value);
    setFileInfoData("csvFileName", value);
    enableSaveChangesButton();
  };

  // Function that runs when the user changes the file path value.
  const handleFilePath = (value) => {
    setFilePath(value);
    setFileInfoData("filePath", value);
    enableSaveChangesButton();
  };

  // Function that runs when the user clicks on the + icon to add a csv file name.
  const handleAddCsvFileName = () => {
    if (firstFieldName !== "") {
      const updatedFileName = csvFileName.concat(`&${firstFieldName}&`);
      setCsvFileName(updatedFileName);
      setFileInfoData("csvFileName", updatedFileName);
      enableSaveChangesButton();
    }
  };

  // Function that runs when the user clicks on the + icon to add file path.
  const handleAddFilePath = () => {
    if (secondFieldName !== "") {
      const updatedPathName = filePath.concat(`&${secondFieldName}&`);
      setFilePath(updatedPathName);
      setFileInfoData("filePath", updatedPathName);
    }
  };

  // Function that runs when the user changes the order by value.
  const handleOrderBy = (value) => {
    setOrderBy(value);
    setFileInfoData("orderBy", value);
    enableSaveChangesButton();
  };

  // Function that runs when the user changes the file type value.
  const handleFileType = (value) => {
    setFileType(value);
    setFileInfoData("fileType", value);
    enableSaveChangesButton();
  };

  // Function that runs when the user changes the field type value.
  const handleFieldType = (value) => {
    setFieldType(value);
    setFileInfoData("csvType", value);
    enableSaveChangesButton();
  };

  // Function that runs when the user changes the field separator value.
  const handleFieldSeparator = (value) => {
    setFieldSeparator(value);
    setFileInfoData("fieldSep", value);
    enableSaveChangesButton();
  };

  // Function that runs when the user changes the file move interval value.
  const handleFileMoveInterval = (value) => {
    setFileMoveInterval(value);
    setFileInfoData("fileExpiryTrig", value);
    enableSaveChangesButton();
  };

  // Function that runs when the user changes the record no. value.
  const handleRecordNo = (value) => {
    setRecordNo(value);
    setFileInfoData("noOfRecord", value);
    enableSaveChangesButton();
  };

  // Function that runs when the user changes the sleep time value.
  const handleSleepTime = (value) => {
    setSleepTime(value);
    setFileInfoData("sleepTime", value);
    enableSaveChangesButton();
  };

  // Function that runs when the user changes the header checkbox value.
  const handleIsHeaderEnabled = (value) => {
    setIsHeaderEnabled(value);
    setFileInfoData("generateHeader", value);
    enableSaveChangesButton();
  };

  // Function that runs when the user changes header string value.
  const handleHeaderString = (value) => {
    setHeaderString(value);
    setFileInfoData("headerString", value);
    enableSaveChangesButton();
  };

  // Function that runs when the user changes the footer string value.
  const handleFooterString = (value) => {
    setFooterString(value);
    setFileInfoData("footerString", value);
    enableSaveChangesButton();
  };

  // Function that enables the save changes button on changes.
  const enableSaveChangesButton = () => {
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.Export]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <div className={styles.mainDiv}>
      <div className={clsx(styles.flexRow, styles.divHeight)}>
        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <p className={clsx(styles.fieldTitle, styles.fieldName)}>
            {t("fieldName")}
          </p>
          <CustomizedDropdown
            disabled={isProcessReadOnly}
            id="file_details_first_field_name_input"
            className={styles.dropdownInput}
            value={firstFieldName}
            onChange={(event) => setFirstFieldName(event.target.value)}
            isNotMandatory={true}
          >
            {fields &&
              fields.map((d) => {
                return (
                  <MenuItem className={styles.menuItemStyles} value={d}>
                    {d}
                  </MenuItem>
                );
              })}
          </CustomizedDropdown>
        </div>
        <div className={styles.flexColumn}>
          {!isProcessReadOnly ? (
            <button
              id="file_details_add_csv_name_button"
              onClick={handleAddCsvFileName}
              className={styles.addIcon}
            >
              {t("add")}
            </button>
          ) : null}
        </div>
        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <div className={styles.flexRow}>
            <p className={clsx(styles.fieldTitle, styles.fieldName)}>
              {t("csvFileName")}
            </p>
            <span className={styles.asterisk}>*</span>
          </div>
          <TextInput
            inputValue={csvFileName}
            classTag={styles.inputBaseData}
            onChangeEvent={(event) => handleCsvFileName(event.target.value)}
            name="csvFileName"
            idTag="file_details_csv_name_input"
            errorStatement={t("mandatoryFieldStatement")}
            errorSeverity={"error"}
            errorType={0}
            inlineError={true}
          />
        </div>
        <div className={styles.flexColumn}>
          <Divider orientation="vertical" className={styles.fieldDivider} />
        </div>
        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <p className={clsx(styles.fieldTitle, styles.fieldName)}>
            {t("fieldName")}
          </p>
          <CustomizedDropdown
            disabled={isProcessReadOnly}
            id="file_details_second_field_name_input"
            className={styles.dropdownInput}
            value={secondFieldName}
            onChange={(event) => setSecondFieldName(event.target.value)}
            isNotMandatory={true}
          >
            {fields &&
              fields.map((element) => {
                return (
                  <MenuItem className={styles.menuItemStyles} value={element}>
                    {element}
                  </MenuItem>
                );
              })}
          </CustomizedDropdown>
        </div>
        <div className={styles.flexColumn}>
          {!isProcessReadOnly ? (
            <button
              id="file_details_add_file_path_button"
              onClick={handleAddFilePath}
              className={styles.addIcon}
            >
              {t("add")}
            </button>
          ) : null}
        </div>
        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <div className={styles.flexRow}>
            <p className={clsx(styles.fieldTitle, styles.fieldName)}>
              {t("filePath")}
            </p>
            <span className={styles.asterisk}>*</span>
          </div>
          <TextInput
            inputValue={filePath}
            classTag={styles.inputBaseData}
            onChangeEvent={(event) => handleFilePath(event.target.value)}
            name="filePath"
            idTag="file_details_file_name_input"
            errorStatement={t("mandatoryFieldStatement")}
            errorSeverity={"error"}
            errorType={0}
            inlineError={true}
          />
        </div>
      </div>
      <div className={clsx(styles.flexRow, styles.divHeight)}>
        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <p className={clsx(styles.fieldTitle, styles.fieldName)}>
            {t("orderBy")}
          </p>
          <CustomizedDropdown
            disabled={isProcessReadOnly}
            id="file_details_order_by_dropdown"
            className={styles.dropdownInput}
            value={orderBy}
            onChange={(event) => handleOrderBy(event.target.value)}
            isNotMandatory={true}
          >
            {fields &&
              fields.map((element) => {
                return (
                  <MenuItem className={styles.menuItemStyles} value={element}>
                    {element}
                  </MenuItem>
                );
              })}
          </CustomizedDropdown>
        </div>
        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <p className={clsx(styles.fieldTitle, styles.fieldName)}>
            {t("fileType")}
          </p>
          <CustomizedDropdown
            disabled={isProcessReadOnly}
            id="file_details_file_type_dropdown"
            className={styles.dropdownInput}
            value={fileType}
            onChange={(event) => handleFileType(event.target.value)}
            isNotMandatory={true}
          >
            {fileTypes &&
              fileTypes.map((d) => {
                return (
                  <MenuItem className={styles.menuItemStyles} value={d}>
                    {t(getFileTypes(d))}
                  </MenuItem>
                );
              })}
          </CustomizedDropdown>
        </div>
        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <p className={clsx(styles.fieldTitle, styles.fieldName)}>
            {t("maskedValue")}
          </p>
          <InputBase
            disabled={isProcessReadOnly}
            id="file_details_masked_value_input"
            variant="outlined"
            className={styles.inputBaseData}
            value={maskedValue}
          />

          {/* <MultiSelect
            completeList={activitiesList} //Array of objects.
            labelKey="ActivityName" // Key for showing data.
            indexKey="ActivityId" // Index for matching.
            associatedList={selectedWorkstepField} // Array of only activity names.
            handleAssociatedList={(val) => {
              // set selectedWorkstepField
              setSelectedWorkstepField(val);
              if (existingTrigger) {
                props.setTriggerEdited(true);
              }
            }}
            placeholder={t("chooseWorkstep")} // Default value
            noDataLabel={t("noWorksteps")} // Label
            disabled={readOnlyProcess}
            id="trigger_ccwi_workstepMultiSelect"
            selectAllOption={true} // Select all keys
          /> */}
        </div>
        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <p className={clsx(styles.fieldTitle, styles.fieldName)}>
            {t("fieldType")}
          </p>
          <CustomizedDropdown
            disabled={isProcessReadOnly}
            id="file_details_field_type_dropdown"
            className={styles.dropdownInput}
            value={fieldType}
            onChange={(event) => handleFieldType(event.target.value)}
            isNotMandatory={true}
          >
            {fieldTypes &&
              fieldTypes.map((d) => {
                return (
                  <MenuItem className={styles.menuItemStyles} value={d}>
                    {t(getFieldTypes(d))}
                  </MenuItem>
                );
              })}
          </CustomizedDropdown>
        </div>
      </div>
      <div className={clsx(styles.flexRow, styles.divHeight)}>
        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <div className={styles.flexRow}>
            <p className={clsx(styles.fieldTitle, styles.fieldName)}>
              {t("fieldSeparator")}
            </p>
            <span className={styles.asterisk}>*</span>
          </div>
          <TextInput
            maxLength={1}
            inputValue={fieldSeparator}
            classTag={styles.inputBaseData}
            onChangeEvent={(event) => handleFieldSeparator(event.target.value)}
            name="fieldSeparator"
            idTag="file_details_field_separator_input"
            errorStatement={t("mandatoryFieldStatement")}
            errorSeverity={"error"}
            errorType={0}
            inlineError={true}
          />
        </div>

        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <p className={clsx(styles.fieldTitle, styles.fieldName)}>
            {t("fileMove")}
          </p>
          <CustomizedDropdown
            disabled={isProcessReadOnly}
            id="file_details_file_move_dropdown"
            className={styles.dropdownInput}
            value={fileMoveInterval}
            onChange={(event) => handleFileMoveInterval(event.target.value)}
            isNotMandatory={true}
          >
            {fileMoveIntervals &&
              fileMoveIntervals.map((d) => {
                return (
                  <MenuItem className={styles.menuItemStyles} value={d}>
                    {t(getFieldMoveType(d))}
                  </MenuItem>
                );
              })}
          </CustomizedDropdown>
        </div>

        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <div className={styles.flexRow}>
            <p className={clsx(styles.fieldTitle, styles.fieldName)}>
              {t("recordNumber")}
            </p>
            <span className={styles.asterisk}>*</span>
          </div>

          {/* <InputBase
            disabled={isProcessReadOnly}
            id="file_details_record_number_input"
            variant="outlined"
            className={styles.inputBaseData}
            onChange={(event) => setRecordNo(event.target.value)}
            value={recordNo}
          /> */}
          <TextInput
            inputValue={recordNo}
            classTag={styles.inputBaseData}
            onChangeEvent={(event) => handleRecordNo(event.target.value)}
            name="recordNo"
            idTag="file_details_record_number_input"
            errorStatement={t("mandatoryFieldStatement")}
            errorSeverity={"error"}
            errorType={0}
            inlineError={true}
          />
        </div>

        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <p className={clsx(styles.fieldTitle, styles.fieldName)}>
            {t("sleepTime")}
          </p>
          <InputBase
            disabled={isProcessReadOnly}
            id="file_details_sleep_time_input"
            type="number"
            variant="outlined"
            className={styles.inputBaseData}
            onChange={(event) => handleSleepTime(event.target.value)}
            value={sleepTime}
          />
        </div>

        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <div className={styles.flexRow}>
            <Checkbox
              disabled={isProcessReadOnly}
              id="file_details_header_checkbox"
              className={styles.orderByCheckBox}
              checked={isHeaderEnabled}
              size="small"
              onChange={() => handleIsHeaderEnabled(!isHeaderEnabled)}
            />
            <p className={clsx(styles.fieldTitle, styles.generateHeader)}>
              {t("generateHeader")}
            </p>
          </div>
        </div>
      </div>

      <div className={clsx(styles.flexRow, styles.divHeight)}>
        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <p className={clsx(styles.fieldTitle, styles.fieldName)}>
            {t("headerString")}
          </p>
          <InputBase
            disabled={isProcessReadOnly}
            id="file_details_header_string_input"
            variant="outlined"
            className={styles.inputBaseData}
            onChange={(event) => handleHeaderString(event.target.value)}
            value={headerString}
          />
        </div>
        <div className={clsx(styles.subDiv, styles.flexColumn)}>
          <p className={clsx(styles.fieldTitle, styles.fieldName)}>
            {t("footerString")}
          </p>
          <InputBase
            disabled={isProcessReadOnly}
            id="file_details_footer_string_input"
            variant="outlined"
            className={styles.inputBaseData}
            onChange={(event) => handleFooterString(event.target.value)}
            value={footerString}
          />
        </div>
      </div>
    </div>
  );
}

export default FileDetails;
