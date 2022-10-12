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
import {
  isProcessDeployedFunc,
  isReadOnlyFunc,
} from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

function Scan(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [checkScan, setCheckScan] = useState(false);
  const [openModal, setopenModal] = useState(null);
  const [allDocType, setAllDocType] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const openProcessData = useSelector(OpenProcessSliceValue);
  /*code updated on 21 September 2022 for BugId 115467*/
  const isReadOnly = isProcessDeployedFunc(localLoadedProcessData);

  useEffect(() => {
    let scan = {
      ...localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskScanTool?.scanToolMap,
    };
    let temp = JSON.parse(JSON.stringify(openProcessData.loadedData));
    let docList = [];
    temp?.DocumentTypeList?.forEach((doc) => {
      docList.push(doc);
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
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
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
        ...temp?.ActivityProperty,
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

  // code edited on 21 Sep 2022 for BugId 114226
  const selectedCheck = (val, index) => {
    let tempDoc = [...allDocType];
    tempDoc[index].checked = val;
    setAllDocType(tempDoc);
    let allCheck = allDocType?.every((el) => {
      return el.checked === true;
    });
    setAllChecked(allCheck);
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    let tempVal = {
      ...temp?.ActivityProperty?.wdeskInfo?.objPMWdeskScanTool?.scanToolMap,
    };
    let tempDocProp = {
      ...temp?.ActivityProperty?.wdeskInfo?.objPMWdeskDocuments?.documentMap,
    };
    let docMap = {};
    if (val) {
      docMap = {
        ...tempVal,
        [tempDoc[index].DocTypeId]: {
          isAdd: true,
          scanActionList: [],
          scanToolInfo: {
            docTypeId: tempDoc[index].DocTypeId,
            docTypeName: tempDoc[index].DocName,
          },
        },
      };
    } else {
      Object.keys(tempVal)?.forEach((el) => {
        if (el !== tempDoc[index].DocTypeId) {
          docMap = { ...docMap, [el]: tempVal[el] };
        }
      });
    }

    if (tempDocProp[tempDoc[index].DocName]) {
      tempDocProp[tempDoc[index].DocName] = {
        ...tempDocProp[tempDoc[index].DocName],
        isAdd: val,
      };
    } else {
      tempDocProp = {
        ...tempDocProp,
        [tempDoc[index].DocName]: {
          documentType: {
            docTypeId: tempDoc[index].DocTypeId,
            docTypeName: tempDoc[index].DocName,
            sDocType: "D",
          },
          isDelete: false,
          isDownlaod: false,
          isView: false,
          isAdd: val,
          isPrint: false,
          isModify: false,
        },
      };
    }

    let docFinalMap = {};
    Object.keys(tempDocProp)?.forEach((el) => {
      if (
        tempDocProp[el].isDelete ||
        tempDocProp[el].isDownlaod ||
        tempDocProp[el].isView ||
        tempDocProp[el].isPrint ||
        tempDocProp[el].isModify ||
        tempDocProp[el].isAdd
      ) {
        docFinalMap = {
          ...docFinalMap,
          [el]: tempDocProp[el],
        };
      }
    });

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
    if (temp?.ActivityProperty?.wdeskInfo?.objPMWdeskDocuments?.documentMap) {
      temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments.documentMap = {
        ...docFinalMap,
      };
    } else {
      temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments = {
        ...temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments,
        documentMap: { ...docFinalMap },
      };
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
  };

  // code edited on 21 Sep 2022 for BugId 114226
  const allCheckHandler = () => {
    let allCheck = !allChecked;
    setAllChecked(allCheck);

    let tempDoc = [...allDocType];
    tempDoc?.forEach((val, index) => {
      tempDoc[index] = { ...val, checked: allCheck };
    });
    setAllDocType(tempDoc);

    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    let tempDocProp = {
      ...temp?.ActivityProperty?.wdeskInfo?.objPMWdeskDocuments?.documentMap,
    };
    if (allCheck) {
      let tempList = {};
      tempDoc?.forEach((val) => {
        tempList = {
          ...tempList,
          [val.DocTypeId]: {
            isAdd: true,
            scanActionList: [],
            scanToolInfo: {
              docTypeId: val.DocTypeId,
              docTypeName: val.DocName,
            },
          },
        };
      });
      temp.ActivityProperty.wdeskInfo.objPMWdeskScanTool.scanToolMap = tempList;
      tempDoc?.forEach((el) => {
        if (tempDocProp[el.DocName]) {
          tempDocProp[el.DocName] = {
            ...tempDocProp[el.DocName],
            isAdd: allCheck,
          };
        } else {
          tempDocProp = {
            ...tempDocProp,
            [el.DocName]: {
              documentType: {
                docTypeId: el.DocTypeId,
                docTypeName: el.DocName,
                sDocType: "D",
              },
              isDelete: false,
              isDownlaod: false,
              isView: false,
              isAdd: allCheck,
              isPrint: false,
              isModify: false,
            },
          };
        }
      });
    } else {
      temp.ActivityProperty.wdeskInfo.objPMWdeskScanTool.scanToolMap = {};
      Object.keys(tempDocProp)?.forEach((el) => {
        tempDocProp[el] = { ...tempDocProp[el], isAdd: false };
      });
    }
    let docFinalMap = {};
    Object.keys(tempDocProp)?.forEach((el) => {
      if (
        tempDocProp[el].isDelete ||
        tempDocProp[el].isDownlaod ||
        tempDocProp[el].isView ||
        tempDocProp[el].isPrint ||
        tempDocProp[el].isModify ||
        tempDocProp[el].isAdd
      ) {
        docFinalMap = {
          ...docFinalMap,
          [el]: tempDocProp[el],
        };
      }
    });
    if (temp?.ActivityProperty?.wdeskInfo?.objPMWdeskDocuments?.documentMap) {
      temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments.documentMap = {
        ...docFinalMap,
      };
    } else {
      temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments = {
        ...temp.ActivityProperty.wdeskInfo.objPMWdeskDocuments,
        documentMap: { ...docFinalMap },
      };
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

  const selectedScanActionHandler = (data, isEdited) => {
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
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    let tempVal = {
      ...temp?.ActivityProperty?.wdeskInfo?.objPMWdeskScanTool?.scanToolMap,
    };
    // code edited on 15 Sep 2022 for BugId 115561
    let newList = [];
    data?.forEach((val) => {
      newList.push({
        ScanActionLabel:
          val.field.VariableName + " = " + val.value.VariableName,
        extObjID1: val.field.ExtObjectId,
        extObjID2: val.value.ExtObjectId,
        param1: val.field.VariableName,
        param2: val.value.VariableName,
        type1: val.field.VariableType,
        type2:
          val.value.VariableScope === "C"
            ? val.field.VariableType
            : val.value.VariableType,
        varFieldId_1: val.field.VarFieldId,
        varFieldId_2:
          val.value.VariableScope === "C" ? "0" : val.value.VarFieldId,
        varScope1: val.field.VariableScope,
        varScope2: val.value.VariableScope,
        variableId_1: val.field.VariableId,
        variableId_2: val.value.VariableId,
      });
    });
    tempVal[tempDoc[openModal].DocTypeId].scanActionList = [...newList];
    tempVal[tempDoc[openModal].DocTypeId] = {
      ...tempVal[tempDoc[openModal].DocTypeId],
      isAdd: true,
    };
    temp.ActivityProperty.wdeskInfo.objPMWdeskScanTool.scanToolMap = {
      ...tempVal,
    };
    setlocalLoadedActivityPropertyData(temp);
    if (isEdited) {
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.workdesk]: { isModified: true, hasError: false },
        })
      );
    }
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
            disabled={isReadOnly}
          />
          {t("scan")} {t("Tool")}
        </div>
        <div className={styles.todoDocTextarea} style={{ marginTop: "1rem" }}>
          {allDocType?.length > 0 ? (
            <React.Fragment>
              <div className={`row ${styles.docTableHeader}`}>
                <div className={styles.docTypes}>{t("docTypes")}</div>
                <div className={styles.checkboxScan}>
                  <Checkbox
                    className={styles.mainCheckbox}
                    checked={allChecked}
                    disabled={!checkScan || isReadOnly}
                    onChange={(e) => allCheckHandler()}
                  />
                </div>
                <div className={styles.allowAddition}>{t("allowAddition")}</div>
                <div className={styles.docTypes}>{t("scanActions")}</div>
              </div>
              <div className={styles.docTextarea}>
                {checkScan &&
                  allDocType?.map((el, index) => {
                    return (
                      <div
                        className="row"
                        style={{
                          minHeight: "var(--line_height)",
                          margin: "0.25rem 0",
                        }}
                      >
                        <React.Fragment>
                          <div className={styles.docTypes}>{el.DocName}</div>
                          <div className={styles.checkboxScan}>
                            <Checkbox
                              className={styles.mainCheckbox}
                              onChange={(e) =>
                                selectedCheck(e.target.checked, index)
                              }
                              checked={el.checked ? true : false}
                              id="checkBox"
                              disabled={isReadOnly}
                            />
                          </div>
                          <div className={styles.allowAddition}>
                            {el.checked ? (
                              <button
                                className={styles.allowAddBtn}
                                onClick={() => scanHandler(index)}
                                data-testid="scanBtn"
                              >
                                {t("scanAction")}
                              </button>
                            ) : null}
                          </div>
                          <div className={styles.docTypes}>
                            {el.checked ? (
                              <input
                                value={el.scanInputStr}
                                className={styles.scanInputField}
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
            top: "20%",
            left: "20%",
          }}
          children={
            <ScanDefination
              selectedDoc={allDocType[openModal]}
              setopenModal={setopenModal}
              selectedScanActionHandler={selectedScanActionHandler}
              modalClosed={() => setopenModal(null)}
            />
          }
        />
      ) : null}
    </React.Fragment>
  );
}

export default Scan;
