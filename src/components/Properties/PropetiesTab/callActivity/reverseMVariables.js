// Made changes to fix for Bug Ids  113431, 111550 & 110324
// Changes made to solve Bug 116388 - Call Activity: Add document button is not working in Expanded mode
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReusableInputs from "./reusables/reusableInputs_VarR.js";
import "./commonCallActivity.css";
import Modal from "../../../../UI/Modal/Modal";
import { store, useGlobalState } from "state-pool";
import {
  propertiesLabel,
  SERVER_URL,
  VARDOC_LIST,
} from "../../../../Constants/appConstants";
import { useDispatch, useSelector } from "react-redux";
import { ActivityPropertySaveCancelValue } from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import TabsHeading from "../../../../UI/TabsHeading/index.js";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall.js";
import { CircularProgress } from "@material-ui/core";
import VariableReverseList from "./reusables/variableReverseList.js";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";

/*code edited on 6 Sep 2022 for BugId 115378 */
function ReverseMVariables(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const loadedProcessData = store.getState("loadedProcessData");
  const [showRedBorder, setShowRedBorder] = useState(false);
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [selectedVariableList, setSelectedVariableList] = useState(null);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [spinner, setSpinner] = useState(true);
  const [targetProcessVarList, setTargetProcessVarList] = useState([]);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
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

  useEffect(() => {
    let tempSelectedVariableList = [];
    let idmap = {};
    let forwardVariableList =
      localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
        ?.revVarMapping;
    localLoadedProcessData?.Variable?.forEach((variable) => {
      idmap = { ...idmap, [variable.VariableId]: variable.VariableType };
    });
    forwardVariableList?.map((variable) => {
      tempSelectedVariableList.push({
        DefaultValue: "",
        ExtObjectId: "0",
        SystemDefinedName: variable.displayName,
        Unbounded: "N",
        VarFieldId: "0",
        VarPrecision: "0",
        VariableId: variable.importedVarId,
        VariableLength: "8",
        VariableName: variable.importedFieldName,
        VariableScope: "U",
        VariableType: idmap[variable.importedVarId],
        isChecked: true,
        mappedFieldName: variable.mappedFieldName,
        mappedVarId: variable.mappedVarId,
        mappedVarFieldId: variable.mappedVarFieldId,
      });
    });
    setSelectedVariableList(tempSelectedVariableList);
    if (
      localLoadedActivityPropertyData?.ActivityProperty?.SubProcess?.importedProcessDefId?.trim() !==
      ""
    ) {
      let jsonBody = {
        processDefId:
          localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
            ?.importedProcessDefId,
        extTableDataFlag: "Y",
        docReq: "Y",
        omniService: "Y",
      };
      axios.post(SERVER_URL + VARDOC_LIST, jsonBody).then((res) => {
        if (res.data.Status === 0) {
          setTargetProcessVarList(res.data.VarDefinition);
          setSpinner(false);
        }
      });
    } else {
      setSpinner(false);
    }
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
      if (saveCancelStatus.SaveClicked) {
        setShowRedBorder(true);
      }
    }
  }, []);

  const validateFunction = () => {
    let isValid = true;
    if (
      !localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
        ?.revVarMapping ||
      localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
        ?.revVarMapping?.length === 0
    ) {
      isValid = false;
    } else {
      localLoadedActivityPropertyData?.ActivityProperty?.SubProcess?.revVarMapping?.map(
        (el) => {
          if (!el.mappedFieldName || el.mappedFieldName?.trim() === "") {
            isValid = false;
          }
        }
      );
    }
    return isValid;
  };

  const MapSelectedVariables = (selectedVariables) => {
    setShowRedBorder(false);
    setSelectedVariableList(selectedVariables);
    let tempLocalState = JSON.parse(
      JSON.stringify(localLoadedActivityPropertyData)
    );
    let forwardMapArr = [];
    selectedVariables.forEach((variable) => {
      forwardMapArr.push({
        displayName: variable.SystemDefinedName,
        importedVarId: variable.VariableId,
        importedFieldName: variable.VariableName,
        importedFieldDataType: variable.VariableType,
        importedVarFieldId: variable.VarFieldId,
        m_strEntityType: "A",
        m_bSelected: true,
        mappedFieldName: variable.mappedFieldName,
        mappedVarId: variable.mappedVarId,
        mappedVarFieldId: variable.mappedVarFieldId,
      });
    });

    if (tempLocalState?.ActivityProperty?.SubProcess?.revVarMapping) {
      tempLocalState.ActivityProperty.SubProcess.revVarMapping = [
        ...forwardMapArr,
      ];
    } else {
      tempLocalState.ActivityProperty.SubProcess = {
        ...tempLocalState.ActivityProperty.SubProcess,
        revVarMapping: [...forwardMapArr],
      };
    }
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.revVarMapping]: { isModified: true, hasError: false },
      })
    );
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const handleFieldMapping = (varr, fieldValue) => {
    let forwardMapArr = [];
    let tempLocalState = JSON.parse(
      JSON.stringify(localLoadedActivityPropertyData)
    );
    let selVariable = null;
    targetProcessVarList?.forEach((el) => {
      if (el.VarName === fieldValue) {
        selVariable = el;
      }
    });

    selectedVariableList.forEach((variable) => {
      forwardMapArr.push({
        ...variable,
        mappedFieldName:
          variable.VariableId === varr.VariableId
            ? fieldValue
            : variable.mappedFieldName,
        mappedVarId: selVariable.VarID,
        mappedVarFieldId: "0",
      });
    });

    tempLocalState?.ActivityProperty?.SubProcess?.revVarMapping?.map(
      (el, idx) => {
        if (+el.importedVarId === +varr.VariableId) {
          tempLocalState.ActivityProperty.SubProcess.revVarMapping[idx] = {
            ...el,
            m_bSelected: true,
            mappedFieldName: fieldValue,
            mappedVarId: selVariable.VarID,
            mappedVarFieldId: "0",
          };
        }
      }
    );
    setSelectedVariableList(forwardMapArr);
    setlocalLoadedActivityPropertyData(tempLocalState);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.revVarMapping]: { isModified: true, hasError: false },
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
    tempLocalState?.ActivityProperty?.SubProcess?.revVarMapping?.map(
      (el, idx) => {
        if (+el.importedVarId === +variablesToDelete.VariableId) {
          tempLocalState.ActivityProperty.SubProcess.revVarMapping.splice(
            idx,
            1
          );
        }
      }
    );
    setSelectedVariableList(tempVariablesList_Filtered);
    setlocalLoadedActivityPropertyData(tempLocalState);
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
          <p
            style={{
              fontSize: "12px",
              color: "#606060",
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            {t("reverseMapping")}
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
                  : dispatch(
                      setToastDataFunc({
                        message:
                          "Please select Register Process Name from Basic details tab",
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
        {selectedVariableList &&
          selectedVariableList.map((variable) => {
            return (
              <ReusableInputs
                variable={variable}
                handleFieldMapping={handleFieldMapping}
                targetProcessVarList={targetProcessVarList}
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
              padding: "0",
              boxShadow: "0px 3px 6px #00000029",
              border: "1px solid #D6D6D6",
              borderRadius: "3px",
              height: "81vh",
            }}
            modalClosed={() => setShowVariablesModal(false)}
            children={
              <VariableReverseList
                selectedVariables={MapSelectedVariables}
                setShowVariablesModal={setShowVariablesModal}
                selectedVariableList={selectedVariableList}
                tabType="ReverseMapping"
                propLabel="revVarMapping"
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
      <TabsHeading heading={props.heading} />
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
            <VariableReverseList
              selectedVariables={MapSelectedVariables}
              setShowVariablesModal={setShowVariablesModal}
              selectedVariableList={selectedVariableList}
              tabType="ReverseMapping"
              propLabel="revVarMapping"
              isReadOnly={isReadOnly}
            />
          </div>

          {content()}
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
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
  };
};
export default connect(mapStateToProps, null)(ReverseMVariables);
