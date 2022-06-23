import React, { useState, useEffect } from "react";
import {
  getTypeByVariable,
  getVariableType,
} from "../../../utility/ProcessSettings/Triggers/getVariableType";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyle.module.css";
import { useTranslation } from "react-i18next";
import {
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  ClickAwayListener,
} from "@material-ui/core";
import {
  RTL_DIRECTION,
  STATE_ADDED,
  STATE_CREATED,
  VARIABLE_TYPE_OPTIONS,
} from "../../../Constants/appConstants";
import CloseIcon from "@material-ui/icons/Close";

function UserDefinedListView(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let {
    selectedItem,
    bShowInput,
    setShowInput,
    dataObject,
    setDataObject,
    setIsObjEdited,
    setObjectList,
    setExtensionBtnClicked,
    dataTypesList,
  } = props;
  const [data, setData] = useState({
    aliasName: "",
    typeField: "",
    multipleEntries: false,
  });
  const [dataList, setDataList] = useState([]);
  const [showMore, setShowMore] = useState(null);

  useEffect(() => {
    setDataList(
      dataObject.dataObjectList?.filter((el) => !el.deleted && !el.inherited)
    );
  }, [dataObject]);

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (selectedItem.status === STATE_ADDED) {
      setIsObjEdited(true);
    }
  };

  const removeMember = (el) => {
    setShowMore(null);
    let newData = [...dataObject.dataObjectList];
    let indexVal;
    newData?.forEach((val, index) => {
      if (+val.TypeFieldId === +el.TypeFieldId) {
        indexVal = index;
      }
    });
    if (selectedItem.status === STATE_CREATED) {
      newData.splice(indexVal, 1);
      setObjectList(newData);
    } else {
      setIsObjEdited(true);
      newData[indexVal] = { ...newData[indexVal], deleted: true };
    }
    setDataObject((prev) => {
      return { ...prev, dataObjectList: newData };
    });
    setDataList(newData);
    setData({
      aliasName: "",
      typeField: "",
      multipleEntries: false,
    });
    setShowInput(false);
  };

  const addMember = () => {
    let newData = [...dataObject.dataObjectList];
    let maxVarId = 0;
    newData?.forEach((val) => {
      if (+val.TypeFieldId > +maxVarId && !val.deleted) {
        maxVarId = val.TypeFieldId;
      }
    });
    if (selectedItem.status === STATE_CREATED) {
      newData.push({
        TypeFieldId: +maxVarId + 1,
        FieldName: data.aliasName,
        WFType: getTypeByVariable(data.typeField),
        TypeId: "0",
        ParentTypeId: selectedItem.TypeId,
        ExtensionTypeId: "0",
        Unbounded: data.multipleEntries ? "Y" : "N",
      });
      setObjectList(newData);
    } else {
      newData.push({
        TypeFieldId: +maxVarId + 1,
        FieldName: data.aliasName,
        WFType: getTypeByVariable(data.typeField),
        TypeId: "0",
        ParentTypeId: selectedItem.TypeId,
        ExtensionTypeId: "0",
        Unbounded: data.multipleEntries ? "Y" : "N",
        added: true,
      });
    }
    setDataObject((prev) => {
      return { ...prev, dataObjectList: newData };
    });
    setDataList(newData);
    setData({
      aliasName: "",
      typeField: "",
      multipleEntries: false,
    });
    setShowInput(false);
  };

  const editTable = (value, fieldName, index) => {
    let newData = [...dataObject.dataObjectList];
    if (selectedItem.status === STATE_CREATED) {
      newData[index] = { ...newData[index], [fieldName]: value };
    } else {
      setIsObjEdited(true);
      newData[index] = {
        ...newData[index],
        [fieldName]: value,
        modified: true,
      };
    }
    setObjectList(newData);
    setDataObject((prev) => {
      return { ...prev, dataObjectList: newData };
    });
    setDataList(newData);
  };

  return (
    <table>
      <thead className={styles.dataTableHead}>
        <tr className="w100">
          <th className={styles.dataTableHeadCell} style={{ width: "35%" }}>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.dataTableHeadCellContent
                  : styles.dataTableHeadCellContent
              }
            >
              {t("aliasName")}
            </p>
          </th>
          <th className={styles.dataTableHeadCell} style={{ width: "20%" }}>
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
          <th className={styles.dataTableHeadCell} style={{ width: "25%" }}>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.dataTableHeadCellContent
                  : styles.dataTableHeadCellContent
              }
              style={{ textAlign: "center" }}
            >
              {t("allowMultipleEntries")}
            </p>
          </th>
          <th className={styles.dataTableHeadCell} style={{ width: "15%" }}>
            {bShowInput || selectedItem.status === STATE_CREATED ? null : (
              <p
                className={styles.dataEntryAddBtnHeader}
                onClick={() => {
                  setShowInput(true);
                  if (selectedItem.status === STATE_ADDED) {
                    setIsObjEdited(true);
                  }
                }}
                id={`${props.id}_all`}
              >
                {t("addMember")}
              </p>
            )}
          </th>
          <th className={styles.dataTableHeadCell} style={{ width: "5%" }}></th>
        </tr>
      </thead>
      <tbody className={styles.dataTableBody}>
        {bShowInput || selectedItem.status === STATE_CREATED ? (
          <tr
            className={`${styles.dataTableRow} w100`}
            style={{ background: "#0072C61A" }}
          >
            <td className={styles.dataTableBodyCell} style={{ width: "35%" }}>
              <input
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.inputField
                    : styles.inputField
                }
                name="aliasName"
                value={data.aliasName}
                onChange={onChange}
              />
            </td>
            <td className={styles.dataTableBodyCell} style={{ width: "20%" }}>
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
                value={data.typeField}
                name="typeField"
                onChange={onChange}
              >
                <MenuItem value={""} style={{ display: "none" }}>
                  ""
                </MenuItem>
                {VARIABLE_TYPE_OPTIONS.map((opt) => {
                  return (
                    <MenuItem
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.dropdownData
                          : styles.dropdownData
                      }
                      value={t(getVariableType(opt))}
                    >
                      {t(getVariableType(opt))}
                    </MenuItem>
                  );
                })}
              </Select>
            </td>
            <td className={styles.dataTableBodyCell} style={{ width: "25%" }}>
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
                      name="multipleEntries"
                      checked={data.multipleEntries}
                      onChange={(e) => {
                        setData({ ...data, [e.target.name]: e.target.checked });
                        if (selectedItem.status === STATE_ADDED) {
                          setIsObjEdited(true);
                        }
                      }}
                      id="ud_table_checkAll"
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
            <td className={styles.dataTableBodyCell} style={{ width: "15%" }}>
              <button
                className={
                  data.aliasName.trim() === "" || data.typeField === ""
                    ? styles.dataEntryDisableBtnHeader
                    : styles.dataEntryAddBtnHeader
                }
                id={`${props.id}_all`}
                onClick={addMember}
                disabled={data.aliasName.trim() === "" || data.typeField === ""}
              >
                {t("addMember")}
              </button>
            </td>
            <td className={styles.dataTableBodyCell} style={{ width: "5%" }}>
              {selectedItem.status === STATE_CREATED ? null : (
                <button
                  className={styles.closeButton}
                  onClick={() => setShowInput(false)}
                >
                  <CloseIcon className={styles.closeIcon} />
                </button>
              )}
            </td>
          </tr>
        ) : null}

        {dataList?.length > 0 ? (
          <React.Fragment>
            {dataObject.extendedObj ? (
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.extensionTableHeading
                    : styles.extensionTableHeading
                }
              >
                {t("New")} {t("Members")}
              </p>
            ) : null}
            {dataList.map((option, index) => {
              return (
                <tr className={`${styles.dataTableRow} w100`}>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "35%" }}
                  >
                    <input
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.inputField
                          : styles.inputField
                      }
                      value={option.FieldName}
                      onChange={(e) =>
                        editTable(e.target.value, "FieldName", index)
                      }
                    />
                  </td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "20%" }}
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
                      value={
                        option.WFType !== "11"
                          ? t(getVariableType(option.WFType))
                          : t(getVariableType(option.TypeId))
                      }
                      onChange={(e) =>
                        editTable(
                          getTypeByVariable(e.target.value),
                          "WFType",
                          index
                        )
                      }
                    >
                      {VARIABLE_TYPE_OPTIONS.map((opt) => {
                        return (
                          <MenuItem
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.dropdownData
                                : styles.dropdownData
                            }
                            value={t(getVariableType(opt))}
                          >
                            {t(getVariableType(opt))}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "25%" }}
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
                            checked={option.Unbounded === "Y"}
                            onChange={(e) =>
                              editTable(
                                e.target.checked ? "Y" : "N",
                                "Unbounded",
                                index
                              )
                            }
                            id="ud_table_checkAll"
                            name="checkedB"
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
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.dataEntryAddBtnBody
                          : styles.dataEntryAddBtnBody
                      }
                      id={`${props.id}_item${index}`}
                      onClick={() => setShowMore(option.TypeFieldId)}
                    >
                      <MoreHorizIcon className={styles.moreBtn} />
                      {showMore === option.TypeFieldId ? (
                        <ClickAwayListener
                          onClickAway={() => {
                            setShowMore(null);
                          }}
                        >
                          <div
                            className={
                              direction === RTL_DIRECTION
                                ? arabicStyles.moreOptDiv
                                : styles.moreOptDiv
                            }
                          >
                            <span
                              className={
                                direction === RTL_DIRECTION
                                  ? arabicStyles.moreOption
                                  : styles.moreOption
                              }
                              onClick={() => removeMember(option)}
                            >
                              {t("remove")} {t("Member")}
                            </span>
                          </div>
                        </ClickAwayListener>
                      ) : null}
                    </button>
                  </td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "5%" }}
                  ></td>
                </tr>
              );
            })}
          </React.Fragment>
        ) : null}

        {dataObject.extendedObj?.VarField?.length > 0 ? (
          <React.Fragment>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.extensionTableHeading
                  : styles.extensionTableHeading
              }
            >
              {t("Inherited")} {t("Members")}
            </p>
            {dataObject.extendedObj.VarField?.map((option, index) => {
              return (
                <tr className={`${styles.dataTableRow} w100`}>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "35%" }}
                  >
                    <span
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.inheritedInputField
                          : styles.inheritedInputField
                      }
                    >
                      {option.FieldName}
                    </span>
                  </td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "20%" }}
                  >
                    <span
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.inheritedInputField
                          : styles.inheritedInputField
                      }
                    >
                      {option.WFType !== "11"
                        ? t(getVariableType(option.WFType))
                        : t(getVariableType(option.TypeId))}
                    </span>
                  </td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "25%" }}
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
                            checked={option.Unbounded === "Y"}
                            disabled={true}
                            id="ud_table_checkAll"
                            name="checkedB"
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
                  ></td>
                  <td
                    className={styles.dataTableBodyCell}
                    style={{ width: "5%" }}
                  ></td>
                </tr>
              );
            })}
          </React.Fragment>
        ) : null}
      </tbody>
      {selectedItem.status === STATE_CREATED &&
      !dataObject.extendedObj &&
      dataTypesList.length > 1 ? (
        <div className={styles.addUDListDiv}>
          <p className={styles.contentDiv}>
            {t("add")} {t("Members")}
          </p>
          <p className={styles.contentDiv}>{t("or")}</p>
          <p
            className={styles.createExistingBtn}
            onClick={() => setExtensionBtnClicked(true)}
          >
            {t("CreateExtensionOfDataType")}
          </p>
        </div>
      ) : null}
    </table>
  );
}

export default UserDefinedListView;
