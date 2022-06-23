import { Checkbox } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import "./index.css";
import axios from "axios";
import {
  SERVER_URL,
  ENDPOINT_GET_GLOBALTASKTEMPLATES,
  ENDPOINT_GET_EXPORTTEMPLATES,
} from "../../../../../Constants/appConstants";

function Export(props) {
  const [templateName, setTemplateName] = useState([]);
  const [selectedGlobalTemplate, setSelectedGlobalTemplate] = useState("");
  useEffect(() => {
    axios.get(SERVER_URL + ENDPOINT_GET_GLOBALTASKTEMPLATES).then((res) => {
      res.data.GlobalTemplates.map((template) => {
        setTemplateName((prev) => {
          return [...prev, template];
        });
      });
    });
  }, []);

  const selectTemplateHandler = (templateID, checkValue) => {
    console.log("checkValue", checkValue);
    if (checkValue) {
      setSelectedGlobalTemplate((prev) => {
        let temp = prev;
        temp = temp + templateID + ",";
        return temp;
      });
    }
  };

  const exportTemplateHandler = () => {
    axios({
      url: `/pmweb${ENDPOINT_GET_EXPORTTEMPLATES}/${selectedGlobalTemplate.slice(
        0,
        -1
      )}`, //your url
      method: "GET",
      responseType: "blob", // important
    }).then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: res.headers["content-type"],
        })
      );
      var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      var matches = filenameRegex.exec(res.headers["content-disposition"]);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", matches[1].replace(/['"]/g, "")); //or any other extension
      document.body.appendChild(link);
      link.click();
    });

    // axios
    //   .get(
    //     SERVER_URL +
    //       `${ENDPOINT_GET_EXPORTTEMPLATES}/${selectedGlobalTemplate.slice(
    //         0,
    //         -1
    //       )}`
    //   )
    //   .then((res) => {
    //     console.log("RRRESPONSE", res);
    //   });
  };

  return (
    <div>
      <p style={{ fontSize: "12px", color: "#606060", paddingLeft: "10px" }}>
        Select the templates you want to Export.
      </p>
      <div>
        <p>
          <Checkbox></Checkbox>
          <span
            style={{ fontSize: "12px", color: "#111111", fontWeight: "600" }}
          >
            Template Name
          </span>
        </p>
        {templateName?.map((temp) => {
          return (
            <p>
              <Checkbox
                onChange={(e) =>
                  selectTemplateHandler(temp.m_iTemplateId, e.target.checked)
                }
              ></Checkbox>
              <span
                style={{
                  fontSize: "12px",
                  color: "#111111",
                  fontWeight: "400",
                }}
              >
                {temp.m_strTemplateName}
              </span>
            </p>
          );
        })}
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
          onClick={exportTemplateHandler}
        >
          Export
        </Button>
      </div>
    </div>
  );
}

export default Export;
