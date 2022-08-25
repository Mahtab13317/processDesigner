import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClickAwayListener } from "@material-ui/core";
import styles from "./properties.module.css";
import arabicStyles from "./propertiesArabicStyles.module.css";
import { connect } from "react-redux";
import * as actionCreators from "../../../../redux-store/actions/Trigger";
import ButtonDropdown from "../../../../UI/ButtonDropdown/index";
import { store, useGlobalState } from "state-pool";
import SelectWithInput from "../../../../UI/SelectWithInput";
import {
  TRIGGER_PRIORITY_HIGH,
  TRIGGER_PRIORITY_LOW,
  TRIGGER_PRIORITY_MEDIUM,
} from "../../../../Constants/triggerConstants";
import { addConstantsToString } from "../../../../utility/ProcessSettings/Triggers/triggerCommonFunctions";
import {
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";

function MailProperties(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const variableDefinition = localLoadedProcessData?.Variable;
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [data, setData] = useState({
    subjectValInput: "",
    mailValue: "",
    isFromConstant: false,
    isToConstant: false,
    isCcConstant: false,
    isBccConstant: false,
  });
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const priority = [
    t(TRIGGER_PRIORITY_LOW),
    t(TRIGGER_PRIORITY_MEDIUM),
    t(TRIGGER_PRIORITY_HIGH),
  ];
  const [existingTrigger, setExistingTrigger] = useState(false);
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

  useEffect(() => {
    props.setMailProperties({});
  }, []);

  useEffect(() => {
    if (props.reload) {
      props.setMailProperties({});
      setData({
        subjectValInput: "",
        mailValue: "",
        isFromConstant: false,
        isToConstant: false,
        isCcConstant: false,
        isBccConstant: false,
      });
      props.setReload(false);
    }
  }, [props.reload]);

  useEffect(() => {
    if (props.initialValues) {
      setExistingTrigger(true);
      setData({
        subjectValInput: props.Mail.subjectValue,
        mailValue: props.Mail.mailBodyValue,
        isFromConstant: props.Mail.isFromConst,
        isToConstant: props.Mail.isToConst,
        isCcConstant: props.Mail.isCConst,
        isBccConstant: props.Mail.isBccConst,
        priorityInput: props.Mail.priority,
        fromInput: props.Mail.from,
        toInput: props.Mail.to,
        ccInput: props.Mail.cc,
        bccInput: props.Mail.bcc,
      });
      props.setInitialValues(false);
    }
  }, [props.initialValues]);

  useEffect(() => {
    props.setMailProperties({
      from: data.fromInput,
      isFromConst: data.isFromConstant,
      to: data.toInput,
      isToConst: data.isToConstant,
      cc: data.ccInput,
      isCConst: data.isCcConstant,
      bcc: data.bccInput,
      isBccConst: data.isBccConstant,
      priority: data.priorityInput,
      subjectValue: data.subjectValInput,
      mailBodyValue: data.mailValue,
    });
  }, [data]);

  const setSubjectFunc = (value) => {
    setShowDropdown1(false);
    onChange(
      "subjectValInput",
      addConstantsToString(data.subjectValInput, value.VariableName)
    );
  };

  const setMailFunc = (value) => {
    setShowDropdown2(false);
    onChange(
      "mailValue",
      addConstantsToString(data.mailValue, value.VariableName)
    );
  };

  const onChange = (name, value) => {
    setData((prev) => {
      let newData = { ...prev };
      newData[name] = value;
      return newData;
    });
    if (existingTrigger) {
      props.setTriggerEdited(true);
    }
  };

  return (
    <div className={styles.propertiesMainView} id="mail_trigger">
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
            <span className="relative">
              {t("from")}
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
            width={"75%"}
            dropdownOptions={variableDefinition}
            optionKey="VariableName"
            setIsConstant={(val) => {
              onChange("isFromConstant", val);
            }}
            setValue={(val) => {
              onChange("fromInput", val);
            }}
            value={data.fromInput}
            isConstant={data.isFromConstant}
            showEmptyString={false}
            showConstValue={true}
            disabled={readOnlyProcess}
            id="from_select_input"
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
              {t("to")}
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
            width={"75%"}
            dropdownOptions={variableDefinition}
            optionKey="VariableName"
            setIsConstant={(val) => {
              onChange("isToConstant", val);
            }}
            setValue={(val) => {
              onChange("toInput", val);
            }}
            value={data.toInput}
            isConstant={data.isToConstant}
            showEmptyString={false}
            showConstValue={true}
            disabled={readOnlyProcess}
            id="to_select_input"
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
            {t("CC")}
          </div>
          <SelectWithInput
            width={"75%"}
            dropdownOptions={variableDefinition}
            optionKey="VariableName"
            setIsConstant={(val) => {
              onChange("isCcConstant", val);
            }}
            setValue={(val) => {
              onChange("ccInput", val);
            }}
            value={data.ccInput}
            isConstant={data.isCcConstant}
            showEmptyString={true}
            disabled={readOnlyProcess}
            showConstValue={true}
            id="cc_select_input"
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
            {t("BCC")}
          </div>
          <SelectWithInput
            width={"75%"}
            dropdownOptions={variableDefinition}
            optionKey="VariableName"
            setIsConstant={(val) => {
              onChange("isBccConstant", val);
            }}
            setValue={(val) => {
              onChange("bccInput", val);
            }}
            value={data.bccInput}
            isConstant={data.isBccConstant}
            showEmptyString={true}
            disabled={readOnlyProcess}
            showConstValue={true}
            id="bcc_select_input"
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
            {t("Priority")}
          </div>
          <SelectWithInput
            width={"75%"}
            dropdownOptions={priority}
            setValue={(val) => {
              onChange("priorityInput", val);
            }}
            value={data.priorityInput}
            showEmptyString={true}
            showConstValue={false}
            disabled={readOnlyProcess}
            id="priority_select_input"
          />
        </div>
      </div>
      <div>
        <div className="flex">
          <span
            className={
              direction === RTL_DIRECTION
                ? `${arabicStyles.propertiesDescLabel} relative`
                : `${styles.propertiesDescLabel} relative`
            }
          >
            {t("Subject")}
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
          <div className={direction === RTL_DIRECTION ? `right` : null}>
            <ClickAwayListener onClickAway={() => setShowDropdown1(false)}>
              <div className="relative inlineBlock">
                <button
                  className={styles.propertiesAddButton}
                  onClick={() => setShowDropdown1(true)}
                  disabled={readOnlyProcess}
                  id="trigger_mailSubject_btn"
                >
                  {t("insertVariable")}
                </button>
                <ButtonDropdown
                  open={showDropdown1}
                  dropdownOptions={variableDefinition}
                  onSelect={setSubjectFunc}
                  optionKey="VariableName"
                  style={{ top: "80%" }}
                  id="trigger_mailSubject_varList"
                />
              </div>
            </ClickAwayListener>
            <textarea
              id="subjectValInput"
              value={data.subjectValInput}
              onChange={(e) => {
                onChange("subjectValInput", e.target.value);
              }}
              disabled={readOnlyProcess}
              className={styles.subjectMailInput}
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
            {t("MailBody")}
          </span>
          <div className={direction === RTL_DIRECTION ? `right` : null}>
            <ClickAwayListener onClickAway={() => setShowDropdown2(false)}>
              <div className="relative inlineBlock">
                <button
                  className={styles.propertiesAddButton}
                  onClick={() => setShowDropdown2(true)}
                  disabled={readOnlyProcess}
                  id="trigger_mailBody_btn"
                >
                  {t("insertVariable")}
                </button>
                <ButtonDropdown
                  open={showDropdown2}
                  dropdownOptions={variableDefinition}
                  onSelect={setMailFunc}
                  optionKey="VariableName"
                  style={{ top: "80%" }}
                  id="trigger_mailBody_varList"
                />
              </div>
            </ClickAwayListener>
            <textarea
              id="trigger_mailBody"
              value={data.mailValue}
              disabled={readOnlyProcess}
              onChange={(e) => {
                onChange("mailValue", e.target.value);
              }}
              className={`${styles.triggerFormInput} ${styles.mailBodyInput}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    Mail: state.triggerReducer.Mail,
    initialValues: state.triggerReducer.setDefaultValues,
    reload: state.triggerReducer.trigger_reload,
    openProcessType: state.openProcessClick.selectedType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setReload: (reload) =>
      dispatch(actionCreators.reload_trigger_fields(reload)),
    setMailProperties: ({
      from,
      isFromConst,
      to,
      isToConst,
      cc,
      isCConst,
      bcc,
      isBccConst,
      priority,
      subjectValue,
      mailBodyValue,
    }) =>
      dispatch(
        actionCreators.mail_properties({
          from,
          isFromConst,
          to,
          isToConst,
          cc,
          isCConst,
          bcc,
          isBccConst,
          priority,
          subjectValue,
          mailBodyValue,
        })
      ),
    setInitialValues: (value) =>
      dispatch(actionCreators.set_trigger_fields(value)),
    setTriggerEdited: (value) =>
      dispatch(actionCreators.is_trigger_definition_edited(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MailProperties);
