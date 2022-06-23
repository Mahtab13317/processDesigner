import {
  startVertex,
  endVertex,
  limitOutgoingEdges,
  limitIncomingEdges,
} from "../../Constants/bpmnView";

export const validateConnections = (source, target, displayMessage) => {
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
      console.log("errorMessage.noIncomingConnection");
      return false;
    }
    //to check if outgoing edges are allowed on source
    else if (endVertex.includes(source.style)) {
      console.log("errorMessage.noOutgoingConnection");
      return false;
    }
    //to check the limit on outgoing edges of source
    else if (
      limitOutgoingEdges.includes(source.style) &&
      outgoingEdges.length > 1
    ) {
      console.log("errorMessage.limitOutgoingConnection");
      return false;
    }
    //to check the limit on incoming edges of target
    else if (
      limitIncomingEdges.includes(target.style) &&
      incomingEdges.length > 1
    ) {
      console.log("errorMessage.limitIncomingConnection");
      return false;
    } else return true;
  }
};
