import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { connect, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";
import { getVariableType } from "../../../../utility/ProcessSettings/Triggers/getVariableType";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";

function ExpenseInitiation(props) {
  let { t } = useTranslation();
  let dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const [showCreateSection, setShowCreateSection] = useState(false);
  const [activityDetails, setactivityDetails] = useState([]);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [allReadBool, setallReadBool] = useState(false);
  const [allModifyBool, setallModifyBool] = useState(false);

  const activitytHeadDetails = [
    {
      name: "Name",
      type: "Type",
      length: "Length",
      read: "Read",
      modify: "Modify",
    },
  ];
  let checkedCount = 0;
  activityDetails.map((activity) => {
    let checkedFound = false;
    for (var prop in activity) {
      if (activity[prop] === true) {
        checkedFound = true;
      }
    }
    if (checkedFound) {
      checkedCount += 1;
    }
  });

  const getVariableReadModifyType = (data) => {
    let temp = "";

    if (!!data.bRead && !!data.bModify) {
      temp = "O";
    } else if (data.bRead === true && data.bModify === false) temp = "R";
    else if (data.bRead === false && data.bModify === true) temp = "O";
    else if (!data.bRead && !data.bModify) temp = "S";
    else temp = "R";

    console.log("bbbbbbbbbbbread", data);
    return temp;
  };

  const getVariableInfo = (name) => {
    let temp2 = {};
    let temp = JSON.parse(JSON.stringify(localLoadedProcessData));
    temp?.Variable.forEach((variable) => {
      if (variable.VariableName === name) {
        temp2 = variable;
      }
    });
    return temp2;
  };

  const changeDataFields = (e, _var) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    let actTemp = JSON.parse(JSON.stringify(activityDetails));
    let deleteBool = false;
    let dataVariable = {};

    if (e.target.name === "bRead") {
      actTemp.forEach((act) => {
        if (act.name === _var.name) {
          dataVariable = act;
          if (e.target.checked) {
            act.bRead = e.target.checked;
          } else {
            act.bRead = e.target.checked;
            act.bModify = e.target.checked;
          }
        }
      });
    } else {
      actTemp.forEach((act) => {
        if (act.name === _var.name) {
          if (e.target.checked === true) {
            act.bModify = e.target.checked;
            act.bRead = e.target.checked;
          } else act.bModify = e.target.checked;
          dataVariable = act;
        }
      });
    }

    temp.ActivityProperty.m_objDataVarMappingInfo.dataVarList = [];
    let tempArr = [];
    actTemp.forEach((act) => {
      let el = {
        m_strFetchedRights: getVariableReadModifyType(act),
        processVarInfo: {
          varName: act.name,
          variableId: getVariableInfo(act.name).VariableId,
          varScope: getVariableInfo(act.name).VariableScope,
          type: getVariableInfo(act.name).VariableType,
        },
      };

      if (el.m_strFetchedRights !== "S") {
        tempArr.push(el);
      }
    });

    temp.ActivityProperty.m_objDataVarMappingInfo.dataVarList = tempArr;

    setlocalLoadedActivityPropertyData(temp);
    setactivityDetails(actTemp);
    checkAllReadModify(actTemp);
    dispatch(
      setActivityPropertyChange({
        DataFields: { isModified: true, hasError: false },
      })
    );
  };

  const getVariableReadModifyData = (varName) => {
    let temp = "";

    localLoadedActivityPropertyData?.ActivityProperty?.m_objDataVarMappingInfo?.dataVarList.forEach(
      (dataVar) => {
        if (dataVar.processVarInfo.varName === varName)
          temp = dataVar.m_strFetchedRights;
      }
    );
    return temp;
  };

  const checkAllReadModify = (activityDetails) => {
    let temp = JSON.parse(JSON.stringify(activityDetails));
    let readArr = [];
    let modifyArr = [];
    temp.forEach((act) => {
      readArr.push(act.bRead);
      modifyArr.push(act.bModify);
    });

    if (readArr.includes(false)) setallReadBool(false);
    else setallReadBool(true);
    if (modifyArr.includes(false)) setallModifyBool(false);
    else setallModifyBool(true);
  };

  React.useEffect(() => {
    if (localLoadedActivityPropertyData) {
      let tempArr = [];

      localLoadedProcessData?.Variable.map((processVar) => {
        if (
          processVar.VariableScope === "U" ||
          processVar.VariableScope === "I"
        ) {
          let temp = {
            name: processVar.VariableName,
            type: processVar.VariableType,
            length: processVar.VariableLength,
            bRead:
              getVariableReadModifyData(processVar.VariableName) === "R" ||
              getVariableReadModifyData(processVar.VariableName) === "O"
                ? true
                : false,
            bModify:
              getVariableReadModifyData(processVar.VariableName) === "O"
                ? true
                : false,
            id: processVar.VariableId,
          };
          tempArr.push(temp);
        }
      });

      setactivityDetails(tempArr);
      checkAllReadModify(tempArr);
    }
  }, [localLoadedActivityPropertyData?.Status]);

  const allChangeHandler = (e) => {
    let temp = JSON.parse(JSON.stringify(activityDetails));
    let temp2 = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    temp2.ActivityProperty.m_objDataVarMappingInfo.dataVarList = [];
    if (e.target.name === "allRead") {
      if (e.target.checked) {
        temp.forEach((act) => {
          act.bRead = true;
          let el = {
            m_strFetchedRights: getVariableReadModifyType(act),
            processVarInfo: {
              varName: act.name,
              variableId: getVariableInfo(act.name).VariableId,
              varScope: getVariableInfo(act.name).VariableScope,
              type: getVariableInfo(act.name).VariableType,
            },
          };
          temp2?.ActivityProperty?.m_objDataVarMappingInfo?.dataVarList.push(
            el
          );
        });
      } else {
        temp.forEach((act) => {
          act.bRead = false;
          act.bModify = false;
        });
        temp2.ActivityProperty.m_objDataVarMappingInfo.dataVarList = [];

        setallModifyBool(e.target.checked);
      }
      setallReadBool(e.target.checked);
    } else {
      if (e.target.checked) {
        temp2.ActivityProperty.m_objDataVarMappingInfo.dataVarList = [];
        temp.forEach((act) => {
          act.bRead = true;
          act.bModify = true;
          let el = {
            m_strFetchedRights: getVariableReadModifyType(act),
            processVarInfo: {
              varName: act.name,
              variableId: getVariableInfo(act.name).VariableId,
              varScope: getVariableInfo(act.name).VariableScope,
              type: getVariableInfo(act.name).VariableType,
            },
          };
          temp2?.ActivityProperty?.m_objDataVarMappingInfo?.dataVarList.push(
            el
          );

          setallReadBool(e.target.checked);
        });
      } else {
        temp2.ActivityProperty.m_objDataVarMappingInfo.dataVarList = [];
        temp.forEach((act) => {
          // act.bRead = false;
          act.bModify = false;
          let el = {
            m_strFetchedRights: getVariableReadModifyType(act),
            processVarInfo: {
              varName: act.name,
              variableId: getVariableInfo(act.name).VariableId,
              varScope: getVariableInfo(act.name).VariableScope,
              type: getVariableInfo(act.name).VariableType,
            },
          };
          temp2?.ActivityProperty?.m_objDataVarMappingInfo?.dataVarList.push(
            el
          );
        });
      }
      setallModifyBool(e.target.checked);
    }

    setlocalLoadedActivityPropertyData(temp2);
    setactivityDetails(temp);
    checkAllReadModify(temp);
    dispatch(
      setActivityPropertyChange({
        DataFields: { isModified: true, hasError: false },
      })
    );
  };

  console.log(
    "vvvvvvvvvvvvvvvvvvvvvvvv",
    localLoadedActivityPropertyData.ActivityProperty.m_objDataVarMappingInfo
      .dataVarList
  );

  return (
    <div>
      {showCreateSection ? (
        <div
          style={{
            backgroundColor: "#f8f8f8 ",
            padding: "0px 10px 10px 13px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: direction === "rtl" ? "row-reverse" : "row",
              justifyContent: "space-between",
              padding: "10px 10px 2px 10px",
            }}
          >
            <p style={{ fontSize: "12px" }}>{t("displayName")}</p>
            <input
              style={{ width: "150px", height: "22px", direction: direction }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: direction === "rtl" ? "row-reverse" : "row",
              justifyContent: "space-between",
              padding: "10px 10px 2px 10px",
            }}
          >
            <p style={{ fontSize: "12px" }}>{t("dataType")}</p>
            <input
              style={{ width: "150px", height: "22px", direction: direction }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: direction === "rtl" ? "row-reverse" : "row",
              justifyContent: "space-between",
              padding: "10px 10px 2px 10px",
            }}
          >
            <p style={{ fontSize: "12px" }}>{t("dataObject")}</p>
            <input
              style={{ width: "150px", height: "22px", direction: direction }}
            />
          </div>
          <div
            style={{
              padding: "0px 0px 3px 10px",
              display: "flex",
              flexDirection: direction === "rtl" ? "row-reverse" : "row",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: direction === "rtl" ? "0 0 0 40px" : "0 40px 0 0",
              }}
            >
              <p style={{ fontSize: "12px" }}>{t("read")}</p>
              <Checkbox
                size="small"
                defaultChecked
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ fontSize: "12px" }}>{t("modify")}</p>
              <Checkbox
                size="small"
                defaultChecked
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: direction === "rtl" ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <a
              style={{
                fontSize: "12px",
                color: "blue",
                textDecoration: "underLine",
                margin: direction === "rtl" ? "0 10px 0 0" : "0 0 0 10px",
                cursor: "pointer",
              }}
            >
              More Properties
            </a>
            <div
              style={{
                display: "flex",
                flexDirection: direction === "rtl" ? "row-reverse" : "row",
              }}
            >
              <Button
                onClick={() => setShowCreateSection(false)}
                variant="outlined"
                style={{
                  textTransform: "none",
                  fontSize: "10px",
                  borderRadius: "2px",
                  backgroundColor: "white",
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                style={{
                  textTransform: "none",
                  fontSize: "10px",
                  backgroundColor: "#0072c6",
                  borderRadius: "2px",
                  boxShadow: "none",
                  marginRight: "9px",
                  marginLeft: "10px",
                  color: "white",
                }}
              >
                {t("save")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      <div
        className="modify"
        style={{
          height: "100%",
          width: "auto",

          display: "flex",
          flexDirection: "column",
          paddingInline: "0.8rem",
          paddingTop: "0.3rem",
          direction: direction,
        }}
      >
        {activitytHeadDetails.map((item) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                //justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "20%",
                  //textAlign: direction === "rtl" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    marginTop: "10px",
                    fontWeight: "600",
                  }}
                >
                  {item.name}
                </span>
              </div>
              <div
                style={{
                  width: "20%",
                  //textAlign: direction === "rtl" ? "left" : "right",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    marginTop: "10px",
                    fontWeight: "600",
                  }}
                >
                  {item.type}
                </span>
              </div>
              <div
                style={{
                  width: "20%",
                  // textAlign: direction === "rtl" ? "left" : "right",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    marginTop: "10px",
                    fontWeight: "600",
                  }}
                >
                  {item.length}
                </span>
              </div>

              <div
                style={{
                  width: "20%",
                  //textAlign: direction === "rtl" ? "left" : "right",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    marginTop: "10px",
                    fontWeight: "600",
                  }}
                >
                  <Checkbox
                    checked={allReadBool}
                    name="allRead"
                    onChange={allChangeHandler}
                    size="small"
                  />
                  {item.read}
                </span>
              </div>

              <div
                style={{
                  width: "20%",
                  //textAlign: direction === "rtl" ? "left" : "right",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    marginTop: "10px",
                    fontWeight: "600",
                  }}
                >
                  <Checkbox
                    checked={allModifyBool}
                    name="allModify"
                    onChange={allChangeHandler}
                    size="small"
                  />
                  {item.modify}
                </span>
              </div>
            </div>
          );
        })}

        {activityDetails?.map((item) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                //justifyContent: "space-between",
                //alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "20%",
                  //textAlign: direction === "rtl" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    marginTop: "10px",
                  }}
                >
                  {item.name}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "20%",
                  // textAlign: direction === "rtl" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    marginTop: "10px",
                  }}
                >
                  {getVariableType(item.type)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "20%",
                  // textAlign: direction === "rtl" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    marginTop: "10px",
                  }}
                >
                  {item.length}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "20%",
                  //  textAlign: direction === "rtl" ? "right" : "left",
                  alignItems: "flex-start",
                }}
              >
                <Checkbox
                  checked={item.bRead}
                  size="small"
                  name="bRead"
                  color="primary"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(e) => changeDataFields(e, item)}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "20%",
                  // textAlign: direction === "rtl" ? "right" : "left",
                  alignItems: "flex-start",
                }}
              >
                <Checkbox
                  checked={item.bModify}
                  size="small"
                  name="bModify"
                  color="primary"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(e) => changeDataFields(e, item)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
  };
};

export default connect(mapStateToProps, null)(ExpenseInitiation);
