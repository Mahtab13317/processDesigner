// Changes made to solve Bug Bug 116922 - Workstep streams: while opening the property window and clicking on streams tab the blank screen appears
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";
import styles from "./index.module.css";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddCondition from "./AddCondition";
import SearchBox from "../../../../UI/Search Component/index";
import {
  getConditionalOperatorLabel,
  getLogicalOperator,
} from "../ActivityRules/CommonFunctionCall.js";
import {
  ADD_SYMBOL,
  CONSTANT,
  ERROR_INCORRECT_FORMAT,
  ERROR_MANDATORY,
  ERROR_RANGE,
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants.js";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import TextInput from "../../../../UI/Components_With_ErrrorHandling/InputField/index.js";
import arabicStyles from "./ArabicStyles.module.css";
import * as actionCreators from "../../../../redux-store/actions/Properties/showDrawerAction";
import { REGEX, validateRegex } from "../../../../validators/validator";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import TabsHeading from "../../../../UI/TabsHeading";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

function RuleStatement(props) {
  const {
    provided,
    streamStatement,
    streamSelectHandler,
    index,
    val,
    showDragIcon,
    isSelected,
  } = props;
  return (
    <div
      className="flex"
      style={{
        marginTop: "0.5rem",
        cursor: "pointer",
        padding: "0.5rem 0.75vw",
        background: isSelected ? "#e8f3fa 0% 0% no-repeat padding-box" : "#fff",
      }}
      onClick={() => streamSelectHandler(index)}
    >
      {showDragIcon ? (
        <div
          {...provided.dragHandleProps}
          style={{
            height: "1.5rem",
            display: "flex",
            paddingRight: "0.1vw",
          }}
        >
          <DragIndicatorOutlinedIcon
            style={{ width: "1.35rem", height: "1.45rem" }}
          />
        </div>
      ) : (
        <div className={styles.showIndex}>{index + 1}. </div>
      )}
      <div id="stream_list">
        <h5
          style={{
            font: "normal normal bold var(--base_text_font_size)/17px var(--font_family)",
          }}
        >
          {val.ruleName}{" "}
        </h5>
        <p
          style={{
            fontSize: "var(--sub_text_font_size)",
            lineHeight: "15px",
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
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [streamName, setStreamName] = useState("");
  const [workList, setWorkList] = useState("A");
  const [selectedStream, setSelectedStream] = useState(0);
  const [streamStatement, setstreamStatement] = useState([]);
  const [disable, setdisable] = useState(true);
  const [streamsData, setStreamData] = useState([]);
  const dispatch = useDispatch();
  const [showDragIcon, setshowDragIcon] = useState(false);
  const [error, setError] = useState({});
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchedStreamData, setSearchedStreamData] = useState([]);
  const [validateError, setValidateError] = useState(false);
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut);

  const streamNameHandler = (e) => {
    setStreamName(e.target.value);
    if (
      streamsData?.ActivityProperty?.streamInfo?.esRuleList[selectedStream]
        ?.status === "added"
    ) {
      setStreamData((prev) => {
        let temp = { ...prev };
        temp.ActivityProperty.streamInfo.esRuleList[selectedStream].status =
          "edited";
        return temp;
      });
    }
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
    if (
      streamsData?.ActivityProperty?.streamInfo?.esRuleList[selectedStream]
        ?.status === "added"
    ) {
      setStreamData((prev) => {
        let temp = { ...prev };
        temp.ActivityProperty.streamInfo.esRuleList[selectedStream].status =
          "edited";
        return temp;
      });
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
      localLoadedActivityPropertyData?.ActivityProperty?.streamInfo?.esRuleList[
        index
      ]?.ruleName
    );
    /*code edited on 28 July 2022 for BugId 111554 */
    if (
      localLoadedActivityPropertyData?.ActivityProperty?.streamInfo?.esRuleList[
        index
      ]?.ruleName?.trim() === "Default"
    ) {
      setWorkList("A");
      setdisable(true);
    } else if (
      localLoadedActivityPropertyData?.ActivityProperty?.streamInfo?.esRuleList[
        index
      ]?.ruleCondList[0]?.param1?.trim() === ""
    ) {
      setWorkList("A");
      setdisable(true);
    } else {
      setWorkList("O");
      setdisable(false);
    }
    setError({});
    //code edited on 5 August 2022 for Bug 112847
    setValidateError(false);
  };

  console.log(
    localLoadedActivityPropertyData?.ActivityProperty?.streamInfo?.esRuleList
  );
  const addNewStreamHandler = () => {
    let maxRuleId = 0;
    localLoadedActivityPropertyData?.ActivityProperty?.streamInfo?.esRuleList?.forEach(
      (element) => {
        if (+element.ruleOrderId > +maxRuleId) {
          maxRuleId = element.ruleOrderId;
        }
      }
    );
    let newRule = {
      ruleCondList: [{ condOrderId: "1", ...blankObjectCondition }],
      ruleId: +maxRuleId + 1 + "",
      ruleType: "S",
      ruleName: "New Stream",
      ruleOrderId: 1,
      status: "temporary",
    };
    let temp = { ...localLoadedActivityPropertyData };
    let isTempAvailable = false;
    temp?.ActivityProperty?.streamInfo?.esRuleList?.forEach((el) => {
      if (el.status === "temporary") {
        isTempAvailable = true;
      }
    });
    //console.log(newRule);
    if (isTempAvailable) {
      //  const len = temp?.ActivityProperty?.streamInfo?.esRuleList?.length || 1;
      //temp.ActivityProperty.streamInfo.esRuleList[len - 1] = { ...newRule };
      temp.ActivityProperty.streamInfo.esRuleList[0] = { ...newRule };
      //console.log(temp.ActivityProperty.streamInfo.esRuleList);
    } else {
      /*  const len =
        temp?.ActivityProperty?.streamInfo?.esRuleList?.length - 1 || 1;
      temp.ActivityProperty.streamInfo.esRuleList.splice(len - 1, 0, newRule);

      let ruleOrderId = 1;*/
      temp?.ActivityProperty?.streamInfo?.esRuleList?.forEach((element) => {
        element.ruleOrderId = +element.ruleOrderId + 1;
        // ruleOrderId++;
      });
      //  console.log(temp.ActivityProperty.streamInfo.esRuleList);
      temp.ActivityProperty.streamInfo.esRuleList.splice(0, 0, newRule);
    }
    setlocalLoadedActivityPropertyData(temp);
    if (!props.isDrawerExpanded) {
      props.expandDrawer(true);
    }
    //code edited on 5 August 2022 for Bug 112847
    setValidateError(false);
    const timeout = setTimeout(() => {
      const input = document.getElementById("StreamNameInput");
      input.select();
      input.focus();
    }, 500);
    return () => clearTimeout(timeout);
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

  const streamCondListAll = {
    condOrderId: "1",
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
    operator: "4",
    logicalOp: "4",
  };

  const newRow = (value, index) => {
    if (value == ADD_SYMBOL) {
      let maxId = 0;
      streamsData.ActivityProperty.streamInfo.esRuleList[
        index
      ].ruleCondList.forEach((element) => {
        if (element.condOrderId > maxId) {
          maxId = element.condOrderId;
        }
      });
      let ConOrderID = { condOrderId: +maxId + 1 + "" };
      let newRow = { ...ConOrderID, ...blankObjectCondition, isNew: true };
      let temp = { ...streamsData };
      temp.ActivityProperty.streamInfo.esRuleList[index].ruleCondList.push(
        newRow
      );
      setStreamData(temp);
    }
  };

  const addStreamHandler = () => {
    //code edited on 5 August 2022 for Bug 112847
    let tempStream = { ...streamsData };
    tempStream?.ActivityProperty?.streamInfo?.esRuleList[
      selectedStream
    ]?.ruleCondList?.forEach((element) => {
      if (element.isNew) {
        delete element.isNew;
      }
    });
    setStreamData(tempStream);
    setValidateError(true);
    if (streamName == null || streamName.trim() === "") {
      setError({
        streamName: {
          statement: t("streamErrorInput"),
          severity: "error",
          errorType: ERROR_MANDATORY,
        },
      });
    } else if (streamName.length > 30) {
      setError({
        streamName: {
          statement: t("streamErrorLength"),
          severity: "error",
          errorType: ERROR_RANGE,
        },
      });
    } else if (
      !validateRegex(streamName, REGEX.StartWithAlphaThenAlphaNumAndOnlyUs)
    ) {
      setError({
        streamName: {
          statement: t("streamErrorFirstLetter"),
          severity: "error",
          errorType: ERROR_INCORRECT_FORMAT,
        },
      });
    } else {
      let temp = { ...localLoadedActivityPropertyData };
      let doExists = false;
      temp?.ActivityProperty?.streamInfo?.esRuleList?.forEach((el, index) => {
        if (el.ruleName === streamName && index > 0) {
          doExists = true;
        }
      });
      if (doExists) {
        dispatch(
          setToastDataFunc({
            message: `${t("StreamAlreadyExists")}`,
            severity: "error",
            open: true,
          })
        );
        const input = document.getElementById("StreamNameInput");
        input.select();
        input.focus();
      } else {
        //code edited on 5 August 2022 for Bug 112847
        let isValid = true;
        if (workList === "O") {
          tempStream?.ActivityProperty?.streamInfo?.esRuleList[
            selectedStream
          ]?.ruleCondList?.forEach((el) => {
            if (
              !el.param1 ||
              el.param1?.trim() === "" ||
              !el.operator ||
              el.operator?.trim() === "" ||
              !el.param2 ||
              el.param2?.trim() === "" ||
              el.param2?.trim() === CONSTANT // code added on 23 Aug 2022 for BugId 114353
            ) {
              isValid = false;
            }
          });
        }
        if (isValid) {
          temp.ActivityProperty.streamInfo.esRuleList[0] = {
            ruleCondList:
              workList == "A"
                ? [streamCondListAll]
                : tempStream?.ActivityProperty?.streamInfo?.esRuleList[
                    selectedStream
                  ]?.ruleCondList,
            ruleId: temp.ActivityProperty.streamInfo.esRuleList[0].ruleId,
            ruleType: temp.ActivityProperty.streamInfo.esRuleList[0].ruleType,
            ruleName: streamName,
            ruleOrderId:
              temp.ActivityProperty.streamInfo.esRuleList[0].ruleOrderId,
          };
          setlocalLoadedActivityPropertyData(temp);
        }
      }
    }
  };

  const modifyStreamHandler = () => {
    //code edited on 5 August 2022 for Bug 112847
    let tempStream = { ...streamsData };
    tempStream?.ActivityProperty?.streamInfo?.esRuleList[
      selectedStream
    ]?.ruleCondList?.forEach((element) => {
      if (element.isNew) {
        delete element.isNew;
      }
    });
    setStreamData(tempStream);
    setValidateError(true);
    if (streamName == null || streamName.trim() === "") {
      setError({
        streamName: {
          statement: t("streamErrorInput"),
          severity: "error",
          errorType: ERROR_MANDATORY,
        },
      });
    } else if (streamName.length > 30) {
      setError({
        streamName: {
          statement: t("streamErrorLength"),
          severity: "error",
          errorType: ERROR_RANGE,
        },
      });
    } else if (
      !validateRegex(streamName, REGEX.StartWithAlphaThenAlphaNumAndOnlyUs)
    ) {
      setError({
        streamName: {
          statement: t("streamErrorFirstLetter"),
          severity: "error",
          errorType: ERROR_INCORRECT_FORMAT,
        },
      });
    } else {
      let temp = JSON.parse(JSON.stringify(streamsData));
      let tempLocal = JSON.parse(
        JSON.stringify(localLoadedActivityPropertyData)
      );
      let doExists = false;
      tempLocal?.ActivityProperty?.streamInfo?.esRuleList?.forEach(
        (el, index) => {
          if (el.ruleName === streamName && index > 0) {
            doExists = true;
          }
        }
      );
      if (doExists) {
        dispatch(
          setToastDataFunc({
            message: `${t("StreamAlreadyExists")}`,
            severity: "error",
            open: true,
          })
        );
        const input = document.getElementById("StreamNameInput");
        input.select();
        input.focus();
      } else {
        let isValid = true;
        if (workList === "O") {
          temp?.ActivityProperty?.streamInfo?.esRuleList[
            selectedStream
          ]?.ruleCondList?.forEach((el) => {
            if (
              !el.param1 ||
              el.param1?.trim() === "" ||
              !el.operator ||
              el.operator?.trim() === "" ||
              !el.param2 ||
              el.param2?.trim() === "" ||
              el.param2?.trim() === CONSTANT // code added on 23 Aug 2022 for BugId 114353
            ) {
              isValid = false;
            }
          });
        }
        if (isValid) {
          tempLocal.ActivityProperty.streamInfo.esRuleList[selectedStream] = {
            ruleCondList:
              workList == "A"
                ? [streamCondListAll]
                : temp?.ActivityProperty?.streamInfo?.esRuleList[selectedStream]
                    ?.ruleCondList,
            ruleId: temp.ActivityProperty.streamInfo.esRuleList[0].ruleId,
            ruleType: temp.ActivityProperty.streamInfo.esRuleList[0].ruleType,
            ruleName: streamName,
            ruleOrderId:
              temp.ActivityProperty.streamInfo.esRuleList[0].ruleOrderId,
          };
          setlocalLoadedActivityPropertyData(tempLocal);
        }
      }
    }
  };

  const cancelHandler = () => {
    if (
      streamsData?.ActivityProperty?.streamInfo?.esRuleList[selectedStream]
        ?.status === "edited"
    ) {
      setStreamData((prev) => {
        let temp = JSON.parse(JSON.stringify(prev));
        let tempLocal = JSON.parse(
          JSON.stringify(localLoadedActivityPropertyData)
        );
        temp.ActivityProperty.streamInfo.esRuleList[selectedStream] =
          tempLocal.ActivityProperty.streamInfo.esRuleList[selectedStream];

        temp.ActivityProperty.streamInfo.esRuleList[selectedStream] = {
          ...temp.ActivityProperty.streamInfo.esRuleList[selectedStream],
          status: "added",
        };
        return temp;
      });
    } else {
      let temp = { ...localLoadedActivityPropertyData };
      temp.ActivityProperty.streamInfo.esRuleList.splice(selectedStream, 1);
      temp?.ActivityProperty?.streamInfo?.esRuleList?.forEach((element) => {
        element.ruleOrderId = +element.ruleOrderId - 1;
      });
      setlocalLoadedActivityPropertyData(temp);
    }
    //code edited on 5 August 2022 for Bug 112847
    setValidateError(false);
  };

  const deleteHandler = () => {
    let temp = { ...localLoadedActivityPropertyData };
    temp.ActivityProperty.streamInfo.esRuleList.splice(selectedStream, 1);
    setlocalLoadedActivityPropertyData(temp);
  };

  // code added on 28 July 2022 for BugId 111553
  const onSearchSubmit = (searchVal) => {
    setSearchTerm(null);
    if (searchVal?.trim() !== "") {
      let arr = [];
      let temp = JSON.parse(JSON.stringify(streamsData));
      temp?.ActivityProperty?.streamInfo?.esRuleList?.forEach((elem) => {
        if (elem.ruleName.toLowerCase().includes(searchVal.trim())) {
          arr.push(elem);
        }
      });
      temp.ActivityProperty.streamInfo.esRuleList = [...arr];
      setSearchedStreamData(temp);
    } else {
      clearResult();
    }
  };

  // code added on 28 July 2022 for BugId 111553
  const clearResult = () => {
    setSearchedStreamData(streamsData ? streamsData : []);
  };

  useEffect(() => {
    // code added on 7 Sep 2022 for BugId 115470
    if (localLoadedActivityPropertyData?.Status === 0) {
      let sentence = [];
      let tempData = JSON.parse(
        JSON.stringify(localLoadedActivityPropertyData)
      );
      let tempStreamData = tempData?.ActivityProperty?.streamInfo?.esRuleList
        ? [...tempData?.ActivityProperty?.streamInfo?.esRuleList]
        : [];
      tempStreamData?.forEach((val, index) => {
        let ruleStatement = "";
        val.ruleCondList &&
          val.ruleCondList.forEach((element) => {
            if (element.param1?.trim() !== "") {
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
            }
          });
        sentence.push(ruleStatement);
        if (
          tempData?.ActivityProperty?.streamInfo?.esRuleList[index]?.status !==
          "temporary"
        ) {
          tempData.ActivityProperty.streamInfo.esRuleList[index] = {
            ...tempData?.ActivityProperty?.streamInfo?.esRuleList[index],
            status: "added",
          };
        }
      });
      setStreamData(tempData);
      setSearchedStreamData(tempData);
      setstreamStatement(sentence);
      streamSelectHandler(0);
    }
  }, [localLoadedActivityPropertyData]);

  const onDragEnd = (result) => {
    let sentence = [];
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
      sentence.push(ruleStatement);
    });
    setstreamStatement(sentence);
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
          <div className="row" style={{ padding: "0 1vw" }}>
            <h5 style={{ fontSize: "var(--subtitle_text_font_size)" }}>
              {t("streams")}
            </h5>
            {!isReadOnly && (
              <button
                className={styles.addButton}
                id="AddStream"
                data-testid="addNewStreamBtn"
                onClick={addNewStreamHandler}
              >
                {t("addNewStream")}
              </button>
            )}
          </div>
          <div style={{ padding: "0 1vw", marginTop: "0.5rem" }}>
            <SearchBox
              width="100%"
              style={{
                maxWidth: "100%",
              }}
              placeholder={t("search")}
              onSearchChange={onSearchSubmit} // code added on 28 July 2022 for BugId 111553
              clearSearchResult={clearResult} // code added on 28 July 2022 for BugId 111553
              name="search"
              searchTerm={searchTerm}
              id="stream_search"
            />
          </div>
          {/*code added on 23 August 2022 for BugId 114355*/}
          <div className={styles.streamListDiv}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="pickListInputs">
                {(provided) => (
                  <div
                    className="inputs"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <div
                      onMouseOver={() => {
                        if (!isReadOnly) {
                          setshowDragIcon(true);
                        }
                      }}
                      onMouseLeave={() => setshowDragIcon(false)}
                    >
                      {searchedStreamData?.ActivityProperty?.streamInfo?.esRuleList?.map(
                        (val, index) => {
                          return (
                            <Draggable
                              draggableId={`${index}`}
                              key={`${index}`}
                              index={index}
                              isDragDisabled={isReadOnly}
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
                                    isSelected={selectedStream === index}
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
        </div>

        {props.isDrawerExpanded && (
          <div className={styles.rightPanel}>
            <p className={styles.labelTittle}>
              {t("streamName")}
              <span className={styles.starIcon}>*</span>
            </p>
            <TextInput
              inputValue={streamName}
              classTag={styles.nameInput}
              name="ruleName"
              onChangeEvent={(e) => streamNameHandler(e)}
              idTag="StreamNameInput"
              readOnlyCondition={streamName?.trim() === "Default" || isReadOnly}
              errorStatement={error?.streamName?.statement}
              rangeVal={{ start: 0, end: 30 }}
              regexStr={REGEX.StartWithAlphaThenAlphaNumAndOnlyUs}
              errorSeverity={"error"}
              errorType={error?.streamName?.errorType}
              inlineError={true}
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
                disabled={streamName?.trim() === "Default" || isReadOnly}
              />
              <FormControlLabel
                value="O"
                data-testid="Second"
                control={<Radio />}
                label={t("onFilter")}
                disabled={streamName?.trim() === "Default" || isReadOnly}
              />
            </RadioGroup>
            {/*code added on 28 July 2022 for BugId 111555 */}
            <div className={styles.addCondDiv}>
              {(streamsData?.ActivityProperty?.streamInfo?.esRuleList[
                selectedStream
              ]?.ruleCondList
                ? streamsData.ActivityProperty.streamInfo.esRuleList[
                    selectedStream
                  ].ruleCondList
                : [{ condOrderId: "1", ...blankObjectCondition }]
              ).map((val, index) => {
                return (
                  <AddCondition
                    localData={val}
                    index={index}
                    streamsData={streamsData}
                    setStreamData={setStreamData}
                    parentIndex={selectedStream}
                    newRow={newRow}
                    showDelIcon={index > 0}
                    disabled={disable || isReadOnly}
                    validateError={validateError} //code edited on 5 August 2022 for Bug 112847
                    isReadOnly={isReadOnly}
                  />
                );
              })}
            </div>
            {/*code edited on 28 July 2022 for BugId 111552 */}
            {streamName?.trim() === "Default" || isReadOnly ?null: (
              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.footerStream
                    : styles.footerStream
                }
              >
                {streamsData?.ActivityProperty?.streamInfo?.esRuleList[
                  selectedStream
                ]?.status === "added" ? (
                  <button
                    className={styles.cancelButton}
                    data-testid="delBtn"
                    id="stream_delBtn"
                    onClick={deleteHandler}
                  >
                    {t("delete")}
                  </button>
                ) : (
                  <button
                    className={styles.cancelButton}
                    data-testid="cancelBtn"
                    id="stream_cancelBtn"
                    onClick={cancelHandler}
                  >
                    {t("cancel")}
                  </button>
                )}
                {streamsData?.ActivityProperty?.streamInfo?.esRuleList[
                  selectedStream
                ]?.status === "edited" ? (
                  <button
                    className={styles.addButton}
                    data-testid="modifyStreamBtn"
                    id="stream_modifyStreamBtn"
                    onClick={() => modifyStreamHandler()}
                  >
                    {t("modifyStream")}
                  </button>
                ) : streamsData?.ActivityProperty?.streamInfo?.esRuleList[
                    selectedStream
                  ]?.status === "temporary" ? (
                  <button
                    className={styles.addButton}
                    data-testid="addStreamBtn"
                    id="stream_addStreamBtn"
                    onClick={() => addStreamHandler()}
                  >
                    {t("addStream")}
                  </button>
                ) : null}
              </div>
            )}
          </div>
        )}
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
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    expandDrawer: (flag) => dispatch(actionCreators.expandDrawer(flag)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stream);
