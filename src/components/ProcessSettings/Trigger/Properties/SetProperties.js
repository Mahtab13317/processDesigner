import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./properties.module.css";
import arabicStyles from "./propertiesArabicStyles.module.css";
import { connect } from "react-redux";
import * as actionCreators from "../../../../redux-store/actions/Trigger";
import DataDropDown from "./Components/DataDropDown";
import deleteIcon from "../../../../assets/subHeader/delete.svg";
import { store, useGlobalState } from "state-pool";
import {
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import { TRIGGER_CONSTANT } from "../../../../Constants/triggerConstants";

function SetProperties(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const variableDefinition = localLoadedProcessData?.Variable;
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [rowSelected, setRowSelected] = useState(null);
  const [addedFields, setAddedFields] = useState([
    { row_id: 1, field: null, value: null },
  ]);
  const [fieldValue, setFieldValue] = useState();
  const [existingTrigger, setExistingTrigger] = useState(false);
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

  useEffect(() => {
    props.setTriggerProperties([]);
  }, []);

  useEffect(() => {
    if (props.reload) {
      props.setTriggerProperties([]);
      setAddedFields([{ row_id: 1, field: null, value: null }]);
      props.setReload(false);
    }
  }, [props.reload]);

  useEffect(() => {
    if (props.initialValues) {
      setAddedFields(props.set);
      setExistingTrigger(true);
      props.setInitialValues(false);
    }
  }, [props.initialValues]);

  useEffect(() => {
    if (addedFields?.length > 0) {
      let arr = addedFields?.filter((child) => {
        if (child.field && child.value) {
          return { field: child.field, value: child.value };
        }
      });
      if (arr.length >= 1) {
        props.setTriggerProperties(arr);
      }
    } else {
      props.setTriggerProperties([]);
    }
  }, [addedFields]);

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
    if (addedFields.length > 1) {
      setAddedFields((prev) => {
        let newData = [...prev];
        newData.splice(index, 1);
        return newData;
      });
    } else {
      setAddedFields((prev) => {
        let newData = [...prev];
        newData.splice(index, 1);
        newData.push({ row_id: 1, field: null, value: null });
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

  return (
    <React.Fragment>
      <div className={styles.propertiesColumnView}>
        <div className="flex">
          <div className={styles.propertiesTriggerLabel}>
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
              id="trigger_set_add_btn"
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
                      uniqueId="trigger_setKey_dropdown"
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
                      uniqueId="trigger_setValue_dropdown"
                    />
                    {rowSelected === childField.row_id && !readOnlyProcess ? (
                      <div
                        onClick={() => deleteField(index)}
                        className={styles.triggerDeleteIcon}
                        id={`trigger_set_delete_${childField.row_id}`}
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

const mapDispatchToProps = (dispatch) => {
  return {
    setReload: (reload) =>
      dispatch(actionCreators.reload_trigger_fields(reload)),
    setTriggerProperties: (list) =>
      dispatch(actionCreators.setTrigger_properties(list)),
    setInitialValues: (value) =>
      dispatch(actionCreators.set_trigger_fields(value)),
    setTriggerEdited: (value) =>
      dispatch(actionCreators.is_trigger_definition_edited(value)),
  };
};

const mapStateToProps = (state) => {
  return {
    initialValues: state.triggerReducer.setDefaultValues,
    set: state.triggerReducer.Set,
    reload: state.triggerReducer.trigger_reload,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetProperties);
