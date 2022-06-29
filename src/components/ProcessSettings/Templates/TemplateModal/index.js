import React, { useEffect, useState } from "react";
import styles from "../index.module.css";
import clsx from "clsx";
import { Divider, MenuItem } from "@material-ui/core";
import { Close } from "@material-ui/icons/";
import { useTranslation } from "react-i18next";
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";
import axios from "axios";
import { connect, useDispatch } from "react-redux";
import {
  SERVER_URL,
  ENDPOINT_GET_REGISTER_TEMPLATE,
  CONFIG,
} from "../../../../Constants/appConstants";
import { store, useGlobalState } from "state-pool";
import MultiSelect from "../../../../UI/MultiSelect";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";

function TemplateModal(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedProcess] = useGlobalState("variableDefinition");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [selectedTool, setSelectedTool] = useState("");
  const [toolsList, setToolsList] = useState([]);
  const [configData, setConfigData] = useState([]);
  const [selectedInputFormat, setselectedInputFormat] = useState("");
  const [fileName, setfileName] = useState("");
  const [selectedDoctype, setselectedDoctype] = useState("");
  const [selectedOutput, setselectedOutput] = useState("");
  const [selectedDateFormat, setselectedDateFormat] = useState("");
  const [argumentStatement, setargumentstatement] = useState("");
  const [docList, setdocList] = useState([]);
  const [argumentList, setargumentList] = useState([]);
  const [selectedVariableList, setselectedVariableList] = useState([]);
  const [selectedInputFormatList, setSelectedInputFormatList] = useState([]);
  const [selectedOutputFormatList, setSelectedOutputFormatList] = useState([]);
  const [selectedFile, setselectedFile] = useState();
  const [dateList, setdateList] = useState([
    "dd/MMM/yyyy",
    "yyyy-MM-dd",
    "M/d/yyyy",
    "M/d/yy",
    "MM/dd/yy",
    "MM/dd/yyyy",
    "yy/MM/dd",
    "yyyy-MM-dd",
    "dd-MMM-yy",
    "dddd,MMMM dd,yyyy",
    "MMMMM dd yy",
    "dddd,dd MMMMM,yyyy",
    "dd MMMMM, yyyy",
    "dd-MM-yyyy",
    "dd/MM/yyyy",
  ]);
  const dispatch = useDispatch();
  const [selectedTemplateName, setselectedTemplateName] = useState("");

  useEffect(() => {
    if (props.selected) {
      setselectedDateFormat(props.selected.templateDateFormat);
      setselectedDoctype(props.selected.docName);
      setselectedOutput(props.selected.templateType);
      setselectedInputFormat(props.selected.templateInputFormat);
      setargumentstatement(props.selected.templateArgument);
    }
  }, [props.selected]);

  useEffect(() => {
    if (selectedFile) {
      const checkType = selectedFile?.name.split(".");
      if (checkType[checkType?.length - 1] == selectedInputFormat) {
        setselectedTemplateName(selectedFile?.name);
      } else {
        setselectedFile(null);
        dispatch(
          setToastDataFunc({
            message: t("docExtenionError"),
            severity: "error",
            open: true,
          })
        );
      }
    }
  }, [selectedFile?.name, selectedInputFormat]);

  const menuProps = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    style: {
      maxHeight: 400,
    },
    getContentAnchorEl: null,
  };

  const uploadFile = (e) => {
    setselectedFile(e.target.files[0]);
  };

  useEffect(() => {
    let statement = "";
    if (selectedVariableList.length > 0) {
      selectedVariableList.map((el) => {
        return (statement = statement + "&" + el.VariableName + "&");
      });
    }
    setargumentstatement(statement);
  }, [selectedVariableList]);

  useEffect(() => {
    let temp = [];
    localLoadedProcessData &&
      localLoadedProcessData.DocumentTypeList.forEach((el) => {
        temp.push(el.DocName);
      });

    setdocList(temp);

    let newArr = [];
    localLoadedProcessData.Variable.map((el) => {
      return newArr.push(el);
    });
    setargumentList(newArr);
  }, []);

  useEffect(() => {
    axios
      .get(SERVER_URL + ENDPOINT_GET_REGISTER_TEMPLATE + CONFIG)
      .then((res) => {
        setConfigData(res.data.ToolDetails.ToolDetail);
        if (res.data.Status === 0) {
          setConfigData(res.data);
        }
      });
  }, []);

  useEffect(() => {
    if (configData) {
      let listOfTools = [];
      configData &&
        configData.forEach((element) => {
          listOfTools.push(element.Tool);
        });
      setToolsList(listOfTools);
    }
  }, [configData]);

  const toolselectorHandler = (event) => {
    setSelectedTool(event.target.value);

    let InputFormatList = [];

    configData &&
      configData.forEach((element) => {
        if (element.Tool === event.target.value) {
          element.SupportedSet?.forEach((el) => {
            if (!InputFormatList.includes(el.InputFormat)) {
              InputFormatList.push(el.InputFormat);
            }
          });
        }
      });

    setSelectedInputFormatList(InputFormatList);
  };

  const documentSelectHandler = (event) => {
    setselectedDoctype(event.target.value);

    if (selectedTool == "") {
      dispatch(
        setToastDataFunc({
          message: t("toolTemplateError"),
          severity: "error",
          open: true,
        })
      );
    }

    if (selectedInputFormat == "") {
      dispatch(
        setToastDataFunc({
          message: t("docTemplateError"),
          severity: "error",
          open: true,
        })
      );
    }
  };

  const registerHandler = async () => {
    if (selectedDoctype == "") {
      dispatch(
        setToastDataFunc({
          message: t("slectFileError"),
          severity: "error",
          open: true,
        })
      );
    }

    if (selectedOutput == "") {
      dispatch(
        setToastDataFunc({
          message: t("outputfomatError"),
          severity: "error",
          open: true,
        })
      );
    } else {
      let payload = {
        templateType: selectedDoctype,
        templateArgument: argumentStatement,
        templateFormat: selectedOutput,
        templateInputFormat: selectedInputFormat,
        templateDateFormat: selectedDateFormat,
        templateTool: selectedTool,
        docName: selectedFile?.name.split(".").slice(0, -1).join("."),
      };
      const formData = new FormData();
      formData.append("docFile", selectedFile);
      formData.append(
        "registerTemplateInfo",
        new Blob([JSON.stringify(payload)], {
          type: "application/json",
        })
      );
      try {
        const response = await axios({
          method: "post",
          url: "/pmweb/registerTemplate",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            // type: "application/json",
          },
        });
        if (response) {
          props.setTemplateData((prev) => {
            let temp = [...prev];
            temp.push({
              ...response.data,
              docName: selectedFile?.name.split(".").slice(0, -1).join("."),
            });
            return temp;
          });
          dispatch(
            setToastDataFunc({
              message: "Template registered successfully",
              severity: "success",
              open: true,
            })
          );
          props.setIsModalOpen(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleInputFormatChange = (e) => {
    setselectedInputFormat(e.target.value);
    let outputFormat = [];
    configData?.forEach((el) => {
      if (el?.Tool === selectedTool) {
        el.SupportedSet?.forEach((data) => {
          if (data.InputFormat === e.target.value) {
            outputFormat.push(data.OutputFormat);
          }
        });
      }
    });
    setSelectedOutputFormatList(outputFormat);
  };

  return (
    <div>
      <div className={clsx(styles.flexRow, styles.modalHeadingDiv)}>
        <p className={styles.modalHeading}>{t("registerTemplate")}</p>
        <Close
          className={styles.closeIcon}
          onClick={() => props.setIsModalOpen(false)}
          fontSize="small"
        />
      </div>
      <Divider className={styles.modalDivider} />
      <div className="row">
        <div>
          <p className={styles.labelTittle}>
            {t("tools")} <span style={{ color: "red" }}>*</span>
          </p>
          <CustomizedDropdown
            id="RT_Tools_Dropdown"
            // disabled={isProcessReadOnly || disabled}
            // className={
            //   direction === RTL_DIRECTION
            //     ? arabicStyles.dropdown
            //     : styles.dropdown
            // }
            value={selectedTool}
            onChange={(event) => toolselectorHandler(event)}
            // validationBoolean={checkValidation}
            // validationBooleanSetterFunc={setCheckValidation}
            // showAllErrorsSetterFunc={setDoesSelectedRuleHaveErrors}
            className={styles.dropdown}
            MenuProps={menuProps}
          >
            {toolsList &&
              toolsList.map((element) => {
                return (
                  <MenuItem
                    className={styles.menuItemStyles}
                    key={element}
                    value={element}
                  >
                    {element}
                  </MenuItem>
                );
              })}
          </CustomizedDropdown>
        </div>

        <div>
          <p className={styles.labelTittle}>
            {t("inputFormat")} <span style={{ color: "red" }}>*</span>
          </p>
          <CustomizedDropdown
            id="RT_Input_Dropdown"
            value={selectedInputFormat}
            onChange={(event) => handleInputFormatChange(event)}
            className={styles.dropdown}
            MenuProps={menuProps}
          >
            {selectedInputFormatList &&
              selectedInputFormatList.map((element) => {
                return (
                  <MenuItem
                    className={styles.menuItemStyles}
                    key={element}
                    value={element}
                  >
                    {element}
                  </MenuItem>
                );
              })}
          </CustomizedDropdown>
        </div>
      </div>

      <div className="" style={{ marginTop: "3%" }}>
        <div>
          <p className={styles.labelTittle}>
            {t("fileName")} <span style={{ color: "red" }}>*</span>
          </p>
        </div>

        <div className="row">
          <div
            style={{
              width: "65%",
              height: "1.5625rem",
              marginBottom: "10px",
              background: "#F8F8F8 0% 0% no-repeat padding-box",
              border: "1px solid #CECECE",
              borderRadius: "2px",
              paddingLeft: "5px",
              opacity: "1",
              marginRight: "5px",
              // backgroundColor: "red",
            }}
          >
            <input
              id="add_sectionName"
              onChange={(e) => setselectedTemplateName(e.target.value)}
              style={{
                textAlign: "left",
                opacity: "1",
                fontSize: "0.8rem",
                fontWeight: "400",
                width: "100%",
                border: "none",
              }}
              value={selectedTemplateName}
            />
          </div>
          <form>
            <label
              style={{
                fontSize: "0.8rem",
                border: "1px solid #0072C6",
                height: "1.5625rem",
                width: "5.2rem",
                whiteSpace: "nowrap",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                color: "#0072C6",
                fontWeight: "500",
                cursor: "pointer",
                marginTop: "-10px",
              }}
            >
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(e) => uploadFile(e)}
              />
              {t("Choose File")}
            </label>
          </form>
        </div>
      </div>

      <div className="row">
        <div>
          <p className={styles.labelTittle}>
            {t("DocType")} <span style={{ color: "red" }}>*</span>
          </p>
          <CustomizedDropdown
            id="RT_DocType_Dropdown"
            value={selectedDoctype}
            onChange={(event) => documentSelectHandler(event)}
            className={styles.dropdown}
            MenuProps={menuProps}
          >
            {docList &&
              docList.map((element) => {
                return (
                  <MenuItem
                    className={styles.menuItemStyles}
                    key={element}
                    value={element}
                  >
                    {element}
                  </MenuItem>
                );
              })}
          </CustomizedDropdown>
        </div>

        <div>
          <p className={styles.labelTittle}>
            {t("outputFormat")} <span style={{ color: "red" }}>*</span>
          </p>
          <CustomizedDropdown
            id="RT_Output_Dropdown"
            value={selectedOutput}
            onChange={(event) => setselectedOutput(event.target.value)}
            className={styles.dropdown}
            MenuProps={menuProps}
          >
            {selectedOutputFormatList &&
              selectedOutputFormatList.map((element) => {
                return (
                  <MenuItem
                    className={styles.menuItemStyles}
                    key={element}
                    value={element}
                  >
                    {element}
                  </MenuItem>
                );
              })}
          </CustomizedDropdown>
        </div>
      </div>

      <div>
        <p className={styles.labelTittle}>{t("dateFormat")}</p>
        <CustomizedDropdown
          id="RT_Tools_Dropdown"
          value={selectedDateFormat}
          onChange={(event) => setselectedDateFormat(event.target.value)}
          className={styles.dropdown}
          MenuProps={menuProps}
        >
          {dateList &&
            dateList.map((element) => {
              return (
                <MenuItem
                  className={styles.menuItemStyles}
                  key={element}
                  value={element}
                >
                  {element}
                </MenuItem>
              );
            })}
        </CustomizedDropdown>
      </div>

      <div>
        <p className={styles.labelTittle}>
          {t("arguments")} <span style={{ color: "red" }}>*</span>
        </p>

        <MultiSelect
          completeList={argumentList}
          labelKey="VariableName"
          indexKey="VariableId"
          associatedList={selectedVariableList}
          handleAssociatedList={(val) => {
            setselectedVariableList(val);
          }}
          showSelectedCount={true}
          // noDataLabel={t("noWorksteps")}
          // disabled={readOnlyProcess}
          // id="trigger_ccwi_workstepMultiSelect"
        />
      </div>
      <div>
        <textarea
          style={{
            width: "100%",
            height: "7rem",
            marginTop: "5px",
            border: "1px solid #c4c4c4",
          }}
          value={argumentStatement}
        />
      </div>

      <div className={styles.footer}>
        <button className="cancel" onClick={() => props.setIsModalOpen(false)}>
          {t("cancel")}
        </button>
        <button
          className="create"
          style={{ marginRight: "10px" }}
          onClick={registerHandler}
        >
          {t("register")}
        </button>
      </div>
    </div>
  );
}

export default TemplateModal;
