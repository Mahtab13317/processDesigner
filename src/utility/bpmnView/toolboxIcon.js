import { style, TASK_TEMPLATES_HEAD } from "../../Constants/bpmnView";
import {
  activityType,
  activityType_label,
  TaskType,
  taskType_label,
} from "../../Constants/appConstants";

import startEventIcon from "../../assets/bpmnViewIcons/StartEvent.svg";
import conditionalStartIcon from "../../assets/bpmnViewIcons/ConditionalStart.svg";
import messageStartIcon from "../../assets/bpmnViewIcons/MessageStart.svg";
import timerStartIcon from "../../assets/bpmnViewIcons/TimerStart.svg";
import subProcessIcon from "../../assets/bpmnViewIcons/EmbeddedSubprocess.svg";
import callActivityIcon from "../../assets/bpmnViewIcons/CallActivity.svg";
import caseWorkdeskIcon from "../../assets/bpmnViewIcons/CaseWorkdesk.svg";
import receiveIcon from "../../assets/bpmnViewIcons/Receive.svg";
import replyIcon from "../../assets/bpmnViewIcons/Reply.svg";
import emailIcon from "../../assets/bpmnViewIcons/Email.svg";
import exportIcon from "../../assets/bpmnViewIcons/Export.svg";
import queryIcon from "../../assets/bpmnViewIcons/Query.svg";
import workdeskIcon from "../../assets/bpmnViewIcons/Workdesk.svg";
import eventIcon from "../../assets/bpmnViewIcons/Event.svg";
import jmsConsumerIcon from "../../assets/bpmnViewIcons/JMSConsumer.svg";
import jmsProducerIcon from "../../assets/bpmnViewIcons/JMSProducer.svg";
import timerEventIcon from "../../assets/bpmnViewIcons/TimerEvent.svg";
import exclusiveGatewayIcon from "../../assets/bpmnViewIcons/DataBasedExclusive.svg";
import inclusiveCollectIcon from "../../assets/bpmnViewIcons/InclusiveCollect.svg";
import inclusiveGatewayIcon from "../../assets/bpmnViewIcons/InclusiveDistribute.svg";
import parallelGatewayIcon from "../../assets/bpmnViewIcons/ParallelDistribute.svg";
import parallelCollectIcon from "../../assets/bpmnViewIcons/ParallelCollect.svg";
import endEventIcon from "../../assets/bpmnViewIcons/EndEvent.svg";
import messageEndIcon from "../../assets/bpmnViewIcons/MessageEnd.svg";
import terminateIcon from "../../assets/bpmnViewIcons/TerminateEvent.svg";
import robotWorkdeskIcon from "../../assets/bpmnViewIcons/RobotWorkdesk.svg";
import sapAdapterIcon from "../../assets/bpmnViewIcons/SAP.svg";
import omsAdapterIcon from "../../assets/bpmnViewIcons/OMSAdapter.svg";
import webServiceIcon from "../../assets/bpmnViewIcons/Webservices.svg";
import businessRuleIcon from "../../assets/bpmnViewIcons/BusinessRule.svg";
import dmsAdapterIcon from "../../assets/bpmnViewIcons/DMSAdapter.svg";
import dataExchangeIcon from "../../assets/bpmnViewIcons/DataExchange.svg";
import integrationPointsIcon from "../../assets/bpmnViewIcons/DataExchangeHead.svg";
import activityIcon from "../../assets/bpmnViewIcons/ActivitiesHead.svg";
import startHeadIcon from "../../assets/bpmnViewIcons/StartEventHead.svg";
import intermediateEventIcon from "../../assets/bpmnViewIcons/IntermediateEventsHead.svg";
import decisionIcon from "../../assets/bpmnViewIcons/GatewaysHead.svg";
import endHeadIcon from "../../assets/bpmnViewIcons/EndEventHead.svg";
import taskTemplateIcon from "../../assets/bpmnViewIcons/TaskTemplate.svg";
import artefactsIcon from "../../assets/bpmnViewIcons/ArtefactsHead.svg";
import taskIcon from "../../assets/bpmnViewIcons/TaskIcon.svg";
//pending

import sharePointIcon from "../../assets/bpmnViewIcons/SharePoint.svg";
import dataObjectIcon from "../../assets/bpmnView/artefactsIcon/Data Object.png";
import groupBoxIcon from "../../assets/bpmnView/artefactsIcon/Group Box.png";
import messageIcon from "../../assets/bpmnView/artefactsIcon/Message.png";
import textAnnotationIcon from "../../assets/bpmnView/artefactsIcon/Text Annotation.png";

