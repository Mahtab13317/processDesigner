import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Checkbox, Tabs, Tab } from "@material-ui/core";
import classes from "../Task.module.css";
import { TabPanel } from "../Task";
import { store, useGlobalState } from "state-pool";
import { useTranslation } from "react-i18next";

function ManageRights(props) {
  let {t} = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const actProperty = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(actProperty);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [docRights, setdocRights] = useState([]);
  const [activeTask, setactiveTask] = useState();
  useEffect(() => {
    let tabNames = [];
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    temp.ActivityProperty.Interfaces.TaskTypes.forEach((task) => {
      if (task.TaskId === props.taskInfo.TaskId) {
        setactiveTask(task);
        task.TaskAssociation.forEach((right) => {
          if (Object.keys(right)[0] === "TaskExceptionTypes") {
            tabNames.push("Exceptions");
          }
          if (Object.keys(right)[0] === "TaskDocumentTypes") {
            tabNames.push("Documents");
          }

          if (Object.keys(right)[0] === "TaskForms") {
            tabNames.push("Forms");
          }
          if (Object.keys(right)[0] === "TaskTodos") {
            tabNames.push("Todos");
          }
          setdocRights(tabNames);
        });
      }
    });
  }, [props.taskInfo.TaskId]);

  const [propertyTabValue, setpropertyTabValue] = useState("Forms");

  const getTabPanels = () => {
    return <RightsTable val={propertyTabValue} activeTask={activeTask} />;
  };
  return (
    <div
      style={{
        width: "100%",
        height: "40vh",
        fontFamily: "Open Sans",
        // padding: "0.5rem",
        direction: direction
      }}
    >
      <TabPanel style={{ height: "10px", width: "100%" }}>
        <Tabs
          value={propertyTabValue}
          // variant="scrollable"
          onChange={(e, val) => setpropertyTabValue(val)}
          className={props.styling.tabsHorizontal}
        >
          {docRights.map((rights) => (
            <Tab
              classes={{ root: props.styling.tabRoot }}
              label={rights}
              value={rights}
            />
          ))}
        </Tabs>

        {getTabPanels()}
      </TabPanel>
    </div>
  );
}

function RightsTable({ val, activeTask }) {
  let {t}=useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [tableHeaders, settableHeaders] = useState([]);
  const [tableWidth, settableWidth] = useState();
  const [rightsAssociated, setrightsAssociated] = useState([]);
  const [formsArray, setformsArray] = useState([]);
  const [exceptionsArray, setexceptionsArray] = useState([]);
  const [documentsArray, setdocumentsArray] = useState([]);
  const [todosArray, settodosArray] = useState([]);
  const [CurrentTab, setCurrentTab] = useState();

  useEffect(() => {
    activeTask &&
      activeTask.TaskAssociation.forEach((right) => {
        if (Object.keys(right)[0] === "TaskExceptionTypes") {
          setexceptionsArray(Object.values(right)[0]);
        }
        if (Object.keys(right)[0] === "TaskDocumentTypes") {
          setdocumentsArray(Object.values(right)[0]);
        }

        if (Object.keys(right)[0] === "TaskForms") {
          setformsArray([{ FormName: "Default", Modify: "N", Raise: "N" }]);
        }
        if (Object.keys(right)[0] === "TaskTodos") {
          settodosArray(Object.values(right)[0]);
        }
      });
  }, [val, activeTask]);

  useEffect(() => {
    if (val === "Forms") {
      settableHeaders([
        { name: t("formname") },
        { name: t("modify") },
        { name: t("readonly") },
      ]);
      settableWidth("33%");
    } else if (val === "Exceptions") {
      settableHeaders([
        { name: t("ExceptionName") },
        { name: t("view") },
        { name: t("raise") },
        { name: t("respond") },
        { name: t("clear") },
      ]);
      settableWidth("20%");
    } else if (val === "Todos") {
      settableHeaders([
        { name: "Todo Name", value: "Default" },
        // { name: "View", value: <Checkbox size="small" /> },
        // { name: "Raise", value: <Checkbox size="small" /> },
        // { name: "Respond", value: <Checkbox size="small" /> },
        // { name: "Clear", value: <Checkbox size="small" /> },
      ]);
      settableWidth("20%");
    } else {
      settableHeaders([
        { name: "Document Name" },
        { name: "Add" },
        { name: "View" },
        { name: "Modify" },
      ]);
      settableWidth("25%");
    }
    setCurrentTab(val);
  }, [val]);

  const YNConvert = (data) => {
    if (data === "Y") return true;
    else return false;
  };

  const dataForTabs = () => {
    if (CurrentTab === "Exceptions") {
      return (
        <>
          {exceptionsArray.map((exception) => (
            <TableRow className={classes.tableRow}>
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <p style={{ fontSize: "0.8rem", fontWeight: "500" }}>
                  {exception.ExceptionName}
                </p>
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <Checkbox size="small" checked={YNConvert(exception.View)} />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <Checkbox size="small" checked={YNConvert(exception.Raise)} />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <Checkbox size="small" checked={YNConvert(exception.Respond)} />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <Checkbox size="small" checked={YNConvert(exception.Clear)} />
              </TableCell>
            </TableRow>
          ))}
        </>
      );
    } else if (CurrentTab === "Documents") {
      return (
        <>
          {documentsArray.map((document) => (
            <TableRow className={classes.tableRow}>
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <p style={{ fontSize: "0.8rem", fontWeight: "500" }}>
                  {document.DocTypeName}
                </p>
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <Checkbox size="small" checked={YNConvert(document.Add)} />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <Checkbox size="small" checked={YNConvert(document.Modify)} />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <Checkbox size="small" checked={YNConvert(document.View)} />
              </TableCell>
            </TableRow>
          ))}
        </>
      );
    } else if (CurrentTab === "Forms") {
      return (
        <>
          {formsArray.map((form) => (
            <TableRow className={classes.tableRow}>
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <p style={{ fontSize: "0.8rem", fontWeight: "500" }}>
                  {form.FormName === "null" ? "Default" : form.FormName}
                </p>
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <Checkbox
                  size="small"
                  disabled={form.TaskForm_Id === null ? true : false}
                  checked={YNConvert(form.Modify)}
                />
              </TableCell>
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <Checkbox
                  size="small"
                  disabled={form.TaskForm_Id === null ? true : false}
                  checked={YNConvert(form.Raise)}
                />
              </TableCell>
            </TableRow>
          ))}
        </>
      );
    }
  };

  return (
    <TableContainer className={classes.queuetable} component={Paper}>
      <Table style={{ width: "100%" }}>
        <TableHead className={classes.tableHead}>
          <TableRow style={{ maxHeight: "2rem" }}>
            {tableHeaders.map((header) => (
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                 align={direction==="rtl" ? "right":"left"}
              >
                <p className={classes.tableCellText}>{header.name}</p>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {tableHeaders.map((header) => (
              <TableCell
                width={tableWidth}
                style={{ paddingBottom: "0" }}
                align="left"
              >
                <p style={{ fontSize: "0.8rem", fontWeight: "500" }}>
                  {header.value}
                </p>
              </TableCell>
            ))} */}
          {dataForTabs()}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ManageRights;
