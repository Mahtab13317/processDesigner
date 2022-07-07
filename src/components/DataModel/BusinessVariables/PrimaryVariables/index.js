import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import menuStyles from "../../../../UI/TypeAndFieldMapping/index.module.css";
import {
  dataInputs,
  getVariableIdFromSysDefinedName,
} from "./TypeAndFieldMapping";
import { BASE_URL, RTL_DIRECTION } from "../../../../Constants/appConstants";
import { Checkbox, MenuItem } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EmptyStateIcon from "../../../../assets/ProcessView/EmptyState.svg";
import TypeAndFieldMapping from "../../../../UI/TypeAndFieldMapping";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Modal from "../../../../UI/Modal/Modal";
import TableMappingModal from "./TableMappingModal";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";
import { SERVER_URL } from "../../../../Constants/appConstants";
import axios from "axios";

function RelationshipMappingModal(props) {
  const {
    openProcessID,
    isArrayType,
    tableName,
    variableName,
    mappingDataField,
    relationAndMapping,
  } = props;
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      {isArrayType ? (
        // <p
        //   className={
        //     direction === RTL_DIRECTION
        //       ? arabicStyles.infoText
        //       : styles.infoText
        //   }
        // >
        //   <span
        //     id="view_or_edit_mapping"
        //     className={styles.viewAndEdit}
        //     onClick={() => setIsModalOpen(true)}
        //   >
        //     {t("viewOrEdit")}
        //   </span>
        //   &nbsp;&nbsp;
        //   {t("tableMapping")}
        //   <br /> {t("andRelationship")}.
        // </p>
        <InfoOutlinedIcon
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.infoIcon
              : styles.dataInfoIcon
          }
          fontSize="small"
          onClick={() => setIsModalOpen(true)}
        />
      ) : null}
      {isModalOpen ? (
        <Modal
          show={isModalOpen}
          modalClosed={() => setIsModalOpen(false)}
          style={{
            width: "90%",
            height: "80%",
            left: "5%",
            top: "10%",
            padding: "0px",
          }}
        >
          <TableMappingModal
            isDataModal={true}
            openProcessID={openProcessID}
            aliasName={variableName}
            tableName={tableName}
            mappingDataField={mappingDataField}
            relationAndMapping={relationAndMapping}
            handleClose={() => setIsModalOpen(false)}
          />
        </Modal>
      ) : null}
    </div>
  );
}

