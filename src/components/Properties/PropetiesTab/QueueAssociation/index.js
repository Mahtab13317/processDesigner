import React, { useState, useEffect } from "react";
import Tabs from "../../../../UI/Tab/Tab.js";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import "./index.css";
import GroupsTab from "./groupsTab.js";
import { useGlobalState } from "state-pool";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  SERVER_URL,
  ENDPOINT_QUEUEASSOCIATION_GROUPLIST,
  ENDPOINT_QUEUELIST,
  ENDPOINT_QUEUEASSOCIATION_MODIFY,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants.js";

function QueueAssociation(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [addedVariableList, setAddedVariableList] = useState([]);
  const [loadedVariables] = useGlobalState("variableDefinition");
  const [variableList, setVariableList] = useState(null);
  const [queueName, setQueueName] = useState("");
  const [queueDesc, setQueueDesc] = useState("");

  const associateQueueHandler = () => {
    props.setShowQueueModal(false);
    props.queueType == 0 ? props.setQueueType(1) : props.setQueueType(0);
    axios
      .post(SERVER_URL + ENDPOINT_QUEUEASSOCIATION_MODIFY, {
        processDefId: "11920",
        processState: "L",
        queueName: queueName,
        QueueDesc: queueDesc,
        queueId: "-4",
        queueType: "M",
        allowReassignment: "N",
        orderBy: "2",
        refreshInterval: "0",
        sortOrder: "A",
        ugMap: {
          // 1: {
          //   uGId: "1",
          //   uGName: "Everyone",
          //   associationType: "1",
          //   queryFilter: "asdasd",
          //   queryPreview: "N",
          //   status: "I",
          //   workitemEditable: "N",
          // },
        },
      })
      .then((res) => {
        if (res.data.Status === 0) {
          alert("Queue Added Successfully!");
        }
      });
  };
  const addAllVariable = () => {
    setAddedVariableList((prev) => {
      let newData = [...prev];
      variableList.forEach((data) => {
        newData.push(data);
      });
      return newData;
    });
    setVariableList([]);
  };

  const addOneVariable = (variable) => {
    // if (existingTrigger) {
    //   props.setTriggerEdited(true);
    // }
    setAddedVariableList((prev) => {
      return [...prev, variable];
    });
    setVariableList((prev) => {
      let prevData = [...prev];
      return prevData.filter((data) => {
        if (data.ID !== variable.ID) {
          return data;
        }
      });
    });
  };

  const removeAllVariable = () => {
    // if (existingTrigger) {
    //   props.setTriggerEdited(true);
    // }
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
    // if (existingTrigger) {
    //   props.setTriggerEdited(true);
    // }
    setVariableList((prev) => {
      return [...prev, variable];
    });
    setAddedVariableList((prevContent) => {
      let prevData = [...prevContent];
      return prevData.filter((dataContent) => {
        if (dataContent.ID !== variable.ID) {
          return dataContent;
        }
      });
    });
  };

  useEffect(() => {
    axios
      .post(SERVER_URL + ENDPOINT_QUEUEASSOCIATION_GROUPLIST, {})
      .then((res) => {
        if (res.data.Status === 0) {
          setVariableList(res.data.GroupInfo);
        }
      });
  }, []);

  useEffect(() => {
    axios
      .post(SERVER_URL + ENDPOINT_QUEUELIST, {
        processDefId: "11920",
        processState: "L",
        queueId: "-4",
      })
      .then((res) => {
        console.log("RESPONSE", res.data);
        setQueueName(res.data.Queue[0].QueueName);
        setQueueDesc(res.data.Queue[0].QueueDescription);
      });
  }, []);

  const editQueueNameHandler = (e) => {
    setQueueName(e.target.value);
  };

  const editQueueDescHandler = (e) => {
    setQueueDesc(e.target.value);
  };

  return (
    <div>
      <p style={{ fontSize: "16px", fontWeight: "600", padding: "12px" }}>
        {props.queueType == 0 ? "Swimlane Queue" : "Workstep Queue"}
      </p>
      <hr style={{ height: "1px", color: "grey" }}></hr>
      <Tabs
        tabType="processSubTab"
        tabContentStyle="processSubTabContentStyle"
        tabBarStyle="processSubTabBarStyle"
        oneTabStyle="processSubOneTabStyle"
        tabStyling="processViewTabs"
        TabNames={["General", "Groups"]}
        TabElement={[
          <div
            style={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding:
                  direction == RTL_DIRECTION
                    ? "10px 10px 10px 50px"
                    : "10px 50px 10px 10px",
                marginTop: "10px",
              }}
            >
              <p style={{ fontSize: "12px", color: "#606060" }}>Queue Name</p>
              <input
                value={queueName}
                style={{
                  width: "400px",
                  height: "24px",
                  border: "1px solid #DADADA",
                  borderRadius: "2px",
                  opacity: "1",
                  padding: "0px 3px",
                }}
                onChange={(e) => editQueueNameHandler(e)}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
                padding:
                  direction == RTL_DIRECTION
                    ? "10px 10px 10px 50px"
                    : "10px 50px 10px 10px",
              }}
            >
              <p style={{ fontSize: "12px", color: "#606060" }}>Description</p>
              <textarea
                onChange={(e) => editQueueDescHandler(e)}
                value={queueDesc}
                style={{
                  width: "400px",
                  height: "87px",
                  border: "1px solid #DADADA",
                  borderRadius: "2px",
                  opacity: "1",
                  padding: "2px 3px",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
                alignItems: "center",
                padding:
                  direction == RTL_DIRECTION
                    ? "10px 10px 10px 50px"
                    : "10px 50px 10px 10px",
              }}
            >
              <p style={{ fontSize: "12px", color: "#606060" }}>Queue Type</p>
              <FormControl style={{ marginRight: "265px" }}>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  defaultValue="fifo"
                >
                  <FormControlLabel
                    value="fifo"
                    control={<Radio size="small" />}
                    label={<p style={{ fontSize: "12px" }}>FIFO</p>}
                  />
                  <FormControlLabel
                    value="wip"
                    control={<Radio size="small" />}
                    label={<p style={{ fontSize: "12px" }}>WIP</p>}
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div className="buttons_add buttonsAddToDo_Queue">
              <Button
                variant="outlined"
                onClick={() => props.setShowQueueModal(false)}
                id="close_AddTodoModal_Button"
              >
                Cancel
              </Button>
              <Button
                id="addAnotherTodo_Button"
                variant="contained"
                color="primary"
                onClick={associateQueueHandler}
              >
                Associate
              </Button>
            </div>
          </div>,
          <div
            style={{
              backgroundColor: "white",
              padding: "10px 10px 0px 10px",
            }}
          >
            <p style={{ color: "black", display: "flex" }}>
              <GroupsTab
                tableType="add"
                id="trigger_de_addDiv"
                tableContent={variableList}
                singleEntityClickFunc={addOneVariable}
                headerEntityClickFunc={addAllVariable}
                selectedGroupLength={
                  addedVariableList ? addedVariableList.length : 0
                }
              />
              <GroupsTab
                tableType="remove"
                tableContent={addedVariableList}
                singleEntityClickFunc={removeOneVariable}
                headerEntityClickFunc={removeAllVariable}
                id="trigger_de_removeDiv"
              />
            </p>
            <div className="buttons_add buttonsAddToDo_Queue_Groups">
              <Button
                variant="outlined"
                onClick={() => props.setShowQueueModal(false)}
                id="close_AddTodoModal_Button"
              >
                Cancel
              </Button>
              <Button
                id="addAnotherTodo_Button"
                variant="contained"
                color="primary"
                onClick={associateQueueHandler}
              >
                Associate
              </Button>
            </div>
          </div>,
        ]}
      />
    </div>
  );
}

export default QueueAssociation;
