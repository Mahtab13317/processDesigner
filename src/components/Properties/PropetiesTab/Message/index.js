import { Checkbox } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import axios from "axios";
import {
  propertiesLabel,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { store, useGlobalState } from "state-pool";
import { useDispatch } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

function Message(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const loadedProcessData = store.getState("loadedProcessData");
  const localActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(localActivityPropertyData);
  const [searchVariables, setsearchVariables] = useState([]);
  const [allCheckedBool, setallCheckedBool] = useState(false);
  const [webServiceLocation, setwebServiceLocation] = useState(
    t("webServiceLocationNotDefined")
  );
  const [isDisabled, setisDisabled] = useState(false);
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut);
  
  useEffect(() => {
    const getSearchVariables = async () => {
      const res = await axios.get(
        SERVER_URL +
          `/searchVar?processDefId=${localLoadedProcessData.ProcessDefId}&processState=${localLoadedProcessData.ProcessType}`
      );
      setsearchVariables(res.data?.SearchVariable);
    };
    getSearchVariables();
  }, []);

  useEffect(() => {
    if (
      localLoadedActivityPropertyData?.ActivityProperty.hasOwnProperty(
        "msgInfo"
      )
    ) {
      let actArr =
        localLoadedActivityPropertyData?.ActivityProperty.msgInfo.msgVarList.map(
          (_var) => _var.processVarInfo.variableId
        );
      let searchArr = searchVariables.map((_var) => _var.VariableId);
      if (arrayCompare(actArr, searchArr)) {
        setallCheckedBool(true);
      }
      setwebServiceLocation(
        localLoadedActivityPropertyData?.ActivityProperty.msgInfo.webServiceURL
      );
    }
    if (localLoadedProcessData.ProcessType === "R") {
      setisDisabled(true);
    }
  }, [searchVariables]);

  const getCheckHandler = (varData) => {
    let temp = false;
    if (
      localLoadedActivityPropertyData?.ActivityProperty.hasOwnProperty(
        "msgInfo"
      )
    ) {
      localLoadedActivityPropertyData?.ActivityProperty?.msgInfo?.msgVarList.forEach(
        (_var) => {
          if (_var?.processVarInfo.variableId == varData.VariableId)
            temp = true;
        }
      );
    }

    return temp;
  };

  const checkChangeHandler = (e, varData) => {
    let temp = global.structuredClone(localLoadedActivityPropertyData);

    if (!temp.ActivityProperty.hasOwnProperty("msgInfo")) {
      let msgInfo = {
        msgVarList: [],

        webServiceURL: "Web Service Location is not defined",

        msgVarMap: {},
      };

      temp.ActivityProperty.msgInfo = msgInfo;
    }

    if (e.target.checked) {
      temp.ActivityProperty.msgInfo.msgVarList.push({
        isSelected: true,

        processVarInfo: {
          varName: varData.FieldName,

          variableId: varData.VariableId,

          varFieldId: "0",
        },
      });
    } else {
      temp.ActivityProperty.msgInfo.msgVarList.forEach((_var, index) => {
        if (_var.processVarInfo.variableId == varData.VariableId) {
          temp.ActivityProperty.msgInfo.msgVarList.splice(index, 1);
        }
      });
    }
    checkforAllChecked(temp.ActivityProperty.msgInfo.msgVarList);
    setlocalLoadedActivityPropertyData(temp);
    enableSaveBtn();
  };

  const enableSaveBtn = () => {
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.message]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };
  const allCheckHandler = (e) => {
    setallCheckedBool(e.target.checked);
    let temp = global.structuredClone(localLoadedActivityPropertyData);
    if (!temp.ActivityProperty.hasOwnProperty("msgInfo")) {
      let msgInfo = {
        msgVarList: [],

        webServiceURL: "Web Service Location is not defined",

        msgVarMap: {},
      };

      temp.ActivityProperty.msgInfo = msgInfo;
    }
    if (e.target.checked) {
      temp.ActivityProperty.msgInfo.msgVarList = [];
      searchVariables.forEach((_var) => {
        temp.ActivityProperty.msgInfo.msgVarList.push({
          isSelected: true,

          processVarInfo: {
            varName: _var.FieldName,

            variableId: _var.VariableId,

            varFieldId: "0",
          },
        });
      });
    } else {
      temp.ActivityProperty.msgInfo.msgVarList = [];
    }
    checkforAllChecked(temp.ActivityProperty.msgInfo.msgVarList);
    setlocalLoadedActivityPropertyData(temp);
    enableSaveBtn();
  };
  const checkforAllChecked = (arr) => {
    let actArr = arr.map((_var) => _var.processVarInfo.variableId);
    let searchArr = searchVariables.map((_var) => _var.VariableId);

    if (arrayCompare(actArr, searchArr)) {
      setallCheckedBool(true);
    } else setallCheckedBool(false);
  };
  const arrayCompare = (_arr1, _arr2) => {
    if (
      !Array.isArray(_arr1) ||
      !Array.isArray(_arr2) ||
      _arr1.length !== _arr2.length
    ) {
      return false;
    } else if (_arr1.length === 0 || _arr2.length === 0) return false;

    // .concat() to not mutate arguments
    const arr1 = _arr1.concat().sort();
    const arr2 = _arr2.concat().sort();

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className={styles.mainDiv}>
      <div className="headingSectionTab">{<h4>{props?.heading}</h4>}</div>
      <div className={styles.row}>
        <p className={styles.heading}>{t("webserviceLocation")}</p>
        <input
          type="text"
          value={webServiceLocation}
          disabled={true}
          style={{ width: "34rem", height: "2.5rem !important" }}
         
        />
      </div>
      <div className={styles.varRow}>
        <p className={styles.heading}>{t("variable(s)")}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "row",
            width: "10%",
            alignItems: "center",
          }}
        >
          <Checkbox
            checked={allCheckedBool}
            onChange={allCheckHandler}
            disabled={isDisabled || isReadOnly}
            
          />
          <span className={styles.heading} style={{ marginInline: "0.5rem" }}>
            {t("search")}
          </span>
        </div>
      </div>
      <div className={styles.variableContainer}>
        {searchVariables.map((_var) => {
          return (
            <div className={styles.varRow}>
              <p className={styles.heading} style={{ fontWeight: "500" }}>
                {_var.FieldName}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  width: "10%",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  checked={getCheckHandler(_var)}
                  onChange={(e) => checkChangeHandler(e, _var)}
                  disabled={isDisabled || isReadOnly}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Message;
