import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SearchBox from "../../../UI/Search Component";
import SortButton from "../../../UI/SortingModal/Modal";
import FilterImage from "../../../assets/ProcessView/PT_Sorting.svg";
import TableData from "../../../UI/ProjectTableData/TableData";
import FileIcon from "../../../assets/HomePage/processIcon.svg";
import styles from "./template.module.css";
import arabicStyles from "./templateArabicStyles.module.css";
import {
  RTL_DIRECTION,
  SYSTEM_DEFINED_SCOPE,
} from "../../../Constants/appConstants";
import Modal from "../../../UI/Modal/Modal.js";
import AddCategoryModal from "./AddCategoryModal";
import processIcon from "../../../assets/HomePage/templateIcon.svg";
import { InfoOutlined, MoreVertOutlined } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import MortVertModal from "../../../UI/ActivityModal/Modal";
import LockIcon from "@material-ui/icons/Lock";
import DeleteModal from "./DeleteModal";
import RenameModal from "./RenameModal";

function CategoryListView(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [categoryArr, setCategoryArr] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [action, setAction] = useState(null);

  const TemplateTooltip = withStyles((theme) => ({
    tooltip: {
      background: "#FFFFFF 0% 0% no-repeat padding-box",
      boxShadow: "0px 3px 6px #00000029",
      border: "1px solid #70707075",
      fontSize:"var(--base_text_font_size)",
      fontWeight:"400 !important",
      letterSpacing: "0px",
      color: "#000000",
      transform: "translate3d(0px, -0.25rem, 0px) !important",
    },
    arrow: {
      "&:before": {
        backgroundColor: "#FFFFFF !important",
        border: "1px solid #70707075 !important",
        zIndex: "100",
      },
    },
  }))(Tooltip);

  const TemplateCountTooltip = withStyles((theme) => ({
    tooltip: {
      background: "#FFFFFF 0% 0% no-repeat padding-box",
      boxShadow: "0px 3px 6px #00000029",
      fontSize:"var(--base_text_font_size)",
      border: "1px solid #70707075",
      letterSpacing: "0px",
      fontWeight:"400 !important",
      color: "#000000",
      transform: "translate3d(0px, -0.25rem, 0px) !important",
      width: "11vw",
    },
    arrow: {
      "&:before": {
        backgroundColor: "#FFFFFF !important",
        border: "1px solid #70707075 !important",
        zIndex: "100",
      },
    },
  }))(Tooltip);

  const getActionName = (actionName, category) => {
    setSelectedCategory(category);
    setAction(actionName);
  };

  useEffect(() => {
    if (props.categoryList) {
      setCategoryArr(props.categoryList);
    }
  }, [props.categoryList]);

  const headCells = [
    {
      id: "fileIcon",
      styleTdCell: {
        minWidth: "0px",
        width: "2vw",
        textAlign: direction === RTL_DIRECTION ? "left" : "right",
      },
    },
    {
      id: "categoryName",
      styleTdCell: { width: "12vw", height: "30px" },
    },
    {
      id: "categoryDesc",
      styleTdCell: { width: "0.5vw", height: "30px" },
    },
    {
      id: "categoryTemplateCount",
      styleTdCell: { width: "1vw", height: "30px" },
    },
    {
      id: "categoryExtras",
      styleTdCell: { width: "0.5vw", height: "30px" },
    },
  ];

  const onSearchSubmit = (searchVal) => {
    let arr = [];
    props.categoryList?.forEach((elem) => {
      if (elem.CategoryName.toLowerCase().includes(searchVal.trim())) {
        arr.push(elem);
      }
    });
    setCategoryArr(arr);
  };

  const clearResult = () => {
    setCategoryArr(props.categoryList);
  };

  const sortSelection = (selection) => {
    // sort alphabetically
    if (selection === t("alphabeticalOrder")) {
      let localArr = [...categoryArr];
      localArr.sort((a, b) => {
        return a.CategoryName.toLowerCase() < b.CategoryName.toLowerCase()
          ? -1
          : 1;
      });
      setCategoryArr(localArr);
    }
    //sort on basis of number of templates
    else if (selection === t("noOfTemplates")) {
      let localArr = [...categoryArr];
      localArr.sort((a, b) => {
        if (a.Templates && b.Templates) {
          return b.Templates.length - a.Templates.length;
        } else if (a.Templates) {
          return 0 - a.Templates.length;
        } else if (b.Templates) {
          return b.Templates.length - 0;
        } else {
          return 0;
        }
      });
      setCategoryArr(localArr);
    }
  };

  let rows = categoryArr?.map((category) => ({
    rowId: category.CategoryId,
    fileIcon: <img src={FileIcon} style={{ marginTop: "4px" }}></img>,
    categoryDesc:
      category.Description?.trim() !== "" ? (
        <TemplateTooltip
          arrow
          title={category.Description}
          placement={
            direction === RTL_DIRECTION ? "bottom-end" : "bottom-start"
          }
        >
          <InfoOutlined className={styles.infoIcon} />
        </TemplateTooltip>
      ) : (
        ""
      ),
    categoryName: (
      <div className={styles.categoryName}>
        {category.CategoryName}
        {category.CategoryScope === SYSTEM_DEFINED_SCOPE ? (
          <TemplateTooltip
            arrow
            title={t("predefinedCategory")}
            placement={
              direction === RTL_DIRECTION ? "bottom-end" : "bottom-start"
            }
          >
            <LockIcon className={styles.categoryPredefinedIcon} />
          </TemplateTooltip>
        ) : null}
      </div>
    ),
    categoryTemplateCount: (
      <TemplateCountTooltip
        arrow
        title={
          category.Templates?.length > 0
            ? category.Templates.length === 1
              ? `${category.Templates.length} ${t("singleTemplateAvailable")}`
              : `${category.Templates.length} ${t("multipleTemplateAvailable")}`
            : t("noTemplateAvailable")
        }
        placement="bottom"
      >
        <div className={styles.templateCount}>
          <img src={processIcon} className={styles.templateLogo} />
          <span>{category.Templates ? category.Templates.length : 0}</span>
        </div>
      </TemplateCountTooltip>
    ),
    categoryExtras:
      category.CategoryScope === SYSTEM_DEFINED_SCOPE ? null : (
        <MortVertModal
          backDrop={false}
          getActionName={(actionName) => getActionName(actionName, category)}
          modalPaper={styles.moreVertCategoryModal}
          sortByDiv={styles.moreVertModalDiv}
          modalDiv={styles.moreVertDiv}
          sortByDiv_arabic="sortByDiv_arabicActivity"
          oneSortOption={styles.moreVertModalOption}
          showTickIcon={false}
          sortSectionOne={[t("edit"), t("Rename"), t("delete")]}
          buttonToOpenModal={
            <MoreVertOutlined className={styles.moreVertIcon} />
          }
          dividerLine="dividerLineActivity"
          isArabic={direction === RTL_DIRECTION}
          hideRelative={true}
        />
      ),
  }));

  return (
    <React.Fragment>
      <div className={styles.templateSearchHeader}>
        <div className={styles.templateHeadingArea}>
          <p className={styles.templateHeading}>
            {t("categories")} ({categoryArr ? categoryArr.length : 0})
          </p>
          <p
            className={styles.templateHeadingPlusBtn}
            onClick={() => {
              setAction(t("add"));
              setSelectedCategory(null);
            }}
          >
            +
          </p>
        </div>
        <div className={styles.searchBoxArea}>
          <div
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.searchBox
                : styles.searchBox
            }
          >
            <SearchBox
              width="100%"
              onSearchChange={onSearchSubmit}
              clearSearchResult={clearResult}
              name="search"
              placeholder={t("search")}
            />
          </div>
          <SortButton
            backDrop={true}
            buttonToOpenModal={
              <div className="filterButton1">
                <img src={FilterImage} style={{ width: "100%" }} />
              </div>
            }
            showTickIcon={true}
            getActionName={sortSelection}
            sortBy={t("sortBy")}
            sortSectionOne={[t("alphabeticalOrder"), t("noOfTemplates")]}
            modalPaper={styles.categoryFilterBtn}
            isArabic={direction === RTL_DIRECTION}
          />
        </div>
      </div>
      <div className={styles.templateTable}>
        <TableData
          extendHeight={true}
          hideHeader={true}
          defaultScreen={
            <div className={styles.noRecordDiv}>{t("noRecords")}</div>
          }
          selectionPossible={true}
          divider={false}
          tableHead={headCells}
          getSelectedRow={props.setSelectedCategory}
          rows={rows}
          noClickOnRow={true}
          clickableHeadCell={[
            "fileIcon",
            "categoryName",
            "categoryDesc",
            "categoryTemplateCount",
          ]}
        />
      </div>
      {/*code edited on 21 June 2022 for BugId 111115*/}
      {action === t("edit") || action === t("add") ? (
        <Modal
          show={action === t("edit") || action === t("add")}
          style={{
            width: "28vw",
            left: "40%",
            top: "25%",
            padding: "0",
          }}
          modalClosed={() => setAction(null)}
          children={
            <AddCategoryModal
              categoryList={props.categoryList}
              setCategoryList={props.setCategoryList}
              setModalClosed={() => setAction(null)}
              categoryToBeEdited={selectedCategory}
            />
          }
        />
      ) : null}
      {action === t("delete") ? (
        <Modal
          show={action === t("delete")}
          style={{
            width: "30vw",
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
              category={true}
              elemToBeDeleted={selectedCategory}
            />
          }
        />
      ) : null}
      {action === t("Rename") ? (
        <Modal
          show={action === t("Rename")}
          style={{
            width: "30vw",
            height: "11.5rem",
            left: "37%",
            top: "25%",
            padding: "0",
          }}
          modalClosed={() => setAction(null)}
          children={
            <RenameModal
              categoryList={props.categoryList}
              setCategoryList={props.setCategoryList}
              setModalClosed={() => setAction(null)}
              category={true}
              elemToBeDeleted={selectedCategory}
            />
          }
        />
      ) : null}
    </React.Fragment>
  );
}
export default CategoryListView;
