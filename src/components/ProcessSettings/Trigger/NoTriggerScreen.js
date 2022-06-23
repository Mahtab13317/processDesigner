import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import emptyStatePic from "../../../assets/ProcessView/EmptyState.svg";
import { Button, ClickAwayListener } from "@material-ui/core";
import { triggerTypeName } from "../../../utility/ProcessSettings/Triggers/triggerTypeOptions";
import ButtonDropdown from "../../../UI/ButtonDropdown";
import styles from "./trigger.module.css";
import {
  PROCESSTYPE_LOCAL,
  STATE_CREATED,
} from "../../../Constants/appConstants";

function NoTriggerScreen(props) {
  let { t } = useTranslation();
  const {
    hideLeftPanel,
    processType,
    setTypeInput,
    setTriggerData,
    setSelectedField,
    typeList,
  } = props;
  const [showTypeOption, setShowTypeOptions] = useState(false);
  let readOnlyProcess = processType !== PROCESSTYPE_LOCAL;

  const createNewTrigger = (triggerType) => {
    setShowTypeOptions(false);
    setTypeInput(triggerType);
    let newId = 1;
    setTriggerData((prev) => {
      let newData = [];
      if (prev.length > 0) {
        newData = [...prev];
      }
      newData.push({
        TriggerId: newId,
        TriggerName: t("newTrigger"),
        TriggerType: triggerType,
        status: STATE_CREATED,
      });
      return newData;
    });
    setSelectedField({
      id: newId,
      name: t("newTrigger"),
      type: triggerType,
      status: STATE_CREATED,
    });
  };

  return (
    <div
      className={
        readOnlyProcess
          ? styles.deployedNoTriggerScreen
          : styles.noTriggerScreen
      }
    >
      {!hideLeftPanel ? (
        <div>
          <img src={emptyStatePic} />
          <p className={styles.notriggerAddedString}>{t("noTriggerAdded")}</p>
        </div>
      ) : null}
      {readOnlyProcess ? null : (
        <ClickAwayListener onClickAway={() => setShowTypeOptions(false)}>
          <Button
            className={styles.addTriggerButton}
            onClick={() => setShowTypeOptions(true)}
            id="noTriggerScreen_add_btn"
          >
            {t("add") + " " + t("trigger")}
            <ButtonDropdown
              open={showTypeOption}
              dropdownOptions={typeList}
              onSelect={createNewTrigger}
              optionRenderFunc={triggerTypeName}
              id="noTrigger_add_dropdown"
              style={{ maxHeight: "14rem" }}
            />
          </Button>
        </ClickAwayListener>
      )}
    </div>
  );
}

export default NoTriggerScreen;
