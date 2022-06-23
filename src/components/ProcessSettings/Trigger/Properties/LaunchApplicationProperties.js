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

function LaunchApplicationProperties(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const variableDefinition = localLoadedProcessData?.Variable;
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [appName, setAppName] = useState();
  const [argumentStrValue, setArgumentStrValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [existingTrigger, setExistingTrigger] = useState(false);
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

  useEffect(() => {
    props.setLaunchAppProperties({});
  }, []);

  useEffect(() => {
    if (props.reload) {
      props.setLaunchAppProperties({});
      setAppName("");
      setArgumentStrValue("");
      props.setReload(false);
    }
  }, [props.reload]);

  useEffect(() => {
    if (props.initialValues) {
      setAppName(props.launchApp.appName);
      setArgumentStrValue(props.launchApp.argumentStrValue);
      setExistingTrigger(true);
      props.setInitialValues(false);
    }
  }, [props.initialValues]);

  useEffect(() => {
    props.setLaunchAppProperties({ appName, argumentStrValue });
  }, [appName, argumentStrValue]);

  const setArgumentStringFunc = (value) => {
    if (existingTrigger) {
      props.setTriggerEdited(true);
    }
    setShowDropdown(false);
    setArgumentStrValue((prev) => {
      return addConstantsToString(prev, value.VariableName);
    });
  };

  return (
    <React.Fragment>
      <div className={styles.propertiesColumnView}>
        <div className={`${styles.mb025} flex`}>
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.triggerFormLabel
                : styles.triggerFormLabel
            }
          >
            {t("application")}{" "}
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
            id="trigger_la_nameInput"
            autofocus
            disabled={readOnlyProcess}
            value={appName}
            onChange={(e) => {
              setAppName(e.target.value);
              if (existingTrigger) {
                props.setTriggerEdited(true);
              }
            }}
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.propertiesFormInput
                : styles.propertiesFormInput
            }
          />
        </div>
        <div className="flex">
          <span
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.triggerFormLabel
                : styles.triggerFormLabel
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
                  id="trigger_laInsert_Btn"
                >
                  {t("insertVariable")}
                </button>
                <ButtonDropdown
                  open={showDropdown}
                  dropdownOptions={variableDefinition}
                  onSelect={setArgumentStringFunc}
                  optionKey="VariableName"
                  style={{ top: "80%" }}
                  id="trigger_laInsert_varList"
                />
              </div>
            </ClickAwayListener>
            <div>
              <textarea
                id="trigger_la_desc"
                autofocus
                disabled={readOnlyProcess}
                value={argumentStrValue}
                onChange={(e) => {
                  setArgumentStrValue(e.target.value);
                  if (existingTrigger) {
                    props.setTriggerEdited(true);
                  }
                }}
                className={`${styles.triggerFormInput} ${styles.argStringBodyInput}`}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    launchApp: state.triggerReducer.LaunchApp,
    initialValues: state.triggerReducer.setDefaultValues,
    reload: state.triggerReducer.trigger_reload,
    openProcessType: state.openProcessClick.selectedType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setReload: (reload) =>
      dispatch(actionCreators.reload_trigger_fields(reload)),
    setLaunchAppProperties: ({ appName, argumentStrValue }) =>
      dispatch(
        actionCreators.launch_application_properties({
          appName,
          argumentStrValue,
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
)(LaunchApplicationProperties);
