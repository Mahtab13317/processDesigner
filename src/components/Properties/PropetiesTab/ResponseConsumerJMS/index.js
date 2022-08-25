import React, { useState, useEffect } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { propertiesLabel } from "../../../../Constants/appConstants";
import Modal from "../../../../UI/Modal/Modal.js";

import "../../Properties.css";
import { Select, MenuItem } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import CommonTabHeader from "../commonTabHeader";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import "./index.css";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./index.css";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import DeleteIcon from "@material-ui/icons/Delete";
import { Checkbox } from "@material-ui/core";
import JMS_XML from "./jmsXML.js";
import TableResponseConsumer from "./TableResponseConsumer.js";
import TabsHeading from "../../../../UI/TabsHeading";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    height: 40,
  },
  tableContainer: {
    padding: 5,
  },
  tableRow: {
    height: 40,
  },
  tableHeader: {
    fontWeight: 600,
    fontSize: 14,
    padding: 0,
  },
  tableBodyCell: {
    fontSize: 12,
    padding: 0,
  },
  checkboxRow: {
    padding: 0,
  },
  tableBodyCellVariables: {
    fontSize: 12,
    padding: 0,
  },
});

function ResponseConsumerJMS(props) {
  let { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showXMLModal, setShowXMLModal] = useState(false);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  return (
    <div>
      <TabsHeading heading={props?.heading} />
      <div style={{ padding: "0px 10px 10px 10px" }}>
        <p className="requestConsumerHead">Response Consumer JMS</p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#606060",
              fontWeight: "500",
              marginLeft: "5px",
            }}
          >
            Destination Name
          </p>
          <div>
            <input className="webserviceLocation" />
            <button
              style={{
                width: "80px",
                height: "30px",
                color: "#0472C6",
                border: "1px solid #0472C6",
                cursor: "pointer",
              }}
              onClick={() => setShowXMLModal(true)}
            >
              Input XML
            </button>
          </div>
        </div>
      </div>
      <TableResponseConsumer />

      {showXMLModal ? (
        <Modal
          show={showXMLModal}
          backDropStyle={{ backgroundColor: "transparent" }}
          style={{
            zIndex: "1500",
            boxShadow: "0px 3px 6px #00000029",
            border: "1px solid #D6D6D6",
            borderRadius: "2px",
            width: "438px",
            height: "295px",
          }}
          modalClosed={() => setShowXMLModal(false)}
          children={<JMS_XML setShowXMLModal={setShowXMLModal} />}
        ></Modal>
      ) : null}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, null)(ResponseConsumerJMS);