export const newTask = {
  icon: taskTemplateIcon,
  title: taskType_label.newTask_label,
  styleName: style.newTask,
  activitySubType: TaskType.globalTask,
};

export const processTask = {
  icon: taskTemplateIcon,
  title: taskType_label.processTask_label,
  styleName: style.processTask,
  activitySubType: TaskType.processTask,
};

export const taskTemplate = {
  icon: taskIcon,
};

export const startEvent = {
  icon: startEventIcon,
  title: activityType_label.startEvent_label,
  description: "toolbox.description.startEvent",
  styleName: style.startEvent,
  activitySubType: activityType.startEvent,
  activitySubTypeId: 1,
  activityTypeId: 1,
};

export const conditionalEvents = {
  icon: conditionalStartIcon,
  title: activityType_label.conditionalStart_label,
  description: "toolbox.description.conditionalStart",
  styleName: style.conditionalStart,
  activitySubType: activityType.conditionalStart,
  activitySubTypeId: 3,
  activityTypeId: 1,
};

export const messageStart = {
  icon: messageStartIcon,
  title: activityType_label.messageStart_label,
  description: "toolbox.description.messageStart",
  styleName: style.messageStart,
  activitySubType: activityType.messageStart,
  activitySubTypeId: 7,
  activityTypeId: 1,
};

export const timerStart = {
  icon: timerStartIcon,
  title: activityType_label.timerStart_label,
  description: "toolbox.description.timerStart",
  styleName: style.timerStart,
  activitySubType: activityType.timerStart,
  activitySubTypeId: 6,
  activityTypeId: 1,
};

export const subProcess = {
  icon: subProcessIcon,
  title: activityType_label.subProcess_label,
  description: "toolbox.description.embeddedSubprocess",
  styleName: style.subProcess,
  activitySubType: activityType.subProcess,
  activitySubTypeId: 1,
  activityTypeId: 41,
};

export const callActivity = {
  icon: callActivityIcon,
  title: activityType_label.callActivity_label,
  description: "toolbox.description.callActivity",
  styleName: style.callActivity,
  activitySubType: activityType.callActivity,
  activitySubTypeId: 1,
  activityTypeId: 18,
};

export const workdesk = {
  icon: workdeskIcon,
  title: activityType_label.workdesk_label,
  description: "toolbox.description.workDesk",
  styleName: style.workdesk,
  activitySubType: activityType.workdesk,
  activitySubTypeId: 3,
  activityTypeId: 10,
};

export const robotWorkdesk = {
  icon: robotWorkdeskIcon,
  title: activityType_label.robotWorkdesk_label,
  description: "toolbox.description.robotWorkdesk",
  styleName: style.robotWorkdesk,
  activitySubType: activityType.robotWorkdesk,
  activitySubTypeId: 7,
  activityTypeId: 10,
};

export const caseWorkdesk = {
  icon: caseWorkdeskIcon,
  title: activityType_label.caseWorkdesk_label,
  description: "toolbox.description.caseWorkdesk",
  styleName: style.caseWorkdesk,
  activitySubType: activityType.caseWorkdesk,
  activitySubTypeId: 1,
  activityTypeId: 32,
};

export const email = {
  icon: emailIcon,
  title: activityType_label.email_label,
  description: "toolbox.description.email",
  styleName: style.email,
  activitySubType: activityType.email,
  activitySubTypeId: 1,
  activityTypeId: 10,
};

export const exportActivity = {
  icon: exportIcon,
  title: activityType_label.export_label,
  description: "toolbox.description.export",
  styleName: style.export,
  activitySubType: activityType.export,
  activitySubTypeId: 1,
  activityTypeId: 20,
};

export const query = {
  icon: queryIcon,
  title: activityType_label.query_label,
  description: "toolbox.description.query",
  styleName: style.query,
  activitySubType: activityType.query,
  activitySubTypeId: 1,
  activityTypeId: 11,
};

export const sapAdapter = {
  icon: sapAdapterIcon,
  title: activityType_label.sapAdapter_label,
  description: "toolbox.description.sapAdapter",
  styleName: style.sapAdapter,
  activitySubType: activityType.sapAdapter,
  activitySubTypeId: 1,
  activityTypeId: 29,
};

export const webService = {
  icon: webServiceIcon,
  title: activityType_label.webService_label,
  description: "toolbox.description.webService",
  styleName: style.webService,
  activitySubType: activityType.webService,
  activitySubTypeId: 1,
  activityTypeId: 22,
};

export const responseConsumerJMS = {
  icon: webServiceIcon,
  title: activityType_label.responseConsumerJMS_label,
  description: "toolbox.description.webService",
  styleName: style.webService,
  activitySubType: activityType.webService,
  activitySubTypeId: 1,
  activityTypeId: 23,
};

