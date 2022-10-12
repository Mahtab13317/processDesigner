import React, { useState, useEffect } from "react";

import { CircularProgress } from "@material-ui/core";
import Modal from "../../UI/Modal/Modal";

import { useGlobalState, store } from "state-pool";

import { useTranslation } from "react-i18next";

import axios from "axios";
import {
  BASE_URL,
  ENDPOINT_GET_FORMASSOCIATIONS,
  SERVER_URL,
} from "../../Constants/appConstants.js";

import LayoutSelection from "./LayoutSelection/LayoutSelection.js";

import RuleListForm from "./RuleListForm/RuleListForm.js";
import MockSvg from "../../assets/MockSvg.svg";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
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

  const getProcessType = (processType) => {
    let temp;
    switch (processType) {
      case "L":
        temp = "L";
        break;
      case "R":
        temp = "R";
        break;
      case "LC":
        temp = "L";
        break;
      default:
        temp = "R";
    }
    return temp;
  };
  useEffect(() => {
    const getFormAssocData = async () => {
      const res = await axios.get(
        SERVER_URL +
          `${ENDPOINT_GET_FORMASSOCIATIONS}/${
            localLoadedProcessData.ProcessDefId
          }/${getProcessType(localLoadedProcessData.ProcessType)}`
      );
      if (res?.data?.FormAssociations?.formsInfos.length === 0) {
        setlayoutSelectionFlow(true);
      }

      setformAssociationData(res?.data?.FormAssociations?.formsInfos);
      setspinner(false);
    };
    getFormAssocData();
  }, []);
  const [formIdtoDisplay, setformIdtoDisplay] = useState();
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
      (assocData) => +assocData.formId === +formAssociationData[0].formId
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
    if (formAssociationData.length > 0 && !!formIdtoDisplay) {
      let passedData = {
        // applicationId: activeId,

        component: "preview",

        containerId: "mf_forms_home_show",

        formDefId: +formIdtoDisplay,

        processId: +localLoadedProcessData.ProcessDefId,

        // formName: obj.value.formName,

        // formType: props.formType,

        formPageType: "Processes",

        statusType: localLoadedProcessData.ProcessType,
      };

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
        {spinner ? (
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                height: "8%",
                // marginLeft: "10px",
                fontSize: "var(--subtitle_text_font_size)",
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
                    height: "1.75rem",
                    marginInline: "10px",
                    color: "var(--button_color)",
                    border: "1px solid var(--button_color)",
                    borderRadius: "0.125rem",
                    fontSize: "var(--base_text_font_size)",
                  }}
                  onClick={() => setlayoutSelectionFlow(true)}
                >
                  {t("change")}
                </button>
              ) : null}

              {localLoadedProcessData.ProcessType === "L" ? (
                <button
                  style={{
                    height: "30px",
                    marginInline: "10px",
                    color: "var(--button_color)",
                    border: "none",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => setrulesModalOpen(true)}
                >
                  {t("formRules")}
                </button>
              ) : null}
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

            {!layoutSelectionFlow ? (
              <div style={{ height: "90%", width: "100%" }}>
                {formAssociationData.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "var(--title_text_font_size)",
                      fontWeight: "bold",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      src={MockSvg}
                      alt=""
                      style={{
                        width: "100px",
                        height: "100px",

                        marginBottom: "20px",
                      }}
                    />
                    {t("associateFormsPlease")}
                  </div>
                ) : (
                  <>
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
                              fontSize: "var(--base_text_font_size)",
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
                                fontSize: "var(--base_text_font_size)",
                                border:
                                  index === selectedFormBox
                                    ? "1px solid #0172C6"
                                    : "1px solid transparent",
                                background:
                                  index === selectedFormBox
                                    ? "#0172C61A"
                                    : "white",
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
                  </>
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
                // modalClosed={() => {
                //   setlayoutSelectionFlow(false);
                //   dispatch(setViewingAreaTabValue(0));
                // }}
                children={
                  <LayoutSelection
                    allFormsList={allFormsList}
                    closeModal={() => {
                      setlayoutSelectionFlow(false);
                      // dispatch(setViewingAreaTabValue(0));
                    }}
                    // getFormId={getFormId}
                    setisSingleFormAttached={setisSingleFormAttached}
                    setformIdtoDisplay={setformIdtoDisplay}
                  />
                }
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

// --------------------------------------------------------------------------------------------

export default ViewsForms;
