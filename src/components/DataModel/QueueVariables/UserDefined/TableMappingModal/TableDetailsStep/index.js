import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import { useTranslation } from "react-i18next";
import { InputBase, Divider, Select, MenuItem } from "@material-ui/core";
import InputFieldsStrip from "../InputFieldsStrip";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { columnDetails } from "./ColumnAndDataMapping";
import { getVariableType } from "../../../../../../utility/ProcessSettings/Triggers/getVariableType";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { RTL_DIRECTION } from "../../../../../../Constants/appConstants";

function TableDetailsStep(props) {
  const { aliasName, setChildTableName, setChildVariableName, setColumnData } =
    props;
  const foreignKeyOptions = ["3", "4"];
  const columnDropdownOptions = [
    "10",
    "6",
    "3",
    "4",
    "8",
    "12",
    "15",
    "16",
    "17",
    "18",
  ];
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [tableAliasName, setTableAliasName] = useState(aliasName);
  const [tableName, setTableName] = useState(aliasName.split(" ").join(""));
  const [showInputFields, setShowInputFields] = useState(false);
  const [tableColumnDetails, setTableColumnDetails] = useState(columnDetails);
  const [columnAliasName, setColumnAliasName] = useState("");
  const [columnVariableType, setColumnVariableType] = useState("");
  const [columnDataField, setColumnDataField] = useState("");
  const [primaryKey, setPrimaryKey] = useState(false);

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
    setChildTableName(aliasName.split(" ").join(""));
    tableColumnDetails.forEach((element) => {
      if (element.isForiegnKey === true) {
        const dataField = element.dataField;
        setChildVariableName(dataField);
      }
    });
    setColumnData([...tableColumnDetails]);
  }, []);

  // Function that handles the change in table alias name.
  const handleTableAliasName = (event) => {
    setTableAliasName(event.target.value);
  };

  // Function that handles the change in table name.
  const handleTableName = (event) => {
    setTableName(event.target.value);
    setChildTableName(event.target.value);
  };

  // Function that handles the change in column alias name.
  const handleColumnAliasName = (event, index) => {
    tableColumnDetails[index].aliasName = event.target.value;
    setTableColumnDetails([...tableColumnDetails]);
    setColumnData([...tableColumnDetails]);
  };

  // Function that handles the change in variable type.
  const handleVariableType = (event, index) => {
    tableColumnDetails[index].variableType = event.target.value;
    setTableColumnDetails([...tableColumnDetails]);
    setColumnData([...tableColumnDetails]);
  };

  // Function that handles the change in data field.
  const handleDataField = (event, index) => {
    tableColumnDetails[index].dataField = event.target.value;
    setTableColumnDetails([...tableColumnDetails]);
    tableColumnDetails.forEach((element) => {
      if (element.isForiegnKey === true) {
        const dataField = element.dataField;
        setChildVariableName(dataField);
      }
    });
    setColumnData([...tableColumnDetails]);
  };

  // Function that runs when a user deletes a column that he has previously made.
  const handleDeleteColumn = (index) => {
    tableColumnDetails.splice(index, 1);
    setTableColumnDetails([...tableColumnDetails]);
  };

  return (
    <div className={styles.tableDetailsMainDiv}>
      <div className={styles.tableDetailsDiv}>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.tableAliasName
              : styles.tableAliasName
          }
        >
          {t("aliasName")}
        </p>
        <InputBase
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.tableAliasNameInput
              : styles.tableAliasNameInput
          }
          autoFocus
          variant="outlined"
          onChange={handleTableAliasName}
          value={tableAliasName}
        />
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.tableName
              : styles.tableName
          }
        >
          {t("tableName")}
        </p>
        <InputBase
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.tableNameInput
              : styles.tableNameInput
          }
          variant="outlined"
          onChange={handleTableName}
          value={tableName}
        />
        <button
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.existingTableButton
              : styles.existingTableButton
          }
        >
          <span className={styles.existingTableButtonText}>
            {t("selectAnExistingTable")}
          </span>
        </button>
      </div>

      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.headersDiv
            : styles.headersDiv
        }
      >
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.aliasName
              : styles.aliasName
          }
        >
          {t("aliasName")}
        </p>
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
              ? arabicStyles.dataField
              : styles.dataField
          }
        >
          {t("dataField")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION ? arabicStyles.role : styles.role
          }
        >
          {t("role")}
        </p>
        {!showInputFields ? (
          <button
            onClick={() => setShowInputFields(true)}
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.addVariable
                : styles.addVariable
            }
          >
            <span className={styles.addVariableText}>{t("addVariable")}</span>
          </button>
        ) : null}
      </div>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.mandatoryFields
            : styles.mandatoryFields
        }
      >
        {showInputFields ? (
          <div className={styles.inputsDiv}>
            <InputFieldsStrip
              columnAliasName={columnAliasName}
              setColumnAliasName={setColumnAliasName}
              columnVariableType={columnVariableType}
              setColumnVariableType={setColumnVariableType}
              columnDataField={columnDataField}
              setColumnDataField={setColumnDataField}
              primaryKey={primaryKey}
              setPrimaryKey={setPrimaryKey}
              tableColumnDetails={tableColumnDetails}
              setTableColumnDetails={setTableColumnDetails}
              setColumnData={setColumnData}
              closeInputStrip={() => setShowInputFields(false)}
              columnDropdownOptions={columnDropdownOptions}
              getVariableType={getVariableType}
            />
          </div>
        ) : null}

        {tableColumnDetails &&
          tableColumnDetails.map((d, index) => {
            return (
              <div className={styles.predefinedFields}>
                <div className={styles.primaryKeyDetails}>
                  <InputBase
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.aliasNameDataInput
                        : styles.aliasNameDataInput
                    }
                    variant="outlined"
                    onChange={(event) => handleColumnAliasName(event, index)}
                    value={d.aliasName}
                  />
                  {d.isAutoIncrement ? (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <p
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.typeDataInput
                            : styles.typeDataInput
                        }
                      >
                        {getVariableType(d.variableType)}
                      </p>
                      <p
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.dataFieldInput
                            : styles.dataFieldInput
                        }
                      >
                        {d.dataField}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Select
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.variableDropdown
                            : styles.variableDropdown
                        }
                        value={d.variableType}
                        MenuProps={menuProps}
                        onChange={(event) => handleVariableType(event, index)}
                      >
                        {d.isForiegnKey === false && d.isAutoIncrement === false
                          ? columnDropdownOptions &&
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
                            })
                          : foreignKeyOptions &&
                            foreignKeyOptions.map((d) => {
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
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.dataFieldInputField
                            : styles.dataFieldInputField
                        }
                        variant="outlined"
                        onChange={(event) => handleDataField(event, index)}
                        value={d.dataField}
                      />
                    </div>
                  )}
                  <div
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.tagsDiv
                        : styles.tagsDiv
                    }
                  >
                    {d.isAutoIncrement ? (
                      <div
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.autoIncrementId
                            : styles.autoIncrementId
                        }
                      >
                        <span
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.tagDiv
                              : styles.tagDiv
                          }
                        >
                          {t("autoIncrementID")}
                          <InfoOutlinedIcon
                            className={styles.autoIncrementInfoIcon}
                            fontSize="small"
                          />
                        </span>
                      </div>
                    ) : null}
                    {d.isPrimaryKey ? (
                      <div className={styles.primaryKey}>
                        <span
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.tagDiv
                              : styles.tagDiv
                          }
                        >
                          {t("primaryKey")}
                          <InfoOutlinedIcon
                            className={styles.primaryKeyInfoIcon}
                            fontSize="small"
                          />
                        </span>
                      </div>
                    ) : null}
                    {d.isForiegnKey ? (
                      <div className={styles.foreignKey}>
                        <span
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.tagDiv
                              : styles.tagDiv
                          }
                        >
                          {t("foreignKey")}
                          <InfoOutlinedIcon
                            className={styles.foreignKeyInfoIcon}
                            fontSize="small"
                          />
                        </span>
                      </div>
                    ) : null}
                  </div>
                  {d.isAutoIncrement === false && d.isForiegnKey === false ? (
                    <DeleteOutlinedIcon
                      onClick={() => handleDeleteColumn(index)}
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.deleteIcon
                          : styles.deleteIcon
                      }
                    />
                  ) : null}
                </div>
                <Divider />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default TableDetailsStep;
