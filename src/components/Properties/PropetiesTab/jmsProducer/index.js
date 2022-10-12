import React, { useEffect, useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  ClickAwayListener,
} from "@material-ui/core";
import { connect, useDispatch } from "react-redux";
import "./index.css";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { store, useGlobalState } from "state-pool";
import { addConstantsToString } from "../../../../utility/ProcessSettings/Triggers/triggerCommonFunctions";
import ButtonDropdown from "../../../../UI/ButtonDropdown/index";
import {
  JMSProducerServers,
  propertiesLabel,
} from "../../../../Constants/appConstants";
import TextInput from "../../../../UI/Components_With_ErrrorHandling/InputField";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import TabsHeading from "../../../../UI/TabsHeading";
import { useRef } from "react";
import { FieldValidations } from "../../../../utility/FieldValidations/fieldValidations";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

function JmsProducer(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const useStyles = makeStyles({
    errorStatement: {
      color: "red",
      fontSize: "11px",
    },
  });
  const classes = useStyles();
  const globalActivityData = store.getState("activityPropertyData");
  const [localActivityPropertyData, setLocalActivityPropertyData] =
    useGlobalState(globalActivityData);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  console.log(
    "555",
    "LOCAL DATA",
    localLoadedProcessData,
    localActivityPropertyData
  );
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

  const ipInputRef = useRef();
  const ipPortRef = useRef();
  const destinationNameRef = useRef();
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut); //code updated on 26 September 2022 for BugId 115467

  const handleServerSelection = (event) => {
    setProducerServer(event.target.value);
    setGlobalData("appSrvType", event.target.value);
  };

  const handleDestinationTypeSelection = (event) => {
    setDestinationType(event.target.value);
    setGlobalData("jmsDestType", event.target.value);
  };

  const handleVariableSelection = (event) => {
    setVariableName(event.VariableName);
    setMessageInput((prev) => {
      setGlobalData(
        "jmsMsgArg",
        addConstantsToString(prev, event.VariableName)
      );
      return addConstantsToString(prev, event.VariableName);
    });
    setShowDropdown(false);
  };

  const handleDestNameChange = (event) => {
    setDestinationName(event.target.value);
    setGlobalData("jmsDestName", event.target.value);
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

  // Function to set global data when the user does any action.
  const setGlobalData = (key, value) => {
    let temp = JSON.parse(JSON.stringify(localActivityPropertyData));
    temp.ActivityProperty.producerInfo[key] = value;
    setLocalActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.jmsProducer]: { isModified: true, hasError: false },
      })
    );

    // if (type === t("ReplyImmediate")) {
    //   temp.ActivityProperty.actAssocId = 0;
    // } else {
    //   if (value !== "") {
    //     temp.ActivityProperty.actAssocId = value;
    //   }
    // }
    // setLocalActivityPropertyData(temp);
    // dispatch(
    //   setActivityPropertyChange({
    //     [propertiesLabel.receive]: { isModified: true, hasError: false },
    //   })
    // );
  };

  useEffect(() => {
    setProducerServer(
      localActivityPropertyData?.ActivityProperty?.producerInfo?.appSrvType
    );
    setDestinationName(
      localActivityPropertyData?.ActivityProperty?.producerInfo?.jmsDestName
    );
    setDestinationType(
      localActivityPropertyData?.ActivityProperty?.producerInfo?.jmsDestType
    );
    setMessageInput(
      localActivityPropertyData?.ActivityProperty?.producerInfo?.jmsMsgArg
    );
    setPortInput(
      localActivityPropertyData?.ActivityProperty?.producerInfo?.appSrvPort
    );
    setIpInput(
      localActivityPropertyData?.ActivityProperty?.producerInfo?.appSrvIP
    );
    setDomainInput("");
  }, [
    props.cellActivityType,
    props.cellActivitySubType,
    props.cellID,
    localActivityPropertyData?.ActivityProperty?.producerInfo,
  ]);

  useEffect(() => {
    document.getElementById("domainInput").disabled = true;
  }, []);

  return (
    <>
      <TabsHeading heading={props?.heading} />
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
                control={<Radio size="small" disabled={isReadOnly} />} //code updated on 26 September 2022 for BugId 115467
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
                onChangeEvent={(event) => {
                  setIpInput(event.target.value);
                  setGlobalData("appSrvIP", event.target.value);
                }}
                errorStatement="This is Invalid!"
                errorStatementClass={classes.errorStatement}
                inputRef={ipInputRef}
                onKeyPress={(e) =>
                  FieldValidations(e, 10, ipInputRef.current, 100)
                }
                disabled={isReadOnly} //code updated on 26 September 2022 for BugId 115467
              />

              <span style={{ marginLeft: "10px" }}>:</span>
              <input
                id="portInput"
                value={portInput}
                onChange={(event) => {
                  setPortInput(event.target.value);
                  setGlobalData("appSrvPort", event.target.value);
                }}
                ref={ipPortRef}
                onKeyPress={(e) =>
                  FieldValidations(e, 131, ipPortRef.current, 5)
                }
                disabled={isReadOnly} //code updated on 26 September 2022 for BugId 115467
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
                control={<Radio size="small" disabled={isReadOnly} />}
                label={t("domainName")}
              />
              <input
                id="domainInput"
                value={domainInput}
                onChange={(event) => {
                  setDomainInput(event.target.value);
                  // setGlobalData("appSrvPort", event.target.value);
                }}
                disabled={isReadOnly} //code updated on 26 September 2022 for BugId 115467
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
            onChange={(event) => {
              handleServerSelection(event);
            }}
            disabled={isReadOnly} //code updated on 26 September 2022 for BugId 115467
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
            onChange={(event) => {
              handleDestinationTypeSelection(event);
            }}
            disabled={isReadOnly} //code updated on 26 September 2022 for BugId 115467
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
          
{
  /*code updated on 15 September 2022 for BugId 112903*/
}


          <input
            className="destinationNameInput"
            onChange={(event) => {
              handleDestNameChange(event);
            }}
            value={destinationName}
            style={{
              marginLeft: props.isDrawerExpanded ? "38px" : null,
            }}
            ref={destinationNameRef}
                onKeyPress={(e) =>
                  FieldValidations(e, 128, destinationNameRef.current, 10)
                }
                disabled={isReadOnly} //code updated on 26 September 2022 for BugId 115467
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
                  disabled={isReadOnly} //code updated on 26 September 2022 for BugId 115467
                >
                  {"insertVariable"}
                </button>
                <ButtonDropdown
                  open={showDropdown}
                  dropdownOptions={localLoadedProcessData?.Variable}
                  onSelect={(event) => handleVariableSelection(event)}
                  style={{ top: "80%" }}
                  id="Jms_Producer_Variable_Dropdown"
                  optionKey="VariableName"
                  disabled={isReadOnly} //code updated on 26 September 2022 for BugId 115467
                />
              </div>
            </ClickAwayListener>
            <div>
              <textarea
                id="trigger_la_desc"
                autofocus
                value={messageInput}
                onChange={(event) => {
                  setMessageInput(event.target.value);
                  setGlobalData("jmsMsgArg", event.target.value);
                }}
                className="argStringBodyInput"
                disabled={isReadOnly} //code updated on 26 September 2022 for BugId 115467
              />
            </div>
          </div>
        </div>
      </div>
    </>
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
