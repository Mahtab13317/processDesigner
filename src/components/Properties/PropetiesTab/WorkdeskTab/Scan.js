import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./scan.module.css";
import { Select, MenuItem, Checkbox } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import Modal from "../../../../UI/Modal/Modal";
import ScanDefination from "./ScanDefination";

function Scan(props) {
  let { t } = useTranslation();

  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [scanItemData, setScanItemData] = useState([]);

  const [checkScan, setCheckScan] = useState(false);
  const [selectedCheckbox, setselectedCheckbox] = useState(true);
  const [openModal, setopenModal] = useState(null);
  const [selectedScanAction, setselectedScanAction] = useState(null);
  const [allDocType, setallDocType] = useState([]);

  useEffect(() => {
    let scan = {
      ...localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskScanTool?.scanToolMap,
    };
    let temp = [...localLoadedProcessData?.DocumentTypeList];

    Object.keys(scan).forEach((el) => {
      temp.forEach((doc, index) => {
        if (+doc.DocTypeId === +el) {
          let scanInputStr = "";
          scan[el].scanActionList &&
            scan[el].scanActionList.forEach((val) => {
              scanInputStr = scanInputStr + val.ScanActionLabel + ", ";
            });
          temp[index] = {
            ...doc,
            scanActionList: scan[el].scanActionList,
            checked: true,
            scanInputStr: scanInputStr,
          };
        }
      });
    });
    setallDocType(temp);
    let tempCheck =
      localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskScanTool?.scanRendered;
    setCheckScan(tempCheck);
  }, []);

  const CheckScanHandler = () => {
    setCheckScan(!checkScan);
  };

  const selectedCheck = (e, index) => {
    let temp = [...allDocType];
    temp[index].checked = e.target.checked;
    setallDocType(temp);
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
    let temp = [...allDocType];
    temp[openModal].scanInputStr = scanInputStr;
    setallDocType(temp);
    setopenModal(null);
  };

  return (
    <div style={{ margin: "2%" }}>
      <div className={styles.checklist}>
        <Checkbox
          checked={checkScan}
          onChange={() => CheckScanHandler()}
          style={{ height: "20px", width: "20px", marginRight: "8px" }}
        />
        {t("scan")}
      </div>

      <div className="row">
        <div className={styles.docTypes}>{t("docTypes")}</div>
        <div className={styles.checkBox}>
          <Checkbox />
        </div>
        <div className={styles.allowAddition}>{t("addAdition")}</div>
        <div className={styles.scanAddition}>{t("scanActions")}</div>
      </div>
      <div className={styles.scanTextarea}>
        <ul>
          {checkScan ? (
            <li style={{ paddingLeft: "0px" }}>
              <div className="row">
                {/*scanItemData.map((val) => {
                  return (
                    <React.Fragment>
                      <div className={styles.docTypes}>
                        {val.ScanToolDocs.DocName}
                      </div>

                      <div className={styles.checkBox}>
                        <Checkbox
                          checked={selectedCheckbox}
                          onChange={() => selectedCheck()}
                          id="checkBox"
                        />
                      </div>
                    </React.Fragment>
                  );
                })*/}
                {allDocType.map((el, index) => {
                  return (
                    <React.Fragment>
                      <div className={styles.docTypes}>{el.DocName}</div>
                      <div className={styles.checkBox}>
                        <Checkbox
                          checked={el.checked ? true : false}
                          onChange={(e) => selectedCheck(e, index)}
                          id="checkBox"
                        />
                      </div>
                      <div className={styles.allowAddition}>
                        {el.checked ? (
                          <button
                            className={styles.scanAction}
                            onClick={() => scanHandler(index)}
                            data-testid="scanBtn"
                          >
                            {t("scanAction")}
                          </button>
                        ) : null}
                      </div>
                      <div className={styles.scanAddition}>
                        {el.checked ? (
                          <input
                            value={el.scanInputStr}
                            className={styles.scanInput}
                          />
                        ) : null}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </li>
          ) : null}
        </ul>
      </div>
      {openModal != null ? (
        <Modal
          show={openModal != null}
          style={{
            padding: "2%",
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
    </div>
  );
}

export default Scan;
