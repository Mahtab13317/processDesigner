import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";
import * as actionCreators from "../../../../redux-store/actions/Properties/showDrawerAction";
import { connect } from "react-redux";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import styles from "./index.module.css";
import { Select, MenuItem } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  setSave,
  ActivityPropertySaveCancelValue,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ENDPOINT_REGISTER_SAP,
  ENDPOINT_SAP_FUNCTION,
  propertiesLabel,
  RTL_DIRECTION,
  SERVER_URL,
} from "../../../../Constants/appConstants.js";
import arabicStyles from "./ArabicStyles.module.css";
import Input from "./Input";
import Output from "./Output";
import Table from "./Table";
import Tabs from "../../../../UI/Tab/Tab.js";
import axios from "axios";

function Sap(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [sapActivityData, setsapActivityData] = useState(null);
  const [registerFunctionList, setregisterFunctionList] = useState([]);
  const [configDrop, setconfigDrop] = useState([]);
  const [selectedFunction, setselectedFunction] = useState(null);
  const [selectedConfig, setselectedConfig] = useState(null);
  const [sapUserDrop, setSAPUserDrop] = useState([]);
  const [processVarDropdown, setprocessVarDropdown] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const dispatch = useDispatch();
  const [sapOutput, setSapOutput] = useState(null);
  const [isChangeFunc, setIsChangeFunc] = useState(null);

  const parameterHandler = () => {
    props.expandDrawer(!props.isDrawerExpanded);
  };

  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          ENDPOINT_SAP_FUNCTION +
          "/" +
          localLoadedProcessData.ProcessDefId +
          "/" +
          localLoadedProcessData.ProcessType
      )
      .then((res) => {
        if (res.data.Status === 0) {
          setregisterFunctionList(res?.data?.SAPFunctions);
          const filterFuncList = res?.data?.SAPFunctions?.filter(
            (d) =>
              d.FunctionID ==
              localLoadedActivityPropertyData?.ActivityProperty
                ?.m_objPMSAPAdapterInfo?.m_strSelectedSAPFunction
          );
         

          setSapOutput(filterFuncList);
        }
      });

   

    axios.get(SERVER_URL + ENDPOINT_REGISTER_SAP).then((res) => {
      setconfigDrop(res.data);
    });

    setSAPUserDrop(
      localLoadedProcessData?.Variable?.filter(
        (val) => val.VariableType == "10"
      )
    );
    let tempProcessdropDown = [];
    
    setprocessVarDropdown(localLoadedProcessData?.Variable);

    let temp =
      localLoadedActivityPropertyData?.ActivityProperty?.m_objPMSAPAdapterInfo;
    setselectedFunction(temp?.m_strSelectedSAPFunction);
    setselectedConfig(temp?.m_strSelectedSAPConfig);
    setSelectedUserName(temp?.m_sSapUserName);
    setsapActivityData(temp);
    setIsChangeFunc(temp?.m_strSelectedSAPFunction);
  }, []);


 

  const getSelectedVal = (e) => {
    setselectedFunction(e.target.value);
    const temp = [...registerFunctionList];
    const funcList = temp.filter((d) => d.FunctionID === e.target.value);
    setSapOutput(funcList);

    
    const tempLocalState = { ...localLoadedActivityPropertyData };
    tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo.m_strSelectedSAPFunction =
      e.target.value;

      if(isChangeFunc!=e.target.value)
      {
        tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo.mapSAPInputParamMapInfo =
        [];
  
        tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo.mapSAPOutputParamMapInfoComplex =
        [];
  
        tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo.mapSAPtableParamMapInfoComplex =
        [];
      }

    

    setlocalLoadedActivityPropertyData(tempLocalState);

    dispatch(
      setActivityPropertyChange({
        SAPAdapter: { isModified: true, hasError: false },
      })
    );


  };

  const changeUsername = (userVal) => {
    
    setSelectedUserName(userVal);
    const tempLocalState = { ...localLoadedActivityPropertyData };
    tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo.m_sSapUserName =
      userVal;
    setlocalLoadedActivityPropertyData(tempLocalState);

    dispatch(
      setActivityPropertyChange({
        SAPAdapter: { isModified: true, hasError: false },
      })
    );
  };

  const changeConfig = (val) => {
    setselectedConfig(val);
    const tempLocalState = { ...localLoadedActivityPropertyData };
    tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo.m_strSelectedSAPConfig =
      val;
    setlocalLoadedActivityPropertyData(tempLocalState);

    dispatch(
      setActivityPropertyChange({
        SAPAdapter: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <React.Fragment>
      {props.isDrawerExpanded && sapOutput ? (
        <div style={{ margin: "1%" }}>
          <h4>{t("SAP")}</h4>
          <div className="row" style={{ marginTop: "1%" }}>
            <div>
              <p className={styles.dropdownLabel}>{t("registerFunctions")}</p>
              <Select
                className={styles.dataDropdown}
                MenuProps={{
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
                }}
                style={{ width: "10rem", border: ".5px solid #c4c4c4" }}
                value={selectedFunction}
                onChange={getSelectedVal}
                id="sap_selectedFunction"
              >
                {registerFunctionList?.map((option) => {
                  return (
                    <MenuItem
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.webSDropdownData
                          : styles.webSDropdownData
                      }
                      value={option.FunctionID}
                    >
                      {option.FunctionName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div style={{ marginLeft: "2rem" }}>
              <p className={styles.dropdownLabel}>{t("sapConfig")}</p>
              <Select
                className={styles.dataDropdown}
                MenuProps={{
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
                }}
                style={{ width: "10rem", border: ".5px solid #c4c4c4" }}
                value={selectedConfig}
                onChange={(e) => changeConfig(e.target.value)}
                id="sap_selectedConfig"
              >
                {configDrop?.map((option) => {
                  return (
                    <MenuItem
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.webSDropdownData
                          : styles.webSDropdownData
                      }
                      value={option.iConfigurationId}
                    >
                      {option.configurationName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div style={{ marginLeft: "2rem" }}>
              <p className={styles.dropdownLabel}>{t("sapUserName")}</p>
              <Select
                className={styles.dataDropdown}
                MenuProps={{
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
                }}
                style={{ width: "10rem", border: ".5px solid #c4c4c4" }}
                value={selectedUserName}
                onChange={(e) => changeUsername(e.target.value)}
                id="selectedUser"
              >
                {sapUserDrop?.map((option) => {
                  return (
                    <MenuItem
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.webSDropdownData
                          : styles.webSDropdownData
                      }
                      value={option.VariableName}
                    >
                      {option.VariableName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>

          <h4 style={{ marginTop: "2%" }}>{t("parameterMapping")}</h4>

          <Tabs
            tabType="processSubTab"
            tabContentStyle="processSubTabContentStyle"
            tabBarStyle="processSubTabBarStyle"
            oneTabStyle="processSubOneTabStyle"
            tabStyling="processViewTabs"
            tabsStyle="processViewSubTabs"
            TabNames={[t("Input"), t("Output"), t("table")]}
            TabElement={[
              <Input
                sapOutput={sapOutput}
                processVarDropdown={processVarDropdown}
                changeFunction={isChangeFunc}
              />,
              <Output
                sapOutput={sapOutput}
                processVarDropdown={processVarDropdown}
                changeFunction={isChangeFunc}
              />,
              <Table
                sapOutput={sapOutput}
                processVarDropdown={processVarDropdown}
                changeFunction={isChangeFunc}
              />,
            ]}
          />
        </div>
      ) : (
        <React.Fragment>
          <div style={{ marginTop: "1%" }}>
            <div>
              <p className={styles.dropdownLabelCompact}>
                {t("registerFunctions")}
              </p>
              <Select
                className={styles.dataDropdown}
                MenuProps={{
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
                }}
                style={{ width: "10rem", border: ".5px solid #c4c4c4" }}
                value={selectedFunction}
                onChange={(e) => setselectedFunction(e.target.value)}
                id="sap_selectedFunction"
              >
                {registerFunctionList?.map((option) => {
                  return (
                    <MenuItem
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.webSDropdownData
                          : styles.webSDropdownData
                      }
                      value={option.FunctionID}
                    >
                      {option.FunctionName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div>
              <p className={styles.dropdownLabelCompact}>{t("sapConfig")}</p>
              <Select
                className={styles.dataDropdown}
                MenuProps={{
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
                }}
                style={{ width: "10rem", border: ".5px solid #c4c4c4" }}
                value={selectedConfig}
                onChange={(e) => setselectedConfig(e.target.value)}
                id="sap_selectedConfig"
              >
                {configDrop?.map((option) => {
                  return (
                    <MenuItem
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.webSDropdownData
                          : styles.webSDropdownData
                      }
                      value={option.iConfigurationId}
                    >
                      {option.configurationName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div>
              <p className={styles.dropdownLabelCompact}>{t("sapUserName")}</p>
              <Select
                className={styles.dataDropdown}
                MenuProps={{
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
                }}
                style={{ width: "10rem", border: ".5px solid #c4c4c4" }}
                value={selectedUserName}
                onChange={(e) => setSelectedUserName(e.target.value)}
                id="selectedUser"
              >
                {sapUserDrop?.map((option) => {
                  return (
                    <MenuItem
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.webSDropdownData
                          : styles.webSDropdownData
                      }
                      value={option}
                    >
                      {option.VariableName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
          <h4 style={{ margin: "5%" }}>{t("parameterMapping")}</h4>
          <button className={styles.viewParameter} onClick={parameterHandler}>
            {t("viewParameterMapping")}
          </button>
        </React.Fragment>
      )}
    </React.Fragment>
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
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    expandDrawer: (flag) => dispatch(actionCreators.expandDrawer(flag)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sap);
