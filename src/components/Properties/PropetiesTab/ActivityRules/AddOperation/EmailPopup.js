import React, { useEffect, useState } from "react";
import { useSSR, useTranslation } from "react-i18next";
import { connect, useDispatch, useSelector } from "react-redux";
import { store, useGlobalState } from "state-pool";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import CloseIcon from "@material-ui/icons/Close";
import {
  MenuItem,
  Radio,
  Checkbox,
  InputBase,
  Box,
  Button,
  TextField,
  FormHelperText,
  TextareaAutosize,
} from "@material-ui/core";
import CustomizedDropdown from "../../../../../UI/Components_With_ErrrorHandling/Dropdown";
import clsx from "clsx";
import TextInput from "../../../../../UI/Components_With_ErrrorHandling/InputField";
import { RTL_DIRECTION } from "../../../../../Constants/appConstants";
import { addConstantsToString } from "../../../../../utility/ProcessSettings/Triggers/triggerCommonFunctions";
import { TRIGGER_PRIORITY_HIGH, TRIGGER_PRIORITY_LOW, TRIGGER_PRIORITY_MEDIUM } from "../../../../../Constants/triggerConstants";
import { setToastDataFunc } from "../../../../../redux-store/slices/ToastDataHandlerSlice";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "2px",
  border: "1px solid #F5F5F5",
  boxShadow: 24,
  marginTop:100
};
function EmailPopup({isOpenMailModal,handleCloseEmailModal,passEmailData,parentEmailData}) {
 
  let { t } = useTranslation();

  const direction = `${t("HTML_DIR")}`;
  let dispatch = useDispatch();

  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

 /*  const [emailData, setEmailData] = useState({
    to: "",
    from: "",
    cc: "",
    bcc: "",
    priority: "",
    subject: "",
    body: "",
  }); */
  const [emailData, setEmailData] = useState(parentEmailData);

  const [subjectVar, setSubjectVar] = useState("");
  const [bodyVar, setBodyVar] = useState("");

  const priority = [
    {"label":t(TRIGGER_PRIORITY_LOW),value:1},
    {"label":t(TRIGGER_PRIORITY_MEDIUM),value:2},
    {"label":t(TRIGGER_PRIORITY_HIGH),value:3},

  ];


  const onChangeHandler = (e) => {
    let tempEmail = { ...emailData };
    tempEmail[e.target.name] = e.target.value;
    setEmailData(tempEmail);
  
  };

  const addSubject = () => {
    let str = addConstantsToString(emailData.subject, subjectVar);
    console.log("str", str);
    setEmailData({ ...emailData, subject: str });
  };

  const addMail=()=>{
    let str = addConstantsToString(emailData.body, bodyVar);
    console.log("str", str);
    setEmailData({ ...emailData, body: str });
  }
   
  const saveEmailData=()=>{
      console.log("123",emailData);
      let isValid=true;
      Object.keys(emailData).forEach(function(key) {
        if (emailData[key] == '') {
         isValid=false;
         
          return false;
         
        }
       
      });

      if(isValid===true)
      {
        passEmailData(emailData)
        handleCloseEmailModal();
      }
      else{
        dispatch(
          setToastDataFunc({
            message: `Please fill mandarory fields`,
            severity: "error",
            open: true,
          })
        );
      }
      
  }

  useEffect(() => {

    setEmailData(parentEmailData)
    console.log("888","parent mail data",parentEmailData)
  }, [parentEmailData])
  

 
  return (
    <>
    

   
           <Box sx={styleModal}   >
           <div
              className={
                direction == RTL_DIRECTION ? styles.modalHeaderRTL : styles.modalHeader
              }
            >
              <div
                className={
                  direction == RTL_DIRECTION
                    ? `${styles.labels} ${styles.modalLabelRTL}`
                    : `${styles.labels} ${styles.modalLabel}`
                }
              >
                
              </div>
              <div
                className={
                  direction == RTL_DIRECTION ? styles.modalCloseRTL : styles.modalClose
                }
              >
              
                <CloseIcon
                  style={{
                    fontSize: "medium",
                    cursor:  "pointer",
                    height: "100%",
                    width: "1.2rem",
                    color: "#707070",
                    marginRight: "2px",
                    marginTop: "8px",
                    // display: props.disabled ? "none": ""
                  }}
                  onClick={handleCloseEmailModal}
                />
              </div>
            </div>
            <div className={styles.modalBody}>
            <div className={styles.emailContainer}>
        <div className={styles.fieldRow}>
          <div className={styles.fldLabel}>{t("from")}<span className={styles.error}>*</span></div>
          <div className={styles.fldElement}>
            {/* <TextInput
              inputValue={emailData.from}
              className={styles.txtField}
              onChange={onChangeHandler}
              name="from"
              idTag="fromEmail"
              
            /> */}
            <CustomizedDropdown
              id="AO_Escalate_To_Email_Dropdown"
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.escalateToEmailDropdown
                  : styles.escalateToEmailDropdown
              }
              isNotMandatory={true}
              name="from"
              onChange={onChangeHandler}
              value={emailData.from}
            >
              {localLoadedProcessData?.Variable?.filter(d=>d.VariableScope=="M" || d.VariableScope=="U").map((data, i) => (
                <MenuItem value={data.VariableName}>
                  {data.VariableName}
                </MenuItem>
              ))}
            </CustomizedDropdown>
            
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.fldLabel}>{t("to")}<span className={styles.error}>*</span></div>
          <div className={styles.fldElement}>
            <CustomizedDropdown
              id="AO_Escalate_To_Email_Dropdown"
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.escalateToEmailDropdown
                  : styles.escalateToEmailDropdown
              }
              isNotMandatory={true}
              name="to"
              onChange={onChangeHandler}
              value={emailData.to}
            >
              {localLoadedProcessData?.Variable?.filter(d=>d.VariableScope=="M" || d.VariableScope=="U").map((data, i) => (
                <MenuItem value={data.VariableName}>
                  {data.VariableName}
                </MenuItem>
              ))}
            </CustomizedDropdown>
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.fldLabel}>{t("CC")}<span className={styles.error}>*</span></div>
          <div className={styles.fldElement}>
            <CustomizedDropdown
              id="AO_Escalate_To_Email_Dropdown"
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.escalateToEmailDropdown
                  : styles.escalateToEmailDropdown
              }
              isNotMandatory={true}
              name="cc"
              onChange={onChangeHandler}
              value={emailData.cc}
            >
              {localLoadedProcessData?.Variable?.filter(d=>d.VariableScope=="M" || d.VariableScope=="U").map((data, i) => (
                <MenuItem value={data.VariableName}>
                  {data.VariableName}
                </MenuItem>
              ))}
            </CustomizedDropdown>
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.fldLabel}>{t("BCC")}<span className={styles.error}>*</span></div>
          <div className={styles.fldElement}>
            <CustomizedDropdown
              id="AO_Escalate_To_Email_Dropdown"
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.escalateToEmailDropdown
                  : styles.escalateToEmailDropdown
              }
              isNotMandatory={true}
              name="bcc"
              onChange={onChangeHandler}
              value={emailData.bcc}
            >
              {localLoadedProcessData?.Variable?.filter(d=>d.VariableScope=="M" || d.VariableScope=="U").map((data, i) => (
                <MenuItem value={data.VariableName}>
                  {data.VariableName}
                </MenuItem>
              ))}
            </CustomizedDropdown>
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.fldLabel}>{t("Priority")}<span className={styles.error}>*</span></div>
          <div className={styles.fldElement}>
            <CustomizedDropdown
              id="AO_Escalate_To_Email_Dropdown"
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.escalateToEmailDropdown
                  : styles.escalateToEmailDropdown
              }
              isNotMandatory={true}
              name="priority"
              onChange={onChangeHandler}
              value={emailData.priority}
            >
              {priority?.map((data, i) => (
                <MenuItem value={data.value}>
                  {data.label}
                </MenuItem>
              ))}
            </CustomizedDropdown>
          </div>
        </div>
        <hr />
        <div className={styles.fieldRow}>
          <div className={styles.fldLabel}>{t("Subject")}<span className={styles.error}>*</span></div>
          <div className={styles.fldElement}>
            <CustomizedDropdown
              id="AO_Escalate_To_Email_Dropdown"
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.escalateToEmailDropdown
                  : styles.escalateToEmailDropdown
              }
              isNotMandatory={true}
              value={subjectVar}
              onChange={(e) => {
                setSubjectVar(e.target.value);
              }}
            >
              {localLoadedProcessData?.Variable?.filter(d=>d.VariableScope=="M" || d.VariableScope=="U").map((data, i) => (
                <MenuItem value={data.VariableName}>
                  {data.VariableName}
                </MenuItem>
              ))}
            </CustomizedDropdown>
          </div>
          <div>
            <Button
              className={`secondary ${styles.addBtn}`}
              color="primary"
              variant="outlined"
              size="small"
              onClick={addSubject}
            >
              {t("toolbox.sharePointArchive.add")}
            </Button>
          </div>
        </div>
        <div className={`${styles.fieldRow}`}>
          <TextInput
            inputValue={emailData.subject}
            classTag={styles.txtField}
            idTag="subject"
            name="subject"
            onChangeEvent={onChangeHandler}
          />
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.fldLabel}>{t("MailBody")}<span className={styles.error}>*</span></div>
          <div className={styles.fldElement}>
            <CustomizedDropdown
              id="AO_Escalate_To_Email_Dropdown"
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.escalateToEmailDropdown
                  : styles.escalateToEmailDropdown
              }
              isNotMandatory={true}
              value={bodyVar}
              onChange={(e) => {
                setBodyVar(e.target.value);
              }}
            >
              {localLoadedProcessData?.Variable?.filter(d=>d.VariableScope=="M" || d.VariableScope=="U").map((data, i) => (
                <MenuItem value={data.VariableName}>
                  {data.VariableName}
                </MenuItem>
              ))}
            </CustomizedDropdown>
          </div>
          <div>
            <Button
              className={`secondary ${styles.addBtn}`}
              color="primary"
              variant="outlined"
              size="small"
              onClick={addMail}
            >
              {t("toolbox.sharePointArchive.add")}
            </Button>
          </div>
        </div>
        <div className={styles.fieldRow}>
          <TextareaAutosize
          className={styles.txtAreaField}
            id="body"
            name="body"
            onChange={onChangeHandler}
            value={emailData.body}
            minRows={5}
           />
        </div>
      </div>
            </div>
            <div
              className={
                direction == RTL_DIRECTION ? styles.modalFooterRTL : styles.modalFooter
              }
            >
              <div
                className={
                  direction == RTL_DIRECTION
                    ? styles.modalFooterInnerRTL
                    : styles.modalFooterInner
                }
              >
                <Button
                  id="cancelMapRes"
                  className={`tertiary`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  onClick={handleCloseEmailModal}
                >
                  {t("cancel")}
                </Button>
                <Button
                  id="mapDataModalRes"
                  className={`primary`}
                  variant="contained"
                  size="small"
                 onClick={saveEmailData}
                >
                  {t("add")}
                </Button>
                
              </div>
            </div>
           </Box>
          
    </>
  );
}

export default EmailPopup;
