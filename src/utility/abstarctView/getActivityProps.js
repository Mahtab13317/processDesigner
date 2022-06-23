import StartEventLogo from "../../assets/bpmnViewIcons/StartEvent.svg";
import ConditionalStartLogo from "../../assets/bpmnViewIcons/ConditionalStart.svg";
import MessageStartLogo from "../../assets/bpmnViewIcons/MessageStart.svg";
import TimerStartLogo from "../../assets/bpmnViewIcons/TimerStart.svg";
import SubprocessLogo from "../../assets/bpmnViewIcons/EmbeddedSubprocess.svg";
import CallActivityLogo from "../../assets/bpmnViewIcons/CallActivity.svg";
import CaseWorkdeskLogo from "../../assets/bpmnViewIcons/CaseWorkdesk.svg";
import EmailLogo from "../../assets/bpmnViewIcons/Email.svg";
import ReceiveLogo from "../../assets/bpmnViewIcons/Receive.svg";
import ReplyLogo from "../../assets/bpmnViewIcons/Reply.svg";
import ExportLogo from "../../assets/bpmnViewIcons/Export.svg";
import QueryLogo from "../../assets/bpmnViewIcons/Query.svg";
import WorkdeskLogo from "../../assets/bpmnViewIcons/Workdesk.svg";
import EventLogo from "../../assets/bpmnViewIcons/Event.svg";
import JMSConsumerLogo from "../../assets/bpmnViewIcons/JMSConsumer.svg";
import JMSProducerLogo from "../../assets/bpmnViewIcons/JMSProducer.svg";
import TimerEventLogo from "../../assets/bpmnViewIcons/TimerEvent.svg";
import ExclusiveGatewayLogo from "../../assets/bpmnViewIcons/DataBasedExclusive.svg";
import InclusiveCollectIcon from "../../assets/bpmnViewIcons/InclusiveCollect.svg";
import InclusiveGatewayLogo from "../../assets/bpmnViewIcons/InclusiveDistribute.svg";
import ParallelGatewayLogo from "../../assets/bpmnViewIcons/ParallelDistribute.svg";
import ParallelCollectIcon from "../../assets/bpmnViewIcons/ParallelCollect.svg";
import EndEventLogo from "../../assets/bpmnViewIcons/EndEvent.svg";
import MessageEndLogo from "../../assets/bpmnViewIcons/MessageEnd.svg";
import TerminateLogo from "../../assets/bpmnViewIcons/TerminateEvent.svg";
import businessRuleLogo from "../../assets/bpmnViewIcons/BusinessRule.svg";
import DataExchangeLogo from "../../assets/bpmnViewIcons/DataExchange.svg";
import DMSAdapterLogo from "../../assets/bpmnViewIcons/DMSAdapter.svg";
import OMSAdapterLogo from "../../assets/bpmnViewIcons/OMSAdapter.svg";
import RobotWorkdeskLogo from "../../assets/bpmnViewIcons/RobotWorkdesk.svg";
import SAPLogo from "../../assets/bpmnViewIcons/SAP.svg";
import WebserviceLogo from "../../assets/bpmnViewIcons/Webservices.svg";
import SharePointLogo from "../../assets/bpmnViewIcons/SharePoint.svg";

import { activityType, activityType_label } from "../../Constants/appConstants";

