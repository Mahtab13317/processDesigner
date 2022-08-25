import React, { useState, useEffect } from "react";
import Select from "@material-ui/core/Select";
import styles from "./index.module.css";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { CONSTANT } from "../../../Constants/appConstants";
import { MenuItem } from "@material-ui/core";
import { TRIGGER_CONSTANT } from "../../../Constants/triggerConstants";
import "./index.css";
// import moment from "moment";

function CustomizedDropdown(props) {
  const {
    id,
    disabled,
    className,
    value,
    onOpen,
    onChange,
    children,
    validationBoolean,
    showAllErrorsSetterFunc,
    isNotMandatory,
    isConstant,
    showConstValue,
    setIsConstant,
    menuItemStyles,
    constType,
    name,
  } = props;
  let { t } = useTranslation();
  const [showError, setShowError] = useState(false); // Boolean to show error statement.
  const [constVal, setConstVal] = useState("");
  const [selectedValue, setSelectedValue] = useState(null); // State that stores the selected value.
  const [constantType, setConstantType] = useState(null); // State that stores the variable type of the constant selected.

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
    PaperProps: {
      style: {
        maxHeight: props.maxHeight ? props.maxHeight : "15rem",
      },
    },
  };

  // Function that runs when the constType prop changes.
  useEffect(() => {
    if (constType !== "") {
      let type = "";
      switch (constType) {
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
  }, [constType]);

  // Function that runs when the validationBoolean prop changes.
  useEffect(() => {
    if (validationBoolean && !isNotMandatory) {
      isValueEmpty(value);
    } else {
      setShowError(false);
    }
  }, [validationBoolean]);

  useEffect(() => {
    if (isConstant) {
      setSelectedValue(CONSTANT);
      setConstVal(value);
    } else {
      setSelectedValue(value);
      setConstVal("");
    }
  }, [value]);

  // Function that runs when the showError state changes.
  useEffect(() => {
    if (showError && !isNotMandatory) {
      showAllErrorsSetterFunc &&
        showAllErrorsSetterFunc((prevState) => {
          return prevState || true;
        });
    } else {
      showAllErrorsSetterFunc &&
        showAllErrorsSetterFunc((prevState) => {
          return prevState;
        });
    }
  }, [showError]);

  // Function to check if the dropdown value is empty or not.
  const isValueEmpty = (valueSelected) => {
    if (!valueSelected && !isNotMandatory) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  };

  // Function that runs when the user closes the list of dropdown options by clicking away from the dropdown.
  const onCloseHandler = (event) => {
    if (!value && !isNotMandatory) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  };

  // Function that runs when the user changes the selected value in a dropdown.
  const onChangeHandler = (event, type) => {
    if (showConstValue) {
      if (type === "C") {
        if (constType === "6") {
          setConstVal(event.target.value);
        } else {
          // console.log("333", "VALUE DOT", event.target.value.includes("."));
          // if (!event.target.value.includes(".")) {
          // console.log(
          //   "999",
          //   "DATE",
          //   !Number.isNaN(Date.parse(event.target.value))
          // );
          // if (!Number.isNaN(Date.parse(event.target.value))) {
          //   let convertedDate = "";
          //   convertedDate = moment(event.target.value).format("DD-MM-YYYY");
          //   console.log("999", "DATE", convertedDate);
          //   setConstVal(convertedDate);
          // } else {
          //   setConstVal(event.target.value);
          // }
          setConstVal(event.target.value);
        }
        onChange(event, true);
        setIsConstant(true);
      } else {
        onChange(event, false);
        setIsConstant(false);
        setSelectedValue(event.target.value);
      }
    } else {
      onChange(event);
      setSelectedValue(event.target.value);
    }
    isValueEmpty(event.target.value);
  };

  return (
    <div>
      {showConstValue && selectedValue === CONSTANT && (
        <div className="relative" id="dropdownErrorId">
          <span className={styles.constantIcon}>{t(TRIGGER_CONSTANT)}</span>
          <input
            id={`input_with_${id ? id : null}`}
            className={styles.selectConstInput}
            type={constantType}
            value={constVal}
            onChange={(e) => onChangeHandler(e, "C")}
          />
        </div>
      )}
      <Select
        id={id}
        name={name}
        disabled={disabled}
        className={clsx(
          className,
          styles.height,
          showError && styles.showRedBorder
        )}
        style={{ ...props.style }}
        onOpen={onOpen}
        MenuProps={menuProps}
        value={selectedValue === CONSTANT ? "" : selectedValue}
        onChange={(event) => onChangeHandler(event, "S")}
        onClose={(event) => onCloseHandler(event)}
      >
        {showConstValue && (
          <MenuItem
            className={menuItemStyles ? menuItemStyles : styles.menuItemStyles}
            key={CONSTANT}
            value={CONSTANT}
          >
            {t(CONSTANT)}
          </MenuItem>
        )}
        {children}
      </Select>
    </div>
  );
}

export default CustomizedDropdown;
