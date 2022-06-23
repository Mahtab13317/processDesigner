import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./JmsConsumer.module.css";
import { Select, MenuItem, Checkbox } from "@material-ui/core";
import { connect } from "react-redux";
import * as actionCreators from "../../../../redux-store/actions/Properties/showDrawerAction.js";
import StarRateIcon from "@material-ui/icons/StarRate";
import Modal from "../../../../UI/Modal/Modal";
import { store, useGlobalState } from "state-pool";
import XmlModal from "./XmlModal";
import axios from "axios";
import {
  ENDPOINT_DESTINATIONJMSCONSUMER,
  ENDPOINT_PROCESSVARIABLEJMSCONSUMER,
  ENDPOINT_SEARCHJMSCONSUMER,
  ENDPOINT_UPDATEJMSCONSUMER,
  SERVER_URL,
} from "../../../../Constants/appConstants";

function JmsConsumer(props) {
  let { t } = useTranslation();

  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [localLoadedProcess] = useGlobalState("variableDefinition");
  const [modalClicked, setModalClicked] = useState(false);
  const [inputXml, setinputXml] = useState(
    `<start>\n<data1>${t("scanAction")}</data1>\n<data2></data2>\n</start>`
  );
  const [destinationName, setDestinationName] = useState("");
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [processVariableDropdown, setprocessVariableDropdown] = useState(
    localLoadedProcessData?.Variable
  );

  const [masterCheckUpdate, setmasterCheckUpdate] = useState(false);
  const [masterCheckSearch, setmasterCheckSearch] = useState(false);

  const [jmsConsumerData, setJmsConsumerData] = useState(
    localLoadedActivityPropertyData?.ActivityProperty?.consumerInfo
  );
  // const [searchValue, setSearchValue] = useState(null);

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

  useEffect(() => {
    setDestinationName(
      localLoadedActivityPropertyData?.ActivityProperty?.consumerInfo
        ?.destinationName
    );
    // setSearchValue()
  }, []);

  const responseXmlData = (data) => {
    setJmsConsumerData((prev) => {
      let temp = [];
      data &&
        data.MessageData.forEach((el) => {
          temp.push(el);
        });
      return { ImportedXMLData: temp };
    });
  };

  const onSelectName = (e, index) => {
    let messageDataName;
    let variableIdSelected;
    let varFieldIdSelected;
    let searchSelected;
    let updateSelected;
    let processVariable;
    setJmsConsumerData((prev) => {
      let temp = [...prev.ImportedXMLData];
      temp[index].ProcessVariableName = e.target.value;
      processVariable = e.target.value;
      messageDataName = temp[index].ExtParamName;
      searchSelected = temp[index].Search;
      updateSelected = temp[index].Update;
      return { ...prev, ImportedXMLData: temp };
    });

    processVariableDropdown.map((value) => {
      if (value.VariableName === e.target.value) {
        varFieldIdSelected = value.VarFieldId;
        variableIdSelected = value.VariableId;
      }
    });

    // let jsonBody = {
    //   processDefId: props.openProcessID,
    //   activityId: localLoadedActivityPropertyData.ActivityProperty.ActivityId,
    //   jMSConsumerType: "C",
    //   destinationName: destinationName,
    //   arrMessageData: [
    //     {
    //       messageData: messageDataName,
    //       selectedProcessVariable: processVariable,
    //       search: searchSelected,
    //       update: updateSelected,
    //       variableId: variableIdSelected,
    //       varFieldId: varFieldIdSelected,
    //     },
    //   ],
    // };
    // axios
    //   .post(SERVER_URL + ENDPOINT_PROCESSVARIABLEJMSCONSUMER, jsonBody)
    //   .then((res) => {
    //     if (res.data.Status === 0) {
    //     }
    //     console.log(res);
    //   });
  };

  const nameHandler = (e) => {
    setDestinationName(e.target.value);
  };

  const searchHandler = (searchCheck, index) => {
    let messageDataName;
    let variableIdSelected;
    let varFieldIdSelected;
    let searchSelected;
    let updateSelected;
    let processVariable;
    setJmsConsumerData((prev) => {
      let temp = [...prev.ImportedXMLData];
      processVariable = temp[index].ProcessVariableName;
      messageDataName = temp[index].ExtParamName;
      searchSelected = !searchCheck;
      temp[index].Search = !searchCheck;
      updateSelected = temp[index].Update;
      variableIdSelected = temp[index].VariableId;
      varFieldIdSelected = temp[index].VarFieldId;
      return { ...prev, ImportedXMLData: temp };
    });

    // let jsonBody = {
    //   processDefId: props.openProcessID,
    //   activityId: localLoadedActivityPropertyData.ActivityProperty.ActivityId,
    //   jMSConsumerType: "C",
    //   destinationName: destinationName,
    //   arrMessageData: [
    //     {
    //       messageData: messageDataName,
    //       selectedProcessVariable: processVariable,
    //       search: searchSelected,
    //       update: updateSelected,
    //       variableId: variableIdSelected,
    //       varFieldId: varFieldIdSelected,
    //     },
    //   ],
    // };
    // axios
    //   .post(SERVER_URL + ENDPOINT_SEARCHJMSCONSUMER, jsonBody)
    //   .then((res) => {
    //     if (res.data.Status === 0) {
    //     }
    //     console.log(res);
    //   });
  };
  const updateHandler = (updateCheck, index) => {
    let messageDataName;
    let variableIdSelected;
    let varFieldIdSelected;
    let searchSelected;
    let updateSelected;
    let processVariable;
    setJmsConsumerData((prev) => {
      let temp = [...prev.ImportedXMLData];
      processVariable = temp[index].ProcessVariableName;
      messageDataName = temp[index].ExtParamName;
      searchSelected = temp[index].Search;
      temp[index].Update = !updateCheck;
      updateSelected = !updateCheck;
      variableIdSelected = temp[index].VariableId;
      varFieldIdSelected = temp[index].VarFieldId;
      return { ...prev, ImportedXMLData: temp };
    });

    // let jsonBody = {
    //   processDefId: props.openProcessID,
    //   activityId: localLoadedActivityPropertyData.ActivityProperty.ActivityId,
    //   jMSConsumerType: "C",
    //   destinationName: destinationName,
    //   arrMessageData: [
    //     {
    //       messageData: messageDataName,
    //       selectedProcessVariable: processVariable,
    //       search: searchSelected,
    //       update: updateSelected,
    //       variableId: variableIdSelected,
    //       varFieldId: varFieldIdSelected,
    //     },
    //   ],
    // };
    // axios
    //   .post(SERVER_URL + ENDPOINT_UPDATEJMSCONSUMER, jsonBody)
    //   .then((res) => {
    //     if (res.data.Status === 0) {
    //     }
    //     console.log(res);
    //   });
  };
  const changeDestintionNameHandler = () => {
    // let jsonBody = {
    //   processDefId: props.openProcessID,
    //   activityId: localLoadedActivityPropertyData.ActivityProperty.ActivityId,
    //   jMSConsumerType: "C",
    //   destinationName: destinationName,
    //   destinationId:
    //     localLoadedActivityPropertyData.ActivityProperty.JMSConsumer
    //       .DestinationId,
    // };
    // axios
    //   .post(SERVER_URL + ENDPOINT_DESTINATIONJMSCONSUMER, jsonBody)
    //   .then((res) => {
    //     if (res.data.Status === 0) {
    //     }
    //     console.log(res);
    //   });
  };

  useEffect(() => {
    let searchArray = [];
    let updateArray = [];
    jmsConsumerData?.messageDataList.map((val) => {
      searchArray.push(val.Search);
      updateArray.push(val.Update);
    });
    if (searchArray.includes(false)) {
      setmasterCheckSearch(false);
    }
    if (updateArray.includes(false)) {
      setmasterCheckUpdate(false);
    }
  }, [jmsConsumerData]);

  const masterCheckHandler = () => {
    let temp = jmsConsumerData;
    temp &&
      temp.ImportedXMLData.map((val) => {
        return (val.Search = !masterCheckSearch);
      });
    setJmsConsumerData(temp);
    setmasterCheckSearch(!masterCheckSearch);
  };
  const masterUpdateHandler = () => {
    let temp = jmsConsumerData;
    temp &&
      temp.ImportedXMLData.map((val) => {
        return (val.Update = !masterCheckUpdate);
      });
    setJmsConsumerData(temp);
    setmasterCheckUpdate(!masterCheckUpdate);
  };

  return (
    <React.Fragment>
      {props.isDrawerExpanded ? (
        <React.Fragment>
          {" "}
          <div className="row" style={{ marginTop: "3rem" }}>
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

            <input
              className={styles.input}
              id="jmsConsumerInput"
              value={destinationName}
              onChange={(e) => nameHandler(e)}
              onBlur={changeDestintionNameHandler}
            />
            <button
              className={
                destinationName && destinationName.trim().length === 0
                  ? styles.importXmlBtnDisable
                  : styles.importXmlBtn
              }
              id="importXmlBtn"
              onClick={importXmlHandler}
              disabled={destinationName && destinationName.trim().length === 0}
            >
              {t("importXml")}
            </button>
          </div>
          {jmsConsumerData && jmsConsumerData.messageDataList.length > 0 ? (
            <div className="row" style={{ marginTop: "2rem" }}>
              <div className={styles.message}>
                <Checkbox />
                {t("messageData")}
              </div>
              <div className={styles.search}>
                <Checkbox
                  checked={masterCheckSearch}
                  onChange={() => masterCheckHandler()}
                />
                {t("search")}
              </div>
              <div className={styles.update}>
                <Checkbox
                  checked={masterCheckUpdate}
                  onChange={() => masterUpdateHandler()}
                />
                {t("update")}
              </div>
              <div className={styles.variable}>{t("processVariable")}</div>
            </div>
          ) : null}
          {jmsConsumerData &&
            jmsConsumerData?.messageDataList.map((val, index) => {
              return (
                <div className="row" style={{ marginTop: "1rem" }}>
                  <div className={styles.message}>
                    <Checkbox />
                    {val.messageData}
                  </div>
                  <div className={styles.search}>
                    <Checkbox
                      checked={val.Search}
                      onChange={() => searchHandler(val.Search, index)}
                      id="searchBox"
                    />
                  </div>
                  <div className={styles.update}>
                    <Checkbox
                      checked={val.Update}
                      onChange={() => updateHandler(val.Update, index)}
                      id="updateBox"
                    />
                  </div>
                  <div className={styles.variable}>
                    <Select
                      className="selectDropdown"
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
                      value={val.VariableProperty}
                      onChange={(e) => onSelectName(e, index)}
                      id="variableDropdown"
                      style={{
                        border: ".5px solid grey",
                        width: "9rem",
                        height: "2rem",
                        fontSize: "14px",
                      }}
                    >
                      {processVariableDropdown.map((val) => {
                        return (
                          <MenuItem
                            className={styles.menuItemStyles}
                            key={val.VariableName}
                            value={val.VariableName}
                          >
                            {val.VariableName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                </div>
              );
            })}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {
            <div className="row" style={{ marginTop: "1rem" }}>
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
              <input
                className={styles.inputCollapse}
                id="jmsConsumerInput"
                value={destinationName}
                onChange={(e) => nameHandler(e)}
                onBlur={changeDestintionNameHandler}
              />

              <button
                className={
                  destinationName.trim().length === 0
                    ? styles.importXmlBtnDisable
                    : styles.importXmlBtn
                }
                id="importXmlBtn"
                onClick={importXmlHandlerCollapse}
                disabled={destinationName.trim().length === 0}
              >
                {t("importXml")}
              </button>
            </div>
          }
          {jmsConsumerData && jmsConsumerData.messageDataList.length > 0 ? (
            <div className="row" style={{ marginTop: "2rem" }}>
              <div
                className={styles.messageCollapse}
                onClick={messageCollapseHandler}
              >
                <i>{t("messageData")}</i>
              </div>
            </div>
          ) : null}
          {jmsConsumerData &&
            jmsConsumerData?.messageDataList.map((val) => {
              return (
                <div className="row" style={{ marginTop: "1rem" }}>
                  <div className={styles.message}>
                    <Checkbox />
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
            height: "40vh",
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
              activityId={
                localLoadedActivityPropertyData.ActivityProperty.ActivityId
              }
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
