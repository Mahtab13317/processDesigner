import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import { RTL_DIRECTION } from "../../Constants/appConstants";

function ButtonDropdown(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  /*
  props-->{
    1. dropdownOptions is the array which holds options to be shown in the div
    2. onSelect = callback func
    3. optionRenderFunc is the func which is used to fetch option values from some other func -- (optional)
    4. optionKey is the key to print specific value from an option, which is of object type -- (optional)
  }
  */
  return (
    <React.Fragment>
      {props.open ? (
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.buttonDropdown
              : styles.buttonDropdown
          }
          style={props.style}
        >
          {props.dropdownOptions &&
            props.dropdownOptions.map((option, index) => {
              return (
                <p
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.buttonDropdownData
                      : styles.buttonDropdownData
                  }
                  onClick={() => props.onSelect(option)}
                  id={`${props.id}_${index}`}
                >
                  {props.optionRenderFunc
                    ? t(props.optionRenderFunc(option))
                    : props.optionKey
                    ? option[props.optionKey]
                    : option}
                </p>
              );
            })}
        </div>
      ) : null}
    </React.Fragment>
  );
}

export default ButtonDropdown;
