import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PinnedProcessTile from "../../../UI/PinnedProcessTile/PinnedProcessTile";
import processIcon from "../../../assets/HomePage/processHeader.svg";

import { tileProcess } from "../../../utility/HomeProcessView/tileProcess";
import TabularData from "../../../UI/TabularData/TabularData";
import "./Home.css";
import axios from "axios";
import {
  SERVER_URL_LAUNCHPAD,
  PMWEB_CONTEXT,
  PMWEB,
} from "../../../Constants/appConstants";
import ProcessIconTable from "../../../assets/HomePage/HS_Process.svg";
import { makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setToastDataFunc } from "../../../redux-store/slices/ToastDataHandlerSlice";

const useStyles = makeStyles({
  listItemIconRoot: {
    minWidth: "25px",
  },
  listItemTextRoot: {
    marginTop: "2px",
    marginBottom: "2px",
    "& span": {
      fontSize: "var(--base_text_font_size)",
    },
  },
  svgIconSmall: {
    fontSize: "1.12rem",
  },
  statusSubDiv: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  processType: {
    textTransform: "uppercase",
    fontFamily: "var(--font_family)",
    fontWeight: "600",
    fontSize: "11px",
  },
  checkedType: {
    fontFamily: "var(--font_family)",
    fontSize: "11px",
  },
});

function PinnedProcesses(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [pinnedData, setpinnedData] = React.useState([]);
  useEffect(() => {
    async function getPinnedProcesses() {
      const res = await axios.get(SERVER_URL_LAUNCHPAD + "/pinnedList/1");
      if (res) {
        setpinnedData(res.data);
        props.pinnedDataList(res.data);
        props.getPinnedDataLength(res.data.length);
      }
    }
    getPinnedProcesses();
  }, []);
  const handleUnpin = (e, data) => {
    axios
      .post(SERVER_URL_LAUNCHPAD + "/unpin", {
        status: data.Status,
        id: data.Id,
        applicationName: PMWEB,
        applicationId: "1",

        type: data.Type,
      })
      .then((response) => {
        if (response.data.Status === 0) {
          const newPinnedData = pinnedData.filter(
            (pinnedItem) => pinnedItem.Id !== data.Id
          );
          setpinnedData(newPinnedData);
          props.pinnedDataList(newPinnedData);
          props.getPinnedDataLength(newPinnedData.length);
          dispatch(
            setToastDataFunc({
              message: t("unpinSuccess"),
              severity: "success",
              open: true,
            })
          );
        }
      });
    e.stopPropagation();
  };

  // {Id:23,Name:'Expense Approval', Version:'2.1', Parent:'Expense Reporting', Type:'L', ModificationDate:'7 Mar, 05:06PM', Status:"Created", StatusDate:"12 Jan", Editor:"Sejal", EditDateTime:"4:00AM"},

  let pinnedDataUI = null;

  if (props.pinnedListView === 0) {
    pinnedDataUI = (
      props.bViewAll
        ? pinnedData
        : pinnedData
            ?.sort(function sortPinnedData(a, b) {
              return a.OrderId - b.OrderId;
            })
            ?.slice(0, 4)
    ).map((data, index) => {
      return (
        <PinnedProcessTile
          index={index}
          name={data.Name}
          versionNo={data.Version}
          modifiedTime={data.ModificationTime}
          projectName={data.Parent}
          processType={data.Status}
          modifiedDate={data.ModificationDate}
          id={data.Id}
          handleUnpin={(e) => handleUnpin(e, data)}
        />
      );
    });
  } else if (props.pinnedListView === 1) {
    const headCells = [
      {
        id: "IC",
        label: "",
        styleTdCell: {
          minWidth: "3.7vw",
          width: "3.7vw",
          paddingLeft: "0.7rem",
          lineHeight: "0",
        },
      },
      {
        id: "NM",
        label: t("name"),
        styleTdCell: {
          minWidth: "24.2vw",
          width: "24.2vw",
        },
      },
      {
        id: "ST",
        label: t("status"),
        styleTdCell: { minWidth: "17.1vw", width: "17.1vw" },
      },
      {
        id: "LU",
        label: t("lastUpdatedOn"),
        styleTdCell: { minWidth: "23.5vw", width: "23.5vw" },
      },
    ];

    const rows = (props.bViewAll ? pinnedData : pinnedData.slice(0, 4)).map(
      (processData, index) => ({
        rowId: index,
        IC: (
          <React.Fragment>
            <img
              src={ProcessIconTable}
              alt={t("img")}
              style={{ width: "1.5rem", height: "1.5rem" }}
            />
          </React.Fragment>
        ),
        NM: (
          <React.Fragment>
            <p
              className="recentTableName"
              style={{ fontFamily: "var(--font_family)", fontWeight: "600" }}
            >
              {processData.Name}
            </p>
            <p
              className="recentTableName"
              style={{ color: "#828282", fontSize: "11px" }}
            >
              <span style={{ color: "#828282" }}>
                {t("v")}
                {processData.Version}
              </span>
              {"  .  "}
              {processData.Parent}
            </p>
          </React.Fragment>
        ),
        ST: (
          <React.Fragment>
            <div className={classes.statusSubDiv}>
              <img
                style={{
                  height: "0.75rem",
                  width: "0.75rem",
                  marginTop: "1px",
                  marginRight: "0.125vw",
                }}
                src={t(tileProcess(processData.Status)[0])}
                alt=""
              />
              <p className={classes.processType}>
                {t(tileProcess(processData.Status)[1])}{" "}
                <img src={tileProcess(processData.Status)[5]} alt="" />
              </p>
              <span className={classes.checkedType}>
                {tileProcess(processData.Status)[8]
                  ? `(${t("Checked")})`
                  : null}
              </span>
              {/* 1 is used for name and 5th is used for the clock icon */}
            </div>
            <p style={{ fontSize: "11px" }}>
              {processData.StatusMessage} {t("on")} {processData.CreationDate}
            </p>
          </React.Fragment>
        ),
        LU: (
          <div>
            <p
              className="recentTableProcessDate"
              style={{
                fontFamily: "var(--font_family)",
                fontWeight: "600",
                fontSize: "11px",
              }}
            >
              {processData.ModificationDate}
            </p>
            <p
              style={{
                fontFamily: "var(--font_family)",
                fontSize: "11px",
              }}
            >
              {t("editedBy")} <span>{processData.Editor} </span>
              {processData.SameDate == "true" ? (
                <span>
                  {t("at")} {processData.ModificationTime}
                </span>
              ) : (
                <span>
                  {t("on")} {processData.ModificationDate}
                </span>
              )}
            </p>
          </div>
        ),
        data: (
          <div>
            {processData.Name}
            {processData.Id}
            {processData.Status}
            {processData.Parent}
            {processData.Version}
          </div>
        ),
      })
    );

    return (
      <div className="PinnedTableDiv">
        <TabularData
          extendHeight={false}
          tableHead={headCells}
          parenrRef={props.parenrRef}
          divider={true}
          styleDivider={{
            height: "5px",
            width: "100%",
            margin: "0",
            background: "#f8f8f8",
            display: "block",
          }}
          rows={rows}
          updateTablePosition={props.updateTablePosition}
        />
      </div>
    );
  }

  return (
    <div className="row" style={{ gap: "1vw" }}>
      {pinnedDataUI}
    </div>
  );
}

export default PinnedProcesses;
