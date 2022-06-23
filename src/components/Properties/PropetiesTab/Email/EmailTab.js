import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";
import "./index.css";
import { Select, MenuItem } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
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

function EmailTab(props) {
  let { t } = useTranslation();
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
  const [Subject, setSubject] = useState(null);
  const [Message, setMessage] = useState(null);
  const [priority, setPriority] = useState(null);
  const [data, setData] = useState({});
  const [contentSubject, setcontentSubject] = useState("");
  const [contentMessage, setcontentMessage] = useState("");
  const [checked, setChecked] = useState({});
  const [priorityDropdown, setpriorityDropdown] = useState([
    "Low",
    "Medium",
    "High",
  ]);
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
  }, [localLoadedProcessData]);

  useEffect(() => {
    let temp = {};
    localLoadedProcessData?.DocumentTypeList.forEach((el) => {
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
    let tempList =
      localLoadedActivityPropertyData.ActivityProperty?.sendInfo?.emailInfo
        ?.mapselectedprintDocList;
    Object.keys(tempList).forEach((el) => {
      tempList[el] = { ...tempList[el] };
    });

    let tempCheck = {};
    Object.keys(tempList).forEach((el) => {
      tempCheck = {
        ...tempCheck,
        [el]: {
          m_bCreateCheckbox: tempList[el].m_bCreateCheckbox,
          m_bPrint: tempList[el].m_bPrint,
        },
      };
    });
    setChecked(tempCheck);

    //-------
    let tempData = {};
    let mailInfo =
      localLoadedActivityPropertyData.ActivityProperty?.sendInfo?.emailInfo
        ?.mailInfo;
    if (mailInfo.m_bFromConst) {
      setFromConstant(true);
      tempData = { ...tempData, from: mailInfo.fromUser };
    } else {
      setFromConstant(false);
      tempData = {
        ...tempData,
        from: getVariableByName(
          mailInfo.fromUser,
          localLoadedProcessData?.Variable
        ),
      };
    }
    if (mailInfo.m_bToConst) {
      settoConstant(true);
      tempData = { ...tempData, to: mailInfo.toUser };
    } else {
      settoConstant(false);
      tempData = {
        ...tempData,
        to: getVariableByName(
          mailInfo.toUser,
          localLoadedProcessData?.Variable
        ),
      };
    }
    if (mailInfo.m_bCcConst) {
      tempData = { ...tempData, cc: mailInfo.ccUser };
      setccConstant(true);
    } else {
      setccConstant(false);
      tempData = {
        ...tempData,
        cc: getVariableByName(
          mailInfo.ccUser,
          localLoadedProcessData?.Variable
        ),
      };
    }
    if (mailInfo.m_bBCcConst) {
      tempData = { ...tempData, bcc: mailInfo.bccUser };
      setbccConstant(true);
    } else {
      setbccConstant(false);
      tempData = {
        ...tempData,
        bcc: getVariableByName(
          mailInfo.bccUser,
          localLoadedProcessData?.Variable
        ),
      };
    }
    setData(tempData);
    if (mailInfo.priority == "1") {
      setPriority("Low");
    } else if (mailInfo.priority == "2") {
      setPriority("Medium");
    } else if (mailInfo.priority == "3") {
      setPriority("High");
    } else {
      setPriority("");
    }
    setcontentSubject(mailInfo.subject);
    setcontentMessage(mailInfo.message);
  }, []);

  useEffect(() => {
    setActivityData(data);
  }, [data]);

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

  const CheckHandler = (e, el) => {
    let tempCheck = { ...checked };
    tempCheck[el] = {};
  };

  const priorityTypeHandler = (e) => {
    setPriority(e.target.value);
  };
  const SubjectTypeHandler = (e) => {
    setSubject(e.target.value);
  };
  const messageTypeHandler = (e) => {
    setMessage(e.target.value);
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
        fromUser: tempData.from,
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
        toUser: tempData.to,
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
        ccUser: tempData.cc,
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
        bccUser: tempData.bcc,
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
  };

  const addSubjectHandler = () => {
    let statement = contentSubject;
    statement = statement + "&" + Subject + "&";
    setcontentSubject(statement);
  };
  const addMsgHandler = () => {
    let statement = contentMessage;
    statement = statement + "&" + Message + "&";
    setcontentMessage(statement);
  };

  const validateFunc = () => {
    let mailInfo =
      localLoadedActivityPropertyData.ActivityProperty?.sendInfo?.emailInfo
        ?.mailInfo;
    if (mailInfo.m_bFromConst) {
      if (!mailInfo.fromUser || mailInfo.fromUser?.trim() === "") {
        return false;
      }
    }
    if (mailInfo.m_bToConst) {
      if (!mailInfo.toUser || mailInfo.toUser?.trim() === "") {
        return false;
      }
    }
    if (mailInfo.m_bCcConst) {
      if (!mailInfo.ccUser || mailInfo.ccUser?.trim() === "") {
        return false;
      }
    }
    if (mailInfo.m_bBCcConst) {
      if (!mailInfo.bccUser || mailInfo.bccUser?.trim() === "") {
        return false;
      }
    }
    return true;
  };

  const onChange = (field, val) => {
    let tempData = { ...data };
    tempData = { ...tempData, [field]: val };
    setData(tempData);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.send]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <div className="marginAllAround">
      <div className="row">
        <div>
          <p className="varUsedLabel">{t("from")}*</p>

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
            // disabled={readOnlyProcess}
            id="from_select_input"
          />
        </div>
        <div>
          <p className="varUsedLabel">{t("to")}*</p>
          <SelectWithInput
            dropdownOptions={dropdown}
            optionKey="VariableName"
            setIsConstant={settoConstant}
            setValue={(val) => onChange("to", val)}
            value={data.to}
            isConstant={toConstant}
            showEmptyString={false}
            showConstValue={true}
            // disabled={readOnlyProcess}
            id="to_select_input"
          />
        </div>
        <div>
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
            // disabled={readOnlyProcess}
            id="to_select_input"
          />
        </div>
        <div>
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
            // disabled={readOnlyProcess}
            id="to_select_input"
          />
        </div>
        <div>
          <p className="varUsedLabel">{t("Priority")}</p>
          <Select
            className="dropdownEmail"
            MenuProps={menuProps}
            value={priority}
            onChange={(event) => priorityTypeHandler(event)}
            id="priority_email"
          >
            {priorityDropdown &&
              priorityDropdown.map((element) => {
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

      <p className="boldText">{t("Subject")}</p>
      <p className="varUsedLabel">{t("includeVariable")}</p>
      <div className="row">
        <Select
          className="dropdownEmail"
          MenuProps={menuProps}
          id="includeVar_email"
          value={Subject}
          onChange={(event) => SubjectTypeHandler(event)}
        >
          {dropdown &&
            dropdown.map((element) => {
              return (
                <MenuItem
                  className="menuItemStylesDropdown"
                  key={element.VariableName}
                  value={element.VariableName}
                >
                  {element.VariableName}
                </MenuItem>
              );
            })}
        </Select>
        <button className="addbtnEmail" onClick={addSubjectHandler}>
          {t("add")}
        </button>
      </div>
      <p className="varUsedLabel">{t("Content")}</p>
      <textarea
        style={{ width: "80%", height: "5rem", border: "1px solid #c4c4c4" }}
        id="content_email"
        value={contentSubject}
      />

      <p className="boldText">{t("msg")}</p>
      <p className="varUsedLabel">{t("includeVariable")}</p>
      <div className="row">
        <Select
          className="dropdownEmail"
          MenuProps={menuProps}
          id="msgInclude_email"
          value={Message}
          onChange={(event) => messageTypeHandler(event)}
        >
          {dropdown &&
            dropdown.map((element) => {
              return (
                <MenuItem
                  className="menuItemStylesDropdown"
                  key={element.VariableName}
                  value={element.VariableName}
                >
                  {element.VariableName}
                </MenuItem>
              );
            })}
        </Select>
        <button className="addbtnEmail" onClick={addMsgHandler}>
          {t("add")}
        </button>
      </div>
      <p className="varUsedLabel">{t("Content")}</p>
      <textarea
        style={{ width: "80%", height: "5rem", border: "1px solid #c4c4c4" }}
        id="email_content_msg"
        value={contentMessage}
      />
      <hr className="hrLineSend" />

      <p className="varUsedLabel">{t("varUsedForDocType")}</p>

      <div className="row">
        <Select
          className="dropdownEmail"
          MenuProps={menuProps}
          id="varUsedForDocType_email"
        >
          {dropdown &&
            dropdown.map((element) => {
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

        <button className="addbtnEmail">{t("add")}</button>
      </div>

      <table style={{ marginTop: "1.5rem" }}>
        <tr style={{ background: "#F8F8F8", height: "40px" }}>
          <td className="document" style={{ fontWeight: "600" }}>
            {t("Document")}
          </td>
          <td className="print" style={{ fontWeight: "600" }}>
            {t("Print")}
          </td>
          <td className="notFound" style={{ fontWeight: "600" }}>
            {t("Create if not found")}
          </td>
        </tr>
        <tbody>
          {Object.keys(allData)?.map((el) => {
            return (
              <tr
                style={{
                  height: "30px",
                  padding: "12px",
                  //   background: index % 2 ? "#f8f8f8" : null,
                }}
              >
                <td className="document">{allData[el].DocName}</td>
                <td className="print" style={{ paddingLeft: "10px" }}>
                  <Checkbox
                    style={{
                      height: "14px",
                      width: "14px",
                    }}
                    checked={checked[el]?.m_bPrint}
                    onChange={(e) => CheckHandler(e, el)}
                  />
                </td>
                <td className="notFound" style={{ paddingLeft: "50px" }}>
                  <Checkbox
                    style={{
                      height: "14px",
                      width: "14px",
                    }}
                    checked={checked[el]?.m_bCreateCheckbox}
                    onChange={(e) => CheckHandler(e, el)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EmailTab;
