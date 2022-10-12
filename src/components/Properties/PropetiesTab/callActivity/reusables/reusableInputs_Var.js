import React, { useEffect, useState } from "react";
import { Select, MenuItem } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import "../../callActivity/commonCallActivity.css";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";

/*code edited on 6 Sep 2022 for BugId 115378 */
function ReusableInputs(props) {
  const { isReadOnly } = props;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [selectedMappingField, setSelectedMappingField] = useState(null);

  useEffect(() => {
    setSelectedMappingField(props.variable.mappedFieldName);
  }, [props.variable]);

  return (
    <div className="oneInputPairDiv_Common">
      <p
        style={{
          fontSize: "11px",
          width: props.isDrawerExpanded ? "281px" : "136px",
          padding: "0 8px",
        }}
      >
        {props.variable.VarName}
      </p>
      <span
        style={{
          width: props.isDrawerExpanded ? "61px" : "25px",
          textAlign: "center",
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
          width: props.isDrawerExpanded ? "280px" : "135px",
          border:
            (!selectedMappingField || selectedMappingField.trim() == "") &&
            props.showRedBorder
              ? "1px solid red"
              : null,
        }}
        value={selectedMappingField}
        disabled={isReadOnly}
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
        {localLoadedProcessData?.Variable?.filter((el) => {
          if (+el.VariableType === +props.variable.VarType) {
            return el;
          }
        })?.map((loadedVar) => {
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
      {!isReadOnly && (
        <DeleteIcon
          style={{
            cursor: "pointer",
            width: props.isDrawerExpanded ? "3rem" : "2rem",
            height: "1.5rem",
          }}
          onClick={() => props.deleteVariablesFromList(props.variable)}
        />
      )}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, null)(ReusableInputs);
