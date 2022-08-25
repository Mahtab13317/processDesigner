// #BugID - 114308
// #BugDescription - Delete button added in expand view
import React, { useState, useEffect } from "react";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import {
  RTL_DIRECTION,
  propertiesLabel,
} from "../../../../Constants/appConstants";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import arabicStyles from "./arabicStyles.module.css";
import { useGlobalState, store } from "state-pool";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import styles from "./Rule.module.css";
import * as actionCreators from "../../../../redux-store/actions/Properties/showDrawerAction";

const InitialRule = (props) => {
  let dispatch = useDispatch();
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [showInput, setShowInput] = useState(false);
  const [data, setData] = useState({
    condition: "",
    operation: "",
  });
  const localActivityPropertyData = store.getState("activityPropertyData");
  const [spinner, setspinner] = useState(true);
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(localActivityPropertyData);
  const [attachField, setAttachField] = useState([]);

  useEffect(() => {
    if (localLoadedActivityPropertyData?.Status === 0) {
      setspinner(false);
    }
    if (localLoadedActivityPropertyData?.ActivityProperty?.objPMRuleDetails) {
      setAttachField(
        localLoadedActivityPropertyData?.ActivityProperty?.objPMRuleDetails
          ?.m_arrRuleInfo
      );
    }
  }, [localLoadedActivityPropertyData]);

  //code edited on 5 August 2022 for BugId 110897
  const handleChange = (e, i) => {
    const values = [...attachField];
    values[i] = {
      ...values[i],
      [e.target.name]: e.target.value,
      isEdited: true,
    };
    setAttachField(values);
  };

  const handleDataChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRemoveFields = (i, ruleId) => {
    const values = [...attachField];
    values.splice(i, 1);
    setAttachField(values);
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    let idx = null;
    temp?.ActivityProperty?.objPMRuleDetails?.m_arrRuleInfo?.forEach(
      (el, index) => {
        if (+el.ruleId === +ruleId) {
          idx = index;
        }
      }
    );
    if (idx !== null) {
      temp.ActivityProperty.objPMRuleDetails.m_arrRuleInfo.splice(idx, 1);
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.initialRules]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };

  // code edited on 5 August 2022 for BugId 111117
  const handleAddFields = () => {
    setAttachField([
      ...attachField,
      { ruleCondition: data.condition, ruleOperation: data.operation },
    ]);
    setData({
      condition: "",
      operation: "",
    });
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    let maxRuleId = 0;
    if (temp?.ActivityProperty?.objPMRuleDetails) {
      if (temp?.ActivityProperty?.objPMRuleDetails?.m_arrRuleInfo?.length > 0) {
        temp?.ActivityProperty?.objPMRuleDetails?.m_arrRuleInfo?.forEach(
          (el) => {
            if (+el.ruleId > +maxRuleId) {
              maxRuleId = +el.ruleId;
            }
          }
        );
        temp.ActivityProperty.objPMRuleDetails.m_arrRuleInfo.push({
          m_bSelected: false,
          ruleCondition: data.condition,
          ruleId: `${maxRuleId + 1}`,
          ruleOperation: data.operation,
        });
      } else {
        temp.ActivityProperty.objPMRuleDetails = {
          ...temp.ActivityProperty.objPMRuleDetails,
          m_arrRuleInfo: [
            {
              m_bSelected: false,
              ruleCondition: data.condition,
              ruleId: `${maxRuleId + 1}`,
              ruleOperation: data.operation,
            },
          ],
        };
      }
    } else {
      temp.ActivityProperty = {
        ...temp.ActivityProperty,
        objPMRuleDetails: {
          m_arrRuleInfo: [
            {
              m_bSelected: false,
              ruleCondition: data.condition,
              ruleId: `${maxRuleId + 1}`,
              ruleOperation: data.operation,
            },
          ],
        },
      };
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.initialRules]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };
  // code edited on 5 August 2022 for BugId 110897
  const handleEditFields = (rule) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    let idx = null;
    temp?.ActivityProperty?.objPMRuleDetails?.m_arrRuleInfo?.forEach(
      (el, index) => {
        if (+el.ruleId === +rule.ruleId) {
          idx = index;
        }
      }
    );
    if (idx !== null) {
      temp.ActivityProperty.objPMRuleDetails.m_arrRuleInfo[idx] = {
        ...temp.ActivityProperty.objPMRuleDetails.m_arrRuleInfo[idx],
        ruleCondition: rule.ruleCondition,
        ruleOperation: rule.ruleOperation,
      };
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.initialRules]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };

  // code edited on 5 August 2022 for BugId 110897
  const cancelEdit = (i, rule) => {
    let oldRule = null;
    localLoadedActivityPropertyData?.ActivityProperty?.objPMRuleDetails?.m_arrRuleInfo?.forEach(
      (el, index) => {
        if (+el.ruleId === +rule.ruleId) {
          oldRule = el;
        }
      }
    );
    const values = [...attachField];
    values[i] = {
      ...values[i],
      ruleCondition: oldRule.ruleCondition,
      ruleOperation: oldRule.ruleOperation,
      isEdited: false,
    };
    setAttachField(values);
  };

  return (
    <div>
      {spinner ? (
        <CircularProgress style={{ marginTop: "30vh", marginLeft: "40%" }} />
      ) : (
        <div
          className={`${styles.rule} ${
            props.isDrawerExpanded ? styles.expandedView : styles.collapsedView
          }`}
        >
          <div
            className={`${styles.attachmentHeader} ${
              props.isDrawerExpanded
                ? styles.expandedView
                : styles.collapsedView
            } row`}
          >
            <p className={styles.addAttachHeading}>{t("Rule(s)")}</p>
          </div>
          <table className={styles.tableDiv}>
            <thead className={styles.tableHeader}>
              <tr className={styles.tableHeaderRow}>
                {props.isDrawerExpanded && (
                  <td className={styles.serialDiv}></td>
                )}
                <td
                  className={`${styles.conditionDiv1} ${
                    direction === RTL_DIRECTION
                      ? arabicStyles.divHead
                      : styles.divHead
                  }`}
                >
                  {t("condition")}
                </td>
                <td
                  className={`${styles.operationDiv1} ${
                    direction === RTL_DIRECTION
                      ? arabicStyles.divHead
                      : styles.divHead
                  }`}
                >
                  {t("operation")}
                </td>
                <td className={styles.addDiv}>
                  {!showInput ? (
                    <button
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.addAttachBtn
                          : styles.addAttachBtn
                      }
                      onClick={() => {
                        props.expandDrawer(true);
                        setShowInput(true);
                      }}
                    >
                      {t("add")}
                    </button>
                  ) : null}
                </td>
              </tr>
            </thead>
            <tbody>
              {showInput && props.isDrawerExpanded && (
                <tr className={styles.showInput}>
                  <td
                    className={`${styles.serialDiv} ${
                      direction === RTL_DIRECTION
                        ? arabicStyles.divBody
                        : styles.divBody
                    }`}
                  ></td>
                  <td
                    className={`${styles.conditionDiv} ${
                      direction === RTL_DIRECTION
                        ? arabicStyles.divBody
                        : styles.divBody
                    }`}
                  >
                    <input
                      value={data.condition}
                      className={styles.ruleInput}
                      onChange={(e) => handleDataChange(e)}
                      name="condition"
                    />
                  </td>

                  <td
                    className={`${styles.operationDiv} ${
                      direction === RTL_DIRECTION
                        ? arabicStyles.divBody
                        : styles.divBody
                    }`}
                  >
                    <input
                      value={data.operation}
                      className={styles.ruleInput}
                      onChange={(e) => handleDataChange(e)}
                      name="operation"
                    />
                  </td>

                  <td
                    className={`${styles.addDiv} ${
                      direction === RTL_DIRECTION
                        ? arabicStyles.divBody
                        : styles.divBody
                    }`}
                  >
                    <button
                      className={styles.cancelBtn}
                      onClick={() => {
                        setShowInput(false);
                        setData({ condition: "", operation: "" });
                      }}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      className={
                        data.condition?.trim() !== "" &&
                        data.operation?.trim() !== ""
                          ? styles.addBtn
                          : styles.disabledAddBtn
                      }
                      onClick={() => handleAddFields()}
                      disabled={
                        data.condition?.trim() === "" &&
                        data.operation?.trim() === ""
                      }
                    >
                      {t("add")}
                    </button>
                  </td>
                </tr>
              )}
              {attachField.map((item, i) => (
                <tr className={styles.showInput1}>
                  {props.isDrawerExpanded && (
                    <td
                      className={`${styles.serialDiv} ${
                        direction === RTL_DIRECTION
                          ? arabicStyles.divBody
                          : styles.divBody
                      }`}
                    >
                      {i + 1}.
                    </td>
                  )}
                  {props.isDrawerExpanded ? (
                    <td
                      className={`${styles.conditionDiv} ${
                        direction === RTL_DIRECTION
                          ? arabicStyles.divBody
                          : styles.divBody
                      }`}
                    >
                      <input
                        className={styles.ruleInput}
                        value={item.ruleCondition}
                        onChange={(e) => handleChange(e, i)}
                        name="ruleCondition"
                      />
                    </td>
                  ) : (
                    <td
                      className={`${styles.conditionDiv} ${
                        direction === RTL_DIRECTION
                          ? arabicStyles.divBody
                          : styles.divBody
                      }`}
                    >
                      {item.ruleCondition}
                    </td>
                  )}

                  {props.isDrawerExpanded ? (
                    <td
                      className={`${styles.operationDiv} ${
                        direction === RTL_DIRECTION
                          ? arabicStyles.divBody
                          : styles.divBody
                      }`}
                    >
                      <input
                        className={styles.ruleInput}
                        value={item.ruleOperation}
                        onChange={(e) => handleChange(e, i)}
                        name="ruleOperation"
                      />
                    </td>
                  ) : (
                    <td
                      className={`${styles.operationDiv} ${
                        direction === RTL_DIRECTION
                          ? arabicStyles.divBody
                          : styles.divBody
                      }`}
                      style={{
                        paddingLeft: props.isDrawerExpanded ? "0" : "0.2rem",
                      }}
                    >
                      {item.ruleOperation}
                    </td>
                  )}
                  <td
                    className={`${styles.addDiv} ${
                      direction === RTL_DIRECTION
                        ? arabicStyles.divBody
                        : styles.divBody
                    }`}
                  >
                    {/*code edited on 5 August 2022 for BugId 110897*/}
                    {item.isEdited ? (
                      <React.Fragment>
                        <button
                          className={styles.cancelBtn}
                          onClick={() => cancelEdit(i, item)}
                        >
                          {t("cancel")}
                        </button>
                        <button
                          className={
                            item.ruleCondition?.trim() !== "" &&
                            item.ruleOperation?.trim() !== ""
                              ? styles.addBtn
                              : styles.disabledAddBtn
                          }
                          onClick={() => handleEditFields(item)}
                          disabled={
                            item.ruleCondition?.trim() === "" &&
                            item.ruleOperation?.trim() === ""
                          }
                        >
                          {t("save")}
                        </button>
                      </React.Fragment>
                    ) : (
                      <DeleteOutlineIcon
                        onClick={() => handleRemoveFields(i, item.ruleId)}
                        className={styles.cancelIcon}
                       
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    expandDrawer: (flag) => dispatch(actionCreators.expandDrawer(flag)),
  };
};

const mapStateToProps = (state) => {
  return {
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InitialRule);
