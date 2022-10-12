import React, { useState, useEffect } from "react";
import { LightTooltip } from "../../../../../../../UI/StyledTooltip";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import clsx from "clsx";

function RuleStatement(props) {
  let { t } = useTranslation();
  const {
    index,
    rules,
    isRuleBeingCreated,
    buildRuleStatement,
    shortenRuleStatement,
    calledFromAction,
    isOtherwiseSelected,
    action,
  } = props;

  const [ruleDescription, setRuleDescription] = useState("");
  const [showDragIcon, setShowDragIcon] = useState(false);

  // Function that runs when rules changes.
  useEffect(() => {
    if (rules) {
      setRuleDescription(buildRuleStatement(index));
    }
  }, [rules]);

  return (
    <div
      className={clsx(styles.flexRow, styles.ruleStatementDiv)}
      onMouseOver={() => setShowDragIcon(true)}
      onMouseLeave={() => setShowDragIcon(false)}
    >
      {!isRuleBeingCreated && (
        <>
          {!isOtherwiseSelected && showDragIcon ? (
            <DragIndicatorIcon
              // {...provided.dragHandleProps}
              style={{
                color: "#606060",
                height: "1.5rem",
                width: "1.5rem",
                marginRight: "5px",
              }}
            />
          ) : (
            <p className={styles.ruleOrderNo}>{index + 1}.</p>
          )}
        </>
      )}
      <LightTooltip
        id="ES_Tooltip"
        arrow={true}
        enterDelay={500}
        placement="bottom"
        title={ruleDescription}
      >
        {isRuleBeingCreated ? (
          <p>{calledFromAction ? t("newAction") : t("newRule")}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {calledFromAction && (
              <p style={{ fontWeight: "600" }}>{action.actionName}</p>
            )}
            <p>{shortenRuleStatement(ruleDescription, 120)}</p>
          </div>
        )}
      </LightTooltip>
    </div>
  );
}

export default RuleStatement;
