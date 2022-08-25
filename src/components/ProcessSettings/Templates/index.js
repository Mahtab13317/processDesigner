import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import clsx from "clsx";
import axios from "axios";
import {
  SERVER_URL,
  ENDPOINT_GET_REGISTER_TEMPLATE,
  CONFIG,
} from "../../../Constants/appConstants";
import Modal from "../../../UI/Modal/Modal";
import { useTranslation } from "react-i18next";
import TemplateModal from "./TemplateModal/index";
import EditLogo from "../../../assets/bpmnViewIcons/EditIcon.svg";
import cancelIcon from "../../../assets/abstractView/RedDelete.svg";

function Templates(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [templateData, setTemplateData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedTool, setSelectedTool] = useState("");
  // const [configData, setConfigData] = useState([]);
  // const [toolsList, setToolsList] = useState([]);
  const [selected, setselected] = useState(null);

  useEffect(() => {
    axios.get(SERVER_URL + ENDPOINT_GET_REGISTER_TEMPLATE).then((res) => {
      setTemplateData(res.data);
      if (res.data.Status === 0) {
        setTemplateData(res.data);
      }
    });
  }, []);

  // useEffect(() => {
  //   if (configData) {
  //     let listOfTools = [];
  //     configData &&
  //       configData.forEach((element) => {
  //         listOfTools.push(element.Tool);
  //       });
  //     setToolsList(listOfTools);
  //   }
  // }, [configData]);

  const deleteHandler = (id, index) => {
    let postBody = {
      templateId: id,
    };
    axios
      .delete(SERVER_URL + ENDPOINT_GET_REGISTER_TEMPLATE, {
        data: postBody,
        headers: { "Content-Type": "application/json" },
      })

      .then((res) => {
        let temp = [...templateData];

        temp.splice(index, 1);

        setTemplateData(temp);
      });
  };

  const editHandler = (el) => {
    setselected(el);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className={styles.mainDiv}>
        <div>
          <p className={styles.mainHeading}>{t("templates")}</p>
          <p className={styles.description}>{t("listOfTrigger")}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.registerTemplateButton}
          >
            <span> {"Register Template"}</span>
          </button>
          {isModalOpen ? (
            <Modal
              show={isModalOpen}
              modalClosed={() => setIsModalOpen(false)}
              style={{
                width: "26%",
                height: "84%",
                left: "37%",
                top: "11%",
                padding: "1%",
                paddingTop: 0,
              }}
            >
              <TemplateModal
                setTemplateData={setTemplateData}
                setIsModalOpen={setIsModalOpen}
                selected={selected}
              />
            </Modal>
          ) : null}
        </div>

        <div className={styles.tableHeadingBar}>
          <div className={styles.flexRow}>
            <p className={clsx(styles.tableHeaders, styles.templateName)}>
              Template Name
            </p>
            <p className={clsx(styles.tableHeaders, styles.tool)}>Tool</p>
            <p className={clsx(styles.tableHeaders, styles.inputFormat)}>
              Input Format
            </p>
            <p className={clsx(styles.tableHeaders, styles.outputFormat)}>
              Output Format
            </p>
            <p className={clsx(styles.tableHeaders, styles.dateFormat)}>
              Date Format
            </p>
            <p className={clsx(styles.tableHeaders, styles.multilingual)}>
              Multilinguals
            </p>
          </div>
          {templateData &&
            templateData.map((element, index) => {
              return (
                <div className={styles.dataDiv}>
                  <div className={styles.flexRow}>
                    <p
                      className={clsx(
                        styles.tableData,
                        styles.templateNameData
                      )}
                    >
                      {element.docName === null ? "-" : element.docName}
                    </p>
                    <p className={clsx(styles.tableData, styles.toolData)}>
                      {element.templateTool}
                    </p>
                    <p
                      className={clsx(styles.tableData, styles.inputFormatData)}
                    >
                      {element.templateType}
                    </p>
                    <p
                      className={clsx(
                        styles.tableData,
                        styles.outputFormatData
                      )}
                    >
                      {element.templateFormat}
                    </p>
                    <p
                      className={clsx(styles.tableData, styles.dateFormatData)}
                    >
                      {element.templateDateFormat}
                    </p>
                    <p
                      className={clsx(
                        styles.tableData,
                        styles.multilingualData
                      )}
                    >
                      {element.locale === null ? "-" : element.locale}
                    </p>

                    <img
                      src={EditLogo}
                      onClick={() => editHandler(element)}
                      style={{ width: "1rem" }}
                    />

                    <img
                      src={cancelIcon}
                      onClick={() => deleteHandler(element.templateId, index)}
                      style={{ width: "1rem", marginLeft: "2rem" }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Templates;
