import React, { useState, useEffect } from "react";
import styles from "../../../ProcessSettings/Trigger/Properties/properties.module.css";
import arabicStyles from "../../../ProcessSettings/Trigger/Properties/propertiesArabicStyles.module.css";
import { useTranslation } from "react-i18next";
import { getVariableType } from "../../../../utility/ProcessSettings/Triggers/getVariableType.js";
import {
  PROCESSTYPE_LOCAL,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import { connect } from "react-redux";
import SearchComponent from "../../../../UI/Search Component/index.js";
import PersonIcon from "@material-ui/icons/Person";
import filter from "../../../../assets/Tiles/Filter.svg";
import Modal from "../../../../UI/Modal/Modal.js";
import FilterScreen from "./filterScreen";

function GroupsTab(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let readOnlyProcess = props.openProcessType !== PROCESSTYPE_LOCAL;
  const [first, setfirst] = useState(null);
  const [showFilterScreen, setShowFilterScreen] = useState(false);
  useEffect(() => {
    setfirst(props.selectedGroupLength);
  }, [props.selectedGroupLength]);

  const openFilterScreenHandler = () => {
    setShowFilterScreen(true);
  };

  return (
    <React.Fragment>
      <table
        className={styles.dataTable}
        style={{
          width: "346px",
          height: "279px",
          border: "1px solid #EFEFEF",
          opacity: "1",
          marginRight: props.tableType == "add" ? "22px" : "0px",
        }}
      >
        <thead className={styles.dataTableHead}>
          <tr>
            <th className={styles.dataTableHeadCell}>
              <p
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.dataTableHeadCellContent
                    : styles.dataTableHeadCellContent
                }
              >
                {props.tableType == "add" ? "Select Group" : "Selected Groups"}
              </p>
            </th>
          </tr>
        </thead>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <SearchComponent
            style={{
              width: "170px",
              height: "28px",
              margin: "10px 10px 5px 10px",
            }}
          />
          {!readOnlyProcess ? (
            <th className={styles.dataTableHeadCell_Buttons}>
              {props.tableContent && props.tableContent.length > 0 ? (
                <p
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.dataEntryAddRemoveBtnHeader
                      : styles.dataEntryAddRemoveBtnHeader
                  }
                  style={{
                    color: props.tableType == "remove" ? "red" : "#0072C6",
                  }}
                  onClick={props.headerEntityClickFunc}
                  id={`${props.id}_all`}
                >
                  {props.tableType == "remove"
                    ? "- " + t("removeAll")
                    : "+ " + t("addAll")}
                </p>
              ) : null}
            </th>
          ) : null}
        </div>
        {props.tableType == "add" ? (
          <p
            style={{
              fontSize: "14px",
              fontWeight: "800",
              margin: "10px 10px 5px 10px",
            }}
          >
            {/* {props.tableType == "remove" && props.tableContent.length > 0
              ? props.tableContent.length
              : "0"}{" "}
            Groups Selected */}
            {first ? first : "0"} Groups Selected
          </p>
        ) : null}
        <tbody
          className={
            props.tableContent && props.tableContent.length > 0
              ? styles.dataTableBody
              : `relative ${styles.dataTableBody} ${styles.dataTableBodyWithNoDataQueueAss}`
          }
          style={{ margin: "10px 0px 10px 10px" }}
        >
          {props.tableContent && props.tableContent.length > 0 ? (
            props.tableContent.map((option, index) => {
              return (
                <tr
                  className={styles.dataTableRow_Queue}
                  style={{ position: "relative" }}
                >
                  <td
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.dataTableBodyCell_Queue
                        : styles.dataTableBodyCell_Queue
                    }
                  >
                    <div
                      className={
                        direction === RTL_DIRECTION
                          ? arabicStyles.dropdownVariable
                          : styles.dropdownVariable
                      }
                    >
                      <span>{option.GroupName}</span>
                      {/* <span>{option.SystemDefinedName}</span> */}
                    </div>
                  </td>
                  <td
                    className={
                      direction === RTL_DIRECTION
                        ? arabicStyles.dataTableBodyCell_Queue
                        : styles.dataTableBodyCell_Queue
                    }
                    style={{
                      position: "absolute",
                      right: "70px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <PersonIcon style={{ height: "14px" }} />
                    <span style={{ fontSize: "11px" }}>60 </span>
                    {props.tableType == "remove" ? (
                      <img
                        src={filter}
                        alt=""
                        style={{
                          height: "20px",
                          width: "30px",
                          marginTop: "5px",
                          cursor: "pointer",
                        }}
                        onClick={openFilterScreenHandler}
                      />
                    ) : null}
                  </td>
                  {!readOnlyProcess ? (
                    <td className={styles.dataTableBodyCell_Queue}>
                      <p
                        className={
                          direction === RTL_DIRECTION
                            ? `${arabicStyles.dataEntryAddRemoveBtnHeader} ${styles.mt025}`
                            : `${styles.dataEntryAddRemoveBtnHeader} ${styles.mt025}`
                        }
                        style={{
                          color:
                            props.tableType == "remove" ? "red" : "#0072C6",
                        }}
                        onClick={() => props.singleEntityClickFunc(option)}
                        id={`${props.id}_item${index}`}
                      >
                        {props.tableType == "remove"
                          ? "- " + t("remove")
                          : "+ " + t("add")}
                      </p>
                    </td>
                  ) : null}
                </tr>
              );
            })
          ) : (
            <div className={styles.noDataEntryRecords}>
              {t("dataEntryNoRecords")}
            </div>
          )}
        </tbody>
      </table>
      {/* -------------------------------------------------SHOW FILTER MODAL-------------------------------------------- */}
      {showFilterScreen ? (
                    <Modal
                      show={showFilterScreen}
                      backDropStyle={{ backgroundColor: "black",opacity:'0.4' }}
                      style={{
                        top: "15%",
                        left: "16%",
                        position: "absolute",
                        width: "499px",
                        height: "342px",
                        zIndex: "1500",
                        boxShadow: "0px 3px 6px #00000029",
                        border: "1px solid #D6D6D6",
                        borderRadius: "3px",
                      }}
                      modalClosed={() => setShowFilterScreen(false)}
                      children= {<FilterScreen setShowFilterScreen={setShowFilterScreen}/>}
                    ></Modal>
                  ) : null}

{/* -------------------------------------------------------END---------------------------------------------------- */}
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps, null)(GroupsTab);
