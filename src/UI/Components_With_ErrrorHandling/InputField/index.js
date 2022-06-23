import React, { useEffect, useState } from "react";
import {
  ERROR_INCORRECT_FORMAT,
  ERROR_MANDATORY,
  ERROR_RANGE,
} from "../../../Constants/appConstants";
import { validateRegex } from "../../../validators/validator";
import styles from "./index.module.css";

function TextInput(props) {
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    validateFunc(props.inputValue);
  }, [props.inputValue, props.errorStatement]);

  useEffect(() => {
    if (showMsg) {
      document.querySelector(`#${props.idTag}`).classList.add("fieldWithError");
    } else {
      document
        .querySelector(`#${props.idTag}`)
        .classList.remove("fieldWithError");
    }
  }, [showMsg]);

  const validateFunc = (inputVal) => {
    let showError = false;
    switch (props.errorType) {
      case ERROR_MANDATORY:
        showError =
          inputVal?.trim() === "" ||
          inputVal === undefined ||
          inputVal === null;
        break;
      case ERROR_RANGE:
        showError =
          inputVal &&
          (inputVal < props.rangeVal?.start || inputVal > props.rangeVal?.end);
        break;
      case ERROR_INCORRECT_FORMAT:
        showError = inputVal && !validateRegex(inputVal, props.regexStr);
        break;
      default:
        break;
    }
    setShowMsg(showError);
  };

  return (
    <div>
      <input
        disabled={props.readOnlyCondition}
        value={props.inputValue}
        id={props.idTag}
        onBlur={props.onBlurEvent}
        onChange={props.onChangeEvent}
        name={props.name}
        className={`${props.classTag} ${
          showMsg
            ? props.errorSeverity === "error"
              ? styles.errorInput
              : null
            : null
        }`}
        style={showMsg && props.inlineError ? { marginBottom: "0" } : {}}
        type={props.type}
      />
      {props.inlineError && showMsg ? (
        <p
          className={
            props.errorSeverity === "error" ? styles.errorStatement : null
          }
        >
          {props.errorStatement}
        </p>
      ) : null}
    </div>
  );
}

export default TextInput;
