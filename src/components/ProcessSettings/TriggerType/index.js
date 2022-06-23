import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import { InputBase } from "@material-ui/core";
import { useDispatch } from "react-redux";
import {
  ENDPOINT_GET_REGISTER_TRIGGER,
  RTL_DIRECTION,
  SERVER_URL,
} from "../../../Constants/appConstants";
import cancelIcon from "../../../assets/abstractView/RedDelete.svg";
import axios from "axios";
import { setToastDataFunc } from "../../../redux-store/slices/ToastDataHandlerSlice";
import { REGEX, validateRegex } from "../../../validators/validator";

function TriggerType(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [allTrigers, setallTrigers] = useState([]);
  const [edited, setedited] = useState(null);
  const [registerBtn, setRegisterBtn] = useState(false);
  const [data, setdata] = useState({});
  const [originalData, setoriginalData] = useState([]);
  const dispatch = useDispatch();
  const registerNewLocalHandler = () => {
    setRegisterBtn(true);
  };

  const registerNew = () => {
    if (
      data.triggerPropertyPath &&
      data.triggerPropertyPath.indexOf("http://") !== 0 &&
      data.triggerPropertyPath &&
      data.triggerPropertyPath.indexOf("https://") !== 0
    ) {
      dispatch(
        setToastDataFunc({
          message: t("propertyPathError"),
          severity: "error",
          open: true,
        })
      );
    }

    if (
      data.triggerExecutionPath &&
      data.triggerExecutionPath.indexOf("http://") !== 0 &&
      data.triggerExecutionPath &&
      data.triggerExecutionPath.indexOf("https://") !== 0
    ) {
      dispatch(
        setToastDataFunc({
          message: t("executionHttpPath"),
          severity: "error",
          open: true,
        })
      );
    }

    if (!validateRegex(data.tableNames, REGEX.AlphaNumUsDashSpace)) {
      dispatch(
        setToastDataFunc({
          message: "Only _ is allowed as special character in Table name",
          severity: "error",
          open: true,
        })
      );
    }

    let isExist = false;
    allTrigers.map((el) => {
      if (el.tableNames == data.tableNames) {
        isExist = true;
      }
    });
    if (isExist) {
      dispatch(
        setToastDataFunc({
          message: "Trigger Name already exist",
          severity: "error",
          open: true,
        })
      );
    }

    let jsonBody = {
      triggerTypeName: data.triggerTypeName,
      triggerPropertyPath: data.triggerPropertyPath,
      triggerExecutionPath: data.triggerExecutionPath,
      tableNames: data.tableNames,
    };

    axios
      .post(SERVER_URL + ENDPOINT_GET_REGISTER_TRIGGER, jsonBody)
      .then((res) => {
        let temp = [...allTrigers];
        temp.push(jsonBody);
        setallTrigers(temp);
        setoriginalData(temp);
        setRegisterBtn(false);
      });
  };

  const cancelHandler = () => {
    setRegisterBtn(false);
  };

  useEffect(() => {
    axios
      .get(SERVER_URL + ENDPOINT_GET_REGISTER_TRIGGER)
      .then((res) => {
        setallTrigers(res.data);
        setoriginalData(res.data);
      })
      .catch(() => console.log("error"));
  }, []);

  const onDataChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };
  const editDataHandler = (index, e) => {
    let temp = JSON.parse(JSON.stringify(allTrigers));
    temp[index][e.target.name] = e.target.value;
    setallTrigers(temp);
  };

  const cancelChanges = (index) => {
    let temp = JSON.parse(JSON.stringify(allTrigers));
    temp[index] = JSON.parse(JSON.stringify(originalData[index]));
    setallTrigers(temp);
    setedited(null);
  };

  const saveChanges = (index) => {
    let jsonBody = {
      triggerTypeName: allTrigers[index].triggerTypeName,
      triggerPropertyPath: allTrigers[index].triggerPropertyPath,
      triggerExecutionPath: allTrigers[index].triggerExecutionPath,
      tableNames: allTrigers[index].tableNames,
    };

    axios
      .put(SERVER_URL + ENDPOINT_GET_REGISTER_TRIGGER, jsonBody)
      .then((res) => {
        setedited(null);
      });
  };

  const deleteHandler = (el) => {
    let json = {
      triggerTypeName: el,
    };
    axios
      .delete(SERVER_URL + ENDPOINT_GET_REGISTER_TRIGGER, {
        data: json,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        allTrigers.forEach((val, index) => {
          if (val.triggerTypeName == el) {
            allTrigers.splice(index, 1);
          }
        });
      });
  };

  return (
    <div style={{ marginLeft: "1rem" }}>
      <h4>{t("triggerTypes")}</h4>
      <p className={styles.subheader}>{t("listOfTrigger")}</p>

      <div className={styles.headerDiv}>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.aliasNameHeader
              : styles.aliasNameHeader
          }
          style={{ marginLeft: "21px" }}
        >
          {t("triggerType")}
        </p>

        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.aliasNameHeader
              : styles.aliasNameHeader
          }
          style={{ marginLeft: "6rem" }}
        >
          {t("propertyHttpPath")}
        </p>

        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.aliasNameHeader
              : styles.aliasNameHeader
          }
          style={{ marginLeft: "4.2rem" }}
        >
          {t("executionHttpPath")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.aliasNameHeader
              : styles.aliasNameHeader
          }
          style={{ marginLeft: "3.2rem" }}
        >
          {t("tableName")}
        </p>

        <button
          className={styles.registerNewButton}
          onClick={registerNewLocalHandler}
        >
          {t("registerNew")}
        </button>
      </div>
      {registerBtn ? (
        <React.Fragment>
          <InputBase
            id="type_field_mapping_alias_name_input"
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.inputbaseRtl
                : styles.inputbaseLtr1
            }
            variant="outlined"
            value={data.triggerTypeName}
            name="triggerTypeName"
            onChange={onDataChange}
          />
          <InputBase
            id="type_field_mapping_alias_name_input"
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.inputbaseRtl
                : styles.inputbaseLtr1
            }
            variant="outlined"
            value={data.triggerPropertyPath}
            name="triggerPropertyPath"
            onChange={onDataChange}
          />
          <InputBase
            id="type_field_mapping_alias_name_input"
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.inputbaseRtl
                : styles.inputbaseLtr
            }
            variant="outlined"
            value={data.triggerExecutionPath}
            name="triggerExecutionPath"
            onChange={onDataChange}
          />
          <InputBase
            id="type_field_mapping_alias_name_input"
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.inputbaseRtl
                : styles.inputbaseLtr
            }
            variant="outlined"
            value={data.tableNames}
            name="tableNames"
            onChange={onDataChange}
          />
          <button className={styles.cancelButton} onClick={cancelHandler}>
            {t("cancel")}
          </button>
          <button
            className={styles.registerNewButton}
            style={{ marginLeft: "1rem", marginRight: "8rem" }}
            onClick={registerNew}
          >
            {t("register")}
          </button>
        </React.Fragment>
      ) : null}

      {allTrigers &&
        allTrigers.map((val, index) => {
          return (
            <React.Fragment>
              <InputBase
                id="type_field_mapping_alias_name_input"
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.inputbaseRtl
                    : styles.inputbaseLtr1
                }
                variant="outlined"
                name="triggerTypeName"
                value={val.triggerTypeName}
                onChange={(e) => {
                  editDataHandler(index, e);
                  setedited(index);
                }}
              />
              <InputBase
                id="type_field_mapping_alias_name_input"
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.inputbaseRtl
                    : styles.inputbaseLtr1
                }
                variant="outlined"
                value={val.triggerPropertyPath}
                name="triggerPropertyPath"
                onChange={(e) => {
                  editDataHandler(index, e);
                  setedited(index);
                }}
              />
              <InputBase
                id="type_field_mapping_alias_name_input"
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.inputbaseRtl
                    : styles.inputbaseLtr
                }
                variant="outlined"
                value={val.triggerExecutionPath}
                name="triggerExecutionPath"
                onChange={(e) => {
                  editDataHandler(index, e);
                  setedited(index);
                }}
              />
              <InputBase
                id="type_field_mapping_alias_name_input"
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.inputbaseRtl
                    : styles.inputbaseLtr
                }
                variant="outlined"
                value={val.tableNames}
                name="tableNames"
                onChange={(e) => {
                  editDataHandler(index, e);
                  setedited(index);
                }}
              />
              {edited == index ? (
                <>
                  <button
                    className={styles.cancelButton}
                    onClick={() => cancelChanges(index)}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    className={styles.registerNewButton}
                    style={{ marginLeft: "1rem", marginRight: "10rem" }}
                    onClick={() => saveChanges(index)}
                  >
                    {t("save")}
                  </button>
                </>
              ) : (
                <img
                  src={cancelIcon}
                  onClick={() => deleteHandler(val.triggerTypeName)}
                  style={{ marginLeft: "6rem", marginRight: "15rem" }}
                />
              )}
            </React.Fragment>
          );
        })}
    </div>
  );
}

export default TriggerType;
