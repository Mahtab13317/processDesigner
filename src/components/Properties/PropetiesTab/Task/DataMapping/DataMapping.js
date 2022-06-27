import React, { useEffect, useState } from "react";
import { Select, MenuItem, Checkbox } from "@material-ui/core";
import { store, useGlobalState } from "state-pool";
import classes from "../Task.module.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useTranslation } from "react-i18next";

function DataMapping(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [taskVariables, settaskVariables] = React.useState([]);
  const varDef = store.getState("variableDefinition");
  const actProperty = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(actProperty);
  const [localVarDef] = useGlobalState(varDef);
  const [dataMapping, setdataMapping] = useState();

  useEffect(() => {
    settaskVariables(props.taskInfo.TaskTemplateVar);
  }, [props.taskInfo?.TaskTemplateVar]);

  useEffect(() => {
    localLoadedActivityPropertyData.ActivityProperty.Interfaces?.TaskTypes?.forEach(
      (task) => {
        if (task.TaskId === props.taskInfo.TaskId) {
          setdataMapping(task);
        }
      }
    );
  }, [localLoadedActivityPropertyData.ActivityProperty?.Interfaces]);

  const changeDataMapping = (e, task) => {
    let temp = JSON.parse(JSON.stringify(dataMapping));
    temp?.VariableMappings?.forEach((data) => {
      if (data.TaskVariableName === task.TaskVariableName) {
        data.VariableId = e.target.value + "";
      }
    });
    setdataMapping(temp);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "40vh",
        fontFamily: "Open Sans",
        padding: "0.5rem",
        direction: direction,
      }}
    >
      <TableContainer
        className={classes.queuetable}
        style={{ direction: direction }}
        //   component={Paper}
      >
        <Table style={{ width: "100%" }}>
          <TableHead className={classes.tableHead}>
            <TableRow style={{ maxHeight: "2rem" }}>
              <TableCell
                width="33%"
                style={{ paddingBottom: "0" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <p className={classes.tableCellText}>Task Variable</p>
              </TableCell>
              <TableCell
                width="47%"
                style={{ paddingBottom: "0" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <p className={classes.tableCellText}>Process Variable(s)</p>
              </TableCell>
              <TableCell
                width="20%"
                style={{ paddingBottom: "0" }}
                align={direction === "rtl" ? "right" : "left"}
              >
                <p className={classes.tableCellText}>Read Only</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataMapping &&
              dataMapping.VariableMappings.length > 0 &&
              dataMapping.VariableMappings.map((task) => (
                <TableRow className={classes.tableRow}>
                  <TableCell
                    width="33%"
                    align={direction === "rtl" ? "right" : "left"}
                    component="th"
                    scope="row"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          color: "#000000",
                        }}
                      >
                        {task.TaskVariableName}
                      </p>
                      <p
                        style={{ marginRight: "-1rem", paddingTop: "0.25rem" }}
                      >
                        =
                      </p>
                    </div>
                  </TableCell>
                  <TableCell
                    width="47%"
                    align={direction === "rtl" ? "right" : "left"}
                  >
                    <Select
                      IconComponent={ExpandMoreIcon}
                      style={{
                        width: "75%",
                        height: "30px",
                      }}
                      // variant="outlined"
                      value={task.VariableId}
                      onChange={(e) => changeDataMapping(e, task)}
                    >
                      <MenuItem value="selectVar">
                        <p className={classes.tableCellBody}>Select Variable</p>
                      </MenuItem>
                      {localVarDef.map((item) => {
                        return (
                          <MenuItem
                            key={item.VariableId}
                            value={item.VariableId}
                          >
                            <p className={classes.tableCellBody}>
                              {item.VariableName}
                            </p>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </TableCell>
                  <TableCell
                    width="20%"
                    align={direction === "rtl" ? "right" : "left"}
                  >
                    <Checkbox checked={task.ReadOnly === "Y" ? true : false} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default DataMapping;
