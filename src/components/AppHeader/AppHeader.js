import React, { useEffect } from "react";
import "./AppHeader.css";
import src from "../../assets/Header/NewgenLogo.svg";
import { useTranslation } from "react-i18next";
// import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import SearchBox from "../../UI/Search Component/index";
import { store, useGlobalState } from "state-pool";
import { useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
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

const AppHeader = (props) => {
  let { t } = useTranslation();
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

  const [tabInfoAtTop, settabInfoAtTop] = React.useState([]);

  useEffect(() => {
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
      if (tabInfoAtTop.length > 0 && temp.ProcessDefId !== "") {
        let temp2 = JSON.parse(JSON.stringify(tabInfoAtTop));

        if (!temp2.some((el) => el.ProcessDefId === temp.ProcessDefId)) {
          temp2.map((item) => (item.isActive = false));
          temp2.push(temp);
          settabInfoAtTop(temp2);
        } else return;
      } else settabInfoAtTop((prev) => [...prev, temp]);

      temp = {
        ProcessDefId: "",
        ProcessName: "",
        ProcessType: "",
        ProcessVariantType: "",
        ProjectName: "",
        VersionNo: "",
        isActive: false,
      };
    }
  }, [
    props.openProcessID,
    props.openProcessName,
    props.openProcessType,
    props.openProcessVersion,
  ]);

  useEffect(() => {
    if (tabInfoAtTop.length > 0) {
      setisProcessDesignerTabActive(false);
    }
  }, [tabInfoAtTop, localLoadedProcessData]);

  const history = useHistory();

  useEffect(() => {
    if (tabInfoAtTop.length === 0) {
      setisProcessDesignerTabActive(true);
    }
  }, [tabInfoAtTop]);

  //click handler for process data tabs
  const clickHandler = (data) => {
    ActiveClickedTab(data);
    //setlocalLoadedProcessData(null);
    if (data.ProcessVariantType === TEMPLATE_VARIANT_TYPE) {
      axios
        .get(
          SERVER_URL +
            ENDPOINT_OPENTEMPLATE +
            "/" +
            data.TemplateId +
            "/" +
            data.TemplateName
        )
        .then((res) => {
          if (res.data.Status === 0) {
            setlocalLoadedProcessData(res.data.OpenProcess);
          }
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
          }
        });
    }
    props.openProcessClick(
      data.ProcessDefId,
      data.ProjectName,
      data.ProcessType,
      data.VersionNo,
      data.ProcessName
    );
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
  useEffect(() => {
    if (localLoadedProcessData !== null) {
      setisProcessDesignerTabActive(false);
    } else {
      setisProcessDesignerTabActive(true);
    }
  }, [localLoadedProcessData]);

  return (
    <div
      className="AppHeader"
      style={{ direction: `${t("HTML_DIR")}`, height: APP_HEADER_HEIGHT }}
    >
      <div className="headerLogoName">
        <img
          src={src}
          alt={t("img")}
          className={
            direction === RTL_DIRECTION ? "newgenLogo_rtl" : "newgenLogo"
          }
        />
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
            <span className="ibps ">{t("iBPS")}</span> {t("ProcessDesigner")}
          </p>
        </div>
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
              <img
                src={processIcon}
                style={{
                  height: "17.2px",
                  width: "18px",
                  marginLeft: direction === RTL_DIRECTION ? "0" : "0.5rem",
                  marginRight: direction === RTL_DIRECTION ? "0.5rem" : "0",
                  marginBottom: "4px",
                }}
                alt="Process Icon"
              />
              <div onClick={() => clickHandler(data)} className="titleTextTabs">
                {data.ProcessName}{" "}
              </div>{" "}
              <CloseIcon
                onClick={() => deleteProcessData(data)}
                style={{ opacity: "0.2", marginBottom: "2px" }}
                fontSize="small"
              />
            </div>
          );
        })}

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
        style={{
          marginLeft: direction === RTL_DIRECTION ? "0" : "auto",
          marginRight: direction === RTL_DIRECTION ? "auto" : "0",
        }}
        alt="Question Mark"
      />
      <div
        className={
          direction === RTL_DIRECTION
            ? "collabTypeLogo_Home_rtl"
            : "collabTypeLogo_Home"
        }
        style={{ background: "#F4A43C" }}
      >
        <span className="collabName_Home">SD</span>
      </div>
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
    templateName: state.openTemplateReducer.templateName,
    openTemplateFlag: state.openTemplateReducer.openFlag,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
