import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import {
  RTL_DIRECTION,
  OPTION_PRIMARY,
  OPTION_USER_DEFINED,
  OPTION_SYSTEM_DEFINED,
  PROCESSTYPE_LOCAL,
} from "../../../Constants/appConstants";
import arabicStyles from "./ArabicStyles.module.css";
import SystemDefined from "./SystemDefined";
import PrimaryVariables from "./PrimaryVariables";
import {
  Accordion,
  AccordionDetails,
  Typography,
  Divider,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import useStyles from "./index.styles";
import { AccordionSummaryStyled } from "../../../UI/AccordionSummaryStyled";
import { store, useGlobalState } from "state-pool";
import UserDefined from "./UserDefined";

function BusinessVariables(props) {
  const { openProcessType, tableName, openProcessID } = props;
  const [variableDefinition] = useGlobalState("variableDefinition");
  let systemDefinedCount = variableDefinition.filter(
    (e) => e.VariableScope === "M" || e.VariableScope === "S"
  )?.length;
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [expanded, setExpanded] = useState(2);
  const [primaryInputStrip, setPrimaryInputStrip] = useState(false);
  const [isProcessReadOnly, setIsProcessReadOnly] = useState(false);
  const [userDefinedInputStrip, setUserDefinedInputStrip] = useState(false);
  const [lengthUserDefine, setLengthUserDefine] = useState("");
  const [primaryVariableCount, setPrimaryVariableCount] = useState(0);
  const classes = useStyles();

  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

  // Function that runs when the component mounts.
  useEffect(() => {
    if (openProcessType !== PROCESSTYPE_LOCAL) {
      setIsProcessReadOnly(true);
    }
  }, [openProcessType]);

  // Function that handles change for accordion.
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    if (expanded === 0 && primaryInputStrip === true) {
      setPrimaryInputStrip(false);
    } else if (expanded === 1 && userDefinedInputStrip === true) {
      setUserDefinedInputStrip(false);
    }
  };

  // Function that calls when the user clicks the add button for the primary business variables.
  const handleAddPrimary = (event) => {
    if (expanded === 0) {
      setPrimaryInputStrip(!primaryInputStrip);
      event.stopPropagation();
    } else {
      setPrimaryInputStrip(true);
    }
  };

  // Function that calls when the user clicks the add button for the user define variables.
  const handleAddUserDefined = (event) => {
    if (expanded === 1) {
      setUserDefinedInputStrip(!userDefinedInputStrip);
      event.stopPropagation();
    } else {
      setUserDefinedInputStrip(true);
    }
  };

  // function that tells the length of userdefine
  const totalUserDefineVariable = (val) => {
    setLengthUserDefine(val);
  };

  return (
    <div className={styles.mainDiv}>
      <div className={styles.headingsDiv}>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.businessVariableHeading
              : styles.businessVariableHeading
          }
        >
          {t("businessVariables")}
        </p>
      </div>
      <Accordion
        id="business_variables_first_accordion"
        expanded={expanded === OPTION_PRIMARY}
        onChange={handleChange(OPTION_PRIMARY)}
        className={classes.MuiAccordionroot}
      >
        <AccordionSummaryStyled>
          <div className={styles.accordianHeadingDiv}>
            <Typography className={styles.accordionHeader}>
              {t("primary")}
            </Typography>
            <Typography
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.accordianHeaderCount
                  : styles.accordianHeaderCount
              }
            >
              {`(${primaryVariableCount})`}
            </Typography>
            <Divider className={styles.accordianHeaderDivider} />
          </div>
          {!primaryInputStrip && !isProcessReadOnly ? (
            <p
              id="primary_variables_add_variable_button"
              className={styles.accordionHeaderButton}
              onClick={handleAddPrimary}
            >
              {t("add").toUpperCase()}
            </p>
          ) : null}
        </AccordionSummaryStyled>
        <AccordionDetails className={styles.accordianContent}>
          <PrimaryVariables
            openProcessID={openProcessID}
            primaryVariableCount={primaryVariableCount}
            setPrimaryVariableCount={setPrimaryVariableCount}
            isProcessReadOnly={isProcessReadOnly}
            bForInputStrip={primaryInputStrip}
            setBForInputStrip={setPrimaryInputStrip}
          />
        </AccordionDetails>
      </Accordion>
      {/* <Accordion
        id="business_variables_second_accordion"
        expanded={expanded === OPTION_USER_DEFINED}
        onChange={handleChange(OPTION_USER_DEFINED)}
        className={classes.MuiAccordionroot}
      >
        <AccordionSummaryStyled>
          <div className={styles.accordianHeadingDiv}>
            <Typography className={styles.accordionHeader}>
              {t("userDefined")}
            </Typography>
            <Typography
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.accordianHeaderCount
                  : styles.accordianHeaderCount
              }
            >{`(${lengthUserDefine})`}</Typography>
            <Divider
              className={styles.accordianHeaderDivider}
              style={{ width: "89%" }}
            />
          </div>
          {!userDefinedInputStrip && !isProcessReadOnly ? (
            <p
              id="user_defined_variables_add_variable_button"
              className={styles.accordionHeaderButton}
              onClick={handleAddUserDefined}
            >
              {t("add").toUpperCase()}
            </p>
          ) : null}
        </AccordionSummaryStyled>
        <AccordionDetails className={styles.accordianContent}>
          <UserDefined
            isProcessReadOnly={isProcessReadOnly}
            bForInputStrip={userDefinedInputStrip}
            setBForInputStrip={setUserDefinedInputStrip}
            tableName={tableName}
            totalUserDefineVariable={totalUserDefineVariable}
          />
        </AccordionDetails>
      </Accordion> */}
      <Accordion
        id="business_variables_third_accordion"
        expanded={expanded === OPTION_SYSTEM_DEFINED}
        onChange={handleChange(OPTION_SYSTEM_DEFINED)}
        className={classes.MuiAccordionroot}
      >
        <AccordionSummaryStyled>
          <div className={styles.accordianHeadingDiv}>
            <Typography className={styles.accordionHeader}>
              {t("system")}
            </Typography>
            <Typography
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.accordianHeaderCount
                  : styles.accordianHeaderCount
              }
            >{`(${systemDefinedCount})`}</Typography>
            <Divider className={styles.accordianHeaderDivider} />
          </div>
        </AccordionSummaryStyled>
        <AccordionDetails className={styles.accordianContent}>
          <SystemDefined />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default BusinessVariables;
