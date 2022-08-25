import { Checkbox } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import SearchComponent from "../../../../../UI/Search Component/index.js";
import "../../callActivity/commonCallActivity.css";
import Button from "@material-ui/core/Button";
import { VARDOC_LIST, SERVER_URL } from "../../../../../Constants/appConstants";
import axios from "axios";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";

function VariableList(props) {
  let [documentsList, setDocumentsList] = useState([]);
  let [searchTerm, setSearchTerm] = useState("");
  const [varDefinition, setVarDefinition] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [registeredProcessID, setRegisteredProcessID] = useState("2148");
  const [completeDocList, setCompleteDocList] = useState([]);
  useEffect(() => {
    let jsonBody = {
      processDefId: registeredProcessID,
      extTableDataFlag: "Y",
      docReq: "Y",
      omniService: "Y",
    };
    axios.post(SERVER_URL + VARDOC_LIST, jsonBody).then((res) => {
      if (res.data.Status === 0) {
        setCompleteDocList([...res.data.DocDefinition]);
        let tempDocList = [];
        res.data.DocDefinition.forEach((variable) => {
          tempDocList.push(variable);
        });
        filterData(tempDocList);
      }
    });
  }, []);

  const filterData = (docList) => {
    let tempDocList = [];
    docList.forEach((list) => {
      let tempVariable = false;
      props.docList &&
        props.docList.forEach((variable) => {
          if (variable.importedFieldName == list.DocName) {
            tempVariable = true;
          }
        });
      if (!tempVariable) {
        tempDocList.push(list);
      }
    });
    setDocumentsList(tempDocList);
  };

  useEffect(() => {
    filterData(completeDocList);
  }, [props.docList]);

  useEffect(() => {
    setVarDefinition(
      documentsList &&
        documentsList.map((x) => {
          return { ...x, isChecked: false };
        })
    );
  }, [documentsList]);

  const handleCheckChange = (selectedVariable) => {
    let temp = [...varDefinition];
    temp &&
      temp.map((v) => {
        if (v.DocName === selectedVariable.DocName) {
          v.isChecked = !v.isChecked;
        }
      });
    setVarDefinition(temp);
    if (selectedVariable.isChecked) {
      setSelectedDocuments((prev) => {
        return [...prev, selectedVariable];
      });
    }
  };

  const addDocsToList = () => {
    //Adding document to right panel
    selectedDocuments &&
      selectedDocuments.map((document) => {
        props.setDocList((prev) => {
          return [
            ...prev,
            {
              importedFieldName: document.DocName,
              mappedFieldName: null,
            },
          ];
        });
      });
    //Removing document from left Modal panel
    let tempArr = [];
    selectedDocuments.map((v) => {
      tempArr.push(v.DocName);
    });
    let newJson = documentsList.filter((d) => !tempArr.includes(d.DocName));
    setDocumentsList(newJson);

    //Adding document to getActivityPropertyCall
    let tempToBeAddedDocsList = [];
    let tempLocalState = { ...localLoadedActivityPropertyData };
    let forwardIncomingDocsList =
      props.tabType == "ForwardDocMapping"
        ? localLoadedActivityPropertyData.ActivityProperty.SubProcess
            .fwdDocMapping
        : localLoadedActivityPropertyData.ActivityProperty.SubProcess
            .revDocMapping;
    forwardIncomingDocsList &&
      forwardIncomingDocsList.map((document) => {
        tempToBeAddedDocsList.push({
          importedFieldName: document.importedFieldName,
          mappedFieldName: document.mappedFieldName,
        });
      });
    selectedDocuments.map((document) => {
      tempToBeAddedDocsList.push({
        importedFieldName: document.DocName,
        mappedFieldName: null,
      });
    });

    if (props.tabType == "ForwardDocMapping") {
      tempLocalState.ActivityProperty.SubProcess.fwdDocMapping = [
        ...tempToBeAddedDocsList,
      ];
    } else if (props.tabType == "ReverseDocMapping") {
      tempLocalState.ActivityProperty.SubProcess.revDocMapping = [
        ...tempToBeAddedDocsList,
      ];
    }
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

  let filteredRows = varDefinition.filter((row) => {
    if (searchTerm == "") {
      return row;
    } else if (
      row.DocName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) {
      return row;
    }
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: props.isDrawerExpanded ? "100%" : "auto",
        backgroundColor: props.isDrawerExpanded ? "white" : "",
      }}
    >
      <SearchComponent
        style={{ width: "237px", height: "20px", margin: "10px 10px 5px 10px" }}
        setSearchTerm={setSearchTerm}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #D6D6D6",
          padding: "10px 10px 0px 10px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            paddingBottom: "5px",
            borderBottom: "3px solid var(--selected_tab_color)"

          }}
        >
          Documents
        </p>
      </div>
      {/* -------------------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #D6D6D6",
          padding: "10px",
        }}
      >
        <Checkbox
          style={{
            borderRadius: "1px",
            height: "11px",
            width: "11px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "11px", color: "black", marginLeft: "15px" }}>
            Select All
          </p>
        </div>
      </div>
      {/* ------------------------- */}
      <div
        style={{
          overflowY: "scroll",
          height: "57.5vh",
        }}
      >
        {varDefinition && searchTerm==''?
          varDefinition.map((document) => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #D6D6D6",
                  padding: "5px 10px 5px 10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    style={{
                      borderRadius: "1px",
                      height: "11px",
                      width: "11px",
                    }}
                    onChange={() => handleCheckChange(document)}
                    checked={document.isChecked}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "15px",
                    }}
                  >
                    <p style={{ fontSize: "11px", color: "black" }}>
                      {document.DocName}
                    </p>
                  </div>
                </div>
              </div>
            );
          })  
        :filteredRows.map((document) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #D6D6D6",
                padding: "5px 10px 5px 10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  style={{
                    borderRadius: "1px",
                    height: "11px",
                    width: "11px",
                  }}
                  onChange={() => handleCheckChange(document)}
                  checked={document.isChecked}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "15px",
                  }}
                >
                  <p style={{ fontSize: "11px", color: "black" }}>
                    {document.DocName}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "right",
          padding: "5px 10px 5px 10px",
          justifyContent: "end",
          backgroundColor: "#F8F8F8",
        }}
      >
        <Button variant="outlined" id="close_AddVariableModal_CallActivity">
          Cancel
        </Button>
        <Button
          id="add_AddVariableModal_CallActivity"
          variant="contained"
          color="primary"
          onClick={() => addDocsToList()}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, null)(VariableList);
