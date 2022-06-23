import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./RuleListForm.module.css";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import axios from "axios";
import {
  ENDPOINT_ADD_INTERFACE_RULE,
  ENDPOINT_DELETE_INTERFACE_RULE,
  ENDPOINT_GET_FORM_RULE,
  ENDPOINT_MODIFY_INTERFACE_RULE,
  SERVER_URL,
} from "../../../Constants/appConstants.js";
import { store, useGlobalState } from "state-pool";
import {
  getConditionalOperatorLabel,
  getLogicalOperator,
} from "../../Properties/PropetiesTab/ActivityRules/CommonFunctionCall";
import CircularProgress from "@material-ui/core/CircularProgress";
import RuleSelect from "./RuleSelect";
import SearchBox from "../../../UI/Search Component";
import { useDispatch } from "react-redux";
import { setToastDataFunc } from "../../../redux-store/slices/ToastDataHandlerSlice";

function RuleListForm(props) {
  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked

  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const formsList = store.getState("allFormsList");
  const dispatch = useDispatch();
  const [allGlobalFormsList, setallGlobalFormsList] = useGlobalState(formsList);
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}​​​​​​​​`;
  const [spinner, setspinner] = useState(true);

  const useStyles = makeStyles({
    labelForm: {
      fontSize: "14px",
    },
  });

  const classes = useStyles();
  const [formRulesList, setformRulesList] = useState([]);
  const [selectedRuleId, setselectedRuleId] = useState();
  const [originalRulesListData, setoriginalRulesListData] = useState([]);
  const [addRuleApiBool, setaddRuleApiBool] = useState(false);
  const [modifyApiBool, setmodifyApiBool] = useState(false);
  const [selectedRuleObject, setselectedRuleObject] = useState({});
  let { ProcessDefId, ProcessType, ProcessName } = localLoadedProcessData;
  const getFormRules = async () => {
    const response = await axios.get(
      SERVER_URL +
        `${ENDPOINT_GET_FORM_RULE}/${ProcessDefId}/${ProcessName}/${ProcessType}`
    );
    if (response.data.Status === 0) {
      setspinner(false);

      if (response.data.FormRules?.hasOwnProperty("Rules")) {
        setselectedRuleId(response.data?.FormRules?.Rules[0]?.RuleId);
        setoriginalRulesListData(response.data.FormRules?.Rules);
        updateRulesSentence(response.data.FormRules?.Rules);
      }
    }
  };
  useEffect(() => {
    getFormRules();
  }, []);

  useEffect(() => {
    handleSelectedRuleObject();
  }, [selectedRuleId]);

  const updateRulesSentence = (temp) => {
    setformRulesList([]);
    temp?.map((rule) => {
      let ruleStatement = "";
      rule.RuleCondition.map((element, index) => {
        const concatenatedString = ruleStatement.concat(
          " ",
          element.Param1,
          " ",
          element.Param1 == "" ? "" : t("is"),
          " ",
          getConditionalOperatorLabel(element.Operator),
          " ",
          element.Param2,
          " ",
          getLogicalOperator(element.LogicalOp),
          " "
        );
        ruleStatement = concatenatedString;
      });

      let rulesData = {
        ruleStatement:
          "If " +
          ruleStatement +
          " then show " +
          rule.RuleOperation[0]?.InterfaceElementName,
        ruleId: rule.RuleId,
        ruleOrderId: rule.RuleOrderId,
      };
      setformRulesList((prev) => {
        let temp = [...prev];
        temp.push(rulesData);

        return temp;
      });
    });
  };

  const handleOriginalRulesListDataChange = (data) => {
    setoriginalRulesListData(data);
    updateRulesSentence(data);
  };

  const addNewRuleHandler = async () => {
    if (originalRulesListData.length > 0) {
      let temp = JSON.parse(JSON.stringify(originalRulesListData));

      let ruleToAdd = {
        RuleOrderId:
          +getHighestNumber(originalRulesListData, "RuleOrderId") + 1,
        RuleOperation: [
          {
            InterfaceElementName: "",
            InterfaceElementId: "",
          },
        ],
        RuleCondition: [
          {
            VarFieldId_1: "0",
            Operator: "",
            Type2: "",
            VarFieldId_2: "0",
            VariableId_1: "",
            VariableId_2: "",
            LogicalOp: "",
            Param2: "",
            Param1: "",
            Type1: "",
            ConditionOrderId: 1,
            ExtObjID1: "0",
            ExtObjID2: "0",
          },
        ],
        RuleId: getHighestNumber(originalRulesListData, "RuleId") + 1 + "",
      };
      temp.push(ruleToAdd);

      // setaddRulePostJson(postJson);

      handleOriginalRulesListDataChange(temp);
      setselectedRuleId(
        getHighestNumber(originalRulesListData, "RuleId") + 1 + ""
      );
      setaddRuleApiBool(true);
    } else {
      let temp = [
        {
          RuleOrderId: 1,
          RuleOperation: [
            {
              InterfaceElementId: "",
              InterfaceElementName: "",
            },
          ],
          RuleCondition: [
            {
              VarFieldId_1: "0",
              Operator: "0",
              Type2: "",
              VarFieldId_2: "0",
              VariableId_1: "",
              VariableId_2: "",
              LogicalOp: "",
              Param2: " ",
              Param1: "",
              Type1: "",
              ConditionOrderId: 1,
              ExtObjID1: "0",
              ExtObjID2: "0",
            },
          ],
          RuleId: "1",
        },
      ];
      handleOriginalRulesListDataChange(temp);
      setselectedRuleId("1");
      setaddRuleApiBool(true);
    }
  };

  const getHighestNumber = (data, fieldName) => {
    let arr = [];
    data.map((el) => {
      arr.push(+el[fieldName]);
    });
    return Math.max(...arr);
  };

  const getLowestNumber = (data, fieldName) => {
    let arr = [];
    data.map((el) => {
      arr.push(+el[fieldName]);
    });
    return Math.min(...arr);
  };

  const handleRuleAdd = async () => {
    let temp = {};
    originalRulesListData.map((rule) => {
      if (rule.RuleId == selectedRuleId) temp = rule;
    });

    let newRule = {
      RuleOrderId: +getHighestNumber(originalRulesListData, "RuleOrderId") + 1,
      RuleOperation: [
        {
          interfaceName: temp.RuleOperation[0]?.InterfaceElementName,
        },
      ],
      RuleCondition: temp.RuleCondition.map((cond) => {
        return {
          varFieldId_1: cond.VarFieldId_1,
          operator: cond.Operator,
          type2: cond.Type2,
          varFieldId_2: cond.VarFieldId_2,
          variableId_1: cond.VariableId_1,
          variableId_2: cond.VariableId_2,
          logicalOp: cond.LogicalOp === "" ? "0" : cond.LogicalOp,
          param2: cond.Param2,
          param1: cond.Param1,
          type1: cond.Type1,
          condOrderId: cond.ConditionOrderId,
          extObjID1: cond.ExtObjID1 || "0",
          extObjID2: cond.ExtObjID2 || "0",
        };
      }),
      RuleId: getHighestNumber(originalRulesListData, "RuleId") + 1 + "",
    };
    let postJson = {
      processDefId: localLoadedProcessData.ProcessDefId + "",
      processMode: localLoadedProcessData.ProcessType,
      ruleId: newRule.RuleId,
      ruleOrderId: newRule.RuleOrderId,
      ruleType: "F",
      ruleCondList: newRule.RuleCondition,
      ruleOpList: newRule.RuleOperation,
    };
    if (validateJson(postJson)) {
      const res = await axios.post(
        SERVER_URL + ENDPOINT_ADD_INTERFACE_RULE,
        postJson
      );
      setaddRuleApiBool((prev) => !prev);
      if (res.data.Status === 0) {
        dispatch(
          setToastDataFunc({
            message: "Rule Added",
            severity: "success",
            open: "true",
          })
        );
      } else {
        getFormRules();
        dispatch(
          setToastDataFunc({
            message: "Rule not Added",
            severity: "error",
            open: "true",
          })
        );
      }
    } else {
      dispatch(
        setToastDataFunc({
          message: "Fill mandatory fields",
          severity: "error",
          open: "true",
        })
      );
    }
  };

  const handleSelectedRuleObject = () => {
    let temp = {};
    originalRulesListData.map((rule) => {
      if (rule.RuleId == selectedRuleId) temp = rule;
    });
    setselectedRuleObject(temp);
  };

  const getFormDetailsById = (id) => {
    let temp = {};
    allGlobalFormsList.forEach((form) => {
      if (form.formId == id) {
        temp = form;
      }
    });
    return temp;
  };

  const handleFormChange = (e) => {
    let temp = JSON.parse(JSON.stringify(originalRulesListData));
    let obj = {};
    temp.forEach((rule) => {
      if (rule.RuleId == selectedRuleId) {
        obj = rule;
        rule.RuleOperation[0].InterfaceElementId = e.target.value + "";
        rule.RuleOperation[0].InterfaceElementName = getFormDetailsById(
          e.target.value
        ).formName;
      }
    });
    handleOriginalRulesListDataChange(temp);
    setselectedRuleObject(obj);
    if (!addRuleApiBool) {
      setmodifyApiBool(true);
      setaddRuleApiBool(false);
    }
  };

  const handleRuleModify = async () => {
    let temp = {};
    originalRulesListData.map((rule) => {
      if (rule.RuleId == selectedRuleId) temp = rule;
    });

    let newRule = {
      RuleOrderId: +temp.RuleOrderId,
      RuleOperation: [
        {
          interfaceName: temp.RuleOperation[0]?.InterfaceElementName,
        },
      ],
      RuleCondition: temp.RuleCondition.map((cond) => {
        return {
          varFieldId_1: cond.VarFieldId_1,
          operator: cond.Operator,
          type2: cond.Type2,
          varFieldId_2: cond.VarFieldId_2,
          variableId_1: cond.VariableId_1,
          variableId_2: cond.VariableId_2,
          logicalOp: cond.LogicalOp === "" ? "0" : cond.LogicalOp,
          param2: cond.Param2,
          param1: cond.Param1,
          type1: cond.Type1,
          condOrderId: cond.ConditionOrderId,
          extObjID1: cond.ExtObjID1 || "0",
          extObjID2: cond.ExtObjID2 || "0",
        };
      }),
      RuleId: temp.RuleId + "",
    };
    let postJson = {
      processDefId: localLoadedProcessData.ProcessDefId + "",
      processMode: localLoadedProcessData.ProcessType,
      ruleId: newRule.RuleId,
      ruleOrderId: newRule.RuleOrderId,
      ruleType: "F",
      ruleCondList: newRule.RuleCondition,
      ruleOpList: newRule.RuleOperation,
    };
    if (validateJson(postJson)) {
      const res = await axios.post(
        SERVER_URL + ENDPOINT_MODIFY_INTERFACE_RULE,
        postJson
      );
      setmodifyApiBool(false);
      if (res.data.Status === 0) {
        dispatch(
          setToastDataFunc({
            message: "Rule Modified",
            severity: "success",
            open: "true",
          })
        );
      } else {
        getFormRules();
        dispatch(
          setToastDataFunc({
            message: "Rule not modified",
            severity: "error",
            open: "true",
          })
        );
      }
    } else {
      dispatch(
        setToastDataFunc({
          message: "Fill mandatory fields",
          severity: "error",
          open: "true",
        })
      );
    }
  };
  const handleRuleDelete = async () => {
    let temp2 = JSON.parse(JSON.stringify(originalRulesListData));
    let temp = {};
    const newArr = temp2.filter((rule) => rule.RuleId != selectedRuleId);
    originalRulesListData.map((rule) => {
      if (rule.RuleId == selectedRuleId) temp = rule;
    });

    let newRule = {
      RuleOrderId: +temp.RuleOrderId,
      RuleOperation: [
        {
          interfaceName: temp.RuleOperation[0]?.InterfaceElementName,
        },
      ],

      RuleId: temp.RuleId + "",
    };
    let postJson = {
      processDefId: localLoadedProcessData.ProcessDefId + "",
      processMode: localLoadedProcessData.ProcessType,
      ruleId: newRule.RuleId,
      ruleOrderId: newRule.RuleOrderId,
      ruleType: "F",
      //ruleCondList: newRule.RuleCondition,
      interfaceName: newRule.RuleOperation[0].interfaceName,
    };

    const res = await axios.post(
      SERVER_URL + ENDPOINT_DELETE_INTERFACE_RULE,
      postJson
    );
    if (res.data.Status === 0) {
      dispatch(
        setToastDataFunc({
          message: "Rule Deleted",
          severity: "success",
          open: "true",
        })
      );
    } else {
      getFormRules();
      dispatch(
        setToastDataFunc({
          message: "Rule not deleted",
          severity: "error",
          open: "true",
        })
      );
    }

    handleOriginalRulesListDataChange(newArr);
    setselectedRuleId(getLowestNumber(newArr, "RuleId") + "");
  };

  const validateJson = (json) => {
    let flag = true;
    json.ruleCondList.forEach((cond, index) => {
      if (
        index == json.ruleCondList.length - 1 &&
        json.ruleCondList.length > 1
      ) {
        if (
          cond.variableId_1 === "" ||
          cond.variableId_2 === "" ||
          cond.operator === ""
        )
          flag = false;
      } else {
        if (
          cond.variableId_1 === "" ||
          cond.variableId_2 === "" ||
          cond.operator === "" ||
          cond.logicalOp === ""
        )
          flag = false;
      }
    });

    return json.ruleOpList[0].interfaceName != "" && flag;
  };

  return (
    <>
      {spinner ? (
        <CircularProgress
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
      ) : (
        <div style={{ direction: direction }} className={styles.mainDiv}>
          <div className={styles.header}>
            <p>{t("Rule List for Forms")}</p>
            <ClearOutlinedIcon
              fontSize="small"
              onClick={() => props.closeModal()}
            />
          </div>
          {originalRulesListData.length > 0 ? (
            <div className={styles.body}>
              <div className={styles.rulesListDiv}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "10%",
                    paddingInline: "10px",
                  }}
                >
                  <p style={{ fontSize: "15px", fontWeight: "600" }}>
                    {formRulesList.length} {t("rulesAreDefined")}
                  </p>
                  <button
                    style={{
                      width: "80px",
                      height: "30px",
                      background: addRuleApiBool ? "white" : "#0072C6",
                      border: "none",
                      borderRadius: "2px",
                      color: "white",
                    }}
                    onClick={() => addNewRuleHandler()}
                    disabled={addRuleApiBool}
                  >
                    {t("addRule")}
                  </button>
                </div>
                {formRulesList.map((rule) => (
                  <div
                    style={{
                      width: "100%",
                      height: "auto",
                      marginBlock: "10px",
                      padding: "6px",
                      background:
                        rule.ruleId === selectedRuleId ? "#0072C60F" : "white",
                    }}
                    onClick={() => setselectedRuleId(rule.ruleId)}
                  >
                    <p style={{ fontSize: "12px" }}>{rule.ruleStatement}</p>
                  </div>
                ))}
              </div>
              <div
                style={{ border: "2px solid rgb(0,0,0,0.4)", height: "100%" }}
              ></div>
              <div className={styles.rulesDescDiv}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "10%",
                    paddingInline: "10px",
                  }}
                >
                  <p style={{ fontSize: "15px", fontWeight: "600" }}>
                    {t("rulesConditions")}
                  </p>
                  <div
                    style={{
                      width: "160px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    {!addRuleApiBool && !modifyApiBool ? (
                      <button
                        style={{
                          width: "70px",
                          height: "30px",
                          background: "#FFFFF",
                          border: "1px solid rgb(0,0,0,0.3)",
                          borderRadius: "2px",
                          color: "#606060",
                        }}
                        onClick={handleRuleDelete}
                      >
                        {t("delete")}
                      </button>
                    ) : (
                      <>
                        {addRuleApiBool ? (
                          <>
                            <button
                              style={{
                                width: "70px",
                                height: "30px",
                                background: "#FFFFF",
                                border: "1px solid rgb(0,0,0,0.3)",
                                borderRadius: "2px",
                                color: "#606060",
                                marginInline: "8px",
                              }}
                              onClick={handleRuleDelete}
                            >
                              {t("delete")}
                            </button>
                            <button
                              style={{
                                width: "70px",
                                height: "30px",
                                background: "#FFFFF",
                                border: "1px solid rgb(0,0,0,0.3)",
                                borderRadius: "2px",
                                color: "#606060",
                              }}
                              onClick={handleRuleAdd}
                            >
                              {t("addRule")}
                            </button>
                          </>
                        ) : (
                          <>
                            {modifyApiBool ? (
                              <>
                                <button
                                  style={{
                                    width: "70px",
                                    height: "30px",
                                    background: "#FFFFF",
                                    border: "1px solid rgb(0,0,0,0.3)",
                                    borderRadius: "2px",
                                    color: "#606060",
                                    marginInline: "8px",
                                  }}
                                  onClick={handleRuleDelete}
                                >
                                  {t("delete")}
                                </button>
                                <button
                                  style={{
                                    width: "70px",
                                    height: "30px",
                                    background: "#FFFFF",
                                    border: "1px solid rgb(0,0,0,0.3)",
                                    borderRadius: "2px",
                                    color: "#606060",
                                  }}
                                  onClick={handleRuleModify}
                                >
                                  {t("modifyRule")}
                                </button>
                              </>
                            ) : null}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "40%",
                    display: "flex",
                    flexDirection: "column",
                    paddingInline: "10px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "15px",
                      marginLeft: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    if
                  </p>
                  <RuleSelect
                    originalRulesListData={originalRulesListData}
                    selectedRuleId={selectedRuleId}
                    setoriginalRulesListData={handleOriginalRulesListDataChange}
                    addRuleApiBool={addRuleApiBool}
                    setaddRuleApiBool={setaddRuleApiBool}
                    setmodifyApiBool={setmodifyApiBool}
                  />
                </div>
                <div style={{ width: "100%", height: "50%", padding: "10px" }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <p
                      style={{
                        fontSize: "12px",
                        marginBlock: "6px",
                        fontWeight: "bold",
                        marginRight: "4px",
                      }}
                    >
                      {t("show")}
                    </p>
                    <div
                      style={{
                        width: "100%",
                        border: "1px solid rgb(0,0,0,0.4)",
                        height: "1px",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "50%",
                      height: "40px",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        marginBlock: "6px",
                        fontWeight: "600",
                      }}
                    >
                      {t("formList")}
                    </p>
                    <SearchBox
                      height="28px"
                      width="100px"
                      placeholder={"Search Here"}
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        width: "50%",
                        height: "28px",
                        background: "#F0F0F0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          marginBlock: "6px",
                          fontWeight: "bold",
                          fontSize: "14px",
                          marginLeft: "25px",
                        }}
                      >
                        {t("name")}
                      </p>
                    </div>
                    <div
                      style={{
                        width: "50%",
                        overflowY: "scroll",
                        height: "150px",
                        // background: "green",
                      }}
                    >
                      <FormControl component="fieldset">
                        <RadioGroup
                          aria-label=""
                          value={
                            selectedRuleObject.hasOwnProperty("RuleOperation")
                              ? +selectedRuleObject?.RuleOperation[0]
                                  ?.InterfaceElementId
                              : null
                          }
                          onChange={handleFormChange}
                        >
                          {allGlobalFormsList.map((form) => (
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <FormControlLabel
                                value={form.formId}
                                control={<Radio size="small" />}
                                label={form.formName}
                                classes={{
                                  label: classes.labelForm,
                                  root: classes.labelRoot,
                                }}
                              />
                              <InfoOutlinedIcon
                                fontSize="small"
                                style={{ opacity: "0.4" }}
                              />
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noRuleDiv}>
              {" "}
              <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                No Rules present
              </p>
              <button
                style={{
                  width: "80px",
                  height: "30px",
                  background: addRuleApiBool ? "white" : "#0072C6",
                  border: "none",
                  borderRadius: "2px",
                  color: "white",
                  marginBlock: "10px",
                }}
                onClick={() => addNewRuleHandler()}
                disabled={addRuleApiBool}
              >
                {t("addRule")}
              </button>
            </div>
          )}

          {/* <div
            className={styles.header}
            style={{ justifyContent: "flex-end", whiteSpace: "nowrap" }}
          >
            <button
              style={{
                width: "70px",
                height: "30px",
                background: "#FFFFF",
                border: "1px solid rgb(0,0,0,0.3)",
                borderRadius: "2px",
                color: "#606060",
                marginInline: "8px",
              }}
              onClick={() => props.closeModal()}
            >
              {t("cancel")}
            </button>
            <button
              style={{
                width: "100px",
                height: "30px",
                background: "#0072C6",
                border: "none",
                borderRadius: "2px",
                color: "white",
              }}
            >
              {t("saveChanges")}
            </button>
          </div> */}
        </div>
      )}
    </>
  );
}

export default RuleListForm;
