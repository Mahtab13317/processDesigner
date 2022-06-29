export const view = {
  abstract: {
    defaultWord: "Abstract View",
    langKey: "views.abstract",
  },
  bpmn: {
    defaultWord: "BPMN View",
    langKey: "views.bpmn",
  },
};

export const messageType = {
  default: {
    icon: null,
    defaultWord: "Message",
    langKey: "messageType.default",
  },
  errorMessage: {
    icon: null,
    defaultWord: "Error!",
    langKey: "messageType.errorMessage",
  },
};

export const TaskType = {
  globalTask: "Generic",
  processTask: "ProcessTask",
};

export const taskType_label = {
  newTask_label: "toolbox.taskTemplates.newTask",
  processTask_label: "toolbox.taskTemplates.processTask",
};

export const activityType = {
  startEvent: "StartEvent",
  conditionalStart: "ConditionalStart",
  timerStart: "TimerStart",
  messageStart: "MessageStart",
  subProcess: "EmbeddedSubprocess",
  callActivity: "CallActivity",
  workdesk: "Workdesk",
  robotWorkdesk: "RobotWorkDesk",
  caseWorkdesk: "CaseWorkdesk",
  email: "Email",
  export: "Export",
  query: "Query",
  omsAdapter: "OMSAdapter",
  webService: "Webservice",
  responseConsumerJMS: "Response Consumer JMS",
  responseConsumerSOAP: "Repsonse Consumer SOAP",
  requestConsumerSOAP: "Request Consumer SOAP",
  restful: "RestFul",
  businessRule: "BusinessRule",
  dmsAdapter: "DMSAdapter",
  sharePoint: "SharePoint",
  sapAdapter: "SAPAdapter",
  event: "Event",
  jmsProducer: "JMSProducer",
  jmsConsumer: "JMSConsumer",
  timerEvents: "TimerEvent",
  inclusiveDistribute: "InclusiveDistribute",
  parallelDistribute: "ParallelDistribute",
  inclusiveCollect: "InclusiveCollect",
  parallelCollect: "ParallelCollect",
  dataBasedExclusive: "DataBasedExclusive",
  endEvent: "EndEvent",
  terminate: "TerminateEvent",
  messageEnd: "MessageEnd",
  dataExchange: "DataExchange",
  receive: "Receive",
  reply: "Reply",
  textAnnotations: "TextAnnotations",
  groupBox: "GroupBox",
  dataObject: "DataObject",
  message: "Message",
};

//labels for each type of activity
export const activityType_label = {
  startEvent_label: "toolbox.startEvents.startEvent",
  conditionalStart_label: "toolbox.startEvents.conditionalStart",
  messageStart_label: "toolbox.startEvents.messageStart",
  timerStart_label: "toolbox.startEvents.timerStart",
  subProcess_label: "toolbox.activities.subProcess",
  callActivity_label: "toolbox.activities.callActivity",
  workdesk_label: "toolbox.activities.workdesk",
  robotWorkdesk_label: "toolbox.activities.robotWorkdesk",
  caseWorkdesk_label: "toolbox.activities.caseWorkdesk",
  email_label: "toolbox.activities.email",
  export_label: "toolbox.activities.export",
  query_label: "toolbox.activities.query",
  sapAdapter_label: "toolbox.activities.sapAdapter",
  webService_label: "toolbox.activities.webService",
  responseConsumerJMS_label: "toolbox.activities.responseJMS",
  responseConsumerSOAP_label: "toolbox.activities.responseSOAP",
  requestConsumerSOAP_label: "toolbox.activities.requestSOAP",
  restful_label: "toolbox.activities.restful",
  businessRule_label: "toolbox.activities.businessRule",
  dmsAdapter_label: "toolbox.activities.dmsAdapter",
  sharePoint_label: "toolbox.activities.sharePoint",
  ccm_label: "toolbox.activities.ccm",
  receive_label: "toolbox.activities.receive",
  reply_label: "toolbox.activities.reply",
  event_label: "toolbox.intermediateEvents.event",
  jmsProducer_label: "toolbox.intermediateEvents.jmsProducer",
  jmsConsumer_label: "toolbox.intermediateEvents.jmsConsumer",
  timerEvents_label: "toolbox.intermediateEvents.timerEvents",
  inclusiveDistribute_label: "toolbox.gateway.inclusiveDistribute",
  inclusiveCollect_label: "toolbox.gateway.inclusiveCollect",
  parallelDistribute_label: "toolbox.gateway.parallelDistribute",
  parallelCollect_label: "toolbox.gateway.parallelCollect",
  dataBasedExclusive_label: "toolbox.gateway.dataBasedExclusive",
  endEvent_label: "toolbox.endEvents.endEvent",
  terminate_label: "toolbox.endEvents.terminate",
  messageEnd_label: "toolbox.endEvents.messageEnd",
  dataExchange_label: "toolbox.integrationPoints.dataExchange",
  textAnnotations_label: "toolbox.artefacts.textAnnotations",
  groupBox_label: "toolbox.artefacts.groupBox",
  dataObject_label: "toolbox.artefacts.dataObject",
  message_label: "toolbox.artefacts.message",
};