export const responseConsumerSOAP = {
  icon: webServiceIcon,
  title: activityType_label.responseConsumerSOAP_label,
  description: "toolbox.description.webService",
  styleName: style.webService,
  activitySubType: activityType.webService,
  activitySubTypeId: 1,
  activityTypeId: 25,
};

export const requestConsumerSOAP = {
  icon: webServiceIcon,
  title: activityType_label.requestConsumerSOAP_label,
  description: "toolbox.description.webService",
  styleName: style.webService,
  activitySubType: activityType.webService,
  activitySubTypeId: 1,
  activityTypeId: 24,
};

export const restful = {
  icon: webServiceIcon,
  title: activityType_label.restful_label,
  description: "toolbox.description.webService",
  styleName: style.webService,
  activitySubType: activityType.webService,
  activitySubTypeId: 1,
  activityTypeId: 40,
};

export const businessRule = {
  icon: businessRuleIcon,
  title: activityType_label.businessRule_label,
  description: "toolbox.description.businessRule",
  styleName: style.businessRule,
  activitySubType: activityType.businessRule,
  activitySubTypeId: 1,
  activityTypeId: 31,
};

export const dmsAdapter = {
  icon: dmsAdapterIcon,
  title: activityType_label.dmsAdapter_label,
  description: "toolbox.description.dmsAdapter",
  styleName: style.dmsAdapter,
  activitySubType: activityType.dmsAdapter,
  activitySubTypeId: 4,
  activityTypeId: 10,
};

export const sharePoint = {
  icon: sharePointIcon,
  title: activityType_label.sharePoint_label,
  description: "toolbox.description.sharePoint",
  styleName: style.sharePoint,
  activitySubType: activityType.sharePoint,
  activitySubTypeId: 1,
  activityTypeId: 30,
};

export const receive = {
  icon: receiveIcon,
  title: activityType_label.receive_label,
  description: "toolbox.description.receive",
  styleName: style.receive,
  activitySubType: activityType.receive,
  activitySubTypeId: 2,
  activityTypeId: 1,
};

export const reply = {
  icon: replyIcon,
  title: activityType_label.reply_label,
  description: "toolbox.description.reply",
  styleName: style.reply,
  activitySubType: activityType.reply,
  activitySubTypeId: 1,
  activityTypeId: 26,
};

export const omsAdapter = {
  icon: omsAdapterIcon,
  title: activityType_label.ccm_label,
  description: "toolbox.description.omsAdapter",
  styleName: style.omsAdapter,
  activitySubType: activityType.omsAdapter,
  activitySubTypeId: 1,
  activityTypeId: 33,
};

export const event = {
  icon: eventIcon,
  title: activityType_label.event_label,
  description: "toolbox.description.eventWorkstep",
  styleName: style.event,
  activitySubType: activityType.event,
  activitySubTypeId: 1,
  activityTypeId: 27,
};

export const jmsProducer = {
  icon: jmsProducerIcon,
  title: activityType_label.jmsProducer_label,
  description: "toolbox.description.jmsProducer",
  styleName: style.jmsProducer,
  activitySubType: activityType.jmsProducer,
  activitySubTypeId: 1,
  activityTypeId: 19,
};

export const jmsConsumer = {
  icon: jmsConsumerIcon,
  title: activityType_label.jmsConsumer_label,
  description: "toolbox.description.jmsConsumer",
  styleName: style.jmsConsumer,
  activitySubType: activityType.jmsConsumer,
  activitySubTypeId: 1,
  activityTypeId: 21,
};

export const timerEvents = {
  icon: timerEventIcon,
  title: activityType_label.timerEvents_label,
  description: "toolbox.description.timerEventWorkstep",
  styleName: style.timerEvents,
  activitySubType: activityType.timerEvents,
  activitySubTypeId: 1,
  activityTypeId: 4,
};

export const inclusiveDistribute = {
  icon: inclusiveGatewayIcon,
  title: activityType_label.inclusiveDistribute_label,
  description: "toolbox.description.inclusiveDistribute",
  styleName: style.inclusiveDistribute,
  activitySubType: activityType.inclusiveDistribute,
  activitySubTypeId: 1,
  activityTypeId: 5,
};

export const parallelDistribute = {
  icon: parallelGatewayIcon,
  title: activityType_label.parallelDistribute_label,
  description: "toolbox.description.parallelDistribute",
  styleName: style.parallelDistribute,
  activitySubType: activityType.parallelDistribute,
  activitySubTypeId: 2,
  activityTypeId: 5,
};

