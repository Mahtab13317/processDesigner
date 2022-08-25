// Made changes to solve bug ID - 111180, 112972 , 111162 and 111182
import React, { useState, useEffect } from "react";
import { Select, MenuItem } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import Button from "@material-ui/core/Button";
import "../Archieve/index.css";
import axios from "axios";
import { connect } from "react-redux";
import {
  SERVER_URL,
  SAVE_ARCHIVE,
} from "../../../../../Constants/appConstants";

function FieldMapping(props) {
  const [loadedVariables] = useGlobalState("variableDefinition");
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  const [assDataClassMappingList, setAssDataClassMappingList] = useState([]);
  const [data, setData] = useState({});
  useEffect(() => {
    if (
      props.assDataClassMappingList &&
      props.assDataClassMappingList.length > 0
    ) {
      let tempData = {};
      if (props.mapType == "archeive") {
        localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo?.docTypeInfo?.docTypeDCMapList?.map(
          (el) => {
            if (el.docTypeId === props.selectedDoc.DocTypeId) {
              el.m_arrFieldMappingInfo?.map((list) => {
                let test = props.assDataClassMappingList.filter(
                  (d) => d.IndexName == list.assoFieldMapList[0].fieldName
                );
                if (test.length >= 1) {
                  tempData[list.assoFieldMapList[0].fieldName] =
                    list.assoFieldMapList[0].assocVarName;
                }
              });
            }
          }
        );
      } else {
        localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo?.folderInfo?.fieldMappingInfoList?.map(
          (list) => {
            let test = props.assDataClassMappingList.filter(
              (d) => d.IndexName == list.assoFieldMapList[0].fieldName
            );
            if (test.length >= 1) {
              tempData[list.assoFieldMapList[0].fieldName] =
                list.assoFieldMapList[0].assocVarName;
            }
          }
        );
      }
      setData(tempData);
      setAssDataClassMappingList(props.assDataClassMappingList);
    }
  }, [props.assDataClassMappingList]);

  const handleDataClassVarSelection = (event, valueName) => {
    setData((prev) => {
      let newObj = { ...prev };
      newObj[valueName] = event.target.value;
      return newObj;
    });
  };

  const handleMappingSave = () => {
    let assoFieldMapListTemp = [];
    let tempAssociatedDataClass;
    Object.keys(data).map((d) => {
      let assTempData = assDataClassMappingList.filter(
        (assoData) => assoData.IndexName == d
      );

      loadedVariables.map((list) => {
        if (list.VariableName == data[d]) {
          assoFieldMapListTemp.push({
            assoFieldMapList: [
              {
                fieldName: d,
                dataFieldId: assTempData[0].IndexId,
                // m_strDataFieldType: assTempData[0].IndexType,
                dataFieldType: list.VariableType,
                assocVarName: list.VariableName,
                assocVarId: list.VariableId,
                assocVarFieldId: list.VarFieldId,
                assocExtObjId: list.ExtObjectId,
              },
            ],
          });
        }
      });
    });

    console.log("assoFieldMapListTemp", props.selectedDoc);
    let temp = { ...localLoadedActivityPropertyData };
    if (props.mapType == "archeive") {
      let assoFieldIdTemp =
        props.docCheckList[props.selectedDoc.DocTypeId].selectedVal;
      props.associateDataClassList.map((clas) => {
        if (clas.dataDefIndex == assoFieldIdTemp) {
          tempAssociatedDataClass = clas.dataDefName;
        }
      });
      let docList =
        temp?.ActivityProperty?.archiveInfo?.docTypeInfo?.docTypeDCMapList;
      if (docList?.length > 0) {
        let isDocFound = false;
        docList.map((el, index) => {
          if (el.docTypeId == props.selectedDoc.DocTypeId) {
            isDocFound = true;
            temp.ActivityProperty.archiveInfo.docTypeInfo.docTypeDCMapList[
              index
            ].m_arrFieldMappingInfo = assoFieldMapListTemp;
            temp.ActivityProperty.archiveInfo.docTypeInfo.docTypeDCMapList[
              index
            ].assocDCId = assoFieldIdTemp;
            temp.ActivityProperty.archiveInfo.docTypeInfo.docTypeDCMapList[
              index
            ].assocDCName = tempAssociatedDataClass;
          }
        });
        if (!isDocFound) {
          temp.ActivityProperty.archiveInfo.docTypeInfo.docTypeDCMapList = [
            ...temp.ActivityProperty.archiveInfo.docTypeInfo.docTypeDCMapList,
            {
              m_arrFieldMappingInfo: assoFieldMapListTemp,
              docTypeId: props.selectedDoc.DocTypeId,
              assocDCId: assoFieldIdTemp,
              assocDCName: tempAssociatedDataClass,
              docTypeName: props.selectedDoc.DocName,
            },
          ];
        }
      } else {
        temp.ActivityProperty.archiveInfo.docTypeInfo.docTypeDCMapList = [
          {
            m_arrFieldMappingInfo: assoFieldMapListTemp,
            docTypeId: props.selectedDoc.DocTypeId,
            assocDCId: assoFieldIdTemp,
            assocDCName: tempAssociatedDataClass,
            docTypeName: props.selectedDoc.DocName,
          },
        ];
      }
    } else {
      temp.ActivityProperty.archiveInfo.folderInfo.fieldMappingInfoList =
        assoFieldMapListTemp;
    }
    console.log("heyyyy", temp);
    props.setShowAssDataClassMapping(false);
    setlocalLoadedActivityPropertyData(temp);
  };

  return (
    <div>
      <table>
        <tr>
          <th style={{ display: "flex", alignItems: "center" }}>
            {"Associated Field(s)"}
          </th>
          <th>{"Process Var(s)"}</th>
        </tr>
        {assDataClassMappingList &&
          assDataClassMappingList.map((value, index) => {
            return (
              <tr>
                <td>{value.IndexName}</td>
                <Select
                  className={
                    props.isDrawerExpanded
                      ? "dropDownSelect_expandeddms"
                      : "dropDownSelect"
                  }
                  onChange={(e) =>
                    handleDataClassVarSelection(e, value.IndexName)
                  }
                  value={data[value.IndexName]}
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
                >
                  {loadedVariables.map((value) => {
                    return (
                      <MenuItem
                        className="statusSelect"
                        value={value.VariableName}
                      >
                        {value.VariableName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </tr>
            );
          })}
      </table>

      <div
        style={{
          display: "flex",
          alignItems: "right",
          justifyContent: "end",
          marginTop: "10px",
          marginRight: "10px",
        }}
      >
        <Button
          id="ok_AddVariableModal_DMSAdapter"
          onClick={() => handleMappingSave()}
          variant="contained"
          color="primary"
        >
          Ok
        </Button>
        <Button
          variant="outlined"
          onClick={() => props.setShowAssDataClassMapping(false)}
          id="close_AddVariableModal_DMSAdapter"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};
export default connect(mapStateToProps, null)(FieldMapping);
