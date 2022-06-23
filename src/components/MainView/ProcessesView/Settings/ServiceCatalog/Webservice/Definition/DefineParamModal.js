import React, { useEffect, useState } from "react";
import styles from "./modal.module.css";
import arabicStyles from "./arabicModal.module.css";
import { useTranslation } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import {
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import emptyStatePic from "../../../../../../../assets/ProcessView/EmptyState.svg";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import {
  ERROR_INCORRECT_FORMAT,
  N_FLAG,
  RTL_DIRECTION,
  SCOPE_OPTIONS,
  STATE_ADDED,
  STATE_EDITED,
  VARIABLE_TYPE_OPTIONS,
  Y_FLAG,
} from "../../../../../../../Constants/appConstants";
import { getVariableType } from "../../../../../../../utility/ProcessSettings/Triggers/getVariableType";
import { getScopeType } from "../../../../../../../utility/ServiceCatalog/Webservice";
import Toast from "../../../../../../../UI/ErrorToast";
import {
  REGEX,
  validateRegex,
} from "../../../../../../../validators/validator";
import TextInput from "../../../../../../../UI/Components_With_ErrrorHandling/InputField";

function DefineParamModal(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let {
    cancelFunc,
    setChangedSelection,
    selected,
    setSelected,
    maxDataId,
    setMaxDataId,
    inputParamList,
    setInputParamList,
  } = props;
  const [data, setData] = useState({
    variableName: "",
    variableType: "10",
    variableScope: "H",
    unbounded: false,
  });
  const [bShowInput, setShowInput] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const [dataId, setDataId] = useState(0);
  const [commonError, setCommonError] = useState(null);
  const [error, setError] = useState({});

  useEffect(() => {
    setDataList(inputParamList);
    setDataId(maxDataId);
  }, [inputParamList, maxDataId]);

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const addMember = () => {
    let temp = [...dataList];
    let maxTypeId = 0;
    let alreadyExists = false;
    temp.forEach((el) => {
      if (+el.TypeId > +maxTypeId) {
        maxTypeId = el.TypeId;
      }
      if (el.ParamName === data.variableName) {
        alreadyExists = true;
      }
    });
    if (alreadyExists) {
      setCommonError({
        label: t("StructureAlreadyExists"),
        errorType: "error",
      });
    } else if (
      !validateRegex(data.variableName, REGEX.StartWithAlphaThenAlphaNumUsDash)
    ) {
      setError({
        variableName: {
          statement: null,
          severity: "error",
          errorType: ERROR_INCORRECT_FORMAT,
        },
      });
      setCommonError({
        label:
          t("streamErrorFirstLetter") + ". " + t("_and-SpecialCharAllowed"),
        errorType: "error",
      });
    } else {
      setError({});
      temp.push({
        DataStructureId: dataId + 1,
        ParamName: data.variableName,
        ParamScope: data.variableScope,
        ParamType: data.variableType,
        ParentID: 0,
        TypeId: +maxTypeId + 1,
        Unbounded: data.unbounded ? Y_FLAG : N_FLAG,
      });
      setDataList(temp);
      setDataId(dataId + 1);
      setIsEdited(true);
      setShowInput(false);
      setData({
        variableName: "",
        variableType: "10",
        variableScope: "H",
        unbounded: false,
      });
    }
  };

  const removeMember = (index) => {
    let temp = JSON.parse(JSON.stringify(dataList));
    temp.splice(index, 1);
    setDataList(temp);
    setIsEdited(true);
  };

  const submitFunc = () => {
    if (isEdited) {
      setChangedSelection((prev) => {
        let temp = { ...prev };
        temp = {
          ...temp,
          InputParameters: dataList,
          maxDataStructId: dataId,
        };
        return temp;
      });
      setInputParamList(dataList);
      if (selected?.status === STATE_ADDED) {
        setSelected((prev) => {
          let temp = { ...prev };
          temp.status = STATE_EDITED;
          return temp;
        });
      }
      setMaxDataId(dataId);
    }
    cancelFunc();
  };

  return (
    <div>
      <div className={styles.modalHeader}>
        <h3
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.modalHeading
              : styles.modalHeading
          }
        >
          {t("Parameter") + " " + t("definition")}
        </h3>
        <CloseIcon onClick={cancelFunc} className={styles.closeIcon} id="webS_defineParam_close"/>
      </div>
      <div className={styles.modalBody}>
        {dataList.length > 0 || bShowInput ? (
          <table>
            <thead className={styles.dataTableHead}>
              <tr className="w100">
                <th
                  className={styles.dataTableHeadCell}
                  style={{ width: "25%" }}
                >
                  <p
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.dataTableHeadCellContent
                        : styles.dataTableHeadCellContent
                    }
                  >
                    {t("variableName")}
                    <span
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.starIcon
                          : styles.starIcon
                      }
                    >
                      *
                    </span>
                  </p>
                </th>
                <th
                  className={styles.dataTableHeadCell}
                  style={{ width: "21%" }}
                >
                  <p
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.dataTableHeadCellContent
                        : styles.dataTableHeadCellContent
                    }
                  >
                    {t("variableType")}
                  </p>
                </th>
                <th
                  className={styles.dataTableHeadCell}
                  style={{ width: "21%" }}
                >
                  <p
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.dataTableHeadCellContent
                        : styles.dataTableHeadCellContent
                    }
                  >
                    {t("variableScope")}
                  </p>
                </th>
                <th
                  className={styles.dataTableHeadCell}
                  style={{ width: "15%" }}
                >
                  <p
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.dataTableHeadCellContent
                        : styles.dataTableHeadCellContent
                    }
                    style={{ textAlign: "center" }}
                  >
                    {t("IsAnArray")}
                  </p>
                </th>
                <th
                  className={styles.dataTableHeadCell}
                  style={{ width: "18%" }}
                >
                  {bShowInput ? null : (
                    <p
                      className={styles.dataEntryAddBtnHeader}
                      onClick={() => {
                        setShowInput(true);
                      }}
                      id={`${props.id}_all`}
                    >
                      {t("+Variable")}
                    </p>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className={styles.dataTableBody}>
              {bShowInput ? (
                <tr
                  className={`${styles.dataTableRow} w100`}
                  style={{ background: "#0072C61A" }}
                >
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "25%" }}
                  >
                    <TextInput
                      inputValue={data.variableName}
                      classTag={
                        direction === RTL_DIRECTION
                          ? arabicStyles.inputField
                          : styles.inputField
                      }
                      onChangeEvent={onChange}
                      name="variableName"
                      idTag="webS_paramDefineName"
                      regexStr={REGEX.StartWithAlphaThenAlphaNumUsDash}
                      errorStatement={error?.variableName?.statement}
                      errorSeverity={error?.variableName?.severity}
                      errorType={error?.variableName?.errorType}
                    />
                  </td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "21%" }}
                  >
                    <Select
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.selectField
                          : styles.selectField
                      }
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                        getContentAnchorEl: null,
                      }}
                      value={data.variableType}
                      name="variableType"
                      onChange={onChange}
                      id="webS_paramDefineType"
                    >
                      {VARIABLE_TYPE_OPTIONS.map((opt) => {
                        return (
                          <MenuItem
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.dropdownData
                                : styles.dropdownData
                            }
                            value={opt}
                          >
                            {t(getVariableType(opt))}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "21%" }}
                  >
                    <Select
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.selectField
                          : styles.selectField
                      }
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                        getContentAnchorEl: null,
                      }}
                      value={data.variableScope}
                      name="variableScope"
                      onChange={onChange}
                      id="webS_paramDefineScope"
                    >
                      {SCOPE_OPTIONS.map((opt) => {
                        return (
                          <MenuItem
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.dropdownData
                                : styles.dropdownData
                            }
                            value={opt}
                          >
                            {t(getScopeType(opt))}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "15%" }}
                  >
                    <p
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.dataTableHeadCellContent
                          : styles.dataTableHeadCellContent
                      }
                      style={{ textAlign: "center" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="unbounded"
                            checked={data.unbounded}
                            onChange={(e) => {
                              setData({
                                ...data,
                                [e.target.name]: e.target.checked,
                              });
                            }}
                            id="webS_paramDefineCheck"
                            color="primary"
                          />
                        }
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.dataCheckbox
                            : styles.dataCheckbox
                        }
                      />
                    </p>
                  </td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "18%", textAlign: "center" }}
                  >
                    <button
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.closeButton
                          : styles.closeButton
                      }
                      id="webS_paramDefineCancelInpt"
                      onClick={() => {
                        setShowInput(false);
                        setData({
                          variableName: "",
                          variableType: "10",
                          variableScope: "H",
                          unbounded: false,
                        });
                      }}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      className={
                        data.variableName?.trim() === ""
                          ? styles.dataEntryDisableBtnHeader
                          : styles.dataEntryAddBtnHeader
                      }
                      id="webS_paramDefineAddInpt"
                      onClick={addMember}
                      disabled={data.variableName?.trim() === ""}
                    >
                      {t("add")}
                    </button>
                  </td>
                </tr>
              ) : null}
              {dataList?.map((option, index) => {
                return (
                  <tr className={`${styles.dataTableRow} w100`}>
                    <td
                      className={styles.dataTableBodyCell}
                      style={{ width: "25%" }}
                    >
                      <span
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.normalSpan
                            : styles.normalSpan
                        }
                      >
                        {option.ParamName}
                      </span>
                    </td>
                    <td
                      className={styles.dataTableBodyCell}
                      style={{ width: "21%" }}
                    >
                      <span
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.normalSpan
                            : styles.normalSpan
                        }
                      >
                        {t(getVariableType(option.ParamType))}
                      </span>
                    </td>
                    <td
                      className={styles.dataTableBodyCell}
                      style={{ width: "21%" }}
                    >
                      <span
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.normalSpan
                            : styles.normalSpan
                        }
                      >
                        {t(getScopeType(option.ParamScope))}
                      </span>
                    </td>
                    <td
                      className={styles.dataTableBodyCell}
                      style={{ width: "15%" }}
                    >
                      <p
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.dataTableHeadCellContent
                            : styles.dataTableHeadCellContent
                        }
                        style={{ textAlign: "center" }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={option.Unbounded === Y_FLAG}
                              color="primary"
                              disabled={true}
                            />
                          }
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.dataCheckbox
                              : styles.dataCheckbox
                          }
                        />
                      </p>
                    </td>
                    <td
                      className={styles.dataTableBodyCell}
                      style={{ width: "18%" }}
                    >
                      <button
                        className={`${styles.dataEntryAddBtnBody}`}
                        id={`${props.id}_item${index}`}
                        onClick={() => removeMember(index)}
                      >
                        <DeleteOutlineIcon className={styles.moreBtn} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className={styles.noDefinedParamScreen}>
            <div>
              <img src={emptyStatePic} />
              <p className={styles.noDefinedParamString}>
                {t("noDefinedParam")}
              </p>
            </div>
            <button
              className={styles.primaryBtn}
              id="noDefinedParam_btn"
              onClick={() => {
                setShowInput(true);
              }}
            >
              {t("addVariable")}
            </button>
          </div>
        )}
      </div>
      <div
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.modalFooter
            : styles.modalFooter
        }
      >
        <button
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.cancelButton
              : styles.cancelButton
          }
          onClick={cancelFunc}
          id="webS_paramDefineCancel"
        >
          {t("cancel")}
        </button>
        <button
          className={styles.okButton}
          onClick={submitFunc}
          id="webS_paramDefineOK"
        >
          {t("ok")}
        </button>
      </div>
      {commonError !== null ? (
        <Toast
          open={commonError !== null}
          closeToast={() => setCommonError(null)}
          message={commonError.label}
          severity={commonError.errorType}
        />
      ) : null}
    </div>
  );
}

export default DefineParamModal;
