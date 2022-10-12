import { numberedLabel } from "./numberedLabel";
import {
  gridSize,
  swimlaneName as swimlaneNameConst,
} from "../../Constants/bpmnView";
import { addMilestone } from "../CommonAPICall/AddMilestone";
import { addSwimLane } from "../CommonAPICall/AddSwimlane";
import { PROCESSTYPE_LOCAL } from "../../Constants/appConstants";

var addButton = (graph, horizontal, x, y, t, processType) => {
  let button = document.createElement("div");
  if (horizontal) {
    button.title = t("addMilestone");
    button.id = "addMilestone";
  } else {
    button.title = t("addSwimlane");
    button.id = "addSwimlane";
  }
  button.className = "swimlaneMilestoneAddBtn";
  let span = document.createElement("span");
  span.innerHTML = "+";
  button.appendChild(span);

  //style button
  button.style.zIndex = 1;
  button.style.position = "absolute";
  button.style.top = y + "px";
  button.style.left = x + "px";
  button.style.height = gridSize + "px";
  button.style.width = gridSize + "px";
  button.style.display = "flex";
  button.style.justifyContent = "center";
  button.style.alignItems = "center";
  button.style.background = "#FFFFFF33 0% 0% no-repeat padding-box";
  button.style.border = "2px dashed #C4C4C4";
  button.style.borderRadius = "1px";
  button.style.cursor = "pointer";
  span.style.fontSize = "1.5rem";
  span.style.color = "#767676";

  if (processType !== PROCESSTYPE_LOCAL) {
  } else {
    graph.container.appendChild(button);
  }

  return button;
};

var onButtonClick = (setNewId, horizontal, translation, setProcessData) => {
  add(horizontal, setNewId, translation, setProcessData);
};

var add = (horizontal, setNewId, translation, setProcessData) => {
  let prefix = translation(swimlaneNameConst);
  let swimlaneName, swimlaneId, lanes, lastLane, processName, processDefId;

  setProcessData((prevProcessData) => {
    lanes = prevProcessData.Lanes;
    lastLane =
      prevProcessData.Lanes &&
      prevProcessData.Lanes[prevProcessData.Lanes.length - 1];
    swimlaneId = lastLane.LaneId;
    swimlaneName = numberedLabel(null, prefix, swimlaneId + 1);
    processDefId = prevProcessData.ProcessDefId;
    processName = prevProcessData.ProcessName;
    return prevProcessData;
  });

  if (horizontal === true) {
    //milestone is being added
    addMilestone(translation, setNewId, processDefId, setProcessData);
  } else if (horizontal === false) {
    //swimlane is being added
    addSwimLane(
      translation,
      swimlaneId,
      swimlaneName,
      lanes,
      lastLane,
      processDefId,
      processName,
      setProcessData,
      setNewId
    );
  }
};

export function toAddSwimlaneMilestone(
  graph,
  setNewId,
  translation,
  setProcessData,
  processType
) {
  var swimlaneButton = addButton(graph, false, 0, 0, translation, processType);
  var milestoneButton = addButton(graph, true, 0, 0, translation, processType);

  let buttons = {
    addSwimlane: swimlaneButton,
    addMilestone: milestoneButton,
  };

  swimlaneButton.addEventListener("click", () =>
    onButtonClick(setNewId, false, translation, setProcessData)
  );
  milestoneButton.addEventListener("click", () =>
    onButtonClick(setNewId, true, translation, setProcessData)
  );

  return buttons;
}
