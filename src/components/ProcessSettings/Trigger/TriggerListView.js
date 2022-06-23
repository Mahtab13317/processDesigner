import React from "react";
import { useTranslation } from "react-i18next";
import { triggerTypeOptions } from "../../../utility/ProcessSettings/Triggers/triggerTypeOptions";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { Divider } from "@material-ui/core";
import styles from "./trigger.module.css";
import arabicStyles from "./triggerArabicStyles.module.css";
import { RTL_DIRECTION } from "../../../Constants/appConstants";

function TriggerListView(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let { addedTriggerTypes, triggerData, onFieldSelection, selectedField } =
    props;

  return (
    <div
      className={
        direction === RTL_DIRECTION
          ? arabicStyles.triggerListView
          : styles.triggerListView
      }
    >
      {addedTriggerTypes?.length > 0 &&
        addedTriggerTypes.map((option) => {
          return (
            <div className={styles.triggerTypeList}>
              <p className={styles.triggerTypeHeading}>
                {t(triggerTypeOptions(option)[0])}
              </p>
              {triggerData?.map((trigger) => {
                if (trigger.TriggerType === option) {
                  return (
                    <div
                      id={`trigger_listItem_${trigger.TriggerId}`}
                      onClick={() => onFieldSelection(trigger)}
                    >
                      <span
                        className={
                          selectedField?.id === trigger.TriggerId
                            ? direction === RTL_DIRECTION
                              ? `${arabicStyles.triggerListRow} ${arabicStyles.selectedTriggerListRow}`
                              : `${styles.triggerListRow} ${styles.selectedTriggerListRow}`
                            : direction === RTL_DIRECTION
                            ? arabicStyles.triggerListRow
                            : styles.triggerListRow
                        }
                      >
                        <FlashOnIcon
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.FlashOnIcon
                              : styles.FlashOnIcon
                          }
                        />
                        {trigger.TriggerName}
                      </span>
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
    </div>
  );
}

export default TriggerListView;
