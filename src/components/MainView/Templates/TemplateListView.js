import React from "react";
import { useTranslation } from "react-i18next";
import TemplateIcon from "../../../assets/ProcessView/ProcessIcon.svg";
import styles from "./template.module.css";
import arabicStyles from "./templateArabicStyles.module.css";
import {
  RTL_DIRECTION,
  SYSTEM_DEFINED_SCOPE,
} from "../../../Constants/appConstants";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import { InfoOutlined, MoreVertOutlined } from "@material-ui/icons";
import MortVertModal from "../../../UI/ActivityModal/Modal";
import * as actionCreators from "../../../redux-store/actions/processView/actions";
import * as actionCreators_template from "../../../redux-store/actions/Template";
import LockIcon from "@material-ui/icons/Lock";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  PREVIOUS_PAGE_LIST,
  TEMPLATE_LIST_VIEW,
} from "../../../Constants/appConstants";

function TemplateListView(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const history = useHistory();

  const TemplateTooltip = withStyles((theme) => ({
    tooltip: {
      background: "#FFFFFF 0% 0% no-repeat padding-box",
      boxShadow: "0px 3px 6px #00000029",
      border: "1px solid #70707075",
      font: "normal normal normal 12px/17px Open Sans",
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

  const getActionName = (actionName, template) => {
    if (actionName === t("open")) {
      previewTemplate(template);
    } else {
      props.setActedTemplate(template);
      props.setAction(actionName);
    }
  };

  const previewTemplate = (template) => {
    props.setTemplatePage(PREVIOUS_PAGE_LIST);
    props.setTemplateDetails(props.category, TEMPLATE_LIST_VIEW);
    props.openTemplate(template.Id, template.Name, true);
    history.push("/process");
  };

  let rowDisplay = props.templateList.map((el) => {
    return (
      <div className={styles.templateListTableRow}>
        <div
          className={styles.templateListTableIcon}
          onClick={() => previewTemplate(el)}
        >
          <img src={TemplateIcon} className={styles.templateIcon} />
        </div>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.templateListTableName
              : styles.templateListTableName
          }
          onClick={() => previewTemplate(el)}
        >
          <span className={styles.templateName}>
            {el.Name}
            {el.Description?.trim() !== "" ? (
              <TemplateTooltip
                arrow
                title={el.Description}
                placement={
                  direction === RTL_DIRECTION ? "bottom-end" : "bottom-start"
                }
              >
                <InfoOutlined
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.templateInfoIcon
                      : styles.templateInfoIcon
                  }
                />
              </TemplateTooltip>
            ) : (
              ""
            )}
            {el.Scope == SYSTEM_DEFINED_SCOPE ? (
              <TemplateTooltip
                arrow
                title={t("predefinedTemplate")}
                placement={
                  direction === RTL_DIRECTION ? "bottom-end" : "bottom-start"
                }
              >
                <LockIcon
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.templatePredefinedIcon
                      : styles.templatePredefinedIcon
                  }
                />
              </TemplateTooltip>
            ) : null}
          </span>
        </div>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.templateListTableCreatedBy
              : styles.templateListTableCreatedBy
          }
          onClick={() => previewTemplate(el)}
        >
          {el.Creator}
          <span className={styles.templateCreationDate}>
            {el.SameDate === "true"
              ? `at ${el.CreatedTime}`
              : `on ${el.CreatedDate} at ${el.CreatedTime}`}
          </span>
        </div>
        <div
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.templateListTableDate
              : styles.templateListTableDate
          }
          onClick={() => previewTemplate(el)}
        >
          {el.AccessedDate?.trim() !== "" ? el.AccessedDate : "-"}
        </div>
        <div
          className={styles.templateListTableUsage}
          onClick={() => previewTemplate(el)}
        >
          {" "}
          {el.UsageCount > 0 ? (
            <span
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.templateUsageCount
                  : styles.templateUsageCount
              }
            >
              {t("usedIn")} {el.UsageCount}{" "}
              {el.UsageCount > 1 ? t("processes") : t("process")}
            </span>
          ) : null}
        </div>
        <div className={styles.templateListTableExtras}>
          <button
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.createProcessBtn
                : styles.createProcessBtn
            }
            onClick={() => {
              props.createProcessFunc();
              props.setSelectedTemplate(el);
            }}
          >
            {t("CreateProcess")}
          </button>
          <MortVertModal
            backDrop={false}
            getActionName={(actionName) => getActionName(actionName, el)}
            modalPaper={
              direction === RTL_DIRECTION
                ? arabicStyles.moreVertTemplateModal
                : styles.moreVertTemplateModal
            }
            modalDiv={styles.moreVertDiv}
            sortByDiv={styles.moreVertModalDiv}
            oneSortOption={styles.moreVertModalOption}
            showTickIcon={false}
            sortSectionOne={
              el.Scope === SYSTEM_DEFINED_SCOPE
                ? [t("open")]
                : [t("open"), t("edit"), t("Rename"), t("delete")]
            }
            buttonToOpenModal={
              <MoreVertOutlined className={styles.moreVertIcon} />
            }
            dividerLine="dividerLineActivity"
            isArabic={direction === RTL_DIRECTION}
            hideRelative={true}
          />
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      {props.templateList?.length > 0 ? (
        <React.Fragment>
          <div className={styles.templateListTableHeader}>
            <div className={styles.templateListTableHeaderIcon}>{""}</div>
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.templateListTableHeaderName
                  : styles.templateListTableHeaderName
              }
            >
              {t("Template")} {t("name")}
            </div>
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.templateListTableHeaderCreatedBy
                  : styles.templateListTableHeaderCreatedBy
              }
            >
              {t("createdBy")}
            </div>
            <div
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.templateListTableHeaderDate
                  : styles.templateListTableHeaderDate
              }
            >
              {t("lastOpenedOn")}
            </div>
            <div className={styles.templateListTableHeaderUsage}>{""}</div>
            <div className={styles.templateListTableHeaderExtras}>{""}</div>
          </div>
          <div className="tableRows">{rowDisplay}</div>
        </React.Fragment>
      ) : (
        <div className={styles.noRecordDiv}>{t("noRecords")}</div>
      )}
    </React.Fragment>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    openTemplate: (id, name, flag) =>
      dispatch(actionCreators.openTemplate(id, name, flag)),
    setTemplatePage: (value) =>
      dispatch(actionCreators_template.storeTemplatePage(value)),
    setTemplateDetails: (category, view, createBtnClick, template) =>
      dispatch(
        actionCreators_template.setTemplateDetails(
          category,
          view,
          createBtnClick,
          template
        )
      ),
  };
};

export default connect(null, mapDispatchToProps)(TemplateListView);
