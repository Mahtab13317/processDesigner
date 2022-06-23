import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  label: { fontSize: "12px", color: "#111111", opacity: 1 },
}));

const RadioButtonGroup = ({
  ButtonsArray,
  name,
  value,
  label,
  onChange,
  column,
}) => {
  const classes = useStyles();
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" className={classes.label}>
        {label || ""}
      </FormLabel>
      <RadioGroup
        row={column ? false : true}
        aria-label={label || "Label"}
        name={name || "radios"}
        value={value || ""}
        onChange={onChange}
      >
        {ButtonsArray &&
          ButtonsArray.map((button) => (
            <FormControlLabel
              key={button.label}
              className={classes.label}
              value={button.value}
              control={<Radio color="primary" />}
              label={
                <span style={{ fontSize: "12px" }}>{button.label || ""}</span>
              }
            />
          ))}
      </RadioGroup>
    </FormControl>
  );
};
export default RadioButtonGroup;
