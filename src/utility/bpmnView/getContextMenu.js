import { gridSize, style } from "../../Constants/bpmnView";
import { hideIcons } from "./cellOnMouseClick";
import { removeToolDivCell } from "./getToolDivCell";
import { caseWorkdesk } from "./toolboxIcon";
import { ChangeActivityType } from "../../utility/CommonAPICall/ChangeActivityType";
import {
  MENUOPTION_CHECKIN_ACT,
  MENUOPTION_CHECKOUT_ACT,
  MENUOPTION_UNDO_CHECKOUT_ACT,
  PROCESSTYPE_DEPLOYED,
  PROCESSTYPE_LOCAL,
  PROCESSTYPE_REGISTERED,
} from "../../Constants/appConstants";

let contextMenu = document.createElement("div");
let section = [];
let visibility = false;
let dummy_graph;

const convertActivity = (cell, setProcessData) => {
  cell.style = caseWorkdesk.styleName;
  let processDefId, milestoneIndex, ActivityIndex;
  setProcessData((prev) => {
    let newObj = JSON.parse(JSON.stringify(prev));
    processDefId = newObj.ProcessDefId;
    newObj.MileStones.forEach((mile, index) => {
      mile.Activities.forEach((activity, subIndex) => {
        if (activity.ActivityId === cell.id) {
          milestoneIndex = index;
          ActivityIndex = subIndex;
        }
      });
    });
    return newObj;
  });
  ChangeActivityType(
    processDefId,
    cell.value,
    caseWorkdesk.activityTypeId,
    caseWorkdesk.activitySubTypeId,
    setProcessData,
    milestoneIndex,
    ActivityIndex,
    cell.id
  );
  removeContextMenu();
  removeToolDivCell();
  hideIcons();
};

const clearOldValues = () => {
  if (section != null) {
    for (var i of section) {
      var img = i;
      img.parentNode.removeChild(img);
    }
  }
  section = [];
};

const rename = (graph, cell) => {
  graph.startEditingAtCell(cell);
  removeContextMenu();
};

export const copy = (graph, cell) => {
  graph.copiedCell = cell ? cell : graph.getSelectionCell();
  removeContextMenu();
  hideIcons();
};

const propertiesActivity = (graph, showDrawer) => {
  removeContextMenu();
  removeToolDivCell();
  hideIcons();
  showDrawer(true);
};

const createElement = (name, elementContextMenu, elementSection, funcName) => {
  let element = document.createElement("p");
  element.innerHTML = name;
  element.setAttribute(
    "style",
    "font-size: 11px;color: #000000;padding:0.125rem 0.5vw;"
  );
  //add background color on hover
  element.addEventListener("mouseenter", () => {
    element.style.background = "#f5f5f5";
  });
  element.addEventListener("mouseleave", () => {
    element.style.background = "white";
  });
  if (funcName) {
    element.addEventListener("click", funcName);
  }
  elementContextMenu.appendChild(element);
  elementSection.push(element);
};

const createBreak = (breakContextMenu, breakSection) => {
  let br = document.createElement("HR");
  br.setAttribute("style", "margin: 0.125rem 0;");
  breakSection.push(br);
  breakContextMenu.appendChild(br);
};

const openProcess = (cell, setProcessData, setOpenDeployedProcess) => {
  let localActivity;

  setProcessData((prev) => {
    let newObj = JSON.parse(JSON.stringify(prev));
    newObj.MileStones.forEach((mile) => {
      mile.Activities.forEach((act) => {
        if (act.ActivityId === cell.id) {
          localActivity = act;
        }
      });
    });
    return newObj;
  });
  setOpenDeployedProcess(localActivity);
};

