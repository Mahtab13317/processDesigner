import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./ProjectReport.css";
import downloadIcon from "../../../../assets/Download.svg";
import arabicStyles from "./ArabicStyles.module.css";
import { RTL_DIRECTION } from "../../../../Constants/appConstants";

function ArchivedReport(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;

  return (
    <React.Fragment>
      <div className="row">
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

      <div className="row">
        <p
          className={
            direction === RTL_DIRECTION ? arabicStyles.reportName : "reportName"
          }
        >
          Report 1
        </p>
        <p
          className={
            direction === RTL_DIRECTION ? arabicStyles.createdOn : "createdOn"
          }
        >
          29.03.2022
        </p>
        <img style={{ height: "100%" }} src={downloadIcon} />
      </div>

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
    </React.Fragment>
  );
}

export default ArchivedReport;
