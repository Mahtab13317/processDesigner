import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@material-ui/core";
import styles from "./ImportExportProcess.module.css";
import CloseIcon from "@material-ui/icons/Close";
import { Select, MenuItem } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ProjectCreation from "../ProcessesView/Projects/ProjectCreation";
import Modal from "../../../UI/Modal/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  ImportExportSliceValue,
  setImportExportVal,
} from "../../../redux-store/slices/ImportExportSlice";
import {
  CONST_BPEL,
  CONST_BPMN,
  CONST_XML,
  CONST_XPDI,
} from "../../../Constants/appConstants";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useGlobalState } from "state-pool";
import * as actionCreators from "../../../redux-store/actions/processView/actions.js";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

function ImportExportProcess(props) {
  const ProjectValue = useSelector(ImportExportSliceValue);
  const [selectedProcessName, setselectedProcessName] = useState("");
  const dispatch = useDispatch();
  const { setAction, processName, typeImportorExport } = props;
  const [selectedFile, setselectedFile] = useState();
  const [localLoadedProcessData] = useGlobalState("loadedProcessData");
  const [errorObj, seterrorObj] = useState({
    importType: "",
    processName: "",
    projectName: "",
  });

  useEffect(() => {
    if (selectedProcessName === "") {
      seterrorObj((prev) => {
        let temp = { ...prev };
        temp.processName = "Please enter a valid Process Name";
        return temp;
      });
    } else {
      seterrorObj((prev) => {
        let temp = { ...prev };
        temp.processName = "";
        return temp;
      });
    }
  }, [selectedProcessName]);

  const uploadFile = (e) => {
    if (e.target.files[0].type === "application/x-zip-compressed") {
      setselectedFile(e.target.files[0]);
      seterrorObj((prev) => {
        let temp = { ...prev };
        temp.importType = "";
        return temp;
      });
    } else
      seterrorObj((prev) => {
        let temp = { ...prev };
        temp.importType = "Please upload only .zip files";
        return temp;
      });
  };

  useEffect(() => {
    setselectedProcessName(
      selectedFile?.name.split(".").slice(0, -1).join(".")
    );
  }, [selectedFile?.name]);
  useEffect(() => {
    if (localLoadedProcessData?.ProcessDefId)
      setselectedProcessName(localLoadedProcessData.ProcessName);
  }, [localLoadedProcessData?.ProcessDefId]);

  const closeHandler = () => {
    dispatch(setImportExportVal({ ProjectName: null, Type: null }));

    setAction();
  };

  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let history = useHistory();
  const [selectedProject, setselectedProject] = useState("none");
  const [processCreationModal, setprocessCreationModal] = useState(false);
  const [exportType, setexportType] = useState("xml");
  const [importType, setimportType] = useState("xml");
  const [disableImport, setdisableImport] = useState(false);
  const [showErrorsBool, setshowErrorsBool] = useState(false);

  useEffect(() => {
    if (selectedProject === "none") {
      seterrorObj((prev) => {
        let temp = { ...prev };
        temp.projectName = "Please select a Project";
        return temp;
      });
    } else
      seterrorObj((prev) => {
        let temp = { ...prev };
        temp.projectName = "";
        return temp;
      });
  }, [selectedProject]);

  const projectDropdownHandler = (val) => {
    if (val === "addNewProject") {
      setprocessCreationModal(true);
    }

    setselectedProject(val);
  };

  const modalRef = useRef(null);
  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        dispatch(setImportExportVal({ ProjectName: null, Type: null }));
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const StyledLabel = withStyles({
    label: {
      color: "#606060",
      fontSize: "0.8rem",
      fontWeight: "500",
    },
  })(FormControlLabel);

  const getProjectIdFromName = (name) => {
    let temp;
    ProjectValue.ProjectList.forEach((project) => {
      if (project.ProjectName === name) {
        temp = project.ProjectId;
      }
    });
    return temp;
  };

  const getProjectNameFromId = (id) => {
    let temp;
    ProjectValue.ProjectList.forEach((project) => {
      if (project.ProjectId === id) {
        temp = project.ProjectName;
      }
    });
    return temp;
  };

  React.useEffect(() => {
    if (ProjectValue?.ProjectName) {
      setselectedProject(
        getProjectIdFromName(ProjectValue?.ProjectName.ProjectName)
      );
    }
  }, [ProjectValue?.ProjectName]);
  const importTypeAbbvr = (data) => {
    if (data === "xml") return "N";
    else if (data === "xpdl") return "X";
    else if (data === "bpmn") return "B";
    else return "BP";
  };

  // useEffect(() => {
  //   if (
  //     selectedProcessName !== "" &&
  //     selectedProject !== undefined &&
  //     (ProjectValue?.ProjectName?.ProjectName ||
  //       getProjectNameFromId(selectedProject)) &&
  //     selectedFile !== undefined
  //   ) {
  //     setdisableImport(false);
  //   } else {
  //     setdisableImport(true);
  //   }
  // }, [
  //   ProjectValue?.ProjectName?.ProjectName,
  //   selectedFile,
  //   selectedProcessName,
  //   selectedProject,
  // ]);

  const handleSubmit = async (
    event,
    isOverwrite,
    isNewVersion,
    openProcessFlag
  ) => {
    event.preventDefault();
    if (
      errorObj.importType === "" &&
      errorObj.processName === "" &&
      errorObj.projectName === ""
    ) {
      let payload = {
        processName: selectedProcessName,
        projectId: selectedProject,
        projectName:
          ProjectValue?.ProjectName?.ProjectName ||
          getProjectNameFromId(selectedProject),
        processMode: "L",
        qGrpAssoc: "N",
        overwrite: false,
        newVersion: false,
        checkoutProcess: selectedProcessName,
        importedName: selectedFile?.name.split(".").slice(0, -1).join("."),
        importType: importTypeAbbvr(importType),
      };
      if (props.showOverwrite && isOverwrite) {
        payload = { ...payload, overwrite: true };
        payload = {
          ...payload,
          processDefId: localLoadedProcessData.ProcessDefId,
        };
      }
      if (props.showOverwrite && isNewVersion) {
        payload = { ...payload, newVersion: true };
        payload = {
          ...payload,
          processDefId: localLoadedProcessData.ProcessDefId,
        };
      }
      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append(
        "processInfo",
        new Blob([JSON.stringify(payload)], {
          type: "application/json",
        })
      );
      console.log("llllllllllll", selectedFile, payload);
      try {
        const response = await axios({
          method: "post",
          url: "/pmweb/importProcess",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            // type: "application/json",
          },
        });
        if (response?.data?.Status) {
          setAction(null);

          if (openProcessFlag) {
            props.openProcessClick(
              response.data.Process.ProcessDefId,
              response.data.Project.ProjectName,
              "L",
              "1.0",
              response.data.Process.ProcessName
            );
            history.push("/process");
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setshowErrorsBool(true);
    }
  };

  const exportHandler = () => {
    let payload = {
      processDefId: localLoadedProcessData.ProcessDefId,
      processName: localLoadedProcessData.ProcessName,
      projectId: localLoadedProcessData.ProjectId,
      projectName: localLoadedProcessData.ProjectName,
      processMode: localLoadedProcessData.ProcessType,
      qGrpAssoc: "N",
      exportFormat: importTypeAbbvr(exportType),
    };

    axios({
      url: "/pmweb/exportProcess", //your url
      method: "POST",
      responseType: "blob", // important
      data: payload,
    }).then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: res.headers["content-type"],
        })
      );
      var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      var matches = filenameRegex.exec(res.headers["content-disposition"]);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", matches[1].replace(/['"]/g, "")); //or any other extension
      document.body.appendChild(link);
      link.click();
      setAction(null);
    });
  };
  const exportTypeDropdownHandler = (e) => {
    setexportType(e.target.value);
  };

  return (
    <div
      ref={modalRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",

        flexDirection: "column",
      }}
    >
      {processCreationModal ? (
        <Modal
          show={processCreationModal}
          style={{
            width: "380px",
            height: "380px",
            left: "50%",
            top: "50%",
            padding: "0",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            boxShadow: "none",
          }}
          modalClosed={() => {
            setprocessCreationModal(false);
            setselectedProject("none");
          }}
          children={
            <ProjectCreation
              setShowModal={() => setprocessCreationModal(false)}
              width="100%"
              height="40px"
            />
          }
        />
      ) : null}

      <div
        style={{
          width: "100%",
          height: typeImportorExport === "import" ? "15%" : "40px",
          borderBottom: "1px solid rgb(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: "15px",
          fontSize: "1rem",
          fontWeight: "500",
        }}
      >
        {typeImportorExport === "import" ? (
          <p>
            {" "}
            {t("import")} {t("Process")}
          </p>
        ) : (
          <p>
            {" "}
            {t("export")} {t("Process")}
          </p>
        )}

        <CloseIcon
          fontSize="small"
          style={{ opacity: "0.5" }}
          onClick={closeHandler}
        />
      </div>
      {typeImportorExport === "import" ? (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            width: "100%",
            height: "73%",
            padding: "10px",
            overflowY: "scroll",
            direction: direction,
          }}
        >
          <label className={styles.heading}>
            {t("import")} {t("type")}
          </label>
          <Select
            IconComponent={ExpandMoreIcon}
            style={{
              width: "100%",
              height: "25px",
              marginBottom: "10px",
              direction: direction,
            }}
            variant="outlined"
            value={importType}
            onChange={(e) => setimportType(e.target.value)}
            //autoWidth
          >
            <MenuItem value="xml">
              <p
                style={{
                  fontSize: "0.8rem",
                  textAlign: direction === "rtl" ? "right" : "left",
                }}
              >
                XML
              </p>
            </MenuItem>
            <MenuItem value="xpdl">
              <p
                style={{
                  fontSize: "0.8rem",
                  textAlign: direction === "rtl" ? "right" : "left",
                }}
              >
                XPDL 2.2
              </p>
            </MenuItem>
            <MenuItem value="bpmn">
              <p
                style={{
                  fontSize: "0.8rem",
                  textAlign: direction === "rtl" ? "right" : "left",
                }}
              >
                BPMN 2.0
              </p>
            </MenuItem>
            <MenuItem value="bpel">
              <p
                style={{
                  fontSize: "0.8rem",
                  textAlign: direction === "rtl" ? "right" : "left",
                }}
              >
                BPEL
              </p>
            </MenuItem>
          </Select>
          <label className={styles.heading}>
            {t("file")} {t("name")}
          </label>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "72%",
                height: "1.5625rem",
                marginBottom: "10px",
                background: "#F8F8F8 0% 0% no-repeat padding-box",
                border: "1px solid #CECECE",
                borderRadius: "2px",
                paddingLeft: "5px",
                opacity: "1",
                // backgroundColor: "red",
              }}
            >
              <p
                id="add_sectionName"
                //   onChange={(e) => setsectionName(e.target.value)}
                style={{
                  textAlign: "left",
                  opacity: "1",
                  fontSize: "0.8rem",
                  fontWeight: "400",
                }}
              >
                {selectedFile !== undefined ? selectedFile.name : ""}
              </p>
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
                }}
              >
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => uploadFile(e)}
                  accept="application/x-zip-compressed"
                />
                {t("Choose File")}
              </label>
            </form>
          </div>
          {errorObj?.importType !== "" ? (
            <p style={{ fontSize: "0.65rem", color: "red" }}>
              {" "}
              {errorObj?.importType}
            </p>
          ) : null}
          <label className={styles.heading}>
            {t("Process")} {t("name")}
          </label>

          <input
            id="add_sectionName"
            style={{
              width: "100%",
              height: "1.5625rem",
              marginBottom: "10px",
              background: "#F8F8F8 0% 0% no-repeat padding-box",
              border: "1px solid #CECECE",
              borderRadius: "2px",
              paddingLeft: "5px",
              opacity: "1",
            }}
            readOnly={props.showOverwrite ? true : false}
            value={selectedProcessName}
            onChange={(e) => setselectedProcessName(e.target.value)}
          />
          {errorObj?.processName !== "" && showErrorsBool ? (
            <p style={{ fontSize: "0.65rem", color: "red" }}>
              {" "}
              {errorObj?.processName}
            </p>
          ) : null}
          <label className={styles.heading}>{t("ProjectName")}</label>
          {ProjectValue?.ProjectName ? (
            <input
              id="add_sectionName"
              value={ProjectValue.ProjectName.ProjectName}
              //   onChange={(e) => setsectionName(e.target.value)}
              style={{
                width: "100%",
                height: "1.5625rem",
                marginBottom: "10px",
                background: "#F8F8F8 0% 0% no-repeat padding-box",
                border: "1px solid #CECECE",
                paddingInline: "5px",

                opacity: "1",
              }}
            />
          ) : (
            <>
              <Select
                IconComponent={ExpandMoreIcon}
                style={{
                  width: "100%",
                  height: "25px",
                  marginBottom: "10px",
                  direction: direction,
                }}
                variant="outlined"
                value={selectedProject}
                onChange={(e) => projectDropdownHandler(e.target.value)}
                //autoWidth
              >
                <MenuItem value="none"></MenuItem>
                {ProjectValue?.ProjectList?.map((project) => (
                  <MenuItem key={project.ProjectId} value={project.ProjectId}>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        textAlign: direction === "rtl" ? "right" : "left",
                      }}
                    >
                      {project.ProjectName}
                    </p>
                  </MenuItem>
                ))}
                <MenuItem value="addNewProject">
                  <p
                    style={{
                      fontSize: "0.8rem",
                      textAlign: direction === "rtl" ? "right" : "left",
                      color: "#0072C6",
                    }}
                  >
                    + Create New Project
                  </p>
                </MenuItem>
              </Select>
              {errorObj?.projectName !== "" && showErrorsBool ? (
                <p style={{ fontSize: "0.65rem", color: "red" }}>
                  {" "}
                  {errorObj?.projectName}
                </p>
              ) : null}
            </>
          )}
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "70px",
            padding: "8px",
            paddingLeft: "0.9375rem",
            color: "#606060",
          }}
        >
          <p style={{ fontWeight: "400", fontSize: "0.75rem" }}>
            {t("export")} {t("type")}{" "}
          </p>
          <RadioGroup
            row
            aria-label="position"
            onChange={exportTypeDropdownHandler}
            value={exportType}
          >
            <StyledLabel
              value="xml"
              control={<Radio size="small" color="primary" />}
              label={CONST_XML}
              labelPlacement="end"
              style={{ fontSize: "0.8rem" }}
              classes={{
                label: { color: "red" },
              }}
            />
            <StyledLabel
              value="xpdl"
              control={<Radio size="small" color="primary" />}
              label={CONST_XPDI}
              labelPlacement="end"
              style={{ fontSize: "0.8rem" }}
            />
            <StyledLabel
              value="bpmn"
              control={<Radio size="small" color="primary" />}
              label={CONST_BPMN}
              labelPlacement="end"
              style={{ fontSize: "0.8rem" }}
            />
            <StyledLabel
              value="bpel"
              control={<Radio size="small" color="primary" />}
              label={CONST_BPEL}
              labelPlacement="end"
              style={{ fontSize: "0.8rem" }}
            />
          </RadioGroup>
        </div>
      )}

      <div
        className="buttons_add"
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "flex-end",
          width: "100%",
          height: typeImportorExport === "import" ? "12%" : "40px",
          padding: "10px",
        }}
      >
        {typeImportorExport === "import" ? (
          <>
            {props.showOverwrite ? (
              <>
                <button
                  id="add_cancel"
                  variant="outlined"
                  className={styles.buttons}
                  onClick={(e) => handleSubmit(e, true, false, false)}
                  style={{
                    background: disableImport ? "grey" : "#0072c6",
                    width: "10rem",
                  }}
                >
                  {t("overwriteExistingProcess")}
                </button>
                <button
                  id="add_cancel"
                  variant="outlined"
                  className={styles.newVersionButton}
                  onClick={(e) => handleSubmit(e, false, true, false)}
                  style={{
                    background: disableImport ? "grey" : "white",
                    color: disableImport ? "white" : "#0072c6",
                    width: "8rem",
                    border: "1px solid rgb(0,0,0,0.4)",
                    borderRadius: "3px",
                  }}
                >
                  {t("createNewVersion")}
                </button>
              </>
            ) : (
              <>
                <button
                  id="add_cancel"
                  variant="outlined"
                  className={styles.buttons}
                  onClick={(e) => handleSubmit(e, false, false, true)}
                  style={{
                    background: disableImport ? "grey" : "#0072c6",
                    width: "6rem",
                  }}
                  disabled={disableImport}
                >
                  {t("Import and Open")}
                </button>
                <button
                  id="add_cancel"
                  variant="outlined"
                  className={styles.newVersionButton}
                  style={{
                    background: disableImport ? "grey" : "white",
                    color: disableImport ? "white" : "#0072c6",
                    border: "1px solid rgb(0,0,0,0.4)",
                    borderRadius: "3px",
                  }}
                  onClick={(e) => handleSubmit(e, false, false, false)}
                  disabled={disableImport}
                >
                  {t("import")}
                </button>
              </>
            )}
          </>
        ) : (
          <button
            id="add_sectionClose"
            variant="outlined"
            className={styles.buttons}
            onClick={exportHandler}
            color="primary"
          >
            {t("export")}
          </button>
        )}

        <button
          id="add_sectionClose"
          variant="outlined"
          className={styles.cancelButton}
          onClick={closeHandler}
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    openProcessClick: (id, name, type, version, processName) =>
      dispatch(
        actionCreators.openProcessClick(id, name, type, version, processName)
      ),
  };
};

export default connect(null, mapDispatchToProps)(ImportExportProcess);
