// Made changes to fix for Bug Ids  113431, 111550 & 110324
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReusableInputs from "./reusables/reusableInputs_VarR.js";
import "./commonCallActivity.css";
import Modal from "../../../../UI/Modal/Modal";
import VariableList from "./reusables/variableList";
import { store, useGlobalState } from "state-pool";
import { propertiesLabel } from "../../../../Constants/appConstants";
import { useDispatch, useSelector } from "react-redux";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import TabsHeading from "../../../../UI/TabsHeading/index.js";

function ReverseMVariables(props) {
  const dispatch = useDispatch();
  const loadedProcessData = store.getState("loadedProcessData");
  const [showRedBorder, setShowRedBorder] = useState(false);
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [selectedVariableList, setSelectedVariableList] = useState(null);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      selectedVariableList &&
        selectedVariableList.map((el) => {
          if (!el.mappedFieldName || el.mappedFieldName.trim() == "") {
            setShowRedBorder(true);
          }
        });
      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked]);

  useEffect(() => {
    let tempSelectedVariableList = [];
    let forwardVariableList =
      localLoadedActivityPropertyData.ActivityProperty.SubProcess.revVarMapping;
    forwardVariableList &&
      forwardVariableList.map((variable) => {
        tempSelectedVariableList.push({
          DefValue: "",
          ExtObjID: "0",
          SysName: variable.displayName,
          Unbounded: "N",
          VarID: variable.importedVarId,
          VarName: variable.importedFieldName,
          VarPrecision: "0",
          VarScope: "U",
          VarType: variable.fieldType,
          VariableLen: "8",
          isChecked: true,
          mappedFieldName: variable.mappedFieldName,
        });
      });
    setSelectedVariableList(tempSelectedVariableList);
  }, []);

  const validateFunction = () => {
    let isValid = true;
    localLoadedActivityPropertyData?.ActivityProperty?.SubProcess?.revVarMapping.map(
      (el) => {
        if (!el.mappedFieldName || el.mappedFieldName.trim() == "") {
          isValid = false;
        }
      }
    );
    return isValid;
  };

  useEffect(() => {
    if (
      localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
        ?.revVarMapping
    ) {
      let isValid = validateFunction();
      if (!isValid) {
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.revVarMapping]: {
              isModified: true,
              hasError: true,
            },
          })
        );
      }
    }
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
      });
    });

    tempLocalState.ActivityProperty.SubProcess.revVarMapping = [
      ...forwardMapArr,
    ];

    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.revVarMapping]: { isModified: true, hasError: false },
      })
    );
    // setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const handleFieldMapping = (varr, fieldValue) => {
    let forwardMapArr = [];
    let tempLocalState = { ...localLoadedActivityPropertyData };
    selectedVariableList.forEach((variable) => {
      forwardMapArr.push({
        displayName: variable.SysName,
        importedVarId: variable.VarID,
        importedFieldName: variable.VarName,
        fieldType: variable.VarType,
        mappedFieldName:
          variable.VarName === varr.VarName
            ? fieldValue
            : variable.mappedFieldName,
      });
    });

    tempLocalState.ActivityProperty.SubProcess.revVarMapping = [
      ...forwardMapArr,
    ];
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.revVarMapping]: { isModified: true, hasError: false },
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

  const content = () => {
    return (
    <>
        <TabsHeading heading={props.heading} />
      <div
        style={{
          backgroundColor: props.isDrawerExpanded ? "white" : null,
          width: props.isDrawerExpanded ? "144.3%" : "auto",
        }}
      >
        <div className="forwardMapping_VariablesLabel">
          <p style={{ fontSize: "12px", color: "#606060" }}>REVERSE MAPPING</p>
          <p
            style={{ fontSize: "11px", color: "var(--link_color)", cursor: "pointer" }}
            onClick={() => setShowVariablesModal(true)}
          >
            Add Variable(s)
          </p>
        </div>
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
                localLoadedActivityPropertyData?.ActivityProperty?.SubProcess?.importedProcessName
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
              left: "-89%",
              position: "absolute",
              width: "327px",
              zIndex: "1500",
              boxShadow: "0px 3px 6px #00000029",
              border: "1px solid #D6D6D6",
              borderRadius: "3px",
              height: "81vh",
            }}
            modalClosed={() => setShowVariablesModal(false)}
            children={
              <VariableList
                selectedVariables={MapSelectedVariables}
                setShowVariablesModal={setShowVariablesModal}
                selectedVariableList={selectedVariableList}
                tabType="ReverseMapping"
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
    </>
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
                  tabType="ReverseMapping"
                />
              </div>
            ) : null}
            {content()}
          </div>
        </div>
      ) : (
        content()
      )}
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
export default connect(mapStateToProps, null)(ReverseMVariables);
