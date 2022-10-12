// #BugID - 106096 (Trigger Bug)
// #BugDescription - Solved the issue of not being able to add create child workitem
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  MenuItem,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import styles from "./properties.module.css";
import arabicStyles from "./propertiesArabicStyles.module.css";
import { connect } from "react-redux";
import * as actionCreators from "../../../../redux-store/actions/Trigger";
import DataDropDown from "./Components/DataDropDown";
import deleteIcon from "../../../../assets/subHeader/delete.svg";
import { store, useGlobalState } from "state-pool";
import MultiSelect from "../../../../UI/MultiSelect";
import {
  DEFAULT,
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import {
  TRIGGER_CONSTANT,
  TRIGGER_CONST_VARIABLE,
  TRIGGER_CONST_WORKSTEP,
} from "../../../../Constants/triggerConstants";
import { getVariableById } from "../../../../utility/ProcessSettings/Triggers/triggerCommonFunctions";

function CreateChildWorkitemProperties(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const variableDefinition = localLoadedProcessData?.Variable;
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [rowSelected, setRowSelected] = useState(null);
  const [addedFields, setAddedFields] = useState([
    { row_id: 1, field: null, value: null },
  ]);
  const [selectedWorkstepField, setSelectedWorkstepField] = useState([DEFAULT]);
  const [selectedVariableField, setSelectedVariableField] = useState(DEFAULT);
  const [fieldValue, setFieldValue] = useState();
  const [sameParentChecked, setSameParentChecked] = useState(false);
  const [selectedType, setSelectedType] = useState(TRIGGER_CONST_WORKSTEP);
  const [activitiesList, setActivitiesList] = useState([]);
  const [existingTrigger, setExistingTrigger] = useState(false);
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

  const getActivities = (str) => {
    let localArr = [];
    let localStr = str.split(",");
    localLoadedProcessData?.MileStones.forEach((mile) => {
      mile.Activities.forEach((activity) => {
        if (localStr.includes(activity.ActivityName)) {
          localArr.push(activity);
        }
      });
    });
    return localArr;
  };

  useEffect(() => {
    props.setTriggerProperties({});
  }, []);

  useEffect(() => {
    if (props.reload) {
      props.setTriggerProperties({});
      setAddedFields([{ row_id: 1, field: null, value: null }]);
      setSelectedWorkstepField([DEFAULT]);
      setSelectedVariableField(DEFAULT);
      setSameParentChecked(false);
      setSelectedType(TRIGGER_CONST_WORKSTEP);
      setFieldValue();
      props.setReload(false);
    }
  }, [props.reload]);

  useEffect(() => {
    if (props.initialValues) {
      if (props.CREATE_CHILD_WORKITEM.type === TRIGGER_CONSTANT) {
        let localArr = getActivities(
          props.CREATE_CHILD_WORKITEM.m_strAssociatedWS
        );
        setSelectedWorkstepField(localArr);
      } else {
        setSelectedVariableField(
          getVariableById(
            props.CREATE_CHILD_WORKITEM.variableId,
            variableDefinition
          )
        );
      }
      setAddedFields(props.CREATE_CHILD_WORKITEM.list);
      setSameParentChecked(props.CREATE_CHILD_WORKITEM.generateSameParent);
      setSelectedType(
        props.CREATE_CHILD_WORKITEM.type === TRIGGER_CONSTANT
          ? TRIGGER_CONST_WORKSTEP
          : TRIGGER_CONST_VARIABLE
      );
      setExistingTrigger(true);
      props.setInitialValues(false);
    }
  }, [props.initialValues]);

  useEffect(() => {
    let arr = [];
    localLoadedProcessData?.MileStones.forEach((mile) => {
      mile.Activities.forEach((activity) => {
        arr.push(activity);
      });
    });
    setActivitiesList(arr);
  }, [localLoadedProcessData]);

  const addNewField = () => {
    if (existingTrigger) {
      props.setTriggerEdited(true);
    }
    setAddedFields((prev) => {
      let newData = [...prev];
      newData.push({
        row_id: newData[newData.length - 1].row_id + 1,
        field: null,
        value: null,
      });
      return newData;
    });
  };

  const deleteField = (index) => {
    if (existingTrigger) {
      props.setTriggerEdited(true);
    }
    setRowSelected(null);
    if (addedFields?.length > 1) {
      setAddedFields((prev) => {
        let newData = [...prev];
        newData.splice(index, 1);
        return newData;
      });
    } else {
      setAddedFields((prev) => {
        let newData = [...prev];
        newData.splice(index, 1);
        newData.push({ id: 1, field: null, value: null });
        return newData;
      });
    }
  };

  useEffect(() => {
    if (fieldValue) {
      if (existingTrigger) {
        props.setTriggerEdited(true);
      }
      addedFields.forEach((field, index) => {
        if (field.row_id === fieldValue.row_id) {
          setAddedFields((prev) => {
            let newData = [...prev];
            if (fieldValue.type === "F") {
              newData[index].field = fieldValue.value;
            } else {
              if (fieldValue.constant) {
                newData[index].value = {
                  VariableName: fieldValue.value,
                  ExtObjectId: "0",
                  VariableId: "0",
                  VariableFieldId: "0",
                  VariableScope: TRIGGER_CONSTANT,
                  constant: true,
                };
              } else {
                newData[index].value = fieldValue.value;
              }
            }
            return newData;
          });
        }
      });
    }
  }, [fieldValue]);

  useEffect(() => {
    let m_strAssociatedWS = "";
    let variableId;
    let varFieldId;
    let type;
    let list = [];
    let generateSameParent = sameParentChecked ? "Y" : "N";
    if (selectedType === TRIGGER_CONST_WORKSTEP) {
      type = TRIGGER_CONSTANT;
      if (selectedWorkstepField?.length > 0) {
        selectedWorkstepField.forEach((workstep) => {
          if (workstep !== DEFAULT) {
            if (m_strAssociatedWS.length === 0) {
              m_strAssociatedWS = workstep.ActivityName;
            } else {
              m_strAssociatedWS =
                m_strAssociatedWS + "," + workstep.ActivityName;
            }
          }
        });
      }
      variableId = "0";
      varFieldId = "0";
    } else if (selectedType === TRIGGER_CONST_VARIABLE) {
      type = selectedVariableField?.VariableScope;
      variableId = selectedVariableField?.VariableId;
      varFieldId = selectedVariableField?.VariableFieldId;
      m_strAssociatedWS = selectedVariableField?.VariableName;
    }
    if (addedFields?.length > 0) {
      list = addedFields?.filter((child) => {
        if (child.field && child.value) {
          return { field: child.field, value: child.value };
        }
      });
    }
    props.setTriggerProperties({
      m_strAssociatedWS,
      type,
      generateSameParent,
      variableId,
      varFieldId,
      list,
    });
  }, [
    sameParentChecked,
    selectedType,
    selectedWorkstepField,
    selectedVariableField,
    addedFields,
  ]);

  return (
    <React.Fragment>
      <div className={styles.propertiesColumnView}>
        <div className="flex">
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.triggerFormLabel
                : styles.triggerFormLabel
            }
          >
            {t("workstep")}{" "}
            <span className="relative">
              {t("name")}
              <span
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.starIcon
                    : styles.starIcon
                }
              >
                *
              </span>
            </span>
          </div>
          <div>
            <RadioGroup
              name="createChildWorkitem"
              className={styles.properties_radioDiv}
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                if (existingTrigger) {
                  props.setTriggerEdited(true);
                }
              }}
            >
              <FormControlLabel
                value={TRIGGER_CONST_WORKSTEP}
                control={<Radio />}
                disabled={readOnlyProcess}
                label={t("selectWorkstep")}
                id="trigger_ccwi_workstepOpt"
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.properties_radioButton
                    : styles.properties_radioButton
                }
              />
              <FormControlLabel
                value={TRIGGER_CONST_VARIABLE}
                disabled={readOnlyProcess}
                control={<Radio />}
                label={t("selectVariable")}
                id="trigger_ccwi_variableOpt"
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.properties_radioButton
                    : styles.properties_radioButton
                }
              />
            </RadioGroup>
            <div className="flex">
              {selectedType === TRIGGER_CONST_WORKSTEP ? (
                <MultiSelect
                  completeList={activitiesList}
                  labelKey="ActivityName"
                  indexKey="ActivityId"
                  associatedList={selectedWorkstepField}
                  handleAssociatedList={(val) => {
                    setSelectedWorkstepField(val);
                    if (existingTrigger) {
                      props.setTriggerEdited(true);
                    }
                  }}
                  placeholder={t("chooseWorkstep")}
                  noDataLabel={t("noWorksteps")}
                  disabled={readOnlyProcess}
                  id="trigger_ccwi_workstepMultiSelect"
                  style={{ width: "21vw" }}
                />
              ) : (
                <Select
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.triggerSelectVariableInput
                      : styles.triggerSelectVariableInput
                  }
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
                    PaperProps: {
                      style: {
                        maxHeight: "10rem",
                      },
                    },
                  }}
                  inputProps={{
                    readOnly: readOnlyProcess,
                  }}
                  value={selectedVariableField}
                  onChange={(e) => {
                    setSelectedVariableField(e.target.value);
                    if (existingTrigger) {
                      props.setTriggerEdited(true);
                    }
                  }}
                  id={`trigger_ccwi_variable_list`}
                >
                  <MenuItem
                    className={styles.defaultSelectValue}
                    value={DEFAULT}
                  >
                    <span>{t("chooseVariable")}</span>
                  </MenuItem>
                  {variableDefinition?.map((option) => {
                    return (
                      <MenuItem
                        className={styles.triggerDropdownData}
                        value={option}
                      >
                        {option.VariableName}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.sameParentCheckbox
                    : styles.sameParentCheckbox
                }
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameParentChecked}
                      disabled={readOnlyProcess}
                      onChange={() => {
                        setSameParentChecked((prev) => {
                          return !prev;
                        });
                        if (existingTrigger) {
                          props.setTriggerEdited(true);
                        }
                      }}
                      id="trigger_ccwi_sameParentCheck"
                      name="checkedB"
                      color="primary"
                    />
                  }
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.properties_radioButton
                      : styles.properties_radioButton
                  }
                  label={t("generateSameParent")}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div
            className={`${styles.propertiesTriggerLabel} ${styles.propertiesSetTriggerLabel}`}
          >
            {t("SET")}{" "}
            <span className="relative">
              {t("variable(s)")}
              <span
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.starIcon
                    : styles.starIcon
                }
              >
                *
              </span>
            </span>
          </div>
          {!readOnlyProcess ? (
            <button
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.addSetTrigger
                  : styles.addSetTrigger
              }
              onClick={addNewField}
              id="trigger_ccwi_addFieldsBtn"
            >
              {t("add")}
            </button>
          ) : null}
        </div>
        <div className={styles.setTriggerList}>
          {addedFields?.length > 0
            ? addedFields.map((childField, index) => {
                return (
                  <div
                    onMouseEnter={() => setRowSelected(childField.row_id)}
                    onMouseLeave={() => setRowSelected(null)}
                    className={`${styles.setTriggerDropDowns} flex`}
                    style={{
                      backgroundColor:
                        rowSelected === childField.row_id ? "#F0F0F0" : "white",
                    }}
                  >
                    <DataDropDown
                      triggerTypeOptions={variableDefinition}
                      setFieldValue={setFieldValue}
                      id={childField.row_id}
                      type="F"
                      value={childField.field}
                      setRowSelected={setRowSelected}
                      uniqueId="trigger_ccwi_key_dropdown"
                    />
                    <span className={styles.triggerEqualTo}>=</span>
                    <DataDropDown
                      triggerTypeOptions={variableDefinition}
                      setFieldValue={setFieldValue}
                      id={childField.row_id}
                      type="V"
                      value={childField.value}
                      setRowSelected={setRowSelected}
                      constantAdded={true}
                      uniqueId="trigger_ccwi_value_dropdown"
                    />
                    {rowSelected === childField.row_id ? (
                      <div
                        onClick={() => deleteField(index)}
                        className={styles.triggerDeleteIcon}
                        id={`trigger_ccwi_delete_${childField.row_id}`}
                      >
                        <img
                          src={deleteIcon}
                          width="16px"
                          height="16px"
                          title="Delete"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    CREATE_CHILD_WORKITEM: state.triggerReducer.CreateChild,
    initialValues: state.triggerReducer.setDefaultValues,
    reload: state.triggerReducer.trigger_reload,
    openProcessType: state.openProcessClick.selectedType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setReload: (reload) =>
      dispatch(actionCreators.reload_trigger_fields(reload)),
    setTriggerProperties: ({
      m_strAssociatedWS,
      type,
      generateSameParent,
      variableId,
      varFieldId,
      list,
    }) =>
      dispatch(
        actionCreators.createChildWorkitemTrigger_properties({
          m_strAssociatedWS,
          type,
          generateSameParent,
          variableId,
          varFieldId,
          list,
        })
      ),
    setInitialValues: (value) =>
      dispatch(actionCreators.set_trigger_fields(value)),
    setTriggerEdited: (value) =>
      dispatch(actionCreators.is_trigger_definition_edited(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateChildWorkitemProperties);
