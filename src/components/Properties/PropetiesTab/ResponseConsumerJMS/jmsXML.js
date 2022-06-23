import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import './index.css';

function JmsXML(props) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <p style={{ color: "#000000", fontSize: "14px", fontWeight: "600" }}>
          Input XML
        </p>
        <CloseIcon style={{ height: "15px", width: "15px", cursor:'pointer' }} onClick={()=>props.setShowXMLModal(false)}/>
      </div>
      <hr style={{ height: "1px", backgroundColor: "#C4C4C4" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <p style={{ fontSize: "12px", color: "#606060" }}>
          Write or Paste your XML here.
        </p>
        <textarea
          style={{
            width: "416px",
            height: "140px",
            border: "1px solid #CECECE",
            borderRadius: "1px",
            opacity: "1",
          }}
        />
      </div>
      <div
        className="buttons_add xmlButtons"

      >
        <Button
          id="close_AddExpGroup_Modal"
          variant="outlined"
        //   onClick={() => props.handleClose()}
        >
          Cancel
        </Button>
        <Button
          id="addNclose_AddExpGroup_Modal"
          variant="contained"
        //   onClick={() =>
        //     props.addGroupToList(nameInput, "add", props.newGroupToMove)
        //   }
          color="primary"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
}

export default JmsXML;
