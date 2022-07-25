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
  const mappingHandler = (webservice) => {
    props.setShowMapping(true);
    props.setServiceNameClicked(webservice);
  };

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      {/*code changes on 21 June 2022 for BugId 110907 */}
      <Table
        className={`${classes.table} ${
          props.isDrawerExpanded
            ? "webServicePropertiestableEx"
            : "webServicePropertiestableCo"
        } webServicePropertiestable`} /*code added on 22 June 2022 for BugId 111065 and BugId 110846*/
        style={{ width: "100%" }}
        aria-label="customized table"
        stickyHeader
      >
        <TableHead>
          <StyledTableRow className={classes.tableRow}>
            <StyledTableCell
              className={classes.tableHeader}
              style={{ width: "30vw" }}
            >
              Webservice
            </StyledTableCell>
            <StyledTableCell
              className={classes.tableHeader}
              style={{ width: "65vw" }}
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
            <StyledTableRow key={row.webservice} className={classes.tableRow}>
              {row.webservice ? (
                <StyledTableCell
                  className={classes.tableBodyCell}
                  component="th"
                  scope="row"
                  style={{ width: "30vw" }}
                >
                  {row.webservice}
                </StyledTableCell>
              ) : null}
              <StyledTableCell
                className={classes.tableBodyCell}
                style={{ width: "65vw" }}
              >
                {row.method}
              </StyledTableCell>
              <StyledTableCell align="right" style={{ width: "2.5vw" }}>
                <SwapHorizIcon onClick={() => mappingHandler(row)} />
              </StyledTableCell>
              <StyledTableCell align="right" style={{ width: "2.5vw" }}>
                <DeleteIcon onClick={()=>props.handleAssociationDelete(row)}/>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
