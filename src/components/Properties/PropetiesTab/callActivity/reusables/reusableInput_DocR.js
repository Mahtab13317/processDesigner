import React, { useEffect, useState } from "react";
import { Select, MenuItem } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import "../../callActivity/commonCallActivity.css";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";

function ReusableInputs_Reverse(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [loadedVariables, setLoadedVariables] = useState(null);
  const [selectedMappingField, setSelectedMappingField] = useState(null);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const handleFieldMapping = (document, event) => {
    setSelectedMappingField(event.target.value);
    let forwardMapArr = [];
    let tempLocalState = { ...localLoadedActivityPropertyData };
    props.docList.forEach((doc) => {
      forwardMapArr.push({
        importedFieldName: doc.importedFieldName,
        mappedFieldName:
          doc.importedFieldName == document.importedFieldName
            ? event.target.value
            : doc.mappedFieldName,
      });
    });
    tempLocalState.ActivityProperty.SubProcess.revDocMapping = [
      ...forwardMapArr,
    ];
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

  useEffect(() => {
    setSelectedMappingField(props.document.mappedFieldName);
  }, [props.document]);

  useEffect(() => {
    setLoadedVariables(
      localLoadedActivityPropertyData.ActivityProperty.SubProcess.revDocMapping
    );
  }, []);

  return (
    <div className="oneInputPairDiv_Common">
      <p
        style={{
          fontSize: "11px",
          position: "absolute",
          left: props.isDrawerExpanded ? "12px" : "42px",
        }}
      >
        {props.document.importedFieldName}
      </p>
      <span
        style={{
          position: "absolute",
          left: props.isDrawerExpanded ? "314px" : "188px",
        }}
      >
        =
      </span>
      <Select
        className="selectTwo_callActivity"
        onChange={(e) => handleFieldMapping(props.document, e)}
        style={{
          position: "absolute",
          right: props.isDrawerExpanded ? "26px" : "25px",
          width: props.isDrawerExpanded ? "280px" : "135px",
        }}
        value={selectedMappingField}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          getContentAnchorEl: null,
        }}
      >
        {loadedVariables &&
          loadedVariables.map((loadedVar) => {
            return (
              <MenuItem
                className="InputPairDiv_CommonList"
                value={loadedVar.mappedFieldName}
              >
                {loadedVar.mappedFieldName}
              </MenuItem>
            );
          })}
      </Select>
      <DeleteIcon
        style={{
          cursor: "pointer",
          position: "absolute",
          right: props.isDrawerExpanded ? "-5px" : "1px",
        }}
        onClick={() => props.deleteVariablesFromList(props.document)}
      />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, null)(ReusableInputs_Reverse);