// Steps value added for steps in queue variable table mapping.
export const TABLE_STEP = 0;
export const MAPPING_STEP = 1;
export const RELATIONSHIP_STEP = 2;

// Maximum default feature id for process features.
export const MAX_AVAILABLE_FEATURES_ID = 12;

// Rtl direction constant for right to left modification.
export const RTL_DIRECTION = "rtl";

//constant for state of activity when it is dragged and dropped in expanded state
export const expandedViewOnDrop = true;

//constant for Local Process
export const PROCESSTYPE_LOCAL = "L";
export const PROCESSTYPE_DEPLOYED = "D";
export const PROCESSTYPE_REGISTERED = "R";

export const PROCESS_CHECKOUT = "Y";
export const PROCESS_NO_CHECKOUT = "N";

export const CONSTANT = "<constant>";
export const WORD_LIMIT_DESC = 25;
export const APP_HEADER_HEIGHT = "48px";

export const PMWEB = "PMWEB";
export const BASE_URL = window.ConfigsLocal.backend_base_URL_FormBuilder;
export const SERVER_URL = window.ConfigsLocal.backend_base_URL_PMWEB;
export const SERVER_URL_LAUNCHPAD =
  window.ConfigsLocal.backend_base_URL_Launchpad;

//brt url
export const ENDPOINT_GET_RULE_MEMBER_LIST = "/getRuleMemberList";
export const ENDPOINT_REST_PACKAGE = "/ruleFlowAndRulePackageList";
export const ENDPOINT_SOAP_PACKAGE = "/ruleFlowAndRulePackageList";
export const ENDPOINT_RULE_FLOW_VERSION = "/ruleFlowVersionList";
export const ENDPOINT_RULE_PACKAGE_VERSION = "/ruleSetVersionList";

//sharepoint archive url
export const ENDPOINT_GET_LIBRARY_LIST = "/libraryProperty/";

