// #BugID - 115485
// #BugDescription - save button enabled after adding variables.
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./index.css";
import { Select, MenuItem } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import { store, useGlobalState } from "state-pool";
import arabicStyles from "./ArabicStyles.module.css";
import {
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import SelectWithInput from "../../../../UI/SelectWithInput";
import { getVariableByName } from "../../../../utility/ProcessSettings/Triggers/triggerCommonFunctions";
import { TRIGGER_CONSTANT } from "../../../../Constants/triggerConstants";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import { OpenProcessSliceValue } from "../../../../redux-store/slices/OpenProcessSlice";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

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
      backgroundColor: "#fff",
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    height: 40,
    borderSpacing: "0 0.125rem",
  },
  tableContainer: {
    padding: "1.5rem 0 0",
    height: 270,
  },
  tableRow: {
    height: 40,
  },
  tableHeader: {
    fontWeight: 600,
    fontSize: 13,
    backgroundColor: "#f8f8f8",
    borderTop: "1px solid #f8f8f8",
    borderBottom: "1px solid #f8f8f8",
    borderRadius: "0.125rem",
    color: "black",
    padding: "0 1vw",
  },
  tableBodyCell: {
    fontSize: "var(--base_text_font_size) !important",
    fontWeight: "500 !important",
    padding: "0 1vw",
  },
}));

