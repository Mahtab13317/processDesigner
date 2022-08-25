import React from "react";
import BasicDetailsIcon from "../../../src/assets/abstractView/Icons/BasicDetails.svg";
import BasicDetailsIcon_EN from "../../../src/assets/abstractView/Icons/BasicDetails_Enabled.svg";
import DataFieldsIcon from "../../../src/assets/abstractView/Icons/DataField.svg";
import DataFieldsIcon_EN from "../../../src/assets/abstractView/Icons/DataField_Enabled.svg";
import AttachmentsIcon from "../../../src/assets/abstractView/Icons/Attachment.svg";
import AttachmentsIcon_EN from "../../../src/assets/abstractView/Icons/Attachment_Enabled.svg";
import InitialRulesIcon from "../../../src/assets/abstractView/Icons/InitialRules.svg";
import InitialRulesIcon_EN from "../../../src/assets/abstractView/Icons/InitialRules_Enabled.svg";
import RequirementsIcon from "../../../src/assets/abstractView/Icons/Requirement.svg";
import RequirementsIcon_EN from "../../../src/assets/abstractView/Icons/Requirement_Enabled.svg";
import WorkdeskIcon from "../../../src/assets/abstractView/Icons/Workdesk.svg";
import WorkdeskIcon_EN from "../../../src/assets/abstractView/Icons/Workdesk_Enabled.svg";
import ForwardMapping from "../../../src/assets/abstractView/Icons/ForwardMapping.svg";
import ReverseMapping from "../../../src/assets/abstractView/Icons/ReverseMapping.svg";
import EntrySettingsIcon from "../../../src/assets/abstractView/Icons/EntrySetting.svg";
import EntrySettingsIcon_EN from "../../../src/assets/abstractView/Icons/EntrySetting_Enabled.svg";
import WebserviceIcon from "../../../src/assets/abstractView/Icons/Webservice.png";
import WebserviceIcon_EN from "../../../src/assets/abstractView/Icons/Webservice_Enabled.png";
import ExportIcon from "../../../src/assets/abstractView/Icons/Export.png";
import ExportIcon_EN from "../../../src/assets/abstractView/Icons/Export_Enabled.png";
import OutputVariablesIcon from "../../../src/assets/abstractView/Icons/OutputVariables.png";
import OutputVariablesIcon_EN from "../../../src/assets/abstractView/Icons/OutputVariables_Enabled.png";
import ReceiveIcon from "../../../src/assets/abstractView/Icons/Receive.png";
import ReceiveIcon_EN from "../../../src/assets/abstractView/Icons/Receive_Enabled.png";
import SendIcon from "../../../src/assets/abstractView/Icons/Send.png";
import SendIcon_EN from "../../../src/assets/abstractView/Icons/Send_Enabled.png";
import SearchVariableIcon from "../../../src/assets/abstractView/Icons/SearchVariable.png";
import SearchVariableIcon_EN from "../../../src/assets/abstractView/Icons/SearchVariable_Enabled.png";
import SearchResultIcon from "../../../src/assets/abstractView/Icons/SearchResult.png";
import SearchResultIcon_EN from "../../../src/assets/abstractView/Icons/SearchResult_Enabled.png";
import RoutingCriteriaIcon from "../../../src/assets/abstractView/Icons/RoutingCriteria.png";
import RoutingCriteriaIcon_EN from "../../../src/assets/abstractView/Icons/RoutingCriteria_Enabled.png";
import ArchieveIcon from "../../../src/assets/abstractView/Icons/Archieve.png";
import ArchieveIcon_EN from "../../../src/assets/abstractView/Icons/Archieve_Enabled.png";
import SAPIcon from "../../../src/assets/abstractView/Icons/SAP.png";
import SAPIcon_EN from "../../../src/assets/abstractView/Icons/SAP_Enabled.png";
import RestfulIcon from "../../../src/assets/abstractView/Icons/Restful.png";
import RestfulIcon_EN from "../../../src/assets/abstractView/Icons/Restful_Enabled.png";
import fwdDocMappingIcon from "../../../src/assets/abstractView/Icons/fwdDocMapping.png";
import fwdDocMappingIcon_EN from "../../../src/assets/abstractView/Icons/fwdDocMapping_Enabled.png";
import revDocMappingIcon from "../../../src/assets/abstractView/Icons/revDocMapping.png";
import revDocMappingIcon_EN from "../../../src/assets/abstractView/Icons/revDocMapping_Enabled.png";
import StreamsIcon from "../../../src/assets/abstractView/Icons/Streams.png";
import StreamsIcon_EN from "../../../src/assets/abstractView/Icons/Streams_Enabled.png";
import OptionIcon from "../../../src/assets/abstractView/Icons/Options.svg";
import Throw from "../../../src/assets/abstractView/Icons/Throw.svg";
import Catch from "../../../src/assets/abstractView/Icons/Catch.svg";
import { propertiesLabel } from "../../Constants/appConstants";
import TaskEscalationRules from "../../components/Properties/PropetiesTab/TaskEscalationRules/TaskEscalationRules";
import TaskData from "../../components/Properties/PropetiesTab/TaskData/TaskData";