export const ENDPOINT_GETREGISTRATIONPROPERTY = "/registrationProperty";
export const PMWEB_CONTEXT = "/pmweb";
export const LAUNCHPAD_CONTEXT = "/launchpad";
export const ENDPOINT_GETPROJECTLIST = "/getprojectList/B";
export const ENDPOINT_PROCESSLIST = "/getprocesslist";
export const ENDPOINT_ADDMILE = "/addMilestone";
export const ENDPOINT_REMOVELANE = "/removeLane";
export const ENDPOINT_ADDLANE = "/addLane";
export const ENDPOINT_REMOVEMILE = "/removeMilestone";
export const ENDPOINT_MOVEMILE = "/moveMilestone";
export const ENDPOINT_RENAMEMILE = "/renameMilestone";
export const ENDPOINT_RENAMELANE = "/renameLane";
export const ENDPOINT_ADDTASK = "/addTask";
export const ENDPOINT_DEASSOCIATETASK = "/deassociateTask";
export const ENDPOINT_ASSOCIATETASK = "/associateTask";
export const ENDPOINT_GET_PROCESS_FEATURES = "/featureData";
export const ENDPOINT_REMOVEACTIVITY = "/removeAct";
export const ENDPOINT_REMOVETASK = "/removeTask";
export const ENDPOINT_RENAMEACTIVITY = "/renameAct";
export const ENDPOINT_INCLUDE_PROCESS_FEATURE = "/includeFeature";
export const ENDPOINT_EXCLUDE_PROCESS_FEATURE = "/excludeFeature";
export const ENDPOINT_ADDACTIVITY = "/addAct";
export const ENDPOINT_PASTEACTIVITY = "/pasteActivity";
export const ENDPOINT_CHANGEACTIVITY = "/changeActType";
export const ENDPOINT_EDIT_DOC = "/modifyDocType";
export const ENDPOINT_ADD_EXCEPTION = "/addException";
export const ENDPOINT_ADD_GROUP = "/addGroup";
export const ENDPOINT_DELETE_EXCEPTION = "/removeException";
export const ENDPOINT_DELETE_GROUP = "/removeGroup";
export const ENDPOINT_DELETE_TODO = "/removeTodo";
export const ENDPOINT_ADD_TODO = "/addTodo";
export const ENDPOINT_MODIFY_EXCEPTION = "/modifyException";
export const ENDPOINT_MODIFY_TODO = "/modifyTodo";
export const ENDPOINT_MOVETO_OTHERGROUP = "/moveInterface";
export const ENDPOINT_RESIZEMILE = "/resizeMilestone";
export const ENDPOINT_GETTRIGGER = "/trigger";
export const ENDPOINT_ADDTRIGGER = "/addTrigger";
export const ENDPOINT_REMOVETRIGGER = "/removeTrigger";
export const ENDPOINT_MODIFYTRIGGER = "/modifyTrigger";
export const ENDPOINT_GET_CONSTANTS = "/fetchConstant";
export const ENDPOINT_ADD_CONSTANT = "/addConstant";
export const ENDPOINT_MODIFY_CONSTANT = "/modifyConstant";
export const ENDPOINT_REMOVE_CONSTANT = "/removeConstant";
export const ENDPOINT_ADD_PROJECT = "/addProject";
export const ENDPOINT_ADD_CATEGORY = "/addCategory";
export const ENDPOINT_ADD_TEMPLATE = "/addTemplate";
export const ENDPOINT_OPENTEMPLATE = "/openTemplate";
export const ENDPOINT_FETCH_TEMPLATE = "/fetchTemplate/-1";
export const ENDPOINT_ADD_PROCESS = "/addProcess";
export const ENDPOINT_FETCHRECENTS = "/recentlist";
export const ENDPOINT_FETCHSYSTEMREQUIREMENTS = "/systemRequirement";
export const ENDPOINT_FETCHPROCESSREQUIREMENTS = "/processRequirement";
export const ENDPOINT_FETCHPROJECTREQUIREMENTS = "/projectRequirement";
export const ENDPOINT_DEFAULTQUEUE = "/defaultQueue";
export const ENDPOINT_DELETE_CATEGORY = "/removeCategory";
export const ENDPOINT_DELETE_TEMPLATE = "/deleteTemplate";
export const ENDPOINT_EDIT_CATEGORY = "/modifyCategory";
export const ENDPOINT_GET_ACTIVITY_PROPERTY = "/activityProperty/";
export const ENDPOINT_FETCH_ALL_TEMPLATES = "/fetchTemplate/-1";
export const ENDPOINT_FETCH_CATEGORIES = "/fetchCategory";
export const ENDPOINT_ADD_CONNECTION = "/addConnection";
export const ENDPOINT_DELETE_CONNECTION = "/removeConnection";
export const ENDPOINT_MOVE_CONNECTION = "/moveConnection";
export const ENDPOINT_OPENPROCESS = "/openprocess/";
export const ENDPOINT_MOVE_PINNED_TILES = "/move";
export const ENDPOINT_ADD_RULES = "/addInterfaceRule"; // Will not be used after common saving changes are done.
export const ENDPOINT_MODIFY_RULES = "/modifyInterfaceRule"; // Will not be used after common saving changes are done.
export const ENDPOINT_DELETE_RULES = "/deleteInterfaceRule"; // Will not be used after common saving changes are done.
export const ENDPOINT_ADDSYSTEMREQUIREMENTS = "/addSystemRequirement";
export const ENDPOINT_ADDPROJECTREQUIREMENTS ='/addProjectRequirement';
export const ENDPOINT_ADDPROCESSREQUIREMENTS = "/addProcessRequirement";
export const ENDPOINT_SAVE_MAJOR = "/saveMajor";
export const ENDPOINT_GET_GLOBALTASKTEMPLATES = "/globalTemplate";
export const ENDPOINT_GET_EXPORTTEMPLATES = "/exportTaskTemplate";
export const ENDPOINT_SAVE_MINOR = "/saveMinor";
export const ENDPOINT_CHECKOUT = "/checkOutProcess";
export const ENDPOINT_CHECKIN = "/checkInProcess";
export const ENDPOINT_UNDO_CHECKOUT = "/undoCheckOutProcess";
export const ENDPOINT_SAVE_LOCAL = "/saveLocal";
export const ENDPOINT_ADD_RULE = "/addRule";
export const ENDPOINT_DELETE_RULE = "/deleteRule";
export const ENDPOINT_MODIFY_RULE = "/modifyRule";
export const ENDPOINT_GET_REGISTERED_FUNCTIONS = "/registeredFunc";
export const ENDPOINT_DELETE_PROCESS = "/deleteprocess";
export const ENDPOINT_DELETE_PROCESS_DEPLOYED = "/unregisterProcess";
export const ENDPOINT_DELETESYSTEMREQUIREMENTS = "/removeSystemRequirement";
export const ENDPOINT_DELETEPROJECTREQUIREMENTS = "/removeProjectRequirement";
export const ENDPOINT_DELETEPROCESSREQUIREMENTS = "/removeProcessRequirement";
export const ENDPOINT_EDITSYSTEMREQUIREMENTS = "/modifySystemRequirement";
export const ENDPOINT_EDITPROCESSREQUIREMENTS = "/modifyProcessRequirement";
export const ENDPOINT_EDITPROJECTREQUIREMENTS = "/modifyProjectRequirement";
export const ENDPOINT_REGISTER_PROCESS = "/requirement";
export const ENDPOINT_READXML = "/readXML";
export const ENDPOINT_MODIFY_CONNECTION = "/modifyConnection";
export const ENDPOINT_GET_COMPLEX = "/complexTypeData";
export const ENDPOINT_ADD_COMPLEX = "/addComplex";
export const ENDPOINT_EDIT_COMPLEX = "/modifyComplex";
export const ENDPOINT_DELETE_COMPLEX = "/removeComplex";
export const ENDPOINT_GET_EXTERNAL_METHODS = "/registeredFunc";
export const ENDPOINT_ADD_EXTERNAL_METHODS = "/addRegisterFunc";
export const ENDPOINT_DELETE_EXTERNAL_METHODS = "/deleteRegisterFunc";
export const ENDPOINT_MODIFY_EXTERNAL_METHODS = "/modifyRegisterFunc";
export const ENDPOINT_RESIZELANE = "/resizeLane";
export const ENDPOINT_VALIDATEPROCESS = "/validateProcess";
export const ENDPOINT_DEPLOYPROCESS = "/deploy";
export const ENDPOINT_REGISTERPROCESS = "/registration";
export const ENDPOINT_ADD_USER_DEFINE_VARIABLE = "/addNewColumn";
export const ENDPOINT_DELETE_USER_DEFINE_VARIABLE = "/removeColumn";
export const ENDPOINT_MODIFY_USER_DEFINE_VARIABLE = "/modifyColumn";
export const ARCHIEVE_CONNECT = "/connect";
export const SAVE_ARCHIVE = "/saveArchive";
export const ENDPOINT_GETALLVERSIONS = "/allVersion";
export const ENDPOINT_GET_COLUMN_LIST = "/columnList";
export const ENDPOINT_MOVEACTIVITY = "/moveAct";
export const ENDPOINT_MOVETASK = "/moveTask";
export const ENDPOINT_UPDATE_ACTIVITY = "/updateActivity";
export const ENDPOINT_RENAMETASK = "/renameTask";

