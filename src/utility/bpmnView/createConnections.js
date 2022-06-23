import axios from "axios";
import {
  ENDPOINT_ADD_CONNECTION,
  SERVER_URL,
} from "../../Constants/appConstants";
import { validateConnections } from "./validateConnections";

const mxgraphobj = require("mxgraph")({
  mxImageBasePath: "mxgraph/javascript/src/images",
  mxBasePath: "mxgraph/javascript/src",
});

const mxEventObject = mxgraphobj.mxEventObject;
const mxEvent = mxgraphobj.mxEvent;

export const createConnections = (
  graph,
  setProcessData,
  setNewId,
  displayMessage
) => {
  //overwrite the addEdge function in mxGraph
  //this function is called when a new edge is added to the graph
  graph.addEdge = function (edge, parent, source, target, index) {
    let edgeId = edge.getId();
    let edges;
    if (edgeId) {
      //assumed that every edge already present have an Id
      //this means it is an edge that is being added during rendering
      return graph.addCell(edge, parent, index, source, target);
    } else {
      //this means it is a new edge
      //validateConnections will validate the edge
      let valid = validateConnections(source, target, displayMessage);

      //setProcessData will update state, to show new edge is added
      if (valid) {
        let newEdgeId = 0;
        let processDefId, processMode;
        setNewId((oldIds) => {
          newEdgeId = oldIds.connectionId + 1;
          return { ...oldIds, connectionId: newEdgeId };
        });
        setProcessData((prevProcessData) => {
          processDefId = prevProcessData.ProcessDefId;
          processMode = prevProcessData.ProcessType;
          return prevProcessData;
        });
        let json = {
          processDefId: processDefId,
          processMode: processMode,
          connId: Number(newEdgeId),
          sourceId: source.getId(),
          targetId: target.getId(),
          connType: "D",
          sourcePosition: [],
          targetPosition: [],
        };
        axios
          .post(SERVER_URL + ENDPOINT_ADD_CONNECTION, json)
          .then((response) => {
            if (response.data.Status === 0) {
              edge.setId(Number(newEdgeId));
              edges = graph.addCell(edge, parent, index, source, target);
              setProcessData((prevProcessData) => {
                //do not do shallow copy process Data, else original state will get change
                let newProcessData = { ...prevProcessData };
                newProcessData.Connections = [...prevProcessData.Connections];
                newProcessData.Connections.push({
                  ConnectionId: Number(newEdgeId),
                  Type: "D",
                  SourceId: source.getId(),
                  TargetId: target.getId(),
                  xLeft: [],
                  yTop: [],
                });
                return newProcessData;
              });
              return edges;
            }
          });
      }
    }
  };

  //overwrite the connectCell function defined in mxGraph
  //this is called when either source or target of an edge is changed
  graph.connectCell = function (edge, terminal, source, constraint) {
    graph.model.beginUpdate();
    try {
      var previous = graph.model.getTerminal(edge, source);
      graph.cellConnected(edge, terminal, source, constraint);
      graph.fireEvent(
        new mxEventObject(
          mxEvent.CONNECT_CELL,
          "edge",
          edge,
          "terminal",
          terminal,
          "source",
          source,
          "previous",
          previous
        )
      );

      let edgeId = edge.getId();

      //setProcessData will update state, to show new edge terminal is changed
      setProcessData((prevProcessData) => {
        //do not do shallow copy process Data, else original state will get change
        let newProcessData = { ...prevProcessData };
        newProcessData.Connections = [...prevProcessData.Connections];

        newProcessData.Connections.forEach((connection) => {
          if (connection.ConnectionId === Number(edgeId)) {
            if (source === true) {
              //source is changed of edge
              connection.SourceId = Number(terminal.getId());
            } else {
              //target is changed for edge
              connection.TargetId = Number(terminal.getId());
            }
          }
        });

        return newProcessData;
      });
    } finally {
      graph.model.endUpdate();
    }

    return edge;
  };
};
