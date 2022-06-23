import React, { useState, useEffect } from "react";
import CommonTabHeader from "../commonTabHeader";
import { connect, useDispatch, useSelector } from "react-redux";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";
import {
  FormControl,
  FormHelperText,
  Button,
  Box,
  TextField,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { useTranslation } from "react-i18next";
import {
  activityType,
  activityType_label,
  ENDPOINT_GET_RULE_MEMBER_LIST,
  ENDPOINT_REST_PACKAGE,
  RTL_DIRECTION,
  ENDPOINT_RULE_FLOW_VERSION,
  ENDPOINT_RULE_PACKAGE_VERSION,
  SERVER_URL,
  ENDPOINT_SOAP_PACKAGE,
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



function BusinessRules(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

  const [selectedActivityIcon, setSelectedActivityIcon] = useState();

  useEffect(() => {
    let activityProps = getActivityProps(
      props.cellActivityType,
      props.cellActivitySubType
    );
    setSelectedActivityIcon(activityProps[0]);
  }, [props.cellActivityType, props.cellActivitySubType, props.cellID]);

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

const [isError,setIsError]=useState(false);
const [errorMsg,setErrorMsg]=useState({severity:"",msg:""});


//function for data association

  function associateData(type) {
   


    let data;
    

    if (type == "ruleflow") {
     

      if (ruleFlow.id == "" && ruleFlow.name == "") {
      
        setIsError(true)
        setErrorMsg({msg:t("toolbox.businessRules.errormsg1"),severity:"error"})
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
      
        setIsError(true)
        setErrorMsg({msg:t("toolbox.businessRules.errormsg2"),severity:"error"})
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
      
      setIsError(true)
      setErrorMsg({msg:`This ${data.name} and version ${data.version} are already mapped`,severity:"error"})
      return false;
    } else {
      setAssociateList([...associateList, data]);

      let tempLocalState = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
      let lastIndex = localLoadedActivityPropertyData?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList.length;
      const nameVersion = data.name+"("+data.version+")";

      const activityData = {
        m_arrMappingInfo: [],
        m_bSelectRow: false,
        m_iRSetOrder: lastIndex + 1,
        m_strRSetId: "",
        m_strRSetName: data.name,
        m_strRSetNameWithVersion: nameVersion,
        m_strRSetVersion: data.version,
        m_strRuleType: data.type,
        m_strTimeOutInterval: "0",
        m_strVersionTitle: nameVersion,
      };
      
    

    tempLocalState?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList.push(activityData)
     

      

      

     

      

    

      setlocalLoadedActivityPropertyData(tempLocalState)

    }
  }

  const timeslot = [];
  const [defaultTime, setDefaultTime] = useState("10");

  const [brtProcess, setBrtProcess] = useState([]);

  for (let i = 0; i < 100; i++) {
    timeslot.push(i);
  }

  useEffect(() => {
    const mappedData =
      localLoadedActivityPropertyData?.ActivityProperty?.m_objBusinessRule
        .m_arrAssocBRMSRuleSetList;

    if (serviceType == "true") {
      var url = SERVER_URL + ENDPOINT_REST_PACKAGE +"?restService=true";
    } else {
      var url = SERVER_URL + ENDPOINT_SOAP_PACKAGE+"?restService=false";
    }

    axios
      .get(url)
      .then(function (response) {
       
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
      .catch(function (error) {
        console.log(error);
      });


    setBrtProcess(
      localLoadedProcessData?.Variable?.map((item) => ({
        DefaultValue: item.DefaultValue,
        ExtObjectId: item.ExtObjectId,
        SystemDefinedName: item.SystemDefinedName,
        Unbounded: item.Unbounded,
        VarFieldId: item.VarFieldId,
        VarPrecision: item.VarPrecision,
        VariableId: item.VariableId,
        VariableLength: item.VariableLength,
        VariableName: item.VariableName,
        VariableScope: item.VariableScope,
        VariableType: item.VariableType,
      }))
    );
  }, []);

  

  const [brtFwdInputs, setFwdBrtInputs] = useState([]);
  const [brtRevInputs, setRevBrtInputs] = useState([]);

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

    const postData = {
      ruleSetNo: id,
      ruleSetVersionId: version,
      ruleType: type,
      activityId: localLoadedActivityPropertyData?.ActivityProperty?.actId,
    };

    axios
      .post(SERVER_URL + ENDPOINT_GET_RULE_MEMBER_LIST, postData)
      .then((res) => {
       
        const fwdList = res?.data?.m_arrFwdMappingList?.filter(
          (data) =>
            data.m_strEntityArgType == "IN/OUT" ||
            data.m_strEntityArgType == "IN"
        );
        
        const revList = res?.data?.m_arrRvrMappingList;
      
        setFwdBrtInputs(
          fwdList?.map((item, i) => ({
            input: item.m_strParameterName,
            process: "",
            type: item.m_strParameterDataType,
            varType: item.m_strVarDataType,
            varFieldId: item.m_strVarFieldId,
            varId: item.m_strVariableId,
            name: name,
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
        setRevBrtInputs(
          revList?.map((item, i) => ({
            input: item.m_strParameterName,
            process: "",
            type: item.m_strParameterDataType,
            varType: item.m_strVarDataType,
            varFieldId: item.m_strVarFieldId,
            varId: item.m_strVariableId,
            name: name,
          }))
        );
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  const [value, setValue] = React.useState("1");

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  function changeRuleFlow(e) {
    var item = ruleFlowItems?.find((item) => item.id === e.target.value);
    setRuleFlow({ id: e.target.value, name: item.value });

    axios
      .get(
        SERVER_URL +
        ENDPOINT_RULE_FLOW_VERSION + "?m_strSelectedRuleSetId="+
          e.target.value
      )
      .then(function (response) {
       
        setRuleVersion(response?.data?.versions[0]);
        setRuleVersionItem(
          response?.data?.versions?.map((data) => ({ label: data, value: data }))
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
        ENDPOINT_RULE_PACKAGE_VERSION + "?m_strSelectedRuleSetId="+
          e.target.value
      )
      .then(function (response) {
       
        setPackageVersion(response.data.versions[0]);
        setPackageVersionItem(
          response?.data?.versions?.map((data) => ({ label: data, value: data }))
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



  function deleteData(id,i) {
    setMapping(false);
    setAssociateList(associateList?.filter((item) => item.id !== id));
    let tempLocalState = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    tempLocalState?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList?.splice(i,1)
    setlocalLoadedActivityPropertyData(tempLocalState)
  }

  const getFilteredVarList = (item) => {
    let temp = [];


    brtProcess.forEach((_var) => {
      if (_var.VariableType == item.varType) {
       
        temp.push(_var);
      }
    });
    return temp;
  };

  const getSelectedMappingData = (item) => {
    let temp = "0";
    localLoadedActivityPropertyData?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList?.forEach(
      (ruleName) => {
        if (ruleName.m_strRSetName === mappedSelectedRule) {
          ruleName?.m_arrMappingInfo?.filter(d=>d.m_strMappingType==="F").forEach((rule) => {
            if (rule.m_strParameterName === item.input) {
              temp = rule.m_strVariableId;
            }
          });
        }
      }
    );

 
    return temp;
  };

 
  const getRevMapName = (id) => {
    
    let temp = {};
    brtProcess?.forEach((item) => {
      if (item.VariableId == id) {
        temp = item;
      }
    });

    return temp;
  };

  const getFilteredInputList = (id) => {
    let temp = [];
    let allInput = "";
    let type = "";
 

    brtProcess?.forEach((item) => {
      if (item.VariableId == id) {
        type = item.VariableType;
      }
    });

   
    allInput = brtFwdInputs?.filter((data) => data.type == type);
 
  
    return allInput;
  };

  const getSelectedOutputData = (item) => {
    let temp = "0";
    localLoadedActivityPropertyData?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList?.forEach(
      (ruleName) => {
        if (ruleName.m_strRSetName === mappedSelectedRule) {
          ruleName?.m_arrMappingInfo?.filter(d=>d.m_strMappingType==="R").forEach((rule) => {
          
            if (rule.m_strVariableId === item) {
              temp = rule.m_strParameterName;
            }
          });
        }
      }
    );

    
    return temp;
  };

 

  const selectedOutputVal = (value, item,mapType) => {
   
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
   
    temp?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList?.some(
      (ruleName) => {
       
        if (ruleName.m_strRSetName === mappedSelectedRule) {
         
          if(ruleName.m_arrMappingInfo.length)
          {
            ruleName?.m_arrMappingInfo?.map((rule) => {
             
              if (mapType==="F") {
                
                if (rule.m_strParameterName === item.input) {
                  rule.m_strVariableId = value;
                  return true;
                } else {
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
                    m_strParemterFullName: "",
                    m_strParentIsArray: "F",
                    m_strUnbounded: "N",
                    m_strVarDataType: "",
                    m_strVarFieldId: "0",
                    m_strVarName: getRevMapName(value).VariableName,
                    m_strVarScope: getRevMapName(value).VariableScope,
                    m_strVariableId: value,
                  });
                  return true;
                }
              } else {
               
                if (rule.m_strVariableId === item.varId) {
                  rule.m_strParameterName = value;
                  return true;
                }
                else{
                  ruleName.m_arrMappingInfo.push({
                    m_arrMappingList: [],
                    m_bChk: true,
                    m_bConstantFlag: false,
                    m_bDisableFlag: true,
                    m_strConstValue: "",
                    m_strEntityArgType: "",
                    m_strMappingType: "R",
                    m_strParameterDataType: getRevMapName(item.varId).VariableType,
                    m_strParameterName: value,
                    m_strParemterFullName: "",
                    m_strParentIsArray: "R",
                    m_strUnbounded: "N",
                    m_strVarDataType: "",
                    m_strVarFieldId: "0",
                    m_strVarName: getRevMapName(item.varId).VariableName,
                    m_strVarScope: getRevMapName(item.varId).VariableScope,
                    m_strVariableId: item.varId,
                  });
                  return true;
                }
              }
            });
           
          }
          else{

              if(mapType==="F")
              {
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
                  m_strParemterFullName: "",
                  m_strParentIsArray: "F",
                  m_strUnbounded: "N",
                  m_strVarDataType: "",
                  m_strVarFieldId: "0",
                  m_strVarName: getRevMapName(value).VariableName,
                  m_strVarScope: getRevMapName(value).VariableScope,
                  m_strVariableId: value,
                });
              }
              else{
                ruleName.m_arrMappingInfo.push({
                  m_arrMappingList: [],
                  m_bChk: true,
                  m_bConstantFlag: false,
                  m_bDisableFlag: true,
                  m_strConstValue: "",
                  m_strEntityArgType: "",
                  m_strMappingType: "R",
                  m_strParameterDataType: getRevMapName(item.varId).VariableType,
                  m_strParameterName: value,
                  m_strParemterFullName: "",
                  m_strParentIsArray: "R",
                  m_strUnbounded: "N",
                  m_strVarDataType: "",
                  m_strVarFieldId: "0",
                  m_strVarName: getRevMapName(item.varId).VariableName,
                  m_strVarScope: getRevMapName(item.varId).VariableScope,
                  m_strVariableId: item.varId,
                });
              }

          }
        
        }
      }
    );
  
    dispatch(
      setActivityPropertyChange({
        BusinessRules: { isModified: true, hasError: false },
      })
    );
    setlocalLoadedActivityPropertyData(temp);
  };



  const changeService=(e)=>
  {
    
    
    setServiceType(e.target.value);

    if (serviceType == "true") {
      var url = SERVER_URL + ENDPOINT_REST_PACKAGE+"?restService=true";
    } else {
      var url = SERVER_URL + ENDPOINT_SOAP_PACKAGE+"?restService=true";
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
   
   let tempLocalState = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    tempLocalState.ActivityProperty.m_objBusinessRule.m_bIsRestService=e.target.value;
   tempLocalState.ActivityProperty.m_objBusinessRule.m_arrAssocBRMSRuleSetList=[];
   
    setlocalLoadedActivityPropertyData(tempLocalState);

  }

  const setTime=(val,name)=>{
    setDefaultTime(val);
   
    let tempLocalState = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    tempLocalState?.ActivityProperty?.m_objBusinessRule?.m_arrAssocBRMSRuleSetList?.forEach((data,i)=>{
      if(data.m_strRSetName===name)
      {
        tempLocalState.ActivityProperty.m_objBusinessRule.m_arrAssocBRMSRuleSetList[i].m_strTimeOutInterval=val;
      }
  })
  setlocalLoadedActivityPropertyData(tempLocalState);
  }
  
  return (
    <div>

      {
        
        isError?
        <Toast
              open={isError!=false}
              closeToast={() => setIsError(false)}
              message={errorMsg.msg}
              severity={errorMsg.severity}
            />
        :
        null
      }
      <div
        className={
          props.isDrawerExpanded ? "brtContainerExpand" : "brtContainer"
        }
      >
        
        <Box
          className={
            props.isDrawerExpanded ? "label-heading-expand" : "label-heading"
          }
        >
          <h4>{t(activityType_label.businessRule_label)}</h4>
        </Box>

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
                    ? direction==RTL_DIRECTION ? "associate-tbl-expand-rtl" : "associate-tbl-expand"
                    : direction==RTL_DIRECTION ? "associate-tbl-rtl" : "associate-tbl"
                }
                direction
              >
                <tr>
                  <th>{t("toolbox.businessRules.name")}</th>
                  <th>{t("toolbox.businessRules.version")}</th>
                  <th>{t("toolbox.businessRules.type")}</th>
                  {props.isDrawerExpanded ? <th></th> : ""}
                </tr>
                {
                  associateList?.map((item, i) => (
                  <tr key={i}>
                    <td align="center">{item.name}</td>
                    <td align="center">{item.version}</td>
                    <td align="center">
                      {item.type == "P" ? t("toolbox.businessRules.ruleFlow") : t("toolbox.businessRules.rulePackage")}
                    </td>
                    {props.isDrawerExpanded ? (
                      <td>
                        <div style={{ display: "flex" }}>
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
                          />
                          <DeleteIcon
                            onClick={() => {
                              deleteData(item.id,i);
                            }}
                            style={{ color: "#D53D3D" }}
                          />
                        </div>
                      </td>
                    ) : (
                      ""
                    )}
                  </tr>
                ))
                }
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
                              setTime(e.target.value,mappedSelectedRule);
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
                    <TabList
                      onChange={handleChange}
                      
                      className="tabList"
                    >
                      <Tab  label={
              <React.Fragment>
                {t("toolbox.businessRules.forwardMapping")}
                <span style={{ fontSize: "smaller",color:"#D53D3D" }}>*</span>
              </React.Fragment>
            } className="tab"  value="1" />
                      <Tab  label={
              <React.Fragment>
                {t("toolbox.businessRules.reverseMapping")}
                <span style={{ fontSize: "smaller",color:"#D53D3D" }}>*</span>
              </React.Fragment>
            } className="tab"  value="2" />
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
                                      selectedOutputVal(e.target.value, item,"F");
                                    }}
                                    isNotMandatory={true}
                                  >
                                    {
                                      <MenuItem value="0">
                                        
                                          {t("toolbox.businessRules.selVar")}
                                       
                                      </MenuItem>
                                    }
                                    {getFilteredVarList(item).map(
                                      (process, j) => (
                                        <MenuItem value={process.VariableId}>
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
                                  {getRevMapName(item.varId).VariableName}
                                </p>
                              </TableCell>
                              <TableCell>=</TableCell>
                              <TableCell>
                                <CustomizedDropdown
                                  value={getSelectedOutputData(item.varId)}
                                  id="mapped-output-list"
                                  onChange={(e) => {
                                    selectedOutputVal(e.target.value, item,"R");
                                  }}
                                  labelId="demo-select-small"
                                  isNotMandatory={true}
                                >
                                  {
                                    <MenuItem value="0">
                                     
                                        {t("toolbox.businessRules.selVar")}
                                     
                                    </MenuItem>
                                  }
                                  {getFilteredInputList(item.varId).map(
                                    (data, j) => (
                                      <MenuItem value={data.input}>
                                        {data.input}
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
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, null)(BusinessRules);
