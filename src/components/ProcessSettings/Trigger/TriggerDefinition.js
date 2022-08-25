// #BugID - 109982 (Trigger Bug)
// #BugDescription - Added a condition to check if description is added or not and prevented trigger from adding.
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, ClickAwayListener } from "@material-ui/core";
import styles from "./trigger.module.css";
import arabicStyles from "./triggerArabicStyles.module.css";
import { connect } from "react-redux";
import * as actionCreators from "../../../redux-store/actions/Trigger";
import {
  triggerTypeOptions,
  triggerTypeName,
} from "../../../utility/ProcessSettings/Triggers/triggerTypeOptions";
import SearchComponent from "../../../UI/Search Component/index";
import axios from "axios";
import {
  ENDPOINT_GETTRIGGER,
  SERVER_URL,
  ENDPOINT_ADDTRIGGER,
  ENDPOINT_REMOVETRIGGER,
  ENDPOINT_MODIFYTRIGGER,
  RTL_DIRECTION,
  PROCESSTYPE_LOCAL,
  STATE_CREATED,
  STATE_EDITED,
  STATE_ADDED,
  ADD_OPTION,
  EDIT_OPTION,
} from "../../../Constants/appConstants";
import { getTriggerPropObj } from "../../../utility/ProcessSettings/Triggers/getTriggerPropObj";
import NoTriggerScreen from "./NoTriggerScreen";
import FileIcon from "../../../assets/HomePage/processIcon.svg";
import NoSelectedTriggerScreen from "./NoSelectedTriggerScreen";
import ButtonDropdown from "../../../UI/ButtonDropdown";
import TriggerListView from "./TriggerListView";
import TriggerMainFormView from "./TriggerMainForm";
import { store, useGlobalState } from "state-pool";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getSelectedTriggerProperties } from "../../../utility/ProcessSettings/Triggers/getSelectedTriggerProperties";
import {
  TRIGGER_TYPE_CHILDWORKITEM,
  TRIGGER_TYPE_DATAENTRY,
  TRIGGER_TYPE_EXCEPTION,
  TRIGGER_TYPE_EXECUTE,
  TRIGGER_TYPE_GENERATERESPONSE,
  TRIGGER_TYPE_LAUNCHAPP,
  TRIGGER_TYPE_MAIL,
  TRIGGER_TYPE_SET,
} from "../../../Constants/triggerConstants";
import "./commonTrigger.css";
import clsx from "clsx";

