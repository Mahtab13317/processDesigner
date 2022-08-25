// Changes made to solve 110715 (Global Requirement section: Buttons not visible while Adding section) and
// 113580 (if the requirements are on project level not on Global level then the message should be different)
// 110720, Global Requirement section: section with lengthy data was not added

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
  ENDPOINT_FETCHPROJECTREQUIREMENTS,
  ENDPOINT_ADDPROJECTREQUIREMENTS,
  ENDPOINT_DELETEPROJECTREQUIREMENTS,
  ENDPOINT_EDITPROJECTREQUIREMENTS,
  ADD,
  EDIT,
  DELETE,
  LEVEL1,
  LEVEL2,
  LEVEL3,
} from "../../../../../Constants/appConstants";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditOutlinedIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import ExportImport from "./ExportImport";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "react-i18next";
import AddNewSectionBox from "./AddNewSectionBoxProject";
import Modal from "../../../../../UI/Modal/Modal";
import EditSectionBox from "./EditNewSectionBox";
import "./index.css";

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
  const [reqData, setreqData] = useState([]);
  const [showEditBox, setshowEditBox] = useState(false);
  const [spinner, setspinner] = useState(true);
  const [firstLevelTextFieldShow, setfirstLevelTextFieldShow] = useState(false);
  const [sectionToEdit, setsectionToEdit] = useState({});
  const [levelToMap, setlevelToMap] = useState();
  const [levelToEdit, setlevelToEdit] = useState();
  const [previousOrderId, setpreviousOrderId] = useState();
  const [level1DataOrderId, setlevel1DataOrderId] = useState(null);
  const [level2DataOrderId, setlevel2DataOrderId] = useState(null);

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

  useEffect(() => {
    async function getSections() {
      const res = await axios.get(
        SERVER_URL +
          ENDPOINT_FETCHPROJECTREQUIREMENTS +
          `/${props.selectedProjectId}/${props.selectedProcessCode}`
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
    getSections();
  }, []);

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
      reqData[level1Data.OrderId - 1].SectionInner.forEach((item, idx) => {
        if (item.OrderId === level2Data.OrderId) {
          setlevel2DataOrderId(idx);
        }
      });
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
      reqData[level1Data.OrderId - 1].SectionInner.forEach((item, idx) => {
        if (item.OrderId === level2Data.OrderId) {
          setlevel2DataOrderId(idx);
        }
      });
    }
  };

  const editMapToData = async (data) => {
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
        level2DataOrderId
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
        temp.push({ ...data, SectionId: flagForApi.SectionId });
        setreqData(temp);
      } else return;
    } else if (levelToMap === LEVEL2) {
      const flagForApi = await commonApiCalls(
        ADD,
        data,
        temp[level1DataOrderId - 1].SectionId
      );
      if (flagForApi) {
        let dataToPush = { ...data, SectionId: flagForApi.SectionId };
        if (temp[level1DataOrderId - 1].hasOwnProperty("SectionInner")) {
          temp[level1DataOrderId - 1].SectionInner.push(dataToPush);
        } else temp[level1DataOrderId - 1].SectionInner = [dataToPush];

        setreqData(temp);
      } else return;
    } else {
      const flagForApi = await commonApiCalls(
        ADD,
        data,
        temp[level1DataOrderId - 1].SectionInner[level2DataOrderId].SectionId
      );
      if (flagForApi) {
        let dataToPush = { ...data, SectionId: flagForApi.SectionId };
        if (
          temp[level1DataOrderId - 1].SectionInner[
            level2DataOrderId
          ].hasOwnProperty("SectionInner2")
        )
          temp[level1DataOrderId - 1].SectionInner[
            level2DataOrderId
          ].SectionInner2.push(dataToPush);
        else
          temp[level1DataOrderId - 1].SectionInner[
            level2DataOrderId
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
        sectionId: temp[result.source.index].SectionId,
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
          temp[nest[0] - 1].SectionInner[result.source.index].SectionId,
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
          temp[nest[0] - 1].SectionInner[nest[1] - 1].SectionInner2[
            result.source.index
          ].OrderId,
        sectionOrderId:
          temp[nest[0] - 1].SectionInner[nest[1] - 1].SectionInner2[
            result.destination.index
          ].OrderId,
        sectionId:
          temp[nest[0] - 1].SectionInner[nest[1] - 1].SectionInner2[
            result.source.index
          ].SectionId,
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
      SERVER_URL + ENDPOINT_EDITPROJECTREQUIREMENTS,
      payload
    );

    const data = await res.data.Section;

    setreqData(sortByKey(data, "OrderId"));
  };

  const commonApiCalls = async (method, data, parentId) => {
    if (method === ADD) {
      const payload = {
        projectId: props.selectedProjectId,
        m_arrSectionInfo: [
          {
            sectionName: data.SectionName,
            sectionDesc: data.Description,
            sectionOrderId: data.OrderId,
            m_bExclude: false,
            parentId: parentId,
          },
        ],
      };
      const res = await axios.post(
        SERVER_URL + ENDPOINT_ADDPROJECTREQUIREMENTS,
        payload
      );

      const resData = await res.data;
      if (resData.Status === 0) return resData;
      else return false;
    } else if (method === DELETE) {
      const payload = {
        projectId: props.selectedProjectId,
        m_arrSectionInfo: [
          {
            sectionName: data.SectionName,
            sectionId: data.SectionId,
          },
        ],
      };
      const res = await axios.post(
        SERVER_URL + ENDPOINT_DELETEPROJECTREQUIREMENTS,
        payload
      );
      const resData = await res.data;
      if (resData.Status === 0) return true;
      else return false;
    } else if (method === EDIT) {
      const payload = {
        projectId: props.selectedProjectId,
        m_arrSectionInfo: [
          {
            sectionName: data.SectionName,
            sectionDesc: data.Description,
            sectionOrderId: data.OrderId,
            sectionId: data.SectionId,
            m_bExclude: false,
          },
        ],
      };

      const res = await axios.post(
        SERVER_URL + ENDPOINT_EDITPROJECTREQUIREMENTS,
        payload
      );
      const resData = await res.data;
      if (resData.Status === 0) return true;
      else return false;
    }
  };

  return (
    <div
      className={styles.page}
      style={{ width: "98%", height: "75vh", margin: "1rem 1vw" }}
    >
      <div className={styles.headingProjectLevel}>
        <div className={styles.headingBox}>
          <p className={styles.headingText}>Project Requirements Section</p>
          <p className={styles.headingInfo}>
            Requirement sections which are defined here, will automatically
            appear in in all the processes of this project.
          </p>
        </div>
        <div>
          <Button
            className={styles.addSectionButton}
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
          {reqData?.length !== 0 ? (
            <div
              className={styles.body}
              style={{ width: "100%", minHeight: "64vh" }}
            >
              <DragDropContext onDragEnd={dragEndHandler}>
                <Droppable droppableId="droppable" type={LEVEL1}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        zIndex: 0,
                      }}
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
                                    <Accordion
                                      className={`${classes.hideBorder} globalSection`}
                                    >
                                      <AccordionSummary
                                        className={styles.accordianOuter}
                                        style={{
                                          flexDirection: "row-reverse",
                                          alignItems: "start",
                                        }}
                                        expandIcon={
                                          <ExpandMoreIcon
                                            id="expand_1"
                                            style={{
                                              color: "var(--button_color)",
                                              width: "1.5rem",
                                              height: "1.75rem",
                                            }}
                                          />
                                        }
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <div
                                            className={styles.iconsandtextBox}
                                            style={{
                                              width: "100%",
                                              padding: "0 0.5vw",
                                            }}
                                          >
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                gap: "0.5vw",
                                              }}
                                            >
                                              <p
                                                id="orderId_1"
                                                style={{
                                                  padding: "0px 0 0 2px",
                                                  color: "var(--button_color)",
                                                  fontSize:
                                                    "var(--subtitle_text_font_size)",
                                                  fontWeight: "600",
                                                  fontFamily:
                                                    "var(--font_family)",
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
                                                  fontFamily:
                                                    "var(--font_family)",
                                                  color: "var(--button_color)",
                                                  marginTop: "0px",
                                                  borderLeft: "none",
                                                }}
                                              >
                                                {data.SectionName}
                                              </p>
                                            </div>

                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5vw",
                                              }}
                                            >
                                              <AddIcon
                                                id="addIcon_1"
                                                onClick={(e) =>
                                                  addSection(e, LEVEL2, data)
                                                }
                                                style={{
                                                  color: "grey",
                                                  height: "1.5rem",
                                                  width: "1.5rem",
                                                  cursor: "pointer",
                                                }}
                                              />
                                              <EditOutlinedIcon
                                                id="editIcon_1"
                                                style={{
                                                  color: "grey",
                                                  height: "1.5rem",
                                                  width: "1.5rem",
                                                  cursor: "pointer",
                                                }}
                                                onClick={(e) =>
                                                  editClicked(e, LEVEL2, data)
                                                }
                                              />
                                              <DeleteOutlineIcon
                                                id="deleteIcon_1"
                                                onClick={(e) =>
                                                  deleteClicked(e, LEVEL2, data)
                                                }
                                                style={{
                                                  color: "grey",
                                                  height: "1.5rem",
                                                  width: "1.5rem",
                                                  cursor: "pointer",
                                                }}
                                              />
                                            </div>
                                          </div>
                                          <div
                                            style={{ padding: "0.25rem 2vw" }}
                                          >
                                            <p
                                              id="description_1"
                                              style={{
                                                width: "66vw",
                                                fontFamily:
                                                  "var(--font_family)",
                                                fontSize:
                                                  "var(--base_text_font_size)",
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
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                      >
                                                        <Accordion
                                                          className={`${classes.hideBorder} globalSection`}
                                                          defaultExpanded={
                                                            false
                                                          }
                                                          style={{
                                                            marginLeft: "2vw",
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
                                                                  width:
                                                                    "1.5rem",
                                                                  height:
                                                                    "1.75rem",
                                                                }}
                                                              />
                                                            }
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header"
                                                          >
                                                            <div
                                                              style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                  "column",
                                                                height: "auto",
                                                                backgroundColor:
                                                                  "#F6F6F6",
                                                              }}
                                                            >
                                                              <div
                                                                className={
                                                                  styles.iconsandtextBox
                                                                }
                                                                style={{
                                                                  width: "67vw",
                                                                  padding:
                                                                    "0 0.5vw 0 0",
                                                                }}
                                                              >
                                                                <div
                                                                  style={{
                                                                    display:
                                                                      "flex",
                                                                    flexDirection:
                                                                      "row",
                                                                    gap: "0.5vw",
                                                                  }}
                                                                >
                                                                  <p
                                                                    id="orderId_2"
                                                                    style={{
                                                                      padding:
                                                                        "0px 0 0 2px",
                                                                      color:
                                                                        "#000",
                                                                      fontSize:
                                                                        "var(--subtitle_text_font_size)",
                                                                      fontWeight:
                                                                        "600",
                                                                      fontFamily:
                                                                        "var(--font_family)",
                                                                      borderRight:
                                                                        "none",
                                                                    }}
                                                                  >
                                                                    {subsection.OrderId +
                                                                      "."}
                                                                  </p>

                                                                  <p
                                                                    id="sectionName_2"
                                                                    style={{
                                                                      fontWeight:
                                                                        "600",
                                                                      fontSize:
                                                                        "var(--subtitle_text_font_size)",
                                                                      fontFamily:
                                                                        "var(--font_family)",
                                                                      color:
                                                                        "#000",
                                                                      marginTop:
                                                                        "0px",
                                                                      borderLeft:
                                                                        "none",
                                                                    }}
                                                                  >
                                                                    {
                                                                      subsection.SectionName
                                                                    }
                                                                  </p>
                                                                </div>

                                                                <div
                                                                  style={{
                                                                    display:
                                                                      "flex",
                                                                    alignItems:
                                                                      "center",
                                                                    gap: "0.5vw",
                                                                  }}
                                                                >
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
                                                                        "1.5rem",
                                                                      width:
                                                                        "1.5rem",
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
                                                                        "1.5rem",
                                                                      width:
                                                                        "1.5rem",
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
                                                                        "1.5rem",
                                                                      width:
                                                                        "1.5rem",
                                                                      cursor:
                                                                        "pointer",
                                                                    }}
                                                                  />
                                                                </div>
                                                              </div>
                                                              <div
                                                                style={{
                                                                  padding:
                                                                    "0.25rem 2vw",
                                                                }}
                                                              >
                                                                <p
                                                                  id="description_2"
                                                                  style={{
                                                                    width:
                                                                      "60vw",
                                                                    fontFamily:
                                                                      "var(--font_family)",
                                                                    fontSize:
                                                                      "var(--base_text_font_size)",
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
                                                                              className={`${classes.hideBorder} globalSection`}
                                                                              defaultExpanded={
                                                                                false
                                                                              }
                                                                              style={{
                                                                                marginLeft:
                                                                                  "3.5vw",
                                                                                marginTop:
                                                                                  "0.5rem",
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
                                                                                      "#F6F6F6",
                                                                                  }}
                                                                                >
                                                                                  <div
                                                                                    className={
                                                                                      styles.iconsandtextBox
                                                                                    }
                                                                                    style={{
                                                                                      width:
                                                                                        "64.8vw",
                                                                                      padding:
                                                                                        "0 0.5vw 0 0",
                                                                                    }}
                                                                                  >
                                                                                    <div
                                                                                      style={{
                                                                                        display:
                                                                                          "flex",
                                                                                        flexDirection:
                                                                                          "row",
                                                                                        gap: "0.5vw",
                                                                                      }}
                                                                                    >
                                                                                      <p
                                                                                        id="orderId_3"
                                                                                        style={{
                                                                                          padding:
                                                                                            "0px 0 0 2px",
                                                                                          color:
                                                                                            "#000",
                                                                                          fontSize:
                                                                                            "var(--subtitle_text_font_size)",
                                                                                          fontWeight:
                                                                                            "600",
                                                                                          fontFamily:
                                                                                            "var(--font_family)",
                                                                                          marginTop:
                                                                                            "0px",
                                                                                          borderRight:
                                                                                            "none",
                                                                                        }}
                                                                                      >
                                                                                        {subsections2.OrderId +
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
                                                                                            "var(--font_family)",
                                                                                          width:
                                                                                            "55vw",
                                                                                          marginLeft:
                                                                                            "0px",
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
                                                                                        display:
                                                                                          "flex",
                                                                                        alignItems:
                                                                                          "center",
                                                                                        gap: "0.5vw",
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
                                                                                            "1.5rem",
                                                                                          width:
                                                                                            "1.5rem",
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
                                                                                            "1.5rem",
                                                                                          width:
                                                                                            "1.5rem",
                                                                                          cursor:
                                                                                            "pointer",
                                                                                        }}
                                                                                      />
                                                                                    </div>
                                                                                  </div>
                                                                                  <div
                                                                                    style={{
                                                                                      padding:
                                                                                        "0.25rem 3.25vw",
                                                                                    }}
                                                                                  >
                                                                                    <p
                                                                                      style={{
                                                                                        width:
                                                                                          "57vw",
                                                                                        fontFamily:
                                                                                          "var(--font_family)",
                                                                                        fontSize:
                                                                                          "var(--base_text_font_size)",
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
                <Modal
                  show={firstLevelTextFieldShow}
                  style={{
                    width: "30vw",
                    left: "35%",
                    top: "25%",
                    padding: "0",
                  }}
                  modalClosed={() => setfirstLevelTextFieldShow(false)}
                  children={
                    <AddNewSectionBox
                      mapNewSection={(data) => mapNewSection(data)}
                      levelToMap={levelToMap}
                      cancelCallBack={cancelAddNewSection}
                      previousOrderId={previousOrderId}
                    />
                  }
                />
              ) : null}
              {showEditBox === true ? (
                <Modal
                  show={showEditBox}
                  style={{
                    width: "30vw",
                    left: "35%",
                    top: "25%",
                    padding: "0",
                  }}
                  modalClosed={() => setshowEditBox(false)}
                  children={
                    <EditSectionBox
                      editMapToData={(data) => editMapToData(data)}
                      sectionToEdit={sectionToEdit}
                      cancelCallBack={cancelAddNewSection}
                    />
                  }
                />
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
                <Modal
                  show={firstLevelTextFieldShow}
                  style={{
                    width: "30vw",
                    left: "35%",
                    top: "25%",
                    padding: "0",
                  }}
                  modalClosed={() => setfirstLevelTextFieldShow(false)}
                  children={
                    <AddNewSectionBox
                      mapNewSection={(data, levelToMap) =>
                        mapNewSection(data, levelToMap)
                      }
                      cancelCallBack={cancelAddNewSection}
                      levelToMap={levelToMap}
                      previousOrderId={0}
                    />
                  }
                />
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
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
