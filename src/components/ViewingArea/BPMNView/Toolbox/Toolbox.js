import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import "./Toolbox.css";
import ExpandIcon from "../../../../../src/assets/bpmnView/ExpandIcon.svg";
import CollapseIcon from "../../../../../src/assets/abstractView/Icons/Collapse.svg";
import Tool from "./Tool";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import ToolsList from "./ToolsList";
import { searchFunc_expanded } from "../../../../utility/bpmnView/searchFunction_expanded";
import { searchFunc_collapsed } from "../../../../utility/bpmnView/searchFunction_collapsed";
import {
  taskTemplates,
  startEvents,
  activities,
  intermediateEvents,
  gateway,
  endEvents,
  integrationPoints,
  artefacts,
  caseWorkdesk,
  sapAdapter,
  sharePoint,
} from "../../../../utility/bpmnView/toolboxIcon";
import searchIcon from "../../../../assets/bpmnView/toolbox/SearchToolbox.svg";
import { getCaseEnabledActivities } from "../../../../utility/ViewingArea/CaseEnabledActivities";
import { getSapEnabledActivities } from "../../../../utility/ViewingArea/SapEnabled";
import { store, useGlobalState } from "state-pool";
import { TaskType } from "../../../../Constants/appConstants";
import { TASK_TEMPLATES_HEAD, style } from "../../../../Constants/bpmnView";
import taskTemplateIcon from "../../../../assets/bpmnViewIcons/TaskTemplate.svg";
import { Divider, Grid, Typography } from "@material-ui/core";
import { AddPlusIcon } from "../../../../utility/AllImages/AllImages";
import CreateGlobalTaskTemplateModal from "../../../Properties/PropetiesTab/GlobalTaskTemplate/CreateGlobalTaskTemplateModal";
import { useDispatch, useSelector } from "react-redux";
import { showDrawer } from "../../../../redux-store/actions/Properties/showDrawerAction";
import {
  selectedTask,
  selectedTemplate,
} from "../../../../redux-store/actions/selectedCellActions";
import { getSelectedCellType } from "../../../../utility/abstarctView/getSelectedCellType";

let toolMap = new Map();
const useStyles = makeStyles({
  rootDivider: {
    width: "80%",
    backgroundColor: "#E9E9E9",
    marginLeft: "10%",
    marginRight: "10%",
  },

  rootList: {
    width: "100%",
    display: "flex",
  },
  rootListItem: {
    cursor: "pointer",
    padding: "0",
    justifyContent: "center !important",
    "&:hover": {
      backgroundColor: "#0072c60d",
    },
  },
  selectedListItem: {},
  listItemGutters: {
    paddingLeft: "2px",
    paddingRight: "2px",
  },
  rootToolListItemInExpandedView: {
    width: "100%",
    height: "28px",
    "& img": {
      width: "1.25rem",
      height: "1.25rem",
    },
  },
  rootListItemIcon: {
    width: "100% important",
    maxHeight: "22px",
  },

  listItemIconInExpandedView: {
    minWidth: "22px",
  },
  primaryListItemText: {
    fontSize: "12px",
    color: "#3A3A3A",
    fontFamily: "Open Sans",
    fontWeight: "400",
  },
  primaryListItemTextHeading: {
    fontSize: "14px",
    color: "#FF6600",
    fontFamily: "Open Sans",
    fontWeight: "600",
    marginLeft: "10px",
  },
  expandListItem: {
    position: "unset",
  },
  addIcon: {
    width: "1rem",
    height: "1rem",
    cursor: "pointer",
  },
  globalTaskheader: {
    fontSize: "0.625rem",
    color: "#606060",
  },
  importExport: {
    color: "#0072C6",
    fontWeight: 600,
    fontSize: "0.75rem",
  },
});
// useEffect(() => {
//   const updatedEnabledActivities = getSapEnabledActivities(false, [sapAdapter]);
//   let tempArr = [...toolTypeList];
//   tempArr[]
// }, [toolTypeList]);

