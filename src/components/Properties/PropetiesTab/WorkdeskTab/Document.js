import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./todo.module.css";
import { Checkbox } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import SearchBox from "../../../../UI/Search Component";
import AddDoc from "../../../ViewingArea/Tools/DocTypes/AddDoc";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import {
  SERVER_URL,
  propertiesLabel,
  ENDPOINT_ADD_DOC,
} from "../../../../Constants/appConstants";
import axios from "axios";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import {
  OpenProcessSliceValue,
  setOpenProcess,
} from "../../../../redux-store/slices/OpenProcessSlice";

function Document(props) {
  let { t } = useTranslation();
  const [checkDoc, setCheckDoc] = useState(false);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [localState, setLocalState] = useState(null);
  const [docItemData, setDocItemData] = useState({});
  const [addDoc, setAddDoc] = useState(false);
  const [docData, setDocData] = useState({});
  const [checked, setChecked] = useState({});
  const [allChecked, setAllChecked] = useState({
    isAdd: false,
    isView: false,
    isDelete: false,
    isPrint: false,
    isDownlaod: false,
    isModify: false,
  });
  const [addAnotherDoc, setAddAnotherDoc] = useState(false);
  const dispatch = useDispatch();
  const openProcessData = useSelector(OpenProcessSliceValue);

  useEffect(() => {
    let activityIdString = "";
    openProcessData.loadedData?.MileStones?.forEach((mileStone) => {
      mileStone?.Activities?.forEach((activity) => {
        activityIdString = activityIdString + activity.ActivityId + ",";
      });
    });
    setLocalState(openProcessData.loadedData);
    axios
      .get(
        SERVER_URL +
          `/doctypes/${props.openProcessID}/${props.openProcessType}/${props.openProcessName}/${activityIdString}`
      )
      .then((res) => {
        if (res.status === 200) {
          let docList = { ...res.data };
          setDocData(docList);
          let localData = {};
          let tempCheck = {};
          openProcessData.loadedData?.DocumentTypeList?.forEach((el) => {
            let selectedDoc = null;
            docList?.DocumentTypeList?.forEach((doc) => {
              if (+el.DocTypeId === +doc.DocTypeId) {
                doc?.Activities?.forEach((act) => {
                  if (
                    +act.ActivityId ===
                    +localLoadedActivityPropertyData?.ActivityProperty?.actId
                  ) {
                    selectedDoc = act;
                  }
                });
              }
            });
            localData = {
              ...localData,
              [el.DocName]: {
                docTypeName: el.DocName,
                docTypeId: el.DocTypeId,
              },
            };
            tempCheck = {
              ...tempCheck,
              [el.DocName]: {
                isDelete: selectedDoc?.Delete,
                isDownlaod: selectedDoc?.Download,
                isModify: selectedDoc?.Modify,
                isPrint: selectedDoc?.Print,
                isView: selectedDoc?.View,
                isAdd: selectedDoc?.Add,
              },
            };
          });
          setDocItemData(localData);
          setChecked(tempCheck);
        }
      });
  }, [openProcessData.loadedData]);

  useEffect(() => {
    let tempList = {
      ...localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskDocuments?.documentMap,
    };
    let tempCheck = { ...checked };
    Object.keys(docItemData)?.forEach((el) => {
      tempCheck = {
        ...tempCheck,
        [el]: {
          isDelete: tempList[el]?.isDelete ? tempList[el].isDelete : false,
          isDownlaod: tempList[el]?.isDownlaod
            ? tempList[el].isDownlaod
            : false,
          isModify: tempList[el]?.isModify ? tempList[el].isModify : false,
          isPrint: tempList[el]?.isPrint ? tempList[el].isPrint : false,
          isView: tempList[el]?.isView ? tempList[el].isView : false,
          isAdd: tempList[el]?.isAdd ? tempList[el].isAdd : false,
        },
      };
    });
    setChecked(tempCheck);
    let allCheck = {
      isAdd: false,
      isView: false,
      isDelete: false,
      isPrint: false,
      isDownlaod: false,
      isModify: false,
    };
    if (Object.keys(tempCheck)?.length > 0) {
      Object.keys(allCheck)?.forEach((el) => {
        allCheck = {
          ...allCheck,
          [el]: Object.keys(docItemData)?.every((elt) => {
            return tempCheck[elt][el] === true;
          }),
        };
      });
    }
    setAllChecked(allCheck);
    setCheckDoc(
      localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskDocuments?.m_bchkBoxChecked
    );
  }, [localLoadedActivityPropertyData, docItemData]);

  const CheckDocHandler = () => {
    let val;
    setCheckDoc((prev) => {
      val = !prev;
      return !prev;
    });
    let temp = { ...localLoadedActivityPropertyData };
    if (temp?.ActivityProperty?.wdeskInfo) {
      if (temp?.ActivityProperty?.wdeskInfo?.objPMWdeskDocuments) {
        let valTemp =
          temp?.ActivityProperty?.wdeskInfo?.objPMWdeskDocuments
            ?.m_bchkBoxChecked;
        if (valTemp === false || valTemp === true) {
          temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments.m_bchkBoxChecked =
            val;
        } else {
          temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments = {
            ...temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments,
            m_bchkBoxChecked: val,
          };
        }
      } else {
        temp.ActivityProperty.wdeskInfo = {
          ...temp.ActivityProperty.wdeskInfo,
          objPMWdeskDocuments: {
            m_bchkBoxChecked: val,
          },
        };
      }
    } else {
      temp.ActivityProperty = {
        ...temp.ActivityProperty,
        wdeskInfo: {
          objPMWdeskDocuments: {
            m_bchkBoxChecked: val,
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

  const defineHandler = () => {
    setAddDoc(true);
  };

  const addDocToList = (docToAdd, docDesc, button_type) => {
    let exist = false;
    docData?.DocumentTypeList?.forEach((el) => {
      if (el.DocName.toLowerCase() == docToAdd.toLowerCase()) {
        exist = true;
      }
    });
    if (exist) {
      dispatch(
        setToastDataFunc({
          message: t("docAlreadyExists"),
          severity: "error",
          open: true,
        })
      );
    } else {
      if (docToAdd.trim() !== "") {
        let maxId = docData?.DocumentTypeList?.reduce(
          (acc, doc) => (acc = acc > doc.DocTypeId ? acc : doc.DocTypeId),
          0
        );
        axios
          .post(SERVER_URL + ENDPOINT_ADD_DOC, {
            processDefId: props.openProcessID,
            docTypeName: docToAdd,
            docTypeId: +maxId + 1,
            docTypeDesc: docDesc,
            sDocType: "D",
          })
          .then((res) => {
            if (res.data.Status === 0) {
              let temp = JSON.parse(JSON.stringify(localState));
              temp.DocumentTypeList.push({
                DocName: docToAdd,
                DocTypeId: +maxId + 1,
              });
              dispatch(setOpenProcess({ loadedData: temp }));
              let tempData = { ...docData };
              tempData?.DocumentTypeList?.push({
                DocName: docToAdd,
                DocTypeId: maxId + 1,
                SetAllChecks: {
                  Add: false,
                  View: false,
                  Modify: false,
                  Delete: false,
                  Download: false,
                  Print: false,
                },
                Activities: [],
              });
              setDocData(tempData);
              // code added on 2 August 2022 for BugId 112251
              if (button_type !== "addAnother") {
                setAddDoc(false);
                setAddAnotherDoc(false);
              } else if (button_type === "addAnother") {
                setAddAnotherDoc(true);
              }
            }
          });
      } else if (docToAdd.trim() === "") {
        dispatch(
          setToastDataFunc({
            message: t("mandatoryErr"),
            severity: "error",
            open: true,
          })
        );
        document.getElementById("DocNameInput").focus();
      }
    }
  };

  const CheckHandler = (docName, type, e) => {
    let tempCheck = JSON.parse(JSON.stringify(checked));
    tempCheck[docName] = {
      ...tempCheck[docName],
      [type]: !tempCheck[docName][type],
    };
    if (type === "isView" && tempCheck[docName]["isView"] === false) {
      tempCheck[docName]["isModify"] = false;
    } else if (type === "isModify" && tempCheck[docName]["isModify"] === true) {
      tempCheck[docName]["isView"] = true;
    }
    let temp = { ...localLoadedActivityPropertyData };
    let tempVal = {
      ...temp?.ActivityProperty?.wdeskInfo?.objPMWdeskDocuments?.documentMap,
    };
    tempVal = {
      ...tempVal,
      [docName]: {
        documentType: {
          docTypeId: docItemData[docName].docTypeId,
          docTypeName: docItemData[docName].docTypeName,
          sDocType: "D",
        },
        isDelete: tempCheck[docName].isDelete,
        isDownlaod: tempCheck[docName].isDownlaod,
        isView: tempCheck[docName].isView,
        isAdd: tempCheck[docName].isAdd,
        isPrint: tempCheck[docName].isPrint,
        isModify: tempCheck[docName].isModify,
      },
    };
    let docMap = {};
    Object.keys(tempVal)?.forEach((el) => {
      if (
        tempVal[el].isDelete ||
        tempVal[el].isDownlaod ||
        tempVal[el].isView ||
        tempVal[el].isPrint ||
        tempVal[el].isModify ||
        tempVal[el].isAdd
      ) {
        docMap = {
          ...docMap,
          [el]: tempVal[el],
        };
      }
    });
    if (temp?.ActivityProperty?.wdeskInfo?.objPMWdeskDocuments?.documentMap) {
      temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments.documentMap = {
        ...docMap,
      };
    } else {
      temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments = {
        ...temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments,
        documentMap: { ...docMap },
      };
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
  };

  const allCheckHandler = (type, e) => {
    let tempCheck = { ...allChecked };
    let tempCh = { ...checked };
    tempCheck = { ...tempCheck, [type]: e.target.checked };
    if (type === "isView" && e.target.checked === false) {
      tempCheck["isModify"] = false;
    } else if (type === "isModify" && e.target.checked === true) {
      tempCheck["isView"] = true;
    }
    Object.keys(tempCh).forEach((el) => {
      tempCh[el] = {
        ...tempCh[el],
        [type]: e.target.checked,
      };
      if (type === "isView" && e.target.checked === false) {
        tempCh[el] = {
          ...tempCh[el],
          ["isModify"]: false,
        };
      } else if (type === "isModify" && e.target.checked === true) {
        tempCh[el] = {
          ...tempCh[el],
          ["isView"]: true,
        };
      }
    });
    let temp = { ...localLoadedActivityPropertyData };
    let docMap = {};
    Object.keys(docItemData)?.forEach((el) => {
      if (
        tempCh[el].isDelete ||
        tempCh[el].isDownlaod ||
        tempCh[el].isView ||
        tempCh[el].isPrint ||
        tempCh[el].isModify ||
        tempCh[el].isAdd
      ) {
        docMap = {
          ...docMap,
          [el]: {
            documentType: {
              docTypeId: docItemData[el].docTypeId,
              docTypeName: docItemData[el].docTypeName,
              sDocType: "D",
            },
            isDelete: tempCh[el].isDelete,
            isDownlaod: tempCh[el].isDownlaod,
            isView: tempCh[el].isView,
            isAdd: tempCh[el].isAdd,
            isPrint: tempCh[el].isPrint,
            isModify: tempCh[el].isModify,
          },
        };
      }
    });
    if (temp?.ActivityProperty?.wdeskInfo?.objPMWdeskDocuments?.documentMap) {
      temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments.documentMap = {
        ...docMap,
      };
    } else {
      temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments = {
        ...temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments,
        documentMap: { ...docMap },
      };
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <React.Fragment>
      <div className={styles.documentRow}>
        <div className={styles.checklist}>
          <Checkbox
            checked={checkDoc}
            onChange={() => CheckDocHandler()}
            className={styles.mainCheckbox}
            data-testid="CheckDocId"
            type="checkbox"
          />
          {t("document")}
        </div>
        <div className="row">
          <div className={styles.searchbox}>
            <SearchBox
              width="20vw"
              name="search"
              placeholder={t("Search Here")}
            />
          </div>
          <button
            disabled={!checkDoc}
            className={!checkDoc ? styles.disabledBtn : styles.addBtn}
            onClick={defineHandler}
            style={{ marginLeft: "1vw" }}
            data-testid="defineBtn_doc"
          >
            {t("Define")}
          </button>
        </div>
        <div className={styles.todoDocTextarea} style={{ marginTop: "1rem" }}>
          {Object.keys(docItemData)?.length > 0 ? (
            <React.Fragment>
              <div className={`row ${styles.docTableHeader}`}>
                <div className={styles.docTypes}>{t("docTypes")}</div>
                <div className={styles.view}>
                  <Checkbox
                    className={styles.mainCheckbox}
                    checked={!checkDoc ? false : allChecked?.isAdd}
                    disabled={!checkDoc}
                    onChange={(e) => allCheckHandler("isAdd", e)}
                  />
                  {t("add")}
                </div>
                <div className={styles.view}>
                  <Checkbox
                    className={styles.mainCheckbox}
                    checked={!checkDoc ? false : allChecked?.isView}
                    disabled={!checkDoc}
                    onChange={(e) => allCheckHandler("isView", e)}
                  />
                  {t("view")}
                </div>
                <div className={styles.checkboxHeader}>
                  <Checkbox
                    className={styles.mainCheckbox}
                    checked={!checkDoc ? false : allChecked?.isModify}
                    disabled={!checkDoc}
                    onChange={(e) => allCheckHandler("isModify", e)}
                  />
                  {t("modify")}
                </div>
                <div className={styles.checkboxHeader}>
                  <Checkbox
                    className={styles.mainCheckbox}
                    checked={!checkDoc ? false : allChecked?.isDelete}
                    disabled={!checkDoc}
                    onChange={(e) => allCheckHandler("isDelete", e)}
                  />
                  {t("delete")}
                </div>
                <div className={styles.checkboxDownload}>
                  <Checkbox
                    className={styles.mainCheckbox}
                    checked={!checkDoc ? false : allChecked?.isDownlaod}
                    disabled={!checkDoc}
                    onChange={(e) => allCheckHandler("isDownlaod", e)}
                  />
                  {t("download")}
                </div>
                <div className={styles.checkboxHeader}>
                  <Checkbox
                    className={styles.mainCheckbox}
                    checked={!checkDoc ? false : allChecked?.isPrint}
                    disabled={!checkDoc}
                    onChange={(e) => allCheckHandler("isPrint", e)}
                  />
                  {t("print")}
                </div>
              </div>
              <div className={styles.docTextarea}>
                {checkDoc &&
                  Object.keys(docItemData)?.map((val) => {
                    return (
                      <div className="row">
                        <React.Fragment>
                          <div className={styles.docTypes}>
                            {docItemData[val].docTypeName}
                          </div>
                          <div className={styles.view}>
                            <Checkbox
                              className={styles.mainCheckbox}
                              onChange={(e) => CheckHandler(val, "isAdd", e)}
                              checked={
                                checked[val]?.isAdd ? checked[val].isAdd : false
                              }
                              id="addBox"
                            />
                          </div>
                          <div className={styles.view}>
                            <Checkbox
                              className={styles.mainCheckbox}
                              onChange={(e) => CheckHandler(val, "isView", e)}
                              checked={
                                checked[val]?.isView
                                  ? checked[val].isView
                                  : false
                              }
                              id="viewBox"
                            />
                          </div>
                          <div className={styles.checkboxHeader}>
                            <Checkbox
                              className={styles.mainCheckbox}
                              onChange={(e) => CheckHandler(val, "isModify", e)}
                              checked={
                                checked[val]?.isModify
                                  ? checked[val].isModify
                                  : false
                              }
                            />
                          </div>
                          <div className={styles.checkboxHeader}>
                            <Checkbox
                              className={styles.mainCheckbox}
                              onChange={(e) => CheckHandler(val, "isDelete", e)}
                              checked={
                                checked[val]?.isDelete
                                  ? checked[val].isDelete
                                  : false
                              }
                            />
                          </div>
                          <div className={styles.checkboxDownload}>
                            <Checkbox
                              className={styles.mainCheckbox}
                              onChange={(e) =>
                                CheckHandler(val, "isDownlaod", e)
                              }
                              checked={
                                checked[val]?.isDownlaod
                                  ? checked[val].isDownlaod
                                  : false
                              }
                            />
                          </div>
                          <div className={styles.checkboxHeader}>
                            <Checkbox
                              className={styles.mainCheckbox}
                              onChange={(e) => CheckHandler(val, "isPrint", e)}
                              checked={
                                checked[val]?.isPrint
                                  ? checked[val].isPrint
                                  : false
                              }
                            />
                          </div>
                        </React.Fragment>
                      </div>
                    );
                  })}
              </div>
            </React.Fragment>
          ) : null}
        </div>
      </div>
      <Modal open={addDoc} onClose={() => setAddDoc(false)}>
        <AddDoc
          handleClose={() => setAddDoc(false)}
          addDocToList={addDocToList}
          addAnotherDoc={addAnotherDoc}
          setAddAnotherDoc={setAddAnotherDoc}
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

export default connect(mapStateToProps, null)(Document);
