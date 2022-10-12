import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import styles from "./QueueSwimlanes.module.css";
import { useGlobalState } from "state-pool";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {
  PROCESSTYPE_LOCAL,
  ENDPOINT_DEFAULTQUEUE,
  SERVER_URL,
} from "../../../Constants/appConstants";
import axios from "axios";

function QueueSwimlanes(props) {
  let { t } = useTranslation();

  const [localLoadedProcess, setLocalLoadedProcess, updateLocalLoadedProcess] =
    useGlobalState("loadedProcessData");
  const [lanes, setLanes] = useState([]);
  const [defaultDropdown, setdefaultDropdown] = useState();
  const [lanesQueueInfoArr, setlanesQueueInfoArr] = useState([]);

  React.useEffect(() => {
    async function fetchDefaultValuesForLanes() {
      const res = await axios.get(
        `${SERVER_URL}${ENDPOINT_DEFAULTQUEUE}/${localLoadedProcess.ProcessDefId}/${localLoadedProcess.ProcessType}`
      );
      if (res.status === 200 && res.data.Status === 0) {
        const lanesWithoutTaskLane = localLoadedProcess.Lanes?.filter(
          (item) => item.LaneId !== -99
        ).map((lane) => {
          res.data?.LaneQueueConfig.forEach((queueInfo) => {
            if (lane.LaneId + "" === queueInfo.LaneId + "") {
              lane.DefaultQueue = queueInfo.DefaultQueue;
            }
          });
          return lane;
        });
        setLanes(lanesWithoutTaskLane);
      }
    }

    fetchDefaultValuesForLanes();
  }, []);

  const handleChange = async (event, row) => {
    const res = await axios.post(SERVER_URL + ENDPOINT_DEFAULTQUEUE, {
      processDefId: localLoadedProcess.ProcessDefId,
      laneName: row.LaneName,
      laneId: row.LaneId,
      m_bDefaultQueueActs: event.target.value === "N" ? false : true,
    });
    if (res.data.status === 0) {
      setLanes((prev) => {
        let temp = global.structuredClone(prev);
        temp.forEach((lane) => {
          if (lane.LaneId + "" === row.LaneId + "") {
            lane.DefaultQueue = event.target.value;
          }
        });
        return temp;
      });
    }
  };

  const direction = `${t("HTML_DIR")}`;

  return (
    <div className={styles.modaldiv}>
      <p
        style={{
          textAlign: direction === "rtl" ? "right" : null,
          margin:
            direction === "rtl" ? "0 1.4rem 1.5rem 0" : "0 0 1.5rem 1.4rem",
        }}
        className={styles.heading}
      >
        {t("defaultQueuesForActivity")}
      </p>

      <TableContainer
        className={styles.queuetable}
        style={{
          margin: direction === "rtl" ? "0 0.6rem 0 0" : "0 0 0 0.6rem",
        }}
        component={Paper}
      >
        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow style={{ maxHeight: "2rem" }}>
              <TableCell width="10%" style={{ padding: "0" }} align="center">
                <p className={styles.tableCellText}>{t("slNo")}</p>
              </TableCell>
              <TableCell width="10%" style={{ padding: "0" }} align="left">
                <p className={styles.tableCellText}>{t("swimlaneName")}</p>
              </TableCell>
              <TableCell width="10%" style={{ padding: "0" }} align="center">
                <p className={styles.tableCellText}>{t("defaultQueue")}</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lanes.map((row, id = 0) => (
              <TableRow className={styles.tableRow} key={++id}>
                <TableCell
                  style={{ padding: "0.5rem 0 0.5rem 0" }}
                  width="10%"
                  align="center"
                  component="th"
                  scope="row"
                >
                  {++id}
                </TableCell>
                <TableCell
                  style={{ padding: "0.5rem 0 0.5rem 0" }}
                  width="10%"
                  align="left"
                >
                  <p className={styles.tableCellBody}>{row.LaneName}</p>
                </TableCell>
                <TableCell
                  style={{ padding: "0.5rem 0 0.5rem 0" }}
                  width="10%"
                  align="center"
                >
                  <Select
                    variant="outlined"
                    //autoWidth
                    value={row.DefaultQueue}
                    onChange={(e) => handleChange(e, row)}
                    className={styles.dropDown}
                    disabled={
                      props.processType !== PROCESSTYPE_LOCAL ? true : ""
                    }
                  >
                    <MenuItem
                      style={{ width: "16rem", margin: "0.5rem" }}
                      value={"N"}
                    >
                      <p style={{ font: "0.8rem Open Sans" }}>
                        {t("swimLaneQueue")}
                      </p>
                    </MenuItem>
                    <MenuItem
                      style={{ width: "16rem", margin: "0.5rem" }}
                      value={"Y"}
                    >
                      <p style={{ font: "0.8rem Open Sans" }}>
                        {t("activitySpecificQueue")}
                      </p>
                    </MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default QueueSwimlanes;
