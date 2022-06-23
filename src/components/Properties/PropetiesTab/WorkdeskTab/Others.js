import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Others.module.css";
import { Select, MenuItem, Checkbox } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { store, useGlobalState } from "state-pool";
import AddToDo from "../../../ViewingArea/Tools/ToDo/AddToDo";
import Modal from "@material-ui/core/Modal";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import axios from "axios";
import { SERVER_URL, RTL_DIRECTION } from "../../../../Constants/appConstants";
import arabicStyles from "./ArabicStyles.module.css";

function Others(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  return (
    <React.Fragment>
      <div className={styles.flexRow}>
        <p className={styles.commonInterface}>{t("customInterface")}</p>

        <Checkbox
        //   checked={checkException}
        //   onChange={() => CheckExceptionHandler()}
        />
        <p className={styles.checkBoxShowAlways}>{t("showAlways")}</p>
      </div>

      <div className={styles.tableDataRow}>
        <p className={styles.commonInterfaceTableRow}>sap Gui Adapter</p>

        <Checkbox
          //   checked={checkException}
          //   onChange={() => CheckExceptionHandler()}
          style={{ marginLeft: "2rem", marginTop: "-12px" }}
        />
      </div>

      <div className={styles.tableDataRow}>
        <p className={styles.commonInterfaceTableRow}>testing</p>

        <Checkbox
          //   checked={checkException}
          //   onChange={() => CheckExceptionHandler()}
          style={{ marginLeft: "2rem", marginTop: "-12px" }}
        />
      </div>
    </React.Fragment>
  );
}

export default Others;
