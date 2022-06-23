import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import Filter from "../../../assets/Tiles/Filter.svg";
import SearchComponent from "../../../UI/Search Component/index";
import Tab from "../../../UI/Tab/Tab";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { store, useGlobalState } from "state-pool";
import { connect, useDispatch } from "react-redux";
import { setToastDataFunc } from "../../../redux-store/slices/ToastDataHandlerSlice";
import { CircularProgress } from "@material-ui/core";
import {
  ADD_CONSTANT,
  DELETE_CONSTANT,
  ENDPOINT_REGISTER_SAP,
  ENDPOINT_SAP_FUNCTION,
  ENDPOINT_SAVE_FUNCTION_SAP,
  MODIFY_CONSTANT,
  RTL_DIRECTION,
  SERVER_URL,
  STATE_ADDED,
  STATE_CREATED,
  STATE_EDITED,
} from "../../../Constants/appConstants";
import SapFunctionList from "./SapFunctionList";
import SapFunctionForm from "./SapFunctionForm";

function Function(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const dispatch = useDispatch();
  const [spinner, setspinner] = useState(true);
  const [functionList, setfunctionList] = useState([]);
  const [configList, setConfigList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [changedSelection, setChangedSelection] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);

  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          ENDPOINT_SAP_FUNCTION +
          "/" +
          localLoadedProcessData.ProcessDefId +
          "/" +
          localLoadedProcessData.ProcessType
      )
      .then((res) => {
        setConfigList(res.data.SAPConfig);
        let sapFuncList = [...res.data.SAPFunctions];
        let tempFuncList = [];

        sapFuncList?.forEach((el) => {
          tempFuncList.push({
            ...el,
            status: STATE_ADDED,
          });
        });
        setfunctionList(tempFuncList);
        if (tempFuncList?.length > 0) {
          setSelected(tempFuncList[0]);
          setSelectedConfig(() => {
            let temp = null;
            res?.data?.SAPConfig?.forEach((con) => {
              if (con.SAPConfigId === tempFuncList[0].SAPConfigId) {
                temp = con;
              }
            });
            return temp;
          });
        }
        setspinner(false);
      });
  }, []);

  const addNewSapFunction = () => {
    let temp = [...functionList];
    let indexVal;
    let maxId = 0;
    //to remove existing temporary SAP from list, before adding new temporary SAP
    temp?.forEach((webS, index) => {
      if (webS.status && webS.status === STATE_CREATED) {
        indexVal = index;
      }
      if (maxId < webS.FunctionID) {
        maxId = webS.FunctionID;
      }
    });
    if (indexVal >= 0) {
      temp.splice(indexVal, 1);
    }
    temp.splice(0, 0, {
      FunctionName: t("toolbox.serviceCatalogSap.newFunction"),
      FunctionID: maxId + 1,
      status: STATE_CREATED,
    });
    setSelected(temp[0]);
    setfunctionList(temp);
  };
  const handleFunctionSAP = (statusConstant) => {
    let paramTypeMap = {},
      isValid = true;
    let paramList = [];
    selected?.ComplexParamType?.forEach((el) => {
      paramTypeMap = {
        ...paramTypeMap,
        [el.Name]: {
          paramName: el.Name,
          unbounded: el.Unbounded,
          paramType: el.Type,
          paramTypeName: el.TypeName,
          optional: el.Optional,
        },
      };
    });

    if (selected?.ParameterDetails?.length > 0) {
      paramList = selected?.ParameterDetails?.map((el) => {
        return {
          paramIndex: el.Index,
          paramName: el.Name,
          unbounded: el.Unbounded,
          parameterType: el.ParameterType,
          paramType: el.Type,
          paramTypeName: el.TypeName,
          optional: el.Optional,
        };
      });
    } else {
      paramList = [];
    }

    let json = {
      processDefId: localLoadedProcessData.ProcessDefId,
      methodIndex: selected.FunctionID,
      functionName: changedSelection.functionName,
      objSAPConfiguration: {
        iConfigurationId: parseInt(changedSelection.iConfigurationId),
      },
      status: statusConstant,
      paramList: paramList,
      mapComplexParamType: paramTypeMap,
    };

    if (
      selected?.status == STATE_CREATED &&
      (changedSelection.configuration == "" ||
        changedSelection.hostName == "" ||
        changedSelection.clientName == "" ||
        changedSelection.password == "" ||
        changedSelection.language == "" ||
        changedSelection.instanceNo == "" ||
        changedSelection.username == "")
    ) {
      isValid = false;
      dispatch(
        setToastDataFunc({
          message: t("mandatoryErrorStatement"),
          severity: "error",
          open: true,
        })
      );
    }
    if (isValid) {
      axios.post(SERVER_URL + ENDPOINT_SAVE_FUNCTION_SAP, json).then((res) => {
        if (res.data.Status === 0) {
          let tempConfig = [...configList];
          if (statusConstant === ADD_CONSTANT) {
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
          } else if (statusConstant === MODIFY_CONSTANT) {
          }
          setConfigList(tempConfig);
        }
      });
    }
  };
  const cancelEditWebservice = () => {};
  const cancelAddWebservice = () => {};

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
                  {t("Function")}
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
              <SapFunctionList
                list={functionList}
                selected={selected}
                selectionFunc={(val) => {
                  setSelected(val);
                  setSelectedConfig(() => {
                    let temp = null;
                    configList?.forEach((con) => {
                      if (con.SAPConfigId === val.SAPConfigId) {
                        temp = con;
                      }
                    });
                    return temp;
                  });
                }}
              />
            </div>
            <div className={styles.formDiv}>
              <SapFunctionForm
                selected={selected}
                setSelected={setSelected}
                setChangedSelection={setChangedSelection}
                selectedConfig={selectedConfig}
                configList={configList}
                changedSelection={changedSelection}
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
                onClick={() => handleFunctionSAP(DELETE_CONSTANT)}
                id="webS_deleteBtn"
              >
                {t("delete")}
              </button>
            ) : selected?.status === STATE_EDITED ? (
              <React.Fragment>
                <button
                  className={`${styles.cancelBtn} ${styles.pd025}`}
                  onClick={cancelEditWebservice}
                  id="webS_discardBtn"
                >
                  {t("discard")}
                </button>
                <button
                  className={`${styles.primaryBtn} ${styles.pd025}`}
                  onClick={() => handleFunctionSAP(MODIFY_CONSTANT)}
                  id="webS_saveChangeBtn"
                >
                  {t("saveChanges")}
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <button
                  className={`${styles.cancelBtn} ${styles.pd025}`}
                  onClick={cancelAddWebservice}
                  id="webS_discardAddBtn"
                >
                  {t("discard")}
                </button>
                <button
                  className={`${styles.primaryBtn} ${styles.pd025}`}
                  onClick={() => handleFunctionSAP(ADD_CONSTANT)}
                  id="webS_addBtn"
                >
                  {t("RegisterSap")}
                </button>
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Function;
