import React, { useState, useEffect } from "react";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import Header from "./Header/Header";
import ViewingArea from "./ViewingArea";
import Tabs from "../../UI/Tab/Tab.js";
import "./ProcessView.css";
import { connect } from "react-redux";
import ProcessSettings from "../ProcessSettings";
import DocTypes from "./Tools/DocTypes/DocTypes";
import Exception from "./Tools/Exception/Exception.js";
import DataModel from "../DataModel";
import ToDo from "./Tools/ToDo/ToDo.js";
import TriggerDefinition from "../ProcessSettings/Trigger/TriggerDefinition";
import ServiceCatalog from "../ServiceCatalog";
import { store, useGlobalState } from "state-pool";
import {
  SERVER_URL,
  ENDPOINT_OPENTEMPLATE,
  ENDPOINT_OPENPROCESS,
} from "../../Constants/appConstants";
import axios from "axios";
import Requirements from "../ViewingArea/ProcessRequirements&Attchments/index.js";
import ViewsForms from "../ViewsForms/ViewsForms";

const ProcessView = (props) => {
  let { t } = useTranslation();
  const { openProcessID, openProcessName, openProcessType } = props;
  const arrProcessesData = store.getState("arrProcessesData");
  const loadedProcessData = store.getState("loadedProcessData");
  const openProcessesArr = store.getState("openProcessesArr");
  const variablesList = store.getState("variableDefinition");
  const [variableList, setLocalVariablesList] = useGlobalState(variablesList);
  const [caseEnabled, setCaseEnabled] = useState(false);
  const [spinner, setspinner] = useState(true);
  const [localArrProcessesData, setLocalArrProcessesData] =
    useGlobalState(arrProcessesData);
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [localOpenProcessesArr, setLocalOpenProcessesArr] =
    useGlobalState(openProcessesArr);
  const [processData, setProcessData] = useState({
    Connections: [],
    MileStones: [
      {
        iMileStoneId: 1,
        Activities: [
          {
            QueueCategory: "F",
            ActivityName: "Start Event_1",
            ActivityId: 1,
            Color: "1234",
            ActivityType: 1,
            ActivitySubType: 1,
            QueueId: -2,
            isActive: "true",
            FromRegistered: "N",
            EventFlag: "",
            xLeftLoc: "221",
            BlockId: 0,
            id: "",
            yTopLoc: "50",
            LaneId: 1,
            CheckedOut: "",
            QUEUERIGHTS: { MQU: "Y", D: "Y", V: "Y", MQA: "Y", MQP: "Y" },
            SequenceId: 1,
          },
        ],
        xLeftLoc: "",
        BackColor: "1234",
        Height: "",
        id: "",
        MileStoneName: "Milestone_1",
        isActive: "true",
        FromRegistered: "N",
        yTopLoc: "",
        Width: "370",
        SequenceId: 1,
      },
    ],
    Lanes: [
      {
        QueueCategory: "L",
        PoolId: "-1",
        BackColor: "1234",
        LaneName: "Swimlane_1",
        QueueId: "-1",
        FromRegistered: "N",
        xLeftLoc: "0",
        DefaultQueue: "N",
        Height: "140",
        IndexInPool: "-1",
        LaneId: 1,
        yTopLoc: "20",
        Width: "645",
        QUEUERIGHTS: {
          MQU: "Y",
          D: "Y",
          RIGHTBITS: "11111111111111111111",
          V: "Y",
          MQA: "Y",
          MQP: "Y",
        },
        CheckedOut: "",
      },
    ],
    Annotations: [],
    DataObjects: [],
    MSGAFS: [],
    GroupBoxes: [],
  });
  const [initialRender, setInitialRender] = useState(true);
  const [tableName, setTableName] = useState("");

  //fetch processData from openProcess API
  useEffect(() => {
    if (initialRender) {
      //check for existing process data before calling api
      if (localLoadedProcessData !== null) {
        setProcessData(localLoadedProcessData);
        setCaseEnabled(localLoadedProcessData.TaskRequired);
        setInitialRender(false);
        setspinner(false);
      } else {
        if (props.openTemplateFlag) {
          axios
            .get(
              SERVER_URL +
                ENDPOINT_OPENTEMPLATE +
                "/" +
                props.templateId +
                "/" +
                props.templateName
            )
            .then((res) => {
              if (res.data.Status === 0) {
                const newProcessData = res.data.OpenProcess;
                setTableName(newProcessData.TableName);
                setProcessData(newProcessData);
                setlocalLoadedProcessData(newProcessData);
                setCaseEnabled(newProcessData.TaskRequired);
                if (
                  localOpenProcessesArr.includes(
                    `${newProcessData.ProcessDefId}#${newProcessData.ProcessType}`
                  )
                )
                  setLocalArrProcessesData(localArrProcessesData);
                else {
                  setLocalArrProcessesData([
                    ...localArrProcessesData,
                    {
                      TemplateId: props.templateId,
                      TemplateName: props.templateName,
                      ProcessDefId: newProcessData.ProcessDefId,
                      ProcessType: newProcessData.ProcessType,
                      ProcessName: newProcessData.ProcessName,
                      ProjectName: newProcessData.ProjectName,
                      VersionNo: newProcessData.VersionNo,
                      ProcessVariantType: newProcessData.ProcessVariantType,
                    },
                  ]);
                  let temp = [...localOpenProcessesArr];
                  temp.push(
                    `${newProcessData.ProcessDefId}#${newProcessData.ProcessType}`
                  );
                  setLocalOpenProcessesArr(temp);
                }
                setspinner(false);
              } else {
                alert(res.data.Message);
              }
            })
            .catch((err) => console.log(err));
        } else {
          axios
            .get(
              SERVER_URL +
                ENDPOINT_OPENPROCESS +
                props.openProcessID +
                "/" +
                props.openProcessName +
                "/" +
                props.openProcessType
            )
            .then((res) => {
              if (res.data.Status === 0) {
                const newProcessData = res.data.OpenProcess;
                setTableName(newProcessData.TableName);
                setProcessData(newProcessData);
                setlocalLoadedProcessData(newProcessData);
                setCaseEnabled(newProcessData.TaskRequired);
                if (
                  localOpenProcessesArr.includes(
                    `${newProcessData.ProcessDefId}#${newProcessData.ProcessType}`
                  )
                )
                  setLocalArrProcessesData(localArrProcessesData);
                else {
                  setLocalArrProcessesData([
                    ...localArrProcessesData,
                    {
                      ProcessDefId: newProcessData.ProcessDefId,
                      ProcessType: newProcessData.ProcessType,
                      ProcessName: newProcessData.ProcessName,
                      ProjectName: newProcessData.ProjectName,
                      VersionNo: newProcessData.VersionNo,
                      ProcessVariantType: newProcessData.ProcessVariantType,
                    },
                  ]);
                  let temp = [...localOpenProcessesArr];
                  temp.push(
                    `${newProcessData.ProcessDefId}#${newProcessData.ProcessType}`
                  );
                  setLocalOpenProcessesArr(temp);
                }
                setspinner(false);
                setLocalVariablesList(newProcessData.Variable); // Updating VariableList
              } else {
                alert(res.data.Message);
              }
            })
            .catch((err) => {
              console.log(err);
              setspinner(false);
            });
        }
      }
    }
  }, [localLoadedProcessData]);

  // connections in localLoadedProcessData updated in properties section, and to reflect that on
  // screen processData needs to be updated
  useEffect(() => {
    if (localLoadedProcessData !== null) {
      setProcessData(localLoadedProcessData);
    }
  }, [localLoadedProcessData?.Connections]);

  useEffect(() => {
    let temp = JSON.parse(JSON.stringify(processData));
    temp.MileStones.map((mile) => {
      mile.Activities.map((act) => {
        if (+act.ActivityType === 18 && +act.ActivitySubType === 1) {
          if (
            act.AssociatedProcess == undefined ||
            act.AssociatedProcess.Associated_ProcessDefId == ""
          ) {
            act["callTypeACT"] = true;
          }
        }
      });
    });
    setProcessData(temp);
  }, []);

  useEffect(() => {
    setspinner(true);
    setInitialRender(true);
  }, [props.openProcessID]);

  return (
    <div className="tabViewingArea">
      <Header processData={processData} />
      <td style={{ direction: `${t("HTML_DIR")}` }}>
        <Tabs
          tabType="processSubTab"
          tabContentStyle="processSubTabContentStyle"
          tabBarStyle="processSubTabBarStyle"
          oneTabStyle="processSubOneTabStyle"
          tabStyling="processViewTabs"
          tabsStyle="processViewSubTabs"
          TabNames={[
            t("navigationPanel.processFlow"),
            t("navigationPanel.requirements"),
            t("navigationPanel.dataModel"),
            t("navigationPanel.forms"),
            t("navigationPanel.exceptions"),
            t("navigationPanel.docTypes"),
            t("navigationPanel.toDos"),
            t("triggers"),
            t("navigationPanel.serviceCatelog"),
            t("navigationPanel.settings"),
            t("navigationPanel.helpSection"),
          ]}
          TabElement={[
            <div className={cx("pmviewingArea")} style={{ marginTop: "0" }}>
              <ViewingArea
                processType={openProcessType}
                displayMessage={props.setDisplayMessage}
                processData={processData}
                setProcessData={setProcessData}
                caseEnabled={caseEnabled}
                initialRender={initialRender}
                spinner={spinner}
              />
            </div>,
            <div
              style={{
                position: "absolute",
                top: "13%",
                height: "90%",
                width: "100%",
                color: "black",
                fontStyle: "italic",
              }}
            >
              <Requirements />
            </div>,
            <DataModel
              localLoadedProcessData={localLoadedProcessData}
              openProcessID={openProcessID}
              openProcessType={openProcessType}
              tableName={tableName}
            />,
            <ViewsForms />,
            <Exception />,
            <DocTypes processType={openProcessType} />,
            <ToDo />,
            <TriggerDefinition spinner={spinner} />,
            <ServiceCatalog />,
            <div>
              <ProcessSettings
                openProcessID={openProcessID}
                openProcessName={openProcessName}
                openProcessType={openProcessType}
              />
            </div>,
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "35%",
                color: "black",
                fontStyle: "italic",
              }}
            >
              <p style={{ color: "black" }}>
                Help Section Section to be painted here.
              </p>
            </div>,
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "35%",
                color: "black",
                fontStyle: "italic",
              }}
            >
              <p style={{ color: "black" }}>
                Validation Log Section to be painted here.
              </p>
            </div>,
          ]}
        />
      </td>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    templateId: state.openTemplateReducer.templateId,
    templateName: state.openTemplateReducer.templateName,
    openTemplateFlag: state.openTemplateReducer.openFlag,
  };
};

export default connect(mapStateToProps)(ProcessView);
