import React, { useState, useRef, useEffect } from "react";
import "./projects.css";
import ProcessTiles from "../ProcessTiles/ProcessTiles";
import TableData from "../../../../UI/ProjectTableData/TableData";
import { useTranslation } from "react-i18next";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FileIcon from "../../../../assets/HomePage/processIcon.svg";
import SearchProject from "../../../../UI/Search Component/index";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import OnHoverList from "./onHoverProcesslistPerProject";
import NoProjectScreen from "../Processes/NoProjectsOrProcesses/NoProjectScreen";
import SortButton from "../../../../UI/SortingModal/Modal.js";
import { connect } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import FilterImage from "../../../../assets/ProcessView/PT_Sorting.svg";
import { tileProcess } from "../../../../utility/HomeProcessView/tileProcess.js";
import Modal from "../../../../UI/Modal/Modal.js";
import ProjectCreation from "./ProjectCreation.js";

let useStyles = makeStyles({
  root: {
    fontFamily: "Open Sans , sans-serif",
    fontWeight: "600",
    fontSize: "16px",
  },
  svgIconSmall: {
    fontSize: "1.12rem",
  },
  projectName: {
    fontSize: "13px",
  },
});

function Projects(props) {
  let selectedTileFromHome = props.selectedTile;
  const classes = useStyles();
  let projectHeadRef = useRef(null);
  let parentRef = useRef(null);
  const [showProcessList, setShowProcessList] = useState(-1);
  let [topButton, setTopButton] = useState(false);
  let [selectionOne, setSelectionOne] = useState(0);
  let [selectionTwo, setSelectionTwo] = useState(0);
  let [processType, setProcessType] = useState(null);
  let [searchTerm, setSearchTerm] = useState("");
  // let [processType, setProcessType]= useState((tileProcess(props.processTypeList[props.defaultProcessTileIndex].ProcessType)[1]));
  const [showModal, setShowModal] = useState(null);
  // const [bshowDesc, setbshowDesc] = useState(false);
  // const [modalHeight, setmodalHeight] = useState({ height: "40vh" });

  const CreateProjectHandler = () => {
    setShowModal(true);
  };
  const AddDescp = (showDesc) => {
    // setbshowDesc(showDesc);
  };

  let { t } = useTranslation();
  const headCells = [
    {
      id: "fileIcon",
      label: t("processView.ProcessName"),
      styleTdCell: { minWidth: "0px" },
    },
    {
      id: "projectName",
      label: t("processView.ProcessName"),
      styleTdCell: { width: "75.5%", height: "30px" },
    },
    {
      id: "projectCount",
      label: t("processView.ProcessName"),
      styleTdCell: { width: "17%", height: "30px" },
    },
  ];

  const ProjectTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: "transparent",
      transform: "translate3d(0px, -10px, 0px) !important",
    },
  }))(Tooltip);

  let sortSelectionFunc = (sortSelectionOne, sortSelectionTwo) => {
    setSelectionOne(sortSelectionOne);
    setSelectionTwo(sortSelectionTwo);
  };

  // Sorting of Project List by Name
  // let compareObjectsToAscend=(object1, object2, key)=> {
  //   const obj1 = object1[key].toUpperCase()
  //   const obj2 = object2[key].toUpperCase()
  //   if (obj1 > obj2) {return -1}
  //   if (obj1 < obj2) {return 1}
  //   return 0 }

  //   let compareObjectsToDescend=(object1, object2, key)=> {
  //     const obj1 = object1[key].toUpperCase()
  //     const obj2 = object2[key].toUpperCase()
  //     if (obj1 < obj2) {return -1}
  //     if (obj1 > obj2) {return 1}
  //     return 0 }
  // // let podList= [...props.projectList];
  // let ascendingProjectList = podList.sort((a,b)=> (a.ProjectName < b.ProjectName ? -1 : 1))
  // let descendingProjectList=  podList.sort((a,b)=> (a.ProjectName > b.ProjectName ? -1 : 1))

  // // Sorting of Projects List by Modification Date
  // let oldToNewModifiedList= props.projectList.sort(function(a,b){
  //   return new Date(b.LastModifiedOn) - new Date(a.LastModifiedOn);
  // });
  // let newToOldModifiedList= props.projectList.sort(function(a,b){
  //   return new Date(a.LastModifiedOn) - new Date(b.LastModifiedOn);
  // });

  let projectList = props.projectList ? [...props.projectList] : [];
  if (selectionOne == "2" && selectionTwo == "0") {
    projectList = props.projectList.sort((a, b) =>
      a.ProjectName < b.ProjectName ? -1 : 1
    );
  } else if (selectionOne == "2" && selectionTwo == "1") {
    projectList = props.projectList.sort((a, b) =>
      a.ProjectName > b.ProjectName ? -1 : 1
    );
  }

  let rows = projectList.map((projectData, index) => ({
    rowId: projectData.ProjectId,
    rowData: projectData,
    fileIcon: (
      <img src={FileIcon} style={{ marginTop: "4px", marginLeft: "4px" }}></img>
    ),
    projectDesc: projectData.ProjectDescription,
    projectName: (
      <div className={classes.projectName}>{projectData.ProjectName}</div>
    ),
    projectCount: (
      <ProjectTooltip
        enterDelay={500}
        title={
          <React.Fragment>
            <OnHoverList
              processTypeList={projectData.Processes}
              allProcessesPerProject={props.allProcessesPerProject}
            />
          </React.Fragment>
        }
      >
        <span className="processCount" style={{ paddingLeft: "0.7vw" }}>
          {projectData.TotalProcessCount}
        </span>
      </ProjectTooltip>
    ),
  }));

  const scrollToTop = () => {
    document.querySelector(".projects").scrollTo(0, 0);
    document.querySelector(".backToTopButton").style.display = "none";
    setTopButton(false);
  };

  useEffect(() => {
    parentRef.current.addEventListener("scroll", () => {
      let topHigh = document
        .querySelector(".searchbar_N_Header")
        .getBoundingClientRect().top;
      if (topHigh <= 50) {
        setTopButton(true);
      } // excluded 50px from top which is margin-top for project component
      else setTopButton(false);
    });
  });

  useEffect(()=>{
    setProcessType(null);
  },[props.tabValue])

  let filteredRows = rows?.filter((row) => {
    if (searchTerm == "") {
      return row;
    } else if (
      row.projectName.props.children
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) {
      return row;
    }
  });

  const getSelectedProcessTile = (
    selectedProcessTileCode,
    selectedProcessTileCount,
    selectedProcessTileIndex
  ) => {
    props.getSelectedProcessTile(
      selectedProcessTileCode,
      selectedProcessTileCount,
      selectedProcessTileIndex
    );
    setProcessType(selectedProcessTileCode);
  };

  const onProjectClick = (projectId) => {
    setProcessType(null);
    props.setSelectedProjectId(projectId);
  };

  // let modalHeight = bshowDesc === true ? "80vh" : "40vh";

  return (
    <div
      id="prod"
      className="projects"
      ref={parentRef}
      style={{ direction: `${t("HTML_DIR")}` }}
    >
      <ProcessTiles
        selectedProjectId={!processType}
        setSelectedProjectId={props.setSelectedProjectId}
        selectedTileFromHome={selectedTileFromHome}
        getSelectedProcessTile={getSelectedProcessTile}
        processTypeList={props.processTypeList}
      />
      <div className="searchbar_N_Header" ref={projectHeadRef}>
        <div className="project_Header_Adder">
          <h4 style={{ fontWeight: "600" }}>
            {t("projectList.ProjectHeading")}{" "}
            {`(${props.projectList ? props.projectList.length : 0})`}
          </h4>
          <h1
            style={{ color: "#0072C6" }}
            onClick={() => CreateProjectHandler()}
          >
            +
          </h1>
        </div>
        <div className="searchBarNFilter">
          <div style={{ marginRight: "0.5rem" }}>
            <SearchProject
              setSearchTerm={setSearchTerm}
              placeholder={t("search")}
              width="15vw"
              style={{ marginRight: "6px" }}
            />
          </div>
          <SortButton
            backDrop={true}
            buttonToOpenModal={
              <button className="filterButton" type="button">
                <img src={FilterImage} />
              </button>
            }
            sortSelection={sortSelectionFunc}
            showTickIcon={true}
            modalFromTop="62"
            modalFromLeft="33"
            modalWidth="180"
            sortSectionTwo={[t("NewToOld"), t("OldToNew")]}
            sortOrderOptionsForName={[t("Ascending"), t("Descending")]}
            indexToSwitchSortOptions="2"
            sortBy={t("sortBy")}
            sortOrder={t("sortOrder")}
            sortSectionOne={[
              t("LastModifiedByMe"),
              t("LastModified"),
              t("Name"),
            ]}
            modalPaper="modalPaperProjects"
            isArabic={false}
          />
        </div>
      </div>
      <div className="table">
        <TableData
          setSelectedProjectDesc={props.setSelectedProjectDesc}
          selectionPossible={!processType}
          selectedRow={props.defaultProjectId}
          defaultScreen={<NoProjectScreen />}
          getSelectedRow={onProjectClick}
          updateTablePosition={[]}
          parenrRef={parentRef}
          upperHeaderRef={projectHeadRef}
          extendHeight={true}
          hideHeader={true}
          divider={false}
          tableHead={headCells}
          tabValue={props.tabValue}
          rows={searchTerm == "" ? rows : filteredRows}
        />
      </div>
      {topButton ? (
        <button onClick={scrollToTop} className="backToTopButton">
          <div style={{ display: "flex", alignItems: "center" }}>
            <ExpandLessIcon />
            {t("projectList.BackToTopButtonText")}
          </div>
        </button>
      ) : null}
      {/*modal for projectcreation*/}

      {showModal ? (
        <Modal
          show={showModal !== null}
          style={{
            width: "30vw",
            height: "80vh",
            left: "35%",
            top: "10%",
            padding: "0",
          }}
          modalClosed={() => setShowModal(null)}
          children={
            <ProjectCreation
              setShowModal={setShowModal}
              // AddDescp={AddDescp}
              // setmodalHeight={setmodalHeight}
            />
          }
        />
      ) : null}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    selectedTile: state.clickedProcessTileReducer.selectedProcessTile,
    defaultProcessTileIndex:
      state.defaultProcessTileReducer.defaultProcessTileIndex,
  };
};
export default connect(mapStateToProps)(Projects);
