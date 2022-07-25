import React, { useEffect, useState } from "react";
import { Select, MenuItem } from "@material-ui/core";

function ReusableOneMap(props) {
  const [selectedMappingField, setSelectedMappingField] = useState(null);

  const handleFieldMapping = (e) => {
    setSelectedMappingField(e.target.value);
    props.handleFieldMapping(e.target.value);
  };

  useEffect(() => {
    setSelectedMappingField(props.varField);
  }, [props.varField]);

  return (
    <div style={{ display: "flex", marginBottom: "8px" }}>
      <div
        style={{
          flex: "1",
          height: "30px",
          border: "1px solid #F3F3F3",
          borderRadius: "2px",
          opacity: "1",
          marginRight: "10px",
          fontSize: "12px",
          padding: "7px",
          textOverflow: "ellipsis",
          overflow: "hidden",
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
          flex: "1",
          height: "30px",
          border: "1px solid #F3F3F3",
          borderRadius: "2px",
          padding: "7px",
          fontSize: "12px",
          overflow: "hidden"
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
          PaperProps: {
            style: {
              maxHeight: "10rem",
            },
          },
        }}
      >
        {props.dropDownOptions.map((loadedVar) => {
          return (
            <MenuItem
              className="InputPairDiv_CommonList"
              value={loadedVar}
              style={{
                fontSize: "12px",
                padding: "4px",
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
