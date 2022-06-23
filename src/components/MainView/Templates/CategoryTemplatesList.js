import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SearchBox from "../../../UI/Search Component";
import SortButton from "../../../UI/SortingModal/Modal";
import FilterImage from "../../../assets/ProcessView/SortIcon.svg";
import styles from "./template.module.css";
import arabicStyles from "./templateArabicStyles.module.css";
import {
  APP_HEADER_HEIGHT,
  PREVIOUS_PAGE_CREATE_FROM_TEMPLATE,
  RTL_DIRECTION,
} from "../../../Constants/appConstants";
import MenuIcon from "@material-ui/icons/Menu";
import AppsIcon from "@material-ui/icons/Apps";
import {
  TEMPLATE_GRID_VIEW,
  TEMPLATE_LIST_VIEW,
} from "../../../Constants/appConstants";
import ProcessCreation from "../../../UI/ProcessCreation";
import Modal from "../../../UI/Modal/Modal.js";
import TemplateListView from "./TemplateListView";
import TemplateGridView from "./TemplateGridView";
import NoTemplateScreen from "./NoTemplateScreen";
import * as actionCreators from "../../../redux-store/actions/processView/actions";
import * as actionCreators_template from "../../../redux-store/actions/Template";
import { connect } from "react-redux";
import DeleteModal from "./DeleteModal";

