import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import Filter from "../../../assets/Tiles/Filter.svg";
import SearchComponent from "../../../UI/Search Component/index";
import Tab from "../../../UI/Tab/Tab";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { connect, useDispatch } from "react-redux";
import { setToastDataFunc } from "../../../redux-store/slices/ToastDataHandlerSlice";
import { CircularProgress } from "@material-ui/core";
import {
  ADD_CONSTANT,
  DELETE_CONSTANT,
  ENDPOINT_REGISTER_SAP,
  MODIFY_CONSTANT,
  RTL_DIRECTION,
  SERVER_URL,
  STATE_ADDED,
  STATE_CREATED,
  STATE_EDITED,
} from "../../../Constants/appConstants";
import SapList from "./SapList";
import SapForm from "./SapForm";

import { Blowfish } from "../../../utility/Blowfish";

function Configuration(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const dispatch = useDispatch();
  const [spinner, setspinner] = useState(true);
  const [configurationList, setConfigurationList] = useState([]);
  const [changedSelection, setChangedSelection] = useState(null);
  const [selected, setSelected] = useState(null);
  let bf = new Blowfish("DES");

  useEffect(() => {
    axios.get(SERVER_URL + ENDPOINT_REGISTER_SAP).then((res) => {
      let configList = [...res.data];
      let tempConfList = [];

      configList?.forEach((el) => {
        tempConfList.push({
          ...el,
          status: STATE_ADDED,
        });
      });
      setConfigurationList(tempConfList);
      setSelected(tempConfList[0]);
      setspinner(false);
    });
  }, []);

  const addNewSapFunction = () => {
    let temp = [...configurationList];
    let indexVal;
    let maxId = 0;
    //to remove existing temporary SAP from list, before adding new temporary SAP
    temp?.forEach((webS, index) => {
      if (webS.status && webS.status === STATE_CREATED) {
        indexVal = index;
      }
      if (maxId < webS.iConfigurationId) {
        maxId = webS.iConfigurationId;
      }
    });
    if (indexVal >= 0) {
      temp.splice(indexVal, 1);
    }
    temp.splice(0, 0, {
      configurationName: t("newConfiguration"),
      iConfigurationId: maxId + 1,
      status: STATE_CREATED,
    });
    setSelected(temp[0]);
    setConfigurationList(temp);
  };

  const handleSapservice = (statusConstant) => {
    let tk = "6432630498745557654";

    let json = {
      strSAPAuthCred: changedSelection.password,
      configurationName: changedSelection.configuration,
      rfchostNameRequired: changedSelection.rfchostNameRequired,
      functionName: null,
      saplanguage: changedSelection.language,
      sapitsserver: changedSelection.itsServer,
      rfchostName: changedSelection.rfcHostname,
      sapclient: changedSelection.clientName,
      sapuserName: changedSelection.userName,
      saphostName: changedSelection.hostName,
      saphttpport: changedSelection.httpPort,
      sapprotocol: changedSelection.protocol,
      sapinstanceNo: changedSelection.instanceNo,
    };
    if (statusConstant === ADD_CONSTANT) {
      if (
        changedSelection.configuration == "" ||
        changedSelection.hostName == "" ||
        changedSelection.clientName == "" ||
        changedSelection.password == "" ||
        changedSelection.language == "" ||
        changedSelection.instanceNo == "" ||
        changedSelection.httpPort == ""
      ) {
        dispatch(
          setToastDataFunc({
            message: t("mandatoryErrorStatement"),
            severity: "error",
            open: true,
          })
        );
      } else {
        axios
          .post(SERVER_URL + ENDPOINT_REGISTER_SAP, json, {
            headers: {
              encryptionToken: tk,
            },
          })
          .then((res) => {
            if (res.data.Status === 0) {
              let tempConfig = [...configurationList];
              let newObj = {
                configurationName: changedSelection.configuration,
                functionName: selected.functionName,
                iConfigurationId: selected.iConfigurationId,
                rfchostName: selected.rfchostName,
                rfchostNameRequired: selected.rfchostNameRequired,
                sapclient: changedSelection.clientName,
                saphostName: changedSelection.hostName,
                saphttpport: changedSelection.httpPort,
                sapinstanceNo: changedSelection.instanceNo,
                sapitsserver: changedSelection.itsServer,
                saplanguage: changedSelection.language,
                sapprotocol: changedSelection.protocol,
                sapuserName: selected.sapuserName,
                status: selected.status,
                strSAPAuthCred: null,
              };
              tempConfig[0] = {
                ...newObj,
                status: STATE_ADDED,
              };
              setSelected((prev) => {
                let temp = { ...prev, ...newObj };
                temp.status = STATE_ADDED;
                return temp;
              });
              setConfigurationList(tempConfig);
            }
          });
      }
    } else if (statusConstant === MODIFY_CONSTANT) {
      if (
        changedSelection.configuration == "" ||
        changedSelection.hostName == "" ||
        changedSelection.clientName == "" ||
        changedSelection.password == "" ||
        changedSelection.language == "" ||
        changedSelection.instanceNo == "" ||
        changedSelection.httpPort == ""
      ) {
        dispatch(
          setToastDataFunc({
            message: t("mandatoryErrorStatement"),
            severity: "error",
            open: true,
          })
        );
      } else {
        axios
          .put(SERVER_URL + ENDPOINT_REGISTER_SAP, json, {
            headers: {
              encryptionToken: tk,
            },
          })
          .then((res) => {
            if (res.data.Status === 0) {
            }
          });
      }
    } else if (statusConstant === DELETE_CONSTANT) {
      let json = {
        iConfigurationId: selected.iConfigurationId,
      };
      axios
        .delete(SERVER_URL + ENDPOINT_REGISTER_SAP, {
          data: json,
          headers: { "Access-Control-Allow-Origin": "*" },
        })
        .then((res) => {});
    }
  };
  const cancelEditConfiguration = () => {
    let tempSelected = null;
    configurationList.forEach((item) => {
      if (+item.iConfigurationId === +selected.iConfigurationId) {
        tempSelected = {
          ...item,
          status: STATE_ADDED,
        };
      }
    });
    setSelected(tempSelected);
  };

  const cancelAddConfig = () => {
    let temp = [...configurationList];
    temp.splice(0, 1);
    setSelected(temp[0]);
    setConfigurationList(temp);
  };

  return (
    <div className={styles.mainWrappingDiv} style={{ height: "70vh" }}>
      {spinner ? (
        <CircularProgress
          style={
            direction === RTL_DIRECTION
              ? { marginTop: "30vh", marginRight: "50%" }
              : { marginTop: "30vh", marginLeft: "50%" }
          }
        />
      ) : (
        <React.Fragment>
          <div className={styles.mainDiv}>
            <div className={styles.listDiv}>
              <div className={styles.listHeader}>
                <p
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.listHeading
                      : styles.listHeading
                  }
                >
                  {t("toolbox.serviceCatalogSap.configuration")}
                </p>
                <button
                  className={styles.secondaryBtn}
                  onClick={addNewSapFunction}
                  id="webS_addNewBtn"
                >
                  {t("addWithPlusIcon")} {t("New")}
                </button>
              </div>
              <div className={styles.searchHeader}>
                <SearchComponent width="90%" />
                <img src={Filter} className={styles.filterIcon} />
              </div>
              <SapList
                list={configurationList}
                selected={selected}
                selectionFunc={setSelected}
              />
            </div>
            <div className={styles.formDiv}>
              <SapForm
                selected={selected}
                setSelected={setSelected}
                setChangedSelection={setChangedSelection}
              />
            </div>
          </div>
          <div
            className={
              direction === RTL_DIRECTION ? arabicStyles.footer : styles.footer
            }
          >
            {selected?.status === STATE_ADDED ? (
              <button
                className={`${styles.cancelBtn} ${styles.pd025}`}
                onClick={() => handleSapservice(DELETE_CONSTANT)}
                id="webS_deleteBtn"
              >
                {t("delete")}
              </button>
            ) : selected?.status === STATE_EDITED ? (
              <React.Fragment>
                <button
                  className={`${styles.cancelBtn} ${styles.pd025}`}
                  onClick={cancelEditConfiguration}
                  id="webS_discardBtn"
                >
                  {t("discard")}
                </button>
                <button
                  className={`${styles.primaryBtn} ${styles.pd025}`}
                  onClick={() => handleSapservice(MODIFY_CONSTANT)}
                  id="webS_saveChangeBtn"
                >
                  {t("saveChanges")}
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <button
                  className={`${styles.cancelBtn} ${styles.pd025}`}
                  onClick={cancelAddConfig}
                  id="webS_discardAddBtn"
                >
                  {t("discard")}
                </button>
                <button
                  className={`${styles.primaryBtn} ${styles.pd025}`}
                  onClick={() => handleSapservice(ADD_CONSTANT)}
                  id="webS_addBtn"
                >
                  {t("Add SAP")}
                </button>
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Configuration;
