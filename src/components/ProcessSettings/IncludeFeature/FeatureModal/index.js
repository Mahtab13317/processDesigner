import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import clsx from "clsx";
import { Divider, MenuItem } from "@material-ui/core";
import { Close } from "@material-ui/icons/";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  ENDPOINT_POST_REGISTER_WINDOW,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import { REGEX, validateRegex } from "../../../../validators/validator";
import { useRef } from "react";
import { FieldValidations } from "../../../../utility/FieldValidations/fieldValidations";

function FeatureModal(props) {
  let { t } = useTranslation();
  const [featureName, setfeatureName] = useState(null);
  const [propertyPath, setpropertyPath] = useState(null);
  const [tableName, settableName] = useState(null);
  const [executionPath, setexecutionPath] = useState(null);
  const [menuName, setmenuName] = useState(null);
  const dispatch = useDispatch();
  const featureNameandler = (e) => {
    setfeatureName(e.target.value);
  };
  const propertyPathHandler = (e) => {
    setpropertyPath(e.target.value);
  };
  const tableNameHandler = (e) => {
    settableName(e.target.value);
  };
  const executionPathHandler = (e) => {
    setexecutionPath(e.target.value);
  };
  const menuNameHandler = (e) => {
    setmenuName(e.target.value);
  };

  const featureNameRef = useRef();
  const propertyInterfaceRef = useRef();
  const tableNameRef = useRef();
  const executionNameRef = useRef();
  const menuNameRef = useRef();

  useEffect(() => {
    if (props.selected && props.type == "Edit") {
      settableName(props.selected.TableNames);
      setfeatureName(props.selected.WindowName);
      setpropertyPath(props.selected.ClientInvocation);
      setexecutionPath(props.selected.ExecuteClassWeb);
      setmenuName(props.selected.MenuName);
    }
  }, [props.selected]);

  const registerHandler = () => {
    if (
      propertyPath &&
      propertyPath.indexOf("http://") !== 0 &&
      propertyPath &&
      propertyPath.indexOf("https://") !== 0
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
      executionPath &&
      executionPath.indexOf("http://") !== 0 &&
      executionPath &&
      executionPath.indexOf("https://") !== 0
    ) {
      dispatch(
        setToastDataFunc({
          message: t("propertyPathError"),
          severity: "error",
          open: true,
        })
      );
    }

    if (!validateRegex(tableName, REGEX.AlphaNumUsDashSpace)) {
      dispatch(
        setToastDataFunc({
          message: "Only _ is allowed as special character in Table name",
          severity: "error",
          open: true,
        })
      );
    }

    let isExist = false;
    props.allData.map((el) => {
      if (el.MenuName == featureName) {
        isExist = true;
      }
    });
    if (isExist) {
      dispatch(
        setToastDataFunc({
          message: "Interface Name already exist",
          severity: "error",
          open: true,
        })
      );
    }

    let jsonBody = {
      interfaceName: featureName,
      clientInvocation: propertyPath,
      menuName: menuName,
      executeClassWeb: executionPath,
      tableName: tableName,
    };

    axios
      .post(SERVER_URL + ENDPOINT_POST_REGISTER_WINDOW, jsonBody)
      .then((res) => {
        props.setIsModalOpen(false);
        props.setaddNew(true);
      });
  };

  const editHandler = () => {
    if (
      propertyPath &&
      propertyPath.indexOf("http://") !== 0 &&
      propertyPath &&
      propertyPath.indexOf("https://") !== 0
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
      executionPath &&
      executionPath.indexOf("http://") !== 0 &&
      executionPath &&
      executionPath.indexOf("https://") !== 0
    ) {
      dispatch(
        setToastDataFunc({
          message: t("propertyPathError"),
          severity: "error",
          open: true,
        })
      );
    }

    if (!validateRegex(tableName, REGEX.AlphaNumUsDashSpace)) {
      dispatch(
        setToastDataFunc({
          message: "Only _ is allowed as special character in Table name",
          severity: "error",
          open: true,
        })
      );
    }

    let isExist = false;
    props.allData.map((el) => {
      if (el.MenuName == featureName) {
        isExist = true;
      }
    });
    if (isExist) {
      dispatch(
        setToastDataFunc({
          message: "Interface Name already exist",
          severity: "error",
          open: true,
        })
      );
    } else {
      let jsonBody = {
        interfaceName: featureName,
        clientInvocation: propertyPath,
        menuName: menuName,
        executeClassWeb: executionPath,
        tableName: tableName,
        interfaceId: props.selected.InterfaceId,
      };

      axios
        .put(SERVER_URL + ENDPOINT_POST_REGISTER_WINDOW, jsonBody)
        .then((res) => {
          props.setIsModalOpen(false);
          props.setaddNew(true);
        });
    }
  };

  const DeleteHandler = () => {
    props.setIsModalOpen(false);
  };

  return (
    <React.Fragment>
      <div className={clsx(styles.flexRow, styles.modalHeadingDiv)}>
        <p className={styles.modalHeading}>{t("registerFeature")}</p>
        <Close
          className={styles.closeIcon}
          onClick={() => props.setIsModalOpen(false)}
          fontSize="small"
        />
      </div>
      <Divider className={styles.modalDivider} />

      <div>
        <p className={styles.labelTittle}>
          {t("featureName")}
          <span style={{ color: "red" }}>*</span>
        </p>
        <input
          className={styles.input}
          value={featureName}
          onChange={featureNameandler}
          style={{ width: "100%" }}
          id="featureName"
          ref={featureNameRef}
          onKeyPress={(e) =>
            FieldValidations(e, 150, featureNameRef.current, 255)
          }
        />
      </div>

      <div>
        <p className={styles.labelTittle}>
          {t("propertyInterface")}
          <span style={{ color: "red" }}>*</span>
        </p>
        <input
          className={styles.input}
          value={propertyPath}
          onChange={propertyPathHandler}
          style={{ width: "100%" }}
          id="propertyPathInterface"
          ref={propertyInterfaceRef}
          onKeyPress={(e) =>
            FieldValidations(e, 116, propertyInterfaceRef.current, 255)
          }
        />
      </div>

      <div>
        <p className={styles.labelTittle}>
          {t("tableName")}
          <span style={{ color: "red" }}>*</span>
        </p>
        <input
          className={styles.input}
          value={tableName}
          onChange={tableNameHandler}
          style={{ width: "100%" }}
          id="tableName"
          ref={tableNameRef}
          onKeyPress={(e) =>
            FieldValidations(e, 151, tableNameRef.current, 255)
          }
        />
      </div>

      <div>
        <p className={styles.labelTittle}>
          {t("executionInterfrance")}
          <span style={{ color: "red" }}>*</span>
        </p>
        <input
          className={styles.input}
          value={executionPath}
          onChange={executionPathHandler}
          style={{ width: "100%" }}
          id="executionName"
          ref={executionNameRef}
          onKeyPress={(e) =>
            FieldValidations(e, 116, executionNameRef.current, 255)
          }
        />
      </div>

      <div>
        <p className={styles.labelTittle}>
          {t("menuName")}
          <span style={{ color: "red" }}>*</span>
        </p>
        <input
          className={styles.input}
          value={menuName}
          onChange={menuNameHandler}
          style={{ width: "100%" }}
          id="menuName"
          ref={menuNameRef}
          onKeyPress={(e) => FieldValidations(e, 150, menuNameRef.current, 50)}
        />
      </div>

      <div className={styles.footer}>
        {props.type == "Edit" ? (
          <button className="cancel" onClick={DeleteHandler}>
            {t("discard")}
          </button>
        ) : (
          <button
            className="cancel"
            onClick={() => props.setIsModalOpen(false)}
          >
            {t("cancel")}
          </button>
        )}
        {props.type == "Edit" ? (
          <button
            className="create"
            style={{ marginRight: "10px" }}
            onClick={editHandler}
          >
            {t("saveChanges")}
          </button>
        ) : (
          <button
            className="create"
            style={{ marginRight: "10px" }}
            onClick={registerHandler}
          >
            {t("register")}
          </button>
        )}
      </div>
    </React.Fragment>
  );
}

export default FeatureModal;