export const ENDPOINT_PROJECT_PROPERTIES = "/updateProjectProperty";
export const ENDPOINT_GET_PROJECT_PROPERTIES = "/projectProperty";
export const ENDPOINT_PROCESS_REPORT = "/processReport";

export const ENDPOINT_SEARCHJMSCONSUMER = "/search";
export const ENDPOINT_UPDATEJMSCONSUMER = "/update";
export const ENDPOINT_PROCESSVARIABLEJMSCONSUMER = "/processVariable";
export const ENDPOINT_DESTINATIONJMSCONSUMER = "/destinationName";

export const ENDPOINT_RESETINVOCATION = "/resetinvocation";
export const ENDPOINT_SETREPLYWORKSTEP = "/setreplyworkstep";

export const ENDPOINT_PROCESS_PROPERTIES = "/processProperty";
export const ENDPOINT_UPDATE_PROCESS_PROPERTIES = "/updateProcessProperty";

export const ENDPOINT_GET_CABINET = "/cabinetOMS";
export const ENDPOINT_CONNECT_CABINET = "/connectOMS";
export const ENDPOINT_DISCONNECT_CABINET = "/disConnectOMS";
export const ENDPOINT_GET_CABINET_TEMPLATE = "/template";
export const ENDPOINT_MAP_TEMPLATE = "/templateMapping";
export const ENDPOINT_DOWNLOAD_ASSOCIATED_TEMPLATE = "/previewTemplate/";

