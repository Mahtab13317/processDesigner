import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../ProcessSettings/Trigger/Properties/properties.module.css";
import arabicStyles from "../../../ProcessSettings/Trigger/Properties/propertiesArabicStyles.module.css";

import SearchBox from "../../../../UI/Search Component/index";
import filter from "../../../../assets/Tiles/Filter.svg";
import { RTL_DIRECTION } from "../../../../Constants/appConstants";
import RuleDataTable from "./RuleDataTable";

function RuleDataList(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;

  const [variableList, setVariableList] = useState("");
  const [addedVariableList, setAddedVariableList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchRule, setSearchRule] = useState("");
  let array = [];
  props.ruleDataType &&
    props.ruleDataType.map((obj, index) => {
      array.push(obj.Name);
    });

  useEffect(() => {
    setFilteredRows(
      array.filter((row) => {
        if (searchTerm == "") {
          return row;
        } else if (row.toLowerCase().includes(searchTerm.toLowerCase())) {
          return row;
        }
      })
    );
    let listArray = [];
    props.ruleDataType &&
      props.ruleDataType.filter((el) => {
        filteredRows.map((val) => {
          if (val == el.Name) {
            listArray.push(el);
          }
        });
      });
  }, [searchTerm]);

  useEffect(() => {
    setVariableList(props.ruleDataType);
  }, []);

  useEffect(() => {
    let localArray = [];
    let addArray = [];
    let restArray = [];
    props.rules &&
      props.rules.ruleOpList.forEach((el) => {
        localArray.push(el.interfaceId);
      });

    props.ruleDataType &&
      props.ruleDataType.forEach((el) => {
        if (localArray.includes(el.NameId)) {
          addArray.push(el);
        } else {
          restArray.push(el);
        }
      });
    setVariableList(restArray);
    setAddedVariableList(addArray);
  }, [props.rules]);

  const addAllVariable = () => {
    setAddedVariableList((prev) => {
      let newData = [...prev];
      variableList.forEach((data) => {
        newData.push(data);
      });
      return newData;
    });
    setVariableList([]);
  };

  const addOneVariable = (variable) => {
    setAddedVariableList((prev) => {
      return [...prev, variable];
    });
    setVariableList((prev) => {
      let prevData = [...prev];
      return prevData.filter((data) => {
        if (data.Name !== variable.Name) {
          return data;
        }
      });
    });
  };

  const removeAllVariable = () => {
    setVariableList((prev) => {
      let newData = [...prev];
      addedVariableList.forEach((data) => {
        newData.push(data);
      });
      return newData;
    });
    setAddedVariableList([]);
  };

  const removeOneVariable = (variable) => {
    setVariableList((prev) => {
      return [...prev, variable];
    });
    setAddedVariableList((prevContent) => {
      let prevData = [...prevContent];
      return prevData.filter((dataContent) => {
        if (dataContent.Name !== variable.Name) {
          return dataContent;
        }
      });
    });
  };
  props.selectedVariableList(addedVariableList);

  let filteredRules =
    addedVariableList &&
    addedVariableList.filter((docType) => {
      if (searchRule.trim() == "") {
        return;
      } else if (
        docType.Name.toLowerCase().includes(searchRule.toLowerCase())
      ) {
        return docType;
      }
    });

  let filteredRulesComplete =
    variableList &&
    variableList.filter((docType) => {
      if (searchTerm.trim() == "") {
        return;
      } else if (
        docType.Name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return docType;
      }
    });

  return (
    <div className={styles.propertiesMainView}>
      <div
        className={
          direction === RTL_DIRECTION
            ? `${arabicStyles.triggerNameTypeDiv} flex1`
            : `${styles.triggerNameTypeDiv} flex1`
        }
      >
        <div className={`${styles.mb025} flex`}>
          <div className="flex flex2">
            <p className={`${styles.dataEntryHeading} ${styles.mr05} flex4`}>
              {props.ruleDataTableHeading}
            </p>
            <div className="flex2">
              <SearchBox
                width="100%"
                //  height="1.5rem"
                setSearchTerm={setSearchRule}
              />
            </div>
            <button className={`${styles.filterTriggerButton} flex05`}>
              <img src={filter} alt="" />
            </button>
          </div>
        </div>
        <RuleDataTable
          tableType="remove"
          tableContent={searchRule == "" ? addedVariableList : filteredRules}
          singleEntityClickFunc={removeOneVariable}
          headerEntityClickFunc={removeAllVariable}
          ruleDataTableStatement={props.addRuleDataTableStatement}
          openProcessType={props.openProcessType}
          hideGroup={props.hideGroup}
        />
      </div>

      <div className="flex1">
        <div className={`flex ${styles.dataEntrySelectDiv}`}>
          <p className={`${styles.dataEntryHeading} ${styles.mr05} flex4`}>
            {props.addRuleDataTableHeading}
          </p>
          <div className="flex2">
            <SearchBox
              width="100%"
              // height="1.5rem"
              setSearchTerm={setSearchTerm}
            />
          </div>
          <button className={`${styles.filterTriggerButton} flex05`}>
            <img src={filter} alt="" />
          </button>
        </div>

        <RuleDataTable
          tableType="add"
          tableContent={searchTerm == "" ? variableList : filteredRulesComplete}
          singleEntityClickFunc={addOneVariable}
          headerEntityClickFunc={addAllVariable}
          ruleDataTableStatement={props.ruleDataTableStatement}
          openProcessType={props.openProcessType}
          hideGroup={props.hideGroup}
        />
      </div>
    </div>
  );
}

export default RuleDataList;
