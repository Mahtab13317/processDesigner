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
                </div>
                <div className="titleDiv">
                  <p className="titlePinned">
                    {props.name}
                    <span className="version">
                      {t("v")} {props.versionNo}
                    </span>
                  </p>
                  <p className="processCat">{props.projectName}</p>
                </div>
              </div>
              <div className="pinnedProcessAlignment row">
                <img
                  style={{ height: "10px", width: "10px", marginTop: "3px" }}
                  src={t(tileProcess(props.processType)[0])}
                />
                <p className="processStatus">{processType}</p>
              </div>
              <div className="pinnedProcessAlignment row">
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
