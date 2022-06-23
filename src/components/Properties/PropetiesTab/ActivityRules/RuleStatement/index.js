import React, { useState, useEffect } from "react";
import { LightTooltip } from "../../../../../UI/StyledTooltip";
import { useTranslation } from "react-i18next";

function RuleStatement(props) {
  let { t } = useTranslation();
  const {
    index,
    rules,
    isRuleBeingCreated,
    buildRuleStatement,
    shortenRuleStatement,
    registeredFunctions,
    registeredOptionsLabelsData,
  } = props;
  const [ruleDescription, setRuleDescription] = useState("");
  useEffect(() => {
    if (rules) {
      setRuleDescription(buildRuleStatement(index));
    }
  }, [rules, registeredFunctions, registeredOptionsLabelsData]);
  return (
    <div>
      <LightTooltip
        id="ES_Tooltip"
        arrow={true}
        enterDelay={500}
        placement="bottom"
        title={ruleDescription}
      >
        {isRuleBeingCreated ? (
          <p>{t("newRule")}</p>
        ) : (
          <p>{shortenRuleStatement(ruleDescription, 120)}</p>
        )}
      </LightTooltip>
    </div>
  );
}

export default RuleStatement;
