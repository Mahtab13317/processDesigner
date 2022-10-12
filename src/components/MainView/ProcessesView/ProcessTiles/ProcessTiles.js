import React, { useState, useEffect } from "react";
import "./ProcessesTiles.css";
import { useTranslation } from "react-i18next";
import { tileProcess } from "../../../../utility/HomeProcessView/tileProcess";
import { connect } from "react-redux";
import * as actionCreators from "../../../../redux-store/actions/processView/actions.js";

function ProcessTypes(props) {
  let { t } = useTranslation();
  let nonZeroProcessTile_Index = -1;
  props.processTypeList &&
    props.processTypeList.map((type, index) => {
      if (type.Count != 0 && nonZeroProcessTile_Index == -1)
        nonZeroProcessTile_Index = props.selectedTile
          ? props.clickedProcessTileAtHome.processTileIndex
          : index;
    });
  let [nonZeroProcessTileIndex, setnonZeroProcessTileIndex] = useState(
    nonZeroProcessTile_Index
  );

  useEffect(() => {
    props.defaultProcessTileIndex(nonZeroProcessTileIndex);
  }, []);

  // code added on 22 June 2022 for BugId 111210
  useEffect(() => {
    setnonZeroProcessTileIndex(props.selectedProcessTile);
  }, [props.selectedProcessTile]);

  let sendSelectedProcessTile = (
    selectedProcessTileCode,
    selectedProcessTileCount,
    selectedProcessTileIndex
  ) => {
    props.setSelectedProjectId(null);
    setnonZeroProcessTileIndex(selectedProcessTileIndex);
    return props.getSelectedProcessTile(
      selectedProcessTileCode,
      selectedProcessTileCount,
      selectedProcessTileIndex
    );
  };
  const direction = `${t("HTML_DIR")}`;
  return (
    <div className="processTypeTable" style={{ direction: `${t("HTML_DIR")}` }}>
      {props.processTypeList?.map((type, index) => {
        return (
          <div
            className={`oneRow ${
              nonZeroProcessTileIndex == index && !props.selectedProjectId
                ? "selectedRow"
                : ""
            }`}
            onClick={() =>
              sendSelectedProcessTile(type.ProcessType, type.Count, index)
            }
          >
            <p className="oneRowProcessType">
              <img
                className="processDotColor"
                src={tileProcess(type.ProcessType)[0]}
              />
              {t(tileProcess(type.ProcessType)[1])}
              {t(tileProcess(type.ProcessType)[5]) ? (
                <p style={{ display: "inline", marginLeft: "4px" }}>Waiting</p>
              ) : null}{" "}
            </p>
            {/* <div className="processTypeCount">
              <span>{type.Count}</span>
            </div> */}
          </div>
        );
      })}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    selectedTile: state.clickedProcessTileReducer.selectedProcessTile,
    clickedProcessTileAtHome:
      state.clickedProcessTileReducer.selectedProcessTile,
    selectedTabAtNavPanel: state.selectedTabAtNavReducer.selectedTab,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    defaultProcessTileIndex: (defaultProcessTileIndex) =>
      dispatch(actionCreators.defaultProcessTileIndex(defaultProcessTileIndex)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProcessTypes);
