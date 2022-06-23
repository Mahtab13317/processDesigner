import React, { useState, useEffect } from "react";
import styles from "./RulesDataTable.module.css";
import arabicStyles from "./RulesDataTableArabic.module.css";
import { useTranslation } from "react-i18next";
import {
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import { store, useGlobalState } from "state-pool";

function RuleDataTable(props) {
  let { t } = useTranslation();
  const [isDisable, setIsDisable] = useState(false);
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

  useEffect(() => {
    if (props.openProcessType === PROCESSTYPE_LOCAL) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [props.openProcessType]);

  return (
    <React.Fragment>
      <table className={styles.dataTable}>
        <thead className={styles.dataTableHead}>
          <tr>
            <th className={styles.dataTableHeadCell}>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.dataTableHeadCellContent
                    : styles.dataTableHeadCellContent
                }
              >
                {t("name")}
              </p>
            </th>
            {props.hideGroup ? null : (
              <th className={styles.dataTableHeadCell}>
                <p
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.dataTableHeadCellContent
                      : styles.dataTableHeadCellContent
                  }
                >
                  {t("group")}
                </p>
              </th>
            )}
            {isDisable ? (
              <th className={styles.dataTableHeadCell}>
                {props.tableContent.length > 0 ? (
                  <p
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.dataEntryAddRemoveBtnHeader
                        : styles.dataEntryAddRemoveBtnHeader
                    }
                    style={{
                      color: props.tableType == "remove" ? "red" : "#0072C6",
                    }}
                    onClick={props.headerEntityClickFunc}
                    id="headerEntity_rulesDataTable"
                  >
                    {props.tableType == "remove"
                      ? "- " + t("removeAll")
                      : "+ " + t("addAll")}
                  </p>
                ) : null}
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody
          className={
            props.tableContent.length > 0
              ? styles.dataTableBody
              : `relative ${styles.dataTableBody} ${styles.dataTableBodyWithNoData}`
          }
        >
          {props.tableContent && props.tableContent.length > 0 ? (
            props.tableContent.map((option, index) => {
              return (
                <tr className={styles.dataTableRow}>
                  <td
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.dataTableBodyCell
                        : styles.dataTableBodyCell
                    }
                  >
                    <div
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.dropdownVariable
                          : styles.dropdownVariable
                      }
                    >
                      <span>{option.Name}</span>
                    </div>
                  </td>
                  {props.hideGroup ? null : (
                    <td
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.dataTableBodyCell
                          : styles.dataTableBodyCell
                      }
                      style={{ width: "10rem" }}
                    >
                      <span className={styles.dropdownVariableType}>
                        {option.Group}
                      </span>
                    </td>
                  )}
                  {isDisable ? (
                    <td className={styles.dataTableBodyCell}>
                      <p
                        className={
                          direction === RTL_DIRECTION
                            ? `${arabicStyles.dataEntryAddRemoveBtnHeader} ${styles.mt025}`
                            : `${styles.dataEntryAddRemoveBtnHeader} ${styles.mt025}`
                        }
                        style={{
                          color:
                            props.tableType == "remove" ? "red" : "#0072C6",
                        }}
                        onClick={() => props.singleEntityClickFunc(option)}
                        id="singleEntity_rulesDataTable"
                      >
                        {props.tableType == "remove"
                          ? "- " + t("remove")
                          : "+ " + t("add")}
                      </p>
                    </td>
                  ) : null}
                </tr>
              );
            })
          ) : (
            <div className={styles.noDataEntryRecords}>
              {props.ruleDataTableStatement}
            </div>
          )}
        </tbody>
      </table>
    </React.Fragment>
  );
}

export default RuleDataTable;