function PrimaryVariables(props) {
  let { t } = useTranslation();
  const {
    openProcessID,
    isProcessReadOnly,
    bForInputStrip,
    setBForInputStrip,
    setPrimaryVariableCount,
  } = props;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const direction = `${t("HTML_DIR")}`;
  const [isDisabledDataType, setIsDisabledDataType] = useState(
    new Array(dataInputs.length).fill(false)
  );
  const [aliasName, setAliasName] = useState("");
  const [variableType, setVariableType] = useState("");
  const [complexDataJSON, setcomplexDataJSON] = useState({});
  const [dataField, setDataField] = useState("");
  const [dataType, setDataType] = useState([]);
  const [userDefinedVariables, setUserDefinedVariables] = useState([]);
  const [dataTypeData, setDataTypeData] = useState([]);
  const [arrayType, setArrayType] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComplexTypeSelected, setIsComplexTypeSelected] = useState(false);
  const [isComplexSelected, setIsComplexSelected] = useState(false);

  // Function to make a variable array type.
  const handleArrayType = (e) => {
    setArrayType(e.target.checked);
    setcomplexDataJSON((prev) => {
      let temp = { ...prev };
      temp.unbounded = e.target.checked ? "Y" : "N";
      return temp;
    });
  };

  // Function that closes the modal.
  const handleClose = () => {
    setIsModalOpen(false);
  };

  // Function that opens the modal.
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function that runs when the component loads.
  useEffect(() => {
    getUserDefinedVariables(localLoadedProcessData);
  }, []);

  useEffect(() => {
    getComplexTemplates();
  }, []);

  const getComplexTemplates = async () => {
    const res = await axios({
      method: "post",
      url: "/mdm-rest/app/templates",
      data: {
        sort_order: "A",
        filter: "",
        order_by: "2",
      },
    });
    console.log("vvvvvvvvvvvvvvvvvres", res.data);
  };
  console.log("vvvvvvvvvvvvvvvmodata", complexDataJSON);
  const getUserDefinedVariables = (processData) => {
    let temp = [];
    processData &&
      processData.Variable.map((variable) => {
        if (
          variable.VariableScope === "U" ||
          (variable.VariableScope === "I" && variable.ExtObjectId !== "1")
        ) {
          temp.push({
            aliasName: variable.VariableName,
            dataField: variable.SystemDefinedName,
            arrayType: variable.Unbounded === "Y" ? true : false,
            variableType: variable.VariableType,
            defaultValue: variable.DefaultValue,
            variableLength: variable.VariableLength,
            columnName: variable.ColumnName || "",
            tableName: variable.TableName || "",
            relationAndMapping: variable.RelationAndMapping || "",
            variableId: variable.VariableId,
          });
        }
      });
    setUserDefinedVariables(temp);
    //removeUsedDataFields(temp);
    setPrimaryVariableCount(temp.length);
  };

  // Function to remove the already used data fields.
  const removeUsedDataFields = (dataArr) => {
    dataArr &&
      dataArr.forEach((dataElement) => {
        dataInputs &&
          dataInputs.forEach((dataFieldsElem) => {
            if (dataElement.variableType === dataFieldsElem.variableType) {
              dataFieldsElem.dataFields = dataFieldsElem.dataFields?.filter(
                (element) => element !== dataElement.dataField
              );
            }
          });
      });
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
  const handleVariableDelete = (index, selectedVariable) => {
    let postBody = {
      processDefId: props.openProcessID,
      varName: selectedVariable.aliasName,
      variableId: selectedVariable.variableId,
      varType: selectedVariable.variableType,
      sysDefName: selectedVariable.dataField,
    };

    axios.post(SERVER_URL + `/deleteVariable`, postBody).then((res) => {
      if (res.status === 200 && res.data.Status === 0) {
        const temp = [...userDefinedVariables];
        const [removedElement] = temp.splice(index, 1);
        // Updating processData on deleting Variable
        let newProcessData = JSON.parse(JSON.stringify(localLoadedProcessData));
        let indexValue;
        newProcessData.Variable.map((variable, index) => {
          if (variable.VariableId == selectedVariable.variableId) {
            indexValue = index;
          }
        });
        newProcessData.Variable.splice(indexValue, 1);
        setLocalLoadedProcessData(newProcessData);
        const removedDataField = removedElement.dataField;
        dataInputs.forEach((element) => {
          if (element.variableType === removedElement.variableType) {
            element.dataFields.push(removedDataField);
          }
        });
        setUserDefinedVariables(temp);
        setPrimaryVariableCount(temp.length);
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
    let temp = [];
    dataInputs.forEach((data) => {
      if (data.variableType === variableType) {
        temp = data.dataFields;
      }
    });
    localLoadedProcessData.Variable.forEach((_var) => {
      const index = temp.indexOf(_var.SystemDefinedName);
      if (index > -1) {
        temp.splice(index, 1);
      }
    });
    setDataType(variableType);
    // setDataField(temp);
  };

  // Function that sets the variable type when the user selects a value from the dropdown.
  const handleVariableType = (event, complexDataFields) => {
    setcomplexDataJSON(complexDataFields);
    if (event === "11") {
      setDataField(complexDataFields?.name);
    }
    setVariableType(event);
    // if (
    //   event !== "" &&
    //   event.includes("C") === false
    // ) {
    // getDataFields(event);

    //   setIsComplexSelected(false);
    // } else if (event.target.value.includes("C") === true) {
    //   setDataField("");
    //   setIsComplexSelected(true);
    // }
  };

  // Function that runs when the user tries to change the variable type of an existing variable.
  const handleVariableTypeData = (event, index, complexDataFields) => {
    if (!event.includes("C")) {
      const oldVariableType = userDefinedVariables[index].variableType;
      userDefinedVariables[index].variableType = event;
      setUserDefinedVariables([...userDefinedVariables]);
      const selectedDataType = userDefinedVariables[index].dataField;
      if (selectedDataType !== "") {
        dataInputs.forEach((element) => {
          if (element.variableType === oldVariableType) {
            element.dataFields.push(selectedDataType);
          }
        });
        setUserDefinedVariables((prevState) => {
          let temp = [...prevState];
          temp[index].dataField = "";
          return temp;
        });
      }
      const [dataInputObj] = dataInputs?.filter(
        (d) => d.variableType === event
      );
      if (event === "11") {
        setDataTypeData([...complexDataFields.map((el) => el.alias)]);
      } else {
        setDataTypeData([...dataInputObj.dataFields]);
        let temp = [...userDefinedVariables];
        temp[index].dataField = dataInputObj.dataFields[0];
        const availableDataFields = dataInputObj.dataFields?.filter(
          (q) => q !== dataInputObj.dataFields[0]
        );
        // dataInputs.forEach((element) => {
        //   if (element.variableType === event) {
        //     element.dataFields = availableDataFields;
        //   }
        // });
        setUserDefinedVariables(temp);
        updateIsDisabledDataType();
      }
    } else {
      let temp = [...userDefinedVariables];
      temp[index].dataField = "";
      setUserDefinedVariables(temp);
    }
    let temp = [...userDefinedVariables];
    temp[index].variableType = event;
    setUserDefinedVariables(temp);
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
  const handleCreateVariable = async () => {
    const userDefinedObj = {
      aliasName: aliasName,
      variableType: variableType,
      dataField: dataField,
      isArrayType: arrayType,
    };

    let postBody = {
      processDefId: props.openProcessID,
      varName: aliasName,
      variableId: getVariableIdFromSysDefinedName(dataField, variableType),
      varType: variableType,
      sysDefName: dataField,
      defaultValue: "",
      varLength: "0",
      varPrecision: "0",
      unbounded: arrayType ? "Y" : "N",
      extObjectId: "0",
    };
    if (variableType !== "11") {
      axios.post(SERVER_URL + `/addVariable`, postBody).then((res) => {
        if (res.status === 200 && res.data.Status === 0) {
          let temp = [...userDefinedVariables];
          temp.splice(0, 0, userDefinedObj);
          setUserDefinedVariables(temp);
          setPrimaryVariableCount(temp.length);
          // Updating processData on adding Variable
          let newProcessData = JSON.parse(
            JSON.stringify(localLoadedProcessData)
          );
          newProcessData.Variable.push({
            DefaultValue: "",
            ExtObjectId: "0",
            SystemDefinedName: dataField,
            Unbounded: arrayType ? "Y" : "N",
            VarFieldId: "0",
            VarPrecision: "0",
            VariableId: getVariableIdFromSysDefinedName(
              dataField,
              variableType
            ),
            VariableLength: "0",
            VariableName: aliasName,
            VariableScope: "U",
            VariableType: variableType,
          });
          setLocalLoadedProcessData(newProcessData);
        }
      });
      if (!isComplexSelected) {
        const [dataInputObj] = dataInputs?.filter(
          (d) => d.variableType === variableType
        );
        const availableDataFields = dataInputObj.dataFields?.filter(
          (q) => q !== dataField
        );
        // dataInputs.forEach((element) => {
        //   if (element.variableType === variableType) {
        //     element.dataFields = availableDataFields;
        //   }
        // });
        updateIsDisabledDataType();
      }
      setAliasName("");
      setVariableType("");
      setDataField("");
      setArrayType(false);
    } else {
      const formData = new FormData();
      let mystring = JSON.stringify(complexDataJSON);
      let myBlob = new Blob([mystring], {
        type: "text/plain",
      });
      formData.append("file", myBlob);

      if (complexDataJSON.hasOwnProperty("id")) {
        const response = await axios({
          method: "post",
          url: `/pmweb/saveVariable/${localLoadedProcessData.ProcessDefId}`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            // type: "application/json",
          },
        });
        if (response.data.Status === 0 && response.data.Variable.length !== 0) {
          let temp = JSON.parse(JSON.stringify(localLoadedProcessData));
          temp.Variable = [];
          temp.Variable = [...response.data.Variable];
          setLocalLoadedProcessData(temp);
          getUserDefinedVariables(temp);
          setAliasName("");
          setVariableType("");
          setDataField("");
          setArrayType(false);
        }
      }
    }
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

  const getDataFieldsForType = (type, isNewVar, dataField) => {
    let temp = [];
    dataInputs.forEach((data) => {
      if (data.variableType === type) {
        temp = data.dataFields;
      }
    });

    localLoadedProcessData.Variable.forEach((_var) => {
      const index = temp.indexOf(_var.SystemDefinedName);
      if (index > -1) {
        temp.splice(index, 1);
      }
    });

    if (dataField !== "") {
      temp.push(dataField);
    }

    if (type === "11" || type === "") return [];
    else return temp;
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

  const changeUnboundedType = (e, varObj, index) => {
    let temp = JSON.parse(JSON.stringify(localLoadedProcessData));
    temp?.Variable.forEach((_var) => {
      if (_var.VariableId === varObj.variableId) {
        _var.Unbounded = e.target.checked ? "Y" : "N";
      }
    });
    setLocalLoadedProcessData(temp);
    userDefinedVariables[index].arrayType = e.target.checked;
    setUserDefinedVariables([...userDefinedVariables]);
  };

  return (
    <div className={styles.mainDiv}>
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
          {t("allowMultipleEntries")}
        </p>
      </div>
      {bForInputStrip ? (
        <div className={styles.inputsDiv}>
          <TypeAndFieldMapping
            autofocusInput={true}
            componentStyles={inputComponentStyles}
            handleAliasName={handleAliasName}
            aliasName={aliasName}
            variableType={variableType}
            variableTypeOnOpen={updateIsDisabledDataType}
            handleVariableType={(e, complexDataFields) =>
              handleVariableType(e, complexDataFields)
            }
            isDisabledDataType={isDisabledDataType}
            dataField={dataField}
            dataTypeOnOpen={handleDataTypeOnOpen}
            handleDataType={handleDataType}
            dataTypeOptions={getDataFieldsForType(
              variableType,
              true,
              dataField
            )}
            arrayType={arrayType}
            setarrayType={(e) => handleArrayType(e)}
            localLoadedProcessData={localLoadedProcessData}
          />
          <div>
            {arrayType ? (
              <div className={styles.infoDiv}>
                {/* <InfoOutlinedIcon
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.infoIcon
                      : styles.infoIcon
                  }
                  fontSize="small"
                /> */}
                <p
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.infoText
                      : styles.infoText
                  }
                >
                  {/* {t("tableAndMapping")}
                  <br /> {t("autoCreated")}. */}
                  <span
                    id="view_or_edit_mapping"
                    className={styles.viewAndEdit}
                    onClick={openModal}
                  >
                    {t("viewOrEdit")}
                  </span>
                </p>
                {isModalOpen ? (
                  <Modal
                    show={isModalOpen}
                    modalClosed={handleClose}
                    style={{
                      width: "90%",
                      height: "80%",
                      left: "5%",
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
            <ClearOutlinedIcon
              id="primary_variables_close_input_strip"
              onClick={() => setBForInputStrip(false)}
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.closeInputStrip
                  : styles.closeInputStrip
              }
            />
            <button
              id="primary_variables_create_variable"
              disabled={aliasName === "" || variableType === ""}
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
      ) : null}
      {userDefinedVariables && userDefinedVariables.length === 0 ? (
        <div className={styles.emptyStateMainDiv}>
          <img className={styles.emptyStateImage} src={EmptyStateIcon} alt="" />
          {!isProcessReadOnly ? (
            <p className={styles.emptyStateHeading}>{t("createVariables")}</p>
          ) : null}
          <p className={styles.emptyStateText}>
            {t("noQueuesCreated")}
            {!isProcessReadOnly ? t("createQueuesUsingTable") : "."}
          </p>
        </div>
      ) : (
        userDefinedVariables &&
        userDefinedVariables.map((d, index) => {
          return (
            <div className={styles.dataDiv}>
              <Checkbox
                disabled={isProcessReadOnly}
                id="primary_variables_data_checkbox"
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.dataCheckbox
                    : styles.dataCheckbox
                }
                checked={false}
                size="small"
              />
              <TypeAndFieldMapping
                bForDisabled={isProcessReadOnly}
                componentStyles={dataComponentStyles}
                aliasName={d.aliasName}
                variableType={d.variableType}
                variableLength={d.variableLength}
                handleVariableType={(event, complexDataFields) =>
                  handleVariableTypeData(event, index, complexDataFields)
                }
                isDisabledDataType={isDisabledDataType}
                dataField={d.dataField}
                defaultValue={d.defaultValue}
                dataTypeOnOpen={() => handleDataFieldData(index)}
                handleDataType={(event) => handleDataFieldChange(event, index)}
                dataTypeOptions={getDataFieldsForType(
                  d.variableType,
                  false,
                  d.dataField
                )}
                isNonEditable={true}
                // selectDataTypeOption={
                //   <MenuItem
                //     className={menuStyles.menuItemStyles}
                //     value={d.dataField}
                //   >
                //     {d.dataField}
                //   </MenuItem>
                // }
                arrayType={d.arrayType}
                localLoadedProcessData={localLoadedProcessData}
                setarrayType={(e) => changeUnboundedType(e, d, index)}
              />
              <RelationshipMappingModal
                openProcessID={openProcessID}
                isArrayType={d?.isArrayType}
                tableName={d?.tableName || ""}
                variableName={d?.aliasName}
                mappingDataField={d?.columnName}
                relationAndMapping={d?.relationAndMapping}
              />
              {!isProcessReadOnly ? (
                <DeleteOutlinedIcon
                  id="primary_variables_delete_variable"
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.deleteIcon
                      : styles.deleteIcon
                  }
                  onClick={() => handleVariableDelete(index, d)}
                />
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
  };
};

export default connect(mapStateToProps, null)(PrimaryVariables);
