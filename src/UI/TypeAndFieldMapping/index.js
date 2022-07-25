import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import { RTL_DIRECTION } from "../../Constants/appConstants";
import {
  dataInputs,
  getDropdownOptions,
} from "../../components/DataModel/BusinessVariables/PrimaryVariables/TypeAndFieldMapping";
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
    varData,
    microProps,
    modifyVariableData,
    setmicroProps,
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
    isEditable,
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
  const [DataFieldsOptions, setDataFieldsOptions] = useState([]);

  useEffect(() => {
    console.log("ccccccccccccccc", dataInputs);
    dataInputs.forEach((d) => {
      if (d.variableType === variableType) {
        setDataFieldsOptions(d.dataFields);
      }
    });
  }, [variableType]);

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

  const [open, setopen] = useState(false);

  useEffect(() => {
    if (variableType.includes("C") === true) {
      setIsComplexTypeSelected(true);
    } else {
      setIsComplexTypeSelected(false);
    }
  }, [variableType]);

  const handleClose = () => {
    setAnchorElMF(null);
    setopen(false);
  };
  const [anchorElMF, setAnchorElMF] = React.useState(null);

  const handleTypeChangeMF = (event) => {
    setopen(true);
    setAnchorElMF(event?.currentTarget);
  };

  const microAppsHandler = (e, param) => {
    let temp = { ...microProps };
    if (param === "Y" || param === "N") {
      temp.use_existing = param;
    } else if (param === "data_source" || param === "system") {
      temp.upload = param; // data_source/system

      temp.use_existing = "N";
    } else if (param === "template") {
      temp.new_template = true;
      temp.Component = "TemplateMF";
      temp.use_existing = "N";
      temp.Renderer = "renderTemplateMF";
    } else if (param === "primitiveArray") {
      temp.source = "PD_ARR";
      temp.Component = "DataModelDesignerViewer";
      temp.Renderer = "renderDataModelDesignerViewer";
      let tempArr = [
        {
          name: "mapid",
          alias: "mapid",
          type: "1",
          key_field: false,
          id: 0,
        },
        {
          name: aliasName.split(" ").join("_"),
          alias: aliasName,
          type: "1",
          key_field: false,
        },
        {
          name: "insertionorderid",
          alias: "insertionorderid",
          type: "3",
          key_field: true,
          auto_generated_enabled: true,
          identity: true,
        },
      ];
      temp.default_data_fields = [];
      temp.default_data_fields = [...tempArr];
      temp.arr_type_do = "Y";
    }
    if (props.arrayType) {
      let tempArr = [
        {
          name: "mapid",
          alias: "mapid",
          type: "1",
          key_field: false,
          id: 0,
        },

        {
          name: "insertionorderid",
          alias: "insertionorderid",
          type: "3",
          key_field: true,
          auto_generated_enabled: true,
          identity: true,
        },
      ];
      temp.default_data_fields = [];
      temp.default_data_fields = [...tempArr];
      temp.arr_type_do = "Y";
    }
    // else {
    //   microProps.unbounded = "N";
    // }

    // setmicroProps(temp);

    window.MdmDataModel(temp);
    handleClose();
  };

  const modifyMethod = (data) => {
    modifyVariableData(data);
  };

  const openModifyMF = () => {
    let microMFProps = {
      source: "PD_CMP", //PD_EXT
      template_id: "",
      // "use_existing":"Y",
      data_object_alias_name: varData?.dataField.split("_").join(" "), // Mandatory in props in PD_EXT
      data_object_name: varData?.dataField, // Mandatory in props in PD_EXT
      data_object_id: +varData?.dataObjectId,

      object_type: "P", //AP/P/C

      // parent_do: [
      //   {
      //     name: "WFINSTRUMENTTABLE",
      //     rel_do_id: "-1",
      //     relations: [
      //       {
      //         mapped_do_field: "ProcessInstanceID",
      //         base_do_field_id: 1,
      //         base_do_field: "itemindex",
      //       },
      //     ],
      //     status: 4,
      //   },
      // ],
      // default_data_fields: [
      //   //PD_EXT    // Mandatory
      //   {
      //     name: "itemindex",
      //     id: 1,
      //     alias: "itemindex",
      //     type: "2",
      //     key_field: true,
      //     auto_generated_enabled: true,
      //     identity: true,
      //   },
      // ],

      ContainerId: "dataModifyContainer",
      Module: "MDM",

      Component: "DataModelListViewer",

      InFrame: false,

      Renderer: "renderDataModelListViewer",

      Callback: modifyMethod,

      // auto_generate_table: true,

      data_types: [1, 2, 3, 4, 5, 8, 9, 10],
    };
    console.log("mmmmmmmmmmmmmmmicro", microMFProps);
    window.MdmDataModel(microMFProps);
  };

  const getVariableTypeFromVarNumber = (num) => {
    let temp = "";
    variableTypeOptions.forEach((varType) => {
      if (varType.value === num + "") temp = varType.label;
    });
    return temp;
  };

  const complexOptions = [
    { paramType: "N", label: t("createDataObject") },
    { paramType: "Y", label: t("copyAvailableDataObject") },
    { paramType: "system", label: t("uploadFromMyComputer") },
    { paramType: "data_source", label: t("importFromDataSource") },
  ];

  return (
    <div
      className={componentStyles.mainDiv}
      style={{ background: isEditable ? "#0072C61A" : "" }}
    >
      <div
        style={{
          display: "none",
        }}
        id="dataObjectContainer"
      ></div>
      <div
        style={{
          display: "none",
        }}
        id="dataModifyContainer"
      ></div>
      <InputBase
        disabled={bForDisabled}
        readOnly={props?.newField ? !props.newField : !isEditable}
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
        onClick={(e) => {
          if (isEditable) {
            if (
              varData?.hasOwnProperty("dataObjectId") &&
              varData?.dataObjectId !== ""
            ) {
              openModifyMF();
            } else handleTypeChangeMF(e);
          }
        }}
      >
        {getVariableTypeFromVarNumber(variableType)}
      </div>
      <Popover
        open={open}
        anchorEl={anchorElMF}
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
      {variableType === "11" || (variableType !== 11 && props.arrayType) ? (
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
          disabled={bForDisabled || isComplexTypeSelected || !isEditable}
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
          {dataTypeOptions?.map((element) => {
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
          (aliasName.trim().length === 0 && bForDisabled) ||
          !isEditable ||
          variableType === "11"
        }
        className={
          direction === RTL_DIRECTION
            ? componentStyles.arrayCheckboxRtl
            : componentStyles.arrayCheckboxLtr
        }
        checked={props.arrayType}
        onChange={(e) => {
          if (
            variableType !== "11" &&
            variableType !== "" &&
            e.target.checked
          ) {
            microAppsHandler(e, "primitiveArray");
          }
          props.setarrayType(e);
        }}
        size="small"
      />
      {/* <MoreHorizOutlinedIcon
        id="type_field_mapping_more_options"
        className={
          direction === RTL_DIRECTION
            ? componentStyles.moreOptionsRtl
            : componentStyles.moreOptionsLtr
        }
        fontSize="small"
        onClick={() => isEditable && setShowPropertiesModal(true)}
      /> */}
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
