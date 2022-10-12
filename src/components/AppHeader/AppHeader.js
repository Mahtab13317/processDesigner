import React, { useEffect, useState } from "react";
import "./AppHeader.css";
import src from "../../assets/Header/NewgenWithIbps.svg";
import { useTranslation } from "react-i18next";
// import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import SearchBox from "../../UI/Search Component/index";
import { store, useGlobalState } from "state-pool";
import { useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import { connect, useDispatch, useSelector } from "react-redux";
import * as actionCreators from "../../redux-store/actions/processView/actions.js";
import processIcon from "../../../src/assets/HomePage/HS_Process.svg";
import QuestionMarkIcon from "../../../src/assets/HomePage/HS_Question Mark.svg";
import {
  APP_HEADER_HEIGHT,
  ENDPOINT_OPENPROCESS,
  ENDPOINT_OPENTEMPLATE,
  RTL_DIRECTION,
  SERVER_URL,
  TEMPLATE_VARIANT_TYPE,
} from "../../Constants/appConstants";
import axios from "axios";
import {
  CabinetIcon,
  LogoutIcon,
  UserProfileImage,
} from "../../utility/AllImages/AllImages";
import moment from "moment";
import { userLogout } from "../../redux-store/reducers/userDetail/actions";
import { CircularProgress, ClickAwayListener } from "@material-ui/core";
import DialogBox from "./DialogBox";
import Modal from "../../UI/Modal/Modal";

const AppHeader = (props) => {
  let { t } = useTranslation();
  const history = useHistory();
  moment.locale("en");
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const arrProcessesData = store.getState("arrProcessesData"); //array of processdata stored
  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked
  const openProcessesArr = store.getState("openProcessesArr"); //array of keys of processdata stored
  const [localArrProcessesData, setLocalArrProcessesData] =
    useGlobalState(arrProcessesData);
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  const [localOpenProcessesArr, setLocalOpenProcessesArr] =
    useGlobalState(openProcessesArr);
  const [isProcessDesignerTabActive, setisProcessDesignerTabActive] =
    React.useState(true);

  const [tabInfoAtTop, settabInfoAtTop] = useState([]);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  const cabinet = localStorage.getItem("cabinet");
  const isLogoutLoading = useSelector(
    (state) => state.userDetails.isLogoutLoading
  );
  const username = localStorage.getItem("username");
  const lastLoginTime = sessionStorage.getItem("lastLoginTime");
  const logoutHandler = () => {
    setIsLogout(false);
    dispatch(userLogout({ history }));
  };

  /*code updated on 08 October 2022 for BugId 116325*/
  const logoutAlert = () => {
    setIsLogout(true);
  };

  const closeAlert = () => {
    setIsLogout(false);
  };

  // code edited on 10 Oct 2022 for BugId 112343 and BugId 112684
  useEffect(() => {
    const setTabInfoFunc = (temp) => {
      if (tabInfoAtTop.length > 0 && temp.ProcessDefId !== "") {
        let temp2 = JSON.parse(JSON.stringify(tabInfoAtTop));
        if (!temp2.some((el) => el.ProcessDefId === temp.ProcessDefId)) {
          temp2.map((item) => (item.isActive = false));
          temp2.push(temp);
          settabInfoAtTop(temp2);
        } else return;
      } else settabInfoAtTop((prev) => [...prev, temp]);
    };

    if (props.openTemplateFlag) {
      if (props.templateId !== "") {
        let temp = {
          ProcessDefId: props.templateId.toString(),
          ProcessName: props.templateName,
          ProcessType: "",
          ProcessVariantType: "", //data will be filled after setOtherData method is called
          ProjectName: "",
          VersionNo: "",
          isActive: true,
        };
        setTabInfoFunc(temp);
      }
    } else {
      if (props.openProcessID !== "") {
        let temp = {
          ProcessDefId: props.openProcessID.toString(),
          ProcessName: props.openProcessName,
          ProcessType: props.openProcessType,
          ProcessVariantType: "", //data will be filled after setOtherData method is called
          ProjectName: "",
          VersionNo: props.openProcessVersion.toString(),
          isActive: true,
        };
        setTabInfoFunc(temp);
      }
    }
  }, [
    props.openProcessID,
    props.openProcessName,
    props.openProcessType,
    props.openProcessVersion,
    props.templateId,
    props.templateName,
  ]);

  useEffect(() => {
    if (tabInfoAtTop.length > 0) {
      setisProcessDesignerTabActive(false);
    }
  }, [tabInfoAtTop.length]);

  useEffect(() => {
    if (tabInfoAtTop.length === 0) {
      backToProcessDesignerHome();
    }
  }, [tabInfoAtTop]);

  //click handler for process data tabs
  const clickHandler = (data) => {
    ActiveClickedTab(data);
    setisProcessDesignerTabActive(false);
    // code edited on 10 Oct 2022 for BugId 112343 and BugId 112684
    if (data.ProcessVariantType === TEMPLATE_VARIANT_TYPE) {
      axios
        .get(
          SERVER_URL +
            ENDPOINT_OPENTEMPLATE +
            "/" +
            data.ProcessDefId +
            "/" +
            data.ProcessName
        )
        .then((res) => {
          if (res.data.Status === 0) {
            setlocalLoadedProcessData(res.data.OpenProcess);
            props.openProcessClick("", "", "", "", "");
            props.openTemplate(data.ProcessDefId, data.ProcessName, true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(
          SERVER_URL +
            ENDPOINT_OPENPROCESS +
            data.ProcessDefId +
            "/" +
            data.ProcessName +
            "/" +
            data.ProcessType
        )
        .then((res) => {
          if (res.data.Status === 0) {
            setlocalLoadedProcessData(res.data.OpenProcess);
            props.openProcessClick(
              data.ProcessDefId,
              data.ProjectName,
              data.ProcessType,
              data.VersionNo,
              data.ProcessName
            );
            props.openTemplate("", "", false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    history.push("/process");
  };

  useEffect(() => {
    const setOtherDataToTab = (processData) => {
      if (localLoadedProcessData !== null) {
        let temp = JSON.parse(JSON.stringify(tabInfoAtTop));
        temp.forEach((item) => {
          if (item.ProcessDefId == processData.ProcessDefId) {
            item.ProcessVariantType = processData.ProcessVariantType;
            item.ProjectName = processData.ProjectName;
            item.ProcessType = processData.ProcessType;
            item.VersionNo = processData.VersionNo;
          }
        });
        settabInfoAtTop(temp);
      } else return;
    };

    setOtherDataToTab(localLoadedProcessData);
  }, [localLoadedProcessData]);

  //goes back to process designer homepage
  const backToProcessDesignerHome = () => {
    setlocalLoadedProcessData(null);
    setisProcessDesignerTabActive(true);

    history.push("/");
  };

  //delete processdata tab, called when process has to be closed
  const deleteProcessData = (pData) => {
    localArrProcessesData.forEach((element) => {
      if (element.ProcessDefId === pData.ProcessDefId) {
        localArrProcessesData.splice(localArrProcessesData.indexOf(element), 1);
      }
    });
    let temp = JSON.parse(JSON.stringify(localOpenProcessesArr));
    temp.splice(
      localOpenProcessesArr.indexOf(
        `${pData.ProcessDefId}#${pData.ProcessType}`
      ),
      1
    );

    let indexNo;
    let temp2 = JSON.parse(JSON.stringify(tabInfoAtTop));

    temp2.forEach((item, index) => {
      if (item.ProcessDefId === pData.ProcessDefId) {
        indexNo = index;
      }
    });
    temp2.splice(indexNo, 1);
    props.openProcessClick("", "", "", "", "");
    setLocalOpenProcessesArr(temp);
    setLocalArrProcessesData([...localArrProcessesData]);
    settabInfoAtTop(temp2);
    backToProcessDesignerHome();
  };

  const ActiveClickedTab = (data) => {
    let temp = JSON.parse(JSON.stringify(tabInfoAtTop));
    temp.forEach((item) => {
      if (item.ProcessDefId === data.ProcessDefId) {
        item.isActive = true;
      } else item.isActive = false;
    });

    settabInfoAtTop(temp);
  };

  //setting process designer tab not active when current data is loaded
  // useEffect(() => {
  //   if (localLoadedProcessData !== null) {
  //     setisProcessDesignerTabActive(false);
  //   } else {
  //     setisProcessDesignerTabActive(true);
  //   }
  // }, [localLoadedProcessData]);

  return (
    <div
      className="AppHeader"
      style={{ direction: `${t("HTML_DIR")}`, height: APP_HEADER_HEIGHT }}
    >
      <div className="headerLogoName">
        <img src={src} alt={t("img")} className="newgenLogo" />
        <div className={direction === RTL_DIRECTION ? "vr_rtl" : "vr"}></div>
        <div
          onClick={backToProcessDesignerHome}
          className={
            isProcessDesignerTabActive && localArrProcessesData.length > 0
              ? "title activeTab"
              : "title"
          }
        >
          <p
            className={direction === RTL_DIRECTION ? "heading_rtl" : "heading"}
          >
            {t("ProcessDesigner")}
          </p>
        </div>

        {tabInfoAtTop.length > 0 &&
          tabInfoAtTop.map((data) => {
            return (
              <div
                className={
                  data.isActive && !isProcessDesignerTabActive
                    ? "titleTabs activeTab"
                    : "titleTabs"
                }
              >
                <span style={{ marginTop: "0.8rem" }}>
                  <img
                    src={processIcon}
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                    }}
                    alt="Process Icon"
                  />
                </span>
                <span
                  onClick={() => clickHandler(data)}
                  className="titleTextTabs"
                >
                  {data.ProcessName}{" "}
                  {/*code updated on 30 September 2022 for BugId 116201 */}
                  {localArrProcessesData?.length > 0 &&
                  localArrProcessesData[0]?.ProcessDefId != data.ProcessDefId
                    ? data.VersionNo
                    : null}
                </span>
                <span style={{ marginTop: "0.75rem" }}>
                  <CloseIcon
                    onClick={() => deleteProcessData(data)}
                    style={{
                      opacity: "0.2",
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                </span>
              </div>
            );
          })}
      </div>
      <div className="flex alignCenter">
        {/* <SearchBox
        searchIconAlign="right"
        placeholder={t("search")}
        style={{
          background: "#FFF 0% 0% no-repeat padding-box",
          border: "1px solid #E6E6E6",
          borderRadius: "2px",
          opacity: "1",
          width: "209px",
          height: "24px",
          top: "12px",
          display:"none",
          marginLeft: direction == "rtl" ? "" : "auto",
          marginRight: direction == "rtl" ? "auto" : "",
        }}
      /> */}
        <img
          src={QuestionMarkIcon}
          className="AppHeaderIcon"
          alt="Question Mark"
        />
        {/*<div className="collabTypeLogo_Home" style={{ background: "#F4A43C" }}>
          <span className="collabName_Home">SD</span>
    </div>*/}
        <div style={{ marginLeft: "auto", display: "flex" }}>
          {/* <img src={ActivityStream} alt="" className="headerIcons" />
        <img src={Chat} alt="" className="headerIcons1" />
        <img src={Notifications} alt="" className="headerIcons1" /> */}

          <div className="relative">
            <img
              src={UserProfileImage}
              alt=""
              onClick={() => {
                setShowUserProfile(true);
              }}
              className="userIcons"
            />
            {showUserProfile && (
              <ClickAwayListener onClickAway={() => setShowUserProfile(false)}>
                <div className="userProfileDiv">
                  <div className="userProfileDetailsMainDiv">
                    <p className="userProfileContainer">
                      <span>
                        <img
                          src={UserProfileImage}
                          alt=""
                          className="userProfileImage"
                        />
                      </span>
                      <span className="userName">{username}</span>
                    </p>
                  </div>
                  <div className="userProfileSubDiv">
                    <p className="userProfileHeading">{t("cabinetDetails")}</p>
                    <p className="iconContainer">
                      <span>
                        <CabinetIcon className="profileIcons" />
                      </span>
                      <span>{cabinet}</span>
                    </p>
                  </div>
                  {/**
                 *  <Typography className={classes.info}>
                Last login time:{" "}
                {userArr &&
                  userArr[0]?.authUser?.lastLoginTime &&
                  moment(
                    userArr[0]?.authUser?.lastLoginTime,
                    "DD-MM-yyyy HH:mm:ss"
                  ).format("DD MMM YYYY, hh:mm A")}
              </Typography>
                 */}
                  <div className="userProfileOptDiv">
                    <p className="timeInfo">
                      Last login time:{" "}
                      {lastLoginTime &&
                        moment(lastLoginTime, "yyyy-MM-DD HH:mm:ss").format(
                          "DD MMM YYYY, hh:mm A"
                        )}
                    </p>
                  </div>
                  <div className="userProfileOptDiv">
                    <p
                      className="iconContainer"
                      // onClick={() => logoutHandler()}
                      onClick={logoutAlert}
                    >
                      <span>
                        <LogoutIcon className="profileIcons" />
                      </span>
                      {isLogoutLoading && (
                        <span>
                          <CircularProgress
                            color="#606060"
                            style={{
                              height: "1.5rem",
                              width: "1.5rem",
                              marginRight: ".5rem",
                            }}
                          ></CircularProgress>
                        </span>
                      )}
                      <span>{t("Logout")}</span>
                    </p>
                  </div>
                </div>
              </ClickAwayListener>
            )}
          </div>
        </div>
      </div>

      {isLogout ? (
        <Modal
          show={isLogout}
          style={{
            top: "30%",
            left: "32.5%",
            width: "35%",
            boxShadow: "0px 3px 6px #00000029",
            padding: "0",
          }}
          modalClosed={() => setIsLogout(false)}
          children={
            <DialogBox closeAlert={closeAlert} logoutHandler={logoutHandler} />
          }
        />
      ) : null}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    openProcessClick: (id, name, type, version, processName) =>
      dispatch(
        actionCreators.openProcessClick(id, name, type, version, processName)
      ),
    openTemplate: (id, name, flag) =>
      dispatch(actionCreators.openTemplate(id, name, flag)),
  };
};

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    openProcessVersion: state.openProcessClick.selectedVersion,
    templateId: state.openTemplateReducer.templateId,
    templateName: state.openTemplateReducer.templateName,
    openTemplateFlag: state.openTemplateReducer.openFlag,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
