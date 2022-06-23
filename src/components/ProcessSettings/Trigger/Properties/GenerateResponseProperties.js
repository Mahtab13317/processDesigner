import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./properties.module.css";
import arabicStyles from "./propertiesArabicStyles.module.css";
import { connect } from "react-redux";
import * as actionCreators from "../../../../redux-store/actions/Trigger";
import SelectWithInput from "../../../../UI/SelectWithInput";
import {
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import { store, useGlobalState } from "state-pool";

function GenerateResponseProperties(props) {
  let { t } = useTranslation();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const direction = `${t("HTML_DIR")}`;
  const [file, setFile] = useState("");
  const [document, setDocument] = useState("");
  const [existingTrigger, setExistingTrigger] = useState(false);
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

  useEffect(() => {
    props.setTriggerProperties({});
  }, []);

  useEffect(() => {
    if (props.reload) {
      props.setTriggerProperties({});
      setFile("");
      setDocument("");
      props.setReload(false);
    }
  }, [props.reload]);

  useEffect(() => {
    if (props.initialValues) {
      props.templateList?.forEach((template) => {
        if (template.DocName === props.generateResponse.fileName) {
          setFile(template);
        }
      });
      localLoadedProcessData?.DocumentTypeList?.forEach((doc) => {
        if (doc.DocName === props.generateResponse.docTypeName) {
          setDocument(doc);
        }
      });
      setExistingTrigger(true);
      props.setInitialValues(false);
    }
  }, [props.initialValues]);

  useEffect(() => {
    let fileId = file?.TemplateId;
    let fileName = file?.DocName;
    let docTypeName = document?.DocName;
    let docTypeId = document?.DocTypeId;
    props.setTriggerProperties({
      fileId,
      fileName,
      docTypeName,
      docTypeId,
    });
  }, [file, document]);

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
            {t("file")}{" "}
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
            dropdownOptions={props.templateList}
            optionKey="DocName"
            value={file}
            setValue={(val) => {
              setFile(val);
              if (existingTrigger) {
                props.setTriggerEdited(true);
              }
            }}
            disabled={readOnlyProcess}
            showEmptyString={false}
            showConstValue={false}
            id="trigger_gr_fileName"
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
            {t("document")}{" "}
            <span className="relative">
              {t("type")}
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
            dropdownOptions={localLoadedProcessData.DocumentTypeList}
            optionKey="DocName"
            value={document}
            disabled={readOnlyProcess}
            setValue={(val) => {
              setDocument(val);
              if (existingTrigger) {
                props.setTriggerEdited(true);
              }
            }}
            showEmptyString={false}
            showConstValue={false}
            id="trigger_gr_docName"
          />
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    templateList: state.triggerReducer.templateList,
    initialValues: state.triggerReducer.setDefaultValues,
    reload: state.triggerReducer.trigger_reload,
    generateResponse: state.triggerReducer.generateResponse,
    openProcessType: state.openProcessClick.selectedType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTriggerProperties: ({ fileId, fileName, docTypeName, docTypeId }) =>
      dispatch(
        actionCreators.generate_response_properties({
          fileId,
          fileName,
          docTypeName,
          docTypeId,
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
)(GenerateResponseProperties);
