import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./ProjectReport.css";
import { Checkbox } from "@material-ui/core";
import axios from "axios";
import {
  ENDPOINT_PROCESS_REPORT,
  RTL_DIRECTION,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import arabicStyles from "./ArabicStyles.module.css";

function GenrateReport(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [checkSingleProcess, setcheckSingleProcess] = useState(false);
  const [archiveInOmnidoc, setarchiveInOmnidoc] = useState(false);
  const [showText, setshowText] = useState(false);

  const CheckSingleProcessHandler = () => {
    setcheckSingleProcess(!checkSingleProcess);
  };

  const CheckArchiveDocsHandler = () => {
    setarchiveInOmnidoc(!archiveInOmnidoc);
  };

  const cancelHandler = () => {
    props.setShowModal(null);
  };

  const genrateHandler = () => {
    setshowText(true);

    let jsonBody = {
      processImageReqFlag: checkSingleProcess ? "Y" : "N",
      saveInOD: archiveInOmnidoc ? "Y" : "N",
      processVariantReport: props.openProcessType,
      reportFormat: "2",
    };
    // axios.post(SERVER_URL + ENDPOINT_PROCESS_REPORT, jsonBody).then((res) => {
    //   console.log("222222save", res);
    //   if (res.data.Status === 0) {
    //   }
    // });

    axios({
      url: "/pmweb" + ENDPOINT_PROCESS_REPORT, //your url
      method: "POST",
      responseType: "blob", // important
      data: jsonBody,
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
    <div>
      <p
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.formatProcess
            : "formatProcess"
        }
      >
        {t("formatofProcess")}
      </p>

      <div
        className="checklist"
        style={{ marginTop: "1rem", marginLeft: "1rem" }}
      >
        <Checkbox
          checked={checkSingleProcess}
          onChange={() => CheckSingleProcessHandler()}
          style={{
            height: "16px",
            width: "16px",
            marginRight: "8px",
            marginLeft: direction == RTL_DIRECTION ? "20px" : "none",
          }}
        />
        {t("singleProcessImg")}
      </div>

      <div
        className="checklist"
        style={{ marginTop: "1rem", marginLeft: "1rem" }}
      >
        <Checkbox
          checked={archiveInOmnidoc}
          onChange={() => CheckArchiveDocsHandler()}
          style={{
            height: "16px",
            width: "16px",
            marginRight: "8px",
            marginLeft: direction == RTL_DIRECTION ? "20px" : "none",
          }}
        />
        {t("archiveInOmniDocs")}
      </div>

      {showText ? (
        <p className="statementReport">
          1 report added in Archived Reports, Click here to view.
        </p>
      ) : null}

      <div className="footerProjectReport">
        <button
          className={
            direction === RTL_DIRECTION ? arabicStyles.cancel : "cancel"
          }
          onClick={cancelHandler}
          id="cancelBtn_projectReport"
        >
          {t("cancel")}
        </button>
        <button
          className="createProperties"
          onClick={genrateHandler}
          id="createBtn_projectReport"
        >
          {t("genrate")}
        </button>
      </div>
    </div>
  );
}

export default GenrateReport;
