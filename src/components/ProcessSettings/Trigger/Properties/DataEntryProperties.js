// #BugID - 106096 (Trigger Bug)
// #BugDescription - Implemented Searching in Data Entry Type Trigger

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./properties.module.css";
import arabicStyles from "./propertiesArabicStyles.module.css";
import { connect } from "react-redux";
import * as actionCreators from "../../../../redux-store/actions/Trigger";
import DataTable from "../Properties/Components/DataTable";
import { store, useGlobalState } from "state-pool";
import SearchBox from "../../../../UI/Search Component/index";
import filter from "../../../../assets/Tiles/Filter.svg";
import {
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";

function DataEntryProperties(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedVariables = localLoadedProcessData?.Variable;
  const [variableList, setVariableList] = useState(loadedVariables);
  const [addedVariableList, setAddedVariableList] = useState([]);
  const [existingTrigger, setExistingTrigger] = useState(false);
  const [editView, setEditView] = useState(true);
  let [searchTerm, setSearchTerm] = useState("");
  let [removeSearchTerm, setRemoveSearchTerm] = useState("");

  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;

  useEffect(() => {
    props.setTriggerProperties([]);
  }, []);

  useEffect(() => {
    if (props.reload) {
      props.setTriggerProperties([]);
      setAddedVariableList([]);
      setVariableList(loadedVariables);
      setEditView(true);
      props.setReload(false);
    }
  }, [props.reload]);

  useEffect(() => {
    if (props.initialValues) {
      setAddedVariableList(props.DataEntry);
      setVariableList((prev) => {
        let prevData = [...prev];
        return prevData?.filter((data) => {
          if (props.DataEntry && !props.DataEntry.includes(data)) {
            return data;
          }
        });
      });
      setEditView(false);
      setExistingTrigger(true);
      props.setInitialValues(false);
    }
  }, [props.initialValues]);

  useEffect(() => {
    if (addedVariableList?.length > 0) {
      props.setTriggerProperties(addedVariableList);
    } else {
      props.setTriggerProperties([]);
    }
  }, [addedVariableList]);

  const addAllVariable = () => {
    if (existingTrigger) {
      props.setTriggerEdited(true);
    }
    setAddedVariableList((prev) => {
      let newData = [...prev];
      variableList.forEach((data) => {
        newData.push(data);
      });
      return newData;
    });
    setVariableList([]);
  };

  let filteredRows = variableList?.filter((row) => {
    if (searchTerm == "") {
      return row;
    } else if (
      row.VariableName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return row;
    }
  });

  let filteredRowsRemove = addedVariableList?.filter((row) => {
    if (removeSearchTerm == "") {
      return row;
    } else if (
      row.VariableName.toLowerCase().includes(removeSearchTerm.toLowerCase())
    ) {
      return row;
    }
  });

  console.log("LIST", variableList);
  const addOneVariable = (variable) => {
    if (existingTrigger) {
      props.setTriggerEdited(true);
    }
    setAddedVariableList((prev) => {
      return [...prev, variable];
    });
    setVariableList((prev) => {
      let prevData = [...prev];
      return prevData?.filter((data) => {
        if (data.VariableId !== variable.VariableId) {
          return data;
        }
      });
    });
  };

  const removeAllVariable = () => {
    if (existingTrigger) {
      props.setTriggerEdited(true);
    }
    setVariableList((prev) => {
      let newData = [...prev];
      addedVariableList.forEach((data) => {
        newData.push(data);
      });
      return newData;
    });
    setAddedVariableList([]);
  };

  const removeOneVariable = (variable) => {
    if (existingTrigger) {
      props.setTriggerEdited(true);
    }
    setVariableList((prev) => {
      return [...prev, variable];
    });
    setAddedVariableList((prevContent) => {
      let prevData = [...prevContent];
      return prevData?.filter((dataContent) => {
        if (dataContent.VariableId !== variable.VariableId) {
          return dataContent;
        }
      });
    });
  };

  return (
    <div className={styles.propertiesMainView}>
      <div
        className={
          direction === RTL_DIRECTION
            ? `${arabicStyles.triggerNameTypeDiv} flex1`
            : `${styles.triggerNameTypeDiv} flex1`
        }
      >
        <div className={`${styles.mb025} flex`}>
          <div className="flex flex2">
            <p
              className={
                direction === RTL_DIRECTION
                  ? editView
                    ? `${arabicStyles.dataEntryHeading} mr05 flex4`
                    : `${arabicStyles.dataEntryHeading} mr05 flex3`
                  : editView
                  ? `${styles.dataEntryHeading} mr05 flex4`
                  : `${styles.dataEntryHeading} mr05 flex3`
              }
            >
              {t("allowedDataEntryFields")}
            </p>
            <div className="flex2">
              <SearchBox
                width="100%"
                height="1.5rem"
                id="trigger_de_removeDivSearch"
                setSearchTerm={setRemoveSearchTerm}
              />
            </div>
            <button
              className={
                direction === RTL_DIRECTION
                  ? `${arabicStyles.filterTriggerButton} flex05`
                  : `${styles.filterTriggerButton} flex05`
              }
            >
              <img src={filter} alt="" />
            </button>
          </div>
          {!editView && (
            <div className="right flex1">
              {!readOnlyProcess ? (
                <button
                  className={styles.addVariablesBtn}
                  onClick={() => {
                    setEditView(true);
                    if (existingTrigger) {
                      props.setTriggerEdited(true);
                    }
                  }}
                  id="trigger_de_addVarBtn"
                >
                  {"+ "} {t("add")} {t("variables")}
                </button>
              ) : null}
            </div>
          )}
        </div>
        <DataTable
          tableType="remove"
          tableContent={
            removeSearchTerm == "" ? addedVariableList : filteredRowsRemove
          }
          // tableContent={addedVariableList}
          singleEntityClickFunc={removeOneVariable}
          headerEntityClickFunc={removeAllVariable}
          id="trigger_de_removeDiv"
        />
      </div>
      {editView && (
        <div className="flex1">
          <div className={`flex ${styles.dataEntrySelectDiv}`}>
            <p
              className={
                direction === RTL_DIRECTION
                  ? `${arabicStyles.dataEntryHeading} ${arabicStyles.mr05} flex4`
                  : `${styles.dataEntryHeading} ${styles.mr05} flex4`
              }
            >
              {t("selectDataEntryFields")}
            </p>
            <div className="flex2">
              <SearchBox
                width="100%"
                height="1.5rem"
                id="trigger_de_addDivSearch"
                setSearchTerm={setSearchTerm}
              />
            </div>
            <button
              className={
                direction === RTL_DIRECTION
                  ? `${arabicStyles.filterTriggerButton} flex05`
                  : `${styles.filterTriggerButton} flex05`
              }
            >
              <img src={filter} alt="" />
            </button>
          </div>
          <DataTable
            tableType="add"
            tableContent={searchTerm == "" ? variableList : filteredRows}
            singleEntityClickFunc={addOneVariable}
            headerEntityClickFunc={addAllVariable}
            id="trigger_de_addDiv"
          />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    initialValues: state.triggerReducer.setDefaultValues,
    DataEntry: state.triggerReducer.DataEntry,
    reload: state.triggerReducer.trigger_reload,
    openProcessType: state.openProcessClick.selectedType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setReload: (reload) =>
      dispatch(actionCreators.reload_trigger_fields(reload)),
    setTriggerProperties: (list) =>
      dispatch(actionCreators.dataEntryTrigger_properties(list)),
    setInitialValues: (value) =>
      dispatch(actionCreators.set_trigger_fields(value)),
    setTriggerEdited: (value) =>
      dispatch(actionCreators.is_trigger_definition_edited(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataEntryProperties);
