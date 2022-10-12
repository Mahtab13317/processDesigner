import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";
import styles from "./index.module.css";
import { Select, MenuItem } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants.js";
import arabicStyles from "./ArabicStyles.module.css";

function Input(props) {
  let { t } = useTranslation();
  const { isReadOnly } = props;
  const direction = `${t("HTML_DIR")}`;
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [inputList, setinputList] = useState([]);
  const [selectedVariable, setselectedVariable] = useState([]);
  const [mappedData, setMappedData] = useState(
    localLoadedActivityPropertyData?.ActivityProperty?.m_objPMSAPAdapterInfo
      ?.mapSAPInputParamMapInfo
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let temp = [];
    let selVar = [];
    props?.sapOutput[0]?.ParameterDetails.map((val) => {
      if (val.ParameterType === "I") {
        temp.push(val);
        selVar.push({ name: "0", paramName: "0" });
      }
    });
    setinputList(temp);

    if (props?.sapOutput[0]?.FunctionID == props?.changeFunction) {
      temp.forEach((data, i) => {
        for (var obj in mappedData) {
          if (mappedData[obj].paramName == data.Name) {
            selVar[i].name = mappedData[obj].selectedVar;
            selVar[i].paramName = mappedData[obj].paramName;
          }
        }
      });
    }
    setselectedVariable(selVar);

    /* mahtab code starts from here */

    //getting subprocess from process variable

    // setProcessVar(Subprocess)
  }, [props.sapOutput]);

  const getFilterList = (index, val) => {
    let filterProcess = "";

    filterProcess = props.processVarDropdown
      .filter(
        (d) =>
          d.VariableType == val.Type &&
          (d.VariableScope == "S" || d.VariableScope == "U")
      )
      .map((data, i) => ({
        VarFieldId: data.VarFieldId,
        VariableId: data.VariableId,
        VariableLength: data.VariableLength,
        VariableName: data.VariableName,
        VariableType: data.VariableType,
      }));

    let tempProcess = props.processVarDropdown.filter(
      (d) => d.VariableType == "11"
    );
    let Subprocess =
      tempProcess[0]?.RelationAndMapping?.Mappings?.Mapping?.filter(
        (d) => d.VariableType == "10"
      ).map((data, i) => ({
        VarFieldId: data.VarFieldId,
        VariableId: data.VariableId,
        VariableLength: data.VariableLength,
        VariableName: tempProcess[0].VariableName + "." + data.VariableName,
        VariableType: data.VariableType,
      }));

    let tempProcessList = [...Subprocess, ...filterProcess];

    return tempProcessList;
  };

  const changeVariable = (e, index, param) => {
    let data = [...selectedVariable];
    data[index].name = e.target.value;
    data[index].paramName = param;
    setselectedVariable(data);

    const tempLocalState = { ...localLoadedActivityPropertyData };
    tempLocalState.ActivityProperty.m_objPMSAPAdapterInfo.mapSAPInputParamMapInfo =
      [];

    let changedVar = selectedVariable?.filter((d) => d.name != "0");

    if (changedVar?.length > 0) {
      changedVar?.map((data, i) => {
        inputList?.map((item, j) => {
          if (item.Name == data.paramName) {
            const tempVar = {
              bConstantVal: false,
              chkInputSelected: false,
              chkOutputSelected: false,
              dataStructureId: "0",
              disableMapped: true,
              displayName: "",
              enableinput: false,
              enableoutput: false,
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
        [propertiesLabel.sap]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <React.Fragment>
      <div>
        <div
          className="row"
          style={{
            marginTop: "1rem",
            padding: "0.5rem 0",
            backgroundColor: "#F8F8F8",
          }}
        >
          <p className={styles.headerLabel1}>{t("importParameters")}</p>
          <p className={styles.headerLabel}>{t("parentName")}</p>
          <p className={styles.headerLabel}>{t("processvariable(s)")}</p>
        </div>
        <div className={`${styles.scroll} ${styles.tabSection}`}>
          {inputList &&
            inputList.map((val, i) => {
              return (
                <div className={styles.tableRow}>
                  <p className={styles.tableLabel1}>{val.Name}</p>
                  <p className={styles.tableLabel}>-</p>
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
                      style={{
                        width: "8rem",
                        border: ".5px solid #c4c4c4",
                        background: "white",
                      }}
                      disabled={isReadOnly}
                      key={i}
                      value={selectedVariable[i].name}
                      onChange={(e) => {
                        changeVariable(e, i, val.Name);
                      }}
                    >
                      {getFilterList(i, val)?.map((option) => {
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
        </div>
      </div>
    </React.Fragment>
  );
}

export default Input;
