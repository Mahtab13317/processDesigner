// Changes made to solve Bug 116388 - Call Activity: Add document button is not working in Expanded mode
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import ReusableInputs from "./reusables/reusableInputs_Doc.js";
import "./commonCallActivity.css";
import Modal from "../../../../UI/Modal/Modal.js";
import DocList from "./reusables/docList.js";
import { store, useGlobalState } from "state-pool";
import TabsHeading from "../../../../UI/TabsHeading/index.js";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall.js";
import { propertiesLabel } from "../../../../Constants/appConstants.js";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import { CircularProgress } from "@material-ui/core";
import { ActivityPropertySaveCancelValue } from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";

/*code edited on 6 Sep 2022 for BugId 115378 */
function ForwardMDoc(props) {
  const dispatch = useDispatch();
  const loadedProcessData = store.getState("loadedProcessData");
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [docList, setDocList] = useState(null);
  const [spinner, setSpinner] = useState(true);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [showRedBorder, setShowRedBorder] = useState(false);
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut);

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      docList?.map((el) => {
        if (!el.mappedFieldName || el.mappedFieldName.trim() == "") {
          setShowRedBorder(true);
        }
      });
    }
  }, [saveCancelStatus.SaveClicked]);

  useEffect(() => {
    let tempIncomingDocsList = [];
    let forwardIncomingDocsList =
      localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
        ?.fwdDocMapping;
    forwardIncomingDocsList?.map((variable) => {
      tempIncomingDocsList.push({
        DocName: variable.importedFieldName,
        mappedFieldName: variable.mappedFieldName,
        isChecked: true,
      });
    });
    setDocList(tempIncomingDocsList);
    setSpinner(false);
    let isValid = validateFunction();
    if (!isValid) {
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.fwdDocMapping]: {
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
        ?.fwdDocMapping ||
      localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
        ?.fwdDocMapping?.length === 0
    ) {
      isValid = false;
    } else {
      localLoadedActivityPropertyData?.ActivityProperty?.SubProcess?.fwdDocMapping?.map(
        (el) => {
          if (!el.mappedFieldName || el.mappedFieldName?.trim() === "") {
            isValid = false;
          }
        }
      );
    }
    return isValid;
  };

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
      localLoadedActivityPropertyData.ActivityProperty.SubProcess.fwdDocMapping;
    forwardIncomingDocsList?.map((document, index) => {
      if (document.importedFieldName == variablesToDelete.DocName) {
        forwardIncomingDocsList.splice(index, 1);
      }
    });
    tempLocalState.ActivityProperty.SubProcess.fwdDocMapping = [
      ...forwardIncomingDocsList,
    ];
    setlocalLoadedActivityPropertyData(tempLocalState);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.fwdDocMapping]: { isModified: true, hasError: false },
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
                  ? setShowDocsModal(true)
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
             {props.isDrawerExpanded?null:'Add Document(s)'} 
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
              {localLoadedProcessData?.ProcessName}
            </p>
          </div>
        </div>
        {docList?.map((doc) => {
          return (
            <ReusableInputs
              document={doc}
              docList={docList}
              deleteVariablesFromList={deleteVariablesFromList}
              isReadOnly={isReadOnly}
              setDocList={setDocList}
              showRedBorder={showRedBorder}
            />
          );
        })}
        {showDocsModal && !props.isDrawerExpanded ? (
          <Modal
            show={showDocsModal}
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
            modalClosed={() => setShowDocsModal(false)}
            children={
              <DocList
                tabType="ForwardDocMapping"
                setShowDocsModal={setShowDocsModal}
                docList={docList}
                setDocList={setDocList}
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
            <DocList
              tabType="ForwardDocMapping"
              setShowDocsModal={setShowDocsModal}
              docList={docList}
              setDocList={setDocList}
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

export default connect(mapStateToProps, null)(ForwardMDoc);
