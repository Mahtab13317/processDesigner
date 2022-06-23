import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Grid, Checkbox, FormGroup, FormControlLabel } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  CheckBoxIcon: {
    color: `${theme.palette.primary.main}`,
  },
  icon: {
    // height: "16px",
    //width: "16px",
    // fontSize: "12px",
  },
  label: { fontSize: "12px", color: "#686868", opacity: 1, fontWeight: 450 },
}));
const CheckboxGroup = (props) => {
  const classes = useStyles();
  const { checkboxArray, direction = "column" } = props;

  return (
    <Grid container direction={direction} spacing={1}>
      {checkboxArray &&
        checkboxArray.map((item, index) => {
          const { name, value, onChange, label, disabled } = item;
          return (
            <Grid item key={name || index}>
              <FormGroup>
                <FormControlLabel
                  className={classes.label}
                  control={
                    <Checkbox
                      style={{
                        fontSize: "12px",
                        paddingRight: "5px",
                        paddingBottom: "3px",
                        paddingTop: "3px",
                      }}
                      icon={
                        <CheckBoxOutlineBlankIcon
                          fontSize="small"
                          className={classes.icon}
                        />
                      }
                      checkedIcon={
                        <CheckBoxIcon
                          fontSize="small"
                          className={classes.icon + " " + classes.CheckBoxIcon}
                        />
                      }
                      checked={value}
                      name={name}
                      value={value}
                      onChange={onChange}
                      disabled={disabled}
                      disableRipple
                    />
                  }
                  label={
                    <span style={{ fontSize: "12px" }}>
                      {label || name || ""}
                    </span>
                  }
                />
              </FormGroup>
            </Grid>
          );
        })}
    </Grid>
  );
};

export default CheckboxGroup;
