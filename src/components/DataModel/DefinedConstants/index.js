// #BugID - 115465 112538
// #BugDescription - the deletion of constants already handled.
// #BugID - 112538
// #BugDescription - Feature has been removed. No need of it now
import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import {
  SERVER_URL,
  ENDPOINT_ADD_CONSTANT,
  ENDPOINT_MODIFY_CONSTANT,
  ENDPOINT_REMOVE_CONSTANT,
  RTL_DIRECTION,
  PROCESSTYPE_LOCAL,
} from "../../../Constants/appConstants";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Checkbox, InputBase } from "@material-ui/core";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";
import EmptyStateIcon from "../../../assets/ProcessView/EmptyState.svg";
import { useGlobalState } from "state-pool";
import EditIcon from "@material-ui/icons/Edit";
import { FieldValidations } from "../../../utility/FieldValidations/fieldValidations";

function DefinedConstants(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const { openProcessID, openProcessType } = props;
  const [loadedProcessData, setLoadedProcessData] =
    useGlobalState("loadedProcessData");
  const [isLoading, setIsLoading] = useState(false);
  const [constantName, setConstantName] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [previousDefaultValue, setPreviousDefaultValue] = useState("");
  const [constantsArray, setConstantsArray] = useState([]);
  const [isProcessReadOnly, setIsProcessReadOnly] = useState(false);
  const constantNameRef = useRef();
  const constantValueRef = useRef();

  // Function that runs when the component mounts.
  useEffect(() => {
    if (openProcessType !== PROCESSTYPE_LOCAL) {
      setIsProcessReadOnly(true);
    }
    if (loadedProcessData) {
      let modifiedConstant = loadedProcessData?.DynamicConstant?.map(
        (constant) => {
          return { isEditable: false, ...constant };
        }
      );
      setConstantsArray(modifiedConstant);
    }
  }, [openProcessType, loadedProcessData.DynamicConstant]);

  // Function that handles the input given by the user for constant name.
  const handleConstantName = (event) => {
    setConstantName(event.target.value);
  };

  // Function that handles the input given by the user for default name.
  const handleDefaultValue = (event) => {
    setDefaultValue(event.target.value);
  };

  // Function that runs when the user clicks on the create constant button.
  const handleCreateConstant = () => {
    const newConstantObject = {
      DefaultValue: defaultValue.trim(),
      ConstantName: constantName.trim(),
    };
    const changedObject = {
      processDefId: openProcessID,
      constantName: constantName.trim(),
      constantValue: defaultValue.trim(),
    };
    handleConstantApiCall(changedObject, ENDPOINT_ADD_CONSTANT);
    setConstantsArray((prevState) => {
      let temp = [...prevState];
      temp?.splice(0, 0, newConstantObject);
      return temp;
    });
    let temp = { ...loadedProcessData };
    temp.DynamicConstant.splice(0, 0, newConstantObject);
    setLoadedProcessData(temp);
    setConstantName("");
    setDefaultValue("");
  };

  // Function that runs when the user deletes a constant.
  const handleConstantDelete = (index) => {
    let removedConstant;
    setConstantsArray((prevState) => {
      let temp = [...prevState];
      [removedConstant] = temp.splice(index, 1);
      return temp;
    });
    const changedObject = {
      processDefId: openProcessID,
      constantName: removedConstant.ConstantName,
    };
    let temp = { ...loadedProcessData };
    temp.DynamicConstant.splice(index, 1);
    setLoadedProcessData(temp);
    handleConstantApiCall(changedObject, ENDPOINT_REMOVE_CONSTANT);
  };

  // Function that runs when the user changes the default value of an existing constant.
  const handleDefaultValueChange = (event, index) => {
    setConstantsArray((prevState) => {
      let temp = [...prevState];
      temp[index].DefaultValue = event.target.value;
      return temp;
    });
  };

  // Function that checks if default value has been changed for a particular constant or not and does the API call accordingly.
  // const checkDefaultValueChange = (event, index) => {
  //   if (previousDefaultValue !== event.target.value) {
  //     const changedObject = {
  //       processDefId: openProcessID,
  //       constantName: constantsArray[index].ConstantName,
  //       constantValue: event.target.value.trim(),
  //     };
  //     let temp = { ...loadedProcessData };
  //     temp.DynamicConstant[index].DefaultValue = event.target.value;
  //     setLoadedProcessData(temp);
  //     handleConstantApiCall(changedObject, ENDPOINT_MODIFY_CONSTANT);
  //   }
  // };

  // Function that handles add, modify and delete api calls.
  const handleConstantApiCall = (object, url) => {
    axios
      .post(SERVER_URL + url, object)
      .then()
      .catch((err) => console.log(err));
  };

  const editConstData = (data) => {
    let temp = global.structuredClone(constantsArray);
    temp.forEach((cData) => {
      if (cData.ConstantName === data.ConstantName) {
        cData.isEditable = true;
      }
    });
    setConstantsArray(temp);
  };

  const modifyConstantHandler = async (data) => {
    const res = await axios.post(SERVER_URL + ENDPOINT_MODIFY_CONSTANT, {
      processDefId: +loadedProcessData.ProcessDefId,
      constantName: data.ConstantName,
      constantValue: data.DefaultValue,
    });
    if (res.status === 200) {
      let temp = global.structuredClone(constantsArray);
      temp.forEach((cData) => {
        if (cData.ConstantName === data.ConstantName) {
          cData.isEditable = false;
        }
      });
      setConstantsArray(temp);
    }
  };

  const cancelHandler = () => {
    setConstantsArray(loadedProcessData.DynamicConstant);
  };

  if (isLoading) {
    return <CircularProgress className="circular-progress" />;
  } else
    return (
      <div
        className={
          direction === RTL_DIRECTION ? arabicStyles.mainDiv : styles.mainDiv
        }
      >
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.headingsDiv
              : styles.headingsDiv
          }
        >
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.constantLogo
                : styles.constantLogo
            }
          ></div>
          <p
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.constantHeading
                : styles.constantHeading
            }
          >
            {t("constants")}
          </p>
          {/* <button
            id="constants_audit_history_button"
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.auditHistoryButton
                : styles.auditHistoryButton
            }
          >
            <div className={styles.buttonContent}>
              <DescriptionOutlinedIcon
                className={styles.auditButtonLogo}
                fontSize="small"
              />
              <p className={styles.auditButtonText}>{t("auditHistory")}</p>
            </div>
          </button>
          <div className={styles.moreOptionsIcon}>
            <MoreHorizOutlinedIcon id="constants_more_options" />
          </div> */}
        </div>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.subHeadingDiv
              : styles.subHeadingDiv
          }
        >
          {/* <Checkbox
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.mainCheckBox
                : styles.mainCheckBox
            }
            checked={false}
            size="small"
          /> */}
          <p
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.constantName
                : styles.constantName
            }
          >
            {t("constantName")}
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
        </div>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.inputDivs
              : styles.inputDivs
          }
        >
          <div className={styles.inputSubDivs}>
            <InputBase
              id="constants_input"
              autoFocus
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.constantInputField
                  : styles.constantInputField
              }
              variant="outlined"
              onChange={handleConstantName}
              value={constantName}
              disabled={isProcessReadOnly}
              inputRef={constantNameRef}
              onKeyPress={(e) =>
                FieldValidations(e, 161, constantNameRef.current, 50)
              }
            />
            <InputBase
              id="constants_input_value"
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.defaultValueInputField
                  : styles.defaultValueInputField
              }
              variant="outlined"
              onChange={handleDefaultValue}
              value={defaultValue}
              disabled={isProcessReadOnly}
              inputRef={constantValueRef}
              onKeyPress={(e) =>
                FieldValidations(e, 10, constantValueRef.current, 255)
              }
            />
          </div>
          <button
            id="constants_create_constant_button"
            class={
              direction === RTL_DIRECTION
                ? arabicStyles.createConstantButton
                : styles.createConstantButton
            }
            disabled={constantName.trim() === "" || defaultValue.trim() === ""}
            onClick={handleCreateConstant}
            style={{
              display: isProcessReadOnly ? "none" : "",
            }}
          >
            <span>{t("createConstant")}</span>
          </button>
        </div>
        {constantsArray && constantsArray.length === 0 ? (
          <div className={styles.emptyStateMainDiv}>
            <img
              className={styles.emptyStateImage}
              src={EmptyStateIcon}
              alt=""
            />
            {!isProcessReadOnly ? (
              <p className={styles.emptyStateHeading}>{t("createConstants")}</p>
            ) : null}
            <p className={styles.emptyStateText}>
              {!isProcessReadOnly
                ? t("noConstantsPresentTillNow") +
                  "," +
                  t("pleaseCreateConstants")
                : t("noConstantsPresentTillNow") + "."}
            </p>
          </div>
        ) : (
          <div style={{ height: "63vh", overflowY: "scroll" }}>
            {constantsArray &&
              constantsArray.map((d, index) => {
                return (
                  <div className={styles.constantsDataDiv}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <p
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.constantsNameData
                            : styles.constantsNameData
                        }
                      >
                        {d.ConstantName}
                      </p>
                      <InputBase
                        id="constants_input"
                        onFocus={() => setPreviousDefaultValue(d.DefaultValue)}
                        // onBlur={(event) =>
                        //   checkDefaultValueChange(event, index)
                        // }
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.defaultValueData
                            : styles.defaultValueData
                        }
                        variant="outlined"
                        value={d.DefaultValue}
                        onChange={(event) =>
                          handleDefaultValueChange(event, index)
                        }
                        disabled={!d.isEditable}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "8rem",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {!d.isEditable ? (
                        <EditIcon
                          classes={{
                            root:
                              direction === RTL_DIRECTION
                                ? arabicStyles.infoIcon
                                : styles.dataInfoIcon, // class name, e.g. `classes-nesting-root-x`
                          }}
                          fontSize="medium"
                          onClick={() => editConstData(d)}
                        />
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            width: "100%",
                            marginTop: "10px",
                          }}
                        >
                          <button
                            className={styles.cancelButton}
                            onClick={() => {
                              cancelHandler();
                            }}
                          >
                            {t("cancel")}
                          </button>
                          <button
                            // style={{
                            //   background:
                            //     d.variableId === modifyButtonDisableId
                            //       ? "#0072C6"
                            //       : "#0073c64c",
                            // }}
                            className={styles.updateButton}
                            onClick={() => modifyConstantHandler(d)}
                            // disabled={!d.variableId === modifyButtonDisableId}
                          >
                            {t("update")}
                          </button>
                        </div>
                      )}

                      {!d.isEditable ? (
                        <DeleteOutlinedIcon
                          id="constants_delete_constant_button"
                          classes={{
                            root:
                              direction === RTL_DIRECTION
                                ? arabicStyles.deleteIcon
                                : styles.deleteIcon,
                          }}
                          onClick={() => handleConstantDelete(index)}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
}

export default DefinedConstants;
