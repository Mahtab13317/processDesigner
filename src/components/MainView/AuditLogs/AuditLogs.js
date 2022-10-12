import React, { useState, useEffect } from "react";
import classes from "./AuditLogs.module.css";
import { useTranslation } from "react-i18next";
import Select from "@material-ui/core/Select";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { DatePickers } from "../../../UI/DatePicker/DatePickers";
import { MenuItem } from "@material-ui/core";
import moment from "moment";
import {
  ENDPOINT_GETAUDITLOG,
  SERVER_URL,
  DATE_FORMAT,
  TIME_FORMAT,
  ENDPOINT_GET_ALLPROCESSLIST,
  ENDPOINT_GETALLVERSIONS,
  SEVEN,
  FIFTEEN,
  THIRTY,
  ENDPOINT_GETPROJECTLIST_DRAFTS,
  ENDPOINT_GETPROJECTLIST_DEPLOYED,
  ENDPOINT_PROCESSLIST,
} from "../../../Constants/appConstants";
import axios from "axios";
import { tileProcess } from "../../../utility/HomeProcessView/tileProcess";
import EventIcon from "@material-ui/icons/Event";
import { useDispatch } from "react-redux";
import { setToastDataFunc } from "../../../redux-store/slices/ToastDataHandlerSlice";
import { store, useGlobalState } from "state-pool";

