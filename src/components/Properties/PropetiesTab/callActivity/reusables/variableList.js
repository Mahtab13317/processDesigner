import { Checkbox } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import SearchComponent from "../../../../../UI/Search Component/index.js";
import "../../callActivity/commonCallActivity.css";
import Button from "@material-ui/core/Button";
import {
  VARDOC_LIST,
  SERVER_URL,
  propertiesLabel,
} from "../../../../../Constants/appConstants";
import axios from "axios";
import { connect, useDispatch } from "react-redux";
import { store, useGlobalState } from "state-pool";
import { getVariableType } from "../../../../../utility/ProcessSettings/Triggers/getVariableType.js";
import { setActivityPropertyChange } from "../../../../../redux-store/slices/ActivityPropertyChangeSlice.js";

/*code edited on 6 Sep 2022 for BugId 115378 */
function VariableList(props) {
  const { isReadOnly } = props;
  const dispatch = useDispatch();
  let [queueVariablesList, setQueueVariablesList] = useState([]);
  let [searchTerm, setSearchTerm] = useState("");
  let [externalVariablesList, setExternalVariablesList] = useState([]);
  const [varDefinition, setVarDefinition] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [selectedVariableType, setSelectedVariableType] = useState(0);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData] = useGlobalState(
    loadedActivityPropertyData
  );

  const handleCheckChange = (selectedVariable) => {
    let temp = [...varDefinition];
    temp?.map((v) => {
      if (v.VarName === selectedVariable.VarName) {
        v.isChecked = !v.isChecked;
      }
    });
    setVarDefinition(temp);

    if (selectedVariable.isChecked) {
      setSelectedVariables((prev) => {
        return [...prev, selectedVariable];
      });
    } else {
      setSelectedVariables((prev) => {
        let teList = [...prev];
        teList.map((el, idx) => {
          if (el.VarName === selectedVariable.VarName) {
            teList.splice(idx, 1);
          }
        });
        return teList;
      });
    }
  };

  const addVariablesToList = () => {
    props.selectedVariables(selectedVariables);
    let tempArr = [];
    selectedVariables.map((v) => {
      tempArr.push(v.VarName);
    });
    let newJson =
      selectedVariableType == 0
        ? queueVariablesList.filter((d) => !tempArr.includes(d.VarName))
        : externalVariablesList.filter((d) => !tempArr.includes(d.VarName));
    selectedVariableType == 0
      ? setQueueVariablesList(newJson)
      : setExternalVariablesList(newJson);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel[props.propLabel]]: {
          isModified: true,
          hasError: true,
        },
      })
    );
  };

  useEffect(() => {
    if (
      localLoadedActivityPropertyData?.ActivityProperty?.SubProcess?.importedProcessDefId?.trim() !==
      ""
    ) {
      let jsonBody = {
        processDefId:
          localLoadedActivityPropertyData?.ActivityProperty?.SubProcess
            ?.importedProcessDefId,
        extTableDataFlag: "Y",
        docReq: "Y",
        omniService: "Y",
      };
      axios.post(SERVER_URL + VARDOC_LIST, jsonBody).then((res) => {
        if (res.data.Status === 0) {
          let tempQueueVars = [];
          let tempExternalVars = [];
          res.data.VarDefinition.forEach((variable) => {
            if (+variable.ExtObjID === 0) {
              tempQueueVars.push(variable);
            } else if (+variable.ExtObjID === 1) {
              tempExternalVars.push(variable);
            }
          });
          filterData(tempQueueVars, tempExternalVars);
        }
      });
      setSelectedVariables(props.selectedVariableList);
    }
  }, [selectedVariableType, props.selectedVariableList]);

  const filterData = (queueList, extList) => {
    let newQueueList = [];
    let newExtList = [];
    queueList?.forEach((list) => {
      let tempVariable = false;
      props.selectedVariableList?.forEach((variable) => {
        if (variable.VarName === list.VarName) {
          tempVariable = true;
        }
      });
      if (!tempVariable) {
        newQueueList.push(list);
      }
    });
    setQueueVariablesList(newQueueList);

    extList?.forEach((list) => {
      let tempVariable = false;
      props.selectedVariableList?.forEach((variable) => {
        if (variable.VarName === list.VarName) {
          tempVariable = true;
        }
      });
      if (!tempVariable) {
        newExtList.push(list);
      }
    });
    setExternalVariablesList(newExtList);
  };

  useEffect(() => {
    setVarDefinition(
      selectedVariableType == 0
        ? queueVariablesList?.map((x) => {
            return { ...x, isChecked: false };
          })
        : externalVariablesList?.map((x) => {
            return { ...x, isChecked: false };
          })
    );
  }, [queueVariablesList, externalVariablesList, selectedVariableType]);

  let filteredRows = varDefinition.filter((row) => {
    if (searchTerm == "") {
      return row;
    } else if (row.VarName.toLowerCase().includes(searchTerm.toLowerCase())) {
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
          onClick={() => setSelectedVariableType(0)}
          style={{
            fontSize: "12px",
            paddingBottom: "5px",
            borderBottom:
              selectedVariableType == 0
                ? "3px solid var(--selected_tab_color)"
                : null,
          }}
        >
          Queue Variables
        </p>
        <p
          onClick={() => setSelectedVariableType(1)}
          style={{
            fontSize: "12px",
            marginLeft: "25px",
            paddingBottom: "5px",
            borderBottom:
              selectedVariableType == 1
                ? "3px solid var(--selected_tab_color)"
                : null,
          }}
        >
          External Variables
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
        {filteredRows.map((variable) => {
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
                  onChange={() => handleCheckChange(variable)}
                  checked={variable.isChecked}
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
                    marginLeft: "15px",
                  }}
                >
                  <p style={{ fontSize: "11px", color: "black" }}>
                    {variable.VarName}
                  </p>
                  <span style={{ fontSize: "10px", color: "#B2B1B9" }}>
                    {variable.SysName}
                  </span>
                </div>
              </div>
              <p
                style={{
                  fontSize: "10px",
                  color: "black",
                  textTransform: "uppercase",
                }}
              >
                {getVariableType(variable.VarType)}
              </p>
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
          onClick={() => props.setShowVariablesModal(false)}
          id="close_AddVariableModal_CallActivity"
          disabled={isReadOnly}
        >
          Cancel
        </Button>
        <Button
          id="add_AddVariableModal_CallActivity"
          onClick={() => addVariablesToList()}
          variant="contained"
          color="primary"
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

export default connect(mapStateToProps, null)(VariableList);
