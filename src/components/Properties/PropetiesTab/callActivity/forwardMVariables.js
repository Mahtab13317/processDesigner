// Made changes to fix for Bug Ids  113431, 111550 & 110324
// Changes made to solve Bug 116388 - Call Activity: Add document button is not working in Expanded mode

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReusableInputs from "./reusables/reusableInputs_Var.js";
import "./commonCallActivity.css";
import Modal from "../../../../UI/Modal/Modal";
import VariableList from "./reusables/variableList";
import { store, useGlobalState } from "state-pool";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import ErrorToast from "../../../../UI/ErrorToast";
import { useDispatch, useSelector } from "react-redux";
import { propertiesLabel } from "../../../../Constants/appConstants";
import { useTranslation } from "react-i18next";
import TabsHeading from "../../../../UI/TabsHeading/index.js";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall.js";
import { CircularProgress } from "@material-ui/core";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";

/*code edited on 6 Sep 2022 for BugId 115378 */
function ForwardMVariables(props) {
  const dispatch = useDispatch();
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [errorToast, setErrorToast] = React.useState(false);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [selectedVariableList, setSelectedVariableList] = useState(null);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [showRedBorder, setShowRedBorder] = useState(false);
  const [spinner, setSpinner] = useState(true);
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut);

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      selectedVariableList?.map((el) => {
        if (!el.mappedFieldName || el.mappedFieldName.trim() == "") {
          setShowRedBorder(true);
        }
      });
    }
  }, [saveCancelStatus.SaveClicked]);

  const validateFunction = () => {
    let isValid = true;
    if (
      !localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
        ?.fwdVarMapping ||
      localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
        ?.fwdVarMapping?.length === 0
    ) {
      isValid = false;
    } else {
      localLoadedActivityPropertyData?.ActivityProperty?.SubProcess?.fwdVarMapping?.map(
        (el) => {
          if (!el.mappedFieldName || el.mappedFieldName?.trim() === "") {
            isValid = false;
          }
        }
      );
    }
    return isValid;
  };

  useEffect(() => {
    let tempSelectedVariableList = [];
    let forwardVariableList =
      localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
        ?.fwdVarMapping;
    forwardVariableList?.map((variable) => {
      tempSelectedVariableList.push({
        DefValue: "",
        ExtObjID: "0",
        SysName: variable.displayName,
        Unbounded: "N",
        VarID: variable.importedVarId,
        VarName: variable.importedFieldName,
        VarPrecision: "0",
        VarScope: "U",
        VarType: variable.importedFieldDataType,
        VariableLen: "8",
        isChecked: true,
        mappedFieldName: variable.mappedFieldName,
        mappedVarId: variable.mappedVarId,
        mappedVarFieldId: variable.mappedVarFieldId,
      });
    });
    setSelectedVariableList(tempSelectedVariableList);
    setSpinner(false);
    let isValid = validateFunction();
    if (!isValid) {
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.fwdVarMapping]: {
            isModified: true,
            hasError: true,
          },
        })
      );
      if (saveCancelStatus.SaveClicked) {
        setShowRedBorder(true);
      }
    }
  }, []);

  const MapSelectedVariables = (selectedVariables) => {
    setShowRedBorder(false);
    setSelectedVariableList(selectedVariables);
    let tempLocalState = JSON.parse(
      JSON.stringify(localLoadedActivityPropertyData)
    );
    let forwardMapArr = [];
    selectedVariables.forEach((variable) => {
      forwardMapArr.push({
        displayName: variable.SysName,
        importedVarId: variable.VarID,
        importedFieldName: variable.VarName,
        importedFieldDataType: variable.VarType,
        importedVarFieldId: "0",
        m_strEntityType: "A",
        m_bSelected: true,
        mappedFieldName: variable.mappedFieldName,
        mappedVarId: variable.mappedVarId,
        mappedVarFieldId: variable.mappedVarFieldId,
      });
    });

    if (tempLocalState?.ActivityProperty?.SubProcess?.fwdVarMapping) {
      tempLocalState.ActivityProperty.SubProcess.fwdVarMapping = [
        ...forwardMapArr,
      ];
    } else {
      tempLocalState.ActivityProperty.SubProcess = {
        ...tempLocalState.ActivityProperty.SubProcess,
        fwdVarMapping: [...forwardMapArr],
      };
    }
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.fwdVarMapping]: { isModified: true, hasError: false },
      })
    );
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const handleFieldMapping = (varr, fieldValue) => {
    let temp = [];
    let tempLocalState = JSON.parse(
      JSON.stringify(localLoadedActivityPropertyData)
    );
    let selVariable = null;
    localLoadedProcessData.Variable?.forEach((el) => {
      if (el.VariableName === fieldValue) {
        selVariable = el;
      }
    });

    selectedVariableList.forEach((variable) => {
      temp.push({
        ...variable,
        mappedFieldName:
          variable.VarName === varr.VarName
            ? fieldValue
            : variable.mappedFieldName,
        mappedVarId: selVariable.VariableId,
        mappedVarFieldId: selVariable.VarFieldId,
      });
    });
    tempLocalState?.ActivityProperty?.SubProcess?.fwdVarMapping?.map(
      (el, idx) => {
        if (+el.importedVarId === +varr.VarID) {
          tempLocalState.ActivityProperty.SubProcess.fwdVarMapping[idx] = {
            ...el,
            m_bSelected: true,
            mappedFieldName: fieldValue,
            mappedVarId: selVariable.VariableId,
            mappedVarFieldId: selVariable.VarFieldId,
          };
        }
      }
    );
    setSelectedVariableList(temp);
    setlocalLoadedActivityPropertyData(tempLocalState);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.fwdVarMapping]: { isModified: true, hasError: false },
      })
    );
  };

  const deleteVariablesFromList = (variablesToDelete) => {
    let tempVariablesList = [...selectedVariableList];
    let tempLocalState = JSON.parse(
      JSON.stringify(localLoadedActivityPropertyData)
    );
    let tempVariablesList_Filtered = tempVariablesList.filter((variable) => {
      return variablesToDelete !== variable;
    });
    tempLocalState?.ActivityProperty?.SubProcess?.fwdVarMapping?.map(
      (el, idx) => {
        if (+el.importedVarId === +variablesToDelete.VarID) {
          tempLocalState.ActivityProperty.SubProcess.fwdVarMapping.splice(
            idx,
            1
          );
        }
      }
    );
    setSelectedVariableList(tempVariablesList_Filtered);
    setlocalLoadedActivityPropertyData(tempLocalState);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.fwdVarMapping]: { isModified: true, hasError: false },
      })
    );
  };

  const content = () => {
    return (
      <div
        style={{
          backgroundColor: props.isDrawerExpanded ? "white" : null,
          width: props.isDrawerExpanded ? "75%" : "auto",
        }}
      >
        <div className="forwardMapping_VariablesLabel">
          <p style={{ fontSize: "12px", color: "#606060", fontWeight: "600" }}>
            FORWARD MAPPING
          </p>
          {isReadOnly ? (
            <p></p>
          ) : (
            <p
              style={{
                fontSize: "11px",
                color: "var(--link_color)",
                cursor: "pointer",
                fontWeight: "500",
              }}
              onClick={() =>
                localLoadedActivityPropertyData?.ActivityProperty?.SubProcess?.importedProcessDefId?.trim() !==
                ""
                  ? setShowVariablesModal(true)
                  :  dispatch(
                    setToastDataFunc({
                      message: 'Please select Register Process Name from Basic details tab',
                      severity: "error",
                      open: true,
                    })
                  )
              }
            >
              {props.isDrawerExpanded?null:'Add Variable(s)'}
            </p>
          )}
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
                localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
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
        {selectedVariableList?.map((variable) => {
          return (
            <ReusableInputs
              variable={variable}
              handleFieldMapping={handleFieldMapping}
              deleteVariablesFromList={deleteVariablesFromList}
              showRedBorder={showRedBorder}
              isReadOnly={isReadOnly}
            />
          );
        })}
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
              padding: "0",
              height: "81vh",
            }}
            modalClosed={() => setShowVariablesModal(false)}
            children={
              <VariableList
                selectedVariables={MapSelectedVariables}
                setShowVariablesModal={setShowVariablesModal}
                selectedVariableList={selectedVariableList}
                tabType="ForwardMapping"
                propLabel="fwdVarMapping"
                isReadOnly={isReadOnly}
              />
            }
          ></Modal>
        ) : null}
      </div>
    );
  };

  return spinner ? (
    <CircularProgress style={{ marginTop: "30vh", marginLeft: "40%" }} />
  ) : (
    <div>
      <TabsHeading heading={props?.heading} />
      {props.isDrawerExpanded ? (
        <div style={{ display: "flex", gap: "1vw", padding: "0 0.5vw" }}>
          <div
            style={{
              width: "24%",
              boxShadow: "0px 3px 6px #00000029",
              border: "1px solid #D6D6D6",
              borderRadius: "3px",
              padding: "0",
              height: "61vh",
            }}
          >
            <VariableList
              selectedVariables={MapSelectedVariables}
              setShowVariablesModal={setShowVariablesModal}
              selectedVariableList={selectedVariableList}
              tabType="ForwardMapping"
              propLabel="fwdVarMapping"
              isReadOnly={isReadOnly}
            />
          </div>
          {content()}
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
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
  };
};

export default connect(mapStateToProps, null)(ForwardMVariables);