function CategoryTemplatesList(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [view, setView] = useState(TEMPLATE_LIST_VIEW);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateList, setTemplateList] = useState([]);
  const [actedTemplate, setActedTemplate] = useState(null);
  const [action, setAction] = useState(null);

  useEffect(() => {
    if (props.selectedCategoryDetails?.Templates) {
      setTemplateList(props.selectedCategoryDetails.Templates);
      if (props.templateView) {
        //to set the previous view of templates, before preview button was clicked
        setView(props.templateView);
      }
      if (props.getTemplatePage === PREVIOUS_PAGE_CREATE_FROM_TEMPLATE) {
        //this means the preview button was clicked inside the createProcess modal
        setShowTemplateModal(true);
      }
    }
  }, [props.selectedCategoryDetails]);

  const onSearchSubmit = (searchVal) => {
    //search function for templates
    let arr = [];
    props.selectedCategoryDetails.Templates?.forEach((elem) => {
      if (elem.Name.toLowerCase().includes(searchVal.trim())) {
        arr.push(elem);
      }
    });
    setTemplateList(arr);
  };

  const clearResult = () => {
    //clear the search result
    setTemplateList(props.selectedCategoryDetails.Templates);
  };

  const sortSelection = (selection) => {
    // sort alphabetically
    if (selection === t("alphabeticalOrder")) {
      let localArr = [...templateList];
      localArr.sort((a, b) => {
        return a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 1;
      });
      setTemplateList(localArr);
    }
    //sort on basis of latest creation date and time
    else if (selection === t("recentlyCreated")) {
      let localArr = [...templateList];
      localArr.sort((a, b) => {
        return new Date(b.CreationDate) - new Date(a.CreationDate) === 0
          ? b.CreationTime.localeCompare(a.CreationTime)
          : new Date(b.CreationDate) - new Date(a.CreationDate);
      });
      setTemplateList(localArr);
    }
    //sort on basis of most used template
    else if (selection === t("mostUsed")) {
      let localArr = [...templateList];
      localArr.sort((a, b) => {
        return b.UsageCount - a.UsageCount;
      });
      setTemplateList(localArr);
    }
  };

  return (
    <div className={styles.categoryTemplatesList}>
      {props.selectedCategoryDetails?.Templates?.length > 0 ? (
        <React.Fragment>
          <div className={styles.templateFilterArea}>
            <div className={styles.searchDiv}>
              <div
                className={
                  direction === RTL_DIRECTION
                    ? arabicStyles.searchBox
                    : styles.searchBox
                }
              >
                <SearchBox
                  width="16vw"
                  onSearchChange={onSearchSubmit}
                  clearSearchResult={clearResult}
                  name="search"
                  placeholder={t("search")}
                />
              </div>
              <SortButton
                backDrop={true}
                buttonToOpenModal={
                  <button className="filterButton" type="button">
                    <img src={FilterImage} />
                  </button>
                }
                getActionName={sortSelection}
                showTickIcon={true}
                sortBy={t("sortBy")}
                sortSectionOne={[
                  t("alphabeticalOrder"),
                  t("recentlyCreated"),
                  t("mostUsed"),
                ]}
                modalPaper={styles.categoryFilterBtn}
                isArabic={direction === RTL_DIRECTION}
              />
            </div>
            <div>
              <button
                onClick={() => setView(TEMPLATE_LIST_VIEW)}
                className={
                  view === TEMPLATE_LIST_VIEW
                    ? styles.selectedListViewBtn
                    : styles.listViewBtn
                }
                title={t("listView")}
              >
                <MenuIcon
                  fontSize="small"
                  style={
                    view === TEMPLATE_LIST_VIEW
                      ? { color: "black" }
                      : { color: "#C4C4C4" }
                  }
                />
              </button>
              <button
                onClick={() => setView(TEMPLATE_GRID_VIEW)}
                className={
                  view === TEMPLATE_GRID_VIEW
                    ? styles.selectedListViewBtn
                    : styles.listViewBtn
                }
                title={t("tileView")}
              >
                <AppsIcon
                  fontSize="small"
                  style={
                    view === TEMPLATE_GRID_VIEW
                      ? { color: "black" }
                      : { color: "#C4C4C4" }
                  }
                />
              </button>
            </div>
          </div>
          <div className={styles.templateListTable}>
            {view === TEMPLATE_LIST_VIEW ? (
              <TemplateListView
                createProcessFunc={() => {
                  setShowTemplateModal(true);
                  props.setTemplateDetails(
                    null,
                    null,
                    false,
                    null,
                    null,
                    false,
                    "",
                    []
                  );
                  props.setSelectedProject(null, null);
                }}
                setSelectedTemplate={setSelectedTemplate}
                templateList={templateList}
                category={props.selectedCategoryDetails}
                setActedTemplate={setActedTemplate}
                setAction={setAction}
              />
            ) : (
              <TemplateGridView
                createProcessFunc={() => {
                  setShowTemplateModal(true);
                  props.setTemplateDetails(
                    null,
                    null,
                    false,
                    null,
                    null,
                    false,
                    "",
                    []
                  );
                  props.setSelectedProject(null, null);
                }}
                setSelectedTemplate={setSelectedTemplate}
                templateList={templateList}
                category={props.selectedCategoryDetails}
                setActedTemplate={setActedTemplate}
                setAction={setAction}
              />
            )}
          </div>
        </React.Fragment>
      ) : (
        <NoTemplateScreen />
      )}
      {showTemplateModal ? (
        <Modal
          show={showTemplateModal}
          style={{
            width: "100vw",
            height: `calc(100% - ${APP_HEADER_HEIGHT})`,
            left: "0",
            top: `${APP_HEADER_HEIGHT}`,
            padding: "0",
          }}
          hideBackdrop={true}
          modalClosed={() => setShowTemplateModal(false)}
          children={
            <ProcessCreation
              moveBackFunction={() => setShowTemplateModal(false)}
              selectedTemplate={selectedTemplate}
              backBtnLabel="backToTemplatesPage"
              templatePage={PREVIOUS_PAGE_CREATE_FROM_TEMPLATE}
              category={props.selectedCategoryDetails}
              view={view}
            />
          }
        />
      ) : null}
      {action === t("delete") ? (
        <Modal
          show={action === t("delete")}
          style={{
            width: "30vw",
            height: "11.5rem",
            left: "37%",
            top: "25%",
            padding: "0",
          }}
          modalClosed={() => setAction(null)}
          children={
            <DeleteModal
              categoryList={props.categoryList}
              setCategoryList={props.setCategoryList}
              setModalClosed={() => setAction(null)}
              category={false}
              elemToBeDeleted={actedTemplate}
              parentElem={props.selectedCategoryDetails}
            />
          }
        />
      ) : null}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedProject: (id, name) => {
      dispatch(actionCreators.selectedProject(id, name));
    },
    setTemplateDetails: (
      category,
      view,
      createBtnClick,
      template,
      projectName,
      isProjectNameConstant,
      processName,
      files
    ) =>
      dispatch(
        actionCreators_template.setTemplateDetails(
          category,
          view,
          createBtnClick,
          template,
          projectName,
          isProjectNameConstant,
          processName,
          files
        )
      ),
  };
};

const mapStateToProps = (state) => {
  return {
    templateView: state.templateReducer.template_view,
    getTemplatePage: state.templateReducer.template_page,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryTemplatesList);
