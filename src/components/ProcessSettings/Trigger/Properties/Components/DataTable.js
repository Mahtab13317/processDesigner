import React from "react";
import styles from "../properties.module.css";
import arabicStyles from "../propertiesArabicStyles.module.css";
import { useTranslation } from "react-i18next";
import { getVariableType } from "../../../../../utility/ProcessSettings/Triggers/getVariableType";
import {
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
} from "../../../../../Constants/appConstants";
import { connect } from "react-redux";

function DataTable(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

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
            <th className={styles.dataTableHeadCell}>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.dataTableHeadCellContent
                    : styles.dataTableHeadCellContent
                }
              >
                {t("type")}
              </p>
            </th>
            {!readOnlyProcess ? (
              <th className={styles.dataTableHeadCell}>
                {props.tableContent?.length > 0 ? (
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
                    id={`${props.id}_all`}
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
            props.tableContent?.length > 0
              ? styles.dataTableBody
              : `relative ${styles.dataTableBody} ${styles.dataTableBodyWithNoData}`
          }
        >
          {props.tableContent?.length > 0 ? (
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
                      <span>{option.VariableName}</span>
                      <span>{option.SystemDefinedName}</span>
                    </div>
                  </td>
                  <td
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.dataTableBodyCell
                        : styles.dataTableBodyCell
                    }
                  >
                    <span className={styles.dropdownVariableType}>
                      {t(getVariableType(option.VariableType))}
                    </span>
                  </td>
                  {!readOnlyProcess ? (
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
                        id={`${props.id}_item${index}`}
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
              {t("dataEntryNoRecords")}
            </div>
          )}
        </tbody>
      </table>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps, null)(DataTable);
