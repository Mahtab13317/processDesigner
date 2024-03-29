import React, { useState, useEffect } from "react";
import Modal from "../../../../UI/Modal/Modal.js";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { useGlobalState, store } from "state-pool";
import styles from "./attachment.module.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddAttachmentModal from "../InitialRule/AddAttachmentModal";
import {
  ATTACHMENT_TYPE,
  STATUS_TYPE_TEMP,
  STATUS_TYPE_ADDED,
  SERVER_URL,
  ENDPOINT_UPLOAD_ATTACHMENT,
  propertiesLabel,
  ENDPOINT_DOWNLOAD_ATTACHMENT,
  RTL_DIRECTION,
  ENDPOINT_SAVE_ATTACHMENT
} from "../../../../Constants/appConstants";
import { connect, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import axios from "axios";
import arabicStyles from "../InitialRule/arabicStyles.module.css";

function AttachmentReq(props) {
    let { t } = useTranslation();
    const dispatch = useDispatch();
    const direction = `${t("HTML_DIR")}`;
    const [showAttach, setShowAttach] = useState(false);
    const localActivityPropertyData = store.getState("activityPropertyData");
    const [spinner, setspinner] = useState(true);
    const [
      localLoadedActivityPropertyData,
      setlocalLoadedActivityPropertyData
    ] = useGlobalState(localActivityPropertyData);
    const [attachList, setAttachList] = useState([]);
  
    useEffect(() => {
      if (!!props.ignoreSpinner) {
        setspinner(false);
    const url=SERVER_URL+ENDPOINT_SAVE_ATTACHMENT+"/"+props.openProcessID+"/"+props.openProcessType
        axios
      .get(url)
      .then(function (response) {   
        
        const tempAttachList=response?.data?.Attachments?.map((item,i)=>{
                return {
                    docExt: null,
                    docId: item.DocId,
                    docName: item.DocName,
                    requirementId: null,
                    sAttachName: item.AttachmentName,
                    sAttachType: item.AttachmentType,
                    status: item.Status
                }
        })
        setAttachList(tempAttachList)
      })
      .catch(function (error) {
        console.log(error);
      });

      }
     
    }, [props.ignoreSpinner]);
  
    const handleOpen = () => {
      setShowAttach(true);
    };
  
    const handleClose = () => {
      setShowAttach(false);
    };
  
    const handleRemoveFields = i => {
      const values = [...attachList];
      values?.forEach(val => {
        if (val.docId === i) {
          val.status = "D";
        }
      });
      setAttachList(values);

     
      props.RAPayload(values)
  
      
     
    };
    const handleDownload = docId => {
      let payload = {
        processDefId: props?.openProcessID,
        docId: docId,
        repoType: props?.openProcessType
      };
  
     
      
  
      try {
        const response = axios({
          method: "POST",
          url: SERVER_URL + ENDPOINT_DOWNLOAD_ATTACHMENT,
          data: payload,
          responseType: "blob"
        }).then(res => {
          const url = window.URL.createObjectURL(
            new Blob([res.data], {
              type: res.headers["content-type"]
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
        console.log(error);
      }
    };
    const handleAddAttachment = async (
      selectedFile,
      selectedDocumentName,
      description
    ) => {
      let n = selectedFile.value.name.lastIndexOf(".");
      let result = selectedFile.value.name.substring(n + 1);
      
  
      let payload = {
        processDefId: props?.openProcessID,
        docName: selectedDocumentName?.value,
        docExt: result,
        actId: props?.cellID,
        actName: props?.cellName,
        sAttachName: description?.value,
        sAttachType: ATTACHMENT_TYPE,
        repoType: props?.openProcessType
      };
  
      const formData = new FormData();
  
      formData.append("file", selectedFile.value);
      formData.append(
        "attachInfo",
        new Blob([JSON.stringify(payload)], {
          type: "application/json"
        })
      );
  
      
  
      try {
        const response = await axios({
          method: "post",
          url: SERVER_URL + ENDPOINT_UPLOAD_ATTACHMENT,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        if (response.status === 200 && response.data.Output) {
          handleClose();
          setAttachList(prev => {
            return [
              ...prev,
              {
                docExt: result,
                docId: response?.data?.Output?.docId,
                docName: response?.data?.Output?.docName,
                requirementId: response?.data?.Output?.reqId,
                sAttachName: response?.data?.Output?.sAttachName,
                sAttachType: response?.data?.Output?.sAttachType,
                status: "T"
              }
            ];
          });
  
  
  
          if(props.ignoreSpinner)
          {
            const tempAttachList=[...attachList,{
              docExt: result,
              docId: response?.data?.Output?.docId,
              docName: response?.data?.Output?.docName,
              requirementId: response?.data?.Output?.reqId,
              sAttachName: response?.data?.Output?.sAttachName,
              sAttachType: response?.data?.Output?.sAttachType,
              status: "S"
            }]
            props.RAPayload(tempAttachList)
          }
  
         
  
         
         
        }
      } catch (error) {
        console.log(error);
      }
  
     
    };
  
    return (
      <div>
        {spinner ? (
          <CircularProgress style={{ marginTop: "30vh", marginLeft: "40%" }} />
        ) : (
          <div
            className={`${styles.initialRule} ${
              props.isDrawerExpanded ? styles.expandedView : styles.collapsedView
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
                    el =>
                      el.sAttachType === ATTACHMENT_TYPE &&
                      (el.status === STATUS_TYPE_TEMP ||
                        el.status === STATUS_TYPE_ADDED)
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
                        {item.docName}
                      </td>
                      <td
                        className={`${styles.descDiv} ${
                          direction === RTL_DIRECTION
                            ? arabicStyles.divBody
                            : styles.divBody
                        }`}
                      >
                        {item.sAttachName}
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
                          onClick={() => handleDownload(item.docId)}
                        />
                        <DeleteOutlineIcon
                          className={styles.deleteIcon1}
                          onClick={() => handleRemoveFields(item.docId)}
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
                  padding: "0"
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
        )}
      </div>
    );
}

const mapStateToProps = state => {
    return {
      isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
      openProcessID: state.openProcessClick.selectedId,
      cellID: state.selectedCellReducer.selectedId,
      cellName: state.selectedCellReducer.selectedName,
      openProcessType: state.openProcessClick.selectedType
    };
  };
  export default connect(
    mapStateToProps,
    null
  )(AttachmentReq);