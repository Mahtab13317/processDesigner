import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import clsx from "clsx";
import axios from "axios";
import { useTranslation } from "react-i18next";
import InputFieldsStrip from "./InputFieldsStrip";
import { useDispatch, useSelector } from "react-redux";
import { MenuItem, Radio } from "@material-ui/core";
import EmptyStateIcon from "../../../../../assets/ProcessView/EmptyState.svg";
import { getVariableType } from "../../../../../utility/ProcessSettings/Triggers/getVariableType";
import { dateDropdownOptions, typeDropdownOptions } from "./DropdownOptions";
import {
  EXPORT_DEFINED_TABLE_TYPE,
  EXPORT_EXISTING_TABLE_TYPE,
  propertiesLabel,
  SERVER_URL,
  ENDPOINT_GET_EXISTING_TABLES,
  ENDPOINT_GET_COLUMNS,
  RTL_DIRECTION,
  mandatoryColumns,
  ERROR_MANDATORY,
  FLOAT_VARIABLE_TYPE,
  STRING_VARIABLE_TYPE,
} from "../../../../../Constants/appConstants";
import CustomizedDropdown from "../../../../../UI/Components_With_ErrrorHandling/Dropdown";
import TextInput from "../../../../../UI/Components_With_ErrrorHandling/InputField";
import TableDataStrip from "./TableDataStrip";
import { setActivityPropertyChange } from "../../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import { setToastDataFunc } from "../../../../../redux-store/slices/ToastDataHandlerSlice";

