import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReusableInputs from "./reusables/reusableInputs_Doc.js";
import "./commonCallActivity.css";
import Modal from "../../../../UI/Modal/Modal.js";
import DocList from "./reusables/docList.js";
import { store, useGlobalState } from "state-pool";

function ForwardMDoc(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [docList, setDocList] = useState(null);

  useEffect(() => {
    let tempIncomingDocsList = [];
    let forwardIncomingDocsList =
      localLoadedActivityPropertyData.m_objPMSubProcess.fwdDocMapping;
    forwardIncomingDocsList &&
      forwardIncomingDocsList.map((variable) => {
        tempIncomingDocsList.push({
          importedFieldName: variable.importedFieldName,
          mappedFieldName: variable.mappedFieldName,
        });
      });
    setDocList(tempIncomingDocsList);
    console.log('HAPPY', localLoadedActivityPropertyData);
  }, []);

  const deleteVariablesFromList = (variablesToDelete) => {
    //Deleting documents from the right Panel
    let tempDocsList = [...docList];
    let tempDocsList_Filtered = tempDocsList.filter((variable) => {
      return variablesToDelete !== variable;
    });
    setDocList(tempDocsList_Filtered);

    //Deleting Document from getActivityAPI Call
    let tempLocalState = { ...localLoadedActivityPropertyData };
    let forwardIncomingDocsList =
      localLoadedActivityPropertyData.m_objPMSubProcess.fwdDocMapping;
    forwardIncomingDocsList &&
      forwardIncomingDocsList.map((document, index) => {
        if (document.importedFieldName == variablesToDelete.importedFieldName) {
          forwardIncomingDocsList.splice(index, 1);
        }
      });
    tempLocalState.m_objPMSubProcess.fwdDocMapping = [
      ...forwardIncomingDocsList,
    ];
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

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
            onClick={() => setShowDocsModal(true)}
          >
            Add Document(s)
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
                localLoadedActivityPropertyData.m_objPMSubProcess
                  .importedProcessName
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
        {showDocsModal && !props.isDrawerExpanded ? (
          <Modal
            show={showDocsModal}
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
            }}
            modalClosed={() => setShowDocsModal(false)}
            children={
              <DocList
                // selectedVariables={MapSelectedVariables}
                // setShowVariablesModal={setShowVariablesModal}
                // selectedVariableList={selectedVariableList}
                tabType="ForwardDocMapping"
                setShowDocsModal={setShowDocsModal}
                docList={docList}
                setDocList={setDocList}
              />
            }
          ></Modal>
        ) : null}

        {docList &&
          docList.map((doc) => {
            return (
              <ReusableInputs
                document={doc}
                docList={docList}
                deleteVariablesFromList={deleteVariablesFromList}
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
                <DocList
                  // selectedVariables={MapSelectedVariables}
                  // setShowVariablesModal={setShowVariablesModal}
                  // selectedVariableList={selectedVariableList}
                  tabType="ForwardDocMapping"
                  setShowDocsModal={setShowDocsModal}
                  docList={docList}
                  setDocList={setDocList}
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

export default connect(mapStateToProps, null)(ForwardMDoc);
