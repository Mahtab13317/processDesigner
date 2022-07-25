import React, { useState, useEffect } from "react";
import CommonTabHeader from "../commonHeader";
import { store, useGlobalState } from "state-pool";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { Select, MenuItem } from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  DATE_VARIABLE_TYPE,
  PROCESSTYPE_LOCAL,
  propertiesLabel,
} from "../../../../../Constants/appConstants";
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../../redux-store/slices/ActivityPropertyChangeSlice";
import Modal from "../../../../../UI/Modal/Modal";
import VariableList from "../MappingLists/variableListForward";
import DeleteIcon from "@material-ui/icons/Delete";
import "./index.css";

function ForwardForVariables(props) {
  // Process Data
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  // Activity Data
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  // States for this File
  const [forwardVariablesList, setForwardVariablesList] = useState([]);
  const dispatch = useDispatch();
  const [showVariablesModal, setShowVariablesModal] = useState(false);

  useEffect(() => {
    setForwardVariablesList(
      localLoadedActivityPropertyData?.m_objPMSubProcess?.fwdVarMapping
    );
  }, [localLoadedActivityPropertyData]);

  const handleMappingChange = (el, event) => {
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.taskOptions]: {
          isModified: true,
          hasError: false,
        },
      })
    );
    let temp = { ...localLoadedActivityPropertyData };
    temp?.m_objPMSubProcess?.fwdVarMapping.map((ep) => {
      if (ep.importedFieldName == el.importedFieldName) {
        ep.mappedFieldName = event.target.value;
      }
    });
    setlocalLoadedActivityPropertyData(temp);
  };

  const deleteVariablesFromList = (element) => {
    let tempVariablesList = forwardVariablesList;
    let tempVariablesList_Filtered = tempVariablesList?.filter((variable) => {
      return variable.importedFieldName == element.importedFieldName;
    });
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.fwdVarMappingProcessTask]: {
          isModified: true,
          hasError: false,
        },
      })
    );
    setForwardVariablesList(tempVariablesList_Filtered);
    // Deleting Document from getActivityAPI Call
    let tempLocalState = { ...localLoadedActivityPropertyData };
    let forwardIncomingDocsList =
      localLoadedActivityPropertyData.m_objPMSubProcess.fwdVarMapping;
    forwardIncomingDocsList &&
      forwardIncomingDocsList.map((document, index) => {
        if (document.importedFieldName == element.importedFieldName) {
          forwardIncomingDocsList.splice(index, 1);
        }
      });
    tempLocalState.m_objPMSubProcess.fwdVarMapping = [
      ...forwardIncomingDocsList,
    ];
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const oneLineForMap = () => {
    return forwardVariablesList?.map((el) => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.5rem 0.5vw 0",
            width: props.isDrawerExpanded ? "60%" : "100%",
          }}
        >
          <div
            style={{
              flex: "1",
              height: "36px",
              backgroundColor: "#F4F4F4",
              borderRadius: "1px",
              fontSize: "12px",
            }}
          >
            <span style={{ padding: "5px" }}>{el.importedFieldName}</span>
          </div>
          <p style={{ marginTop: "5px", flex: "0.2", textAlign: "center" }}>
            =
          </p>
          <div
            style={{
              flex: "1",
              overflow: "hidden",
            }}
          >
            <Select
              inputProps={{ "aria-label": "Without label" }}
              value={el.mappedFieldName}
              style={{
                width: "100%",
                height: "34px",
                border: "1px solid #CECECE",
                borderRadius: "1px",
                opacity: "1",
              }}
              onChange={(e) => handleMappingChange(el, e)}
              className="selectDateTime_options"
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
              {localLoadedProcessData?.Variable?.map((variable) => {
                return (
                  <MenuItem value={variable.VariableName}>
                    <em style={{ fontSize: "12px", fontStyle: "normal" }}>
                      {variable.VariableName}
                    </em>
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          <div style={{ marginTop: "5px", flex: "0.2", textAlign: "center" }}>
            <DeleteIcon
              style={{
                cursor: "pointer",
              }}
              onClick={() => deleteVariablesFromList(el)}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <div className="forwardMVarDiv">
      {props.isDrawerExpanded && (
        <div style={{ flex: "1" }}>
          <VariableList
            selectedVariableList={forwardVariablesList}
            setSelectedVariableList={setForwardVariablesList}
            setShowVariablesModal={setShowVariablesModal}
            isDrawerExpanded={props.isDrawerExpanded}
          />
        </div>
      )}
      <div
        style={{
          flex: "4",
          background: "white",
          margin: props.isDrawerExpanded ? "0.25rem 0" : "0",
        }}
      >
        <CommonTabHeader
          tabType="ForwardForVariables"
          setShowVariablesModal={setShowVariablesModal}
          isDrawerExpanded={props.isDrawerExpanded}
        />
        {oneLineForMap()}
      </div>
      {showVariablesModal && !props.isDrawerExpanded ? (
        <Modal
          show={showVariablesModal}
          backDropStyle={{ backgroundColor: "transparent" }}
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
            padding: 0,
          }}
          modalClosed={() => setShowVariablesModal(false)}
          children={
            <VariableList
              selectedVariableList={forwardVariablesList}
              setSelectedVariableList={setForwardVariablesList}
              setShowVariablesModal={setShowVariablesModal}
            />
          }
        ></Modal>
      ) : null}
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

export default connect(mapStateToProps, null)(ForwardForVariables);
