import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./exception.module.css";
import { Select, MenuItem, Checkbox } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import StarRateIcon from "@material-ui/icons/StarRate";
import AddException from "../../../ViewingArea/Tools/Exception/AddExceptions";
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
  ENDPOINT_ADD_EXCEPTION,
  propertiesLabel,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";

function Exception(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [checkException, setCheckException] = useState(false);
  const [exceptionData, setExceptionData] = useState(
    loadedProcessData.value ? loadedProcessData.value.ExceptionList : []
  );
  const [exceptionItemData, setExceptionItemData] = useState([]);
  const [viewCheckbox, setviewCheckbox] = useState(false);
  const [raiseCheckbox, setraiseCheckbox] = useState(false);
  const [respondCheckbox, setrespondCheckbox] = useState(false);
  const [clearCheckbox, setclearCheckbox] = useState(false);
  const [description, setDescription] = useState("");
  const [expectionListVal, setExpectionListVal] = useState("");
  const [selectedExpItem, setselectedExpItem] = useState(null);
  const [addExpection, setaddException] = useState(false);
  const [editableField, setEditableField] = useState(false);
  const [expData, setExpData] = useState({
    ExceptionGroups: [],
  });
  const [tempExpItem, settempExpItem] = useState(null);

  const CheckExceptionHandler = () => {
    setCheckException(!checkException);
  };

  const definedExpHandler = (e) => {
    setExpectionListVal(e.target.value);
    let selectedDesc = [];
    selectedDesc = exceptionData.filter((val) => {
      if (val.ExceptionName == e.target.value) {
        return val;
      }
    });
    if (selectedDesc.length > 0) {
      setDescription(selectedDesc[0].Description);
    }
    settempExpItem(e.target.value);
  };

  useEffect(() => {
    let tempList = {
      ...localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskExceptions?.exceptionMap,
    };

    Object.keys(tempList).forEach((el) => {
      tempList[el] = { ...tempList[el], editable: false };
    });

    setExceptionItemData(tempList);
    let tempCheck =
      localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskExceptions?.m_bShowExceptions;
    setCheckException(tempCheck);
  }, [localLoadedActivityPropertyData]);

  const descHandler = (e) => {
    setDescription(e.target.value);
  };

  // const deleteHandler = () => {
  //   setExceptionItemData((prev) => {
  //     let temp = [...prev];
  //     temp.splice(selectedExpItem, 1);
  //     return temp;
  //   });
  // };

  // const addHandler = () => {
  //   let alreadyPresent = exceptionItemData[tempExpItem];

  //   if (!alreadyPresent) {
  //     setExceptionItemData((prev) => {
  //       let temp = [...prev];

  //       let selected = [];
  //       selected = exceptionData.filter((val) => {
  //         if (val.ExceptionName == tempExpItem) {
  //           return val;
  //         }
  //       });
  //       if (selected && selected.length > 0) {
  //         if (exceptionItemData) temp.push({ ...selected[0], editable: true });
  //       }
  //       return temp;
  //     });
  //   }
  // };

  const addHandler = () => {
    let alreadyPresent = exceptionItemData[tempExpItem];
    if (!alreadyPresent) {
      let selected = null;
      setExceptionItemData((prev) => {
        let temp = { ...prev };
        expData.ExceptionGroups.forEach((group) => {
          group.ExceptionList.forEach((val) => {
            if (val.ExceptionName == tempExpItem) {
              selected = val;
            }
          });
        });
        if (selected) {
          temp = {
            ...temp,
            [tempExpItem]: {
              editable: true,
              expTypeInfo: {
                expTypeDesc: selected.ExceptionDesc,
                expTypeId: selected.ExceptionId,
                expTypeName: selected.ExceptionName,
              },
              vTrigFlag: viewCheckbox,
              vaTrigFlag: raiseCheckbox,
              vaTrigName: "",
              vcTrigFlag: clearCheckbox,
              vcTrigName: "",
              vrTrigFlag: respondCheckbox,
              vrTrigName: "",
            },
          };
        }
        return temp;
      });

      let tempData = { ...localLoadedActivityPropertyData };

      let tempdataLocal = tempData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskExceptions
        ? { ...tempData?.ActivityProperty?.wdeskInfo?.objPMWdeskExceptions }
        : {};

      if (tempdataLocal?.exceptionMap) {
        tempData.ActivityProperty.wdeskInfo.objPMWdeskExceptions.exceptionMap =
          {
            ...tempdataLocal?.exceptionMap,
            [tempExpItem]: {
              expTypeInfo: {
                expTypeDesc: selected.ExceptionDesc,
                expTypeId: selected.ExceptionId,
                expTypeName: selected.ExceptionName,
              },
              vTrigFlag: viewCheckbox,
              vaTrigFlag: raiseCheckbox,
              vaTrigName: "",
              vcTrigFlag: clearCheckbox,
              vcTrigName: "",
              vrTrigFlag: respondCheckbox,
              vrTrigName: "",
            },
          };
      } else {
        tempData.ActivityProperty.wdeskInfo.objPMWdeskExceptions = {
          exceptionMap: {
            [tempExpItem]: {
              expTypeInfo: {
                expTypeDesc: selected.ExceptionDesc,
                expTypeId: selected.ExceptionId,
                expTypeName: selected.ExceptionName,
              },
              vTrigFlag: viewCheckbox,
              vaTrigFlag: raiseCheckbox,
              vaTrigName: "",
              vcTrigFlag: clearCheckbox,
              vcTrigName: "",
              vrTrigFlag: respondCheckbox,
              vrTrigName: "",
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

    let tempData = { ...localLoadedActivityPropertyData };

    let tempdataLocal =
      tempData?.ActivityProperty?.wdeskInfo?.objPMWdeskTodoLists?.todoMap;

    let td = {};
    Object.keys(tempdataLocal).forEach((el) => {
      if (el != selectedExpItem) {
        td = { ...td, [el]: tempdataLocal[el] };
      }
    });

    tempData.ActivityProperty.wdeskInfo.objPMWdeskTodoLists.todoMap = { ...td };
    setlocalLoadedActivityPropertyData(tempData);

    dispatch(
      setActivityPropertyChange({
        Workdesk: { isModified: true, hasError: false },
      })
    );
  };

  const defineHandler = () => {
    setaddException(true);
  };
  const exceptionItemHandler = (val, index) => {
    setEditableField(exceptionItemData[val].editable);
    setDescription(exceptionItemData[val].expTypeInfo.expTypeDesc);
    setviewCheckbox(exceptionItemData[val].vTrigFlag);
    setclearCheckbox(exceptionItemData[val].vcTrigFlag);
    setrespondCheckbox(exceptionItemData[val].vrTrigFlag);
    setraiseCheckbox(exceptionItemData[val].vaTrigFlag);
  };

  useEffect(() => {
    let activityIdString = "";
    localLoadedProcessData &&
      localLoadedProcessData.MileStones.map((mileStone) => {
        mileStone.Activities.map((activity, index) => {
          activityIdString = activityIdString + activity.ActivityId + ",";
        });
      });
    axios
      .get(
        SERVER_URL +
          `/exception/${props.openProcessID}/${props.openProcessType}/${props.openProcessName}/${activityIdString}`
      )
      .then((res) => {
        if (res.status === 200) {
          let newState = { ...res.data };
          setExpData(newState);
        }
      });
  }, []);

  const addExceptionToList = (
    ExceptionToAdd,
    button_type,
    groupId = "0",
    ExceptionDesc
  ) => {
    if (ExceptionToAdd != "") {
      let maxExceptionId = 0;
      expData.ExceptionGroups.map((group, groupIndex) => {
        group.ExceptionList.map((listElem) => {
          if (listElem.ExceptionId > +maxExceptionId) {
            maxExceptionId = listElem.ExceptionId;
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
            setaddException(false);
          }
        });
    } else if (ExceptionToAdd.trim() == "") {
      alert("Please enter Exception Name");
      document.getElementById("ExceptionNameInput").focus();
    }
    if (button_type != "addAnother") {
      setaddException(false);
    }
    if (button_type == "addAnother") {
      document.getElementById("ExceptionNameInput").value = "";
      document.getElementById("ExceptionNameInput").focus();
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
              className={styles.checkBoxCommon}
            />
            {t("EXCEPTION")}
          </div>

          <div className="row" style={{ marginTop: "1rem" }}>
            <p className={styles.description}>{t("EXCEPTION")}</p>
            <Select
              className="selectDropdown"
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
              style={{
                border: ".1px solid rgba(0, 0, 0, 0.38)",
                width: "9rem",
                height: "1.5rem",
                fontSize: "14px",
                marginLeft: "1rem",
              }}
              disabled={!checkException}
              value={expectionListVal}
              onChange={(e) => definedExpHandler(e)}
            >
              {exceptionData.map((val) => {
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

            <div style={{ marginLeft: "2rem" }}>
              <button
                disabled={!checkException}
                className={styles.addBtn}
                onClick={addHandler}
                data-testid="associateBtn"
              >
                {t("associate")}
              </button>
              <button
                disabled={!checkException}
                className={styles.definebtn}
                onClick={defineHandler}
                data-testid="defineBtn"
              >
                {t("Define")}
              </button>
            </div>
          </div>

          <p className={styles.label}>{t("associatedExp")}</p>

          <div className={styles.expTextarea}>
            <ul>
              {/*exceptionItemData &&
                exceptionItemData.map((val, index) => {
                  return (
                    <li
                      onClick={() => exceptionItemHandler(val, index)}
                      className={
                        selectedExpItem == index ? styles.selectedExp : null
                      }
                    >
                      {val.ExceptionName}
                    </li>
                  );
                })*/}

              {Object.keys(exceptionItemData) &&
                Object.keys(exceptionItemData).map((val) => {
                  return (
                    <li
                      onClick={() => exceptionItemHandler(val)}
                      className={
                        selectedExpItem == val ? styles.selectedExp : null
                      }
                    >
                      {val}
                    </li>
                  );
                })}
            </ul>
          </div>
          <button
            disabled={!checkException}
            className={styles.deleteBtn}
            onClick={deleteHandler}
            data-testid="deAssociateBtn"
          >
            {t("deassociate")}
          </button>
        </div>
        <div style={{ width: "50%" }}>
          <h5>{t("exceptionDetail")}</h5>
          <p className={styles.description}>{t("description")}</p>
          <textarea
            className={styles.descriptionTextarea}
            id="descriptionTextBox"
            onChange={(e) => descHandler(e)}
            disabled={!checkException || (checkException && !editableField)}
            value={description}
          />

          <div className={styles.checklist}>
            <Checkbox
              checked={viewCheckbox}
              // onChange={() => CheckExceptionHandler()}
              className={styles.checkBoxCommon}
              disabled={!checkException || (checkException && !editableField)}
            />
            {t("view")}
            <StarRateIcon
              style={{
                height: "8px",
                width: "8px",
                color: "red",
                marginBottom: "5px",
              }}
            />
          </div>

          <div className="row" style={{ marginTop: ".5rem" }}>
            <Checkbox
              checked={raiseCheckbox}
              // onChange={() => CheckExceptionHandler()}
              className={styles.checkBoxCommon}
              disabled={!checkException || (checkException && !editableField)}
            />
            <span className={styles.checkboxLabel}> {t("raise")}</span>

            <Select
              className="selectDropdown"
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
              style={{
                border: ".1px solid rgba(0, 0, 0, 0.38)",
                width: "9rem",
                height: "1.5rem",
                fontSize: "14px",
                marginLeft: "5rem",
              }}
              disabled={!checkException || (checkException && !editableField)}
            ></Select>
          </div>

          <div className="row" style={{ marginTop: ".5rem" }}>
            <Checkbox
              checked={respondCheckbox}
              // onChange={() => CheckExceptionHandler()}
              className={styles.checkBoxCommon}
              disabled={!checkException || (checkException && !editableField)}
            />
            <span className={styles.checkboxLabel}> {t("respond")}</span>

            <Select
              className="selectDropdown"
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
              style={{
                border: ".1px solid rgba(0, 0, 0, 0.38)",
                width: "9rem",
                height: "1.5rem",
                fontSize: "14px",
                marginLeft: "5rem",
              }}
              disabled={!checkException || (checkException && !editableField)}
            ></Select>
          </div>

          <div className="row" style={{ marginTop: ".5rem" }}>
            <Checkbox
              checked={clearCheckbox}
              // onChange={() => CheckExceptionHandler()}
              className={styles.checkBoxCommon}
              disabled={!checkException || (checkException && !editableField)}
            />
            <span className={styles.checkboxLabel}> {t("clear")}</span>

            <Select
              className="selectDropdown"
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
              style={{
                border: ".1px solid rgba(0, 0, 0, 0.38)",
                width: "9rem",
                height: "1.5rem",
                fontSize: "14px",
                marginLeft: "5rem",
              }}
              disabled={!checkException || (checkException && !editableField)}
            ></Select>
          </div>
        </div>
      </div>
      <Modal open={addExpection} onClose={() => setaddException(false)}>
        <AddException
          handleClose={() => setaddException(false)}
          addExceptionToList={addExceptionToList}
          calledFromWorkdesk={true}
          groups={expData.ExceptionGroups}
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
  };
};

export default connect(mapStateToProps, null)(Exception);
