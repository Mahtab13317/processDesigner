import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { SPACE } from "../../../../../Constants/appConstants";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

function OperationStrip(props) {
  let { t } = useTranslation();
  const {
    index,
    isNested,
    handleSelectedOp,
    selectedOp,
    getOperationLabel,
    opType,
    deleteOpHandler,
    tableDetails,
    isReadOnly,
  } = props;
  const [operationName, setOperationName] = useState("");
  const [selectedTableString, setSelectedTableString] =
    useState("No table selected");

  // Function that runs when the component loads.
  useEffect(() => {
    setOperationName(getOperationLabel(opType));
  }, []);

  // Function that runs when the values of tableDetails and isNested changes.
  useEffect(() => {
    if (isNested) {
      const tempArr = tableDetails[index].selectedTableNames;
      let tableNameStr = "";
      tempArr.forEach((element, ind) => {
        if (ind < 3) {
          tableNameStr = tableNameStr.concat(
            ind === 0 ? element.TableName : `,${element.TableName}`
          );
        }
      });
      if (tempArr.length > 3) {
        tableNameStr = tableNameStr.concat(
          `,`,
          SPACE,
          "+",
          `${tempArr.length - 3}`,
          SPACE,
          `${t("More")}`
        );
      }
      if (tableNameStr.length !== 0) {
        setSelectedTableString(tableNameStr);
      } else {
        setSelectedTableString("No table selected");
      }
    } else {
      if (tableDetails[index]?.selectedTableName?.length !== 0) {
        setSelectedTableString(tableDetails[index].selectedTableName);
      } else {
        setSelectedTableString("No table selected");
      }
    }
  }, [tableDetails, isNested]);

  return (
    <div className={styles.flexRow}>
      <div
        onClick={() => handleSelectedOp(index)}
        className={clsx(
          selectedOp === index ? styles.opListDivSelected : styles.opListDiv,
          styles.flexRow
        )}
      >
        {operationName !== "" ? (
          <div className={clsx(styles.flexColumn, styles.opDetailsDiv)}>
            <p className={styles.opName}>
              {operationName}
              {SPACE}
              {index + 1}
            </p>
            <p className={styles.selectedTable}>{selectedTableString}</p>
          </div>
        ) : null}
        {!isReadOnly && (
          <DeleteOutlinedIcon
            id="OS_Delete_Operation_Btn"
            className={styles.deleteOpIcon}
            onClick={(event) => deleteOpHandler(index, event)}
          />
        )}
      </div>
    </div>
  );
}

export default OperationStrip;
