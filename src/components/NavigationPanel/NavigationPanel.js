import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "../../UI/Modal/Modal.js";
import { connect } from "react-redux";
import * as actionCreators from "../../redux-store/actions/processView/actions.js";
import ProjectCreation from "../MainView/ProcessesView/Projects/ProjectCreation.js";
import {
  APP_HEADER_HEIGHT,
  CREATE_PROCESS_FLAG_FROM_PROCESS,
  PREVIOUS_PAGE_CREATE_FROM_NO_PROCESS,
  PREVIOUS_PAGE_CREATE_FROM_PROCESSES,
  PREVIOUS_PAGE_CREATE_FROM_TEMPLATE,
  PREVIOUS_PAGE_GRID,
  PREVIOUS_PAGE_LIST,
  PREVIOUS_PAGE_NO_PROCESS,
  PREVIOUS_PAGE_PROCESS,
  RTL_DIRECTION,
} from "../../Constants/appConstants.js";
import * as actionCreators_template from "../../redux-store/actions/Template";

const useStyles = makeStyles((theme) => ({
  drawerClose: {
    overflowX: "hidden",
    width: (props) => (props.direction === RTL_DIRECTION ? "5vw" : "5.2vw"),
    backgroundColor: "#404040",
    color: "white",
    marginTop: `${APP_HEADER_HEIGHT}`,
    zIndex: 0,
  },
  rootListItem: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "0.75rem !important",
    paddingBottom: "0.75rem !important",
    marginTop: "0",
    marginBottom: "0",
    borderLeft: "0.25rem solid transparent",
  },
  selectedListItem: {
    backgroundColor: "#606060 !important",
    borderLeft: "0.25rem solid #ff764b !important",
  },
  guttersListItem: {
    paddingLeft: "0",
    paddingRight: "0.25rem",
    position: "relative",
    "&:hover": {
      backgroundColor: "#606060 !important",
    },
  },
  rootListItemIcon: {
    justifyContent: "center",
    marginBottom: "0 !important",
  },
  rootListItemImg: {
    width: "1.5rem",
    height: "1.5rem",
  },
  rootListItemIconNoCaption: {
    justifyContent: "center",
    padding: "3px",
    height: "40px",
  },
  selectedItemText: {
    color: "#FFFFFF",
    fontSize: "10px",
    textAlign: "center",
    fontFamily: "Open Sans",
  },
  primaryText: {
    color: "#D3D3D3",
    fontSize: "10px",
    textAlign: "center",
    fontFamily: "Open Sans",
  },
  popup: {
    top: "0.5rem",
    color: "rgba(0, 0, 0, 0.87)",
    right: (props) => (props.direction === RTL_DIRECTION ? "5vw" : "unset"),
    left: (props) => (props.direction === RTL_DIRECTION ? "unset" : "5.2vw"),
    position: "absolute",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    boxShadow: "1px 0px 12px #00000080",
    border: "1px solid #CFCFCF",
    borderRadius: "1px",
    opacity: "1",
    width: "105px",
    height: "64px",
    zIndex: 100,
  },
  subPopup: {
    fontSize: "12px",
    fontFamily: "Open Sans",
    textTransform: "capitalize",
    display: "block",
    textAlign: "left",
    letterSpacing: "0px",
    color: "#000000",
    padding: "5px 9px",
    opacity: "1",
    "&:hover": {
      background: "#FFFFFF 0% 0% no-repeat padding-box",
    },
  },
}));

