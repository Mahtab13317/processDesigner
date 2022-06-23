import React, { useEffect, useState } from "react";
import { Select, MenuItem } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";

function ReusableOneMap(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [selectedMappingField, setSelectedMappingField] = useState(null);

  console.log('invocationType', props.invocationType);
const handleFieldMapping=(e)=>{
  setSelectedMappingField(e.target.value);
  props.handleFieldMapping(e.target.value);
}

useEffect(() => {
  setSelectedMappingField(props.varField)
}, [props.varField])

  return (
    <div style={{ display: "flex", marginBottom:'8px'}}>
      <div
        style={{
          width: "220px",
          height: "30px",
          border: "1px solid #F3F3F3",
          borderRadius: "2px",
          opacity: "1",
          marginRight: "10px",
          fontSize:'12px', 
          padding:'7px'
        }}
      >
        {props.mapField}
      </div>
      <span
        style={{
          marginRight: "10px",
        }}
      >
        =
      </span>
      <Select
        onChange={(e) => handleFieldMapping(e)}
        style={{
          width: "220px",
          height: "30px",
          border: "1px solid #F3F3F3",
          borderRadius: "2px",
          opacity: "1",
          padding:'7px',
          fontSize:'12px'
        }}
        disabled={props.invocationType == 'F'? true:false}
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
        {props.dropDownOptions.map((loadedVar) => {
          return (
            <MenuItem
              className="InputPairDiv_CommonList"
              value={loadedVar}
              style={{
                fontSize: "12px",
                padding: "4px"
              }}
            >
              {loadedVar[props.dropDownKey]}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
}

export default ReusableOneMap;
