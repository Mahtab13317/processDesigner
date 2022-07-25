import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import {
  RTL_DIRECTION,
  OPTION_PRIMARY,
  OPTION_USER_DEFINED,
  OPTION_SYSTEM_DEFINED,
  PROCESSTYPE_LOCAL,
  userRightsMenuNames,
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
import MicroFrontendContainer from "../../MicroFrontendContainer";
import axios from "axios";
import { getVariableTypeFromMDMType } from "../../../utility/ProcessSettings/Triggers/getVariableType";
import { UserRightsValue } from "../../../redux-store/slices/UserRightsSlice";
import { useSelector } from "react-redux";
import { getMenuNameFlag } from "../../../utility/UserRightsFunctions";

function BusinessVariables(props) {
  const { openProcessType, tableName, openProcessID } = props;
  const [variableDefinition] = useGlobalState("variableDefinition");
  let systemDefinedCount = variableDefinition.filter(
    (e) => e.VariableScope === "M" || e.VariableScope === "S"
  )?.length;
  let { t } = useTranslation();
  const userRightsValue = useSelector(UserRightsValue);
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
  const [loadExternalVariablesMFbool, setloadExternalVariablesMFbool] =
    useState(false);

  // Boolean that decides whether add queue variables button will be visible or not.
  const queueVariablesFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.queueVariables
  );

  // Boolean that decides whether extended variables accordion can be opened or not.
  const extendedVariablesFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.externalVariable
  );

  // Function that runs when the component mounts.
  useEffect(() => {
    if (openProcessType !== PROCESSTYPE_LOCAL) {
      setIsProcessReadOnly(true);
    }
  }, [openProcessType]);

  // Function that handles change for accordion.
  const handleChange = (panel) => (event, newExpanded) => {
    setloadExternalVariablesMFbool(newExpanded);
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
  const getExtVarCount = (varList) => {
    let temp = [];
    varList.forEach((_var) => {
      if (_var.ExtObjectId === "1" && _var.VariableScope === "I") {
        temp.push(_var);
      }
    });
    setLengthUserDefine(temp.length);
  };
  useEffect(() => {
    getExtVarCount(localLoadedProcessData.Variable);
  }, []);

  const callbackFunction = async (data) => {
    data.id = data.id + "";
    if (data?.constraints?.hasOwnProperty("Indexes")) {
      if (
        !data?.constraints.Indexes.hasOwnProperty("definition") ||
        data?.constraints.Indexes.definition.length === 0
      )
        delete data?.constraints.Indexes;
    }
    if (data?.constraints?.hasOwnProperty("FK")) {
      if (
        !data?.constraints.FK.hasOwnProperty("definition") ||
        data?.constraints.FK.definition.length === 0
      )
        delete data?.constraints.FK;
    }
    if (data?.constraints?.hasOwnProperty("NotNull")) {
      if (
        !data?.constraints.NotNull.hasOwnProperty("definition") ||
        data?.constraints.NotNull.definition.length === 0
      )
        delete data?.constraints.NotNull;
    }
    if (data?.constraints?.hasOwnProperty("Unique")) {
      if (
        !data?.constraints.Unique.hasOwnProperty("definition") ||
        data?.constraints.Unique.definition.length === 0
      )
        delete data?.constraints.Unique;
    }

    const formData = new FormData();
    let mystring = JSON.stringify(data);
    let myBlob = new Blob([mystring], {
      type: "text/plain",
    });
    formData.append("file", myBlob);

    const response = await axios({
      method: "post",
      url: `/pmweb/alterExtTable/${localLoadedProcessData.ProcessDefId}`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        // type: "application/json",
      },
    });
    if (response?.data.Status === 0) {
      let temp = JSON.parse(JSON.stringify(localLoadedProcessData));
      temp.DataObjectId = data.id;
      temp.DataObjectAliasName = data.alias_name;
      temp.DataObjectName = data.name;
      temp.Variable = [];
      temp.Variable = [...response.data.Variable];
      getExtVarCount([...response.data.Variable]);
      setlocalLoadedProcessData(temp);
    }
  };

  useEffect(() => {
    let microProps = {
      source: "PD_EXT", //PD_EXT
      data_object_alias_name: localLoadedProcessData.DataObjectAliasName, // Mandatory in props in PD_EXT
      data_object_name: localLoadedProcessData.DataObjectName, // Mandatory in props in PD_EXT
      // default_category_name: "simple", //we cant store
      data_object_id: localLoadedProcessData.DataObjectId, //object id to save from id in callback
      object_type: "P", //AP/P/C
      object_id: localLoadedProcessData.ProcessDefId, //categoryId
      // object_name: "simple",
      default_data_fields: [
        //PD_EXT	// Mandatory
        {
          name: "itemindex",
          alias: "itemindex",
          type: "1",
          key_field: true,
        },
        {
          name: "itemtype",
          alias: "itemtype",
          type: "1",
          key_field: true,
        },
      ],

      //"1" = String, "2" = Integer, "3" = Long, "4" = Float,"5" =Date and Time,"6" = Binary Data, "7" = Currency, "8" = Boolean,"9" = ShortDate, "10" = Ntext, "11" = Text, "12" = Nvarchar,"13" = Phone Number,"14" =Email.Binary,
      data_types: [1, 2, 3, 4, 5, 8, 9, 10],
      ContainerId: "appdesignerDiv",
      Module: "MDM",
      Callback: callbackFunction,
      Component: "DataModelListViewer",

      InFrame: false,

      Renderer: "renderDataModelListViewer",
    };
    window.MdmDataModel(microProps);
  }, []);

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
              {t("basicVariables")}
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
          {queueVariablesFlag && !primaryInputStrip && !isProcessReadOnly && (
            <p
              id="primary_variables_add_variable_button"
              className={styles.accordionHeaderButton}
              onClick={handleAddPrimary}
            >
              {t("add").toUpperCase()}
            </p>
          )}
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
      <Accordion
        id="business_variables_second_accordion"
        expanded={expanded === OPTION_USER_DEFINED}
        onChange={extendedVariablesFlag && handleChange(OPTION_USER_DEFINED)}
        className={classes.MuiAccordionroot}
      >
        <AccordionSummaryStyled>
          <div className={styles.accordianHeadingDiv}>
            <Typography className={styles.accordionHeader}>
              {t("extendedVariables")}
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
              style={{ width: "100%" }}
            />
          </div>
        </AccordionSummaryStyled>
        <AccordionDetails>
          {/* <MicroFrontendContainer
            styles={{
              width: "100%",
              height: "50vh",
              paddingInline: "10px",
            }}
            containerId="appdesignerDiv"
            microAppsJSON={microAppsJSON}
            domainUrl=""
            ProcessDefId={localLoadedProcessData.ProcessDefId}
            loadExternalVariablesMFbool={loadExternalVariablesMFbool}
          /> */}
          <div
            id="appdesignerDiv"
            style={{ width: "100%", height: "50vh" }}
          ></div>
          {/* <UserDefined
            isProcessReadOnly={isProcessReadOnly}
            bForInputStrip={userDefinedInputStrip}
            setBForInputStrip={setUserDefinedInputStrip}
            tableName={tableName}
            totalUserDefineVariable={totalUserDefineVariable}
          /> */}
        </AccordionDetails>
      </Accordion>
      <Accordion
        id="business_variables_third_accordion"
        // expanded={expanded === OPTION_SYSTEM_DEFINED}
        onChange={handleChange(OPTION_SYSTEM_DEFINED)}
        className={classes.MuiAccordionroot}
      >
        <AccordionSummaryStyled>
          <div className={styles.accordianHeadingDiv}>
            <Typography className={styles.accordionHeader}>
              {t("systemVariables")}
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
