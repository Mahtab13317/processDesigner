import React, { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import axios from "axios";
import {
  SERVER_URL,
  ENDPOINT_GET_PROCESS_FEATURES,
  ENDPOINT_INCLUDE_PROCESS_FEATURE,
  ENDPOINT_EXCLUDE_PROCESS_FEATURE,
  MAX_AVAILABLE_FEATURES_ID,
  PROCESSTYPE_LOCAL,
  ENDPOINT_POST_REGISTER_WINDOW,
} from "../../../Constants/appConstants";
import "./index.css";
import { useTranslation } from "react-i18next";
import FeatureListing from "../../../UI/FeatureListing";
import { store, useGlobalState } from "state-pool";
import Modal from "../../../UI/Modal/Modal";
import FeatureModal from "./FeatureModal/index";
import cancelIcon from "../../../assets/abstractView/RedDelete.svg";

function IncludeFeature(props) {
  let { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { openProcessID, openProcessType } = props;
  const [usedFeatures, setUsedFeatures] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const direction = `${t("HTML_DIR")}`;
  const [allData, setallData] = useState([]);
  const [isDisable, setIsDisable] = useState(false);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [addNew, setaddNew] = useState(false);
  const [selected, setselected] = useState(null);

  useEffect(() => {
    if (props.openProcessType === PROCESSTYPE_LOCAL) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [props.openProcessType]);

  // Function to add a feature to the used features list.
  const handleAddFeature = (index) => {
    const [addFeature] = availableFeatures.splice(index, 1);
    setAvailableFeatures([...availableFeatures]);
    addFeature.Included = true;
    usedFeatures.splice(0, 0, addFeature);
    setUsedFeatures(usedFeatures);
    const outputArray = getOutputArray(addFeature);
    updateProcessFeatureCall(outputArray, ENDPOINT_INCLUDE_PROCESS_FEATURE);
  };

  // Function to remove a feature from the used features list.
  const handleRemoveFeature = (index) => {
    const [removeFeature] = usedFeatures.splice(index, 1);
    setUsedFeatures([...usedFeatures]);
    removeFeature.Included = false;
    availableFeatures.splice(0, 0, removeFeature);
    setAvailableFeatures(availableFeatures);
    const outputArray = getOutputArray(removeFeature);
    updateProcessFeatureCall(outputArray, ENDPOINT_EXCLUDE_PROCESS_FEATURE);
  };

  // Function to get the output array to be sent in the post body of the add and remove feature APIs.
  const getOutputArray = (featureObject) => {
    let dataArray = [];
    let outputArray = [];
    dataArray.push(featureObject);
    const tempArray = dataArray;
    tempArray.forEach((element) => {
      outputArray.push({
        isIncluded: element.Included,
        intefaceDefInfo: {
          interfaceId: element.InterfaceId,
          interfaceName: element.WindowName,
          clientInvocation: element.ClientInvocation,
          buttonName: element.ButtonName,
          menuName: element.MenuName,
          executeClass: element.ExecuteClass,
          executeClassWeb: element.ExecuteClassWeb,
          tableName: element.TableNames,
        },
      });
    });
    return outputArray;
  };
  // Function to handle API call for both add and remove feature functions.
  const updateProcessFeatureCall = (outputArray, url) => {
    const { openProcessID, openProcessName } = props;
    const changedDataObject = {
      processDefId: openProcessID,
      processName: openProcessName,
      versionType: "0",
      includedWinList: outputArray,
    };
    axios
      .post(SERVER_URL + url, changedDataObject)
      .then()
      .catch((err) => console.log(err));
  };

  // Use Effect function runs for the initial render of the component.
  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          `${ENDPOINT_GET_PROCESS_FEATURES}/${openProcessID}/${openProcessType}/S`
      )
      .then((res) => {
        if (res.status === 200) {
          setallData(res.data.GlobalInterfaceData);
          const used = res.data.GlobalInterfaceData?.filter((d) => {
            return d.Included === true;
          });
          setUsedFeatures([...used]);
          const available = res.data.GlobalInterfaceData?.filter((d) => {
            return d.Included === false;
          });
          setAvailableFeatures([...available]);
          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));
  }, [addNew]);

  //code edited on 22 July 2022 for BugId 110821
  const handleDeleteFeature = (el, list, setFunc) => {
    let json = {
      interfaceId: el.InterfaceId,
      interfaceName: el.MenuName,
    };
    axios
      .delete(SERVER_URL + ENDPOINT_POST_REGISTER_WINDOW, {
        data: json,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        if (res.status === 200) {
          let temp = [...list];
          temp.forEach((val, index) => {
            if (val.InterfaceId == el.InterfaceId) {
              temp.splice(index, 1);
            }
          });
          setFunc(temp);
        }
      })
      .catch((err) => console.log(err));
  };

  const EditUseFeature = (d) => {
    setselected(d);
  };

  if (isLoading) {
    return <CircularProgress className="circular-progress" />;
  } else
    return (
      <div style={{ padding: "0.5rem" }}>
        <div style={{ marginTop: "0.125rem" }}>
          <p
            className="process-features-heading"
            style={{
              margin: direction === "rtl" ? "0 1vw 0 0" : "0 0 0 1vw",
              textAlign: direction === "rtl" ? "right" : "left",
            }}
          >
            {t("processFeaturesHeading")}
          </p>

          <button
            id="PF_register_feature_button"
            class="register-feature-button"
            style={{
              margin: direction === "rtl" ? "0 0 0 3.75rem" : "0 3.75rem 0 0",
              float: direction === "rtl" ? "left" : "right",
            }}
            onClick={() => setIsModalOpen(true)}
          >
            <span> {t("registerFeatureButton")}</span>
          </button>
          {isModalOpen ? (
            <Modal
              show={isModalOpen}
              modalClosed={() => setIsModalOpen(false)}
              style={{
                width: "26%",
                height: "65%",
                left: "37%",
                top: "16%",
                padding: "1%",
                paddingTop: 0,
              }}
            >
              <FeatureModal
                setIsModalOpen={setIsModalOpen}
                setaddNew={setaddNew}
                allData={allData}
              />
            </Modal>
          ) : null}

          <p
            className="process-features-description"
            style={{
              margin: direction === "rtl" ? "1.5% 1vw 0 0" : "1.5% 0 0 1vw",
              textAlign: direction === "rtl" ? "right" : "left",
            }}
          >
            {t("processFeatureDescription")}
          </p>
        </div>
        <div
          className="used-features-main-div"
          style={{
            margin:
              direction === "rtl" ? "0.875rem 1vw 0 0" : "0.875rem 0 0 1vw",
          }}
        >
          <div style={{ margin: "0rem 0.1rem 0rem 0.1rem" }}>
            <p
              style={{ textAlign: direction === "rtl" ? "right" : null }}
              className="used-features-heading"
            >
              {t("usedFeaturesHeading")}
            </p>
            <div className="used-features">
              {usedFeatures && usedFeatures.length === 0 ? (
                <div className="available-features-empty">
                  {t("usedFeaturesEmptyMessage")}
                </div>
              ) : (
                <div>
                  {usedFeatures &&
                    usedFeatures.map((d, index) => {
                      return (
                        <div
                          id="PF_Used_features_table"
                          className="used-features-subdiv"
                        >
                          <FeatureListing
                            maxAvailableFeaturesId={MAX_AVAILABLE_FEATURES_ID}
                            menuName={d.MenuName}
                            description={d.Description}
                            interfaceId={d.InterfaceId}
                            onClick={() => EditUseFeature(d)}
                          />
                          {isDisable ? (
                            <>
                              <img
                                className="remove-feature-icon"
                                src={cancelIcon}
                                style={{
                                  height: "1rem",
                                  width: "1rem",
                                  margin: "1.2rem .5rem 1.031rem auto",
                                }}
                                onClick={() =>
                                  //code added on 22 July 2022 for BugId 110821
                                  handleDeleteFeature(
                                    d,
                                    usedFeatures,
                                    setUsedFeatures
                                  )
                                }
                              />
                              <ClearOutlinedIcon
                                id="PF_remove_feature_button"
                                onClick={() => handleRemoveFeature(index)}
                                className="remove-feature-icon"
                              />
                            </>
                          ) : null}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
          <div style={{ margin: "0rem 0.2rem 0rem 0.2rem" }}>
            <p
              style={{
                textAlign: direction === "rtl" ? "right" : null,
                margin:
                  direction === "rtl"
                    ? "0.375rem 1.75rem 0.875rem 0"
                    : "0.375rem 0 0.875rem 1.75rem",
              }}
              className="available-features-heading"
            >
              {t("availableFeaturesHeading")}
            </p>
            <div
              className="available-features"
              style={{
                margin:
                  direction === "rtl" ? "0rem 1.75rem 0 0" : "0 0 0 1.75rem",
              }}
            >
              {availableFeatures && availableFeatures.length === 0 ? (
                <div
                  className="available-features-empty"
                  style={{ textAlign: direction === "rtl" ? "right" : "left" }}
                >
                  {t("availableFeaturesEmptyMessage")}
                </div>
              ) : (
                <div>
                  {availableFeatures &&
                    availableFeatures.map((d, index) => {
                      return (
                        <div
                          id="PF_Available_features_table"
                          className="available-features-subdiv"
                        >
                          <div>
                            <FeatureListing
                              maxAvailableFeaturesId={MAX_AVAILABLE_FEATURES_ID}
                              menuName={d.MenuName}
                              description={d.Description}
                              interfaceId={d.InterfaceId}
                              onClick={() => EditUseFeature(d)}
                            />
                          </div>
                          {isDisable ? (
                            <React.Fragment>
                              {/*****************************************************************************************
                               * @author asloob_ali BUG ID : 115860 Features || Mobile on services is not appearing
                               *  Resolution : restricted user to not delete default features.
                               *  Date : 19/09/2022             ****************/}
                              {d.InterfaceId > 12 && (
                                <img
                                  className="add-feature-icon"
                                  style={{
                                    height: "1rem",
                                    width: "1rem",
                                    margin: "1.2rem .5rem 1.031rem auto",
                                  }}
                                  src={cancelIcon}
                                  onClick={() =>
                                    //code added on 22 July 2022 for BugId 110821
                                    handleDeleteFeature(
                                      d,
                                      availableFeatures,
                                      setAvailableFeatures
                                    )
                                  }
                                />
                              )}
                              <AddOutlinedIcon
                                id="PF_add_feature_button"
                                className="add-feature-icon"
                                onClick={() => handleAddFeature(index)}
                                style={{
                                  color: "#0072C6",
                                  height: "1.688rem",
                                  width: "1.688rem",
                                  margin: "0.781rem .5rem 1.031rem 1rem",
                                }}
                              />
                            </React.Fragment>
                          ) : null}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
        {selected ? (
          <Modal
            show={selected}
            modalClosed={() => setselected(null)}
            style={{
              width: "26%",
              height: "65%",
              left: "37%",
              top: "16%",
              padding: "1%",
              paddingTop: 0,
            }}
          >
            <FeatureModal
              setIsModalOpen={() => setselected(null)}
              setaddNew={setaddNew}
              allData={allData}
              type="Edit"
              selected={selected}
            />
          </Modal>
        ) : null}
      </div>
    );
}

export default IncludeFeature;
