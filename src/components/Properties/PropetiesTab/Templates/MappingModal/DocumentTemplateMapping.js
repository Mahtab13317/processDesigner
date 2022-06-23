import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import "./index.css";
import "../index.css";
import { MenuItem, Select } from "@material-ui/core";
import { useGlobalState, store } from "state-pool";
import { RTL_DIRECTION } from "../../../../../Constants/appConstants";

function DocumentTemplateMapping(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let { template, setUpdatedTemplate } = props;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [document, setDocument] = useState(null);

  useEffect(() => {
    if (template.DocType) {
      setDocument(template.DocType);
    }
  }, [template]);

  return (
    <div className={styles.mainDiv}>
      <div className={styles.headerDiv}>
        <p
          className={
            direction === RTL_DIRECTION ? arabicStyles.iconDiv : styles.iconDiv
          }
        ></p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.variableName
              : styles.variableName
          }
        >
          {t("Template") + " " + t("name")}
        </p>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.dataType
              : styles.dataType
          }
        >
          {t("CurrentProcessDocument(s)")}
        </p>
      </div>
      <div className={styles.bodyDiv}>
        <div className={styles.dataDiv}>
          <p
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.iconDiv
                : styles.iconDiv
            }
          ></p>
          <p
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.variableNameData
                : styles.variableNameData
            }
          >
            {template.ProductName}
          </p>
          <p
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.dataTypeValue
                : styles.dataTypeValue
            }
          >
            <Select
              className={
                direction === RTL_DIRECTION
                  ? `templatePropSelect ${arabicStyles.templatePropSelect}`
                  : `templatePropSelect ${styles.templatePropSelect}`
              }
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
              value={document}
              id={`ccm_document_select`}
              onChange={(e) => {
                setDocument(e.target.value);
                setUpdatedTemplate((prev) => {
                  let temp = { ...prev };
                  prev.DocType = e.target.value;
                  return temp;
                });
              }}
            >
              {localLoadedProcessData.DocumentTypeList?.length > 0 ? (
                localLoadedProcessData.DocumentTypeList.map((ele) => {
                  return (
                    <MenuItem
                      value={ele.DocName}
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.templateDropdownData
                          : styles.templateDropdownData
                      }
                    >
                      {ele.DocName}
                    </MenuItem>
                  );
                })
              ) : (
                <div
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.templateDropdownData
                      : styles.templateDropdownData
                  }
                >
                  {t("noRecords")}
                </div>
              )}
            </Select>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DocumentTemplateMapping;
