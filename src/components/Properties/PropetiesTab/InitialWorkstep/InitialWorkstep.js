import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";
import * as actionCreators from "../../../../redux-store/actions/selectedCellActions";
import { connect } from "react-redux";
import "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setSave,
  ActivityPropertySaveCancelValue,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import Modal from "../../../../UI/Modal/Modal.js";
import ReusableInputs_Var from "../callActivity/reusables/reusableInputs_Var.js";
import VariableList from "../callActivity/reusables/variableList";
import ErrorToast from "../../../../UI/ErrorToast/index.js";
import TabsHeading from "../../../../UI/TabsHeading";

function InitialWorkstep(props) {
  let { t } = useTranslation();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [selectedVariableList, setSelectedVariableList] = useState(null);
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [showRedBorder, setShowRedBorder] = useState(false);
  const [errorToast, setErrorToast] = React.useState(false);
  const dispatch = useDispatch();
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);

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

  useEffect(() => {
    let tempSelectedVariableList = [];
    let forwardVariableList =
      localLoadedActivityPropertyData &&
      localLoadedActivityPropertyData.ActivityProperty.pMMessageEnd &&
      localLoadedActivityPropertyData.ActivityProperty.pMMessageEnd
        .fwdVarMapping;

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
    setSelectedVariableList(temp);
    tempLocalState.ActivityProperty.pMMessageEnd.fwdVarMapping = [
      ...forwardMapArr,
    ];
    dispatch(
      setActivityPropertyChange({
        initialWorkstep: { isModified: true, hasError: false },
      })
    );
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

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

    tempLocalState.ActivityProperty.pMMessageEnd.fwdVarMapping = [
      ...forwardMapArr,
    ];

    dispatch(
      setActivityPropertyChange({
        initialWorkstep: { isModified: true, hasError: false },
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
      <React.Fragment>
      <TabsHeading heading={props?.heading} />
        <div
          style={{
            backgroundColor: props.isDrawerExpanded ? "white" : null,
            width: props.isDrawerExpanded ? "144.3%" : "auto",
          }}
        >
          <div className="forwardMapping_VariablesLabel">
            <p style={{ fontSize: "12px", color: "#606060" }}>
              {t("frwdMapping")}
            </p>
            <p
              style={{ fontSize: "11px", color: "#0072C6", cursor: "pointer" }}
              onClick={() => setShowVariablesModal(true)}
            >
              {t("addVariables")}
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
              <p className="targetProcess">{t("targetProcess")}</p>
              <p className="processName_CallActivity">
                {localLoadedActivityPropertyData &&
                  localLoadedActivityPropertyData.ActivityProperty.pMMessageEnd
                    .processName}
              </p>
            </div>
            <div
              className={
                props.isDrawerExpanded
                  ? "forwardMapping_VariablesHeader_expanded"
                  : "forwardMapping_VariablesHeader"
              }
            >
              <p className="targetProcess">{t("currentProcess")}</p>
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
                <ReusableInputs_Var
                  variable={variable}
                  handleFieldMapping={handleFieldMapping}
                  deleteVariablesFromList={deleteVariablesFromList}
                  showRedBorder={showRedBorder}
                />
              );
            })}
        </div>
      </React.Fragment>
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
        setErrorToast={setErrorToast}
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
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, null)(InitialWorkstep);
