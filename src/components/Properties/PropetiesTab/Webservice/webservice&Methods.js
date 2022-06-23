import React from "react";
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
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    // width: props.isDrawerExpanded? '100%': 324,
    height: 40,
  },
  tableContainer: {
    padding: 5,
    height: 270,
  },
  tableRow: {
    height: 40,
  },
  tableHeader: {
    fontWeight: 600,
    fontSize: 14,
    backgroundColor:'white',
    color:'black'
  },
  tableHeaderEmpty:{
    backgroundColor:'white !important',
    color:'black !important'
  },
  tableBodyCell: {
    fontSize: 12,
  },
});

export default function CustomizedTables(props) {
  const classes = useStyles();
  console.log("associations", props.associations);
  const mappingHandler = (webservice) => {
    props.setShowMapping(true);
    props.setServiceNameClicked(webservice);
    console.log("webservice", webservice);
  };

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table
        className={classes.table}
        style={{ width: props.isDrawerExpanded ? "100%" : "324px" }}
        aria-label="customized table"
        stickyHeader
      >
        <TableHead>
          <StyledTableRow className={classes.tableRow}>
            <StyledTableCell className={classes.tableHeader}>
              Webservice
            </StyledTableCell>
            <StyledTableCell className={classes.tableHeader} align="right">
              Method
            </StyledTableCell>
            <StyledTableCell className={classes.tableHeaderEmpty}></StyledTableCell>
            <StyledTableCell className={classes.tableHeaderEmpty} align="right"></StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody className="associatedTemplateDiv">
          {props.associations.map((row) => (
            <StyledTableRow key={row.webservice} className={classes.tableRow}>
              {row.webservice ? (
                <StyledTableCell
                  className={classes.tableBodyCell}
                  component="th"
                  scope="row"
                >
                  {row.webservice}
                </StyledTableCell>
              ) : null}
              <StyledTableCell className={classes.tableBodyCell} align="right">
                {row.method}
              </StyledTableCell>
              <StyledTableCell align="right">
                <SwapHorizIcon onClick={() => mappingHandler(row)} />
              </StyledTableCell>
              <StyledTableCell align="right">
                <DeleteIcon />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
