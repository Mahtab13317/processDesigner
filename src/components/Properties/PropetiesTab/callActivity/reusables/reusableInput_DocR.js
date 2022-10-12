import React, { useEffect, useState } from "react";
import { Select, MenuItem } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import "../../callActivity/commonCallActivity.css";
import { store, useGlobalState } from "state-pool";
import { connect, useDispatch } from "react-redux";
import { propertiesLabel } from "../../../../../Constants/appConstants";
import { setActivityPropertyChange } from "../../../../../redux-store/slices/ActivityPropertyChangeSlice";

/*code edited on 6 Sep 2022 for BugId 115378 */
function ReusableInputs_Reverse(props) {
  const { isReadOnly } = props;
  const dispatch = useDispatch();
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
        ...doc,
        mappedFieldName:
          doc.DocName === document.DocName
            ? event.target.value
            : doc.mappedFieldName,
      });
    });
    tempLocalState?.ActivityProperty?.SubProcess?.revDocMapping?.map(
      (el, idx) => {
        if (el.importedFieldName === document.DocName) {
          tempLocalState.ActivityProperty.SubProcess.revDocMapping[idx] = {
            ...el,
            mappedFieldName: event.target.value,
            m_bSelected: true,
          };
        }
      }
    );
    props.setDocList(forwardMapArr);
    setlocalLoadedActivityPropertyData(tempLocalState);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.revDocMapping]: { isModified: true, hasError: false },
      })
    );
  };

  useEffect(() => {
    setSelectedMappingField(props.document.mappedFieldName);
  }, [props.document]);

  useEffect(() => {
    setLoadedVariables(props.targetDocList);
  }, [props.targetDocList]);

  return (
    <div className="oneInputPairDiv_Common">
      <p
        style={{
          fontSize: "11px",
          width: props.isDrawerExpanded ? "281px" : "136px",
          padding: "0 8px",
        }}
      >
        {props.document.DocName}
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
        onChange={(e) => handleFieldMapping(props.document, e)}
        style={{
          width: props.isDrawerExpanded ? "280px" : "135px",
          border:
            (!selectedMappingField || selectedMappingField.trim() == "") &&
            props.showRedBorder
              ? "1px solid red"
              : null,
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
        disabled={isReadOnly}
      >
        {loadedVariables?.map((loadedVar) => {
          return (
            <MenuItem
              className="InputPairDiv_CommonList"
              value={loadedVar.DocName}
            >
              {loadedVar.DocName}
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
          onClick={() => props.deleteVariablesFromList(props.document)}
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

export default connect(mapStateToProps, null)(ReusableInputs_Reverse);
