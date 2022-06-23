import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import menuStyles from "../../../../UI/TypeAndFieldMapping/index.module.css";
import { dataInputs } from "./TypeAndFieldMapping";
import { RTL_DIRECTION } from "../../../../Constants/appConstants";
import { Checkbox, MenuItem } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EmptyStateIcon from "../../../../assets/ProcessView/EmptyState.svg";
import TypeAndFieldMapping from "../../../../UI/TypeAndFieldMapping";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Modal from "../../../../UI/Modal/Modal";
import TableMappingModal from "./TableMappingModal";

function UserDefined() {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [isDisabledDataType, setIsDisabledDataType] = useState(
    new Array(dataInputs.length).fill(false)
  );
  const [aliasName, setAliasName] = useState("");
  const [variableType, setVariableType] = useState("");
  const [dataField, setDataField] = useState("");
  const [dataType, setDataType] = useState([]);
  const [userDefinedVariables, setUserDefinedVariables] = useState([]);
  const [dataTypeData, setDataTypeData] = useState([]);
  const [arrayType, setArrayType] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to make a variable array type.
  const handleArrayType = () => {
    setArrayType(!arrayType);
  };

  // Function that closes the modal.
  const handleClose = () => {
    setIsModalOpen(false);
  };

  // Function that opens the modal.
  const openModal = () => {
    setIsModalOpen(true);
  };

  const inputComponentStyles = {
    mainDiv: styles.inputsSubDiv,
    inputbaseRtl: arabicStyles.aliasNameInput,
    inputbaseLtr: styles.aliasNameInput,
    variableTypeInputRtl: arabicStyles.variableTypeInput,
    variableTypeInputLtr: styles.variableTypeInput,
    dataFieldRtl: arabicStyles.dataFieldInput,
    dataFieldLtr: styles.dataFieldInput,
    arrayCheckboxRtl: arabicStyles.arrayCheckboxInput,
    arrayCheckboxLtr: styles.arrayCheckboxInput,
    moreOptionsRtl: arabicStyles.moreOptionsIcon,
    moreOptionsLtr: styles.moreOptionsIcon,
  };

  const dataComponentStyles = {
    mainDiv: styles.dataDiv,
    inputbaseRtl: arabicStyles.aliasNameInputData,
    inputbaseLtr: styles.aliasNameInputData,
    variableTypeInputRtl: arabicStyles.variableTypeInputData,
    variableTypeInputLtr: styles.variableTypeInputData,
    dataFieldRtl: arabicStyles.dataFieldInputData,
    dataFieldLtr: styles.dataFieldInputData,
    arrayCheckboxRtl: arabicStyles.arrayCheckboxInputData,
    arrayCheckboxLtr: styles.arrayCheckboxInputData,
    moreOptionsRtl: arabicStyles.moreOptionsIcon,
    moreOptionsLtr: styles.moreOptionsIcon,
  };

  // Function that runs when any variable is deleted.
  const handleVariableDelete = (index) => {
    const [removedElement] = userDefinedVariables.splice(index, 1);
    setUserDefinedVariables([...userDefinedVariables]);
    const removedDataField = removedElement.dataField;
    dataInputs.forEach((element) => {
      if (element.variableType === removedElement.variableType) {
        element.dataFields.push(removedDataField);
      }
    });
    if (variableType !== "") {
      getDataFields(variableType);
    }
    updateIsDisabledDataType();
  };

  // Function that runs and makes the variable type options disabled when the data fields for a variable type are all used.
  const updateIsDisabledDataType = () => {
    dataInputs.forEach((element, index) => {
      if (element.dataFields && element.dataFields.length === 0) {
        isDisabledDataType[index] = true;
      } else {
        isDisabledDataType[index] = false;
      }
    });
    setIsDisabledDataType([...isDisabledDataType]);
  };

  // Function that runs when the component loads for the first time.
  useEffect(() => {
    updateIsDisabledDataType();
  }, []);

  // Function to set alias name while user creates a variable.
  const handleAliasName = (event) => {
    setAliasName(event.target.value);
  };

  // Function that gets the values for the data fields in the input data field.
  const getDataFields = (variableType) => {
    const [dataInputObj] = dataInputs?.filter(
      (d) => d.variableType === variableType
    );
    setDataType([...dataInputObj.dataFields]);
    setDataField(dataInputObj.dataFields[0]);
  };

  // Function that sets the variable type when the user selects a value from the dropdown.
  const handleVariableType = (event) => {
    setVariableType(event.target.value);
    if (event.target.value !== "") {
      getDataFields(event.target.value);
    }
  };

  // Function that runs when the user tries to change the variable type of an existing variable.
  const handleVariableTypeData = (event, index) => {
    const oldVariableType = userDefinedVariables[index].variableType;
    userDefinedVariables[index].variableType = event.target.value;
    setUserDefinedVariables([...userDefinedVariables]);
    const selectedDataType = userDefinedVariables[index].dataField;
    if (selectedDataType !== "") {
      dataInputs.forEach((element) => {
        if (element.variableType === oldVariableType) {
          element.dataFields.push(selectedDataType);
        }
      });
      userDefinedVariables[index].dataField = "";
      setUserDefinedVariables([...userDefinedVariables]);
    }
    const [dataInputObj] = dataInputs?.filter(
      (d) => d.variableType === event.target.value
    );
    setDataTypeData([...dataInputObj.dataFields]);
    userDefinedVariables[index].dataField = dataInputObj.dataFields[0];
    const availableDataFields = dataInputObj.dataFields?.filter(
      (q) => q !== dataInputObj.dataFields[0]
    );
    dataInputs.forEach((element) => {
      if (element.variableType === event.target.value) {
        element.dataFields = availableDataFields;
      }
    });
    setUserDefinedVariables([...userDefinedVariables]);
    updateIsDisabledDataType();
  };

  // Function that runs when the user clicks on the data field dropdown of an existing variable.
  const handleDataFieldData = (index) => {
    updateIsDisabledDataType();
    const selectedVariableType = userDefinedVariables[index].variableType;
    const [dataInputObj] = dataInputs?.filter(
      (d) => d.variableType === selectedVariableType
    );
    setDataTypeData([...dataInputObj.dataFields]);
  };

  // Function that runs when a user creates a variable using the create variable button.
  const handleCreateVariable = () => {
    const userDefinedObj = {
      aliasName: aliasName,
      variableType: variableType,
      dataField: dataField,
      isArrayType: arrayType,
    };
    userDefinedVariables.splice(0, 0, userDefinedObj);
    setUserDefinedVariables([...userDefinedVariables]);
    const [dataInputObj] = dataInputs?.filter(
      (d) => d.variableType === variableType
    );
    const availableDataFields = dataInputObj.dataFields?.filter(
      (q) => q !== dataField
    );
    dataInputs.forEach((element) => {
      if (element.variableType === variableType) {
        element.dataFields = availableDataFields;
      }
    });
    setAliasName("");
    setVariableType("");
    setDataField("");
    setArrayType(false);
    updateIsDisabledDataType();
  };

  // Function that sets the data field value when the user sets a data field value while creating a variable.
  const handleDataType = (event) => {
    setDataField(event.target.value);
  };

  // Function that runs when the user opens the input data field dropdown while creating a variable.
  const handleDataTypeOnOpen = () => {
    if (variableType !== "") {
      const [dataInputObj] = dataInputs?.filter(
        (d) => d.variableType === variableType
      );
      setDataType([...dataInputObj.dataFields]);
    } else {
      setDataType([]);
    }
  };

  // Function that runs and sets the value of the data field that a user selects while creating a variable.
  const handleDataFieldChange = (event, index) => {
    const oldDataField = userDefinedVariables[index].dataField;
    const selectedVariableType = userDefinedVariables[index].variableType;
    if (oldDataField !== "") {
      dataInputs.forEach((element) => {
        if (element.variableType === selectedVariableType) {
          element.dataFields.push(oldDataField);
        }
      });
    }
    dataInputs.forEach((element) => {
      if (element.variableType === selectedVariableType) {
        const availableFields = element.dataFields?.filter(
          (d) => d !== event.target.value
        );
        element.dataFields = availableFields;
      }
    });
    if (variableType !== "") {
      getDataFields(variableType);
    }
    userDefinedVariables[index].dataField = event.target.value;
    setUserDefinedVariables([...userDefinedVariables]);
    updateIsDisabledDataType();
  };

  return (
    <div>
      <div className={styles.headerDiv}>
        <Checkbox
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.mainCheckbox
              : styles.mainCheckbox
          }
          checked={false}
          size="small"
        />
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.aliasNameHeader
              : styles.aliasNameHeader
          }
        >
          {t("aliasName")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.typeHeader
              : styles.typeHeader
          }
        >
          {t("type")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.dataFieldHeader
              : styles.dataFieldHeader
          }
        >
          {t("dataField")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.arrayHeader
              : styles.arrayHeader
          }
        >
          {t("array")}
        </p>
      </div>
      <div className={styles.inputsDiv}>
        <TypeAndFieldMapping
          autofocusInput={true}
          componentStyles={inputComponentStyles}
          handleAliasName={handleAliasName}
          aliasName={aliasName}
          variableType={variableType}
          variableTypeOnOpen={updateIsDisabledDataType}
          handleVariableType={handleVariableType}
          isDisabledDataType={isDisabledDataType}
          dataField={dataField}
          dataTypeOnOpen={handleDataTypeOnOpen}
          handleDataType={handleDataType}
          dataTypeOptions={dataType}
          arrayType={arrayType}
          handleArrayType={handleArrayType}
        />
        <div>
          {arrayType ? (
            <div className={styles.infoDiv}>
              <InfoOutlinedIcon
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.infoIcon
                    : styles.infoIcon
                }
                fontSize="small"
              />
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.infoText
                    : styles.infoText
                }
              >
                {t("tableAndMapping")}
                <br /> {t("autoCreated")}.
                <span className={styles.viewAndEdit} onClick={openModal}>
                  {t("viewOrEdit")}
                </span>
              </p>
              {isModalOpen ? (
                <Modal
                  show={isModalOpen}
                  modalClosed={handleClose}
                  style={{
                    width: "1220px",
                    height: "610px",
                    left: "10%",
                    top: "10%",
                    padding: "0px",
                  }}
                >
                  <TableMappingModal
                    aliasName={aliasName}
                    handleClose={handleClose}
                  />
                </Modal>
              ) : null}
            </div>
          ) : null}
        </div>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.buttonDiv
              : styles.buttonDiv
          }
        >
          <button
            disabled={
              aliasName === "" || variableType === "" || dataField === ""
            }
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.createVariableButton
                : styles.createVariableButton
            }
            onClick={handleCreateVariable}
          >
            <span>{t("createVariable")}</span>
          </button>
        </div>
      </div>
      {userDefinedVariables && userDefinedVariables.length === 0 ? (
        <div className={styles.emptyStateMainDiv}>
          <img className={styles.emptyStateImage} src={EmptyStateIcon} alt="" />
          <p className={styles.emptyStateHeading}>{t("createVariables")}</p>
          <p className={styles.emptyStateText}>
            {t("noQueuesCreated")}
            {t("createQueuesUsingTable")}
          </p>
        </div>
      ) : (
        userDefinedVariables &&
        userDefinedVariables.map((d, index) => {
          return (
            <div className={styles.dataDiv}>
              <Checkbox
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.dataCheckbox
                    : styles.dataCheckbox
                }
                checked={false}
                size="small"
              />
              <TypeAndFieldMapping
                componentStyles={dataComponentStyles}
                aliasName={d.aliasName}
                variableType={d.variableType}
                handleVariableType={(event) =>
                  handleVariableTypeData(event, index)
                }
                isDisabledDataType={isDisabledDataType}
                dataField={d.dataField}
                dataTypeOnOpen={() => handleDataFieldData(index)}
                handleDataType={(event) => handleDataFieldChange(event, index)}
                dataTypeOptions={dataTypeData}
                selectDataTypeOption={
                  <MenuItem
                    className={menuStyles.menuItemStyles}
                    value={d.dataField}
                  >
                    {d.dataField}
                  </MenuItem>
                }
                arrayType={d.isArrayType}
              />
              <DeleteOutlinedIcon
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.deleteIcon
                    : styles.deleteIcon
                }
                onClick={() => handleVariableDelete(index)}
              />
            </div>
          );
        })
      )}
    </div>
  );
}

export default UserDefined;
