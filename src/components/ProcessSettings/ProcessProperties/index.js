import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import { useTranslation } from "react-i18next";
import { InputBase, MenuItem } from "@material-ui/core";
import SunEditor from "../../../UI/SunEditor/SunTextEditor";
import clsx from "clsx";
import CustomizedDropdown from "../../../UI/Components_With_ErrrorHandling/Dropdown";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import {
  SERVER_URL,
  ENDPOINT_PROCESS_PROPERTIES,
  ENDPOINT_UPDATE_PROCESS_PROPERTIES,
  RTL_DIRECTION,
} from "../../../Constants/appConstants";
import { calendarTypeOptions } from "../../Properties/PropetiesTab/ActivityRules/CommonFunctionCall";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";

function ProcessProperties(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}​​​​​​​​`;
  const { openProcessID, openProcessType } = props;
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previousPropertyData, setPreviousPropertyData] = useState({});
  const [propertiesData, setPropertiesData] = useState({});
  const [ownerEmailId, setOwnerEmailId] = useState("");
  const [owner, setOwner] = useState([
    {
      OwnerName: "",
      OwnerOrderID: "",
    },
  ]);
  const [consultant, setConsultant] = useState([
    {
      ConsultantOrderID: "",
      ConsultantName: "",
    },
  ]);
  const [description, setDescription] = useState("");
  const [calendarValue, setCalendarValue] = useState("");
  const [systemValues, setSystemValues] = useState([
    {
      SystemOrderID: "",
      SystemName: "",
    },
  ]);
  const [providerValues, setProviderValues] = useState([
    {
      ProviderName: "",
      ProviderOrderID: "",
    },
  ]);
  const [consumerValues, setConsumerValues] = useState([
    {
      ConsumerOrderID: "",
      ConsumerName: "",
    },
  ]);
  const [costValue, setCostValue] = useState("");
  const [processDetails, setProcessDetails] = useState({
    processName: "",
    version: "",
    createdBy: "",
  });
  const [turnAroundTime, setTurnAroundTime] = useState({
    Days: "0",
    Hours: "0",
    Minutes: "0",
    TATCalFlag: "N",
  });

  const calendarList = [
    { CalId: "1", CalName: "DEFAULT 24/7", CalType: "G" },
    { CalId: "2", CalName: "TestCalendar1", CalType: "G" },
    { CalId: "3", CalName: "TestCalendar2", CalType: "G" },
    { CalId: "4", CalName: "TestCalendar3", CalType: "G" },
  ];

  // Function that runs when the component loads.
  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          ENDPOINT_PROCESS_PROPERTIES +
          "/" +
          openProcessID +
          "/" +
          openProcessType
      )
      .then((res) => {
        if (res.data.Status === 0) {
          let temp = { ...res.data.ProcessProperty };
          setPropertiesData(temp);
          setPreviousPropertyData(temp);
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // Function that gets called when propertiesData value changes.
  useEffect(() => {
    if (propertiesData) {
      setOwnerEmailId(propertiesData.OwnerEmailID);
      setProcessDetails({
        processName: propertiesData.ProcessName,
        version: propertiesData.VersionNo,
        createdBy: propertiesData.CreatedBy,
      });
      setCalendarValue(
        propertiesData.Calendar && propertiesData.Calendar.CalName
      );
      setCostValue(propertiesData.Cost);
      setTurnAroundTime(propertiesData.TAT);
      setOwner(
        propertiesData &&
          propertiesData.Owner &&
          propertiesData.Owner.length > 0 &&
          propertiesData.Owner
      );
      setConsultant(
        propertiesData &&
          propertiesData.Consultant &&
          propertiesData.Consultant.length > 0 &&
          propertiesData.Consultant
      );
      setSystemValues(
        propertiesData &&
          propertiesData.System &&
          propertiesData.System.length > 0 &&
          propertiesData.System
      );
      setProviderValues(
        propertiesData &&
          propertiesData.Provider &&
          propertiesData.Provider.length > 0 &&
          propertiesData.Provider
      );
      setConsumerValues(
        propertiesData &&
          propertiesData.Consumer &&
          propertiesData.Consumer.length > 0 &&
          propertiesData.Consumer
      );
      setDescription(propertiesData?.Description);
    }
  }, [propertiesData]);

  console.log("234", "DESCRIPTION", description);
  // Function that gets called when the user clicks on save changes button.
  const handleSaveChanges = () => {
    if (
      costValue !== "" ||
      turnAroundTime.Days !== "" ||
      turnAroundTime.Hours !== "" ||
      turnAroundTime.Minutes !== ""
    ) {
      let ownerArr = [],
        consultantArr = [],
        systemArr = [],
        providerArr = [],
        consumerArr = [];
      owner?.forEach((element) => {
        let tempObj = {
          ownerName: element.OwnerName,
          ownerId: element.OwnerOrderID,
        };
        ownerArr.push(tempObj);
      });

      consultant?.forEach((element) => {
        let tempObj = {
          consultantName: element.ConsultantName,
          consultantId: element.ConsultantOrderID,
        };
        consultantArr.push(tempObj);
      });

      systemValues?.forEach((element) => {
        let tempObj = {
          sysName: element.SystemName,
          orderId: element.SystemOrderID,
        };
        systemArr.push(tempObj);
      });

      providerValues?.forEach((element) => {
        let tempObj = {
          providerName: element.ProviderName,
          orderId: element.ProviderOrderID,
        };
        providerArr.push(tempObj);
      });

      consumerValues?.forEach((element) => {
        let tempObj = {
          consumerName: element.ConsumerName,
          orderId: element.ConsumerOrderID,
        };
        consumerArr.push(tempObj);
      });

      const finalObj = {
        processDefId: openProcessID,
        processState: openProcessType,
        processProp: {
          genPropInfo: {
            description: description,
            cost: costValue,
            ownerList: ownerArr,
            consultantList: consultantArr,
            systemList: systemArr,
            providerList: providerArr,
            consumerList: consumerArr,
          },

          m_strOwnerEmailID: ownerEmailId,
          tatInfo: {
            tatCalFlag: turnAroundTime.TATCalFlag,
            wfMinutes: turnAroundTime.Minutes,
            wfHours: turnAroundTime.Hours,
            wfDays: turnAroundTime.Days,
          },
        },
      };

      axios
        .post(SERVER_URL + ENDPOINT_UPDATE_PROCESS_PROPERTIES, finalObj)
        .then((res) => {
          if (res.data.Status === 0) {
            setIsChanged(false);
            setPreviousPropertyData({ ...propertiesData });
            console.log(
              "569",
              "PROCESS PROPERTIES SUCCESSFULLY SAVED!",
              "Success message to be shown here."
            );
          }
        });
    }
  };

  // Function that gets called when the user clicks on cancel changes button.
  const handleCancelChanges = () => {
    setPropertiesData({ ...previousPropertyData });
    setIsChanged(false);
  };

  // Function that handles the change in system value fields.
  const systemValuesHandler = (value, index) => {
    let tempArr = [...systemValues];
    tempArr[index].SystemName = value;
    setSystemValues(tempArr);
    setIsChanged(true);
  };

  // Function that handles the change in owner value fields.
  const ownerValuesHandler = (value, index) => {
    let tempArr = [...owner];
    tempArr[index].OwnerName = value;
    setOwner(tempArr);
    setIsChanged(true);
  };

  // Function that handles the change in consultant value fields.
  const consultantValuesHandler = (value, index) => {
    let tempArr = [...consultant];
    tempArr[index].ConsultantName = value;
    setConsultant(tempArr);
    setIsChanged(true);
  };

  // Function that handles the change in provider value fields.
  const providerValuesHandler = (value, index) => {
    let tempArr = [...providerValues];
    tempArr[index].ProviderName = value;
    setProviderValues(tempArr);
    setIsChanged(true);
  };

  // Function that handles the change in consumer value fields.
  const consumerValuesHandler = (value, index) => {
    let tempArr = [...consumerValues];
    tempArr[index].ConsumerName = value;
    setConsumerValues(tempArr);
    setIsChanged(true);
  };

  // Function that handles the change in turn around time.
  const turnAroundTimeHandler = (event, key) => {
    const { value } = event.target;
    const obj = { ...turnAroundTime };
    setTurnAroundTime({ ...obj, [key]: value });
    setIsChanged(true);
  };

  // Function that gets called when the user clicks on add field icon.
  const handleAddField = (name, index) => {
    if (name === "system") {
      let temp = [...systemValues];
      temp && temp.push({ SystemName: "", SystemOrderID: "" });
      temp &&
        temp.forEach((element, index) => {
          element.SystemOrderID = `${index + 1}`;
        });
      setSystemValues(temp);
    } else if (name === "provider") {
      let temp = [...providerValues];
      temp && temp.push({ ProviderName: "", ProviderOrderID: "" });
      temp &&
        temp.forEach((element, index) => {
          element.ProviderOrderID = `${index + 1}`;
        });
      setProviderValues(temp);
    } else if (name === "consumer") {
      let temp = [...consumerValues];
      temp && temp.push({ ConsumerName: "", ConsumerOrderID: "" });
      temp &&
        temp.forEach((element, index) => {
          element.ConsumerOrderID = `${index + 1}`;
        });
      setConsumerValues(temp);
    }
    setIsChanged(true);
  };

  // Function that deletes a field based on its type.
  const handleDeleteField = (name, index) => {
    if (name === "system") {
      let temp = [...systemValues];
      temp.splice(index, 1);
      setSystemValues(temp);
    } else if (name === "provider") {
      let temp = [...providerValues];
      temp.splice(index, 1);
      setProviderValues(temp);
    } else if (name === "consumer") {
      let temp = [...consumerValues];
      temp.splice(index, 1);
      setConsumerValues(temp);
    }
    setIsChanged(true);
  };

  if (isLoading) {
    return <CircularProgress className="circular-progress" />;
  } else {
    return (
      <div className={styles.mainDiv}>
        <div
          className={
            direction === RTL_DIRECTION ? arabicStyles.subDiv : styles.subDiv
          }
        >
          <p className={styles.heading}>{t("nameAndDescription")}</p>
          <div className={clsx(styles.flexRow, styles.basicDetailsDiv)}>
            <p className={styles.fieldTitle}>{t("ProcessName")}:</p>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.processDetails
                  : styles.processDetails
              }
            >
              {processDetails?.processName}
            </p>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.fieldValue
                  : styles.fieldValue
              }
            ></p>
            <p className={styles.fieldTitle}>{t("Version")}:</p>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.processDetails
                  : styles.processDetails
              }
            >
              {processDetails?.version}
            </p>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.fieldValue
                  : styles.fieldValue
              }
            ></p>
            <p className={styles.fieldTitle}>{t("createdByCapital")}:</p>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.processDetails
                  : styles.processDetails
              }
            >
              {processDetails?.createdBy}
            </p>
            <p
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.fieldValue
                  : styles.fieldValue
              }
            ></p>
          </div>
          <p
            className={clsx(
              styles.fieldTitle,
              styles.ownerEmailIdText,
              styles.fieldText
            )}
          >
            {t("ownerEmailID")}
          </p>
          <InputBase
            id="PP_Owner_Email_ID"
            variant="outlined"
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.ownerEmailIdInput
                : styles.ownerEmailIdInput
            }
            onChange={(event) => {
              setOwnerEmailId(event.target.value);
              setIsChanged(true);
            }}
            value={ownerEmailId}
          />

          <p className={clsx(styles.heading, styles.peopleAndSystemHeading)}>
            {t("peopleAndSystems")}
          </p>

          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.flexRow
                : styles.flexRow
            }
          >
            <div className={styles.flexColumn}>
              <p
                className={clsx(
                  styles.fieldTitle,
                  styles.fieldText,
                  styles.title
                )}
              >
                {t("owner")}
              </p>
              {owner?.map((element, index) => {
                return (
                  <InputBase
                    id="PP_Owner_List"
                    variant="outlined"
                    className={styles.ownerEmailIdInput}
                    onChange={(event) =>
                      ownerValuesHandler(event.target.value, index)
                    }
                    value={element.OwnerName}
                  />
                );
              })}
            </div>
            <div className={styles.flexColumn}>
              <p
                className={clsx(
                  styles.fieldTitle,
                  styles.fieldText,
                  styles.title
                )}
              >
                {t("consultant")}
              </p>
              {consultant?.map((element, index) => {
                return (
                  <InputBase
                    id="PP_Consultant_List"
                    variant="outlined"
                    className={styles.ownerEmailIdInput}
                    onChange={(event) =>
                      consultantValuesHandler(event.target.value, index)
                    }
                    value={element.ConsultantName}
                  />
                );
              })}
            </div>
          </div>

          <div className={styles.flexRow}>
            <div className={styles.flexColumn}>
              <p
                className={clsx(
                  styles.fieldTitle,
                  styles.fieldText,
                  styles.title
                )}
              >
                {t("system")}
              </p>
              {systemValues?.map((element, index) => {
                return (
                  <div className={styles.flexRow}>
                    <InputBase
                      id="PP_System_List"
                      variant="outlined"
                      className={styles.inputField}
                      onChange={(event) =>
                        systemValuesHandler(event.target.value, index)
                      }
                      value={element.SystemName}
                    />
                    {systemValues?.length > 1 ? (
                      <DeleteOutlinedIcon
                        id="PP_Delete_System_List"
                        className={styles.deleteIcon}
                        onClick={() => handleDeleteField("system", index)}
                      />
                    ) : (
                      <div className={styles.deleteIconSpace}></div>
                    )}

                    {systemValues.length - 1 === index ? (
                      <AddIcon
                        id="PP_Add_System_List"
                        onClick={() => handleAddField("system", index)}
                        className={styles.addIcon}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className={clsx(styles.flexColumn, styles.providerInput)}>
              <p
                className={clsx(
                  styles.fieldTitle,
                  styles.fieldText,
                  styles.title
                )}
              >
                {t("provider")}
              </p>
              {providerValues?.map((element, index) => {
                return (
                  <div className={styles.flexRow}>
                    <InputBase
                      id="PP_Provider_List"
                      variant="outlined"
                      className={styles.inputField}
                      onChange={(event) =>
                        providerValuesHandler(event.target.value, index)
                      }
                      value={element.ProviderName}
                    />
                    {providerValues?.length > 1 ? (
                      <DeleteOutlinedIcon
                        id="PP_Delete_Provider_List"
                        className={styles.deleteIcon}
                        onClick={() => handleDeleteField("provider", index)}
                      />
                    ) : (
                      <div className={styles.deleteIconSpace}></div>
                    )}

                    {providerValues.length - 1 === index ? (
                      <AddIcon
                        id="PP_Add_Provider_List"
                        onClick={() => handleAddField("provider", index)}
                        className={styles.addIcon}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.flexRow}>
            <div className={styles.flexColumn}>
              <p
                className={clsx(
                  styles.fieldTitle,
                  styles.fieldText,
                  styles.title
                )}
              >
                {t("consumer")}
              </p>
              {consumerValues?.map((element, index) => {
                return (
                  <div className={styles.flexRow}>
                    <InputBase
                      id="PP_Consumer_List"
                      variant="outlined"
                      className={styles.inputField}
                      onChange={(event) =>
                        consumerValuesHandler(event.target.value, index)
                      }
                      value={element.ConsumerName}
                    />
                    {consumerValues?.length > 1 ? (
                      <DeleteOutlinedIcon
                        id="PP_Delete_Consumer_List"
                        className={styles.deleteIcon}
                        onClick={() => handleDeleteField("consumer", index)}
                      />
                    ) : (
                      <div className={styles.deleteIconSpace}></div>
                    )}

                    {consumerValues.length - 1 === index ? (
                      <AddIcon
                        id="PP_Add_Consumer_List"
                        onClick={() => handleAddField("consumer", index)}
                        className={styles.addIcon}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
          <p
            className={clsx(
              styles.heading,
              styles.keyPerformanceIndicesHeading
            )}
          >
            {t("keyPerformanceIndices")}
          </p>
          <div className={styles.flexRow}>
            <div className={styles.flexColumn}>
              <div className={styles.flexRow}>
                <p
                  className={clsx(
                    styles.fieldTitle,
                    styles.fieldText,
                    styles.title
                  )}
                >
                  {t("costInDollars")}
                </p>
                <span className={styles.asterisk}>*</span>
              </div>
              <InputBase
                id="PP_Cost_Value"
                variant="outlined"
                type="number"
                className={clsx(styles.ownerEmailIdInput, styles.costInput)}
                onChange={(event) => {
                  setCostValue(event.target.value);
                  setIsChanged(true);
                }}
                value={costValue}
              />
            </div>
            <div className={styles.flexColumn}>
              <div className={styles.flexRow}>
                <p
                  className={clsx(
                    styles.fieldTitle,
                    styles.fieldText,
                    styles.title
                  )}
                >
                  {t("turnaroundTime")}
                </p>
                <span className={styles.asterisk}>*</span>
              </div>
              <div className={styles.flexRow}>
                <InputBase
                  id="PP_Days_Value"
                  variant="outlined"
                  className={clsx(
                    styles.ownerEmailIdInput,
                    direction === RTL_DIRECTION
                      ? arabicStyles.turnAroundTimeInput
                      : styles.turnAroundTimeInput
                  )}
                  type="number"
                  onChange={(event) => turnAroundTimeHandler(event, "Days")}
                  value={turnAroundTime && turnAroundTime.Days}
                />
                <p
                  className={clsx(
                    styles.fieldTitle,
                    styles.blackColor,
                    styles.turnaroundTimeMargin
                  )}
                >
                  {t("days")}
                </p>
                <InputBase
                  id="PP_Hours_Value"
                  variant="outlined"
                  className={clsx(
                    styles.ownerEmailIdInput,
                    styles.turnAroundTimeInput
                  )}
                  type="number"
                  onChange={(event) => turnAroundTimeHandler(event, "Hours")}
                  value={turnAroundTime && turnAroundTime.Hours}
                />
                <p
                  className={clsx(
                    styles.fieldTitle,
                    styles.blackColor,
                    styles.turnaroundTimeMargin
                  )}
                >
                  {t("hours")}
                </p>
                <InputBase
                  id="PP_Minutes_Value"
                  variant="outlined"
                  className={clsx(
                    styles.ownerEmailIdInput,
                    styles.turnAroundTimeInput
                  )}
                  type="number"
                  onChange={(event) => turnAroundTimeHandler(event, "Minutes")}
                  value={turnAroundTime && turnAroundTime.Minutes}
                />
                <p
                  className={clsx(
                    styles.fieldTitle,
                    styles.blackColor,
                    styles.turnaroundTimeMargin
                  )}
                >
                  {t("minutesInCapital")}
                </p>
                <CustomizedDropdown
                  id="PP_Calendar_Dropdown_Value"
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.escalateToFieldsDropdown
                      : styles.escalateToFieldsDropdown
                  }
                  value={turnAroundTime && turnAroundTime.TATCalFlag}
                  onChange={(event) =>
                    turnAroundTimeHandler(event, "TATCalFlag")
                  }
                  isNotMandatory={true}
                >
                  {calendarTypeOptions &&
                    calendarTypeOptions.map((element) => {
                      return (
                        <MenuItem
                          className={styles.menuItemStyles}
                          key={element.value}
                          value={element.value}
                        >
                          {element.label}
                        </MenuItem>
                      );
                    })}
                </CustomizedDropdown>
              </div>
            </div>
          </div>
          <div className={styles.flexColumn}>
            <p
              className={clsx(
                styles.fieldTitle,
                styles.fieldText,
                styles.title
              )}
            >
              {t("calendar")}
            </p>
            <CustomizedDropdown
              id="PP_Calendar_Type_Value"
              className={styles.escalateToFieldsDropdown}
              value={calendarValue}
              onChange={(event) => setCalendarValue(event.target.value)}
              isNotMandatory={true}
            >
              {calendarList &&
                calendarList.map((element) => {
                  return (
                    <MenuItem
                      className={styles.menuItemStyles}
                      key={element.CalName}
                      value={element.CalName}
                    >
                      {element.CalName}
                    </MenuItem>
                  );
                })}
            </CustomizedDropdown>
          </div>
          <div className={clsx(styles.flexColumn, styles.marginBottom)}>
            <p
              className={clsx(
                styles.fieldTitle,
                styles.fieldText,
                styles.title
              )}
            >
              {t("description")}
            </p>
            <SunEditor
              id="PP_Add_description"
              width="410px"
              customHeight="6rem"
              autoFocus={false}
              placeholder={t("placeholderDescription")}
              value={description}
              getValue={(event) => {
                setDescription(event.target.innerText);
                setIsChanged(true);
              }}
            />
          </div>
          <div className={styles.footerDiv}>
            <div
              className={clsx(
                styles.flexRow,
                direction === RTL_DIRECTION
                  ? arabicStyles.footerSubDiv
                  : styles.footerSubDiv
              )}
            >
              <button
                disabled={!isChanged}
                className={
                  isChanged
                    ? styles.cancelBtn
                    : clsx(
                        direction === RTL_DIRECTION
                          ? arabicStyles.disabledBtn
                          : styles.disabledBtn,
                        styles.cancelBtn
                      )
                }
                onClick={handleCancelChanges}
              >
                {t("cancel")}
              </button>
              <button
                disabled={!isChanged}
                className={
                  isChanged
                    ? styles.saveBtn
                    : clsx(
                        direction === RTL_DIRECTION
                          ? arabicStyles.disabledBtn
                          : styles.disabledBtn,
                        styles.saveBtn
                      )
                }
                onClick={handleSaveChanges}
              >
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProcessProperties;
