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
} from "../../../Constants/appConstants";
import ProcessIconTable from "../../../assets/HomePage/HS_Process.svg";

function PinnedProcesses(props) {
  let { t } = useTranslation();

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
            .slice(0, 4)
    ).map((data, index) => {
      return (
        <React.Fragment>
          <PinnedProcessTile
            index={index}
            name={data.Name}
            versionNo={data.Version}
            modifiedTime={data.ModificationTime}
            projectName={data.Parent}
            processType={data.Status}
            modifiedDate={data.ModificationDate}
            id={data.Id}
          />
        </React.Fragment>
      );
    });
  } else if (props.pinnedListView === 1) {
    const headCells = [
      {
        id: "IC",
        label: "",
        styleTdCell: {
          minWidth: "4.5%",
          width: "4.5%",
          paddingLeft: "10px",
          lineHeight: "0",
        },
      },
      {
        id: "NM",
        label: t("name"),
        styleTdCell: {
          minWidth: "15%",
          width: "39%",
          paddingLeft: "10px",
        },
      },
      {
        id: "ST",
        label: t("status"),
        styleTdCell: { minWidth: "10%", width: "22%" },
      },
      {
        id: "LU",
        label: t("lastUpdatedOn"),
        styleTdCell: { minWidth: "10%", width: "34.5%" },
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
              style={{ width: "18px", height: "17.2px" }}
            />
          </React.Fragment>
        ),
        NM: (
          <React.Fragment>
            <p className="recentTableName">{processData.Name}</p>
            <p className="row recentTableRowCss">
              <p className="recentTableVersion">
                {t("v")}
                {processData.Version}
              </p>
              <p className="recentTableProjectName">{processData.Parent}</p>
            </p>
          </React.Fragment>
        ),
        ST: (
          <React.Fragment>
            <p className="row">
              <img
                style={{
                  height: "10px",
                  width: "10px",
                  marginTop: "1px",
                  marginRight: "0.125vw",
                }}
                src={t(tileProcess(processData.Status)[0])}
                alt=""
              />
              {/*4th index is used for background color*/}
              <p className="recentTableProcessType">
                {t(tileProcess(processData.Status)[1])}{" "}
                {processData.Status == ("RP" || "EP") ? (
                  <img
                    src={t(tileProcess(processData.Status)[5])}
                    alt={t("img")}
                  />
                ) : (
                  ""
                )}
              </p>{" "}
              {/* 1 is used for name and 5th is used for the clock icon */}
            </p>
            <p className="recentTableRowCss">
              {processData.StatusMessage} {t("on")} {processData.CreationDate}
            </p>
          </React.Fragment>
        ),
        LU: (
          <React.Fragment>
            <p className="recentTableProcessDate">
              {processData.ModificationDate}
            </p>
            {processData.SameDate == "true" ? (
              <p className="recentTableRowCss">
                {t("EditedBy")}
                {processData.Editor} {t("at")} {processData.ModificationTime}
              </p>
            ) : (
              <p className="recentTableRowCss">
                {t("EditedBy")}
                {processData.Editor} {t("on")} {processData.ModificationDate}
              </p>
            )}
          </React.Fragment>
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

  return <div className="row">{pinnedDataUI}</div>;
}

export default PinnedProcesses;
