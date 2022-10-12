import React from "react";

import { Typography, TextField, Grid, Box, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Remove } from "@material-ui/icons";
import CheckboxField from "../CheckboxFields/CheckboxField";
import RadioButtonGroup from "../RadioFields/RadioButtonGroup";
import SunEditor from "../../SunEditor/SunTextEditor";
import SelectWithInput from "../../SelectWithInput";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: "5px",
  },
  inputTitle: {
    height: 27,
    backgroundColor: "white",
    fontSize: "var(--subtitle_text_font_size)",
  },
  input: {
    height: "var(--line_height)",
    backgroundColor: "white",
    fontSize: "var(--base_text_font_size)",
    "& .Mui-focused": {
      borderColor: "transparent",
      borderWidth: "0px !important",
    },
  },

  multilineInput: {
    backgroundColor: "white",
    fontSize: "var(--base_text_font_size)",
    "& focus": {
      border: "0px solid #CECECE !important",
    },
    "& .Mui-focused": {
      borderColor: "transparent",
      borderWidth: "0px !important",
    },
    //overflowY: "scroll",
  },
  label: {
    fontSize: "var(--base_text_font_size)",
    color: "#606060",
    fontWeight: 600,
  },
  labelCheckbox: {
    fontSize: "var(--base_text_font_size)",
    color: "#686868",
    opacity: 1,
    fontWeight: 450,
  },
  helperText: {
    color: "#606060",
    fontSize: "var(--sub_text_font_size)",
  },
  colorPrimary: {
    // filter: getCssFilterFromHex(`${theme.palette.primary.main}`),
    filter: `invert(29%) sepia(90%) saturate(5100%) hue-rotate(191deg) brightness(96%) contrast(101%)`,
    //backgroundColor: `${theme.palette.primary.main}`,
  },
  labelBtn: {
    border: "1px solid #c5c5c5",
    width: "23px",
    height: "16px",
    borderRadius: "2px",
  },
  labelBtnDisabled: {
    border: "1px solid #c5c5c5",
    width: "23px",
    height: "16px",
    borderRadius: "2px",
    opacity: 0.4,
  },
  required: {
    color: "#D53D3D",
  },
  paperRoot: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
}));
const Field = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.checkbox && (
        <>
          <Grid container direction="row">
            <Grid item>
              <CheckboxField
                name={props.name}
                value={props.value}
                label={props.label}
                onChange={props.onChange}
              />
            </Grid>
          </Grid>
          {props.helperText && (
            <Grid container>
              <Grid item>
                <Typography component="small" className={classes.helperText}>
                  {props.helperText}
                </Typography>
              </Grid>
            </Grid>
          )}
        </>
      )}
      {props.radio && (
        <RadioButtonGroup
          ButtonsArray={props.ButtonsArray}
          name={props.name}
          value={props.value}
          label={props.label}
          onChange={props.onChange}
          column={props.column}
        />
      )}

      {!props.checkbox && !props.radio ? (
        <>
          <Grid container alignItems="center">
            {props.icon && (
              <Grid item>
                <Typography className={classes.label}>{props.icon}</Typography>
              </Grid>
            )}

            {props.label && (
              <Grid item>
                <Typography className={classes.label}>
                  {props.label || null}
                </Typography>
              </Grid>
            )}

            {props.required && (
              <Grid item>
                <Typography className={classes.required}>*</Typography>
              </Grid>
            )}
            {props.extraLabel && (
              <Grid item>
                <Typography className={classes.label}>
                  {props.extraLabel || null}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Box>
            {props.range ? (
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <TextField
                    type="text"
                    error={props.error1}
                    helperText={props.helperText1}
                    size="small"
                    name={props.name1}
                    InputProps={{
                      className: classes.input,
                    }}
                    value={props.value1}
                    onChange={props.onChange}
                    variant="outlined"
                    FormHelperTextProps={{
                      style: { marginLeft: 0, fontSize: "10px" },
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Grid container justify="center">
                    <Remove />
                  </Grid>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    type="text"
                    error={props.error2}
                    helperText={props.helperText2}
                    size="small"
                    name={props.name2}
                    InputProps={{
                      className: classes.input,
                    }}
                    value={props.value2}
                    onChange={props.onChange}
                    variant="outlined"
                    FormHelperTextProps={{
                      style: {
                        marginLeft: 0,
                        fontSize: "10px",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            ) : props.sunEditor ? (
              <Grid container>
                <Grid item xs>
                  <SunEditor
                    id="add_description_sunEditor"
                    width={props.width || "100%"}
                    customHeight={props.height || "6rem"}
                    placeholder={props.placeholder || ""}
                    value={props.value}
                    getValue={(e) =>
                      props.onChange({
                        target: {
                          name: props.name || props.label,
                          value: e?.target?.innerText || "",
                        },
                      })
                    }
                  />
                </Grid>
              </Grid>
            ) : props.selectCombo ? (
              <Grid container>
                <Grid item xs>
                  <SelectWithInput
                    type={props.type}
                    dropdownOptions={props.dropdownOptions}
                    optionKey={props.optionKey}
                    setIsConstant={props.setIsConstant}
                    setValue={props.setValue}
                    value={props.value}
                    isConstant={props.isConstant}
                    showEmptyString={props.showEmptyString}
                    showConstValue={props.showConstValue}
                    disabled={props.disabled}
                    id={props.id}
                    inputClass={props.inputClass}
                    constantInputClass={props.constantInputClass}
                    selectWithInput={props.selectWithInput}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container>
                <Grid item xs>
                  <TextField
                    type={
                      props.secret
                        ? "password"
                        : props.type
                        ? props.type
                        : "text"
                    }
                    error={props.error}
                    helperText={props.helperText}
                    size="small"
                    multiline={props.multiline}
                    rows={4}
                    fullWidth={true}
                    name={props.name || props.label}
                    inputProps={{
                      step: props.step || null,
                      min: props.min || null,
                      max: props.max || null,
                    }}
                    InputProps={{
                      className: props.multiline
                        ? classes.multilineInput
                        : classes.input,

                      startAdornment: props.startAdornment || null,

                      endAdornment: props.endAdornment || null,
                      readOnly: props.readOnly || null,
                      spellCheck: false,
                    }}
                    value={props.value}
                    onChange={props.onChange}
                    variant="outlined"
                    FormHelperTextProps={{
                      style: {
                        marginLeft: 0,
                        fontSize: "10px",
                        fontWeight: 600,
                        color: props.error ? "#D53D3D" : "#606060",
                      },
                    }}
                    disabled={props.disabled}
                    select={props.dropdown}
                    SelectProps={{
                      MenuProps: {
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
                          elevation: 3,
                          square: true,
                          style: {
                            border: "1px solid #CCCEEE",
                            boxShadow: "0px 3px 6px #00000029",
                          },
                        },
                      },
                    }}
                    inputRef={props?.inputRef}
                    onKeyPress={props?.onKeyPress}
                  >
                    {props.options &&
                      props.options.map((option, index) => {
                        return (
                          <MenuItem
                            /* className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.triggerDropdownData
                      : styles.triggerDropdownData

                  }*/

                            value={option?.value}
                            style={{ textAlign: "center" }}
                            key={index}
                          >
                            <Typography
                              style={{ fontSize: "12px" }}
                              variant="h6"
                            >
                              {" "}
                              {option?.name}
                            </Typography>
                          </MenuItem>
                        );
                      })}
                  </TextField>
                </Grid>
                {props.btnIconAtEnd && (
                  <Grid
                    item
                    style={{
                      marginLeft: "-2px",
                      zIndex: 1,
                    }}
                    onClick={props.btnIconDefaultHandler || null}
                  >
                    {props.btnIconAtEnd}
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </>
      ) : null}
    </div>
  );
};

export default Field;
