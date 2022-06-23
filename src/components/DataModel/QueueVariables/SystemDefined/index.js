import React from "react";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "state-pool";
import { RTL_DIRECTION } from "../../../../Constants/appConstants";
import { getVariableTypeByScope } from "../../../../utility/DataModel/QueueVariables";
import { getVariableType } from "../../../../utility/ProcessSettings/Triggers/getVariableType";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";

function SystemDefined(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [variableDefinition] = useGlobalState("variableDefinition");
  return (
    <div>
      <div className={styles.headerDiv}>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.variableName
              : styles.variableName
          }
        >
          {t("variableName")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.variableType
              : styles.variableType
          }
        >
          {t("variableType")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.dataType
              : styles.dataType
          }
        >
          {t("dataType")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.defaultValue
              : styles.defaultValue
          }
        >
          {t("defaultValue")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.variableLength
              : styles.variableLength
          }
        >
          {t("length")}
        </p>
      </div>
      {variableDefinition
        ?.filter((e) => e.VariableScope === "M" || e.VariableScope === "S")
        ?.map((d) => {
          return (
            <div className={styles.dataDiv}>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.variableNameData
                    : styles.variableNameData
                }
              >
                {d.VariableName}
              </p>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.variableTypeData
                    : styles.variableTypeData
                }
              >
                {t(getVariableTypeByScope(d.VariableScope))}
              </p>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.dataTypeValue
                    : styles.dataTypeValue
                }
              >
                {getVariableType(d.VariableType)}
              </p>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.defaultValueData
                    : styles.defaultValueData
                }
              >
                {d.DefaultValue}
              </p>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.variableLengthData
                    : styles.variableLengthData
                }
              >
                {d.VariableLength}
              </p>
            </div>
          );
        })}
    </div>
  );
}

export default SystemDefined;
