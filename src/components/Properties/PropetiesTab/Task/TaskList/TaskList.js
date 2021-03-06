import { Checkbox } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import SearchComponent from "../../../../../UI/Search Component/index.js";
import "./TaskList.css";
import Button from "@material-ui/core/Button";
import { store, useGlobalState } from "state-pool";
import { useDispatch, useSelector } from "react-redux";
import { setActivityPropertyChange } from "../../../../../redux-store/slices/ActivityPropertyChangeSlice.js";
import { OpenProcessSliceValue, setOpenProcess } from "../../../../../redux-store/slices/OpenProcessSlice.js";

function TaskList(props) {
  const [json, setJson] = useState([]);
  const [SelectAllChecked, setSelectAllChecked] = useState(false);
  const openProcessData = useSelector(OpenProcessSliceValue);
  const localLoadedProcessData = JSON.parse(
    JSON.stringify(openProcessData.loadedData)
  );
  let dispatch = useDispatch();

  useEffect(() => {
    let temp = JSON.parse(JSON.stringify(json));
    if (SelectAllChecked === true) {
      temp.forEach((el) => {
        el.isAssociated = true;
      });
      setJson(temp);
    }
  }, [SelectAllChecked]);

  useEffect(() => {
    let temp = JSON.parse(JSON.stringify(localLoadedProcessData.Tasks));
    setJson(temp);
  }, [localLoadedProcessData.Tasks]);

  const handleCheckChange = (task) => {
    let count = 0;
    let temp = JSON.parse(JSON.stringify(json));
    temp.forEach((el) => {
      if (el.TaskId === task.TaskId) {
        el.isAssociated = !el.isAssociated;
      }
      if (el.isAssociated === true) {
        count++;
      }
    });
    if (count === temp.length) {
      setSelectAllChecked(true);
    } else setSelectAllChecked(false);

    setJson(temp);
    let temp2 = JSON.parse(JSON.stringify(localLoadedProcessData));
    temp2.Tasks = temp;
    dispatch(
      setOpenProcess({ loadedData: temp2 })
    );
    dispatch(
      setActivityPropertyChange({
        Task: { isModified: true, hasError: false },
      })
    );
  };

  const addAssociatedTasks = () => {
    let tempArr = [];
    json.forEach((task) => {
      if (task.isAssociated === true) {
        tempArr.push(task);
      }
    });
    props.selectedTaskToAssoc(tempArr);
    props.closeModal();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <SearchComponent
        style={{ width: "60%", height: "20px", margin: "10px 10px 5px 10px" }}
      />

      {/* -------------------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",

          padding: "10px",
        }}
      >
        <Checkbox
          onChange={() => setSelectAllChecked((prev) => !prev)}
          checked={SelectAllChecked}
          style={{
            borderRadius: "1px",
            height: "11px",
            width: "11px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "11px", color: "black", marginLeft: "15px" }}>
            Select All
          </p>
        </div>
      </div>
      {/* ------------------------- */}
      <div style={{ width: "100%", height: "90%" }}>
        {json &&
          json.map((variable) => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  //borderBottom: "1px solid #D6D6D6",
                  padding: "5px 10px 5px 10px",
                  height: "2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    onChange={() => handleCheckChange(variable)}
                    checked={variable.isAssociated === true ? true : false}
                    style={{
                      borderRadius: "1px",
                      height: "11px",
                      width: "11px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "15px",
                    }}
                  >
                    <p style={{ fontSize: "11px", color: "black" }}>
                      {variable.TaskName}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "right",
          padding: "5px 10px 5px 10px",
          justifyContent: "end",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => props.closeModal(false)}
          id="close_AddVariableModal_CallActivity"
        >
          Cancel
        </Button>
        <Button
          id="add_AddVariableModal_CallActivity"
          onClick={() => addAssociatedTasks()}
          variant="contained"
          color="primary"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default TaskList;
