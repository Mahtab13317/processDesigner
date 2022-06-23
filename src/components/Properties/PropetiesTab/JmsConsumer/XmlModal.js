import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./JmsConsumer.module.css";
import axios from "axios";
import {
  ENDPOINT_READXML,
  SERVER_URL,
} from "../../../../Constants/appConstants";

function XmlModal(props) {
  let { t } = useTranslation();
  const [inputXml, setinputXml] = useState(
    `<start>\n<data1>${t("testData1")}</data1>\n<data2>${t(
      "testData2"
    )}</data2>\n</start>`
  );

  const inputXMLHandler = (e) => {
    setinputXml(e.target.value);
  };

  const readXmlHandler = () => {
    let jsonBody = {
      inputXML: inputXml,
      destinationName: props.destinationName,
      processDefId: props.processId,
      activityId: props.activityId,
    };
    axios.post(SERVER_URL + ENDPOINT_READXML, jsonBody).then((res) => {
      if (res.data.Status === 0) {
        props.responseXmlData(res.data);
        props.setModalClicked(false);
      }
    });
  };

  return (
    <div>
      <React.Fragment>
        <h5 className={styles.readXml}>{t("readXml")}</h5>
        <p className={styles.pasteXml}>{t("pastexml")}</p>
        <textarea
          className={styles.inputXml}
          onChange={(e) => inputXMLHandler(e)}
          value={inputXml}
          id="inportTextBox"
        />
        <button
          className={styles.readXmlBtn}
          onClick={() => readXmlHandler()}
          id="readXml"
        >
          {t("readXml")}
        </button>
      </React.Fragment>
    </div>
  );
}

export default XmlModal;
