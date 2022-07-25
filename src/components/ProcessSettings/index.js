import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box } from "@material-ui/core";
import IncludeFeature from "./IncludeFeature";
import QueueSwimlanes from "./QueueSwimlanes/QueueSwimlanes";
import TriggerType from "./TriggerType/index";
import { useTranslation } from "react-i18next";
import "./index.css";
import {
  RTL_DIRECTION,
  userRightsMenuNames,
} from "../../Constants/appConstants";
import ProcessProperties from "./ProcessProperties";
import DeployProcess from "../DeployProcess/DeployProcess";
import ImportExport_GlobalTask from "../Properties/PropetiesTab/Task/ImportExport_GlobalTask/index";
import Modal from "../../UI/Modal/Modal";
import Templates from "./Templates";
import { connect, useSelector } from "react-redux";
import { UserRightsValue } from "../../redux-store/slices/UserRightsSlice";
import { getMenuNameFlag } from "../../utility/UserRightsFunctions";

// Function to make TabPanel.
export function TabPanel(props) {
  const { children, value, index, ...other } = props;
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          style={{
            // height: "100vh",
            textAlign: direction === RTL_DIRECTION ? "right" : "left",
            padding: "0rem",
            minWidth: "4.5rem",
          }}
          p={3}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

// Function used for tabs.
export function tabProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function ProcessSettings(props) {
  const userRightsValue = useSelector(UserRightsValue);
  let { t } = useTranslation();
  const { openProcessID, openProcessName, openProcessType } = props;
  const [value, setValue] = useState(0);
  const [propertiesArr, setPropertiesArr] = useState([]);
  const direction = `${t("HTML_DIR")}`;
  const [showModal, setShowModal] = useState(false);

  // Boolean that decides whether include feature tab will be shown or not.
  const includeFeatureFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.includeWindow
  );

  // Boolean that decides whether register template tab will be visible or not.
  const registerTemplateFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.registerTemplate
  );

  // Boolean that decides whether register trigger tab  will be visible or not.
  const registerTriggerRightsFlag = getMenuNameFlag(
    userRightsValue?.menuRightsList,
    userRightsMenuNames.registerTrigger
  );

  // Array that contains all the tabs and their labels.
  const arr = [
    {
      label: t("general"),
      component: (
        <ProcessProperties
          openProcessID={openProcessID}
          openProcessName={openProcessName}
          openProcessType={openProcessType}
        />
      ),
    },
    {
      label: t("deployProperties"),
      component: <DeployProcess deployFrom="Settings" />,
    },
    {
      label: t("features"),
      component: (
        <IncludeFeature
          openProcessID={openProcessID}
          openProcessName={openProcessName}
          openProcessType={openProcessType}
        />
      ),
    },
    {
      label: t("defaultQueues"),
      component: <QueueSwimlanes processType={openProcessType} />,
    },
    {
      label: t("templates"),
      component: <Templates />,
    },
    {
      label: t("triggerType"),
      component: <TriggerType />,
    },
  ];

  // Function that runs when the component loads.
  useEffect(() => {
    let tempArr = [...arr];
    if (!includeFeatureFlag) {
      let featureIndex;
      tempArr.forEach((element, index) => {
        if (element.label === t("features")) {
          featureIndex = index;
        }
      });
      tempArr.splice(featureIndex, 1);
    }
    if (!registerTemplateFlag) {
      let registerTemplateIndex;
      tempArr.forEach((element, index) => {
        if (element.label === t("templates")) {
          registerTemplateIndex = index;
        }
      });
      tempArr.splice(registerTemplateIndex, 1);
    }
    if (!registerTriggerRightsFlag) {
      let registerTriggerIndex;
      tempArr.forEach((element, index) => {
        if (element.label === t("triggerType")) {
          registerTriggerIndex = index;
        }
      });
      tempArr.splice(registerTriggerIndex, 1);
    }
    setPropertiesArr(tempArr);
  }, []);

  // Function to handle tab change.
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "91.84vh" }}>
      <div
        className="tabs"
        // code edited on 29 April 2022 for BugId 108418
        style={{ width: "15vw", background: "#FFF", marginTop: "4px" }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          style={{ height: "100%" }}
          value={value}
          onChange={handleChange}
        >
          {propertiesArr?.map((tab, index) => (
            <Tab
              className={
                direction === "rtl"
                  ? "processSettingTabrtl"
                  : "processSettingTab"
              }
              label={t(tab.label)}
              {...tabProps(index)}
            />
          ))}
        </Tabs>
      </div>
      {/* code edited on 29 April 2022 for BugId 108418 */}
      <div style={{ width: "85vw", marginTop: "5px" }}>
        {propertiesArr.map((tabPanel, index) => (
          <TabPanel style={{ padding: "0.625rem" }} value={value} index={index}>
            {tabPanel.component}
          </TabPanel>
        ))}
        {showModal && (
          <Modal
            show={showModal}
            backDropStyle={{ backgroundColor: "transparent" }}
            style={{
              top: "20%",
              left: "30%",
              position: "absolute",
              width: "438px",
              zIndex: "1500",
              boxShadow: "0px 3px 6px #00000029",
              border: "1px solid #D6D6D6",
              borderRadius: "3px",
              height: "auto",
            }}
            modalClosed={() => setShowModal(false)}
            children={
              <ImportExport_GlobalTask
                showModal={showModal}
                setShowModal={setShowModal}
              />
            }
          ></Modal>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    openProcessVersion: state.openProcessClick.selectedVersion,
    templateName: state.openTemplateReducer.templateName,
    openTemplateFlag: state.openTemplateReducer.openFlag,
  };
};

export default connect(mapStateToProps, null)(ProcessSettings);
