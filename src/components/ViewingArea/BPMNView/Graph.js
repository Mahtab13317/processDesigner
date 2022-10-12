import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteCell } from "../../../utility/bpmnView/deleteCell";
import { addMxGraph } from "../../../utility/bpmnView/addMxGraph";
import { drawOnGraph } from "../../../utility/bpmnView/drawOnGraph";
import { getSelectedCell } from "../../../utility/bpmnView/getSelectedCell";
import { connect, useDispatch } from "react-redux";
import * as actionCreators from "../../../redux-store/actions/selectedCellActions";
import { removeToolDivCell } from "../../../utility/bpmnView/getToolDivCell";
import { hideIcons } from "../../../utility/bpmnView/cellOnMouseClick";
import * as actionCreators_drawer from "../../../redux-store/actions/Properties/showDrawerAction";
import {
  copy,
  removeContextMenu,
} from "../../../utility/bpmnView/getContextMenu";
import "./Graph.css";
import { collapseExpandedProcess } from "../../../utility/bpmnView/cellOnMouseHover";
import { graphMinDimension, gridSize } from "../../../Constants/bpmnView";
import { useHistory } from "react-router-dom";
import * as openActionCreators from "../../../redux-store/actions/processView/actions.js";
import { store, useGlobalState } from "state-pool";
import { getSelectedCellType } from "../../../utility/abstarctView/getSelectedCellType";
import { pasteFunction } from "../../../utility/bpmnView/createPopupMenu";
import ObjectDependencies from "../../../UI/ObjectDependencyModal";
import Modal from "../../../UI/Modal/Modal";
import {
  MENUOPTION_CHECKIN_ACT,
  MENUOPTION_CHECKOUT_ACT,
  MENUOPTION_UNDO_CHECKOUT_ACT,
  PROCESSTYPE_DEPLOYED,
  PROCESSTYPE_LOCAL,
  PROCESSTYPE_REGISTERED,
} from "../../../Constants/appConstants";
import CheckOutActModal from "../AbstractView/Milestones/Milestone/ActivityView/Activity/CheckoutActivity";
import UndoCheckoutActivity from "../AbstractView/Milestones/Milestone/ActivityView/Activity/UndoCheckoutActivity";
import QueueAssociation from "../../Properties/PropetiesTab/QueueAssociation";
import CheckInActivity from "../AbstractView/Milestones/Milestone/ActivityView/Activity/CheckInActivity";

let swimlaneLayer, milestoneLayer, rootLayer;
let buttons = {};

