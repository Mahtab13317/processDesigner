import { Checkbox } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import SearchComponent from "../../../../../UI/Search Component/index.js";
import "../../callActivity/commonCallActivity.css";
import Button from "@material-ui/core/Button";
import { store, useGlobalState } from "state-pool";
import { connect, useDispatch } from "react-redux";
import { setActivityPropertyChange } from "../../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import { propertiesLabel } from "../../../../../Constants/appConstants.js";

/*code edited on 6 Sep 2022 for BugId 115378 */
function DocReverseList(props) {
  const { isReadOnly } = props;
  const dispatch = useDispatch();
  let [documentsList, setDocumentsList] = useState([]);
  let [searchTerm, setSearchTerm] = useState("");
  const [varDefinition, setVarDefinition] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [completeDocList, setCompleteDocList] = useState([]);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);

  useEffect(() => {
    setSelectedDocuments(props.docList);
    setCompleteDocList(localLoadedProcessData?.DocumentTypeList);
    filterData(localLoadedProcessData?.DocumentTypeList);
  }, [props.docList]);

  const filterData = (docList) => {
    let tempDocList = [];
    docList.forEach((list) => {
      let tempVariable = false;
      props.docList?.forEach((variable) => {
        if (variable.DocName == list.DocName) {
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
    } else {
      setSelectedDocuments((prev) => {
        let teList = [...prev];
        teList.map((el, idx) => {
          if (el.DocName === selectedVariable.DocName) {
            teList.splice(idx, 1);
          }
        });
        return teList;
      });
    }
  };

  const addDocsToList = () => {
    //Adding document to right panel
    props.setDocList(selectedDocuments);

    //Removing document from left Modal panel
    let tempArr = [];
    selectedDocuments.map((v) => {
      tempArr.push(v.DocName);
    });
    let newJson = documentsList.filter((d) => !tempArr.includes(d.DocName));
    setDocumentsList(newJson);

    //Adding document to getActivityPropertyCall
    let tempToBeAddedDocsList = [];
    let tempLocalState = JSON.parse(
      JSON.stringify(localLoadedActivityPropertyData)
    );

    selectedDocuments?.map((document) => {
      tempToBeAddedDocsList.push({
        importedFieldName: document.DocName,
        mappedFieldName: document.mappedFieldName
          ? document.mappedFieldName
          : null,
        m_bSelected: true,
      });
    });
    if (tempLocalState?.ActivityProperty?.SubProcess?.revDocMapping) {
      tempLocalState.ActivityProperty.SubProcess.revDocMapping = [
        ...tempToBeAddedDocsList,
      ];
    } else {
      tempLocalState.ActivityProperty.SubProcess = {
        ...tempLocalState.ActivityProperty.SubProcess,
        revDocMapping: [...tempToBeAddedDocsList],
      };
    }
    setlocalLoadedActivityPropertyData(tempLocalState);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.revDocMapping]: {
          isModified: true,
          hasError: true,
        },
      })
    );
  };

  let filteredRows = varDefinition.filter((row) => {
    if (searchTerm == "") {
      return row;
    } else if (row.DocName.toLowerCase().includes(searchTerm.toLowerCase())) {
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
        style={{ width: "237px", margin: "5px 10px 0" }}
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
            borderBottom: "3px solid var(--selected_tab_color)",
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
            padding: "0",
          }}
          disabled={isReadOnly}
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
          height: "31rem",
        }}
      >
        {varDefinition && searchTerm == ""
          ? varDefinition.map((document) => {
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
                        padding: "0",
                      }}
                      onChange={() => handleCheckChange(document)}
                      checked={document.isChecked}
                      disabled={isReadOnly}
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
          : filteredRows.map((document) => {
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
                        padding: "0",
                      }}
                      onChange={() => handleCheckChange(document)}
                      checked={document.isChecked}
                      disabled={isReadOnly}
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
        <Button
          variant="outlined"
          id="close_AddVariableModal_CallActivity"
          disabled={isReadOnly}
          onClick={() => props.setShowDocsModal(false)}
        >
          Cancel
        </Button>
        <Button
          id="add_AddVariableModal_CallActivity"
          variant="contained"
          color="primary"
          onClick={() => addDocsToList()}
          disabled={isReadOnly}
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

export default connect(mapStateToProps, null)(DocReverseList);
