import React, { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import SetFilterConditionStrip from "./setFilterConditionStrip";
import "./index.css";
import Button from "@material-ui/core/Button";
import { ADD_SYMBOL } from "../../../../Constants/appConstants";

function FilterScreen(props) {
  const [filterType, setFilterType] = useState("SF");
  const [showSecond, setShowSecond] = useState(null);
  const handleChange = (event) => {
    setFilterType(event.target.value);
  };
  // -------------------------------
  const [selectedStream, setSelectedStream] = useState(0);
  const [streamsData, setStreamData] = useState([
    {
      RuleConditions: [
        {
          ConditionOrderId: "1",
          Param1: "ALWAYS",
          Type1: "S",
          ExtObjID1: "0",
          VariableId_1: "0",
          VarFieldId_1: "0",
          Param2: "ALWAYS",
          Type2: "S",
          ExtObjID2: "0",
          VariableId_2: "0",
          VarFieldId_2: "0",
          Operator: "4",
          LogicalOp: "3",
        },
      ],
      RuleId: "2",
      RuleType: "S",
      RuleName: "s1",
      RuleOrderId: "1",
    },
    {
      RuleConditions: [
        {
          ConditionOrderId: "1",
          Param1: "InstrumentStatus",
          Type1: "S",
          ExtObjID1: "0",
          VariableId_1: "37",
          VarFieldId_1: "0",
          Param2: "ActivityName",
          Type2: "M",
          ExtObjID2: "0",
          VariableId_2: "49",
          VarFieldId_2: "0",
          Operator: "3",
          LogicalOp: "1",
        },
        {
          ConditionOrderId: "2",
          Param1: "ValidTillDateTime",
          Type1: "S",
          ExtObjID1: "0",
          VariableId_1: "30",
          VarFieldId_1: "0",
          Param2: "2022-02-10 00:00:00",
          Type2: "C",
          ExtObjID2: "0",
          VariableId_2: "0",
          VarFieldId_2: "0",
          Operator: "5",
          LogicalOp: "3",
        },
      ],

      RuleId: "3",
      RuleType: "S",
      RuleName: "s2",
      RuleOrderId: "2",
    },
    {
      RuleConditions: [
        {
          ConditionOrderId: "1",
          Param1: "LOCALE",
          Type1: "M",
          ExtObjID1: "0",
          VariableId_1: "10027",
          VarFieldId_1: "0",
          Param2: "q2",
          Type2: "U",
          ExtObjID2: "0",
          VariableId_2: "19",
          VarFieldId_2: "0",
          Operator: "3",
          LogicalOp: "1",
        },
        {
          ConditionOrderId: "2",
          Param1: "DBExErrCode",
          Type1: "M",
          ExtObjID1: "0",
          VariableId_1: "10025",
          VarFieldId_1: "0",
          Param2: "12",
          Type2: "C",
          ExtObjID2: "0",
          VariableId_2: "0",
          VarFieldId_2: "0",
          Operator: "1",
          LogicalOp: "3",
        },
      ],

      RuleId: "4",
      RuleType: "S",
      RuleName: "s3",
      RuleOrderId: "3",
    },
    {
      RuleConditions: [
        {
          ConditionOrderId: "1",
          Param1: "ALWAYS",
          Type1: "S",
          ExtObjID1: "0",
          VariableId_1: "0",
          VarFieldId_1: "0",
          Param2: "ALWAYS",
          Type2: "S",
          ExtObjID2: "0",
          VariableId_2: "0",
          VarFieldId_2: "0",
          Operator: "4",
          LogicalOp: "3",
        },
      ],

      RuleOperations: "",
      RuleId: "1",
      RuleType: "S",
      RuleName: "Default",
      RuleOrderId: "4",
      RuleDesc: "desc",
    },
  ]);

  const blankObjectCondition = {
    Param1: "",
    Type1: "M",
    ExtObjID1: "0",
    VariableId_1: "0",
    VarFieldId_1: "0",
    Param2: "",
    Type2: "M",
    ExtObjID2: "0",
    VariableId_2: "0",
    VarFieldId_2: "0",
    Operator: "",
    LogicalOp: "3",
  };

  const newRow = (value, index) => {
    if (value == ADD_SYMBOL) {
      let maxId = 0;
      streamsData[index].RuleConditions.forEach((element) => {
        if (element.ConditionOrderId > maxId) {
          maxId = element.ConditionOrderId;
        }
      });
      let ConOrderID = { ConditionOrderId: +maxId + 1 + "" };
      let newRow = { ...ConOrderID, ...blankObjectCondition };

      streamsData[index].RuleConditions.push(newRow);
      setStreamData([...streamsData]);
    }
  };

  const testing = () => {
    return streamsData.map((el, parentIndex) => {
      return (
        <div>
          {el.RuleConditions.map((val, index) => {
            return (
              <SetFilterConditionStrip
                localData={val}
                index={index}
                streamsData={streamsData}
                setStreamData={setStreamData}
                parentIndex={parentIndex}
                newRow={newRow}
                showDelIcon={
                  streamsData[selectedStream].RuleConditions.length > 1
                }
                // disabled={disable}
              />
            );
          })}
          <hr />
        </div>
      );
    });
  };

  const handleAddCondition = () => {
    let temp = [...streamsData];
    let maxId = 0;
    temp.forEach((el) => {
      if (maxId > +el.RuleId) {
        maxId = +el.RuleId;
      }
    });
    temp.push({
      RuleConditions: [blankObjectCondition],
      RuleId: maxId + 1,
    });
    setStreamData(temp);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px",
          borderBottom: "1px solid #DADADA",
        }}
      >
        <p style={{ fontSize: "16px", fontWeight: "700" }}>Add Filters</p>
        <CloseIcon
          style={{ height: "16px", width: "16px", cursor: "pointer" }}
          onClick={() => props.setShowFilterScreen(false)}
        />
      </div>
      {/* <FormControl component="fieldset" style={{ padding: "10px" }}>
        <RadioGroup
          defaultValue="SF"
          onChange={handleChange}
          row={true}
          name="row-radio-buttons-group"
        >
          <FormControlLabel value="SF" control={<Radio />} label="Set Filter" />
          <div>
            <FormControlLabel
              value="WQ"
              control={<Radio />}
              label="Write Query"
            />
          </div>
        </RadioGroup>
      </FormControl> */}
      {/* {filterType == "SF" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0px 10px",
            height: "30vh",
            overflow: "scroll",
          }}
        >
          {testing()}
          <Button
            variant="outlined"
            onClick={() => handleAddCondition()}
            style={{
              marginTop: "15px",
              border: "2px solid #0472C6",
              color: "#0472C6",
              width: "140px",
              padding: "5px 10px",
              height: "29px",
              textTransform: "none",
              cursor: "pointer",
            }}
          >
            + Add Condition
          </Button>
        </div> */}
      {/* // ) : ( */}
      <div style={{ paddingLeft: "10px" }}>
        <div
          style={{
            width: "475px",
            height: "36px",
            backgroundColor: "#F0F0F0",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <p style={{ color: "#000000", fontSize: "12px" }}>Type your Query</p>
          <textarea
            style={{
              width: "474px",
              height: "180px",
              border: "1px solid #C4C4C4",
              margin: "22px 0px 0px -10px",
              padding: "10px",
            }}
          />
        </div>
      </div>
      {/* // )} */}
      <div className="buttons_add buttonsAddToDo_FilterScreen">
        <Button
          variant="outlined"
          onClick={() => props.setShowFilterScreen(false)}
          id="close_AddTodoModal_Button"
        >
          Cancel
        </Button>
        <Button
          id="addAnotherTodo_Button"
          variant="contained"
          color="primary"
          onClick={() => props.setShowFilterScreen(false)}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default FilterScreen;
