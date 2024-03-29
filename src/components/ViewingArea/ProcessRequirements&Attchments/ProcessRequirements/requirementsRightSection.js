import React, { useEffect, useState } from "react";
import SunEditor from "../../../../UI/SunEditor/SunTextEditor";
import Button from "@material-ui/core/Button";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./index.css";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import { useDispatch, useSelector } from "react-redux";
// --------------------
import Modal from "../../../../UI/Modal/Modal.js";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { useGlobalState, store } from "state-pool";
import styles from "../../../../components/Properties/PropetiesTab/InitialRule/initial.module.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddAttachmentModal from "../../../../components/Properties/PropetiesTab/InitialRule/AddAttachmentModal.js";
import {
  RULE_TYPE,
  STATUS_TYPE_TEMP,
  STATUS_TYPE_ADDED,
  SERVER_URL,
  ENDPOINT_UPLOAD_ATTACHMENT,
  propertiesLabel,
  ENDPOINT_DOWNLOAD_ATTACHMENT,
  RTL_DIRECTION,
  ENDPOINT_REGISTER_PROCESS,
  PROCESSTYPE_DEPLOYED,
  PROCESSTYPE_REGISTERED,
} from "../../../../Constants/appConstants";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import axios from "axios";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import arabicStyles from "../../../../components/Properties/PropetiesTab/InitialRule/arabicStyles.module.css";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked";
import {
  isProcessDeployedFunc,
  isReadOnlyFunc,
} from "../../../../utility/CommonFunctionCall/CommonFunctionCall";
// --------------

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    // width: props.isDrawerExpanded? '100%': 324,
    height: 40,
  },
  tableContainer: {
    padding: 5,
    height: 270,
  },
  tableRow: {
    height: 40,
  },
  tableHeader: {
    fontWeight: 600,
    fontSize: "var(--subtitle_text_font_size)",
    backgroundColor: "#F3F3F3",
    color: "black",
  },
  tableHeaderEmpty: {
    backgroundColor: "#F3F3F3",
    color: "black !important",
  },
  tableBodyCell: {
    fontSize: "var(--base_text_font_size)",
  },
});

