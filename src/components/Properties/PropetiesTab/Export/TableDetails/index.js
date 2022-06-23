import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { useTranslation } from "react-i18next";
import InputFieldsStrip from "./InputFieldsStrip";
import { Select, InputBase, MenuItem, Radio } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EmptyStateIcon from "../../../../../assets/ProcessView/EmptyState.svg";
import { getVariableType } from "../../../../../utility/ProcessSettings/Triggers/getVariableType";
import MappingModal from "./MappingModal";
import { dateDropdownOptions, typeDropdownOptions } from "./DropdownOptions";
import {
  EXPORT_DEFINED_TABLE_TYPE,
  EXPORT_EXISTING_TABLE_TYPE,
  EXPORT_DATA_MAPPING_TYPE,
  EXPORT_DOCUMENT_MAPPING_TYPE,
} from "../../../../../Constants/appConstants";

function TableDetails(props) {
  let { t } = useTranslation();
  const { fields, data, setFields, isProcessReadOnly } = props;
  const [showInputFields, setShowInputFields] = useState(false);
  const [tableName, setTableName] = useState("");
  const [dateFormat, setDateFormat] = useState("");
  const [tableType, setTableType] = useState(EXPORT_DEFINED_TABLE_TYPE);
  const [mappingDetails, setMappingDetails] = useState({});
  const [dataFields, setDataFields] = useState({});
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [constraintType, setConstraintType] = useState("");

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
    setDataFields({ ...data });
  }, [data]);

  // Function that runs when the component loads.
  useEffect(() => {
    dataFields &&
      dataFields.FieldDef &&
      dataFields.FieldDef.forEach((element) => {
        fields.push(element.FieldName);
      });
    let unique = fields.filter((it, i, ar) => ar.indexOf(it) === i);
    setFields([...unique]);
    if (dataFields && dataFields.CSVInfo && dataFields.CSVInfo.CSVData) {
      setTableName(dataFields.CSVInfo.CSVData.TableName);
    }
    if (dataFields && dataFields.CSVInfo && dataFields.CSVInfo.CSVData) {
      setDateFormat(dataFields.CSVInfo.CSVData.DataTimeFormat);
    }
  }, [dataFields, data]);

  // Function that gets the mapping details based on fieldName.
  const getMappingDetails = (fieldName) => {
    let mappingObj;
    dataFields.DataMap.forEach((element) => {
      if (element.FieldName === fieldName) {
        mappingObj = {
          documentType: element.DocTypeId,
          mappedFieldName: element.MappedFieldName,
        };
      }
    });
    return mappingObj;
  };

  // Function that gets mappingType based on docTypeID.
  const getMappingType = (docTypeId) => {
    let mappingType;
    if (+docTypeId === 0) {
      mappingType = EXPORT_DATA_MAPPING_TYPE;
    } else if (+docTypeId === 1) {
      mappingType = EXPORT_DOCUMENT_MAPPING_TYPE;
    }
    return mappingType;
  };

  // Function that gets the max Order ID in data map array.
  const findMaxOrderId = () => {
    let maxId = 0;
    dataFields &&
      dataFields.DataMap.forEach((element) => {
        if (element.OrderID > maxId) {
          maxId = element.OrderID;
        }
      });
    return maxId;
  };

  // Function that runs when the user adds a new field.
  const handleAddField = () => {
    const fieldDefObj = {
      FieldName: fieldName,
      FieldType: "TEXT",
      FieldLength: "50",
      FieldAttribute: constraintType,
      DataFieldType: fieldType,
      Precision: "",
      StatusFlag: "G",
    };
    const maxId = findMaxOrderId();

    const dataMapObj = {
      OrderID: maxId + 1,
      FieldName: fieldName,
      MappedFieldName: mappingDetails.mappedField || "",
      FieldLength: "0",
      DocTypeId: mappingDetails.mappingType || "",
      Quoteflag: "N",
      VariableId: "0",
      VarFieldId: "0",
      ExtMethodIndex: "-1",
      Alignment: "",
      ExportAllDocs: "",
      FwdMap: [],
      RevMap: [],
    };

    dataFields.DataMap.push(dataMapObj);
    dataFields.FieldDef.push(fieldDefObj);
    fields.push(fieldName);
    setFields([...fields]);
    setDataFields(dataFields);
    setFieldName("");
    setFieldType("");
    setConstraintType("");
    setMappingDetails({});
  };

  // Function to handle table type.
  const handleTableType = (event) => {
    setTableType(event.target.value);
  };

  // Function that runs when the user changes the constraint type field.
  const handleConstraintType = (event) => {
    setConstraintType(event.target.value);
  };

  // Function that runs when the user changes the field name.
  const handleFieldNameChange = (event, index) => {
    let temp = dataFields;
    temp.FieldDef[index].FieldName = event.target.value;
    setDataFields({ ...temp });
  };

  // Function that runs when the user changes the field type.
  const handleFieldTypeChange = (event, index) => {
    let temp = dataFields;
    temp.FieldDef[index].DataFieldType = event.target.value;
    setDataFields({ ...temp });
  };

  // Function that runs when the user deletes a field.
  const handleDeleteField = (index) => {
    const [removedElement] = dataFields.FieldDef.splice(index, 1);
    const availableFieldNames = fields.filter(
      (d) => d !== removedElement.FieldName
    );
    setFields([...availableFieldNames]);
    setDataFields(dataFields);
  };

  return (
    <div className={styles.mainDiv}>
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
      <div className={styles.subDiv}>
        <p className={styles.tableName}>{t("tableName")}</p>
        <InputBase
          id="table_details_table_name_input"
          autoFocus
          disabled={
            tableType === EXPORT_EXISTING_TABLE_TYPE || isProcessReadOnly
          }
          variant="outlined"
          className={styles.inputBase}
          onChange={(event) => setTableName(event.target.value)}
          value={tableName}
        />
        <p className={styles.tableName}>{t("dateFormat")}</p>
        <Select
          disabled={isProcessReadOnly}
          id="table_details_date_format_dropdown"
          MenuProps={menuProps}
          className={styles.typeInput}
          value={dateFormat}
          onChange={(event) => setDateFormat(event.target.value)}
        >
          {dateDropdownOptions &&
            dateDropdownOptions.map((element) => {
              return (
                <MenuItem className={styles.menuItemStyles} value={element}>
                  {element}
                </MenuItem>
              );
            })}
        </Select>
      </div>

      <div className={styles.headingsDiv}>
        <p className={styles.fieldName}>{t("fieldName")}</p>
        <p className={styles.type}>{t("type")}</p>
        <p className={styles.constraints}>{t("constraints")}</p>
        <p className={styles.mappingType}>{t("mappingType")}</p>
        <p className={styles.mappingField}>{t("mappingField")}</p>
        {!showInputFields && !isProcessReadOnly ? (
          <button
            id="table_details_show_input_strip_button"
            onClick={() => setShowInputFields(true)}
            className={styles.addFieldButton}
          >
            <span className={styles.addFieldButtonText}>{t("addField")}</span>
          </button>
        ) : null}
      </div>
      <div className={styles.dataDiv}>
        {showInputFields ? (
          <div className={styles.inputsDiv}>
            <InputFieldsStrip
              setValue={setMappingDetails}
              inputBaseValue={fieldName}
              inputBaseHandler={setFieldName}
              dropdownValue={fieldType}
              dropdownHandler={setFieldType}
              dropdownOptions={typeDropdownOptions}
              closeInputStrip={() => setShowInputFields(false)}
              radioTypeValue={constraintType}
              radioTypeHandler={handleConstraintType}
              addHandler={handleAddField}
            />
          </div>
        ) : null}
      </div>
      {dataFields && dataFields.FieldDef && dataFields.FieldDef.length === 0 ? (
        <div className={styles.emptyStateMainDiv}>
          <img className={styles.emptyStateImage} src={EmptyStateIcon} alt="" />
          {!isProcessReadOnly ? (
            <p className={styles.emptyStateHeading}>{t("createFields")}</p>
          ) : null}
          <p className={styles.emptyStateText}>
            {t("noDataFieldsCreated")}
            {isProcessReadOnly ? "." : t("pleaseCreateDataFields")}
          </p>
        </div>
      ) : (
        <div className={styles.tableDataDiv}>
          {dataFields.FieldDef &&
            dataFields.FieldDef.map((d, index) => {
              return (
                <div className={styles.fieldDataDiv}>
                  <InputBase
                    disabled={isProcessReadOnly}
                    id="table_details_field_name_input"
                    variant="outlined"
                    className={styles.inputBaseData}
                    onChange={(event) => handleFieldNameChange(event, index)}
                    value={d.FieldName}
                  />
                  <Select
                    disabled={isProcessReadOnly}
                    id="table_details_field_type_dropdown"
                    MenuProps={menuProps}
                    className={styles.typeInputData}
                    value={d.DataFieldType}
                    onChange={(event) => handleFieldTypeChange(event, index)}
                  >
                    {typeDropdownOptions &&
                      typeDropdownOptions.map((d) => {
                        return (
                          <MenuItem className={styles.menuItemStyles} value={d}>
                            {getVariableType(d)}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  <p className={styles.constraintsType}>
                    {d.FieldAttribute.toUpperCase()}
                  </p>
                  <p className={styles.mappingTypeData}>
                    {getMappingType(
                      getMappingDetails(d.FieldName) &&
                        getMappingDetails(d.FieldName).documentType
                    )}
                  </p>
                  <p className={styles.mappedFieldData}>
                    {getMappingDetails(d.FieldName) &&
                      getMappingDetails(d.FieldName).mappedFieldName}
                  </p>
                  <MappingModal
                    index={index}
                    fieldName={d.FieldName}
                    dataFields={dataFields}
                    setDataFields={setDataFields}
                    isProcessReadOnly={isProcessReadOnly}
                  />
                  {!isProcessReadOnly ? (
                    <DeleteOutlinedIcon
                      id="table_details_delete_field_button"
                      onClick={() => handleDeleteField(index)}
                      className={styles.deleteIcon}
                    />
                  ) : null}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default TableDetails;
