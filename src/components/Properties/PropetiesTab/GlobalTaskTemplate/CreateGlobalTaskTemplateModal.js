import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ModalForm from "./../../../../UI/ModalForm/modalForm";
import Field from "./../../../../UI/InputFields/TextField/Field";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";

import { createInstance } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";
import {
  ENDPOINT_ADD_GLOBAL_TEMPLATE,
  TaskType,
} from "../../../../Constants/appConstants";
import { useDispatch, useSelector } from "react-redux";
import { showDrawer } from "../../../../redux-store/actions/Properties/showDrawerAction";
import { selectedTask } from "../../../../redux-store/actions/selectedCellActions";
import { getSelectedCellType } from "../../../../utility/abstarctView/getSelectedCellType";
import { setGlobalTaskTemplates } from "../../../../redux-store/actions/Properties/globalTaskTemplateAction";

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "4rem",
  },
}));
{
  /*Making inputs for fields */
}
const makeFieldInputs = (value) => {
  return {
    value: value,
    error: false,
    helperText: "",
  };
};

const CreateGlobalTaskTemplateModal = (props) => {
  const [open, setOpen] = useState(props.isOpen ? true : false);
  const dispatch = useDispatch();
  const globalTemplates = useSelector(
    (state) => state.globalTaskTemplate.globalTemplates
  );
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const localActivityPropertyData = store.getState("activityPropertyData");
  const [
    localLoadedActivityPropertyData,
    setlocalLoadedActivityPropertyData,
    updatelocalLoadedActivityPropertyData,
  ] = useGlobalState(localActivityPropertyData);
  const { t } = useTranslation();
  const [isCreating, setIsCreating] = useState(false);
  const [formHasError, setFormHasError] = useState(true);

  const [templateName, setTemplateName] = useState(makeFieldInputs(""));

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errors = "";

    switch (name) {
      case "Template Name":
        errors = value?.trim().length === 0 ? t("templateNameEmptyError") : "";
        setTemplateName({
          ...templateName,
          value,
          error: errors ? true : false,
          helperText: errors,
        });
        break;

      default:
        break;
    }
  };
  useEffect(() => {
    if (templateName?.error) {
      setFormHasError(true);
    } else {
      setFormHasError(false);
    }
  }, [templateName]);
  const validateFields = () => {
    const tmpNameErrors =
      templateName.value.trim().length === 0 ? t("templateNameEmptyError") : "";
    if (tmpNameErrors) {
      setTemplateName({
        ...templateName,
        error: tmpNameErrors ? true : false,
        helperText: tmpNameErrors,
      });
    }

    return tmpNameErrors ? false : true;
  };

  const handleClose = () => {
    setOpen(false);

    props.handleClose();
  };
  const onClick1 = () => {
    handleClose();
  };
  const onClick2 = async () => {
    if (!validateFields()) {
      return;
    }
    const axiosInstance = createInstance();
    setIsCreating(true);

    try {
      var res = await axiosInstance.post(`${ENDPOINT_ADD_GLOBAL_TEMPLATE}`, {
        m_strTemplateName: templateName.value,
        m_strStatus: "I",
        processDefId: localLoadedProcessData.ProcessDefId,
      });

      if (res.data?.Status === 0) {
        const ids = globalTemplates.map((variable) => +variable.m_iTemplateId);
        const maxId = Math.max(...ids);
        const templateData = {
          taskGenPropInfo: {
            taskTemplateInfo: {
              m_arrTaskTemplateVarList: [],
              m_bGlobalTemplate: true,
              m_bGlobalTemplateFormCreated: true,
              m_bCustomFormAssoc: true,
              m_strTemplateName: templateName.value,
              m_iTemplateId: `${maxId + 1}`,
            },
            isRepeatable: false,
            genPropInfo: {
              cost: "0.00",
              description: "",
              consultantList: [],
            },
            m_objTaskRulesListInfo: [],
            m_strGoal: "",
            m_strInstructions: "",
            bTaskFormView: false,
            tatInfo: {
              wfDays: "0",
              wfMinutes: "0",
              tatCalFlag: "N",
              wfHours: "0",
            },
            isNotifyEmail: false,
            m_objOptionsView: {
              m_objOptionInfo: {
                expiryInfo: {
                  expCalFlag: "",
                  holdTillVar: ":",
                  varFieldId_Days: "",
                  expiryOperator: "",
                  expiryOperation: "",
                  triggerId: "",
                  wfDays: "",
                  wfMinutes: "",
                  variableId_Days: "",
                  wfSeconds: "",
                  wfHours: "",
                  expFlag: false,
                },
              },
              m_strExpires: "NE",
              m_SelectedUser: "::",
            },
          },
        };
        const newGts = [...globalTemplates, templateData];
        dispatch(setGlobalTaskTemplates(newGts));

        setIsCreating(false);
        handleClose();
        dispatch(showDrawer(true));
        dispatch(
          selectedTask(
            maxId + 1,
            templateName.value,
            TaskType.globalTask,
            getSelectedCellType("TASKTEMPLATE")
          )
        );
        setlocalLoadedActivityPropertyData(templateData);

        dispatch(
          setToastDataFunc({
            message: `${templateName.value} created Succesfully`,
            severity: "success",
            open: true,
          })
        );
      }
    } catch (error) {
      setIsCreating(false);
    }
  };

  return (
    <ModalForm
      isOpen={open}
      title={t("createAGlobalTemplate")}
      isProcessing={isCreating}
      Content={
        <Content templateName={templateName} handleChange={handleChange} />
      }
      btn1Title={"Cancel"}
      btn2Title={"Create Global Template"}
      headerCloseBtn={true}
      onClickHeaderCloseBtn={handleClose}
      onClick1={onClick1}
      onClick2={onClick2}
      btn2Disabled={formHasError}
      closeModal={handleClose}
      containerHeight={220}
      containerWidth={450}
    />
  );
};
export default CreateGlobalTaskTemplateModal;

{
  /*Fields, content of the modal */
}
const Content = (props) => {
  const { templateName, handleChange } = props;
  return (
    <>
      <div>
        <Field
          label="Template Name"
          {...templateName}
          required={true}
          width={442}
          onChange={handleChange}
        />
      </div>
    </>
  );
};
