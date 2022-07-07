import React, { useState, useEffect } from "react";
import { Select, MenuItem, List } from "@material-ui/core";
import "./index.css";
import { Tab, Tabs } from "@material-ui/core";
import { TabPanel } from "../../../ProcessSettings";
import ReusableOneMap from "./reusableOneMap";
// import Modal from "../../../../UI/Modal/Modal.js";
// import SoapParams from "./soapParams";
import { store, useGlobalState } from "state-pool";
import { getVariableByName } from "../../../../utility/ProcessSettings/Triggers/triggerCommonFunctions";
import { useDispatch, useSelector } from "react-redux";
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { propertiesLabel } from "../../../../Constants/appConstants";
import { connect } from "react-redux";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked";
import { OpenProcessSliceValue } from "../../../../redux-store/slices/OpenProcessSlice";

function Mapping(props) {
  const dispatch = useDispatch();
  const [selectedService, setSelectedService] = useState(null);
  const openProcessData = useSelector(OpenProcessSliceValue);
  const localLoadedProcessData = JSON.parse(
    JSON.stringify(openProcessData.loadedData)
  );
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
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);

  useEffect(() => {
    let temp = [];
    localLoadedProcessData.MileStones[0].Activities.map((activity) => {
      if (
        (activity.ActivityType == 23 && activity.ActivitySubType == 1) ||
        (activity.ActivityType == 24 && activity.ActivitySubType == 1)
      ) {
        temp.push(activity);
      }
    });
    setDropDownActivities(temp);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    let forwardInputParams = [];
    let reverseInputParams = [];
    let selectedWebService;
    let tempForwardList = [];
    let tempReverseList = [];
    let reverseList = [];
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

    localLoadedProcessData?.Variable?.forEach((varr) => {
      reverseList.push({
        fieldName: varr,
        fieldDataStructID: null,
        selectedVar: null,
      });
    });
    console.log("reverseInputParams", reverseInputParams);
    forwardInputParams?.forEach((param) => {
      if (param.ParamType == "11") {
        CreateParamKey(
          param.ParamName,
          param.DataStructureId,
          tempForwardList,
          selectedWebService
        );
      } else {
        tempForwardList.push({
          fieldName: param.ParamName,
          fieldDataStructID: param.DataStructureId,
          selectedVar: null,
        });
      }
    });

    reverseInputParams?.forEach((param) => {
      if (param.ParamType == "11") {
        CreateParamKey(
          param.ParamName,
          param.DataStructureId,
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
              let selectedVar = getVariableByName(
                el.selectedVar,
                localLoadedProcessData.Variable
              );
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
                  console.log("ELELLO", el, param);
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
    setSelectedService(selectedWebService);
    setReverseDropdownOptions(tempReverseList);
    console.log("catalog", tempForwardList, selectedWebService);
  }, [props.completeList, props.serviceNameClicked, props.combinations]);

  const CreateParamKey = (
    parentKey,
    parentIndex,
    arrayList,
    selectedWebService
  ) => {
    selectedWebService?.DataStructure?.forEach((ds) => {
      if (parentIndex == ds.ParentIndex && ds.Type != "11") {
        arrayList.push({
          fieldName: `${parentKey}.${ds.Name}`,
          fieldDataStructID: ds.DataStructureId,
          selectedVar: null,
        });
      } else if (parentIndex == ds.ParentIndex && ds.Type == "11") {
        CreateParamKey(
          `${parentKey}.${ds.Name}`,
          ds.DataStructureId,
          arrayList,
          selectedWebService
        );
      }
    });
  };

  const handleForwardFieldMapping = (selectedValue, list, indexInput) => {
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

    console.log("MAPPING", temp.ActivityProperty.webserviceInfo, indexValue);
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
        paramIndex: idx + 1,
        selectedVar: selectedValue.VariableName,
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
            paramIndex: forwardArr.length + 1,
            selectedVar: selectedValue.VariableName,
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
                paramIndex: forwardArr.length + 1,
                selectedVar: selectedValue.VariableName,
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
      if (arr.dataStructId === list.fieldDataStructID) {
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
        paramIndex: idx + 1,
        selectedVar: selectedValue.fieldDataStructID,
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
            paramIndex: ReverseArr.length + 1,
            selectedVar: selectedValue.fieldDataStructID,
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
                paramIndex: ReverseArr.length + 1,
                selectedVar: selectedValue.fieldDataStructID,
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
    console.log("SWAAD", e, props.serviceNameClicked);
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
    // if (saveCancelStatus.SaveClicked) {
    setlocalLoadedActivityPropertyData(temp);
    // }
  };

  return (
    <div style={{ padding: "20px", width: "58%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ marginRight: "20px" }}>
          <p
            style={{ fontSize: "12px", color: "#886F6F" }}
            // onClick={() => setShowSOAPParamsModal(true)}
          >
            Invocation Type
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
              Fire And Forget
            </MenuItem>
            <MenuItem
              style={{
                fontSize: "12px",
                padding: "4px",
              }}
              value="A"
            >
              Asynchronous
            </MenuItem>
            <MenuItem
              style={{
                fontSize: "12px",
                padding: "4px",
              }}
              value="S"
            >
              Synchronous
            </MenuItem>
          </Select>
        </div>
        {invocationType == "A" ? (
          <div>
            <p style={{ fontSize: "12px", color: "#886F6F" }}>
              JMS/SOAP Target
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
        {invocationType == "S" ? (
          <div>
            <p style={{ fontSize: "12px", color: "#886F6F" }}>Time Out</p>
            <Select
              className="select_webService_timeOut"
              // onChange={(e) => setSelectedWebService(e.target.value)}
              // value={selectedWebService}
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
                Fire And Forget
              </MenuItem>
              <MenuItem
                style={{
                  fontSize: "12px",
                  padding: "4px",
                }}
                value="A"
              >
                Asynchronous
              </MenuItem>
              <MenuItem
                style={{
                  fontSize: "12px",
                  padding: "4px",
                }}
                value="S"
              >
                Synchronous
              </MenuItem>
            </Select>
          </div>
        ) : null}
      </div>

      <div className="tabStyles ">
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
                marginTop: "20px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  height: "30px",
                  width: "220px",
                  backgroundColor: "#F4F4F4",
                  marginRight: "30px",
                  fontSize: "12px",
                  padding: "7px",
                }}
              >
                SOAP Input Parameters
              </div>
              <div
                style={{
                  height: "30px",
                  width: "220px",
                  backgroundColor: "#F4F4F4",
                  fontSize: "12px",
                  padding: "7px",
                }}
              >
                Current Process Variable(s)
              </div>
            </div>
            <div style={{ height: "270px", overflow: "scroll" }}>
              {forwardMappingList?.map((list, index) => {
                return (
                  <ReusableOneMap
                    mapField={list.fieldName}
                    varField={list.selectedVar}
                    dropDownOptions={localLoadedProcessData?.Variable}
                    dropDownKey="VariableName"
                    handleFieldMapping={(val) =>
                      handleForwardFieldMapping(val, list, index)
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
                  width: "220px",
                  backgroundColor: "#F4F4F4",
                  marginRight: "30px",
                  fontSize: "12px",
                  padding: "7px",
                }}
              >
                SOAP Input Parameters
              </div>
              <div
                style={{
                  height: "30px",
                  width: "220px",
                  backgroundColor: "#F4F4F4",
                  fontSize: "12px",
                  padding: "7px",
                }}
              >
                Current Process Variable(s)
              </div>
            </div>
            <div style={{ height: "270px", overflow: "scroll" }}>
              {reverseMappingList?.map((list, index) => {
                return (
                  <ReusableOneMap
                    mapField={list.fieldName.VariableName}
                    varField={list.selectedVar}
                    dropDownOptions={reverseDropdownOptions}
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
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
    openProcessID: state.openProcessClick.selectedId,
  };
};

export default connect(mapStateToProps, null)(Mapping);