const TaskDetails = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/TaskDetails/TaskDetails")
);

const TaskOptions = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/TaskOptions/TaskOptions")
);
const BasicDetails = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/basicDetails/basicDetails")
);
const Webservice = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/Webservice/index.js")
);
const InitialRule = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/InitialRule/index")
);
const Attachment = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/Attachment/Attachment")
);
const Restful = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/Restful/index.js")
);
const ResponseConsumerJMS = React.lazy(() =>
  import(
    "../../components/Properties/PropetiesTab/ResponseConsumerJMS/index.js"
  )
);

const RequestConsumerSoap = React.lazy(() =>
  import(
    "../../components/Properties/PropetiesTab/requestConsumerSOAP/index.js"
  )
);

const DataFields = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/dataFields/dataFields")
);

const ReceiveInvocation = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/receive/index")
);
const JmsProducer = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/jmsProducer/index")
);
const Options = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/Options/index")
);
const Export = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/Export/index")
);
const EntrySetting = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/ActivityRules/index")
);
const RoutingCriteria = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/ActivityRules/index")
);
const DistributeTab = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/ActivityRules/index")
);
const JmsConsumer = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/JmsConsumer/JmsConsumer")
);
const Collect = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/Collect/Collect")
);
const WorkdeskTab = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/WorkdeskTab/Workdesk")
);
const Archieve = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/dmsAdapter/Archieve/index")
);
const ForwardMapping_Variables = React.lazy(() =>
  import(
    "../../components/Properties/PropetiesTab/callActivity/forwardMVariables"
  )
);
const ForwardMapping_Variables_ProcessTask = React.lazy(() =>
  import(
    "../../components/Properties/PropetiesTab/ProcessTask/MappingFiles/forwardMVariables"
  )
);
const ForwardMapping_DocTypes = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/callActivity/forwardMDoc")
);
const ForwardMapping_DocTypes_ProcessTask = React.lazy(() =>
  import(
    "../../components/Properties/PropetiesTab/ProcessTask/MappingFiles/forwardMDocs"
  )
);

const ReverseMapping_Variables = React.lazy(() =>
  import(
    "../../components/Properties/PropetiesTab/callActivity/reverseMVariables"
  )
);

const ReverseMapping_Variables_ProcessTask = React.lazy(() =>
  import(
    "../../components/Properties/PropetiesTab/ProcessTask/MappingFiles/reverseMVariables"
  )
);

const ReverseMDoc = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/callActivity/reverseMDoc")
);

const ReverseMDoc_ProcessTask = React.lazy(() =>
  import(
    "../../components/Properties/PropetiesTab/ProcessTask/MappingFiles/reverseMDocs"
  )
);

const Stream = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/Streams/Stream")
);
const SearchVariable = React.lazy(() =>
  import(
    "../../components/Properties/PropetiesTab/SearchVariable/SearchVariable"
  )
);
const SearchResults = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/SearchResults/SearchResults")
);
const IntiateWorkstep = React.lazy(() =>
  import(
    "../../components/Properties/PropetiesTab/InitialWorkstep/InitialWorkstep"
  )
);
const Email = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/Email/Email")
);
const Task = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/Task/Task")
);
const Templates = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/Templates")
);
const OutputVariables = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/OutputVariables")
);
const Sap = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/SAP/Sap")
);

const Requirements = React.lazy(() =>
  import(
    "../../components/ViewingArea/ProcessRequirements&Attchments/ProcessRequirements/index.js"
  )
);
// const DataExchange = React.lazy(() =>
//   import("../../components/Properties/PropetiesTab/DataExchange")
// );
const DataExchange = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/DataExchange")
);

const BusinessRules = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/BusinessRules/index.js")
);

const SharePointArchives = React.lazy(() =>
  import("../../components/Properties/PropetiesTab/sharePointArchives/index.js")
);

