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
import {
  ENDPOINT_GET_DATA_ASSOCIATE,
  ENDPOINT_SAVE_DATA_ASSOCIATE,
  RTL_DIRECTION,
  SERVER_URL,
} from "../../../Constants/appConstants";
import { element } from "prop-types";
import PaginateVar from "./PaginateVar";
import { setToastDataFunc } from "../../../redux-store/slices/ToastDataHandlerSlice";

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

  const actSize =
    localLoadedProcessData?.ActivityBatchSize &&
    localLoadedProcessData?.ActivityBatchSize > 0
      ? localLoadedProcessData?.ActivityBatchSize
      : 4;
  const varSize =
    localLoadedProcessData?.VariableBatchSize &&
    localLoadedProcessData?.VariableBatchSize > 0
      ? localLoadedProcessData?.VariableBatchSize
      : 5;
  const [variables, setVariables] = useState([]); // for left side variables
  const [activities, setActivities] = useState([]); //for showing activities
  const [actVar, setActVar] = useState([]); //variables in an activity
  const [varActRights, setVarActRights] = useState([]); // all data rights matrix
  const [totalVar, setTotalVar] = useState(null); //count of variable
  const [totalAct, setTotalAct] = useState(null); // count of activities
  const [showPerPage, setShowPerPage] = useState(actSize); // page size for activities
  const [pagination, setPagination] = useState({
    start: 0,
    end: showPerPage,
  });
  const [showPerPageVar, setShowPerPageVar] = useState(varSize); // page size for variable list
  const [paginationVar, setPaginationVar] = useState({
    start: 0,
    end: showPerPageVar,
  });

  const [fetchedRights, setFetchedRights] = useState([]); //existing fetched rights from get api call

  const [searchVar, setSearchVar] = useState(""); // for variable search filter
  const [searchAct, setSearchAct] = useState(""); // for activities search filter
  const [btnDisable, setBtnDisable] = useState(true);

  //array list for filter the activities which have data rights tab in properties else activity will not shown in matrix
  const actTypeArr = [
    1, 10, 27, 2, 34, 20, 32, 11, 29, 19, 3, 21, 4, 33, 22, 31,
  ];

  useEffect(async () => {
    //getting variable list from process
    let temp = [];
    localLoadedProcessData?.Variable?.filter(
      (d) => d.VariableScope === "U" || d.VariableScope === "I"
    )?.map((data, i) => {
      temp.push({
        id: data.VariableId,
        name: data.VariableName,
        varScope: data.VariableScope,
        varType: data.VariableType,
        read: false,
        modify: false,
      });
    });

    setVariables(temp);
    setActVar(temp);
    setTotalVar(temp.length);

    let arr = [];

    //getting activities list from process
    localLoadedProcessData?.MileStones?.map((mileStone) => {
      mileStone.Activities?.filter((d) =>
        actTypeArr.includes(d.ActivityType)
      )?.map((activity, index) => {
        arr.push({
          id: activity.ActivityId,
          type: activity.ActivityType,
          subType: activity.ActivitySubType,
          actName: activity.ActivityName,
          read: false,
          modify: false,
          isChecked: false,
        });
      });
    });

    setActivities(arr);
    setTotalAct(arr.length);

    let tempList = [...varActRights];
    let tempVar = [...temp];
    let tempAct = [...arr];
    let newArr = [];

    //setting activities and variable both list in an array to give rights for read and modify
    tempAct?.map((data, i) => {
      newArr[i] = {
        id: data.id,
        actName: data.actName,
        type: data.type,
        subType: data.subType,
        modStatus: false,
        varDetail: tempVar?.map((item, j) => {
          return {
            varId: item.id,
            varName: item.name,
            actName: data.actName,
            read: false,
            modify: false,
            varScope: item.varScope,
            varType: item.varType,
            mStatus: null,
            fetchedRights: "",
          };
        }),
      };
      tempVar?.map((item, j) => {
        newArr[i][j] = {
          varId: item.id,
          varName: item.name,
          actName: data.actName,
          read: false,
          modify: false,
        };
      });
    });

    //code for getting existing rights using get api call and set to the above array which have both list activity and variables

    let ids = arr?.map((elem) => {
      return elem.id;
    });
    ids = ids.toString();
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
      ENDPOINT_GET_DATA_ASSOCIATE +
      "?pDefId=" +
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
    setFetchedRights(response?.data?.actVarRightsDetails);

    response?.data?.actVarRightsDetails?.forEach((data, i) => {
      if (data?.varDetails && data?.varDetails?.length > 0) {
        data?.varDetails?.forEach((item, j) => {
          //finding index of matrix from variables array which was defined above in temp variable
          const varIndex = temp.findIndex((x) => x.name === item.varName);

          if (item.varType === "O") {
            newArr[i][varIndex].read = true;
            newArr[i][varIndex].modify = true;
            newArr[i].varDetail[varIndex].read = true;
            newArr[i].varDetail[varIndex].modify = true;
          } else {
            newArr[i][varIndex].read = true;
            newArr[i].varDetail[varIndex].read = true;
          }
          newArr[i].varDetail[varIndex].fetchedRights = item.varType;
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

  //function for variable search filter
  const getVarList = (val) => {
    setSearchVar(val);
  };

  //function for activities search filter
  const getList = (val) => {
    setSearchAct(val);
  };

  //give all rights to all variables in a particular activity
  const checkedAllAct = (e, element, i) => {
    const tempAct = [...activities];
    let tempVar = [...variables];
    let tempVarAct = [...varActRights];

    tempVarAct
      ?.filter((d) => d.actName === element.actName)
      ?.forEach((data, i) => {
        data.modStatus = true;
        tempVar?.forEach((elem, j) => {
          data.varDetail[j].read = e.target.checked;
          data.varDetail[j].modify = e.target.checked;
          if (e.target.checked === false) {
            data.varDetail[j].mStatus = "D";
          } else {
            data.varDetail[j].mStatus = "A";
          }
        });
      });

    tempAct?.forEach((el, z) => {
      if (el.actName === element.actName) {
        el.isChecked = e.target.checked;
      }
    });

    setActivities(tempAct);
    setVarActRights(tempVarAct);
    setBtnDisable(false);
  };

  //function to give read rights to the particular variable in all activities
  const readAllVar = (e, data, j) => {
    let tempAct = [...activities];
    let tempVar = [...variables];
    let tempVarAct = [...varActRights];

    tempVarAct?.forEach((el, i) => {
      el.modStatus = true;
      el.varDetail
        ?.filter((d) => d.varName === data.name)
        ?.forEach((elem, j) => {
          elem.read = e.target.checked;

          if (e.target.checked === false) {
            elem.mStatus = "D";
            elem.modify = e.target.checked;
          } else {
            elem.mStatus = "A";
          }
        });
    });

    tempVar?.forEach((el, z) => {
      if (el.name === data.name) {
        el.read = e.target.checked;
        if (e.target.checked === false) {
          el.modify = e.target.checked;
        }
      }
    });

    setVariables(tempVar);

    setVarActRights(tempVarAct);
    setBtnDisable(false);
  };

  //function to give modify rights to the particular variable in all activities
  const modifyAllVar = (e, data, j) => {
    let tempAct = [...activities];
    let tempVar = [...variables];
    let tempVarAct = [...varActRights];

    tempVarAct.forEach((el, i) => {
      el.modStatus = true;
      el.varDetail
        ?.filter((d) => d.varName === data.name)
        ?.forEach((elem, j) => {
          elem.modify = e.target.checked;

          if (e.target.checked === false) {
            elem.mStatus = "D";
          } else {
            elem.mStatus = "A";
            elem.read = e.target.checked;
          }
        });
    });

    tempVar?.forEach((el, z) => {
      if (el.name === data.name) {
        el.modify = e.target.checked;
        if (e.target.checked === true) {
          el.read = e.target.checked;
        }
      }
    });

    setVariables(tempVar);
    setVarActRights(tempVarAct);
    setBtnDisable(false);
  };

  //give read rights to particular variable in an activity
  const readVar = (e, actData, varData) => {
    let tempVarAct = [...varActRights];

    tempVarAct
      ?.filter((d) => d.actName == actData)
      ?.forEach((el, i) => {
        el.modStatus = true;
        el.varDetail?.forEach((itm, j) => {
          if (itm.varName == varData) {
            itm.read = e.target.checked;
            tempVarAct[i][j].read = e.target.checked;
            if (e.target.checked === false) {
              itm.modify = e.target.checked;
              itm.mStatus = "D";
            } else {
              itm.mStatus = "A";
            }
          }
        });
      });

    setVarActRights(tempVarAct);
    setBtnDisable(false);
  };

  //give modify rights to particular variable in an activity
  const modifyVar = (e, actData, varData) => {
    let tempVarAct = [...varActRights];
    tempVarAct
      ?.filter((d) => d.actName == actData)
      ?.forEach((el, i) => {
        el.modStatus = true;
        el.varDetail?.forEach((itm, j) => {
          if (itm.varName == varData) {
            itm.read = e.target.checked;
            itm.modify = e.target.checked;
            tempVarAct[i][j].modify = e.target.checked;
            if (e.target.checked === false) {
              itm.mStatus = "D";
            } else {
              itm.mStatus = "A";
            }
          }
        });
      });

    setVarActRights(tempVarAct);
    setBtnDisable(false);
  };

  //function for pagination for activities

  const onPaginationChange = (start, end) => {
    setPagination({ start: start, end: end });
    return { start: start + 1, end: end };
  };

  //function for pagination for variables
  const onPaginationVarChange = (start, end) => {
    setPaginationVar({ start: start, end: end });
    return { start: start + 1, end: end };
  };

  //function to return by default read value
  const getReadVal = (actData, varData) => {
    let tempRights = [...varActRights];
    let retVal = null;
    tempRights
      ?.filter((d) => d.actName == actData)
      ?.forEach((el, i) => {
        el.varDetail?.forEach((itm, j) => {
          if (itm.varName == varData) {
            retVal = itm.read;
          }
        });
      });
    return retVal;
  };

  //function to return by default modify value
  const getModifyVal = (actData, varData) => {
    let tempRights = [...varActRights];
    let retVal = null;
    tempRights
      ?.filter((d) => d.actName == actData)
      ?.forEach((el, i) => {
        el.varDetail?.forEach((itm, j) => {
          if (itm.varName == varData) {
            retVal = itm.modify;
          }
        });
      });
    return retVal;
  };

  //While saving getting mapped variable for json payload
  const getMappedVar = (data, index) => {
    let tempVarAct = [...varActRights];

    const x = tempVarAct[index]?.varDetail
      ?.filter((d) => d.mStatus != null)
      ?.map((item, m) => ({
        m_sStatus: item.mStatus,
        varDefInfo: {
          varScope: item.varScope,
          variableId: item.varId,
          varName: item.varName,
          type: item.varType,
        },
        isModify: item.modify,
        isView: item.read,
        m_strFetchedRights: item.fetchedRights,
      }));

    return x;
  };

  //save data function after submitting save button
  const saveData = () => {
    let tempAct = [...activities];
    let tempVar = [...variables];
    let tempVarAct = [...varActRights];
    let tempFetchedData = fetchedRights?.length > 0 ? [...fetchedRights] : [];
    let temArr = [];
    let resultVar = [];

    const arr = tempFetchedData?.filter(
      (d) => d?.varDetails && d?.varDetails?.length > 0
    );

    //list of save activities with variable rights

    const saveAct = tempVarAct?.map((el, i) => {
      const retMapVar = getMappedVar(el, i);

      return {
        actId: el.id,
        actType: el.type,
        actSubType: el.subType,
        actName: el.actName,
        bActDataModified: el.modStatus,
        m_objDataVarMappingInfo:
          el.modStatus == true
            ? {
                dataVarMap: Object.assign({}, retMapVar), //converting array into object
              }
            : {},
      };
    });

    const payLoad = {
      processDefId: localLoadedProcessData.ProcessDefId,
      processName: localLoadedProcessData.ProcessName,
      projectId: localLoadedProcessData.ProjectId,
      activities: saveAct, // this is an array variable coming from above
    };

    axios
      .post(SERVER_URL + "/saveDataAssoc", payLoad)
      .then((res) => {
        if (res?.data?.Status === 0) {
          dispatch(
            setToastDataFunc({
              message: t("toolbox.dataRights.dataSaveMsg"),
              severity: "success",
              open: true,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {varActRights && varActRights.length > 0 ? (
        <div className={styles.flexContainer}>
          {variables && variables.length > 0 ? (
            <>
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
                      <SearchComponent
                        searchTerm={searchVar}
                        onSearchChange={(val) => {
                          getVarList(val);
                        }}
                      />
                    </span>
                  </div>
                </div>
                <div className={styles.variableSection}>
                  {variables
                    ?.slice(paginationVar.start, paginationVar.end)
                    ?.filter((d) =>
                      d.name.toLowerCase().includes(searchVar.toLowerCase())
                    )
                    ?.map((data, i) => (
                      <div className={styles.varibleList}>
                        <p className={styles.varTitle}>{data.name}</p>
                        <p className={styles.checkGroup}>
                          <FormGroup row>
                            <FormControlLabel
                              className={styles.rightsCheck}
                              control={
                                <Checkbox
                                  onChange={(e) => {
                                    readAllVar(e, data, i);
                                  }}
                                  checked={data?.read}
                                />
                              }
                              label="Read"
                            />
                            <FormControlLabel
                              className={styles.rightsCheck}
                              control={
                                <Checkbox
                                  onChange={(e) => {
                                    modifyAllVar(e, data, i);
                                  }}
                                  checked={data?.modify}
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
                    <SearchComponent
                      onSearchChange={(e) => {
                        getList(e);
                      }}
                    />
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
                    ?.filter((d) =>
                      d.actName.toLowerCase().includes(searchAct.toLowerCase())
                    )
                    ?.map((elem, i) => (
                      <div class={styles.actColumn}>
                        <div className={styles.actItem}>
                          <FormControlLabel
                            className={styles.rightsCheck}
                            control={
                              <Checkbox
                                onChange={(e) => {
                                  checkedAllAct(e, elem, i);
                                }}
                                checked={elem.isChecked}
                              />
                            }
                          />
                          <span className={styles.actTitle}>
                            {elem?.actName}
                          </span>
                        </div>

                        <div className={styles.variableSection}>
                          {actVar &&
                            actVar
                              ?.slice(paginationVar.start, paginationVar.end)
                              ?.filter((d) =>
                                d.name
                                  .toLowerCase()
                                  .includes(searchVar.toLowerCase())
                              )
                              ?.map((item, j) => (
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
                                              readVar(
                                                e,
                                                elem?.actName,
                                                item?.name
                                              );
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
                    className={btnDisable ? "btnDisable" : "btnSave"}
                    variant="contained"
                    size="small"
                    onClick={saveData}
                    disabled={btnDisable}
                  >
                    {t("toolbox.dataRights.save")}
                  </Button>
                </div>
              </div>
            </>
          ) : null}
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