export const ENDPOINT_SAVEPROPERTY = "/saveActProperty";
export const ENDPOINT_GET_WEBSERVICE = "/globalCatalogMethods/";
export const ENDPOINT_FETCH_DETAILS = "/wsDetail";
export const ENDPOINT_SAVE_WEBSERVICE = "/saveCatalogMethod";
export const ENDPOINT_SAVE_REST_WEBSERVICE = "/saveCatalogRestMethod";
export const ENDPOINT_PROCESS_ASSOCIATION = "/validateObject";
export const ENDPOINT_ADD_INTERFACE_RULE = "/addInterfaceRule";
export const ENDPOINT_MODIFY_INTERFACE_RULE = "/modifyInterfaceRule";
export const ENDPOINT_DELETE_INTERFACE_RULE = "/deleteInterfaceRule";
export const ENDPOINT_GET_FORM_RULE = "/formRule";

export const ENDPOINT_GETPROJECTLIST_DRAFTS = "/getprojectList/L";
export const ENDPOINT_GETPROJECTLIST_DEPLOYED = "/getprojectList/R";
export const ENDPOINT_GET_ALLPROCESSLIST = "/getprocesslist/B/-1";
export const ENDPOINT_GET_ALLDRAFTPROCESSLIST = "/getprocesslist/L/-1";
export const ENDPOINT_GET_ALLDEPLOYEDPROCESSLIST = "/getprocesslist/R/-1";
export const ENDPOINT_GET_REGISTER_TEMPLATE = "/registerTemplate";
export const ENDPOINT_GET_EXISTING_TABLES = "/tableList";
export const ENDPOINT_GET_COLUMNS = "/columnList";

export const ENDPOINT_UPLOAD_ATTACHMENT = "/attachDoc";
export const ENDPOINT_DOWNLOAD_ATTACHMENT = "/downloadDoc";
export const CONFIG = "/config";

export const ENDPOINT_GET_REGISTER_TRIGGER = "/registerTrigger";

export const ENDPOINT_POST_REGISTER_WINDOW = "/registerWindow";

export const ENDPOINT_GET_FORMASSOCIATIONS = "/formAssociations";

export const FILETYPE_ZIP = "application/x-zip-compressed";
export const FILETYPE_DOC = "application/msword";
export const FILETYPE_XLS = "application/xls";
export const FILETYPE_DOCX = "application/docx";
export const FILETYPE_PNG = "image/png";
export const FILETYPE_JPEG = "image/jpeg";
export const FILETYPE_PDF = "application/pdf";
export const ASSOCIATE_DATACLASS_MAPPING = "/dataDefinitionProperty";
export const FOLDERNAME_ARCHIEVE = "/saveFolderName";
export const TEMPLATE_LIST_VIEW = "list";
export const TEMPLATE_GRID_VIEW = "grid";
export const UD_GRAPH_VIEW = "graph";
export const UD_LIST_VIEW = "list";

export const SYSTEM_DEFINED_SCOPE = "S";
export const USER_DEFINED_SCOPE = "E";
export const GLOBAL_SCOPE = "G";
export const LOCAL_SCOPE = "L";
export const TEMPLATE_VARIANT_TYPE = "T";

export const BTN_TYPE_ADD_ANOTHER = 1;
export const BTN_TYPE_ADD_CLOSE = 2;
export const BTN_TYPE_EDIT_CLOSE = 3;

export const BTN_SHOW = "show";
export const BTN_HIDE = "hide";

export const PREVIOUS_PAGE_LIST = 1;
export const PREVIOUS_PAGE_GRID = 2;
export const PREVIOUS_PAGE_CREATE_FROM_TEMPLATE = 3;
export const PREVIOUS_PAGE_CREATE_FROM_PROCESS = 4;
export const PREVIOUS_PAGE_CREATE_FROM_NO_PROCESS = 5;
export const PREVIOUS_PAGE_NO_PROCESS = 6;
export const PREVIOUS_PAGE_PROCESS = 7;
export const PREVIOUS_PAGE_CREATE_FROM_PROCESSES = 8;

export const NO_CREATE_PROCESS_FLAG = 0;
export const CREATE_PROCESS_FLAG_FROM_PROCESS = 1;
export const CREATE_PROCESS_FLAG_FROM_PROCESSES = 2;
export const CHECKIN_PROCESS = "CheckIn";
export const CHECKOUT_PROCESS = "CheckOut";
export const UNDOCHECKOUT_PROCESS = "undoCheckOut";