export function getContextMenu(
  graph,
  setProcessData,
  cell,
  t,
  showDrawer,
  caseEnabled,
  processType,
  setOpenDeployedProcess,
  setActionModal
) {
  clearOldValues();
  dummy_graph = graph;
  visibility = true;
  // code edited on 7 June 2022 for BugId 110045
  contextMenu.setAttribute(
    "style",
    "border: 1px solid #DADADA;box-shadow: 0px 3px 6px #DADADA; border-radius: 2px; background: white; position: absolute; flex-wrap: wrap; cursor: pointer; justify-content: center; z-index:100; padding:0.25rem 0"
  );
  contextMenu.style.left =
    cell.geometry.x +
    cell.parent.geometry.x -
    gridSize * 0.15 +
    "px";
  contextMenu.style.top =
    cell.geometry.y +
    cell.parent.geometry.y +
    cell.geometry.height * 0.5 +
    "px";
  if (
    (cell.style === style.workdesk && caseEnabled === true) ||
    cell.style === style.subProcess
  ) {
    contextMenu.style.width = 5.5 * gridSize + "px";
  } else {
    contextMenu.style.width = 3 * gridSize + "px";
  }

  let localActivity,
    isChecked,
    isProcessChecked = false,
    isParentLaneCheckedOut;
  setProcessData((prev) => {
    let newObj = JSON.parse(JSON.stringify(prev));
    isProcessChecked = newObj.CheckedOut === "Y";
    newObj.MileStones?.forEach((mile) => {
      mile.Activities.forEach((act) => {
        if (+act.ActivityId === +cell.id) {
          localActivity = act;
          isChecked = act.CheckedOut === "Y";
        }
      });
    });
    newObj.Lanes?.forEach((lane) => {
      if (+lane.LaneId === +cell.parent.id && lane.CheckedOut === "Y") {
        isParentLaneCheckedOut = true;
      }
    });
    return newObj;
  });

  if (
    processType === PROCESSTYPE_LOCAL ||
    ((processType === PROCESSTYPE_DEPLOYED ||
      processType === PROCESSTYPE_REGISTERED) &&
      isParentLaneCheckedOut &&
      !isProcessChecked)
  ) {
    createElement(t("Rename"), contextMenu, section, () =>
      rename(graph, cell, setProcessData, t)
    );
    if (cell.style === style.workdesk && caseEnabled === true) {
      createElement(t("ConvertToCaseWorkdesk"), contextMenu, section, () =>
        convertActivity(cell, setProcessData)
      );
    }
  }

  if (processType === PROCESSTYPE_LOCAL) {
    if (
      cell.style !== style.taskTemplate &&
      cell.style !== style.processTask &&
      cell.style !== style.newTask
    ) {
      createElement(t("Copy"), contextMenu, section, () =>
        copy(graph, cell)
      );
    }
    if (cell.style === style.subProcess) {
      createElement(t("publishAsGlobalProcess"), contextMenu, section, null);
      /*code commented on 7 June 2022 for BugId 110092*/
      // createElement(t("moveUpwards"), contextMenu, section, null);
      // createElement(t("moveDownwards"), contextMenu, section, null);
      // createBreak(contextMenu, section);
      // createElement(t("addWorkStepAbove"), contextMenu, section, null);
      // createElement(t("addWorkStepBelow"), contextMenu, section, null);
      createBreak(contextMenu, section);
    } else if (
      cell.style !== style.taskTemplate &&
      cell.style !== style.processTask &&
      cell.style !== style.newTask
    ) {
      createBreak(contextMenu, section);
    }
  }
  createElement(t("Properties"), contextMenu, section, () =>
    propertiesActivity(graph, showDrawer)
  );
  if (
    cell.style === style.callActivity &&
    processType === PROCESSTYPE_LOCAL
  ) {
    createElement(t("openProcess"), contextMenu, section, () =>
      openProcess(cell, setProcessData, setOpenDeployedProcess)
    );
  }
  if (
    (processType === PROCESSTYPE_DEPLOYED ||
      processType === PROCESSTYPE_REGISTERED) &&
    !isParentLaneCheckedOut &&
    !isProcessChecked
  ) {
    if (isChecked) {
      createElement(t("undoCheckout"), contextMenu, section, () => {
        setActionModal({
          type: MENUOPTION_UNDO_CHECKOUT_ACT,
          activity: localActivity,
        });
        removeContextMenu();
        hideIcons();
      });
      createElement(t("checkIn"), contextMenu, section, () => {
        setActionModal({
          type: MENUOPTION_CHECKIN_ACT,
          activity: localActivity,
        });
        removeContextMenu();
        hideIcons();
      });
    } else {
      createElement(t("Checkout"), contextMenu, section, () => {
        setActionModal({
          type: MENUOPTION_CHECKOUT_ACT,
          activity: localActivity,
        });
        removeContextMenu();
        hideIcons();
      });
    }
  }
  graph.view.graph.container.appendChild(contextMenu);
}

export function removeContextMenu() {
  if (
    visibility &&
    dummy_graph &&
    contextMenu.parentNode === dummy_graph.view.graph.container
  ) {
    dummy_graph.view.graph.container.removeChild(contextMenu);
    clearOldValues();
    visibility = false;
  }
}
