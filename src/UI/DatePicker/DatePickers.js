import React, { useState } from "react";
import PropTypes from "prop-types";
// import stylesheet from "component/Form/style.module.css";
import { FormHelperText, InputLabel, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "react-datetime/css/react-datetime.css";
import { useSelector } from "react-redux";
import Datetime from "react-datetime";
import moment from "moment";

import "moment/locale/ar";
import "moment/locale/ar-sa";
import "moment/locale/de";
import "moment/locale/es";
import "moment/locale/es-do";
import "moment/locale/fr-ca";
import "moment/locale/nl";
import "moment/locale/pt";
import "moment/locale/th";
import "moment/locale/vi";
import "moment/locale/zh-cn";
import "moment/locale/zh-hk";
import "moment/locale/zh-tw";

const useStyle = makeStyles((theme) => {
  return {
    container1: {
      display: "flex",
      flexDirection: "column",
      alignItems: (props) => (props.direction == "ltr" ? "start" : "end"),
      direction: (props) => props.direction,
      justifyContent: (props) =>
        props.direction == "ltr" ? "flex-start" : "flex-end",
    },
    inputDate: {
      "& input": {
        borderRadius: "2px",
        height: "27px",
        border: `1px solid ${theme.palette.borderColor}`,
        fontSize: "11px",
        paddingLeft: "5px",

        "&::placeholder": {
          fontSize: "11px",
        },
      },
      "& .input_calender": {
        position: "relative",

        cursor: (props) => (props.disabled ? "default" : "pointer"),
        "& .wrapper_image": {
          position: "absolute",
          right: (props) => (props.direction === "ltr" ? "4px" : "none"),
          left: (props) => (props.direction === "ltr" ? "none" : "4px"),
          height: "16px",
          top: "50%",
          transform: "translateY(-50%)",
        },
      },
      "& .rdtPicker": {
        top: (props) =>
          props.align === "top"
            ? "-255px"
            : props.align === "left"
            ? "-50%"
            : "28px",
        left: (props) => (props.align === "top" ? "-50%" : 0),
        padding: 0,
        border: "none",

        "& table": {
          direction: (props) => props.direction,
          border: "1px solid black",
          background: "white"
        },
      },
    },
    container: {
      direction: (props) => props.direction,
      display: "flex",
      alignItems: "center",
    },
    input_label_root: { display: "contents" },
    input_label: (props) => {
      return {
        ...theme.typography.input_label,
        minWidth: props.labelMinWidth,
        maxWidth: props.labelMaxWidth,
        textAlign: props.direction == "ltr" ? "left" : "right",
      };
    },
  };
});

const renderInput = (
  props,
  openCalendar,
  onFocusCallback,
  isClear,
  setIsClear,
  calenderRequired,
  readOnly,
  disabled
) => {
  if (isClear) {
    (() => {
      props.onChange({ target: { value: "" } });
      setIsClear(false);
      return;
    })();
  }

  return (
    <div className={"input_calender"}>
      <input
        {...props}
        id="inputDateEle"
        readOnly={readOnly}
        onFocus={onFocusCallback}
        onClick={(e) => {
          if (calenderRequired) {
            openCalendar(e);
          }
        }}
      />
      {calenderRequired && (
        <div
          onClick={(e) => {
            if (!disabled) openCalendar(e);
          }}
          className="wrapper_image"
        >
          <img
            src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/calender.svg`}
            alt="calender icon"
          />
        </div>
      )}
    </div>
  );
};

const renderCalenderView = (mode, renderDefault, relative) => {
  return (
    <div
      className="wrapper"
      style={{
        // background: "#fff",
        boxShadow: "0 1px 3px rgb(0 0 0 / 10%)",
        // border: "1px solid #f9f9f9",
        position: relative ? "relative" : "fixed",
        width: "31.25rem",
        fontFamily: "Open Sans",
        fontSize: "0.8rem",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ width: "50%" }}>{renderDefault()}</div>
      {/* <div style={{width: "50%"}}>{renderDefault()}</div> */}
    </div>
  );
};

export const DatePickers = (props) => {
  const globalSettings = useSelector((store) => store.globalSettings);
  const [isClear, setIsClear] = useState(false);
  const [clearHappening, setClearHappening] = useState(false);

  const {
    label = null,
    helperText = null,
    value = "",
    onChange = null,
    name = "input_box",
    labelMinWidth = "95px",
    labelMaxWidth = "95px",
    disabled = false,
    align = "bottom",
    relative = false,
    form = true,
    required = false,
    dateFormat = "DD/MM/YYYY",
    placeholder = "DD/MM/YYYY",
    timeFormat = "h:mm A", // to disable time just pass 'false' boolean
    className = "",
    disableBefore = "",
    disableAfter = "",
    onFocusCallback = null,
    direction = "ltr",
    calenderRequired = true,
    readOnly = true,
    ...rest
  } = props;

  const classes = useStyle({
    labelMinWidth,
    labelMaxWidth,
    align,
    direction,
    disabled,
    form,
  });

  let inputProps = {
    id: name,
    name: name,
    disabled: disabled,
    required: required,
    placeholder: placeholder,
    className: className,
    autoComplete: "off",
  };

  const lastDay = moment(disableBefore);
  const futureDay = moment(disableAfter);

  const valid = (current) => {
    if (disableBefore !== "" && disableAfter !== "")
      return current.isBetween(lastDay, futureDay);
    else if (disableAfter !== "") return current.isBefore(futureDay);
    else if (disableBefore !== "") return current.isAfter(lastDay);
    else return true;
  };

  const clearDate = () => {
    setIsClear(true);
    setClearHappening(true);
  };

  const onChangeHandler = (val) => {
    if (!clearHappening) {
      if (timeFormat && dateFormat)
        onChange(
          {
            target: {
              name: name,
              value: moment(val._d).format(`YYYY-MM-DD ${timeFormat}`),
            },
          },
          clearDate
        );
      else if (timeFormat)
        onChange(
          { target: { name: name, value: moment(val._d).format(timeFormat) } },
          clearDate
        );
      else
        onChange(
          {
            target: { name: name, value: val._d },
          },
          clearDate
        );
    } else setClearHappening(false);
  };

  return (
    <div
      className={!form ? classes.container : classes.container1}
      id="dateInputWrapper"
    >
      {label != null && (
        <InputLabel
          shrink
          htmlFor={name}
          // className={stylesheet.labeltype}
          classes={{ root: classes.input_label_root }}
        >
          <Typography
            noWrap={true}
            variant="div"
            className={classes.input_label}
          >
            {" "}
            {label}
            {required && <span className={classes.required_field}>*</span>}
          </Typography>
        </InputLabel>
      )}
      <div style={{ display: "flex", flexDirection: "row", zIndex: 9999 }}>
        <Datetime
          dateFormat={dateFormat}
          timeFormat={timeFormat}
          inputProps={inputProps}
          className={classes.inputDate}
          renderInput={(props, openCalendar) =>
            renderInput(
              props,
              openCalendar,
              onFocusCallback,
              isClear,
              setIsClear,
              calenderRequired,
              readOnly,
              disabled
            )
          }
          closeOnClickOutside={false}
          closeOnSelect={true}
          initialValue={
            value != ""
              ? timeFormat
                ? moment(value, `YYYY-MM-DD ${timeFormat}`).format(
                    `${dateFormat} ${timeFormat}`
                  )
                : moment(value, "YYYY-MM-DD").format(dateFormat)
              : ""
          }
          locale={localStorage.getItem("i18nextLng")}
          isValidDate={valid}
          onChange={(val) => onChangeHandler(val)}
          renderView={(mode, renderDefault) =>
            renderCalenderView(mode, renderDefault, relative)
          }
          {...rest}
          input={false}
          open={true}
        />

        {helperText != null && form && (
          <FormHelperText id="my-helper-text" className={classes.helper_text}>
            {helperText}
          </FormHelperText>
        )}
      </div>
    </div>
  );
};

DatePickers.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  helperText: PropTypes.string,
  labelMinWidth: PropTypes.string,
  labelMaxWidth: PropTypes.string,
  disabled: PropTypes.bool,
  align: PropTypes.string, // bottom || top || left
  form: PropTypes.bool,
  dateFormat: PropTypes.string, // "DD/MM/YYYY" || false
  timeFormat: PropTypes.string || PropTypes.bool, // "h:mm A" || false
  className: PropTypes.string,
  direction: PropTypes.string,
  disableBefore: PropTypes.string,
  disableAfter: PropTypes.string,
  onFocusCallback: PropTypes.func,
  calenderRequired: PropTypes.bool,
  readOnly: PropTypes.bool,
  relative: PropTypes.bool,
};
