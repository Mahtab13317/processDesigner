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
  STATE_ADDED,
  REQ_RES_TYPE_OPTIONS,
  VARIABLE_TYPE_OPTIONS,
  Y_FLAG,
  COMPLEX_VARTYPE,
  STATE_EDITED,
  N_FLAG,
  ERROR_INCORRECT_FORMAT,
  RTL_DIRECTION,
} from "../../../../../../../Constants/appConstants";
import { getVariableType } from "../../../../../../../utility/ProcessSettings/Triggers/getVariableType";
import TextInput from "../../../../../../../UI/Components_With_ErrrorHandling/InputField";
import {
  REGEX,
  validateRegex,
} from "../../../../../../../validators/validator";
import Toast from "../../../../../../../UI/ErrorToast";

function DefineRequestModal(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let {
    cancelFunc,
    selected,
    setChangedSelection,
    setSelected,
    maxDataId,
    setMaxDataId,
    reqBodyList,
    setReqBodyList,
  } = props;
  const [data, setData] = useState({
    variableName: "",
    variableType: "10",
    unbounded: false,
    isNested: false,
    memberName: "",
    memberType: "10",
    isMemberArr: false,
  });
  const [bShowInput, setShowInput] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const [dataId, setDataId] = useState(0);
  const [commonError, setCommonError] = useState(null);
  const [error, setError] = useState({});

  useEffect(() => {
    setDataList(reqBodyList);
    setDataId(maxDataId);
  }, [reqBodyList, maxDataId]);

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onChangeChecked = (e) => {
    setData({ ...data, [e.target.name]: e.target.checked });
  };

  const addMember = () => {
    let temp = [...dataList];
    let maxTypeId = 0;
    let alreadyExistsIndex = null;
    let structAlreadyExist = false;
    let memAlreadyExist = false;
    temp.forEach((el, index) => {
      if (+el.TypeId > +maxTypeId) {
        maxTypeId = el.TypeId;
      }
      if (
        el.ParamName === data.variableName &&
        el.ParamType === COMPLEX_VARTYPE
      ) {
        alreadyExistsIndex = index;
      }
      if (
        el.ParamName === data.variableName &&
        el.ParamType !== COMPLEX_VARTYPE
      ) {
        structAlreadyExist = true;
      }
      el.Member?.forEach((mem) => {
        if (mem.ParamName === data.memberName) {
          memAlreadyExist = true;
        }
      });
    });
    if (structAlreadyExist) {
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
    } else if (memAlreadyExist) {
      setCommonError({
        label: t("FieldAlreadyExists"),
        errorType: "error",
      });
    } else if (
      data.memberName?.trim() !== "" &&
      !validateRegex(data.memberName, REGEX.StartWithAlphaThenAlphaNumUsDash)
    ) {
      setError({
        memberName: {
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
      if (alreadyExistsIndex !== null) {
        let memTypeId = 0;
        temp[alreadyExistsIndex].Member.forEach((el) => {
          if (el.TypeId && el.TypeId.trim() !== "" && +el.TypeId > +memTypeId) {
            memTypeId = el.TypeId;
          }
        });
        temp[alreadyExistsIndex].Member.push({
          DataStructureId: dataId + 1,
          ParamName: data.memberName,
          ParamScope: "C",
          ParamType: data.memberType,
          ParentID: temp[alreadyExistsIndex].DataStructureId,
          TypeId: +memTypeId + 1,
          Unbounded: data.isMemberArr ? Y_FLAG : N_FLAG,
        });
        setDataId(dataId + 1);
      } else {
        temp.push({
          DataStructureId: dataId + 1,
          IsNested: data.isNested ? Y_FLAG : N_FLAG,
          Member:
            data.variableType === COMPLEX_VARTYPE
              ? [
                  {
                    DataStructureId: dataId + 2,
                    ParamName: data.memberName,
                    ParamScope: "C",
                    ParamType: data.memberType,
                    ParentID: dataId + 1,
                    TypeId: 1,
                    Unbounded: data.isMemberArr ? Y_FLAG : N_FLAG,
                  },
                ]
              : [],
          ParamName: data.variableName,
          ParamScope: "C",
          ParamType: data.variableType,
          ParentID: 0,
          TypeId: +maxTypeId + 1,
          Unbounded: data.unbounded ? Y_FLAG : N_FLAG,
        });
        setDataId(
          data.variableType === COMPLEX_VARTYPE ? dataId + 2 : dataId + 1
        );
      }
      setDataList(temp);
      setIsEdited(true);
      setShowInput(false);
      setData({
        variableName: "",
        variableType: "10",
        unbounded: false,
        isNested: false,
        memberName: "",
        memberType: "10",
        isMemberArr: false,
      });
      setError({});
    }
  };

  const removeMember = (index, memberIndex) => {
    let temp = JSON.parse(JSON.stringify(dataList));
    if (memberIndex > -1) {
      temp[index].Member.splice(memberIndex, 1);
      if (temp[index].Member.length === 0) {
        temp.splice(index, 1);
      }
    } else {
      temp.splice(index, 1);
    }
    setDataList(temp);
    setIsEdited(true);
  };

  const submitFunc = () => {
    if (isEdited) {
      setChangedSelection((prev) => {
        let temp = { ...prev };
        temp = {
          ...temp,
          ReqBodyParameters: dataList,
          maxDataStructId: dataId,
        };
        return temp;
      });
      setReqBodyList(dataList);
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
          {t("RequestBody") + " " + t("definition")}
        </h3>
        <CloseIcon onClick={cancelFunc} className={styles.closeIcon} id="webS_reqBodyclose"/>
      </div>
      <div className={styles.modalBody}>
        {dataList.length > 0 || bShowInput ? (
          <table>
            <thead className={styles.dataTableHead}>
              <tr className="w100">
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
                  style={{ width: "13%" }}
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
                  style={{ width: "10%" }}
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
                  style={{ width: "10%" }}
                >
                  <p
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.dataTableHeadCellContent
                        : styles.dataTableHeadCellContent
                    }
                    style={{ textAlign: "center" }}
                  >
                    {t("IsNested")}
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
                  >
                    {t("memberName")}
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
                  style={{ width: "13%" }}
                >
                  <p
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.dataTableHeadCellContent
                        : styles.dataTableHeadCellContent
                    }
                  >
                    {t("memberType")}
                  </p>
                </th>
                <th
                  className={styles.dataTableHeadCell}
                  style={{ width: "10%" }}
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
                  style={{ width: "15%" }}
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
                    style={{ width: "15%" }}
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
                      idTag="webS_reqBodyVarName"
                      regexStr={REGEX.StartWithAlphaThenAlphaNumUsDash}
                      errorStatement={error?.variableName?.statement}
                      errorSeverity={error?.variableName?.severity}
                      errorType={error?.variableName?.errorType}
                    />
                  </td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "13%" }}
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
                      id="webS_reqBodyVarType"
                    >
                      {REQ_RES_TYPE_OPTIONS.map((opt) => {
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
                    style={{ width: "10%" }}
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
                            onChange={onChangeChecked}
                            id="webS_reqBodyUnbounded"
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
                    style={{ width: "10%" }}
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
                            name="isNested"
                            checked={data.isNested}
                            onChange={onChangeChecked}
                            id="webS_reqBodyisNested"
                            color="primary"
                            disabled={data.variableType !== COMPLEX_VARTYPE}
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
                    style={{ width: "15%" }}
                  >
                    <TextInput
                      inputValue={data.memberName}
                      classTag={
                        data.variableType !== COMPLEX_VARTYPE
                          ? direction === RTL_DIRECTION
                            ? arabicStyles.disabledInputField
                            : direction === RTL_DIRECTION
                            ? arabicStyles.disabledInputField
                            : styles.disabledInputField
                          : direction === RTL_DIRECTION
                          ? arabicStyles.inputField
                          : styles.inputField
                      }
                      onChangeEvent={onChange}
                      name="memberName"
                      idTag="webS_reqBodyMemName"
                      readOnlyCondition={data.variableType !== COMPLEX_VARTYPE}
                      regexStr={REGEX.StartWithAlphaThenAlphaNumUsDash}
                      errorStatement={error?.memberName?.statement}
                      errorSeverity={error?.memberName?.severity}
                      errorType={error?.memberName?.errorType}
                    />
                  </td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "13%" }}
                  >
                    <Select
                      className={
                        data.variableType !== COMPLEX_VARTYPE
                          ? direction === RTL_DIRECTION
                            ? arabicStyles.disabledSelectField
                            : styles.disabledSelectField
                          : direction === RTL_DIRECTION
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
                      inputProps={{
                        readOnly: data.variableType !== COMPLEX_VARTYPE,
                      }}
                      value={
                        data.variableType !== COMPLEX_VARTYPE
                          ? ""
                          : data.memberType
                      }
                      name="memberType"
                      onChange={onChange}
                      id="webS_reqBodyMemberType"
                    >
                      {VARIABLE_TYPE_OPTIONS.map((opt1) => {
                        return (
                          <MenuItem
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.dropdownData
                                : styles.dropdownData
                            }
                            value={opt1}
                          >
                            {t(getVariableType(opt1))}
                          </MenuItem>
                        );
                      })}
                      {dataList
                        ?.filter(
                          (el) =>
                            el.IsNested === Y_FLAG &&
                            el.ParamType === COMPLEX_VARTYPE
                        )
                        .map((opt) => {
                          return (
                            <MenuItem
                              className={
                                direction === RTL_DIRECTION
                                  ? arabicStyles.dropdownData
                                  : styles.dropdownData
                              }
                              value={opt.ParamType}
                            >
                              {opt.ParamName}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "10%" }}
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
                            name="isMemberArr"
                            checked={data.isMemberArr}
                            onChange={onChangeChecked}
                            disabled={data.variableType !== COMPLEX_VARTYPE}
                            id="webS_reqBodyisMemberArr"
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
                    style={{ width: "15%", textAlign: "center" }}
                  >
                    <button
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.closeButton
                          : styles.closeButton
                      }
                      onClick={() => {
                        setShowInput(false);
                        setData({
                          variableName: "",
                          variableType: "10",
                          unbounded: false,
                          isNested: false,
                          memberName: "",
                          memberType: "10",
                          isMemberArr: false,
                        });
                      }}
                      id="webS_reqBodycancelInp"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      className={
                        data.variableName?.trim() === "" ||
                        (data.variableType === COMPLEX_VARTYPE &&
                          data.memberName?.trim() === "")
                          ? styles.dataEntryDisableBtnHeader
                          : styles.dataEntryAddBtnHeader
                      }
                      id="webS_reqBodyAddInp"
                      onClick={addMember}
                      disabled={
                        data.variableName?.trim() === "" ||
                        (data.variableType === COMPLEX_VARTYPE &&
                          data.memberName?.trim() === "")
                      }
                    >
                      {t("add")}
                    </button>
                  </td>
                </tr>
              ) : null}
              {dataList?.map((option, index) => {
                return option?.Member?.length > 0 ? (
                  option.Member.map((member, memberIndex) => {
                    return (
                      <tr className={`${styles.dataTableRow} w100`}>
                        <td
                          className={styles.dataTableBodyCell}
                          style={{ width: "15%" }}
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
                          style={{ width: "13%" }}
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
                          style={{ width: "10%" }}
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
                                  disabled={true}
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
                          style={{ width: "10%" }}
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
                                  checked={option.IsNested === Y_FLAG}
                                  disabled={true}
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
                          style={{ width: "15%" }}
                        >
                          <span
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.normalSpan
                                : styles.normalSpan
                            }
                          >
                            {member.ParamName}
                          </span>
                        </td>
                        <td
                          className={styles.dataTableBodyCell}
                          style={{ width: "13%" }}
                        >
                          <span
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.normalSpan
                                : styles.normalSpan
                            }
                          >
                            {t(getVariableType(member.ParamType))}
                          </span>
                        </td>
                        <td
                          className={styles.dataTableBodyCell}
                          style={{ width: "10%" }}
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
                                  checked={member.Unbounded === Y_FLAG}
                                  disabled={true}
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
                          style={{ width: "15%" }}
                        >
                          <button
                            className={`${styles.dataEntryAddBtnBody}`}
                            id={`${props.id}_mem${index}`}
                            onClick={() => removeMember(index, memberIndex)}
                          >
                            <DeleteOutlineIcon className={styles.moreBtn} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className={`${styles.dataTableRow} w100`}>
                    <td
                      className={styles.dataTableBodyCell}
                      style={{ width: "15%" }}
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
                      style={{ width: "13%" }}
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
                      style={{ width: "10%" }}
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
                              disabled={true}
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
                      style={{ width: "10%" }}
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
                              checked={option.IsNested === Y_FLAG}
                              disabled={true}
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
                      style={{ width: "15%" }}
                    >
                      <span
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.normalSpan
                            : styles.normalSpan
                        }
                        style={{ marginLeft: "0.5vw" }}
                      >
                        -
                      </span>
                    </td>
                    <td
                      className={styles.dataTableBodyCell}
                      style={{ width: "13%" }}
                    >
                      <span
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.normalSpan
                            : styles.normalSpan
                        }
                        style={{ marginLeft: "0.5vw" }}
                      >
                        -
                      </span>
                    </td>
                    <td
                      className={styles.dataTableBodyCell}
                      style={{ width: "10%" }}
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
                              checked={false}
                              disabled={true}
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
                      style={{ width: "15%" }}
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
              id="noReqBody_btn"
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
          id="webS_reqBodycancel"
        >
          {t("cancel")}
        </button>
        <button
          className={styles.okButton}
          onClick={submitFunc}
          id="webS_reqBodyOK"
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

export default DefineRequestModal;
