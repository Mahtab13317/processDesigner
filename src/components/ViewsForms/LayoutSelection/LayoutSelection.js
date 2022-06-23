import React, { useState, useEffect } from "react";
import { Stepper, Step, StepButton, Button, Modal } from "@material-ui/core";
import styles from "./LayoutSelection.module.css";
import { useTranslation } from "react-i18next";

import FormAssociationType from "../FormAssociationType/FormAssociationType";
import FormsListWithWorkstep from "../FormsListWithWorkstep/FormsListWithWorkstep";
import RuleListForm from "../RuleListForm/RuleListForm";
import {
  BASE_URL,
  ENDPOINT_GET_FORMASSOCIATIONS,
  SERVER_URL,
} from "../../../Constants/appConstants";
import axios from "axios";
import { store, useGlobalState } from "state-pool";

function LayoutSelection(props) {
  let { t } = useTranslation();

  const direction = `${t("HTML_DIR")}​​​​​​​​`;
  const steps = ["Layout Selection", "Form Association"];
  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const formsList = store.getState("allFormsList");
  const [allFormsList, setallFormsList] = useGlobalState(formsList);
  const [formAssociationData, setformAssociationData] = useGlobalState(
    "allFormAssociationData"
  );
  const [formAssociationType, setformAssociationType] = useState("single");
  const [modifiedAssociationJson, setmodifiedAssociationJson] = useState();
  const [activeStep, setActiveStep] = useState(0);

  //Function that runs when the user goes to the previous step using the previous button.
  const handlePreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // Function that runs when the user goes to the next step using the next button.
  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const getFormAssociationType = (val) => {
    setformAssociationType(val);
  };

  const [rulesModalOpen, setrulesModalOpen] = useState(false);
  const getFormDetailsById = (id, allFormsList) => {
    let temp = {};
    allFormsList.some((form) => {
      if (form.formId + "" === id) {
        temp = form;
        return true;
      }
    });
    return temp;
  };

  const [allActivities, setallActivities] = useState([]);
  useEffect(() => {
    localLoadedProcessData.MileStones.forEach((mileStone) => {
      mileStone.Activities.forEach((activity, index) => {
        if (
          activity.ActivityType === 1 ||
          activity.ActivityType === 2 ||
          activity.ActivityType === 32 ||
          activity.ActivityType === 4 ||
          (activity.ActivityType === 10 &&
            (activity.ActivitySubType === 3 ||
              activity.ActivitySubType === 10 ||
              activity.ActivitySubType === 7 ||
              activity.ActivitySubType === 6))
        )
          setallActivities((prevState) => [...prevState, activity]);
      });
    });
  }, []);
  const [templateData, settemplateData] = useState();

  const handleSaveChanges = async () => {
    let temp = JSON.parse(JSON.stringify(formAssociationData));
    let temp2 = JSON.parse(JSON.stringify(allFormsList));
    if (templateData?.hasOwnProperty("templateid")) {
      let processType =
        localLoadedProcessData.ProcessType === "L" ? "local" : "registered";
      const res = await axios.get(
        BASE_URL +
          `/process/${processType}/formByTemplate/${localLoadedProcessData.ProcessDefId}/${templateData.templateid}`
      );

      temp2.push(res?.data);
      setallFormsList(temp2);
      let id = +res.data.formId;
      temp?.forEach((assocData) => {
        assocData.formId = id + "";
      });
      let otherActData = [];
      allActivities.forEach((act) => {
        otherActData.push({
          activity: {
            actId: act.ActivityId + "",
            actName: act.ActivityName,
          },
          formId: id + "",
        });
      });
      let newArr = [...temp, ...otherActData];
      const unique = [
        ...new Map(newArr.map((item) => [item.activity.actId, item])).values(),
      ];

      setformAssociationData(unique);
      temp = unique;
    }

    if (temp !== undefined) {
      let formAssocArr = [];
      temp.forEach((assocData) => {
        formAssocArr.push({
          formId: assocData.formId + "",
          formName: getFormDetailsById(assocData.formId + "", temp2).formName,
          activity: {
            actId: assocData.activity.actId + "",
            actName: assocData.activity.actName,
            operationType: "A",
          },
        });
      });
      let payload = {
        processDefId: localLoadedProcessData.ProcessDefId,
        registeredMode: localLoadedProcessData.ProcessType,
        formInfos: formAssocArr,
      };
      const result = formAssociationData?.every((assocData) => {
        if (+assocData.formId === +formAssociationData[0].formId) {
          return true;
        }
      });
      if (result) {
        props.setisSingleFormAttached(true);
        props.setformIdtoDisplay(+formAssociationData[0].formId);
      } else {
        props.setisSingleFormAttached(false);
        props.setformIdtoDisplay(1);
      }
      const res = await axios.post(
        SERVER_URL + ENDPOINT_GET_FORMASSOCIATIONS,
        payload
      );

      // setformAssociationData(modifiedAssociationJson);
      props.closeModal();
    } else props.closeModal();
    // props.getFormId();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        direction: direction,
      }}
    >
      {rulesModalOpen ? (
        <Modal open={rulesModalOpen}>
          <RuleListForm
            closeModal={() => setrulesModalOpen(false)}
            direction={direction}
          />
        </Modal>
      ) : null}
      <div
        style={{
          width: "100%",
          height: "10%",

          display: "flex",
          alignItems: "center",
          paddingInline: "0.6rem",
          direction: direction,
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontSize: "14px", fontWeight: "bold" }}>
          {t("settingUpYourWorkitemView")}
        </p>
        <button onClick={() => setrulesModalOpen(true)}>Rules</button>
      </div>

      <div
        style={{
          width: "100%",
          height: "80%",
        }}
      >
        {activeStep === 0 ? (
          <FormAssociationType
            getFormAssociationType={getFormAssociationType}
            formAssociationType={formAssociationType}
          />
        ) : (
          <FormsListWithWorkstep
            modifiedAssociationJson={(val) => setmodifiedAssociationJson(val)}
            setformAssociationType={setformAssociationType}
            formAssociationType={formAssociationType}
            showOtherOptions={true}
            showswappingHeader={true}
            settemplateData={settemplateData}
          />
        )}
      </div>

      <div
        style={{
          width: "100%",
          height: "10%",
          justifyContent: "space-between",
          display: "flex",
          alignItems: "center",
          flexDirection: "row-reverse",
          padding: "0.6rem",
        }}
      >
        <div>
          <Button
            id="add_cancel"
            variant="outlined"
            className={styles.cancelButton}
            onClick={() => props.closeModal()}
            //   style={{ background: "#0072c6" }}
          >
            {t("cancel")}
          </Button>
          <Button
            id="add_cancel"
            variant="outlined"
            className={styles.buttons}
            onClick={() =>
              activeStep === 1 ? handleSaveChanges() : handleNextStep()
            }
            style={{ background: "#0072c6" }}
          >
            {t("next")}
          </Button>
        </div>

        {activeStep === 1 ? (
          <Button
            id="add_cancel"
            variant="outlined"
            className={styles.cancelButton}
            onClick={() => handlePreviousStep()}
            style={{ background: "#0072c6" }}
          >
            {t("previous")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default LayoutSelection;