export const parallelCollect = {
  icon: parallelCollectIcon,
  title: activityType_label.parallelCollect_label,
  description: "toolbox.description.parallelCollect",
  styleName: style.parallelCollect,
  activitySubType: activityType.parallelCollect,
  activitySubTypeId: 2,
  activityTypeId: 6,
};

export const dataBasedExclusive = {
  icon: exclusiveGatewayIcon,
  title: activityType_label.dataBasedExclusive_label,
  description: "toolbox.description.dataBasedExclusive",
  styleName: style.dataBasedExclusive,
  activitySubType: activityType.dataBasedExclusive,
  activitySubTypeId: 1,
  activityTypeId: 7,
};

export const inclusiveCollect = {
  icon: inclusiveCollectIcon,
  title: activityType_label.inclusiveCollect_label,
  description: "toolbox.description.inclusiveCollect",
  styleName: style.inclusiveCollect,
  activitySubType: activityType.inclusiveCollect,
  activitySubTypeId: 1,
  activityTypeId: 6,
};

export const endEvent = {
  icon: endEventIcon,
  title: activityType_label.endEvent_label,
  description: "toolbox.description.endEvent",
  styleName: style.endEvent,
  activitySubType: activityType.endEvent,
  activitySubTypeId: 1,
  activityTypeId: 2,
};

export const terminate = {
  icon: terminateIcon,
  title: activityType_label.terminate_label,
  description: "toolbox.description.terminateEvent",
  styleName: style.terminate,
  activitySubType: activityType.terminate,
  activitySubTypeId: 1,
  activityTypeId: 3,
};

export const messageEnd = {
  icon: messageEndIcon,
  title: activityType_label.messageEnd_label,
  description: "toolbox.description.messageEnd",
  styleName: style.messageEnd,
  activitySubType: activityType.messageEnd,
  activitySubTypeId: 2,
  activityTypeId: 2,
};

export const dataExchange = {
  icon: dataExchangeIcon,
  title: activityType_label.dataExchange_label,
  description: "toolbox.description.dataExchange",
  styleName: style.dataExchange,
  activitySubType: activityType.dataExchange,
  activitySubTypeId: 1,
  activityTypeId: 34,
};

export const textAnnotations = {
  icon: textAnnotationIcon,
  title: "toolbox.artefacts.textAnnotations",
  description: "toolbox.description.textAnnotation",
  styleName: style.textAnnotations,
  activitySubType: activityType.textAnnotations,
};

export const groupBox = {
  icon: groupBoxIcon,
  title: "toolbox.artefacts.groupBox",
  description: "toolbox.description.groupBox",
  styleName: style.groupBox,
  activitySubType: activityType.groupBox,
};

export const dataObject = {
  icon: dataObjectIcon,
  title: "toolbox.artefacts.dataObject",
  description: "toolbox.description.dataObject",
  styleName: style.dataObject,
  activitySubType: activityType.dataObject,
};

export const message = {
  icon: messageIcon,
  title: "toolbox.artefacts.message",
  description: "toolbox.description.message",
  styleName: style.message,
  activitySubType: activityType.message,
};

//now each of the tooltypes are defined

export const taskTemplates = {
  icon: taskTemplateIcon,
  title: TASK_TEMPLATES_HEAD,
  tools: [newTask, processTask],
};

export const startEvents = {
  icon: startHeadIcon,
  title: "toolbox.startEvents.head",
  tools: [startEvent, conditionalEvents, messageStart, timerStart],
};

export const activities = {
  icon: activityIcon,
  title: "toolbox.activities.head",
  tools: [
    subProcess,
    callActivity,
    workdesk,
    caseWorkdesk,
    receive,
    reply,
    email,
    exportActivity,
    query,
  ],
};

export const intermediateEvents = {
  icon: intermediateEventIcon,
  title: "toolbox.intermediateEvents.head",
  tools: [event, jmsProducer, jmsConsumer, timerEvents],
};

export const gateway = {
  icon: decisionIcon,
  title: "toolbox.gateway.head",
  tools: [
    inclusiveDistribute,
    inclusiveCollect,
    parallelDistribute,
    parallelCollect,
    dataBasedExclusive,
  ],
};

export const endEvents = {
  icon: endHeadIcon,
  title: "toolbox.endEvents.head",
  tools: [endEvent, terminate, messageEnd],
};

export const integrationPoints = {
  icon: integrationPointsIcon,
  title: "toolbox.integrationPoints.head",
  tools: [
    dataExchange,
    webService,
    dmsAdapter,
    omsAdapter,
    sapAdapter,
    sharePoint,
    robotWorkdesk,
    businessRule,
  ],
};

export const artefacts = {
  icon: artefactsIcon,
  title: "toolbox.artefacts.head",
  tools: [textAnnotations, groupBox, dataObject, message],
};
