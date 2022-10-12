import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ClickAwayListener } from "@material-ui/core";
import styles from "./properties.module.css";
import arabicStyles from "./propertiesArabicStyles.module.css";
import { connect } from "react-redux";
import * as actionCreators from "../../../../redux-store/actions/Trigger";
import ButtonDropdown from "../../../../UI/ButtonDropdown/index";
import { store, useGlobalState } from "state-pool";
import { addConstantsToString } from "../../../../utility/ProcessSettings/Triggers/triggerCommonFunctions";
import {
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import { useRef } from "react";
import { FieldValidations } from "../../../../utility/FieldValidations/fieldValidations";

function ExecuteProperties(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const variableDefinition = localLoadedProcessData?.Variable;
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [funcName, setFuncName] = useState("");
  const [serverExecutable, setServerExecutable] = useState("");
  const [argString, setArgString] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [existingTrigger, setExistingTrigger] = useState(false);
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

  const funcNameRef=useRef();
  const executeServerRef=useRef();
  const executeArgRef=useRef();

  useEffect(() => {
    props.setExecuteProperties({});
  }, []);

  useEffect(() => {
    if (props.reload) {
      props.setExecuteProperties({});
      setFuncName("");
      setServerExecutable("");
      setArgString("");
      props.setReload(false);
    }
  }, [props.reload]);

  useEffect(() => {
    if (props.initialValues) {
      setFuncName(props.execute.funcName);
      setServerExecutable(props.execute.serverExecutable);
      setArgString(props.execute.argString);
      setExistingTrigger(true);
      props.setInitialValues(false);
    }
  }, [props.initialValues]);

  useEffect(() => {
    props.setExecuteProperties({ funcName, serverExecutable, argString });
  }, [funcName, serverExecutable, argString]);

  const setArgumentStringFunc = (value) => {
    if (existingTrigger) {
      props.setTriggerEdited(true);
    }
    setShowDropdown(false);
    setArgString((prev) => {
      return addConstantsToString(prev, value.VariableName);
    });
  };

  return (
    <div className={styles.propertiesMainView}>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.triggerNameTypeDiv
            : styles.triggerNameTypeDiv
        }
      >
        <div className="flex">
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.triggerFormLabel
                : styles.triggerFormLabel
            }
          >
            {t("function")}{" "}
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
          <input
            id="trigger_execute_funcName"
            autofocus
            disabled={readOnlyProcess}
            value={funcName}
            onChange={(e) => {
              setFuncName(e.target.value);
              if (existingTrigger) {
                props.setTriggerEdited(true);
              }
            }}
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.propertiesFormInput
                : styles.propertiesFormInput
            }
            ref={funcNameRef}
							onKeyPress={(e) =>
							FieldValidations(e, 165, funcNameRef.current, 255)
							 }
          />
          
        </div>
        <div className="flex">
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.triggerFormLabel
                : styles.triggerFormLabel
            }
          >
            {t("server")}{" "}
            <span className="relative">
              {t("executable")}
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
          <input
            id="trigger_execute_server"
            autofocus
            disabled={readOnlyProcess}
            value={serverExecutable}
            onChange={(e) => {
              setServerExecutable(e.target.value);
              if (existingTrigger) {
                props.setTriggerEdited(true);
              }
            }}
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.propertiesFormInput
                : styles.propertiesFormInput
            }
            ref={executeServerRef}
							onKeyPress={(e) =>
							FieldValidations(e, 150, executeServerRef.current, 255)
							 }
          />
        </div>
      </div>
      <div className="flex">
        <span
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.propertiesDescLabel
              : styles.propertiesDescLabel
          }
        >
          {t("arguments")}{" "}
          <span className="relative">
            {t("string")}
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
        </span>
        <div className={direction === RTL_DIRECTION ? `right` : null}>
          <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
            <div className="relative inlineBlock">
              <button
                className={styles.propertiesAddButton}
                onClick={() => setShowDropdown(true)}
                disabled={readOnlyProcess}
                id="trigger_executeInsert_Btn"
              >
                {t("insertVariable")}
              </button>
              <ButtonDropdown
                open={showDropdown}
                dropdownOptions={variableDefinition}
                onSelect={setArgumentStringFunc}
                optionKey="VariableName"
                style={{ top: "80%" }}
                id="trigger_executeInsert_varList"
              />
            </div>
          </ClickAwayListener>
          <textarea
            id="trigger_execute_argsString"
            disabled={readOnlyProcess}
            autofocus
            value={argString}
            onChange={(e) => {
              setArgString(e.target.value);
              if (existingTrigger) {
                props.setTriggerEdited(true);
              }
            }}
            className={`${styles.triggerFormInput} ${styles.mailBodyInput}`}
            ref={executeArgRef}
							onKeyPress={(e) =>
							FieldValidations(e, 142, executeArgRef.current, 255)
							 }
          />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    execute: state.triggerReducer.Execute,
    initialValues: state.triggerReducer.setDefaultValues,
    reload: state.triggerReducer.trigger_reload,
    openProcessType: state.openProcessClick.selectedType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setReload: (reload) =>
      dispatch(actionCreators.reload_trigger_fields(reload)),
    setExecuteProperties: ({ funcName, serverExecutable, argString }) =>
      dispatch(
        actionCreators.execute_properties({
          funcName,
          serverExecutable,
          argString,
        })
      ),
    setInitialValues: (value) =>
      dispatch(actionCreators.set_trigger_fields(value)),
    setTriggerEdited: (value) =>
      dispatch(actionCreators.is_trigger_definition_edited(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExecuteProperties);
