import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import { Select, MenuItem } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Checkbox from "@material-ui/core/Checkbox";
import { store, useGlobalState } from "state-pool";
import { addConstantsToString } from "../../../../../utility/ProcessSettings/Triggers/triggerCommonFunctions";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import FieldMapping from "./FieldMapping.js";
import {
  SERVER_URL,
  ARCHIEVE_CONNECT,
  ASSOCIATE_DATACLASS_MAPPING,
  FOLDERNAME_ARCHIEVE,
} from "../../../../../Constants/appConstants";
import {
  setActivityPropertyChange,
  ActivityPropertyChangeValue,
} from "../../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import Modal from "../../../../../UI/Modal/Modal";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { ClickAwayListener } from "@material-ui/core";
import ButtonDropdown from "../../../../../UI/ButtonDropdown/index";
import { useDispatch, useSelector } from "react-redux";

function DMSAdapter(props) {
  const dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [loadedVariables] = useGlobalState("variableDefinition");
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [cabinet, setCabinet] = useState();
  const [disabledBeforeConnect, setDisabledBeforeConnect] = useState(true);
  const [associateDataClass, setAssociateDataClass] = useState(null);
  const [associateDataClassList, setAssociateDataClassList] = useState([]);
  const [assDataClassMappingList, setAssDataClassMappingList] = useState([]);
  const [archieveDataClass, setArchieveDataClass] = useState();
  const [archieveDataClassList, setArchieveDataClassList] = useState([]);
  const [workItemCheck, setWorkItemCheck] = useState(
    localLoadedActivityPropertyData.ActivityProperty.archiveInfo
      .m_bDeleteWorkitemAudit
  );
  const [showAssDataClassMapping, setShowAssDataClassMapping] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [docCheck, setDocCheck] = useState(false);
  const [selectedDocIndex, setSelectedDocIndex] = useState();
  const [tempData, setTempData] = useState({
    cabinet: "",
    userName: "",
    password: "",
    folderName: "",
    dataClass: "",
    deleteAudit: false,
    allDocCheckValue: false,
    conversationValue: "",
    conversationCheckValue: false,
    auditTrailValue: "",
    auditTrailCheckValue: false,
    DocumentTypeList: [
      {
        DocTypeId: "1",
        DocName: "AddressProof",
        Print: true,
        Create_P: false,
        Email: false,
        Create_E: false,
        Fax: true,
        Create_F: false,
      },
      {
        DocTypeId: "2",
        DocName: "AddressProof1",
        Print: false,
        Create_P: true,
        Email: false,
        Create_E: false,
        Fax: true,
        Create_F: false,
      },
    ],
  });
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);
  const [showRedBorder, setShowRedBorder] = useState(false);
  const ActivityPropertyBoolean = useSelector(ActivityPropertyChangeValue);

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      // selectedVariableList &&
      //   selectedVariableList.map((el) => {
      if (userName.trim() == "" || password.trim() == "") {
        // setErrorToast(true);
        setShowRedBorder(true);
        dispatch(
          setActivityPropertyChange({
            Archieve: { isModified: true, hasError: true },
          })
        );
      } else {
        dispatch(
          setActivityPropertyChange({
            Archieve: { isModified: true, hasError: false },
          })
        );
      }
      // });
      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked]);

  useEffect(() => {
    setUserName(
      localLoadedActivityPropertyData.ActivityProperty.archiveInfo.userName
    );
    setPassword(
      // localLoadedActivityPropertyData.ActivityProperty.DMSArchive.Cabinet
      //   .Password
      "system123#"
    );
    // setWorkItemCheck(
    //   localLoadedActivityPropertyData.ActivityProperty.archiveInfo
    // .m_bDeleteWorkitemAudit
    // );

    setAssociateDataClassList((prev) => {
      return [
        ...prev,
        {
          dataDefName:
            localLoadedActivityPropertyData.ActivityProperty.archiveInfo
              .folderInfo.assoDataClsName,
        },
      ];
    });

    setCabinet(
      localLoadedActivityPropertyData.ActivityProperty.archiveInfo.cabinetName
    );
    setFolderNameInput(
      localLoadedActivityPropertyData.ActivityProperty.archiveInfo.folderInfo
        .folderName
    );
    setAssociateDataClass(
      localLoadedActivityPropertyData.ActivityProperty.archiveInfo.folderInfo
        .assoDataClsName
    );
  }, [props.cellActivityType, props.cellActivitySubType, props.cellID]);

  // useEffect(() => {
  //   if (ActivityPropertyBoolean.Archieve.hasError) {
  //     setShowRedBorder(true);
  //   } else {
  //     setShowRedBorder(false);
  //   }
  // }, [ActivityPropertyBoolean.Archieve.hasError]);

  const handleFolderSelection = (value) => {
    setShowDropdown(false);
    setTempData((prevState) => {
      return { ...prevState, folderName: value.VariableName };
    });
    setFolderNameInput((prev) => {
      return addConstantsToString(prev, value.VariableName);
    });

    let jsonBody = {
      processDefId: props.openProcessID,
      activityId: props.cellID,
      cabinetName:
        localLoadedActivityPropertyData.ActivityProperty.archiveInfo
          .cabinetName,
      appServerIP: "127.0.0.1",
      appServerPort: "8080",
      appServerType: "JBossEAP",
      userName: userName,
      m_strAuthCred: password,
      folderInfo: {
        folderName: `${folderNameInput}&${value.VariableName}&`,
      },
    };

    axios.post(SERVER_URL + FOLDERNAME_ARCHIEVE, jsonBody).then((res) => {
      if (res.data.Status === 0) {
      }
    });

    dispatch(
      setActivityPropertyChange({
        Archieve: { isModified: true, hasError: false },
      })
    );
  };

  const handleConnectClick = () => {
    let jsonBody = {
      username: userName,
      authcode: password,
    };
    axios.post(SERVER_URL + ARCHIEVE_CONNECT, jsonBody).then((res) => {
      if (res.data.Status === 0) {
        setDisabledBeforeConnect(false);
        res.data.DataDefinitions.map((data) => {
          setAssociateDataClassList((prev) => {
            return [
              ...prev,
              {
                dataDefName: data.DataDefName,
                dataDefIndex: data.DataDefIndex,
              },
            ];
          });
        });
      }
    });
  };

  const handleAssDataClassMapping = (associateDataClass, type) => {
    if (!associateDataClass && type == "associate") {
      setShowRedBorder(true);
      setAssociateDataClass(null);
    } else if (!associateDataClass && type == "archeive") {
      setShowRedBorder(true);
      // setAssociateDataClass(null);
    }
    let dataDefIndex;
    associateDataClassList &&
      associateDataClassList.map((assDataClass) => {
        if (
          assDataClass.dataDefName == associateDataClass ||
          assDataClass.dataDefIndex == associateDataClass
        ) {
          dataDefIndex = assDataClass.dataDefIndex;
        }
      });
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

  const handleDocCheck = (index) => {
    setDocCheck(!docCheck);
    setSelectedDocIndex(index);
  };
  return (
    <div className="archieveScreen">
      <div
        className={
          props.isDrawerExpanded
            ? "dropDownSelectLabel_expanded"
            : "dropDownSelectLabel"
        }
      >
        <p id="archieve_cabinet">Cabinet</p>
        <Select
          className={
            props.isDrawerExpanded
              ? "dropDownSelect_expanded"
              : "dropDownSelect"
          }
          style={{ marginRight: "10px" }}
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
          onChange={(event) => setCabinet(event.target.value)}
        >
          <MenuItem className="statusSelect">
            {
              localLoadedActivityPropertyData.ActivityProperty.archiveInfo
                .cabinetName
            }
          </MenuItem>
          );
        </Select>
      </div>
      <div
        className={
          props.isDrawerExpanded
            ? "dropDownSelectLabel_expanded"
            : "dropDownSelectLabel"
        }
      >
        <p id="archieve_userName">UserName</p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            value={userName}
            className="userNameInput"
            onChange={(event) => {
              setUserName(event.target.value);
              dispatch(
                setActivityPropertyChange({
                  Archieve: { isModified: true, hasError: false },
                })
              );
            }}
            style={{
              position: props.isDrawerExpanded ? "absolute" : null,
              left: props.isDrawerExpanded ? "45%" : null,
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
      <div
        className={
          props.isDrawerExpanded
            ? "dropDownSelectLabel_expanded"
            : "dropDownSelectLabel"
        }
      >
        <p id="archieve_password">Password</p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            value={password}
            className="passwordInput"
            type="password"
            onChange={(event) => {
              setPassword(event.target.value);
              dispatch(
                setActivityPropertyChange({
                  Archieve: { isModified: true, hasError: false },
                })
              );
            }}
            style={{
              position: props.isDrawerExpanded ? "absolute" : null,
              left: props.isDrawerExpanded ? "45%" : null,
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
        className="triggerButton propertiesAddButton_connect"
        onClick={handleConnectClick}
        // disabled={readOnlyProcess}
        id="trigger_laInsert_Btn"
      >
        {"Connect"}
      </button>
      <div style={{ display: "flex" }}>
        <p id="archieve_folderName">FolderName</p>
        <div style={{ marginLeft: props.isDrawerExpanded ? "490px" : "36px" }}>
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
            />
          </div>
        </div>
      </div>
      <div
        className={
          props.isDrawerExpanded
            ? "dropDownSelectLabel_expanded"
            : "dropDownSelectLabel"
        }
      >
        <p id="archieve_dataClass">Associate Data Class</p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Select
            className={
              props.isDrawerExpanded
                ? "dropDownSelect_expanded"
                : "dropDownSelect"
            }
            style={{
              border:
                !associateDataClass && showRedBorder == true
                  ? "1px solid red"
                  : null,
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
            disabled={disabledBeforeConnect}
            value={associateDataClass}
            onChange={(e) => setAssociateDataClass(e.target.value)}
          >
            <div>SHIVANI</div>
            {associateDataClassList &&
              associateDataClassList.map((dataClass) => {
                return (
                  <MenuItem
                    className="statusSelect"
                    value={dataClass.dataDefName}
                  >
                    {dataClass.dataDefName}
                  </MenuItem>
                );
              })}
          </Select>
          {!associateDataClass && showRedBorder == true ? (
            <span style={{ color: "red", fontSize: "10px" }}>
              Please select Data Class
            </span>
          ) : null}
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
              height: "auto",
              top: "15%",
              padding: "4%",
              left: "9%",
              position: "absolute",
              marginLeft: "10px",
            }}
            modalClosed={() => setShowAssDataClassMapping(false)}
            children={
              <FieldMapping
                userName={userName}
                password={password}
                folderNameInput={folderNameInput}
                associateDataClass={associateDataClass}
                associateDataClassList={associateDataClassList}
                assDataClassMappingList={assDataClassMappingList}
                setShowAssDataClassMapping={setShowAssDataClassMapping}
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
              onChange={() => setWorkItemCheck(!workItemCheck)}
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
        <p id="archieve_docTypes">Archieve Document Types</p>
        <table className="table">
          <tr>
            <th>
              <Checkbox
                size="small"
                //   checked={props.docTypes.setAllCreate_Email}
              />
            </th>
            <th style={{ display: "flex", alignItems: "center" }}>
              {"Document(s)"}
            </th>
            <th>{"Associated Class"}</th>
            <th> </th>
          </tr>
          {loadedProcessData.value.DocumentTypeList.map((value, index) => {
            return (
              <tr>
                <td>
                  {" "}
                  <Checkbox
                    size="small"
                    check={docCheck}
                    onChange={() => handleDocCheck(index)}
                  />
                </td>
                <td>{value.DocName}</td>
                <Select
                  className={
                    props.isDrawerExpanded
                      ? "dropDownSelect_expanded"
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
                      ? selectedDocIndex == index && !docCheck
                      : !docCheck
                  }
                  value={archieveDataClass}
                  onChange={(event) => setArchieveDataClass(event.target.value)}
                  style={{
                    border:
                      !archieveDataClass && showRedBorder == true
                        ? "1px solid red"
                        : null,
                  }}
                >
                  {associateDataClassList.map((dataClass) => {
                    return (
                      <MenuItem
                        className="statusSelect"
                        value={dataClass.dataDefIndex}
                      >
                        {dataClass.dataDefName}
                      </MenuItem>
                    );
                  })}
                </Select>
                <td
                  onClick={() =>
                    handleAssDataClassMapping(archieveDataClass, "archeive")
                  }
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
