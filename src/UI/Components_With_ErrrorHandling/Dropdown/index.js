import React, { useState, useEffect } from "react";
import Select from "@material-ui/core/Select";
import styles from "./index.module.css";
import clsx from "clsx";

function CustomizedDropdown(props) {
  const {
    id,
    disabled,
    className,
    value,
    onChange,
    children,
    validationBoolean,
    showAllErrorsSetterFunc,
    isNotMandatory,
  } = props;
  const [showError, setShowError] = useState(false); // Boolean to show error statement.

  const menuProps = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    style: {
      maxHeight: 400,
    },
    getContentAnchorEl: null,
  };

  // Function that runs when the validationBoolean prop changes.
  useEffect(() => {
    if (validationBoolean && !isNotMandatory) {
      isValueEmpty(value);
    } else {
      setShowError(false);
    }
  }, [validationBoolean]);

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
  const onChangeHandler = (event) => {
    onChange(event);
    isValueEmpty(event.target.value);
  };

  return (
    <div>
      <Select
        id={id}
        disabled={disabled}
        className={clsx(
          className,
          styles.height,
          showError && styles.showRedBorder
        )}
        MenuProps={menuProps}
        value={value}
        onChange={(event) => onChangeHandler(event)}
        onClose={(event) => onCloseHandler(event)}
      >
        {children}
      </Select>
    </div>
  );
}

export default CustomizedDropdown;
