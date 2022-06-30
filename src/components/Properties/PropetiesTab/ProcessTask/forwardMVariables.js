import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReusableInputs from "./reusables/reusableInputs_Var.js";
import "./commonCallActivity.css";
import Modal from "../../../../UI/Modal/Modal";
import VariableList from "./reusables/variableList";
import { store, useGlobalState } from "state-pool";
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import ErrorToast from "../../../../UI/ErrorToast";
import { useDispatch, useSelector } from "react-redux";
import { propertiesLabel } from "../../../../Constants/appConstants";
import { useTranslation } from "react-i18next";

function ForwardMVariables(props) {
  const dispatch = useDispatch();
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [errorToast, setErrorToast] = React.useState(false);
  const tabStatus = useSelector(ActivityPropertyChangeValue);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [selectedVariableList, setSelectedVariableList] = useState(null);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [showRedBorder, setShowRedBorder] = useState(false);
  const ActivityPropertyBoolean = useSelector(ActivityPropertyChangeValue);

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      selectedVariableList &&
        selectedVariableList.map((el) => {
          if (!el.mappedFieldName || el.mappedFieldName.trim() == "") {
            setErrorToast(true);
            setShowRedBorder(true);
          }
        });
      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked]);

  const validateFunction = () => {
    let isValid = true;
    localLoadedActivityPropertyData?.m_objPMSubProcess?.fwdVarMapping.map(
      (el) => {
        if (!el.mappedFieldName || el.mappedFieldName.trim() == "") {
          isValid = false;
        }
      }
    );
    return isValid;
  };

  useEffect(() => {
    if (localLoadedActivityPropertyData?.m_objPMSubProcess?.fwdVarMapping) {
      let isValid = validateFunction();
      if (!isValid) {
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.fwdVarMappingProcessTask]: {
              isModified: true,
              hasError: true,
            },
          })
        );
      }
    }
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    let tempSelectedVariableList = [];
    let forwardVariableList =
      localLoadedActivityPropertyData &&
      localLoadedActivityPropertyData?.m_objPMSubProcess?.fwdVarMapping;
    forwardVariableList &&
      forwardVariableList.map((variable) => {
        tempSelectedVariableList.push({
          DefValue: "",
          ExtObjID: "0",
          SysName: variable.displayName,
          Unbounded: "N",
          VarID: variable.importedVarId,
          VarName: variable.importedFieldName,
          // importedFieldName: variable.importedFieldName,
          // importedVarFieldId: variable.importedVarFieldId,
          VarPrecision: "0",
          VarScope: "U",
          VarType: variable.fieldType,
          VariableLen: "8",
          isChecked: true,
          mappedFieldName: variable.mappedFieldName,
        });
      });
      setSelectedVariableList(tempSelectedVariableList);
  }, [localLoadedActivityPropertyData]);

  const MapSelectedVariables = (selectedVariables) => {
    setShowRedBorder(false);
    setSelectedVariableList(selectedVariables);
    let tempLocalState = { ...localLoadedActivityPropertyData };
    let forwardMapArr = [];
    selectedVariables.forEach((variable) => {
      forwardMapArr.push({
        displayName: variable.SysName,
        importedVarId: variable.VarID,
        importedFieldName: variable.VarName,
        fieldType: variable.VarType,
        mappedFieldName: variable.mappedFieldName,
        // importedFieldName: variable.importedFieldName,
        // importedVarFieldId: variable.importedVarFieldId,
        
      });
    });

    if (tempLocalState?.ActivityProperty) {
      tempLocalState.m_objPMSubProcess.fwdVarMapping = [...forwardMapArr];
    }
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.fwdVarMappingProcessTask]: {
          isModified: true,
          hasError: false,
        },
      })
    );
    // setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const handleFieldMapping = (varr, fieldValue) => {
    let forwardMapArr = [];
    let temp = [];
    let tempLocalState = { ...localLoadedActivityPropertyData };
    selectedVariableList.forEach((variable) => {
      temp.push({
        ...variable,
        mappedFieldName:
          variable.VarName === varr.VarName
            ? fieldValue
            : variable.mappedFieldName,
      });
      forwardMapArr.push({
        m_bSelected: true,
        displayName:
          variable.VarName === varr.VarName
            ? fieldValue
            : variable.mappedFieldName,
        importedVarId: variable.VarID,
        importedFieldName: variable.VarName,
        fieldType: variable.VarType,
        mappedFieldName:
          variable.VarName === varr.VarName
            ? fieldValue
            : variable.mappedFieldName,
        // ---
        importedFieldDataType: "4",
        importedVarFieldId: "0",
        m_arrCurrentPrcVar: [],
        m_bEnableFlag: false,
        m_strActVar: "",
        m_strEntityType: "A",
        m_strQualifiedName: "",
        mapType: "F",
        mappedVarFieldId: "0",
        mappedVarId: "10028",
      });
    });

    console.log("forwardmaparr", forwardMapArr);
    setSelectedVariableList(temp);
    if (tempLocalState) {
      tempLocalState.m_objPMSubProcess.fwdVarMapping = [...forwardMapArr];
    }
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.fwdVarMappingProcessTask]: {
          isModified: true,
          hasError: false,
        },
      })
    );
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const deleteVariablesFromList = (variablesToDelete) => {
    let tempVariablesList = selectedVariableList;
    let tempVariablesList_Filtered = tempVariablesList.filter((variable) => {
      return variablesToDelete !== variable;
    });
    setSelectedVariableList(tempVariablesList_Filtered);
  };

  console.log("PARTY", selectedVariableList);

  const content = () => {
    return (
      <div
        style={{
          backgroundColor: props.isDrawerExpanded ? "white" : null,
          width: props.isDrawerExpanded ? "144.3%" : "auto",
        }}
      >
        <div className="forwardMapping_VariablesLabel">
          <p style={{ fontSize: "12px", color: "#606060" }}>FORWARD MAPPING</p>
          <p
            style={{ fontSize: "11px", color: "#0072C6", cursor: "pointer" }}
            onClick={() => setShowVariablesModal(true)}
          >
            Add Variable(s)
          </p>
        </div>
        {/* ----------------------------------------- */}
        {/* <div>
          <Select
            className="selectTwo_callActivity"
            onChange={(e) => setSelectedRegisteredProcess(e.target.value)}
            style={{
              position: "absolute",
              right: props.isDrawerExpanded ? "26px" : "25px",
              width: props.isDrawerExpanded ? "280px" : "135px",
              width: "136px",
              height: "28px",
              background: "#ffffff 0% 0% no-repeat padding-box",
              font: "normal normal normal 12px/17px Open Sans !important",
              border: "1px solid #c4c4c4",
              borderRadius: "2px",
              opacity: "1",
            }}
            value={selectedRegisteredProcess}
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
            <MenuItem className="InputPairDiv_CommonList" value="S">
              Synchronous
            </MenuItem>
          </Select>
        </div> */}
        {/* ----------------------------------------- */}
        <div
          className={
            props.isDrawerExpanded
              ? "forwardMapping_VariablesHeaderDiv_Expanded"
              : "forwardMapping_VariablesHeaderDiv"
          }
        >
          <div
            className={
              props.isDrawerExpanded
                ? "forwardMapping_VariablesHeader_expanded forwardMapping_VariablesHeader_expanded1"
                : "forwardMapping_VariablesHeader"
            }
          >
            <p className="targetProcess">Target process</p>
            <p className="processName_CallActivity">
              {
                localLoadedActivityPropertyData?.m_objPMSubProcess
                  ?.importedProcessName
              }
            </p>
          </div>
          <div
            className={
              props.isDrawerExpanded
                ? "forwardMapping_VariablesHeader_expanded"
                : "forwardMapping_VariablesHeader"
            }
          >
            <p className="targetProcess">Current process</p>
            <p className="processName_CallActivity">
              {localLoadedProcessData.ProcessName}
            </p>
          </div>
        </div>

        {showVariablesModal && !props.isDrawerExpanded ? (
          <Modal
            show={showVariablesModal}
            backDropStyle={{ backgroundColor: "transparent" }}
            style={{
              top: "0%",
              // left: "-89%",
              left: props.isDrawerExpanded ? "-54%" : "-89%",
              position: "absolute",
              width: "327px",
              zIndex: "1500",
              boxShadow: "0px 3px 6px #00000029",
              border: "1px solid #D6D6D6",
              borderRadius: "3px",
              // height: "81vh",
              height: props.isDrawerExpanded ? "71vh" : "81vh",
            }}
            modalClosed={() => setShowVariablesModal(false)}
            children={
              <VariableList
                selectedVariables={MapSelectedVariables}
                setShowVariablesModal={setShowVariablesModal}
                selectedVariableList={selectedVariableList}
                tabType="ForwardMapping"
              />
            }
          ></Modal>
        ) : null}
        {selectedVariableList &&
          selectedVariableList.map((variable) => {
            return (
              <ReusableInputs
                variable={variable}
                handleFieldMapping={handleFieldMapping}
                deleteVariablesFromList={deleteVariablesFromList}
                showRedBorder={showRedBorder}
              />
            );
          })}
      </div>
    );
  };

  return (
    <div>
      {props.isDrawerExpanded ? (
        <div style={{ display: "flex" }}>
          <div style={{ width: "48%", position: "absolute", left: "30%" }}>
            {props.isDrawerExpanded ? (
              <div
                style={{
                  top: "0%",
                  left: props.isDrawerExpanded ? "-54%" : "-89%",
                  position: "absolute",
                  width: "327px",
                  zIndex: "1500",
                  boxShadow: "0px 3px 6px #00000029",
                  border: "1px solid #D6D6D6",
                  borderRadius: "3px",
                  height: props.isDrawerExpanded ? "71vh" : "81vh",
                }}
              >
                <VariableList
                  selectedVariables={MapSelectedVariables}
                  setShowVariablesModal={setShowVariablesModal}
                  selectedVariableList={selectedVariableList}
                  tabType="ForwardMapping"
                />
              </div>
            ) : null}
            {content()}
          </div>
        </div>
      ) : (
        content()
      )}

      <ErrorToast
        errorToast={errorToast}
        hideToast={() => setErrorToast(false)}
        errorMessage="This is an error message!"
        errorSeverity="error"
        errorClassName="callActivity_ErrorToast"
      />
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

export default connect(mapStateToProps, null)(ForwardMVariables);
