import React, { useState, useEffect } from "react";
import "./ProcessesView.css";
import Processes from "./Processes/Processes";
import Projects from "./Projects/Projects";
import NoProcessJourney from "./Processes/NoProjectsOrProcesses/NoProcessJourney";
import axios from "axios";
import {
  ENDPOINT_GET_ALLDRAFTPROCESSLIST,
  ENDPOINT_GET_ALLDEPLOYEDPROCESSLIST,
  ENDPOINT_GETPROJECTLIST_DRAFTS,
  ENDPOINT_GETPROJECTLIST_DEPLOYED,
  SERVER_URL,
} from "../../../Constants/appConstants";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect, useDispatch, useSelector } from "react-redux";
import { setImportExportVal } from "../../../redux-store/slices/ImportExportSlice";
import Tabs from "../../../UI/Tab/Tab";
import {
  projectCreationVal,
  setProjectCreation,
} from "../../../redux-store/slices/projectCreationSlice";

function ProjectsAndProcesses(props) {
  const [selectedProcessCode, setSelectedProcessCode] = useState();
  const [selectedProcessCount, setSelectedProcessCount] = useState();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectDesc, setSelectedProjectDesc] = useState();
  const [processesPerProject, setProcessesPerProject] = useState([]);
  const [selectedProcessTile, setSelectedProcessTile] = useState(-1);
  const [projectList, setProjectList] = useState({
    Status: 0,
    Message: "",
    Projects: [],
  });
  const [spinnerProcessList, setspinnerProcessList] = useState(true);
  const [spinner, setSpinner] = useState(true);
  const [value, setValue] = useState(0);
  const projectCreatedVal = useSelector(projectCreationVal);
  const dispatch = useDispatch();

  let selectedProjectName = null;
  let selectedProjectTotalProcessCount = null;

  projectList?.Projects?.forEach((project) => {
    if (selectedProjectId === project.ProjectId) {
      selectedProjectName = project.ProjectName;
      selectedProjectTotalProcessCount = project.TotalProcessCount;
    }
  });
  const processTypeList = props.processTypeList;
  const pinnedDataList = props.pinnedDataList;
  let selectedTabAtNav = props.selectedTabAtNavPanel;

  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          `${
            value === 0
              ? ENDPOINT_GETPROJECTLIST_DRAFTS
              : ENDPOINT_GETPROJECTLIST_DEPLOYED
          }`
      )
      .then((res) => {
        if (res.data.Status === 0) {
          let data = res.data;
          setProjectList(data);
          if (data?.Projects?.length > 0) {
            setSelectedProjectId(data.Projects[0]?.ProjectId);
          } else {
            // code added on 22 June 2022 for BugId 111210
            getSelectedProcessTile(value === 0 ? "L" : "R", 0);
            setSelectedProcessTile(0);
            setSelectedProjectId(null);
          }
          setSpinner(false);
          dispatch(setImportExportVal({ ProjectList: res.data.Projects }));
        } else {
          setSpinner(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setSpinner(false);
      });
  }, [value]);

  //code edited on 28 July 2022 for BugId 110133
  useEffect(() => {
    if (projectCreatedVal.projectCreated) {
      axios
        .get(
          SERVER_URL +
            `${
              value === 0
                ? ENDPOINT_GETPROJECTLIST_DRAFTS
                : ENDPOINT_GETPROJECTLIST_DEPLOYED
            }`
        )
        .then((res) => {
          if (res.data.Status === 0) {
            let data = res.data;
            setProjectList(data);
            if (data?.Projects?.length > 0) {
              if (projectCreatedVal.projectCreated) {
                let selectedId = null;
                data?.Projects?.forEach((el) => {
                  if (el.ProjectName === projectCreatedVal.projectName) {
                    selectedId = el.ProjectId;
                  }
                });
                setSelectedProjectId(selectedId);
                dispatch(
                  setProjectCreation({
                    projectCreated: false,
                    projectName: null,
                    projectDesc: null,
                  })
                );
              }
            }
            setSpinner(false);
            dispatch(setImportExportVal({ ProjectList: res.data.Projects }));
          } else {
            setSpinner(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setSpinner(false);
        });
    }
  }, [projectCreatedVal.projectCreated]);

  useEffect(() => {
    setspinnerProcessList(true);
    if (selectedProjectId) {
      axios
        .get(
          SERVER_URL +
            `/getprocesslist/${value === 0 ? "L" : "R"}/` +
            selectedProjectId
        )
        .then((res) => {
          if (res.status === 200) {
            setspinnerProcessList(false);
            setProcessesPerProject(res.data.Processes);
            if (value == 0) {
              localStorage.setItem("draftProcesses", { ...res.data.Processes });
            } else if (value == 1) {
              localStorage.setItem("deployedProcesses", {
                ...res.data.Processes,
              });
            }
          }
        })
        .catch((err) => console.log(err));
    } else if (selectedProcessCode) {
      axios
        .get(SERVER_URL + `/getprocesslist/${selectedProcessCode}/-1`)
        .then((res) => {
          if (res.status === 200) {
            setProcessesPerProject(res.data.Processes);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [selectedProjectId]);

  useEffect(() => {
    setSelectedProjectId(null);
    setSelectedProcessCode(
      props.clickedProcessTileAtHome
        ? props.clickedProcessTileAtHome.processTileCode
        : "L"
    );
  }, [props.selectedTabAtNavPanel]);

  let pinnedProcessesPerProject = [];

  const getSelectedProcessTile = (
    selectedProcessTileCode,
    selectedProcessTileCount
  ) => {
    setSelectedProcessCode(selectedProcessTileCode);
    setSelectedProcessCount(selectedProcessTileCount);
  };

  return spinner ? (
    <CircularProgress style={{ marginTop: "40vh", marginLeft: "50%" }} />
  ) : (
    <React.Fragment>
      <Tabs
        tabType="processSubTab"
        tabContentStyle="processSubTabContentStyle"
        tabBarStyle="processSubTabBarStyle"
        oneTabStyle="processSubOneTabStyleProcessType"
        tabStyling="processTypeViewTabs"
        TabNames={["DRAFTS", "DEPLOYED"]}
        TabElement={[]}
        setValue={(val) => {
          setValue(val);
        }}
        style={{ width: "20vw" }}
      />
      <Projects
        setSelectedProjectDesc={setSelectedProjectDesc}
        getSelectedProcessTile={getSelectedProcessTile}
        processTypeList={
          value == 0
            ? processTypeList?.filter((el) => {
                return el.ProcessType == "L";
              })
            : processTypeList?.filter((el) => {
                return el.ProcessType == "R" || el.ProcessType == "E";
              })
        }
        projectList={projectList.Projects}
        tabValue={value}
        selectedProcessTile={selectedProcessTile}
        setSelectedProjectId={setSelectedProjectId}
        defaultProjectId={selectedProjectId}
      />
      <Processes
        spinnerProcess={spinnerProcessList}
        projectList={projectList.Projects}
        setProjectList={setProjectList}
        selectedProjectDesc={selectedProjectDesc}
        selectedProjectId={selectedProjectId}
        allProcessesPerProject={processesPerProject}
        selectedProcessCode={selectedProcessCode}
        setSelectedProcessCode={setSelectedProcessCode}
        selectedProcessCount={selectedProcessCount}
        setSelectedProcessCount={setSelectedProcessCount}
        pinnedDataList={pinnedDataList}
        pinnedProcessesPerProject={pinnedProcessesPerProject}
        selectedProjectTotalProcessCount={selectedProjectTotalProcessCount}
        selectedProject={selectedProjectName}
        processTypeList={processTypeList}
        selectedTabAtNav={selectedTabAtNav}
        tabValue={value}
      />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    processTypeList: state.processTypesReducer.tileData,
    pinnedDataList: state.processTypesReducer.pinnedData,
    defaultProcessTileIndex:
      state.defaultProcessTileReducer.defaultProcessTileIndex,
    clickedProcessTileAtHome:
      state.clickedProcessTileReducer.selectedProcessTile,
    selectedTabAtNavPanel: state.selectedTabAtNavReducer.selectedTab,
  };
};

export default connect(mapStateToProps, null)(ProjectsAndProcesses);
