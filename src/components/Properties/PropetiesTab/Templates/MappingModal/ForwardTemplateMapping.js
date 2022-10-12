import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import "./index.css";
import "../index.css";
import { Checkbox, MenuItem, Select } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import { RTL_DIRECTION } from "../../../../../Constants/appConstants";

function ForwardTemplateMapping(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let {
    schemaList,
    template,
    setUpdatedTemplate,
    checked,
    setChecked,
    isReadOnly,
  } = props;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData] = useGlobalState(
    loadedActivityPropertyData
  );
  const variableDefinition = localLoadedProcessData?.Variable?.filter(
    (el) => el.VariableType !== "11"
  );

  useEffect(() => {
    let checkedTempObj = {};
    schemaList?.forEach((val) => {
      if (template.FwdVarMapping) {
        let isTemplateFound = false;
        template.FwdVarMapping.forEach((temp) => {
          if (
            val.name === temp.templateVarName &&
            temp.mappedName?.trim() !== ""
          ) {
            isTemplateFound = true;
            checkedTempObj = {
              ...checkedTempObj,
              [val.name]: { isChecked: true, mappedValue: temp.mappedName },
            };
          } else if (!isTemplateFound) {
            checkedTempObj = {
              ...checkedTempObj,
              [val.name]: { isChecked: false, mappedValue: null },
            };
          }
        });
      } else {
        checkedTempObj = {
          ...checkedTempObj,
          [val.name]: { isChecked: false, mappedValue: null },
        };
      }
    });
    setChecked(checkedTempObj);
  }, [schemaList]);

  const checkForVarRights = (data) => {
    let temp = false;
    localLoadedActivityPropertyData?.ActivityProperty?.m_objDataVarMappingInfo?.dataVarList?.forEach(
      (item, i) => {
        if (item?.processVarInfo?.variableId === data.VariableId) {
          if (
            item?.m_strFetchedRights === "O" ||
            item?.m_strFetchedRights === "R"
          ) {
            temp = true;
          }
        }
      }
    );
    return temp;
  };

  const getVarListByType = (varList, item) => {
    let varType = item?.type;
    let list = [];
    varList?.forEach((el) => {
      if (
        el.VariableScope === "M" ||
        el.VariableScope === "S" ||
        (el.VariableScope === "U" && checkForVarRights(el)) ||
        (el.VariableScope === "I" && checkForVarRights(el))
      ) {
        let type = el.VariableType;
        if (+varType === +type) {
          list.push(el);
        }
      }
    });
    return list;
  };

  const updateForwardMapping = (tempName, value) => {
    setChecked((prev) => {
      let temp = { ...prev };
      temp[tempName].mappedValue = value;
      return temp;
    });
    let variable = variableDefinition?.filter(
      (el) => el.VariableName === value
    )[0];
    setUpdatedTemplate((prev) => {
      let temp = { ...prev };
      temp.FwdVarMapping = (
        prev.FwdVarMapping ? prev.FwdVarMapping : schemaList
      ).map((el) => {
        if (
          (prev.FwdVarMapping && el.templateVarName === tempName) ||
          (!prev.FwdVarMapping && el.name === tempName)
        ) {
          return {
            varScope: variable.VariableScope,
            templateVarType: prev.FwdVarMapping ? el.templateVarType : el.type,
            minOccurs: el.minOccurs,
            orderId: el.orderId,
            templateVarName: prev.FwdVarMapping ? el.templateVarName : el.name,
            maxOccurs: el.maxOccurs,
            mappedName: value,
            varId: +variable.VariableId,
            varFieldId: +variable.VarFieldId,
          };
        } else {
          return {
            varScope: el.varScope,
            templateVarType: prev.FwdVarMapping ? el.templateVarType : el.type,
            minOccurs: el.minOccurs,
            orderId: el.orderId,
            templateVarName: prev.FwdVarMapping ? el.templateVarName : el.name,
            maxOccurs: el.maxOccurs,
            mappedName: el.mappedName,
            varId: el.varId,
            varFieldId: el.varFieldId,
          };
        }
      });
      return temp;
    });
  };

  return (
    <div className={styles.mainDiv}>
      <div className={styles.headerDiv}>
        <p
          className={
            direction === RTL_DIRECTION ? arabicStyles.iconDiv : styles.iconDiv
          }
        ></p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.variableName
              : styles.variableName
          }
        >
          {t("TemplateVariables")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.dataType
              : styles.dataType
          }
        >
          {t("CurrentProcessVariable(s)")}
        </p>
      </div>
      <div className={styles.bodyDiv}>
        {schemaList?.map((d) => {
          return (
            <div className={styles.dataDiv}>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.iconDiv
                    : styles.iconDiv
                }
              >
                <Checkbox
                  checked={checked[d.name] ? checked[d.name].isChecked : false}
                  onChange={(e) => {
                    setChecked((prev) => {
                      let temp = { ...prev };
                      temp[d.name].isChecked = e.target.checked;
                      return temp;
                    });
                  }}
                  disabled={isReadOnly}
                  id={`ccm_${d.name}_check`}
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.omsTemplateCheckbox
                      : styles.omsTemplateCheckbox
                  }
                />
              </p>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.variableNameData
                    : styles.variableNameData
                }
              >
                {d.name}
                {+d.minOccurs > 0 ? (
                  <span className={styles.starIcon}>*</span>
                ) : null}
              </p>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.dataTypeValue
                    : styles.dataTypeValue
                }
              >
                <Select
                  className={
                    direction === RTL_DIRECTION
                      ? `templatePropSelect ${arabicStyles.templatePropSelect}`
                      : `templatePropSelect ${styles.templatePropSelect}`
                  }
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  }}
                  inputProps={{
                    readOnly:
                      (checked[d.name] && !checked[d.name].isChecked) ||
                      isReadOnly,
                  }}
                  style={{
                    backgroundColor:
                      checked[d.name] && !checked[d.name].isChecked
                        ? "#f8f8f8"
                        : "#fff",
                  }}
                  value={checked[d.name] ? checked[d.name].mappedValue : null}
                  id={`ccm_${d.name}_select`}
                  onChange={(e) => {
                    updateForwardMapping(d.name, e.target.value);
                  }}
                >
                  {getVarListByType(variableDefinition, d)?.map((ele) => {
                    return (
                      <MenuItem
                        value={ele.VariableName}
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.templateDropdownData
                            : styles.templateDropdownData
                        }
                      >
                        {ele.VariableName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ForwardTemplateMapping;
