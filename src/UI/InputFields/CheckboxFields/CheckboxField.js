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
    //height: "12px",
    //width: "12px",
    // fontSize: "12px",
  },
  label: { fontSize: "12px", color: "#000000", opacity: 1, fontWeight: 700 },
}));
const CheckboxField = (props) => {
  const { name, value, label, onChange, disabled } = props;

  const classes = useStyles();
  return (
    <Grid container>
      <Grid item>
        <FormGroup>
          <FormControlLabel
            className={classes.label}
            control={
              <Checkbox
                style={{
                  fontSize: "13px",
                  paddingRight: "5px",
                  paddingBottom: "3px",
                  paddingTop: "3px",
                }}
                checked={value}
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
                name={name}
                value={value}
                onChange={onChange}
                disableRipple
                disabled={disabled}
              />
            }
            label={
              <span style={{ fontSize: "12px", fontWeight: 600 }}>
                {label || ""}
              </span>
            }
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default CheckboxField;
