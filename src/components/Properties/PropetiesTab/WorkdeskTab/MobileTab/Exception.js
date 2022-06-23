import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import { Checkbox } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import arabicStyles from "./ArabicStyles.module.css";
import { RTL_DIRECTION } from "../../../../../Constants/appConstants";

function Exception(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [exceptionItemData, setExceptionItemData] = useState([]);

  const [checkExp, setCheckExp] = useState(false);

  const CheckExpHandler = () => {
    setCheckExp(!checkExp);
  };

  useEffect(() => {
    let tempList = {
      ...(localLoadedActivityPropertyData &&
        localLoadedActivityPropertyData.ActivityProperty &&
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo &&
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo
          .objPMWdeskExceptions &&
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo
          .objPMWdeskExceptions.exceptionMap),
    };

    Object.keys(tempList).forEach((el) => {
      tempList[el] = { ...tempList[el] };
    });

    setExceptionItemData(tempList);
  }, [localLoadedActivityPropertyData]);

  return (
    <div style={{ margin: "2%" }}>
      <div className={styles.checklist}>
        <Checkbox
          checked={checkExp}
          onChange={() => CheckExpHandler()}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.titleCheckbox
              : styles.titleCheckbox
          }
          data-testid="CheckException"
        />
        {t("EXCEPTION")}
      </div>
      <div className="row">
        <Checkbox
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.checkboxPosition
              : styles.checkboxPosition
          }
        />
        <h5>{t("exceptions")}</h5>
      </div>
      {checkExp
        ? Object.keys(exceptionItemData) &&
          Object.keys(exceptionItemData).map((val) => {
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

export default Exception;
