import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";
import * as actionCreators from "../../../../redux-store/actions/selectedCellActions";
import { connect } from "react-redux";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import styles from "./index.module.css";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddCondition from "./AddCondition";
import SearchBox from "../../../../UI/Search Component/index";
import {
  getConditionalOperator,
  getConditionalOperatorLabel,
  getLogicalOperator,
} from "../ActivityRules/CommonFunctionCall.js";
import {
  ADD_SYMBOL,
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants.js";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  setSave,
  ActivityPropertySaveCancelValue,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import TextInput from "../../../../UI/Components_With_ErrrorHandling/InputField/index.js";
import arabicStyles from "./ArabicStyles.module.css";

function RuleStatement(props) {
  const {
    provided,
    streamStatement,
    streamSelectHandler,
    index,
    val,
    showDragIcon,
  } = props;
  return (
    <div
      className="pickListInputDiv"
      style={{
        marginTop: "5px",
      }}
    >
      {showDragIcon ? (
        <div {...provided.dragHandleProps}>
          <DragIndicatorOutlinedIcon style={{ marginTop: "10px" }} />
        </div>
      ) : (
        <div className={styles.showIndex}>{index + 1}</div>
      )}
      <div
        id="stream_list"
        style={{
          minHeight: "2.5rem",
          marginTop: ".5rem",
        }}
        onClick={() => streamSelectHandler(index)}
      >
        <h5>{val.ruleName} </h5>
        <p
          style={{
            fontSize: "10px",
            lineHeight: "11px",
          }}
        >
          {streamStatement[index]}
        </p>
      </div>
    </div>
  );
}

function Stream(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [streamName, setStreamName] = useState("");
  const [workList, setWorkList] = useState("O");
  const [selectedStream, setSelectedStream] = useState(0);
  const [streamStatement, setstreamStatement] = useState([]);
  const [showCancelBtn, setshowCancelBtn] = useState(false);
  const [showModifyBtn, setshowModifyBtn] = useState(true);
  const [disable, setdisable] = useState(false);
  const [streamsData, setStreamData] = useState(
    localLoadedActivityPropertyData.ActivityProperty.streamInfo.esRuleList
  );
  const dispatch = useDispatch();
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [showDragIcon, setshowDragIcon] = useState(false);
  const [error, setError] = useState({});

  const streamNameHandler = (e) => {
    setStreamName(e.target.value);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.streams]: { isModified: true, hasError: false },
      })
    );
  };
  const workListHandler = (e) => {
    setWorkList(e.target.value);
    if (e.target.value === "A") {
      setdisable(true);
    } else if (e.target.value === "O") {
      setdisable(false);
    }
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.streams]: { isModified: true, hasError: false },
      })
    );
  };
  const streamSelectHandler = (index) => {
    setSelectedStream(index);
    setStreamName(
      localLoadedActivityPropertyData.ActivityProperty.streamInfo.esRuleList[
        index
      ].ruleName
    );
  };

  const addNewStreamHandler = () => {
    let maxRuleId = 0;
    localLoadedActivityPropertyData.ActivityProperty.streamInfo.esRuleList &&
      localLoadedActivityPropertyData.ActivityProperty.streamInfo.esRuleList
        .length > 0 &&
      localLoadedActivityPropertyData.ActivityProperty.streamInfo.esRuleList.forEach(
        (element) => {
          if (element.ruleOrderId > maxRuleId) {
            maxRuleId = element.ruleOrderId;
          }
        }
      );

    let newRule = {
      ruleCondList: [{ condOrderId: "1", ...blankObjectCondition }],
      ruleId: +maxRuleId + 1 + "",
      ruleType: "S",
      ruleName: "",
      ruleOrderId: +maxRuleId + 1 + "",
    };
    let temp = { ...localLoadedActivityPropertyData };
    temp.ActivityProperty.streamInfo.esRuleList.push(newRule);
    setlocalLoadedActivityPropertyData(temp);
    setSelectedStream(temp.ActivityProperty.streamInfo.esRuleList.length - 1);
    setStreamName("");
    setshowCancelBtn(true);
    setshowModifyBtn(false);
  };

  const blankObjectCondition = {
    param1: "",
    type1: "M",
    extObjID1: "0",
    variableId_1: "0",
    varFieldId_1: "0",
    param2: "",
    type2: "M",
    extObjID2: "0",
    variableId_2: "0",
    varFieldId_2: "0",
    operator: "",
    logicalOp: "3",
  };

  const newRow = (value, index) => {
    if (value == ADD_SYMBOL) {
      let maxId = 0;
      localLoadedActivityPropertyData.ActivityProperty.streamInfo.esRuleList[
        index
      ].ruleCondList.forEach((element) => {
        if (element.condOrderId > maxId) {
          maxId = element.condOrderId;
        }
      });
      let ConOrderID = { condOrderId: +maxId + 1 + "" };
      let newRow = { ...ConOrderID, ...blankObjectCondition };
      let temp = localLoadedActivityPropertyData;
      temp.ActivityProperty.streamInfo.esRuleList[index].ruleCondList.push(
        newRow
      );
      setlocalLoadedActivityPropertyData(temp);
    }
  };

  const addStreamHandler = () => {
    if (streamName == null || streamName == "") {
      setError({ ...error, streamName: t("streamErrorInput") });
    } else if (streamName.length > 30) {
      setError({ ...error, streamName: t("streamErrorLength") });
    } else if (!streamName.match(/[a-z]/i)) {
      setError({ ...error, streamName: t("streamErrorFirstLetter") });
    } else {
      let temp = { ...localLoadedActivityPropertyData };
      temp.ActivityProperty.streamInfo.esRuleList.forEach((val, index) => {
        if (index === selectedStream) {
          val.ruleName = streamName;
        }
      });
      let sentance = [];
      temp.ActivityProperty.streamInfo.esRuleList.map((val, index) => {
        let ruleStatement = "";
        val.ruleCondList &&
          val.ruleCondList.forEach((element) => {
            const concatenatedString = ruleStatement.concat(
              " ",
              element.param1,
              " ",
              element.param1 == "" ? "" : t("is"),
              " ",
              getConditionalOperatorLabel(element.operator),
              " ",
              element.param2,
              " ",
              getLogicalOperator(element.logicalOp)
            );
            ruleStatement = concatenatedString;
          });
        sentance.push(ruleStatement);
      });
      if (workList == "A") {
        temp.ActivityProperty.streamInfo.esRuleList[
          selectedStream
        ].ruleCondList = [{ condOrderId: "1", ...blankObjectCondition }];
      }
      setlocalLoadedActivityPropertyData(temp);

      setstreamStatement(sentance);
      setshowModifyBtn(true);
      setshowCancelBtn(false);
    }
  };

  const cancelHandler = () => {
    let temp = { ...localLoadedActivityPropertyData };
    temp.ActivityProperty.streamInfo.esRuleList.splice(selectedStream, 1);
    setlocalLoadedActivityPropertyData(temp);
    setSelectedStream(0);
    setStreamName(
      localLoadedActivityPropertyData.ActivityProperty.streamInfo.esRuleList[0]
        .ruleName
    );
  };

  const deleteHandler = () => {
    let temp = { ...localLoadedActivityPropertyData };
    temp.ActivityProperty.streamInfo.esRuleList.splice(selectedStream, 1);
    setlocalLoadedActivityPropertyData(temp);
    setSelectedStream(0);
    setStreamName(
      localLoadedActivityPropertyData.ActivityProperty.streamInfo.esRuleList[0]
        .ruleName
    );
  };

  useEffect(() => {
    let sentance = [];
    localLoadedActivityPropertyData.ActivityProperty.streamInfo.esRuleList.forEach(
      (val) => {
        let ruleStatement = "";
        val.ruleCondList &&
          val.ruleCondList.forEach((element) => {
            const concatenatedString = ruleStatement.concat(
              " ",
              element.param1,
              " ",
              element.param1 == "" ? "" : t("is"),
              " ",
              getConditionalOperatorLabel(element.operator),
              " ",
              element.param2,
              " ",
              getLogicalOperator(element.logicalOp)
            );
            ruleStatement = concatenatedString;
          });
        sentance.push(ruleStatement);
      }
    );
    setstreamStatement(sentance);
    setSelectedStream(0);
    setStreamName(
      localLoadedActivityPropertyData.ActivityProperty.streamInfo.esRuleList[0]
        .ruleName
    );
    setshowModifyBtn(true);
    setshowCancelBtn(false);
  }, []);

  const onDragEnd = (result) => {
    let sentance = [];
    const { source, destination } = result;
    if (!destination) return;
    let streamArray = { ...localLoadedActivityPropertyData };
    const [reOrderedPickListItem] =
      streamArray.ActivityProperty.streamInfo.esRuleList.splice(
        source.index,
        1
      );
    streamArray.ActivityProperty.streamInfo.esRuleList.splice(
      destination.index,
      0,
      reOrderedPickListItem
    );
    streamArray.ActivityProperty.streamInfo.esRuleList.forEach((val) => {
      let ruleStatement = "";
      val.ruleCondList &&
        val.ruleCondList.forEach((element) => {
          const concatenatedString = ruleStatement.concat(
            " ",
            element.param1,
            " ",
            element.param1 == "" ? "" : t("is"),
            " ",
            getConditionalOperatorLabel(element.operator),
            " ",
            element.param2,
            " ",
            getLogicalOperator(element.logicalOp)
          );
          ruleStatement = concatenatedString;
        });
      sentance.push(ruleStatement);
    });
    setstreamStatement(sentance);
    setSelectedStream(destination.index);
    setStreamName(
      localLoadedActivityPropertyData.ActivityProperty.streamInfo.esRuleList[
        destination.index
      ].ruleName
    );
    setlocalLoadedActivityPropertyData(streamArray);
  };

  return (
    <React.Fragment>
      <div className={styles.streamScreen}>
        <div className={styles.leftPanel}>
          <div className="row">
            <h5>{t("streams")}</h5>
            <button
              className={styles.addButton}
              id="AddStream"
              data-testid="addNewStreamBtn"
              onClick={addNewStreamHandler}
            >
              {t("addNewStream")}
            </button>
          </div>
          <SearchBox
            width="100%"
            height="1.5rem"
            style={{
              maxWidth: "323px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
            placeholder={t("search")}
          />

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="pickListInputs">
              {(provided) => (
                <div
                  className="inputs"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div
                    onMouseOver={() => setshowDragIcon(true)}
                    onMouseLeave={() => setshowDragIcon(false)}
                  >
                    {localLoadedActivityPropertyData.ActivityProperty.streamInfo
                      .esRuleList &&
                      localLoadedActivityPropertyData.ActivityProperty.streamInfo.esRuleList.map(
                        (val, index) => {
                          return (
                            <Draggable
                              draggableId={`${index}`}
                              key={`${index}`}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  {...provided.draggableProps}
                                  ref={provided.innerRef}
                                >
                                  <RuleStatement
                                    streamStatement={streamStatement}
                                    streamSelectHandler={streamSelectHandler}
                                    index={index}
                                    val={val}
                                    provided={provided}
                                    showDragIcon={showDragIcon}
                                  />
                                </div>
                              )}
                            </Draggable>
                          );
                        }
                      )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className={styles.rightPanel}>
          <h5>{t("newStream")}</h5>

          <p className={styles.labelTittle}>{t("streamName")}</p>

          <TextInput
            showError={error.streamName ? true : false}
            inputValue={streamName}
            onChangeEvent={(e) => streamNameHandler(e)}
            idTag="stream_nameInput"
            errorStatement={error.streamName}
            errorStatementClass={styles.errorStatementClass}
          />
          <p className={styles.labelTittle}>{t("worklist")}</p>

          <RadioGroup
            onChange={(e) => workListHandler(e)}
            value={workList}
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.radiobtn
                : styles.radiobtn
            }
            id="radiobtns"
          >
            <FormControlLabel
              value="A"
              data-testid="First"
              control={<Radio />}
              label={t("all")}
            />
            <FormControlLabel
              value="O"
              data-testid="Second"
              control={<Radio />}
              label={t("onFilter")}
            />
          </RadioGroup>
          {(localLoadedActivityPropertyData.ActivityProperty.streamInfo
            .esRuleList[selectedStream].ruleCondList
            ? localLoadedActivityPropertyData.ActivityProperty.streamInfo
                .esRuleList[selectedStream].ruleCondList
            : [{ condOrderId: "1", ...blankObjectCondition }]
          ).map((val, index) => {
            console.log("val", val);
            return (
              <AddCondition
                localData={val}
                index={index}
                streamsData={localLoadedActivityPropertyData}
                setStreamData={setlocalLoadedActivityPropertyData}
                parentIndex={selectedStream}
                newRow={newRow}
                showDelIcon={index > 0}
                disabled={disable}
              />
            );
          })}

          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.footerStream
                : styles.footerStream
            }
          >
            {showCancelBtn ? (
              <button
                className={styles.cancelButton}
                data-testid="cancelBtn"
                // id="stream_cancelBtn"
                onClick={cancelHandler}
              >
                {t("cancel")}
              </button>
            ) : (
              <button
                className={styles.cancelButton}
                data-testid="delBtn"
                id="stream_delBtn"
                onClick={deleteHandler}
              >
                {t("delete")}
              </button>
            )}
            {showModifyBtn ? (
              <button
                className={styles.addButton}
                data-testid="modifyStreamBtn"
                id="stream_modifyStreamBtn"
                onClick={() => addStreamHandler()}
              >
                {t("modifyStream")}
              </button>
            ) : (
              <button
                className={styles.addButton}
                data-testid="addStreamBtn"
                // id="stream_addStreamBtn"
                onClick={() => addStreamHandler()}
              >
                {t("addStream")}
              </button>
            )}
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps, null)(Stream);