export function getActivityProps(activityTypeInt, activitySubTypeInt) {
  let src;
  let classForActivity;
  let color;
  let backgroundColor;
  let activityTypeName;
  let activityName;

  if (+activityTypeInt === 1 && +activitySubTypeInt === 1) {
    //start event
    src = StartEventLogo;
    classForActivity = "startActivityCard";
    color = "#2DB11D";
    backgroundColor = "#2DB11D1A";
    activityTypeName = activityType_label.startEvent_label;
    activityName = activityType.startEvent;
  } else if (+activityTypeInt === 1 && +activitySubTypeInt === 3) {
    //conditional start
    src = ConditionalStartLogo;
    classForActivity = "startActivityCard";
    color = "#2DB11D";
    backgroundColor = "#2DB11D1A";
    activityTypeName = activityType_label.conditionalStart_label;
    activityName = activityType.conditionalStart;
  } else if (+activityTypeInt === 1 && +activitySubTypeInt === 7) {
    //message start
    src = MessageStartLogo;
    classForActivity = "startActivityCard";
    color = "#2DB11D";
    backgroundColor = "#2DB11D1A";
    activityTypeName = activityType_label.messageStart_label;
    activityName = activityType.messageStart;
  } else if (+activityTypeInt === 1 && +activitySubTypeInt === 6) {
    //timer start
    src = TimerStartLogo;
    classForActivity = "startActivityCard";
    color = "#2DB11D";
    backgroundColor = "#2DB11D1A";
    activityTypeName = activityType_label.timerStart_label;
    activityName = activityType.timerStart;
  } else if (+activityTypeInt === 41 && +activitySubTypeInt === 1) {
    //subprocess or embedded subprocess
    src = SubprocessLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.subProcess_label;
    activityName = activityType.subProcess;
  } else if (+activityTypeInt === 18 && +activitySubTypeInt === 1) {
    //call activity
    src = CallActivityLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.callActivity_label;
    activityName = activityType.callActivity;
  } else if (+activityTypeInt === 10 && +activitySubTypeInt === 3) {
    // workdesk
    src = WorkdeskLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.workdesk_label;
    activityName = activityType.workdesk;
  } else if (+activityTypeInt === 32 && +activitySubTypeInt === 1) {
    //case workdesk
    src = CaseWorkdeskLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.caseWorkdesk_label;
    activityName = activityType.caseWorkdesk;
  } else if (+activityTypeInt === 10 && +activitySubTypeInt === 7) {
    //robot workdesk
    src = RobotWorkdeskLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.robotWorkdesk_label;
    activityName = activityType.robotWorkdesk;
  } else if (+activityTypeInt === 1 && +activitySubTypeInt === 2) {
    //receive
    src = ReceiveLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.receive_label;
    activityName = activityType.receive;
  } else if (+activityTypeInt === 26 && +activitySubTypeInt === 1) {
    //reply
    src = ReplyLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.reply_label;
    activityName = activityType.reply;
  } else if (+activityTypeInt === 10 && +activitySubTypeInt === 1) {
    //email
    src = EmailLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.email_label;
    activityName = activityType.email;
  } else if (+activityTypeInt === 20 && +activitySubTypeInt === 1) {
    //export
    src = ExportLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.export_label;
    activityName = activityType.export;
  } else if (+activityTypeInt === 11 && +activitySubTypeInt === 1) {
    //query
    src = QueryLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.query_label;
    activityName = activityType.query;
  } else if (+activityTypeInt === 22 && +activitySubTypeInt === 1) {
    //webservice
    src = WebserviceLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.webService_label;
    activityName = activityType.webService;
  } else if (+activityTypeInt === 23 && +activitySubTypeInt === 1) {
    //response Consumer JMS
    src = WebserviceLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.responseConsumerJMS_label;
    activityName = activityType.responseConsumerJMS;
  } else if (+activityTypeInt === 25 && +activitySubTypeInt === 1) {
    //response Consumer SOAP
    src = WebserviceLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.responseConsumerSOAP_label;
    activityName = activityType.responseConsumerSOAP;
  } else if (+activityTypeInt === 24 && +activitySubTypeInt === 1) {
    //request Consumer SOAP
    src = WebserviceLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.requestConsumerSOAP_label;
    activityName = activityType.requestConsumerSOAP;
  } else if (+activityTypeInt === 40 && +activitySubTypeInt === 1) {
    //REST
    src = WebserviceLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.restful_label;
    activityName = activityType.restful;
  } else if (+activityTypeInt === 31 && +activitySubTypeInt === 1) {
    //businessRule
    src = businessRuleLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.businessRule_label;
    activityName = activityType.businessRule;
  } else if (+activityTypeInt === 10 && +activitySubTypeInt === 4) {
    //dms adapter
    src = DMSAdapterLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.dmsAdapter_label;
    activityName = activityType.dmsAdapter;
  } else if (+activityTypeInt === 33 && +activitySubTypeInt === 1) {
    //oms adapter
    src = OMSAdapterLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.ccm_label;
    activityName = activityType.omsAdapter;
  } else if (+activityTypeInt === 30 && +activitySubTypeInt === 1) {
    //share point
    src = SharePointLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.sharePoint_label;
    activityName = activityType.sharePoint;
  } else if (+activityTypeInt === 29 && +activitySubTypeInt === 1) {
    //sap adapter
    src = SAPLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.sapAdapter_label;
    activityName = activityType.sapAdapter;
  } else if (+activityTypeInt === 27 && +activitySubTypeInt === 1) {
    //event
    src = EventLogo;
    classForActivity = "EventActivityCard";
    color = "#767676";
    backgroundColor = "#FFCE4434";
    activityTypeName = activityType_label.event_label;
    activityName = activityType.event;
  } else if (+activityTypeInt === 19 && +activitySubTypeInt === 1) {
    //jms producer
    src = JMSProducerLogo;
    classForActivity = "EventActivityCard";
    color = "#767676";
    backgroundColor = "#FFCE4434";
    activityTypeName = activityType_label.jmsProducer_label;
    activityName = activityType.jmsProducer;
  } else if (+activityTypeInt === 21 && +activitySubTypeInt === 1) {
    //jms consumer
    src = JMSConsumerLogo;
    classForActivity = "EventActivityCard";
    color = "#767676";
    backgroundColor = "#FFCE4434";
    activityTypeName = activityType_label.jmsConsumer_label;
    activityName = activityType.jmsConsumer;
  } else if (+activityTypeInt === 4 && +activitySubTypeInt === 1) {
    //timer event
    src = TimerEventLogo;
    classForActivity = "EventActivityCard";
    color = "#767676";
    backgroundColor = "#FFCE4434";
    activityTypeName = activityType_label.timerEvents_label;
    activityName = activityType.timerEvents;
  } else if (+activityTypeInt === 5 && +activitySubTypeInt === 1) {
    //inclusive distribute
    src = InclusiveGatewayLogo;
    classForActivity = "gatewayActivityCard";
    color = "#767676";
    backgroundColor = "#FFCE4434";
    activityTypeName = activityType_label.inclusiveDistribute_label;
    activityName = activityType.inclusiveDistribute;
  } else if (+activityTypeInt === 5 && +activitySubTypeInt === 2) {
    //parallel distribute
    src = ParallelGatewayLogo;
    classForActivity = "gatewayActivityCard";
    color = "#767676";
    backgroundColor = "#FFCE4434";
    activityTypeName = activityType_label.parallelDistribute_label;
    activityName = activityType.parallelDistribute;
  } else if (+activityTypeInt === 6 && +activitySubTypeInt === 1) {
    //inclusive collect
    src = InclusiveCollectIcon;
    classForActivity = "gatewayActivityCard";
    color = "#767676";
    backgroundColor = "#FFCE4434";
    activityTypeName = activityType_label.inclusiveCollect_label;
    activityName = activityType.inclusiveCollect;
  } else if (+activityTypeInt === 6 && +activitySubTypeInt === 2) {
    //parallel collect
    src = ParallelCollectIcon;
    classForActivity = "gatewayActivityCard";
    color = "#767676";
    backgroundColor = "#FFCE4434";
    activityTypeName = activityType_label.parallelCollect_label;
    activityName = activityType.parallelCollect;
  } else if (+activityTypeInt === 7 && +activitySubTypeInt === 1) {
    //data based exclusive
    src = ExclusiveGatewayLogo;
    classForActivity = "gatewayActivityCard";
    color = "#767676";
    backgroundColor = "#FFCE4434";
    activityTypeName = activityType_label.dataBasedExclusive_label;
    activityName = activityType.dataBasedExclusive;
  } else if (+activityTypeInt === 2 && +activitySubTypeInt === 1) {
    //end event
    src = EndEventLogo;
    classForActivity = "endActivityCard";
    color = "#D30814";
    backgroundColor = "#D3081419";
    activityTypeName = activityType_label.endEvent_label;
    activityName = activityType.endEvent;
  } else if (+activityTypeInt === 3 && +activitySubTypeInt === 1) {
    //terminate event
    src = TerminateLogo;
    classForActivity = "endActivityCard";
    color = "#D30814";
    backgroundColor = "#D3081419";
    activityTypeName = activityType_label.terminate_label;
    activityName = activityType.terminate;
  } else if (+activityTypeInt === 2 && +activitySubTypeInt === 2) {
    //message end
    src = MessageEndLogo;
    classForActivity = "endActivityCard";
    color = "#D30814";
    backgroundColor = "#D3081419";
    activityTypeName = activityType_label.messageEnd_label;
    activityName = activityType.messageEnd;
  } else if (+activityTypeInt === 34 && +activitySubTypeInt === 1) {
    //data exchange
    src = DataExchangeLogo;
    classForActivity = "artefactActivityCard";
    color = "#606060";
    backgroundColor = "#60606019";
    activityTypeName = activityType_label.dataExchange_label;
    activityName = activityType.dataExchange;
  } else {
    //default activity
    src = WorkdeskLogo;
    classForActivity = "workdeskActivityCard";
    color = "#1072C6";
    backgroundColor = "#1072C619";
    activityTypeName = activityType_label.workdesk_label;
    activityName = activityType.workdesk;
  }

  return [
    src,
    classForActivity,
    color,
    backgroundColor,
    activityTypeName,
    activityName,
  ];
}
