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
    "&:nth-of-type(even)": {
      backgroundColor: "#fff",
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    height: 40,
    borderSpacing: "0 0.125rem",
  },
  tableContainer: {
    padding: "0.5rem 1vw",
    height: 270,
  },
  tableRow: {
    height: 40,
  },
  tableHeader: {
    fontWeight: 600,
    fontSize: 13,
    backgroundColor: "#f8f8f8",
    borderTop: "1px solid #f8f8f8",
    borderBottom: "1px solid #f8f8f8",
    borderRadius: "0.125rem",
    color: "black",
  },
  tableBodyCell: {
    fontSize: 12,
  },
}));

export default function CustomizedTables(props) {
  const classes = useStyles();
  const mappingHandler = (method) => {
    props.setShowMapping(true);
    props.setMethodClicked(method);
  };

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table
        className={`${classes.table} ${
          props.isDrawerExpanded
            ? "webServicePropertiestableEx"
            : "webServicePropertiestableCo"
        } webServicePropertiestable`}
        style={{ width: "100%" }}
        aria-label="customized table"
        stickyHeader
      >
        <TableHead>
          <StyledTableRow className={classes.tableRow}>
            <StyledTableCell
              className={classes.tableHeader}
              style={{ width: "95vw" }}
            >
              Method
            </StyledTableCell>
            <StyledTableCell
              className={classes.tableHeader}
              style={{ width: "2.5vw" }}
            ></StyledTableCell>
            <StyledTableCell
              className={classes.tableHeader}
              align="right"
              style={{ width: "2.5vw" }}
            ></StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody className="associatedTemplateDiv">
          {props.associations.map((row) => (
            <StyledTableRow key={row.method} className={classes.tableRow}>
              {row.method ? (
                <StyledTableCell
                  className={classes.tableBodyCell}
                  style={{ width: "95vw" }}
                >
                  {row.method}
                </StyledTableCell>
              ) : null}
              <StyledTableCell align="right" style={{ width: "2.5vw" }}>
                <SwapHorizIcon
                  style={{
                    width: "1.75rem",
                    height: "1.75rem",
                    cursor: "pointer",
                  }}
                  onClick={() => mappingHandler(row)}
                />
              </StyledTableCell>
              <StyledTableCell align="right" style={{ width: "2.5vw" }}>
                {!props.isReadOnly && (
                  <DeleteIcon
                    style={{
                      width: "1.75rem",
                      height: "1.75rem",
                      cursor: "pointer",
                    }}
                    onClick={() => props.handleAssociationDelete(row)}
                  />
                )}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
