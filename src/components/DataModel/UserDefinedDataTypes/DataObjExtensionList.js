import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyle.module.css";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { RTL_DIRECTION, STATE_CREATED } from "../../../Constants/appConstants";

function DataObjExtensionList(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let { dataTypesList } = props;

  const [dataList, setDataList] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    setDataList(dataTypesList);
  }, [dataTypesList]);

  const createExtensionFunc = () => {
    let dataType = dataList?.filter((el) => el.TypeId === selectedValue)[0];
    if (dataType) {
      props.setExtendedDataObj(dataType);
      props.setDataObject((prev) => {
        let newData = { ...prev };
        let newDataList = [...newData.dataObjectList];
        dataType?.VarField?.forEach((val) => {
          newDataList.push({ ...val, inherited: true });
        });
        return {
          ...newData,
          extendedObj: dataType,
          dataObjectList: newDataList,
        };
      });
      if (!props.objectName) {
        //if new temporary dataObject is created, set focus on name Input field and clear the values in name Input and member list state
        const input = document.getElementById("dataObjectName");
        input.select();
        input.focus();
      }
    }
    props.setModalClosed();
  };

  return (
    <React.Fragment>
      <div className={styles.ud_extensionListDiv}>
        <p className={styles.ud_extensionHeading}>{t("chooseDataType")}</p>
        <div className={styles.ud_extList}>
          <RadioGroup
            name="extension_list_group"
            className={styles.ud_radioDiv}
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            {dataList
              ?.filter((e) => e.status !== STATE_CREATED)
              .map((data) => {
                return (
                  <p>
                    <FormControlLabel
                      value={data.TypeId}
                      control={<Radio />}
                      label={data.TypeName}
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.ud_radioButton
                          : styles.ud_radioButton
                      }
                    />
                  </p>
                );
              })}
          </RadioGroup>
        </div>
      </div>
      <div
        className={
          direction === RTL_DIRECTION ? arabicStyles.footer : styles.footer
        }
      >
        <Button
          className={styles.cancelDataTypeBtn}
          onClick={props.setModalClosed}
        >
          {t("cancel")}
        </Button>
        <Button
          className={
            !selectedValue ? styles.disabledDataTypeBtn : styles.addDataTypeBtn
          }
          onClick={createExtensionFunc}
          disabled={!selectedValue}
        >
          {t("done")}
        </Button>
      </div>
    </React.Fragment>
  );
}

export default DataObjExtensionList;
