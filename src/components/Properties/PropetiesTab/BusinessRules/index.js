// #BugID - 112016(Save changes button is not working)
//Date:7th July 2022
// #BugDescription - Handled the checks for submitting the save changes button.

import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";
import { FormControl, FormHelperText, Button, Box } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { useTranslation } from "react-i18next";
import {
  activityType_label,
  ENDPOINT_GET_RULE_MEMBER_LIST,
  ENDPOINT_REST_PACKAGE,
  RTL_DIRECTION,
  ENDPOINT_RULE_FLOW_VERSION,
  ENDPOINT_RULE_PACKAGE_VERSION,
  SERVER_URL,
  ENDPOINT_SOAP_PACKAGE,
  propertiesLabel,
  COMPLEX_VARTYPE,
} from "../../../../Constants/appConstants";
import "./index.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import DeleteIcon from "@material-ui/icons/Delete";
import { store, useGlobalState } from "state-pool";
import axios from "axios";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import Toast from "../../../../UI/ErrorToast";
import { getVarTypeAndIsArray } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";
import TabsHeading from "../../../../UI/TabsHeading";

function BusinessRules(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [ruleFlow, setRuleFlow] = useState({ id: "", name: "" });
  const [ruleVersion, setRuleVersion] = useState("");
  const [rulePackage, setRulePackage] = useState({ id: "", name: "" });
  const [packageVersion, setPackageVersion] = useState("");
  const [mapping, setMapping] = useState(false);
  const [ruleFlowItems, setRuleFlowItems] = useState([]);
  const [rulePackageItems, setrulePackageItems] = useState([]);
  const [flowVersionItems, setRuleVersionItem] = useState([]);
  const [packageVersionItems, setPackageVersionItem] = useState([]);
  const [associateList, setAssociateList] = useState([]);
  const [mappedSelectedRule, setMappedSelectedRule] = useState("");
  const [serviceType, setServiceType] = useState(
    localLoadedActivityPropertyData?.ActivityProperty?.m_objBusinessRule?.m_bIsRestService.toString()
  );
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState({ severity: "", msg: "" });
  const timeslot = [];
  const [defaultTime, setDefaultTime] = useState("10");
  const [brtProcess, setBrtProcess] = useState([]);
  const [brtFwdInputs, setFwdBrtInputs] = useState([]);
  const [revInputs, setRevInputs] = useState([]);
  const [brtRevInputs, setBrtRevInputs] = useState([]);
  const [value, setValue] = React.useState("1");

  for (let i = 0; i < 100; i++) {
    timeslot.push(i);
  }

  useEffect(() => {
    const mappedData =
      localLoadedActivityPropertyData?.ActivityProperty?.m_objBusinessRule
        ?.m_arrAssocBRMSRuleSetList;
    axios
      .get(
        SERVER_URL +
          ENDPOINT_REST_PACKAGE +
          `?restService=${serviceType == "true"}`
      )
      .then((response) => {
        setRuleFlowItems(
          response.data?.m_arrBRMSRuleFlowList?.map((item) => ({
            id: item.m_strRSetId,
            value: item.m_strRSetName,
          }))
        );
        setrulePackageItems(
          response?.data.m_arrBRMSRuleSetList?.map((item) => ({
            id: item.m_strRSetId,
            value: item.m_strRSetName,
          }))
        );
        setAssociateList(
          mappedData.map((item, i) => ({
            id: getId(
              item.m_strRSetName,
              item.m_strRuleType == "F"
                ? response.data.m_arrBRMSRuleFlowList
                : response.data.m_arrBRMSRuleSetList
            ),
            name: item.m_strRSetName,
            version: item.m_strRSetVersion,
            type: item.m_strRuleType,
            time: item.m_strTimeOutInterval,
            mapInfo: item.m_arrMappingInfo,
          }))
        );
        setRuleFlow({ id: "", name: "" });
      })
      .catch((error) => {
        console.log(error);
      });

    let tempVarList = [];
    localLoadedProcessData?.Variable?.forEach((_var) => {
      if (_var.VariableType === COMPLEX_VARTYPE) {
        let tempList = getComplex(_var);
        tempList?.forEach((el) => {
          tempVarList.push(el);
        });
      } else {
        tempVarList.push(_var);
      }
    });
    setBrtProcess(tempVarList);
  }, []);

  //function for data association
  function associateData(type) {
    let data;

    if (type == "ruleflow") {
      if (ruleFlow.id == "" && ruleFlow.name == "") {
        setIsError(true);
        setErrorMsg({
          msg: t("toolbox.businessRules.errormsg1"),
          severity: "error",
        });
        return false;
      }

      data = {
        id: ruleFlow.id,
        name: ruleFlow.name,
        version: ruleVersion,
        type: t("toolbox.businessRules.ruleflow"),
        time: "10",
        mapInfo: null,
      };
    } else {
      if (rulePackage.id == "" && rulePackage.name == "") {
        setIsError(true);
        setErrorMsg({
          msg: t("toolbox.businessRules.errormsg2"),
          severity: "error",
        });
        return false;
      }

      data = {
        id: rulePackage.id,
        name: rulePackage.name,
        version: packageVersion,
        type: t("toolbox.businessRules.rulepackage"),
        time: "10",
        mapInfo: null,
      };
    }

    var isStack = false;
    associateList?.forEach((item) => {
      if (item.name == data.name && item.version == data.version) {
        isStack = true;
      }
    });
    if (isStack == true) {
      setIsError(true);
      setErrorMsg({
        msg: `This ${data.name} and version ${data.version} are already mapped`,
        severity: "error",
      });
      return false;
    } else {
      setAssociateList([...associateList, data]);
      let tempLocalState = JSON.parse(
        JSON.stringify(localLoadedActivityPropertyData)
      );
      let lastIndex =
        localLoadedActivityPropertyData?.ActivityProperty?.m_objBusinessRule
          ?.m_arrAssocBRMSRuleSetList.length;
      const nameVersion = data.name + "(" + data.version + ")";
      const activityData = {
        m_arrMappingInfo: [],
        m_bSelectRow: false,
        m_iRSetOrder: lastIndex + 1,
        m_strRSetId: data.id,
        m_strRSetName: data.name,
        m_strRSetNameWithVersion: nameVersion,
        m_strRSetVersion: data.version,
        m_strRuleType: data.type,
        m_strTimeOutInterval: "0",
        m_strVersionTitle: nameVersion,
      };
      tempLocalState?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList.push(
        activityData
      );
      setlocalLoadedActivityPropertyData(tempLocalState);
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.businessRule]: { isModified: true, hasError: false },
        })
      );
    }
  }

  const getComplex = (variable) => {
    let varList = [];
    let varRelationMapArr = variable?.RelationAndMapping
      ? variable.RelationAndMapping
      : variable["Relation&Mapping"];
    varRelationMapArr?.Mappings?.Mapping?.forEach((el) => {
      if (el.VariableType === "11") {
        let tempList = getComplex(el);
        tempList.forEach((ell) => {
          varList.push({
            ...ell,
            SystemDefinedName: `${variable.VariableName}.${ell.VariableName}`,
            VariableName: `${variable.VariableName}.${ell.VariableName}`,
          });
        });
      } else {
        varList.push({
          DefaultValue: "",
          ExtObjectId: el.ExtObjectId ? el.ExtObjectId : variable.ExtObjectId,
          SystemDefinedName: `${variable.VariableName}.${el.VariableName}`,
          Unbounded: el.Unbounded,
          VarFieldId: el.VarFieldId,
          VarPrecision: el.VarPrecision,
          VariableId: el.VariableId,
          VariableLength: el.VariableLength,
          VariableName: `${variable.VariableName}.${el.VariableName}`,
          VariableScope: el.VariableScope
            ? el.VariableScope
            : variable.VariableScope,
          VariableType: el.VariableType,
        });
      }
    });
    return varList;
  };

  function mapData(id, version, type, mapInfo, time, name) {
    setMappedSelectedRule(name);
    setMapping(true);
    setDefaultTime(time);
    let fwdInfo, revInfo;
    if (mapInfo == null) {
      fwdInfo = null;
      revInfo = null;
    } else {
      fwdInfo = mapInfo?.filter((data) => data.m_strMappingType == "F");
      revInfo = mapInfo?.filter((data) => data.m_strMappingType == "R");
    }

    // code edited on 22 August 2022 for BugId 114460
    const postData = {
      ruleSetNo: id,
      ruleSetVersionId: version === "Version Free" ? "0.0" : version,
      ruleType: type,
    };

    axios
      .post(SERVER_URL + ENDPOINT_GET_RULE_MEMBER_LIST, postData)
      .then((res) => {
        //code edited on 19 Aug 2022 for BugId 114416
        const fwdList = res?.data?.m_arrFwdMappingList;
        setFwdBrtInputs(
          fwdList?.map((item, i) => ({
            input: item.m_strParameterName,
            fullName: item.m_strParemterFullName,
            process: "",
            type: item.m_strParameterDataType,
            varType: getVarTypeAndIsArray(item.m_strVarDataType).variableType,
            varFieldId: item.m_strVarFieldId,
            varId: item.m_strVariableId,
            name: item.m_strVarName,
            parentIsArray: item.m_strParentIsArray,
            unbounded: getVarTypeAndIsArray(item.m_strVarDataType).isArray,
            info:
              fwdInfo != null
                ? fwdInfo?.some(
                    (data) =>
                      data.m_strParameterDataType ==
                        item.m_strParameterDataType &&
                      data.m_strParameterName == item.m_strParameterName
                  )
                : null,
          }))
        );

        //code edited on 19 Aug 2022 for BugId 114416
        const revList = res?.data?.m_arrRvrMappingList;
        setRevInputs(
          revList?.map((item, i) => ({
            input: item.m_strParameterName,
            fullName: item.m_strParemterFullName,
            process: "",
            type: item.m_strParameterDataType,
            varType: getVarTypeAndIsArray(item.m_strVarDataType).variableType,
            varFieldId: item.m_strVarFieldId,
            varId: item.m_strVariableId,
            name: item.m_strVarName,
            parentIsArray: item.m_strParentIsArray,
            unbounded: getVarTypeAndIsArray(item.m_strVarDataType).isArray,
            info:
              fwdInfo != null
                ? fwdInfo?.some(
                    (data) =>
                      data.m_strParameterDataType ==
                        item.m_strParameterDataType &&
                      data.m_strParameterName == item.m_strParameterName
                  )
                : null,
          }))
        );

        {
          /*code updated on 6 July 2022 for BugId 111907*/
        }
        let tempRevVarLIst = [];
        localLoadedProcessData?.Variable?.forEach((item, i) => {
          if (
            (item.VariableScope === "U" && checkForModifyRights(item)) ||
            (item.VariableScope === "I" && checkForModifyRights(item))
          ) {
            if (item.VariableType === "11") {
              let tempList = getComplex(item);
              tempList?.forEach((el) => {
                tempRevVarLIst.push(el);
              });
            } else {
              tempRevVarLIst.push(item);
            }
          }
        });
        setBrtRevInputs(tempRevVarLIst);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const checkForModifyRights = (data) => {
    let temp = false;
    localLoadedActivityPropertyData?.ActivityProperty?.m_objDataVarMappingInfo?.dataVarList?.forEach(
      (item, i) => {
        if (item?.processVarInfo?.variableId === data.VariableId) {
          if (item?.m_strFetchedRights === "O") {
            temp = true;
          }
        }
      }
    );
    return temp;
  };

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  function changeRuleFlow(e) {
    var item = ruleFlowItems?.find((item) => item.id === e.target.value);
    setRuleFlow({ id: e.target.value, name: item.value });

    axios
      .get(
        SERVER_URL +
          ENDPOINT_RULE_FLOW_VERSION +
          "?m_strSelectedRuleSetId=" +
          e.target.value
      )
      .then(function (response) {
        setRuleVersion(response?.data?.versions[0]);
        setRuleVersionItem(
          response?.data?.versions?.map((data) => ({
            label: data,
            value: data,
          }))
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function changeRulePackage(e) {
    var item = rulePackageItems?.find((item) => item.id === e.target.value);
    setRulePackage({ id: e.target.value, name: item.value });

    axios
      .get(
        SERVER_URL +
          ENDPOINT_RULE_PACKAGE_VERSION +
          "?m_strSelectedRuleSetId=" +
          e.target.value
      )
      .then(function (response) {
        setPackageVersion(response.data.versions[0]);
        setPackageVersionItem(
          response?.data?.versions?.map((data) => ({
            label: data,
            value: data,
          }))
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const getId = (name, arr) => {
    const ruleList = [...arr];
    const rule = ruleList?.find((data) => data.m_strRSetName == name);
    if (rule) {
      return rule.m_strRSetId;
    } else {
      return null;
    }
  };

  function deleteData(id, i) {
    setMapping(false);
    setAssociateList(associateList?.filter((item) => item.id !== id));
    let tempLocalState = JSON.parse(
      JSON.stringify(localLoadedActivityPropertyData)
    );
    tempLocalState?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList?.splice(
      i,
      1
    );
    setlocalLoadedActivityPropertyData(tempLocalState);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.businessRule]: { isModified: true, hasError: false },
      })
    );
  }

  /*code updated on 6 July 2022 for BugId 111907*/
  const getFilteredVarList = (item) => {
    let temp = [];

    brtProcess.forEach((_var) => {
      if (
        _var.VariableScope === "M" ||
        _var.VariableScope === "S" ||
        (_var.VariableScope === "U" && checkForVarRights(_var)) ||
        (_var.VariableScope === "I" && checkForVarRights(_var))
      ) {
        if (
          _var.VariableType == item.varType &&
          _var.Unbounded == item.unbounded
        ) {
          temp.push(_var);
        }
      }
    });
    return temp;
  };

  /*code added on 6 July 2022 for BugId 111907*/
  const checkForVarRights = (data) => {
    let temp = false;
    localLoadedActivityPropertyData?.ActivityProperty?.m_objDataVarMappingInfo?.dataVarList?.forEach(
      (item, i) => {
        if (item?.processVarInfo?.variableId === data.VariableId) {
          if (
            item?.m_strFetchedRights === "O" ||
            item?.m_strFetchedRights === "R"
          ) {
            temp = true;
          }
        }
      }
    );
    return temp;
  };

  const getSelectedMappingData = (item) => {
    let temp = "0";
    localLoadedActivityPropertyData?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList?.forEach(
      (ruleName) => {
        if (ruleName.m_strRSetName === mappedSelectedRule) {
          ruleName?.m_arrMappingInfo
            ?.filter((d) => d.m_strMappingType === "F")
            .forEach((rule) => {
              if (item.input == rule.m_strParameterName) {
                temp = rule.m_strVarName;
              }
            });
        }
      }
    );

    return temp;
  };

  const getRevMapId = (id) => {
    let temp = {};
    brtProcess?.forEach((item) => {
      if (item.VariableName == id) {
        temp = item;
      }
    });

    return temp;
  };

  const getFilteredInputList = (id, fieldId) => {
    let temp = [];
    let allInput = "";
    let type = "";
    let unbounded = "";
    brtProcess?.forEach((item) => {
      if (item.VariableId == id && item.VarFieldId == fieldId) {
        type = item.VariableType;
        unbounded = item.Unbounded;
      }
    });
    allInput = revInputs?.filter(
      (data) => data.type == type && data.unbounded == unbounded
    );
    return allInput;
  };

  const getSelectedOutputData = (varName) => {
    let temp = "0";
    localLoadedActivityPropertyData?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList?.forEach(
      (ruleName) => {
        if (ruleName.m_strRSetName === mappedSelectedRule) {
          ruleName?.m_arrMappingInfo
            ?.filter((d) => d.m_strMappingType === "R")
            .forEach((rule) => {
              if (rule.m_strVarName === varName) {
                temp = rule.m_strParameterName;
              }
            });
        }
      }
    );
    return temp;
  };

  /*code updated on 7th July 2022 for BugId 112016*/
  const selectedOutputVal = (value, item, mapType) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    temp?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList?.map(
      (ruleName) => {
        if (ruleName.m_strRSetName === mappedSelectedRule) {
          if (
            Array.isArray(ruleName.m_arrMappingInfo) &&
            ruleName.m_arrMappingInfo.length > 0
          ) {
            let isFExist = false,
              fIndex = null;
            let isRExist = false,
              rIndex = null;
            ruleName?.m_arrMappingInfo?.map((rule, index) => {
              if (mapType === "F") {
                if (
                  rule.m_strParameterName === item.input &&
                  rule.m_strMappingType === mapType
                ) {
                  fIndex = index;
                  isFExist = true;
                }
              } else if (mapType === "R") {
                if (
                  rule.m_strVarName === item.VariableName &&
                  rule.m_strMappingType === mapType
                ) {
                  rIndex = index;
                  isRExist = true;
                }
              }
            });
            if (mapType === "F") {
              if (isFExist) {
                if (value === "0") {
                  ruleName.m_arrMappingInfo.splice(fIndex, 1);
                } else {
                  ruleName.m_arrMappingInfo[fIndex].m_strVariableId =
                    getRevMapId(value).VariableId;
                  ruleName.m_arrMappingInfo[fIndex].m_strVarName = value;
                  ruleName.m_arrMappingInfo[fIndex].m_strVarScope =
                    getRevMapId(value).VariableScope;
                  ruleName.m_arrMappingInfo[fIndex].m_strVarFieldId =
                    getRevMapId(value).VarFieldId;
                }
              } else {
                if (value !== "0") {
                  ruleName.m_arrMappingInfo.push({
                    m_arrMappingList: [],
                    m_bChk: true,
                    m_bConstantFlag: false,
                    m_bDisableFlag: true,
                    m_strConstValue: "",
                    m_strEntityArgType: "",
                    m_strMappingType: "F",
                    m_strParameterDataType: item.varType,
                    m_strParameterName: item.input,
                    m_strParemterFullName: item.fullName,
                    m_strParentIsArray: item.parentIsArray,
                    m_strUnbounded: item.unbounded,
                    m_strVarDataType: "",
                    m_strVarFieldId: getRevMapId(value).VarFieldId,
                    m_strVarName: value,
                    m_strVarScope: getRevMapId(value).VariableScope,
                    m_strVariableId: getRevMapId(value).VariableId,
                  });
                }
              }
            } else if (mapType === "R") {
              if (isRExist) {
                if (value === "0") {
                  ruleName.m_arrMappingInfo.splice(rIndex, 1);
                } else {
                  ruleName.m_arrMappingInfo[rIndex].m_strParameterName = value;
                }
              } else {
                if (value !== "0") {
                  let fullName = "";
                  revInputs?.forEach((el) => {
                    if (el.varId === item.VariableId) {
                      fullName = el.fullName;
                    }
                  });
                  ruleName.m_arrMappingInfo.push({
                    m_arrMappingList: [],
                    m_bChk: true,
                    m_bConstantFlag: false,
                    m_bDisableFlag: true,
                    m_strConstValue: "",
                    m_strEntityArgType: "",
                    m_strMappingType: "R",
                    m_strParameterDataType: getRevMapId(item.VariableName)
                      .VariableType,
                    m_strParameterName: value,
                    m_strParemterFullName: fullName,
                    m_strParentIsArray: "R",
                    m_strUnbounded: getRevMapId(item.VariableName).Unbounded,
                    m_strVarDataType: "",
                    m_strVarFieldId: getRevMapId(item.VariableName).VarFieldId,
                    m_strVarName: item.VariableName,
                    m_strVarScope: getRevMapId(item.VariableName).VariableScope,
                    m_strVariableId: getRevMapId(item.VariableName).VariableId,
                  });
                }
              }
            }
          } else {
            if (value !== "0") {
              if (mapType === "F") {
                ruleName.m_arrMappingInfo.push({
                  m_arrMappingList: [],
                  m_bChk: true,
                  m_bConstantFlag: false,
                  m_bDisableFlag: true,
                  m_strConstValue: "",
                  m_strEntityArgType: "",
                  m_strMappingType: "F",
                  m_strParameterDataType: item.varType,
                  m_strParameterName: item.input,
                  m_strParemterFullName: item.fullName,
                  m_strParentIsArray: item.parentIsArray,
                  m_strUnbounded: item.unbounded,
                  m_strVarDataType: "",
                  m_strVarFieldId: getRevMapId(value).VarFieldId,
                  m_strVarName: value,
                  m_strVarScope: getRevMapId(value).VariableScope,
                  m_strVariableId: getRevMapId(value).VariableId,
                });
              } else {
                let fullName = "";
                revInputs?.forEach((el) => {
                  if (el.varId === item.VariableId) {
                    fullName = el.fullName;
                  }
                });
                ruleName.m_arrMappingInfo.push({
                  m_arrMappingList: [],
                  m_bChk: true,
                  m_bConstantFlag: false,
                  m_bDisableFlag: true,
                  m_strConstValue: "",
                  m_strEntityArgType: "",
                  m_strMappingType: "R",
                  m_strParameterDataType: getRevMapId(item.VariableName)
                    .VariableType,
                  m_strParameterName: value,
                  m_strParemterFullName: fullName,
                  m_strParentIsArray: "R",
                  m_strUnbounded: getRevMapId(item.VariableName).Unbounded,
                  m_strVarDataType: "",
                  m_strVarFieldId: getRevMapId(item.VariableName).VarFieldId,
                  m_strVarName: item.VariableName,
                  m_strVarScope: getRevMapId(item.VariableName).VariableScope,
                  m_strVariableId: getRevMapId(item.VariableName).VariableId,
                });
              }
            }
          }
        }
      }
    );
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.businessRule]: { isModified: true, hasError: false },
      })
    );
  };

  const changeService = (e) => {
    setServiceType(e.target.value);
    if (serviceType == "true") {
      var url = SERVER_URL + ENDPOINT_REST_PACKAGE + "?restService=true";
    } else {
      var url = SERVER_URL + ENDPOINT_SOAP_PACKAGE + "?restService=true";
    }

    axios
      .get(url)
      .then(function (response) {
        setRuleFlowItems(
          response?.data?.m_arrBRMSRuleFlowList?.map((item) => ({
            id: item.m_strRSetId,
            value: item.m_strRSetName,
          }))
        );
        setrulePackageItems(
          response?.data?.m_arrBRMSRuleSetList?.map((item) => ({
            id: item.m_strRSetId,
            value: item.m_strRSetName,
          }))
        );
      })
      .catch(function (error) {
        console.log(error);
      });

    setAssociateList([]);
    setMapping(false);
    setRuleFlow({ id: "", name: "" });
    setRuleVersion("");
    setRulePackage({ id: "", name: "" });
    setPackageVersion("");
    let tempLocalState = JSON.parse(
      JSON.stringify(localLoadedActivityPropertyData)
    );
    tempLocalState.ActivityProperty.m_objBusinessRule.m_bIsRestService =
      e.target.value;
    tempLocalState.ActivityProperty.m_objBusinessRule.m_arrAssocBRMSRuleSetList =
      [];
    setlocalLoadedActivityPropertyData(tempLocalState);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.businessRule]: { isModified: true, hasError: false },
      })
    );
  };

  const setTime = (val, name) => {
    setDefaultTime(val);

    let tempLocalState = JSON.parse(
      JSON.stringify(localLoadedActivityPropertyData)
    );
    tempLocalState?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList?.forEach(
      (data, i) => {
        if (data.m_strRSetName === name) {
          tempLocalState.ActivityProperty.m_objBusinessRule.m_arrAssocBRMSRuleSetList[
            i
          ].m_strTimeOutInterval = val;
        }
      }
    );
    setlocalLoadedActivityPropertyData(tempLocalState);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.businessRule]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <div>
      {isError ? (
        <Toast
          open={isError != false}
          closeToast={() => setIsError(false)}
          message={errorMsg.msg}
          severity={errorMsg.severity}
        />
      ) : null}
      <div
        className={
          props.isDrawerExpanded ? "brtContainerExpand" : "brtContainer"
        }
      >
        {/* <Box
          className={
            props.isDrawerExpanded ? "label-heading-expand" : "label-heading"
          }
        >
          {props?.heading}
        </Box> */}
        <TabsHeading heading={props?.heading} />

        <div style={mapping ? { display: "flex" } : {}}>
          <div style={mapping ? { width: "100%" } : {}}>
            <div className="radio-group">
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={serviceType}
                  name="row-radio-buttons-group"
                  onChange={changeService}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    id={props.isDrawerExpanded ? "brtRadioExpand" : "brtRadio"}
                  >
                    <FormControlLabel
                      value="false"
                      control={<Radio size="small" />}
                      label={t("toolbox.businessRules.soapServiceLabel")}
                    />
                    <FormControlLabel
                      value="true"
                      control={<Radio size="small" />}
                      label={t("toolbox.businessRules.restServiceLabel")}
                    />
                  </Box>
                </RadioGroup>
              </FormControl>
            </div>
            <Box className="flex-container">
              <div
                className={
                  props.isDrawerExpanded ? "flexExpanded" : "flex-item"
                }
              >
                <p>
                  <FormHelperText>
                    {t("toolbox.businessRules.ruleFlowName")}
                    <span className="required">*</span>
                  </FormHelperText>
                </p>
                <p>
                  <CustomizedDropdown
                    value={ruleFlow.id}
                    onChange={changeRuleFlow}
                    id="ruleflow-selectbox"
                    isNotMandatory={true}
                  >
                    {ruleFlowItems?.map((item, i) => (
                      <MenuItem value={item.id}>{item.value}</MenuItem>
                    ))}
                  </CustomizedDropdown>
                </p>
              </div>
              <div
                className={
                  props.isDrawerExpanded ? "versionExpanded" : "flex-item"
                }
              >
                <p>
                  <FormHelperText>
                    {props.isDrawerExpanded
                      ? t("toolbox.businessRules.verNum")
                      : t("toolbox.businessRules.version")}
                    <span className="required">*</span>
                  </FormHelperText>
                </p>
                <p>
                  <CustomizedDropdown
                    value={ruleVersion}
                    onChange={(e) => {
                      setRuleVersion(e.target.value);
                    }}
                    displayEmpty
                    id="ruleversion-selectbox"
                    isNotMandatory={true}
                  >
                    {flowVersionItems?.map((item, i) => (
                      <MenuItem value={item.value}>{item.label}</MenuItem>
                    ))}
                  </CustomizedDropdown>
                </p>
              </div>
              <div className="flex-item">
                <p style={{ position: "relative" }}>
                  <Button
                    color="primary"
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      associateData("ruleflow");
                    }}
                  >
                    {t("toolbox.businessRules.associate")}
                  </Button>
                </p>
              </div>
            </Box>
            <Box className="flex-container">
              <div
                className={
                  props.isDrawerExpanded ? "flexExpanded" : "flex-item"
                }
              >
                <p>
                  <FormHelperText>
                    {t("toolbox.businessRules.rulePackageName")}
                    <span className="required">*</span>
                  </FormHelperText>
                </p>
                <p>
                  <CustomizedDropdown
                    value={rulePackage.id}
                    onChange={changeRulePackage}
                    displayEmpty
                    id="rulepackage-selectbox"
                    isNotMandatory={true}
                  >
                    {rulePackageItems?.map((item, i) => (
                      <MenuItem value={item.id} selected>
                        {item.value}
                      </MenuItem>
                    ))}
                  </CustomizedDropdown>
                </p>
              </div>
              <div
                className={
                  props.isDrawerExpanded ? "versionExpanded" : "flex-item"
                }
              >
                <p>
                  <FormHelperText>
                    {props.isDrawerExpanded
                      ? t("toolbox.businessRules.verNum")
                      : t("toolbox.businessRules.version")}
                    <span className="required">*</span>
                  </FormHelperText>
                </p>
                <p>
                  <CustomizedDropdown
                    value={packageVersion}
                    onChange={(e) => {
                      setPackageVersion(e.target.value);
                    }}
                    id="ruleversion-selectbox"
                    isNotMandatory={true}
                  >
                    {packageVersionItems?.map((item, i) => (
                      <MenuItem value={item.value}>{item.label}</MenuItem>
                    ))}
                  </CustomizedDropdown>
                </p>
              </div>
              <div className="flex-item">
                <p style={{ position: "relative" }}>
                  <Button
                    color="primary"
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      associateData("rulepackage");
                    }}
                  >
                    {t("toolbox.businessRules.associate")}
                  </Button>
                </p>
              </div>
            </Box>

            <Box
              style={{ marginTop: 20 }}
              className={
                props.isDrawerExpanded
                  ? "label-heading-expand"
                  : "label-heading"
              }
            >
              <h4>{t("toolbox.businessRules.associatePackageFlow")}</h4>
            </Box>

            <Box
              sx={{ m: 2 }}
              className={
                props.isDrawerExpanded
                  ? "associate-list-expand"
                  : "associate-list"
              }
            >
              <table
                className={
                  props.isDrawerExpanded
                    ? direction == RTL_DIRECTION
                      ? "associate-tbl-expand-rtl"
                      : "associate-tbl-expand"
                    : direction == RTL_DIRECTION
                    ? "associate-tbl-rtl"
                    : "associate-tbl"
                }
                direction
              >
                <tr>
                  <th>{t("toolbox.businessRules.name")}</th>
                  <th>{t("toolbox.businessRules.version")}</th>
                  <th>{t("toolbox.businessRules.type")}</th>
                  {props.isDrawerExpanded ? <th></th> : ""}
                </tr>
                {associateList?.map((item, i) => (
                  <tr key={i}>
                    <td align="center">{item.name}</td>
                    <td align="center">{item.version}</td>
                    <td align="center">
                      {item.type === "P"
                        ? t("toolbox.businessRules.rulePackage")
                        : t("toolbox.businessRules.ruleFlow")}
                    </td>
                    {props.isDrawerExpanded ? (
                      <td>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <CompareArrowsIcon
                            onClick={() => {
                              mapData(
                                item.id,
                                item.version,
                                item.type,
                                item.mapInfo,
                                item.time,
                                item.name
                              );
                            }}
                            style={{
                              width: "24px !important",
                              height: "24px !important",
                            }}
                          />
                          <DeleteIcon
                            onClick={() => {
                              deleteData(item.id, i);
                            }}
                            style={{
                              color: "#D53D3D",
                              width: "24px !important",
                              height: "24px !important",
                            }}
                          />
                        </div>
                      </td>
                    ) : (
                      ""
                    )}
                  </tr>
                ))}
              </table>
            </Box>
          </div>
          {mapping == true ? (
            <div className="mappingContainer">
              <Box className="mapping-tbl-container">
                <table className="mapping-tbl">
                  <tr>
                    <thead>
                      <th>{t("toolbox.businessRules.invocation")}</th>
                      <th>
                        {t("toolbox.businessRules.timeout")}
                        <span className="required">*</span>
                      </th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{t("toolbox.businessRules.sync")}</td>
                        <td>
                          <CustomizedDropdown
                            id="demo-select-small"
                            value={defaultTime}
                            onChange={(e) => {
                              setTime(e.target.value, mappedSelectedRule);
                            }}
                            isNotMandatory={true}
                          >
                            {timeslot?.map((item, i) => (
                              <MenuItem value={item}>
                                {item + " " + t("toolbox.businessRules.sec")}
                              </MenuItem>
                            ))}
                          </CustomizedDropdown>
                        </td>
                      </tr>
                    </tbody>
                  </tr>
                </table>
              </Box>
              <Box className="mappingTab" sx={{ width: "100%" }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChange} className="tabList">
                      <Tab
                        label={
                          <React.Fragment>
                            {t("toolbox.businessRules.forwardMapping")}
                            <span
                              style={{ fontSize: "smaller", color: "#D53D3D" }}
                            >
                              *
                            </span>
                          </React.Fragment>
                        }
                        className="tab"
                        value="1"
                      />
                      <Tab
                        label={
                          <React.Fragment>
                            {t("toolbox.businessRules.reverseMapping")}
                            <span
                              style={{ fontSize: "smaller", color: "#D53D3D" }}
                            >
                              *
                            </span>
                          </React.Fragment>
                        }
                        className="tab"
                        value="2"
                      />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    {
                      <TableContainer
                        component={Paper}
                        className="mapped-tbl-container"
                      >
                        <Table
                          aria-label="simple table"
                          className="mapped-table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell className="mapped-table-header">
                                {t("toolbox.businessRules.BRInput")}
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="mapped-table-header">
                                {t("toolbox.businessRules.curProcessVar")}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {brtFwdInputs?.map((item, i) => (
                              <TableRow>
                                <TableCell>
                                  <p className="brtInputRules">{item.input}</p>
                                </TableCell>
                                <TableCell>=</TableCell>
                                <TableCell>
                                  <CustomizedDropdown
                                    value={getSelectedMappingData(item)}
                                    id="mapping-list"
                                    onChange={(e) => {
                                      selectedOutputVal(
                                        e.target.value,
                                        item,
                                        "F"
                                      );
                                    }}
                                    isNotMandatory={true}
                                  >
                                    {
                                      <MenuItem value="0">
                                        {t("toolbox.businessRules.selVar")}
                                      </MenuItem>
                                    }
                                    {getFilteredVarList(item)?.map(
                                      (process, j) => (
                                        <MenuItem value={process.VariableName}>
                                          {process.VariableName}
                                        </MenuItem>
                                      )
                                    )}
                                  </CustomizedDropdown>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    }
                  </TabPanel>
                  <TabPanel value="2">
                    <TableContainer
                      component={Paper}
                      className="mapped-tbl-container"
                    >
                      <Table aria-label="simple table" className="mapped-table">
                        <TableHead>
                          <TableRow>
                            <TableCell className="mapped-table-header">
                              {t("toolbox.businessRules.curProcessVar")}
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="mapped-table-header">
                              {t("toolbox.businessRules.BROutput")}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {brtRevInputs?.map((item, i) => (
                            <TableRow>
                              <TableCell>
                                <p className="brtInputRules">
                                  {
                                    //getRevMapName(item?.varId)?.VariableName
                                    item.VariableName
                                  }
                                </p>
                              </TableCell>
                              <TableCell>=</TableCell>
                              <TableCell>
                                <CustomizedDropdown
                                  value={getSelectedOutputData(
                                    item?.VariableName
                                  )}
                                  id="mapped-output-list"
                                  onChange={(e) => {
                                    selectedOutputVal(
                                      e.target.value,
                                      item,
                                      "R"
                                    );
                                  }}
                                  labelId="demo-select-small"
                                  isNotMandatory={true}
                                >
                                  {
                                    <MenuItem value="0">
                                      {t("toolbox.businessRules.selVar")}
                                    </MenuItem>
                                  }
                                  {getFilteredInputList(
                                    item?.VariableId,
                                    item?.VarFieldId
                                  )?.map((data, j) => (
                                    <MenuItem value={data?.input}>
                                      {data?.input}
                                    </MenuItem>
                                  ))}
                                </CustomizedDropdown>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                </TabContext>
              </Box>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, null)(BusinessRules);