export const OPTION_PRIMARY = 0;
export const OPTION_USER_DEFINED = 1;
export const OPTION_SYSTEM_DEFINED = 2;

export const REGISTRATION_NO = 14;
export const SEQUENCE_NO = 1;

export const MENUOPTION_SAVE_NEW_V = 1;
export const MENUOPTION_SAVE_TEMPLATE = 2;
export const MENUOPTION_SAVE_LOCAL = 3;
export const MENUOPTION_CHECKIN = 4;
export const MENUOPTION_UNDOCHECKOUT = 5;
export const MENUOPTION_CHECKOUT = 6;
export const MENUOPTION_DELETE = 7;
export const MENUOPTION_DISABLE = 8;
export const MENUOPTION_ENABLE = 9;
export const MENUOPTION_DEPLOY = 10;
export const MENUOPTION_PIN = 11;
export const MENUOPTION_UNPIN = 12;
export const MENUOPTION_IMPORT = 13;
export const MENUOPTION_EXPORT = 14;

export const VERSION_TYPE_MINOR = "minor";
export const VERSION_TYPE_MAJOR = "major";

export const SCREENTYPE_TODO = "ToDo";
export const SCREENTYPE_EXCEPTION = "exp";
export const SCREENTYPE_DOCTYPE = "docType";
export const BLANK_DROPDOWN = "3";

export const RECENT_TABLE_CATEGORY = [
  "currentWeek",
  "previousWeek",
  "thisMonth",
  "earlierMonth",
];

export const BATCH_COUNT = 6;

export const ADD = "ADD";
export const EDIT = "EDIT";
export const DELETE = "DEL";
export const LEVEL1 = "LEVEL1";
export const LEVEL2 = "LEVEL2";
export const LEVEL3 = "LEVEL3";
export const JMSProducerServers = ["JBossEAP", "JTS", "WebLogic", "WebSphere"];
export const VARIABLE_TYPE_OPTIONS = [
  "10",
  "6",
  "3",
  "4",
  "8",
  "12",
  "15",
  "16",
  "17",
  "18",
];

export const REQ_RES_TYPE_OPTIONS = [
  "10",
  "6",
  "3",
  "4",
  "8",
  "12",
  "15",
  "16",
  "17",
  "18",
  "11",
];

export const COMPLEX_VARTYPE = "11";

export const RETURN_TYPE_OPTIONS = [
  "10",
  "6",
  "3",
  "4",
  "8",
  "12",
  "15",
  "16",
  "17",
  "18",
  "0",
];

export const SCOPE_OPTIONS = ["H", "P", "M", "Q", "F"];

export const ENABLED_STATE = "Enabled";
export const DISABLED_STATE = "Disabled";
export const STATE_EDITED = "edited";
export const STATE_ADDED = "added";
export const STATE_CREATED = "created";

export const WEBSERVICESOAP = "WSRC";
export const WEBSERVICEREST = "REST";
export const RESCONSUMERJMS = "WSJMS";
export const RESCONSUMERSOAP = "RSCS";
export const REQUESTCONSUMERSOAP = "RQCS";

export const DEFAULT = "default";

export const EXPORT_DEFINED_TABLE_TYPE = "Defined";
export const EXPORT_EXISTING_TABLE_TYPE = "Existing";
export const EXPORT_DATA_MAPPING_TYPE = "Data";
export const EXPORT_DOCUMENT_MAPPING_TYPE = "Document";
export const EXPORT_PRIMARY_CONSTRAINT_TYPE = "Primary";
export const EXPORT_UNIQUE_CONSTRAINT_TYPE = "Unique";
export const EXPORT_CSV_FILE_TYPE = "1";
export const EXPORT_TEXT_FILE_TYPE = "2";
export const EXPORT_DAT_FILE_TYPE = "3";
export const EXPORT_RES_FILE_TYPE = "4";
export const EXPORT_FIXED_LENGTH_FIELD_TYPE = "1";
export const EXPORT_VARIABLE_LENGTH_FIELD_TYPE = "2";
export const EXPORT_DAILY_FILE_MOVE = "D";
export const EXPORT_WEEKLY_FILE_MOVE = "W";
export const EXPORT_MONTHLY_FILE_MOVE = "M";
export const ENDPOINT_GETAUDITLOG = "/auditTrail";
export const ADD_SYMBOL = "+";

