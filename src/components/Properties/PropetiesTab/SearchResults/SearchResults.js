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
import {
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants.js";
import arabicStyles from "./ArabicStyles.module.css";
import TabsHeading from "../../../../UI/TabsHeading";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

function SearchResults(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const dispatch = useDispatch();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [check, setCheck] = useState({});
  const [allVariable, setallVariable] = useState([]);
  const [searchVariable, setSearchVariable] = useState([]);
  const [execute, setExecute] = useState("0");
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut);

  function createData(VariableName, VariableId) {
    return { VariableName, VariableId };
  }

  useEffect(() => {
    let temp =
      localLoadedActivityPropertyData.ActivityProperty.searchInfo
        .searchResultList;
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

  const rows = allVariable.map((val) => {
    return createData(val.VariableName, val.VariableId);
  });

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
      tempData.ActivityProperty.searchInfo.searchResultList = temp;
      setlocalLoadedActivityPropertyData(tempData);
      return temp;
    });

    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.searchResults]: { isModified: true, hasError: false },
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
        [propertiesLabel.searchResults]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <React.Fragment>
      <TabsHeading heading={props?.heading} />
      <div className={styles.SearchVariable} style={{ direction: direction }}>
        <div style={{ width: "98%" }}>
          <p
            className={
              direction === RTL_DIRECTION ? arabicStyles.tittle : styles.tittle
            }
          >
            {t("searchResult")}
          </p>

          <table style={{ display: "block" }}>
            <thead style={{ background: "#F8F8F8", height: "40px" }}>
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
                              isDragDisabled={isReadOnly}
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
                                      {!isReadOnly && (
                                        <DragIndicatorOutlinedIcon
                                          style={{
                                            marginTop: "10px",
                                            height: "22px",
                                          }}
                                        />
                                      )}
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
                                        disabled={isReadOnly}
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
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
  };
};

export default connect(mapStateToProps, null)(SearchResults);