function Graph(props) {
  const containerRef = useRef(null);
  const { caseEnabled } = props;

  //t is our translation function
  let { t } = useTranslation();

  let [graph, setGraphObj] = useState(null);
  let [openDeployedProcess, setOpenDeployedProcess] = useState(null);
  const [showDependencyModal, setShowDependencyModal] = useState(false);
  const [showQueueModal, setShowQueueModal] = useState({
    show: false,
    queueId: null,
  });
  const [taskAssociation, setTaskAssociation] = useState([]);
  const [actionModal, setActionModal] = useState({ type: null, activity: {} });
  const history = useHistory();
  const dispatch = useDispatch();

  const loadedProcessData = store.getState("loadedProcessData");
  const [setlocalLoadedProcessData] = useGlobalState(loadedProcessData);

  const deleting = (deleteGraph) => {
    deleteCell(
      deleteGraph,
      props.setProcessData,
      setTaskAssociation,
      setShowDependencyModal,
      dispatch,
      t
    );
    //remove other related attributes when particular entity is deleted
    removeToolDivCell();
    removeContextMenu();
    hideIcons();
  };

  const onClick = async () => {
    if (graph) {
      //code to select particular entity on bpmn graph
      let obj = await getSelectedCell(graph, props.processData);

      if (obj) {
        if (obj.type === getSelectedCellType("TASK")) {
          props.selectedTask(obj.id, obj.name, obj.taskType, obj.type);
        } else {
          props.selectedCell(
            obj.id,
            obj.name,
            obj.activityType,
            obj.activitySubType,
            obj.seqId,
            obj.queueId,
            obj.type,
            obj.checkedOut
          );
        }
      } else {
        //if properties drawer is closed and screen is clicked then deselect any selected entity
        if (!props.showDrawer) {
          props.selectedCell(null, null, null, null, null, null, null, null);
          props.selectedTask(null, null, null, null);
        }
      }
    }
  };

  const onKeyUp = (event) => {
    let key = event.key;
    let keyCode = event.which || event.keyCode; // Detecting keyCode
    // Detecting Ctrl
    let ctrl = event.ctrlKey ? event.ctrlKey : keyCode === 17 ? true : false;

    if (
      props.processType === PROCESSTYPE_LOCAL ||
      ((props.processType === PROCESSTYPE_REGISTERED ||
        props.processType === PROCESSTYPE_DEPLOYED) &&
        props.processData.CheckedOut === "Y")
    ) {
      // If keyCode pressed is V and if ctrl is true.
      if (keyCode == 86 && ctrl) {
        // Ctrl+V is pressed
        pasteFunction(
          graph,
          null,
          props.setProcessData,
          props.setNewId,
          t,
          caseEnabled
        );
      } else if (keyCode == 67 && ctrl) {
        // Ctrl+C is pressed
        copy(graph, null);
        removeToolDivCell();
        removeContextMenu();
        hideIcons();
      }
    }

    // code added on 7 Sep 2022 for BugId 115477
    if (props.processType === PROCESSTYPE_LOCAL) {
      if (key === "Delete") {
        deleting(graph);
      }
    }
  };

  useEffect(() => {
    let tempGraph;
    [tempGraph, rootLayer, swimlaneLayer, milestoneLayer, buttons] = [
      ...addMxGraph(
        containerRef,
        props.setNewId,
        props.displayMessage,
        props.showDrawer,
        t,
        props.setProcessData,
        props.processType,
        caseEnabled,
        setOpenDeployedProcess,
        setTaskAssociation,
        setShowDependencyModal,
        setShowQueueModal,
        setActionModal,
        dispatch
      ),
    ];
    setGraphObj(tempGraph);
    props.setGraphToolbox(tempGraph);
    collapseExpandedProcess(props.setProcessData);
  }, []);

  useEffect(() => {
    if (openDeployedProcess && openDeployedProcess != null) {
      props.openProcessClick(
        openDeployedProcess.AssociatedProcess.Associated_ProcessDefId,
        openDeployedProcess.AssociatedProcess.Associated_ProjectName,
        "R",
        openDeployedProcess.AssociatedProcess.Associated_VersionNo,
        openDeployedProcess.AssociatedProcess.Associated_ProcessName
      );
      props.openTemplate(null, null, false);
      setlocalLoadedProcessData(null);
      setOpenDeployedProcess(null);
      history.push("/process");
    }
  }, [openDeployedProcess]);

  //call on render to paint processData on graph
  useEffect(() => {
    if (graph && props.processData) {
      drawOnGraph(
        graph,
        [swimlaneLayer, milestoneLayer, rootLayer],
        buttons,
        props.processData,
        caseEnabled,
        t
      );
    }
  });

  useEffect(() => {
    document.addEventListener("click", onClick);
    document.addEventListener("keyup", onKeyUp);
    //document.addEventListener("dblclick", ondblclick)
    return function cleanup() {
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("click", onClick);
      //document.removeEventListener("dblclick", ondblclick)
    };
  });

  return (
    /*height and width are set according to canvas width of graph in bpmn*/
    /*code edited on 7 Oct 2022 for BugId 115317 */
    <div
      className="Graph"
      style={{
        width:
          containerRef.current === null
            ? graphMinDimension.w
            : containerRef.current?.firstChild?.width?.baseVal?.value,
        height:
          containerRef.current === null
            ? graphMinDimension.h
            : containerRef.current?.firstChild?.height?.baseVal?.value,
      }}
    >
      <div className="Grid" ref={containerRef}></div>
      {showDependencyModal ? (
        <Modal
          show={showDependencyModal}
          style={{
            width: "45vw",
            left: "28%",
            top: "21.5%",
            padding: "0",
          }}
          modalClosed={() => setShowDependencyModal(false)}
          children={
            <ObjectDependencies
              {...props}
              processAssociation={taskAssociation}
              cancelFunc={() => setShowDependencyModal(false)}
            />
          }
        />
      ) : null}

      {actionModal.type === MENUOPTION_CHECKOUT_ACT ? (
        <Modal
          show={actionModal.type === MENUOPTION_CHECKOUT_ACT}
          style={{
            padding: "0",
            width: "33vw",
            left: "33%",
            top: "30%",
          }}
          modalClosed={() => setActionModal({ type: null, activity: {} })}
          children={
            <CheckOutActModal
              setModalClosed={() =>
                setActionModal({ type: null, activity: {} })
              }
              modalType={MENUOPTION_CHECKOUT_ACT}
              actName={actionModal.activity.ActivityName}
              actId={actionModal.activity.ActivityId}
              laneId={actionModal.activity.LaneId}
              setprocessData={props.setProcessData}
            />
          }
        />
      ) : null}
      {actionModal.type === MENUOPTION_UNDO_CHECKOUT_ACT ? (
        <Modal
          show={actionModal.type === MENUOPTION_UNDO_CHECKOUT_ACT}
          style={{
            padding: "0",
            width: "33vw",
            left: "33%",
            top: "30%",
          }}
          modalClosed={() => setActionModal({ type: null, activity: {} })}
          children={
            <UndoCheckoutActivity
              setModalClosed={() =>
                setActionModal({ type: null, activity: {} })
              }
              modalType={MENUOPTION_UNDO_CHECKOUT_ACT}
              actName={actionModal.activity.ActivityName}
              actId={actionModal.activity.ActivityId}
              laneId={actionModal.activity.LaneId}
              setprocessData={props.setProcessData}
            />
          }
        />
      ) : null}
      {actionModal.type === MENUOPTION_CHECKIN_ACT ? (
        <Modal
          show={actionModal.type === MENUOPTION_CHECKIN_ACT}
          style={{
            padding: "0",
            width: "33vw",
            left: "33%",
            top: "30%",
          }}
          modalClosed={() => setActionModal({ type: null, activity: {} })}
          children={
            <CheckInActivity
              setModalClosed={() =>
                setActionModal({ type: null, activity: {} })
              }
              modalType={MENUOPTION_CHECKIN_ACT}
              actName={actionModal.activity.ActivityName}
              actId={actionModal.activity.ActivityId}
              activity={actionModal.activity}
              setprocessData={props.setProcessData}
            />
          }
        />
      ) : null}

      {showQueueModal.show ? (
        <Modal
          show={showQueueModal.show}
          style={{
            width: "45vw",
            left: "28%",
            top: "21.5%",
            padding: "0",
            height: "475px",
          }}
          modalClosed={() => setShowQueueModal(false)}
          children={
            <QueueAssociation
              queueType="0"
              queueFrom="graph"
              showQueueModal={showQueueModal}
              setShowQueueModal={setShowQueueModal}
            />
          }
        />
      ) : null}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    showDrawer: (flag) => dispatch(actionCreators_drawer.showDrawer(flag)),
    selectedCell: (
      id,
      name,
      activityType,
      activitySubType,
      seqId,
      queueId,
      type,
      checkedOut
    ) =>
      dispatch(
        actionCreators.selectedCell(
          id,
          name,
          activityType,
          activitySubType,
          seqId,
          queueId,
          type,
          checkedOut
        )
      ),
    openProcessClick: (id, name, type, version, processName) =>
      dispatch(
        openActionCreators.openProcessClick(
          id,
          name,
          type,
          version,
          processName
        )
      ),
    openTemplate: (id, name, flag) =>
      dispatch(openActionCreators.openTemplate(id, name, flag)),
    selectedTask: (id, name, taskType, type) =>
      dispatch(actionCreators.selectedTask(id, name, taskType, type)),
  };
};

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
