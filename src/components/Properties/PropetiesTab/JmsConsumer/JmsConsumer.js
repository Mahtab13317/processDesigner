import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./JmsConsumer.module.css";
import { Select, MenuItem, Checkbox } from "@material-ui/core";
import { connect, useDispatch } from "react-redux";
import * as actionCreators from "../../../../redux-store/actions/Properties/showDrawerAction.js";
import StarRateIcon from "@material-ui/icons/StarRate";
import Modal from "../../../../UI/Modal/Modal";
import { store, useGlobalState } from "state-pool";
import XmlModal from "./XmlModal";
import clsx from "clsx";
import TabsHeading from "../../../../UI/TabsHeading";
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";
import { propertiesLabel } from "../../../../Constants/appConstants";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

function JmsConsumer(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const globalActivityData = store.getState("activityPropertyData");
  const [localActivityPropertyData, setLocalActivityPropertyData] =
    useGlobalState(globalActivityData);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [modalClicked, setModalClicked] = useState(false);
  const [destinationName, setDestinationName] = useState("");
  const [processVariableDropdown, setProcessVariableDropdown] = useState([]);
  const [masterCheckUpdate, setmasterCheckUpdate] = useState(false);
  const [masterCheckSearch, setmasterCheckSearch] = useState(false);
  const [jmsConsumerData, setJmsConsumerData] = useState({});
  const [messageDataCheckbox, setMessageDataCheckbox] = useState(false); // State that stores the value of message data checkbox.
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut); //code updated on 26 September 2022 for BugId 115467

  // Function that runs when the component loads.
  useEffect(() => {
    setDestinationName(
      localActivityPropertyData?.ActivityProperty?.consumerInfo?.destinationName?.trim()
    );
  }, []);

  // Function that runs when the variables data changes.
  useEffect(() => {
    setProcessVariableDropdown(
      localLoadedProcessData?.Variable?.filter(
        (element) =>
          element.VariableScope === "M" ||
          element.VariableScope === "I" ||
          element.VariableScope === "U"
      )
    );
  }, [localLoadedProcessData?.Variable]);

  // Function that runs when the localActivityPropertyData.ActivityProperty data changes.
  useEffect(() => {
    if (localActivityPropertyData) {
      setJmsConsumerData({
        ImportedXMLData:
          localActivityPropertyData?.ActivityProperty?.consumerInfo
            ?.messageDataList,
      });
    }
  }, [localActivityPropertyData?.ActivityProperty]);

  console.log("555", "JMS DATA", jmsConsumerData, localActivityPropertyData);

  const masterMessageDataHandler = () => {
    console.log("222", "MASTER", messageDataCheckbox);
    setMessageDataCheckbox((prevState) => {
      return !prevState;
    });
    let [temp] = [jmsConsumerData.ImportedXMLData];
    temp?.forEach((element) => {
      element.m_bEnabledata = !messageDataCheckbox;
      if (messageDataCheckbox) {
        element.selectedProcessVariable = "";
        element.varFieldId = "0";
        element.variableId = "0";
        element.m_bsearch = false;
        element.m_bupdate = false;
        setmasterCheckSearch(false);
        setmasterCheckUpdate(false);
      }
    });
    setJmsConsumerData({ ImportedXMLData: temp });
    setGlobalData("allData", temp);
  };

  // Function to set global data when the user does any action.
  const setGlobalData = (key, value, ind) => {
    let temp = JSON.parse(JSON.stringify(localActivityPropertyData));
    if (key === "destinationName") {
      temp.ActivityProperty.consumerInfo.destinationName = value;
    } else if (key === "allData") {
      temp.ActivityProperty.consumerInfo.messageDataList = value;
    } else {
      temp.ActivityProperty.consumerInfo.messageDataList[ind][key] = value;
    }
    setLocalActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.jmsConsumer]: { isModified: true, hasError: false },
      })
    );
  };

  const importXmlHandler = () => {
    setModalClicked(true);
  };

  const importXmlHandlerCollapse = () => {
    props.expandDrawer(!props.isDrawerExpanded);
    setModalClicked(true);
  };

  const messageCollapseHandler = () => {
    props.expandDrawer(!props.isDrawerExpanded);
  };

  const responseXmlData = (data) => {
    console.log("999", "RESPONSE DATA", data);
    setJmsConsumerData((prev) => {
      let temp = [];
      data?.forEach((el) => {
        temp.push(el);
      });
      console.log("999", "XML DATA", { ImportedXMLData: temp });
      return { ImportedXMLData: temp };
    });
  };

  console.log("555", "PROCESS VARS", processVariableDropdown);

  const onSelectName = (event, index) => {
    let variableIdSelected;
    let varFieldIdSelected;
    const { value } = event.target;

    processVariableDropdown?.forEach((element) => {
      if (element.VariableName === value) {
        varFieldIdSelected = element.VarFieldId;
        variableIdSelected = element.VariableId;
      }
    });

    setJmsConsumerData((prev) => {
      let temp = [...prev.ImportedXMLData];
      temp[index].selectedProcessVariable = value;
      temp[index].varFieldId = varFieldIdSelected;
      temp[index].variableId = variableIdSelected;
      setGlobalData("allData", temp);
      return { ...prev, ImportedXMLData: temp };
    });
  };

  const enableDataFlagHandler = (enableFlag, ind) => {
    setJmsConsumerData((prev) => {
      let temp = [...prev.ImportedXMLData];
      temp[ind].m_bEnabledata = !enableFlag;
      if (enableFlag) {
        temp[ind].selectedProcessVariable = "";
        temp[ind].varFieldId = "0";
        temp[ind].variableId = "0";
      }
      setGlobalData("allData", temp);
      return { ...prev, ImportedXMLData: temp };
    });
  };

  const nameHandler = (event) => {
    setDestinationName(event.target.value);
    setGlobalData("destinationName", event.target.value);
  };

  const searchHandler = (searchCheck, index) => {
    setJmsConsumerData((prev) => {
      let temp = [...prev.ImportedXMLData];
      temp[index].m_bsearch = !searchCheck;
      setGlobalData("allData", temp);
      return { ...prev, ImportedXMLData: temp };
    });
  };

  const updateHandler = (updateCheck, index) => {
    setJmsConsumerData((prev) => {
      let temp = [...prev.ImportedXMLData];
      temp[index].m_bupdate = !updateCheck;
      setGlobalData("allData", temp);
      return { ...prev, ImportedXMLData: temp };
    });
  };

  // Function that runs when the component loads.
  useEffect(() => {
    let searchArray = [],
      updateArray = [],
      enableDataArray = [];
    jmsConsumerData?.ImportedXMLData?.forEach((element) => {
      searchArray.push(element.m_bsearch);
      updateArray.push(element.m_bupdate);
      enableDataArray.push(element.m_bEnabledata);
    });
    if (searchArray.includes(false)) {
      setmasterCheckSearch(false);
    } else {
      setmasterCheckSearch(true);
    }
    if (updateArray.includes(false)) {
      setmasterCheckUpdate(false);
    } else {
      setmasterCheckUpdate(true);
    }
    if (enableDataArray.includes(false)) {
      setMessageDataCheckbox(false);
    } else {
      setMessageDataCheckbox(true);
    }
  }, [jmsConsumerData?.ImportedXMLData]);

  const masterCheckHandler = () => {
    let temp = jmsConsumerData;
    temp &&
      temp?.ImportedXMLData?.map((val) => {
        return (val.m_bsearch = !masterCheckSearch);
      });
    setJmsConsumerData(temp);
    setGlobalData("allData", temp.ImportedXMLData);
    setmasterCheckSearch(!masterCheckSearch);
  };

  const masterUpdateHandler = () => {
    let temp = jmsConsumerData;
    temp &&
      temp?.ImportedXMLData?.map((val) => {
        return (val.m_bupdate = !masterCheckUpdate);
      });
    setJmsConsumerData(temp);
    setGlobalData("allData", temp.ImportedXMLData);
    setmasterCheckUpdate(!masterCheckUpdate);
  };

  return (
    <React.Fragment>
      <TabsHeading heading={props?.heading} />
      {props.isDrawerExpanded ? (
        <React.Fragment>
          <div className={styles.flexColumn} style={{ marginTop: "3rem" }}>
            <p className={styles.destinationText}>
              {t("destinationName")}
              <StarRateIcon
                style={{
                  height: "8px",
                  width: "8px",
                  color: "red",
                  marginBottom: "5px",
                }}
              />
            </p>
            <div className={styles.flexRow}>
              <input
                className={styles.input}
                id="jmsConsumerInput"
                value={destinationName}
                onChange={(e) => nameHandler(e)}
                disabled={isReadOnly} //code updated on 26 September 2022 for BugId 115467
              />
              <button
                className={
                  destinationName?.trim()?.length === 0
                    ? styles.importXmlBtnDisable
                    : styles.importXmlBtn
                }
                id="importXmlBtn"
                onClick={importXmlHandler}
                disabled={destinationName?.trim()?.length === 0 || isReadOnly} //code updated on 26 September 2022 for BugId 115467
             
              >
                {t("importXml")}
              </button>
            </div>
          </div>
          {jmsConsumerData && jmsConsumerData?.ImportedXMLData?.length > 0 && (
            <div
              className={clsx(styles.flexRow, styles.headerStrip)}
              style={{ marginTop: "2rem" }}
            >
              <div className={clsx(styles.flexRow, styles.headerMargin)}>
                <Checkbox
                  checked={messageDataCheckbox}
                  onChange={() => masterMessageDataHandler()}
                  disabled={isReadOnly} //code updated on 26 September 2022 for BugId 115467
                />
                <p className={styles.message}> {t("messageData")}</p>
              </div>
              <div className={clsx(styles.flexRow, styles.headerMargin)}>
                <Checkbox
                  checked={masterCheckSearch}
                  disabled={!messageDataCheckbox || isReadOnly} //code updated on 26 September 2022 for BugId 115467
                  onChange={() => masterCheckHandler()}
                  
                />
                <p className={styles.search}>{t("search")}</p>
              </div>
              <div className={clsx(styles.flexRow, styles.headerMargin)}>
                <Checkbox
                  checked={masterCheckUpdate}
                  disabled={!messageDataCheckbox || isReadOnly} //code updated on 26 September 2022 for BugId 115467
                  onChange={() => masterUpdateHandler()}
                 
                />
                <p className={styles.update}>{t("update")}</p>
              </div>
              <div className={clsx(styles.flexRow, styles.headerMargin)}>
                <p className={styles.variable}> {t("processVariable")}</p>
              </div>
            </div>
          )}
          {jmsConsumerData &&
            jmsConsumerData?.ImportedXMLData?.map((val, index) => {
              return (
                <div
                  className={clsx(styles.flexRow, styles.dataMainDiv)}
                  style={{ marginTop: "1rem" }}
                >
                  <div className={styles.dataParamName}>
                    <Checkbox
                      id="enableDataFlag"
                      checked={val.m_bEnabledata}
                      onChange={() =>
                        enableDataFlagHandler(val.m_bEnabledata, index)
                      }
                      disabled={isReadOnly} //code updated on 26 September 2022 for BugId 115467
                    />
                    {val.messageData}
                  </div>
                  <div className={clsx(styles.search, styles.checkboxMargins)}>
                    <Checkbox
                      checked={val.m_bsearch}
                      disabled={!val.m_bEnabledata || isReadOnly}
                      onChange={() => searchHandler(val.m_bsearch, index)}
                      id="searchBox"
                    />
                  </div>
                  <div className={clsx(styles.update, styles.checkboxMargins)}>
                    <Checkbox
                      checked={val.m_bupdate}
                      disabled={!val.m_bEnabledata}
                      onChange={() => updateHandler(val.m_bupdate, index)}
                      id="updateBox"
                    />
                  </div>
                  <div className={styles.variable}>
                    <CustomizedDropdown
                      id="JMS_Consumer_Variable_Dropdown"
                      className={styles.variableDropdown}
                      value={val.selectedProcessVariable}
                      onChange={(e) => onSelectName(e, index)}
                      disabled={!val.m_bEnabledata || isReadOnly}
                      isNotMandatory={true}
                    >
                      {processVariableDropdown?.map((element) => {
                        return (
                          <MenuItem
                            className={styles.menuItemStyles}
                            key={element.VariableName}
                            value={element.VariableName}
                          >
                            {element.VariableName}
                          </MenuItem>
                        );
                      })}
                    </CustomizedDropdown>
                  </div>
                </div>
              );
            })}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {
            <div className={styles.flexColumn} style={{ marginTop: "1rem" }}>
              <p className={styles.destinationTextCollapse}>
                {t("destinationName")}
                <StarRateIcon
                  style={{
                    height: "8px",
                    width: "8px",
                    color: "red",
                    marginBottom: "5px",
                  }}
                />
              </p>
              <div className={styles.flexRow}>
                <input
                  className={styles.inputCollapse}
                  id="jmsConsumerInput"
                  value={destinationName}
                  onChange={(e) => nameHandler(e)}
                  disabled={isReadOnly}
                />

                <button
                  className={
                    destinationName?.trim()?.length === 0
                      ? styles.importXmlBtnDisable
                      : styles.importXmlBtn
                  }
                  id="importXmlBtn"
                  onClick={importXmlHandlerCollapse}
                  disabled={destinationName?.trim()?.length === 0 || isReadOnly}
                >
                  {t("importXml")}
                </button>
              </div>
            </div>
          }
          {jmsConsumerData && jmsConsumerData?.ImportedXMLData?.length > 0 && (
            <div className={styles.flexRow} style={{ marginTop: "2rem" }}>
              <div
                className={styles.messageCollapse}
                onClick={messageCollapseHandler}
              >
                <i>{t("messageData")}</i>
              </div>
            </div>
          )}
          {jmsConsumerData &&
            jmsConsumerData?.ImportedXMLData?.map((val) => {
              return (
                <div className="row" style={{ marginTop: "1rem" }}>
                  <div className={styles.dataParamName}>
                    <Checkbox disabled={isReadOnly} />
                    {val.messageData}
                  </div>
                </div>
              );
            })}
        </React.Fragment>
      )}

      {modalClicked && (
        <Modal
          show={modalClicked}
          style={{
            width: "30vw",
            height: " 52vh",
            left: "35%",
            top: "30%",
            padding: "0",
          }}
          modalClosed={() => setModalClicked(false)}
          children={
            <XmlModal
              responseXmlData={responseXmlData}
              setModalClicked={setModalClicked}
              destinationName={destinationName}
              activityId={localActivityPropertyData.ActivityProperty.ActivityId}
              processId={props.openProcessID}
            />
          }
        />
      )}
    </React.Fragment>
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
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    expandDrawer: (flag) => dispatch(actionCreators.expandDrawer(flag)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JmsConsumer);
