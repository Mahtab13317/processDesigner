import React, { useEffect, useState } from "react";
import { Select, MenuItem } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import "../../callActivity/commonCallActivity.css";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";

function ReusableInputs(props) {
  const [loadedVariables] = useGlobalState("variableDefinition");
  const [selectedMappingField, setSelectedMappingField] = useState(null);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);

  useEffect(() => {
    setSelectedMappingField(props.variable.mappedFieldName);
  }, [props.variable]);

  return (
    <div className="oneInputPairDiv_Common">
      <p
        style={{
          fontSize: "11px",
          position: "absolute",
          left: props.isDrawerExpanded ? "12px" : "42px",
        }}
      >
        {props.variable.VarName}
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
        onChange={(e) => {
          setSelectedMappingField(e.target.value);
          props.handleFieldMapping(props.variable, e.target.value);
        }}
        style={{
          position: "absolute",
          right: props.isDrawerExpanded ? "26px" : "25px",
          width: props.isDrawerExpanded ? "280px" : "135px",
          border: ( (!selectedMappingField || selectedMappingField.trim()=='') && props.showRedBorder )?'1px solid red': null
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
        {loadedVariables.map((loadedVar) => {
          return (
            <MenuItem
              className="InputPairDiv_CommonList"
              value={loadedVar.VariableName}
            >
              {loadedVar.VariableName}
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
        onClick={() => props.deleteVariablesFromList(props.variable)}
      />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, null)(ReusableInputs);
