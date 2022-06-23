import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  IconButton,
  TextField
} from "@material-ui/core";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import { RTL_DIRECTION, propertiesLabel
} from "../../../../Constants/appConstants";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import arabicStyles from "./arabicStyles.module.css";
import {
  ActivityPropertySaveCancelValue,
  setSave
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/styles";
import { useGlobalState, store } from "state-pool";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "react-i18next";
import { connect, useDispatch, useSelector } from "react-redux";
import styles from "./Rule.module.css";
import * as actionCreators from "../../../../redux-store/actions/Properties/showDrawerAction";
const useStyles = makeStyles({
  root: {
    width: "100%",
    maxWidth: 500,
    fontSize: "14px",
    paddingTop: "2rem",
    paddingLeft: "1rem",
    fontWeight: "600"
  },
  roota: {
    paddingTop: "1rem",
    paddingLeft: "2rem",
    fontSize: "12px",
    fontWeight: "600",
    height: "4rem"
  },
  rootb: {
    paddingRight: "2rem",
    paddingLeft: "5rem",

    paddingTop: "2rem",
    width: "7px",
    height: "10px"
  },
  textField: {
    height: 10,
    fontSize: "12px"
  }
});
const InitialRule = props => {
  let dispatch = useDispatch();
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [showInput, setShowInput] = useState(false);
  const [data, setData] = useState({});
  const localActivityPropertyData = store.getState("activityPropertyData");
  const [spinner, setspinner] = useState(true);
  const [
    localLoadedActivityPropertyData,
    setlocalLoadedActivityPropertyData,
    updatelocalLoadedActivityPropertyData
  ] = useGlobalState(localActivityPropertyData);
  console.log(
    localLoadedActivityPropertyData.ActivityProperty.objPMRuleDetails
  );
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
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

  const handleChange = (e, i) => {
    const values = [...attachField];
    values[i][e.target.name] = e.target.value;
    setAttachField(values);
  };
  const handleDataChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleRemoveFields = i => {
    
    const values = [...attachField];
    values.splice(i, 1);
    setAttachField(values);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.initialRules]: {
          isModified: true,
          hasError: false
        }
      })
    );
  };
  const handleAddFields = () => {
    setAttachField([...attachField, { ruleCondition: "", ruleOperation: "" }]);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.initialRules]: {
          isModified: true,
          hasError: false
        }
      })
    );
  };
 

  const classes = useStyles();
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
                <td className={styles.serialDiv}></td>
                <td className={`${styles.conditionDiv1} ${direction === RTL_DIRECTION
              ? arabicStyles.divHead
              : styles.divHead}`}>
                  {t("condition")}
                </td>
                <td className={`${styles.operationDiv1} ${direction === RTL_DIRECTION
              ? arabicStyles.divHead
              : styles.divHead}`}>
                  {t("operation")}
                </td>
                <td className={styles.addDiv}>
                  {!showInput ? (
                    <button
                      className={direction === RTL_DIRECTION
                        ? arabicStyles.addAttachBtn
                        : styles.addAttachBtn}
                      onClick={() => {props.expandDrawer(true)
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
              {showInput  && props.isDrawerExpanded ? (
                <tr className={styles.showInput}>
                  <td className={styles.serialDiv}>1.</td>
                  <td className={`${styles.conditionDiv} ${direction === RTL_DIRECTION
              ? arabicStyles.divBody
              : styles.divBody}`}>
                    <input
                      value={data.ruleCondition}
                      className={styles.ruleInput}
                      onChange={e => handleDataChange(e)}
                      name="condition"
                    />
                  </td>

                  <td className={`${styles.operationDiv} ${direction === RTL_DIRECTION
              ? arabicStyles.divBody
              : styles.divBody}`}>
                    <input
                      value={data.ruleOperation}
                      className={styles.ruleInput}
                      onChange={e => handleDataChange(e)}
                      name="operation"
                    />
                  </td>

                  <td className={`${styles.addDiv} ${direction === RTL_DIRECTION
              ? arabicStyles.divBody
              : styles.divBody}`}>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => {
                        setShowInput(false);
                      }}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      className={styles.addBtn}
                      onClick={() => handleAddFields()}
                    >
                      {t("add")}
                    </button>
                  </td>
                </tr>
              ) : null}
              {attachField.map((item, i) => (
                <tr className={styles.showInput1}>
                  <td className={styles.serialDiv}>
                    {showInput ? i + 2 : i + 1}.
                  </td>
                  {props.isDrawerExpanded ? (
                    <td className={`${styles.conditionDiv} ${direction === RTL_DIRECTION
                      ? arabicStyles.divBody
                      : styles.divBody}`}>
                      <input
                        className={styles.ruleInput}
                        value={item.ruleCondition}
                        onChange={e => handleChange(e, i)}
                        name="condition"
                      />
                    </td>
                  ) : (
                    <td className={`${styles.conditionDiv} ${direction === RTL_DIRECTION
                      ? arabicStyles.divBody
                      : styles.divBody}`}>
                      {item.ruleCondition}
                    </td>
                  )}

                  {props.isDrawerExpanded ? (
                    <td className={`${styles.operationDiv} ${direction === RTL_DIRECTION
                      ? arabicStyles.divBody
                      : styles.divBody}`}>
                      <input
                        className={styles.ruleInput}
                        value={item.ruleOperation}
                        onChange={e => handleChange(e, i)}
                        name="operation"
                      />
                    </td>
                  ) : (
                    <td className={`${styles.operationDiv} ${direction === RTL_DIRECTION
                      ? arabicStyles.divBody
                      : styles.divBody}`}>
                      {item.ruleOperation}
                    </td>
                  )}
                  <td className={`${styles.addDiv} ${direction === RTL_DIRECTION
              ? arabicStyles.divBody
              : styles.divBody}`}>
                    <DeleteOutlineIcon
                      onClick={() => handleRemoveFields(i)}
                      className={styles.cancelIcon}
                    />
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
   
    expandDrawer: (flag) =>
      dispatch(actionCreators.expandDrawer(flag)),
  };
};

const mapStateToProps = state => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,

    cellID: state.selectedCellReducer.selectedId,

    cellName: state.selectedCellReducer.selectedName,

    cellType: state.selectedCellReducer.selectedType,

    cellActivityType: state.selectedCellReducer.selectedActivityType,

    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,

    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InitialRule);
