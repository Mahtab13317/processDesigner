import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import { Checkbox } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import arabicStyles from "./ArabicStyles.module.css";
import {
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../../Constants/appConstants";
import { setActivityPropertyChange } from "../../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { useDispatch } from "react-redux";

function Document() {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [docItemData, setDocItemData] = useState([]);
  const [checked, setChecked] = useState({});
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    let tempCheck = {};
    let tempList = {
      ...localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskDocuments?.documentMap,
    };
    let tempDocList = {};
    Object.keys(tempList).forEach((el) => {
      let id = tempList[el]?.documentType?.docTypeId;
      tempDocList[id] = { ...tempList[el] };
      tempCheck[id] = false;
    });
    localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo?.objPMWdeskPDA?.m_arrAssociatedDoc?.forEach(
      (el) => {
        tempCheck[el] = true;
      }
    );
    setChecked(tempCheck);
    let allCheck = Object.keys(tempCheck)?.every((el) => {
      return tempCheck[el] === true;
    });
    setAllChecked(allCheck);
    setDocItemData(tempDocList);
  }, [localLoadedActivityPropertyData]);

  const CheckDocHandler = (val) => {
    let tempCheck = { ...checked };
    tempCheck = { ...tempCheck, [val]: !tempCheck[val] };
    setChecked(tempCheck);

    let allCheck = Object.keys(tempCheck)?.every((el) => {
      return tempCheck[el] === true;
    });
    setAllChecked(allCheck);

    let temp = { ...localLoadedActivityPropertyData };
    if (tempCheck[val]) {
      if (
        temp?.ActivityProperty?.wdeskInfo?.objPMWdeskPDA?.m_arrAssociatedDoc
      ) {
        temp.ActivityProperty.wdeskInfo.objPMWdeskPDA.m_arrAssociatedDoc.push(
          val
        );
      } else {
        temp.ActivityProperty.wdeskInfo.objPMWdeskPDA = {
          ...temp.ActivityProperty.wdeskInfo.objPMWdeskPDA,
          m_arrAssociatedDoc: [val],
        };
      }
    } else {
      let idx = null;
      temp?.ActivityProperty?.wdeskInfo?.objPMWdeskPDA?.m_arrAssociatedDoc?.forEach(
        (el, index) => {
          if (+el === +val) {
            idx = index;
          }
        }
      );
      temp.ActivityProperty.wdeskInfo.objPMWdeskPDA.m_arrAssociatedDoc.splice(
        idx,
        1
      );
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
    let tempCheck = { ...checked };
    Object.keys(tempCheck)?.forEach((val) => {
      tempCheck = { ...tempCheck, [val]: allCheck };
    });
    setChecked(tempCheck);
    let temp = { ...localLoadedActivityPropertyData };
    if (allCheck) {
      let tempList = [];
      Object.keys(docItemData)?.forEach((val) => {
        tempList.push(val);
      });
      temp.ActivityProperty.wdeskInfo.objPMWdeskPDA.m_arrAssociatedDoc =
        tempList;
    } else {
      temp.ActivityProperty.wdeskInfo.objPMWdeskPDA.m_arrAssociatedDoc = [];
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <div className={styles.documentRow}>
      {Object.keys(docItemData)?.length > 0 ? (
        <div>
          <div className="row">
            <Checkbox
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.mainCheckbox
                  : styles.mainCheckbox
              }
              checked={allChecked}
              onChange={() => allCheckHandler()}
              style={{ flex: "0.125", justifyContent: "left" }}
            />
            <h5 style={{ flex: "1" }}>{t("DocType")}</h5>
          </div>
          <div style={{ marginTop: "0.5rem" }}>
            {Object.keys(docItemData)?.map((val) => {
              return (
                <div className="row">
                  <Checkbox
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.mainCheckbox
                        : styles.mainCheckbox
                    }
                    checked={checked[val]}
                    onChange={() => CheckDocHandler(val)}
                    style={{ flex: "0.125", justifyContent: "left" }}
                  />
                  <span className={styles.todoList} style={{ flex: "1" }}>
                    {docItemData[val]?.documentType?.docTypeName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Document;
