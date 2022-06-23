import React from "react";
import { useTranslation } from "react-i18next";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { makeStyles } from "@material-ui/core/styles";
import "./Tabs.css";

const useStyles = makeStyles({
  rootTabs: {
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    borderRadius: "2px",
    minHeight: "27px !important",
    padding: "0",
    "&$indicatorTab": {
      backgroundColor: " #FFFFFF",
    },
  },
  rootTab: {
    textAlign: "left",
    font: "normal normal normal 12px/17px Open Sans",
    letterSpacing: "0px",
    color: "#606060",
    border: "1px solid #C4C4C4",
    minWidth: "fit-content",
    minHeight: "27px",
    padding: "3px 6px",
  },
  indicatorTab: {},
  rootTabWrapper: {
    height: "20px",
    fontSize: "12px",
    fontWeight: "400",
  },
  selectedTab: {
    background: "#0072C619 0% 0% no-repeat padding-box",
    border: "2px solid #0072C6",
    borderRadius: "2px 0px 0px 2px",
    textAlign: "left",
    font: "normal normal 600 12px/17px Open Sans",
    letterSpacing: "0px",
    color: "#0072C6",
    padding: "3px 6px",
  },
});

function FloatingTabs(props) {
  const classes = useStyles();
  let { t } = useTranslation();
  let handleTabChange = (evt, value) => {
    props.changeTab(value);
    props.setExpandedView(false);
  };
  let setOfTabs = props.tabs.map((val, index) => (
    <Tab
      key={index}
      label={t(val.langKey, val.defaultWord)}
      value={val.langKey}
      classes={{
        root: classes.rootTab,
        selected: classes.selectedTab,
        wrapper: classes.rootTabWrapper,
      }}
    />
  ));

  return (
    <div
      className={props.tabClassName}
      style={{ maxHeight: props.maxHeight + "px" }}
    >
      <Tabs
        value={props.selectedTab}
        onChange={handleTabChange}
        classes={{ root: classes.rootTabs, indicator: classes.indicatorTab }}
        TabIndicatorProps={{ style: { display: "none" } }}
      >
        {setOfTabs}
      </Tabs>
    </div>
  );
}

export default FloatingTabs;