function AuditLogs({ readOnly }) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);

  let { t } = useTranslation();
  const dispatch = useDispatch();
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [selectedDateRangeOption, setselectedDateRangeOption] = useState(SEVEN);
  const [allProcessList, setallProcessList] = useState([]);
  const [selectedProcessId, setselectedProcessId] = useState("");
  const [filterBy, setfilterBy] = useState("");
  const [auditLogData, setauditLogData] = useState([]);
  const [generateButtonClicked, setgenerateButtonClicked] = useState(false);
  const [showNoAuditLogScreen, setshowNoAuditLogScreen] = useState(false);
  const [versionList, setversionList] = useState([]);
  const [projectList, setprojectList] = useState([]);
  const [selectedVersion, setselectedVersion] = useState("");
  const [selectedProject, setselectedProject] = useState("");
  useEffect(() => {
    if (t("HTML_DIR") !== "rtl") moment.locale("en");
  }, []);

  useEffect(() => {
    const dataForProcessSpecific = async () => {
      if (!!readOnly && localLoadedProcessData !== null) {
        console.log("mmmmmmmmmmmmm");
        setfilterBy(localLoadedProcessData.ProcessType);
        let endpoint =
          localLoadedProcessData.ProcessType === "L"
            ? ENDPOINT_GETPROJECTLIST_DRAFTS
            : ENDPOINT_GETPROJECTLIST_DEPLOYED;
        const projList = await axios.get(SERVER_URL + endpoint);
        if (projList.status === 200) {
          setprojectList(projList.data?.Projects);
          setselectedProject(localLoadedProcessData.ProjectId);
        }
        const res = await axios.get(
          SERVER_URL +
            ENDPOINT_PROCESSLIST +
            "/" +
            localLoadedProcessData.ProcessType +
            "/" +
            localLoadedProcessData.ProjectId
        );
        if (res.status === 200) {
          setallProcessList(res.data?.Processes);
          setselectedProcessId(localLoadedProcessData.ProcessDefId);
        }
        const versionRes = await axios.get(
          SERVER_URL +
            `${ENDPOINT_GETALLVERSIONS}/${localLoadedProcessData.ProcessName}/${localLoadedProcessData.ProcessType}`
        );
        if (versionRes.data.Status === 0) {
          setversionList(versionRes.data.Versions);
          setselectedVersion(localLoadedProcessData.VersionNo);
        }
      }
    };
    dataForProcessSpecific();
  }, [readOnly, localLoadedProcessData]);

  useEffect(() => {
    if (moment(fromDate).diff(moment(toDate), "days") > 0) {
      dispatch(
        setToastDataFunc({
          message: t("endDateBeforeError"),
          severity: "error",
          open: true,
        })
      );

      settoDate("");
      // setfromDate("");
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    if (selectedDateRangeOption === SEVEN) {
      settoDate(moment());
      setfromDate(moment().subtract(7, "d"));
    } else if (selectedDateRangeOption === FIFTEEN) {
      settoDate(moment());
      setfromDate(moment().subtract(15, "d"));
    } else if (selectedDateRangeOption === THIRTY) {
      settoDate(moment());
      setfromDate(moment().subtract(30, "d"));
    } else {
      settoDate("");
      setfromDate("");
    }
  }, [selectedDateRangeOption]);
  const [flag, setflag] = useState({ dateType: "", boolean: false });
  const setDate = (e) => {
    if (e.target.name === "from") {
      setfromDate(e.target.value);
      setflag((prevState) => {
        return { ...prevState, boolean: false };
      });
    } else {
      settoDate(e.target.value);
      setflag((prevState) => {
        return { ...prevState, boolean: false };
      });
    }
  };

  const dropdownDatePicker = [
    { value: SEVEN, name: t("last7Days") },
    { value: FIFTEEN, name: t("last15Days") },
    { value: THIRTY, name: t("last30Days") },
    { value: "-1", name: t("customDateRange") },
  ];
  const dateRangeHandler = (e) => {
    setselectedDateRangeOption(e.target.value);
  };

  const filterByDropdownMenu = [
    { value: "L", name: t("draft") },
    { value: "R", name: t("deployed") },
  ];

  const getProcessDetails = (id) => {
    let data = {};

    allProcessList.forEach((item) => {
      if (item.ProcessDefId === id) {
        data = {
          ProjectId: item.ProjectId,
          ProjectName: item.ProjectName,
          ProcessType: item.ProcessType,
          ProcessName: item.ProcessName,
        };
      }
    });

    return data;
  };

  const getProjectName = (projId) => {
    let data = "";

    projectList.forEach((item) => {
      if (item.ProjectId === projId) {
        data = item.ProjectName;
      }
    });

    return data;
  };

  async function fetchData() {
    const { ProjectName, ProjectId, ProcessType, ProcessName } =
      getProcessDetails();

    const lastAuditLog =
      auditLogData.length > 0
        ? auditLogData[auditLogData.length - 1].LogId
        : " ";
    if (fromDate !== "" && toDate !== "") {
      const data = await axios.get(
        SERVER_URL +
          ENDPOINT_GETAUDITLOG +
          `/${
            getProcessDetails(selectedProcessId).ProcessName
          }/${selectedProject}/${getProjectName(selectedProject)}/${filterBy}/${
            selectedProcessId === "" ? "0" : "3"
          }/${moment(fromDate).format("YYYY-MM-DD")}/${moment(toDate).format(
            "YYYY-MM-DD"
          )}/${lastAuditLog}/N/0.0`
      );
      if (data.data?.AuditLog?.Audit.length !== 0) {
        setshowNoAuditLogScreen(false);
        setauditLogData((prevState) =>
          prevState.concat(data.data["AuditLog"]["Audit"])
        );
      } else if (
        data.data["AuditLog"]["Audit"].length === 0 &&
        auditLogData.length === 0
      )
        setshowNoAuditLogScreen(true);
    }
  }

  const handleScroll = async (e) => {
    const hasReachedBottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (hasReachedBottom) {
      fetchData();
    } else return;
  };

  const getProcessInfoFromId = (id) => {
    let temp;
    allProcessList.forEach((item) => {
      if (item.ProcessDefId === id) {
        temp = item;
      }
    });
    return temp;
  };

  const processClickHandler = async (e) => {
    setselectedProcessId(e.target.value);
    const res = await axios.get(
      SERVER_URL +
        `${ENDPOINT_GETALLVERSIONS}/${
          getProcessInfoFromId(e.target.value).ProcessName
        }/${getProcessInfoFromId(e.target.value).ProcessType}`
    );
    if (res.data.Status === 0) {
      setversionList(res.data.Versions);
      setselectedVersion(res.data?.Versions[0].VersionNo);
    } else return;
  };

  const statusHandler = async (val) => {
    setfilterBy(val);
    let endpoint =
      val === "L"
        ? ENDPOINT_GETPROJECTLIST_DRAFTS
        : ENDPOINT_GETPROJECTLIST_DEPLOYED;
    const res = await axios.get(SERVER_URL + endpoint);
    if (res.status === 200) {
      setprojectList(res.data?.Projects);
    }
  };

  const projectHandler = async (val) => {
    setselectedProject(val);
    const res = await axios.get(
      SERVER_URL + ENDPOINT_PROCESSLIST + "/" + filterBy + "/" + val
    );
    if (res.status === 200) {
      setallProcessList(res.data?.Processes);
    }
  };

  return (
    <div className={classes.wrapperDiv}>
      <div className={classes.heading}>
        <p className={classes.bold}>{t("auditLogs")}</p>
        <div className={classes.toolbox}>
        {
          /*code updated on 30 September 2022 for BugId 116351*/
        }
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap:"wrap"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "30px",
                marginRight: selectedDateRangeOption === "-1" ? "0px" : "20px",
              }}
            >
              <p className={classes.toolboxHeading}>{t("dateRange")}</p>
              <Select
                IconComponent={ExpandMoreIcon}
                style={{
                  width: "15.5rem",
                  minHeight: "2.5rem",
                }}
                variant="outlined"
                value={selectedDateRangeOption}
                onChange={dateRangeHandler}
                //autoWidth
              >
                {dropdownDatePicker.map((item) => {
                  return (
                    <MenuItem key={item.value} value={item.value}>
                      <p className={classes.tableCellBody}>{item.name}</p>
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            {selectedDateRangeOption === "-1" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginInline: "20px",
                  alignItems: "center",
                  height: "36px",
                  marginTop: "8px",
                  fontFamily: "Open Sans",
                  fontSize: "0.875rem",
                  fontWeight: "400",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                >
                  <p className={classes.toolboxHeading}>{t("from")}</p>
                  <div
                    tabindex="0"
                    onClick={() =>
                      setflag((p) => {
                        return { dateType: "from", boolean: !p.boolean };
                      })
                    }
                    className={classes.fromToCalculatorDiv}
                    style={{
                      justifyContent:
                        fromDate !== "" ? "space-between" : "flex-end",
                    }}
                  >
                    {fromDate !== ""
                      ? moment(fromDate).format(DATE_FORMAT)
                      : ""}
                    <EventIcon className={classes.eventIcon} />
                  </div>
                  {flag.boolean && flag.dateType === "from" ? (
                    <div className={classes.calender}>
                      <DatePickers
                        name={flag.dateType}
                        onChange={(e) => setDate(e)}
                        timeFormat={false}
                        value={new Date()}
                      />
                    </div>
                  ) : null}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft:
                      flag.boolean && flag.dateType === "from"
                        ? "-130px"
                        : "20px",
                    marginRight:
                      flag.boolean && flag.dateType === "to" ? "-150px" : "0",
                    cursor: "pointer",
                  }}
                >
                  <p className={classes.toolboxHeading}>{t("to")}</p>
                  <div
                    tabindex="0"
                    onClick={() =>
                      setflag((p) => {
                        return { dateType: "to", boolean: !p.boolean };
                      })
                    }
                    className={classes.fromToCalculatorDiv}
                    style={{
                      justifyContent:
                        toDate !== "" ? "space-between" : "flex-end",
                    }}
                  >
                    {toDate !== "" ? moment(toDate).format(DATE_FORMAT) : ""}
                    <EventIcon className={classes.eventIcon} />
                  </div>
                  {flag.boolean && flag.dateType === "to" ? (
                    <div className={classes.calender}>
                      <DatePickers
                        name={flag.dateType}
                        onChange={(e) => setDate(e)}
                        timeFormat={false}
                        value={new Date()}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            <div style={{ marginInline: "1.5rem" }}>
              <p className={classes.toolboxHeading}>{t("status")}</p>
              <Select
                IconComponent={ExpandMoreIcon}
                style={{
                  width: "180px",
                  height: "30px",
                }}
                variant="outlined"
                value={filterBy}
                onChange={(e) => statusHandler(e.target.value)}
                disabled={readOnly}
              >
                {filterByDropdownMenu.map((item) => {
                  return (
                    <MenuItem key={item.value} value={item.value}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <p
                          className={classes.iconForProcessType}
                          style={{
                            backgroundColor: tileProcess(item.value)[4],
                          }}
                        ></p>

                        <p className={classes.tableCellBody}> {item.name} </p>
                      </div>
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            <div style={{ marginInline: "1.5rem" }}>
              <p className={classes.toolboxHeading}>{t("project")}</p>
              <Select
                IconComponent={ExpandMoreIcon}
                style={{
                  width: "180px",
                  height: "30px",
                }}
                variant="outlined"
                value={selectedProject}
                onChange={(e) => projectHandler(e.target.value)}
                disabled={filterBy === "" || !!readOnly}
              >
                {projectList.map((item) => {
                  return (
                    <MenuItem key={item.ProjectId} value={item.ProjectId}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <p className={classes.tableCellBody}>
                          {" "}
                          {item.ProjectName}{" "}
                        </p>
                      </div>
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            <div style={{ marginInline: "1.5rem" }}>
              <p className={classes.toolboxHeading}>{t("processC")}</p>
              <Select
                IconComponent={ExpandMoreIcon}
                style={{
                  width: "180px",
                  height: "30px",
                  overflow: "hidden !important",
                }}
                variant="outlined"
                value={selectedProcessId}
                onChange={(e) => {
                  processClickHandler(e);
                  setauditLogData([]);
                  setgenerateButtonClicked(false);
                }}
                disabled={selectedProject === "" || !!readOnly}
              >
                <MenuItem value="">
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      height: "1.2rem",
                    }}
                  >
                    <p className={classes.tableCellBody}> </p>
                  </div>
                </MenuItem>
                {allProcessList?.map((item) => {
                  return (
                    <MenuItem key={item.ProcessDefId} value={item.ProcessDefId}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          height: "1.2rem",
                        }}
                      >
                        <p
                          className={classes.iconForProcessType}
                          style={{
                            backgroundColor: tileProcess(item.ProcessType)[4],
                          }}
                        ></p>
                        <p className={classes.tableCellBody}>
                          {" "}
                          {item.ProcessName}
                        </p>
                      </div>
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            <div
              style={{
                marginRight: "20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                className={classes.toolboxHeading}
                style={{ whiteSpace: "nowrap" }}
              >
                {t("Version")}
              </p>
              <Select
                IconComponent={ExpandMoreIcon}
                style={{
                  width: "80px",
                  height: "30px",
                }}
                variant="outlined"
                value={selectedVersion}
                onChange={(e) => {
                  setselectedVersion(e.target.value);
                  setauditLogData([]);
                  setshowNoAuditLogScreen(false);
                }}
                disabled={selectedProcessId === "" || !!readOnly}
              >
                {versionList.map((item) => (
                  <MenuItem value={item.VersionNo}>
                    <p className={classes.tableCellBody}>{t(item.VersionNo)}</p>
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div>
            <button
            onClick={() => {
              setauditLogData([]);
              fetchData();
              setgenerateButtonClicked(true);
            }}
            className={classes.generateButton}
            disabled={filterBy === "" || selectedProject === ""}
          >
            <p className={classes.generateText}>{t("generateLogs")}</p>
          </button>
            </div>
          </div>

          
        </div>
      </div>
      {!showNoAuditLogScreen ? (
        generateButtonClicked ? (
          <div
            className={classes.tableContainer}
            style={{ height: readOnly ? "70vh" : "100%" }}
          >
            <TableContainer
              className={classes.queuetable}
              onScroll={handleScroll}
              component={Paper}
            >
              <Table style={{ width: "100%" }}>
                <TableHead className={classes.tableHead}>
                  <TableRow style={{ maxHeight: "2rem" }}>
                    <TableCell
                      width="25%"
                      style={{ paddingBottom: "0" }}
                      align="left"
                    >
                      <p className={classes.tableCellText}>{t("Time")}</p>
                    </TableCell>
                    <TableCell
                      width="25%"
                      style={{ paddingBottom: "0" }}
                      align="left"
                    >
                      <p className={classes.tableCellText}>{t("action")}</p>
                    </TableCell>

                    <TableCell
                      width="25%"
                      style={{ paddingBottom: "0" }}
                      align="left"
                    >
                      <p className={classes.tableCellText}>{t("Version")}</p>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogData.map((item) => {
                    return (
                      <TableRow className={classes.tableRow}>
                        <TableCell
                          width="25%"
                          align="left"
                          component="th"
                          scope="row"
                        >
                          <p className={classes.tableCellBody}>
                            {moment(item.ActionDateTime).format(
                              `${DATE_FORMAT}, ${TIME_FORMAT}`
                            )}
                          </p>
                        </TableCell>
                        <TableCell width="25%" align="left">
                          <p className={classes.tableCellBody}>
                            User: {item.UserName} : {item.ActionName}
                          </p>
                        </TableCell>
                        <TableCell width="25%" align="left">
                          <p className={classes.tableCellBody}>
                            {selectedVersion}
                          </p>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <div
            className={classes.tableCellBody}
            style={{
              fontSize: "var(--title_text_font_size)",
              color: "var(--brand_color1)",
              width: "88vw",
              height: "80vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {t("generateAuditLogsHere")}
          </div>
        )
      ) : (
        <div
          className={classes.tableCellBody}
          style={{
            fontSize: "var(--title_text_font_size)",
            color: "var(--brand_color1)",
            width: "88vw",
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {t("noAuditLogsFound")}
        </div>
      )}
    </div>
  );
}

export default AuditLogs;