function TableDetails(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const dispatch = useDispatch();
  const {
    openProcessType,
    openProcessID,
    fields,
    data,
    setFields,
    isProcessReadOnly,
    documentList,
    variablesList,
    setActivityData,
    handleChange,
    setGlobalData,
  } = props;
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [showInputFields, setShowInputFields] = useState(false);
  const [tableName, setTableName] = useState("");
  const [dateFormat, setDateFormat] = useState("yyyy-MM-dd");
  const [tableType, setTableType] = useState(EXPORT_DEFINED_TABLE_TYPE);
  const [mappingDetails, setMappingDetails] = useState({
    alignment: "L",
    exportAllDocsFlag: "N",
    length: "0",
    mappedField: "",
    mappingType: "0",
    quoteflag: "N",
  });
  const [dataFields, setDataFields] = useState({});
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("10");
  const [constraintType, setConstraintType] = useState("");
  const [selectedExistingTable, setSelectedExistingTable] = useState("");
  const [existingTableData, setExistingTableData] = useState([]);
  const [typeLength, setTypeLength] = useState({
    length: "50",
    precision: "0",
  });
  const [error, setError] = useState({});

  // Function that checks export save validation.
  const checkExportSaveValidation = () => {
    let hasError = false;
    if (tableName === null || tableName.trim() === "") {
      setError({
        ...error,
        tableName: {
          statement: t("mandatoryFieldStatement"),
          severity: "error",
          errorType: ERROR_MANDATORY,
        },
      });
      hasError = true;
    }
    return hasError;
  };

  // Function that checks if the mapping data has atleast one mapped field for any mapped field.
  const checkMappingData = () => {
    let hasAtleastOneMapping = false;
    const mappingDataArr = dataFields.mappingList;
    mappingDataArr?.forEach((element) => {
      if (element.m_objExportMappedFieldInfo.mappedFieldName !== "") {
        hasAtleastOneMapping = true;
      }
    });
    return hasAtleastOneMapping;
  };

  useEffect(() => {
    if (!showInputFields) {
      setFieldName("");
    }
  }, [showInputFields]);

  // Function that checks if the file details mandatory fields are filled or not.
  const checkFileDetailsFields = () => {
    let areMandatoryDetailsFilled = true;
    const fileDetails = dataFields.fileInfo;
    if (
      fileDetails.csvFileName === "" ||
      fileDetails.filePath === "" ||
      fileDetails.fieldSep === "" ||
      fileDetails.noOfRecord === ""
    ) {
      areMandatoryDetailsFilled = false;
    }
    return areMandatoryDetailsFilled;
  };

  // Function that runs when the saveCancelStatus.SaveClicked, saveCancelStatus.CancelClicked values change and checks validation.
  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      if (!checkExportSaveValidation()) {
        if (checkMappingData()) {
          if (checkFileDetailsFields()) {
            dispatch(
              setActivityPropertyChange({
                [propertiesLabel.Export]: { isModified: true, hasError: false },
              })
            );
          } else {
            handleChange(null, 1);
            dispatch(
              setToastDataFunc({
                message: t("mandatoryErrorStatement"),
                severity: "error",
                open: true,
              })
            );
          }
        } else {
          dispatch(
            setToastDataFunc({
              message: t("pleaseMapFields"),
              severity: "error",
              open: true,
            })
          );
        }
      } else {
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.Export]: { isModified: true, hasError: false },
          })
        );
      }
      dispatch(setSave({ SaveClicked: false }));
    }
    dispatch(setSave({ SaveClicked: false }));
  }, [saveCancelStatus.SaveClicked, saveCancelStatus.CancelClicked]);

  // Function that sets the table details value when they change.
  const setTableDetailsData = (key, value) => {
    setActivityData((prevData) => {
      let temp = { ...prevData };
      temp[key] = value;
      setGlobalData(temp);
      return temp;
    });
  };

  // Function that handles the table name changes.
  const tableNameHandler = (value) => {
    setTableName(value);
    setTableDetailsData("tableName", value);
  };

  // Function that handles the date format changes.
  const dateFormatHandler = (value) => {
    setDateFormat(value);
    setTableDetailsData("selDateFormat", value);
  };

  // Function to check if the variable type should have a disabled length or not.
  const checkDisabled = (value) => {
    if (value === "10" || value === "6") {
      return false;
    }
    return true;
  };

  // Function to fetch existing table data by making an API call.
  const getExistingTableData = () => {
    axios
      .get(
        SERVER_URL +
          ENDPOINT_GET_EXISTING_TABLES +
          `/${openProcessID}` +
          `/${openProcessType}`
      )
      .then((res) => {
        if (res.status === 200) {
          setExistingTableData(res.data.Table);
        }
      })
      .catch((err) => console.log(err));
  };

  // Function that runs when the component loads.
  useEffect(() => {
    getExistingTableData();
  }, []);

  // Function that runs when the component loads.
  useEffect(() => {
    setDataFields({ ...data });
  }, [data]);

  // Function that runs when the component loads.
  useEffect(() => {
    dataFields &&
      dataFields.fieldList &&
      dataFields.fieldList.forEach((element) => {
        fields.push(element.name);
      });
    let unique = fields.filter((it, i, ar) => ar.indexOf(it) === i);
    setFields([...unique]);
    if (dataFields) {
      setTableName(dataFields.tableName);
      setDateFormat(dataFields.selDateFormat);
    }
  }, [dataFields, data]);

  // Function that gets the max Order ID in data map array.
  const findMaxOrderId = () => {
    let maxId = 0;
    dataFields &&
      dataFields.mappingList.forEach((element) => {
        if (element.m_objExportMappedFieldInfo.orderID > maxId) {
          maxId = element.m_objExportMappedFieldInfo.orderID;
        }
      });
    return maxId;
  };

  // Function that checks if the table has all the mandatory columns for using or not.
  const checkMandatoryFieldsExistance = async (tableName) => {
    let isTableUsable = true;
    let columnData = [];
    let columnNames = [];

    const response = await axios.get(
      SERVER_URL +
        ENDPOINT_GET_COLUMNS +
        `/0` +
        `/${openProcessType}` +
        `/${tableName}`
    );
    if (response.data.Status === 0) {
      columnData = response?.data?.Column;
    }

    columnData?.forEach((element) => {
      columnNames.push(element.Name);
    });

    async function checkMandatoryColumns() {
      for (let index = 0; index < mandatoryColumns.length; index++) {
        if (!columnNames.includes(mandatoryColumns[index])) {
          isTableUsable = false;
        }
      }
    }
    await checkMandatoryColumns();

    const newColumns = columnData.filter(
      (element) => !mandatoryColumns.includes(element.Name)
    );
    if (isTableUsable) {
      setTableDetailsData("tableName", tableName);
      let updatedKeysArr = [];
      newColumns?.forEach((element) => {
        const tempStr = element.Attribute.toLowerCase();
        let pascalCaseAttributeStr =
          tempStr.charAt(0).toUpperCase() + tempStr.slice(1);
        const obj = {
          attribute: pascalCaseAttributeStr,
          length: element.Length,
          name: element.Name,
          sPercision: "0",
          sTypeInt: element.Type,
          statusFlag: "G",
          type: getVariableType(element.Type).toUpperCase(),
        };
        updatedKeysArr.push(obj);
      });
      setActivityData((prevData) => {
        let temp = { ...prevData };
        temp.fieldList = updatedKeysArr;
        setGlobalData(temp);
        return temp;
      });
      let newMappedList = [];
      updatedKeysArr?.forEach((element, index) => {
        const tempObj = {
          m_objExportMappedFieldInfo: {
            alignment: "",
            docTypeId: "0",
            exportAllDocs: "N",
            extMethodIndex: "-1",
            fieldLength: "0",
            fieldName: element.name,
            mappedFieldName: "",
            orderID: `${index + 1}`,
            quoteflag: "N",
            varFieldId: "0",
            variableId: "0",
          },
        };
        newMappedList.push(tempObj);
      });
      setActivityData((prevData) => {
        let temp = { ...prevData };
        temp.mappingList = newMappedList;
        setGlobalData(temp);
        return temp;
      });
    }
    return isTableUsable;
  };

  // Function that handles the existing table dropdown field.
  const existingTableHandler = async (value) => {
    if (await checkMandatoryFieldsExistance(value)) {
      setSelectedExistingTable(value);
    } else {
      dispatch(
        setToastDataFunc({
          message: t("notAValidExportTableValidationMsg"),
          severity: "error",
          open: true,
        })
      );
    }
  };

  // Function that checks if the field name already exists or not.
  const checkExistingFieldNames = (name, prevFields) => {
    let doesFieldNameExist = false;
    const prevFieldsObj = { ...prevFields };
    prevFieldsObj?.fieldList.forEach((element, index) => {
      if (element.name === name) {
        doesFieldNameExist = true;
      }
    });
    return doesFieldNameExist;
  };

  // Function that checks if the length and precision are correct or not according to the type of the field.
  const checkFieldLengthAndPrecision = (fieldType, length, precision) => {
    let isFieldValid = true;
    if (+fieldType === FLOAT_VARIABLE_TYPE) {
      if (+precision > +length) {
        dispatch(
          setToastDataFunc({
            message: t("precisonAndLengthValidation"),
            severity: "error",
            open: true,
          })
        );
        isFieldValid = false;
        return isFieldValid;
      } else {
        if (+length < 11 || +length > 38) {
          dispatch(
            setToastDataFunc({
              message: t("lengthValidation"),
              severity: "error",
              open: true,
            })
          );
          isFieldValid = false;
          return isFieldValid;
        }
      }
    } else if (+fieldType === STRING_VARIABLE_TYPE) {
      if (+length < 1 || +length > 255) {
        isFieldValid = false;
        dispatch(
          setToastDataFunc({
            message: t("lengthValString"),
            severity: "error",
            open: true,
          })
        );
        return isFieldValid;
      }
    }
    return isFieldValid;
  };

  // Function that runs when the user adds a new field.
  const handleAddField = (isConstraintsEnabled) => {
    if (fieldName.trim() !== "") {
      if (!checkExistingFieldNames(fieldName, dataFields)) {
        if (
          checkFieldLengthAndPrecision(
            fieldType,
            typeLength.length,
            typeLength.precision
          )
        ) {
          const fieldListObj = {
            attribute: isConstraintsEnabled ? constraintType : "",
            length: typeLength.length,
            name: fieldName,
            sPercision: typeLength.precision,
            sTypeInt: fieldType,
            statusFlag: "G",
            type: getVariableType(fieldType).toUpperCase(),
          };

          const maxId = +findMaxOrderId();

          const dataMapObj = {
            m_objExportMappedFieldInfo: {
              orderID: `${maxId + 1}`,
              fieldName: fieldName,
              mappedFieldName: mappingDetails?.mappedField || "",
              fieldLength: mappingDetails?.length,
              docTypeId: mappingDetails?.mappingType || "0",
              quoteflag: mappingDetails?.quoteflag,
              variableId: "0",
              varFieldId: "0",
              extMethodIndex: "-1",
              alignment: mappingDetails?.alignment,
              exportAllDocs: mappingDetails?.exportAllDocsFlag,
              fwdMap: [],
              revMap: [],
            },
          };
          let temp = { ...dataFields };
          temp.mappingList.push(dataMapObj);
          temp.fieldList.push(fieldListObj);
          let tempFields = [...fields];
          tempFields.push(fieldName);
          setFields(tempFields);
          setDataFields(temp);
          setFieldName("");
          setFieldType("10");
          setTypeLength({
            length: "50",
            precision: "0",
          });
          setConstraintType("");
          setMappingDetails({
            alignment: "L",
            exportAllDocsFlag: "N",
            length: "0",
            mappedField: "",
            mappingType: "0",
            quoteflag: "N",
          });
          dispatch(
            setActivityPropertyChange({
              [propertiesLabel.Export]: { isModified: true, hasError: false },
            })
          );
        }
      } else {
        dispatch(
          setToastDataFunc({
            message: t("sameFieldNameExistValidation"),
            severity: "error",
            open: true,
          })
        );
      }
    }
  };

  // Function to handle table type.
  const handleTableType = (event) => {
    const { value } = event.target;
    setTableName("");
    setShowInputFields(false);
    setTableType(value);
    setDataFields((prevData) => {
      let temp = { ...prevData };
      temp.fieldList = [];
      temp.mappingList = [];
      return temp;
    });
  };

  // Function that runs when the user changes the constraint type field.
  const handleConstraintType = (value) => {
    setConstraintType(value);
  };

  // Function that runs when the user changes the field name.
  const handleFieldNameChange = (event, index) => {
    let temp = { ...dataFields };
    temp.fieldList[index].name = event.target.value;
    setDataFields(temp);
  };

  // Function that runs when the user clicks away from the field name.
  const checkFieldNameOnBlur = (event, index, prevValue, prevDataFields) => {
    if (
      prevValue !== event.target.value &&
      checkExistingFieldNames(event.target.value.trim(), prevDataFields)
    ) {
      let temp = { ...dataFields };
      temp.fieldList[index].name = prevValue;
      setDataFields(temp);
      dispatch(
        setToastDataFunc({
          message: t("fieldNameExists"),
          severity: "error",
          open: true,
        })
      );
    }
  };

  // Function that runs when the user changes the field type.
  const handleFieldTypeChange = (event, index) => {
    let temp = { ...dataFields };
    temp.fieldList[index].sTypeInt = event.target.value;
    setDataFields(temp);
  };

  // Function that runs when the user changes the constraint type.
  const handleAttributeChange = (value, index) => {
    let temp = { ...dataFields };
    temp.fieldList[index].attribute = value;
    setDataFields(temp);
  };

  // Function that runs when the user deletes a field.
  const handleDeleteField = (name, index) => {
    let temp = { ...dataFields };
    const [removedElement] = temp.fieldList.splice(index, 1);
    const availableFieldNames = fields.filter((d) => d !== removedElement.name);
    setFields([...availableFieldNames]);
    setDataFields(temp);
    setActivityData((prevData) => {
      let tempObj = { ...prevData };
      tempObj.mappingList.splice(index, 1);
      setGlobalData(tempObj);
      return tempObj;
    });
  };

  // Function that runs when the user changes the field length.
  const handleFieldLength = (event, index) => {
    let temp = { ...dataFields };
    temp.fieldList[index].length = event.target.value;
    setDataFields(temp);
  };

  // Function that runs when the user clicks away from the length text input and checks if the length is correct or not according to type of field.
  const checkLengthOnBlur = (event, index, type, prevLength, precision) => {
    if (!checkFieldLengthAndPrecision(type, event.target.value, precision)) {
      let temp = { ...dataFields };
      temp.fieldList[index].length = prevLength;
      setDataFields(temp);
    }
  };

  // Function that runs when the user changes the field precision.
  const handleFieldPrecision = (event, index) => {
    let temp = { ...dataFields };
    temp.fieldList[index].sPercision = event.target.value;
    setDataFields(temp);
  };

  // Function that runs when the user clicks away from the precision text input and checks if the precision is correct or not according to type of field.
  const checkPrecisionOnBlur = (event, index, type, length, prevPrecision) => {
    if (!checkFieldLengthAndPrecision(type, length, event.target.value)) {
      let temp = { ...dataFields };
      temp.fieldList[index].sPercision = prevPrecision;
      setDataFields(temp);
    }
  };

  return (
    <div
      className={
        direction === RTL_DIRECTION ? arabicStyles.mainDiv : styles.mainDiv
      }
    >
      <div className={styles.tableTypeDiv}>
        <Radio
          disabled={isProcessReadOnly}
          id="table_details_existing_radio"
          checked={tableType === EXPORT_EXISTING_TABLE_TYPE}
          onChange={handleTableType}
          value={EXPORT_EXISTING_TABLE_TYPE}
          size="small"
        />
        <p className={styles.tableType}>{t("existingTable")}</p>
        <Radio
          disabled={isProcessReadOnly}
          id="table_details_defined_radio"
          checked={tableType === EXPORT_DEFINED_TABLE_TYPE}
          onChange={handleTableType}
          value={EXPORT_DEFINED_TABLE_TYPE}
          size="small"
        />
        <p className={styles.tableType}>{t("defineTable")}</p>
      </div>
      <div className={styles.flexRow}>
        <div className={styles.subDiv}>
          <div className={styles.flexRow}>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.fieldTitle
                  : styles.fieldTitle
              }
            >
              {t("tableName")}
            </p>
            <span
              className={clsx(
                direction === RTL_DIRECTION
                  ? arabicStyles.asterisk
                  : styles.asterisk,
                styles.tableNameMargin
              )}
            >
              *
            </span>
          </div>
          {tableType === EXPORT_EXISTING_TABLE_TYPE ? (
            <CustomizedDropdown
              disabled={isProcessReadOnly}
              id="table_details_existing_table_dropdown"
              className={styles.inputBase}
              value={selectedExistingTable}
              onChange={(event) => existingTableHandler(event.target.value)}
              isNotMandatory={true}
            >
              {existingTableData &&
                existingTableData.map((element) => {
                  return (
                    <MenuItem
                      className={styles.menuItemStyles}
                      value={element.TableName}
                    >
                      {element.TableName}
                    </MenuItem>
                  );
                })}
            </CustomizedDropdown>
          ) : (
            <TextInput
              readOnlyCondition={isProcessReadOnly}
              inputValue={tableName}
              classTag={styles.inputBase}
              onChangeEvent={(event) => tableNameHandler(event.target.value)}
              name="tableName"
              idTag="table_details_table_name_input"
              errorStatement={error?.tableName?.statement}
              errorSeverity={error?.tableName?.severity}
              errorType={error?.tableName?.errorType}
              inlineError={true}
            />
          )}
        </div>
        <div className={clsx(styles.subDiv, styles.dateFormatDivMargin)}>
          <p
            className={clsx(
              direction === RTL_DIRECTION
                ? arabicStyles.fieldTitle
                : styles.fieldTitle,
              direction === RTL_DIRECTION
                ? arabicStyles.dateFormat
                : styles.dateFormat
            )}
          >
            {t("dateFormat")}
          </p>
          <CustomizedDropdown
            disabled={isProcessReadOnly}
            id="table_details_date_format_dropdown"
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.typeInput
                : styles.typeInput
            }
            value={dateFormat}
            onChange={(event) => dateFormatHandler(event.target.value)}
            isNotMandatory={true}
          >
            {dateDropdownOptions &&
              dateDropdownOptions.map((element) => {
                return (
                  <MenuItem className={styles.menuItemStyles} value={element}>
                    {element}
                  </MenuItem>
                );
              })}
          </CustomizedDropdown>
        </div>
      </div>

      <p
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.fieldDefinitionHeading
            : styles.fieldDefinitionHeading
        }
      >
        {t("fieldDefinition")}
      </p>
      <div className={styles.headingsDiv}>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.fieldName
              : styles.fieldName
          }
        >
          {t("name")}
        </p>
        <span
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.asterisk
              : styles.asterisk
          }
        >
          *
        </span>
        <p
          className={
            direction === RTL_DIRECTION ? arabicStyles.type : styles.type
          }
        >
          {t("type")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.constraints
              : styles.constraints
          }
        >
          {t("constraints")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION ? arabicStyles.length : styles.length
          }
        >
          {"Length"}
        </p>
        {!showInputFields && !isProcessReadOnly ? (
          <button
            id="table_details_show_input_strip_button"
            onClick={() => setShowInputFields(true)}
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.addFieldButton
                : styles.addFieldButton
            }
          >
            <span className={styles.addFieldButtonText}>{t("addField")}</span>
          </button>
        ) : null}
      </div>
      <div className={styles.dataDiv}>
        {showInputFields ? (
          <div className={styles.inputsDiv}>
            <InputFieldsStrip
              dataFields={dataFields}
              setValue={setMappingDetails}
              mappingDetails={mappingDetails}
              inputBaseValue={fieldName}
              inputBaseHandler={setFieldName}
              dropdownValue={fieldType}
              dropdownHandler={setFieldType}
              dropdownOptions={typeDropdownOptions}
              closeInputStrip={() => setShowInputFields(false)}
              radioTypeValue={constraintType}
              radioTypeHandler={handleConstraintType}
              addHandler={handleAddField}
              documentList={documentList}
              variablesList={variablesList}
              secondInputBase={typeLength}
              secondInputBaseHandler={setTypeLength}
              checkDisabled={checkDisabled}
            />
          </div>
        ) : null}
      </div>
      {dataFields &&
      dataFields.fieldList &&
      dataFields.fieldList.length === 0 ? (
        <div className={styles.emptyStateMainDiv}>
          <img className={styles.emptyStateImage} src={EmptyStateIcon} alt="" />
          {!isProcessReadOnly && (
            <p className={styles.emptyStateHeading}>{t("createFields")}</p>
          )}
          <p className={styles.emptyStateText}>
            {t("noDataFieldsCreated")}
            {isProcessReadOnly ? "." : t("pleaseCreateDataFields")}
          </p>
        </div>
      ) : (
        <div className={styles.tableDataDiv}>
          {dataFields.fieldList &&
            dataFields.fieldList.map((d, index) => {
              return (
                <TableDataStrip
                  dataFields={dataFields}
                  isProcessReadOnly={isProcessReadOnly}
                  fieldName={d.name}
                  fieldType={d.sTypeInt}
                  attribute={d.attribute}
                  index={index}
                  handleFieldNameChange={handleFieldNameChange}
                  checkFieldNameOnBlur={checkFieldNameOnBlur}
                  handleFieldTypeChange={handleFieldTypeChange}
                  handleAttributeChange={handleAttributeChange}
                  handleDeleteField={handleDeleteField}
                  setDataFields={setDataFields}
                  documentList={documentList}
                  variablesList={variablesList}
                  getVariableType={getVariableType}
                  precision={d.sPercision}
                  length={d.length}
                  handleFieldLength={handleFieldLength}
                  checkLengthOnBlur={checkLengthOnBlur}
                  handleFieldPrecision={handleFieldPrecision}
                  checkPrecisionOnBlur={checkPrecisionOnBlur}
                  checkDisabled={checkDisabled}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

export default TableDetails;
