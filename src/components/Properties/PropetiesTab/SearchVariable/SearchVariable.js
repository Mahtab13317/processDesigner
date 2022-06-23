import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";
import * as actionCreators from "../../../../redux-store/actions/selectedCellActions";
import { connect } from "react-redux";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setSave,
  ActivityPropertySaveCancelValue,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import TextInput from "../../../../UI/Components_With_ErrrorHandling/InputField/index.js";
import { Checkbox } from "@material-ui/core";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import arabicStyles from "./ArabicStyles.module.css";
import { RTL_DIRECTION } from "../../../../Constants/appConstants.js";

function SearchVariable(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcess] = useGlobalState("variableDefinition");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [check, setCheck] = useState({});
  const [query, setQuery] = useState("");
  const [allVariable, setallVariable] = useState([]);
  const dispatch = useDispatch();

  function createData(VariableName, VariableId) {
    return { VariableName, VariableId };
  }

  const [searchVariable, setSearchVariable] = useState([]);
  const [execute, setExecute] = useState("0");
  const [showDragIcon, setShowDragIcon] = useState(false);

  useEffect(() => {
    let temp =
      localLoadedActivityPropertyData.ActivityProperty.searchInfo.searchVarList;
    let newArr = [];
    localLoadedProcessData.Variable.map((el) => {
      return temp.map((val) => {
        if (val.varName == el.VariableName) {
          let obj = {
            varName: el.VariableName,
            variableId: el.VariableId,
          };
          newArr.push(obj);
        }
      });
    });
    setSearchVariable(newArr);
    setExecute("1");
  }, []);

  useEffect(() => {
    let variable = localLoadedProcessData.Variable;
    let tempVariable = [];
    searchVariable.map((el) => {
      tempVariable.push(el.varName);
    });

    let temp = [];
    let tempChecked = [];
    let tempUnchecked = [];
    variable.map((val) => {
      if (val.VariableScope == "U" || val.VariableScope == "I") {
        if (tempVariable.includes(val.VariableName)) {
          tempChecked.push(val);
        } else {
          tempUnchecked.push(val);
        }
      }
    });
    temp = [...tempChecked, ...tempUnchecked];
    setallVariable(temp);

    let tempCheck = {};
    temp.forEach((el) => {
      if (tempVariable.includes(el.VariableName)) {
        tempCheck = { ...tempCheck, [el.VariableName]: true };
      } else {
        tempCheck = { ...tempCheck, [el.VariableName]: false };
      }
    });
    setCheck(tempCheck);
  }, [execute == "1"]);

  useEffect(() => {
    let filter =
      localLoadedActivityPropertyData.ActivityProperty.searchInfo
        .m_strFilterString;
    setQuery(filter);
  }, []);

  const rows = allVariable.map((val) => {
    return createData(val.VariableName, val.VariableId);
  });

  const queryHandler = (e) => {
    setQuery(e.target.value);
    dispatch(
      setActivityPropertyChange({
        SearchVariable: { isModified: true, hasError: false },
      })
    );
    let temp = localLoadedActivityPropertyData;
    temp.ActivityProperty.searchInfo.m_strFilterString = e.target.value;
    setlocalLoadedActivityPropertyData(temp);
  };

  const checkboxHandler = (VariableName, e) => {
    setCheck((prev) => {
      let temp = { ...prev };
      temp[VariableName] = e.target.checked;
      return temp;
    });

    let varId;
    setSearchVariable((prev) => {
      let temp = [...prev];
      if (e.target.checked) {
        allVariable.forEach((el) => {
          if (el.VariableName == VariableName) {
            varId = el.VariableId;
          }
        });
        temp.push({
          varName: VariableName,
          variableId: varId,
        });
      } else {
        let indexVal;
        temp.forEach((el, index) => {
          if (el.VariableName == VariableName) {
            indexVal = index;
          }
        });
        temp.splice(indexVal, 1);
      }
      let tempData = localLoadedActivityPropertyData;
      tempData.ActivityProperty.searchInfo.searchVarList = temp;
      setlocalLoadedActivityPropertyData(tempData);
      return temp;
    });

    dispatch(
      setActivityPropertyChange({
        SearchVariable: { isModified: true, hasError: false },
      })
    );
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;
    let temp = [...allVariable];
    const [reOrderedPickListItem] = temp.splice(source.index, 1);
    temp.splice(destination.index, 0, reOrderedPickListItem);
    setallVariable(temp);

    dispatch(
      setActivityPropertyChange({
        SearchVariable: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <React.Fragment>
      <div className={styles.SearchVariable} style={{ direction: direction }}>
        <div style={{ width: "50%" }}>
          <p
            className={
              direction === RTL_DIRECTION ? arabicStyles.tittle : styles.tittle
            }
          >
            {t("searchVariable")}
          </p>

          <table style={{ display: "block" }}>
            <thead>
              <tr style={{ background: "#F8F8F8", height: "40px" }}>
                <th
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.variableName
                      : styles.variableName
                  }
                >
                  {t("variableName")}
                </th>
                <th
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.searchRights
                      : styles.searchRights
                  }
                >
                  {t("searchRights")}
                </th>
              </tr>
            </thead>

            <DragDropContext onDragEnd={onDragEnd}>
              <tbody style={{ display: "table" }}>
                <Droppable droppableId="pickListInputs">
                  {(provided) => (
                    <div
                      className="inputs"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {rows &&
                        rows.map((row, index) => {
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
                                  <tr
                                    style={{
                                      height: "30px",
                                      padding: "12px",
                                      background: index % 2 ? "#f8f8f8" : null,
                                    }}
                                  >
                                    <div {...provided.dragHandleProps}>
                                      <DragIndicatorOutlinedIcon
                                        style={{
                                          marginTop: "10px",
                                          height: "22px",
                                        }}
                                      />
                                    </div>
                                    <td
                                      className={
                                        direction === RTL_DIRECTION
                                          ? arabicStyles.variableName
                                          : styles.variableName
                                      }
                                    >
                                      {row.VariableName}
                                    </td>

                                    <td
                                      className={
                                        direction === RTL_DIRECTION
                                          ? arabicStyles.searchRights
                                          : styles.searchRights
                                      }
                                    >
                                      <Checkbox
                                        checked={check[row.VariableName]}
                                        onChange={(e) =>
                                          checkboxHandler(row.VariableName, e)
                                        }
                                        style={{
                                          height: "14px",
                                          width: "14px",
                                        }}
                                      />
                                    </td>
                                  </tr>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </tbody>
            </DragDropContext>
          </table>
        </div>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.querryPannel
              : styles.querryPannel
          }
        >
          <p
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.tittleFilter
                : styles.tittleFilter
            }
          >
            {t("setFilter")}
          </p>
          <p
            className={
              direction === RTL_DIRECTION ? arabicStyles.query : styles.query
            }
          >
            {t("typeQuery")}
          </p>
          <textarea
            value={query}
            onChange={queryHandler}
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.textBox
                : styles.textBox
            }
          />
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

export default connect(mapStateToProps, null)(SearchVariable);
