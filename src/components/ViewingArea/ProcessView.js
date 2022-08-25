import React, { useState, useEffect } from "react";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import Header from "./Header/Header";
import ViewingArea from "./ViewingArea";
import Tabs from "../../UI/Tab/Tab.js";
import "./ProcessView.css";
import { connect, useSelector } from "react-redux";
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
  userRightsMenuNames,
} from "../../Constants/appConstants";
import axios from "axios";
import Requirements from "../ViewingArea/ProcessRequirements&Attchments/index.js";
import ViewsForms from "../ViewsForms/ViewsForms";
import { UserRightsValue } from "../../redux-store/slices/UserRightsSlice";
import { getMenuNameFlag } from "../../utility/UserRightsFunctions";

const ProcessView = (props) => {
  let { t } = useTranslation();
  const userRightsValue = useSelector(UserRightsValue);
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
  const [tabsArray, setTabsArray] = useState([]);
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

  // Boolean that decides whether todos tab will be shown or not.
  const toDosFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.todoList
  );

  // Boolean that decides whether doc types tab will be shown or not.
  const docTypesFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.documents
  );

  // Boolean that decides whether service catalog tab will be shown or not.
  const catalogDefinitionFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.catalogDefinition
  );

  // Boolean that decides whether exception tab will be shown or not.
  const exceptionFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.exception
  );

  // Boolean that decides whether trigger tab will be shown or not.
  const triggerFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.trigger
  );

  // Boolean that decides whether form tab will be shown or not.
  const formsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.manageForm
  );

  const arr = [
    {
      label: t("navigationPanel.requirements"),
      component: (
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
        </div>
      ),
    },
    {
      label: t("navigationPanel.dataModel"),
      component: (
        <DataModel
          localLoadedProcessData={localLoadedProcessData}
          openProcessID={openProcessID}
          openProcessType={openProcessType}
          tableName={tableName}
        />
      ),
    },
    {
      label: t("navigationPanel.forms"),
      component: <ViewsForms />,
    },
    {
      label: t("navigationPanel.exceptions"),
      component: <Exception />,
    },
    {
      label: t("navigationPanel.docTypes"),
      component: <DocTypes processType={openProcessType} />,
    },
    {
      label: t("navigationPanel.toDos"),
      component: <ToDo />,
    },
    {
      label: t("triggers"),
      component: <TriggerDefinition spinner={spinner} />,
    },
    {
      label: t("navigationPanel.serviceCatelog"),
      component: <ServiceCatalog />,
    },
    {
      label: t("navigationPanel.settings"),
      component: (
        <div>
          <ProcessSettings
            openProcessID={openProcessID}
            openProcessName={openProcessName}
            openProcessType={openProcessType}
          />
        </div>
      ),
    },
    {
      label: t("navigationPanel.helpSection"),
      component: (
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
        </div>
      ),
    },
  ];

  useEffect(() => {
    let tempArr = [...arr];
    if (!toDosFlag) {
      let toDosIndex;
      tempArr.forEach((element, index) => {
        if (element.label === t("navigationPanel.toDos")) {
          toDosIndex = index;
        }
      });
      tempArr.splice(toDosIndex, 1);
    }
    if (!docTypesFlag) {
      let docTypeIndex;
      tempArr.forEach((element, index) => {
        if (element.label === t("navigationPanel.docTypes")) {
          docTypeIndex = index;
        }
      });
      tempArr.splice(docTypeIndex, 1);
    }
    if (!catalogDefinitionFlag) {
      let catalogDefinitionIndex;
      tempArr.forEach((element, index) => {
        if (element.label === t("navigationPanel.serviceCatelog")) {
          catalogDefinitionIndex = index;
        }
      });
      tempArr.splice(catalogDefinitionIndex, 1);
    }
    if (!exceptionFlag) {
      let exceptionIndex;
      tempArr.forEach((element, index) => {
        if (element.label === t("navigationPanel.exceptions")) {
          exceptionIndex = index;
        }
      });
      tempArr.splice(exceptionIndex, 1);
    }
    if (!triggerFlag) {
      let triggerIndex;
      tempArr.forEach((element, index) => {
        if (element.label === t("triggers")) {
          triggerIndex = index;
        }
      });
      tempArr.splice(triggerIndex, 1);
    }
    if (!formsFlag) {
      let formIndex;
      tempArr.forEach((element, index) => {
        if (element.label === t("navigationPanel.forms")) {
          formIndex = index;
        }
      });
      tempArr.splice(formIndex, 1);
    }
    setTabsArray(tempArr);
  }, []);

  // Function that gives elements based on type
  const getElementAccToType = (array, type) => {
    let tempArr = [];
    array.forEach((element) => {
      if (type === "tabs") {
        tempArr.push(element.label);
      } else if (type === "components") {
        tempArr.push(element.component);
      }
    });
    return tempArr;
  };

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
                ) {
                  setspinner(false);
                  setLocalArrProcessesData(localArrProcessesData);
                } else {
                  setspinner(false);
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
    setInitialRender(true);
  }, [props.openProcessID]);

  return (
    <div className="tabViewingArea">
      {/*code edited on 26 July 2022 for BugId 110024*/}
      <Header processData={processData} setProcessData={setProcessData}/>
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
            ...getElementAccToType(tabsArray, "tabs"),
          ]}
          TabElement={[
            <div
              className={cx("pmviewingArea")}
              style={{ marginTop: "0", height: "81vh" }}
            >
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
            ...getElementAccToType(tabsArray, "components"),
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
