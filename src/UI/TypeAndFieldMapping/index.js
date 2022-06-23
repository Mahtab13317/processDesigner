import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import { RTL_DIRECTION } from "../../Constants/appConstants";
import { Checkbox, InputBase, Select, MenuItem, Icon } from "@material-ui/core";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import Modal from "../../UI/Modal/Modal";
import VariableProperties from "../../components/DataModel/BusinessVariables/PrimaryVariables/VariableProperties";
import IntegerIcon from "../../assets/DataModalIcons/DM_Integer.svg";
import FloatIcon from "../../assets/DataModalIcons/DM_Float.svg";
import DateIcon from "../../assets/DataModalIcons/DM_Date.svg";
import StringIcon from "../../assets/DataModalIcons/DM_String.svg";
import LongIcon from "../../assets/DataModalIcons/DM_Long.svg";
import ComplexIcon from "../../assets/DataModalIcons/VT_Complex.svg";

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
    arrayType,
    handleArrayType,
    localLoadedProcessData,
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
        finalVariableTypes.push(complexObj);
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

  const variableTypeOnChange = (event) => {
    event.target.value.includes("C")
      ? setIsComplexTypeSelected(true)
      : setIsComplexTypeSelected(false);
    const isComplexSelected = event.target.value.includes("C") ? true : false;
    handleVariableType(event);
  };

  return (
    <div className={componentStyles.mainDiv}>
      <InputBase
        disabled={bForDisabled}
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
      <Select
        disabled={bForDisabled}
        id="type_field_mapping_variable_type_dropdown"
        MenuProps={menuProps}
        className={
          direction === RTL_DIRECTION
            ? componentStyles.variableTypeInputRtl
            : componentStyles.variableTypeInputLtr
        }
        value={variableType}
        onOpen={variableTypeOnOpen}
        onChange={variableTypeOnChange}
      >
        {variableTypeOptions &&
          variableTypeOptions.map((element, index) => {
            return (
              <MenuItem
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.menuItemStyles
                    : styles.menuItemStyles
                }
                disabled={
                  (isDisabledDataType.length > 0 &&
                    isDisabledDataType[index]) ||
                  false
                }
                value={element.value}
              >
                <div className={styles.flexRow}>
                  <Icon className={styles.iconStyle}>
                    <img className={styles.menuItemImage} src={element.icon} />
                  </Icon>
                  {t(element.label)}
                </div>
              </MenuItem>
            );
          })}
      </Select>
      <Select
        disabled={bForDisabled || isComplexTypeSelected}
        id="type_field_mapping_data_type_dropdown"
        className={
          direction === RTL_DIRECTION
            ? componentStyles.dataFieldRtl
            : componentStyles.dataFieldLtr
        }
        value={dataField}
        MenuProps={menuProps}
        onOpen={dataTypeOnOpen}
        onChange={handleDataType}
      >
        {selectDataTypeOption}
        {dataTypeOptions &&
          dataTypeOptions.map((element) => {
            return (
              <MenuItem
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.menuItemStyles
                    : styles.menuItemStyles
                }
                value={element}
              >
                {element}
              </MenuItem>
            );
          })}
      </Select>
      {/* uncomment here */}
      {/* <Checkbox
        id="type_field_mapping_array_type_checkbox"
        disabled={aliasName.trim().length === 0 && bForDisabled}
        className={
          direction === RTL_DIRECTION
            ? componentStyles.arrayCheckboxRtl
            : componentStyles.arrayCheckboxLtr
        }
        checked={arrayType}
        onChange={handleArrayType}
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
        onClick={() => setShowPropertiesModal(true)}
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
