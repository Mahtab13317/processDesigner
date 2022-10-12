import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import arabicStyles from "./ArabicStyles.module.css";
import { useTranslation } from "react-i18next";
import { InputBase, MenuItem, TextField } from "@material-ui/core";
import SunEditor from "../../../UI/SunEditor/SunTextEditor";
import clsx from "clsx";
import CustomizedDropdown from "../../../UI/Components_With_ErrrorHandling/Dropdown";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import EditOutlinedIcon from "@material-ui/icons/Edit";
import {
  SERVER_URL,
  ENDPOINT_PROCESS_PROPERTIES,
  ENDPOINT_UPDATE_PROCESS_PROPERTIES,
  RTL_DIRECTION,
} from "../../../Constants/appConstants";
import { calendarTypeOptions } from "../../Properties/PropetiesTab/ActivityRules/CommonFunctionCall";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";
import PeopleAndSystems from "../../Properties/PropetiesTab/basicDetails/PeopleAndSystems";
import Modal from "../../../UI/Modal/Modal";
import { store, useGlobalState } from "state-pool";

import { FieldValidations } from "../../../utility/FieldValidations/fieldValidations";

function ProcessProperties(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}​​​​​​​​`;
  const calList = store.getState("calendarList");
  const { openProcessID, openProcessType } = props;
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previousPropertyData, setPreviousPropertyData] = useState({});
  const [propertiesData, setPropertiesData] = useState({});
  const [ownerEmailId, setOwnerEmailId] = useState("");
  const [openUserGroupMF, setopenUserGroupMF] = useState(false);
  const [localCalendarList, setlocalCalendarList] = useGlobalState(calList);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [showCalenderMFBool, setshowCalenderMFBool] = useState(false);
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

  const systemRef = useRef();
  const providerRef = useRef();
  const consumerRef = useRef();

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
        propertiesData.Calendar &&
          propertiesData.Calendar.CalType + propertiesData.Calendar.CalId
      );
      setCostValue(propertiesData.Cost);
      setTurnAroundTime(propertiesData.TAT);
      if (
        propertiesData.hasOwnProperty("Owner") &&
        propertiesData?.Owner.length > 0
      )
        setOwner(propertiesData.Owner);
      if (
        propertiesData.hasOwnProperty("Consultant") &&
        propertiesData?.Consultant.length > 0
      )
        setConsultant(propertiesData.Consultant);
      if (
        propertiesData.hasOwnProperty("System") &&
        propertiesData?.System.length > 0
      )
        setSystemValues(propertiesData.System);
      if (
        propertiesData.hasOwnProperty("Provider") &&
        propertiesData?.Provider.length > 0
      )
        setProviderValues(propertiesData.Provider);
      if (
        propertiesData.hasOwnProperty("Consumer") &&
        propertiesData?.Consumer.length > 0
      )
        setConsumerValues(propertiesData.Consumer);
      setDescription(propertiesData?.Description);
    }
  }, [propertiesData]);

  console.log("bbbbbbbbbbbbbb", systemValues);
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
        if (element.OwnerOrderID !== "") {
          let tempObj = {
            ownerName: element.OwnerName,
            ownerId: element.OwnerOrderID,
          };
          ownerArr.push(tempObj);
        }
      });

      consultant?.forEach((element) => {
        if (element.ConsultantOrderID !== "") {
          let tempObj = {
            consultantName: element.ConsultantName,
            consultantId: element.ConsultantOrderID,
          };
          consultantArr.push(tempObj);
        }
      });

      systemValues?.forEach((element) => {
        if (element.SystemOrderID !== "") {
          let tempObj = {
            sysName: element.SystemName,
            orderId: element.SystemOrderID,
          };
          systemArr.push(tempObj);
        }
      });

      providerValues?.forEach((element) => {
        if (element.ProviderOrderID !== "") {
          let tempObj = {
            providerName: element.ProviderName,
            orderId: element.ProviderOrderID,
          };
          providerArr.push(tempObj);
        }
      });

      consumerValues?.forEach((element) => {
        if (element.ConsumerOrderID !== "") {
          let tempObj = {
            consumerName: element.ConsumerName,
            orderId: element.ConsumerOrderID,
          };
          consumerArr.push(tempObj);
        }
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
      if (calendarValue !== "") {
        finalObj.processProp.calendarId = calendarValue.substring(1);
        finalObj.processProp.m_strCalenderType = calendarValue.substring(0, 1);
      }

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
  const closeModalUserGroup = () => {
    setopenUserGroupMF(false);
    var elem = document.getElementById("oapweb_assetManifest");

    elem.parentNode.removeChild(elem);
  };
  const pickListHandler = (peopleType) => {
    setopenUserGroupMF(true);

    let microProps = {
      data: {
        initialSelected: getSelectedUsers(peopleType),
        onSelection: (list) => getUserGroupList(list, peopleType),
        token: JSON.parse(localStorage.getItem("launchpadKey"))?.token,
        ext: true,
        customStyle: {
          selectedTableMinWidth: "50%", // selected user and group listing width

          listTableMinWidth: "50%", // user/ group listing width

          listHeight: "16rem", // custom height common for selected listing and user/group listing

          showUserFilter: true, // true for showing user filter, false for hiding

          showExpertiseDropDown: true, // true for showing expertise dropdown, false for hiding

          showGroupFilter: false, // true for showing group filter, false for hiding
        },
      },
      locale: "en_US",
      ContainerId: "usergroupDiv",
      Module: "ORM",

      Component: "UserGroupPicklistMF",

      InFrame: false,

      Renderer: "renderUserGroupPicklistMF",
    };
    window.loadUserGroupMF(microProps);
    console.log("picklisttttttttttt,", microProps);
  };

  const getUserGroupList = (list, type) => {
    let arr = [];
    if (type === "Owner") {
      list.selectedUsers.forEach((user) => {
        let tempObj = {
          OwnerName: user.name,
          OwnerOrderID: user.id,
        };
        arr.push(tempObj);
      });
      setOwner(arr);
    } else if (type === "Consultant") {
      list.selectedUsers.forEach((user) => {
        let tempObj = {
          ConsultantName: user.name,
          ConsultantOrderID: user.id,
        };
        arr.push(tempObj);
      });
      setConsultant(arr);
    }

    setIsChanged(true);
  };
  const getSelectedUsers = (type) => {
    let selectedUsers = [];
    if (type === "Owner") {
      owner.forEach((data) => {
        if (data.OwnerOrderID !== "") {
          selectedUsers.push({
            id: data.OwnerOrderID,
            name: data.OwnerName,
          });
        }
      });
    } else if (type === "Consultant") {
      consultant.forEach((data) => {
        if (data.ConsultantOrderID !== "") {
          selectedUsers.push({
            id: data.ConsultantOrderID,
            name: data.ConsultantName,
          });
        }
      });
    }
    return { selectedUsers: selectedUsers };
  };

  const addNewCalendar = (data) => {
    let temp = global.structuredClone(localCalendarList);
    temp.push({
      CalendarName: data.calName,
      CalendarId: data.calId,
      DefinedWithProcessDefId:
        data.calType === "L" ? localLoadedProcessData.ProcessDefId : "0",
    });
    setlocalCalendarList(temp);
  };
  const openCalenderMf = () => {
    let microProps = {
      Component: "ProcessCalendar", // change here
      Callback: (data) => addNewCalendar(data),
      source: "CAL_PRO",
      popupIndex: "1",
      ProcessDefinitionId: localLoadedProcessData.ProcessDefId + "",
      calId: -1,
      AssociationFlag: "N",
      CalendarType: "G",
      RegisteredProcess:
        localLoadedProcessData?.ProcessType === "R" ? "Y" : "N",
      ActivityId: +props.cellID,
      ContainerId: "calenderDiv",
      Module: "WCL",
      InFrame: false,
      Renderer: "renderProcessCalendar",
      closeDialog: () => {
        setshowCalenderMFBool(false);
        var elem = document.getElementById("oapweb_assetManifest");

        elem.parentNode.removeChild(elem);
      },
    };

    console.log("calenderprops", microProps);
    window.MdmDataModel(microProps);
    setshowCalenderMFBool(true);
  };

  const handleCalendarEdit = () => {
    let microProps = {
      Component: "ProcessCalendar", // change here
      Callback: (id, name) => console.log("nnnnnnnnnnnnnnnn", id, name),
      source: "CAL_PRO",
      popupIndex: "2",
      ProcessDefinitionId:
        calendarValue.substring(0, 1) === "L"
          ? localLoadedProcessData.ProcessDefId + ""
          : "0",
      calId: +calendarValue.substring(1),
      AssociationFlag: "N",
      CalendarType: calendarValue.substring(0, 1),
      RegisteredProcess:
        localLoadedProcessData?.ProcessType === "R" ? "Y" : "N",
      ActivityId: -1,
      ContainerId: "calenderDiv",
      Module: "WCL",
      InFrame: false,
      Renderer: "renderProcessCalendar",
      closeDialog: () => {
        setshowCalenderMFBool(false);
        var elem = document.getElementById("oapweb_assetManifest");

        elem.parentNode.removeChild(elem);
      },
    };

    console.log("calenderprops", microProps);
    window.MdmDataModel(microProps);
    setshowCalenderMFBool(true);
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
          {showCalenderMFBool ? (
            <Modal
              show={showCalenderMFBool}
              backDropStyle={{ backgroundColor: "transparent" }}
              style={{
                width: "auto",
                // height: "60vh",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                background: "white",
              }}
              modalClosed={() => {
                setshowCalenderMFBool(false);
                var elem = document.getElementById("oapweb_assetManifest");

                elem.parentNode.removeChild(elem);
              }}
            >
              <div
                id="calenderDiv"
                style={{ width: "100%", height: "100%" }}
              ></div>
            </Modal>
          ) : null}
          {openUserGroupMF ? (
            <Modal
              show={openUserGroupMF}
              backDropStyle={{ backgroundColor: "transparent" }}
              style={{
                width: "70vw",
                height: "60vh",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                background: "white",
              }}
              modalClosed={() => {
                closeModalUserGroup();
              }}
              children={<div id="usergroupDiv"></div>}
            ></Modal>
          ) : null}
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
                    // onChange={(event) =>
                    //   // ownerValuesHandler(event.target.value, index)
                    //   pickListHandler("owner")
                    // }
                    onClick={() => pickListHandler("Owner")}
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
                    // onChange={(event) =>
                    //   consultantValuesHandler(event.target.value, index)
                    // }
                    onClick={() => pickListHandler("Consultant")}
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
                      inputRef={systemRef}
                      onKeyPress={(e) =>
                        FieldValidations(e, 150, systemRef.current, 30)
                      }
                    />

                    {systemValues?.length > 1 ? (
                      <DeleteOutlinedIcon
                        id="PP_Delete_System_List"
                        className={styles.deleteIcon}
                        onClick={() => handleDeleteField("system", index)}
                      />
                    ) : null}

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
                      inputRef={providerRef}
                      onKeyPress={(e) =>
                        FieldValidations(e, 150, providerRef.current, 30)
                      }
                    />
                    {providerValues?.length > 1 ? (
                      <DeleteOutlinedIcon
                        id="PP_Delete_Provider_List"
                        className={styles.deleteIcon}
                        onClick={() => handleDeleteField("provider", index)}
                      />
                    ) : null}

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
                      inputRef={consumerRef}
                      onKeyPress={(e) =>
                        FieldValidations(e, 150, consumerRef.current, 30)
                      }
                    />
                    {consumerValues?.length > 1 ? (
                      <DeleteOutlinedIcon
                        id="PP_Delete_Consumer_List"
                        className={styles.deleteIcon}
                        onClick={() => handleDeleteField("consumer", index)}
                      />
                    ) : null}

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
            <div style={{ display: "flex", flexDirection: "row" }}>
              <CustomizedDropdown
                id="PP_Calendar_Type_Value"
                className={styles.escalateToFieldsDropdown}
                value={calendarValue}
                onChange={(event) => {
                  setCalendarValue(event.target.value);
                  setIsChanged(true);
                }}
                isNotMandatory={true}
              >
                {localCalendarList &&
                  localCalendarList.map((element, index) => {
                    return (
                      <MenuItem
                        className={styles.menuItemStyles}
                        key={index}
                        value={
                          element.DefinedWithProcessDefId !== "0"
                            ? "L" + element.CalendarId
                            : "G" + element.CalendarId
                        }
                      >
                        {element.CalendarName}
                      </MenuItem>
                    );
                  })}
              </CustomizedDropdown>

              <AddIcon
                onClick={() => openCalenderMf()}
                classes={{
                  root: styles.addIcon,
                }}
              />

              <EditOutlinedIcon
                id="editIcon_1"
                classes={{
                  root: styles.editIcon,
                }}
                onClick={(e) => handleCalendarEdit()}
              />
            </div>
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