export const SystemWSQueue = "SystemWSQueue";
export const SystemBRMSQueue = "SystemBRMSQueue";
export const SystemDXQueue = "SystemDXQueue";
export const SystemArchiveQueue = "SystemArchiveQueue";
export const SystemPFEQueue = "SystemPFEQueue";
export const SystemSharepointQueue = "SystemSharepointQueue";
export const SystemSAPQueue = "SystemSAPQueue";

export const DATE_FORMAT = "DD/MM/YYYY";
export const TIME_FORMAT = "h:mm A";
export const SEVEN = "7";
export const FIFTEEN = "15";
export const THIRTY = "30";

export const RULES_IF_CONDITION = "If";
export const RULES_ALWAYS_CONDITION = "Always";
export const RULES_OTHERWISE_CONDITION = "Otherwise";
export const ADD_OPERATION_SYSTEM_FUNCTIONS = "System";
export const ADD_OPERATION_EXT_FUNCTIONS = "ext#ExtFunctions";
export const ADD_OPERATION_SECONDARY_DBFLAG = "SecondaryDBFlag";
export const ADD_CONDITION_NO_LOGICALOP_VALUE = "3";
export const SECONDARYDBFLAG = "SecondaryDBFlag";
export const SET_OPERATION_TYPE = "1";
export const INC_PRIORITY_OPERATION_TYPE = "8";
export const DEC_PRIORITY_OPERATION_TYPE = "9";
export const TRIGGER_OPERATION_TYPE = "15";
export const COMMIT_OPERATION_TYPE = "16";
export const ASSIGNED_TO_OPERATION_TYPE = "18";
export const SET_PARENT_DATA_OPERATION_TYPE = "19";
export const CALL_OPERATION_TYPE = "22";
export const SET_AND_EXECUTE_OPERATION_TYPE = "23";
export const ESCALATE_TO_OPERATION_TYPE = "24";
export const ESCALATE_WITH_TRIGGER_OPERATION_TYPE = "26";
export const ROUTE_TO_OPERATION_TYPE = "4";
export const REINITIATE_OPERATION_TYPE = "10";
export const ROLLBACK_OPERATION_TYPE = "17";
export const AUDIT_OPERATION_TYPE = "25";
export const DISTRIBUTE_TO_OPERATION_TYPE = "21";

export const STRING_VARIABLE_TYPE = 10;
export const BOOLEAN_VARIABLE_TYPE = 12;
export const DATE_VARIABLE_TYPE = 8;
export const INTEGER_VARIABLE_TYPE = 3;
export const FLOAT_VARIABLE_TYPE = 6;
export const LONG_VARIABLE_TYPE = 4;

export const INSERTION_ORDER_ID = "InsertionOrderId";
export const MAP_ID = "MapID";
export const CONSTRAINT_TYPE_PRIMARY = "Primary";
export const CONSTRAINT_TYPE_UNIQUE = "Unique";
export const VARDOC_LIST = "/varAndDocList";
export const ADD_OPTION = 0;
export const EDIT_OPTION = 1;

export const ENDPOINT_QUEUEASSOCIATION_GROUPLIST = "/groupList";
export const ENDPOINT_QUEUELIST = "/queueData";
export const ENDPOINT_QUEUEASSOCIATION_MODIFY = "/modifyQueueData";

export const ENDPOINT_SAP_FUNCTION = "/sapFunction";
export const ENDPOINT_REGISTER_SAP = "/registerSapDetails";
export const ENDPOINT_SAVE_FUNCTION_SAP = "/saveSapFunction";
export const ENDPOINT_SAP_DETAIL = "/sapDetail";
export const ENDPOINT_ADD_METHOD = "/methods/ADDREMPAU";

export const CONST_XML = "XML";
export const CONST_XPDI = "XPDI 2.2";
export const CONST_BPMN = "BPMN 2.0";
export const CONST_BPEL = "BPEL";

export const Y_FLAG = "Y";
export const N_FLAG = "N";
export const FORWARD_MAPPING = "F";
export const REVERSE_MAPPING = "R";
export const SPACE = " ";
export const EQUAL_TO = "=";
export const PERCENTAGE_SYMBOL = "%";

export const READ_RIGHT = "R";
export const MODIFY_RIGHT = "O";
export const OPTION_VALUE_1 = "1";
export const OPTION_VALUE_2 = "2";

export const SYNCHRONOUS = "S";
export const RULE_TYPE = "R";
export const ATTACHMENT_TYPE = "A";

