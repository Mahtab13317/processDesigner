import React from "react";

import { Typography, TextField, Grid, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Remove } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import Field from "../TextField/Field";
import { useSelector } from "react-redux";
import { getVariablesBasedOnTypes } from "./../../../utility/CommonFunctionCall/CommonFunctionCall";
import {
  TRIGGER_PRIORITY_LOW,
  TRIGGER_PRIORITY_MEDIUM,
  TRIGGER_PRIORITY_HIGH,
} from "./../../../Constants/triggerConstants";

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
    height: 28,
    backgroundColor: "white",
    fontSize: "var(--base_text_font_size)",
  },

  multilineInput: {
    backgroundColor: "white",
    fontSize: "var(--base_text_font_size)",
    overflowY: "scroll",
  },
  label: {
    fontSize: "var(--base_text_font_size)",
    color: "#606060",
    fontWeight: 600,
  },
  labelAfter: {
    fontSize: "var(--base_text_font_size)",
    color: "#000000",
    fontWeight: 500,
  },

  helperText: {
    color: "#606060",
    fontSize: "var(--sub_text_font_size)",
  },

  required: {
    color: "#D53D3D",
  },
}));
const TurnAroundTime = ({
  selectCombo = false,
  days = 0,
  hours = 0,
  minutes = 0,
  calendarType = "",
  isDaysConstant = false,
  isHoursConstant = false,
  isMinutesConstant = false,
  label = "",
  required = false,
  handleChange = () => console.log("pls provide handleChange fn"),
  calendarTypeLabel = "",
  //error=false,
  //helperText=""
  inputClass,
  constantInputClass,
  selectWithInput,
}) => {
  const classes = useStyles();
  const dropdownOptions = getVariablesBasedOnTypes({ types: [3, 4] });
  let { t } = useTranslation();

  const isDrawerExpanded = useSelector(
    (state) => state.isDrawerExpanded.isDrawerExpanded
  );

  const direction = `${t("HTML_DIR")}`;
  return (
    <Grid container direction="column" spacing={isDrawerExpanded ? 1 : 2}>
      {label && (
        <Grid item>
          <Typography className={classes.label}>
            {label} {required && <span className={classes.required}>*</span>}
          </Typography>
        </Grid>
      )}

      {/*required && (
        <Grid item>
          <Typography className={classes.required}>*</Typography>
        </Grid>
      )*/}
      {selectCombo ? (
        <Grid item xs>
          <Grid
            container
            // direction={direction === "ltr" ? "row" : "row-reverse"}
            spacing={1}
            direction={isDrawerExpanded ? "row" : "column"}
            /* alignItems={
              isDrawerExpanded && calendarTypeLabel
                ? "flex-end"
                : !isDrawerExpanded
                ? "flex-start"
                : "center"
            }*/
            justifyContent={!isDrawerExpanded ? "flex-start" : null}
            alignItems={
              isDrawerExpanded && calendarTypeLabel
                ? "flex-end"
                : !isDrawerExpanded
                ? "flex-start"
                : "center"
            }
          >
            <Grid item xs={isDrawerExpanded ? 3 : 10}>
              <Grid container spacing={1} alignItems="flex-start">
                <Grid item xs>
                  <Field
                    selectCombo={true}
                    dropdownOptions={dropdownOptions || []}
                    optionKey="VariableName"
                    setIsConstant={(val) => {
                      handleChange("isDaysConstant", val);
                    }}
                    setValue={(val) => {
                      handleChange("days", val);
                    }}
                    value={days}
                    isConstant={isDaysConstant}
                    showEmptyString={false}
                    showConstValue={true}
                    // disabled={readOnlyProcess}
                    id="days_select_input"
                    inputClass={inputClass}
                    constantInputClass={constantInputClass}
                    selectWithInput={selectWithInput}
                  />
                </Grid>
                <Grid item>
                  <Typography className={classes.labelAfter}>
                    {t("days")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={isDrawerExpanded ? 3 : 10}>
              <Grid container spacing={1} alignItems="flex-start">
                <Grid item xs>
                  <Field
                    selectCombo={true}
                    dropdownOptions={dropdownOptions || []}
                    optionKey="VariableName"
                    setIsConstant={(val) => {
                      handleChange("isHoursConstant", val);
                    }}
                    setValue={(val) => {
                      handleChange("hours", val);
                    }}
                    value={hours}
                    isConstant={isHoursConstant}
                    showEmptyString={false}
                    showConstValue={true}
                    // disabled={readOnlyProcess}
                    id="hours_select_input"
                    inputClass={inputClass}
                    constantInputClass={constantInputClass}
                    selectWithInput={selectWithInput}
                  />
                </Grid>
                <Grid item>
                  <Typography className={classes.labelAfter}>
                    {t("hours")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={isDrawerExpanded ? 3 : 10}>
              <Grid container spacing={1} alignItems="flex-start">
                <Grid item xs>
                  <Field
                    selectCombo={true}
                    dropdownOptions={dropdownOptions || []}
                    optionKey="VariableName"
                    setIsConstant={(val) => {
                      handleChange("isMinutesConstant", val);
                    }}
                    setValue={(val) => {
                      handleChange("minutes", val);
                    }}
                    value={minutes}
                    isConstant={isMinutesConstant}
                    showEmptyString={false}
                    showConstValue={true}
                    // disabled={readOnlyProcess}
                    id="minutes_select_input"
                    inputClass={inputClass}
                    constantInputClass={constantInputClass}
                    selectWithInput={selectWithInput}
                  />
                </Grid>
                <Grid item>
                  <Typography className={classes.labelAfter}>
                    {t("minutes")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={isDrawerExpanded ? 2 : 8}>
              <Grid container spacing={1} alignItems="flex-start">
                <Grid item xs>
                  {/* <Field
                    selectCombo={true}
                    //dropdownOptions={priority}
                    dropdownOptions={[
                      { name: "Working Days", value: "Y" },
                      { name: "Calender", value: "N" },
                    ]}
                    label={calendarTypeLabel}
                    setValue={(val) => {
                      handleChange({
                        target: { name: "CalendarType", value: val },
                      });
                    }}
                    value={calendarType}
                    // isConstant={isMinutesConstant}
                    //showEmptyString={false}
                    // showConstValue={true}
                    // disabled={readOnlyProcess}
                    id="calendar_type_select_input"
                  />*/}
                  <Field
                    dropdown={true}
                    label={calendarTypeLabel}
                    name="CalendarType"
                    value={calendarType}
                    onChange={(e) => {
                      handleChange("calendarType", e.target.value);
                    }}
                    options={[
                      { name: "Working Days", value: "Y" },
                      { name: "Calender", value: "N" },
                    ]}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid item xs>
          <Grid
            container
            // direction={direction === "ltr" ? "row" : "row-reverse"}
            spacing={1}
            //  direction={isDrawerExpanded ? "row" : "column"}
            alignItems={
              isDrawerExpanded && calendarTypeLabel ? "flex-end" : null
            }
          >
            <Grid item xs={isDrawerExpanded ? 3 : 4}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs>
                  <Field
                    type="number"
                    name="Days"
                    value={days}
                    step={1}
                    min={0}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item>
                  <Typography className={classes.labelAfter}>
                    {t("days")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={isDrawerExpanded ? 3 : 4}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs>
                  <Field
                    type="number"
                    name="Hours"
                    step={1}
                    min={0}
                    max={23}
                    value={hours}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item>
                  <Typography className={classes.labelAfter}>
                    {t("hours")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={isDrawerExpanded ? 3 : 4}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs>
                  <Field
                    type="number"
                    name="Minutes"
                    step={1}
                    min={0}
                    max={59}
                    value={minutes}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item>
                  <Typography className={classes.labelAfter}>
                    {t("minutes")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={isDrawerExpanded ? 3 : 5}>
              <Grid container spacing={1}>
                <Grid item xs>
                  <Field
                    dropdown={true}
                    label={calendarTypeLabel}
                    name="CalendarType"
                    value={calendarType}
                    onChange={handleChange}
                    options={[
                      { name: "Working Days", value: "Y" },
                      { name: "Calender", value: "N" },
                    ]}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default TurnAroundTime;
