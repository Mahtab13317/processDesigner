import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./versionHistory.module.css";
import { Card, CardContent } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { tableCellClasses } from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import * as actionCreators from "../../../../redux-store/actions/processView/actions.js";

const StyledTableCell = styled(TableCell)(({ theme }) => ({}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(VersionName, processDefId, LastModifiedOn, LastModifiedBy) {
  return { VersionName, processDefId, LastModifiedOn, LastModifiedBy };
}

function VersionHistory(props) {
  let { t } = useTranslation();
  const history = useHistory();

  const rows =
    props.versionList &&
    props.versionList.map((val) => {
      return createData(
        val.VersionNo,
        val.ProcessDefId,
        val.LastModifiedOn,
        val.LastModifiedBy
      );
    });

  const openSelectProcess = (ProcessDefId, versionNo) => {
    props.openProcessClick(
      ProcessDefId,
      props.projectName,
      props.processType,
      versionNo,
      props.ProcessName
    );
    props.openTemplate(null, null, false);
    history.push("/process");
    props.setModalClosed();
  };

  const closeHandler = () => {
    props.setModalClosed(false);
  };

  return (
    <React.Fragment>
      <p className={styles.close} onClick={closeHandler}>
        X
      </p>
      <div style={{ margin: "2rem" }}>
        <p className={styles.tittle}>
          {t("VersionHistory")} : {props.ProcessName}
        </p>
        <Card variant="outlined" className>
          <CardContent>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell className={styles.versionHeader}>
                      {t("versionName")}
                    </StyledTableCell>

                    <StyledTableCell className={styles.versionHeader}>
                      {t("lastModifyOn")}
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows &&
                    rows.map((row) => {
                      return (
                        <StyledTableRow
                          key={row.name}
                          className={styles.particularRow}
                        >
                          <StyledTableCell
                            align="left"
                            style={{ fontWeight: "600" }}
                          >
                            {row.VersionName}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {row.LastModifiedOn} {t("by")} {row.LastModifiedBy}
                          </StyledTableCell>

                          <StyledTableCell
                            className={styles.openBtn}
                            align="left"
                            onClick={() =>
                              openSelectProcess(
                                row.processDefId,
                                row.VersionName
                              )
                            }
                          >
                            {t("OPEN")}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    openProcessClick: (id, name, type, version, processName) =>
      dispatch(
        actionCreators.openProcessClick(id, name, type, version, processName)
      ),
    openTemplate: (id, name, flag) =>
      dispatch(actionCreators.openTemplate(id, name, flag)),
  };
};

export default connect(null, mapDispatchToProps)(VersionHistory);
