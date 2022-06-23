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
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";

function Sap(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  const addNewHandler = () => {};

  const leftPannelData = ["new", "testing", "testing2"];
  const [sapAdapter, setsapAdapter] = useState("");
  const dropdown = [];

  const menuProps = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    style: {
      maxHeight: 400,
    },
    getContentAnchorEl: null,
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className={styles.leftPannel}>
          <div className="row">
            <h5>{t("associateDefi")}</h5>
            <button
              className={styles.addButton}
              id="AddAssociate"
              onClick={addNewHandler}
            >
              {t("addNew")}
            </button>
          </div>
          {leftPannelData.map((e) => {
            return <div className={styles.definationList}>{e}</div>;
          })}
        </div>
        <div className={styles.rightPannel}>
          <h5>{t("newDefinition")}</h5>
          <div className={styles.checklist}>
            <Checkbox
              //   checked={checkException}
              // onChange={() => CheckExceptionHandler()}
              className={styles.checkBoxCommon}
            />
            {t("sapAdapter")}
          </div>
          <div className="row">
            <div>
              <p className={styles.labelTittle}>{t("sapConfig")}</p>
              <CustomizedDropdown
                id="SAP_Adapter_Dropdown"
                value={sapAdapter}
                //   onChange={(event) => setselectedInputFormat(event.target.value)}
                className={styles.dropdown}
                MenuProps={menuProps}
              >
                {dropdown &&
                  dropdown.map((element) => {
                    return (
                      <MenuItem
                        className={styles.menuItemStyles}
                        key={element}
                        value={element}
                      >
                        {element}
                      </MenuItem>
                    );
                  })}
              </CustomizedDropdown>
            </div>

            <div>
              <p className={styles.labelTittle}>{t("definedDefination")}</p>
              <CustomizedDropdown
                id="SAP_Adapter_Dropdown"
                value={sapAdapter}
                //   onChange={(event) => setselectedInputFormat(event.target.value)}
                className={styles.dropdown}
                MenuProps={menuProps}
              >
                {dropdown &&
                  dropdown.map((element) => {
                    return (
                      <MenuItem
                        className={styles.menuItemStyles}
                        key={element}
                        value={element}
                      >
                        {element}
                      </MenuItem>
                    );
                  })}
              </CustomizedDropdown>
            </div>

            <div>
              <p className={styles.labelTittle}>{t("saptCode")}</p>
              <CustomizedDropdown
                id="SAP_Adapter_Dropdown"
                value={sapAdapter}
                //   onChange={(event) => setselectedInputFormat(event.target.value)}
                className={styles.dropdown}
                MenuProps={menuProps}
              >
                {dropdown &&
                  dropdown.map((element) => {
                    return (
                      <MenuItem
                        className={styles.menuItemStyles}
                        key={element}
                        value={element}
                      >
                        {element}
                      </MenuItem>
                    );
                  })}
              </CustomizedDropdown>
            </div>
          </div>

          <h5 style={{ marginTop: "1rem" }}>{t("definedMapping")}</h5>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Sap;
