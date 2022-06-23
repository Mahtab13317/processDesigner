import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import "./index.css";
import axios from "axios";
import {
  SERVER_URL,
  ENDPOINT_GET_GLOBALTASKTEMPLATES,
  ENDPOINT_GET_EXPORTTEMPLATES,
} from "../../../../../Constants/appConstants";

function Import(props) {
  const [selectedFile, setselectedFile] = useState();
  const [templateName, setTemplateName] = useState([]);
  const uploadFile = (e) => {
    console.log("UPLOAD", e);
    setselectedFile(e.target.files[0]);
  };

  const handleSubmit = async (
    event,
    isOverwrite,
    isNewVersion,
    openProcessFlag
  ) => {
    console.log("selectedFile", selectedFile);
    event.preventDefault();

    let payload = {
      importedName: selectedFile?.name?.split(".").slice(0, -1).join("."),
      overwrite: false,
    };

    console.log("PAYLOAD", payload);
    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append(
      "taskTemplateInfo",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      })
    );
    // try {
      const response = await axios({
        method: "POST",
        url: "/pmweb/importTaskTemplate",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response?.data?.Status) {
        console.log("RESPONSE", response);
      }
    // } 
  };

  useEffect(() => {
    axios.get(SERVER_URL + ENDPOINT_GET_GLOBALTASKTEMPLATES).then((res) => {
      res.data.GlobalTemplates.map((template) => {
        setTemplateName((prev) => {
          return [...prev, template];
        });
      });
    });
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0px 10px 0px 10px",
        }}
      >
        <p style={{ color: "#606060", fontSize: "12px" }}>File Name</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
              style={{
                width: '302px',
                height: '28px',
                border: '1px solid #CECECE',
                borderRadius: '1px',
                opacity: '1',
              }}
            >
              <p
                id="add_sectionName"
                //   onChange={(e) => setsectionName(e.target.value)}
                style={{
                  textAlign: "left",
                  opacity: "1",
                  fontSize: "12px",
                  fontWeight: "400",
                  marginLeft:'3px', 
                  marginTop: '2px'
                }}
              >
                {selectedFile !== undefined ? selectedFile.name : ""}
              </p>
            </div>
            
          <form>
            <label
              style={{
                fontSize: "0.8rem",
                border: "1px solid #0072C6",
                height: "1.5625rem",
                width: "5.2rem",
                whiteSpace: "nowrap",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                color: "#0072C6",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(e) => uploadFile(e)}
              />
              {"Choose File"}
            </label>
          </form>
        </div>
      </div>
      <div className="buttons_add buttonsAddToDo_Queue">
        <Button
          variant="outlined"
          // onClick={() => props.setShowQueueModal(false)}
          // id="close_AddTodoModal_Button"
        >
          Cancel
        </Button>
        <Button
          // id="addAnotherTodo_Button"
          variant="contained"
          color="primary"
          onClick={(e) => handleSubmit(e, false, false, false)}
        >
          {templateName.count > 0? 'Merge Data': 'Import'}
        </Button>
      </div>
    </div>
  );
}

export default Import;
