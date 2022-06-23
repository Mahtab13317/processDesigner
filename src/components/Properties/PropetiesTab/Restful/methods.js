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
  },
  tableRow: {
    height: 40,
  },
  tableHeader: {
    fontWeight: 600,
    fontSize: 14,
  },
  tableBodyCell: {
    fontSize: 12,
  },
});

export default function CustomizedTables(props) {
  const classes = useStyles();
  console.log("associations", props.associations);
  const mappingHandler = (method) => {
    props.setShowMapping(true);
    props.setMethodClicked(method);
    console.log("method", method);
  };

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table
        className={classes.table}
        style={{ width: props.isDrawerExpanded ? "100%" : "324px" }}
        aria-label="customized table"
      >
        <TableBody>
        <StyledTableRow className={classes.tableRow}>
            <StyledTableCell className={classes.tableHeader}>
              Method
            </StyledTableCell>
            {/* <StyledTableCell className={classes.tableHeader} align="right">
              Method
            </StyledTableCell> */}
            <StyledTableCell></StyledTableCell>
            <StyledTableCell align="right"></StyledTableCell>
          </StyledTableRow>
          {/* --------- */}
          {props.associations.map((row) => (
            <StyledTableRow key={row.method} className={classes.tableRow}>
              {row.method ? (
                <StyledTableCell
                  className={classes.tableBodyCell}
                  component="th"
                  scope="row"
                >
                  {row.method}
                </StyledTableCell>
              ) : null}
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
