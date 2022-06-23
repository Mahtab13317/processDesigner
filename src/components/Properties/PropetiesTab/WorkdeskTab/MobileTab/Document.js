import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import { Checkbox } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import arabicStyles from "./ArabicStyles.module.css";
import { RTL_DIRECTION } from "../../../../../Constants/appConstants";

function Document(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [docItemData, setDocItemData] = useState([]);

  const [checkDocument, setcheckDocument] = useState(false);

  const CheckTodoHandler = () => {
    setcheckDocument(!checkDocument);
  };

  useEffect(() => {
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
      tempList[el] = { ...tempList[el] };
    });

    setDocItemData(tempList);
  }, [localLoadedActivityPropertyData]);

  return (
    <div style={{ margin: "2%" }}>
      <div className={styles.checklist}>
        <Checkbox
          checked={checkDocument}
          onChange={() => CheckTodoHandler()}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.titleCheckbox
              : styles.titleCheckbox
          }
          data-testid="CheckDocument"
        />
        {t("documents")}
      </div>
      <div className="row">
        <Checkbox
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.checkboxPosition
              : styles.checkboxPosition
          }
        />
        <h5>{t("DocType")}</h5>
      </div>
      {checkDocument
        ? Object.keys(docItemData) &&
          Object.keys(docItemData).map((val) => {
            return (
              <div className="row" style={{ marginTop: "15px" }}>
                <Checkbox
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.checkboxPosition
                      : styles.checkboxPosition
                  }
                />
                <p className={styles.todoList}> {val}</p>
              </div>
            );
          })
        : null}
    </div>
  );
}

export default Document;
