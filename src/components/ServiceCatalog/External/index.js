import React, { useState, useEffect } from "react";
import {
  OPTION_USER_DEFINED,
  OPTION_SYSTEM_DEFINED,
  SERVER_URL,
  ENDPOINT_GET_EXTERNAL_METHODS,
  SYSTEM_DEFINED_SCOPE,
  USER_DEFINED_SCOPE,
  GLOBAL_SCOPE,
  DEFAULT_GLOBAL_ID,
  DEFAULT_GLOBAL_TYPE,
  RTL_DIRECTION,
} from "../../../Constants/appConstants";
import { Accordion, AccordionDetails, Divider } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { AccordionSummaryStyled } from "../../../UI/AccordionSummaryStyled";
import SystemDefined from "./SystemDefined";
import "./common.css";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import UserDefined from "./UserDefined";
import { connect } from "react-redux";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

function ExternalMethods(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [methodCount, setMethodCount] = useState({});
  const [methodList, setMethodList] = useState([]);
  const [expanded, setExpanded] = useState(2);
  const [primaryInputStrip, setPrimaryInputStrip] = useState(false);
  const [spinner, setSpinner] = useState(true);

  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          ENDPOINT_GET_EXTERNAL_METHODS +
          `${
            props.scope === GLOBAL_SCOPE
              ? `/${DEFAULT_GLOBAL_ID}/${DEFAULT_GLOBAL_TYPE}`
              : `/${props.openProcessID}/${props.openProcessType}`
          }`
      )
      .then((res) => {
        if (res.data.Status === 0) {
          setMethodList(res.data.Methods.Method);
          setSpinner(false);
        } else {
          setSpinner(false);
        }
      });
  }, []);

  useEffect(() => {
    let systemDefinedCount = methodList?.filter(
      (e) => e.AppType === SYSTEM_DEFINED_SCOPE
    ).length;
    let userDefinedCount = methodList?.filter(
      (e) => e.AppType === USER_DEFINED_SCOPE
    ).length;
    setMethodCount({
      systemDefinedCount: systemDefinedCount,
      userDefinedCount: userDefinedCount,
    });
  }, [methodList]);

  // Function that handles change for accordion.
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    if (expanded === OPTION_USER_DEFINED && primaryInputStrip === true) {
      setPrimaryInputStrip(false);
    }
  };

  // Function that calls when the user clicks the add button for the primary business variables.
  const handleAddPrimary = (event) => {
    if (expanded === OPTION_USER_DEFINED) {
      setPrimaryInputStrip(!primaryInputStrip);
      event.stopPropagation();
    } else {
      setPrimaryInputStrip(true);
    }
  };

  return spinner ? (
    <CircularProgress
      style={
        direction === RTL_DIRECTION
          ? { marginTop: "30vh", marginRight: "50%" }
          : { marginTop: "30vh", marginLeft: "50%" }
      }
    />
  ) : (
    <div
      className={styles.mainDiv}
      style={{ padding: props.scope === GLOBAL_SCOPE ? "0" : "0.5rem 1rem" }}
    >
      <p
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.businessVariableHeading
            : styles.businessVariableHeading
        }
      >
        {t("external")} {t("Methods")}
      </p>
      <Accordion
        id="externalMethods_first_accordion"
        className="external_method_accordion"
        expanded={expanded === OPTION_USER_DEFINED}
        onChange={handleChange(OPTION_USER_DEFINED)}
      >
        <AccordionSummaryStyled>
          <div
            className={styles.accordianHeadingDiv}
            style={{ width: props.scope === GLOBAL_SCOPE ? "74vw" : "80vw" }}
          >
            <span
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.accordionHeader
                  : styles.accordionHeader
              }
            >
              {t("userDefined")}
            </span>
            <span
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.accordianHeaderCount
                  : styles.accordianHeaderCount
              }
            >{`(${methodCount.userDefinedCount})`}</span>
            <Divider
              className={
                primaryInputStrip
                  ? direction === RTL_DIRECTION
                    ? arabicStyles.accordianHeaderDividerUD_noAdd
                    : styles.accordianHeaderDividerUD_noAdd
                  : direction === RTL_DIRECTION
                  ? arabicStyles.accordianHeaderDividerUD
                  : styles.accordianHeaderDividerUD
              }
            />
            {!primaryInputStrip ? (
              <p
                id="externalMethods_addVariable_button"
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.accordionHeaderButton
                    : styles.accordionHeaderButton
                }
                onClick={handleAddPrimary}
              >
                {t("addDataObject").toUpperCase()}
              </p>
            ) : null}
          </div>
        </AccordionSummaryStyled>
        <AccordionDetails>
          <UserDefined
            methodList={methodList}
            primaryInputStrip={primaryInputStrip}
            setPrimaryInputStrip={setPrimaryInputStrip}
            setMethodList={setMethodList}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        id="externalMethods_second_accordion"
        className="external_method_accordion"
        expanded={expanded === OPTION_SYSTEM_DEFINED}
        onChange={handleChange(OPTION_SYSTEM_DEFINED)}
      >
        <AccordionSummaryStyled>
          <div
            className={styles.accordianHeadingDiv}
            style={{ width: props.scope === GLOBAL_SCOPE ? "74vw" : "80vw" }}
          >
            <span
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.accordionHeader
                  : styles.accordionHeader
              }
            >
              {t("system")}
            </span>
            <span
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.accordianHeaderCount
                  : styles.accordianHeaderCount
              }
            >{`(${methodCount.systemDefinedCount})`}</span>
            <Divider
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.accordianHeaderDividerSD
                  : styles.accordianHeaderDividerSD
              }
            />
          </div>
        </AccordionSummaryStyled>
        <AccordionDetails>
          <SystemDefined methodList={methodList} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps)(ExternalMethods);
