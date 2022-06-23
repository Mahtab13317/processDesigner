import React, { useRef, useEffect, useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import { addVertexFromToolbox } from "../../../../utility/bpmnView/addVertexFromToolbox";
import { useTranslation } from "react-i18next";
import "./Tool.css";
import { view } from "../../../../Constants/appConstants";

function Tool(props) {
  let { t } = useTranslation();
  var toolRef = useRef(null);
  const ToolDescription = withStyles((theme) => ({
    tooltip: {
      fontSize: "12px",
      letterSpacing: "0px",
      lineHeight: "1rem",
      color: "#FFFFFF",
      backgroundColor: "#414141",
      boxShadow: "0px 3px 6px #00000029",
      border: "none !important",
      padding: "0.5vw 1vw",
    },
    arrow: {
      "&:before": {
        backgroundColor: "#414141",
        border: "none !important",
        zIndex: "100",
      },
    },
  }))(Tooltip);
  const [screenView, setScreenView] = useState(null);
  const [searchedVal, setSearchedVal] = useState("");

  let onDragStart = (e, actType, actSubType, boolean) => {
    e.dataTransfer.setData("iActivityID", actType);
    e.dataTransfer.setData("iSubActivityID", actSubType);
    e.dataTransfer.setData("bFromToolbox", boolean);
  };

  useEffect(() => {
    if (props.expandedView) {
      if (
        props.graph !== null &&
        (props.view !== screenView || props.searchedVal !== searchedVal)
      ) {
        toolRef.current.innerHTML = "";
        setScreenView(props.view);
        setSearchedVal(props.searchedVal);
        addVertexFromToolbox(props, toolRef.current, t);
      } else if (props.view === view.abstract.langKey) {
        toolRef.current.innerHTML = `<img src=${props.icon} alt="" className="w100" />`;
      }
    } else {
      if (
        props.graph !== null &&
        (props.view !== screenView || props.searchedVal !== searchedVal)
      ) {
        toolRef.current.innerHTML = "";
        addVertexFromToolbox(props, toolRef.current, t);
      } else if (props.view === view.abstract.langKey || !props.view) {
        toolRef.current.innerHTML = `<img src=${props.icon} alt="" className="w100" />`;
      }
    }
  }, [props.expandedView, props.searchedVal]);

  if (!props.expandedView) {
    return props.showToolTip ? (
      <ToolDescription arrow title={props.desc} placement="right">
        <div
          className="oneToolBox"
          draggable
          onDragStart={(e) =>
            onDragStart(e, props.activityType, props.activitySubType, true)
          }
        >
          <div className="toolIcon" ref={toolRef}></div>
          <p style={{ fontSize: "12px" }}>{props.title}</p>
        </div>
      </ToolDescription>
    ) : (
      <div
        className="oneToolBox"
        draggable
        onDragStart={(e) =>
          onDragStart(e, props.activityType, props.activitySubType, true)
        }
      >
        <div className="toolIcon" ref={toolRef}></div>
        <p style={{ fontSize: "12px" }}>{props.title}</p>
      </div>
    );
  } else
    return (
      <div
        className="oneToolBox"
        draggable
        onDragStart={(e) =>
          onDragStart(e, props.activityType, props.activitySubType, true)
        }
      >
        <div className="toolIcon" ref={toolRef}></div>
        <p style={{ fontSize: "12px" }}>{props.title}</p>
      </div>
    );
}

export default Tool;
