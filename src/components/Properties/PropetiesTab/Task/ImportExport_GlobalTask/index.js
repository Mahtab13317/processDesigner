import React, { useEffect, useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Import from "./import.js";
import Export from "./export.js";
import "./index.css";

function ImportExport(props) {
  const [toDoType, setToDoType] = useState("I");
  const handleChange = (event) => {
    setToDoType(event.target.value);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <p style={{ fontSize: "14px", color: "#000000", fontWeight: "700" }}>
          Import/Export Global Task Template
        </p>
        <CloseIcon
          style={{ fontSize: "1.25rem" }}
          onClick={() => props.setShowModal(false)}
        />
      </div>
      <hr />
      <div style={{ padding: "10px" }}>
        <FormControl component="fieldset">
          <RadioGroup
            defaultValue="I"
            onChange={handleChange}
            row={true}
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              value="I"
              control={<Radio size="small" checked={toDoType == "I" ? true : false} />}
              label={<p style={{fontSize:'12px'}}>Import</p>}
            />
            <div>
              <FormControlLabel
                value="E"
                control={<Radio size="small" checked={toDoType == "E" ? true : false} />}
                label={<p style={{fontSize:'12px'}}>Export</p>}
              />
            </div>
          </RadioGroup>
        </FormControl>
      </div>
      {toDoType == "I" ? <Import /> : null}
      {toDoType == "E" ? <Export /> : null}
    </div>
  );
}

export default ImportExport;
