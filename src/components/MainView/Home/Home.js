import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Home.css";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import AppsIcon from "@material-ui/icons/Apps";
import { makeStyles } from "@material-ui/core/styles";
import Dropdown from "../../../UI/Dropdown/Dropdown";
import ProcessTile from "./ProcessTiles";
import Pinned from "./PinnedProcesses";
import Recent from "./Recent";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import * as actionCreators from "../../../redux-store/actions/processView/actions";
import {
  SERVER_URL,
  SERVER_URL_LAUNCHPAD,
  ENDPOINT_MOVE_PINNED_TILES,
} from "../../../Constants/appConstants";

const useStyles = makeStyles({
  listItemIconRoot: {
    minWidth: "25px",
  },
  listItemTextRoot: {
    marginTop: "2px",
    marginBottom: "2px",
    "& span": {
      fontSize: "12px",
    },
  },
  svgIconSmall: {
    fontSize: "1.12rem",
    marginTop: "5px",
    marginLeft: "5px",
  },
  pinnedDiv: {
    display: "flex",
    width: "96%",
    justifyContent: "space-between",
    marginLeft: "1rem",
  },
});

function Home(props) {
  const classes = useStyles();
  let { t } = useTranslation();
  const [dataLength, setLength] = useState(0);
  const [bViewAll, setviewAll] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const [pinnedListView, setPinnedListView] = useState(0);
  const { pinnedList, pinnedDataList } = props;
  const getPinnedDataLength = (length = 0) => {
    setLength(length);
  };

  let refToGrid = useRef(); //used forthe refrence of height
  let recentTableHeadRef = useRef();

  const view = () => {
    setviewAll(!bViewAll);
  };

  const toggleDropdown = (evt) => {
    if (Boolean(anchorEl)) {
      setAnchorEl(null);
    } else {
      setAnchorEl(evt.currentTarget);
    }
  };

  // This function runs when any pinned tile is dragged and dropped in the list.
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const pinnedListDataArray = pinnedList;
    const [reOrderedTile] = pinnedListDataArray.splice(source.index, 1);
    pinnedListDataArray.splice(destination.index, 0, reOrderedTile);
    const newOrderObj = {
      oldOrderId: reOrderedTile.OrderId,
      orderId: destination.index + 1,
      applicationName: "PMWEB",
    };
    pinnedListDataArray.forEach((element, index) => {
      element.OrderId = index + 1;
    });
    pinnedDataList([...pinnedListDataArray]);
    reArrangeTileAPICall(newOrderObj);
  };

  // Function to call API when a user rearranges a pinned tile on homepage.
  const reArrangeTileAPICall = (newOrderObj) => {
    axios
      .post(SERVER_URL_LAUNCHPAD + ENDPOINT_MOVE_PINNED_TILES, newOrderObj)
      .then()
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (window.loadMicroFrontend) {
      const timeout = setTimeout(() => {
        window.loadActivityStream();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [window.loadMicroFrontend]);

  const dropdownOptions = [
    {
      id: 0,
      callbackFunction: setPinnedListView,
      value: (
        <React.Fragment>
          <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
            <AppsIcon
              fontSize="small"
              classes={{ fontSizeSmall: classes.svgIconSmall }}
            />
          </ListItemIcon>
          <ListItemText
            classes={{ root: classes.listItemTextRoot }}
            primary="Tile View"
          />
        </React.Fragment>
      ),
    },
    {
      id: 1,
      callbackFunction: setPinnedListView,
      value: (
        <React.Fragment>
          <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
            <MenuIcon
              fontSize="small"
              classes={{ fontSizeSmall: classes.svgIconSmall }}
            />
          </ListItemIcon>
          <ListItemText
            classes={{ root: classes.listItemTextRoot }}
            primary="List View"
          />
        </React.Fragment>
      ),
    },
  ];
  const direction = `${t("HTML_DIR")}`;

  return (
    <div className="w100 h100" style={{ direction: `${t("HTML_DIR")}` }}>
      <Grid container className="middleDivContainer">
        <Grid className="middleDiv" ref={refToGrid}>
          <div style={{ display: "none" }}>
            <ProcessTile />
          </div>
          <div
            style={{
              display: dataLength > 0 ? "block" : "none",
              marginTop: "7px",
            }}
          >
            <div className={classes.pinnedDiv}>
              <div className="row">
                <p
                  ref={recentTableHeadRef}
                  className="pinnedTitle"
                  style={{ marginRight: direction == "rtl" ? "30px" : "0" }}
                >
                  {t("pinned")} ({dataLength})
                </p>
                <p className="viewAll" onClick={() => view()}>
                  {dataLength > 4
                    ? bViewAll
                      ? t("viewLess")
                      : t("viewAll")
                    : ""}
                </p>
              </div>
              <IconButton aria-label="more" style={{ padding: "0 0 10px 0" }}>
                <MoreVertIcon htmlColor="#AEAEAE" onClick={toggleDropdown} />
                <Dropdown
                  anchorEl={anchorEl}
                  handleClose={toggleDropdown}
                  options={dropdownOptions}
                  style={{ height: "61px", width: "89px" }}
                />
              </IconButton>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="pinnedTiles" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="pinnedDiv"
                    style={{ marginRight: direction == "rtl" ? "20px" : "0" }}
                  >
                    <Pinned
                      pinnedList={pinnedList}
                      pinnedDataList={pinnedDataList}
                      getPinnedDataLength={getPinnedDataLength}
                      bViewAll={bViewAll}
                      pinnedListView={pinnedListView}
                      parenrRef={refToGrid}
                    />
                    {bViewAll ? provided.placeholder : null}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div
            className="RecentTableDiv"
            style={{ marginRight: direction == "rtl" ? "20px" : "0" }}
          >
            {/*<Recent updateTablePosition = {[bViewAll , dataLength]} parenrRef = {refToGrid} upperHeaderRef = {recentTableHeadRef}/>*/}
            <Recent />
          </div>
        </Grid>
        <Grid className="middleDivActivities">
          <div id="mf_activitystream_lpweb"></div>
        </Grid>
      </Grid>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    pinnedList: state.processTypesReducer.pinnedData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    pinnedDataList: (list) => dispatch(actionCreators.pinnedDataList(list)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
