// Changes made to solve Bug 113657 - Process Report: Not able to download archived reports in Process report
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./ProjectReport.css";
import { connect, useSelector } from "react-redux";
import downloadIcon from "../../../../assets/Download.svg";
import arabicStyles from "./ArabicStyles.module.css";
import { RTL_DIRECTION } from "../../../../Constants/appConstants";
import axios from "axios";
import {
  SERVER_URL,
  ENDPOINT_GET_ARCHIEVE_PROCESS_REPORTLIST,
  ENDPOINT_DOWNLOAD_ARCHIEVE_REPORT,
} from "../../../../Constants/appConstants";

function ArchivedReport(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [reportList, setReportList] = useState([]);
  useEffect(() => {
    axios
      .get(SERVER_URL + ENDPOINT_GET_ARCHIEVE_PROCESS_REPORTLIST)
      .then((res) => {
        setReportList(res.data);
      });
  }, []);

  const handleArchieveDownLoad = (report) => {
    console.log("REPORT", report);
    axios({
      url:
        "/pmweb" +
        ENDPOINT_DOWNLOAD_ARCHIEVE_REPORT +
        `?sIndex=${btoa(report.iSINdex)}&fileName=${props.openProcessName}`, //your url
      method: "GET",
      responseType: "blob", // important
    }).then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: res.headers["content-type"],
        })
      );
      var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      var matches = filenameRegex.exec(res.headers["content-disposition"]);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", matches[1].replace(/['"]/g, "")); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  };
  return (
    <div
      style={{
        margin: "10px 20px",
        backgroundColor: "#F8F8F8",
        height: "253px",
        overflow:'scroll'
      }}
    >
      <div className="row" style={{height:'40px'}}>
        <p
          className={
            direction === RTL_DIRECTION ? arabicStyles.reportName : "reportName"
          }
          style={{ fontWeight: "600" }}
        >
          {t("reportName")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION ? arabicStyles.createdOn : "createdOn"
          }
          style={{ fontWeight: "600" }}
        >
          {t("createdOn")}
        </p>
      </div>
      {reportList?.map((el) => {
        return (
          <div
            style={{
              height: "40px",
              backgroundColor: "white",
              margin: "5px 10px",
              padding: "0px 6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p>{el.docName}</p>
            <p>{el.addedTime}</p>
            <img
              style={{ height: "16px", width: "16px", cursor:'pointer'}}
              src={downloadIcon}
              onClick={() => handleArchieveDownLoad(el)}
            />
          </div>
        );
      })}
      <div className="footerProjectReport">
        <button
          className="cancel"
          // onClick={createHandler}
          id="createBtn_projectReport"
          style={{ background: "#0072c6", color: "white", borderRadius: "2px" }}
        >
          {t("ok")}
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessName: state.openProcessClick.selectedProcessName,
  };
};
export default connect(mapStateToProps, null)(ArchivedReport);
