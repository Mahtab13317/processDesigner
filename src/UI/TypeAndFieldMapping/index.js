import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import { RTL_DIRECTION } from "../../Constants/appConstants";
import {
  Checkbox,
  InputBase,
  Select,
  MenuItem,
  Icon,
  Popover,
} from "@material-ui/core";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import Modal from "../../UI/Modal/Modal";
import VariableProperties from "../../components/DataModel/BusinessVariables/PrimaryVariables/VariableProperties";
import IntegerIcon from "../../assets/DataModalIcons/DM_Integer.svg";
import FloatIcon from "../../assets/DataModalIcons/DM_Float.svg";
import DateIcon from "../../assets/DataModalIcons/DM_Date.svg";
import StringIcon from "../../assets/DataModalIcons/DM_String.svg";
import LongIcon from "../../assets/DataModalIcons/DM_Long.svg";
import ComplexIcon from "../../assets/DataModalIcons/VT_Complex.svg";
import axios from "axios";

function TypeAndFieldMapping(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [showPropertiesModal, setShowPropertiesModal] = useState(false);
  const [variableTypeOptions, setVariableTypeOptions] = useState([]);
  const [isComplexTypeSelected, setIsComplexTypeSelected] = useState(false);
  const {
    bForDisabled,
    autofocusInput,
    componentStyles,
    handleAliasName,
    aliasName,
    variableType,
    variableTypeOnOpen,
    handleVariableType,
    isDisabledDataType,
    dataField,
    dataTypeOnOpen,
    handleDataType,
    selectDataTypeOption,
    dataTypeOptions,
    // arrayType,
    // handleArrayType,
    localLoadedProcessData,
    isNonEditable,
    // isComplexTypeSelected,
  } = props;

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

  useEffect(() => {
    let complexVariableTypes = [];
    let finalVariableTypes = [
      { value: "3", label: "Integer", icon: IntegerIcon },
      { value: "4", label: "Long", icon: LongIcon },
      { value: "6", label: "Float", icon: FloatIcon },
      { value: "8", label: "Date", icon: DateIcon },
      { value: "10", label: "Text", icon: StringIcon },
      { value: "11", label: "User Defined", icon: null },
    ];
    if (
      localLoadedProcessData.ComplexVarDefinition &&
      localLoadedProcessData.ComplexVarDefinition.length > 0
    ) {
      complexVariableTypes = localLoadedProcessData.ComplexVarDefinition;
    }
    complexVariableTypes &&
      complexVariableTypes.length > 0 &&
      complexVariableTypes.forEach((element) => {
        const complexObj = {
          value: `C_${element.TypeId}`,
          label: element.TypeName,
          icon: ComplexIcon,
        };
        //finalVariableTypes.push(complexObj);
      });
    setVariableTypeOptions(finalVariableTypes);
  }, []);

  useEffect(() => {
    if (variableType.includes("C") === true) {
      setIsComplexTypeSelected(true);
    } else {
      setIsComplexTypeSelected(false);
    }
  }, [variableType]);

  const variableTypeOnChange = (event, complexDataFields) => {};
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleTypeChange = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorElMF, setAnchorElMF] = React.useState(null);

  const handleTypeChangeMF = (event) => {
    setAnchorElMF(event.currentTarget);
  };

  const handleCloseMF = () => {
    setAnchorElMF(null);
  };

  const callbackMethod = async (data) => {
    let varData = {
      variableType: "11",
      variableName: aliasName,
      unbounded: props.arrayType ? "Y" : "N",
    };
    let modData = { ...data, ...varData };

    handleVariableType("11", modData);
    //}
  };
  const microAppsHandler = (e, param) => {
    handleTypeChangeMF(e);

    let microProps = {
      source: "PD_CMP", //PD_EXT
      data_object_alias_name: localLoadedProcessData.DataObjectAliasName, // Mandatory in props in PD_EXT
      data_object_name: localLoadedProcessData.DataObjectName, // Mandatory in props in PD_EXT
      data_object_id: localLoadedProcessData.DataObjectId,
      // default_category_name: "a_puneet",
      object_type: "P", //AP/P/C
      object_id: localLoadedProcessData.ProcessDefId,
      // object_name: "a_puneet",
      parent_do: [
        {
          name: "WFINSTRUMENTTABLE",
          rel_do_id: "-1",
          relations: [
            {
              mapped_do_field: "ProcessInstanceId",
              base_do_field: "mapid",
              base_do_field_id: 0,
            },
          ],
          status: 4,
        },
      ],
      default_data_fields: [
        {
          name: "mapid",
          alias: "mapid",
          type: "1",
          key_field: true,
          id: 0,
        },
      ],

      //"1" = String, "2" = Integer, "3" = Long, "4" = Float,"5" =Date and Time,"6" = Binary Data, "7" = Currency, "8" = Boolean,"9" = ShortDate, "10" = Ntext, "11" = Text, "12" = Nvarchar,"13" = Phone Number,"14" =Email.Binary,

      ContainerId: "dataObjectContainer",
      Module: "MDM",

      Component: "DataModelListViewer",

      InFrame: false,

      Renderer: "renderDataModelListViewer",

      Callback: callbackMethod,

      // auto_generate_table: true,

      data_types: [1, 2, 3, 4, 5, 8, 9, 10],
    };
    if (param === "Y" || param === "N") {
      microProps.use_existing = param;
    } else if (param === "data_source" || param === "system") {
      microProps.upload = param; // data_source/system

      microProps.use_existing = "N";
    } else if (param === "template") {
      microProps.new_template = true;
      microProps.Component = "TemplateMF";
      microProps.use_existing = "N";
      microProps.Renderer = "renderTemplateMF";
    }
    if (props.arrayType) {
      microProps.default_data_fields.push({
        name: "insertionorderid",
        alias: "insertionorderid",
        type: "3",
        key_field: false,
        auto_generated_enabled: true,
        identity: true,
      });
      microProps.arr_type_do = "Y";
      microProps.unbounded = "Y";
    } else {
      microProps.unbounded = "N";
    }

    console.log("vvvvvvvvvvvvvv", microProps);

    window.MdmDataModel(microProps);
    handleClose();
  };

  const getVariableTypeFromVarNumber = (num) => {
    let temp = "";
    variableTypeOptions.forEach((varType) => {
      if (varType.value === num + "") temp = varType.label;
    });
    return temp;
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const openMF = Boolean(anchorElMF);
  const idMF = openMF ? "simple-popover" : undefined;

  const complexOptions = [
    { paramType: "N", label: t("createDataObject") },
    { paramType: "Y", label: t("copyAvailableDataObject") },
    { paramType: "system", label: t("uploadFromMyComputer") },
    { paramType: "data_source", label: t("importFromDataSource") },
  ];

  return (
    <div className={componentStyles.mainDiv}>
      <div
        style={{
          display: "none",
        }}
        id="dataObjectContainer"
      ></div>
      <InputBase
        disabled={bForDisabled}
        readOnly={isNonEditable}
        id="type_field_mapping_alias_name_input"
        className={
          direction === RTL_DIRECTION
            ? componentStyles.inputbaseRtl
            : componentStyles.inputbaseLtr
        }
        autoFocus={autofocusInput}
        variant="outlined"
        onChange={handleAliasName}
        value={aliasName}
      />

      <div
        style={{
          width: "180px",
          height: "30px",
          border: "1px solid rgb(0,0,0,0.3)",
          borderRadius: "2px",
          marginTop: "8px",
          marginLeft: "10px",

          display: "flex",
          alignItems: "center",
          padding: "5px",
        }}
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.menuItemStyles
            : styles.menuItemStyles
        }
        onClick={!isNonEditable && handleTypeChange}
      >
        {getVariableTypeFromVarNumber(variableType)}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div className={styles.typeDiv}>
          <div className={styles.typeInsideDiv} style={{ width: "25%" }}>
            {" "}
            <p style={{ color: "#000000", opacity: "0.54", fontSize: "12px" }}>
              {t("basicDataTypes")}
            </p>
            {variableTypeOptions &&
              variableTypeOptions
                .filter((el) => el.value !== "11")
                .map((element, index) => {
                  return (
                    <div
                      value={element.value}
                      onClick={() => {
                        handleVariableType(element.value);
                        handleClose();
                      }}
                      className={styles.flexRow}
                    >
                      <Icon className={styles.iconStyle}>
                        <img
                          className={styles.menuItemImage}
                          src={element.icon}
                          alt=""
                        />
                      </Icon>
                      <p style={{ color: "black" }}> {t(element.label)}</p>
                    </div>
                  );
                })}
          </div>
          <div
            className={styles.typeInsideDiv}
            style={{ width: "35%", border: "none" }}
          >
            <p style={{ color: "#000000", opacity: "0.54", fontSize: "12px" }}>
              {t("configureDataObjectDirectly")}
            </p>
            {complexOptions.map((option) => (
              <div
                className={styles.flexRow}
                onClick={(e) => microAppsHandler(e, option.paramType)}
              >
                <p style={{ color: "black" }}>{option.label}</p>
              </div>
            ))}
          </div>
          <div
            className={styles.typeInsideDiv}
            style={{ width: "40%", border: "none" }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: "22px",
                whiteSpace: "nowrap",
              }}
            >
              <p
                style={{ color: "#000000", opacity: "0.54", fontSize: "12px" }}
              >
                {t("useAnAvailableTemplate")}
              </p>
              <p
                style={{
                  color: "rgba(0, 114, 198, 1)",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                onClick={(e) => microAppsHandler(e, "template")}
              >
                {t("new")}
              </p>
            </div>
          </div>
        </div>
      </Popover>
      {variableType === "11" ? (
        <div
          style={{
            width: "174px",
            height: "30px",
            border: "1px solid rgb(0,0,0,0.3)",
            borderRadius: "2px",
            marginTop: "8px",
            marginLeft: "7px",

            display: "flex",
            alignItems: "center",
            padding: "5px",
            cursor: "pointer",
          }}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.menuItemStyles
              : styles.menuItemStyles
          }
        >
          {dataField}
        </div>
      ) : (
        <Select
          disabled={bForDisabled || isComplexTypeSelected || isNonEditable}
          id="type_field_mapping_data_type_dropdown"
          className={
            direction === RTL_DIRECTION
              ? componentStyles.dataFieldRtl
              : componentStyles.dataFieldLtr
          }
          value={dataField + ""}
          MenuProps={menuProps}
          // onOpen={dataTypeOnOpen}
          onChange={handleDataType}
        >
          {/* {selectDataTypeOption} */}
          {dataTypeOptions &&
            dataTypeOptions.map((element) => {
              return (
                <MenuItem
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.menuItemStyles
                      : styles.menuItemStyles
                  }
                  value={element + ""}
                >
                  {element}
                </MenuItem>
              );
            })}
        </Select>
      )}

      <Checkbox
        id="type_field_mapping_array_type_checkbox"
        disabled={
          (aliasName.trim().length === 0 && bForDisabled) || isNonEditable
        }
        className={
          direction === RTL_DIRECTION
            ? componentStyles.arrayCheckboxRtl
            : componentStyles.arrayCheckboxLtr
        }
        checked={props.arrayType}
        onChange={(e) => props.setarrayType(e)}
        size="small"
      />
      <MoreHorizOutlinedIcon
        id="type_field_mapping_more_options"
        className={
          direction === RTL_DIRECTION
            ? componentStyles.moreOptionsRtl
            : componentStyles.moreOptionsLtr
        }
        fontSize="small"
        onClick={() => !isNonEditable && setShowPropertiesModal(true)}
      />
      {showPropertiesModal ? (
        <Modal
          show={showPropertiesModal}
          style={{
            opacity: "1",
            width: "243px",
            height: "164px",
            top: "15%",
            padding: "0% !important",
            position: "absolute",
          }}
          modalClosed={() => setShowPropertiesModal(false)}
          children={
            <VariableProperties
              setShowPropertiesModal={setShowPropertiesModal}
              aliasName={aliasName}
              variableType={variableType}
              defaultValue={props.defaultValue}
              variableLength={props.variableLength}
            />
          }
        />
      ) : null}
    </div>
  );
}

export default TypeAndFieldMapping;
