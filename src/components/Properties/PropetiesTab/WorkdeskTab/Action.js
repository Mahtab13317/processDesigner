import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./todo.module.css";
import { Checkbox } from "@material-ui/core";
import ActivityRules from "../../../../components/Properties/PropetiesTab/ActivityRules";
import { store, useGlobalState } from "state-pool";

function Action(props) {
  let { t } = useTranslation();

  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [actionItemData, setActionItemData] = useState([]);
  const [checkAction, setCheckAction] = useState(false);

  const CheckActionHandler = () => {
    setCheckAction(!checkAction);
  };

  useEffect(() => {
    let tempArr = [];
    let tempList = {
      ...localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.m_objActionDetails?.actionMap,
    };

    Object.keys(tempList).forEach((el) => {
      tempArr.push(tempList[el]);
    });

    setActionItemData(tempArr);
  }, [localLoadedActivityPropertyData]);

  return (
    <div style={{ margin: "1%" }}>
      <div className={styles.checklist}>
        <Checkbox
          checked={checkAction}
          onChange={() => CheckActionHandler()}
          style={{ height: "20px", width: "20px", marginRight: "8px" }}
          data-testid="CheckAction"
        />
        {t("action")}
      </div>
      {checkAction ? (
        <div data-testid="ActionDiv">
          <ActivityRules calledFromAction={true} actionData={actionItemData} />
        </div>
      ) : null}
    </div>
  );
}

export default Action;
