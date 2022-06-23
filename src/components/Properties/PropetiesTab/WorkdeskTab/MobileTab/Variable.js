import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import { Checkbox } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import arabicStyles from "./ArabicStyles.module.css";
import { RTL_DIRECTION } from "../../../../../Constants/appConstants";

function Variable(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  // const [docItemData, setDocItemData] = useState(
  //   localLoadedActivityPropertyData.ActivityProperty.wdeskInfo
  // );

  const [checkVariable, setcheckVariable] = useState(false);

  const CheckVariableHandler = () => {
    setcheckVariable(!checkVariable);
  };

  const activityDetails = [
    {
      name: "Client Name",
      aliasName: "Client_Name",
      bRead: false,
      bModify: false,
    },
    { name: "Client ID", aliasName: "Client_Id", bRead: false, bModify: true },
    {
      name: "Client Type",
      aliasName: "Client_Type",
      bRead: false,
      bModify: false,
    },
    {
      name: "Expenditure Date",
      aliasName: "Expenditure Date",
      bRead: true,
      bModify: true,
    },
    {
      name: "Customer Name",
      aliasName: "Customer_Name",
      bRead: true,
      bModify: true,
    },
    {
      name: "Customer Age",
      aliasName: "Customer_Age",
      bRead: true,
      bModify: true,
    },
    {
      name: "Customer Contact Info",
      aliasName: "Customer_Contact Info",
      bRead: true,
      bModify: true,
    },
    {
      name: "Customer Address Info",
      aliasName: "Customer_Address Info",
      bRead: true,
      bModify: true,
    },
  ];

  return (
    <div style={{ margin: "2%" }}>
      <div className={styles.checklist}>
        <Checkbox
          checked={checkVariable}
          onChange={() => CheckVariableHandler()}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.titleCheckbox
              : styles.titleCheckbox
          }
          data-testid="CheckVariable"
        />
        {t("variable")}
      </div>
      <div className="row">
        <Checkbox
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.checkboxPosition
              : styles.checkboxPosition
          }
        />
        <h5> {t("variable")}</h5>
      </div>
      {checkVariable
        ? activityDetails.map((val) => {
            if (val.bRead == true || val.bModify == true) {
              return (
                <div className="row" style={{ marginTop: "15px" }}>
                  <Checkbox
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.checkboxPosition
                        : styles.checkboxPosition
                    }
                  />
                  <p className={styles.todoList}> {val.name}</p>
                </div>
              );
            }
          })
        : null}
    </div>
  );
}

export default Variable;
