import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles, Select, MenuItem } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Divider from "@material-ui/core/Divider";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import { useTranslation } from "react-i18next";
import SearchBox from "../../UI/Search Component";
import { tileProcess } from "../../utility/HomeProcessView/tileProcess";
import "./index.css";
import { connect } from "react-redux";
import * as actionCreators from "../../redux-store/actions/processView/actions.js";
import { useHistory } from "react-router-dom";
import { useGlobalState } from "state-pool";
import {
  MENUOPTION_PIN,
  MENUOPTION_UNPIN,
  PMWEB,
  RTL_DIRECTION,
  SERVER_URL_LAUNCHPAD,
} from "../../Constants/appConstants";
import UnpinIcon from "../../../src/assets/abstractView/Icons/PD_PinEnabled.svg";
import PinIcon from "../../../src/assets/abstractView/Icons/PD_Pinned.svg";
import axios from "axios";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  let { t } = useTranslation();
  const { headCells, hideHeader, setCategoryLength } = props;
  const { classes, order, orderBy, onRequestSort } = props;
  const dropdown = [
    { Name: "L" },
    { Name: "D" || "R" },
    { Name: "RP" },
    { Name: "E" },
    { Name: "EP" },
  ];

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const onSearchSubmit = (searchVal) => {
    let arr = [];
    setCategoryLength(0);
    props.rows.map((elem) => {
      let row_count = 0;
      arr.push({
        category: elem.category ? elem.category : null,
        categoryLength: elem.value.length,
      });
      setCategoryLength((prev) => {
        return prev + 1;
      });
      elem.value.map((val) => {
        if (
          val[props.searchProps.searchingKey].toLowerCase().includes(searchVal)
        ) {
          row_count = row_count + 1;
          arr.push(val);
        }
      });
      if (row_count === 0) {
        arr.pop();
        setCategoryLength((prev) => {
          return prev - 1;
        });
      }
    });
    props.setSubRows(arr);
    props.setSplicedRows(arr.slice(0, 20));
  };

  const clearResult = () => {
    let arr = [];
    props.rows.map((elem) => {
      arr.push({
        category: elem.category ? elem.category : null,
        categoryLength: elem.value.length,
      });
      setCategoryLength((prev) => {
        return prev + 1;
      });
      elem.value.map((item) => {
        arr.push(item);
      });
    });
    props.setSubRows(arr);
    props.setSplicedRows(arr.slice(0, 20));
  };

  const onSelect = (e) => {
    var selected = e.target.value;
    setCategoryLength(0);
    if (selected !== "defaultValue") {
      var arr = [];
      props.rows.map((elem) => {
        let row_count = 0;
        arr.push({
          category: elem.category ? elem.category : null,
          categoryLength: elem.value.length,
        });
        setCategoryLength((prev) => {
          return prev + 1;
        });
        elem.value.map((val) => {
          if (val.status === selected) {
            row_count = row_count + 1;
            arr.push(val);
          }
        });
        if (row_count === 0) {
          arr.pop();
          setCategoryLength((prev) => {
            return prev - 1;
          });
        }
      });
      props.setSubRows(arr);
      props.setSplicedRows(arr.slice(0, 20));
    } else {
      clearResult();
    }
  };

  return (
    <div className={classes.headerDiv}>
      <div className={classes.heading}>
        <p className={classes.recentTitle}>
          {`${t("Recents")}`} ({props.count})
        </p>
        <div className={classes.headerRightWrapper}>
          {props.isSearch ? (
            <SearchBox
              height="28px"
              width="150px"
              onSearchChange={onSearchSubmit}
              clearSearchResult={clearResult}
              name="search"
              placeholder={t("Search Here")}
            />
          ) : null}
          <Select
            className={classes.select}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
            defaultValue={"defaultValue"}
            onChange={(e) => onSelect(e)}
          >
            <MenuItem
              className={classes.dropdownData}
              style={{ marginTop: ".5px" }}
              value="defaultValue"
            >
              {t("allStatus")}
            </MenuItem>
            {dropdown.map((x) => {
              return (
                <MenuItem
                  className={classes.dropdownData}
                  key={x.Name}
                  value={x.Name}
                >
                  {tileProcess(x.Name)[1]}
                  {x.Name == "RP" || x.Name == "EP" ? (
                    <img
                      style={{ marginLeft: "5px" }}
                      src={t(tileProcess(x.Name)[5])}
                      alt={t("img")}
                    />
                  ) : (
                    ""
                  )}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      </div>

      <TableHead
        ref={props.headRef}
        classes={{ root: classes.tableHeadRoot }}
        style={hideHeader ? { display: "none" } : {}}
      >
        <TableRow className="commonTabularRow">
          {headCells.map((headCell, index) => (
            <TableCell
              key={headCell.id}
              align="left"
              classes={{
                root: clsx({
                  [classes.rootHeadCell]: true,
                  [classes.projectNameCell]: index === 0,
                  [classes.ownedByCell]: index === 1,
                }),
              }}
              //classes = {{root : classes.rootHeadCell}}
              //headCell.disablePadding ? 'none' : 'default'
              style={{ width: headCell.width, ...headCell.styleTdCell }}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {headCell.sort === true ? (
                <TableSortLabel
                  active={true} //{orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  classes={{
                    root: classes.tableSortLabelRoot,
                    icon: classes.tableSortLableIcon,
                  }}
                  onClick={createSortHandler(headCell.id)}
                  IconComponent={ExpandMoreOutlinedIcon}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </span>
                  ) : null}
                </TableSortLabel>
              ) : (
                <p style={{ margin: "0" }}> {headCell.label} </p>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </div>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  // order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  //orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    width: "100%",
    //height : '80%',
    //overflow : 'auto',
    //position: 'relative',
  },
  heading: {
    display: "flex",
    justifyContent: "space-between",
  },
  headerRightWrapper: {
    display: "flex",
    flexWrap: "wrap",
    marginLeft: (props) => (props.direction === "ltr" ? "auto" : "none"),
  },
  dropdownData: {
    height: "17px",
    textAlign: "left",
    font: "normal normal normal 12px/17px Open Sans",
    letterSpacing: "0px",
    color: "#000000",
    opacity: "1",
    marginTop: "8px",
    paddingLeft: "10px !important",
    marginLeft: "0px",
  },
  tableHeadRoot: {
    // position : 'fixed'
  },
  tableBodyRoot: {
    //  position : 'fixed',
    // height : '390px',
    // overflowY : 'auto',
    // position:'relative'
    cursor: "pointer",
  },
  headerDiv: {
    position: "sticky",
    top: "-3%",
    paddingTop: "1rem",
    background: "#F8F8F8",
  },
  recentTitle: {
    font: "normal normal 600 16px/22px Open Sans",
    color: "#000000",
    height: "22px",
    textAlign: "left",
    marginLeft: 0,
    marginBottom: 0,
    letterSpacing: 0,
  },
  // paginationRoot : {
  //   position : 'fixed'
  // },
  // paginationActions : {
  //   marginLeft : '0px',
  //   marginRight : '20px'
  // },
  // paginationToolbar : {
  //   '&	.MuiTablePagination-caption:first-of-type':{
  //     display : 'none'
  //   },
  //   '& .MuiTablePagination-spacer' :{
  //     display : 'none'
  //   },
  //   display : 'flex',
  //   justifyContent : 'center'
  // },
  // paginationInput : {
  //   display : 'none',
  // },
  rootHeadCell: {
    // position : 'absolute',
    // top : '0px',
    // left : '0px',
    fontFamily: "Open Sans , sans-serif",
    fontWeight: 600,
    fontSize: "0.75rem",
    color: "#000000",
    borderBottom: "0px",
    padding: "0",
    paddingLeft: "4px",
    backgroundColor: "#F8F8F8",
  },
  projectNameCell: {
    minWidth: "200px",
  },
  ownedByCell: {
    minWidth: "100px",
  },
  // processCountCell : {
  //   width : '100%',
  // },
  paper: {
    width: "100%",
    position: "relative",
    boxShadow: "none",
    //marginBottom: theme.spacing(2),
  },
  tableContainerRoot: {
    maxHeight: "100vh",
    //     overflowY : 'auto'
    "&::-webkit-scrollbar": {
      width: "0.5rem" /* width of scrollbar in y axis */,
      height: "0.5rem" /*width of scrollbar in x axis*/,
    },

    "&::-webkit-scrollbar-track": {
      background: "#eceff1" /* color of the tracking area */,
      borderRadius: "10px",
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c4c4c4" /* color of the scroll thumb */,
      borderRadius: "10px" /* roundness of the scroll thumb */,
      border: "1px solid #f8f8f8" /* creates padding around scroll thumb */,
    },
  },
  table: {
    minWidth: "100%",
    maxWidth: "100%",
  },
  tableCellRoot: {
    fontFamily: "Open Sans , Roboto , Helvetica , Arial , sans-serif",
    borderBottom: "0px",
    fontSize: "12px",
    padding: "8px 2px",
    paddingLeft: "3px",
    marginRight: "14px",
  },
  selectedTableRow: {
    background: "#FF660026 0% 0% no-repeat padding-box",
    opacity: 1,
  },
  select: {
    width: "138px",
    height: "28px",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    font: "normal normal normal 12px/17px Open Sans",
    border: "1px solid #C4C4C4",
    borderRadius: "2px",
    opacity: "1",
    marginLeft: (props) =>
      props.direction !== RTL_DIRECTION ? "10px" : "none",
    marginRight: (props) =>
      props.direction === RTL_DIRECTION ? "10px" : "none",
    "& .MuiSelect-select": {
      paddingRight: (props) =>
        props.direction === RTL_DIRECTION ? "0.5rem" : "unset",
    },
    "& .MuiSelect-icon": {
      left: (props) => (props.direction === RTL_DIRECTION ? "0" : "unset"),
      right: (props) => (props.direction !== RTL_DIRECTION ? "0" : "unset"),
    },
    "&::before": {
      display: "none",
    },
    "&::after": {
      display: "none",
    },
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  tableSortLabelRoot: {
    flexDirection: "row-reverse",
  },
  tableSortLableIcon: {
    fontSize: "30px",
  },
  separatorHeading: {
    paddingTop: "0.95rem",
    paddingBottom: "0.95rem",
    overflow: "hidden",
    textAlign: "left",
    whiteSpace: "nowrap",
    background: "#F8F8F8",
    textOverflow: "ellipsis",
    fontSize: "13px",
    fontWeight: "600",
  },
});

function TabularData(props) {
  // pass  divider as true through props to show didvider ,  ans pass style object to styleDivider prop if you need to apply style to it
  // heideHeader when true hides the header , default false i.e. header will be shown
  // batchSize gives the now of rows in a single page , default 50
  // maxHeight if given , restricts the height of whole table
  // extendHeight when false, will mwke height of table body maximum enought to adjust all rows , when no of rows is less than
  // rows visible without scroll.
  // also to get height, pass function to prop getHeightOfTable, then height will be passed as parameter to this function and called
  const {
    extendHeight = true,
    hideHeader = false,
    batchSize = 50,
    maxHeight = null,
  } = props;
  const rootRef = React.useRef(null),
    headRef = React.useRef(null),
    bodyRef = React.useRef(null),
    paginationRef = React.useRef(null);
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const classes = useStyles({ direction });
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("projectName");
  const [rowSelected, setRowSelected] = React.useState(null);
  const [categoryLength, setCategoryLength] = React.useState(0);
  const [subRows, setSubRows] = useState([]);
  const [splicedRows, setSplicedRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(batchSize);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  useEffect(() => {
    let arr = [];
    props.rows.map((elem) => {
      setCategoryLength((prev) => {
        return prev + 1;
      });
      arr.push({
        category: elem.category ? elem.category : null,
        categoryLength: elem.value.length,
      });
      elem.value.map((item) => {
        arr.push(item);
      });
    });
    setSubRows(arr);
    setSplicedRows(arr.slice(0, 20));
  }, [props]);

  const history = useHistory();

  const handleRowClick = (event, rowId) => {
    setRowSelected(rowId);
    props.openProcessClick(
      rowId.ProcessId,
      rowId.parent,
      rowId.status,
      rowId.version,
      rowId.name
    );
    props.openTemplate(null, null, false);
    history.push("/process");
  };

  React.useEffect(() => {
    document.getElementById("tableContainer").onscroll = function (event) {
      if (this.scrollTop >= this.scrollHeight - this.clientHeight) {
        //User reached bottom of table after scroll
        //Logic to call web services to get next set of data
        const timeout = setTimeout(() => {
          setSplicedRows((prev) => subRows.slice(0, prev.length + 20));
        }, 500); //timeout set to load new rows
        return () => clearTimeout(timeout);
      }
    };
  });

  const [pinnedProcessDefIdArr, setpinnedProcessDefIdArr] = useState([]);
  const [showPinBoolean, setshowPinBoolean] = useState();

  useEffect(() => {
    async function getPinned() {
      const res = await axios.get(SERVER_URL_LAUNCHPAD + "/pinnedList/1");

      res.data?.forEach((data) => {
        setpinnedProcessDefIdArr((prev) => {
          let temp = [...prev];
          temp.push(data.Id + "");
          return temp;
        });
      });
    }
    getPinned();
  }, []);

  useEffect(() => {
    if (pinnedProcessDefIdArr.includes(rowSelected?.ProcessId + ""))
      setshowPinBoolean(false);
    else setshowPinBoolean(true);
  }, [rowSelected?.ProcessId]);

  const handlePinUnpin = async (e, row) => {
    //need to integrate api
    e.stopPropagation();
    if (pinnedProcessDefIdArr.includes(row?.ProcessId + "")) {
      const res = await axios.post(SERVER_URL_LAUNCHPAD + "/unpin", {
        status: row.status,
        id: row.ProcessId,
        applicationName: PMWEB,
        type: "P",
        applicationId: "1",
      });
      if (res?.data?.Status === 0) {
        setpinnedProcessDefIdArr((prev) => {
          let temp = [...prev];
          temp.splice(temp.indexOf(row?.ProcessId + ""), 1);
          return temp;
        });
      }
    } else {
      const res = await axios.post(SERVER_URL_LAUNCHPAD + "/pin", {
        name: row.name,
        type: "P",
        parent: row.allData.parentName,
        editor: row.allData.editor,
        status: row.status, //same for temp
        creationDate: row.allData.creationDateTime,
        modificationDate: row.allData.modificationDateTime,
        accessedDate: row.allData.accessedDateTime, //same as it is temp.
        applicationName: PMWEB, //hardcoded (const file)
        id: row.ProcessId + "",
        version: Number.parseFloat(row.version).toPrecision(2) + "",
        statusMessage: "Created",
        applicationId: "1",
        parentId: row.allData.parentId + "",
      });
      if (res?.data?.Status === 0) {
        setpinnedProcessDefIdArr((prev) => {
          let temp = [...prev];
          temp.push(row?.ProcessId + "");
          return temp;
        });
      }
    }
  };

  // const [localLoadedProcess, setLocalLoadedProcess, updateLocalLoadedProcess] =
  //   useGlobalState("loadedProcessData");
  // const [processData, setprocessData] = useState();
  // useEffect(() => {
  //   if (localLoadedProcess !== null) {
  //     setprocessData(localLoadedProcess);
  //   }
  // }, [localLoadedProcess]);

  // console.log("zzzzzzzzzzz", processData);

  // const pinUnpinHandler = async (actionType) => {
  //   if (actionType === MENUOPTION_PIN) {
  //     const res = await axios.post(SERVER_URL_LAUNCHPAD + "/pin", {
  //       name: processData.ProcessName,
  //       type: "P",
  //       parent: processData.ProjectName,
  //       editor: processData.CreatedBy,
  //       status: processData.ProcessType, //same for temp
  //       creationDate: processData.CreatedOn,
  //       modificationDate: processData.LastModifiedOn,
  //       accessedDate: processData.CreatedOn, //same as it is temp.
  //       applicationName: PMWEB, //hardcoded (const file)
  //       id: processData.ProcessDefId,
  //       version: processData.VersionNo,
  //       statusMessage: "Created",
  //       applicationId: "1",
  //     });
  //     if (res.data) setshowPinBoolean(false);
  //   } else if (actionType === MENUOPTION_UNPIN) {
  //     const res = await axios
  //       .post(SERVER_URL_LAUNCHPAD + "/unpin", {
  //         status: processData.ProcessType,
  //         id: processData.ProcessDefId,
  //         applicationName: PMWEB,
  //         type: "P",
  //         applicationId: "1",
  //       })

  //       .then((response) => {
  //         setshowPinBoolean(true);
  //       });
  //   }
  // };

  return (
    <div
      className={classes.root}
      ref={rootRef}
      style={maxHeight !== null ? { maxHeight: maxHeight } : {}}
    >
      <Paper className={classes.paper}>
        <EnhancedTableHead
          classes={classes}
          order={order}
          orderBy={orderBy}
          isSearch={props.isSearch}
          onRequestSort={handleRequestSort}
          rowCount={
            subRows.length > categoryLength
              ? subRows.length - categoryLength
              : 0
          }
          headCells={props.tableHead}
          headRef={headRef}
          rows={props.rows}
          count={props.rowNo}
          hideHeader={hideHeader}
          searchProps={props.searchProps}
          setSubRows={setSubRows}
          setSplicedRows={setSplicedRows}
          setCategoryLength={setCategoryLength}
        />
        <TableContainer
          classes={{ root: classes.tableContainerRoot }}
          id="tableContainer"
        >
          {
            // stableSort(props.rows, getComparator(order, orderBy))
            //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            //seperate heading for first row
            splicedRows.map((row, index) => {
              return (
                <>
                  {row.categoryLength > 0 ? (
                    row.category || row.category === null ? (
                      index === 0 ? null : (
                        <div
                          className={
                            row.category ? classes.separatorHeading : ""
                          }
                          noWrap={true}
                        >
                          {" "}
                          {t(row.category)}
                        </div>
                      )
                    ) : null
                  ) : extendHeight || props.rows.length !== 0 ? (
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                      aria-label="enhanced table"
                    >
                      <TableBody
                        ref={bodyRef}
                        classes={{ root: classes.tableBodyRoot }}
                      >
                        <tr>
                          <td colspan={props.tableHead.length}>
                            {props.divider ? (
                              <Divider
                                style={
                                  props.styleDivider ? props.styleDivider : {}
                                }
                              />
                            ) : null}
                          </td>
                        </tr>

                        <TableRow
                          classes={{ selected: classes.selectedTableRow }}
                          hover
                          onMouseEnter={() => setRowSelected(row)}
                          onMouseLeave={() => setRowSelected(null)}
                          onClick={(event) => handleRowClick(event, row)}
                          // role="checkbox"
                          tabIndex={-1}
                          key={row.rowId}
                        >
                          {props.tableHead.map((headCell, index) => {
                            if (index === 0) {
                              return (
                                <TableCell
                                  key={headCell.id + row.rowId}
                                  component="th"
                                  scope="row"
                                  padding="none"
                                  classes={{
                                    root: classes.tableCellRoot,
                                  }}
                                  style={{
                                    width: headCell.width,
                                    ...headCell.styleTdCell,
                                  }}
                                >
                                  {row[headCell.id]}
                                </TableCell>
                              );
                            } else {
                              return (
                                <TableCell
                                  key={headCell.id + row.rowId}
                                  align="left"
                                  classes={{
                                    root: classes.tableCellRoot,
                                  }}
                                  style={{
                                    width: headCell.width,
                                    ...headCell.styleTdCell,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      width: "100%",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    {row[headCell.id]}
                                    {/* <div
                                      style={{
                                        background: "red",
                                        width: "1.5rem",
                                        height: "1.5rem",
                                      }}
                                      onClick={() =>
                                        pinUnpinHandler(
                                          showPinBoolean ? 12 : 11
                                        )
                                      }
                                    > */}
                                    {headCell.id === "LU" ? (
                                      <img
                                        src={
                                          showPinBoolean ? PinIcon : UnpinIcon
                                        }
                                        style={{
                                          width: "1.25rem",
                                          height: "1.25rem",
                                          marginRight: "0.9375rem",
                                          display:
                                            row.ProcessId ===
                                            rowSelected?.ProcessId
                                              ? ""
                                              : "none",
                                        }}
                                        alt=""
                                        onClick={(e) => handlePinUnpin(e, row)}
                                      />
                                    ) : null}
                                  </div>
                                  {/* </div> */}
                                </TableCell>
                              );
                            }
                          })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : null}
                </>
              );
            })
          }
        </TableContainer>
        {props.rows.length > rowsPerPage
          ? null
          : // <TablePagination
            //   ref = {paginationRef}
            //   classes = {{root : classes.paginationRoot ,
            //     actions : classes.paginationActions,
            //     toolbar : classes.paginationToolbar,
            //     input : classes.paginationInput
            //   }}
            //   //rowsPerPageOptions={[10, 25 , 50, 75, 100]}
            //   component="div"
            //   count={props.rows.length}
            //   rowsPerPage={rowsPerPage}
            //   page={page}
            //   onChangePage={handleChangePage}
            //   onChangeRowsPerPage={handleChangeRowsPerPage}
            // />
            null}
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
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

export default connect(null, mapDispatchToProps)(TabularData);
