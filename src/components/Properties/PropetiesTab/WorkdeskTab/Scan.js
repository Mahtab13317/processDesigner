import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import Modal from "../../../../UI/Modal/Modal";
import ScanDefination from "./ScanDefination";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { propertiesLabel } from "../../../../Constants/appConstants";
import { useDispatch, useSelector } from "react-redux";
import styles from "./todo.module.css";
import { OpenProcessSliceValue } from "../../../../redux-store/slices/OpenProcessSlice";

function Scan(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [checkScan, setCheckScan] = useState(false);
  const [openModal, setopenModal] = useState(null);
  const [allDocType, setAllDocType] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const openProcessData = useSelector(OpenProcessSliceValue);

  useEffect(() => {
    let scan = {
      ...localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskScanTool?.scanToolMap,
    };
    let temp = JSON.parse(
      JSON.stringify(openProcessData.loadedData?.DocumentTypeList)
    );
    let docList = [];
    let localDocs = {
      ...localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskDocuments?.documentMap,
    };
    temp?.forEach((doc) => {
      if (localDocs[doc.DocName]?.isAdd === true) {
        docList.push(doc);
      }
    });
    setAllDocType(docList);
    Object.keys(scan).forEach((el) => {
      docList?.forEach((doc, index) => {
        if (+doc.DocTypeId === +el) {
          let scanInputStr = "";
          scan[el].scanActionList?.forEach((val) => {
            scanInputStr = scanInputStr + val.ScanActionLabel + ", ";
          });
          docList[index] = {
            ...doc,
            scanActionList: scan[el].scanActionList,
            checked: true,
            scanInputStr: scanInputStr,
          };
        }
      });
    });
    let allCheck = docList?.every((el) => {
      return el.checked === true;
    });
    setAllChecked(allCheck);
    setCheckScan(
      localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskScanTool?.scanRendered
    );
  }, [localLoadedActivityPropertyData]);

  const CheckScanHandler = () => {
    let val;
    setCheckScan((prev) => {
      val = !prev;
      return !prev;
    });
    let temp = { ...localLoadedActivityPropertyData };
    if (temp?.ActivityProperty?.wdeskInfo) {
      if (temp?.ActivityProperty?.wdeskInfo?.objPMWdeskScanTool) {
        let valTemp =
          temp?.ActivityProperty?.wdeskInfo?.objPMWdeskScanTool?.scanRendered;
        if (valTemp === false || valTemp === true) {
          temp.ActivityProperty.wdeskInfo.objPMWdeskScanTool.scanRendered = val;
        } else {
          temp.ActivityProperty.wdeskInfo.objPMWdeskScanTool = {
            ...temp.ActivityProperty.wdeskInfo.objPMWdeskScanTool,
            scanRendered: val,
          };
        }
      } else {
        temp.ActivityProperty.wdeskInfo = {
          ...temp.ActivityProperty.wdeskInfo,
          objPMWdeskScanTool: {
            scanRendered: val,
          },
        };
      }
    } else {
      temp.ActivityProperty = {
        ...temp.ActivityProperty,
        wdeskInfo: {
          objPMWdeskScanTool: {
            scanRendered: val,
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

  const selectedCheck = (val, index) => {
    let tempDoc = [...allDocType];
    tempDoc[index].checked = val;
    setAllDocType(tempDoc);
    let allCheck = allDocType?.every((el) => {
      return el.checked === true;
    });
    setAllChecked(allCheck);
    let temp = { ...localLoadedActivityPropertyData };
    let tempVal = {
      ...temp?.ActivityProperty?.wdeskInfo?.objPMWdeskScanTool?.scanToolMap,
    };
    let docMap = {};
    if (val) {
      tempVal = {
        ...tempVal,
        [tempDoc[index].DocTypeId]: {
          scanActionList: [],
          scanToolInfo: {
            docTypeId: tempDoc[index].DocTypeId,
            docTypeName: tempDoc[index].DocName,
          },
        },
      };
      docMap = { ...tempVal };
    } else {
      Object.keys(tempVal)?.forEach((el) => {
        if (el !== tempDoc[index].DocTypeId) {
          docMap = { ...docMap, [el]: tempVal[el] };
        }
      });
    }
    if (temp?.ActivityProperty?.wdeskInfo?.objPMWdeskScanTool?.scanToolMap) {
      temp.ActivityProperty.wdeskInfo.objPMWdeskScanTool.scanToolMap = {
        ...docMap,
      };
    } else {
      temp.ActivityProperty.wdeskInfo.objPMWdeskScanTool = {
        ...temp.ActivityProperty.wdeskInfo.objPMWdeskScanTool,
        scanToolMap: { ...docMap },
      };
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
  };

  const allCheckHandler = () => {
    let allCheck = !allChecked;
    setAllChecked(allCheck);

    let tempDoc = [...allDocType];
    tempDoc?.forEach((val, index) => {
      tempDoc[index] = { ...val, checked: allCheck };
    });
    setAllDocType(tempDoc);

    let temp = { ...localLoadedActivityPropertyData };
    if (allCheck) {
      let tempList = {};
      tempDoc?.forEach((val) => {
        tempList = {
          ...tempList,
          [val.DocTypeId]: {
            scanActionList: [],
            scanToolInfo: {
              docTypeId: val.DocTypeId,
              docTypeName: val.DocName,
            },
          },
        };
      });
      temp.ActivityProperty.wdeskInfo.objPMWdeskScanTool.scanToolMap = tempList;
    } else {
      temp.ActivityProperty.wdeskInfo.objPMWdeskScanTool.scanToolMap = {};
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
  };

  const scanHandler = (index) => {
    setopenModal(index);
  };

  const selectedScanActionHandler = (data) => {
    let selectedArr = [];
    var selectedvalue;
    data?.forEach((val) => {
      selectedvalue =
        " " + val.field.VariableName + " = " + val.value.VariableName;
      selectedArr.push(selectedvalue);
    });

    let scanInputStr = "";
    selectedArr?.forEach((val) => {
      scanInputStr = scanInputStr + val + ",";
    });
    let tempDoc = [...allDocType];
    tempDoc[openModal].scanInputStr = scanInputStr;
    setAllDocType(tempDoc);

    setopenModal(null);
    let temp = { ...localLoadedActivityPropertyData };
    let tempVal = {
      ...temp?.ActivityProperty?.wdeskInfo?.objPMWdeskScanTool?.scanToolMap,
    };
    let newList = [...tempVal[tempDoc[openModal].DocTypeId].scanActionList];
    data?.forEach((val) => {
      newList.push({
        ScanActionLabel:
          val.field.VariableName + " = " + val.value.VariableName,
        extObjID1: val.field.ExtObjectId,
        extObjID2: val.value.ExtObjectId,
        param1: val.field.VariableName,
        param2: val.value.VariableName,
        type1: "",
        type2: "",
        varFieldId_1: val.field.VarFieldId,
        varFieldId_2: val.value.VarFieldId,
        varScope1: val.field.VariableScope,
        varScope2: val.value.VariableScope,
        variableId_1: val.field.VariableId,
        variableId_2: val.value.VariableId,
      });
    });
    tempVal[tempDoc[openModal].DocTypeId].scanActionList = [...newList];
    temp.ActivityProperty.wdeskInfo.objPMWdeskScanTool.scanToolMap = {
      ...tempVal,
    };
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
            checked={checkScan}
            onChange={() => CheckScanHandler()}
            className={styles.mainCheckbox}
            data-testid="CheckScanId"
            type="checkbox"
          />
          {t("scan")}
        </div>
        <div className={styles.todoDocTextarea} style={{ marginTop: "1rem" }}>
          {allDocType?.length > 0 ? (
            <React.Fragment>
              <div className={`row ${styles.docTableHeader}`}>
                <div className={styles.docTypes}>{t("docTypes")}</div>
                <div className={styles.view}>
                  <Checkbox
                    className={styles.mainCheckbox}
                    checked={allChecked}
                    disabled={!checkScan}
                    onChange={(e) => allCheckHandler()}
                  />
                </div>
                <div className={styles.view}>{t("allowAddition")}</div>
                <div className={styles.checkboxHeader}>{t("scanActions")}</div>
              </div>
              <div className={styles.docTextarea}>
                {checkScan &&
                  allDocType?.map((el, index) => {
                    return (
                      <div className="row">
                        <React.Fragment>
                          <div className={styles.docTypes}>{el.DocName}</div>
                          <div className={styles.view}>
                            <Checkbox
                              className={styles.mainCheckbox}
                              onChange={(e) =>
                                selectedCheck(e.target.checked, index)
                              }
                              checked={el.checked ? true : false}
                              id="checkBox"
                            />
                          </div>
                          <div className={styles.view}>
                            {el.checked ? (
                              <button
                                className={styles.addBtn}
                                onClick={() => scanHandler(index)}
                                data-testid="scanBtn"
                              >
                                {t("scanAction")}
                              </button>
                            ) : null}
                          </div>
                          <div className={styles.checkboxHeader}>
                            {el.checked ? (
                              <input
                                value={el.scanInputStr}
                                className={styles.inputField}
                                disabled={true}
                              />
                            ) : null}
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
      {openModal != null ? (
        <Modal
          show={openModal != null}
          style={{
            padding: "0",
            width: "60vw",
            height: "60vh",
            top: "20%",
            left: "20%",
          }}
          modalClosed={() => setopenModal(null)}
          children={
            <ScanDefination
              selectedDoc={allDocType[openModal]}
              setopenModal={setopenModal}
              selectedScanActionHandler={selectedScanActionHandler}
            />
          }
        />
      ) : null}
    </React.Fragment>
  );
}

export default Scan;
