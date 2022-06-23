import React from "react";
import { useTranslation } from "react-i18next";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import "./Toolbox.css";
import Tool from "./Tool";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";
import { searchFunc_expanded } from "../../../../utility/bpmnView/searchFunction_expanded";
let uniqueClass = [
  "_a11",
  "_b22",
  "_c33",
  "_d44",
  "_e55",
  "_f66",
  "_g77",
  "_h88",
];

const useStyles = makeStyles({
  rootList: {
    width: "100%",
    justifyContent: "space-around",
  },
  rootListItem: {
    marginTop: "2px",
    marginBottom: "2px",
    height: "30px",
  },
  rootToolListItemInExpandedView: {
    width: "100%",
    height: "28px",
    "& img": {
      width: "15px",
      height: "15px",
    },
  },
});

function ToolsList(props) {
  const classes = useStyles();
  let { t } = useTranslation();
  let toolMap = new Map();
  let toolTypeList = props.toolTypeList;
  for (let itr of toolTypeList) {
    if (!itr.show || itr.show != "0") {
      let tools =
        itr.tools &&
        itr.tools.map((toolElem) => ({
          tool: (
            <React.Fragment>
              <Tool
                showToolTip={props.showToolTip}
                expandedView={props.expandedView}
                graph={props.graph}
                title={t(toolElem.title)}
                icon={toolElem.icon}
                styleGraph={toolElem.styleName}
                swimlaneLayer={props.swimlaneLayer}
                milestoneLayer={props.milestoneLayer}
                setProcessData={props.setProcessData}
                activityType={toolElem.activityTypeId}
                activitySubType={toolElem.activitySubTypeId}
                setNewId={props.setNewId}
                view={props.view}
                searchedVal={props.searchedVal}
                caseEnabled={props.caseEnabled}
              />
            </React.Fragment>
          ),
          label: toolElem.styleName,
          activityId: toolElem.activityTypeId,
          activitySubId: toolElem.activitySubTypeId,
        }));

      let toolsDiv = (
        <div className={props.toolContainer}>
          {tools &&
            tools.map((eachTool, index) => <div> {eachTool.tool} </div>)}
        </div>
      );
      toolMap.set(itr.title, { tools, toolsDiv });
    }
  }

  return (
    <div
      id={props.toolTypeContainerExpanded}
      className={props.toolTypeContainerExpanded}
      onScroll={props.scrollHandler}
      style={props.style}
    >
      <List className={props.expandedList}>
        {props.search ? (
          <div
            style={{
              border: "1px solid #C4C4C4",
              width: "95%",
              height: "28px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "7px",
              marginBottom: "10px",
              marginLeft: "2%",
            }}
          >
            {/*code edited on 3 June 2022 for BugId 110210 */}
            <input
              onKeyUp={() => searchFunc_expanded(props.searchedVal)}
              id="userInput_expanded"
              value={props.searchedVal}
              onChange={(e) => props.setSearchedVal(e.target.value)}
              autoComplete="off"
              type="text"
              placeholder="Search"
              style={{
                color: "black",
                border: "none",
                outline: "none",
                flexGrow: "1",
                width: "100%",
              }}
            />
            <SearchIcon style={{ height: "17px", width: "17px" }} />
          </div>
        ) : null}
        <div className={props.innerList}>
          {toolTypeList &&
            toolTypeList.map((element, index) =>
              !element.show || element.show != "0" ? (
                <div>
                  <ListItem
                    button
                    id={index}
                    className={`mainMenuHeading ${props.mainMenu} ${uniqueClass[index]}`}
                    classes={{
                      root: classes.rootListItem,
                      selected: classes.selectedListItem,
                      gutters: classes.listItemGutters,
                    }}
                    selected={props.toolboxDisplay === element.title}
                  >
                    <span
                      className={`${props.mainMenu} ${uniqueClass[index]} tooltypeHeading`}
                      id={index}
                    >
                      {t(element.title)}
                    </span>
                  </ListItem>
                  <List
                    className={props.oneToolList}
                    classes={{ root: classes.rootList }}
                  >
                    {toolMap.get(element.title).tools &&
                      toolMap
                        .get(element.title)
                        .tools.map((eachTool, index1) => (
                          <ListItem
                            onClick={() => {
                              if (props.bFromActivitySelection == true)
                                props.selectedActivityName(
                                  eachTool.activityId,
                                  eachTool.activitySubId
                                );
                            }}
                            className={`${props.subActivities} ${uniqueClass[index]}`}
                            key={index1}
                            classes={{
                              root: classes.rootToolListItemInExpandedView,
                              gutters: props.expandedView
                                ? classes.listItemGutters
                                : null,
                            }}
                          >
                            <p style={{ whiteSpace: "nowrap" }}>
                              {" "}
                              {eachTool.tool}
                            </p>
                          </ListItem>
                        ))}
                  </List>
                </div>
              ) : null
            )}
        </div>
        {/* This is to add extra white space in scrolling List */}
        {props.bFromActivitySelection == true ? null : (
          <div>
            <h1 style={{ color: "white" }}>.</h1>
            <h1 style={{ color: "white" }}>.</h1>
            <h1 style={{ color: "white" }}>.</h1>
            <h1 style={{ color: "white" }}>.</h1>
            <h1 style={{ color: "white" }}>.</h1>
            <h1 style={{ color: "white" }}>.</h1>
            <h2 style={{ color: "white" }}>.</h2>
            <h4 style={{ color: "white" }}>.</h4>
          </div>
        )}
      </List>
    </div>
  );
}
export default ToolsList;
