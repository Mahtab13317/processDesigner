import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  Checkbox,
  FormControl,
  FormControlLabel,
  ClickAwayListener,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import "./AddToListDropdown.css";
import { useTranslation } from "react-i18next";

function AddToListDropdown(props) {
  let { t } = useTranslation();
  const [showInput, setshowInput] = useState(false);
  const [checked, setChecked] = useState(null);

  const clickNew = () => {
    setshowInput(true);
  };

  const handleClickAway = () => {
    if (props.handleClickAway) {
      props.handleClickAway();
    }
  };

  useEffect(() => {
    //code to set initial value in checked state for each item
    props.completeList &&
      props.completeList.forEach((item) => {
        if (props.associatedList.includes(item.id)) {
          setChecked((prev) => {
            return { ...prev, [item.id]: true };
          });
        } else {
          setChecked((prev) => {
            return { ...prev, [item.id]: false };
          });
        }
      });
  }, [props.associatedList, props.completeList]);

  const toggleCheckbox = (e, data) => {
    //function to handle toggle on the checkbox
    if (props.multiple) {
      props.completeList &&
        props.completeList.forEach((item) => {
          if (data.id === item.id) {
            setChecked((prev) => {
              return { ...prev, [item.id]: !prev[item.id] };
            });
          }
        });
      if (checked[data.id] === false) props.onChange(data.id, 0); //to add to the associated list
      if (checked[data.id] === true) props.onChange(data.id, 1); //to delete from associated list
    } else {
      props.completeList &&
        props.completeList.forEach((item) => {
          if (item.id === data.id) {
            setChecked((prev) => {
              return { ...prev, [item.id]: true };
            });
          } else {
            setChecked((prev) => {
              return { ...prev, [item.id]: false };
            });
          }
        });
      props.onChange(data);
    }
  };
  const direction = `${t("HTML_DIR")}​​​​​​​​`;

  return (
    <ClickAwayListener onClickAway={() => handleClickAway()}>
      <div
        className={
          props.dropdownClass
            ? `${props.dropdownClass} altd_dropdownDiv`
            : `altd_dropdownDiv`
        }
        style={{ ...props.style }}
      >
        <FormControl style={{ width: "100%" }}>
          <div
            className={`altd_addNewDiv`}
            style={{ borderBottom: "1px solid #C4C4C4" }}
          >
            {showInput ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}
              >
                <input
                  className={`altd_inputField`}
                  autoFocus
                  value={props.inputValue}
                  type="text"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim().length > 0) {
                      setshowInput(false);
                      props.onKeydown(e.target.value);
                    }
                  }}
                  // onKeyPress={(e)=>{
                  //   var validateBool = validateRegex(String.fromCharCode(e.which), REGEX.AlphaSpaceUs);
                  //   if (!validateBool) {
                  //     e.preventDefault();
                  //   }else{
                  //     console.log(e.target.value,"alpha");
                  //   }
                  // }}
                />
                <CloseIcon
                  style={{ width: "1.25rem", height: "1.25rem", color: "#414141" }}
                  onClick={() => setshowInput(false)}
                />
              </div>
            ) : (
              <p
                className={`altd_addNew`}
                onClick={(e) => {
                  e.stopPropagation();
                  clickNew();
                }}
                style={{ textAlign: direction === "rtl" ? "right" : "left" }}
              >
                {props.addNewLabel}
              </p>
            )}
          </div>
          <List className={`altd_list`}>
            {props.completeList && props.completeList.length > 0 ? (
              props.completeList.map((data) => (
                <ListItem key={data.id} className={`altd_listItem`}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checkedIcon={
                          <span
                            className={
                              props.checkedCheckBoxStyle
                                ? `${props.checkedCheckBoxStyle} altd_checked`
                                : `altd_checked`
                            }
                          >
                            <CheckIcon
                              className={
                                props.checkIcon
                                  ? `${props.checkIcon} altd_checkIcon`
                                  : `altd_checkIcon`
                              }
                            />
                          </span>
                        }
                        icon={
                          <span
                            className={
                              props.checkboxStyle
                                ? `${props.checkboxStyle} altd_checkboxStyle`
                                : `altd_checkboxStyle`
                            }
                          />
                        }
                        value={data[props.labelKey]}
                        checked={
                          checked && checked[data.id] === true ? true : false
                        }
                        onChange={(e) => toggleCheckbox(e, data)}
                        name="check"
                      />
                    }
                    label={
                      <div className={`altd_dropdown`}>
                        {data[props.labelKey]}
                      </div>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <p className={`altd_noData`}>{props.noDataLabel}</p>
            )}
          </List>
        </FormControl>
      </div>
    </ClickAwayListener>
  );
}

export default AddToListDropdown;
