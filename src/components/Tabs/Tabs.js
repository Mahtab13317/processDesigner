import React, { useState } from "react";
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
    margin: "0 !important"
  },
  indicatorTab: {},
  rootTabWrapper: {
    height: "20px",
    fontSize: "12px",
    fontWeight: "400",
    flexDirection: "row !important",
  },
  selectedTab: {
    background: "#0072C619 0% 0% no-repeat padding-box",
    border: "2px solid var(--button_color)",
    borderRadius: "2px 0px 0px 2px",
    textAlign: "left",
    font: "normal normal 600 var(--base_text_font_size)/17px var(--font_family)",
    letterSpacing: "0px",
    color: "var(--button_color)",
    padding: "3px 6px",
    margin: "0 !important"
  },
  tabIcon:{
    margin: "0 0.5rem 0 0 !important"
  }
});

function FloatingTabs(props) {
  const classes = useStyles();
  let { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(props.selectedTab);

  let handleTabChange = (evt, value) => {
    setSelectedTab(value);
    props.changeTab(value);
    props.setExpandedView(false);
  };

  let setOfTabs = props.tabs?.map((val, index) => (
    <Tab
      key={index}
      label={t(val.tabName.langKey, val.tabName.defaultWord)}
      value={val.tabName.langKey}
      icon={
        selectedTab === val.tabName.langKey ? (
          <img src={val.selectedIcon} alt="" className={classes.tabIcon} />
        ) : (
          <img src={val.icon} alt="" className={classes.tabIcon} />
        )
      }
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
        value={selectedTab}
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
