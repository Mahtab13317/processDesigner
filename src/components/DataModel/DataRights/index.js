import React, { useEffect, useState } from "react";
import styles from "./rights.module.css";
import arabicStyles from "./rightArabic.module.css";
import SearchComponent from "../../../UI/Search Component/index";
import "./index.css";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Switch,
  FormGroup,
  Button,
  TablePagination,
  CircularProgress,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { connect, useDispatch, useSelector } from "react-redux";
import { getActivityProps } from "../../../utility/abstarctView/getActivityProps";
import { store, useGlobalState } from "state-pool";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Pagination from "@material-ui/lab/Pagination";
import Paginate from "./paginate";
import axios from "axios";
import { RTL_DIRECTION, SERVER_URL } from "../../../Constants/appConstants";
import { element } from "prop-types";
import PaginateVar from "./PaginateVar";

function DataRights() {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

  const [variables, setVariables] = useState([]);
  const [activities, setActivities] = useState([]);
  const [actVar, setActVar] = useState([]);
  const [varActRights, setVarActRights] = useState([]);
  const [totalVar, setTotalVar] = useState(null);
  const [totalAct, setTotalAct] = useState(null);
  const [showPerPage, setShowPerPage] = useState(2);
  const [pagination, setPagination] = useState({
    start: 0,
    end: showPerPage,
  });
  const [showPerPageVar, setShowPerPageVar] = useState(2);
  const [paginationVar, setPaginationVar] = useState({
    start: 0,
    end: showPerPageVar,
  });

  const [fetchedRights, setFetchedRights] = useState([]);
  const [checkedStatus, setChekedStatus] = useState(false);

  useEffect(async () => {
    let temp = [];
    localLoadedProcessData?.Variable.filter(
      (d) => d.VariableScope === "U" || d.VariableScope === "I"
    ).map((data, i) => {
      temp.push({
        id: data.VariableId,
        name: data.VariableName,
      });
    });
    console.log("mahtab variables", temp);

    setVariables(temp);
    setActVar(temp);
    setTotalVar(temp.length);

    console.log("mahtab milestones", localLoadedProcessData?.MileStones);

    let arr = [];

    localLoadedProcessData?.MileStones.map((mileStone) => {
      mileStone.Activities.map((activity, index) => {
        arr.push({
          id: activity.ActivityId,
          type: activity.ActivityType,
          subType: activity.ActivitySubType,
          actName: activity.ActivityName,
          read: false,
          modify: false,
        });
      });
    });

    setActivities(arr);
    setTotalAct(arr.length);

    let tempList = [...varActRights];
    let tempVar = [...temp];
    let tempAct = [...arr];
    let newArr = [];

    tempAct.map((data, i) => {
      newArr[i] = {
        id: data.id,
        actName: data.actName,
        type: data.type,
        subType: data.subType,
        modStatus: false,
        varDetail: tempVar.map((item, j) => {
          return {
            varId: item.id,
            varName: item.name,
            actName: data.actName,
            read: false,
            modify: false,
          };
        }),
      };
      tempVar.map((item, j) => {
        newArr[i][j] = {
          varId: item.id,
          varName: item.name,
          actName: data.actName,
          read: false,
          modify: false,
        };
      });
    });

    console.table(newArr);

    let ids = arr.map((elem) => {
      return elem.id;
    });
    ids = ids.toString();
    console.log("mahtab ids", ids);
    const urlData = {
      pid: localLoadedProcessData.ProcessDefId,
      repoType: localLoadedProcessData.ProcessType,
      version: localLoadedProcessData.VersionNo,
      name: localLoadedProcessData.ProcessName,
      type: localLoadedProcessData.ProcessVariantType,
      id: ids,
    };
    const url =
      SERVER_URL +
      "/dataAssoc?pDefId=" +
      urlData.pid +
      "&repoType=" +
      urlData.repoType +
      "&versionNo=" +
      urlData.version +
      "&pName=" +
      urlData.name +
      "&pVariantType=" +
      urlData.type +
      "&actId=" +
      urlData.id;
    const response = await getRightsAPICall(url);
    console.log("response", response?.data?.actVarRightsDetails);
    setFetchedRights(response?.data?.actVarRightsDetails);
    response?.data?.actVarRightsDetails?.forEach((data, i) => {
      if (data?.varDetails && data?.varDetails?.length > 0) {
        data?.varDetails?.forEach((item, j) => {
          if (item.varType === "O") {
            newArr[i][j].read = true;
            newArr[i][j].modify = true;
            newArr[i].varDetail[j].read = true;
            newArr[i].varDetail[j].modify = true;
          } else {
            newArr[i][j].read = true;
            newArr[i].varDetail[j].read = true;
          }
        });
      } else {
        newArr = [...newArr];
      }
    });

    setVarActRights(newArr);
  }, []);

  const getRightsAPICall = async (url) => {
    return await axios.get(url);
  };

  const getList = () => {
    //alert("sfdsf")
  };

  const checkedAllAct = (e, i) => {
    const tempAct = [...activities];
    let tempVar = [...variables];
    let tempVarAct = [...varActRights];
    tempVarAct[i].modStatus = true;
    tempVar.forEach((elem, j) => {
      tempVarAct[i][j].read = e.target.checked;
      tempVarAct[i][j].modify = e.target.checked;
      tempVarAct[i].varDetail[j].read = e.target.checked;
      tempVarAct[i].varDetail[j].modify = e.target.checked;
    });

    setVarActRights(tempVarAct);
  };

  const readAllVar = (e, j) => {
    let tempAct = [...activities];
    let tempVar = [...variables];
    let tempVarAct = [...varActRights];

    tempAct.forEach((el, i) => {
      tempVarAct[i][j].read = e.target.checked;
      tempVarAct[i].varDetail[j].read = e.target.checked;
      tempVarAct[i].modStatus = true;
    });

    setVarActRights(tempVarAct);
  };

  const modifyAllVar = (e, j) => {
    let tempAct = [...activities];
    let tempVar = [...variables];
    let tempVarAct = [...varActRights];

    tempAct.forEach((el, i) => {
      tempVarAct[i][j].modify = e.target.checked;
      tempVarAct[i].varDetail[j].read = e.target.checked;
      tempVarAct[i].modStatus = true;
    });

    setVarActRights(tempVarAct);
  };

  console.log("mahtab all rights", varActRights);

  const readVar = (e, actData, varData) => {
    let tempVarAct = [...varActRights];

    tempVarAct
      .filter((d) => d.actName == actData)
      .forEach((el, i) => {
        el.modStatus = true;
        el.varDetail.forEach((itm, j) => {
          if (itm.varName == varData) {
            itm.read = e.target.checked;
            tempVarAct[i][j].read = e.target.checked;
          }
        });
      });

    setVarActRights(tempVarAct);
  };

  const modifyVar = (e, actData, varData) => {
    let tempVarAct = [...varActRights];
    tempVarAct
      .filter((d) => d.actName == actData)
      .forEach((el, i) => {
        el.modStatus = true;
        el.varDetail.forEach((itm, j) => {
          if (itm.varName == varData) {
            itm.modify = e.target.checked;
            tempVarAct[i][j].modify = e.target.checked;
          }
        });
      });

    setVarActRights(tempVarAct);
  };

  const onPaginationChange = (start, end) => {
    setPagination({ start: start, end: end });
    return { start: start + 1, end: end };
  };

  const onPaginationVarChange = (start, end) => {
    setPaginationVar({ start: start, end: end });
    return { start: start + 1, end: end };
  };

  const getReadVal = (actData, varData) => {
    console.log("123", "cheked data", actData, varData);
    let tempRights = [...varActRights];
    let retVal = null;
    tempRights
      .filter((d) => d.actName == actData)
      .forEach((el, i) => {
        console.log("123", "mapped data", el);
        el.varDetail.forEach((itm, j) => {
          if (itm.varName == varData) {
            console.log("123", "mapped data new", itm.read);
            retVal = itm.read;
          }
        });
      });
    return retVal;
  };

  const getModifyVal = (actData, varData) => {
    console.log("123", "cheked data", actData, varData);
    let tempRights = [...varActRights];
    let retVal = null;
    tempRights
      .filter((d) => d.actName == actData)
      .forEach((el, i) => {
        console.log("123", "mapped data", el);
        el.varDetail.forEach((itm, j) => {
          if (itm.varName == varData) {
            console.log("123", "mapped data new", itm.read);
            retVal = itm.modify;
          }
        });
      });
    return retVal;
  };

  const saveData = () => {
    let tempAct = [...activities];
    let tempVar = [...variables];
    let tempVarAct = [...varActRights];
    let tempFetchedData = [...fetchedRights];
    let temArr = [];

    const arr = tempFetchedData.filter(
      (d) => d?.varDetails && d?.varDetails?.length > 0
    );

    // console.log("123","save data",tempVarAct.filter(x => x.varDetail.filter(g => g.read==true || g.modify==true)))

    const saveAct = tempVarAct.map((el, i) => {
      let resultVar = [];
      const tempFetchRights = [];
      arr.forEach((d, index) => {
        if (d.actName === el.actName) {
          d.varDetail.forEach((dd, z) => {
            tempFetchRights.push(dd.varType);
          });
        }
      });

      // let varDet=el.varDetail.filter((d) => d.read ==true || d.modify ==true);
      if (el.varDetail > 0) {
        el.varDetail.forEach((elem, j) => {
          resultVar.push({
            m_sStatus: "A",
            varDefInfo: {
              varScope: "U",
              variableId: "19",
              varName: "name",
              type: "10",
            },
            isModify: false,
            isView: true,
            m_strFetchedRights:
              tempFetchRights.length > 0 ? tempFetchRights[j] : "",
          });
        });
      }

      return {
        actId: el.id,
        actType: el.type,
        actSubType: el.subType,
        actName: el.actName,
        bActDataModified: el.modStatus,
        m_objDataVarMappingInfo: {
          dataVarMap: resultVar,
        },
      };
    });

    const payLoad = {
      processDefId: localLoadedProcessData.ProcessDefId,
      processName: localLoadedProcessData.ProcessName,
      projectId: localLoadedProcessData.ProjectId,
      activities: saveAct,
      /* activities:[
      {
      "actId":"2",
      "actType":"31",
      "actSubType":"1",
      "actName":"BusinessRule_2",
      "bActDataModified":true,
      "m_objDataVarMappingInfo":{
          "dataVarMap":{
              "1":{            
                  "m_sStatus":"A",
                  "varDefInfo":{"varScope":"U","variableId":"19","varName":"name","type":"10"},
                  "isModify":false,
                  "isView":true,
                  "m_strFetchedRights": ""
                  
              }
          }
      }
      }
    ] */
    };

    console.log("123", "fetch data", arr);
    console.log("123", "save data", saveAct);
  };

  console.log("1234", "final data", varActRights);
  return (
    <>
      {varActRights && varActRights.length > 0 ? (
        <div className={styles.flexContainer}>
          <div className={styles.leftPanel}>
            <div className={styles.leftHeadSection}>
              <div className={styles.variableHead}>
                <div>
                  <h4 className={styles.heading}>
                    {t("toolbox.dataRights.variables")}
                  </h4>
                </div>
                <div className={styles.showCount}>
                  <PaginateVar
                    showPerPageVar={showPerPageVar}
                    onPaginationVarChange={onPaginationVarChange}
                    total={variables.length}
                    page={paginationVar}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <span className={styles.searchBar}>
                  <SearchComponent onSearchChange={getList} />
                </span>
              </div>
            </div>
            <div className={styles.variableSection}>
              {variables
                ?.slice(paginationVar.start, paginationVar.end)
                .map((data, i) => (
                  <div className={styles.varibleList}>
                    <p className={styles.varTitle}>{data.name}</p>
                    <p className={styles.checkGroup}>
                      <FormGroup row>
                        <FormControlLabel
                          className={styles.rightsCheck}
                          control={
                            <Checkbox
                              onChange={(e) => {
                                readAllVar(e, i);
                              }}
                            />
                          }
                          label="Read"
                        />
                        <FormControlLabel
                          className={styles.rightsCheck}
                          control={
                            <Checkbox
                              onChange={(e) => {
                                modifyAllVar(e, i);
                              }}
                            />
                          }
                          label="Modify"
                        />
                      </FormGroup>
                    </p>
                  </div>
                ))}
            </div>
          </div>
          <div className={styles.rightPanel}>
            <div className={styles.rightsHead}>
              <div style={{ flexGrow: "4" }}>
                <h4 className={styles.heading}>
                  {t("toolbox.dataRights.rightsAct")}
                </h4>
              </div>
              <div className={styles.showCountRight}>
                <Paginate
                  showPerPage={showPerPage}
                  onPaginationChange={onPaginationChange}
                  total={activities.length}
                  page={pagination}
                />
              </div>
              <div className={styles.searchBar}>
                <SearchComponent onSearchChange={getList} />
              </div>
              <div className="switch">
                <FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        className={styles.switchToggle}
                        color="primary"
                        size="small"
                      />
                    }
                    label="Compact"
                    labelPlacement="start"
                  />
                </FormControl>
              </div>
            </div>
            <div class={styles.rightsActivities}>
              {activities
                .slice(pagination.start, pagination.end)
                .map((elem, i) => (
                  <div class={styles.actColumn}>
                    <div className={styles.actItem}>
                      <FormControlLabel
                        className={styles.rightsCheck}
                        control={
                          <Checkbox
                            onChange={(e) => {
                              checkedAllAct(e, i);
                            }}
                          />
                        }
                      />
                      <span className={styles.actTitle}>{elem?.actName}</span>
                    </div>

                    <div className={styles.variableSection}>
                      {actVar &&
                        actVar
                          ?.slice(paginationVar.start, paginationVar.end)
                          .map((item, j) => (
                            <div className={styles.actRights}>
                              <p className={styles.checkGroup}>
                                <FormGroup row>
                                  <FormControlLabel
                                    className={styles.rightsCheck}
                                    control={
                                      <Checkbox
                                        checked={getReadVal.call(
                                          this,
                                          elem?.actName,
                                          item?.name
                                        )}
                                        onChange={(e) => {
                                          readVar(e, elem?.actName, item?.name);
                                        }}
                                      />
                                    }
                                    label="Read"
                                  />

                                  <FormControlLabel
                                    className={styles.rightsCheck}
                                    control={
                                      <Checkbox
                                        checked={getModifyVal.call(
                                          this,
                                          elem?.actName,
                                          item?.name
                                        )}
                                        onChange={(e) => {
                                          modifyVar(
                                            e,
                                            elem?.actName,
                                            item?.name
                                          );
                                        }}
                                      />
                                    }
                                    label="Modify"
                                  />
                                </FormGroup>
                              </p>
                            </div>
                          ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.btnList}>
              <Button
                id="cancel"
                color="primary"
                variant="outlined"
                size="small"
              >
                {t("toolbox.dataRights.discard")}
              </Button>
              <Button
                id="save"
                className="btnSave"
                variant="contained"
                size="small"
                onClick={saveData}
              >
                {t("toolbox.dataRights.save")}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <CircularProgress
          style={
            direction === RTL_DIRECTION
              ? { marginTop: "40vh", marginRight: "50%" }
              : { marginTop: "40vh", marginLeft: "50%" }
          }
        />
      )}
    </>
  );
}

export default DataRights;