function NavigationPanel(props) {
  const [showPopup, setShowPopup] = useState(false);
  const [showModal, setShowModal] = useState(null);
  if (props.clickedProcessTile) {
    props.setSelection("navigationPanel.processes");
  } else if (
    props.getTemplatePage === PREVIOUS_PAGE_LIST ||
    props.getTemplatePage === PREVIOUS_PAGE_GRID ||
    props.getTemplatePage === PREVIOUS_PAGE_CREATE_FROM_TEMPLATE
  ) {
    props.setSelection("navigationPanel.templates");
  } else if (
    props.getTemplatePage === PREVIOUS_PAGE_CREATE_FROM_NO_PROCESS ||
    props.getTemplatePage === PREVIOUS_PAGE_NO_PROCESS ||
    props.getTemplatePage === PREVIOUS_PAGE_PROCESS ||
    props.getTemplatePage === PREVIOUS_PAGE_CREATE_FROM_PROCESSES
  ) {
    props.setSelection("navigationPanel.processes");
  }

  //t is our translation function
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const classes = useStyles({ direction });
  props.selectedTabAtNavPanel(props.selectedNavigation); //sent selected Tab at Navigation panel to Redux Store
  let iconDisplay = props.icons.map((element) => (
    <ListItem
      button
      classes={{
        root: classes.rootListItem,
        selected: classes.selectedListItem,
        gutters: classes.guttersListItem,
      }}
      key={element.langKey}
      selected={props.selectedNavigation === element.langKey}
      onClick={() => {
        if (element.default !== t("Create")) {
          props.setTemplatePage(null);
          props.setTemplateDetails(
            null,
            null,
            false,
            null,
            null,
            false,
            "",
            []
          );
          props.setClickedProcessTile(null);
          props.setSelection(element.langKey);
        }
      }}
      onMouseOver={() => {
        if (element.default === t("Create")) setShowPopup(true);
        else setShowPopup(false);
      }}
    >
      <ListItemIcon
        classes={{
          root: element.noCaption
            ? classes.rootListItemIconNoCaption
            : classes.rootListItemIcon,
        }}
      >
        {props.selectedNavigation === element.langKey ? (
          <img
            src={element.selectedIcon}
            alt={t(element.langKey, element.default)}
            className={element.noCaption ? null : classes.rootListItemImg}
          />
        ) : (
          <img
            src={element.icon}
            alt={t(element.langKey, element.default)}
            className={element.noCaption ? null : classes.rootListItemImg}
          />
        )}
      </ListItemIcon>
      {!element.noCaption ? (
        <span
          className={
            props.selectedNavigation === element.langKey
              ? classes.selectedItemText
              : classes.primaryText
          }
        >
          {t(element.langKey, element.default)}
        </span>
      ) : null}
    </ListItem>
  ));

  return (
    <div onMouseLeave={() => setShowPopup(false)}>
      <Drawer
        variant="permanent"
        className={classes.drawerClose}
        anchor={direction === RTL_DIRECTION ? "right" : "left"}
        classes={{
          paper: classes.drawerClose,
        }}
      >
        <List>{iconDisplay}</List>
      </Drawer>
      {showPopup ? (
        <div className={classes.popup}>
          <Button
            className={classes.subPopup}
            onClick={() => {
              setShowModal("Project");
              setShowPopup(false);
            }}
          >
            {t("createProject")}
          </Button>
          <Button
            className={classes.subPopup}
            onClick={() => {
              props.CreateProcessClickFlag(CREATE_PROCESS_FLAG_FROM_PROCESS);
              props.setSelectedProject(null, null);
            }}
          >
            {t("CreateProcess")}
          </Button>
        </div>
      ) : null}

      {showModal === "Project" && (
        <Modal
          show={showModal !== null}
          style={{
            width: "30vw",
            height: "80vh",
            left: "35%",
            top: "10%",
            padding: "0",
          }}
          modalClosed={() => setShowModal(null)}
          children={<ProjectCreation setShowModal={setShowModal} />}
        />
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectedTabAtNavPanel: (selectedTab) =>
      dispatch(actionCreators.selectedTab_AtNavPanel(selectedTab)),
    setClickedProcessTile: (processTile) =>
      dispatch(actionCreators.clickedProcessTile(processTile)),
    CreateProcessClickFlag: (flag) =>
      dispatch(actionCreators.createProcessFlag(flag)),
    setSelectedProject: (id, name) => {
      dispatch(actionCreators.selectedProject(id, name));
    },
    setTemplatePage: (value) =>
      dispatch(actionCreators_template.storeTemplatePage(value)),
    setTemplateDetails: (category, view, createBtnClick, template) =>
      dispatch(
        actionCreators_template.setTemplateDetails(
          category,
          view,
          createBtnClick,
          template
        )
      ),
  };
};

const mapStateToProps = (state) => {
  return {
    clickedProcessTile: state.clickedProcessTileReducer.selectedProcessTile,
    getTemplatePage: state.templateReducer.template_page,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationPanel);
