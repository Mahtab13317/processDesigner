// Changes made to solve Bug 113434 - Requirement Section: spaces are not allowed while adding the description
// Changes made to solve Bug 110715 (Global Requirement section: Buttons not visible while Adding section)
// Changes made to solve Bug 113580 (if the requirements are on project level not on Global level then the message should be different)
//  Changes made to solve Bug 110720, Global Requirement section: section with lengthy data was not added

import { Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import styles from "./GlobalRequirementSections.module.css";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import NotInterestedOutlinedIcon from "@material-ui/icons/NotInterestedOutlined";
import axios from "axios";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";
import {
  SERVER_URL,
  ENDPOINT_FETCHSYSTEMREQUIREMENTS,
  ENDPOINT_FETCHPROCESSREQUIREMENTS,
  ENDPOINT_ADDSYSTEMREQUIREMENTS,
  ENDPOINT_ADDPROCESSREQUIREMENTS,
  ENDPOINT_DELETESYSTEMREQUIREMENTS,
  ENDPOINT_DELETEPROCESSREQUIREMENTS,
  ENDPOINT_EDITSYSTEMREQUIREMENTS,
  ENDPOINT_EDITPROCESSREQUIREMENTS,
  ADD,
  EDIT,
  DELETE,
  LEVEL1,
  LEVEL2,
  LEVEL3,
} from "../../../../../Constants/appConstants";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditOutlinedIcon from "@material-ui/icons/Edit";

import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import ExportImport from "./ExportImport";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "react-i18next";
import StarRateSharpIcon from "@material-ui/icons/StarRateSharp";
import { useRef } from "react";
import { FieldValidations } from "../../../../../utility/FieldValidations/fieldValidations";

function AddNewSectionBox(props) {
  let { t } = useTranslation();
  const cancelButtonClick = () => {
    props.cancelCallBack();
  };
  const [previousOrderId, setpreviousOrderId] = useState(props.previousOrderId);
  const [newSection, setnewSection] = useState({});
  const [sectionName, setsectionName] = useState("");
  const [desc, setdesc] = useState("");
  const sectionNameRef = useRef();
  const sectionDescRef = useRef();
  const addHandler = () => {
    if (sectionName !== "") {
      props.mapNewSection(newSection);
      setpreviousOrderId((prevState) => prevState + 1);
      setdesc("");
      setsectionName("");
    } else {
      alert("cant be empty");
    }
  };
  const addcloseHandler = () => {
    if (sectionName !== "") {
      props.mapNewSection(newSection);
    } else {
      alert("cant be empty");
    }

    cancelButtonClick();
  };

  useEffect(() => {
    let parent = previousOrderId + 1;
    setnewSection({
      OrderId: parent.toString(),
      SectionName: sectionName,
      Description: desc,
    });
  }, [desc, previousOrderId, props, sectionName]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          border: "1px solid black",
          backgroundColor: "white",
          width: "350px",
          height: "auto",

          top: "40%",
          left: "40%",
          padding: "10px",
        }}
      >
        <p
          style={{
            fontSize: "var(--title_text_font_size)",
            marginBottom: "10px",
            fontWeight: "600",
          }}
        >
          {props.sectionNo === "" || props.sectionNo === undefined
            ? t("addNewSection")
            : `${t("addSectionWithin")} ${props.sectionNo}`}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <label style={{ fontSize: "14px", marginBottom: "10px" }}>
            {t("section")} {t("name")}
            <StarRateSharpIcon
              style={{
                height: "15px",
                width: "15px",
                color: "red",
                opacity: "0.9",
                fontSize: "small",
              }}
            />
          </label>

          <input
            id="add_sectionName"
            value={sectionName}
            type="text"
            maxLength={255}
            onChange={(e) => setsectionName(e.target.value)}
            style={{
              width: "100%",
              height: "24px",
              marginBottom: "10px",
              background: "#F8F8F8 0% 0% no-repeat padding-box",
              border: "1px solid #c9c7c7",
              borderRadius: "2px",
              paddingLeft: "5px",
              opacity: "1",
            }}
            ref={sectionNameRef}
            onKeyPress={(e) =>
              FieldValidations(e, 163, sectionNameRef.current, 100)
            }
          />

          <label style={{ fontSize: "14px", marginBottom: "10px" }}>
            {t("Discription")}
            {/* <StarRateIcon
          style={{ height: "15px", width: "15px", color: "red" }}
          /> */}
          </label>

          <textarea
            id="add_sectionDesc"
            value={desc}
            maxLength={255}
            onChange={(e) => setdesc(e.target.value)}
            style={{
              width: "100%",
              height: "5rem",
              marginBottom: "10px",
              background: "#F8F8F8 0% 0% no-repeat padding-box",
              border: "1px solid #c9c7c7",
              borderRadius: "2px",
              paddingLeft: "5px",
              opacity: "1",
              resize: "none",
              fontFamily: "Open Sans",
            }}
            ref={sectionDescRef}
            onKeyPress={(e) =>
              FieldValidations(e, 163, sectionDescRef.current, 150)
            }
          />
        </div>

        <div
          className="buttons_add"
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <Button
            id="add_cancel"
            variant="outlined"
            onClick={cancelButtonClick}
            color="#87805E"
          >
            {t("cancel")}
          </Button>

          <Button
            id="add_sectionAnother"
            variant="contained"
            className={styles.buttons}
            size="small"
            onClick={addHandler}
          >
            {t("addAnother")}
          </Button>
          <Button
            id="add_sectionClose"
            variant="contained"
            className={styles.buttons}
            onClick={addcloseHandler}
          >
            {t("add&Close")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditSectionBox(props) {
  let { t } = useTranslation();
  const [newSection, setnewSection] = useState({});
  const [sectionName, setsectionName] = useState("");
  const [desc, setdesc] = useState(null);
  const sectionNameRef = useRef();
  const sectionDescRef = useRef();
  const cancelButtonClick = () => {
    props.cancelCallBack();
  };

  const editSave = () => {
    props.editMapToData(newSection);
    cancelButtonClick();
  };

  const handleDesc = (e) => {
    if (e.target.value === "") {
      setdesc("");
    } else setdesc(e.target.value.trim());
  };
  useEffect(() => {
    setnewSection({
      OrderId: props.sectionToEdit.OrderId,
      SectionName: sectionName || props.sectionToEdit.SectionName,
      Description: desc !== null ? desc : props.sectionToEdit.Description,
    });
  }, [
    desc,
    props.OrderId,
    props.sectionToEdit.Description,
    props.sectionToEdit.OrderId,
    props.sectionToEdit.SectionName,
    sectionName,
  ]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          border: "1px solid black",
          backgroundColor: "white",
          width: "322px",
          height: "auto",
          padding: "10px",
        }}
      >
        <p
          style={{
            fontSize: "var(--title_text_font_size)",
            marginBottom: "10px",
            fontWeight: "600",
          }}
        >
          {t("edit")} {t("section")}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <label style={{ fontSize: "14px", marginBottom: "10px" }}>
            {t("section")} {t("name")}
            <StarRateSharpIcon
              style={{
                height: "15px",
                width: "15px",
                color: "red",
                opacity: "0.9",
                fontSize: "small",
              }}
            />
          </label>

          <input
            id="edit_sectionName"
            onChange={(e) => setsectionName(e.target.value)}
            defaultValue={props.sectionToEdit.SectionName}
            style={{
              width: "100%",
              height: "24px",
              marginBottom: "10px",
              background: "#F8F8F8 0% 0% no-repeat padding-box",
              border: "1px solid #c9c7c7",
              borderRadius: "2px",
              paddingLeft: "5px",
              opacity: "1",
            }}
            ref={sectionNameRef}
            onKeyPress={(e) =>
              FieldValidations(e, 163, sectionNameRef.current, 100)
            }
          />

          <label style={{ fontSize: "14px", marginBottom: "10px" }}>
            {t("Discription")}
            {/* <StarRateIcon
          style={{ height: "15px", width: "15px", color: "red" }}
          /> */}
          </label>

          <textarea
            id="edit_sectionDesc"
            onChange={(e) => handleDesc(e)}
            defaultValue={props.sectionToEdit.Description}
            style={{
              width: "100%",
              height: "5rem",
              marginBottom: "10px",
              background: "#F8F8F8 0% 0% no-repeat padding-box",
              border: "1px solid #c9c7c7",
              borderRadius: "2px",
              paddingLeft: "5px",
              opacity: "1",
              resize: "none",
              fontFamily: "Open Sans",
            }}
            ref={sectionDescRef}
            onKeyPress={(e) =>
              FieldValidations(e, 163, sectionDescRef.current, 150)
            }
          />
        </div>

        <div
          className="buttons_add"
          style={{ display: "flex", flexDirection: "row-reverse" }}
        >
          <Button
            id="edit_cancel"
            variant="outlined"
            onClick={cancelButtonClick}
            // className={styles.buttons}
          >
            {t("cancel")}
          </Button>
          <Button
            id="edit_save"
            variant="contained"
            className={styles.buttons}
            onClick={editSave}
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function GlobalRequirementSections(props) {
  let { t } = useTranslation();
  const useStyles = makeStyles({
    hideBorder: {
      "&.MuiAccordion-root:before": {
        display: "none",
      },
    },
  });
  const classes = useStyles();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [reqData, setreqData] = useState([]);
  const [showEditBox, setshowEditBox] = useState(false);
  const [spinner, setspinner] = useState(true);
  const cancelAddNewSection = () => {
    setshowEditBox(false);
    setfirstLevelTextFieldShow(false);
  };

  function sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
  async function getSections() {
    const res = await axios.get(
      SERVER_URL +
        `${
          props.callLocation == "ProcessLevel"
            ? ENDPOINT_FETCHPROCESSREQUIREMENTS +
              `/${props.openProcessID}/${props.openProcessType}`
            : ENDPOINT_FETCHSYSTEMREQUIREMENTS
        }`
    );
    if (res.status === 200) {
      const data = await res.data.Section;
      setspinner(false);
      data.forEach((item) => {
        if (item.hasOwnProperty("SectionInner")) {
          item.SectionInner = sortByKey(item.SectionInner, "OrderId");
          if (item.SectionInner.hasOwnProperty("SectionInner2")) {
            item.SectionInner.SectionInner2 = sortByKey(
              item.SectionInner.SectionInner2,
              "OrderId"
            );
          }
        }
      });
      setreqData(sortByKey(data, "OrderId"));
    }
  }
  useEffect(() => {
    getSections();
  }, []);

  const [firstLevelTextFieldShow, setfirstLevelTextFieldShow] = useState(false);
  const [sectionToEdit, setsectionToEdit] = useState({});
  const [showExportImportModal, setshowExportImportModal] = useState(false);
  const [exportOrImportToShow, setexportOrImportToShow] = useState("");
  const [levelToMap, setlevelToMap] = useState();
  const [levelToEdit, setlevelToEdit] = useState();
  const [previousOrderId, setpreviousOrderId] = useState();
  const [level1DataOrderId, setlevel1DataOrderId] = useState();
  const [level2DataOrderId, setlevel2DataOrderId] = useState();
  const closeExportImportModal = () => {
    setshowExportImportModal(false);
  };

  const addSection = (e, levelToAdd, level1Data, level2Data) => {
    e.stopPropagation();
    setfirstLevelTextFieldShow(true);
    setlevelToMap(levelToAdd);
    if (levelToAdd === LEVEL1) {
      setpreviousOrderId(reqData.length);
    } else if (levelToAdd === LEVEL2) {
      if (level1Data.hasOwnProperty("SectionInner"))
        setpreviousOrderId(level1Data.SectionInner.length);
      else setpreviousOrderId(0);

      setlevel1DataOrderId(level1Data.OrderId);
    } else {
      if (level2Data.hasOwnProperty("SectionInner2"))
        setpreviousOrderId(level2Data.SectionInner2.length);
      else setpreviousOrderId(0);

      setlevel1DataOrderId(level1Data.OrderId);
      setlevel2DataOrderId(level2Data.OrderId);
    }
  };

  const deleteClicked = async (
    e,
    levelToDelete,
    level1Data,
    level2Data,
    level3Data
  ) => {
    e.stopPropagation();
    let temp = JSON.parse(JSON.stringify(reqData));
    let toDeleteSection;
    if (levelToDelete === LEVEL2) {
      temp.forEach((item) => {
        if (item.OrderId === level1Data.OrderId) {
          toDeleteSection = item;
          temp.splice(temp.indexOf(item), 1);
        }
      });
    } else if (levelToDelete === LEVEL3) {
      temp[level1Data.OrderId - 1].SectionInner.forEach((item) => {
        if (item.OrderId === level2Data.OrderId) {
          toDeleteSection = item;
          temp[level1Data.OrderId - 1].SectionInner.splice(
            temp[level1Data.OrderId - 1].SectionInner.indexOf(item),
            1
          );
        }
      });
    } else {
      temp[level1Data.OrderId - 1].SectionInner[
        level2Data.OrderId - 1
      ].SectionInner2.forEach((item) => {
        if (item.OrderId === level3Data.OrderId) {
          toDeleteSection = item;
          temp[level1Data.OrderId - 1].SectionInner[
            level2Data.OrderId - 1
          ].SectionInner2.splice(
            temp[level1Data.OrderId - 1].SectionInner[
              level2Data.OrderId - 1
            ].SectionInner2.indexOf(item),
            1
          );
        }
      });
    }

    const flagForApi = await commonApiCalls(DELETE, toDeleteSection);
    if (flagForApi) setreqData(arrangeData(temp));
    else return;
  };

  const editClicked = (e, levelToEdit, level1Data, level2Data, level3Data) => {
    e.stopPropagation();
    setshowEditBox(true);
    setlevelToEdit(levelToEdit);

    if (levelToEdit === LEVEL2) {
      setpreviousOrderId(level1Data.OrderId);
      setsectionToEdit(level1Data);
    } else if (levelToEdit === LEVEL3) {
      setsectionToEdit(level2Data);
      setpreviousOrderId(level2Data.OrderId);

      setlevel1DataOrderId(level1Data.OrderId);
    } else {
      setsectionToEdit(level3Data);
      setpreviousOrderId(level3Data.OrderId);

      setlevel1DataOrderId(level1Data.OrderId);
      setlevel2DataOrderId(level2Data.OrderId);
    }
  };

  const editMapToData = async (data) => {
    //   let newArray = reqData.map(function(arr) {
    //     return arr.slice();
    // });

    let temp = JSON.parse(JSON.stringify(reqData));
    let toEditSection;
    if (levelToEdit === LEVEL2) {
      temp.forEach((item) => {
        if (item.OrderId === previousOrderId) {
          toEditSection = item;
          item.OrderId = data.OrderId;
          item.SectionName = data.SectionName;
          item.Description = data.Description;
        }
      });
    } else if (levelToEdit === LEVEL3) {
      temp[level1DataOrderId - 1].SectionInner.forEach((item) => {
        if (item.OrderId === previousOrderId) {
          toEditSection = item;
          item.OrderId = data.OrderId;
          item.SectionName = data.SectionName;
          item.Description = data.Description;
        }
      });
    } else {
      temp[level1DataOrderId - 1].SectionInner[
        level2DataOrderId - 1
      ].SectionInner2.forEach((item) => {
        if (item.OrderId === previousOrderId) {
          toEditSection = item;
          item.OrderId = data.OrderId;
          item.SectionName = data.SectionName;
          item.Description = data.Description;
        }
      });
    }

    const flagForApi = await commonApiCalls(EDIT, toEditSection);

    if (flagForApi) setreqData(temp);
    else return;
  };

  const mapNewSection = async (data) => {
    let temp = JSON.parse(JSON.stringify(reqData));
    if (levelToMap === LEVEL1) {
      const flagForApi = await commonApiCalls(ADD, data, "0");
      if (flagForApi) {
        temp.push({ ...data, SectionId: flagForApi?.SectionId });
        setreqData(temp);
      } else return;
    } else if (levelToMap === LEVEL2) {
      const flagForApi = await commonApiCalls(
        ADD,
        data,
        temp[level1DataOrderId - 1].SectionId
      );
      if (flagForApi) {
        let dataToPush = { ...data, SectionId: flagForApi?.SectionId };
        if (temp[level1DataOrderId - 1].hasOwnProperty("SectionInner")) {
          temp[level1DataOrderId - 1].SectionInner.push(dataToPush);
        } else temp[level1DataOrderId - 1].SectionInner = [dataToPush];

        setreqData(temp);
      } else return;
    } else {
      const flagForApi = await commonApiCalls(
        ADD,
        data,
        temp[level1DataOrderId - 1].SectionInner[level2DataOrderId - 1]
          .SectionId
      );
      if (flagForApi) {
        let dataToPush = { ...data, SectionId: flagForApi?.SectionId };
        if (
          temp[level1DataOrderId - 1].SectionInner[
            level2DataOrderId - 1
          ].hasOwnProperty("SectionInner2")
        )
          temp[level1DataOrderId - 1].SectionInner[
            level2DataOrderId - 1
          ].SectionInner2.push(dataToPush);
        else
          temp[level1DataOrderId - 1].SectionInner[
            level2DataOrderId - 1
          ].SectionInner2 = [dataToPush];

        setreqData(temp);
      } else return;
    }
  };

  const arrangeData = (data) => {
    data.forEach((item, index) => {
      item.OrderId = (++index).toString();
      if (item.hasOwnProperty("SectionInner")) {
        item.SectionInner.forEach((item2, index) => {
          item2.OrderId = (++index).toString();
          if (item2.hasOwnProperty("SectionInner2")) {
            item2.SectionInner2.forEach((item3, index) => {
              item3.OrderId = (++index).toString();
            });
          }
        });
      }
    });

    return data;
  };

  const dragEndHandler = async (result) => {
    if (!result.destination) {
      return;
    }

    let temp = JSON.parse(JSON.stringify(reqData));
    let payload;
    if (result.type === LEVEL1) {
      payload = {
        oldOrderId: temp[result.source.index].OrderId,
        sectionOrderId: temp[result.destination.index].OrderId,
        sectionId: temp[result.source.index]?.SectionId,
        parentId: "0",
      };
      const [removed] = temp.splice(result.source.index, 1);
      temp.splice(result.destination.index, 0, removed);
    } else if (result.type === LEVEL2) {
      let nest = result.draggableId.split(" ");

      payload = {
        oldOrderId: temp[nest[0] - 1].SectionInner[result.source.index].OrderId,
        sectionOrderId:
          temp[nest[0] - 1].SectionInner[result.destination.index].OrderId,
        sectionId:
          temp[nest[0] - 1].SectionInner[result.source.index]?.SectionId,
        parentId: nest[2],
      };

      const [removed] = temp[nest[0] - 1].SectionInner.splice(
        result.source.index,
        1
      );
      temp[nest[0] - 1].SectionInner.splice(
        result.destination.index,
        0,
        removed
      );
    } else {
      let nest = result.draggableId.split(" ");

      payload = {
        oldOrderId:
          temp[nest[0] - 1].SectionInner[nest[1] - 1]?.SectionInner2[
            result.source.index
          ]?.OrderId,
        sectionOrderId:
          temp[nest[0] - 1].SectionInner[nest[1] - 1]?.SectionInner2[
            result.destination.index
          ]?.OrderId,
        sectionId:
          temp[nest[0] - 1].SectionInner[nest[1] - 1]?.SectionInner2[
            result.source.index
          ]?.SectionId,
        parentId: nest[3],
      };

      const [removed] = temp[nest[0] - 1].SectionInner[
        nest[1] - 1
      ].SectionInner2.splice(result.source.index, 1);
      temp[nest[0] - 1].SectionInner[nest[1] - 1].SectionInner2.splice(
        result.destination.index,
        0,
        removed
      );
    }

    const res = await axios.post(
      SERVER_URL +
        `${
          props.callLocation == "ProcessLevel"
            ? ENDPOINT_EDITPROCESSREQUIREMENTS
            : ENDPOINT_EDITSYSTEMREQUIREMENTS
        }`,
      payload
    );

    const data = await res.data.Section;

    setreqData(sortByKey(data, "OrderId"));
  };

  const commonApiCalls = async (method, data, parentId) => {
    if (method === ADD) {
      const payload =
        props.callLocation == "ProcessLevel"
          ? {
              processDefId: props.openProcessID,
              projectId: localLoadedProcessData?.ProjectId,
              pMSectionInfo: {
                sectionName: data.SectionName,
                sectionDesc: data.Description,
                sectionOrderId: data.OrderId,
                m_bExclude: false,
                parentId: parentId,
              },
            }
          : {
              sectionName: data.SectionName,
              sectionDesc: data.Description,
              sectionOrderId: data.OrderId,
              parentId: parentId,
            };
      const res = await axios.post(
        SERVER_URL +
          `${
            props.callLocation == "ProcessLevel"
              ? ENDPOINT_ADDPROCESSREQUIREMENTS
              : ENDPOINT_ADDSYSTEMREQUIREMENTS
          }`,
        payload
      );

      const resData = await res.data;
      if (resData.Status === 0) return resData;
      else return false;
    } else if (method === DELETE) {
      const payload =
        props.callLocation == "ProcessLevel"
          ? {
              processDefId: props.openProcessID,
              projectId: localLoadedProcessData.ProjectId,
              pMSectionInfo: {
                sectionName: data.SectionName,
                sectionId: data?.SectionId,
              },
            }
          : {
              sectionName: data.SectionName,
              sectionId: data?.SectionId,
            };
      const res = await axios.post(
        SERVER_URL +
          `${
            props.callLocation == "ProcessLevel"
              ? ENDPOINT_DELETEPROCESSREQUIREMENTS
              : ENDPOINT_DELETESYSTEMREQUIREMENTS
          }`,
        payload
      );
      const resData = await res.data;
      if (resData.Status === 0) return true;
      else return false;
    } else if (method === EDIT) {
      const payload =
        props.callLocation == "ProcessLevel"
          ? {
              processDefId: props.openProcessID,
              projectId: localLoadedProcessData?.ProjectId,
              pMSectionInfo: {
                sectionName: data.SectionName,
                sectionDesc: data.Description,
                sectionOrderId: data.OrderId,
                m_bExclude: false,
                sectionId: data?.SectionId,
              },
            }
          : {
              sectionName: data.SectionName,
              sectionDesc: data.Description,
              sectionOrderId: data.OrderId,
              sectionId: data?.SectionId,
            };
      const res = await axios.post(
        SERVER_URL +
          `${
            props.callLocation == "ProcessLevel"
              ? ENDPOINT_EDITPROCESSREQUIREMENTS
              : ENDPOINT_EDITSYSTEMREQUIREMENTS
          }`,
        payload
      );
      const resData = await res.data;
      if (resData.Status === 0) return true;
      else return false;
    }
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.heading}>
          <div className={styles.headingBox}>
            <p className={styles.headingText}>
              {props.callLocation == "ProcessLevel"
                ? "Process Requirements Section"
                : t("globalRequirementSections")}
            </p>
            <p className={styles.headingInfo}>
              {props.callLocation == "ProcessLevel"
                ? "Requirement sections which are defined here, will automatically appear in Requirements section of it's activities."
                : t("gloablRequirementSectionsHeadingInfo")}
            </p>
          </div>
          <div>
            {props.callLocation == "ProcessLevel" ? null : (
              <Button
                variant="contained"
                size="medium"
                className={styles.addSectionButton}
                onClick={() => {
                  setshowExportImportModal(true);
                  setexportOrImportToShow("import");
                }}
              >
                <p className={styles.buttonText}>{t("import")}</p>
              </Button>
            )}
            {reqData.length !== 0 && props.callLocation != "ProcessLevel" ? (
              <Button
                variant="contained"
                size="medium"
                className={styles.addSectionButton}
                onClick={() => {
                  setshowExportImportModal(true);
                  setexportOrImportToShow("export");
                }}
              >
                <p className={styles.buttonText}>{t("export")}</p>
              </Button>
            ) : null}
            <Button
              variant="contained"
              size="medium"
              className={styles.addSectionButton}
              styles={{ width: "7rem" }}
              onClick={(e) => addSection(e, LEVEL1)}
              id="add_section"
            >
              <p className={styles.buttonText}>
                {t("add")} {t("section")}
              </p>
            </Button>
          </div>
        </div>
        {spinner ? (
          <CircularProgress style={{ marginTop: "30vh", marginLeft: "40%" }} />
        ) : (
          <>
            {reqData.length !== 0 ? (
              <div className={styles.body}>
                <DragDropContext onDragEnd={dragEndHandler}>
                  <Droppable droppableId="droppable" type={LEVEL1}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          zIndex: 0,
                        }}
                        // style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {reqData &&
                          reqData.map((data, index) => {
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <Draggable
                                  key={data.OrderId}
                                  draggableId={data.OrderId}
                                  index={index}
                                  demo={++index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <Accordion className={classes.hideBorder}>
                                        <AccordionSummary
                                          className={styles.accordianOuter}
                                          style={{
                                            flexDirection: "row-reverse",
                                            alignItems: "start",
                                          }}
                                          expandIcon={
                                            <ExpandMoreIcon
                                              id="expand_1"
                                              style={{ color: "#0072C6" }}
                                            />
                                          }
                                          aria-controls="panel1a-content"
                                          id="panel1a-header"
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              backgroundColor: "#ebeced",
                                            }}
                                          >
                                            <div
                                              className={styles.iconsandtextBox}
                                              style={{ width: "70vw" }}
                                            >
                                              <div
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "row",
                                                }}
                                              >
                                                <p
                                                  id="orderId_1"
                                                  style={{
                                                    padding: "0px 0 0 2px",
                                                    color: "#0072C6",
                                                    fontSize:
                                                      "var(--subtitle_text_font_size)",
                                                    fontWeight: "600",
                                                    fontFamily: "Open Sans",
                                                    width: "1.7rem",
                                                    height: "1.3rem",

                                                    borderRight: "none",
                                                  }}
                                                >
                                                  {data.OrderId + "."}
                                                </p>
                                                <p
                                                  id="sectionName_1"
                                                  spellCheck="false"
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                  style={{
                                                    fontWeight: "600",
                                                    fontSize:
                                                      "var(--subtitle_text_font_size)",
                                                    fontFamily: "Open Sans",
                                                    color: "#0072C6",
                                                    marginLeft: "0px",
                                                    marginTop: "0px",
                                                    borderLeft: "none",
                                                  }}
                                                >
                                                  {data.SectionName}
                                                </p>
                                              </div>

                                              <div>
                                                <AddIcon
                                                  id="addIcon_1"
                                                  onClick={(e) =>
                                                    addSection(
                                                      e,

                                                      LEVEL2,
                                                      data
                                                    )
                                                  }
                                                  style={{
                                                    color: "grey",
                                                    height: "1.9rem",
                                                    width: "1.9rem",
                                                    cursor: "pointer",
                                                  }}
                                                />
                                                <EditOutlinedIcon
                                                  id="editIcon_1"
                                                  style={{
                                                    color: "grey",
                                                    height: "1.7rem",
                                                    width: "1.7rem",
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={(e) =>
                                                    editClicked(e, LEVEL2, data)
                                                  }
                                                />
                                                <DeleteOutlineIcon
                                                  id="deleteIcon_1"
                                                  onClick={(e) =>
                                                    deleteClicked(
                                                      e,
                                                      LEVEL2,
                                                      data
                                                    )
                                                  }
                                                  style={{
                                                    color: "grey",
                                                    height: "1.7rem",
                                                    width: "1.7rem",
                                                    cursor: "pointer",
                                                  }}
                                                />
                                              </div>
                                            </div>
                                            <div>
                                              <p
                                                id="description_1"
                                                style={{
                                                  marginLeft: "2px",
                                                  marginTop: "-5px",

                                                  width: "68vw",
                                                  font: "var(--base_text_font_size) Open Sans",
                                                }}
                                              >
                                                {" "}
                                                {data.Description}
                                              </p>
                                            </div>
                                          </div>
                                        </AccordionSummary>
                                        <Droppable
                                          droppableId={
                                            "droppable1 " +
                                            data.SectionId +
                                            " " +
                                            data.OrderId
                                          }
                                          type={LEVEL2}
                                        >
                                          {(provided, snapshot) => (
                                            <div
                                              {...provided.droppableProps}
                                              ref={provided.innerRef}
                                              style={{
                                                zIndex: 1000,
                                              }}
                                            >
                                              {data.hasOwnProperty(
                                                "SectionInner"
                                              ) &&
                                                data.SectionInner.map(
                                                  (subsection, index) => (
                                                    <Draggable
                                                      key={subsection.OrderId}
                                                      draggableId={
                                                        data.OrderId +
                                                        " " +
                                                        subsection.OrderId +
                                                        " " +
                                                        data.SectionId
                                                      }
                                                      index={index}
                                                    >
                                                      {(provided, snapshot) => (
                                                        <div
                                                          ref={
                                                            provided.innerRef
                                                          }
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                        >
                                                          <Accordion
                                                            className={
                                                              classes.hideBorder
                                                            }
                                                            defaultExpanded={
                                                              false
                                                            }
                                                            style={{
                                                              marginLeft:
                                                                "2.5rem",
                                                            }}
                                                          >
                                                            <AccordionSummary
                                                              className={
                                                                styles.accordianInner
                                                              }
                                                              style={{
                                                                flexDirection:
                                                                  "row-reverse",
                                                                alignItems:
                                                                  "start",
                                                              }}
                                                              expandIcon={
                                                                <ExpandMoreIcon
                                                                  id="expandIcon_2"
                                                                  style={{
                                                                    color:
                                                                      "black",
                                                                  }}
                                                                />
                                                              }
                                                              aria-controls="panel1a-content"
                                                              id="panel1a-header"
                                                            >
                                                              <div
                                                                style={{
                                                                  display:
                                                                    "flex",
                                                                  flexDirection:
                                                                    "column",
                                                                  height:
                                                                    "auto",
                                                                  backgroundColor:
                                                                    "#ebeced",
                                                                }}
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.iconsandtextBox
                                                                  }
                                                                  style={{
                                                                    width:
                                                                      "67vw",
                                                                  }}
                                                                >
                                                                  <div
                                                                    style={{
                                                                      display:
                                                                        "flex",
                                                                      flexDirection:
                                                                        "row",
                                                                    }}
                                                                  >
                                                                    <p
                                                                      id="orderId_2"
                                                                      style={{
                                                                        padding:
                                                                          "0px 0 0 2px",
                                                                        color:
                                                                          "black",
                                                                        fontSize:
                                                                          "var(--subtitle_text_font_size)",
                                                                        fontWeight:
                                                                          "600",
                                                                        fontFamily:
                                                                          "Open Sans",
                                                                        width:
                                                                          "1.7rem",
                                                                        height:
                                                                          "1.5rem",
                                                                        marginTop:
                                                                          "0px",
                                                                        borderRight:
                                                                          "none",
                                                                      }}
                                                                    >
                                                                      {data.OrderId +
                                                                        "." +
                                                                        subsection.OrderId +
                                                                        "."}
                                                                    </p>

                                                                    <p
                                                                      id="sectionName_2"
                                                                      style={{
                                                                        fontSize:
                                                                          "var(--subtitle_text_font_size)",
                                                                        fontWeight:
                                                                          "600",
                                                                        fontFamily:
                                                                          "Open Sans",
                                                                        margin:
                                                                          "0px 0 0 10px",
                                                                        width:
                                                                          "58vw",
                                                                        borderLeft:
                                                                          "none",
                                                                      }}
                                                                    >
                                                                      {
                                                                        subsection.SectionName
                                                                      }
                                                                    </p>
                                                                  </div>

                                                                  <div>
                                                                    <AddIcon
                                                                      id="addIcon_2"
                                                                      onClick={(
                                                                        e
                                                                      ) =>
                                                                        addSection(
                                                                          e,

                                                                          LEVEL3,
                                                                          data,
                                                                          subsection
                                                                        )
                                                                      }
                                                                      style={{
                                                                        color:
                                                                          "grey",
                                                                        height:
                                                                          "1.9rem",
                                                                        width:
                                                                          "1.9rem",
                                                                        cursor:
                                                                          "pointer",
                                                                      }}
                                                                    />
                                                                    <EditOutlinedIcon
                                                                      id="editIcon_2"
                                                                      onClick={(
                                                                        e
                                                                      ) =>
                                                                        editClicked(
                                                                          e,
                                                                          LEVEL3,
                                                                          data,
                                                                          subsection
                                                                        )
                                                                      }
                                                                      style={{
                                                                        color:
                                                                          "grey",
                                                                        height:
                                                                          "1.7rem",
                                                                        width:
                                                                          "1.7rem",
                                                                        cursor:
                                                                          "pointer",
                                                                      }}
                                                                    />
                                                                    <DeleteOutlineIcon
                                                                      id="deleteIcon_2"
                                                                      onClick={(
                                                                        e
                                                                      ) =>
                                                                        deleteClicked(
                                                                          e,
                                                                          LEVEL3,
                                                                          data,
                                                                          subsection
                                                                        )
                                                                      }
                                                                      style={{
                                                                        color:
                                                                          "grey",
                                                                        height:
                                                                          "1.7rem",
                                                                        width:
                                                                          "1.7rem",
                                                                        cursor:
                                                                          "pointer",
                                                                      }}
                                                                    />
                                                                  </div>
                                                                </div>
                                                                <div>
                                                                  <p
                                                                    id="description_2"
                                                                    style={{
                                                                      font: "var(--base_text_font_size) Open Sans",
                                                                      margin:
                                                                        "-5px 0 0 2px",

                                                                      width:
                                                                        "63vw",
                                                                    }}
                                                                  >
                                                                    {
                                                                      subsection.Description
                                                                    }
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </AccordionSummary>

                                                            <Droppable
                                                              droppableId={
                                                                "droppable2 " +
                                                                subsection.SectionId +
                                                                " " +
                                                                subsection.OrderId
                                                              }
                                                              type={LEVEL3}
                                                            >
                                                              {(
                                                                provided,
                                                                snapshot
                                                              ) => (
                                                                <div
                                                                  {...provided.droppableProps}
                                                                  ref={
                                                                    provided.innerRef
                                                                  }
                                                                  style={{
                                                                    zIndex: 2000,
                                                                  }}
                                                                >
                                                                  {/* subsections2 */}
                                                                  {subsection.hasOwnProperty(
                                                                    "SectionInner2"
                                                                  ) &&
                                                                    subsection
                                                                      .SectionInner2
                                                                      .length !==
                                                                      0 &&
                                                                    subsection.SectionInner2.map(
                                                                      (
                                                                        subsections2,
                                                                        index
                                                                      ) => (
                                                                        <Draggable
                                                                          key={
                                                                            subsections2.OrderId
                                                                          }
                                                                          draggableId={
                                                                            data.OrderId +
                                                                            " " +
                                                                            subsection.OrderId +
                                                                            " " +
                                                                            subsections2.OrderId +
                                                                            " " +
                                                                            subsection.SectionId
                                                                          }
                                                                          index={
                                                                            index
                                                                          }
                                                                        >
                                                                          {(
                                                                            provided,
                                                                            snapshot
                                                                          ) => (
                                                                            <div
                                                                              ref={
                                                                                provided.innerRef
                                                                              }
                                                                              {...provided.draggableProps}
                                                                              {...provided.dragHandleProps}
                                                                            >
                                                                              <Accordion
                                                                                className={
                                                                                  classes.hideBorder
                                                                                }
                                                                                defaultExpanded={
                                                                                  false
                                                                                }
                                                                                style={{
                                                                                  marginLeft:
                                                                                    "55px",
                                                                                }}
                                                                              >
                                                                                <AccordionSummary
                                                                                  className={
                                                                                    styles.accordianInner2
                                                                                  }
                                                                                  style={{
                                                                                    flexDirection:
                                                                                      "row-reverse",
                                                                                    alignItems:
                                                                                      "start",
                                                                                  }}
                                                                                  aria-controls="panel1a-content"
                                                                                  id="panel1a-header"
                                                                                >
                                                                                  <div
                                                                                    style={{
                                                                                      display:
                                                                                        "flex",
                                                                                      flexDirection:
                                                                                        "column",
                                                                                      backgroundColor:
                                                                                        "#ebeced",
                                                                                    }}
                                                                                  >
                                                                                    <div
                                                                                      className={
                                                                                        styles.iconsandtextBox
                                                                                      }
                                                                                      style={{
                                                                                        width:
                                                                                          "65vw",
                                                                                      }}
                                                                                    >
                                                                                      <div
                                                                                        style={{
                                                                                          display:
                                                                                            "flex",
                                                                                          flexDirection:
                                                                                            "row",
                                                                                        }}
                                                                                      >
                                                                                        <p
                                                                                          id="orderId_3"
                                                                                          style={{
                                                                                            padding:
                                                                                              "0px 0 0 2px",
                                                                                            color:
                                                                                              "black",
                                                                                            fontSize:
                                                                                              "var(--subtitle_text_font_size)",
                                                                                            fontWeight:
                                                                                              "600",
                                                                                            fontFamily:
                                                                                              "Open Sans",
                                                                                            width:
                                                                                              "2.5rem",
                                                                                            height:
                                                                                              "1.5rem",
                                                                                            marginTop:
                                                                                              "0px",
                                                                                            borderRight:
                                                                                              "none",
                                                                                          }}
                                                                                        >
                                                                                          {data.OrderId +
                                                                                            "." +
                                                                                            subsection.OrderId +
                                                                                            "." +
                                                                                            subsections2.OrderId +
                                                                                            "."}
                                                                                        </p>
                                                                                        <p
                                                                                          id="sectionName_3"
                                                                                          onClick={(
                                                                                            e
                                                                                          ) =>
                                                                                            e.stopPropagation()
                                                                                          }
                                                                                          style={{
                                                                                            fontSize:
                                                                                              "var(--subtitle_text_font_size)",
                                                                                            fontWeight:
                                                                                              "600",
                                                                                            fontFamily:
                                                                                              "Open Sans",
                                                                                            width:
                                                                                              "55vw",
                                                                                            marginLeft:
                                                                                              "10px",
                                                                                            borderLeft:
                                                                                              "none",
                                                                                          }}
                                                                                        >
                                                                                          {
                                                                                            subsections2.SectionName
                                                                                          }
                                                                                        </p>
                                                                                      </div>

                                                                                      <div
                                                                                        style={{
                                                                                          marginLeft:
                                                                                            "-10px",
                                                                                        }}
                                                                                      >
                                                                                        <EditOutlinedIcon
                                                                                          id="editIcon_3"
                                                                                          onClick={(
                                                                                            e
                                                                                          ) =>
                                                                                            editClicked(
                                                                                              e,
                                                                                              "3rd",
                                                                                              data,
                                                                                              subsection,
                                                                                              subsections2
                                                                                            )
                                                                                          }
                                                                                          style={{
                                                                                            color:
                                                                                              "grey",
                                                                                            height:
                                                                                              "1.7rem",
                                                                                            width:
                                                                                              "1.7rem",
                                                                                            cursor:
                                                                                              "pointer",
                                                                                          }}
                                                                                        />
                                                                                        <DeleteOutlineIcon
                                                                                          id="deleteIcon_3"
                                                                                          onClick={(
                                                                                            e
                                                                                          ) =>
                                                                                            deleteClicked(
                                                                                              e,
                                                                                              "3rd",
                                                                                              data,
                                                                                              subsection,
                                                                                              subsections2
                                                                                            )
                                                                                          }
                                                                                          style={{
                                                                                            color:
                                                                                              "grey",
                                                                                            height:
                                                                                              "1.7rem",
                                                                                            width:
                                                                                              "1.7rem",
                                                                                            cursor:
                                                                                              "pointer",
                                                                                          }}
                                                                                        />
                                                                                      </div>
                                                                                    </div>
                                                                                    <div>
                                                                                      <p
                                                                                        style={{
                                                                                          font: "var(--base_text_font_size) Open Sans",
                                                                                          margin:
                                                                                            "-5px 0 0 2px",
                                                                                          width:
                                                                                            "58vw",
                                                                                        }}
                                                                                      >
                                                                                        {
                                                                                          subsections2.Description
                                                                                        }
                                                                                      </p>
                                                                                    </div>
                                                                                  </div>
                                                                                </AccordionSummary>
                                                                              </Accordion>
                                                                            </div>
                                                                          )}
                                                                        </Draggable>
                                                                      )
                                                                    )}
                                                                  {
                                                                    provided.placeholder
                                                                  }
                                                                </div>
                                                              )}
                                                            </Droppable>
                                                          </Accordion>
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  )
                                                )}
                                              {provided.placeholder}
                                            </div>
                                          )}
                                        </Droppable>
                                      </Accordion>
                                    </div>
                                  )}
                                </Draggable>
                              </div>
                            );
                          })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {firstLevelTextFieldShow === true ? (
                  <Modal open={firstLevelTextFieldShow}>
                    <AddNewSectionBox
                      mapNewSection={(data) => mapNewSection(data)}
                      levelToMap={levelToMap}
                      cancelCallBack={cancelAddNewSection}
                      previousOrderId={previousOrderId}
                    />
                  </Modal>
                ) : null}
                {showEditBox === true ? (
                  <Modal open={showEditBox}>
                    <EditSectionBox
                      editMapToData={(data) => editMapToData(data)}
                      sectionToEdit={sectionToEdit}
                      cancelCallBack={cancelAddNewSection}
                    />
                  </Modal>
                ) : null}
                {showExportImportModal === true ? (
                  <Modal open={showExportImportModal}>
                    <ExportImport
                      exportOrImportToShow={exportOrImportToShow}
                      closeExportImportModal={closeExportImportModal}
                      sections={reqData}
                      getSectionsDataAgain={getSections}
                    />
                  </Modal>
                ) : null}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "80%",
                  height: "80%",
                }}
              >
                <NotInterestedOutlinedIcon />
                <p className={styles.headingInfo}>
                  {t("noRequirementDefined")}, {t("pleaseUseAddSection")}
                </p>
                {firstLevelTextFieldShow === true ? (
                  <Modal open={firstLevelTextFieldShow}>
                    <AddNewSectionBox
                      mapNewSection={(data, levelToMap) =>
                        mapNewSection(data, levelToMap)
                      }
                      cancelCallBack={cancelAddNewSection}
                      levelToMap={levelToMap}
                      previousOrderId={0}
                    />
                  </Modal>
                ) : null}
                {showExportImportModal === true ? (
                  <Modal open={showExportImportModal}>
                    <ExportImport
                      exportOrImportToShow={exportOrImportToShow}
                      closeExportImportModal={closeExportImportModal}
                      sections={reqData}
                    />
                  </Modal>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    templateId: state.openTemplateReducer.templateId,
    templateName: state.openTemplateReducer.templateName,
    openTemplateFlag: state.openTemplateReducer.openFlag,
  };
};

export default connect(mapStateToProps)(GlobalRequirementSections);
