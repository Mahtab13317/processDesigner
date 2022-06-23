import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";
import * as actionCreators from "../../../../redux-store/actions/selectedCellActions";
import { connect } from "react-redux";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import styles from "./index.module.css";
import { Select, MenuItem } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  setSave,
  ActivityPropertySaveCancelValue,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants.js";
import arabicStyles from "./ArabicStyles.module.css";

function Table(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [tableList, setTableList] = useState([]);
  
  const [selectedVal, setSelectedVal] = useState([]);
  const [mappedData, setMappedData] = useState(
    localLoadedActivityPropertyData?.ActivityProperty?.m_objPMSAPAdapterInfo
      ?.mapSAPtableParamMapInfoComplex
  );
  const [checkInput, setCheckInput] = useState(null);
  const [checkOutput, setCheckOutput] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let temp = [];
    let selVar = [];
    let input = [];
    let output = [];
    props?.sapOutput[0]?.ParameterDetails.map((val) => {
      if (val.ParameterType === "T") {
        temp.push(val);
        selVar.push({ name: "0", paramName: "0" });
        input.push(false);
        output.push(false);
      }
    });
    setTableList(temp);

    if (props?.sapOutput[0]?.FunctionID == props?.changeFunction) {
      temp.forEach((data, i) => {
        for (var obj in mappedData) {
          
          if (mappedData[obj].paramName == data.Name) {
            selVar[i].name = mappedData[obj].selectedVar;
            selVar[i].paramName = mappedData[obj].paramName;
            input[i] = mappedData[obj].enableinput;
            output[i] = mappedData[obj].enableoutput;
          }
        }
      });
    }

    setSelectedVal(selVar);
    setCheckInput(input);
    setCheckOutput(output);
  }, [props.sapOutput]);

  const getFilterList = (index, val) => {
    let filterProcess = "";
    
    filterProcess = props.processVarDropdown
      .filter((d) => d.VariableType == val.Type)
      .map((data, i) => ({
        VarFieldId: data.VarFieldId,
        VariableId: data.VariableId,
        VariableLength: data.VariableLength,
        VariableName: data.VariableName,
        VariableType: data.VariableType,
      }));

    return filterProcess;
  };

  const changeVariable = (e, index, param) => {
    let data = [...selectedVal];
    // data[index] = e.target.value;
    data[index].name = e.target.value;
    data[index].paramName = param;
    setSelectedVal(data);

    const tempLocalState = { ...localLoadedActivityPropertyData };
    tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo.mapSAPtableParamMapInfoComplex =
      [];

    let changedVar = selectedVal?.filter((d) => d.name != "0");
   
    if (changedVar?.length > 0) {
      changedVar?.map((data, i) => {
        tableList?.map((item, j) => {
          if (item.Name == data.paramName) {
           

            const tempVar = {
              bConstantVal: false,
              chkInputSelected: checkInput[j],
              chkOutputSelected: checkOutput[j],
              dataStructureId: "0",
              disableMapped: true,
              displayName: "",
              enableinput: checkInput[j],
              enableoutput: checkOutput[j],
              m_arrMapVariables: [],
              m_objPMSAPStructureInfo: {
                structureName: item.Name,
                structureId: 0,
              },
              optional: null,
              paramIndex: item.Index,
              paramName: item.Name,
              paramParentName: "",
              paramSelected: true,
              paramType: null,
              paramTypeName: null,
              parameterType: null,
              selectedVar: data.name,
              strSelectedConstName: "",
              unbounded: null,
            };

            tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo.mapSAPInputParamMapInfo.push(
              tempVar
            );
          }
        });
      });
    }

    setlocalLoadedActivityPropertyData(tempLocalState);

    dispatch(
      setActivityPropertyChange({
        SAPAdapter: { isModified: true, hasError: false },
      })
    );
  };

  const inputCheck = (e, index, paramIndex) => {
    let data = [...checkInput];
    let output = [...checkOutput];
    data[index] = e.target.checked;
    output[index] = false;
    setCheckInput(data);
    setCheckOutput(output);

    const tempLocalState = { ...localLoadedActivityPropertyData };

    for (var obj in tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo
      .mapSAPtableParamMapInfoComplex) {
      if (
        tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo
          .mapSAPtableParamMapInfoComplex[obj].paramIndex == paramIndex
      ) {
        // temp=mappedData[obj].selectedVar;
        //selVar[i]=mappedData[obj].selectedVar;

        mappedData[obj].enableinput = e.target.checked;
        mappedData[obj].enableoutput = false;
        mappedData[obj].chkInputSelected = e.target.checked;
        mappedData[obj].chkOutputSelected = false;
      }
    }
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

  const outputCheck = (e, index, paramIndex) => {
    let data = [...checkOutput];
    let input = [...checkInput];
    data[index] = e.target.checked;
    input[index] = false;
    setCheckOutput(data);
    setCheckInput(input);

    const tempLocalState = { ...localLoadedActivityPropertyData };

    for (var obj in tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo
      .mapSAPtableParamMapInfoComplex) {
      if (
        tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo
          .mapSAPtableParamMapInfoComplex[obj].paramIndex == paramIndex
      ) {
        // temp=mappedData[obj].selectedVar;
        //selVar[i]=mappedData[obj].selectedVar;

        mappedData[obj].enableinput = false;
        mappedData[obj].enableoutput = e.target.checked;
        mappedData[obj].chkInputSelected = false;
        mappedData[obj].chkOutputSelected = e.target.checked;
      }
    }
    setlocalLoadedActivityPropertyData(tempLocalState);
  };

  return (
    <React.Fragment>
      <div className="row" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <p className={styles.headerLabel1}>{t("tableParameter")}</p>
        <p className={styles.headerLabel}>{t("Input")}</p>
        <p className={styles.headerLabel}>{t("output")}</p>
        <p className={styles.headerLabel}>{t("processvariable(s)")}</p>
      </div>
      {tableList?.map((data, i) => {
        return (
          <div className="row">
            <p className={styles.tableLabel1}>{data.Name}</p>
            <div className={styles.tableLabel}>
              <Checkbox
                checked={checkInput[i]}
                onChange={(e) => {
                  inputCheck(e, i, data.Index);
                }}
                style={{
                  height: "14px",
                  width: "14px",
                }}
              />
            </div>
            <div className={styles.tableLabel}>
              <Checkbox
                checked={checkOutput[i]}
                onChange={(e) => outputCheck(e, i, data.Index)}
                style={{
                  height: "14px",
                  width: "14px",
                }}
              />
            </div>
            <div className={styles.tableLabel}>
              <Select
                className={styles.dataDropdown}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  style: {
                    maxHeight: 400,
                  },
                  getContentAnchorEl: null,
                }}
                style={{ width: "8rem", border: ".5px solid #c4c4c4" }}
                value={selectedVal[i].name}
                onChange={(e) => {
                  changeVariable(e, i, data.Name);
                }}
                id="ruleParam1Dropdown"
              >
                {getFilterList(i, data)?.map((option) => {
                  return (
                    <MenuItem
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.webSDropdownData
                          : styles.webSDropdownData
                      }
                      value={option.VariableName}
                    >
                      {option.VariableName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
}

export default Table;