export const propertiesLabel = {
  basicDetails: "BasicDetails",
  EntrySetting: "EntrySetting",
  requirements: "Requirements",
  attachments: "Attachments",
  templates: "templates",
  dataFields: "dataFields",
  initialRules: "initialRules",
  workdesk: "workdesk",
  registration: "registration",
  eventConfiguration: "eventConfiguration",
  fwdVarMapping: "fwdVarMapping",
  revVarMapping: "revVarMapping",
  streams: "streams",
  options: "options",
  throwEvents: "throwEvents",
  catchEvents: "catchEvents",
  task: "task",
  receive: "receive",
  outputVariables: "outputVariables",
  Export: "Export",
  searchVariables: "searchVariables",
  searchResults: "searchResults",
  webService: "webService",
  businessRule: "businessRule",
  archive: "archive",
  message: "message",
  entryDetails: "entryDetails",
  jmsProducer: "jmsProducer",
  jmsConsumer: "jmsConsumer",
  timer: "timer",
  reminder: "reminder",
  distribute: "distribute",
  routingCriteria: "routingCriteria",
  initiateWorkstep: "initiateWorkstep",
  dataExchange: "dataExchange",
  sap: "sap",
  resConJMS: "resConJMS",
  resConSOAP: "resConSOAP",
  reqConSOAP: "reqConSOAP",
  Restful: "Restful",
  fwdDocMapping: "fwdDocMapping",
  revDocMapping: "revDocMapping",
  collect: "collect",
  send: "send",
  taskDetails: "taskDetails",
  escalationRules: "escalationRules",
  taskOptions: "taskOptions",
  taskData: "taskData",
  sharePointArchive: "sharepoint_Archive",
};

export const WEBSERVICE_SOAP = "0";
export const WEBSERVICE_REST = "1";
export const WEBSERVICE_REST_MANUAL = "M";
export const WEBSERVICE_REST_LOAD = "L";

export const ERROR_MANDATORY = 0;
export const ERROR_MAX_LENGTH = 1;
export const ERROR_MIN_LENGTH = 2;
export const ERROR_RANGE = 3;
export const ERROR_INCORRECT_FORMAT = 4;
export const ERROR_INCORRECT_VALUE = 5;

export const NO_AUTH = "NoAuthentication";
export const BASIC_AUTH = "BasicAuthentication";
export const TOKEN_BASED_AUTH = "TokenBasedAuthentication";
export const DOMAIN_DROPDOWN = ["BPM", "ECM", "CCM", "BRMS", "SAP"];
export const OPERATION_DROPDOWN = ["GET", "PUT", "POST", "DELETE"];
export const AUTH_TYPE_DROPDOWN = [NO_AUTH, BASIC_AUTH, TOKEN_BASED_AUTH];
export const MEDIA_TYPE_DROPDOWN = ["X", "J", "P", "T", "N"];

export const TOKEN_TYPE_DROPDOWN = ["I", "O", "T"];

export const DEFINE_PARAM = 1;
export const DEFINE_REQUEST_BODY = 2;
export const DEFINE_RESPONSE_BODY = 3;
export const DEFINE_AUTH_DETAILS = 4;

export const DEFAULT_GLOBAL_ID = 0;
export const DEFAULT_GLOBAL_TYPE = "L";
export const DELETE_CONSTANT = "D";
export const ADD_CONSTANT = "I";
export const MODIFY_CONSTANT = "U";
export const mandatoryColumns = [
  "ExportDataId",
  "ProcessDefId",
  "ActivityId",
  "ProcessInstanceId",
  "WorkitemId",
  "EntryDateTime",
  "ExportedDateTime",
  "LockedByName",
  "LockedTime",
  "LockStatus",
  "Status",
  "ExportFileName",
  "ExportFileDateTime",
  "SequenceNumber",
];

export const ENDPOINT_GET_TASK_PROPERTY = "/taskProperty";
export const ENDPOINT_ADD_GLOBAL_TEMPLATE = "/addGlobalTemplate";
export const ENDPOINT_SAVE_TASK_PROPERTY = "/saveTaskProperty";
export const ENDPOINT_UPDATE_GLOBAL_TEMPLATE = "/updateGlobalTemplate";
export const ENDPOINT_DELETE_GLOBAL_TEMPLATE = "/deleteGlobalTemplate";
export const STATUS_TYPE_ADDED = "S";
export const STATUS_TYPE_TEMP = "T";
