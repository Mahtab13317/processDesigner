import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: "#f6f5f5",
  },
  tab: {
    marginRight: "45px",
    padding: "0px",
    fontSize: "20px",
    color: "black",
    minWidth: "0px",
    minHeight: "2.5rem",
    height: "19px",
  },
  tabs: {
    minHeight: "0",
  },
}));

export default function ScrollableTabsButtonAuto(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const tabChangeHandler = (event, newValue) => {
    if (newValue !== undefined) {
      setValue(newValue);
    }
  };

  //set default value of tabs, if any
  useEffect(() => {
    if (props.defaultTabValue !== undefined && props.defaultTabValue !== null) {
      setValue(props.defaultTabValue);
    }
  }, [props.defaultTabValue]);

  //update value of selected tab to parent
  useEffect(() => {
    if (props.setValue) {
      props.setValue(value);
    }
  }, [value]);

  return (
    <div
      className={`${classes.root} ${props.tabType} ${props.tabStyling} tabStyling`}
      style={{ direction: props.direction }}
    >
      <AppBar
        className={props.tabBarStyle}
        style={{
          boxShadow: "none",
          display: props.isEmbeddedSubProcess ? "none" : null,
        }}
        position="static"
        color="default"
      >
        <Tabs
          orientation={props.orientation ? props.orientation : null}
          value={value}
          onChange={tabChangeHandler}
          border="null"
          className={props.tabsStyle}
          classes={{ root: classes.tabs }}
        >
          {props.TabNames
            ? props.TabNames.map((tabName, index) => {
                return (
                  <Tab
                    className={props.oneTabStyle}
                    classes={{ root: classes.tab }}
                    label={tabName}
                  />
                );
              })
            : null}
        </Tabs>
      </AppBar>
      {props.TabElement
        ? props.TabElement.map((element, i) => {
            return (
              <TabPanel
                style={{
                  borderLeft: props.isEmbeddedSubProcess
                    ? "1px solid rgb(161, 161, 161, 0.8)"
                    : null,
                }}
                className={props.tabContentStyle}
                value={value}
                index={i}
              >
                {element}
              </TabPanel>
            );
          })
        : null}
    </div>
  );
}
