// #BugID - 109977
// #BugDescription - validation for exception dulicate name has been added.
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./todo.module.css";
import { Select, MenuItem, Checkbox } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import AddException from "../../../ViewingArea/Tools/Exception/AddExceptions";
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
  ENDPOINT_ADD_EXCEPTION,
  PROCESSTYPE_DEPLOYED,
  PROCESSTYPE_REGISTERED,
  propertiesLabel,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import {
  OpenProcessSliceValue,
  setOpenProcess,
} from "../../../../redux-store/slices/OpenProcessSlice";
import "./index.css";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

function Exception(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [checkException, setCheckException] = useState(false);
  const [allExpData, setAllExpData] = useState([]);
  const [exceptionItemData, setExceptionItemData] = useState({});
  const [viewCheckbox, setViewCheckbox] = useState(false);
  const [raiseCheckbox, setRaiseCheckbox] = useState(false);
  const [respondCheckbox, setRespondCheckbox] = useState(false);
  const [clearCheckbox, setClearCheckbox] = useState(false);
  const [raiseName, setRaiseName] = useState("");
  const [respondName, setRespondName] = useState("");
  const [clearName, setClearName] = useState("");
  const [description, setDescription] = useState("");
  const [expectionListVal, setExpectionListVal] = useState("");
  const [selectedExpItem, setSelectedExpItem] = useState(null);
  const [addExpection, setaddException] = useState(false);
  const [editableField, setEditableField] = useState(true);
  const [triggerList, setTriggerList] = useState([]);
  const [expData, setExpData] = useState({
    ExceptionGroups: [],
  });
  const openProcessData = useSelector(OpenProcessSliceValue);
  const [addAnotherExp, setAddAnotherExp] = useState(false);
  const [localState, setLocalState] = useState(null);
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut);

  useEffect(() => {
    let tempList = {
      ...localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskExceptions?.exceptionMap,
    };
    Object.keys(tempList)?.forEach((el) => {
      tempList[el] = { ...tempList[el], editable: false };
    });
    setExceptionItemData(tempList);
    setCheckException(
      localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskExceptions?.m_bShowExceptions
    );
  }, [localLoadedActivityPropertyData]);

  useEffect(() => {
    let activityIdString = "";
    openProcessData.loadedData?.MileStones?.forEach((mileStone) => {
      mileStone.Activities?.forEach((activity) => {
        activityIdString = activityIdString + activity.ActivityId + ",";
      });
    });
    setAllExpData(openProcessData.loadedData?.ExceptionList);
    setLocalState(openProcessData.loadedData);
    axios
      .get(
        SERVER_URL +
          `/exception/${props.openProcessID}/${props.openProcessType}/${props.openProcessName}/${activityIdString}`
      )
      .then((res) => {
        if (res.status === 200) {
          let newState = { ...res.data };
          setExpData(newState);
          setTriggerList(newState.Trigger);
        }
      });
  }, [openProcessData.loadedData]);

  /*****************************************************************************************
   * @author asloob_ali BUG ID : 114885  Exception: description of the associated Exception in activity is not displayed
   * Reason: property name key mismatched.
   *  Resolution :updated key correctly.
   *  Date : 05/10/2022             **************/

  const CheckExceptionHandler = () => {
    let val;
    setCheckException((prev) => {
      val = !prev;
      return !prev;
    });
    let temp = { ...localLoadedActivityPropertyData };
    if (temp?.ActivityProperty?.wdeskInfo) {
      if (temp?.ActivityProperty?.wdeskInfo?.objPMWdeskExceptions) {
        let valTemp =
          temp?.ActivityProperty?.wdeskInfo?.objPMWdeskExceptions
            ?.m_bShowExceptions;
        if (valTemp === false || valTemp === true) {
          temp.ActivityProperty.wdeskInfo.objPMWdeskExceptions.m_bShowExceptions =
            val;
        } else {
          temp.ActivityProperty.wdeskInfo.objPMWdeskExceptions = {
            ...temp.ActivityProperty.wdeskInfo.objPMWdeskExceptions,
            m_bShowExceptions: val,
          };
        }
      } else {
        temp.ActivityProperty.wdeskInfo = {
          ...temp.ActivityProperty.wdeskInfo,
          objPMWdeskExceptions: {
            m_bShowExceptions: val,
          },
        };
      }
    } else {
      temp.ActivityProperty = {
        ...temp.ActivityProperty,
        wdeskInfo: {
          objPMWdeskExceptions: {
            m_bShowExceptions: val,
          },
        },
      };
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
  };

  const definedExpHandler = (e) => {
    setExpectionListVal(e.target.value);
    setEditableField(true);

    let alreadyPresent = exceptionItemData[e.target.value] ? true : false;
    if (alreadyPresent) {
      exceptionItemHandler(e.target.value);
    } else {
      let selectedExp = null;
      expData?.ExceptionGroups?.forEach((group) => {
        group?.ExceptionList?.forEach((val) => {
          if (val.ExceptionName === e.target.value) {
            selectedExp = val;
          }
        });
      });
      if (selectedExp) {
        setDescription(selectedExp.Description);
        let selectedAct = null;
        selectedExp?.Activities?.forEach((act) => {
          if (
            +act.ActivityId ===
            +localLoadedActivityPropertyData?.ActivityProperty?.actId
          ) {
            selectedAct = act;
          }
        });
        if (selectedAct) {
          setViewCheckbox(selectedAct.View);
          setRaiseCheckbox(selectedAct.Raise);
          setRespondCheckbox(selectedAct.Respond);
          setClearCheckbox(selectedAct.Clear);
          setRaiseName("");
          setRespondName("");
          setClearName("");
        }
      } else {
        setDescription("");
        setViewCheckbox(false);
        setRaiseCheckbox(false);
        setRespondCheckbox(false);
        setClearCheckbox(false);
        setEditableField(false);
        setRaiseName("");
        setRespondName("");
        setClearName("");
      }
      setSelectedExpItem(null);
    }
  };

  const descHandler = (e) => {
    setDescription(e.target.value);
  };

  const addHandler = () => {
    let alreadyPresent = exceptionItemData[expectionListVal] ? true : false;
    if (!alreadyPresent || alreadyPresent === undefined) {
      if (viewCheckbox) {
        let selected = null;
        setExceptionItemData((prev) => {
          let temp = { ...prev };
          expData?.ExceptionGroups?.forEach((group) => {
            group?.ExceptionList?.forEach((val) => {
              if (val.ExceptionName === expectionListVal) {
                selected = val;
              }
            });
          });
          if (selected) {
            temp = {
              ...temp,
              [expectionListVal]: {
                editable: true,
                expTypeInfo: {
                  expTypeDesc: selected.Description,
                  expTypeId: selected.ExceptionId,
                  expTypeName: selected.ExceptionName,
                },
                vTrigFlag: viewCheckbox,
                vrTrigFlag: raiseCheckbox,
                vrTrigName: raiseName,
                vcTrigFlag: clearCheckbox,
                vcTrigName: clearName,
                vaTrigFlag: respondCheckbox,
                vaTrigName: respondName,
              },
            };
          }
          return temp;
        });
        let tempData = { ...localLoadedActivityPropertyData };
        let tempdataLocal = tempData?.ActivityProperty?.wdeskInfo
          ?.objPMWdeskExceptions
          ? { ...tempData.ActivityProperty.wdeskInfo.objPMWdeskExceptions }
          : {};
        if (tempdataLocal?.exceptionMap) {
          tempData.ActivityProperty.wdeskInfo.objPMWdeskExceptions.exceptionMap =
            {
              ...tempdataLocal?.exceptionMap,
              [expectionListVal]: {
                expTypeInfo: {
                  expTypeDesc: selected.Description,
                  expTypeId: selected.ExceptionId,
                  expTypeName: selected.ExceptionName,
                },
                vTrigFlag: viewCheckbox,
                vrTrigFlag: raiseCheckbox,
                vrTrigName: raiseName,
                vcTrigFlag: clearCheckbox,
                vcTrigName: clearName,
                vaTrigFlag: respondCheckbox,
                vaTrigName: respondName,
              },
            };
        } else {
          tempData.ActivityProperty.wdeskInfo.objPMWdeskExceptions = {
            ...tempData.ActivityProperty.wdeskInfo.objPMWdeskExceptions,
            exceptionMap: {
              [expectionListVal]: {
                expTypeInfo: {
                  expTypeDesc: selected.Description,
                  expTypeId: selected.ExceptionId,
                  expTypeName: selected.ExceptionName,
                },
                vTrigFlag: viewCheckbox,
                vrTrigFlag: raiseCheckbox,
                vrTrigName: raiseName,
                vcTrigFlag: clearCheckbox,
                vcTrigName: clearName,
                vaTrigFlag: respondCheckbox,
                vaTrigName: respondName,
              },
            },
          };
        }
        setlocalLoadedActivityPropertyData(tempData);
        dispatch(
          setActivityPropertyChange({
            [propertiesLabel.workdesk]: { isModified: true, hasError: false },
          })
        );
      } else {
        dispatch(
          setToastDataFunc({
            message: t("associateRightsErr"),
            severity: "error",
            open: true,
          })
        );
      }
    } else {
      dispatch(
        setToastDataFunc({
          message: t("SelectedExpAlreadyAssociated"),
          severity: "error",
          open: true,
        })
      );
    }
  };

  const deleteHandler = () => {
    let temp = {};
    Object.keys(exceptionItemData).forEach((el) => {
      if (el != selectedExpItem) {
        temp = { ...temp, [el]: exceptionItemData[el] };
      }
    });
    setExceptionItemData(temp);
    setDescription("");
    setViewCheckbox(false);
    setRaiseCheckbox(false);
    setRespondCheckbox(false);
    setClearCheckbox(false);
    setEditableField(false);
    setRaiseName("");
    setRespondName("");
    setClearName("");
    let tempData = { ...localLoadedActivityPropertyData };
    let tempdataLocal =
      tempData?.ActivityProperty?.wdeskInfo?.objPMWdeskExceptions?.exceptionMap;
    let td = {};
    Object.keys(tempdataLocal)?.forEach((el) => {
      if (el != selectedExpItem) {
        td = { ...td, [el]: tempdataLocal[el] };
      }
    });
    tempData.ActivityProperty.wdeskInfo.objPMWdeskExceptions.exceptionMap = {
      ...td,
    };
    setlocalLoadedActivityPropertyData(tempData);
    setSelectedExpItem(null);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
  };

  const defineHandler = () => {
    setaddException(true);
  };

  const exceptionItemHandler = (val) => {
    setSelectedExpItem(val);
    setEditableField(false);
    setDescription(exceptionItemData[val].expTypeInfo.expTypeDesc);
    setViewCheckbox(exceptionItemData[val].vTrigFlag);
    setClearCheckbox(exceptionItemData[val].vcTrigFlag);
    setRespondCheckbox(exceptionItemData[val].vaTrigFlag);
    setRaiseCheckbox(exceptionItemData[val].vrTrigFlag);
    setRaiseName(exceptionItemData[val].vrTrigName);
    setRespondName(exceptionItemData[val].vaTrigName);
    setClearName(exceptionItemData[val].vcTrigName);
  };

  const addExceptionToList = (
    ExceptionToAdd,
    button_type,
    groupId, // code edited on 7 Sep 2022 for BugId 114884
    ExceptionDesc
  ) => {
    let exist = false;
    expData?.ExceptionGroups.map((group) => {
      group.ExceptionList.map((exception) => {
        if (
          exception.ExceptionName.trim().toLowerCase() ===
          ExceptionToAdd.trim().toLowerCase()
        ) {
          exist = true;
        }
      });
    });
    if (exist) {
      dispatch(
        setToastDataFunc({
          message: t("excepAlreadyExists"),
          severity: "error",
          open: true,
        })
      );
      return;
    } else {
      // code edited on 7 Sep 2022 for BugId 114884
      if (
        ExceptionToAdd?.trim() !== "" &&
        groupId &&
        ExceptionDesc?.trim() !== ""
      ) {
        let maxExceptionId = 0;
        expData.ExceptionGroups.map((group) => {
          group.ExceptionList.map((listElem) => {
            if (+listElem.ExceptionId > +maxExceptionId) {
              maxExceptionId = +listElem.ExceptionId;
            }
          });
        });
        axios
          .post(SERVER_URL + ENDPOINT_ADD_EXCEPTION, {
            groupId: groupId,
            expTypeId: +maxExceptionId + 1,
            expTypeName: ExceptionToAdd,
            expTypeDesc: ExceptionDesc,
            processDefId: props.openProcessID,
          })
          .then((res) => {
            if (res.data.Status == 0) {
              let temp = JSON.parse(JSON.stringify(localState));
              temp.ExceptionList.push({
                Description: ExceptionDesc,
                ExceptionId: +maxExceptionId + 1,
                ExceptionName: ExceptionToAdd,
              });
              dispatch(setOpenProcess({ loadedData: temp }));
              let tempData = { ...expData };
              tempData.ExceptionGroups.map((group) => {
                if (group.GroupId == groupId) {
                  group.ExceptionList.push({
                    ExceptionId: maxExceptionId + 1,
                    ExceptionName: ExceptionToAdd,
                    Description: ExceptionDesc,
                    Activities: [],
                    SetAllChecks: {
                      Clear: false,
                      Raise: false,
                      Respond: false,
                      View: false,
                    },
                  });
                }
              });
              setExpData(tempData);
              if (button_type !== "addAnother") {
                setaddException(false);
                setAddAnotherExp(false);
              } else if (button_type === "addAnother") {
                setAddAnotherExp(true);
              }
            }
          });
      }
      // code edited on 7 Sep 2022 for BugId 114884
      else if (
        ExceptionToAdd?.trim() === "" ||
        !groupId ||
        ExceptionDesc?.trim() === ""
      ) {
        dispatch(
          setToastDataFunc({
            message: t("mandatoryErr"),
            severity: "error",
            open: true,
          })
        );
        setAddAnotherExp(false);
      }
    }
  };

  return (
    <React.Fragment>
      <div className={styles.flexRow}>
        <div style={{ width: "50%" }}>
          <div className={styles.checklist}>
            <Checkbox
              checked={checkException}
              onChange={() => CheckExceptionHandler()}
              className={styles.mainCheckbox}
              data-testid="CheckExp"
              disabled={isReadOnly}
              type="checkbox"
            />
            {t("EXCEPTION")}
          </div>
          <div className="row" style={{ alignItems: "end" }}>
            <div style={{ flex: "1" }}>
              <p className={styles.description}>{t("EXCEPTION")}</p>
              <Select
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
                id="Dropdown"
                className={styles.todoSelect}
                disabled={!checkException || isReadOnly}
                value={expectionListVal}
                onChange={(e) => definedExpHandler(e)}
              >
                <MenuItem className={styles.menuItemStyles} value={""}>
                  {""}
                </MenuItem>
                {allExpData?.map((val) => {
                  return (
                    <MenuItem
                      className={styles.menuItemStyles}
                      key={val.ExceptionName}
                      value={val.ExceptionName}
                    >
                      {val.ExceptionName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            <div style={{ flex: "1", marginLeft: "2rem" }}>
              <button
                disabled={
                  !checkException ||
                  (checkException && expectionListVal.trim() === "") ||
                  (checkException && selectedExpItem) ||
                  isReadOnly
                }
                className={
                  !checkException ||
                  (checkException && expectionListVal.trim() === "") ||
                  (checkException && selectedExpItem) ||
                  isReadOnly
                    ? styles.disabledBtn
                    : styles.addBtn
                }
                onClick={addHandler}
                data-testid="associateBtn"
              >
                {t("associate")}
              </button>
              <button
                disabled={
                  !checkException ||
                  props.openProcessType === PROCESSTYPE_DEPLOYED ||
                  props.openProcessType === PROCESSTYPE_REGISTERED
                }
                className={
                  !checkException ||
                  props.openProcessType === PROCESSTYPE_DEPLOYED ||
                  props.openProcessType === PROCESSTYPE_REGISTERED
                    ? styles.disabledBtn
                    : styles.addBtn
                }
                onClick={defineHandler}
                data-testid="defineBtn"
              >
                {t("Define")}
              </button>
            </div>
          </div>
          <p className={styles.todoItem}>{t("associatedExp")}</p>
          <div className={styles.todoTextarea}>
            <ul>
              {Object.keys(exceptionItemData)?.map((val) => {
                return (
                  <li
                    onClick={() => exceptionItemHandler(val)}
                    className={
                      selectedExpItem == val
                        ? styles.selectedTodo
                        : styles.todoListItem
                    }
                  >
                    {val}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles.deassociateDiv}>
            <button
              disabled={
                !checkException ||
                (checkException && !selectedExpItem) ||
                isReadOnly
              }
              className={
                !checkException ||
                (checkException && !selectedExpItem) ||
                isReadOnly
                  ? styles.disabledBtn
                  : styles.deleteBtn
              }
              onClick={deleteHandler}
              data-testid="deAssociateBtn"
            >
              {t("deassociate")}
            </button>
          </div>
        </div>
        <div style={{ width: "50%" }}>
          <p className={styles.todoItemDetails}>{t("exceptionDetail")}</p>
          <p className={styles.description}>{t("description")}</p>
          <textarea
            className={styles.descriptionTextarea}
            id="descriptionTextBox"
            onChange={(e) => descHandler(e)}
            disabled={true}
            value={description}
          />
          <div className="row expCheckList" style={{ width: "80%" }}>
            <Checkbox
              checked={viewCheckbox}
              onChange={(e) => setViewCheckbox(e.target.checked)}
              className={styles.mainCheckbox}
              disabled={
                !checkException ||
                (checkException &&
                  expectionListVal.trim() === "" &&
                  editableField) ||
                (checkException && !editableField)
              }
            />
            <span className={styles.checkboxLabel}>
              {t("view")}
              <span className={styles.starIcon}>*</span>
            </span>
          </div>
          <div className="row expCheckList" style={{ width: "80%" }}>
            <div style={{ flex: "1" }}>
              <Checkbox
                checked={raiseCheckbox}
                onChange={(e) => setRaiseCheckbox(e.target.checked)}
                className={styles.mainCheckbox}
                disabled={
                  !checkException ||
                  (checkException && !viewCheckbox && editableField) ||
                  (checkException && !editableField)
                }
              />
              <span className={styles.checkboxLabel}>{t("raise")}</span>
            </div>
            <div style={{ flex: "2" }}>
              <Select
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
                id="Dropdown"
                style={{ width: "70%" }}
                className={styles.todoSelect}
                value={raiseName}
                onChange={(e) => {
                  setRaiseName(e.target.value);
                }}
                disabled={
                  !checkException ||
                  (checkException && !raiseCheckbox && editableField) ||
                  (checkException && !editableField)
                }
              >
                <MenuItem className={styles.menuItemStyles} value={""}>
                  {""}
                </MenuItem>
                {triggerList?.map((val) => {
                  return (
                    <MenuItem
                      className={styles.menuItemStyles}
                      key={val.TriggerName}
                      value={val.TriggerName}
                    >
                      {val.TriggerName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
          <div className="row expCheckList" style={{ width: "80%" }}>
            <div style={{ flex: "1" }}>
              <Checkbox
                checked={respondCheckbox}
                onChange={(e) => setRespondCheckbox(e.target.checked)}
                className={styles.mainCheckbox}
                disabled={
                  !checkException ||
                  (checkException && !viewCheckbox && editableField) ||
                  (checkException && !editableField)
                }
              />
              <span className={styles.checkboxLabel}>{t("respond")}</span>
            </div>
            <div style={{ flex: "2" }}>
              <Select
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
                id="Dropdown"
                style={{ width: "70%" }}
                className={styles.todoSelect}
                value={respondName}
                onChange={(e) => {
                  setRespondName(e.target.value);
                }}
                disabled={
                  !checkException ||
                  (checkException && !respondCheckbox && editableField) ||
                  (checkException && !editableField)
                }
              >
                <MenuItem className={styles.menuItemStyles} value={""}>
                  {""}
                </MenuItem>
                {triggerList?.map((val) => {
                  return (
                    <MenuItem
                      className={styles.menuItemStyles}
                      key={val.TriggerName}
                      value={val.TriggerName}
                    >
                      {val.TriggerName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
          <div className="row expCheckList" style={{ width: "80%" }}>
            <div style={{ flex: "1" }}>
              <Checkbox
                checked={clearCheckbox}
                onChange={(e) => setClearCheckbox(e.target.checked)}
                className={styles.mainCheckbox}
                disabled={
                  !checkException ||
                  (checkException && !viewCheckbox && editableField) ||
                  (checkException && !editableField)
                }
              />
              <span className={styles.checkboxLabel}>{t("clear")}</span>
            </div>
            <div style={{ flex: "2" }}>
              <Select
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
                id="Dropdown"
                style={{ width: "70%" }}
                className={styles.todoSelect}
                value={clearName}
                onChange={(e) => {
                  setClearName(e.target.value);
                }}
                disabled={
                  !checkException ||
                  (checkException && !clearCheckbox && editableField) ||
                  (checkException && !editableField)
                }
              >
                <MenuItem className={styles.menuItemStyles} value={""}>
                  {""}
                </MenuItem>
                {triggerList?.map((val) => {
                  return (
                    <MenuItem
                      className={styles.menuItemStyles}
                      key={val.TriggerName}
                      value={val.TriggerName}
                    >
                      {val.TriggerName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
        </div>
      </div>
      <Modal open={addExpection}>
        <AddException
          handleClose={() => setaddException(false)}
          addExceptionToList={addExceptionToList}
          calledFromWorkdesk={true}
          groups={expData.ExceptionGroups}
          addAnotherExp={addAnotherExp}
          setAddAnotherExp={setAddAnotherExp}
        />
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
  };
};

export default connect(mapStateToProps, null)(Exception);
