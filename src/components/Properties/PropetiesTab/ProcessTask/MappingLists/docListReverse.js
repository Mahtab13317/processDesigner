import { Checkbox } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import SearchComponent from "../../../../../UI/Search Component/index.js";
// import "../../callActivity/commonCallActivity.css";
import Button from "@material-ui/core/Button";
import {
  VARDOC_LIST,
  SERVER_URL,
  propertiesLabel,
} from "../../../../../Constants/appConstants";
import axios from "axios";
import { connect } from "react-redux";
import { store, useGlobalState } from "state-pool";
import { useDispatch, useSelector } from "react-redux";
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";

function VariableList(props) {
  let [processDocsList, setProcessDocsList] = useState([]);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const dispatch = useDispatch();
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [extListWithCheck, setExtListWithCheck] = useState([]);

  useEffect(() => {
    let tempExternalVars = [];
    localLoadedProcessData.DocumentTypeList.forEach((document) => {
      var isPresent = false;
      props.selectedVariableList.map((el) => {
        if (el.importedFieldName == document.DocName) {
          isPresent = true;
        }
      });
      if (!isPresent) {
        tempExternalVars.push({ ...document, isChecked: false });
      }
    });
    setProcessDocsList(tempExternalVars);
  }, [localLoadedProcessData, props.selectedVariableList]);

  useEffect(() => {
    setSelectedVariables(props.selectedVariableList);
  }, [props.selectedVariableList]);

  const handleCheckChange = (selectedVariable) => {
    console.log("chicken", selectedVariable, processDocsList);
    let temp = [...processDocsList];
    temp.map((el) => {
      if (el.DocName == selectedVariable.DocName) {
        el.isChecked = !el.isChecked;
      }
    });
    setProcessDocsList(temp);
  };

  const addVariablesToList = () => {
    console.log("OVER", processDocsList);
    let tempList = [...processDocsList];
    let varToBeAdded = tempList.filter((el) => el.isChecked);
    let varToBeAddedWithKeys = varToBeAdded.map((el) => {
      return {
        importedFieldName: el.DocName,
        m_arrCurrentDocList: null,
        m_bEnableFlag: false,
        m_bSelected: false,
        m_strAttr: "",
        m_strImporteddocId: el.DocTypeId,
        m_strMappedTransVar: "",
        mappedFieldName: el.DocName,
        transVarInfoList: [],
      };
    });
    props.setSelectedVariableList((prev) => {
      return [...prev, ...varToBeAddedWithKeys];
    });
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.fwdVarMappingProcessTask]: {
          isModified: true,
          hasError: false,
        },
      })
    );
    let temp = { ...localLoadedActivityPropertyData };
    varToBeAdded.map((el) => {
      temp.m_objPMSubProcess?.revDocMapping.push({
        importedFieldName: el.DocName,
        m_arrCurrentDocList: null,
        m_bEnableFlag: false,
        m_bSelected: false,
        m_strAttr: "",
        m_strImporteddocId: el.DocTypeId,
        m_strMappedTransVar: "",
        mappedFieldName: el.DocName,
        transVarInfoList: [],
      });
    });
    setlocalLoadedActivityPropertyData(temp);
    props.setShowVariablesModal(false);
  };

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
        style={{ width: "85%", maxWidth: "85%", margin: "0.75rem 1vw 0.25rem" }}
        // setSearchTerm={setSearchTerm}
      />
      {/* <div
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
            marginLeft: "25px",
            paddingBottom: "5px",
            // borderBottom: selectedVariableType == 1 ? "3px solid blue" : null,
          }}
        >
          External Variables
        </p>
      </div> */}
      {/* -------------------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #D6D6D6",
          padding: "10px",
        }}
      >
        {/* <Checkbox
          style={{
            borderRadius: "1px",
            height: "11px",
            width: "11px",
          }}
        /> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "var(--base_text_font_size)",
              color: "black",
              marginLeft: "15px",
            }}
          >
            Select All
          </p>
        </div>
      </div>
      <div
        style={{
          overflowY: "auto",
          height: props.isDrawerExpanded ? "46vh" : "61vh",
          padding: "0 0.5vw",
        }}
      >
        {processDocsList?.map((document) => {
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
                  onChange={() => handleCheckChange(document)}
                  // checked={variable[isChecked]}
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
                    marginLeft: "15px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "var(--base_text_font_size)",
                      color: "black",
                    }}
                  >
                    {document.DocName}
                  </p>
                  {/* <span style={{ fontSize: "10px", color: "#B2B1B9" }}>
                    {variable.SysName}
                  </span> */}
                </div>
              </div>
              <p
                style={{
                  fontSize: "var(--sub_text_font_size)",
                  color: "black",
                }}
              >
                STRING
              </p>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "right",
          padding: "0.5rem 0.75rem",
          gap: "0.5vw",
          justifyContent: "end",
          backgroundColor: "#F8F8F8",
        }}
      >
        <Button
          //variant="outlined"
          className="tertiary"
          onClick={() => props.setShowVariablesModal(false)}
          id="close_AddVariableModal_CallActivity"
        >
          Cancel
        </Button>
        <Button
          id="add_AddVariableModal_CallActivity"
          onClick={() => addVariablesToList()}
          className="primary"
          //variant="contained"
          //</div></div>color="primary"
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
    openProcessID: state.openProcessClick.selectedId,
  };
};

export default connect(mapStateToProps, null)(VariableList);
