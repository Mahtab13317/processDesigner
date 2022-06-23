import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TreeView from "../../../UI/TreeView";
import SearchComponent from "../../../UI/Search Component/index";
import MenuIcon from "@material-ui/icons/Menu";
import BarChartIcon from "@material-ui/icons/BarChart";
import StopIcon from "@material-ui/icons/Stop";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyle.module.css";
import {
  ADD_OPTION,
  EDIT_OPTION,
  ENDPOINT_ADD_COMPLEX,
  ENDPOINT_DELETE_COMPLEX,
  ENDPOINT_EDIT_COMPLEX,
  RTL_DIRECTION,
  SERVER_URL,
  STATE_ADDED,
  STATE_CREATED,
  STATE_EDITED,
  UD_GRAPH_VIEW,
  UD_LIST_VIEW,
} from "../../../Constants/appConstants";
import axios from "axios";
import { connect } from "react-redux";
import UserDefinedListView from "./UserDefinedListView";
import Modal from "../../../UI/Modal/Modal.js";
import { Button } from "@material-ui/core";
import DataObjExtensionList from "./DataObjExtensionList";
import NoSelectedScreen from "./NoSelectedScreen";
import NoDataObjScreen from "./NoDataObjScreen";
import CircularProgress from "@material-ui/core/CircularProgress";
import { store, useGlobalState } from "state-pool";

