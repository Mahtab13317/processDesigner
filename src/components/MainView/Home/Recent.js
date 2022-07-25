import React from "react";
import RecentActivity from "../../../UI/StickyHeadTable/TabularData";
import { useTranslation } from "react-i18next";
import ProcessIconTable from "../../../assets/HomePage/HS_Process.svg";
import { makeStyles } from "@material-ui/core/styles";
import { tileProcess } from "../../../utility/HomeProcessView/tileProcess";
import "./Home.css";
import axios from "axios";
import {
  SERVER_URL_LAUNCHPAD,
  ENDPOINT_FETCHRECENTS,
  RECENT_TABLE_CATEGORY,
} from "../../../Constants/appConstants";

const useStyles = makeStyles({
  listItemIconRoot: {
    minWidth: "25px",
  },
  listItemTextRoot: {
    marginTop: "2px",
    marginBottom: "2px",
    "& span": {
      fontSize: "12px",
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
    fontFamily: "Open Sans",
    fontWeight: "600",
    fontSize: "11px",
  },
});

function Recent() {
  let { t } = useTranslation();
  const classes = useStyles();

  const [recentsData, setrecentsData] = React.useState();

  React.useEffect(() => {
    async function fetchRecentsData() {
      try {
        const res = await axios.get(
          SERVER_URL_LAUNCHPAD + ENDPOINT_FETCHRECENTS + "/1"
        );
        setrecentsData(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchRecentsData();
  }, []);

  const checkToday = (data) => {
    if (data.sameDate === true) return "Today";
    else return data.accessedDate;
  };

  const headCells = [
    {
      id: "IC",
      label: "",
      styleTdCell: {
        minWidth: "3.7vw",
        paddingLeft: "0.7rem",
        paddingTop: "0.55rem",
      },
    },
    {
      id: "NM",
      label: t("name"),
      styleTdCell: {
        minWidth: "24.2vw",
        width: "24.2vw",
        fontFamily: "Open Sans",
      },
    },
    {
      id: "ST",
      label: t("status"),
      styleTdCell: { minWidth: "17.1vw", fontFamily: "Open Sans" },
    },
    {
      id: "LU",
      label: t("lastOpenedOn"),
      styleTdCell: { minWidth: "23vw", fontFamily: "Open Sans" },
    },
  ];

  let rowCount = 0;

  const filteredCategory = RECENT_TABLE_CATEGORY?.filter((category) => {
    if (recentsData !== undefined) {
      if (recentsData[category] && recentsData[category].length > 0) {
        return category;
      }
    }
  });

  const recentsTable = filteredCategory.map((key, index) => ({
    rowId: index,
    category: key,
    value:
      recentsData[key] &&
      recentsData[key].map((elem) => {
        rowCount++;
        return {
          IC: (
            <div>
              <img
                src={ProcessIconTable}
                alt=""
                style={{ width: "18px", height: "17.2px" }}
              />
            </div>
          ),
          NM: (
            <div>
              <p
                className="recentTableName"
                style={{ fontFamily: "Open Sans", fontWeight: "600" }}
              >
                {elem.name}
              </p>
              <p className="recentTableName" style={{ color: "#828282" }}>
                <span style={{ color: "#828282" }}>
                  v {parseFloat(elem.version).toPrecision(2)}
                </span>
                {"  .  "}
                {elem.parentName}
              </p>
            </div>
          ),
          ST: (
            <div>
              <div className={classes.statusSubDiv}>
                <img
                  style={{
                    height: "10px",
                    width: "10px",
                    marginTop: "1px",
                    marginRight: "0.125vw",
                  }}
                  src={t(tileProcess(elem.status)[0])}
                  alt=""
                />
                <p className={classes.processType}>
                  {t(tileProcess(elem.status)[1])}{" "}
                  <img src={tileProcess(elem.status)[5]} alt="" />
                </p>
                <span>
                  {tileProcess(elem.status)[8] ? `(${t("Checked")})` : null}
                </span>
              </div>
              <p>
                {elem.statusMsg} {t("on")} {elem.statusDate}
              </p>
            </div>
          ),
          LU: (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p
                  className="recentTableProcessDate"
                  style={{ fontFamily: "Open Sans", fontWeight: "600" }}
                >
                  {checkToday(elem)} {t("at")} {elem.accessedTime}
                </p>
                <p>
                  {t("editedBy")} <span>{elem.editor}</span> {t("at")}{" "}
                  {elem.modificationTime}
                </p>
              </div>
            </div>
          ),
          name: elem.name,
          status: elem.status,
          parent: elem.parentName,
          version: elem.version,
          ProcessId: elem.id,
          allData: elem,
        };
      }),
  }));

  return (
    <div>
      <RecentActivity
        tableHead={headCells}
        divider={true}
        isSearch={true}
        direction={`${t("HTML_DIR")}`}
        styleDivider={{
          height: "4px",
          width: "100%",
          margin: "0",
          background: "#f8f8f8",
          display: "block",
        }}
        searchProps={{
          searchingKey: "name",
          placeholder: `${t("Search Here")}`,
          regex: null,
        }}
        rows={recentsTable}
        rowNo={rowCount}
      />
    </div>
  );
}

export default Recent;
