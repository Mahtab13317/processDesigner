import React, { useEffect, useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { connect } from "react-redux";
import { Select, MenuItem } from "@material-ui/core";
import "./index.css";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { store, useGlobalState } from "state-pool";
import { addConstantsToString } from "../../../../utility/ProcessSettings/Triggers/triggerCommonFunctions";
import ButtonDropdown from "../../../../UI/ButtonDropdown/index";
import { ClickAwayListener } from "@material-ui/core";
import { JMSProducerServers } from "../../../../Constants/appConstants";
import TextInput from "../../../../UI/Components_With_ErrrorHandling/InputField";
function JmsProducer(props) {
  let { t } = useTranslation();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [loadedVariables] = useGlobalState("variableDefinition");
  const [selectedIPType, setSelectedIPType] = useState(t("producerIpPort"));
  const [producerServer, setProducerServer] = useState(null);
  const [destinationType, setDestinationType] = useState(null);
  const [variableName, setVariableName] = useState();
  const [destinationName, setDestinationName] = useState();
  const [portInput, setPortInput] = useState();
  const [ipInput, setIpInput] = useState();
  const [domainInput, setDomainInput] = useState();
  const producerServers = JMSProducerServers;
  const [messageInput, setMessageInput] = useState("");
  const [showIPError, setShowIPError] = useState(false);
  const handleServerSelection = (e) => {
    setProducerServer(e.target.value);
  };
  const handleDestinationTypeSelection = (e) => {
    setDestinationType(e.target.value);
  };

  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData] = useGlobalState(
    loadedActivityPropertyData
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const destinationTypeOptions = [
    {
      label: t("Topic"),
      value: "T",
    },
    {
      label: t("Queue"),
      value: "Q",
    },
  ];

  const useStyles = makeStyles({
    errorStatement: {
      color: "red",
      fontSize: "11px",
    },
  });

  const handleVariableSelection = (e) => {
    setVariableName(e.VariableName);
    setMessageInput((prev) => {
      return addConstantsToString(prev, e.VariableName);
    });
    setShowDropdown(false);
  };

  const handleDestNameChange = (e) => {
    setDestinationName(e.target.value);
  };

  const handleChange = (event) => {
    setSelectedIPType(event.target.value);
    if (selectedIPType == t("producerIpPort")) {
      document.getElementById("domainInput").disabled = false;
      document.getElementById("ipInput").disabled = true;
      document.getElementById("portInput").disabled = true;
    } else if (selectedIPType == t("domainName")) {
      document.getElementById("domainInput").disabled = true;
      document.getElementById("ipInput").disabled = false;
      document.getElementById("portInput").disabled = false;
    }
  };
  const classes = useStyles();
  useEffect(() => {
    setProducerServer(
      localLoadedActivityPropertyData?.ActivityProperty?.JMSProducer
        ?.AppServerType
    );
    setDestinationName(
      localLoadedActivityPropertyData?.ActivityProperty?.JMSProducer
        ?.JMSDestName
    );
    setDestinationType(
      localLoadedActivityPropertyData?.ActivityProperty?.JMSProducer
        ?.JMSDestType
    );
    setMessageInput(
      localLoadedActivityPropertyData?.ActivityProperty?.JMSProducer?.Message
    );
    setPortInput(
      localLoadedActivityPropertyData?.ActivityProperty?.JMSProducer
        ?.AppServerPort
    );
    setIpInput(
      localLoadedActivityPropertyData?.ActivityProperty?.JMSProducer
        ?.AppServerIP
    );
    setDomainInput("");
  }, [
    props.cellActivityType,
    props.cellActivitySubType,
    props.cellID,
    localLoadedActivityPropertyData.ActivityProperty.JMSProducer,
  ]);

  useEffect(() => {
    document.getElementById("domainInput").disabled = true;
  }, []);

  return (
    <div className="jmsProducer">
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="gender"
          defaultValue={t("producerIpPort")}
          name="radio-buttons-group"
          onChange={handleChange}
          row={true}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="jmsInputForm"
            style={{
              justifyContent: props.isDrawerExpanded ? null : "space-between",
            }}
          >
            <FormControlLabel
              value="Producer IP Port"
              control={<Radio size="small" />}
              label={t("producerIpPort")}
            />
            {/* <input
                id="ipInput"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
              /> */}
            <TextInput
              // classTag={classes.inputWithError}
              // readOnlyCondition={isDisableTab}
              inputValue={ipInput}
              idTag="ipInput"
              showError={showIPError}
              onBlurEvent={() => setShowIPError(true)}
              onChangeEvent={(e) => setIpInput(e.target.value)}
              errorStatement="This is inValid!!"
              errorStatementClass={classes.errorStatement}
            />
            <span style={{ marginLeft: "10px" }}>:</span>
            <input
              id="portInput"
              value={portInput}
              onChange={(e) => setPortInput(e.target.value)}
            />
          </div>
          <div
            className="jmsInputForm"
            style={{
              justifyContent: props.isDrawerExpanded ? null : "space-between",
            }}
          >
            <FormControlLabel
              value="Domain Name"
              control={<Radio size="small" />}
              label={t("domainName")}
            />
            <input
              id="domainInput"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
            />
          </div>
        </RadioGroup>
      </FormControl>
      <div
        className="jmsDropDown"
        style={{
          justifyContent: props.isDrawerExpanded ? null : "space-between",
        }}
      >
        <p>{t("producerServer")}</p>
        <Select
          value={producerServer}
          className="jms_select"
          style={{
            marginLeft: props.isDrawerExpanded ? "46px" : null,
          }}
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
          onChange={(e) => handleServerSelection(e)}
        >
          {producerServers.map((item) => {
            return (
              <MenuItem className="jms_dropdownData" key={item} value={item}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </div>
      <div
        className="jmsDropDown"
        style={{
          justifyContent: props.isDrawerExpanded ? null : "space-between",
        }}
      >
        <p>{t("destinationType")}</p>
        <Select
          className="jms_select"
          style={{
            marginLeft: props.isDrawerExpanded ? "44px" : null,
          }}
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
          value={destinationType}
          onChange={(e) => handleDestinationTypeSelection(e)}
        >
          {destinationTypeOptions.map((opt) => {
            return (
              <MenuItem className="jms_dropdownData" value={opt.value}>
                {opt.label}
              </MenuItem>
            );
          })}
        </Select>
      </div>
      <div
        className="jmsDropDown"
        style={{
          justifyContent: props.isDrawerExpanded ? null : "space-between",
        }}
      >
        <p>{t("destinationName")}</p>
        <input
          className="destinationNameInput"
          onChange={(e) => handleDestNameChange(e)}
          value={destinationName}
          style={{
            marginLeft: props.isDrawerExpanded ? "38px" : null,
          }}
        />
      </div>
      <div id="jsm_messageBlock">
        <p className="jsm_messageLabel">{t("msg")}</p>
        <div>
          <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
            <div className="relative inlineBlock">
              <button
                className="triggerButton propertiesAddButton"
                onClick={() => setShowDropdown(true)}
                id="trigger_laInsert_Btn"
              >
                {"insertVariable"}
              </button>
              <ButtonDropdown
                open={showDropdown}
                dropdownOptions={localLoadedProcessData?.Variable}
                onSelect={(e) => handleVariableSelection(e)}
                style={{ top: "80%" }}
                id="trigger_laInsert_Dropdown"
                optionKey="VariableName"
              />
            </div>
          </ClickAwayListener>
          <div>
            <textarea
              id="trigger_la_desc"
              autofocus
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="argStringBodyInput"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};
export default connect(mapStateToProps, null)(JmsProducer);