function UserDefinedDataTypes(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [dataObject, setDataObject] = useState({});
  const [objectName, setObjectName] = useState(null);
  const [objectList, setObjectList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bShowInput, setShowInput] = useState(false);
  const [isObjEdited, setIsObjEdited] = useState(false);
  const [view, setView] = useState(UD_LIST_VIEW);
  const [bExtensionBtnClicked, setExtensionBtnClicked] = useState(false);
  const [extendedDataObj, setExtendedDataObj] = useState(null);
  const [spinner, setspinner] = useState(true);
  let { dataTypesList, setDataTypesList } = props;

  useEffect(() => {
    if (localLoadedProcessData?.ComplexVarDefinition) {
      setDataTypesList(localLoadedProcessData.ComplexVarDefinition);
    }
    setspinner(false);
  }, []);

  useEffect(() => {
    props.setUserDefinedCount(dataTypesList?.length);
  }, [dataTypesList]);

  useEffect(() => {
    if (selectedItem) {
      if (selectedItem.status === STATE_CREATED && !objectName) {
        //if new temporary dataObject is created, set focus on name Input field and clear the values in name Input and member list state
        const input = document.getElementById("dataObjectName");
        input.select();
        input.focus();
      }
    }
  }, [selectedItem]);

  //if some changes have occurred in definition part of data object, which has been added to database, then status of item is changed from added to edited
  useEffect(() => {
    if (isObjEdited) {
      if (selectedItem) {
        setSelectedItem((prev) => {
          return { ...prev, status: STATE_EDITED };
        });
      }
    }
  }, [isObjEdited]);

  const createNewDataObject = () => {
    let indexVal = null;
    let newData = [...dataTypesList];
    //to remove existing temporary dataObjects from list, before adding new temporary dataObject
    newData?.forEach((dataType, index) => {
      if (dataType.status && dataType.status === STATE_CREATED) {
        indexVal = index;
      }
    });
    if (indexVal !== null) {
      newData.splice(indexVal, 1);
    }
    setDataTypesList(newData);
    //calculate maxId of dataObject in dataTypeList
    let maxId = 0;
    newData?.forEach((dataType) => {
      if (dataType.TypeId > maxId) {
        maxId = dataType.TypeId;
      }
    });
    let newId = +maxId + 1;
    //push temporary dataObject in dataTypeList
    setDataTypesList((prev) => {
      let localData = [];
      if (prev.length > 0) {
        localData = [...prev];
      }
      localData.push({
        TypeId: newId,
        TypeName: `${"New"} ${t("dataType")}`,
        ExtensionTypeId: "-1",
        VarField: [],
        status: STATE_CREATED,
      });
      return localData;
    });
    //set temporary dataObject as selected field
    setSelectedItem({
      TypeId: newId,
      TypeName: `${"New"} ${t("dataType")}`,
      ExtensionTypeId: "-1",
      VarField: [],
      status: STATE_CREATED,
    });
    setDataObject({
      dataObjectName: `${"New"} ${t("dataType")}`,
      dataObjectList: [],
      extendedObj: null,
    });
    setExtendedDataObj(null);
    setObjectName(null);
    setObjectList([]);
    setShowInput(true);
  };

  //on field selection, set selected field with existing status and if status is not present, then added status is applied.
  const onFieldSelection = (data) => {
    if (data.status === STATE_CREATED) {
      setShowInput(true);
      let newData = [...objectList];
      extendedDataObj?.VarField?.forEach((val) => {
        newData.push({ ...val, inherited: true });
      });
      setDataObject({
        dataObjectName: objectName ? objectName : `${"New"} ${t("dataType")}`,
        dataObjectList: newData,
        extendedObj: extendedDataObj,
      });
    } else {
      let dataType = null;
      let newData = [...data.VarField];
      if (+data.ExtensionTypeId !== -1) {
        dataType = dataTypesList?.filter(
          (el) => +el.TypeId === +data.ExtensionTypeId
        )[0];
        dataType?.VarField?.forEach((val) => {
          newData.push({ ...val, inherited: true });
        });
      }
      setShowInput(false);
      setDataObject({
        dataObjectName: data.TypeName,
        dataObjectList: newData,
        extendedObj: dataType,
      });
    }
    setSelectedItem({
      ...data,
      status: data.status ? data.status : STATE_ADDED,
    });
  };

  const validateFunc = () => {
    //function to check whether all required fields are filled or not
    if (
      dataObject.dataObjectName.trim() === "" ||
      dataObject.dataObjectName === `${"New"} ${t("dataType")}`
    ) {
      alert("Please fill all mandatory fields");
      const input = document.getElementById("dataObjectName");
      input.select();
      input.focus();
    } else {
      return 1;
    }
  };

  // to add or modify dataObject in database using api
  const addModifyDataObjFunc = (type) => {
    let validateVal = validateFunc();
    if (validateVal === 1) {
      let dataObjectVarList = [];
      if (type === ADD_OPTION) {
        dataObjectVarList = dataObject.dataObjectList
          ?.filter((ele) => !ele.inherited)
          .map((el) => {
            return {
              variableId: el.TypeFieldId,
              varName: el.FieldName,
              type: el.WFType,
              varTypeId: el.TypeId,
              unbounded: el.Unbounded,
            };
          });
      } else if (type === EDIT_OPTION) {
        dataObjectVarList = dataObject.dataObjectList
          ?.filter((ele) => !ele.inherited)
          .map((el) => {
            return {
              variableId: el.TypeFieldId,
              varName: el.FieldName,
              type: el.WFType,
              varTypeId: el.TypeId,
              unbounded: el.Unbounded,
              added: el.added ? el.added : false,
              deleted: el.deleted ? el.deleted : false,
              modified: el.modified ? el.modified : false,
            };
          });
      }
      const jsonBody = {
        m_strProcessDefId: props.openProcessID,
        typeName: dataObject.dataObjectName,
        typeId: selectedItem.TypeId,
        extTypeId: dataObject.extendedObj
          ? dataObject.extendedObj.TypeId
          : selectedItem.ExtensionTypeId,
        pMvarDefInfos: dataObjectVarList,
      };
      axios
        .post(
          SERVER_URL +
            (type === ADD_OPTION
              ? ENDPOINT_ADD_COMPLEX
              : ENDPOINT_EDIT_COMPLEX),
          jsonBody
        )
        .then((res) => {
          if (res.data.Status === 0) {
            setSelectedItem((prev) => {
              let newData = { ...prev };
              newData.TypeName = dataObject.dataObjectName;
              newData.VarField = dataObject.dataObjectList;
              newData.status = STATE_ADDED;
              return newData;
            });
            setDataTypesList((prev) => {
              let newData = [...prev];
              newData.forEach((data) => {
                if (data.TypeId === selectedItem.TypeId) {
                  data.TypeName = dataObject.dataObjectName;
                  data.VarField = dataObject.dataObjectList;
                  data.status = STATE_ADDED;
                }
              });
              return newData;
            });
            if (type === EDIT_OPTION) {
              //setIsObjEdited to false when dataObj is modified
              let newData = { ...localLoadedProcessData };
              newData?.ComplexVarDefinition?.forEach((dataType) => {
                if (dataType.TypeId === selectedItem.TypeId) {
                  dataType.TypeName = dataObject.dataObjectName;
                  dataType.VarField = dataObject.dataObjectList;
                }
              });
              setlocalLoadedProcessData(newData);
              setIsObjEdited(false);
            } else if (type === ADD_OPTION) {
              let newData = { ...localLoadedProcessData };
              newData?.ComplexVarDefinition?.push({
                TypeId: selectedItem.TypeId,
                TypeName: dataObject.dataObjectName,
                ExtensionTypeId: dataObject.extendedObj
                  ? dataObject.extendedObj.TypeId
                  : selectedItem.ExtensionTypeId,
                VarField: dataObject.dataObjectList,
              });
              setlocalLoadedProcessData(newData);
            }
          }
        });
    }
  };

  //function to cancel the changes made to the dataObject and reset it to its initial values
  const cancelEditDataObjFunc = () => {
    setIsObjEdited(false);
    dataTypesList.forEach((dataType) => {
      if (dataType.TypeId === selectedItem.TypeId) {
        onFieldSelection(dataType);
      }
    });
  };

  //function to delete the temporary dataObject
  const cancelAddDataObjectFunc = () => {
    let indexVal;
    let newData = [...dataTypesList];
    newData.forEach((dataType, index) => {
      if (dataType.TypeId === selectedItem.TypeId) {
        indexVal = index;
      }
    });
    newData.splice(indexVal, 1);
    setDataTypesList(newData);
    setSelectedItem(null);
    setDataObject({});
  };

  // api call to delete dataObject
  const deleteDataObjectFunc = () => {
    let jsonBody = {
      m_strProcessDefId: props.openProcessID,
      typeName: selectedItem.TypeName,
      typeId: selectedItem.TypeId,
      extTypeId: selectedItem.ExtensionTypeId,
    };
    axios.post(SERVER_URL + ENDPOINT_DELETE_COMPLEX, jsonBody).then((res) => {
      if (res.data.Status === 0) {
        let indexVal;
        let newData = { ...localLoadedProcessData };
        newData.ComplexVarDefinition?.forEach((dataType, idx) => {
          if (dataType.TypeId === selectedItem.TypeId) {
            indexVal = idx;
          }
        });
        newData.ComplexVarDefinition.splice(indexVal, 1);
        setlocalLoadedProcessData(newData);
        cancelAddDataObjectFunc();
      }
    });
  };

  return spinner ? (
    <CircularProgress
      style={
        direction === RTL_DIRECTION
          ? { marginTop: "40vh", marginRight: "50%" }
          : { marginTop: "40vh", marginLeft: "50%" }
      }
    />
  ) : (
    <div className={`${styles.userDefinedMainDiv} flex`}>
      {dataTypesList?.length > 0 ? (
        <React.Fragment>
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.userDefinedListView
                : styles.userDefinedListView
            }
          >
            <div className={`flex ${styles.userDefinedSearchDiv}`}>
              <SearchComponent
                width="76%"
                name="search"
                placeholder={t("search")}
                id="user_defined_search"
              />
              <button
                className={styles.addNewBtn}
                id="ud_side_new_btn"
                onClick={createNewDataObject}
              >
                {"+ "} {t("New")}
              </button>
            </div>
            <div className={styles.userDefinedList}>
              {dataTypesList?.map((data) => {
                return (
                  <p
                    onClick={() => {
                      onFieldSelection(data);
                    }}
                    className={
                      selectedItem?.TypeId === data.TypeId
                        ? `${
                            direction === RTL_DIRECTION
                              ? arabicStyles.userDefinedListItem
                              : styles.userDefinedListItem
                          } ${styles.selectedUdListRow}`
                        : direction === RTL_DIRECTION
                        ? arabicStyles.userDefinedListItem
                        : styles.userDefinedListItem
                    }
                  >
                    <StopIcon
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.FlashOnIcon
                          : styles.FlashOnIcon
                      }
                    />
                    {data.TypeName}
                  </p>
                );
              })}
            </div>
          </div>
          <div className={styles.userDefinedDetailedView}>
            {selectedItem ? (
              <React.Fragment>
                <div className={styles.uDNameViewDiv}>
                  <React.Fragment>
                    <div className={styles.name_udDiv}>
                      {selectedItem.status === STATE_CREATED ? (
                        <input
                          className={styles.nameInput}
                          name="dataObjectName"
                          id="dataObjectName"
                          value={dataObject.dataObjectName}
                          onChange={(e) => {
                            setDataObject((prev) => {
                              return {
                                ...prev,
                                dataObjectName: e.target.value,
                              };
                            });
                            setObjectName(e.target.value);
                          }}
                        />
                      ) : (
                        <p
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.udSelectedItemName
                              : styles.udSelectedItemName
                          }
                        >
                          {selectedItem.TypeName}
                        </p>
                      )}
                      <span className={styles.extensionStmt}>
                        {dataObject.extendedObj
                          ? `( ${t("AnExtensionOf")} ${
                              dataObject.extendedObj.TypeName
                            })`
                          : null}
                      </span>
                    </div>
                  </React.Fragment>
                  <div className="flex">
                    <button
                      onClick={() => setView(UD_LIST_VIEW)}
                      className={
                        view === UD_LIST_VIEW
                          ? styles.selectedListViewBtn
                          : styles.listViewBtn
                      }
                      title={t("listView")}
                    >
                      <MenuIcon
                        fontSize="small"
                        style={
                          view === UD_LIST_VIEW
                            ? { color: "black" }
                            : { color: "#C4C4C4" }
                        }
                      />
                    </button>
                    <button
                      onClick={() => setView(UD_GRAPH_VIEW)}
                      className={
                        view === UD_GRAPH_VIEW
                          ? styles.selectedListViewBtn
                          : styles.listViewBtn
                      }
                      title={t("graphView")}
                    >
                      <BarChartIcon
                        fontSize="small"
                        style={
                          view === UD_GRAPH_VIEW
                            ? { color: "black" }
                            : { color: "#C4C4C4" }
                        }
                      />
                    </button>

                    {selectedItem.status === STATE_CREATED ? (
                      <div>
                        <Button
                          onClick={cancelAddDataObjectFunc}
                          className={styles.cancelDataTypeBtn}
                          id="ud_dt_cancel_btn"
                        >
                          {t("cancel")}
                        </Button>
                        <Button
                          onClick={() => addModifyDataObjFunc(ADD_OPTION)}
                          className={styles.addDataTypeBtn}
                          id="ud_dt_add_btn"
                        >
                          {t("Create")} {t("dataType")}
                        </Button>
                      </div>
                    ) : selectedItem.status === STATE_EDITED ? (
                      <div>
                        <Button
                          onClick={cancelEditDataObjFunc}
                          className={styles.cancelDataTypeBtn}
                          id="ud_dt_editing_cancel_btn"
                        >
                          {t("cancel")}
                        </Button>
                        <Button
                          onClick={() => addModifyDataObjFunc(EDIT_OPTION)}
                          className={styles.addDataTypeBtn}
                          id="ud_dt_edit_btn"
                        >
                          {t("save")} {t("changes")}
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          onClick={deleteDataObjectFunc}
                          className={styles.cancelDataTypeBtn}
                          id="ud_dt_delete_btn"
                        >
                          {t("delete")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {view === UD_LIST_VIEW ? (
                  <UserDefinedListView
                    selectedItem={selectedItem}
                    processDefId={props.openProcessID}
                    bShowInput={bShowInput}
                    setShowInput={setShowInput}
                    setDataObject={setDataObject}
                    setObjectList={setObjectList}
                    dataObject={dataObject}
                    setIsObjEdited={setIsObjEdited}
                    setExtensionBtnClicked={setExtensionBtnClicked}
                    dataTypesList={dataTypesList}
                  />
                ) : (
                  <div className={styles.graphicalView}>
                    <TreeView
                      item={{
                        ...selectedItem,
                        VarField: dataObject.dataObjectList,
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ) : (
              <NoSelectedScreen />
            )}
          </div>
        </React.Fragment>
      ) : (
        <NoDataObjScreen
          setDataTypesList={setDataTypesList}
          setSelectedItem={setSelectedItem}
          setDataObject={setDataObject}
          setExtendedDataObj={setExtendedDataObj}
          setShowInput={setShowInput}
        />
      )}
      {bExtensionBtnClicked ? (
        <Modal
          show={bExtensionBtnClicked}
          style={{
            padding: "0",
            width: "28vw",
            left: "43%",
            top: "22.5%",
          }}
          modalClosed={() => setExtensionBtnClicked(false)}
          children={
            <DataObjExtensionList
              setModalClosed={() => setExtensionBtnClicked(false)}
              dataTypesList={dataTypesList}
              setExtendedDataObj={setExtendedDataObj}
              objectName={objectName}
              setDataObject={setDataObject}
            />
          }
        />
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps)(UserDefinedDataTypes);