function TriggerDefinition(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const variableDefinition = localLoadedProcessData?.Variable;
  let { t } = useTranslation();
  const { hideLeftPanel, handleCloseModal } = props;
  const direction = `${t("HTML_DIR")}`;
  const [nameInput, setNameInput] = useState("");
  const [typeInput, setTypeInput] = useState();
  const [descInput, setDescInput] = useState("");
  const [showTypeOption, setShowTypeOptions] = useState(false);
  const [selectedField, setSelectedField] = useState();
  const [triggerData, setTriggerData] = useState([]);
  const [addedTriggerTypes, setAddedTriggerTypes] = useState([]);
  const [spinner, setspinner] = useState(true);
  const [searchedTriggerData, setSearchedTriggerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const triggerTypeOptionList = [
    TRIGGER_TYPE_MAIL,
    TRIGGER_TYPE_EXECUTE,
    TRIGGER_TYPE_LAUNCHAPP,
    TRIGGER_TYPE_DATAENTRY,
    TRIGGER_TYPE_SET,
    TRIGGER_TYPE_GENERATERESPONSE,
    TRIGGER_TYPE_EXCEPTION,
    TRIGGER_TYPE_CHILDWORKITEM,
  ];
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

  //api call to load existing triggers
  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          ENDPOINT_GETTRIGGER +
          "/" +
          props.openProcessID +
          "/" +
          props.openProcessType
      )
      .then((res) => {
        if (res.status === 200) {
          //load Trigger Data
          setTriggerData(res.data?.TriggerList ? res.data.TriggerList : []);
          //load Template List in redux
          props.setTemplates(res.data?.Templates ? res.data.Templates : []);
        }
        setspinner(false);
      });
  }, [props.openProcessID]);

  //load content from selected field to various states
  useEffect(() => {
    if (selectedField) {
      setTypeInput(selectedField.type);
      if (selectedField.status === STATE_CREATED) {
        //if new temporary trigger is created, set focus on name Input field and clear the values in name Input and desc Input state
        document.getElementById("trigger_name").focus();
        setNameInput("");
        setDescInput("");
      }
    }
  }, [selectedField]);

  //group triggers according to their types
  useEffect(() => {
    let triggerTypeArr = [];
    triggerTypeOptionList.map((option) => {
      triggerData?.length > 0 &&
        triggerData.map((trigger) => {
          if (
            trigger.TriggerType === option &&
            !triggerTypeArr.includes(option)
          ) {
            triggerTypeArr.push(option);
          }
        });
    });
    setAddedTriggerTypes(triggerTypeArr);
    setSearchTerm("");
    clearResult();
  }, [triggerData]);

  //if some changes have occurred in definition part of trigger, which has been added to database, then redux value is set from definition component, and used here.
  useEffect(() => {
    if (props.triggerEdited) {
      if (selectedField) {
        //change status of trigger from added or created to edited
        setSelectedField((prev) => {
          return { ...prev, status: STATE_EDITED };
        });
      }
    }
  }, [props.triggerEdited]);

  //clickaway listener func to hide dropdown, that appears on click of +Add trigger button
  const handleClickAway = () => {
    setShowTypeOptions(false);
  };

  //create new temporary trigger on screen
  const createNewTrigger = (triggerType) => {
    handleClickAway();
    setTypeInput(triggerType);
    let indexVal;
    //to remove existing temporary triggers from list, before adding new trigger temporary trigger
    triggerData?.forEach((trigger, index) => {
      if (trigger.status && trigger.status === STATE_CREATED) {
        indexVal = index;
      }
    });
    if (indexVal >= 0) {
      setTriggerData((prev) => {
        let newData = [];
        if (prev.length > 0) {
          newData = [...prev];
        }
        newData.splice(indexVal, 1);
        return newData;
      });
    }
    //calculate maxId of trigger in triggerData
    let maxId = 0;
    triggerData?.forEach((trigger) => {
      if (trigger.TriggerId > maxId) {
        maxId = trigger.TriggerId;
      }
    });
    let newId = +maxId + 1;
    //push temporary trigger in triggerData
    setTriggerData((prev) => {
      let newData = [];
      if (prev.length > 0) {
        newData = [...prev];
      }
      newData.push({
        TriggerId: newId,
        TriggerName: t("newTrigger"),
        TriggerType: triggerType,
        status: STATE_CREATED,
      });
      return newData;
    });
    //set temporary trigger as selected field
    setSelectedField({
      id: newId,
      name: t("newTrigger"),
      type: triggerType,
      status: STATE_CREATED,
    });
    props.setReload(true);
  };

  //on field selection, set selected field with existing status and if status is not present, then added status is applied.
  const onFieldSelection = (data) => {
    setSelectedField({
      id: data.TriggerId,
      name: data.TriggerName,
      type: data.TriggerType,
      status: data.status ? data.status : STATE_ADDED,
    });
    setNameInput(data.TriggerName);
    setDescInput(data.Description);
    setTypeInput(data.TriggerType);
    //set properties of selected field by setting the values in redux
    if (data.Configurations) {
      let properties = getSelectedTriggerProperties(
        data.TriggerType,
        data.Configurations,
        variableDefinition
      );
      props.setTriggerEdited(false);
      props[triggerTypeOptions(data.TriggerType)[3]](properties);
      props.setInitialValues(true);
    } else {
      props.setReload(true);
    }
  };

  const validateFunc = () => {
    let requiredFieldsFilled = true;
    if (props[triggerTypeOptions(typeInput)[0]]) {
      //to check whether all the mandatory fields are filled in definition
      triggerTypeOptions(typeInput)[2]?.forEach((field) => {
        if (
          props[triggerTypeOptions(typeInput)[0]][field] === null ||
          props[triggerTypeOptions(typeInput)[0]][field] === "" ||
          !props[triggerTypeOptions(typeInput)[0]][field]
        ) {
          requiredFieldsFilled = false;
        }
      });
    }
    if (
      typeInput === TRIGGER_TYPE_SET ||
      typeInput === TRIGGER_TYPE_DATAENTRY
    ) {
      //to check whether array has some values
      if (props[triggerTypeOptions(typeInput)[0]].length < 1) {
        requiredFieldsFilled = false;
      }
    }
    if (typeInput === TRIGGER_TYPE_CHILDWORKITEM) {
      let tempVar = props[triggerTypeOptions(typeInput)[0]];
      if (tempVar.list?.length < 1) {
        requiredFieldsFilled = false;
      }
      triggerTypeOptions(typeInput)[2]?.forEach((field1) => {
        if (
          props[triggerTypeOptions(typeInput)[0]][field1] === null ||
          props[triggerTypeOptions(typeInput)[0]][field1].trim() === "" ||
          !props[triggerTypeOptions(typeInput)[0]][field1]
        ) {
          requiredFieldsFilled = false;
        }
      });
    }
    //function to check whether all required fields are filled or not
    if (nameInput.trim() === "") {
      alert("Please fill all mandatory fields");
      document.getElementById("trigger_name").focus();
    } else if (descInput?.trim()?.length === 0) {
      alert("Please fill all mandatory fields");
      document.getElementById("trigger_description").focus();
    } else if (
      props[triggerTypeOptions(typeInput)[0]] &&
      !requiredFieldsFilled
    ) {
      alert("Please fill the required field values in definition");
    } else {
      return 1;
    }
  };

  // to add or modify trigger in database using api
  const addModifyTriggerFunc = (type) => {
    let validateVal = validateFunc();
    if (validateVal === 1) {
      //get properties json of specific trigger type
      const [triggerProperties, localProps] = getTriggerPropObj(
        typeInput,
        props[triggerTypeOptions(typeInput)[0]]
      );
      let processDefId = props.openProcessID;
      const jsonBody = {
        processDefId: processDefId,
        triggerName: nameInput,
        triggerId: selectedField.id,
        triggerType: typeInput,
        triggerTypeName: t(triggerTypeOptions(typeInput)[0]),
        triggerDesc: descInput,
        triggerPropInfo: triggerProperties,
      };
      axios
        .post(
          SERVER_URL +
            (type === ADD_OPTION
              ? ENDPOINT_ADDTRIGGER
              : ENDPOINT_MODIFYTRIGGER),
          jsonBody
        )
        .then((res) => {
          if (res.data.Status === 0) {
            setSelectedField((prev) => {
              let newData = { ...prev };
              newData.name = nameInput;
              newData.type = typeInput;
              newData.status = STATE_ADDED;
              return newData;
            });
            setTriggerData((prev) => {
              let newData = [...prev];
              newData.forEach((data) => {
                if (data.TriggerId === selectedField.id) {
                  data.TriggerName = nameInput;
                  data.TriggerType = typeInput;
                  data.Description = descInput;
                  data.Configurations = localProps;
                  data.status = STATE_ADDED;
                }
              });
              return newData;
            });
            if (type === EDIT_OPTION) {
              //setTriggerEdited to false when trigger is modified
              props.setTriggerEdited(false);
              let newData = JSON.parse(JSON.stringify(localLoadedProcessData));
              newData.TriggerList?.forEach((trigger) => {
                if (trigger.TriggerId === selectedField.id) {
                  trigger.Description = descInput;
                  trigger.TriggerName = nameInput;
                  trigger.TriggerType = typeInput;
                }
              });
              setlocalLoadedProcessData(newData);
            } else if (type === ADD_OPTION) {
              let newData = JSON.parse(JSON.stringify(localLoadedProcessData));
              newData.TriggerList.push({
                Description: descInput,
                TriggerId: selectedField.id,
                TriggerName: nameInput,
                TriggerType: typeInput,
              });
              setlocalLoadedProcessData(newData);
            }
          }
        });
    }
    if (hideLeftPanel) {
      handleCloseModal();
    }
  };

  //function to cancel the changes made to the trigger and reset it to its initial values
  const cancelEditTriggerFunc = () => {
    triggerData.forEach((trigger) => {
      if (trigger.TriggerId === selectedField.id) {
        onFieldSelection(trigger);
      }
    });
  };

  //function to delete the temporary trigger
  const cancelAddTriggerFunc = () => {
    let indexVal;
    triggerData.forEach((trigger, index) => {
      if (trigger.TriggerId === selectedField.id) {
        indexVal = index;
      }
    });
    let newData = [...triggerData];
    newData.splice(indexVal, 1);
    setTriggerData(newData);
    setSelectedField();
    setNameInput("");
    setTypeInput();
    setDescInput("");
  };

  // api call to delete trigger
  const deleteTriggerFunc = () => {
    let jsonBody = {
      processDefId: props.openProcessID,
      triggerName: selectedField.name,
      triggerId: selectedField.id,
      triggerType: selectedField.type,
      triggerDesc: descInput,
    };
    axios.post(SERVER_URL + ENDPOINT_REMOVETRIGGER, jsonBody).then((res) => {
      if (res.data.Status === 0) {
        cancelAddTriggerFunc();
        let newData = JSON.parse(JSON.stringify(localLoadedProcessData));
        let indexVal;
        newData.TriggerList?.forEach((trigEl, index) => {
          if (trigEl.TriggerId === selectedField.id) {
            indexVal = index;
          }
        });
        newData.TriggerList.splice(indexVal, 1);
        setlocalLoadedProcessData(newData);
      }
    });
  };

  const onSearchSubmit = (searchVal) => {
    setSearchTerm(null);
    let arr = [];
    let triggerTypeArr = [];
    triggerData?.forEach((elem) => {
      if (elem.TriggerName.toLowerCase().includes(searchVal.trim())) {
        arr.push(elem);
      }
    });
    setSearchedTriggerData(arr);
    triggerTypeOptionList.map((option) => {
      arr?.length > 0 &&
        arr.map((trig) => {
          if (trig.TriggerType === option && !triggerTypeArr.includes(option)) {
            triggerTypeArr.push(option);
          }
        });
    });
    setAddedTriggerTypes(triggerTypeArr);
  };

  const clearResult = () => {
    let triggerTypeArr = [];
    setSearchedTriggerData(triggerData);
    triggerTypeOptionList.map((option) => {
      triggerData?.length > 0 &&
        triggerData.map((trigEl) => {
          if (
            trigEl.TriggerType === option &&
            !triggerTypeArr.includes(option)
          ) {
            triggerTypeArr.push(option);
          }
        });
    });
  };

  return spinner ? (
    <CircularProgress
      style={
        direction === RTL_DIRECTION
          ? { marginTop: "40vh", marginRight: "50%" }
          : { marginTop: "40vh", marginLeft: "50%" }
      }
    />
  ) : (
    <div
      className={clsx(
        styles.triggerDiv,
        hideLeftPanel && styles.triggerDivRules
      )}
    >
      {triggerData?.length > 0 ? (
        <React.Fragment>
          {!hideLeftPanel ? (
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.triggerListViewArea
                  : styles.triggerListViewArea
              }
            >
              <div className={styles.triggerMainView}>
                <div className={`flex ${styles.triggerSearchDiv}`}>
                  <SearchComponent
                    width="72%"
                    onSearchChange={onSearchSubmit}
                    clearSearchResult={clearResult}
                    name="search"
                    placeholder={t("search")}
                    searchTerm={searchTerm}
                    id="trigger_search"
                  />
                  {readOnlyProcess ? null : (
                    <ClickAwayListener onClickAway={handleClickAway}>
                      <div
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.addTriggerDiv
                            : styles.addTriggerDiv
                        }
                      >
                        <button
                          onClick={() => setShowTypeOptions(true)}
                          className={
                            direction === RTL_DIRECTION
                              ? arabicStyles.addTrigger
                              : styles.addTrigger
                          }
                          id="trigger_side_add_btn"
                        >
                          {"+ "} {t("trigger")}
                        </button>
                        {showTypeOption ? (
                          <ButtonDropdown
                            open={showTypeOption}
                            dropdownOptions={triggerTypeOptionList}
                            onSelect={createNewTrigger}
                            optionRenderFunc={triggerTypeName}
                            id="trigger_sideAdd_varList"
                            style={{ maxHeight: "14rem" }}
                          />
                        ) : null}
                      </div>
                    </ClickAwayListener>
                  )}
                </div>
                <TriggerListView
                  addedTriggerTypes={addedTriggerTypes}
                  triggerData={searchedTriggerData}
                  onFieldSelection={onFieldSelection}
                  selectedField={selectedField}
                />
              </div>
            </div>
          ) : null}

          {selectedField && selectedField !== null ? (
            <div className={styles.triggerMainFormArea}>
              <div className={`flex ${styles.triggerHeadDiv}`}>
                <h2 className={styles.triggerNameHeading}>
                  <img
                    src={FileIcon}
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.triggerFileIcon
                        : styles.triggerFileIcon
                    }
                  />
                  {selectedField.name}
                </h2>

                {!readOnlyProcess ? (
                  selectedField.status === STATE_CREATED ? (
                    <div>
                      <Button
                        onClick={cancelAddTriggerFunc}
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.cancelTriggerButton
                            : styles.cancelTriggerButton
                        }
                        id="trigger_cancel_btn"
                      >
                        {t("cancel")}
                      </Button>
                      <Button
                        onClick={() => addModifyTriggerFunc(ADD_OPTION)}
                        className={styles.addTriggerButton}
                        id="trigger_add_btn"
                      >
                        {t("add")} {t("trigger")}
                      </Button>
                    </div>
                  ) : selectedField.status === STATE_EDITED ? (
                    <div>
                      <Button
                        onClick={cancelEditTriggerFunc}
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.cancelTriggerButton
                            : styles.cancelTriggerButton
                        }
                        id="trigger_editing_cancel_btn"
                      >
                        {t("cancel")}
                      </Button>
                      <Button
                        onClick={() => addModifyTriggerFunc(EDIT_OPTION)}
                        className={styles.addTriggerButton}
                        id="trigger_edit_btn"
                      >
                        {t("save")} {t("changes")}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={deleteTriggerFunc}
                        className={
                          direction === RTL_DIRECTION
                            ? arabicStyles.cancelTriggerButton
                            : styles.cancelTriggerButton
                        }
                        id="trigger_delete_btn"
                      >
                        {t("delete")}
                      </Button>
                    </div>
                  )
                ) : null}
              </div>
              <TriggerMainFormView
                processType={props.openProcessType}
                nameInput={nameInput}
                setNameInput={setNameInput}
                typeInput={typeInput}
                setTypeInput={setTypeInput}
                descInput={descInput}
                setDescInput={setDescInput}
                triggerTypeOptionList={triggerTypeOptionList}
                selectedField={selectedField}
                setSelectedField={setSelectedField}
              />
              <p className={styles.definitionHeading}>
                {t("definition")}
                <Divider className={styles.definitionLine} />
              </p>
              {triggerTypeOptions(typeInput)[1]}
            </div>
          ) : triggerData && triggerData.length && hideLeftPanel > 0 ? (
            <NoTriggerScreen
              typeList={triggerTypeOptionList}
              setTypeInput={setTypeInput}
              setTriggerData={setTriggerData}
              setSelectedField={setSelectedField}
              processType={props.openProcessType}
              hideLeftPanel={hideLeftPanel}
            />
          ) : (
            <NoSelectedTriggerScreen />
          )}
        </React.Fragment>
      ) : (
        <NoTriggerScreen
          typeList={triggerTypeOptionList}
          setTypeInput={setTypeInput}
          setTriggerData={setTriggerData}
          setSelectedField={setSelectedField}
          processType={props.openProcessType}
        />
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setReload: (reload) =>
      dispatch(actionCreators.reload_trigger_fields(reload)),
    setInitialValues: (value) =>
      dispatch(actionCreators.set_trigger_fields(value)),
    setTriggerEdited: (value) =>
      dispatch(actionCreators.is_trigger_definition_edited(value)),
    setTypeTrigger: (list) =>
      dispatch(actionCreators.setTrigger_properties(list)),
    dataEntryTypeTrigger: (list) =>
      dispatch(actionCreators.dataEntryTrigger_properties(list)),
    executeTypeTrigger: (funcName, serverExecutable, argString) =>
      dispatch(
        actionCreators.execute_properties(funcName, serverExecutable, argString)
      ),
    launchApplicationTypeTrigger: ({ appName, argumentStrValue }) =>
      dispatch(
        actionCreators.launch_application_properties({
          appName,
          argumentStrValue,
        })
      ),
    exceptionTypeTrigger: ({
      exceptionId,
      exceptionName,
      attribute,
      comment,
    }) =>
      dispatch(
        actionCreators.exception_properties({
          exceptionId,
          exceptionName,
          attribute,
          comment,
        })
      ),
    generateResponseTypeTrigger: ({
      fileId,
      fileName,
      docTypeName,
      docTypeId,
    }) =>
      dispatch(
        actionCreators.generate_response_properties({
          fileId,
          fileName,
          docTypeName,
          docTypeId,
        })
      ),
    setTemplates: (list) => dispatch(actionCreators.setTemplates(list)),
    mailTypeTrigger: ({
      from,
      isFromConst,
      to,
      isToConst,
      cc,
      isCConst,
      bcc,
      isBccConst,
      priority,
      subjectValue,
      mailBodyValue,
    }) =>
      dispatch(
        actionCreators.mail_properties({
          from,
          isFromConst,
          to,
          isToConst,
          cc,
          isCConst,
          bcc,
          isBccConst,
          priority,
          subjectValue,
          mailBodyValue,
        })
      ),
    createChildWorkitemTypeTrigger: ({
      m_strAssociatedWS,
      type,
      generateSameParent,
      variableId,
      varFieldId,
      list,
    }) =>
      dispatch(
        actionCreators.createChildWorkitemTrigger_properties({
          m_strAssociatedWS,
          type,
          generateSameParent,
          variableId,
          varFieldId,
          list,
        })
      ),
  };
};

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessType: state.openProcessClick.selectedType,
    triggerEdited: state.triggerReducer.isTriggerEdited,
    MAIL: state.triggerReducer.Mail,
    SET: state.triggerReducer.Set,
    DATAENTRY: state.triggerReducer.DataEntry,
    EXECUTE: state.triggerReducer.Execute,
    LAUNCHAPPLICATION: state.triggerReducer.LaunchApp,
    EXCEPTION: state.triggerReducer.Exception,
    GENERATERESPONSE: state.triggerReducer.generateResponse,
    CREATE_CHILD_WORKITEM: state.triggerReducer.CreateChild,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TriggerDefinition);