const tabNames = {
  1: {
    name: <BasicDetails />,
    toolTip: "basicDetails",
    icon: BasicDetailsIcon,
    icon_enabled: BasicDetailsIcon_EN,
    label: propertiesLabel.basicDetails,
  },
  2: {
    name: <DataFields />,
    toolTip: "dataFields",
    icon: DataFieldsIcon,
    icon_enabled: DataFieldsIcon_EN,
    label: propertiesLabel.dataFields,
  },
  3: {
    name: <InitialRule />,
    toolTip: "initialRules",
    icon: InitialRulesIcon,
    icon_enabled: InitialRulesIcon_EN,
    label: propertiesLabel.initialRules,
  },
  4: {
    name: <Requirements />,
    toolTip: "requirements",
    icon: RequirementsIcon,
    icon_enabled: RequirementsIcon_EN,
    label: propertiesLabel.requirements,
  },
  5: {
    name: <Attachment />,
    toolTip: "attachments",
    icon: AttachmentsIcon,
    icon_enabled: AttachmentsIcon_EN,
    label: propertiesLabel.attachments,
  },
  6: {
    name: <WorkdeskTab />,
    toolTip: "workdesk",
    icon: WorkdeskIcon,
    icon_enabled: WorkdeskIcon_EN,
    label: propertiesLabel.workdesk,
  },
  7: {
    name: <div>Registration to be painted here</div>,
    toolTip: "registration",
    label: propertiesLabel.registration,
  },
  8: {
    name: <div>Event Configuration to be painted here</div>,
    tabToolTip: "eventConfiguration",
    label: propertiesLabel.eventConfiguration,
  },
  9: {
    name: <ForwardMapping_Variables tabType="Forward Variable Mapping" />,
    toolTip: "ForwardVariableMapping",
    icon: ForwardMapping,
    label: propertiesLabel.fwdVarMapping,
  },
  10: {
    name: <ReverseMapping_Variables tabType="Reverse Variable Mapping" />,
    toolTip: "ReverseVariableMapping",
    icon: ReverseMapping,
    label: propertiesLabel.revVarMapping,
  },
  11: {
    name: <EntrySetting />,
    toolTip: "entrySettings",
    icon: EntrySettingsIcon,
    icon_enabled: EntrySettingsIcon_EN,
    label: propertiesLabel.EntrySetting,
  },
  12: {
    name: <Stream />,
    toolTip: "streams",
    icon: StreamsIcon, //code edited on 28 July 2022 for BugId 111551
    icon_enabled: StreamsIcon_EN, //code edited on 28 July 2022 for BugId 111551
    label: propertiesLabel.streams,
  },
  13: {
    name: <Options />,
    toolTip: "options",
    icon: OptionIcon,
    label: propertiesLabel.options,
  },
  14: {
    name: <div>Throw Events to be painted here</div>,
    toolTip: "throwEvents",
    icon: Throw,
    label: propertiesLabel.throwEvents,
  },
  15: {
    name: <div>Catch events to be painted here</div>,
    toolTip: "catchEvents",
    icon: Catch,
    label: propertiesLabel.catchEvents,
  },
  16: {
    name: <Task />,
    toolTip: "task",
    label: propertiesLabel.task,
  },
  17: {
    name: <ReceiveInvocation />,
    toolTip: "receive",
    icon: ReceiveIcon,
    icon_enabled: ReceiveIcon_EN,
    label: propertiesLabel.receive,
  },
  18: {
    name: <OutputVariables />,
    toolTip: "outputVariables",
    icon: OutputVariablesIcon,
    icon_enabled: OutputVariablesIcon_EN,
    label: propertiesLabel.outputVariables,
  },
  19: {
    name: <Export />,
    toolTip: "Export",
    icon: ExportIcon,
    icon_enabled: ExportIcon_EN,
    label: propertiesLabel.Export,
  },
  20: {
    name: <SearchVariable />,
    toolTip: "searchVariables",
    icon: SearchVariableIcon,
    icon_enabled: SearchVariableIcon_EN,
    label: propertiesLabel.searchVariables,
  },
  21: {
    name: <SearchResults />,
    toolTip: "searchResults",
    icon: SearchResultIcon,
    icon_enabled: SearchResultIcon_EN,
    label: propertiesLabel.searchResults,
  },
  22: {
    name: <Webservice />,
    toolTip: "webService",
    icon: WebserviceIcon,
    icon_enabled: WebserviceIcon_EN,
    label: propertiesLabel.webService,
  },
  23: {
    name: <BusinessRules />,
    toolTip: "businessRule",
    label: propertiesLabel.businessRule,
  },
  24: {
    name: <Archieve />,
    toolTip: "archive",
    icon: ArchieveIcon,
    icon_enabled: ArchieveIcon_EN,
    label: propertiesLabel.archive,
  },
  25: {
    name: <Templates />,
    toolTip: "templates",
    label: propertiesLabel.templates,
  },
  26: {
    name: <div>message to be painted here</div>,
    toolTip: "message",
    label: propertiesLabel.message,
  },
  27: {
    name: <div>Email to be painted here.</div>,
    toolTip: "entryDetails",
    label: propertiesLabel.entryDetails,
  },
  28: {
    name: <JmsProducer />,
    toolTip: "jmsProducer",
    label: propertiesLabel.jmsProducer,
  },
  29: {
    name: <JmsConsumer />,
    toolTip: "jmsConsumer",
    label: propertiesLabel.jmsConsumer,
  },
  30: {
    name: <div>timer to be painted here</div>,
    toolTip: "timer",
    label: propertiesLabel.timer,
  },
  31: {
    name: <div>reminder to be painted here</div>,
    toolTip: "reminder",
    label: propertiesLabel.reminder,
  },
  32: {
    name: <DistributeTab />,
    toolTip: "distribute",
    icon: EntrySettingsIcon,
    label: propertiesLabel.distribute,
  },
  33: {
    name: <Collect />,
    toolTip: "collect",
    label: propertiesLabel.collect,
  },
  34: {
    name: <RoutingCriteria />,
    toolTip: "routingCriteria",
    icon: RoutingCriteriaIcon,
    icon_enabled: RoutingCriteriaIcon_EN,
    label: propertiesLabel.routingCriteria,
  },
  35: {
    name: <IntiateWorkstep />,
    toolTip: "initiateWorkstep",
    label: propertiesLabel.initiateWorkstep,
  },
  36: {
    name: <DataExchange />,
    toolTip: "dataExchange",
    label: propertiesLabel.dataExchange,
  },
  37: {
    name: <Sap />,
    toolTip: "sap",
    icon: SAPIcon,
    icon_enabled: SAPIcon_EN,
    label: propertiesLabel.sap,
  },
  38: {
    name: <ResponseConsumerJMS />,
    toolTip: "resConsumerJms",
    label: propertiesLabel.resConJMS,
  },
  39: {
    name: <Options />,
    toolTip: "resConsumerSoap",
    label: propertiesLabel.resConSOAP,
  },
  40: {
    name: <RequestConsumerSoap />,
    toolTip: "reqConsumerSoap",
    label: propertiesLabel.reqConSOAP,
  },
  41: {
    name: <Restful />,
    toolTip: "Restful",
    icon: RestfulIcon,
    icon_enabled: RestfulIcon_EN,
    label: propertiesLabel.Restful,
  },
  42: {
    name: <ForwardMapping_DocTypes tabType="Forward DocType Mapping" />,
    toolTip: "ForwardDocTypeMapping",
    icon: fwdDocMappingIcon,
    icon_enabled: fwdDocMappingIcon_EN,
    label: propertiesLabel.fwdDocMapping,
  },
  43: {
    name: <ReverseMDoc tabType="Reverse DocType Mapping" />,
    toolTip: "ReverseDocTypeMapping",
    icon: revDocMappingIcon,
    icon_enabled: revDocMappingIcon_EN,
    label: propertiesLabel.revDocMapping,
  },
  44: {
    name: <Email />,
    toolTip: "send",
    icon: SendIcon,
    icon_enabled: SendIcon_EN,
    label: propertiesLabel.send,
  },
  45: {
    name: <TaskDetails />,
    toolTip: "TaskDetails",
    icon: BasicDetailsIcon,
    icon_enabled: BasicDetailsIcon_EN,
    label: propertiesLabel.taskDetails,
  },
  46: {
    name: <TaskEscalationRules />,
    toolTip: "EscalationRule(s)",
    label: propertiesLabel.escalationRules,
  },
  47: {
    name: <TaskOptions />,
    toolTip: "options",
    label: propertiesLabel.taskOptions,
  },
  48: {
    name: <TaskData />,
    toolTip: "data",
    label: propertiesLabel.taskData,
  },
  49: {
    name: <SharePointArchives />,
    toolTip: "Archive",
    label: propertiesLabel.sharePointArchive,
  },
  50: {
    name: (
      <ForwardMapping_DocTypes_ProcessTask tabType="Forward DocType Mapping" />
    ),
    toolTip: "ForwardDocTypeMapping",
    icon: ForwardMapping,
    label: propertiesLabel.fwdDocMappingProcessTask,
  },
  51: {
    name: <ReverseMDoc_ProcessTask tabType="Reverse DocType Mapping" />,
    toolTip: "ReverseDocTypeMapping",
    icon: ReverseMapping,
    label: propertiesLabel.revDocMappingProcessTask,
  },
  52: {
    name: (
      <ForwardMapping_Variables_ProcessTask tabType="Forward Variable Mapping" />
    ),
    toolTip: "ForwardVariableMapping",
    icon: ForwardMapping,
    label: propertiesLabel.fwdVarMappingProcessTask,
  },
  53: {
    name: (
      <ReverseMapping_Variables_ProcessTask tabType="Reverse Variable Mapping" />
    ),
    toolTip: "ReverseVariableMapping",
    icon: ReverseMapping,
    label: propertiesLabel.revVarMappingProcessTask,
  },
};

export const propertiesTabsForActivities = (number) => {
  return tabNames[number];
};
