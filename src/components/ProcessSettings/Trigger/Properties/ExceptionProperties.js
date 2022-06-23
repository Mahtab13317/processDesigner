import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import styles from "./properties.module.css";
import arabicStyles from "./propertiesArabicStyles.module.css";
import { connect } from "react-redux";
import * as actionCreators from "../../../../redux-store/actions/Trigger";
import SelectWithInput from "../../../../UI/SelectWithInput";
import {
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import {
  TRIGGER_EXCEPTION_CLEAR,
  TRIGGER_EXCEPTION_RAISE,
  TRIGGER_EXCEPTION_RESPOND,
} from "../../../../Constants/triggerConstants";
import { store, useGlobalState } from "state-pool";

function ExceptionProperties(props) {
  let { t } = useTranslation();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const direction = `${t("HTML_DIR")}`;
  const [exception, setException] = useState("");
  const [comment, setComment] = useState("");
  const [attribute, setAttribute] = useState(TRIGGER_EXCEPTION_RAISE);
  const [existingTrigger, setExistingTrigger] = useState(false);
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

  useEffect(() => {
    props.setTriggerProperties({});
  }, []);

  useEffect(() => {
    if (props.reload) {
      props.setTriggerProperties({});
      setException("");
      setAttribute("");
      setComment("");
      props.setReload(false);
    }
  }, [props.reload]);

  useEffect(() => {
    if (props.initialValues) {
      localLoadedProcessData?.ExceptionList?.forEach((exceptionData) => {
        if (exceptionData.ExceptionId === props.exception.exceptionId) {
          setException(exceptionData);
        }
      });
      setAttribute(props.exception.attribute);
      setComment(props.exception.comment);
      setExistingTrigger(true);
      props.setInitialValues(false);
    }
  }, [props.initialValues]);

  useEffect(() => {
    let exceptionId =
      exception !== "" && exception ? exception.ExceptionId : null;
    let exceptionName =
      exception !== "" && exception ? exception.ExceptionName : null;
    props.setTriggerProperties({
      exceptionId,
      exceptionName,
      attribute,
      comment,
    });
  }, [exception, comment, attribute]);

  return (
    <React.Fragment>
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
              {t("EXCEPTION")}{" "}
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
            <SelectWithInput
              dropdownOptions={localLoadedProcessData.ExceptionList}
              optionKey="ExceptionName"
              value={exception}
              disabled={readOnlyProcess}
              setValue={(val) => {
                setException(val);
                if (existingTrigger) {
                  props.setTriggerEdited(true);
                }
              }}
              showEmptyString={false}
              showConstValue={false}
              id="trigger_exception_name"
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
              <span className="relative">
                {t("action")}
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
            <span>
              <RadioGroup
                aria-label="EXCEPTION"
                name="exception1"
                className={styles.properties_radioDiv}
                value={attribute}
                onChange={(e) => {
                  setAttribute(e.target.value);
                  if (existingTrigger) {
                    props.setTriggerEdited(true);
                  }
                }}
              >
                <FormControlLabel
                  value={TRIGGER_EXCEPTION_RAISE}
                  control={<Radio />}
                  id="trigger_exception_raiseOpt"
                  label={t(TRIGGER_EXCEPTION_RAISE)}
                  disabled={readOnlyProcess}
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.properties_radioButton
                      : styles.properties_radioButton
                  }
                />
                <FormControlLabel
                  value={TRIGGER_EXCEPTION_RESPOND}
                  control={<Radio />}
                  id="trigger_exception_respondOpt"
                  disabled={readOnlyProcess}
                  label={t(TRIGGER_EXCEPTION_RESPOND)}
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.properties_radioButton
                      : styles.properties_radioButton
                  }
                />
                <FormControlLabel
                  value={TRIGGER_EXCEPTION_CLEAR}
                  control={<Radio />}
                  id="trigger_exception_clearOpt"
                  disabled={readOnlyProcess}
                  label={t(TRIGGER_EXCEPTION_CLEAR)}
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.properties_radioButton
                      : styles.properties_radioButton
                  }
                />
              </RadioGroup>
            </span>
          </div>
        </div>
        <div className="flex">
          <span
            className={
              direction === RTL_DIRECTION
                ? `${arabicStyles.triggerFormLabel} ${arabicStyles.triggerDescLabel}`
                : `${styles.triggerFormLabel} ${styles.triggerDescLabel}`
            }
          >
            <span className="relative">
              {t("comment")}
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
          <textarea
            disabled={readOnlyProcess}
            id="trigger_exception_description"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (existingTrigger) {
                props.setTriggerEdited(true);
              }
            }}
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.descriptionInput
                : styles.descriptionInput
            }
          />
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    initialValues: state.triggerReducer.setDefaultValues,
    reload: state.triggerReducer.trigger_reload,
    exception: state.triggerReducer.Exception,
    openProcessType: state.openProcessClick.selectedType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTriggerProperties: ({
      exceptionId,
      exceptionName,
      attribute,
      comment,
    }) =>
      dispatch(
        actionCreators.exception_properties({
          exceptionId,
          exceptionName,
          attribute,
          comment,
        })
      ),
    setReload: (reload) =>
      dispatch(actionCreators.reload_trigger_fields(reload)),
    setInitialValues: (value) =>
      dispatch(actionCreators.set_trigger_fields(value)),
    setTriggerEdited: (value) =>
      dispatch(actionCreators.is_trigger_definition_edited(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExceptionProperties);
