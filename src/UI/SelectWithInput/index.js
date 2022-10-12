import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import "./common.css";
import "./commonArabic.css";
import { CONSTANT, RTL_DIRECTION } from "../../Constants/appConstants";
import { useTranslation } from "react-i18next";
import { TRIGGER_CONSTANT } from "../../Constants/triggerConstants";

//func for handling filtering in options
const filter = createFilterOptions();

/*
  Here, 
  state=>{
    1.selectedValue state is used to store the value of selected option.
    2.options is the array list of dropdown options.
    3.isConstantAdded is used to tell whether the selected value is from list of options or some constant value
    4.constantValue is used to store the constant value entered
  }
  props=>{
    1.dropdownOptions is the array of options in select optionList.
    2.optionKey -> key which is used to display option from options array
    5.showEmptyString -> whether empty string should be added as option in select
    6.showConstValue -> whether constant should be added as option in select
    7.setIsConstant -> to know whether the selected value is from list of options or some constant value
    8.setValue -> get value of selected option or constant value entered
    9. constType-> shows the type of constant i.e. text,number etc.
  }
  */

function SelectWithInput(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [selectedValue, setSelectedValue] = useState(null); //-->selectedValue
  const [options, setOptions] = useState([]);
  const [isConstantAdded, setIsConstantAdded] = useState(false);
  const [constantValue, setConstantValue] = useState("");
  let constantOption = props.constantOptionStatement
    ? t(props.constantOptionStatement)
    : t(CONSTANT);

  //const [constantType, setConstantType] = useState(null); // State that stores the variable type of the constant selected.

  useEffect(() => {
    if (
      props.value ||
      (props.value && props.value === "" && props.showEmptyString)
    ) {
      if (props.isConstant) {
        setSelectedValue(
          props.optionKey
            ? { [props.optionKey]: constantOption }
            : constantOption
        );
        setIsConstantAdded(true);
        setConstantValue(props.value);
      } else {
        setIsConstantAdded(false);
        setConstantValue("");
        if (props.value && props.value === "") {
          setSelectedValue(props.optionKey ? { [props.optionKey]: "" } : "");
        } else {
          setSelectedValue(props.value);
        }
      }
    } else {
      setSelectedValue(null);
      setConstantValue("");
      if (props.isConstant) {
        setIsConstantAdded(true);
      } else {
        setIsConstantAdded(false);
      }
    }
  }, [props.value]);

  useEffect(() => {
    let localDropdownArr = props.dropdownOptions
      ? [...props.dropdownOptions]
      : [];

    if (props.showEmptyString) {
      //add empty string option to options list if props.showEmptyString is true
      localDropdownArr.splice(
        0,
        0,
        props.optionKey ? { [props.optionKey]: "" } : ""
      );
      if (props.showConstValue) {
        localDropdownArr.splice(
          1,
          0,
          props.optionKey
            ? { [props.optionKey]: constantOption }
            : constantOption
        );
      }
    } else if (props.showConstValue) {
      //add constant option to options list if props.showConstValue is true
      localDropdownArr.splice(
        0,
        0,
        props.optionKey ? { [props.optionKey]: constantOption } : constantOption
      );
    }
    setOptions(localDropdownArr);
  }, [props.dropdownOptions]);


  // Function that runs when the constType prop changes.
 /*  useEffect(() => {
    if (props.constType !== "") {
      let type = "";
      switch (props.constType) {
        case "10":
          type = "text";
          break;
        case "3":
        case "4":
        case "6":
          type = "number";
          break;
        case "8":
          type = "date";
          break;
        default:
          type = "text";
          break;
      }
      setConstantType(type);
    }
  }, [props.constType]); */

  const Select = () => {
    return (
      <Autocomplete
        value={isConstantAdded ? "" : selectedValue}
        onChange={(e, newValue) => {
          if (newValue && newValue.inputValue && props.showConstValue) {
            // Create a new value from the user input
            setConstantValue(newValue.inputValue);
            setIsConstantAdded(true);
            setSelectedValue(
              props.optionKey
                ? {
                    [props.optionKey]: constantOption,
                  }
                : constantOption
            );
          } else {
            if (
              (props.optionKey ? newValue[props.optionKey] : newValue) ===
                constantOption &&
              props.showConstValue
            ) {
              setIsConstantAdded(true);
              setConstantValue("");
            } else {
              setIsConstantAdded(false);
              setSelectedValue(newValue);
              setConstantValue("");
            }
          }
        }}
        filterOptions={(filterOptions, params) => {
          const filtered = filter(filterOptions, params);
          // Suggest the creation of a new value
          if (params.inputValue.trim() !== "" && props.showConstValue) {
            filtered.push(
              props.optionKey
                ? {
                    inputValue: params.inputValue,
                    [props.optionKey]: params.inputValue,
                  }
                : {
                    inputValue: params.inputValue,
                    title: params.inputValue,
                  }
            );
          }

          return filtered;
        }}
        className={
          props.selectWithInput ? props.selectWithInput : styles.selectWithInput
        }
        id={props.id}
        disabled={props.disabled}
        options={options}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            //unused
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue && props.showConstValue) {
            return option.inputValue;
          }

          if (
            (props.optionKey ? option[props.optionKey] : option) ===
              constantOption &&
            props.showConstValue
          ) {
            return "";
          }
          // Regular option
          return props.optionKey ? option[props.optionKey] : option;
        }}
        disableClearable
        renderOption={(option) => {
          return (
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.selectWithInputOptions
                  : styles.selectWithInputOptions
              }
            >
              {option.inputValue && props.showConstValue ? (
                <div className={styles.AddToConst}>
                  <p>{option.inputValue}</p>
                  <p>
                    {props.constantStatement
                      ? t("addAs") + " " + t(props.constantStatement)
                      : t("addAsConstant")}
                  </p>
                </div>
              ) : props.optionKey ? (
                <span
                  style={
                    option[props.optionKey] === constantOption
                      ? { ...props.optionStyles }
                      : {}
                  }
                >
                  {option[props.optionKey]}
                </span>
              ) : (
                <span
                  style={
                    option === constantOption ? { ...props.optionStyles } : {}
                  }
                >
                  {option}
                </span>
              )}
            </div>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            className={
              direction === RTL_DIRECTION
                ? props.inputClass
                  ? `${props.inputClass} selectWithInputTextField_arabic`
                  : `${styles.selectWithInputTextField} selectWithInputTextField_arabic`
                : props.inputClass
                ? `${props.inputClass} selectWithInputTextField`
                : `${styles.selectWithInputTextField} selectWithInputTextField`
            }
            variant="outlined"
           // type={constantType}
          />
        )}
      />
    );
  };

  useEffect(() => {
    if (isConstantAdded && props.showConstValue) {
      if (constantValue !== props.value) {
        //set focus on the constant input field
        document
          .getElementById(`input_with_select_${props.id ? props.id : null}`)
          .focus();
        //if value is constant, then set constant value to props.setValue and true to props.setIsConstant
        props.setValue(constantValue);
        props.setIsConstant && props.setIsConstant(true);
      }
    } else {
      //if value is not constant, then set selected option value to props.setValue and false to props.setIsConstant
      if (
        selectedValue !== props.value &&
        selectedValue !== constantOption &&
        selectedValue
      ) {
        props.setValue(selectedValue);
        props.setIsConstant && props.setIsConstant(false);
      }
    }
  }, [isConstantAdded, selectedValue, constantValue]);

  return (
    <div id="selectWithInput_TF" style={{ width: props.width || null }}>
      {(props.showConstValue &&
        selectedValue &&
        (props.optionKey ? selectedValue[props.optionKey] : selectedValue) ===
          constantOption) ||
      isConstantAdded ? (
        //code rendered when constant value is to be entered
        <div className="relative">
          {!props.isConstantIcon && (
            <span
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.constantIcon
                  : styles.constantIcon
              }
            >
              {t(TRIGGER_CONSTANT)}
            </span>
          )}
          <input
            id={`input_with_select_${props.id ? props.id : null}`}
            autofocus
           type={props.type ? props.type : "text"}
            value={constantValue}
            className={
              direction === RTL_DIRECTION
                ? props.constantInputClass
                  ? props.constantInputClass
                  : arabicStyles.multiSelectConstInput
                : props.constantInputClass
                ? props.constantInputClass
                : styles.multiSelectConstInput
            }
            disabled={props.disabled}
            onChange={(e) => setConstantValue(e.target.value)}
          // type={constantType}
          />
          {Select()}
        </div>
      ) : (
        Select()
      )}
    </div>
  );
}

export default SelectWithInput;