function EmailTab(props) {
  let { t } = useTranslation();
  const classes = useStyles();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [dropdown, setDropdown] = useState([]);
  const [allData, setAllData] = useState([]);
  const [fromConstant, setFromConstant] = useState(false);
  const [toConstant, settoConstant] = useState(false);
  const [ccConstant, setccConstant] = useState(false);
  const [bccConstant, setbccConstant] = useState(false);
  const [Subject, setSubject] = useState("");
  const [Message, setMessage] = useState("");
  const [priority, setPriority] = useState("");
  const [data, setData] = useState({
    from: "",
    to: "",
    bcc: "",
    cc: "",
  });
  const [contentSubject, setcontentSubject] = useState("");
  const [contentMessage, setcontentMessage] = useState("");
  const [checked, setChecked] = useState({});
  const priorityDropdown = ["Low", "Medium", "High"];
  const openProcessData = useSelector(OpenProcessSliceValue);
  const DropdownOptions = ["Status"];
  const [varDocSelected, setVarDocSelected] = useState(DropdownOptions[0]);
  const [allChecked, setAllChecked] = useState(false);
  const [isStatusCreated, setIsStatusCreated] = useState(null);
  const [isDefaultVal, setIsDefaultVal] = useState(true);
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
  const dispatch = useDispatch();
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut);

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      let isValidObj = validateFunc();
      if (!isValidObj) {
        dispatch(
          setToastDataFunc({
            message: "Please fill constant values",
            severity: "error",
            open: true,
          })
        );
      }
      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked, saveCancelStatus.CancelClicked]);

  useEffect(() => {
    setDropdown(localLoadedProcessData?.Variable);
  }, [localLoadedProcessData?.Variable]);

  useEffect(() => {
    let tempList =
      localLoadedActivityPropertyData?.ActivityProperty?.sendInfo?.emailInfo
        ?.mapselectedprintDocList;
    let temp = {
      [`-998`]: {
        createDoc: "N",
        docTypeId: "-998",
        m_bCreateCheckbox: false,
        m_bPrint: false,
        varFieldId: "0",
        variableId: "0",
        DocName: "Conversation",
      },
    };
    if (tempList && tempList["v_42_0"]) {
      temp = {
        ...temp,
        ["v_42_0"]: {
          docTypeId: "0",
          DocName: "Status",
          createDoc: "N",
          m_bCreateCheckbox: false,
          m_bPrint: false,
          varFieldId: "0",
          variableId: "42",
        },
      };
      if (isStatusCreated === null) {
        setIsStatusCreated(true);
      }
    }
    let tempLocal = JSON.parse(JSON.stringify(openProcessData.loadedData));
    tempLocal?.DocumentTypeList.forEach((el) => {
      temp = {
        ...temp,
        [`d_${el.DocTypeId}`]: {
          createDoc: "N",
          docTypeId: el.DocTypeId,
          m_bCreateCheckbox: false,
          m_bPrint: true,
          varFieldId: "0",
          variableId: "0",
          DocName: el.DocName,
        },
      };
    });
    setAllData(temp);
    let tempCheck = {};
    let isEmailAllChecked = true;
    Object.keys(temp)?.forEach((el) => {
      tempCheck = {
        ...tempCheck,
        [el]: {
          m_bCreateCheckbox: typeof tempList != "undefined" && tempList[el]?.m_bCreateCheckbox
            ? tempList[el].m_bCreateCheckbox
            : false,
          m_bPrint: typeof tempList != "undefined" && tempList[el]?.m_bPrint ? tempList[el].m_bPrint : false,
        },
      };
      if (typeof tempList != "undefined" && !tempList[el]?.m_bPrint) {
        isEmailAllChecked = false;
      }
    });
    setChecked(tempCheck);
    setAllChecked(isEmailAllChecked);

    let tempData = {};
    let mailInfo =
      localLoadedActivityPropertyData?.ActivityProperty?.sendInfo?.emailInfo
        ?.mailInfo;
    if (mailInfo?.m_bFromConst) {
      setFromConstant(true);
      tempData = { ...tempData, from: mailInfo?.fromConstant };
    } else {
      setFromConstant(false);
      tempData = {
        ...tempData,
        from: getVariableByName(
          mailInfo?.fromUser,
          localLoadedProcessData?.Variable
        ),
      };
    }
    if (mailInfo?.m_bToConst) {
      settoConstant(true);
      tempData = { ...tempData, to: mailInfo?.toConstant };
    } else {
      settoConstant(false);
      tempData = {
        ...tempData,
        to: getVariableByName(
          mailInfo?.toUser,
          localLoadedProcessData?.Variable
        ),
      };
    }
    if (mailInfo?.m_bCcConst) {
      setccConstant(true);
      tempData = { ...tempData, cc: mailInfo?.ccConstant };
    } else {
      setccConstant(false);
      tempData = {
        ...tempData,
        cc: getVariableByName(
          mailInfo?.ccUser,
          localLoadedProcessData?.Variable
        ),
      };
    }
    if (mailInfo?.m_bBCcConst) {
      setbccConstant(true);
      tempData = { ...tempData, bcc: mailInfo?.bccConstant };
    } else {
      setbccConstant(false);
      tempData = {
        ...tempData,
        bcc: getVariableByName(
          mailInfo?.bccUser,
          localLoadedProcessData?.Variable
        ),
      };
    }
    setIsDefaultVal(true);
    setData(tempData);
    setPriority(mailInfo?.priority);
    setcontentSubject(mailInfo?.subject);
    setcontentMessage(mailInfo?.message);
  }, [openProcessData.loadedData, localLoadedActivityPropertyData]);

  useEffect(() => {
    let isValidObj = validateFunc();
    if (!isValidObj) {
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.send]: { isModified: true, hasError: true },
        })
      );
    }
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    if (!isDefaultVal) {
      setActivityData(data);
    }
  }, [data, priority, contentSubject, contentMessage]);

  const addHandler = () => {
    let temp1 = { ...allData };
    if (temp1["v_42_0"]) {
      dispatch(
        setToastDataFunc({
          message: t("docAlreadyAdded"),
          severity: "error",
          open: true,
        })
      );
    } else {
      let tempdata = {
        docTypeId: "0",
        DocName: "Status",
        createDoc: "N",
        m_bCreateCheckbox: false,
        m_bPrint: false,
        varFieldId: "0",
        variableId: "42",
      };
      temp1 = { ...temp1, ["v_42_0"]: tempdata }; // key = [v_${variableId}_${varFieldId}]
      setAllData(temp1);

      let temp = { ...localLoadedActivityPropertyData };
      let SavePrint = {
        ...temp.ActivityProperty?.sendInfo?.emailInfo?.mapselectedprintDocList,
      };
      temp.ActivityProperty.sendInfo.emailInfo.mapselectedprintDocList = {
        ...SavePrint,
        [`v_42_0`]: tempdata,
      };
      setlocalLoadedActivityPropertyData(temp);
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.send]: { isModified: true, hasError: false },
        })
      );
    }
  };

  const CheckHandler = (e, el) => {
    let tempCheck = { ...checked };
    let isPrintAllChecked = true;
    if (e.target.name === "m_bPrint" && !e.target.checked) {
      tempCheck[el] = {
        ...tempCheck[el],
        [e.target.name]: e.target.checked,
        m_bCreateCheckbox: false,
      };
    } else {
      tempCheck[el] = { ...tempCheck[el], [e.target.name]: e.target.checked };
    }
    Object.keys(allData)?.forEach((el) => {
      if (!tempCheck[el].m_bPrint) {
        isPrintAllChecked = false;
      }
    });
    setChecked(tempCheck);
    setAllChecked(isPrintAllChecked);
    let temp = { ...localLoadedActivityPropertyData };
    let SavePrint = {
      ...temp.ActivityProperty?.sendInfo?.emailInfo?.mapselectedprintDocList,
    };
    if (el === "-998") {
      temp.ActivityProperty.sendInfo.emailInfo.mapselectedprintDocList = {
        ...SavePrint,
        [`${allData[el].docTypeId}`]: {
          createDoc: allData[el].createDoc,
          docTypeId: allData[el].docTypeId,
          m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
          m_bPrint: tempCheck[el].m_bPrint ? true : false,
          varFieldId: allData[el].varFieldId,
          variableId: allData[el].variableId,
        },
      };
    } else if (el === "v_42_0") {
      setIsStatusCreated(false);
      temp.ActivityProperty.sendInfo.emailInfo.mapselectedprintDocList = {
        ...SavePrint,
        [`v_42_0`]: {
          createDoc: tempCheck[el].m_bCreateCheckbox
            ? "Y"
            : allData[el].createDoc,
          docTypeId: allData[el].docTypeId,
          m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
          m_bPrint: tempCheck[el].m_bPrint ? true : false,
          varFieldId: allData[el].varFieldId,
          variableId: allData[el].variableId,
        },
      };
    } else {
      temp.ActivityProperty.sendInfo.emailInfo.mapselectedprintDocList = {
        ...SavePrint,
        [`d_${allData[el].docTypeId}`]: {
          createDoc: allData[el].createDoc,
          docTypeId: allData[el].docTypeId,
          m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
          m_bPrint: tempCheck[el].m_bPrint ? true : false,
          varFieldId: allData[el].varFieldId,
          variableId: allData[el].variableId,
        },
      };
    }

    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.send]: { isModified: true, hasError: false },
      })
    );
  };

  const setActivityData = (tempData) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    let newObj = {};
    if (!fromConstant) {
      newObj = {
        ...newObj,
        fromUser: tempData.from?.VariableName,
        variableIdFrom: tempData.from?.VariableId,
        varFieldIdFrom: tempData.from?.VarFieldId,
        varFieldTypeFrom: tempData.from?.VariableScope,
        extObjIDFrom: tempData.from?.ExtObjectId,
        m_bFromConst: false,
      };
    } else {
      newObj = {
        ...newObj,
        fromConstant: tempData.from,
        variableIdFrom: "0",
        varFieldIdFrom: "0",
        varFieldTypeFrom: TRIGGER_CONSTANT,
        extObjIDFrom: "0",
        m_bFromConst: true,
      };
    }
    if (!toConstant) {
      newObj = {
        ...newObj,
        toUser: tempData.to?.VariableName,
        variableIdTo: tempData.to?.VariableId,
        varFieldIdTo: tempData.to?.VarFieldId,
        varFieldTypeTo: tempData.to?.VariableScope,
        extObjIDTo: tempData.to?.ExtObjectId,
        m_bToConst: false,
      };
    } else {
      newObj = {
        ...newObj,
        toConstant: tempData.to,
        variableIdTo: "0",
        varFieldIdTo: "0",
        varFieldTypeTo: TRIGGER_CONSTANT,
        extObjIDTo: "0",
        m_bToConst: true,
      };
    }
    if (!ccConstant) {
      newObj = {
        ...newObj,
        ccUser: tempData.cc?.VariableName,
        variableIdCC: tempData.cc?.VariableId,
        varFieldIdCC: tempData.cc?.VarFieldId,
        varFieldTypeCC: tempData.cc?.VariableScope,
        extObjIDCC: tempData.cc?.ExtObjectId,
        m_bCcConst: false,
      };
    } else {
      newObj = {
        ...newObj,
        ccConstant: tempData.cc,
        variableIdCC: "0",
        varFieldIdCC: "0",
        varFieldTypeCC: TRIGGER_CONSTANT,
        extObjIDCC: "0",
        m_bCcConst: true,
      };
    }
    if (!bccConstant) {
      newObj = {
        ...newObj,
        bccUser: tempData.bcc?.VariableName,
        variableIdBCC: tempData.bcc?.VariableId,
        varFieldIdBCC: tempData.bcc?.VarFieldId,
        varFieldTypeBCC: tempData.bcc?.VariableScope,
        extObjIDBCC: tempData.bcc?.ExtObjectId,
        m_bBCcConst: false,
      };
    } else {
      newObj = {
        ...newObj,
        bccConstant: tempData.bcc,
        variableIdBCC: "0",
        varFieldIdBCC: "0",
        varFieldTypeBCC: TRIGGER_CONSTANT,
        extObjIDBCC: "0",
        m_bBCcConst: true,
      };
    }
    newObj = {
      ...newObj,
      priority: priority ? priority : "",
      variableIdPriority: "0",
      varFieldIdPriority: "0",
      varFieldTypePriority: TRIGGER_CONSTANT,
      // extObjIDPriority: "0",
      subject: contentSubject,
      message: contentMessage,
    };

    temp.ActivityProperty.sendInfo.emailInfo.mailInfo = {
      ...newObj,
    };
    
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.send]: { isModified: true, hasError: false },
      })
    );
  };

  const addSubjectHandler = () => {
    let statement = contentSubject;
    statement = statement + "&" + Subject + "&";
    setcontentSubject(statement);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.send]: { isModified: true, hasError: false },
      })
    );
  };

  const addMsgHandler = () => {
    let statement = contentMessage;
    statement = statement + "&" + Message + "&";
    setcontentMessage(statement);
  };

  const validateFunc = () => {
    let mailInfo =
      localLoadedActivityPropertyData?.ActivityProperty?.sendInfo?.emailInfo
        ?.mailInfo;
    if (mailInfo?.m_bFromConst) {
      if (!mailInfo?.fromConstant || mailInfo?.fromConstant?.trim() === "") {
        return false;
      }
    }
    if (mailInfo?.m_bToConst) {
      if (!mailInfo?.toConstant || mailInfo?.toConstant?.trim() === "") {
        return false;
      }
    }
    if (mailInfo?.m_bCcConst) {
      if (!mailInfo?.ccConstant || mailInfo?.ccConstant?.trim() === "") {
        return false;
      }
    }
    if (mailInfo?.m_bBCcConst) {
      if (!mailInfo?.bccConstant || mailInfo?.bccConstant?.trim() === "") {
        return false;
      }
    }
    return true;
  };

  const onChange = (field, val) => {
    let tempData = { ...data };
    tempData = { ...tempData, [field]: val };
    setIsDefaultVal(false);
    setData(tempData);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.send]: { isModified: true, hasError: false },
      })
    );
  };

  const docTypeHandler = (e) => {
    setVarDocSelected(e.target.value);
  };

  const handleAllCheck = (e) => {
    setIsStatusCreated(false);
    setAllChecked(e.target.checked);
    let tempCheck = { ...checked };
    Object.keys(allData)?.forEach((el) => {
      if (!e.target.checked) {
        tempCheck[el] = {
          ...tempCheck[el],
          m_bPrint: e.target.checked,
          m_bCreateCheckbox: false,
        };
      } else {
        tempCheck[el] = { ...tempCheck[el], m_bPrint: e.target.checked };
      }
    });
    setChecked(tempCheck);
    let temp = { ...localLoadedActivityPropertyData };
    let SavePrint = {
      ...temp.ActivityProperty?.sendInfo?.emailInfo?.mapselectedprintDocList,
    };
    let tempLocalCheck = {};
    Object.keys(allData)?.forEach((el) => {
      if (el === "-998") {
        tempLocalCheck = {
          ...tempLocalCheck,
          [`${allData[el].docTypeId}`]: {
            createDoc: allData[el].createDoc,
            docTypeId: allData[el].docTypeId,
            m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
            m_bPrint: tempCheck[el].m_bPrint ? true : false,
            varFieldId: allData[el].varFieldId,
            variableId: allData[el].variableId,
          },
        };
      } else if (el === "v_42_0") {
        tempLocalCheck = {
          ...tempLocalCheck,
          [`v_42_0`]: {
            createDoc: tempCheck[el].m_bCreateCheckbox
              ? "Y"
              : allData[el].createDoc,
            docTypeId: allData[el].docTypeId,
            m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
            m_bPrint: tempCheck[el].m_bPrint ? true : false,
            varFieldId: allData[el].varFieldId,
            variableId: allData[el].variableId,
          },
        };
      } else {
        tempLocalCheck = {
          ...tempLocalCheck,
          [`d_${allData[el].docTypeId}`]: {
            createDoc: allData[el].createDoc,
            docTypeId: allData[el].docTypeId,
            m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
            m_bPrint: tempCheck[el].m_bPrint ? true : false,
            varFieldId: allData[el].varFieldId,
            variableId: allData[el].variableId,
          },
        };
      }
    });

    temp.ActivityProperty.sendInfo.emailInfo.mapselectedprintDocList = {
      ...SavePrint,
      ...tempLocalCheck,
    };
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.send]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <div className="marginAllAround">
      <div>
        <div
          className="row"
          style={{ justifyContent: "space-between", gap: "2vw" }}
        >
          <div style={{ flex: "1" }}>
            <p className="varUsedLabel">
              {t("from")}
              <span className="starIcon">*</span>
            </p>
            <SelectWithInput
              dropdownOptions={dropdown}
              optionKey="VariableName"
              setIsConstant={(val) => {
                setFromConstant(val);
              }}
              setValue={(val) => onChange("from", val)}
              value={data.from}
              isConstant={fromConstant}
              showEmptyString={false}
              showConstValue={true}
              disabled={isReadOnly}
              id="from_select_input"
            />
          </div>
          <div style={{ flex: "1" }}>
            <p className="varUsedLabel">
              {t("to")}
              <span className="starIcon">*</span>
            </p>
            <SelectWithInput
              dropdownOptions={dropdown}
              optionKey="VariableName"
              setIsConstant={settoConstant}
              setValue={(val) => onChange("to", val)}
              value={data.to}
              isConstant={toConstant}
              showEmptyString={false}
              showConstValue={true}
              disabled={isReadOnly}
              id="to_select_input"
            />
          </div>
          <div style={{ flex: "1" }}>
            <p className="varUsedLabel">{t("CC")}</p>
            <SelectWithInput
              dropdownOptions={dropdown}
              optionKey="VariableName"
              setIsConstant={setccConstant}
              setValue={(val) => onChange("cc", val)}
              value={data.cc}
              isConstant={ccConstant}
              showEmptyString={false}
              showConstValue={true}
              disabled={isReadOnly}
              id="cc_select_input" //code edited on 21 June 2022 for BugId 110973
            />
          </div>
          <div style={{ flex: "1" }}>
            <p className="varUsedLabel">{t("BCC")}</p>
            <SelectWithInput
              dropdownOptions={dropdown}
              optionKey="VariableName"
              setIsConstant={setbccConstant}
              setValue={(val) => onChange("bcc", val)}
              value={data.bcc}
              isConstant={bccConstant}
              showEmptyString={false}
              showConstValue={true}
              disabled={isReadOnly}
              id="bcc_select_input" //code edited on 21 June 2022 for BugId 110973
            />
          </div>
          <div style={{ flex: "1" }}>
            <p className="varUsedLabel">{t("Priority")}</p>
            <Select
              className="dropdownEmail"
              MenuProps={menuProps}
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setIsDefaultVal(false);
              }}
              id="priority_email"
              disabled={isReadOnly}
              style={{ marginBottom: "1rem" }}
            >
              {priorityDropdown?.map((element) => {
                return (
                  <MenuItem
                    className="menuItemStylesDropdown"
                    key={element}
                    value={element}
                  >
                    {element}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        </div>
      </div>
      <p className="boldText">{t("Subject")}</p>
      <p className="varUsedLabel">{t("includeVariable")}</p>
      <div className="row" style={{ gap: "1vw" }}>
        <Select
          className="dropdownEmail"
          MenuProps={menuProps}
          id="includeVar_email"
          value={Subject}
          disabled={isReadOnly}
          onChange={(e) => setSubject(e.target.value)}
        >
          {dropdown?.map((element) => {
            return (
              <MenuItem
                className="menuItemStylesDropdown"
                value={element.VariableName}
              >
                {element.VariableName}
              </MenuItem>
            );
          })}
        </Select>
        <button
          className={isReadOnly ? "disabledbtnEmail" : "addbtnEmail"}
          disabled={isReadOnly}
          onClick={addSubjectHandler}
        >
          {t("add")}
        </button>
      </div>
      <p className="varUsedLabel">{t("Content")}</p>
      <textarea
        style={{ width: "80%", height: "5rem", border: "1px solid #c4c4c4" }}
        id="content_email"
        value={contentSubject}
        disabled={isReadOnly}
        onChange={(e) => setcontentSubject(e.target.value)}
      />
      <p className="boldText">{t("msg")}</p>
      <p className="varUsedLabel">{t("includeVariable")}</p>
      <div className="row" style={{ gap: "1vw" }}>
        <Select
          className="dropdownEmail"
          MenuProps={menuProps}
          id="msgInclude_email"
          value={Message}
          onChange={(e) => {
            setMessage(e.target.value);
            setIsDefaultVal(false);
          }}
          disabled={isReadOnly}
        >
          {dropdown?.map((element) => {
            return (
              <MenuItem
                className="menuItemStylesDropdown"
                value={element.VariableName}
              >
                {element.VariableName}
              </MenuItem>
            );
          })}
        </Select>
        <button
          className={isReadOnly ? "disabledbtnEmail" : "addbtnEmail"}
          disabled={isReadOnly}
          onClick={addMsgHandler}
        >
          {t("add")}
        </button>
      </div>
      <p className="varUsedLabel">{t("Content")}</p>
      <textarea
        style={{ width: "80%", height: "5rem", border: "1px solid #c4c4c4" }}
        id="email_content_msg"
        value={contentMessage}
        disabled={isReadOnly}
        onChange={(e) => {
          setcontentMessage(e.target.value);
          setIsDefaultVal(false);
        }}
      />
      <hr className="hrLineSend" />

      <div className="row" style={{ alignItems: "end", gap: "1vw" }}>
        <div>
          <p className="varUsedLabel">{t("DocType")}</p>
          <Select
            className="dropdownEmail"
            MenuProps={menuProps}
            value={varDocSelected}
            onChange={(event) => docTypeHandler(event)}
            style={{ margin: "var(--spacing_v) 0" }}
            disabled={isReadOnly}
          >
            {DropdownOptions?.map((element) => {
              return (
                <MenuItem
                  className="menuItemStylesDropdown"
                  key={element}
                  value={element}
                >
                  {element}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <button
          className={isReadOnly ? "disabledbtnEmail" : "addbtnEmail"}
          disabled={isReadOnly}
          style={{ margin: "0 !important" }}
          onClick={addHandler}
        >
          {t("add")}
        </button>
      </div>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table
          className={`${classes.table} ${
            props.isDrawerExpanded
              ? "webServicePropertiestableEx"
              : "webServicePropertiestableCo"
          } webServicePropertiestable`}
          style={{ width: "60%" }}
          aria-label="customized table"
          stickyHeader
        >
          <TableHead>
            <StyledTableRow className={classes.tableRow}>
              <StyledTableCell
                className={classes.tableHeader}
                style={{ width: "32vw" }}
              >
                {t("Document")}
              </StyledTableCell>
              <StyledTableCell
                className={classes.tableHeader}
                style={{ width: "32vw" }}
              >
                <Checkbox
                  className="emailCheck"
                  checked={allChecked}
                  onChange={(e) => handleAllCheck(e)}
                  disabled={isReadOnly}
                />
                {t("email")}
              </StyledTableCell>
              <StyledTableCell
                className={classes.tableHeader}
                style={{ width: "32vw" }}
              >
                <Checkbox className="emailCheck" disabled />
                {t("CreateIfNotFound")}
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody className="associatedTemplateDiv">
            {Object.keys(allData).map((el) => (
              <StyledTableRow
                key={allData[el].DocId}
                className={classes.tableRow}
              >
                <StyledTableCell
                  className={classes.tableBodyCell}
                  component="th"
                  scope="row"
                  style={{ width: "32vw" }}
                >
                  {allData[el].DocName}
                </StyledTableCell>

                <StyledTableCell
                  className={classes.tableBodyCell}
                  style={{ width: "32vw" }}
                >
                  <Checkbox
                    className="emailCheck"
                    name="m_bPrint"
                    checked={checked[el]?.m_bPrint}
                    onChange={(e) => CheckHandler(e, el)}
                    disabled={isReadOnly}
                  />
                </StyledTableCell>
                <StyledTableCell
                  className={classes.tableBodyCell}
                  style={{ width: "32vw" }}
                >
                  <Checkbox
                    className="emailCheck"
                    name="m_bCreateCheckbox"
                    disabled={
                      allData[el].DocName !== "Status" || isReadOnly
                        ? true
                        : (isStatusCreated &&
                            allData[el].DocName === "Status") ||
                          isReadOnly
                        ? true
                        : !checked[el]?.m_bPrint || isReadOnly
                        ? true
                        : false
                    }
                    checked={
                      isStatusCreated ? false : checked[el]?.m_bCreateCheckbox
                    }
                    onChange={(e) => CheckHandler(e, el)}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
  };
};

export default connect(mapStateToProps, null)(EmailTab);