function RequireRightSection(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const [showAttach, setShowAttach] = useState(false);
  const localActivityPropertyData = store.getState("activityPropertyData");
  const [spinner, setspinner] = useState(false);
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(localActivityPropertyData);
  const [attachList, setAttachList] = useState([]);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [subSectionDesc, setSubSectionDesc] = useState("");
  const [implementationDesc, setImplementationDesc] = useState("");
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  let isReadOnly =
    props.openProcessType === PROCESSTYPE_DEPLOYED ||
    props.openProcessType === PROCESSTYPE_REGISTERED;

  useEffect(() => {
    props?.completeSections?.map((section) => {
      if (
        props?.selectedOrder?.SectionLevel == 0 &&
        section?.RequirementId == props?.selectedOrder?.RequirementId
      ) {
        setAttachList(section?.Attachment);
      } else if (props?.selectedOrder?.SectionLevel == 1) {
        section?.InnerRequirement?.map((inner) => {
          if (inner?.RequirementId == props?.selectedOrder?.RequirementId) {
            setAttachList(inner.Attachment);
          }
        });
      } else if (props?.selectedOrder?.SectionLevel == 2) {
        section?.InnerRequirement?.map((inner) => {
          inner.InnerRequirement2?.map((pl) => {
            if (pl.RequirementId == props?.selectedOrder?.RequirementId) {
              setAttachList(pl.Attachment);
            }
          });
        });
      }
    });
    console.log("KHAAS", props?.selectedOrder);
  }, [props?.selectedOrder, props?.completeSections]);

  useEffect(() => {
    setImplementationDesc(props?.selectedOrder?.ReqImpl);
    setSubSectionDesc(props?.selectedOrder?.ReqDesc);
  }, [props?.selectedOrder]);

  const handleOpen = () => {
    setShowAttach(true);
  };

  const handleClose = () => {
    setShowAttach(false);
  };

  const handleRemoveFields = (i) => {
    const values = [...attachList];
    values.forEach((val) => {
      if (val.DocId === i) {
        val.Status = "D";
      }
    });
    setAttachList(values);

    // let tempPropertyData = { ...localLoadedActivityPropertyData };
    // let attachTempList = [...tempPropertyData?.ActivityProperty?.m_objPMAttachmentDetails?.attachmentList]
    // attachTempList?.forEach((el, idx)=>{
    //   if(el.docId === i){
    //     tempPropertyData.ActivityProperty.m_objPMAttachmentDetails.attachmentList[idx].status = "D"
    //   }
    // })
    // setlocalLoadedActivityPropertyData(tempPropertyData);
    // dispatch(
    //   setActivityPropertyChange({
    //     [propertiesLabel.initialRules]: {
    //       isModified: true,
    //       hasError: false
    //     }
    //   }))
  };

  const handleDownload = (docId) => {
    let payload = {
      processDefId: props.openProcessID,
      docId: docId,
      repoType: props.openProcessType,
    };
    try {
      const response = axios({
        method: "POST",
        url: "/pmweb" + ENDPOINT_DOWNLOAD_ATTACHMENT,
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
      });
    } catch (error) {
      dispatch(
        setToastDataFunc({
          message: "",
          severity: "error",
          open: true,
        })
      );
    }
  };

  const handleAddAttachment = async (
    selectedFile,
    selectedDocumentName,
    description
  ) => {
    var n = selectedFile.value.name.lastIndexOf(".");
    var result = selectedFile.value.name.substring(n + 1);

    let payload = {
      processDefId: props.openProcessID,
      docName: selectedDocumentName.value,
      docExt: result,
      // actId: props.cellID,
      // actName: props.cellName,
      sAttachName: description.value,
      sAttachType: RULE_TYPE,
      repoType: props.openProcessType,
    };

    const formData = new FormData();

    formData.append("file", selectedFile.value);
    formData.append(
      "attachInfo",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      })
    );

    try {
      const response = await axios({
        method: "post",
        url: "/pmweb" + ENDPOINT_UPLOAD_ATTACHMENT,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200 && response.data.Output) {
        handleClose();
        setAttachList((prev) => {
          return [
            ...prev,
            {
              docExt: result,
              DocId: response.data.Output.docId,
              DocName: response.data.Output.docName,
              requirementId: response.data.Output.reqId,
              AttachmentName: response.data.Output.sAttachName,
              sAttachType: response.data.Output.sAttachType,
              status: "T",
            },
          ];
        });
      }
    } catch (error) {
      dispatch(
        setToastDataFunc({
          message: "",
          severity: "error",
          open: true,
        })
      );
    }

    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.initialRules]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };

  useEffect(() => {
    let attachmentsList = attachList?.map((attach) => {
      return {
        docName: attach?.DocName,
        docId: attach?.DocId,
        status: attach?.status,
        sAttachType: attach?.sAttachType,
        sAttachName: attach?.AttachmentName,
        requirementId: attach?.requirementId,
      };
    });

    let jsonBody = {
      processDefId: props?.openProcessID,
      processState: props?.openProcessType,
      reqList: [
        {
          reqName: props?.selectedOrder?.RequirementName,
          reqId: props?.selectedOrder?.RequirementId,
          reqDesc: subSectionDesc,
          reqImpl: implementationDesc,
          priority: 1,
          attachmentList: attachmentsList,
        },
      ],
    };
    if (saveCancelStatus.SaveClicked === true) {
      axios
        .post(SERVER_URL + ENDPOINT_REGISTER_PROCESS, jsonBody)
        .then((res) => {
          console.log("data", res.data);
          dispatch(setSave({ SaveClicked: false, CancelClicked: false }));
        })
        .catch((err) => {
          console.log("AXIOS ERROR: ", err);
        });
    }
  }, [saveCancelStatus.SaveClicked]);

  const changeFieldDetails = (e, name) => {
    if (name === "textOne") {
      setSubSectionDesc(e.target.innerText);
    } else if (name === "textTwo") {
      setImplementationDesc(e.target.innerText);
    }
  };

  return (
    <div>
      <div>
        <div
          style={{
            paddingLeft: "12px",
          }}
        >
          <p
            style={{
              fontSize: "var(--title_text_font_size)",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            {props?.selectedOrder?.RequirementName}
          </p>
          <p style={{ fontSize: "var(--title_text_font_size)" }}>
            <span
              style={{
                fontSize: "var(--base_text_font_size)",
                color: "#606060",
                marginRight: "10px",
              }}
            >{`Subsection Level ${props?.selectedOrder?.SectionLevel}:`}</span>
            {props?.selectedOrder?.RequirementName}
          </p>
          {console.log("EDITOR shivani", props?.selectedOrder?.ReqDesc)}
          <SunEditor
            id="textOne_description_sunEditor"
            width="100%"
            customHeight="6rem"
            placeholder="Write Here"
            callLocation="processProperties"
            value={subSectionDesc}
            getValue={(e) => changeFieldDetails(e, "textOne")}
          />
          <p
            style={{
              fontSize: "var(--title_text_font_size)",
              fontWeight: "600",
              margin: "10px 0px",
            }}
          >
            Implementation Summary
          </p>
          <SunEditor
            id="textTwo_description_sunEditor"
            width="100%"
            customHeight="6rem"
            placeholder="Write Here"
            callLocation="processProperties"
            value={implementationDesc}
            getValue={(e) => changeFieldDetails(e, "textTwo")}
          />
        </div>
        {/* ----------------------------Attachments Table------------------------------- */}
        <div>
          <div
            className={`${styles.initialRule} ${
              props.isDrawerExpanded
                ? styles.expandedView
                : styles.collapsedView
            }`}
          >
            <div className={`${styles.attachmentHeader} row`}>
              <p className={styles.addAttachHeading}>{t("attachedRule")}</p>
              <button
                onClick={handleOpen}
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.addAttachBtn
                    : styles.addAttachBtn
                }
                disabled={isReadOnly}
              >
                {t("addAttachment")}
              </button>
            </div>
            <table className={styles.tableDiv}>
              <thead className={styles.tableHeader}>
                <tr className={styles.tableHeaderRow}>
                  <td
                    className={`${styles.attachDiv} ${
                      direction === RTL_DIRECTION
                        ? arabicStyles.divHead
                        : styles.divHead
                    }`}
                  >
                    {t("attachmentName")}
                  </td>
                  <td
                    className={`${styles.descDiv} ${
                      direction === RTL_DIRECTION
                        ? arabicStyles.divHead
                        : styles.divHead
                    }`}
                  >
                    {t("Discription")}
                  </td>
                  <td
                    className={`${
                      direction === RTL_DIRECTION
                        ? arabicStyles.iconDiv
                        : styles.iconDiv
                    } ${
                      direction === RTL_DIRECTION
                        ? arabicStyles.divHead
                        : styles.divHead
                    }`}
                  ></td>
                </tr>
              </thead>
              <tbody>
                {attachList
                  ?.filter(
                    (el) =>
                      // el.AttachmentType === RULE_TYPE &&
                      // (el.Status === STATUS_TYPE_TEMP ||
                      //   el.Status === STATUS_TYPE_ADDED)
                      el.Status != "D"
                  )
                  ?.map((item, i) => (
                    <tr className={styles.tableRow}>
                      <td
                        className={`${styles.attachDiv} ${
                          direction === RTL_DIRECTION
                            ? arabicStyles.divBody
                            : styles.divBody
                        }`}
                      >
                        {item.DocName}
                      </td>
                      <td
                        className={`${styles.descDiv} ${
                          direction === RTL_DIRECTION
                            ? arabicStyles.divBody
                            : styles.divBody
                        }`}
                      >
                        {item.AttachmentName}
                      </td>
                      <td
                        className={`${
                          direction === RTL_DIRECTION
                            ? arabicStyles.iconDiv
                            : styles.iconDiv
                        } ${
                          direction === RTL_DIRECTION
                            ? arabicStyles.divBody
                            : styles.divBody
                        }`}
                      >
                        <SystemUpdateAltIcon
                          className={styles.downloadIcon}
                          onClick={() => handleDownload(item.DocId)}
                        />
                        <DeleteOutlineIcon
                          className={styles.deleteIcon1}
                          onClick={() => handleRemoveFields(item.DocId)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {showAttach ? (
              <Modal
                show={showAttach}
                style={{
                  width: "40vw",
                  left: "30%",
                  top: "20%",
                  padding: "0",
                }}
                modalClosed={handleClose}
                children={
                  <AddAttachmentModal
                    handleClose={handleClose}
                    handleAddAttachment={handleAddAttachment}
                  />
                }
              />
            ) : null}
          </div>
        </div>
        {/* ---------------------------------------------------------------------------------------------------- */}
      </div>
      {/* Strip------------------ */}
      <div
        className={
          // direction === RTL_DIRECTION
          //   ? "propertiesFooterButtons_rtl"
          //   :
          "propertiesFooterButtons"
        }
      >
        <button
          id="propertiesDiscardButton"
          // disabled={saveCancelDisabled}
          // onClick={handleCancelChanges}
          className={
            // saveCancelDisabled
            //   ? "properties_disabledButton"
            //   :
            "properties_cancelButton"
          }
        >
          {t("discard")}
        </button>
        <button
          id="propertiesSaveButton"
          // disabled={saveCancelDisabled}
          onClick={() => dispatch(setSave({ SaveClicked: true }))}
          className={
            // saveCancelDisabled
            //   ? "properties_disabledButton"
            //   :
            "properties_saveButton"
          }
          disabled={isReadOnly}
        >
          {t("saveChanges")}
        </button>
      </div>
      {/* ---------------------- */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
    openProcessID: state.openProcessClick.selectedId,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps, null)(RequireRightSection);
