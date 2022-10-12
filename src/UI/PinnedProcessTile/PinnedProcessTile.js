import React from "react";
import { Card, CardContent } from "@material-ui/core";
import "./PinnedProcessTile.css";
import { tileProcess } from "../../utility/HomeProcessView/tileProcess";
import processIcon from "../../assets/HomePage/HS_Process.svg";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import * as actionCreators from "../../redux-store/actions/processView/actions.js";
import { Draggable } from "react-beautiful-dnd";
import { PinnedProcessIcon } from "../../utility/AllImages/AllImages";

function PinnedProcessTile(props) {
  let { t } = useTranslation();
  const { index } = props;
  var processType = t(tileProcess(props.processType)[1]); //used for convertion of type
  var backgroundColor = tileProcess(props.processType)[4]; //used fpr the color of processType

  const history = useHistory();

  const clickCard = () => {
    props.openProcessClick(
      props.id,
      props.projectName,
      props.processType,
      props.versionNo,
      props.name
    );
    props.openTemplate(null, null, false);
    history.push("/process");
  };
  const direction = `${t("HTML_DIR")}`;

  return (
    <div>
      {/* Draggable makes the individual pinned tile draggable. */}
      <Draggable draggableId={props.name} key={props.name} index={index}>
        {(provided) => (
          <Card
            variant="outlined"
            className="cardPinned"
            onClick={clickCard}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <CardContent className="pinnedCardContent">
              <div className="row processNameDiv">
                <div className="logoDiv">
                  <img src={processIcon} className="fileLogo" />
                  <PinnedProcessIcon
                    className="fileLogo"
                    onClick={props.handleUnpin}
                    style={{
                      color: "#0f7ac9",
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                </div>

                <div className="titleDiv">
                  <p className="titlePinned">
                    <span className="titlePinnedName">{props.name}</span>
                    <span className="version">
                      {t("v")}
                      {props.versionNo}
                    </span>
                  </p>
                  <p className="processCat">{props.projectName}</p>
                </div>
              </div>
              <div className="pinnedProcessAlignment row">
                <img
                  style={{ height: "0.75rem", width: "0.75rem" }}
                  src={t(tileProcess(props.processType)[0])}
                />
                <p className="processStatus">{processType}</p>
              </div>
              <div
                className="pinnedProcessAlignment row"
                style={{ margin: "0 0 0.5rem 2.25vw" }}
              >
                <p className="processModification">
                  {t("lastModification")} {props.modifiedDate},
                  {props.modifiedTime}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </Draggable>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    openProcessClick: (id, name, type, version, processName) =>
      dispatch(
        actionCreators.openProcessClick(id, name, type, version, processName)
      ),
    openTemplate: (id, name, flag) =>
      dispatch(actionCreators.openTemplate(id, name, flag)),
  };
};

export default connect(null, mapDispatchToProps)(PinnedProcessTile);
