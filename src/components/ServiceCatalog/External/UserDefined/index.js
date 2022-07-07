import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getTypeByVariable,
  getVariableType,
} from "../../../../utility/ProcessSettings/Triggers/getVariableType";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import "../common.css";
import PublicIcon from "@material-ui/icons/Public";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import ParamDivOnHover from "../ParamDivOnHover";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import {
  COMPLEX_VARTYPE,
  DEFAULT_GLOBAL_ID,
  DEFAULT_GLOBAL_TYPE,
  ENDPOINT_ADD_EXTERNAL_METHODS,
  ENDPOINT_DELETE_EXTERNAL_METHODS,
  ENDPOINT_MODIFY_EXTERNAL_METHODS,
  GLOBAL_SCOPE,
  LOCAL_SCOPE,
  RETURN_TYPE_OPTIONS,
  RTL_DIRECTION,
  SERVER_URL,
  USER_DEFINED_SCOPE,
} from "../../../../Constants/appConstants";
import {
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import axios from "axios";
import { connect } from "react-redux";
import { store, useGlobalState } from "state-pool";

function UserDefined(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let {
    methodList,
    primaryInputStrip,
    setPrimaryInputStrip,
    setMethodList,
    maxMethodCount,
    setMaxMethodCount,
    scope,
  } = props;
  const [data, setData] = useState({
    appName: "",
    methodName: "",
    returnType: "",
    isGlobal: false,
    paramList: [],
  });
  const [editMethod, setEditMethod] = useState(null);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

  const ParamTooltip = withStyles((theme) => ({
    tooltip: {
      background: "#FFFFFF 0% 0% no-repeat padding-box",
      boxShadow: "0px 3px 6px #00000029",
      border: "1px solid #70707075",
      font: "normal normal normal 12px/17px Open Sans",
      letterSpacing: "0px",
      color: "#000000",
      zIndex: "100",
      transform: "translate3d(0px, -0.125rem, 0px) !important",
    },
    arrow: {
      "&:before": {
        backgroundColor: "#FFFFFF !important",
        border: "1px solid #70707075 !important",
        zIndex: "100",
      },
    },
  }))(Tooltip);

  //code edited on 21 June 2022 for BugId 111099
  const addExternalMethod = () => {
    let newData = [...methodList];
    let maxVarId;
    //code added on 16 June 2022 for BugId 110949
    if (scope === GLOBAL_SCOPE) {
      maxVarId = +maxMethodCount + 1;
    } else {
      maxVarId = +localLoadedProcessData.MaxMethodIndex + 1;
    }
    let jsonParams = data.paramList?.map((el) => {
      return {
        paramName: el.paramName,
        paramType: getTypeByVariable(el.paramType),
        paramIndex: el.paramId,
        paramScope: "",
        unbounded: el.isArray ? "Y" : "N",
        dataStructureId: "0",
      };
    });
    let json = {
      processDefId:
        scope === GLOBAL_SCOPE ? DEFAULT_GLOBAL_ID : props.openProcessID,
      processType:
        scope === GLOBAL_SCOPE ? DEFAULT_GLOBAL_TYPE : props.openProcessType,
      methodName: data.methodName,
      methodIndex: maxVarId,
      returnType: getTypeByVariable(data.returnType),
      appName: data.appName,
      appType: USER_DEFINED_SCOPE,
      paramList: jsonParams,
      methodType: scope,
    };
    axios.post(SERVER_URL + ENDPOINT_ADD_EXTERNAL_METHODS, json).then((res) => {
      if (res.data.Status === 0) {
        let parameters = data.paramList?.map((param) => {
          return {
            DataStructureId: "0",
            ParamIndex: param.paramId,
            ParamName: param.paramName,
            ParamScope: "",
            ParamType: getTypeByVariable(param.paramType),
            Unbounded: param.isArray ? "Y" : "N",
          };
        });
        newData.push({
          AppName: data.appName,
          AppType: USER_DEFINED_SCOPE,
          MethodIndex: maxVarId + 1,
          MethodName: data.methodName,
          MethodType: scope,
          Parameter: parameters,
          ReturnType: getTypeByVariable(data.returnType),
        });
        setMethodList(newData);
        setData({
          appName: "",
          methodName: "",
          returnType: "",
          isGlobal: false,
          paramList: [
            {
              paramId: 1,
              paramName: "",
              paramType: "",
              isArray: false,
            },
          ],
        });
        //code added on 16 June 2022 for BugId 110949
        if (scope === GLOBAL_SCOPE) {
          setMaxMethodCount((prev) => {
            return prev + 1;
          });
        } else {
          let temp = JSON.parse(JSON.stringify(localLoadedProcessData));
          temp.MaxMethodIndex = temp.MaxMethodIndex + 1;
          setlocalLoadedProcessData(temp);
        }
        setPrimaryInputStrip(false);
      }
    });
  };

  const modifyExternalMethod = () => {
    let parameterList = editMethod.Parameter?.map((param) => {
      return {
        paramName: param.ParamName,
        paramType: param.ParamType,
        paramIndex: param.ParamIndex,
        paramScope: param.ParamScope,
        unbounded: param.Unbounded,
        dataStructureId: param.DataStructureId,
      };
    });
    let json = {
      processDefId: props.openProcessID,
      processType: props.openProcessType,
      methodName: editMethod.MethodName,
      methodIndex: editMethod.MethodIndex,
      methodType: editMethod.MethodType,
      returnType: editMethod.ReturnType,
      appName: editMethod.AppName,
      appType: editMethod.AppType,
      paramList: parameterList,
    };
    axios
      .post(SERVER_URL + ENDPOINT_MODIFY_EXTERNAL_METHODS, json)
      .then((res) => {
        if (res.data.Status === 0) {
          let newData = [...methodList];
          newData?.map((data) => {
            if (+data.MethodIndex === +editMethod.MethodIndex) {
              data.AppName = editMethod.AppName;
              data.AppType = editMethod.AppType;
              data.MethodName = editMethod.MethodName;
              data.MethodType = editMethod.MethodType;
              data.Parameter = editMethod.Parameter;
              data.ReturnType = editMethod.ReturnType;
            }
          });
          setMethodList(newData);
          setEditMethod(null);
        }
      });
  };

  const deleteExternalMethod = (externalMethod) => {
    let json = {
      processDefId: props.openProcessID,
      processType: props.openProcessType,
      methodName: externalMethod.MethodName,
      methodIndex: externalMethod.MethodIndex,
      methodType: externalMethod.MethodType,
      returnType: externalMethod.ReturnType,
      appName: externalMethod.AppName,
      appType: externalMethod.AppType,
    };
    axios
      .post(SERVER_URL + ENDPOINT_DELETE_EXTERNAL_METHODS, json)
      .then((res) => {
        if (res.data.Status === 0) {
          let indexVal;
          let newData = [...methodList];
          newData?.forEach((val, index) => {
            if (+val.MethodIndex === +externalMethod.MethodIndex) {
              indexVal = index;
            }
          });
          newData.splice(indexVal, 1);
          setMethodList(newData);
        }
      });
  };

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onParamChange = (index, e, value) => {
    let newParamList = [...data.paramList];
    newParamList[index] = {
      ...newParamList[index],
      [e.target.name]: value,
    };
    setData((prev) => {
      return { ...prev, paramList: newParamList };
    });
  };

  const onParamChangeInEditMethod = (index, e, value) => {
    let newParamList = [...editMethod.Parameter];
    newParamList[index] = {
      ...newParamList[index],
      [e.target.name]: value,
    };
    setEditMethod((prev) => {
      return { ...prev, Parameter: newParamList };
    });
  };

  const addParam = () => {
    let newParamList = [...data.paramList];
    let maxId = 0;
    newParamList?.forEach((param) => {
      if (+param.paramId > +maxId) {
        maxId = +param.paramId;
      }
    });
    newParamList.push({
      paramId: maxId + 1,
      paramName: "",
      paramType: "",
      isArray: false,
    });
    setData((prev) => {
      return { ...prev, paramList: newParamList };
    });
  };

  const addParamInEditMethod = () => {
    let newParamList = [...editMethod.Parameter];
    let maxId = 0;
    newParamList?.forEach((param) => {
      if (+param.ParamIndex > +maxId) {
        maxId = +param.ParamIndex;
      }
    });
    newParamList.push({
      ParamIndex: maxId + 1,
      DataStructureId: "0",
      ParamName: "",
      ParamScope: "",
      ParamType: "",
      Unbounded: "N",
    });
    setEditMethod((prev) => {
      return { ...prev, Parameter: newParamList };
    });
  };

  const removeParam = (index) => {
    let newParamList = [...data.paramList];
    newParamList.splice(index, 1);
    setData((prev) => {
      return { ...prev, paramList: newParamList };
    });
  };

  const removeParamInEditMethod = (index) => {
    let newParamList = [...editMethod.Parameter];
    newParamList.splice(index, 1);
    setEditMethod((prev) => {
      return { ...prev, Parameter: newParamList };
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
          {t("applicationName")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.dataType
              : styles.dataType
          }
        >{`${t("method")} ${t("name")}`}</p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.variableLength
              : styles.variableLength
          }
        >
          {t("returnType")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.variableLength
              : styles.variableLength
          }
        ></p>
      </div>
      <div className={styles.bodyDiv}>
        {primaryInputStrip ? (
          <div className={styles.inputStrip}>
            <div className={styles.dataDiv}>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.iconDiv
                    : styles.iconDiv
                }
              ></p>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.variableNameData
                    : styles.variableNameData
                }
              >
                <input
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.variableNameInput
                      : styles.variableNameInput
                  }
                  //code added on 16 June 2022 for BugId 110847
                  autocomplete="off"
                  name="appName"
                  value={data.appName}
                  onChange={onChange}
                />
              </p>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.dataTypeValue
                    : styles.dataTypeValue
                }
              >
                <input
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.variableNameInput
                      : styles.variableNameInput
                  }
                  //code added on 16 June 2022 for BugId 110847
                  autocomplete="off"
                  name="methodName"
                  value={data.methodName}
                  onChange={onChange}
                />
              </p>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.variableLengthData
                    : styles.variableLengthData
                }
              >
                <Select
                  className={
                    direction === RTL_DIRECTION
                      ? `${arabicStyles.selectInput} selectInput`
                      : `${styles.selectInput} selectInput`
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
                  value={data.returnType}
                  name="returnType"
                  onChange={onChange}
                >
                  <MenuItem value={""} style={{ display: "none" }}>
                    ""
                  </MenuItem>
                  {RETURN_TYPE_OPTIONS.map((opt) => {
                    return (
                      <MenuItem
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.dropdownData
                            : styles.dropdownData
                        }
                        value={t(getVariableType(opt))}
                      >
                        {t(getVariableType(opt))}
                      </MenuItem>
                    );
                  })}
                </Select>
              </p>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.variableLengthData
                    : styles.variableLengthData
                }
              >
                {/*code commented on 21 June 2022 for BugId 111099 */}
                {/* <span
                  className={styles.paramArray}
                  style={{ textAlign: "left" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isGlobal"
                        checked={data.isGlobal}
                        onChange={(e) => {
                          setData((prev) => {
                            return {
                              ...prev,
                              isGlobal: !prev.isGlobal,
                            };
                          });
                        }}
                        id="isGlobalCheck_em"
                        color="primary"
                      />
                    }
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.properties_radioButton
                        : styles.properties_radioButton
                    }
                    label={t("globalMethod")}
                  />
                </span> */}
              </p>
              <p className={styles.addButtonDiv}>
                <button
                  className={
                    data.appName.trim() === "" ||
                    data.methodName.trim() === "" ||
                    data.returnType === ""
                      ? styles.disableMethodBtn
                      : styles.addMethodBtn
                  }
                  id={`${props.id}_all`}
                  onClick={addExternalMethod}
                  disabled={
                    data.appName.trim() === "" ||
                    data.methodName.trim() === "" ||
                    data.returnType === ""
                  }
                >
                  + {t("add")} {t("method")}
                </button>
              </p>
              <p className={styles.closeIconButtonDiv}>
                <button
                  className={styles.closeButton}
                  onClick={() => {
                    setPrimaryInputStrip(false);
                  }}
                >
                  <CloseIcon className={styles.closeIcon} />
                </button>
              </p>
            </div>
            <div className={styles.dataDiv}>
              {data.paramList?.length > 0 ? (
                <div
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.paramAddDiv
                      : styles.paramAddDiv
                  }
                >
                  <span
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.paramDefinition
                        : styles.paramDefinition
                    }
                  >
                    {t("Parameter")} {t("definition")}
                  </span>
                  <span className={styles.addParamBtn} onClick={addParam}>
                    {t("add")}
                  </span>
                </div>
              ) : (
                <span
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.addParametersBtn
                      : styles.addParametersBtn
                  }
                  onClick={addParam}
                >
                  {t("addDataObject")} {t("Parameters")}
                </span>
              )}
            </div>
            {data.paramList?.length > 0 ? (
              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.paramDiv
                    : styles.paramDiv
                }
              >
                <div className={styles.paramHeadDiv}>
                  <span className={styles.paramName}>{t("name")}</span>
                  <span
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.paramType
                        : styles.paramType
                    }
                  >
                    {t("type")}
                  </span>
                  <span className={styles.paramArray}>{t("array")}</span>
                  <span
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.paramMoreDiv
                        : styles.paramMoreDiv
                    }
                  ></span>
                </div>
                <div className={styles.paramBodyDiv}>
                  {data.paramList?.map((param, index) => {
                    return (
                      <div className={styles.paramRow}>
                        <span className={styles.paramName}>
                          <input
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.variableNameInput
                                : styles.variableNameInput
                            }
                            name="paramName"
                            value={param.paramName}
                            onChange={(e) =>
                              onParamChange(index, e, e.target.value)
                            }
                          />
                        </span>
                        <span
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.paramType
                              : styles.paramType
                          }
                        >
                          <Select
                            className={
                              direction === RTL_DIRECTION
                                ? `${arabicStyles.selectInput} selectInput`
                                : `${styles.selectInput} selectInput`
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
                            name="paramType"
                            value={param.paramType}
                            onChange={(e) =>
                              onParamChange(index, e, e.target.value)
                            }
                          >
                            {RETURN_TYPE_OPTIONS.map((opt) => {
                              return (
                                <MenuItem
                                  className={
                                    direction === RTL_DIRECTION
                                      ? arabicStyles.dropdownData
                                      : styles.dropdownData
                                  }
                                  value={t(getVariableType(opt))}
                                >
                                  {t(getVariableType(opt))}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </span>
                        <span className={styles.paramArray}>
                          <Checkbox
                            name="isArray"
                            checked={param.isArray}
                            onChange={(e) =>
                              onParamChange(index, e, e.target.checked)
                            }
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.properties_radioButton
                                : styles.properties_radioButton
                            }
                            color="primary"
                          />
                        </span>
                        <span
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.paramMoreDiv
                              : styles.paramMoreDiv
                          }
                        >
                          <button
                            className={styles.closeButton}
                            onClick={() => removeParam(index)}
                          >
                            <CloseIcon className={styles.closeIcon} />
                          </button>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        <div className={styles.listDiv}>
          {methodList
            ?.filter((e) => e.AppType === USER_DEFINED_SCOPE)
            .map((d) => {
              return (
                <React.Fragment>
                  {editMethod?.MethodIndex === d.MethodIndex ? (
                    <div className={styles.inputStripEdit}>
                      <div className={styles.dataDiv}>
                        <p
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.iconDiv
                              : styles.iconDiv
                          }
                        ></p>
                        <p
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.variableNameData
                              : styles.variableNameData
                          }
                        >
                          <input
                            value={editMethod.AppName}
                            disabled={true}
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.variableNameInput
                                : styles.variableNameInput
                            }
                          />
                        </p>
                        <p
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.dataTypeValue
                              : styles.dataTypeValue
                          }
                        >
                          <input
                            value={editMethod.MethodName}
                            disabled={true}
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.variableNameInput
                                : styles.variableNameInput
                            }
                          />
                        </p>
                        <p
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.variableLengthData
                              : styles.variableLengthData
                          }
                        >
                          <Select
                            className={
                              direction === RTL_DIRECTION
                                ? `${arabicStyles.selectInput} selectInput`
                                : `${styles.selectInput} selectInput`
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
                            value={
                              editMethod.ReturnType !== COMPLEX_VARTYPE
                                ? getVariableType(editMethod.ReturnType)
                                : t("Void")
                            }
                            onChange={(e) => {
                              setEditMethod((prev) => {
                                let newData = { ...prev };
                                newData.ReturnType = getTypeByVariable(
                                  e.target.value
                                );
                                return newData;
                              });
                            }}
                          >
                            {RETURN_TYPE_OPTIONS.map((opt) => {
                              return (
                                <MenuItem
                                  className={
                                    direction === RTL_DIRECTION
                                      ? arabicStyles.dropdownData
                                      : styles.dropdownData
                                  }
                                  value={t(getVariableType(opt))}
                                >
                                  {t(getVariableType(opt))}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </p>
                        <p
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.variableLengthData
                              : styles.variableLengthData
                          }
                        >
                          {/*code commented on 21 June 2022 for BugId 111099 */}
                          {/* <span
                            className={styles.paramArray}
                            style={{ textAlign: "left" }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="isGlobal"
                                  checked={
                                    editMethod.MethodType === GLOBAL_SCOPE
                                  }
                                  disabled={true}
                                  color="primary"
                                />
                              }
                              className={
                                direction === RTL_DIRECTION
                                  ? arabicStyles.properties_radioButton
                                  : styles.properties_radioButton
                              }
                              label={t("globalMethod")}
                            />
                          </span> */}
                        </p>
                        <p className={styles.addButtonDiv}></p>
                        <p className={styles.closeIconButtonDiv}>
                          <button
                            className={styles.closeButton}
                            onClick={() => {
                              setEditMethod(null);
                            }}
                            style={{ marginRight: "0.5vw" }}
                          >
                            <CloseIcon className={styles.closeIcon} />
                          </button>
                          <button
                            className={styles.closeButton}
                            onClick={modifyExternalMethod}
                          >
                            <DoneIcon className={styles.closeIcon} />
                          </button>
                        </p>
                      </div>
                      <div className={styles.dataDiv}>
                        {editMethod.Parameter?.length > 0 ? (
                          <div className={styles.paramAddDiv}>
                            <span
                              className={
                                direction === RTL_DIRECTION
                                  ? arabicStyles.paramDefinition
                                  : styles.paramDefinition
                              }
                            >
                              {t("Parameter")} {t("definition")}
                            </span>
                            <span
                              className={styles.addParamBtn}
                              onClick={addParamInEditMethod}
                            >
                              {t("add")}
                            </span>
                          </div>
                        ) : (
                          <span
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.addParametersBtn
                                : styles.addParametersBtn
                            }
                            onClick={addParamInEditMethod}
                          >
                            {t("addDataObject")} {t("Parameters")}
                          </span>
                        )}
                      </div>
                      {editMethod.Parameter?.length > 0 ? (
                        <div
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.paramEditDiv
                              : styles.paramEditDiv
                          }
                        >
                          <div className={styles.paramHeadDiv}>
                            <span className={styles.paramName}>
                              {t("name")}
                            </span>
                            <span
                              className={
                                direction === RTL_DIRECTION
                                  ? arabicStyles.paramType
                                  : styles.paramType
                              }
                            >
                              {t("type")}
                            </span>
                            <span className={styles.paramArray}>
                              {t("array")}
                            </span>
                            <span
                              className={
                                direction === RTL_DIRECTION
                                  ? arabicStyles.paramMoreDiv
                                  : styles.paramMoreDiv
                              }
                            ></span>
                          </div>
                          <div className={styles.paramBodyDiv}>
                            {editMethod.Parameter?.map((param, index) => {
                              return (
                                <div className={styles.paramRow}>
                                  <span className={styles.paramName}>
                                    <input
                                      className={
                                        direction === RTL_DIRECTION
                                          ? arabicStyles.variableNameInput
                                          : styles.variableNameInput
                                      }
                                      name="ParamName"
                                      value={param.ParamName}
                                      onChange={(e) =>
                                        onParamChangeInEditMethod(
                                          index,
                                          e,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </span>
                                  <span
                                    className={
                                      direction === RTL_DIRECTION
                                        ? arabicStyles.paramType
                                        : styles.paramType
                                    }
                                  >
                                    <Select
                                      className={
                                        direction === RTL_DIRECTION
                                          ? `${arabicStyles.selectInput} selectInput`
                                          : `${styles.selectInput} selectInput`
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
                                      name="ParamType"
                                      value={getVariableType(param.ParamType)}
                                      onChange={(e) =>
                                        onParamChangeInEditMethod(
                                          index,
                                          e,
                                          e.target.value
                                        )
                                      }
                                    >
                                      {RETURN_TYPE_OPTIONS.map((opt) => {
                                        return (
                                          <MenuItem
                                            className={
                                              direction === RTL_DIRECTION
                                                ? arabicStyles.dropdownData
                                                : styles.dropdownData
                                            }
                                            value={t(getVariableType(opt))}
                                          >
                                            {t(getVariableType(opt))}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </span>
                                  <span className={styles.paramArray}>
                                    <Checkbox
                                      name="Unbounded"
                                      checked={param.Unbounded === "Y"}
                                      onChange={(e) =>
                                        onParamChangeInEditMethod(
                                          index,
                                          e,
                                          e.target.checked ? "Y" : "N"
                                        )
                                      }
                                      className={
                                        direction === RTL_DIRECTION
                                          ? arabicStyles.properties_radioButton
                                          : styles.properties_radioButton
                                      }
                                      color="primary"
                                    />
                                  </span>
                                  <span
                                    className={
                                      direction === RTL_DIRECTION
                                        ? arabicStyles.paramMoreDiv
                                        : styles.paramMoreDiv
                                    }
                                  >
                                    <button
                                      className={styles.closeButton}
                                      id={`emUD_${d.MethodName}_removeParamInEdit`}
                                      onClick={() =>
                                        removeParamInEditMethod(index)
                                      }
                                    >
                                      <CloseIcon className={styles.closeIcon} />
                                    </button>
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className={styles.dataDiv}>
                      <p
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.iconDiv
                            : styles.iconDiv
                        }
                      >
                        {d.MethodType === GLOBAL_SCOPE ? (
                          <ParamTooltip
                            enterDelay={500}
                            arrow
                            placement="bottom"
                            title={t("globalMethod")}
                          >
                            <PublicIcon className={styles.globalVarIcon} />
                          </ParamTooltip>
                        ) : null}
                      </p>
                      <p
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.variableNameData
                            : styles.variableNameData
                        }
                      >
                        {d.AppName}
                      </p>
                      <p
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.dataTypeValue
                            : styles.dataTypeValue
                        }
                      >
                        {d.MethodName}
                      </p>
                      <p
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.variableLengthData
                            : styles.variableLengthData
                        }
                      >
                        {d.ReturnType.trim() !== ""
                          ? getVariableType(d.ReturnType)
                          : t("Void")}
                      </p>
                      <p
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.variableLengthData
                            : styles.variableLengthData
                        }
                      >
                        {d.Parameter?.length > 0 ? (
                          d.Parameter.length > 1 ? (
                            <ParamTooltip
                              enterDelay={500}
                              arrow
                              placement={
                                direction === RTL_DIRECTION ? "left" : "right"
                              }
                              title={
                                <React.Fragment>
                                  <ParamDivOnHover parameters={d.Parameter} />
                                </React.Fragment>
                              }
                            >
                              <span
                                className={
                                  direction === RTL_DIRECTION
                                    ? arabicStyles.paramCount
                                    : styles.paramCount
                                }
                              >
                                {t("accepts")} {d.Parameter.length}{" "}
                                {t("parameters")}
                              </span>
                            </ParamTooltip>
                          ) : (
                            <ParamTooltip
                              enterDelay={500}
                              arrow
                              placement={
                                direction === RTL_DIRECTION ? "left" : "right"
                              }
                              title={
                                <React.Fragment>
                                  <ParamDivOnHover parameters={d.Parameter} />
                                </React.Fragment>
                              }
                            >
                              <span
                                className={
                                  direction === RTL_DIRECTION
                                    ? arabicStyles.paramCount
                                    : styles.paramCount
                                }
                              >
                                {t("accepts")} 1 {t("parameter")}
                              </span>
                            </ParamTooltip>
                          )
                        ) : null}
                      </p>
                      <p className={styles.addButtonDiv}></p>
                      <p className={styles.closeIconButtonDiv}>
                        <button
                          className={styles.btnIcon}
                          id={`emUD_${d.MethodName}_editBtn`}
                          onClick={() => setEditMethod(d)}
                          style={{ marginRight: "0.5vw" }}
                        >
                          <EditIcon className={styles.closeIcon} />
                        </button>
                        <button
                          className={styles.btnIcon}
                          id={`emUD_${d.MethodName}_deleteBtn`}
                          onClick={() => deleteExternalMethod(d)}
                        >
                          <DeleteOutlinedIcon className={styles.closeIcon} />
                        </button>
                      </p>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps)(UserDefined);
