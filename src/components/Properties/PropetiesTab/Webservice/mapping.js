import React, { useState, useEffect } from "react";
import { Select, MenuItem } from "@material-ui/core";
import "./index.css";
import { Tab, Tabs } from "@material-ui/core";
import { TabPanel } from "../../../ProcessSettings";
import ReusableOneMap from "./reusableOneMap";
import { store, useGlobalState } from "state-pool";
import { useDispatch, useSelector } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { propertiesLabel } from "../../../../Constants/appConstants";
import { connect } from "react-redux";
import TextInput from "../../../../UI/Components_With_ErrrorHandling/InputField/index.js";
import { OpenProcessSliceValue } from "../../../../redux-store/slices/OpenProcessSlice";
import { useTranslation } from "react-i18next";

function Mapping(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const openProcessData = useSelector(OpenProcessSliceValue);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [invocationType, setInvocationType] = useState(null);
  const [value, setValue] = useState(0); // Function to handle tab change.
  const [forwardMappingList, setForwardMappingList] = useState([]);
  const [reverseMappingList, setReverseMappingList] = useState([]);
  const [reverseDropdownOptions, setReverseDropdownOptions] = useState([]);
  const [dropDownActivities, setDropDownActivities] = useState([]);
  const [selectedDropDownActivity, setSelectedDropDownActivity] =
    useState(null);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [timeOutValue, setTimeOutValue] = useState(null);
  const [variablesListForDropDown, setVariablesListForDropDown] = useState([]);

  useEffect(() => {
    let temp = [];
    let tempOpenProcess = JSON.parse(
      JSON.stringify(openProcessData.loadedData)
    );
    tempOpenProcess?.MileStones?.forEach((mile) => {
      mile?.Activities?.forEach((activity) => {
        if (
          (+activity.ActivityType === 21 && +activity.ActivitySubType === 1) ||
          (+activity.ActivityType === 23 && +activity.ActivitySubType === 1) ||
          (+activity.ActivityType === 24 && +activity.ActivitySubType === 1) ||
          (+activity.ActivityType === 25 && +activity.ActivitySubType === 1)
        ) {
          temp.push(activity);
        }
      });
    });
    setDropDownActivities(temp);
  }, [openProcessData.loadedData]);

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

  useEffect(() => {
    localLoadedActivityPropertyData?.ActivityProperty?.webserviceInfo?.objWebServiceDataInfo?.forEach(
      (el) => {
        if (el.methodIndex == props.serviceNameClicked.id) {
          setTimeOutValue(el.timeoutInterval);
        }
      }
    );
  }, [localLoadedActivityPropertyData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTimeOutChange = (event) => {
    setTimeOutValue(event.target.value);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.webService]: {
          isModified: true,
          hasError: false,
        },
      })
    );

    let temp = localLoadedActivityPropertyData;
    temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo.map((el) => {
      if (el.methodIndex == props.serviceNameClicked.id) {
        el.timeoutInterval = event.target.value;
      }
    });
    setlocalLoadedActivityPropertyData(temp);
  };

  const getVarName = (variableName, varList) => {
    let variable;
    varList?.forEach((content) => {
      if (content.VariableName === variableName) {
        variable = content;
      }
    });
    return variable;
  };

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

  useEffect(() => {
    let forwardInputParams = [];
    let reverseInputParams = [];
    let selectedWebService;
    let tempForwardList = [];
    let tempReverseList = [];
    let reverseList = [];

    let variablesList = [];
    localLoadedProcessData?.Variable?.forEach((item) => {
      if (item.VariableType === "11") {
        let tempList = getComplex(item);
        tempList?.forEach((el) => {
          variablesList.push(el);
        });
      } else {
        variablesList.push(item);
      }
    });

    props?.completeList?.forEach((list) => {
      if (
        list.AppName == props.serviceNameClicked.webservice &&
        list.MethodName == props.serviceNameClicked.method
      ) {
        selectedWebService = list;
      }
    });
    forwardInputParams = selectedWebService?.Parameter?.filter(
      (el) => el.ParamScope == "I"
    );

    reverseInputParams = selectedWebService?.Parameter?.filter(
      (el) => el.ParamScope == "O" || el.ParamScope == "R"
    );

    localLoadedProcessData?.Variable?.forEach((item, i) => {
      if (
        item.VariableScope === "M" ||
        item.VariableScope === "S" ||
        (item.VariableScope === "U" && checkForModifyRights(item)) ||
        (item.VariableScope === "I" && checkForModifyRights(item))
      ) {
        if (item.VariableType === "11") {
          let tempList = getComplex(item);
          tempList?.forEach((el) => {
            reverseList.push({
              fieldName: el,
              fieldDataStructID: null,
              selectedVar: null,
            });
          });
        } else {
          reverseList.push({
            fieldName: item,
            fieldDataStructID: null,
            selectedVar: null,
          });
        }
      }
    });

    forwardInputParams?.forEach((param) => {
      if (param.ParamType == "11") {
        CreateParamKey(
          param.ParamName,
          param.DataStructureId,
          param.ParamIndex,
          tempForwardList,
          selectedWebService
        );
      } else {
        tempForwardList.push({
          fieldName: param.ParamName,
          fieldDataStructID: param.DataStructureId,
          fieldType: param.ParamType,
          fieldIndex: param.ParamIndex,
          selectedVar: null,
        });
      }
    });

    reverseInputParams?.forEach((param) => {
      if (param.ParamType == "11") {
        CreateParamKey(
          param.ParamName,
          param.DataStructureId,
          param.ParamIndex,
          tempReverseList,
          selectedWebService
        );
      } else {
        tempReverseList.push({
          fieldName: param.ParamName,
          fieldDataStructID:
            param.DataStructureId == "0"
              ? param.ParamIndex
              : param.DataStructureId,
          selectedVar: null,
          fieldType: param.ParamType,
          fieldIndex: param.ParamIndex,
        });
      }
    });

    props.combinations?.map((one) => {
      if (
        one.webserviceName == props.serviceNameClicked.webservice &&
        props.serviceNameClicked.method == one.methodName
      ) {
        one?.fwdParamMapList?.forEach((el) => {
          tempForwardList?.forEach((param, index) => {
            if (el.dataStructId == param.fieldDataStructID) {
              let selectedVar = getVarName(el.selectedVar, variablesList);
              tempForwardList[index].selectedVar = selectedVar;
            }
          });
        });
        one?.revParamMapList?.forEach((el) => {
          tempReverseList?.forEach((param, index) => {
            if (
              el.dataStructId == param.fieldDataStructID ||
              (el.dataStructId == "0" &&
                el.paramIndex == param.fieldDataStructID)
            ) {
              reverseList?.forEach((list, indexOne) => {
                if (list.fieldName.VariableName == el.mapField) {
                  reverseList[indexOne].selectedVar = param;
                }
              });
            }
          });
        });
        setInvocationType(one.invocationType);
      }
    });

    setForwardMappingList(tempForwardList);
    setReverseMappingList(reverseList);
    setReverseDropdownOptions(tempReverseList);
    setVariablesListForDropDown(variablesList);
  }, [props.completeList, props.serviceNameClicked, props.combinations]);

  const CreateParamKey = (
    parentKey,
    parentIndex,
    paramIndex,
    arrayList,
    selectedWebService
  ) => {
    selectedWebService?.DataStructure?.forEach((ds) => {
      if (parentIndex == ds.ParentIndex && ds.Type != "11") {
        arrayList.push({
          fieldName: `${parentKey}.${ds.Name}`,
          fieldDataStructID: ds.DataStructureId,
          fieldIndex: paramIndex,
          selectedVar: null,
          fieldType: ds.Type,
        });
      } else if (parentIndex == ds.ParentIndex && ds.Type == "11") {
        CreateParamKey(
          `${parentKey}.${ds.Name}`,
          ds.DataStructureId,
          paramIndex,
          arrayList,
          selectedWebService
        );
      }
    });
  };

  const handleForwardFieldMapping = (selectedValue, list) => {
    setForwardMappingList((prev) => {
      let tempList = [...prev];
      tempList.forEach((el, index) => {
        if (el.fieldDataStructID == list.fieldDataStructID) {
          tempList[index].selectedVar = selectedValue;
        }
      });
      return tempList;
    });
    let temp = { ...localLoadedActivityPropertyData };
    let tempArr = [
      ...temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo,
    ];
    let indexValue = null;
    tempArr?.forEach((arr, index) => {
      if (
        arr.webserviceName == props.serviceNameClicked.webservice &&
        props.serviceNameClicked.method == arr.methodName
      ) {
        indexValue = index;
      }
    });
    let forwardArr = temp?.ActivityProperty?.webserviceInfo
      ?.objWebServiceDataInfo[indexValue]?.fwdParamMapList
      ? [
          ...temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo[
            indexValue
          ].fwdParamMapList,
        ]
      : [];
    let doExists = false;
    let idx = null;
    forwardArr?.forEach((arr, index) => {
      if (arr.dataStructId === list.fieldDataStructID) {
        doExists = true;
        idx = index;
      }
    });
    if (doExists) {
      temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo[
        indexValue
      ].fwdParamMapList[idx] = {
        bParamSelected: true,
        dataStructId: list.fieldDataStructID,
        mapField: selectedValue.VariableName,
        mapFieldType: selectedValue.VariableScope,
        mapVarFieldId: selectedValue.VarFieldId,
        mapVariableId: selectedValue.VariableId,
        paramIndex: list.fieldIndex,
        selectedVar: list.fieldName,
      };
    } else {
      temp?.ActivityProperty?.webserviceInfo?.objWebServiceDataInfo[indexValue]
        ?.fwdParamMapList
        ? temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo[
            indexValue
          ].fwdParamMapList.push({
            bParamSelected: true,
            dataStructId: list.fieldDataStructID,
            mapField: selectedValue.VariableName,
            mapFieldType: selectedValue.VariableScope,
            mapVarFieldId: selectedValue.VarFieldId,
            mapVariableId: selectedValue.VariableId,
            paramIndex: list.fieldIndex,
            selectedVar: list.fieldName,
          })
        : (temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo[
            indexValue
          ] = {
            ...temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo[
              indexValue
            ],
            fwdParamMapList: [
              {
                bParamSelected: true,
                dataStructId: list.fieldDataStructID,
                mapField: selectedValue.VariableName,
                mapFieldType: selectedValue.VariableScope,
                mapVarFieldId: selectedValue.VarFieldId,
                mapVariableId: selectedValue.VariableId,
                paramIndex: list.fieldIndex,
                selectedVar: list.fieldName,
              },
            ],
          });
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.webService]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };

  const handleReverseFieldMapping = (selectedValue, list, indexInput) => {
    setReverseMappingList((prev) => {
      let tempList = [...prev];
      tempList.forEach((el, index) => {
        if (el.fieldName.VariableName == list.fieldName.VariableName) {
          tempList[index].selectedVar = selectedValue;
        }
      });
      return tempList;
    });
    let temp = { ...localLoadedActivityPropertyData };
    let tempArr = [
      ...temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo,
    ];
    let indexValue = null;
    tempArr?.forEach((arr, index) => {
      if (
        arr.webserviceName == props.serviceNameClicked.webservice &&
        props.serviceNameClicked.method == arr.methodName
      ) {
        indexValue = index;
      }
    });
    let ReverseArr = temp?.ActivityProperty?.webserviceInfo
      ?.objWebServiceDataInfo[indexValue]?.revParamMapList
      ? [
          ...temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo[
            indexValue
          ].revParamMapList,
        ]
      : [];
    let doExists = false;
    let idx = null;
    ReverseArr?.forEach((arr, index) => {
      if (arr.mapVariableId === list.fieldName.VariableId) {
        doExists = true;
        idx = index;
      }
    });

    if (doExists) {
      temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo[
        indexValue
      ].revParamMapList[idx] = {
        bParamSelected: true,
        dataStructId: selectedValue.fieldDataStructID,
        mapField: list.fieldName.VariableName,
        mapFieldType: list.fieldName.VariableScope,
        mapVarFieldId: list.fieldName.VarFieldId,
        mapVariableId: list.fieldName.VariableId,
        paramIndex: selectedValue.fieldIndex,
        selectedVar: selectedValue.fieldName,
      };
    } else {
      temp?.ActivityProperty?.webserviceInfo?.objWebServiceDataInfo[indexValue]
        ?.revParamMapList
        ? temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo[
            indexValue
          ].revParamMapList.push({
            bParamSelected: true,
            dataStructId: selectedValue.fieldDataStructID,
            mapField: list.fieldName.VariableName,
            mapFieldType: list.fieldName.VariableScope,
            mapVarFieldId: list.fieldName.VarFieldId,
            mapVariableId: list.fieldName.VariableId,
            paramIndex: selectedValue.fieldIndex,
            selectedVar: selectedValue.fieldName,
          })
        : (temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo[
            indexValue
          ] = {
            ...temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo[
              indexValue
            ],
            revParamMapList: [
              {
                bParamSelected: true,
                dataStructId: selectedValue.fieldDataStructID,
                mapField: list.fieldName.VariableName,
                mapFieldType: list.fieldName.VariableScope,
                mapVarFieldId: list.fieldName.VarFieldId,
                mapVariableId: list.fieldName.VariableId,
                paramIndex: selectedValue.fieldIndex,
                selectedVar: selectedValue.fieldName,
              },
            ],
          });
    }

    setlocalLoadedActivityPropertyData(temp);

    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.webService]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };

  const handleInvocationTypeChange = (e) => {
    setInvocationType(e.target.value);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.webService]: {
          isModified: true,
          hasError: false,
        },
      })
    );
    let temp = localLoadedActivityPropertyData;
    temp.ActivityProperty.webserviceInfo.objWebServiceDataInfo.map((el) => {
      if (el.methodIndex == props.serviceNameClicked.id) {
        el.invocationType = e.target.value;
      }
    });
    setlocalLoadedActivityPropertyData(temp);
  };

  const getVarListByType = (varList, item) => {
    let varType = item?.fieldType;
    let list = [];
    varList?.forEach((el) => {
      if (
        el.VariableScope === "M" ||
        el.VariableScope === "S" ||
        (el.VariableScope === "U" && checkForVarRights(el)) ||
        (el.VariableScope === "I" && checkForVarRights(el))
      ) {
        let type = el.VariableType;
        if (varType === type) {
          list.push(el);
        }
      }
    });
    return list;
  };

  const getRevVarListByType = (varList, item) => {
    let varType = item.fieldName.VariableType;
    let list = [];
    varList?.forEach((el) => {
      let type = el.fieldType;
      if (varType === type) {
        list.push(el);
      }
    });
    return list;
  };

  return (
    <div style={{ padding: "1rem 1vw 0", width: "40%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1vw",
        }}
      >
        <div style={{ flex: "1" }}>
          <p style={{ fontSize: "12px", color: "#886F6F" }}>
            {t("InvocationType")}
          </p>
          <Select
            className="select_webService_mapping"
            onChange={(e) => handleInvocationTypeChange(e)}
            value={invocationType}
            style={{
              fontSize: "12px",
            }}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
          >
            <MenuItem
              style={{
                fontSize: "12px",
                padding: "4px",
              }}
              value="F"
            >
              {t("FireAndForget")}
            </MenuItem>
            <MenuItem
              style={{
                fontSize: "12px",
                padding: "4px",
              }}
              value="A"
            >
              {t("Asynchronous")}
            </MenuItem>
            <MenuItem
              style={{
                fontSize: "12px",
                padding: "4px",
              }}
              value="S"
            >
              {t("Synchronous")}
            </MenuItem>
          </Select>
        </div>
        {invocationType == "A" ? (
          <div style={{ flex: "1" }}>
            <p style={{ fontSize: "12px", color: "#886F6F" }}>
              {t("JMS/SOAPTarget")}
              <span className="starIcon">*</span>
            </p>
            <Select
              className="select_webService_mapping"
              onChange={(e) => setSelectedDropDownActivity(e.target.value)}
              value={selectedDropDownActivity}
              style={{
                fontSize: "12px",
              }}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              {dropDownActivities?.map((activity) => {
                return (
                  <MenuItem
                    style={{
                      fontSize: "12px",
                      padding: "4px",
                    }}
                    value={activity.ActivityName}
                  >
                    {activity.ActivityName}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        ) : null}
        <div style={{ flex: `${invocationType == "A" ? "0.5" : "1.55"}` }}>
          <p style={{ fontSize: "12px", color: "#886F6F" }}>
            {t("TimeOut")}
            <span className="starIcon">*</span>
          </p>
          <TextInput
            type="number"
            inputValue={timeOutValue}
            idTag="timeOutWebservice"
            onChangeEvent={(e) => handleTimeOutChange(e)}
          />
        </div>
      </div>
      <div className="webS_props_tabStyles ">
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { background: "#0072C5" } }}
        >
          <Tab className={value === 0 && "tabLabel"} label="Forward Mapping" />
          <Tab className={value === 1 && "tabLabel"} label="Reverse Mapping" />
        </Tabs>
      </div>
      <div className="tabPanelStyles">
        <TabPanel value={value} index={0}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                marginTop: "1rem",
                marginBottom: "0.5rem",
                marginRight: "0.375rem",
              }}
            >
              <div
                style={{
                  height: "30px",
                  flex: "1",
                  backgroundColor: "#F4F4F4",
                  marginRight: "30px",
                  fontSize: "12px",
                  padding: "7px",
                  fontWeight: "600",
                }}
              >
                {t("SOAPInputParameters")}
              </div>
              <div
                style={{
                  height: "30px",
                  flex: "1",
                  backgroundColor: "#F4F4F4",
                  fontSize: "12px",
                  padding: "7px",
                  fontWeight: "600",
                }}
              >
                {t("CurrentProcessVariable(s)")}
              </div>
            </div>
            <div style={{ height: "16.5rem", overflow: "auto" }}>
              {forwardMappingList?.map((list, index) => {
                return (
                  <ReusableOneMap
                    mapField={list.fieldName}
                    varField={list.selectedVar}
                    dropDownOptions={getVarListByType(
                      variablesListForDropDown,
                      list
                    )}
                    dropDownKey="VariableName"
                    handleFieldMapping={(val) =>
                      handleForwardFieldMapping(val, list)
                    }
                  />
                );
              })}
            </div>
          </div>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  height: "30px",
                  flex: "1",
                  backgroundColor: "#F4F4F4",
                  marginRight: "30px",
                  fontSize: "12px",
                  padding: "7px",
                  fontWeight: "600",
                }}
              >
                {t("CurrentProcessVariable(s)")}
              </div>
              <div
                style={{
                  height: "30px",
                  flex: "1",
                  backgroundColor: "#F4F4F4",
                  fontSize: "12px",
                  padding: "7px",
                  fontWeight: "600",
                }}
              >
                {t("SOAPOutputParameters")}
              </div>
            </div>
            <div style={{ height: "16.5rem", overflow: "auto" }}>
              {reverseMappingList?.map((list, index) => {
                return (
                  <ReusableOneMap
                    mapField={
                      list.fieldName.processVarInfo
                        ? list.fieldName.processVarInfo.varName
                        : list.fieldName.VariableName
                    }
                    varField={list.selectedVar}
                    dropDownOptions={getRevVarListByType(
                      reverseDropdownOptions,
                      list
                    )}
                    dropDownKey="fieldName"
                    handleFieldMapping={(val) =>
                      handleReverseFieldMapping(val, list, index)
                    }
                    invocationType={invocationType}
                  />
                );
              })}
            </div>
          </div>
        </TabPanel>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
    openProcessID: state.openProcessClick.selectedId,
  };
};

export default connect(mapStateToProps, null)(Mapping);
