import React, { useEffect, useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { Select, MenuItem } from "@material-ui/core";
import { makeStyles, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PickListModal from "../../../../UI/Modal/Modal";
import AddPickList from "./AddPickList";

const useStyles = makeStyles((theme) => ({
  select: {
    width: "282px",
    height: "28px",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    font: "normal normal normal 12px/17px Open Sans",
    border: "1px solid #C4C4C4",
    borderRadius: "2px",
    opacity: "1",
    marginRight: "10px",
  },
  dropdownData: {
    height: "17px",
    textAlign: "left",
    font: "normal normal normal 12px/17px Open Sans",
    letterSpacing: "0px",
    color: "#000000",
    opacity: "1",
    marginTop: "8px",
    paddingLeft: "10px !important",
    marginLeft: "0px",
  },
}));
export default function RadioButtonsGroup(props) {
  const classes = useStyles({});
  const [toDoType, setToDoType] = useState('M');
  const [selectedTrigger, setSelectedTrigger] = useState("defaultValue");
  const onSelect = (e) => {
    setSelectedTrigger(e.target.value);
    props.selectedTrigger(e.target.value);
  };

  const handleChange = (event) => {
    props.toDoType(event.target.value);
    setToDoType(event.target.value);
  };

  useEffect(() => {
    if (props.toDoTypeToModify) {
      setToDoType(props.toDoTypeToModify);
    }

    if (props.toDoToModifyTrigger) {
      setSelectedTrigger(props.toDoToModifyTrigger);
    }
  }, [props.toDoTypeToModify, props.toDoToModifyTrigger]);

  useEffect(() => {
    if (props.todoName == "") {
      setToDoType();
      setSelectedTrigger("defaultValue");
      props.setTodoName(null);
    }
  }, [props.todoName]);

  return (
    <FormControl component="fieldset">
      <RadioGroup
        defaultValue="M"
        onChange={handleChange}
        row={true}
        name="row-radio-buttons-group"
      >
        <FormControlLabel
          value="M"
          control={<Radio checked={toDoType == "M" ? true : false} />}
          label="Mark"
        />
        <div>
          <FormControlLabel
            value="P"
            control={<Radio checked={toDoType == "P" ? true : false} />}
            label="PickList"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FormControlLabel
            disabled={
              props.triggerList && props.triggerList.length > 0 ? false : true
            }
            value="T"
            control={<Radio checked={toDoType == "T" ? true : false} />}
            label="Trigger"
          />
        </div>
      </RadioGroup>

      {toDoType == "P" ? <AddPickList addPickList={props.addPickList} /> : null}

      {toDoType == "T" ? (
        <Select
          className={classes.select}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
          value={selectedTrigger}
          onChange={onSelect}
        >
          <MenuItem className={classes.dropdownData} value="defaultValue">
            {"<None>"}
          </MenuItem>
          {props.triggerList &&
            props.triggerList.map((x) => {
              return (
                <MenuItem
                  className={classes.dropdownData}
                  key={x.TriggerName}
                  value={x.TriggerName}
                >
                  {x.TriggerName}
                </MenuItem>
              );
            })}
        </Select>
      ) : null}
    </FormControl>
  );
}
