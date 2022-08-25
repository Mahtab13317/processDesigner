import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import SearchProject from "../../../UI/Search Component/index";
import Modal from "@material-ui/core/Modal";
import AddGroup from "./Exception/AddGroup";
import Rules from "./Rules/Rules";
import {
  RTL_DIRECTION,
  SCREENTYPE_EXCEPTION,
  SCREENTYPE_TODO,
} from "../../../Constants/appConstants";
import "../Tools/Interfaces.css";

function CommonInterface(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [selectedTab, setSelectedTab] = useState("screenHeading");
  const tabChangeHandler = (e, tabName) => {
    setSelectedTab(tabName);
  };

  const loadActivities = () => {
    return props.GetActivities();
  };
  useEffect(() => {
    loadActivities();
  }, [props.loadedMileStones]);

  //code edited on 8 June 2022 for BugId 110197
  const rulesTab = () => {
    if (props.screenType == SCREENTYPE_TODO) {
      return (
        <Rules
          ruleDataType={props.ruleDataType}
          interfaceRules={props.todoAllRules}
          ruleType={props.ruleType}
          ruleDataTableStatement={t("todoRemoveRecords")}
          addRuleDataTableStatement={t("todoAddRecords")}
          ruleDataTableHeading={t("todoList")}
          addRuleDataTableHeading={t("availableTodo")}
          bShowRuleData={true}
          openProcessType={props.openProcessType}
        />
      );
    } else if (props.screenType == SCREENTYPE_EXCEPTION) {
      return (
        <Rules
          ruleType={props.ruleType}
          ruleDataType={props.ruleDataType}
          interfaceRules={props.exceptionAllRules}
          ruleDataTableStatement={t("exceptionRemoveRecords")}
          addRuleDataTableStatement={t("exceptionAddRecords")}
          ruleDataTableHeading={t("exceptionList")}
          addRuleDataTableHeading={t("availableException")}
          bShowRuleData={true}
          openProcessType={props.openProcessType}
        />
      );
    }
  };

  return (
    <div className="relative" style={{ direction: direction }}>
      <div className="DocTypes" style={{ overflow: "auto" }}>
        <div className="oneDocDiv">
          <div className="docNameDiv">
            <p
              onClick={(e) => tabChangeHandler(e, "screenHeading")}
              style={{
                margin: direction !== RTL_DIRECTION ? "0 1vw 0 0" : "0 0 0 1vw",
                padding: "1px 1vw",
              }}
              className={
                selectedTab === "screenHeading"
                  ? "selectedBottomBorder screenHeading"
                  : "screenHeading"
              }
            >
              {props.screenHeading}
            </p>
            <p
              onClick={(e) => tabChangeHandler(e, "rules")}
              className={
                selectedTab === "rules" ? "selectedBottomBorder Rules" : "Rules"
              }
              style={{
                padding: "1px 1vw",
              }}
            >
              {t("rules")}
            </p>
          </div>
          {selectedTab == "screenHeading" ? (
            <React.Fragment>
              <div
                className="docSearchDiv"
                style={{
                  marginBottom:
                    props.screenType == SCREENTYPE_EXCEPTION
                      ? "0.8rem"
                      : "0.75rem",
                  marginTop:"2.1rem",
                }}
              >
                <div className="searchBarNFilterInterface">
                  <div className="docSearchBar">
                    <SearchProject
                      id="listSearch"
                      onSearchChange={props.onSearchChange}
                      clearSearchResult={props.clearSearchResult}
                      setSearchTerm={props.setSearchTerm}
                      placeholder={t("search")}
                      width="240px"
                    />
                  </div>
                  {props.openProcessType !== "L" ? null : (
                    <p className="addGroupButton" onClick={props.handleOpen}>
                      {t("addGroupButton")}
                    </p>
                  )}
                  <Modal
                    open={props.addGroupModal}
                    onClose={props.handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    <AddGroup
                      newGroupToMove={props.newGroupToMove}
                      addGroupToList={props.addGroupToList}
                      handleClose={props.handleClose}
                      bGroupExists={props.bGroupExists}
                      setbGroupExists={props.setbGroupExists}
                      groupName={props.groupName}
                      setGroupName={props.setGroupName}
                      groupsList={props.groupsList}
                      showGroupNameError={props.showGroupNameError}
                    />
                  </Modal>
                </div>
              </div>
              {props.GetList()}
            </React.Fragment>
          ) : null}
        </div>

        {selectedTab == "screenHeading" ? (
          <div className="activitySideDiv">
            <div className="activityHeadingDiv">
              <p className="activitySideHeading">{t("rightsOnActivities")}</p>
              <div className="actvitySearchDiv">
                <SearchProject
                  onSearchChange={props.onActivitySearchChange}
                  clearSearchResult={props.clearActivitySearchResult}
                  setSearchTerm={props.setActivitySearchTerm}
                  placeholder={t("search")}
                  width="240px"
                  id="activitySearch"
                />
                <FormControlLabel
                  style={{ marginLeft: "20px" }}
                  control={
                    <Switch
                      checked={props.compact}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label={<span style={{ marginBottom: "auto" }}>Compact</span>}
                />
              </div>
            </div>
            <div className="oneBox" id="oneBoxMatrix">
              <div style={{ display: "flex" }}>{props.GetActivities()}</div>
            </div>
          </div>
        ) : (
          <React.Fragment>{rulesTab()}</React.Fragment>
        )}
      </div>
    </div>
  );
}

export default CommonInterface;
