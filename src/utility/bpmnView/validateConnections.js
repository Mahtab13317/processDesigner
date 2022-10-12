import { activityType_label } from "../../Constants/appConstants";
import {
  startVertex,
  endVertex,
  limitOutgoingEdges,
  limitIncomingEdges,
} from "../../Constants/bpmnView";

export const validateConnections = (source, target, t) => {
  if (!target || !source) {
    return false;
  } else {
    let outgoingEdges = source.edges
      ? source.edges.filter((item) => item.source.id === source.id)
      : [];
    let incomingEdges = target.edges
      ? target.edges.filter((item) => item.target.id === target.id)
      : [];

    //to check if incoming edges are allowed on target
    if (startVertex.includes(target.style)) {
      return {
        isValid: false,
        msg: `${
          t(activityType_label[target.style]) +
          " " +
          t("errorMessage.noIncomingConnection")
        }`,
      };
    }
    //to check if outgoing edges are allowed on source
    else if (endVertex.includes(source.style)) {
      return {
        isValid: false,
        msg: `${
          t(activityType_label[source.style]) +
          " " +
          t("errorMessage.noOutgoingConnection")
        }`,
      };
    }
    //to check the limit on outgoing edges of source
    else if (
      limitOutgoingEdges.includes(source.style) &&
      outgoingEdges.length === 1
    ) {
      return {
        isValid: false,
        msg: `${
          t("errorMessage.limitOutgoingConnection") +
          " " +
          t(activityType_label[source.style])
        }`,
      };
    }
    //to check the limit on incoming edges of target
    else if (
      limitIncomingEdges.includes(target.style) &&
      incomingEdges.length === 1
    ) {
      return {
        isValid: false,
        msg: `${
          t("errorMessage.limitIncomingConnection") +
          " " +
          t(activityType_label[target.style])
        }`,
      };
    } else
      return {
        isValid: true,
        msg: ``,
      };
  }
};
