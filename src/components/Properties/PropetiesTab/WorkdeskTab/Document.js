import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./exception.module.css";
import { Checkbox } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import SearchBox from "../../../../UI/Search Component";
import AddDoc from "../../../ViewingArea/Tools/DocTypes/AddDoc";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import { RTL_DIRECTION, SERVER_URL } from "../../../../Constants/appConstants";
import axios from "axios";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import arabicStyles from "./ArabicStyles.module.css";

function Document(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [checkDoc, setCheckDoc] = useState(false);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [docItemData, setdocItemData] = useState({});
  const [addDoc, setaddDoc] = useState(false);
  const [docData, setDocData] = useState({});
  const [checked, setChecked] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    let localData = {};
    localLoadedProcessData &&
      localLoadedProcessData.DocumentTypeList.forEach((el) => {
        localData = {
          ...localData,
          [el.DocName]: {
            docTypeName: el.DocName,
            docTypeId: el.DocTypeId,
            Delete: false,
            Download: false,
            Modify: false,
            Print: false,
            View: false,
          },
        };
      });

    let tempList = {
      ...(localLoadedActivityPropertyData &&
        localLoadedActivityPropertyData.ActivityProperty &&
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo &&
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo
          .objPMWdeskDocuments &&
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo
          .objPMWdeskDocuments.documentMap),
    };

    Object.keys(tempList).forEach((el) => {
      localData[el] = {
        ...localData[el],
        Delete: tempList[el].isDelete,
        Download: tempList[el].isDownlaod,
        Modify: tempList[el].isModify,
        Print: tempList[el].isPrint,
        View: tempList[el].isView,
      };
    });
    let tempCheck = {};
    Object.keys(localData).forEach((el) => {
      tempCheck = {
        ...tempCheck,
        [el]: {
          isDelete: localData[el].Delete,
          isDownlaod: localData[el].Download,
          isModify: localData[el].Modify,
          isPrint: localData[el].Print,
          isView: localData[el].View,
        },
      };
    });
    setChecked(tempCheck);
    setdocItemData(localData);
  }, []);

  useEffect(() => {
    let activityIdString = "";
    loadedProcessData &&
      loadedProcessData.value &&
      loadedProcessData.value.MileStones.map((mileStone) => {
        mileStone.Activities.map((activity, index) => {
          activityIdString = activityIdString + activity.ActivityId + ",";
        });
      });
    axios
      .get(
        SERVER_URL +
          `/doctypes/${props.openProcessID}/${props.openProcessType}/${props.openProcessName}/${activityIdString}`
      )
      .then((res) => {
        if (res.status === 200) {
          setDocData(res.data);
        }
      });
  }, []);

  const CheckDocHandler = () => {
    setCheckDoc(!checkDoc);
  };

  const defineHandler = () => {
    setaddDoc(true);
  };

  const addDocToList = (DocToAdd, DocDesc, button_type) => {
    if (DocToAdd != "") {
      let maxId = docData.DocumentTypeList.reduce(
        (acc, doc) => (acc = acc > doc.DocTypeId ? acc : doc.DocTypeId),
        0
      );
      axios
        .post(SERVER_URL + "/addDocType", {
          processDefId: props.openProcessID,
          docTypeName: DocToAdd,
          docTypeId: maxId + 1,
          docTypeDesc: DocDesc,
          sDocType: "D",
        })
        .then((res) => {
          if (res.data.Status == 0) {
            let addedActivity = [];
            let tempData = { ...docData };
            if (tempData.DocumentTypeList.length > 0) {
              tempData &&
                tempData.DocumentTypeList[0].Activities.map((activity) => {
                  addedActivity.push({
                    ActivityId: activity.ActivityId,
                    Add: false,
                    View: false,
                    Modify: false,
                    Delete: false,
                    Download: false,
                    Print: false,
                  });
                });
            }
            tempData &&
              tempData.DocumentTypeList.push({
                DocName: DocToAdd,
                DocTypeId: maxId + 1,
                SetAllChecks: {
                  Add: false,
                  View: false,
                  Modify: false,
                  Delete: false,
                  Download: false,
                  Print: false,
                },
                Activities: [...addedActivity],
              });
            setDocData(tempData);
          }
        });
    } else if (DocToAdd.trim() == "") {
      alert("Please enter Doc Name");
      document.getElementById("DocNameInput").focus();
    }
    if (button_type != "addAnother") {
      setaddDoc(false);
    }
    if (button_type == "addAnother") {
      document.getElementById("DocNameInput").value = "";
    }
  };

  const CheckHandler = (docName, type, e) => {
    let tempCheck = { ...checked };
    tempCheck[docName] = { ...tempCheck[docName], [type]: e.target.checked };
    setChecked(tempCheck);

    let temp = { ...localLoadedActivityPropertyData };
    let tempVal =
      temp?.ActivityProperty?.wdeskInfo?.objPMWdeskDocuments?.documentMap;
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
        isPrint: tempCheck[docName].isPrint,
        isModify: tempCheck[docName].isModify,
      },
    };
    if (temp?.ActivityProperty?.wdeskInfo?.objPMWdeskDocuments?.documentMap) {
      temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments.documentMap = {
        ...tempVal,
      };
    } else {
      temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments = {
        documentMap: { ...tempVal },
      };
    }
    setlocalLoadedActivityPropertyData(temp);

    dispatch(
      setActivityPropertyChange({
        Workdesk: { isModified: true, hasError: false },
      })
    );
  };

  console.log("local", localLoadedActivityPropertyData);

  return (
    <div style={{ margin: "2%" }}>
      <div className={styles.checklist}>
        <Checkbox
          checked={checkDoc}
          type="checkbox"
          onChange={() => CheckDocHandler()}
          style={{ height: "20px", width: "20px", marginRight: "8px" }}
          data-testid="CheckDocId"
        />
        {t("documents")}
      </div>
      <div className={styles.searchbox}>
        <SearchBox
          height="28px"
          width="250px"
          name="search"
          placeholder={t("Search Here")}
        />
      </div>

      <div className="row">
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.docTypes
              : styles.docTypes
          }
        >
          {t("docTypes")}
        </div>
        <div
          className={
            direction === RTL_DIRECTION ? arabicStyles.view : styles.view
          }
        >
          <Checkbox />
          {t("view")}
        </div>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.checkboxHeader
              : styles.checkboxHeader
          }
        >
          <Checkbox />
          {t("modify")}
        </div>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.checkboxHeader
              : styles.checkboxHeader
          }
        >
          <Checkbox />
          {t("delete")}
        </div>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.checkboxDownload
              : styles.checkboxDownload
          }
        >
          <Checkbox />
          {t("download")}
        </div>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.checkboxHeader
              : styles.checkboxHeader
          }
        >
          <Checkbox />
          {t("print")}
        </div>
      </div>
      <div className={styles.docTextarea}>
        <ul>
          {checkDoc ? (
            <li style={{ paddingLeft: "0px" }} data-testid="DocumentList">
              <div className="row">
                {Object.keys(docItemData) &&
                  Object.keys(docItemData).map((val) => {
                    return (
                      <React.Fragment>
                        <div
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.docTypes
                              : styles.docTypes
                          }
                        >
                          {docItemData[val].docTypeName}
                        </div>
                        <div
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.viewBox
                              : styles.viewBox
                          }
                        >
                          <Checkbox
                            onChange={(e) => CheckHandler(val, "isView", e)}
                            checked={checked[val].isView}
                            id="viewBox"
                          />
                        </div>
                        <div
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.checkboxHeader
                              : styles.checkboxHeader
                          }
                        >
                          <Checkbox
                            onChange={(e) => CheckHandler(val, "isModify", e)}
                            checked={checked[val].isModify}
                          />
                        </div>
                        <div
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.checkboxHeader
                              : styles.checkboxHeader
                          }
                        >
                          <Checkbox
                            onChange={(e) => CheckHandler(val, "isDelete", e)}
                            checked={checked[val].isDelete}
                          />
                        </div>
                        <div
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.checkboxDownload
                              : styles.checkboxDownload
                          }
                        >
                          <Checkbox
                            onChange={(e) => CheckHandler(val, "isDownlaod", e)}
                            checked={checked[val].isDownlaod}
                          />
                        </div>
                        <div
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.checkboxHeader
                              : styles.checkboxHeader
                          }
                        >
                          <Checkbox
                            onChange={(e) => CheckHandler(val, "isPrint", e)}
                            checked={checked[val].isPrint}
                          />
                        </div>
                      </React.Fragment>
                    );
                  })}
              </div>
            </li>
          ) : null}
        </ul>
      </div>

      <button
        disabled={!checkDoc}
        className={styles.definebtnDoc}
        onClick={defineHandler}
      >
        {t("Define")}
      </button>

      <Modal open={addDoc} onClose={() => setaddDoc(false)}>
        <AddDoc
          handleClose={() => setaddDoc(false)}
          addDocToList={addDocToList}
        />
      </Modal>
    </div>
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
