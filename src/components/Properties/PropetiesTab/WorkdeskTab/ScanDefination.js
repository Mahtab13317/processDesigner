import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../ProcessSettings/Trigger/Properties/properties.module.css";
// import arabicStyles from "./propertiesArabicStyles.module.css";
import style from "./scan.module.css";
import { connect } from "react-redux";
import * as actionCreators from "../../../../redux-store/actions/Trigger";
import DataDropDown from "../../../ProcessSettings/Trigger/Properties/Components/DataDropDown";
import deleteIcon from "../../../../assets/subHeader/delete.svg";
import { store, useGlobalState } from "state-pool";
import {
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";

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
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

  useEffect(() => {
    if (props.selectedDoc?.scanActionList?.length > 0) {
      let tempFields = [];
      props.selectedDoc.scanActionList.forEach((doc, index) => {
        let field = variableDefinition.filter((el) => {
          if (el.VariableName == doc.param1) {
            return el;
          }
        })[0];

        let fieldValue = variableDefinition.filter((el) => {
          if (el.VariableName == doc.param2) {
            return el;
          }
        })[0];
        tempFields.push({ row_id: index + 1, field: field, value: fieldValue });
      });
      setAddedFields(tempFields);
    }
  }, [props.selectedDoc]);

  useEffect(() => {
    if (props.reload) {
      setAddedFields([{ row_id: 1, field: null, value: null }]);
      props.setReload(false);
    }
  }, [props.reload]);

  useEffect(() => {
    if (props.initialValues) {
      setAddedFields(props.set);
      props.setInitialValues(false);
    }
  }, [props.initialValues]);

  const okHandler = () => {
    if (addedFields && addedFields.length > 0) {
      let arr = addedFields.filter((child) => {
        if (child.field && child.value) {
          return { field: child.field, value: child.value };
        }
      });
      if (arr.length >= 1) {
        props.selectedScanActionHandler(arr);
      }
    } else {
      props.selectedScanActionHandler([]);
    }
  };

  const addNewField = () => {
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
                  VariableScope: "C",
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
      <div className={styles.propertiesColumnView} style={{ width: "55vw" }}>
        <h5>Scan Action</h5>
        <div className="flex">
          <div className={styles.propertiesTriggerLabel}>
            {t("SET")}{" "}
            <span className="relative">
              {t("variable(s)")}
              <span className={styles.starIcon}>★</span>
            </span>
          </div>
          {!readOnlyProcess ? (
            <button
              className={styles.addSetTrigger}
              onClick={addNewField}
              id="trigger_set_add_btn"
            >
              {t("add")}
            </button>
          ) : null}
        </div>
        <div className={styles.setTriggerList}>
          {addedFields && addedFields.length > 0
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
        <div className={style.ScanFooter}>
          <button
            className={style.okBtn}
            onClick={okHandler}
            id="trigger_set_add_btn"
          >
            {t("ok")}
          </button>
          <button
            className={style.CancelBtn}
            onClick={() => props.setopenModal(null)}
          >
            Cancel
          </button>
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
