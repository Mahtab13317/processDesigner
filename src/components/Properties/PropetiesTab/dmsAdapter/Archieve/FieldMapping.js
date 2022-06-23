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
      localLoadedActivityPropertyData.ActivityProperty.archiveInfo.folderInfo.fieldMappingInfoList.map(
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
    let assoFieldIdTemp;
    props.associateDataClassList.map((clas) => {
      if (clas.dataDefName == props.associateDataClass) {
        assoFieldIdTemp = clas.dataDefIndex;
      }
    });
    Object.keys(data).map((d) => {
      let assTempData = assDataClassMappingList.filter(
        (assoData) => assoData.IndexName == d
      );

      loadedVariables.map((list) => {
        if (list.VariableName == data[d]) {
          assoFieldMapListTemp.push({
            fieldName: d,
            dataFieldId: assTempData[0].IndexId,
            // m_strDataFieldType: assTempData[0].IndexType,
            m_strDataFieldType: list.VariableType,
            assocVarName: list.VariableName,
            assocVarId: list.VariableId,
            assocVarFieldId: list.VarFieldId,
            assocExtObjId: list.ExtObjectId,
          });
        }
      });
    });

    const jsonBody = {
      processDefId: props.openProcessID,
      activityId: props.cellID,
      cabinetName:
        localLoadedActivityPropertyData.ActivityProperty.archiveInfo
          .cabinetName,
      appServerIP: "127.0.0.1",
      appServerPort: "8080",
      appServerType: "JBossEAP",
      userName: props.userName,
      m_strAuthCred: props.password,
      m_bDeleteWorkitemAudit: false,
      folderInfo: {
        folderName: props.folderNameInput,
        assoDataClsId: assoFieldIdTemp,
        assoDataClsName: props.associateDataClass,
        m_arrFieldMappingInfo: [
          {
            assoFieldMapList: [...assoFieldMapListTemp],
          },
        ],
      },

      // docTypeInfo: {
      //   docTypeDCMapList: [
      //     {
      //       docTypeName: "",
      //       docTypeId: "",
      //       assocDCName: "",
      //       assocDCId: "",
      //       selectedDoc: true,
      //       m_arrFieldMappingInfo: [
      //         {
      //           assoFieldMapList: [
      //             {
      //               fieldName: "",
      //               dataFieldId: "",
      //               m_strDataFieldType: "",
      //               assocVarName: "",
      //               assocVarId: "",
      //               assocVarFieldId: "",
      //               assocExtObjId: "",
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ],
      // },
    };
    axios.post(SERVER_URL + SAVE_ARCHIVE, jsonBody).then((res) => {
      if (res.data.Status === 0) {
        console.log("SORRY");
      }
    });
  };
  return (
    <div>
      <table className="table">
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
                      ? "dropDownSelect_expanded"
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