function Toolbox(props) {
  let { expandedView, setExpandedView, caseEnabled, view } = props;
  const classes = useStyles();
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);

  const localActivityPropertyData = store.getState("activityPropertyData");
  const [
    localLoadedActivityPropertyData,
    setlocalLoadedActivityPropertyData,
    updatelocalLoadedActivityPropertyData,
  ] = useGlobalState(localActivityPropertyData);

  const globalTemplates = useSelector(
    (state) => state.globalTaskTemplate.globalTemplates
  );

  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] =
    useState(false);

  const handleCreateGlobalTemplate = () => {
    setIsCreateTemplateModalOpen(true);
  };

  const closeCreateGlobalTemplateModal = () => {
    setIsCreateTemplateModalOpen(false);
  };

  //render only after graph has been rendered ,
  //and mxGraph object has been created
  let display = true;
  let onClickHandler = (index) => {
    let section = document.getElementById(index);
    expandedView
      ? section.scrollIntoView({ behavior: "smooth", block: "start" })
      : console.log(index);
  };
  let toolboxContainer = useRef(null);
  let tool = useRef();

  //to display tool of particular type
  let [toolboxDisplay, setToolboxDisplay] = useState("1");
  let [tabIndex, setTabIndex] = useState(0);
  const [searchedVal, setSearchedVal] = useState("");
  //t is our translation function
  let toolTypeList = [];
  let updatedActivities;
  let updatedIntegrationPointActivities;
  // code edited on 29 July 2022 for BugId 113313 and BugId 113849
  let sharePointFlag = localLoadedProcessData?.SystemProperty
    ? localLoadedProcessData?.SystemProperty[0]?.SHAREPOINTFLAG === "N"
      ? false
      : true
    : false;
  if (
    // This condition runs when process is not case enabled and the user is in abstract view.
    caseEnabled === false &&
    view === "views.abstract"
  ) {
    updatedActivities = getCaseEnabledActivities(caseEnabled, [caseWorkdesk]);
    updatedIntegrationPointActivities = getSapEnabledActivities(
      localLoadedProcessData?.SAPRequired,
      [sapAdapter],
      sharePointFlag,
      [sharePoint]
    );

    toolTypeList = [
      startEvents,
      updatedActivities,
      intermediateEvents,
      gateway,
      updatedIntegrationPointActivities,
      endEvents,
    ];
  } else if (
    // This condition runs when process is not case enabled and the user is in Bpmn view.
    caseEnabled === false &&
    view === "views.bpmn"
  ) {
    updatedActivities = getCaseEnabledActivities(caseEnabled, [caseWorkdesk]);
    updatedIntegrationPointActivities = getSapEnabledActivities(
      localLoadedProcessData?.SAPRequired,
      [sapAdapter],
      sharePointFlag,
      [sharePoint]
    );
    toolTypeList = [
      startEvents,
      updatedActivities,
      intermediateEvents,
      gateway,
      updatedIntegrationPointActivities,
      endEvents,
      artefacts,
    ];
  } else if (
    // This condition runs when process is case enabled and the user is in Bpmn view.
    caseEnabled === true &&
    view === "views.bpmn"
  ) {
    updatedIntegrationPointActivities = getSapEnabledActivities(
      localLoadedProcessData?.SAPRequired,
      [sapAdapter],
      sharePointFlag,
      [sharePoint]
    );
    toolTypeList = [
      taskTemplates,
      startEvents,
      activities,
      intermediateEvents,
      gateway,
      updatedIntegrationPointActivities,
      endEvents,
      artefacts,
    ];
  } else if (
    // This condition runs when process is case enabled and the user is in Abstract view.
    caseEnabled === true &&
    view === "views.abstract"
  ) {
    updatedIntegrationPointActivities = getSapEnabledActivities(
      localLoadedProcessData?.SAPRequired,
      [sapAdapter],
      sharePointFlag,
      [sharePoint]
    );
    toolTypeList = [
      startEvents,
      activities,
      intermediateEvents,
      gateway,
      updatedIntegrationPointActivities,
      endEvents,
    ];
  }

  useEffect(() => {
    let currentToolBoxContainer = toolboxContainer.current;
    if (currentToolBoxContainer) {
      currentToolBoxContainer.addEventListener("mouseleave", hideToolContainer);
    }
    return () => {
      if (currentToolBoxContainer) {
        currentToolBoxContainer.removeEventListener(
          "mouseleave",
          hideToolContainer
        );
      }
    };
  }, []);

  useEffect(() => {
    setSearchedVal("");
    searchFunc_expanded("");
    searchFunc_collapsed("");
  }, [props.view]);

  let toggleExpandedView = () => {
    expandedView
      ? (document.querySelectorAll(".toolTabs")[0].style.backgroundColor = "")
      : (document.querySelectorAll(".toolTabs")[0].style.backgroundColor =
          "#0072C60D");
    setExpandedView(!expandedView);
  };

  let hideToolContainer = (evt) => {
    setToolboxDisplay(null);
  };

  let scrollhandler = () => {
    let searchBarFromTop = expandedView
      ? document.querySelector(".searchContainer").getBoundingClientRect().top
      : "0px";
    let ell = document.querySelectorAll(".MuiTypography-displayBlock");
    const ellToArray = Array.apply(null, ell);
    let tooltabs = document.querySelectorAll(".toolTabs");
    let oneToolList = document.querySelectorAll(".oneToolList");
    const oneToolListToArray = Array.apply(null, oneToolList);
    for (var i = 0; i < ellToArray.length; i++) {
      if (
        ellToArray[i].getBoundingClientRect().top - searchBarFromTop < 46 &&
        ellToArray[i].getBoundingClientRect().top -
          searchBarFromTop +
          oneToolListToArray[i].clientHeight -
          34 >
          0
      ) {
        setTabIndex(i);
        tooltabs[tabIndex].style.backgroundColor = "#0072C60D";
      } else if (
        ellToArray[0].getBoundingClientRect().top - searchBarFromTop ==
        53.5
      ) {
        tooltabs[0].style.backgroundColor = "#0072C60D";
      } else {
        tooltabs[i].style.backgroundColor = "";
      }
    }
  };

  let hideInputBoxAndActivityList = () => {
    setSearchedVal("");
    document.getElementById("userInput_collapsed").style.display = "none";
    document.getElementById("closeSearchBoxIcon").style.display = "none";
    document.querySelector("#toolTypeContainerExpanded").style.display = "none";
  };

  let showInputBox = () => {
    document.getElementById("userInput_collapsed").style.display = "block";
    document.getElementById("closeSearchBoxIcon").style.display = "block";
    document.getElementById("userInput_collapsed").focus();
  };

  let displayToolContainer = (evt, toolType, index) => {
    if (!toolMap.has(toolType.title) || expandedView === false) {
      toolMap.set(toolType.title, getToolContainer(evt, toolType, index));
    }
    setToolboxDisplay(toolType.title);
  };

  const handleGtClick = (gt) => {
    const newGtObj = { ...gt.globalTemplateDetails };

    const taskTemplateInfo = {
      m_arrTaskTemplateVarList: newGtObj.m_arrTaskTemplateVarList || [],
      m_bGlobalTemplate: newGtObj.m_bGlobalTemplate || false,
      m_bGlobalTemplateFormCreated:
        newGtObj.m_bGlobalTemplateFormCreated || false,
      m_bCustomFormAssoc: newGtObj.m_bCustomFormAssoc || false,
      m_strTemplateName: newGtObj.m_strTemplateName,
      m_iTemplateId: newGtObj.m_iTemplateId,
    };
    newGtObj["taskGenPropInfo"]["taskTemplateInfo"] = { ...taskTemplateInfo };

    setlocalLoadedActivityPropertyData({ ...newGtObj });

    dispatch(showDrawer(true));
    dispatch(
      selectedTemplate(
        newGtObj?.taskGenPropInfo?.taskTemplateInfo?.m_iTemplateId,
        newGtObj?.taskGenPropInfo?.taskTemplateInfo?.m_strTemplateName,
        TaskType.globalTask,
        getSelectedCellType("TASKTEMPLATE")
      )
    );
  };
  const getGtTools = () => {
    return globalTemplates
      ?.map((gt) => ({
        ...gt,
        icon: taskTemplateIcon,
        title: gt.m_strTemplateName,
        styleName: style.taskTemplate,
        activitySubType: TaskType.globalTask,
      }))
      .map((toolElem, subIndex) => ({
        globalTemplateDetails: { ...toolElem },
        tool: (
          <React.Fragment key={"gt." + subIndex}>
            <Tool
              graph={props.graph}
              title={t(toolElem.title)}
              desc={t(toolElem.description)}
              icon={toolElem.icon}
              styleGraph={toolElem.styleName}
              expandedView={expandedView}
              swimlaneLayer={props.swimlaneLayer}
              milestoneLayer={props.milestoneLayer}
              setProcessData={props.setProcessData}
              activityType={toolElem.activityTypeId}
              activitySubType={toolElem.activitySubTypeId}
              setNewId={props.setNewId}
              caseEnabled={caseEnabled}
            />
          </React.Fragment>
        ),
        label: (
          <React.Fragment key={"." + subIndex}>
            <ListItemText
              primary={t(toolElem.title)}
              classes={{ primary: classes.primaryListItemText }}
            />
          </React.Fragment>
        ),
      }));
  };
  let getToolContainer = (evt, toolType, index) => {
    let tools;
    //tools is an array of object
    tools = toolType.tools?.map((toolElem, subIndex) => ({
      tool: (
        <React.Fragment key={index + "." + subIndex}>
          <Tool
            graph={props.graph}
            title={t(toolElem.title)}
            desc={t(toolElem.description)}
            icon={toolElem.icon}
            styleGraph={toolElem.styleName}
            expandedView={expandedView}
            swimlaneLayer={props.swimlaneLayer}
            milestoneLayer={props.milestoneLayer}
            setProcessData={props.setProcessData}
            activityType={toolElem.activityTypeId}
            activitySubType={toolElem.activitySubTypeId}
            setNewId={props.setNewId}
            caseEnabled={caseEnabled}
          />
        </React.Fragment>
      ),
      label: (
        <React.Fragment key={index + "." + subIndex}>
          <ListItemText
            primary={t(toolElem.title)}
            classes={{ primary: classes.primaryListItemText }}
          />
        </React.Fragment>
      ),
    }));

    //set position of toolContainer
    let rect = evt.currentTarget.getBoundingClientRect();
    let top =
      rect.top -
      (toolboxContainer.current
        ? toolboxContainer.current.getBoundingClientRect().top
        : 0);

    //wraps the array using toolContainer wrapper div
    let toolsDiv = (
      <div
        className="toolContainer"
        ref={tool}
        style={{
          top: top + 60 + "px",
        }}
      >
        {/* only tool ,  not label */}
        {tools &&
          tools.map((eachTool, index1) => (
            <React.Fragment key={index1 + "-" + toolType.tools[index1].title}>
              <div>{eachTool.tool}</div>
              {toolType.title === TASK_TEMPLATES_HEAD && index1 === 1 ? (
                <React.Fragment>
                  <Divider
                    variant="fullWidth"
                    style={{ marginTop: ".5rem", height: "2px" }}
                  />
                  <div style={{ padding: ".525rem" }}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item container>
                        <Grid item>
                          <Typography className={classes.globalTaskheader}>
                            {`${t("global")} ${t("task")} ${t("templates")}`}
                          </Typography>
                        </Grid>
                        <Grid item style={{ marginLeft: "auto" }}>
                          <AddPlusIcon
                            className={classes.addIcon}
                            onClick={() => handleCreateGlobalTemplate()}
                          />
                        </Grid>
                      </Grid>
                      {getGtTools().map((gt) => (
                        <div
                          key={gt.titlel}
                          onDoubleClick={() => handleGtClick(gt)}
                        >
                          {gt.tool}
                        </div>
                      ))}
                      <Grid item>
                        <Typography className={classes.importExport}>
                          {`${t("import")}/${t("export")} ${t("global")} ${t(
                            "task"
                          )} ${t("Template")}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                </React.Fragment>
              ) : null}
            </React.Fragment>
          ))}
      </div>
    );

    return { toolsDiv, tools };
  };

  let toolTypeContainer = (
    <div className="toolTypeContainer">
      <List
        className="collapsedList"
        classes={{ root: classes.rootList }}
        style={{ paddingTop: expandedView ? "1rem" : "0rem" }}
      >
        {!expandedView ? (
          <div className="toolBoxIconDiv">
            <ListItem
              classes={{
                root: classes.rootListItem,
                gutters: null,
              }}
            >
              <ListItemIcon>
                <div
                  id="searchActivity_abstractView"
                  className={`toolTabs ${
                    expandedView ? "" : "onHoverTabStyle"
                  }`}
                  style={{
                    width: "8vw",
                    cursor: "pointer",
                  }}
                >
                  <img
                    onClick={() => showInputBox()}
                    className={classes.rootListItemIcon}
                    src={searchIcon}
                    style={{
                      height: "2.5rem",
                      width: "2.5rem",
                      maxHeight: "2.5rem",
                    }}
                    alt={t("toolbox.search")}
                    id="searchActivityIcon_abstractView"
                  />
                  <span className="iconLabel"></span>
                </div>
              </ListItemIcon>
            </ListItem>
          </div>
        ) : null}

        {toolTypeList?.map((element, index) => (
          <div id={index}>
            <ListItem
              classes={{
                root: classes.rootListItem,
                gutters: null,
              }}
              onMouseEnter={(event) =>
                displayToolContainer(event, element, index)
              }
              // onMouseLeave={(e) => hideToolContainer(e)}
            >
              <ListItemIcon style={{ justifyContent: "center" }}>
                <div
                  className={`toolTabs ${
                    expandedView ? "" : "onHoverTabStyle"
                  }`}
                  onClick={() => onClickHandler(index)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "6vw",
                    cursor: "pointer",
                  }}
                >
                  <img
                    className={classes.rootListItemIcon}
                    src={element.icon}
                    alt={t(element.title)}
                  />
                  <span className="iconLabel">{t(element.title)}</span>
                </div>
              </ListItemIcon>
            </ListItem>
          </div>
        ))}

        <ListItem
          onClick={toggleExpandedView}
          classes={{
            root: classes.expandListItem,
            selected: classes.selectedListItem,
            gutters: expandedView ? classes.listItemGutters : null,
          }}
        >
          <ListItemIcon>
            <img
              style={{
                position: "absolute",
                top: expandedView ? "36.5rem" : "40rem",
                left: expandedView ? "18.5vw" : "5.2vw",
                height: "2rem",
                width: "2rem",
                cursor: "pointer",
                zIndex: "6",
              }}
              src={expandedView ? CollapseIcon : ExpandIcon}
              alt={t("toolbox.expand")}
            />
          </ListItemIcon>
        </ListItem>
      </List>
      {!expandedView ? (
        <div>
          <input
            autoComplete="off"
            onKeyUp={() => searchFunc_collapsed(searchedVal)}
            value={searchedVal}
            onChange={(e) => {
              setSearchedVal(e.target.value);
            }}
            id="userInput_collapsed"
            type="text"
            style={{
              padding: "0px 0.25rem",
            }}
          />
          <CloseIcon
            onClick={() => hideInputBoxAndActivityList()}
            id="closeSearchBoxIcon"
          />
        </div>
      ) : null}

      <ToolsList
        style={{
          overflowY: "auto",
          maxHeight: "75vh",
          height: expandedView ? "75vh" : "auto",
          marginTop: expandedView ? "118px" : "114px",
          display: expandedView ? "block" : "none",
        }}
        view={props.view}
        toolTypeList={toolTypeList}
        scrollHandler={() => scrollhandler()}
        subActivities="subActivities"
        oneToolList="oneToolList"
        mainMenu="mainMenu"
        expandedList="expandedList"
        toolContainer="toolContainer"
        toolTypeContainerExpanded="toolTypeContainerExpanded"
        expandedView={expandedView}
        setNewId={props.setNewId}
        setProcessData={props.setProcessData}
        toolboxDisplay={toolboxDisplay}
        graph={props.graph}
        searchedVal={searchedVal}
        setSearchedVal={setSearchedVal}
        caseEnabled={caseEnabled}
      />
    </div>
  );

  return (
    <div ref={toolboxContainer} style={props.style}>
      {display === true ? (
        <React.Fragment>
          {expandedView ? (
            <div
              className="searchContainer"
              style={{
                height: "40px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #C4C4C4",
                width: "19.3vw",
                padding: "0.25rem",
              }}
            >
              <div
                style={{
                  border: "1px solid #C4C4C4",
                  height: "2.7rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  onKeyUp={() => searchFunc_expanded(searchedVal)}
                  value={searchedVal}
                  onChange={(e) => {
                    setSearchedVal(e.target.value);
                  }}
                  id="userInput_expanded"
                  autoComplete="off"
                  type="text"
                  placeholder="Search"
                  autoFocus
                  style={{
                    color: "black",
                    border: "none",
                    padding: "0px 0.25rem",
                    outline: "none",
                    width: "100%",
                  }}
                />
                <SearchIcon style={{ height: "17px", width: "17px" }} />
              </div>
            </div>
          ) : (
            ""
          )}
          {toolTypeContainer}
          {toolboxDisplay !== null &&
          toolMap.has(toolboxDisplay) &&
          expandedView === false
            ? toolMap.get(toolboxDisplay).toolsDiv
            : null}
        </React.Fragment>
      ) : null}

      {isCreateTemplateModalOpen && (
        <CreateGlobalTaskTemplateModal
          isOpen={isCreateTemplateModalOpen}
          handleClose={closeCreateGlobalTemplateModal}
          globalTemplates={globalTemplates}
        />
      )}
    </div>
  );
}

export default Toolbox;
