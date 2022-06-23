import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import { Checkbox } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import arabicStyles from "./ArabicStyles.module.css";
import { RTL_DIRECTION } from "../../../../../Constants/appConstants";

function Todo(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [todoItemData, setTodoItemData] = useState([]);

  const [checkTodo, setCheckTodo] = useState(false);

  const CheckTodoHandler = () => {
    setCheckTodo(!checkTodo);
  };

  useEffect(() => {
    let tempList = {
      ...(localLoadedActivityPropertyData &&
        localLoadedActivityPropertyData.ActivityProperty &&
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo &&
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo
          .objPMWdeskTodoLists &&
        localLoadedActivityPropertyData.ActivityProperty.wdeskInfo
          .objPMWdeskTodoLists.todoMap),
    };

    Object.keys(tempList).forEach((el) => {
      tempList[el] = { ...tempList[el] };
    });

    setTodoItemData(tempList);
  }, [localLoadedActivityPropertyData]);

  return (
    <div style={{ margin: "2%" }}>
      <div className={styles.checklist}>
        <Checkbox
          checked={checkTodo}
          onChange={() => CheckTodoHandler()}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.titleCheckbox
              : styles.titleCheckbox
          }
          data-testid="CheckTodo"
        />
        {t("todoList")}
      </div>
      <div className="row">
        <Checkbox
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.checkboxPosition
              : styles.checkboxPosition
          }
        />
        <h5>{t("todoName")}</h5>
      </div>
      {checkTodo ? (
        <div className="row" style={{ marginTop: "15px" }}>
          <Checkbox
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.checkboxPosition
                : styles.checkboxPosition
            }
          />

          {Object.keys(todoItemData) &&
            Object.keys(todoItemData).map((val) => {
              return <p className={styles.todoList}>{val}</p>;
            })}
        </div>
      ) : null}
    </div>
  );
}

export default Todo;
