import React from "react";
import { useTranslation } from "react-i18next";
import emptyStatePic from "../../../assets/ProcessView/EmptyState.svg";
import { STATE_CREATED } from "../../../Constants/appConstants";
import styles from "./index.module.css";

function NoDataObjScreen(props) {
  let { t } = useTranslation();
  let {
    setDataTypesList,
    setDataObject,
    setSelectedItem,
    setExtendedDataObj,
    setShowInput,
  } = props;

  const createNewDataObject = () => {
    //calculate maxId of dataObject in dataTypeList
    let maxId = 0;
    let newId;
    //push temporary dataObject in dataTypeList
    setDataTypesList((prev) => {
      let localData = [...prev];
      localData?.forEach((dataType) => {
        if (dataType.TypeId > maxId) {
          maxId = dataType.TypeId;
        }
      });
      newId = +maxId + 1;
      localData.push({
        TypeId: newId,
        TypeName: `${"New"} ${t("dataType")}`,
        ExtensionTypeId: "-1",
        VarField: [],
        status: STATE_CREATED,
      });
      return localData;
    });
    //set temporary dataObject as selected field
    setSelectedItem({
      TypeId: newId,
      TypeName: `${"New"} ${t("dataType")}`,
      ExtensionTypeId: "-1",
      VarField: [],
      status: STATE_CREATED,
    });
    setDataObject({
      dataObjectName: `${"New"} ${t("dataType")}`,
      dataObjectList: [],
      extendedObj: null,
    });
    setExtendedDataObj(null);
    setShowInput(true);
  };

  return (
    <div className={styles.noDataObjScreen}>
      <img src={emptyStatePic} />
      <p className={styles.noDataObjAddedString}>{t("noDOAdded")}</p>
      <button
        className={styles.addDataTypeBtn}
        onClick={createNewDataObject}
        id="noDataObjScreen_add_btn"
      >
        {t("Create")} {t("dataType")}
      </button>
    </div>
  );
}

export default NoDataObjScreen;
