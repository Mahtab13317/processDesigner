// Made changes to solve bug ID - 111180, 112972 , 111162 and 111182
import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Select, MenuItem } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Checkbox from "@material-ui/core/Checkbox";
import { store, useGlobalState } from "state-pool";
import { addConstantsToString } from "../../../../../utility/ProcessSettings/Triggers/triggerCommonFunctions";
import { FormControlLabel } from "@material-ui/core";
import FieldMapping from "./FieldMapping.js";
import { setToastDataFunc } from "../../../../../redux-store/slices/ToastDataHandlerSlice";
import {
  SERVER_URL,
  ARCHIEVE_CONNECT,
  ARCHIEVE_DISCONNECT,
  ASSOCIATE_DATACLASS_MAPPING,
  propertiesLabel,
} from "../../../../../Constants/appConstants";
import { setActivityPropertyChange } from "../../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import Modal from "../../../../../UI/Modal/Modal";
import { connect } from "react-redux";
import { ClickAwayListener } from "@material-ui/core";
import ButtonDropdown from "../../../../../UI/ButtonDropdown/index";
import { useDispatch, useSelector } from "react-redux";
import TabsHeading from "../../../../../UI/TabsHeading";

function DMSAdapter(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [loadedVariables] = useGlobalState("variableDefinition");
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [cabinet, setCabinet] = useState(null);
  const [disabledBeforeConnect, setDisabledBeforeConnect] = useState(true);
  const [associateDataClass, setAssociateDataClass] = useState(null);
  const [associateDataClassList, setAssociateDataClassList] = useState([]);
  const [assDataClassMappingList, setAssDataClassMappingList] = useState([]);
  const [archieveDataClass, setArchieveDataClass] = useState();
  const [archieveDataClassList, setArchieveDataClassList] = useState([]);
  const [workItemCheck, setWorkItemCheck] = useState(
    localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo
      ?.m_bDeleteWorkitemAudit
  );
  const [showAssDataClassMapping, setShowAssDataClassMapping] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [selectedDocIndex, setSelectedDocIndex] = useState();
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [showRedBorder, setShowRedBorder] = useState(false);
  const [mapType, setMapType] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docCheck, setDocCheck] = useState({});
  let defaultDocList = [
    {
      DocName: "Conversation",
      DocTypeId: "-998",
    },
    {
      DocName: "Audit Trail",
      DocTypeId: "-999",
    },
  ];
  const [docList, setDocList] = useState(defaultDocList);
  const [disconnectBody, setDisconnectBody] = useState(null);

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      // selectedVariableList &&
      //   selectedVariableList.map((el) => {
      if (
        localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo?.userName?.trim() ==
          "" ||
        localLoadedActivityPropertyData?.ActivityProperty?.DMSArchive?.Cabinet?.Password?.trim() ==
          ""
      ) {
        setShowRedBorder(true);
        // dispatch(
        //   setActivityPropertyChange({
        //     [propertiesLabel.archive]: { isModified: true, hasError: true },
        //   })
        // );
      } else {
        // dispatch(
        //   setActivityPropertyChange({
        //     [propertiesLabel.archive]: { isModified: true, hasError: false },
        //   })
        // );
      }
      // });
      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked]);

  useEffect(() => {
    let tempLocal = JSON.parse(JSON.stringify(localLoadedProcessData));
    let tempDoclist = [...tempLocal?.DocumentTypeList, ...defaultDocList];
    setDocList(tempDoclist);
  }, [localLoadedProcessData]);

  useEffect(() => {
    setUserName(
      localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo?.userName
    );
    let dropList = [];
    // setPassword(
    //   // localLoadedActivityPropertyData.ActivityProperty.DMSArchive.Cabinet
    //   //   .Password
    //   "system123#"
    // );
    // setWorkItemCheck(
    //   localLoadedActivityPropertyData.ActivityProperty.archiveInfo
    // .m_bDeleteWorkitemAudit
    // );

    dropList.push({
      dataDefName:
        localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo
          ?.folderInfo.assoDataClsName,
      dataDefIndex:
        localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo
          ?.folderInfo.assoDataClsId,
    });

    setCabinet(
      localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo
        ?.cabinetName
    );
    setFolderNameInput(
      localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo?.folderInfo
        ?.folderName
    );
    setAssociateDataClass(
      localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo?.folderInfo
        ?.assoDataClsName
    );

    let checkObj = {};
    docList?.map((el) => {
      checkObj = {
        ...checkObj,
        [el.DocTypeId]: { check: false, selectedVal: null },
      };
    });
    localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo?.docTypeInfo?.docTypeDCMapList?.forEach(
      (el) => {
        checkObj = {
          ...checkObj,
          [el.docTypeId]: { check: true, selectedVal: el.assocDCId },
        };
        dropList.push({
          dataDefName: el.assocDCName,
          dataDefIndex: el.assocDCId,
        });
      }
    );
    if (disabledBeforeConnect) {
      setAssociateDataClassList(dropList);
    }
    setDocCheck(checkObj);
  }, [localLoadedActivityPropertyData]);

  const handleFolderSelection = (value) => {
    setFolderNameInput((prev) => {
      return addConstantsToString(prev, value.VariableName);
    });
    let temp = { ...localLoadedActivityPropertyData };
    temp.ActivityProperty.archiveInfo.folderInfo.folderName =
      addConstantsToString(folderNameInput, value.VariableName);
    setlocalLoadedActivityPropertyData(temp);
    // dispatch(
    //   setActivityPropertyChange({
    //     [propertiesLabel.archive]: { isModified: true, hasError: false },
    //   })
    // );
    // setShowDropdown(false);
    // setTempData((prevState) => {
    //   return { ...prevState, folderName: value.VariableName };
    // });
    // setFolderNameInput((prev) => {
    //   return addConstantsToString(prev, value.VariableName);
    // });

    // let jsonBody = {
    //   processDefId: props.openProcessID,
    //   activityId: props.cellID,
    //   cabinetName:
    //     localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo
    //       ?.cabinetName,
    //   appServerIP: "127.0.0.1",
    //   appServerPort: "8080",
    //   appServerType: "JBossEAP",
    //   userName: userName,
    //   m_strAuthCred: password,
    //   folderInfo: {
    //     folderName: `${folderNameInput}&${value.VariableName}&`,
    //   },
    // };

    // axios.post(SERVER_URL + FOLDERNAME_ARCHIEVE, jsonBody).then((res) => {
    //   if (res.data.Status === 0) {
    //   }
    // });
  };

  const handleConnectClick = () => {
    let jsonBody = {
      username: userName,
      authcode: password,
    };

    axios.post(SERVER_URL + ARCHIEVE_CONNECT, jsonBody).then((res) => {
      if (res.data.Status === 0) {
        dispatch(
          setToastDataFunc({
            message: "Connected Sucessfully!",
            severity: "success",
            open: true,
          })
        );
        setDisconnectBody({ DMSAuthentication: res.data.DMSAuthentication });
        var x = document.getElementById("trigger_laInsert_Btn");
        if (x.innerHTML === "Connect") {
          x.innerHTML = "Disconnect";
        } else {
          x.innerHTML = "Connect";
        }
        let temp = { ...localLoadedActivityPropertyData };
        temp.ActivityProperty.archiveInfo.dmsAuthentication =
          res.data.DMSAuthentication;
        setlocalLoadedActivityPropertyData(temp);
        setDisabledBeforeConnect(false);
        let arrList = [];
        res?.data?.DataDefinitions?.map((data) => {
          arrList.push({
            dataDefName: data.DataDefName,
            dataDefIndex: data.DataDefIndex,
          });
        });
        setAssociateDataClassList(arrList);
      }
    });
  };

  const handleDisconnectClick = () => {
    axios.post(SERVER_URL + ARCHIEVE_DISCONNECT, disconnectBody).then(() => {
      dispatch(
        setToastDataFunc({
          message: "Disconnected Sucessfully!",
          severity: "success",
          open: true,
        })
      );
      var x = document.getElementById("trigger_laInsert_Btn");
      if (x.innerHTML === "Connect") {
        x.innerHTML = "Disconnect";
      } else {
        x.innerHTML = "Connect";
      }
      console.log("SUCCESS");
    });
  };

  const handleAssDataClassMapping = (associateDataClass, type, document) => {
    setMapType(type);
    // if (!associateDataClass && type == "associate") {
    //   setShowRedBorder(true);
    //   setAssociateDataClass(null);
    // } else if (!associateDataClass && type == "archeive") {
    //   setShowRedBorder(true);
    //   // setAssociateDataClass(null);
    // }

    if (type == "archeive") {
      setSelectedDoc(document);
    }
    let dataDefIndex =
      type == "associate"
        ? localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo
            ?.folderInfo?.assoDataClsId
        : associateDataClass;
    // associateDataClassList &&
    //   associateDataClassList.map((assDataClass) => {
    //     if (
    //       assDataClass.dataDefName == associateDataClass ||
    //       assDataClass.dataDefIndex == associateDataClass
    //     ) {
    //       dataDefIndex = assDataClass.dataDefIndex;
    //     }
    //   });
    axios
      .get(SERVER_URL + ASSOCIATE_DATACLASS_MAPPING + `/${dataDefIndex}`)
      .then((res) => {
        if (res.data.Status === 0) {
          if ((type = "associate")) {
            setAssDataClassMappingList(res.data.DataDefinition);
            setShowAssDataClassMapping(true);
          } else if ((type = "archieve")) {
            setArchieveDataClassList(res.data.DataDefinition);
            setShowAssDataClassMapping(true);
          }
        }
      });
  };

  const handleDocCheck = (id, index) => {
    let tempCheck = { ...docCheck };
    tempCheck[id].check = !tempCheck[id].check;
    if (!tempCheck[id].check) {
      tempCheck[id].selectedVal = null;
      let temp = { ...localLoadedActivityPropertyData };
      let tempDocList = [
        ...temp?.ActivityProperty?.archiveInfo?.docTypeInfo?.docTypeDCMapList,
      ];
      let newIdx = null;
      tempDocList?.forEach((doc, idx) => {
        if (doc.docTypeId === id) {
          newIdx = idx;
        }
      });
      temp.ActivityProperty.archiveInfo.docTypeInfo.docTypeDCMapList.splice(
        newIdx,
        1
      );
      setlocalLoadedActivityPropertyData(temp);
    }
    setDocCheck(tempCheck);
    setSelectedDocIndex(index);
  };

  const handleCabinetChange = (value) => {
    // dispatch(
    //   setActivityPropertyChange({
    //     [propertiesLabel.archieve]: { isModified: true, hasError: false },
    //   })
    // );
    let temp = { ...localLoadedActivityPropertyData };
    temp.ActivityProperty.archiveInfo.cabinetName = value;
    setlocalLoadedActivityPropertyData(temp);
  };

  const handlePasswordChange = (event) => {
    let temp = { ...localLoadedActivityPropertyData };
    temp.ActivityProperty.archiveInfo.authCred = event.target.value;
    setlocalLoadedActivityPropertyData(temp);
    setPassword(event.target.value);
    // dispatch(
    //   setActivityPropertyChange({
    //     [propertiesLabel.archive]: {
    //       isModified: true,
    //       hasError: false,
    //     },
    //   })
    // );
  };

  const handleAssociateClassChange = (e) => {
    // dispatch(
    //   setActivityPropertyChange({
    //     [propertiesLabel.archive]: {
    //       isModified: true,
    //       hasError: false,
    //     },
    //   })
    // );
    let tempIndex;
    associateDataClassList.map((el) => {
      if (el.dataDefName == e.target.value) {
        tempIndex = el.dataDefIndex;
      }
    });
    setAssociateDataClass(e.target.value);
    let temp = { ...localLoadedActivityPropertyData };
    temp.ActivityProperty.archiveInfo.folderInfo.assoDataClsName =
      e.target.value;
    temp.ActivityProperty.archiveInfo.folderInfo.assoDataClsId = tempIndex;
    setlocalLoadedActivityPropertyData(temp);
  };

  const handleCheckBoxChange = (e) => {
    // dispatch(
    //   setActivityPropertyChange({
    //     [propertiesLabel.archive]: {
    //       isModified: true,
    //       hasError: false,
    //     },
    //   })
    // );
    setWorkItemCheck(!workItemCheck);
    let temp = { ...localLoadedActivityPropertyData };
    temp.ActivityProperty.archiveInfo.m_bDeleteWorkitemAudit = !workItemCheck;
    setlocalLoadedActivityPropertyData(temp);
  };

  const handleUserChange = (e) => {
    setUserName(e.target.value);
    // dispatch(
    //   setActivityPropertyChange({
    //     [propertiesLabel.archive]: {
    //       isModified: true,
    //       hasError: false,
    //     },
    //   })
    // );
    let temp = { ...localLoadedActivityPropertyData };
    temp.ActivityProperty.archiveInfo.userName = e.target.value;
    setlocalLoadedActivityPropertyData(temp);
  };

  let collapseContent = () => {
    return (
      <div>
      <TabsHeading heading={props?.heading} />
        <div className="dropDownSelectLabelDMS">
          <p id="archieve_cabinet">Cabinet</p>
          <div>
            <Select
              className="dropDownSelect"
              style={{
                marginRight: "10px",
                marginLeft: null,
              }}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
              value={cabinet}
              onChange={(event) => handleCabinetChange(event.target.value)}
            >
              {localLoadedActivityPropertyData?.ActivityProperty?.archiveInfo?.m_strCabList?.map(
                (el) => {
                  return (
                    <MenuItem
                      className="statusSelect"
                      value={el}
                      style={{ fontSize: "12px" }}
                    >
                      {el}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </div>
        </div>
        <div className="dropDownSelectLabelDMS">
          <p id="archieve_userName">UserName</p>
          <span
            style={{
              color: "red",
              padding: "0.35rem",
              marginLeft: "-0.375rem",
              marginTop: "-0.4rem",
            }}
          >
            *
          </span>
          <div>
            <input
              value={userName}
              className="userNameInput"
              onChange={(event) => {
                handleUserChange(event);
              }}
              style={{
                border:
                  !userName && showRedBorder == true ? "1px solid red" : null,
              }}
            ></input>
            {!userName && showRedBorder == true ? (
              <span style={{ color: "red", fontSize: "10px" }}>
                Please Enter UserName
              </span>
            ) : null}
          </div>
        </div>
        <div className="dropDownSelectLabelDMS">
          <p id="archieve_password">Password</p>
          <span
            style={{
              color: "red",
              padding: "0.35rem",
              marginLeft: "-0.375rem",
              marginTop: "-0.4rem",
            }}
          >
            *
          </span>
          <div>
            <input
              value={password}
              className="passwordInput"
              type="password"
              onChange={(event) => {
                handlePasswordChange(event);
              }}
              style={{
                border:
                  !password && showRedBorder == true ? "1px solid red" : null,
              }}
            ></input>
            {!password && showRedBorder == true ? (
              <span style={{ color: "red", fontSize: "10px" }}>
                Please Enter Password
              </span>
            ) : null}
          </div>
        </div>
        <button
          id="trigger_laInsert_Btn"
          className="triggerButton propertiesAddButton_connect"
          onClick={
            document.getElementById("trigger_laInsert_Btn")?.innerHTML ==
            "Connect"
              ? handleConnectClick
              : handleDisconnectClick
          }
        >
          {"Connect"}
        </button>
      </div>
    );
  };

  const expandedContent = () => {
    return (
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p id="archieve_userName">
            UserName{" "}
            <span
              style={{
                color: "red",
                padding: "0.35rem",
                marginLeft: "-0.375rem",
                marginTop: "-0.4rem",
              }}
            >
              *
            </span>
          </p>
          <div>
            <input
              value={userName}
              className="userNameInput"
              onChange={(event) => {
                handleUserChange(event);
              }}
              style={{
                width: "290px",
                height: "28px",
                borderRadius: "1px",
                border:
                  !userName && showRedBorder == true
                    ? "1px solid red"
                    : "1px solid #CECECE",
              }}
            ></input>
            {!userName && showRedBorder == true ? (
              <span style={{ color: "red", fontSize: "10px" }}>
                Please Enter UserName
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="archieveScreen">
      {props.isDrawerExpanded ? expandedContent() : collapseContent()}
      <div style={{ display: "flex" }}>
        <p id="archieve_folderName">FolderName</p>
        <span
          style={{
            color: "red",
            padding: "0.35rem",
            marginLeft: "-0.375rem",
            marginTop: "-0.4rem",
          }}
        >
          *
        </span>
        <div style={{ marginLeft: props.isDrawerExpanded ? "157px" : "36px" }}>
          <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
            <div className="relative inlineBlock">
              <button
                className="triggerButton propertiesAddButton"
                onClick={() => setShowDropdown(true)}
                // disabled={readOnlyProcess}
                id="trigger_laInsert_Btn"
              >
                {"insertVariable"}
              </button>
              <ButtonDropdown
                open={showDropdown}
                dropdownOptions={loadedVariables}
                onSelect={handleFolderSelection}
                optionKey="VariableName"
                style={{ top: "80%" }}
                id="trigger_laInsert_Dropdown"
              />
            </div>
          </ClickAwayListener>
          <div>
            <textarea
              id="trigger_la_desc"
              autofocus
              // disabled={readOnlyProcess}
              value={folderNameInput}
              onChange={(event) => setFolderNameInput(event.target.value)}
              className="argStringBodyInput"
              style={{
                border:
                  !folderNameInput && showRedBorder == true
                    ? "1px solid red"
                    : null,
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={
          props.isDrawerExpanded
            ? "dropDownSelectLabel_expanded"
            : "dropDownSelectLabelDMS"
        }
      >
        <p id="archieve_dataClass">Associate Data Class</p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Select
            className={
              props.isDrawerExpanded
                ? "dropDownSelect_expandeddms"
                : "dropDownSelect"
            }
            style={{ marginLeft: props.isDrawerExpanded ? "119px" : null }}
            // style={{
            //   border:
            //     !associateDataClass && showRedBorder == true
            //       ? "1px solid red"
            //       : null,
            // }}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
            disabled={disabledBeforeConnect}
            value={associateDataClass}
            onChange={(e) => handleAssociateClassChange(e)}
          >
            {associateDataClassList &&
              associateDataClassList.map((dataClass) => {
                return (
                  <MenuItem
                    className="statusSelect"
                    value={dataClass.dataDefName}
                    style={{ fontSize: "12px" }}
                  >
                    {dataClass.dataDefName}
                  </MenuItem>
                );
              })}
          </Select>
          {/* {!associateDataClass && showRedBorder == true ? (
            <span style={{ color: "red", fontSize: "10px" }}>
              Please select Data Class
            </span>
          ) : null} */}
        </div>
        <CheckCircleIcon
          style={{ marginRight: "5px", marginTop: "5px", cursor: "pointer" }}
          onClick={() =>
            handleAssDataClassMapping(associateDataClass, "associate")
          }
        />
        {showAssDataClassMapping ? (
          <Modal
            show={showAssDataClassMapping}
            style={{
              opacity: "1",
              width: "23.5vw",
              overflow: "scroll",
              height: "358px",
              top: "15%",
              padding: "1%",
              left: "9%",
              position: "absolute",
              marginLeft: "10px",
            }}
            modalClosed={() => setShowAssDataClassMapping(false)}
            children={
              <FieldMapping
                userName={userName}
                password={password}
                mapType={mapType}
                selectedDoc={selectedDoc}
                folderNameInput={folderNameInput}
                associateDataClass={associateDataClass}
                associateDataClassList={associateDataClassList}
                assDataClassMappingList={assDataClassMappingList}
                setShowAssDataClassMapping={setShowAssDataClassMapping}
                docCheckList={docCheck}
              />
            }
          ></Modal>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <p id="archieve_workItemAudit">Delete WorkItem Audit</p>
        <FormControlLabel
          control={
            <Checkbox
              checked={workItemCheck}
              onChange={(e) => handleCheckBoxChange(e)}
              size="small"
              style={{
                fontSize: "10px",
                marginLeft: "8px",
                marginTop: "8px",
              }}
            />
          }
        />
      </div>
      <hr style={{ marginTop: "10px" }} />
      <div style={{ marginTop: "10px" }}>
        {/*code added on 16 June 2022 for BugId 108976*/}
        <p id="archieve_docTypes">{t("ArchiveDocumentTypes")}</p>
        <table>
          <tr>
            <th style={{ width: "10vw" }}>
              <Checkbox
                size="small"
                disabled={disabledBeforeConnect}
                //   checked={props.docTypes.setAllCreate_Email}
              />
            </th>
            <th
              style={{ display: "flex", alignItems: "center", width: "30vw" }}
            >
              {"Document(s)"}
            </th>
            <th style={{ width: "50vw" }}>{"Associated Class"}</th>
            <th style={{ width: "10vw" }}> </th>
          </tr>
          {docList?.map((value, index) => {
            return (
              <tr>
                <td style={{ width: "10vw" }}>
                  <Checkbox
                    size="small"
                    checked={
                      docCheck[value.DocTypeId]?.check
                        ? docCheck[value.DocTypeId]?.check
                        : false
                    }
                    onChange={() => handleDocCheck(value.DocTypeId, index)}
                    disabled={disabledBeforeConnect}
                  />
                </td>
                <td style={{ width: "30vw" }}>{value.DocName}</td>
                <td style={{ width: "50vw" }}>
                  <Select
                    className={
                      props.isDrawerExpanded
                        ? "dropDownSelect_expandeddms"
                        : "dropDownSelect"
                    }
                    MenuProps={{
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      getContentAnchorEl: null,
                    }}
                    disabled={
                      selectedDocIndex
                        ? selectedDocIndex == index &&
                          !docCheck[value.DocTypeId]?.check
                        : !docCheck[value.DocTypeId]?.check
                    }
                    value={
                      docCheck[value.DocTypeId]?.selectedVal
                        ? docCheck[value.DocTypeId]?.selectedVal
                        : ""
                    }
                    onChange={(event) => {
                      setArchieveDataClass(event.target.value);
                      let tempCheck = { ...docCheck };
                      tempCheck[value.DocTypeId].selectedVal =
                        event.target.value;
                      setDocCheck(tempCheck);
                    }}
                    style={{
                      border:
                        !archieveDataClass && showRedBorder == true
                          ? "1px solid red"
                          : null,
                    }}
                  >
                    {associateDataClassList?.map((dataClass) => {
                      return (
                        <MenuItem
                          className="statusSelect"
                          value={dataClass.dataDefIndex}
                          style={{ fontSize: "12px" }}
                        >
                          {dataClass.dataDefName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </td>
                <td
                  onClick={() =>
                    handleAssDataClassMapping(
                      docCheck[value.DocTypeId]?.selectedVal,
                      "archeive",
                      value
                    )
                  }
                  style={{ width: "10vw" }}
                >
                  <CheckCircleIcon
                    style={{
                      marginRight: "5px",
                      marginTop: "5px",
                      cursor: "pointer",
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};
export default connect(mapStateToProps, null)(DMSAdapter);
