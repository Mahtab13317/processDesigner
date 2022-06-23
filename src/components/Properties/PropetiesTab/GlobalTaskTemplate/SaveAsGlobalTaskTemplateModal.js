import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ModalForm from "./../../../../UI/ModalForm/modalForm";
import Field from "./../../../../UI/InputFields/TextField/Field";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";

import { createInstance } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";
import { ENDPOINT_ADD_GLOBAL_TEMPLATE } from "../../../../Constants/appConstants";
import { useDispatch, useSelector } from "react-redux";
import { ActivityPropertySaveCancelValue } from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked";
import { Typography } from "@material-ui/core";
import { setGlobalTaskTemplates } from "./../../../../redux-store/actions/Properties/globalTaskTemplateAction";

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "4rem",
  },
  note: {
    fontSize: "0.75rem",
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

const SaveAsGlobalTaskTemplateModal = (props) => {
  const [open, setOpen] = useState(props.isOpen ? true : false);
  const dispatch = useDispatch();
  const globalTemplates = useSelector(
    (state) => state.globalTaskTemplate.globalTemplates
  );
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const localActivityPropertyData = store.getState("activityPropertyData");

  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
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

    console.log(localLoadedActivityPropertyData);
    try {
      var res = await axiosInstance.post(`${ENDPOINT_ADD_GLOBAL_TEMPLATE}`, {
        ...localLoadedActivityPropertyData,
        m_strTemplateName: templateName.value,
        m_strStatus: "I",
        processDefId: localLoadedProcessData.ProcessDefId,
        m_bGlobalTemplate: true,
        m_arrTaskTemplateVarList:
          localLoadedActivityPropertyData?.taskGenPropInfo?.taskTemplateInfo
            ?.m_arrTaskTemplateVarList || [],
      });

      if (res.data?.Status === 0) {
        setIsCreating(false);
        handleClose();
        const ids = globalTemplates.map((variable) => +variable.m_iTemplateId);
        const maxId = Math.max(...ids);
        const templateData = {
          taskGenPropInfo: {
            taskTemplateInfo: {
              m_arrTaskTemplateVarList:
                localLoadedActivityPropertyData?.taskGenPropInfo
                  ?.taskTemplateInfo?.m_arrTaskTemplateVarList || [],
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

        dispatch(
          setToastDataFunc({
            message: `${
              res.data.message || templateName.value + " created Succesfully"
            }`,
            severity: "success",
            open: true,
          })
        );
      }
      if (res.data?.Status === -2) {
        setIsCreating(false);
        dispatch(
          setToastDataFunc({
            message: `${res.data.message || "operation failed"}`,
            severity: "error",
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
      title={"Save As Global Template"}
      isProcessing={isCreating}
      Content={
        <Content templateName={templateName} handleChange={handleChange} />
      }
      btn1Title={"Cancel"}
      btn2Title={"Save"}
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
export default SaveAsGlobalTaskTemplateModal;

{
  /*Fields, content of the modal */
}
const Content = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

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
      <div>
        <Typography className={classes.note}>{t("saveGtNote")}</Typography>
      </div>
    </>
  );
};
