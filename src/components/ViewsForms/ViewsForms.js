import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Search from "../../UI/Search Component/index.js";
import AddIcon from "@material-ui/icons/Add";
import LinkIcon from "@material-ui/icons/Link";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Tabs, Tab, Box, Typography, Button } from "@material-ui/core";
import styles from "./ViewForms.module.css";
import Modal from "../../UI/Modal/Modal";

import { useGlobalState, store } from "state-pool";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import MicroFrontendContainer from "../MicroFrontendContainer/index.js";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { useTranslation } from "react-i18next";
import Popover from "@material-ui/core/Popover";
import Pinicon from "../../../src/assets/abstractView/Icons/PD_PinEnabled.svg";
import axios from "axios";
import {
  BASE_URL,
  ENDPOINT_GET_FORMASSOCIATIONS,
  SERVER_URL,
} from "../../Constants/appConstants.js";
import EditIcon from "@material-ui/icons/Edit";
import LayoutSelection from "./LayoutSelection/LayoutSelection.js";
import FormsListWithWorkstep from "./FormsListWithWorkstep/FormsListWithWorkstep.js";
import RuleListForm from "./RuleListForm/RuleListForm.js";

function ViewsForms(props) {
  let { t } = useTranslation();
  // const processData = store.getState("loadedProcessData");
  // const [localLoadedProcessData] = useGlobalState(processData);

  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked

  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const formsList = store.getState("allFormsList");

  const [allGlobalFormsList, setallGlobalFormsList] = useGlobalState(formsList);

  const [layoutSelectionFlow, setlayoutSelectionFlow] = useState(false);

  const [allFormsList, setallFormsList] = useState([]);
  const [isSingleFormAttached, setisSingleFormAttached] = useState(false);
  const [spinner, setspinner] = useState(true);

  const getAllForms = async () => {
    let processType;
    switch (localLoadedProcessData?.ProcessType) {
      case "L":
        processType = "local";
        break;
      case "R":
        processType = "registered";
        break;
      default:
        processType = "local";
    }
    const res = await axios.get(
      BASE_URL +
        `/process/${processType}/getFormlist/${localLoadedProcessData?.ProcessDefId}`
    );
    setallFormsList([
      { formId: -1, formName: "HTML", deviceType: "H" },
      ...res.data,
    ]);
    setallGlobalFormsList([
      { formId: -1, formName: "HTML", deviceType: "H" },
      ...res.data,
    ]);
  };
  const getFormDetailsById = (id) => {
    let temp = {};
    allFormsList.some((form) => {
      if (form.formId + "" == id + "") {
        temp = form;
        return true;
      }
    });
    return temp;
  };

  useEffect(() => {
    getAllForms();
  }, [localLoadedProcessData?.ProcessDefId]);
  const [formAssociationData, setformAssociationData] = useGlobalState(
    "allFormAssociationData"
  );
  useEffect(() => {
    const getFormAssocData = async () => {
      const res = await axios.get(
        SERVER_URL +
          `/formAssociations/${localLoadedProcessData.ProcessDefId}/${localLoadedProcessData.ProcessType}`
      );
      if (res?.data?.FormAssociations?.formsInfos.length === 0) {
        setlayoutSelectionFlow(true);
      }

      setformAssociationData(res?.data?.FormAssociations?.formsInfos);
    };
    getFormAssocData();
  }, []);
  const [formIdtoDisplay, setformIdtoDisplay] = useState(1);
  const [rulesModalOpen, setrulesModalOpen] = useState(false);
  const [selectedFormBox, setSelectedFormBox] = useState(0);

  const getFormId = () => {
    let temp = undefined;
    // const result = formAssociationData?.some((assocData) => {
    //   if (+assocData.formId === +formAssociationData[0].formId) {
    //     temp === +formAssociationData[0].formId;
    //     return true;
    //   }
    // });
    const result = formAssociationData?.every(
      (assocData) =>
        // if (
        +assocData.formId === +formAssociationData[0].formId
      // ) {
      //   temp === +formAssociationData[0].formId;
      //   return true;
      // }
    );

    if (result === true && formAssociationData[0]?.formId) {
      setformIdtoDisplay(+formAssociationData[0]?.formId);
      setisSingleFormAttached(true);
    } else {
      setformIdtoDisplay(+formAssociationData[0]?.formId);
      setisSingleFormAttached(false);
    }
  };

  useEffect(() => {
    getFormId();
  }, [formAssociationData]);

  useEffect(() => {
    handleViewForm(formIdtoDisplay);
  }, [formIdtoDisplay]);
  const handleViewForm = (formId) => {
    if (formAssociationData.length > 0) {
      let passedData = {
        // applicationId: activeId,

        component: "preview",

        containerId: "mf_forms_home_show",

        formDefId: +formIdtoDisplay || 1,

        processId: +localLoadedProcessData.ProcessDefId,

        // formName: obj.value.formName,

        // formType: props.formType,

        formPageType: "Processes",

        statusType: localLoadedProcessData.ProcessType,
      };
      console.log("ffffffffffffffff", formIdtoDisplay);
      window.loadFormBuilderPreview(passedData, "mf_forms_home_show");
    }
  };

  const displayFormMicrofrontend = (index) => {
    setSelectedFormBox(index);
    setformIdtoDisplay(+formAssociationData[index].formId);
  };

  return (
    <>
      {/* {spinner ? (
        <p>hi</p>
      ) : ( */}
      <div style={{ height: "82vh", width: "100vw" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            height: "8%",
            // marginLeft: "10px",
            fontSize: "14px",
            fontFamily: "Open Sans",
            paddingBlock: "5px",
            paddingInline: "10px",
            boxShadow: "0px 3px 6px #00000029",
            marginBottom: "10px",
          }}
        >
          <p style={{ marginRight: "10px" }}>{t("form")}: </p>
          <p style={{ fontWeight: "600" }}>
            {isSingleFormAttached
              ? getFormDetailsById(formIdtoDisplay).formName
              : "Workstep wise Forms"}
          </p>
          {localLoadedProcessData.ProcessType === "L" ? (
            <button
              style={{
                width: "4.0625rem",
                height: "1.75rem",
                marginInline: "10px",
                color: "#0072C6",
                border: "1px solid #0072C6",
                borderRadius: "0.125rem",
              }}
              onClick={() => setlayoutSelectionFlow(true)}
            >
              {t("change")}
            </button>
          ) : null}

          <button
            style={{
              width: "70px",
              height: "30px",
              marginInline: "10px",
              color: "#0072C6",
              border: "none",
            }}
            onClick={() => setrulesModalOpen(true)}
          >
            {t("formRules")}
          </button>
        </div>
        {rulesModalOpen ? (
          <Modal
            show={rulesModalOpen}
            backDropStyle={{ backgroundColor: "transparent" }}
            style={{
              width: "85vw",
              height: "90vh",
              // left: props.isDrawerExpanded ? "23%" : "53%",
              top: "50%",
              left: "50%",
              position: "fixed",
              padding: "0",
              boxShadow: "none",
              transform: "translate(-50%,-50%)",
            }}
            modalClosed={() => setrulesModalOpen(false)}
            children={
              <RuleListForm
                closeModal={() => setrulesModalOpen(false)}
                // direction={direction}
              />
            }
          />
        ) : null}

        {formAssociationData !== undefined &&
        formAssociationData.length > 0 &&
        !layoutSelectionFlow ? (
          <div style={{ height: "90%", width: "100%" }}>
            {isSingleFormAttached ? (
              <div
                id="mf_forms_home_show"
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
              ></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "40%",
                    height: "100%",
                    paddingInline: "20px",
                    paddingTop: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "30px",
                      marginBlock: "5px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    <p>{t("workstepName")}</p>
                    <p>{t("associatedForm")}</p>
                  </div>
                  {formAssociationData.map((assocData, index) => (
                    <div
                      style={{
                        width: "100%",
                        height: "45px",
                        marginBlock: "10px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "13px",
                        border:
                          index === selectedFormBox
                            ? "1px solid #0172C6"
                            : "1px solid transparent",
                        background:
                          index === selectedFormBox ? "#0172C61A" : "white",
                        paddingInline: "15px",
                      }}
                      onClick={() => displayFormMicrofrontend(index)}
                    >
                      <p style={{ fontWeight: "600" }}>
                        {assocData.activity.actName}
                      </p>
                      <p style={{ opacity: "0.7" }}>
                        {getFormDetailsById(assocData.formId).formName}
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  id="mf_forms_home_show"
                  style={{
                    width: "60%",
                    height: "100%",
                    overflow: "hidden",
                  }}
                ></div>
              </div>
            )}
          </div>
        ) : (
          <Modal
            show={layoutSelectionFlow}
            backDropStyle={{ backgroundColor: "transparent" }}
            style={{
              width: "95vw",
              height: "90vh",
              // left: props.isDrawerExpanded ? "23%" : "53%",
              top: "50%",
              left: "50%",
              padding: "0",
              boxShadow: "none",
              transform: "translate(-50%,-50%)",
            }}
            modalClosed={() => setlayoutSelectionFlow(false)}
            children={
              <LayoutSelection
                allFormsList={allFormsList}
                closeModal={() => setlayoutSelectionFlow(false)}
                // getFormId={getFormId}
                setisSingleFormAttached={setisSingleFormAttached}
                setformIdtoDisplay={setformIdtoDisplay}
              />
            }
          />
          //   )}
          // </div>
        )}
      </div>
      {/* )} */}
    </>
  );
}

// --------------------------------------------------------------------------------------------

export default ViewsForms;
