import React, { useState, useEffect, useRef } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import "../../Properties.css";
import { useTranslation } from "react-i18next";

import { connect, useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";

import { store, useGlobalState } from "state-pool";
import * as actionCreators from "../../../../redux-store/actions/selectedCellActions";
import * as actionCreatorsDrawer from "../../../../redux-store/actions/Properties/showDrawerAction.js";

import CircularProgress from "@material-ui/core/CircularProgress";
import {
  BASE_URL,
  PROCESSTYPE_LOCAL,
  propertiesLabel,
  SERVER_URL_LAUNCHPAD,
} from "../../../../Constants/appConstants.js";
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import Field from "../../../../UI/InputFields/TextField/Field.js";

import {
  DeleteIcon,
  HorizontalMoreIcon,
} from "../../../../utility/AllImages/AllImages.js";
import ComboValuesModal from "./ComboValuesModal.js";
import FormBuilderModal from "./FormBuilderModal.js";
import PreviewHtmlModal from "./PreviewHtmlModal.js";
import { validateRegex, REGEX } from "../../../../validators/validator";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import {
  createInstance,
  createInstanceWithoutBearer,
} from "../../../../utility/CommonFunctionCall/CommonFunctionCall";
import { getSelectedCellType } from "../../../../utility/abstarctView/getSelectedCellType";
import axios from "axios";
const makeFieldInputs = (value) => {
  return {
    value: value,
    error: false,
    helperText: "",
  };
};
const useStyles = makeStyles((props) => ({
  input: {
    height: "2.0625rem",
  },
  inputWithError: {
    height: "2.0625rem",
    width: "4.875rem",
  },
  errorStatement: {
    color: "red",
    fontSize: "11px",
  },
  mainDiv: {
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    height: "64vh",
    fontFamily: "Open Sans",
    width: "100%",

    direction: props.direction,
    "&::-webkit-scrollbar": {
      backgroundColor: "transparent",
      width: "0.375rem",
      height: "1.125rem",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
      borderRadius: "0.313rem",
    },

    "&:hover::-webkit-scrollbar": {
      overflowY: "visible",
      width: "0.375rem",
      height: "1.125rem",
    },
    "&:hover::-webkit-scrollbar-thumb": {
      background: "#8c8c8c 0% 0% no-repeat padding-box",
      borderRadius: "0.313rem",
    },
  },
  GroupTitleMain: {
    fontWeight: 700,
    color: "#606060",
  },
  btnIcon: {
    cursor: "pointer",
    height: "28px",
    width: "28px",
    border: "1px solid #CECECE",
  },
  GroupTitleSecondary: {
    fontWeight: 600,
    color: "#000000",
  },
  disabled: {
    pointerEvents: "none",
  },
  deleteBtn: {
    marginTop: "1rem",
    width: "1.7rem",
    height: "1.7rem",
  },
  starIcon: {
    color: "#d12c2c",
    padding: "5px",
    marginTop: "-0.5rem",
    marginLeft: "-0.3125rem",
    fontSize: "10px",
  },
  horizontalScrolls: {
    overflowX: "auto",
    overflowY: "hidden",
    display: "grid",
    gap: "1rem",
    gridAutoFlow: "column",
    gridAutoColumns: "174%",
    overscrollBehaviorInline: "contain",
    "&::-webkit-scrollbar": {
      backgroundColor: "transparent",
      width: "1.125rem",
      height: ".375rem",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
      borderRadius: "0.313rem",
    },

    "&:hover::-webkit-scrollbar": {
      overflowX: "visible",
      width: "1.125rem",
      height: ".375rem",
    },
    "&:hover::-webkit-scrollbar-thumb": {
      background: "#8c8c8c 0% 0% no-repeat padding-box",
      borderRadius: "0.313rem",
    },
  },
  trPadding: {
    padding: "1rem",
  },
  tdPadding: {
    padding: ".5rem",
  },
}));
function TaskData(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const fileRef = useRef();

  const classes = useStyles({ ...props, direction });

  const tabStatus = useSelector(ActivityPropertyChangeValue);

  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked
  const localActivityPropertyData = store.getState("activityPropertyData");
  const [
    localLoadedActivityPropertyData,
    setlocalLoadedActivityPropertyData,
    updatelocalLoadedActivityPropertyData,
  ] = useGlobalState(localActivityPropertyData);

  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);

  const [spinner, setspinner] = useState(true);

  const [formType, setFormType] = useState("htmlForm");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [selectedComboVar, setSelectedComboVar] = useState(null);
  const [importedFile, setImportedFile] = useState(null);

  const [taskVariablesList, setTaskVariablesList] = useState([]);

  const [isDisableTab, setisDisableTab] = useState(false);
  const [formHasError, setFormHasError] = useState(false);
  const radioButtonsArrayFormType = [
    { label: `${t("html")} ${t("Form")}`, value: "htmlForm" },
    { label: t("Form"), value: "form" },
  ];

  useEffect(() => {
    if (localLoadedActivityPropertyData) {
      const formView =
        localLoadedActivityPropertyData.taskGenPropInfo?.bTaskFormView || "";
      setFormType(formView ? "form" : "htmlForm");
      const taskDataVars =
        localLoadedActivityPropertyData.taskGenPropInfo?.taskTemplateInfo
          ?.m_arrTaskTemplateVarList || [];
      //keeping error object in every variable so that we can easily validate and show error
      setTaskVariablesList(
        [...taskDataVars].map((item) => ({
          ...item,
          error: { VariableName: "", DisplayName: "" },
        }))
      );

      setspinner(false);
    }
  }, [localLoadedActivityPropertyData]);
  useEffect(() => {
    if (localLoadedProcessData.ProcessType !== PROCESSTYPE_LOCAL) {
      setisDisableTab(true);
    }
  }, [localLoadedProcessData.ProcessType]);

  const updateTaskTemplateVar = (taskVarList) => {
    const tempTaskProp = { ...localLoadedActivityPropertyData };
    const err = false;
    taskVarList.forEach((item) => {
      if (item.error?.VariableName || item.error?.DisplayName) {
        err = true;
      }
    });
    if (!err) {
      tempTaskProp.taskGenPropInfo.taskTemplateInfo.m_arrTaskTemplateVarList =
        taskVarList.map((item) => {
          const newItem = { ...item };
          if (newItem.error) {
            delete newItem.error;
          }
          if (formType === "form") {
            newItem.m_strDisplayName = "";
          }
          return newItem;
        });
      setlocalLoadedActivityPropertyData(tempTaskProp);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const tempTaskProp = { ...localLoadedActivityPropertyData };

    switch (name) {
      case "FormType":
        localLoadedActivityPropertyData.taskGenPropInfo.bTaskFormView =
          value === "form" ? true : false;
        break;
      default:
        break;
    }
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskData]: {
          isModified: true,
          hasError: false,
        },
      })
    );
    setlocalLoadedActivityPropertyData(tempTaskProp);
  };
  const importTaskForm = async (file) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("statusFlag", "P");

    formData.append("processDefId", localLoadedProcessData?.ProcessDefId);

    formData.append("taskId", props.cellID);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/taskform/`,
        formData,
        config
      );

      if (response.status === 200) {
        dispatch(
          setToastDataFunc({
            message: response?.data?.message || "Form imported successfully",
            severity: "success",
            open: true,
          })
        );
      }
    } catch (err) {}
  };
  const importTaskTemplateForm = async (file) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("statusflag", "P");
    formData.append("templatename", props.cellName);
    formData.append("templateid", props.cellID);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/tasktemplateform/`,
        formData,
        config
      );

      if (response.status === 200) {
        dispatch(
          setToastDataFunc({
            message: response?.data?.message || "Form imported successfully",
            severity: "success",
            open: true,
          })
        );
      }
    } catch (err) {}
  };

  const handleImportForm = async (e) => {
    const file = e.target.files[0];

    setImportedFile(file);
    if (file) {
      if (props.cellType === getSelectedCellType("TASK")) {
        importTaskForm(file);
      } else if (props.cellType === getSelectedCellType("TASKTEMPLATE")) {
        importTaskTemplateForm(file);
      }
    }
  };

  const handleChangeVariable = (index, name, value) => {
    const newVar = taskVariablesList[index];
    const newVars = [...taskVariablesList];
    newVar[name] = value;
    newVar["error"] = { VariableName: "", DisplayName: "" };
    let varErr = "";
    let disErr = "";
    if (name === "m_strVariableName") {
      if (value) {
        varErr = validateProperties(value)
          ? `${t("startAlphaNumWithOnlyUnderscore")}`
          : "";
        newVar["error"]["VariableName"] = varErr;
      } else {
        newVar["error"]["VariableName"] = t("variableNameEmptyError");
      }
    } else if (name === "m_strDisplayName") {
      if (value) {
        disErr = validateProperties(value)
          ? `${t("startAlphaNumWithOnlyUnderscore")}`
          : "";
        newVar["error"]["DisplayName"] = disErr;
      } else {
        newVar["error"]["DisplayName"] = t("displayNameEmptyError");
      }
    }
    newVars.splice(index, 1, newVar);

    //  if (!varErr && !disErr) {
    updateTaskTemplateVar(newVars);
    //setTaskVariablesList(newVars);
    //} else {
    //setTaskVariablesList(newVars);
    //}
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskData]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };
  const handlePreviewHtml = () => {
    setIsPreviewModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };
  const handleCloseComboModal = () => {
    setIsComboModalOpen(false);
    setSelectedComboVar(null);
  };

  const handleDelete = (index) => {
    let newVars = [...taskVariablesList];
    newVars.splice(index, 1);
    setTaskVariablesList(newVars);
    updateTaskTemplateVar(newVars);
  };
  const addVariable = () => {
    props.expandDrawer(true);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskData]: {
          isModified: true,
          hasError: false,
        },
      })
    );

    const newVars = [...taskVariablesList];
    const ids = newVars.map((variable) => +variable.m_iOrderId);
    const maxId = Math.max(...ids);

    const newVar = {
      m_bSelectVariable: false,
      m_strVariableName: "",
      m_strDisplayName: "",
      m_strVariableType: 10,
      m_iTemplateId: -1,
      m_iControlType: 1,
      m_strControlType: "",
      m_iOrderId: `${maxId + 1}`,
      m_strVarType: null,
      m_bRenderControl: false,
      m_arrComboPickList: [],
      m_strMappedVariable: "",
      m_arrPopulateProcVars: [],
      m_bReadOnly: false,
      m_iTempVarId: `${maxId + 1}`,
      m_strTaskDynamicQuery: "",
      m_strDBLinking: "N",
      m_bMandatory: false,
      m_strVarStatus: "",
      m_strShortVarName: "",
      m_strShortDispName: "",
      m_bDisableChkbox: false,
    };

    setTaskVariablesList([newVar, ...newVars]);
  };

  const handleFormLauncher = () => {
    setIsModalOpen(true);
  };
  const handleComboValues = (index) => {
    setSelectedComboVar(taskVariablesList[index]);
    setIsComboModalOpen(true);
  };
  const handleSaveComboVal = (newComboVar) => {
    const newTaskVars = [...taskVariablesList];

    const comboIndex = taskVariablesList.findIndex(
      (variable) => variable.m_iOrderId === newComboVar.m_iOrderId
    );
    if (comboIndex !== -1) {
      newTaskVars.splice(comboIndex, 1, newComboVar);
    }
    setTaskVariablesList(newTaskVars);
    updateTaskTemplateVar(newTaskVars);
    setSelectedComboVar(null);
    setIsComboModalOpen(false);
  };

  const validateFields = () => {
    if (taskVariablesList.length === 0) {
      dispatch(
        setToastDataFunc({
          message: `${t("defineAtleastOneTaskVarError")}`,
          severity: "error",
          open: true,
        })
      );
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.taskData]: {
            isModified: true,
            hasError: true,
          },
        })
      );
      return false;
    } else {
      const newTaskVariableErrors = []; //errors list
      let hasErrorFlag = false;
      taskVariablesList.forEach((taskVar) => {
        const newJson = { VariableName: "", DisplayName: "" };
        const VariableNameError =
          taskVar.m_strVariableName?.trim().length === 0
            ? `${t("variableNameEmptyError")}`
            : validateProperties(taskVar.m_strVariableName)
            ? `${t("startAlphaNumWithOnlyUnderscore")}`
            : "";
        let DisplayNameError = "";
        if (formType === "htmlForm") {
          DisplayNameError =
            taskVar.m_strDisplayName.trim().length === 0
              ? `${t("displayNameEmptyError")}`
              : validateProperties(taskVar.m_strDisplayName)
              ? `${t("startAlphaNumWithOnlyUnderscore")}`
              : "";
          newJson["DisplayName"] = DisplayNameError;
        }
        if (VariableNameError || DisplayNameError) {
          hasErrorFlag = true;
        }
        newJson["VariableName"] = VariableNameError;

        const newTaskVar = { ...taskVar, error: newJson };
        newTaskVariableErrors.push(newTaskVar);
      });
      if (hasErrorFlag) {
        setTaskVariablesList([...newTaskVariableErrors]);
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.taskData]: {
              isModified: true,
              hasError: true,
            },
          })
        );
      }
      return hasErrorFlag ? false : true; //if it has errors the validateFields will be false
    }
  };

  const validateProperties = (val) => {
    return validateRegex(val, REGEX.StartWithAlphaThenAlphaNumAndOnlyUs)
      ? false
      : true;
  };

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      if (!validateFields()) {
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.taskData]: {
              isModified: true,
              hasError: true,
            },
          })
        );
      }

      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {spinner ? (
        <CircularProgress style={{ marginTop: "30vh", marginLeft: "40%" }} />
      ) : (
        <div
          className={classes.mainDiv}
          style={{
            flexDirection: props.isDrawerExpanded ? "row" : "column",
          }}
        >
          <div
            style={{
              marginLeft: "0.8rem",
              marginRight: "0.8rem",
              height: "100%",

              marginBottom: "0.9rem",
              width: props.isDrawerExpanded ? "75%" : null,
              paddingTop: props.isDrawerExpanded ? "0.6rem" : "0.2rem",
            }}
          >
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography component="h5" className={classes.GroupTitleMain}>
                  {`${t("data")}`.toUpperCase()}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container>
                  <Grid item>
                    <Field
                      radio={true}
                      ButtonsArray={radioButtonsArrayFormType}
                      name="FormType"
                      label={`${t("Form")} ${t("type")}`}
                      value={formType}
                      onChange={handleChange}
                    />
                  </Grid>

                  {formType === "htmlForm" ? (
                    <Grid
                      item
                      style={{
                        marginLeft: props.isDrawerExpanded ? null : "auto",
                        paddingRight: props.isDrawerExpanded
                          ? "0.2rem"
                          : "1.7rem",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handlePreviewHtml()}
                        style={{ marginTop: "1.2rem" }}
                      >
                        {`${t("preview")} ${t("html")} ${t("Form")}`}
                      </Button>
                    </Grid>
                  ) : (
                    <Grid item>
                      <Grid container spacing={1}>
                        <Grid item>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => fileRef?.current?.click()}
                            style={{ marginTop: "1.2rem" }}
                          >
                            {`${t("import")} ${t("from")} ${t("system")}`}
                          </Button>
                        </Grid>
                        <input
                          name="inputFile"
                          id="inputFile"
                          ref={fileRef}
                          onChange={handleImportForm}
                          type="file"
                          hidden
                        />
                        <Grid item>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleFormLauncher()}
                            style={{ marginTop: "1.2rem" }}
                          >
                            {`${t("add")} ${t("new")} ${t("Form")}`}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Grid item container xs={props.isDrawerExpanded ? 10 : 12}>
                <Grid item>
                  <Typography
                    component="h5"
                    className={classes.GroupTitleSecondary}
                  >
                    {`${t("variable")} ${t("definition")}`}
                  </Typography>
                </Grid>
                <span className={classes.starIcon}>★</span>
                <Grid
                  item
                  style={{
                    marginLeft: "auto",
                    paddingRight: props.isDrawerExpanded ? "0.2rem" : "1.2rem",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    fontW
                    onClick={() => addVariable()}
                  >
                    {`+ ${t("add")} ${t("variable")}`}
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {!props.isDrawerExpanded ? (
              <div className={classes.horizontalScrolls}>
                <table style={{ marginRight: "-2rem" }}>
                  {taskVariablesList.map((taskVar, index) => {
                    return (
                      <tr className={classes.trPadding} key={index}>
                        <td className={classes.tdPadding}>
                          <Field
                            name="m_strVariableName"
                            label={`${t("variable")} ${t("name")}`}
                            value={taskVar.m_strVariableName}
                            onChange={(e) =>
                              handleChangeVariable(
                                index,
                                e.target.name,
                                e.target.value
                              )
                            }
                            error={taskVar.error?.VariableName ? true : false}
                            helperText={taskVar.error?.VariableName || ""}
                          />
                        </td>
                        <td className={classes.tdPadding}>
                          <Field
                            dropdown={true}
                            name="m_strVariableType"
                            label={`${t("variable")} ${t("type")}`}
                            value={taskVar.m_strVariableType}
                            onChange={(e) =>
                              handleChangeVariable(
                                index,
                                e.target.name,
                                e.target.value
                              )
                            }
                            options={[
                              { name: "Text", value: 10 },
                              { name: "Float", value: 6 },
                              { name: "Integer", value: 3 },
                              { name: "Long", value: 4 },
                              { name: "Date", value: 8 },
                            ]}
                          />
                        </td>

                        <td className={classes.tdPadding}>
                          <Field
                            name="m_strDisplayName"
                            disabled={formType === "form"}
                            label={`${t("display")} ${t("name")}`}
                            value={taskVar.m_strDisplayName}
                            onChange={(e) =>
                              handleChangeVariable(
                                index,
                                e.target.name,
                                e.target.value
                              )
                            }
                            error={taskVar.error?.DisplayName ? true : false}
                            helperText={
                              (formType === "htmlForm" &&
                                taskVar.error?.DisplayName) ||
                              ""
                            }
                          />
                        </td>

                        <td className={classes.tdPadding}>
                          <Field
                            name="m_iControlType"
                            disabled={formType === "form"}
                            label={`${t("ControlType")}`}
                            dropdown={true}
                            value={taskVar.m_iControlType}
                            onChange={(e) =>
                              handleChangeVariable(
                                index,
                                e.target.name,
                                e.target.value
                              )
                            }
                            options={[
                              { name: `${t("text")}`, value: 1 },
                              { name: `${t("textArea")}`, value: 2 },
                              { name: `${t("comboBox")}`, value: 3 },
                            ]}
                          />
                        </td>

                        {taskVar.m_iControlType === 3 && (
                          <td
                            className={classes.tdPadding}
                            onClick={() => handleComboValues(index)}
                          >
                            <HorizontalMoreIcon
                              className={classes.deleteBtn}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </td>
                        )}
                        <td
                          className={classes.tdPadding}
                          onClick={() => handleDelete(index)}
                        >
                          <DeleteIcon
                            className={classes.deleteBtn}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            ) : (
              <Grid container direction="column" spacing={2}>
                <Grid item xs>
                  <Grid container direction={"row"} spacing={1}>
                    {taskVariablesList.map((taskVar, index) => {
                      return (
                        <Grid container spacing={1} key={index}>
                          <Grid item xs={3}>
                            <Field
                              name="m_strVariableName"
                              label={`${t("variable")} ${t("name")}`}
                              value={taskVar.m_strVariableName}
                              onChange={(e) =>
                                handleChangeVariable(
                                  index,
                                  e.target.name,
                                  e.target.value
                                )
                              }
                              error={taskVar.error?.VariableName ? true : false}
                              helperText={taskVar.error?.VariableName || ""}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <Field
                              dropdown={true}
                              name="m_strVariableType"
                              label={`${t("variable")} ${t("type")}`}
                              value={taskVar.m_strVariableType}
                              onChange={(e) =>
                                handleChangeVariable(
                                  index,
                                  e.target.name,
                                  e.target.value
                                )
                              }
                              options={[
                                { name: "Text", value: 10 },
                                { name: "Float", value: 6 },
                                { name: "Integer", value: 3 },
                                { name: "Long", value: 4 },
                                { name: "Date", value: 8 },
                              ]}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <Field
                              name="m_strDisplayName"
                              disabled={formType === "form"}
                              label={`${t("display")} ${t("name")}`}
                              value={taskVar.m_strDisplayName}
                              onChange={(e) =>
                                handleChangeVariable(
                                  index,
                                  e.target.name,
                                  e.target.value
                                )
                              }
                              error={taskVar.error?.DisplayName ? true : false}
                              helperText={
                                (formType === "htmlForm" &&
                                  taskVar.error?.DisplayName) ||
                                ""
                              }
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <Field
                              name="m_iControlType"
                              disabled={formType === "form"}
                              label={`${t("ControlType")}`}
                              dropdown={true}
                              value={taskVar.m_iControlType}
                              onChange={(e) =>
                                handleChangeVariable(
                                  index,
                                  e.target.name,
                                  e.target.value
                                )
                              }
                              options={[
                                { name: `${t("text")}`, value: 1 },
                                { name: `${t("textArea")}`, value: 2 },
                                { name: `${t("comboBox")}`, value: 3 },
                              ]}
                            />
                          </Grid>
                          {taskVar.m_iControlType === 3 && (
                            <Grid item onClick={() => handleComboValues(index)}>
                              <HorizontalMoreIcon
                                className={classes.deleteBtn}
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            </Grid>
                          )}
                          <Grid item onClick={() => handleDelete(index)}>
                            <DeleteIcon
                              className={classes.deleteBtn}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              </Grid>
            )}
          </div>

          {isModalOpen && (
            <FormBuilderModal
              isOpen={isModalOpen}
              localLoadedProcessData={localLoadedProcessData}
              cellID={props.cellID}
              cellType={props.cellType}
              handleClose={handleCloseModal}
            />
          )}
          {isPreviewModalOpen && (
            <PreviewHtmlModal
              isOpen={isPreviewModalOpen}
              taskVariablesList={taskVariablesList}
              handleClose={handleClosePreviewModal}
            />
          )}
          {isComboModalOpen && (
            <ComboValuesModal
              isOpen={isComboModalOpen}
              editedComboVar={selectedComboVar}
              handleClose={handleCloseComboModal}
              saveComboVal={handleSaveComboVal}
            />
          )}
        </div>
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectedCell: (
      id,
      name,
      activityType,
      activitySubType,
      seqId,
      queueId,
      type
    ) =>
      dispatch(
        actionCreators.selectedCell(
          id,
          name,
          activityType,
          activitySubType,
          seqId,
          queueId,
          type
        )
      ),
    expandDrawer: (flag) => dispatch(actionCreatorsDrawer.expandDrawer(flag)),
  };
};

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TaskData);
