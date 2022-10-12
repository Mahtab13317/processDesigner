import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./JmsConsumer.module.css";
import axios from "axios";
import {
  ENDPOINT_READXML,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { Buffer } from "buffer";

function XmlModal(props) {
  let { t } = useTranslation();
  const { responseXmlData, setModalClicked } = props;
  const [inputXml, setinputXml] = useState(
    `<start>\n<data1>${t("testData1")}</data1>\n<data2>${t(
      "testData2"
    )}</data2>\n</start>`
  );

  // Function that gets called when the user changes the input XML.
  const inputXMLHandler = (e) => {
    setinputXml(e.target.value);
  };

  // Function that encodes the input XML into Base64.
  const encodeBase64 = (data) => {
    return Buffer.from(data).toString("base64");
  };

  // Function that calls the API that reads the XML.
  const readXmlHandler = async () => {
    console.log("999", "INPUT XML", inputXml);
    const encodedInputXml = encodeBase64(inputXml);
    let jsonBody = {
      xmlString: encodedInputXml,
    };
    const config = { headers: { "Content-Type": "application/json" } };
    const res = await axios.post(
      SERVER_URL + ENDPOINT_READXML,
      jsonBody,
      config
    );
    responseXmlData(res?.data);
    setModalClicked(false);
  };

  return (
    <div>
      <React.Fragment>
        <p className={styles.readXml}>{t("InputXML")}</p>
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
