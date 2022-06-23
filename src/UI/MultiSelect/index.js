import React, { useState, useEffect } from "react";
import {
  ListItem,
  Checkbox,
  FormControlLabel,
  Chip,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import { DEFAULT, RTL_DIRECTION } from "../../Constants/appConstants";
import "./index.css";

function MultiSelect(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [checked, setChecked] = useState(null);
  const [selectedFields, setSelectedFields] = useState([DEFAULT]);
  const [allChecked, setAllChecked] = useState(false);

  /*
  Here, 
  state=>{
    1.checked state is used to maintain the record of checked and unchecked fields in select options list.
    2.SelectedFields state is used to show the checked options, which have to be shown as chips.
  }
  props=>{
    1.completeList is the array of options in select optionList.
    2.associatedList is the array of default selectedFields.
    3.placeholder for select field like Select Variable, Choose Variable, etc.
    4.labelKey -> key which is used to display option from completeList array
    5.indexKey -> key which is used as id
    6.handleAssociatedList is the func to pass new selectedField array to the parent component
    7.noDataLabel -> string to show when no options available -- (optional)
  }
  */

  useEffect(() => {
    //code to set initial value in checked state for each item
    let tempCheck = {},
      isAllChecked = true;
    props.completeList?.forEach((item) => {
      if (props.associatedList.includes(item)) {
        tempCheck = { ...tempCheck, [item[props.indexKey]]: true };
      } else {
        tempCheck = { ...tempCheck, [item[props.indexKey]]: false };
        isAllChecked = false;
      }
    });
    setChecked(tempCheck);
    if (props.associatedList?.length > 0) {
      setSelectedFields(props.associatedList);
      setAllChecked(isAllChecked);
    } else {
      setAllChecked(false);
    }
  }, [props.completeList, props.associatedList]);

  const handleChange = (data, type) => {
    if (type === 0) {
      //type 0 is to add new fields to selected field list
      setSelectedFields((prev) => {
        let newArr = [...prev];
        if (newArr.includes(DEFAULT)) {
          newArr.pop();
        }
        if (!newArr.includes(data)) {
          newArr.push(data);
        }
        props.handleAssociatedList(newArr);
        return newArr;
      });
    } else if (type === 1) {
      //type 1 is to delete some fields from selected field list
      setSelectedFields((prev) => {
        let newArr = [...prev];
        let indexVal = newArr.indexOf(data);
        newArr.splice(indexVal, 1);
        props.handleAssociatedList(newArr);
        if (newArr.length <= 0) {
          newArr.push(DEFAULT);
        }
        return newArr;
      });
    }
  };

  const handleAllChange = (checkedVal) => {
    if (checkedVal) {
      setSelectedFields(() => {
        let newArr = [];
        props.completeList?.forEach((item) => {
          newArr.push(item);
        });
        props.handleAssociatedList(newArr);
        return newArr;
      });
    } else {
      setSelectedFields(() => {
        let newArr = [];
        newArr.push(DEFAULT);
        props.handleAssociatedList(newArr);
        return newArr;
      });
    }
  };

  const toggleCheckbox = (data, dataValue) => {
    //function to handle toggle on the checkbox
    props.completeList?.forEach((item) => {
      if (item[props.indexKey] === data) {
        setChecked((prev) => {
          return {
            ...prev,
            [item[props.indexKey]]: !prev[item[props.indexKey]],
          };
        });
      }
    });
    if (checked[data] === false) handleChange(dataValue, 0); //to add to list
    if (checked[data] === true) handleChange(dataValue, 1); //to delete from list
  };

  const toggleSelectAllCheckbox = (checkedVal) => {
    let tempChecked = {};
    props.completeList?.forEach((item) => {
      tempChecked = { ...tempChecked, [item[props.indexKey]]: checkedVal };
    });
    setChecked(tempChecked);
    handleAllChange(checkedVal);
    setAllChecked(checkedVal);
  };

  const deleteEntityFromList = (data, dataValue) => {
    //function called when delete icon on chip of selected field is clicked
    props.completeList &&
      props.completeList.forEach((item1) => {
        if (item1[props.indexKey] === data) {
          setChecked((prev) => {
            return {
              ...prev,
              [item1[props.indexKey]]: !prev[item1[props.indexKey]],
            };
          });
        }
      });
    handleChange(dataValue, 1);
  };

  return (
    <Select
      className={
        direction === RTL_DIRECTION
          ? `multiSelectInput_arabicView ${styles.multiSelectInput}`
          : styles.multiSelectInput
      }
      style={props.style}
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
      inputProps={{
        readOnly: props.disabled,
      }}
      multiple
      value={selectedFields}
      //renderValue is to display chips with delete icon for multiple selected fields in select
      renderValue={() => (
        <React.Fragment>
          {props.showSelectedCount &&
          selectedFields &&
          !selectedFields.includes(DEFAULT) ? (
            <span>
              {selectedFields.length} {t("selected")}
            </span>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {selectedFields?.map((value) =>
                value === DEFAULT ? (
                  <span>{props.placeholder}</span>
                ) : (
                  <Chip
                    key={value[props.labelKey]}
                    label={value[props.labelKey]}
                    clickable
                    deleteIcon={
                      <ClearIcon
                        onMouseDown={(event) => event.stopPropagation()}
                        className={styles.multiSelectDeleteIcon}
                      />
                    }
                    className={styles.multiSelectChip}
                    onDelete={() => {
                      deleteEntityFromList(value[props.indexKey], value);
                    }}
                  />
                )
              )}
            </div>
          )}
        </React.Fragment>
      )}
    >
      {/*code added on 26 April 2022 for BugId 108472*/}
      <div className={styles.listDiv}>
        <MenuItem className={styles.defaultSelectValue} value={DEFAULT}>
          <span>{props.placeholder}</span>
        </MenuItem>
        {props.selectAllOption ? (
          <ListItem
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.multiSelect_listItem
                : styles.multiSelect_listItem
            }
          >
            <FormControlLabel
              control={
                <Checkbox
                  checkedIcon={
                    <span
                      className={
                        props.checkedCheckBoxStyle
                          ? `${styles.multiSelect_checked} ${props.checkedCheckBoxStyle}`
                          : styles.multiSelect_checked
                      }
                    >
                      <CheckIcon
                        className={
                          props.checkIcon
                            ? `${props.checkIcon} ${styles.multiSelect_checkIcon}`
                            : styles.multiSelect_checkIcon
                        }
                      />
                    </span>
                  }
                  icon={
                    <span
                      className={
                        props.checkboxStyle
                          ? `${props.checkboxStyle} ${styles.multiSelect_checkboxStyle}`
                          : styles.multiSelect_checkboxStyle
                      }
                    />
                  }
                  checked={allChecked}
                  onChange={(e) => toggleSelectAllCheckbox(e.target.checked)}
                  id={`${props.id}_selectAll`}
                />
              }
              label={
                <div className={styles.multiSelect_dropdown}>
                  {props.selectAllStr
                    ? props.selectAllStr
                    : t("select") + " " + t("all")}
                </div>
              }
            />
          </ListItem>
        ) : null}

        {props.completeList?.length > 0 ? (
          props.completeList.map((data) => (
            <ListItem
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.multiSelect_listItem
                  : styles.multiSelect_listItem
              }
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checkedIcon={
                      <span
                        className={
                          props.checkedCheckBoxStyle
                            ? `${props.checkedCheckBoxStyle} ${styles.multiSelect_checked}`
                            : styles.multiSelect_checked
                        }
                      >
                        <CheckIcon
                          className={
                            props.checkIcon
                              ? `${props.checkIcon} ${styles.multiSelect_checkIcon}`
                              : styles.multiSelect_checkIcon
                          }
                        />
                      </span>
                    }
                    icon={
                      <span
                        className={
                          props.checkboxStyle
                            ? `${props.checkboxStyle} ${styles.multiSelect_checkboxStyle}`
                            : styles.multiSelect_checkboxStyle
                        }
                      />
                    }
                    value={data[props.labelKey]}
                    checked={
                      checked && checked[data[props.indexKey]] === true
                        ? true
                        : false
                    }
                    onChange={() => toggleCheckbox(data[props.indexKey], data)}
                    name="check"
                    id={`${props.id}_${data[props.indexKey]}`}
                  />
                }
                label={
                  <div className={styles.multiSelect_dropdown}>
                    {data[props.labelKey]}
                  </div>
                }
              />
            </ListItem>
          ))
        ) : (
          <p className={styles.multiSelect_noData}>{props.noDataLabel}</p>
        )}
      </div>
    </Select>
  );
}

export default MultiSelect;
